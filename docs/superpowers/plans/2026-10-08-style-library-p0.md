# 风格库 P0 平台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把项目从「一套 base.css 版式 + token 主题」改造成「风格包（独立版式集）+ 角色层」平台，并把现有 swiss 系统原样迁成第一个风格包，像素回归≈0%。

**Architecture:** deck 通过 `<link href="assets/styles/<id>/style.css">` 声明风格；`scripts/lib/style.mjs` 据此识别 style 模式并加载 manifest，校验器 / 导出器 / 字体子集按 manifest 工作；未声明风格的 deck 走 legacy 模式（旧规则原样保留），过渡期两种模式并存。测量层 `deck.mjs` 新增圆角 / 描边 / 阴影 / 旋转 / 竖排 / 写在骨架上的 merge·anim·raster·role 声明，导出器把它们映射到 pptxgenjs 原生能力，不可映射的元素单独截图嵌入。

**Tech Stack:** Node 22 ESM、Playwright（Chromium）、pptxgenjs 4.0.1、jszip、pngjs、subset-font；测试用 Node 内置 `node --test`（不新增依赖）。

**Spec:** `docs/superpowers/specs/2026-10-08-style-library-design.md`

## Global Constraints

- 画布 1280×720 px，px→pt ×0.75，px→in ÷96（`scripts/lib/deck.mjs` 的 `CANVAS / px2in / px2pt`）。
- 文字永远导出为原生可编辑文本框；圆角 / 描边 / 阴影 / 旋转 / 截图嵌入只作用于形状和图片。
- 所有文字在 `h1/h2/h3/p` 内；装饰只挂 `[data-shape]`；deck 内无 `<style>` 标签、无裸色值。
- style 模式样式表：`assets/base.css` + 恰好一个 `assets/styles/<id>/style.css` + 可选 `assets/brand.css`。
- 角色表固定 20 个：cover agenda section statement kpi compare points process timeline image image-text closing bars table gallery cycle matrix system video audio；核心 12 个为前 12 个。
- 数据角色 `kpi / bars / table` 必须有出处（`data-source` 文本）。
- legacy 模式（`examples/showcase|editorial|media|v2-lab`、`decks/*`）行为不变。
- 依赖不新增；字体许可只用 OFL。
- 提交信息结尾带 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`。

## File Structure

| 文件 | 职责 |
|---|---|
| `scripts/lib/roles.mjs`（新） | 角色常量：`ROLES` / `CORE_ROLES` / `DATA_ROLES` |
| `scripts/lib/style.mjs`（新） | `loadStyle(indexPath)`：识别 legacy / style 模式，加载 manifest，给出样式表路径 |
| `scripts/lib/deck.mjs`（改） | 测量扩展 + 每个元素打 `data-mid` 便于导出定位 |
| `scripts/lib/snapshot.mjs`（新） | `snapshotEl(page, mid, file, {unrotate})`：隐藏同页其他元素后单独截图 |
| `scripts/export-pptx.mjs`（改） | 新形状 / 描边 / 阴影 / 旋转 / 竖排 / 截图嵌入 / 通用 merge / 按角色原生图表 / manifest 字体 |
| `scripts/validate.mjs`（改） | style 模式 R1 / R2 / R6 / R8 / R12 + 新 R16（导出一致性）；R3 / R5 / R9 用旋转外框 |
| `scripts/check-style.mjs`（新） | 风格包自检 |
| `scripts/gen-art.mjs`（新） | 确定性抽象配图 |
| `scripts/style-gallery.mjs`（新） | 风格画廊 `docs/styles/` |
| `scripts/regress.mjs`（新） | 取代 package.json 里的长串 regress 命令，覆盖 legacy 金样 + 风格金样 |
| `scripts/baseline.mjs` / `new-deck.mjs` / `subset-fonts.mjs` / `sync-skill.mjs`（改） | 风格包感知 |
| `assets/base.css`（重写） | 所有风格共用底座 |
| `assets/legacy/`（新，迁入） | 旧 base.css / themes / systems / textures / seed |
| `assets/enhance.js`（重写） | `data-anim` 通用配方 + `data-media` 通用媒体钩子 |
| `templates/seed.html`（改） | style 模式种子；旧种子移到 `assets/legacy/seed.html` |
| `styles/swiss/`（新） | 迁移后的瑞士风格包：style.css / manifest.json / layouts.md / textures / golden |
| `references/roles.md`（新） | 角色表 + 内容形状→角色决策表 + 骨架声明属性说明 |
| `tests/`（新） | `helpers.mjs` + 各模块测试 + `fixtures/fixture-style/` |
| `SKILL.md` / `ARCHITECTURE.md` / `references/pptx-export.md` / CI（改） | 文档与流水线 |

---

### Task 1: 测试脚手架 + 角色常量 + 风格识别

**Files:**
- Create: `scripts/lib/roles.mjs`, `scripts/lib/style.mjs`, `tests/helpers.mjs`, `tests/style.test.mjs`, `tests/fixtures/fixture-style/manifest.json`, `tests/fixtures/fixture-style/style.css`
- Modify: `package.json`（加 `"test": "node --test tests/"`）

**Interfaces:**
- Produces: `ROLES: string[]`, `CORE_ROLES: string[]`, `DATA_ROLES: string[]`；`loadStyle(indexPath) -> { mode:'legacy' } | { mode:'style', id, dir, manifest, sheets:string[] }`（`dir` = deck 内 `assets/styles/<id>` 绝对路径，`sheets` = 实际链接的样式表绝对路径）；`makeDeck(slidesHtml, {style='fixture', extraHead=''}) -> deckDir`（临时目录，复制根 `assets/base.css|runtime.js|enhance.js` + `tests/fixtures/fixture-style/*` 到 `assets/styles/fixture/`）

- [ ] **Step 1: 写失败测试** `tests/style.test.mjs`

```js
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
```

- [ ] **Step 2: 跑测试确认失败** — `node --test tests/style.test.mjs` → FAIL（模块不存在）
- [ ] **Step 3: 实现**

`scripts/lib/roles.mjs`:
```js
// Fixed role vocabulary shared by every style: layouts declare one via
// data-role; the content-shape decision table and data-honesty rules key on it.
export const ROLES = [
  'cover', 'agenda', 'section', 'statement', 'kpi', 'compare',
  'points', 'process', 'timeline', 'image', 'image-text', 'closing',
  'bars', 'table', 'gallery', 'cycle', 'matrix', 'system', 'video', 'audio',
];
export const CORE_ROLES = ROLES.slice(0, 12);
export const DATA_ROLES = ['kpi', 'bars', 'table'];
```

`scripts/lib/style.mjs`:
```js
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const STYLE_LINK = /<link[^>]+href="assets\/styles\/([\w-]+)\/style\.css"/;

// A deck is in style mode when it links assets/styles/<id>/style.css;
// anything else is a legacy (pre-style-library) deck with the old rules.
export function loadStyle(indexPath) {
  const html = readFileSync(indexPath, 'utf8');
  const m = html.match(STYLE_LINK);
  if (!m) return { mode: 'legacy' };
  const deckDir = dirname(indexPath);
  const dir = resolve(deckDir, 'assets/styles', m[1]);
  const manifestPath = resolve(dir, 'manifest.json');
  if (!existsSync(manifestPath)) throw new Error(`style "${m[1]}": missing ${manifestPath}`);
  const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
    .map((l) => resolve(deckDir, l[1]))
    .filter(existsSync);
  return { mode: 'style', id: m[1], dir, manifest: JSON.parse(readFileSync(manifestPath, 'utf8')), sheets };
}
```

`tests/helpers.mjs`:
```js
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
```

`tests/fixtures/fixture-style/manifest.json`:
```json
{
  "id": "fixture",
  "name": "测试夹具",
  "status": "draft",
  "assets": [],
  "fonts": { "web": [], "office": { "PingFang SC": "Microsoft YaHei" } },
  "layouts": {
    "fixture/card": { "role": "points" },
    "fixture/kpi": { "role": "kpi" },
    "fixture/bars": { "role": "bars" },
    "fixture/vertical": { "role": "statement" }
  }
}
```

`tests/fixtures/fixture-style/style.css`（夹具覆盖 P0 全部新原语，几何写在 class 里）:
```css
:root { --bg: #f3f4f6; --surface: #ffffff; --text-1: #111827; --text-2: #6b7280; --accent: #ff6b2c; --on-accent: #ffffff; --hairline: #e5e7eb; }
.fx-card { left: 80px; top: 200px; width: 360px; height: 240px; background: var(--surface); border: 2px solid var(--accent); border-radius: 24px; box-shadow: 0 12px 32px rgba(17, 24, 39, 0.12); }
.fx-chev { left: 480px; top: 200px; width: 300px; height: 72px; background: var(--accent); --tip: 36px; }
.fx-tilt { left: 840px; top: 200px; width: 240px; height: 160px; background: var(--hairline); rotate: -6deg; }
.fx-photo { left: 840px; top: 420px; width: 240px; height: 160px; object-fit: cover; border-radius: 12px; filter: grayscale(1); }
.fx-grad { left: 480px; top: 320px; width: 300px; height: 120px; background: linear-gradient(90deg, var(--accent), var(--surface)); }
.fx-h { left: 112px; top: 232px; width: 296px; font-size: 28px; line-height: 1.3; font-weight: 600; color: var(--text-1); }
.fx-p { left: 112px; top: 284px; width: 296px; font-size: 16px; line-height: 1.6; color: var(--text-2); }
.fx-vert { left: 1100px; top: 120px; width: 60px; height: 400px; font-size: 40px; line-height: 1.2; color: var(--text-1); writing-mode: vertical-rl; text-orientation: mixed; }
.fx-num { left: 80px; top: 200px; width: 400px; font-size: 120px; line-height: 1; color: var(--text-1); }
.fx-src { left: 80px; top: 640px; width: 800px; font-size: 16px; color: var(--text-2); }
.fx-bar { left: 300px; height: 36px; background: var(--accent); }
.fx-label { left: 80px; width: 200px; font-size: 20px; color: var(--text-1); }
```

- [ ] **Step 4: 跑测试确认通过** — `node --test tests/style.test.mjs` → PASS（`makeDeck` 依赖根 `assets/enhance.js` 已存在，legacy 版即可）
- [ ] **Step 5: Commit** — `git add scripts/lib/roles.mjs scripts/lib/style.mjs tests package.json && git commit -m "Style mode detection, role vocabulary, node:test harness"`

---

### Task 2: 测量层扩展

**Files:**
- Modify: `scripts/lib/deck.mjs`
- Test: `tests/measure.test.mjs`

**Interfaces:**
- Consumes: `makeDeck`
- Produces（每个元素新增字段，全部种类通用）：`mid:string`（`"<slide>-<n>"`，同时写到 DOM `data-mid`）、`bbox:{x,y,w,h}`（旋转后外框）、`x/y/w/h`（**未旋转**盒，以外框中心为中心）、`rotate:number`（deg）、`merge:string|null`、`anim:string|null`、`raster:boolean`、`source:boolean`（`data-source`）；shape 额外：`radius:number`（px）、`border:{width,color}|null`、`shadow:{x,y,blur,color}|null`、`tip:number|null`（`--tip` px）、`value:number|null`、`label:string|null`；image 额外：`radius`、`filter:boolean`；text 额外：`vertical:boolean`、`chart:boolean`（`data-chart`）、`textBox:{bg:boolean, border:boolean, shadow:boolean, padding:boolean}`；slide 额外：`role:string`。`measureDeck` 返回值不变（`{browser, page, slides, doc}`）。

- [ ] **Step 1: 写失败测试** `tests/measure.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { measureDeck } from '../scripts/lib/deck.mjs';
import { makeDeck } from './helpers.mjs';

const deck = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-card" data-shape="rect"></div>
  <h3 class="fx-h" data-merge="a" data-anim="rise">标题</h3>
  <p class="fx-p" data-merge="a">说明文字</p>
  <div class="fx-chev" data-shape="chevron"></div>
  <div class="fx-tilt" data-shape="rect"></div>
  <img class="fx-photo" src="assets/img/a.png" alt="示意图">
  <div class="fx-grad" data-shape="rect" data-raster></div>
  <p class="fx-vert">竖排 AI 文字</p>
</section>`);

test('measures new primitives', async () => {
  const { browser, slides } = await measureDeck(resolve(deck, 'index.html'));
  await browser.close();
  const s = slides[0];
  assert.equal(s.role, 'points');
  const [card, h, p, chev, tilt, photo, grad, vert] = s.els;
  assert.equal(card.radius, 24);
  assert.deepEqual(card.border.width, 2);
  assert.equal(card.border.color.hex, 'ff6b2c');
  assert.equal(card.shadow.y, 12);
  assert.equal(card.shadow.blur, 32);
  assert.ok(Math.abs(card.shadow.color.alpha - 0.12) < 0.01);
  assert.equal(h.merge, 'a'); assert.equal(p.merge, 'a'); assert.equal(h.anim, 'rise');
  assert.equal(chev.shape, 'chevron'); assert.equal(chev.tip, 36);
  assert.equal(tilt.rotate, -6);
  assert.equal(Math.round(tilt.w), 240); assert.equal(Math.round(tilt.x), 840); // unrotated box
  assert.ok(tilt.bbox.w > 240);                                                // rotated hull
  assert.equal(photo.radius, 12); assert.equal(photo.filter, true);
  assert.equal(grad.raster, true);
  assert.equal(vert.vertical, true);
  assert.match(card.mid, /^0-\d+$/);
});
```

- [ ] **Step 2: 跑测试确认失败** — `node --test tests/measure.test.mjs` → FAIL（`s.role` undefined）
- [ ] **Step 3: 实现**（在 `deck.mjs` 的 `page.evaluate` 内）

在 `parseColor` 旁加：
```js
const px = (v) => parseFloat(v) || 0;
const parseShadow = (v) => {
  if (!v || v === 'none') return null;
  const color = v.match(/rgba?\([^)]+\)/)?.[0] || 'rgb(0,0,0)';
  const [x, y, blur] = v.replace(color, '').trim().split(/\s+/).map(px);
  return { x, y, blur, color: parseColor(color), layers: v.split(/,(?![^(]*\))/).length };
};
```

在 `els.map` 的开头，替换 `box` 计算并补公共字段：
```js
el.dataset.mid = `${si}-${ei}`; // stable handle for export-time snapshots
const bbox = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
const rotate = s.rotate && s.rotate !== 'none' ? parseFloat(s.rotate) : 0;
// unrotated box: same centre as the hull, layout size from offset metrics
const w = el.offsetWidth || bbox.w, h = el.offsetHeight || bbox.h;
const box = { x: bbox.x + bbox.w / 2 - w / 2, y: bbox.y + bbox.h / 2 - h / 2, w, h };
const common = {
  mid: el.dataset.mid, bbox, rotate,
  merge: el.dataset.merge || null, anim: el.dataset.anim || null,
  raster: el.hasAttribute('data-raster'), source: el.hasAttribute('data-source'),
};
const radius = s.borderTopLeftRadius.endsWith('%')
  ? (px(s.borderTopLeftRadius) / 100) * Math.min(w, h) : px(s.borderTopLeftRadius);
```
（`slides.map((slide, si) => …)`、`.filter(…).map((el, ei) => …)` 改成带索引。）

shape 分支返回值追加：
```js
...common, radius,
border: px(s.borderTopWidth) && s.borderTopStyle !== 'none'
  ? { width: px(s.borderTopWidth), color: parseColor(s.borderTopColor),
      uniform: ['Right', 'Bottom', 'Left'].every((k) => s[`border${k}Width`] === s.borderTopWidth && s[`border${k}Color`] === s.borderTopColor) }
  : null,
shadow: parseShadow(s.boxShadow),
tip: s.getPropertyValue('--tip') ? px(s.getPropertyValue('--tip')) : null,
value: el.dataset.value != null ? parseFloat(el.dataset.value) : null,
label: el.dataset.label || null,
transform: s.transform,
```
image 分支追加 `...common, radius, filter: s.filter !== 'none', shadow: parseShadow(s.boxShadow), transform: s.transform`；video/audio 分支追加 `...common`；text 分支追加：
```js
...common,
vertical: s.writingMode.startsWith('vertical'),
chart: el.hasAttribute('data-chart'),
textBox: {
  bg: parseColor(s.backgroundColor).alpha > 0 || s.backgroundImage !== 'none',
  border: px(s.borderTopWidth) > 0,
  shadow: s.boxShadow !== 'none',
  padding: ['Top', 'Right', 'Bottom', 'Left'].some((k) => px(s[`padding${k}`]) > 0),
},
transform: s.transform,
```
slide 返回值追加 `role: slide.dataset.role || ''`。注意 `...box` 继续展开在各分支，`bbox` 作为独立字段。

- [ ] **Step 4: 跑测试确认通过** — `node --test tests/measure.test.mjs` → PASS；再跑 `node scripts/validate.mjs examples/showcase` 确认 legacy 仍 0 error（未旋转元素 box === bbox）。
- [ ] **Step 5: Commit** — `git commit -am "Measure radius/border/shadow/rotation/vertical and skeleton-declared attributes"`

---

### Task 3: 单独截图 + 导出器新原语 + 通用 merge + manifest 字体 + 按角色原生图表

**Files:**
- Create: `scripts/lib/snapshot.mjs`
- Modify: `scripts/export-pptx.mjs`
- Test: `tests/export.test.mjs`

**Interfaces:**
- Consumes: Task 2 字段；`loadStyle`
- Produces: `snapshotEl(page, mid, file, { unrotate = false }) -> Promise<void>`

- [ ] **Step 1: 写失败测试** `tests/export.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import JSZip from 'jszip';
import { makeDeck } from './helpers.mjs';

const deck = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-card" data-shape="rect"></div>
  <h3 class="fx-h" data-merge="a">标题</h3>
  <p class="fx-p" data-merge="a">说明文字</p>
  <div class="fx-chev" data-shape="chevron"></div>
  <div class="fx-tilt" data-shape="rect"></div>
  <img class="fx-photo" src="assets/img/a.png" alt="示意图">
  <div class="fx-grad" data-shape="rect" data-raster></div>
  <p class="fx-vert">竖排 AI 文字</p>
</section>`);

test('exports native primitives', async () => {
  const out = resolve(deck, 'deck.pptx');
  execFileSync('node', ['scripts/export-pptx.mjs', deck, '--out', out]);
  const zip = await JSZip.loadAsync(readFileSync(out));
  const xml = await zip.file('ppt/slides/slide1.xml').async('string');
  assert.match(xml, /prst="roundRect"/);
  assert.match(xml, /<a:gd name="adj" fmla="val 10000"\/>/); // 24px radius / 240px short side
  assert.match(xml, /<a:ln w="19050"><a:solidFill><a:srgbClr val="FF6B2C"/i); // 2px = 1.5pt
  assert.match(xml, /<a:outerShdw/);
  assert.match(xml, /prst="chevron"/);
  assert.match(xml, /rot="-360000"|rot="21240000"/); // -6deg
  assert.match(xml, /vert="eaVert"/);
  assert.equal((xml.match(/标题/g) || []).length, 1);
  assert.match(xml, /标题<\/a:t>[\s\S]*?说明文字/); // merged into one txBody
  const pics = (xml.match(/<p:pic>/g) || []).length;
  assert.equal(pics, 2); // baked photo + rastered gradient
});
```

- [ ] **Step 2: 跑测试确认失败** — `node --test tests/export.test.mjs` → FAIL（无 roundRect）
- [ ] **Step 3: 实现**

`scripts/lib/snapshot.mjs`:
```js
// Screenshots ONE measured element in isolation: every other element on
// its slide is hidden and the slide ground turned transparent, so overlaid
// text never gets baked into the picture (it is exported natively).
export async function snapshotEl(page, mid, file, { unrotate = false } = {}) {
  await page.evaluate(([m, un]) => {
    const el = document.querySelector(`[data-mid="${m}"]`);
    const slide = el.closest('.slide');
    slide.dataset.snap = '1';
    slide.style.background = 'transparent';
    for (const o of slide.querySelectorAll('[data-mid]')) if (o !== el) o.style.visibility = 'hidden';
    if (un) el.style.rotate = '0deg';
  }, [mid, unrotate]);
  await page.locator(`[data-mid="${mid}"]`).screenshot({ path: file, omitBackground: true });
  await page.evaluate((m) => {
    const el = document.querySelector(`[data-mid="${m}"]`);
    const slide = el.closest('.slide');
    slide.style.background = '';
    for (const o of slide.querySelectorAll('[data-mid]')) o.style.visibility = '';
    el.style.rotate = '';
    delete slide.dataset.snap;
  }, mid);
}
```

`export-pptx.mjs` 改动：
1. 引入 `loadStyle`、`snapshotEl`；`const style = loadStyle(index);`
2. `fontFace(t)` 开头：
```js
const office = style.mode === 'style' ? style.manifest.fonts?.office?.[t.fontFamily] : null;
if (office && !embedFonts) return typeof office === 'string' ? office : (t.fontWeight <= 300 && office.light) || office.regular;
```
3. 截图循环改为（取代原 cover / video 循环）：
```js
for (let i = 0; i < slides.length; i++) {
  for (const el of slides[i].els) {
    const bake = el.kind === 'image' && (el.fit === 'cover' || el.radius > 0 || el.filter || el.rotate);
    if (bake || (el.kind === 'shape' && el.raster)) {
      const shot = resolve(cropDir, `s${i + 1}-${el.mid}.png`);
      await snapshotEl(page, el.mid, shot, { unrotate: !!el.rotate });
      Object.assign(el, { kind: 'image', src: shot, fit: 'exact' });
    } else if (el.kind === 'video') {
      const shot = resolve(cropDir, `s${i + 1}-${el.mid}.png`);
      await snapshotEl(page, el.mid, shot);
      el.cover = `data:image/png;base64,${readFileSync(shot).toString('base64')}`;
    }
  }
}
```
4. 形状输出：
```js
const SHAPE = { rect: pres.ShapeType.rect, ellipse: pres.ShapeType.ellipse, chevron: pres.ShapeType.chevron, pentagon: pres.ShapeType.homePlate };
const shadowOf = (sh) => sh && {
  type: 'outer', color: sh.color.hex, opacity: sh.color.alpha,
  blur: px2pt(sh.blur), offset: px2pt(Math.hypot(sh.x, sh.y)),
  angle: Math.round(((Math.atan2(sh.y, sh.x) * 180) / Math.PI + 360) % 360),
};
// CSS borders sit inside the box, PPTX lines straddle the edge: inset by half
const inset = el.border ? el.border.width / 2 : 0;
const sbox = { x: px2in(el.x + inset), y: px2in(el.y + inset), w: px2in(el.w - 2 * inset), h: px2in(el.h - 2 * inset) };
const round = el.shape === 'rect' && el.radius > 0;
slide.addShape(round ? pres.ShapeType.roundRect : SHAPE[el.shape] || pres.ShapeType.rect, {
  ...sbox,
  fill: { color: el.fill.hex, transparency: alpha2transparency(el.fill.alpha, el.opacity) },
  line: el.border ? { color: el.border.color.hex, width: px2pt(el.border.width), transparency: alpha2transparency(el.border.color.alpha) } : { type: 'none' },
  ...(round && { rectRadius: px2in(Math.min(el.radius, el.w / 2, el.h / 2)) }), // inches (pptxgenjs adj = r/min(w,h))
  ...(el.rotate && { rotate: el.rotate }),
  ...(el.shadow && { shadow: shadowOf(el.shadow) }),
});
```
5. 图片：`slide.addImage({ path, ...box, sizing, ...(el.rotate && { rotate: el.rotate }), ...(el.shadow && { shadow: shadowOf(el.shadow) }) })`。
6. 文字：单框与 `mergedText` 的 options 追加 `...(el.vertical && { vert: 'eaVert' })`、`...(el.rotate && { rotate: el.rotate })`。
7. merge：
```js
if (style.mode === 'style') {
  const groups = new Map();
  for (const el of s.els) if (el.kind === 'text' && el.merge) groups.set(el.merge, [...(groups.get(el.merge) || []), el]);
  for (const els of groups.values()) {
    if (els.length < 2) continue;
    els.sort((a, b) => a.y - b.y);
    els.forEach((el, i) => inGroup.set(el, { els, first: i === 0 }));
  }
} else {
  /* existing MERGE_GROUPS[s.layout] block, unchanged */
}
```
8. 原生图表：条件改为 `nativeCharts && (style.mode === 'style' ? s.role === 'bars' : s.layout === 'L15')`；style 模式取 `bars = s.els.filter(e => e.kind === 'shape' && e.value != null)`，`labels = bars.map(b => b.label)`，`values = bars.map(b => b.value)`，被替换的文字 = `s.els.filter(e => e.kind === 'text' && e.chart)`；图表盒 = 这些元素 bbox 的并集。legacy 分支保持原样。

- [ ] **Step 4: 跑测试确认通过** — `node --test tests/export.test.mjs` → PASS
- [ ] **Step 5: legacy 不回归** — `node scripts/export-pptx.mjs examples/showcase --out /tmp/sc.pptx && node scripts/check-pptx.mjs /tmp/sc.pptx --expect-slides 16`；对 `examples/media` 同样跑并 `unzip -l | grep media-.*\.mp4`。
- [ ] **Step 6: 技术验证（spec §4.4 #1–#3）** — 夹具 deck 导出 PPTX → `soffice --headless --convert-to pdf`（串行，先 `pkill -9 soffice`）→ `pdftoppm -r 96 -png` → 与 `render-png` 结果并排目检：圆角半径、描边粗细、阴影方向、-6° 旋转位置、竖排「AI」的旋转方向。竖排拉丁旋转与网页 `text-orientation: mixed` 不一致时：在 `references/pptx-export.md` 记录，并在 Task 4 的 R16 里把「竖排文本含拉丁字母」设为 warn。
- [ ] **Step 7: Commit** — `git commit -am "Export rounded/stroked/rotated/shadowed shapes, vertical text, isolated snapshots, skeleton-declared merges"`

---

### Task 4: 校验器 style 模式 + R16 导出一致性

**Files:**
- Modify: `scripts/validate.mjs`
- Test: `tests/validate.test.mjs`

**Interfaces:**
- Consumes: `loadStyle`、`ROLES`、`DATA_ROLES`、Task 2 字段
- Produces: CLI 行为：style 模式错误前缀 `R1`/`R2`/`R6`/`R8`/`R12`/`R16`

- [ ] **Step 1: 写失败测试** `tests/validate.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { makeDeck } from './helpers.mjs';

