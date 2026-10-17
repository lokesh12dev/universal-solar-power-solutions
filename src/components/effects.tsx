"use client";
import { useEffect, useRef, useState, cloneElement, isValidElement } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { asset } from "@/lib/assets";

export function Reveal({ children, className = "", delay = 0, dir = "up" }: { children: React.ReactNode; className?: string; delay?: number; dir?: "up" | "left" | "right" | "zoom" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal reveal-${dir} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = to.toFixed(decimals) + suffix;
      return;
    }
    let raf = 0; const t0 = performance.now(); const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(decimals) + suffix;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (raf = requestAnimationFrame(tick), io.disconnect())), { threshold: 0.4 });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [to, suffix, decimals]);
  return <span ref={ref}>0{suffix}</span>;
}

/** Thin scroll progress bar — fixed top, cyan on navy. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        el.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-royal via-cyan to-cyan" />;
}

/** Subtle parallax wrapper — translates child with scroll. Disabled with reduced motion. */
export function Parallax({ children, speed = 0.08, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>;
}

/** Gentle 3D tilt on hover for premium cards. Pointer-only, resets on leave. */
export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      const cx = e.clientX, cy = e.clientY;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (cx - r.left) / r.width - 0.5;
        const y = (cy - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
    };
    const reset = () => { cancelAnimationFrame(raf); el.style.transform = ""; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className={className} style={{ transition: "transform .3s ease" }}>{children}</div>;
}

/**
 * Sequence — code-by-code scroll sequencer. Wrap a section's elements in
 * <Step> children; when the section enters view they activate ONE BY ONE
 * in order (label → heading → tech line → image → text → details → CTA).
 * Single IntersectionObserver per sequence; transform/opacity only.
 */
export function Sequence({ children, className = "", stagger = 110 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--seq-step", `${stagger}ms`);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("seq-on"), io.unobserve(e.target))),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);
  return <div ref={ref} className={`seq ${className}`}>{children}</div>;
}

export function Step({ children, className = "", variant = "rise" }: { children: React.ReactNode; className?: string; variant?: "rise" | "mask" | "line" | "zoom" }) {
  return <div className={`seq-step seq-${variant} ${className}`}>{children}</div>;
}

/**
 * TechLine — thin engineering rule that draws left→right with an alignment
 * marker and a brief cyan energy pulse when its sequence activates.
 */
export function TechLine({ className = "" }: { className?: string }) {
  return (
    <div className={`techline ${className}`} aria-hidden="true">
      <span className="techline-track"><span className="techline-pulse" /></span>
      <span className="techline-mark">+</span>
    </div>
  );
}

/**
 * MaskReveal — cinematic image reveal. The ORIGINAL image is untouched;
 * an overflow mask wipes away (direction-aware) while the photo settles
 * from 1.06 to natural scale. Optional caption reveals last.
 */
export function MaskReveal({ src, alt, width, height, sizes, caption, className = "", imgClassName = "", dir = "up", eager = false, delay = 0 }: {
  src: string; alt: string; width: number; height: number; sizes?: string;
  caption?: string; className?: string; imgClassName?: string;
  dir?: "up" | "left" | "right"; eager?: boolean; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("mask-on"), io.unobserve(e.target))),
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className={`maskreveal mask-${dir} ${className}`} style={{ ["--mask-delay" as string]: `${delay}ms` }}>
      <span className="maskreveal-frame">
        <Image src={asset(src)} alt={alt} width={width} height={height} sizes={sizes} loading={eager ? undefined : "lazy"} priority={eager || undefined} fetchPriority={eager ? "high" : undefined} className={`maskreveal-img ${imgClassName}`} />
        <span className="maskreveal-veil" aria-hidden="true" />
      </span>
      {caption && <figcaption className="maskreveal-cap">{caption}</figcaption>}
    </figure>
  );
}

/**
 * Words — line-by-line editorial reveal for short headings. Splits text
 * content into word spans (preserving <br/> and nested elements) that rise
 * from an overflow mask with a tight stagger on first view. Screen-reader
 * and selection safe: no text is altered, only wrapped.
 */
