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

    // El donante ya se creó (status 'pending') al iniciar el pago, con este
    // external_reference. Acá lo marcamos pagado y registramos el cobro.
    const externalReference = payment.external_reference;
    const { error } = await supabaseAdmin
      .from("donors")
      .update({
        status: "paid",
        last_charge_at: new Date().toISOString(),
      })
      .eq("external_reference", externalReference);

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