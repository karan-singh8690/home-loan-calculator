/**
 * View (page) definitions for the India home-loan platform.
 *
 * All "pages" are client-side views on the single `/` route, switchable via
 * the `?tool=` query param so URLs are shareable and SEO-crawlable.
 */

export type ViewId =
  | "prepayment"
  | "emi"
  | "reduce-emi-vs-tenure"
  | "interest-saving"
  | "sbi"
  | "hdfc"
  | "icici"
  | "axis";

export interface ViewMeta {
  id: ViewId;
  /** Short label for nav. */
  navLabel: string;
  /** H1 heading shown at the top of the view. */
  title: string;
  /** Subtitle shown under the H1. */
  subtitle: string;
  /** HTML <title> content (dynamic metadata). */
  metaTitle: string;
  /** Meta description content. */
  metaDescription: string;
  /** Canonical path suffix, e.g. "/home-loan-prepayment-calculator-india". */
  canonical: string;
  /** Breadcrumb trail (excluding the implicit "Home"). */
  breadcrumbs: { label: string; view?: ViewId }[];
  /** Whether this view shows the full prepayment form (vs a simpler EMI form). */
  showPrepayment: boolean;
  /** Whether to compute the EMI-vs-tenure comparison side-by-side. */
  compareBoth: boolean;
  /** Whether to show the EMI/tenure mode toggle. V1 prepayment view is
   *  tenure-only, so this is false there; the comparison view shows it. */
  showModeToggle: boolean;
}

