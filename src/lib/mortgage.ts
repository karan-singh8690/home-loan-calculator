/**
 * Mortgage Overpayment Calculation Engine
 * ----------------------------------------
 * Pure, framework-agnostic functions for amortization and overpayment math.
 *
 * Financial model
 * ---------------
 *  - Monthly compounding: monthlyRate = annualRate / 100 / 12
 *  - Standard amortizing payment (annuity formula):
 *        P = L * r * (1+r)^n / ((1+r)^n - 1)
 *    where  L = loan principal
 *           r = monthly interest rate (decimal)
 *           n = total number of months
 *    When r == 0 the formula collapses to P = L / n.
 *
 *  - Each month the interest is charged on the current balance, the regular
 *    payment first covers that interest and the remainder reduces principal.
 *  - An overpayment is an extra amount applied directly to principal on top
 *    of the regular payment. Because it lowers principal, next month's
 *    interest is lower, so a bigger slice of the regular payment goes to
 *    principal again — this is the compounding benefit of overpaying.
 *
 * Overpayment timing
 * ------------------
 *  - "end"   : overpayment is applied AFTER the regular payment for the month
 *              (interest was charged on the full starting balance).
 *  - "start" : overpayment is applied BEFORE interest is calculated, so the
 *              interest for that month is computed on the reduced balance.
 *
 * Edge cases handled
 * ------------------
 *  - Overpayment larger than remaining balance  → clamped, loan pays off that month.
 *  - Zero overpayment                          → schedules are identical.
 *  - Payment <= interest-only amount           → warning, loan never amortizes (capped).
 *  - Invalid / missing values                  → returns { valid: false, warnings }.
 *  - Interest rate of 0%                        → linear payoff (no division by zero).
 */

export type OverpaymentType = "monthly" | "lump" | "both";
export type OverpaymentTiming = "start" | "end";

export interface MortgageInput {
  /** Loan principal in currency units (e.g. dollars). */
  loanAmount: number;
  /** Annual interest rate as a percent, e.g. 6.5 means 6.5%. */
  annualRate: number;
  /** Total loan term in months (years*12 + extra months). */
  termMonths: number;
  /** Required monthly payment (principal + interest). */
  monthlyPayment: number;
  /** Extra paid every month once overpayments begin. */
  overpaymentMonthly: number;
  /** One-time lump sum applied in the start month. */
  overpaymentLumpSum: number;
  /** Recurring extra payment applied every 12 months from the start month
   *  (e.g. an annual bonus or tax refund). 0 disables it. */
  overpaymentAnnual: number;
  /** 1-indexed month when overpayments begin. */
  overpaymentStartMonth: number;
  /** Whether the overpayment is applied at the start or end of the month. */
  overpaymentTiming: OverpaymentTiming;
  /** Reference start date of the loan (month 1). Used to compute payoff dates. */
  startDate: Date;
}

export interface AmortizationRow {
  month: number;
  startingBalance: number;
  payment: number;
  interest: number;
  principal: number;
  overpayment: number;
  endingBalance: number;
}

export interface MortgageResult {
  valid: boolean;
  warnings: string[];
  originalSchedule: AmortizationRow[];
  overpaymentSchedule: AmortizationRow[];
  originalPayoffDate: Date;
  newPayoffDate: Date;
  /** Months shaved off the original term. */
  monthsSaved: number;
  /** Sum of interest paid with no overpayments. */
  totalInterestOriginal: number;
  /** Sum of interest paid with overpayments. */
  totalInterestWithOverpayment: number;
  /** Dollar value of interest avoided (the true net saving). */
  totalInterestSaved: number;
  /** Dollar value of monthly payments no longer required = monthsSaved * monthlyPayment. */
  totalPaymentsSaved: number;
  /** Total cash outflow without overpayment (sum of payments). */
  totalPaidOriginal: number;
  /** Total cash outflow with overpayment (payments + overpayments). */
  totalPaidWithOverpayment: number;
  /** Total overpayment cash deployed. */
  totalOverpaymentDeployed: number;
  /** Effective original term in months (actual). */
  originalTermMonths: number;
  /** Effective new term in months (actual). */
  newTermMonths: number;
}

const ZERO = 0.005; // half a cent — anything below this is treated as paid off.

/**
 * Compute the standard amortizing monthly payment.
 * Returns 0 for non-positive principals or terms.
 */
