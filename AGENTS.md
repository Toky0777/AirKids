# AGENTS.md — Air Kids Madagascar (site vitrine)

Guide pour les agents IA et les développeurs qui interviennent sur ce dépôt.
Il résume **les décisions prises, les règles à respecter et l'état du projet**.
Le détail utilisateur (installation, déploiement, contenu) est dans `README.md`.

## Règles non négociables

1. **Honnêteté éditoriale.** Aucune donnée inventée (avis, chiffres, prix,
   horaires, récompenses). Tout fait non vérifié est soit retiré, soit marqué
   d'un commentaire `À VALIDER` dans le code, avec une mention visible sur le
   site quand l'information est publiée (p. ex. « à confirmer »).
2. **Français.** Tout le contenu du site et la documentation sont en français
   (public : parents à Antananarivo, Madagascar).
3. **Aucun envoi simulé.** Le formulaire de contact ne doit jamais afficher une
   confirmation sans envoi réel : mode « courrier » honnête (mailto) par
   défaut, ou mode endpoint avec succès uniquement sur réponse HTTP OK.
4. **Aucune requête tierce au chargement** : pas d'iframe Google Maps, pas
   d'analytics, pas de CDN de polices, pas d'embeds. Les liens externes sont de
   simples liens.
5. **Pas de WhatsApp ni de réseaux sociaux** tant qu'aucune page officielle
   n'est confirmée par la direction (`src/data/site.ts`, `socials: []`).
6. **WCAG 2.2 AA** et `prefers-reduced-motion` ; approche mobile-first.
7. **Ne pas publier** les PDF tarifs/inscription de 2018 (obsolètes) ; la page
   Contact invite à demander la grille en vigueur.
8. Ne pas exposer de clé secrète côté client (les variables `PUBLIC_*` sont
   visibles dans le HTML/JS).

## Décisions techniques

| Sujet | Décision |
| --- | --- |
| Framework | Astro 7, sortie **statique** (`dist/`) |
| Interactivité | React 19, **2 îlots seulement** : `GalleryLightbox`, `ContactForm` — tout le reste est du HTML statique |
| Styles | Tailwind CSS 4 via `@tailwindcss/vite` ; palette dans `src/styles/global.css` (`@theme`) |
| Polices | Fredoka (titres) + Nunito Sans (texte), auto-hébergées via `@fontsource-variable` |
| Icônes | `lucide-static`, intégrées au HTML à la compilation (`src/components/icon-map.ts`) |
| Images | `astro:assets` + sharp ; photos réelles de l'ancien site (2018) |
| Domaine | `https://airkids-mada.com` ; `trailingSlash: "always"` ; `compressHTML: true` |
| Contenus | Centralisés dans `src/data/*.ts` (source de vérité éditoriale) |
| Sitemap | `@astrojs/sitemap` avec filtre excluant `404` et les `.html` (stubs de redirection) |
| JSON-LD | `EducationalOrganization` limité aux faits vérifiés (nom, adresse, tél., e-mail) |

### Pages (10)

`/` · `/notre-ecole/` · `/nos-services/` (ancres `#creche`, `#maternelle`,
`#garderie`, `#ateliers-de-vacances-periscolaire`, `#fetes-evenements`,
`#horaires`) · `/notre-pedagogie/` · `/notre-environnement/` · `/galerie/` ·
`/contact/` (ancres `#visite`, `#documents-inscriptions`) ·
`/mentions-legales/` · `/confidentialite/` · `404`.

### Redirections des anciennes URLs — 3 mécanismes

1. `astro.config.mjs` → `redirects` : stubs HTML (meta refresh 0 s + `noindex`)
   générés dans `dist/<page>.html/index.html`.
2. `public/_redirects` : vrais 301 pour Netlify / Cloudflare Pages.
3. `public/.htaccess` : vrais 301 pour Apache.

`/index.html → /` est **volontairement absent** d'`astro.config.mjs` (collision
avec `dist/index.html`) : il n'existe que dans `_redirects` et `.htaccess`.
Nginx : extrait fourni dans le README.

### Formulaire de contact

- Sans configuration : mode « courrier » (mailto) — aucune donnée envoyée.
- Avec `PUBLIC_CONTACT_ENDPOINT` (`.env`, ex. Formspree) : POST JSON, succès
  affiché uniquement si la réponse est un succès HTTP.
- Anti-robot : champ piège invisible (honeypot) + délai minimum de 3 s après
  chargement.
- Voir `.env.example`.

### Photos

