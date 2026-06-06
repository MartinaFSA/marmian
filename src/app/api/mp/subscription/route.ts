import { NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { mpClient, getBaseUrl } from "@/lib/mp";
import { getCampaign } from "@/data/campaigns";
import { supabaseAdmin } from "@/lib/admin";
import crypto from "crypto";

// Donación mensual: crea una suscripción (preapproval) con cobro recurrente
// mensual y devuelve el init_point para que el usuario la autorice.
export async function POST(request: Request) {
  try {
    const {
      campaignId,
      amount,
      email,
      name,
      phone,
      organization_id,
      interests,
    } = await request.json();

    const campaign = getCampaign(Number(campaignId));

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaña inexistente" },
        { status: 400 }
      );
    }

    const externalReference = crypto.randomUUID();

    const { data: donor, error: donorError } = await supabaseAdmin
      .from("donors")
      .insert({
        name,
        phone,
        email,
        status: "pending",
        organization_id,
        interests,
        external_reference: externalReference,
      })
      .select()
      .single();

    if (donorError) {
      throw donorError;
    }

    const baseUrl = getBaseUrl(request);

    const preapproval = new PreApproval(mpClient());

    const result = await preapproval.create({
      body: {
        reason: `Donación mensual - ${campaign.title}`,
        payer_email: email,

        external_reference: externalReference,

        back_url: `${baseUrl}/gracias`,

        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: Number(amount),
          currency_id: "ARS",
        },

        status: "pending",
      },
    });

    return NextResponse.json({
      redirectUrl: result.init_point,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Error inesperado",
      },
      {
        status: 500,
      }
    );
  }
}