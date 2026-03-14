import { Suspense } from "react";
import { Package, PackageMinus, PackagePlus, AlertTriangle, ArrowLeftRight, ClipboardList, Activity, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getDashboardKpis,
  getReceipts,
  getDeliveryOrders,
  getTransfers,
  getWarehouses,
  getCategories,
  getLowStockProducts,
  getRecentLedgerEntries,
} from "@/lib/inventory";
import { DashboardFilters } from "./dashboard-filters";
import { DocumentStatus } from "@/generated/prisma/client";

const topNav = [
  { title: "Dashboard", href: "/", isActive: true, disabled: false },
  { title: "Products", href: "/products", isActive: false, disabled: false },
  { title: "Operations", href: "/operations/receipts", isActive: false, disabled: false },
  { title: "Settings", href: "/settings/warehouses", isActive: false, disabled: false },
];

export default async function DashboardPage() {
  let kpis: Awaited<ReturnType<typeof getDashboardKpis>>;
  let recentReceipts: Awaited<ReturnType<typeof getReceipts>>;
  let recentDeliveries: Awaited<ReturnType<typeof getDeliveryOrders>>;
  let recentTransfers: Awaited<ReturnType<typeof getTransfers>>;
  let warehouses: Awaited<ReturnType<typeof getWarehouses>>;
  let categories: Awaited<ReturnType<typeof getCategories>>;
  let lowStockProducts: Awaited<ReturnType<typeof getLowStockProducts>>;
  let recentActivity: Awaited<ReturnType<typeof getRecentLedgerEntries>>;

  try {
    [kpis, recentReceipts, recentDeliveries, recentTransfers, warehouses, categories, lowStockProducts, recentActivity] =
      await Promise.all([
        getDashboardKpis(),
        getReceipts({ status: DocumentStatus.Draft }),
        getDeliveryOrders({ status: DocumentStatus.Draft }),
        getTransfers({ status: DocumentStatus.Draft }),
        getWarehouses(),
        getCategories(),
        getLowStockProducts(10),
        getRecentLedgerEntries(10),
      ]);
  } catch (err) {
    console.error("Dashboard data load failed:", err);
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <p className="text-sm text-muted-foreground">
          Unable to load dashboard. Check DATABASE_URL and AUTH_SECRET in your deployment environment.
        </p>
        <a href="/" className="text-sm text-primary underline">Try again</a>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header className="flex-none">
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="min-h-0 flex-1">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Inventory Dashboard</h1>
          </div>

          {/* KPIs - clickable */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.totalProducts}</div>
                <p className="text-xs text-muted-foreground">In catalog</p>
              </CardContent>
            </Card>
            <Link href="/products?lowStock=1">
              <Card className="transition-colors hover:bg-amber-500/10 hover:border-amber-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low / Out of Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.lowStockOrOutOfStock}</div>
                  <p className="text-xs text-muted-foreground">
                    {kpis.outOfStockCount} out of stock · Click to view
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/operations/receipts">
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Receipts</CardTitle>
                  <PackagePlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.pendingReceipts}</div>
                  <p className="text-xs text-muted-foreground">Incoming</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/operations/deliveries">
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                  <PackageMinus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.pendingDeliveries}</div>
                  <p className="text-xs text-muted-foreground">Outgoing</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/operations/transfers">
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transfers Scheduled</CardTitle>
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.scheduledTransfers}</div>
                  <p className="text-xs text-muted-foreground">Internal moves</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Dynamic filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Activity & filters
              </CardTitle>
              <CardDescription>
                Filter by document type, status, warehouse, or category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-9 w-48 animate-pulse rounded-md bg-muted" />}>
                <DashboardFilters warehouses={warehouses} categories={categories} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Low stock alerts + Recent activity */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingDown className="h-5 w-5 text-amber-600" />
                  Low stock alerts
                </CardTitle>
                <CardDescription>Products below reorder level or out of stock</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">All products are adequately stocked.</p>
                ) : (
                  <ul className="space-y-2">
                    {lowStockProducts.map((p) => (
                      <li key={p.id} className="flex items-center justify-between text-sm">
                        <Link href="/products?lowStock=1" className="font-medium text-primary hover:underline">
                          {p.name}
                        </Link>
                        <span className="text-muted-foreground">
                          {(p as { totalStock?: number }).totalStock ?? p.stockLevels?.reduce((s, l) => s + l.quantity, 0) ?? 0}{" "}
                          {p.reorderThreshold != null ? `< ${p.reorderThreshold}` : "out"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {lowStockProducts.length > 0 && (
                  <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                    <Link href="/products?lowStock=1">View all low stock</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5" />
                  Recent activity
                </CardTitle>
                <CardDescription>Latest stock movements from the ledger</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No movements yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {recentActivity.map((e) => (
                      <li key={e.id} className="text-sm">
                        <span className="font-medium">{e.product.name}</span>
                        <span className="text-muted-foreground"> @ {e.warehouse.name}</span>
                        <span className={e.quantityChange >= 0 ? "text-green-600" : "text-red-600"}>
                          {e.quantityChange >= 0 ? "+" : ""}{e.quantityChange}
                        </span>
                        <span className="text-muted-foreground"> · {e.referenceType}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href="/operations/move-history">View move history</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick links to pending documents */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Draft Receipts</CardTitle>
                <CardDescription>Incoming stock not yet validated</CardDescription>
              </CardHeader>
              <CardContent>
                {recentReceipts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No draft receipts.</p>
                ) : (
                  <ul className="space-y-2">
                    {recentReceipts.slice(0, 5).map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/operations/receipts?id=${r.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {r.documentNumber}
                        </Link>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {r.warehouse.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href="/operations/receipts">View all</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Draft Delivery Orders</CardTitle>
                <CardDescription>Outgoing orders not yet validated</CardDescription>
              </CardHeader>
              <CardContent>
                {recentDeliveries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No draft delivery orders.</p>
                ) : (
                  <ul className="space-y-2">
                    {recentDeliveries.slice(0, 5).map((d) => (
                      <li key={d.id}>
                        <Link
                          href={`/operations/deliveries?id=${d.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {d.documentNumber}
                        </Link>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {d.warehouse.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href="/operations/deliveries">View all</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Draft Transfers</CardTitle>
                <CardDescription>Internal moves not yet validated</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransfers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No draft transfers.</p>
                ) : (
                  <ul className="space-y-2">
                    {recentTransfers.slice(0, 5).map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/operations/transfers?id=${t.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {t.documentNumber}
                        </Link>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {t.fromWarehouse.name} → {t.toWarehouse.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href="/operations/transfers">View all</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </div>
  );
}
