"use client";
import { useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { track } from "@/lib/analytics";
import { EXTERNAL_FORM_ENDPOINT, STATIC_PREVIEW, STATIC_NO_BACKEND_NOTICE, resolveFormEndpoint } from "@/lib/form-endpoint";
import { supportCategories } from "@/content/support";
import type { SupportCategory } from "@/lib/validation";

export function SupportForm({ initialCategory = "general" as SupportCategory }: { initialCategory?: SupportCategory }) {
  const [category, setCategory] = useState<SupportCategory>(initialCategory);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ref, setRef] = useState("");
  const [failNotice, setFailNotice] = useState("");
  const sendingRef = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendingRef.current) return;
    // GitHub Pages static build without a connected backend: never pretend —
    // show the explicit notice instead of a doomed network call.
    const endpoint = resolveFormEndpoint("/api/support-requests");
    if (!endpoint) {
      setStatus("fail");
      setErrors({});
      setFailNotice(STATIC_NO_BACKEND_NOTICE);
      return;
    }
    sendingRef.current = true;
    setStatus("sending"); setErrors({}); setFailNotice("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = { ...Object.fromEntries(fd.entries()), category };
    try {
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("fail");
        sendingRef.current = false;
        if (json.errors) setErrors(json.errors);
        return;
      }
      setStatus("ok"); setRef(String(json.id || ""));
      track("service_request_submitted");
      sendingRef.current = false;
      form.reset();
    } catch {
      setStatus("fail");
      sendingRef.current = false;
    }
  }

  if (status === "ok") {
    return (
      <div role="status" className="rounded-3xl border border-line bg-white p-8 text-center shadow-xl">
        <CheckCircle2 size={40} className="mx-auto text-royal" aria-hidden="true" />
        <h2 className="font-display mt-4 text-2xl font-extrabold text-navy">Support request submitted</h2>
        <p className="mt-2 text-slate">Reference <strong className="text-navy">{ref}</strong> — keep it for follow-ups. Our team reviews requests in the order received and contacts you.</p>
      </div>
    );
  }

  const err = (k: string) => errors[k] ? <p role="alert" id={`sf-${k}-err`} className="mt-1 text-sm font-semibold text-red-700">{errors[k]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={status === "sending"} className="grid gap-4" aria-label="Customer support request form">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <span id="sf-category" className="mb-1.5 block text-sm font-bold text-navy">Support category *</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-labelledby="sf-category">
          {supportCategories.map((c) => (
            <button key={c.id} type="button" onClick={() => setCategory(c.id)} aria-pressed={category === c.id} title={c.short} className={`rounded-2xl border-2 px-3 py-2.5 text-sm font-bold transition ${category === c.id ? "border-royal bg-mist text-navy" : "border-line bg-white text-ink hover:border-royal/50"}`}>
              {c.title}
            </button>
          ))}
        </div>
        {err("category")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-name" className="mb-1.5 block text-sm font-bold text-navy">Full name *</label>
          <input id="sf-name" name="name" required autoComplete="name" placeholder="e.g. Karthik Raja" className="field" aria-describedby={errors.name ? "sf-name-err" : undefined} aria-invalid={errors.name ? true : undefined} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="sf-phone" className="mb-1.5 block text-sm font-bold text-navy">Mobile *</label>
          <input id="sf-phone" name="phone" required inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" className="field" aria-describedby={errors.phone ? "sf-phone-err" : undefined} aria-invalid={errors.phone ? true : undefined} />
          {err("phone")}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-email" className="mb-1.5 block text-sm font-bold text-navy">Email (optional)</label>
          <input id="sf-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="field" aria-describedby={errors.email ? "sf-email-err" : undefined} aria-invalid={errors.email ? true : undefined} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="sf-pin" className="mb-1.5 block text-sm font-bold text-navy">Site PIN (optional)</label>
          <input id="sf-pin" name="pincode" inputMode="numeric" placeholder="600070" className="field" aria-describedby={errors.pincode ? "sf-pincode-err" : undefined} aria-invalid={errors.pincode ? true : undefined} />
          {err("pincode")}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sf-ref" className="mb-1.5 block text-sm font-bold text-navy">Project reference (optional)</label>
          <input id="sf-ref" name="reference" placeholder="From handover documents" className="field" aria-describedby={errors.reference ? "sf-reference-err" : undefined} aria-invalid={errors.reference ? true : undefined} />
          {err("reference")}
        </div>
        <div>
          <label htmlFor="sf-pref" className="mb-1.5 block text-sm font-bold text-navy">Preferred contact</label>
          <select id="sf-pref" name="contactPref" defaultValue="phone" className="field">
            <option value="phone">Phone call</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="sf-msg" className="mb-1.5 block text-sm font-bold text-navy">Describe your request *</label>
        <textarea id="sf-msg" name="message" required rows={5} placeholder="What happened, when it started, error codes, what you need…" className="field" aria-describedby={errors.message ? "sf-msg-err" : undefined} aria-invalid={errors.message ? true : undefined} />
        {err("message")}
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold disabled:cursor-not-allowed disabled:opacity-60">
        {status === "sending" && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {status === "sending" ? "Submitting…" : "Submit Support Request"}
      </button>
      {status === "fail" && <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />{failNotice || "Not confirmed — nothing was stored. Check errors above or retry; your entries are preserved."}</p>}
      {STATIC_PREVIEW && !EXTERNAL_FORM_ENDPOINT && (
        <p className="rounded-xl border border-line bg-mist px-4 py-3 text-xs font-semibold text-slate">Static preview — this host has no support-request backend, so the form cannot submit here. Please call or email us instead.</p>
      )}
      <p className="text-xs text-slate">We use your details only to handle this request. See <a className="underline" href="/privacy-policy">Privacy</a>.</p>
    </form>
  );
}
