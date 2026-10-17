import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Required so the route prerenders under `output: "export"` (GitHub Pages).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${base}/sitemap.xml` };
}
