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

/**
 * How prepayments affect the loan:
 *  - "tenure" : EMI stays fixed; prepayments shorten the term (default, max saving).
 *  - "emi"     : term stays fixed; after each prepayment the EMI is recalculated
 *                downward so the loan still ends on the original payoff date
 *                (lower monthly burden, smaller interest saving).
 */
export type PrepaymentMode = "tenure" | "emi";

/** A scheduled lump-sum prepayment at a specific month. */
export interface LumpSumPrepayment {
  /** 1-indexed month in which this lump sum is applied. */
  month: number;
  /** Lump-sum amount applied in that month. */
  amount: number;
}

export interface MortgageInput {
  /** Loan principal in currency units. */
  loanAmount: number;
  /** Annual interest rate as a percent, e.g. 8.5 means 8.5%. */
  annualRate: number;
  /** Total loan term in months (years*12 + extra months). */
  termMonths: number;
  /** Required monthly payment (principal + interest). */
  monthlyPayment: number;
  /** Extra paid every month once overpayments begin. */
  overpaymentMonthly: number;
  /** One-time lump sum applied in the start month (legacy convenience field;
   *  merged with `lumpSums` internally). */
  overpaymentLumpSum: number;
  /** Recurring extra payment applied every 12 months from the start month
   *  (e.g. an annual bonus or tax refund). 0 disables it. */
  overpaymentAnnual: number;
  /** Additional scheduled lump-sum prepayments at arbitrary months. */
  lumpSums?: LumpSumPrepayment[];
  /** 1-indexed month when overpayments begin. */
  overpaymentStartMonth: number;
  /** Whether the overpayment is applied at the start or end of the month. */
  overpaymentTiming: OverpaymentTiming;
  /** How prepayments affect the loan (shorten term vs reduce EMI). */
  prepaymentMode?: PrepaymentMode;
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
  /** Months shaved off the original term (tenure mode). 0 in EMI mode. */
  monthsSaved: number;
  /** Sum of interest paid with no overpayments. */
  totalInterestOriginal: number;
  /** Sum of interest paid with overpayments. */
  totalInterestWithOverpayment: number;
  /** Value of interest avoided (the true net saving). */
  totalInterestSaved: number;
  /** Value of monthly payments no longer required = monthsSaved * monthlyPayment. */
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
  /** Which prepayment mode was used. */
  prepaymentMode: PrepaymentMode;
  /** In EMI mode: the final (lowest) EMI after all prepayments. */
  finalEMI: number;
  /** In EMI mode: how much the EMI dropped from the original. */
  emiReduction: number;
  /** In EMI mode: total interest saved (smaller than tenure mode). */
  emiModeInterestSaved: number;
  /** The alternate-mode result for side-by-side comparison (computed when
   *  the caller requests it via `compareBoth`). Null otherwise. */
  comparison?: {
    mode: PrepaymentMode;
    totalInterestSaved: number;
    monthsSaved: number;
    emiReduction: number;
    newTermMonths: number;
    finalEMI: number;
  };
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
 * This is the TENURE-REDUCTION builder: the EMI stays fixed at `payment` and
 * prepayments shorten the term.
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
  lumpSums: LumpSumPrepayment[],
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
  // Lookup of extra lump sums by month for O(1) access.
  const lumpByMonth = new Map<number, number>();
  for (const ls of lumpSums) {
    if (ls.amount > 0) {
      lumpByMonth.set(ls.month, (lumpByMonth.get(ls.month) ?? 0) + ls.amount);
    }
  }

