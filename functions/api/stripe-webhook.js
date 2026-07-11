/**
 * stripe-webhook.js — Cloudflare Pages Function (Fase: webhook autónomo)
 * =====================================================================
 *
 * Cierra el ciclo pago → entrega de licencia SIN servidor propio y SIN que la
 * PC de Tyr esté encendida: corre en el edge de Cloudflare. Justo la autonomía
 * que necesitan los papás.
 *
 * Endpoint: POST https://medioevo.space/api/stripe-webhook
 *
 * Qué hace:
 *   1. Verifica la firma de Stripe (Stripe-Signature) con STRIPE_WEBHOOK_SECRET
 *      usando Web Crypto (HMAC-SHA256) — sin dependencias externas.
 *   2. En checkout.session.completed: genera una licencia verificable
 *      (HMAC, MISMO algoritmo que license_delivery.py) y la persiste en KV
 *      (binding LICENSES_KV), idempotente por order_id.
 *   3. Entrega por email best-effort vía Resend (si RESEND_API_KEY está).
 *   4. Responde 200.
 *
 * Variables de entorno (Cloudflare Pages → Settings → Environment variables):
 *   - STRIPE_WEBHOOK_SECRET   (whsec_...) — del webhook endpoint de Stripe
 *   - LICENSE_SIGNING_SECRET  — el MISMO que en el vault (licencias compatibles)
 *   - RESEND_API_KEY          (opcional) — para enviar el email
 *   - LICENSE_FROM_EMAIL      (opcional) — remitente, default no-reply@medioevo.space
 * Binding KV:
 *   - ORDERS                  — namespace (ya en producción) para guardar las licencias/pedidos
 */

const enc = new TextEncoder();

function hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(secret, msg) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return hex(sig);
}

// Comparación a tiempo constante.
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// Verifica la firma de Stripe: header "t=<ts>,v1=<sig>".
async function verifyStripeSignature(rawBody, sigHeader, secret, toleranceSec = 300) {
  if (!sigHeader || !secret) return false;
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => kv.split("=").map((s) => s.trim()))
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = await hmacSha256Hex(secret, `${t}.${rawBody}`);
  if (!timingSafeEqual(expected, v1)) return false;
  // Tolerancia de tiempo (anti-replay). Date.now() disponible en Workers.
  const age = Math.abs(Math.floor(Date.now() / 1000) - parseInt(t, 10));
  return age <= toleranceSec;
}

// Genera la licencia — DEBE coincidir con license_delivery.generate_license_key (Python).
async function generateLicenseKey(email, productKey, orderId, secret) {
  const msg = `${(email || "").toLowerCase()}|${productKey}|${orderId}`;
  const digest = (await hmacSha256Hex(secret, msg)).toUpperCase();
  const prefix = (productKey.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)) || "MEDIO";
  const blocks = [digest.slice(0, 4), digest.slice(4, 8), digest.slice(8, 12)].join("-");
  return `${prefix}-${blocks}`;
}

async function sendEmailResend(env, to, productKey, licenseKey, orderId) {
  if (!env.RESEND_API_KEY || !to) return { ok: false, note: "sin RESEND_API_KEY o email" };
  const from = env.LICENSE_FROM_EMAIL || "no-reply@medioevo.space";
  const body = {
    from, to: [to],
    subject: `Tu licencia MEDIOEVO — ${productKey}`,
    text:
      `¡Gracias por tu compra de MEDIOEVO!\n\n` +
      `Producto: ${productKey}\nTu licencia: ${licenseKey}\n\n` +
      `Pega esta clave en la app para activar tus usos.\nPedido: ${orderId}\n`,
  };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { ok: false, note: String(e) };
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  const ok = await verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!ok) {
    return new Response(JSON.stringify({ error: "firma inválida" }), {
      status: 400, headers: { "content-type": "application/json" },
    });
  }

  let event;
  try { event = JSON.parse(rawBody); }
  catch { return new Response(JSON.stringify({ error: "json inválido" }), { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const s = event.data?.object || {};
    const email = s.customer_details?.email || s.customer_email || "";
    const productKey = s.metadata?.product_key || "unknown";
    const orderId = s.id;

    // Idempotencia: si ya existe la licencia para este pedido, no regenerar.
    let licenseKey, idempotent = false;
    if (env.ORDERS) {
      const prev = await env.ORDERS.get(`license:${orderId}`);
      if (prev) { licenseKey = JSON.parse(prev).license_key; idempotent = true; }
    }
    if (!licenseKey) {
      licenseKey = await generateLicenseKey(email, productKey, orderId, env.LICENSE_SIGNING_SECRET);
    }

    let delivered = false, deliveryNote = "registrada";
    if (!idempotent) {
      const mail = await sendEmailResend(env, email, productKey, licenseKey, orderId);
      delivered = mail.ok; deliveryNote = mail.ok ? "email enviado" : (mail.note || "sin email");
      if (env.ORDERS) {
        await env.ORDERS.put(`license:${orderId}`, JSON.stringify({
          order_id: orderId, license_key: licenseKey, email, product_key: productKey,
          amount_total: s.amount_total, currency: s.currency,
          created_at: new Date().toISOString(), delivered, delivery_note: deliveryNote,
        }));
      }
    }

    return new Response(JSON.stringify({
      received: true, action: "delivered_digital_product",
      product_key: productKey, license_key: licenseKey, delivered, idempotent,
    }), { status: 200, headers: { "content-type": "application/json" } });
  }

  // Otros eventos: ack 200.
  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { "content-type": "application/json" },
  });
}

// Exports para pruebas (Cloudflare Pages ignora exports que no sean onRequest*).
export { generateLicenseKey, verifyStripeSignature, hmacSha256Hex };
