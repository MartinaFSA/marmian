import { MercadoPagoConfig } from "mercadopago";

// Cliente de Mercado Pago (lado servidor). Usa el access token de PRUEBA.
export function mpClient(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "Falta MP_ACCESS_TOKEN. Copiá .env.example a .env.local y cargá tu credencial de prueba.",
    );
  }
  return new MercadoPagoConfig({ accessToken });
}

// URL base para los back_urls. Prioriza NEXT_PUBLIC_APP_URL; si no, deriva del
// request (origin/host). Mercado Pago redirige acá al terminar el pago.
export function getBaseUrl(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const origin = request.headers.get("origin");
  if (origin) return origin;

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}
