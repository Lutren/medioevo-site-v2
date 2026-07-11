# Framework Completo OSIT — Referencia Formal
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-05-27
**R_est:** 0.20
**Régimen:** CERTEZA (núcleo matemático y gates) / INFERENCIA (puentes)
**Estado:** Referencia formal del framework

> OSIT = *Observation-based Systems and Information Thermodynamics*.
> Marco de gobernanza epistémica para operaciones de IA eficientes en tokens.
> Versión operacional/aplicada en [[04_OSIT_COMPLETO]]; teoría en [[01_TEORIA_DE_LA_INFORMACION]]
> y [[02_MATEMATICAS_COMPLETAS]].

---

## 1. Estados epistémicos (álgebra de Heyting de 4 valores)

```
BLOQUEADO < INCÓGNITA < INFERENCIA < CERTEZA
```

| Estado | Criterio | Acción de salida |
|---|---|---|
| CERTEZA | definición, prueba, test local, dato estable | integrar directo |
| INFERENCIA | hipótesis útil con límite claro | usar con etiqueta |
| INCÓGNITA | falta evidencia o medición | enviar a investigación |
| BLOQUEADO | riesgo, secreto, física sin soporte, privacidad | no usar como hecho |

Negación (ANTI): `~CERTEZA = INCÓGNITA`, `~INFERENCIA = INCÓGNITA`,
`~INCÓGNITA = CERTEZA`, `~BLOQUEADO = CERTEZA`.

---

## 2. Cálculo de residuo

```
R_or = 1 − Π_i (1 − r_i)                  # noisy-OR; un fallo crítico no se diluye
R_charged = max(0, R_pos − R_neg)         # la evidencia cancela, no promedia
```

Vector de residuo 7D (`ResidueVector`): `sem, mem, lat, priv, conf(×1.25), cost, act`.

| R | Régimen | Acción |
|---|---|---|
| 0.00–0.15 | óptimo | avanzar directo |
| 0.15–0.35 | manejable | avanzar, registrar decisiones |
| 0.35–0.60 | alerta | avanzar con revisión y tests pequeños |
| 0.60–0.80 | riesgo alto | revisar antes de actuar |
| 0.80–1.00 | bloqueo | bloquear, dividir, exigir evidencia |

---

## 3. Información usable y utilidad neta

```
U(X;R) = H(X) · Φ(R)            con Φ(R) = 1 − R (canónica), o exp(−R/τ), o (1−R)^k
N_T(X) = U(X;R) / (1 + m(X)) · (1 − |q(X)|·R(X))
```

Reglas: `N_T < 0.15 → BLOQUEO/DRY_RUN`; `ΔU > 0` sin evidencia externa exige
`ΔR ≥ k·(ΔU)²` (penalización por alucinación).

---

## 4. Selector EML (expandir vs comprimir)

```
EML(s,c) = σ(α·s − β·log(1+c) − θ)        # α=2.2, β=0.65, θ=0.1 por defecto
```

| EML | Acción |
|---|---|
| ≥ 0.75 | ACEPTAR / integrar |
| 0.50–0.75 | EXPANDIR / pedir evidencia |
| 0.25–0.50 | COMPRIMIR / mínimo |
| < 0.25 | BLOQUEAR / DRY-RUN |

Punto crítico: `s* = (β·log(1+c) + θ)/α`.

---

## 5. GammaOptimizer (orden del contexto)

```
Γ(A,B) = |I_seq(A∘B) − I_seq(B∘A)|        I_seq(e1..en) = Σ λ^(n−i) I(e_i)
```

Heurística: intercalar cargas opuestas por masa descendente. Complejidad O(k log k).

---

## 6. Pipeline MOI

```
INTAKE → DO → C-GATE → EPISTEMIC-GATE → IOI → TEST → SOURCECARD → HANDOFF → DRIFT-CHECK
```

Plantillas canónicas (Source Card y Handoff) en [[03_MOI_COMPLETO_OPTIMIZADO]].

---

## 7. Falsificadores del framework

| ID | Test | Promueve a CERTEZA si |
|---|---|---|
| F1 | U(X;R) vs H(X) en decisiones binarias | U predice calidad > baseline |
| F2 | R_or vs error real | correlación > 0.7 |
| F3 | R_charged vs R_or | reduce falsa certeza con anti-evidencia |
| F4 | EML vs umbral fijo | mejor costo/calidad |
| F_landauer | ahorro de energía medido | E_real baja con política reversible |

