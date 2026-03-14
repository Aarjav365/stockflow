"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DocumentStatus } from "@/generated/prisma/client";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

async function safe<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[server-action]", msg);
    return { success: false, error: msg };
  }
}

const PENDING_STATUSES: DocumentStatus[] = [
  DocumentStatus.Draft,
  DocumentStatus.Waiting,
  DocumentStatus.Ready,
];

async function getOrgId(): Promise<string | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const orgIdFromSession = (session.user as { organizationId?: string }).organizationId;
    if (orgIdFromSession) return orgIdFromSession;

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });
    if (dbUser?.organizationId) return dbUser.organizationId;

    const org = await prisma.organization.create({
      data: { name: `${session.user.name ?? session.user.email ?? "My"}'s Organization` },
    });
    await prisma.user.update({
      where: { id: session.user.id },
      data: { organizationId: org.id },
    });
    return org.id;
  } catch (e) {
    console.error("[getOrgId]", e);
    return null;
  }
}

// ----- KPIs for Dashboard -----
export async function getDashboardKpis() {
  const orgId = await getOrgId();
  const productWhere = orgId != null ? { organizationId: orgId } : undefined;
  const receiptWhere = orgId != null ? { status: { in: PENDING_STATUSES }, warehouse: { organizationId: orgId } } : { status: { in: PENDING_STATUSES } };
  const deliveryWhere = orgId != null ? { status: { in: PENDING_STATUSES }, warehouse: { organizationId: orgId } } : { status: { in: PENDING_STATUSES } };
  const transferWhere = orgId != null ? { status: { in: PENDING_STATUSES }, fromWarehouse: { organizationId: orgId } } : { status: { in: PENDING_STATUSES } };
  const [
    totalProducts,
    pendingReceipts,
    pendingDeliveries,
    scheduledTransfers,
    productsWithStock,
    stockLevels,
  ] = await Promise.all([
    prisma.product.count({ where: productWhere }),
    prisma.receipt.count({ where: receiptWhere }),
    prisma.deliveryOrder.count({ where: deliveryWhere }),
    prisma.internalTransfer.count({ where: transferWhere }),
    prisma.product.findMany({
      where: { ...productWhere, reorderThreshold: { not: null } },
      include: { stockLevels: true },
    }),
    prisma.stockLevel.findMany({
      where: { quantity: 0, ...(orgId != null ? { product: { organizationId: orgId } } : {}) },
      select: { productId: true },
    }),
  ]);

  const outOfStockCount = new Set(stockLevels.map((l) => l.productId)).size;
  const lowStockCount = productsWithStock.filter((p) => {
    const total = p.stockLevels.reduce((s, l) => s + l.quantity, 0);
    return (p.reorderThreshold ?? 0) > 0 && total < (p.reorderThreshold ?? 0);
  }).length;

  return {
    totalProducts,
    lowStockOrOutOfStock: lowStockCount + outOfStockCount,
    outOfStockCount,
    pendingReceipts,
    pendingDeliveries,
    scheduledTransfers,
  };
}

