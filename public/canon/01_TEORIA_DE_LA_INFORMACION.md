# 01 — Teoría de la información OSIT/MEDIOEVO actualizada

ESTADO: INFERENCIA operacional con núcleo matemático CERTEZA.  
R_est: 0.22.  
Régimen: teoría usable para compresión, selección de contexto, IA local y bajo recurso.  
Utilidad real: convierte información en decisión bajo costo y residuo.  
Riesgo de humo: medio si se usa para cosmología/física sin medición; bajo si se usa para RAG, TokenSaver y gates.


## Núcleo común OSIT/MEDIOEVO integrado

ESTADO: el marco queda clasificado por estado epistémico, no por entusiasmo ni autoridad.  
Régimen objetivo: local, offline, bajo recurso, auditable, reversible.  
Hardware objetivo mínimo: laptop CPU-only con 8 GB RAM; degradación elegante por BM25/templates si no hay LLM local.  
Riesgo de humo: todo claim sin test, métrica, falsificador o implementación mínima baja a INFERENCIA, INCÓGNITA o BLOQUEADO.

### Estados obligatorios

| Estado | Uso correcto | Prohibición |
|---|---|---|
| CERTEZA | Medido, reproducible, probado o matemáticamente demostrado dentro de dominio explícito. | No usar para hipótesis o intuiciones. |
| INFERENCIA | Modelo razonable con mecanismo y prueba pendiente. | No vender como verdad final. |
| INCÓGNITA | Falta dato, prueba, medición, corpus o ejecución. | No rellenar con narrativa. |
| BLOQUEADO | Acción insegura, irreversible, sobreclaim o falta crítica de evidencia. | No forzar ejecución. |

### Fórmulas canónicas actualizadas

```text
R_or(r1..rn) = 1 - Π(1 - clamp(ri,0,1))
R_charged = max(0, R_pos - R_neg)
U(X;R) = H(X) · (1 - R)
N_T = U(X;R) / (1 + C_tokens + C_mem + C_lat + C_risk)
EML(s,c) = σ(αs - βlog(1+c) - θ), con α=2.2, β=0.65, θ=0.1 por defecto
I_seq(e1..en) = Σ λ^(n-i) I(ei), 0 < λ ≤ 1
Δ(a,b) = I_seq(a∘b) - I_seq(b∘a)
Γ(a,b) = |Δ(a,b)|
```

### Gates mínimos

1. C-GATE: claridad, dominio, límite, recurso, riesgo.  
2. EPISTEMIC-GATE: cada claim se marca como CERTEZA/INFERENCIA/INCÓGNITA/BLOQUEADO.  
3. IOI: entrada → transformación → salida → residuo → falsificador.  
4. GhostGate: simular antes de ejecutar; detectar punto de no retorno.  
5. ActionGate: escribir/modificar solo si hay backup, rollback, test y confirmación cuando aplique.

### Reglas de actualización aplicadas

- Cada documento queda autosuficiente: contiene definiciones, límites, acciones y falsificadores necesarios para usarse sin abrir otro documento.
- No se insertan zips fuente como producto; se reescribe contenido útil dentro de los markdowns.
- Las ideas especulativas se conservan como hipótesis operables, no como resultados demostrados.
- Registro Windows y BIOS/UEFI quedan en auditoría/checklist salvo confirmación humana explícita y backup/rollback.


## 1. Definición operativa de información

Información no se trata como texto acumulado sino como cambio observable que reduce incertidumbre útil bajo un costo. Un dato solo entra al sistema si afecta alguna decisión, prueba, ruta, restricción, riesgo o benchmark.

```text
Información bruta = bits disponibles.
Información usable = bits que sobreviven al residuo y al costo.
Ruido = información que aumenta costo sin mejorar decisión ni prueba.
```

## 2. Residuo como variable central

CERTEZA:
- El residuo representa incertidumbre, contradicción, pérdida, costo, latencia, riesgo o falta de evidencia.
- No debe promediarse cuando hay fallos críticos: por eso se usa noisy-OR.

```text
R_or = 1 - Π(1-r_i)
```

Interpretación:
- Si todos los residuos son cero, `R=0`.
- Si un residuo crítico se acerca a uno, `R` se acerca a uno.
- La contradicción debe pesar más que el estilo o la longitud.

