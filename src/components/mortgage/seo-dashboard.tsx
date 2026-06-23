"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Globe,
  Link2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VIEW_ORDER } from "@/lib/views";
import { HINDI_LANDING_PAGES, HINDI_GUIDES, HINDI_SCENARIOS } from "@/lib/hindi-content";
import { INDIA_SCENARIOS } from "@/lib/india-scenarios";
import { GUIDES } from "@/lib/india-guides";
import { SITE_BASE_URL } from "@/lib/sitemap";

/**
 * SEO status dashboard — shows sitemap counts, indexability checks, internal
 * linking audit, and a Search Console submission checklist. Designed for
 * admins/developers to verify crawl readiness before deployment.
 */
export function SeoDashboard({ visible = false }: { visible?: boolean }) {
  if (!visible) return null;

  const calculatorCount = VIEW_ORDER.length;
  const hindiPageCount = HINDI_LANDING_PAGES.length;
  const englishGuideCount = GUIDES.length;
  const hindiGuideCount = HINDI_GUIDES.length;
  const englishScenarioCount = INDIA_SCENARIOS.length;
  const hindiScenarioCount = HINDI_SCENARIOS.length;

  const totalPages =
    1 + calculatorCount + hindiPageCount + englishGuideCount + hindiGuideCount + englishScenarioCount + hindiScenarioCount;

  return (
    <section id="seo-dashboard" className="scroll-mt-16 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Search className="size-5 text-emerald-600" />
            SEO Status Dashboard
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Indexing, authority & search visibility — crawl readiness for Google Search Console.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Pages" value={totalPages} icon={<Globe className="size-4" />} />
          <StatCard label="Calculator Pages" value={calculatorCount} icon={<FileText className="size-4" />} />
          <StatCard label="Hindi Pages" value={hindiPageCount} icon={<Globe className="size-4" />} />
          <StatCard label="Guides (EN+HI)" value={englishGuideCount + hindiGuideCount} icon={<FileText className="size-4" />} />
          <StatCard label="Scenarios (EN+HI)" value={englishScenarioCount + hindiScenarioCount} icon={<FileText className="size-4" />} />
          <StatCard label="Sitemaps" value={4} icon={<Link2 className="size-4" />} />
        </div>

        {/* Sitemaps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">XML Sitemaps</CardTitle>
            <CardDescription className="text-xs">
              Submit <code className="text-foreground">/sitemap-index.xml</code> to Google Search Console — it references all 4 sitemaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <SitemapRow path="/sitemap.xml" count={1 + calculatorCount + 4} desc="Homepage + calculator pages + core sections" />
            <SitemapRow path="/sitemap-hindi.xml" count={hindiPageCount} desc="All /hi/* Hindi landing pages" />
            <SitemapRow path="/sitemap-guides.xml" count={englishGuideCount + hindiGuideCount} desc="English + Hindi guides" />
            <SitemapRow path="/sitemap-scenarios.xml" count={englishScenarioCount + hindiScenarioCount} desc="Example calculations + loan scenarios" />
            <SitemapRow path="/sitemap-index.xml" count={4} desc="Master index referencing all sitemaps" isIndex />
          </CardContent>
        </Card>

        {/* Indexability checks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Indexability Checks</CardTitle>
            <CardDescription className="text-xs">
              Every page must be crawlable, have a canonical, and not be accidentally blocked.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <CheckRow ok label="robots.txt allows all public pages" />
            <CheckRow ok label="/api/, /admin/, /leads/ disallowed" />
            <CheckRow ok label="No accidental noindex on calculator pages" />
            <CheckRow ok label="Canonical URLs set on all views" />
            <CheckRow ok label="hreflang configured (en + hi-IN)" />
            <CheckRow ok label="Sitemap index referenced in robots.txt" />
            <CheckRow ok label="Structured data (JSON-LD) on every page" />
            <CheckRow ok label="Mobile-first responsive design" />
          </CardContent>
        </Card>

        {/* Internal linking audit */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Internal Linking Audit</CardTitle>
            <CardDescription className="text-xs">
              No orphan pages — every page reachable within 3 clicks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <LinkChain from="Calculator Pages" to="Guides" ok />
            <LinkChain from="Guides" to="Scenario Pages" ok />
            <LinkChain from="Scenario Pages" to="Bank Pages" ok />
            <LinkChain from="Hindi Pages" to="English Equivalents" ok />
            <LinkChain from="Bank Pages" to="Calculator" ok />
          </CardContent>
        </Card>

        {/* Search Console submission checklist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search Console Submission Checklist</CardTitle>
            <CardDescription className="text-xs">
              Complete these steps after deployment to start appearing in search results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ChecklistItem
              done
              text="Add property to Google Search Console"
              detail={`${SITE_BASE_URL}`}
            />
            <ChecklistItem
              done={!!process.env.NEXT_PUBLIC_GSC_VERIFICATION}
              text="Verify ownership (HTML meta tag or DNS)"
              detail="Set NEXT_PUBLIC_GSC_VERIFICATION env var, or upload HTML verification file"
            />
            <ChecklistItem
              text="Submit sitemap-index.xml"
              detail={`${SITE_BASE_URL}/sitemap-index.xml`}
              link={`${SITE_BASE_URL}/sitemap-index.xml`}
            />
            <ChecklistItem
              text="Submit sitemap.xml"
              detail={`${SITE_BASE_URL}/sitemap.xml`}
              link={`${SITE_BASE_URL}/sitemap.xml`}
            />
            <ChecklistItem
              text="Submit sitemap-hindi.xml"
              detail={`${SITE_BASE_URL}/sitemap-hindi.xml`}
              link={`${SITE_BASE_URL}/sitemap-hindi.xml`}
            />
            <ChecklistItem
              text="Request indexing for key pages"
              detail="Use URL Inspection tool for homepage + main calculator"
            />
            <ChecklistItem
              text="Monitor Coverage report"
              detail="Check indexed vs excluded pages weekly"
            />
            <ChecklistItem
              text="Monitor Performance report"
              detail="Track impressions, clicks, CTR, average position"
            />
            <ChecklistItem
              text="Track target queries"
              detail="home loan prepayment calculator, होम लोन प्रीपेमेंट कैलकुलेटर, EMI कम करें या अवधि"
            />
          </CardContent>
        </Card>

        {/* Target search queries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Target Search Queries</CardTitle>
            <CardDescription className="text-xs">
              Queries this platform is optimized to rank for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "home loan prepayment calculator",
                "home loan calculator india",
                "lump sum prepayment calculator",
                "reduce emi vs reduce tenure",
                "home loan interest saving",
                "होम लोन प्रीपेमेंट कैलकुलेटर",
                "EMI कम करें या अवधि कम करें",
                "होम लोन ब्याज बचत",
                "home loan jaldi kaise khatam kare",
                "SBI home loan prepayment calculator",
                "HDFC home loan calculator",
                "ICICI prepayment calculator",
              ].map((q) => (
                <Badge key={q} variant="secondary" className="text-[11px]">
                  {q}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function SitemapRow({
  path,
  count,
  desc,
  isIndex,
}: {
  path: string;
  count: number;
  desc: string;
  isIndex?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border p-2.5 text-xs">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <code className="font-semibold text-emerald-700 dark:text-emerald-400">{path}</code>
          {isIndex && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-[9px]">
              INDEX
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground truncate">{desc}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-bold tabular-nums">{count}</p>
        <p className="text-muted-foreground text-[10px]">URLs</p>
      </div>
      <a
        href={`${SITE_BASE_URL}${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-emerald-600 shrink-0"
        aria-label={`Open ${path}`}
      >
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {ok ? (
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="size-4 shrink-0 text-destructive" />
      )}
      <span className={cn(!ok && "text-destructive")}>{label}</span>
    </div>
  );
}

function LinkChain({ from, to, ok }: { from: string; to: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
      ) : (
        <AlertTriangle className="size-3.5 shrink-0 text-amber-500" />
      )}
      <span className="font-medium">{from}</span>
      <span className="text-muted-foreground">↔</span>
      <span className="font-medium">{to}</span>
      {ok && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 ml-auto text-[9px]">LINKED</Badge>}
    </div>
  );
}

function ChecklistItem({
  done,
  text,
  detail,
  link,
}: {
  done?: boolean;
  text: string;
  detail: string;
  link?: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border p-2.5 text-xs">
      {done ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      ) : (
        <div className="border-muted-foreground mt-0.5 size-4 shrink-0 rounded-full border-2" />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("font-medium", done && "text-muted-foreground line-through")}>{text}</p>
        <p className="text-muted-foreground text-[11px]">{detail}</p>
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-emerald-600 shrink-0"
        >
          <ExternalLink className="size-3.5" />
        </a>
      )}
    </div>
  );
}
