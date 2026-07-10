# OSIT Framework Completo — Referencia Unificada
## Documento Maestro Autocontenido

**Autor:** Luis René González López  
**Fecha:** 2026-05-27  
**R_est:** 0.20  
**Régimen:** CERTEZA para núcleo / INFERENCIA para aplicaciones avanzadas  
**Estado:** Publicable como referencia técnica completa

---

## 0. Qué es OSIT

**OSIT** (Observational System for Intelligence Tracking / Marco de Ingeniería Epistémica) es un framework para:

1. **Gestionar residuo informacional** en sistemas de IA, código y decisiones
2. **Clasificar claims** con estado epistémico explícito y falsificadores
3. **Comprimir contexto** preservando hechos que afectan decisiones
4. **Auditar y ejecutar** acciones con gates de seguridad y rollback

**No es:** una teoría del todo, una prueba de P≠NP, física fundamental ni resolución de Riemann.

**Hardware objetivo:** CPU-only, 8 GB RAM, offline.

---

## I. STACK COMPLETO DEL FRAMEWORK

```
╔══════════════════════════════════════════════════════╗
║  CAPA 4 — APLICACIONES                               ║
║  WABI Agent | DUAT Orchestrator | OSITLab UI         ║
║  VibeForge | Medioevo Nexus | Geodia Memory          ║
╠══════════════════════════════════════════════════════╣
║  CAPA 3 — SKILLS Y HERRAMIENTAS                      ║
║  token-saver | claim-classifier | residue-tracker    ║
║  brain-os-auditor | EML Search | ARP Analyzer        ║
╠══════════════════════════════════════════════════════╣
║  CAPA 2 — PIPELINE MOI                               ║
║  INTAKE → DO → C-GATE → EPISTEMIC-GATE               ║
║  → IOI → TEST → SOURCECARD → HANDOFF → DRIFT-CHECK   ║
╠══════════════════════════════════════════════════════╣
║  CAPA 1 — NÚCLEO MATEMÁTICO                          ║
║  R_or | EML | ARP | VSA/GF(2) | ActionGate           ║
║  Retículo Heyting-4 | Cheeger | POVM/CPTP            ║
╚══════════════════════════════════════════════════════╝
```

---

## II. RETÍCULO EPISTÉMICO HEYTING-4

### Estados y orden

```
BLOQUEADO < INCÓGNITA < INFERENCIA < CERTEZA
```

| Estado | Criterio de uso | Prohibición |
|---|---|---|
| CERTEZA | medido, reproducible, demostrado matemáticamente | no para hipótesis |
| INFERENCIA | mecanismo claro, prueba pendiente | no vender como verdad final |
| INCÓGNITA | sin evidencia ni falsificador claro | no rellenar con narrativa |
| BLOQUEADO | sobreclaim, riesgo, física sin prueba, acción destructiva | no forzar ejecución |

### Implicación formal

```
x → y = CERTEZA  si x ≤ y
x → y = y        en otro caso
```

**Teorema:** ANTI_U(CERTEZA) = INCÓGNITA — la certeza sin fuente colapsa a incógnita. ∎

---

## III. FÓRMULAS CANÓNICAS COMPLETAS

```python
# Residuo Noisy-OR
R_or(r1..rn) = 1 − Π(1 − clamp(rᵢ, 0, 1))

# Residuo cargado (con evidencia)
R_charged = max(0, R_pos − R_neg)

# Información usable
U(X;R) = H(X) · (1 − R)

# Utilidad neta
N_T = U(X;R) / (1 + C_tokens + C_mem + C_lat + C_risk)

# EML — Eficiencia de Muestreo Lingüístico
EML(s,c) = σ(2.2s − 0.65·log(1+c) − 0.1)

# Información secuencial
I_seq(e1..en) = Σ λ^(n−i)·I(eᵢ),  0 < λ ≤ 1

# No-conmutatividad
Δ(a,b) = I_seq(a∘b) − I_seq(b∘a)
Γ(a,b) = |Δ(a,b)|

# Eficiencia efectiva
Φ_eff = 1 − R

# Ecuación de Frontera Consciente
C_S(t) = κ_S · ‖Σ̇_S(t)‖ · (1−R) · R

# Residuo de diversidad prima
R_H(n) = −Σ q_p·log(q_p) / log(ω(n))  [si ω(n)>1]

# Fuerza informacional
F(r) = ln((1−r)/r)
```

---

## IV. RESIDUO 7D — VECTOR COMPLETO

