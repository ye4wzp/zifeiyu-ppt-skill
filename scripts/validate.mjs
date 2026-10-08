// Usage: node scripts/validate.mjs <deck-dir|index.html> [--office]
// Machine gate (R1–R16): errors exit 1 and block delivery; warnings pass.
// Style-mode decks (linking assets/styles/<id>/style.css) are checked
// against their style's manifest; legacy decks keep the L01–L24 rules.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { deckIndex, measureDeck, CANVAS } from './lib/deck.mjs';
import { loadStyle } from './lib/style.mjs';
import { ROLES, DATA_ROLES } from './lib/roles.mjs';

const args = process.argv.slice(2);
const office = args.includes('--office');
const index = deckIndex(args.find((a) => !a.startsWith('--')) || '.');
const style = loadStyle(index);
const styled = style.mode === 'style';

const REGISTERED = styled
  ? new Set(Object.keys(style.manifest.layouts))
  : new Set(Array.from({ length: 24 }, (_, i) => `L${String(i + 1).padStart(2, '0')}`));
// style mode may also tilt elements inline (rotate exports natively)
const INLINE_ALLOWED = styled
  ? /^(\s*((top|left|width|height|font-size|line-height)\s*:\s*[\d.]+(px|%)|rotate\s*:\s*-?[\d.]+deg)\s*;?)*\s*$/
  : /^(\s*(top|left|width|height|font-size|line-height)\s*:\s*[\d.]+(px|%)\s*;?)*\s*$/;
const STYLESHEET_ALLOWED = styled
  ? new RegExp(`^assets/(base\\.css|brand\\.css|styles/${style.id}/style\\.css)$`)
  : /^assets\/(base\.css|(themes|systems)\/[\w-]+\.css)$/;
const SHEET_LIMIT = styled ? 3 : 2;
const SHEET_RULE = styled
  ? `assets/{base.css, styles/${style.id}/style.css, brand.css}`
  : 'assets/{base.css, themes/, systems/}';

// Class whitelist: classes may only be defined in the deck's base.css
// (legacy) or base.css + the style package (+ brand tokens) in style mode.
const cssSources = styled ? style.sheets : [resolve(dirname(index), 'assets/base.css')];
const whitelist = new Set(cssSources.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1])));
const classHome = styled ? 'base.css or the style package' : 'base.css';

const { browser, slides, doc } = await measureDeck(index);
await browser.close();

const errors = [];
const warns = [];
const states = []; // R15b: per-slide visual state, bleed | dark | light
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
  if (!STYLESHEET_ALLOWED.test(href)) errors.push(`R12 stylesheet "${href}" outside ${SHEET_RULE}`);
}
if (doc.links.length > SHEET_LIMIT) errors.push(`R12 ${doc.links.length} stylesheets linked; only ${SHEET_RULE} allowed`);

