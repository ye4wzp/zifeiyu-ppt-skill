// Usage: node scripts/validate.mjs <deck-dir|index.html> [--office]
// Machine gate: errors exit 1 and block delivery; warnings pass.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { deckIndex, measureDeck, CANVAS } from './lib/deck.mjs';

const REGISTERED = new Set(Array.from({ length: 16 }, (_, i) => `L${String(i + 1).padStart(2, '0')}`));
const INLINE_ALLOWED = /^(\s*(top|left|width|height|font-size|line-height)\s*:\s*[\d.]+(px|%)\s*;?)*\s*$/;

const args = process.argv.slice(2);
const office = args.includes('--office');
const index = deckIndex(args.find((a) => !a.startsWith('--')) || '.');

// Class whitelist comes from the deck's own base.css — the single
// place classes may be defined.
const css = readFileSync(resolve(dirname(index), 'assets/base.css'), 'utf8');
const whitelist = new Set([...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]));

const { browser, slides } = await measureDeck(index);
await browser.close();

const errors = [];
const warns = [];
const at = (i, el) => `slide ${i + 1}${el ? ` <${el.tag || el.kind}> "${(el.text || '').slice(0, 18)}"` : ''}`;

slides.forEach((s, i) => {
  // R1 registered layout
  if (!REGISTERED.has(s.layout)) errors.push(`R1 ${at(i)}: data-layout "${s.layout}" is not a registered layout`);

  let minX = CANVAS.w, minY = CANVAS.h, maxX = 0, maxY = 0;
  for (const el of s.els) {
    minX = Math.min(minX, el.x); minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.w); maxY = Math.max(maxY, el.y + el.h);

    // R3 canvas bounds + text overflow
    if (el.x < -2 || el.y < -2 || el.x + el.w > CANVAS.w + 2 || el.y + el.h > CANVAS.h + 2)
      errors.push(`R3 ${at(i, el)}: element exceeds 1280x720 canvas`);
    if (el.kind === 'text' && el.overflowX) errors.push(`R3 ${at(i, el)}: horizontal text overflow`);

    // R10 accessibility: content images must carry non-empty alt
    if (el.kind === 'image' && !(el.alt || '').trim())
      errors.push(`R10 ${at(i, el)}: <img src="${(el.src || '').slice(-30)}"> missing alt text`);

    if (el.kind !== 'text') continue;
    // R2 class whitelist
    for (const c of el.classes) if (!whitelist.has(c)) errors.push(`R2 ${at(i, el)}: class "${c}" not defined in base.css`);
    // R4 font floor
    if (el.fontSize < 16) errors.push(`R4 ${at(i, el)}: font-size ${el.fontSize}px below 16px floor`);
    // R6 inline styles restricted to parameterized position/size values
    if (el.inlineStyle && !INLINE_ALLOWED.test(el.inlineStyle))
      errors.push(`R6 ${at(i, el)}: inline style may only set top/left/width/height/font-size/line-height: "${el.inlineStyle}"`);
    // R7 office tier: text must not carry decorations that break PPTX mapping
    if (office && el.tag === 'div') errors.push(`R7 ${at(i, el)}: bare text outside h*/p`);
  }

  // R9 sibling text collision: two opaque text elements must not overlap
  // (ghost/decor text with opacity < 0.2 is exempt by design)
  const texts = s.els.filter((el) => el.kind === 'text' && (el.opacity ?? 1) >= 0.2);
  for (let a = 0; a < texts.length; a++) {
    for (let b = a + 1; b < texts.length; b++) {
      const A = texts[a], B = texts[b];
      const ix = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
      const iy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ix <= 0 || iy <= 0) continue;
      const smaller = Math.min(A.w * A.h, B.w * B.h);
      if (ix * iy > smaller * 0.04)
        errors.push(`R9 ${at(i, A)}: overlaps "${(B.text || '').slice(0, 18)}" by ${Math.round(ix)}x${Math.round(iy)}px`);
    }
  }

  // R5 density band (warn only); image-led layouts are exempt above
  const fullBleed = s.els.some((el) => el.kind === 'image' && el.w * el.h >= CANVAS.w * CANVAS.h * 0.25);
  const cover = ((maxX - minX) * (maxY - minY)) / (CANVAS.w * CANVAS.h);
  if (s.els.length && (cover < 0.25 || (cover > 0.97 && !fullBleed)))
    warns.push(`R5 ${at(i)}: content bounding box covers ${(cover * 100).toFixed(0)}% of canvas`);
});

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${slides.length} slides checked: ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
