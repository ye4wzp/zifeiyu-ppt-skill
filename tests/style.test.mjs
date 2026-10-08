import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { loadStyle } from '../scripts/lib/style.mjs';
import { ROLES, CORE_ROLES, DATA_ROLES } from '../scripts/lib/roles.mjs';
import { makeDeck } from './helpers.mjs';

test('roles: 20 roles, first 12 are core, data roles subset', () => {
  assert.equal(ROLES.length, 20);
  assert.deepEqual(CORE_ROLES, ROLES.slice(0, 12));
  for (const r of DATA_ROLES) assert.ok(ROLES.includes(r));
});

test('legacy deck is detected as legacy', () => {
  assert.deepEqual(loadStyle(resolve('examples/showcase/index.html')), { mode: 'legacy' });
});

test('style deck loads manifest and sheets', () => {
  const dir = makeDeck('<section class="slide" data-layout="fixture/card" data-role="points"></section>');
  const s = loadStyle(resolve(dir, 'index.html'));
  assert.equal(s.mode, 'style');
  assert.equal(s.id, 'fixture');
  assert.equal(s.manifest.layouts['fixture/card'].role, 'points');
  assert.equal(s.sheets.length, 2);
});
