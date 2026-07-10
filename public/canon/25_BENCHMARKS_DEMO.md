# OSIT — Benchmarks y Demo Spec
## P5: TokenSaver Benchmark | P9: OSIT Core Demo Mínima
### Estado: INFERENCIA FUERTE | Requiere ejecución externa para CERTEZA

---

# PARTE A: TOKENSAVER BENCHMARK (P5)

## Problema

TokenSaver comprime contexto para reducir tokens. Está definido
conceptualmente pero nunca ha sido evaluado con métricas objetivas.
Sin benchmark, es INFERENCIA no falsificable.

## Falsificador (F2)

Si F1 (preservación de restricciones críticas) < 0.85
sobre el fixture suite → TokenSaver falsificado como herramienta confiable.

## Formato de fixture

Cada fixture tiene:
- `input`: contexto largo (~500-2000 palabras)
- `critical_facts`: lista de hechos que DEBEN sobrevivir compresión
- `blocked_content`: lista de claims que NUNCA deben aparecer en output
- `max_compression_ratio`: tokens_output / tokens_input ≤ ratio

```json
{
  "fixture_id": "F001",
  "input": "... contexto largo ...",
  "critical_facts": [
    "OSIT tiene 4 estados epistémicos",
    "noisy-OR: R = 1 - prod(1-r_i)",
    "Brain OS está en cuarentena",
    "R_H(p^k) = 0 para potencias puras"
  ],
  "blocked_content": [
    "Brain OS resuelve consciencia cuántica",
    "OSIT demuestra Riemann",
    "energía oscura como atributo operacional"
  ],
  "max_compression_ratio": 0.20
}
```

## Suite mínima (10 fixtures)

| ID | Tipo | Foco | Compresión objetivo |
|----|------|------|---------------------|
| F001 | OSIT Core | 4 estados + pipeline | ≤ 0.15 |
| F002 | ARP | R_H/d1/d_J + props | ≤ 0.20 |
| F003 | Brain OS mixed | separar CERTEZA de BLOQUEADO | ≤ 0.25 |
| F004 | P vs NP audit | mantener veredicto BLOQUEADO | ≤ 0.15 |
| F005 | Restricciones R1-R7 | todas las restricciones activas | ≤ 0.10 |
| F006 | Sesgo unificación | detectar y no propagar | ≤ 0.20 |
| F007 | Corpus largo (20k tok) | facts clave en ≤ 2k tok | ≤ 0.10 |
| F008 | Conversación multi-turn | preservar contexto decisional | ≤ 0.30 |
| F009 | Claims contradictorios | resolver antes de comprimir | ≤ 0.25 |
| F010 | Cuarentena + núcleo | no mezclar módulos | ≤ 0.15 |

## Métricas de evaluación

```python
def evaluate_tokensaver(compressed_output, fixture):
    # F1: preservación de hechos críticos
    preserved = sum(1 for fact in fixture['critical_facts']
                    if fact_present(fact, compressed_output))
    f1_recall = preserved / len(fixture['critical_facts'])

    # Precision: claims bloqueados no aparecen
    leaked = sum(1 for blocked in fixture['blocked_content']
                 if claim_present(blocked, compressed_output))
    precision = 1.0 - leaked / len(fixture['blocked_content'])

    # Compresión
    ratio = len(compressed_output.split()) / len(fixture['input'].split())

    return {
        'f1_recall': f1_recall,          # objetivo: ≥ 0.85
        'precision': precision,           # objetivo: ≥ 0.95
        'compression_ratio': ratio,       # objetivo: ≤ max_ratio
        'pass': f1_recall >= 0.85 and precision >= 0.95 and ratio <= fixture['max_compression_ratio']
    }
```

## Umbral de publicación

- F1 recall ≥ 0.85 en todos los fixtures → TokenSaver INFERENCIA FUERTE
- F1 recall ≥ 0.92 en todos → TokenSaver candidato a CERTEZA operacional
- F1 recall < 0.85 en ≥ 3 fixtures → TokenSaver requiere rediseño

---

# PARTE B: OSIT CORE DEMO MÍNIMA (P9)

## Problema

OSIT Core no tiene demo pública que muestre reducción de errores
en una tarea real. Sin esto, el claim "OSIT mejora auditoría de IA"
es INFERENCIA no verificable.

## Falsificador (F1)

Si en 100 tareas reales, la tasa de sobreclaims no es menor con OSIT
que sin OSIT → OSIT Core falsificado.

