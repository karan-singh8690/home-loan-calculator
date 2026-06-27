import { SITE_BASE_URL, todayW3C, urlEntry, sitemapXml } from "@/lib/sitemap";

/**
 * Hindi Sitemap
 *
 * Lists only real Hindi SPA URLs.
 */

export function GET() {
  const lastmod = todayW3C();

  const urls: string[] = [];

  urls.push(
    urlEntry("/?lang=hi", {
      lastmod,
      changefreq: "daily",
      priority: "1.0",
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
    })
  );

  const tools = [
    "prepayment",
    "emi",
    "reduce-emi-vs-tenure",
    "interest-saving",
    "sbi",
    "hdfc",
    "icici",
    "axis",
  ];

  for (const tool of tools) {
    urls.push(
      urlEntry(`/?tool=${tool}&lang=hi`, {
        lastmod,
        changefreq: "weekly",
        priority: tool === "prepayment" ? "0.9" : "0.8",
        alternates: [
          {
            hreflang: "hi-IN",
            href: `${SITE_BASE_URL}/?tool=${tool}&lang=hi`,
          },
          {
            hreflang: "en",
            href: `${SITE_BASE_URL}/?tool=${tool}`,
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
