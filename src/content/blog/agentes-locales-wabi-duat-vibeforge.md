---
title: "Agentes locales: Wabi-Sabi, DUAT y VibeForge"
date: 2026-05-27
category: "Agentes"
estado: "INFERENCIA"
lang: "es"
summary: "Un solo proyecto con tres caras: un autocoder honesto, un orquestador que no actúa sin observar, y un motor que no inventa estado del mundo. Todo offline."
---

## Tres caras, un principio

Cuando se acaban los créditos de la nube, el trabajo no debería detenerse. De ahí nacen tres agentes que comparten el núcleo OSIT -residuo explícito, gates, rollback- y corren en una laptop de 8 GB.

### Wabi-Sabi - autocoder honesto

Del concepto japonés: **la imperfección funcional vale más que la perfección frágil**. Pipeline: `TokenSaver → BM25 → router EML → genera → test → repara (1 intento) → rollback`. Cada cambio deja log con hash. Si `R > 0.80`, reporta jamming y divide - no fuerza output.

### DUAT - orquestador observacionista

Nunca pasa de intención a edición sin **≥ 3 observaciones ancladas a fuente** (archivo, diff, test, log). Y trabaja **hacia atrás**: ¿qué falsificadores deben pasar *antes* de ejecutar? Si alguno falla, no ejecuta.

### VibeForge - render causal

Genera artefactos (código, UI, docs) **desde observaciones verificadas**, sin inventar estado del mundo. Render causal = transformar observación verificada en artefacto verificable.

## Invariantes

1. Ningún artefacto sale sin ≥ 1 test pasado.
2. Ninguna acción destructiva sin rollback.
3. R siempre visible - nada de jamming silencioso.
4. Claims BLOQUEADOS nunca salen como hechos.