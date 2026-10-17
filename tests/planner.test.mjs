// Tests for the Solar Project Planner: goal mapping, message composition,
// planner submission validation. Mirrors src/lib/planner.ts + validation.ts.
// Run: npm test
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

// ---- Mirror of planner pieces ----
const plannerGoalSchema = z.enum(["new-installation", "potential-savings", "consultation", "existing-system"]);
function goalToService(goal) {
  switch (goal) {
    case "new-installation": return "new-installation";
    case "existing-system": return "re-engineering";
    default: return "consultation";
  }
}
const goalLabels = {
  "new-installation": "Explore a new solar installation",
  "potential-savings": "Understand potential energy savings",
  consultation: "Request a solar consultation",
  "existing-system": "Discuss an existing solar system",
};
function composePlannerMessage(s) {
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

describe("planner goal mapping", () => {
  it("maps all 4 goals to valid enquiry services", () => {
    const valid = ["new-installation", "maintenance", "re-engineering", "consultation"];
    for (const g of ["new-installation", "potential-savings", "consultation", "existing-system"]) {
      assert.ok(plannerGoalSchema.safeParse(g).success, g);
      assert.ok(valid.includes(goalToService(g)), g);
    }
  });
  it("maps existing-system to re-engineering, savings to consultation", () => {
    assert.equal(goalToService("existing-system"), "re-engineering");
    assert.equal(goalToService("potential-savings"), "consultation");
    assert.equal(goalToService("new-installation"), "new-installation");
  });
  it("rejects unknown goals", () => {
    assert.equal(plannerGoalSchema.safeParse("free-electricity").success, false);
  });
});

describe("planner message composition", () => {
  it("keeps all planner context, never drops data", () => {
    const msg = composePlannerMessage({ propertyType: "commercial", monthlyBill: "12000", monthlyUnits: "1500", pincode: "600070", goal: "new-installation" });
    for (const bit of ["commercial", "12000", "1500", "600070", "Explore a new solar installation", "[Solar Project Planner]"]) {
      assert.ok(msg.includes(bit), bit);
    }
  });
  it("handles blank optional usage without undefined holes", () => {
    const msg = composePlannerMessage({ propertyType: "residential", monthlyBill: "", monthlyUnits: "", pincode: "600001", goal: "consultation" });
    assert.ok(!msg.includes("undefined"), msg);
    assert.ok(msg.includes("Survey required"), msg);
  });
  it("always disclaims inputs as unverified", () => {
    const msg = composePlannerMessage({ propertyType: "industrial", monthlyBill: "50000", monthlyUnits: "", pincode: "600100", goal: "potential-savings" });
    assert.ok(/not verified measurements/i.test(msg));
  });
});