const run = (deck) => spawnSync('node', ['scripts/validate.mjs', deck], { encoding: 'utf8' });

test('clean style deck passes', () => {
  const r = run(makeDeck(`
<section class="slide" data-layout="fixture/kpi" data-role="kpi">
  <p class="fx-num">658+</p>
  <p class="fx-src" data-source>来源：测试夹具</p>
</section>
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-card" data-shape="rect"></div>
  <h3 class="fx-h">标题</h3>
  <div class="fx-tilt" data-shape="rect" style="rotate: -3deg;"></div>
</section>`));
  assert.equal(r.status, 0, r.stdout);
});

test('style-mode violations are caught', () => {
  const r = run(makeDeck(`
<section class="slide" data-layout="L07" data-role="kpi"><p class="fx-num">658+</p></section>
<section class="slide" data-layout="fixture/card" data-role="cover"><p class="l01-title">x</p></section>
<section class="slide" data-layout="fixture/bars" data-role="bars">
  <p class="fx-src" data-source>来源</p>
  <div class="fx-bar" data-shape="rect" data-value="10" data-label="a" style="top: 200px; width: 400px;"></div>
  <div class="fx-bar" data-shape="rect" data-value="5" data-label="b" style="top: 260px; width: 400px;"></div>
</section>
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-chev" data-shape="chevron" style="height: 100px;"></div>
  <p class="fx-h" style="transform: scale(2);">x</p>
</section>`, { extraHead: '\n<link rel="stylesheet" href="assets/extra.css">' }));
  assert.equal(r.status, 1);
  for (const needle of [
    'R1 slide 1: data-layout "L07"',
    'R1 slide 2: role "cover" does not match',
    'R8 slide 1: kpi page requires a data-source',
    'R2 slide 2 <p> "x": class "l01-title"',
    'R8 slide 3: bar "b"',
    'R16 slide 4 <shape> "": chevron tip',
    'R6 slide 4',
    'R12 stylesheet "assets/extra.css"',
  ]) assert.ok(r.stdout.includes(needle), `missing: ${needle}\n${r.stdout}`);
});
```

- [ ] **Step 2: 跑测试确认失败** — `node --test tests/validate.test.mjs` → FAIL
- [ ] **Step 3: 实现**

顶部：
```js
import { loadStyle } from './lib/style.mjs';
import { ROLES, DATA_ROLES } from './lib/roles.mjs';
const style = loadStyle(index);
const styled = style.mode === 'style';
const REGISTERED = styled ? new Set(Object.keys(style.manifest.layouts)) : /* legacy L01–L24 set */;
const INLINE_ALLOWED = styled
  ? /^(\s*((top|left|width|height|font-size|line-height)\s*:\s*[\d.]+(px|%)|rotate\s*:\s*-?[\d.]+deg)\s*;?)*\s*$/
  : /* legacy regex */;
