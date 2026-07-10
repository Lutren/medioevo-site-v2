---
title: "ARP: matemática publicable, no problema del Milenio"
date: 2026-05-28
category: "Ciencia"
estado: "INFERENCIA"
lang: "es"
summary: "ARP es un descriptor de estructura multiplicativa con matemáticas honestas y publicables - paper técnico, librería pequeña, benchmarks aritméticos - y deliberadamente NO una demostración de problemas abiertos."
---

## Qué es ARP (y qué no)
ARP contiene **matemáticas publicables** entendidas como un **descriptor de estructura multiplicativa**: una forma de medir y comparar cómo se compone la información cuando el orden importa. Eso da para un **paper técnico**, una **librería pequeña** y **benchmarks aritméticos** reproducibles. Lo que **no** es: una demostración de Riemann, P vs NP ni de nueva física. Esa frontera es parte del diseño - ver [qué sirve y qué no](/blog/auditoria-elite-que-sirve-y-que-no).

## La pieza honesta
La no-conmutatividad se mide, no se decreta: 
```text
I_seq(e1..en) = ∑ ?^(n - i) I(ei), 0 < ? < 1
(a,b) = I_seq(ab) - I_seq(ba)
(a,b) = |(a,b)| # cuánto cambia la información al invertir el orden
```

Cuando `(a,b) > 0`, el orden de las operaciones cambia la información retenida: una propiedad medible, con falsificador claro (si `(a,b)` fuera siempre 0, la hipótesis cae).

## Ruta mínima
1. Formalizar el descriptor en una librería chica con tests.
2. Correr benchmarks aritméticos reproducibles.
3. Escribir el paper como **estructura**, no como "teoría del todo".
Estado: **INFERENCIA fuerte** en la parte matemática; **BLOQUEADO** todo intento de estirarlo a problemas abiertos sin demostración formal. El esqueleto del paper está en el [canon abierto](/canon/24_ARP_PAPER.md).