// Tests for the support request flow. Mirrors src/lib/validation.ts
// supportRequestSchema + src/app/api/support-requests/route.ts contract.
// Run: npm test
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

const supportRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  category: z.enum(["general", "new-project", "installation", "existing-system", "maintenance", "product-info", "warranty-docs", "billing", "other"]),
  reference: z.string().trim().max(40).optional().default(""),
  pincode: z.string().trim().regex(/^$|^[1-9][0-9]{5}$/).optional().default(""),
  contactPref: z.enum(["phone", "email"]).optional().default("phone"),
  message: z.string().trim().min(10).max(2000),
  company: z.string().trim().max(0).optional().default(""),
});

const valid = {
  name: "Meera Nair", phone: "9840012345", email: "", category: "maintenance",
  reference: "", pincode: "600070", contactPref: "phone",
  message: "Inverter shows error code E-09 since yesterday morning.", company: "",
};

describe("support request validation", () => {
  it("accepts a valid maintenance request", () => {
    assert.ok(supportRequestSchema.safeParse(valid).success);
  });
  it("accepts all 9 categories", () => {
    for (const c of ["general", "new-project", "installation", "existing-system", "maintenance", "product-info", "warranty-docs", "billing", "other"]) {
      assert.ok(supportRequestSchema.safeParse({ ...valid, category: c }).success, c);
    }
  });
  it("rejects unknown categories", () => {
    assert.equal(supportRequestSchema.safeParse({ ...valid, category: "refund" }).success, false);
  });
  it("rejects short messages and bad phones", () => {
    assert.equal(supportRequestSchema.safeParse({ ...valid, message: "help me" }).success, false);
    assert.equal(supportRequestSchema.safeParse({ ...valid, phone: "12345" }).success, false);
  });
  it("rejects bad optional pincode but allows blank", () => {
    assert.equal(supportRequestSchema.safeParse({ ...valid, pincode: "" }).success, true);
    assert.equal(supportRequestSchema.safeParse({ ...valid, pincode: "012345" }).success, false);
  });
  it("rejects honeypot spam", () => {
    assert.equal(supportRequestSchema.safeParse({ ...valid, company: "bot" }).success, false);
  });
  it("rejects oversized messages", () => {
    assert.equal(supportRequestSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success, false);
  });
});

describe("support analytics + privacy", () => {
  it("analytics sends event names + page only, never PII fields", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("src/lib/analytics.ts", "utf8");
    assert.ok(src.includes("NEVER send names"), "must document PII rule");
    const push = src.match(/dataLayer\.push\((\{[^}]*\})\)/);
    assert.ok(push, "dataLayer push exists");
    assert.ok(!/name|phone|email|message/i.test(push[1]), "no PII in tracked payload");
  });
});
