# 04 — Sistema de ahorro de tokens para cualquier IA

ESTADO: CERTEZA operacional.  
R_est: 0.14.  
Régimen: compresión con preservación de hechos críticos.  
Utilidad real: reduce costo sin borrar decisiones, restricciones ni evidencia.  
Riesgo de humo: bajo si se mide antes/después; medio si se usa como resumen genérico.


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


## 1. Contrato TokenSaver actualizado

TokenSaver no resume por estética. Extrae lo que cambia decisiones:
- restricciones;
- fechas;
- comandos;
- rutas;
- evidencia;
- tests;
- hashes;
- métricas;
- bloqueos;
- contradicciones;
- acciones siguientes.

## 2. Estimación rápida

```text
tokens_estimados ≈ caracteres / 4
R = ambigüedad + contradicción + riesgo + falta de evidencia + carga de tarea
```

Escala:

| R | Acción |
|---|---|
| 0.00-0.15 | avanzar directo |
| 0.15-0.35 | avanzar con log |
| 0.35-0.60 | revisar y test pequeño |
| 0.60-0.80 | compactar/reformular antes |
| 0.80-1.00 | BLOQUEAR y dividir |

## 3. Scoring de hechos críticos

| Señal | Peso |
|---|---:|
| debe, no debe, nunca, siempre, offline, local, prohibido, bloqueado, sin nube | +3 |
| decisión, acordado, aprobado, rechazado, canon | +3 |
| evidencia, test, benchmark, medido, reproducible, hash, dataset, log | +2 |
| fecha YYYY-MM-DD o DD/MM/AAAA | +2 |
| crear, implementar, probar, validar, arreglar, migrar, actualizar | +1 |
| número con unidad: GB, MB, ms, %, tokens, tests, casos | +1 |
| contradicción explícita: pero, sin embargo, contradice | +2 |

Regla de negación:
- si una señal aparece negada, no cuenta como evidencia;
- si la frase es restricción explícita, sí cuenta.

## 4. Niveles

### L1 — bullets rápidos
Para textos cortos y lineales.

```text
- hecho crítico
- restricción
- acción
```

### L2 — default

```text
estado:
R:
flags:
resumen:
hechos_criticos:
restricciones:
bloqueos:
accion_recomendada:
```

### L3 — mínimo decisional
Para emergencia de tokens.

```text
estado:
R:
decision: ALLOW | REVIEW | BLOCK
hechos_criticos:
siguiente_accion:
```

## 5. Chunking para documentos largos

```text
1. dividir por oraciones completas
2. chunks de ~400 tokens con overlap de ~40
3. calcular fact_density = hechos / tokens
4. procesar primero chunks con mayor densidad
5. fusionar duplicados
6. conservar contradicciones
```

## 6. Qué conservar siempre

- “offline”, “local”, “sin nube”;
- límites de RAM/CPU/VRAM;
- rutas Windows exactas;
- comandos;
- resultados de tests;
- claims bloqueados;
- rollback;
- nombres exactos de archivos;
- fechas;
- decisiones tomadas.

## 7. Qué eliminar

- cortesía;
- repetición;
- “esto es revolucionario” sin métrica;
- listas decorativas;
- claims de autoridad;
- explicaciones duplicadas.

## 8. Ejemplo operativo

Entrada:

```text
El sistema debe operar offline. No usar cloud. Benchmark: 340ms con 4GB RAM.
Hay bug con archivos vacíos. La decisión fue prohibir llamadas externas.
```

Salida L2:

```text
estado: INFERENCIA
R: 0.32
flags: [offline, restricción, benchmark, bug]
hechos_criticos:
- sistema offline obligatorio
- cloud prohibido
- benchmark 340ms con 4GB RAM
- bug con archivos vacíos
- decisión: prohibir llamadas externas
accion_recomendada: corregir bug y repetir benchmark
```

## 9. Integración con Codex/WABI

Antes de pedir código:

```text
TokenSaver → contrato de tarea → archivos permitidos → tests esperados → rollback → prompt corto
```

## Acción mínima

```bash
python token_saver.py --input input.txt --level L2
```
