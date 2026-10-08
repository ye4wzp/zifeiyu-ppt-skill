import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('legacy scaffold copies the legacy design layer', () => {
  const dir = join(mkdtempSync(join(tmpdir(), 'nd-')), 'd');
  execFileSync('node', ['scripts/new-deck.mjs', dir, '--theme', 'paper']);
  assert.match(readFileSync(join(dir, 'assets/base.css'), 'utf8'), /L01–L24/);
  assert.match(readFileSync(join(dir, 'assets/enhance.js'), 'utf8'), /l07-num/);
  assert.ok(existsSync(join(dir, 'assets/themes/paper.css')));
  assert.match(readFileSync(join(dir, 'index.html'), 'utf8'), /assets\/themes\/paper\.css/);
});

test('shared base.css carries no layout geometry', () => {
  const css = readFileSync('assets/base.css', 'utf8');
  assert.doesNotMatch(css, /\.l0\d-|@font-face|is-dark/);
  assert.match(css, /data-shape="chevron"/);
});
