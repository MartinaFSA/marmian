import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import { supabaseAdmin } from "@/lib/admin";

// Resuelve la organización del usuario logueado en el panel.
//
// El login todavía es placeholder (cookie con el email, no Supabase Auth), así
// que mapeamos email → users.organization_id con la admin key (bypass RLS).
// Cuando exista Supabase Auth, reemplazar por auth.uid() y dejar el scoping a RLS.
export async function resolveOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(SESSION_COOKIE)?.value;
  if (!email) return null;

  const { data } = await supabaseAdmin
    .from("users")
    .select("organization_id")
    .eq("email", email)
    .maybeSingle();

  return data?.organization_id ?? null;
}
