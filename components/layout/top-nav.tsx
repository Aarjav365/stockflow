"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TopNavProps = {
  links: {
    title: string;
    href: string;
    isActive?: boolean;
    disabled?: boolean;
  }[];
};

export function TopNav({ links }: TopNavProps) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-6">
      {links.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className={cn(
            "text-muted-foreground transition-colors hover:text-primary",
            (link.isActive || pathname === link.href) &&
              "font-medium text-foreground",
            link.disabled && "pointer-events-none opacity-50"
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
