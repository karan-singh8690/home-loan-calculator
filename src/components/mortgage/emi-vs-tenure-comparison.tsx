"use client";

import * as React from "react";
import { Repeat, CalendarClock, TrendingDown, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  formatDuration,
} from "@/lib/format";
import type { MortgageResult } from "@/lib/mortgage";

interface EmiVsTenureComparisonProps {
  result: MortgageResult;
  /** The original EMI (input), used to label the "unchanged EMI" case. */
  originalEMI: number;
}

/**
 * Side-by-side comparison of "Reduce EMI" vs "Reduce Tenure" prepayment modes.
 * Uses the `comparison` field computed by `calculateMortgage({ compareBoth })`.
 */
export function EmiVsTenureComparison({ result, originalEMI }: EmiVsTenureComparisonProps) {
  if (!result.valid) return null;

  // Determine the two modes' headline numbers. The result itself is one mode;
  // `comparison` holds the alternate mode.
  const activeMode = result.prepaymentMode;
  const cmp = result.comparison;
  const tenureNums = {
    interestSaved:
      activeMode === "tenure" ? result.totalInterestSaved : (cmp?.totalInterestSaved ?? 0),
    monthsSaved:
      activeMode === "tenure" ? result.monthsSaved : (cmp?.monthsSaved ?? 0),
    emiReduction: 0,
    newTermMonths:
      activeMode === "tenure" ? result.newTermMonths : (cmp?.newTermMonths ?? result.originalTermMonths),
    finalEMI: originalEMI,
  };
  const emiNums = {
    interestSaved:
      activeMode === "emi" ? result.totalInterestSaved : (cmp?.totalInterestSaved ?? 0),
    monthsSaved: 0,
    emiReduction:
      activeMode === "emi" ? result.emiReduction : (cmp?.emiReduction ?? 0),
    newTermMonths:
      activeMode === "emi" ? result.newTermMonths : (cmp?.newTermMonths ?? result.originalTermMonths),
    finalEMI:
      activeMode === "emi" ? result.finalEMI : (cmp?.finalEMI ?? originalEMI),
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Reduce EMI vs Reduce Tenure</CardTitle>
        <CardDescription className="text-xs">
          Same prepayment, two outcomes. Pick the one that matches your goal.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Tenure reduction */}
        <ModeCard
          icon={<CalendarClock className="size-4" />}
          badge="Reduce Tenure"
          active={activeMode === "tenure"}
          headline={
            tenureNums.monthsSaved > 0
              ? formatDuration(tenureNums.monthsSaved) + " sooner"
              : "No change"
          }
          headlineLabel="Debt-free"
          rows={[
            { label: "Interest saved", value: formatCurrency(tenureNums.interestSaved) },
            { label: "EMI", value: formatCurrency(originalEMI) + "/mo (unchanged)" },
            {
              label: "New payoff",
              value: formatDate(
                new Date(
                  result.originalPayoffDate.getTime() -
                    tenureNums.monthsSaved * 30 * 86400000
                )
              ),
            },
          ]}
          verdict="Best for maximising interest savings and becoming debt-free faster."
        />

        {/* EMI reduction */}
        <ModeCard
          icon={<Repeat className="size-4" />}
          badge="Reduce EMI"
          active={activeMode === "emi"}
          headline={
            emiNums.emiReduction > 0
              ? formatCurrency(emiNums.emiReduction) + "/mo lower"
              : "No change"
          }
          headlineLabel="EMI drops by"
          rows={[
            { label: "Interest saved", value: formatCurrency(emiNums.interestSaved) },
            { label: "Final EMI", value: formatCurrency(emiNums.finalEMI) + "/mo" },
            { label: "Payoff date", value: formatDate(result.originalPayoffDate) + " (unchanged)" },
          ]}
          verdict="Best for easing monthly cash flow — your EMI steps down after each prepayment."
        />
      </CardContent>
      <div className="border-t px-6 py-3">
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <TrendingDown className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
          <span>
            <strong className="text-foreground">Rule of thumb:</strong> Reduce tenure
            saves more interest; reduce EMI improves monthly cash flow. If you can
            afford the original EMI, tenure reduction is usually the better financial
            choice. Use the toggle in the form to switch modes.
          </span>
        </p>
      </div>
    </Card>
  );
}

function ModeCard({
  icon,
  badge,
  active,
  headline,
  headlineLabel,
  rows,
  verdict,
}: {
  icon: React.ReactNode;
  badge: string;
  active: boolean;
  headline: string;
  headlineLabel: string;
  rows: { label: string; value: string }[];
  verdict: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        active
          ? "border-emerald-600/40 bg-emerald-50/50 dark:bg-emerald-950/20"
          : "border-border bg-card"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
          {icon}
          <span className="text-xs font-semibold tracking-wide uppercase">{badge}</span>
        </div>
        {active && (
          <Badge className="bg-emerald-600 text-white text-[10px]">Current</Badge>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
        {headline}
      </p>
      <p className="text-muted-foreground text-xs">{headlineLabel}</p>
      <dl className="mt-3 space-y-1.5 border-t pt-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-xs">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="font-semibold tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex items-start gap-1.5 border-t pt-3 text-xs text-muted-foreground">
        <ArrowRight className="mt-0.5 size-3 shrink-0" />
        <span>{verdict}</span>
      </p>
    </div>
  );
}
