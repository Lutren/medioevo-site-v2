# Especificación: TUI Textual — Front-end de Wabi-Sabi

**Estado**: SPEC - Listo para implementar
**Prioridad**: ALTA (Fase 4 — front-end que reemplaza opencode/Claude Code)
**Autor**: Wabi-Sabi / Tyr
**Fecha**: 2026-07-15

---

## 1. Objetivo

TUI (Terminal User Interface) basada en `textual` que reemplaza el front-end
de opencode y Claude Code. Single runtime Python, sin fork de TS/Node.

- **Entry point**: `wabi tui` o `python core/wabi.py tui`
- **Stack**: textual 8.1.1 (incluido), rich, stdlib
- **Binding**: usa los 42 comandos del COMMAND_REGISTRY via `wabi_sabi.cli.main`
- **Layout**: 3 paneles (sidebar | chat主panel | status bar)
- **Modos**: chat, tools, flows, secrets, voice, status

**Requisitos no funcionales**:
- Local-first: cero red (excepto LLM provider opt-in en modo chat)
- Sin dependencias nuevas (textual ya instalado)
- Responsive: funciona en terminal 80x24 mínimo
- Keyboard-first: command palette con Ctrl+P, tabs con Ctrl+Tab
- Tema: oscuro por defecto (Wabi-Sabi aesthetic)

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        WabiTUI (App)                            │
│  textual.App + CSS + Compose                                    │
├──────────┬──────────────────────────────────────┬───────────────┤
│ Sidebar  │         Main Panel                   │  Command      │
│          │                                      │  Palette      │
│ ───────  │  ┌─ Chat Mode ─────────────────────┐ │  (Ctrl+P)    │
│ Status   │  │ > user message                   │ │              │
│ Chat     │  │ < wabi response                  │ │              │
│ Tools    │  │ ...                              │ │              │
│ Flows    │  │ [input box]                      │ │              │
│ Secrets  │  └──────────────────────────────────┘ │              │
│ Voice    │                                      │              │
│ Gate     │  ┌─ Tools Mode ─────────────────────┐ │              │
│          │  │ tool registry table              │ │              │
│          │  └──────────────────────────────────┘ │              │
│          │  ┌─ Flows Mode ─────────────────────┐ │              │
│          │  │ flow list + DAG viewer            │ │              │
│          │  └──────────────────────────────────┘ │              │
├──────────┴──────────────────────────────────────┴───────────────┤
│ Status Bar: R=0.10 Phi=0.88 OPTIMO | provider: deepseek | gate  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Modos

| Modo | Descripción | Comando |
|------|-------------|---------|
| **Chat** | Conversación con LLM via ConversationEngine | default |
| **Status** | Panel operador (R, Phi, regime, providers, gates) | `status` |
| **Tools** | Lista de tools del registry + ejecución | `tools` |
| **Flows** | Lista workflows + DAG viewer + run | `flows` |
| **Secrets** | Vault Vaultwarden (list, get, set, audit) | `secrets` |
| **Voice** | STT status + transcribe UI | `voice` |
| **Gate** | OSIT claim gate (classify, residue trend) | `gate` |

---

## 4. Keybindings

| Key | Acción |
|-----|--------|
| `Ctrl+P` | Command palette |
| `Ctrl+Tab` | Ciclar modos |
| `Ctrl+1..7` | Saltar a modo directo |
| `Ctrl+N` | Nuevo mensaje (chat mode) |
| `Ctrl+Enter` | Enviar mensaje |
| `Ctrl+S` | Guardar conversación |
| `Ctrl+Q` | Quit |
| `F1` | Help |
| `F2` | Toggle sidebar |
| `Esc` | Cancelar / cerrar palette |

---

## 5. Command Palette (Ctrl+P)

Busca y ejecuta cualquiera de los 42 comandos del COMMAND_REGISTRY:

