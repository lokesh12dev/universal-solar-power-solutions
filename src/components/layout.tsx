"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, ArrowRight, MapPin, Clock, PanelTop, PlugZap, BatteryCharging, LayoutGrid, Activity } from "lucide-react";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { Logo, AnimatedLogo } from "@/components/Brand";
import { ScrollProgress, BackToTop } from "@/components/effects";

const links = [
  { href: "/", label: "Home" },
  { href: "/residential-solar", label: "Residential Solar" },
  { href: "/commercial-solar", label: "Commercial Solar" },
  { href: "/projects", label: "Projects" },
  { href: "/solar-savings-calculator", label: "Solar Calculator" },
  { href: "/support", label: "Services" },
  { href: "/about", label: "About" },
];

const mobileExtra = [
  { href: "/plan-my-solar", label: "Plan My Solar" },
  { href: "/knowledge", label: "Knowledge Centre" },
  { href: "/support", label: "Support Centre" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open ]);
  return (
    <>
    <ScrollProgress />
    <div className="bg-navy text-frost">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-1.5 text-[12px] font-semibold sm:px-6">
        <p className="flex min-w-0 items-center gap-1.5 truncate"><MapPin size={13} className="shrink-0 text-cyan" aria-hidden="true" /> Anakaputhur, Chennai, Tamil Nadu, India</p>
        <a href={telHref(site.contact.primaryPhone)} onClick={() => track("phone_click")} aria-label={`Call ${site.contact.primaryPhone}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-cyan sm:hidden">
          <Phone size={14} aria-hidden="true" />
        </a>
        <p className="hidden items-center gap-4 sm:flex">
          <span className="flex items-center gap-1.5"><Clock size={13} className="text-cyan" aria-hidden="true" /> Mon–Sat 9AM–6PM</span>
          <a href={telHref(site.contact.primaryPhone)} onClick={() => track("phone_click")} className="flex items-center gap-1.5 text-cyan hover:underline"><Phone size={13} aria-hidden="true" /> {site.contact.primaryPhone}</a>
        </p>
      </div>
    </div>
    <header className={`sticky top-0 z-50 border-b border-darkline bg-midnight/92 backdrop-blur-xl transition-shadow ${scrolled ? "site-header-scrolled" : ""}`}>
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-2 px-4 py-3 text-white sm:px-6">
        <Link href="/" className="shrink-0">
          <AnimatedLogo />
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex lg:gap-1" aria-label="Primary">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={`navlink whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold transition xl:px-3 xl:text-sm ${active ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/10 hover:text-cyan"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a href={telHref(site.contact.primaryPhone)} onClick={() => track("phone_click")} className="hidden min-[1500px]:inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-white/90 hover:border-cyan hover:text-cyan">
            <Phone size={16} aria-hidden="true" /> {site.contact.primaryPhone}
          </a>
          <Link href="/contact" className="btn-primary hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold">
            <span className="xl:hidden">Get Quote</span><span className="hidden xl:inline">Request a Solar Consultation</span> <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button ref={btnRef} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy lg:hidden">
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="mobile-nav" hidden={!open} className="border-t border-white/10 px-4 pb-4 sm:px-6 lg:hidden">
        {open && (
        <nav aria-label="Mobile" className="mx-auto mt-3 max-h-[calc(100dvh-6rem)] w-full max-w-7xl overflow-y-auto rounded-2xl border border-line bg-ice p-3 shadow-2xl lg:hidden">
          {[...links, ...mobileExtra, { href: "/contact", label: "Get a Quote" }].map((l, i) => {
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} style={{ animationDelay: `${i * 45}ms` }} className={`mobile-item block rounded-2xl px-4 py-3 text-base font-bold ${active ? "bg-white text-royal" : "text-ink hover:bg-white hover:text-royal"}`}>
                {l.label}
              </Link>
            );
          })}
          <a href={telHref(site.contact.primaryPhone)} onClick={() => { track("phone_click"); setOpen(false); }} className="mt-1 flex items-center gap-2 rounded-2xl bg-navy px-4 py-3 font-bold text-cyan">
            <Phone size={17} aria-hidden="true" /> {site.contact.primaryPhone}
          </a>
        </nav>
        )}
      </div>
    </header>
    <BackToTop />
    </>
  );
}

const componentStrip = [
  { icon: PanelTop, label: "Panels" },
  { icon: PlugZap, label: "Inverters" },
  { icon: BatteryCharging, label: "Storage" },
  { icon: LayoutGrid, label: "Structures" },
  { icon: Activity, label: "Monitoring" },
];

export function Footer() {
  return (
    <footer className="hero-hairline mt-24 bg-navy text-white">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 pt-14 pb-8">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4" aria-label="System components we engineer">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan">We engineer</p>
          {componentStrip.map((c) => (
            <span key={c.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-navy px-3.5 py-1.5 text-[13px] font-bold text-white/80">
              <c.icon size={15} className="text-cyan" aria-hidden="true" /> {c.label}
            </span>
          ))}
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-white/70 leading-relaxed">Chennai-based solar EPC — survey, design, installation, commissioning and maintenance for homes, businesses and industry.</p>
            <p className="mt-4 text-sm text-white/50">Based in Anakaputhur, Chennai 600070 · Mon–Sat 9AM–6PM</p>
          </div>
          <nav aria-label="Company">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan">Explore</p>
            <ul className="mt-4 space-y-2.5 text-white/80">
              {[["/residential-solar","Residential Solar"],["/commercial-solar","Commercial Solar"],["/industrial-solar","Industrial Solar"],["/plan-my-solar","Plan My Solar"],["/solar-savings-calculator","Savings Calculator"],["/knowledge","Knowledge Centre"],["/projects","Projects"],["/resources","Resources"],["/support","Services & Support"],["/about","About"]].map(([h,l]) => (
                <li key={h}><Link href={h} className="hover:text-cyan">{l}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Systems">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan">Systems</p>
            <ul className="mt-4 space-y-2.5 text-white/80">
              {[["/products","All systems & equipment"],["/products/on-grid-rooftop-systems","On-grid rooftops"],["/products/hybrid-backup-systems","Hybrid + storage"],["/products/mounting-structures","Mounting structures"],["/contact","Request a quote"]].map(([h,l]) => (
                <li key={h}><Link href={h} className="hover:text-cyan">{l}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan">Contact</p>
            <ul className="mt-4 space-y-2 text-white/80">
              {site.contact.phones.map((p) => (<li key={p}><a className="hover:text-cyan font-semibold" href={telHref(p)} onClick={() => track("phone_click")}>{p}</a></li>))}
              <li><a className="hover:text-cyan break-all" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              <li className="text-white/60 text-sm">{site.address.line1} {site.address.line2} {site.address.city}-{site.address.pin}, {site.address.state}, {site.address.country}</li>
              <li className="text-white/60 text-sm">{site.contact.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/55">
          <p>© {new Date().getFullYear()} Universal Solar Power Solutions, Chennai. All rights reserved.</p>
          <p className="flex gap-5"><Link href="/privacy-policy" className="hover:text-cyan">Privacy</Link><Link href="/terms" className="hover:text-cyan">Terms</Link><Link href="/contact" className="hover:text-cyan">Contact</Link></p>
        </div>
      </div>
    </footer>
  );
}
