// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/**
 * Air Kids Madagascar — site vitrine statique.
 *
 * - `compressHTML: true` conserve la gestion d'espaces « HTML » (Astro 7 utilise
 *   sinon la règle JSX, qui supprime les espaces entre éléments inline).
 * - Les `redirects` ci-dessous génèrent des pages de redirection HTML pour les
 *   anciennes URLs du site (philosophie.html, infrastructure.html, ...). Un
 *   fichier `public/_redirects` fournit en plus de vrais 301 sur les hébergeurs
 *   qui les prennent en charge (Netlify, Cloudflare Pages...). Voir README.md.
 */
export default defineConfig({
  site: "https://airkids-mada.com",
  compressHTML: true,
  trailingSlash: "always",
  integrations: [
    react(),
    sitemap({
      // Exclut la page 404 et les pages de redirection des anciennes URLs
      // (fichiers .html générés par `redirects`).
      filter: (page) => !page.includes("404") && !page.includes(".html"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    // « /index.html → / » n'est pas listé ici : la page racine occupe déjà
    // dist/index.html (conflit d'écriture). La redirection est assurée par
    // public/_redirects et public/.htaccess (voir README.md).
    "/philosophie.html": "/notre-pedagogie/",
    "/infrastructure.html": "/notre-environnement/",
    "/activites.html": "/nos-services/",
    "/gallery.html": "/galerie/",
    "/contact.html": "/contact/",
    "/atelier.html": "/nos-services/#ateliers-de-vacances-periscolaire",
    "/organisation.html": "/nos-services/#fetes-evenements",
    "/document.html": "/contact/#documents-inscriptions",
  },
});
