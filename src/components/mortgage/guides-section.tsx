"use client";

import * as React from "react";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GUIDES } from "@/lib/india-guides";

/**
 * Interest-saving guides section — long-form educational content for SEO.
 * Each guide is expandable to reveal its full sections.
 */
export function GuidesSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <BookOpen className="size-5 text-emerald-600" />
          Interest-saving guides
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          In-depth, India-specific guides to help you save on your home loan.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {GUIDES.map((g, i) => (
          <AccordionItem key={g.id} value={`guide-${i}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 items-center justify-between gap-3 pr-2 text-left">
                <div>
                  <p className="text-sm font-medium">{g.title}</p>
                  <p className="text-muted-foreground text-xs">{g.excerpt}</p>
                </div>
                <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-[11px]">
                  <Clock className="size-3" />
                  {g.readTime}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                {g.sections.map((s, j) => (
                  <div key={j}>
                    <p className="flex items-center gap-1 text-xs font-semibold">
                      <ChevronRight className="size-3 text-emerald-600" />
                      {s.heading}
                    </p>
                    <p className="text-muted-foreground mt-1 pl-4 text-sm leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
