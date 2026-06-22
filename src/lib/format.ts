/** Formatting helpers for currency, dates and durations. */

// Indian currency formatting (₹ with lakh/crore grouping: 12,34,56,789).
const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const inrFmtCents = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

const dateFmtLong = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  year: "numeric",
});

/** ₹12,34,567 — rounded to whole rupees, good for large headline numbers. */
export function formatCurrency(n: number): string {
  if (!isFinite(n)) return "₹0";
  return inrFmt.format(n);
}

/** ₹12,34,567.89 — with paise, for amortization tables. */
export function formatCurrencyCents(n: number): string {
  if (!isFinite(n)) return "₹0.00";
  return inrFmtCents.format(n);
}

/** ₹1.2Cr / ₹34L / ₹750 — compact currency for tight spaces and badges. */
export function formatCurrencyShort(n: number): string {
  if (!isFinite(n)) return "₹0";
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n.toFixed(0)}`;
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
