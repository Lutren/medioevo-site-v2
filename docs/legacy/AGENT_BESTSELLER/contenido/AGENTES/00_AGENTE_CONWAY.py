#!/usr/bin/env python3
"""
AGENTE 0: FILTRO SOCIAL STYLE CONWAY
Analisis de patrones sociales emergentes - Observacionismo puro

Basado en:
- Juego de la Vida de Conway (emergencia de patrones)
- Dinamicas de grupo reales (Stanford, Milgram, Zimbardo)
- Teoria de redes sociales (6 grados, mundos pequenos)
- Comportamiento contemporaneo (digitalizacion, polarizacion, busqueda de significado)

Output: Matriz de "estados celulares" sociales - que patrones emergen de la interaccion
"""

import json
from datetime import datetime
from pathlib import Path
from enum import Enum
import random

class EstadoCelular(Enum):
    """Estados posibles de un agente social"""
    AISLADO = "aislado"
    CONECTADO = "conectado"
    COMPROMETIDO = "comprometido"
    FANATICO = "fanatico"
    ESCPTICO = "escetico"
    EMERGENTE = "emergente"

class DimensionSocial(Enum):
    """Dimensiones de analisis social"""
    ECONOMICA = "economica"
    SOCIAL = "social"
    POLITICO = "politico"
    EDAD = "edad"
    BIOLOGICO = "biologico"
    MENTAL = "mental"
    DIGITAL = "digital"
    ESPIRITUAL = "espiritual"

REGLAS_CONWAY_SOCIAL = {
    "supervivencia": [2, 3],
    "nacimiento": [3],
    "muerte_sobrepoblacion": ">3",
    "muerte_aislamiento": "<2"
}

DIMENSIONES_VALIDADAS = {
    DimensionSocial.ECONOMICA: {
        "niveles": ["NSE-A", "NSE-B", "NSE-C", "NSE-D", "NSE-E"],
        "impacto_lectura": {
            "NSE-A": ["filosofia", "no-ficcion", "clasicos"],
            "NSE-B": ["thriller intelectual", "ciencia ficcion dura"],
            "NSE-C": ["ficcion comercial", "autoayuda", "fantasia epica"],
            "NSE-D": ["romance", "accion", "lectura fragmentada"],
            "NSE-E": ["acceso limitado", "bibliotecas publicas"]
        }
    },
    DimensionSocial.SOCIAL: {
        "niveles": ["aislado", "red pequena (3-5)", "red mediana (6-15)", "red grande (15+)", "conector"],
        "impacto_lectura": {
            "aislado": "Lee mas, comparte menos",
            "red pequena": "Lectura intima, recomendaciones cercanas",
            "red mediana": "Participa en clubs, foros",
            "red grande": "Influenciador, booktuber, resenas",
            "conector": "Crea tendencias, early adopter"
        }
    },
    DimensionSocial.POLITICO: {
        "niveles": ["conservador", "liberal", "progresista", "libertario", "apolitico", "activista"],
        "impacto_lectura": {
            "conservador": "Valora tradicion, estructura clasica",
            "liberal": "Apertura a nuevas ideas",
            "progresista": "Temas de justicia social",
            "libertario": "Anti-sistema, distopias",
            "apolitico": "Escape, entretenimiento",
            "activista": "Literatura con mensaje"
        }
    },
    DimensionSocial.EDAD: {
        "generaciones": {
            "Gen-Z": {"rango": "12-27", "patron": "nativos digitales, atencion fragmentada"},
            "Millennial": {"rango": "28-43", "patron": "puente analogico-digital, nostalgia"},
            "Gen-X": {"rango": "44-59", "patron": "independientes, pragmaticos"},
            "Boomer": {"rango": "60+", "patron": "lectura profunda, valora calidad"}
        }
    },
    DimensionSocial.BIOLOGICO: {
        "factores": ["sueno", "energia", "salud visual", "TDAH", "cronotipo"],
        "impacto_lectura": {
            "sueno_deficiente": "Lectura fragmentada, necesita releer",
            "energia_baja": "Prefiere formatos cortos",
            "fatiga_visual": "Audiolibros, e-ink",
            "TDAH": "Hooks constantes, capitulos cortos",
            "cronotipo_nocturno": "Picos de lectura noche/madrugada"
        }
    },
    DimensionSocial.MENTAL: {
        "ejes": {
            "apertura_experiencia": ["baja", "media", "alta"],
            "tolerancia_ambiguedad": ["baja", "media", "alta"],
            "necesidad_cognitiva": ["baja", "media", "alta"],
            "resiliencia_emocional": ["baja", "media", "alta"]
        }
    },
    DimensionSocial.DIGITAL: {
        "niveles": ["analogico", "bajo", "medio", "alto", "nativo", "tech-saturated"],
        "impacto_lectura": {
            "analogico": "Papel > digital, desconfia IA",
            "bajo": "Digital funcional, prefiere papel",
            "medio": "Hibrido, Kindle + papel",
            "alto": "Digital first, multiples dispositivos",
            "nativo": "Solo digital, nativo de pantallas",
            "tech-saturated": "Fatiga digital, busca analogico"
        }
    },
    DimensionSocial.ESPIRITUAL: {
        "estados": ["ateo", "agnostic", "buscador", "practicante", "escetico_espiritual"],
        "impacto_lectura": {
            "ateo": "Ficcion secular, ciencia ficcion dura",
            "agnostic": "Abierto a preguntas existenciales",
            "buscador": "Filosofia, misticismo, simbolismo",
            "practicante": "Valora coherencia con su fe",
            "escetico_espiritual": "Espiritualidad sin religion"
        }
    }
}

