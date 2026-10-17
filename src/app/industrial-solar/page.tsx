import { SolutionPage, solutionMeta, type SolutionDef } from "@/components/SolutionPage";

const s: SolutionDef = {
  slug: "industrial-solar",
  title: "Industrial Solar",
  intro: "Roof and ground-mounted EPC for factories — civil, structural, electrical and commissioning discipline for plants that must keep running.",
  image: "/images/legacy/project7.jpeg",
  imageAlt: "Industrial rooftop and factory buildings with solar — Universal Solar site photo",
  points: [
    { h: "Site and electrical assessment", p: "Roof load capacity, ground soil and drainage, HT/LT infrastructure, transformer loading, sanctioned demand and outage pattern — assessed before any sizing." },
    { h: "EPC scope", p: "Design, procurement, civil foundations, galvanised structures, module and inverter installation, AC/DC cabling, earthing, monitoring and grid coordination." },
    { h: "Re-engineering ageing plants", p: "Underperforming plants get a systematic inspection: soiling, mismatch, inverter clipping, cable losses and structure health — then targeted upgrades where economical." },
    { h: "Commissioning and O&M", p: "Testing and commissioning checklist, documented handover readings, cleaning and preventive schedules, and monitoring so deviations are caught early." },
  ],
  bullets: ["Ground & roof EPC", "Civil + structural checks", "HT/LT coordination", "Commissioning handover", "Monitoring", "Re-engineering audits"],
  faqs: [
    { q: "Do you do ground-mounted plants?", a: "Yes — our site photos include ground piling and structure work. Soil, drainage and access are checked at survey." },
    { q: "Can you fix an underperforming plant?", a: "Yes, re-engineering and optimisation is a core service. We assess first, then propose only economical fixes." },
    { q: "What do you need for an industrial enquiry?", a: "Location, connected load, available roof/land area, 12-month consumption and single-line diagram if available." },
  ],
};

export const metadata = solutionMeta(s);
export default function Page() { return <SolutionPage s={s} />; }