export function calcMonthlyPayment(
  principal: number,
  monthlyRate: number,
  numMonths: number
): number {
  if (principal <= 0 || numMonths <= 0) return 0;
  // 0% interest → simple linear payoff, avoids 0/0 in the annuity formula.
  if (monthlyRate === 0) return principal / numMonths;
  const factor = Math.pow(1 + monthlyRate, numMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Build a full amortization schedule for a loan, optionally with overpayments.
 *
 * The schedule ends when the balance reaches ~0 or a hard safety cap is hit
 * (prevents infinite loops on degenerate inputs such as payment < interest).
 */
function buildSchedule(
  principal: number,
  monthlyRate: number,
  payment: number,
  monthlyOverpayment: number,
  lumpSum: number,
  annualOverpayment: number,
  startMonth: number,
  timing: OverpaymentTiming,
  expectedTermMonths: number
): { rows: AmortizationRow[]; capped: boolean } {
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let month = 0;
  // Safety cap: 2x the expected term, or 1200 months (100 yrs), whichever is larger.
  const hardCap = Math.max(expectedTermMonths * 2 + 12, 1200);
  let capped = false;

  while (balance > ZERO && month < hardCap) {
    month++;
    const startingBalance = balance;
    let workBalance = balance;
    let overpayment = 0;

    const hasMonthly = monthlyOverpayment > 0;
    const hasLump = lumpSum > 0;
    const hasAnnual = annualOverpayment > 0;
    const isOverpaymentMonth = month >= startMonth && (hasMonthly || hasLump || hasAnnual);

    if (isOverpaymentMonth) {
      // Compose this month's overpayment:
      //  - the recurring monthly amount (every month from startMonth)
      //  - the one-time lump sum (only in the exact startMonth)
      //  - the recurring annual amount (every 12 months from startMonth)
      let op = monthlyOverpayment;
      if (month === startMonth) op += lumpSum;
      if (hasAnnual && (month - startMonth) % 12 === 0) op += annualOverpayment;

      if (timing === "start") {
        // Apply the overpayment BEFORE interest is charged this month.
        const applied = Math.min(op, workBalance);
        overpayment = applied;
        workBalance -= applied;
      } else {
        // Tentative; will be clamped at the end of the month.
        overpayment = op;
      }
    }

    // Interest is charged on whatever balance remains (post start-of-month overpayment).
    const interest = Math.max(0, workBalance * monthlyRate);

    // Regular payment: first covers interest, the rest reduces principal.
    let paymentUsed = 0;
    let principalPaid = 0;
    if (workBalance > ZERO) {
      principalPaid = payment - interest;
      paymentUsed = payment;
      // If the payment is more than what's owed, clamp it to the exact payoff.
      if (principalPaid > workBalance) {
        principalPaid = workBalance;
        paymentUsed = principalPaid + interest;
      }
      // Guard against negative principal (payment < interest) growing the balance.
      if (principalPaid < 0) principalPaid = 0;
      workBalance -= principalPaid;
    }

    // End-of-month overpayment is applied after the regular payment.
    if (isOverpaymentMonth && timing === "end") {
      const applied = Math.min(overpayment, Math.max(0, workBalance));
      overpayment = applied;
      workBalance -= applied;
    }

    if (workBalance < ZERO) workBalance = 0;

    rows.push({
      month,
      startingBalance,
      payment: round2(paymentUsed),
      interest: round2(interest),
      principal: round2(principalPaid),
      overpayment: round2(overpayment),
      endingBalance: round2(workBalance),
    });

    balance = workBalance;

    // If principal isn't being paid down at all (interest-only or worse), bail.
    if (principalPaid === 0 && overpayment === 0 && rows.length > expectedTermMonths + 12) {
      capped = true;
      break;
    }
  }

  if (month >= hardCap) capped = true;
  return { rows, capped };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Add `months` to a date, returning a new Date on the same day-of-month (clamped). */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const day = d.getDate();
  d.setDate(1); // avoid month-overflow (e.g. Jan 31 + 1 month)
  d.setMonth(d.getMonth() + months);
  // Clamp the day back if the target month is shorter (e.g. Feb 30 → Feb 28/29).
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, maxDay));
  return d;
}

