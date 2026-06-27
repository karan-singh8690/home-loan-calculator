import { HINDI_LANDING_PAGES } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Hindi sitemap — all Hindi landing pages.
 *
 * IMPORTANT: The app is a single-page application. Hindi pages are accessed
 * via /?lang=hi (the Hindi version of the main calculator). The individual
 * Hindi landing page canonical paths (/hi/...) don't have actual routes yet.
 * To avoid 404s in the sitemap, we list the main Hindi entry point and the
 * anchor sections that work. When standalone /hi/ routes are added later,
 * the full list can be restored.
 *
 * Route: /sitemap-hindi.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const urls: string[] = [];

  // Main Hindi entry point (the actual working URL)
  urls.push(
    urlEntry("/?lang=hi", {
      lastmod,
      changefreq: "daily",
      priority: "1.0",
      alternates: [
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi` },
        { hreflang: "en", href: `${SITE_BASE_URL}/` },
      ],
    })
  );

  // Hindi calculator views (accessible via ?tool=X&lang=hi)
  const hindiViews = [
    { tool: "prepayment", priority: "0.9" },
    { tool: "emi", priority: "0.8" },
    { tool: "reduce-emi-vs-tenure", priority: "0.8" },
    { tool: "interest-saving", priority: "0.8" },
    { tool: "sbi", priority: "0.8" },
    { tool: "hdfc", priority: "0.8" },
    { tool: "icici", priority: "0.8" },
    { tool: "axis", priority: "0.8" },
  ];

  for (const v of hindiViews) {
    const path = `/?tool=${v.tool}&lang=hi`;
    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "weekly",
        priority: v.priority,
        alternates: [
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "en", href: `${SITE_BASE_URL}/?tool=${v.tool}` },
        ],
      })
    );
  }

  // Hindi anchor sections on the page
  urls.push(
    urlEntry("/hi/scenarios", { lastmod, changefreq: "weekly", priority: "0.7" }),
    urlEntry("/hi/guides", { lastmod, changefreq: "weekly", priority: "0.7" }),
    urlEntry("/hi/faq", { lastmod, changefreq: "monthly", priority: "0.6" }),
    urlEntry("/hi/hindi-pages", { lastmod, changefreq: "weekly", priority: "0.7" })
  );

  const xml = sitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