// ----- Products -----
export async function getProducts(opts?: { categoryId?: string; skuSearch?: string }) {
  const orgId = await getOrgId();
  return prisma.product.findMany({
    where: {
      ...(orgId != null && { organizationId: orgId }),
      ...(opts?.categoryId && { categoryId: opts.categoryId }),
      ...(opts?.skuSearch && {
        OR: [
          { sku: { contains: opts.skuSearch, mode: "insensitive" } },
          { name: { contains: opts.skuSearch, mode: "insensitive" } },
        ],
      }),
    },
    include: { category: true, stockLevels: { include: { warehouse: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(id: string) {
  const orgId = await getOrgId();
  const product = await prisma.product.findUnique({
    where: { id, ...(orgId != null ? { organizationId: orgId } : {}) },
    include: { category: true, stockLevels: { include: { warehouse: true } } },
  });
  return product;
}

export async function getStockQuantity(productId: string, warehouseId: string) {
  const level = await prisma.stockLevel.findUnique({
    where: {
      productId_warehouseId: { productId, warehouseId },
    },
  });
  return level?.quantity ?? 0;
}

export async function createProduct(data: {
  name: string;
  sku: string;
  categoryId: string;
  unitOfMeasure: string;
  reorderThreshold?: number | null;
}) {
  return safe(async () => {
    const orgId = await getOrgId();
    if (orgId == null) throw new Error("Not authorized");
    return prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        categoryId: data.categoryId,
        organizationId: orgId,
        unitOfMeasure: data.unitOfMeasure,
        reorderThreshold: data.reorderThreshold ?? null,
      },
    });
  });
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    sku?: string;
    categoryId?: string;
    unitOfMeasure?: string;
    reorderThreshold?: number | null;
  }
) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.product.update({
      where: { id, ...(orgId != null ? { organizationId: orgId } : {}) },
      data,
    });
  });
}

export async function deleteProduct(id: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.product.delete({ where: { id, ...(orgId != null ? { organizationId: orgId } : {}) } });
  });
}

// ----- Categories -----
export async function getCategories() {
  const orgId = await getOrgId();
  return prisma.category.findMany({
    where: orgId != null ? { organizationId: orgId } : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(data: { name: string; slug: string }) {
  return safe(async () => {
    const orgId = await getOrgId();
    if (orgId == null) throw new Error("Not authorized");
    return prisma.category.create({ data: { ...data, organizationId: orgId } });
  });
}

export async function updateCategory(id: string, data: { name?: string; slug?: string }) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.category.update({ where: { id, ...(orgId != null ? { organizationId: orgId } : {}) }, data });
  });
}

export async function deleteCategory(id: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.category.delete({ where: { id, ...(orgId != null ? { organizationId: orgId } : {}) } });
  });
}

// ----- Warehouses -----
export async function getWarehouses() {
  const orgId = await getOrgId();
  return prisma.warehouse.findMany({
    where: orgId != null ? { organizationId: orgId } : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { stockLevels: true } } },
  });
}

export async function createWarehouse(data: { name: string; code?: string; address?: string }) {
  return safe(async () => {
    const orgId = await getOrgId();
    if (orgId == null) throw new Error("Not authorized");
    return prisma.warehouse.create({ data: { ...data, organizationId: orgId } });
  });
}

export async function updateWarehouse(
  id: string,
  data: { name?: string; code?: string; address?: string }
) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.warehouse.update({ where: { id, ...(orgId != null ? { organizationId: orgId } : {}) }, data });
  });
}

export async function deleteWarehouse(id: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.warehouse.delete({ where: { id, ...(orgId != null ? { organizationId: orgId } : {}) } });
  });
}

