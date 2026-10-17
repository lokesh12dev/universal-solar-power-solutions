import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { buildRecord, persistRecord, trySendEmail } from "@/lib/store";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limit = checkRateLimit(`enquiries:${clientIp(req)}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a minute and retry — or call us directly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > 20_000) return NextResponse.json({ message: "Request too large." }, { status: 413 });
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json({ message: "Invalid request format." }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const iss of parsed.error.issues) errors[String(iss.path[0] ?? "form")] = iss.message;
    return NextResponse.json({ message: "Please fix the highlighted fields.", errors }, { status: 422 });
  }
  // Deliver via whichever channels are available. The file queue fails on
  // read-only serverless filesystems (e.g. Vercel) — that must NOT block the
  // email path. Success is reported only when at least one channel worked.
  const record = buildRecord(parsed.data as Record<string, unknown>);
  let stored = false;
  try {
    await persistRecord(record, "enquiries");
    stored = true;
  } catch {
    // read-only filesystem — email path below still applies
  }
  const email = await trySendEmail(record);
  if (!stored && !email.sent) {
    // Both channels failed (e.g. serverless read-only FS and email not
    // configured). Report clearly instead of pretending nothing happened.
    return NextResponse.json(
      { message: "Could not accept your enquiry right now. Please call us directly.", stored, emailSent: email.sent, emailStatus: email.reason },
      { status: 500 }
    );
  }
  return NextResponse.json({ id: record.id, stored, emailSent: email.sent, emailStatus: email.reason }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to submit an enquiry." }, { status: 405 });
}

const methodNotAllowed = () =>
  NextResponse.json({ message: "Use POST to submit an enquiry." }, { status: 405 });

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function OPTIONS() {
  return methodNotAllowed();
}
