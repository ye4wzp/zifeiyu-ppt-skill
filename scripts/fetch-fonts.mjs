// Usage: node scripts/fetch-fonts.mjs
// One-time download of the full source fonts (gitignored, ~55MB) that
// subset-fonts.mjs slices into tiny per-deck woff2 files.
// Licenses: Source Han Sans/Serif and JetBrains Mono are all SIL OFL 1.1 —
// subsetting and embedding are permitted.
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/fonts-src');
mkdirSync(dir, { recursive: true });

// serif ships as static weights: the 55MB serif VF blows the harfbuzz
// wasm heap during subsetting, the ~25MB static faces do not
const FILES = {
  'SourceHanSansSC-VF.otf': 'https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/Variable/OTF/SourceHanSansSC-VF.otf',
  'SourceHanSerifSC-Regular.otf': 'https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/SimplifiedChinese/SourceHanSerifSC-Regular.otf',
  'SourceHanSerifSC-Bold.otf': 'https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf',
  'SourceHanSerifSC-Heavy.otf': 'https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/SimplifiedChinese/SourceHanSerifSC-Heavy.otf',
  'JetBrainsMono-Regular.ttf': 'https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf/JetBrainsMono-Regular.ttf',
  'LICENSE-SourceHan.txt': 'https://raw.githubusercontent.com/adobe-fonts/source-han-sans/release/LICENSE.txt',
  'LICENSE-JetBrainsMono.txt': 'https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/OFL.txt',
};

for (const [name, url] of Object.entries(FILES)) {
  const out = join(dir, name);
  if (existsSync(out)) {
    console.log(`exists: ${name}`);
    continue;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(out));
  console.log(`fetched: ${name}`);
}
console.log(`fonts ready in ${dir}`);
