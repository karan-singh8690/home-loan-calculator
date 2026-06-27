import { SITE_BASE_URL, todayW3C, sitemapIndexXml } from "@/lib/sitemap";

export function GET() {
  const lastmod = todayW3C();

  return new Response(
    sitemapIndexXml([
      { loc: `${SITE_BASE_URL}/sitemap.xml`, lastmod },
      { loc: `${SITE_BASE_URL}/sitemap-hindi.xml`, lastmod },
      { loc: `${SITE_BASE_URL}/sitemap-guides.xml`, lastmod },
      { loc: `${SITE_BASE_URL}/sitemap-scenarios.xml`, lastmod },
    ]),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public,max-age=3600,s-maxage=3600",
      },
    }
  );
}
