# Lemas y Principios Operativos OSIT
## Documento Maestro Autocontenido

**Autor:** Luis René González López
**Fecha:** 2026-05-27
**R_est:** 0.18
**Régimen:** CERTEZA como protocolo (principios de diseño y conducta)
**Estado:** Canon operacional — guía de decisión

> Compendio de los lemas que rigen todo el ecosistema. No son adornos: cada uno se
> traduce en una regla verificable. Definiciones formales en [[13_FRAMEWORK_COMPLETO]].

---

## 1. Lema raíz (Observacionismo)

> **Observar sin prejuicio. Documentar sin juicio. Actuar sin distracción.**

| Parte | Traducción operativa |
|---|---|
| Observar sin prejuicio | ≥ 3 observaciones ancladas a fuente antes de concluir |
| Documentar sin juicio | registrar el hecho y su estado, no la opinión |
| Actuar sin distracción | una pantalla, una acción, una decisión |

---

## 2. Lemas de epistemia

1. **El estado manda, no el entusiasmo.** Todo claim lleva CERTEZA/INFERENCIA/INCÓGNITA/BLOQUEADO.
2. **No promover INFERENCIA a CERTEZA.** Una hipótesis útil no es una verdad final.
3. **La contradicción es señal, no ruido.** Nunca se borra; sube el residuo.
4. **Lo extraordinario se bloquea, no se comprime.** P vs NP, Riemann, AGI, nueva
   física → BLOQUEADO como "resuelto".
5. **Sin fuente, no hay certeza.** Claim CERTEZA sin evidencia → degradar.

---

## 3. Lemas de ingeniería

6. **Local-first.** Funciona offline; la nube es optimización, no requisito.
7. **Bajo recurso.** Si entra en swap, no se carga. 8 GB RAM es el techo de diseño.
8. **Reversible o no se ejecuta.** Backup + rollback + test antes de escribir.
9. **R bajo > output grande.** Vale más una restricción corta que tres párrafos de relleno.
10. **Degradar sin colapsar.** Si no hay LLM, BM25 y templates siguen sirviendo.

---

## 4. Lemas anti-humo

11. **Si no produce la cadena, es ruido:** `entrada → claim → residuo → falsificador → prueba → acción`.
12. **No vender problema abierto como resuelto.**
13. **No rellenar incógnitas con narrativa.**
14. **No parafrasear tokens bloqueados** (hashes, rutas, comandos: verbatim).
15. **Cada documento autosuficiente:** usable sin abrir otro.

---

## 5. Lemas de continuidad (FCU)

16. **El handoff siempre lleva fingerprint y siguiente acción.**
17. **Lo que no se documenta, se pierde entre sesiones.**
18. **Comprimir es preservar lo crítico, no acortar por estética** (ver [[17_TOKEN_SAVER]]).

---

```
R_est:   0.18
Régimen: CERTEZA como protocolo de conducta
Handoff: osit-lemas-v1.0-2026-05-27
```
