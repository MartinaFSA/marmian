import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/admin";
export async function PATCH(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email obligatorio",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("donors")
      .update({ status: "baja" })
      .eq("email", normalizedEmail)
      .select();

    if (error) {
      throw error;
    }

    if (!data?.length) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró un donante con ese email",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      donor: data[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error interno",
      },
      { status: 500 }
    );
  }
}