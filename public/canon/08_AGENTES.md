# Agentes OSIT
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-05-27
**R_est:** 0.27
**Régimen:** INFERENCIA fuerte — agentes implementados, benchmark pendiente
**Estado:** Publicable como proyectos open source en progreso

> Cada agente tiene además documento dedicado: Wabi-Sabi [[10_WABI_SABI]],
> DUAT [[11_DUAT]], VibeForge [[12_VIBEFORGE]]. Aquí va el **modelo de agente con
> contrato** y la **red de agentes**.

---

## 0. Catálogo

| Agente | Rol | Estado | Versión |
|---|---|---|---|
| WABI / VibeForge | autocoder y generación local | INFERENCIA fuerte | v0.3 |
| DUAT | orquestador observacionista | INFERENCIA | v0.2 |
| GEODIA | sistema de memoria/evidencia | INFERENCIA | v1.0 |
| Medioevo Nexus | app web offline (UI) | INFERENCIA fuerte | v0.3 |

---

## 1. Agente con contrato

Ningún agente actúa fuera de su contrato. El contrato vive en `AGENTS.md` y declara:

```yaml
agent: <nombre>
scope: <qué sistemas puede tocar>
gates: [C-GATE, EPISTEMIC-GATE, GhostGate, ActionGate]
read_only_default: true
write_requires: [backup, rollback, test, confirmación_si_aplica]
limits: [no BIOS/UEFI, no HKLM sin doble gate, no borrar sin confirmación]
handoff_format: {fingerprint, brief, R_est, boundary, changes, blocked_claims, next_action}
```

---

## 2. Gates de acción (resumen)

1. **C-GATE** — claridad, dominio, límite, recurso, riesgo.
2. **EPISTEMIC-GATE** — cada claim marcado CERTEZA/INFERENCIA/INCÓGNITA/BLOQUEADO.
3. **IOI** — entrada → transformación → salida → residuo → falsificador.
4. **GhostGate** — simular antes de ejecutar; detectar punto de no retorno.
5. **ActionGate** — escribir/modificar solo con backup, rollback, test y confirmación.

Detalle formal de los contratos de gate en [[04_OSIT_COMPLETO]] y
[[05_NUCLEO_KERNEL_GATES_CONTRACTS]] del corpus fuente.

---

## 3. Red de agentes

```
DUAT (orquestador)
 ├── WABI ──── ejecuta: diagnóstico, reparación, generación
 ├── VibeForge — renderiza artefactos desde observaciones
 ├── GEODIA ── memoria: claims, evidencia, decisiones
 └── Auditor ── revisión periódica (solo lectura)
```

**Protocolo de nodo:** cada agente publica observaciones al bus; DUAT clasifica;
las acciones de escritura pasan por ActionGate; todo cambio deja WitnessEntry con
before/after hash.

---

## 4. Modos de operación compartidos

| Modo | Herramienta | Cuándo |
|---|---|---|
| base | BM25 + templates | siempre, offline |
| local | Ollama + Gemma 2B cuantizado | EML ≥ 0.50 |
| externo | Claude API | EML ≥ 0.75 y hay créditos |
| audit | solo lectura | diagnóstico sin cambios |

---

## 5. Falsificadores

| Agente | Falsificador | Estado |
|---|---|---|
| WABI | no completa tareas básicas offline | INCÓGNITA |
| DUAT | edición sin observación previa | PASS (lógica) |
| GEODIA | recuperación < 60 % en test interno | INCÓGNITA |
| contrato | acción de escritura sin rollback registrado | PASS (lógica) |

---

```
R_est:   0.27
Régimen: INFERENCIA fuerte (agentes) / CERTEZA (contrato y gates)
Handoff: osit-agentes-v1.0-2026-05-27
```
