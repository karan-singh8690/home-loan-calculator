"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ViewMeta } from "@/lib/views";

interface BreadcrumbProps {
  view: ViewMeta;
}

/**
 * Breadcrumb UI + BreadcrumbList JSON-LD schema. Updates dynamically as the
 * view changes. The JSON-LD is injected into a <script> tag so search engines
 * see the trail for each "page".
 */
export function Breadcrumb({ view }: BreadcrumbProps) {
  const items = [
    { label: "Home", href: "?tool=prepayment" },
    ...view.breadcrumbs.map((b) => ({
      label: b.label,
      href: b.view ? `?tool=${b.view}` : undefined,
    })),
  ];

  // BreadcrumbList JSON-LD.
  React.useEffect(() => {
    const itemListElement = items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: `https://homeloan-calculator.example${view.canonical}`,
    }));
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    };
    let script = document.getElementById("breadcrumb-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "breadcrumb-jsonld";
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [view]);

  return (
    <nav aria-label="Breadcrumb" className="text-muted-foreground text-xs">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {it.href && !isLast ? (
                <Link
                  href={it.href}
                  className="hover:text-foreground transition-colors"
                >
                  {it.label}
                </Link>
              ) : (
                <span className={cn(isLast && "text-foreground font-medium")}>
                  {it.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3 opacity-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
