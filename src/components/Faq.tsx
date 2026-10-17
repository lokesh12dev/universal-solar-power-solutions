"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white overflow-hidden">
      {items.map((f, i) => {
        const is = open === i;
        return (
          <div key={i}>
            <h3 className="m-0 text-base">
              <button type="button" onClick={() => setOpen(is ? null : i)} aria-expanded={is} aria-controls={`faq-p-${i}`} id={`faq-b-${i}`} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-navy hover:bg-ice">
                {f.q}
                <span aria-hidden="true" data-open={is ? "true" : "false"} className={`faq-dot grid h-8 w-8 shrink-0 place-items-center rounded-full ${is ? "bg-navy text-cyan" : "bg-ice text-royal border border-line"}`}>
                  <Plus size={16} aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} hidden={!is} className="px-6 pb-6 text-slate leading-relaxed">
              {f.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
