"use client";

import * as React from "react";
import { ArrowRight, TrendingDown, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatDuration } from "@/lib/format";
import { calculateMortgage, addMonths, calcMonthlyPayment } from "@/lib/mortgage";
import { INDIA_SCENARIOS } from "@/lib/india-scenarios";
import type { IndiaScenarioInput } from "@/lib/india-scenarios";
import { HINDI_SCENARIOS } from "@/lib/hindi-content";
import { t, type Lang } from "@/lib/i18n";

interface ScenarioCardsProps {
  /** Called when a user wants to load a scenario into the live calculator. */
  onLoad?: (input: IndiaScenarioInput) => void;
  lang?: Lang;
}

export function ScenarioCards({ onLoad, lang = "en" }: ScenarioCardsProps) {
  // A stable "today" for scenario payoff-date math.
  const today = React.useMemo(() => new Date(), []);
  const scenarios = lang === "hi" ? HINDI_SCENARIOS : INDIA_SCENARIOS;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {t(lang, "scenarios.title")}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t(lang, "scenarios.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scn) => {
          const result = calculateMortgage({
            ...scn.input,
            monthlyPayment: calcMonthlyPayment(
              scn.input.loanAmount,
              scn.input.annualRate / 100 / 12,
              scn.input.termMonths
            ),
            startDate: today,
          });
          return (
            <Card
              key={scn.id}
              className="hover:border-emerald-600/40 hover:shadow-md flex h-full flex-col transition-all duration-200 hover:-translate-y-0.5"
            >
              <CardHeader className="pb-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    )}
                  >
                    {scn.tag}
                  </Badge>
                </div>
                <CardTitle className="text-sm">{scn.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {scn.strategy}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <Stat
                    icon={<TrendingDown className="size-3.5" />}
                    label={t(lang, "scenarios.interestSaved")}
                    value={
                      result.valid
                        ? formatCurrency(result.totalInterestSaved)
                        : "—"
                    }
                  />
                  <Stat
                    icon={<Clock className="size-3.5" />}
                    label={t(lang, "scenarios.timeSaved")}
                    value={
                      result.valid && result.monthsSaved > 0
                        ? formatDuration(result.monthsSaved)
                        : "—"
                    }
                  />
                </div>
                {result.valid && (
                  <p className="text-muted-foreground text-[11px]">
                    {t(lang, "scenarios.paysOff")}{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(addMonths(today, result.newTermMonths))}
                    </span>{" "}
                    {t(lang, "scenarios.insteadOf")}{" "}
                    <span className="text-foreground">
                      {formatDate(addMonths(today, result.originalTermMonths))}
                    </span>
                    .
                  </p>
                )}
                {onLoad && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full"
                    onClick={() => onLoad(scn.input)}
                  >
                    {t(lang, "scenarios.loadIntoCalc")}
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-2.5">
      <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
        {value}
      </p>
    </div>
  );
}
