import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getMoveHistory, getProducts, getWarehouses } from "@/lib/inventory";
import { MoveHistoryView } from "./move-history-view";

const topNav = [
  { title: "Dashboard", href: "/", isActive: false, disabled: false },
  { title: "Products", href: "/products", isActive: false, disabled: false },
  { title: "Operations", href: "/operations/receipts", isActive: true, disabled: false },
  { title: "Settings", href: "/settings/warehouses", isActive: false, disabled: false },
];

export default async function MoveHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; warehouseId?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [entries, products, warehouses] = await Promise.all([
    getMoveHistory({
      productId: params.productId,
      warehouseId: params.warehouseId,
      referenceType: params.type,
    }),
    getProducts(),
    getWarehouses(),
  ]);

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
          <h1 className="text-2xl font-bold tracking-tight">Move History</h1>
          <MoveHistoryView
            entries={entries}
            products={products}
            warehouses={warehouses}
            initialProductId={params.productId}
            initialWarehouseId={params.warehouseId}
            initialType={params.type}
          />
        </div>
      </Main>
    </div>
  );
}