async function nextDocumentNumber(prefix: string, orgId: string | null): Promise<string> {
  const receiptWhere = orgId != null ? { warehouse: { organizationId: orgId } } : undefined;
  const deliveryWhere = orgId != null ? { warehouse: { organizationId: orgId } } : undefined;
  const transferWhere = orgId != null ? { fromWarehouse: { organizationId: orgId } } : undefined;
  const adjWhere = orgId != null ? { warehouse: { organizationId: orgId } } : undefined;
  let count = 0;
  switch (prefix) {
    case "REC":
      count = await prisma.receipt.count({ where: receiptWhere });
      break;
    case "DEL":
      count = await prisma.deliveryOrder.count({ where: deliveryWhere });
      break;
    case "TRF":
      count = await prisma.internalTransfer.count({ where: transferWhere });
      break;
    case "ADJ":
      count = await prisma.stockAdjustment.count({ where: adjWhere });
      break;
    default:
      count = await prisma.receipt.count({ where: receiptWhere });
  }
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

// ----- Receipts -----
export async function getReceipts(filters?: {
  status?: DocumentStatus;
  warehouseId?: string;
}) {
  const orgId = await getOrgId();
  return prisma.receipt.findMany({
    where: {
      ...(orgId != null && { warehouse: { organizationId: orgId } }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
    },
    include: {
      warehouse: true,
      lines: { include: { product: { include: { category: true, stockLevels: { include: { warehouse: true } } } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReceipt(warehouseId: string, supplier?: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    const documentNumber = await nextDocumentNumber("REC", orgId);
    return prisma.receipt.create({
      data: { documentNumber, warehouseId, supplier: supplier ?? null, status: DocumentStatus.Draft },
      include: { warehouse: true, lines: true },
    });
  });
}

export async function addReceiptLine(
  receiptId: string,
  productId: string,
  quantityOrdered: number,
  quantityReceived: number
) {
  return safe(async () => {
    return prisma.receiptLine.create({
      data: { receiptId, productId, quantityOrdered, quantityReceived },
      include: { product: true },
    });
  });
}

export async function validateReceipt(receiptId: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    const receipt = await prisma.receipt.findFirst({
      where: { id: receiptId, ...(orgId != null ? { warehouse: { organizationId: orgId } } : {}) },
      include: { lines: true },
    });
    if (!receipt || receipt.status !== DocumentStatus.Ready) return null;
    for (const line of receipt.lines) {
      await prisma.stockLevel.upsert({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: receipt.warehouseId,
          },
        },
        create: {
          productId: line.productId,
          warehouseId: receipt.warehouseId,
          quantity: line.quantityReceived,
        },
        update: { quantity: { increment: line.quantityReceived } },
      });
      await prisma.stockLedgerEntry.create({
        data: {
          productId: line.productId,
          warehouseId: receipt.warehouseId,
          quantityChange: line.quantityReceived,
          referenceType: "Receipt",
          referenceId: receiptId,
        },
      });
    }
    return prisma.receipt.update({
      where: { id: receiptId },
      data: { status: DocumentStatus.Done },
      include: { lines: true, warehouse: true },
    });
  });
}

export async function setReceiptStatus(receiptId: string, status: DocumentStatus) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.receipt.update({
      where: { id: receiptId, ...(orgId != null ? { warehouse: { organizationId: orgId } } : {}) },
      data: { status },
      include: { warehouse: true, lines: true },
    });
  });
}

// ----- Delivery Orders -----
export async function getDeliveryOrders(filters?: {
  status?: DocumentStatus;
  warehouseId?: string;
}) {
  const orgId = await getOrgId();
  return prisma.deliveryOrder.findMany({
    where: {
      ...(orgId != null && { warehouse: { organizationId: orgId } }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
    },
    include: {
      warehouse: true,
      lines: { include: { product: { include: { category: true, stockLevels: { include: { warehouse: true } } } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDeliveryOrder(warehouseId: string, customerRef?: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    const documentNumber = await nextDocumentNumber("DEL", orgId);
    return prisma.deliveryOrder.create({
      data: {
        documentNumber,
        warehouseId,
        customerRef: customerRef ?? null,
        status: DocumentStatus.Draft,
      },
      include: { warehouse: true, lines: true },
    });
  });
}

export async function addDeliveryLine(deliveryOrderId: string, productId: string, quantity: number) {
  return safe(async () => {
    return prisma.deliveryLine.create({
      data: { deliveryOrderId, productId, quantity },
      include: { product: true },
    });
  });
}

export async function validateDeliveryOrder(deliveryOrderId: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    const order = await prisma.deliveryOrder.findFirst({
      where: { id: deliveryOrderId, ...(orgId != null ? { warehouse: { organizationId: orgId } } : {}) },
      include: { lines: true },
    });
    if (!order || order.status !== DocumentStatus.Ready) return null;
    for (const line of order.lines) {
      const level = await prisma.stockLevel.findUnique({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: order.warehouseId,
          },
        },
      });
      if (!level || level.quantity < line.quantity) throw new Error("Insufficient stock");
      await prisma.stockLevel.update({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: order.warehouseId,
          },
        },
        data: { quantity: { decrement: line.quantity } },
      });
      await prisma.stockLedgerEntry.create({
        data: {
          productId: line.productId,
          warehouseId: order.warehouseId,
          quantityChange: -line.quantity,
          referenceType: "Delivery",
          referenceId: deliveryOrderId,
        },
      });
    }
    return prisma.deliveryOrder.update({
      where: { id: deliveryOrderId },
      data: { status: DocumentStatus.Done },
      include: { lines: true, warehouse: true },
    });
  });
}

