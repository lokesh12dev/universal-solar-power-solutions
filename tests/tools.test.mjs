// Unit checks for Solar Studio helpers (src/lib/tools.ts).
// Pure arithmetic, finite-safe, no NaN/Infinity leaks.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { roofStudio, billAnalysis, batteryPlan, businessRoi } from "../src/lib/tools.ts";
import { runCalculator } from "../src/lib/calculator.ts";

describe("roof studio", () => {
  it("40x25 ft at 70% coverage, 550W/27sqft panels", () => {
    const r = roofStudio({ lengthFt: 40, widthFt: 25, coveragePct: 70, panelWatt: 550, panelSqft: 27 });
    assert.equal(r.grossSqft, 1000);
    assert.equal(r.usableSqft, 700);
    assert.equal(r.maxPanels, 25); // floor(700/27)
    assert.equal(r.capacityKwp, 13.8); // 25*550/1000 = 13.75 -> 13.8
  });
  it("zero / invalid inputs stay finite, never NaN", () => {
    const r = roofStudio({ lengthFt: NaN, widthFt: Infinity, coveragePct: -5, panelWatt: 0, panelSqft: 0 });
    assert.deepEqual([r.grossSqft, r.usableSqft, r.maxPanels, r.capacityKwp], [0, 0, 0, 0]);
  });
  it("coverage clamps to 0–100%", () => {
    const r = roofStudio({ lengthFt: 10, widthFt: 10, coveragePct: 250, panelWatt: 500, panelSqft: 25 });
    assert.equal(r.usableSqft, 100);
  });
});

describe("bill analysis", () => {
  it("₹6000 bill, ₹200 fixed, ₹7.5 tariff, 60 days", () => {
    const r = billAnalysis({ billAmount: 6000, tariff: 7.5, billingDays: 60, fixedCharges: 200 });
    assert.equal(r.energyCharge, 5800);
    assert.equal(r.energyUnits, 773.3); // 5800/7.5
    assert.equal(r.unitsPerDay, 12.9);
    assert.equal(r.solarOffsettable, 5800);
  });
  it("zero tariff gives 0 units without division by zero", () => {
    const r = billAnalysis({ billAmount: 6000, tariff: 0, billingDays: 60, fixedCharges: 0 });
    assert.equal(r.energyUnits, 0);
    assert.ok(Number.isFinite(r.unitsPerDay));
  });
  it("fixed charges exceeding the bill floor energy at 0", () => {
    const r = billAnalysis({ billAmount: 500, tariff: 8, billingDays: 30, fixedCharges: 900 });
    assert.equal(r.energyUnits, 0);
  });
});

describe("battery plan (kW vs kWh distinguished)", () => {
  it("2 kW critical load x 4 hrs at 80% DoD", () => {
    const r = batteryPlan({ criticalLoadKw: 2, backupHours: 4, depthOfDischarge: 0.8, daysAutonomy: 1 });
    assert.equal(r.energyNeededKwh, 8);
    assert.equal(r.batteryKwh, 10);
    assert.equal(r.inverterKw, 2.5);
  });
  it("invalid inputs stay finite", () => {
    const r = batteryPlan({ criticalLoadKw: NaN, backupHours: Infinity, depthOfDischarge: 0, daysAutonomy: 0 });
    for (const v of Object.values(r)) assert.ok(Number.isFinite(v));
  });
});

describe("business ROI (reuses audited core)", () => {
  it("payback = cost / benefit; null when benefit is 0", () => {
    const core = runCalculator({ monthlyBill: 30000, tariff: 8, propertyType: "commercial", systemType: "on-grid" });
    const r = businessRoi({ monthlyBill: 30000, tariff: 8, costPerKw: 55000, specificYield: 1500 }, core);
    assert.equal(r.suggestedKw, core.suggestedKw);
    assert.equal(r.systemCost, core.suggestedKw * 55000);
    assert.ok(r.simplePaybackYears !== null && r.simplePaybackYears > 0);
    const zero = businessRoi({ monthlyBill: 0, tariff: 0, costPerKw: 55000, specificYield: 1500 },
      { suggestedKw: 0, annualGeneration: 0, annualSavingsYear1: 0 });
    assert.equal(zero.simplePaybackYears, null);
  });
});
