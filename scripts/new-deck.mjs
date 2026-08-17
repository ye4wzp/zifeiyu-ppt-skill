// Usage: node scripts/new-deck.mjs <deck-dir> [--theme paper|graphite|forest|editorial]
// Scaffolds a self-contained deck: seed.html + every runtime asset the
// layouts can reference (themes, systems, textures, enhance layer).
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) {
  console.error('usage: node scripts/new-deck.mjs <deck-dir> [--theme paper|graphite|forest|editorial]');
  process.exit(2);
}
const ti = args.indexOf('--theme');
const theme = ti >= 0 ? args[ti + 1] : 'paper';
// design systems (assets/systems/) and token themes (assets/themes/) share one flag
const themeHref = existsSync(join(root, `assets/systems/${theme}.css`))
  ? `assets/systems/${theme}.css`
  : `assets/themes/${theme}.css`;
if (!existsSync(join(root, themeHref))) {
  console.error(`unknown theme "${theme}": no assets/themes/${theme}.css or assets/systems/${theme}.css`);
  process.exit(2);
}

const deck = resolve(dir);
const index = join(deck, 'index.html');
if (existsSync(index)) {
  console.error(`refusing to overwrite existing ${index}`);
  process.exit(1);
}

mkdirSync(join(deck, 'assets/img'), { recursive: true });
for (const f of ['base.css', 'runtime.js', 'enhance.js']) cpSync(join(root, 'assets', f), join(deck, 'assets', f));
for (const d of ['themes', 'systems', 'textures']) cpSync(join(root, 'assets', d), join(deck, 'assets', d), { recursive: true });
writeFileSync(index, readFileSync(join(root, 'templates/seed.html'), 'utf8').replace('assets/themes/paper.css', themeHref));

console.log(`deck ready: ${index}`);
console.log(`theme: ${themeHref}`);
console.log('next: replace <title>, then copy layout skeletons from references/layouts.md into <!-- SLIDES_HERE -->');