const STYLESHEET_ALLOWED = styled
  ? new RegExp(`^assets/(base\\.css|brand\\.css|styles/${style.id}/style\\.css)$`)
  : /* legacy regex */;
const cssSources = styled ? style.sheets : [resolve(dirname(index), 'assets/base.css')];
const whitelist = new Set(cssSources.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1])));
```
R12 链接数上限：styled 为 3，legacy 为 2；R2 文案改为 `not defined in ${styled ? 'base.css or the style' : 'base.css'}`。

逐页（styled 分支）：
```js
if (styled) {
  if (!REGISTERED.has(s.layout)) errors.push(`R1 ${at(i)}: data-layout "${s.layout}" is not registered by style "${style.id}"`);
  else if (style.manifest.layouts[s.layout].role !== s.role)
    errors.push(`R1 ${at(i)}: role "${s.role}" does not match ${s.layout} (registered as "${style.manifest.layouts[s.layout].role}")`);
  if (s.role && !ROLES.includes(s.role)) errors.push(`R1 ${at(i)}: unknown role "${s.role}"`);
  if (DATA_ROLES.includes(s.role) && !s.els.some((el) => el.kind === 'text' && el.source && el.text))
    errors.push(`R8 ${at(i)}: ${s.role} page requires a data-source text citing where the numbers come from`);
  if (s.role === 'bars') {
    const bars = s.els.filter((el) => el.kind === 'shape' && el.value != null && el.value > 0);
    if (bars.length >= 2) {
      const ref = bars.reduce((a, b) => (b.value > a.value ? b : a));
      for (const b of bars) {
        const expected = (b.value / ref.value) * ref.w;
        if (Math.abs(b.w - expected) > Math.max(4, expected * 0.02))
          errors.push(`R8 ${at(i)}: bar "${b.label || b.value}" is ${Math.round(b.w)}px, expected ${Math.round(expected)}px (bar length must be proportional to data-value)`);
      }
    }
  }
} else { /* existing R1 + legacy R8 blocks, unchanged */ }
```

R16（styled，逐元素）：
```js
if (styled) {
  if (el.kind === 'shape' && (el.shape === 'chevron' || el.shape === 'pentagon') && Math.abs((el.tip ?? -1) - Math.min(el.w, el.h) / 2) > 1)
    errors.push(`R16 ${at(i, el)}: ${el.shape} tip must be --tip = ${Math.min(el.w, el.h) / 2}px (PowerPoint draws it at half the short side)`);
  if (el.border && !el.border.uniform) errors.push(`R16 ${at(i, el)}: border must be uniform on all four sides to export`);
  if (el.shadow?.layers > 1) errors.push(`R16 ${at(i, el)}: only one box-shadow layer exports`);
  if (el.transform && el.transform !== 'none') errors.push(`R16 ${at(i, el)}: transform does not export — use the rotate property`);
  if (el.kind === 'text' && Object.values(el.textBox).some(Boolean))
    errors.push(`R16 ${at(i, el)}: text slots export without fill/border/shadow/padding — put a shape behind the text`);
}
```

R3 / R5 / R9：把 `el.x / el.y / el.w / el.h` 换成 `el.bbox.*`（legacy 下 bbox 与 box 相等，行为不变）。

- [ ] **Step 4: 跑测试确认通过** — `node --test tests/validate.test.mjs` → PASS；`for d in showcase editorial media swiss v2-lab; do node scripts/validate.mjs examples/$d; done` 全部 0 error（legacy 不回归）。
- [ ] **Step 5: Commit** — `git commit -am "Validator style mode: manifest registry, role-keyed data honesty, R16 export parity"`

---

### Task 5: 通用 enhance.js（data-anim / data-media）

**Files:**
- Rewrite: `assets/enhance.js`
- Test: `tests/enhance.test.mjs`

**Interfaces:**
- Produces: 动画取值 `rise | draw | count | pop | grow-x | grow-y | ring | fade | scale`；媒体钩子 `data-media="toggle | track | progress | clock"`。legacy deck 用的是自带的旧 enhance.js 副本，不受影响。

- [ ] **Step 1: 写失败测试** `tests/enhance.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { makeDeck } from './helpers.mjs';

