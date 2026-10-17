import type { Metadata } from "next";
import { Container, SectionHeading, Breadcrumbs } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal, Sequence, Step, TechLine } from "@/components/effects";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Contact & Get a Quote", description: "Request a solar consultation in Chennai — call, email or send an enquiry. We aim to respond within one working day.", alternates: { canonical: "/contact" }, openGraph: { title: "Contact & Get a Quote", description: "Request a solar consultation in Chennai — call, email or send an enquiry. We aim to respond within one working day.", url: "/contact", type: "website" }, twitter: { card: "summary_large_image", title: "Contact & Get a Quote", description: "Request a solar consultation in Chennai — call, email or send an enquiry. We aim to respond within one working day." } };

export default function Page() {
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <Sequence>
            <Step><SectionHeading eyebrow="Contact" title="Request a Solar Consultation" sub="Call, email, or send the form — a real survey follows, not a sales script." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
        <div className="mt-10 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <div className="h-full rounded-[2rem] bg-navy p-7 sm:p-9 text-white shadow-2xl">
              <h2 className="font-display text-xl font-extrabold text-cyan">Contact information</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-3"><MapPin className="text-cyan shrink-0" size={20} /><span className="text-white/80">{site.address.line1}<br />{site.address.line2}<br />{site.address.city}-{site.address.pin}, {site.address.state}, {site.address.country}<br /><a href={site.address.mapLink} target="_blank" rel="noreferrer" className="underline text-cyan">Open in Maps →</a></span></li>
                <li className="flex gap-3"><Phone className="text-cyan shrink-0" size={20} /><span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">{site.contact.phones.map((p) => <a key={p} href={telHref(p)} className="whitespace-nowrap font-bold hover:text-cyan">{p}</a>)}</span></li>
                <li className="flex gap-3"><Mail className="text-cyan shrink-0" size={20} /><a href={`mailto:${site.contact.email}`} className="break-all hover:text-cyan">{site.contact.email}</a></li>
                <li className="flex gap-3"><Clock className="text-cyan shrink-0" size={20} /><span className="text-white/80">{site.contact.hours}</span></li>
              </ul>
              <iframe title="Map — Anakaputhur, Chennai" src={site.address.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="mt-6 h-56 w-full rounded-2xl border border-white/15" />
              <p className="mt-3 text-xs text-white/50">Service areas: {site.serviceAreas.join(" · ")}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[2rem] border border-line bg-white p-7 sm:p-9 shadow-xl">
              <h2 className="font-display text-xl font-extrabold text-navy">Send an enquiry</h2>
              <p className="mt-1 text-sm text-slate">Know your bill and PIN? The <a className="font-bold text-royal underline-offset-4 hover:underline" href="/plan-my-solar">guided planner</a> structures it for you — or <a className="font-bold text-royal underline-offset-4 hover:underline" href="/support">get support</a> for an existing system.</p>
              <div className="mt-5"><EnquiryForm /></div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
