---
title: "Aportes a la ciencia, clasificados (sin vender humo)"
date: 2026-05-28
category: "Ciencia"
estado: "INFERENCIA"
lang: "es"
summary: "Reclasificación anti-humo: qué de OSIT es aporte real con utilidad operacional, qué es hipótesis útil, y dónde está la frontera con el sobreclaim. Con las fórmulas canónicas."
---

## La regla: separar aporte real, hipótesis útil y sobreclaim
R_est 0.33. El objetivo no es impresionar, es **rescatar lo implementable** sin vender problemas abiertos como resueltos. El riesgo de humo es alto justo cuando se borra la diferencia entre una idea y una demostración.

## Aportes con utilidad operacional alta
| Aporte | Estado | Utilidad |
|--------|--------|----------|
| TokenSaver epistémico | CERTEZA operacional | reduce tokens conservando decisiones |
| Retículo CERTEZA/INFERENCIA/INCOGNITA/BLOQUEADO | CERTEZA lógico | evita sobreclaims |
| Noisy - OR para residuo | CERTEZA matemático | no diluye fallos críticos |
| C-GATE / ActionGate / GhostGate | CERTEZA como protocolo | seguridad y rollback |
| WABI local (BM25/templates/SQLite) | INFERENCIA fuerte | continuidad sin créditos |
| Autocoder con test + rollback | INFERENCIA fuerte | programación offline controlada |
| UI con incertidumbre explícita | INFERENCIA fuerte | accesibilidad y confianza calibrada |

## Fórmulas canónicas
```text
R_or(r1..rn) = 1 - ∏(1 - clamp(ri,0,1)) # residuo compuesto (noisy - OR)
R_charged = max(0, R_pos - R_neg)
U(X;R) = H(X) - (1 - R) # utilidad = información x (1 - residuo)
N_T = U(X;R) / (1 + C_tokens + C_mem + C_lat + C_risk)
EML(s,c) = ∂(∂s - ∂log(1+c) - ?) # ∂=2.2, ∂=0.65, ?=0.1
I_seq(e1..en)= ∑ ?^(n - i) I(ei), 0 < ? < 1 # información secuencial
I(a,b) = |I_seq(ab) - I_seq(ba)| # no - conmutatividad
```

## La frontera, dicha en claro
Lo que tiene test, métrica, falsificador o implementación mínima sube a CERTEZA/INFERENCIA. Todo lo demás baja a INCOGNITA o BLOQUEADO. El aporte no es "tener una teoría del todo": es **un marco que se niega a confundir elegancia con evidencia**. La auditoría completa está en [qué sirve y qué no](/blog/auditoria-elite-que-sirve-y-que-no).