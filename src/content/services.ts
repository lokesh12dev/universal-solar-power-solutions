export type Service = {
  slug: string;
  title: string;
  headline: string;
  short: string;
  cta: string;
  image: string;
  imageAlt: string;
  benefits: string[];
};

export const services: Service[] = [
  {
    slug: "residential-solar",
    title: "Residential Solar",
    headline: "Solar designed around your home.",
    short: "Explore rooftop solar options based on your energy consumption, roof conditions, and household requirements.",
    cta: "Explore Residential Solar",
    image: "/images/solar-banner-768.jpg",
    imageAlt: "Rooftop solar array at sunrise — illustrative imagery",
    benefits: ["Site survey & shade analysis", "On-grid & hybrid options", "Monitoring & maintenance"],
  },
  {
    slug: "commercial-solar",
    title: "Commercial Solar",
    headline: "Make energy costs part of your business strategy.",
    short: "Evaluate solar opportunities around your facility, electricity demand, operating hours, and investment objectives.",
    cta: "Explore Commercial Solar",
    image: "/images/legacy/project4.jpeg",
    imageAlt: "Completed commercial rooftop solar array — Universal Solar Power Solutions site photo",
    benefits: ["Feasibility & load study", "Structural & electrical design", "Commissioning & O&M"],
  },
  {
    slug: "support",
    title: "Solar Services",
    headline: "Keep your solar system performing.",
    short: "Explore inspection, maintenance, troubleshooting, and service options for your installation.",
    cta: "Explore Solar Services",
    image: "/images/sections/technician-roof-install.jpg",
    imageAlt: "Technician installing panels on a residential roof — illustrative stock photo",
    benefits: ["Inspection & cleaning", "Troubleshooting & repair", "O&M for ageing plants"],
  },
];

export const processSteps = [
  { n: "01", title: "Enquiry", text: "Share your bill, roof size and location. We confirm scope and arrange a survey slot." },
  { n: "02", title: "Assessment & Survey", text: "Site inspection, shade and structure check, load study and feasibility note." },
  { n: "03", title: "Proposal & Installation", text: "Engineered design, transparent quotation, safe installation and grid coordination." },
  { n: "04", title: "Commissioning & Support", text: "Testing, handover, monitoring setup and scheduled maintenance support." },
];
