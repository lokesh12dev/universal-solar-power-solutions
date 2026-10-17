import Link from "next/link";
import { cx } from "@/lib/utils";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="inline-flex items-center gap-2 rounded-full border border-royal/15 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">
        <span className="h-1.5 w-1.5 rounded-full bg-royal" /> {eyebrow}
      </p>
      <h2 className="display-section mt-4 font-extrabold text-navy">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-[1.02rem] text-slate leading-relaxed">{sub}</p>}
    </div>
  );
}

export function CTAButton({ href, children, variant = "primary", className = "", onClick }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" | "dark" | "gold"; className?: string; onClick?: () => void }) {
  const styles =
    variant === "primary"
      ? "btn-primary"
      : variant === "gold"
        ? "btn-gold"
        : variant === "dark"
        ? "bg-navy text-white hover:bg-abyss"
        : "border border-white/40 text-white hover:border-cyan hover:text-cyan";
  return (
    <Link href={href} onClick={onClick} className={cx("inline-flex max-w-full items-center justify-center gap-2 break-words rounded-xl px-6 py-3 text-center text-[15px] font-bold transition", styles, className)}>
      {children}
    </Link>
  );
}

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate">
      <ol className="flex flex-wrap gap-2">
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-2">
            {t.href ? <Link href={t.href} className="hover:text-royal underline-offset-4 hover:underline">{t.label}</Link> : <span aria-current="page" className="text-ink font-semibold">{t.label}</span>}
            {i < trail.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
