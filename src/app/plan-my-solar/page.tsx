import type { Metadata } from "next";
import { Container, Breadcrumbs } from "@/components/ui";
import { Planner } from "@/components/Planner";
import { Reveal } from "@/components/effects";

export const metadata: Metadata = {
  title: "Plan My Solar System",
  description: "Answer 4 questions, get an organised solar project summary, and request a consultation with our Chennai team.",
  alternates: { canonical: "/plan-my-solar" },
};

export default function Page() {
  return (
    <section className="bg-soft-light py-14">
      <Container>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Plan My Solar" }]} />
        <Reveal className="mt-6"><Planner /></Reveal>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate">
          The planner organises your requirements — it does not size systems, price installations, or promise savings. Every proposal follows a site survey.
        </p>
      </Container>
    </section>
  );
}
