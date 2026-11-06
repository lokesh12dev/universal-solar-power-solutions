export type Article = {
  slug: string;
  title: string;
  intro: string;
  readMins: number;
  updated: string;
  category: string;
  body: { h: string; p: string[] }[];
  sources?: string[];
};

export const articles: Article[] = [
  {
    slug: "how-rooftop-solar-works",
    title: "How Rooftop Solar Works",
    intro: "Panels, inverter, grid and meter — what actually happens on your roof.",
    readMins: 5,
    updated: "2026-10-01",
    category: "Basics",
    body: [
      { h: "The 4 parts", p: ["PV modules convert daylight into DC electricity. An inverter converts it to AC for your home. A bidirectional meter tracks import and export. Monitoring shows generation.", "On-grid systems shut down during outages for safety; hybrid systems with batteries can back up essential loads."] },
      { h: "What affects output", p: ["Orientation, tilt, shade, dust, temperature and inverter sizing all shift generation. That is why a site survey matters more than any online estimate.", "In Chennai, a well-oriented, unshaded rooftop typically performs best; east-west shade from parapets and trees is the common limiter."] },
      { h: "What to ask your installer", p: ["Ask for a shade analysis, proposed string layout, sanctioned-load compatibility and the commissioning checklist — before comparing prices."] },
    ],
  },
  {
    slug: "on-grid-vs-hybrid",
    title: "On-Grid vs Hybrid Solar",
    intro: "Choose based on outages, not hype. A simple decision guide.",
    readMins: 4,
    updated: "2026-10-01",
    category: "Systems",
    body: [
      { h: "On-grid", p: ["Lower cost, no batteries, best when grid supply is stable and the goal is bill reduction. Requires net-metering coordination.", "No backup during outages."] },
      { h: "Hybrid", p: ["Adds batteries for essential loads during outages. Higher cost, needs space and maintenance planning.", "Size batteries to essential circuits — not the whole house — unless budget allows."] },
      { h: "Rule of thumb", p: ["Frequent cuts or critical loads (work-from-home, medical, shops): consider hybrid. Stable supply and daytime load: on-grid usually wins."] },
    ],
  },
  {
    slug: "roof-suitability-checklist",
    title: "Is Your Roof Suitable? A Checklist",
    intro: "Area, orientation, shade, structure — check these before requesting a quote.",
    readMins: 6,
    updated: "2026-10-01",
    category: "Planning",
    body: [
      { h: "Area", p: ["As a rough guide, 1 kW needs about 90–110 sq ft of clear roof. Our calculator uses 100 sq ft per kW as an editable default.", "Deduct tanks, parapets, access paths and future construction."] },
      { h: "Shade and orientation", p: ["South-facing, unshaded roofs perform best in India. Note morning/evening shade from neighbouring buildings and trees.", "Photos at 9am, 12pm and 3pm help your surveyor enormously."] },
      { h: "Structure and wiring", p: ["Sheet vs RCC roofs need different structures. Check roof age, waterproofing, earthing and the distance to your distribution board."] },
    ],
  },
  {
    slug: "understanding-quotations",
    title: "How to Compare Solar Quotations",
    intro: "Compare scope, not just price per kW.",
    readMins: 5,
    updated: "2026-10-01",
    category: "Buying",
    body: [
      { h: "Line items that matter", p: ["Module make/wattage and count, inverter make/kVA, structure type, cabling, earthing, lightning protection, net-metering liaison, monitoring and O&M.", "A quote missing these is not comparable."] },
      { h: "Red flags", p: ["Guaranteed savings without a load study, 'MNRE subsidy guaranteed' without checking your DISCOM eligibility, no site survey before installation day."] },
      { h: "Warranties", p: ["Distinguish product warranty, performance warranty and workmanship/service warranty. Get the handling process in writing."] },
    ],
  },
  {
    slug: "solar-maintenance-basics",
    title: "Solar Maintenance Basics",
    intro: "Cleaning, monitoring and annual checks that protect generation.",
    readMins: 4,
    updated: "2026-10-01",
    category: "Care",
    body: [
      { h: "Cleaning", p: ["Dust cuts output. Clean early morning with water and a soft wiper; never walk on panels. Frequency depends on dust and birds.", "Our O&M plans cover scheduled cleaning and inspection."] },
      { h: "Monitoring", p: ["Check daily generation weekly. A sudden drop in one string usually means soiling, shade growth or a connection issue — not panel failure.", "Log inverter errors and call support with the error code and timestamp."] },
    ],
  },
  {
    slug: "estimating-electricity-use",
    title: "Estimating Your Electricity Use",
    intro: "From your monthly bill to kWh — the 2-minute method.",
    readMins: 3,
    updated: "2026-10-01",
    category: "Planning",
    body: [
      { h: "Bill to units", p: ["Monthly kWh ≈ monthly bill ÷ your tariff per unit. Example: ₹3,000 ÷ ₹7.5 ≈ 400 kWh/month.", "Use 3–6 months of bills; summer and winter differ. Our calculator does this for you."] },
      { h: "Day vs night", p: ["Solar offsets daytime use directly. If most use is at night, on-grid export rules and hybrid storage change the economics — discuss with your surveyor."] },
    ],
  },
];
