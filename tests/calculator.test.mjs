// QA unit checks for Universal Solar estimator.
// Covers src/lib/calculator.ts (runCalculator) + Calculator.tsx wiring.
// Run: npm test  ->  node --test tests/*.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runCalculator, defaultAssumptions } from "../src/lib/calculator.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const base = (over = {}) => ({
  monthlyBill: 3000,
  tariff: 7.5,
  propertyType: "residential",
  systemType: "on-grid",
  ...over,
});

describe("calculator: normal bill -> units", () => {
  it("1. bill 3000 / tariff 7.5 -> 400 kWh/mo, 4800/yr, 3 kW", () => {
    const r = runCalculator(base(), defaultAssumptions);
    assert.equal(r.monthlyUnits, 400);
    assert.equal(r.annualUnits, 4800);
    assert.equal(r.suggestedKw, 3);
    assert.equal(r.annualGeneration, 4500);
    assert.equal(r.roofNeeded, 300);
    assert.equal(r.annualSavingsYear1, 28688); // 4500*7.5*0.85 = 28687.5 -> 28688
    assert.equal(r.co2AvoidedTpa, 3.7); // 4500*0.82/1000 = 3.69 -> 3.7
    assert.equal(r.treesEquivalent, 166); // round(3.69*45)
  });

  it("2. minimum-size floor: tiny use still suggests 1 kW", () => {
    const r = runCalculator(base({ monthlyBill: 100, tariff: 10 }));
    // monthly 10, annual 120, rawKw 0.072 -> rounds to 0 -> clamped to 1 kW floor
    assert.equal(r.monthlyUnits, 10);
    assert.equal(r.annualUnits, 120);
    assert.equal(r.suggestedKw, 1);
    assert.equal(r.annualGeneration, 1500);
  });

  it("3. large bill clamps to 500 kW max", () => {
    const r = runCalculator(base({ monthlyBill: 1_000_000, tariff: 5, propertyType: "industrial" }));
    assert.equal(r.monthlyUnits, 200000);
    assert.equal(r.suggestedKw, 500);
    assert.equal(r.annualGeneration, 750000);
    assert.equal(r.roofNeeded, 50000);
  });
});

describe("calculator: known-units override", () => {
  it("4. monthlyUnitsKnown wins over bill/tariff", () => {
    const r = runCalculator(base({ monthlyUnitsKnown: 500 }));
    // would be 400 from bill/tariff; override gives 500/mo, 6000/yr
    assert.equal(r.monthlyUnits, 500);
    assert.equal(r.annualUnits, 6000);
    // rawKw 6000*0.9/1500 = 3.6 -> nearest 0.5 = 3.5
    assert.equal(r.suggestedKw, 3.5);
    assert.equal(r.annualGeneration, 5250);
    assert.equal(r.roofNeeded, 350);
    assert.equal(r.annualSavingsYear1, 33469);
    assert.equal(r.co2AvoidedTpa, 4.3);
    assert.equal(r.treesEquivalent, 194);
  });

  it("5. known = 0 / negative falls back to bill/tariff", () => {
    for (const v of [0, -50]) {
      const r = runCalculator(base({ monthlyUnitsKnown: v }));
      assert.equal(r.monthlyUnits, 400, `known=${v} should fall back`);
      assert.equal(r.suggestedKw, 3);
    }
  });
});

