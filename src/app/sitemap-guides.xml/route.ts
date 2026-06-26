import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Guides sitemap — English and Hindi guides.
 *
 * IMPORTANT: Guides are displayed as accordion sections on the main page
 * (anchored at /#guides and /?lang=hi#guides). They don't have standalone
 * routes yet. We list the actual working URLs to avoid 404s.
 *
 * Route: /sitemap-guides.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const urls: string[] = [];

  // English guides section
  urls.push(
    urlEntry("/#guides", {
      lastmod,
      changefreq: "weekly",
      priority: "0.7",
      alternates: [
        { hreflang: "en", href: `${SITE_BASE_URL}/#guides` },
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi#guides` },
      ],
    })
  );

  // Hindi guides section
  urls.push(
    urlEntry("/?lang=hi#guides", {
      lastmod,
      changefreq: "weekly",
      priority: "0.7",
      alternates: [
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi#guides` },
        { hreflang: "en", href: `${SITE_BASE_URL}/#guides` },
      ],
    })
  );

  // English how-it-works section
  urls.push(
    urlEntry("/#how-it-works", {
      lastmod,
      changefreq: "monthly",
      priority: "0.6",
      alternates: [
        { hreflang: "en", href: `${SITE_BASE_URL}/#how-it-works` },
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi#how-it-works` },
      ],
    })
  );

  // Hindi how-it-works section
  urls.push(
    urlEntry("/?lang=hi#how-it-works", {
      lastmod,
      changefreq: "monthly",
      priority: "0.6",
      alternates: [
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi#how-it-works` },
        { hreflang: "en", href: `${SITE_BASE_URL}/#how-it-works` },
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
