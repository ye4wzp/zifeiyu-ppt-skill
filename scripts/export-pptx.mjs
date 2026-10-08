// Usage: node scripts/export-pptx.mjs <deck-dir|index.html> [--out deck.pptx] [--cjk-font "Microsoft YaHei"]
// Deterministic mapping: measured registered slots -> pptxgenjs calls.
// Verified facts (references/pptx-export.md): margin:0 and valign:'top' are
// mandatory; lineSpacing/charSpacing in pt; hex colors without '#'.
import pptxgen from 'pptxgenjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deckIndex, measureDeck, px2in, px2pt } from './lib/deck.mjs';
import { loadStyle } from './lib/style.mjs';
import { snapshotEl } from './lib/snapshot.mjs';

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
};
const index = deckIndex(args.find((a) => !a.startsWith('--')) || '.');
const deckDir = dirname(index);
const outFile = resolve(deckDir, flag('--out', 'deck.pptx'));
const cjkFont = flag('--cjk-font', 'PingFang SC');
const style = loadStyle(index);

// PPTX has no numeric weights: <=300 needs the Light face; >=600 -> bold.
const CJK_STACK = new Set(['Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC']);
const CJK_SERIF_STACK = new Set(['Source Han Serif SC', 'Songti SC', 'Noto Serif SC', 'SimSun', 'STSong']);
const MONO_STACK = new Set(['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas']);
const cjkSerif = flag('--cjk-serif', 'SimSun'); // ubiquitous on Windows
// --embed-fonts (EXPERIMENTAL): keep the deck's real families and ride
// font subsets inside the pptx instead of mapping to system fonts
const embedFonts = args.includes('--embed-fonts');
const unmapped = new Set();
const fontFace = (t) => {
  // style packages declare their Office faces; CLI flags stay legacy-only
  const office = style.mode === 'style' && !embedFonts ? style.manifest.fonts?.office?.[t.fontFamily] : null;
  if (office) return typeof office === 'string' ? office : (t.fontWeight <= 300 && office.light) || office.regular;
  if (style.mode === 'style' && !embedFonts) unmapped.add(t.fontFamily);
  if (embedFonts) {
    if (CJK_STACK.has(t.fontFamily)) return t.fontWeight <= 300 ? 'Source Han Sans SC Light' : 'Source Han Sans SC';
    if (CJK_SERIF_STACK.has(t.fontFamily)) return 'Source Han Serif SC';
    if (MONO_STACK.has(t.fontFamily)) return 'JetBrains Mono';
  }
  if (CJK_STACK.has(t.fontFamily)) return t.fontWeight <= 300 ? `${cjkFont} Light` : cjkFont;
  if (CJK_SERIF_STACK.has(t.fontFamily)) return cjkSerif;
  if (MONO_STACK.has(t.fontFamily)) return 'Consolas'; // Windows-ubiquitous mono
  if (t.fontFamily === 'Helvetica Neue' && t.fontWeight <= 300) return 'Helvetica Neue Light';
  return t.fontFamily;
};
// CSS opacity multiplies into color alpha -> one PPTX transparency value
const alpha2transparency = (a, opacity = 1) => {
  const eff = a * opacity;
  return eff >= 1 ? undefined : Math.round((1 - eff) * 100);
};

const { browser, page, slides } = await measureDeck(index);

// Bake what PPTX cannot reproduce into isolated browser screenshots:
// cover crops (pptxgenjs cover anchor differs from CSS center-crop),
// rounded/filtered/rotated images (rotation is re-applied natively) and
// data-raster shapes (gradients etc.). Videos get their rendered poster
// as the PPTX media cover. Text is never baked — it stays native.
const { mkdirSync, readFileSync } = await import('node:fs');
const cropDir = resolve(deckDir, '.export-crops');
mkdirSync(cropDir, { recursive: true });
for (let i = 0; i < slides.length; i++) {
  for (const el of slides[i].els) {
    const bake = el.kind === 'image' && (el.fit === 'cover' || el.radius > 0 || el.filter || el.rotate);
    if (bake || (el.kind === 'shape' && el.raster)) {
      const shot = resolve(cropDir, `s${i + 1}-${el.mid}.png`);
      await snapshotEl(page, el.mid, shot, { unrotate: !!el.rotate });
      Object.assign(el, { kind: 'image', src: shot, fit: 'exact' });
    } else if (el.kind === 'video') {
      const shot = resolve(cropDir, `s${i + 1}-${el.mid}.png`);
      await snapshotEl(page, el.mid, shot);
      el.cover = `data:image/png;base64,${readFileSync(shot).toString('base64')}`;
    }
  }
}
await browser.close();

