# Universal Solar Power Solutions — Website

Next.js (App Router) marketing + lead-capture site for **Universal Solar Power Solutions**,
Chennai-based solar EPC (rooftop / ground-mount for homes, businesses, industry).
Survey → design → installation → commissioning → maintenance.

Production canonical URL: `https://www.universalsolarpowersolutions.com`
(overridable via `NEXT_PUBLIC_SITE_URL`; see `src/config/site.ts`).

## 1. Setup

Prerequisites: Node.js 20+, npm.

```bash
npm install
cp .env.example .env        # fill only what you have; all email/analytics vars are optional
npm run dev                 # http://localhost:3000
```

Commands (from `package.json`):

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Serve production build (`next start`) |
| `npm run typecheck` | `tsc --noEmit` — **passes as of 2026-10-14** |
| `npm run lint` | `next lint` — **deprecated upstream; prompts interactively, not CI-safe** (see Limitations) |
| `npm test` | `node --test tests/*.test.mjs` — **56 tests / 14 suites pass (2026-10-14)**: `calculator.test.mjs`, `planner.test.mjs`, `support.test.mjs`, `validation.test.mjs` |

Environment (only implemented integrations — nothing else is read):

| Var | Required? | Used in |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No (defaults to official URL) | `src/config/site.ts` → metadataBase, canonical, OG, sitemap, robots |
| `RESEND_API_KEY` | No | `src/lib/store.ts` `trySendEmail()` |
| `ENQUIRY_FROM_EMAIL` | No (with above) | Email `from` |
| `ENQUIRY_TO_EMAIL` | No (with above) | Email `to` |
| `NEXT_PUBLIC_ANALYTICS_ID` | No (leave empty until approved) | Reserved; read in `site.ts`, not yet wired to a provider |

Only `.env.example` is tracked. Real `.env*` files and `data/enquiries/` are git-ignored.

## 2. Routes

Static pages (`src/app/`):

| Route | File |
|---|---|
| `/` | `page.tsx` (home) |
| `/residential-solar` | `residential-solar/page.tsx` |
| `/commercial-solar` | `commercial-solar/page.tsx` |
| `/industrial-solar` | `industrial-solar/page.tsx` |
| `/products` + `/products/[slug]` | `products/page.tsx`, `products/[slug]/page.tsx` (from `src/content/products.ts`) |
| `/projects` + `/projects/[slug]` | `projects/page.tsx`, `projects/[slug]/page.tsx` (from `src/content/projects.ts`) |
| `/resources` + `/resources/[slug]` | `resources/page.tsx`, `resources/[slug]/page.tsx` (from `src/content/resources.ts`) |
| `/about` | `about/page.tsx` |
| `/solar-savings-calculator` | `solar-savings-calculator/page.tsx` (client `SolarCalculator`) |
| `/plan-my-solar` | `plan-my-solar/page.tsx` (client `Planner` wizard → POSTs to `/api/enquiries` with `goal` + `source: "planner"`) |
| `/support` | `support/page.tsx` (categories, searchable FAQ, `SupportForm` → POSTs to `/api/support-requests`) |
| `/contact` | `contact/page.tsx` (hosts `EnquiryForm`) |
| `/privacy-policy`, `/terms` | `privacy-policy/page.tsx`, `terms/page.tsx` |
| `/robots.txt`, `/sitemap.xml` | `robots.ts`, `sitemap.ts` (generated) |

API:

| Route | File | Methods |
|---|---|---|
| `/api/enquiries` | `api/enquiries/route.ts` | `POST` (submit); `GET` returns 405 with usage hint |
| `/api/support-requests` | `api/support-requests/route.ts` | `POST` (submit); other methods 405. Same 20KB cap, zod validation, honeypot, file queue under `data/support-requests/`, optional Resend email with `[category]` subject |

Special files: `layout.tsx` (fonts, header/footer, metadata), `loading.tsx`,
`error.tsx`, `not-found.tsx`, `icon.svg`.

## 3. Solar savings calculator — assumptions

