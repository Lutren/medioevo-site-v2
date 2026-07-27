# B6 — Publicar `obsai-core` 0.1.0 en PyPI

> Estado: BUILD LISTO. Falta solo token PyPI + 1 comando.

## Artefactos listos (verificado 2026-07-25)

| Archivo | Tamaño |
|---------|--------|
| `packages/obsai-core/dist/obsai_core-0.1.0-py3-none-any.whl` | 90.9 KB |
| `packages/obsai-core/dist/obsai_core-0.1.0.tar.gz` | 96.4 KB |

Re-built con `pyproject.toml` restaurado (setuptools, no flit).

## Paso 1 — Obtener token PyPI

1. Navega a https://pypi.org/manage/account/token/
2. Login o crea cuenta
3. **Add API token**:
   - Scope: `Entire account` (primera vez) o `Project: obsai-core`
   - Nombre: `BRAIN_OS-publish`
   - Expiration: sin expiración o 1 año
4. Copia el token comenzando con `pypi-`

## Paso 2 — Pegar en `.pypirc`

Edita `C:\Users\L-Tyr\.pypirc`:

```ini
[pypi]
username = __token__
password = pypi-AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Reemplaza `PEGA-TU-TOKEN-AQUI` con el token copiado.

## Paso 3 — Publicar

Desde PowerShell:

```powershell
Set-Location "C:\Users\L-Tyr\OneDrive\Escritorio\-= BRAIN_OS =-\packages\obsai-core"
python -m twine upload dist/* -r pypi
```

Salida esperada:

```
Uploading obsai_core-0.1.0-py3-none-any.whl
100%|██████████| 90.9k/90.9k [00:01<00:00, 90.9kB/s]
Uploading obsai_core-0.1.0.tar.gz
100%|██████████| 96.4k/96.4k [00:01<00:00, 96.4kB/s]

View at:
https://pypi.org/project/obsai-core/0.1.0/
```

## Paso 4 — Verificar

```powershell
python -m pip install --user obsai-core
python -c "from obsai_core import __init__; print(__init__.__version__)"
```

Salida esperada: `0.1.0`

## Notas

- Repo github asignado: `Lutren/obsai-core` (público, ya existe)
- Licencia: MIT (en pyproject.toml + LICENSE)
- Python: >=3.10
- Zero dependencias (`dependencies = []`)
- Scripts expuestos: `obsai-core` (CLI), `obsai-duat` (CLI duat)

## Rollback

Si la publicación tiene errores:
- PyPI **NO permite re-upload** del mismo version+name
- Bump versión en `pyproject.toml` (`0.1.0` → `0.1.1`)
- Re-build: `python -m build` (genera nuevo wheel+sdist)
- Re-upload

## Test PyPI primero (opcional, recomendado 1a vez)

1. Crea token en https://test.pypi.org/manage/account/token/
2. Pega en sección `[testpypi]` de `.pypirc`
3. `python -m twine upload --repository testpypi dist/*`
4. `python -m pip install -i https://test.pypi.org/simple/ obsai-core`
5. Verifica `python -c "import obsai_core; print(obsai_core.__version__)"`
6. Si OK, entonces Step 3 producción

## Ficha

| Campo | Valor |
|-------|-------|
| ID | B6 |
| Cadena | https://github.com/Lutren/obsai-core → https://pypi.org/project/obsai-core/ |
| Build | local 2026-07-25 (setuptools/wheel) |
| Dist | dist/*.whl + *.tar.gz (90.9 + 96.4 KB) |
| PyPI token | EN ESPERA Tyr |
| Siguiente versión | 0.1.1+ cuando haga falta |
