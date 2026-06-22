import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Loan Calculator India | EMI & Prepayment Calculator",
  description:
    "Free India home loan EMI and prepayment calculator. Calculate your monthly EMI, see how much interest you'll save with prepayments, and compare reduce-EMI vs reduce-tenure. Works for SBI, HDFC, ICICI, Axis home loans.",
  keywords: [
    "home loan prepayment calculator india",
    "home loan emi calculator",
    "reduce emi vs reduce tenure calculator",
    "home loan interest saving calculator",
    "sbi home loan calculator",
    "hdfc home loan calculator",
    "icici home loan calculator",
    "axis home loan calculator",
    "home loan prepayment",
    "emi calculator india",
  ],
  authors: [{ name: "HomeLoan Calc" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Home Loan Calculator India | EMI & Prepayment Calculator",
    description:
      "Calculate your home loan EMI, see prepayment savings, and compare reduce-EMI vs reduce-tenure. Free, instant, with Indian rupee formatting. SBI, HDFC, ICICI, Axis.",
    url: "https://homeloan-calculator.example",
    siteName: "HomeLoan Calc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Loan Calculator India",
    description:
      "EMI & prepayment calculator for Indian home loans. See interest saved, tenure reduction, and payoff dates.",
  },
  alternates: {
    canonical: "https://homeloan-calculator.example/home-loan-prepayment-calculator-india",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Platform-level WebApplication JSON-LD. View-specific FAQ and Breadcrumb
  // schemas are injected client-side by the DynamicMeta/Breadcrumb components.
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HomeLoan Calc — India Home Loan Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free India home loan EMI and prepayment calculator. Calculate EMI, interest saved, and tenure reduction with monthly prepayments, lump sums, or both.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    areaServed: "IN",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
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
