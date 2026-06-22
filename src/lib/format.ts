/** Formatting helpers for currency, dates and durations. */

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyFmtCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const dateFmtLong = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

/** $1,234 — rounded to whole dollars, good for large headline numbers. */
export function formatCurrency(n: number): string {
  if (!isFinite(n)) return "$0";
  return currencyFmt.format(n);
}

/** $1,234.56 — with cents, for amortization tables. */
export function formatCurrencyCents(n: number): string {
  if (!isFinite(n)) return "$0.00";
  return currencyFmtCents.format(n);
}

/** $1.2M / $340K style compact currency for tight spaces. */
export function formatCurrencyShort(n: number): string {
  if (!isFinite(n)) return "$0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

/** "Jan 2031" */
export function formatDate(date: Date): string {
  return dateFmt.format(date);
}

/** "January 2031" */
export function formatDateLong(date: Date): string {
  return dateFmtLong.format(date);
}

/**
 * Humanise a month count as "X years, Y months" (omitting zero parts).
 * Returns "0 months" only when both are zero.
 */
export function formatDuration(totalMonths: number): string {
  if (!isFinite(totalMonths) || totalMonths <= 0) return "0 months";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  return parts.length ? parts.join(", ") : "0 months";
}
