import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading, Breadcrumbs } from "@/components/ui";
import { Reveal, Sequence, Step, TechLine } from "@/components/effects";
import { articles } from "@/content/resources";

export const metadata: Metadata = { title: "Solar Guides & Resources", description: "Honest solar education — how rooftop solar works, on-grid vs hybrid, roof checks, quotations and maintenance.", alternates: { canonical: "/resources" }, openGraph: { title: "Solar Guides & Resources", description: "Honest solar education — how rooftop solar works, on-grid vs hybrid, roof checks, quotations and maintenance.", url: "/resources", type: "website" }, twitter: { card: "summary_large_image", title: "Solar Guides & Resources", description: "Honest solar education — how rooftop solar works, on-grid vs hybrid, roof checks, quotations and maintenance." } };

export default function Page() {
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
        <Sequence>
            <Step><SectionHeading eyebrow="Resources" title="Learn before you buy" sub="Short, practical guides. General education — your survey gives site-specific answers." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 70} className="h-full">
              <Link href={`/resources/${a.slug}`} className="glow-card link-arrow block h-full rounded-3xl border border-line bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-royal">{a.category} · {a.readMins} min read</p>
                <h2 className="mt-2 font-display text-lg font-extrabold text-navy">{a.title}</h2>
                <p className="mt-2 text-sm text-slate">{a.intro}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-royal">Read guide <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
