import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }
console.log("WEBHOOK BODY:", JSON.stringify(body, null, 2));
    const paymentId = body.data.id;

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await response.json();
    console.log("PAYMENT:", JSON.stringify(payment, null, 2));
    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const metadata = payment.metadata;
console.log("METADATA:", payment.metadata);
    const { error } = await supabaseAdmin
      .from("donors")
      .insert({
        name: metadata.name,
        phone: metadata.phone,
        email: metadata.email,
        status: metadata.status,
        organization_id: metadata.organization_id,
        interests: metadata.interests,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}