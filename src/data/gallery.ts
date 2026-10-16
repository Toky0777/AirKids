/**
 * Galerie photo — photographies de l'école publiées sur le site actuel.
 *
 * À VALIDER : autorisations de diffusion des photos d'enfants (voir README.md).
 * Le texte alternatif décrit la scène sans nommer ni identifier les enfants.
 */
import type { ImageMetadata } from "astro";
import vueAerienne from "@/assets/images/vue-aerienne-jardin.jpg";
import nursery from "@/assets/images/nursery-espace-bebes.jpg";
import galerie04 from "@/assets/images/galerie-04.jpg";
import galerie09 from "@/assets/images/galerie-09.jpg";
import aireDeJeux from "@/assets/images/aire-de-jeux.jpg";
import galerie06 from "@/assets/images/galerie-06.jpg";
import potager from "@/assets/images/mini-potager.jpg";
import galerie08 from "@/assets/images/galerie-08.jpg";
import galerie16 from "@/assets/images/galerie-16.jpg";
import atelierClasse from "@/assets/images/atelier-classe.jpg";
import galerie03 from "@/assets/images/galerie-03.jpg";
import galerie10 from "@/assets/images/galerie-10.jpg";
import salleRepas from "@/assets/images/salle-repas.jpg";
import galerie12 from "@/assets/images/galerie-12.jpg";
import galerie15 from "@/assets/images/galerie-15.jpg";
import jeuxConstruction from "@/assets/images/jeux-construction.jpg";
import galerie02 from "@/assets/images/galerie-02.jpg";
import galerie14 from "@/assets/images/galerie-14.jpg";
import sensoriel from "@/assets/images/sensoriel-formes.jpg";
import galerie13 from "@/assets/images/galerie-13.jpg";
import galerie05 from "@/assets/images/galerie-05.jpg";
import galerie20 from "@/assets/images/galerie-20.jpg";
import galerie17 from "@/assets/images/galerie-17.jpg";
import facade from "@/assets/images/batiment-facade.jpg";
import feteScene from "@/assets/images/fete-scene-enfants.jpg";
import spectacle from "@/assets/images/spectacle-costumes.jpg";

export interface GalleryItem {
  id: string;
  image: ImageMetadata;
  alt: string;
  /** Photos mises en avant dans l'aperçu de la page d'accueil. */
  preview?: boolean;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "vue-aerienne",
    image: vueAerienne,
    alt: "Vue aérienne du jardin, de la pelouse et des espaces de jeu de l'école.",
    preview: true,
  },
  {
    id: "facade",
    image: facade,
    alt: "Le bâtiment de l'école, entouré d'arbres et de verdure.",
  },
  {
    id: "nursery",
    image: nursery,
    alt: "L'espace des bébés : une encadrante et un enfant parmi les jeux d'éveil.",
    preview: true,
  },
  {
    id: "jardin-cloture",
    image: galerie04,
    alt: "Une clôture aux couleurs vives au milieu des plantations du jardin.",
    preview: true,
  },
  {
    id: "repos-berceaux",
    image: galerie09,
    alt: "L'espace de repos des bébés : berceau en bois et fauteuil confortable.",
  },
  {
    id: "aire-de-jeux",
    image: aireDeJeux,
    alt: "L'aire de jeux sur la pelouse : maisonnette, toboggan, bascule et arbres.",
    preview: true,
  },
  {
    id: "trampoline",
    image: galerie06,
    alt: "Le trampoline en cordes, installé sur l'herbe près des jeux.",
  },
  {
    id: "mini-potager",
    image: potager,
    alt: "Le mini-potager de l'école et son panneau, avec de jeunes plants.",
    preview: true,
  },
  {
    id: "salle-de-bain",
    image: galerie08,
    alt: "La salle de bain des tout-petits, équipée de pots adaptés à leur taille.",
  },
  {
    id: "jardin-arbres",
    image: galerie16,
    alt: "Le jardin et ses grands arbres : tables vertes et bancs sur la pelouse.",
  },
  {
    id: "atelier-classe",
    image: atelierClasse,
    alt: "Atelier en classe : des enfants manipulent du matériel coloré autour d'une table.",
    preview: true,
  },
  {
    id: "structure-cordes",
    image: galerie03,
    alt: "La structure de motricité en cordes, installée sur la pelouse.",
  },
  {
    id: "chambre-lits",
    image: galerie10,
    alt: "Les lits des tout-petits, installés dans la chambre de la crèche.",
  },
  {
    id: "salle-repas",
    image: salleRepas,
    alt: "La salle de repas et ses tables colorées avec des sets de table.",
    preview: true,
  },
  {
    id: "arbre-et-banc",
    image: galerie12,
    alt: "Le jardin : un arbre et un banc tressé au milieu de la pelouse.",
  },
  {
    id: "terrain-tennis",
    image: galerie15,
    alt: "Le terrain de tennis de l'école, utilisé pendant les ateliers sportifs.",
    preview: true,
  },
  {
    id: "jeux-construction",
    image: jeuxConstruction,
    alt: "Une enfant assemble des pièces de construction colorées.",
  },
  {
    id: "cour-recreation",
    image: galerie02,
    alt: "La cour de récréation : maisonnette rose, toboggan et structure de jeu.",
  },
  {
    id: "jardin-potager",
    image: galerie14,
    alt: "Le jardin potager et ses plantations, vus depuis la pelouse.",
  },
  {
    id: "jeu-encastrement",
    image: sensoriel,
    alt: "Une enfant manipule un jeu d'encastrement en bois aux formes colorées.",
  },
  {
    id: "espace-tout-petits",
    image: galerie13,
    alt: "L'espace des tout-petits : étagères basses, paniers de jouets et tapis.",
    preview: true,
  },
  {
    id: "pelouse-toboggan",
    image: galerie05,
    alt: "La pelouse, le toboggan et le bâtiment principal sous les arbres.",
  },
  {
    id: "tennis-ateliers",
    image: galerie20,
    alt: "Séance de tennis pendant les ateliers : un coach et des enfants sur le court.",
  },
  {
    id: "jardin-allees",
    image: galerie17,
    alt: "Vue aérienne du jardin et des allées de l'école.",
  },
  {
    id: "spectacle-barnum",
    image: feteScene,
    alt: "Un spectacle de l'école sous un barnum rouge : enfants costumés et familles.",
  },
  {
    id: "spectacle-costumes",
    image: spectacle,
    alt: "Une représentation costumée sur la scène extérieure, devant les familles.",
  },
];

export const previewItems = galleryItems.filter((item) => item.preview);
