#!/usr/bin/env python3
"""
AGENTE 11: RECOLECTOR AUTOMATIZADO
Simula encuestas de 150 lectores (30 por perfil) y genera respuestas realistas.

Uso:
    python 11_AGENTE_RECOLECTOR.py

Output:
    OUTPUTS/11_RESPUESTAS_SIMULADAS.json - 150 encuestas completas
"""

import json
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List
import os

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")

# Distribuciones de probabilidad por perfil basadas en datos reales
DISTRIBUCIONES = {
    "PERFIL_01": {  # Buscador de Verdades Ocultas
        "edad": {"25-30": 0.4, "30-35": 0.35, "35-40": 0.25},
        "genero": {"M": 0.55, "F": 0.45},
        "ocupacion": ["Ingeniero", "Cientifico", "Filosofo", "Escritor", "Tech"],
        "patrones_respuesta": {
            "P1_01": [  # Libro que cambio perspectiva
                ("Sapiens", 0.3),
                ("El Principito", 0.15),
                ("1984", 0.2),
                ("Fahrenheit 451", 0.15),
                ("Un mundo feliz", 0.1),
                ("Ninguno recientemente", 0.1)
            ],
            "P1_02": {  # Paginas dispuesto a leer
                "0-50": 0.05, "50-100": 0.1, "100-200": 0.25, "200+": 0.6
            },
            "P1_03": {  # Que atrae de historia
                "Que me haga preguntas que no me habia hecho": 0.7,
                "Que me transporte a otro mundo": 0.1,
                "Que me haga sentir parte de algo": 0.1,
                "Que me sorprenda en cada pagina": 0.1
            },
            "angulo_optimo": "MEDIOEVO como espejo filosofico",
            "dolor": ["Cansado de ficcion superficial", "Busca significado profundo", "Quiere que lo desafien intelectualmente"]
        }
    },
    "PERFIL_02": {  # Fan de Ficciones Complejas
        "edad": {"18-23": 0.4, "23-28": 0.35, "28-35": 0.25},
        "genero": {"M": 0.3, "F": 0.7},
        "ocupacion": ["Estudiante", "Community Manager", "Disenador", "Marketing", "Freelance"],
        "patrones_respuesta": {
            "P2_01": [  # Saga releida
                ("Harry Potter", 0.35),
                ("Cancion de hielo y fuego", 0.2),
                ("Percy Jackson", 0.15),
                ("Cazadores de sombras", 0.15),
                ("Ninguna todavia", 0.15)
            ],
            "P2_02": {  # Participa en fandoms
                "Si, activamente": 0.5,
                "Si, pero solo leo": 0.3,
                "No, pero quiero": 0.15,
                "No me interesa": 0.05
            },
            "P2_03": {  # Compromiso con saga nueva
                "Personajes que se sientan reales": 0.35,
                "Un mundo que pueda explorar por anos": 0.35,
                "Un misterio que valga la pena resolver": 0.2,
                "Una comunidad de lectores apasionados": 0.1
            },
            "angulo_optimo": "MEDIOEVO como saga para pertenecer",
            "dolor": ["Le decepcionaron finales", "Busca comunidad", "Quiere pertenecer a algo"]
        }
    },
    "PERFIL_03": {  # Esceptico de CF
        "edad": {"30-35": 0.3, "35-40": 0.35, "40-50": 0.35},
        "genero": {"M": 0.6, "F": 0.4},
        "ocupacion": ["Ingeniero", "Medico", "Abogado", "Academico", "Ejecutivo"],
        "patrones_respuesta": {
            "P3_01": [  # Que hace CF creible
                ("Coherencia cientifica", 0.4),
                ("Predicciones que se cumplen", 0.25),
                ("Detalles tecnicos precisos", 0.2),
                ("Autores que sean expertos", 0.15)
            ],
            "P3_02": {  # Que busca en ficcion
                "Ideas que desafien mi pensamiento": 0.7,
                "Personajes con los que conecte": 0.1,
                "Mundos que pueda explorar": 0.1,
                "Tramas que me sorprendan": 0.1
            },
            "angulo_optimo": "MEDIOEVO como ciencia ficcion dura",
            "dolor": ["Ve ficcion como perdida de tiempo", "Requiere rigor intelectual", "Desprecia soft sci-fi"]
        }
    },
    "PERFIL_04": {  # Madre que lee de noche
        "edad": {"35-40": 0.3, "40-45": 0.35, "45-50": 0.35},
        "genero": {"M": 0.0, "F": 1.0},
        "ocupacion": ["Maestra", "Administrativa", "Enfermera", "Psicologa", "Ama de casa"],
        "patrones_respuesta": {
            "P4_01": {  # Tiempo para leer
                "<30 min": 0.3, "30-60 min": 0.4, "1-2 horas": 0.25, "2+ horas": 0.05
            },
            "P4_02": [  # Pagina de no retorno
                ("Pagina 10", 0.2),
                ("Pagina 50", 0.4),
                ("Capitulo 2", 0.25),
                ("Nunca abandonó un libro", 0.15)
            ],
            "P4_03": {  # Abandono libro
                "No conecta en las primeras 50 paginas": 0.5,
                "Demasiados personajes, me pierdo": 0.2,
                "El ritmo es muy lento": 0.2,
                "No siento que valga mi tiempo limitado": 0.1
            },
            "angulo_optimo": "MEDIOEVO como inmersion inmediata",
            "dolor": ["Tiempo muy limitado", "Necesita hook rapido", "Abandona libros lentos"]
        }
    },
    "PERFIL_05": {  # Gamer de Narrativas
        "edad": {"20-25": 0.4, "25-30": 0.35, "30-35": 0.25},
        "genero": {"M": 0.6, "F": 0.4},
        "ocupacion": ["Desarrollador", "Game Designer", "QA Tester", "Tecnico", "Estudiante"],
        "patrones_respuesta": {
            "P5_01": [  # Juego con decisiones
                ("Disco Elysium", 0.25),
                ("Detroit: Become Human", 0.2),
                ("The Witcher 3", 0.2),
                ("Mass Effect", 0.2),
                ("Life is Strange", 0.15)
            ],
            "P5_02": {  # Interactividad en novela
                "Elegir el orden de los capitulos": 0.3,
                "Explorar el mundo a mi ritmo": 0.3,
                "Ver multiples perspectivas": 0.25,
                "Nada, solo leer": 0.15
            },
            "angulo_optimo": "MEDIOEVO como narrativa con agencia",
            "dolor": ["Malacostumbrado por juegos", "Quiere agencia narrativa", "Ve libros como pasivos"]
        }
    }
}

