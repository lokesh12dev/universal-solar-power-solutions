import { promises as fs } from "fs";
import path from "path";

export type StoredEnquiry = Record<string, unknown> & { id: string; receivedAt: string };

// Honeypot is stripped here so it is never stored or emailed.
export function buildRecord(data: Record<string, unknown>): StoredEnquiry {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: StoredEnquiry = { ...data, id, receivedAt: new Date().toISOString() };
  const { company: _h, ...rest } = record as Record<string, unknown>;
  return { ...rest, id, receivedAt: record.receivedAt } as StoredEnquiry;
}

// File-queue persistence: JSON files under data/<subdir>/ (git-ignored).
// Local dev: always writable. Serverless hosts (Vercel) have a READ-ONLY
// filesystem — callers must treat a throw here as non-fatal and lean on the
// email path; see src/app/api/*/route.ts.
export async function persistRecord(record: StoredEnquiry, subdir: string): Promise<void> {
  const dir = path.join(process.cwd(), "data", subdir);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${record.id}.json`), JSON.stringify(record, null, 2), "utf8");
}

// Kept for compatibility (same behavior as before the split).
export async function queueRecord(data: Record<string, unknown>, subdir: string): Promise<StoredEnquiry> {
  const record = buildRecord(data);
  await persistRecord(record, subdir);
  return record;
}

export async function queueEnquiry(data: Record<string, unknown>): Promise<StoredEnquiry> {
  return queueRecord(data, "enquiries");
}

export async function queueSupportRequest(data: Record<string, unknown>): Promise<StoredEnquiry> {
  return queueRecord(data, "support-requests");
}

// Optional email hook — only active when RESEND_API_KEY + addresses are set.
// Returns { sent: false, reason } otherwise so the API can report honestly.
export async function trySendEmail(record: StoredEnquiry, subject?: string): Promise<{ sent: boolean; reason: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!key || !from || !to) return { sent: false, reason: "email-not-configured" };
  const lines = [
    `Record ${record.id}`,
    `Name: ${record.name}`,
    `Phone: ${record.phone}`,
    `Email: ${record.email || "-"}`,
    `Category: ${record.category ?? record.service ?? "-"}`,
    `Type: ${record.propertyType || "-"}`,
    `PIN: ${record.pincode || "-"}`,
    `Bill: ${record.monthlyBill || "-"}`,
    `Reference: ${record.reference || "-"}`,
    `Details: ${record.message || "-"}`,
    `At: ${record.receivedAt}`,
  ];
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to,
        subject: subject || `New solar enquiry — ${record.propertyType} / ${record.pincode}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) return { sent: false, reason: `provider-${res.status}` };
    return { sent: true, reason: "sent" };
  } catch {
    return { sent: false, reason: "provider-error" };
  }
}
