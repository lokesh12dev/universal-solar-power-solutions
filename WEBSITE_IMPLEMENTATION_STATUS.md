# WEBSITE IMPLEMENTATION STATUS — Universal Solar Power Solutions

## Objective
Premium, cinematic, fast, responsive solar website with scroll-talk storytelling,
verified calculators, working forms, and tested functionality.

## Completed (verified in code + build)
- [x] Full project audit (Next.js 15 App Router, React 19, Tailwind v4, lucide, zod; NO GSAP/Three.js — custom IO+rAF motion system kept deliberately)
- [x] Spec color tokens (`--coal #070B10`, `--coalsec`, `--elevated`, `--gold #DDB56B`, `--goldpale`, `--azure`, `--techborder`) + `btn-gold`, `text-sun-gradient`, `ambient-sun` CSS-only background
- [x] Nav to spec (Home, Residential Solar, Commercial Solar, Projects, Solar Calculator, Services→/support, About) + mobile extras + responsive CTA label
- [x] Hero to spec (eyebrow, headline, gold primary CTA, ghost secondary → #solutions, trust row, no-JS safe)
- [x] Solutions cards to spec copy (Residential / Commercial / Solar Services → /support)
- [x] Residential + Commercial editorial sections with honest image labeling
- [x] PanelEngineering SVG scroll story (6 stages, buttons, sticky diagram, reduced-motion safe)
- [x] SystemDiagram interactive SVG (7 nodes, accessible buttons, illustrative-flow disclaimer)
- [x] Calculator preview retitled "See what sunlight could do."
- [x] Final CTA to spec + footer "Services & Support"
- [x] TS type error in PanelEngineering fixed; `typecheck` + `build` green
- [x] Backend verified real: /api/enquiries + /api/support-requests (zod, rate-limit, honeypot, file-queue + optional Resend)
- [x] Solar Studio: 5 tabs (Home savings, Business ROI, Roof studio, Bill analysis, Solar+battery) + src/lib/tools.ts + tests/tools.test.mjs (9 tests)
- [x] BackToTop gold restyle; deleted unreferenced 9.9MB solar-banner.jpg; docs/ASSETS.md manifest
- [x] Link audit: all static + dynamic hrefs resolve (services/support, product/project/resource slugs verified)
- [x] SSR smoke test: 8 key routes → 200, new sections present in HTML, zero server errors

## Remaining (session: finish — all items below now done unless noted)
- [x] Media: 4 Pexels photos downloaded (images.pexels.com reachable), visually verified, integrated locally in `public/images/sections/` (residential-home-solar, commercial-roof-crew, technician-roof-install, engineer-site-survey) with honest stock captions; all serve HTTP 200 with correct bytes
- [x] Design-references doc: `docs/DESIGN_REFERENCES.md` (Lusion, Apple AirPods Pro, GSAP docs, Awwwards, GSAP award sites — principles adopted, rejections recorded)
- [x] Phase D-H: typecheck clean, 99/99 tests, build 41/41, browser re-validation (forecast UI present with payback/NPV/IRR, no overflow @390+1440, zero page/request errors), screenshots reviewed
- [ ] Licensed video (still blocked — no verifiable video-file URLs; static hero + ambient glow remain the honest fallback; see docs/ASSETS.md acquisition plan if present)

## Known blockers (documented, not claimed)
- Video backgrounds NOT implemented (no downloadable licensed video found; not faked).
- Cosmetic: `/favicon.ico` 404s (only `src/app/icon.svg` exists; harmless browser default request, no user-facing error).
- No GSAP/Three.js installed (deliberate): existing motion system covers all 10 animation types; pinning avoided per spec warnings. No voice narration (judged unnecessary).

## Real-browser validation (2026-10-16, headless Chrome 155 + puppeteer-core harness in /tmp, Lighthouse)
### Passed
- 9 pages x viewports (320/375/430/768/1024/1440/1920 home+studio; 390/768/1440 others): **0 console errors, 0 failed requests, 0 horizontal overflow** (DOM metrics)
- Interactions: 6 panel stages sync diagram+text; 7 system nodes update live region; 5 studio tabs toggle aria-selected with correct results; #solutions anchor scrolls; mobile nav opens/closes incl. Escape; back-to-top appears and returns to y=0; empty contact submit shows 4 inline errors; reduced-motion renders full hero text
- Lighthouse desktop: **100/100/100/100**, LCP 0.8s, CLS 0, TBT 0ms. Mobile: 89/100/100/100, LCP 3.7s (simulated Moto G4/4G), CLS 0
- Screenshots reviewed: hero, solutions, residential, commercial, panel, system, studio tabs, contact validation, mobile nav, knowledge, footer
### Failed and fixed
- `label-content-name-mismatch` (header logo link): nested role=img + aria-label confused axe; fixed by exposing wordmark text and dropping redundant labels (Brand.tsx, layout.tsx). Verified 0 violations via axe-core + Lighthouse
- Residential image caption clipped by overflow-hidden figure: moved rounding to frame/img, caption now fully visible (screenshot-verified)
- Test suite broke under Node 26 (`"type":"commonjs"` stops .ts ESM imports): set `"type":"module"` (no CJS usage anywhere; Next build unaffected). 90/90 green (now 99/99 with finance tests)
### Failed and fixed (session: genuine-HD hero replacement)
- Root cause of blur confirmed: old video was assembled from 768×432 owner frames and upscaled — source-limited, honestly documented, never claimed as 4K. Replaced with genuine Pexels 4K drone footage (video 2836004, "Solar Panels On The Rooftop Of A Building", verified 3840×2160 master, 15s continuous push, individual cells visible).
- Delivery: 1080p CRF24 desktop (7.0MB) + 720p CRF26 mobile (2.7MB) via `<source media>` (per-file requests verified: each viewport downloads only its file); 1920w poster first paint; reduced-motion/data-saver/error/no-JS static fallbacks; audio stripped; old upscaled files deleted.
- Verified: desktop + mobile playback at native res, screenshots reviewed (sharp cells, readable text, correct crops, no overflow), 0 errors, 99/99 tests, build 41/41, Lighthouse desktop 98/100/100 (LCP 1.1s, CLS 0, TBT 0; poster grew 67→390KB, still well under budget).
- License note: Pexels License commercial use; creator name unverified (page fetch blocked) — recorded as "Pexels video 2836004", confirm creator before any broadcast use.
### Implemented (session: videos + client questions + panel animation + about/spacing)
- **Residential + Commercial videos**: owner files integrated into their homepage boxes via new `src/components/SectionVideo.tsx` (one reusable component, `CommercialVideo` removed to avoid duplicates). Residential `37907-415263544.mov` (4K→1080 two-pass 6Mb/s + 720 2.8Mb/s), commercial `t_edihzlj8.mp4` (exact filename verified; 1080@60 → 1080 5Mb/s + 720 2.5Mb/s). Verified desktop+tablet playback 1920×1080 in-box, box ratio 1.5 preserved, mobile mounts on view. CRF 20 first attempt ballooned (60MB) → two-pass bitrate-controlled instead (perceptually transparent, web sizes).
- **Copy polish**: both sections rewritten in simple professional English (no invented claims): residential paragraph/cards, commercial paragraph + 6 descriptive benefit cards (was plain tag chips). CTAs unchanged.
- **Client Questions section** (new `src/components/ClientQuestions.tsx`): dark navy premium accordion, exact eyebrow/heading/description + 6 Q&As from spec, plus→minus gold icon, grid-rows height transition, accessible (aria-expanded/controls/region), placed before final CTA. Verified open/close + aria at 3 viewports.
- **Panel animation upgrade** (`PanelEngineering.tsx`): scroll-linked exploded view — laminate separates (glass −46 … junction +32) with sine curve over the cards column, reassembles at end, reverses naturally on scroll up; transforms applied imperatively per rAF (no re-render per frame); active-layer callout with leader line tracks its layer; viewBox widened 340→430 to fit labels; gradient fills + top-light detail added; reduced-motion → static assembled SVG (verified: no transform attrs). Peak separation verified numerically at all offsets.
- **About page**: balanced image grid (removed offset holes), MaskReveal reveals for site photos, cleaner "Pending verification" note styling, better copy spacing (1.02rem/1.75).
- **Spacing/scroll audit** (puppeteer, 1440/768/390): section gaps between all 14 homepage sections = **0**, horizontal overflow = **0** at all widths, zero console errors (hydration fix from earlier holds). scroll-behavior:smooth confirmed (html) with reduced-motion override.
- **Tests**: 99/99 unit tests, typecheck clean, **production build green** (dev server stopped first per standing rule, then restarted; :3000 + both new videos serve 200).
### Implemented (session: GitHub Pages static export + deployment)
- **Conditional static export** — enabled ONLY via `GITHUB_PAGES=true` (`npm run build:pages` → `scripts/build-pages.mjs`). Local `npm run dev` / `npm run build` remain the normal server app; the workflow runs tests + typecheck + export build and publishes to Pages on pushes to `deploy` (manual trigger too).
- **basePath** `/universal-solar-power-solutions` (from `NEXT_PUBLIC_BASE_PATH`), `trailingSlash: true`, `images.unoptimized: true`, `assetPrefix` deliberately omitted (same-origin subpath; basePath alone prefixes `/_next/*`). Headers config omitted in export mode (Pages can't serve custom headers).
- **Asset paths**: next/image does NOT prefix basePath in unoptimized mode (verified in exported HTML) → new `src/lib/assets.ts` `asset()` helper applied to every next/image string src AND raw `<video>/<source>/poster>` attrs (HeroBackground, SectionVideo, MaskReveal + 8 call-site files). Verified in `out/`: all images/videos/fonts/chunks carry the prefix.
- **robots.ts / sitemap.ts**: added `export const dynamic = "force-static"` (required under `output: export`); canonical/OG/sitemap/robots verified pointing at `https://lokesh12dev.github.io/universal-solar-power-solutions/...` when `NEXT_PUBLIC_SITE_URL` is set at build (workflow does).
- **API routes on Pages**: impossible by nature — `scripts/build-pages.mjs` parks `src/app/api` as a private (underscore) folder during the export build only, restores it in `finally`; verified restored + dev API still functions (422 smoke test). Nothing deleted.
- **Forms honesty**: `src/lib/form-endpoint.ts` — server builds POST to the API routes as before; static build shows an explicit "no backend on this host" notice (visible near form + on submit; never fake success). Optional real backend: build with `NEXT_PUBLIC_FORM_ENDPOINT=https://…` (Formspree/worker) and both forms POST JSON there.
- **Test script** no longer swallows failures (`node --test tests/`), so CI gates on it. Workflow: `.github/workflows/deploy-pages.yml` (npm ci → tests → typecheck → build:pages → upload-pages-artifact → deploy-pages; `pages`/`id-token` permissions; no secrets).
- **Verification (local)**: export build green; served `out/` under the real subpath and browser-tested — hero video + section videos playing (readyState 4, prefixed URLs), 22/22 homepage images loaded, dynamic product pages render, about/products routes 200, canonical/OG correct, 0 console errors, 0 asset 404s; contact form submit shows the honest static message.
- **Backend requirement (go-live)**: enquiry + support submissions need a real server (they don't exist on Pages by design). Options: set `NEXT_PUBLIC_FORM_ENDPOINT` to an external form service, or host the full app on a Node host (Vercel/Render) for the API routes.
### Implemented (session: Vercel serverless readiness)
- **API routes are now serverless-safe.** The file queue (`data/`) is read-only on Vercel serverless functions; previously that throw also skipped the Resend email path entirely — so even with email configured, submissions failed. Now: `buildRecord()` creates the record, `persistRecord()` file-write failure is non-fatal, email is attempted independently, and the response reports `stored` / `emailSent` / `emailStatus` honestly. Both-fail returns 500 with a clear "call us" message (never fake success). Local dev behavior unchanged (files still written under `data/`).
- **Vercel compatibility verified on the live deployment** (universal-solar-power-solutions.vercel.app): dynamic routes 200 (308s are Next's normal trailing-slash normalization), API validation 422, `/_next/image` optimizer working, security headers active, hero + both section videos playing, 0 console errors / 0 horizontal overflow / 0 section gaps at 1440 and 390 widths.
- **GitHub Pages settings cannot conflict with Vercel**: every export-only switch (`output: "export"`, basePath, trailingSlash, images.unoptimized) is gated behind `GITHUB_PAGES=true`, which is set ONLY by `scripts/build-pages.mjs` (Pages workflow). Vercel runs the standard `npm run build` — server build, no basePath, no export. Verified: 41/41 pages + `ƒ /api/*` routes in the local server build.
- **REQUIRED Vercel environment variables for live forms** (Project → Settings → Environment Variables):
  `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL` (Resend account), and optionally `NEXT_PUBLIC_SITE_URL=https://universal-solar-power-solutions.vercel.app` for canonical/sitemap URLs on this host. Without the Resend trio, submissions return the honest "call us directly" message (nothing stored or sent). With them, enquiries email you directly — recommended for go-live.
- Production branch on Vercel must be `deploy` (repo default) for automatic deploys on push.
### Failed and fixed (session: hydration warning removal)
- Every page showed the dev-overlay "1 Issue": React 19 hydration attribute mismatch on `<html>` — the pre-paint inline `<script>` in `<head>` (`document.documentElement.classList.add('js')`, the CSS no-JS gate from the original build) always differs from SSR HTML. Fixed with `suppressHydrationWarning` on the `<html>` element in `src/app/layout.tsx` (Next.js-documented approach for html/body mutations; children unaffected, AOUC flash gate fully preserved).
- First attempt misplaced the explanatory comment between `return (` and the element → JSX parse error + 500 on all pages; corrected to a JS comment above the return.
- Verified: `/`, `/about`, `/contact`, `/commercial-solar` now load with **zero console errors**; commercial video + hero video still playing (desktop + mobile, native res, reveal + loop intact); typecheck clean; 99/99 tests.
### Implemented (session: commercial-section video)
- Owner-supplied video now plays in the commercial image box ONLY ("A smarter energy strategy starts here"): `public/videos/commercial-solar.mp4` = stream-copy remux of `~/Downloads/istockphoto-2202007360-640_adpp_is.mp4` (768×432, 25fps, 24.16s — zero quality change, faststart, no audio in source). Poster `commercial-solar-poster.jpg` (t=8 frame).
- New `src/components/CommercialVideo.tsx` mirrors MaskReveal's box/classes/reveal but with video inside (shared MaskReveal untouched, used by many other pages): box ratio exactly preserved (measured 1.5 = 1260/840), rounded corners + ring kept, video mounts only when scrolled into view (no early bandwidth), reduced-motion/saveData → static poster, error → poster (box never blank), autoplay muted loop playsInline preload="metadata".
- Verified with scrolling-browser QA on :3000: desktop + mobile picture-in-box playback at native 768×432, reveal fires, loop wrap 17.9→~1.17, hero background untouched and resumes playing after scroll-back, video served HTTP 206 + poster 200 (per-file 200/206), no new console/page errors, screenshots reviewed (box, copy, CTAs, lists unchanged). typecheck + 99/99 tests green.
- **Licensing honesty flag: source is an iStock PREVIEW file with visible faint "iStock by Getty Images" watermark — previews are NOT licensed for production use. License must be purchased (or a licensed original supplied) before launch. Documented in docs/ASSETS.md.**
- Earlier unresolved Pexels commercial task (8853530 etc.) superseded by this owner-supplied file; pages still bot-blocked, CDN scan negative.
### Failed and fixed (session: owner-video hero restore)
- The genuine Pexels 4K rooftop footage (previous session) turned out to be the wrong asset — owner wanted THEIR OWN video restored. Supplied: `~/Downloads/WhatsApp Video 2026-10-16 at 09.53.08 (1).mp4` (solar-farm + turbine 3D animation, 768×432, 25fps, 15.04s, 1.9MB). Pexels files deleted everywhere else, nothing else touched.
- Implementation: stream-copy remux (`-c:v copy -an`, faststart, 0 quality change) → `public/videos/solar-background.mp4` 1.9MB single file (one download for desktop+mobile, no source-split dupes); t=2 frame → poster 58KB; `HeroBackground.tsx` constants swapped, responsive source_SPLIT removed, all fallback logic (reduced-motion/data-saver/error/no-JS → static poster) intact. Hero copy, CTAs, overlay untouched.
- Honesty note: source is natively 768×432 — documented as NOT upscaled, may appear soft on very large displays (source-limited, same as first owner-frame attempt but now from owner's own requested file).
- **Commercial-section video (Pexels 8853530 + alternatives): UNRESOLVED** — page URLs bot-blocked (403) and CDN filename-pattern scan found no renditions; paused, not implemented. Needs direct file URLs or supplied file.
### Failed and fixed (session: hero headline speed)
- Owner reported the hero word-reveal felt slow: stagger was 55ms/word with 0.65s transitions (~1.1s total). Added `.words-fast` variant (0.32s transitions) and cut hero stagger to 20ms (~0.45s total, browser-measured). Screenshot-verified.
- Owner's `~/Downloads/Background website -jpg/` (166 ezgif frames, 768×432 solar-farm animation) assembled with ffmpeg into 720p H.264 5.5s loop; CRF 21 (5.1MB) → CRF 27 (2.3MB) → CRF 30 + light denoise (1.4MB, visually verified clean). New `HeroBackground.tsx`: poster-first paint, autoplay muted loop, static fallback on error / reduced-motion / no-JS. Browser-verified: playing (t≈4s, 1280×720), reduced-motion shows static image only, H1 intact, zero errors.
- False alarm: reduced-motion probe showed a video element — root cause was a corrupted dev `.next` (production `npm run build` executed while dev server was running; dev served 404/text-plain chunks so hydration never ran). Fixed by stopping dev, `rm -rf .next`, fresh restart; re-verified correct. **Rule: never run `npm run build` with the dev server up.**
- Hero copy replaced per owner request: brand eyebrow "Universal Solar Power Solutions", H1 "Powering Your Future with Clean, Renewable Energy.", new description, restored "Serving Chennai, Tamil Nadu, India" line; "Explore Solar Solutions" secondary CTA retained. Typecheck clean, browser-verified (H1 exact, no overflow, no errors).
- `support/page.tsx` MaskReveal edit + all 4 Pexels images verified saved and served (HTTP 200, correct byte sizes); no git history exists in this directory (not a repo — noted, no history to inspect)
- False alarm: `engineer-site-survey` / `commercial-roof-crew` read 0x0 in DOM probe — proven to be lazy-load timing; full scroll-through shows **22/22 homepage images loaded**, 0 broken, 0 overflow @390+1440, 0 errors
- Caption left-edge clipping on support image: added `padding-inline: 8px` to `.maskreveal-cap`; typecheck + build + 99/99 tests green after
### Still failing / not tested
- Nothing failing. Not tested: physical-device touch feel, screen-reader pass (NVDA/VoiceOver), field Core Web Vitals, form end-to-end email delivery (needs RESEND_API_KEY), video (no assets)
### Blocked (unchanged)
- Licensed video, technician/cell-macro photos, physical devices, production domain config

## Current stage
Finish session complete. Unit tests 99/99 (90 prior + 9 finance), typecheck
clean, production build green (41 routes), real-browser QA re-run clean
(forecast UI verified, 0 errors, 0 overflow). QA harness lives in /tmp/bus-qa
(NOT in the project); project deps unchanged (lucide, next, react, react-dom,
zod). Dev server running on :3000. Status of prior "Remaining" items resolved
above; stale-dev 500 incident (build overwrote .next under running dev server)
resolved by restart and noted as environment staleness, not a code defect.

## Next steps (only if requested)
1. Physical-device + screen-reader pass
2. Licensed hero/installation video integration
3. Production env config (RESEND_API_KEY, SITE_URL) + live form delivery test
