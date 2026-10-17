"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { knowledgeGuides, knowledgeOfficial, type KnowledgeCategory } from "@/content/knowledge";

type Lang = "en" | "ta";
type Filter = "All" | KnowledgeCategory;

const categories: Filter[] = ["All", "Homeowner", "Business", "Support"];

export function KnowledgeClone() {
  const [lang, setLang] = useState<Lang>("en");
  const [cat, setCat] = useState<Filter>("All");

  const filtered = useMemo(
    () => knowledgeGuides.filter((g) => cat === "All" || g.category === cat),
    [cat]
  );

  const official = knowledgeOfficial[lang];

  return (
    <div className="knowledge-clone">
      {/* Intro — clones reference .page-intro */}
      <div className="kc-shell kc-intro">
        <p className="kc-eyebrow">
          <span className="kc-dot" aria-hidden="true" />
          KNOWLEDGE / ENGLISH &amp; தமிழ்
        </p>
        <h1>
          {lang === "en" ? (
            <>
              Understand more.
              <br />
              Decide with confidence.
            </>
          ) : (
            <>
              மேலும் புரிந்துகொள்ளுங்கள்.
              <br />
              நம்பிக்கையுடன் முடிவு செய்யுங்கள்.
            </>
          )}
        </h1>
        <div className="kc-intro-bottom">
          <ArrowDownRight size={38} strokeWidth={1} aria-hidden="true" className="kc-accent" />
          <p>
            {lang === "en"
              ? "Practical answers about your roof, electricity use, investment and long-term system care."
              : "உங்கள் கூரை, மின் பயன்பாடு, முதலீடு மற்றும் நீண்டகால பராமரிப்பு பற்றிய நடைமுறை பதில்கள்."}
          </p>
        </div>
      </div>

      {/* Body — clones reference .studio-page */}
      <section className="kc-shell kc-body">
        <div className="kc-controls">
          <div className="kc-tabs" role="group" aria-label="Guide language">
            <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              English
            </button>
            <button type="button" aria-pressed={lang === "ta"} onClick={() => setLang("ta")}>
              தமிழ்
            </button>
          </div>
          <div className="kc-tabs" role="group" aria-label="Guide category">
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="kc-empty">
            <h2>{lang === "en" ? "No guides in this view." : "இந்த பிரிவில் வழிகாட்டிகள் இல்லை."}</h2>
            <button type="button" className="kc-link" onClick={() => setCat("All")}>
              {lang === "en" ? "Show all guides" : "அனைத்தையும் காட்டு"}
            </button>
          </div>
        ) : (
          <div className="kc-grid" lang={lang}>
            {filtered.map((g) => {
              const t = g[lang];
              const ctaLabel = lang === "en" ? g.cta.labelEn : g.cta.labelTa;
              return (
                <article key={g.id}>
                  <span className="kc-mono kc-accent">{g.category}</span>
                  <h2>{t.title}</h2>
                  <p>{t.body}</p>
                  <Link className="kc-link" href={g.cta.href}>
                    {ctaLabel} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <article className="kc-official" lang={lang}>
          <span className="kc-mono kc-accent">{official.eyebrow}</span>
          <h2>{official.title}</h2>
          <p>{official.body}</p>
          <a
            className="kc-link"
            href="https://pmsuryaghar.gov.in/"
            target="_blank"
            rel="noreferrer"
          >
            {lang === "en" ? "PM Surya Ghar — official portal" : "PM சூர்யா கர் — அதிகாரப்பூர்வ இணையதளம்"}{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            className="kc-link"
            href="https://solarrooftop.pmsuryaghar.gov.in/"
            target="_blank"
            rel="noreferrer"
          >
            {lang === "en" ? "MNRE National Rooftop Solar Portal" : "MNRE தேசிய ரூஃப்டாப் சோலார் இணையதளம்"}{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </article>

        <p className="kc-clone-note">
          {lang === "en"
            ? "Layout cloned from the reference for parity review. Content adapted; scenario tools live in this site's calculator and support centre."
            : "குறிப்பு தளத்தின் அமைப்பை ஒப்பீட்டிற்காக மீண்டும் உருவாக்கப்பட்டது. கருவிகள் இந்த தளத்தின் கால்குலேட்டரில் உள்ளன."}{" "}
          <Link href="/solar-savings-calculator">Calculator</Link> · <Link href="/support">Support</Link> ·{" "}
          <Link href="/resources">Resources</Link>
        </p>
      </section>
    </div>
  );
}
