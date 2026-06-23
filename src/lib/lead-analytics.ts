"use client";

/**
 * Lightweight client-side analytics for the lead funnel.
 *
 * Tracks form impressions, starts, completions, and affiliate click-throughs
 * using a simple localStorage event log. In production this would be wired to
 * GA4 / Mixpanel / PostHog — the interface here keeps the call sites clean
 * and the events structured so swapping the backend is a one-line change.
 *
 * Events are also dispatched as CustomEvents on `window` so any analytics
 * listener (or a future real provider) can pick them up.
 */

export type LeadEvent =
  | "lead_form_impression"
  | "lead_form_start"
  | "lead_form_complete"
  | "lead_form_error"
  | "affiliate_click";

interface EventPayload {
  event: LeadEvent;
  leadTier?: string;
  leadScore?: number;
  affiliateId?: string;
  view?: string;
  lang?: string;
  ts?: number;
}

const LOG_KEY = "hl_lead_events";
const MAX_LOG = 100;

function readLog(): EventPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as EventPayload[]) : [];
  } catch {
    return [];
  }
}

function writeLog(events: EventPayload[]) {
  if (typeof window === "undefined") return;
  try {
    // Keep only the most recent MAX_LOG events.
    const trimmed = events.slice(-MAX_LOG);
    window.localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore quota errors */
  }
}

/**
 * Track a lead-funnel event. Safe to call from any client component; no-ops
 * on the server and never throws.
 */
export function trackLeadEvent(event: LeadEvent, payload: Partial<EventPayload> = {}) {
  if (typeof window === "undefined") return;
  const full: EventPayload = { event, ts: Date.now(), ...payload };
  // Persist to localStorage for a simple conversion-rate read-out.
  const log = readLog();
  log.push(full);
  writeLog(log);
  // Dispatch a CustomEvent so external analytics listeners can react.
  window.dispatchEvent(new CustomEvent("hl:analytics", { detail: full }));
  // Console log in dev for debugging.
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", full);
  }
}

/** Compute the form conversion rate from the local event log. */
export function getLeadConversionRate(): {
  impressions: number;
  starts: number;
  completions: number;
  conversionRate: number;
} {
  const log = readLog();
  const impressions = log.filter((e) => e.event === "lead_form_impression").length;
  const starts = log.filter((e) => e.event === "lead_form_start").length;
  const completions = log.filter((e) => e.event === "lead_form_complete").length;
  const conversionRate = impressions > 0 ? (completions / impressions) * 100 : 0;
  return { impressions, starts, completions, conversionRate };
}
