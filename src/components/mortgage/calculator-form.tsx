"use client";

import * as React from "react";
import {
  RotateCcw,
  Copy,
  Calculator,
  Info,
  Plus,
  Trash2,
  CalendarClock,
  Repeat,
  Link2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { t, type Lang } from "@/lib/i18n";
import type { CalcState } from "@/lib/calc-state";
import type {
  OverpaymentType,
  PrepaymentMode,
  LumpSumPrepayment,
} from "@/lib/mortgage";

interface CalculatorFormProps {
  state: CalcState;
  /** Auto-calculated EMI, shown as helper text. */
  calculatedPayment: number;
  warnings: string[];
  /** Show the prepayment-strategy section (hidden in pure EMI mode). */
  showPrepayment: boolean;
  /** Show the EMI/tenure mode toggle. V1 prepayment view is tenure-only. */
  showModeToggle: boolean;
  /** UI language for label translations. */
  lang?: Lang;
  onChange: (patch: Partial<CalcState>) => void;
  onReset: () => void;
  onCopy: () => void;
  /** Copy the current calculation as a shareable URL. */
  onCopyShareLink: () => void;
}

/** A labelled numeric input with an optional prefix/suffix adornment. */
function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  step = 1,
  helper,
  invalid,
  placeholder,
}: {
  id: string;
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  helper?: React.ReactNode;
  invalid?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value === 0 ? "" : value}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") onChange(0);
            else onChange(Number(raw));
          }}
          aria-invalid={invalid}
          className={cn(prefix && "pl-7", suffix && "pr-12")}
        />
        {suffix && (
          <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {helper && (
        <p className="text-muted-foreground text-xs leading-snug">{helper}</p>
      )}
    </div>
  );
}

