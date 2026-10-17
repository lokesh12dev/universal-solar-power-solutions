#!/usr/bin/env node
/*
 * build-pages.mjs — static export for GitHub Pages.
 *
 * 1. Sets GITHUB_PAGES=true so next.config.ts switches to
 *    output:"export" + basePath + trailingSlash + images.unoptimized.
 * 2. Parks src/app/api as a PRIVATE folder for the duration of the build.
 *    App Router folders prefixed with "_" are not routed, and GitHub Pages
 *    cannot run route handlers anyway. The API code itself is untouched and
 *    is restored in `finally` (even if the build fails), so `npm run dev`
 *    and `npm run build` keep full server functionality.
 * 3. Runs `next build` → ./out (index.html + one folder per route).
 *
 * Usage:  npm run build:pages
 * Override the subpath if the repo is renamed: PAGES_BASE_PATH=/new-name npm run build:pages
 * Optional external form backend: NEXT_PUBLIC_FORM_ENDPOINT=https://… npm run build:pages
 */
import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";

const BASE_PATH = process.env.PAGES_BASE_PATH || "/universal-solar-power-solutions";
const API_DIR = "src/app/api";
const PARKED_DIR = "src/app/_api-parked-for-static-export";

process.env.GITHUB_PAGES = "true";
process.env.NEXT_PUBLIC_BASE_PATH = BASE_PATH;
process.env.NEXT_PUBLIC_STATIC_EXPORT = "1";

if (existsSync(PARKED_DIR)) {
  console.error(`Leftover ${PARKED_DIR} found — restore it to ${API_DIR} before building.`);
  process.exit(1);
}

let parked = false;
if (existsSync(API_DIR)) {
  renameSync(API_DIR, PARKED_DIR);
  parked = true;
}

try {
  const result = spawnSync("npx", ["next", "build"], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  if (parked) renameSync(PARKED_DIR, API_DIR);
}