const deck = makeDeck(`
<section class="slide" data-layout="fixture/kpi" data-role="kpi">
  <p class="fx-num" data-anim="count">658+</p>
  <p class="fx-src" data-source data-anim="rise">来源</p>
  <div class="fx-bar" data-shape="rect" data-anim="grow-x" style="top: 300px; width: 400px;"></div>
</section>`);

test('animations settle to the static render', async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + resolve(deck, 'index.html'));
  await p.waitForTimeout(2000);
  const state = await p.$$eval('[data-anim]', (els) => els.map((e) => ({
    t: getComputedStyle(e).transform, o: getComputedStyle(e).opacity, text: e.textContent,
  })));
  await b.close();
  for (const s of state) { assert.ok(s.t === 'none' || s.t === 'matrix(1, 0, 0, 1, 0, 0)', s.t); assert.equal(s.o, '1'); }
  assert.equal(state[0].text, '658+');
});
```

- [ ] **Step 2: 跑测试确认失败** — 旧 enhance.js 不认 `data-anim`；`fx-num` 不会被 count，测试里 `658+` 仍成立，但需先确认 `data-anim` 元素被动画：在测试中先在 300ms 时取一次 opacity 断言 `< 1`（追加到测试里），旧实现下 FAIL。

```js
// insert before waitForTimeout(2000):
await p.waitForTimeout(250);
const early = await p.$eval('.fx-num', (e) => getComputedStyle(e).opacity);
assert.ok(parseFloat(early) < 1, 'count recipe should start hidden');
```

- [ ] **Step 3: 实现** — 保留 flat / reduced-motion 守卫、`prep / play / countUp`、MutationObserver；`play` 的目标值一律还原为 `''`（回到样式表值）。配方表：
```js
const RECIPES = {
  rise:    { from: { opacity: '0', transform: 'translateY(24px)' }, delay: 0,   step: 80,  dur: 500 },
  draw:    { from: { transform: 'scaleX(0)', transformOrigin: 'left center' }, delay: 150, step: 0, dur: 600 },
  'grow-x':{ from: { transform: 'scaleX(0)', transformOrigin: 'left center' }, delay: 150, step: 90, dur: 600 },
  'grow-y':{ from: { transform: 'scaleY(0)', transformOrigin: 'center top' }, delay: 100, step: 0, dur: 600 },
  count:   { from: { opacity: '0' }, delay: 200, step: 120, dur: 400, after: countUp },
  pop:     { from: { transform: 'scale(0)' }, delay: 300, step: 90,  dur: 350 },
  ring:    { from: { transform: 'scale(0)' }, delay: 300, step: 140, dur: 350 },
  fade:    { from: { opacity: '0' }, delay: 200, step: 60,  dur: 400 },
  scale:   { from: { transform: 'scale(0)' }, delay: 150, step: 180, dur: 500 },
};
const animate = (slide) => {
  if (slide.dataset.animated) return;
  slide.dataset.animated = '1';
  const seen = {};
  slide.querySelectorAll('[data-anim]').forEach((el) => {
    const r = RECIPES[el.dataset.anim];
    if (!r) return;
    const i = (seen[el.dataset.anim] = (seen[el.dataset.anim] ?? -1) + 1);
    const at = r.delay + i * r.step;
    prep(el, r.from);
    play(el, Object.fromEntries(Object.keys(r.from).map((k) => [k, ''])), at, r.dur);
    if (r.after) setTimeout(() => r.after(el), at);
  });
  slide.querySelectorAll('img, video').forEach((m) => {
    prep(m, { opacity: '0', transform: 'scale(1.04)' });
    play(m, { opacity: '', transform: '' }, 0, 900);
  });
};
```
媒体：`[data-media="toggle"]` 点击切换同页 `audio`/`video`；`[data-media="progress"]` 宽度 = `currentTime / duration × track.offsetWidth`（`track` = 同页 `[data-media="track"]`）；`[data-media="clock"]` 写 `m:ss / m:ss`；`video[data-autoplay]` 进页播放，离页暂停并归零（沿用旧逻辑）。

- [ ] **Step 4: 跑测试确认通过** — `node --test tests/enhance.test.mjs` → PASS
- [ ] **Step 5: Commit** — `git commit -am "Generic data-anim recipes and data-media hooks in enhance.js"`

---

### Task 6: 新 base.css 底座 + legacy 迁移 + 种子 / 脚手架 / 字体子集

**Files:**
- Move: `assets/base.css` → `assets/legacy/base.css`；`assets/themes/` → `assets/legacy/themes/`；`assets/systems/` → `assets/legacy/systems/`；`assets/textures/` → `assets/legacy/textures/`；`templates/seed.html` → `assets/legacy/seed.html`
- Create: `assets/base.css`（底座）、`templates/seed.html`（style 种子）
- Modify: `scripts/new-deck.mjs`、`scripts/subset-fonts.mjs`、`scripts/import-theme.mjs`（输出路径说明改为 `assets/brand.css`）
- Test: `tests/new-deck.test.mjs`

**Interfaces:**
- Consumes: `loadStyle`
- Produces: `node scripts/new-deck.mjs <dir> --style <id>`；`node scripts/new-deck.mjs <dir> --theme <legacy-theme>`；`node scripts/new-deck.mjs <dir> --refresh`（重拷运行时 + 风格包，不动 index.html / img / media / fonts）

- [ ] **Step 1: 写失败测试** `tests/new-deck.test.mjs`（style 脚手架与 `--refresh` 的用例依赖 swiss 风格包，放到 Task 7 Step 7 追加）

```js
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
  assert.ok(existsSync(join(dir, 'assets/themes/paper.css')));
});

