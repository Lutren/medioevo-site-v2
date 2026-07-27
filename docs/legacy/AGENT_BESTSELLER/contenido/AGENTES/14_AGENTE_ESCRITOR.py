#!/usr/bin/env python3
"""
AGENTE 14: ESCRITOR AUTOMATIZADO
Genera contenido de libros capítulo por capítulo siguiendo outlines y estilo.

Uso:
    python 14_AGENTE_ESCRITOR.py

Input:
    OUTPUTS/13_OUTLINE_SAGA_COMPLETA.json

Output:
    LIBROS_GENERADOS/Libro_X/ - Capítulos completos en formato texto/markdown
"""

import json
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import os

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")
LIBROS_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/LIBROS_GENERADOS")

# Cargar CORE de MEDIOEVO
def cargar_core() -> Dict:
    """Carga el documento CORE con toda la informacion del proyecto"""
    ruta_core = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/CLAUDE_CORE_MEDIOEVO.md")
    if ruta_core.exists():
        with open(ruta_core, 'r', encoding='utf-8') as f:
            return {"core_disponible": True, "contenido": f.read()[:5000]}  # Preview
    return {"core_disponible": False}

# Plantillas de estilo narrativo (adaptadas del CORE de MEDIOEVO)
PLANTILLAS_ESTILO = {
    "apertura": [
        "El primer archivo se abrió a las {hora}.",
        "Ana no recordaba haber dormido, pero algo había cambiado.",
        "El sistema llevaba {numero} años esperando.",
        "Existen {numero_realidades} realidades, pero solo una es verdadera."
    ],
    "transicion": [
        "\n\nEl tiempo se fragmentó.",
        "\n\nEra el momento.",
        "\n\nNada volvería a ser igual.",
        "\n\n[LOG DEL SISTEMA: FRAGMENTO {num}]"
    ],
    "cierre_capitulo": [
        "Y entonces vio.\n\n# FIN DEL CAPITULO",
        "El archivo se cerró. Por ahora.\n\n# FIN DEL CAPITULO",
        "Marcus guardó el dispositivo. Sabía lo que tenía que hacer.\n\n# FIN DEL CAPITULO",
        "La verdad estaba ahí. Solo necesitaba encontrarla.\n\n# FIN DEL CAPITULO"
    ],
    "dialogo": [
        '"{personaje}, {dialogo}", dijo {observador}.',
        '{observador} miró a {personaje}. "{dialogo}", respondió.',
        '"{dialogo}". Las palabras de {personaje} flotaron en el aire.',
        '{personaje} no dijo nada. Pero {observador} entendió.'
    ]
}

# Banco de escenas modulares
BANCO_ESCENAS = {
    "libro_1": {
        "escena_1_apertura": {
            "titulo": "El Archivo",
            "descripcion": "Ana descubre el sistema de archivos",
            "elementos": ["computadora antigua", "pantalla verde", "archivos numerados"],
            "tono": "Misterio, descubrimiento",
            "personajes": ["Ana"],
            "cliffhanger": False
        },
        "escena_2_perturbacion": {
            "titulo": "El Primer Archivo",
            "descripcion": "Abre Génesis.txt y ve algo imposible",
            "elementos": ["archivo de texto", "datos personales", "prediccion"],
            "tono": "Revelacion, miedo",
            "personajes": ["Ana", "voz del sistema"],
            "cliffhanger": True
        },
        "escena_3_encuentro": {
            "titulo": "Marcus",
            "descripcion": "Conoce al Archivista",
            "elementos": ["biblioteca", "libros viejos", "símbolo oculto"],
            "tono": "Encuentro, advertencia",
            "personajes": ["Ana", "Marcus"],
            "cliffhanger": False
        }
    }
}

# Banco de frases y dialogos
BANCO_FRASES = {
    "Ana_pensamiento": [
        "Quizás todo esto fuera un error.",
        "Pero el archivo no mentía.",
        "¿Y si la realidad fuera simulable?",
        "Seis meses atrás, esto habría parecido imposible."
    ],
    "Marcus_advertencia": [
        "No abras los archivos en orden numérico.",
        "El sistema no perdona errores.",
        "Algunos descubrimientos no pueden se desconocidos.",
        "Esto cambió mi vida. Y no para bien."
    ],
    "Sistema_logs": [
        "[ARCHIVO ACCEDIDO]",
        "[CONTENIDO: RESTRINGIDO]",
        "[ERROR: REALIDAD_NO_VALIDADA]",
        "[ADVERTENCIA: SINTAXIS_INCOMPLETA]"
    ]
}

