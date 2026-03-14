import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getTransfers, getWarehouses, getProducts } from "@/lib/inventory";
import { DataLoadFallback } from "@/components/data-load-fallback";
import { TransfersView } from "./transfers-view";

const topNav = [
  { title: "Dashboard", href: "/", isActive: false, disabled: false },
  { title: "Products", href: "/products", isActive: false, disabled: false },
  { title: "Operations", href: "/operations/receipts", isActive: true, disabled: false },
  { title: "Settings", href: "/settings/warehouses", isActive: false, disabled: false },
];

export default async function TransfersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let transfers: Awaited<ReturnType<typeof getTransfers>>;
  let warehouses: Awaited<ReturnType<typeof getWarehouses>>;
  let products: Awaited<ReturnType<typeof getProducts>>;
  try {
    [transfers, warehouses, products] = await Promise.all([
      getTransfers(),
      getWarehouses(),
      getProducts(),
    ]);
  } catch (err) {
    console.error("Transfers data load failed:", err);
    return <DataLoadFallback pageName="transfers" />;
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
          <h1 className="text-2xl font-bold tracking-tight">Internal Transfers</h1>
          <TransfersView
            transfers={transfers}
            warehouses={warehouses}
            products={products}
            selectedId={id ?? null}
          />
        </div>
      </Main>
    </div>
  );
}
