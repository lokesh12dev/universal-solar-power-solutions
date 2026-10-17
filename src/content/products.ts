export type Product = {
  slug: string;
  name: string;
  manufacturer: string;
  category: "Solar Panels" | "Solar Inverters" | "Batteries" | "Mounting Structures" | "System Solutions";
  systemType?: "On-Grid" | "Hybrid" | "Off-Grid";
  short: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  docs?: string[];
  // No prices, stock, specs-as-fact or warranty promises — all configurable.
  verificationNote: string;
};

export const products: Product[] = [
  {
    slug: "high-efficiency-solar-panels",
    name: "High-Efficiency Solar Panels",
    manufacturer: "To be confirmed",
    category: "Solar Panels",
    short: "Crystalline PV modules for rooftop and ground-mounted arrays.",
    description:
      "PV modules selected per project for efficiency, durability and service support. Final make and wattage are confirmed in your engineered proposal — we do not list binding specifications here.",
    highlights: ["Rooftop & ground-mount compatible", "Engineered string design", "Commissioned and monitored"],
    image: "/images/legacy/project7.jpeg",
    imageAlt: "High-density array at a Universal Solar project site",
    verificationNote: "Confirm approved makes, wattages and datasheets before publishing specs.",
  },
  {
    slug: "on-grid-solar-inverters",
    name: "On-Grid Solar Inverters",
    manufacturer: "To be confirmed",
    category: "Solar Inverters",
    systemType: "On-Grid",
    short: "Grid-tied inverters for homes and commercial rooftops.",
    description:
      "String inverters sized to your array and sanctioned load, with monitoring. Export arrangement depends on TANGEDCO norms for your connection.",
    highlights: ["Load-matched sizing", "Remote monitoring", "Grid-synchronised operation"],
    image: "/images/legacy/project6.jpeg",
    imageAlt: "Commissioned rooftop plant — Universal Solar site photo",
    verificationNote: "Confirm approved inverter makes and warranty handling.",
  },
  {
    slug: "hybrid-inverters-battery-storage",
    name: "Hybrid Inverters & Battery Storage",
    manufacturer: "To be confirmed",
    category: "Batteries",
    systemType: "Hybrid",
    short: "Hybrid systems with lithium / tubular battery backup for outages.",
    description:
      "For sites needing backup: hybrid inverter plus battery bank sized to essential loads. Backup duration depends on battery capacity and usage — assessed per site.",
    highlights: ["Outage backup for essentials", "Lithium / tubular options", "Sized to your load profile"],
    image: "/images/legacy/project4.jpeg",
    imageAlt: "Rooftop array installed by Universal Solar — site photo",
    verificationNote: "Confirm battery makes, capacities and warranty terms.",
  },
  {
    slug: "mounting-structures",
    name: "Module Mounting Structures",
    manufacturer: "Engineered per site",
    category: "Mounting Structures",
    short: "Galvanised structures for sheet, RCC and ground installations.",
    description:
      "Structures designed for your roof type — asbestos / metal sheet, RCC or ground — with wind and access considerations checked at survey.",
    highlights: ["Sheet, RCC & ground types", "Survey-checked design", "Safe installation practice"],
    image: "/images/legacy/project1.jpeg",
    imageAlt: "Mounting rails installed on an industrial sheet roof — Universal Solar site photo",
    verificationNote: "Uses genuine Universal Solar site photo.",
  },
  {
    slug: "on-grid-rooftop-systems",
    name: "On-Grid Rooftop Systems",
    manufacturer: "Engineered solution",
    category: "System Solutions",
    systemType: "On-Grid",
    short: "Complete grid-connected rooftop plants — survey to commissioning.",
    description:
      "Our core EPC: survey, design, supply, installation, net-metering coordination support and commissioning, with optional maintenance.",
    highlights: ["End-to-end EPC", "Net-metering support", "Commissioning & handover"],
    image: "/images/legacy/project4.jpeg",
    imageAlt: "Completed rooftop solar array — Universal Solar site photo",
    verificationNote: "Uses genuine Universal Solar site photo.",
  },
  {
    slug: "hybrid-backup-systems",
    name: "Hybrid Backup Systems",
    manufacturer: "Engineered solution",
    category: "System Solutions",
    systemType: "Hybrid",
    short: "Solar plus storage for homes and businesses needing backup.",
    description:
      "Combines rooftop generation with battery backup for essential circuits. Sizing follows a load study — not a fixed package.",
    highlights: ["Essential-load backup", "Monitoring included", "Maintenance options"],
    image: "/images/legacy/project2.jpeg",
    imageAlt: "Array and mounting work by Universal Solar — site photo",
    verificationNote: "Confirm system sizing methodology with company.",
  },
];

export const productCategories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
