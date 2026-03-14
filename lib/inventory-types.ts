/**
 * Client-safe types for inventory views. Do not import from prisma or lib/inventory here.
 */

export interface InventoryCategory {
  id: string;
  name: string;
  slug: string;
}

export interface InventoryWarehouse {
  id: string;
  name: string;
  code: string | null;
  address: string | null;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: InventoryCategory;
  unitOfMeasure: string;
  reorderThreshold: number | null;
  stockLevels: { quantity: number; warehouse: InventoryWarehouse }[];
}

export interface ReceiptLine {
  id: string;
  productId: string;
  product: InventoryProduct;
  quantityOrdered: number;
  quantityReceived: number;
}

export interface Receipt {
  id: string;
  documentNumber: string;
  supplier: string | null;
  status: string;
  warehouseId: string;
  warehouse: InventoryWarehouse;
  lines: ReceiptLine[];
}

export interface DeliveryLine {
  id: string;
  productId: string;
  product: InventoryProduct;
  quantity: number;
}

export interface DeliveryOrder {
  id: string;
  documentNumber: string;
  customerRef: string | null;
  status: string;
  warehouseId: string;
  warehouse: InventoryWarehouse;
  lines: DeliveryLine[];
}

export interface TransferLine {
  id: string;
  productId: string;
  product: InventoryProduct;
  quantity: number;
}

export interface InternalTransfer {
  id: string;
  documentNumber: string;
  status: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  fromWarehouse: InventoryWarehouse;
  toWarehouse: InventoryWarehouse;
  lines: TransferLine[];
}

export interface StockAdjustment {
  id: string;
  documentNumber: string;
  warehouseId: string;
  productId: string;
  warehouse: InventoryWarehouse;
  product: InventoryProduct;
  quantityRecorded: number;
  quantityCounted: number;
  reason: string | null;
  createdAt: Date;
}

export interface MoveHistoryEntry {
  id: string;
  productId: string;
  warehouseId: string;
  product: InventoryProduct;
  warehouse: InventoryWarehouse;
  quantityChange: number;
  referenceType: string;
  referenceId: string;
  createdAt: Date;
}

export interface CategoryWithCount extends InventoryCategory {
  _count?: { products: number };
}

export interface WarehouseWithCount extends InventoryWarehouse {
  _count?: { stockLevels: number };
}

export interface ProductWithRelations extends InventoryProduct {}