| Dimensión | Símbolo | Qué mide | Señal de alerta |
|---|---|---|---|
| Semántico | r_sem | ambigüedad de intención | frases vagas, preguntas sin respuesta |
| Memoria | r_mem | pérdida de estado entre sesiones | contexto olvidado, repetición |
| Latencia | r_lat | backlog / costo de espera | cola > 5 tareas sin cerrar |
| Privacidad | r_priv | exposición de datos | secretos, PII en output |
| Contradicción | r_conf | claims opuestos (peso 1.25×) | "X funciona" + "X falla" |
| Costo | r_cost | tokens/compute desperdiciados | respuestas redundantes |
| Acción | r_act | tareas irreversibles pendientes | cambios sin rollback |

```
R_global = R_or(r_sem, r_mem, r_lat, r_priv, r_conf, r_cost, r_act)
```

---

## V. ESCALA OPERACIONAL DE R

| R | Estado | Régimen | Acción |
|---|---|---|---|
| 0.00–0.15 | ÓPTIMO | avanzar directo | ejecutar |
| 0.15–0.35 | FUNCIONAL | avanzar con registro | ejecutar + log decisiones clave |
| 0.35–0.60 | PRE-JAMMING | alerta | revisar + tests pequeños |
| 0.60–0.80 | JAMMING | riesgo alto | revisar antes de actuar |
| 0.80–1.00 | BLOQUEADO | jamming severo | dividir tarea + exigir evidencia |

---

## VI. GATES — REFERENCIA COMPLETA

### C-GATE (5 preguntas)
```
1. ¿Qué sistema comunica?
2. ¿Qué canal usa?
3. ¿Qué se modifica?
4. ¿Cuál es el límite de seguridad?
5. ¿Qué pasa si falla?
```

### EPISTEMIC-GATE
```yaml
claim: <texto del claim>
mecanismo: <por qué debería ser cierto>
evidencia: <dato/test/hash/log>
residuo: <R_est 0.0–1.0>
falsificador: <qué observación lo destruiría>
acción_mínima: <siguiente paso concreto>
```

### ActionGate
```
ALLOW   si R < 0.60 ∧ r_act < 0.50 ∧ reversible=true
REVIEW  si R ≥ 0.60 ∨ r_act ≥ 0.50 ∨ estado ∈ {INCÓGNITA, INFERENCIA}
BLOCK   si R ≥ 0.80 ∨ estado=BLOQUEADO ∨ (r_act ≥ 0.75 ∧ reversible=false)
```

### GhostGate
Simula sobre copia profunda del estado. Detecta punto de no retorno. Solo ejecutar si simulación = PASS.

### Niveles de acción por sistema
```
N0: lectura/auditoría       → siempre permitido
N1: usuario/proyecto        → permitido con log
N2: sistema                 → confirmación + rollback
N3: registro/config global  → doble confirmación + backup
N4: firmware/BIOS           → solo manual, nunca automático
```

---

## VII. PIPELINE MOI — REFERENCIA RÁPIDA

```
INTAKE     → atomizar input en claims con formato YAML
DO         → categorizar: hecho/hipótesis/restricción/reversible/irreversible
C-GATE     → 5 preguntas de claridad
EPISTEMIC  → asignar estado a cada claim
IOI        → entrada→transformación→salida→residuo→rollback
TEST       → prueba mínima que falla si la idea es falsa
SOURCECARD → source card con hash para cada hecho
HANDOFF    → fingerprint + claims + restricciones + siguiente_acción
DRIFT-CHECK→ jaccard(current_fp, last_fp) ≥ 0.80 → OK; sino nuevo INTAKE
```

---

## VIII. TOKENSAVER — REFERENCIA RÁPIDA

### Cuándo activar
- Texto > 500 palabras
- Preparando handoff/brief para otra sesión
- Leyendo docs técnicos densos
- Delegando a subagente

### Flujo
```
classify_claim → si BLOQUEADO: STOP
R_texto ≥ 0.80 → STOP, dividir tarea
auto_level(tokens, budget) → L1/L2/L3
score_sentences → extraer hechos críticos
output L2: estado + R + resumen + hechos + restricciones + tokens_bloqueados
```

### Output L2 mínimo
```yaml
estado: INFERENCIA
R: 0.41
resumen: [top-3 hechos + primeras 3 oraciones, max 6]
hechos_criticos: [rankeados por score con score explícito]
restricciones: [subset con señales de restricción]
tokens_bloqueados: [hashes, rutas, comandos — verbatim]
accion_recomendada: una línea
# [TokenSaver v0.5] Original: ~Xt | Comprimido: ~Yt | Ahorro: Z%
```

---

## IX. EML — ROUTING DE RECURSOS

```
EML ≥ 0.75        → EXPAND   (LLM completo / Claude API)
0.50 ≤ EML < 0.75 → COMPRESS (modelo mediano / LLM local)
0.25 ≤ EML < 0.50 → COMPRESS_MINIMAL (template local)
EML < 0.25         → BLOCK   (respuesta sin LLM)
```

