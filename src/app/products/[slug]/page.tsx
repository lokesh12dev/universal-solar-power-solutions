import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container, Breadcrumbs, CTAButton } from "@/components/ui";
import { Sequence, Step, TechLine } from "@/components/effects";
import { products } from "@/content/products";
import { asset } from "@/lib/assets";

export async function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return { title: "Not found" };
  return { title: p.name, description: p.short, alternates: { canonical: `/products/${slug}` }, openGraph: { title: p.name, description: p.short, url: `/products/${slug}`, type: "website", images: [{ url: p.image, alt: p.imageAlt }] }, twitter: { card: "summary_large_image", title: p.name, description: p.short } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const sameCategory = products.filter((x) => x.slug !== slug && x.category === p.category);
  const sameType = p.systemType
    ? products.filter((x) => x.slug !== slug && x.systemType === p.systemType && x.category !== p.category)
    : [];
  const picked = new Set([...sameCategory, ...sameType].map((x) => x.slug));
  const others = products.filter((x) => x.slug !== slug && !picked.has(x.slug));
  const related = [...sameCategory, ...sameType, ...others].slice(0, 2);
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Systems", href: "/products" }, { label: p.name }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <Image src={asset(p.image)} alt={p.imageAlt} width={900} height={600} priority fetchPriority="high" sizes="(max-width: 1024px) 100vw, 50vw" className="h-[260px] w-full rounded-[2rem] border border-line object-cover shadow-xl sm:h-[360px]" />
          <div className="min-w-0">
            <Sequence>
              <Step>
                <p className="text-xs font-bold uppercase tracking-widest text-royal">{p.category} {p.systemType ? `· ${p.systemType}` : ""}</p>
                <h1 className="mt-2 font-display break-words text-3xl sm:text-4xl font-extrabold text-navy">{p.name}</h1>
                <p className="mt-1 text-sm font-bold text-slate">Make: {p.manufacturer}</p>
              </Step>
              <Step variant="line"><TechLine className="mt-4" /></Step>
            </Sequence>
            <p className="mt-4 text-slate leading-relaxed">{p.description}</p>
            <ul className="mt-5 space-y-2">
              {p.highlights.map((h) => <li key={h} className="flex gap-2 font-semibold text-ink"><span aria-hidden="true" className="font-extrabold text-royal">✓</span><span>{h}</span></li>)}
            </ul>
            <p className="mt-5 rounded-2xl bg-ice border border-line p-4 text-sm text-slate">Verification note: {p.verificationNote} No prices, stock or binding specs are published here.</p>
            <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/contact" variant="primary">Request quote</CTAButton><Link href="/products" className="inline-flex max-w-full items-center justify-center gap-2 break-words rounded-xl border border-line bg-white px-6 py-3 text-center text-[15px] font-bold text-royal transition hover:border-royal">All systems</Link></div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-extrabold text-navy">Related</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-5">
              {related.map((r) => <Link key={r.slug} href={`/products/${r.slug}`} className="rounded-3xl border border-line bg-white p-5 font-bold text-royal hover:border-royal">{r.name} →</Link>)}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
