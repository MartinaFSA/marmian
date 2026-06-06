// Plantillas de mensajes (mail / WhatsApp) por segmento de donante. Son los
// guiones definidos por el equipo. El envío real todavía no existe: el panel solo
// muestra la plantilla sugerida y stubbea el "enviar".

import type { MockDonor } from "./mock-donors";
import { orgTypes } from "./organization-types";

export type Segment = "potencial" | "caido" | "unica" | "mensual";

export const SEGMENT_LABELS: Record<Segment, string> = {
  potencial: "Donante potencial",
  caido: "Donante caído (baja)",
  unica: "Donante de única vez",
  mensual: "Donante mensual activo",
};

// Determina el segmento de un donante para elegir la plantilla.
export function getSegment(donor: MockDonor): Segment {
  if (donor.status === "potencial") return "potencial";
  if (donor.status === "baja") return "caido";
  if (donor.donationType === "unica") return "unica";
  return "mensual";
}

function interestLabel(donor: MockDonor): string {
  const first = donor.interests[0];
  const match = orgTypes.find((t) => t.id === first);
  return match ? match.cat.toLowerCase() : "las causas que te importan";
}

// Devuelve el texto de mensaje sugerido para un donante según su segmento.
export function getTemplate(donor: MockDonor): string {
  const nombre = donor.name.split(" ")[0];
  const tema = interestLabel(donor);

  switch (getSegment(donor)) {
    case "potencial":
      return `Hola ${nombre}, sabemos que te interesa ${tema}. Sumate a ayudar a alguna de estas ONG's 💚`;
    case "caido":
      return `${nombre}, anteriormente donaste a ${tema}. Acá hay un resumen de lo que logramos este año gracias al apoyo de nuestros donantes mensuales. Te dejamos opciones más económicas para que vuelvas a apoyarnos 🙏`;
    case "unica":
      return `¡Gracias por tu donación, ${nombre}! ¿Querés multiplicar tu impacto? Suscribite mensualmente y acompañanos todo el año 💚`;
    case "mensual":
      return `¡Gracias por tu apoyo mensual, ${nombre}! Tu aporte sostiene cada una de nuestras campañas. Te compartimos cómo se está usando 💚`;
  }
}

// Mensajes de seguimiento para donantes de única vez (mes 1 y mes 2 posteriores).
export const ONE_TIME_FOLLOWUPS = [
  { whenLabel: "1 mes después", message: "¿Te sumás de nuevo? Doná nuevamente y seguí ayudando." },
  { whenLabel: "2 meses después", message: "Otras causas que te pueden interesar 👀" },
];
