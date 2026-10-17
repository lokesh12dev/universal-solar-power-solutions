# Company Claims Ledger — Universal Solar Power Solutions
Owner action required: every row marked `needs confirmation` must be verified against
business records before it may appear on any public page. Last reviewed: 2026-10-16.

Status key: `verified` = approved for publication · `needs confirmation` = must NOT
be published as fact · `retired` = removed from all public surfaces.

| # | Claim (public wording, if any) | Appears in repo | Evidence / owner | Status | Approved display context |
|---|---|---|---|---|---|
| 1 | Business name "Universal Solar Power Solutions" | `site.brand`, header, footer, metadata | Company registration (owner to confirm exact legal name) | needs confirmation | Brand display; confirm legal entity name |
| 2 | Address: Plot 64, G2 Lakshmi Nagar, 200ft Service Rd, Anakaputhur, Chennai 600070 | `site.address`, footer, contact, JSON-LD | Owner: confirm current occupancy + map pin | needs confirmation | Footer/contact/JSON-LD only after confirmation |
| 3 | Phones +91 97504 02731 / +91 97908 66659 / +91 80564 65693; primary = first | `site.contact`, header, footer, CTA bands | Owner: confirm all active + preferred order + WhatsApp ability | needs confirmation | tel: links; do NOT add wa.me until WhatsApp confirmed |
| 4 | Email universalsolarpower2020@gmail.com | `site.contact`, footer | Owner: confirm monitored inbox + responder | needs confirmation | mailto: links |
| 5 | Hours Mon–Sat 9AM–6PM | `site.contact.hours`, footer, JSON-LD | Owner: confirm; define emergency coverage separately | needs confirmation | Footer + structured data; NO 24/7 wording anywhere unless emergency cover is defined |
| 6 | Service area "Chennai, Tamil Nadu, India" | `site.serviceAreas` | Owner: confirm boundaries; do not imply pan-India | needs confirmation | Contact page + JSON-LD areaServed |
| 7 | "5+ years / a decade / 150+ projects / 500+ customers / 100+ MW" (old-site figures) | `site.needsVerification[0]` only (quarantined note, also rendered on /about as a sign-off list) | Company records: incorporation date, project list, capacities | needs confirmation | NOT for publication in any form |
| 8 | MNRE registration / TANGEDCO empanelment | `site.needsVerification[1]` only | Registration certificates | needs confirmation | NOT for publication; never imply govt approval |
| 9 | Panel/inverter/battery brands dealt in | `site.needsVerification[2]`; product pages use generic categories + verificationNote fields | Dealer authorisations | needs confirmation | Generic categories only until confirmed |
| 10 | Warranty terms / pricing / subsidy eligibility / savings guarantees | `site.needsVerification[3]`; public copy refuses guarantees; support warranty-category routes to proposal documents | Manufacturer docs + proposal terms; official scheme portals for subsidy | needs confirmation | Conditional wording only ("confirm during consultation, never a guarantee") |
| 11 | Project locations / capacities / customer names | `site.needsVerification[4]`; project pages show scope + photos only, with explicit consent notice | Written customer consent per project | needs confirmation | Photos + scope only; capacities/names withheld |
| 12 | "Survey-first process; every project starts with a site survey" | Home, About, service pages, planner | Operational practice (owner to confirm it is universal) | needs confirmation | Process description; do not promise booking slots (no scheduler exists) |
| 13 | Calculator "indicative estimate" outputs | Calculator UI + `/terms` disclaimer + editable assumptions | Model doc `docs/architecture/calculator-model.md` | verified (as labelled estimate, not fact) | Always adjacent to assumptions + disclaimer |

Notes:
- No testimonials, certifications, awards, partner logos, or ratings appear anywhere (verified absent 2026-10-16). Do not add any without ledger rows.
- The /about "needs sign-off" list intentionally makes pending items visible to force owner action; it publishes no figures.
