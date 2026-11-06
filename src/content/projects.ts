export type Project = {
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Industrial";
  location: string;
  capacityKw?: number;
  image: string;
  imageAlt: string;
  description: string;
  scope: string[];
  verified: boolean;
};

// Honest model: legacy gallery photos are genuine site photos but
// capacity / customer / location are NOT verified — so they ship as
// "Site work" without fabricated kW or client claims.
export const projects: Project[] = [
  {
    slug: "industrial-sheet-roof-mounting",
    title: "Industrial Sheet-Roof Mounting Work",
    category: "Industrial",
    location: "Chennai, Tamil Nadu",
    image: "/images/legacy/project1.jpeg",
    imageAlt: "Mounting rails on an industrial sheet roof — Universal Solar site photo",
    description: "Mounting preparation on an industrial sheet roof. Final array photos follow the same site.",
    scope: ["Roof survey", "Structure layout", "Mounting installation"],
    verified: false,
  },
  {
    slug: "industrial-roof-rails",
    title: "Industrial Roof Rail Installation",
    category: "Industrial",
    location: "Chennai, Tamil Nadu",
    image: "/images/legacy/project2.jpeg",
    imageAlt: "Rails fixed across a large industrial roof — Universal Solar site photo",
    description: "Rail fixing across a large industrial roof before module placement.",
    scope: ["Structure", "Alignment", "Fixing"],
    verified: false,
  },
  {
    slug: "rcc-roof-structure",
    title: "RCC Roof Structure Work",
    category: "Commercial",
    location: "Chennai, Tamil Nadu",
    image: "/images/legacy/project3.jpeg",
    imageAlt: "Pedestal structures on an RCC roof — Universal Solar site photo",
    description: "Pedestal and structure work on an RCC roof for a commercial installation.",
    scope: ["Civil pedestals", "Structure", "Waterproofing care"],
    verified: false,
  },
  {
    slug: "rooftop-array-chennai",
    title: "Completed Rooftop Array",
    category: "Commercial",
    location: "Chennai, Tamil Nadu",
    image: "/images/legacy/project4.jpeg",
    imageAlt: "Completed rooftop solar array — Universal Solar site photo",
    description: "Completed rooftop array photographed from the same project sites.",
    scope: ["Modules", "Stringing", "Commissioning"],
    verified: false,
  },
  {
    slug: "ground-work-foundation",
    title: "Ground-Mount Foundation Work",
    category: "Industrial",
    location: "Tamil Nadu",
    image: "/images/legacy/project5.jpeg",
    imageAlt: "Foundation piling for ground-mounted solar — Universal Solar site photo",
    description: "Ground work and piling for a ground-mounted section. Illustrates EPC scope beyond rooftops.",
    scope: ["Soil check", "Piling", "Structure"],
    verified: false,
  },
  {
    slug: "large-rooftop-plant",
    title: "Large Rooftop Plant",
    category: "Industrial",
    location: "Chennai, Tamil Nadu",
    image: "/images/legacy/project6.jpeg",
    imageAlt: "Large rooftop solar plant — Universal Solar site photo",
    description: "Aerial-style view of a large rooftop plant from project documentation.",
    scope: ["Large array", "Walkways", "Monitoring"],
    verified: false,
  },
];
