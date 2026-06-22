"use client";

import * as React from "react";
import { Building2, Check, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BankInfo } from "@/lib/india-data";

interface BankInfoBlockProps {
  bank: BankInfo;
}

/**
 * Detailed bank information block shown on bank-specific calculator views.
 * Renders the bank's about copy, rate/fee/tenure facts, features,
 * eligibility, and SEO content blocks.
 */
export function BankInfoBlock({ bank }: BankInfoBlockProps) {
  return (
    <div className="space-y-4">
      {/* Bank summary */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 flex size-10 items-center justify-center rounded-lg">
              <Building2 className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">{bank.name}</CardTitle>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px]">
                  {bank.rateRange}
                </Badge>
              </div>
              <CardDescription className="text-xs">{bank.tagline}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">{bank.about}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact label="Interest rate" value={bank.rateRange} />
            <Fact label="Max tenure" value={`${bank.maxTenureYears} years`} />
            <Fact label="Max loan" value={bank.maxLoanAmount} />
            <Fact label="Processing fee" value={bank.processingFee} />
          </div>
        </CardContent>
      </Card>

      {/* Features + eligibility */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Key features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {bank.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {bank.eligibility.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{e}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Prepayment policy callout */}
      <Card className="border-emerald-600/20 bg-emerald-50/40 dark:bg-emerald-950/10">
        <CardContent className="py-4">
          <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            Prepayment &amp; foreclosure policy
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {bank.prepaymentPolicy}
          </p>
        </CardContent>
      </Card>

      {/* SEO content blocks */}
      <div className="space-y-3">
        {bank.contentBlocks.map((b, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{b.heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-2.5">
      <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold">{value}</p>
    </div>
  );
}
