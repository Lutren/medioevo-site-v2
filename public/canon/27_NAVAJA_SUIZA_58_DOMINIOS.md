# 27 — Navaja Suiza OSIT: 58 dominios reformulados

**Autor:** Luis René González López (Tmuyn) · **Fecha:** 2026-05-26 / consolidado 2026-05-30
**R_est:** 0.15 · **Régimen:** FUNCIONAL
**Estado:** CERTEZA computacional (los solvers corren y producen los R indicados) ·
**INFERENCIA** en los claims de "novedad/unificación" (OSIT es lente de reformulación, no prueba de superioridad)

> "Navaja suiza" = Claudio como ejecutor (D004). Demostración de que las primitivas OSIT
> (R-métrica, VSA `bind`/`bundle`/`sim`, EML, Φ_eff, autómata de regímenes, ActionGate)
> **reformulan** problemas de 58 dominios distintos con un mismo lenguaje operacional.
> Código runnable: [[CODIGO]]/`osit_navaja_suiza_COMPLETA.jsx` (Vol I–III, 43 dominios) y
> `osit_navaja_suiza_v4.jsx` (Vol IV, 15 dominios). Relacionado: [[16_SOLUCIONES]],
> [[16b_OSIT_100_PROBLEMAS_PROTEGIDO]], [[02_MATEMATICAS_COMPLETAS]], [[01_TEORIA_DE_LA_INFORMACION]].

---

## Lectura honesta (anti-humo)

- **CERTEZA:** cada solver es código JS autocontenido que ejecuta y emite un valor `R` y un
  régimen (ÓPTIMO/FUNCIONAL/CARGADO/SATURADO/JAMMING) reproducibles en navegador.
- **INFERENCIA:** que la reformulación OSIT *iguale o supere* al método estándar del dominio
  (p. ej. embeddings preentrenados en NLP, GLS en álgebra lineal) **no está demostrado**;
  son demostraciones de expresividad, no benchmarks comparativos.
- **No** es matemática nueva ni física nueva (coherente con [[02_MATEMATICAS_COMPLETAS]] §0/§17):
  es un **sistema de unión de patrones observables** que compone estructuras existentes.

## Primitivas comunes a todos los dominios

```
R-métrica:  R ∈ [0,1], régimen por umbrales 0.15 / 0.35 / 0.60 / 0.80
VSA (D=256): rv(seed)=vector binario, xor=bind, bundle=mayoría, sim=1−Hamming/D
S_e(r):     entropía binaria;  EML(x)=exp(x)−log(x)  (selector)
ActionGate: actuar sólo cuando R cruza umbral del dominio
```

---

## Vol IV — 15 dominios nuevos (`osit_navaja_suiza_v4.jsx`, 2026-05-26)

