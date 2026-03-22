import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  default:
    "liquid-glass text-xs font-medium text-foreground shadow-sm",
  muted:
    "border border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground",
  solid:
    "bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/10",
} as const;

export function SectionBadge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "mb-4 inline-block rounded-full px-3.5 py-1 font-body",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