test('shared base.css carries no layout geometry', () => {
  const css = readFileSync('assets/base.css', 'utf8');
  assert.doesNotMatch(css, /\.l0\d-|@font-face|is-dark/);
  assert.match(css, /data-shape="chevron"/);
});
```

- [ ] **Step 2: 跑测试确认失败**
- [ ] **Step 3: 实现**

新 `assets/base.css` 内容 = 旧 base.css 中以下部分（逐字搬运）+ 新增原语：
- 头注释改为「所有风格共用底座：画布 / 元素契约 / 段内强调 / 形状原语 / 运行时 chrome；版式几何与 @font-face 在 styles/<id>/style.css」。
- `:root` 颜色 token 与字体 token（默认值不变）。
- `* {}`、`body {}`、`.slide {}`、两条绝对定位规则、段内强调四条规则（strong / em / is-accent / is-mark）。
- 新增：
```css
/* shape primitives — PowerPoint draws chevron/pentagon tips at half the
   short side, so --tip must equal height/2 (validator R16) */
.slide [data-shape="ellipse"] { border-radius: 50%; }
.slide [data-shape="chevron"] {
  clip-path: polygon(0 0, calc(100% - var(--tip)) 0, 100% 50%, calc(100% - var(--tip)) 100%, 0 100%, var(--tip) 50%);
}
.slide [data-shape="pentagon"] {
  clip-path: polygon(0 0, calc(100% - var(--tip)) 0, 100% 50%, calc(100% - var(--tip)) 100%, 0 100%);
}
```
- `presentation runtime` 段落起到文件末尾全部（present / hud / notes / presenter / edit）。
- 不包含：@font-face、`is-dark` / `is-accent`、CJK 排印选择器、composition / DATUM / GRID 词汇、L01–L24 全部几何、corporate slots。

`templates/seed.html`：复制旧种子，把主题链接改成 `<link rel="stylesheet" href="assets/styles/__STYLE__/style.css">`，注释里的骨架出处改为「styles/<id>/layouts.md」。

`scripts/new-deck.mjs`（style 分支核心）：
```js
const copyRuntime = (deck) => { for (const f of ['base.css', 'runtime.js', 'enhance.js']) cpSync(join(root, 'assets', f), join(deck, 'assets', f)); };
const copyStyle = (deck, id) => {
  const src = join(root, 'styles', id);
  const manifest = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'));
  const dst = join(deck, 'assets/styles', id);
  mkdirSync(dst, { recursive: true });
  for (const f of ['style.css', 'manifest.json']) cpSync(join(src, f), join(dst, f));
  for (const d of manifest.assets || []) cpSync(join(src, d), join(dst, d), { recursive: true });
};
```
`--refresh`：`loadStyle(index)` 得到 id（legacy 则从 `assets/legacy` 重拷 base/runtime/enhance）；只调用 `copyRuntime` + `copyStyle`。`--theme`：从 `assets/legacy/` 拷 `base.css`（到 deck 的 `assets/base.css`）、`themes`、`systems`、`textures`、`seed.html`，其余同旧逻辑。

`scripts/subset-fonts.mjs`：`const style = loadStyle(index); const FONTS = style.mode === 'style' ? style.manifest.fonts.web : LEGACY_FONTS;`（`LEGACY_FONTS` 即旧数组）。

- [ ] **Step 4: 跑测试确认通过** — `node --test tests/` 全绿；legacy 金样 `examples/*` 仍各自 validate 0 error（它们自带旧 base.css 副本）。
- [ ] **Step 5: Commit** — `git add -A assets templates scripts tests && git commit -m "Slim shared base.css; move legacy design layer under assets/legacy; style-aware scaffold and font subsetting"`

---

### Task 7: swiss 原样迁成风格包（P0 验收）

**Files:**
- Create: `styles/swiss/style.css`、`styles/swiss/manifest.json`、`styles/swiss/layouts.md`、`styles/swiss/textures/{dots-dark,dots-light}.png`、`styles/swiss/golden/`（由 `examples/swiss` 迁入）
- Delete: `examples/swiss/`（迁移完成并通过回归后）
- Modify: `baselines/swiss/` → `baselines/styles/swiss/`（`git mv`）

**Interfaces:**
- Consumes: Task 1–6 全部
- Produces: 第一个风格包；layout id 映射（下表）

| 旧编号 | 新 id | role | merge 组（写在骨架上） | anim |
|---|---|---|---|---|
| L01 | swiss/cover | cover | — | — |
| L02 | swiss/agenda | agenda | — | — |
| L03 | swiss/section | section | — | l03-title `rise`、l03-rule `draw` |
| L04 | swiss/statement | statement | — | l04-text `rise` |
| L05 | swiss/compare | compare | `a`: l05-ha,l05-a1,l05-a2；`b`: l05-hb,l05-b1,l05-b2 | sl-title `rise` |
| L06 | swiss/points | points | `c1..c3`: num+h+p 同列 | sl-title `rise` |
| L07 | swiss/kpi | kpi | — | sl-title `rise`、l07-num `count` |
| L10 | swiss/body-points | points | `p1..p3`: pNt+pNb | sl-title `rise` |
| L13 | swiss/closing | closing | — | l13-title `rise`、l13-rule `draw` |
| L15 | swiss/bars | bars | — | sl-title `rise`、l15-bar `grow-x` |
| L20 | swiss/cycle | cycle | `n/e/s/w`: h+p | sl-title `rise`、l20-node `ring` |
| L21 | swiss/matrix | matrix | `rRcC`: num+label 同格 | sl-title `rise`、l21-num/label `fade` |
| L22 | swiss/spec | table | `rRcC`: label+value 同格 | sl-title `rise` |
| L23 | swiss/timeline | timeline | `r1..r4`: h+p | sl-title `rise`、l23-axis `grow-y`、l23-dot `pop` |
| L24 | swiss/system | system | `h1..h3`: h+p | sl-title `rise`、l24-l* `scale`、l24-s*/h/p `fade` |

