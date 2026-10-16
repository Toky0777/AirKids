/**
 * Les temps forts d'une journée chez Air Kids.
 *
 * Déroulé présenté comme illustratif : l'organisation réelle varie selon les
 * sections et les jours. Aucun horaire précis n'est inventé ici (les horaires
 * publiés par l'école figurent dans src/data/hours.ts).
 */
import type { IconName } from "@/components/icon-map";
import type { ImageMetadata } from "astro";
import sensoriel from "@/assets/images/sensoriel-formes.jpg";
import jeuxConstruction from "@/assets/images/jeux-construction.jpg";
import aireDeJeux from "@/assets/images/aire-de-jeux.jpg";
import repasExterieur from "@/assets/images/repas-exterieur.jpg";
import sieste from "@/assets/images/sieste.jpg";
import jeuxExterieur from "@/assets/images/jeux-exterieur-maisonnette.jpg";

export interface DayMoment {
  title: string;
  text: string;
  icon: IconName;
  image?: ImageMetadata;
  imageAlt?: string;
}

export const dayMoments: DayMoment[] = [
  {
    title: "Accueil",
    text: "Un accueil progressif le matin, pour retrouver les copains et commencer la journée en douceur.",
    icon: "sunrise",
  },
  {
    title: "Jeux libres",
    text: "Des temps de jeu choisis par les enfants : explorer, imiter, construire, inventer.",
    icon: "blocks",
    image: jeuxExterieur,
    imageAlt:
      "Des enfants jouent autour d'une petite maison de jardin rose, encadrés par une éducatrice sur la pelouse",
  },
  {
    title: "Activités d'éveil",
    text: "Des ateliers guidés par l'équipe : langage, manipulation, motricité, formes et couleurs.",
    icon: "book-open",
    image: sensoriel,
    imageAlt:
      "Une enfant joue avec un jeu d'encastrement en bois aux formes colorées sur une table jaune",
  },
  {
    title: "Découvertes sensorielles",
    text: "Transvaser, toucher, trier, écouter : les sens sont au cœur des premiers apprentissages.",
    icon: "sparkles",
    image: jeuxConstruction,
    imageAlt:
      "Une enfant assemble des pièces de construction colorées dans un espace de jeu intérieur",
  },
  {
    title: "Activités extérieures",
    text: "Jardin, potager, jeux de motricité : quand le temps le permet, la nature fait partie de la classe.",
    icon: "leaf",
    image: aireDeJeux,
    imageAlt:
      "La pelouse de l'école avec une maisonnette, un toboggan, une bascule et le bâtiment principal en arrière-plan",
  },
  {
    title: "Repas & temps de repos",
    text: "Repas équilibrés préparés selon des critères de diététique, puis un temps calme ou une sieste.",
    icon: "apple",
    image: repasExterieur,
    imageAlt:
      "Des enfants prennent leur repas à l'extérieur, assis sur des chaises colorées autour de tables",
  },
  {
    title: "Départ",
    text: "Le retour en famille, avec la possibilité d'un accueil en garderie jusqu'en fin de journée.",
    icon: "home",
    image: sieste,
    imageAlt: "Un enfant se repose dans son lit pendant la sieste",
  },
];
