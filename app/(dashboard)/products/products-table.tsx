"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import Link from "next/link";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
} from "@/lib/inventory";
import type { ProductWithRelations as Product, CategoryWithCount as Category } from "@/lib/inventory-types";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  unitOfMeasure: z.string().min(1, "UoM is required"),
  reorderThreshold: z.union([z.number().int().min(0), z.null()]).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type ProductsTableProps = {
  products: Product[];
  categories: Category[];
  initialCategoryId?: string;
  initialSkuSearch?: string;
  initialLowStock?: boolean;
};

export function ProductsTable({
  products,
  categories,
  initialCategoryId,
  initialSkuSearch,
  initialLowStock = false,
}: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? initialCategoryId ?? "";
  const skuSearch = searchParams.get("sku") ?? initialSkuSearch ?? "";
  const lowStock = searchParams.get("lowStock") === "1" || initialLowStock;
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [skuInput, setSkuInput] = useState(skuSearch);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      unitOfMeasure: "pcs",
      reorderThreshold: null,
    },
  });

  function applyFilters(params: { categoryId?: string; sku?: string; lowStock?: boolean }) {
    const next = new URLSearchParams(searchParams.toString());
    if (params.categoryId != null) (params.categoryId ? next.set("categoryId", params.categoryId) : next.delete("categoryId"));
    if (params.sku != null) (params.sku ? next.set("sku", params.sku) : next.delete("sku"));
    if (params.lowStock != null) (params.lowStock ? next.set("lowStock", "1") : next.delete("lowStock"));
    router.push(`/products?${next.toString()}`);
  }

  async function onSubmit(data: ProductFormValues) {
    if (editing) {
      const result = await updateProduct(editing.id, {
        name: data.name,
        sku: data.sku,
        categoryId: data.categoryId,
        unitOfMeasure: data.unitOfMeasure,
        reorderThreshold: data.reorderThreshold,
      });
      if (!result.success) { toast.error(result.error); return; }
      toast.success("Product updated");
    } else {
      const result = await createProduct({
        name: data.name,
        sku: data.sku,
        categoryId: data.categoryId,
        unitOfMeasure: data.unitOfMeasure,
        reorderThreshold: data.reorderThreshold,
      });
      if (!result.success) { toast.error(result.error); return; }
      toast.success("Product created");
    }
    setOpen(false);
    setEditing(null);
    form.reset({ name: "", sku: "", categoryId: "", unitOfMeasure: "pcs", reorderThreshold: null });
    router.refresh();
  }

  function openEdit(p: Product) {
    setEditing(p);
    form.reset({
      name: p.name,
      sku: p.sku,
      categoryId: p.categoryId,
      unitOfMeasure: p.unitOfMeasure,
      reorderThreshold: p.reorderThreshold,
    });
    setOpen(true);
  }

  function openCreate() {
    setEditing(null);
    form.reset({
      name: "",
      sku: "",
      categoryId: categoryId || (categories[0]?.id ?? ""),
      unitOfMeasure: "pcs",
      reorderThreshold: null,
    });
    setOpen(true);
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    const slug = newCategorySlug.trim() || newCategoryName.trim().toLowerCase().replace(/\s+/g, "-");
    const result = await createCategory({ name: newCategoryName.trim(), slug });
    if (!result.success) { toast.error(result.error); return; }
    setOpenCategory(false);
    setNewCategoryName("");
    setNewCategorySlug("");
    router.refresh();
    toast.success("Category created");
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const result = await deleteProduct(p.id);
    if (!result.success) { toast.error(result.error); return; }
    toast.success("Product deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={categoryId || "all"}
          onValueChange={(v) => applyFilters({ categoryId: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={openCategory} onOpenChange={setOpenCategory}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              New category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  className="mt-1"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug (optional)</label>
                <Input
                  className="mt-1"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="url-slug"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenCategory(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Search by SKU or name..."
          className="w-[200px]"
          value={skuInput}
          onChange={(e) => setSkuInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters({ sku: skuInput });
          }}
        />
        <Button variant="outline" size="sm" onClick={() => applyFilters({ sku: skuInput })}>
          Apply
        </Button>
        {lowStock && (
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
          >
            Low stock only <X className="h-3 w-3" />
          </Link>
        )}
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
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
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!!editing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of measure</FormLabel>
                      <FormControl>
                        <Input placeholder="pcs, kg, box..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reorderThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder threshold (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>UoM</TableHead>
              <TableHead>Reorder</TableHead>
              <TableHead>Stock (total)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No products. Add one or adjust filters.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => {
                const totalStock = p.stockLevels.reduce((s, l) => s + l.quantity, 0);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.category.name}</TableCell>
                    <TableCell>{p.unitOfMeasure}</TableCell>
                    <TableCell>{p.reorderThreshold ?? "—"}</TableCell>
                    <TableCell>{totalStock}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
