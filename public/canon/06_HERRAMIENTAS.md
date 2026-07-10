# Herramientas OSIT
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-06-26 (actualizado)
**R_est:** 0.12
**Régimen:** CERTEZA operacional (herramientas matemáticas + utilidades CLI) / INFERENCIA (motores extendidos)
**Estado:** Publicable. Catálogo matemático expandido con herramientas GLM 5.2 (2026-06-20).

> Las **skills** se documentan en [[07_SKILLS]] y los **agentes** en [[08_AGENTES]].
> Este documento cubre las utilidades técnicas (motores y CLIs).

---

## 0. Inventario de herramientas

| Herramienta | Tipo | Estado | Versión |
|---|---|---|---|
| EML Search | Motor de búsqueda local | INFERENCIA | v0.4 |
| Prime Residue Analyzer (ARP) | CLI Python | CERTEZA matemática | v0.1 |
| Context Compiler | Compilador de contexto | INFERENCIA fuerte | v0.3 |
| BM25 + SQLite store | Recuperación local | CERTEZA operacional | v0.3 |
| token_saver.py (script) | Compresión determinista | CERTEZA operacional | v0.5 |

---

## 1. EML Search — Motor de búsqueda local

Recuperación semántica local con BM25 + embeddings ligeros sobre SQLite. Sin cloud.

```
query → TokenSaver (comprime query) → BM25 (candidatos) → EML score (ranking) → top-K
```

**Target:** > 80 % de recuperación en consultas internas (INCÓGNITA hasta benchmark
real), latencia < 500 ms en laptop 8 GB.

---

## 2. Prime Residue Analyzer (ARP)

CLI Python que calcula R_H(n) y métricas de factorización prima. Offline, sin
dependencias. Es el sustrato del análisis ARP descrito en [[02_MATEMATICAS_COMPLETAS]].

```python
from prime_residue_analyzer import analyze
analyze(210)
# {"n":210,"factorization":{"2":1,"3":1,"5":1,"7":1},"omega_big":4,
#  "radical":210,"residue_entropy":1.0,"class":"square_free_maximo", ...}
```

**Falsificador:** R_H(p) ≠ 0 para algún primo p → PASS (prueba).

---

## 3. Context Compiler

Resuelve el problema de "8 GB de RAM insuficientes para contexto gigante":

- No cargar todo; indexar; comprimir; pasar solo archivos relevantes.
- Preservar hechos críticos (delega en token_saver, [[07_SKILLS]]).
- Salida: paquete de contexto mínimo con fingerprint.

---

## 4. BM25 + SQLite store

Recuperación sin embeddings pesados. Es el modo `base` de Wabi-Sabi ([[10_WABI_SABI]]):
funciona siempre, offline, en hardware mínimo. SQLite guarda source_cards, claims y
witness log.

---

## 5. token_saver.py (script determinista)

```bash
python token-saver/scripts/token_saver.py --input doc.txt --level L2
```

Implementación reproducible del contrato TokenSaver (ver skill en [[07_SKILLS]] y
documento completo [[17_TOKEN_SAVER]]). Opciones: `--level {L0,L1,L2,L3}`,
`--max-items N`, `--output FILE`.

---

## 6. Falsificadores por herramienta

| Herramienta | Falsificador clave | Estado |
|---|---|---|
| EML Search | recuperación < 60 % en test interno | INCÓGNITA |
| ARP | R_H(p) ≠ 0 para algún primo | PASS (prueba) |
| Context Compiler | pierde una restricción crítica al comprimir | PASS (lógica) |
| token_saver.py | F1 < 0.85 en fixtures reales | INCÓGNITA |

---

---

## 7. Herramientas Matemáticas OSIT [CERTEZA] — GLM 5.2 (2026-06-20)

### Residuo

| Herramienta | Fórmula | Uso |
|---|---|---|
| **R_or** | `1 − ∏(1−Rᵢ)` | Combinar incertidumbres independientes (no promediar) |
| **R_charged** | `(Σᵢ Rᵢ·signᵢ)/n` | Fuentes opuestas: evidencia contraria resta |
| **R_global_7d** | `Σₖ weightₖ·Rₖ`, pesos `[0.35,0.25,0.20,0.10,0.05,0.03,0.02]` | Residuo agregado de 7 días |

### Modulación

| Herramienta | Fórmula | Nota |
|---|---|---|
| **EML_OSIT** | `sigmoid(2.2s − 0.65·log(1+c) − 0.1)` | Canónica implementada |
| **Φ_eff** | `exp(−ν·R/(Jc−R))` | Forma candidata. ⚠️ 2026-06-26: medición en degradación de contexto LLM favorece forma **logarítmica** (R²=0.99) sobre la exponencial (R²=0.18). El dominio decide la forma — no asumir universal. |
| **χ*** | `W(1) ≈ 0.567143` (Lambert W) | Umbral de ingeniería, NO transición de fase |

### ARES — Aritmética de Residuo Exacto

Representar valores como pares `(E, R)` donde E = parte exacta, R = residuo de representación.  
Regla: **decimal solo en capa UI**; toda cadena interna usa `(E, R)`.  
Zonas: RNS, aritmética p-ádica, pares exp/log, punto fijo exacto.

### Información secuencial

```
I_seq(x₁,...,xₙ) = Σᵢ wᵢ·I(xᵢ) + λ·Σᵢ<ⱼ Δ(xᵢ,xⱼ)
```
El orden importa; la recencia pesa (wᵢ decrece hacia el pasado).

### F_LANDAUER (falsificador de computación física)

Obligatorio para claims de computación física. Si un claim excede energía disponible,
operaciones lógicas máximas o cota de almacenamiento → **BLOQUEADO**.

### Anti-información

```
I_anti = KL(P‖Q)
```
Mide información destruida al aproximar Q con P. Marco Shannon/Kullback-Leibler.

### Matriz epistémica de referencia

| Estado | R band | Acción |
|---|---|---|
| CERTEZA | R < 0.25 | Ejecutar |
| INFERENCIA | 0.25–0.55 | Ejecutar con log |
| INCÓGNITA | 0.55–0.80 | Pedir más evidencia |
| BLOQUEADO | R ≥ 0.80 | Detener |

---

## 8. Herramientas de Observacionismo Inverso [INFERENCIA]

| Herramienta | Concepto | Estado |
|---|---|---|
| **VpR** | Vectorización del residuo como vector topológico | INFERENCIA |
| **FBI** | Filtros Binarios Infinitos — lazy evaluation epistémica | INFERENCIA |
| **RAIT estabilizado** | `rait_collapse_loss_STABLE` con `R_safe = clamp(R, max=Jc−margin)` | CERTEZA que la versión sin clamp produce NaN |
| **DO→IOI** | Deconstrucción Observacional → Inferencia Observacional Inversa | INFERENCIA activa |

---

```
R_est:   0.12
Régimen: CERTEZA operacional (matemáticas + CLIs) / INFERENCIA (motores extendidos)
Handoff: osit-herramientas-v2.0-2026-06-26
```
