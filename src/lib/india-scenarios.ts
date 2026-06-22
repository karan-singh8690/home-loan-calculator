import type { OverpaymentTiming } from "./mortgage";

/**
 * India-focused prepayment scenarios.
 *
 * Each scenario stores only the *inputs* + marketing copy. The actual savings
 * figures are computed at render time by the same `calculateMortgage` engine
 * the user interacts with — so the displayed numbers always stay consistent
 * with the live calculator.
 *
 * Reference loans use realistic Indian home-loan sizes and 2024-2025 ROI:
 *   - ₹35 lakh @ 8.40% (small / tier-2 city loan)
 *   - ₹50 lakh @ 8.50% (most common salaried home loan)
 *   - ₹75 lakh @ 8.60% (metro tier-2)
 *   - ₹1 crore @ 8.50% (large metro home loan)
 */

export interface IndiaScenarioInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  overpaymentMonthly: number;
  overpaymentLumpSum: number;
  overpaymentAnnual: number;
  overpaymentStartMonth: number;
  overpaymentTiming: OverpaymentTiming;
}

export interface IndiaScenario {
  id: string;
  title: string;
  /** Short tag shown as a pill, e.g. "Monthly", "Lump sum". */
  tag: string;
  /** One-line description of the strategy. */
  strategy: string;
  /** The inputs to feed the engine. */
  input: IndiaScenarioInput;
}

// Reference loans used across multiple scenarios so users can compare the
// effect of different prepayment strategies on the same loan.
const REF_50L_20Y: Pick<IndiaScenarioInput, "loanAmount" | "annualRate" | "termMonths"> = {
  loanAmount: 50_00_000,
  annualRate: 8.5,
  termMonths: 240,
};

const REF_35L_20Y: Pick<IndiaScenarioInput, "loanAmount" | "annualRate" | "termMonths"> = {
  loanAmount: 35_00_000,
  annualRate: 8.4,
  termMonths: 240,
};

const REF_75L_20Y: Pick<IndiaScenarioInput, "loanAmount" | "annualRate" | "termMonths"> = {
  loanAmount: 75_00_000,
  annualRate: 8.6,
  termMonths: 240,
};

export const INDIA_SCENARIOS: IndiaScenario[] = [
  {
    id: "small-monthly",
    title: "Small monthly prepayment",
    tag: "Monthly",
    strategy:
      "Add ₹2,000 a month on top of your EMI — roughly the cost of two movie outings. On a ₹50 lakh loan it shaves years off your tenure.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 2_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "round-up-emi",
    title: "Round up your EMI",
    tag: "Monthly",
    strategy:
      "Round your ₹43,391 EMI up to a clean ₹45,000 — about ₹1,609 extra every month, easy to remember and easy to automate.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 1_609,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "aggressive-monthly",
    title: "Aggressive monthly prepayment",
    tag: "Monthly",
    strategy:
      "Commit ₹10,000 extra every month from day one — viable for double-income households with surplus after expenses.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 10_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "annual-1-lakh-bonus",
    title: "₹1 lakh annual bonus prepayment",
    tag: "Annual",
    strategy:
      "No change to your monthly EMI — just plough your ₹1 lakh annual performance bonus into the loan every year.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 1_00_000,
      overpaymentStartMonth: 12,
      overpaymentTiming: "end",
    },
  },
  {
    id: "lump-from-bonus",
    title: "Lump sum from bonus in year 2",
    tag: "Lump sum",
    strategy:
      "A ₹3 lakh annual bonus dropped on the loan in month 24 — a single windfall that compounds for years.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 3_00_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 24,
      overpaymentTiming: "end",
    },
  },
  {
    id: "property-sale-lump",
    title: "Large lump sum from property sale",
    tag: "Lump sum",
    strategy:
      "Sell an inherited or older property and use ₹10 lakh to prepay your ₹75 lakh home loan in month 36 — a major principal reset.",
    input: {
      ...REF_75L_20Y,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 10_00_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 36,
      overpaymentTiming: "end",
    },
  },
  {
    id: "monthly-plus-annual",
    title: "Monthly prepayment + annual bonus",
    tag: "Combined",
    strategy:
      "₹5,000 extra every month, plus ₹2 lakh of your annual bonus — a disciplined two-track strategy that compounds fast.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 5_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 2_00_000,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "pay-like-10yr",
    title: "Pay a 20-year loan in 10 years",
    tag: "Short vs long",
    strategy:
      "Keep the 20-year sanction for low EMI eligibility but overpay enough (~₹18,605/month) to clear it in 10 years — the short-vs-long trade-off.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 18_605,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "start-vs-end",
    title: "Start-of-month vs end-of-month",
    tag: "Timing",
    strategy:
      "Same ₹5,000 a month, but applied at the start of each month — squeezing out a small additional interest saving by reducing principal before that month's interest is computed.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 5_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "start",
    },
  },
  {
    id: "step-up-prepayment",
    title: "Step-up prepayment after appraisal",
    tag: "Step-up",
    strategy:
      "Start with a modest ₹2,000 monthly prepayment and add ₹1.5 lakh annually from your year-end hike — a realistic step-up as your salary grows.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 2_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 1_50_000,
      overpaymentStartMonth: 13,
      overpaymentTiming: "end",
    },
  },
  {
    id: "emi-vs-tenure",
    title: "EMI reduction vs tenure reduction",
    tag: "EMI vs tenure",
    strategy:
      "₹3,000 monthly prepayment on a ₹50 lakh loan. Reduce tenure (modelled here) for maximum interest saving; ask your bank to reduce EMI instead if you want lower monthly cash outflow.",
    input: {
      ...REF_50L_20Y,
      overpaymentMonthly: 3_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "crore-loan-aggressive",
    title: "₹1 Crore loan, aggressive prepayment",
    tag: "Monthly",
    strategy:
      "A ₹1 crore metro home loan at 8.5% for 25 years, with ₹25,000 extra every month — typical for double-income borrowers who want to be debt-free before retirement.",
    input: {
      loanAmount: 1_00_00_000,
      annualRate: 8.5,
      termMonths: 300,
      overpaymentMonthly: 25_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
];
