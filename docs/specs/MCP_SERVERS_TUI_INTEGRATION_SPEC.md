# Especificación: MCP Servers Reales + Integración TUI

**Estado**: SPEC - Listo para implementar
**Prioridad**: ALTA (Fase 6)
**Autor**: Wabi-Sabi / Tyr
**Fecha**: 2026-07-15

---

## 1. Objetivo

Implementar servidores MCP reales (via stdio) que el `MCPClient` pueda consumir, e integrarlos en la TUI para que el usuario pueda usar herramientas externas (filesystem, GitHub, etc.) desde el chat y paneles.

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        WabiTUI (App)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Chat Panel  │  │ Tools Panel │  │ MCP Panel (nuevo)       │ │
│  │             │  │             │  │ - Conectar servidor     │ │
│  │ LLM usa     │  │ Lista       │  │ - Listar tools          │ │
│  │ tools MCP   │  │ tools Wabi  │  │ - Ejecutar tool         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ MCPClient (JSON-RPC 2.0)
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│ Filesystem MCP   │ │ GitHub MCP   │ │ Custom MCP   │
│ (stdio)          │ │ (stdio)      │ │ (stdio)      │
│ - read_file      │ │ - list_repos │ │ - ...        │
│ - write_file     │ │ - create_issue│                │
│ - list_dir       │ │ - get_file   │                │
└──────────────────┘ └──────────────┘ └──────────────┘
```

---

## 3. Servidores MCP a Implementar

### 3.1 Filesystem MCP Server (`mcp_server_filesystem.py`)

| Tool | Descripción | Params |
|------|-------------|--------|
| `read_file` | Lee archivo | `{path: string}` |
| `write_file` | Escribe archivo | `{path: string, content: string}` |
| `list_dir` | Lista directorio | `{path: string}` |
| `delete_file` | Borra archivo | `{path: string}` |
| `mkdir` | Crea directorio | `{path: string}` |

**Restricciones**: Solo dentro de `workspace_root` (configurable), no traverse `..`

### 3.2 GitHub MCP Server (`mcp_server_github.py`)

| Tool | Descripción | Params |
|------|-------------|--------|
| `list_repos` | Lista repos del usuario/org | `{org?: string}` |
| `get_file` | Obtiene contenido archivo | `{owner, repo, path, ref?}` |
| `create_issue` | Crea issue | `{owner, repo, title, body?}` |
| `list_issues` | Lista issues | `{owner, repo, state?}` |
| `create_pr` | Crea PR | `{owner, repo, title, head, base, body?}` |

**Auth**: Token via env `GITHUB_TOKEN` o config

### 3.3 Custom Python MCP Server (`mcp_server_python.py`)

| Tool | Descripción |
|------|-------------|
| `exec_code` | Ejecuta código Python en sandbox |
| `install_pkg` | Instala paquete pip temporal |

---

## 4. Integración TUI

### 4.1 Nuevo Panel: MCP Tools

En `widgets.py` añadir `MCPToolsPanel`:
- Lista servidores conectados
- Para cada servidor: lista tools con descripción
- Botón "Ejecutar" → modal con args JSON
- Resultado en log

### 4.2 Chat Panel: Auto-tool calling

Cuando LLM responde con `tool_call` a MCP tool:
1. TUI detecta `tool_call` en respuesta
2. Ejecuta via `MCPClient.call_tool()`
3. Inyecta resultado en conversación
4. LLM continúa

### 4.3 Configuración persistente

`~/.wabi/mcp/servers.json`:
```json
{
  "servers": {
    "filesystem": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "wabi_sabi.mcp_servers.filesystem", "/workspace"],
      "enabled": true
    },
    "github": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "wabi_sabi.mcp_servers.github"],
      "env": {"GITHUB_TOKEN": "${env.GITHUB_TOKEN}"},
      "enabled": false
    }
  }
}
```

---

## 5. Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| `wabi_sabi/mcp_servers/__init__.py` | Package |
| `wabi_sabi/mcp_servers/filesystem.py` | Filesystem MCP server (stdio) |
| `wabi_sabi/mcp_servers/github.py` | GitHub MCP server (stdio) |
| `wabi_sabi/mcp_servers/python.py` | Python exec MCP server (stdio) |
| `wabi_sabi/tui/widgets.py` | + `MCPToolsPanel` class |
| `wabi_sabi/tui/app.py` | + MCP panel en layout, auto-tool-calling |
| `wabi_sabi/cli/commands_mcp.py` | + `mcp-add`, `mcp-remove`, `mcp-enable`, `mcp-disable` |
| `tests/test_mcp_servers.py` | Tests de servers stdio |

---

## 6. Tests

| Test | Qué valida |
|------|------------|
| `test_filesystem_server_read_write` | read_file/write_file/list_dir via stdio |
| `test_filesystem_security` | No traverse fuera de workspace |
| `test_github_server_list_repos` | list_repos con mock token |
| `test_mcp_client_connect_filesystem` | Client conecta y lista tools |
| `test_tui_mcp_panel_render` | Panel renderiza servers/tools |
| `test_chat_auto_tool_call` | LLM tool_call → ejecuta MCP → inyecta resultado |

---

## 7. Criterios de Aceptación

1. `wabi mcp connect filesystem` → conecta server stdio
2. `wabi mcp tools filesystem --json` → lista 5 tools
3. `wabi mcp call filesystem read_file --args path=README.md` → retorna contenido
4. TUI: Panel MCP muestra servers, tools, permite ejecutar
5. Chat: LLM usa `filesystem.read_file` → TUI ejecuta → inyecta resultado
6. Tests pasan: `python -m pytest tests/test_mcp_servers.py -v`