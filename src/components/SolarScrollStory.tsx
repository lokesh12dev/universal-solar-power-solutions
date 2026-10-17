"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";

/**
 * SolarScrollStory — cinematic scroll story WITHOUT pinning.
 * Every section is normal document flow, so blank voids, header overlap
 * and scroll traps are structurally impossible. Motion is transform-only:
 * section-progress rotation/drift (fast, smoothed) + gentle idle drift,
 * static under reduced motion.
 */

const SITE_PHOTOS = [
  { src: "/images/legacy/project1.jpeg", alt: "Mounting rails on an industrial sheet roof — Universal Solar site photo" },
  { src: "/images/legacy/project2.jpeg", alt: "Rails fixed across a large industrial roof — Universal Solar site photo" },
  { src: "/images/legacy/project3.jpeg", alt: "Pedestal structures on an RCC roof — Universal Solar site photo" },
  { src: "/images/legacy/project4.jpeg", alt: "Completed rooftop solar array — Universal Solar site photo" },
  { src: "/images/legacy/project5.jpeg", alt: "Foundation piling for ground-mounted solar — Universal Solar site photo" },
  { src: "/images/legacy/project6.jpeg", alt: "Large rooftop solar plant — Universal Solar site photo" },
  { src: "/images/legacy/project7.jpeg", alt: "Industrial rooftop array — Universal Solar site photo" },
  { src: "/images/legacy/project8.jpeg", alt: "Ground-mount foundation work — Universal Solar site photo" },
  { src: "/images/legacy/project9.jpeg", alt: "Rooftop installation in progress — Universal Solar site photo" },
];

const CHAPTERS = [
  { n: "01", title: "Accountable Chennai team", text: "Anakaputhur-based EPC — one team from roof check to after-care. Mon–Sat, 9AM–6PM.", img: 3 },
  { n: "02", title: "Engineered journeys", text: "Residential, Commercial, Industrial — each starts with a survey, not a generic package.", img: 5 },
  { n: "03", title: "Steps to commissioning", text: "Enquiry → Assessment & Survey → Proposal & Installation → Commissioning & Support.", img: 1 },
  { n: "04", title: "System parts engineered", text: "Panels, inverters, storage, structures, monitoring — sized as one system.", img: 0 },
  { n: "05", title: "What we can prove", text: "Genuine site photos only. Capacities and customer names appear with written consent.", img: 4 },
];

