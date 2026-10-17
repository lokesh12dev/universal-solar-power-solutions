import type { NextConfig } from "next";

/*
 * GitHub Pages static-export mode (2026-10-17):
 * Enabled ONLY when GITHUB_PAGES=true — set by scripts/build-pages.mjs, which is
 * what `npm run build:pages` and the deploy workflow run. Local `npm run dev` /
 * `npm run build` keep the normal server app, API routes included.
 * assetPrefix is intentionally NOT set: Pages serves everything from the same
 * origin/subpath, so basePath alone prefixes /_next/* correctly (setting both
 * would double-prefix chunks).
 */
const isPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Anchor module tracing to this project (a stray lockfile in ~ would
  // otherwise make Next infer the wrong workspace root).
  outputFileTracingRoot: process.cwd(),
  ...(isPages
    ? {
        output: "export" as const,
        basePath: pagesBasePath || undefined,
        trailingSlash: true,
      }
    : {}),
  experimental: {
    // Tree-shake the icon barrel — lucide-react is the largest client dep.
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // Static export has no image-optimization server — serve the original
    // assets (already pre-sized down to 1280w) instead.
    unoptimized: isPages,
    remotePatterns: [
      { protocol: "https", hostname: "www.universalsolarpowersolutions.com" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Cap generated srcsets — default includes 3840w which we never need
    // (all photography is local, max native asset is 1280w). Prevents 3840px thumbs.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
  // Custom headers only exist on the server build — GitHub Pages cannot serve
  // them (omitting the key entirely avoids a build warning in export mode).
  ...(isPages
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