**Para 8GB RAM:**
```
EML < 0.50  → BM25 + SQLite + templates (sin LLM)
EML ≥ 0.50  → Ollama/Gemma 2B cuantizado
EML ≥ 0.75  → Claude API (si hay créditos)
```

---

## X. ARP — REFERENCIA RÁPIDA

```python
# Factorizar → calcular → clasificar
result = arp_analyze(n)
# {n, factorization, omega_big, omega_small, radical, residue_entropy, class}

# Clases: unidad | puro | mixto_bajo | mixto_alto | square_free_maximo
# Métrica L1: d1(m,n) = Σ|v_p(m)−v_p(n)|
# Métrica Jaccard: dJ(m,n) = 1 − |S(m)∩S(n)|/|S(m)∪S(n)|
```

---

## XI. PROOF CORPUS — ESTADO ACTUAL

| Módulo | Dominio | Estado |
|---|---|---|
| ALG-001 | VSA/GF(2) — 9 propiedades | ✅ PASS |
| ALG-002 | EML + Lambert W | ✅ PASS |
| ALG-003 | Convexidad EML | ✅ PASS |
| ALG-004 | Capacidad VSA Chernoff | ✅ PASS |
| GEO-001 | r(x)∈[0,1] von Neumann | ✅ PASS |
| GEO-003 | F(r)=ln((1−r)/r) | ✅ PASS |
| CPX-003 | Cheeger bounds | ✅ PASS |
| GATE-001 | ActionGate monotonicidad | ✅ PASS |
| GATE-004 | GhostGate aislamiento | ✅ PASS |
| PHY-001 | POVM hermítico/PSD/completo | ✅ PASS |
| PHY-002 | CPTP preserva traza | ✅ PASS |
| GEO-002 | Geometría IOE completa | ❓ INCÓGNITA |

---

## XII. FRONTERAS EXPLÍCITAS DEL FRAMEWORK

**CERTEZA — Funciona:**
- Compresión de contexto con preservación de hechos críticos
- Clasificación epistémica de claims con falsificadores
- Gates de acción con monotonicidad garantizada
- Álgebra de residuo primo como descriptor aritmético
- Pipeline MOI como método de ingeniería

**INFERENCIA — Funciona con calibración pendiente:**
- Pesos de R_texto (requieren corpus real)
- EML routing (parámetros α,β,θ requieren ajuste)
- Benchmark de agente WABI (sin datos externos)

**BLOQUEADO — No afirmar:**
- Que OSIT demuestra P≠NP o la Hipótesis de Riemann
- Que el campo unisensorial φ es física establecida
- Que C_S(t) es medible experimentalmente hoy
- Que OSIT resuelve el problema difícil de la conciencia

---

## XIII. FALSIFICADORES GLOBALES DEL FRAMEWORK

| Componente | Falsificador | Estado |
|---|---|---|
| R_or monotonicidad | r'>r ∧ R_or(r')<R_or(r) | PASS (algebraico) |
| ActionGate monotonicidad | R aumenta → gate retrocede a ALLOW | PASS (1001 pts) |
| R_H(p)=0 para primos | R_H(p)≠0 | PASS (T2) |
| d₁ triangularidad | violación en 10⁶ pares | PASS (algebraico) |
| EML convexidad | d²EML/dx²≤0 para z<0 | PASS (cálculo) |
| TokenSaver F1 | F1 < 0.85 en corpus real | INCÓGNITA |
| EML parámetros | F1 < 0.85 en routing real | INCÓGNITA |
| WABI offline | < 70% tareas básicas sin API | INCÓGNITA |
| ARP predictivo | R_H no correlaciona con dificultad real | INCÓGNITA |

---

## XIV. GUÍA DE INICIO RÁPIDO

### Para comprimir contexto
```bash
python token_saver.py --input mi_doc.txt --level L2
```

### Para clasificar un claim
```python
from osit import classify_claim
result = classify_claim("el sistema tarda 340ms medido en benchmark")
# → {estado: "CERTEZA", R: 0.12, ...}
```

### Para calcular residuo de un número
```python
from arp import analyze
analyze(210)  # → {residue_entropy: 1.0, class: "square_free_maximo", ...}
```

### Para aplicar el pipeline MOI
```
1. INTAKE: llenar formato YAML para cada claim
2. DO: categorizar en hecho/hipótesis/restricción/...
3. C-GATE: responder las 5 preguntas
4. EPISTEMIC-GATE: asignar estado a cada claim
5. IOI: definir entrada→salida→rollback
6. TEST: escribir prueba mínima
7. HANDOFF: generar fingerprint + siguiente acción
```

---

```
R_est:   0.20
Régimen: CERTEZA núcleo / INFERENCIA aplicaciones avanzadas
Licencia: MIT
Handoff: osit-framework-completo-v1.0-2026-05-27
```
