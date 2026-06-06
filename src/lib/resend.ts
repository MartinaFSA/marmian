// Helper de envío de emails vía la REST API de Resend (sin SDK, solo fetch).
// La API key vive en la env var RESEND_API.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "Marmian <info@larenasdamian.com>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// HTML de un mensaje de comunicación a un donante.
export function buildMessageHtml(title: string, text: string): string {
  const safeTitle = escapeHtml(title);
  const safeText = escapeHtml(text).replace(/\r?\n/g, "<br />");

  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; max-width: 680px; margin: 0 auto; padding: 24px; background: #ffffff;">
      <h1 style="font-size: 24px; line-height: 1.2; margin: 0 0 16px; color: #111111;">${safeTitle}</h1>
      <div style="font-size: 16px; line-height: 1.75; color: #334155;">${safeText}</div>
    </div>
  `;
}

export type SendEmailResult = { ok: true } | { ok: false; error: string };

// Envía un email. Devuelve ok/error en vez de tirar, para poder loguear el
// resultado por destinatario.
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API;
  if (!apiKey) return { ok: false, error: "Falta la variable de entorno RESEND_API." };

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (res.ok) return { ok: true };

  const data = await res.json().catch(() => null);
  const error =
    data?.error?.message ||
    data?.error ||
    data?.message ||
    (Array.isArray(data?.errors) && data.errors[0]?.message) ||
    "Error al enviar con Resend.";
  return { ok: false, error: String(error) };
}
