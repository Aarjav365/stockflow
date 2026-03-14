import { getWarehouses } from "@/lib/inventory";
import { ContentSection } from "../content-section";
import { WarehousesTable } from "./warehouses-table";

export default async function WarehousesPage() {
  const warehouses = await getWarehouses();
  return (
    <ContentSection
      title="Warehouses"
      desc="Manage warehouse locations. Add, edit, or remove warehouses."
    >
      <WarehousesTable warehouses={warehouses} />
    </ContentSection>
  );
}
