// ONGs de ejemplo. `categories` referencia los ids de `orgTypes`
// (src/data/organization-types.ts) y se usa para recomendar según los
// intereses elegidos por el usuario en el onboarding.

export type Ong = {
  id: number;
  name: string;
  scope: string;
  activeCampaigns: number;
  categories: number[];
};

export const ongs: Ong[] = [
  {
    id: 1,
    name: "Manos a la Olla",
    scope: "Buenos Aires, Argentina",
    activeCampaigns: 5,
    categories: [1, 3, 10], // Asistencia alimentaria, Infancia, Desarrollo comunitario
  },
  {
    id: 2,
    name: "Aprender Juntos",
    scope: "Catamarca, Argentina",
    activeCampaigns: 3,
    categories: [2, 3, 12], // Educación, Infancia, Empleo y capacitación
  },
  {
    id: 3,
    name: "Salud Sin Fronteras",
    scope: "Región Noroeste, Argentina",
    activeCampaigns: 8,
    categories: [4, 5, 13, 18], // Salud, Discapacidad, Mayores, Emergencias
  },
  {
    id: 4,
    name: "Tierra Viva",
    scope: "Argentina",
    activeCampaigns: 4,
    categories: [7, 8], // Ambientales, Protección animal
  },
  {
    id: 5,
    name: "Voces Iguales",
    scope: "Buenos Aires, Argentina",
    activeCampaigns: 2,
    categories: [6, 9, 16], // DDHH, Género y diversidad, Migrantes
  },
  {
    id: 6,
    name: "Techo y Hogar",
    scope: "Córdoba, Argentina",
    activeCampaigns: 6,
    categories: [11, 10, 17], // Vivienda, Desarrollo comunitario, Economía social
  },
  {
    id: 7,
    name: "Cancha Abierta",
    scope: "Rosario, Argentina",
    activeCampaigns: 3,
    categories: [15, 3, 2], // Deporte social, Infancia, Educación
  },
  {
    id: 8,
    name: "Raíces Culturales",
    scope: "Argentina",
    activeCampaigns: 1,
    categories: [14, 19, 20], // Cultura, Investigación, Religión
  },
];

/**
 * Devuelve las ONGs ordenadas por cantidad de coincidencias con los intereses
 * del usuario. Si no hay intereses (o ninguna coincide), devuelve todas.
 */
export function recommendOngs(interests: number[]): Ong[] {
  if (interests.length === 0) return ongs;

  const scored = ongs
    .map((ong) => ({
      ong,
      matches: ong.categories.filter((c) => interests.includes(c)).length,
    }))
    .filter((entry) => entry.matches > 0)
    .sort((a, b) => b.matches - a.matches);

  if (scored.length === 0) return ongs;
  return scored.map((entry) => entry.ong);
}
