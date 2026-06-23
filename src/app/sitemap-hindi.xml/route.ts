import { HINDI_LANDING_PAGES } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Hindi sitemap — all /hi/* pages from HINDI_LANDING_PAGES (51 pages).
 * Includes hreflang alternates linking back to English equivalents.
 *
 * Route: /sitemap-hindi.xml
 */
export function GET() {
  const lastmod = todayW3C();
  const urls: string[] = [];

  for (const page of HINDI_LANDING_PAGES) {
    const hiPath = page.canonical; // already starts with /hi/...
    const enPath = hiPath.replace(/^\/hi/, ""); // English equivalent
    urls.push(
      urlEntry(hiPath, {
        lastmod,
        changefreq: page.type === "calculator" ? "weekly" : "monthly",
        priority: page.type === "calculator" ? "0.8" : "0.6",
        alternates: [
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${hiPath}` },
          { hreflang: "en", href: `${SITE_BASE_URL}${enPath}` },
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
