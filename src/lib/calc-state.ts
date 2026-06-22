import type { OverpaymentType, OverpaymentTiming } from "./mortgage";

/**
 * UI-level calculator state.
 *
 * `termYears` and `termExtraMonths` are kept separate for the UI even though
 * the engine only needs the combined `termMonths`. `paymentIsManual` tracks
 * whether the user has overridden the auto-calculated monthly payment.
 */
export interface CalcState {
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
  overpaymentStartMonth: number;
  overpaymentTiming: OverpaymentTiming;
  startDate: Date;
}

export const DEFAULT_STATE: CalcState = {
  loanAmount: 320_000,
  annualRate: 6.5,
  termYears: 30,
  termExtraMonths: 0,
  monthlyPayment: 0, // auto-calculated on mount
  paymentIsManual: false,
  overpaymentType: "monthly",
  overpaymentMonthly: 200,
  overpaymentLumpSum: 10_000,
  overpaymentAnnual: 0,
  overpaymentStartMonth: 1,
  overpaymentTiming: "end",
  startDate: new Date(),
};

/** Combined loan term in months. */
export function totalTermMonths(s: CalcState): number {
  return s.termYears * 12 + s.termExtraMonths;
}
