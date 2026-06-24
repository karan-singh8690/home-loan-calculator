import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/sitemap";

/**
 * Production-ready robots.txt — allows all search engines to crawl public
 * pages while blocking APIs, admin, leads, and private endpoints.
 *
 * Route: /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/api/*",
          "/admin/",
          "/dashboard/",
          "/leads/",
          "/private/",
        ],
      },
      // Explicitly allow key crawlers (redundant with the * rule above, but
      // makes intent clear for Search Console).
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/dashboard/", "/leads/", "/private/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/dashboard/", "/leads/", "/private/"],
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap-index.xml`,
    host: SITE_BASE_URL,
  };
}
