"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createAdjustment, getStockQuantity } from "@/lib/inventory";
import type { StockAdjustment as Adjustment, InventoryWarehouse as Warehouse, InventoryProduct as Product } from "@/lib/inventory-types";

type AdjustmentsViewProps = {
  adjustments: Adjustment[];
  warehouses: Warehouse[];
  products: Product[];
};

export function AdjustmentsView({
  adjustments,
  warehouses,
  products,
}: AdjustmentsViewProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantityRecorded, setQuantityRecorded] = useState<number | "">("");
  const [quantityCounted, setQuantityCounted] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [loadingRecorded, setLoadingRecorded] = useState(false);

  async function loadRecorded() {
    if (!warehouseId || !productId) return;
    setLoadingRecorded(true);
    try {
      const qty = await getStockQuantity(productId, warehouseId);
      setQuantityRecorded(qty);
    } finally {
      setLoadingRecorded(false);
    }
  }

  async function handleSubmit() {
    if (
      !warehouseId ||
      !productId ||
      quantityRecorded === "" ||
      quantityCounted === ""
    ) {
      toast.error("Fill warehouse, product, and both quantities");
      return;
    }
    const recorded = Number(quantityRecorded);
    const counted = Number(quantityCounted);
    if (isNaN(recorded) || isNaN(counted)) {
      toast.error("Invalid quantities");
      return;
    }
    const result = await createAdjustment({
      warehouseId,
      productId,
      quantityRecorded: recorded,
      quantityCounted: counted,
      reason: reason || undefined,
    });
    if (!result.success) { toast.error(result.error); return; }
    setOpen(false);
    setWarehouseId("");
    setProductId("");
    setQuantityRecorded("");
    setQuantityCounted("");
    setReason("");
    router.refresh();
    toast.success("Adjustment applied — stock updated");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New adjustment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stock adjustment</DialogTitle>
              <CardDescription>
                Enter recorded (system) vs counted (physical) quantity. Stock will be set to counted.
              </CardDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Warehouse</label>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Product</label>
                <Select
                  value={productId}
                  onValueChange={(v) => {
                    setProductId(v);
                    setQuantityRecorded("");
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium">Quantity recorded (system)</label>
                  <div className="mt-1 flex gap-1">
                    <Input
                      type="number"
                      min={0}
                      placeholder="From system"
                      value={quantityRecorded === "" ? "" : quantityRecorded}
                      onChange={(e) =>
                        setQuantityRecorded(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadRecorded}
                      disabled={!warehouseId || !productId || loadingRecorded}
                    >
                      {loadingRecorded ? "…" : "Load"}
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Quantity counted (physical)</label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    placeholder="Actual count"
                    value={quantityCounted === "" ? "" : quantityCounted}
                    onChange={(e) =>
                      setQuantityCounted(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Reason (optional)</label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Cycle count, damage"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Apply adjustment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Recorded</TableHead>
              <TableHead>Counted</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No adjustments yet.
                </TableCell>
              </TableRow>
            ) : (
              adjustments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.documentNumber}</TableCell>
                  <TableCell>{a.warehouse.name}</TableCell>
                  <TableCell>{a.product.name} ({a.product.sku})</TableCell>
                  <TableCell>{a.quantityRecorded}</TableCell>
                  <TableCell>{a.quantityCounted}</TableCell>
                  <TableCell>{a.reason ?? "—"}</TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
