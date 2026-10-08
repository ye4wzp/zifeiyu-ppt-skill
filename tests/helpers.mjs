import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PNG } from 'pngjs';

const root = resolve(import.meta.dirname, '..');

// Builds a throwaway style-mode deck around the given <section> markup.
export function makeDeck(slidesHtml, { style = 'fixture', extraHead = '' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'deck-'));
  mkdirSync(join(dir, 'assets/img'), { recursive: true });
  for (const f of ['base.css', 'runtime.js', 'enhance.js']) cpSync(join(root, 'assets', f), join(dir, 'assets', f));
  const src = style === 'fixture' ? join(root, 'tests/fixtures/fixture-style') : join(root, 'styles', style);
  cpSync(src, join(dir, 'assets/styles', style), { recursive: true, filter: (p) => !p.includes('/golden') });
  const png = new PNG({ width: 64, height: 40 });
  for (let i = 0; i < png.data.length; i += 4) png.data.set([200, 80, 40, 255], i);
  writeFileSync(join(dir, 'assets/img/a.png'), PNG.sync.write(png));
  writeFileSync(join(dir, 'index.html'), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>t</title>
<link rel="stylesheet" href="assets/base.css">
<link rel="stylesheet" href="assets/styles/${style}/style.css">${extraHead}
</head><body>
${slidesHtml}
<script src="assets/runtime.js"></script><script src="assets/enhance.js"></script>
</body></html>`);
  return dir;
}
