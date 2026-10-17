export const site = {
  brand: "Universal Solar Power Solutions",
  shortBrand: "Universal Solar Power Solutions",
  tagline: "Power Your Future With Smarter Solar.",
  description:
    "Chennai-based solar EPC delivering rooftop and ground-mounted systems for homes, businesses and industry — survey, design, installation, commissioning and maintenance.",
  officialUrl: "https://www.universalsolarpowersolutions.com",
  // Canonical production URL — override with SITE_URL env. Falls back to official URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.universalsolarpowersolutions.com",
  address: {
    line1: "Plot No. 64, G2 Lakshmi Nagar, Eurasia Foundation,",
    line2: "200 ft Service Road, Anakaputhur,",
    city: "Chennai",
    pin: "600070",
    state: "Tamil Nadu",
    country: "India",
    mapEmbed:
      "https://www.google.com/maps?q=Anakaputhur,+Chennai+600070&output=embed",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Anakaputhur+Chennai+600070",
  },
  contact: {
    phones: ["+91 97504 02731", "+91 97908 66659", "+91 80564 65693"],
    primaryPhone: "+91 97504 02731",
    email: "universalsolarpower2020@gmail.com",
    hours: "Mon – Sat: 9:00 AM – 6:00 PM",
  },
  serviceAreas: ["Chennai, Tamil Nadu, India"],
  services: [
    { slug: "residential-solar", label: "Residential Solar" },
    { slug: "commercial-solar", label: "Commercial Solar" },
    { slug: "industrial-solar", label: "Industrial Solar" },
  ],
  offerings: [
    "Engineering, Procurement & Construction (EPC)",
    "Operation & Maintenance (O&M)",
    "Re-engineering & Optimization",
    "Battery Storage (as part of engineered systems)",
    "Technical Consultation & Site Assessment",
  ],
  socials: [],
  enquiry: {
    toEmail: process.env.ENQUIRY_TO_EMAIL || "",
    fromEmail: process.env.ENQUIRY_FROM_EMAIL || "",
  },
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || "",
  // Anything here needs company sign-off before publishing as fact.
  needsVerification: [
    "Years of experience / project counts (old site shows 5+ years vs 'a decade', 150+ projects, 500+ customers, 100+ MW — do not publish until verified)",
    "Certifications, MNRE registration, TANGEDCO empanelment status",
    "Panel / inverter / battery brands officially dealt in",
    "Warranty terms, pricing, subsidy eligibility, savings guarantees",
    "Permission to publish project locations, capacities and customer names",
  ],
} as const;

export type SiteConfig = typeof site;
