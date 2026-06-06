// Campañas de cada ONG. `ongId` referencia a `ongs` (src/data/ongs.ts).
// `description` es el texto largo que se muestra en /organizaciones/iniciativa.

export type Campaign = {
  id: number;
  ongId: number;
  title: string;
  summary: string;
  description: string;
};

export const campaigns: Campaign[] = [
  // Manos a la Olla (ong 1)
  {
    id: 101,
    ongId: 1,
    title: "Viandas para comedores",
    summary: "Cocinamos y repartimos viandas en comedores del conurbano.",
    description:
      "Cada semana preparamos y distribuimos viandas calientes en comedores comunitarios del conurbano bonaerense. Con tu aporte cubrimos ingredientes, gas y logística para que ninguna familia se quede sin un plato de comida.",
  },
  {
    id: 102,
    ongId: 1,
    title: "Mercadería para meriendas",
    summary: "Leche, cacao y galletitas para meriendas de barrios.",
    description:
      "Sostenemos meriendas para niñas y niños en barrios populares. Tu donación se transforma en leche, cacao, azúcar y galletitas para acompañar las tardes después de la escuela.",
  },

  // Aprender Juntos (ong 2)
  {
    id: 201,
    ongId: 2,
    title: "Apoyo escolar",
    summary: "Clases de apoyo gratuitas para chicos de primaria.",
    description:
      "Ofrecemos apoyo escolar gratuito para niñas y niños de primaria que necesitan acompañamiento. Financiamos materiales, espacios y becas para docentes voluntarios.",
  },
  {
    id: 202,
    ongId: 2,
    title: "Kits escolares",
    summary: "Útiles y mochilas para arrancar las clases.",
    description:
      "Armamos kits escolares completos con útiles, cuadernos y mochilas para que cada chico empiece el año sin barreras económicas.",
  },

  // Salud Sin Fronteras (ong 3)
  {
    id: 301,
    ongId: 3,
    title: "Operativos sanitarios",
    summary: "Controles médicos en zonas rurales del NOA.",
    description:
      "Llevamos operativos de salud a parajes rurales del Noroeste argentino: controles, vacunación y entrega de medicamentos donde no llega el sistema de salud.",
  },
  {
    id: 302,
    ongId: 3,
    title: "Sillas de ruedas",
    summary: "Movilidad para personas con discapacidad.",
    description:
      "Entregamos y reparamos sillas de ruedas y elementos ortopédicos para personas con discapacidad que no pueden costearlos.",
  },

  // Tierra Viva (ong 4)
  {
    id: 401,
    ongId: 4,
    title: "Reforestación nativa",
    summary: "Plantamos especies nativas para recuperar bosques.",
    description:
      "Recuperamos áreas degradadas plantando especies nativas junto a comunidades locales. Tu aporte cubre plantines, viveros y jornadas de plantación.",
  },
  {
    id: 402,
    ongId: 4,
    title: "Rescate animal",
    summary: "Rescate, recuperación y adopción responsable.",
    description:
      "Rescatamos animales en situación de abandono, los recuperamos y promovemos la adopción responsable. Financiamos veterinaria, alimento y refugio.",
  },

  // Voces Iguales (ong 5)
  {
    id: 501,
    ongId: 5,
    title: "Patrocinio jurídico",
    summary: "Acompañamiento legal gratuito en casos de DDHH.",
    description:
      "Brindamos patrocinio jurídico gratuito a personas vulneradas en sus derechos. Sostenemos un equipo legal que acompaña casos de discriminación y violencia.",
  },

  // Techo y Hogar (ong 6)
  {
    id: 601,
    ongId: 6,
    title: "Mejoras habitacionales",
    summary: "Materiales para viviendas seguras.",
    description:
      "Mejoramos condiciones habitacionales con materiales de construcción y mano de obra solidaria para familias en emergencia habitacional.",
  },

  // Cancha Abierta (ong 7)
  {
    id: 701,
    ongId: 7,
    title: "Escuelita de fútbol",
    summary: "Deporte y contención para barrios.",
    description:
      "Sostenemos escuelitas deportivas como espacio de contención e inclusión. Tu donación cubre indumentaria, equipamiento y meriendas.",
  },

  // Raíces Culturales (ong 8)
  {
    id: 801,
    ongId: 8,
    title: "Talleres culturales",
    summary: "Arte y patrimonio para la comunidad.",
    description:
      "Llevamos talleres de música, teatro y oficios artesanales a centros culturales barriales para preservar y compartir nuestro patrimonio.",
  },
];

export function campaignsByOng(ongId: number): Campaign[] {
  return campaigns.filter((c) => c.ongId === ongId);
}

export function getCampaign(id: number): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}