Implementation: `src/lib/calculator.ts` (`runCalculator`), UI: `src/components/Calculator.tsx`.

> **Indicative estimate only — not an engineering design or quotation.**
> The UI states this next to every result.

Defaults (`defaultAssumptions`):

- `specificYield`: **1500 kWh/kW/year** (Chennai benchmark, editable in UI)
- `sqftPerKw`: **~100 sq ft/kW** (editable)
- `performanceRatio`: **1.0** — folded into `specificYield` already; kept as a field for transparency
- `tariffEscalation`: **0.03** (3 %/yr — stored, not yet applied to displayed Year-1 savings)
- `co2PerKwh`: **0.82 kg/kWh**
- `treesPerTonneCo2`: **45**

Sizing logic:

1. `monthlyUnits = monthlyUnitsKnown override, else monthlyBill / tariff`
2. `annualUnits = monthlyUnits × 12`
3. Size to **~90 % of annual use**: `rawKw = annualUnits × 0.9 / specificYield` (avoids oversizing given export uncertainty)
4. Round to nearest **0.5 kW**, clamp **1–500 kW** (0 if no usage)
5. `annualGeneration = suggestedKw × specificYield`; `roofNeeded = suggestedKw × sqftPerKw`
6. `roofFits`: `true/false` if roof given, else `null`
7. **Year-1 savings** = `annualGeneration × tariff × 0.85` (conservative self-consumption + export value factor; excludes net-metering caps, shade, tariff changes, hybrid battery cost)
8. `co2AvoidedTpa = annualGeneration × 0.82 / 1000`; trees = `round(co2 × 45)`

User-editable live: bill, tariff, units override, property type, roof area,
system type (on-grid/hybrid — currently informational), yield, sq ft/kW.

## 4. Enquiry workflow

Client: `src/components/EnquiryForm.tsx` → `fetch("POST /api/enquiries")`.

1. Form collects: `name*, phone*, email (optional), propertyType*, service*, pincode*, monthlyBill (optional), message (optional)` + hidden **honeypot** `company`.
2. `POST /api/enquiries` (`src/app/api/enquiries/route.ts`):
   - Rejects bodies > **20 000 chars** with `413`.
   - Validates with `zod` (`src/lib/validation.ts`): Indian mobile `^(\+91[\s-]?)?[6-9]\d{9}$`, PIN `^[1-9][0-9]{5}$`, enums for property/service, message ≤ 1000 chars, honeypot must be empty. Failure → `422 { message, errors }` rendered inline.
   - `queueEnquiry()` (`src/lib/store.ts`): writes `{ ...fields minus honeypot, id, receivedAt }` to `data/enquiries/<id>.json` (git-ignored). Never logs PII to console.
   - `trySendEmail(record)`: fires only if all three of `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` + `ENQUIRY_TO_EMAIL` are set; otherwise returns `{ sent: false, reason: "email-not-configured" }`.
   - Responds `201 { id, emailSent, emailStatus }`.
3. UI success copy distinguishes the two states honestly:
   - email on: *"…our team will call you shortly. (Email notification sent.)"*
   - queue only: *"…Reference: \<id\>"* — i.e. **accepted for review**, not "we emailed you".

Errors (`400/422/500`) always fall back to *"Please call us directly"* with the public phone numbers.

## 4b. Solar Project Planner (`/plan-my-solar`)

Client wizard `src/components/Planner.tsx`, logic in `src/lib/planner.ts`:

1. Steps: Property (residential/commercial/industrial) → Usage (bill and/or kWh, both optional) → Location (PIN, required) → Goal (`new-installation` / `potential-savings` / `consultation` / `existing-system`) → Summary + contact → success with reference.
2. Progress bar with `aria-label`, per-step validation mirroring server regexes, Back preserves all entered values, no account needed.
3. **No fabricated outputs:** the planner never sizes systems, prices, or promises savings — the summary echoes customer inputs and states they are unverified pending survey.
4. Submit maps goal → enquiry service (`existing-system` → `re-engineering`, savings/consultation → `consultation`) and composes planner context into `message` so no data is lost; posts to `/api/enquiries` with `goal` + `source: "planner"` (accepted by `plannerSubmissionSchema`).
5. Analytics: `planner_start` on begin, `planner_complete` at summary, `consultation_request` on accepted submit (see §4d).

