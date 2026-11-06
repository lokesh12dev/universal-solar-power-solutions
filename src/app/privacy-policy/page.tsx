import type { Metadata } from "next";
import { Container, Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Universal Solar handles enquiries and personal data.", alternates: { canonical: "/privacy-policy" }, openGraph: { title: "Privacy Policy", description: "How Universal Solar handles enquiries and personal data.", url: "/privacy-policy", type: "website" }, twitter: { card: "summary_large_image", title: "Privacy Policy", description: "How Universal Solar handles enquiries and personal data." } };

export default function Page() {
  return (
    <section className="py-14"><Container>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <article className="prose-solar mx-auto mt-6 max-w-3xl rounded-[2rem] border border-line bg-white p-7 sm:p-10">
        <h1 className="font-display text-3xl font-extrabold text-navy">Privacy Policy (draft — needs legal review)</h1>
        <h2>Information we collect</h2><p>Name, phone, email (optional), PIN code, property type, service need, monthly bill (optional) and your message — only what you submit in the enquiry form.</p>
        <h2>Purpose</h2><p>To respond to your enquiry, arrange surveys and prepare proposals. We do not sell data or use it for unrelated marketing.</p>
        <h2>Processing & storage</h2><p>Enquiries are queued on our server (data/enquiries) and, when configured, forwarded by email to our team. No CRM or analytics is active unless documented here.</p>
        <h2>Retention</h2><p>Enquiry records are kept only as long as needed to handle your request and meet legal obligations. Ask for deletion via the contact email.</p>
        <h2>Your rights</h2><p>Contact us to access, correct or delete your enquiry data.</p>
        <p className="rounded-2xl bg-ice p-4 text-sm">This is a draft. Have it reviewed by the business and a legal adviser before launch. Analytics section intentionally omitted — none is implemented.</p>
      </article>
    </Container></section>
  );
}
