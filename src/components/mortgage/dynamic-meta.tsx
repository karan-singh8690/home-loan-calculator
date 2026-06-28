"use client";

import * as React from "react";
import { viewUrl } from "@/lib/views";
import type { ViewMeta } from "@/lib/views";
import type { FAQ } from "@/lib/faq";
import type { Lang } from "@/lib/i18n";
import { SITE_BASE_URL } from "@/lib/sitemap";

export interface HindiViewMeta {
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  canonical: string;
}

interface DynamicMetaProps {
  view: ViewMeta;
  faqs: FAQ[];
  /** Current UI language. */
  lang?: Lang;
  /** Hindi metadata override for the current view (when lang === "hi"). */
  hindiMeta?: HindiViewMeta | null;
}

/**
 * Dynamically updates document metadata based on the current view — since all
 * views live on the single `/` route, we can't use Next.js per-route metadata.
 * Instead we patch <title>, meta description, canonical link, and the
 * view-specific FAQ JSON-LD on the client whenever the view changes.
 *
 * When `lang === "hi"` and `hindiMeta` is provided, Hindi metadata and a
 * `/hi/`-prefixed canonical are emitted instead of the English defaults.
 */
export function DynamicMeta({ view, faqs, lang = "en", hindiMeta }: DynamicMetaProps) {
  const isHindi = lang === "hi" && hindiMeta;
  const metaTitle = isHindi ? hindiMeta!.metaTitle : view.metaTitle;
  const metaDescription = isHindi ? hindiMeta!.metaDescription : view.metaDescription;
  // const canonical = isHindi ? hindiMeta!.canonical : view.canonical;
  // Always emit the REAL crawlable URL as the canonical so it matches the sitemap.
  const canonical = viewUrl(view.id, lang === "hi" ? "hi" : "en");
  React.useEffect(() => {
    // Title
    document.title = metaTitle;

    // Meta description
    setMeta("description", metaDescription);

    // Canonical link
    setCanonical(canonical);

    // OpenGraph / Twitter updates for share previews
    setMetaProperty("og:title", metaTitle);
    setMetaProperty("og:description", metaDescription);
    // setMetaProperty("og:url", `https://homeloan-calculator.example${canonical}`);
    setMetaProperty("og:url", `${SITE_BASE_URL}${canonical}`);
    setMetaProperty("og:locale", lang === "hi" ? "hi_IN" : "en_IN");
    setMeta("twitter:title", metaTitle);
    setMeta("twitter:description", metaDescription);

    // View-specific FAQ JSON-LD
    let script = document.getElementById("view-faq-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "view-faq-jsonld";
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    if (faqs.length > 0) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      };
      script.textContent = JSON.stringify(jsonLd);
    } else {
      script.textContent = "";
    }
  }, [metaTitle, metaDescription, canonical, lang, faqs]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${SITE_BASE_URL}${href}`);
}
