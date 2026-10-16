/**
 * Informations institutionnelles d'Air Kids Madagascar.
 *
 * Source : contenus publiés sur le site officiel actuel (https://airkids-mada.com)
 * et fiche de contact de l'établissement. Les points marqués « À VALIDER »
 * doivent être confirmés par la direction avant mise en production
 * (voir la liste complète dans README.md).
 */

export const site = {
  name: "Air Kids Madagascar",
  shortName: "Air Kids",
  tagline: "Un petit monde pour grandir, explorer et s'épanouir.",
  description:
    "Crèche, préscolaire et garderie à Ankerana, Antananarivo : un établissement d'éducation préscolaire où les enfants apprennent par le jeu, au contact de la nature.",
  url: "https://airkids-mada.com",
  address: {
    street: "Lot II H 41 C Ankerana Ankadindramamy",
    city: "Antananarivo",
    postalCode: "101",
    country: "Madagascar",
    countryCode: "MG",
  },
  phone: {
    display: "+261 34 19 360 15",
    href: "tel:+261341936015",
  },
  emails: {
    // À VALIDER : adresse publique unique à privilégier (deux adresses existent).
    primary: "airkids.mada@gmail.com",
    direction: "airkidsdirection24@gmail.com",
  },
  /** Lien d'itinéraire (Maps) — pas d'iframe : aucune requête tierce au chargement. */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Air+Kids+Ankerana+Ankadindramamy+Antananarivo+101+Madagascar",
  /** Espace vert annoncé sur la page « Infrastructure » du site actuel. */
  greenSpace: "2 000 m²",
  /** Horaires d'ouverture (voir src/data/hours.ts pour le détail). */
  openingDays: "Du lundi au vendredi",
  /**
   * À VALIDER : l'ancien site n'affiche que des liens vides (Twitter, Pinterest)
   * ou génériques (web.facebook.com). Tant qu'aucune page officielle n'est
   * confirmée, aucun réseau social n'est affiché sur le site.
   */
  socials: [] as Array<{ label: string; href: string }>,
} as const;

/** Quartiers / zones desservies, utiles pour le référencement local. */
export const servedAreas = [
  "Ankerana",
  "Ankadindramamy",
  "Antananarivo",
] as const;
