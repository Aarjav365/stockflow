import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getProducts, getLowStockProducts, getCategories } from "@/lib/inventory";
import { DataLoadFallback } from "@/components/data-load-fallback";
import { ProductsTable } from "./products-table";

const topNav = [
  { title: "Dashboard", href: "/", isActive: false, disabled: false },
  { title: "Products", href: "/products", isActive: true, disabled: false },
  { title: "Operations", href: "/operations/receipts", isActive: false, disabled: false },
  { title: "Settings", href: "/settings/warehouses", isActive: false, disabled: false },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; sku?: string; lowStock?: string }>;
}) {
  const params = await searchParams;
  const lowStockOnly = params.lowStock === "1";
  let products: Awaited<ReturnType<typeof getProducts>>;
  let categories: Awaited<ReturnType<typeof getCategories>>;
  try {
    [products, categories] = await Promise.all([
      lowStockOnly
        ? getLowStockProducts(500)
        : getProducts({ categoryId: params.categoryId, skuSearch: params.sku }),
      getCategories(),
    ]);
  } catch (err) {
    console.error("Products data load failed:", err);
    return <DataLoadFallback pageName="products" />;
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
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          </div>
          <ProductsTable
            products={products}
            categories={categories}
            initialCategoryId={params.categoryId}
            initialSkuSearch={params.sku}
            initialLowStock={lowStockOnly}
          />
        </div>
      </Main>
    </div>
  );
}