export function CalculatorForm({
  state,
  calculatedPayment,
  warnings,
  showPrepayment,
  showModeToggle,
  lang = "en",
  onChange,
  onReset,
  onCopy,
  onCopyShareLink,
}: CalculatorFormProps) {
  const tr = (key: string) => t(lang, key);
  const showMonthly =
    state.overpaymentType === "monthly" || state.overpaymentType === "both";
  const showLump =
    state.overpaymentType === "lump" || state.overpaymentType === "both";

  function updateLumpSum(index: number, patch: Partial<LumpSumPrepayment>) {
    const next = state.lumpSums.map((ls, i) =>
      i === index ? { ...ls, ...patch } : ls
    );
    onChange({ lumpSums: next });
  }
  function addLumpSum() {
    onChange({
      lumpSums: [...state.lumpSums, { month: 12, amount: 1_00_000 }],
    });
  }
  function removeLumpSum(index: number) {
    onChange({ lumpSums: state.lumpSums.filter((_, i) => i !== index) });
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Calculator className="size-4" />
          </span>
          <div>
            <CardTitle className="text-base">{lang === "hi" ? "होम लोन विवरण" : "Home loan inputs"}</CardTitle>
            <CardDescription className="text-xs">
              {lang === "hi"
                ? "कोई भी फ़ील्ड बदलें — परिणाम तुरंत अपडेट होते हैं।"
                : "Edit any field — results recalculate instantly."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ---- Input mode toggle: fresh loan vs outstanding principal ---- */}
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="inputModeSwitch" className="text-sm font-medium">
              {tr("form.outstandingMode")}
            </Label>
            <p className="text-muted-foreground text-xs">
              {state.inputMode === "outstanding"
                ? lang === "hi"
                  ? "अपना वर्तमान बकाया मूलधन और शेष अवधि दर्ज करें।"
                  : "Enter your current outstanding principal and remaining tenure to model prepayments on a loan you're already paying."
                : lang === "hi"
                  ? "नई ऋण राशि और पूरी अवधि दर्ज करें। मौजूदा उधारकर्ता हैं तो टॉगल करें।"
                  : "Enter a fresh loan amount and full tenure. Toggle on if you're an existing borrower."}
            </p>
          </div>
          <Switch
            id="inputModeSwitch"
            checked={state.inputMode === "outstanding"}
            onCheckedChange={(checked) =>
              onChange({ inputMode: checked ? "outstanding" : "principal" })
            }
          />
        </div>

        {/* ---- Your loan ---- */}
        <section className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {state.inputMode === "outstanding"
              ? lang === "hi"
                ? "बकाया मूलधन और शेष अवधि"
                : "Outstanding principal & remaining tenure"
              : tr("form.yourHomeLoan")}
          </h3>

          <NumberField
            id="loanAmount"
            label={
              state.inputMode === "outstanding"
                ? lang === "hi"
                  ? "बकाया मूलधन"
                  : "Outstanding principal"
                : tr("form.loanAmount")
            }
            prefix="₹"
            value={state.loanAmount}
            onChange={(v) => onChange({ loanAmount: v })}
            step={50000}
            placeholder="50,00,000"
            invalid={state.loanAmount <= 0}
            helper={
              state.loanAmount <= 0
                ? "Enter the amount you're borrowing."
                : state.inputMode === "outstanding"
                  ? "The principal you still owe today (check your latest statement)."
                  : "The amount you're borrowing (the principal)."
            }
          />

          <NumberField
            id="annualRate"
            label={tr("form.interestRate")}
            value={state.annualRate}
            onChange={(v) => onChange({ annualRate: v })}
            suffix="% p.a."
            step={0.05}
            placeholder="8.5"
            invalid={state.annualRate < 0}
            helper={lang === "hi" ? "वार्षिक ब्याज दर, जैसे 8.5 का अर्थ 8.5% प्रति वर्ष।" : "Your home loan's annual rate of interest, e.g. 8.5 for 8.5% p.a."}
          />

          {/* Term: years + months */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              {state.inputMode === "outstanding"
                ? lang === "hi" ? "शेष अवधि" : "Remaining tenure"
                : tr("form.loanTenure")}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Input
                  id="termYears"
                  type="number"
                  min={0}
                  step={1}
                  value={state.termYears === 0 ? "" : state.termYears}
                  placeholder="20"
                  onChange={(e) =>
                    onChange({
                      termYears: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="pr-12"
                />
                <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  yrs
                </span>
              </div>
              <div className="relative">
                <Input
                  id="termMonths"
                  type="number"
                  min={0}
                  max={11}
                  step={1}
                  value={state.termExtraMonths === 0 ? "" : state.termExtraMonths}
                  placeholder="0"
                  onChange={(e) =>
                    onChange({
                      termExtraMonths: Math.min(
                        11,
                        Math.max(0, Number(e.target.value) || 0)
                      ),
                    })
                  }
                  className="pr-12"
                />
                <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  mos
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Pick a tenure in years, or add extra months for odd tenures (e.g. 18 years &amp; 6 months).
            </p>
          </div>

          {/* EMI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthlyPayment" className="text-sm font-medium">
                {tr("form.monthlyEMI")}
              </Label>
              {state.paymentIsManual ? (
                <button
                  type="button"
                  onClick={() => onChange({ paymentIsManual: false })}
                  className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  {tr("form.useCalculated")} ({formatCurrency(calculatedPayment)})
                </button>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  {tr("form.auto")}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                ₹
              </span>
              <Input
                id="monthlyPayment"
                type="number"
                min={0}
                step={100}
                value={state.monthlyPayment === 0 ? "" : state.monthlyPayment}
                placeholder={Math.round(calculatedPayment).toString()}
                onChange={(e) =>
                  onChange({
                    monthlyPayment: Number(e.target.value) || 0,
                    paymentIsManual: true,
                  })
                }
                className="pl-7"
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {state.paymentIsManual
                ? (lang === "hi" ? "आपने कस्टम EMI सेट की है। " : "You've set a custom EMI. ") +
                  tr("form.calculatedEMI") + ": " + formatCurrency(calculatedPayment) + "."
                : tr("form.calculatedEMI") + ": " +
                  formatCurrency(calculatedPayment) +
                  (lang === "hi"
                    ? " — ऋण, दर और अवधि से स्वचालित गणना। बदलने के लिए मान दर्ज करें।"
                    : " — auto-derived from loan, rate and tenure. Enter a value to override.")}
            </p>
          </div>
        </section>

        {showPrepayment && (
          <>
            <Separator />

            {/* ---- Prepayment strategy ---- */}
            <section className="space-y-4">
              <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {tr("form.prepaymentStrategy")}
              </h3>

              {/* Prepayment mode: EMI vs Tenure (hidden on V1 tenure-only views) */}
              {showModeToggle && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    When you prepay, reduce…
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={state.prepaymentMode}
                    onValueChange={(v) => {
                      if (v) onChange({ prepaymentMode: v as PrepaymentMode });
                    }}
                    className="grid w-full grid-cols-2"
                    variant="outline"
                  >
                    <ToggleGroupItem value="tenure" className="text-xs">
                      <CalendarClock className="mr-1 size-3.5" /> Tenure (finish sooner)
                    </ToggleGroupItem>
                    <ToggleGroupItem value="emi" className="text-xs">
                      <Repeat className="mr-1 size-3.5" /> EMI (lower monthly)
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="text-muted-foreground text-xs">
                    {state.prepaymentMode === "tenure"
                      ? "EMI stays the same; prepayments shorten your tenure. Saves the most interest."
                      : "Tenure stays the same; your EMI reduces after each prepayment. Lower monthly burden, smaller interest saving."}
                  </p>
                </div>
              )}

              {/* Prepayment mode selector */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">{tr("form.prepaymentMode")}</Label>
                <ToggleGroup
                  type="single"
                  value={state.overpaymentType}
                  onValueChange={(v) => {
                    if (v) onChange({ overpaymentType: v as OverpaymentType });
                  }}
                  className="grid w-full grid-cols-3"
                  variant="outline"
                >
                  <ToggleGroupItem value="monthly" className="text-xs">
                    {tr("form.monthlyExtraEMI")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="lump" className="text-xs">
                    {tr("form.lumpSum")}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="both" className="text-xs">
                    {tr("form.both")}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {showMonthly && (
                <>
                  <NumberField
                    id="overpaymentMonthly"
                    label="Extra Amount (per month)"
                    prefix="₹"
                    value={state.overpaymentMonthly}
                    onChange={(v) => onChange({ overpaymentMonthly: v })}
                    step={1000}
                    placeholder="10,000"
                    helper={
                      <span>
                        Effective EMI:{" "}
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(state.monthlyPayment + state.overpaymentMonthly)}
                        </strong>
                        /mo (EMI {formatCurrency(state.monthlyPayment)} + extra {formatCurrency(state.overpaymentMonthly)})
                      </span>
                    }
                  />
                  {/* Start Month + Start Year */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Start from</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Input
                          id="opStartMonth"
                          type="number"
                          min={1}
                          max={12}
                          step={1}
                          value={opStartMonthField(state.overpaymentStartMonth)}
                          placeholder="1"
                          onChange={(e) =>
                            onChange({
                              overpaymentStartMonth: combineStartMonthYear(
                                Number(e.target.value) || 1,
                                opStartYearField(state.overpaymentStartMonth)
                              ),
                            })
                          }
                          className="pr-12"
                        />
                        <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                          month
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          id="opStartYear"
                          type="number"
                          min={1}
                          step={1}
                          value={opStartYearField(state.overpaymentStartMonth)}
                          placeholder="1"
                          onChange={(e) =>
                            onChange({
                              overpaymentStartMonth: combineStartMonthYear(
                                opStartMonthField(state.overpaymentStartMonth),
                                Number(e.target.value) || 1
                              ),
                            })
                          }
                          className="pr-10"
                        />
                        <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                          yr
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Extra EMI begins from this month of this year.
                    </p>
                  </div>
                </>
              )}

              {showLump && (
                <>
                  <NumberField
                    id="overpaymentLumpSum"
                    label="Lump Sum Amount"
                    prefix="₹"
                    value={state.overpaymentLumpSum}
                    onChange={(v) => onChange({ overpaymentLumpSum: v })}
                    step={25000}
                    placeholder="2,00,000"
                    helper="A single prepayment that reduces your outstanding principal."
                  />
                  <NumberField
                    id="lumpApplyMonth"
                    label="Apply after X months"
                    value={state.overpaymentStartMonth}
                    onChange={(v) =>
                      onChange({ overpaymentStartMonth: Math.max(1, Math.floor(v)) })
                    }
                    step={1}
                    min={1}
                    placeholder="24"
                    helper="The lump sum is applied after this many EMIs. The same EMI continues, reducing your tenure."
                  />
                </>
              )}

              {/* Annual bonus */}
              <NumberField
                id="overpaymentAnnual"
                label="Extra per year (annual bonus)"
                prefix="₹"
                value={state.overpaymentAnnual}
                onChange={(v) => onChange({ overpaymentAnnual: v })}
                step={5000}
                placeholder="0"
                helper={
                  <span className="inline-flex items-start gap-1">
                    <Info className="mt-px size-3 shrink-0" />
                    <span>
                      Optional. Applied every 12 months from your start month — handy for annual bonuses or tax refunds.
                    </span>
                  </span>
                }
              />

              {/* Multiple lump sums */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Additional lump-sum prepayments
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLumpSum}
                    className="h-7 px-2 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Add
                  </Button>
                </div>
                {state.lumpSums.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Schedule extra lump sums at specific months — e.g. a yearly bonus in month 12, a property-sale proceeds in month 24.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {state.lumpSums.map((ls, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg border p-2"
                      >
                        <div className="grid flex-1 grid-cols-2 gap-2">
                          <div className="relative">
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              value={ls.month === 0 ? "" : ls.month}
                              placeholder="Month"
                              onChange={(e) =>
                                updateLumpSum(i, {
                                  month: Math.max(1, Number(e.target.value) || 1),
                                })
                              }
                              className="h-8 pr-12 text-xs"
                            />
                            <span className="text-muted-foreground pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">
                              month
                            </span>
                          </div>
                          <div className="relative">
                            <span className="text-muted-foreground pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs">
                              ₹
                            </span>
                            <Input
                              type="number"
                              min={0}
                              step={10000}
                              value={ls.amount === 0 ? "" : ls.amount}
                              placeholder="Amount"
                              onChange={(e) =>
                                updateLumpSum(i, {
                                  amount: Number(e.target.value) || 0,
                                })
                              }
                              className="h-8 pl-6 text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeLumpSum(i)}
                          aria-label="Remove lump sum"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timing toggle */}
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="timingSwitch" className="text-sm font-medium">
                    Apply at start of month
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    {state.overpaymentTiming === "start"
                      ? "Prepayment reduces principal before interest is charged — saves a little more."
                      : "Prepayment applies after the EMI (how most banks process it)."}
                  </p>
                </div>
                <Switch
                  id="timingSwitch"
                  checked={state.overpaymentTiming === "start"}
                  onCheckedChange={(checked) =>
                    onChange({ overpaymentTiming: checked ? "start" : "end" })
                  }
                />
              </div>

              {/* Start date (loan start) */}
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Loan start date
                </Label>
                <Input
                  id="startDate"
                  type="month"
                  value={toMonthInputValue(state.startDate)}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v) onChange({ startDate: fromMonthInputValue(v) });
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  Used to convert &quot;months saved&quot; into real payoff dates.
                </p>
              </div>
            </section>
          </>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 dark:border-amber-700/40 dark:bg-amber-950/30">
            {warnings.map((w, i) => (
              <p
                key={i}
                className="text-xs leading-snug text-amber-800 dark:text-amber-200"
              >
                <span className="font-semibold">Heads up:</span> {w}
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
          >
            <RotateCcw className="size-4" />
            {tr("form.reset")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyShareLink}
          >
            <Link2 className="size-4" />
            {tr("form.shareLink")}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onCopy}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Copy className="size-4" />
            {tr("form.copyResults")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function toMonthInputValue(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${y}-${m}`;
}

function fromMonthInputValue(v: string): Date {
  const [y, m] = v.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1);
}

/** Convert an absolute EMI month to the calendar-style month field (1–12). */
function opStartMonthField(absoluteMonth: number): number {
  return ((Math.max(1, absoluteMonth) - 1) % 12) + 1;
}

/** Convert an absolute EMI month to the year field (1-indexed). */
function opStartYearField(absoluteMonth: number): number {
  return Math.floor((Math.max(1, absoluteMonth) - 1) / 12) + 1;
}

/** Combine a calendar month (1–12) and year (1+) back into an absolute EMI month. */
function combineStartMonthYear(month: number, year: number): number {
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const y = Math.max(1, Math.floor(year));
  return (y - 1) * 12 + m;
}
