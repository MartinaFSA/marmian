// Datos MOCK de donantes para construir la pantalla del panel mientras la base
// real (Supabase) la arma otra persona en paralelo. Reemplazar este módulo por
// lecturas reales cuando esté lista. Los `interests` referencian ids de
// `orgTypes` (src/data/organization-types.ts).

export type DonorStatus = "activo" | "inactivo" | "potencial" | "baja";
export type DonationType = "mensual" | "unica";
export type BajaReason =
  | "economico"
  | "no_interesa"
  | "desconfianza"
  | "cambio_causa"
  | "otro";

export type MockDonor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  donationType: DonationType | null; // null para potenciales (nunca aportaron)
  amount: number | null; // ARS del último/actual aporte
  lastChargeAt: string | null; // ISO; null si nunca se le cobró
  status: DonorStatus;
  bajaReason: BajaReason | null; // solo para status === "baja"
  interests: number[]; // ids de orgTypes
};

// Etiquetas legibles para la UI.
export const STATUS_LABELS: Record<DonorStatus, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  potencial: "Potencial",
  baja: "Baja",
};

export const DONATION_TYPE_LABELS: Record<DonationType, string> = {
  mensual: "Mensual",
  unica: "Única vez",
};

export const BAJA_REASON_LABELS: Record<BajaReason, string> = {
  economico: "Económico",
  no_interesa: "Ya no me interesa",
  desconfianza: "Desconfianza",
  cambio_causa: "Cambié de causa",
  otro: "Otro",
};

// Formatea una fecha ISO a "DD/MM/YY, HH:MM" (es-AR). Devuelve "—" si no hay dato.
export function formatLastCharge(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy}, ${hh}:${min}`;
}

// Formatea un monto ARS. Devuelve "—" si es null.
export function formatAmount(amount: number | null): string {
  if (amount == null) return "—";
  return `$${amount.toLocaleString("es-AR")}`;
}

export const mockDonors: MockDonor[] = [
  {
    id: "d1",
    name: "María González",
    email: "maria.gonzalez@gmail.com",
    phone: "1145678901",
    donationType: "mensual",
    amount: 5000,
    lastChargeAt: "2026-06-01T09:15:00",
    status: "activo",
    bajaReason: null,
    interests: [1, 3],
  },
  {
    id: "d2",
    name: "Juan Pérez",
    email: "juanperez@hotmail.com",
    phone: "1156789012",
    donationType: "mensual",
    amount: 3000,
    lastChargeAt: "2026-06-01T10:02:00",
    status: "activo",
    bajaReason: null,
    interests: [2, 7],
  },
  {
    id: "d3",
    name: "Lucía Fernández",
    email: "lucia.fernandez@gmail.com",
    phone: "1167890123",
    donationType: "unica",
    amount: 2000,
    lastChargeAt: "2026-05-20T18:40:00",
    status: "activo",
    bajaReason: null,
    interests: [4],
  },
  {
    id: "d4",
    name: "Diego Martínez",
    email: "dmartinez@yahoo.com",
    phone: "1178901234",
    donationType: "unica",
    amount: 1000,
    lastChargeAt: "2026-04-12T12:25:00",
    status: "inactivo",
    bajaReason: null,
    interests: [8, 10],
  },
  {
    id: "d5",
    name: "Sofía Romero",
    email: "sofiaromero@gmail.com",
    phone: "1189012345",
    donationType: null,
    amount: null,
    lastChargeAt: null,
    status: "potencial",
    bajaReason: null,
    interests: [1, 9],
  },
  {
    id: "d6",
    name: "Martín Sosa",
    email: "martin.sosa@gmail.com",
    phone: "1190123456",
    donationType: null,
    amount: null,
    lastChargeAt: null,
    status: "potencial",
    bajaReason: null,
    interests: [7, 11],
  },
  {
    id: "d7",
    name: "Valentina Díaz",
    email: "valen.diaz@outlook.com",
    phone: "1101234567",
    donationType: "mensual",
    amount: 5000,
    lastChargeAt: "2026-03-01T08:30:00",
    status: "baja",
    bajaReason: "economico",
    interests: [3, 5],
  },
  {
    id: "d8",
    name: "Tomás Acosta",
    email: "tomas.acosta@gmail.com",
    phone: "1112345678",
    donationType: "mensual",
    amount: 3000,
    lastChargeAt: "2026-02-15T16:10:00",
    status: "baja",
    bajaReason: "no_interesa",
    interests: [2],
  },
  {
    id: "d9",
    name: "Camila Ruiz",
    email: "camila.ruiz@gmail.com",
    phone: "1123456780",
    donationType: "mensual",
    amount: 10000,
    lastChargeAt: "2026-01-30T11:45:00",
    status: "baja",
    bajaReason: "desconfianza",
    interests: [6, 9],
  },
  {
    id: "d10",
    name: "Nicolás Herrera",
    email: "nico.herrera@gmail.com",
    phone: "1134567801",
    donationType: "unica",
    amount: 1500,
    lastChargeAt: "2026-05-28T20:05:00",
    status: "activo",
    bajaReason: null,
    interests: [10, 12],
  },
  {
    id: "d11",
    name: "Florencia Castro",
    email: "flor.castro@gmail.com",
    phone: "1145670912",
    donationType: "mensual",
    amount: 5000,
    lastChargeAt: "2026-06-01T07:50:00",
    status: "activo",
    bajaReason: null,
    interests: [1, 13],
  },
  {
    id: "d12",
    name: "Gabriel Morales",
    email: "gabriel.morales@gmail.com",
    phone: "1156701234",
    donationType: "unica",
    amount: 800,
    lastChargeAt: "2026-03-18T14:20:00",
    status: "baja",
    bajaReason: "cambio_causa",
    interests: [4, 7],
  },
];
