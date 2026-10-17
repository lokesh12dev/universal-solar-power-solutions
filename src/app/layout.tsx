import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Header, Footer } from "@/components/layout";
import { site } from "@/config/site";

const display = Manrope({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.brand} | Rooftop Solar EPC in Chennai`, template: `%s | ${site.shortBrand}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: site.brand, title: `${site.brand} | Rooftop Solar EPC in Chennai`,
    description: site.description, images: [{ url: "/images/legacy/project4.jpeg", width: 1200, height: 630, alt: "Rooftop solar array installed by Universal Solar" }],
  },
  twitter: { card: "summary_large_image", title: site.brand, description: site.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // LocalBusiness schema from verified facts in site.ts only — no ratings,
  // reviews, or unconfirmed credentials (see site.needsVerification).
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.brand,
    url: site.url,
    telephone: site.contact.primaryPhone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1} ${site.address.line2}`,
      addressLocality: site.address.city,
      postalCode: site.address.pin,
      addressRegion: site.address.state,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: site.serviceAreas,
  };
  // suppressHydrationWarning is deliberate: the inline 'js' class script in
  // <head> runs before hydration, so the html element's attributes legitimately
  // differ from the SSR HTML — showing the mismatch warning on every page.
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Mark JS presence before paint so CSS reveal states only hide when JS can restore them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-cyan focus:px-4 focus:py-2 focus:font-bold focus:text-navy">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
