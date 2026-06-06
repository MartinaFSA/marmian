import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isAuthorizedEmail, AUTHORIZED_EMAIL } from "@/lib/session";

// Login placeholder: valida el email contra el único autorizado y setea la cookie
// de sesión. Sin contraseña ni Supabase Auth (eso llega cuando esté la base).
export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !isAuthorizedEmail(email)) {
    return NextResponse.json(
      { error: "Email no autorizado" },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, AUTHORIZED_EMAIL, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return NextResponse.json({ ok: true });
}
