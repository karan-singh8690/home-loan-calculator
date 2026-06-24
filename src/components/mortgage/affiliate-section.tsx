"use client";

import * as React from "react";
import { Landmark, Phone, RefreshCw, TrendingDown, ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackLeadEvent } from "@/lib/lead-analytics";
import { formatCurrency, formatDuration } from "@/lib/format";
import type { MortgageResult } from "@/lib/mortgage";
import type { Lang } from "@/lib/i18n";

/** The affiliate offer identifier used for analytics tracking. */
export type AffiliateId =
  | "compare_rates"
  | "balance_transfer"
  | "talk_to_expert"
  | "refinance";

interface AffiliateSectionProps {
  lang?: Lang;
  /** Calculator result — used to personalize the context message above offers. */
  result?: MortgageResult;
}

const AFFILIATE_LINKS = [
  {
    id: "balance_transfer" as AffiliateId,
    icon: Landmark,
    title: "Explore Balance Transfer Offers",
    description:
      "Move your outstanding principal to a lender offering a lower ROI. Most banks charge no foreclosure fee on floating-rate home loans.",
    cta: "Explore offers",
    href: "#affiliate-balance-transfer",
    isPrimary: true,
  },
  {
    id: "compare_rates" as AffiliateId,
    icon: RefreshCw,
    title: "Compare Home Loan Rates",
    description:
      "Check today's home loan interest rates from SBI, HDFC, ICICI, Axis and more. A 0.5% lower ROI can save more than prepaying.",
    cta: "Compare rates",
    href: "#affiliate-compare-rates",
    isPrimary: false,
  },
  {
    id: "talk_to_expert" as AffiliateId,
    icon: Phone,
    title: "Talk to a Loan Expert",
    description:
      "Get a free, no-obligation consultation with a home loan advisor who can structure your prepayments and check for foreclosure charges.",
    cta: "Talk to an expert",
    href: "#affiliate-loan-expert",
    isPrimary: false,
  },
  {
    id: "refinance" as AffiliateId,
    icon: TrendingDown,
    title: "Check Refinancing Savings",
    description:
      "Refinancing to a lower rate or shorter tenure might beat prepaying. Run the numbers side by side with current market offers.",
    cta: "Check savings",
    href: "#affiliate-refinance-savings",
    isPrimary: false,
  },
];

export function AffiliateSection({ lang = "en", result }: AffiliateSectionProps) {
  const isHi = lang === "hi";
  const titles = isHi
    ? ["बैलेंस ट्रांसफर विकल्प देखें", "होम लोन दरों की तुलना करें", "विशेषज्ञ से बात करें", "रिफाइनेंस बचत जांचें"]
    : AFFILIATE_LINKS.map((a) => a.title);

  // Build a personalized context message from the calculation result.
  const contextMessage = React.useMemo(() => {
    if (!result?.valid || result.totalInterestSaved <= 0) return null;
    const interest = formatCurrency(result.totalInterestSaved);
    if (result.monthsSaved > 0) {
      const time = formatDuration(result.monthsSaved);
      return isHi
        ? `आप प्रीपेमेंट से ${interest} ब्याज और ${time} अवधि बचा सकते हैं। क्या रिफाइनेंस या बैलेंस ट्रांसफर से और बचत संभव है? नीचे देखें।`
        : `You could save ${interest} in interest and ${time} in tenure by prepaying. Want to see whether refinancing or a balance transfer could save you even more? Explore your options below.`;
    }
    return isHi
      ? `आप प्रीपेमेंट से ${interest} ब्याज बचा सकते हैं। क्या रिफाइनेंस से और बचत संभव है? नीचे देखें।`
      : `You could save ${interest} in interest by prepaying. Want to see whether refinancing could save you even more? Explore your options below.`;
  }, [result, isHi]);

  // Separate primary (first) from secondary offers.
  const primary = AFFILIATE_LINKS.find((a) => a.isPrimary) ?? AFFILIATE_LINKS[0];
  const secondary = AFFILIATE_LINKS.filter((a) => a !== primary);
  const primaryIndex = AFFILIATE_LINKS.indexOf(primary);

  function handleClick(id: AffiliateId) {
    trackLeadEvent("affiliate_click", { affiliateId: id, lang });
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {isHi ? "और बचत के लिए अगले कदम" : "Next steps to save even more"}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {isHi
            ? "प्रीपेमेंट शक्तिशाली है — लेकिन कम ब्याज दर या पेशेवर सलाह से और बचत संभव है।"
            : "Prepaying is powerful — but a lower ROI or professional advice could save you even more."}
        </p>
      </div>

      {/* Personalized context message based on calculation */}
      {contextMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-600/30 bg-gradient-to-br from-emerald-50/80 to-white p-4 dark:from-emerald-950/30 dark:to-card">
          <span className="bg-emerald-600 text-white mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Sparkles className="size-4" />
          </span>
          <p className="text-sm leading-relaxed text-foreground">{contextMessage}</p>
        </div>
      )}

      {/* Primary CTA — highlighted "Best Next Step" */}
      <a
        href={primary.href}
        onClick={() => handleClick(primary.id)}
        className="group focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2"
      >
        <Card className="border-emerald-600/50 bg-gradient-to-br from-emerald-50/80 to-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:from-emerald-950/30 dark:to-card">
          <CardHeader className="pb-3">
            <div className="mb-2 flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wide">
                {isHi ? "सर्वोत्तम अगला कदम" : "Best Next Step"}
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-emerald-600 text-white flex size-12 shrink-0 items-center justify-center rounded-xl">
                <primary.icon className="size-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{titles[primaryIndex]}</CardTitle>
                <CardDescription className="mt-1 text-sm leading-relaxed">
                  {primary.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <span className="bg-emerald-600 text-white inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-emerald-700">
              {primary.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </CardContent>
        </Card>
      </a>

      {/* Secondary offers — equal weight, smaller cards */}
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
          {isHi ? "अन्य विकल्प" : "More options"}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((item) => {
            const idx = AFFILIATE_LINKS.indexOf(item);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleClick(item.id)}
                className="group focus-visible:ring-ring rounded-xl outline-none focus-visible:ring-2"
              >
                <Card className="hover:border-emerald-600/40 hover:shadow-md h-full transition-all duration-200 group-hover:-translate-y-0.5">
                  <CardHeader className="pb-2">
                    <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 mb-2 flex size-9 items-center justify-center rounded-lg">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="text-sm">{titles[idx]}</CardTitle>
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
            );
          })}
        </div>
      </div>

      {/* Disclaimer + affiliate disclosure */}
      <div className="space-y-1 border-t pt-3">
        <p className="text-muted-foreground text-[11px]">
          {isHi
            ? "एफिलिएट लिंक — यदि आप कोई ऑफर लेते हैं तो हमें कमीशन मिल सकता है, आपको कोई अतिरिक्त लागत नहीं।"
            : "Affiliate links — we may earn a commission if you take up an offer, at no extra cost to you."}
        </p>
        <p className="text-muted-foreground text-[11px] italic">
          {isHi
            ? "गणना केवल अनुमान हैं और वित्तीय सलाक नहीं हैं। वास्तविक ऋण शर्तें ऋणदाता के अनुसार भिन्न हो सकती हैं।"
            : "Calculations are estimates and do not constitute financial advice. Actual loan terms may vary by lender."}
        </p>
      </div>
    </section>
  );
}
