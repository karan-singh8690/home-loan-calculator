"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqsForView } from "@/lib/india-faqs";
import { getHindiFaqsForType } from "@/lib/hindi-content";
import { t, type Lang } from "@/lib/i18n";

interface FaqSectionProps {
  /** View ID used to select the relevant FAQ group. */
  view: string;
  /** UI language — renders Hindi FAQs when "hi". */
  lang?: Lang;
}

export function FaqSection({ view, lang = "en" }: FaqSectionProps) {
  const faqs = React.useMemo(() => {
    if (lang === "hi") {
      // Try the Hindi library first, fall back to English.
      const hi = getHindiFaqsForType(view);
      if (hi.length > 0) return hi;
    }
    return getFaqsForView(view);
  }, [view, lang]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {t(lang, "faq.title")}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t(lang, "faq.subtitle")}
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-sm font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
