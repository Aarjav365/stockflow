import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getReceipts, getWarehouses, getProducts } from "@/lib/inventory";
import { ReceiptsView } from "./receipts-view";

const topNav = [
  { title: "Dashboard", href: "/", isActive: false, disabled: false },
  { title: "Products", href: "/products", isActive: false, disabled: false },
  { title: "Operations", href: "/operations/receipts", isActive: true, disabled: false },
  { title: "Settings", href: "/settings/warehouses", isActive: false, disabled: false },
];

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const [receipts, warehouses, products] = await Promise.all([
    getReceipts(),
    getWarehouses(),
    getProducts(),
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
          <h1 className="text-2xl font-bold tracking-tight">Receipts</h1>
          <ReceiptsView
            receipts={receipts}
            warehouses={warehouses}
            products={products}
            selectedId={id ?? null}
          />
        </div>
      </Main>
    </div>
  );
}
