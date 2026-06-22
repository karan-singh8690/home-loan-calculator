"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyCents } from "@/lib/format";
import type { AmortizationRow, MortgageResult } from "@/lib/mortgage";

interface AmortizationTableProps {
  result: MortgageResult;
  /**
   * "full"    : 7-col detailed view (Starting balance, Payment, Interest,
   *             Principal, Overpayment, Ending balance).
   * "compact" : 6-col India prepayment view (Month, EMI, Interest, Principal,
   *             Prepayment, Balance).
   * "preview" : Phase 4 spec view — 6 first + 6 last rows, 7 cols:
   *             Month, Opening Balance, EMI, Interest, Principal, Prepayment,
   *             Closing Balance.
   */
  variant?: "full" | "compact" | "preview";
}

const PREVIEW_HEAD = 6;
const PREVIEW_TAIL = 6;
const SNAPSHOT_HEAD = 4;
const SNAPSHOT_TAIL = 4;

export function AmortizationTable({
  result,
  variant = "full",
}: AmortizationTableProps) {
  const schedule = result.overpaymentSchedule;

  if (!result.valid || schedule.length === 0) {
    return null;
  }

  const isPreview = variant === "preview";
  const isCompact = variant === "compact";
  const headCount = isPreview ? PREVIEW_HEAD : SNAPSHOT_HEAD;
  const tailCount = isPreview ? PREVIEW_TAIL : SNAPSHOT_TAIL;

  // Build a snapshot: first N rows, then "..." if there's a gap, then last N rows.
  const head = schedule.slice(0, headCount);
  const tail = schedule.slice(-tailCount);
  const hasGap = schedule.length > headCount + tailCount;
  const colCount = isCompact ? 6 : 7;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm">
              {isPreview ? "Amortization preview" : "Amortization snapshot"}
            </CardTitle>
            <CardDescription className="text-xs">
              Your home loan with prepayments applied — first {headCount} and final {tailCount} months.
            </CardDescription>
          </div>
          <span className="text-muted-foreground text-xs">
            {schedule.length} monthly rows total
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="h-8 px-2 text-[11px] font-semibold">Month</TableHead>
                {isCompact ? null : (
                  <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                    {isPreview ? "Opening Balance" : "Starting balance"}
                  </TableHead>
                )}
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  EMI
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Interest
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Principal
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Prepayment
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  {isPreview ? "Closing Balance" : "Ending balance"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {head.map((row, i) => (
                <Row
                  key={`h-${row.month}`}
                  row={row}
                  zebra={i % 2 === 1}
                  compact={isCompact}
                />
              ))}
              {hasGap && (
                <TableRow>
                  <TableCell
                    colSpan={colCount}
                    className="text-muted-foreground h-8 px-2 text-center text-[11px] italic"
                  >
                    … {schedule.length - headCount - tailCount} months in between …
                  </TableCell>
                </TableRow>
              )}
              {tail.map((row, i) => (
                <Row
                  key={`t-${row.month}`}
                  row={row}
                  zebra={i % 2 === 1}
                  compact={isCompact}
                  highlightFinal={row === tail[tail.length - 1]}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  row,
  highlightFinal,
  zebra,
  compact,
}: {
  row: AmortizationRow;
  highlightFinal?: boolean;
  zebra?: boolean;
  compact?: boolean;
}) {
  return (
    <TableRow
      className={
        highlightFinal
          ? "bg-emerald-50/60 hover:bg-emerald-100/60 dark:bg-emerald-950/20 [&_td]:font-medium"
          : zebra
            ? "hover:bg-muted/40 bg-muted/20"
            : "hover:bg-muted/40"
      }
    >
      <TableCell className="px-2 py-1.5 font-medium tabular-nums">
        {row.month}
      </TableCell>
      {compact ? null : (
        <TableCell className="px-2 py-1.5 text-right tabular-nums">
          {formatCurrencyCents(row.startingBalance)}
        </TableCell>
      )}
      <TableCell className="px-2 py-1.5 text-right tabular-nums">
        {formatCurrencyCents(row.payment)}
      </TableCell>
      <TableCell className="px-2 py-1.5 text-right tabular-nums text-muted-foreground">
        {formatCurrencyCents(row.interest)}
      </TableCell>
      <TableCell className="px-2 py-1.5 text-right tabular-nums">
        {formatCurrencyCents(row.principal)}
      </TableCell>
      <TableCell className="px-2 py-1.5 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
        {row.overpayment > 0 ? formatCurrencyCents(row.overpayment) : "—"}
      </TableCell>
      <TableCell className="px-2 py-1.5 text-right font-medium tabular-nums">
        {formatCurrencyCents(row.endingBalance)}
      </TableCell>
    </TableRow>
  );
}
