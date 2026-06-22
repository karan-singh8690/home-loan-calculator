"use client";

import * as React from "react";
import { Mail, Send, CheckCircle2, Loader2, MapPin, Phone, User, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const LOAN_BALANCE_RANGES = [
  "Under ₹10 Lakh",
  "₹10 L – ₹25 L",
  "₹25 L – ₹50 L",
  "₹50 L – ₹75 L",
  "₹75 L – ₹1 Cr",
  "Above ₹1 Crore",
];

type Status = "idle" | "loading" | "success" | "error";

export function EmailCapture({ result }: EmailCaptureProps) {
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [city, setCity] = React.useState("");
  const [loanRange, setLoanRange] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = contact.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email or phone number.");
      return;
    }

    // Detect whether the input is an email or a phone number.
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    const isEmail = emailRe.test(trimmed);
    const isPhone = phoneRe.test(trimmed);

    if (!isEmail && !isPhone) {
      setStatus("error");
      setMessage(
        "Please enter a valid email address or a 10-digit Indian mobile number."
      );
      return;
    }

    setStatus("loading");
    try {
      const payload: Record<string, unknown> = {
        name: name.trim() || undefined,
        city: city.trim() || undefined,
        loanBalanceRange: loanRange || undefined,
        summary: {
          monthsSaved: result.monthsSaved,
          totalInterestSaved: result.totalInterestSaved,
          newPayoffDate: result.newPayoffDate.toISOString(),
          originalTermMonths: result.originalTermMonths,
          newTermMonths: result.newTermMonths,
        },
      };
      if (isEmail) payload.email = trimmed.toLowerCase();
      else payload.phone = trimmed;

      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      setStatus("success");
      setMessage(
        "Thanks! We'll email you a detailed PDF/CSV report of your prepayment schedule and share options to reduce your home-loan tenure and interest."
      );
      setName("");
      setContact("");
      setCity("");
      setLoanRange("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again in a moment."
      );
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
              Get your full prepayment report
            </CardTitle>
            <CardDescription className="text-xs">
              We&rsquo;ll email a detailed PDF/CSV report and share options to
              reduce your home-loan tenure and interest.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {result.valid && (
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-emerald-50/70 p-3 text-xs dark:bg-emerald-950/30">
            <span>
              <span className="text-muted-foreground">Interest saved:</span>{" "}
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
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-name" className="text-sm font-medium">
                Name
              </Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="lead-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Name"
                  className="h-11 pl-9"
                />
              </div>
            </div>

            {/* Email or phone */}
            <div className="space-y-1.5">
              <Label htmlFor="contact" className="text-sm font-medium">
                Email or phone
              </Label>
              <div className="relative">
                <Mail className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="contact"
                  type="text"
                  required
                  placeholder="you@example.com or 9876543210"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  aria-label="Email or phone number"
                  className={cn(
                    "h-11 pl-9",
                    status === "error" && "border-destructive"
                  )}
                />
              </div>
            </div>

            {/* City + Current Loan Balance Range */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lead-city" className="text-sm font-medium">
                  City <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <MapPin className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    id="lead-city"
                    type="text"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="City (optional)"
                    className="h-11 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loan-range" className="text-sm font-medium">
                  Current loan balance <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Select value={loanRange} onValueChange={setLoanRange}>
                  <SelectTrigger id="loan-range" className="h-11 w-full">
                    <Wallet className="text-muted-foreground mr-1 size-4" />
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_BALANCE_RANGES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-emerald-600 hover:bg-emerald-700 h-11 w-full"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending&hellip;
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Get My Full Prepayment Report
                </>
              )}
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-2 text-xs text-destructive">{message}</p>
        )}

        <p className="text-muted-foreground mt-3 flex items-center gap-1 text-[11px]">
          <Phone className="size-3" />
          We&rsquo;ll only use your details to deliver your report and occasional
          home-loan tips. Unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
}
