"use client";

import * as React from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
  Wallet,
  Building2,
  Percent,
  ShieldCheck,
  TrendingDown,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

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
import { formatCurrency, formatDuration } from "@/lib/format";
import { t, type Lang } from "@/lib/i18n";
import { trackLeadEvent } from "@/lib/lead-analytics";
import type { MortgageResult } from "@/lib/mortgage";

/** Calculator context attached automatically to every lead. */
export interface CalcContext {
  loanAmount: number;
  emi: number;
  tenureMonths: number;
  monthlyExtra: number;
  lumpSum: number;
  annualRate: number;
  interestSaved: number;
  timeSavedMonths: number;
}

interface EmailCaptureProps {
  result: MortgageResult;
  lang?: Lang;
  calcContext?: CalcContext;
}

const LENDERS = [
  "SBI",
  "HDFC",
  "ICICI",
  "Axis",
  "Kotak",
  "Bank of Baroda",
  "Punjab National Bank",
  "LIC Housing Finance",
  "Bajaj Housing Finance",
  "Other",
];

const BALANCE_RANGES = [
  "Less than ₹10 Lakh",
  "₹10–25 Lakh",
  "₹25–50 Lakh",
  "₹50 Lakh–₹1 Crore",
  "More than ₹1 Crore",
];

const CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Jaipur",
  "Ahmedabad",
  "Kolkata",
  "Other",
];

type Status = "idle" | "loading" | "success" | "error";
type ContactMethod = "email" | "phone";
type Step = 1 | 2;

