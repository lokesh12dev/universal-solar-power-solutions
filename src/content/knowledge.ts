export type KnowledgeCategory = "Homeowner" | "Business" | "Support";

export type KnowledgeGuide = {
  id: string;
  category: KnowledgeCategory;
  en: { title: string; body: string };
  ta: { title: string; body: string };
  cta: { labelEn: string; labelTa: string; href: string };
};

export const knowledgeGuides: KnowledgeGuide[] = [
  {
    id: "roof-suitable",
    category: "Homeowner",
    en: {
      title: "Is my roof suitable?",
      body: "An assessment considers usable space, shade, roof condition, orientation, access and electrical infrastructure. A structural professional must verify load capacity where required. A photograph alone cannot approve a roof.",
    },
    ta: {
      title: "என் கூரை பொருத்தமானதா?",
      body: "பயன்படுத்தக்கூடிய இடம், நிழல், கூரையின் நிலை, திசை, அணுகல் மற்றும் மின் கட்டமைப்பு ஆகியவை மதிப்பீட்டில் கருதப்படும். தேவைப்படும் இடங்களில் சுமை தாங்கும் திறனை கட்டமைப்பு நிபுணர் உறுதி செய்ய வேண்டும். புகைப்படம் மட்டும் கூரையை அங்கீகரிக்க முடியாது.",
    },
    cta: { labelEn: "Explore the solar studio", labelTa: "சோலார் ஸ்டுடியோவை பார்க்க", href: "/solar-savings-calculator" },
  },
  {
    id: "read-bill",
    category: "Homeowner",
    en: {
      title: "Read your electricity bill",
      body: "Use energy consumption in kWh and the billing period. A two-month bill must be divided by two for a monthly estimate. Separate energy charges from fixed charges, taxes and demand charges; solar does not necessarily reduce every item.",
    },
    ta: {
      title: "மின் கட்டண ரசீதை புரிந்துகொள்ளுங்கள்",
      body: "kWh-இல் மின் நுகர்வு மற்றும் கட்டண காலத்தை பயன்படுத்துங்கள். இரண்டு மாத ரசீதை மாத மதிப்பீட்டிற்கு இரண்டால் வகுக்க வேண்டும். ஆற்றல் கட்டணத்தை நிலையான கட்டணம், வரிகள் மற்றும் டிமாண்ட் கட்டணத்திலிருந்து பிரித்து பாருங்கள்; சோலார் ஒவ்வொரு கட்டணத்தையும் குறைக்கும் என்று உறுதியில்லை.",
    },
    cta: { labelEn: "Explore the solar studio", labelTa: "சோலார் ஸ்டுடியோவை பார்க்க", href: "/solar-savings-calculator" },
  },
  {
    id: "roi-estimate",
    category: "Business",
    en: {
      title: "What makes a useful ROI estimate?",
      body: "Compare self-consumed energy, export value, capital cost, O&M, degradation and financing. Review a lower-generation scenario. Hourly consumption, utility rules and equipment replacement costs are needed for a detailed investment decision.",
    },
    ta: {
      title: "பயனுள்ள ROI மதிப்பீடு எப்படி இருக்கும்?",
      body: "சுய நுகர்வு ஆற்றல், ஏற்றுமதி மதிப்பு, முதலீட்டு செலவு, பராமரிப்பு, தேய்மானம் மற்றும் நிதியுதவியை ஒப்பிடுங்கள். குறைந்த உற்பத்தி சூழலையும் மதிப்பாய்வு செய்யுங்கள். விரிவான முதலீட்டு முடிவிற்கு மணிநேர நுகர்வு, மின்வாரிய விதிகள் மற்றும் உபகரண மாற்று செலவுகள் தேவை.",
    },
    cta: { labelEn: "Explore the solar studio", labelTa: "சோலார் ஸ்டுடியோவை பார்க்க", href: "/solar-savings-calculator" },
  },
  {
    id: "caring-installation",
    category: "Support",
    en: {
      title: "Caring for a solar installation",
      body: "Keep commissioning documents, equipment serial numbers and warranty records. Follow the manufacturer’s inspection and cleaning instructions. Ask qualified personnel to investigate faults; do not climb onto an unsafe roof or open electrical equipment.",
    },
    ta: {
      title: "சோலார் அமைப்பை பராமரித்தல்",
      body: "இயக்க ஆவணங்கள், உபகரண வரிசை எண்கள் மற்றும் உத்தரவாத பதிவுகளை பாதுகாக்கவும். உற்பத்தியாளரின் ஆய்வு மற்றும் சுத்தம் வழிமுறைகளை பின்பற்றவும். பழுதுகளை தகுதிவாய்ந்த நபர்களிடம் ஆய்வு செய்ய கேளுங்கள்; பாதுகாப்பற்ற கூரையில் ஏறவோ மின் உபகரணங்களை திறக்கவோ வேண்டாம்.",
    },
    cta: { labelEn: "Explore the solar studio", labelTa: "சோலார் ஸ்டுடியோவை பார்க்க", href: "/support" },
  },
  {
    id: "battery-backup",
    category: "Homeowner",
    en: {
      title: "Solar and battery backup",
      body: "Storage value depends on surplus generation, night-time consumption, outage needs, efficiency and replacement cost. Grid-connected solar alone should not be assumed to provide backup. Ask for a design covering your critical loads.",
    },
    ta: {
      title: "சோலார் மற்றும் பேட்டரி பேக்கப்",
      body: "சேமிப்பின் மதிப்பு உபரி உற்பத்தி, இரவு நுகர்வு, மின்தடை தேவை, திறன் மற்றும் மாற்று செலவை பொறுத்தது. கிரிட் இணைந்த சோலார் மட்டும் பேக்கப் தரும் என்று கருத வேண்டாம். முக்கிய மின் சுமைகளை உள்ளடக்கிய வடிவமைப்பை கேளுங்கள்.",
    },
    cta: { labelEn: "Explore the solar studio", labelTa: "சோலார் ஸ்டுடியோவை பார்க்க", href: "/solar-savings-calculator" },
  },
];

export const knowledgeOfficial = {
  en: {
    eyebrow: "OFFICIAL INFORMATION / VERIFIED 16 OCTOBER 2026",
    title: "Schemes & eligibility",
    body: "Check current eligibility, application steps and participating providers through the government portal. No subsidy is included in our scenario calculations. Approval and benefit amounts must be verified for your application.",
  },
  ta: {
    eyebrow: "அதிகாரப்பூர்வ தகவல் / 16 அக்டோபர் 2026 அன்று சரிபார்க்கப்பட்டது",
    title: "திட்டங்கள் & தகுதி",
    body: "தற்போதைய தகுதி, விண்ணப்ப படிகள் மற்றும் பங்கேற்கும் நிறுவனங்களை அரசு இணையதளம் மூலம் சரிபார்க்கவும். எங்கள் மதிப்பீட்டு கணக்குகளில் எந்த மானியமும் சேர்க்கப்படவில்லை. ஒப்புதல் மற்றும் பயன் தொகையை உங்கள் விண்ணப்பத்திற்கு உறுதி செய்யவும்.",
  },
};
