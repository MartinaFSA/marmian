import { NextResponse } from "next/server";
import { mockDonors } from "@/data/mock-donors";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(title: string, text: string) {
  const safeTitle = escapeHtml(title);
  const safeText = escapeHtml(text).replace(/\r?\n/g, "<br />");

  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; max-width: 680px; margin: 0 auto; padding: 24px; background: #ffffff;">
      <div style="margin-bottom: 24px; color: #6b7280; font-size: 14px;">Marmian &lt;info@larenasdamian.com&gt;</div>
      <h1 style="font-size: 28px; line-height: 1.1; margin: 0 0 20px; color: #111111;">${safeTitle}</h1>
      <div style="font-size: 16px; line-height: 1.75; color: #334155;">
        ${safeText}
      </div>
      <div style="margin-top: 28px;">
        <a href="https://marmian.org" style="display: inline-block; padding: 14px 22px; background: #0f766e; color: white; border-radius: 9999px; text-decoration: none; font-weight: 600;">Ver campaña</a>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la variable de entorno RESEND_API_KEY." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { title, text, recipientIds } = body as {
    title?: string;
    text?: string;
    recipientIds?: string[];
  };

  if (!title?.trim() || !text?.trim() || !Array.isArray(recipientIds) || recipientIds.length === 0) {
    return NextResponse.json(
      { error: "Título, texto y destinatarios son obligatorios." },
      { status: 400 },
    );
  }

  const emails = ["hola@larenasdamian.com"]; // Email de prueba

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Marmian <info@larenasdamian.com>",
      to: emails,
      subject: title,
      html: buildHtml(title, text),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const resendError =
      data?.error?.message || data?.error || data?.message ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      JSON.stringify(data) ||
      "Error al enviar con Resend.";

    return NextResponse.json(
      { error: resendError },
      { status: response.status },
    );
  }

  return NextResponse.json({ ok: true, data });
}