- [ ] **Step 1: 建风格包**
  - `style.css` = 依次拼接：①`@font-face`（Source Han Sans SC VF + JetBrains Mono，`url('../../fonts/…')`）；② `assets/legacy/systems/swiss.css` 的 `:root`、`.slide.is-dark`、`.slide.is-accent` 三段；③ `assets/legacy/base.css` 中 swiss 金样用到的段落：CJK 排印三条规则（只保留出现在金样里的 class）、`.sl-texture`、`.sl-mono`、`.dt-display`、`.sl-title`、L01（仅 kicker / meta）、L02、L03、L04（text / attr）、L05、L06、L07、L10、L13、L15、L20、L21、L22、L23、L24、GRID `sw-*` 词汇；④ swiss.css 中 `:root / is-dark / is-accent` 之后的全部覆写规则。拼接顺序与旧 cascade 一致（底座几何在前，swiss 覆写在后）。
  - `manifest.json`：`id/name("瑞士 · 网格")/letter("B")/group("商务理性")/status("draft")/recommend(["数据","发布","技术"])/assets(["textures"])/fonts.web`（SourceHanSansSC-VF.otf→source-han-sans-sc.woff2、JetBrainsMono-Regular.ttf→jetbrains-mono.woff2）`/fonts.office`（`{"Source Han Sans SC": {"regular":"Microsoft YaHei","light":"Microsoft YaHei Light"}, "JetBrains Mono": "Consolas", "Helvetica Neue": {"regular":"Arial","light":"Arial"}}`）`/layouts`（上表 15 项）。
  - `layouts.md`：每个版式一节：id / role / 适用场景 / 骨架（从金样对应页抽出，替换为占位安全的示例文案）。
