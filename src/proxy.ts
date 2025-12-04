import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers configuration
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Content Security Policy - adjust as needed
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.cloudinary.com https://*.neon.tech https://*.stackauth.com https://*.stack-auth.com https://1.1.1.1",
    "frame-src 'self' https://js.stripe.com https://*.stackauth.com https://*.stack-auth.com",
  ].join('; '),
};

// Rate limit configuration per endpoint
const rateLimits: Record<string, { maxRequests: number; windowMs: number }> = {
  '/api/favorites': { maxRequests: 30, windowMs: 60000 }, // 30 req/min
  '/api/properties': { maxRequests: 60, windowMs: 60000 }, // 60 req/min
  '/api/bookings': { maxRequests: 20, windowMs: 60000 }, // 20 req/min
  '/api/user/complete-onboarding': { maxRequests: 5, windowMs: 60000 }, // 5 req/min
  '/api/user/create-profile': { maxRequests: 5, windowMs: 60000 }, // 5 req/min
  '/api/user/host-status': { maxRequests: 30, windowMs: 60000 }, // 30 req/min
};

function getRateLimitKey(request: NextRequest, path: string): string {
  // Use IP address for rate limiting (fallback to user-agent if no IP)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  return `${ip}:${path}`;
}

function checkRateLimit(key: string, limit: { maxRequests: number; windowMs: number }): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Create new window
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs });
    return true;
  }

  if (record.count >= limit.maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment count
  record.count++;
  return true;
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Find matching rate limit rule
    const rateLimitPath = Object.keys(rateLimits).find(path => 
      pathname.startsWith(path)
    );

    if (rateLimitPath) {
      const limit = rateLimits[rateLimitPath];
      const key = getRateLimitKey(request, rateLimitPath);
      
      if (!checkRateLimit(key, limit)) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil(limit.windowMs / 1000)
          }),
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil(limit.windowMs / 1000)),
              ...Object.fromEntries(Object.entries(securityHeaders)),
            }
          }
        );
      }
    }
  }

  return response;
}

// Configure proxy matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
