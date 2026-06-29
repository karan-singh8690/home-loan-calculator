import { HINDI_LANDING_PAGES } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Hindi Sitemap
 *
 * Lists all 51 Hindi landing pages at their canonical /hi/{slug} paths.
 * Each page is rendered by src/app/hi/[slug]/page.tsx.
 */

export function GET() {
  const lastmod = todayW3C();

  const urls: string[] = [];

  for (const page of HINDI_LANDING_PAGES) {
    const path = page.canonical; // e.g. "/hi/home-loan-prepayment-calculator"

    const priority =
      page.type === "calculator" || page.type === "bank"
        ? "0.8"
        : page.type === "scenario"
        ? "0.7"
        : "0.6";

    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "weekly",
        priority,
        alternates: [
          {
            hreflang: "hi-IN",
            href: `${SITE_BASE_URL}${path}`,
          },
          {
            hreflang: "en",
            href: `${SITE_BASE_URL}/`,
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