/** Navigation principale du site (ordre validé avec la direction ? À VALIDER). */

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Notre école", href: "/notre-ecole/" },
  { label: "Nos services", href: "/nos-services/" },
  { label: "Notre pédagogie", href: "/notre-pedagogie/" },
  { label: "Notre environnement", href: "/notre-environnement/" },
  { label: "Galerie", href: "/galerie/" },
  { label: "Contact", href: "/contact/" },
];

export const footerNav: NavItem[] = [
  ...mainNav,
  { label: "Mentions légales", href: "/mentions-legales/" },
  { label: "Politique de confidentialité", href: "/confidentialite/" },
];
