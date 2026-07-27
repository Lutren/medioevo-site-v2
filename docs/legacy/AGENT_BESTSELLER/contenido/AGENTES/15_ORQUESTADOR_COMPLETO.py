#!/usr/bin/env python3
"""
ORQUESTADOR COMPLETO - SISTEMA AUTOMATIZADO MEDIOEVO
Version Final: Pipeline completo de recoleccion → escritura

Ejecuta los 14 agentes en secuencia automatizada:
- FASE 0-3: Pre-procesamiento, perfilado, analisis (Agentes 0-4, 6-9)
- FASE 4: Recoleccion automatizada de datos (Agente 11)
- FASE 5: Analisis de patrones (Agente 12)
- FASE 6: Planificacion de libros (Agente 13)
- FASE 7: Escritura automatizada (Agente 14)

Output: Saga 6+1 completa gestada y escrita automaticamente
"""

import subprocess
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")
LIBROS_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/LIBROS_GENERADOS")

# Pipeline completo de agentes
AGENTES_PIPELINE = {
    # FASE 0: Pre-procesamiento
    "0": {
        "nombre": "Agente 0: Filtro Social Conway-style",
        "script": "00_AGENTE_CONWAY.py",
        "fase": "Pre-procesamiento",
        "descripcion": "Analisis de patrones sociales emergentes"
    },
    # FASE 1: Perfilado y Analisis
    "1": {
        "nombre": "Agente 1: Perfilador Multidimensional",
        "script": "01_AGENTE_PERFILADOR.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Perfiles con dimensiones economicas, sociales, politicas"
    },
    "2": {
        "nombre": "Agente 2: Minero de Resenas",
        "script": "02_AGENTE_MINERO.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Extraccion de insights de resenas reales"
    },
    "3": {
        "nombre": "Agente 3: Disenador de Preguntas",
        "script": "03_AGENTE_PREGUNTAS.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Cuestionario con validacion psicometrica"
    },
    "4": {
        "nombre": "Agente 4: Analista de Mercado",
        "script": "04_AGENTE_ANALISTA.py",
        "fase": "Perfilado y Analisis",
        "descripcion": "Recomendaciones de angulos de observacion"
    },
    # FASE 2: Profundidad
    "6": {
        "nombre": "Agente 6: Lector Profundo",
        "script": "06_AGENTE_LECTURA_PROFUNDA.py",
        "fase": "Profundidad",
        "descripcion": "Detecta patrones tipo Rayuela/Crono Trigger"
    },
    # FASE 3: Estrategia
    "9": {
        "nombre": "Agente 9: Marketing Observacional",
        "script": "09_AGENTE_MARKETING_OBSERVACIONAL.py",
        "fase": "Estrategia",
        "descripcion": "Estrategias de marketing validadas"
    },
    # FASE 4: Recoleccion automatizada (NUEVO)
    "11": {
        "nombre": "Agente 11: Recolector Automatizado",
        "script": "11_AGENTE_RECOLECTOR.py",
        "fase": "Recoleccion de Datos",
        "descripcion": "Simula 150 encuestas de lectores (30 por perfil)"
    },
    # FASE 5: Analisis (NUEVO)
    "12": {
        "nombre": "Agente 12: Analizador de Patrones",
        "script": "12_AGENTE_ANALIZADOR.py",
        "fase": "Analisis Estadistico",
        "descripcion": "Procesa 150 respuestas y extrae patrones significativos"
    },
    # FASE 6: Planificacion (NUEVO)
    "13": {
        "nombre": "Agente 13: Planificador de Libros",
        "script": "13_AGENTE_PLANIFICADOR.py",
        "fase": "Planificacion Narrativa",
        "descripcion": "Crea outlines de los 6 libros + 1 companion"
    },
    # FASE 7: Escritura (NUEVO)
    "14": {
        "nombre": "Agente 14: Escritor Automatizado",
        "script": "14_AGENTE_ESCRITOR.py",
        "fase": "Generacion de Contenido",
        "descripcion": "Genera capitulos completos de la saga"
    }
}

def ejecutar_agente(nombre: str, script: str, descripcion: str = "") -> bool:
    """Ejecuta un agente y reporta resultado"""

    script_path = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES") / script

    print(f"\n{'='*70}")
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {nombre}")
    print(f"FASE: {descripcion}")
    print(f"{'='*70}")

    try:
        result = subprocess.run(
            ["python", str(script_path)],
            capture_output=True,
            text=True,
            encoding='cp1252',
            timeout=180
        )

        if result.returncode == 0:
            print(f"[OK] Completado")
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                for line in lines[-5:]:  # Ultimas 5 lineas
                    if line.strip():
                        print(f"  > {line}")
            return True
        else:
            print(f"[ERROR] Exit code: {result.returncode}")
            if result.stderr:
                print(f"  Error: {result.stderr[:300]}")
            return False

    except subprocess.TimeoutExpired:
        print(f"[TIMEOUT] Excedio 3 minutos")
        return False
    except Exception as e:
        print(f"[ERROR] {e}")
        return False

