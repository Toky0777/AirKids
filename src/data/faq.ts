/**
 * Questions fréquentes.
 *
 * Aucun tarif, aucune règle d'inscription et aucune date ne sont inventés :
 * les réponses non documentées renvoient vers l'établissement.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "À partir de quel âge Air Kids accueille-t-il les enfants ?",
    answer:
      "La crèche accueille les enfants de 3 à 24 mois (nursery pour les bébés de 3 à 12 mois, espace trotteurs de 12 à 24 mois) et la maternelle les enfants de 2 à 6 ans. Les équipes vous confirmeront les places disponibles selon les sections.",
  },
  {
    question: "Quels services sont proposés ?",
    answer:
      "Air Kids réunit une crèche (nursery et trotteurs), une maternelle et préscolaire, une garderie avant et après les heures de classe, ainsi que des ateliers de vacances et périscolaires. Des fêtes et événements sont également organisés : contactez-nous pour en connaître les formules.",
  },
  {
    question: "Comment demander une visite ?",
    answer:
      "C'est simple : envoyez-nous une demande depuis le formulaire de contact, appelez le +261 34 19 360 15 ou écrivez à airkids.mada@gmail.com. Nous vous proposerons un moment pour découvrir l'établissement et échanger sur les besoins de votre enfant.",
  },
  {
    question: "Comment se déroulent les inscriptions ?",
    answer:
      "La procédure et les places disponibles dépendent de la section et de la période. Contactez l'établissement : l'équipe vous indiquera les démarches en cours et vous accompagnera dans l'inscription.",
  },
  {
    question: "Quels documents faut-il fournir ?",
    answer:
      "La liste des documents dépend de la section (crèche ou maternelle). Elle vous sera communiquée par l'établissement lors de votre demande d'inscription, avec les formulaires à jour.",
  },
  {
    question: "Quels sont les horaires ?",
    answer:
      "L'accueil se fait le matin de 07h15 à 09h00 et l'après-midi de 13h30 à 14h00 ; les sorties s'échelonnent en fin de matinée et en fin d'après-midi. La garderie accueille les enfants dès 06h45 et jusqu'à 18h00. Les horaires détaillés figurent sur la page « Nos services » : n'hésitez pas à les confirmer avec l'école, ils peuvent évoluer selon les sections.",
  },
  {
    question: "Comment obtenir les tarifs ?",
    answer:
      "Les tarifs ne sont pas publiés en ligne. Contactez l'établissement par téléphone ou par e-mail : l'équipe vous transmettra la grille tarifaire en vigueur et les options possibles.",
  },
  {
    question: "Les repas sont-ils proposés ?",
    answer:
      "Oui. Le repas du midi et le goûter peuvent être fournis par l'école ou préparés par les parents. Les menus sont établis selon des critères de diététique : pas d'aliments frits ni de pâtisserie industrielle, et des fruits et légumes frais tous les jours.",
  },
  {
    question: "Quelles activités sont organisées pendant les vacances ?",
    answer:
      "Les ateliers de vacances et périscolaires proposent des activités variées : renforcement, cours d'anglais, sports (tennis, karaté, mini-foot…), musique, chant, danse, jeux d'intérieur et d'extérieur, contes, activités artistiques, ateliers de cuisine et ateliers environnementaux. Renseignez-vous auprès de l'école pour les périodes et les modalités.",
  },
];
