import { VIEW_ORDER, VIEWS } from "@/lib/views";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Main sitemap — homepage, all calculator views, and core landing pages.
 *
 * IMPORTANT: The app is a single-page application that uses query parameters
 * (?tool=prepayment) for view switching. The sitemap must list the ACTUAL
 * working URLs (with query params), not the canonical paths (which return 404).
 *
 * Route: /sitemap.xml
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
        { hreflang: "en", href: `${SITE_BASE_URL}/` },
        { hreflang: "hi-IN", href: `${SITE_BASE_URL}/?lang=hi` },
      ],
    })
  );

  // All calculator views — use ?tool= query param (the actual working URL)
  for (const viewId of VIEW_ORDER) {
    const view = VIEWS[viewId];
    if (!view) continue;
    const path = `/?tool=${viewId}`;
    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "weekly",
        priority: viewId === "prepayment" ? "0.9" : "0.8",
        alternates: [
          { hreflang: "en", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${path}&lang=hi` },
        ],
      })
    );
  }

  // Core sections (anchor links on the homepage — these resolve to 200)
  urls.push(
    urlEntry("/#scenarios", { lastmod, changefreq: "weekly", priority: "0.7" }),
    urlEntry("/#guides", { lastmod, changefreq: "weekly", priority: "0.7" }),
    urlEntry("/#faq", { lastmod, changefreq: "monthly", priority: "0.6" }),
    urlEntry("/#how-it-works", { lastmod, changefreq: "monthly", priority: "0.6" })
  );

  const xml = sitemapXml(urls);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