def verificar_disponibles() -> Dict[str, bool]:
    """Verifica que agentes tienen scripts disponibles"""
    base_path = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES")
    disponibles = {}

    for key, agente in AGENTES_PIPELINE.items():
        path = base_path / agente["script"]
        disponibles[key] = path.exists()

    return disponibles

def ejecutar_pipeline_completo():
    """Ejecuta TODA la pipeline automatizada completa"""

    print("\n" + "="*70)
    print(" SISTEMA MULTI-AGENTE MEDIOEVO - AUTOMATIZACION COMPLETA")
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    print("\nFASES:")
    print("  [0] Pre-procesamiento - Patrones sociales")
    print("  [1] Perfilado - 5 perfiles de lectores")
    print("  [2] Profundidad - Rayuela/Crono Trigger patterns")
    print("  [3] Estrategia - Marketing")
    print("  [4] Recoleccion - 150 encuestas simuladas")
    print("  [5] Analisis - Patrones estadisticos")
    print("  [6] Planificacion - Outline saga completa")
    print("  [7] Escritura - Generacion de contenido")
    print("="*70)

    # Verificar disponibilidad
    disponibles = verificar_disponibles()
    scripts_existentes = [k for k, v in disponibles.items() if v]
    scripts_faltantes = [k for k, v in disponibles.items() if not v]

    print(f"\nAgentes disponibles: {len(scripts_existentes)}/{len(AGENTES_PIPELINE)}")
    if scripts_faltantes:
        print(f"Agentes faltantes: {', '.join(scripts_faltantes)}")

    # Orden de ejecucion
    orden_ejecucion = ["0", "1", "2", "3", "4", "6", "9", "11", "12", "13", "14"]
    orden_ejecucion = [k for k in orden_ejecucion if k in scripts_existentes]

    resultados = {}
    comienzo_total = datetime.now()

    # Ejecutar en secuencia
    for key in orden_ejecucion:
        agente = AGENTES_PIPELINE[key]
        exito = ejecutar_agente(
            agente["nombre"],
            agente["script"],
            agente["descripcion"]
        )
        resultados[agente["nombre"]] = "COMPLETADO" if exito else "FALLO"

    tiempo_total = datetime.now() - comienzo_total

    # Resumen final
    print("\n" + "="*70)
    print(" RESUMEN FINAL DE AUTOMATIZACION")
    print("="*70)

    for agente, estado in resultados.items():
        simbolo = "[OK]" if estado == "COMPLETADO" else "[FAIL]"
        print(f" {simbolo} {agente}")

    print(f"\nTiempo total: {tiempo_total.total_seconds():.1f}s")

    # Outputs generados
    print(f"\nOUTPUTS GENERADOS:")

    # JSON outputs
    if OUTPUT_DIR.exists():
        json_files = sorted(OUTPUT_DIR.glob("*.json"))
        total_kb = sum(f.stat().st_size for f in json_files) / 1024
        print(f"\nArchivos JSON: {len(json_files)}")
        for f in json_files:
            size_kb = f.stat().st_size / 1024
            print(f"  {f.name} ({size_kb:.1f} KB)")
        print(f"  Total JSON: {total_kb:.1f} KB")

    # Libros generados
    if LIBROS_DIR.exists():
        libros_dirs = [d for d in LIBROS_DIR.iterdir() if d.is_dir()]
        print(f"\nLibros generados: {len(libros_dirs)}")
        for libro_dir in libros_dirs:
            print(f"  [LIBRO] {libro_dir.name}")
            capitulos = list((libro_dir / "capitulos").glob("*.md")) if (libro_dir / "capitulos").exists() else []
            print(f"     └─ {len(capitulos)} capitulos")

    # Reporte final
    print("\n" + "="*70)
    print(" SISTEMA AUTOMATIZADO COMPLETADO")
    print("="*70)

    print("\nPROXIMOS PASOS SUGERIDOS:")
    print("1. Revisar LIBROS_GENERADOS/ - Capitulos escritos")
    print("2. Iterar con feedback: ajustar y regenerar")
    print("3. Escalar a los 6 libros completos")
    print("4. Integrar easter eggs y simbolismo")
    print("5. Revision editorial")

    return resultados

def main():
    """Funcion principal"""
    ejecutar_pipeline_completo()

if __name__ == "__main__":
    main()
