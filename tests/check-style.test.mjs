import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (dir) => spawnSync('node', ['scripts/check-style.mjs', dir], { encoding: 'utf8' });

// scratch copy of a real package, so these tests don't depend on how far it has got
const scratch = (mutate) => {
  const dir = join(mkdtempSync(join(tmpdir(), 'cs-')), 'swiss');
  cpSync('styles/swiss', dir, { recursive: true });
  const m = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  m.layouts['swiss/process'].role = 'cycle'; // leaves core role "process" uncovered
  mutate(m);
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(m));
  return dir;
};

test('draft status reports coverage gaps as warnings', () => {
  const r = run(scratch((m) => { m.status = 'draft'; }));
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /WARN .*core role "process"/);
});

test('ready status turns gaps into errors', () => {
  const dir = scratch((m) => {
    m.status = 'ready';
    m.layouts['swiss/ghost'] = { role: 'gallery' };
    m.layouts['swiss/odd'] = { role: 'nonsense' };
  });
  writeFileSync(join(dir, 'layouts.md'), readFileSync(join(dir, 'layouts.md'), 'utf8') + '\n```html\n<p class="zz-undefined">x</p>\n```\n');
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /ERROR .*core role "process"/);
  assert.match(r.stdout, /ERROR .*swiss\/ghost.*not used in golden/);
  assert.match(r.stdout, /ERROR .*unknown role "nonsense"/);
  assert.match(r.stdout, /ERROR .*class "zz-undefined"/);
});