export async function setDeliveryOrderStatus(
  deliveryOrderId: string,
  status: DocumentStatus
) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.deliveryOrder.update({
      where: { id: deliveryOrderId, ...(orgId != null ? { warehouse: { organizationId: orgId } } : {}) },
      data: { status },
      include: { warehouse: true, lines: true },
    });
  });
}

// ----- Internal Transfers -----
export async function getTransfers(filters?: {
  status?: DocumentStatus;
  warehouseId?: string;
}) {
  const orgId = await getOrgId();
  return prisma.internalTransfer.findMany({
    where: {
      ...(orgId != null && { fromWarehouse: { organizationId: orgId } }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.warehouseId && {
        OR: [
          { fromWarehouseId: filters.warehouseId },
          { toWarehouseId: filters.warehouseId },
        ],
      }),
    },
    include: {
      fromWarehouse: true,
      toWarehouse: true,
      lines: { include: { product: { include: { category: true, stockLevels: { include: { warehouse: true } } } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTransfer(fromWarehouseId: string, toWarehouseId: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    const documentNumber = await nextDocumentNumber("TRF", orgId);
    return prisma.internalTransfer.create({
      data: {
        documentNumber,
        fromWarehouseId,
        toWarehouseId,
        status: DocumentStatus.Draft,
      },
      include: { fromWarehouse: true, toWarehouse: true, lines: true },
    });
  });
}

export async function addTransferLine(
  transferId: string,
  productId: string,
  quantity: number
) {
  return safe(async () => {
    return prisma.transferLine.create({
      data: { transferId, productId, quantity },
      include: { product: true },
    });
  });
}

export async function validateTransfer(transferId: string) {
  return safe(async () => {
    const orgId = await getOrgId();
    const transfer = await prisma.internalTransfer.findFirst({
      where: { id: transferId, ...(orgId != null ? { fromWarehouse: { organizationId: orgId } } : {}) },
      include: { lines: true },
    });
    if (!transfer || transfer.status !== DocumentStatus.Ready) return null;
    for (const line of transfer.lines) {
      const from = await prisma.stockLevel.findUnique({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: transfer.fromWarehouseId,
          },
        },
      });
      if (!from || from.quantity < line.quantity) throw new Error("Insufficient stock at source");
      await prisma.stockLevel.update({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: transfer.fromWarehouseId,
          },
        },
        data: { quantity: { decrement: line.quantity } },
      });
      await prisma.stockLevel.upsert({
        where: {
          productId_warehouseId: {
            productId: line.productId,
            warehouseId: transfer.toWarehouseId,
          },
        },
        create: {
          productId: line.productId,
          warehouseId: transfer.toWarehouseId,
          quantity: line.quantity,
        },
        update: { quantity: { increment: line.quantity } },
      });
      await prisma.stockLedgerEntry.create({
        data: {
          productId: line.productId,
          warehouseId: transfer.fromWarehouseId,
          quantityChange: -line.quantity,
          referenceType: "Transfer",
          referenceId: transferId,
        },
      });
      await prisma.stockLedgerEntry.create({
        data: {
          productId: line.productId,
          warehouseId: transfer.toWarehouseId,
          quantityChange: line.quantity,
          referenceType: "Transfer",
          referenceId: transferId,
        },
      });
    }
    return prisma.internalTransfer.update({
      where: { id: transferId },
      data: { status: DocumentStatus.Done },
      include: { lines: true, fromWarehouse: true, toWarehouse: true },
    });
  });
}

export async function setTransferStatus(transferId: string, status: DocumentStatus) {
  return safe(async () => {
    const orgId = await getOrgId();
    return prisma.internalTransfer.update({
      where: { id: transferId, ...(orgId != null ? { fromWarehouse: { organizationId: orgId } } : {}) },
      data: { status },
      include: { fromWarehouse: true, toWarehouse: true, lines: true },
    });
  });
}

// ----- Stock Adjustments -----
export async function getAdjustments(filters?: { warehouseId?: string }) {
  const orgId = await getOrgId();
  return prisma.stockAdjustment.findMany({
    where: {
      ...(orgId != null && { warehouse: { organizationId: orgId } }),
      ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
    },
    include: {
      product: { include: { category: true, stockLevels: { include: { warehouse: true } } } },
      warehouse: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdjustment(data: {
  warehouseId: string;
  productId: string;
  quantityRecorded: number;
  quantityCounted: number;
  reason?: string;
}) {
  return safe(async () => {
    const orgId = await getOrgId();
    const documentNumber = await nextDocumentNumber("ADJ", orgId);
    const delta = data.quantityCounted - data.quantityRecorded;
    const adj = await prisma.stockAdjustment.create({
      data: {
        documentNumber,
        warehouseId: data.warehouseId,
        productId: data.productId,
        quantityRecorded: data.quantityRecorded,
        quantityCounted: data.quantityCounted,
        reason: data.reason ?? null,
        status: DocumentStatus.Draft,
      },
      include: { product: true, warehouse: true },
    });
    if (delta !== 0) {
      await prisma.stockLevel.upsert({
        where: {
          productId_warehouseId: {
            productId: data.productId,
            warehouseId: data.warehouseId,
          },
        },
        create: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantity: data.quantityCounted,
        },
        update: { quantity: data.quantityCounted },
      });
      await prisma.stockLedgerEntry.create({
        data: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantityChange: delta,
          referenceType: "Adjustment",
          referenceId: adj.id,
        },
      });
    }
    return prisma.stockAdjustment.update({
      where: { id: adj.id },
      data: { status: DocumentStatus.Done },
      include: { product: true, warehouse: true },
    });
  });
}

// ----- Low stock (for alerts) -----
export async function getLowStockProducts(limit = 20) {
  const orgId = await getOrgId();
  const products = await prisma.product.findMany({
    where: orgId != null ? { organizationId: orgId } : undefined,
    include: { category: true, stockLevels: { include: { warehouse: true } } },
    orderBy: { name: "asc" },
  });
  const withTotal = products.map((p) => ({
    ...p,
    totalStock: p.stockLevels.reduce((s, l) => s + l.quantity, 0),
  }));
  const lowOrOut = withTotal.filter((p) => {
    const total = p.totalStock;
    const threshold = p.reorderThreshold ?? 0;
    return threshold > 0 ? total < threshold : total === 0;
  });
  return lowOrOut.slice(0, limit);
}

// ----- Recent activity (ledger) for dashboard -----
export async function getRecentLedgerEntries(limit = 10) {
  const orgId = await getOrgId();
  return prisma.stockLedgerEntry.findMany({
    where: orgId != null ? { product: { organizationId: orgId } } : undefined,
    include: {
      product: { include: { category: true, stockLevels: { include: { warehouse: true } } } },
      warehouse: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ----- Move History (Stock Ledger) -----
export async function getMoveHistory(filters?: {
  productId?: string;
  warehouseId?: string;
  referenceType?: string;
}) {
  const orgId = await getOrgId();
  return prisma.stockLedgerEntry.findMany({
    where: {
      ...(orgId != null && { product: { organizationId: orgId } }),
      ...(filters?.productId && { productId: filters.productId }),
      ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
      ...(filters?.referenceType && { referenceType: filters.referenceType }),
    },
    include: {
      product: { include: { category: true, stockLevels: { include: { warehouse: true } } } },
      warehouse: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}
