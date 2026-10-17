# System Overview — Universal Solar Power Solutions website
Date: 2026-10-16.

## Components & boundaries
```
Browser (SSR pages + small client islands: Calculator, Planner, EnquiryForm,
SupportForm, effects) ──POST /api/{enquiries,support-requests}──▶
  Next.js route handler: rate-limit → 20KB cap → zod validate → queue → optional Resend
Lead store: data/enquiries/*.json + data/support-requests/*.json (git-ignored files)
Notifications: Resend HTTP API (iff RESEND_API_KEY + FROM + TO set) — no SDK
Analytics: dataLayer push iff NEXT_PUBLIC_ANALYTICS_ID set; event names only, no PII
SEO: per-route metadata, sitemap.ts, robots.ts, LocalBusiness JSON-LD (layout)
```

## Data flows (PII-aware)
- Enquiry/support PII travels browser → API route → JSON file (+ optional Resend email).
  Never into logs (test-enforced), never into analytics (event names + page path only),
  never into client bundles (secret stays in `store.ts` server code).
- Rate limiter: in-memory route+IP buckets, 10 req/min, 429 + Retry-After.

## Third-party integration points (all optional, all honest when absent)
| Integration | Status | Owner action |
|---|---|---|
| Resend email | Adapter live, inactive without 3 env vars; UI reports queued-vs-sent truthfully | Verify sender domain; set vars; test inbox routing |
| CRM | NOT integrated; file queue is system of record (ephemeral on serverless) | Choose CRM; build adapter; define SLA/retention |
| Analytics provider | Adapter live, dormant without ID | Approve provider + privacy wording; set ID |
| Yield/weather API | NOT integrated (correctly absent) | Validate Tamil Nadu coverage before any adoption |
| WhatsApp | No links (no verified number) | Confirm number supports WhatsApp before adding wa.me |
| Uploads/storage/auth/portal | NOT implemented (correctly absent per security gates) | Phase-gated; see launch checklist |

## Conventions
Content = typed TS modules (`site.ts` = master record). Presentation = small typed
components. Calculations = pure functions in `src/lib`. API = thin validated handlers.
Tests = `node --test` mirrors + source contracts. No database, no CMS, no auth —
documented limitations, not hidden ones.
