#!/usr/bin/env python3
"""
AGENTE 6: LECTURA PROFUNDA Y DETECCION DE PATRONES OCULTOS
Simula lectura completa de los 35 libros y detecta:
- Patrones tipo "Rayuela" (lectura no lineal)
- Patrones tipo "Crono Trigger" (multiples finales/capas)
- Easter eggs ocultos
- Conexiones cruzadas entre libros
- Insights emergentes de la obra completa

Basado en:
- Teoria de narrativa hipertextual (Rayuela, 1963)
- Narrativa no lineal (Crono Trigger, 1995)
- Literatura ergodica (Espen Aarseth, 1997)
- Analisis de patrones en sagas complejas (GoT, Wheel of Time, Sandman)

Output: Mapa de patrones ocultos y recomendaciones para 'discoverers'
"""

import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict
import hashlib

# Patrones de narrativa compleja observados en obras maestras
PATRONES_RAYUELA_CRONO = {
    "lectura_no_lineal": {
        "descripcion": "El lector puede elegir orden de lectura",
        "ejemplos": ["Rayuela (Cortazar)", "House of Leaves (Danielewski)", "S. (Dorst/Abrams)"],
        "aplicacion_medioevo": [
            "Capitulos 'desconectados' que se leen en cualquier orden",
            "Sistema de 'capitulos espejo' (mismo evento, diferente perspectiva)",
            "Indice alternativo al final del libro"
        ],
        "requisito": "Cada ruta debe dar experiencia coherente"
    },
    "multiples_capas": {
        "descripcion": "La misma obra se lee diferente segun profundidad",
        "ejemplos": [
            "Crono Trigger (final secreto tras 100+ horas)",
            "Matrix (primera vista = accion, segunda = filosofia)",
            "Harry Potter (infantil → adulto, temas maduran)"
        ],
        "aplicacion_medioevo": [
            "Capa 1: Aventura superficial (lector casual)",
            "Capa 2: Filosofia/ciencia (lector atento)",
            "Capa 3: Conexiones ocultas (discoverer)",
            "Capa 4: Meta-narrativa (autor dentro de obra)"
        ]
    },
    "easter_eggs_ocultos": {
        "descripcion": "Contenido solo visible tras ciertas acciones",
        "ejemplos": [
            "Fight Club (paginas 148-149 ocultas)",
            "Inception (codigo en poster)",
            "Ready Player One (referencias que requieren investigacion)"
        ],
        "aplicacion_medioevo": [
            "Codigos en portadas (URL ocultas)",
            "Paginas web ocultas (descubribles con codigos)",
            "Capitulos 'fantasma' (solo accesibles online)",
            "Texto cifrado en agradecimientos"
        ]
    },
    "conexiones_cruzadas": {
        "descripcion": "Elementos de libros diferentes se conectan",
        "ejemplos": [
            "Marvel Cinematic Universe (post-credits scenes)",
            "Stephen King's Dark Tower universe",
            "Brandon Sanderson Cosmere"
        ],
        "aplicacion_medioevo": [
            "Personaje secundario Libro 1 = protagonista Libro 4",
            "Objeto sin importancia Libro 2 = clave Libro 6",
            "Frase dicha al azar Libro 1 = profecia Libro 5",
            "Mismo simbolo en portadas de todos los libros"
        ]
    },
    "finales_multiple": {
        "descripcion": "Diferentes lectores experimentan finales distintos",
        "ejemplos": [
            "Crono Trigger (13 finales)",
            "Nier: Automata (finales A-E, algunos no canonicos)",
            "El fin de la infancia (Asimov) - interpretacion abierta"
        ],
        "aplicacion_medioevo": [
            "Edicion digital: final varia segun decisiones previas",
            "Edicion fisica: diferentes prints tienen finales ligeramente distintos",
            "Edicion 'completa': revela final verdadero tras completar todos los libros"
        ]
    }
}

# Insights que buscan los discoverers
INSIGHTS_DISCOVERER = {
    "tipo_1_simetria": "Patrones simetricos entre libros (1-6, 2-5, 3-4)",
    "tipo_2_simbolismo": "Simbolos que se repiten con variacion",
    "tipo_3_numerologia": "Numeros significativos (6, 7, 61, 666, 108)",
    "tipo_4_referencias": "Guinos a obras maestras (Matrix, Evangelion, Dark)",
    "tipo_5_meta": "El autor dentro de la obra (narrador no confiable)",
    "tipo_6_profecia": "Predicciones que se cumplen de forma inesperada",
    "tipo_7_conexion": "Personajes/objetos que conectan libros aparentemente desconectados"
}

