// Transparent, unit-documented solar estimator.
// All defaults are editable in the UI and shown with results.
// This is an INDICATIVE estimate, not an engineering design or quotation.

export type CalculatorInput = {
  monthlyBill: number; // INR / month
  tariff: number; // INR / kWh
  monthlyUnitsKnown?: number; // kWh / month (optional override)
  propertyType: "residential" | "commercial" | "industrial";
  roofSqft?: number; // sq ft usable
  systemType: "on-grid" | "hybrid";
};

export type CalculatorAssumptions = {
  specificYield: number; // kWh per kW per year (Chennai ~1500)
  sqftPerKw: number; // ~100
  performanceRatio: number; // 0.78
  tariffEscalation: number; // 0.03
  co2PerKwh: number; // 0.82 kg
  treesPerTonneCo2: number; // ~45
};

export const defaultAssumptions: CalculatorAssumptions = {
  specificYield: 1500,
  sqftPerKw: 100,
  performanceRatio: 1, // applied inside specificYield already; kept for transparency
  tariffEscalation: 0.03,
  co2PerKwh: 0.82,
  treesPerTonneCo2: 45,
};

export type CalculatorResult = {
  monthlyUnits: number;
  annualUnits: number;
  suggestedKw: number;
  annualGeneration: number;
  roofNeeded: number;
  roofFits: boolean | null;
  annualSavingsYear1: number;
  co2AvoidedTpa: number;
  treesEquivalent: number;
};

export function runCalculator(i: CalculatorInput, a: CalculatorAssumptions = defaultAssumptions): CalculatorResult {
  // Hardening (2026-10-13): coerce non-finite inputs to safe fallbacks so
  // outputs never leak NaN/Infinity (e.g. UI parseFloat("Infinity") is
  // truthy Infinity, or direct lib calls with NaN/Infinity/overflow).
  // Finite negatives keep legacy behaviour (see tests/calculator.test.mjs #9).
  const fin = (n: unknown): number => (typeof n === "number" && Number.isFinite(n) ? n : 0);
  // Assumption factors must be non-negative: negative yield/sqft/CO2 would
  // produce negative generation, roof need or savings (finite but nonsense).
  const nonNeg = (n: unknown): number => Math.max(0, fin(n));
  const bill = fin(i.monthlyBill);
  const tariff = fin(i.tariff);
  const known = typeof i.monthlyUnitsKnown === "number" && Number.isFinite(i.monthlyUnitsKnown)
    ? i.monthlyUnitsKnown : undefined;
  const roof = typeof i.roofSqft === "number" && Number.isFinite(i.roofSqft)
    ? i.roofSqft : undefined;
  const specYield = nonNeg(a.specificYield);
  const sqftPerKw = nonNeg(a.sqftPerKw);
  const co2PerKwh = nonNeg(a.co2PerKwh);
  const treesPerTonne = nonNeg(a.treesPerTonneCo2);
  const monthlyUnits = known && known > 0
    ? known
    : tariff > 0 ? bill / tariff : 0;
  const annualUnits = monthlyUnits * 12;
  // Size to ~90% of annual use (avoid oversizing given export uncertainty)
  const rawKw = specYield > 0 ? (annualUnits * 0.9) / specYield : 0;
  // Round to nearest 0.5, clamp 1–500 kW
  const suggestedKw = Math.min(500, Math.max(rawKw > 0 ? Math.round(rawKw * 2) / 2 : 0, annualUnits > 0 ? 1 : 0));
  const annualGeneration = suggestedKw * specYield;
  const roofNeeded = suggestedKw * sqftPerKw;
  const roofFits = roof && roof > 0 ? roof >= roofNeeded : null;
  const usableFraction = 0.85; // conservative self-consumption + export value
  const annualSavingsYear1 = annualGeneration * tariff * usableFraction;
  const co2AvoidedTpa = (annualGeneration * co2PerKwh) / 1000;
  const treesEquivalent = Math.round(co2AvoidedTpa * treesPerTonne);
  const r = (n: number) => (Number.isFinite(n) ? Math.round(n * 10) / 10 : 0);
  const safeInt = (n: number) => (Number.isFinite(n) ? Math.round(n) : 0);
  const safeKw = Number.isFinite(suggestedKw) ? suggestedKw : 0;
  return {
    monthlyUnits: r(monthlyUnits), annualUnits: r(annualUnits),
    suggestedKw: safeKw, annualGeneration: r(annualGeneration), roofNeeded: r(roofNeeded),
    roofFits, annualSavingsYear1: safeInt(annualSavingsYear1),
    co2AvoidedTpa: r(co2AvoidedTpa), treesEquivalent: safeInt(treesEquivalent),
  };
}
