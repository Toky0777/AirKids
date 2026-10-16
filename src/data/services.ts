/**
 * Services proposés par Air Kids Madagascar.
 *
 * Tranches d'âge : reprises des pages « Activités et services » du site actuel.
 * À VALIDER par la direction avant mise en production (voir README.md).
 *
 * Les services marqués `toConfirm` sont mentionnés par l'école mais leur
 * existence actuelle n'est pas établie : le site renvoie vers le contact
 * plutôt que d'affirmer des détails non vérifiés.
 */
import type { ImageMetadata } from "astro";
import type { IconName } from "@/components/icon-map";
import nursery from "@/assets/images/nursery-espace-bebes.jpg";
import salleClasse from "@/assets/images/salle-classe-maternelle.jpg";
import espaceToutPetits from "@/assets/images/espace-tout-petits.jpg";
import atelierKarate from "@/assets/images/atelier-karate.jpg";
import feteScene from "@/assets/images/fete-scene-enfants.jpg";

export type ServiceAccent = "sage" | "sun" | "sky" | "coral";

export interface Service {
  id: string;
  anchor: string;
  name: string;
  /** Tranche d'âge affichée uniquement lorsqu'elle est documentée. */
  ages?: string;
  agesToConfirm?: boolean;
  icon: IconName;
  accent: ServiceAccent;
  tagline: string;
  summary: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Points détaillés affichés sur la page « Nos services ». */
  details: string[];
  /** Précision affichée si l'offre demande une confirmation. */
  toConfirm?: boolean;
}

export const services: Service[] = [
  {
    id: "creche",
    anchor: "creche",
    name: "Crèche & nursery",
    ages: "3 – 24 mois",
    agesToConfirm: true,
    icon: "baby",
    accent: "sky",
    tagline: "Les tout-petits, en douceur",
    summary:
      "Une nursery pour les bébés, un espace pour les trotteurs, et un rythme adapté aux tout-petits dans des espaces sécurisés et adaptés à leur taille.",
    image: nursery,
    imageAlt:
      "Une encadrante porte un bébé dans l'espace des tout-petits, avec des jeux d'éveil au sol",
    details: [
      "Nursery pour les bébés : 3 à 12 mois",
      "Espace trotteurs : 12 à 24 mois",
      "Repas et goûter fournis par l'école ou par les parents",
      "Bain possible en fin de journée, à la demande des parents",
      "Début de l'apprentissage de la propreté chez les trotteurs, à la demande des parents",
    ],
  },
  {
    id: "maternelle",
    anchor: "maternelle",
    name: "Maternelle & préscolaire",
    ages: "2 – 6 ans",
    agesToConfirm: true,
    icon: "blocks",
    accent: "sun",
    tagline: "Apprendre en jouant",
    summary:
      "De la toute petite section à la grande section : les premiers apprentissages en français, par le jeu, le langage, la motricité et la vie collective.",
    image: salleClasse,
    imageAlt:
      "Une salle de classe colorée avec des tables multicolores, un tableau et des affiches de lettres et de chiffres",
    details: [
      "Toute petite section : 2 – 3 ans",
      "Petite section : 3 – 4 ans",
      "Moyenne section : 4 – 5 ans",
      "Grande section : 5 – 6 ans",
      "Enseignement en français, inspiré du programme éducatif français (à confirmer avec l'établissement)",
    ],
  },
  {
    id: "garderie",
    anchor: "garderie",
    name: "Garderie",
    icon: "clock",
    accent: "sage",
    tagline: "Avant et après l'école",
    summary:
      "Un accueil étendu avant et après les heures de classe, pour les enfants inscrits en crèche ou en maternelle.",
    image: espaceToutPetits,
    imageAlt:
      "Un espace de jeu intérieur avec une étagère basse remplie de jouets et des tapis colorés au sol",
    details: [
      "Accueil du matin dès 06h45",
      "Accueil du soir jusqu'à 18h00",
      "Pour les enfants inscrits en crèche et en maternelle",
    ],
  },
  {
    id: "ateliers",
    anchor: "ateliers-de-vacances-periscolaire",
    name: "Ateliers de vacances & périscolaire",
    icon: "palette",
    accent: "coral",
    tagline: "Des journées pleines d'idées",
    summary:
      "Pendant les vacances et le temps périscolaire : renforcement, anglais, sports, musique, grands jeux, ateliers artistiques, cuisine et environnement.",
    image: atelierKarate,
    imageAlt:
      "Des enfants en tenue de karaté participent à une démonstration sous un barnum, devant des cadeaux empilés",
    details: [
      "Activités de renforcement",
      "Cours d'anglais",
      "Sports : tennis, karaté, mini-foot…",
      "Musique, chant, danse et zumba",
      "Jeux d'intérieur et contes",
      "Jeux d'extérieur et grands jeux (course à obstacles…)",
      "Activités artistiques : peinture, dessin…",
      "Ateliers de cuisine",
      "Ateliers environnementaux",
      "Activités libres : jeux, puzzles, livres…",
    ],
    toConfirm: true,
  },
  {
    id: "fetes",
    anchor: "fetes-evenements",
    name: "Fêtes & événements",
    icon: "party-popper",
    accent: "sky",
    tagline: "Les grands moments",
    summary:
      "L'école organise des fêtes et des moments forts pour les enfants tout au long de l'année. Contactez-nous pour connaître les formules actuellement proposées.",
    image: feteScene,
    imageAlt:
      "Une scène extérieure sous un barnum, avec des enfants costumés et un public installé sur des bancs",
    details: [
      "Fêtes et spectacles de l'école avec les enfants et les familles",
      "Organisation de fêtes sur demande : contactez l'établissement pour connaître les possibilités actuelles",
    ],
    toConfirm: true,
  },
];

export const serviceAccentStyles: Record<
  ServiceAccent,
  { chip: string; icon: string; ring: string }
> = {
  sage: {
    chip: "bg-sage/15 text-sage-deep",
    icon: "bg-sage/20 text-sage-deep",
    ring: "group-hover:ring-sage/40",
  },
  sun: {
    chip: "bg-sun/25 text-ink",
    icon: "bg-sun/30 text-ink",
    ring: "group-hover:ring-sun/50",
  },
  sky: {
    chip: "bg-sky/20 text-sky-deep",
    icon: "bg-sky/25 text-sky-deep",
    ring: "group-hover:ring-sky/50",
  },
  coral: {
    chip: "bg-coral/20 text-coral-deep",
    icon: "bg-coral/20 text-coral-deep",
    ring: "group-hover:ring-coral/45",
  },
};