- [ ] **Step 2: 迁移金样** — `git mv examples/swiss styles/swiss/golden`；删 `golden/assets/{themes,systems,textures}`、旧 `base.css/enhance.js`；`node scripts/new-deck.mjs styles/swiss/golden --refresh`（需先把 `<link>` 改成 `assets/base.css` + `assets/styles/swiss/style.css`）；按上表改每页 `data-layout`、加 `data-role / data-merge / data-anim`；L07 / L15 / L22 的脚注加 `data-source`；L15 四根条加 `data-value / data-label`，数值文字加 `data-chart`；纹理 `src` 改为 `assets/styles/swiss/textures/…`；`node scripts/subset-fonts.mjs styles/swiss/golden`。
- [ ] **Step 3: 校验** — `node scripts/validate.mjs styles/swiss/golden` → 0 error（R15 预警与旧版相同）；`node scripts/check-style.mjs styles/swiss` 留到 Task 8。
- [ ] **Step 4: 像素回归（P0 验收）** — `node scripts/render-png.mjs styles/swiss/golden --out .regress/swiss-pkg && node scripts/diff.mjs baselines/swiss .regress/swiss-pkg --out .regress/diff-swiss-pkg` → 15 页全部 ≤0.5%（只允许字体子集字符集差异带来的亚像素噪声；超出则逐页查 cascade 顺序）。
- [ ] **Step 5: PPTX** — `node scripts/export-pptx.mjs styles/swiss/golden --out /tmp/swiss.pptx --native-charts && node scripts/check-pptx.mjs /tmp/swiss.pptx --expect-slides 15`；LibreOffice 转 PNG 目检 L05 / L06 / L21 / L22 合并文本框位置与旧导出一致。
- [ ] **Step 6: 基线搬家** — `git mv baselines/swiss baselines/styles/swiss`
- [ ] **Step 7: 追加脚手架测试**（`tests/new-deck.test.mjs`）后 `node --test tests/` 全绿：

```js
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

test('scaffolds a style deck that validates', () => {
  const dir = join(mkdtempSync(join(tmpdir(), 'nd-')), 'd');
  execFileSync('node', ['scripts/new-deck.mjs', dir, '--style', 'swiss']);
  for (const f of ['assets/base.css', 'assets/runtime.js', 'assets/enhance.js', 'assets/styles/swiss/style.css', 'assets/styles/swiss/manifest.json', 'assets/styles/swiss/textures/dots-light.png'])
    assert.ok(existsSync(join(dir, f)), f);
  assert.match(readFileSync(join(dir, 'index.html'), 'utf8'), /assets\/styles\/swiss\/style\.css/);
  assert.equal(spawnSync('node', ['scripts/validate.mjs', dir]).status, 0);
});

test('refresh re-copies runtime but keeps the deck', () => {
  const dir = join(mkdtempSync(join(tmpdir(), 'nd-')), 'd');
  execFileSync('node', ['scripts/new-deck.mjs', dir, '--style', 'swiss']);
  writeFileSync(join(dir, 'assets/enhance.js'), '// stale');
  execFileSync('node', ['scripts/new-deck.mjs', dir, '--refresh']);
  assert.notEqual(readFileSync(join(dir, 'assets/enhance.js'), 'utf8'), '// stale');
});
```
- [ ] **Step 8: Commit** — `git add -A && git commit -m "Migrate Swiss system into styles/swiss as the first style package (pixel parity)"`

---

### Task 8: check-style 风格包自检

**Files:**
- Create: `scripts/check-style.mjs`
- Test: `tests/check-style.test.mjs`

**Interfaces:**
- Produces: `node scripts/check-style.mjs <styles/<id>>` → exit 1 on errors；`status:"ready"` 时核心角色缺失为 error，`draft` 时为 warn

- [ ] **Step 1: 写失败测试**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (dir) => spawnSync('node', ['scripts/check-style.mjs', dir], { encoding: 'utf8' });

test('swiss package passes as draft (missing core roles are warnings)', () => {
  const r = run('styles/swiss');
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /WARN .*core role "process"/);
});

test('ready status turns missing core roles into errors', () => {
  const dir = join(mkdtempSync(join(tmpdir(), 'cs-')), 'swiss');
  cpSync('styles/swiss', dir, { recursive: true });
  const m = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  m.status = 'ready';
  m.layouts['swiss/ghost'] = { role: 'gallery' };
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(m));
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /ERROR .*core role "process"/);
  assert.match(r.stdout, /ERROR .*swiss\/ghost.*not used in golden/);
});
```

- [ ] **Step 2: 跑测试确认失败**
- [ ] **Step 3: 实现** — 检查项：manifest 必填字段（id 与目录名一致、name、status ∈ draft/ready、layouts 非空）；每个 layout 的 role ∈ ROLES；核心角色覆盖（ready=error / draft=warn）；`golden/index.html` 存在，manifest 每个 layout 在金样里出现、金样里每个 `data-layout` 都在 manifest；`layouts.md` 里 ```html 代码块用到的 class 都在 `assets/base.css` 或 `style.css` 中定义；`fonts.web[].src` 在 `assets/fonts-src/` 中存在（目录缺失时 warn「run fetch-fonts」）；`assets[]` 目录存在。
- [ ] **Step 4: 跑测试确认通过**
- [ ] **Step 5: Commit** — `git commit -am "check-style: style package self-check"`

