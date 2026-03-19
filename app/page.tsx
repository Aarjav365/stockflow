import type { Metadata } from "next";
import Link from "next/link";
import { Outfit } from "next/font/google";
import {
  ArrowRight,
  Package,
  ArrowLeftRight,
  ClipboardCheck,
  Warehouse,
  History,
  ShieldCheck,
  TrendingDown,
  FileCheck,
  PackageMinus,
  PackagePlus,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "StockFlow — Inventory management, simplified.",
  description:
    "Real-time stock, receipts, deliveries, and transfers across warehouses. Enterprise-grade inventory management.",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Package, label: "Products & SKUs" },
  { icon: ClipboardCheck, label: "Receipts & deliveries" },
  { icon: ArrowLeftRight, label: "Transfers" },
  { icon: Warehouse, label: "Multi-warehouse" },
];

const OPERATIONS: {
  icon: LucideIcon;
  title: string;
  description: string;
  featured?: boolean;
}[] = [
  {
    icon: PackagePlus,
    title: "Receipts",
    description:
      "Receive goods from suppliers with line-level tracking (ordered vs received). Draft → Ready → Done.",
    featured: true,
  },
  {
    icon: PackageMinus,
    title: "Deliveries",
    description:
      "Fulfill customer orders with delivery document management and auto-generated numbers.",
  },
  {
    icon: ArrowLeftRight,
    title: "Transfers",
    description:
      "Move inventory between warehouses with from/to tracking and full move history.",
  },
  {
    icon: SlidersHorizontal,
    title: "Adjustments",
    description:
      "Reconcile physical counts against recorded quantities. Every change is audited.",
  },
];

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: History,
    title: "Full audit trail",
    description:
      "Stock ledger records every quantity change with reference and timestamp.",
  },
  {
    icon: TrendingDown,
    title: "Low-stock alerts",
    description:
      "Configurable reorder thresholds and alerts so you never run out.",
  },
  {
    icon: ShieldCheck,
    title: "Org-scoped & secure",
    description:
      "Organization-based isolation, OTP verification, and JWT sessions.",
  },
  {
    icon: FileCheck,
    title: "Document workflow",
    description:
      "Draft → Waiting → Ready → Done lifecycle with collision-safe numbering.",
  },
];

function FloatingOrbs() {
  const orbs = [
    {
      className:
        "left-[10%] top-[18%] h-64 w-64 rounded-full bg-chart-1/20 blur-3xl animate-float",
      style: { animationDelay: "0s" },
    },
    {
      className:
        "right-[5%] top-[35%] h-48 w-48 rounded-full bg-chart-3/25 blur-3xl animate-float-slow",
      style: { animationDelay: "1.5s" },
    },
    {
      className:
        "left-[60%] top-[55%] h-56 w-56 rounded-full bg-primary/10 blur-3xl animate-float-slower",
      style: { animationDelay: "3s" },
    },
    {
      className:
        "left-[15%] top-[70%] h-40 w-40 rounded-full bg-chart-2/20 blur-3xl animate-float",
      style: { animationDelay: "2s" },
    },
    {
      className:
        "right-[20%] top-[78%] h-32 w-32 rounded-full bg-chart-4/20 blur-2xl animate-float-slow",
      style: { animationDelay: "0.5s" },
    },
    {
      className:
        "left-[45%] top-[12%] h-24 w-24 rounded-full bg-muted-foreground/10 blur-2xl animate-float-slower",
      style: { animationDelay: "2.5s" },
    },
  ];
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={cn("pointer-events-none absolute", orb.className)}
          style={orb.style}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function LandingPage(): React.ReactNode {
  return (
    <div
      className={cn(
        "relative min-h-svh overflow-x-hidden bg-background",
        outfit.variable
      )}
    >
      {/* Layered background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_45%),linear-gradient(160deg,oklch(0.97_0.015_264/0.35)_0%,transparent_45%)] dark:bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_45%),linear-gradient(160deg,oklch(0.22_0.02_264/0.2)_0%,transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <FloatingOrbs />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-8">
        <span
          className="text-lg font-semibold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}
        >
          StockFlow
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center px-6 pb-36 sm:px-8">
        {/* Hero */}
        <section className="relative flex flex-col items-center pt-14 sm:pt-20">
          <h1
            className="max-w-3xl text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.1]"
            style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}
          >
            Inventory management,{" "}
            <span className="text-primary">simplified.</span>
          </h1>
          <p className="mt-6 max-w-xl text-center text-lg text-muted-foreground sm:text-xl">
            Real-time stock, receipts, deliveries, and transfers across
            warehouses. One place for your entire operation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/sign-up">
                Get started
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* Feature pills — staggered and hover lift */}
        <section className="mt-20 w-full max-w-2xl" aria-label="Features overview">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card/90 hover:shadow-md"
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <Icon
                  className="size-6 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Operations — bento: one featured large, rest grid */}
        <section className="mt-28 w-full max-w-5xl" aria-labelledby="operations-heading">
          <h2
            id="operations-heading"
            className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}
          >
            Warehouse operations, end to end
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Document-driven workflow with auto-generated numbers and full traceability.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            {OPERATIONS.map(({ icon: Icon, title, description, featured }) => (
              <Card
                key={title}
                className={cn(
                  "group border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                  featured && "sm:col-span-2 lg:col-span-1 lg:row-span-2"
                )}
              >
                <CardHeader className={featured ? "pb-2" : ""}>
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl text-primary transition-transform duration-300 group-hover:scale-105",
                      featured ? "size-14 bg-primary/15" : "size-10 bg-primary/10"
                    )}
                  >
                    <Icon
                      className={featured ? "size-7" : "size-5"}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <CardTitle className={cn("text-base", featured && "text-lg")}>
                    {title}
                  </CardTitle>
                  <CardDescription
                    className={cn("text-sm", featured && "text-sm leading-relaxed")}
                  >
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits — alternating layout, floating feel */}
        <section className="mt-28 w-full max-w-5xl" aria-labelledby="benefits-heading">
          <h2
            id="benefits-heading"
            className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}
          >
            Built for clarity and control
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            From ledger to alerts, your data stays organized and auditable.
          </p>
          <div className="mt-12 flex flex-col gap-6 sm:gap-8">
            {BENEFITS.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={cn(
                  "flex flex-col items-start gap-4 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-card/80 hover:shadow-md sm:flex-row sm:items-center sm:gap-6",
                  i % 2 === 1 && "sm:flex-row-reverse"
                )}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground transition-transform duration-300 hover:scale-105">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — with soft glowing blob behind */}
        <section
          className="relative mt-28 w-full max-w-2xl"
          aria-labelledby="cta-heading"
        >
          <div
            className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl animate-glow-pulse"
            aria-hidden
          />
          <div className="relative rounded-2xl border border-border/60 bg-card/70 px-8 py-12 text-center backdrop-blur-md">
            <h2
              id="cta-heading"
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}
            >
              Ready to simplify your inventory?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Create an account and start tracking stock in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/sign-up">
                  Get started free
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 bg-background/80 px-6 py-6 backdrop-blur-sm sm:px-8">
        <nav
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
        </nav>
      </footer>
    </div>
  );
}