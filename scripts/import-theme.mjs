// Usage: node scripts/import-theme.mjs <template.pptx|.potx> <theme-name>
// Corporate branding, the light route: read the template's theme1.xml
// color scheme and emit a token-only theme CSS (the design language and
// every layout stay locked). Prints a contrast report — fix the source
// colors, never the tokens' roles.
import JSZip from 'jszip';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [src, name] = process.argv.slice(2);
if (!src || !/^[a-z][a-z0-9-]*$/.test(name || '')) {
  console.error('usage: node scripts/import-theme.mjs <template.pptx|.potx> <theme-name(kebab-case)>');
  process.exit(2);
}

const zip = await JSZip.loadAsync(readFileSync(resolve(src)));
const themePart = Object.keys(zip.files).find((p) => /^ppt\/theme\/theme1\.xml$/.test(p));
if (!themePart) {
  console.error('no ppt/theme/theme1.xml in template');
  process.exit(1);
}
const xml = await zip.file(themePart).async('string');

// srgbClr val or sysClr lastClr, per scheme slot
const slot = (tag) => {
  const m = xml.match(new RegExp(`<a:${tag}>\\s*<a:(?:srgbClr val|sysClr[^>]*lastClr)="([0-9A-Fa-f]{6})"`));
  return m ? m[1].toLowerCase() : null;
};
const scheme = Object.fromEntries(['dk1', 'lt1', 'dk2', 'lt2', 'accent1'].map((k) => [k, slot(k)]));
if (!scheme.dk1 || !scheme.lt1 || !scheme.accent1) {
  console.error(`theme scheme incomplete: ${JSON.stringify(scheme)}`);
  process.exit(1);
}

const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c) => c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => hex(rgb(a).map((v, i) => v * (1 - t) + rgb(b)[i] * t));
const relLum = (h) => {
  const f = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb(h);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x);
  return ((hi + 0.05) / (lo + 0.05)).toFixed(1);
};

const bg = scheme.lt1, text1 = scheme.dk1, accent = scheme.accent1;
const tokens = {
  '--bg': `#${bg}`,
  '--surface': `#${scheme.lt2 && scheme.lt2 !== bg ? scheme.lt2 : mix(bg, text1, 0.05)}`,
  '--text-1': `#${text1}`,
  '--text-2': `#${scheme.dk2 && scheme.dk2 !== text1 ? scheme.dk2 : mix(text1, bg, 0.35)}`,
  '--accent': `#${accent}`,
  '--on-accent': `#${contrast('ffffff', accent) >= 3 ? 'ffffff' : text1}`,
  '--hairline': `#${mix(text1, bg, 0.82)}`,
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets/themes', `${name}.css`);
writeFileSync(out, `/* brand theme "${name}" — tokens extracted from ${src.split('/').pop()}
   (theme1.xml color scheme); layout geometry and type stay locked */
:root {
${Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}
`);

console.log(`written: ${out}`);
console.log('contrast report (fix source colors if below target):');
console.log(`  text-1 on bg  ${contrast(text1, bg)}:1  (target >= 4.5)`);
console.log(`  text-2 on bg  ${contrast(tokens['--text-2'].slice(1), bg)}:1  (target >= 3)`);
console.log(`  accent on bg  ${contrast(accent, bg)}:1  (target >= 3)`);
console.log('next: render the golden deck with this theme and eyeball every page');
