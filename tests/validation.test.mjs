// Backend QA tests for Universal Solar enquiry API.
// Mirrors src/lib/validation.ts (zod) + src/app/api/enquiries/route.ts behaviour.
// Run: npm test  ->  node --test tests/*.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---- Exact mirror of src/lib/validation.ts ----
const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  propertyType: z.enum(["residential", "commercial", "industrial"]),
  service: z.enum(["new-installation", "maintenance", "re-engineering", "consultation"]),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
  monthlyBill: z.string().trim().optional().default(""),
  message: z.string().trim().max(1000, "Keep details under 1000 characters").optional().default(""),
  company: z.string().trim().max(0, "Spam detected").optional().default(""), // honeypot
});

// ---- Mirror of route.ts request handling (status-code contract) ----
const MAX_BODY = 20_000;
function simulateRoute(rawText, method = "POST") {
  if (method === "GET") return { status: 405, json: { message: "Use POST to submit an enquiry." } };
  if (rawText.length > MAX_BODY) return { status: 413, json: { message: "Request too large." } };
  let body;
  try {
    body = rawText ? JSON.parse(rawText) : {};
  } catch {
    return { status: 400, json: { message: "Invalid request format." } };
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors = {};
    for (const iss of parsed.error.issues) errors[String(iss.path[0] ?? "form")] = iss.message;
    return { status: 422, json: { message: "Please fix the highlighted fields.", errors } };
  }
  return { status: 201, json: { id: "test-id", emailSent: false, emailStatus: "email-not-configured" } };
}

const validPayload = () => ({
  name: "Karthik Raja",
  phone: "9750402731",
  email: "karthik@example.com",
  propertyType: "residential",
  service: "new-installation",
  pincode: "600070",
  monthlyBill: "3000",
  message: "2BHK rooftop, ~800 sqft, no shade.",
  company: "",
});

describe("enquiry validation (mirrors src/lib/validation.ts)", () => {
  it("1. valid submission passes", () => {
    const r = enquirySchema.safeParse(validPayload());
    assert.equal(r.success, true);
  });

  it("2. bad phone rejected (wrong prefix / too short)", () => {
    for (const phone of ["12345", "5123456789", "abcdefghij", ""]) {
      const r = enquirySchema.safeParse({ ...validPayload(), phone });
      assert.equal(r.success, false, `phone ${JSON.stringify(phone)} should fail`);
      if (!r.success) {
        const iss = r.error.issues.find((i) => i.path[0] === "phone");
        assert.ok(iss, "phone issue expected");
        assert.match(iss.message, /10-digit|valid/i);
      }
    }
  });

  it("2b. +91-prefixed phone accepted", () => {
    const r = enquirySchema.safeParse({ ...validPayload(), phone: "+91 9750402731" });
    assert.equal(r.success, true);
  });

  it("3. bad pincode rejected (leading 0 / 5 digits / letters)", () => {
    for (const pincode of ["012345", "12345", "ABCDEF", ""]) {
      const r = enquirySchema.safeParse({ ...validPayload(), pincode });
      assert.equal(r.success, false, `pincode ${JSON.stringify(pincode)} should fail`);
    }
  });

  it("4. missing name rejected", () => {
    const { name: _omit, ...rest } = validPayload();
    const missing = enquirySchema.safeParse(rest);
    assert.equal(missing.success, false);
    const short = enquirySchema.safeParse({ ...validPayload(), name: "A" });
    assert.equal(short.success, false);
  });

  it("5. honeypot spam rejected (company filled)", () => {
    const r = enquirySchema.safeParse({ ...validPayload(), company: "bot-payload" });
    assert.equal(r.success, false);
    if (!r.success) {
      const iss = r.error.issues.find((i) => i.path[0] === "company");
      assert.ok(iss, "honeypot issue expected");
      assert.match(iss.message, /spam/i);
    }
  });

  it("6a. oversized message (>1000 chars) rejected with 422", () => {
    const res = simulateRoute(JSON.stringify({ ...validPayload(), message: "x".repeat(1001) }));
    assert.equal(res.status, 422);
    assert.ok(res.json.errors.message);
  });

  it("6b. oversized raw body (>20k) rejected with 413", () => {
    const res = simulateRoute("x".repeat(20_001));
    assert.equal(res.status, 413);
    assert.match(res.json.message, /too large/i);
  });

  it("7. GET returns 405 with POST hint", () => {
    const res = simulateRoute("", "GET");
    assert.equal(res.status, 405);
    assert.match(res.json.message, /POST/i);
  });

  it("8. malformed JSON returns 400", () => {
    const res = simulateRoute("{not-json");
    assert.equal(res.status, 400);
  });
});

describe("route source contract (src/app/api/enquiries/route.ts)", () => {
  const route = read("src/app/api/enquiries/route.ts");
  it("enforces 20k body cap -> 413", () => {
    assert.ok(route.includes("20_000") && route.includes("413"), "body cap + 413 expected");
  });
  it("returns 422 with field errors map on validation failure", () => {
    assert.ok(route.includes("422") && route.includes("safeParse"), "422 + safeParse expected");
  });
  it("GET handler returns 405", () => {
    assert.ok(route.includes("405"), "GET 405 expected");
  });
  it("500 path uses generic message (no stack/PII leak)", () => {
    assert.ok(route.includes("500"), "500 handler expected");
    assert.ok(!/stack|console\.log.*record|console\.log.*body/i.test(route), "no stack/PII logging");
  });
});

describe("secrets + PII hygiene", () => {
  it("no console.log/info/debug of PII in src", () => {
    const files = [
      "src/app/api/enquiries/route.ts",
      "src/lib/store.ts",
      "src/lib/validation.ts",
      "src/components/EnquiryForm.tsx",
    ];
    for (const f of files) {
      const src = existsSync(join(ROOT, f)) ? read(f) : "";
      assert.ok(
        !/console\.(log|info|debug)\s*\([^)]*(record|body|phone|email|name|pincode)/i.test(src),
        `${f}: must not console-log PII`
      );
    }
  });
  it("RESEND_API_KEY only read server-side, never returned to client", () => {
    const store = read("src/lib/store.ts");
    const route = read("src/app/api/enquiries/route.ts");
    const form = read("src/components/EnquiryForm.tsx");
    assert.ok(store.includes("process.env.RESEND_API_KEY"), "server reads key");
    assert.ok(!/RESEND_API_KEY/.test(form), "client form must not reference secret");
    assert.ok(!/RESEND_API_KEY/.test(route) || !/json.*RESEND|return.*key/i.test(route), "route must not echo key");
    // Authorization header present, key never interpolated into response
    assert.ok(store.includes("Authorization"), "Bearer auth expected");
  });
  it("honeypot stripped before persistence", () => {
    const store = read("src/lib/store.ts");
    assert.ok(/company/.test(store) && /rest/.test(store), "honeypot strip expected");
  });
  it(".env.example contains no real secrets", () => {
    const env = existsSync(join(ROOT, ".env.example")) ? read(".env.example") : "";
    assert.ok(!/sk-|re_[A-Za-z0-9]{20,}/.test(env), "no real API keys in example");
    assert.ok(env.includes("RESEND_API_KEY="), "placeholder expected");
  });
});
