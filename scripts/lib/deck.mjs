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
    const px = (v) => parseFloat(v) || 0;
    const parseShadow = (v) => {
      if (!v || v === 'none') return null;
      const color = v.match(/rgba?\([^)]+\)/)?.[0] || 'rgb(0, 0, 0)';
      const [x, y, blur] = v.split(/,(?![^(]*\))/)[0].replace(color, '').trim().split(/\s+/).map(px);
      return { x, y, blur, color: parseColor(color), layers: v.split(/,(?![^(]*\))/).length };
    };

    const doc = {
      styleTags: document.querySelectorAll('style').length,
      links: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
    };

    const slides = [...document.querySelectorAll('.slide')].map((slide, si) => {
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
      }).map((el, ei) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        el.dataset.mid = `${si}-${ei}`; // stable handle for export-time snapshots
        const bbox = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
        const rotate = s.rotate && s.rotate !== 'none' ? parseFloat(s.rotate) : 0;
        // unrotated box: same centre as the rotated hull, layout size from offset metrics
        const w = el.offsetWidth || bbox.w, h = el.offsetHeight || bbox.h;
        const box = { x: bbox.x + bbox.w / 2 - w / 2, y: bbox.y + bbox.h / 2 - h / 2, w, h };
        const common = {
          mid: el.dataset.mid, bbox, rotate, transform: s.transform,
          merge: el.dataset.merge || null, anim: el.dataset.anim || null,
          raster: el.hasAttribute('data-raster'), source: el.hasAttribute('data-source'),
        };
        const radius = s.borderTopLeftRadius.endsWith('%')
          ? (px(s.borderTopLeftRadius) / 100) * Math.min(w, h) : px(s.borderTopLeftRadius);
        const opacity = parseFloat(s.opacity);
        const inlineStyle = el.getAttribute('style') || '';
        if (el.dataset.shape) {
          return {
            kind: 'shape', shape: el.dataset.shape, ...box, ...common, opacity, fill: parseColor(s.backgroundColor),
            radius,
            border: px(s.borderTopWidth) && s.borderTopStyle !== 'none'
              ? {
                  width: px(s.borderTopWidth), color: parseColor(s.borderTopColor),
                  uniform: ['Right', 'Bottom', 'Left'].every((k) => s[`border${k}Width`] === s.borderTopWidth && s[`border${k}Color`] === s.borderTopColor),
                }
              : null,
            shadow: parseShadow(s.boxShadow),
            tip: s.getPropertyValue('--tip') ? px(s.getPropertyValue('--tip')) : null,
            value: el.dataset.value != null ? parseFloat(el.dataset.value) : null,
            label: el.dataset.label || null,
            classes: [...el.classList], inlineStyle,
          };
        }
        if (el.tagName === 'IMG') {
          return {
            kind: 'image', ...box, ...common, radius, filter: s.filter !== 'none', shadow: parseShadow(s.boxShadow),
            src: el.getAttribute('src'), fit: s.objectFit,
            alt: el.getAttribute('alt') || '',
            decor: el.getAttribute('aria-hidden') === 'true',
            naturalW: el.naturalWidth, naturalH: el.naturalHeight,
            classes: [...el.classList], inlineStyle,
          };
        }
        if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
          return {
            kind: el.tagName.toLowerCase(), ...box, ...common, opacity,
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
            const bg = parseColor(cs.backgroundColor);
            if (bg.alpha > 0) run.highlight = bg.hex; // marker span
            return run;
          }).filter((run) => run.text);
          if (runs.length) {
            runs[0].text = runs[0].text.replace(/^\s+/, '');
            runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, '');
          }
        }
        return {
          kind: 'text', tag: el.tagName.toLowerCase(), ...box, ...common, opacity,
          vertical: s.writingMode.startsWith('vertical'),
          chart: el.hasAttribute('data-chart'),
          textBox: {
            bg: parseColor(s.backgroundColor).alpha > 0 || s.backgroundImage !== 'none',
            border: px(s.borderTopWidth) > 0,
            shadow: s.boxShadow !== 'none',
            padding: ['Top', 'Right', 'Bottom', 'Left'].some((k) => px(s[`padding${k}`]) > 0),
          },
          text: el.textContent.trim(),
          overflowX: Math.max(0, el.scrollWidth - el.clientWidth - 1),
          // no overflowY: text slots are auto-height (overflow renders, never
          // clips); real vertical trouble surfaces as R3 bounds or R9 collision
          fontSize: parseFloat(s.fontSize),
          fontFamily: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
          fontWeight,
          italic: s.fontStyle === 'italic',
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
        role: slide.dataset.role || '',
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
