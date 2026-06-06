import { NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { mpClient, getBaseUrl } from "@/lib/mp";
import { getCampaign } from "@/data/campaigns";

// Donación mensual: crea una suscripción (preapproval) con cobro recurrente
// mensual y devuelve el init_point para que el usuario la autorice.
export async function POST(request: Request) {
  try {
    const { campaignId, amount, email } = await request.json();

    const campaign = getCampaign(Number(campaignId));
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaña inexistente" },
        { status: 400 },
      );
    }
    if (!email || !(Number(amount) > 0)) {
      return NextResponse.json(
        { error: "Email y monto son obligatorios" },
        { status: 400 },
      );
    }

    const baseUrl = getBaseUrl(request);
    const preapproval = new PreApproval(mpClient());

    const result = await preapproval.create({
      body: {
        reason: `Donación mensual: ${campaign.title}`,
        payer_email: email,
        back_url: `${baseUrl}/?mp=return`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: Number(amount),
          currency_id: "ARS",
        },
        status: "pending",
      },
    });

    return NextResponse.json({ redirectUrl: result.init_point });
  } catch (err) {
    console.error("[mp/subscription]", err);
    const message = err instanceof Error ? err.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
