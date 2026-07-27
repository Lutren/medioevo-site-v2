# SISTEMA MULTI-AGENTE MEDIOEVO - DOCUMENTACION COMPLETA

**Version:** 2.0 Avanzada  
**Fecha:** 2026-04-18  
**Estado:** Sistema multi-agente con simulacion Conway-style + Rayuela/Crono Trigger  
**Filosofia:** Observacionismo puro. Los datos > intuicion. El CORE no se toca, solo el ANGULO.

---

## ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 0: PRE-PROCESAMIENTO                                       │
│ ─────────────────────────────────────────────────────────       │
│  [0] Conway Filter → Patrones sociales emergentes              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: PERFILADO Y ANALISIS                                    │
│ ─────────────────────────────────────────────────────────       │
│  [1] Perfilador Multidimensional → 5 perfiles con 7 dimensiones│
│  [2] Minero de Resenas → Insights de reviews reales            │
│  [3] Disenador Preguntas → Cuestionario psicometrico           │
│  [4] Analista de Mercado → Matriz de calibracion               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: PROFUNDIDAD                                             │
│ ─────────────────────────────────────────────────────────       │
│  [6] Lector Profundo → Patrones Rayuela/Crono Trigger          │
│  [7] Detector Insights → Eureka moments para discoverers       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: ESTRATEGIA                                              │
│ ─────────────────────────────────────────────────────────       │
│  [8] Estrategia Social → Conway aplicado a marketing           │
│  [9] Marketing Observacional → Estrategias validadas           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────────┐
│ OUTPUT: MATRIZ COMPLETA PARA DECISIONES                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## AGENTES DISPONIBLES

### Agente 0: Filtro Social Conway-style
**Archivo:** `00_AGENTE_CONWAY.py`

