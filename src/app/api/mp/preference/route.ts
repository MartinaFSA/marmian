import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient, getBaseUrl } from "@/lib/mp";
import { getCampaign } from "@/data/campaigns";

// Donación por única vez: crea una preferencia de Checkout Pro y devuelve el
// init_point del sandbox para redirigir al usuario a pagar.
export async function POST(request: Request) {
  try {
    const { campaignId, amount, email, phone } = await request.json();

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
    const preference = new Preference(mpClient());

    const result = await preference.create({
      body: {
        items: [
          {
            id: String(campaign.id),
            title: `Donación: ${campaign.title}`,
            quantity: 1,
            unit_price: Number(amount),
            currency_id: "ARS",
          },
        ],
        payer: {
          email,
          ...(phone ? { phone: { number: String(phone) } } : {}),
        },
        back_urls: {
          success: `${baseUrl}/?mp=return`,
          failure: `${baseUrl}/?mp=return`,
          pending: `${baseUrl}/?mp=return`,
        },
        auto_return: "approved",
        metadata: { campaign_id: campaign.id, ong_id: campaign.ongId },
      },
    });

    const redirectUrl = result.sandbox_init_point ?? result.init_point;
    return NextResponse.json({ redirectUrl });
  } catch (err) {
    console.error("[mp/preference]", err);
    const message = err instanceof Error ? err.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
