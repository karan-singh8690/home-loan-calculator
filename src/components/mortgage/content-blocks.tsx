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
    title: "How overpayments reduce interest",
    body: (
      <>
        <p>
          Every mortgage payment is split into two parts:{" "}
          <strong>interest</strong> (the cost of borrowing, charged on your
          remaining balance) and <strong>principal</strong> (the part that
          actually pays down the loan). At the start of a mortgage, almost all
          of your payment is interest.
        </p>
        <p className="mt-2">
          An overpayment goes <em>directly to principal</em>. Because next
          month's interest is calculated on a smaller balance, less of your
          regular payment gets eaten by interest and more chips away at the loan
          — month after month, for the rest of the term. That compounding effect
          is why even small overpayments early in a mortgage can save a
          surprising amount.
        </p>
      </>
    ),
  },
  {
    icon: CalendarClock,
    title: "Why overpaying shortens your payoff date",
    body: (
      <>
        <p>
          Unless you formally recast the loan with your lender, your contractual
          monthly payment doesn't change when you overpay. Instead, the extra
          principal reduction means you reach a zero balance sooner — your{" "}
          <strong>payoff date moves earlier</strong>.
        </p>
        <p className="mt-2">
          The earlier you start, the bigger the effect. Overpaying in year one
          reduces interest for the entire remaining term, while the same
          overpayment in year twenty-nine barely moves the needle. The
          calculator's <em>Start overpayment at month</em> field lets you see
          exactly how much timing matters for your loan.
        </p>
      </>
    ),
  },
  {
    icon: TrendingDown,
    title: "Monthly vs. lump sum: which saves more?",
    body: (
      <>
        <p>
          A lump sum applied early almost always beats the same amount spread
          monthly, because the full reduction hits your balance — and therefore
          your interest — for more months. But lump sums require having the
          cash, while monthly overpayments are easier to sustain as a habit.
        </p>
        <p className="mt-2">
          A popular middle ground is a <strong>combination</strong>: a steady
          monthly overpayment you can commit to, plus occasional lump sums from
          bonuses, tax refunds, or windfalls. The calculator supports all three
          — switch the <em>Overpayment type</em> to &quot;Both&quot; and add an
          annual amount if you get yearly bonuses.
        </p>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Things to check before overpaying",
    body: (
      <>
        <ul className="list-disc space-y-1.5 pl-4">
          <li>
            <strong>Early-repayment fees:</strong> some fixed-rate mortgages
            charge a penalty if you overpay more than ~10% of the balance per
            year. Check your terms.
          </li>
          <li>
            <strong>Higher-interest debt:</strong> credit cards and personal
            loans usually cost more than your mortgage. Clear those first.
          </li>
          <li>
            <strong>Emergency fund:</strong> money tied up in your mortgage
            can't be withdrawn. Keep 3–6 months of expenses accessible.
          </li>
          <li>
            <strong>Offset vs. overpay:</strong> an offset account gives
            similar interest savings while keeping your cash liquid — worth
            comparing.
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
          How mortgage overpayments work
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