export function EmailCapture({ result, lang = "en", calcContext }: EmailCaptureProps) {
  const tr = (key: string) => t(lang, key);
  const isHi = lang === "hi";

  // --- Form state ---
  const [step, setStep] = React.useState<Step>(1);
  const [contactMethod, setContactMethod] = React.useState<ContactMethod>("email");
  const [contact, setContact] = React.useState("");
  const [name, setName] = React.useState("");
  const [lender, setLender] = React.useState("");
  const [balanceRange, setBalanceRange] = React.useState("");
  const [currentRate, setCurrentRate] = React.useState("");
  const [city, setCity] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");
  const [started, setStarted] = React.useState(false);
  const [leadCaptured, setLeadCaptured] = React.useState(false);

  // --- Analytics: track impression once on mount ---
  React.useEffect(() => {
    trackLeadEvent("lead_form_impression", { lang });
  }, [lang]);

  function handleStart() {
    if (!started) {
      setStarted(true);
      trackLeadEvent("lead_form_start", { lang });
    }
  }

  /**
   * Step 1 submit: capture just the contact (email or phone). This is the
   * low-friction first step — only one required field. The lead is saved
   * immediately with the calculator context so even if the user doesn't
   * proceed to step 2, we still have their contact + calculation.
   */
  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = contact.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage(
        isHi
          ? "कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।"
          : "Please enter your email or mobile number."
      );
      trackLeadEvent("lead_form_error", { lang });
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    const isEmail = contactMethod === "email";
    const isValid = isEmail ? emailRe.test(trimmed) : phoneRe.test(trimmed);
    if (!isValid) {
      setStatus("error");
      setMessage(
        isEmail
          ? isHi
            ? "कृपया एक मान्य ईमेल पता दर्ज करें।"
            : "Please enter a valid email address."
          : isHi
            ? "कृपया एक मान्य 10-अंकों का भारतीय मोबाइल नंबर दर्ज करें।"
            : "Please enter a valid 10-digit Indian mobile number."
      );
      trackLeadEvent("lead_form_error", { lang });
      return;
    }

    setStatus("loading");
    try {
      const payload: Record<string, unknown> = {
        name: name.trim() || undefined,
        calcContext: calcContext
          ? {
              loanAmount: calcContext.loanAmount,
              emi: calcContext.emi,
              tenureMonths: calcContext.tenureMonths,
              monthlyExtra: calcContext.monthlyExtra,
              lumpSum: calcContext.lumpSum,
              annualRate: calcContext.annualRate,
              interestSaved: calcContext.interestSaved,
              timeSavedMonths: calcContext.timeSavedMonths,
            }
          : undefined,
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
      const data = await res.json();
      setLeadCaptured(true);
      trackLeadEvent("lead_form_complete", {
        lang,
        leadTier: data.leadTier,
        leadScore: data.leadScore,
      });
      setStatus("idle");
      setStep(2);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : isHi
            ? "कुछ गलत हुआ। कृपया पुनः प्रयास करें।"
            : "Something went wrong. Please try again."
      );
      trackLeadEvent("lead_form_error", { lang });
    }
  }

  /**
   * Step 2 submit: add optional qualification fields (lender, balance, rate,
   * city) to the already-captured lead via upsert. This step can be skipped.
   */
  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    const rateNum = currentRate ? parseFloat(currentRate) : undefined;
    if (rateNum !== undefined && (rateNum < 1 || rateNum > 25)) {
      setStatus("error");
      setMessage(isHi ? "ब्याज दर 1% से 25% के बीच होनी चाहिए।" : "Interest rate must be between 1% and 25%.");
      return;
    }

    setStatus("loading");
    try {
      const payload: Record<string, unknown> = {
        name: name.trim() || undefined,
        city: city || undefined,
        lender: lender || undefined,
        loanBalanceRange: balanceRange || undefined,
        interestRate: rateNum,
        calcContext: calcContext
          ? {
              loanAmount: calcContext.loanAmount,
              emi: calcContext.emi,
              tenureMonths: calcContext.tenureMonths,
              monthlyExtra: calcContext.monthlyExtra,
              lumpSum: calcContext.lumpSum,
              annualRate: calcContext.annualRate,
              interestSaved: calcContext.interestSaved,
              timeSavedMonths: calcContext.timeSavedMonths,
            }
          : undefined,
        summary: {
          monthsSaved: result.monthsSaved,
          totalInterestSaved: result.totalInterestSaved,
          newPayoffDate: result.newPayoffDate.toISOString(),
          originalTermMonths: result.originalTermMonths,
          newTermMonths: result.newTermMonths,
        },
      };
      // Re-send the contact so the API can upsert by email.
      const trimmed = contact.trim();
      if (contactMethod === "email") payload.email = trimmed.toLowerCase();
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
      const data = await res.json();
      setStatus("success");
      trackLeadEvent("lead_form_complete", {
        lang,
        leadTier: data.leadTier,
        leadScore: data.leadScore,
      });
    } catch (err) {
      // Even if step 2 fails, the lead was already captured in step 1.
      setStatus("success");
    }
  }

  /** Skip step 2 — go straight to success (lead already captured in step 1). */
  function handleSkip() {
    setStatus("success");
    trackLeadEvent("lead_form_complete", { lang, leadTier: "incomplete" });
  }

  // --- Success message with savings recap ---
  if (status === "success") {
    return (
      <Card
        id="email-capture"
        className="scroll-mt-4 overflow-hidden border-emerald-600/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card"
      >
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="size-12 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                {isHi ? "आपका अनुरोध प्राप्त हो गया है" : "Your Request Has Been Received"}
              </h3>
              <p className="text-muted-foreground mt-1 max-w-md text-sm">
                {isHi
                  ? "आपकी गणना के आधार पर, आप बचा सकते हैं:"
                  : "Based on your calculation, you could save:"}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {result.totalInterestSaved > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 dark:bg-emerald-950/30">
                  <TrendingDown className="size-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(result.totalInterestSaved)}{" "}
                    <span className="text-muted-foreground font-normal">
                      {isHi ? "ब्याज में" : "in interest"}
                    </span>
                  </span>
                </div>
              )}
              {result.monthsSaved > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 dark:bg-emerald-950/30">
                  <Clock className="size-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {formatDuration(result.monthsSaved)}{" "}
                    <span className="text-muted-foreground font-normal">
                      {isHi ? "अवधि में" : "in tenure"}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground max-w-md text-xs">
              {isHi
                ? "हम आपको व्यक्तिगत विकल्प भेजेंगे जिससे आप और अधिक बचत कर सकें।"
                : "We'll share personalized options that may help you save even more."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      id="email-capture"
      className="scroll-mt-4 overflow-hidden border-emerald-600/30 bg-gradient-to-br from-white to-emerald-50/50 dark:from-card dark:to-emerald-950/20"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <span className="bg-emerald-600 text-white flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Mail className="size-4" />
          </span>
          <div className="flex-1">
            <CardTitle className="text-base">
              {isHi
                ? "व्यक्तिगत होम लोन बचत विकल्प प्राप्त करें"
                : "Get Personalized Home Loan Savings Options"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isHi
                ? "देखें कि रिफाइनेंस, बैलेंस ट्रांसफर, या अतिरिक्त प्रीपेमेंट से आप और बचत कर सकते हैं।"
                : "See whether refinancing, balance transfer, or additional prepayments could help you save even more."}
            </CardDescription>
          </div>
          {/* Step indicator */}
          <div className="flex shrink-0 items-center gap-1 text-[10px] font-medium">
            <span className={cn("rounded-full px-2 py-0.5", step === 1 ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300")}>
              1
            </span>
            <ChevronRight className="text-muted-foreground size-3" />
            <span className={cn("rounded-full px-2 py-0.5", step === 2 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground")}>
              2
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Savings recap (motivates the form) */}
        {result.valid && (result.totalInterestSaved > 0 || result.monthsSaved > 0) && (
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-emerald-50/70 p-3 text-xs dark:bg-emerald-950/30">
            {result.totalInterestSaved > 0 && (
              <span>
                {isHi ? "बचाया गया ब्याज:" : "Interest saved:"}{" "}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(result.totalInterestSaved)}
                </strong>
              </span>
            )}
            {result.monthsSaved > 0 && (
              <span>
                {isHi ? "बचाया गया समय:" : "Time saved:"}{" "}
                <strong className="text-emerald-700 dark:text-emerald-300">
                  {formatDuration(result.monthsSaved)}
                </strong>
              </span>
            )}
          </div>
        )}

        {/* ============ STEP 1: Contact only (low friction) ============ */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-3" onChange={handleStart}>
            {/* Name (optional, quick) */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-name" className="text-sm font-medium">
                {isHi ? "नाम (वैकल्पिक)" : "Name (optional)"}
              </Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="lead-name"
                  type="text"
                  placeholder={isHi ? "आपका नाम" : "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Name"
                  className="h-11 pl-9"
                />
              </div>
            </div>

            {/* Contact method toggle */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                {isHi ? "संपर्क विधि" : "Contact method"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setContactMethod("email");
                    setContact("");
                    handleStart();
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    contactMethod === "email"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <Mail className="size-3.5" /> {isHi ? "ईमेल" : "Email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContactMethod("phone");
                    setContact("");
                    handleStart();
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    contactMethod === "phone"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <Phone className="size-3.5" /> {isHi ? "मोबाइल" : "Mobile"}
                </button>
              </div>
            </div>

            {/* Contact input (email or phone) */}
            <div className="space-y-1.5">
              <Label htmlFor="contact" className="text-sm font-medium">
                {contactMethod === "email"
                  ? isHi ? "ईमेल पता" : "Email Address"
                  : isHi ? "मोबाइल नंबर" : "Mobile Number"}
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div className="relative">
                {contactMethod === "email" ? (
                  <Mail className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                ) : (
                  <Phone className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                )}
                <Input
                  id="contact"
                  type="text"
                  required
                  placeholder={
                    contactMethod === "email"
                      ? "you@example.com"
                      : "9876543210"
                  }
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  aria-label={contactMethod === "email" ? "Email address" : "Mobile number"}
                  className={cn(
                    "h-11 pl-9",
                    status === "error" && "border-destructive"
                  )}
                />
              </div>
            </div>

            {status === "error" && (
              <p className="text-xs text-destructive">{message}</p>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-emerald-600 hover:bg-emerald-700 h-11 w-full"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isHi ? "भेजा जा रहा है…" : "Submitting…"}
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  {isHi ? "मेरे विकल्प प्राप्त करें" : "Get My Savings Options"}
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* ============ STEP 2: Optional qualification fields ============ */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-3">
            {/* Step 2 header — acknowledges step 1 success */}
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50/70 p-2.5 text-xs dark:bg-emerald-950/30">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                {isHi
                  ? "संपर्क विवरण सहेजे गए! बेहतर विकल्पों के लिए कुछ और जानकारी दें (वैकल्पिक)।"
                  : "Contact saved! Add a few details for better options (optional)."}
              </span>
            </div>

            {/* Lender + Balance range (two-col on desktop) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lender" className="text-sm font-medium">
                  {isHi ? "वर्तमान ऋणदाता" : "Current Lender"}
                </Label>
                <Select value={lender} onValueChange={setLender}>
                  <SelectTrigger id="lender" className="h-11 w-full">
                    <Building2 className="text-muted-foreground mr-1 size-4" />
                    <SelectValue placeholder={isHi ? "चुनें" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {LENDERS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="balance-range" className="text-sm font-medium">
                  {isHi ? "बकाया शेष" : "Outstanding Balance"}
                </Label>
                <Select value={balanceRange} onValueChange={setBalanceRange}>
                  <SelectTrigger id="balance-range" className="h-11 w-full">
                    <Wallet className="text-muted-foreground mr-1 size-4" />
                    <SelectValue placeholder={isHi ? "चुनें" : "Select range"} />
                  </SelectTrigger>
                  <SelectContent>
                    {BALANCE_RANGES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Interest rate + City (two-col on desktop) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="current-rate" className="text-sm font-medium">
                  {isHi ? "वर्तमान ब्याज दर" : "Current Interest Rate"}
                </Label>
                <div className="relative">
                  <Percent className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    id="current-rate"
                    type="number"
                    min={1}
                    max={25}
                    step={0.05}
                    placeholder="8.50"
                    value={currentRate}
                    onChange={(e) => setCurrentRate(e.target.value)}
                    aria-label="Current interest rate"
                    className="h-11 pl-9 pr-9"
                  />
                  <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                    %
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-city" className="text-sm font-medium">
                  {isHi ? "शहर" : "City"}
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger id="lead-city" className="h-11 w-full">
                    <MapPin className="text-muted-foreground mr-1 size-4" />
                    <SelectValue placeholder={isHi ? "चुनें" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {status === "error" && (
              <p className="text-xs text-destructive">{message}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="h-11 flex-1"
              >
                {isHi ? "छोड़ें" : "Skip"}
              </Button>
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-emerald-600 hover:bg-emerald-700 h-11 flex-1"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isHi ? "भेजा जा रहा है…" : "Submitting…"}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {isHi ? "पूरा करें" : "Complete"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Trust section */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-600/15 bg-emerald-50/40 p-3 dark:bg-emerald-950/10">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div className="text-[11px] leading-relaxed text-muted-foreground">
            {isHi ? (
              <>
                आपके विवरण कभी बेचे नहीं जाते। हम केवल प्रासंगिक होम-लोन बचत अवसर साझा करने के लिए आपकी जानकारी का उपयोग करते हैं। कोई स्पैम नहीं। कभी भी सदस्यता छोड़ें।
              </>
            ) : (
              <>
                Your details are never sold. We only use your information to share
                relevant home-loan savings opportunities. No spam. Unsubscribe anytime.
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