```
> secret
  secret-init     Inicia sidecar Vaultwarden + device auth
  secret-status   Estado sidecar/auth/sync
  secret-list     Lista items del vault
  ...
> flow
  flow-create     Crea workflow vacío
  flow-run         Ejecuta workflow
  ...
```

---

## 6. Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `wabi_sabi/tui/__init__.py` | Package init |
| `wabi_sabi/tui/app.py` | App principal textual (~400 LOC) |
| `wabi_sabi/tui/widgets.py` | Widgets custom: ChatPanel, Sidebar, StatusBar, CommandPalette (~300 LOC) |
| `wabi_sabi/tui/modes.py` | Modos: chat, status, tools, flows, secrets, voice, gate (~250 LOC) |
| `wabi_sabi/tui/styles.tcss` | CSS textual (tema oscuro Wabi-Sabi) |
| `tests/test_tui_app.py` | Tests unitarios (headless Pilot) |

### Modificados
| Archivo | Cambio |
|---------|--------|
| `core/wabi.py` | Añadir subcomando `tui` que lanza `WabiTUI().run()` |

---

## 7. Binding al CLI existente

La TUI NO reimplementa lógica — delega al COMMAND_REGISTRY:

```python
from wabi_sabi.cli.commands import COMMAND_REGISTRY
from wabi_sabi.cli.main import build_parser

# Ejecutar comando desde TUI:
def run_command(name: str, items: list = None, json_output=True) -> dict:
    ctx = CommandContext(
        workspace=workspace,
        runtime_root=runtime,
        items=items or [],
        target=None,
        dry_run=False,
        test_commands=[],
        json_output=json_output,
    )
    handler = COMMAND_REGISTRY[name]
    handler(ctx)
    # Parse JSON output
```

---

## 8. Chat Mode

Usa `ConversationEngine` directamente (no via subprocess):

```python
from wabi_sabi.conversation_engine import ConversationEngine, ConversationOptions

engine = ConversationEngine(
    workspace=workspace,
    runtime_root=runtime,
    options=ConversationOptions(provider="auto", allow_cloud=True, coding_mode=True),
)
response = engine.respond(user_message)
```

- Streaming: respuesta aparece token a token (si provider soporta stream)
- History: se persiste en `runtime_root/conversation.jsonl`
- Coding mode: activa tool executor para código

---

## 9. Tema (CSS textual)

```css
/* styles.tcss */
Screen {
    background: #1a1a2e;
    color: #e0e0e0;
}

Sidebar {
    width: 24;
    background: #16213e;
    border-right: solid #0f3460;
}

StatusBar {
    background: #0f3460;
    color: #e0e0e0;
    height: 1;
}

CommandPalette {
    layer: overlay;
    width: 60;
    height: 20;
    background: #1a1a2e;
    border: solid #e94560;
}

ChatInput {
    height: 3;
    border: solid #0f3460;
}

ChatMessages {
    background: #1a1a2e;
}
```

---

## 10. Tests (con textual Pilot)

| Test | Qué valida |
|------|------------|
| `test_app_starts` | App lanza sin error en modo headless |
| `test_command_palette_open` | Ctrl+P abre palette |
| `test_mode_switch` | Ctrl+Tab cicla modos |
| `test_chat_send_message` | Mensaje se envía y genera response |
| `test_status_display` | Status mode muestra R, Phi, provider |
| `test_flows_list` | Flows mode lista workflows |
| `test_secrets_list` | Secrets mode lista items (mock) |
| `test_quit` | Ctrl+Q cierra la app |

---

## 11. Criterios de Aceptación

1. `wabi tui` lanza la TUI sin error
2. Sidebar muestra 7 modos navegables
3. Ctrl+P abre command palette con los 42 comandos
4. Chat mode envía mensaje y muestra response del LLM
5. Status mode muestra R, Phi, regime, provider activo
6. Flows mode lista workflows desde `flow-list`
7. Secrets mode lista items desde `secret-list`
8. Ctrl+Q cierra limpiamente
9. Tests pasan: `python -m pytest tests/test_tui_app.py -v`