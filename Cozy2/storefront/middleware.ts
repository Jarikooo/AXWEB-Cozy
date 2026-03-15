import { NextRequest, NextResponse } from "next/server";
import { authLimiter, apiLimiter, submitLimiter } from "@/lib/rate-limit";

/**
 * Extracts a best-effort client IP from the request.
 * In production behind a reverse proxy (Vercel, Nginx, Cloudflare),
 * x-forwarded-for is set by the proxy. Falls back to "unknown".
 */
function getClientIp(req: NextRequest): string {
  // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  // Next.js on Vercel sets this
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

function rateLimitResponse(resetMs: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(resetMs / 1000)),
      },
    }
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // ── Auth endpoints: strict limit (credential stuffing protection) ──
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/account/login") || pathname.startsWith("/account/register")) {
    // Only rate limit POST/form submissions, not page loads
    if (req.method === "POST") {
      const result = authLimiter(ip);
      if (!result.allowed) {
        return rateLimitResponse(result.resetMs);
      }
    }
  }

  // ── Newsletter & review submission: anti-spam ──
  if (pathname === "/api/newsletter" || pathname.startsWith("/api/review")) {
    if (req.method === "POST") {
      const result = submitLimiter(ip);
      if (!result.allowed) {
        return rateLimitResponse(result.resetMs);
      }
    }
  }

  // ── General API routes: DoS protection ──
  if (pathname.startsWith("/api/")) {
    const result = apiLimiter(ip);
    if (!result.allowed) {
      return rateLimitResponse(result.resetMs);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on API routes and auth pages (skip static assets, images, etc.)
  matcher: ["/api/:path*", "/account/login", "/account/register"],
};
