# Asset Manifest — Universal Solar Power Solutions

All imagery is **local-only** (`public/images/`). No remote hotlinks, so nothing
depends on a third-party URL staying alive. Stock-illustrative assets are labeled
in UI copy as "Illustrative imagery — not a company project".

## Hero
| File | Used in | Source / license | Notes |
|---|---|---|---|
| `solar-banner-1920.jpg` (456K) | Homepage hero (priority, full-bleed) | Company asset, already in repo | 768/1280 derivatives exist; `sizes="100vw"` |
| `solar-banner-1280.jpg` (224K) | Residential section | Same | Labeled illustrative |
| `solar-banner-768.jpg` (104K) | Solutions → Residential card | Same | Labeled illustrative |
| ~~`solar-banner.jpg` (9.9MB)~~ | DELETED 2026 — unreferenced in `src/` | — | Removed to avoid confusion/weight |

## Genuine site photos (`public/images/legacy/`, ~1.9MB total)
project1–project9.jpeg — Universal Solar installation/structure work, used in
solutions cards, tech section, projects gallery, process showcase, commercial section.
Capacities/customers NOT published (unverified) — gallery states this explicitly.
`logo.png` — header/footer logo tile.

## Section videos — Residential + Commercial (2026-10-17, replaced iStock preview)
| File | Used in | Source / license | Notes |
|---|---|---|---|
| `public/videos/residential-solar-1080.mp4` (22.6MB, 1920×1080, 30s) + `residential-solar-720.mp4` (10.5MB) | Homepage Residential section image box | Owner-supplied: `~/Downloads/37907-415263544.mov` (4K drone over a residential panel array, no audio). Encoded locally: lanczos downscale, two-pass ~6Mb/s (1080) / ~2.8Mb/s (720), faststart, no audio, native fps. Original untouched in Downloads | `src/components/SectionVideo.tsx` — box ratio preserved (1260/840), reveal animation, mounts only when scrolled into view, `<source media>` desktop→1080/mobile→720, reduced-motion/data-saver → poster, error → poster |
| `public/images/residential-solar-poster.jpg` | Poster | Frame t=3 from the same video | |
| `public/videos/commercial-solar-1080.mp4` (19.3MB, 1920×1080@60) + `commercial-solar-720.mp4` (9.6MB) | Homepage Commercial section image box | Owner-supplied: `~/Downloads/t_edihzlj8.mp4` (aerial factory rooftops, no audio) | Same component/behavior as residential |
| `public/images/commercial-solar-poster.jpg` | Poster | Frame t=5 from the same video | |
| ~~`commercial-solar.mp4` (iStock preview, watermarked)~~ | REMOVED — unlicensed iStock preview superseded by owner's own footage; license flag resolved | — | 2026-10-17 |

## Hero video (owner-supplied — Pexels rooftop replacement removed 2026-10-17)
| File | Used in | Source / license | Notes |
|---|---|---|---|
| `public/videos/solar-background.mp4` (1.9MB, 768×432 H.264 baseline, 25fps, 15.0s, no audio) | Homepage hero background | Owner's own video: `~/Downloads/WhatsApp Video 2026-10-16 at 09.53.08 (1).mp4` (solar-farm + wind-turbine 3D animation). Remuxed stream-copy (`-c:v copy -an`, faststart) — zero visual quality change, audio track stripped (2kb/s). Original untouched in Downloads; pristine copy also at `/tmp/whatsapp-original-backup.mp4` | Single file for all viewports. Poster-first paint; static fallback on error/reduced-motion/data-saver/no-JS. **Native 768×432 — NOT upscaled, not marketed as HD/4K**; may look soft on very large screens (source-limited) |
| `public/images/solar-background-poster.jpg` (58KB, 768×432) | Video poster + instant paint + static fallback | Frame extracted from the same video (t=2) | `src/components/HeroBackground.tsx` |
| ~~`hero-rooftop-1080.mp4`, `hero-rooftop-720.mp4`, `hero-rooftop-poster.jpg`~~ | **REMOVED** per owner instruction — genuine Pexels 4K drone footage (video 2836004, commercial-use OK) was NOT the requested asset. 4K master retained at `/tmp/pex-2836004-uhd.mp4` if ever needed again | — | Superseded 2026-10-17 |

## Deliberately NOT integrated (blocked — needs decision + budget)
- **Licensed stock video backgrounds (Pexels/Unsplash)**: superseded — owner supplied their own animation; no stock video needed.
- **Technician close-ups, PV-cell macro, inverter detail photos**: no owned assets;
  panel/system sections use hand-built SVG diagrams (accurate, lightweight).
- `public/images/sections/` is empty — reserved for the above when licensed.

## Per-section treatment
Hero: full-bleed image + navy/gold gradient overlay. Cards: MaskReveal + ScrollOpen.
Editorial: MaskReveal + subtle Parallax. Diagrams: SVG, no raster needed.
Calculator: quiet navy panel (no photo behind inputs). CTA: ambient CSS glow.
