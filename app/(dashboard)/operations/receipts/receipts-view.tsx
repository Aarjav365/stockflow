"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, CheckCircle } from "lucide-react";
import {
  createReceipt,
  addReceiptLine,
  setReceiptStatus,
  validateReceipt,
} from "@/lib/inventory";
import { DocumentStatus } from "@/lib/document-status";
import type { Receipt, InventoryWarehouse as Warehouse, InventoryProduct as Product } from "@/lib/inventory-types";

type ReceiptsViewProps = {
  receipts: Receipt[];
  warehouses: Warehouse[];
  products: Product[];
  selectedId: string | null;
};

export function ReceiptsView({
  receipts,
  warehouses,
  products,
  selectedId,
}: ReceiptsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openNew, setOpenNew] = useState(false);
  const [newWarehouseId, setNewWarehouseId] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [addLineReceiptId, setAddLineReceiptId] = useState<string | null>(null);
  const [addProductId, setAddProductId] = useState("");
  const [addQtyOrdered, setAddQtyOrdered] = useState(0);
  const [addQtyReceived, setAddQtyReceived] = useState(0);

  const selected = selectedId ? receipts.find((r) => r.id === selectedId) : null;

  async function handleCreate() {
    if (!newWarehouseId) {
      toast.error("Select a warehouse");
      return;
    }
    const result = await createReceipt(newWarehouseId, newSupplier || undefined);
    if (!result.success) { toast.error(result.error); return; }
    setOpenNew(false);
    setNewWarehouseId("");
    setNewSupplier("");
    router.push(`/operations/receipts?id=${result.data.id}`);
    router.refresh();
    toast.success("Receipt created");
  }

  async function handleAddLine() {
    if (!addLineReceiptId || !addProductId || addQtyReceived < 0) return;
    const result = await addReceiptLine(
      addLineReceiptId,
      addProductId,
      addQtyOrdered,
      addQtyReceived
    );
    if (!result.success) { toast.error(result.error); return; }
    setAddLineReceiptId(null);
    setAddProductId("");
    setAddQtyOrdered(0);
    setAddQtyReceived(0);
    router.refresh();
    toast.success("Line added");
  }

  async function handleSetReady(receiptId: string) {
    const result = await setReceiptStatus(receiptId, DocumentStatus.Ready);
    if (!result.success) { toast.error(result.error); return; }
    router.refresh();
    toast.success("Marked as Ready");
  }

  async function handleValidate(receiptId: string) {
    const result = await validateReceipt(receiptId);
    if (!result.success) { toast.error(result.error); return; }
    router.refresh();
    toast.success("Receipt validated — stock updated");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New receipt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New receipt</DialogTitle>
              <CardDescription>Select warehouse and optional supplier.</CardDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Warehouse</label>
                <Select value={newWarehouseId} onValueChange={setNewWarehouseId}>
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
                <label className="text-sm font-medium">Supplier (optional)</label>
                <Input
                  className="mt-1"
                  placeholder="Supplier name"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenNew(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
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
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/operations/receipts?id=${r.id}`}
                    className="text-primary hover:underline"
                  >
                    {r.documentNumber}
                  </Link>
                </TableCell>
                <TableCell>{r.warehouse.name}</TableCell>
                <TableCell>{r.supplier ?? "—"}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{r.lines.length}</TableCell>
                <TableCell>
                  {r.status === DocumentStatus.Draft && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetReady(r.id)}
                    >
                      Mark Ready
                    </Button>
                  )}
                  {r.status === DocumentStatus.Ready && (
                    <Button size="sm" onClick={() => handleValidate(r.id)}>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Validate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selected.documentNumber}</CardTitle>
              <CardDescription>
                {selected.warehouse.name} · {selected.status}
              </CardDescription>
            </div>
            {selected.status === DocumentStatus.Draft && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAddLineReceiptId(selected.id);
                  setAddProductId(products[0]?.id ?? "");
                  setAddQtyOrdered(0);
                  setAddQtyReceived(0);
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add line
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty ordered</TableHead>
                  <TableHead>Qty received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.lines.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.product.name} ({l.product.sku})</TableCell>
                    <TableCell>{l.quantityOrdered}</TableCell>
                    <TableCell>{l.quantityReceived}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {addLineReceiptId === selected.id && (
              <div className="flex flex-wrap items-end gap-2 rounded border p-3">
                <Select value={addProductId} onValueChange={setAddProductId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  placeholder="Ordered"
                  className="w-24"
                  value={addQtyOrdered || ""}
                  onChange={(e) => setAddQtyOrdered(Number(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Received"
                  className="w-24"
                  value={addQtyReceived || ""}
                  onChange={(e) => setAddQtyReceived(Number(e.target.value) || 0)}
                />
                <Button size="sm" onClick={handleAddLine}>
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddLineReceiptId(null)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
