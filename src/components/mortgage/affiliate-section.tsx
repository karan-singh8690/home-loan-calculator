"use client";

import * as React from "react";
import { Landmark, Phone, RefreshCw, TrendingDown, ArrowRight } from "lucide-react";

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
    title: "Compare Home Loan Rates",
    description:
      "Check today's home loan interest rates from SBI, HDFC, ICICI, Axis and more. A 0.5% lower ROI can save more than prepaying.",
    cta: "Compare rates",
    href: "#affiliate-compare-rates",
  },
  {
    icon: Landmark,
    title: "Explore Balance Transfer Offers",
    description:
      "Move your outstanding principal to a lender offering a lower ROI. Most banks charge no foreclosure fee on floating-rate home loans.",
    cta: "Explore offers",
    href: "#affiliate-balance-transfer",
  },
  {
    icon: Phone,
    title: "Talk to a Loan Expert",
    description:
      "Get a free, no-obligation consultation with a home loan advisor who can structure your prepayments and check for foreclosure charges.",
    cta: "Talk to an expert",
    href: "#affiliate-loan-expert",
  },
  {
    icon: TrendingDown,
    title: "Check Refinancing Savings",
    description:
      "Refinancing to a lower rate or shorter tenure might beat prepaying. Run the numbers side by side with current market offers.",
    cta: "Check savings",
    href: "#affiliate-refinance-savings",
  },
];

export function AffiliateSection({ lang = "en" }: { lang?: "en" | "hi" }) {
  const isHi = lang === "hi";
  // Hindi card labels (titles + descriptions stay English for brand clarity,
  // but headings/CTAs translate per the spec).
  const titles = isHi
    ? ["होम लोन दरों की तुलना करें", "बैलेंस ट्रांसफर विकल्प देखें", "विशेषज्ञ से बात करें", "रिफाइनेंस बचत जांचें"]
    : AFFILIATE_LINKS.map((a) => a.title);
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {isHi ? "और बचत के लिए अगले कदम" : "Next steps to save even more"}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {isHi
            ? "प्रीपेमेंट शक्तिशाली है — लेकिन कम ब्याज दर या पेशेवर सलाह से और बचत संभव है। ये पार्टनर मदद कर सकते हैं।"
            : "Prepaying is powerful — but it's worth checking whether a lower ROI or professional advice could save you even more. These partners can help."}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {AFFILIATE_LINKS.map((item, i) => (
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
                <CardTitle className="text-sm">{titles[i]}</CardTitle>
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