const pres = new pptxgen();
pres.defineLayout({ name: 'W16x9', width: 13.333, height: 7.5 });
pres.layout = 'W16x9';

const nativeCharts = args.includes('--native-charts');

const SHAPE = { rect: pres.ShapeType.rect, ellipse: pres.ShapeType.ellipse, chevron: pres.ShapeType.chevron, pentagon: pres.ShapeType.homePlate };
const shadowOf = (sh) => sh && {
  type: 'outer', color: sh.color.hex, opacity: sh.color.alpha,
  blur: px2pt(sh.blur), offset: px2pt(Math.hypot(sh.x, sh.y)),
  angle: Math.round(((Math.atan2(sh.y, sh.x) * 180) / Math.PI + 360) % 360),
};
// text options shared by single and merged boxes: vertical CJK + rotation
const textXform = (el) => ({ ...(el.vertical && { vert: 'eaVert' }), ...(el.rotate && { rotate: el.rotate }) });

// Registered merge groups: designed-contiguous text stacks collapse into
// ONE editable textbox per group — each slot becomes a paragraph keeping
// its own size/face/color, and measured gaps become exact spcAft values.
const MERGE_GROUPS = {
  L05: [
    [['l05-h', 'l05-ha'], ['l05-p', 'l05-a1'], ['l05-p', 'l05-a2']],
    [['l05-h', 'l05-hb'], ['l05-p', 'l05-b1'], ['l05-p', 'l05-b2']],
  ],
  L06: [1, 2, 3].map((n) => [['l06-num', `l06-c${n}`], ['l06-h', `l06-c${n}`], ['l06-p', `l06-c${n}`]]),
  L10: [1, 2, 3].map((n) => [[`l10-p${n}t`], [`l10-p${n}b`]]),
  L12: [1, 2, 3, 4].map((n) => [['l12-h', `l12-c${n}`], ['l12-p', `l12-c${n}`]]),
  L19: [[['l19-track'], ['l19-meta']]],
  L20: ['n', 'e', 's', 'w'].map((k) => [['l20-h', `l20-h${k}`], ['l20-p', `l20-p${k}`]]),
  L21: [1, 2, 3, 4].flatMap((r) =>
    [1, 2, 3].map((c) => [['l21-num', `l21-c${c}`, `l21-r${r}`], ['l21-label', `l21-c${c}`, `l21-b${r}`]])),
  L22: [1, 2, 3, 4].flatMap((r) =>
    [1, 2].map((c) => [['l22-label', `l22-c${c}`, `l22-r${r}`], ['l22-value', `l22-c${c}`, `l22-b${r}`]])),
  L23: [1, 2, 3, 4].map((n) => [['l23-h', `l23-r${n}`], ['l23-p', `l23-n${n}`]]),
  L24: [1, 2, 3].map((n) => [['l24-h', `l24-h${n}`], ['l24-p', `l24-p${n}`]]),
};

