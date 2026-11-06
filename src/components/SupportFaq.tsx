"use client";
import { useMemo, useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { supportFaqs, supportFaqCategories } from "@/content/support";

export function SupportFaq() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(0);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return supportFaqs.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (!needle) return true;
      return f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle);
    });
  }, [q, cat]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <label htmlFor="support-search" className="sr-only">Search support answers</label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" aria-hidden="true" />
          <input id="support-search" value={q} onChange={(e) => { setQ(e.target.value); setOpen(0); }} placeholder="Search questions and answers…" className="field pl-11" autoComplete="off" />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate hover:text-navy">
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {[{ id: "all", label: "All" }, ...supportFaqCategories].map((c) => (
            <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={`rounded-full px-4 py-2 text-sm font-bold transition ${cat === c.id ? "bg-navy text-white" : "border border-line bg-white text-ink hover:border-royal"}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-white p-8 text-center">
          <p className="font-bold text-navy">No answers match “{q}”.</p>
          <p className="mt-1 text-sm text-slate">Try fewer words, or submit a support request below — a person will answer.</p>
          <button type="button" onClick={() => { setQ(""); setCat("all"); }} className="mt-4 font-bold text-royal underline-offset-4 hover:underline">Clear search & filters</button>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
          {results.map((f, i) => {
            const is = open === i;
            return (
              <div key={`${f.category}-${i}`}>
                <h3 className="m-0 text-base">
                  <button type="button" onClick={() => setOpen(is ? null : i)} aria-expanded={is} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-navy hover:bg-ice">
                    {f.q}
                    <span aria-hidden="true" data-open={is ? "true" : "false"} className={`faq-dot grid h-8 w-8 shrink-0 place-items-center rounded-full ${is ? "bg-navy text-white" : "border border-line bg-ice text-royal"}`}>
                      <Plus size={16} aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <div hidden={!is} className="px-6 pb-6 leading-relaxed text-slate">{f.a}</div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-3 text-sm text-slate" role="status">{results.length} of {supportFaqs.length} answers shown.</p>
    </div>
  );
}
