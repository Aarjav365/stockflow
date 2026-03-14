import { getWarehouses } from "@/lib/inventory";
import { DataLoadFallback } from "@/components/data-load-fallback";
import { ContentSection } from "../content-section";
import { WarehousesTable } from "./warehouses-table";

export default async function WarehousesPage() {
  let warehouses: Awaited<ReturnType<typeof getWarehouses>>;
  try {
    warehouses = await getWarehouses();
  } catch (err) {
    console.error("Warehouses data load failed:", err);
    return <DataLoadFallback pageName="warehouses" />;
  }
  return (
    <ContentSection
      title="Warehouses"
      desc="Manage warehouse locations. Add, edit, or remove warehouses."
    >
      <WarehousesTable warehouses={warehouses} />
    </ContentSection>
  );
}