for (const s of slides) {
  const slide = pres.addSlide();
  slide.background = { color: s.bg.hex };
  if (s.notes) slide.addNotes(s.notes); // -> PowerPoint speaker notes view

  // --native-charts: L15 bars become a real editable PowerPoint chart
  let chartEls = new Set();
  if (nativeCharts && style.mode === 'style' && s.role === 'bars') {
    const bars = s.els.filter((e) => e.kind === 'shape' && e.value != null);
    const replaced = s.els.filter((e) => e.kind === 'text' && e.chart);
    if (bars.length && bars.every((b) => Number.isFinite(b.value))) {
      chartEls = new Set([...bars, ...replaced]);
      const hull = [...chartEls].map((e) => e.bbox);
      const x = Math.min(...hull.map((b) => b.x)), y = Math.min(...hull.map((b) => b.y));
      const r = Math.max(...hull.map((b) => b.x + b.w)), btm = Math.max(...hull.map((b) => b.y + b.h));
      slide.addChart(pres.ChartType.bar, [{ name: 'data', labels: bars.map((b) => b.label || ''), values: bars.map((b) => b.value) }], {
        x: px2in(x), y: px2in(y), w: px2in(r - x), h: px2in(btm - y),
        barDir: 'bar',
        chartColors: [bars[0].fill.hex],
        valAxisHidden: true,
        catAxisOrientation: 'maxMin',
        valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
        showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.#', dataLabelFontSize: 12, catAxisLabelFontSize: 14,
      });
    }
  } else if (nativeCharts && s.layout === 'L15') {
    const has = (el, c) => el.classes?.some((k) => k.startsWith(c));
    const labels = s.els.filter((e) => e.kind === 'text' && has(e, 'l15-label'));
    const vals = s.els.filter((e) => e.kind === 'text' && has(e, 'l15-val'));
    const bars = s.els.filter((e) => e.kind === 'shape' && has(e, 'l15-bar'));
    const values = vals.map((e) => parseFloat(e.text.replace(/[^\d.]/g, '')));
    if (labels.length && labels.length === values.length && values.every(Number.isFinite)) {
      chartEls = new Set([...labels, ...vals, ...bars]);
      slide.addChart(pres.ChartType.bar, [{ name: 'data', labels: labels.map((e) => e.text), values }], {
        x: px2in(96), y: px2in(196), w: px2in(1088), h: px2in(400),
        barDir: 'bar',
        chartColors: [bars[0]?.fill.hex || '0f62fe'],
        valAxisHidden: true,
        catAxisOrientation: 'maxMin',
        valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
        showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.#', dataLabelFontSize: 12, catAxisLabelFontSize: 14,
      });
    }
  }

  // resolve this layout's merge groups; members are emitted once, together
  const inGroup = new Map();
  if (style.mode === 'style') {
    // style packages declare merge groups on the skeleton (data-merge)
    const groups = new Map();
    for (const el of s.els) if (el.kind === 'text' && el.merge) groups.set(el.merge, [...(groups.get(el.merge) || []), el]);
    for (const els of groups.values()) {
      if (els.length < 2) continue;
      els.sort((a, b) => a.y - b.y);
      els.forEach((el, i) => inGroup.set(el, { els, first: i === 0 }));
    }
  } else {
    for (const g of MERGE_GROUPS[s.layout] || []) {
      const els = g.map((need) => s.els.find((el) => el.kind === 'text' && need.every((c) => el.classes.includes(c))));
      if (els.some((el) => !el)) continue; // trimmed skeleton rows are fine
      els.forEach((el, i) => inGroup.set(el, { els, first: i === 0 }));
    }
  }
  const mergedText = (els) => {
    const x = Math.min(...els.map((e) => e.x));
    const right = Math.max(...els.map((e) => e.x + e.w));
    const last = els[els.length - 1];
    const content = els.flatMap((el, gi) => {
      const next = els[gi + 1];
      const para = {
        fontSize: px2pt(el.fontSize),
        fontFace: fontFace(el),
        bold: el.fontWeight >= 600,
        color: el.color.hex,
        transparency: alpha2transparency(el.color.alpha, el.opacity),
        align: el.align,
        lineSpacing: px2pt(el.lineHeight),
        ...(el.letterSpacing && { charSpacing: px2pt(el.letterSpacing) }),
        ...(next && { paraSpaceAfter: Math.max(0, (next.y - el.y - el.h) * 0.75) }),
      };
      const styled = el.runs?.some((r) => r.bold != null || r.italic || r.color || r.highlight);
      const items = styled
        ? el.runs.map((r) => ({
            text: r.text,
            options: {
              ...para,
              ...(r.bold != null && { bold: r.bold }),
              ...(r.italic && { italic: true }),
              ...(r.color && { color: r.color }),
              ...(r.highlight && { highlight: r.highlight }),
            },
          }))
        : [{ text: el.text, options: para }];
      if (next) items[items.length - 1].options = { ...items[items.length - 1].options, breakLine: true };
      return items;
    });
    return { content, box: { x: px2in(x), y: px2in(els[0].y), w: px2in(right - x), h: px2in(last.y + last.h - els[0].y) } };
  };

  for (const el of s.els) {
    if (chartEls.has(el)) continue;
    const m = inGroup.get(el);
    if (m) {
      if (m.first) {
        const { content, box } = mergedText(m.els);
        slide.addText(content, { ...box, ...textXform(m.els[0]), valign: 'top', margin: 0, fit: 'none' });
      }
      continue;
    }
    const box = { x: px2in(el.x), y: px2in(el.y), w: px2in(el.w), h: px2in(el.h) };
    if (el.kind === 'shape') {
      // CSS borders sit inside the box, PPTX lines straddle the edge: inset by half
      const inset = el.border ? el.border.width / 2 : 0;
      const sbox = { x: px2in(el.x + inset), y: px2in(el.y + inset), w: px2in(el.w - 2 * inset), h: px2in(el.h - 2 * inset) };
      const round = el.shape === 'rect' && el.radius > 0;
      slide.addShape(round ? pres.ShapeType.roundRect : SHAPE[el.shape] || pres.ShapeType.rect, {
        ...sbox,
        fill: { color: el.fill.hex, transparency: alpha2transparency(el.fill.alpha, el.opacity) },
        line: el.border
          ? { color: el.border.color.hex, width: px2pt(el.border.width), transparency: alpha2transparency(el.border.color.alpha) }
          : { type: 'none' },
        // rectRadius is in inches: pptxgenjs writes adj = r / min(w, h)
        ...(round && { rectRadius: px2in(Math.min(el.radius - inset, (el.w - 2 * inset) / 2, (el.h - 2 * inset) / 2)) }),
        ...(el.rotate && { rotate: el.rotate }),
        ...(el.shadow && { shadow: shadowOf(el.shadow) }),
      });
    } else if (el.kind === 'image') {
      const sizing =
        el.fit === 'cover' ? { type: 'cover', w: box.w, h: box.h } :
        el.fit === 'contain' ? { type: 'contain', w: box.w, h: box.h } : undefined;
      slide.addImage({
        path: resolve(deckDir, el.src), ...box, sizing,
        ...(el.rotate && { rotate: el.rotate }),
        ...(el.shadow && { shadow: shadowOf(el.shadow) }),
      });
      // 'exact': pre-cropped screenshot, box maps 1:1, no sizing needed
    } else if (el.kind === 'video' || el.kind === 'audio') {
      // embedded media; videos carry their rendered poster as the cover,
      // audio keeps the PowerPoint speaker chrome at the play-dot box
      slide.addMedia({
        type: el.kind,
        path: resolve(deckDir, el.src),
        ...box,
        ...(el.cover && { cover: el.cover }),
      });
    } else {
      // inline emphasis (strong/em/accent/marker span) -> per-run overrides
      const styled = el.runs?.some((r) => r.bold != null || r.italic || r.color || r.highlight);
      const content = styled
        ? el.runs.map((r) => ({
            text: r.text,
            options: {
              ...(r.bold != null && { bold: r.bold }),
              ...(r.italic && { italic: true }),
              ...(r.color && { color: r.color }),
              ...(r.highlight && { highlight: r.highlight }),
            },
          }))
        : el.text;
      slide.addText(content, {
        ...box,
        ...textXform(el),
        fontSize: px2pt(el.fontSize),
        fontFace: fontFace(el),
        bold: el.fontWeight >= 600,
        color: el.color.hex,
        transparency: alpha2transparency(el.color.alpha, el.opacity),
        align: el.align,
        valign: 'top',
        margin: 0,
        lineSpacing: px2pt(el.lineHeight),
        charSpacing: el.letterSpacing ? px2pt(el.letterSpacing) : undefined,
        fit: 'none',
      });
    }
  }
}

