# Ideas — Backlog Clasificado
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-05-27
**R_est:** 0.40
**Régimen:** INCÓGNITA/INFERENCIA — backlog, no compromisos
**Estado:** Registro de ideas; cada una debe pasar a claim antes de ejecutarse

> Ideas todavía no convertidas en programa ([[19_INVESTIGACIONES]]) ni en hito de
> roadmap ([[14_ROADMAP]]). Regla: **una idea no se ejecuta hasta volverse claim**
> con mecanismo, evidencia y falsificador (ver [[03_MOI_COMPLETO_OPTIMIZADO]]).

---

## 1. Producto / herramientas

| Idea | Estado | Siguiente paso para promoverla |
|---|---|---|
| Template library VibeForge (20+ plantillas) | INCÓGNITA | definir 5 plantillas mínimas + test |
| Integración Lean4 para verificación formal | INCÓGNITA | prueba de concepto sobre 1 lema |
| Dashboard de residuo 7D en tiempo real | INFERENCIA | medir overhead en laptop 8 GB |
| Exportador de handoff a 1 clic (fingerprint) | INFERENCIA | enganchar a token-saver |
| Modo "una pantalla, una acción" (anti-ruido) | INFERENCIA | prototipo UI + test de usabilidad |

---

## 2. IA local

| Idea | Estado | Falsificador |
|---|---|---|
| Escalera de modificación: prompt→RAG→dataset→benchmark→LoRA | INFERENCIA | LoRA prematuro empeora baseline |
| Router simbólico antes de LLM | INFERENCIA fuerte | router no mejora costo/calidad vs LLM directo |
| Memoria SQLite con source_cards por función | INFERENCIA | recall < 60 % en consultas internas |
| Gemma 2B cuantizado como modo `local` | INCÓGNITA | no corre < 6 GB RAM o latencia > 5 s |

---

## 3. Investigación (candidatas a [[19_INVESTIGACIONES]])

- Medir correlación R-complejidad ↔ dificultad práctica en SAT/TSP pequeños.
- Experimento de compensación predictiva de latencia (estímulo visual desplazado).
- ARP: ampliar clases de factorización y comparar contra implementación externa.

---

## 4. Disciplina del backlog

```
idea → ¿tiene mecanismo? → ¿tiene falsificador? → ¿tiene prueba mínima?
   sí a las tres → pasa a claim/roadmap
   no            → permanece aquí como INCÓGNITA
```

No se invierte esfuerzo de ingeniería en una idea que no produce la cadena
`entrada → claim → residuo → falsificador → prueba → acción`.

---

```
R_est:   0.40
Régimen: INCÓGNITA/INFERENCIA — backlog
Handoff: osit-ideas-v1.0-2026-05-27
```
