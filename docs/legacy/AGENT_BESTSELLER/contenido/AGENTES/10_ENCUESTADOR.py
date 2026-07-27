#!/usr/bin/env python3
"""
AGENTE 10: ENCUESTADOR INTERACTIVO
Aplica el cuestionario del Agente 3 a lectores reales y guarda respuestas.

Uso:
    python 10_ENCUESTADOR.py

Output:
    OUTPUTS/10_RESPUESTAS_LECTORES.json - Respuestas recopiladas
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List
import os

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")

def cargar_cuestionario():
    """Carga el cuestionario desde el output del Agente 3"""
    ruta_cuestionario = OUTPUT_DIR / "03_PREGUNTAS_CALIBRACION.json"
    if not ruta_cuestionario.exists():
        print("[ERROR] No se encontro 03_PREGUNTAS_CALIBRACION.json")
        print("Ejecuta primero: python 03_AGENTE_PREGUNTAS.py")
        return None

    with open(ruta_cuestionario, 'r', encoding='utf-8') as f:
        return json.load(f)

def aplicar_encuesta_perfil(perfil_id: str, perfil_data: dict, preguntas: list) -> dict:
    """Aplica encuesta para un perfil especifico"""
    print(f"\n{'='*60}")
    print(f"PERFIL: {perfil_data.get('nombre', perfil_id)}")
    print(f"{'='*60}")

    respuestas = {
        "perfil_id": perfil_id,
        "nombre_perfil": perfil_data.get('nombre', ''),
        "fecha": datetime.now().isoformat(),
        "respuestas": []
    }

    for i, pregunta in enumerate(preguntas, 1):
        print(f"\n{pregunta['id']}: {pregunta['pregunta']}")

        if 'opciones' in pregunta:
            for j, opcion in enumerate(pregunta['opciones'], 1):
                print(f"  {j}. {opcion}")

            while True:
                respuesta = input(f"\nTu respuesta (1-{len(pregunta['opciones'])}): ").strip()
                if respuesta.isdigit() and 1 <= int(respuesta) <= len(pregunta['opciones']):
                    seleccion = pregunta['opciones'][int(respuesta)-1]
                    break
                print("Opcion no valida. Intenta de nuevo.")
        else:
            seleccion = input("\nTu respuesta (texto libre): ").strip()

        respuestas['respuestas'].append({
            "pregunta_id": pregunta['id'],
            "tipo": pregunta['tipo'],
            "pregunta": pregunta['pregunta'],
            "objetivo": pregunta.get('objetivo', ''),
            "respuesta": seleccion
        })

    return respuestas

def guardar_resultados(todas_las_respuestas: List[Dict]):
    """Guarda todas las respuestas recopiladas"""
    output = {
        "fecha": datetime.now().isoformat(),
        "version": "1.0",
        "total_encuestas": len(todas_las_respuestas),
        "resultados": todas_las_respuestas
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ruta_salida = OUTPUT_DIR / "10_RESPUESTAS_LECTORES.json"

    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Respuestas guardadas en: {ruta_salida}")
    return ruta_salida

def modo_interactivo():
    """Modo interactivo para aplicar encuestas"""
    print("="*60)
    print("ENCUESTADOR MEDIOEVO - Sistema de Calibracion")
    print("="*60)

    cuestionario = cargar_cuestionario()
    if not cuestionario:
        return

    print("\nPerfiles disponibles:")
    for perfil_id, perfil_data in cuestionario.get('cuestionario', {}).items():
        print(f"  {perfil_id}: {perfil_data.get('nombre', 'Sin nombre')}")

    todas_las_respuestas = []

    while True:
        print("\n" + "="*60)
        print("Opciones:")
        print("  1. Aplicar encuesta por perfil")
        print("  2. Ver resultados guardados")
        print("  3. Salir")

        opcion = input("\nSelecciona (1-3): ").strip()

        if opcion == '1':
            print("\nSelecciona perfil:")
            perfiles = list(cuestionario.get('cuestionario', {}).items())
            for i, (perfil_id, perfil_data) in enumerate(perfiles, 1):
                print(f"  {i}. {perfil_id}: {perfil_data.get('nombre', 'Sin nombre')}")

            while True:
                sel = input(f"\nPerfil (1-{len(perfiles)}): ").strip()
                if sel.isdigit() and 1 <= int(sel) <= len(perfiles):
                    break
                print("Opcion no valida.")

            perfil_idx = int(sel) - 1
            perfil_id, perfil_data = perfiles[perfil_idx]
            preguntas = perfil_data.get('preguntas', [])

            if preguntas:
                respuesta = aplicar_encuesta_perfil(perfil_id, perfil_data, preguntas)
                todas_las_respuestas.append(respuesta)
                guardar_resultados(todas_las_respuestas)
            else:
                print("[ERROR] No hay preguntas para este perfil")

        elif opcion == '2':
            ruta_resultados = OUTPUT_DIR / "10_RESPUESTAS_LECTORES.json"
            if ruta_resultados.exists():
                with open(ruta_resultados, 'r', encoding='utf-8') as f:
                    datos = json.load(f)
                print(f"\nTotal encuestas: {datos.get('total_encuestas', 0)}")
                for i, res in enumerate(datos.get('resultados', []), 1):
                    print(f"  {i}. {res.get('nombre_perfil', '')} ({res.get('fecha', '')})")
            else:
                print("\nAun no hay resultados guardados.")

        elif opcion == '3':
            print("\nGuardando resultados antes de salir...")
            if todas_las_respuestas:
                guardar_resultados(todas_las_respuestas)
            print("¡Gracias!")
            break

        else:
            print("Opcion no valida. Intenta de nuevo.")

def modo_automatico():
    """Modo automatico - solo genera archivo vacio"""
    print("[MODO AUTOMATICO] Generando plantilla de respuestas...")

    output = {
        "fecha": datetime.now().isoformat(),
        "version": "1.0",
        "total_encuestas": 0,
        "resultados": [],
        "nota": "Ejecutar en modo interactivo para recopilar respuestas"
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ruta_salida = OUTPUT_DIR / "10_RESPUESTAS_LECTORES.json"

    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[OK] Plantilla generada en: {ruta_salida}")

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == '--auto':
        modo_automatico()
    else:
        modo_interactivo()

    print("\nAgente 10 completado: Encuestador Interactivo")
