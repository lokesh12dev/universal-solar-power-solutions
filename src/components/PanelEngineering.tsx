"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";
import { Sequence, Step, ScrollFill } from "@/components/effects";

/* Panel engineering scroll story — "Every layer. A purpose."
   Accurate generic crystalline-module stack, no invented parts:
   tempered glass → front encapsulant → PV cells → rear encapsulant →
   backsheet → frame + junction box.
   Scroll-linked EXPLODED VIEW: as the stage cards pass the viewport the
   laminate separates (glass lifts, rear layers drop), then reassembles at
   the end. Transforms are applied imperatively (rAF) so scrolling stays at
   full frame rate; reduced-motion users get the assembled static diagram. */

const STAGES = [
  {
    id: "complete",
    n: "01",
    name: "Complete panel",
    title: "Built to capture light.",
    text: "A finished module is a sealed laminate: glass, cell matrix, and rear layers held in one frame. Everything below exists to protect the cells and carry their power out safely.",
    layers: ["glass", "encap-front", "cells", "encap-rear", "backsheet", "frame"],
  },
  {
    id: "glass",
    n: "02",
    name: "Tempered glass",
    title: "The first line of defence.",
    text: "Low-iron tempered front glass transmits sunlight to the cells while shielding them from hail, wind load, and debris. Its tempering also sets the module's mechanical strength.",
    layers: ["glass"],
  },
  {
    id: "cells",
    n: "03",
    name: "Photovoltaic cells",
    title: "Where light becomes electricity.",
    text: "Interconnected silicon cells convert light into direct-current electricity. Cell layout, spacing, and the ribbons joining them decide the module's wattage — the familiar grid you see from the front.",
    layers: ["cells"],
  },
  {
    id: "encap",
    n: "04",
    name: "Encapsulation layers",
    title: "Sealed against the weather.",
    text: "Front and rear encapsulant films bond glass, cells, and backsheet into one laminate, cushioning the cells against moisture, thermal cycling, and mechanical stress over decades outdoors.",
    layers: ["encap-front", "encap-rear"],
  },
  {
    id: "rear",
    n: "05",
    name: "Rear protective layer",
    title: "The back of the sandwich.",
    text: "The backsheet (or rear glass on glass-glass modules) closes the laminate, providing electrical insulation and a final barrier against humidity and UV from behind.",
    layers: ["backsheet"],
  },
  {
    id: "frame",
    n: "06",
    name: "Frame + junction box",
    title: "Structure and exit route.",
    text: "The aluminium frame gives the laminate rigidity and mounting points. The junction box on the rear collects each cell string through bypass diodes and carries DC power to the inverter cabling.",
    layers: ["frame", "junction"],
  },
] as const;

type LayerId = "glass" | "encap-front" | "cells" | "encap-rear" | "backsheet" | "frame";

const LAYER_META: Record<LayerId, { label: string; y: number; h: number; fill: string }> = {
  glass: { label: "Tempered glass", y: 18, h: 26, fill: "#9DB8D2" },
  "encap-front": { label: "Front encapsulant", y: 48, h: 14, fill: "#3E556E" },
  cells: { label: "PV cells", y: 66, h: 30, fill: "#2F6FD0" },
  "encap-rear": { label: "Rear encapsulant", y: 100, h: 14, fill: "#3E556E" },
  backsheet: { label: "Backsheet", y: 118, h: 22, fill: "#5B6B7E" },
  frame: { label: "Frame", y: 8, h: 142, fill: "none" },
};

/* Exploded-view offsets (viewBox units). Negative = up, positive = down.
   The frame stays as the fixed reference so the assembly reads as one object. */
const OFFSET: Record<LayerId, number> = {
  glass: -46,
  "encap-front": -26,
  cells: -9,
  "encap-rear": 11,
  backsheet: 26,
  frame: 0,
};
const JUNCTION_OFFSET = 32;

/* Callout anchor per stage (mid-y of the layer the label explains + its
   exploded offset so the label tracks the layer while separated). */
const CALLOUT_Y: Record<string, { y: number; off: number; text: string } | undefined> = {
  glass: { y: LAYER_META.glass.y + LAYER_META.glass.h / 2, off: OFFSET.glass, text: LAYER_META.glass.label },
  cells: { y: LAYER_META.cells.y + LAYER_META.cells.h / 2, off: OFFSET.cells, text: LAYER_META.cells.label },
  encap: { y: LAYER_META["encap-front"].y + LAYER_META["encap-front"].h / 2, off: OFFSET["encap-front"], text: "Encapsulant layers" },
  rear: { y: LAYER_META.backsheet.y + LAYER_META.backsheet.h / 2, off: OFFSET.backsheet, text: LAYER_META.backsheet.label },
  frame: { y: LAYER_META.frame.y + LAYER_META.frame.h / 2, off: OFFSET.frame, text: "Frame + junction box" },
};

