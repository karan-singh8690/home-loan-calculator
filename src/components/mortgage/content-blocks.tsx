"use client";

import * as React from "react";
import { TrendingDown, CalendarClock, Layers, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BLOCKS = [
  {
    icon: Layers,
    title: "How prepayments reduce your interest",
    body: (
      <>
        <p>
          Every EMI is split into two parts: <strong>interest</strong> (the cost
          of borrowing, charged on your outstanding principal) and{" "}
          <strong>principal</strong> (the part that actually reduces your loan).
          At the start of a home loan, almost all of your EMI is interest.
        </p>
        <p className="mt-2">
          A prepayment goes <em>directly to the principal</em>. Because next
          month's interest is calculated on a smaller outstanding balance, less
          of your EMI gets eaten by interest and more chips away at the loan —
          month after month, for the rest of the tenure. That compounding effect
          is why even small prepayments early in a home loan can save a
          surprising amount.
        </p>
      </>
    ),
  },
  {
    icon: CalendarClock,
    title: "Why prepaying shortens your payoff date",
    body: (
      <>
        <p>
          Unless your bank restructures the loan (a &quot;recast&quot;), your
          contractual EMI doesn't change when you prepay. Instead, the extra
          principal reduction means you reach a zero balance sooner — your{" "}
          <strong>payoff date moves earlier</strong>.
        </p>
        <p className="mt-2">
          The earlier you start, the bigger the effect. Prepaying in year one
          reduces interest for the entire remaining tenure, while the same
          prepayment in the final years barely moves the needle. The
          calculator's <em>Start prepayment at month</em> field lets you see
          exactly how much timing matters for your loan.
        </p>
      </>
    ),
  },
  {
    icon: TrendingDown,
    title: "Reduce EMI vs reduce tenure: which is better?",
    body: (
      <>
        <p>
          When you prepay, most Indian banks (on floating-rate individual home
          loans) let you choose: keep the EMI the same and finish sooner
          (<strong>reduce tenure</strong>), or keep the tenure the same and
          lower your EMI (<strong>reduce EMI</strong>).
        </p>
        <p className="mt-2">
          Reduce tenure saves more interest because your EMI keeps hammering the
          (now smaller) principal. Reduce EMI improves monthly cash flow —
          useful if you expect income pressure or want to redirect money to
          other goals. Use the <em>Reduce EMI vs Reduce Tenure</em> calculator
          to compare both side-by-side.
        </p>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Things to check before prepaying",
    body: (
      <>
        <ul className="list-disc space-y-1.5 pl-4">
          <li>
            <strong>Prepayment penalty:</strong> RBI bars banks from charging
            any penalty on prepayment or foreclosure of floating-rate home
            loans to individuals. Fixed-rate loans may carry a charge (typically
            2% on the prepaid amount) — check your sanction letter.
          </li>
          <li>
            <strong>Higher-interest debt:</strong> personal loans and credit
            cards cost far more than your home loan. Clear those first.
          </li>
          <li>
            <strong>Tax benefits:</strong> principal repayment (including
            prepayment) qualifies for Section 80C (up to ₹1.5L), and interest
            under Section 24(b) (up to ₹2L for self-occupied). Don't let tax
            savings alone drive your decision, but factor them in.
          </li>
          <li>
            <strong>Emergency fund:</strong> money locked into your home loan
            can't be withdrawn. Keep 3–6 months of expenses liquid before
            prepaying.
          </li>
        </ul>
      </>
    ),
  },
];

export function ContentBlocks() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          How home loan prepayments work
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          A quick primer on the mechanics behind the numbers above.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {BLOCKS.map((b) => (
          <Card key={b.title}>
            <CardHeader className="pb-2">
              <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 mb-1 flex size-9 items-center justify-center rounded-lg">
                <b.icon className="size-5" />
              </div>
              <CardTitle className="text-sm">{b.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {b.body}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
