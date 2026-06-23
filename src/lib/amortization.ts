/**
 * Amortization facade for the India Home Loan Prepayment Calculator.
 * --------------------------------------------------------------------
 *
 * This module is the canonical calculation API for Phase 4. It reuses the
 * proven, edge-case-tested engine in `./mortgage.ts` (do not rebuild that
 * math) and presents it under the function names the product spec calls for:
 *
 *   - calculateEMI()
 *   - generateBaselineSchedule()
 *   - generateMonthlyExtraSchedule()
 *   - generateLumpSumSchedule()
 *   - compareSchedules()
 *
 * V1 is reduce-tenure only (EMI fixed, prepayments shorten the term). The
 * underlying engine already supports a reduce-EMI mode for future phases —
 * it is simply not exposed here yet.
 */

import {
  calcMonthlyPayment,
  calculateMortgage,
  addMonths,
  type AmortizationRow,
  type MortgageInput,
  type MortgageResult,
  type OverpaymentTiming,
} from "./mortgage";

/** Core loan parameters shared by every schedule function. */
export interface LoanParams {
  loanAmount: number;
  annualRate: number;
  tenureMonths: number;
  /** Optional manual EMI. If 0/blank, the EMI is auto-calculated. */
  emi?: number;
  /** Loan start date (month 1). Defaults to today. */
  startDate?: Date;
}

/** The comparison result returned by `compareSchedules`. */
export interface ScheduleComparison {
  valid: boolean;
  warnings: string[];
  /** Full no-prepayment schedule (for CSV/PDF export). */
  baselineSchedule: AmortizationRow[];
  /** Full with-prepayment schedule. */
  prepaymentSchedule: AmortizationRow[];
  originalPayoffDate: Date;
  newPayoffDate: Date;
  interestSaved: number;
  monthsSaved: number;
  /** Percentage reduction in total interest (0–100). */
  effectiveSavingsPct: number;
  totalInterestOriginal: number;
  totalInterestWithPrepayment: number;
  totalPaidOriginal: number;
  totalPaidWithPrepayment: number;
  totalOverpaymentDeployed: number;
  originalTermMonths: number;
  newTermMonths: number;
  /** First 12 rows of the with-prepayment schedule (for the lead report). */
  first12Rows: AmortizationRow[];
  /** Last 12 rows of the with-prepayment schedule (for the lead report). */
  last12Rows: AmortizationRow[];
  /** The underlying engine result (for advanced UI components). */
  result: MortgageResult;
}

const DEFAULT_TIMING: OverpaymentTiming = "end";

/**
 * Calculate the standard amortizing EMI (Equal Monthly Installment).
 *
 *   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 *
 * where P = principal, r = monthly rate, n = tenure in months.
 * Returns 0 for non-positive principal or tenure; handles 0% interest.
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  return calcMonthlyPayment(principal, monthlyRate, tenureMonths);
}

/**
 * Generate the baseline (no-prepayment) amortization schedule.
 * The EMI is fixed for the entire tenure; interest reduces each month.
 */
export function generateBaselineSchedule(params: LoanParams): AmortizationRow[] {
  const { loanAmount, annualRate, tenureMonths, startDate = new Date() } = params;
  const emi = resolveEMI(params);
  const result = calculateMortgage({
    loanAmount,
    annualRate,
    termMonths: tenureMonths,
    monthlyPayment: emi,
    overpaymentMonthly: 0,
    overpaymentLumpSum: 0,
    overpaymentAnnual: 0,
    overpaymentStartMonth: 1,
    overpaymentTiming: DEFAULT_TIMING,
    prepaymentMode: "tenure",
    startDate,
  });
  return result.originalSchedule;
}

/**
 * Generate a schedule with a monthly extra EMI (prepayment) starting from
 * `startMonth`. The contractual EMI stays fixed; the extra amount goes
 * straight to principal each month, shortening the tenure.
 *
 * Example: EMI ₹45,000 + extra ₹10,000 → effective outflow ₹55,000/month.
 */
export function generateMonthlyExtraSchedule(
  params: LoanParams,
  extraAmount: number,
  startMonth: number
): AmortizationRow[] {
  const { loanAmount, annualRate, tenureMonths, startDate = new Date() } = params;
  const emi = resolveEMI(params);
  const result = calculateMortgage({
    loanAmount,
    annualRate,
    termMonths: tenureMonths,
    monthlyPayment: emi,
    overpaymentMonthly: Math.max(0, extraAmount),
    overpaymentLumpSum: 0,
    overpaymentAnnual: 0,
    overpaymentStartMonth: Math.max(1, Math.floor(startMonth)),
    overpaymentTiming: DEFAULT_TIMING,
    prepaymentMode: "tenure",
    startDate,
  });
  return result.overpaymentSchedule;
}