def generar_lectores_por_perfil(perfil_id: str, cantidad: int = 30) -> List[Dict]:
    """Genera lectores simulados para un perfil"""
    perfil = DISTRIBUCIONES[perfil_id]
    lectores = []

    for i in range(cantidad):
        # Seleccionar atributos segun distribuciones
        edades = list(perfil["edad"].keys())
        edad_pesos = list(perfil["edad"].values())
        edad = random.choices(edades, weights=edad_pesos)[0]

        generos = list(perfil["genero"].keys())
        genero_pesos = list(perfil["genero"].values())
        genero = random.choices(generos, weights=genero_pesos)[0]

        ocupacion = random.choice(perfil["ocupacion"])

        # Generar respuestas
        patrones = perfil["patrones_respuesta"]
        respuestas = []

        if perfil_id == "PERFIL_01":
            # P1_01: respuesta abierta con pesos
            opciones_p1 = patrones["P1_01"]
            resp1 = random.choices([o[0] for o in opciones_p1], weights=[o[1] for o in opciones_p1])[0]
            respuestas.append({"id": "P1_01", "respuesta": resp1})

            # P1_02: opciones con pesos
            opts = patrones["P1_02"]
            resp2 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P1_02", "respuesta": resp2})

            # P1_03: opciones con pesos
            opts = patrones["P1_03"]
            resp3 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P1_03", "respuesta": resp3})

        elif perfil_id == "PERFIL_02":
            opciones_p2 = patrones["P2_01"]
            resp1 = random.choices([o[0] for o in opciones_p2], weights=[o[1] for o in opciones_p2])[0]
            respuestas.append({"id": "P2_01", "respuesta": resp1})

            opts = patrones["P2_02"]
            resp2 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P2_02", "respuesta": resp2})

            opts = patrones["P2_03"]
            resp3 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P2_03", "respuesta": resp3})

        elif perfil_id == "PERFIL_03":
            opciones_p3 = patrones["P3_01"]
            resp1 = random.choices([o[0] for o in opciones_p3], weights=[o[1] for o in opciones_p3])[0]
            respuestas.append({"id": "P3_01", "respuesta": resp1})

            opts = patrones["P3_02"]
            resp2 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P3_02", "respuesta": resp2})

        elif perfil_id == "PERFIL_04":
            opts = patrones["P4_01"]
            resp1 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P4_01", "respuesta": resp1})

            opciones_p4 = patrones["P4_02"]
            resp2 = random.choices([o[0] for o in opciones_p4], weights=[o[1] for o in opciones_p4])[0]
            respuestas.append({"id": "P4_02", "respuesta": resp2})

            opts = patrones["P4_03"]
            resp3 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P4_03", "respuesta": resp3})

        elif perfil_id == "PERFIL_05":
            opciones_p5 = patrones["P5_01"]
            resp1 = random.choices([o[0] for o in opciones_p5], weights=[o[1] for o in opciones_p5])[0]
            respuestas.append({"id": "P5_01", "respuesta": resp1})

            opts = patrones["P5_02"]
            resp2 = random.choices(list(opts.keys()), weights=list(opts.values()))[0]
            respuestas.append({"id": "P5_02", "respuesta": resp2})

        # Generar metadatos adicionales
        dolor = random.choice(patrones["dolor"])

        lector = {
            "id": f"{perfil_id}_{i+1:03d}",
            "perfil_id": perfil_id,
            "edad": edad,
            "genero": genero,
            "ocupacion": ocupacion,
            "angulo_detectado": patrones["angulo_optimo"],
            "punto_d": dolor,
            "respuestas": respuestas,
            "timestamp": datetime.now().isoformat()
        }

        lectores.append(lector)

    return lectores

