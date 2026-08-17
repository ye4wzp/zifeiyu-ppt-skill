// Usage: node scripts/diff.mjs <dirA> <dirB> [--out <diff-dir>] [--threshold 0.1] [--max-pct 0.5]
// Pixel regression gate: pairs *.png by filename, exits 1 on any mismatch.
// Compare renders of the same machine only — cross-OS font rasterization differs.
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
};
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const [dirA, dirB] = positional;
if (!dirA || !dirB) {
  console.error('usage: node scripts/diff.mjs <dirA> <dirB> [--out <diff-dir>] [--threshold 0.1] [--max-pct 0.5]');
  process.exit(2);
}
const outDir = flag('--out', null);
const threshold = parseFloat(flag('--threshold', '0.1'));   // pixelmatch per-pixel sensitivity
const maxPct = parseFloat(flag('--max-pct', '0.5'));        // % of differing pixels tolerated per page

const list = (d) => readdirSync(d).filter((f) => f.endsWith('.png')).sort();
const A = list(dirA), B = new Set(list(dirB));
let fail = false;

for (const f of list(dirB)) if (!A.includes(f)) { console.log(`EXTRA ${f}: only in ${dirB}`); fail = true; }
for (const f of A) {
  if (!B.has(f)) { console.log(`MISSING ${f}: only in ${dirA}`); fail = true; continue; }
  const a = PNG.sync.read(readFileSync(join(dirA, f)));
  const b = PNG.sync.read(readFileSync(join(dirB, f)));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`SIZE ${f}: ${a.width}x${a.height} vs ${b.width}x${b.height}`);
    fail = true;
    continue;
  }
  const diff = outDir ? new PNG({ width: a.width, height: a.height }) : null;
  const n = pixelmatch(a.data, b.data, diff?.data, a.width, a.height, { threshold });
  const pct = (n / (a.width * a.height)) * 100;
  const bad = pct > maxPct;
  if (bad && outDir) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, f), PNG.sync.write(diff));
  }
  console.log(`${bad ? 'FAIL' : 'ok  '} ${f}: ${pct.toFixed(2)}% differ`);
  if (bad) fail = true;
}
process.exit(fail ? 1 : 0);
