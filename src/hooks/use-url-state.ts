"use client";

import * as React from "react";

/**
 * Read and write the current view + calculator inputs from the URL query
 * string, so every state is shareable via a copy-paste-able URL.
 *
 * Only the "interesting" inputs are serialised (loan, rate, years, prepayment
 * strategy) to keep URLs short. The query param `tool` selects the view.
 */

interface ShareableState {
  tool?: string;
  loan?: number;
  rate?: number;
  years?: number;
  months?: number;
  emi?: number;
  opMonthly?: number;
  opLump?: number;
  opAnnual?: number;
  opStart?: number;
  timing?: "start" | "end";
  mode?: "tenure" | "emi";
  inputMode?: "principal" | "outstanding";
  start?: string; // YYYY-MM
}

/** Parse the current URL's query string into a shareable state object. */
export function parseUrlState(): ShareableState {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: ShareableState = {};
  const tool = params.get("tool");
  if (tool) out.tool = tool;
  const num = (k: string) => {
    const v = params.get(k);
    if (v === null) return undefined;
    const n = Number(v);
    return isFinite(n) ? n : undefined;
  };
  out.loan = num("loan");
  out.rate = num("rate");
  out.years = num("years");
  out.months = num("months");
  out.emi = num("emi");
  out.opMonthly = num("opMonthly");
  out.opLump = num("opLump");
  out.opAnnual = num("opAnnual");
  out.opStart = num("opStart");
  const timing = params.get("timing");
  if (timing === "start" || timing === "end") out.timing = timing;
  const mode = params.get("mode");
  if (mode === "tenure" || mode === "emi") out.mode = mode;
  const im = params.get("inputMode");
  if (im === "principal" || im === "outstanding") out.inputMode = im;
  const start = params.get("start");
  if (start) out.start = start;
  return out;
}

/**
 * Write a shareable state to the URL (replacing history entry, no scroll).
 * Debounced by the caller via requestAnimationFrame to avoid thrashing.
 */
export function writeUrlState(state: ShareableState) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (state.tool) params.set("tool", state.tool);
  const setNum = (k: string, v: number | undefined) => {
    if (v !== undefined && isFinite(v) && v !== 0) params.set(k, String(v));
  };
  setNum("loan", state.loan);
  setNum("rate", state.rate);
  setNum("years", state.years);
  setNum("months", state.months);
  setNum("emi", state.emi);
  setNum("opMonthly", state.opMonthly);
  setNum("opLump", state.opLump);
  setNum("opAnnual", state.opAnnual);
  setNum("opStart", state.opStart);
  if (state.timing === "start") params.set("timing", "start");
  if (state.mode === "emi") params.set("mode", "emi");
  if (state.inputMode === "outstanding") params.set("inputMode", "outstanding");
  if (state.start) params.set("start", state.start);

  const qs = params.toString();
  const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  // Only update if changed, to avoid redundant history entries.
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(null, "", newUrl);
  }
}

/** React hook returning the parsed URL state on first render. */
export function useInitialUrlState(): ShareableState {
  const [state] = React.useState<ShareableState>(() => parseUrlState());
  return state;
}
