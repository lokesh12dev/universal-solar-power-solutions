// Multi-year solar project forecast — pure, unit-tested cash-flow math.
// INDICATIVE planning scenarios only: never quotations, never guaranteed
// returns, never annualized-return claims.
//
// Cash-flow definitions (used consistently everywhere below):
//   gross benefit (year t) = yearOneBenefit x (1+escalation)^(t-1) x (1-degradation)^(t-1)
//   operating cost (year t) = O&M x (1+omEscalation)^(t-1) + inverter allowance (if t = inverterYear) + annual financing
//   net benefit (year t)   = gross - operating
//   net investment         = projectCost - incentive (incentive reduces the outlay ONCE;
//                            it is never subtracted again from annual flows)
//   ROI (%)                = (total net - net investment) / net investment x 100   [simple, whole-period, NOT annualized]
//   simple payback         = first whole year with cumulative net >= 0, else null
//                            ("Not reached within the forecast period")
//   NPV                    = computed ONLY when a discount rate is supplied
//   IRR                    = discount rate where NPV = 0 via bisection; null when no
//                            sign change exists on the search interval (reported, not forced)

export type ForecastInput = {
  projectCost: number; // INR initial investment
  yearOneBenefit: number; // INR gross year-1 electricity benefit
  tariffEscalation: number; // e.g. 0.03 (assumption, not a price guarantee)
  degradation: number; // e.g. 0.005 annual generation decline
  annualOm: number; // INR year-1 O&M cost
  omEscalation: number; // e.g. 0.03
  inverterAllowance: number; // INR one-time replacement allowance
  inverterYear: number; // 1-indexed year the allowance lands in
  annualFinancing: number; // INR interest/fees modeled per year (0 = cash purchase)
  incentive: number; // INR verified incentive only; 0 unless eligibility confirmed
  years: number; // evaluation period, clamped 1..30
  discountRate?: number; // e.g. 0.08; NPV computed only when supplied
};

export type ForecastYear = {
  year: number;
  grossBenefit: number;
  omCost: number;
  inverterCost: number;
  financingCost: number;
  netBenefit: number;
  cumulativeNet: number;
};

export type ForecastResult = {
  years: ForecastYear[];
  totalGross: number;
  totalOperating: number;
  totalNet: number;
  netInvestment: number;
  simplePaybackYears: number | null;
  roiPct: number | null;
  npv: number | null;
  irr: number | null;
};

const fin = (n: unknown): number => (typeof n === "number" && Number.isFinite(n) ? n : 0);
const nonNeg = (n: unknown): number => Math.max(0, fin(n));
const rInt = (n: number) => (Number.isFinite(n) ? Math.round(n) : 0);

function npvOf(netInvestment: number, nets: number[], rate: number): number {
  let v = -netInvestment;
  for (let t = 0; t < nets.length; t++) v += nets[t] / Math.pow(1 + rate, t + 1);
  return v;
}

function irrOf(netInvestment: number, nets: number[]): number | null {
  if (netInvestment <= 0 || nets.length === 0) return null;
  if (nets.every((c) => c <= 0)) return null; // never breaks even: no IRR exists
  const f = (r: number) => npvOf(netInvestment, nets, r);
  let lo = -0.9;
  let hi = 10;
  let flo = f(lo);
  let fhi = f(hi);
  if (!Number.isFinite(flo) || !Number.isFinite(fhi)) return null;
  if (flo * fhi > 0) return null; // no sign change on the interval: do not fabricate
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (!Number.isFinite(fmid)) return null;
    if (Math.abs(fmid) < 1e-9) return mid;
    if (flo * fmid <= 0) { hi = mid; fhi = fmid; } else { lo = mid; flo = fmid; }
  }
  return (lo + hi) / 2;
}

export function forecastProject(raw: ForecastInput): ForecastResult {
  const years = Math.min(30, Math.max(1, Math.floor(fin(raw.years)) || 1));
  const cost = nonNeg(raw.projectCost);
  const incentive = Math.min(cost, nonNeg(raw.incentive)); // can never exceed the outlay
  const netInvestment = cost - incentive;
  const y1 = nonNeg(raw.yearOneBenefit);
  const esc = Math.max(-0.5, Math.min(2, fin(raw.tariffEscalation)));
  const deg = Math.max(0, Math.min(0.2, fin(raw.degradation)));
  const om1 = nonNeg(raw.annualOm);
  const omEsc = Math.max(-0.5, Math.min(2, fin(raw.omEscalation)));
  const invAllow = nonNeg(raw.inverterAllowance);
  const invYear = Math.min(years, Math.max(1, Math.floor(fin(raw.inverterYear)) || 1));
  const finYear = nonNeg(raw.annualFinancing);

  const rows: ForecastYear[] = [];
  let cumulative = 0;
  let totalGross = 0;
  let totalOp = 0;
  for (let t = 1; t <= years; t++) {
    const gross = y1 * Math.pow(1 + esc, t - 1) * Math.pow(1 - deg, t - 1);
    const om = om1 * Math.pow(1 + omEsc, t - 1);
    const inv = t === invYear ? invAllow : 0;
    const net = gross - om - inv - finYear;
    cumulative += net;
    totalGross += gross;
    totalOp += om + inv + finYear;
    rows.push({
      year: t, grossBenefit: rInt(gross), omCost: rInt(om),
      inverterCost: rInt(inv), financingCost: rInt(finYear),
      netBenefit: rInt(net), cumulativeNet: rInt(cumulative),
    });
  }
  const totalNet = cumulative;
  // Whole-year payback: first year whose rounded cumulative net reaches the
  // net investment... compared here as >= 0 because cumulative tracks net
  // benefit alone; equivalently cumulative >= netInvestment on a gross basis.
  // When it never happens inside the period: null ("not reached").
  let payback: number | null = null;
  if (netInvestment <= 0) {
    payback = totalNet > 0 ? 0 : null; // 0 = immediate: no net upfront cost
  } else {
    let run = -netInvestment;
    for (const row of rows) {
      run += row.netBenefit;
      if (run >= 0) { payback = row.year; break; }
    }
  }

  const roiPct = netInvestment > 0 ? ((totalNet - netInvestment) / netInvestment) * 100 : null;
  const rate = raw.discountRate === undefined ? null : fin(raw.discountRate);
  const nets = rows.map((r) => r.netBenefit);
  const npv = rate === null || rate < 0 ? null : npvOf(netInvestment, nets, rate);
  return {
    years: rows,
    totalGross: rInt(totalGross),
    totalOperating: rInt(totalOp),
    totalNet: rInt(totalNet),
    netInvestment: rInt(netInvestment),
    simplePaybackYears: payback,
    roiPct: roiPct === null || !Number.isFinite(roiPct) ? null : Math.round(roiPct * 10) / 10,
    npv: npv === null || !Number.isFinite(npv) ? null : rInt(npv),
    irr: irrOf(netInvestment, nets),
  };
}
