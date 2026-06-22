"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqsForView } from "@/lib/india-faqs";

interface FaqSectionProps {
  /** View ID used to select the relevant FAQ group. */
  view: string;
}

export function FaqSection({ view }: FaqSectionProps) {
  const faqs = React.useMemo(() => getFaqsForView(view), [view]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Everything you might want to know about home loan prepayments and EMIs.
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
