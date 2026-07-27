#!/usr/bin/env python3
"""
AGENTE 13: PLANIFICADOR DE LIBROS
Crea outlines detallados de los 6 libros + 1 companion basado en patrones detectados.

Uso:
    python 13_AGENTE_PLANIFICADOR.py

Input:
    OUTPUTS/12_PATRONES_DETECTADOS.json
    OUTPUTS/06_PATRONES_OCULTOS.json (Rayuela/Crono Trigger)

Output:
    OUTPUTS/13_OUTLINE_SAGA_COMPLETA.json - Estructura de los 7 libros
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple
import os

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")

# Estructura base de la saga 6+1
ESTRUCTURA_SAGA = {
    "libro_1": {
        "titulo": "GENESIS",
        "subtitulo": "El Despertar del Archivo",
        "arco": "Llamado a la aventura",
        "palabras_objetivo": 90000,
        "capitulos": 12,
        "personajes_introducidos": ["Ana", "Marcus", "El Archivista"],
        "temas": ["Descubrimiento", "Pertencia", "Realidad vs simulacion"],
        "tono": "Misterio, maravilla, creciente ansiedad",
        "estructura_cron": "Lectura lineal obligatoria - establecer reglas"
    },
    "libro_2": {
        "titulo": "EXODO",
        "subtitulo": "Profundizacion",
        "arco": "Primeras pruebas",
        "palabras_objetivo": 95000,
        "capitulos": 14,
        "personajes_introducidos": ["Sofia", "El Comite"],
        "temas": ["Confianza", "Traicion", "Sacrificio"],
        "tono": "Tension creciente, moralidad ambigua",
        "estructura_cron": "Pequena bifurcacion - perspectiva alternativa"
    },
    "libro_3": {
        "titulo": "NUMEROS",
        "subtitulo": "El Punto Medio",
        "arco": "Revelacion que cambia todo",
        "palabras_objetivo": 100000,
        "capitulos": 16,
        "personajes_introducidos": ["Los Fragmentados"],
        "temas": ["Verdad oculta", "Identidad", "Eleccion"],
        "tono": "Epifania, shock, reorganizacion mental",
        "estructura_cron": "TWIST MAYOR - lo que creias verdad es mentira"
    },
    "libro_4": {
        "titulo": "DEUTERONOMIO",
        "subtitulo": "Las Consecuencias",
        "arco": "El mundo se oscurece",
        "palabras_objetivo": 95000,
        "capitulos": 14,
        "personajes": ["Todos - perspectiva fragmentada"],
        "temas": ["Consecuencias", "Irreversibilidad", "Perdida"],
        "tono": "Descenso, desesperacion, resistencia",
        "estructura_cron": "Perspectivas multiples simultaneas"
    },
    "libro_5": {
        "titulo": "ISAIAS",
        "subtitulo": "Pre-climax",
        "arco": "Todo parece perdido",
        "palabras_objetivo": 100000,
        "capitulos": 15,
        "personajes": ["Convergencia de todos"],
        "temas": ["Esperanza", "Profecia", "Revelacion"],
        "tono": "Desolacion con chispas de luz, urgencia",
        "estructura_cron": "Tension maxima, no-linealidad estrategica"
    },
    "libro_6": {
        "titulo": "APOCALIPSIS",
        "subtitulo": "Verdad y Transformacion",
        "arco": "Resolucion",
        "palabras_objetivo": 90000,
        "capitulos": 12,
        "personajes": ["Todos - destinos finales"],
        "temas": ["Revelacion final", "Transformacion", "Ciclo/Nuevo inicio"],
        "tono": "Catharsis, resolucion emocional, apertura",
        "estructura_cron": "ESPEJO Libro 1 - final secreto accesible"
    },
    "libro_7": {
        "titulo": "VOYNICH",
        "subtitulo": "El Manuscrito Companion",
        "arco": "Lore, contexto, meta-narrativa",
        "palabras_objetivo": 40000,
        "capitulos": 6,
        "contenido": ["Diccionario", "Glossario", "Ensayos", "Codigos"],
        "temas": ["Meta-fiction", "Recompensa discoverer", "Claves"],
        "tono": "Enigmatico, academico, revelador",
        "estructura_cron": "Lectura no-lineal - puertas a mundos"
    }
}

# Simbolos recurrentes tipo Reliquias de la Muerte
SIMBOLOS_SAGA = {
    "simbolo_1": {
        "nombre": "El Ojo Fracturado",
        "significado_superficial": "Simbolo de resistencia",
        "significado_oculto": "Representa la estructura multinivel de realidad",
        "apariciones": {
            "libro_1": "Como grafiti en pared (decorativo)",
            "libro_2": "En un medallón robado",
            "libro_3": "Revelado como insignia de los Fragmentados",
            "libro_4": "Aparece en suenos de todos los personajes",
            "libro_5": "Marcado en coordenadas del final",
            "libro_6": "Clave para el verdadero final",
            "libro_7": "Explicacion completa en ensayo"
        }
    },
    "simbolo_2": {
        "nombre": "Los Seis Circulos",
        "significado_superficial": "Logo del Comite",
        "significado_oculto": "Representa los 6 puntos de vista necesarios",
        "apariciones": {
            "libro_1": "En el suelo del Archivo (pasa desapercibido)",
            "libro_2": "Diagrama en documento classificado",
            "libro_3": "Ana ve el patron en estrellas",
            "libro_4": "Mapa de ubicaciones clave",
            "libro_5": "Profecia escrita en circulos",
            "libro_6": "Forma para alinear portadas",
            "libro_7": "Explicacion matematica/estetica"
        }
    },
    "numero_6": {
        "significado": "Los 6 puntos de vista, 6 realidades",
        "apariciones": ["Libro 1: cap 6 revelador", "Capitulo 6 de cada libro es pivotal", "6 personajes con POV"]
    },
    "numero_7": {
        "significado": "Completitud, el companion",
        "apariciones": ["7 libros totales", "Capitulo 7 de cada libro: cierre temporal", "7 simbolos ocultos"]
    }
}

# Easter eggs tipo Crono Trigger
EASTER_EGGS = {
    "eg1_url_oculta": {
        "tipo": "URL real",
        "ubicacion": "Contraportada Libro 3",
        "revela": "medioevo-saga.com/fragmento - capítulo bonus",
        "codigo": "Numericos en orden de aparición"
    },
    "eg2_texto_cifrado": {
        "tipo": "Cifrado Cesar",
        "ubicacion": "Dedicatoria Libro 6",
        "revela": "Coordenadas GPS en Madrid",
        "codigo": "Clave: n=6 (numero de libros)"
    },
    "eg3_qr_portadas": {
        "tipo": "QR fragmentado",
        "ubicacion": "Cada portada tiene 1/6 del QR",
        "revela": "Video mensaje del autor",
        "codigo": "Alinear las 6 portadas"
    },
    "eg4_capitulo_fantasma": {
        "tipo": "Capitulo oculto",
        "ubicacion": "Libro digital con codigo unico",
        "revela": "Epilogo verdadero",
        "condicion": "Completar los 6 libros + resolver puzzle Voynich"
    },
    "eg5_narrador_oculto": {
        "tipo": "Meta-revelacion",
        "ubicacion": "Dispersa en los 6 libros",
        "revela": "El narrador es un personaje",
        "pista": "Inconsistencias en descripciones"
    }
}

def cargar_patrones():
    """Carga los patrones detectados del Agente 12"""
    ruta = OUTPUT_DIR / "12_PATRONES_DETECTADOS.json"
    if ruta.exists():
        with open(ruta, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def generar_outline_libro(libro_key: str, libro_data: Dict, patrones: Dict) -> Dict:
    """Genera outline detallado para un libro especifico"""

    outline = {
        "meta": libro_data,
        "estructura_capitulos": [],
        "arcos_personaje": {},
        "puntos_giro": [],
        "simbolos_incluidos": [],
        "easter_eggs": [],
        "adaptaciones_por_perfil": {}
    }

    # Generar estructura de capitulos
    num_capitulos = libro_data["capitulos"]
    palabras_por_capitulo = libro_data["palabras_objetivo"] // num_capitulos

    for cap_num in range(1, num_capitulos + 1):
        capitulo = {
            "numero": cap_num,
            "titulo_capitulo": f"CAPITULO_{cap_num:02d}",
            "palabras_estimadas": palabras_por_capitulo,
            "escenas": [],
            "personajes_presentes": [],
            "revelaciones": [],
            "cliffhanger": cap_num < num_capitulos
        }

        # Distribucion de escenas por capitulo
        if cap_num == 1:
            capitulo["titulo_capitulo"] = "APERTURA"
            capitulo["escenas"] = ["Hook inmediato", "Estado actual", "Perturbacion"]
            capitulo["revelaciones"] = ["Pregunta central planteada"]
        elif cap_num == num_capitulos // 2:
            capitulo["titulo_capitulo"] = "PUNTO_MEDIO"
            capitulo["escenas"] = ["Revelacion", "Cambio de direccion", "Nueva urgencia"]
        elif cap_num == num_capitulos:
            capitulo["titulo_capitulo"] = "CIERRE"
            capitulo["escenas"] = ["Climax emocional", "Resolucion temporal", "Setup siguiente"]

        outline["estructura_capitulos"].append(capitulo)

    # Adaptaciones por perfil (usando datos del Agente 12)
    if patrones and "recomendaciones_accion" in patrones:
        for rec in patrones["recomendaciones_accion"]:
            perfil_id = rec["perfil_id"]
            adaptaciones = []

            if perfil_id == "PERFIL_01":  # Buscador
                adaptaciones = [
                    f"Capitulo 6: Ensayo filosofico parallel",
                    f"Notas al pie con referencias reales",
                    f"Simbolismo denso en cap {num_capitulos//2}"
                ]
            elif perfil_id == "PERFIL_02":  # Fan
                adaptaciones = [
                    f"Post-capitulo: Teoria de fans",
                    f"Referencias a personajes de otros libros",
                    f"Setup para libro siguiente"
                ]
            elif perfil_id == "PERFIL_03":  # Esceptico
                adaptaciones = [
                    f"Glosario tecnico al final",
                    f"Notas de autor con fuentes",
                    f"Coherencia cientifica validada"
                ]
            elif perfil_id == "PERFIL_04":  # Madre
                adaptaciones = [
                    f"Capitulos <2500 palabras",
                    f"Cliffhanger obligatorio",
                    f"Inmersion rapida garantizada"
                ]
            elif perfil_id == "PERFIL_05":  # Gamer
                adaptaciones = [
                    f"Easter egg codificado en cap {cap_num}",
                    f"Referencia a videojuego",
                    f"Opcion de lectura alternativa"
                ]

            outline["adaptaciones_por_perfil"][perfil_id] = adaptaciones

    return outline

def generar_arcos_saga() -> Dict:
    """Genera arcos de personaje a traves de los 6 libros"""

    return {
        "Ana": {
            "arco": "De esceptica a creyente comprometida",
            "libro_1": "Descubre el Archivo, duda",
            "libro_2": "Comete error, aprende",
            "libro_3": "Revelacion personal - sacrificio",
            "libro_4": "Perdida, oscuridad",
            "libro_5": "Renacimiento, liderazgo",
            "libro_6": "Resolucion, nuevo rol"
        },
        "Marcus": {
            "arco": "De obediente a rebelde transformado",
            "libro_1": "El empleado modelo",
            "libro_2": "Primeras dudas",
            "libro_3": "Crisis de fe",
            "libro_4": "Traicion del sistema",
            "libro_5": "Guerrilla, resistencia",
            "libro_6": "Sacrificio redentor"
        },
        "Sofia": {
            "arco": "De maestra a estudiante del cosmos",
            "libro_3": "Introduccion",
            "libro_4": "Aprendizaje forzado",
            "libro_5": "Maestria, ensenanza",
            "libro_6": "Transmision del conocimiento"
        }
    }

def planificar_saga_completa():
    """Genera la planificacion completa de los 7 libros"""

    print("Cargando patrones de lectores...")
    patrones = cargar_patrones()

    print("Generando outlines...\n")

    outlines = {}
    for libro_key, libro_data in ESTRUCTURA_SAGA.items():
        if libro_key != "libro_7":  # El companion tiene tratamiento especial
            print(f"Planificando {libro_key.upper()}: {libro_data['titulo']}...")
            outlines[libro_key] = generar_outline_libro(libro_key, libro_data, patrones)
        else:
            print(f"Planificando {libro_key.upper()}: {libro_data['titulo']} (Companion)...")
            outlines[libro_key] = {
                "meta": libro_data,
                "estructura": "No-lineal - entradas alfabeticas",
                "secciones": [
                    "A-F: Diccionario bilingue (espanol/Archivo)",
                    "G-L: Glossario filosofico-cientifico",
                    "M-R: Ensayos tematicos por expertos ficticios",
                    "S-Z: Codigos, cifrados, pistas",
                    "Apendices: Lineas temporales, genealogias"
                ],
                "meta_contenido": "Revela verdades que cambian lectura de libros 1-6"
            }

    # Arcos de personajes
    arcos = generar_arcos_saga()

    # Output completo
    output = {
        "fecha_planificacion": datetime.now().isoformat(),
        "version": "1.0",
        "resumen_saga": {
            "libros_totales": 7,
            "palabras_totales": sum(b["palabras_objetivo"] for b in ESTRUCTURA_SAGA.values()),
            "capitulos_totales": sum(b["capitulos"] for b in ESTRUCTURA_SAGA.values()),
            "estructura_base": "6 libros narrativos + 1 companion",
            "temas_centrales": ["Pertencia", "Identidad", "Verdad", "Simulacion/Reality"]
        },
        "simbolos_recurrentes": SIMBOLOS_SAGA,
        "easter_eggs_sistema": EASTER_EGGS,
        "outlines_detallados": outlines,
        "arcos_personajes": arcos,
        "estrategia_rayuela": {
            "libro_1_6_espejo": "Apertura y cierre comparten ubicacion",
            "lctura_no_lineal": "Capitulos marcados con iconos",
            "recompensa_relectura": "Nuevas capas visibles al saber final",
            "sistema_easter_eggs": "5 niveles de descubrimiento"
        },
        "proximos_pasos_escritura": [
            "Generar capítulo 1 Libro 1 como prueba",
            "Validar tono con focus group",
            "Iterar según feedback",
            "Continuar escritura automatizada"
        ]
    }

    # Guardar
    ruta_salida = OUTPUT_DIR / "13_OUTLINE_SAGA_COMPLETA.json"
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Planificacion guardada: {ruta_salida}")
    print(f"Total: {output['resumen_saga']['libros_totales']} libros")
    print(f"Palabras: {output['resumen_saga']['palabras_totales']:,}")
    print(f"Capitulos: {output['resumen_saga']['capitulos_totales']}")

    return output

if __name__ == "__main__":
    print("=" * 60)
    print("AGENTE 13: PLANIFICADOR DE LIBROS")
    print("=" * 60)
    print("\nCreando outline de la saga completa...\n")

    planificacion = planificar_saga_completa()

    print("\nAgente 13 completado: Outline generado")
