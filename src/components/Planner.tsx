"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Loader2, Home, Building2, Factory } from "lucide-react";
import { goalLabels, goalToService, composePlannerMessage, type PlannerSummary } from "@/lib/planner";
import type { PlannerGoal } from "@/lib/validation";
import { track } from "@/lib/analytics";

const STEPS = ["Property", "Usage", "Location", "Goal", "Consultation"] as const;
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const PIN_RE = /^[1-9][0-9]{5}$/;

export function Planner() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [propertyType, setPropertyType] = useState<PlannerSummary["propertyType"]>("residential");
  const [monthlyBill, setMonthlyBill] = useState("");
  const [monthlyUnits, setMonthlyUnits] = useState("");
  const [pincode, setPincode] = useState("");
  const [goal, setGoal] = useState<PlannerGoal>("new-installation");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [ref, setRef] = useState("");

  function validateStep(s: number): string {
    if (s === 1 && monthlyBill && !/^\d{1,7}$/.test(monthlyBill.trim())) return "Enter the monthly bill as digits, or leave it blank.";
    if (s === 1 && monthlyUnits && !/^\d{1,6}$/.test(monthlyUnits.trim())) return "Enter consumption as digits, or leave it blank.";
    if (s === 2 && !PIN_RE.test(pincode.trim())) return "Enter a valid 6-digit PIN code.";
    if (s === 4) {
      if (name.trim().length < 2) return "Enter your full name.";
      if (!PHONE_RE.test(phone.trim())) return "Enter a valid 10-digit Indian mobile number.";
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email, or leave it blank.";
    }
    return "";
  }

  function next() {
    const e = validateStep(step);
    if (e) { setError(e); return; }
    setError("");
    if (step === 3) track("planner_complete");
    setStep((v) => Math.min(v + 1, STEPS.length - 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const v = validateStep(4);
    if (v) { setError(v); return; }
    setError(""); setStatus("sending");
    try {
      const summary: PlannerSummary = { propertyType, monthlyBill: monthlyBill.trim(), monthlyUnits: monthlyUnits.trim(), pincode: pincode.trim(), goal };
      const res = await fetch("/api/enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(), phone: phone.trim(), email: email.trim(),
            propertyType, service: goalToService(goal), pincode: pincode.trim(),
            monthlyBill: monthlyBill.trim(), monthlyUnits: monthlyUnits.trim(), message: composePlannerMessage(summary),
            goal, source: "planner", company: "",
          }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("fail");
        setError(json.message || "Submission failed. Your entries above are preserved — please retry or call us.");
        return;
      }
      setStatus("ok"); setRef(String(json.id || ""));
      track("consultation_request");
    } catch {
      setStatus("fail");
      setError("Network error. Your entries are preserved — please retry or call us directly.");
    }
  }

  if (!started) {
    return (
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-royal">Solar Project Planner</p>
        <h2 className="font-display mx-auto mt-3 max-w-xl text-balance text-3xl font-extrabold text-navy sm:text-4xl">Your solar journey starts here</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate">Answer 4 short questions. Get an organised project summary and a direct line to our team — no account, no spam.</p>
        <button type="button" onClick={() => { setStarted(true); track("planner_start"); }} className="btn-primary mt-7 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-bold">
          Plan My Solar System <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-xl" role="status">
        <CheckCircle2 size={40} className="mx-auto text-royal" aria-hidden="true" />
        <h2 className="font-display mt-4 text-2xl font-extrabold text-navy">Consultation requested</h2>
        <p className="mt-2 text-slate">Your project summary reached our team with reference <strong className="text-navy">{ref}</strong>. We aim to call back within one working day.</p>
        <p className="mt-2 text-sm text-slate">Keep this reference for follow-ups.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[1.6rem] border border-line bg-white p-6 shadow-xl sm:p-9">
      <div role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
      <ol className="flex items-center gap-1.5" aria-label="Planner progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <span className="sr-only">{s}{i === step ? " (current)" : ""}</span>
            <span aria-hidden="true" className={`block h-1.5 rounded-full ${i <= step ? "bg-gradient-to-r from-royal to-electric" : "bg-line"}`} />
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-royal">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
      </div>

      {step === 0 && (
        <div role="group" aria-label="Property type" className="mt-5 grid gap-3 sm:grid-cols-3">
          {([["residential", "Residential", Home], ["commercial", "Commercial", Building2], ["industrial", "Industrial", Factory]] as const).map(([v, l, Icon]) => (
            <button key={v} type="button" onClick={() => setPropertyType(v)} aria-pressed={propertyType === v} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 font-bold transition ${propertyType === v ? "border-royal bg-mist text-navy" : "border-line bg-white text-ink hover:border-royal/50"}`}>
              <Icon size={26} aria-hidden="true" className={propertyType === v ? "text-royal" : "text-slate"} />{l}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pl-bill" className="mb-1.5 block text-sm font-bold text-navy">Monthly electricity bill (₹)</label>
            <input id="pl-bill" value={monthlyBill} onChange={(e) => setMonthlyBill(e.target.value)} inputMode="numeric" placeholder="e.g. 3000" className="field" />
          </div>
          <div>
            <label htmlFor="pl-units" className="mb-1.5 block text-sm font-bold text-navy">Consumption (kWh/month, if known)</label>
            <input id="pl-units" value={monthlyUnits} onChange={(e) => setMonthlyUnits(e.target.value)} inputMode="numeric" placeholder="Optional" className="field" />
          </div>
          <p className="text-sm text-slate sm:col-span-2">One of the two is enough. Find both on your electricity bill.</p>
        </div>
      )}

      {step === 2 && (
        <div className="mt-5">
          <label htmlFor="pl-pin" className="mb-1.5 block text-sm font-bold text-navy">Site PIN code</label>
          <input id="pl-pin" value={pincode} onChange={(e) => setPincode(e.target.value)} inputMode="numeric" placeholder="600070" className="field max-w-xs" />
          <p className="mt-2 text-sm text-slate">We confirm feasibility for your area after you submit.</p>
        </div>
      )}

      {step === 3 && (
        <div role="group" aria-label="Project goal" className="mt-5 grid gap-3">
          {(Object.keys(goalLabels) as PlannerGoal[]).map((g) => (
            <button key={g} type="button" onClick={() => setGoal(g)} aria-pressed={goal === g} className={`rounded-2xl border-2 p-4 text-left font-bold transition ${goal === g ? "border-royal bg-mist text-navy" : "border-line bg-white text-ink hover:border-royal/50"}`}>
              {goalLabels[g]}
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <form onSubmit={submit} noValidate className="mt-5" aria-label="Planner consultation request">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <dl className="rounded-2xl border border-line bg-ice p-4 text-sm">
            <div className="flex justify-between gap-3 py-1"><dt className="text-slate">Property</dt><dd className="font-bold text-navy capitalize">{propertyType}</dd></div>
            <div className="flex justify-between gap-3 py-1"><dt className="text-slate">Bill / usage</dt><dd className="font-bold text-navy">{monthlyBill ? `₹${monthlyBill}` : "—"}{monthlyUnits ? ` · ${monthlyUnits} kWh` : ""}</dd></div>
            <div className="flex justify-between gap-3 py-1"><dt className="text-slate">PIN</dt><dd className="font-bold text-navy">{pincode}</dd></div>
            <div className="flex justify-between gap-3 py-1"><dt className="text-slate">Goal</dt><dd className="text-right font-bold text-navy">{goalLabels[goal]}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-slate">Figures above are your inputs (unverified) — the final proposal follows a site survey.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pl-name" className="mb-1.5 block text-sm font-bold text-navy">Full name *</label>
              <input id="pl-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Karthik Raja" className="field" />
            </div>
            <div>
              <label htmlFor="pl-phone" className="mb-1.5 block text-sm font-bold text-navy">Mobile *</label>
              <input id="pl-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" className="field" />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="pl-email" className="mb-1.5 block text-sm font-bold text-navy">Email (optional)</label>
            <input id="pl-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className="field" />
          </div>
          <button type="submit" disabled={status === "sending"} className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold disabled:opacity-60 sm:w-auto">
            {status === "sending" && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
            {status === "sending" ? "Sending…" : "Request My Solar Consultation"}
          </button>
          <p className="mt-3 text-xs text-slate">We use your details only to respond to this request. See <a className="underline" href="/privacy-policy">Privacy</a>.</p>
        </form>
      )}

      {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{error}</p>}
      {status === "fail" && !error && <p role="alert" className="mt-4 text-sm font-semibold text-red-800">Submission failed — your entries are preserved. Please retry.</p>}

      {step < 4 && (
        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={() => { setError(""); setStep((v) => Math.max(v - 1, 0)); }} disabled={step === 0} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-5 py-2.5 font-bold text-navy disabled:opacity-40">
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>
          <button type="button" onClick={next} className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-6 py-2.5 font-bold">
            Next <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      {step === 4 && (
        <button type="button" onClick={() => { setError(""); setStep(3); }} className="mt-4 inline-flex items-center gap-1.5 font-bold text-royal">
          <ArrowLeft size={16} aria-hidden="true" /> Back to goal
        </button>
      )}
    </div>
  );
}