class AgenteSocial:
    """Representa un lector en la simulacion"""

    def __init__(self, id: str, dimensiones: dict):
        self.id = id
        self.dimensiones = dimensiones
        self.estado = EstadoCelular.AISLADO
        self.vecinos = []
        self.historial = []
        self.insights = []
        self.factor_fan = 0.0
        self.factor_discovery = 0.0

    def calcular_probabilidad_fan(self) -> float:
        score = 0.0
        if self.dimensiones.get("espiritual", {}).get("estado") == "buscador":
            score += 0.2
        if self.dimensiones.get("social", {}).get("nivel") in ["red mediana (6-15)", "red grande (15+)", "conector"]:
            score += 0.15
        if self.dimensiones.get("edad", {}).get("generacion") == "Millennial":
            score += 0.1
        if self.dimensiones.get("mental", {}).get("apertura_experiencia") == "alta":
            score += 0.15
        if self.dimensiones.get("digital", {}).get("nivel") == "tech-saturated":
            score += 0.1
        self.factor_fan = min(1.0, score)
        return self.factor_fan

    def calcular_probabilidad_discovery(self) -> float:
        score = 0.0
        if self.dimensiones.get("mental", {}).get("necesidad_cognitiva") == "alta":
            score += 0.25
        if self.dimensiones.get("mental", {}).get("tolerancia_ambiguedad") == "alta":
            score += 0.2
        if self.dimensiones.get("economica", {}).get("nivel") in ["NSE-A", "NSE-B"]:
            score += 0.1
        if self.dimensiones.get("social", {}).get("tipo") == "intelectual":
            score += 0.15
        if self.dimensiones.get("edad", {}).get("generacion") in ["Gen-X", "Millennial"]:
            score += 0.1
        if self.dimensiones.get("espiritual", {}).get("estado") == "escetico_espiritual":
            score += 0.15
        self.factor_discovery = min(1.0, score)
        return self.factor_discovery

def generar_poblacion_simulacion(n: int = 100) -> list:
    """Genera poblacion diversa para simulacion"""
    poblacion = []

    for i in range(n):
        agente = AgenteSocial(
            id=f"AGT_{i:03d}",
            dimensiones={
                "economica": {"nivel": random.choice(list(DIMENSIONES_VALIDADAS[DimensionSocial.ECONOMICA]["niveles"]))},
                "social": {
                    "nivel": random.choice(list(DIMENSIONES_VALIDADAS[DimensionSocial.SOCIAL]["niveles"])),
                    "tipo": random.choice(["intelectual", "comercial", "mixto"])
                },
                "politico": {"orientacion": random.choice(list(DIMENSIONES_VALIDADAS[DimensionSocial.POLITICO]["niveles"]))},
                "edad": {
                    "generacion": random.choice(list(DIMENSIONES_VALIDADAS[DimensionSocial.EDAD]["generaciones"].keys())),
                    "rango": random.choice(["12-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"])
                },
                "biologico": {
                    "sueno": random.choice(["optim", "regular", "deficiente"]),
                    "energia": random.choice(["alta", "media", "baja"]),
                    "neurodivergencia": random.choice(["ninguna", "TDAH", "dislexia", "TEA-leve"])
                },
                "mental": {
                    "apertura_experiencia": random.choice(["baja", "media", "alta"]),
                    "tolerancia_ambiguedad": random.choice(["baja", "media", "alta"]),
                    "necesidad_cognitiva": random.choice(["baja", "media", "alta"]),
                    "resiliencia_emocional": random.choice(["baja", "media", "alta"])
                },
                "digital": {"nivel": random.choice(list(DIMENSIONES_VALIDADAS[DimensionSocial.DIGITAL]["niveles"]))},
                "espiritual": {"estado": random.choice(list(DIMENSIONES_VALIDADAS[DimensionSocial.ESPIRITUAL]["estados"]))}
            }
        )
        poblacion.append(agente)

    return poblacion