const TILTS = [-7, 6, -5, 8, -6, 7, -8, 5, -6];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Progress of a section travelling through the viewport (0 → 1). */
function useSectionProgress<T extends HTMLElement>(ref: React.RefObject<T | null>, onP: (p: number) => void) {
  const cb = useRef(onP);
  cb.current = onP;
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height + window.innerHeight;
        const p = total > 0 ? clamp01((window.innerHeight - r.top) / total) : 1;
        if (Math.abs(p - last) < 0.0005) return;
        last = p;
        cb.current(p);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Enter-reveal: adds .on once when visible. Content is visible by default without JS. */
function useEnter<T extends HTMLElement>(ref: React.RefObject<T | null>, cls = "on") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add(cls), io.unobserve(e.target))),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ---------- 1. Manifesto + scroll-drifting photo strip (normal flow) ---------- */
function Manifesto() {
  const secRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const pRef = useRef(0);
  const smRef = useRef(0);

  useEnter(headRef);
  useSectionProgress(secRef, (p) => {
    pRef.current = p;
  });

  useEffect(() => {
    if (prefersReduced()) return;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver((es) => {
      visible = es[0]?.isIntersecting ?? true;
    });
    if (secRef.current) io.observe(secRef.current);
    const loop = (t: number) => {
      if (visible && stripRef.current) {
        smRef.current = lerp(smRef.current, pRef.current, 0.14);
        const x = lerp(4, -22, smRef.current) + Math.sin(t / 1000 / 2.5) * 1;
        stripRef.current.style.transform = `rotate(-6deg) translate3d(${x.toFixed(2)}%,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={secRef} className="relative overflow-x-clip bg-navy py-20 text-white sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div ref={headRef} className="rise">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan">People &amp; Process · Universal Solar · Keep scrolling ↓</p>
          <h2 className="font-display mt-4 max-w-4xl text-balance text-4xl font-extrabold leading-[1.06] sm:text-6xl">
            A Chennai solar team shaped by survey discipline, honest engineering, and care after commissioning.
          </h2>
        </div>
      </div>
      <div className="mt-12 overflow-hidden" aria-hidden="true">
        <div ref={stripRef} className="flex w-max gap-5 pr-10 will-change-transform" style={{ transform: "rotate(-6deg)" }}>
          {SITE_PHOTOS.slice(0, 8).map((img, i) => (
            <div key={`${img.src}-${i}`} className="h-44 w-64 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:h-56 sm:w-80">
              <Image src={asset(img.src)} alt={img.alt} width={640} height={440} loading="lazy" sizes="(max-width: 640px) 70vw, 320px" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. Orbit ring — always visible, scroll-spun + idle drift ---------- */
function OrbitRing() {
  const secRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const innersRef = useRef<(HTMLDivElement | null)[]>([]);
  const headRef = useRef<HTMLDivElement>(null);
  const pRef = useRef(0);
  const smRef = useRef(0);

  useEnter(headRef);
  useSectionProgress(secRef, (p) => {
    pRef.current = p;
  });

  useEffect(() => {
    if (prefersReduced()) return; // static composed ring (initial CSS transforms)
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver((es) => {
      visible = es[0]?.isIntersecting ?? true;
    });
    if (secRef.current) io.observe(secRef.current);
    const loop = (t: number) => {
      if (visible && ringRef.current) {
        smRef.current = lerp(smRef.current, pRef.current, 0.1);
        // scroll sweep (fast, dominant) + slow idle drift (alive at rest)
        const R = lerp(-50, 230, smRef.current) + (t / 1000) * 5;
        ringRef.current.style.transform = `rotate(${R.toFixed(2)}deg)`;
        innersRef.current.forEach((el, i) => {
          if (!el) return;
          const tilt = TILTS[i % TILTS.length];
          el.style.transform = `rotate(${(-R).toFixed(2)}deg) rotate(${tilt}deg)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const ring = SITE_PHOTOS.slice(0, 9);

  return (
    <div ref={secRef} className="relative overflow-x-clip bg-navy py-20 text-white sm:py-28">
      <div ref={headRef} className="rise mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">One roof · Many trades · Scrolling rotates ↓</p>
        <p className="font-display mx-auto mt-3 text-balance text-2xl font-extrabold sm:text-4xl">Survey to support, circling every site.</p>
      </div>
      <div className="relative mx-auto mt-10 h-[92vw] max-h-[560px] w-[92vw] max-w-[560px] [container-type:size] sm:mt-12">
        <div
          ref={ringRef}
          className="absolute inset-0 will-change-transform"
          role="list"
          aria-label="Site photographs arranged in a rotating ring"
        >
          {ring.map((img, i) => {
            const angle = (i / ring.length) * 360;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={`${img.src}-${i}`}
                role="listitem"
                className="absolute left-1/2 top-1/2 h-24 w-20 sm:h-36 sm:w-32"
                style={{ transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-34cqw)` }}
              >
                <div
                  ref={(el) => {
                    innersRef.current[i] = el;
                  }}
                  className="relative h-full w-full will-change-transform"
                  style={{ transform: `rotate(${-angle}deg)` }}
                >
                  <Image
                    src={asset(img.src)}
                    alt={img.alt}
                    width={288}
                    height={320}
                    loading="lazy"
                    sizes="128px"
                    className="h-full w-full rounded-xl object-cover shadow-2xl ring-1 ring-white/20"
                  />
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-2.5 py-0.5 text-[11px] font-extrabold tracking-widest text-navy shadow-lg">
                    {num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {/* center card sits above the photos so text is never covered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="max-w-[240px] rounded-2xl border border-white/15 bg-navy/85 px-5 py-4 text-center shadow-2xl backdrop-blur sm:max-w-xs">
            <p className="font-display text-lg font-extrabold leading-snug sm:text-xl">One roof.<br />Many trades.</p>
            <Link href="/projects" className="mt-2 inline-block text-sm font-bold text-cyan underline-offset-4 hover:underline">See site work →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. Chapters 01–05 — aligned rail, alternating rows ---------- */
function PinnedChapters() {
  const secRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEnter(listRef);
  useSectionProgress(secRef, () => {});

  return (
    <section ref={secRef} className="relative overflow-x-clip bg-navy pb-20 pt-4 text-white sm:pb-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">Universal Solar · What we can prove · Scroll ↓</p>
        <div ref={listRef} className="rise-list mt-8 space-y-5 sm:space-y-6">
          {CHAPTERS.map((s, i) => {
            const photo = SITE_PHOTOS[s.img];
            const flip = i % 2 === 1;
            return (
              <article
                key={s.n}
                className="rise grid items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:p-6"
              >
                <div className={`flex items-center gap-4 ${flip ? "sm:order-3" : ""}`}>
                  <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">{s.n}</span>
                  <span className="hidden h-16 w-[3px] overflow-hidden rounded bg-white/15 sm:block" aria-hidden="true">
                    <span className="block h-full w-full origin-top rounded bg-gradient-to-b from-electric to-cyan" />
                  </span>
                </div>
                <div className={`min-w-0 ${flip ? "sm:order-1 sm:text-right" : ""}`}>
                  <h3 className="font-display break-words text-xl font-bold sm:text-2xl">{s.title}</h3>
                  <p className="mt-1 max-w-md break-words text-sm leading-relaxed text-white/60 sm:text-[15px]">{s.text}</p>
                </div>
                <div className={`w-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:w-52 ${flip ? "sm:order-2 sm:justify-self-end" : ""}`}>
                  <Image src={asset(photo.src)} alt={photo.alt} width={420} height={300} loading="lazy" sizes="208px" className="h-28 w-full object-cover sm:h-32" />
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/40">
          We don&apos;t publish years, project counts, or capacities as fact until verified — see{" "}
          <Link href="/about" className="font-bold text-cyan underline-offset-4 hover:underline">About</Link> for what needs sign-off.{" "}
          <Link href="/projects" className="font-bold text-cyan underline-offset-4 hover:underline">See site work →</Link>
        </p>
      </div>
    </section>
  );
}

export function SolarScrollStory() {
  return (
    <div id="scroll-story" aria-label="Universal Solar scroll story — survey to support">
      <Manifesto />
      <OrbitRing />
      <PinnedChapters />
    </div>
  );
}
