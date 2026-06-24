"use client";

import * as React from "react";
import { ArrowLeftRight, Percent, Building2, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackLeadEvent } from "@/lib/lead-analytics";

/**
 * Balance-transfer offer cards. Visually consistent with the existing
 * AffiliateSection so the monetization block reads as one cohesive unit.
 *
 * A balance transfer in the Indian home-loan context means moving your
 * outstanding home-loan principal to another lender (SBI, HDFC, ICICI, Axis,
 * Kotak, etc.) — typically for a lower ROI, a top-up loan, or better
 * foreclosure / prepayment terms. RBI bars banks from charging prepayment
 * penalties on floating-rate home loans, so transferring is usually cheap.
 */
const BT_OFFERS = [
  {
    icon: ArrowLeftRight,
    title: "Transfer your home loan balance",
    description:
      "Move your outstanding principal to a new lender offering a lower ROI. Most banks charge no foreclosure fee on floating-rate home loans, and transfer processing fees are typically 0.25% - 0.50% of the outstanding amount.",
    cta: "Check eligibility",
    href: "#email-capture",
  },
  {
    icon: Percent,
    title: "Lower your interest rate",
    description:
      "Even a 0.25% drop in ROI on a ₹50 lakh, 20-year loan saves roughly ₹2.3 lakh in interest. Compare offers from SBI, HDFC, ICICI and Axis side by side and switch to the cheapest lender for your CIBIL band.",
    cta: "Apply now",
    href: "#email-capture",
  },
  {
    icon: Building2,
    title: "Top-up loan on balance transfer",
    description:
      "Bundle a top-up loan with your balance transfer to fund renovation, education or other goals. Top-up rates are usually 0.5% - 1% above your home-loan ROI and the interest still qualifies for Section 24(b) deduction up to ₹2 lakh.",
    cta: "Check eligibility",
    href: "#email-capture",
  },
] as const;

export function BalanceTransferSection() {
  function handleClick() {
    trackLeadEvent("affiliate_click", { affiliateId: "balance_transfer" });
    const el = document.getElementById("email-capture");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Balance transfer offers</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          If your current lender is charging 9%+ ROI on your home loan, a
          balance transfer could cut your EMI or shorten your tenure. Compare
          live offers from leading Indian banks below — moving your outstanding
          principal is often the single biggest saving available.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {BT_OFFERS.map((item) => (
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
        no extra cost to you. Balance-transfer eligibility and ROI depend on
        your CIBIL score, income and the lender's policy.
      </p>
    </section>
  );
}

export default BalanceTransferSection;
