import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/content/products";
import { projects } from "@/content/projects";
import { articles } from "@/content/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const statics = ["/", "/residential-solar", "/commercial-solar", "/industrial-solar", "/products", "/projects", "/about", "/solar-savings-calculator", "/plan-my-solar", "/support", "/resources", "/knowledge", "/contact", "/privacy-policy", "/terms"];
  const now = new Date();
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${base}/resources/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
