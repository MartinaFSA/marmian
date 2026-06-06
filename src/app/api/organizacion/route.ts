import { NextResponse } from "next/server";
import { resolveOrgId } from "@/lib/panel-auth";
import { supabaseAdmin } from "@/lib/admin";

// Panel de organización: lee/escribe la fila real de `organizations`.
//
// El login todavía es placeholder (cookie con el email, no Supabase Auth), así
// que resolvemos "mi organización" por el email contra `users` usando la admin
// key (bypass RLS). Cuando exista Supabase Auth, reemplazar resolveOrgId() por
// auth.uid() y dejar que las policies RLS hagan el scoping.

const COLUMNS =
  "name,category,description,poc,instagram,facebook,linkedin,whatsapp,foundation_date";

// Campos editables desde el panel. Los nullable se vacían a null con "".
const NULLABLE = new Set([
  "category",
  "instagram",
  "facebook",
  "linkedin",
  "whatsapp",
  "foundation_date",
]);
const EDITABLE = [
  "name",
  "category",
  "description",
  "poc",
  "instagram",
  "facebook",
  "linkedin",
  "whatsapp",
  "foundation_date",
] as const;

export async function GET() {
  const orgId = await resolveOrgId();
  if (!orgId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select(COLUMNS)
    .eq("id", orgId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const orgId = await resolveOrgId();
  if (!orgId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const update: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (!(key in body)) continue;
    const value = body[key];
    update[key] = NULLABLE.has(key) && value === "" ? null : value;
  }

  const { error } = await supabaseAdmin
    .from("organizations")
    .update(update)
    .eq("id", orgId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
