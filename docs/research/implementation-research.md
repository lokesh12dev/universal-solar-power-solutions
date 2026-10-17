# Implementation Research Log
Date: 2026-10-16. Rule: entries describe sources actually inspected in this
environment. External URLs from the brief that were NOT opened are listed as
not-verified, never as "researched".

## Actually inspected (primary evidence)
- Full repository: Next.js 15 App Router, React 19, Tailwind v4, zod, lucide-react,
  `node --test` suite, `tsc`, `next build`. Package versions read from
  `package.json`/`package-lock.json`; no new dependencies installed this run.
- All routes listed in `docs/implementation-audit.md` §1 (source read, plus live
  probes against local prod build: 200s, 201/422/429 paths).
- `src/lib/calculator.ts` + `tests/calculator.test.mjs`: model equations, hardening,
  savings-base bound test — documented in `docs/architecture/calculator-model.md`.

## Decisions derived from brief references (principles applied, sources NOT re-opened here)
- pvlib/SAM/PVWatts lesson applied as restraint: no live yield provider (coverage for
  Tamil Nadu unverified, API keys absent) → estimator stays a labelled preliminary
  model with editable assumptions. A `SolarYieldProvider` adapter is specified as
  future work, not implemented.
- Frappe CRM lesson applied as restraint: no CRM built or faked; lead path = validated
  API → file queue → optional Resend adapter with honest delivery status. CRM remains
  an owner decision (see launch checklist).
- Motion/Paper-Shaders/Lenis lesson applied as restraint: existing transform/opacity
  IO-gated CSS system already satisfies the brief's motion rules; installing WebGL or
  scroll-engine deps would regress budgets. Reversible decision, recorded in audit §3.6.
- OWASP upload guidance applied as a gate: no uploads implemented (upload feature
  correctly absent; do not add without private storage + auth + scanning + retention).
- Google LocalBusiness guidance applied minimally: name/address/phone/hours/URL only,
  matching page content; no ratings/reviews markup (none exist).

## Not verified in this run (owner / second-agent actions)
- Current MNRE / PM Surya Ghar / TANGEDCO tariff, net-metering, and subsidy terms.
  Safe by design: the site publishes NO subsidy numbers, NO tariff promises, and routes
  all eligibility questions to official portals + consultation. Re-verify at
  https://mnre.gov.in/en/grid-connected-solar-rooftop-programme/ and
  https://solarrooftop.pmsuryaghar.gov.in/ before publishing ANY numeric policy claim.
- Frappe CRM API/hosting evaluation, Resend sender-domain setup, analytics provider
  selection, Tamil translation review, field Core Web Vitals.
