import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HINDI_GUIDES } from "@/lib/hindi-content";
import { SITE_BASE_URL } from "@/lib/sitemap";

/**
 * Hindi guide page — /hi/guides/{id}
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return HINDI_GUIDES.map((guide) => ({ id: guide.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const guide = HINDI_GUIDES.find((g) => g.id === p.id);
    if (!guide) return {};

    return {
      title: guide.title,
      description: guide.excerpt,
      alternates: {
        canonical: `${SITE_BASE_URL}/hi/guides/${guide.id}`,
        languages: {
          "hi-IN": `${SITE_BASE_URL}/hi/guides/${guide.id}`,
          en: `${SITE_BASE_URL}/guides/${guide.id}`,
        },
      },
      openGraph: {
        title: guide.title,
        description: guide.excerpt,
        locale: "hi_IN",
        type: "article",
      },
    };
  });
}

export default async function HindiGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = HINDI_GUIDES.find((g) => g.id === id);

  if (!guide) notFound();

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a href="/?lang=hi" className="hover:text-foreground">होम</a>
          {" / "}
          <span className="text-foreground">{guide.title}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {guide.title}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">{guide.excerpt}</p>
        <p className="mt-2 text-sm text-muted-foreground">{guide.readTime}</p>

        <div className="mt-8 space-y-8">
          {guide.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                {section.heading}
              </h2>
              <p className="text-foreground leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-primary/10 p-6 text-center">
          <p className="text-lg font-medium text-foreground mb-3">
            अपना होम लोन प्रीपेमेंट कैलकुलेटर आज ही आज़माएं
          </p>
          <a
            href="/?tool=prepayment&lang=hi"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            कैलकुलेटर खोलें →
          </a>
        </div>
      </article>
    </main>
  );
}