import {
  MessageCircleQuestion, Sun, Wrench, PlugZap, HeartHandshake,
  Package, FileBadge, ReceiptText, Shapes,
} from "lucide-react";
import type { SupportCategory } from "@/lib/validation";

export type SupportCat = {
  id: SupportCategory;
  title: string;
  short: string;
  icon: typeof Sun;
};

export const supportCategories: SupportCat[] = [
  { id: "general", title: "General Enquiry", short: "Questions about the company and services.", icon: MessageCircleQuestion },
  { id: "new-project", title: "New Solar Project", short: "Start a new project enquiry or consultation.", icon: Sun },
  { id: "installation", title: "Installation Support", short: "Questions about an ongoing installation.", icon: Wrench },
  { id: "existing-system", title: "Existing Solar System", short: "Help with a system already on your roof.", icon: PlugZap },
  { id: "maintenance", title: "Maintenance & Service", short: "Cleaning, inspection and servicing.", icon: HeartHandshake },
  { id: "product-info", title: "Product Information", short: "Panels, inverters, batteries and structures.", icon: Package },
  { id: "warranty-docs", title: "Warranty & Documents", short: "Warranty terms and project paperwork.", icon: FileBadge },
  { id: "billing", title: "Billing & Quotes", short: "Invoices, quotations and commercial queries.", icon: ReceiptText },
  { id: "other", title: "Other Support", short: "Anything else — describe it below.", icon: Shapes },
];

export type SupportFaq = {
  q: string;
  a: string;
  category: "general" | "project" | "installation" | "maintenance" | "warranty" | "billing" | "contact";
};

export const supportFaqCategories = [
  { id: "general", label: "General" },
  { id: "project", label: "New projects" },
  { id: "installation", label: "Installation" },
  { id: "maintenance", label: "Maintenance" },
  { id: "warranty", label: "Warranty & documents" },
  { id: "billing", label: "Billing" },
  { id: "contact", label: "Contact" },
] as const;

export const supportFaqs: SupportFaq[] = [
  { q: "How can I request a solar project quotation?", a: "Send an enquiry with your name, phone, PIN code and monthly bill. We call back, survey the site, then share an engineered proposal. Nothing is priced without a survey.", category: "project" },
  { q: "What information should I prepare before a consultation?", a: "Recent electricity bills (3–6 months), your sanctioned load, usable roof size if known, roof photos, and shade observations. The planner on this site collects exactly this.", category: "project" },
  { q: "What affects the cost of a solar installation?", a: "System size, roof type and structure, inverter and battery choice, cabling distance, earthing needs, and net-metering work. Your proposal lists each line item.", category: "billing" },
  { q: "How can I ask about an existing installation?", a: "Use the support form with category Installation Support and any project reference from your handover documents. Photos of the plant and inverter display help.", category: "installation" },
  { q: "How do I request maintenance assistance?", a: "Choose Maintenance & Service, describe the issue (e.g. low generation, inverter error code, physical damage) and add photos. For error codes, note the exact code and time.", category: "maintenance" },
  { q: "Where are my warranty terms?", a: "Warranty terms come from the equipment manufacturer plus our workmanship terms in your proposal. Share your project reference and we will point you to the applicable documents.", category: "warranty" },
  { q: "What should I do about exposed wiring or a burning smell?", a: "Do not touch the equipment. Keep a safe distance, switch off the AC isolator only if it is safe to reach, and call us immediately. For fire or immediate danger, contact local emergency services first.", category: "maintenance" },
  { q: "How can I follow up on an enquiry I already sent?", a: "Call us with your name, phone number and PIN code, or submit a support request under General Enquiry referencing your earlier message.", category: "contact" },
  { q: "Do you handle subsidy paperwork?", a: "Net-metering coordination support is part of our EPC scope. Subsidy schemes change over time — we confirm current applicability for your DISCOM during consultation, never as a guarantee.", category: "project" },
  { q: "What information helps when reporting a problem?", a: "Your name and phone, project reference if any, system size, inverter error code, when the issue started, recent generation readings, and clear photos. This avoids a wasted visit.", category: "general" },
];
