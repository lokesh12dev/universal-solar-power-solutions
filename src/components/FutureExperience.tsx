"use client";
import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, PenTool, BadgeIndianRupee, PlugZap, Activity, ShieldCheck, DraftingCompass, FileCheck2, HardHat, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal, Sequence, Step, Tilt } from "@/components/effects";
import { EnquiryForm } from "@/components/EnquiryForm";
import { faqs } from "@/content/faqs";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";

/* v3 fix — broken circles + missing/reloading load animation:
   ROOT CAUSE 1: AlsoIncluded used -mt-[29px] inside overflow-x-auto.
   overflow-x:auto forces overflow-y to auto → negative-margin nodes clipped
   (top half cut = "broken circle"). FIX: absolute track @top:26px behind,
   nodes in normal flow z2 on TOP, scroll container has top padding.
   ROOT CAUSE 2: fill used height layout every scroll + setActive every frame
   → re-renders while scrolling ("loads and reloads"). FIX: transform scaleY
   (no layout), state only on index change, entrance plays ONCE via .in. */

const STEPS = [
  { icon: ClipboardCheck, title: "Free Site Survey", text: "Our experts visit your location to assess roof structure, shading, orientation, and energy needs." },
  { icon: PenTool, title: "Custom System Design", text: "We design a system tailored to your specific rooftop and energy consumption patterns." },
  { icon: BadgeIndianRupee, title: "Cost & Savings Estimate", text: "Transparent pricing with an indicative savings range — surveyed inputs, never a guaranteed return." },
  { icon: PlugZap, title: "Installation & Setup", text: "Safe installation with engineered structures, clean electricals and grid coordination." },
  { icon: Activity, title: "Monitoring & After-Sales Support", text: "Ongoing performance monitoring and dedicated support for the life of your system." },
];

const INCLUDED = ["Site Survey", "System Design", "Installation", "Net Metering", "Monitoring & Support"];

const EDGE = [
  { icon: ShieldCheck, n: "01", title: "Survey-Led Engineering", text: "Shade, structure and load checked before we propose anything." },
  { icon: DraftingCompass, n: "02", title: "Right-Sized Design", text: "Sized to ~90% of your use — no overselling, no jargon." },
  { icon: FileCheck2, n: "03", title: "Transparent Proposals", text: "Clear scope, clear pricing, indicative math you can verify." },
  { icon: HardHat, n: "04", title: "Support After Handover", text: "Commissioning, monitoring setup and maintenance support." },
];