export function Words({ children, className = "", step = 70 }: { children: React.ReactNode; className?: string; step?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("words-on"), io.unobserve(e.target))),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  let key = 0;
  const render = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      return node.split(/(\s+)/).map((part) =>
        /^\s*$/.test(part) ? (
          <span key={key++}>{part}</span>
        ) : (
          <span key={key++} className="wordmask"><span className="word" style={{ transitionDelay: `${key * step}ms` }}>{part}</span></span>
        )
      );
    }
    if (Array.isArray(node)) return node.map((n) => <span key={key++} style={{ display: "contents" }}>{render(n)}</span>);
    if (node && typeof node === "object" && isValidElement(node)) {
      if (node.type === "br") {
        const br = node as React.ReactElement<{ className?: string }>;
        return <br key={key++} className={br.props.className} />;
      }
      const el = node as React.ReactElement<{ children?: React.ReactNode; className?: string }>;
      return cloneElement(el, { key: key++, children: render(el.props.children) });
    }
    return node;
  };
  return <span ref={ref as never} className={`words ${className}`}>{render(children)}</span>;
}

/**
 * Magnetic — restrained pointer pull for primary CTAs (pointer:fine only,
 * ≤7px, springs back on leave). Inert on touch and reduced motion.
 */
export function Magnetic({ children, className = "", strength = 7 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      const cx = e.clientX, cy = e.clientY;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = Math.max(-0.5, Math.min(0.5, (cx - r.left) / r.width - 0.5));
        const y = Math.max(-0.5, Math.min(0.5, (cy - r.top) / r.height - 0.5));
        el.style.transform = `translate3d(${(x * strength * 2).toFixed(1)}px, ${(y * strength * 2).toFixed(1)}px, 0)`;
      });
    };
    const reset = () => { cancelAnimationFrame(raf); el.style.transform = ""; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); cancelAnimationFrame(raf); };
  }, [strength]);
  return <span ref={ref} className={`magnetic ${className}`}>{children}</span>;
}

/**
 * ScrollFill — undeniable scroll linkage. A hairline that fills left→right
 * as its section travels through the viewport. rAF-throttled, one listener
 * per instance, static-full under reduced motion.
 */
export function ScrollFill({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleX(1)";
      return;
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const host = el.closest("section") ?? el;
        const r = host.getBoundingClientRect();
        const total = r.height + window.innerHeight;
        const done = total > 0 ? Math.min(1, Math.max(0, (window.innerHeight - r.top) / total)) : 1;
        el.style.transform = `scaleX(${done.toFixed(3)})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div aria-hidden="true" className={`scrollfill ${className}`}>
      <div ref={ref} className="scrollfill-bar" />
    </div>
  );
}

/**
 * ScrollOpen — scroll-linked image open/close. The frame's clip-path follows
 * its distance from the viewport center: fully open at center, gently shut
 * toward the edges. rAF-throttled, clip-path only (no layout shift), skips
 * offscreen work, static-open under reduced motion.
 */
export function ScrollOpen({ children, className = "", shut = 14 }: { children: React.ReactNode; className?: string; shut?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        if (r.bottom < -120 || r.top > vh + 120) return;
        const dist = Math.abs(vh / 2 - (r.top + r.height / 2)) / (vh * 0.55);
        const p = Math.min(1, Math.max(0, 1 - dist));
        const e = p * p * (3 - 2 * p);
        const v = ((1 - e) * shut).toFixed(2);
        const h = ((1 - e) * shut * 0.7).toFixed(2);
        el.style.clipPath = `inset(${v}% ${h}% ${v}% ${h}% round 1rem)`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, [shut]);
  return <div ref={ref} className={`scrollopen ${className}`}>{children}</div>;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShow(window.scrollY > 900));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-coal text-goldpale shadow-2xl ring-1 ring-goldbright/50 transition hover:-translate-y-1 hover:ring-goldbright"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}
