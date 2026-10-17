# Launch-Readiness Audit
Date: 2026-10-16 · Build: fresh `next build` + cold-started `next start -p 3000` (PID 4441).
Verdict: **Conditionally ready** — all code-controlled gates pass; remaining items
need owner credentials/records (listed, none faked).

## Automated checks (commands + results)
| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` (`tsc --noEmit`) | CLEAN |
| Unit/contract tests | `npm test` (`node --test tests/*.test.mjs`) | 75/75 PASS, 19 suites (67 baseline + 8 rate-limit) |
| Production build | `npm run build` | OK — all static routes + SSG slugs prerendered |
| Lint | `npm run lint` (`next lint`) | NOT RUN — upstream deprecated, drops into interactive ESLint-setup prompt; unsuitable for CI (pre-existing, documented in README). No new lint risk introduced (no new deps). |
| E2E suite | — | NONE IN REPO — covered manually via live probes below |

## Live probes (cold server, fresh build)
- Pages 200: `/`, `/about`, `/projects`, `/contact`, `/support`,
  `/solar-savings-calculator`, `/plan-my-solar`, `/residential-solar`,
  `/robots.txt`, `/sitemap.xml` — ALL 200.
- `POST /api/enquiries` valid → 201 `{id, emailSent:false, emailStatus:"email-not-configured"}` + file landed in `data/enquiries/` (verified on disk, then deleted).
- Invalid payload → 422 with field errors. Oversize → 413 (test-covered). Wrong methods → 405 (test-covered).
- Flood (12 POSTs, one IP): 10×201 then 2×429 with `Retry-After` — limiter works live.
- Served HTML contains LocalBusiness JSON-LD with verified facts only (name/phone/Chennai 600070 asserted live).
- Analytics events wired: `calculator_completed` (Calculator, once per interacting session), `service_request_submitted` (SupportForm 201), `project_case_study_viewed` (CaseStudyView). `site_survey_requested` deliberately NOT added — planner `consultation_request` is the survey-intent event; firing both would double-count (mapping recorded here).

## Anomaly (honest record)
An earlier probe batch returned 201s with no files found in `data/enquiries/`. Cause:
a stale `next-server` (started 10:34AM, predating the fresh build) survived a `pkill`
and served requests. Resolved by killing PID explicitly, cold-starting from the new
build, and re-probing: files confirmed on disk. Lesson recorded: verify server PID +
build freshness before trusting probe results; always clean probe records (done).

## Manual checks performed
- Claim grep: no fabricated stats/24-7/subsidy/warranty promises in `src` (only quarantined `needsVerification` + conditional wording).
- Secrets: `.env.example` placeholders only; `RESEND_API_KEY` server-side only (test-enforced); no PII logging (test-enforced); analytics event-names-only (code-reviewed).
- Keyboard/focus: skip-link, aria-expanded accordions, labelled fields + error associations, `aria-live` calculator summary + form statuses (code-reviewed, existing patterns preserved).
- Reduced motion: all animation systems (base + future-* + scrollopen) static-safe via media query (code-reviewed).
- No horizontal-overflow or contrast regressions introduced (changes were server logic, schema, event fires, docs).

## Not performed (no harness / needs owner)
E2E browser runs, screen-reader session, multi-breakpoint screenshots, field Web Vitals,
secret scan tooling, `git init` (no VCS in repo — owner action per launch checklist).

## Blockers for production launch (owner)
1. Company-records sign-off on all 13 claims-ledger rows (name/phones/address/hours/areas + all metrics/credentials).
2. Resend sender-domain + env vars + inbox routing test (else leads queue to ephemeral files).
3. CRM/storage decision + retention policy (file queue does not survive serverless).
4. Analytics provider approval (dormant until ID set). 5. Post-deploy smoke + headers/HSTS.