## 4c. Customer Support Centre (`/support`)

`src/app/support/page.tsx` + `src/content/support.ts` + `src/components/SupportForm.tsx` + `src/components/SupportFaq.tsx`:

- 9 categories (general, new-project, installation, existing-system, maintenance, product-info, warranty-docs, billing, other) — each scrolls to the form with that category preselectable; only real services implied, nothing invented.
- Searchable FAQ (10 entries across 7 topics): filters by question **and** answer text, category pills, result count, honest empty state, keyboard-accessible accordion reusing `.faq-dot` rotation.
- `SupportForm`: name*, phone*, email/PIN/reference optional, category*, contact preference, message* (10–2000 chars), honeypot, client+server validation, duplicate-submit guard, preserves input on failure, success shows backend-issued reference only.
- `POST /api/support-requests`: 20KB cap → 413; zod → 422 with field errors; `queueSupportRequest()` → `data/support-requests/<id>.json`; optional Resend with `New support request [category]` subject; `201 { id, emailSent, emailStatus }`.
- Safety card (electrical faults, emergencies), 4-step process explanation, verified tel:/mailto:/maps links. No ticket tracking (no auth system) — reference + phone follow-up is the documented workflow.
- Footer links under Explore: Plan My Solar, Customer Support. Both routes in sitemap.

## 4d. Analytics (event names only, no PII)

`src/lib/analytics.ts`: `track(event)` pushes `{ event, page }` to `dataLayer` **only** when `NEXT_PUBLIC_ANALYTICS_ID` is set; otherwise records to an in-memory queue (used by tests). Wired: `quote_cta_click` (hero + closing CTA), `phone_click` (header), `lead_form_start/submit/success/fail`, `planner_start/complete`, `consultation_request`. Calculator completion is computed client-side and not auto-tracked. WhatsApp tracking omitted — no verified WhatsApp number (do not add `wa.me` links until the business confirms the number supports WhatsApp).

## 5. Email / CRM

- **Email (optional, Resend):** direct `fetch` to `https://api.resend.com/emails` in `src/lib/store.ts` — no SDK dependency. Subject: `New solar enquiry — <propertyType> / <pincode>`; plain-text body with contact + requirement fields. Failure modes are typed (`email-not-configured`, `provider-<status>`, `provider-error`) and surfaced via `emailStatus`, never thrown to the user.
- **CRM: none integrated.** The file queue in `data/enquiries/*.json` is the system of record today. It is **ephemeral on serverless hosts** (Vercel/Netlify) — treat it as a local-dev / single-VM fallback.
- **Before scaling:** connect a real CRM or inbox pipeline (Resend webhook → Sheets/CRM, or a DB-backed endpoint), add alerting/retries, and define an SLA + PII-retention policy. Do not invent submission volumes or response-time claims until measured.

## 6. SEO

- `src/app/layout.tsx`: `metadataBase` from `site.url`, title template `%s | Universal Solar`, description, `canonical: "/"`, OpenGraph (1200×630 legacy install photo), `twitter: summary_large_image`, `robots: { index: true, follow: true }`, `lang="en-IN"`, `next/font` (Manrope + Inter, `display: swap`), skip-to-content link.
- `src/app/robots.ts`: allow `/`, sitemap absolute URL derived from canonical base.
- `src/app/sitemap.ts`: all static routes + per-`slug` product/project/article URLs, `weekly`/`monthly` changefreq.
- `next.config.ts`: `images.remotePatterns` limited to `images.unsplash.com` + production domain, `formats: [avif, webp]`.
- Company facts guardrail: `site.needsVerification[]` lists what must **not** be published as fact without sign-off (years/projects/MW counts, MNRE/TANGEDCO status, brands, warranties, subsidies, customer names). `socials: []` is intentionally empty.

