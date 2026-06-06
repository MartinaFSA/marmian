import { NextResponse } from "next/server";

const PLANS = {
  "3000": {
    id: process.env.MP_PLAN_3000!,
    checkout:
      "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=" +
      process.env.MP_PLAN_3000!,
  },

  "5000": {
    id: process.env.MP_PLAN_5000!,
    checkout:
      "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=" +
      process.env.MP_PLAN_5000!,
  },
};

export async function POST(req: Request) {
  const body = await req.json();

  const plan = PLANS[body.amount as keyof typeof PLANS];

  if (!plan) {
    return NextResponse.json(
      { error: "Plan inválido" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    checkoutUrl: plan.checkout,
  });
}