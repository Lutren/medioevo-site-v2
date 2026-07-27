import type { APIRoute } from 'astro';
import { strictRateLimiter, validateInput, characterChatSchema } from '../../../lib/rate-limit';

interface CharacterChatRequest {
  character: string;
  message: string;
  context?: string;
}

export const POST: APIRoute = async ({ request }) => {
  // Rate limiting - stricter for chat
  const rateLimitResult = await strictRateLimiter(request);
  
  const headers = {
    'Content-Type': 'application/json',
    ...rateLimitResult.headers
  };
  
  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded',
        message: 'Demasiadas peticiones. Espera un momento antes de volver a intentarlo.'
      }),
      { status: 429, headers }
    );
  }
  
  try {
    const body = await request.json() as CharacterChatRequest;
    
    // Input validation
    const validation = validateInput(body, characterChatSchema);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          details: validation.errors
        }),
        { status: 400, headers }
      );
    }
    
    const { character, message, context } = validation.sanitized!;
    
    // Forward to Claudio API
    const claudioUrl = import.meta.env.CLAUDIO_URL || 'http://localhost:47047';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    try {
      const response = await fetch(`${claudioUrl}/api/character/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          message,
          context: context || '',
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Claudio API error: ${response.status}`);
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
    console.error('Character chat error:', error);
    
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    
    return new Response(
      JSON.stringify({ 
        error: isTimeout ? 'Request timeout' : 'Failed to connect to character service',
        fallback: 'El sistema de personajes no está disponible. Verifica que Claudio esté corriendo en el puerto 47047.',
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