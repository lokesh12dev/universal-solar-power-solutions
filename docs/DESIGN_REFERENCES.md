# Design References — principles adopted (not imitation)

Studied for technique only. Nothing was copied: no layouts, images, branding,
or 3D scenes were taken from any reference. What follows is what each
reference taught us and where that principle lives in this codebase.

## Reference A — Lusion (lusion.co): immersive storytelling, strong direction
- **Adopted: one coherent visual journey.** Homepage sections follow a single
  narrative arc (sunlight → panels → generation → home/business → savings →
  value → installation/support) instead of disconnected blocks.
  See `src/app/page.tsx` section order + `docs/architecture/*` if present.
- **Adopted: restraint.** Restrained motion, no particles/spin/rainbow
  gradients. Continuous animation is limited to one slow CSS-only ambient
  glow (`.ambient-sun`), static under `prefers-reduced-motion`.
- **Rejected:** elaborate WebGL hero. A solar business must load fast and
  convert; an optimized image + kenburns + gradient overlay does the job
  (LCP 0.8s desktop, verified by Lighthouse).

## Reference B — Apple AirPods Pro: scroll-driven product explanation
- **Adopted: staged scroll storytelling.** `PanelEngineering.tsx` (6 stages:
  complete → glass → cells → encapsulation → rear → frame+junction) and
  `SystemDiagram.tsx` (7 selectable nodes) reveal one idea per step, with
  text and diagram synchronized — the Apple technique, applied to a solar
  module and system instead of earbuds.
- **Adopted: mobile simplification.** Sticky diagram on desktop becomes a
  natural stacked sequence on mobile; no pinning on small screens.
- **Adopted: static fallback.** Every stage's full text is in the DOM and
  readable with JS disabled or motion reduced (JS-gated `.reveal`/`.word`
  states + `no-JS` fallbacks in `globals.css`).

## Reference C — GSAP ScrollTrigger docs: controlled scroll-linked animation
- **Adopted: the discipline, not the library.** Existing IO + rAF system was
  audited against ScrollTrigger's rules and already complies: single
  observer per sequence, transform/opacity only, no layout-property
  animation, no scroll-jacking, no pinning, passive listeners, cleanup on
  unmount (`src/components/effects.tsx`, `SolarScrollStory.tsx`).
- **Decision recorded:** GSAP not installed — bundle cost unjustified when
  the current system covers all 10 required animation types. Revisit only
  if a pinned scrub sequence is ever genuinely required.

## Reference D — Awwwards: art direction, typography, hierarchy
- **Adopted: editorial type scale.** Fluid `clamp()` display sizes
  (`.display-hero`, `.display-section`), uppercase technical eyebrow labels
  with restrained tracking, `text-wrap: balance` on headings.
- **Adopted: original accent system.** Deep midnight/charcoal surfaces,
  warm-white text, single restrained gold (`#DDB56B`) highlight + cyan-blue
  tech gradient — specified in centralized tokens (`@theme` + `:root` in
  `src/styles/globals.css`), never neon, never everywhere.

## Reference E — Award-winning GSAP sites: evaluate before selecting
- **Evaluated patterns:** mask reveals (adopted: `MaskReveal`), parallax
  (adopted sparingly: `Parallax` ≤0.05 speed), counters (adopted only for
  genuine calculated values: `Counter`), magnetic CTAs (adopted, ≤7px,
  pointer-only), scroll progress (adopted: hairline `ScrollProgress` +
  section `ScrollFill`).
- **Rejected patterns:** scroll snapping, pinning, autoplay video
  backgrounds, cursor effects, preloader gates — all hostile to a business
  site's conversion and performance goals.

## Net principle
Every effect must earn its place by improving comprehension, trust, or
conversion. If it only decorates, it doesn't ship.
