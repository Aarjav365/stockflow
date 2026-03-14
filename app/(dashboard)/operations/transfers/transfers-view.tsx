"use client";

import { useRouter } from "next/navigation";
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
  createTransfer,
  addTransferLine,
  setTransferStatus,
  validateTransfer,
} from "@/lib/inventory";
import { DocumentStatus } from "@/lib/document-status";
import type { InternalTransfer as Transfer, InventoryWarehouse as Warehouse, InventoryProduct as Product } from "@/lib/inventory-types";

type TransfersViewProps = {
  transfers: Transfer[];
  warehouses: Warehouse[];
  products: Product[];
  selectedId: string | null;
};

export function TransfersView({
  transfers,
  warehouses,
  products,
  selectedId,
}: TransfersViewProps) {
  const router = useRouter();
  const [openNew, setOpenNew] = useState(false);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [addLineTransferId, setAddLineTransferId] = useState<string | null>(null);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(0);

  const selected = selectedId ? transfers.find((t) => t.id === selectedId) : null;

  async function handleCreate() {
    if (!fromId || !toId) {
      toast.error("Select from and to warehouse");
      return;
    }
    if (fromId === toId) {
      toast.error("From and to must be different");
      return;
    }
    const result = await createTransfer(fromId, toId);
    if (!result.success) { toast.error(result.error); return; }
    setOpenNew(false);
    setFromId("");
    setToId("");
    router.push(`/operations/transfers?id=${result.data.id}`);
    router.refresh();
    toast.success("Transfer created");
  }

  async function handleAddLine() {
    if (!addLineTransferId || !addProductId || addQty <= 0) return;
    const result = await addTransferLine(addLineTransferId, addProductId, addQty);
    if (!result.success) { toast.error(result.error); return; }
    setAddLineTransferId(null);
    setAddProductId("");
    setAddQty(0);
    router.refresh();
    toast.success("Line added");
  }

  async function handleSetReady(transferId: string) {
    const result = await setTransferStatus(transferId, DocumentStatus.Ready);
    if (!result.success) { toast.error(result.error); return; }
    router.refresh();
    toast.success("Marked as Ready");
  }

  async function handleValidate(transferId: string) {
    const result = await validateTransfer(transferId);
    if (!result.success) { toast.error(result.error); return; }
    router.refresh();
    toast.success("Transfer validated — stock updated");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New transfer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New internal transfer</DialogTitle>
              <CardDescription>Select from and to warehouse.</CardDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">From warehouse</label>
                <Select value={fromId} onValueChange={setFromId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="From" />
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
                <label className="text-sm font-medium">To warehouse</label>
                <Select value={toId} onValueChange={setToId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="To" />
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
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/operations/transfers?id=${t.id}`}
                    className="text-primary hover:underline"
                  >
                    {t.documentNumber}
                  </Link>
                </TableCell>
                <TableCell>{t.fromWarehouse.name}</TableCell>
                <TableCell>{t.toWarehouse.name}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{t.lines.length}</TableCell>
                <TableCell>
                  {t.status === DocumentStatus.Draft && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetReady(t.id)}
                    >
                      Mark Ready
                    </Button>
                  )}
                  {t.status === DocumentStatus.Ready && (
                    <Button size="sm" onClick={() => handleValidate(t.id)}>
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
                {selected.fromWarehouse.name} → {selected.toWarehouse.name} · {selected.status}
              </CardDescription>
            </div>
            {selected.status === DocumentStatus.Draft && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAddLineTransferId(selected.id);
                  setAddProductId(products[0]?.id ?? "");
                  setAddQty(0);
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
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.lines.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.product.name} ({l.product.sku})</TableCell>
                    <TableCell>{l.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {addLineTransferId === selected.id && (
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
                  min={1}
                  placeholder="Qty"
                  className="w-24"
                  value={addQty || ""}
                  onChange={(e) => setAddQty(Number(e.target.value) || 0)}
                />
                <Button size="sm" onClick={handleAddLine}>
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddLineTransferId(null)}
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