export const VIEWS: Record<ViewId, ViewMeta> = {
  prepayment: {
    id: "prepayment",
    navLabel: "Prepayment",
    title: "Home Loan Prepayment Calculator (Reduce Tenure)",
    subtitle:
      "See exactly how much interest you'll save and how many years you'll shave off your home loan by making prepayments. EMI stays fixed, tenure reduces — free, instant, and accurate with Indian rupee formatting.",
    metaTitle:
      "Home Loan Prepayment Calculator India | EMI, Interest & Tenure Saving",
    metaDescription:
      "Free India home loan prepayment calculator. Calculate interest saved, tenure reduction, and new payoff date with monthly prepayments, lump sums, or both. Works for SBI, HDFC, ICICI, Axis home loans.",
    canonical: "/home-loan-prepayment-calculator-india",
    breadcrumbs: [{ label: "Prepayment Calculator" }],
    showPrepayment: true,
    compareBoth: false,
    showModeToggle: false,
  },
  emi: {
    id: "emi",
    navLabel: "EMI Calculator",
    title: "Home Loan EMI Calculator",
    subtitle:
      "Calculate your monthly home loan EMI in seconds. Enter loan amount, interest rate, and tenure to see your EMI, total interest, and full amortization.",
    metaTitle: "Home Loan EMI Calculator | Calculate Monthly EMI Online Free",
    metaDescription:
      "Calculate your home loan EMI online for free. Enter loan amount, rate of interest, and tenure to get your monthly EMI, total interest payable, and complete amortization schedule.",
    canonical: "/home-loan-emi-calculator",
    breadcrumbs: [{ label: "EMI Calculator" }],
    showPrepayment: false,
    compareBoth: false,
    showModeToggle: false,
  },
  "reduce-emi-vs-tenure": {
    id: "reduce-emi-vs-tenure",
    navLabel: "EMI vs Tenure",
    title: "Reduce EMI vs Reduce Tenure Calculator",
    subtitle:
      "When you prepay, should you reduce your EMI or your tenure? This calculator shows both options side-by-side so you can pick the strategy that fits your goals.",
    metaTitle:
      "Reduce EMI vs Reduce Tenure Calculator | Which Prepayment Option is Better?",
    metaDescription:
      "Compare reduce EMI vs reduce tenure after home loan prepayment. See which option saves more interest and which lowers your monthly burden. Free India home loan calculator.",
    canonical: "/reduce-emi-vs-reduce-tenure-calculator",
    breadcrumbs: [{ label: "Reduce EMI vs Tenure" }],
    showPrepayment: true,
    compareBoth: true,
    showModeToggle: true,
  },
  "interest-saving": {
    id: "interest-saving",
    navLabel: "Interest Saving",
    title: "Home Loan Interest Saving Calculator",
    subtitle:
      "How much interest can you save on your home loan? Model different prepayment strategies and see the total interest avoided, broken down by year.",
    metaTitle:
      "Home Loan Interest Saving Calculator | How Much Interest Can You Save?",
    metaDescription:
      "Calculate how much home loan interest you can save with prepayments. Compare monthly, lump sum, and combined strategies. See year-by-year interest breakdown for Indian home loans.",
    canonical: "/home-loan-interest-saving-calculator",
    breadcrumbs: [{ label: "Interest Saving Calculator" }],
    showPrepayment: true,
    compareBoth: false,
    showModeToggle: false,
  },
  sbi: {
    id: "sbi",
    navLabel: "SBI",
    title: "SBI Home Loan Calculator",
    subtitle:
      "Calculate your SBI home loan EMI and prepayment savings. Pre-filled with State Bank of India home loan rates and terms — adjust to match your offer.",
    metaTitle:
      "SBI Home Loan Calculator | EMI & Prepayment Calculator for SBI Loans",
    metaDescription:
      "SBI home loan EMI and prepayment calculator. Calculate monthly EMI, interest saved, and tenure reduction for your State Bank of India home loan. Free, accurate, with Indian rupee formatting.",
    canonical: "/sbi-home-loan-calculator",
    breadcrumbs: [{ label: "Bank Calculators" }, { label: "SBI" }],
    showPrepayment: true,
    compareBoth: false,
    showModeToggle: false,
  },
  hdfc: {
    id: "hdfc",
    navLabel: "HDFC",
    title: "HDFC Home Loan Calculator",
    subtitle:
      "Calculate your HDFC home loan EMI and prepayment savings. Pre-filled with HDFC Bank home loan rates and terms — adjust to match your offer.",
    metaTitle:
      "HDFC Home Loan Calculator | EMI & Prepayment Calculator for HDFC Loans",
    metaDescription:
      "HDFC home loan EMI and prepayment calculator. Calculate monthly EMI, interest saved, and tenure reduction for your HDFC Bank home loan. Free, accurate, with Indian rupee formatting.",
    canonical: "/hdfc-home-loan-calculator",
    breadcrumbs: [{ label: "Bank Calculators" }, { label: "HDFC" }],
    showPrepayment: true,
    compareBoth: false,
    showModeToggle: false,
  },
  icici: {
    id: "icici",
    navLabel: "ICICI",
    title: "ICICI Home Loan Calculator",
    subtitle:
      "Calculate your ICICI home loan EMI and prepayment savings. Pre-filled with ICICI Bank home loan rates and terms — adjust to match your offer.",
    metaTitle:
      "ICICI Home Loan Calculator | EMI & Prepayment Calculator for ICICI Loans",
    metaDescription:
      "ICICI home loan EMI and prepayment calculator. Calculate monthly EMI, interest saved, and tenure reduction for your ICICI Bank home loan. Free, accurate, with Indian rupee formatting.",
    canonical: "/icici-home-loan-calculator",
    breadcrumbs: [{ label: "Bank Calculators" }, { label: "ICICI" }],
    showPrepayment: true,
    compareBoth: false,
    showModeToggle: false,
  },
  axis: {
    id: "axis",
    navLabel: "Axis",
    title: "Axis Home Loan Calculator",
    subtitle:
      "Calculate your Axis Bank home loan EMI and prepayment savings. Pre-filled with Axis Bank home loan rates and terms — adjust to match your offer.",
    metaTitle:
      "Axis Home Loan Calculator | EMI & Prepayment Calculator for Axis Bank Loans",
    metaDescription:
      "Axis Bank home loan EMI and prepayment calculator. Calculate monthly EMI, interest saved, and tenure reduction for your Axis Bank home loan. Free, accurate, with Indian rupee formatting.",
    canonical: "/axis-home-loan-calculator",
    breadcrumbs: [{ label: "Bank Calculators" }, { label: "Axis" }],
    showPrepayment: true,
    compareBoth: false,
    showModeToggle: false,
  },
};

export const VIEW_ORDER: ViewId[] = [
  "prepayment",
  "emi",
  "reduce-emi-vs-tenure",
  "interest-saving",
  "sbi",
  "hdfc",
  "icici",
  "axis",
];

export const BANK_VIEW_IDS: ViewId[] = ["sbi", "hdfc", "icici", "axis"];

export function isViewId(v: string | null | undefined): v is ViewId {
  return !!v && v in VIEWS;
}

export function getView(id: string | null | undefined): ViewMeta {
  if (isViewId(id)) return VIEWS[id];
  return VIEWS.prepayment;
}
