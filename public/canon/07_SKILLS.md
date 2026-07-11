# Skills OSIT
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-05-27
**R_est:** 0.20
**Régimen:** CERTEZA operacional para skills implementados
**Estado:** Publicable como catálogo técnico

> Herramientas técnicas en [[06_HERRAMIENTAS]] · agentes en [[08_AGENTES]] ·
> TokenSaver en detalle en [[17_TOKEN_SAVER]].

---

## 0. Inventario de skills

| Skill | Plataforma | Estado | Versión |
|---|---|---|---|
| token-saver | claude.ai + opencode | CERTEZA operacional | v0.5 |
| osit-claim-classifier | opencode | CERTEZA operacional | v1.0 |
| osit-residue-tracker | opencode | CERTEZA operacional | v1.0 |
| brain-os-auditor | opencode | CERTEZA operacional | v1.0 |

El skill `token-saver` está instalado globalmente en `~/.claude/skills/token-saver/`
y activo always-on (ver regla en `CLAUDE.md`).

---

## I. token-saver (v0.5)

Comprime contexto para cualquier LLM preservando hechos que afectan decisiones.
Activar con texto > ~500 palabras, handoffs, RAG, o al mencionar "tokens/contexto
largo/comprimir". Documento completo: [[17_TOKEN_SAVER]].

```
Paso 1: estimar tokens (len/4) y R → si BLOQUEADO o R≥0.80: STOP
Paso 2: extraer hechos críticos (scoring por señales)
Paso 3: aplicar nivel L1/L2/L3
Paso 4: chunking con overlap para docs > 3000 tokens
Paso 5: reportar ahorro + fingerprint
```

---

## II. osit-claim-classifier (v1.0)

Clasifica claims en CERTEZA/INFERENCIA/INCÓGNITA/BLOQUEADO e impide que claims
peligrosos lleguen a output.

```
RAW TEXT → ATOMIZE → CLASSIFY → GATE → REWRITE → HANDOFF
```

| Estado | Criterio | Ejemplo |
|---|---|---|
| CERTEZA | test/hash/benchmark presente | `test_rollback.py pasó 12/12` |
| INFERENCIA | hipótesis útil con mecanismo | `R puede estimar carga cognitiva` |
| INCÓGNITA | sin evidencia explícita | `OSIT optimiza hiperespacio de fase` |
| BLOQUEADO | física sin prueba, secretos, acción destructiva | `fotón=electrón`, `AGI logrado` |

**Siempre BLOQUEAR:** claims de que OSIT prueba física/conciencia/AGI; que R/Φ/EML
son constantes físicas validadas; secretos/keys; operaciones destructivas sin rollback.

---

## III. osit-residue-tracker (v1.0)

Estima y monitorea R en 7 dimensiones, detecta jamming y recomienda régimen.

```python
r = {sem, mem, lat, priv, conf(×1.25), cost, act}   # cada uno 0.0–1.0
R_or = 1 − Π(1 − r_i)
```

```
0.00–0.15 ÓPTIMO · 0.15–0.35 FUNCIONAL · 0.35–0.60 PRE-JAMMING
0.60–0.80 JAMMING · 0.80–1.00 BLOQUEADO
```

---

## IV. brain-os-auditor (v1.0)

Audita el ecosistema BRAIN_OS (solo lectura) buscando: duplicados (SHA-256), docs
obsoletos (30+ días), source cards faltantes, secretos expuestos, logs > 10 MB y
drift arquitectural vs. el árbol canónico.

**Reglas de seguridad:** solo lectura; no reporta `.git/` ni `node_modules/` sin
instrucción; nunca imprime valores de secretos.

---

## V. Falsificadores

| Skill | Falsificador | Estado |
|---|---|---|
| token-saver | F1 < 0.85 en fixtures reales | INCÓGNITA |
| claim-classifier | un claim BLOQUEADO llega a output | PASS (lógica) |
| residue-tracker | R < 0.15 con un componente = unknown | PASS (regla) |
| brain-os-auditor | secreto impreso durante auditoría | PASS (lógica) |

---

```
R_est:   0.20
Régimen: CERTEZA operacional (skills implementados)
Handoff: osit-skills-v1.0-2026-05-27
```
