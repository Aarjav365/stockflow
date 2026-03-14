/**
 * One-time backfill: creates a "Default" organization and assigns all existing
 * users and inventory data (categories, products, warehouses) with null organizationId to it.
 * Run from project root: pnpm exec tsx scripts/backfill-organization.ts
 * Requires: DATABASE_URL in .env
 */
import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const org = await prisma.organization.create({
    data: { name: "Default" },
  });
  console.log("Created organization:", org.id, org.name);

  const [u, c, p, w] = await Promise.all([
    prisma.user.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } }),
    prisma.category.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } }),
    prisma.product.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } }),
    prisma.warehouse.updateMany({ where: { organizationId: null }, data: { organizationId: org.id } }),
  ]);
  console.log("Updated Users:", u.count, "Categories:", c.count, "Products:", p.count, "Warehouses:", w.count);
  console.log("Done. Existing users must sign out and sign in again to load their organization.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
