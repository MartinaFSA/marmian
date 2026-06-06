// app/api/organizations/recommended/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const { categories } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .in("category", categories);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}