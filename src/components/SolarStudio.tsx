"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SolarCalculator } from "@/components/Calculator";
import { Reveal } from "@/components/effects";
import { runCalculator } from "@/lib/calculator";
import { forecastProject } from "@/lib/finance";
import { roofStudio, billAnalysis, batteryPlan, businessRoi } from "@/lib/tools";

/* Solar Studio — five planning tools sharing one validated core.
   Tabs switch on click only (no moving inputs); every result is labeled
   indicative; assumptions are printed beside results, not hidden. */

const TABS = [
  { id: "home", label: "Home savings" },
  { id: "business", label: "Business ROI" },
  { id: "roof", label: "Roof studio" },
  { id: "bill", label: "Bill analysis" },
  { id: "battery", label: "Solar + battery" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Num({ id, label, value, onChange, hint }: {
  id: string; label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy">{label}</label>
      <input id={id} type="number" step="any" min="0" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className="field" />
      {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
    </div>
  );
}

function Result({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <dt className="text-[11px] uppercase tracking-widest text-white/60 sm:text-xs">{label}</dt>
      <dd className="font-display text-glow mt-1 break-words text-lg font-extrabold text-cyan sm:text-2xl">{value}</dd>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
    </div>
  );
}

function AssessmentCta() {
  return (
    <div className="mt-5 rounded-2xl border border-goldbright/30 bg-white/[0.04] p-4">
      <p className="font-bold text-white">Want a more accurate estimate for your property?</p>
      <p className="mt-1 text-sm text-white/60">Share your requirements for a site-specific assessment — these scenarios carry over as conversation starters, not quotations.</p>
      <Link href="/contact" className="btn-gold mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold">Request a Solar Assessment <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </div>
  );
}

function BusinessTool() {
  const [bill, setBill] = useState("30000");
  const [tariff, setTariff] = useState("8");
  const [roof, setRoof] = useState("5000");
  const [cost, setCost] = useState("55000");
  const [yieldV, setYieldV] = useState("1500");
  // Advanced forecast inputs (percent fields entered as %, e.g. 3 = 3%)
  const [fYears, setFYears] = useState("25");
  const [fEsc, setFEsc] = useState("3");
  const [fDeg, setFDeg] = useState("0.5");
  const [fOm, setFOm] = useState("5000");
  const [fInv, setFInv] = useState("40000");
  const [fInvYr, setFInvYr] = useState("12");
  const [fFin, setFFin] = useState("0");
  const [fInc, setFInc] = useState("0");
  const [fDisc, setFDisc] = useState("8");
  const out = useMemo(() => {
    const p = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };
    const core = runCalculator(
      { monthlyBill: p(bill), tariff: p(tariff), propertyType: "commercial", roofSqft: p(roof) || undefined, systemType: "on-grid" },
      { specificYield: Math.max(0, p(yieldV)) || 1500, sqftPerKw: 100, performanceRatio: 1, tariffEscalation: 0.03, co2PerKwh: 0.82, treesPerTonneCo2: 45 }
    );
    const roi = businessRoi({ monthlyBill: p(bill), tariff: p(tariff), costPerKw: Math.max(0, p(cost)), specificYield: p(yieldV) }, core);
    const discRaw = fDisc.trim();
    const fc = forecastProject({
      projectCost: roi.systemCost,
      yearOneBenefit: roi.annualBenefit,
      tariffEscalation: p(fEsc) / 100,
      degradation: p(fDeg) / 100,
      annualOm: Math.max(0, p(fOm)),
      omEscalation: p(fEsc) / 100,
      inverterAllowance: Math.max(0, p(fInv)),
      inverterYear: Math.max(1, Math.round(p(fInvYr)) || 1),
      annualFinancing: Math.max(0, p(fFin)),
      incentive: Math.max(0, p(fInc)),
      years: Math.max(1, Math.min(30, Math.round(p(fYears)) || 25)),
      ...(discRaw === "" ? {} : { discountRate: Math.max(0, p(fDisc) / 100) }),
    });
    return { core, roi, fc };
  }, [bill, tariff, roof, cost, yieldV, fYears, fEsc, fDeg, fOm, fInv, fInvYr, fFin, fInc, fDisc]);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const fc = out.fc;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Num id="b-bill" label="Monthly bill (₹)" value={bill} onChange={setBill} />
          <Num id="b-tariff" label="Tariff (₹/kWh)" value={tariff} onChange={setTariff} />
          <Num id="b-roof" label="Roof/site area (sq ft)" value={roof} onChange={setRoof} />
          <Num id="b-cost" label="Cost per kW (₹, scenario)" value={cost} onChange={setCost} hint="Editable scenario input — not our price." />
          <Num id="b-yield" label="Yield (kWh/kW/yr)" value={yieldV} onChange={setYieldV} />
        </div>
        <p className="mt-4 text-sm text-slate">Operating hours and hourly load shape change self-consumption and export value — this tool sizes from monthly totals, so treat the benefit as a starting scenario for the survey conversation.</p>
        <details className="mt-5 rounded-2xl border border-line bg-ice p-4">
          <summary className="cursor-pointer font-bold text-navy">Multi-year forecast (advanced assumptions)</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Num id="b-fy" label="Evaluation period (years)" value={fYears} onChange={setFYears} hint="1–30." />
            <Num id="b-fe" label="Tariff escalation (%/yr)" value={fEsc} onChange={setFEsc} hint="Assumption, not a price promise." />
            <Num id="b-fd" label="Degradation (%/yr)" value={fDeg} onChange={setFDeg} />
            <Num id="b-fom" label="Annual O&M (₹)" value={fOm} onChange={setFOm} />
            <Num id="b-fi" label="Inverter allowance (₹)" value={fInv} onChange={setFInv} />
            <Num id="b-fiy" label="Inverter replacement year" value={fInvYr} onChange={setFInvYr} />
            <Num id="b-ff" label="Annual financing cost (₹)" value={fFin} onChange={setFFin} hint="0 = cash purchase." />
            <Num id="b-finc" label="Verified incentive (₹)" value={fInc} onChange={setFInc} hint="Only if eligibility is confirmed." />
            <Num id="b-fd2" label="Discount rate (%, NPV)" value={fDisc} onChange={setFDisc} hint="Empty = no NPV computed." />
          </div>
        </details>
      </div>
      <div className="rounded-3xl bg-navy p-6 text-white sm:p-8">
        <dl className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <Result label="Preliminary size" value={`${out.roi.suggestedKw} kW`} />
          <Result label="Annual generation" value={`${out.roi.annualGeneration.toLocaleString("en-IN")} kWh`} />
          <Result label="Indicative benefit/yr" value={inr(out.roi.annualBenefit)} />
          <Result label="Scenario cost" value={inr(out.roi.systemCost)} sub="Size × your cost/kW input" />
          <Result label="Simple payback" value={out.roi.simplePaybackYears === null ? "—" : `${out.roi.simplePaybackYears} yrs`} sub="Cost ÷ annual benefit" />
          <Result label="Roof fits" value={out.core.roofFits === null ? "Unknown" : out.core.roofFits ? "Yes" : "Tight"} />
        </dl>
        <div className="mt-5 rounded-2xl border border-goldbright/30 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-goldpale">{fc.years.length}-year forecast · estimates only</p>
          <dl className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <Result label="Forecast payback" value={fc.simplePaybackYears === null ? "Not reached" : fc.simplePaybackYears === 0 ? "Immediate" : `Year ${fc.simplePaybackYears}`} sub={fc.simplePaybackYears === null ? `Within ${fc.years.length} years` : "Whole years, not a date"} />
            <Result label="Forecast ROI" value={fc.roiPct === null ? "—" : `${fc.roiPct}%`} sub="Whole-period, not annualized" />
            <Result label="NPV" value={fc.npv === null ? "—" : inr(fc.npv)} sub="Needs a discount rate" />
            <Result label="IRR" value={fc.irr === null ? "—" : `${(fc.irr * 100).toFixed(1)}%`} sub="Tested bisection solver" />
            <Result label="Cumulative net" value={inr(fc.totalNet)} sub={`After ${inr(fc.totalOperating)} operating costs`} />
            <Result label="Net investment" value={inr(fc.netInvestment)} sub="Cost minus verified incentive" />
          </dl>
          <div className="mt-4 max-h-64 overflow-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[480px] text-left text-xs">
              <caption className="sr-only">Year-by-year forecast cash flows in rupees</caption>
              <thead className="sticky top-0 bg-elevated">
                <tr className="text-white/60">
                  <th scope="col" className="px-3 py-2">Year</th>
                  <th scope="col" className="px-3 py-2 text-right">Gross</th>
                  <th scope="col" className="px-3 py-2 text-right">Costs</th>
                  <th scope="col" className="px-3 py-2 text-right">Net</th>
                  <th scope="col" className="px-3 py-2 text-right">Cumulative</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {fc.years.map((y) => (
                  <tr key={y.year} className="border-t border-white/10">
                    <th scope="row" className="px-3 py-1.5 font-bold text-white">{y.year}</th>
                    <td className="px-3 py-1.5 text-right">{inr(y.grossBenefit)}</td>
                    <td className="px-3 py-1.5 text-right">{inr(y.omCost + y.inverterCost + y.financingCost)}</td>
                    <td className="px-3 py-1.5 text-right">{inr(y.netBenefit)}</td>
                    <td className="px-3 py-1.5 text-right font-bold text-cyan">{inr(y.cumulativeNet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/55">ROI = (cumulative net − investment) ÷ investment. Real results depend on installation quality, generation, tariffs, consumption, maintenance, and policy. Incentives apply only when verified.</p>
        </div>
        <AssessmentCta />
      </div>
    </div>
  );
}

function RoofTool() {
  const [l, setL] = useState("40");
  const [w, setW] = useState("25");
  const [cov, setCov] = useState("70");
  const [pw, setPw] = useState("550");
  const [ps, setPs] = useState("27");
  const r = useMemo(() => {
    const p = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };
    return roofStudio({ lengthFt: p(l), widthFt: p(w), coveragePct: p(cov), panelWatt: p(pw), panelSqft: p(ps) });
  }, [l, w, cov, pw, ps]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Num id="r-l" label="Usable length (ft)" value={l} onChange={setL} />
          <Num id="r-w" label="Usable width (ft)" value={w} onChange={setW} />
          <Num id="r-cov" label="Coverage (%)" value={cov} onChange={setCov} hint="Setbacks, walkways, tanks." />
          <Num id="r-pw" label="Panel wattage (W)" value={pw} onChange={setPw} />
          <Num id="r-ps" label="Sq ft per panel" value={ps} onChange={setPs} />
        </div>
      </div>
      <div className="rounded-3xl bg-navy p-6 text-white sm:p-8">
        <p className="inline-block rounded-full border border-goldbright/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-goldpale">Illustrative concept — not an engineer-approved design</p>
        <dl className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <Result label="Usable area" value={`${r.usableSqft} sq ft`} sub={`of ${r.grossSqft} gross`} />
          <Result label="Max panels" value={`${r.maxPanels}`} />
          <Result label="Preliminary capacity" value={`${r.capacityKwp} kWp`} />
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-white/60">Orientation, shade, parapets, and structure can only be judged on site. Final layout and equipment follow the survey.</p>
        <AssessmentCta />
      </div>
    </div>
  );
}

function BillTool() {
  const [bill, setBill] = useState("6000");
  const [tariff, setTariff] = useState("7.5");
  const [days, setDays] = useState("60");
  const [fixed, setFixed] = useState("200");
  const r = useMemo(() => {
    const p = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };
    return billAnalysis({ billAmount: p(bill), tariff: p(tariff), billingDays: p(days), fixedCharges: p(fixed) });
  }, [bill, tariff, days, fixed]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Num id="bl-bill" label="Bill amount (₹)" value={bill} onChange={setBill} />
          <Num id="bl-tariff" label="Tariff (₹/kWh)" value={tariff} onChange={setTariff} />
          <Num id="bl-days" label="Billing period (days)" value={days} onChange={setDays} hint="Tamil Nadu bills are often 60 days." />
          <Num id="bl-fixed" label="Fixed + demand + taxes (₹)" value={fixed} onChange={setFixed} hint="Stays payable; solar offsets energy only." />
        </div>
      </div>
      <div className="rounded-3xl bg-navy p-6 text-white sm:p-8">
        <dl className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <Result label="Energy consumed" value={`${r.energyUnits.toLocaleString("en-IN")} kWh`} sub={`${r.unitsPerDay}/day avg`} />
          <Result label="Energy charge" value={`₹${r.energyCharge.toLocaleString("en-IN")}`} />
          <Result label="Solar-offsettable" value={`₹${r.solarOffsettable.toLocaleString("en-IN")}`} sub="Energy portion only" />
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-white/60">This tool reads the numbers you type — it does not scan or verify your bill. Bring 3–6 months of bills to the survey for a real load picture.</p>
        <AssessmentCta />
      </div>
    </div>
  );
}

function BatteryTool() {
  const [kw, setKw] = useState("2");
  const [hrs, setHrs] = useState("4");
  const [dod, setDod] = useState("80");
  const r = useMemo(() => {
    const p = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };
    return batteryPlan({ criticalLoadKw: p(kw), backupHours: p(hrs), depthOfDischarge: p(dod) / 100, daysAutonomy: 1 });
  }, [kw, hrs, dod]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Num id="bt-kw" label="Critical load (kW = power)" value={kw} onChange={setKw} hint="Essentials only, not the whole house." />
          <Num id="bt-hrs" label="Backup wanted (hours)" value={hrs} onChange={setHrs} />
          <Num id="bt-dod" label="Usable depth (%)" value={dod} onChange={setDod} hint="≈80 lithium, ≈50 tubular." />
        </div>
        <p className="mt-4 text-sm text-slate"><strong className="text-navy">kW is power</strong> (how much at once), <strong className="text-navy">kWh is energy</strong> (how much over time). A 2 kW load for 4 hours needs 8 kWh of stored energy — simplified, before inverter and ageing losses the survey will add.</p>
      </div>
      <div className="rounded-3xl bg-navy p-6 text-white sm:p-8">
        <dl className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <Result label="Energy needed" value={`${r.energyNeededKwh} kWh`} />
          <Result label="Battery nameplate" value={`${r.batteryKwh} kWh`} sub="After depth-of-discharge" />
          <Result label="Min. inverter size" value={`${r.inverterKw} kW`} sub="25% headroom" />
        </dl>
        <AssessmentCta />
      </div>
    </div>
  );
}

export function SolarStudio() {
  const [tab, setTab] = useState<TabId>("home");
  return (
    <div>
      <div role="tablist" aria-label="Solar planning tools" className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button key={t.id} type="button" role="tab" aria-selected={on} aria-controls={`studio-${t.id}`} id={`studio-tab-${t.id}`} onClick={() => setTab(t.id)}
              className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${on ? "border-goldbright bg-coal text-goldpale" : "border-line bg-white text-ink hover:border-goldbright"}`}>
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="mt-6" role="tabpanel" id={`studio-${tab}`} aria-labelledby={`studio-tab-${tab}`}>
        <Reveal key={tab}>
          {tab === "home" && <SolarCalculator />}
          {tab === "business" && <BusinessTool />}
          {tab === "roof" && <RoofTool />}
          {tab === "bill" && <BillTool />}
          {tab === "battery" && <BatteryTool />}
        </Reveal>
      </div>
    </div>
  );
}
