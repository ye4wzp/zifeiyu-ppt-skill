import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

// Canvas contract: 1280x720 px -> 96 px/in -> pt = px * 0.75
export const CANVAS = { w: 1280, h: 720 };
export const px2in = (px) => px / 96;
export const px2pt = (px) => px * 0.75;

export function deckIndex(deckArg) {
  const p = resolve(deckArg);
  const index = p.endsWith('.html') ? p : resolve(p, 'index.html');
  if (!existsSync(index)) throw new Error(`deck not found: ${index}`);
  return index;
}

// Opens the deck in flat mode and returns a per-slide spec of every
// exportable element (shapes, images, text) in DOM order.
export async function measureDeck(indexPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
  await page.goto('file://' + indexPath + '?flat=1');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  const slides = await page.evaluate(() => {
    const parseColor = (c) => {
      const m = c.match(/[\d.]+/g) || [];
      const hex = m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
      return { hex, alpha: m.length > 3 ? parseFloat(m[3]) : 1 };
    };
    return [...document.querySelectorAll('.slide')].map((slide) => {
      const sr = slide.getBoundingClientRect();
      const els = [...slide.querySelectorAll('[data-shape], img, h1, h2, h3, p')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0; // skip display:none (e.g. future speaker notes)
      }).map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const box = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
        const opacity = parseFloat(s.opacity);
        if (el.dataset.shape) {
          return { kind: 'shape', shape: el.dataset.shape, ...box, opacity, fill: parseColor(s.backgroundColor) };
        }
        if (el.tagName === 'IMG') {
          return { kind: 'image', ...box, src: el.getAttribute('src'), fit: s.objectFit };
        }
        return {
          kind: 'text', tag: el.tagName.toLowerCase(), ...box, opacity,
          text: el.textContent.trim(),
          overflowX: el.scrollWidth > el.clientWidth + 1,
          overflowY: el.scrollHeight > el.clientHeight + 2,
          fontSize: parseFloat(s.fontSize),
          fontFamily: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
          fontWeight: parseInt(s.fontWeight, 10),
          color: parseColor(s.color),
          lineHeight: parseFloat(s.lineHeight),
          letterSpacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing),
          align: s.textAlign === 'start' ? 'left' : s.textAlign,
          classes: [...el.classList],
          inlineStyle: el.getAttribute('style') || '',
        };
      });
      return {
        layout: slide.dataset.layout || '',
        bg: parseColor(getComputedStyle(slide).backgroundColor),
        els,
      };
    });
  });

  return { browser, page, slides };
}
