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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/lib/inventory";
import type { WarehouseWithCount as Warehouse } from "@/lib/inventory-types";

const warehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  address: z.string().optional(),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

type WarehousesTableProps = { warehouses: Warehouse[] };

export function WarehousesTable({ warehouses: initial }: WarehousesTableProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: { name: "", code: "", address: "" },
  });

  async function onSubmit(data: WarehouseFormValues) {
    if (editing) {
      const result = await updateWarehouse(editing.id, {
        name: data.name,
        code: data.code || undefined,
        address: data.address || undefined,
      });
      if (!result.success) { toast.error(result.error); return; }
      toast.success("Warehouse updated");
    } else {
      const result = await createWarehouse({
        name: data.name,
        code: data.code || undefined,
        address: data.address || undefined,
      });
      if (!result.success) { toast.error(result.error); return; }
      toast.success("Warehouse created");
    }
    setOpen(false);
    setEditing(null);
    form.reset({ name: "", code: "", address: "" });
    router.refresh();
  }

  function openEdit(w: Warehouse) {
    setEditing(w);
    form.reset({
      name: w.name,
      code: w.code ?? "",
      address: w.address ?? "",
    });
    setOpen(true);
  }

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", code: "", address: "" });
    setOpen(true);
  }

  async function handleDelete(w: Warehouse) {
    if (!confirm(`Delete "${w.name}"?`)) return;
    const result = await deleteWarehouse(w.id);
    if (!result.success) { toast.error(result.error); return; }
    toast.success("Warehouse deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogTrigger asChild>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add warehouse
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit warehouse" : "New warehouse"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initial.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No warehouses. Add one to start.
                </TableCell>
              </TableRow>
            ) : (
              initial.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>{w.code ?? "—"}</TableCell>
                  <TableCell>{w.address ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(w)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(w)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
