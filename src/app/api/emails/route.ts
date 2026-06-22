import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Email capture endpoint for the mortgage calculator.
 *
 * Stores the email + a JSON snapshot of the user's calculation so the full
 * amortization schedule / premium export can be delivered later (future
 * upsell). Idempotent on email — re-submissions update the summary.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; summary?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 422 }
    );
  }

  const summary =
    body.summary && typeof body.summary === "object"
      ? JSON.stringify(body.summary)
      : null;

  try {
    await db.emailLead.upsert({
      where: { email },
      create: { email, summary },
      update: { summary },
    });
  } catch (err) {
    console.error("[emails] failed to upsert lead:", err);
    return NextResponse.json(
      { error: "Could not save your email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, message: "Email captured successfully." },
    { status: 201 }
  );
}

/** Simple health check. */
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "emails" });
}
