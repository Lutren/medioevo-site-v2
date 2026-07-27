# Especificación: Integración Whisper + CLI `wabi voice`

**Estado**: SPEC - Listo para implementar
**Prioridad**: ALTA (Fase 1 del roadmap post-análisis OSS)
**Autor**: Wabi-Sabi / Tyr
**Fecha**: 2026-07-15

---

## 1. Objetivo

Integrar `faster-whisper` (CTranslate2 backend) como motor STT local-first,
reemplazando cualquier dependencia cloud para transcripción de audio.

- **CLI**: `wabi voice {listen,transcribe,translate,stream,status,models}`
- **SDK**: `wabi_sabi.voice.stt.WhisperSTT` para uso interno
- **Runtime**: Modelos descargados a `02_CLAUDIO/.wabi_runtime/voice/models/`

**Requisitos no funcionales**:
- Local-first: cero llamadas cloud, modelo corre en CPU/GPU local
- Fallback graceful: si `faster-whisper` no instalado → `openai-whisper` → error claro
- Sin GPU opcional: detecta CUDA automáticamente, cae a CPU si no disponible
- Modelos: tiny/base/small/medium/large-v3 (por defecto `base` para velocidad)

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      wabi voice CLI                          │
│  (wabi_sabi/cli/commands_voice.py → voice/stt.py)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌───────────────────────┐     ┌───────────────────────┐
│ WhisperSTT            │     │ AudioCapture         │
│ - faster-whisper      │     │ - sounddevice/pyaudio │
│ - openai-whisper      │     │ - wav temporal        │
│ - CPU/GPU autodetect  │     └───────────────────────┘
└───────────────────────┘
```

---

## 3. CLI `wabi voice` — Comandos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `wabi voice listen` | Captura audio del micrófono y transcribe | `wabi voice listen --lang es` |
| `wabi voice transcribe <file>` | Transcribe archivo de audio | `wabi voice transcribe audio.wav` |
| `wabi voice translate <file>` | Transcribe + traduce al inglés | `wabi voice translate audio.mp3` |
| `wabi voice stream` | Transcripción en streaming (tiempo real) | `wabi voice stream --lang es` |
| `wabi voice status` | Estado del motor STT + GPU | `wabi voice status --json` |
| `wabi voice models` | Lista modelos disponibles | `wabi voice models --json` |

**Salida**: Texto plano por defecto; `--json` para scripting.

---

## 4. `WhisperSTT` SDK

```python
class WhisperSTT:
    def __init__(self, model_size: str = "base", device: str = "auto", 
                 compute_type: str = "auto", model_dir: Path = None):
        ...

    # Lifecycle
    def load_model(self) -> bool:                    # Carga modelo perezosamente
    def is_available(self) -> bool:                 # True si faster-whisper o whisper instalado
    def status(self) -> dict:                        # Engine, device, model, GPU info

    # Transcription
    def transcribe(self, audio_path: Path, language: str = None, 
                   translate: bool = False) -> TranscribeResult:
    def transcribe_chunks(self, chunks: list[Path]) -> list[TranscribeResult]:
    def stream_transcribe(self, chunk_seconds: float = 5.0) -> Iterator[str]:

    # Audio Capture
    def capture_and_transcribe(self, seconds: float = 10.0, 
                               language: str = None) -> str:

    # Models
    def list_available_models() -> list[str]:
    def download_model(self, model_size: str) -> bool:
```

`TranscribeResult` (dataclass): `text, language, segments[], duration, model, device`

---

## 5. Fallback Chain

1. **faster-whisper** (preferido): CTranslate2, 4x más rápido, menor RAM
2. **openai-whisper**: si faster-whisper no instalado
3. **Error claro**: si ninguno instalado, `wabi voice status` reporta `available: false` y sugiere `pip install faster-whisper`

---

## 6. Modelos

| Modelo | Tamaño | RAM | Velocidad | Calidad |
|--------|--------|-----|-----------|---------|
| tiny | 75 MB | ~1 GB | ⚡⚡⚡⚡⚡ | Básica |
| base | 145 MB | ~1.5 GB | ⚡⚡⚡⚡ | Buena |
| small | 485 MB | ~3 GB | ⚡⚡⚡ | Muy buena |
| medium | 1.5 GB | ~6 GB | ⚡⚡ | Excelente |
| large-v3 | 3 GB | ~10 GB | ⚡ | Máxima |

Por defecto: `base` (mejor balance velocidad/calidad).

---

## 7. Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `wabi_sabi/voice/__init__.py` | Package init |
| `wabi_sabi/voice/stt.py` | WhisperSTT wrapper (~350 LOC) |
| `wabi_sabi/cli/commands_voice.py` | CLI `wabi voice *` (~250 LOC) |
| `tests/test_voice_stt.py` | Tests unitarios (mock engine) |

### Modificados
| Archivo | Cambio |
|---------|--------|
| `wabi_sabi/cli/commands.py` | Import + registro comandos `voice` |

---

## 8. Tests (mínimos)

| Test | Qué valida |
|------|------------|
| `test_whisper_stt_unavailable` | Sin libs → `is_available()` False |
| `test_transcribe_result_dataclass` | TranscribeResult serializable |
| `test_list_models` | Lista modelos correcta |
| `test_status_no_engine` | Status con motor no disponible |
| `test_cli_voice_status_json` | `wabi voice status --json` válido |
| `test_cli_voice_transcribe_missing_file` | Error si archivo no existe |

---

## 9. Gates

| Riesgo | Mitigación |
|--------|------------|
| faster-whisper no instalado | Fallback a openai-whisper, luego error claro |
| Sin GPU | Detección automática, CPU fallback |
| Modelo no descargado | Descarga automática en primer uso |
| Audio sin sounddevice | Error claro, sugiere `pip install sounddevice` |

---

## 10. Criterios de Aceptación

1. `wabi voice status --json` → `{"available": true/false, "engine": "...", "device": "..."}`
2. `wabi voice transcribe audio.wav` → texto transcrito en stdout
3. `wabi voice translate audio.mp3` → texto traducido al inglés
4. `wabi voice listen --seconds 5` → captura 5s del micro → transcribe
5. `wabi voice models --json` → lista modelos disponibles
6. `pip install faster-whisper` → `wabi voice status` detecta automáticamente
7. Tests pasan: `python -m pytest tests/test_voice_stt.py -v`