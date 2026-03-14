"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Warehouse = { id: string; name: string; code: string | null };
type Category = { id: string; name: string; slug: string };

type DashboardFiltersProps = {
  warehouses: Warehouse[];
  categories: Category[];
};

const DOC_TYPES = [
  { value: "receipts", label: "Receipts" },
  { value: "deliveries", label: "Delivery Orders" },
  { value: "transfers", label: "Internal Transfers" },
  { value: "adjustments", label: "Adjustments" },
] as const;

const STATUSES = [
  { value: "Draft", label: "Draft" },
  { value: "Waiting", label: "Waiting" },
  { value: "Ready", label: "Ready" },
  { value: "Done", label: "Done" },
  { value: "Canceled", label: "Canceled" },
] as const;

export function DashboardFilters({
  warehouses,
  categories,
}: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const docType = searchParams.get("docType") ?? "";
  const status = searchParams.get("status") ?? "";
  const warehouseId = searchParams.get("warehouseId") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";

  function applyFilters(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Document type
        </label>
        <Select
          value={docType || "all"}
          onValueChange={(v) => applyFilters({ docType: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {DOC_TYPES.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Status
        </label>
        <Select
          value={status || "all"}
          onValueChange={(v) => applyFilters({ status: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Warehouse
        </label>
        <Select
          value={warehouseId || "all"}
          onValueChange={(v) =>
            applyFilters({ warehouseId: v === "all" ? "" : v })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {warehouses.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          Category
        </label>
        <Select
          value={categoryId || "all"}
          onValueChange={(v) =>
            applyFilters({ categoryId: v === "all" ? "" : v })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push("/")}
      >
        Clear
      </Button>
    </div>
  );
}
