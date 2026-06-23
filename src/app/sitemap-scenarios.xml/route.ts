import { INDIA_SCENARIOS } from "@/lib/india-scenarios";
import { HINDI_SCENARIOS } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Scenarios sitemap — example calculations and loan-amount scenarios from
 * INDIA_SCENARIOS (English) and HINDI_SCENARIOS (Hindi).
 *
 * Route: /sitemap-scenarios.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const urls: string[] = [];

  // English scenarios
  for (const scn of INDIA_SCENARIOS) {
    const path = `/scenarios/${scn.id}`;
    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.6",
        alternates: [
          { hreflang: "en", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}/hi/scenarios/${scn.id}` },
        ],
      })
    );
  }

  // Hindi scenarios
  for (const scn of HINDI_SCENARIOS) {
    const path = `/hi/scenarios/${scn.id}`;
    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.6",
        alternates: [
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "en", href: `${SITE_BASE_URL}/#scenarios` },
        ],
      })
    );
  }

  const xml = sitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
