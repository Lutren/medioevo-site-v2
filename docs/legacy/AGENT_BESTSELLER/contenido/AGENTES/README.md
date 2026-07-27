# SISTEMA DE CALIBRACION DE LECTORES - MEDIOEVO

**Fecha:** 2026-04-18
**Estado:** Sistema automatizado y funcional
**Filosofia:** Observacionismo puro. El CORE no se cambia, solo el angulo de observacion.

---

## QUE ES ESTE SISTEMA

Un conjunto de 4 agentes automatizados que aplican el metodo observacionista para determinar el mejor angulo de presentacion de MEDIOEVO para cada perfil de lector, sin alterar el CORE (personajes, historia, mundo).

---

## FLUJO DEL SISTEMA

```
┌─────────────────────┐
│ AGENTE 1: PERFILADOR│ → Crea 5 perfiles de lectores con background profundo
└─────────┬───────────┘
          │
          v
┌─────────────────────┐
│ AGENTE 2: MINERO    │ → Extrae insights de resenas reales
└─────────┬───────────┘
          │
          v
┌─────────────────────┐
│ AGENTE 3: PREGUNTAS │ → Disena cuestionario sin sesgo
└─────────┬───────────┘
          │
          v
┌─────────────────────┐
│ AGENTE 4: ANALISTA  │ → Procesa y recomienda angulos
└─────────┬───────────┘
          │
          v
┌─────────────────────┐
│ MATRIZ CALIBRACION  │ → Output final
└─────────────────────┘
```

---

## COMO EJECUTAR

### Opcion 1: Automatico (recomendado)
```bash
python AGENTES/05_EJECUCION_AUTOMATICA.py
```

### Opcion 2: Individual
```bash
python AGENTES/01_AGENTE_PERFILADOR.py
python AGENTES/02_AGENTE_MINERO.py
python AGENTES/03_AGENTE_PREGUNTAS.py
python AGENTES/04_AGENTE_ANALISTA.py
```

---

## OUTPUTS GENERADOS

| Archivo | Contenido |
|---------|-----------|
| `01_PERFILES_LECTORES.json` | 5 perfiles con background literario |
| `02_INSIGHTS_RESENAS.json` | Patrones de resenas por perfil |
| `03_PREGUNTAS_CALIBRACION.json` | Cuestionario validado |
| `04_MATRIZ_CALIBRACION.json` | **OUTPUT PRINCIPAL** |

---

## LOS 5 PERFILES

### PERFIL_01: El Buscador de Verdades Ocultas
- **Edad:** 25-40
- **Background:** Leyo Sapiens, Homo Deus, busca significado
- **Angulo optimo:** MEDIOEVO como espejo filosofico
- **No cambiar:** No simplificar la filosofia
- **Ajustar:** Resaltar misterio intelectual

### PERFIL_02: La Fan de Ficciones Complejas
- **Edad:** 18-35
- **Background:** Harry Potter, GoT, busca comunidad
- **Angulo optimo:** MEDIOEVO como saga para pertenecer
- **No cambiar:** No acortar la saga
- **Ajustar:** Crear espacios de comunidad

### PERFIL_03: El Esceptico de la Ciencia Ficcion
- **Edad:** 30-50
- **Background:** No-ficcion, ciencia, filosofia
- **Angulo optimo:** MEDIOEVO como ciencia ficcion dura
- **No cambiar:** No simplificar la ciencia
- **Ajustar:** Incluir glosario tecnico

### PERFIL_04: La Madre que Lee de Noche
- **Edad:** 35-50
- **Background:** Leia mucho, ahora tiempo fragmentado
- **Angulo optimo:** MEDIOEVO como inmersion inmediata
- **No cambiar:** No cortar desarrollo de personajes
- **Ajustar:** Hook en primeras 50 paginas

### PERFIL_05: El Gamer de Narrativas
- **Edad:** 20-35
- **Background:** Juegos > libros, valora agencia
- **Angulo optimo:** MEDIOEVO como narrativa con agencia
- **No cambiar:** No gamificar en exceso
- **Ajustar:** Multiples rutas de lectura

---

## PRINCIPIO FUNDAMENTAL

### Lo que NO cambia (CORE):
- Personajes principales y sus arcos
- Mundo y sus reglas
- Temas centrales (pertenencia, identidad, verdad)
- Estructura 6+1

### Lo que SI cambia (ANGULO):
- Marketing y blurb
- Diseno de portada
- Timing de lanzamientos
- Contenido complementario
- Puntos de enfasis en la narrativa

---

## EJEMPLO DE USO

### Para el PERFIL_01 (Buscador):
**Angulo:** "¿Y si tu realidad fuera un archivo?"
- Portada: tonos oscuros, misterio
- Blurb: menciona "filosofia", "verdad"
- Lanzamiento: enfatizar primeros capitulos misteriosos

### Para el PERFIL_02 (Fan):
**Angulo:** "Unete antes del final"
- Portada: estetica epica
- Blurb: menciona "saga", "6 libros"
- Lanzamiento: crear Discord, foros

### Etc. para cada perfil...

---

## PROXIMOS PASOS

1. [ ] Aplicar cuestionario a 20-30 lectores por perfil
2. [ ] Recopilar respuestas
3. [ ] Ajustar matriz segun datos reales
4. [ ] Implementar angulos en marketing

---

**Documentacion completa en:** `E:/-/Medioevo-=/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/`
