import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  propertyType: z.enum(["residential", "commercial", "industrial"]),
  service: z.enum(["new-installation", "maintenance", "re-engineering", "consultation"]),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
  monthlyBill: z
    .string()
    .trim()
    .max(10, "Enter monthly bill as digits")
    .regex(/^$|^\d{1,7}$/, "Enter monthly bill as digits")
    .optional()
    .default(""),
  message: z.string().trim().max(1000, "Keep details under 1000 characters").optional().default(""),
  company: z.string().trim().max(0, "Spam detected").optional().default(""), // honeypot
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const plannerGoalSchema = z.enum([
  "new-installation",
  "potential-savings",
  "consultation",
  "existing-system",
]);

export type PlannerGoal = z.infer<typeof plannerGoalSchema>;

/** Planner submissions reuse the enquiry schema + goal context. */
export const plannerSubmissionSchema = enquirySchema.extend({
  goal: plannerGoalSchema.optional().default("consultation"),
  source: z.string().trim().max(40).optional().default("planner"),
});

export type PlannerSubmission = z.infer<typeof plannerSubmissionSchema>;

export const supportCategorySchema = z.enum([
  "general",
  "new-project",
  "installation",
  "existing-system",
  "maintenance",
  "product-info",
  "warranty-docs",
  "billing",
  "other",
]);

export type SupportCategory = z.infer<typeof supportCategorySchema>;

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  category: supportCategorySchema,
  reference: z.string().trim().max(40, "Keep the reference under 40 characters").optional().default(""),
  pincode: z.string().trim().regex(/^$|^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code").optional().default(""),
  contactPref: z.enum(["phone", "email"]).optional().default("phone"),
  message: z.string().trim().min(10, "Describe your request in at least 10 characters").max(2000, "Keep details under 2000 characters"),
  company: z.string().trim().max(0, "Spam detected").optional().default(""), // honeypot
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
