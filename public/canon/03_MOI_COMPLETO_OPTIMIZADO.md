# 03 — MOI completo optimizado para ingeniería real

ESTADO: CERTEZA operacional en forma de pipeline; INFERENCIA en resultados no medidos.  
R_est: 0.19.  
Régimen: método de ejecución para documentos, código, IA local, ciencia y sistemas.  
Utilidad real: evita que ideas se queden como narrativa; obliga a prueba mínima.  
Riesgo de humo: bajo si cada paso produce logs/tests; medio si se usa solo como formato.


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


## 1. Pipeline MOI v1.0 completo (11 pasos) · CERTEZA operacional

```text
1. INTAKE       → ingesta, hash SHA256, procedencia
2. DO           → Document Object — clasificación inicial
3. REDFLAG-SPLIT → detector de claims pseudocientíficos
4. C-GATE       → clasificación por categoría de claim
5. EPISTEMIC-GATE → estado definitivo (CERTEZA/INFERENCIA/INCÓGNITA/BLOQUEADO)
6. IOI          → Investigation of Interest — profundización
7. TEST         → falsadores F1-F4 + F_landauer + F_sgrav_regime + F_rait_stability
8. SOURCECARD   → tarjeta inmutable con hash SHA256
9. WITNESSMAP   → mapa append-only con cadena de hash
10. HANDOFF     → transferencia de estado a siguiente sesión/agente
11. DRIFT-CHECK → verificación de desviación con el tiempo
```

### Categorías de Claims (C-GATE)

| Categoría | Definición |
|---|---|
| `empírico` | Verificable por experimento |
| `formal` | Verificable por lógica/matemáticas |
| `testimonial` | Basado en testimonio humano |
| `operacional` | Funciona en la práctica, sin importar la explicación teórica |
| `metafísico` | No verificable empíricamente |
| `pseudocientífico` | Usa lenguaje científico sin método científico |

### INTAKE
Convertir entrada en claims atómicos.

Formato:

```text
claim:
mecanismo:
evidencia:
residuo:
falsificador:
acción mínima:
```

### DO: deconstrucción observacionista
Separar:
- hecho medido;
- hipótesis;
- restricción;
- acción reversible;
- acción irreversible;
- dependencia externa;
- costo.

### C-GATE
Preguntas:

```text
¿qué sistema comunica?
¿qué canal usa?
¿qué se modifica?
¿cuál es el límite de seguridad?
¿qué pasa si falla?
```

### EPISTEMIC-GATE
Cada claim queda marcado. No puede avanzar sin estado.

### IOI
Ingeniería observacionista inversa:

```text
entrada esperada → transformación mínima → salida medible → residuo → rollback
```

### TEST — Falsadores completos

| Falsador | Descripción |
|---|---|
| `F1` | El claim contradice una observación reproducible |
| `F2` | El claim no tiene falsador definido (no es falseable) |
| `F3` | El claim es circular (se usa a sí mismo como evidencia) |
| `F4` | La fuente tiene conflicto de interés no declarado |
| `F_landauer` | El claim viola límites termodinámicos (ops/s, energía/bit, cota de almacenamiento) |
| `F_sgrav_regime` | Rechaza `S_grav ∝ N²` si la función real es entropía discretizada |
| `F_rait_stability` | Rechaza pérdidas RAIT que explotan en `R ≥ Jc` |

### SourceCard (paso 8)

Tarjeta inmutable con hash SHA256. Una vez creada, no se modifica — se crean nuevas versiones.  
Campos: hash original, fecha de ingesta, procedencia (URL/archivo/persona), estado epistémico, enlace a WitnessMap.

### WitnessMap (paso 9)

Mapa append-only con cadena de hash. Cada entrada incluye: Claim ID + SourceCard hash, tipo de evidencia, fecha + testigo, estado resultante, hash de entrada anterior (garantiza integridad).

### HANDOFF
Se entrega solo lo ejecutable:
- comando;
- archivo;
- test;
- métrica;
- rollback;
- límite.

## 2. MOI para código

```text
bug → caso reproducible → patch mínimo → test → rollback → benchmark
```

Reglas:
- No reescribir todo si el fallo es local.
- No aceptar “funciona” sin test.
- Si el patch toca más de 3 módulos, subir R_est.
- Si falla test previo, rollback.

## 3. MOI para agentes WABI/autocoder

Pipeline local:

```text
petición → TokenSaver → BM25 contexto → plantilla → archivo generado → test generado → ejecutar → reparar una vez → rollback si falla → registrar en SQLite
```

Uso sin créditos:
- BM25 y templates como modo base;
- LLM local pequeño como expansión, no dependencia absoluta;
- memoria SQLite con source_cards;
- benchmark antes de aceptar cambios.

## 4. MOI para Windows/BIOS

Niveles:

```text
N0 lectura/auditoría: automático
N1 usuario/proyecto: permitido con log
N2 sistema: confirmación explícita + rollback
N3 registro: doble confirmación + backup .reg
N4 BIOS/UEFI: solo checklist manual
```

BLOQUEADO:
- scripts que cambien BIOS automáticamente;
- HKLM sin backup;
- desactivar antivirus globalmente;
- borrar datos sin confirmación.

## 5. MOI para investigación matemática/física

No aceptar “resuelto” sin:
- definición formal;
- lema verificable;
- prueba o experimento;
- falsificador;
- comparación con baseline.

Ejemplo de conversión:

```text
Idea: el cerebro ve futuro.
Claim verificable: el sistema nervioso compensa latencia sensorial con predicción.
Mecanismo: codificación predictiva + integración temporal.
Experimento mínimo: medir error de predicción ante estímulo visual desplazado.
Falsificador: si no hay adelanto conductual medible, la hipótesis fuerte falla.
Estado: INFERENCIA.
```

## 6. Métricas operativas

| Métrica | Objetivo |
|---|---|
| R_est | <0.35 para ejecutar |
| blocked_precision | >0.95 |
| test_pass_rate | >0.90 inicial; >0.98 maduro |
| rollback_coverage | 1.0 para escritura |
| memory_peak_mb | compatible con 8GB |
| local_latency | medible por comando |
| hallucination_block_rate | medir con claims trampa |

## Acción mínima

```bash
# CLI Wabi (v0.5 — comandos reales)
wabi ask "analiza este claim: ..."    # gate epistémico + MOI
wabi gate "afirmación a verificar"    # CERTEZA / INFERENCIA / BLOQUEADO
wabi residue trend                    # telemetría R en el tiempo
python -m pytest -q                   # suite completa

# MOI Web (:8791)
# GET /moi/research?claim=texto&domain=ciencia
# GET /moi/factcheck?text=transcripción
```

### Ecosistema OSIT → MOI → WitnessLog → DUAT → Wabi-Sabi

```
OSIT (teoría) → MOI (verificación) → WitnessLog (registro) → DUAT (análisis) → Wabi-Sabi (acción)
```

Ninguna afirmación del sistema debería llegar a Wabi-Sabi sin pasar por MOI.  
Email de atribución OpenAlex: jaciel.medrano@gmail.com. Sin Sci-Hub.

*Actualizado 2026-06-26 — F_LANDAUER + REDFLAG-SPLIT + WITNESSMAP (GLM 5.2 MOI.md)*
