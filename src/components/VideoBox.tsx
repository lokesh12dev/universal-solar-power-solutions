"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VideoBoxProps = {
  mp4: string;
  webm?: string;
  poster: string;
  alt: string;
  className?: string;
  label?: string; // accessible label for controls
};

/**
 * VideoBox — robust, autoplaying muted loop video with poster fallback.
 *
 * - Plays only when in viewport (IntersectionObserver), pauses when out.
 * - Falls back to poster image if video fails to load (CORS, 404, unsupported codec).
 * - Respects prefers-reduced-motion (shows poster only, no decode).
 * - Preloads metadata only; poster shows instantly.
 * - Works on Vercel edge/static hosting (served from /public).
 * - SSR-safe: all window/matchMedia access is client-only.
 */
export function VideoBox({
  mp4,
  webm,
  poster,
  alt,
  className = "",
  label = "Video",
}: VideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [errored, setErrored] = useState(false);
  // Start true so SSR + first client render show poster (no flash), then correct on mount.
  const [reducedMotion, setReducedMotion] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const handleError = useCallback(() => {
    // Video failed to load — fall back to poster. Never show a broken player.
    setErrored(true);
  }, []);

  // Client-only effects: detect reduced motion + play/pause on viewport.
  useEffect(() => {
    setIsClient(true);
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const el = videoRef.current;
    if (!el) return;
    if (reducedMotion) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis && errored === false) {
          el.play().catch(() => {
            // Autoplay blocked by browser — poster remains visible, user can tap.
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(wrapperRef.current!);
    return () => {
      io.disconnect();
      el.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errored, reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm ${className}`}
      role="region"
      aria-label={label}
    >
      {/* During SSR or reduced motion or error: poster only (never breaks layout). */}
      {(errored || reducedMotion || !isClient) && (
        <figure className="m-0 h-[260px] w-full sm:h-[320px]">
          <img
            src={poster}
            alt={alt}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </figure>
      )}
      {/* Client, video supported, not reduced motion: real <video>. */}
      {!errored && !reducedMotion && isClient && (
        <figure className="m-0 h-[260px] w-full sm:h-[320px]">
          <video
            ref={videoRef}
            src={mp4}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            className="h-full w-full object-cover"
            onError={handleError}
          >
            {webm && <source src={webm} type="video/webm" />}
            <source src={mp4} type="video/mp4" />
            {/* Final fallback if <video> itself is unsupported */}
            <img
              src={poster}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </video>
          {/* Subtle playback overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300" aria-hidden="true" />
          <button
            type="button"
            aria-label={`Play ${label}`}
            className="absolute inset-0 z-10 h-full w-full bg-transparent focus:ring-0"
            onClick={() => {
              const el = videoRef.current;
              if (!el) return;
              if (el.paused) el.play().catch(() => {});
              else el.pause();
            }}
          />
        </figure>
      )}
    </div>
  );
}