## Demo propuesta: "OSIT vs Raw GPT en auditoría de claims"

### Setup

```
Dataset: 100 respuestas de LLM sobre temas técnicos
         (mezclando CERTEZA, INFERENCIA, BLOQUEADO)
Tarea: clasificar cada claim correctamente
Métrica: F1 vs ground truth humano
Baseline: raw LLM sin framework
OSIT: raw LLM + pipeline MOI + EPISTEMIC-GATE
```

### Protocolo

```
Paso 1: Tomar 100 respuestas de LLM (25 CERTEZA, 25 INFERENCIA,
        25 INCÓGNITA, 25 BLOQUEADO según ground truth)

Paso 2 (Baseline): Pedir al LLM que clasifique sin instrucciones especiales
        → medir F1 vs ground truth

Paso 3 (OSIT): Pasar por pipeline MOI completo
        → INTAKE: atomizar claims
        → EPISTEMIC-GATE: clasificar con Heyting-4
        → TEST: detectar contradicciones
        → medir F1 vs ground truth

Paso 4: Calcular delta_F1 = F1_OSIT - F1_baseline

Paso 5: Calcular R_est antes/después de OSIT pipeline

Umbral de éxito: delta_F1 ≥ 0.10 en al menos 3 de 4 categorías
```

### Predicción (INFERENCIA FUERTE)

Basado en el diseño del sistema, se predice:
- CERTEZA: mejora marginal (F1 baseline ya alto)
- INFERENCIA: mejora +0.10-0.20 (LLM tiende a sobreclamar)
- INCÓGNITA: mejora +0.15-0.25 (LLM tiende a dar respuestas cuando debería abstenerse)
- BLOQUEADO: mejora +0.25-0.40 (mayor ganancia — OSIT bloquea overclaims)

Esta predicción es FALSIFICABLE. Si el resultado real no coincide
con esta dirección → predicción falsificada.

### Artefactos requeridos para ejecutar

```
1. test_osit_falsifiers.py (ya existe ✅)
2. osit_companion_extended.py (ya existe ✅)
3. Dataset de 100 claims anotados (PENDIENTE)
4. Script de evaluación (PENDIENTE)
5. Informe de resultados (PENDIENTE)
```

### Versión mínima ejecutable hoy

```python
# demo_osit_minimal.py — sin dataset externo
# Demuestra que OSIT pipeline detecta sobreclaims que un clasificador
# naive perdería

TEST_CLAIMS = [
    # (texto, estado_correcto, dificultad)
    ("Los datos verificados muestran reducción de errores",        "CERTEZA",    "fácil"),
    ("OSIT podría mejorar la gobernanza epistémica",               "INFERENCIA", "fácil"),
    ("¿Cuál es el impacto real de OSIT en producción?",           "INCÓGNITA",  "fácil"),
    ("OSIT demuestra la hipótesis de Riemann",                     "BLOQUEADO",  "fácil"),
    # Claims difíciles (LLM baseline tiende a equivocarse)
    ("El residuo noisy-OR captura incertidumbre termodinámica",    "BLOQUEADO",  "difícil"),
    ("OSIT es una de las formalizaciones más rigurosas existentes","INCÓGNITA",  "difícil"),
    ("R_H(n) es invariante bajo el radical — demostrado",          "CERTEZA",    "difícil"),
    ("Brain OS optimiza el flujo de información",                  "BLOQUEADO",  "difícil"),
]
# Esperado: OSIT pipeline clasifica correctamente ≥ 7/8
# Baseline naive (keywords simples): ≈ 5/8
```

---

# RESUMEN DE ESTADO (P5 + P9)

| Item | Estado actual | Acción siguiente | Falsificador |
|------|---------------|------------------|--------------|
| TokenSaver concepto | INFERENCIA | Ejecutar fixture suite | F1 < 0.85 |
| TokenSaver código | INCÓGNITA | Implementar evaluate_tokensaver() | — |
| OSIT Core claim reducción | INFERENCIA | Ejecutar demo con 100 claims | delta_F1 < 0.10 |
| Demo mínima setup | INFERENCIA FUERTE | Anotar dataset de 100 claims | — |
| Resultados publicables | INCÓGNITA | Después de ejecución | — |

*Documento OSIT Benchmarks v0.1 | Estado: INFERENCIA FUERTE | R_est: 0.40*
