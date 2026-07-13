/**
 * /api/verify — Cloudflare Pages Function
 *
 * POST {"texto": "intuición del visitante"}
 * Devuelve claims extraídos vía Wikipedia + NVIDIA API (fallback simple).
 *
 * Variables de entorno (Cloudflare Pages secret):
 *   NVIDIA_API_KEY  (opcional — sin ella usa extracción simple)
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const texto = (body.texto || '').trim();
  if (!texto) {
    return new Response(JSON.stringify({ error: 'texto vacío' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const resultado = await verificar(texto, env);
    return new Response(JSON.stringify(resultado), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ── Wikipedia ───────────────────────────────────────────────────────────────

async function buscarWikipedia(tema, lang = 'es') {
  const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(tema)}&srlimit=1&format=json`;
  const searchResp = await fetch(searchUrl, { headers: { 'User-Agent': 'medioevo.space/1.0' } });
  const searchData = await searchResp.json();
  const pages = searchData?.query?.search || [];
  if (!pages.length) return { text: '', url: '' };

  const title = pages[0].title;
  const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summaryResp = await fetch(summaryUrl, { headers: { 'User-Agent': 'medioevo.space/1.0' } });
  const summaryData = await summaryResp.json();
  const text = summaryData?.extract || '';
  const url = summaryData?.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`;
  return { text, url, title };
}

// ── NVIDIA API (chat completions, gratis) ──────────────────────────────────

async function extraerConNVIDIA(texto, apiKey) {
  const prompt = `Eres un asistente que extrae AFIRMACIONES ATÓMICAS y verificables de un texto. Cada afirmación debe ser una sola oración autocontenida. Devuélvelas como lista JSON, una por elemento, sin numbering, sin explicación adicional.

Texto:
${texto.slice(0, 3000)}`;

  const resp = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'nvidia/llama-3.3-nemotron-super-49b-v1',
      messages: [
        { role: 'system', content: 'Eres un extractor de afirmaciones. Siempre respondes en español con una lista JSON.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.1,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`NVIDIA API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}
  }
  // fallback: split by lines
  return content.split('\n').map(l => l.replace(/^[-*\d.)\s]+/, '').trim()).filter(l => l.length > 15);
}

// ── Extracción simple (fallback sin LLM) ─────────────────────────────────────

function extraerSimple(texto) {
  const oraciones = texto.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 30);
  const claims = [];
  for (const o of oraciones.slice(0, 8)) {
    const limpia = o.replace(/^[-*\d.)\s]+/, '').trim();
    if (limpia.length > 30 && !limpia.startsWith('¿') && !limpia.startsWith('http')) {
      claims.push(limpia);
    }
  }
  return claims;
}

// ── Clasificador epistémico simple ───────────────────────────────────────────

function clasificar(claim) {
  const keywordsCerteza = ['es', 'son', 'se llama', 'se define', 'consiste en', 'está compuesto'];
  const keywordsBloqueo = ['no es', 'no existe', 'es falso', 'contradice', 'refuta', 'imposible'];

  const lower = claim.toLowerCase();
  if (keywordsBloqueo.some(k => lower.includes(k))) return { estado: 'BLOQUEADO', R: 0.85 };
  if (keywordsCerteza.some(k => lower.includes(k))) return { estado: 'CERTEZA', R: 0.10 };
  return { estado: 'INFERENCIA', R: 0.35 };
}

// ── Pipeline principal ───────────────────────────────────────────────────────

async function verificar(texto, env) {
  const lang = /[¿¡áéíóúñ]/.test(texto) ? 'es' : 'en';

  // 1. Wikipedia
  const wiki = await buscarWikipedia(texto.slice(0, 80), lang);
  const contenido = wiki.text || texto;

  // 2. Extraer claims
  let claimsRaw = [];
  let provider = 'simple';

  if (env.NVIDIA_API_KEY) {
    try {
      claimsRaw = await extraerConNVIDIA(contenido, env.NVIDIA_API_KEY);
      provider = 'nvidia';
    } catch {
      claimsRaw = extraerSimple(contenido);
      provider = 'simple';
    }
  } else {
    claimsRaw = extraerSimple(contenido);
  }

  const claims = claimsRaw.slice(0, 8).map(c => {
    const { estado, R } = clasificar(c);
    return { claim: c.slice(0, 200), estado, R };
  });

  // 3. Veredicto agregado
  const estados = claims.map(c => c.estado);
  const prioridad = ['BLOQUEADO', 'INCÓGNITA', 'INFERENCIA', 'CERTEZA'];
  const mejor = prioridad.find(p => estados.includes(p)) || 'NO_CLASIFICADO';

  const notas = [];
  if (!wiki.text && !texto) notas.push('No se encontró contenido en Wikipedia para esta consulta.');
  if (claims.length === 0) notas.push('No se pudieron extraer afirmaciones verificables.');

  return {
    topic: wiki.title || texto.slice(0, 80),
    wikipedia_url: wiki.url || null,
    wikipedia_extract: wiki.text ? wiki.text.slice(0, 500) : null,
    provider,
    claims,
    veredicto: {
      estado: mejor,
      confianza: mejor === 'CERTEZA' ? 'alta' : mejor === 'BLOQUEADO' ? 'alta' : mejor === 'INFERENCIA' ? 'media' : 'baja',
      notas,
    },
  };
}
