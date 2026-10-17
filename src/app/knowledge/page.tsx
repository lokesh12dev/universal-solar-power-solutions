import type { Metadata } from "next";
import "@/styles/knowledge-clone.css";
import { KnowledgeClone } from "@/components/KnowledgeClone";

export const metadata: Metadata = {
  title: "Solar knowledge — English & Tamil",
  description: "Practical solar guides for homes, businesses and maintenance, in English and Tamil.",
  alternates: { canonical: "/knowledge" },
  openGraph: {
    title: "Solar knowledge — English & Tamil",
    description: "Practical solar guides for homes, businesses and maintenance, in English and Tamil.",
    url: "/knowledge",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Solar knowledge — English & Tamil",
    description: "Practical solar guides for homes, businesses and maintenance, in English and Tamil.",
  },
};

export default function Page() {
  return <KnowledgeClone />;
}