slides.forEach((s, i) => {
  // R1 registered layout (+ declared role in style mode)
  if (!styled) {
    if (!REGISTERED.has(s.layout)) errors.push(`R1 ${at(i)}: data-layout "${s.layout}" is not a registered layout`);
  } else if (!REGISTERED.has(s.layout)) {
    errors.push(`R1 ${at(i)}: data-layout "${s.layout}" is not registered by style "${style.id}"`);
  } else if (style.manifest.layouts[s.layout].role !== s.role) {
    errors.push(`R1 ${at(i)}: role "${s.role}" does not match ${s.layout} (registered as "${style.manifest.layouts[s.layout].role}")`);
  }
  if (styled && s.role && !ROLES.includes(s.role)) errors.push(`R1 ${at(i)}: unknown role "${s.role}"`);

  // R15a rhythm (warn): adjacent pages must not repeat the same layout
  if (i && s.layout && s.layout === slides[i - 1].layout)
    warns.push(`R15 slides ${i}, ${i + 1}: adjacent pages both use ${s.layout} — swap one for a different layout`);

  // R7 text containment: bare text outside h1/h2/h3/p is invisible to the
  // PPTX export and breaks the measurement contract (both tiers)
  for (const st of s.stray) errors.push(`R7 ${at(i)}: bare text "${st.text}" inside <${st.tag}>; text may only live in h1/h2/h3/p`);

  let minX = CANVAS.w, minY = CANVAS.h, maxX = 0, maxY = 0;
  for (const el of s.els) {
    const b = el.bbox; // rotated hull (equals the box when unrotated)
    minX = Math.min(minX, b.x); minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.w); maxY = Math.max(maxY, b.y + b.h);

    // R3 canvas bounds + text overflow (vertical growth is caught by the
    // bounds check and R9 collisions — text slots are auto-height).
    // Fix advice is graduated by overflow amount so repairs start small.
    const fix = (px) =>
      px <= 40 ? 'trim a few characters or nudge width/font-size inline'
      : px <= 120 ? 'cut copy first, then step font-size/line-height down inline'
      : 'content exceeds this slot — switch to a higher-capacity layout';
    const exceed = Math.max(b.x + b.w - CANVAS.w, b.y + b.h - CANVAS.h, -b.x, -b.y);
    if (exceed > 2)
      errors.push(`R3 ${at(i, el)}: exceeds 1280x720 canvas by ${Math.round(exceed)}px — ${fix(exceed)}`);
    if (el.kind === 'text' && el.overflowX)
      errors.push(`R3 ${at(i, el)}: horizontal text overflow by ${Math.round(el.overflowX)}px — ${fix(el.overflowX)}`);

    // R2 class whitelist — every kind, including inline-emphasis children
    for (const c of [...el.classes, ...(el.childClasses || [])])
      if (!whitelist.has(c)) errors.push(`R2 ${at(i, el)}: class "${c}" not defined in ${classHome}`);

    // R6 inline styles restricted to parameterized position/size values — every kind
    if (el.inlineStyle && !INLINE_ALLOWED.test(el.inlineStyle))
      errors.push(`R6 ${at(i, el)}: inline style may only set top/left/width/height/font-size/line-height${styled ? '/rotate' : ''}: "${el.inlineStyle}"`);

    // R16 export parity (style mode): everything the browser draws must
    // have a PowerPoint equivalent, or the PPTX silently diverges
    if (styled) {
      if (el.kind === 'shape' && (el.shape === 'chevron' || el.shape === 'pentagon') && Math.abs((el.tip ?? -1) - Math.min(el.w, el.h) / 2) > 1)
        errors.push(`R16 ${at(i, el)}: ${el.shape} tip must be --tip: ${Math.min(el.w, el.h) / 2}px (PowerPoint draws it at half the short side)`);
      if (el.border && !el.border.uniform) errors.push(`R16 ${at(i, el)}: border must be uniform on all four sides to export`);
      if (el.shadow?.layers > 1) errors.push(`R16 ${at(i, el)}: only one box-shadow layer exports`);
      if (el.transform && el.transform !== 'none') errors.push(`R16 ${at(i, el)}: transform does not export — use the rotate property`);
      if (el.kind === 'text' && Object.values(el.textBox).some(Boolean))
        errors.push(`R16 ${at(i, el)}: text slots export without fill/border/shadow/padding — put a shape behind the text`);
    }

    if (el.kind === 'image') {
      // R10 accessibility: content images need alt; decorative ones declare aria-hidden
      if (!el.decor && !(el.alt || '').trim())
        errors.push(`R10 ${at(i, el)}: <img src="${(el.src || '').slice(-30)}"> missing alt (or aria-hidden="true" for decor)`);
      // R12 self-containment: remote images break offline decks and the PPTX export
      if (/^https?:/i.test(el.src || ''))
        (office ? errors : warns).push(`R12 ${at(i, el)}: remote image "${el.src.slice(0, 60)}"; copy it into assets/img/`);
      // R13 asset contract: the file must actually load, and cover-fit
      // should not crop away most of the picture
      if (el.naturalW === 0)
        errors.push(`R13 ${at(i, el)}: image "${(el.src || '').slice(-40)}" failed to load (missing or corrupt file)`);
      else if (el.fit === 'cover' && el.naturalW && !el.decor) {
        const scale = Math.max(el.w / el.naturalW, el.h / el.naturalH);
        const loss = 1 - (el.w * el.h) / (scale * scale * el.naturalW * el.naturalH);
        if (loss > 0.45)
          warns.push(`R13 ${at(i, el)}: cover crops ${Math.round(loss * 100)}% of "${(el.src || '').slice(-30)}" — pick a closer aspect or another slot`);
      }
    }

    // R13 media contract: deterministic rendering/export needs a poster,
    // playback and PPTX embedding need local files
    if (el.kind === 'video' || el.kind === 'audio') {
      if (!(el.label || '').trim()) errors.push(`R10 ${at(i, el)}: <${el.kind}> missing aria-label`);
      if (/^https?:/i.test(el.src || '')) errors.push(`R13 ${at(i, el)}: remote media "${(el.src || '').slice(0, 60)}"; copy it into assets/media/`);
      if (el.kind === 'video') {
        if (!el.poster) errors.push(`R13 ${at(i, el)}: video missing poster (flat renders and PPTX cover need one)`);
        else if (/^https?:/i.test(el.poster)) errors.push(`R13 ${at(i, el)}: remote poster "${el.poster.slice(0, 60)}"; copy it into assets/media/`);
      }
    }

    if (el.kind !== 'text') continue;
    // R4 font floor
    if (el.fontSize < 16) errors.push(`R4 ${at(i, el)}: font-size ${el.fontSize}px below 16px floor`);
    // R14 content readiness: placeholder text must never ship
    if (/\b(TODO|TBD|FIXME|lorem|ipsum|xxxx*)\b|待补充|待填写|此处占位|\[insert/i.test(el.text))
      errors.push(`R14 ${at(i, el)}: placeholder text left in deck`);
    // R7 inline emphasis: only unnested strong/em/span map to PPTX text runs
    if (el.badChildTags?.length)
      errors.push(`R7 ${at(i, el)}: only unnested <strong>/<em>/<span> allowed inside text, got <${el.badChildTags.join(', ')}>`);
  }

  // R8 data honesty (style mode): data roles cite a source, bar lengths
  // are proportional to their declared data-value
  if (styled && DATA_ROLES.includes(s.role) && !s.els.some((el) => el.kind === 'text' && el.source && el.text))
    errors.push(`R8 ${at(i)}: ${s.role} page requires a data-source text citing where the numbers come from`);
  if (styled && s.role === 'bars') {
    const bars = s.els.filter((el) => el.kind === 'shape' && el.value != null && el.value > 0);
    if (bars.length >= 2) {
      const ref = bars.reduce((a, c) => (c.value > a.value ? c : a));
      for (const bar of bars) {
        const expected = (bar.value / ref.value) * ref.w;
        if (Math.abs(bar.w - expected) > Math.max(4, expected * 0.02))
          errors.push(`R8 ${at(i)}: bar "${bar.label || bar.value}" is ${Math.round(bar.w)}px, expected ${Math.round(expected)}px (bar length must be proportional to data-value)`);
      }
    }
  }

  // R8 data honesty (legacy): data layouts must cite a source, and L15 bar
  // lengths must be proportional to their stated values
  if (!styled && (s.layout === 'L07' || s.layout === 'L15' || s.layout === 'L22')) {
    const slot = `${s.layout.toLowerCase()}-footnote`;
    const cited = s.els.some((el) => el.kind === 'text' &&
      ((el.classes.includes(slot) && el.text) ||
       (el.classes.includes('tb-label') && /source/i.test(el.text)))); // DATUM title block
    if (!cited) errors.push(`R8 ${at(i)}: ${s.layout} requires a ${slot} (or DATUM title-block SOURCE) citing the data source`);
  }
  if (!styled && s.layout === 'L15') {
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
      const A = texts[a].bbox, B = texts[b].bbox;
      const ix = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
      const iy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ix <= 0 || iy <= 0) continue;
      const smaller = Math.min(A.w * A.h, B.w * B.h);
      if (ix * iy > smaller * 0.04)
        errors.push(`R9 ${at(i, texts[a])}: overlaps "${(texts[b].text || '').slice(0, 18)}" by ${Math.round(ix)}x${Math.round(iy)}px`);
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
      if (o.kind === 'image' || o.kind === 'video') { if (!o.decor) unknown = true; continue; }
      if (o.kind !== 'shape') continue;
      const a = Math.min(1, (o.fill.alpha ?? 1) * (o.opacity ?? 1));
      if (a >= 0.99) { base = hex2rgb(o.fill.hex); unknown = false; }
      else if (!unknown) base = blend(hex2rgb(o.fill.hex), a, base);
    }
    if (unknown) continue;
    const ratio = contrast(blend(hex2rgb(el.color.hex), eff, base), base);
    if (ratio < 3) warns.push(`R11 ${at(i, el)}: contrast ${ratio.toFixed(1)}:1 below 3:1 floor`);
  }

  // R5 density band (warn only); image/video-led layouts are exempt above
  const bleed = s.els.filter((el) => (el.kind === 'image' || el.kind === 'video') && el.w * el.h >= CANVAS.w * CANVAS.h * 0.25);
  const cover = ((maxX - minX) * (maxY - minY)) / (CANVAS.w * CANVAS.h);
  if (s.els.length && (cover < 0.25 || (cover > 0.97 && !bleed.length)))
    warns.push(`R5 ${at(i)}: content bounding box covers ${(cover * 100).toFixed(0)}% of canvas`);

  // R15b state: decorative texture layers span the canvas on almost every page
  // without changing how light or dark it reads — only content media bleeds.
  states.push(bleed.some((el) => !el.decor) ? 'bleed' : relLum(hex2rgb(s.bg.hex)) < 0.35 ? 'dark' : 'light');
});

// R15b rhythm (warn): a long stretch in one light/dark state reads flat, so
// every 3–5 pages wants a break (is-dark / is-accent / full-bleed image).
// Bleed pages break a run and never form a warnable one themselves.
for (let a = 0; a < states.length; a++) {
  let b = a;
  while (states[a] !== 'bleed' && states[b] === states[a]) b++;
  if (b - a >= 7)
    warns.push(`R15 slides ${a + 1}–${b}: ${b - a} consecutive ${states[a]} pages — insert a rhythm break every 3–5 pages`);
  a = Math.max(a, b - 1);
}

// R14 speaker-notes completeness (warn): a mostly-annotated deck with
// gaps usually means forgotten pages, not intent
const noted = slides.map((s, i) => (s.notes ? null : i + 1)).filter(Boolean);
if (noted.length && noted.length <= slides.length / 2)
  warns.push(`R14 slides ${noted.join(', ')} lack speaker notes while ${slides.length - noted.length}/${slides.length} slides have them`);

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${slides.length} slides checked: ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
