import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container, Breadcrumbs, CTAButton } from "@/components/ui";
import { CaseStudyView } from "@/components/CaseStudyView";
import { projects } from "@/content/projects";

export async function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/projects/${slug}` }, openGraph: { title: p.title, description: p.description, url: `/projects/${slug}`, type: "website", images: [{ url: p.image, alt: p.imageAlt }] }, twitter: { card: "summary_large_image", title: p.title, description: p.description } } : { title: "Not found" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const related = projects.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <section className="py-14">
      <CaseStudyView />
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: p.title }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <Image src={p.image} alt={p.imageAlt} width={900} height={600} priority fetchPriority="high" sizes="(max-width: 1024px) 100vw, 50vw" className="h-[260px] w-full rounded-[2rem] border border-line object-cover shadow-xl sm:h-[380px]" />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-royal">{p.category} · {p.location}</p>
            <h1 className="mt-2 font-display break-words text-3xl sm:text-4xl font-extrabold text-navy">{p.title}</h1>
            <h2 className="mt-6 font-display text-lg font-extrabold text-navy">Overview</h2>
            <p className="mt-2 text-slate leading-relaxed">{p.description}</p>
            <h2 className="mt-6 font-display text-lg font-extrabold text-navy">Scope visible in this photo</h2>
            <ul className="mt-2 space-y-1.5 font-semibold text-ink/80">{p.scope.map((s) => <li key={s}>• {s}</li>)}</ul>
            <p className="mt-5 rounded-2xl border border-line bg-ice p-4 text-sm text-slate">Capacity, customer and performance figures are published only with written consent. Ask us for verifiable references during your consultation.</p>
            <div className="mt-6 flex flex-wrap gap-3"><CTAButton href="/contact" variant="dark">Discuss your site</CTAButton><Link href="/projects" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 text-[15px] font-bold text-royal transition hover:border-royal">← Back to all site work</Link></div>
          </div>
        </div>
        <div className="mt-14">
          <h2 className="font-display text-2xl font-extrabold text-navy">Related site work</h2>
          <p className="mt-2 max-w-2xl text-slate">More genuine Universal Solar site photos from Chennai.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/projects/${r.slug}`} className="glow-card link-arrow group block h-full overflow-hidden rounded-3xl border border-line bg-white">
                <Image src={r.image} alt={r.imageAlt} width={700} height={450} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="h-44 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-royal">{r.category} · {r.location}</p>
                  <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-extrabold text-navy">{r.title} <ArrowRight size={17} className="shrink-0 text-royal" aria-hidden="true" /></h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
