import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Lead capture endpoint for the home loan calculator.
 *
 * Accepts either an email or a phone number (at least one required), plus an
 * optional city. Stores a JSON snapshot of the user's calculation so the full
 * amortization schedule / premium export can be delivered later.
 *
 * Idempotent on email — re-submissions update the summary. Phone-only leads
 * are always inserted as new rows.
 */
export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    phone?: string;
    city?: string;
    summary?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" && body.email.trim()
      ? body.email.trim().toLowerCase()
      : "";
  const phone =
    typeof body.phone === "string" && body.phone.trim()
      ? body.phone.trim()
      : "";
  const city =
    typeof body.city === "string" && body.city.trim()
      ? body.city.trim()
      : null;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Accept Indian phone formats: optional +91, 10 digits starting 6-9.
  const phoneRe = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Please enter your email or phone number." },
      { status: 422 }
    );
  }
  if (email && !emailRe.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 }
    );
  }
  if (phone && !phoneRe.test(phone)) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit Indian mobile number." },
      { status: 422 }
    );
  }

  const summary =
    body.summary && typeof body.summary === "object"
      ? JSON.stringify(body.summary)
      : null;

  try {
    if (email) {
      // Upsert by email when available.
      await db.emailLead.upsert({
        where: { email },
        create: { email, phone: phone || undefined, city: city ?? undefined, summary },
        update: { phone: phone || undefined, city: city ?? undefined, summary },
      });
    } else {
      // Phone-only lead — insert directly (omit email entirely).
      await db.emailLead.create({
        data: { phone, city: city ?? undefined, summary },
      });
    }
  } catch (err) {
    console.error("[emails] failed to upsert lead:", err);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, message: "Lead captured successfully." },
    { status: 201 }
  );
}

/** Simple health check. */
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "emails" });
}
