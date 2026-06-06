// Lectura de donantes desde Supabase, mapeada al shape que ya consume el panel
// (MockDonor). Server-only: usa la admin key porque `donors` tiene PII y no debe
// leerse con el cliente anon. Por ahora trae TODOS los donantes (sin filtrar por
// organización); el scoping por org queda como follow-up junto con Supabase Auth.

import { supabaseAdmin } from "@/lib/admin";
import type {
  MockDonor,
  DonorStatus,
  DonationType,
  BajaReason,
} from "@/data/mock-donors";

type DonorRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  donation_type: string | null;
  amount: number | null;
  last_charge_at: string | null;
  cancelled_reason: string | null;
  interests: unknown; // texto JSON ('[1, 3]') o array
};

const PANEL_STATUSES = new Set<DonorStatus>([
  "activo",
  "inactivo",
  "potencial",
  "baja",
]);
const DONATION_TYPES = new Set<DonationType>(["mensual", "unica"]);
const BAJA_REASONS = new Set<BajaReason>([
  "economico",
  "no_interesa",
  "desconfianza",
  "cambio_causa",
  "otro",
]);

// Normaliza el status: acepta el vocabulario del panel y mapea el de Mercado Pago.
function normalizeStatus(status: string | null): DonorStatus {
  if (status && PANEL_STATUSES.has(status as DonorStatus)) {
    return status as DonorStatus;
  }
  switch (status) {
    case "paid":
      return "activo";
    case "cancelled":
    case "canceled":
      return "baja";
    default: // 'pending' y cualquier otro
      return "inactivo";
  }
}

// `interests` puede venir como texto JSON o como array; devuelve ids numéricos.
function parseInterests(value: unknown): number[] {
  const arr = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? safeJsonArray(value)
      : [];
  return arr.map(Number).filter((n) => Number.isFinite(n));
}

function safeJsonArray(text: string): unknown[] {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toMockDonor(row: DonorRow): MockDonor {
  const donationType =
    row.donation_type && DONATION_TYPES.has(row.donation_type as DonationType)
      ? (row.donation_type as DonationType)
      : null;
  const bajaReason =
    row.cancelled_reason && BAJA_REASONS.has(row.cancelled_reason as BajaReason)
      ? (row.cancelled_reason as BajaReason)
      : null;

  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    donationType,
    amount: row.amount ?? null,
    lastChargeAt: row.last_charge_at ?? null,
    status: normalizeStatus(row.status),
    bajaReason,
    interests: parseInterests(row.interests),
  };
}

export async function fetchDonors(): Promise<MockDonor[]> {
  const { data, error } = await supabaseAdmin
    .from("donors")
    .select(
      "id, name, email, phone, status, donation_type, amount, last_charge_at, cancelled_reason, interests",
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchDonors:", error.message);
    return [];
  }
  return (data as DonorRow[]).map(toMockDonor);
}
