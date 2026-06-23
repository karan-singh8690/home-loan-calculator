/**
 * Lead scoring system for the home-loan calculator lead form.
 *
 * Computes an internal 0–100 score based on the prospect's outstanding
 * balance and current interest rate — the two strongest predictors of
 * refinance / balance-transfer value. The score is NOT shown to users;
 * it's stored in the DB to route high-value prospects to partners and
 * to measure lead-quality distribution in analytics.
 *
 * Scoring rules (additive, capped at 100):
 *
 *  Balance component (max 60):
 *    > ₹50 Lakh             → 60  (high value)
 *    ₹25–50 Lakh            → 40  (medium value)
 *    ₹10–25 Lakh            → 20
 *    < ₹10 Lakh             → 5   (low value)
 *
 *  Rate component (max 40):
 *    > 9.5%                 → 40  (strong refinance candidate)
 *    8.5–9.5%               → 25
 *    7.5–8.5%               → 10
 *    < 7.5%                 → 0   (already on a good rate)
 *
 * Tier buckets:
 *    score >= 70            → "high"
 *    score >= 40            → "medium"
 *    score < 40             → "low"
 */

export type LeadTier = "high" | "medium" | "low";

export interface LeadQualification {
  /** User's current outstanding balance range (from the dropdown). */
  balanceRange: string;
  /** User's current interest rate (percent). */
  interestRate?: number;
}

export interface LeadScoreResult {
  score: number;
  tier: LeadTier;
  balancePoints: number;
  ratePoints: number;
}

/** Score the balance-range component (0–60). */
function scoreBalance(range: string): number {
  const r = range.toLowerCase();
  // Order matters: check the most specific bands first.
  // More than ₹1 Crore / Above ₹1 Crore
  if (/(more than|above|>)\s*₹?\s*1\s*crore/.test(r)) return 60;
  // ₹50 Lakh–₹1 Crore band
  if (/₹?\s*50\s*lakh\s*[–\-]\s*₹?\s*1\s*crore/.test(r)) return 60;
  // ₹25–50 Lakh band
  if (/₹?\s*25\s*[–\-]\s*50\s*lakh/.test(r)) return 40;
  // ₹10–25 Lakh band
  if (/₹?\s*10\s*[–\-]\s*25\s*lakh/.test(r)) return 20;
  // Less than ₹10 Lakh
  if (/(less than|<|under)\s*₹?\s*10\s*lakh/.test(r)) return 5;
  // Fallback heuristics for slightly different phrasings.
  if (/1\s*crore/.test(r)) return 60;
  if (/50\s*lakh|50\s*l/.test(r)) return 60;
  if (/25\s*l|25-50/.test(r)) return 40;
  if (/10\s*l|10-25/.test(r)) return 20;
  return 5;
}

/** Score the interest-rate component (0–40). */
function scoreRate(rate: number | undefined): number {
  if (rate === undefined || !isFinite(rate) || rate <= 0) return 0;
  if (rate > 9.5) return 40;
  if (rate >= 8.5) return 25;
  if (rate >= 7.5) return 10;
  return 0;
}

/** Compute the full lead score and tier. */
export function scoreLead(input: LeadQualification): LeadScoreResult {
  const balancePoints = scoreBalance(input.balanceRange);
  const ratePoints = scoreRate(input.interestRate);
  const score = Math.min(100, balancePoints + ratePoints);
  const tier: LeadTier = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  return { score, tier, balancePoints, ratePoints };
}
