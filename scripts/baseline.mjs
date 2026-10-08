// Usage: node scripts/baseline.mjs
// Gate before re-recording golden baselines: every style package must
// pass check-style and every golden deck the validator — a broken render
// must never become the gold standard. Eyes-on review of the fresh PNGs
// is still on you.
import { execFileSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listGoldens } from './lib/goldens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const run = (script, args) => execFileSync('node', [join(root, 'scripts', script), ...args], { stdio: 'inherit', cwd: root });
const goldens = listGoldens(root);

for (const g of goldens) {
  try {
    if (g.style) run('check-style.mjs', [join(root, 'styles', g.style)]);
    run('validate.mjs', [g.dir]);
  } catch {
    console.error(`\nbaseline refused: ${relative(root, g.dir)} fails its gate — fix it before re-recording the gold standard`);
    process.exit(1);
  }
}
for (const g of goldens) run('render-png.mjs', [g.dir, '--out', g.baseline]);
console.log('\nbaselines re-recorded — review every PNG before committing; they ARE the gold standard now');
