import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Log to console (visible in Cloudflare Pages Functions logs when using hybrid mode)
    console.log('[Web Vitals]', JSON.stringify(body, null, 2));
    
    // Note: In static mode, this endpoint serves as a placeholder.
    // For full functionality (KV storage, rate limiting, aggregation), 
    // use hybrid mode with @astrojs/cloudflare adapter.
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Vitals received (static mode - log only). Use hybrid mode for KV storage.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Vitals API] Error:', error);
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};