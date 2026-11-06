# Implementation Audit — Universal Solar Power Solutions
Date: 2026-10-16 · Agent: OpenCode (Prompt A) · Repo: `copy universal solarpower solutions copy`
Baseline: `npm test` 67/67 pass (17 suites) · `tsc --noEmit` clean · `next build` static OK (verified 2026-10-14/16).

## 1. Current architecture
- **Framework:** Next.js 15.4 (App Router) + React 19, TypeScript, Tailwind CSS v4 (`@theme` tokens in `src/styles/globals.css`), `zod` validation, `lucide-react` icons. No Motion/Framer, no shader lib, no Lenis, no DB, no CMS — deliberate, preserved per operating rule 2.
- **Routes (all static/SSG unless noted):** `/`, `/residential-solar`, `/commercial-solar`, `/industrial-solar`, `/products` + `[slug]`, `/projects` + `[slug]`, `/resources` + `[slug]`, `/about`, `/solar-savings-calculator`, `/plan-my-solar`, `/support`, `/contact`, `/privacy-policy`, `/terms`, `/robots.txt`, `/sitemap.xml`. API (dynamic): `POST /api/enquiries`, `POST /api/support-requests` (other methods → 405).
- **Content system:** typed TS modules — `src/config/site.ts` (brand, contact, hours, `needsVerification[]`, `socials: []`), `src/content/{services,products,projects,resources,faqs,support}.ts`. Single source of truth exists for contact/claims (good).
- **Lead backend:** `POST` → 20KB cap (413) → zod server validation (422 + field errors) → honeypot strip → file queue `data/<enquiries|support-requests>/<id>.json` (git-ignored, serverless-ephemeral — documented) → optional Resend email only when 3 env vars set → honest `201 { id, emailSent, emailStatus }`. No false success. No secrets in client bundle (test-enforced).
- **Calculators:** pure `runCalculator` in `src/lib/calculator.ts` (deterministic, hardened vs NaN/Infinity/negatives, unit-tested incl. savings-base sanity); UI `Calculator.tsx` + `Planner.tsx` wizard posting to `/api/enquiries` with `goal` + `source`.
- **Analytics:** `src/lib/analytics.ts` — event names only (`quote_cta_click`, `phone_click`, `lead_form_start/submit/success/fail`, `planner_*`, `consultation_request`, `calculator_completed`), dataLayer push only when ID set, no PII. Missing from prompt list: `estimate_request_submitted`, `site_survey_requested`, `service_request_submitted`, `whatsapp_click`, `project_case_study_viewed` — partially mappable, WhatsApp intentionally absent (no verified number).
- **Motion:** hand-rolled IO-gated CSS system (`Reveal/Sequence/TechLine/MaskReveal/Words/Magnetic/ScrollFill/Parallax/Tilt/ScrollOpen` + dark `future-*` sections). Transform/opacity only, reduced-motion safe, no deps, no hydration issues observed.
- **Tests:** `node --test tests/*.test.mjs` — calculator, planner, support, validation (zod mirrors + route source contracts + secrets/PII hygiene), geometry. No E2E.

## 2. Business-claim reconciliation (audit flags from brief vs this repo)
| Flag from brief | Found in repo | Verdict |
|---|---|---|
| 150+ projects / 100+ MW / 5+ yrs / "decade" (home) | Only inside `site.needsVerification[]` as a do-not-publish note; About page renders that list as "needs sign-off, not published as fact" | SAFE — quarantined, none on public pages (grep clean) |
| 250+ projects / 500 MW / 15+ countries / 1M+ homes (projects) | Not present | SAFE |
| 1,200 residential / 30+ MW industrial / 5,000+ customers / 15 MW+ / 150+ cities (about) | Not present; About explicitly refuses stats until verified | SAFE |
| 24/7 support vs Mon–Sat 9–6 | No 24/7 claim found; safety card gives emergency-services guidance, hours consistently Mon–Sat 9AM–6PM | SAFE |
| Savings/payback/financing/lease/PPA/install-duration/warranty promises | Calculator labeled indicative w/ editable assumptions; FAQs refuse guarantees; warranty/subsidy wording conditional ("confirm current applicability… never as a guarantee"); no lease/PPA offered | SAFE |
| "Save for decades" (new dark finale) | Marketing puffery, adjacent to indicative-only calculator + no-guarantee FAQ | LOW RISK — keep, do not harden into a numeric promise |

## 3. Defects & gaps (severity-ranked)
1. **High — No rate limiting on POST endpoints.** Spam/abuse vector; brief §8/§10 requires it. → Implement in-memory per-IP sliding window + 429 + tests (this run).
2. **Medium — No LocalBusiness/Organization structured data.** Brief §9 requires verified-facts-only schema. → Add JSON-LD (name/address/phone/hours/url only) with fallback-safe static markup (this run).
3. **Medium — Analytics event-name gaps** (`site_survey_requested`, `service_request_submitted`, `project_case_study_viewed`, `calculator_completed` wiring). `calculator_completed` type exists — verify it fires; add missing fires only where the interaction truly exists. → Verify this run; defer new providers.
4. **Low — File queue is serverless-ephemeral.** Already documented in README + honest UI copy. Real fix = CRM/DB integration, needs company credentials → document as launch blocker, do not fake.
5. **Low — `socials: []`, no OG image approval, `.timeline` legacy CSS unused after ProcessShowcase, `ScrollProgress`/`BackToTop` fine.** Non-blocking.
6. **Deliberately NOT doing:** Motion/Framer, Paper Shaders, Lenis installs. The existing system meets the brief's restraint rules (occasional, transform-only, reduced-motion safe); adding WebGL/large deps would regress performance budgets and risk hydration issues for zero business value. Documented as an architecture decision, reversible.

## 4. Implementation sequence (this run)
1. `src/lib/rate-limit.ts` + wire both API routes (429 + Retry-After) + `tests/rate-limit.test.mjs`.
2. LocalBusiness JSON-LD in `src/app/layout.tsx` (verified facts from `site.ts` only).
3. Verify analytics event wiring (calculator/planner/support coverage).
4. Full verification: typecheck, tests, build, live 201/422/429 probes, manual responsive/a11y spot-checks.
5. Final report (§14) + note Prompt B handoff.
