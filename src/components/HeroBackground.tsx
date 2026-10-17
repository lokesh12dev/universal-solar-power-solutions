"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/assets";

/* HeroBackground — owner-supplied solar-farm/turbine animation ("WhatsApp
   Video 2026-10-16 at 09.53.08 (1).mp4", remuxed stream-copy to strip audio).
   Native 768x432 25fps quality — not upscaled. Single 1.9MB file for all
   viewports (no duplicate downloads), poster-first paint.
   - prefers-reduced-motion OR data-saver → static poster image, no download.
   - Video error/missing → static fallback. Never blocks the headline. */

const POSTER = "/images/solar-background-poster.jpg";
const SRC = "/videos/solar-background.mp4";

function StaticHero() {
  return (
    <Image
      src={asset(POSTER)}
      alt=""
      width={768}
      height={432}
      priority
      fetchPriority="high"
      sizes="100vw"
      className="hero-kenburns motion-reduce:animate-none motion-reduce:transform-none h-full w-full object-cover"
    />
  );
}

function shouldDeferVideo(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return true;
  return false;
}

export function HeroBackground() {
  // Decide on first paint (SSR-safe): reduced-motion / data-saver get the
  // static poster immediately — no autoplay flash, no wasted download.
  // No-JS renders the <video> + poster (native autoplay may still play it).
  const [mode, setMode] = useState<"video" | "image">(() =>
    shouldDeferVideo() ? "image" : "video"
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (shouldDeferVideo()) setMode("image");
  }, []);

  if (mode === "image" || failed) return <StaticHero />;

  return (
    <>
      {/* Instant paint + no-JS fallback: sits under the video until it can play. */}
      <Image
        src={asset(POSTER)}
        alt=""
        width={768}
        height={432}
        priority
        fetchPriority="high"
        sizes="100vw"
        className="h-full w-full object-cover"
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster={asset(POSTER)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onError={() => setFailed(true)}
        onCanPlay={(e) => {
          const v = e.currentTarget;
          // Autoplay can be blocked; the poster stays visible underneath.
          void v.play().catch(() => undefined);
        }}
      >
        <source src={asset(SRC)} type="video/mp4" />
      </video>
    </>
  );
}
