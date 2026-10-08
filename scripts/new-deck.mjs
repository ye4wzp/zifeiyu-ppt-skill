// Usage: node scripts/new-deck.mjs <deck-dir> --style <id>
//        node scripts/new-deck.mjs <deck-dir> --theme paper|graphite|forest|editorial|swiss   (legacy)
//        node scripts/new-deck.mjs <deck-dir> --refresh
// Scaffolds a self-contained deck: seed + shared runtime + the chosen style
// package (style.css, manifest.json and the asset dirs it lists). --refresh
// re-copies runtime and style into an existing deck, leaving its
// index.html, images, media and font subsets untouched.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleId } from './lib/style.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const legacy = join(root, 'assets/legacy');
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const dir = args.find((a, i) => !a.startsWith('--') && !['--style', '--theme'].includes(args[i - 1]));
const usage = 'usage: node scripts/new-deck.mjs <deck-dir> --style <id> | --theme <legacy-theme> | --refresh';
if (!dir) {
  console.error(usage);
  process.exit(2);
}
const deck = resolve(dir);
const index = join(deck, 'index.html');

// base.css + enhance.js come from the shared layer (or assets/legacy);
// runtime.js is the same for both
const copyRuntime = (from = join(root, 'assets')) => {
  mkdirSync(join(deck, 'assets'), { recursive: true });
  for (const f of ['base.css', 'enhance.js']) cpSync(join(from, f), join(deck, 'assets', f));
  cpSync(join(root, 'assets/runtime.js'), join(deck, 'assets/runtime.js'));
};
const copyStyle = (id) => {
  const src = join(root, 'styles', id);
  const manifest = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'));
  const dst = join(deck, 'assets/styles', id);
  mkdirSync(dst, { recursive: true });
  for (const f of ['style.css', 'manifest.json']) cpSync(join(src, f), join(dst, f));
  for (const d of manifest.assets || []) cpSync(join(src, d), join(dst, d), { recursive: true });
};
const copyLegacy = () => {
  copyRuntime(legacy);
  for (const d of ['themes', 'systems', 'textures']) cpSync(join(legacy, d), join(deck, 'assets', d), { recursive: true });
};

if (args.includes('--refresh')) {
  if (!existsSync(index)) {
    console.error(`no deck at ${index}`);
    process.exit(1);
  }
  const id = styleId(index);
  if (id) {
    copyRuntime();
    copyStyle(id);
  } else copyLegacy();
  console.log(`refreshed ${id ? `style "${id}"` : 'legacy'} runtime in ${deck}`);
  process.exit(0);
}

if (existsSync(index)) {
  console.error(`refusing to overwrite existing ${index}`);
  process.exit(1);
}
const id = opt('--style');
const theme = opt('--theme');
if (!id && !theme) {
  console.error(usage);
  process.exit(2);
}
for (const d of ['assets/img', 'assets/media']) mkdirSync(join(deck, d), { recursive: true });

if (id) {
  if (!existsSync(join(root, 'styles', id, 'manifest.json'))) {
    console.error(`unknown style "${id}": no styles/${id}/manifest.json`);
    process.exit(2);
  }
  copyRuntime();
  copyStyle(id);
  writeFileSync(index, readFileSync(join(root, 'templates/seed.html'), 'utf8').replaceAll('__STYLE__', id));
  console.log(`deck ready: ${index}`);
  console.log(`style: ${id}`);
  console.log(`next: replace <title>, then copy skeletons from styles/${id}/layouts.md into <!-- SLIDES_HERE -->`);
} else {
  // legacy: design systems and token themes share one flag
  const themeHref = existsSync(join(legacy, `systems/${theme}.css`)) ? `assets/systems/${theme}.css` : `assets/themes/${theme}.css`;
  if (!existsSync(join(legacy, themeHref.slice('assets/'.length)))) {
    console.error(`unknown theme "${theme}": no assets/legacy/themes/${theme}.css or assets/legacy/systems/${theme}.css`);
    process.exit(2);
  }
  copyLegacy();
  writeFileSync(index, readFileSync(join(legacy, 'seed.html'), 'utf8').replace('assets/themes/paper.css', themeHref));
  console.log(`legacy deck ready: ${index}`);
  console.log(`theme: ${themeHref}`);
  console.log('next: replace <title>, then copy layout skeletons from references/layouts.md into <!-- SLIDES_HERE -->');
}
console.log('after the text is final: node scripts/subset-fonts.mjs <deck-dir>  (deck-local webfont subsets)');
