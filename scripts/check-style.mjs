// Usage: node scripts/check-style.mjs <styles/<id>>
// Style-package self-check (the package, not a deck): manifest shape,
// role coverage, golden ↔ registry agreement, skeleton classes defined,
// font sources present. status "ready" makes coverage gaps errors;
// "draft" packages may ship gaps as warnings.
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROLES, CORE_ROLES } from './lib/roles.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(process.argv[2] || '.');
const errors = [];
const warns = [];
const read = (f) => readFileSync(join(dir, f), 'utf8');

if (!existsSync(join(dir, 'manifest.json'))) {
  console.log(`ERROR ${dir}: no manifest.json`);
  process.exit(1);
}
const m = JSON.parse(read('manifest.json'));
const ready = m.status === 'ready';
const gap = ready ? errors : warns;

if (m.id !== basename(dir)) errors.push(`manifest id "${m.id}" does not match directory "${basename(dir)}"`);
for (const k of ['name', 'group', 'status', 'layouts']) if (!m[k]) errors.push(`manifest missing "${k}"`);
if (m.status && !['draft', 'ready'].includes(m.status)) errors.push(`status must be draft|ready, got "${m.status}"`);

const layouts = Object.entries(m.layouts || {});
for (const [id, { role }] of layouts) {
  if (!id.startsWith(`${m.id}/`)) errors.push(`layout "${id}" must be namespaced "${m.id}/…"`);
  if (!ROLES.includes(role)) errors.push(`layout "${id}": unknown role "${role}"`);
}
const covered = new Set(layouts.map(([, l]) => l.role));
for (const r of CORE_ROLES) if (!covered.has(r)) gap.push(`no layout covers core role "${r}"`);

// golden deck and registry must describe the same set of layouts
const golden = join(dir, 'golden/index.html');
if (!existsSync(golden)) gap.push('no golden deck at golden/index.html');
else {
  const used = new Set([...readFileSync(golden, 'utf8').matchAll(/data-layout="([^"]+)"/g)].map((x) => x[1]));
  for (const [id] of layouts) if (!used.has(id)) gap.push(`layout "${id}" is registered but not used in golden`);
  for (const id of used) if (!m.layouts?.[id]) errors.push(`golden uses "${id}" which the manifest does not register`);
}

// every class a skeleton in layouts.md uses must be defined somewhere
if (!existsSync(join(dir, 'layouts.md'))) errors.push('no layouts.md');
else {
  const css = readFileSync(join(root, 'assets/base.css'), 'utf8') + (existsSync(join(dir, 'style.css')) ? read('style.css') : '');
  const defined = new Set([...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((x) => x[1]));
  const blocks = [...read('layouts.md').matchAll(/```html\n([\s\S]*?)```/g)].map((x) => x[1]).join('\n');
  const missing = new Set();
  for (const c of blocks.matchAll(/class="([^"]*)"/g)) for (const k of c[1].split(/\s+/)) if (k && !defined.has(k)) missing.add(k);
  for (const k of missing) errors.push(`layouts.md skeleton uses class "${k}" that neither base.css nor style.css defines`);
}
if (!existsSync(join(dir, 'style.css'))) errors.push('no style.css');

// font sources and listed asset dirs
const fontsSrc = join(root, 'assets/fonts-src');
for (const f of m.fonts?.web || []) {
  if (!existsSync(fontsSrc)) { warns.push('assets/fonts-src missing — run: node scripts/fetch-fonts.mjs'); break; }
  if (!existsSync(join(fontsSrc, f.src))) errors.push(`font source ${f.src} not in assets/fonts-src (add it to fetch-fonts.mjs)`);
}
for (const d of m.assets || []) if (!existsSync(join(dir, d))) errors.push(`asset dir "${d}" listed in manifest but missing`);

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\nstyle "${m.id}" (${m.status}): ${layouts.length} layouts, ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
