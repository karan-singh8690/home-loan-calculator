"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  /** Short intro text always visible. */
  intro: string;
  /** Full body text shown when expanded. Rendered in the DOM at all times
   *  for SEO (not hidden from search engines) — only visually collapsed. */
  body?: string;
  /** Expand label (e.g. "और पढ़ें"). */
  expandLabel?: string;
  /** Collapse label (e.g. "कम दिखाएं"). */
  collapseLabel?: string;
  /** Number of intro lines to show before the toggle. Default 2. */
  introLines?: number;
  className?: string;
}

/**
 * Expandable text with [और पढ़ें] / [कम दिखाएं] toggle.
 *
 * SEO: The full `body` text is ALWAYS present in the server-rendered HTML
 * (inside a <div> with max-height transition). Search engines can crawl the
 * complete content — it is never conditionally hidden or removed from the DOM.
 * Only the visual height is animated via CSS for a smooth expand/collapse.
 */
export function ExpandableText({
  intro,
  body,
  expandLabel = "और पढ़ें",
  collapseLabel = "कम दिखाएं",
  className,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  if (!body) {
    // No body — just show the intro without a toggle.
    return (
      <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
        {intro}
      </p>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Intro — always visible */}
      <p className="text-xs leading-relaxed text-muted-foreground">{intro}</p>

      {/* Full body — always in the DOM for SEO, visually collapsed/expanded */}
      <div
        ref={bodyRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!expanded}
      >
        <div className="text-xs leading-relaxed text-muted-foreground/90 whitespace-pre-line pt-1">
          {body}
        </div>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 text-xs font-medium transition-colors"
        aria-expanded={expanded}
      >
        {expanded ? collapseLabel : expandLabel}
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-300",
            expanded && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}
