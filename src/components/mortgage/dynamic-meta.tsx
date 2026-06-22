"use client";

import * as React from "react";
import type { ViewMeta } from "@/lib/views";
import type { FAQ } from "@/lib/faq";

interface DynamicMetaProps {
  view: ViewMeta;
  faqs: FAQ[];
}

/**
 * Dynamically updates document metadata based on the current view — since all
 * views live on the single `/` route, we can't use Next.js per-route metadata.
 * Instead we patch <title>, meta description, canonical link, and the
 * view-specific FAQ JSON-LD on the client whenever the view changes.
 *
 * A canonical URL hint is also emitted so search engines consolidate signals
 * to the view's canonical path.
 */
export function DynamicMeta({ view, faqs }: DynamicMetaProps) {
  React.useEffect(() => {
    // Title
    document.title = view.metaTitle;

    // Meta description
    setMeta("description", view.metaDescription);

    // Canonical link
    setCanonical(view.canonical);

    // OpenGraph / Twitter updates for share previews
    setMetaProperty("og:title", view.metaTitle);
    setMetaProperty("og:description", view.metaDescription);
    setMetaProperty("og:url", `https://homeloan-calculator.example${view.canonical}`);
    setMeta("twitter:title", view.metaTitle);
    setMeta("twitter:description", view.metaDescription);

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
  }, [view, faqs]);

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
  el.setAttribute("href", `https://homeloan-calculator.example${href}`);
}
