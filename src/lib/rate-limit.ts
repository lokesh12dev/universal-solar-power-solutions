// In-memory per-key sliding-window rate limiter for API routes.
//
// Contract: RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW_MS per key.
// Returns { allowed, retryAfterSec }. Single-instance memory is exact for
// single-VM/dev; on serverless multi-instance it is best-effort (fails open,
// never blocks legitimate users). Keys must be coarse (route + IP) — never
// names, phones, emails, or message text. Entries older than the window are
// evicted on each check, so memory stays bounded without a sweeper.

export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000;

const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  now: number = Date.now()
): { allowed: boolean; retryAfterSec: number } {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
    hits.set(key, recent);
    return { allowed: false, retryAfterSec };
  }
  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfterSec: 0 };
}

/** Coarse client identity for limiting: first forwarded IP or "unknown". */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64) || "unknown";
  return "unknown";
}