---

### Task 9: gen-art 确定性抽象配图

**Files:**
- Create: `scripts/gen-art.mjs`
- Test: `tests/gen-art.test.mjs`

**Interfaces:**
- Produces: `node scripts/gen-art.mjs <out-dir> [--style <id> | --palette "#a,#b,#c,#d"] [--kind field|arch] [--seed N] [--count K] [--size 1600x1000]` → `<out-dir>/<kind>-<seed+i>.png`

- [ ] **Step 1: 写失败测试**

```js
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
  for (const kind of ['field', 'arch']) {
    const a = gen(kind), b = gen(kind);
    assert.equal(a.length, 2);
    assert.deepEqual(a, b);
    assert.notEqual(a[0], a[1]);
  }
});
```

- [ ] **Step 2: 跑测试确认失败**
- [ ] **Step 3: 实现** — mulberry32 PRNG；`--style` 从 `styles/<id>/style.css` 的第一个 `:root{}` 抽 `--bg --surface --accent --text-1 --hairline` 作调色板；`field`：3–5 个大半径径向渐变椭圆（`<radialGradient>`）+ `feTurbulence`（`seed` 属性取 PRNG，`baseFrequency 0.9`，`numOctaves 2`）颗粒叠层 opacity 0.08；`arch`：8–14 个互相遮挡的矩形平面（线性渐变模拟受光面，倾斜边用 `<polygon>`）+ 同样颗粒；SVG 字符串 `page.setContent` 后 `page.screenshot({ clip })`，`deviceScaleFactor: 1`。
- [ ] **Step 4: 跑测试确认通过**
- [ ] **Step 5: Commit** — `git commit -am "gen-art: deterministic abstract imagery for golden decks"`

---

### Task 10: 风格画廊 + 回归 / 基线 / 同步 / CI 风格化

**Files:**
- Create: `scripts/style-gallery.mjs`、`scripts/regress.mjs`、`docs/styles/`（生成物入库：`index.html`、`<id>.png`、`gallery.png`）
- Modify: `scripts/baseline.mjs`、`scripts/sync-skill.mjs`、`package.json`、`.github/workflows/validate.yml`

**Interfaces:**
- Produces: `GOLDENS = [...legacy examples, ...styles/*/golden]` 统一枚举函数 `listGoldens(root) -> [{ name, dir, baseline }]`（放在 `scripts/lib/goldens.mjs`），`baseline` 路径：legacy → `baselines/<name>`，style → `baselines/styles/<id>`

- [ ] **Step 1: `scripts/lib/goldens.mjs`**
```js
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const LEGACY = ['showcase', 'editorial', 'media'];
export function listGoldens(root) {
  const styles = existsSync(join(root, 'styles')) ? readdirSync(join(root, 'styles')) : [];
  return [
    ...LEGACY.filter((d) => existsSync(join(root, 'examples', d))).map((d) => ({ name: d, dir: join(root, 'examples', d), baseline: join(root, 'baselines', d) })),
    ...styles.filter((id) => existsSync(join(root, 'styles', id, 'golden/index.html'))).map((id) => ({ name: `styles/${id}`, dir: join(root, 'styles', id, 'golden'), baseline: join(root, 'baselines/styles', id) })),
  ];
}
```
- [ ] **Step 2: `regress.mjs`** — 对每个 golden：`render-png → .regress/<name>`，`diff.mjs <baseline> .regress/<name>`；任一失败 exit 1。`package.json`：`"regress": "node scripts/regress.mjs"`。`baseline.mjs` 改用 `listGoldens`，并额外对每个 `styles/<id>` 跑 `check-style.mjs`。
- [ ] **Step 3: `style-gallery.mjs`** — 遍历 `styles/*/manifest.json`，渲染各金样第 1 页到 `docs/styles/<id>.png`，生成 `docs/styles/index.html`（按 group 分组的卡片：封面图、letter + name、recommend、status 徽标；页面自带 `:root` 颜色 token 与暗色模式），再截整页为 `docs/styles/gallery.png`。
- [ ] **Step 4: sync / CI** — `sync-skill.mjs` SHIP 加 `'styles'`、`'docs/styles'`，EXCLUDE 不变；CI：validate 段把 `examples/swiss` 换成 `styles/swiss/golden`，新增 `node scripts/check-style.mjs styles/swiss`、`node --test tests/`；PPTX 段追加 swiss 导出 + `check-pptx --expect-slides 15`。
- [ ] **Step 5: 验证** — `npm run regress` 全过；`npm test` 全绿；`node scripts/style-gallery.mjs` 生成物目检。
- [ ] **Step 6: Commit** — `git add -A && git commit -m "Style-aware regress/baseline/sync/CI and the style gallery"`

---

### Task 11: 文档

**Files:**
- Create: `references/roles.md`
- Modify: `SKILL.md`、`ARCHITECTURE.md`、`references/pptx-export.md`、`references/themes.md`（加一句指向风格库）

- [ ] **Step 1: `references/roles.md`** — 角色表（20 个，标核心）；内容形状 → 角色决策表（由 SKILL.md 现有「内容形状→版式」表改写：把 L 编号换成角色名）；骨架声明属性一览：`data-layout / data-role / data-merge / data-anim / data-raster / data-source / data-value + data-label / data-chart / data-media / --tip / rotate`，每条一句用途 + 校验规则编号。
- [ ] **Step 2: `SKILL.md`** — 流程第 1 步追加「选风格」：读 `docs/styles/index.html` 给用户看，按 spec §6 场合表推荐；`new-deck --style <id>`；选版式改为「内容形状→角色（roles.md）→ styles/<id>/layouts.md」；过渡期说明：尚未交付的风格用 `--theme`（legacy，见 references/layouts.md）。
- [ ] **Step 3: `ARCHITECTURE.md`** — §1 洞察补「几何随风格变化不影响导出：测量驱动」；§4 目录结构加 `styles/`、`assets/legacy/`、`tests/`、`docs/styles/`；§5 改为「风格包与角色层」（版式注册从全局 24 个改为每风格独立，legacy 表保留为附录直到 P3）；§6 规则表加 R16、R1/R2/R8/R12 的 style 模式说明；§8 里程碑加 M10 风格库平台。
- [ ] **Step 4: `references/pptx-export.md`** — 新原语映射表（spec §4.1）、`rectRadius` 单位实测结论、单独截图机制、Task 3 Step 6 的技术验证结论（竖排拉丁旋转一致 / 不一致的处理）。
- [ ] **Step 5: Commit** — `git commit -am "Docs: style packages, roles, new export primitives"`

---

### Task 12: 收尾验证

- [ ] `npm test` 全绿
- [ ] `for d in showcase editorial media v2-lab; do node scripts/validate.mjs examples/$d; done` 全部 0 error
- [ ] `node scripts/validate.mjs styles/swiss/golden && node scripts/check-style.mjs styles/swiss`
- [ ] `npm run regress` 全过
- [ ] showcase / media / swiss 三套 PPTX 导出 + `check-pptx`
- [ ] `node scripts/validate.mjs decks/weihai-opc`（私有 deck，legacy 模式，不应受影响）
- [ ] `npm run sync` + `npm run sync-check` 0 drift；在已安装目录跑一次 `new-deck --style swiss` 冒烟
- [ ] 更新 memory：风格库平台落地、legacy 过渡规则、新原语与 R16
