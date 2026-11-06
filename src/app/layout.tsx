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
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-cyan focus:px-4 focus:py-2 focus:font-bold focus:text-navy">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
