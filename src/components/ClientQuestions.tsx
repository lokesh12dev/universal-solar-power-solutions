"use client";
import { useState } from "react";
import { Container } from "@/components/ui";
import { Sequence, Step } from "@/components/effects";

/* ClientQuestions — premium dark FAQ accordion ("Clear Answers. Better
   Decisions."). Six expandable rows, accessible button/region pattern,
   plus→minus icon, smooth height transition (grid-rows), reduced-motion
   friendly (CSS-only transitions, no JS animation loop). */

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Why do we need a new website?",
    a: "A professional website helps customers understand our solar solutions, explore our services, and contact our team easily. The redesign focuses on clearer information, improved usability, faster performance, and a stronger foundation for business growth.",
  },
  {
    q: "What makes this design different?",
    a: "The design combines a distinctive visual identity, premium typography, high-quality solar imagery, smooth animations, and intuitive navigation. Every section should feel consistent, purposeful, and easy to understand.",
  },
  {
    q: "How will the website help attract customers?",
    a: "Search-friendly content, relevant service pages, clear calls to action, and simple enquiry forms help potential customers discover our services and contact us. Analytics can help measure traffic, enquiries, and conversion performance.",
  },
  {
    q: "Will the website work on mobile devices?",
    a: "Yes. The website will use responsive layouts designed for mobile phones, tablets, laptops, and desktop screens. Navigation, forms, images, animations, and text will be tested across different screen sizes.",
  },
  {
    q: "How will we measure success?",
    a: "We can track website traffic, enquiry submissions, contact-button clicks, conversion rates, and qualified leads. These measurements help identify what works and where further improvements are needed.",
  },
  {
    q: "When will the website be ready?",
    a: "The delivery date depends on the remaining development, content approval, functionality, and testing. We will confirm a realistic timeline after reviewing the outstanding tasks and requirements.",
  },
];

function Row({ item, open, onToggle, idx }: { item: { q: string; a: string }; open: boolean; onToggle: () => void; idx: number }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${open ? "border-goldbright/45 bg-white/[0.06]" : "border-white/10 bg-white/[0.03] hover:border-white/25"}`}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`cq-p-${idx}`}
          id={`cq-b-${idx}`}
          className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
        >
          <span className="font-display text-[1.02rem] font-bold text-white sm:text-lg">{item.q}</span>
          <span
            aria-hidden="true"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open ? "border-goldbright bg-goldbright text-coal" : "border-white/25 text-white/70"}`}
          >
            <span className="relative block h-3.5 w-3.5">
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded bg-current" />
              <span className={`absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`} />
            </span>
          </span>
        </button>
      </h3>
      <div id={`cq-p-${idx}`} role="region" aria-labelledby={`cq-b-${idx}`} className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <p className="overflow-hidden px-5 text-[15px] leading-relaxed text-white/70 sm:px-7">
          <span className="block pb-6">{item.a}</span>
        </p>
      </div>
    </div>
  );
}

export function ClientQuestions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="cq-title" className="relative overflow-hidden bg-coalsec py-16 text-white sm:py-24">
      <div className="ambient-sun" aria-hidden="true" />
      <Container className="relative">
        <Sequence className="mb-10">
          <Step><p className="inline-flex items-center gap-2 rounded-full border border-goldbright/30 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-goldpale"><span className="h-1.5 w-1.5 rounded-full bg-goldbright" /> Client questions</p></Step>
          <Step><h2 id="cq-title" className="display-section mt-4 font-extrabold text-white">Clear answers. <span className="text-sun-gradient">Better decisions.</span></h2></Step>
          <Step><p className="mt-3 max-w-2xl leading-[1.75] text-white/65">Understand how our website redesign improves customer experience, strengthens our online presence, and helps generate qualified enquiries.</p></Step>
        </Sequence>
        <Sequence className="grid gap-3">
          {ITEMS.map((item, i) => (
            <Step key={item.q}>
              <Row item={item} idx={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            </Step>
          ))}
        </Sequence>
      </Container>
    </section>
  );
}
