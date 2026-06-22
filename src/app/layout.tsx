import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FAQS } from "@/lib/faq";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mortgage Overpayment Calculator | See Your Interest & Time Saved",
  description:
    "Free mortgage overpayment calculator. See how much interest you'll save and how many years you'll shave off your mortgage with monthly overpayments, lump sums, or both. Instant, accurate, monthly compounding.",
  keywords: [
    "mortgage overpayment calculator",
    "overpaying mortgage monthly calculator",
    "lump sum mortgage overpayment calculator",
    "how much interest can I save by overpaying",
    "mortgage payoff calculator",
    "extra mortgage payment calculator",
    "amortization calculator with overpayment",
  ],
  authors: [{ name: "OverPayCalc" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Mortgage Overpayment Calculator | See Your Interest & Time Saved",
    description:
      "Find out how much interest you'll save and how many years you'll shave off your mortgage by overpaying. Free, instant, and accurate.",
    url: "https://overpaycalc.example",
    siteName: "OverPayCalc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Overpayment Calculator",
    description:
      "See how much interest you'll save and how soon you'll be debt-free by overpaying your mortgage.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for richer search results (FAQ + WebApplication).
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Overpayment Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free mortgage overpayment calculator. See how much interest you'll save and how many years you'll shave off your mortgage with monthly overpayments, lump sums, or both.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
