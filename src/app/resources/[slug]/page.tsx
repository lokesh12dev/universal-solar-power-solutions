import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container, Breadcrumbs, CTAButton } from "@/components/ui";
import { articles } from "@/content/resources";

export async function generateStaticParams() { return articles.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.intro, alternates: { canonical: `/resources/${slug}` }, openGraph: { title: a.title, description: a.intro, url: `/resources/${slug}`, type: "article" }, twitter: { card: "summary_large_image", title: a.title, description: a.intro } } : { title: "Not found" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const related = articles.filter((x) => x.slug !== slug).slice(0, 2);
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: a.title }]} />
        <article className="prose-solar mx-auto mt-6 max-w-3xl rounded-[2rem] border border-line bg-white p-7 sm:p-10 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-royal">{a.category} · {a.readMins} min · Updated {a.updated}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-navy">{a.title}</h1>
          <p className="mt-3 text-lg text-slate">{a.intro}</p>
          {a.body.map((b, bi) => (
            <div key={`${b.h}-${bi}`}><h2>{b.h}</h2>{b.p.map((p, i) => <p key={i}>{p}</p>)}</div>
          ))}
          {a.sources && <p className="mt-6 text-xs text-slate">Sources: {a.sources.join(", ")}</p>}
          <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/contact" variant="dark">Ask about your site</CTAButton><CTAButton href="/solar-savings-calculator" variant="dark" className="bg-white !text-royal border border-line">Try calculator</CTAButton></div>
        </article>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {related.map((r) => (
            <Link key={r.slug} href={`/resources/${r.slug}`} className="glow-card link-arrow flex items-center justify-between gap-2 rounded-3xl border border-line bg-white p-5 text-[15px] font-bold text-royal">
              <span>{r.title}</span>
              <ArrowRight size={17} aria-hidden="true" className="shrink-0" />
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <Link href="/resources" className="link-arrow inline-flex items-center gap-1.5 text-sm font-extrabold text-royal">Back to all guides <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </Container>
    </section>
  );
}