export function PanelEngineering() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const interacted = useRef(false);
  const olRef = useRef<HTMLOListElement>(null);
  const layerRefs = useRef<Partial<Record<LayerId, SVGGElement | null>>>({});
  const junctionRef = useRef<SVGGElement | null>(null);
  const calloutRef = useRef<SVGGElement | null>(null);
  const calloutOff = useRef(0);

  /* Stage tracking (highlight synchronised with the cards). */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting && !interacted.current) {
          const i = refs.current.findIndex((el) => el === e.target);
          if (i >= 0) setActive(i);
        }
      }),
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Scroll-linked exploded view: sine curve 0 → 1 → 0 across the cards
     column's journey through the viewport, applied imperatively per frame. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ol = olRef.current;
    if (!ol) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.95; // cards enter the viewport → separation begins
      const end = vh * 0.22; // cards pass the top → fully reassembled for the CTA
      const total = r.top - start; // negative as we scroll down
      const span = (r.height + (start - end)) || 1;
      const p = Math.min(1, Math.max(0, -total / span));
      const sep = Math.sin(Math.PI * p); // 0 → 1 → 0
      (Object.keys(OFFSET) as LayerId[]).forEach((k) => {
        const g = layerRefs.current[k];
        if (g) g.setAttribute("transform", `translate(0 ${(OFFSET[k] * sep).toFixed(2)})`);
      });
      if (junctionRef.current) junctionRef.current.setAttribute("transform", `translate(0 ${(JUNCTION_OFFSET * sep).toFixed(2)})`);
      if (calloutRef.current) calloutRef.current.setAttribute("transform", `translate(0 ${(calloutOff.current * sep).toFixed(2)})`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    interacted.current = true;
    setActive(i);
    refs.current[i]?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    window.setTimeout(() => { interacted.current = false; }, 1200);
  };

  const stage = STAGES[active];
  const on = (id: string) => (stage.layers as readonly string[]).includes(id);
  const callout = CALLOUT_Y[stage.id];
  calloutOff.current = callout?.off ?? 0;

  return (
    <section aria-labelledby="panel-eng-title" className="relative overflow-hidden bg-coal py-16 text-white sm:py-24">
      <div className="ambient-sun" aria-hidden="true" />
      <Container className="relative">
        <ScrollFill className="mb-8 scrollfill-on-dark" />
        <Sequence>
          <Step><p className="inline-flex items-center gap-2 rounded-full border border-goldbright/30 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-goldpale"><span className="h-1.5 w-1.5 rounded-full bg-goldbright" /> Panel engineering</p></Step>
          <Step><h2 id="panel-eng-title" className="display-section mt-4 font-extrabold text-white">Every layer. <span className="text-sun-gradient">A purpose.</span></h2></Step>
          <Step><p className="mt-3 max-w-2xl leading-[1.75] text-white/65">Scroll through the module cross-section — the layers draw apart as you read, then close back into a finished panel. Select any stage to highlight the layer it explains. The full explanation is always on the page, with or without animation.</p></Step>
        </Sequence>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Diagram — sticky on desktop, static on mobile */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.6rem] border border-white/10 bg-elevated p-5 sm:p-7" role="img" aria-label={`Module cross-section diagram. Active stage: ${stage.name} — ${stage.title}`}>
              <svg viewBox="0 -58 430 296" className="h-auto w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="pe-glass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8DAEC" />
                    <stop offset="100%" stopColor="#8FACC9" />
                  </linearGradient>
                  <linearGradient id="pe-cells" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B7FDD" />
                    <stop offset="100%" stopColor="#2456A8" />
                  </linearGradient>
                  <linearGradient id="pe-back" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C7C90" />
                    <stop offset="100%" stopColor="#4E5E72" />
                  </linearGradient>
                </defs>

                {/* frame outline — fixed reference */}
                <g ref={(el) => { layerRefs.current.frame = el; }}>
                  <rect x="30" y={LAYER_META.frame.y} width="280" height={LAYER_META.frame.h} rx="6" fill="none" stroke={on("frame") ? "#DDB56B" : "rgba(210,225,240,.35)"} strokeWidth={on("frame") ? 3 : 1.5} />
                </g>

                {(Object.keys(LAYER_META) as LayerId[]).filter((k) => k !== "frame").map((k) => {
                  const m = LAYER_META[k];
                  const hot = on(k);
                  const fill = k === "glass" ? "url(#pe-glass)" : k === "cells" ? "url(#pe-cells)" : k === "backsheet" ? "url(#pe-back)" : m.fill;
                  return (
                    <g key={k} ref={(el) => { layerRefs.current[k] = el; }} opacity={stage.id === "complete" ? 1 : hot ? 1 : 0.28} style={{ transition: "opacity .35s ease" }}>
                      <rect x="44" y={m.y} width="252" height={m.h} rx="3" fill={fill} stroke={hot ? "#DDB56B" : "rgba(255,255,255,.08)"} strokeWidth={hot ? 2 : 1} />
                      {k === "cells" && (
                        <g stroke="rgba(7,11,16,.5)" strokeWidth="1">
                          {[94, 144, 194, 244].map((x) => <line key={x} x1={x} y1={m.y} x2={x} y2={m.y + m.h} />)}
                        </g>
                      )}
                      {/* soft top light on each layer for subtle depth */}
                      <rect x="44" y={m.y} width="252" height={Math.min(3, m.h / 3)} rx="1.5" fill="rgba(255,255,255,.14)" />
                      {hot && (
                        <>
                          <line x1="296" y1={m.y + m.h / 2} x2="326" y2={m.y + m.h / 2} stroke="#DDB56B" strokeWidth="1.5" />
                          <circle cx="296" cy={m.y + m.h / 2} r="2" fill="#DDB56B" />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* junction box — fixed to the rear of the laminate */}
                <g ref={junctionRef} opacity={stage.id === "complete" ? 1 : on("junction") ? 1 : 0.28} style={{ transition: "opacity .35s ease" }}>
                  <rect x="140" y="150" width="60" height="24" rx="4" fill={on("junction") ? "#DDB56B" : "#3E556E"} stroke={on("junction") ? "#F0CF8C" : "rgba(255,255,255,.08)"} strokeWidth={on("junction") ? 2 : 1} />
                  <line x1="170" y1="174" x2="170" y2="188" stroke={on("junction") ? "#DDB56B" : "rgba(210,225,240,.4)"} strokeWidth="2" />
                </g>

                {/* active-layer callout — transforms imperatively with the layer it labels */}
                {callout && (
                  <g ref={calloutRef}>
                    <line x1="326" y1={callout.y} x2="334" y2={callout.y} stroke="#DDB56B" strokeWidth="1" opacity="0.85" />
                    <text x="340" y={callout.y + 3.5} fill="#F0CF8C" fontSize="9.5" fontWeight="700">{callout.text}</text>
                  </g>
                )}
              </svg>
              <p className="mt-3 text-xs leading-relaxed text-white/50">Simplified cross-section, not to scale — layer thicknesses are exaggerated for clarity, and actual module construction varies by design (frame and junction box are separate components, not laminate layers).</p>
            </div>
          </div>

          {/* Stages — buttons (keyboard accessible) doubling as scroll steps */}
          <ol ref={olRef} className="grid gap-3">
            {STAGES.map((s, i) => {
              const is = i === active;
              return (
                <li key={s.id}>
                  <article
                    ref={(el) => { refs.current[i] = el; }}
                    className={`rounded-3xl border p-5 transition sm:p-6 ${is ? "border-goldbright/50 bg-white/[0.06]" : "border-white/10 bg-white/[0.02]"}`}
                  >
                    <button type="button" onClick={() => go(i)} aria-current={is} aria-expanded={is} className="flex w-full items-center gap-4 text-left">
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold ${is ? "bg-goldbright text-coal" : "border border-white/15 text-white/60"}`}>{s.n}</span>
                      <span>
                        <span className={`block text-[11px] font-bold uppercase tracking-[0.2em] ${is ? "text-goldpale" : "text-white/45"}`}>{s.name}</span>
                        <span className="font-display mt-0.5 block text-lg font-extrabold text-white">{s.title}</span>
                      </span>
                    </button>
                    <div className={`grid transition-all ${is ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden text-[15px] leading-relaxed text-white/70">{s.text}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        <Sequence className="mt-10 rounded-[1.6rem] border border-goldbright/25 bg-gradient-to-r from-[#141007] to-elevated p-7 text-center sm:p-10">
          <Step><h3 className="font-display mx-auto max-w-2xl text-balance text-2xl font-extrabold text-white sm:text-3xl">Every component has a purpose. Every installation needs a plan.</h3></Step>
          <Step><div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/products" className="btn-gold inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-bold">Explore Solar Solutions <ArrowUpRight size={16} aria-hidden="true" /></Link><Link href="/solar-savings-calculator" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-[15px] font-bold text-white transition hover:border-goldbright hover:text-goldpale">Estimate your system</Link></div></Step>
        </Sequence>
      </Container>
    </section>
  );
}
