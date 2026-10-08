// Usage: node scripts/baseline.mjs
// Gate before re-recording golden baselines: every golden deck must pass
// the validator first — a broken render must never become the gold
// standard. Eyes-on review of the fresh PNGs is still on you.
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GOLDENS = [
  ['examples/showcase', 'baselines/showcase'],
  ['examples/editorial', 'baselines/editorial'],
  ['examples/media', 'baselines/media'],
  ['styles/swiss/golden', 'baselines/styles/swiss'],
];
const run = (script, args) => execFileSync('node', [join(root, 'scripts', script), ...args], { stdio: 'inherit', cwd: root });

for (const [d] of GOLDENS) {
  try {
    run('validate.mjs', [join(root, d)]);
  } catch {
    console.error(`\nbaseline refused: ${d} fails validation — fix it before re-recording the gold standard`);
    process.exit(1);
  }
}
for (const [d, out] of GOLDENS) run('render-png.mjs', [join(root, d), '--out', join(root, out)]);
console.log('\nbaselines re-recorded — review every PNG before committing; they ARE the gold standard now');