| # | Dominio | Reformulación OSIT | R / régimen | Novedad (INFERENCIA) |
|---|---|---|---|---|
| 1 | Álgebra Lineal | rango = filas con R<0.20; `R(fila)=1−‖residuo Gram-Schmidt‖/‖fila‖`; dependencia lineal = JAMMING | 0.09 ÓPTIMO | dependencia como jamming informacional |
| 2 | T. Categorías | objeto→vec, morfismo `f:A→B`=bind(A,B), composición=bind(f,g); funtor coherente si `sim(F(g∘f),F(g)∘F(f))` alto | 1−preservación | funtores como morfismos en espacio de Hamming |
| 3 | NLP Sentimiento | `sent_vec=bundle(rv(hash(wᵢ)))`; `R_ambig=1−|sim_pos−sim_neg|·2` | min de R | polaridad sin embeddings preentrenados |
| 4 | Física N-cuerpos | colisión si `κ(i,j)=1−d/r_max > 0.7`; potencial `U=−S_e(d/r_max)` | R final del sistema | colisiones sin bounding boxes (curvatura local) |
| 5 | Teoría Musical | nota→rv(freq), acorde=bundle; `disonancia=1−sim(acorde, C-mayor)=R` | R de acorde disonante | armonía como geometría en Hamming |
| 6 | Juegos Evolutivos | `R(estrategia)=1−(fit−min)/(max−min)`; ESS=argmin R; dinámica de replicador | R del ESS | ESS como mínimo de R-métrica |
| 7 | QKD (BB84) | `QBER = R_canal`; Eve detectada si R>0.11 → abortar | = QBER | QBER es directamente el R del canal cuántico |
| 8 | Astronomía | tránsito de exoplaneta: `R(t)=|flujo−basal|/basal`; período = separación de picos | ≈ profundidad | fotometría de tránsito como R temporal |
| 9 | Transformada Hough | punto vota en (θ,ρ); línea = pico = Φ_eff; `R=1−Φ_eff` | R_detección | detección geométrica como máximo de Φ_eff |
| 10 | Química Comput. | `E_enlace ∝ −sim(orbital_A, orbital_B)`; `R_enlace=1−sim` | R del enlace fuerte | solapamiento orbital = sim de Hamming |
| 11 | Control PID | `R(t)=|e(t)|/setpoint`; converge cuando R→0 (ÓPTIMO) | R al converger | PID como navegador del autómata de regímenes |
| 12 | Minería de Datos | regla Apriori: `R=1−confianza`; fuerte si R<0.40 | min de R | Apriori como minimización de R |
| 13 | Geometría Algebraica | variedad `V(f)={x : R(x,f)=|f(x)|/f_max < ε}` | 0.05 | variedades como atractores del autómata |
| 14 | RNN (VSA) | `h_t=bundle(bind(h_{t-1},t), bind(x_t,t))`; memoria = sim entre estados | 1−sim patrón | memoria temporal emerge de geometría VSA |
| 15 | Metacognición | `R₁`=incertidumbre del objeto; `R₂_meta`=incertidumbre sobre R₁; sistema fiable si R₂<0.35 | R₂(OSIT)≈0.15 | OSIT evalúa su propia incertidumbre |

---

## Vol I–III — 43 dominios (`osit_navaja_suiza_COMPLETA.jsx`)

**Vol I · 13 —** Programación · Aritmética · Álgebra · Geometría · Matemáticas · T. Números ·
Primos · Interfaz · Memoria · Sistemas · Recursos · Energía · Grafos.

**Vol II · 15 —** Criptografía · Estadística · Redes Neuronales · T. Juegos · Códigos Correctores ·
Bioinformática · Lógica/SAT · Señales · Bases de Datos · Machine Learning · Combinatoria · Cálculo ·
Probabilidad · Optimización · Topología.

**Vol III · 15 —** T. Autómatas · Mecánica Cuántica · Compiladores · Geom. Diferencial ·
Redes Complejas · Economía · Fractales · T. Grafos (MST) · Termodinámica · Análisis Numérico ·
Lingüística · Robótica · Epidemiología · Visión Comp. · Filosofía de la Ciencia.

> Vol III incluye un meta-solver de **novedad científica**: `Novedad(T)=|R_pred−R_consenso|`
> (>0.30 REVOLUCIÓN, >0.15 SIGNIFICATIVA, si no INCREMENTAL) — usado como falsificador del
> propio marco, no como veredicto.

---

## Falsificadores del artefacto

| ID | Enunciado | Estado |
|---|---|---|
| F-NS1 | Cada solver ejecuta sin excepción y emite R∈[0,1] | PASS (en navegador) |
| F-NS2 | El régimen mostrado coincide con los umbrales de R | PASS (por construcción) |
| F-NS3 | La reformulación OSIT supera al método estándar del dominio | **PENDIENTE / INCÓGNITA** (sin benchmark comparativo) |
| F-NS4 | "TODO CERTEZA" en la UI es preciso | **CORREGIDO**: CERTEZA aplica a la *ejecución*, no a la superioridad del método |

---

## Procedencia
- Fuente: `osit_navaja_suiza_COMPLETA.jsx` (43 dominios, Vol I–III) y `osit_navaja_suiza_v4.jsx`
  (15 dominios, Vol IV), recibidos 2026-05-30; preservados en [[CODIGO]].
- FP del artefacto: `MEDIOEVO-NSVIV-20260526`.
- Consolidado a canon 2026-05-30 con corrección de sobreclaim (F-NS3/F-NS4 marcados).

`OSIT Navaja Suiza · 58 dominios · 4 volúmenes · R_est 0.15 · FUNCIONAL`
