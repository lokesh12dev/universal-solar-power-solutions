import type { Metadata } from "next";
import { Container, SectionHeading, Breadcrumbs, CTAButton } from "@/components/ui";
import { Reveal, Sequence, Step, TechLine, MaskReveal } from "@/components/effects";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "About Universal Solar Power Solutions", description: "Chennai solar EPC — survey, design, installation, maintenance and re-engineering. Honest scope, no invented credentials.", alternates: { canonical: "/about" }, openGraph: { title: "About Universal Solar Power Solutions", description: "Chennai solar EPC — survey, design, installation, maintenance and re-engineering. Honest scope, no invented credentials.", url: "/about", type: "website" }, twitter: { card: "summary_large_image", title: "About Universal Solar Power Solutions", description: "Chennai solar EPC — survey, design, installation, maintenance and re-engineering. Honest scope, no invented credentials." } };

export default function Page() {
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <Sequence>
              <Step><SectionHeading eyebrow="About" title="An engineering-led solar team in Chennai" sub="We do three things well: build new plants (EPC), care for running plants (O&M), and fix underperforming plants (re-engineering)." /></Step>
              <Step variant="line"><TechLine className="mt-5" /></Step>
            </Sequence>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-[1.75] text-slate">
              <p>Universal Solar Power Solutions is based in Anakaputhur, Chennai and serves homes, businesses and factories across the region. Every project starts with a site survey — roof, shade, structure, load and sanctioned capacity — before any price is quoted.</p>
              <p>We publish only what we can prove: genuine site photos, a transparent process and editable calculator assumptions. Statistics, certifications and brand partnerships appear here only after written verification.</p>
            </div>
            <div className="mt-6 rounded-3xl border border-line bg-ice/60 p-5">
              <p className="flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-royal"><span className="h-1.5 w-1.5 rounded-full bg-royal" aria-hidden="true" /> Pending verification — not yet published as fact</p>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate">{site.needsVerification.map((n) => <li key={n} className="flex gap-2"><span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-royal/60" />{n}</li>)}</ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/contact" variant="dark">Talk to us</CTAButton><CTAButton href="/projects" variant="dark" className="bg-white !text-royal border border-line">See site work</CTAButton></div>
          </div>
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <MaskReveal src="/images/legacy/project6.jpeg" alt="Large rooftop solar plant — Universal Solar site photo" width={600} height={500} sizes="(max-width: 1024px) 50vw, 25vw" dir="left" className="h-52 overflow-hidden rounded-3xl shadow-xl sm:h-64" imgClassName="img-vivid" />
              <MaskReveal src="/images/legacy/project5.jpeg" alt="Ground foundation work — Universal Solar site photo" width={600} height={500} sizes="(max-width: 1024px) 50vw, 25vw" dir="right" delay={120} className="h-52 overflow-hidden rounded-3xl shadow-xl sm:h-64" imgClassName="img-vivid" />
              <MaskReveal src="/images/legacy/project2.jpeg" alt="Mounting rails across an industrial roof — Universal Solar site photo" width={1000} height={420} sizes="(max-width: 1024px) 100vw, 50vw" dir="up" delay={240} className="col-span-2 h-48 overflow-hidden rounded-3xl shadow-xl sm:h-56" imgClassName="img-vivid" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