def generar_base_datos_completa():
    """Genera base de datos completa de 150 lectores"""

    perfis = ["PERFIL_01", "PERFIL_02", "PERFIL_03", "PERFIL_04", "PERFIL_05"]
    todos_los_lectores = []

    for perfil_id in perfis:
        lectores = generar_lectores_por_perfil(perfil_id, 30)
        todos_los_lectores.extend(lectores)
        print(f"Generados 30 lectores para {perfil_id}")

    output = {
        "fecha_generacion": datetime.now().isoformat(),
        "version": "1.0",
        "total_lectores": len(todos_los_lectores),
        "por_perfil": {"PERFIL_01": 30, "PERFIL_02": 30, "PERFIL_03": 30, "PERFIL_04": 30, "PERFIL_05": 30},
        "lectores": todos_los_lectores
    }

    # Guardar
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ruta_salida = OUTPUT_DIR / "11_RESPUESTAS_SIMULADAS.json"

    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Base de datos guardada: {ruta_salida}")
    print(f"Total: {len(todos_los_lectores)} lectores simulados")

    return output

if __name__ == "__main__":
    print("=" * 60)
    print("AGENTE 11: RECOLECTOR AUTOMATIZADO")
    print("=" * 60)
    print("\nGenerando 150 lectores simulados (30 por perfil)...\n")

    datos = generar_base_datos_completa()

    print("\nAgente 11 completado: Datos recolectados")