  while (balance > ZERO && month < hardCap) {
    month++;
    const startingBalance = balance;
    let workBalance = balance;
    let overpayment = 0;

    const hasMonthly = monthlyOverpayment > 0;
    const hasLump = lumpSum > 0;
    const hasAnnual = annualOverpayment > 0;
    const extraLumpThisMonth = lumpByMonth.get(month) ?? 0;
    const isOverpaymentMonth =
      month >= startMonth && (hasMonthly || hasLump || hasAnnual || extraLumpThisMonth > 0);

    if (isOverpaymentMonth) {
      // Compose this month's overpayment:
      //  - the recurring monthly amount (every month from startMonth)
      //  - the one-time lump sum (only in the exact startMonth)
      //  - the recurring annual amount (every 12 months from startMonth)
      //  - any extra scheduled lump sums for this exact month
      let op = monthlyOverpayment;
      if (month === startMonth) op += lumpSum;
      if (hasAnnual && (month - startMonth) % 12 === 0) op += annualOverpayment;
      op += extraLumpThisMonth;

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

/**
 * Build an EMI-REDUCTION schedule.
 *
 * In this mode the loan's TARGET payoff date is fixed at the original term.
 * After each prepayment, the EMI is recalculated downward so that the
 * remaining balance amortises to zero by the original payoff month. This
 * lowers the monthly burden (cash-flow benefit) but saves less interest
 * than tenure reduction, because the smaller EMI pays principal more slowly.
 *
 * Recalculation rule: after the prepayment in month M is applied and the
 * ending balance is known, the EMI for months M+1 .. N is recomputed as the
 * amortizing payment on (endingBalance, monthlyRate, N - M). The EMI therefore
 * steps down at each prepayment event and stays constant between events.
 */
function buildEmiReductionSchedule(
  principal: number,
  monthlyRate: number,
  initialPayment: number,
  monthlyOverpayment: number,
  lumpSum: number,
  annualOverpayment: number,
  lumpSums: LumpSumPrepayment[],
  startMonth: number,
  timing: OverpaymentTiming,
  originalTermMonths: number
): { rows: AmortizationRow[]; capped: boolean; finalEMI: number } {
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let emi = initialPayment;
  let month = 0;
  const hardCap = Math.max(originalTermMonths + 12, 1200);
  let capped = false;

  const lumpByMonth = new Map<number, number>();
  for (const ls of lumpSums) {
    if (ls.amount > 0) {
      lumpByMonth.set(ls.month, (lumpByMonth.get(ls.month) ?? 0) + ls.amount);
    }
  }

  while (balance > ZERO && month < hardCap) {
    month++;
    // Stop if we've reached the original payoff month — in EMI mode the loan
    // must end on schedule. If there's still a tiny balance, clear it.
    if (month > originalTermMonths) {
      // Final tidy-up: pay off the residual with the last EMI.
      break;
    }

    const startingBalance = balance;
    let workBalance = balance;
    let overpayment = 0;

    const hasMonthly = monthlyOverpayment > 0;
    const hasLump = lumpSum > 0;
    const hasAnnual = annualOverpayment > 0;
    const extraLumpThisMonth = lumpByMonth.get(month) ?? 0;
    const isOverpaymentMonth =
      month >= startMonth && (hasMonthly || hasLump || hasAnnual || extraLumpThisMonth > 0);

    if (isOverpaymentMonth) {
      let op = monthlyOverpayment;
      if (month === startMonth) op += lumpSum;
      if (hasAnnual && (month - startMonth) % 12 === 0) op += annualOverpayment;
      op += extraLumpThisMonth;

      if (timing === "start") {
        const applied = Math.min(op, workBalance);
        overpayment = applied;
        workBalance -= applied;
      } else {
        overpayment = op;
      }
    }

    const interest = Math.max(0, workBalance * monthlyRate);

    let paymentUsed = 0;
    let principalPaid = 0;
    if (workBalance > ZERO) {
      principalPaid = emi - interest;
      paymentUsed = emi;
      // On the final month, clamp the payment to exactly clear the balance.
      if (month === originalTermMonths || principalPaid > workBalance) {
        principalPaid = workBalance;
        paymentUsed = principalPaid + interest;
      }
      if (principalPaid < 0) principalPaid = 0;
      workBalance -= principalPaid;
    }

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

    // After a prepayment, recompute the EMI for the remaining months so the
    // loan still ends on the original payoff date.
    const remainingMonths = originalTermMonths - month;
    if (remainingMonths > 0 && balance > ZERO) {
      const newEmi = calcMonthlyPayment(balance, monthlyRate, remainingMonths);
      if (isFinite(newEmi) && newEmi > 0) {
        emi = newEmi;
      }
    } else if (remainingMonths <= 0) {
      // Loan should be done; force payoff.
      break;
    }
  }

  if (month >= hardCap) capped = true;
  // The final EMI is the last computed emi (the lowest point reached).
  const finalEMI = emi;
  return { rows, capped, finalEMI };
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
 * Run the full comparison: original mortgage vs. mortgage with prepayments.
 *
 * `prepaymentMode` selects how prepayments affect the loan:
 *  - "tenure" (default): EMI fixed, term shortens.
 *  - "emi"             : term fixed, EMI reduces after each prepayment.
 *
 * When `compareBoth` is true, the result also includes a `comparison` object
 * with the alternate mode's headline numbers, so the UI can render a
 * side-by-side "Reduce EMI vs Reduce Tenure" view without a second call.
 */
export function calculateMortgage(
  input: MortgageInput,
  options?: { compareBoth?: boolean }
): MortgageResult {
  const warnings: string[] = [];

  const {
    loanAmount,
    annualRate,
    termMonths,
    monthlyPayment,
    overpaymentMonthly,
    overpaymentLumpSum,
    overpaymentAnnual,
    lumpSums,
    overpaymentStartMonth,
    overpaymentTiming,
    startDate,
  } = input;
  const mode: PrepaymentMode = input.prepaymentMode ?? "tenure";

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
      `Your EMI (${monthlyPayment.toFixed(2)}) is at or below the ` +
        `interest-only amount (${interestOnly.toFixed(2)}). The loan will not pay off ` +
        `with this payment — increase it to make progress on the principal.`
    );
  }

  // Sanitize overpayment inputs.
  const opMonthly = Math.max(0, isFinite(overpaymentMonthly) ? overpaymentMonthly : 0);
  const opLump = Math.max(0, isFinite(overpaymentLumpSum) ? overpaymentLumpSum : 0);
  const opAnnual = Math.max(0, isFinite(overpaymentAnnual) ? overpaymentAnnual : 0);
  const sanitizedLumpSums: LumpSumPrepayment[] = (lumpSums ?? [])
    .filter((ls) => isFinite(ls.month) && isFinite(ls.amount) && ls.amount > 0)
    .map((ls) => ({ month: Math.max(1, Math.floor(ls.month)), amount: ls.amount }));
  const startMonth = Math.max(1, Math.min(isFinite(overpaymentStartMonth) ? Math.floor(overpaymentStartMonth) : 1, termMonths));

  // --- Build both schedules ----------------------------------------------
  // The original (no-prepayment) schedule is always a tenure-style fixed-EMI
  // amortization — it represents the loan as written.
  const original = buildSchedule(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    0,
    0,
    0,
    [],
    1,
    "end",
    termMonths
  );

  // Build the schedule for the selected prepayment mode.
  let overpayRows: AmortizationRow[];
  let finalEMI = monthlyPayment;
  if (mode === "emi") {
    const emiRes = buildEmiReductionSchedule(
      loanAmount,
      monthlyRate,
      monthlyPayment,
      opMonthly,
      opLump,
      opAnnual,
      sanitizedLumpSums,
      startMonth,
      overpaymentTiming,
      termMonths
    );
    overpayRows = emiRes.rows;
    finalEMI = emiRes.finalEMI;
  } else {
    const tenureRes = buildSchedule(
      loanAmount,
      monthlyRate,
      monthlyPayment,
      opMonthly,
      opLump,
      opAnnual,
      sanitizedLumpSums,
      startMonth,
      overpaymentTiming,
      termMonths
    );
    overpayRows = tenureRes.rows;
    if (original.capped) {
      warnings.push(
        "The loan does not pay off within the expected term with the current EMI. " +
          "Check your EMI amount and interest rate."
      );
    }
  }

  // --- Totals ------------------------------------------------------------
  const totalInterestOriginal = sum(original.rows.map((r) => r.interest));
  const totalInterestWithOverpayment = sum(overpayRows.map((r) => r.interest));
  const totalPaidOriginal = sum(original.rows.map((r) => r.payment));
  const totalPaidWithOverpayment = sum(
    overpayRows.map((r) => r.payment + r.overpayment)
  );
  const totalOverpaymentDeployed = sum(overpayRows.map((r) => r.overpayment));

  const originalTermMonths = original.rows.length;
  const newTermMonths = overpayRows.length;
  const monthsSaved = Math.max(0, originalTermMonths - newTermMonths);

  const totalInterestSaved = Math.max(0, totalInterestOriginal - totalInterestWithOverpayment);
  const totalPaymentsSaved = monthsSaved * monthlyPayment;
  const emiReduction = Math.max(0, monthlyPayment - finalEMI);

  const originalPayoffDate = addMonths(startDate, originalTermMonths);
  const newPayoffDate = addMonths(startDate, newTermMonths);

  // Helpful contextual warnings.
  const totalOp = opMonthly + opLump + opAnnual + sum(sanitizedLumpSums.map((ls) => ls.amount));
  if (totalOp === 0) {
    // No overpayment — nothing wrong, just note it.
  } else if (mode === "tenure" && monthsSaved === 0) {
    warnings.push(
      "Your prepayment didn't shorten the term. It may start after the loan is already paid off, " +
        "or the amount is too small relative to the remaining balance."
    );
  }
  if (opLump >= loanAmount) {
    warnings.push(
      "Your lump sum is larger than the loan amount — it will pay off the loan immediately " +
        "(only the needed amount is applied)."
    );
  }

  // --- Optional alternate-mode comparison --------------------------------
  let comparison: MortgageResult["comparison"];
  if (options?.compareBoth) {
    if (mode === "tenure") {
      // Compute EMI-mode numbers.
      const alt = buildEmiReductionSchedule(
        loanAmount,
        monthlyRate,
        monthlyPayment,
        opMonthly,
        opLump,
        opAnnual,
        sanitizedLumpSums,
        startMonth,
        overpaymentTiming,
        termMonths
      );
      const altInterest = sum(alt.rows.map((r) => r.interest));
      comparison = {
        mode: "emi",
        totalInterestSaved: Math.max(0, totalInterestOriginal - altInterest),
        monthsSaved: 0, // EMI mode keeps the original term
        emiReduction: Math.max(0, monthlyPayment - alt.finalEMI),
        newTermMonths: alt.rows.length,
        finalEMI: alt.finalEMI,
      };
    } else {
      // Compute tenure-mode numbers.
      const alt = buildSchedule(
        loanAmount,
        monthlyRate,
        monthlyPayment,
        opMonthly,
        opLump,
        opAnnual,
        sanitizedLumpSums,
        startMonth,
        overpaymentTiming,
        termMonths
      );
      const altInterest = sum(alt.rows.map((r) => r.interest));
      const altMonthsSaved = Math.max(0, originalTermMonths - alt.rows.length);
      comparison = {
        mode: "tenure",
        totalInterestSaved: Math.max(0, totalInterestOriginal - altInterest),
        monthsSaved: altMonthsSaved,
        emiReduction: 0,
        newTermMonths: alt.rows.length,
        finalEMI: monthlyPayment,
      };
    }
  }

  return {
    valid: true,
    warnings,
    originalSchedule: original.rows,
    overpaymentSchedule: overpayRows,
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
    prepaymentMode: mode,
    finalEMI,
    emiReduction,
    emiModeInterestSaved: mode === "emi" ? totalInterestSaved : 0,
    comparison,
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
    prepaymentMode: "tenure",
    finalEMI: 0,
    emiReduction: 0,
    emiModeInterestSaved: 0,
  };
}
