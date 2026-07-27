# Stripe LIVE Keys - Guia para cambio manual (B4)

> Tarea BLOCKED B4: keys actuales son TEST (`pk_test_*`). LIVE requiere
> cambio manual en dashboard Stripe (NO se puede hacer via API segura;
> politica de Stripe exige verificacion humana + 2FA en dashboard).

## Estado

- **Clase**: REVIEW_REQUIRED (toca pagos, credenciales LIVE, legal/financiero).
- **Origen**: 2026-07-07 cuando se detectaron keys TEST en configuracion.
- **Autonomia**: NO ejecutable por agente - Stripe exige cambio presencial
  por cuenta owner (Tyr).

## Prerequisitos

1. Acceso al dashboard Stripe: https://dashboard.stripe.com/
2. 2FA activado en cuenta Stripe (SMS o app authenticator).
3. Cuenta Stripe verificada (KYC completo, bank account conectado).
4. SIN publicacion simultanea - hacerlo en ventana de mantenimiento.

## Pasos manuales (ejecuta Tyr)

### Paso 1: Generar LIVE keys

1. Iniciar sesion en https://dashboard.stripe.com/
2. Navegar a **Developers** > **API keys**
3. En seccion "Standard keys":
   - Click **"Create secret key"** (LIVE mode, NO test)
   - Etiqueta: `wabi-sabi-prod-2026-07` (o fecha actual)
   - Copiar `sk_live_...` a portapapeles
4. En seccion "Publishable key":
   - Click **"Create publishable key"** (LIVE mode)
   - Copiar `pk_live_...` a portapapeles

### Paso 2: Verificar modo LIVE (CRITICO)

Antes de cualquier cambio en BRAIN_OS:

1. En dashboard Stripe, esquina superior derecha: toggle debe decir
   **"LIVE"** (NO "Test mode"). Cambiar a LIVE.
2. Verificar que las keys `sk_live_*` y `pk_live_*` aparecen como Active
   en la lista.

### Paso 3: Almacenar keys en vault (NO en archivos)

 Desde terminal (NO en dashboard):

```powershell
cd "C:\Users\L-Tyr\OneDrive\Escritorio\-= BRAIN_OS =-\02_CLAUDIO"
python -c "from wabi_sabi.secret_vault import SecretVault; sv = SecretVault(); sv.put('stripe_sk_live', 'sk_live_...PEGA_AQUI...'); print('SK guardado')"
python -c "from wabi_sabi.secret_vault import SecretVault; sv = SecretVault(); sv.put('stripe_pk_live', 'pk_live_...PEGA_AQUI...'); print('PK guardado')"
```

> NUNCA pegar keys en archivos de texto, .env, o codigo. Siempre vault.

### Paso 4: Limpiar keys TEST viejas (opcional pero recomendado)

En vault:

```powershell
python -c "from wabi_sabi.secret_vault import SecretVault; sv = SecretVault(); sv.delete('stripe_sk_test'); sv.delete('stripe_pk_test'); print('TEST keys purgadas')"
```

### Paso 5: Verificar integracion

```powershell
cd "C:\Users\L-Tyr\OneDrive\Escritorio\-= BRAIN_OS =-\02_CLAUDIO"
python -c "import os; os.environ['STRIPE_SECRET_KEY'] = __import__('wabi_sabi.secret_vault', fromlist=['SecretVault']).SecretVault().get('stripe_sk_live'); import stripe; stripe.api_key = os.environ['STRIPE_SECRET_KEY']; print('LIVE balance:', stripe.Balance.retrieve()['available'][0]['amount'])"
```

Deberia imprimir monto disponible en centavos. Si falla con
"Invalid API Key" -> checker keys, hubo error al pegar.

### Paso 6: Screenshot evidencia (no de la key, solo del dashboard)

1. En dashboard Stripe, modo LIVE, pagina API keys:
   - Tomar screenshot (NO incluir el valor completo de sk_live; solo
     los primeros 8 caracteres + ***).
2. Guardar como `00_START_HERE/LIVE_STATE/evidence/stripe_live_active_<YYYYMMDD>.png`
3. Actualizar `B4 CERRADO 2026-07-XX` en `BLOCKED_TASKS.md`.

## Gates

- **SecretGate**: las keys `sk_live_*` NUNCA se escriben en texto plano.
- **CredentialGate**: solo Tyr (cuenta owner) puede generarlas.
- **PublicationGate**: cambio de keys no publica nada; solo habilita
  transacciones LIVE una vez D036 PublicationValve se abra a Stage 3.

## Riesgos

- **sk_live comprometida**: si alguien accede a la key, puede procesar
  cobros reales. Mitigacion: vault (no archivos), rotacion periodica,
  monitoreo de logs Stripe.
- **Uso accidental**: si codigo apunta a test key en lugar de LIVE,
  transacciones reales fallan silenciosamente. Mitigacion: checker
  explicito `if not key.startswith('sk_live_'): raise RuntimeError`.
- **Chargebacks**: LIVE significa que clientes reales pueden disputar.
  Asegurate que terminos de servicio y refund policy estan publicados
  en medioevo.space antes de Stage 3.

## Post-cierre

Despues del paso 6, abrir issue en `00_START_HERE/LIVE_STATE/BLOCKED_TASKS.md`
para actualizar publication_valve.py con flag `STRIPE_LIVE_READY=true` y
verificar que D036 Stage 3 puede proceder.
