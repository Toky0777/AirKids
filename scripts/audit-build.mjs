/**
 * Audit statique du build — à lancer après `npm run build`.
 *
 * Vérifie dans tout le dossier `dist/` :
 * - les liens internes et les ressources (src, srcset, href) : cible présente ;
 * - les ancres (#section) : id correspondant présent sur la page cible ;
 * - la base SEO : <title>, meta description, canonical, lang="fr", un seul <h1> ;
 * - les JSON-LD : JSON valide ;
 * - les ids HTML dupliqués et les <img> sans attribut alt.
 *
 * Usage : npm run audit
 * (sortie en code 1 si au moins un problème est détecté)
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(DIST);
const relFiles = new Set(files.map((file) => path.relative(DIST, file).replaceAll("\\", "/")));

const htmlFiles = files.filter((file) => file.endsWith(".html"));

/** URL servie pour un fichier du build (trailingSlash: "always"). */
function urlFor(file) {
  const rel = path.relative(DIST, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404.html";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

/** Contenu HTML des pages réelles, indexé par URL. */
const pages = new Map();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  // Les stubs de redirection (meta refresh) ne sont pas de vraies pages.
  if (html.includes('http-equiv="refresh"')) continue;
  pages.set(urlFor(file), html);
}

const issues = [];

/** La cible d'un chemin interne existe-t-elle dans dist/ ? */
function targetExists(urlPath) {
  const clean = urlPath.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) return true; // lien relatif : non utilisé dans ce build
  const base = clean.replace(/^\//, "");
  const candidates = base === "" ? ["index.html"] : [base, `${base}/index.html`, `${base}index.html`];
  return candidates.some((candidate) => relFiles.has(candidate));
}

function checkHref(pageUrl, href, html) {
  if (!href || /^(https?:|mailto:|tel:|data:)/.test(href)) return;

  // Ancre interne à la page courante.
  if (href.startsWith("#")) {
    const hash = href.slice(1);
    if (hash && !html.includes(`id="${hash}"`)) {
      issues.push(`[ancre] ${pageUrl} → #${hash} absent de la page`);
    }
    return;
  }

  if (!targetExists(href)) {
    issues.push(`[lien] ${pageUrl} → cible introuvable : ${href}`);
    return;
  }

  const [target, hash] = href.split("#");
  if (!hash) return;

  const targetUrl = target === "" ? pageUrl : target;
  const targetHtml = pages.get(targetUrl);
  if (!targetHtml) {
    // Cible = ressource ou stub de redirection : pas d'ancre à vérifier.
    return;
  }
  if (!targetHtml.includes(`id="${hash}"`) && !targetHtml.includes(`name="${hash}"`)) {
    issues.push(`[ancre] ${pageUrl} → #${hash} absent de ${targetUrl}`);
  }
}

for (const [pageUrl, html] of pages) {
  // SEO de base
  if (!/<title>[^<]+<\/title>/.test(html)) issues.push(`[seo] ${pageUrl} : <title> manquant`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) {
    issues.push(`[seo] ${pageUrl} : meta description manquante`);
  }
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) {
    issues.push(`[seo] ${pageUrl} : canonical manquant`);
  }
  if (!html.includes('<html lang="fr"')) issues.push(`[seo] ${pageUrl} : lang="fr" manquant`);

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) issues.push(`[seo] ${pageUrl} : ${h1Count} balise(s) <h1> (attendu : 1)`);

  // Liens et ressources
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) checkHref(pageUrl, match[1], html);
  for (const match of html.matchAll(/srcset="([^"]*)"/g)) {
    for (const candidate of match[1].split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) checkHref(pageUrl, url, html);
    }
  }

  // JSON-LD valides
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      issues.push(`[json-ld] ${pageUrl} : bloc JSON-LD invalide`);
    }
  }

  // Ids dupliqués
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicates)) {
    issues.push(`[html] ${pageUrl} : id dupliqué « ${id} »`);
  }

  // Images sans alt
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(match[0])) {
      issues.push(`[a11y] ${pageUrl} : <img> sans attribut alt : ${match[0].slice(0, 90)}…`);
    }
  }
}

if (issues.length > 0) {
  console.error(`Audit terminé : ${issues.length} problème(s) détecté(s).\n`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(
  `Audit terminé : ${pages.size} pages vérifiées, aucun problème (liens, ressources, ancres, SEO, JSON-LD, ids, alt).`,
);
