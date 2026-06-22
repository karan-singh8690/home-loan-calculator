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
}

const HEAD_COUNT = 4;
const TAIL_COUNT = 4;

export function AmortizationTable({ result }: AmortizationTableProps) {
  const schedule = result.overpaymentSchedule;

  if (!result.valid || schedule.length === 0) {
    return null;
  }

  // Build a snapshot: first N rows, then "..." if there's a gap, then last N rows.
  const head = schedule.slice(0, HEAD_COUNT);
  const tail = schedule.slice(-TAIL_COUNT);
  const hasGap = schedule.length > HEAD_COUNT + TAIL_COUNT;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm">Amortization snapshot</CardTitle>
            <CardDescription className="text-xs">
              Your mortgage with overpayments applied — first and final months.
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
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Starting balance
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Payment
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Interest
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Principal
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Overpayment
                </TableHead>
                <TableHead className="h-8 px-2 text-right text-[11px] font-semibold">
                  Ending balance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {head.map((row, i) => (
                <Row key={`h-${row.month}`} row={row} zebra={i % 2 === 1} />
              ))}
              {hasGap && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground h-8 px-2 text-center text-[11px] italic">
                    … {schedule.length - HEAD_COUNT - TAIL_COUNT} months in between …
                  </TableCell>
                </TableRow>
              )}
              {tail.map((row, i) => (
                <Row
                  key={`t-${row.month}`}
                  row={row}
                  zebra={i % 2 === 1}
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
}: {
  row: AmortizationRow;
  highlightFinal?: boolean;
  zebra?: boolean;
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
      <TableCell className="px-2 py-1.5 text-right tabular-nums">
        {formatCurrencyCents(row.startingBalance)}
      </TableCell>
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
