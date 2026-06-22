"use client";

import * as React from "react";
import { RotateCcw, Copy, Calculator, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { CalcState } from "@/lib/calc-state";
import type { OverpaymentType } from "@/lib/mortgage";

interface CalculatorFormProps {
  state: CalcState;
  /** Auto-calculated monthly payment, shown as helper text. */
  calculatedPayment: number;
  warnings: string[];
  onChange: (patch: Partial<CalcState>) => void;
  onReset: () => void;
  onCopy: () => void;
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
  onChange,
  onReset,
  onCopy,
}: CalculatorFormProps) {
  const showMonthly =
    state.overpaymentType === "monthly" || state.overpaymentType === "both";
  const showLump =
    state.overpaymentType === "lump" || state.overpaymentType === "both";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Calculator className="size-4" />
          </span>
          <div>
            <CardTitle className="text-base">Mortgage &amp; overpayment inputs</CardTitle>
            <CardDescription className="text-xs">
              Edit any field — results recalculate instantly.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ---- Your mortgage ---- */}
        <section className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Your mortgage
          </h3>

          <NumberField
            id="loanAmount"
            label="Loan amount"
            prefix="$"
            value={state.loanAmount}
            onChange={(v) => onChange({ loanAmount: v })}
            step={1000}
            placeholder="320,000"
            invalid={state.loanAmount <= 0}
            helper={
              state.loanAmount <= 0
                ? "Enter the amount you're borrowing."
                : "The amount you're borrowing (the principal)."
            }
          />

          <NumberField
            id="annualRate"
            label="Interest rate (annual)"
            value={state.annualRate}
            onChange={(v) => onChange({ annualRate: v })}
            suffix="%"
            step={0.05}
            placeholder="6.5"
            invalid={state.annualRate < 0}
            helper="Your mortgage's annual interest rate, e.g. 6.5 for 6.5%."
          />

          {/* Term: years + months */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Loan term</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Input
                  id="termYears"
                  type="number"
                  min={0}
                  step={1}
                  value={state.termYears === 0 ? "" : state.termYears}
                  placeholder="30"
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
              Pick a term in years, or add extra months for odd terms (e.g. 27 years &amp; 6 months).
            </p>
          </div>

          {/* Monthly payment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="monthlyPayment" className="text-sm font-medium">
                Monthly payment
              </Label>
              {state.paymentIsManual ? (
                <button
                  type="button"
                  onClick={() => onChange({ paymentIsManual: false })}
                  className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Use calculated ({formatCurrency(calculatedPayment)})
                </button>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Auto
                </span>
              )}
            </div>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                $
              </span>
              <Input
                id="monthlyPayment"
                type="number"
                min={0}
                step={10}
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
                ? "You've set a custom payment. The required payment for this loan is " +
                  formatCurrency(calculatedPayment) +
                  "."
                : "Auto-calculated from your loan, rate and term. Edit to model a different payment."}
            </p>
          </div>
        </section>

        <Separator />

        {/* ---- Overpayment strategy ---- */}
        <section className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Overpayment strategy
          </h3>

          {/* Overpayment type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Overpayment type</Label>
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
                Extra / month
              </ToggleGroupItem>
              <ToggleGroupItem value="lump" className="text-xs">
                Lump sum
              </ToggleGroupItem>
              <ToggleGroupItem value="both" className="text-xs">
                Both
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {showMonthly && (
            <NumberField
              id="overpaymentMonthly"
              label="Extra per month"
              prefix="$"
              value={state.overpaymentMonthly}
              onChange={(v) => onChange({ overpaymentMonthly: v })}
              step={25}
              placeholder="200"
              helper="Added to your regular payment every month once overpayments begin."
            />
          )}

          {showLump && (
            <NumberField
              id="overpaymentLumpSum"
              label="One-time lump sum"
              prefix="$"
              value={state.overpaymentLumpSum}
              onChange={(v) => onChange({ overpaymentLumpSum: v })}
              step={500}
              placeholder="10,000"
              helper="A single extra payment applied in your start month (e.g. a bonus or windfall)."
            />
          )}

          {/* Annual bonus — optional advanced */}
          <NumberField
            id="overpaymentAnnual"
            label="Extra per year (annual bonus)"
            prefix="$"
            value={state.overpaymentAnnual}
            onChange={(v) => onChange({ overpaymentAnnual: v })}
            step={250}
            placeholder="0"
            helper={
              <span className="inline-flex items-start gap-1">
                <Info className="mt-px size-3 shrink-0" />
                <span>
                  Optional. Applied every 12 months from your start month — handy for tax refunds or annual bonuses.
                </span>
              </span>
            }
          />

          <NumberField
            id="overpaymentStartMonth"
            label="Start overpayment at month"
            value={state.overpaymentStartMonth}
            onChange={(v) => onChange({ overpaymentStartMonth: Math.max(1, Math.floor(v)) })}
            step={1}
            min={1}
            placeholder="1"
            helper="Month 1 = from the very first payment. Higher numbers model starting later."
          />

          {/* Timing toggle */}
          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="timingSwitch" className="text-sm font-medium">
                Apply at start of month
              </Label>
              <p className="text-muted-foreground text-xs">
                {state.overpaymentTiming === "start"
                  ? "Overpayment reduces principal before interest is charged — saves a little more."
                  : "Overpayment applies after the regular payment (how most lenders process it)."}
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

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 dark:border-amber-700/40 dark:bg-amber-950/30">
            {warnings.map((w, i) => (
              <p key={i} className="text-xs leading-snug text-amber-800 dark:text-amber-200">
                <span className="font-semibold">Heads up:</span> {w}
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex-1"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onCopy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <Copy className="size-4" />
            Copy results
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