def analizar_patrones_35_libros() -> Dict:
    """
    Simula analisis profundo de los 35 libros
    Detecta patrones potenciales tipo Rayuela/Crono Trigger
    """

    # Estructura 6+1 base
    estructura_base = {
        "libro_1": "Despertar - El llamado a la aventura",
        "libro_2": "Profundizacion - Primeras pruebas",
        "libro_3": "Punto_medio - Revelacion que cambia todo",
        "libro_4": "Consecuencias - El mundo se oscurece",
        "libro_5": "Pre-climax - Todo parece perdido",
        "libro_6": "Resolucion - Verdad y transformacion",
        "libro_7": "Companion - Voynich, lore, contexto"
    }

    # Patrones detectados en la simulacion
    patrones_detectados = {
        "patron_simetria_6_1": {
            "descripcion": "Libro 1 y 6 son espejos (inicio = fin)",
            "evidencia_simulada": [
                "Misma ubicacion geografica",
                "Mismo personaje inicia y cierra",
                "Misma frase dicha en contexto diferente",
                "Estacion del ano invertida"
            ],
            "ejemplo_real": "Harry Potter 1 y 7 (empiezan en casa Dursley, terminan en Hogwarts/epilogo)",
            "recomendacion": "Asegurar que ultima escena refleje primera escena con variacion"
        },
        "patron_simbolo_recurrente": {
            "descripcion": "Simbolo que aparece en todos los libros con variacion",
            "evidencia_simulada": [
                "Libro 1: Simbolo introducido como decorativo",
                "Libro 2: Simbolo en contexto diferente",
                "Libro 3: Simbolo revelado como importante",
                "Libro 4-6: Simbolo en momentos clave",
                "Libro 7: Significado completo revelado"
            ],
            "ejemplo_real": "Harry Potter - Reliquias de la Muerte (simbolo aparece en toda la saga)",
            "recomendacion": "Crear 3-5 simbolos recurrentes con significado evolutivo"
        },
        "patron_numerologia": {
            "descripcion": "Numeros significativos se repiten",
            "numeros_clave": {
                "6": "Estructura base (6 libros + 1 companion)",
                "7": "Completitud, companion Voynich",
                "3": "Estructura de actos, triadas",
                "12": "Capitulos por libro (simulado)"
            },
            "ejemplo_real": "Lost (4, 8, 15, 16, 23, 42), Dark (33 anos, 3 mundos)",
            "recomendacion": "Incorporar numerologia de forma organica, no forzada"
        },
        "patron_profecia_autocumplida": {
            "descripcion": "Personaje lee/escucha profecia que luego cumple sin saber",
            "evidencia_simulada": [
                "Libro 1: Personaje escucha profecia como contexto",
                "Libro 3: Personaje recuerda profecia pero no la entiende",
                "Libro 5: Personaje descubre que EL es parte de profecia",
                "Libro 6: Personaje CUMPLE profecia al intentar evitarla"
            ],
            "ejemplo_real": "Matrix (Neo es 'El Elegido'), Star Wars (Anakin y profecia)",
            "recomendacion": "Profecia debe ser ambigua al inicio, clara al final"
        },
        "patron_narrador_no_confiable": {
            "descripcion": "Narrador oculta informacion crucial o miente",
            "evidencia_simulada": [
                "Libro 1-2: Narrador parece objetivo",
                "Libro 3: Pequena inconsistencia detectable",
                "Libro 4: Inconsistencia se amplifica",
                "Libro 5: Revelacion parcial - algo no cuadra",
                "Libro 6: Revelacion total - narrador omitio/cambio informacion clave"
            ],
            "ejemplo_real": "Fight Club, Gone Girl, The Usual Suspects",
            "recomendacion": "Pistas sutiles, no imposibles de detectar en re-lectura"
        },
        "patron_conexion_oculta": {
            "descripcion": "Personajes/objetos conectan libros aparentemente desconectados",
            "evidencia_simulada": [
                "Libro 1: Personaje secundario sin importancia",
                "Libro 2: Mismo personaje en contexto diferente",
                "Libro 3: Se revela conexion con protagonista",
                "Libro 4-6: Personaje secundario resulta clave"
            ],
            "ejemplo_real": "Marvel (Nick Fury aparece en todas las peliculas Phase 1)",
            "recomendacion": "Crear 2-3 personajes 'hilo conductor' entre libros"
        }
    }

    # Insights tipo Crono Trigger
    insights_crono = {
        "final_secreto": {
            "descripcion": "Final verdadero solo accesible tras completar saga",
            "requisito": "Jugador/lector debe completar ciertas condiciones",
            "ejemplo": "Crono Trigger requiere 13 endings + New Game+",
            "aplicacion_medioevo": [
                "Leer todos los 6 libros en orden correcto",
                "Encontrar codigos ocultos en cada libro",
                "Combinar codigos para acceder capitulo final online",
                "Capitulo final revela 'verdad' sobre toda la saga"
            ]
        },
        "nuevo_juego_plus": {
            "descripcion": "Re-leer cambia experiencia (nueva informacion visible)",
            "ejemplo": "Crono Trigger New Game+ mantiene items pero agrega escenas",
            "aplicacion_medioevo": [
                "Edicion digital: segunda lectura muestra texto adicional",
                "Notas al pie que solo aparecen en re-lectura",
                "Codigos QR que cambian segun 'vez' que se escanea"
            ]
        }
    }

    return {
        "estructura_base": estructura_base,
        "patrones_detectados": patrones_detectados,
        "insights_crono_trigger": insights_crono,
        "recomendaciones_generales": [
            "No forzar patrones - deben emerger organicamente",
            "Cada libro debe funcionar standalone ADEMAS de conectar con saga",
            "Pistas para discoverers pero sin alienar lectores casuales",
            "Capas: superficie (todos disfrutan) → profundidad (discoverers excavan)",
            "Re-lectura debe recompensar con nueva comprension"
        ]
    }

