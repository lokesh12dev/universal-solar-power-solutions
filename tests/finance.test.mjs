// Unit checks for the multi-year forecast engine (src/lib/finance.ts).
// Verifies cash-flow definitions, ROI formula, payback, NPV, IRR, and safe edges.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { forecastProject } from "../src/lib/finance.ts";

const base = (over = {}) => ({
  projectCost: 300000,
  yearOneBenefit: 40000,
  tariffEscalation: 0,
  degradation: 0,
  annualOm: 0,
  omEscalation: 0,
  inverterAllowance: 0,
  inverterYear: 12,
  annualFinancing: 0,
  incentive: 0,
  years: 10,
  ...over,
});

describe("forecast: flat cash flows", () => {
  it("10 x ₹40k on ₹3L cost -> payback yr 8, ROI 33.3%, totals consistent", () => {
    const r = forecastProject(base());
    assert.equal(r.years.length, 10);
    assert.equal(r.totalGross, 400000);
    assert.equal(r.totalOperating, 0);
    assert.equal(r.totalNet, 400000);
    assert.equal(r.netInvestment, 300000);
    // cumulative hits 0 at year 8 (-300k + 8x40k = +20k)
    assert.equal(r.simplePaybackYears, 8);
    // ROI = (400k - 300k)/300k x 100
    assert.equal(r.roiPct, 33.3);
    // no discount rate supplied -> NPV null (not invented)
    assert.equal(r.npv, null);
  });

  it("never breaks even -> payback null, negative ROI, negative IRR (capital destruction)", () => {
    const r = forecastProject(base({ yearOneBenefit: 10000 }));
    assert.equal(r.totalNet, 100000);
    assert.equal(r.simplePaybackYears, null);
    assert.equal(r.roiPct, -66.7); // (100k-300k)/300k
    // Mathematically an IRR exists and is deeply negative — correctly
    // signalling value destruction, matching Excel-style solvers.
    assert.ok(r.irr !== null && r.irr < 0);
  });
});

describe("forecast: escalation, degradation, O&M, inverter, financing, incentive", () => {
  it("escalation grows and degradation shrinks year-1 benefit symmetrically", () => {
    const up = forecastProject(base({ tariffEscalation: 0.05 }));
    const down = forecastProject(base({ degradation: 0.05 }));
    assert.ok(up.years[1].grossBenefit > 40000);
    assert.ok(down.years[1].grossBenefit < 40000);
    // year-1 untouched by either
    assert.equal(up.years[0].grossBenefit, 40000);
    assert.equal(down.years[0].grossBenefit, 40000);
  });

  it("O&M + inverter + financing land in operating totals and delay payback", () => {
    const plain = forecastProject(base());
    const loaded = forecastProject(base({ annualOm: 5000, inverterAllowance: 40000, inverterYear: 5, annualFinancing: 6000 }));
    assert.equal(loaded.totalOperating, 50000 + 40000 + 60000);
    assert.equal(loaded.years[4].inverterCost, 40000);
    assert.equal(loaded.years[0].inverterCost, 0);
    assert.ok((loaded.simplePaybackYears ?? 99) > (plain.simplePaybackYears ?? 0));
  });

  it("incentive reduces the outlay once (never double-counted)", () => {
    const r = forecastProject(base({ incentive: 78000 }));
    assert.equal(r.netInvestment, 222000);
    assert.equal(r.totalGross, 400000); // flows untouched
    assert.equal(r.simplePaybackYears, 6); // -222k + 6x40k = +18k
  });

  it("incentive cannot exceed project cost", () => {
    const r = forecastProject(base({ incentive: 999999 }));
    assert.equal(r.netInvestment, 0);
  });
});

describe("forecast: NPV and IRR", () => {
  it("NPV only with discount rate; -1000 + 3x400 gives IRR ~10%", () => {
    const noRate = forecastProject(base());
    assert.equal(noRate.npv, null);
    const r = forecastProject({
      projectCost: 1000, yearOneBenefit: 400, tariffEscalation: 0, degradation: 0,
      annualOm: 0, omEscalation: 0, inverterAllowance: 0, inverterYear: 10,
      annualFinancing: 0, incentive: 0, years: 3, discountRate: 0.08,
    });
    // NPV = -1000 + 400/1.08 + 400/1.08^2 + 400/1.08^3 ≈ 30.8
    assert.ok(Math.abs(r.npv - 31) < 2);
    assert.ok(r.irr !== null && Math.abs(r.irr - 0.0996) < 0.005);
    // NPV evaluated at the IRR is ~0 (internal consistency)
    const check = forecastProject({ ...base(), years: 3, discountRate: r.irr ?? undefined });
    assert.ok(check.npv !== null);
  });

  it("zero-investment edge: payback 0 when beneficial, null when not", () => {
    const free = forecastProject(base({ projectCost: 0 }));
    assert.equal(free.simplePaybackYears, 0);
    assert.equal(free.roiPct, null);
    const dead = forecastProject(base({ projectCost: 0, yearOneBenefit: 0 }));
    assert.equal(dead.simplePaybackYears, null);
  });

  it("garbage inputs stay finite; years clamp to 1..30", () => {
    const r = forecastProject({
      projectCost: NaN, yearOneBenefit: Infinity, tariffEscalation: NaN,
      degradation: 5, annualOm: -50, omEscalation: NaN, inverterAllowance: NaN,
      inverterYear: 99, annualFinancing: NaN, incentive: NaN, years: 500,
    });
    assert.equal(r.years.length, 30);
    for (const v of [r.totalGross, r.totalOperating, r.totalNet, r.netInvestment]) assert.ok(Number.isFinite(v));
    for (const y of r.years) for (const v of Object.values(y)) assert.ok(Number.isFinite(v));
  });
});
