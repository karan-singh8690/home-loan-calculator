import { GUIDES } from "@/lib/india-guides";
import { HINDI_GUIDES } from "@/lib/hindi-content";
import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Guides sitemap
 *
 * Lists all English guides (/guides/{id}) and Hindi guides (/hi/guides/{id}).
 * Rendered by src/app/guides/[id]/page.tsx and src/app/hi/guides/[id]/page.tsx.
 */

export function GET() {
  const lastmod = todayW3C();

  const urls: string[] = [];
  const hindiGuideIds = new Set(HINDI_GUIDES.map((g) => g.id));

  // English guides — /guides/{id}
  for (const guide of GUIDES) {
    const path = `/guides/${guide.id}`;
    const hiPath = hindiGuideIds.has(guide.id)
      ? `/hi/guides/${guide.id}`
      : "/?lang=hi";

    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
        alternates: [
          { hreflang: "en", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${hiPath}` },
        ],
      })
    );
  }

  // Hindi guides — /hi/guides/{id}
  const englishGuideIds = new Set(GUIDES.map((g) => g.id));
  for (const guide of HINDI_GUIDES) {
    const path = `/hi/guides/${guide.id}`;
    const enPath = englishGuideIds.has(guide.id)
      ? `/guides/${guide.id}`
      : "/";

    urls.push(
      urlEntry(path, {
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
        alternates: [
          { hreflang: "hi-IN", href: `${SITE_BASE_URL}${path}` },
          { hreflang: "en", href: `${SITE_BASE_URL}${enPath}` },
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