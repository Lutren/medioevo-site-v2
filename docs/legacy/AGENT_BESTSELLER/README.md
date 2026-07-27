# AGENT_BESTSELLER — Legacy Editorial (Sellado 2026-04)

> Absorción al canon BRAIN_OS autorizada por Tyr, sesión 2026-07-25.

## Qué es

Sistema de agentes editoriales para análisis de mercado literario (bestseller).
18 scripts `.py` + 7 docs + OUTPUTS JSON. Pipeline editorial: perfilador →
minero → analizador → planificador → escritor.

**NO es runtime de agentes. Son scripts de análisis estáticos.**

## Origen

- Path original: `02_MAESTROS_BRAIN_OS/00_CANON_TRANSVERSAL/HISTORIAL/CONSOLIDADO_6MAS1/AGENT_BESTSELLER` (corpus maestro)
- Copias idénticas (47 files cada una, SHA256 verificable):
  - WORKBENCH protegido (intocable)
  - `D:\RESPALDO_BRAIN_OS\02_MAESTROS_BRAIN_OS\...` (respaldo D)
  - `E:\-=Medioevo=-\02_MAESTROS_BRAIN_OS\...` (respaldo E)
- Fuente de copia canon BRAIN_OS: **E corpus** (fuera de WORKBENCH)

## Auditoría 2026-07-17 — `02_CLAUDIO/docs/AUDITORIA_AGENT_BESTSELLER_2026-07-17.md`

**Veredicto:** CERO OVERLAP con Panteón OSIT. Dominio distinto
(editorial/bestseller vs epistémico/agent-runtime). El nombre "Conway" es
coincidencia — Conway de AGENT_BESTSELLER es orquestador editorial;
Conway del Panteón es resolutor de conflictos epistémicos.

**Recomendación:** Archivar como COMPLETO (legacy sellado). No absorber en
Panteón. Si se necesita un pipeline editorial en el futuro, usar como
inspiración.

## Estado

| Campo | Valor |
|-------|-------|
| Disposición | ABSORBIDO a canon BRAIN_OS: `docs/legacy/AGENT_BESTSELLER/contenido/` |
| Vault source Intactas | WORKBENCH + D + E (`HISTORIAL/CONSOLIDADO_6MAS1/AGENT_BESTSELLER`) |
| Decision ref | "absorber" — Tyr 2026-07-25 |
| Próxima acción | NO hay. Sellado. |
| Renacimiento | Solo si Tyr pide revivir un pipeline editorial (extraer fragmentos, no mover nada aquí) |

## Inventario (47 files)

### Docs (~7 archivos)
- 00_RESUMEN_EJECUTIVO.md
- 00_START_HERE.md
- 01_ANALISIS_SAGAS.md
- 02_AUDITORIA_MEDIOEVO.md
- 03_ARQUITECTURA_BESTSELLER.md
- 04_PLAN_EJECUCION.md
- 05_CIERRE_Y_RECOMENDACIONES.md
- 06_PROGRESO_LIBRO_I.md
- CLAUDE_CORE_MEDIOEVO.md
- HANDOFF_EDITORIAL.md

### Scripts (18 .py en `AGENTES.zip`)
- 00_AGENTE_CONWAY (orquestador)
- 01_AGENTE_PERFILADOR
- 02_AGENTE_MINERO
- 03_AGENTE_PREGUNTAS
- 04_AGENTE_ANALISTA
- 05_EJECUCION_AUTOMATICA
- 06_AGENTE_LECTURA_PROFUNDA
- 09_AGENTE_MARKETING_OBSERVACIONAL
- 10_ENCUESTADOR
- 11_AGENTE_RECOLECTOR
- 12_AGENTE_ANALIZADOR
- 13_AGENTE_PLANIFICADOR
- 14_AGENTE_ESCRITOR
- 15_ORQUESTADOR_COMPLETO
- CEO_01-03 + INTEGRADOR

### JSON OUTPUTS (~14 archivos)
Outputs del pipeline (no documentados aquí; ver dentro de `contenido/`).

## ActionGate

- APPROVE: copia al canon BRAIN_OS desde fuente E (no WORKBENCH) — local, reversible, sin secretos, dominio editorial no-crítico.
- WORKBENCH intocable (WORKBENCH_PROTECTION_RULE — ley suprema).

## Ficha

| Campo | Valor |
|-------|-------|
| ID | AGENT_BESTSELLER |
| Decision | ABSORBER (Tyr 2026-07-25) |
| Vault intocables | WORKBENCH + D + E (corpus maestro) |
| Canon BRAIN_OS | `docs/legacy/AGENT_BESTSELLER/contenido/` (47 files, 764 KB) |
| Estado | CERRADO |
