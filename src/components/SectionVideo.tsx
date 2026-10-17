"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";

/* SectionVideo — video swap-in for ONE image box, mirroring MaskReveal's
   box classes and reveal animation exactly (frame, veil, settle, rounding).
   Owner-supplied footage, responsive delivery via <source media>:
   - poster-first paint; video mounts only when scrolled into view
   - reduced-motion OR data-saver → poster only (no download)
   - video error/missing → poster stays (box never blank)
   Used for: Residential + Commercial homepage sections (2026-10-17). */

function shouldDeferVideo(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return true;
  return false;
}

export function SectionVideo({
  poster, alt, desktopSrc, mobileSrc, dir = "left", ratio = "1260 / 840", caption, className = "",
}: {
  poster: string; alt: string; desktopSrc: string; mobileSrc: string;
  dir?: "left" | "right"; ratio?: string; caption?: string; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [mount, setMount] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target !== el) return;
          entry.target.classList.add("mask-on");
          setInView(true);
          if (!shouldDeferVideo()) setMount(true);
          io.unobserve(entry.target);
        }),
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={`maskreveal mask-${dir} ${inView ? "mask-on" : ""} ${className}`} style={{ aspectRatio: ratio }}>
      <span className="maskreveal-frame">
        <Image src={asset(poster)} alt={alt} width={1600} height={900} sizes="(max-width: 1024px) 100vw, 50vw" className="maskreveal-img" />
        {mount && !failed && (
          <video
            className="maskreveal-video"
            poster={asset(poster)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
            onError={() => setFailed(true)}
          >
            <source src={asset(desktopSrc)} type="video/mp4" media="(min-width: 768px)" />
            <source src={asset(mobileSrc)} type="video/mp4" />
          </video>
        )}
        <span className="maskreveal-veil" aria-hidden="true" />
      </span>
      {caption && <figcaption className="maskreveal-cap">{caption}</figcaption>}
    </figure>
  );
}
