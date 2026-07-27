#!/usr/bin/env python3
"""
ORQUESTADOR PRINCIPAL - SISTEMA MULTI-AGENTE MEDIOEVO
Version Avanzada: Simulacion Multi-Agente con Observacionismo Puro

Ejecuta los 10 agentes en secuencia:
FASE 0: Pre-procesamiento
  0. Filtro Social Conway-style (analisis de patrones emergentes)

FASE 1: Perfilado y Analisis (Agentes 1-4)
  1. Perfilador Multidimensional (economico, social, politico, edad, biologico, mental)
  2. Minero de Resenias (con encuestas validadas de estudios reales)
  3. Disenador de Preguntas (psicometria validada)
  4. Analista de Mercado (recomendaciones de angulos)

FASE 2: Profundad (Agentes 6-7)
  6. Lector Profundo (simula lectura 35 libros, detecta patrones Rayuela/Crono Trigger)
  7. Detector de Insights (identifica descubrimientos tipo 'eureka')

FASE 3: Estrategia (Agentes 8-9)
  8. Estrategia Social (analisis Conway-style aplicado)
  9. Marketing Observacional Contemporaneo

Output: Sistema completo de calibracion + marketing + patrones ocultos
"""

import subprocess
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")

# Base de agentes disponibles
AGENTES_DISPONIBLES = {
    "0": {
        "nombre": "Agente 0: Filtro Social Conway",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/00_AGENTE_CONWAY.py",
        "fase": "Pre-procesamiento",
        "descripcion": "Analisis de patrones sociales emergentes style Conway"
    },
    "1": {
        "nombre": "Agente 1: Perfilador Multidimensional",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/01_AGENTE_PERFILADOR.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Perfiles con dimensiones economica, social, politica, edad, biologica, mental"
    },
    "2": {
        "nombre": "Agente 2: Minero de Resenias",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/02_AGENTE_MINERO.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Extraccion de insights de resenias reales"
    },
    "3": {
        "nombre": "Agente 3: Disenador de Preguntas",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/03_AGENTE_PREGUNTAS.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Cuestionario con validacion psiquiatrica"
    },
    "4": {
        "nombre": "Agente 4: Analista de Mercado",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/04_AGENTE_ANALISTA.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Recomendaciones de angulos de observacion"
    },
    "6": {
        "nombre": "Agente 6: Lector Profundo",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/06_AGENTE_LECTURA_PROFUNDA.py",
        "fase": "Profundidad",
        "descripcion": "Detecta patrones tipo Rayuela/Crono Trigger en 35 libros"
    },
    "9": {
        "nombre": "Agente 9: Marketing Observacional",
        "script": r"E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/09_AGENTE_MARKETING_OBSERVACIONAL.py",
        "fase": "Estrategia",
        "descripcion": "Estrategias de marketing basadas en observacionismo puro"
    }
}

def ejecutar_agente(nombre: str, script: str, descripcion: str = "") -> bool:
    """Ejecuta un agente y reporta el resultado."""
    print(f"\n{'='*70}")
    print(f"FASE: {nombre}")
    if descripcion:
        print(f"DESC: {descripcion}")
    print(f"{'='*70}")

    try:
        result = subprocess.run(
            ["python", script],
            capture_output=True,
            text=True,
            encoding='cp1252',  # Windows Latin-1 para compatibilidad con rutas
            timeout=120  # 2 minutos timeout por agente
        )

        if result.returncode == 0:
            print(f"[OK] {nombre} completado con exito")
            if result.stdout:
                output_lines = result.stdout.strip().split('\n')
                for line in output_lines[:5]:  # Maximo 5 lineas de output
                    print(f"    > {line}")
            return True
        else:
            print(f"[ERROR] {nombre} fallo")
            if result.stderr:
                print(f"    Error: {result.stderr[:500]}")  # Max 500 chars error
            return False

    except subprocess.TimeoutExpired:
        print(f"[TIMEOUT] {nombre} excedio 2 minutos")
        return False
    except Exception as e:
        print(f"[ERROR] Error ejecutando {nombre}: {e}")
        return False

def verificar_disponibles() -> Dict[str, bool]:
    """Verifica que agentes tienen scripts disponibles"""
    disponibles = {}
    for key, agente in AGENTES_DISPONIBLES.items():
        path = Path(agente["script"])
        disponibles[key] = path.exists()
    return disponibles

def ejecutar_secuencia_completa():
    """Ejecuta TODA la pipeline de agentes en secuencia"""
    print("\n" + "="*70)
    print(" SISTEMA MULTI-AGENTE MEDIOEVO - SIMULACION COMPLETA")
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(" Observacionismo puro + Patrones Conway-style + Rayuela/Crono Trigger")
    print("="*70)

    # Verificar scripts disponibles
    disponibles = verificar_disponibles()
    scripts_existentes = [k for k, v in disponibles.items() if v]
    scripts_faltantes = [k for k, v in disponibles.items() if not v]

    print(f"\nScripts disponibles: {len(scripts_existentes)}/{len(disponibles)}")
    if scripts_faltantes:
        print(f"Scripts faltantes: {', '.join(scripts_faltantes)}")

    # Ordenar por fase preferida
    orden_ejecucion = ["0", "1", "2", "3", "4", "6", "9"]
    orden_ejecucion = [k for k in orden_ejecucion if k in scripts_existentes]

    resultados = {}
    outputs_generados = []

    # Ejecutar en secuencia
    for key in orden_ejecucion:
        agente = AGENTES_DISPONIBLES[key]
        exito = ejecutar_agente(
            agente["nombre"],
            agente["script"],
            agente["descripcion"]
        )
        resultados[agente["nombre"]] = "COMPLETADO" if exito else "FALLO"

        if exito:
            outputs_generados.append(agente["script"])

    # Resumen final
    print("\n" + "="*70)
    print(" RESUMEN DE EJECUCION")
    print("="*70)

    for agente, estado in resultados.items():
        simbolo = "[OK]" if estado == "COMPLETADO" else "[FAIL]"
        print(f" {simbolo} {agente}: {estado}")

    # Outputs generados
    print(f"\nOUTPUTS GENERADOS:")
    if OUTPUT_DIR.exists():
        for f in sorted(OUTPUT_DIR.glob("*.json")):
            size_kb = f.stat().st_size / 1024
            print(f"   {f.name} ({size_kb:.1f} KB)")
    else:
        print("   No se generaron outputs")

    print("\n" + "="*70)
    print(" SISTEMA MULTI-AGENTE COMPLETADO")
    print("="*70)

    print("\nPROXIMOS PASOS:")
    print("1. Revisar 00_MATRIZ_CONWAY.json - Patrones sociales emergentes")
    print("2. Revisar 01_PERFILES_LECTORES.json - Perfiles multidimensionales")
    print("3. Revisar 04_MATRIZ_CALIBRACION.json - Angulos de observacion")
    print("4. Revisar 06_PATRONES_OCULTOS.json - Patrones Rayuela/Crono Trigger")
    print("5. Revisar 09_MARKETING_OBSERVACIONAL.json - Estrategias de marketing")
    print("\n6. Aplicar cuestionario a lectores reales")
    print("7. Ajustar matriz segun respuestas reales")
    print("8. Implementar angulos en marketing")
    print("9. Lanzar saga con estrategia observacional")

    print(f"\nOutput dir: {OUTPUT_DIR}")

    return resultados

def main():
    """Funcion principal"""
    ejecutar_secuencia_completa()

if __name__ == "__main__":
    main()
