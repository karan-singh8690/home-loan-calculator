"use client";

import * as React from "react";
import { Landmark, Phone, RefreshCw, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AFFILIATE_LINKS = [
  {
    icon: RefreshCw,
    title: "Compare refinance rates",
    description:
      "See today's mortgage rates from multiple lenders in one place. A 0.5% lower rate can save more than overpaying.",
    cta: "Compare rates",
    href: "#affiliate-refinance",
  },
  {
    icon: Phone,
    title: "Talk to a mortgage broker",
    description:
      "Get a free, no-obligation chat with a broker who can structure your overpayments and check for early-repayment fees.",
    cta: "Find a broker",
    href: "#affiliate-broker",
  },
  {
    icon: Landmark,
    title: "See if refinancing could save more",
    description:
      "Refinancing to a shorter term or lower rate might beat overpaying. Run the numbers side by side.",
    cta: "Check refinancing",
    href: "#affiliate-refi-check",
  },
];

export function AffiliateSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Next steps to save even more</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Overpaying is powerful — but it's worth checking whether refinancing or
          professional advice could save you even more. These partners can help.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {AFFILIATE_LINKS.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group focus-visible:ring-ring rounded-xl outline-none focus-visible:ring-2"
          >
            <Card className="hover:border-emerald-600/40 hover:shadow-md h-full transition-all duration-200 group-hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 mb-2 flex size-9 items-center justify-center rounded-lg">
                  <item.icon className="size-5" />
                </div>
                <CardTitle className="text-sm">{item.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 text-sm font-medium">
                  {item.cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
      <p className="text-muted-foreground text-[11px]">
        Affiliate links — we may earn a commission if you take up an offer, at no extra cost to you.
      </p>
    </section>
  );
}
