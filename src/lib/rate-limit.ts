// Rate limiting utility for API routes
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIdentifier(request: Request): string {
  // Try to get real IP from Cloudflare headers
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  
  return cfConnectingIp || xForwardedFor?.split(',')[0]?.trim() || xRealIp || 'unknown';
}

export function createRateLimiter(config: RateLimitConfig) {
  const { maxRequests, windowMs, keyPrefix = 'api' } = config;
  
  return async function rateLimit(request: Request): Promise<{ success: boolean; headers: Record<string, string> }> {
    const clientId = getClientIdentifier(request);
    const key = `${keyPrefix}:${clientId}`;
    const now = Date.now();
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k);
        }
      }
    }
    
    const entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        success: true,
        headers: {
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': String(maxRequests - 1),
          'X-RateLimit-Reset': String(Math.ceil((now + windowMs) / 1000))
        }
      };
    }
    
    if (entry.count >= maxRequests) {
      // Rate limited
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        success: false,
        headers: {
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
          'Retry-After': String(retryAfter)
        }
      };
    }
    
    // Increment counter
    entry.count++;
    rateLimitStore.set(key, entry);
    
    return {
      success: true,
      headers: {
        'X-RateLimit-Limit': String(maxRequests),
        'X-RateLimit-Remaining': String(maxRequests - entry.count),
        'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000))
      }
    };
  };
}

// Pre-configured limiters
export const apiRateLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60000, // 1 minute
  keyPrefix: 'api'
});

export const strictRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  keyPrefix: 'strict'
});

export const authRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 300000, // 5 minutes
  keyPrefix: 'auth'
});

// Input validation helpers
export function validateInput<T extends Record<string, unknown>>(
  data: unknown,
  schema: Record<keyof T, { type: string; required?: boolean; maxLength?: number; pattern?: RegExp }>
): { valid: boolean; errors: string[]; sanitized?: T } {
  const errors: string[] = [];
  const sanitized: Partial<T> = {};
  
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Invalid input: expected object'] };
  }
  
  const input = data as Record<string, unknown>;
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = input[field];
    
    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }
    
    // Skip validation if not required and not provided
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type validation
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`Field ${field} must be a string`);
      continue;
    }
    
    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`Field ${field} must be a number`);
      continue;
    }
    
    if (rules.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Field ${field} must be a boolean`);
      continue;
    }
    
    // String validations
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Field ${field} exceeds maximum length of ${rules.maxLength}`);
        continue;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`Field ${field} has invalid format`);
        continue;
      }
      
      // Sanitize: trim and basic XSS prevention
      sanitized[field as keyof T] = value.trim().slice(0, rules.maxLength || 10000) as T[keyof T];
    } else {
      sanitized[field as keyof T] = value as T[keyof T];
    }
  }
  
  // Check for unexpected fields
  const allowedFields = new Set(Object.keys(schema));
  for (const field of Object.keys(input)) {
    if (!allowedFields.has(field)) {
      errors.push(`Unexpected field: ${field}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized as T : undefined
  };
}

// Common validation schemas
export const factcheckSchema = {
  claim: { type: 'string' as const, required: true, maxLength: 2000 },
  context: { type: 'string' as const, required: false, maxLength: 5000 }
};

export const characterChatSchema = {
  character: { type: 'string' as const, required: true, maxLength: 100 },
  message: { type: 'string' as const, required: true, maxLength: 2000 },
  history: { type: 'string' as const, required: false, maxLength: 10000 }
};