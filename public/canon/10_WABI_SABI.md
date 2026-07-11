# Wabi-Sabi — Agente Local de Autocoder
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-06-26 (actualizado)
**R_est:** 0.10
**Régimen:** CERTEZA operacional — v0.5, 2700+ tests passing, suite global verde
**Estado:** Operacional. CLI en PATH. MCP server activo en :8791.

---

## 0. Lugar en el ecosistema

```
VibeForge ──── motor de generación local (código, UI, assets)
    │
    ├── WABI-Sabi ── agente de autocoder y diagnóstico  ← ESTE DOCUMENTO
    │       │
    │       └── OSIT gates, TokenSaver, BM25, SQLite
    │
    └── DUAT ─────── orquestador y memoria observacionista
```

Wabi-Sabi, DUAT ([[11_DUAT]]) y VibeForge ([[12_VIBEFORGE]]) son capas del mismo
principio: **inteligencia local sin dependencia cloud**, con residuo explícito,
gates de acción y rollback obligatorio.

---

## 1. Filosofía de diseño

Del concepto japonés *wabi-sabi*: **la imperfección funcional y honesta** vale más
que la perfección frágil. Un sistema que sabe lo que no sabe, trabaja con lo que
tiene, y no inventa certezas.

**Traducción OSIT:**
- Funciona offline en hardware bajo recurso (8 GB RAM, CPU-only).
- No pretende resolverlo todo — usa templates cuando EML es bajo.
- Cada cambio tiene log y rollback.
- Los errores son visibles, no silenciados.
- R bajo > output grande sin calidad.

---

## 2. Arquitectura

```
Input usuario
    │  ▼
TokenSaver (L2 por defecto) ──► comprime contexto
    │  ▼
BM25 + SQLite ────────────────► recupera contexto relevante local
    │  ▼
EML Router ──────────────────► decide: template / LLM local / LLM externo
    │   ├── EML < 0.50         → template local (sin LLM)
    │   ├── 0.50 ≤ EML < 0.75  → Ollama/Gemma 2B local
    │   └── EML ≥ 0.75 + créditos → Claude API
    │  ▼
Código / respuesta generada
    │  ▼
Test automático ──────────────► pytest / verificación de output
        ├── PASS → registrar en SQLite + WitnessLog
        └── FAIL → reparar (máx 1 intento) → rollback si falla de nuevo
```

---

## 3. Modos de operación

| Modo | Herramientas activas | Cuándo usar |
|---|---|---|
| `base` | BM25 + templates | siempre disponible, sin internet |
| `local` | + Ollama/Gemma 2B cuantizado | cuando EML ≥ 0.50, sin créditos |
| `hybrid` | + Claude API | cuando EML ≥ 0.75 y hay créditos |
| `audit` | solo lectura + BrainOS Auditor | diagnóstico sin cambios |

---

## 4. CLI principal (v0.5 — comandos reales)

```bash
wabi                            # REPL interactivo (banner + chat + plan + exec)
wabi ask "mensaje"              # one-shot con el mejor proveedor disponible
wabi code utils.py "fix bug"    # edición de archivo con contexto (reemplaza OpenCode)
wabi code --target file.py "instrucción" --diff  # diff sin aplicar
wabi residue trend              # telemetría OSIT — gráfico de R en el tiempo
wabi gate "afirmación"          # gate epistémico — CERTEZA / INFERENCIA / BLOQUEADO
wabi daemon start               # arrancar daemon background :47048
wabi daemon status              # estado del daemon
# Dentro del REPL: /plan <tarea>, /run, /status, /providers, /doctor, /new, /exit
```

### Routing por capacidad (provider_capabilities.json — editable sin tocar código)
| Tarea | Provider preferido | Fallback |
|-------|--------------------|---------|
| code/backend | deepseek | nvidia → ollama |
| code/frontend | glm:glm-4-plus | nvidia → ollama |
| orchestrator | nvidia (nemotron) | deepseek → gemini → ollama |
| research | deepseek | nvidia → ollama |
| fallback | ollama:llama3.2:3b | dry-run |

**Cadena de proveedores (2026-06-28):** `nvidia → glm → deepseek → groq → openrouter → ollama → dry-run`
**Cloudflare AI: NO USAR** — Tyr no tiene acceso a Workers AI (solo R2/Pages están activos).
**Secretos:** vault cifrado DPAPI (`wabi_sabi/secret_vault.py`); NO en wabi.env en texto plano.

### MCP Servers activos
- **wabi_mcp_server** `:8791` — read-prepare, 12 read tools + 4 draft tools
- **godot_mcp_server** `:8793` — validación headless Godot, status, run_headless

---

## 5. Reglas de diseño Wabi-Sabi

1. **Local-first:** funciona offline. Cloud es optimización, no requisito.
2. **Bajo recurso:** sin PyTorch, sin modelos > 3 GB, sin > 6 GB RAM en operación.
3. **Verificable:** cada cambio produce log con before/after hash.
4. **Reversible:** todo cambio tiene rollback documentado.
5. **Honesto:** si R > 0.80, reporta jamming y divide — no fuerza output.
6. **Modular:** el kernel no depende de la UI; la UI no depende de Ollama.
7. **Silencioso correctamente:** no suprime errores; los clasifica con estado.

---

## 6. Algoritmo de reparación

```python
def repair_cycle(file, context, max_attempts=1):
    backup = create_backup(file)
    for attempt in range(max_attempts + 1):
        patch = generate_patch(file, context, attempt)
        apply_patch(file, patch)
        result = run_tests(file)
        if result.passed:
            log_witness(file, patch, "PASS", result)
            return SUCCESS
        rollback(file, backup)
        log_witness(file, patch, "FAIL", result)
    return FAIL_ROLLBACK
```

---

## 7. Métricas operativas

| Métrica | Target | Estado |
|---|---|---|
| Tareas completadas offline (sin API) | > 70% de tareas básicas | INCÓGNITA |
| Latencia media por tarea | < 5 s en modo base | INCÓGNITA |
| test_pass_rate post-repair | > 0.85 | INCÓGNITA |
| rollback_coverage | 1.0 | CERTEZA (lógica) |
| RAM peak en modo base | < 2 GB | INFERENCIA |

---

## 8. Falsificadores

- Si WABI no completa > 70 % de tareas básicas sin API → la promesa offline falla (INCÓGNITA).
- Si un cambio se aplica sin backup/rollback → viola la regla 4 (PASS lógico hoy).
- Si TokenSaver borra una restricción crítica en el pipeline → falla de seguridad.

---

```
R_est:   0.28
Régimen: INFERENCIA fuerte — arquitectura definida, implementación parcial
Handoff: wabi-sabi-v0.3-2026-05-27
```
