/**
 * i18n helpers for the bilingual (English/Hindi) home-loan platform.
 *
 * The translation dictionary lives in `./hindi-content.ts` (TRANSLATIONS).
 * This module exposes a tiny `t(lang, key)` lookup with a graceful fallback
 * to the English value (or the key itself) so missing translations never
 * crash the UI.
 */

import { TRANSLATIONS, type Lang } from "./hindi-content";

/**
 * Translate a key for the given language.
 * Falls back to English, then to the raw key if neither is present.
 */
export function t(lang: Lang, key: string): string {
  const hi = TRANSLATIONS.hi[key];
  const en = TRANSLATIONS.en[key];
  if (lang === "hi" && hi) return hi;
  return en ?? key;
}

/** Type guard for the Lang union. */
export function isLang(v: string | null | undefined): v is Lang {
  return v === "en" || v === "hi";
}

/** Parse a `lang` value from a URL param, defaulting to "en". */
export function parseLang(v: string | null | undefined): Lang {
  return isLang(v) ? v : "en";
}

export type { Lang } from "./hindi-content";
