// Usage: node scripts/validate.mjs <deck-dir|index.html> [--office]
// Machine gate (R1–R12): errors exit 1 and block delivery; warnings pass.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { deckIndex, measureDeck, CANVAS } from './lib/deck.mjs';

const REGISTERED = new Set(Array.from({ length: 16 }, (_, i) => `L${String(i + 1).padStart(2, '0')}`));
const INLINE_ALLOWED = /^(\s*(top|left|width|height|font-size|line-height)\s*:\s*[\d.]+(px|%)\s*;?)*\s*$/;
const STYLESHEET_ALLOWED = /^assets\/(base\.css|(themes|systems)\/[\w-]+\.css)$/;

const args = process.argv.slice(2);
const office = args.includes('--office');
const index = deckIndex(args.find((a) => !a.startsWith('--')) || '.');

// Class whitelist comes from the deck's own base.css — the single
// place classes may be defined.
const css = readFileSync(resolve(dirname(index), 'assets/base.css'), 'utf8');
const whitelist = new Set([...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]));

const { browser, slides, doc } = await measureDeck(index);
await browser.close();

const errors = [];
const warns = [];
const at = (i, el) => `slide ${i + 1}${el ? ` <${el.tag || el.kind}> "${(el.text || '').slice(0, 18)}"` : ''}`;

// WCAG relative luminance / contrast, on token colors blended over the page
const hex2rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2) || '0', 16));
const relLum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const blend = (fg, a, bg) => fg.map((v, k) => Math.round(a * v + (1 - a) * bg[k]));

// R12 document hygiene: base.css + exactly one theme/system file are the
// only style sources — a <style> tag or foreign <link> bypasses the whole
// design system.
if (doc.styleTags) errors.push(`R12 <style> tags are forbidden (${doc.styleTags} found); all styling lives in base.css + theme`);
for (const href of doc.links) {
  if (!STYLESHEET_ALLOWED.test(href)) errors.push(`R12 stylesheet "${href}" outside assets/{base.css, themes/, systems/}`);
}
if (doc.links.length > 2) errors.push(`R12 ${doc.links.length} stylesheets linked; only base.css + one theme/system file allowed`);

