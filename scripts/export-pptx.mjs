// Usage: node scripts/export-pptx.mjs <deck-dir|index.html> [--out deck.pptx] [--cjk-font "Microsoft YaHei"]
// Deterministic mapping: measured registered slots -> pptxgenjs calls.
// Verified facts (validation/REPORT.md): margin:0 and valign:'top' are
// mandatory; lineSpacing/charSpacing in pt; hex colors without '#'.
import pptxgen from 'pptxgenjs';
import { dirname, resolve } from 'node:path';
import { deckIndex, measureDeck, px2in, px2pt } from './lib/deck.mjs';

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
const CJK_STACK = new Set(['PingFang SC', 'Microsoft YaHei', 'Noto Sans SC']);
const CJK_SERIF_STACK = new Set(['Songti SC', 'Noto Serif SC', 'SimSun', 'STSong']);
const cjkSerif = flag('--cjk-serif', 'SimSun'); // ubiquitous on Windows
const fontFace = (t) => {
  if (CJK_STACK.has(t.fontFamily)) return t.fontWeight <= 300 ? `${cjkFont} Light` : cjkFont;
  if (CJK_SERIF_STACK.has(t.fontFamily)) return cjkSerif;
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
// from CSS object-fit center-crop).
const { mkdirSync } = await import('node:fs');
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
}
await browser.close();

const pres = new pptxgen();
pres.defineLayout({ name: 'W16x9', width: 13.333, height: 7.5 });
pres.layout = 'W16x9';

for (const s of slides) {
  const slide = pres.addSlide();
  slide.background = { color: s.bg.hex };
  for (const el of s.els) {
    const box = { x: px2in(el.x), y: px2in(el.y), w: px2in(el.w), h: px2in(el.h) };
    if (el.kind === 'shape') {
      slide.addShape(el.shape === 'ellipse' ? pres.ShapeType.ellipse : pres.ShapeType.rect, {
        ...box,
        fill: { color: el.fill.hex, transparency: alpha2transparency(el.fill.alpha, el.opacity) },
        line: { type: 'none' },
      });
    } else if (el.kind === 'image') {
      slide.addImage({
        path: resolve(deckDir, el.src), ...box,
        sizing: el.fit === 'cover' ? { type: 'cover', w: box.w, h: box.h } : undefined,
      }); // 'exact': pre-cropped screenshot, box maps 1:1, no sizing needed
    } else {
      slide.addText(el.text, {
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
console.log('written:', outFile);
console.log('cjk font:', cjkFont);
console.log(slides.map((s, i) => `#${i + 1} ${s.layout}: ${s.els.length} elements`).join('\n'));
