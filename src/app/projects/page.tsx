import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading, Breadcrumbs } from "@/components/ui";
import { Sequence, Step, TechLine, MaskReveal } from "@/components/effects";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Site Work & Projects", description: "Genuine Universal Solar site photos from Chennai — mounting, rooftop arrays and ground work. No fabricated capacities.", alternates: { canonical: "/projects" }, openGraph: { title: "Site Work & Projects", description: "Genuine Universal Solar site photos from Chennai — mounting, rooftop arrays and ground work. No fabricated capacities.", url: "/projects", type: "website" }, twitter: { card: "summary_large_image", title: "Site Work & Projects", description: "Genuine Universal Solar site photos from Chennai — mounting, rooftop arrays and ground work. No fabricated capacities." } };

export default function Page() {
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
        <Sequence>
            <Step><SectionHeading eyebrow="Site work" title="Genuine photos from our Chennai sites" sub="Mounting rails, RCC structures, piling and completed arrays. We publish only what we can prove — capacities and customer names on request with consent." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
        <Sequence className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={120}>
          {projects.map((p) => (
            <Step key={p.slug} className="h-full">
              <Link href={`/projects/${p.slug}`} className="glow-card sheen link-arrow group block h-full overflow-hidden rounded-3xl border border-line bg-white">
                <MaskReveal src={p.image} alt={p.imageAlt} width={700} height={450} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-56 overflow-hidden" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-royal">{p.category} · {p.location}</p>
                  <h2 className="mt-1 flex items-center gap-1.5 font-display text-lg font-extrabold text-navy">{p.title} <ArrowRight size={17} className="shrink-0 text-royal" aria-hidden="true" /></h2>
                </div>
              </Link>
            </Step>
          ))}
        </Sequence>
        <p className="mt-8 rounded-2xl border border-line bg-ice p-4 text-sm text-slate">Capacity, customer and performance figures are published only with written consent. Ask us for verifiable references during your consultation.</p>
      </Container>
    </section>
  );
}
