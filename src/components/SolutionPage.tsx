import type { Metadata } from "next";
import { Container, SectionHeading, CTAButton, Breadcrumbs } from "@/components/ui";
import { Sequence, Step, TechLine, MaskReveal } from "@/components/effects";
import { EnquiryForm } from "@/components/EnquiryForm";
import { FaqAccordion } from "@/components/Faq";
import { CheckCircle2 } from "lucide-react";

export type SolutionDef = {
  slug: string; title: string; intro: string; image: string; imageAlt: string;
  points: { h: string; p: string }[]; bullets: string[]; faqs: { q: string; a: string }[];
};

export function solutionMeta(s: SolutionDef): Metadata {
  const title = `${s.title} in Chennai`;
  return {
    title, description: s.intro, alternates: { canonical: `/${s.slug}` },
    openGraph: { title, description: s.intro, url: `/${s.slug}`, type: "website", images: [{ url: s.image, width: 1200, height: 630, alt: s.imageAlt }] },
    twitter: { card: "summary_large_image", title, description: s.intro },
  };
}

export function SolutionPage({ s }: { s: SolutionDef }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="bg-navy text-white hero-glow grain relative overflow-hidden">
        <Container className="grid min-w-0 gap-8 py-14 lg:grid-cols-2 items-center">
          <div className="min-w-0">
            <div className="[&_a]:text-white/75 [&_a:hover]:text-cyan [&_nav]:text-white/55 [&_span[aria-current='page']]:text-white">
              <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: s.title }]} />
            </div>
            <h1 className="mt-4 text-balance break-words text-4xl sm:text-5xl font-extrabold leading-tight">{s.title} <span className="text-cyan">in Chennai</span></h1>
            <p className="mt-4 break-words text-lg text-white/70 leading-relaxed">{s.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton href="/contact">Request site survey</CTAButton>
              <CTAButton href="/solar-savings-calculator" variant="ghost">Estimate size</CTAButton>
            </div>
          </div>
          <MaskReveal src={s.image} alt={s.imageAlt} width={900} height={600} sizes="(max-width: 1024px) 100vw, 50vw" eager dir="right" className="h-[260px] min-w-0 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl sm:h-[340px]" />
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <div className="grid min-w-0 gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div className="min-w-0">
              <Sequence>
                <Step><SectionHeading eyebrow="What we cover" title="Engineered for your roof and load" /></Step>
                <Step variant="line"><TechLine className="mt-5" /></Step>
              </Sequence>
              <Sequence className="mt-8 grid min-w-0 gap-5" stagger={100}>
                {s.points.map((p) => (
                  <Step key={p.h} className="min-w-0">
                    <div className="min-w-0 overflow-hidden rounded-3xl border border-line bg-white p-6"><h2 className="text-balance break-words font-display text-lg font-extrabold text-navy">{p.h}</h2><p className="mt-2 break-words text-slate leading-relaxed">{p.p}</p></div>
                  </Step>
                ))}
              </Sequence>
              <ul className="mt-6 grid min-w-0 gap-2.5 sm:grid-cols-2">
                {s.bullets.map((b) => <li key={b} className="flex min-w-0 gap-2 rounded-2xl bg-white border border-line p-3.5 text-sm font-bold text-navy"><CheckCircle2 size={17} className="text-royal shrink-0 mt-0.5" /><span className="min-w-0 break-words">{b}</span></li>)}
              </ul>
              <div className="mt-10 min-w-0"><h2 className="text-balance break-words font-display text-2xl font-extrabold text-navy">FAQs</h2><FaqAccordion items={s.faqs} /></div>
            </div>
            <div className="h-fit min-w-0 self-start break-words lg:sticky lg:top-24 rounded-[2rem] border border-line bg-white p-6 sm:p-7 shadow-xl">
              <h2 className="font-display text-xl font-extrabold text-navy">Get a surveyed proposal</h2>
              <p className="mt-1 text-sm text-slate">Share your bill + PIN. We aim to call back within one working day.</p>
              <div className="mt-5"><EnquiryForm compact /></div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
