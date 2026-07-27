# B1 — wabi-app (Tauri) — Registro del prebuilt `wabi-app.exe`

> Decisión Tyr (sesión 2026-07-25): **aceptar .exe prebuilt**.
> Source Rust perdido (sin `Cargo.toml`, `tauri.conf.json`, ni `main.rs`).
> Este documento canónico registra el artefacto y la decisión.

## Artefacto

| Campo | Valor |
|-------|-------|
| Path | `apps/wabi-app/src-tauri/target/release/wabi-app.exe` |
| Size | 8.06 MB |
| Modified | 2026-07-12 01:12:52 |
| SHA256 | `9D51BAD0BAE2735EFB18C03C1991340125D06E653E7D728537F51174EB394418` |
| Plataforma | Windows x64 (Tauri/Rust binary) |

## Estado del source

- `apps/wabi-app/src-tauri/Cargo.toml`: **AUSENTE** (perdido)
- `apps/wabi-app/src-tauri/tauri.conf.json`: **AUSENTE** (perdido)
- `apps/wabi-app/src-tauri/src/main.rs`: **AUSENTE** (perdido)
- `apps/wabi-app/src-tauri/icons/icon.ico`: **PRESENTE** (55.5 KB)
- `apps/wabi-app/src-tauri/gen/`: schemas de Tauri generados, presentes:
  - `acl-manifests.json`
  - `capabilities.json`
  - `desktop-schema.json`
  - `windows-schema.json`
  - `schemas/` (subdir)

## Decisión

Tyr acepta el .exe prebuilt como entregable vigente. No se requiere rebuild inmediato.

## Caminos futuros

1. **Mantener prebuilt vigente:**.Binary ejecutable directo desde `target/release/wabi-app.exe`. Sin rebuilds hasta localizar source.
2. **Localizar source Rust en backups:** posibles localizaciones a revisar:
   - `D:\RESPALDO_BRAIN_OS\` — respaldos del OS
   - `E:\` drives históricos
   - Cache de OneDrive (version history)
   - Snapshots corpus en `E:\TEMP\SNAPSHOT_CORPUS_*`
   - Si se encuentra: mover a `apps/wabi-app/src-tauri/src/` + `Cargo.toml` + `tauri.conf.json`, then `cargo tauri build` regenera .exe.
3. **Reconstruir desde contrato (patrón B8):** si Tauri app es sólo un wrapper del CLI `wabi` (que ya existe y está commiteado), reconstruir un proyecto Tauri nuevo mínimo:
   - `cargo init apps/wabi-app/src-tauri`
   - `tauri.conf.json` mínimo (identifier, productName, window config)
   - `main.rs` mínimo (con `wabi` CLI subprocess.call)
   - `cargo tauri build` produce .exe nuevo
   - Esta es la opción **más segura** a largo plazo.

## .gitignore aplicable

```
**/src-tauri/target/
**/src-tauri/gen/
```

El `.exe` en `target/release/` NO se commitea (es binario grande). Se preserva en working tree únicamente.

## ActionGate

- APPROVE: artefacto canónico en working tree de Tyr, sin commit binario (regla general binarios).
- REVIEW si Tyr decide reconstruir (Tauri toolchain *no* en PATH actualmente).

## Ficha

| Campo | Valor |
|-------|-------|
| ID | B1 |
| Estado | CERRADO (prebuilt aceptado) |
| Decision ref | "acepta .exe" — Tyr 2026-07-25 |
| Source local | pendiente buscar en backups |
| Rebuild desde contrato | fase futura (patrón B8) |
| Next versión | cuando source localice o reconstruya |
