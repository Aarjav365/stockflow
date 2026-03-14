"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  PackageMinus,
  ArrowLeftRight,
  SlidersHorizontal,
  History,
  TrendingDown,
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Low stock products", href: "/products?lowStock=1", icon: TrendingDown },
  { label: "New receipt", href: "/operations/receipts?new=1", icon: PackagePlus },
  { label: "New delivery order", href: "/operations/deliveries?new=1", icon: PackageMinus },
  { label: "New transfer", href: "/operations/transfers?new=1", icon: ArrowLeftRight },
  { label: "New adjustment", href: "/operations/adjustments?new=1", icon: SlidersHorizontal },
  { label: "Move history", href: "/operations/move-history", icon: History },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  function run(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Quick actions" description="Navigate or create documents.">
      <Command className="rounded-lg border-0 shadow-none" shouldFilter={true}>
        <CommandInput placeholder="Search or run..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Go to">
            {QUICK_ACTIONS.filter((a) => ["Dashboard", "Products", "Low stock products", "Move history"].includes(a.label)).map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.href} value={a.label} onSelect={() => run(a.href)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {a.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Create">
            {QUICK_ACTIONS.filter((a) => a.label.startsWith("New")).map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.href} value={a.label} onSelect={() => run(a.href)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {a.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
