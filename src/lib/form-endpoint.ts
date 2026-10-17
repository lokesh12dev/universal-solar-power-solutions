/*
 * Where client forms POST (GitHub Pages static deployment, 2026-10-17).
 *
 * - Local dev / normal server build:
 *     posts to the same-origin API routes (/api/enquiries, /api/support-requests).
 * - Static GitHub Pages build (NEXT_PUBLIC_STATIC_EXPORT=1):
 *     GitHub Pages cannot run server code, so same-origin POST would 404.
 *     Two honest options, no silent fake success:
 *       1. Connect a real backend at build time:
 *            NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxx  (or a
 *            Cloudflare Worker / Vercel function that accepts JSON).
 *          Both forms POST the same JSON body there.
 *       2. Otherwise the forms show a clear "backend not connected on this
 *          host — please call or email us" message. Nothing is pretended to
 *          have been submitted or stored.
 * See WEBSITE_IMPLEMENTATION_STATUS.md → "GitHub Pages deployment" for details.
 */
export const EXTERNAL_FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export function resolveFormEndpoint(localPath: string): string | null {
  if (EXTERNAL_FORM_ENDPOINT) return EXTERNAL_FORM_ENDPOINT;
  return STATIC_PREVIEW ? null : localPath;
}

export const STATIC_NO_BACKEND_NOTICE =
  "Static preview hosted on GitHub Pages — the form backend is not connected here, so nothing can be submitted. Please call or email us using the contact details on this site.";
