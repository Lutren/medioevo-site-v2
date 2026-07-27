#!/usr/bin/env python3
"""
AGENTE 12: ANALIZADOR DE PATRONES
Procesa las 150 respuestas simuladas y extrae patrones estadisticos significativos.

Uso:
    python 12_AGENTE_ANALIZADOR.py

Input:
    OUTPUTS/11_RESPUESTAS_SIMULADAS.json

Output:
    OUTPUTS/12_PATRONES_DETECTADOS.json - Analisis estadistico completo
"""

import json
import statistics
from datetime import datetime
from pathlib import Path
from collections import Counter, defaultdict
from typing import Dict, List
import os

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")

def cargar_respuestas():
    """Carga las respuestas del Agente 11"""
    ruta = OUTPUT_DIR / "11_RESPUESTAS_SIMULADAS.json"
    if not ruta.exists():
        print("[ERROR] No se encontro 11_RESPUESTAS_SIMULADAS.json")
        print("Ejecuta primero: python 11_AGENTE_RECOLECTOR.py")
        return None

    with open(ruta, 'r', encoding='utf-8') as f:
        return json.load(f)

def analizar_por_perfil(lectores: List[Dict], perfil_id: str) -> Dict:
    """Analiza patrones para un perfil especifico"""

    lectores_perfil = [l for l in lectores if l["perfil_id"] == perfil_id]
    if not lectores_perfil:
        return {}

    resultados = {
        "perfil_id": perfil_id,
        "nombre_perfil": {
            "PERFIL_01": "El Buscador de Verdades Ocultas",
            "PERFIL_02": "La Fan de Ficciones Complejas",
            "PERFIL_03": "El Esceptico de la Ciencia Ficcion",
            "PERFIL_04": "La Madre que Lee de Noche",
            "PERFIL_05": "El Gamer de Narrativas"
        }.get(perfil_id, perfil_id),
        "total_muestra": len(lectores_perfil),
        "demografia": {},
        "patrones_respuesta": {},
        "angulo_validado": {},
        "dolores_comunes": {},
        "recomendaciones": []
    }

    # Analisis demografico
    distribucion_edad = Counter(l["edad"] for l in lectores_perfil)
    distribucion_genero = Counter(l["genero"] for l in lectores_perfil)
    distribucion_ocupacion = Counter(l["ocupacion"] for l in lectores_perfil)

    resultados["demografia"] = {
        "edad": {k: {"count": v, "pct": round(v/len(lectores_perfil)*100, 1)}
                  for k, v in distribucion_edad.most_common()},
        "genero": {k: {"count": v, "pct": round(v/len(lectores_perfil)*100, 1)}
                   for k, v in distribucion_genero.most_common()},
        "top_ocupaciones": distribucion_ocupacion.most_common(5)
    }

    # Analisis de respuestas por pregunta
    todas_respuestas = []
    for lector in lectores_perfil:
        todas_respuestas.extend(lector["respuestas"])

    # Agrupar por pregunta
    respuestas_por_pregunta = defaultdict(list)
    for r in todas_respuestas:
        respuestas_por_pregunta[r["id"]].append(r["respuesta"])

    for preg_id, respuestas in respuestas_por_pregunta.items():
        conteo = Counter(respuestas)
        total = len(respuestas)

        resultados["patrones_respuesta"][preg_id] = {
            "respuestas_populares": [
                {"respuesta": k, "count": v, "pct": round(v/total*100, 1)}
                for k, v in conteo.most_common(5)
            ],
            "diversidad": len(conteo) / total if total > 0 else 0
        }

    # Validacion de angulo
    angulos = Counter(l["angulo_detectado"] for l in lectores_perfil)
    resultados["angulo_validado"] = {
        "angulo_mas_frecuente": angulos.most_common(1)[0] if angulos else None,
        "consistencia": round(angulos.most_common(1)[0][1] / len(lectores_perfil) * 100, 1) if angulos else 0
    }

    # Dolores comunes
    dolores = Counter(l["punto_d"] for l in lectores_perfil)
    resultados["dolores_comunes"] = {
        k: {"count": v, "pct": round(v/len(lectores_perfil)*100, 1)}
        for k, v in dolores.most_common()
    }

    return resultados