/**
 * Run the full comparison: original mortgage vs. mortgage with overpayments.
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const warnings: string[] = [];

  const {
    loanAmount,
    annualRate,
    termMonths,
    monthlyPayment,
    overpaymentMonthly,
    overpaymentLumpSum,
    overpaymentAnnual,
    overpaymentStartMonth,
    overpaymentTiming,
    startDate,
  } = input;

  // --- Validation ---------------------------------------------------------
  if (!isFinite(loanAmount) || loanAmount <= 0) {
    return emptyResult(startDate, ["Enter a loan amount greater than zero."]);
  }
  if (!isFinite(annualRate) || annualRate < 0) {
    return emptyResult(startDate, ["Enter a non-negative interest rate."]);
  }
  if (!isFinite(termMonths) || termMonths <= 0) {
    return emptyResult(startDate, ["Enter a loan term greater than zero."]);
  }
  if (!isFinite(monthlyPayment) || monthlyPayment <= 0) {
    return emptyResult(startDate, ["Enter a monthly payment greater than zero."]);
  }

  const monthlyRate = annualRate / 100 / 12;

  // Interest-only check: if the payment does not even cover the first month's
  // interest, the loan will never amortize — the balance would grow forever.
  const interestOnly = loanAmount * monthlyRate;
  if (monthlyPayment <= interestOnly + ZERO && monthlyRate > 0) {
    warnings.push(
      `Your monthly payment ($${monthlyPayment.toFixed(2)}) is at or below the ` +
        `interest-only amount ($${interestOnly.toFixed(2)}). The loan will not pay off ` +
        `with this payment — increase it to make progress on the principal.`
    );
  }

  // Sanitize overpayment inputs.
  const opMonthly = Math.max(0, isFinite(overpaymentMonthly) ? overpaymentMonthly : 0);
  const opLump = Math.max(0, isFinite(overpaymentLumpSum) ? overpaymentLumpSum : 0);
  const opAnnual = Math.max(0, isFinite(overpaymentAnnual) ? overpaymentAnnual : 0);
  const startMonth = Math.max(1, Math.min(isFinite(overpaymentStartMonth) ? Math.floor(overpaymentStartMonth) : 1, termMonths));

  // --- Build both schedules ----------------------------------------------
  const original = buildSchedule(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    0,
    0,
    0,
    1,
    "end",
    termMonths
  );

  const overpay = buildSchedule(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    opMonthly,
    opLump,
    opAnnual,
    startMonth,
    overpaymentTiming,
    termMonths
  );

  if (original.capped) {
    warnings.push(
      "The loan does not pay off within the expected term with the current payment. " +
        "Check your payment amount and interest rate."
    );
  }

  // --- Totals ------------------------------------------------------------
  const totalInterestOriginal = sum(original.rows.map((r) => r.interest));
  const totalInterestWithOverpayment = sum(overpay.rows.map((r) => r.interest));
  const totalPaidOriginal = sum(original.rows.map((r) => r.payment));
  const totalPaidWithOverpayment = sum(
    overpay.rows.map((r) => r.payment + r.overpayment)
  );
  const totalOverpaymentDeployed = sum(overpay.rows.map((r) => r.overpayment));

  const originalTermMonths = original.rows.length;
  const newTermMonths = overpay.rows.length;
  const monthsSaved = Math.max(0, originalTermMonths - newTermMonths);

  const totalInterestSaved = Math.max(0, totalInterestOriginal - totalInterestWithOverpayment);
  const totalPaymentsSaved = monthsSaved * monthlyPayment;

  const originalPayoffDate = addMonths(startDate, originalTermMonths);
  const newPayoffDate = addMonths(startDate, newTermMonths);

  // Helpful contextual warnings.
  const totalOp = opMonthly + opLump + opAnnual;
  if (totalOp === 0) {
    // No overpayment — nothing wrong, just note it.
  } else if (monthsSaved === 0) {
    warnings.push(
      "Your overpayment didn't shorten the term. It may start after the loan is already paid off, " +
        "or the amount is too small relative to the remaining balance."
    );
  }
  if (opLump >= loanAmount) {
    warnings.push(
      "Your lump sum is larger than the loan amount — it will pay off the mortgage immediately " +
        "(only the needed amount is applied)."
    );
  }

  return {
    valid: true,
    warnings,
    originalSchedule: original.rows,
    overpaymentSchedule: overpay.rows,
    originalPayoffDate,
    newPayoffDate,
    monthsSaved,
    totalInterestOriginal,
    totalInterestWithOverpayment,
    totalInterestSaved,
    totalPaymentsSaved,
    totalPaidOriginal,
    totalPaidWithOverpayment,
    totalOverpaymentDeployed,
    originalTermMonths,
    newTermMonths,
  };
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function emptyResult(startDate: Date, warnings: string[]): MortgageResult {
  return {
    valid: false,
    warnings,
    originalSchedule: [],
    overpaymentSchedule: [],
    originalPayoffDate: startDate,
    newPayoffDate: startDate,
    monthsSaved: 0,
    totalInterestOriginal: 0,
    totalInterestWithOverpayment: 0,
    totalInterestSaved: 0,
    totalPaymentsSaved: 0,
    totalPaidOriginal: 0,
    totalPaidWithOverpayment: 0,
    totalOverpaymentDeployed: 0,
    originalTermMonths: 0,
    newTermMonths: 0,
  };
}
