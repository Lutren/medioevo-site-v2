# Especificación: MCP Cliente — Consume herramientas de servidores MCP externos

**Estado**: SPEC - Listo para implementar
**Prioridad**: MEDIA (Fase 5)
**Autor**: Wabi-Sabi / Tyr
**Fecha**: 2026-07-15

---

## 1. Objetivo

MCP (Model Context Protocol) cliente para que Wabi-Sabi consuma herramientas
de servidores MCP externos (filesystem, GitHub, PostgreSQL, etc.).

Wabi-Sabi ya es **servidor** MCP (:8791). Ahora también será **cliente** MCP.

- **CLI**: `wabi mcp {list,connect,disconnect,call,tools,resources,prompts,status}`
- **SDK**: `wabi_sabi.mcp_client.MCPClient` para uso interno
- **Transportes**: stdio (proceso hijo), SSE (HTTP), WebSocket

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    wabi mcp CLI                              │
│  (wabi_sabi/cli/commands_mcp.py → mcp_client.py)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌───────────────────────┐     ┌───────────────────────┐
│ MCPClient             │     │ MCPServerRegistry     │
│ - connect (stdio)     │     │ - servers.json config  │
│ - connect (SSE/WS)    │     │ - list, add, remove    │
│ - list_tools()        │     └───────────────────────┘
│ - call_tool()         │
│ - list_resources()    │
│ - get_resource()      │
│ - list_prompts()      │
└───────────┬───────────┘
            │ JSON-RPC 2.0
            ▼
┌─────────────────────────────────────────────────────────────┐
│  Servidores MCP externos (ejemplos)                          │
│  - @modelcontextprotocol/server-filesystem (npx, stdio)     │
│  - @modelcontextprotocol/server-github (npx, stdio)          │
│  - @modelcontextprotocol/server-postgres (npx, stdio)        │
│  - Custom Python MCP server (stdio)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Protocolo MCP (JSON-RPC 2.0)

| Método | Descripción |
|--------|-------------|
| `initialize` | Handshake inicial (capabilities, protocolVersion) |
| `tools/list` | Lista herramientas disponibles |
| `tools/call` | Ejecuta una herramienta |
| `resources/list` | Lista recursos |
| `resources/read` | Lee un recurso |
| `prompts/list` | Lista prompts |
| `prompts/get` | Obtiene un prompt |

---

## 4. CLI `wabi mcp` — Comandos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `wabi mcp status` | Estado de conexiones MCP | `wabi mcp status --json` |
| `wabi mcp list` | Lista servidores configurados | `wabi mcp list --json` |
| `wabi mcp connect <name>` | Conecta a servidor MCP | `wabi mcp connect filesystem` |
| `wabi mcp disconnect <name>` | Desconecta servidor | `wabi mcp disconnect filesystem` |
| `wabi mcp tools <server>` | Lista herramientas del servidor | `wabi mcp tools filesystem --json` |
| `wabi mcp call <server> <tool> [args]` | Ejecuta herramienta | `wabi mcp call filesystem read_file --args path=/tmp/foo` |
| `wabi mcp resources <server>` | Lista recursos | `wabi mcp resources filesystem` |
| `wabi mcp prompts <server>` | Lista prompts | `wabi mcp prompts github` |

---

## 5. Configuración (`servers.json`)

```json
{
  "servers": {
    "filesystem": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
      "env": {}
    },
    "github": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_TOKEN": "${env.GITHUB_TOKEN}"}
    },
    "custom": {
      "transport": "sse",
      "url": "http://localhost:3001/sse"
    }
  }
}
```

---

## 6. Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `wabi_sabi/mcp_client/__init__.py` | Package init |
| `wabi_sabi/mcp_client/client.py` | MCPClient (~350 LOC) |
| `wabi_sabi/mcp_client/transport.py` | Transportes stdio + SSE (~200 LOC) |
| `wabi_sabi/cli/commands_mcp.py` | CLI `wabi mcp *` (~200 LOC) |
| `tests/test_mcp_client.py` | Tests unitarios (mock JSON-RPC) |

### Modificados
| Archivo | Cambio |
|---------|--------|
| `wabi_sabi/cli/commands.py` | Import + registro comandos `mcp` |

---

## 7. Criterios de Aceptación

1. `wabi mcp status --json` → lista conexiones activas
2. `wabi mcp list --json` → lista servidores configurados
3. `wabi mcp connect <name>` → conecta via stdio o SSE
4. `wabi mcp tools <server> --json` → lista herramientas JSON-RPC
5. `wabi mcp call <server> <tool> --args key=value` → ejecuta herramienta
6. `wabi mcp disconnect <name>` → desconecta limpiamente
7. Tests pasan: `python -m pytest tests/test_mcp_client.py -v`