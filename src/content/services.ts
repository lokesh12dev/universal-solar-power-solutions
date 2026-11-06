export type Service = {
  slug: string;
  title: string;
  short: string;
  image: string;
  imageAlt: string;
  benefits: string[];
};

export const services: Service[] = [
  {
    slug: "residential-solar",
    title: "Residential Solar",
    short: "Rooftop systems for homes — cut daytime grid use with a surveyed, engineered design.",
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Bright rooftop solar panels on a home under a clear blue sky",
    benefits: ["Site survey & shade analysis", "On-grid & hybrid options", "Monitoring & maintenance"],
  },
  {
    slug: "commercial-solar",
    title: "Commercial Solar",
    short: "Rooftop plants for offices, schools, hospitals and retail — built around your load profile.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Vivid blue commercial solar panel rows in bright daylight",
    benefits: ["Feasibility & load study", "Structural & electrical design", "Commissioning & O&M"],
  },
  {
    slug: "industrial-solar",
    title: "Industrial Solar",
    short: "Roof and ground-mounted EPC for factories — survey, structure, commissioning, O&M.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Large solar array glowing vividly beneath a dramatic bright sky",
    benefits: ["Ground & roof EPC", "HT/LT coordination", "Performance monitoring"],
  },
];

export const processSteps = [
  { n: "01", title: "Enquiry", text: "Share your bill, roof size and location. We confirm scope and arrange a survey slot." },
  { n: "02", title: "Assessment & Survey", text: "Site inspection, shade and structure check, load study and feasibility note." },
  { n: "03", title: "Proposal & Installation", text: "Engineered design, transparent quotation, safe installation and grid coordination." },
  { n: "04", title: "Commissioning & Support", text: "Testing, handover, monitoring setup and scheduled maintenance support." },
];
