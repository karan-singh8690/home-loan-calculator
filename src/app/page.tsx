"use client";

import * as React from "react";
import { Home, TrendingDown } from "lucide-react";

import {
  calculateMortgage,
  calcMonthlyPayment,
  type MortgageInput,
} from "@/lib/mortgage";
import { formatCurrency, formatDateLong, formatDuration } from "@/lib/format";
import {
  DEFAULT_STATE,
  totalTermMonths,
  type CalcState,
} from "@/lib/calc-state";
import type { ScenarioInput } from "@/lib/scenarios";
import { useToast } from "@/hooks/use-toast";

import { CalculatorForm } from "@/components/mortgage/calculator-form";
import { ResultsSection } from "@/components/mortgage/results-section";
import { AmortizationTable } from "@/components/mortgage/amortization-table";
import { PaidExportTeaser } from "@/components/mortgage/paid-export-teaser";
import { AffiliateSection } from "@/components/mortgage/affiliate-section";
import { EmailCapture } from "@/components/mortgage/email-capture";
import { ScenarioCards } from "@/components/mortgage/scenario-cards";
import { FaqSection } from "@/components/mortgage/faq-section";
import { ContentBlocks } from "@/components/mortgage/content-blocks";

export default function MortgageCalculatorPage() {
  const { toast } = useToast();

  // Initialise with a valid auto-calculated monthly payment so the first paint
  // already shows results (no flash of "fill in your details").
  const [state, setState] = React.useState<CalcState>(() => {
    const term = DEFAULT_STATE.termYears * 12 + DEFAULT_STATE.termExtraMonths;
    const payment = calcMonthlyPayment(
      DEFAULT_STATE.loanAmount,
      DEFAULT_STATE.annualRate / 100 / 12,
      term
    );
    return { ...DEFAULT_STATE, monthlyPayment: Math.round(payment * 100) / 100 };
  });

  const term = totalTermMonths(state);
  const monthlyRate = state.annualRate / 100 / 12;

  // The "required" payment for the current loan/rate/term. Used both as the
  // auto-fill value and as a helper hint in the form.
  const calculatedPayment = React.useMemo(
    () => calcMonthlyPayment(state.loanAmount, monthlyRate, term),
    [state.loanAmount, monthlyRate, term]
  );

  // Keep the monthly payment in sync with loan/rate/term unless the user has
  // chosen to override it manually. Rounded to cents for a clean display.
  React.useEffect(() => {
    if (!state.paymentIsManual) {
      const rounded = Math.round(calculatedPayment * 100) / 100;
      setState((s) =>
        Math.abs(s.monthlyPayment - rounded) > 0.005
          ? { ...s, monthlyPayment: rounded }
          : s
      );
    }
  }, [calculatedPayment, state.paymentIsManual]);

  // The effective payment used in calculations: fall back to the calculated
  // payment if the user hasn't entered one yet.
  const effectivePayment =
    state.monthlyPayment > 0 ? state.monthlyPayment : calculatedPayment;

  // Respect the overpayment type selector: only feed the engine the amounts
  // that match the chosen strategy (so a hidden lump-sum field doesn't sneak
  // into a "monthly only" calculation).
  const activeMonthly =
    state.overpaymentType === "monthly" || state.overpaymentType === "both"
      ? state.overpaymentMonthly
      : 0;
  const activeLump =
    state.overpaymentType === "lump" || state.overpaymentType === "both"
      ? state.overpaymentLumpSum
      : 0;

  // Run the engine whenever inputs change.
  const result = React.useMemo(() => {
    const input: MortgageInput = {
      loanAmount: state.loanAmount,
      annualRate: state.annualRate,
      termMonths: term,
      monthlyPayment: effectivePayment,
      overpaymentMonthly: activeMonthly,
      overpaymentLumpSum: activeLump,
      overpaymentAnnual: state.overpaymentAnnual,
      overpaymentStartMonth: state.overpaymentStartMonth,
      overpaymentTiming: state.overpaymentTiming,
      startDate: state.startDate,
    };
    return calculateMortgage(input);
  }, [
    state.loanAmount,
    state.annualRate,
    term,
    effectivePayment,
    activeMonthly,
    activeLump,
    state.overpaymentAnnual,
    state.overpaymentStartMonth,
    state.overpaymentTiming,
    state.startDate,
  ]);

  function handleChange(patch: Partial<CalcState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function handleReset() {
    const term = DEFAULT_STATE.termYears * 12 + DEFAULT_STATE.termExtraMonths;
    const payment = calcMonthlyPayment(
      DEFAULT_STATE.loanAmount,
      DEFAULT_STATE.annualRate / 100 / 12,
      term
    );
    setState({
      ...DEFAULT_STATE,
      monthlyPayment: Math.round(payment * 100) / 100,
      startDate: new Date(),
    });
    toast({ title: "Reset", description: "Calculator restored to defaults." });
  }

  function handleCopy() {
    if (!result.valid) {
      toast({
        title: "Nothing to copy yet",
        description: "Fill in your mortgage details first.",
        variant: "destructive",
      });
      return;
    }
    const text = buildCopyText(result, state);
    navigator.clipboard
      .writeText(text)
      .then(() =>
        toast({
          title: "Copied!",
          description: "Results copied to your clipboard.",
        })
      )
      .catch(() =>
        toast({
          title: "Copy failed",
          description: "Your browser blocked clipboard access.",
          variant: "destructive",
        })
      );
  }

  function handleLoadScenario(input: ScenarioInput) {
    const term = input.termMonths;
    const payment = calcMonthlyPayment(
      input.loanAmount,
      input.annualRate / 100 / 12,
      term
    );
    const type: CalcState["overpaymentType"] =
      input.overpaymentMonthly > 0 && input.overpaymentLumpSum > 0
        ? "both"
        : input.overpaymentMonthly > 0
          ? "monthly"
          : input.overpaymentLumpSum > 0
            ? "lump"
            : "both";
    setState({
      loanAmount: input.loanAmount,
      annualRate: input.annualRate,
      termYears: Math.floor(term / 12),
      termExtraMonths: term % 12,
      monthlyPayment: Math.round(payment * 100) / 100,
      paymentIsManual: false,
      overpaymentType: type,
      overpaymentMonthly: input.overpaymentMonthly,
      overpaymentLumpSum: input.overpaymentLumpSum,
      overpaymentAnnual: input.overpaymentAnnual,
      overpaymentStartMonth: input.overpaymentStartMonth,
      overpaymentTiming: input.overpaymentTiming,
      startDate: new Date(),
    });
    toast({
      title: "Scenario loaded",
      description: "The calculator now reflects this example strategy.",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white flex size-8 items-center justify-center rounded-lg">
              <Home className="size-4" />
            </span>
            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight">OverPayCalc</p>
              <p className="text-muted-foreground text-[10px]">
                Mortgage overpayment calculator
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            <a
              href="#calculator"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              Calculator
            </a>
            <a
              href="#scenarios"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              Scenarios
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ---- Hero / intro ---- */}
        <section className="border-b bg-gradient-to-b from-emerald-50/60 to-background dark:from-emerald-950/20">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                <TrendingDown className="size-3.5" />
                See exactly how much you'll save
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
                Mortgage Overpayment Calculator
              </h1>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base text-pretty sm:text-lg">
                Find out how much interest you'll save and how many years you'll
                shave off your mortgage by overpaying. Free, instant, and
                accurate — monthly compounding, lump sums, or both.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Calculator + results ---- */}
        <section id="calculator" className="scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
              {/* Left: inputs (sticky on desktop) */}
              <div className="lg:sticky lg:top-20 lg:self-start">
                <CalculatorForm
                  state={state}
                  calculatedPayment={calculatedPayment}
                  warnings={result.warnings}
                  onChange={handleChange}
                  onReset={handleReset}
                  onCopy={handleCopy}
                />
              </div>

              {/* Right: results */}
              <div className="space-y-4">
                <ResultsSection result={result} />
                {result.valid && <AmortizationTable result={result} />}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Monetization: paid export + affiliate + email ---- */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
            {result.valid && (
              <PaidExportTeaser totalRows={result.overpaymentSchedule.length} />
            )}
            <AffiliateSection />
            <EmailCapture result={result} />
          </div>
        </section>

        {/* ---- SEO: scenarios ---- */}
        <section id="scenarios" className="scroll-mt-16 border-t">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <ScenarioCards onLoad={handleLoadScenario} />
          </div>
        </section>

        {/* ---- SEO: how it works ---- */}
        <section id="how-it-works" className="scroll-mt-16 border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <ContentBlocks />
          </div>
        </section>

        {/* ---- SEO: FAQ ---- */}
        <section id="faq" className="scroll-mt-16 border-t">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <FaqSection />
          </div>
        </section>
      </main>

      {/* ---- Footer (sticky to bottom) ---- */}
      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white flex size-7 items-center justify-center rounded-lg">
                <Home className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-semibold">OverPayCalc</p>
                <p className="text-muted-foreground text-xs">
                  Free mortgage overpayment calculator
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
              <a href="#calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                Calculator
              </a>
              <a href="#scenarios" className="text-muted-foreground hover:text-foreground transition-colors">
                Scenarios
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>
          </div>
          <div className="text-muted-foreground mt-6 border-t pt-4 text-center text-xs leading-relaxed">
            <p>
              This calculator is for informational purposes only and does not
              constitute financial advice. Figures are estimates based on the
              inputs you provide and assume monthly compounding. Always check
              with your lender for exact figures, early-repayment fees, and
              terms before making decisions.
            </p>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} OverPayCalc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Build a plain-text summary of the results for the "Copy results" button. */
function buildCopyText(
  r: ReturnType<typeof calculateMortgage>,
  state: CalcState
): string {
  const lines: string[] = [];
  lines.push("MORTGAGE OVERPAYMENT CALCULATOR — RESULTS");
  lines.push("==========================================");
  lines.push("");
  lines.push("YOUR MORTGAGE");
  lines.push(`  Loan amount:        ${formatCurrency(state.loanAmount)}`);
  lines.push(`  Interest rate:      ${state.annualRate}% APR`);
  lines.push(`  Term:               ${formatDuration(totalTermMonths(state))}`);
  lines.push(`  Monthly payment:    ${formatCurrency(state.monthlyPayment)}`);
  lines.push("");
  lines.push("OVERPAYMENT STRATEGY");
  const parts: string[] = [];
  if (state.overpaymentMonthly > 0)
    parts.push(`${formatCurrency(state.overpaymentMonthly)}/month`);
  if (state.overpaymentLumpSum > 0)
    parts.push(`${formatCurrency(state.overpaymentLumpSum)} lump sum`);
  if (state.overpaymentAnnual > 0)
    parts.push(`${formatCurrency(state.overpaymentAnnual)}/year`);
  lines.push(
    `  Strategy:           ${parts.join(" + ") || "none"} (starting month ${state.overpaymentStartMonth}, applied at ${state.overpaymentTiming} of month)`
  );
  lines.push("");
  lines.push("RESULTS");
  lines.push(`  Original payoff:    ${formatDateLong(r.originalPayoffDate)}`);
  lines.push(`  New payoff:         ${formatDateLong(r.newPayoffDate)}`);
  lines.push(
    `  Time saved:         ${r.monthsSaved > 0 ? formatDuration(r.monthsSaved) : "—"}`
  );
  lines.push(`  Interest saved:     ${formatCurrency(r.totalInterestSaved)}`);
  lines.push(`  Payments saved:     ${formatCurrency(r.totalPaymentsSaved)} (${r.monthsSaved} payments)`);
  lines.push("");
  lines.push(
    `Calculated with OverPayCalc — https://overpaycalc.example`
  );
  return lines.join("\n");
}
