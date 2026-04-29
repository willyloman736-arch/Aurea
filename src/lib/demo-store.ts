// In-process shipment store — fallback when DATABASE_URL is not configured.
// Persists for the lifetime of the Node.js process. On Vercel that means
// roughly until the next cold start (10-15 min idle). Perfect for demos.
//
// Shape matches Prisma's Shipment + TrackingEvent so consumers don't need
// branching logic — they just receive the same flat objects regardless of
// whether the data came from Postgres or this Map.

export interface DemoShipment {
  id: string;
  trackingCode: string;
  easypostId: string | null;
  carrier: string | null;
  status: string;
  service: string | null;
  weight: string | null;
  pieces: number;
  dimensions: string | null;
  originCity: string | null;
  originAddr: string | null;
  destCity: string | null;
  destAddr: string | null;
  etaDate: string | null;
  etaWindow: string | null;
  progress: number;
  senderName: string | null;
  senderEmail: string | null;
  senderPhone: string | null;
  receiverName: string | null;
  receiverEmail: string | null;
  receiverPhone: string | null;
  packageDescription: string | null;
  declaredValue: string | null;
  dispatchLocation: string | null;
  internalNotes: string | null;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  events: DemoEvent[];
}

export interface DemoEvent {
  id: string;
  shipmentId: string;
  time: Date;
  title: string;
  location: string | null;
  status: string | null;
  latest: boolean;
  createdAt: Date;
}

const store = new Map<string, DemoShipment>();

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

export interface DemoCreateInput {
  trackingCode: string;
  status?: string;
  progress?: number;
  carrier?: string;
  service?: string;
  weight?: string;
  pieces?: number;
  dimensions?: string;
  originCity?: string;
  originAddr?: string;
  destCity?: string;
  destAddr?: string;
  etaDate?: string;
  etaWindow?: string;
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverEmail?: string;
  receiverPhone?: string;
  packageDescription?: string;
  declaredValue?: string;
  dispatchLocation?: string;
  internalNotes?: string;
}

export function demoCreate(input: DemoCreateInput): DemoShipment {
  const id = genId("demo");
  const now = new Date();
  const code = input.trackingCode.toUpperCase();
  const shipment: DemoShipment = {
    id,
    trackingCode: code,
    easypostId: null,
    carrier: input.carrier ?? null,
    status: input.status ?? "Pending",
    service: input.service ?? null,
    weight: input.weight ?? null,
    pieces: input.pieces ?? 1,
    dimensions: input.dimensions ?? null,
    originCity: input.originCity ?? null,
    originAddr: input.originAddr ?? null,
    destCity: input.destCity ?? null,
    destAddr: input.destAddr ?? null,
    etaDate: input.etaDate ?? null,
    etaWindow: input.etaWindow ?? null,
    progress: input.progress ?? 1,
    senderName: input.senderName ?? null,
    senderEmail: input.senderEmail ?? null,
    senderPhone: input.senderPhone ?? null,
    receiverName: input.receiverName ?? null,
    receiverEmail: input.receiverEmail ?? null,
    receiverPhone: input.receiverPhone ?? null,
    packageDescription: input.packageDescription ?? null,
    declaredValue: input.declaredValue ?? null,
    dispatchLocation: input.dispatchLocation ?? null,
    internalNotes: input.internalNotes ?? null,
    ownerId: null,
    createdAt: now,
    updatedAt: now,
    events: [],
  };
  store.set(code, shipment);
  return shipment;
}

export function demoFindByCode(code: string): DemoShipment | null {
  return store.get(code.toUpperCase()) ?? null;
}

export function demoFindById(id: string): DemoShipment | null {
  for (const s of store.values()) {
    if (s.id === id) return s;
  }
  return null;
}

export function demoListAll(limit = 50, search?: string): DemoShipment[] {
  let all = Array.from(store.values()).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );
  if (search) {
    const q = search.toLowerCase();
    all = all.filter(
      (s) =>
        s.trackingCode.toLowerCase().includes(q) ||
        (s.carrier ?? "").toLowerCase().includes(q) ||
        (s.originCity ?? "").toLowerCase().includes(q) ||
        (s.destCity ?? "").toLowerCase().includes(q) ||
        (s.senderName ?? "").toLowerCase().includes(q) ||
        (s.receiverName ?? "").toLowerCase().includes(q),
    );
  }
  return all.slice(0, limit);
}

export function demoAddEvent(
  shipmentId: string,
  input: { time: Date; title: string; location: string | null; status: string },
): DemoEvent | null {
  const shipment = demoFindById(shipmentId);
  if (!shipment) return null;
  shipment.events = shipment.events.map((e) => ({ ...e, latest: false }));
  const ev: DemoEvent = {
    id: genId("ev"),
    shipmentId,
    time: input.time,
    title: input.title,
    location: input.location,
    status: input.status,
    latest: true,
    createdAt: new Date(),
  };
  shipment.events.unshift(ev);
  shipment.updatedAt = new Date();
  return ev;
}

export function demoUpdateStatus(
  shipmentId: string,
  status: string,
  progress: number,
): boolean {
  const shipment = demoFindById(shipmentId);
  if (!shipment) return false;
  shipment.status = status;
  shipment.progress = progress;
  shipment.updatedAt = new Date();
  return true;
}

export function demoStats() {
  const all = Array.from(store.values());
  return {
    total: all.length,
    inTransit: all.filter(
      (s) => s.status === "In Transit" || s.status === "Out for delivery",
    ).length,
    delivered: all.filter((s) => s.status === "Delivered").length,
    exceptions: all.filter((s) => s.status === "Exception").length,
  };
}

export function demoSize(): number {
  return store.size;
}