slides.forEach((s, i) => {
  // R1 registered layout
  if (!REGISTERED.has(s.layout)) errors.push(`R1 ${at(i)}: data-layout "${s.layout}" is not a registered layout`);

  // R7 text containment: bare text outside h1/h2/h3/p is invisible to the
  // PPTX export and breaks the measurement contract (both tiers)
  for (const st of s.stray) errors.push(`R7 ${at(i)}: bare text "${st.text}" inside <${st.tag}>; text may only live in h1/h2/h3/p`);

  let minX = CANVAS.w, minY = CANVAS.h, maxX = 0, maxY = 0;
  for (const el of s.els) {
    minX = Math.min(minX, el.x); minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.w); maxY = Math.max(maxY, el.y + el.h);

    // R3 canvas bounds + text overflow (vertical growth is caught by the
    // bounds check and R9 collisions — text slots are auto-height)
    if (el.x < -2 || el.y < -2 || el.x + el.w > CANVAS.w + 2 || el.y + el.h > CANVAS.h + 2)
      errors.push(`R3 ${at(i, el)}: element exceeds 1280x720 canvas`);
    if (el.kind === 'text' && el.overflowX) errors.push(`R3 ${at(i, el)}: horizontal text overflow`);

    // R2 class whitelist — every kind, including inline-emphasis children
    for (const c of [...el.classes, ...(el.childClasses || [])])
      if (!whitelist.has(c)) errors.push(`R2 ${at(i, el)}: class "${c}" not defined in base.css`);

    // R6 inline styles restricted to parameterized position/size values — every kind
    if (el.inlineStyle && !INLINE_ALLOWED.test(el.inlineStyle))
      errors.push(`R6 ${at(i, el)}: inline style may only set top/left/width/height/font-size/line-height: "${el.inlineStyle}"`);

    if (el.kind === 'image') {
      // R10 accessibility: content images need alt; decorative ones declare aria-hidden
      if (!el.decor && !(el.alt || '').trim())
        errors.push(`R10 ${at(i, el)}: <img src="${(el.src || '').slice(-30)}"> missing alt (or aria-hidden="true" for decor)`);
      // R12 self-containment: remote images break offline decks and the PPTX export
      if (/^https?:/i.test(el.src || ''))
        (office ? errors : warns).push(`R12 ${at(i, el)}: remote image "${el.src.slice(0, 60)}"; copy it into assets/img/`);
    }

    if (el.kind !== 'text') continue;
    // R4 font floor
    if (el.fontSize < 16) errors.push(`R4 ${at(i, el)}: font-size ${el.fontSize}px below 16px floor`);
    // R7 inline emphasis: only unnested strong/em/span map to PPTX text runs
    if (el.badChildTags?.length)
      errors.push(`R7 ${at(i, el)}: only unnested <strong>/<em>/<span> allowed inside text, got <${el.badChildTags.join(', ')}>`);
  }

  // R8 data honesty: data layouts must cite a source, and L15 bar lengths
  // must be proportional to their stated values
  if (s.layout === 'L07' || s.layout === 'L15') {
    const slot = `${s.layout.toLowerCase()}-footnote`;
    const cited = s.els.some((el) => el.kind === 'text' &&
      ((el.classes.includes(slot) && el.text) ||
       (el.classes.includes('tb-label') && /source/i.test(el.text)))); // DATUM title block
    if (!cited) errors.push(`R8 ${at(i)}: ${s.layout} requires a ${slot} (or DATUM title-block SOURCE) citing the data source`);
  }
  if (s.layout === 'L15') {
    const rows = [];
    for (const el of s.els) {
      const b = el.classes.find((c) => /^l15-b\d$/.test(c));
      const r = el.classes.find((c) => /^l15-r\d$/.test(c));
      if (el.kind === 'shape' && b) (rows[+b.slice(-1)] ??= {}).bar = el;
      if (el.kind === 'text' && r && el.classes.includes('l15-val')) (rows[+r.slice(-1)] ??= {}).val = el;
    }
    const MAG = { k: 1e3, m: 1e6, w: 1e4, '万': 1e4, '亿': 1e8 };
    const parseVal = (t) => {
      const m = t.replace(/,/g, '').match(/([\d.]+)\s*([km万亿w])?/i);
      return m ? parseFloat(m[1]) * (MAG[(m[2] || '').toLowerCase()] || 1) : NaN;
    };
    const pairs = rows
      .filter((r) => r?.bar && r?.val)
      .map((r) => ({ ...r, v: parseVal(r.val.text) }))
      .filter((r) => Number.isFinite(r.v) && r.v > 0);
    if (pairs.length >= 2) {
      const ref = pairs.reduce((a, b) => (b.v > a.v ? b : a));
      const scale = ref.bar.w / ref.v;
      for (const p of pairs) {
        const expected = p.v * scale;
        if (Math.abs(p.bar.w - expected) > Math.max(4, expected * 0.02))
          errors.push(`R8 ${at(i)}: bar for "${p.val.text}" is ${Math.round(p.bar.w)}px, expected ${Math.round(expected)}px (bar length must be proportional to value)`);
      }
    }
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

  // R11 contrast floor (warn): text vs the surface it actually sits on.
  // 3:1 is the machine floor for readability; the 4.5:1 body-text target
  // stays a visual-check item (checklist P0). Text over content images is
  // skipped — that judgement needs eyes.
  for (const el of s.els) {
    if (el.kind !== 'text') continue;
    const eff = (el.color.alpha ?? 1) * (el.opacity ?? 1);
    if (eff < 0.2) continue; // ghost/decor text, same exemption as R9
    const cx = el.x + el.w / 2, cy = el.y + el.h / 2;
    let base = hex2rgb(s.bg.hex), unknown = false;
    for (const o of s.els) {
      if (o === el) break; // only surfaces painted beneath the text
      if (o.x > cx || o.x + o.w < cx || o.y > cy || o.y + o.h < cy) continue;
      if (o.kind === 'image') { if (!o.decor) unknown = true; continue; }
      if (o.kind !== 'shape') continue;
      const a = Math.min(1, (o.fill.alpha ?? 1) * (o.opacity ?? 1));
      if (a >= 0.99) { base = hex2rgb(o.fill.hex); unknown = false; }
      else if (!unknown) base = blend(hex2rgb(o.fill.hex), a, base);
    }
    if (unknown) continue;
    const ratio = contrast(blend(hex2rgb(el.color.hex), eff, base), base);
    if (ratio < 3) warns.push(`R11 ${at(i, el)}: contrast ${ratio.toFixed(1)}:1 below 3:1 floor`);
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
