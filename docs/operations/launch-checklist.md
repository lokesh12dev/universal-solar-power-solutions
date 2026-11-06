# Launch Checklist — Universal Solar Power Solutions
Owner = business owner/team. Agent-completed items are marked [DONE]; the rest
require credentials, records, or decisions only the owner can supply.

## Environment & integrations
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production canonical URL [DONE in .env.example as placeholder]
- [ ] Verify Resend sender domain; set `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`; send test enquiry; confirm inbox routing + on-call coverage
- [ ] Choose CRM/storage for enquiries (file queue is ephemeral on serverless); define PII retention + deletion process
- [ ] Approve analytics provider + privacy wording; only then set `NEXT_PUBLIC_ANALYTICS_ID`
- [ ] Confirm WhatsApp number (supports WhatsApp?) before any wa.me link is added

## Content sign-off (see `docs/research/company-claims-ledger.md`)
- [ ] Confirm legal business name, address + map pin, all 3 phones + order, email inbox, hours, service-area boundaries
- [ ] Supply or reject: years/projects/MW/customer figures, MNRE/TANGEDCO status, brands, warranties, subsidies, project consents, team roles
- [ ] Approve OG/social image (current is a legacy site photo placeholder)
- [ ] Review Tamil content if/when added (no machine-translated tariff/legal advice)

## Pre-deploy verification (agent)
- [DONE] `tsc --noEmit` clean · `npm test` green · `next build` static OK (re-run at release; see final report)
- [DONE] API probes: 201 valid / 422 invalid / 413 oversize / 405 wrong-method / 429 rate-limited
- [DONE] No secrets in repo (only `.env.example` placeholders); PII-safe logging/analytics (test-enforced)
- [ ] Post-deploy smoke: `/robots.txt`, `/sitemap.xml`, OG card, 422-path + 201-path (delete test record), security headers + HSTS check
- [ ] Manual responsive + keyboard + reduced-motion pass at 360/768/1280/1440 (no E2E harness in repo)
- [ ] `git init` + first commit; confirm `data/` and `.env*` stay untracked (repo has no VCS yet)

## Known accepted limitations (not blockers, do not fake)
- Commercial ROI/NPV/IRR estimator: not implemented (no validated C&I model) — planner routes to consultation
- No uploads, no auth/portal, no live monitoring, no Tamil UI, no E2E suite
- Rate limiter is single-instance memory (documented; needs Redis/edge store for multi-instance prod)
