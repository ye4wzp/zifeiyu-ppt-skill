// Usage: node scripts/export-pdf.mjs <deck-dir|index.html> [--out deck.pdf]
// Vector-text PDF straight from Chromium; one page per slide.
import { chromium } from 'playwright';
import { dirname, resolve } from 'node:path';
import { deckIndex } from './lib/deck.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--out');
const index = deckIndex(args.find((a) => !a.startsWith('--')) || '.');
const outFile = resolve(dirname(index), i >= 0 ? args[i + 1] : 'deck.pdf');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.goto('file://' + index + '?flat=1');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);
await page.addStyleTag({
  content: `
    @page { size: 1280px 720px; margin: 0; }
    body { background: none !important; }
    .slide { margin: 0 !important; page-break-after: always; break-after: page; }
  `,
});
await page.pdf({ path: outFile, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('written:', outFile);
