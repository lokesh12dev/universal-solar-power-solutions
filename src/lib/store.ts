import { promises as fs } from "fs";
import path from "path";

export type StoredEnquiry = Record<string, unknown> & { id: string; receivedAt: string };

// File-queue fallback: honest "accepted for review" state when no CRM/email is configured.
// Writes JSON files under data/<subdir>/ (git-ignored). Never logs PII to console.
export async function queueRecord(data: Record<string, unknown>, subdir: string): Promise<StoredEnquiry> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: StoredEnquiry = { ...data, id, receivedAt: new Date().toISOString() };
  const dir = path.join(process.cwd(), "data", subdir);
  await fs.mkdir(dir, { recursive: true });
  // Strip honeypot before storing
  const { company: _h, ...rest } = record as Record<string, unknown>;
  await fs.writeFile(path.join(dir, `${id}.json`), JSON.stringify({ ...rest, id }, null, 2), "utf8");
  return { ...rest, id, receivedAt: record.receivedAt } as StoredEnquiry;
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
