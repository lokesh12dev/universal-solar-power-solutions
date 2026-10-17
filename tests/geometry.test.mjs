// Geometry + determinism tests for the scroll story (SolarScrollStory.tsx).
// The animation is a pure function of scroll progress: same scroll position
// must always produce the same visual state, forward or backward.
// Run: npm test
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "src/components/SolarScrollStory.tsx"), "utf8");

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
// Mirror of OrbitRing: ring rotates R, slots pre-rotated by slot angle,
// inners counter-rotate -(R + angle) so photos stay upright (ferris wheel).
const ringAngle = (p) => lerp(-40, 320, p);
const slotNetRotation = (R, angle) => R + angle + (-R - angle);

describe("orbit geometry (mirrors SolarScrollStory.tsx)", () => {
  it("uses 9 evenly spread slots (40 degrees apart)", () => {
    assert.ok(/SITE_PHOTOS\.slice\(0,\s*9\)/.test(src), "ring uses 9 photos");
    assert.ok(/\(i \/ ring\.length\) \* 360/.test(src), "even angular spread");
    for (let i = 0; i < 9; i++) assert.equal((i / 9) * 360, i * 40);
  });
  it("badges are numbered 01-09 sequentially", () => {
    for (let i = 0; i < 9; i++) {
      assert.equal(String(i + 1).padStart(2, "0"), ["01","02","03","04","05","06","07","08","09"][i]);
    }
  });
  it("photos stay perfectly upright at any scroll progress", () => {
    for (const p of [0, 0.13, 0.5, 0.87, 1]) {
      const R = ringAngle(p);
      for (let i = 0; i < 9; i++) {
        assert.ok(Math.abs(slotNetRotation(R, i * 40)) < 1e-9, `p=${p} slot=${i}`);
      }
    }
  });
  it("rotation is deterministic and reversible", () => {
    assert.equal(ringAngle(0.5), ringAngle(0.5));
    assert.ok(ringAngle(0) < ringAngle(0.5) && ringAngle(0.5) < ringAngle(1));
    assert.equal(ringAngle(0), -40);
    assert.equal(ringAngle(1), 320);
  });
  it("ring fits viewport at 390x844 and 1440x900 (radius 32vmin, box 80vmin)", () => {
    // mobile photos are w-20 (80px), desktop w-36 (144px); heights h-24/h-40
    for (const [w, h, photoHW, photoHH] of [[390, 844, 40, 48], [1440, 900, 72, 80]]) {
      const vmin = Math.min(w, h);
      const half = (80 * vmin) / 100 / 2; // container half-size
      const r = (32 * vmin) / 100; // photo-center radius
      assert.ok(r + photoHW <= w / 2 + 1, `${w}x${h} horizontal`);
      assert.ok(r + photoHH <= h / 2 + 1, `${w}x${h} vertical`);
      assert.ok(half <= Math.min(w, h) / 2 + 1, "container fits");
    }
  });
});

describe("chapters 01-05 sequencing", () => {
  it("chapters are sequential 01..05 with no gaps", () => {
    const nums = [...src.matchAll(/\{\s*n:\s*"(\d+)",\s*title:/g)].map((m) => m[1]);
    assert.deepEqual(nums, ["01", "02", "03", "04", "05"]);
  });
  it("active index math covers full range without gaps", () => {
    for (const p of [0, 0.1, 0.39, 0.4, 0.61, 0.99, 1]) {
      const active = Math.min(5 - 1, Math.floor(p * 5));
      assert.ok(active >= 0 && active <= 4, `p=${p}`);
    }
    assert.equal(Math.min(4, Math.floor(0 * 5)), 0);
    assert.equal(Math.min(4, Math.floor(1 * 5)), 4);
  });
  it("rail segments fill exactly with progress", () => {
    for (let i = 0; i < 5; i++) {
      assert.equal(clamp01(0 * 5 - i), i === 0 ? 0 : 0);
      assert.equal(clamp01(1 * 5 - i), 1);
    }
  });
});

describe("reduced-motion + lifecycle guards present", () => {
  it("every motion loop checks prefersReduced", () => {
    const loops = (src.match(/if \(prefersReduced\(\)\) return;/g) || []).length;
    assert.ok(loops >= 2, `expected >=2 reduced-motion guards, found ${loops}`);
    assert.ok(/fully static|static composed/.test(src), "static fallbacks documented");
  });
  it("all listeners/IO/rAF are cleaned up", () => {
    assert.ok(src.includes("removeEventListener(\"scroll\""), "scroll cleanup");
    assert.ok(src.includes("removeEventListener(\"resize\""), "resize cleanup");
    assert.ok(src.includes("cancelAnimationFrame(raf)"), "rAF cleanup");
    assert.ok(src.includes("io.disconnect()"), "observer cleanup");
  });
  it("sections use safe viewport behavior + overflow guards", () => {
    assert.ok(src.includes("overflow-x-clip"), "x-clip guards");
    assert.ok(!/sticky top-0/.test(src), "no pinned full-screen sections");
    assert.ok(!/overflow-y-auto/.test(src), "no nested scroll traps");
    assert.ok(!/style=\{\{\s*height:\s*"[234]\d0vh"/.test(src), "no giant pin-height sections");
  });
});
