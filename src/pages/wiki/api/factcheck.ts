import type { APIRoute } from 'astro';
import { apiRateLimiter, validateInput, factcheckSchema } from '../../../lib/rate-limit';

interface FactcheckRequest {
  claim: string;
  context?: string;
}

export const POST: APIRoute = async ({ request }) => {
  // Rate limiting
  const rateLimitResult = await apiRateLimiter(request);
  
  const headers = {
    'Content-Type': 'application/json',
    ...rateLimitResult.headers
  };
  
  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.'
      }),
      { status: 429, headers }
    );
  }
  
  try {
    const body = await request.json() as FactcheckRequest;
    
    // Input validation
    const validation = validateInput(body, factcheckSchema);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          details: validation.errors
        }),
        { status: 400, headers }
      );
    }
    
    const { claim, context } = validation.sanitized!;
    
    // Forward to Claudio API (MOI Research endpoint)
    const claudioUrl = import.meta.env.CLAUDIO_URL || 'http://localhost:47047';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const response = await fetch(`${claudioUrl}/api/moi/factcheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim,
          context: context || '',
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Claudio MOI error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Factcheck error:', error);
    
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    
    return new Response(
      JSON.stringify({ 
        error: isTimeout ? 'Request timeout' : 'Failed to connect to fact-check service',
        fallback: 'El servicio de fact-checking no está disponible. Verifica que Claudio (MOI Research) esté corriendo.',
        mock: true 
      }),
      { status: 503, headers }
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Method not allowed', allowed: ['POST', 'OPTIONS'] }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Allow': 'POST, OPTIONS' },
  });
};

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://medioevo.space',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};