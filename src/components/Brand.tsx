import Image from "next/image";

function LogoTile({ size = 40, animate = false }: { size?: number; animate?: boolean }) {
  const inner = Math.round(size * 0.88);
  return (
    <span
      className={animate ? "logo-tile grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white" : "grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white"}
      style={{ width: size, height: size, boxShadow: "0 0 22px rgba(255,255,255,.25), inset 0 0 0 1px rgba(7,20,38,.1)" }}
      aria-hidden="true"
    >
      <Image
        src="/images/legacy/logo.png"
        alt=""
        width={128}
        height={128}
        sizes={`${size}px`}
        quality={90}
        style={{ width: inner, height: inner, objectFit: "contain" }}
        priority={animate}
      />
      {animate && <span className="logo-sweepbar" aria-hidden="true" />}
    </span>
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return <LogoTile size={size} />;
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <LogoMark size={compact ? 36 : 44} />
      <span className="min-w-0 leading-none">
        <span className="font-display block whitespace-nowrap text-[17px] font-bold tracking-[0.02em] text-white">Universal Solar</span>
        <span className="mt-1 block whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan">Power Solutions</span>
      </span>
    </span>
  );
}

/**
 * AnimatedLogo — first-time reveal of the exact company logo tile:
 * tile fades/scales in, a light sweep crosses it, then the wordmark
 * lines reveal (~1.4s, once). Static when reduced motion is preferred.
 */
export function AnimatedLogo({ size = 44 }: { size?: number }) {
  return (
    <span className="logo-anim flex min-w-0 items-center gap-2.5" role="img" aria-label="Universal Solar Power Solutions">
      <LogoTile size={size} animate />
      <span className="min-w-0 leading-none" aria-hidden="true">
        <span className="logo-line font-display block whitespace-nowrap text-[17px] font-bold tracking-[0.02em] text-white"><span>Universal Solar</span></span>
        <span className="logo-line logo-line-2 mt-1 block whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan"><span>Power Solutions</span></span>
      </span>
    </span>
  );
}
