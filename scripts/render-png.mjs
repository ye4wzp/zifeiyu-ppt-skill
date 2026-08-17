// Usage: node scripts/render-png.mjs <deck-dir|index.html> [--out dir]
import { chromium } from 'playwright';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { deckIndex } from './lib/deck.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--out');
const index = deckIndex(args.find((a) => !a.startsWith('--')) || '.');
// explicit --out resolves from CWD; default stays inside the deck
const outDir = i >= 0 ? resolve(args[i + 1]) : resolve(dirname(index), 'renders');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
// deviceScaleFactor pinned so Retina hosts don't produce 2x-size renders
const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
await page.goto('file://' + index + '?flat=1');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);

const slides = await page.locator('.slide').all();
for (let n = 0; n < slides.length; n++) {
  await slides[n].scrollIntoViewIfNeeded();
  await slides[n].screenshot({ path: `${outDir}/slide-${n + 1}.png` });
  console.log(`slide-${n + 1}.png`);
}
await browser.close();
