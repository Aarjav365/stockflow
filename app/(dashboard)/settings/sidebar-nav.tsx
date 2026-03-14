"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarNavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
};

interface SidebarNavProps {
  items: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 lg:flex-col lg:gap-0.5">
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "justify-start text-sm",
            pathname === item.href && "bg-muted font-semibold"
          )}
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
