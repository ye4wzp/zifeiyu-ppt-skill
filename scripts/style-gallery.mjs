// Usage: node scripts/style-gallery.mjs
// Builds the style picker shown at intake: docs/styles/<id>.png (each
// golden's cover), docs/styles/index.html (cards grouped by use) and
// docs/styles/gallery.png (the whole page, for README / chat previews).
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/styles');
mkdirSync(outDir, { recursive: true });

const GROUPS = ['编辑排印', '商务理性', '舞台冲击', '影像叙事', '东方人文'];
const styles = readdirSync(join(root, 'styles'))
  .filter((id) => existsSync(join(root, 'styles', id, 'manifest.json')))
  .map((id) => JSON.parse(readFileSync(join(root, 'styles', id, 'manifest.json'), 'utf8')))
  .sort((a, b) => (a.letter || 'Z').localeCompare(b.letter || 'Z'));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
for (const s of styles) {
  const golden = join(root, 'styles', s.id, 'golden/index.html');
  if (!existsSync(golden)) continue;
  await page.goto('file://' + golden + '?flat=1');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.slide').first().screenshot({ path: join(outDir, `${s.id}.png`) });
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const card = (s) => `
      <figure class="card">
        ${existsSync(join(outDir, `${s.id}.png`)) ? `<img src="${s.id}.png" alt="${esc(s.name)} 封面">` : '<div class="empty">金样待补</div>'}
        <figcaption>
          <p class="name"><b>${esc(s.letter || '')}</b>${esc(s.name)}${s.status === 'draft' ? '<span class="badge">draft</span>' : ''}</p>
          <p class="meta"><code>--style ${esc(s.id)}</code> · ${esc((s.recommend || []).join(' / '))}</p>
        </figcaption>
      </figure>`;
const sections = GROUPS.map((g) => [g, styles.filter((s) => s.group === g)])
  .filter(([, list]) => list.length)
  .map(([g, list]) => `
    <section>
      <h2>${g}</h2>
      <div class="grid">${list.map(card).join('')}
      </div>
    </section>`).join('');

writeFileSync(join(outDir, 'index.html'), `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>风格画廊</title>
<style>
  :root { --bg: #f4f3ef; --card: #ffffff; --text: #16161a; --muted: #6b6b73; --line: #e2e0d9; --badge: #8a5a00; --badge-bg: #fff1c2; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #18181b; --card: #232327; --text: #f0efea; --muted: #a3a3ab; --line: #34343b; --badge: #ffd36b; --badge-bg: #3a2f12; }
  }
  * { box-sizing: border-box; margin: 0; }
  body { background: var(--bg); color: var(--text); font: 15px/1.6 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; padding: 40px clamp(16px, 4vw, 56px); }
  h1 { font-size: 28px; }
  .lead { color: var(--muted); margin: 6px 0 32px; }
  section { margin-bottom: 36px; }
  h2 { font-size: 18px; margin-bottom: 14px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 18px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  .card img, .empty { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
  .empty { display: grid; place-items: center; color: var(--muted); background: var(--line); }
  figcaption { padding: 12px 14px 14px; }
  .name { font-weight: 600; }
  .name b { font-family: "SF Mono", Menlo, monospace; margin-right: 8px; }
  .badge { font: 600 11px/1 "SF Mono", Menlo, monospace; color: var(--badge); background: var(--badge-bg); padding: 3px 6px; border-radius: 4px; margin-left: 8px; vertical-align: 2px; }
  .meta { color: var(--muted); font-size: 13px; margin-top: 4px; }
  code { font-family: "SF Mono", Menlo, monospace; }
</style>
</head>
<body>
  <h1>风格画廊</h1>
  <p class="lead">每种风格一套独立版式。选定后：<code>node scripts/new-deck.mjs &lt;deck&gt; --style &lt;id&gt;</code></p>${sections}
</body>
</html>
`);

await page.setViewportSize({ width: 1400, height: 900 });
await page.goto('file://' + join(outDir, 'index.html'));
await page.screenshot({ path: join(outDir, 'gallery.png'), fullPage: true });
await browser.close();
console.log(`gallery: ${styles.length} styles -> ${outDir}`);