await pres.writeFile({ fileName: outFile });

if (embedFonts) {
  // EXPERIMENTAL: OOXML embeddedFontLst + fntdata parts via zip
  // post-processing (ECMA-376; no open-source precedent — verify once in
  // WPS/PowerPoint before shipping to clients). Fonts are subset to the
  // deck's characters; the sans VF is pinned to static weight instances.
  const subsetFont = (await import('subset-font')).default;
  const JSZip = (await import('jszip')).default;
  const { existsSync, writeFileSync } = await import('node:fs');
  const srcDir = join(skillRoot, 'assets/fonts-src');

  const chars = new Set('0123456789.,:;!?%×÷=+-–—·/()（）「」《》、。，；：？！ ');
  const used = new Set();
  for (const s of slides) {
    for (const el of s.els) {
      if (el.kind !== 'text') continue;
      used.add(fontFace(el));
      for (const ch of el.text) chars.add(ch);
    }
  }
  const text = [...chars].join('');
  const FACES = [
    { typeface: 'Source Han Sans SC', regular: ['SourceHanSansSC-VF.otf', { wght: 400 }], bold: ['SourceHanSansSC-VF.otf', { wght: 800 }] },
    { typeface: 'Source Han Sans SC Light', regular: ['SourceHanSansSC-VF.otf', { wght: 250 }] },
    { typeface: 'Source Han Serif SC', regular: ['SourceHanSerifSC-Regular.otf'], bold: ['SourceHanSerifSC-Heavy.otf'] },
    { typeface: 'JetBrains Mono', regular: ['JetBrainsMono-Regular.ttf'] },
  ].filter((f) => used.has(f.typeface));

  const zip = await JSZip.loadAsync(readFileSync(outFile));
  let presXml = await zip.file('ppt/presentation.xml').async('string');
  let rels = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
  let ct = await zip.file('[Content_Types].xml').async('string');
  if (!ct.includes('Extension="fntdata"')) ct = ct.replace('</Types>', '<Default Extension="fntdata" ContentType="application/x-fontdata"/></Types>');
  let rid = Math.max(0, ...[...rels.matchAll(/Id="rId(\d+)"/g)].map((m) => +m[1]));
  let fi = 0;
  const entries = [];
  for (const face of FACES) {
    const slots = [];
    for (const slot of ['regular', 'bold']) {
      if (!face[slot]) continue;
      const [file, axes] = face[slot];
      if (!existsSync(join(srcDir, file))) throw new Error(`--embed-fonts needs assets/fonts-src/${file} — run scripts/fetch-fonts.mjs`);
      const buf = await subsetFont(readFileSync(join(srcDir, file)), text, { targetFormat: 'sfnt', ...(axes && { variationAxes: axes }) });
      fi += 1; rid += 1;
      zip.file(`ppt/fonts/font${fi}.fntdata`, buf);
      rels = rels.replace('</Relationships>', `<Relationship Id="rId${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font${fi}.fntdata"/></Relationships>`);
      slots.push(`<p:${slot} r:id="rId${rid}"/>`);
    }
    entries.push(`<p:embeddedFont><p:font typeface="${face.typeface}"/>${slots.join('')}</p:embeddedFont>`);
  }
  presXml = presXml
    .replace('<p:presentation ', '<p:presentation embedTrueTypeFonts="1" ')
    .replace(/(<p:notesSz[^>]*\/>)/, `$1<p:embeddedFontLst>${entries.join('')}</p:embeddedFontLst>`);
  zip.file('ppt/presentation.xml', presXml);
  zip.file('ppt/_rels/presentation.xml.rels', rels);
  zip.file('[Content_Types].xml', ct);
  writeFileSync(outFile, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log(`embedded fonts (EXPERIMENTAL): ${FACES.map((f) => f.typeface).join(', ')} — verify once in WPS/PowerPoint before client delivery`);
}

console.log('written:', outFile);
if (style.mode === 'legacy') console.log('cjk font:', cjkFont);
if (unmapped.size) console.log(`warn: no fonts.office mapping in styles/${style.id}/manifest.json for ${[...unmapped].join(', ')} — fell back to legacy defaults (PingFang SC has no Windows install)`);
console.log(slides.map((s, i) => `#${i + 1} ${s.layout}: ${s.els.length} elements`).join('\n'));
