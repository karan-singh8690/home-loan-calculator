import type { Metadata } from "next";

import { HomeLoanPlatform } from "./home-client";
import { getView, isViewId, viewUrl, type ViewId } from "@/lib/views";
import { SITE_BASE_URL } from "@/lib/sitemap";

/**
 * Server-side metadata generation.
 *
 * Canonical URLs and hreflang alternates MUST match the URLs published in the
 * sitemap (`/?tool=<id>`) — never the "pretty" paths in `view.canonical`,
 * because those paths do not exist as routes and would 404.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const tool = typeof params.tool === "string" ? params.tool : "";
  const lang = typeof params.lang === "string" ? params.lang : "en";
  const viewId: ViewId = isViewId(tool) ? (tool as ViewId) : "prepayment";
  const view = getView(viewId);
  const isHindi = lang === "hi";

  const enUrl = `${SITE_BASE_URL}${viewUrl(viewId, "en")}`;
  const hiUrl = `${SITE_BASE_URL}${viewUrl(viewId, "hi")}`;

  return {
    title: isHindi ? view.metaTitle : view.metaTitle,
    description: view.metaDescription,
    alternates: {
      canonical: isHindi ? hiUrl : enUrl,
      languages: {
        en: enUrl,
        "hi-IN": hiUrl,
        "x-default": enUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function Page() {
  return <HomeLoanPlatform />;
}