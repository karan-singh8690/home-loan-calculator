import { VIEW_ORDER, VIEWS } from "@/lib/views";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Main sitemap
 *
 * Contains only real crawlable URLs.
 * The application is a SPA using ?tool=...
 */

export function GET() {
  const lastmod = todayW3C();

  const urls: string[] = [];

  // Homepage
  urls.push(
    urlEntry("/", {
      lastmod,
      changefreq: "daily",
      priority: "1.0",
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
    })
  );

  // Calculator URLs
  for (const viewId of VIEW_ORDER) {
    if (!VIEWS[viewId]) continue;

    const path = `/?tool=${viewId}`;

    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "weekly",
        priority: viewId === "prepayment" ? "0.9" : "0.8",
        alternates: [
          {
            hreflang: "en",
            href: `${SITE_BASE_URL}${path}`,
          },
          {
            hreflang: "hi-IN",
            href: `${SITE_BASE_URL}${path}&lang=hi`,
          },
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
