#!/usr/bin/env python3
"""
AGENTE 3: DISENADOR DE PREGUNTAS

Funcion: Crear bateria de preguntas sin sesgo para calibrar resonancia.
Basado en perfiles (Agente 1) e insights (Agente 2).

Output: Cuestionario observacional para validar angulos con lectores reales.
"""

import json
from datetime import datetime
from pathlib import Path

PREGUNTAS_BASE = {
    "PERFIL_01": {
        "perfil": "El Buscador de Verdades Ocultas",
        "preguntas": [
            {
                "id": "P1_01",
                "tipo": "profundidad",
                "pregunta": "¿Que libro reciente te hizo ver algo cotidiano de forma diferente?",
                "objetivo": "Medir apertura a relecturas del mundo",
                "sin_sesgo": True
            },
            {
                "id": "P1_02",
                "tipo": "resistencia",
                "pregunta": "¿Cuantas paginas estas dispuesto a leer si la recompensa intelectual es alta?",
                "opciones": ["0-50", "50-100", "100-200", "200+"],
                "objetivo": "Medir tolerancia a densidad narrativa"
            },
            {
                "id": "P1_03",
                "tipo": "angulo",
                "pregunta": "¿Que te atrae mas de una historia?",
                "opciones": [
                    "Que me haga preguntas que no me habia hecho",
                    "Que me transporte a otro mundo",
                    "que me haga sentir parte de algo",
                    "Que me sorprenda en cada pagina"
                ],
                "objetivo": "Identificar angulo de resonancia principal"
            }
        ]
    },
    "PERFIL_02": {
        "perfil": "La Fan de Ficciones Complejas",
        "preguntas": [
            {
                "id": "P2_01",
                "tipo": "lealtad",
                "pregunta": "¿Que saga has releido o estas releyendo?",
                "objetivo": "Medir capacidad de compromiso a largo plazo"
            },
            {
                "id": "P2_02",
                "tipo": "comunidad",
                "pregunta": "¿Participas en fandoms, foros o clubs de lectura?",
                "opciones": ["Si, activamente", "Si, pero solo leo", "No, pero quiero", "No me interesa"],
                "objetivo": "Medir deseo de pertenencia"
            },
            {
                "id": "P2_03",
                "tipo": "angulo",
                "pregunta": "¿Que te haria comprometerte con una saga nueva?",
                "opciones": [
                    "Personajes que se sientan reales",
                    "Un mundo que pueda explorar por anos",
                    "Un misterio que valga la pena resolver",
                    "Una comunidad de lectores apasionados"
                ],
                "objetivo": "Identificar angulo de compromiso"
            }
        ]
    },
    "PERFIL_03": {
        "perfil": "El Esceptico de la Ciencia Ficcion",
        "preguntas": [
            {
                "id": "P3_01",
                "tipo": "credibilidad",
                "pregunta": "¿Que hace que la ficcion cientifica sea 'creible' para ti?",
                "objetivo": "Entender sus criterios de validez tecnica"
            },
            {
                "id": "P3_02",
                "tipo": "angulo",
                "pregunta": "¿Que buscas en la ficcion?",
                "opciones": [
                    "Ideas que desafien mi pensamiento",
                    "Personajes con los que conecte",
                    "Mundos que pueda explorar",
                    "Tramas que me sorprendan"
                ],
                "objetivo": "Identificar si prioriza ideas sobre personajes"
            }
        ]
    },
    "PERFIL_04": {
        "perfil": "La Madre que Lee de Noche",
        "preguntas": [
            {
                "id": "P4_01",
                "tipo": "tiempo",
                "pregunta": "¿Cuanto tiempo tienes para leer al dia?",
                "opciones": ["<30 min", "30-60 min", "1-2 horas", "2+ horas"],
                "objetivo": "Medir ventana de atencion disponible"
            },
            {
                "id": "P4_02",
                "tipo": "inmersion",
                "pregunta": "¿En que pagina supiste que un libro te atrapo?",
                "objetivo": "Identificar punto de no retorno"
            },
            {
                "id": "P4_03",
                "tipo": "angulo",
                "pregunta": "¿Que te hace abandonar un libro?",
                "opciones": [
                    "No conecta en las primeras 50 paginas",
                    "Demasiados personajes, me pierdo",
                    "El ritmo es muy lento",
                    "No siento que valga mi tiempo limitado"
                ],
                "objetivo": "Identificar puntos de abandono"
            }
        ]
    },
    "PERFIL_05": {
        "perfil": "El Gamer de Narrativas",
        "preguntas": [
            {
                "id": "P5_01",
                "tipo": "agencia",
                "pregunta": "¿Que videojuego te hizo sentir que tus decisiones importaban?",
                "objetivo": "Medir valoracion de agencia narrativa"
            },
            {
                "id": "P5_02",
                "tipo": "angulo",
                "pregunta": "¿Que te gustaria que una novela te permitiera hacer?",
                "opciones": [
                    "Elegir el orden de los capitulos",
                    "Explorar el mundo a mi ritmo",
                    "Ver multiples perspectivas",
                    "Nada, solo leer"
                ],
                "objetivo": "Identificar deseo de interactividad"
            }
        ]
    }
}

def generar_cuestionario():
    """Genera el cuestionario completo."""
    output = {
        "fecha": datetime.now().isoformat(),
        "version": "1.0",
        "total_preguntas": sum(len(p["preguntas"]) for p in PREGUNTAS_BASE.values()),
        "cuestionario": PREGUNTAS_BASE,
        "instrucciones": {
            "aplicacion": "Aplicar a 20-30 lectores por perfil",
            "tiempo": "15-20 minutos por entrevista",
            "analisis": "Buscar patrones, no porcentajes"
        },
        "notas": [
            "Preguntas abiertas > cerradas",
            "No guiar respuestas",
            "Observar, no interpretar"
        ]
    }
    return output

def guardar_cuestionario(ruta_salida):
    """Guarda el cuestionario en JSON."""
    cuestionario = generar_cuestionario()
    Path(ruta_salida).parent.mkdir(parents=True, exist_ok=True)
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(cuestionario, f, indent=2, ensure_ascii=False)
    print(f"Cuestionario guardado en: {ruta_salida}")
    return cuestionario

if __name__ == "__main__":
    output_path = "E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS/03_PREGUNTAS_CALIBRACION.json"
    guardar_cuestionario(output_path)
    print("Agente 3 completado: Disenador de preguntas")
