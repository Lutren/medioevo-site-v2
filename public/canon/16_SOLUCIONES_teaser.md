# Soluciones OSIT
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-05-27
**R_est:** 0.30
**Régimen:** CERTEZA operacional (ingeniería) / INFERENCIA (problemas abiertos)
**Estado:** Catálogo de soluciones aplicadas — completo

> Dos capas: (A) soluciones de ingeniería para operar el sistema; (B) catálogo de
> 90 problemas históricos y modernos resueltos con el método OSIT, cada uno con
> estado epistémico, métricas (R/U/EML) y falsificador. Método en [[03_MOI_COMPLETO_OPTIMIZADO]].

---

## A. Soluciones de ingeniería (operación del sistema)

## 1. Quedarse sin créditos externos

**Solución:** fallback local.

- sin modelo: reglas, tests, reportes, taskpacks;
- con modelo pequeño: propuestas de parche;
- con modelo grande externo: mejoras profundas cuando haya crédito.

## 2. 8 GB RAM insuficientes para contexto gigante

**Solución:** Context Compiler.

- no cargar todo;
- indexar;
- comprimir;
- pasar solo archivos relevantes;
- preservar hechos críticos.

## 3. Reparación peligrosa

**Solución:** Repair Loop con backup + diff + tests.

Nada se aplica sin trazabilidad.

## 4. Fine-tuning prematuro

**Solución:** escalera de modificación.

Prompt → RAG → dataset → benchmark → LoRA.

## 5. Mucho material mezclado

**Solución:** Claim Registry.

Cada idea se vuelve claim con estado, evidencia y falsador.

## 6. Modelo local débil para programar

**Solución:** dividir el trabajo.

El modelo no programa todo; solo propone sobre contexto pequeño. Las reglas ejecutan lo verificable.

## 7. Ruido cognitivo

**Solución:** Modo simple.

Una pantalla, una acción, una decisión.

---

---

## B. 90 problemas resueltos (45 históricos + 45 modernos)

> El catálogo completo de las 90 soluciones (con métricas R/U/EML y falsificadores por problema) es parte del **MEDIOEVO Agent Ops Pack**. Disponible en la [tienda](/tienda/).
