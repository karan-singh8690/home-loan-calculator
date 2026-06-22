"use client";

import * as React from "react";
import {
  CalendarClock,
  CalendarCheck,
  TrendingDown,
  PiggyBank,
  Clock,
  Sparkles,
  AlertTriangle,
  Repeat,
} from "lucide-react";

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
  formatDateLong,
  formatDuration,
} from "@/lib/format";
import type { MortgageResult } from "@/lib/mortgage";

interface ResultsSectionProps {
  result: MortgageResult;
  /** Percentage reduction in total interest (Phase 4 effective savings). */
  effectiveSavingsPct?: number;
}

export function ResultsSection({ result, effectiveSavingsPct }: ResultsSectionProps) {
  if (!result.valid) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <AlertTriangle className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">Fill in your mortgage details</p>
          <p className="text-muted-foreground max-w-sm text-xs">
            Enter a loan amount, interest rate, and term on the left to see your
            savings, new payoff date, and amortization preview.
          </p>
        </CardContent>
      </Card>
    );
  }

  const monthsSaved = result.monthsSaved;
  const interestSaved = result.totalInterestSaved;
  const hasOverpayment = result.totalOverpaymentDeployed > 0.5;
  const isEmiMode = result.prepaymentMode === "emi";
  const emiReduction = result.emiReduction;
  const finalEMI = result.finalEMI;

  return (
    <div className="space-y-4">
      {/* ---- Hero: the two headline numbers ---- */}
      <Card className="relative overflow-hidden border-emerald-600/30 bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-card dark:to-card">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-32 rounded-full bg-emerald-500/10 blur-2xl" />
        <CardHeader className="relative pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base">Your results</CardTitle>
            {isEmiMode ? (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 ml-1 text-[10px]">
                <Repeat className="mr-1 size-3" /> EMI reduction
              </Badge>
            ) : (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 ml-1 text-[10px]">
                <CalendarClock className="mr-1 size-3" /> Tenure reduction
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            Compared to your original home loan schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Interest saved */}
            <div className="rounded-xl bg-white/70 p-4 ring-1 ring-emerald-600/15 dark:bg-black/20">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <PiggyBank className="size-4" />
                <span className="text-xs font-semibold tracking-wide uppercase">
                  Interest saved
                </span>
              </div>
              <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300 sm:text-4xl">
                {formatCurrency(interestSaved)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {isEmiMode
                  ? "Interest avoided by prepaying principal, even though your EMI dropped."
                  : "Net money you keep by paying less interest over the life of the loan."}
              </p>
            </div>

            {/* Time saved OR EMI reduced */}
            <div className="rounded-xl bg-white/70 p-4 ring-1 ring-emerald-600/15 dark:bg-black/20">
              {isEmiMode ? (
                <>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <Repeat className="size-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      EMI reduced by
                    </span>
                  </div>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300 sm:text-4xl">
                    {emiReduction > 0 ? formatCurrency(emiReduction) + "/mo" : "—"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Your EMI drops from {formatCurrency(finalEMI + emiReduction)} to {formatCurrency(finalEMI)} — your tenure stays the same.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <Clock className="size-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      Debt-free sooner
                    </span>
                  </div>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300 sm:text-4xl">
                    {monthsSaved > 0 ? formatDuration(monthsSaved) : "—"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {monthsSaved > 0
                      ? `Shaved off your original ${formatDuration(result.originalTermMonths)} tenure.`
                      : "No change to your tenure with the current prepayment."}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Effective Savings (percentage reduction) */}
          {effectiveSavingsPct !== undefined && effectiveSavingsPct > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-600/20 bg-white/60 p-3 dark:bg-black/10">
              <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 flex size-9 shrink-0 items-center justify-center rounded-lg">
                <TrendingDown className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                  Effective savings
                </p>
                <p className="text-sm font-semibold">
                  {effectiveSavingsPct.toFixed(1)}% less interest over the life of the loan
                </p>
              </div>
            </div>
          )}

          {/* Plain-English summary */}
          <div className="mt-4 rounded-xl border border-emerald-600/20 bg-emerald-50/60 p-4 dark:bg-emerald-950/20">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-200">
              What this means
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {buildSummary(result)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---- Comparison cards ---- */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DateCard
          icon={<CalendarClock className="size-4" />}
          label="Original payoff date"
          date={formatDateLong(result.originalPayoffDate)}
          sub={`Original tenure: ${formatDuration(result.originalTermMonths)}`}
          tone="muted"
        />
        <DateCard
          icon={<CalendarCheck className="size-4" />}
          label={isEmiMode ? "Payoff date (unchanged)" : "New payoff date"}
          date={formatDateLong(result.newPayoffDate)}
          sub={
            isEmiMode
              ? "Tenure stays the same in EMI mode"
              : monthsSaved > 0
                ? `New tenure: ${formatDuration(result.newTermMonths)} — ${formatDuration(monthsSaved)} earlier`
                : "Same as original"
          }
          tone={!isEmiMode && monthsSaved > 0 ? "emerald" : "muted"}
        />
      </div>

      {/* ---- Worth it? badge ---- */}
      {interestSaved > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-600/30 bg-emerald-50/50 px-4 py-3 dark:bg-emerald-950/20">
          <span className="bg-emerald-600 text-white flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {isWorthIt(result) ? "YES" : "NO"}
          </span>
          <div>
            <p className="text-sm font-semibold">
              Worth it? {isWorthIt(result) ? "Yes" : "Not yet"}
            </p>
            <p className="text-muted-foreground text-xs">
              {isWorthIt(result)
                ? isEmiMode
                  ? "You save interest and lower your monthly EMI."
                  : "You become debt-free sooner and save on interest."
                : "Increase your prepayment or start earlier to see savings."}
            </p>
          </div>
        </div>
      )}

      {/* ---- Interest & payment breakdown ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Original loan vs. with prepayments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ComparisonRow
            label="Total interest paid"
            original={formatCurrency(result.totalInterestOriginal)}
            newValue={formatCurrency(result.totalInterestWithOverpayment)}
            saved={formatCurrency(interestSaved)}
            savedLabel="interest saved"
          />
          <ComparisonRow
            label="Total amount paid"
            original={formatCurrency(result.totalPaidOriginal)}
            newValue={formatCurrency(result.totalPaidWithOverpayment)}
            saved={formatCurrency(result.totalPaidOriginal - result.totalPaidWithOverpayment)}
            savedLabel="less out of pocket"
            note={
              hasOverpayment
                ? `Includes ${formatCurrency(result.totalOverpaymentDeployed)} in prepayments you chose to make.`
                : undefined
            }
          />
          {isEmiMode ? (
            <ComparisonRow
              label="Monthly EMI"
              original={formatCurrency(finalEMI + emiReduction)}
              newValue={formatCurrency(finalEMI)}
              saved={emiReduction > 0 ? formatCurrency(emiReduction) + "/mo" : "—"}
              savedLabel="EMI reduced"
              note="Your EMI steps down after each prepayment; shown is the final (lowest) EMI."
            />
          ) : (
            <ComparisonRow
              label="EMIs no longer required"
              original={`${result.originalTermMonths} EMIs`}
              newValue={`${result.newTermMonths} EMIs`}
              saved={formatCurrency(result.totalPaymentsSaved)}
              savedLabel="cash-flow freed up"
            />
          )}
        </CardContent>
      </Card>

      {/* ---- Is it worth it? ---- */}
      <Card className="border-emerald-600/20">
        <CardContent className="flex items-start gap-3 py-5">
          <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
            <TrendingDown className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Is the strategy worth it?</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {buildWorthIt(result)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DateCard({
  icon,
  label,
  date,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  date: string;
  sub: string;
  tone: "emerald" | "muted";
}) {
  return (
    <Card
      className={cn(
        tone === "emerald" &&
          "border-emerald-600/30 bg-emerald-50/40 dark:bg-emerald-950/20"
      )}
    >
      <CardContent className="py-4">
        <div
          className={cn(
            "flex items-center gap-1.5",
            tone === "emerald"
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-muted-foreground"
          )}
        >
          {icon}
          <span className="text-xs font-semibold tracking-wide uppercase">
            {label}
          </span>
        </div>
        <p className="mt-1.5 text-lg font-bold tracking-tight">{date}</p>
        <p className="text-muted-foreground text-xs">{sub}</p>
      </CardContent>
    </Card>
  );
}

function ComparisonRow({
  label,
  original,
  newValue,
  saved,
  savedLabel,
  note,
}: {
  label: string;
  original: string;
  newValue: string;
  saved: string;
  savedLabel: string;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {note && <p className="text-muted-foreground text-xs">{note}</p>}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="text-right">
          <p className="text-muted-foreground">Original</p>
          <p className="font-semibold tabular-nums">{original}</p>
        </div>
        <div className="text-right">
          <p className="text-emerald-700 dark:text-emerald-300">With overpay</p>
          <p className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
            {newValue}
          </p>
        </div>
      </div>
      <div className="rounded-md bg-emerald-50 px-2.5 py-1 text-right dark:bg-emerald-950/30">
        <p className="text-[10px] font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
          {savedLabel}
        </p>
        <p className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
          {saved}
        </p>
      </div>
    </div>
  );
}

/** Whether the prepayment strategy is "worth it" — saves interest or time. */
function isWorthIt(r: MortgageResult): boolean {
  return r.totalInterestSaved > 0 || r.monthsSaved > 0 || r.emiReduction > 0;
}

/** Build the plain-English "What this means" summary. */
function buildSummary(r: MortgageResult): string {
  const isEmiMode = r.prepaymentMode === "emi";
  if (isEmiMode) {
    if (r.emiReduction <= 0 && r.totalInterestSaved <= 0) {
      return "With the current inputs, your prepayment isn't reducing the EMI or saving interest. Try increasing the amount or starting earlier.";
    }
    const saved = formatCurrency(r.totalInterestSaved);
    const drop = formatCurrency(r.emiReduction);
    return (
      `By prepaying, your EMI drops by ${drop}/month while your tenure stays at ${formatDuration(r.originalTermMonths)}. ` +
      `You'll still save ${saved} in total interest over the life of the loan — money that stays with you ` +
      `instead of going to the bank. Lower EMIs also ease your monthly cash flow for other goals.`
    );
  }
  if (r.monthsSaved <= 0) {
    return "With the current inputs, your prepayment doesn't shorten the loan. Try increasing the amount, or moving the start month earlier — the earlier you prepay, the more interest you save.";
  }
  const time = formatDuration(r.monthsSaved);
  const saved = formatCurrency(r.totalInterestSaved);
  const newDate = formatDate(r.newPayoffDate);
  const perMonthSaved = r.monthsSaved > 0
    ? formatCurrency(r.totalInterestSaved / r.monthsSaved)
    : "";

  return (
    `By prepaying, you'll be debt-free ${time} sooner — finishing around ${newDate} ` +
    `instead of ${formatDate(r.originalPayoffDate)}. You'll save ${saved} in interest, ` +
    `which works out to roughly ${perMonthSaved} saved for every month you shave off. ` +
    `That's money that stays in your pocket instead of going to the bank.`
  );
}

/** Build the "is it worth it" verdict. */
function buildWorthIt(r: MortgageResult): string {
  const isEmiMode = r.prepaymentMode === "emi";
  if (r.totalInterestSaved <= 0) {
    return "Right now the prepayment isn't moving the needle. The most common reason is starting too late, or prepaying less than the monthly interest on the outstanding principal. Try starting at month 1 or increasing the amount.";
  }
  const ratio =
    r.totalOverpaymentDeployed > 0
      ? r.totalInterestSaved / r.totalOverpaymentDeployed
      : Infinity;
  if (!isFinite(ratio)) {
    return "Every rupee of prepayment is working hard — you're saving meaningful interest for very little extra outlay.";
  }
  const mult = ratio.toFixed(1);
  if (isEmiMode) {
    return (
      `Yes. You'll deploy ${formatCurrency(r.totalOverpaymentDeployed)} in prepayments and save ` +
      `${formatCurrency(r.totalInterestSaved)} in interest — about ₹${mult} saved for every ₹1 you ` +
      `prepay — while also lowering your EMI by ${formatCurrency(r.emiReduction)}/month. ` +
      `That's a guaranteed, tax-free return equal to your home loan rate.`
    );
  }
  return (
    `Yes. You'll deploy ${formatCurrency(r.totalOverpaymentDeployed)} in prepayments and save ` +
    `${formatCurrency(r.totalInterestSaved)} in interest — about ₹${mult} saved for every ₹1 you ` +
    `prepay. That's a guaranteed, tax-free return equal to your home loan rate, which is hard to ` +
    `beat with most other safe investments.`
  );
}
