import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Scenarios sitemap
 *
 * Scenarios live on the homepage.
 */

export function GET() {
  const lastmod = todayW3C();

  const urls = [
    urlEntry("/", {
      lastmod,
      changefreq: "weekly",
      priority: "0.7",
      alternates: [
        {
          hreflang: "en",
          href: `${SITE_BASE_URL}/`,
        },
        {
          hreflang: "hi-IN",
          href: `${SITE_BASE_URL}/?lang=hi`,
        },
      ],
    }),

    urlEntry("/?lang=hi", {
      lastmod,
      changefreq: "weekly",
      priority: "0.7",
      alternates: [
        {
          hreflang: "hi-IN",
          href: `${SITE_BASE_URL}/?lang=hi`,
        },
        {
          hreflang: "en",
          href: `${SITE_BASE_URL}/`,
        },
      ],
    }),
  ];

  return new Response(sitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public,max-age=3600,s-maxage=3600",
    },
  });
}
