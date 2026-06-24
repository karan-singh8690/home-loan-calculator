import { SITE_BASE_URL, todayW3C, sitemapIndexXml } from "@/lib/sitemap";

/**
 * Sitemap index — references all 4 sitemaps so Search Console only needs to
 * submit a single URL. Auto-updates lastmod on every request.
 *
 * Route: /sitemap-index.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const xml = sitemapIndexXml([
    { loc: `${SITE_BASE_URL}/sitemap.xml`, lastmod },
    { loc: `${SITE_BASE_URL}/sitemap-hindi.xml`, lastmod },
    { loc: `${SITE_BASE_URL}/sitemap-guides.xml`, lastmod },
    { loc: `${SITE_BASE_URL}/sitemap-scenarios.xml`, lastmod },
  ]);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
