import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton — avoids spawning a new client per hot-reload
 * in Next.js dev mode.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
