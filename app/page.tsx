import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";

import { StockflowLanding } from "@/components/landing/stockflow-landing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "StockFlow — Warehouse & inventory management",
  description:
    "Warehouse and inventory management with receipts, deliveries, transfers, adjustments, multi-warehouse stock, and a full audit ledger.",
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
