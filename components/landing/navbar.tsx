"use client";

import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";

import { StockflowLogo } from "@/components/brand/stockflow-logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Platform", href: "#services" },
  { label: "Modules", href: "#work" },
  { label: "Workflow", href: "#process" },
  { label: "Industries", href: "#partners" },
  { label: "FAQ", href: "#faq" },
] as const;

export function LandingNavbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/60 bg-background/85 pb-3 backdrop-blur-md sm:top-4 sm:border-0 sm:bg-transparent sm:pb-0 sm:backdrop-blur-none">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 md:px-10">
        <Link
          href="/"
          className="shrink-0 block rounded-2xl p-1 ring-1 ring-border/55 bg-muted/30 shadow-sm transition-colors hover:bg-muted/45 dark:bg-muted/20 dark:ring-border/45"
          aria-label="StockFlow home"
        >
          <div className="overflow-hidden rounded-[0.6rem]">
            <StockflowLogo className="h-8 w-8 sm:h-10 sm:w-10 block opacity-[0.96] dark:invert dark:opacity-[0.9]" />
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <nav
            className="liquid-glass flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full py-1.5 pr-1.5 pl-3 sm:gap-1 sm:pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Primary"
          >
            <div className="flex items-center gap-0.5 sm:gap-1">
              {links.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full px-2.5 py-1.5 font-body text-xs font-medium text-foreground/90 transition-colors hover:bg-muted/60 hover:text-foreground sm:px-3 sm:text-sm"
                >
                  {label}
                </a>
              ))}
            </div>
            <Button variant="default" size="sm" className="ml-1 gap-1 rounded-full px-4" asChild>
              <Link href="/sign-up">
                Get started
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </nav>
        </div>

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <ThemeSwitch />
          <Link
            href="/sign-in"
            className="hidden rounded-full px-3 py-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:inline"
          >
            Sign in
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                <MobileSheetNav />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileSheetNav() {
  return (
    <>
      {links.map(({ label, href }) => (
        <SheetClose key={href} asChild>
          <a
            href={href}
            className="block rounded-lg px-3 py-2.5 font-body text-sm font-medium text-foreground hover:bg-muted/60"
          >
            {label}
          </a>
        </SheetClose>
      ))}
      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
        <SheetClose asChild>
          <Button variant="default" className="w-full rounded-full" asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="outline" className="w-full rounded-full" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </SheetClose>
      </div>
    </>
  );
}
