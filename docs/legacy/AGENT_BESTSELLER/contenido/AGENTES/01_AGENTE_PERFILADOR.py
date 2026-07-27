#!/usr/bin/env python3
"""
AGENTE 1: PERFILADOR LECTOR

Funcion: Crear perfiles de lectores con background literario contemporaneo profundo.
No solo demografia: contexto de vida, historial de lecturas, puntos de dolor emocional.

Output: Perfiles detallados que explican COMO y POR QUE un lector llega a MEDIOEVO.
"""

import json
from datetime import datetime
from pathlib import Path

# Perfiles base para MEDIOEVO (6+1)
PERFILES_OBJETIVO = [
    {
        "id": "PERFIL_01",
        "nombre": "El Buscador de Verdades Ocultas",
        "rango_edad": "25-40",
        "background_literario": "Leyo Sapiens, Homo Deus, El Alquimista, pero siente que le falta algo. Busca significado profundo.",
        "punto_dolor": "Siente que la realidad es mas compleja de lo que le cuentan. Desconfia de narrativas oficiales.",
        "lectura_reciente": ["El Codigo Da Vinci", "Ready Player One", "Dark (Netflix)"],
        "como_llego": "Recomendacion de amigo en Reddit sobre 'libros que cambian tu perspectiva'",
        "impacto_vida": "Cuestiona su trabajo en tecnologia. ¿Esta construyendo el futuro o destruyendolo?",
        "angulo_resonancia": "MEDIOEVO como espejo de su busqueda personal"
    },
    {
        "id": "PERFIL_02",
        "nombre": "La Fan de Ficciones Complejas",
        "rango_edad": "18-35",
        "background_literario": "Harry Potter, GoT, Shadow and Bone. Ama los mundos expansivos pero se frustra con finales decepcionantes.",
        "punto_dolor": "Ha invertido emocionalmente en sagas que la decepcionaron. Teme que MEDIOEVO sea igual.",
        "lectura_reciente": ["Cuarto Oscuro", "La Rueda del Tiempo", "The Witcher"],
        "como_llego": "BookTok #fantasybooks #newseries",
        "impacto_vida": "Busca comunidad. Quiere pertenecer a un fandom antes del final.",
        "angulo_resonancia": "MEDIOEVO como la saga 'completa' que puede defender"
    },
    {
        "id": "PERFIL_03",
        "nombre": "El Esceptico de la Ciencia Ficcion",
        "rango_edad": "30-50",
        "background_literario": "Lee no-ficcion. Ciencia, historia, filosofia. La ficcion la ve como 'perdida de tiempo' a menos que sea densa.",
        "punto_dolor": "Quiere ficcion que no se sienta como ficcion. Ideas > Personajes (pero no lo admite).",
        "lectura_reciente": ["Black Mirror", "Ex Machina", "Sapiens"],
        "como_llego": "Articulo sobre 'la ficcion que predijo el presente'",
        "impacto_vida": "En crisis de mediana edad. ¿El conocimiento lo hace mas libre o mas infeliz?",
        "angulo_resonancia": "MEDIOEVO como filosofia disfrazada de novela"
    },
    {
        "id": "PERFIL_04",
        "nombre": "La Madre que Lee de Noche",
        "rango_edad": "35-50",
        "background_literario": "Leia mucho antes de los hijos. Ahora lee fragmentado. Necesita inmersion rapida.",
        "punto_dolor": "No tiene tiempo. Cada pagina debe valer la pena. Abandona libros que 'no la atrapan'.",
        "lectura_reciente": ["Donde los arboles cantan", "La Sombra del Viento", "Outlander"],
        "como_llego": "Club de lectura online. Necesita excusa para leer.",
        "impacto_vida": "Se pregunta si 'ella' sigue ahi. La maternidad la transformo, ¿la perdio?",
        "angulo_resonancia": "MEDIOEVO como recordatorio de que su mente sigue afilada"
    },
    {
        "id": "PERFIL_05",
        "nombre": "El Gamer de Narrativas",
        "rango_edad": "20-35",
        "background_literario": "Juega mas de lo que lee. Pero los juegos que ama tienen historias densas (Disco Elysium, Detroit).",
        "punto_dolor": "La ficcion interactiva lo malacostumbro. Quiere elegir, no solo leer.",
        "lectura_reciente": ["Ready Player Two", "Neuromante", "Snow Crash"],
        "como_llego": "Foros de videojuegos. 'Si te gusto Disco Elysium, lee esto'.",
        "impacto_vida": "Trabaja en tech. ¿Sus creaciones liberan o controlan?",
        "angulo_resonancia": "MEDIOEVO como el 'juego' que no necesita controller"
    }
]

def generar_perfiles():
    """Genera archivo JSON con perfiles detallados."""
    output = {
        "fecha": datetime.now().isoformat(),
        "total_perfiles": len(PERFILES_OBJETIVO),
        "perfiles": PERFILES_OBJETIVO,
        "notas": [
            "Perfiles basados en patrones de consumo literario 2024-2026",
            "Cada perfil incluye angulo de resonancia emocional",
            "Usar para calibrar angulos de marketing, NO para cambiar el CORE"
        ]
    }
    return output

def guardar_perfiles(ruta_salida):
    """Guarda perfiles en JSON."""
    perfiles = generar_perfiles()
    Path(ruta_salida).parent.mkdir(parents=True, exist_ok=True)
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(perfiles, f, indent=2, ensure_ascii=False)
    print(f"Perfiles guardados en: {ruta_salida}")
    return perfiles

if __name__ == "__main__":
    output_path = "E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS/01_PERFILES_LECTORES.json"
    guardar_perfiles(output_path)
    print("Agente 1 completado: Perfilado de lectores")
