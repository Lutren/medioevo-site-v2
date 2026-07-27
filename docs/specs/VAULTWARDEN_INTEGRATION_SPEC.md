# Especificación: Integración Vaultwarden + CLI `wabi secret`

**Estado**: SPEC - Listo para implementar
**Prioridad**: ALTA (Fase 1 del roadmap post-análisis OSS)
**Autor**: Wabi-Sabi / Tyr
**Fecha**: 2026-07-15

---

## 1. Objetivo

Reemplazar `secret_vault.py` (DPAPI local) por un cliente Vaultwarden unificado que exponga:

- **CLI**: `wabi secret {list,get,set,delete,totp,audit,import,export,init,status}`
- **SDK**: `wabi_sabi.vaultwarden_client.VaultwardenClient` para uso interno
- **Runtime**: Sidecar Vaultwarden en Docker (puerto 8080 localhost only) + sincronización opcional con Bitwarden Cloud

**Requisitos no funcionales**:
- Zero-trust: vaultwarden solo en `127.0.0.1:8080`, sin exposición LAN
- DPAPI fallback: si Docker no disponible, cae a `secret_vault.py` legacy
- Migración automática: `wabi secret import --from-dpapi` migra vault.json → Vaultwarden
- CLI unificada: un solo entrypoint `wabi secret` para todo

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        wabi secret CLI                          │
│  (wabi_sabi/cli/commands.py → vaultwarden_client.py)           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌───────────────────────┐     ┌───────────────────────┐
│ VaultwardenClient     │     │ SecretVault (DPAPI)   │
│ - HTTP API a :8080    │     │ - Legacy fallback     │
│ - Auth: device auth   │     │ - Migración one-way   │
│ - Sync opcional cloud │     └───────────────────────┘
└───────────┬───────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Vaultwarden Server (Docker: vaultwarden/server:latest)        │
│  - Puerto 8080 (127.0.0.1 only)                                │
│  - SQLite en ./02_CLAUDIO/.vaultwarden/data/                   │
│  - Admin token para setup inicial                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. API Vaultwarden (Bitwarden-compatible)

Endpoints usados (subset):

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Login (device) | `/identity/connect/token` | POST |
| List items | `/api/v1/vault/items` | GET |
| Get item | `/api/v1/vault/items/{id}` | GET |
| Create item | `/api/v1/vault/items` | POST |
| Update item | `/api/v1/vault/items/{id}` | PUT |
| Delete item | `/api/v1/vault/items/{id}` | DELETE |
| Get TOTP | `/api/v1/vault/items/{id}/totp` | GET |
| Sync | `/api/v1/sync` | GET |

Auth flow: **Device Authorization Grant** (RFC 8628) — no hay credenciales en CLI, solo device code + poll.

---

## 4. CLI `wabi secret` — Comandos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `wabi secret init` | Inicia sidecar Docker, device auth, guarda token | `wabi secret init` |
| `wabi secret status` | Estado sidecar + auth + sync | `wabi secret status --json` |
| `wabi secret list` | Lista items (filtro opcional) | `wabi secret list --type login` |
| `wabi secret get <id\|name>` | Obtiene valor (campo `password` o `notes`) | `wabi secret get gumroad_token` |
| `wabi secret set <name> <value>` | Crea/actualiza item tipo `login` | `wabi secret set gumroad_token "abc123"` |
| `wabi secret delete <id\|name>` | Borra item | `wabi secret delete old_key` |
| `wabi secret totp <id\|name>` | Muestra TOTP actual | `wabi secret totp github` |
| `wabi secret audit` | Reporte seguridad (reutilizadas, débiles, sin 2FA) | `wabi secret audit --json` |
| `wabi secret import --from-dpapi` | Migra `secret_vault.py` → Vaultwarden | `wabi secret import --from-dpapi` |
| `wabi secret export --to-json` | Exporta a JSON (stdout o archivo) | `wabi secret export --to-json > backup.json` |
| `wabi secret sync` | Fuerza sync con Bitwarden Cloud (si configurado) | `wabi secret sync` |

**Salida**: Por defecto tabla bonita; `--json` para scripting.

---

## 5. `VaultwardenClient` SDK

```python
class VaultwardenClient:
    def __init__(self, base_url: str = "http://127.0.0.1:8080", token_path: Path = None):
        ...

    # Lifecycle
    def ensure_running(self) -> bool:        # Inicia Docker sidecar si no está up
    def authenticate_device(self) -> str:     # Device auth flow, retorna access_token
    def load_token(self) -> Optional[str]:    # Lee token guardado (DPAPI)
    def save_token(self, token: str):         # Guarda token (DPAPI)

    # Vault ops
    def list_items(self, item_type: int = None) -> List[VaultItem]:
    def get_item(self, identifier: str) -> Optional[VaultItem]:  # id o name
    def create_item(self, item: VaultItem) -> VaultItem:
    def update_item(self, item_id: str, item: VaultItem) -> VaultItem:
    def delete_item(self, item_id: str) -> bool:
    def get_totp(self, item_id: str) -> str:
    def sync(self) -> SyncResult:

    # Utils
    def audit(self) -> AuditReport:
    def export_json(self) -> dict:
    def import_from_dpapi(self, dpapi_vault: SecretVault) -> MigrationReport:
```

