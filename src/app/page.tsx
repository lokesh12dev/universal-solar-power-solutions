import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench, ClipboardCheck, Calculator, Phone, MapPin, Zap, Leaf } from "lucide-react";
import { Container, SectionHeading, CTAButton } from "@/components/ui";
import { Reveal, Parallax, Sequence, Step, TechLine, MaskReveal, Words, Magnetic, ScrollFill } from "@/components/effects";
import { EnquiryForm } from "@/components/EnquiryForm";
import { VideoBox } from "@/components/VideoBox";
import { services, processSteps } from "@/content/services";
import { projects } from "@/content/projects";
import { articles } from "@/content/resources";
import { faqs } from "@/content/faqs";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";
import { TrackedCTA } from "@/components/TrackedCta";
import { FaqAccordion } from "@/components/Faq";

export default function Home() {
  return (
    <>
      {/* HERO — centered cinematic, solar-banner-1920 full-bleed + 768/1280 derivatives in public/images */}
      <section className="grain relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src="/images/solar-banner-1920.jpg" alt="" width={1920} height={1280} priority fetchPriority="high" sizes="100vw" className="hero-kenburns motion-reduce:animate-none motion-reduce:transform-none h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/45 to-navy/90" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(720px 360px at 50% 0%, rgba(56,217,245,.12), transparent 65%)" }} />
        </div>
        <Container className="relative flex min-h-[78svh] flex-col justify-center px-5 pb-14 pt-16 text-center sm:px-8 lg:pb-[4.5rem] lg:pt-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <p className="entrance entrance-1 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-cyan sm:text-[11px] sm:tracking-[0.24em]">
              <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" /> ENGINEERING A CLEANER TOMORROW
            </p>
            <p className="entrance entrance-2 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-8 w-full max-w-3xl text-balance text-center text-2xl font-extrabold tracking-wide text-white sm:text-4xl">
              Universal Solar Power Solutions
            </p>
            <h1 className="display-hero mx-auto mt-6 block w-full max-w-3xl break-words text-center font-extrabold">
              <Words step={55} className="inline-block! w-full! text-center">Powering India&apos;s Future<br className="hidden md:block" /> with <span className="text-tech-gradient">Clean Energy.</span></Words>
            </h1>
            <p className="entrance entrance-3 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-5 w-full max-w-2xl text-balance text-center text-[1.05rem] leading-relaxed text-frost">
              Smarter solar solutions for homes, businesses, and industries. From consultation and system design to installation and ongoing support, we help turn sunlight into dependable energy.
            </p>
            <p className="entrance entrance-3 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-5 w-full max-w-full text-balance px-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-cyan sm:text-[12px] sm:tracking-[0.26em]">
              SERVING CHENNAI, TAMIL NADU, INDIA
            </p>
            <div className="entrance entrance-4 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-9 flex w-full max-w-full flex-wrap items-center justify-center gap-3 text-center">
              <Magnetic className="max-w-full"><TrackedCTA href="/products" event="quote_cta_click">Explore Solar Solutions <ArrowRight size={17} className="shrink-0" aria-hidden="true" /></TrackedCTA></Magnetic>
              <CTAButton href="/contact" variant="ghost"><Calculator size={17} className="shrink-0" aria-hidden="true" /> Get a Free Consultation</CTAButton>
            </div>
          </div>
          <div className="entrance entrance-4 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[13px] font-semibold text-white/70">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-cyan" /> Anakaputhur, Chennai</span>
            <a href={telHref(site.contact.primaryPhone)} className="flex items-center gap-1.5 hover:text-cyan"><Phone size={14} className="text-cyan" /> {site.contact.primaryPhone}</a>
            <Link href="/projects" className="flex items-center gap-1.5 hover:text-cyan"><ShieldCheck size={14} className="text-cyan" /> Real site work — see proof</Link>
          </div>
        </Container>
        <div className="relative mx-auto flex w-full max-w-7xl justify-center px-5 pb-6 sm:px-8" aria-hidden="true">
          <span className="scroll-hint"><span className="scroll-dot" /></span>
        </div>
        <div className="marquee hero-hairline relative bg-black/30 py-3.5 text-[12px] font-bold uppercase tracking-[0.24em] text-white/60">
          <div className="marquee-track gap-0!" style={{ gap: 0 }} aria-hidden="true">
            {Array(2).fill(["Site Survey", "Engineered Design", "Safe Installation", "Net-Metering Support", "Commissioning", "O&M", "Re-Engineering"]).flat().map((t, i) => (
              <span key={i} className="flex items-center gap-10 pr-10"><span>{t}</span><span className="h-1 w-1 rounded-full bg-cyan/60" /></span>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO HERO — real site footage, auto-plays muted when in view */}
      <section className="py-16 sm:py-22 border-y border-line">
        <Container>
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royal mb-3">Engineering in motion</p>
            <h2 className="display-section font-extrabold text-navy mb-8 text-center sm:text-4xl">See how we build rooftop solar — survey, structure, installation, commissioning.</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              <VideoBox
                mp4="/videos/home-hero.mp4"
                webm="/videos/home-hero.webm"
                poster="/images/legacy/project6.jpeg"
                alt="Large rooftop solar plant being installed — Universal Solar Chennai site footage"
                label="Rooftop solar installation timelapse"
                className="col-span-2 sm:col-span-1"
              />
              <VideoBox
                mp4="/videos/commercial-strategy.mp4"
                webm="/videos/commercial-strategy.webm"
                poster="/images/legacy/project4.jpeg"
                alt="Commercial rooftop solar array on a factory — Universal Solar Chennai site footage"
                label="Commercial solar array overview"
              />
              <VideoBox
                mp4="/videos/home-hero.mp4"
                webm="/videos/home-hero.webm"
                poster="/images/legacy/project1.jpeg"
                alt="Mounting structures on an industrial sheet roof — Universal Solar Chennai site footage"
                label="Mounting structure installation"
              />
            </div>
            <p className="mt-8 text-center text-sm text-slate">All footage is from genuine Universal Solar project sites in Chennai. Customer details are withheld until approved for publication.</p>
          </div>
        </Container>
      </section>

      {/* SOLUTIONS */}
      <section className="py-16 sm:py-20">
        <Container>
          <Sequence>
            <Step><SectionHeading eyebrow="Solutions" title="Pick your path to solar" sub="Three engineered journeys — not generic packages. Each starts with a survey." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
          <Sequence className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={130}>
            {services.map((s) => (
              <Step key={s.slug} className="h-full min-w-0">
                <article className="glow-card sheen group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-[0_18px_44px_-28px_rgba(7,20,38,.35)]">
                  <div className="relative h-52">
                    <MaskReveal src={s.image} alt={s.imageAlt} width={800} height={500} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="h-52 overflow-hidden" imgClassName="img-vivid" />
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan backdrop-blur">{s.title}</span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <h3 className="text-balance break-words font-display text-xl font-extrabold text-navy">{s.title}</h3>
                    <p className="mt-2 break-words text-[15px] text-slate leading-relaxed">{s.short}</p>
                    <ul className="mt-4 space-y-1.5 text-sm font-semibold text-ink/80">
                      {s.benefits.map((b) => <li key={b} className="flex min-w-0 gap-2"><Zap size={15} className="mt-0.5 shrink-0 text-royal" /><span className="min-w-0 break-words">{b}</span></li>)}
                    </ul>
                    <Link href={`/${s.slug}`} className="link-arrow mt-auto inline-flex items-center gap-1.5 break-words pt-5 text-[15px] font-extrabold text-royal">Explore {s.title} <ArrowRight size={16} className="shrink-0" /></Link>
                  </div>
                </article>
              </Step>
            ))}
          </Sequence>
        </Container>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-20 border-y border-line">
        <Container>
          <ScrollFill className="mb-8" />
          <Sequence>
            <Step><SectionHeading eyebrow="Our working process" title="Simple steps to switch to solar energy" sub="The same disciplined flow behind every Universal Solar installation — using our own site photos." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
          <div className="timeline mt-10 grid gap-8 sm:grid-cols-2 sm:gap-5 sm:gap-y-10 lg:grid-cols-4">
            {processSteps.map((p, i) => (
              <Reveal key={p.n} delay={i * 90} className="h-full">
                <div className="glow-card relative h-full rounded-[1.4rem] border border-line bg-ice p-6 pt-20 text-center">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Image src={`/images/legacy/project${[3, 2, 4, 6][i]}.jpeg`} alt={`Universal Solar site work step ${p.n}`} width={160} height={160} loading="lazy" sizes="96px" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl" />
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan to-royal px-4 py-1 font-display text-lg font-extrabold text-white shadow-lg">{p.n}</span>
                  </div>
                  <h3 className="display-card mt-8 font-display font-extrabold text-navy">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <a href={telHref(site.contact.primaryPhone)} className="inline-flex items-center gap-2 rounded-full border border-royal px-6 py-3 font-bold text-royal hover:bg-royal hover:text-white transition"><Phone size={17} /> Talk to us: {site.contact.primaryPhone}</a>
          </Reveal>
        </Container>
      </section>

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
                <MaskReveal src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop" alt="Vivid solar array glowing under a bright dramatic sky" width={600} height={700} sizes="(max-width: 1024px) 100vw, 25vw" dir="left" className="h-56 overflow-hidden rounded-[1.4rem] shadow-xl sm:h-72" imgClassName="img-vivid" />
                <MaskReveal src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop" alt="Engineer wiring solar electrical infrastructure in bright light" width={600} height={700} sizes="(max-width: 1024px) 100vw, 25vw" dir="right" delay={130} className="mt-8 h-56 overflow-hidden rounded-[1.4rem] shadow-xl sm:h-72" imgClassName="img-vivid" />
                <MaskReveal src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1000&auto=format&fit=crop" alt="Bright rooftop solar panels on a home under clear blue sky" width={600} height={400} sizes="(max-width: 1024px) 100vw, 50vw" delay={260} className="col-span-2 h-48 overflow-hidden rounded-[1.4rem] shadow-xl sm:h-56" imgClassName="img-vivid" />
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

      {/* CALCULATOR PREVIEW */}
      <section className="py-20">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-2xl grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <SectionHeading eyebrow="Estimator" title="What size might you need?" sub="Answer two questions — bill and roof — and get an indicative size, generation and savings range. Editable assumptions, no email wall." />
              <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/solar-savings-calculator" variant="dark"><Calculator size={18} /> Open full calculator</CTAButton></div>
              <p className="mt-4 text-sm text-slate">Example: ₹3,000 bill at ₹7.5/unit ≈ 400 units/mo → ~3 kW indicative. Survey confirms.</p>
            </div>
            <div className="relative min-h-[280px]">
              <MaskReveal src="/images/legacy/project6.jpeg" alt="Large commissioned rooftop plant — Universal Solar site photo" width={900} height={600} sizes="(max-width: 1024px) 100vw, 50vw" dir="left" className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </Container>
      </section>

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

      {/* CTA BAND */}
      <section className="py-14">
        <Container>
          <ScrollFill className="mb-8" />
          <Reveal dir="zoom">
          <Parallax speed={-0.03}>
          <Sequence>
          <div className="relative overflow-hidden rounded-[1.6rem] bg-navy px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-cyan/25 blur-[100px]" />
              <div className="absolute -bottom-28 right-[20%] h-64 w-96 rounded-full bg-cyan/10 blur-[100px]" />
            </div>
            <Step><p className="relative text-[11px] font-bold uppercase tracking-[0.26em] text-cyan">Free site assessment · Chennai</p></Step>
            <Step><h2 className="relative mx-auto mt-3 max-w-2xl text-balance text-3xl font-extrabold sm:text-4xl">Know your roof&apos;s solar potential in one visit.</h2></Step>
            <Step><p className="relative mx-auto mt-3 max-w-xl text-white/65">Bill + roof photos first, survey next, transparent proposal after. No spam, no pressure.</p></Step>
            <Step>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <TrackedCTA href="/contact" event="quote_cta_click">Get My Free Quote <ArrowRight size={17} aria-hidden="true" /></TrackedCTA>
              <CTAButton href="/plan-my-solar" variant="ghost">Plan My Solar System</CTAButton>
              <a href={telHref(site.contact.primaryPhone)} aria-label={`Call ${site.contact.primaryPhone}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[15px] font-bold text-white transition hover:border-cyan hover:text-cyan"><Phone size={17} aria-hidden="true" /> {site.contact.primaryPhone}</a>
            </div>
            </Step>
          </div>
          </Sequence>
          </Parallax>
          </Reveal>
        </Container>
      </section>

      {/* FAQ + ENQUIRY */}
      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="min-w-0">
              <Sequence>
                <Step><SectionHeading eyebrow="FAQ" title="Straight answers" /></Step>
                <Step variant="line"><TechLine className="mt-5" /></Step>
                <Step><FaqAccordion items={faqs} /></Step>
              </Sequence>
            </div>
            <Reveal delay={120} className="min-w-0">
              <div className="rounded-[2rem] border border-line bg-white p-7 sm:p-9 shadow-2xl">
                <h2 className="font-display text-2xl font-extrabold text-navy">Request a Solar Consultation</h2>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate"><MapPin size={15} /> Serving Chennai & surroundings · We aim to respond within one working day</p>
                <div className="mt-6"><EnquiryForm /></div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
