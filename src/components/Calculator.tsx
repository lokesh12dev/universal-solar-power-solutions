"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { runCalculator, defaultAssumptions } from "@/lib/calculator";
import { track } from "@/lib/analytics";
import { Calculator, Sun, Home, Factory, Building2 } from "lucide-react";

export function SolarCalculator() {
  const [bill, setBill] = useState("3000");
  const [tariff, setTariff] = useState("7.5");
  const [unitsKnown, setUnitsKnown] = useState("");
  const [type, setType] = useState<"residential"|"commercial"|"industrial">("residential");
  const [roof, setRoof] = useState("1000");
  const [sys, setSys] = useState<"on-grid"|"hybrid">("on-grid");
  const [yieldV, setYieldV] = useState(String(defaultAssumptions.specificYield));
  const [sqft, setSqft] = useState(String(defaultAssumptions.sqftPerKw));

  // Documented valid ranges (also enforced server-side by lib hardening).
  // Yield is a Chennai-average figure that already includes ordinary system
  // losses; extra shade/orientation penalties are survey items, not modelled here.
  const RANGES = {
    bill: { min: 0, max: 200000, label: "Monthly bill" },
    tariff: { min: 0, max: 30, label: "Tariff" },
    units: { min: 0, max: 50000, label: "Units/month" },
    roof: { min: 0, max: 100000, label: "Usable roof" },
    yield: { min: 800, max: 2200, label: "Yield" },
    sqft: { min: 60, max: 150, label: "Sq ft per kW" },
  } as const;

  const check = (raw: string, r: { min: number; max: number; label: string }, opts?: { optional?: boolean }): string | null => {
    const t = raw.trim();
    if (t === "") return opts?.optional ? null : null; // empty optional = unset; required empties coerce to 0 downstream
    const n = Number(t);
    if (!Number.isFinite(n)) return `${r.label}: enter a number, not text or Infinity.`;
    if (n < r.min || n > r.max) return `${r.label}: enter ${r.min}–${r.max}.`;
    return null;
  };

  const fieldErrors: Record<string, string | null> = {
    bill: check(bill, RANGES.bill),
    tariff: check(tariff, RANGES.tariff),
    units: check(unitsKnown, RANGES.units, { optional: true }),
    roof: check(roof, RANGES.roof, { optional: true }),
    yield: check(yieldV, RANGES.yield),
    sqft: check(sqft, RANGES.sqft),
  };

  const result = useMemo(() => {
    const yP = parseFloat(yieldV);
    const sP = parseFloat(sqft);
    return runCalculator({
    monthlyBill: Number.isFinite(parseFloat(bill)) ? parseFloat(bill) : 0,
    tariff: Number.isFinite(parseFloat(tariff)) ? parseFloat(tariff) : 0,
    monthlyUnitsKnown: Number.isFinite(parseFloat(unitsKnown)) ? parseFloat(unitsKnown) : undefined,
    propertyType: type,
    roofSqft: Number.isFinite(parseFloat(roof)) ? parseFloat(roof) : undefined,
    systemType: sys,
    }, {
      ...defaultAssumptions,
      specificYield: parseFloat(yieldV) >= 0 && Number.isFinite(yP) ? yP : defaultAssumptions.specificYield,
      sqftPerKw: parseFloat(sqft) >= 0 && Number.isFinite(sP) ? sP : defaultAssumptions.sqftPerKw,
    });
  }, [bill, tariff, unitsKnown, type, roof, sys, yieldV, sqft]);

  // "Completed" = user adjusted inputs and holds a valid estimate.
  // Fires once per mount; never on initial defaults alone, never with PII.
  const interactedRef = useRef(false);
  const completedRef = useRef(false);
  useEffect(() => {
    if (!completedRef.current && interactedRef.current && result.suggestedKw > 0) {
      completedRef.current = true;
      track("calculator_completed");
    }
  }, [result.suggestedKw]);
  const touch =
    <T,>(set: (v: T) => void) =>
    (v: T): void => {
      interactedRef.current = true;
      set(v);
    };

  const num = (id: string, label: string, val: string, set: (v: string) => void, errKey?: keyof typeof fieldErrors) => {
    const err = errKey ? fieldErrors[errKey] : null;
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy">{label}</label>
        <input id={id} type="number" step="any" min="0" value={val} onChange={(e) => touch(set)(e.target.value)} inputMode="decimal" className="field" aria-invalid={err ? true : undefined} aria-describedby={err ? `${id}-err` : undefined} />
        {err && <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-semibold text-red-700">{err}</p>}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xl">
        <p className="flex items-center gap-2 font-display text-xl font-extrabold text-navy"><Calculator size={22} aria-hidden="true" /> Your details</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {num("c-bill", "Monthly bill (₹)", bill, setBill, "bill")}
          {num("c-tariff", "Tariff (₹/kWh)", tariff, setTariff, "tariff")}
          {num("c-units", "Units/month (optional)", unitsKnown, setUnitsKnown, "units")}
          {num("c-roof", "Usable roof (sq ft, optional)", roof, setRoof, "roof")}
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <span className="mb-1.5 block text-sm font-bold text-navy" id="c-type-l">Property</span>
            <div role="group" aria-labelledby="c-type-l" className="grid grid-cols-3 gap-2">
              {[["residential","Home",Home],["commercial","Biz",Building2],["industrial","Ind",Factory]].map(([v,l,Icon]: any) => (
                <button key={v} type="button" onClick={() => touch(setType)(v)} aria-pressed={type===v} className={`flex min-w-0 items-center justify-center gap-1 rounded-full border px-2 py-2.5 text-[13px] font-bold sm:gap-1.5 sm:px-3 sm:text-sm ${type===v?"border-royal bg-navy text-cyan":"border-line bg-ice text-ink"}`}>
                  <Icon size={15} aria-hidden="true" className="shrink-0" /><span className="truncate">{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-bold text-navy" id="c-sys-l">System</span>
            <div role="group" aria-labelledby="c-sys-l" className="grid grid-cols-2 gap-2">
              {(["on-grid","hybrid"] as const).map((v) => (
                <button key={v} type="button" onClick={() => touch(setSys)(v)} aria-pressed={sys===v} className={`rounded-full border px-3 py-2.5 text-sm font-bold ${sys===v?"border-royal bg-navy text-cyan":"border-line bg-ice text-ink"}`}>{v}</button>
              ))}
            </div>
          </div>
        </div>
        <details className="mt-5 rounded-2xl bg-ice p-4 text-sm">
          <summary className="cursor-pointer font-bold text-royal">Edit assumptions (transparent)</summary>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {num("c-yield", "Yield kWh/kW/yr", yieldV, setYieldV, "yield")}
            {num("c-sqft", "Sq ft per kW", sqft, setSqft, "sqft")}
          </div>
          <p className="mt-2 text-slate">Defaults: Chennai ~1500 kWh/kW/yr, 100 sq ft/kW, 85% value factor. Change them — results update live.</p>
        </details>
      </div>
      <div className="rounded-3xl bg-navy p-6 sm:p-8 text-white shadow-2xl grain relative overflow-hidden">
        <p className="flex items-center gap-2 font-display text-xl font-extrabold text-cyan"><Sun size={22} aria-hidden="true" /> Indicative result</p>
        <p className="sr-only" aria-live="polite">Suggested {result.suggestedKw} kW, generates about {result.annualGeneration} kWh per year, needs {result.roofNeeded} square feet.</p>
        {Object.values(fieldErrors).some(Boolean) && (
          <p role="alert" className="mt-4 rounded-2xl bg-amber-400/15 p-3 text-sm font-bold text-amber-200">
            Some inputs are outside the valid ranges — the result below uses safe fallbacks. Fix the highlighted fields for an accurate estimate.
          </p>
        )}
        <dl className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          {[[`${result.monthlyUnits} kWh`,"Monthly use"],[`${result.suggestedKw} kW`,"Suggested size"],[`${result.annualGeneration.toLocaleString("en-IN")} kWh`,"Annual generation"],[`₹${result.annualSavingsYear1.toLocaleString("en-IN")}`,"Year-1 savings*"],[`${result.roofNeeded} sq ft`,"Roof needed"],[`${result.co2AvoidedTpa} t`,"CO₂ avoided/yr"]].map(([v,l]) => (
            <div key={l} className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <dt className="text-[11px] uppercase tracking-widest text-white/60 sm:text-xs">{l}</dt>
              <dd className="font-display mt-1 break-words text-lg font-extrabold text-cyan text-glow sm:text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
        {result.roofFits === false && <p role="alert" className="mt-4 rounded-2xl bg-red-500/15 p-3 text-sm font-bold text-red-200">Your usable roof looks smaller than needed — a smaller system or ground area may be required. Survey will confirm.</p>}
        {result.roofFits === true && <p className="mt-4 rounded-2xl bg-cyan/15 p-3 text-sm font-bold text-cyan">Good — your roof area appears sufficient for this size.</p>}
        <p className="mt-4 text-xs leading-relaxed text-white/60">* Indicative only. Assumes 85% value of generation at your tariff; excludes net-metering caps, shade, tariff changes and battery cost for hybrid. Not a quotation or engineering design.</p>
        <a href="/contact" className="glow-btn mt-5 inline-flex max-w-full flex-wrap rounded-full bg-cyan px-6 py-3 text-center font-extrabold text-navy">Get surveyed proposal →</a>
      </div>
    </div>
  );
}
