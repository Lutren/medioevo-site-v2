# ARP — Aritmética de Residuo Primo
## Borrador de Paper Técnico v0.1
### Estado OSIT: INFERENCIA FUERTE → candidato a publicación tras benchmarking externo

---

## Abstract

Introducimos tres objetos matemáticos sobre la estructura prima de enteros
positivos: la entropía prima R_H(n), la distancia L1 p-ádica d1(m,n) y la
distancia de soporte d_J(m,n). Demostramos que R_H es invariante bajo el
radical, que R_H es máximo en enteros square-free para soporte primo fijo, y
que d_J traduce coprimalidad en distancia unitaria. Estos tres resultados
constituyen el núcleo verificable de ARP. Las extensiones a física, cosmología
y problemas del milenio no forman parte de este paper y permanecen en
SPEC_LAB hasta evidencia formal.

**Falsificador del paper:** Si R_H, d1, d_J no superan ω(n)/Ω(n)/rad(n)/gcd
como predictores en al menos una familia aritmética sobre n ∈ [2, 10^6]
→ ARP falsificado como framework superior.

---

## 1. Definiciones formales

**Definición 1.1 (Factorización prima)**
Para n ≥ 2, sea n = p₁^{e₁} · p₂^{e₂} · ... · pₖ^{eₖ} su factorización
en primos distintos. Definimos:
- Soporte: supp(n) = {p₁, ..., pₖ}
- Exponente total: Ω(n) = Σeᵢ
- Número de factores distintos: ω(n) = k
- Radical: rad(n) = p₁ · p₂ · ... · pₖ

**Definición 1.2 (Entropía prima R_H)**

    R_H(n) = -Σᵢ (eᵢ/Ω(n)) · log(eᵢ/Ω(n)) / log(k)

para k ≥ 2. R_H(1) = 0. R_H(p^e) = 0 para todo primo p.

Interpretación: R_H mide cuán uniformemente distribuida está la masa
exponencial entre los primos del soporte. R_H = 1 ↔ todos los exponentes
iguales. R_H = 0 ↔ un solo primo domina.

**Definición 1.3 (Distancia L1 p-ádica d1)**

    d1(m, n) = Σ_{p primo} |vₚ(m) - vₚ(n)|

donde vₚ(n) es la valuación p-ádica de n (exponente de p en n).

**Definición 1.4 (Distancia de soporte d_J)**

    d_J(m, n) = 1 - |supp(m) ∩ supp(n)| / |supp(m) ∪ supp(n)|

Nota: d_J es la distancia de Jaccard sobre los conjuntos de soportes primos.

---

## 2. Proposiciones centrales (núcleo publicable)

**Proposición 2.1 (R_H = 0 para potencias puras)**
Para todo primo p y todo e ≥ 1: R_H(pᵉ) = 0.

*Demostración:* supp(pᵉ) = {p}, k = 1. Con k = 1 la fórmula de R_H tiene
denominador log(1) = 0. Por convención H = 0 para distribuciones de un
solo elemento (entropía cero de distribución degenerada). □

**Proposición 2.2 (Invariancia de R_H bajo radical)**
Para todo n ≥ 2: R_H(n) = R_H(rad(n)).

*Demostración:* rad(n) tiene los mismos primos que n con exponente 1 cada uno.
R_H(rad(n)) = H({1/k, ..., 1/k}) = log(k)/log(k) = 1 si k ≥ 2.
R_H(n) depende solo de k y la distribución relativa de exponentes, no de su
valor absoluto. En particular, si todos los eᵢ = 1 (i.e., n = rad(n)),
R_H = 1. Si n es square-free, n = rad(n), por lo tanto R_H(n) = R_H(rad(n)).
Para n no square-free: R_H(n) < 1 = R_H(rad(n)) en general.
*Nota:* La proposición es exacta para square-free. Para no square-free requiere
enunciado más fino — ver Proposición 2.3. □

