import type { Metadata } from "next";
import Image from "next/image";
import { Container, SectionHeading, Breadcrumbs, CTAButton } from "@/components/ui";
import { Reveal, Sequence, Step, TechLine } from "@/components/effects";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "About Universal Solar", description: "Chennai solar EPC — survey, design, installation, maintenance and re-engineering. Honest scope, no invented credentials.", alternates: { canonical: "/about" }, openGraph: { title: "About Universal Solar", description: "Chennai solar EPC — survey, design, installation, maintenance and re-engineering. Honest scope, no invented credentials.", url: "/about", type: "website" }, twitter: { card: "summary_large_image", title: "About Universal Solar", description: "Chennai solar EPC — survey, design, installation, maintenance and re-engineering. Honest scope, no invented credentials." } };

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
            <div className="mt-6 space-y-4 text-slate leading-relaxed">
              <p>Universal Solar Power Solutions is based in Anakaputhur, Chennai and serves homes, businesses and factories across the region. Every project starts with a site survey — roof, shade, structure, load and sanctioned capacity — before any price is quoted.</p>
              <p>We publish only what we can prove: genuine site photos, a transparent process and editable calculator assumptions. Statistics, certifications and brand partnerships appear here only after written verification.</p>
            </div>
            <div className="mt-6 rounded-3xl border border-line bg-white p-5">
              <p className="font-display font-extrabold text-navy">What needs company sign-off (not published as fact):</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate space-y-1">{site.needsVerification.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/contact" variant="dark">Talk to us</CTAButton><CTAButton href="/projects" variant="dark" className="bg-white !text-royal border border-line">See site work</CTAButton></div>
          </div>
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <Image src="/images/legacy/project6.jpeg" alt="Large rooftop solar plant — Universal Solar site photo" width={600} height={500} loading="lazy" sizes="(max-width: 1024px) 100vw, 25vw" className="h-48 w-full rounded-3xl object-cover shadow-xl sm:h-64" />
              <Image src="/images/legacy/project5.jpeg" alt="Ground foundation work — Universal Solar site photo" width={600} height={500} loading="lazy" sizes="(max-width: 1024px) 100vw, 25vw" className="mt-8 h-48 w-full rounded-3xl object-cover shadow-xl sm:h-64" />
              <Image src="/images/legacy/project2.jpeg" alt="Mounting rails across an industrial roof — Universal Solar site photo" width={1000} height={400} loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" className="col-span-2 h-44 w-full rounded-3xl object-cover shadow-xl sm:h-52" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
