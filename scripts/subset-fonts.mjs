// Usage: node scripts/subset-fonts.mjs <deck-dir|index.html>
// Slices the full source fonts (assets/fonts-src, fetched once by
// fetch-fonts.mjs) down to the characters the deck actually renders and
// writes deck-local woff2 subsets. Re-run after any text change.
import subsetFont from 'subset-font';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deckIndex, measureDeck } from './lib/deck.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'assets/fonts-src');
const FONTS = [
  { src: 'SourceHanSansSC-VF.otf', out: 'source-han-sans-sc.woff2' },
  { src: 'SourceHanSerifSC-Regular.otf', out: 'source-han-serif-sc-regular.woff2' },
  { src: 'SourceHanSerifSC-Bold.otf', out: 'source-han-serif-sc-bold.woff2' },
  { src: 'SourceHanSerifSC-Heavy.otf', out: 'source-han-serif-sc-heavy.woff2' },
  { src: 'JetBrainsMono-Regular.ttf', out: 'jetbrains-mono.woff2' },
];
for (const f of FONTS) {
  if (!existsSync(join(srcDir, f.src))) {
    console.error(`missing ${f.src} — run: node scripts/fetch-fonts.mjs`);
    process.exit(1);
  }
}

const index = deckIndex(process.argv[2] || '.');
const { browser, slides } = await measureDeck(index);
await browser.close();

// Every family gets the full deck text: theme/system switches stay safe
// without re-subsetting, at the cost of a few hundred glyphs per file.
const SAFETY = '0123456789.,:;!?%×÷=+-–—·/()（）「」《》、。，；：？！ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';
const chars = new Set(SAFETY);
for (const s of slides) {
  for (const el of s.els) if (el.kind === 'text') for (const ch of el.text) chars.add(ch);
}
const text = [...chars].join('');

const outDir = join(dirname(index), 'assets/fonts');
mkdirSync(outDir, { recursive: true });
for (const f of FONTS) {
  const buf = await subsetFont(readFileSync(join(srcDir, f.src)), text, { targetFormat: 'woff2' });
  writeFileSync(join(outDir, f.out), buf);
  console.log(`${f.out}: ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log(`${chars.size} chars covered — re-run after editing deck text`);