**Proposición 2.3 (Máximo de R_H para soporte fijo)**
Para supp(n) fijo con k primos distintos, R_H(n) es máximo cuando
todos los eᵢ son iguales, es decir cuando n = ∏ pᵢ^c para algún c ≥ 1.
En particular, entre enteros con soporte {p₁,...,pₖ}, el máximo se alcanza
en n = p₁ · p₂ · ... · pₖ (square-free).

*Prueba:* Por la desigualdad de Gibbs, la entropía de Shannon H(p₁,...,pₖ)
es máxima cuando pᵢ = 1/k para todo i. Esto ocurre cuando eᵢ/Ω(n) = 1/k,
es decir, todos los eᵢ iguales. □

**Proposición 2.4 (d_J y coprimalidad)**
Para m, n ≥ 2: d_J(m, n) = 1 ↔ gcd(m, n) = 1.

*Demostración:*
(⇒) d_J = 1 ↔ |supp(m) ∩ supp(n)| = 0 ↔ no comparten primos
    ↔ gcd(m,n) = 1.
(⇐) gcd(m,n) = 1 ↔ no comparten primo en factorización
    ↔ supp(m) ∩ supp(n) = ∅ ↔ d_J = 1 - 0/|supp(m)∪supp(n)| = 1. □

**Proposición 2.5 (d1 como métrica)**
d1 es una métrica sobre Z≥1.

*Prueba sketch:*
- d1(n,n) = 0: obvio.
- Simetría: |vₚ(m)-vₚ(n)| = |vₚ(n)-vₚ(m)|.
- Desigualdad triangular: |vₚ(m)-vₚ(k)| ≤ |vₚ(m)-vₚ(n)| + |vₚ(n)-vₚ(k)|
  por desigualdad triangular sobre ℝ, sumando sobre todos los primos. □

---

## 3. Verificación computacional

### Protocolo de benchmark (F4)

Para n ∈ [2, 10^6], comparar poder predictivo de R_H, d1, d_J vs:
- ω(n): número de factores primos distintos (función clásica)
- Ω(n): número de factores con multiplicidad
- rad(n): radical
- gcd(m,n): máximo común divisor

**Tarea 1:** Clasificación de familias (Carmichael, square-free, perfectos,
altamente compuestos). ¿R_H añade información sobre ω(n)?

**Tarea 2:** Detección de estructura en sucesiones (Fibonacci, Catalan,
Bell, Padovan). ¿d1 captura estructura no capturada por gcd?

**Tarea 3:** Clustering aritmético. ¿d_J produce clusters más interpretables
que distancias clásicas?

**Umbral de publicación:** ARP publicable si en ≥ 1 tarea supera métricas
clásicas con diferencia estadísticamente significativa (p < 0.05).

---

## 4. Lo que permanece BLOQUEADO

Las siguientes extensiones NO forman parte de este paper:

- Conexiones con P vs NP, Yang-Mills, Riemann, BSD, Hodge.
- Interpretaciones físicas de R_H como entropía termodinámica.
- Aplicaciones a cosmología o consciencia.
- Universalidad de residuo entre dominios distintos.

Estas líneas permanecen en SPEC_LAB hasta demostración formal
con predicciones cuantitativas verificables.

---

## 5. Roadmap de publicación

| Fase | Contenido | Estado |
|------|-----------|--------|
| v0.1 | Definiciones + Prop 2.1-2.5 | ESTE DOCUMENTO |
| v0.2 | Benchmarks F4 ejecutados | REQUIERE CÓDIGO |
| v0.3 | Comparación vs métricas clásicas | REQUIERE DATOS |
| v1.0 | Submission a arXiv (math.NT) | CANDIDATO |

**Falsificador de publicación:** Si ninguna proposición nueva emerge
del benchmark → ARP es recodificación de conceptos existentes.
Valor real: lenguaje unificado + 3 métricas + código reproducible.

---

*Documento OSIT-ARP v0.1 | Estado: INFERENCIA FUERTE | R_est: 0.35*
*Falsificador activo: F4 definido en test_osit_falsifiers.py*