`VaultItem` (dataclass): `id, name, type (1=login, 2=note, 3=card, 4=identity), login: {username, password, uris}, notes, fields[], totp`

---

## 6. Migración DPAPI → Vaultwarden

`wabi secret import --from-dpapi`:
1. Instancia `SecretVault()` legacy
2. `vault.get_all()` → dict `{item_id: value}`
3. Para cada entry: `client.create_item(VaultItem(name=item_id, type=1, login={password=value}))`
4. Reporte: `{"migrated": N, "skipped": M, "errors": []}`
5. **No borra** vault DPAPI (rollback manual si falla)

---

## 7. Sidecar Docker

```yaml
# docker-compose.vaultwarden.yml (generado por wabi secret init)
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: wabi-vaultwarden
    restart: unless-stopped
    network_mode: "host"  # o ports: ["127.0.0.1:8080:80"]
    environment:
      - SIGNUPS_ALLOWED=false
      - INVITATIONS_ALLOWED=false
      - ADMIN_TOKEN=${ADMIN_TOKEN}  # generado aleatorio, guardado en DPAPI
      - DATABASE_URL=sqlite:///data/db.sqlite3
      - LOG_LEVEL=warn
      - EXTENDED_LOGGING=false
      - ICON_CACHE_TTL=2592000
    volumes:
      - ./.vaultwarden/data:/data
```

**Puertos**: Solo `127.0.0.1:8080` (host mode o port binding localhost-only).
**Datos**: `02_CLAUDIO/.vaultwarden/data/` (persistente).

---

## 8. Archivos a crear/modificar

### Nuevos
| Archivo | Descripción |
|---------|-------------|
| `wabi_sabi/vaultwarden_client.py` | SDK completo (~400 LOC) |
| `wabi_sabi/cli/commands_secret.py` | Comandos `wabi secret *` (~300 LOC) |
| `docker/vaultwarden/docker-compose.yml.template` | Template sidecar |
| `tests/test_vaultwarden_client.py` | Tests unitarios (mock HTTP) |

### Modificados
| Archivo | Cambio |
|---------|--------|
| `wabi_sabi/cli/commands.py` | Import y registro comandos `secret` |
| `wabi_sabi/secret_vault.py` | Añadir `export_all()` + marcar `DEPRECATED` |
| `core/wabi.py` | Añadir alias `secret` en `main()` si no existe |

---

## 9. Tests (mínimos viables)

| Test | Qué valida |
|------|------------|
| `test_vaultwarden_client_mock` | CRUD items via httpx mock |
| `test_device_auth_flow` | Device code → poll → token |
| `test_dpapi_migration` | SecretVault → VaultwardenClient.import_from_dpapi |
| `test_audit_report` | Detección contraseñas repetidas, sin 2FA |
| `test_cli_secret_list_json` | `wabi secret list --json` output válido |

---

## 10. Gates y Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Docker no disponible | Fallback a DPAPI (`SecretVault`) automático |
| Vaultwarden no arranca | Timeout 30s, error claro, `wabi secret status` diagnostica |
| Token expira | Device auth re-automático silencioso |
| Admin token expuesto | Guardado en DPAPI, nunca en disco plano |
| Sync cloud opcional | Variables `BW_CLOUD_URL`, `BW_CLIENT_ID/SECRET` en env vars únicamente |

---

## 11. Criterios de Aceptación (Definition of Done)

1. `wabi secret init` → sidecar arriba, device auth completado, token guardado
2. `wabi secret set foo bar` → `wabi secret get foo` == "bar"
3. `wabi secret list --json` → JSON válido con items
4. `wabi secret totp <item>` → TOTP válido (si item tiene `totp`)
5. `wabi secret import --from-dpapi` → migra todos los items legacy
6. `wabi secret audit --json` → reporte con `reused_passwords`, `weak_passwords`, `no_2fa`
7. Tests pasan: `python -m pytest tests/test_vaultwarden_client.py -v`
7. `wabi secret status --json` → `{"running": true, "authenticated": true, "synced_at": "..."}`

---

## 12. Próximos Pasos (post-Fase 1)

- **Fase 2**: `wabi secret share <item> --to <email>` (send via Bitwarden org)
- **Fase 3**: Integración `wabi voice` → `whisper` para dictado de secretos
- **Fase 4**: `wabi secret rotate <item>` — rotación automática + notificación n8n