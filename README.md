# Air Kids Madagascar — site vitrine

Site vitrine de l'établissement d'éducation préscolaire **Air Kids Madagascar**
(crèche, maternelle/préscolaire et garderie) situé à Ankerana,
Antananarivo, Madagascar.

Le site est **entièrement statique** : il se compile en fichiers HTML, CSS, JS
et images prêts à déposer sur n'importe quel hébergement (Netlify, Cloudflare
Pages, Apache, Nginx…). Aucune base de données ni serveur applicatif n'est
nécessaire.

## Stack

| Élément | Choix |
| --- | --- |
| Framework | [Astro 7](https://astro.build) (sortie statique) |
| Interactivité | [React 19](https://react.dev) en îlots (galerie, formulaire) |
| Styles | [Tailwind CSS 4](https://tailwindcss.com) (plugin Vite) |
| Langage | TypeScript |
| Icônes | `lucide-static` (intégrées au HTML à la compilation) |
| Polices | Fredoka + Nunito Sans, auto-hébergées (`@fontsource-variable`) |
| Images | `astro:assets` + `sharp` (génération de variantes AVIF/WebP/JPEG) |

Aucune requête vers des services tiers n'est effectuée au chargement
(pas d'iframe Google Maps, pas d'analytics, pas de CDN de polices).

## Prérequis

- **Node.js ≥ 22.12.0** (voir `engines` dans `package.json`) et npm ≥ 10.
- Pour le test interactif `npm run ui:check` : un navigateur **Edge** ou
  **Chrome** installé localement (chemin détecté automatiquement, ou variable
  `BROWSER_PATH`).
- Le dossier `assets-source/` (photos brutes d'origine) **n'est pas versionné**.
  Il n'est utile que pour régénérer les images ; les images optimisées sont déjà
  présentes dans `src/assets/images/` et `public/`.

## Installation

```bash
npm install
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement sur http://localhost:4321 |
| `npm run build` | Génère le site complet dans `dist/` |
| `npm run preview` | Sert `dist/` sur http://localhost:4321 (test avant mise en ligne) |
| `npm run check` | Vérification TypeScript / Astro (0 erreur exigée) |
| `npm run lint` | ESLint |
| `npm run audit` | Audit statique du build : liens, ressources, ancres, SEO, JSON-LD, ids dupliqués, `alt` manquants |
| `npm run ui:check` | Tests interactifs en navigateur headless (visionneuse de la galerie, formulaire, menu mobile). **Nécessite `npm run preview` lancé en parallèle** |
| `npm run assets:prepare` | Régénère les images optimisées depuis `assets-source/` (requiert le dossier source) |

Chaîne de vérification complète avant mise en ligne :

```bash
npm run check && npm run lint && npm run build && npm run audit
# puis, dans un second terminal :
npm run preview
# puis, dans le premier terminal :
npm run ui:check
```

`ui:check` accepte les variables `SITE_URL` (défaut `http://localhost:4321`),
`BROWSER_PATH` et `SHOT_DIR` (captures d'écran de contrôle).

## Formulaire de contact

Le formulaire fonctionne dans deux modes, sans jamais simuler d'envoi :

1. **Mode « courrier » (par défaut, sans configuration).** Aucune donnée n'est
   envoyée à un serveur : le formulaire ouvre l'application de messagerie du
   visiteur avec un message pré-rempli, et le rappelle honnêtement à l'écran.
2. **Mode « endpoint » (optionnel).** Si `PUBLIC_CONTACT_ENDPOINT` est
   renseignée dans `.env`, le formulaire envoie la demande en JSON (POST) à
   cette adresse et **n'affiche une confirmation que si la réponse HTTP est un
   succès**. Exemple : un endpoint Formspree.

Copier `.env.example` en `.env` et remplir la variable si besoin.
**Ne jamais y placer de clé secrète** : les variables `PUBLIC_*` sont visibles
côté client. Si un service d'envoi exige un jeton, passez par un petit relais
serveur (fonction Netlify/Cloudflare) plutôt que de l'exposer ici.

Le formulaire inclut un champ anti-robot invisible (piège à spam) et un délai
minimum de 3 secondes après l'ouverture de la page. Le bouton WhatsApp et les
réseaux sociaux ne sont **pas** affichés : aucune page officielle n'a pu être
vérifiée à ce jour.

## Déploiement

Le build produit un dossier `dist/` autoportant :

```bash
npm run build
```

- **Netlify / Cloudflare Pages** : build `npm run build`, dossier de
  publication `dist`. Le fichier `public/_redirects` (copié dans `dist/`) est
  pris en charge automatiquement pour les redirections 301.
- **Apache (mutualisé classique)** : déposer le contenu de `dist/` à la racine
  du site. Le fichier `public/.htaccess` (copié dans `dist/`) gère les
  redirections 301, la page 404 et le cache. `mod_rewrite` doit être actif.
- **Nginx** : servir `dist/` avec `try_files`. Les anciennes URLs sont
  couvertes par les pages de redirection générées par Astro (meta refresh +
  `noindex`), mais il est recommandé d'ajouter de vraies redirections 301 :

  ```nginx
  location = /index.html        { return 301 /; }
  location = /philosophie.html  { return 301 /notre-pedagogie/; }
  location = /infrastructure.html { return 301 /notre-environnement/; }
  location = /activites.html    { return 301 /nos-services/; }
  location = /atelier.html      { return 301 /nos-services/; }
  location = /organisation.html { return 301 /nos-services/; }
  location = /gallery.html      { return 301 /galerie/; }
  location = /contact.html      { return 301 /contact/; }
  location = /document.html     { return 301 /contact/; }
  ```

  Penser aussi à `error_page 404 /404.html;`.

### Domaine

Le domaine de référence est `https://airkids-mada.com` (défini dans
`astro.config.mjs`, utilisé pour les URL canoniques, le sitemap et les balises
Open Graph). Si le site est mis en ligne sur un autre domaine, mettre à jour la
clé `site` d'`astro.config.mjs` **et** l'URL du sitemap dans
`public/robots.txt`.

### Redirections des anciennes URLs

| Ancienne URL | Nouvelle URL |
| --- | --- |
| `/index.html` | `/` |
| `/philosophie.html` | `/notre-pedagogie/` |
| `/infrastructure.html` | `/notre-environnement/` |
| `/activites.html` | `/nos-services/` |
| `/atelier.html` | `/nos-services/` (section ateliers) |
| `/organisation.html` | `/nos-services/` (section fêtes) |
| `/gallery.html` | `/galerie/` |
| `/contact.html` | `/contact/` |
| `/document.html` | `/contact/` (documents d'inscription) |

## Structure du projet

```
src/
├─ assets/images/       Photos optimisées utilisées par le site
├─ components/          Composants Astro (sections, cartes, pied de page…)
│  ├─ react/            Îlots React (GalleryLightbox, ContactForm)
│  └─ sections/         Sections de la page d'accueil
├─ data/                Contenus structurés (services, horaires, FAQ…)
├─ layouts/             BaseLayout (head SEO, navigation, pied de page)
├─ pages/               Une page = une URL
└─ styles/              Tailwind + styles globaux
scripts/
├─ prepare-assets.mjs   Génération des images depuis assets-source/
├─ audit-build.mjs      Audit statique du dossier dist/
└─ ui-check.mjs         Tests interactifs en navigateur headless
public/                 Fichiers servis tels quels (robots.txt, favicons,
                        _redirects, .htaccess, image Open Graph)
```

Les contenus « sensibles » (tranches d'âge, horaires, services à confirmer…)
sont centralisés dans `src/data/` : c'est là qu'il faut corriger le texte après
validation par la direction.

## SEO

- Balises `title` / `description` uniques par page, URL canoniques,
  Open Graph et Twitter Cards (image `public/og-image.jpg`).
- `sitemap-index.xml` généré automatiquement (9 pages publiques ; 404 et pages
  de redirection exclues), référencé dans `public/robots.txt`.
- Données structurées JSON-LD limitées à ce qui est vérifié : `EducationalOrganization`
  (nom, adresse, téléphone, courriel, zone desservie). Aucun avis, aucune note,
  aucun horaire non confirmé n'y figure.
- Mots-clés travaillés en langage naturel : crèche, préscolaire/maternelle,
  garderie, Ankerana, Ankadindramamy, Antananarivo.

## Accessibilité

Objectif WCAG 2.2 AA : lien d'évitement, structure de titres cohérente, focus
visible, contrastes vérifiés, libellés de formulaires explicites, messages
d'erreur reliés aux champs, visionneuse fermable au clavier avec retour du
focus sur la vignette, animations désactivées avec `prefers-reduced-motion`.

## Photos

Les photos proviennent de l'ancien site de l'école (prises vers 2018). La
correspondance entre fichiers d'origine et fichiers optimisés est documentée
dans `scripts/prepare-assets.mjs` (tableau `PHOTOS`).

**Autorisation à obtenir avant mise en ligne publique** : la quasi-totalité des
photos montrent des enfants reconnaissables. La direction doit confirmer le
droit de diffusion de chacune (accord des familles). En cas de refus : remplacer
le fichier concerné dans `src/assets/images/` ou retirer l'entrée correspondante
dans `src/data/gallery.ts` / `src/data/services.ts`.

**Photos qui seraient utiles à ajouter** (aucune photo récente n'était
disponible) : salles de vie et de sieste récentes, repas en salle, temps
d'ateliers périscolaires, fêtes récentes, équipe éducative, portrait ou mot de
la directrice. Fournir des fichiers ≥ 1600 px de large.

## Contenu à valider par la direction

Tout ce qui touche à des informations institutionnelles est signalé dans le
code par des commentaires « À VALIDER » et, quand nécessaire, par une mention
visible au bon endroit sur le site. Liste récapitulative :

1. **Tranches d'âge** : crèche/nursery 3–24 mois ; maternelle 2–6 ans
   (TPS/PS/MS/GS) — reprises de l'ancien site, affichées avec la mention
   « à confirmer » (`src/data/services.ts`).
2. **Horaires** (`src/data/hours.ts`) : affichés « à titre indicatif » avec
   invitation à confirmer.
3. **Espaces verts : « 2 000 m² »** — chiffre publié sur l'ancien site
   (« Infrastructure ») ; à confirmer une dernière fois (`src/data/site.ts`).
4. **Programme éducatif français / enseignement en français** — mentionné par
   l'école, noté « à confirmer » à l'écran.
5. **Ateliers de vacances & périscolaire** et **Fêtes & événements** : l'existence
   actuelle n'est pas établie ; le site renvoie vers le contact au lieu
   d'affirmer des détails (`toConfirm` dans `src/data/services.ts`).
6. **Adresse et contacts** : adresse « Lot II H 41 C Ankerana Ankadindramamy,
   Antananarivo 101 » ; choisir l'adresse e-mail publique unique entre
   `airkids.mada@gmail.com` et `airkidsdirection24@gmail.com`
   (`src/data/site.ts`).
7. **Réseaux sociaux / WhatsApp** : rien n'est affiché tant qu'une page
   officielle n'est pas confirmée. Si un compte officiel existe, l'ajouter dans
   `src/data/site.ts` (`socials`).
8. **Mentions légales** : la page contient un encadré visible « Mention à
   finaliser avant la mise en ligne » pour les coordonnées de l'hébergeur et du
   responsable de publication à compléter
   (`src/pages/mentions-legales.astro`).
9. **Tarifs et documents d'inscription** : volontairement non publiés (les PDF
   disponibles dataient de 2018). Le site invite à demander la grille tarifaire
   via la page Contact.
10. **Photos** : voir la section « Photos » ci-dessus.

## Qualité — résultats mesurés

État au moment de la livraison (Node 22.12, build de production servi par
`astro preview` sur `localhost`) :

- `npm run check` : 0 erreur, 0 avertissement.
- `npm run lint` : aucun problème.
- `npm run build` : 10 pages générées, 159 images optimisées.
- `npm run audit` : 10 pages vérifiées, aucun problème.
- `npm run ui:check` : 14/14 vérifications réussies (galerie, formulaire, menu
  mobile, zéro erreur JS).
- **Lighthouse 12.8.2** (Chrome, configuration par défaut, réseau et CPU
  simulés) :

  | Page | Performance | Accessibilité | Bonnes pratiques | SEO |
  | --- | --- | --- | --- | --- |
  | Accueil (mobile) | 94 | 100 | 100 | 100 |
  | Accueil (bureau) | 100 | 100 | 100 | 100 |
  | Contact (mobile) | 99 | 100 | 100 | 100 |
  | Galerie (mobile) | 94 | 100 | 100 | 100 |

  CLS = 0 sur toutes les pages ; le LCP mobile (≈ 3,0 s en réseau lent simulé)
  est le principal poste d'amélioration restant.