- Sources d'origine dans `assets-source/` (**non versionné**), transformées par
  `npm run assets:prepare` vers `src/assets/images/` (mêmes données que la
  galerie/services). Correspondance source → nom sémantique : tableau `PHOTOS`
  dans `scripts/prepare-assets.mjs` (c'est la référence pour les crédits).
- ⚠️ Autorisation de diffusion à obtenir pour toute photo d'enfant
  reconnaissable avant mise en ligne publique (liste : README → « Photos »).

## Vérification (à lancer avant toute livraison)

```bash
npm run check          # 0 erreur / 0 avertissement exigé
npm run lint           # ESLint
npm run build          # 10 pages + ~159 images optimisées
npm run audit          # audit statique de dist/ : liens, ancres, SEO, JSON-LD, ids, alt
# dans un second terminal :
npm run preview        # http://localhost:4321
npm run ui:check       # tests navigateur : visionneuse, formulaire, menu mobile
```

Attendu : `audit` → 0 problème ; `ui:check` → **14/14**.

## Pièges connus (Windows / PowerShell / Astro)

- **Lighthouse CLI** : ne pas écrire `--only-categories=performance,accessibility,…`
  sans guillemets — PowerShell découpe les virgules et l'option devient une
  seule chaîne invalide (rapport sans catégories). Par défaut Lighthouse mesure
  déjà toutes les catégories : omettre l'option.
- **Navigateurs headless** : toujours passer un `--user-data-dir` dédié, sinon
  Edge/Chrome délègue à une session ouverte et le pilotage CDP échoue.
- **Hydratation Astro** : `<astro-island>` conserve l'attribut `ssr` jusqu'à
  l'hydratation ; les îlots `client:visible` doivent être amenés à l'écran
  (`scrollIntoView`) avant d'être testés.
- **`data-reveal`** : les sections sont à `opacity: 0` tant que
  l'IntersectionObserver n'a pas déclenché ; une capture pleine page sans
  défilement montre des zones vides — ce n'est pas un bug.
- **Stubs de redirection** : générés sous `dist/<page>.html/index.html` ;
  l'ancienne URL sans slash dépend de `_redirects`/`.htaccess`.
- **Débordement horizontal** : tester à 390 px de large avec emulation
  `mobile: false` (sinon le layout viewport s'élargit et masque le débordement).
  Pour un tableau à défilement dans une grille Tailwind : `overflow-x-auto` sur
  le conteneur **et `min-w-0` sur la carte parente** (grid item), sinon la
  grille s'élargit au lieu de faire défiler.
- **Port 4321** : tuer l'ancien serveur `preview` avant d'en relancer un
  (`Get-NetTCPConnection -LocalPort 4321`).

## État du projet (16/10/2026)

**Terminé et vérifié** :

- 10 pages complètes (accueil en 12 sections, services avec tableaux d'horaires,
  galerie 26 photos avec visionneuse, contact avec formulaire, pages légales,
  404 personnalisée).
- SEO : titres/descriptions uniques, canoniques, Open Graph + image générée,
  `sitemap-index.xml` (9 URLs), `robots.txt`, JSON-LD vérifié, redirections 301.
- Accessibilité : lien d'évitement, focus visible et géré (retour de focus de la
  visionneuse sur la vignette via Échap), erreurs de formulaire reliées aux
  champs, `prefers-reduced-motion`.
- `README.md` complet (installation, déploiement, contenu à valider, photos).

**Derniers correctifs** :

- `GalleryLightbox` : Échap rend le focus à la vignette (`closeAndReturnFocus`).
- `HoursTable` : ajout de `min-w-0` sur la carte (les tableaux défilent au lieu
  de déborder la page sur mobile).
- `PedagogySection` : blob décoratif rendu responsive (`-right-4 h-40` en
  mobile, `sm:-right-12 sm:h-56`) — plus de débordement à 390 px.

**Mesures au dernier passage** :

- `check` : 0 erreur / 0 avertissement · `lint` : propre.
- `build` : 10 pages, 159 images · `audit` : 10 pages, 0 problème.
- `ui:check` : 14/14 · zéro erreur JS.
- Lighthouse (défaut, réseau/CPU simulés) : accueil mobile **94**/100/100/100,
  accueil bureau **100**/100/100/100, contact mobile **99**/100/100/100,
  galerie mobile **94**/100/100/100 ; CLS = 0 partout. LCP mobile ≈ 3,0 s :
  principal axe d'amélioration restant.

**Reste à faire (dépend de la direction, pas du code)** : valider les contenus
signalés `À VALIDER` (tranches d'âge, horaires, programme français, « 2 000 m² »,
ateliers/fêtes, adresses e-mail), obtenir les autorisations photos, compléter
les mentions légales (hébergeur), décider du mode du formulaire
(`PUBLIC_CONTACT_ENDPOINT`). Détail : README → « Contenu à valider ».

## Où intervenir (carte rapide)

| Changement | Fichier(s) |
| --- | --- |
| Textes et données éditoriales | `src/data/*.ts` |
| Pages | `src/pages/*.astro` |
| Sections de l'accueil | `src/components/sections/*.astro` |
| Palette, typographie, utilitaires globaux | `src/styles/global.css` |
| SEO / `<head>` / navigation / footer | `src/layouts/BaseLayout.astro` (+ `src/components/SiteHeader.astro`, `SiteFooter.astro`) |
| Redirections | `astro.config.mjs`, `public/_redirects`, `public/.htaccess` |
| Photos optimisées | `src/assets/images/` (+ `scripts/prepare-assets.mjs`) |
| Tests | `scripts/audit-build.mjs`, `scripts/ui-check.mjs` |

## État du dépôt

Pas de dépôt git initialisé : le projet vit en fichiers locaux. `dist/`,
`node_modules/`, `.astro/`, `.env` et `assets-source/` sont ignorés
(`.gitignore` prêt pour une initialisation git future).
