import { supabaseAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("POST /api/donors called");
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      status,
      organization_id,
      interests
    } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim().toLowerCase().replace(/[\s\-()]+/g, "");

    console.log({
        name: name,
        phone: normalizedPhone,
        email: normalizedEmail,
        status: status,
        organization_id: organization_id,
        interests: interests
      });
    // Search donor
    const {
      data: newDonor,
      error: donorInsertError,
    } = await supabaseAdmin
      .from("donors")
      .insert({
        name: name,
        phone: normalizedPhone,
        email: normalizedEmail,
        status: status,
        organization_id: organization_id,
        interests: interests
      })
      .select()
      .single();

    if (donorInsertError || !newDonor) {
      throw new Error(
        donorInsertError?.message ??
        "No se pudo crear el donante"
      );
    }
    const donorId = newDonor.id;


    return NextResponse.json({
      success: true,
      donorId
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
      {
        status: 500,
      }
    );
  }
}