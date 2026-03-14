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
  createDeliveryOrder,
  addDeliveryLine,
  setDeliveryOrderStatus,
  validateDeliveryOrder,
} from "@/lib/inventory";
import { DocumentStatus } from "@/lib/document-status";
import type { DeliveryOrder as Order, InventoryWarehouse as Warehouse, InventoryProduct as Product } from "@/lib/inventory-types";

type DeliveriesViewProps = {
  orders: Order[];
  warehouses: Warehouse[];
  products: Product[];
  selectedId: string | null;
};

export function DeliveriesView({
  orders,
  warehouses,
  products,
  selectedId,
}: DeliveriesViewProps) {
  const router = useRouter();
  const [openNew, setOpenNew] = useState(false);
  const [newWarehouseId, setNewWarehouseId] = useState("");
  const [newCustomerRef, setNewCustomerRef] = useState("");
  const [addLineOrderId, setAddLineOrderId] = useState<string | null>(null);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(0);

  const selected = selectedId ? orders.find((o) => o.id === selectedId) : null;

  async function handleCreate() {
    if (!newWarehouseId) {
      toast.error("Select a warehouse");
      return;
    }
    try {
      const o = await createDeliveryOrder(
        newWarehouseId,
        newCustomerRef || undefined
      );
      setOpenNew(false);
      setNewWarehouseId("");
      setNewCustomerRef("");
      router.push(`/operations/deliveries?id=${o.id}`);
      router.refresh();
      toast.success("Delivery order created");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create");
    }
  }

  async function handleAddLine() {
    if (!addLineOrderId || !addProductId || addQty <= 0) return;
    try {
      await addDeliveryLine(addLineOrderId, addProductId, addQty);
      setAddLineOrderId(null);
      setAddProductId("");
      setAddQty(0);
      router.refresh();
      toast.success("Line added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add line");
    }
  }

  async function handleSetReady(orderId: string) {
    try {
      await setDeliveryOrderStatus(orderId, DocumentStatus.Ready);
      router.refresh();
      toast.success("Marked as Ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function handleValidate(orderId: string) {
    try {
      await validateDeliveryOrder(orderId);
      router.refresh();
      toast.success("Delivery validated — stock updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Validation failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New delivery order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New delivery order</DialogTitle>
              <CardDescription>Select warehouse and optional customer ref.</CardDescription>
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
                <label className="text-sm font-medium">Customer ref (optional)</label>
                <Input
                  className="mt-1"
                  placeholder="Customer reference"
                  value={newCustomerRef}
                  onChange={(e) => setNewCustomerRef(e.target.value)}
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
              <TableHead>Customer ref</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/operations/deliveries?id=${o.id}`}
                    className="text-primary hover:underline"
                  >
                    {o.documentNumber}
                  </Link>
                </TableCell>
                <TableCell>{o.warehouse.name}</TableCell>
                <TableCell>{o.customerRef ?? "—"}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>{o.lines.length}</TableCell>
                <TableCell>
                  {o.status === DocumentStatus.Draft && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetReady(o.id)}
                    >
                      Mark Ready
                    </Button>
                  )}
                  {o.status === DocumentStatus.Ready && (
                    <Button size="sm" onClick={() => handleValidate(o.id)}>
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
                  setAddLineOrderId(selected.id);
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

            {addLineOrderId === selected.id && (
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
                  onClick={() => setAddLineOrderId(null)}
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
