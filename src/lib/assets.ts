/* Prefix public-folder asset URLs with the deployment base path.
   - Local dev / normal server build: BASE_PATH is "" → paths unchanged.
   - GitHub Pages export: NEXT_PUBLIC_BASE_PATH="/universal-solar-power-solutions"
     (set by scripts/build-pages.mjs).
   Needed for plain <video>/<source>/poster attributes, which Next.js does NOT
   rewrite. next/image string sources are verified auto-prefixed in the export
   build (checked in out/index.html, 2026-10-17). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  if (!BASE_PATH || !path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
