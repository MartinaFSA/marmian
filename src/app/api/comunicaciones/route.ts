import { NextResponse } from "next/server";
import { resolveOrgId } from "@/lib/panel-auth";
import { supabaseAdmin } from "@/lib/admin";
import { buildMessageHtml, sendEmail } from "@/lib/resend";

// Envía las acciones de comunicación de donantes (un email por donante, con su
// plantilla ya renderizada) vía Resend y registra cada envío en `communications`.
//
// Donantes mock por ahora: enviamos todo al email de prueba (no a los donantes
// ficticios, que rebotarían). Cuando los donantes sean reales, reemplazar
// TEST_RECIPIENT por sus emails.
const TEST_RECIPIENT = "hola@larenasdamian.com";

type IncomingMessage = {
  segment: string; // clave del segmento (potencial | caido | unica | mensual)
  label: string; // etiqueta legible, se usa de asunto
  text: string; // texto renderizado de la plantilla
};

export async function POST(request: Request) {
  const orgId = await resolveOrgId();
  if (!orgId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { messages } = (await request.json()) as { messages?: IncomingMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "No hay mensajes para enviar." },
      { status: 400 },
    );
  }

  let sent = 0;
  const errors: string[] = [];

  for (const msg of messages) {
    if (!msg?.text?.trim()) continue;

    const result = await sendEmail({
      to: TEST_RECIPIENT,
      subject: `Marmian · ${msg.label}`,
      html: buildMessageHtml(msg.label, msg.text),
    });

    // Registrar el envío (o el fallo) en communications.
    await supabaseAdmin.from("communications").insert({
      organization_id: orgId,
      status: result.ok ? "sent" : "error",
      message: msg.text,
      template: msg.segment,
    });

    if (result.ok) sent += 1;
    else errors.push(result.error);
  }

  if (sent === 0) {
    return NextResponse.json(
      { error: errors[0] ?? "No se pudo enviar ningún mensaje." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, sent, errors });
}
