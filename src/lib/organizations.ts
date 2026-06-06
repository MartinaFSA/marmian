// Acceso a las ONGs, ahora en Supabase (tablas `organizations` + `org_categories`).
// Reemplaza al antiguo seed estático `src/data/ongs.ts`. Lee con el cliente
// público (clave publishable / rol anon): el SELECT anon está habilitado por la
// policy `organizations_public_select` (ver DB scripts/02_orgs_and_categories.sql).
//
// La forma `Ong` se mantiene idéntica a la del seed viejo para no tocar el resto
// de la app: `id` es el `legacy_id` numérico, que es además el puente con las
// campañas (todavía estáticas, en src/data/campaigns.ts, que referencian `ongId`).

import { supabase } from "@/lib/client";

export type Ong = {
  id: number; // = organizations.legacy_id
  name: string;
  scope: string;
  activeCampaigns: number;
  categories: number[]; // ids de org_types
};

type OrgRow = {
  legacy_id: number | null;
  name: string;
  scope: string | null;
  active_campaigns: number | null;
  org_categories: { org_type_id: number }[] | null;
};

function toOng(row: OrgRow): Ong {
  return {
    id: row.legacy_id!,
    name: row.name,
    scope: row.scope ?? "",
    activeCampaigns: row.active_campaigns ?? 0,
    categories: (row.org_categories ?? []).map((c) => c.org_type_id),
  };
}

const ORG_SELECT = "legacy_id, name, scope, active_campaigns, org_categories(org_type_id)";

// Todas las ONGs con `legacy_id` (las únicas enlazables con las campañas estáticas).
export async function fetchOngs(): Promise<Ong[]> {
  const { data, error } = await supabase
    .from("organizations")
    .select(ORG_SELECT)
    .not("legacy_id", "is", null)
    .order("legacy_id", { ascending: true });

  if (error) {
    console.error("fetchOngs:", error.message);
    return [];
  }
  return (data as OrgRow[]).map(toOng);
}

// Una ONG por su id numérico (legacy_id). Devuelve null si no existe.
export async function getOngByLegacyId(legacyId: number): Promise<Ong | null> {
  const { data, error } = await supabase
    .from("organizations")
    .select(ORG_SELECT)
    .eq("legacy_id", legacyId)
    .maybeSingle();

  if (error) {
    console.error("getOngByLegacyId:", error.message);
    return null;
  }
  return data ? toOng(data as OrgRow) : null;
}

/**
 * Ordena las ONGs por cantidad de coincidencias con los intereses del usuario.
 * Si no hay intereses (o ninguna coincide), devuelve la lista completa.
 * Pura: recibe la lista ya cargada (antes operaba sobre el array estático).
 */
export function recommendOngs(ongs: Ong[], interests: number[]): Ong[] {
  if (interests.length === 0) return ongs;

  const scored = ongs
    .map((ong) => ({
      ong,
      matches: ong.categories.filter((c) => interests.includes(c)).length,
    }))
    .filter((entry) => entry.matches > 0)
    .sort((a, b) => b.matches - a.matches);

  if (scored.length === 0) return ongs;
  return scored.map((entry) => entry.ong);
}
