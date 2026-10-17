import { SolutionPage, solutionMeta, type SolutionDef } from "@/components/SolutionPage";

const s: SolutionDef = {
  slug: "residential-solar",
  title: "Residential Solar",
  intro: "Rooftop systems for Chennai homes — reduce daytime grid use with a surveyed design matched to your bill, roof and sanctioned load.",
  image: "/images/legacy/project4.jpeg",
  imageAlt: "Rooftop solar array on a home — Universal Solar site photo",
  points: [
    { h: "How we size your system", p: "We start from 3–6 months of bills, then check usable area (roughly 100 sq ft per kW), orientation, shade and sanctioned load. Oversizing without export clarity wastes money — we size to ~90% of annual use unless the survey says otherwise." },
    { h: "On-grid vs hybrid for homes", p: "Stable supply and mostly daytime use: on-grid usually wins. Frequent cuts, work-from-home or medical loads: hybrid with batteries for essential circuits. We recommend after the survey — not before." },
    { h: "Roof, structure and wiring", p: "RCC, sheet and tiled roofs each need different structures. We check parapet shade, tank positions, access for cleaning, earthing and the distance to your distribution board." },
    { h: "Survey to switch-on", p: "Enquiry → site survey → engineered proposal with makes and layout → safe installation → testing, net-metering coordination support and monitoring handover." },
    { h: "Care and warranties", p: "Dust cuts output — plan cleaning. Distinguish panel product vs performance warranty, inverter warranty and our workmanship. Get handling in writing." },
  ],
  bullets: ["Shade & area analysis", "Sanctioned-load check", "Net-metering support", "Monitoring handover", "Maintenance options", "Honest suitability call"],
  faqs: [
    { q: "Is every home suitable?", a: "No. Heavy shade, tiny or weak roofs, or very low bills may not justify a plant. We tell you at survey stage." },
    { q: "How much roof do I need?", a: "Roughly 100 sq ft per kW of clear area. A 3 kW home system typically needs ~300 sq ft." },
    { q: "Will it work during power cuts?", a: "On-grid systems shut down for safety. Only hybrid systems with batteries back up essentials." },
  ],
};

export const metadata = solutionMeta(s);
export default function Page() { return <SolutionPage s={s} />; }
