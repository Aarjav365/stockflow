import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";

import { StockflowLanding } from "@/components/landing/stockflow-landing";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

const homeTitle =
  "StockFlow — Multi-warehouse inventory & audit-ready ledger";
const homeDescription =
  "Warehouse and inventory management with receipts, deliveries, transfers, adjustments, multi-warehouse stock, and a full audit ledger. Get started—see inventory clarity built in.";
const siteUrl = getSiteUrl();
const homeUrl = `${siteUrl}/`;
const ogImageUrl = `${siteUrl}/hero.png`;
const ogImageAlt =
  "StockFlow — Multi-warehouse inventory with an audit-ready ledger";

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeDescription,
  keywords: [
    "inventory management",
    "warehouse software",
    "stock control",
    "multi-warehouse",
    "inventory ledger",
    "receipts",
    "stock transfers",
    "WMS",
  ],
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: homeUrl,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1898,
        height: 840,
        alt: ogImageAlt,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [
      {
        url: ogImageUrl,
        width: 1898,
        height: 840,
        alt: ogImageAlt,
      },
    ],
  },
  alternates: {
    canonical: homeUrl,
  },
};

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-landing-heading",
  display: "swap",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-landing-body",
  display: "swap",
});

export default function HomePage() {
  return (
    <div
      className={cn(
        instrumentSerif.variable,
        barlow.variable,
        "min-h-svh bg-background"
      )}
    >
      <StockflowLanding />
    </div>
  );
}