Residuo 7D recomendado:

| Componente | Qué mide | Acción si sube |
|---|---|---|
| sem | ambigüedad semántica | pedir definición o ejemplo |
| mem | pérdida de contexto | comprimir con TokenSaver |
| lat | latencia/costo de espera | usar ruta local o caché |
| priv | privacidad/soberanía | bloquear cloud |
| conf | contradicción | reclasificar claim |
| cost | costo tokens/RAM/CPU | degradar a BM25/template |
| act | riesgo de acción | GhostGate + rollback |

## 3. Información usable

```text
U(X;R) = H(X) · (1 - R)
```

Donde `H(X)` puede ser entropía real, densidad de hechos, novedad o valor decisional. Para uso práctico con documentos largos:

```text
ContextValue = relevance · novelty · (1-R) / (1 + tokens + risk)
```

Esto explica por qué un párrafo corto con una restricción crítica vale más que páginas de narrativa.

## 4. Utilidad neta

```text
N_T = U / (1 + C_tokens + C_mem + C_lat + C_risk)
```

Regla:
- `N_T < 0.15` → BLOQUEO o compresión.
- `0.15 ≤ N_T < 0.35` → revisión.
- `N_T ≥ 0.35` → acción con test.

## 5. EML: expansión/compresión

```text
EML(s,c)=σ(2.2s - 0.65log(1+c) - 0.1)
```

Uso:
- señal alta + costo bajo → expandir.
- señal baja + costo alto → comprimir.
- señal contradictoria → bloquear.

## 6. Termodinámica operacional

INFERENCIA útil:
- Cada decisión, borrado o reconstrucción consume energía/costo.
- En IA local, el costo práctico se mide como RAM, CPU, latencia, tokens, riesgo y fatiga cognitiva.

No afirmar:
- Que OSIT demuestre una nueva ley física.
- Que la conciencia o gravedad queden resueltas.

Sí usar:
- Landauer como metáfora/guía de costo mínimo: no guardar todo, no procesar todo, no expandir sin necesidad.

## 7. Implementación para IA local

Ruta recomendada:

```text
texto largo → TokenSaver L2 → chunks críticos → BM25 local → EML → respuesta con estado → test/falsificador
```

Para 8GB RAM:
- preferir SQLite + BM25 + templates;
- usar LLM local pequeño solo cuando `EML` justifique expansión;
- no cargar modelos grandes si el sistema entra en swap.


## Implementación mínima verificable

```python
import math
from functools import reduce
from operator import mul
from fractions import Fraction

def clamp01(x):
    return max(0.0, min(1.0, float(x)))

def r_noisy_or(values):
    return 1.0 - reduce(mul, (1.0 - clamp01(v) for v in values), 1.0)

def r_charged(pos_values, neg_values):
    return max(0.0, r_noisy_or(pos_values) - r_noisy_or(neg_values))

def eml(s, c, alpha=2.2, beta=0.65, theta=0.1):
    z = alpha*float(s) - beta*math.log1p(max(0.0,float(c))) - theta
    return 1.0/(1.0 + math.exp(-z))

def usable_information(H, R):
    return float(H) * (1.0 - clamp01(R))

def net_utility(H, R, *costs):
    return usable_information(H, R) / (1.0 + sum(max(0.0,float(c)) for c in costs))
```

Tests mínimos obligatorios:

```text
r_noisy_or([0.5,0.5]) == 0.75
r_charged([0.5,0.5],[0.5]) == 0.25
0 < eml(0.8,0.2) < 1
U(H,1)=0
```


## 8. Falsificadores

- Si `ContextValue` no predice mejor recuperación que longitud pura en benchmark de 100 consultas, la métrica falla.
- Si `R_or` no anticipa contradicciones mejor que promedio simple, revisar pesos.
- Si TokenSaver borra restricciones críticas, falla.
- Si BM25 local no recupera el documento correcto en >80% de consultas internas, recalibrar chunking.

## Acción mínima

```bash
python CODIGO_REFERENCIA/test_osit_core.py
python CODIGO_REFERENCIA/token_saver_demo.py input.txt
```