def cargar_planificacion():
    """Carga el outline del Agente 13"""
    ruta = OUTPUT_DIR / "13_OUTLINE_SAGA_COMPLETA.json"
    if ruta.exists():
        with open(ruta, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def generar_prosa_escena(escena_info: Dict, num_capitulo: int) -> str:
    """Genera texto narrativo para una escena"""

    texto = []

    # Apertura de escena
    titulo_escena = escena_info.get("titulo", f"ESCENA_{random.randint(1,99)}")
    texto.append(f"\n## {titulo_escena}\n")

    # Descripcion inicial (placeholder - en produccion seria IA generativa)
    descripcion = escena_info.get("descripcion", "Escena en desarrollo")
    parrafos_descripcion = descripcion.split('. ')

    for i, parte in enumerate(parrafos_descripcion[:3]):  # Max 3 parrafos
        if parte.strip():
            # Expandir con detalles sensoriales
            expansion = generar_detalles_sensoriales(escena_info.get("elementos", []))
            texto.append(f"{parte.strip()}. {expansion}\n")

    # Personajes en escena
    personajes = escena_info.get("personajes", [])
    if len(personajes) >= 2:
        # Generar dialogo
        dialogo = generar_dialogo(personajes[0], personajes[1], escena_info.get("tono", ""))
        texto.append(dialogo)

    # Pensamiento interno del POV
    if personajes:
        pensamiento = generar_pensamiento_interno(personajes[0])
        texto.append(f"\n\n{pensamiento}\n")

    # Elemento de sistema/logs si aplica
    if random.random() < 0.3:  # 30% de probabilidad
        log = random.choice(BANCO_FRASES["Sistema_logs"])
        texto.append(f"\n*{log}*\n")

    # Cierre
    if escena_info.get("cliffhanger", False):
        cierre = random.choice(PLANTILLAS_ESTILO["transicion"]).replace("{num}", str(num_capitulo))
        texto.append(cierre + "\n")

    return "".join(texto)

def generar_detalles_sensoriales(elementos: List[str]) -> str:
    """Añade detalles sensoriales a la descripcion"""
    if not elementos:
        return ""

    detalles = {
        "computadora antigua": ["El zumbido era constante.", "Las teclas hacian eco en la nada."],
        "pantalla verde": ["El verde fosforescente iluminaba su rostro.", "Caracteres que parpadeaban."],
        "archivos numerados": ["Numeros que no seguian logica humana.", "Un patron que solo el sistema entendia."],
        "biblioteca": ["El olor a papel viejo era abrumador.", "Estanterias que se perdian en la oscuridad."]
    }

    elemento = random.choice(elementos)
    detalle = random.choice(detalles.get(elemento, [""]))
    return detalle

def generar_dialogo(p1: str, p2: str, tono: str) -> str:
    """Genera un fragmento de dialogo"""

    # Seleccionar frases del banco
    if p1 == "Ana":
        frase_p1 = random.choice(BANCO_FRASES["Ana_pensamiento"])
    elif p1 == "Marcus":
        frase_p1 = random.choice(BANCO_FRASES["Marcus_advertencia"])
    else:
        frase_p1 = f"¿Estás seguro de esto, {p2}?"

    frase_p2 = "No lo sé. Pero no tenemos opción."

    # Construir dialogo
    dialogo = f'"{frase_p1}", dijo {p1}.\n\n'
    if "advertencia" in tono.lower():
        dialogo += f'{p2} la miró con seriedad. "{frase_p2}"\n'
    else:
        dialogo += f'"{frase_p2}", respondió {p2}.\n'

    return dialogo

def generar_pensamiento_interno(personaje: str) -> str:
    """Genera pensamiento interno del POV"""

    pensamientos = {
        "Ana": [
            "Quizás todo esto fuera un terrible error. Pero ya era tarde para retroceder.",
            "Seis meses atrás, esto habría parecido imposible. Ahora, era su realidad."
        ],
        "Marcus": [
            "Cuantos habían llegado hasta aquí? ¿Cuántos habían fracasado?",
            "El sistema no perdonaba. Lo sabía mejor que nadie."
        ]
    }

    return random.choice(pensamientos.get(personaje, ["Esto cambiaba todo."]))

def generar_capitulo_completo(libro_key: str, num_capitulo: int, outline_capitulo: Dict, meta_libro: Dict) -> Dict:
    """Genera un capitulo completo con formato profesional"""

    # Determinar estructura del capitulo
    num_escenas = random.randint(3, 5)
    palabras_objetivo = meta_libro.get("palabras_objetivo", 90000) // meta_libro.get("capitulos", 12)

    capitulo_generado = {
        "numero": num_capitulo,
        "titulo": outline_capitulo.get("titulo_capitulo", f"CAPITULO_{num_capitulo:02d}"),
        "palabras_estimadas": 0,
        "contenido": []
    }

    # Generar contenido
    contenido_texto = []

    # Header del capitulo
    contenido_texto.append(f"# CAPITULO {num_capitulo}\n")
    contenido_texto.append(f"## {outline_capitulo.get('titulo_capitulo', 'SIN TITULO')}\n\n")

    # Generar escenas
    for i in range(num_escenas):
        escena_info = {
            "titulo": f"Escena {i+1}",
            "descripcion": generar_descripcion_escena(libro_key, num_capitulo, i),
            "elementos": random.sample(["computadora", "archivo", "símbolo", "pantalla", "dispositivo"], 3),
            "tono": meta_libro.get("tono", "Misterio"),
            "personajes": outline_capitulo.get("personajes_presentes", ["Ana", "Marcus"]),
            "cliffhanger": i == num_escenas - 1 and outline_capitulo.get("cliffhanger", False)
        }

        escena_texto = generar_prosa_escena(escena_info, num_capitulo)
        contenido_texto.append(escena_texto)

    # Cierre del capitulo
    cierre = random.choice(PLANTILLAS_ESTILO["cierre_capitulo"])
    contenido_texto.append(f"\n{cierre}\n")

    # Calcular palabras (estimacion)
    texto_completo = "".join(contenido_texto)
    capitulo_generado["palabras_estimadas"] = len(texto_completo.split())
    capitulo_generado["contenido"] = texto_completo

    # Metadata para el escritor
    capitulo_generado["metadata"] = {
        "escenas_generadas": num_escenas,
        "personajes_presentes": outline_capitulo.get("personajes_presentes", []),
        "revelaciones_incluidas": outline_capitulo.get("revelaciones", []),
        "proxima_accion": "Continuar desarrollo"
    }

    return capitulo_generado

def generar_descripcion_escena(libro: str, cap: int, escena: int) -> str:
    """Genera descripcion base para una escena"""

    descripciones = {
        "libro_1": [
            "Ana se encontraba frente a la terminal.",
            "La habitación olía a ozono y tiempo perdido.",
            "Cada archivo brillaba con su propia luz."
        ],
        "libro_2": [
            "La búsqueda la había llevado hasta aquí.",
            "Marcus guardaba secretos que ella necesitaba.",
            "El Comité observaba desde las sombras."
        ],
        "default": [
            "El lugar guardaba secretos ancestrales.",
            "La verdad estaba oculta a plena vista.",
            "Algunas puertas solo se abren desde adentro."
        ]
    }

    opciones = descripciones.get(libro, descripciones["default"])
    return random.choice(opciones)

def escribir_libro_completo(libro_key: str, outline_libro: Dict) -> Dict:
    """Genera el contenido completo de un libro"""

    meta = outline_libro["meta"]
    capitulos_outline = outline_libro["estructura_capitulos"]

    print(f"  Escribiendo {meta['titulo']}...")

    libro_generado = {
        "titulo": meta["titulo"],
        "subtitulo": meta["subtitulo"],
        "meta": meta,
        "capitulos": []
    }

    total_palabras = 0

    for capitulo_info in capitulos_outline:
        capitulo_generado = generar_capitulo_completo(
            libro_key,
            capitulo_info["numero"],
            capitulo_info,
            meta
        )

        libro_generado["capitulos"].append(capitulo_generado)
        total_palabras += capitulo_generado["palabras_estimadas"]

    libro_generado["total_palabras_estimadas"] = total_palabras
    libro_generado["estado"] = "BOSQUEJO_GENERADO"

    return libro_generado

def guardar_libro(libro: Dict, libro_key: str):
    """Guarda el libro generado en formato estandar"""

    # Crear directorio para el libro
    libro_dir = LIBROS_DIR / f"Libro_{libro_key.split('_')[1]}_{libro['titulo'].upper()}"
    libro_dir.mkdir(parents=True, exist_ok=True)

    # Guardar cada capitulo
    capitulos_dir = libro_dir / "capitulos"
    capitulos_dir.mkdir(exist_ok=True)

    for cap in libro["capitulos"]:
        archivo_capitulo = capitulos_dir / f"Capitulo_{cap['numero']:02d}.md"
        with open(archivo_capitulo, 'w', encoding='utf-8') as f:
            f.write(cap["contenido"])

    # Guardar metadata/resumen
    resumen = {
        "titulo": libro["titulo"],
        "subtitulo": libro["subtitulo"],
        "palabras_totales": libro["total_palabras_estimadas"],
        "capitulos": len(libro["capitulos"]),
        "estado": libro["estado"],
        "fecha_generacion": datetime.now().isoformat(),
        "lista_capitulos": [f"Capitulo_{c['numero']:02d}" for c in libro["capitulos"]]
    }

    with open(libro_dir / "_RESUMEN.json", 'w', encoding='utf-8') as f:
        json.dump(resumen, f, indent=2, ensure_ascii=False)

    # Guardar manuscrito completo
    manuscrito = libro_dir / f"MANUSCRITO_{libro['titulo'].upper()}.md"
    with open(manuscrito, 'w', encoding='utf-8') as f:
        f.write(f"# {libro['titulo'].upper()}\n")
        f.write(f"## {libro['subtitulo']}\n\n")
        f.write(f"---\n\n")

        for cap in libro["capitulos"]:
            f.write(cap["contenido"])
            f.write("\n\n")

    return libro_dir

def ejecutar_escritura_automatizada():
    """Ejecuta el pipeline completo de escritura"""

    print("Cargando planificacion de la saga...")
    planificacion = cargar_planificacion()
    if not planificacion:
        print("[ERROR] No se encontro planificacion. Ejecuta Agente 13 primero.")
        return

    print("\nIniciando escritura automatizada de libros...")
    print(f"Meta: {planificacion['resumen_saga']['palabras_totales']:,} palabras")
    print(f"Libros: {planificacion['resumen_saga']['libros_totales']}")

    libros_generados = {}

    # Generar cada libro (empezando con Libro 1 como prueba)
    outlines = planificacion["outlines_detallados"]

    for libro_key in ["libro_1"]:  # Empezar con Libro 1 como MVP
        if libro_key not in outlines:
            continue

        print(f"\n[{libro_key.upper()}]")
        outline_libro = outlines[libro_key]

        # Generar libro
        libro = escribir_libro_completo(libro_key, outline_libro)

        # Guardar
        ruta_guardado = guardar_libro(libro, libro_key)
        libros_generados[libro_key] = {
            "titulo": libro["titulo"],
            "palabras": libro["total_palabras_estimadas"],
            "ruta": str(ruta_guardado)
        }

        print(f"  Guardado en: {ruta_guardado}")
        print(f"  Palabras: {libro['total_palabras_estimadas']:,}")

    # Reporte final
    reporte = {
        "fecha_generacion": datetime.now().isoformat(),
        "version": "1.0",
        "libros_generados": libros_generados,
        "notas": [
            "BOSQUEJO: Contenido generado automaticamente",
            "Requiere revision editorial",
            "Proximo paso: Iteracion con IA generativa avanzada"
        ],
        "proximos_pasos": [
            "Revisar Capitulo 1 Libro 1",
            "Ajustar estilo segun feedback",
            "Escalar a los otros 5 libros",
            "Integrar easter eggs y simbolismo"
        ]
    }

    # Guardar reporte
    with open(LIBROS_DIR / "_REPORTE_GENERACION.json", 'w', encoding='utf-8') as f:
        json.dump(reporte, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Escritura automatizada completada")
    print(f"Generados: {len(libros_generados)} libro(s)")
    print(f"Verificacion en: {LIBROS_DIR}")

    return reporte

if __name__ == "__main__":
    print("=" * 60)
    print("AGENTE 14: ESCRITOR AUTOMATIZADO")
    print("=" * 60)
    print("\nGenerando contenido de libros...\n")

    # Crear directorio base
    LIBROS_DIR.mkdir(parents=True, exist_ok=True)

    resultado = ejecutar_escritura_automatizada()

    print("\n" + "=" * 60)
    print("Agente 14 completado: Bosquejos generados")
    print("=" * 60)
