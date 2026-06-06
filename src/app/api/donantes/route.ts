import { NextResponse } from "next/server";
import { fetchDonors } from "@/lib/donors";

// Lista de donantes para el panel. Server-side con admin key (donors tiene PII).
// Requiere sesión del panel (cookie). Por ahora devuelve todos los donantes.
export async function GET() {
  const donors = await fetchDonors();
  return NextResponse.json(donors);
}
