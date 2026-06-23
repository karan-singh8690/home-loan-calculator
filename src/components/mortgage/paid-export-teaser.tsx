"use client";

import * as React from "react";
import { FileText, Lock, Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaidExportTeaserProps {
  /** Row count of the full schedule, to make the teaser feel concrete. */
  totalRows: number;
}

export function PaidExportTeaser({ totalRows }: PaidExportTeaserProps) {
  return (
    <Card className="overflow-hidden border-emerald-600/25 bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white flex size-8 items-center justify-center rounded-lg">
            <FileText className="size-4" />
          </span>
          <div>
            <CardTitle className="text-base">Unlock the full amortization schedule</CardTitle>
            <CardDescription className="text-xs">
              You're seeing the snapshot. Get every month — all {totalRows || "N"} rows — as a downloadable file.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* What's free vs locked */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-600/20 bg-white/60 p-3 dark:bg-black/10">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <Check className="size-3.5" /> Free on this page
            </p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Savings &amp; payoff-date summary</li>
              <li>• Interest &amp; payment comparison</li>
              <li>• First &amp; last rows of the schedule</li>
              <li>• Copy results to clipboard</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-600/30 bg-emerald-50/60 p-3 dark:bg-emerald-950/20">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <Lock className="size-3.5" /> Premium export
            </p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Full {totalRows || "N"}-month schedule (PDF)</li>
              <li>• Spreadsheet version (CSV / Excel)</li>
              <li>• Year-by-year interest breakdown</li>
              <li>• Compare multiple strategies side-by-side</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div>
            <p className="text-sm font-semibold">
              One-time unlock — <span className="text-emerald-700 dark:text-emerald-400">$4.99</span>
            </p>
            <p className="text-muted-foreground text-xs">
              Or get it free when you enter your email below.
            </p>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
            onClick={() => {
              const el = document.getElementById("email-capture");
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            <Lock className="size-4" />
            Unlock full schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
