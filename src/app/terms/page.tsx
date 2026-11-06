import type { Metadata } from "next";
import { Container, Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = { title: "Terms of Use", description: "Limitations of website information, estimates and product content.", alternates: { canonical: "/terms" }, openGraph: { title: "Terms of Use", description: "Limitations of website information, estimates and product content.", url: "/terms", type: "website" }, twitter: { card: "summary_large_image", title: "Terms of Use", description: "Limitations of website information, estimates and product content." } };

export default function Page() {
  return (
    <section className="py-14"><Container>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <article className="prose-solar mx-auto mt-6 max-w-3xl rounded-[2rem] border border-line bg-white p-7 sm:p-10">
        <h1 className="font-display text-3xl font-extrabold text-navy">Terms of Use (draft — needs legal review)</h1>
        <h2>Information limitations</h2><p>Website content is general information, not engineering advice. System sizing, generation and savings depend on a site survey.</p>
        <h2>Calculator estimates</h2><p>The savings calculator is indicative with editable assumptions. It is not a quotation, design or savings guarantee.</p>
        <h2>Products & projects</h2><p>Makes, specifications, warranties and project figures are confirmed in written proposals — not by website listings. Site photos are genuine but capacities are withheld without consent.</p>
        <h2>Third-party links</h2><p>Map embeds and external references are provided for convenience; their content is governed by their own terms.</p>
        <h2>Acceptable use</h2><p>Do not submit false details, spam or unlawful content through our forms. Abuse may be blocked and logged.</p>
      </article>
    </Container></section>
  );
}
