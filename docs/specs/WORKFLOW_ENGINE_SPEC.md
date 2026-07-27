# Especificación: Workflow Engine DAG + CLI `wabi flow`

**Estado**: SPEC - Listo para implementar
**Prioridad**: MEDIA (Fase 2 del roadmap post-análisis OSS)
**Autor**: Wabi-Sabi / Tyr
**Fecha**: 2026-07-15

---

## 1. Objetivo

Motor de workflows DAG (Directed Acyclic Graph) embebido en Wabi-Sabi,
inspirado en n8n pero local-first y sin dependencia externa.

- **CLI**: `wabi flow {create,run,status,list,show,delete,validate,history}`
- **SDK**: `wabi_sabi.workflow.engine.WorkflowEngine` para uso interno
- **Runtime**: DAGs en `02_CLAUDIO/.wabi_runtime/workflows/`
- **Integración n8n**: OPCIONAL — si n8n corriendo, `wabi flow export --n8n` genera JSON compatible

**Requisitos no funcionales**:
- Local-first: cero dependencia de n8n externo
- DAG validado: detección de ciclos, nodos huérfanos, tipos compatibles
- Ejecución step-by-step con checkpoints (reanudable)
- Sin red por defecto (n8n bridge es opt-in)

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      wabi flow CLI                           │
│  (wabi_sabi/cli/commands_flow.py → workflow/engine.py)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌───────────────────────┐     ┌───────────────────────┐
│ WorkflowEngine        │     │ NodeRegistry          │
│ - parse YAML/JSON     │    │ - builtin: http, file  │
│ - validate DAG        │    │ - shell, python,       │
│ - execute topological │     │   whisper, secret      │
│ - checkpoint/resume   │    │ - custom: plugin path  │
└───────────┬───────────┘     └───────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│  n8n Bridge (OPCIONAL)                                       │
│  - wabi flow export --n8n → JSON workflow n8n-compatible     │
│  - wabi flow import --n8n <json> → YAML local                │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Formato Workflow (YAML)

```yaml
# Ejemplo: transcribe + summarize + save
name: "transcribe-and-summarize"
description: "Transcribe audio y genera resumen"
nodes:
  - id: capture
    type: whisper
    params:
      action: transcribe
      file: "${input.audio_path}"
  
  - id: summarize
    type: llm
    depends_on: [capture]
    params:
      prompt: "Resume: ${capture.text}"
      model: "auto"
  
  - id: save
    type: file
    depends_on: [summarize]
    params:
      action: write
      path: "${input.output_path}"
      content: "${summarize.response}"

edges:
  - from: capture
    to: summarize
  - from: summarize
    to: save
```

---

## 4. CLI `wabi flow` — Comandos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `wabi flow create <name>` | Crea workflow vacío | `wabi flow create my-flow` |
| `wabi flow run <name>` | Ejecuta workflow | `wabi flow run my-flow --input audio=foo.wav` |
| `wabi flow status <name>` | Estado de ejecución | `wabi flow status my-flow --json` |
| `wabi flow list` | Lista workflows | `wabi flow list --json` |
| `wabi flow show <name>` | Muestra definición | `wabi flow show my-flow` |
| `wabi flow delete <name>` | Borra workflow | `wabi flow delete my-flow` |
| `wabi flow validate <name>` | Valida DAG (ciclos, tipos) | `wabi flow validate my-flow` |
| `wabi flow history <name>` | Historial de ejecuciones | `wabi flow history my-flow --json` |
| `wabi flow export <name> --n8n` | Exporta a JSON n8n | `wabi flow export my-flow --n8n` |

**Variables**: `${node.field}`, `${input.key}`, `${env.VAR}`

---

## 5. `WorkflowEngine` SDK