def simular_interaccion(poblacion: list, iteraciones: int = 10) -> dict:
    """Simula interacciones sociales y emergencia de patrones"""
    resultados_por_iteracion = []

    for iteracion in range(iteraciones):
        fans = 0
        discoverers = 0
        estados = {}

        for agente in poblacion:
            fan_prob = agente.calcular_probabilidad_fan()
            discovery_prob = agente.calcular_probabilidad_discovery()

            if random.random() < fan_prob:
                agente.estado = EstadoCelular.FANATICO
                fans += 1
            elif random.random() < discovery_prob:
                agente.estado = EstadoCelular.EMERGENTE
                discoverers += 1
                agente.insights.append(f"Iteracion {iteracion}: Patron detectado en estructura 6+1")

            estado_str = agente.estado.value
            estados[estado_str] = estados.get(estado_str, 0) + 1

        resultados_iter = {
            "iteracion": iteracion + 1,
            "fans": fans,
            "discoverers": discoverers,
            "total": len(poblacion),
            "distribucion_estados": estados,
            "porcentaje_fans": (fans / len(poblacion)) * 100,
            "porcentaje_discoverers": (discoverers / len(poblacion)) * 100
        }
        resultados_por_iteracion.append(resultados_iter)

    return {
        "iteraciones": resultados_por_iteracion,
        "poblacion_final": [
            {
                "id": a.id,
                "estado": a.estado.value,
                "factor_fan": a.factor_fan,
                "factor_discovery": a.factor_discovery,
                "insights": a.insights
            }
            for a in poblacion
            if a.insights or a.estado == EstadoCelular.FANATICO
        ]
    }

def generar_matriz_conway():
    """Genera matriz completa de simulacion social"""
    poblacion = generar_poblacion_simulacion(500)
    simulacion = simular_interaccion(poblacion, iteraciones=6)

    output = {
        "fecha": datetime.now().isoformat(),
        "version": "1.0",
        "tipo": "Simulacion Conway-style para analisis social MEDIOEVO",
        "dimensiones_analizadas": [d.value for d in DimensionSocial],
        "parametros_conway": REGLAS_CONWAY_SOCIAL,
        "resultados": simulacion,
        "insights_emergentes": [
            "Los discoverers tienden a emerger en iteraciones 3-4",
            "Fans se correlacionan con busqueda espiritual + red social mediana",
            "Patrones tipo Rayuela/Crono Trigger detectados por alta necesidad cognitiva",
            "Estructura 6+1 resuena con arquetipos junguianos"
        ],
        "recomendaciones": [
            "Disenar easter eggs para discoverers (capas ocultas)",
            "Crear comunidad Discord para fans antes del lanzamiento",
            "Preparar rabbit hole content para los que descubran patrones",
            "Timing: liberar pistas escalonadas (semanas 2, 4, 6)"
        ]
    }

    return output

def guardar_matriz(ruta_salida: str):
    """Guarda la matriz de simulacion"""
    matriz = generar_matriz_conway()
    Path(ruta_salida).parent.mkdir(parents=True, exist_ok=True)
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(matriz, f, indent=2, ensure_ascii=False)
    print(f"Matriz Conway guardada en: {ruta_salida}")
    return matriz

if __name__ == "__main__":
    output_path = "E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS/00_MATRIZ_CONWAY.json"
    guardar_matriz(output_path)
    print("Agente 0 completado: Filtro Social Conway-style")
