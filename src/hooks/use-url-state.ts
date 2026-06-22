"use client";

import * as React from "react";

/**
 * Read and write the current view + calculator inputs from the URL query
 * string, so every state is shareable via a copy-paste-able URL.
 *
 * Supports two param naming conventions:
 *  - Phase 4 (preferred): mode, amount, rate, tenureYears, tenureMonths, emi,
 *    extra, startMonth, lump, lumpMonth
 *  - Legacy: loan, years, months, opMonthly, opLump, opStart
 *
 * The Phase 4 format matches the product spec's shareable-URL examples:
 *   ?mode=monthly&amount=5000000&rate=8.5&tenureYears=20&emi=0&extra=10000&startMonth=1
 *   ?mode=lump&amount=5000000&rate=8.5&tenureYears=20&emi=0&lump=1000000&lumpMonth=24
 */

export type PrepaymentModeUrl = "monthly" | "lump" | "both";

export interface ShareableState {
  tool?: string;
  // Phase 4 params (preferred)
  mode?: PrepaymentModeUrl;
  amount?: number;
  rate?: number;
  tenureYears?: number;
  tenureMonths?: number;
  emi?: number;
  extra?: number;
  startMonth?: number;
  lump?: number;
  lumpMonth?: number;
  // Legacy params (still read for backward compat)
  loan?: number;
  years?: number;
  months?: number;
  opMonthly?: number;
  opLump?: number;
  opAnnual?: number;
  opStart?: number;
  timing?: "start" | "end";
  engineMode?: "tenure" | "emi";
  inputMode?: "principal" | "outstanding";
  start?: string; // YYYY-MM (loan start date)
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

  // Phase 4 params.
  const mode = params.get("mode");
  if (mode === "monthly" || mode === "lump" || mode === "both") out.mode = mode;
  out.amount = num("amount");
  out.rate = num("rate");
  out.tenureYears = num("tenureYears");
  out.tenureMonths = num("tenureMonths");
  out.emi = num("emi");
  out.extra = num("extra");
  out.startMonth = num("startMonth");
  out.lump = num("lump");
  out.lumpMonth = num("lumpMonth");

  // Legacy params (fallback / backward compat).
  out.loan = out.amount ?? num("loan");
  out.rate = out.rate ?? num("rate");
  out.years = out.tenureYears ?? num("years");
  out.months = out.tenureMonths ?? num("months");
  out.opMonthly = out.extra ?? num("opMonthly");
  out.opLump = out.lump ?? num("opLump");
  out.opAnnual = num("opAnnual");
  out.opStart = out.startMonth ?? out.lumpMonth ?? num("opStart");

  const timing = params.get("timing");
  if (timing === "start" || timing === "end") out.timing = timing;
  const engineMode = params.get("engineMode");
  if (engineMode === "tenure" || engineMode === "emi") out.engineMode = engineMode;
  // Legacy `mode` could also mean engine mode on old links — only treat as
  // prepayment mode when it's monthly/lump/both (handled above).
  const im = params.get("inputMode");
  if (im === "principal" || im === "outstanding") out.inputMode = im;
  const start = params.get("start");
  if (start) out.start = start;

  return out;
}

/**
 * Write a shareable state to the URL using the Phase 4 param format.
 * Replacing history entry (no scroll, no extra history stack).
 */
export function writeUrlState(state: ShareableState) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (state.tool) params.set("tool", state.tool);
  if (state.mode) params.set("mode", state.mode);
  const setNum = (k: string, v: number | undefined) => {
    if (v !== undefined && isFinite(v) && v !== 0) params.set(k, String(v));
  };
  setNum("amount", state.amount);
  setNum("rate", state.rate);
  setNum("tenureYears", state.tenureYears);
  setNum("tenureMonths", state.tenureMonths);
  setNum("emi", state.emi);
  setNum("extra", state.extra);
  setNum("startMonth", state.startMonth);
  setNum("lump", state.lump);
  setNum("lumpMonth", state.lumpMonth);
  if (state.timing === "start") params.set("timing", "start");
  if (state.engineMode === "emi") params.set("engineMode", "emi");
  if (state.inputMode === "outstanding") params.set("inputMode", "outstanding");
  if (state.start) params.set("start", state.start);

  const qs = params.toString();
  const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(null, "", newUrl);
  }
}

/** Build a shareable URL string from a state (for the Copy Share Link button). */
export function buildShareUrl(state: ShareableState): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams();
  if (state.tool) params.set("tool", state.tool);
  if (state.mode) params.set("mode", state.mode);
  const setNum = (k: string, v: number | undefined) => {
    if (v !== undefined && isFinite(v) && v !== 0) params.set(k, String(v));
  };
  setNum("amount", state.amount);
  setNum("rate", state.rate);
  setNum("tenureYears", state.tenureYears);
  setNum("tenureMonths", state.tenureMonths);
  setNum("emi", state.emi);
  setNum("extra", state.extra);
  setNum("startMonth", state.startMonth);
  setNum("lump", state.lump);
  setNum("lumpMonth", state.lumpMonth);
  if (state.timing === "start") params.set("timing", "start");
  if (state.start) params.set("start", state.start);
  const qs = params.toString();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  return qs ? `${origin}${path}?${qs}` : `${origin}${path}`;
}

/** React hook returning the parsed URL state on first render. */
export function useInitialUrlState(): ShareableState {
  const [state] = React.useState<ShareableState>(() => parseUrlState());
  return state;
}
