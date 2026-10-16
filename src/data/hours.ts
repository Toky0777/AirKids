/**
 * Horaires publiés par l'établissement (pages « Activités et services » du
 * site actuel). À VALIDER par la direction avant publication définitive :
 * ces tableaux sont affichés avec une mention invitant à confirmer.
 */

export type HoursTable = {
  id: string;
  title: string;
  columns: string[];
  rows: Array<{ day: string; cells: string[] }>;
};

export const hoursNote =
  "Horaires publiés à titre indicatif d'après les informations de l'établissement. Ils peuvent évoluer selon les sections : contactez l'école pour les confirmer.";

export const hoursTables: HoursTable[] = [
  {
    id: "creche",
    title: "Crèche (3 – 24 mois)",
    columns: ["Arrivée matin", "Sortie matin", "Arrivée après-midi", "Sortie après-midi"],
    rows: [
      {
        day: "Lundi au vendredi",
        cells: ["07h15 – 09h00", "11h30 – 12h00", "13h30 – 14h00", "15h30 – 17h00"],
      },
    ],
  },
  {
    id: "prescolaire",
    title: "Maternelle / préscolaire (2 – 6 ans)",
    columns: ["Arrivée matin", "Sortie matin", "Arrivée après-midi", "Sortie après-midi"],
    rows: [
      {
        day: "Lundi, mardi et jeudi",
        cells: ["07h15 – 08h30", "11h30 – 12h00", "13h30 – 14h00", "15h30 – 16h00"],
      },
      {
        day: "Mercredi et vendredi",
        cells: ["07h15 – 08h30", "11h30 – 12h00", "Pas de cours", "Pas de cours"],
      },
    ],
  },
  {
    id: "garderie-creche",
    title: "Garderie — crèche",
    columns: ["Accueil du matin", "Accueil du soir"],
    rows: [{ day: "Lundi au vendredi", cells: ["06h45 – 07h15", "17h00 – 18h00"] }],
  },
  {
    id: "garderie-maternelle",
    title: "Garderie — maternelle",
    columns: ["Accueil du matin", "Accueil du soir"],
    rows: [{ day: "Lundi au vendredi", cells: ["06h45 – 07h15", "16h00 – 18h00"] }],
  },
];

/** Résumé utilisé dans les encarts « Informations pratiques ». */
export const hoursSummary = [
  { label: "Accueil du matin", value: "07h15 – 09h00" },
  { label: "Sortie du matin", value: "11h30 – 12h00" },
  { label: "Après-midi", value: "13h30 – 14h00 → 15h30 – 17h00" },
  { label: "Garderie", value: "06h45 – 07h15 et jusqu'à 18h00" },
];
