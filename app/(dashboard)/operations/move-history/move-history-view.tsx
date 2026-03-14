"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import type { MoveHistoryEntry as Entry, InventoryProduct as Product, InventoryWarehouse as Warehouse } from "@/lib/inventory-types";

function escapeCsv(s: string) {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const REF_TYPES = [
  { value: "Receipt", label: "Receipt" },
  { value: "Delivery", label: "Delivery" },
  { value: "Transfer", label: "Transfer" },
  { value: "Adjustment", label: "Adjustment" },
];

type MoveHistoryViewProps = {
  entries: Entry[];
  products: Product[];
  warehouses: Warehouse[];
  initialProductId?: string;
  initialWarehouseId?: string;
  initialType?: string;
};

export function MoveHistoryView({
  entries,
  products,
  warehouses,
  initialProductId,
  initialWarehouseId,
  initialType,
}: MoveHistoryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function applyFilters(params: {
    productId?: string;
    warehouseId?: string;
    type?: string;
  }) {
    const next = new URLSearchParams(searchParams.toString());
    if (params.productId != null)
      params.productId ? next.set("productId", params.productId) : next.delete("productId");
    if (params.warehouseId != null)
      params.warehouseId ? next.set("warehouseId", params.warehouseId) : next.delete("warehouseId");
    if (params.type != null)
      params.type ? next.set("type", params.type) : next.delete("type");
    router.push(`/operations/move-history?${next.toString()}`);
  }

  const productId = searchParams.get("productId") ?? initialProductId ?? "";
  const warehouseId = searchParams.get("warehouseId") ?? initialWarehouseId ?? "";
  const type = searchParams.get("type") ?? initialType ?? "";

  function exportCsv() {
    const headers = ["Date", "Product", "SKU", "Warehouse", "Type", "Quantity change", "Reference ID"];
    const rows = entries.map((e) => [
      new Date(e.createdAt).toISOString(),
      e.product.name,
      e.product.sku,
      e.warehouse.name,
      e.referenceType,
      e.quantityChange,
      e.referenceId,
    ]);
    const csv = [headers.map(escapeCsv).join(","), ...rows.map((r) => r.map(String).map(escapeCsv).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `move-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Product</label>
          <Select
            value={productId || "all"}
            onValueChange={(v) => applyFilters({ productId: v === "all" ? "" : v })}
          >
            <SelectTrigger className="mt-1 w-[200px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Warehouse</label>
          <Select
            value={warehouseId || "all"}
            onValueChange={(v) => applyFilters({ warehouseId: v === "all" ? "" : v })}
          >
            <SelectTrigger className="mt-1 w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All warehouses</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <Select
            value={type || "all"}
            onValueChange={(v) => applyFilters({ type: v === "all" ? "" : v })}
          >
            <SelectTrigger className="mt-1 w-[140px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {REF_TYPES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.push("/operations/move-history")}>
          Clear
        </Button>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={entries.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No moves found.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{new Date(e.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{e.product.name} ({e.product.sku})</TableCell>
                  <TableCell>{e.warehouse.name}</TableCell>
                  <TableCell>{e.referenceType}</TableCell>
                  <TableCell className="text-right">
                    <span className={e.quantityChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {e.quantityChange >= 0 ? "+" : ""}{e.quantityChange}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{e.referenceId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
