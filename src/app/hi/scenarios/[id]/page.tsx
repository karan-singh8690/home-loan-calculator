import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HINDI_SCENARIOS } from "@/lib/hindi-content";
import { SITE_BASE_URL } from "@/lib/sitemap";
import { formatCurrency } from "@/lib/format";

/**
 * Hindi scenario page — /hi/scenarios/{id}
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return HINDI_SCENARIOS.map((s) => ({ id: s.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const scenario = HINDI_SCENARIOS.find((s) => s.id === p.id);
    if (!scenario) return {};

    return {
      title: `${scenario.title} | होम लोन प्रीपेमेंट परिदृश्य`,
      description: scenario.strategy,
      alternates: {
        canonical: `${SITE_BASE_URL}/hi/scenarios/${scenario.id}`,
        languages: {
          "hi-IN": `${SITE_BASE_URL}/hi/scenarios/${scenario.id}`,
          en: `${SITE_BASE_URL}/`,
        },
      },
      openGraph: {
        title: scenario.title,
        description: scenario.strategy,
        locale: "hi_IN",
        type: "article",
      },
    };
  });
}

export default async function HindiScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = HINDI_SCENARIOS.find((s) => s.id === id);

  if (!scenario) notFound();

  const { input } = scenario;
  const prepaymentParts: string[] = [];
  if (input.overpaymentMonthly > 0)
    prepaymentParts.push(`${formatCurrency(input.overpaymentMonthly)}/माह`);
  if (input.overpaymentAnnual > 0)
    prepaymentParts.push(`${formatCurrency(input.overpaymentAnnual)}/साल`);
  if (input.overpaymentLumpSum > 0)
    prepaymentParts.push(`${formatCurrency(input.overpaymentLumpSum)} एकमुश्त (महीना ${input.overpaymentStartMonth})`);

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a href="/?lang=hi" className="hover:text-foreground">होम</a>
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

        <div className="mt-8 rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">लोन और प्रीपेमेंट विवरण</h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">लोन राशि</dt>
              <dd className="text-lg font-semibold text-foreground">{formatCurrency(input.loanAmount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">ब्याज दर</dt>
              <dd className="text-lg font-semibold text-foreground">{input.annualRate}% प्रति वर्ष</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">अवधि</dt>
              <dd className="text-lg font-semibold text-foreground">{input.termMonths / 12} वर्ष</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">प्रीपेमेंट</dt>
              <dd className="text-lg font-semibold text-foreground">
                {prepaymentParts.length > 0 ? prepaymentParts.join(" + ") : "कोई नहीं"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-12 rounded-xl bg-primary/10 p-6 text-center">
          <p className="text-lg font-medium text-foreground mb-3">
            इस रणनीति से अपनी सटीक बचत देखें — अपनी संख्या दर्ज करें।
          </p>
          <a
            href={`/?tool=prepayment&lang=hi&loan=${input.loanAmount}&rate=${input.annualRate}&term=${input.termMonths}&monthly=${input.overpaymentMonthly}&lumpsum=${input.overpaymentLumpSum}&annual=${input.overpaymentAnnual}&start=${input.overpaymentStartMonth}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            कैलकुलेटर में आज़माएं →
          </a>
        </div>
      </article>
    </main>
  );
}