describe("calculator: zero / invalid inputs", () => {
  it("6. zero bill -> all zeros (no crash)", () => {
    const r = runCalculator(base({ monthlyBill: 0 }));
    assert.deepEqual(
      [r.monthlyUnits, r.annualUnits, r.suggestedKw, r.annualGeneration, r.roofNeeded, r.annualSavingsYear1, r.co2AvoidedTpa, r.treesEquivalent],
      [0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert.equal(r.roofFits, null);
  });

  it("7. zero tariff -> 0 units, no division by zero", () => {
    const r = runCalculator(base({ tariff: 0 }));
    assert.equal(r.monthlyUnits, 0);
    assert.equal(r.annualUnits, 0);
    assert.equal(r.suggestedKw, 0);
    assert.equal(r.annualGeneration, 0);
    assert.ok(Number.isFinite(r.monthlyUnits));
  });

  it("8. zero specificYield -> 1 kW floor but 0 generation/savings", () => {
    const r = runCalculator(base(), { ...defaultAssumptions, specificYield: 0 });
    assert.equal(r.suggestedKw, 1);
    assert.equal(r.annualGeneration, 0);
    assert.equal(r.annualSavingsYear1, 0);
    assert.equal(r.co2AvoidedTpa, 0);
  });

  it("9. negative bill surfaces negative units but clamps size to 0 (documents current behaviour)", () => {
    const r = runCalculator(base({ monthlyBill: -1000 }));
    assert.equal(r.monthlyUnits, -133.3);
    assert.equal(r.annualUnits, -1600);
    assert.equal(r.suggestedKw, 0);
  });
});

describe("calculator: roof fits true / false / null", () => {
  it("10a. roof larger than needed -> true", () => {
    assert.equal(runCalculator(base({ roofSqft: 1000 })).roofFits, true);
  });
  it("10b. roof exactly equal -> true (>=)", () => {
    assert.equal(runCalculator(base({ roofSqft: 300 })).roofFits, true);
  });
  it("10c. roof smaller than needed -> false", () => {
    assert.equal(runCalculator(base({ roofSqft: 100 })).roofFits, false);
  });
  it("10d. roof missing / 0 -> null (unknown)", () => {
    assert.equal(runCalculator(base()).roofFits, null);
    assert.equal(runCalculator(base({ roofSqft: 0 })).roofFits, null);
    assert.equal(runCalculator(base({ roofSqft: undefined })).roofFits, null);
  });
});

describe("calculator: rounding", () => {
  it("11. 1-dp rounding on units (1000/7 = 142.857 -> 142.9)", () => {
    const r = runCalculator(base({ monthlyBill: 1000, tariff: 7 }));
    assert.equal(r.monthlyUnits, 142.9);
    assert.equal(r.annualUnits, 1714.3);
    assert.equal(r.suggestedKw, 1);
    assert.equal(r.annualSavingsYear1, 8925); // integer Math.round
    assert.equal(r.co2AvoidedTpa, 1.2);
    assert.equal(Number.isInteger(r.treesEquivalent), true);
  });

  it("12. size rounds to nearest 0.5 (raw 2.2608 -> 2.5 kW)", () => {
    const r = runCalculator(base({ tariff: 8, monthlyUnitsKnown: 314 }));
    assert.equal(r.annualUnits, 3768);
    assert.equal(r.suggestedKw, 2.5);
    assert.equal(r.annualGeneration, 3750);
    assert.equal(r.annualSavingsYear1, 25500);
    assert.equal(r.co2AvoidedTpa, 3.1);
    assert.equal(r.treesEquivalent, 138);
  });

  it("13. suggestedKw is always a 0.5 step across a sweep", () => {
    for (let bill = 500; bill <= 20000; bill += 137) {
      const r = runCalculator(base({ monthlyBill: bill, tariff: 7.5 }));
      assert.ok(Math.abs(r.suggestedKw * 2 - Math.round(r.suggestedKw * 2)) < 1e-9, `bill ${bill} -> ${r.suggestedKw} not on 0.5 grid`);
    }
  });
});

describe("calculator: assumption edits", () => {
  it("14. lower yield sizes system up (1500 -> 1200: 3 -> 3.5 kW)", () => {
    const d = runCalculator(base(), defaultAssumptions);
    const low = runCalculator(base(), { ...defaultAssumptions, specificYield: 1200 });
    assert.equal(d.suggestedKw, 3);
    assert.equal(low.suggestedKw, 3.5);
    assert.equal(low.annualGeneration, 4200);
    assert.equal(low.annualSavingsYear1, 26775);
    assert.equal(low.co2AvoidedTpa, 3.4);
    assert.equal(low.treesEquivalent, 155);
  });

  it("15. sqft/kW edits roofNeeded only (100 -> 80: 300 -> 240)", () => {
    const d = runCalculator(base(), defaultAssumptions);
    const edited = runCalculator(base(), { ...defaultAssumptions, sqftPerKw: 80 });
    assert.equal(d.roofNeeded, 300);
    assert.equal(edited.roofNeeded, 240);
    assert.equal(edited.suggestedKw, d.suggestedKw); // size unchanged
  });

  it("16. co2 factor scales linearly (0.82 -> 1.64 doubles CO2/trees)", () => {
    const d = runCalculator(base(), defaultAssumptions);
    const dbl = runCalculator(base(), { ...defaultAssumptions, co2PerKwh: 1.64 });
    assert.equal(d.co2AvoidedTpa, 3.7);
    assert.equal(dbl.co2AvoidedTpa, 7.4);
    assert.equal(dbl.treesEquivalent, d.treesEquivalent * 2);
  });

  it("17. propertyType / systemType do not change sizing (informational)", () => {
    const a = runCalculator(base({ propertyType: "residential", systemType: "on-grid" }));
    const b = runCalculator(base({ propertyType: "commercial", systemType: "hybrid" }));
    assert.deepEqual(a, b);
  });
});

describe("calculator: non-finite hardening (audit 2026-10)", () => {
  it("18. Infinity / NaN inputs coerce to safe zeros, never NaN output", () => {
    for (const bad of [Infinity, -Infinity, NaN]) {
      const r = runCalculator(base({ monthlyBill: bad, tariff: bad, monthlyUnitsKnown: bad, roofSqft: bad }));
      for (const v of [r.monthlyUnits, r.annualUnits, r.suggestedKw, r.annualGeneration, r.roofNeeded, r.annualSavingsYear1, r.co2AvoidedTpa, r.treesEquivalent]) {
        assert.ok(Number.isFinite(v), `expected finite, got ${v}`);
      }
      assert.deepEqual([r.suggestedKw, r.annualGeneration], [0, 0]);
    }
  });

  it("19. negative assumption factors clamp to 0 (no negative generation)", () => {
    const r = runCalculator(base(), { ...defaultAssumptions, specificYield: -500, sqftPerKw: -80, co2PerKwh: -1 });
    assert.equal(r.annualGeneration, 0);
    assert.equal(r.roofNeeded, 0);
    assert.equal(r.co2AvoidedTpa, 0);
    assert.equal(r.annualSavingsYear1, 0);
  });

  it("20. outputs are always finite across an adversarial sweep", () => {
    const vals = [0, -100, 1e12, Infinity, NaN, 7.5];
    for (const bill of vals) for (const tariff of vals) {
      const r = runCalculator(base({ monthlyBill: bill, tariff }));
      for (const v of Object.values(r)) {
        if (typeof v === "number") assert.ok(Number.isFinite(v), `bill=${bill} tariff=${tariff} -> ${v}`);
      }
    }
  });
});

describe("Calculator.tsx validation contract (audit 2026-10)", () => {
  const src = read("src/components/Calculator.tsx");
  it("shows inline range errors with aria-invalid + role=alert", () => {
    assert.ok(src.includes("aria-invalid"), "aria-invalid expected");
    assert.ok(src.includes('role="alert"'), "alert role expected");
    assert.ok(src.includes("enter a number, not text or Infinity"), "non-finite message expected");
  });
  it("warns in the result panel when inputs are out of range", () => {
    assert.ok(src.includes("outside the valid ranges"), "range warning expected");
  });
  it("documents that yield includes ordinary losses; shade is a survey item", () => {
    const page = read("src/app/solar-savings-calculator/page.tsx");
    assert.ok(/ordinary system losses/i.test(page), "yield-loss note expected");
  });
});
describe("Calculator.tsx wiring contract", () => {
  const src = read("src/components/Calculator.tsx");
  it("parses bill/tariff/units/roof with parseFloat and safe fallbacks", () => {
    assert.ok(src.includes("parseFloat(bill)"), "bill parsed");
    assert.ok(src.includes("parseFloat(tariff)"), "tariff parsed");
    assert.ok(src.includes("parseFloat(unitsKnown)"), "units override parsed");
    assert.ok(src.includes("parseFloat(roof)"), "roof parsed");
  });
  it("exposes editable yield + sqft assumptions feeding runCalculator", () => {
    assert.ok(src.includes("specificYield: parseFloat(yieldV)"), "yield editable");
    assert.ok(src.includes("sqftPerKw: parseFloat(sqft)"), "sqft editable");
    assert.ok(src.includes("runCalculator("), "calls runCalculator");
  });
  it("shows roof warning only when roofFits === false, success when true", () => {
    assert.ok(src.includes("roofFits === false"), "false warning expected");
    assert.ok(src.includes("roofFits === true"), "true message expected");
    assert.ok(src.includes('role="alert"'), "alert role expected");
  });
  it("labels result indicative with disclaimer, not a quotation", () => {
    assert.ok(/Indicative/i.test(src), "indicative label expected");
    assert.ok(/Not a quotation|not.*quotation/i.test(src), "disclaimer expected");
  });
});
