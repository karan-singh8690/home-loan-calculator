"use client";

import * as React from "react";
import { Download, FileText, Lock } from "lucide-react";
import type { AmortizationRow } from "@/lib/mortgage";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export interface ExportButtonsProps {
  /** The with-prepayment amortization schedule (the "active" scenario). */
  schedule: AmortizationRow[];
  /** The original (no-prepayment) schedule, for side-by-side comparison. */
  originalSchedule: AmortizationRow[];
  summary: {
    monthsSaved: number;
    totalInterestSaved: number;
    totalInterestOriginal: number;
    newPayoffDate: Date;
    originalPayoffDate: Date;
  };
}

/** Format a Date as YYYY-MM-DD so Excel parses it as a real date. */
function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format a number as a raw decimal string (no symbol, no grouping) for CSV. */
function num(n: number): string {
  // Guard against NaN / Infinity leaking into the file.
  if (!isFinite(n)) return "0.00";
  return n.toFixed(2);
}

/** Escape a CSV cell — wraps in quotes if it contains a comma, quote or newline. */
function csvCell(value: string | number): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(cells: Array<string | number>): string {
  return cells.map(csvCell).join(",");
}

/**
 * Build the full CSV export: a summary header block, the original schedule,
 * and the with-prepayment schedule. All amounts are raw decimals (no ₹ symbol)
 * so the file opens cleanly in Excel / Google Sheets.
 *
 * Exported so the lead-form success state can offer the download as a reward
 * for submitting contact details.
 */
export function buildCsv(
  schedule: AmortizationRow[],
  originalSchedule: AmortizationRow[],
  summary: ExportButtonsProps["summary"]
): string {
  // Derive the original loan principal from the first row of either schedule
  // (they both start at the same principal).
  const loanAmount =
    originalSchedule[0]?.startingBalance ?? schedule[0]?.startingBalance ?? 0;

  const lines: string[] = [];

  lines.push(csvRow(["Home Loan Overpayment Schedule Export"]));
  lines.push(csvRow(["Generated", new Date().toISOString()]));
  lines.push("");

  lines.push(csvRow(["--- Summary ---"]));
  lines.push(csvRow(["Original Loan Amount", num(loanAmount)]));
  lines.push(csvRow(["Total Interest (No Prepayment)", num(summary.totalInterestOriginal)]));
  lines.push(csvRow(["Total Interest Saved", num(summary.totalInterestSaved)]));
  lines.push(csvRow(["Months Saved", summary.monthsSaved]));
  lines.push(csvRow(["Original Payoff Date", isoDate(summary.originalPayoffDate)]));
  lines.push(csvRow(["New Payoff Date", isoDate(summary.newPayoffDate)]));
  lines.push("");

  const header = csvRow([
    "Month",
    "Starting Balance",
    "Payment",
    "Interest",
    "Principal",
    "Overpayment",
    "Ending Balance",
  ]);

  const scheduleToRows = (rows: AmortizationRow[]): string[] =>
    rows.map((r) =>
      csvRow([
        r.month,
        num(r.startingBalance),
        num(r.payment),
        num(r.interest),
        num(r.principal),
        num(r.overpayment),
        num(r.endingBalance),
      ])
    );

  lines.push(csvRow(["--- Original Schedule ---"]));
  lines.push(header);
  lines.push(...scheduleToRows(originalSchedule));
  lines.push("");

  lines.push(csvRow(["--- With-Prepayment Schedule ---"]));
  lines.push(header);
  lines.push(...scheduleToRows(schedule));

  // Leading BOM so Excel detects UTF-8 and renders cleanly.
  return "\uFEFF" + lines.join("\n");
}

/**
 * Row of export buttons shown alongside the amortization table.
 *
 * - Download CSV: works today — builds a CSV client-side and triggers a
 *   browser download via a Blob + object URL. Wrapped in try/catch with a
 *   toast on failure.
 * - Download PDF report: locked / teaser. Clicking scrolls to the
 *   `#email-capture` section and fires a toast telling the user to enter
 *   their email to unlock the premium PDF.
 */
export function ExportButtons({
  schedule,
  originalSchedule,
  summary,
}: ExportButtonsProps) {
  const { toast } = useToast();

  const handleDownloadCsv = React.useCallback(() => {
    try {
      if (schedule.length === 0 && originalSchedule.length === 0) {
        toast({
          title: "Nothing to export yet",
          description: "Enter your loan details first to generate a schedule.",
          variant: "destructive",
        });
        return;
      }

      const csv = buildCsv(schedule, originalSchedule, summary);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "home-loan-overpayment-schedule.csv";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Give the browser a tick to start the download before revoking.
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast({
        title: "CSV downloaded",
        description:
          "Open it in Excel or Google Sheets to see the full schedule.",
      });
    } catch (err) {
      toast({
        title: "Couldn't generate CSV",
        description:
          "Something went wrong building the export. Please try again.",
        variant: "destructive",
      });
    }
  }, [schedule, originalSchedule, summary, toast]);

  const handleDownloadPdf = React.useCallback(() => {
    const el = document.getElementById("email-capture");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const input = el.querySelector("input");
        input?.focus();
      }, 600);
    }
    toast({
      title: "Get your full schedule free",
      description: "Enter your email or phone below to download the complete amortization schedule.",
    });
  }, [toast]);

  const hasSchedule = schedule.length > 0 || originalSchedule.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadPdf}
        className="border-emerald-600/30 hover:border-emerald-600/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
      >
        <Download className="size-4" />
        Get full schedule (CSV)
        <Badge
          variant="secondary"
          className="ml-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
          <Lock className="size-3" />
          Free
        </Badge>
      </Button>
    </div>
  );
}

export default ExportButtons;
