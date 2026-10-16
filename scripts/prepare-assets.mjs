/**
 * Préparation des médias d'Air Kids Madagascar.
 *
 * Ce script transforme les photos brutes téléchargées depuis l'ancien site
 * (dossier `assets-source/`, non versionné) en ressources optimisées dans
 * `src/assets/images/`, et génère les fichiers publics (favicons, image
 * Open Graph) dans `public/`.
 *
 * Usage : npm run assets:prepare
 *
 * Les noms de fichiers de sortie sont sémantiques et la correspondance avec
 * les fichiers d'origine est documentée dans le README (section « Photos »).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-source";
const OUT = "src/assets/images";
const PUBLIC = "public";

/**
 * Correspondance : fichier source -> nom sémantique utilisé dans le site.
 * Tableau de paires (et non objet) : un même fichier source peut alimenter
 * plusieurs sorties (ex. galerie/11.jpg -> salle-repas.jpg + galerie-11.jpg).
 */
const PHOTOS = [
  ["philo3.jpg", "hero-tout-petits-jardin.jpg"],
  ["act1.jpg", "sensoriel-formes.jpg"],
  ["act3.jpg", "cour-jeux-enfants.jpg"],
  ["infra.jpg", "batiment-facade.jpg"],
  ["about_us2.jpg", "jeux-exterieur-maisonnette.jpg"],
  ["infra9.jpg", "nursery-espace-bebes.jpg"],
  ["slide_02.jpg", "salle-classe-maternelle.jpg"],
  ["galerie/11.jpg", "salle-repas.jpg"],
  ["galerie/13.jpg", "espace-tout-petits.jpg"],
  ["slide_06.jpg", "atelier-karate.jpg"],
  ["slide_03.jpg", "fete-scene-enfants.jpg"],
  ["slide_04.jpg", "spectacle-costumes.jpg"],
  ["potager.jpg", "mini-potager.jpg"],
  ["philo2.jpg", "atelier-classe.jpg"],
  ["act6.jpg", "jeux-construction.jpg"],
  ["bebe.jpg", "sieste.jpg"],
  ["philo4.jpg", "repas-exterieur.jpg"],
  ["infra3.jpg", "aire-de-jeux.jpg"],
  ["infra8.jpg", "banc-jardin.jpg"],
  ["about_us.jpg", "vue-aerienne-jardin.jpg"],
  ["galerie/1.jpg", "galerie-01.jpg"],
  ["galerie/2.jpg", "galerie-02.jpg"],
  ["galerie/3.jpg", "galerie-03.jpg"],
  ["galerie/4.jpg", "galerie-04.jpg"],
  ["galerie/5.jpg", "galerie-05.jpg"],
  ["galerie/6.jpg", "galerie-06.jpg"],
  ["galerie/8.jpg", "galerie-08.jpg"],
  ["galerie/9.jpg", "galerie-09.jpg"],
  ["galerie/10.jpg", "galerie-10.jpg"],
  ["galerie/11.jpg", "galerie-11.jpg"],
  ["galerie/12.jpg", "galerie-12.jpg"],
  ["galerie/13.jpg", "galerie-13.jpg"],
  ["galerie/14.jpg", "galerie-14.jpg"],
  ["galerie/15.jpg", "galerie-15.jpg"],
  ["galerie/16.jpg", "galerie-16.jpg"],
  ["galerie/17.jpg", "galerie-17.jpg"],
  ["galerie/20.jpg", "galerie-20.jpg"],
];

async function preparePhotos() {
  for (const [from, to] of PHOTOS) {
    let pipeline = sharp(path.join(SRC, from)).rotate();

    // La photo de classe d'origine porte un filigrane d'appareil photo
    // (« 100 5G | GEN ») dans le coin inférieur gauche : on le retaille.
    if (from === "slide_02.jpg") {
      pipeline = pipeline.extract({ left: 0, top: 0, width: 1400, height: 868 });
    }

    await pipeline
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(path.join(OUT, to));
  }

  // Logo conservé tel quel (PNG transparent fourni par l'école).
  await sharp(path.join(SRC, "logo.png"))
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "logo-air-kids.png"));
}

async function prepareIcons() {
  const CREAM = { r: 255, g: 249, b: 238, alpha: 1 };
  const mark = await sharp(path.join(SRC, "icon.png"))
    .trim()
    .resize({ width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const sizes = [
    ["favicon-32x32.png", 32, 26],
    ["favicon-16x16.png", 16, 13],
    ["apple-touch-icon.png", 180, 140],
    ["icon-192.png", 192, 150],
    ["icon-512.png", 512, 400],
  ];

  for (const [name, size, logoSize] of sizes) {
    const logo = await sharp(mark)
      .resize({ width: logoSize, height: logoSize, fit: "contain" })
      .png()
      .toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
      .composite([{ input: logo, gravity: "center" }])
      .png()
      .toFile(path.join(PUBLIC, name));
  }
}

async function prepareOgImage() {
  const W = 1200;
  const H = 630;
  const base = await sharp(path.join(SRC, "slide_04.jpg"))
    .resize({ width: W, height: H, fit: "cover", position: "attention" })
    .jpeg({ quality: 86 })
    .toBuffer();

  const veil = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="45%" stop-color="#283B32" stop-opacity="0"/>
          <stop offset="100%" stop-color="#283B32" stop-opacity="0.72"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
    </svg>`,
  );

  const logo = await sharp(path.join(SRC, "logo.png")).resize({ width: 340 }).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const logoH = logoMeta.height ?? 110;
  const chipH = logoH + 56;
  const chipW = 340 + 64;
  const chipLeft = 56;
  const chipTop = H - chipH - 56;

  const chip = Buffer.from(
    `<svg width="${chipW}" height="${chipH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${chipW}" height="${chipH}" rx="30" fill="#FFF9EE"/>
    </svg>`,
  );

  await sharp(base)
    .composite([
      { input: veil, top: 0, left: 0 },
      { input: chip, top: chipTop, left: chipLeft },
      { input: logo, top: chipTop + 28, left: chipLeft + 32 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(PUBLIC, "og-image.jpg"));
}

await mkdir(OUT, { recursive: true });
await mkdir(PUBLIC, { recursive: true });
await preparePhotos();
await prepareIcons();
await prepareOgImage();
console.log("Médias préparés :", PHOTOS.length, "photos, favicons et image Open Graph.");
