import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading, Breadcrumbs } from "@/components/ui";
import { Reveal, Sequence, Step, TechLine } from "@/components/effects";
import { products } from "@/content/products";
import { asset } from "@/lib/assets";

export const metadata: Metadata = { title: "Solar Systems & Equipment", description: "Engineered solar systems and equipment — panels, inverters, storage, structures. Makes confirmed in your proposal.", alternates: { canonical: "/products" }, openGraph: { title: "Solar Systems & Equipment", description: "Engineered solar systems and equipment — panels, inverters, storage, structures. Makes confirmed in your proposal.", url: "/products", type: "website" }, twitter: { card: "summary_large_image", title: "Solar Systems & Equipment", description: "Engineered solar systems and equipment — panels, inverters, storage, structures. Makes confirmed in your proposal." } };

export default function Page() {
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Systems" }]} />
        <Sequence>
            <Step><SectionHeading eyebrow="Systems & equipment" title="Solutions first, equipment matched to site" sub="We engineer complete systems — not fixed packages. Makes, wattages and warranties are confirmed in your proposal, never invented here." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
              <article className="glow-card flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white">
                <div className="relative h-52"><Image src={asset(p.image)} alt={p.imageAlt} width={700} height={450} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan">{p.category}</span></div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display break-words text-lg font-extrabold text-navy">{p.name}</h2>
                  <p className="mt-2 text-sm text-slate leading-relaxed">{p.short}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/products/${p.slug}`} className="btn-primary glow-btn inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white transition">Details →</Link>
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-bold text-royal transition hover:border-royal">Request quote →</Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
