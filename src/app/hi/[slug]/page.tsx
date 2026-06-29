import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HINDI_LANDING_PAGES, getHindiLandingPage } from "@/lib/hindi-content";
import { SITE_BASE_URL } from "@/lib/sitemap";

/**
 * Hindi landing page — /hi/{slug}
 *
 * Renders any of the 51 Hindi landing pages (calculator, bank, hinglish,
 * scenario, or guide type) by matching the canonical path.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return HINDI_LANDING_PAGES.map((page) => ({
    slug: page.canonical.replace("/hi/", ""),
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const page = getHindiLandingPage(`/hi/${p.slug}`);
    if (!page) return {};

    return {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: {
        canonical: `${SITE_BASE_URL}${page.canonical}`,
        languages: {
          "hi-IN": `${SITE_BASE_URL}${page.canonical}`,
          en: `${SITE_BASE_URL}/`,
        },
      },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: `${SITE_BASE_URL}${page.canonical}`,
        locale: "hi_IN",
      },
    };
  });
}

export default async function HindiLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getHindiLandingPage(`/hi/${slug}`);

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-foreground">होम</a>
          {" / "}
          <span className="text-foreground">{page.h1}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {page.h1}
        </h1>

        {/* Intro */}
        <p className="mt-4 text-lg text-muted-foreground">{page.intro}</p>

        {/* Body */}
        <div
          className="prose prose-lg mt-8 max-w-none text-foreground
                      prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
                      prose-p:leading-relaxed prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />

        {/* FAQs */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              अक्सर पूछे जाने वाले प्रश्न
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-primary/10 p-6 text-center">
          <p className="text-lg font-medium text-foreground mb-3">
            अपना होम लोन प्रीपेमेंट कैलकुलेटर आज ही आज़माएं
          </p>
          <a
            href="/?lang=hi"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            कैलकुलेटर खोलें →
          </a>
        </div>
      </article>
    </main>
  );
}