def generar_mapa_patrones():
    """Genera mapa completo de patrones ocultos"""

    analisis = analizar_patrones_35_libros()

    output = {
        "fecha": datetime.now().isoformat(),
        "version": "1.0",
        "tipo": "Analisis de Patrones Ocultos - Tipo Rayuela/Crono Trigger",
        "base_teorica": [
            "Rayuela (Cortazar, 1963) - lectura no lineal",
            "Crono Trigger (Square, 1995) - multiples finales",
            "Literatura ergodica (Aarseth, 1997)",
            "Hipertexto y narrativa digital"
        ],
        "analisis_estructura": analisis["estructura_base"],
        "patrones_rayuela_crono": analisis["patrones_detectados"],
        "insights_tipo_crono": analisis["insights_crono_trigger"],
        "recomendaciones_discoverers": {
            "para_lectores_casuales": [
                "Disfrutar historia superficial sin buscar patrones",
                "Cada libro es autocontenido",
                "No es necesario buscar easter eggs"
            ],
            "para_lectores_atentos": [
                "Prestar atencion a simbolos recurrentes",
                "Notar frases que se repiten",
                "Seguir personajes secundarios entre libros"
            ],
            "para_discoverers": [
                "Buscar codigos en portadas/contraportadas",
                "Visitar URLs ocultas en agradecimientos",
                "Unirse a Discord para teorias",
                "Comparar ediciones fisicas vs digitales",
                "Re-leer Libro 1 tras completar Libro 6"
            ]
        },
        "easter_eggs_sugeridos": [
            {
                "tipo": "Codigo URL",
                "ubicacion": "Contraportada Libro 3",
                "revela": "Pagina web oculta con capitulo bonus"
            },
            {
                "tipo": "Texto cifrado",
                "ubicacion": "Agradecimientos Libro 6",
                "revela": "Coordenadas para contenido extra"
            },
            {
                "tipo": "Simbolo oculto",
                "ubicacion": "Todas las portadas",
                "revela": "Patron completo al alinear las 6 portadas"
            },
            {
                "tipo": "Capitulo fantasma",
                "ubicacion": "Online con codigo de compra",
                "revela": "Epilogo verdadero (no canonico para todos)"
            }
        ],
        "metricas_exito_discoverer": [
            "% de lectores que detectan primer easter egg",
            "Tiempo promedio en descubrir conexion oculta",
            "Teorias generadas en Reddit/Discord",
            "Re-lectura rate (lectores que releen Libro 1 tras Libro 6)"
        ]
    }

    return output

def guardar_mapa(ruta_salida: str):
    """Guarda el mapa de patrones"""
    mapa = generar_mapa_patrones()
    Path(ruta_salida).parent.mkdir(parents=True, exist_ok=True)
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(mapa, f, indent=2, ensure_ascii=False)
    print(f"Mapa de patrones guardado en: {ruta_salida}")
    return mapa

if __name__ == "__main__":
    output_path = "E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS/06_PATRONES_OCULTOS.json"
    guardar_mapa(output_path)
    print("Agente 6 completado: Lector Profundo - Patrones Ocultos")
