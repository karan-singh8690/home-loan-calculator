"use client";

import * as React from "react";
import { ArrowRight, FileText, BookOpen, Calculator, Building2, Lightbulb, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HINDI_LANDING_PAGES,
  type HindiLandingPage,
} from "@/lib/hindi-content";
import type { Lang } from "@/lib/i18n";

interface HindiLandingPagesSectionProps {
  lang: Lang;
  /** Called when a user clicks a landing page link. */
  onSelect?: (page: HindiLandingPage) => void;
}

const TYPE_META: Record<
  HindiLandingPage["type"],
  { icon: typeof Calculator; label: string; color: string }
> = {
  calculator: { icon: Calculator, label: "कैलकुलेटर", color: "bg-emerald-100 text-emerald-700" },
  guide: { icon: BookOpen, label: "गाइड", color: "bg-blue-100 text-blue-700" },
  scenario: { icon: TrendingDown, label: "उदाहरण", color: "bg-purple-100 text-purple-700" },
  hinglish: { icon: Lightbulb, label: "Hinglish", color: "bg-amber-100 text-amber-700" },
  bank: { icon: Building2, label: "बैंक", color: "bg-rose-100 text-rose-700" },
};

/**
 * A browsable grid of all 50+ Hindi/Hinglish landing pages, grouped by type.
 * Acts as the programmatic content hub for SEO — each card links to a page
 * that would render at its canonical path in a full multi-route setup.
 */
export function HindiLandingPagesSection({ lang, onSelect }: HindiLandingPagesSectionProps) {
  if (lang !== "hi") return null;

  const byType = (type: HindiLandingPage["type"]) =>
    HINDI_LANDING_PAGES.filter((p) => p.type === type);

  const groups: { type: HindiLandingPage["type"]; pages: HindiLandingPage[] }[] = [
    { type: "calculator", pages: byType("calculator") },
    { type: "bank", pages: byType("bank") },
    { type: "scenario", pages: byType("scenario") },
    { type: "guide", pages: byType("guide") },
    { type: "hinglish", pages: byType("hinglish") },
  ];

  return (
    <section id="hindi-pages" className="scroll-mt-16">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <FileText className="size-5 text-emerald-600" />
          हिन्दी संसाधन — सभी पृष्ठ
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          होम लोन, EMI, प्रीपेमेंट और ब्याज बचत पर {HINDI_LANDING_PAGES.length}+ हिन्दी और Hinglish पृष्ठ।
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          if (group.pages.length === 0) return null;
          const tm = TYPE_META[group.type];
          return (
            <div key={group.type}>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                <tm.icon className="size-3.5" />
                {tm.label} ({group.pages.length})
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.pages.map((page) => (
                  <LandingPageCard key={page.id} page={page} onSelect={onSelect} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LandingPageCard({
  page,
  onSelect,
}: {
  page: HindiLandingPage;
  onSelect?: (page: HindiLandingPage) => void;
}) {
  const tm = TYPE_META[page.type];
  return (
    <button
      type="button"
      onClick={() => onSelect?.(page)}
      className="group text-left focus-visible:ring-ring rounded-xl outline-none focus-visible:ring-2"
    >
      <Card className="hover:border-emerald-600/40 hover:shadow-md h-full transition-all duration-200 group-hover:-translate-y-0.5">
        <CardHeader className="pb-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <Badge variant="secondary" className={cn("text-[10px]", tm.color)}>
              <tm.icon className="mr-1 size-3" />
              {tm.label}
            </Badge>
            <ArrowRight className="text-muted-foreground group-hover:text-emerald-600 size-3.5 transition-colors" />
          </div>
          <CardTitle className="text-sm leading-snug">{page.h1}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs leading-relaxed">
            {page.intro}
          </CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
}
