import { SolutionPage, solutionMeta, type SolutionDef } from "@/components/SolutionPage";
import { VideoBox } from "@/components/VideoBox";
import { Container, SectionHeading } from "@/components/ui";
import { Sequence, Step, TechLine } from "@/components/effects";

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

const videoCases = [
  {
    mp4: "/videos/commercial-strategy.mp4",
    webm: "/videos/commercial-strategy.webm",
    poster: "/images/legacy/project6.jpeg",
    alt: "Large commercial rooftop solar array — Universal Solar Chennai site footage",
    label: "Commercial rooftop solar array",
    title: "Factory & warehouse scale",
    sub: "Large roofs, large generation potential.",
  },
  {
    mp4: "/videos/home-hero.mp4",
    webm: "/videos/home-hero.webm",
    poster: "/images/legacy/project4.jpeg",
    alt: "Office rooftop solar installation — Universal Solar Chennai site footage",
    label: "Office rooftop solar installation",
    title: "Offices & institutions",
    sub: "Daytime loads that solar covers well.",
  },
];

export default function Page() {
  return (
    <>
      <SolutionPage s={s} />
      <section className="py-16 sm:py-20 bg-navy text-white grain relative overflow-hidden">
        <Container>
          <Sequence>
            <Step><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan">Engineering proof · Universal Solar</p></Step>
            <Step><h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold">Real commercial plants, real roofs</h2></Step>
            <Step variant="line"><TechLine className="mt-5 [&_.techline-track]:bg-white/15 [&_.techline-mark]:text-cyan" /></Step>
          </Sequence>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {videoCases.map((v) => (
              <VideoBox key={v.title} mp4={v.mp4} webm={v.webm} poster={v.poster} alt={v.alt} label={v.label} />
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {videoCases.map((v, i) => (
              <div key={v.title + "-info"} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-display text-lg font-extrabold text-white">{v.title}</h3>
                <p className="mt-2 text-white/60 leading-relaxed">{v.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
