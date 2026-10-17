import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, ShieldAlert, ClipboardCheck } from "lucide-react";
import { Container, SectionHeading, Breadcrumbs, CTAButton } from "@/components/ui";
import { Reveal, Sequence, Step, TechLine, MaskReveal } from "@/components/effects";
import { SupportForm } from "@/components/SupportForm";
import { SupportFaq } from "@/components/SupportFaq";
import { supportCategories } from "@/content/support";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Support Centre",
  description: "Find solar answers, track your project next steps, or submit a support request to our Chennai team.",
  alternates: { canonical: "/support" },
};

const process = [
  { n: "01", t: "Submit your request", d: "Describe the issue with photos and any reference you have." },
  { n: "02", t: "Request received", d: "You get a confirmation with a reference — only after our system accepts it." },
  { n: "03", t: "Review", d: "The team reviews it in the order received." },
  { n: "04", t: "Follow-up", d: "We contact you by your preferred method to resolve it." },
];

export default function Page() {
  return (
    <>
      <section className="bg-navy text-white">
        <Container className="py-14 text-center">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Support" }]} />
          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan">Customer Service Centre</p>
          <h1 className="font-display mx-auto mt-4 max-w-2xl text-balance text-4xl font-extrabold sm:text-5xl">How can we help you?</h1>
          <p className="mx-auto mt-4 max-w-xl text-frost">Find answers to common solar questions, or contact our team about your enquiry, installation, or existing system.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#support-faq" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-[15px] font-bold text-white transition hover:border-cyan hover:text-cyan">Find an Answer</a>
            <a href="#support-form" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-bold">Submit a Support Request <ArrowRight size={17} aria-hidden="true" /></a>
            <a href={telHref(site.contact.primaryPhone)} className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-[15px] font-bold text-white transition hover:border-cyan hover:text-cyan"><Phone size={17} aria-hidden="true" /> {site.contact.primaryPhone}</a>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Sequence>
            <Step><SectionHeading eyebrow="Support topics" title="Choose what you need help with" sub="Each topic scrolls to the form below — pick the matching category there." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
          <Sequence className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={80}>
            {supportCategories.map((c) => (
              <Step key={c.id} className="h-full">
                <a href="#support-form" className="glow-card flex h-full items-start gap-3 rounded-3xl border border-line bg-white p-5">
                  <span className="icon-chip h-11 w-11 shrink-0"><c.icon size={20} aria-hidden="true" /></span>
                  <span><span className="font-display block font-extrabold text-navy">{c.title}</span><span className="mt-1 block text-sm text-slate">{c.short}</span></span>
                </a>
              </Step>
            ))}
          </Sequence>
        </Container>
      </section>

      <section id="support-faq" className="bg-soft-light scroll-mt-20 border-y border-line py-16">
        <Container>
          <Sequence>
            <Step><SectionHeading eyebrow="Knowledge base" title="Answers, searchable" sub="Search the actual answers — not just headings." /></Step>
          </Sequence>
          <Reveal className="mt-8"><SupportFaq /></Reveal>
        </Container>
      </section>

      <section id="support-form" className="scroll-mt-20 py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <Sequence>
                <Step><SectionHeading eyebrow="Support request" title="Describe it — we'll take it from there" /></Step>
              </Sequence>
              <Reveal className="mt-6">
                <MaskReveal src="/images/sections/engineer-site-survey.jpg" alt="Engineer reviewing plans beside a rooftop array during a site assessment — illustrative stock photo" width={1260} height={840} sizes="(max-width: 1024px) 100vw, 50vw" className="overflow-hidden rounded-3xl shadow-xl" caption="Illustrative stock photo (Pexels) — assessments are done by our team on your roof" />
              </Reveal>
              <div className="mt-6 grid gap-3">
                {process.map((p) => (
                  <div key={p.n} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                    <span className="font-display text-lg font-extrabold text-royal">{p.n}</span>
                    <span><span className="block font-bold text-navy">{p.t}</span><span className="block text-sm text-slate">{p.d}</span></span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5">
                <p className="flex items-center gap-2 font-extrabold text-red-900"><ShieldAlert size={19} aria-hidden="true" /> Electrical safety</p>
                <p className="mt-2 text-sm leading-relaxed text-red-900">Exposed wiring, burning smells, or damaged equipment: do not touch anything. Keep distance and call us. For fire or immediate danger, contact local emergency services first. Never open inverters or disconnect live wiring yourself.</p>
              </div>
            </div>
            <Reveal delay={100}>
              <div className="h-fit rounded-[1.6rem] border border-line bg-white p-7 shadow-xl sm:p-8">
                <SupportForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="card-dark grid gap-6 rounded-[1.6rem] p-8 text-white sm:p-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold">Prefer to talk directly?</h2>
              <ul className="mt-4 space-y-2.5 text-frost">
                <li><a className="flex items-center gap-2 font-bold hover:text-cyan" href={telHref(site.contact.primaryPhone)}><Phone size={17} aria-hidden="true" /> {site.contact.primaryPhone}</a></li>
                <li><a className="flex items-center gap-2 hover:text-cyan break-all" href={`mailto:${site.contact.email}`}><Mail size={17} aria-hidden="true" /> {site.contact.email}</a></li>
                <li className="flex items-start gap-2 text-sm"><MapPin size={17} className="mt-0.5 shrink-0" aria-hidden="true" /> {site.address.line1} {site.address.line2} {site.address.city}-{site.address.pin}, {site.address.state}</li>
                <li className="text-sm text-white/60">{site.contact.hours}</li>
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <p className="flex items-start gap-2 text-sm text-frost"><ClipboardCheck size={18} className="mt-0.5 shrink-0 text-cyan" aria-hidden="true" /> For a new project, the guided planner collects everything we need in 4 steps.</p>
              <div className="flex flex-wrap gap-3">
                <CTAButton href="/plan-my-solar">Plan My Solar System</CTAButton>
                <CTAButton href="/contact" variant="ghost">Contact Page</CTAButton>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
