import { SolutionPage, solutionMeta, type SolutionDef } from "@/components/SolutionPage";

const s: SolutionDef = {
  slug: "commercial-solar",
  title: "Commercial Solar",
  intro: "Rooftop plants for offices, schools, hospitals, retail and hostels — built around your load curve, roof structure and sanctioned demand.",
  image: "/images/legacy/project6.jpeg",
  imageAlt: "Large rooftop plant on a commercial building — Universal Solar site photo",
  points: [
    { h: "Feasibility first", p: "We study 12 months of bills and demand, daytime vs evening split, diesel use if any, and roof/space availability before proposing capacity." },
    { h: "Engineering scope", p: "Structural assessment for sheet/RCC roofs, string and inverter sizing, walkways for cleaning, earthing, lightning protection and monitoring." },
    { h: "Execution without disrupting business", p: "Phased installation, safety barricading, minimal shutdown windows coordinated with your facility team, then testing and commissioning." },
    { h: "Monitoring and O&M", p: "Monitoring support, scheduled cleaning, preventive checks and fault response under an agreed maintenance scope — critical for commercial performance." },
  ],
  bullets: ["Load & demand study", "Structural check", "Phased execution", "HT/LT coordination", "Monitoring setup", "O&M contracts"],
  faqs: [
    { q: "What information do you need for a quote?", a: "12 months of bills, sanctioned load, roof drawings or photos, and operating hours. A survey follows." },
    { q: "Can you work on operating buildings?", a: "Yes — phased work with safety planning and shutdown windows agreed in advance." },
    { q: "Do you offer maintenance?", a: "Yes, O&M with cleaning schedules and monitoring support is our core offering." },
  ],
};

export const metadata = solutionMeta(s);
export default function Page() { return <SolutionPage s={s} />; }
