import { GUIDES } from "@/lib/india-guides";
import { HINDI_GUIDES } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Guides sitemap — English guides (from india-guides.ts) and Hindi guides
 * (from hindi-content.ts HINDI_GUIDES). Each guide gets its own URL entry
 * with hreflang alternates where an equivalent exists in the other language.
 *
 * Route: /sitemap-guides.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const urls: string[] = [];

  // English guides — anchored to /#guides with a slug fragment.
  for (let i = 0; i < GUIDES.length; i++) {
    const g = GUIDES[i];
    const slug = g.id || `guide-${i}`;
    const path = `/guides/${slug}`;
    // Find a Hindi equivalent by title similarity (best-effort).
    const hiEquivalent = HINDI_GUIDES[i];
    const alternates = hiEquivalent
      ? [
          { hreflang: "en", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}/hi/guides/${hiEquivalent.id}` },
        ]
      : [{ hreflang: "en", href: `${SITE_BASE_URL}${path}` }];
    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
        alternates,
      })
    );
  }

  // Hindi guides
  for (const g of HINDI_GUIDES) {
    const path = `/hi/guides/${g.id}`;
    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
        alternates: [
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "en", href: `${SITE_BASE_URL}/#guides` },
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
