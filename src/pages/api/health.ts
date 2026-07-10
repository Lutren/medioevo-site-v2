import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'medioevo.space',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );
};