/**
 * Base configuration for sitemaps, robots.txt, and canonical URLs.
 *
 * In production this would be set via an environment variable. The fallback
 * is a placeholder domain that should be replaced at deploy time.
 */
export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://emisavings.vercel.app";

/** Current date in W3C datetime format for <lastmod> tags. */
export function todayW3C(): string {
  return new Date().toISOString().split("T")[0];
}

/** Escape XML special characters in a URL. */
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Build a full <url> entry for a sitemap. */
export function urlEntry(
  path: string,
  opts?: { lastmod?: string; changefreq?: string; priority?: string; alternates?: { hreflang: string; href: string }[] }
): string {
  const loc = `<loc>${xmlEscape(`${SITE_BASE_URL}${path}`)}</loc>`;
  const lastmod = opts?.lastmod ? `<lastmod>${opts.lastmod}</lastmod>` : "";
  const changefreq = opts?.changefreq ? `<changefreq>${opts.changefreq}</changefreq>` : "";
  const priority = opts?.priority ? `<priority>${opts.priority}</priority>` : "";
  const alternates = opts?.alternates
    ? opts.alternates
        .map(
          (a) =>
            `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}"/>`
        )
        .join("")
    : "";
  return `  <url>${loc}${lastmod}${changefreq}${priority}${alternates}</url>`;
}

/** Wrap URL entries in a sitemap XML document. */
export function sitemapXml(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
}

/** Wrap sitemap references in a sitemap-index XML document. */
export function sitemapIndexXml(sitemaps: { loc: string; lastmod?: string }[]): string {
  const entries = sitemaps
    .map(
      (s) =>
        `  <sitemap><loc>${xmlEscape(s.loc)}</loc>${
          s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ""
        }</sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}
