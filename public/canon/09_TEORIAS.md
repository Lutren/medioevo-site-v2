# 08 — Teorías OSIT convertidas en claims verificables

ESTADO: INFERENCIA/HIPÓTESIS, no demostración.  
R_est: 0.44.  
Régimen: incubadora científica con falsificadores.  
Utilidad real: conservar ideas raras solo si producen predicción, métrica o herramienta.  
Riesgo de humo: alto si se presentan como ciencia cerrada.


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


## 1. Regla de conversión

Toda teoría debe pasar por:

```text
intuición → claim verificable → mecanismo posible → experimento mínimo → falsificador → implementación
```

Si no predice ni comprime ni mejora, queda como metáfora.

## 2. Teoría de observación y residuo

Claim:
- todo sistema observable deja residuo por límites de canal, memoria, resolución y costo.

Mecanismo:
- filtro finito sobre flujo de eventos.

Prueba mínima:
- medir pérdida de recuperación en RAG bajo compresión controlada.

Falsificador:
- si un sistema finito reconstruye entrada arbitraria sin pérdida ni costo creciente.

Estado: INFERENCIA fuerte para ingeniería; BLOQUEADO como ontología total.

## 3. Percepción predictiva / 80 ms

Claim:
- el cerebro compensa latencia sensorial mediante predicción.

Mecanismo:
- modelos internos + error de predicción.

Experimento:
- estímulos desplazados temporalmente, medir respuesta y corrección.

Falsificador:
- ausencia de adelanto predictivo medible.

Estado: INFERENCIA.

## 4. Colapso cuántico como saturación de observación

Claim permitido:
- puede modelarse el “colapso” en sistemas de medición como transición de INCÓGNITA a CERTEZA al superar umbral de resolución.

BLOQUEADO:
- afirmar que esto resuelve la mecánica cuántica.

Experimento análogo:
- sensores con umbral y ruido, comparar transición probabilística con modelo OSIT.

Estado: HIPÓTESIS/METÁFORA FORMAL.

## 5. Gravedad como residuo de coherencia

Claim permitido:
- usar “residuo” como analogía para pérdida de coherencia o curvatura informacional.

Bloqueo:
- no declarar gravedad cuántica resuelta.

Prueba mínima requerida:
- predicción cuantitativa distinta a modelos existentes.

Estado: HIPÓTESIS DÉBIL.

## 6. Primos como resonancia/residuo

Claim permitido:
- medir si una métrica OSIT de masa/carga correlaciona con propiedades de primos.

Prueba mínima:
- benchmark en `[1,10^6]` contra baselines: divisibilidad, Miller-Rabin, distribución conocida.

Falsificador:
- si no mejora baseline ni produce compresión, se descarta.

Estado: INFERENCIA experimental.

## 7. P vs NP por geometría del residuo

Claim permitido:
- construir una métrica práctica de dificultad de instancias SAT basada en curvatura/residuo.

BLOQUEADO:
- “P≠NP demostrado”.

Prueba mínima:
- generar SAT n pequeño;
- medir correlación entre `R-complejidad` y tiempo de solver;
- comparar con features estándar.

Estado: programa de investigación.

## Acción mínima

Crear tabla por teoría:

| Teoría | Predicción | Medida | Dataset | Falsificador | Estado |
|---|---|---|---|---|---|