---

## 8. Qué NO es OSIT

- **No** es física cuántica. Usa solo estructura matemática isomorfa.
- **No** reemplaza a Shannon. Lo extiende para sistemas con estado y costo físico.
- **No** es prueba de P ≠ NP. Define R-complejidad como métrica continua.
- **No** es matemática nueva. Es composición sistemática de Shannon + Landauer +
  control óptimo + noisy-OR.

## 9. Φ_eff, régimen de jamming y OSO

**Eficiencia efectiva** (variante con umbral de saturación `J_c`):

```
Φ_eff = exp(−ν · R / (J_c − R))     # cae a 0 cuando R → J_c (jamming)
```

Régimen operativo global por R (5 niveles): ÓPTIMO (<0.15) · FUNCIONAL (0.15–0.40) ·
CARGADO (0.40–0.70) · SATURADO (0.70–0.90) · JAMMING (>0.90). Al acercarse a `J_c` el
sistema "se atura" y deja de asimilar información (protección anti-sobrecarga).

**OSO — Objeto de Estado Observador:** estructura serializable y portátil que encapsula
el estado completo de un agente ("cuerpo digital"): señales, R, Φ_eff, memorias
(episódica/semántica/procedimental), ontología y gates. Transferible entre dispositivos
sin reentrenamiento → continuidad cognitiva (base del handoff; ver [[21_SISTEMAS]], [[08_AGENTES]]).

## 10. Extensiones operativas (1ª ronda de integración) · INFERENCIA

Ampliaciones del núcleo que lo vuelven un "metabolismo informacional" de bajo recurso:

- **Contradiction Guard + Residuo Cargado:** al detectar contradicción explícita, el
  residuo global se multiplica por `w_conf = 1.25`; evidencias de distinto signo se
  cancelan algebraicamente (no se promedian) → un fallo crítico no se diluye entre aciertos.
- **Monitoreo dinámico del residuo:** además de R se vigilan su velocidad `R_vel` y
  aceleración `R_acc`. **Pre-jamming** si `R_vel > 0.05 ∧ R_acc > 0` → detener emisión
  antes de alcanzar el colapso. Lo implementa un `ResidueTracker`.
- **Factor cognitivo Ψ(C):** la utilidad efectiva se amplía a
  `U_eff(X;R,C) = H(X)·Φ(R)·Ψ(C)`, donde Ψ(C) captura fatiga, estrés, atención y ciclo
  circadiano. Arranca como señal manual ("modo fatiga") hasta tener biométricos. [INCÓGNITA medición]
- **Compresión por capas L0–L3 + Sparse HDC:** L0 (frase crítica) → L3 (texto completo);
  para persistir estado en < 8 MB se propone codificación hiperdimensional dispersa
  (vector de estado en ~64 bytes). Viabilidad en 8 GB RAM: INCÓGNITA.
- **GammaOptimizer:** reordena chunks alternando masa y carga para minimizar contaminación de orden.
- **Arquitectura BDI-OSIT:** `señal → filtro → atractor → memoria → salida`, con fase
  belief-desire-intention; trata la IA como metabolismo informacional, no como predictor de lenguaje.
- **Landauer (termodinámica):** borrar/recordar un bit cuesta ≥ `k_B·T·ln2`; ahorrar
  tokens también ahorra energía → la optimización es termodinámica, no solo económica.
- **Correcciones formales:** `I_seq(e1∘…∘en) = Σ λ^(n−i)·I(e_i)` (0<λ≤1, lo reciente pesa más);
  topología `d_E(a,b) = |I(a)−I(b)| + |τ(a)−τ(b)|`; **carga como clase de equivalencia**:
  existe potencial escalar `q(a)` solo si la 1-cohomología es trivial; si no, la carga es
  vector/tensor (no toda incertidumbre es escalarmente compensable).
- **μ_F (Fibonacci-Dirichlet):** correcto matemáticamente pero **numéricamente inestable**
  → **BLOQUEADO para producción**, solo laboratorio (ver [[02_MATEMATICAS_COMPLETAS]]).

---

```
R_est:   0.20
Régimen: CERTEZA (núcleo) / INFERENCIA (puentes)
Handoff: osit-framework-ref-2026-05-27
```
