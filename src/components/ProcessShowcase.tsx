import Image from "next/image";
import { PhoneCall, ScanSearch, HardHat, Rocket, Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal, Sequence, Step, Tilt, ScrollFill } from "@/components/effects";
import { processSteps } from "@/content/services";
import { site } from "@/config/site";
import { telHref } from "@/lib/utils";
import { asset } from "@/lib/assets";

/* Process showcase — the old light 4-card flow rebuilt as a dark companion
   to FutureExperience: aurora + grid bg, energy rail with travelling comet,
   glowing photo rings, ember-gradient badges + gold icon chips, tilt + stagger.
   Same honest 4 steps and genuine site photos, new effects/icons/design. */

const ICONS = [PhoneCall, ScanSearch, HardHat, Rocket];
const PHOTOS = [3, 2, 4, 6];

export function ProcessShowcase() {
  return (
    <section aria-label="Our working process" className="future-dark grain relative">
      <div className="future-aurora" aria-hidden="true">
        <span className="future-blob future-blob-b1" />
        <span className="future-blob future-blob-b2" />
        <span className="future-blob future-blob-b3" />
        <span className="future-gridbg" />
      </div>
      <Container className="relative z-[2] py-20 sm:py-24">
        <ScrollFill className="mb-8 scrollfill-on-dark" />
        <Sequence>
          <Step><p className="future-eyebrow">Our working process</p></Step>
          <Step><h2 className="future-title mt-4">From enquiry to <span className="text-ember-gradient">switch-on.</span></h2></Step>
          <Step><div className="future-underline mt-5" /></Step>
          <Step><p className="future-sub mt-4 max-w-2xl">The same disciplined flow behind every Universal Solar Power Solutions installation — using our own site photos.</p></Step>
        </Sequence>
        <div className="relative mt-16">
          <div className="process-rail hidden lg:block" aria-hidden="true" />
          <Sequence className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" stagger={130}>
            {processSteps.map((p, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Step key={p.n} className="h-full min-w-0">
                  <Tilt className="h-full">
                    <article className="process-card">
                      <div className="relative z-[1] -mt-12 flex flex-col items-center">
                        <Image
                          src={asset(`/images/legacy/project${PHOTOS[i]}.jpeg`)}
                          alt={`Universal Solar Power Solutions site work step ${p.n}`}
                          width={160}
                          height={160}
                          loading="lazy"
                          sizes="96px"
                          className="process-photo"
                        />
                        <span className="process-badge">{p.n}</span>
                        <span className="future-step-icon mt-4"><Icon size={20} aria-hidden="true" /></span>
                      </div>
                      <h3 className="mt-4 font-display text-xl font-extrabold text-white">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">{p.text}</p>
                    </article>
                  </Tilt>
                </Step>
              );
            })}
          </Sequence>
        </div>
        <Reveal className="mt-10 text-center">
          <a href={telHref(site.contact.primaryPhone)} className="future-callbtn">
            <Phone size={17} aria-hidden="true" /> Talk to us: {site.contact.primaryPhone}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
