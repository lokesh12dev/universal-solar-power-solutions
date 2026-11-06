import type { PlannerGoal } from "@/lib/validation";

/** Map a planner goal to the enquiry service taxonomy (no data invented). */
export function goalToService(goal: PlannerGoal): "new-installation" | "maintenance" | "re-engineering" | "consultation" {
  switch (goal) {
    case "new-installation": return "new-installation";
    case "existing-system": return "re-engineering";
    case "potential-savings":
    case "consultation": return "consultation";
  }
}

export const goalLabels: Record<PlannerGoal, string> = {
  "new-installation": "Explore a new solar installation",
  "potential-savings": "Understand potential energy savings",
  consultation: "Request a solar consultation",
  "existing-system": "Discuss an existing solar system",
};

export type PlannerSummary = {
  propertyType: "residential" | "commercial" | "industrial";
  monthlyBill: string;
  monthlyUnits: string;
  pincode: string;
  goal: PlannerGoal;
};

/** Compose the planner context into the enquiry message (planner data is never lost). */
export function composePlannerMessage(s: PlannerSummary): string {
  const parts = [
    `[Solar Project Planner] Goal: ${goalLabels[s.goal]}.`,
    `Property: ${s.propertyType}.`,
    s.monthlyBill ? `Monthly bill: ₹${s.monthlyBill}.` : null,
    s.monthlyUnits ? `Known usage: ${s.monthlyUnits} kWh/month.` : null,
    `PIN: ${s.pincode}.`,
    "Note: figures above are customer inputs, not verified measurements. Survey required before any proposal.",
  ];
  return parts.filter(Boolean).join(" ");
}
