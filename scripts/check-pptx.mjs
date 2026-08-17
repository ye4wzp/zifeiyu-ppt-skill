// Usage: node scripts/check-pptx.mjs <deck.pptx> [--expect-slides N]
// Artifact-side gate: the HTML validator cannot see a corrupt .pptx.
// Checks OOXML package integrity — content types, relationship targets,
// XML well-formedness, slide/notes wiring, and the chart-XML mistakes
// known to make PowerPoint drop or repair the file.
import JSZip from 'jszip';
import { XMLValidator } from 'fast-xml-parser';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('usage: node scripts/check-pptx.mjs <deck.pptx> [--expect-slides N]');
  process.exit(2);
}
const ei = args.indexOf('--expect-slides');
const expectSlides = ei >= 0 ? parseInt(args[ei + 1], 10) : null;

const zip = await JSZip.loadAsync(readFileSync(file));
const parts = Object.keys(zip.files).filter((p) => !zip.files[p].dir);
const text = async (p) => zip.file(p).async('string');
const errors = [];

// 1. content types: every part must be covered by a Default or Override
if (!parts.includes('[Content_Types].xml')) {
  console.error('FATAL: no [Content_Types].xml — not an OOXML package');
  process.exit(1);
}
const ct = await text('[Content_Types].xml');
const defaults = new Set([...ct.matchAll(/<Default Extension="([^"]+)"/g)].map((m) => m[1].toLowerCase()));
const overrides = new Set([...ct.matchAll(/<Override PartName="([^"]+)"/g)].map((m) => m[1]));
for (const p of parts) {
  if (p === '[Content_Types].xml') continue;
  const ext = p.split('.').pop().toLowerCase();
  if (!defaults.has(ext) && !overrides.has('/' + p)) errors.push(`content-type missing for part ${p}`);
}

// 2. XML well-formedness for every xml/rels part
for (const p of parts.filter((p) => /\.(xml|rels)$/i.test(p))) {
  const ok = XMLValidator.validate(await text(p));
  if (ok !== true) errors.push(`malformed XML in ${p}: ${ok.err.msg}`);
}

// 3. relationship targets must exist (external links exempt)
for (const p of parts.filter((p) => p.endsWith('.rels'))) {
  const base = dirname(dirname(p)); // ppt/slides/_rels/x.rels -> ppt/slides
  for (const m of (await text(p)).matchAll(/<Relationship [^>]*>/g)) {
    const tag = m[0];
    if (/TargetMode="External"/.test(tag)) continue;
    const target = tag.match(/Target="([^"]+)"/)?.[1];
    if (!target) continue;
    const resolved = target.startsWith('/') ? target.slice(1) : join(base, target).replaceAll('\\', '/');
    if (!parts.includes(resolved)) errors.push(`${p}: relationship target "${target}" not in package`);
  }
}

// 4. presentation wiring: slide count and per-slide r:embed/r:link ids
const pres = await text('ppt/presentation.xml');
const slideCount = [...pres.matchAll(/<p:sldId /g)].length;
if (!slideCount) errors.push('presentation.xml lists no slides');
if (expectSlides != null && slideCount !== expectSlides) errors.push(`expected ${expectSlides} slides, presentation lists ${slideCount}`);
for (const p of parts.filter((p) => /^ppt\/(slides|notesSlides)\/[^_]+\.xml$/.test(p))) {
  const relsPath = `${dirname(p)}/_rels/${p.split('/').pop()}.rels`;
  const rels = parts.includes(relsPath) ? await text(relsPath) : '';
  const ids = new Set([...rels.matchAll(/Id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of (await text(p)).matchAll(/r:(?:embed|link|id)="([^"]+)"/g)) {
    if (!ids.has(m[1])) errors.push(`${p}: references relationship ${m[1]} that its rels file lacks`);
  }
}

// 5. chart parts: the axis omissions known to corrupt files
for (const p of parts.filter((p) => /^ppt\/charts\/chart\d*\.xml$/.test(p))) {
  const xml = await text(p);
  if (/<c:(bar|line|area)Chart>/.test(xml) && (!/<c:valAx>/.test(xml) || !/<c:catAx>/.test(xml)))
    errors.push(`${p}: plot area lacks valAx/catAx — PowerPoint will drop the chart`);
}

for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${parts.length} parts, ${slideCount} slides: ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
