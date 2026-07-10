# 06 — Aportes clasificados a ciencia, matemáticas, programación e IA

ESTADO: reclasificación anti-humo.  
R_est: 0.33.  
Régimen: separar aporte real, hipótesis útil y sobreclaim.  
Utilidad real: rescata lo implementable sin vender problemas abiertos como resueltos.  
Riesgo de humo: alto si se borra la diferencia entre idea y demostración.


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


## 1. Aportes con utilidad operacional alta

CERTEZA/INFERENCIA fuerte:

| Aporte | Estado | Utilidad |
|---|---|---|
| TokenSaver epistémico | CERTEZA operacional | reduce tokens conservando decisiones |
| Retículo CERTEZA/INFERENCIA/INCÓGNITA/BLOQUEADO | CERTEZA lógica operativa | evita sobreclaims |
| Noisy-OR para residuo | CERTEZA matemática | no diluye fallos críticos |
| C-GATE/ActionGate/GhostGate | CERTEZA como protocolo | seguridad y rollback |
| WABI local con BM25/templates/SQLite | INFERENCIA fuerte | continuidad sin créditos |
| Autocoder con test + rollback | INFERENCIA fuerte | programación offline controlada |
| UI con incertidumbre explícita | INFERENCIA fuerte | accesibilidad y confianza calibrada |

## 2. Aportes matemáticos útiles

- Medir dificultad práctica por `R-complejidad`, no sustituye Big-O.
- Usar `Γ` para contaminación de orden en contexto y concurrencia.
- Usar `N_OSIT=<v,m,q,R,τ>` para representar claims con estabilidad, carga y residuo.
- Usar aritmética exacta en cálculos críticos para evitar residuo numérico.

## 3. Aportes en programación

Patrones reales:

```text
source_card por función
claim atomizado por cambio
test reversible
rollback obligatorio
benchmark antes/después
bloqueo de acciones irreversibles
```

Problemas que sí ayuda a resolver:
- deuda técnica por vibe coding;
- pérdida de contexto;
- agentes que inventan progreso;
- cambios sin test;
- UI sobrecargada;
- dependencia cloud.

## 4. Aportes en IA local

Arquitectura mínima:

```text
router simbólico → BM25 → SQLite memory → templates → LLM pequeño opcional → test → log
```

Ventaja:
- funciona cuando no hay créditos;
- reduce costo;
- permite auditoría;
- degrada sin colapsar.

## 5. Aportes como hipótesis científicas

| Hipótesis | Estado | Conversión correcta |
|---|---|---|
| colapso cuántico como saturación de observación | INFERENCIA débil | diseñar analogía de sensor/umbral |
| gravedad como residuo/coherencia | HIPÓTESIS | buscar predicción cuantitativa nueva |
| cerebro renderiza futuro | INFERENCIA | probar compensación predictiva de latencia |
| primos como resonancia/residuo | INFERENCIA matemática | medir correlación con secuencias conocidas |

## 6. Sobreclaims bloqueados

- “P vs NP resuelto”.
- “Riemann demostrado”.
- “AGI lograda”.
- “nueva ley física demostrada”.
- “BIOS/registro deben cambiarse automáticamente por soberanía”.

La versión correcta es:

```text
idea → mecanismo → predicción → prueba mínima → falsificador → estado
```

## Acción mínima

Convertir cada aporte en tarjeta:

```text
NOMBRE:
ESTADO:
MECANISMO:
TEST:
MÉTRICA:
FALSIFICADOR:
IMPLEMENTACIÓN MÍNIMA:
```
