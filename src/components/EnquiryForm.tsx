"use client";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

type Props = { compact?: boolean };

function clientValidate(v: Record<string, string>): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!v.name || v.name.trim().length < 2) errs.name = "Enter your full name";
  if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test((v.phone || "").trim()))
    errs.phone = "Enter a valid 10-digit Indian mobile number";
  const email = (v.email || "").trim();
  if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Enter a valid email";
  if (!/^[1-9][0-9]{5}$/.test((v.pincode || "").trim()))
    errs.pincode = "Enter a valid 6-digit PIN code";
  const bill = (v.monthlyBill || "").trim();
  if (bill !== "" && !/^\d{1,7}$/.test(bill))
    errs.monthlyBill = "Enter monthly bill as digits";
  if ((v.message || "").trim().length > 1000)
    errs.message = "Keep details under 1000 characters";
  return errs;
}

export function EnquiryForm({ compact }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const startedRef = useRef(false);
  const busyRef = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Duplicate-submit guard: ignore while a submission is in flight.
    if (busyRef.current || status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body: Record<string, string> = {};
    for (const [k, v] of fd.entries()) body[k] = String(v);

    // Client-side validation (mirrors server zod rules) — no network on bad input.
    const clientErrors = clientValidate(body);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus("fail"); track("lead_form_fail");
      setResult("Please fix the highlighted fields.");
      return;
    }

    busyRef.current = true;
    setStatus("sending"); track("lead_form_submit");
    setErrors({});
    setResult("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let json: { message?: string; errors?: Record<string, string>; id?: string; emailSent?: boolean } | null = null;
      try {
        json = await res.json();
      } catch {
        setStatus("fail"); track("lead_form_fail");
        setResult("Submission failed. Please call us directly.");
        return;
      }
      if (!res.ok || !json) {
        // Never show fake success — any non-2xx is a failure with server errors.
        setStatus("fail"); track("lead_form_fail");
        if (json?.errors) setErrors(json.errors);
        setResult(json?.message || "Submission failed. Please call us directly.");
        return;
      }
      setStatus("ok"); track("lead_form_success");
      setErrors({});
      setResult(
        json.emailSent
          ? "Enquiry received — our team will call you shortly. (Email notification sent.)"
          : "Enquiry received — our team will call you shortly. Reference: " + (json.id ?? "received")
      );
      form.reset();
    } catch {
      setStatus("fail"); track("lead_form_fail");
      setResult("Network error. Please call us directly.");
    } finally {
      busyRef.current = false;
    }
  }

  const f = (n: string) => ({
    name: n,
    id: `eq-${n}`,
    "aria-invalid": errors[n] ? (true as const) : undefined,
    "aria-describedby": errors[n] ? `eq-${n}-err` : undefined,
  } as const);

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} onFocusCapture={() => { if (!startedRef.current) { startedRef.current = true; track("lead_form_start"); } }} noValidate className="grid gap-4" aria-label="Solar consultation enquiry form">
      {/* honeypot — hidden from sighted + AT users via display:none; no label needed */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2 *:min-w-0">
        <div>
          <label htmlFor="eq-name" className="mb-1.5 block text-sm font-bold text-navy">Full name *</label>
          <input {...f("name")} required placeholder="e.g. Karthik Raja" className="field" autoComplete="name" />
          {errors.name && <p id="eq-name-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="eq-phone" className="mb-1.5 block text-sm font-bold text-navy">Mobile *</label>
          <input {...f("phone")} required inputMode="tel" placeholder="10-digit mobile" className="field" autoComplete="tel" />
          {errors.phone && <p id="eq-phone-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 *:min-w-0">
        <div>
          <label htmlFor="eq-email" className="mb-1.5 block text-sm font-bold text-navy">Email (optional)</label>
          <input {...f("email")} type="email" placeholder="you@example.com" className="field" autoComplete="email" />
          {errors.email && <p id="eq-email-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="eq-pincode" className="mb-1.5 block text-sm font-bold text-navy">PIN code *</label>
          <input {...f("pincode")} required inputMode="numeric" placeholder="600070" className="field" autoComplete="postal-code" />
          {errors.pincode && <p id="eq-pincode-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.pincode}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 *:min-w-0">
        <div>
          <label htmlFor="eq-propertyType" className="mb-1.5 block text-sm font-bold text-navy">Property *</label>
          <select {...f("propertyType")} className="field" defaultValue="residential">
            <option value="residential">Residential</option><option value="commercial">Commercial</option><option value="industrial">Industrial</option>
          </select>
          {errors.propertyType && <p id="eq-propertyType-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.propertyType}</p>}
        </div>
        <div>
          <label htmlFor="eq-service" className="mb-1.5 block text-sm font-bold text-navy">Need *</label>
          <select {...f("service")} className="field" defaultValue="new-installation">
            <option value="new-installation">New installation</option><option value="maintenance">Maintenance</option><option value="re-engineering">Fix / upgrade plant</option><option value="consultation">Consultation</option>
          </select>
          {errors.service && <p id="eq-service-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.service}</p>}
        </div>
        <div>
          <label htmlFor="eq-monthlyBill" className="mb-1.5 block text-sm font-bold text-navy">Monthly bill ₹ (optional)</label>
          <input {...f("monthlyBill")} inputMode="numeric" placeholder="e.g. 3000" className="field" />
          {errors.monthlyBill && <p id="eq-monthlyBill-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.monthlyBill}</p>}
        </div>
      </div>
      {!compact && (
        <div>
          <label htmlFor="eq-message" className="mb-1.5 block text-sm font-bold text-navy">Roof & requirements (optional)</label>
          <textarea {...f("message")} rows={4} placeholder="Roof size, floors, shade, sanctioned load, anything else…" className="field" />
          {errors.message && <p id="eq-message-err" role="alert" className="mt-1 text-sm font-semibold text-red-700">{errors.message}</p>}
        </div>
      )}
      <button type="submit" disabled={sending} aria-busy={sending} className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {sending && <Loader2 aria-hidden="true" className="animate-spin" size={18} />}
        {sending ? "Sending…" : "Request a Solar Consultation"}
      </button>
      {status === "ok" && <p role="status" className="flex items-start gap-2 rounded-2xl bg-royal p-4 font-semibold text-cyan"><CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />{result}</p>}
      {status === "fail" && <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 p-4 font-semibold text-red-800"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0" size={18} />{result}</p>}
      <p className="text-xs text-slate">By submitting you agree to be contacted about your enquiry. We never publish your details. See <a className="underline" href="/privacy-policy">Privacy</a>.</p>
    </form>
  );
}
