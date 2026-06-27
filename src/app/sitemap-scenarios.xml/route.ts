import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Scenarios sitemap — example calculations and loan scenarios.
 *
 * IMPORTANT: Scenarios are displayed as cards on the main page (anchored at
 * /#scenarios and /?lang=hi#scenarios). They don't have standalone routes yet.
 * We list the actual working URLs to avoid 404s.
 *
 * Route: /sitemap-scenarios.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const urls: string[] = [];

  // English scenarios section
  urls.push(
    urlEntry("/scenarios", {
      lastmod,
      changefreq: "weekly",
      priority: "0.8",
      alternates: [
        { hreflang: "en", href: `${SITE_BASE_URL}/scenarios` },
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/hi/scenarios` },
      ],
    })
  );

  // Hindi scenarios section
  urls.push(
    urlEntry("/hi/scenarios", {
      lastmod,
      changefreq: "weekly",
      priority: "0.8",
      alternates: [
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/hi/scenarios` },
        { hreflang: "en", href: `${SITE_BASE_URL}/scenarios` },
      ],
    })
  );

  const xml = sitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
