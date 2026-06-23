import type {
  OverpaymentType,
  OverpaymentTiming,
  PrepaymentMode,
  LumpSumPrepayment,
} from "./mortgage";

/**
 * UI-level calculator state for the India home-loan platform.
 *
 * `termYears` and `termExtraMonths` are kept separate for the UI even though
 * the engine only needs the combined `termMonths`. `paymentIsManual` tracks
 * whether the user has overridden the auto-calculated EMI.
 *
 * `inputMode` selects whether the user is entering a fresh loan amount
 * ("principal") or an outstanding principal with remaining tenure
 * ("outstanding") — the latter is common for existing borrowers who want to
 * model prepayments on a loan they're already paying.
 */
export interface CalcState {
  /** Input mode: fresh loan principal vs outstanding principal. */
  inputMode: "principal" | "outstanding";
  loanAmount: number;
  annualRate: number;
  termYears: number;
  termExtraMonths: number;
  monthlyPayment: number;
  paymentIsManual: boolean;
  overpaymentType: OverpaymentType;
  overpaymentMonthly: number;
  overpaymentLumpSum: number;
  overpaymentAnnual: number;
  /** Multiple scheduled lump-sum prepayments at arbitrary months. */
  lumpSums: LumpSumPrepayment[];
  overpaymentStartMonth: number;
  overpaymentTiming: OverpaymentTiming;
  /** How prepayments affect the loan: shorten tenure vs reduce EMI. */
  prepaymentMode: PrepaymentMode;
  startDate: Date;
}

/** India-focused defaults: ₹50 lakh @ 8.5% for 20 years, ₹5,000/mo prepayment. */
export const DEFAULT_STATE: CalcState = {
  inputMode: "principal",
  loanAmount: 50_00_000,
  annualRate: 8.5,
  termYears: 20,
  termExtraMonths: 0,
  monthlyPayment: 0, // auto-calculated on mount
  paymentIsManual: false,
  overpaymentType: "monthly",
  overpaymentMonthly: 5_000,
  overpaymentLumpSum: 2_00_000,
  overpaymentAnnual: 0,
  lumpSums: [],
  overpaymentStartMonth: 1,
  overpaymentTiming: "end",
  prepaymentMode: "tenure",
  startDate: new Date(),
};

/** Combined loan term in months. */
export function totalTermMonths(s: CalcState): number {
  return s.termYears * 12 + s.termExtraMonths;
}
