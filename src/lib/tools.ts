// Solar Studio helpers — small, pure, unit-tested estimators that complement
// runCalculator (see lib/calculator.ts). Everything here is INDICATIVE:
// illustrative concepts for planning conversations, never quotations,
// never engineer-approved designs, never guaranteed savings.

const fin = (n: unknown): number => (typeof n === "number" && Number.isFinite(n) ? n : 0);
const nonNeg = (n: unknown): number => Math.max(0, fin(n));
const r1 = (n: number) => (Number.isFinite(n) ? Math.round(n * 10) / 10 : 0);
const rInt = (n: number) => (Number.isFinite(n) ? Math.round(n) : 0);

export type RoofStudioInput = {
  lengthFt: number; // usable roof length
  widthFt: number; // usable roof width
  coveragePct: number; // % of area usable for panels (setbacks, walkways)
  panelWatt: number; // W per panel
  panelSqft: number; // sq ft per panel incl. spacing
};

export type RoofStudioResult = { grossSqft: number; usableSqft: number; maxPanels: number; capacityKwp: number };

export function roofStudio(i: RoofStudioInput): RoofStudioResult {
  const gross = nonNeg(i.lengthFt) * nonNeg(i.widthFt);
  const coverage = Math.min(1, Math.max(0, fin(i.coveragePct) / 100));
  const usable = gross * coverage;
  const per = nonNeg(i.panelSqft);
  const panels = per > 0 ? Math.floor(usable / per) : 0;
  const kwp = (panels * nonNeg(i.panelWatt)) / 1000;
  return { grossSqft: r1(gross), usableSqft: r1(usable), maxPanels: rInt(panels), capacityKwp: r1(kwp) };
}

export type BillAnalysisInput = {
  billAmount: number; // INR for the billing period
  tariff: number; // INR / kWh
  billingDays: number; // days in the period
  fixedCharges: number; // INR of fixed/demand charges + taxes in the bill
};

export type BillAnalysisResult = {
  energyUnits: number; // kWh in the period
  energyCharge: number; // INR attributable to energy
  unitsPerDay: number;
  solarOffsettable: number; // INR of energy charge solar can partly offset (indicative)
};

export function billAnalysis(i: BillAnalysisInput): BillAnalysisResult {
  const tariff = nonNeg(i.tariff);
  const fixed = nonNeg(i.fixedCharges);
  const energyCharge = Math.max(0, nonNeg(i.billAmount) - fixed);
  const units = tariff > 0 ? energyCharge / tariff : 0;
  const days = nonNeg(i.billingDays);
  return {
    energyUnits: r1(units),
    energyCharge: rInt(energyCharge),
    unitsPerDay: days > 0 ? r1(units / days) : 0,
    // Fixed charges, demand charges, and taxes typically remain payable;
    // only the energy portion is partly offsettable. Stated, not assumed away.
    solarOffsettable: rInt(energyCharge),
  };
}

export type BatteryPlanInput = {
  criticalLoadKw: number; // kW of essential loads to back up (POWER)
  backupHours: number; // hours of backup wanted (TIME)
  depthOfDischarge: number; // usable fraction, e.g. 0.8 lithium
  daysAutonomy: number; // usually 1 for grid-tied hybrid
};

export type BatteryPlanResult = {
  energyNeededKwh: number; // ENERGY the loads consume over backupHours
  batteryKwh: number; // nameplate storage after DoD
  inverterKw: number; // min inverter power rating
};

export function batteryPlan(i: BatteryPlanInput): BatteryPlanResult {
  const kw = nonNeg(i.criticalLoadKw);
  const hrs = nonNeg(i.backupHours);
  const energy = kw * hrs * Math.max(1, Math.min(3, fin(i.daysAutonomy) || 1));
  const dod = Math.min(1, Math.max(0.1, fin(i.depthOfDischarge) || 0.8));
  return { energyNeededKwh: r1(energy), batteryKwh: r1(energy / dod), inverterKw: r1(kw * 1.25) };
}

export type BusinessRoiInput = {
  monthlyBill: number;
  tariff: number;
  roofSqft?: number;
  costPerKw: number; // INR/kWp installed, editable scenario input — NOT our price
  specificYield: number;
};

export type BusinessRoiResult = {
  suggestedKw: number;
  annualGeneration: number;
  annualBenefit: number;
  systemCost: number;
  simplePaybackYears: number | null; // null when benefit is 0 (no division by zero)
};

export function businessRoi(
  i: BusinessRoiInput,
  core: { suggestedKw: number; annualGeneration: number; annualSavingsYear1: number }
): BusinessRoiResult {
  // Reuses the audited core result so ROI can never drift from the estimator.
  const kw = fin(core.suggestedKw);
  const gen = fin(core.annualGeneration);
  const benefit = fin(core.annualSavingsYear1);
  const cost = kw * nonNeg(i.costPerKw);
  return {
    suggestedKw: kw,
    annualGeneration: r1(gen),
    annualBenefit: rInt(benefit),
    systemCost: rInt(cost),
    // Simple payback = initial cost / annual net benefit. Arithmetic illustration only.
    simplePaybackYears: benefit > 0 ? r1(cost / benefit) : null,
  };
}