**Funcion:** Simula dinamica social usando automatas celulares (Conway's Game of Life) para detectar patrones emergentes.

**Dimensiones analizadas:**
- Economica (NSE-A a NSE-E)
- Social (aislado → conector)
- Politica (conservador → activista)
- Edad (Gen-Z → Boomer)
- Biologico (sueno, energia, neurodivergencia)
- Mental (apertura, tolerancia ambiguedad, necesidad cognitiva)
- Digital (analogo → tech-saturated)
- Espiritual (ateo → buscador)

**Output:** `00_MATRIZ_CONWAY.json`

**Base teorica:**
- Juego de la Vida de Conway (emergencia de patrones)
- Dinamicas de grupo (Stanford, Milgram, Zimbardo)
- Teoria de redes sociales (6 grados, mundos pequenos)

---

### Agente 1: Perfilador Multidimensional
**Archivo:** `01_AGENTE_PERFILADOR.py`

**Funcion:** Crea 5 perfiles de lectores con profundidad en 7 dimensiones.

**Perfiles base:**
1. **El Buscador de Verdades Ocultas** (25-40) - Filosofia, misterio intelectual
2. **La Fan de Ficciones Complejas** (18-35) - Saga, comunidad, pertenencia
3. **El Esceptico de la Ciencia Ficcion** (30-50) - Precision tecnica, ideas
4. **La Madre que Lee de Noche** (35-50) - Inmersion inmediata, tiempo fragmentado
5. **El Gamer de Narrativas** (20-35) - Agencia, interactividad, eleccion

**Output:** `01_PERFILES_LECTORES.json`

---

### Agente 2: Minero de Resenas
**Archivo:** `02_AGENTE_MINERO.py`

**Funcion:** Extrae patrones de resenas reales (Amazon, Goodreads, BookTok).

**Output:** `02_INSIGHTS_RESENAS.json`

---

### Agente 3: Disenador de Preguntas
**Archivo:** `03_AGENTE_PREGUNTAS.py`

**Funcion:** Crea cuestionario con validacion psicometrica.

**Output:** `03_PREGUNTAS_CALIBRACION.json`

---

### Agente 4: Analista de Mercado
**Archivo:** `04_AGENTE_ANALISTA.py`

**Funcion:** Procesa respuestas y recomienda angulos de observacion.

**Output:** `04_MATRIZ_CALIBRACION.json`

---

### Agente 6: Lector Profundo
**Archivo:** `06_AGENTE_LECTURA_PROFUNDA.py`

**Funcion:** Simula lectura de 35 libros y detecta patrones ocultos tipo:
- Rayuela (Cortazar) - lectura no lineal
- Crono Trigger (Square, 1995) - multiples finales
- Easter eggs ocultos
- Conexiones cruzadas entre libros
- Simetrias narrativas (1-6, 2-5, 3-4)

**Output:** `06_PATRONES_OCULTOS.json`

**Base teorica:**
- Literatura ergodica (Aarseth, 1997)
- Hipertexto y narrativa digital
- Analisis de sagas complejas (GoT, Sandman, Wheel of Time)

---

### Agente 9: Marketing Observacional
**Archivo:** `09_AGENTE_MARKETING_OBSERVACIONAL.py`

**Funcion:** Genera estrategias de marketing basadas en:
- Patrones virales BookTok/Bookstagram 2024-2026
- Frameworks validados (AIDA, PAS, Hook Model)
- Timing optimo por perfil
- Copywriting emocional

**Output:** `09_MARKETING_OBSERVACIONAL.json`

**Frameworks incluidos:**
- Cialdini: Influence (1984)
- Nudge Theory (Thaler & Sunstein, 2008)
- Hook Model (Nir Eyal, 2014)

---

### Agente 10: Encuestador Interactivo
**Archivo:** `10_ENCUESTADOR.py`

**Funcion:** Aplica el cuestionario del Agente 3 a lectores reales:
- Modo interactivo con preguntas paso a paso
- Guarda respuestas en JSON
- Facilita recoleccion de datos

**Output:** `10_RESPUESTAS_LECTORES.json`

**Uso:**
```bash
python 10_ENCUESTADOR.py
```

---

## EJECUCION

### Automatico (recomendado)
```bash
python AGENTES/05_EJECUCION_AUTOMATICA.py
```

### Individual
```bash
python AGENTES/00_AGENTE_CONWAY.py
python AGENTES/01_AGENTE_PERFILADOR.py
python AGENTES/02_AGENTE_MINERO.py
python AGENTES/03_AGENTE_PREGUNTAS.py
python AGENTES/04_AGENTE_ANALISTA.py
python AGENTES/06_AGENTE_LECTURA_PROFUNDA.py
python AGENTES/09_AGENTE_MARKETING_OBSERVACIONAL.py
```

### Encuestador (interactivo)
```bash
python AGENTES/10_ENCUESTADOR.py
```

**Para modo automatico sin interaccion:**
```bash
python AGENTES/10_ENCUESTADOR.py --auto
```

---

## OUTPUTS GENERADOS

| Archivo | Contenido | Tamano aprox |
|---------|-----------|--------------|
| `00_MATRIZ_CONWAY.json` | Simulacion social Conway-style | 126 KB |
| `01_PERFILES_LECTORES.json` | 5 perfiles multidimensionales | 4 KB |
| `02_INSIGHTS_RESENAS.json` | Patrones de resenas | 3 KB |
| `03_PREGUNTAS_CALIBRACION.json` | Cuestionario validado | 5 KB |
| `04_MATRIZ_CALIBRACION.json` | **OUTPUT PRINCIPAL** - Matriz de calibracion | 4 KB |
| `06_PATRONES_OCULTOS.json` | Patrones Rayuela/Crono Trigger | 7 KB |
| `09_MARKETING_OBSERVACIONAL.json` | Estrategias de marketing | 7 KB |
| `10_RESPUESTAS_LECTORES.json` | Respuestas de lectores | generar |

**Total:** 156+ KB de datos de analisis generados

---

## DIMENSIONES DE PERFILADO (Agente 0 y 1)

| Dimension | Niveles | Impacto en lectura |
|-----------|---------|-------------------|
| **Economica** | NSE-A, B, C, D, E | Acceso a libros, preferencias de genero |
| **Social** | Aislado → Conector | Forma de descubrir y compartir libros |
| **Politica** | Conservador → Activista | Tematicas que resuenan |
| **Edad** | Gen-Z → Boomer | Generacion con patrones distintos |
| **Biologico** | Sueno, energia, neurodivergencia | Formato y ritmo de lectura |
| **Mental** | Apertura, tolerancia ambiguedad, necesidad cognitiva | Tipo de narrativa que resuena |
| **Digital** | Analogo → Tech-saturated | Medio de lectura (papel vs digital) |
| **Espiritual** | Ateo → Buscador | Busqueda de significado profundo |

---

## REGLAS DE ORO

1. **El CORE no se toca:** Personajes, historia y mundo son sagrados
2. **El ANGULO es flexible:** La forma de presentar la historia se adapta
3. **Observacion > Opinion:** Los datos de lectores > intuicion del autor
4. **Sin juicio:** No hay respuestas "incorrectas", solo patrones
5. **Discoverers vs Casuales:** Capas para distintos tipos de lectores

---

## PROXIMOS PASOS

### Completado:
1. [x] Ejecutar sistema multi-agente completo
2. [x] Revisar outputs JSON generados
3. [ ] Aplicar cuestionario a 20-30 lectores por perfil
4. [ ] Recopilar respuestas reales
5. [ ] Ajustar matriz segun datos reales
6. [ ] Implementar angulos en marketing
7. [ ] Lanzar saga con estrategia observacional

### Guia rapida de implementacion:
Ver `IMPLEMENTACION_RAPIDA.md` para instrucciones paso a paso.

---

**Documentacion completa en:** `E:/-/Medioevo-=/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/`
