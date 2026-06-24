"use client";

import * as React from "react";
import { TrendingDown, Layers, CalendarClock, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackLeadEvent } from "@/lib/lead-analytics";

/**
 * Refinance offers — a sibling block to BalanceTransferSection, focused on
 * using a fresh home loan to restructure an existing one (lower EMI, top-up,
 * or shorter tenure). Copy is India-aware: EMI, ROI, tenure, CIBIL, Section
 * 24(b) / 80C references.
 */
const REFINANCE_OFFERS = [
  {
    icon: TrendingDown,
    title: "Refinance to a lower rate",
    description:
      "Replace your existing home loan with a new one at a cheaper ROI. A 0.5% drop on a ₹50 lakh, 20-year loan lowers your EMI by roughly ₹1,600 and saves about ₹3.9 lakh in interest over the tenure.",
    cta: "Apply now",
    href: "#email-capture",
  },
  {
    icon: Layers,
    title: "Refinance + top-up",
    description:
      "Refinance your outstanding balance and bundle a top-up loan for renovation, business or education needs. Top-up interest qualifies for Section 24(b) deduction up to ₹2 lakh when the funds go into the property.",
    cta: "Check eligibility",
    href: "#email-capture",
  },
  {
    icon: CalendarClock,
    title: "Move to a shorter tenure",
    description:
      "Keep your EMI roughly the same but refinance into a 15-year loan instead of 20. You'll pay the loan off 5 years sooner and save lakhs in interest — perfect when your income has grown since you first borrowed.",
    cta: "Apply now",
    href: "#email-capture",
  },
] as const;

export function RefinanceOffersSection() {
  function handleClick() {
    trackLeadEvent("affiliate_click", { affiliateId: "refinance" });
    const el = document.getElementById("email-capture");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Home loan refinance offers
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Refinancing replaces your current home loan with a new one — usually
          at a lower ROI — and can meaningfully cut your EMI, free up cash for a
          top-up, or let you lock in a shorter tenure. Compare offers from SBI,
          HDFC, ICICI and Axis below to see which one beats your current lender.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {REFINANCE_OFFERS.map((item) => (
          <a
            key={item.title}
            href={item.href}
            onClick={handleClick}
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
        Affiliate links — we may earn a commission if you take up an offer, at
        no extra cost to you. Final ROI and eligibility depend on your CIBIL
        score, FOIR and the lender's underwriting policy.
      </p>
    </section>
  );
}

export default RefinanceOffersSection;
