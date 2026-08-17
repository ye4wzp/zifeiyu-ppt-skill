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
// exportable element (shapes, images, text) in DOM order, plus a
// document-level summary (stylesheets, <style> tags) for hygiene rules.
export async function measureDeck(indexPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
  await page.goto('file://' + indexPath + '?flat=1');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  const { slides, doc } = await page.evaluate(() => {
    const parseColor = (c) => {
      const m = c.match(/[\d.]+/g) || [];
      const hex = m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
      return { hex, alpha: m.length > 3 ? parseFloat(m[3]) : 1 };
    };
    const INLINE_TAGS = ['STRONG', 'B', 'EM', 'I', 'SPAN'];

    const doc = {
      styleTags: document.querySelectorAll('style').length,
      links: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
    };

    const slides = [...document.querySelectorAll('.slide')].map((slide) => {
      const sr = slide.getBoundingClientRect();

      // Text nodes outside h1/h2/h3/p never reach the export -> report them.
      const stray = [];
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode.textContent.trim();
        const parent = walker.currentNode.parentElement;
        if (t && !parent.closest('h1, h2, h3, p')) stray.push({ text: t.slice(0, 24), tag: parent.tagName.toLowerCase() });
      }

      const els = [...slide.querySelectorAll('[data-shape], img, video, audio, h1, h2, h3, p')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0; // skip display:none (e.g. speaker notes)
      }).map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const box = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
        const opacity = parseFloat(s.opacity);
        const inlineStyle = el.getAttribute('style') || '';
        if (el.dataset.shape) {
          return { kind: 'shape', shape: el.dataset.shape, ...box, opacity, fill: parseColor(s.backgroundColor), classes: [...el.classList], inlineStyle };
        }
        if (el.tagName === 'IMG') {
          return {
            kind: 'image', ...box, src: el.getAttribute('src'), fit: s.objectFit,
            alt: el.getAttribute('alt') || '',
            decor: el.getAttribute('aria-hidden') === 'true',
            classes: [...el.classList], inlineStyle,
          };
        }
        if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
          return {
            kind: el.tagName.toLowerCase(), ...box, opacity,
            src: el.getAttribute('src') || '',
            poster: el.getAttribute('poster') || '',
            label: el.getAttribute('aria-label') || '',
            classes: [...el.classList], inlineStyle,
          };
        }
        const color = parseColor(s.color);
        const fontWeight = parseInt(s.fontWeight, 10);
        // Inline emphasis: only unnested strong/em/span become PPTX text runs.
        const kids = [...el.children];
        const badChildTags = kids
          .filter((k) => !INLINE_TAGS.includes(k.tagName) || k.children.length)
          .map((k) => k.tagName.toLowerCase());
        let runs;
        if (kids.length && !badChildTags.length) {
          runs = [...el.childNodes].map((n) => {
            const text = n.textContent.replace(/\s+/g, ' ');
            if (n.nodeType !== 1) return { text };
            const cs = getComputedStyle(n);
            const run = { text };
            const w = parseInt(cs.fontWeight, 10);
            if ((w >= 600) !== (fontWeight >= 600)) run.bold = w >= 600;
            if (cs.fontStyle === 'italic') run.italic = true;
            const c = parseColor(cs.color);
            if (c.hex !== color.hex) run.color = c.hex;
            return run;
          }).filter((run) => run.text);
          if (runs.length) {
            runs[0].text = runs[0].text.replace(/^\s+/, '');
            runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, '');
          }
        }
        return {
          kind: 'text', tag: el.tagName.toLowerCase(), ...box, opacity,
          text: el.textContent.trim(),
          overflowX: el.scrollWidth > el.clientWidth + 1,
          // no overflowY: text slots are auto-height (overflow renders, never
          // clips); real vertical trouble surfaces as R3 bounds or R9 collision
          fontSize: parseFloat(s.fontSize),
          fontFamily: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
          fontWeight,
          color,
          lineHeight: parseFloat(s.lineHeight),
          letterSpacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing),
          align: s.textAlign === 'start' ? 'left' : s.textAlign,
          classes: [...el.classList],
          childClasses: kids.flatMap((k) => [...k.classList]),
          badChildTags,
          runs,
          inlineStyle,
        };
      });
      return {
        layout: slide.dataset.layout || '',
        bg: parseColor(getComputedStyle(slide).backgroundColor),
        notes: slide.querySelector('.notes')?.textContent.trim() || '',
        stray,
        els,
      };
    });
    return { slides, doc };
  });

  return { browser, page, slides, doc };
}
