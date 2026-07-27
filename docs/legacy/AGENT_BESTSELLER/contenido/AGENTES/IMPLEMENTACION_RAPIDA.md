# GUIA DE IMPLEMENTACION RAPIDA - MEDIOEVO

**Estado:** Sistema multi-agente completado y validado
**Ultima actualizacion:** 2026-04-18
**Tiempo estimado de implementacion:** 15-20 minutos

---

## FASE 1: EJECUCION DEL SISTEMA (5 min)

```bash
cd E:\-=Medioevo=-\CONSOLIDADO_6MAS1\AGENT_BESTSELLER\AGENTES
python 05_EJECUCION_AUTOMATICA.py
```

**Resultado esperado:** 7 agentes ejecutados, 156 KB de JSON generados

---

## FASE 2: RECOLECCION DE DATOS (10-15 min por lector)

### Opcion A: Encuestador interactivo
```bash
python 10_ENCUESTADOR.py
```

### Opcion B: Manual (recomendado para primeros lectores)
1. Abrir `OUTPUTS/03_PREGUNTAS_CALIBRACION.json`
2. Seleccionar 1 perfil (ej: PERFIL_01)
3. Aplicar las 3 preguntas del perfil
4. Guardar respuestas en archivo temporal

**Meta:** 20-30 lectores por perfil (100-150 encuestas total)

---

## FASE 3: ANALISIS DE PATRONES (5 min)

Con las respuestas recopiladas:

1. **Buscar patrones por perfil:**
   - ¿Que angulo de resonancia mas se repite?
   - ¿Que objeciones aparecen?
   - ¿Que lenguaje usan los lectores?

2. **Ajustar matriz:**
   - Abrir `OUTPUTS/04_MATRIZ_CALIBRACION.json`
   - Modificar "puntos_observacion" segun patrones reales
   - Mantener "no_cambiar" intacto

---

## FASE 4: IMPLEMENTACION DE ANGULOS (por hacer)

### Para cada perfil:

| Perfil | Angulo | Accion concreta |
|--------|--------|-----------------|
| PERFIL_01 (Buscador) | "¿Y si tu realidad fuera un archivo?" | Blurb: enfasis en filosofia, verdad |
| PERFIL_02 (Fan) | "Unete antes del final" | Crear Discord, comunidad |
| PERFIL_03 (Esceptico) | "Ciencia ficcion que respeta tu inteligencia" | Incluir glosario tecnico |
| PERFIL_04 (Madre) | "Te atrapa desde la pagina 1" | Hook en primeras 50 paginas |
| PERFIL_05 (Gamer) | "Tu decides como observar" | Estructura no lineal opcional |

---

## CHECKLIST DE IMPLEMENTACION

### Completado:
- [x] Sistema multi-agente (7 agentes)
- [x] Eliminacion de acentos completada
- [x] Encuestador interactivo (Agente 10)
- [x] Documentacion completa

### Pendiente:
- [ ] Aplicar 20-30 encuestas por perfil
- [ ] Analizar patrones de respuestas
- [ ] Ajustar matriz de calibracion
- [ ] Implementar angulos en marketing
- [ ] Lanzar Book 1 con estrategia observacional

---

## ESTRUCTURA DE ARCHIVOS

```
AGENTES/
├── 00_AGENTE_CONWAY.py          # Filtro social
├── 01_AGENTE_PERFILADOR.py      # Perfiles de lectores
├── 02_AGENTE_MINERO.py          # Mineria de reseñas
├── 03_AGENTE_PREGUNTAS.py       # Cuestionario
├── 04_AGENTE_ANALISTA.py        # Analisis de mercado
├── 05_EJECUCION_AUTOMATICA.py   # Orquestador principal
├── 06_AGENTE_LECTURA_PROFUNDA.py # Patrones ocultos
├── 09_AGENTE_MARKETING_OBSERVACIONAL.py # Marketing
├── 10_ENCUESTADOR.py            # Encuestador interactivo
├── 00_ORQUESTADOR.md            # Documentacion completa
├── README.md                    # Esta guia
└── OUTPUTS/
    ├── 00_MATRIZ_CONWAY.json
    ├── 01_PERFILES_LECTORES.json
    ├── 02_INSIGHTS_RESENAS.json
    ├── 03_PREGUNTAS_CALIBRACION.json
    ├── 04_MATRIZ_CALIBRACION.json
    ├── 06_PATRONES_OCULTOS.json
    ├── 09_MARKETING_OBSERVACIONAL.json
    └── 10_RESPUESTAS_LECTORES.json (por generar)
```

---

## PROXIMOS PASOS INMEDIATOS

1. **Ejecutar encuesta piloto** (3-5 lectores)
   ```bash
   python 10_ENCUESTADOR.py
   ```

2. **Validar que las preguntas se entienden**

3. **Escalar a 20-30 lectores por perfil**

4. **Ajustar matriz segun resultados**

5. **Implementar angulos en Book 1**

---

**Contacto:** Sistema autonomo - sin intervencion requerida
**Repositorio:** `E:/-/Medioevo-=/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/`
