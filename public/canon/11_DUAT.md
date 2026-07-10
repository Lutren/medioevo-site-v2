# DUAT — Orquestador Observacionista
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-06-26 (actualizado)
**R_est:** 0.15
**Régimen:** CERTEZA operacional — v0.3 completo, 12/12 tests PASS, integrado en Godot
**Estado:** Operacional. Simulador multiagente activo. Plugins Godot validados (MEDIOEVO_GAME_FACTORY_VALIDATION_OK).

---

## 0. Origen del nombre

*Duat*: en la mitología egipcia, el reino intermedio entre la vida y la
transformación. En OSIT es el **espacio entre observación y acción**, donde el
agente procesa, clasifica y decide sin precipitarse.

DUAT orquesta a Wabi-Sabi ([[10_WABI_SABI]]), VibeForge ([[12_VIBEFORGE]]) y la
memoria Geodia. Nunca edita sin observar primero.

---

## 1. Propósito

Gestor principal de tareas de construcción para Lovable/agentes. Opera con memoria
selectiva y observaciones ancladas. Separa conocimiento persistente del contexto de
ejecución.

---

## 2. Principio Observacionista estricto

```
REGLA DE DUAT:
Ninguna acción de escritura se ejecuta sin al menos 3 observaciones
ancladas a fuentes verificables (archivo, diff, log, test, output).

Si hay menos de 3 observaciones → EPISTEMIC-GATE → marcar INCÓGNITA → pedir evidencia.
```

### Inverso-Observacionismo

Antes de cualquier plan, DUAT trabaja hacia atrás:

```
Plan propuesto → ¿Qué falsificadores deben pasar ANTES de ejecutar?

Ejemplo: "añadir exportación CSV"
Falsificadores ANTES:
  [ ] guard cubre el nuevo endpoint
  [ ] permisos por rol verificados
  [ ] tests de auth pasan con el cambio
  [ ] no hay datos sensibles en el export
  [ ] schema de CSV acordado con producto
Si algún falsificador falla → NO ejecutar → actualizar plan
```

---

## 3. Modelo de datos

```python
@dataclass
class Observation:
    id: str
    source: str           # archivo, log, test, contrato
    artifact_ref: str     # ruta exacta
    excerpt_hash: str     # sha256 del extracto citado
    timestamp: datetime
    content: str

@dataclass
class Claim:
    id: str
    text: str
    status: str           # CERTEZA | INFERENCIA | INCOGNITA | BLOQUEADO
    evidence_ids: list[str]
    risk: float
    falsifier: str

@dataclass
class ActionProposal:
    scope: str
    files: list[str]
    preconditions: list[str]   # falsificadores que deben pasar
    rollback_hint: str
    estimated_r: float

@dataclass
class WitnessEntry:
    actor: str
    step: str
    before_hash: str
    after_hash: str
    decision: str         # ALLOW | REVIEW | BLOCK
    timestamp: datetime

@dataclass
class MemorySnapshot:
    open_loops: list[str]
    accepted_claims: list[Claim]
    blocked_claims: list[str]
    next_actions: list[str]
    fingerprint: str      # sha256 primeros 16 hex
```

---

## 4. División de responsabilidades

| Superficie | Qué vive ahí | Qué NO |
|---|---|---|
| AGENTS.md raíz | Contrato estable, gates, límites | Contexto voluminoso |
| Workspace knowledge | Reglas transversales: stack, testing, seguridad | Detalle de proyecto |
| Project knowledge | Dominio, rutas sensibles, invariantes de producto | Política organizacional |
| Geodia | Evidencia recuperable, claims, contratos, decisiones | Instrucciones del runtime |
| Chat actual | Delta del ticket — objetivo puntual | Memoria histórica completa |

---

## 5. Geodia — sistema de memoria de DUAT

Plano de conocimiento y evidencia para agentes constructores: índice semántico,
registro de claims, decisiones de diseño, contratos y trazas.

```
geodia/
├── dual_lens.py   — análisis dual: perspectiva externa vs. interna del sistema
├── city.py        — espacios de conocimiento como "edificios" con plantas/cuartos
├── models.py      — schemas de Observation, Claim, Decision, Contract
├── bus.py         — bus de eventos entre módulos
└── search.py      — BM25 + embeddings ligeros para recuperación local
```

**Dual Lens:** cada observación se analiza desde dos perspectivas (comportamiento
externo vs. estado interno esperado). Cuando divergen → señal de R creciente.

---

## 6. Anti-patrones

| Anti-patrón | Síntoma | Corrección |
|---|---|---|
| Edición sin observación | "voy a cambiar X" sin fuente | exigir 3 observations antes |
| Plan sin falsificadores | propuesta sin preconditions | completar o marcar INCÓGNITA |
| Witness incompleto | before/after_hash ausente | calcular antes de commitear |
| Scope creep | un ticket toca 8 módulos | dividir en ActionProposals |
| Certeza sin fuente | claim CERTEZA sin evidence_id | degradar a INFERENCIA |

---

## 7. Falsificadores

| Falsificador | Estado |
|---|---|
| Edición ejecutada con < 3 observaciones | PASS (lógica) |
| Geodia con < 60 % recall en consultas internas | INCÓGNITA |
| WitnessEntry sin before/after hash llega a commit | PASS (lógica) |

---

## 8. Estado Real v0.3 (2026-06-26)

### Simulador multiagente (02_CLAUDIO/duat_sim/)

| Componente | Estado | Tests |
|------------|--------|-------|
| DuatAgent + AnchorResidue | CERTEZA operacional | ✓ |
| CityPressureField (diffuse) | CERTEZA | ✓ |
| MemoryStream (Smallville scoring) | CERTEZA | ✓ |
| InteractionEngine | CERTEZA | ✓ |
| MetabolismEngine | CERTEZA | ✓ |
| LineageEngine (genealogía) | CERTEZA | ✓ |
| NavigationEngine | CERTEZA | ✓ |
| TradeEngine (cooperativo/competitivo) | CERTEZA | ✓ |
| ResourceGrid (50×50) | CERTEZA | ✓ |
| Multi-Epoch con transiciones | CERTEZA | ✓ |
| Muerte permanente + reemplazo | CERTEZA | 12/12 PASS |

### Integración Godot 4.3

- `DuatGameplayPlugin.gd` — NPC brain con ciclos DUAT, colapso OSIT
- `WorldPulseGamePlugin.gd` — get_zone, combat/loot/encounter
- Validación headless: `MEDIOEVO_GAME_FACTORY_VALIDATION_OK` ✓
- 11/11 autoloads verificados

### CLI

```bash
cd 02_CLAUDIO/duat_sim
python cli.py simulate --agents 100 --ticks 50   # simulación rápida
python cli.py status                              # estado del simulador
python engine.py                                 # motor en tiempo real
```

```
R_est:   0.15
Régimen: CERTEZA operacional — v0.3 completo, 12/12 tests PASS
Handoff: duat-v0.3-2026-06-26
```
