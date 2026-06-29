import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { INDIA_SCENARIOS } from "@/lib/india-scenarios";
import { SITE_BASE_URL } from "@/lib/sitemap";
import { formatCurrency } from "@/lib/format";

/**
 * English scenario page — /scenarios/{id}
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return INDIA_SCENARIOS.map((s) => ({ id: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const scenario = INDIA_SCENARIOS.find((s) => s.id === p.id);
    if (!scenario) return {};

    return {
      title: `${scenario.title} | Home Loan Prepayment Scenario`,
      description: scenario.strategy,
      alternates: {
        canonical: `${SITE_BASE_URL}/scenarios/${scenario.id}`,
        languages: {
          en: `${SITE_BASE_URL}/scenarios/${scenario.id}`,
          "hi-IN": `${SITE_BASE_URL}/?lang=hi`,
        },
      },
      openGraph: {
        title: scenario.title,
        description: scenario.strategy,
        type: "article",
      },
    };
  });
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = INDIA_SCENARIOS.find((s) => s.id === id);

  if (!scenario) notFound();

  const { input } = scenario;
  const prepaymentParts: string[] = [];
  if (input.overpaymentMonthly > 0)
    prepaymentParts.push(`${formatCurrency(input.overpaymentMonthly)}/month`);
  if (input.overpaymentAnnual > 0)
    prepaymentParts.push(`${formatCurrency(input.overpaymentAnnual)}/year`);
  if (input.overpaymentLumpSum > 0)
    prepaymentParts.push(`${formatCurrency(input.overpaymentLumpSum)} lump sum in month ${input.overpaymentStartMonth}`);

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-foreground">Home</a>
          {" / "}
          <a href="/#scenarios" className="hover:text-foreground">Scenarios</a>
          {" / "}
          <span className="text-foreground">{scenario.title}</span>
        </nav>

        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          {scenario.tag}
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {scenario.title}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">{scenario.strategy}</p>

        {/* Scenario inputs summary */}
        <div className="mt-8 rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Loan & Prepayment Details</h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Loan Amount</dt>
              <dd className="text-lg font-semibold text-foreground">{formatCurrency(input.loanAmount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Interest Rate</dt>
              <dd className="text-lg font-semibold text-foreground">{input.annualRate}% p.a.</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tenure</dt>
              <dd className="text-lg font-semibold text-foreground">{input.termMonths / 12} years</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Prepayment</dt>
              <dd className="text-lg font-semibold text-foreground">
                {prepaymentParts.length > 0 ? prepaymentParts.join(" + ") : "None"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-12 rounded-xl bg-primary/10 p-6 text-center">
          <p className="text-lg font-medium text-foreground mb-3">
            See your exact savings with this strategy — enter your own numbers.
          </p>
          <a
            href={`/?tool=prepayment&loan=${input.loanAmount}&rate=${input.annualRate}&term=${input.termMonths}&monthly=${input.overpaymentMonthly}&lumpsum=${input.overpaymentLumpSum}&annual=${input.overpaymentAnnual}&start=${input.overpaymentStartMonth}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try This in the Calculator →
          </a>
        </div>
      </article>
    </main>
  );
}