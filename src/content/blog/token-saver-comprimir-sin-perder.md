---
title: "TokenSaver: comprimir sin perder lo que decide"
date: 2026-05-28
category: "Herramientas"
estado: "CERTEZA"
lang: "es"
summary: "Por qué resumir por estética es un error, y cómo un compresor epistémico preserva restricciones, evidencia y contradicciones mientras recorta tokens."
---

## El problema

Trabajar con IA en contexto largo es caro y frágil: o pagas por tokens que no deciden nada, o resumes y **pierdes la restricción crítica** escondida entre el relleno.

## La solución: compresión epistémica

**TokenSaver** no resume por estética. Puntúa cada frase por señales que cambian decisiones - restricciones (*debe, nunca, offline*), decisiones con fecha, evidencia (*test, hash, benchmark*), contradicciones- y preserva primero lo de mayor peso.

```
estado: CERTEZA | INFERENCIA | INCOGNITA | BLOQUEADO
R: 0.0-1.0
hechos_criticos: [rankeados por score]
restricciones: [...]
tokens_bloqueados: [hashes, rutas, comandos - verbatim]
accion_recomendada: una línea
```

Reglas duras: si un claim es **BLOQUEADO**, no se comprime como hecho; si `R ≥ 0.80`, no se comprime más (amplificaría alucinaciones). Las contradicciones **se conservan**: son señal, no ruido.

## Estado

Implementado como skill (v0.5) y como script determinista. Reduce 60-70% de tokens manteniendo los hechos críticos. Es la pieza que hace viable todo lo demás en 8 GB de RAM.