/**
 * Generates premium, on-brand placeholder product images + an OG image.
 * Pure geometry (no text) so it renders identically everywhere and stays
 * faithful to the "chrome is the only colour" rule. Owner replaces these
 * with real photography later.
 *
 * Run: node scripts/gen-placeholders.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PRODUCTS_DIR = join(ROOT, "public", "products");
mkdirSync(PRODUCTS_DIR, { recursive: true });

const SLUGS = [
  "bmw-roundel-82mm",
  "mercedes-bonnet-star",
  "audi-rings-gloss-black",
  "vw-grille-roundel",
  "porsche-bonnet-crest",
  "ford-classic-oval",
  "bmw-m-emblem",
  "mercedes-amg-badge",
];

// Tiny deterministic PRNG so each badge is distinct but stable across runs.
function makeRand(seed) {
  let s = (seed * 2654435761) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const P = (n) => Number(n.toFixed(2));

function emblem(size, seed) {
  const r = makeRand(seed + 7);
  const c = size / 2;
  const R = size * 0.42;
  const rot = Math.floor(r() * 90);
  const petals = [22, 28, 34, 40, 48][seed % 5];
  const ticks = [12, 16, 20, 24][seed % 4];
  const ringGap = 0.06 + r() * 0.05;

  // Guilloche rosette: thin rotated ellipses blooming from the centre.
  let rosette = "";
  const er = R * (0.6 + ringGap);
  const ery = R * (0.16 + ringGap * 0.5);
  for (let i = 0; i < petals; i++) {
    const a = rot + (360 / petals) * i;
    rosette += `<ellipse cx="${P(c)}" cy="${P(c)}" rx="${P(er)}" ry="${P(ery)}" transform="rotate(${P(a)} ${P(c)} ${P(c)})"/>`;
  }

  // Tick marks between the rings.
  let tickMarks = "";
  const t1 = R * 0.9;
  const t2 = R * 0.99;
  for (let i = 0; i < ticks; i++) {
    const a = ((Math.PI * 2) / ticks) * i + (rot * Math.PI) / 180;
    const x1 = c + Math.cos(a) * t1;
    const y1 = c + Math.sin(a) * t1;
    const x2 = c + Math.cos(a) * t2;
    const y2 = c + Math.sin(a) * t2;
    tickMarks += `<line x1="${P(x1)}" y1="${P(y1)}" x2="${P(x2)}" y2="${P(y2)}"/>`;
  }

  return `
  <g>
    <circle cx="${P(c)}" cy="${P(c)}" r="${P(R * 1.2)}" fill="url(#glow)"/>
    <g stroke="url(#chrome)" fill="none" stroke-width="${P(size * 0.0016)}" opacity="0.4">
      ${rosette}
    </g>
    <circle cx="${P(c)}" cy="${P(c)}" r="${P(R * 1.02)}" fill="none" stroke="url(#chrome)" stroke-width="${P(size * 0.012)}"/>
    <circle cx="${P(c)}" cy="${P(c)}" r="${P(R * 0.86)}" fill="none" stroke="url(#chrome)" stroke-width="${P(size * 0.003)}" opacity="0.8"/>
    <g stroke="url(#chrome)" stroke-width="${P(size * 0.006)}" stroke-linecap="round" opacity="0.9">
      ${tickMarks}
    </g>
    <circle cx="${P(c)}" cy="${P(c)}" r="${P(R * 0.34)}" fill="url(#disc)" stroke="url(#chrome)" stroke-width="${P(size * 0.004)}"/>
    <circle cx="${P(c)}" cy="${P(c)}" r="${P(R * 0.07)}" fill="#0a0a0a"/>
  </g>`;
}

function defs() {
  return `
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="80%">
      <stop offset="0%" stop-color="#181818"/>
      <stop offset="55%" stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#070707"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c8cad2" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#c8cad2" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#c8cad2" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="disc" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#f4f4f4"/>
      <stop offset="45%" stop-color="#c6c6c6"/>
      <stop offset="100%" stop-color="#8c8c8c"/>
    </radialGradient>
    <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#8f8f8f"/>
      <stop offset="22%" stop-color="#cfcfcf"/>
      <stop offset="42%" stop-color="#f6f6f6"/>
      <stop offset="58%" stop-color="#dadada"/>
      <stop offset="80%" stop-color="#a6a6a6"/>
      <stop offset="100%" stop-color="#828282"/>
    </linearGradient>
  </defs>`;
}

function productSvg(seed) {
  const size = 1100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${defs()}
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
    ${emblem(size, seed)}
  </svg>`;
}

function ogSvg() {
  const w = 1200;
  const h = 630;
  const size = 520;
  const x = (w - size) / 2;
  const y = (h - size) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${defs()}
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect x="28" y="28" width="${w - 56}" height="${h - 56}" fill="none" stroke="url(#chrome)" stroke-width="1.5" opacity="0.5"/>
    <svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${emblem(size, 5)}</svg>
  </svg>`;
}

const results = [];
for (let i = 0; i < SLUGS.length; i++) {
  const buf = Buffer.from(productSvg(i + 1));
  const file = join(PRODUCTS_DIR, `${SLUGS[i]}.jpg`);
  await sharp(buf).jpeg({ quality: 88, mozjpeg: true }).toFile(file);
  results.push(`${SLUGS[i]}.jpg`);
}

await sharp(Buffer.from(ogSvg()))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(ROOT, "public", "og.jpg"));
results.push("og.jpg");

console.log("Generated:", results.join(", "));
