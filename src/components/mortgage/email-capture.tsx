"use client";

import * as React from "react";
import { Mail, Send, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate, formatDuration } from "@/lib/format";
import type { MortgageResult } from "@/lib/mortgage";

interface EmailCaptureProps {
  result: MortgageResult;
}

type Status = "idle" | "loading" | "success" | "error";

export function EmailCapture({ result }: EmailCaptureProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          // Snapshot of their result so we can deliver the relevant schedule later.
          summary: {
            monthsSaved: result.monthsSaved,
            totalInterestSaved: result.totalInterestSaved,
            newPayoffDate: result.newPayoffDate.toISOString(),
            originalTermMonths: result.originalTermMonths,
            newTermMonths: result.newTermMonths,
          },
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage(
        "You're on the list! Check your inbox — we'll send your full amortization schedule and the premium export link shortly."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  }

  return (
    <Card
      id="email-capture"
      className="scroll-mt-4 overflow-hidden border-emerald-600/30 bg-gradient-to-br from-white to-emerald-50/50 dark:from-card dark:to-emerald-950/20"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white flex size-8 items-center justify-center rounded-lg">
            <Mail className="size-4" />
          </span>
          <div>
            <CardTitle className="text-base">
              Get your full amortization schedule in your inbox
            </CardTitle>
            <CardDescription className="text-xs">
              Free. We'll email the complete month-by-month schedule plus the premium PDF/CSV export link.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {result.valid && (
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-emerald-50/70 p-3 text-xs dark:bg-emerald-950/30">
            <span>
              <span className="text-muted-foreground">Saving:</span>{" "}
              <strong className="text-emerald-700 dark:text-emerald-300">
                {formatCurrency(result.totalInterestSaved)}
              </strong>
            </span>
            <span>
              <span className="text-muted-foreground">Sooner by:</span>{" "}
              <strong className="text-emerald-700 dark:text-emerald-300">
                {result.monthsSaved > 0 ? formatDuration(result.monthsSaved) : "—"}
              </strong>
            </span>
            <span>
              <span className="text-muted-foreground">Debt-free:</span>{" "}
              <strong>{formatDate(result.newPayoffDate)}</strong>
            </span>
          </div>
        )}

        {status === "success" ? (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-600/30 bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
              {message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-label="Email address"
              className={cn("h-11 flex-1", status === "error" && "border-destructive")}
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-emerald-600 hover:bg-emerald-700 h-11 shrink-0"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Send my schedule
                </>
              )}
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-2 text-xs text-destructive">{message}</p>
        )}

        <p className="text-muted-foreground mt-3 text-[11px]">
          We'll only use your email to deliver your schedule and occasional mortgage tips. Unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
}