function AuroraField() {
  const stars = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      left: `${(i * 37 + 11) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      delay: `${(i % 8) * 0.3}s`,
      size: i % 5 === 0 ? 4 : 3,
    }))
  );
  return (
    <div className="future-aurora" aria-hidden="true">
      <span className="future-blob future-blob-b1" />
      <span className="future-blob future-blob-b2" />
      <span className="future-blob future-blob-b3" />
      <span className="future-gridbg" />
      <span className="future-stars absolute inset-0">
        {stars.current.map((s, i) => (
          <i key={i} style={{ left: s.left, top: s.top, animationDelay: s.delay, width: s.size, height: s.size }} />
        ))}
      </span>
    </div>
  );
}

function EyebrowTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Sequence>
      <Step><p className="future-eyebrow text-center">{eyebrow}</p></Step>
      <Step><h2 className="future-title mt-4 text-center">{title}</h2></Step>
      <Step><div className="future-underline mx-auto mt-5" /></Step>
      {sub && <Step><p className="future-sub mx-auto mt-4 max-w-2xl text-center">{sub}</p></Step>}
    </Sequence>
  );
}

function FutureProcess() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.classList.add("in");
      setEntered(true);
      setActive(STEPS.length - 1);
      if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
      return;
    }
    const enterIO = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          wrap.classList.add("in");
          setEntered(true);
          enterIO.disconnect();
        }
      }),
      { threshold: 0.12 }
    );
    enterIO.observe(wrap);
    const stepIO = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const idx = Number((e.target as HTMLElement).dataset.idx);
        setActive((a) => (idx > a ? idx : a));
      }),
      { threshold: 0.5, rootMargin: "0px 0px -15% 0px" }
    );
    itemRefs.current.forEach((el) => el && stepIO.observe(el));
    let raf = 0;
    let lastIdx = -1;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrap.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const total = r.height - window.innerHeight * 0.4;
        const done = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / (total || 1)));
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${done.toFixed(3)})`;
        const idx = Math.min(STEPS.length - 1, Math.floor(done * STEPS.length));
        if (idx !== lastIdx) {
          lastIdx = idx;
          setActive((a) => (idx > a ? idx : a));
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { enterIO.disconnect(); stepIO.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={wrapRef} className="future-vwrap mx-auto mt-12 max-w-3xl">
      <div className="future-vtrack" aria-hidden="true" />
      <div ref={fillRef} className="future-vfill" aria-hidden="true" />
      <div className="future-vpulse" aria-hidden="true" />
      <ol className="relative space-y-8 md:space-y-10">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => { itemRefs.current[i] = el; }}
            data-idx={i}
            data-active={entered && i <= active}
            className="future-step flex gap-5 md:gap-7"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="future-node" aria-hidden="true"><span className="future-num">{i + 1}</span></span>
            <div className="future-step-card rounded-2xl p-5 md:p-6 flex-1">
              <div className="relative flex items-center gap-3">
                <span className="future-step-icon"><s.icon size={20} aria-hidden="true" /></span>
                <h3 className="text-lg md:text-xl font-extrabold text-white">{s.title}</h3>
              </div>
              <p className="relative mt-2.5 text-[15px] leading-relaxed text-white/65">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AlsoIncluded() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (el.classList.add("in"), io.disconnect())),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="future-hwrap mx-auto mt-14 max-w-5xl">
      <div className="future-glass rounded-[1.6rem] p-6 md:p-10">
        <p className="text-center text-lg font-extrabold text-[#F5A623]" style={{ textShadow: "0 0 18px rgba(245,166,35,.5)" }}>Also Included</p>
        <div className="future-hscroll mt-8">
          <div className="future-hline-wrap">
            <div className="future-hline-track" aria-hidden="true"><div className="future-hline-flow" /></div>
            <ol className="future-hnodes">
              {INCLUDED.map((t, i) => (
                <li key={t} className="flex w-28 flex-col items-center gap-3 text-center">
                  <span className="future-hnode" style={{ transitionDelay: `${i * 90}ms` }}>{i + 1}</span>
                  <span className="text-[13px] font-bold text-white/85">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function FutureEdge() {
  return (
    <Sequence className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={90}>
      {EDGE.map((c) => (
        <Step key={c.n} className="h-full">
          <Tilt className="h-full">
            <article className="future-edge-card h-full">
              <span className="future-ghost" aria-hidden="true">{c.n}</span>
              <span className="future-icon"><c.icon size={22} aria-hidden="true" /></span>
              <h3 className="mt-5 font-extrabold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{c.text}</p>
            </article>
          </Tilt>
        </Step>
      ))}
    </Sequence>
  );
}

function FutureFaq() {
  const [open, setOpen] = useState(0);
  const items = faqs.slice(0, 7);
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} data-open={isOpen} className="future-faq-item">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-white"
            >
              <span className={isOpen ? "text-[#F5A623]" : ""}>{f.q}</span>
              <span className="future-plus" aria-hidden="true">+</span>
            </button>
            <div className="future-faq-panel" aria-hidden={!isOpen}>
              <div className="future-faq-inner"><p className="px-5 pb-5 text-[15px] leading-relaxed text-white/65">{f.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FutureContact() {
  const cards = [
    { icon: Phone, label: "Phone", value: site.contact.primaryPhone, href: telHref(site.contact.primaryPhone) },
    { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: MapPin, label: "HQ — Anakaputhur, Chennai", value: `${site.address.line1} ${site.address.line2} ${site.address.city} ${site.address.pin}`, href: site.address.mapLink },
    { icon: Clock, label: "Hours", value: site.contact.hours, href: undefined },
  ];
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <Sequence className="grid gap-4" stagger={90}>
        {cards.map((c) => (
          <Step key={c.label}>
            <Tilt>
              <article className="future-contact-card">
                <span className="future-icon"><c.icon size={22} aria-hidden="true" /></span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#F5A623]">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noreferrer" : undefined} className="mt-1 block break-words font-bold text-white hover:text-[#F5A623]">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-bold text-white">{c.value}</p>
                  )}
                </div>
              </article>
            </Tilt>
          </Step>
        ))}
        <Step>
          <p className="future-glass rounded-2xl p-4 text-sm leading-relaxed text-white/60">
            Prefer talking? Call <a className="font-bold text-[#F5A623] hover:underline" href={telHref(site.contact.primaryPhone)}>{site.contact.primaryPhone}</a> — survey slots are arranged after a quick bill + roof check. We aim to respond within one working day.
          </p>
        </Step>
      </Sequence>
      <Reveal delay={120}>
        <div className="future-formcard rounded-[1.8rem] bg-white p-7 text-ink shadow-2xl sm:p-9">
          <h3 className="font-display text-2xl font-extrabold text-navy">Get a Free Quote</h3>
          <p className="mt-2 text-sm text-slate">Serving Chennai & surroundings · honest scope, no spam.</p>
          <div className="mt-6"><EnquiryForm /></div>
        </div>
      </Reveal>
    </div>
  );
}

export function FutureExperience() {
  return (
    <section aria-label="Future experience: process, edge, questions, story" className="future-dark grain relative">
      <AuroraField />
      <div className="relative z-[2]">
        <Container className="py-20 md:py-24">
          <EyebrowTitle eyebrow="How it works" title="Simple 5-Step Process" sub="Universal Solar Power Solutions handles everything — you just switch it ON." />
          <FutureProcess />
          <AlsoIncluded />
        </Container>

        <Container className="pb-20">
          <EyebrowTitle eyebrow="Our edge" title="Why Choose Universal Solar Power Solutions?" />
          <Reveal className="mt-8 flex justify-center">
            <div className="future-orb" aria-hidden="true">
              <span className="future-orb-ring" />
              <span className="grid h-24 w-24 place-items-center rounded-full bg-[#F5A623]/15 text-4xl shadow-[0_0_60px_rgba(245,166,35,.5)] ring-1 ring-[#F5A623]/50">☀</span>
            </div>
          </Reveal>
          <FutureEdge />
        </Container>

        <Container className="pb-20">
          <EyebrowTitle eyebrow="Questions" title="Frequently Asked Questions" />
          <FutureFaq />
        </Container>

        <Container className="pb-24">
          <EyebrowTitle eyebrow="Get in touch" title="Ready to Switch to Solar?" sub="Switch once. Save for decades. Power your future with solar." />
          <FutureContact />
        </Container>
      </div>
    </section>
  );
}
