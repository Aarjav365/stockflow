"use client";

import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  History,
  Package,
  Shield,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { BlurText } from "@/components/landing/blur-text";
import { HeroAmbient } from "@/components/landing/hero-ambient";
import { LandingNavbar } from "@/components/landing/navbar";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import {
  faqItems,
  partners,
  processSteps,
  stackItems,
  workShowcase,
} from "@/lib/data/landing-content";
import { cn } from "@/lib/utils";

type HeadingAccentVariant = "frost" | "aurora";

/** Wraps the first case-insensitive match of `accent` in `text` with a landing gradient. */
function HeadingAccent({
  text,
  accent,
  variant = "frost",
}: {
  text: string;
  accent: string;
  variant?: HeadingAccentVariant;
}) {
  const cls =
    variant === "frost" ? "text-gradient-frost" : "text-gradient-aurora";
  const lower = text.toLowerCase();
  const needle = accent.toLowerCase();
  const idx = lower.indexOf(needle);
  if (idx < 0) {
    return text;
  }
  const before = text.slice(0, idx);
  const mid = text.slice(idx, idx + accent.length);
  const after = text.slice(idx + accent.length);
  return (
    <>
      {before}
      <span className={cls}>{mid}</span>
      {after}
    </>
  );
}

function GradientBackdrop({
  variant,
}: {
  variant: "hero" | "process" | "stats" | "cta";
}) {
  const mod =
    variant === "hero"
      ? "gradient-bg--hero"
      : variant === "process"
        ? "gradient-bg--process"
        : variant === "stats"
          ? "gradient-bg--stats"
          : "gradient-bg--cta";

  return (
    <div className={`gradient-bg ${mod}`} aria-hidden>
      {variant === "hero" ? (
        <>
          <div className="gradient-bg__mesh" />
          <div className="gradient-bg__blob gradient-bg__blob--a" />
          <div className="gradient-bg__blob gradient-bg__blob--b" />
          <div className="gradient-bg__blob gradient-bg__blob--c" />
        </>
      ) : null}
      {variant === "process" ? (
        <>
          <div className="gradient-bg__blob gradient-bg__blob--a" />
          <div className="gradient-bg__blob gradient-bg__blob--b" />
        </>
      ) : null}
      {variant === "stats" ? (
        <>
          <div className="gradient-bg__blob gradient-bg__blob--a" />
          <div className="gradient-bg__blob gradient-bg__blob--b" />
        </>
      ) : null}
      {variant === "cta" ? (
        <>
          <div className="gradient-bg__blob gradient-bg__blob--a" />
          <div className="gradient-bg__blob gradient-bg__blob--b" />
          <div className="gradient-bg__blob gradient-bg__blob--c" />
        </>
      ) : null}
    </div>
  );
}

const primaryCta =
  "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-body text-sm font-semibold text-primary-foreground shadow-sm transition hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.99] sm:px-8";

const secondaryCta =
  "liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-body text-sm font-medium text-muted-foreground transition hover:scale-[1.02] hover:text-foreground sm:px-7";

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;

const cardHover = {
  whileHover: {
    y: -8,
    transition: { type: "spring" as const, stiffness: 320, damping: 22 },
  },
} as const;

/** Giant step index behind the platform row headings — same box for 01 and 02 */
const serviceStepNumClass =
  "pointer-events-none absolute -left-2 -top-7 z-0 select-none font-body text-[clamp(4.5rem,15vw,9.5rem)] font-bold leading-none text-foreground/5 md:-left-3 md:-top-11 lg:text-[clamp(5rem,16vw,10rem)]";

const testimonials = [
  {
    quote:
      "We finally stopped reconciling spreadsheets on Friday nights. Receipts and transfers live in one ledger everyone trusts.",
    name: "Jordan Okonkwo",
    role: "Operations Director, Northline Supply",
  },
  {
    quote:
      "Document states match how the warehouse actually works. Draft to Done is the language our floor already speaks.",
    name: "Priya Nair",
    role: "Warehouse Manager, Harbor Goods Co.",
  },
  {
    quote:
      "Multi-site stock without giving anyone access to the wrong org. That alone paid for the switch.",
    name: "Chris Delgado",
    role: "IT Lead, Meridian Retail Group",
  },
] as const;

