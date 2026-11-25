// Usage: node scripts/style-gallery.mjs
// Builds the interactive style picker shown at intake:
// - docs/styles/<id>.png (each golden's cover, 1280x720)
// - docs/styles/previews/<id>-<role>.jpg (key role previews for modal & cross-style compare)
// - docs/styles/index.html (interactive gallery: group filter, search, copy cmd, multi-slide modal & role comparator)
// - docs/styles/gallery.png (clean static overview screenshot for README / chat previews)
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs/styles');
const previewDir = join(outDir, 'previews');
mkdirSync(previewDir, { recursive: true });

const GROUPS = ['编辑排印', '商务理性', '舞台冲击', '影像叙事', '东方人文'];
const PREVIEW_ROLES = [
  { role: 'cover', label: '封面' },
  { role: 'kpi', label: '数据大字' },
  { role: 'process', label: '流程步骤' },
  { role: 'bars', label: '条形对比' },
  { role: 'closing', label: '结尾收束' },
];

const styles = readdirSync(join(root, 'styles'))
  .filter((id) => existsSync(join(root, 'styles', id, 'manifest.json')))
  .map((id) => JSON.parse(readFileSync(join(root, 'styles', id, 'manifest.json'), 'utf8')))
  .sort((a, b) => (a.letter || 'Z').localeCompare(b.letter || 'Z'));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });

const stylePreviews = {};
for (const s of styles) {
  const golden = join(root, 'styles', s.id, 'golden/index.html');
  stylePreviews[s.id] = {};
  if (!existsSync(golden)) continue;
  await page.goto('file://' + golden + '?flat=1');
  await page.evaluate(() => document.fonts.ready);

  const firstSlide = page.locator('.slide').first();
  await firstSlide.screenshot({ path: join(outDir, `${s.id}.png`) });

  for (const { role } of PREVIEW_ROLES) {
    const loc = page.locator(`.slide[data-role="${role}"]`).first();
    if ((await loc.count()) > 0) {
      const rel = `previews/${s.id}-${role}.jpg`;
      await loc.screenshot({ path: join(outDir, rel), type: 'jpeg', quality: 84 });
      stylePreviews[s.id][role] = rel;
    }
  }
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const layoutCount = (s) => Object.keys(s.layouts || {}).length;

const card = (s) => {
  const cmd = `node scripts/new-deck.mjs my-deck --style ${s.id}`;
  const rec = (s.recommend || []).join(' / ');
  return `
      <figure class="card" data-id="${esc(s.id)}" data-group="${esc(s.group)}" data-search="${esc(`${s.letter || ''} ${s.id} ${s.name} ${s.group} ${rec}`).toLowerCase()}">
        <div class="thumb" data-open="${esc(s.id)}" title="点击预览多页金样">
          ${existsSync(join(outDir, `${s.id}.png`)) ? `<img src="${s.id}.png" alt="${esc(s.name)} 封面" loading="lazy">` : '<div class="empty">金样待补</div>'}
          <span class="thumb-hint">查看多页金样 ↗</span>
        </div>
        <figcaption>
          <div class="card-top">
            <p class="name"><b>${esc(s.letter || '')}</b>${esc(s.name)}${s.status === 'draft' ? '<span class="badge">draft</span>' : ''}</p>
            <span class="count">${layoutCount(s)} 版式</span>
          </div>
          <p class="meta">${esc(rec)}</p>
          <div class="cmd-row">
            <code>--style ${esc(s.id)}</code>
            <button class="copy-btn" type="button" data-copy="${esc(cmd)}">复制命令</button>
          </div>
        </figcaption>
      </figure>`;
};

const activeGroups = GROUPS.filter((g) => styles.some((s) => s.group === g));
const sections = activeGroups
  .map((g) => [g, styles.filter((s) => s.group === g)])
  .map(([g, list]) => `
    <section class="group-section" data-group="${esc(g)}">
      <h2>${esc(g)} <span class="g-count">${list.length}</span></h2>
      <div class="grid">${list.map(card).join('')}
      </div>
    </section>`).join('');

const galleryData = styles.map((s) => ({
  id: s.id,
  letter: s.letter || '',
  name: s.name,
  group: s.group,
  status: s.status,
  recommend: s.recommend || [],
  layoutCount: layoutCount(s),
  roles: [...new Set(Object.values(s.layouts || {}).map((l) => l.role))],
  previews: stylePreviews[s.id] || {},
}));

writeFileSync(join(outDir, 'index.html'), `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>风格画廊 · zifeiyu-ppt-skill</title>
<style>
  :root { --bg: #f4f3ef; --card: #ffffff; --text: #16161a; --muted: #6b6b73; --line: #e2e0d9; --accent: #2251ff; --accent-bg: #eef2ff; --badge: #8a5a00; --badge-bg: #fff1c2; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #18181b; --card: #232327; --text: #f0efea; --muted: #a3a3ab; --line: #34343b; --accent: #7aa2ff; --accent-bg: #1f2842; --badge: #ffd36b; --badge-bg: #3a2f12; }
  }
  * { box-sizing: border-box; margin: 0; }
  body { background: var(--bg); color: var(--text); font: 15px/1.6 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; padding: 36px clamp(16px, 4vw, 56px) 64px; }
  header { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
  h1 { font-size: 28px; letter-spacing: -0.02em; }
  .lead { color: var(--muted); margin-top: 4px; }
  .toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; margin-bottom: 28px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
  .pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .pill { appearance: none; border: 1px solid var(--line); background: var(--card); color: var(--text); padding: 6px 14px; border-radius: 999px; font: 500 13px/1.2 inherit; cursor: pointer; transition: .15s; }
  .pill:hover { border-color: var(--accent); }
  .pill.active { background: var(--text); color: var(--bg); border-color: var(--text); }
  .controls { display: flex; gap: 10px; align-items: center; }
  .search { border: 1px solid var(--line); background: var(--card); color: var(--text); padding: 7px 12px; border-radius: 8px; font: 13px inherit; width: 220px; }
  .mode-btn { appearance: none; border: 1px solid var(--accent); background: var(--accent-bg); color: var(--accent); padding: 7px 14px; border-radius: 8px; font: 600 13px/1.2 inherit; cursor: pointer; }
  .mode-btn.active { background: var(--accent); color: #fff; }
  section.group-section { margin-bottom: 34px; }
  h2 { font-size: 18px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .g-count { font-size: 12px; color: var(--muted); font-weight: 500; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 18px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; transition: transform .18s, box-shadow .18s; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); }
  .thumb { position: relative; cursor: pointer; overflow: hidden; }
  .thumb img, .empty { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
  .empty { display: grid; place-items: center; color: var(--muted); background: var(--line); }
  .thumb-hint { position: absolute; right: 10px; bottom: 10px; background: rgba(16,16,20,.78); color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 999px; opacity: 0; transition: opacity .15s; }
  .thumb:hover .thumb-hint { opacity: 1; }
  figcaption { padding: 12px 14px 14px; }
  .card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .name { font-weight: 600; }
  .name b { font-family: "SF Mono", Menlo, monospace; margin-right: 8px; color: var(--accent); }
  .count { font-size: 12px; color: var(--muted); white-space: nowrap; }
  .badge { font: 600 11px/1 "SF Mono", Menlo, monospace; color: var(--badge); background: var(--badge-bg); padding: 3px 6px; border-radius: 4px; margin-left: 8px; vertical-align: 2px; }
  .meta { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .cmd-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
  code { font-family: "SF Mono", Menlo, monospace; font-size: 12px; color: var(--muted); }
  .copy-btn { appearance: none; border: 1px solid var(--line); background: transparent; color: var(--text); font: 500 12px/1 inherit; padding: 5px 10px; border-radius: 6px; cursor: pointer; }
  .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
  .compare-view { display: none; }
  .compare-view.active { display: block; }
  .compare-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .compare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr)); gap: 18px; }
  .modal-bg { position: fixed; inset: 0; background: rgba(12,12,16,.76); display: none; place-items: center; padding: 24px; z-index: 100; }
  .modal-bg.open { display: grid; }
  .modal { background: var(--card); color: var(--text); border: 1px solid var(--line); border-radius: 14px; width: min(1040px, 100%); max-height: 90vh; overflow: auto; padding: 22px 24px 26px; }
  .modal-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .modal-close { appearance: none; border: 1px solid var(--line); background: transparent; color: var(--text); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 16px; }
  .modal-slides { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: 14px; margin-top: 14px; }
  .modal-slide { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--bg); }
  .modal-slide img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
  .modal-slide span { display: block; padding: 6px 10px; font-size: 12px; color: var(--muted); }
  body.is-snapshot .toolbar, body.is-snapshot .copy-btn, body.is-snapshot .thumb-hint { display: none !important; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <header>
    <div>
      <h1>风格画廊</h1>
      <p class="lead">${styles.length} 套已交付风格 · 每种风格一套独立版式 · 选定后执行 <code>node scripts/new-deck.mjs &lt;deck&gt; --style &lt;id&gt;</code></p>
    </div>
  </header>

  <div class="toolbar">
    <div class="pills" id="groupPills">
      <button class="pill active" type="button" data-filter="all">全部 (${styles.length})</button>
      ${activeGroups.map((g) => `<button class="pill" type="button" data-filter="${esc(g)}">${esc(g)}</button>`).join('')}
    </div>
    <div class="controls">
      <input class="search" id="searchInput" type="search" placeholder="按场合或名称筛选（如 汇报 / 路演）">
      <button class="mode-btn" id="compareToggle" type="button">同内容跨风格对比</button>
    </div>
  </div>

  <div id="galleryView">${sections}</div>

  <div class="compare-view" id="compareView">
    <div class="compare-bar" id="rolePills">
      ${PREVIEW_ROLES.map((r, i) => `<button class="pill${i === 0 ? ' active' : ''}" type="button" data-role="${esc(r.role)}">${esc(r.label)} (${esc(r.role)})</button>`).join('')}
    </div>
    <div class="compare-grid" id="compareGrid"></div>
  </div>

  <div class="modal-bg" id="modalBg">
    <div class="modal">
      <div class="modal-head">
        <div>
          <h2 id="modalTitle" style="margin:0;"></h2>
          <p class="meta" id="modalMeta"></p>
        </div>
        <button class="modal-close" id="modalClose" type="button" aria-label="关闭">✕</button>
      </div>
      <div class="cmd-row" style="margin-top:0;padding-top:0;border-top:none;">
        <code id="modalCmd"></code>
        <button class="copy-btn" id="modalCopy" type="button">复制建稿命令</button>
      </div>
      <div class="modal-slides" id="modalSlides"></div>
    </div>
  </div>

<script>
const STYLES = ${JSON.stringify(galleryData)};
const ROLES = ${JSON.stringify(PREVIEW_ROLES)};
if (new URLSearchParams(location.search).get('snapshot') === '1') document.body.classList.add('is-snapshot');

let activeGroup = 'all';
let compareMode = false;
let activeRole = 'cover';

function applyFilter() {
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  document.querySelectorAll('.card').forEach((card) => {
    const okGroup = activeGroup === 'all' || card.dataset.group === activeGroup;
    const okQuery = !q || (card.dataset.search || '').includes(q);
    card.classList.toggle('hidden', !(okGroup && okQuery));
  });
  document.querySelectorAll('.group-section').forEach((sec) => {
    const visible = sec.querySelectorAll('.card:not(.hidden)').length;
    sec.classList.toggle('hidden', visible === 0);
  });
}

document.getElementById('groupPills').addEventListener('click', (e) => {
  const btn = e.target.closest('.pill');
  if (!btn) return;
  activeGroup = btn.dataset.filter;
  document.querySelectorAll('#groupPills .pill').forEach((b) => b.classList.toggle('active', b === btn));
  applyFilter();
});

document.getElementById('searchInput').addEventListener('input', applyFilter);

function renderCompare() {
  const grid = document.getElementById('compareGrid');
  grid.innerHTML = STYLES.filter((s) => s.previews[activeRole]).map((s) => \`
    <figure class="card">
      <div class="thumb" data-open="\${s.id}"><img src="\${s.previews[activeRole]}" alt="\${s.name}"></div>
      <figcaption>
        <div class="card-top"><p class="name"><b>\${s.letter}</b>\${s.name}</p><span class="count">\${s.group}</span></div>
        <p class="meta"><code>--style \${s.id}</code> · \${s.recommend.join(' / ')}</p>
      </figcaption>
    </figure>\`).join('');
}

document.getElementById('compareToggle').addEventListener('click', (e) => {
  compareMode = !compareMode;
  e.currentTarget.classList.toggle('active', compareMode);
  document.getElementById('galleryView').classList.toggle('hidden', compareMode);
  document.getElementById('compareView').classList.toggle('active', compareMode);
  if (compareMode) renderCompare();
});

document.getElementById('rolePills').addEventListener('click', (e) => {
  const btn = e.target.closest('.pill');
  if (!btn) return;
  activeRole = btn.dataset.role;
  document.querySelectorAll('#rolePills .pill').forEach((b) => b.classList.toggle('active', b === btn));
  renderCompare();
});

function copyText(btn, text) {
  navigator.clipboard?.writeText(text).then(() => {
    const prev = btn.textContent;
    btn.textContent = '已复制 ✓';
    setTimeout(() => { btn.textContent = prev; }, 1400);
  });
}

function openModal(id) {
  const s = STYLES.find((x) => x.id === id);
  if (!s) return;
  const cmd = \`node scripts/new-deck.mjs my-deck --style \${s.id}\`;
  document.getElementById('modalTitle').textContent = \`\${s.letter} \${s.name}\`;
  document.getElementById('modalMeta').textContent = \`\${s.group} · \${s.layoutCount} 个注册版式 · 适用：\${s.recommend.join(' / ')}\`;
  document.getElementById('modalCmd').textContent = cmd;
  document.getElementById('modalCopy').onclick = (ev) => copyText(ev.currentTarget, cmd);
  document.getElementById('modalSlides').innerHTML = ROLES.filter((r) => s.previews[r.role]).map((r) => \`
    <div class="modal-slide">
      <img src="\${s.previews[r.role]}" alt="\${s.name} \${r.label}">
      <span>\${r.label} · data-role="\${r.role}"</span>
    </div>\`).join('');
  document.getElementById('modalBg').classList.add('open');
}

document.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.copy-btn[data-copy]');
  if (copyBtn) { copyText(copyBtn, copyBtn.dataset.copy); return; }
  const openEl = e.target.closest('[data-open]');
  if (openEl) { openModal(openEl.dataset.open); return; }
  if (e.target.id === 'modalBg' || e.target.id === 'modalClose') {
    document.getElementById('modalBg').classList.remove('open');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('modalBg').classList.remove('open');
});
</script>
</body>
</html>
`);

await page.setViewportSize({ width: 1400, height: 900 });
await page.goto('file://' + join(outDir, 'index.html') + '?snapshot=1');
await page.screenshot({ path: join(outDir, 'gallery.png'), fullPage: true });
await browser.close();
console.log(`gallery: ${styles.length} styles -> ${outDir}`);
