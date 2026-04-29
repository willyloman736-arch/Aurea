import { prisma, hasDatabase } from "./db";
import {
  demoStats,
  demoListAll,
  demoFindById,
  demoFindByCode,
  type DemoShipment,
} from "./demo-store";

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
    const s = demoStats();
    return { ...s, dbConfigured: false };
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

function demoToRow(s: DemoShipment): DashboardShipmentRow {
  return {
    id: s.id,
    trackingCode: s.trackingCode,
    carrier: s.carrier,
    status: s.status,
    service: s.service,
    originCity: s.originCity,
    destCity: s.destCity,
    etaDate: s.etaDate,
    progress: s.progress,
    updatedAt: s.updatedAt,
  };
}

export async function getShipments(limit = 50, search?: string): Promise<DashboardShipmentRow[]> {
  if (!hasDatabase()) {
    return demoListAll(limit, search).map(demoToRow);
  }

  try {
    return await prisma.shipment.findMany({
      where: search
        ? {
            OR: [
              { trackingCode: { contains: search, mode: "insensitive" } },
              { carrier: { contains: search, mode: "insensitive" } },
              { originCity: { contains: search, mode: "insensitive" } },
              { destCity: { contains: search, mode: "insensitive" } },
              { senderName: { contains: search, mode: "insensitive" } },
              { receiverName: { contains: search, mode: "insensitive" } },
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
  if (!hasDatabase()) return demoFindById(id);
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
  if (!hasDatabase()) return demoFindByCode(trackingCode);
  try {
    return await prisma.shipment.findUnique({
      where: { trackingCode: trackingCode.toUpperCase() },
      include: { events: { orderBy: { time: "desc" } } },
    });
  } catch {
    return null;
  }
}
