"use client";

import * as React from "react";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";

interface LanguageSwitcherProps {
  lang: Lang;
  onToggle: () => void;
  className?: string;
}

/**
 * A compact English | हिन्दी toggle that preserves the current page, inputs,
 * URL params, and calculation results (the parent just swaps the `lang`
 * state — no navigation occurs).
 */
export function LanguageSwitcher({ lang, onToggle, className }: LanguageSwitcherProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted",
        className
      )}
      aria-label={lang === "en" ? "हिन्दी में देखें" : "View in English"}
      title={lang === "en" ? "हिन्दी में देखें" : "View in English"}
    >
      <Languages className="size-3.5 text-emerald-600" />
      <span className={cn(lang === "en" && "text-foreground", lang === "hi" && "text-muted-foreground")}>
        English
      </span>
      <span className="text-muted-foreground">|</span>
      <span className={cn(lang === "hi" && "text-foreground", lang === "en" && "text-muted-foreground")}>
        हिन्दी
      </span>
    </button>
  );
}