def extraer_insights_cruzados(analisis_por_perfil: Dict[str, Dict]) -> List[Dict]:
    """Extrae patrones que cruzan perfiles"""

    insights = []

    # Insight 1: Comparacion de longitud de lectura
    longitud_perfiles = {}
    for perfil_id, analisis in analisis_por_perfil.items():
        if "P1_02" in analisis.get("patrones_respuesta", {}):
            p1_02 = analisis["patrones_respuesta"]["P1_02"]
            resp_top = p1_02["respuestas_populares"][0]["respuesta"]
            longitud_perfiles[perfil_id] = resp_top

    if longitud_perfiles:
        insights.append({
            "tipo": "comparacion_comportamiento",
            "titulo": "Tolerancia a lectura densa por perfil",
            "descripcion": "Diferencia en disposicion a leer textos largos",
            "datos": longitud_perfiles,
            "implicacion": "Ajustar densidad narrativa por segmento objetivo"
        })

    # Insight 2: Participacion comunitaria
    participacion = {}
    for perfil_id, analisis in analisis_por_perfil.items():
        if "P2_02" in analisis.get("patrones_respuesta", {}):
            p2_02 = analisis["patrones_respuesta"]["P2_02"]
            activos = sum(r["count"] for r in p2_02["respuestas_populares"]
                         if "activamente" in r["respuesta"] or "solo leo" in r["respuesta"])
            total = sum(r["count"] for r in p2_02["respuestas_populares"])
            if total > 0:
                participacion[perfil_id] = round(activos / total * 100, 1)

    if participacion:
        insights.append({
            "tipo": "comportamiento_social",
            "titulo": "Indice de participacion comunitaria",
            "descripcion": "Porcentaje que ya participa o quiere participar en comunidades",
            "datos": participacion,
            "implicacion": "PERFIL_02 requiere comunidad activa; otros menos prioridad"
        })

    # Insight 3: Necesidad de interactividad
    agencia = {}
    for perfil_id, analisis in analisis_por_perfil.items():
        if "P5_02" in analisis.get("patrones_respuesta", {}):
            p5_02 = analisis["patrones_respuesta"]["P5_02"]
            quiere_agencia = sum(r["count"] for r in p5_02["respuestas_populares"]
                               if r["respuesta"] != "Nada, solo leer")
            total = sum(r["count"] for r in p5_02["respuestas_populares"])
            if total > 0:
                agencia[perfil_id] = round(quiere_agencia / total * 100, 1)

    if agencia:
        insights.append({
            "tipo": "preferencia_formato",
            "titulo": "Deseo de interactividad narrativa",
            "descripcion": "Porcentaje que quiere elementos de eleccion/agencia",
            "datos": agencia,
            "implicacion": "PERFIL_05 requiere estructura no lineal opcional"
        })

    return insights