const whyCards = [
  {
    Icon: Package,
    title: "Catalog & SKUs",
    body: "Categories, units of measure, and reorder thresholds that drive low-stock alerts—not guesswork.",
    accent: "SKUs",
    accentVariant: "aurora" as const,
  },
  {
    Icon: Building2,
    title: "Multi-warehouse",
    body: "Real-time levels per location. Transfers with clear from/to so nothing disappears in transit.",
    accent: "warehouse",
    accentVariant: "frost" as const,
  },
  {
    Icon: History,
    title: "Full traceability",
    body: "A stock ledger and move history for every quantity change—audit-ready without a second system.",
    accent: "traceability",
    accentVariant: "frost" as const,
  },
  {
    Icon: Shield,
    title: "Auth you can enforce",
    body: "JWT sessions, bcrypt passwords, OTP verification, and middleware that actually blocks protected routes.",
    accent: "enforce",
    accentVariant: "aurora" as const,
  },
] as const;

export function StockflowLanding() {
  const [featuredWork, ...moreWork] = workShowcase;
  const reduceMotion = useReducedMotion();

  return (
    <div className="landing-page overflow-x-hidden bg-background text-foreground">
      <LandingNavbar />

      <section
        id="home"
        className="relative min-h-svh overflow-hidden bg-background sm:min-h-[min(100svh,920px)] lg:min-h-[1000px]"
      >
        <GradientBackdrop variant="hero" />
        <HeroAmbient />
        <div
          className="bg-grid-faint pointer-events-none absolute inset-0 z-1 opacity-50"
          aria-hidden
        />
        <div className="noise-film absolute inset-0 z-1" aria-hidden />
        <div className="hero-fade-bottom" aria-hidden />

        <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-7xl flex-col items-center text-center">
          <div className="flex w-full flex-1 flex-col items-center px-4 pt-28 sm:px-6 sm:pt-32 md:pt-40 lg:pt-44 xl:pt-48">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="liquid-glass mb-10 inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4"
            >
              <span className="rounded-full bg-primary px-2.5 py-0.5 font-body text-xs font-bold text-primary-foreground">
                Beta
              </span>
              <span className="font-body text-xs font-medium text-muted-foreground">
                <span className="font-semibold text-foreground">StockFlow</span>
                {" — "}
                warehouse ops with a real stock ledger.
              </span>
            </motion.div>

            <BlurText
              text="Inventory clarity, built in."
              accentWord="clarity"
              className="font-heading text-4xl leading-[0.85] tracking-[-2px] text-foreground italic sm:text-5xl sm:tracking-[-3px] md:text-6xl md:tracking-[-4px] lg:text-7xl lg:text-[clamp(2.75rem,6vw,5.5rem)]"
            />

            <motion.p
              className="mt-8 max-w-xl font-body text-base leading-relaxed md:text-lg"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              <span className="font-light text-muted-foreground">
                Receipts, deliveries, transfers, and adjustments—{" "}
              </span>
              <span className="font-semibold text-foreground">
                all tied to a ledger you can audit.
              </span>
              <span className="font-light text-muted-foreground">
                {" "}
                Multi-warehouse stock, document-driven workflows, org isolation
                by default.
              </span>
            </motion.p>

            <motion.div
              className="mt-12 flex flex-wrap items-center justify-center gap-5 md:gap-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
            >
              <Link href="/sign-up" className={primaryCta}>
                Get started
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <a href="#work" className={secondaryCta}>
                Explore the product
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </motion.div>

            <motion.p
              className="eyebrow mt-16 text-muted-foreground/70 sm:mt-20 md:mt-28"
              animate={
                reduceMotion
                  ? { opacity: 0.4 }
                  : { opacity: [0.35, 0.7, 0.35] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }
            >
              Scroll to explore
            </motion.p>
          </div>

          <div className="mt-auto w-full pb-12 pt-12 sm:pb-16 sm:pt-16 md:pb-20 md:pt-28" />
        </div>
      </section>

      <section
        id="partners"
        className="section-inset section-stack scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-md shrink-0">
            <SectionBadge tone="muted">Who it&apos;s for</SectionBadge>
            <h2 className="font-body text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
              Built for teams that move{" "}
              <span className="text-gradient-frost">physical</span> goods.
            </h2>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 sm:gap-x-10 lg:max-w-xl lg:justify-end">
            {partners.map((name) => (
              <span
                key={name}
                className="font-heading text-2xl italic text-muted-foreground md:text-3xl lg:text-4xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="process"
        className="section-inset section-stack relative min-h-0 scroll-mt-24 overflow-hidden sm:scroll-mt-28 md:min-h-[640px] lg:min-h-[720px]"
      >
        <GradientBackdrop variant="process" />
        <div
          className="pointer-events-none absolute left-[-12%] top-[28%] size-[min(50vw,380px)] rounded-full bg-chart-2/12 blur-[90px] animate-float-soft-reverse motion-reduce:animate-none"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[18%] right-[-8%] size-[min(42vw,320px)] rounded-full bg-chart-3/14 blur-[80px] animate-float-soft motion-reduce:animate-none"
          aria-hidden
        />
        <div className="section-vignette-top" aria-hidden />
        <div className="section-vignette-bottom" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-0 max-w-3xl flex-col items-center px-4 py-12 text-center sm:py-16 md:max-w-2xl md:py-24">
          <SectionBadge tone="solid">How it works</SectionBadge>
          <h2 className="mt-2 font-heading text-4xl italic leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="text-gradient-frost">Documents</span> first.
            <span className="mt-2 block text-gradient-aurora">Stock follows.</span>
          </h2>
          <p className="mt-8 max-w-lg font-body text-base font-light leading-relaxed text-muted-foreground">
            Create receipts, deliveries, transfers, or adjustments. As each
            document advances through Draft → Waiting → Ready → Done, your
            ledger and on-hand quantities stay aligned—no shadow spreadsheets.
          </p>
        </div>
      </section>

      <section className="section-inset section-stack border-t border-border/80">
        <div className="mx-auto max-w-7xl md:flex md:items-start md:justify-between md:gap-24">
          <div className="max-w-lg shrink-0">
            <SectionBadge>The playbook</SectionBadge>
            <h2 className="font-heading text-4xl italic leading-[0.92] tracking-tight text-foreground md:text-5xl lg:text-[3.5rem]">
              From org setup to{" "}
              <span className="text-gradient-frost">daily</span> ops.
            </h2>
            <p className="mt-6 font-body text-base font-light leading-relaxed text-muted-foreground">
              Four pillars: isolation, documents, visibility, and the UX layer
              your team actually uses.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-6 md:mt-28 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {processSteps.map(
            ({ step, title, body, accent, accentVariant }, i) => (
            <motion.article
              key={step}
              {...fadeUp}
              {...cardHover}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`relative rounded-2xl border p-8 text-left backdrop-blur-md md:p-9 ${
                i === 0
                  ? "border-primary/30 bg-gradient-to-br from-primary/15 to-card/50 ring-1 ring-primary/15"
                  : "border-border/80 bg-white/[0.02]"
              }`}
            >
              {i === 0 ? (
                <span className="absolute -top-2.5 left-6 rounded-full bg-primary px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/20">
                  Start here
                </span>
              ) : null}
              <p className="font-body text-xs font-bold tabular-nums text-muted-foreground">
                {step}
              </p>
              <h3
                className={`mt-2 font-heading text-xl italic tracking-tight md:text-2xl ${
                  i === 0 ? "text-foreground" : "text-foreground/90"
                }`}
              >
                <HeadingAccent
                  text={title}
                  accent={accent}
                  variant={accentVariant ?? "frost"}
                />
              </h3>
              <p className="mt-2 font-body text-sm font-light leading-relaxed text-muted-foreground">
                {body}
              </p>
            </motion.article>
          )
        )}
        </div>
      </section>

      <section
        id="services"
        className="section-inset section-stack scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="mx-auto max-w-7xl lg:flex lg:items-end lg:justify-between lg:gap-20">
          <div>
            <p className="eyebrow">Platform</p>
            <h2 className="mt-3 max-w-xl font-heading text-4xl italic leading-[0.92] text-foreground md:text-5xl">
              Warehouse <span className="text-gradient-frost">depth.</span>
              <span className="mt-1 block font-body text-2xl font-semibold tracking-tight not-italic text-muted-foreground md:text-3xl">
                App <span className="text-gradient-aurora">simplicity.</span>
              </span>
            </h2>
          </div>
          <p className="mt-8 max-w-sm font-body text-sm font-light leading-relaxed text-muted-foreground lg:mt-0 lg:text-right">
            Deep inventory semantics without burying people in configuration—
            catalog, documents, and ledger in one place.
          </p>
        </div>

        <div className="relative mx-auto mt-20 max-w-7xl md:mt-28">
          <div className="flex flex-col gap-20 lg:flex-row lg:items-center lg:gap-24">
            <div className="relative isolate flex-1 text-left">
              <span className={serviceStepNumClass} aria-hidden>
                01
              </span>
              <h3 className="relative z-10 font-heading text-2xl italic tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Products &amp;{" "}
                <span className="text-gradient-aurora">on-hand.</span>
              </h3>
              <p className="relative z-10 mt-2 font-body text-sm font-semibold text-muted-foreground">
                SKUs, categories, units.
              </p>
              <p className="relative z-10 mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                Maintain a clean catalog with the structure your team needs—then
                watch live quantities roll up by warehouse with thresholds that
                surface low stock before you run out.
              </p>
              <a
                href="#work"
                className={`relative z-10 ${primaryCta} mt-8`}
              >
                See modules
              </a>
            </div>
            <motion.div
              {...cardHover}
              className="liquid-glass relative min-h-[280px] flex-1 overflow-hidden rounded-3xl ring-1 ring-border/80"
            >
              <Image
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>

        <div className="relative mx-auto mt-32 max-w-7xl md:mt-40">
          <div className="flex flex-col gap-20 lg:flex-row-reverse lg:items-center lg:gap-24">
            <div className="relative isolate flex-1 text-left">
              <span className={serviceStepNumClass} aria-hidden>
                02
              </span>
              <h3 className="relative z-10 font-heading text-2xl italic tracking-tight text-foreground md:text-4xl lg:text-5xl">
                <span className="text-gradient-frost">Ledger</span> &amp; move
                history.
              </h3>
              <p className="relative z-10 mt-2 font-body text-sm font-semibold text-chart-2">
                Every change explained.
              </p>
              <p className="relative z-10 mt-4 font-body text-sm font-light leading-relaxed text-muted-foreground">
                The stock ledger records why quantities moved. Move history
                gives you a chronological trail across receipts, deliveries,
                transfers, and adjustments—so audits are a lookup, not a project.
              </p>
              <a
                href="#process"
                className={`relative z-10 ${primaryCta} mt-8`}
              >
                See workflow
              </a>
            </div>
            <motion.div
              {...cardHover}
              className="liquid-glass relative min-h-[280px] flex-1 overflow-hidden rounded-3xl ring-1 ring-chart-2/25"
            >
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="section-inset section-stack scroll-mt-24 border-t border-border/80 sm:scroll-mt-28"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-left md:flex-row md:items-end md:justify-between">
          <div>
            <SectionBadge tone="muted">Product surface</SectionBadge>
            <h2 className="font-heading text-4xl italic text-foreground md:text-6xl">
              Where <span className="text-gradient-aurora">work</span> happens.
            </h2>
          </div>
          <p className="max-w-xs font-body text-sm font-light text-muted-foreground md:text-right">
            Ledger, inbound and outbound, and reconciliation—same patterns,
            different document types.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-6 md:mt-28 md:grid-cols-3 md:grid-rows-2 md:gap-8">
          <motion.article
            {...fadeUp}
            {...cardHover}
            className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2"
          >
            <div className="liquid-glass-strong glass-panel-glow relative h-full min-h-[340px] overflow-hidden rounded-3xl ring-1 ring-border md:min-h-[480px] lg:min-h-[520px]">
              <div className="absolute inset-0">
                <Image
                  src={featuredWork.image}
                  alt=""
                  fill
                  className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-14">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {featuredWork.tag}
                </p>
                <h3 className="mt-2 font-heading text-3xl italic text-foreground md:text-5xl">
                  <HeadingAccent
                    text={featuredWork.title}
                    accent={featuredWork.accent}
                    variant={featuredWork.accentVariant ?? "frost"}
                  />
                </h3>
                <p className="mt-3 max-w-lg font-body text-sm font-light leading-relaxed text-muted-foreground">
                  {featuredWork.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-body text-xs font-semibold text-foreground">
                  Explore module
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </div>
            </div>
          </motion.article>
          {moreWork.map((item, i) => (
            <motion.article
              key={item.title}
              {...fadeUp}
              {...cardHover}
              transition={{ ...fadeUp.transition, delay: 0.08 + i * 0.06 }}
              className="group liquid-glass flex flex-col overflow-hidden rounded-2xl ring-1 ring-border/80"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-body text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {item.tag}
                </p>
                <h3 className="mt-1 font-heading text-xl italic text-foreground">
                  <HeadingAccent
                    text={item.title}
                    accent={item.accent}
                    variant={item.accentVariant ?? "frost"}
                  />
                </h3>
                <p className="mt-2 flex-1 font-body text-xs font-light leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-inset section-stack-sm">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-card/70 via-muted/15 to-transparent px-6 py-12 sm:px-10 md:px-16 md:py-20 lg:px-20 lg:py-24">
          <div
            className="pointer-events-none absolute -right-24 top-1/2 size-80 -translate-y-1/2 rounded-full bg-chart-2/15 blur-[100px] animate-pulse-glow motion-reduce:animate-none"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 top-[15%] size-56 rounded-full bg-chart-1/10 blur-[80px] motion-reduce:animate-none"
            aria-hidden
          />
          <div className="relative md:flex md:items-start md:gap-16 lg:gap-24">
            <div className="shrink-0 md:max-w-52 lg:max-w-xs">
              <SectionBadge className="mb-3" tone="muted">
                Experience
              </SectionBadge>
              <h2 className="font-heading text-3xl italic leading-[0.95] text-foreground md:text-4xl">
                Built for the <span className="text-gradient-frost">floor</span>{" "}
                and the desk.
              </h2>
              <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted-foreground">
                Polish that doesn&apos;t get in the way—navigation, feedback,
                and tables tuned for long shifts and quick decisions.
              </p>
            </div>
            <div className="mt-10 flex-1 md:mt-0">
              <div className="divide-y divide-border/60 rounded-2xl border border-border/50 bg-card/20">
                {stackItems.map(({ title, detail }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(i * 0.04, 0.24),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="px-5 py-5 sm:px-6 sm:py-6"
                  >
                    <p className="font-heading text-lg italic leading-snug tracking-tight text-foreground md:text-xl">
                      {title}
                    </p>
                    <p className="mt-2 max-w-md font-body text-sm font-light leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-inset section-stack">
        <div className="mx-auto max-w-7xl text-center">
          <SectionBadge>Why StockFlow</SectionBadge>
          <h2 className="font-heading text-4xl italic text-foreground md:text-6xl lg:text-7xl">
            Clarity you can <span className="text-gradient-frost">prove.</span>
          </h2>
        </div>
        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-5 md:mt-28 md:grid-cols-4 md:grid-rows-2 md:gap-6">
          <div className="rounded-3xl bg-gradient-to-br from-chart-3/20 via-chart-1/15 to-chart-2/15 p-[1px] md:col-span-2 md:row-span-2">
            <div className="flex h-full flex-col justify-between rounded-[22px] bg-card/95 p-10 backdrop-blur-xl md:p-12 lg:p-14">
              <Package
                className="size-10 text-primary"
                strokeWidth={1.25}
                aria-hidden
              />
              <div className="mt-10">
                <p className="font-body text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  Principle
                </p>
                <p className="mt-4 font-heading text-3xl italic leading-[1.05] text-foreground md:text-4xl">
                  If it moved, it should be{" "}
                  <span className="text-gradient-frost">explainable</span>—in one
                  system.
                </p>
                <p className="mt-5 font-body text-sm font-light leading-relaxed text-muted-foreground">
                  StockFlow is opinionated about traceability: documents drive
                  quantity changes, and the ledger is the source of truth—not a
                  nightly export nobody trusts.
                </p>
              </div>
            </div>
          </div>
          {whyCards.map(({ Icon, title, body, accent, accentVariant }) => (
            <motion.div
              key={title}
              {...fadeUp}
              {...cardHover}
              className="liquid-glass flex flex-col rounded-2xl p-7 ring-1 ring-border/80 md:p-8"
            >
              <div className="liquid-glass-strong flex h-9 w-9 items-center justify-center rounded-full">
                <Icon className="size-[18px] text-foreground" aria-hidden />
              </div>
              <h3 className="mt-4 font-heading text-lg italic text-foreground">
                <HeadingAccent
                  text={title}
                  accent={accent}
                  variant={accentVariant}
                />
              </h3>
              <p className="mt-2 font-body text-xs font-light leading-relaxed text-muted-foreground">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-inset section-stack relative min-h-0 overflow-hidden py-8 md:min-h-[480px] md:py-0 lg:min-h-[520px]">
        <GradientBackdrop variant="stats" />
        <div className="section-vignette-top" aria-hidden />
        <div className="section-vignette-bottom" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="eyebrow text-center text-muted-foreground">By the numbers</p>
          <div className="liquid-glass-strong mt-8 rounded-2xl p-6 sm:rounded-[2rem] sm:p-10 md:mt-10 md:p-16 lg:p-24">
            <div className="grid grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:grid-cols-4 lg:gap-8 xl:gap-12">
              {[
                { value: "4", label: "Core operation types", mute: true },
                { value: "∞", label: "Warehouses you can add", mute: true },
                {
                  value: "100%",
                  label: "Movements in the ledger",
                  highlight: true,
                },
                { value: "Ctrl+K", label: "Command palette", mute: true },
              ].map(({ value, label, highlight, mute }) => (
                <div
                  key={label}
                  className={`text-center ${highlight ? "lg:scale-105" : ""}`}
                >
                  <p
                    className={`font-heading text-4xl italic md:text-5xl lg:text-6xl ${
                      highlight
                        ? "text-gradient-aurora"
                        : mute
                          ? "text-muted-foreground"
                          : "text-foreground"
                    }`}
                  >
                    {value}
                  </p>
                  <p
                    className={`mt-2 font-body text-xs md:text-sm ${
                      highlight
                        ? "font-semibold text-muted-foreground"
                        : "font-light text-muted-foreground"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-inset section-stack">
        <div className="mx-auto max-w-7xl md:flex md:items-end md:justify-between md:gap-16">
          <div>
            <SectionBadge tone="muted">Operators</SectionBadge>
            <h2 className="mt-2 max-w-lg font-heading text-4xl italic text-foreground md:text-5xl">
              Built with{" "}
              <span className="text-gradient-aurora">warehouses</span> in mind.
            </h2>
          </div>
          <p className="mt-6 font-body text-sm font-light text-muted-foreground md:mt-0 md:max-w-xs md:text-right">
            Folks who care about accuracy, isolation, and fewer emergency
            recounts.
          </p>
        </div>
        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-6 md:mt-28 md:grid-cols-2 md:gap-8">
          <motion.figure
            {...cardHover}
            className="liquid-glass-strong relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl p-10 ring-1 ring-border md:row-span-2 md:min-h-0 md:p-12"
          >
            <span
              className="quote-mark font-heading absolute right-6 top-4"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="relative z-1 font-body text-base font-light italic leading-relaxed text-foreground/90 md:text-lg">
              {testimonials[0].quote}
            </blockquote>
            <figcaption className="relative z-1 mt-8 border-t border-border pt-6">
              <p className="font-body text-sm font-bold text-foreground">
                {testimonials[0].name}
              </p>
              <p className="mt-1 font-body text-xs font-light text-muted-foreground">
                {testimonials[0].role}
              </p>
            </figcaption>
          </motion.figure>
          <div className="flex flex-col gap-6 md:gap-8">
            {testimonials.slice(1).map((t) => (
              <motion.figure
                key={t.name}
                {...cardHover}
                className="liquid-glass flex flex-1 flex-col justify-center rounded-2xl p-8 ring-1 ring-border/80 md:p-9"
              >
                <blockquote className="font-body text-sm font-light italic leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5">
                  <p className="font-body text-sm font-semibold text-foreground/90">
                    {t.name}
                  </p>
                  <p className="mt-0.5 font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t.role}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="section-inset section-stack scroll-mt-24 pb-32 sm:scroll-mt-28"
      >
        <div className="mx-auto max-w-3xl">
          <SectionBadge tone="muted">FAQ</SectionBadge>
          <h2 className="mt-2 text-left font-heading text-4xl italic text-foreground md:text-5xl">
            Straight <span className="text-gradient-frost">answers.</span>
          </h2>
          <p className="mt-4 font-body text-sm font-light text-muted-foreground">
            Security, tenancy, documents, and the ledger—answered upfront.
          </p>
        </div>
        <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-3 md:mt-20">
          {faqItems.map((item) => (
            <details key={item.q} className="group liquid-glass faq-details">
              <summary className="faq-summary">
                {item.q}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="faq-body">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      <footer
        id="cta"
        className="section-inset relative scroll-mt-24 overflow-hidden pb-16 pt-24 sm:scroll-mt-28 sm:pb-20 sm:pt-32 md:pb-24 md:pt-44 lg:pt-52"
      >
        <GradientBackdrop variant="cta" />
        <div className="section-vignette-top" aria-hidden />
        <div className="section-vignette-bottom" aria-hidden />
        <div className="noise-film absolute inset-0 z-1" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-2 text-center">
          <h2 className="font-heading text-4xl italic leading-[0.92] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Ready when
            <span className="mt-2 block text-gradient-aurora">
              your stock is.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-body text-sm font-light text-muted-foreground">
            Start a trial or talk to us about rollout, integrations, and how
            StockFlow maps to your existing receiving and shipping process.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mx-auto sm:mt-14 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 md:gap-6">
            <Link href="/sign-up" className={`${primaryCta} justify-center`}>
              Start your trial
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <a href="#work">Explore product</a>
            </Button>
          </div>

          <div className="mt-16 border-t border-border pt-8 sm:mt-28">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="font-body text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                © {new Date().getFullYear()} StockFlow
              </p>
              <nav className="flex flex-wrap justify-center gap-6 font-body text-[11px] font-semibold tracking-wider text-muted-foreground uppercase sm:gap-8">
                <Link
                  href="/privacy"
                  className="transition hover:text-foreground"
                >
                  Privacy
                </Link>
                <Link href="/terms" className="transition hover:text-foreground">
                  Terms
                </Link>
                <a href="#cta" className="transition hover:text-foreground">
                  Contact
                </a>
                <a href="#faq" className="transition hover:text-foreground">
                  FAQ
                </a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
