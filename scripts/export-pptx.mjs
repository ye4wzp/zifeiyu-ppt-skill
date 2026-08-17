// Usage: node scripts/export-pptx.mjs <deck-dir|index.html> [--out deck.pptx] [--cjk-font "Microsoft YaHei"]
// Deterministic mapping: measured registered slots -> pptxgenjs calls.
// Verified facts (references/pptx-export.md): margin:0 and valign:'top' are
// mandatory; lineSpacing/charSpacing in pt; hex colors without '#'.
import pptxgen from 'pptxgenjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deckIndex, measureDeck, px2in, px2pt } from './lib/deck.mjs';

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

// PPTX has no numeric weights: <=300 needs the Light face; >=600 -> bold.
const CJK_STACK = new Set(['Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC']);
const CJK_SERIF_STACK = new Set(['Source Han Serif SC', 'Songti SC', 'Noto Serif SC', 'SimSun', 'STSong']);
const MONO_STACK = new Set(['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas']);
const cjkSerif = flag('--cjk-serif', 'SimSun'); // ubiquitous on Windows
// --embed-fonts (EXPERIMENTAL): keep the deck's real families and ride
// font subsets inside the pptx instead of mapping to system fonts
const embedFonts = args.includes('--embed-fonts');
const fontFace = (t) => {
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

// Embed cover-cropped images as browser screenshots so the PPTX shows
// exactly the crop the browser rendered (pptxgenjs cover anchor differs
// from CSS object-fit center-crop). Videos get the same treatment: their
// rendered poster becomes the PPTX media cover image.
const { mkdirSync, readFileSync } = await import('node:fs');
const cropDir = resolve(deckDir, '.export-crops');
mkdirSync(cropDir, { recursive: true });
for (let i = 0; i < slides.length; i++) {
  const imgs = slides[i].els.filter((el) => el.kind === 'image');
  for (let j = 0; j < imgs.length; j++) {
    if (imgs[j].fit !== 'cover') continue;
    const shot = resolve(cropDir, `s${i + 1}-img${j + 1}.png`);
    await page.locator('.slide').nth(i).locator('img').nth(j).screenshot({ path: shot });
    imgs[j].src = shot;
    imgs[j].fit = 'exact';
  }
  const vids = slides[i].els.filter((el) => el.kind === 'video');
  for (let j = 0; j < vids.length; j++) {
    const shot = resolve(cropDir, `s${i + 1}-vid${j + 1}.png`);
    await page.locator('.slide').nth(i).locator('video').nth(j).screenshot({ path: shot });
    vids[j].cover = `data:image/png;base64,${readFileSync(shot).toString('base64')}`;
  }
}
await browser.close();

const pres = new pptxgen();
pres.defineLayout({ name: 'W16x9', width: 13.333, height: 7.5 });
pres.layout = 'W16x9';

const nativeCharts = args.includes('--native-charts');

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
};

for (const s of slides) {
  const slide = pres.addSlide();
  slide.background = { color: s.bg.hex };
  if (s.notes) slide.addNotes(s.notes); // -> PowerPoint speaker notes view

  // --native-charts: L15 bars become a real editable PowerPoint chart
  let chartEls = new Set();
  if (nativeCharts && s.layout === 'L15') {
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
  for (const g of MERGE_GROUPS[s.layout] || []) {
    const els = g.map((need) => s.els.find((el) => el.kind === 'text' && need.every((c) => el.classes.includes(c))));
    if (els.some((el) => !el)) continue; // trimmed skeleton rows are fine
    els.forEach((el, i) => inGroup.set(el, { els, first: i === 0 }));
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
      const styled = el.runs?.some((r) => r.bold != null || r.italic || r.color);
      const items = styled
        ? el.runs.map((r) => ({
            text: r.text,
            options: { ...para, ...(r.bold != null && { bold: r.bold }), ...(r.italic && { italic: true }), ...(r.color && { color: r.color }) },
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
        slide.addText(content, { ...box, valign: 'top', margin: 0, fit: 'none' });
      }
      continue;
    }
    const box = { x: px2in(el.x), y: px2in(el.y), w: px2in(el.w), h: px2in(el.h) };
    if (el.kind === 'shape') {
      slide.addShape(el.shape === 'ellipse' ? pres.ShapeType.ellipse : pres.ShapeType.rect, {
        ...box,
        fill: { color: el.fill.hex, transparency: alpha2transparency(el.fill.alpha, el.opacity) },
        line: { type: 'none' },
      });
    } else if (el.kind === 'image') {
      const sizing =
        el.fit === 'cover' ? { type: 'cover', w: box.w, h: box.h } :
        el.fit === 'contain' ? { type: 'contain', w: box.w, h: box.h } : undefined;
      slide.addImage({ path: resolve(deckDir, el.src), ...box, sizing });
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
      // inline emphasis (strong/em/accent span) -> per-run overrides
      const styled = el.runs?.some((r) => r.bold != null || r.italic || r.color);
      const content = styled
        ? el.runs.map((r) => ({
            text: r.text,
            options: {
              ...(r.bold != null && { bold: r.bold }),
              ...(r.italic && { italic: true }),
              ...(r.color && { color: r.color }),
            },
          }))
        : el.text;
      slide.addText(content, {
        ...box,
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
console.log('cjk font:', cjkFont);
console.log(slides.map((s, i) => `#${i + 1} ${s.layout}: ${s.els.length} elements`).join('\n'));
