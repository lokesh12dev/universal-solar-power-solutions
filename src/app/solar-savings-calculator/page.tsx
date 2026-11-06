import type { Metadata } from "next";
import { Container, SectionHeading, Breadcrumbs } from "@/components/ui";
import { SolarCalculator } from "@/components/Calculator";
import { Reveal, Sequence, Step, TechLine } from "@/components/effects";

export const metadata: Metadata = { title: "Solar Savings Calculator", description: "Indicative rooftop solar estimator — size, generation, roof need and savings range with editable assumptions.", alternates: { canonical: "/solar-savings-calculator" }, openGraph: { title: "Solar Savings Calculator", description: "Indicative rooftop solar estimator — size, generation, roof need and savings range with editable assumptions.", url: "/solar-savings-calculator", type: "website" }, twitter: { card: "summary_large_image", title: "Solar Savings Calculator", description: "Indicative rooftop solar estimator — size, generation, roof need and savings range with editable assumptions." } };

export default function Page() {
  return (
    <section className="py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Calculator" }]} />
        <Sequence>
            <Step><SectionHeading eyebrow="Estimator" title="Solar savings calculator" sub="Indicative only — not a quotation or engineering design. All assumptions are editable and shown." /></Step>
            <Step variant="line"><TechLine className="mt-5" /></Step>
          </Sequence>
        <Reveal className="mt-8"><SolarCalculator /></Reveal>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-3">
          <a href="/plan-my-solar" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-bold">Turn this estimate into a project plan →</a>
          <a href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 text-[15px] font-bold text-royal transition hover:border-royal">Request a consultation</a>
        </div>
        <div className="prose-solar mx-auto mt-10 max-w-3xl rounded-3xl border border-line bg-white p-6 text-sm">
          <h2>How it calculates</h2>
          <p>Monthly units = bill ÷ tariff (or your entered units). Suggested kW = 90% of annual use ÷ 1500 kWh/kW/yr, rounded to nearest 0.5 kW (1 kW floor when there is any use, 500 kW cap). Annual generation = kW × 1500. Roof = kW × 100 sq ft. Year-1 savings = generation × tariff × 0.85.</p>
          <h2>What it ignores</h2>
          <p>Shade, orientation, sanctioned-load caps, net-metering rules, tariff changes, hybrid battery cost, financing and degradation. Your survey covers all of these.</p>
        </div>
      </Container>
    </section>
  );
}
