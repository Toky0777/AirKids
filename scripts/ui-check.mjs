/**
 * Vérifications interactives dans un navigateur Chromium headless local
 * (Edge ou Chrome) via le protocole DevTools, sans dépendance externe.
 *
 * Couvre :
 * - ouverture / navigation clavier / fermeture de la visionneuse de la galerie ;
 * - validation du formulaire de contact puis mode « courrier » (mailto) ;
 * - ouverture / fermeture du menu mobile ;
 * - collecte des erreurs JavaScript et des exceptions.
 *
 * Prérequis : le site doit être servi (npm run preview → http://localhost:4321).
 * Usage : npm run ui:check
 * Variables : SITE_URL, BROWSER_PATH, SHOT_DIR
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = process.env.SITE_URL ?? "http://localhost:4321";
const DEBUG_PORT = 9333;
const SHOT_DIR = process.env.SHOT_DIR ?? path.join(tmpdir(), "airkids-ui-check");

const browserCandidates = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].filter(Boolean);

const browserPath = browserCandidates.find((candidate) => existsSync(candidate));
if (!browserPath) {
  console.error("Aucun navigateur Chromium trouvé. Définissez BROWSER_PATH.");
  process.exit(1);
}

await mkdir(SHOT_DIR, { recursive: true });

const browser = spawn(
  browserPath,
  [
    "--headless",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${path.join(tmpdir(), "airkids-ui-check-profile")}`,
    `--remote-debugging-port=${DEBUG_PORT}`,
    "--remote-allow-origins=*",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDevTools() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // le navigateur démarre encore
    }
    await sleep(250);
  }
  throw new Error("Le port de débogage n'a pas répondu.");
}

const wsUrl = await waitForDevTools();

/** Petit client DevTools minimal. */
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const entry = this.pending.get(message.id);
        if (!entry) return;
        this.pending.delete(message.id);
        if (message.error) entry.reject(new Error(message.error.message));
        else entry.resolve(message.result);
        return;
      }
      for (const listener of this.listeners.get(message.method) ?? []) listener(message.params);
    };
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    this.listeners.set(method, [...(this.listeners.get(method) ?? []), listener]);
  }
}

const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

const cdp = new CDP(ws);
const consoleIssues = [];

cdp.on("Runtime.consoleAPICalled", (params) => {
  if (params.type === "error" || params.type === "warning") {
    const text = params.args.map((arg) => arg.value ?? arg.description ?? "").join(" ");
    // Les messages du protocole externe mailto: sont attendus en headless.
    if (!/mailto/i.test(text)) consoleIssues.push(`console.${params.type}: ${text}`);
  }
});
cdp.on("Runtime.exceptionThrown", (params) => {
  const description = params.exceptionDetails?.exception?.description ?? params.exceptionDetails?.text;
  consoleIssues.push(`exception: ${description}`);
});

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");

async function navigate(url) {
  await cdp.send("Page.navigate", { url });
  await sleep(1200);
}

async function evaluate(expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "Erreur d'évaluation");
  }
  return result.result?.value;
}

/** Attend qu'une expression JavaScript devienne vraie (hydratation, etc.). */
async function waitFor(expression, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return true;
    await sleep(200);
  }
  return false;
}

/** Fait défiler jusqu'à un élément puis attend l'hydratation des îlots. */
async function revealAndHydrate(targetExpression) {
  await evaluate(`(${targetExpression})?.scrollIntoView({ block: "center" })`);
  await waitFor(
    `[...document.querySelectorAll("astro-island")].every((island) => !island.hasAttribute("ssr"))`,
  );
  await sleep(200);
}

async function pressKey(key, code, windowsVirtualKeyCode) {
  const base = { key, code, windowsVirtualKeyCode, nativeVirtualKeyCode: windowsVirtualKeyCode };
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", ...base });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
}

async function screenshot(name) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  const file = path.join(SHOT_DIR, `${name}.png`);
  await writeFile(file, Buffer.from(data, "base64"));
  return file;
}

