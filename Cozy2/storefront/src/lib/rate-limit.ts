/**
 * In-memory sliding window rate limiter for Next.js API routes and Server Actions.
 *
 * How it works:
 * - Tracks request timestamps per IP in a Map
 * - Uses a sliding window: only counts requests within the last `windowMs`
 * - Old entries are pruned on every check to prevent memory leaks
 * - Separate limiters can be created for different route groups (auth, api, etc.)
 *
 * Limitations:
 * - State is per-process; if you run multiple Next.js instances behind a load balancer,
 *   each instance tracks independently. For multi-instance deployments, swap this
 *   for Redis-backed rate limiting (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimiterConfig {
  /** Maximum requests allowed within the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function createRateLimiter(config: RateLimiterConfig) {
  const { maxRequests, windowMs } = config;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent unbounded memory growth from unique IPs
  // Runs every 60 seconds, removes entries with no recent activity
  const CLEANUP_INTERVAL = 60_000;
  let lastCleanup = Date.now();

  function cleanup(now: number) {
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of store) {
      // Remove entries where all timestamps are outside the window
      if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < now - windowMs) {
        store.delete(key);
      }
    }
  }

  return function check(ip: string): RateLimitResult {
    const now = Date.now();
    cleanup(now);

    const windowStart = now - windowMs;
    let entry = store.get(ip);

    if (!entry) {
      entry = { timestamps: [] };
      store.set(ip, entry);
    }

    // Prune timestamps outside the current window
    entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

    if (entry.timestamps.length >= maxRequests) {
      const oldestInWindow = entry.timestamps[0];
      const resetMs = oldestInWindow + windowMs - now;
      return {
        allowed: false,
        remaining: 0,
        resetMs: Math.max(resetMs, 0),
      };
    }

    entry.timestamps.push(now);
    return {
      allowed: true,
      remaining: maxRequests - entry.timestamps.length,
      resetMs: windowMs,
    };
  };
}

// ─── Pre-configured limiters for different route groups ───

/** Auth routes: 10 attempts per 15 minutes (login, register) */
export const authLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
});

/** General API routes: 60 requests per minute (cart sync, wishlist sync) */
export const apiLimiter = createRateLimiter({
  maxRequests: 60,
  windowMs: 60 * 1000,
});

/** Newsletter/review submission: 5 per 10 minutes */
export const submitLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,
});
