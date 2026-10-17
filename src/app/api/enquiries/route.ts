import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { queueEnquiry, trySendEmail } from "@/lib/store";
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
  try {
    const record = await queueEnquiry(parsed.data as Record<string, unknown>);
    const email = await trySendEmail(record);
    return NextResponse.json({ id: record.id, emailSent: email.sent, emailStatus: email.reason }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Could not accept your enquiry right now. Please call us directly." }, { status: 500 });
  }
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