/**
 * Generate a schedule with a single lump-sum prepayment applied after
 * `lumpMonth` months. The outstanding principal drops at that point and
 * the same EMI continues, reducing the tenure.
 */
export function generateLumpSumSchedule(
  params: LoanParams,
  lumpSum: number,
  lumpMonth: number
): AmortizationRow[] {
  const { loanAmount, annualRate, tenureMonths, startDate = new Date() } = params;
  const emi = resolveEMI(params);
  const result = calculateMortgage({
    loanAmount,
    annualRate,
    termMonths: tenureMonths,
    monthlyPayment: emi,
    overpaymentMonthly: 0,
    overpaymentLumpSum: Math.max(0, lumpSum),
    overpaymentAnnual: 0,
    overpaymentStartMonth: Math.max(1, Math.floor(lumpMonth)),
    overpaymentTiming: DEFAULT_TIMING,
    prepaymentMode: "tenure",
    startDate,
  });
  return result.overpaymentSchedule;
}

/**
 * Run the full comparison: baseline (no prepayment) vs. with-prepayment,
 * returning headline savings plus first-12 / last-12 row snapshots for the
 * lead-generation report.
 *
 * `prepayment` describes the strategy — either monthly extra, lump sum, or
 * both. The engine reuses `calculateMortgage` so all edge cases (overpayment
 * larger than balance, zero prepayment, EMI ≤ interest-only) are handled.
 */
export function compareSchedules(
  params: LoanParams,
  prepayment: {
    monthlyExtra?: number;
    lumpSum?: number;
    /** Absolute EMI month to begin monthly extras / apply the lump sum. */
    startMonth?: number;
    /** Separate month for the lump sum (defaults to startMonth). */
    lumpMonth?: number;
    timing?: OverpaymentTiming;
  }
): ScheduleComparison {
  const { loanAmount, annualRate, tenureMonths, startDate = new Date() } = params;
  const emi = resolveEMI(params);
  const monthlyExtra = Math.max(0, prepayment.monthlyExtra ?? 0);
  const lump = Math.max(0, prepayment.lumpSum ?? 0);
  const startMonth = Math.max(1, Math.floor(prepayment.startMonth ?? 1));
  const lumpMonth = Math.max(1, Math.floor(prepayment.lumpMonth ?? startMonth));
  const timing = prepayment.timing ?? DEFAULT_TIMING;

  // The legacy engine applies the lump sum in `overpaymentStartMonth`. When
  // monthly extras and the lump sum start in different months, we pass the
  // monthly start via `overpaymentStartMonth` and the lump via the `lumpSums`
  // array at its own month — so both can land independently.
  const input: MortgageInput = {
    loanAmount,
    annualRate,
    termMonths: tenureMonths,
    monthlyPayment: emi,
    overpaymentMonthly: monthlyExtra,
    overpaymentLumpSum: lumpMonth === startMonth ? lump : 0,
    overpaymentAnnual: 0,
    lumpSums: lumpMonth !== startMonth && lump > 0 ? [{ month: lumpMonth, amount: lump }] : [],
    overpaymentStartMonth: startMonth,
    overpaymentTiming: timing,
    prepaymentMode: "tenure", // V1: reduce tenure only
    startDate,
  };

  const result = calculateMortgage(input);
  const prepaymentSchedule = result.overpaymentSchedule;

  const totalInterestOriginal = result.totalInterestOriginal;
  const totalInterestWithPrepayment = result.totalInterestWithOverpayment;
  const interestSaved = result.totalInterestSaved;
  const effectiveSavingsPct =
    totalInterestOriginal > 0
      ? (interestSaved / totalInterestOriginal) * 100
      : 0;

  return {
    valid: result.valid,
    warnings: result.warnings,
    baselineSchedule: result.originalSchedule,
    prepaymentSchedule,
    originalPayoffDate: result.originalPayoffDate,
    newPayoffDate: result.newPayoffDate,
    interestSaved,
    monthsSaved: result.monthsSaved,
    effectiveSavingsPct,
    totalInterestOriginal,
    totalInterestWithPrepayment,
    totalPaidOriginal: result.totalPaidOriginal,
    totalPaidWithPrepayment: result.totalPaidWithOverpayment,
    totalOverpaymentDeployed: result.totalOverpaymentDeployed,
    originalTermMonths: result.originalTermMonths,
    newTermMonths: result.newTermMonths,
    first12Rows: prepaymentSchedule.slice(0, 12),
    last12Rows: prepaymentSchedule.slice(-12),
    result,
  };
}

/** Resolve the EMI to use: user-entered if > 0, else auto-calculated. */
function resolveEMI(params: LoanParams): number {
  if (params.emi && params.emi > 0) return params.emi;
  return calculateEMI(params.loanAmount, params.annualRate, params.tenureMonths);
}

export { addMonths };
export type { AmortizationRow, MortgageResult };
