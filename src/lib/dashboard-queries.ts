import { prisma, hasDatabase } from "./db";

export interface DashboardStats {
  total: number;
  inTransit: number;
  delivered: number;
  exceptions: number;
  dbConfigured: boolean;
}

export interface DashboardShipmentRow {
  id: string;
  trackingCode: string;
  carrier: string | null;
  status: string;
  service: string | null;
  originCity: string | null;
  destCity: string | null;
  etaDate: string | null;
  progress: number;
  updatedAt: Date;
}

export async function getStats(): Promise<DashboardStats> {
  if (!hasDatabase()) {
    return { total: 0, inTransit: 0, delivered: 0, exceptions: 0, dbConfigured: false };
  }

  try {
    const [total, inTransit, delivered, exceptions] = await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({ where: { status: { in: ["In Transit", "Out for delivery"] } } }),
      prisma.shipment.count({ where: { status: "Delivered" } }),
      prisma.shipment.count({ where: { status: "Exception" } }),
    ]);
    return { total, inTransit, delivered, exceptions, dbConfigured: true };
  } catch {
    return { total: 0, inTransit: 0, delivered: 0, exceptions: 0, dbConfigured: false };
  }
}

export async function getShipments(limit = 50, search?: string): Promise<DashboardShipmentRow[]> {
  if (!hasDatabase()) return [];

  try {
    return await prisma.shipment.findMany({
      where: search
        ? {
            OR: [
              { trackingCode: { contains: search, mode: "insensitive" } },
              { carrier: { contains: search, mode: "insensitive" } },
              { originCity: { contains: search, mode: "insensitive" } },
              { destCity: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        trackingCode: true,
        carrier: true,
        status: true,
        service: true,
        originCity: true,
        destCity: true,
        etaDate: true,
        progress: true,
        updatedAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getShipmentById(id: string) {
  if (!hasDatabase()) return null;
  try {
    return await prisma.shipment.findUnique({
      where: { id },
      include: { events: { orderBy: { time: "desc" } } },
    });
  } catch {
    return null;
  }
}

export async function getShipmentByCode(trackingCode: string) {
  if (!hasDatabase()) return null;
  try {
    return await prisma.shipment.findUnique({
      where: { trackingCode: trackingCode.toUpperCase() },
      include: { events: { orderBy: { time: "desc" } } },
    });
  } catch {
    return null;
  }
}
