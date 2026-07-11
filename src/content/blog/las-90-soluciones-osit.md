---
title: "Las 90 soluciones: ingeniería primero, catálogo después"
date: 2026-05-27
category: "Herramientas"
estado: "INFERENCIA"
lang: "es"
summary: "Dos capas: siete soluciones de ingeniería que hacen operable el sistema en 8 GB de RAM, y un catálogo de 90 problemas atacados con el método OSIT - cada uno con estado epistémico y falsificador."
---

## Capa A - soluciones de ingeniería (lo que hace que el sistema funcione)
Antes de cualquier teoría, hay problemas concretos de operar IA local con poco recurso. Estas son las respuestas que sostienen todo lo demás:

1. **Quedarse sin créditos externos** → *fallback local*: sin modelo, reglas/tests/reportes; con modelo pequeño, propuestas de parche; con modelo grande, mejoras profundas cuando haya crédito.
2. **8 GB de RAM insuficientes** → *Context Compiler*: no cargar todo, indexar, comprimir, pasar solo lo relevante, preservar hechos críticos.
3. **Reparación peligrosa** → *Repair Loop* con backup + diff + tests. Nada se aplica sin trazabilidad.
4. **Fine-tuning prematuro** → *escalera de modificación*: Prompt → RAG → dataset → benchmark → LoRA.
5. **Material mezclado** → *Claim Registry*: cada idea se vuelve claim con estado, evidencia y falsador.
6. **Modelo local débil para programar** → *dividir el trabajo*: el modelo propone sobre contexto pequeño; las reglas ejecutan lo verificable.
7. **Ruido cognitivo** → *Modo simple*: una pantalla, una acción, una decisión.

## Capa B - 90 problemas con método
El catálogo (45 históricos + 45 modernos) ataca cada problema con el mismo protocolo: **estado epistémico** (CERTEZA/INFERENCIA/INCOGNITA/BLOQUEADO), **métricas** (R/U/EML) y un **falsificador** explícito. La honestidad está en el régimen mixto: CERTEZA operacional para la ingeniería, INFERENCIA para los problemas abiertos. Nada se vende como resuelto si no lo está.

> El catálogo completo de las 90 soluciones - con métricas y falsificador por problema - es parte del **MEDIOEVO Agent Ops Pack**, disponible en la [tienda](/tienda). El método detrás vive en el [canon abierto](/canon/04_OSIT_COMPLETO.md) y en [Open Source](/open-source).