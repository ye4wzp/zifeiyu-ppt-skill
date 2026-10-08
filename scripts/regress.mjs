// Usage: node scripts/regress.mjs
// Same-machine pixel regression: re-render every golden (legacy examples
// and styles/*/golden) and diff it against its recorded baseline.
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listGoldens } from './lib/goldens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const run = (script, args) => execFileSync('node', [join(root, 'scripts', script), ...args], { stdio: 'inherit', cwd: root });

let failed = 0;
for (const g of listGoldens(root)) {
  const tag = g.name.replaceAll('/', '-');
  run('render-png.mjs', [g.dir, '--out', join(root, '.regress', tag)]);
  try {
    run('diff.mjs', [g.baseline, join(root, '.regress', tag), '--out', join(root, '.regress', `diff-${tag}`)]);
  } catch {
    failed++;
  }
}
if (failed) {
  console.error(`\n${failed} golden(s) drifted from their baselines`);
  process.exit(1);
}
