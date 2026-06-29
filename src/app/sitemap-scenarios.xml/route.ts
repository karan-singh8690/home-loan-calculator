import { INDIA_SCENARIOS } from "@/lib/india-scenarios";
import { HINDI_SCENARIOS } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Scenarios sitemap
 *
 * Lists all English scenarios (/scenarios/{id}) and Hindi scenarios
 * (/hi/scenarios/{id}).
 * Rendered by src/app/scenarios/[id]/page.tsx and src/app/hi/scenarios/[id]/page.tsx.
 */

export function GET() {
  const lastmod = todayW3C();

  const urls: string[] = [];

  // English scenarios — /scenarios/{id}
  for (const scenario of INDIA_SCENARIOS) {
    const path = `/scenarios/${scenario.id}`;

    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
        alternates: [
          { hreflang: "en", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi` },
        ],
      })
    );
  }

  // Hindi scenarios — /hi/scenarios/{id}
  for (const scenario of HINDI_SCENARIOS) {
    const path = `/hi/scenarios/${scenario.id}`;

    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
        alternates: [
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "en", href: `${SITE_BASE_URL}/` },
        ],
      })
    );
  }

  return new Response(sitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public,max-age=3600,s-maxage=3600",
    },
  });
}