## 7. Deploy

Any Next.js host works; Vercel is the path of least resistance.

```bash
npm run build
npm run start
```

- Set env vars in the host dashboard (start with just `NEXT_PUBLIC_SITE_URL`; add Resend vars only after sender-domain verification).
- Verify post-deploy: `/robots.txt`, `/sitemap.xml`, OG image, `POST /api/enquiries` 422-path (bad phone) and 201-path (test record — delete it after), security headers (below).
- Note: `data/enquiries/*.json` does **not** persist on serverless — configure email/CRM before relying on the contact form in production.

## 8. Security

Implemented in code (`next.config.ts`, `route.ts`, `store.ts`, `.gitignore`):

- Headers on `/:path*`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. `poweredByHeader: false`, `reactStrictMode: true`.
- Input: `zod` server-side validation, 20 KB body cap, honeypot (`company`) stripped before storage, per-field errors without echoing raw input.
- Secrets: no keys in code — verified by grep over `src/` (only `process.env` reads in `site.ts`/`store.ts`). Only `.env.example` (empty values) is tracked.
- PII: file queue is git-ignored; nothing sensitive is `console.log`ged; form links to `/privacy-policy`.
- Not yet done (see checklist): CSP, rate limiting / CAPTCHA on the endpoint, monitoring for abuse.

## 9. Pre-launch checklist

- [ ] Company sign-off on every `site.needsVerification` item; remove or correct unverified stats before launch.
- [ ] Confirm real project photos, locations, capacities, customer-name permissions (current OG image is a legacy placeholder).
- [ ] Verify Resend sender domain + `ENQUIRY_FROM/TO`; send a test enquiry; confirm inbox routing + on-call coverage.
- [ ] Decide CRM/storage for enquiries (file queue is ephemeral on serverless); define retention + deletion process.
- [ ] Approve analytics provider + privacy wording; only then set `NEXT_PUBLIC_ANALYTICS_ID`.
- [ ] Run `npm run build` clean; smoke-test all routes, `/robots.txt`, `/sitemap.xml`, calculator edge cases (0 bill, roof too small), form 422/201 paths.
- [ ] Check headers + HSTS in production; consider CSP + rate limiting follow-up.
- [ ] `git init` + first commit (repo is not yet under version control); confirm `data/enquiries/` and `.env*` stay untracked.

## 10. Known limitations (honest test status, 2026-10-14)

- **Tests: 56/56 pass** (`tests/` ×4 files, 14 suites — calculator, planner, support, validation + route/secrets contracts). No E2E/browser coverage yet.
- **Lint: not green.** `next lint` is deprecated in Next 15 and drops into an interactive ESLint-setup prompt — unsuitable for CI as-is. Migrate to the ESLint CLI (`npx @next/codemod next-lint-to-eslint-cli`) if lint gating is wanted.
- **Typecheck: passes** (`tsc --noEmit` clean on 2026-10-14, verified 2× 90s apart + post-fix).
- **Production build: passes** (`next build` 40/40 static on 2026-10-14, incl `/plan-my-solar` + `/support`; 18/18 prod routes 200 on `:3001`; dev `:3000` API 201/422 paths verified, test records deleted).
- **No git repo** (`git status` → "not a git repository"); `.gitignore` was just created — verify with `git init && git status` that `data/` and `.env*` stay ignored.
- **Enquiry durability:** file queue only; concurrent/multi-instance and serverless-ephemeral. No auth, no admin view, no dedupe, no rate limit.
- **Calculator:** indicative only; `tariffEscalation` stored but not reflected in displayed savings; `systemType`/`propertyType` don't change the math today; hybrid battery costs excluded.
- **Content gaps:** `socials: []`, service-area list and contact details are code constants — confirm each is still current; unresolved "5+ years vs a decade / 150+ projects / 500+ MW" conflicts must not ship as fact.
