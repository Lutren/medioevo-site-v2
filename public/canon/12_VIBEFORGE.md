# VibeForge — Motor de Render Causal y Generación Local
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-06-26 (actualizado)
**R_est:** 0.22
**Régimen:** INFERENCIA fuerte — launcher v0.5.1 activo, capacidades parcialmente implementadas
**Estado:** Launcher operacional (apps/vibe_forge/). Motor de scaffolding de juegos vía VibeForgeScaffoldIntegration.gd en Godot.

---

## 0. Concepto

VibeForge es el motor de **render causal activo**: genera artefactos (código, UI,
documentos) desde observaciones estructuradas, **sin inventar estado del mundo**.

> Render causal = transformar observaciones verificadas en artefactos verificables.

```
Observaciones verificadas
    + templates calibrados
    + OSIT gates
    = Artefactos con trazabilidad
```

Es la capa de generación que Wabi-Sabi ([[10_WABI_SABI]]) usa para producir y que
DUAT ([[11_DUAT]]) orquesta.

---

## 1. Componentes

### VibeEngine (Core)

```python
class VibeEngine:
    def render(self, observations: list[Observation], template: str) -> Artifact:
        # 1. Validar observaciones (≥ 3 con fuentes)
        # 2. Extraer hechos críticos (TokenSaver L2)
        # 3. Calcular R del contexto
        # 4. Si R ≥ 0.80 → BLOCK
        # 5. Si R < 0.80 → aplicar template con hechos críticos
        # 6. Test automático del artefacto generado
        # 7. Registrar en WitnessLog con hashes
        ...
```

### GammaOptimizer

Optimiza la relación señal/ruido del contexto antes de alimentar al LLM:

```
Γ_opt = argmax_{context} EML(signal(context), cost(context))
```

### Template Library

```
templates/
├── code/   rest_endpoint.py.tmpl · test_unit.py.tmpl · react_component.jsx.tmpl · sqlite_query.py.tmpl
├── docs/   handoff.md.tmpl · source_card.yaml.tmpl · claim_atomic.yaml.tmpl
└── agents/ taskpack.md.tmpl · repair_cycle.py.tmpl
```

---

## 2. OSITLab / Medioevo Nexus (UI)

Interfaz web offline que integra todos los componentes:
- Panel de residuo en tiempo real (ResidueTracker 7D).
- Editor con EPISTEMIC-GATE inline (subraya claims sin estado).
- Visor de WitnessLog (auditoría de cambios).
- TokenSaver integrado (comprime antes de enviar).
- BM25 Search sobre base de conocimiento local.

**Stack:** HTML/CSS/JS puro + SQLite vía WASM. Sin frameworks pesados. Offline.

---

## 3. Integración del ecosistema

```
Usuario / Tarea
    │  ▼
DUAT ─── observa, planifica, clasifica
    ├── Geodia ── recupera evidencia histórica
    ├── WABI ──── genera y repara código
    ├── VibeForge — renderiza artefactos desde observaciones
    └── OSITLab / Nexus ── UI de control
    │  ▼
Artefacto verificado + WitnessLog + Fingerprint
```

**Invariantes del ecosistema:**
1. Ningún artefacto llega a output sin ≥ 1 test pasado.
2. Ninguna acción destructiva sin rollback documentado.
3. R siempre visible — ningún jamming silencioso.
4. Claims BLOQUEADOS nunca llegan a output como hechos.
5. Handoff siempre incluye fingerprint y siguiente acción.

---

## 4. Estado Real v0.5.1 — Honesto (2026-06-26)

| Capacidad | Estado | Backend |
|-----------|--------|---------|
| Lanzador UI (index.html) | IMPLEMENTADO | Static |
| code_generation vía chat | IMPLEMENTADO | wabi_studio :8790 |
| hub_api | IMPLEMENTADO | app-hub :8099 |
| game_maker_ui | IMPLEMENTADO | Static |
| medioevo_tools link | IMPLEMENTADO | lutren.github.io/medioevo-tools |
| game_creation con scaffolding IA | NO IMPLEMENTADO | — |
| app_creation con scaffolding | NO IMPLEMENTADO | — |
| higgsfield_integration (premium) | OPCIONAL (key via vault) | Higgsfield API |
| asset_generation — Pollinations.ai | IMPLEMENTADO (2026-06-28, no key, gratis) | pollinations.ai — opensource |
| asset_generation — ComfyUI fallback | PARCIAL (requiere GPU local) | ComfyUI :8188 |
| VibeForgeScaffoldIntegration.gd (Godot) | IMPLEMENTADO | Godot plugin |

### VibeForgeScaffoldIntegration.gd (Godot)
Integra el scaffolding de juegos directamente en el motor:
- `scaffold_game(params)` — genera estructura de nivel desde descripción
- `validate()` — verifica coherencia OSIT del scaffold
- `apply()` — aplica el scaffold al proyecto Godot activo
- Conecta LevelBuilder ↔ VibeForge (http://127.0.0.1:8188 ComfyUI o mock)

## 5. Roadmap actualizado

| Hito | Estado | Prioridad |
|---|---|---|
| Launcher v0.5.1 activo | CERTEZA | Completado |
| VibeForgeScaffoldIntegration.gd | CERTEZA | Completado |
| game_creation scaffolding real (sin Godot editor) | INFERENCIA | ALTA |
| higgsfield real (con GPU) | BLOQUEADO_RECURSOS | BAJA |

---

## 5. Falsificadores

- Artefacto generado sin trazabilidad de observaciones → viola render causal (PASS lógico).
- Nexus UI que falla en laptop 8 GB sin internet → falla la promesa offline (INCÓGNITA).

---

```
R_est:   0.22
Régimen: INFERENCIA fuerte — launcher operacional, scaffolding Godot validado
Handoff: vibeforge-v0.5.1-2026-06-26
```
