// Usage: node scripts/gen-art.mjs <out-dir> [--style <id> | --palette "#bg,#surface,#accent,#ink"]
//                                [--kind field|arch] [--seed N] [--count K] [--size 1600x1000] [--format png|jpg]
// Deterministic abstract imagery for golden decks (no stock, no
// generation APIs, no licensing questions): a seeded PRNG lays out an SVG
// composition in the style's own palette, Chromium rasterises it. Same
// seed + size + palette -> identical pixels. Captions must say 示意图.
//   field — soft colour fields with film grain (atmosphere, covers)
//   arch  — overlapping lit planes, reads like an interior/architecture photo
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};
const out = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!out) {
  console.error('usage: node scripts/gen-art.mjs <out-dir> [--style <id> | --palette "#bg,#surface,#accent,#ink"] [--kind field|arch] [--seed N] [--count K] [--size WxH] [--format png|jpg]');
  process.exit(2);
}
const kind = opt('--kind', 'field');
const seed0 = parseInt(opt('--seed', '1'), 10);
const count = parseInt(opt('--count', '1'), 10);
const [W, H] = opt('--size', '1600x1000').split('x').map(Number);
const format = opt('--format', 'png');
if (!['png', 'jpg'].includes(format)) {
  console.error(`unknown --format "${format}" (png|jpg)`);
  process.exit(2);
}

// palette: [bg, surface, accent, ink] from --palette or the style's :root tokens
let palette;
if (opt('--style')) {
  const css = readFileSync(join(root, 'styles', opt('--style'), 'style.css'), 'utf8');
  const rootBlock = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
  const tok = (n) => rootBlock.match(new RegExp(`--${n}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  palette = [tok('bg'), tok('surface'), tok('accent'), tok('text-1')];
} else palette = opt('--palette', '#f1efea,#e8e5de,#c8102e,#141414').split(',');
if (palette.some((c) => !/^#[0-9a-fA-F]{6}$/.test(c || ''))) {
  console.error(`palette needs four #rrggbb colours, got ${palette.join(',')}`);
  process.exit(2);
}
const [bg, surface, accent, ink] = palette;

const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const mix = (a, b, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');

const grain = (r) => `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${Math.floor(r() * 1000)}" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>`;

const field = (r) => {
  const blobs = 3 + Math.floor(r() * 3);
  const tones = [accent, surface, mix(accent, ink, 0.4), mix(bg, accent, 0.35), ink];
  let defs = '', shapes = '';
  for (let i = 0; i < blobs; i++) {
    const c = tones[Math.floor(r() * tones.length)];
    defs += `<radialGradient id="g${i}"><stop offset="0" stop-color="${c}" stop-opacity="${0.55 + r() * 0.4}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
    shapes += `<ellipse cx="${r() * W}" cy="${r() * H}" rx="${W * (0.25 + r() * 0.35)}" ry="${H * (0.25 + r() * 0.4)}" fill="url(#g${i})"/>`;
  }
  return { defs, shapes, base: mix(bg, surface, 0.5) };
};

const arch = (r) => {
  // a lit room: back wall, floor plane, then receding wall planes and window slots
  const light = mix(bg, '#ffffff', 0.5), shade = mix(surface, ink, 0.18), deep = mix(surface, ink, 0.45);
  const horizon = H * (0.55 + r() * 0.12);
  let defs = `<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${surface}"/></linearGradient>`;
  let shapes = `<rect width="${W}" height="${horizon}" fill="url(#wall)"/><rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floor)"/>`;
  const planes = 4 + Math.floor(r() * 4);
  for (let i = 0; i < planes; i++) {
    const x = r() * W, w = W * (0.06 + r() * 0.22), top = horizon * (0.08 + r() * 0.4);
    const lean = (r() - 0.5) * w * 0.6;
    const c = r() < 0.18 ? accent : mix(surface, ink, 0.05 + r() * 0.3);
    defs += `<linearGradient id="p${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(c, '#ffffff', 0.2)}"/><stop offset="1" stop-color="${mix(c, ink, 0.15)}"/></linearGradient>`;
    shapes += `<polygon points="${x},${top} ${x + w},${top + lean * 0.2} ${x + w + lean},${horizon + (H - horizon) * 0.5} ${x + lean},${horizon + (H - horizon) * 0.55}" fill="url(#p${i})" opacity="${0.75 + r() * 0.25}"/>`;
  }
  const slots = 2 + Math.floor(r() * 4);
  for (let i = 0; i < slots; i++) {
    const x = W * (0.05 + r() * 0.85), y = horizon * (0.05 + r() * 0.25);
    shapes += `<rect x="${x}" y="${y}" width="${W * (0.04 + r() * 0.1)}" height="${H * 0.012 + r() * 6}" fill="#ffffff" opacity="${0.6 + r() * 0.35}"/>`;
  }
  return { defs, shapes, base: light };
};

const KINDS = { field, arch };
if (!KINDS[kind]) {
  console.error(`unknown --kind "${kind}" (field|arch)`);
  process.exit(2);
}

mkdirSync(resolve(out), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (let n = 0; n < count; n++) {
  const r = mulberry32(seed0 + n);
  const { defs, shapes, base } = KINDS[kind](r);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>${defs}${grain(r)}
      <filter id="soft"><feGaussianBlur stdDeviation="${kind === 'field' ? Math.round(W / 40) : 1.2}"/></filter></defs>
    <rect width="${W}" height="${H}" fill="${base}"/>
    <g filter="url(#soft)">${shapes}</g>
    <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.14"/>
  </svg>`;
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  const file = join(resolve(out), `${kind}-${seed0 + n}.${format}`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H }, ...(format === 'jpg' && { type: 'jpeg', quality: 85 }) });
  console.log(file);
}
await browser.close();
