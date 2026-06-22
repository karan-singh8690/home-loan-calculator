import type { OverpaymentTiming } from "./mortgage";

/**
 * Example overpayment scenarios for the "Example scenarios" SEO section.
 *
 * Each scenario stores only the *inputs* + marketing copy. The actual savings
 * numbers are computed at render time by the same `calculateMortgage` engine
 * the user interacts with — so the displayed figures are always consistent
 * with the live calculator.
 */

export interface ScenarioInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
  overpaymentMonthly: number;
  overpaymentLumpSum: number;
  overpaymentAnnual: number;
  overpaymentStartMonth: number;
  overpaymentTiming: OverpaymentTiming;
}

export interface Scenario {
  id: string;
  title: string;
  /** Short tag shown as a pill, e.g. "Monthly", "Lump sum". */
  tag: string;
  /** One-line description of the strategy. */
  strategy: string;
  /** The inputs to feed the engine. */
  input: ScenarioInput;
}

// A common reference loan used across most scenarios so users can compare
// the *effect* of different strategies on the same mortgage.
const REF_30YR: Pick<ScenarioInput, "loanAmount" | "annualRate" | "termMonths"> = {
  loanAmount: 320_000,
  annualRate: 6.5,
  termMonths: 360,
};

export const SCENARIOS: Scenario[] = [
  {
    id: "small-monthly",
    title: "Small monthly overpayment",
    tag: "Monthly",
    strategy: "Add just $50 a month — roughly the cost of one takeout dinner.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 50,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "coffee-a-day",
    title: "“Coffee a day” overpayment",
    tag: "Monthly",
    strategy: "Round up your payment by $120 a month — about $4 a day.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 120,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "aggressive-monthly",
    title: "Aggressive monthly overpayment",
    tag: "Monthly",
    strategy: "Commit $500 a month extra from day one.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 500,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "lump-year2",
    title: "Large lump sum in year 2",
    tag: "Lump sum",
    strategy: "A $20,000 windfall dropped on the mortgage in month 24.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 20_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 24,
      overpaymentTiming: "end",
    },
  },
  {
    id: "inheritance-year3",
    title: "Inheritance lump sum in year 3",
    tag: "Lump sum",
    strategy: "A $50,000 inheritance applied in month 36.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 50_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 36,
      overpaymentTiming: "end",
    },
  },
  {
    id: "midterm-lump",
    title: "Mid-term lump sum (year 5)",
    tag: "Lump sum",
    strategy: "Save up $15,000 and apply it in month 60.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 15_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 60,
      overpaymentTiming: "end",
    },
  },
  {
    id: "monthly-plus-bonus",
    title: "Monthly overpayment + annual bonus",
    tag: "Combined",
    strategy: "$150 a month extra, plus a $2,000 annual bonus every year.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 150,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 2_000,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "tax-refund-annual",
    title: "Annual tax-refund overpayment",
    tag: "Annual",
    strategy: "No monthly change — just plough a $3,000 refund in every year.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 3_000,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "monthly-plus-lump",
    title: "Monthly overpayment + starting lump sum",
    tag: "Combined",
    strategy: "$200 a month ongoing, plus $5,000 applied up front in month 1.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 200,
      overpaymentLumpSum: 5_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "round-up-payment",
    title: "Round up your payment",
    tag: "Monthly",
    strategy: "Turn a $2,023 payment into a clean $2,200 — about $177 extra.",
    input: {
      loanAmount: 320_000,
      annualRate: 6.5,
      termMonths: 360,
      overpaymentMonthly: 177,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "pay-like-15yr",
    title: "Pay a 30-year loan like a 15-year",
    tag: "Short vs long",
    strategy:
      "Keep the 30-year term but overpay enough to clear it in 15 years — the short-vs-long comparison.",
    input: {
      loanAmount: 320_000,
      annualRate: 6.5,
      termMonths: 360,
      // 15-year payment on the same loan, minus the required 30-year payment.
      overpaymentMonthly: 995,
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
      "Same $300 a month — but applied at the start of each month to squeeze out a little extra interest saving.",
    input: {
      ...REF_30YR,
      overpaymentMonthly: 300,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "start",
    },
  },
];
