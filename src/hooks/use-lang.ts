"use client";

import * as React from "react";
import { parseLang, type Lang } from "@/lib/i18n";

/**
 * Language state hook for the bilingual platform.
 *
 * The current language is sourced from the `?lang=` URL param (default "en")
 * and mirrored into localStorage so the choice persists across sessions.
 * Toggling updates both the URL param and localStorage.
 */
export function useLang(): {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
} {
  const [lang, setLangState] = React.useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseLang(params.get("lang"));
    if (fromUrl === "hi") return "hi";
    // Fall back to localStorage if no URL param.
    try {
      const stored = window.localStorage.getItem("hl_lang");
      return stored === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("hl_lang", l);
      } catch {
        /* ignore quota errors */
      }
      // Mirror into the URL without a history entry or scroll.
      const params = new URLSearchParams(window.location.search);
      if (l === "en") params.delete("lang");
      else params.set("lang", "hi");
      const qs = params.toString();
      const newUrl = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
      if (newUrl !== window.location.pathname + window.location.search) {
        window.history.replaceState(null, "", newUrl);
      }
      // Update <html lang="..."> for accessibility/SEO.
      document.documentElement.lang = l === "hi" ? "hi" : "en";
    }
  }, []);

  const toggleLang = React.useCallback(() => {
    setLangState((cur) => {
      const next: Lang = cur === "en" ? "hi" : "en";
      setLang(next);
      return next;
    });
  }, [setLang]);

  // Keep <html lang> in sync on mount.
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "hi" ? "hi" : "en";
    }
  }, [lang]);

  return { lang, setLang, toggleLang };
}
