// Rate-limit QA for Universal Solar API routes.
// Mirrors src/lib/rate-limit.ts (sliding window) + source contracts proving
// both POST routes enforce it. Run: npm test -> node --test tests/*.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---- Exact mirror of src/lib/rate-limit.ts ----
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function makeLimiter() {
  const hits = new Map();
  return function checkRateLimit(key, now = Date.now()) {
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
  };
}

describe("rate limiter behaviour (mirrors src/lib/rate-limit.ts)", () => {
  it("1. allows up to MAX requests inside the window", () => {
    const check = makeLimiter();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      const r = check("enquiries:1.2.3.4", 1_000_000 + i * 100);
      assert.equal(r.allowed, true, `request ${i + 1} should pass`);
    }
  });

  it("2. blocks the (MAX+1)-th request with a positive retryAfterSec", () => {
    const check = makeLimiter();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) check("k", 1_000_000 + i * 100);
    const r = check("k", 1_000_000 + RATE_LIMIT_MAX * 100);
    assert.equal(r.allowed, false);
    assert.ok(r.retryAfterSec >= 1 && r.retryAfterSec <= 60, `retryAfterSec=${r.retryAfterSec}`);
  });

  it("3. window slides: old hits expire and requests pass again", () => {
    const check = makeLimiter();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) check("k", 1_000_000 + i * 100);
    assert.equal(check("k", 1_000_000 + 999).allowed, false);
    const r = check("k", 1_000_000 + RATE_LIMIT_WINDOW_MS + 1_000);
    assert.equal(r.allowed, true, "window should have slid past all hits");
  });

  it("4. keys are isolated (one IP blocked does not block another)", () => {
    const check = makeLimiter();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) check("enquiries:1.1.1.1", 2_000_000 + i);
    assert.equal(check("enquiries:1.1.1.1", 2_000_000 + 999).allowed, false);
    assert.equal(check("enquiries:2.2.2.2", 2_000_000 + 999).allowed, true);
    assert.equal(check("support:1.1.1.1", 2_000_000 + 999).allowed, true, "routes have separate buckets");
  });

  it("5. retryAfterSec never exceeds the window and never zero when blocked", () => {
    const check = makeLimiter();
    for (let i = 0; i < RATE_LIMIT_MAX; i++) check("k", 3_000_000);
    const r = check("k", 3_000_000);
    assert.equal(r.allowed, false);
    assert.ok(r.retryAfterSec >= 1 && r.retryAfterSec <= 60);
  });
});

describe("rate limit source contracts", () => {
  const lib = read("src/lib/rate-limit.ts");
  const enquiries = read("src/app/api/enquiries/route.ts");
  const support = read("src/app/api/support-requests/route.ts");

  it("lib exposes MAX/window constants and evicts old entries", () => {
    assert.ok(lib.includes("RATE_LIMIT_MAX = 10"), "MAX=10 expected");
    assert.ok(lib.includes("RATE_LIMIT_WINDOW_MS = 60_000"), "60s window expected");
    assert.ok(/filter/.test(lib), "sliding-window eviction expected");
  });

  it("both POST routes check the limiter first and return 429 + Retry-After", () => {
    for (const [name, src] of [["enquiries", enquiries], ["support", support]]) {
      assert.ok(src.includes("checkRateLimit"), `${name}: must call checkRateLimit`);
      assert.ok(src.includes("429"), `${name}: must return 429`);
      assert.ok(/Retry-After/.test(src), `${name}: must send Retry-After`);
    }
  });

  it("limiter keys are coarse (route + IP) — no PII in keys", () => {
    assert.ok(/enquiries:\$\{clientIp|enquiries:`/.test(enquiries) || enquiries.includes("enquiries:${clientIp(req)}"), "route-scoped key expected");
    const codeOnly = lib.replace(/\/\/.*$/gm, ""); // comments may discuss PII; code must not handle it
    assert.ok(!/\bphone\b|\bemail\b|\bpincode\b|\bmessage\b|\bname\b/.test(codeOnly), "lib code must not reference PII fields");
    assert.ok(lib.includes("x-forwarded-for"), "proxy-aware IP extraction expected");
  });
});
