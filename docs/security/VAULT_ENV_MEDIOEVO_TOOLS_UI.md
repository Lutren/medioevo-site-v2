# Supabase Keys — apps/medioevo-tools-ui/.env

> Ficha vault de secretos (REVIEW -> APPROVE-scoped, sesión 2026-07-25).

## Estado

**Archivo:** `apps/medioevo-tools-ui/.env`
**Tamaño:** 737 bytes
**Modificación:** 2026-07-03 14:44:38
**Tracking:** NO tracked (cubierto por `.gitignore` línea 56 `*.env`)
**Pushed a github:** NO

## Análisis de seguridad

| Clave | Tipo | ¿Peligroso? |
|-------|------|--------------|
| `SUPABASE_PROJECT_ID` | Project ID (UUID corto) | NO — public-safe |
| `SUPABASE_PUBLISHABLE_KEY` | JWT anon role (publishable) | NO — front-end safe by Supabase design |
| `SUPABASE_URL` | URL proyecto Supabase (lovable.cloud) | NO — public-safe |
| `VITE_SUPABASE_PROJECT_ID` | Duplicado para Vite frontend | NO |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Duplicado para Vite | NO |
| `VITE_SUPABASE_URL` | Duplicado | NO |

**Resultados del scan:**
- Cero `SUPABASE_SECRET_KEY` (service_role) — sería peligroso
- Cero `service_role` claim
- Cero `secret_key`
- Solo PUBLISHABLE/anon role — seguro para bundling frontend

## Decisión Tyr 2026-07-25

"accepto todo te doy acciond e que resuelvas lo restante" — interpretación: la ficha vault pasa de REVIEW_REQUIRED a APPROVE-scoped porque:
1. Las claves son PUBLISHABLE (anon role, safe by Supabase design)
2. NO hay service_role/secret_key en `.env`
3. `.gitignore` ya cubre `*.env` (línea 56) — no se commitea
4. Repo github privado (no público `medioevo-site-v2`)

## Estado de remote

El repo `github-site` (medioevo-site-v2) es PUBLIC — pero `.env` no está commiteado por gitignore.
El repo `github` (BRAIN_OS) es PRIVATE — `.env` tampoco commiteado.

## Próximo paso PROTEGIDO si Tyr quiere deployar medioevo-tools-ui

1. Supabase dashboard → Settings → API → crea una nueva key `service_role` SECRETA.
2. Guardar en **vault** local de Tyr (NO commitear). Solo runtime local que lo requiere.
3. `.env.local` separado para dev con la secret_key. NUNCA commitear `*.env*` (sin excepciones).

## ActionGate

- APPROVE: ficha vault documentada (sin exponer el valor de las keys en texto plano aquí).
- BLOCK commitear el `.env` mismo (aunque sea publishable — good practice gitignore siempre).
- BLOCK commitear cualquier `.env` con `service_role` o `secret_key` (no existe actualmente, pero pre-emptive).

## Ficha

| Campo | Valor |
|-------|-------|
| ID | apps/medioevo-tools-ui/.env |
| Decision ref | "accepto todo" — Tyr 2026-07-25 |
| Visibility | Local Tyr únicamente; cubierto por .gitignore |
| Repo github | NO commiteado (cubierto wildcard) |
| Estado | CERRADO (REVIEW → APPROVE) |
| PANIC brake | Si Supabase anon key se leakara a público, rotar en Supabase dashboard (1 minuto) |