const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "OK  " : "ÉCHEC"} ${name}${detail ? ` — ${detail}` : ""}`);
};

// ---------------------------------------------------------------------------
// 1. Galerie — visionneuse accessible
// ---------------------------------------------------------------------------
await navigate(`${BASE}/galerie/`);
record("galerie : 26 vignettes rendues", (await evaluate(
  `document.querySelectorAll('#contenu button[aria-label^="Agrandir la photo"]').length`,
)) === 26);

await revealAndHydrate(`document.querySelector('#contenu button[aria-label^="Agrandir la photo"]')`);
await evaluate(`document.querySelector('#contenu button[aria-label^="Agrandir la photo"]').click()`);
await sleep(300);
record("visionneuse : ouverture au clic", await evaluate(`Boolean(document.querySelector('[role="dialog"]'))`));
record("visionneuse : focus sur le bouton de fermeture", await evaluate(
  `document.activeElement?.textContent?.includes("Fermer la visionneuse") ?? false`,
));
record("visionneuse : compteur à 1 sur 26", await evaluate(
  `document.querySelector('[role="dialog"] [aria-live="polite"]')?.textContent?.includes("Image 1 sur 26") ?? false`,
));

await pressKey("ArrowRight", "ArrowRight", 39);
await sleep(200);
record("visionneuse : flèche droite → image 2", await evaluate(
  `document.querySelector('[role="dialog"] [aria-live="polite"]')?.textContent?.includes("Image 2 sur 26") ?? false`,
));
await screenshot("lightbox-open");

await pressKey("ArrowLeft", "ArrowLeft", 37);
await sleep(200);
record("visionneuse : flèche gauche → retour image 1", await evaluate(
  `document.querySelector('[role="dialog"] [aria-live="polite"]')?.textContent?.includes("Image 1 sur 26") ?? false`,
));

await pressKey("Escape", "Escape", 27);
await sleep(300);
record("visionneuse : fermeture avec Échap", await evaluate(`!document.querySelector('[role="dialog"]')`));
record("visionneuse : focus rendu à la vignette", await evaluate(
  `document.activeElement?.getAttribute("aria-label")?.startsWith("Agrandir la photo") ?? false`,
));

// ---------------------------------------------------------------------------
// 2. Formulaire de contact — validation puis mode courrier
// ---------------------------------------------------------------------------
await navigate(`${BASE}/contact/`);
await revealAndHydrate(`document.querySelector("#visite")`);
await sleep(3300); // laisse passer le délai anti-robot (3 s)

await evaluate(`document.querySelector('form button[type="submit"]').click()`);
await sleep(400);
record("contact : erreurs de validation affichées", await evaluate(
  `document.body.textContent.includes("Merci de corriger les points suivants")`,
));
record("contact : résumé d'erreurs focalisé", await evaluate(
  `document.activeElement?.getAttribute("role") === "alert"`,
));

await evaluate(`
  (() => {
    const setValue = (element, value) => {
      const prototype = Object.getPrototypeOf(element);
      const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set ?? Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(element, value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const setSelect = (element, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
      setter.call(element, value);
      element.dispatchEvent(new Event("change", { bubbles: true }));
    };
    setValue(document.getElementById("parent-name"), "Fanja Rakoto (test)");
    setValue(document.getElementById("contact"), "fanja.test@exemple.com");
    setSelect(document.getElementById("service"), document.getElementById("service").options[1].value);
    setValue(document.getElementById("child-age"), "20 mois");
    setValue(document.getElementById("message"), "Bonjour, je souhaite visiter l'école avec mon enfant. Merci !");
    document.getElementById("consent").click();
    return true;
  })()
`);
await sleep(200);
record("contact : consentement accepté", await evaluate(`document.getElementById("consent").checked`));

await evaluate(`document.querySelector('form button[type="submit"]').click()`);
await sleep(600);
record("contact : mode courrier déclenché (message mailto)", await evaluate(
  `document.body.textContent.includes("Votre logiciel de messagerie devrait s'ouvrir")`,
));
await screenshot("contact-form-submitted");

// ---------------------------------------------------------------------------
// 3. Menu mobile
// ---------------------------------------------------------------------------
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
await navigate(`${BASE}/`);
await evaluate(`document.querySelector('button[aria-controls="menu-principal-mobile"]').click()`);
await sleep(300);
record("menu mobile : ouverture", await evaluate(
  `document.querySelector('button[aria-controls="menu-principal-mobile"]').getAttribute("aria-expanded") === "true" && Boolean(document.getElementById("menu-principal-mobile"))`,
));
record("menu mobile : panneau réellement affiché", await evaluate(`(() => {
  const panel = document.getElementById("menu-principal-mobile");
  if (!panel) return false;
  const rect = panel.getBoundingClientRect();
  const coversViewport = rect.height > 300 && rect.top < 150 && rect.bottom >= window.innerHeight - 2;
  const link = panel.querySelector("nav a");
  if (!link) return false;
  const linkRect = link.getBoundingClientRect();
  const linkVisible = linkRect.height > 20 && linkRect.top >= rect.top && linkRect.bottom < window.innerHeight;
  return coversViewport && linkVisible;
})()`));
await screenshot("mobile-menu-open");
await pressKey("Escape", "Escape", 27);
await sleep(300);
record("menu mobile : fermeture avec Échap", await evaluate(
  `document.querySelector('button[aria-controls="menu-principal-mobile"]').getAttribute("aria-expanded") === "false" && !document.getElementById("menu-principal-mobile")`,
));

await cdp.send("Emulation.clearDeviceMetricsOverride");

// ---------------------------------------------------------------------------
// Bilan
// ---------------------------------------------------------------------------
ws.close();
browser.kill();

const failures = results.filter((result) => !result.ok);
console.log(`\n${results.length - failures.length}/${results.length} vérifications réussies.`);
if (consoleIssues.length > 0) {
  console.log(`Erreurs / avertissements JavaScript détectés (${consoleIssues.length}) :`);
  for (const issue of consoleIssues) console.log(`- ${issue}`);
}
console.log(`Captures : ${SHOT_DIR}`);

if (failures.length > 0 || consoleIssues.length > 0) process.exit(1);
