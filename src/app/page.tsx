"use client";

import * as React from "react";
import Link from "next/link";
import { Home, TrendingDown, Menu, X } from "lucide-react";

import {
  calculateMortgage,
  calcMonthlyPayment,
  type MortgageInput,
  type LumpSumPrepayment,
} from "@/lib/mortgage";
import { calculateEMI } from "@/lib/amortization";
import { formatCurrency, formatDateLong, formatDuration } from "@/lib/format";
import {
  DEFAULT_STATE,
  totalTermMonths,
  type CalcState,
} from "@/lib/calc-state";
import { getBank } from "@/lib/india-data";
import type { IndiaScenarioInput } from "@/lib/india-scenarios";
import { getFaqsForView } from "@/lib/india-faqs";
import {
  VIEWS,
  VIEW_ORDER,
  getView,
  isViewId,
  type ViewId,
  type ViewMeta,
} from "@/lib/views";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/hooks/use-lang";
import {
  parseUrlState,
  writeUrlState,
  buildShareUrl,
  useInitialUrlState,
  type PrepaymentModeUrl,
} from "@/hooks/use-url-state";

import { CalculatorForm } from "@/components/mortgage/calculator-form";
import { ResultsSection } from "@/components/mortgage/results-section";
import { AmortizationTable } from "@/components/mortgage/amortization-table";
import { PaidExportTeaser } from "@/components/mortgage/paid-export-teaser";
import { AffiliateSection } from "@/components/mortgage/affiliate-section";
import { BalanceTransferSection } from "@/components/mortgage/balance-transfer-section";
import { RefinanceOffersSection } from "@/components/mortgage/refinance-offers-section";
import { EmailCapture } from "@/components/mortgage/email-capture";
import { ScenarioCards } from "@/components/mortgage/scenario-cards";
import { FaqSection } from "@/components/mortgage/faq-section";
import { ContentBlocks } from "@/components/mortgage/content-blocks";
import { GuidesSection } from "@/components/mortgage/guides-section";
import { EmiVsTenureComparison } from "@/components/mortgage/emi-vs-tenure-comparison";
import { BankInfoBlock } from "@/components/mortgage/bank-info-block";
import { Breadcrumb } from "@/components/mortgage/breadcrumb";
import { DynamicMeta } from "@/components/mortgage/dynamic-meta";
import { ExportButtons } from "@/components/mortgage/export-buttons";
import { LanguageSwitcher } from "@/components/mortgage/language-switcher";
import { HindiLandingPagesSection } from "@/components/mortgage/hindi-landing-pages";
import { SeoDashboard } from "@/components/mortgage/seo-dashboard";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export default function HomeLoanPlatform() {
  const { toast } = useToast();
  const { lang, toggleLang } = useLang();
  const initialUrl = useInitialUrlState();

  // Admin-only SEO dashboard (visible when ?seo=1 is in the URL).
  const [seoMode] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("seo") === "1";
  });

  // ---- View state (synced to ?tool=) ----
  const [viewId, setViewId] = React.useState<ViewId>(() =>
    isViewId(initialUrl.tool) ? (initialUrl.tool as ViewId) : "prepayment"
  );
  const view = getView(viewId);

  // ---- Calculator state ----
  const [state, setState] = React.useState<CalcState>(() =>
    buildInitialState(initialUrl)
  );

  const term = totalTermMonths(state);

  // Auto-calculated EMI for the current loan/rate/tenure (via amortization facade).
  const calculatedPayment = React.useMemo(
    () => calculateEMI(state.loanAmount, state.annualRate, term),
    [state.loanAmount, state.annualRate, term]
  );

  // Keep EMI in sync with loan/rate/tenure unless the user overrode it.
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

  const effectivePayment =
    state.monthlyPayment > 0 ? state.monthlyPayment : calculatedPayment;

  // Respect the overpayment type selector — only feed the engine the amounts
  // matching the chosen strategy. When the view doesn't show prepayments
  // (e.g. the pure EMI calculator), zero everything out so the result reflects
  // a plain amortizing loan.
  const showPrepayment = view.showPrepayment;
  const activeMonthly =
    showPrepayment &&
    (state.overpaymentType === "monthly" || state.overpaymentType === "both")
      ? state.overpaymentMonthly
      : 0;
  const activeLump =
    showPrepayment &&
    (state.overpaymentType === "lump" || state.overpaymentType === "both")
      ? state.overpaymentLumpSum
      : 0;
  const activeAnnual = showPrepayment ? state.overpaymentAnnual : 0;
  const activeLumpSums: LumpSumPrepayment[] = showPrepayment ? state.lumpSums : [];

  // Run the engine whenever inputs change. Bank & comparison views request
  // the alternate-mode comparison too.
  const result = React.useMemo(() => {
    const input: MortgageInput = {
      loanAmount: state.loanAmount,
      annualRate: state.annualRate,
      termMonths: term,
      monthlyPayment: effectivePayment,
      overpaymentMonthly: activeMonthly,
      overpaymentLumpSum: activeLump,
      overpaymentAnnual: activeAnnual,
      lumpSums: activeLumpSums,
      overpaymentStartMonth: state.overpaymentStartMonth,
      overpaymentTiming: state.overpaymentTiming,
      prepaymentMode:
        showPrepayment && view.showModeToggle ? state.prepaymentMode : "tenure",
      startDate: state.startDate,
    };
    return calculateMortgage(input, {
      compareBoth: view.compareBoth,
    });
  }, [
    state.loanAmount,
    state.annualRate,
    term,
    effectivePayment,
    activeMonthly,
    activeLump,
    activeAnnual,
    activeLumpSums,
    state.overpaymentStartMonth,
    state.overpaymentTiming,
    state.prepaymentMode,
    showPrepayment,
    view.showModeToggle,
    view.compareBoth,
    state.startDate,
  ]);

  // Effective savings = percentage reduction in total interest (Phase 4).
  const effectiveSavingsPct = React.useMemo(() => {
    if (!result.valid || result.totalInterestOriginal <= 0) return 0;
    return (result.totalInterestSaved / result.totalInterestOriginal) * 100;
  }, [result.valid, result.totalInterestSaved, result.totalInterestOriginal]);

  // Calculator context attached automatically to every lead (Phase 6).
  const calcContext = React.useMemo(
    () => ({
      loanAmount: state.loanAmount,
      emi: effectivePayment,
      tenureMonths: term,
      monthlyExtra: activeMonthly,
      lumpSum: activeLump,
      annualRate: state.annualRate,
      interestSaved: result.totalInterestSaved,
      timeSavedMonths: result.monthsSaved,
    }),
    [
      state.loanAmount,
      effectivePayment,
      term,
      activeMonthly,
      activeLump,
      state.annualRate,
      result.totalInterestSaved,
      result.monthsSaved,
    ]
  );

  // ---- Sync view + key inputs to the URL (shareable, Phase 4 format) ----
  React.useEffect(() => {
    // Map the overpayment type to the Phase 4 `mode` param.
    const mode: PrepaymentModeUrl | undefined = showPrepayment
      ? state.overpaymentType
      : undefined;
    writeUrlState({
      tool: viewId,
      lang,
      mode,
      amount: state.loanAmount,
      rate: state.annualRate,
      tenureYears: state.termYears,
      tenureMonths: state.termExtraMonths,
      emi: state.paymentIsManual ? state.monthlyPayment : undefined,
      extra: activeMonthly,
      startMonth: showPrepayment ? state.overpaymentStartMonth : undefined,
      lump: activeLump,
      lumpMonth: showPrepayment && activeLump > 0 ? state.overpaymentStartMonth : undefined,
      timing: state.overpaymentTiming,
      inputMode: state.inputMode,
      start: toMonthInputValue(state.startDate),
    });
  }, [
    viewId,
    lang,
    state.loanAmount,
    state.annualRate,
    state.termYears,
    state.termExtraMonths,
    state.paymentIsManual,
    state.monthlyPayment,
    activeMonthly,
    activeLump,
    state.overpaymentStartMonth,
    state.overpaymentTiming,
    state.overpaymentType,
    state.inputMode,
    state.startDate,
    showPrepayment,
  ]);

  // ---- Handlers ----
  function handleChange(patch: Partial<CalcState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function handleReset() {
    const t = DEFAULT_STATE.termYears * 12 + DEFAULT_STATE.termExtraMonths;
    const payment = calcMonthlyPayment(
      DEFAULT_STATE.loanAmount,
      DEFAULT_STATE.annualRate / 100 / 12,
      t
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
        description: "Fill in your loan details first.",
        variant: "destructive",
      });
      return;
    }
    const text = buildCopyText(result, state, view);
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

  function handleCopyShareLink() {
    const mode: PrepaymentModeUrl | undefined = showPrepayment
      ? state.overpaymentType
      : undefined;
    const url = buildShareUrl({
      tool: viewId,
      lang,
      mode,
      amount: state.loanAmount,
      rate: state.annualRate,
      tenureYears: state.termYears,
      tenureMonths: state.termExtraMonths,
      emi: state.paymentIsManual ? state.monthlyPayment : undefined,
      extra: activeMonthly,
      startMonth: showPrepayment ? state.overpaymentStartMonth : undefined,
      lump: activeLump,
      lumpMonth: showPrepayment && activeLump > 0 ? state.overpaymentStartMonth : undefined,
      timing: state.overpaymentTiming,
      start: toMonthInputValue(state.startDate),
    });
    navigator.clipboard
      .writeText(url)
      .then(() =>
        toast({
          title: "Share link copied!",
          description: "Paste it anywhere to share this exact calculation.",
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

  function handleLoadScenario(input: IndiaScenarioInput) {
    const t = input.termMonths;
    const payment = calcMonthlyPayment(
      input.loanAmount,
      input.annualRate / 100 / 12,
      t
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
      ...DEFAULT_STATE,
      loanAmount: input.loanAmount,
      annualRate: input.annualRate,
      termYears: Math.floor(t / 12),
      termExtraMonths: t % 12,
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

  function handleNavigate(v: ViewId) {
    setViewId(v);
    // For bank views, pre-fill the bank's default rate if it differs.
    const bank = getBank(v);
    if (bank && state.annualRate !== bank.defaultRate) {
      setState((s) => ({ ...s, annualRate: bank.defaultRate }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const bank = getBank(viewId);
  const faqsForView = React.useMemo(
    () => getFaqsForView(viewId),
    [viewId]
  );

  // Hindi H1/subtitle for the current view (sourced from the Hindi landing
  // pages library). Falls back to English when not available.
  const hindiTitle = React.useMemo(() => {
    if (lang !== "hi") return "";
    const map: Record<ViewId, string> = {
      prepayment: "होम लोन प्रीपेमेंट कैलकुलेटर (अवधि कम करें)",
      emi: "होम लोन EMI कैलकुलेटर",
      "reduce-emi-vs-tenure": "EMI कम करें या अवधि कम करें कैलकुलेटर",
      "interest-saving": "होम लोन ब्याज बचत कैलकुलेटर",
      sbi: "SBI होम लोन प्रीपेमेंट कैलकुलेटर",
      hdfc: "HDFC होम लोन प्रीपेमेंट कैलकुलेटर",
      icici: "ICICI होम लोन प्रीपेमेंट कैलकुलेटर",
      axis: "Axis होम लोन प्रीपेमेंट कैलकुलेटर",
    };
    return map[viewId] || "";
  }, [lang, viewId]);

  const hindiSubtitle = React.useMemo(() => {
    if (lang !== "hi") return "";
    const map: Record<ViewId, string> = {
      prepayment:
        "प्रीपेमेंट से कितना ब्याज बचेगा और कितनी अवधि कम होगी — तुरंत देखें। EMI वही रहती है, अवधि घटती है।",
      emi: "अपनी मासिक EMI तुरंत गणना करें। ऋण राशि, ब्याज दर और अवधि दर्ज करें।",
      "reduce-emi-vs-tenure":
        "प्रीपेमेंट पर EMI कम करें या अवधि? दोनों विकल्प एक साथ तुलना करें।",
      "interest-saving":
        "होम लोन पर कितना ब्याज बच सकता है? विभिन्न प्रीपेमेंट रणनीतियों की तुलना करें।",
      sbi: "SBI होम लोन की EMI और प्रीपेमेंट बचत गणना करें।",
      hdfc: "HDFC होम लोन की EMI और प्रीपेमेंट बचत गणना करें।",
      icici: "ICICI होम लोन की EMI और प्रीपेमेंट बचत गणना करें।",
      axis: "Axis होम लोन की EMI और प्रीपेमेंट बचत गणना करें।",
    };
    return map[viewId] || "";
  }, [lang, viewId]);

  // Hindi metadata for the DynamicMeta component.
  const hindiMeta = React.useMemo(() => {
    if (lang !== "hi") return null;
    return {
      metaTitle: hindiTitle
        ? `${hindiTitle} | EMI व ब्याज बचत कैलक्युलेटर`
        : view.metaTitle,
      metaDescription: hindiSubtitle || view.metaDescription,
      title: hindiTitle || view.title,
      subtitle: hindiSubtitle || view.subtitle,
      canonical: `/hi${view.canonical}`,
    };
  }, [lang, hindiTitle, hindiSubtitle, view]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DynamicMeta view={view} faqs={faqsForView} lang={lang} hindiMeta={hindiMeta} />

      {/* ---- Header ---- */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4">
          <Link
            href="?tool=prepayment"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate("prepayment");
            }}
          >
            <span className="bg-emerald-600 text-white flex size-8 items-center justify-center rounded-lg">
              <Home className="size-4" />
            </span>
            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight">
                {t(lang, "app.name")}
              </p>
              <p className="text-muted-foreground text-[10px]">
                {t(lang, "app.tagline")}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} onToggle={toggleLang} />
            <NavMenu viewId={viewId} onNavigate={handleNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ---- Hero / intro ---- */}
        <section className="border-b bg-gradient-to-b from-emerald-50/60 to-background dark:from-emerald-950/20">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
            <Breadcrumb view={view} lang={lang} />
            <div className="mt-4 max-w-3xl">
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                <TrendingDown className="size-3.5" />
                {bank
                  ? `${bank.shortName} home loan`
                  : lang === "hi"
                    ? "निःशुल्क • तुरंत • सटीक"
                    : "Free • Instant • Accurate"}
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-balance sm:text-3xl md:text-4xl">
                {hindiTitle || view.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm text-pretty sm:text-base">
                {hindiSubtitle || view.subtitle}
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
                  showPrepayment={view.showPrepayment}
                  showModeToggle={view.showModeToggle}
                  lang={lang}
                  onChange={handleChange}
                  onReset={handleReset}
                  onCopy={handleCopy}
                  onCopyShareLink={handleCopyShareLink}
                />
              </div>

              {/* Right: results */}
              <div className="space-y-4">
                <ResultsSection result={result} effectiveSavingsPct={effectiveSavingsPct} lang={lang} />
                {view.compareBoth && result.valid && (
                  <EmiVsTenureComparison result={result} originalEMI={effectivePayment} />
                )}
                {result.valid && (
                  <>
                    <AmortizationTable result={result} variant="preview" />
                    <ExportButtons
                      schedule={result.overpaymentSchedule}
                      originalSchedule={result.originalSchedule}
                      summary={{
                        monthsSaved: result.monthsSaved,
                        totalInterestSaved: result.totalInterestSaved,
                        totalInterestOriginal: result.totalInterestOriginal,
                        newPayoffDate: result.newPayoffDate,
                        originalPayoffDate: result.originalPayoffDate,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Bank info (bank views only) ---- */}
        {bank && (
          <section id="bank-info" className="scroll-mt-16 border-t bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-8">
              <BankInfoBlock bank={bank} />
            </div>
          </section>
        )}

        {/* ---- Monetization ---- */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
            {result.valid && (
              <PaidExportTeaser totalRows={result.overpaymentSchedule.length} />
            )}
            <BalanceTransferSection />
            <RefinanceOffersSection />
            <AffiliateSection lang={lang} />
            <EmailCapture result={result} lang={lang} calcContext={calcContext} />
          </div>
        </section>

        {/* ---- Scenarios ---- */}
        <section id="scenarios" className="scroll-mt-16 border-t">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <ScenarioCards onLoad={handleLoadScenario} lang={lang} />
          </div>
        </section>

        {/* ---- How it works ---- */}
        <section id="how-it-works" className="scroll-mt-16 border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <ContentBlocks />
          </div>
        </section>

        {/* ---- Guides ---- */}
        <section id="guides" className="scroll-mt-16 border-t">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <GuidesSection lang={lang} />
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section id="faq" className="scroll-mt-16 border-t bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <FaqSection view={viewId} lang={lang} />
          </div>
        </section>

        {/* ---- Hindi landing pages hub (Hindi mode only) ---- */}
        {lang === "hi" && (
          <section className="border-t">
            <div className="mx-auto max-w-7xl px-4 py-10">
              <HindiLandingPagesSection lang={lang} />
            </div>
          </section>
        )}

        {/* ---- SEO dashboard (admin-only, ?seo=1) ---- */}
        <SeoDashboard visible={seoMode} />
      </main>

      {/* ---- Footer ---- */}
      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white flex size-7 items-center justify-center rounded-lg">
                <Home className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-semibold">HomeLoan Calc</p>
                <p className="text-muted-foreground text-xs">
                  India home loan EMI &amp; prepayment calculator
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
              {VIEW_ORDER.map((v) => (
                <button
                  key={v}
                  onClick={() => handleNavigate(v)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    viewId === v && "text-foreground font-medium"
                  )}
                >
                  {VIEWS[v].navLabel}
                </button>
              ))}
            </nav>
          </div>
          <div className="text-muted-foreground mt-6 border-t pt-4 text-center text-xs leading-relaxed">
            <p>
              This calculator is for informational purposes only and does not
              constitute financial advice. Figures are estimates based on the
              inputs you provide and assume monthly compounding. Interest rates
              are indicative — always confirm the exact ROI, fees, and
              prepayment terms with your bank before deciding.
            </p>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} HomeLoan Calc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Build the initial CalcState from defaults overlaid with URL params. */
function buildInitialState(url: ReturnType<typeof parseUrlState>): CalcState {
  const base: CalcState = {
    ...DEFAULT_STATE,
    startDate: url.start ? fromMonthInputValue(url.start) : new Date(),
  };
  if (url.loan !== undefined) base.loanAmount = url.loan;
  if (url.rate !== undefined) base.annualRate = url.rate;
  if (url.years !== undefined) base.termYears = url.years;
  if (url.months !== undefined) base.termExtraMonths = url.months;
  // Phase 4: emi=0 (or blank) means "auto-calculate". Only treat a positive
  // value as a manual override.
  if (url.emi !== undefined && url.emi > 0) {
    base.monthlyPayment = url.emi;
    base.paymentIsManual = true;
  }
  if (url.opMonthly !== undefined) base.overpaymentMonthly = url.opMonthly;
  if (url.opLump !== undefined) base.overpaymentLumpSum = url.opLump;
  if (url.opAnnual !== undefined) base.overpaymentAnnual = url.opAnnual;
  if (url.opStart !== undefined) base.overpaymentStartMonth = url.opStart;
  if (url.timing) base.overpaymentTiming = url.timing;
  // Phase 4: `mode` is the prepayment type (monthly/lump/both).
  if (url.mode) base.overpaymentType = url.mode;
  // `engineMode` is the tenure/emi strategy (V1 always tenure).
  if (url.engineMode) base.prepaymentMode = url.engineMode;
  if (url.inputMode) base.inputMode = url.inputMode;

  // Pre-fill bank default rate if the tool is a bank view.
  if (url.tool && isViewId(url.tool)) {
    const bank = getBank(url.tool);
    if (bank && url.rate === undefined) base.annualRate = bank.defaultRate;
  }

  // Compute an initial EMI if not manually set.
  if (!base.paymentIsManual) {
    const t = base.termYears * 12 + base.termExtraMonths;
    const payment = calcMonthlyPayment(
      base.loanAmount,
      base.annualRate / 100 / 12,
      t
    );
    base.monthlyPayment = Math.round(payment * 100) / 100;
  }
  base.lumpSums = base.lumpSums ?? [];
  return base;
}

/** Header navigation: dropdown on mobile, inline on desktop. */
function NavMenu({
  viewId,
  onNavigate,
}: {
  viewId: ViewId;
  onNavigate: (v: ViewId) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center">
      <nav className="hidden items-center gap-0.5 lg:flex">
        {VIEW_ORDER.map((v) => (
          <button
            key={v}
            onClick={() => onNavigate(v)}
            className={cn(
              "text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-1.5 text-sm transition-colors",
              viewId === v && "text-foreground bg-muted font-medium"
            )}
          >
            {VIEWS[v].navLabel}
          </button>
        ))}
      </nav>
      {/* Mobile dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="hover:bg-muted inline-flex size-9 items-center justify-center rounded-md"
          aria-label="Toggle menu"
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </button>
        {open && (
          <div className="bg-popover absolute right-0 top-14 z-50 w-56 rounded-md border p-1 shadow-md">
            {VIEW_ORDER.map((v) => (
              <button
                key={v}
                onClick={() => {
                  onNavigate(v);
                  setOpen(false);
                }}
                className={cn(
                  "hover:bg-muted flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm",
                  viewId === v && "bg-muted font-medium"
                )}
              >
                {VIEWS[v].navLabel}
                {viewId === v && <X className="size-3 opacity-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Build a plain-text summary of the results for "Copy results". */
function buildCopyText(
  r: ReturnType<typeof calculateMortgage>,
  state: CalcState,
  view: ViewMeta
): string {
  const lines: string[] = [];
  lines.push(`${view.title.toUpperCase()}`);
  lines.push("=".repeat(view.title.length));
  lines.push("");
  lines.push("YOUR HOME LOAN");
  lines.push(`  Loan amount:        ${formatCurrency(state.loanAmount)}`);
  lines.push(`  Interest rate:      ${state.annualRate}% p.a.`);
  lines.push(`  Tenure:             ${formatDuration(totalTermMonths(state))}`);
  lines.push(`  Monthly EMI:        ${formatCurrency(state.monthlyPayment)}`);
  lines.push("");
  if (view.showPrepayment) {
    lines.push("PREPAYMENT STRATEGY");
    lines.push(`  Mode:               ${state.prepaymentMode === "emi" ? "Reduce EMI" : "Reduce tenure"}`);
    const parts: string[] = [];
    if (state.overpaymentMonthly > 0)
      parts.push(`${formatCurrency(state.overpaymentMonthly)}/month`);
    if (state.overpaymentLumpSum > 0)
      parts.push(`${formatCurrency(state.overpaymentLumpSum)} lump sum`);
    if (state.overpaymentAnnual > 0)
      parts.push(`${formatCurrency(state.overpaymentAnnual)}/year`);
    if (state.lumpSums.length > 0) {
      for (const ls of state.lumpSums as LumpSumPrepayment[]) {
        parts.push(`${formatCurrency(ls.amount)} in month ${ls.month}`);
      }
    }
    lines.push(
      `  Strategy:           ${parts.join(" + ") || "none"} (from month ${state.overpaymentStartMonth}, applied at ${state.overpaymentTiming} of month)`
    );
    lines.push("");
  }
  lines.push("RESULTS");
  lines.push(`  Original payoff:    ${formatDateLong(r.originalPayoffDate)}`);
  lines.push(`  New payoff:         ${formatDateLong(r.newPayoffDate)}`);
  if (r.prepaymentMode === "emi") {
    lines.push(`  EMI reduced by:     ${formatCurrency(r.emiReduction)}/month`);
    lines.push(`  Final EMI:          ${formatCurrency(r.finalEMI)}`);
  } else {
    lines.push(
      `  Time saved:         ${r.monthsSaved > 0 ? formatDuration(r.monthsSaved) : "—"}`
    );
  }
  lines.push(`  Interest saved:     ${formatCurrency(r.totalInterestSaved)}`);
  if (r.prepaymentMode === "tenure") {
    lines.push(
      `  EMIs saved:         ${formatCurrency(r.totalPaymentsSaved)} (${r.monthsSaved} EMIs)`
    );
  }
  lines.push("");
  lines.push(`Calculated with HomeLoan Calc`);
  return lines.join("\n");
}

function toMonthInputValue(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${y}-${m}`;
}

function fromMonthInputValue(v: string): Date {
  const [y, m] = v.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1);
}
