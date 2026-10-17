import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDown, ShieldCheck, Wrench, ClipboardCheck, Calculator, Phone, MapPin, Zap, Leaf } from "lucide-react";
import { HeroBackground } from "@/components/HeroBackground";
import { Container, SectionHeading, CTAButton } from "@/components/ui";
import { SectionVideo } from "@/components/SectionVideo";
import { ClientQuestions } from "@/components/ClientQuestions";
import { Reveal, Parallax, Sequence, Step, TechLine, MaskReveal, Words, Magnetic, ScrollFill, ScrollOpen } from "@/components/effects";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { articles } from "@/content/resources";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";
import { TrackedCTA } from "@/components/TrackedCta";
import { FutureExperience } from "@/components/FutureExperience";
import { ProcessShowcase } from "@/components/ProcessShowcase";
import { PanelEngineering } from "@/components/PanelEngineering";
import { SystemDiagram } from "@/components/SystemDiagram";

export default function Home() {
  return (
    <>
      {/* HERO — cinematic full-bleed solar-banner-1920 + 768/1280 derivatives in public/images.
          Entrance: image settle → eyebrow → headline lines → description → CTAs → scroll cue.
          All copy visible without JS (JS-gated .entrance/.words states). */}
      <section className="grain relative overflow-hidden bg-coal text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <HeroBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-coal/90 via-[#0B1A2E]/55 to-coal" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(720px 360px at 50% 0%, rgba(221,181,107,.14), transparent 65%)" }} />
        </div>
        <div className="ambient-sun" aria-hidden="true" />
        <Container className="relative flex min-h-[82svh] flex-col justify-center px-5 pb-14 pt-16 text-center sm:px-8 lg:pb-[4.5rem] lg:pt-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <p className="entrance entrance-1 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto w-full max-w-3xl text-balance text-center text-xl font-extrabold tracking-wide text-white sm:text-2xl">
              Universal Solar Power Solutions
            </p>
            <h1 className="display-hero mx-auto mt-6 block w-full max-w-3xl break-words text-center font-extrabold">
              <Words step={20} className="words-fast inline-block! w-full! text-center">Powering Your Future<br className="hidden md:block" /> with <span className="text-sun-gradient">Clean, Renewable Energy.</span></Words>
            </h1>
            <p className="entrance entrance-3 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-5 w-full max-w-2xl text-balance text-center text-[1.05rem] leading-relaxed text-white/75">
              Smarter solar solutions for homes, businesses, and industries. From consultation and system design to installation and ongoing support, we help turn sunlight into dependable energy.
            </p>
            <p className="entrance entrance-3 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-5 w-full max-w-full text-balance px-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-goldpale sm:text-[12px] sm:tracking-[0.26em]">
              Serving Chennai, Tamil Nadu, India
            </p>
            <div className="entrance entrance-4 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-9 flex w-full max-w-full flex-wrap items-center justify-center gap-3 text-center">
              <Magnetic className="max-w-full"><TrackedCTA href="/contact" event="quote_cta_click" variant="gold">Request a Solar Consultation <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" /></TrackedCTA></Magnetic>
              <CTAButton href="#solutions" variant="ghost">Explore Solar Solutions <ArrowDown size={17} className="shrink-0" aria-hidden="true" /></CTAButton>
            </div>
          </div>
          <div className="entrance entrance-4 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[13px] font-semibold text-white/70">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-goldbright" /> Anakaputhur, Chennai</span>
            <a href={telHref(site.contact.primaryPhone)} className="flex items-center gap-1.5 hover:text-goldpale"><Phone size={14} className="text-goldbright" /> {site.contact.primaryPhone}</a>
            <Link href="/projects" className="flex items-center gap-1.5 hover:text-goldpale"><ShieldCheck size={14} className="text-goldbright" /> Real site work — see proof</Link>
          </div>
        </Container>
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 px-5 pb-6 sm:px-8" aria-hidden="true">
          <span className="scroll-hint"><span className="scroll-dot" /></span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Illustrative imagery — not a company project</span>
        </div>
        <div className="marquee hero-hairline relative bg-black/30 py-3.5 text-[12px] font-bold uppercase tracking-[0.24em] text-white/60">
          <div className="marquee-track gap-0!" style={{ gap: 0 }} aria-hidden="true">
            {Array(2).fill(["Site Survey", "Engineered Design", "Safe Installation", "Net-Metering Support", "Commissioning", "O&M", "Re-Engineering"]).flat().map((t, i) => (
              <span key={i} className="flex items-center gap-10 pr-10"><span>{t}</span><span className="h-1 w-1 rounded-full bg-cyan/60" /></span>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS — "Good decisions. Start with clarity." Three coordinated cards. */}
      <section id="solutions" className="py-16 sm:py-20">
        <Container>
          <Sequence>
            <Step><SectionHeading eyebrow="Solutions" title="Good decisions. Start with clarity." sub="Three engineered journeys — not generic packages. Each starts with a survey." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
          <Sequence className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={130}>
            {services.map((s) => (
              <Step key={s.slug} className="h-full min-w-0">
                <article className="glow-card sheen group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-[0_18px_44px_-28px_rgba(7,20,38,.35)]">
                  <div className="relative h-52">
                    <ScrollOpen className="h-52 overflow-hidden">
                      <MaskReveal src={s.image} alt={s.imageAlt} width={800} height={500} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="h-52 overflow-hidden" imgClassName="img-vivid" />
                    </ScrollOpen>
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan backdrop-blur">{s.title}</span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <h3 className="text-balance break-words font-display text-xl font-extrabold text-navy">{s.headline}</h3>
                    <p className="mt-2 break-words text-[15px] text-slate leading-relaxed">{s.short}</p>
                    <ul className="mt-4 space-y-1.5 text-sm font-semibold text-ink/80">
                      {s.benefits.map((b) => <li key={b} className="flex min-w-0 gap-2"><Zap size={15} className="mt-0.5 shrink-0 text-royal" /><span className="min-w-0 break-words">{b}</span></li>)}
                    </ul>
                    <Link href={`/${s.slug}`} className="link-arrow mt-auto inline-flex items-center gap-1.5 break-words pt-5 text-[15px] font-extrabold text-royal">{s.cta} <ArrowUpRight size={16} className="shrink-0" /></Link>
                  </div>
                </article>
              </Step>
            ))}
          </Sequence>
        </Container>
      </section>

      {/* RESIDENTIAL — "Your home. Powered by possibility." Two-column editorial. */}
      <section className="overflow-hidden py-16 sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal dir="left">
            <Sequence>
              <Step><p className="inline-flex items-center gap-2 rounded-full border border-royal/15 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-royal"><span className="h-1.5 w-1.5 rounded-full bg-royal" /> A smarter approach to home energy</p></Step>
              <Step><h2 className="display-section mt-4 font-extrabold text-navy">Your home.<br />Powered by possibility.</h2></Step>
              <Step><p className="mt-4 max-w-xl text-[1.05rem] leading-[1.75] text-slate">We design a rooftop system around your home — its roof, its electricity use, and your family&#39;s needs. You see the full picture, in plain language, before you decide anything.</p></Step>
              <Step variant="line"><TechLine className="mt-5" /></Step>
              <Step>
                <ul className="mt-6 grid gap-2.5">
                  {[["Less daytime grid use", "Your system is sized for the hours your home uses power most."], ["Roof-first engineering", "Shade, roof direction, and structure are checked before any proposal."], ["Backup when it matters", "Battery options for outages and essential loads — only if your home needs them."]].map(([h, d]) => (
                    <li key={h} className="rounded-2xl border border-line bg-white p-4 shadow-sm"><p className="font-bold text-navy">{h}</p><p className="mt-1 text-sm leading-relaxed text-slate">{d}</p></li>
                  ))}
                </ul>
              </Step>
              <Step><div className="mt-6"><CTAButton href="/residential-solar" variant="dark">Explore Residential Solar <ArrowUpRight size={16} aria-hidden="true" /></CTAButton></div></Step>
            </Sequence>
          </Reveal>
          <Reveal dir="right" delay={120}>
            <Parallax speed={0.04}>
              <SectionVideo dir="right" poster="/images/residential-solar-poster.jpg" desktopSrc="/videos/residential-solar-1080.mp4" mobileSrc="/videos/residential-solar-720.mp4" alt="Aerial view of a rooftop solar array on a residential building — illustrative footage" className="rounded-[1.6rem] shadow-2xl" caption="Illustrative installation footage — not a company project" />
            </Parallax>
          </Reveal>
        </Container>
      </section>

      {/* COMMERCIAL — "A smarter energy strategy starts here." Technical editorial. */}
      <section className="relative overflow-hidden bg-coalsec py-16 text-white sm:py-24">
        <div className="ambient-sun" aria-hidden="true" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-2">
          <Reveal dir="left" className="order-2 lg:order-1">
            <Parallax speed={0.04}>
              <SectionVideo dir="left" poster="/images/commercial-solar-poster.jpg" desktopSrc="/videos/commercial-solar-1080.mp4" mobileSrc="/videos/commercial-solar-720.mp4" alt="Aerial view of large factory rooftops covered with solar panels — illustrative footage" className="overflow-hidden rounded-[1.6rem] shadow-2xl ring-1 ring-white/10" caption="Illustrative installation footage — not a company project" />
            </Parallax>
          </Reveal>
          <div className="order-1 lg:order-2">
            <Sequence>
              <Step><p className="inline-flex items-center gap-2 rounded-full border border-goldbright/30 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-goldpale"><span className="h-1.5 w-1.5 rounded-full bg-goldbright" /> Energy for business</p></Step>
              <Step><h2 className="display-section mt-4 font-extrabold text-white">A smarter energy strategy starts here.</h2></Step>
              <Step><p className="mt-4 max-w-xl text-[1.05rem] leading-[1.75] text-white/70">We plan and install rooftop solar for offices, factories, schools, and institutions. Every plan begins with your energy consumption, roof structure, and business goals — so the numbers are clear before you invest.</p></Step>
              <Step>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {[["Offices & institutions", "Daytime loads that solar covers well."], ["Factories & warehouses", "Large roofs, large generation potential."], ["Load assessment", "Your consumption, measured from real data."], ["Capacity planning", "Sized to your roof area and demand."], ["Scenario analysis", "Compare options before committing."], ["O&M & monitoring", "Performance tracked after commissioning."]].map(([h, d]) => (
                    <li key={h} className="rounded-2xl border border-white/10 bg-white/5 p-3.5"><p className="text-sm font-bold text-white/90">{h}</p><p className="mt-1 text-xs leading-relaxed text-white/55">{d}</p></li>
                  ))}
                </ul>
              </Step>
              <Step><div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/commercial-solar" variant="gold">Explore Commercial Solar <ArrowUpRight size={16} aria-hidden="true" /></CTAButton><CTAButton href="/solar-savings-calculator" variant="ghost">Estimate generation</CTAButton></div></Step>
            </Sequence>
          </div>
        </Container>
      </section>

      {/* FUTURE EXPERIENCE — Lumora-grade upgraded dark journey */}
      <FutureExperience />

      {/* PROCESS — dark showcase matching the new design */}
      <ProcessShowcase />

      {/* TECH / INSTALLER IMAGERY */}
      <section className="py-20">
        <Container>
          <ScrollFill className="mb-8" />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal dir="left">
              <Sequence>
              <Step><SectionHeading eyebrow="Engineering-led" title="Installed like infrastructure, not appliances" sub="Structures, string design, earthing, monitoring — the unglamorous work that decides long-term generation." /></Step>
              <Step variant="line"><TechLine className="mt-5" /></Step>
              <Step>
              <ul className="mt-6 grid gap-3">
                {[["ClipboardCheck", "Survey-checked structure for sheet, RCC and ground roofs"], ["Wrench", "In-house installation discipline + commissioning checklist"], ["Leaf", "O&M and re-engineering for ageing plants"]].map(([I, t]) => (
                  <li key={t} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 font-semibold shadow-sm"><span className="icon-chip h-10 w-10 shrink-0" aria-hidden="true">{I === "ClipboardCheck" ? <ClipboardCheck size={19} aria-hidden="true" /> : I === "Wrench" ? <Wrench size={19} aria-hidden="true" /> : <Leaf size={19} aria-hidden="true" />}</span>{t}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/products" variant="dark">Explore systems</CTAButton><CTAButton href="/projects" variant="dark" className="bg-white! text-royal! border border-line">See site work</CTAButton></div>
              </Step>
              </Sequence>
            </Reveal>
            <Reveal dir="right" delay={120}>
              <Parallax speed={0.05}>
              <div className="grid grid-cols-2 gap-4">
                <MaskReveal src="/images/legacy/project4.jpeg" alt="Completed rooftop solar array — Universal Solar site photo" width={600} height={700} sizes="(max-width: 1024px) 100vw, 25vw" dir="left" className="h-56 overflow-hidden rounded-[1.4rem] shadow-xl sm:h-72" imgClassName="img-vivid" />
                <MaskReveal src="/images/legacy/project1.jpeg" alt="Mounting rails on an industrial sheet roof — Universal Solar site photo" width={600} height={700} sizes="(max-width: 1024px) 100vw, 25vw" dir="right" delay={130} className="mt-8 h-56 overflow-hidden rounded-[1.4rem] shadow-xl sm:h-72" imgClassName="img-vivid" />
                <MaskReveal src="/images/legacy/project6.jpeg" alt="Large rooftop solar plant — Universal Solar site photo" width={600} height={400} sizes="(max-width: 1024px) 100vw, 50vw" delay={260} className="col-span-2 h-48 overflow-hidden rounded-[1.4rem] shadow-xl sm:h-56" imgClassName="img-vivid" />
              </div>
              </Parallax>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* PROJECTS */}
      <section className="bg-navy py-20 text-white grain relative">
        <Container>
          <ScrollFill className="mb-8 scrollfill-on-dark" />
          <Sequence>
            <Step><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Site work</p></Step>
            <Step><h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold">Real roofs. Real structures. <span className="text-cyan">No stock pretending.</span></h2></Step>
            <Step><p className="mt-3 max-w-2xl text-white/65">Genuine Universal Solar site photos from Chennai projects. Capacities and customer details are withheld until approved for publication — that honesty is deliberate.</p></Step>
            <Step variant="line"><TechLine className="mt-5 [&_.techline-track]:bg-white/15 [&_.techline-mark]:text-cyan" /></Step>
          </Sequence>
          <Sequence className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={120}>
            {projects.slice(0, 6).map((p) => (
              <Step key={p.slug} className="h-full">
                <Link href={`/projects/${p.slug}`} className="glow-card sheen link-arrow group block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <MaskReveal src={p.image} alt={p.imageAlt} width={700} height={450} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-52 overflow-hidden" />
                  <div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-cyan">{p.category} · {p.location}</p>
                    <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-extrabold">{p.title} <ArrowRight size={17} className="text-cyan" /></h3></div>
                </Link>
              </Step>
            ))}
          </Sequence>
          <Reveal className="mt-8"><Link href="/projects" className="link-arrow inline-flex items-center gap-2 font-bold text-cyan">View all site work <ArrowRight size={17} /></Link></Reveal>
        </Container>
      </section>

      {/* CALCULATOR PREVIEW — "See what sunlight could do." */}
      <section className="py-20">
        <Container>
          <Sequence className="mb-10">
            <Step><p className="inline-flex items-center gap-2 rounded-full border border-royal/15 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-royal"><span className="h-1.5 w-1.5 rounded-full bg-royal" /> Solar intelligence</p></Step>
            <Step><h2 className="display-section mt-4 font-extrabold text-navy">See what sunlight could do.</h2></Step>
            <Step><p className="mt-3 max-w-2xl text-slate">Five planning tools — home savings, business ROI, roof studio, bill analysis, solar + battery. Indicative scenarios with transparent assumptions.</p></Step>
          </Sequence>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-2xl grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <SectionHeading eyebrow="Estimator" title="What size might you need?" sub="Answer two questions — bill and roof — and get an indicative size, generation and savings range. Editable assumptions, no email wall." />
              <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/solar-savings-calculator" variant="dark"><Calculator size={18} /> Open the solar studio</CTAButton></div>
              <p className="mt-4 text-sm text-slate">Example: ₹3,000 bill at ₹7.5/unit ≈ 400 units/mo → ~3 kW indicative. Survey confirms.</p>
            </div>
            <div className="relative min-h-[280px]">
              <MaskReveal src="/images/legacy/project6.jpeg" alt="Large commissioned rooftop plant — Universal Solar site photo" width={900} height={600} sizes="(max-width: 1024px) 100vw, 50vw" dir="left" className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* PANEL ENGINEERING — scroll-linked layer story, SVG, no new deps */}
      <PanelEngineering />

      {/* COMPLETE SYSTEM — interactive diagram, accessible node buttons */}
      <SystemDiagram />

      {/* RESOURCES */}
      <section className="pb-4">
        <Container>
          <Sequence>
            <Step><SectionHeading eyebrow="Learn" title="Solar, explained honestly" /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
          <Sequence className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={120}>
            {articles.slice(0, 3).map((a) => (
              <Step key={a.slug} className="h-full">
                <Link href={`/resources/${a.slug}`} className="glow-card link-arrow block h-full rounded-3xl border border-line bg-white p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-royal">{a.category} · {a.readMins} min</p>
                  <h3 className="mt-2 font-display text-lg font-extrabold text-navy">{a.title}</h3>
                  <p className="mt-2 text-sm text-slate">{a.intro}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-royal">Read guide <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              </Step>
            ))}
          </Sequence>
          <Reveal className="mt-8"><Link href="/resources" className="link-arrow inline-flex items-center gap-2 font-bold text-royal">View all guides <ArrowRight size={17} aria-hidden="true" /></Link></Reveal>
        </Container>
      </section>

      {/* CLIENT QUESTIONS — premium FAQ accordion */}
      <ClientQuestions />

      {/* FINAL CTA */}
      <section className="py-14">
        <Container>
          <ScrollFill className="mb-8" />
          <Reveal dir="zoom">
          <Parallax speed={-0.03}>
          <Sequence>
          <div className="relative overflow-hidden rounded-[1.6rem] bg-coal px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <div className="ambient-sun" aria-hidden="true" />
            <Step><p className="relative text-[11px] font-bold uppercase tracking-[0.26em] text-goldpale">Your roof · Your energy · Your decision</p></Step>
            <Step><h2 className="relative mx-auto mt-3 max-w-2xl text-balance text-3xl font-extrabold sm:text-4xl">Ready to explore solar for your property?</h2></Step>
            <Step><p className="relative mx-auto mt-3 max-w-xl text-white/65">Start with your energy needs. Understand your options and take the next step towards a suitable solar solution.</p></Step>
            <Step>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <TrackedCTA href="/contact" event="quote_cta_click" variant="gold">Request a Solar Consultation <ArrowUpRight size={17} aria-hidden="true" /></TrackedCTA>
              <CTAButton href="/solar-savings-calculator" variant="ghost">Explore Solar Savings</CTAButton>
              <a href={telHref(site.contact.primaryPhone)} aria-label={`Call ${site.contact.primaryPhone}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-bold text-white transition hover:border-goldbright hover:text-goldpale"><Phone size={17} aria-hidden="true" /> {site.contact.primaryPhone}</a>
            </div>
            </Step>
          </div>
          </Sequence>
          </Parallax>
          </Reveal>
        </Container>
      </section>

      {/* FAQ + ENQUIRY lives in the dark FutureExperience finale — no duplicate light section. */}
    </>
  );
}