def generar_recomendaciones_accion(analisis_por_perfil: Dict, insights_cruzados: List) -> List[Dict]:
    """Genera recomendaciones especificas para implementar"""

    recomendaciones = []

    # Recomendacion por perfil
    for perfil_id, analisis in analisis_por_perfil.items():
        nombre = analisis.get("nombre_perfil", perfil_id)
        angulo_pct = analisis["angulo_validado"].get("consistencia", 0)
        angulo = analisis["angulo_validado"].get("angulo_mas_frecuente", ["", 0])[0]

        rec = {
            "perfil_id": perfil_id,
            "para_quien": nombre,
            "prioridad": "ALTA" if angulo_pct > 80 else "MEDIA",
            "angulo_confirmado": angulo,
            "confianza": f"{angulo_pct}%",
            "acciones": []
        }

        # Acciones especificas por perfil
        if perfil_id == "PERFIL_01":
            rec["acciones"] = [
                "Enfasis en capas filosoficas en marketing",
                "Blurb: resaltar preguntas existenciales",
                "Timing: liberar ensayos tematicos previo al lanzamiento",
                "Contenido extra: glosario filosofico/simbolico"
            ]
        elif perfil_id == "PERFIL_02":
            rec["acciones"] = [
                "Crear Discord server antes del lanzamiento",
                "Programar contenido extra entre libros para mantener engagement",
                "Estrategia de 'timed release' para fidelizar",
                "Book boxes, ediciones especiales para coleccionistas"
            ]
        elif perfil_id == "PERFIL_03":
            rec["acciones"] = [
                "Incluir notas tecnicas detalladas",
                "Glosario cientifico validado",
                "Referencias a papers/articulos reales como easter eggs",
                "Portada minimalista, design serio"
            ]
        elif perfil_id == "PERFIL_04":
            rec["acciones"] = [
                "Capitulo 1 reescrito para hook inmediato",
                "Capitulos cortos (2000-2500 palabras)",
                "Estructura: cliffhangers al final de cada capitulo",
                "Audiolibro de alta calidad para multitasking"
            ]
        elif perfil_id == "PERFIL_05":
            rec["acciones"] = [
                "Estructura no lineal opcional (guia de lectura alternativa)",
                "Easter eggs interactivos (codigos, URLs)",
                "Contenido transmedia (parasociales, ARG ligero)",
                "Gamificacion de la lectura (badges, progreso)"
            ]

        recomendaciones.append(rec)

    return recomendaciones

def analizar_completo():
    """Ejecuta analisis completo de todos los perfiles"""

    print("Cargando respuestas simuladas...")
    datos = cargar_respuestas()
    if not datos:
        return

    lectores = datos.get("lectores", [])
    print(f"Procesando {len(lectores)} lectores...\n")

    # Analizar cada perfil
    perfiles = ["PERFIL_01", "PERFIL_02", "PERFIL_03", "PERFIL_04", "PERFIL_05"]
    analisis_por_perfil = {}

    for perfil_id in perfiles:
        print(f"Analizando {perfil_id}...")
        analisis = analizar_por_perfil(lectores, perfil_id)
        analisis_por_perfil[perfil_id] = analisis

    # Extraer insights cruzados
    print("\nExtrayendo patrones entre perfiles...")
    insights_cruzados = extraer_insights_cruzados(analisis_por_perfil)

    # Generar recomendaciones
    print("Generando recomendaciones de accion...")
    recomendaciones = generar_recomendaciones_accion(analisis_por_perfil, insights_cruzados)

    # Output final
    output = {
        "fecha_analisis": datetime.now().isoformat(),
        "version": "1.0",
        "total_lectores_analizados": len(lectores),
        "analisis_por_perfil": analisis_por_perfil,
        "insights_cruzados": insights_cruzados,
        "recomendaciones_accion": recomendaciones,
        "proximos_pasos": [
            "Revisar matriz de calibracion y ajustar segun estos datos",
            "Priorizar perfiles con mayor confianza (>80%)",
            "Implementar acciones en orden de impacto",
            "Validar con focus group antes del lanzamiento"
        ]
    }

    # Guardar
    ruta_salida = OUTPUT_DIR / "12_PATRONES_DETECTADOS.json"
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Analisis guardado: {ruta_salida}")
    print(f"Resumen: {len(recomendaciones)} perfiles analizados")
    print(f"         {len(insights_cruzados)} insights cruzados detectados")

    return output

if __name__ == "__main__":
    print("=" * 60)
    print("AGENTE 12: ANALIZADOR DE PATRONES")
    print("=" * 60)
    print("\nProcesando 150 encuestas simuladas...\n")

    resultado = analizar_completo()

    print("\nAgente 12 completado: Patrones analizados")
