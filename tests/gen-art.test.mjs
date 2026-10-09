import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const gen = (kind) => {
  const dir = mkdtempSync(join(tmpdir(), 'art-'));
  execFileSync('node', ['scripts/gen-art.mjs', dir, '--style', 'swiss', '--kind', kind, '--seed', '7', '--count', '2', '--size', '400x250']);
  return readdirSync(dir).sort().map((f) => createHash('sha1').update(readFileSync(join(dir, f))).digest('hex'));
};

test('same seed -> identical pixels; different seeds differ', () => {
  for (const kind of ['field', 'arch', 'light', 'horizon']) {
    const a = gen(kind), b = gen(kind);
    assert.equal(a.length, 2);
    assert.deepEqual(a, b);
    assert.notEqual(a[0], a[1]);
  }
});

test('--format jpg writes JPEG files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'art-'));
  execFileSync('node', ['scripts/gen-art.mjs', dir, '--style', 'swiss', '--kind', 'field', '--seed', '3', '--size', '200x120', '--format', 'jpg']);
  assert.deepEqual(readdirSync(dir), ['field-3.jpg']);
  assert.deepEqual([...readFileSync(join(dir, 'field-3.jpg')).subarray(0, 3)], [0xff, 0xd8, 0xff]);
});