```python
class WorkflowEngine:
    def __init__(self, workflows_dir: Path = None): ...

    # CRUD
    def create(self, name: str, description: str = "") -> Workflow: ...
    def load(self, name: str) -> Workflow: ...
    def save(self, workflow: Workflow) -> bool: ...
    def delete(self, name: str) -> bool: ...
    def list_workflows(self) -> list[str]: ...

    # Validation
    def validate(self, workflow: Workflow) -> ValidationResult: ...
    def detect_cycles(self, workflow: Workflow) -> list[list[str]]: ...

    # Execution
    def run(self, name: str, inputs: dict = None, resume: bool = True) -> RunResult: ...
    def execute_node(self, workflow: Workflow, node_id: str, context: dict) -> NodeResult: ...
    def topological_order(self, workflow: Workflow) -> list[str]: ...

    # History
    def get_history(self, name: str) -> list[RunResult]: ...
    def get_status(self, name: str) -> RunStatus: ...

    # n8n bridge
    def export_n8n(self, workflow: Workflow) -> dict: ...
    def import_n8n(self, n8n_json: dict) -> Workflow: ...
```

---

## 6. Node Types (builtins)

| Tipo | Descripción | Params |
|------|-------------|--------|
| `http` | HTTP request | url, method, headers, body |
| `file` | File I/O | action (read/write/append/delete), path, content |
| `shell` | Shell command | command, timeout |
| `python` | Python snippet | code, imports |
| `whisper` | STT (usa wabi_sabi.voice) | action (transcribe/translate), file |
| `secret` | Vault access (usa VaultwardenClient) | action (get/set), key |
| `llm` | LLM completion | prompt, model, provider |
| `transform` | Data transform (Jinja2 expr) | template, input |
| `delay` | Wait | seconds |
| `log` | Print to witness log | message, level |

---

## 7. Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `wabi_sabi/workflow/__init__.py` | Package init |
| `wabi_sabi/workflow/engine.py` | WorkflowEngine + DAG validator (~400 LOC) |
| `wabi_sabi/workflow/nodes.py` | NodeRegistry + builtins (~300 LOC) |
| `wabi_sabi/workflow/models.py` | Workflow, Node, RunResult dataclasses (~150 LOC) |
| `wabi_sabi/cli/commands_flow.py` | CLI `wabi flow *` (~250 LOC) |
| `tests/test_workflow_engine.py` | Tests unitarios |

### Modificados
| Archivo | Cambio |
|---------|--------|
| `wabi_sabi/cli/commands.py` | Import + registro comandos `flow` |

---

## 8. Tests (mínimos)

| Test | Qué valida |
|------|------------|
| `test_dag_validate_no_cycles` | DAG válido pasa |
| `test_dag_detect_cycle` | Ciclo detectado |
| `test_topological_order` | Orden topológico correcto |
| `test_run_workflow_sequential` | 3 nodos secuenciales ejecutan |
| `test_run_workflow_parallel` | Nodos paralelos ejecutan |
| `test_resume_from_checkpoint` | Reanuda tras fallo |
| `test_variable_substitution` | `${node.field}` se resuelve |
| `test_node_http_mock` | Nodo HTTP con mock |
| `test_node_file_write_read` | Nodo file escribe y lee |
| `test_export_n8n_format` | Export JSON tiene formato n8n |
| `test_cli_flow_list_json` | `wabi flow list --json` válido |

---

## 9. Gates

| Riesgo | Mitigación |
|--------|------------|
| Workflow infinito | Timeout global por run (default 300s) |
| Nodo shell inyecta comandos | Sandboxing: allowlist de comandos |
| n8n no.corriendo | Bridge opcional, error claro si `--n8n` y no hay servidor |
| Datos sensibles en logs | Variables `${secret.*}` nunca se logean |

---

## 10. Criterios de Aceptación

1. `wabi flow create test-flow` → crea YAML vacío en workflows/
2. `wabi flow validate test-flow` → valida DAG (ciclos, nodos huérfanos)
3. `wabi flow run test-flow --input key=value` → ejecuta y reporta
4. `wabi flow status test-flow --json` → estado de última ejecución
5. `wabi flow list --json` → lista workflows
6. `wabi flow export test-flow --n8n` → JSON compatible con n8n
7. Tests pasan: `python -m pytest tests/test_workflow_engine.py -v`