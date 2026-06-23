import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreLead } from "@/lib/lead-scoring";

/**
 * Qualified lead capture endpoint for the home loan calculator.
 *
 * Accepts contact info (email OR phone, at least one required) plus the
 * Phase 6 qualification fields: lender, balance range, current interest rate,
 * and city. Computes an internal lead score (0-100, not shown to users) and
 * stores the full calculator context (loan amount, EMI, tenure, prepayment,
 * interest saved, time saved) so partners can understand the prospect's
 * situation without follow-up questions.
 *
 * Idempotent on email — re-submissions update the qualification fields and
 * re-score the lead. Phone-only leads are always inserted as new rows.
 */

interface CalcContext {
  loanAmount?: number;
  emi?: number;
  tenureMonths?: number;
  monthlyExtra?: number;
  lumpSum?: number;
  interestSaved?: number;
  timeSavedMonths?: number;
  annualRate?: number;
}

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    phone?: string;
    name?: string;
    city?: string;
    lender?: string;
    loanBalanceRange?: string;
    interestRate?: number;
    calcContext?: CalcContext;
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
  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : null;
  const city =
    typeof body.city === "string" && body.city.trim()
      ? body.city.trim()
      : null;
  const lender =
    typeof body.lender === "string" && body.lender.trim()
      ? body.lender.trim()
      : null;
  const loanBalanceRange =
    typeof body.loanBalanceRange === "string" && body.loanBalanceRange.trim()
      ? body.loanBalanceRange.trim()
      : null;
  const interestRate =
    typeof body.interestRate === "number" && isFinite(body.interestRate)
      ? body.interestRate
      : null;

  // --- Validation ---
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Please enter your email or mobile number." },
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
  if (interestRate !== null && (interestRate < 1 || interestRate > 25)) {
    return NextResponse.json(
      { error: "Interest rate must be between 1% and 25%." },
      { status: 422 }
    );
  }

  // --- Lead scoring (internal, not shown to users) ---
  const { score, tier } = scoreLead({
    balanceRange: loanBalanceRange ?? "",
    interestRate: interestRate ?? undefined,
  });

  // --- Calculator context (attached automatically) ---
  const ctx = body.calcContext ?? {};
  const calcContextJson = JSON.stringify(ctx);
  const interestSaved = ctx.interestSaved ?? null;
  const timeSavedMonths = ctx.timeSavedMonths ?? null;

  // Legacy summary field (kept for backward compat with older consumers).
  const summaryJson =
    body.summary && typeof body.summary === "object"
      ? JSON.stringify(body.summary)
      : JSON.stringify(ctx);

  try {
    if (email) {
      await db.emailLead.upsert({
        where: { email },
        create: {
          email,
          phone: phone || undefined,
          name,
          city,
          lender,
          loanBalanceRange,
          interestRate,
          leadScore: score,
          leadTier: tier,
          interestSaved,
          timeSavedMonths,
          calcContext: calcContextJson,
          summary: summaryJson,
        },
        update: {
          phone: phone || undefined,
          name: name ?? undefined,
          city: city ?? undefined,
          lender: lender ?? undefined,
          loanBalanceRange: loanBalanceRange ?? undefined,
          interestRate: interestRate ?? undefined,
          leadScore: score,
          leadTier: tier,
          interestSaved,
          timeSavedMonths,
          calcContext: calcContextJson,
          summary: summaryJson,
        },
      });
    } else {
      await db.emailLead.create({
        data: {
          email: null,
          phone,
          name,
          city,
          lender,
          loanBalanceRange,
          interestRate,
          leadScore: score,
          leadTier: tier,
          interestSaved,
          timeSavedMonths,
          calcContext: calcContextJson,
          summary: summaryJson,
        },
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
    {
      ok: true,
      message: "Lead captured successfully.",
      leadScore: score,
      leadTier: tier,
    },
    { status: 201 }
  );
}

/** Simple health check. */
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "emails" });
}
