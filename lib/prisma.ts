import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  const cached = globalForPrisma.prisma;
  // Use cached client only if it has inventory models (e.g. product); otherwise create a fresh one
  if (cached && typeof (cached as { product?: unknown }).product !== "undefined") {
    return cached;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

export const prisma = getPrisma();
