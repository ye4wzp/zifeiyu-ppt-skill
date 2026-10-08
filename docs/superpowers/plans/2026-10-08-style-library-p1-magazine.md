# Style Library P1-A · Magazine Full Layout Set Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship style A「杂志 · 暖纸」(`magazine`) as the first `ready` style: 18 layouts covering all 12 core roles plus matrix / bars / table / gallery / video / audio, an 18-page golden deck, baseline, gallery card, CI coverage, docs — and retire the legacy `editorial` system it replaces.

**Architecture:** Everything lives in the P0 style-package contract: `styles/magazine/{style.css, manifest.json, layouts.md, golden/}`. Each layout = one CSS block (class prefix per layout) + one skeleton `<section>` that is copied verbatim into both the golden deck and `layouts.md`. The specimen (commit `0d4fec2`: cover / kpi / process) is the seed; this plan adds 15 layouts in five batches, each batch verified by validator → PNG render → PPTX → LibreOffice geometry compare.

**Tech Stack:** Node 22 ESM, Playwright, pptxgenjs 4.0.1, subset-font, node:test, LibreOffice (`soffice`) + `pdftoppm`, ffmpeg (golden video only).

**Spec:** `docs/superpowers/specs/2026-10-08-style-library-design.md`（§2 A 行、§3、§5、§7 P1、§8）

**Scope note:** P1 in the spec covers A / B / H / G. B, H and G each start with a 3-page specimen the user must approve; their layout sets cannot be specified before that, so each gets its own plan after its specimen gate (`…-p1-swiss.md`, `…-p1-consulting.md`, `…-p1-photobook.md`). This plan is A only, plus the shared golden copy every later style reuses.

## Global Constraints

- Canvas 1280×720 px; pt = px × 0.75; in = px ÷ 96.
- Text only inside `h1/h2/h3/p`; inline emphasis only unnested `<strong>/<em>/<span class="is-accent">/<span class="is-mark">`; no `<br>` — one heading element per line, grouped with `data-merge`.
- Inline style only `top/left/width/height/font-size/line-height` (+ `rotate`); every class must be defined in `assets/base.css` or `styles/magazine/style.css`.
- R4 font floor 16px; R16 export parity (no `transform`, single-layer shadow, uniform border, text slots without bg/border/shadow/padding).
- Data roles (`kpi`, `bars`, `table`) use real, repo-verifiable numbers and carry a non-empty `data-source` text; bar width ∝ `data-value`.
- Golden imagery comes from `scripts/gen-art.mjs`; every caption says 示意图 / 示意视频 / 示意音频.
- `fonts.office` must map every family the deck renders (incl. `PingFang SC`); export must print no `warn: no fonts.office mapping`.
- A's palette rule: lemon (`--mark`) appears once per page; `is-accent` is not used in A.
- Numerals: Playfair Display with `font-variant-numeric: lining-nums` (failures.md #5: old-style 0 reads as o); Office face Times New Roman (lining).
- Never commit `decks/` or `.superpowers/`. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Work on branch `style-magazine`.

## Golden page order (fixed for the whole plan)

| # | layout | state | FIG | folio (top-left mono) |
|---|---|---|---|---|
| 01 | magazine/cover | light | 01 | VOL. 01 — 2026 · ZIFEIYU PPT SKILL |
| 02 | magazine/agenda | light | 02 | VOL. 01 — CONTENTS |
| 03 | magazine/statement | dark | — | NOTE — 设计原则 |
| 04 | magazine/section | bleed | 03 | CHAPTER 01 |
| 05 | magazine/matrix | light | — | 01 — STYLE INDEX |
| 06 | magazine/compare | light | — | 01 — BEFORE / AFTER |
| 07 | magazine/image-text | light | 04 | 02 — MEASURED EXPORT |
| 08 | magazine/image | bleed | 05 | — |
| 09 | magazine/points | light | 06 | 02 — THREE PROMISES |
| 10 | magazine/kpi | light | 07 | 03 — QUALITY GATES |
| 11 | magazine/bars | light | — | 03 — RULES BY CONCERN |
| 12 | magazine/table | light | — | 03 — SPEC SHEET |
| 13 | magazine/video | dark | 08 | 04 — FILM |
| 14 | magazine/process | light | 09 | 04 — WORKFLOW |
| 15 | magazine/timeline | light | 10 | 04 — CHRONICLE |
| 16 | magazine/gallery | light | 11–13 | 04 — IMAGERY |
| 17 | magazine/audio | light | 14 | 04 — AUDIO |
| 18 | magazine/closing | dark | 15 | — |

Page numbers read `NN / 18`. Each batch inserts its slides at these positions (slides of later batches simply do not exist yet; R15 rhythm warnings are only judged in Task 7).

## Shared verification routine ("verify batch")

Run after every batch; all of it must pass before committing:

```bash
G=styles/magazine/golden
node scripts/new-deck.mjs $G --refresh                 # copy style.css/manifest into the golden
node scripts/subset-fonts.mjs $G
node scripts/validate.mjs $G --office                  # 0 errors
node scripts/check-style.mjs styles/magazine           # 0 errors (core-role warnings allowed until Task 7)
node scripts/render-png.mjs $G                         # then Read every new renders/slide-N.png
node scripts/export-pptx.mjs $G | grep -E 'written|warn'   # no "warn:" line
node scripts/check-pptx.mjs $G/deck.pptx               # 0 errors
S=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/mgpptx
rm -rf $S && mkdir -p $S && pkill -9 soffice; soffice --headless --convert-to pdf $G/deck.pptx --outdir $S >/dev/null 2>&1 && pdftoppm -r 96 -png $S/deck.pdf $S/p
```

Eyes-on checklist per new page (render PNG and LibreOffice PNG side by side): nothing overlaps or clips; lower half not empty (spec §1 complaint); one lemon per page; captions present; LibreOffice boxes within ~10px of the HTML (glyph shapes differ on this Mac — no SimSun/Times/Consolas — that is expected).

---

### Task 1: Golden copy script + gen-art JPEG output

**Files:**
- Create: `docs/golden-content.md`
- Modify: `scripts/gen-art.mjs` (option parsing, screenshot call, filename)
- Test: `tests/gen-art.test.mjs`

**Interfaces:**
- Produces: `node scripts/gen-art.mjs <out> --format jpg` writes `<kind>-<seed>.jpg` (JPEG q85); default stays `png`. Later tasks generate all golden imagery as JPEG.
- Produces: `docs/golden-content.md` — the per-role copy every golden (A now, B–L later) uses verbatim.

- [ ] **Step 1: Write the failing test** — append to `tests/gen-art.test.mjs`:

```js
test('--format jpg writes JPEG files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'art-'));
  execFileSync('node', ['scripts/gen-art.mjs', dir, '--style', 'swiss', '--kind', 'field', '--seed', '3', '--size', '200x120', '--format', 'jpg']);
  assert.deepEqual(readdirSync(dir), ['field-3.jpg']);
  assert.deepEqual([...readFileSync(join(dir, 'field-3.jpg')).subarray(0, 3)], [0xff, 0xd8, 0xff]);
});
```

- [ ] **Step 2: Run it, expect FAIL** — `node --test tests/gen-art.test.mjs` → fails (`field-3.png` written instead).

- [ ] **Step 3: Implement** in `scripts/gen-art.mjs`:
  - usage lines: add `[--format png|jpg]`;
  - after `const [W, H] = …`: 
    ```js
    const format = opt('--format', 'png');
    if (!['png', 'jpg'].includes(format)) {
      console.error(`unknown --format "${format}" (png|jpg)`);
      process.exit(2);
    }
    ```
  - in the loop: `const file = join(resolve(out), \`${kind}-${seed0 + n}.${format}\`);` and
    ```js
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H }, ...(format === 'jpg' && { type: 'jpeg', quality: 85 }) });
    ```

- [ ] **Step 4: Run tests, expect PASS** — `npm test` → all pass.

- [ ] **Step 5: Write `docs/golden-content.md`** with exactly this content:

````markdown
# 金样内容脚本

12 种风格的金样共用这份文字（spec §5）：同一角色的页面用同一套核心文字，画廊里横向比较的是版面而不是内容。每条事实都能在本仓库里查到，出处写在每节末尾。

- **核心文字**（标题、正文、数据、条目）各风格照抄，不改写。
- **风格声部**（拉丁斜体副题、等宽页眉、图注编号、kicker）由风格自定，可省略。
- 版式放不下时先换该风格里同角色的另一个版式，不删核心文字。

## cover
- 标题（两行）：一份源文件 / 三种交付
- 说明：浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。
- 标签：网页 PPT · 可编辑导出
- 出处：SKILL.md 开头「HTML 是唯一的源，PPTX / PDF / PNG 是一键衍生物」

## agenda
| # | 条目 | 说明 |
|---|---|---|
| 01 | 风格库 | 十二种风格，开场先挑一种 |
| 02 | 测量与导出 | 先量后画，文字始终可编辑 |
| 03 | 质量门 | 十六条规则，错误清零才交付 |
| 04 | 工作流 | 从大纲到成稿的四步 |

## statement
- 引文（两行）：HTML 是唯一的源， / 其余都是衍生物。
- 出处：SKILL.md · 设计原则

## section
- 章节：01 · 风格库

## matrix（12 项 + 总数）
- 标题（两行）：十二种风格， / 按场合挑一种。
- 总数：12 · 种风格 · 分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文
- 条目：A 杂志 · 暖纸 / B 瑞士 · 网格 / C 发布会 · 暗场 / D 报刊 · 版面 / E 大字报 · 粗野 / F 柔和 · 产品 / G 摄影集 · 画册 / H 咨询 · 白皮书 / I 日式 · 极简 / J 拼贴 · 手账 / K 新中式 · 东方 / L 工程制图
- 出处：docs/superpowers/specs/2026-10-08-style-library-design.md §2

## compare
- 标题：换皮，不如换版面。
- 之前：通用版式，换主题即换色 —— 三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。—— 24 个版式，三套系统共用
- 现在：独立版式，选风格即选版面 —— 十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。—— 12 种风格，各有一套版式
- 出处：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2

## image-text
- 标题（两行）：所见即所得， / 靠的是测量。
- 正文 1：导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。
- 正文 2：圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。
- 出处：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs

## image
- 标题：先选风格，再写内容
- 说明：风格决定版面，版面决定一页能放多少字。
- 出处：SKILL.md 第 1 步 Q2（选风格在填内容之前）

## points（3 项）
- 标题：三件事，件件可验证。
- 浏览器里演示 —— 方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。
- 可编辑的 PPTX —— 文字是原生文本框，形状是原生形状，交给同事也能接着改。
- 机器先把关 —— 十六条规则查版式、字号、出处与导出一致性，错误清零才交付。
- 出处：SKILL.md 第 6、8 步

## kpi（3 个数）
- 标题（两行）：导出之前， / 先过十六道检查。
- 16 · 条校验规则 · R1–R16，从版式注册一路查到 PPTX 导出一致性
- 20 · 页面角色 · 其中 12 个是每种风格必须覆盖的核心角色
- 3 · 导出格式 · PPTX · PDF · PNG，HTML 是唯一的源
- 出处：scripts/validate.mjs · scripts/lib/roles.mjs

## bars（6 行）
- 标题：十六条规则，各管一摊。
| 守护对象 | 条数 | 规则 |
|---|---|---|
| 排版与几何 | 4 | R3 · R4 · R7 · R9 |
| 版式与样式 | 4 | R1 · R2 · R6 · R12 |
| 内容与数据 | 3 | R5 · R8 · R14 |
| 可访问与媒体 | 3 | R10 · R11 · R13 |
| 节奏 | 1 | R15 |
| 导出一致 | 1 | R16 |
- 出处：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组

## table（6 行）
- 标题：一页纸，看懂规格。
| 项目 | 规格 | 出处 |
|---|---|---|
| 画布 | 1280 × 720 px，导出时 px × 0.75 换算为 pt | assets/base.css |
| 字号下限 | 16 px，溢出先删字、再换版式 | validate.mjs · R4 |
| 校验规则 | R1–R16，错误清零才能交付 | validate.mjs |
| 导出格式 | PPTX · PDF · PNG，HTML 是唯一的源 | SKILL.md |
| 页面角色 | 20 个，其中 12 个核心角色 | lib/roles.mjs |
| 字体 | SIL OFL 开源字体，按 deck 用字子集化 | fetch-fonts.mjs |

## process（4 步）
- 标题：从大纲到成稿，四步
- 01 选风格 —— 看风格画廊，按场合挑一种，整份 deck 只用这一种。
- 02 填版式 —— 按内容形状找角色，复制版式骨架，只换文字和图片。
- 03 过校验 —— 查类名、字号、出处与导出一致性，错误必须清零。
- 04 导出 —— 一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。
- 出处：SKILL.md 工作流

## timeline（5 个节点）
- 标题（两行）：从一套版式， / 到一座风格库。
| 日期 | 节点 | 说明 |
|---|---|---|
| 07.16 | 首版发布 | 锁定设计系统的网页 PPT，确定性导出。 |
| 07.18 | 墨韵衬线 | 第二套设计系统：思源宋、暖纸、朱砂。 |
| 08.17 | 校验全覆盖 | 规则覆盖全部元素，文字分段原生导出。 |
| 08.18 | 瑞士国际 | 第三套设计系统，加入数据叙事版式。 |
| 10.08 | 风格库 | 十二种风格，每种独立版式集。 |
- 出处：git log（2026-07-16 → 2026-10-08）

## gallery
- 标题：配图由脚本生成，按风格取色。
- 出处：scripts/gen-art.mjs（固定种子，输出可复现）

## video
- 标题：视频也能放进来
- 说明：演示时点击画面播放；渲染图、PDF 与 PPTX 的静止画面锁定在封面帧。
- 素材：示意视频，8 秒，由抽象图生成
- 出处：SKILL.md 硬约束 9

## audio
- 标题：边听边翻页
- 说明：音频放在 deck 目录里，演示时点圆点播放；导出 PPTX 后仍能在演示软件里播放。
- 素材：示意音频 · 提示音 · 0:08
- 出处：references/pptx-export.md「媒体随行」

## cycle（4 节点，有回路）
- 标题：每次改动，都绕这一圈
- 改版式 → 过校验 → 渲染比对 → 记基线 → 回到改版式
- 出处：scripts/baseline.mjs（基线前先过 check-style 与 validate）

## system（3 层嵌套）
- 标题：三层样式，各管一层
- 外层 base.css：画布、元素契约、形状原语 / 中层 style.css：风格的 token、字体与全部版式 / 内层 brand.css：只改 token 的品牌色
- 出处：风格库 spec §3.1

## closing
- 标题（两行）：挑一种风格， / 开始下一份。
- 命令：node scripts/new-deck.mjs my-deck --style <id>
- 说明：风格画廊：docs/styles/index.html
````

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-art.mjs tests/gen-art.test.mjs docs/golden-content.md
git commit -m "gen-art --format jpg; shared golden copy script for all styles

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Shared vocabulary, lining numerals, specimen renumbered; agenda / statement / section

**Files:**
- Modify: `styles/magazine/style.css` (vocabulary block, kpi title classes, new layout blocks)
- Modify: `styles/magazine/manifest.json` (`fonts.office`, `layouts`)
- Modify: `styles/magazine/golden/index.html` (renumber specimen, add pages 02–04)
- Modify: `styles/magazine/layouts.md`
- Create: `styles/magazine/golden/assets/img/{01-cover,02-agenda,04-section,10-kpi,14-process}.jpg`; delete the three specimen PNGs

**Interfaces:**
- Produces (used by every later task): `.mg-head` + `.mg-head1` / `.mg-head2` (half-width two-line title, 54px), `.mg-title` (full-width one-line title, 54px, top 104), `.mg-voice` (italic line at top 186, 28px), `.slide.is-dark` token set, `.mg-cap-on` (text on images), `.mg-rule` / `.mg-foot` / `.mg-pageno` (running foot).

- [ ] **Step 1: Re-render specimen imagery as JPEG and generate new images**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/art2; I=styles/magazine/golden/assets/img
rm -rf $A
node scripts/gen-art.mjs $A --style magazine --kind arch  --seed 2  --size 960x1080 --format jpg && mv $A/arch-2.jpg  $I/01-cover.jpg
node scripts/gen-art.mjs $A --style magazine --kind field --seed 2  --size 960x560  --format jpg && mv $A/field-2.jpg $I/10-kpi.jpg
node scripts/gen-art.mjs $A --style magazine --kind arch  --seed 16 --size 960x544  --format jpg && mv $A/arch-16.jpg $I/14-process.jpg
node scripts/gen-art.mjs $A/agenda  --style magazine --kind field --seed 21 --count 6 --size 696x456  --format jpg
node scripts/gen-art.mjs $A/section --style magazine --kind arch  --seed 41 --count 6 --size 1920x1080 --format jpg
git rm -q $I/01-cover.png $I/02-kpi.png $I/03-process.png
```

Build a contact sheet of `$A/agenda` and `$A/section` (HTML file of `<img>` tags opened via `file://`, screenshotted with Playwright, then Read), pick one each: agenda = calm field without a strong lemon blob; section = arch whose left half is quiet (text sits there under the scrim). Copy as `$I/02-agenda.jpg` and `$I/04-section.jpg`.

- [ ] **Step 2: Replace the vocabulary block in `style.css`** — the block from `/* ---------- vocabulary ---------- */` up to (not including) `/* ---------- magazine/cover ---------- */` becomes:

```css
/* ---------- vocabulary ---------- */
.mg-serif { font-family: var(--font-serif); font-weight: 700; color: var(--text-1); font-feature-settings: 'halt' 1; }
.mg-it { font-family: var(--font-latin); font-style: italic; font-weight: 400; line-height: 1; color: var(--text-1); }
/* lining figures: old-style 0 reads as o (failures.md #5); Office face is Times New Roman, also lining */
.mg-num { font-family: var(--font-latin); font-weight: 400; line-height: 1; letter-spacing: -0.02em; font-variant-numeric: lining-nums; color: var(--text-1); }
.mg-body { font-size: 16px; line-height: 1.65; color: var(--text-2); }
.mg-mono { font-family: var(--font-mono); font-size: 16px; line-height: 1; letter-spacing: 2px; font-weight: 400; color: var(--text-2); }
.mg-mono .is-mark { padding: 4px 8px; }
.mg-cap-on { color: var(--on-image); }
.mg-hair { background: var(--hairline); height: 1px; }
.mg-ink { background: var(--text-1); height: 2px; }
.mg-photo { object-fit: cover; }

/* ink page: statement / video / closing */
.slide.is-dark {
  --bg: #141414;
  --surface: #26241f;
  --text-1: #f1efea;
  --text-2: #a8a197;
  --hairline: #3d3a34;
}

/* heads: half-width two-line (kpi, matrix, timeline) and full-width one-line + italic voice */
.mg-head { left: 96px; width: 560px; font-size: 54px; line-height: 1.28; }
.mg-head1 { top: 104px; }
.mg-head2 { top: 173px; }
.mg-title { left: 96px; top: 104px; width: 1088px; font-size: 54px; line-height: 1.28; }
.mg-voice { left: 96px; top: 186px; width: 1088px; font-size: 28px; }

/* running heads: top-left folio, bottom rule, bottom-left foot, page number */
.mg-folio { left: 96px; top: 64px; width: 560px; }
.mg-rule { left: 96px; top: 640px; width: 1088px; }
.mg-foot { left: 96px; top: 660px; width: 840px; }
.mg-pageno { left: 1046px; top: 660px; width: 138px; text-align: right; }
```

In the kpi block delete `.mgk-title`, `.mgk-t1`, `.mgk-t2` (replaced by `.mg-head*`).

- [ ] **Step 3: Append the three new layout blocks to `style.css`**

```css
/* ---------- magazine/agenda ---------- */
.mga-title { left: 96px; top: 104px; width: 520px; font-size: 60px; line-height: 1.2; }
.mga-it { left: 96px; top: 198px; width: 520px; font-size: 32px; }
.mga-img { left: 96px; top: 272px; width: 464px; height: 304px; }
.mga-cap { left: 96px; top: 592px; width: 464px; }
.mga-num { left: 704px; width: 80px; font-size: 56px; }
.mga-h { left: 800px; width: 280px; font-size: 26px; line-height: 1.3; }
.mga-p { left: 800px; width: 280px; }
.mga-page { left: 1104px; width: 80px; text-align: right; }
.mga-hair { left: 704px; width: 480px; }

/* ---------- magazine/statement ---------- */
.mgs-quote { left: 84px; top: 64px; width: 200px; font-size: 200px; color: var(--accent); }
.mgs-line { left: 96px; width: 1088px; font-size: 64px; line-height: 1.35; }
.mgs-l1 { top: 280px; }
.mgs-l2 { top: 366px; }
.mgs-it { left: 96px; top: 480px; width: 1088px; font-size: 36px; }
.mgs-by { left: 96px; top: 548px; width: 1088px; }

/* ---------- magazine/section ---------- */
.mgx-img { left: 0; top: 0; width: 1280px; height: 720px; }
.mgx-scrim { left: 0; top: 0; width: 1280px; height: 720px; background: var(--scrim); }
.mgx-num { left: 88px; top: 236px; width: 400px; font-size: 200px; color: var(--on-image); }
.mgx-title { left: 96px; top: 448px; width: 1088px; font-size: 80px; line-height: 1.2; color: var(--on-image); }
.mgx-it { left: 96px; top: 560px; width: 1088px; font-size: 32px; color: var(--on-image); }
```

- [ ] **Step 4: Manifest** — in `styles/magazine/manifest.json` set `"Playfair Display": "Times New Roman"` and make `layouts`:

```json
  "layouts": {
    "magazine/cover": { "role": "cover" },
    "magazine/agenda": { "role": "agenda" },
    "magazine/statement": { "role": "statement" },
    "magazine/section": { "role": "section" },
    "magazine/kpi": { "role": "kpi" },
    "magazine/process": { "role": "process" }
  }
```

- [ ] **Step 5: Golden — renumber the specimen and add pages 02–04.** In `styles/magazine/golden/index.html`:
  - cover: `src="assets/img/01-cover.jpg"`; everything else unchanged (the cover carries no page number).
  - kpi: folio → `03 — QUALITY GATES`; title elements → `class="mg-serif mg-head mg-head1"` / `mg-head mg-head2` (keep `data-merge="title" data-anim="rise"`); image → `assets/img/10-kpi.jpg`; caption → `FIG. 07 — 示意图`; pageno → `10 / 18`.
  - process: image → `assets/img/14-process.jpg`; caption → `FIG. 09 — 示意图`; pageno → `14 / 18`.
  - Insert after the cover, in this order:

```html
<section class="slide" data-layout="magazine/agenda" data-role="agenda">
  <p class="mg-mono mg-folio">VOL. 01 — CONTENTS</p>
  <h2 class="mg-serif mga-title" data-anim="rise">本期目录</h2>
  <p class="mg-it mga-it" data-anim="rise">In this issue.</p>
  <img class="mg-photo mga-img" src="assets/img/02-agenda.jpg" alt="示意图：暖灰色场">
  <p class="mg-mono mga-cap">FIG. 02 — 示意图</p>
  <p class="mg-num mga-num" style="top: 104px;" data-anim="rise">01</p>
  <h3 class="mg-serif mga-h" style="top: 108px;" data-merge="r1" data-anim="rise">风格库</h3>
  <p class="mg-body mga-p" style="top: 150px;" data-merge="r1" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="mg-mono mga-page" style="top: 116px;">P. 04</p>
  <div class="mg-hair mga-hair" data-shape="rect" style="top: 216px;"></div>
  <p class="mg-num mga-num" style="top: 236px;" data-anim="rise">02</p>
  <h3 class="mg-serif mga-h" style="top: 240px;" data-merge="r2" data-anim="rise">测量与导出</h3>
  <p class="mg-body mga-p" style="top: 282px;" data-merge="r2" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="mg-mono mga-page" style="top: 248px;">P. 07</p>
  <div class="mg-hair mga-hair" data-shape="rect" style="top: 348px;"></div>
  <p class="mg-num mga-num" style="top: 368px;" data-anim="rise">03</p>
  <h3 class="mg-serif mga-h" style="top: 372px;" data-merge="r3" data-anim="rise">质量门</h3>
  <p class="mg-body mga-p" style="top: 414px;" data-merge="r3" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="mg-mono mga-page" style="top: 380px;">P. 10</p>
  <div class="mg-hair mga-hair" data-shape="rect" style="top: 480px;"></div>
  <p class="mg-num mga-num" style="top: 500px;" data-anim="rise">04</p>
  <h3 class="mg-serif mga-h" style="top: 504px;" data-merge="r4" data-anim="rise">工作流</h3>
  <p class="mg-body mga-p" style="top: 546px;" data-merge="r4" data-anim="rise">从大纲到成稿的四步</p>
  <p class="mg-mono mga-page" style="top: 512px;">P. 13</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · VOL. 01</p>
  <p class="mg-mono mg-pageno">02 / 18</p>
</section>

<section class="slide is-dark" data-layout="magazine/statement" data-role="statement">
  <p class="mg-mono mg-folio">NOTE — 设计原则</p>
  <p class="mg-num mgs-quote">“</p>
  <h2 class="mg-serif mgs-line mgs-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="mg-serif mgs-line mgs-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <p class="mg-it mgs-it" data-anim="rise">One source of truth.</p>
  <p class="mg-mono mgs-by">— SKILL.md · 设计原则</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · VOL. 01</p>
  <p class="mg-mono mg-pageno">03 / 18</p>
</section>

<section class="slide" data-layout="magazine/section" data-role="section">
  <img class="mg-photo mgx-img" src="assets/img/04-section.jpg" alt="示意图：暖灰立板构成的空间">
  <div class="mgx-scrim" data-shape="rect"></div>
  <p class="mg-mono mg-cap-on mg-folio">CHAPTER 01</p>
  <p class="mg-num mgx-num" data-anim="rise">01</p>
  <h2 class="mg-serif mgx-title" data-anim="rise">风格库</h2>
  <p class="mg-it mgx-it" data-anim="rise">Twelve ways to set a page.</p>
  <p class="mg-mono mg-cap-on mg-foot">FIG. 03 — 示意图</p>
  <p class="mg-mono mg-cap-on mg-pageno">04 / 18</p>
</section>
```

- [ ] **Step 6: `layouts.md`** — update the kpi skeleton to the renumbered golden markup, rewrite grammar item 2's numeral sentence to「数字一律 `mg-num`（Playfair 等高数字；Office 里是 Times New Roman，同为等高数字——旧式数字的 0 像字母 o，见 failures.md #5）」, add grammar item 6「**墨页**：`slide is-dark` 只给 statement / video / closing，用来打断暖纸页的节奏」, and append one entry per new layout (`## magazine/<name> · <role>` + description + the golden `<section>` verbatim). Descriptions:
  - agenda —「目录。左：页标题 + 斜体副题 + 一张图；右：3–4 行「编号 / 条目 / 一行说明 / 页码」，行间细线。条目 ≤5 字，说明 ≤14 字。」
  - statement —「金句墨页。柠檬黄大引号是全页唯一的黄；引文两行（每行一个 h2，每行 ≤10 字），斜体一句，等宽出处。」
  - section —「章节色场。满版照片 + 全幅压暗，白色大号章节数字、宋体章节名、斜体一句；照片左半要安静。」

- [ ] **Step 7: Verify batch** (routine above). Expected: validate `3`→`6 slides checked: 0 errors`; export has no `warn:` line; check the agenda right column, the dark statement page, and the white-on-scrim section in both renders.

- [ ] **Step 8: Commit**

```bash
git add -A styles/magazine
git commit -m "Magazine: shared heads, ink page, lining numerals; agenda, statement, section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: matrix / compare / image-text / image

**Files:** `styles/magazine/{style.css, manifest.json, layouts.md}`, `styles/magazine/golden/index.html`, images `05`–`08` in `golden/assets/img/`.

**Interfaces:** Consumes `.mg-head*`, `.mg-title`, `.mg-voice`, `.mg-cap-on`, running-foot classes from Task 2.

- [ ] **Step 1: Images** — generate candidates and pick via contact sheet (same procedure as Task 2):

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/art3
node scripts/gen-art.mjs $A/feature --style magazine --kind arch  --seed 71 --count 6 --size 840x780  --format jpg
node scripts/gen-art.mjs $A/plate   --style magazine --kind field --seed 81 --count 6 --size 1920x1080 --format jpg
```
Pick `07-feature.jpg` (arch, any) and `08-plate.jpg` (field whose lower-left is calm — the paper plate sits there).

- [ ] **Step 2: CSS** — append:

```css
/* ---------- magazine/matrix ---------- */
.mgm-hero { left: 84px; top: 300px; width: 400px; font-size: 200px; }
.mgm-label { left: 96px; top: 516px; width: 480px; font-size: 26px; line-height: 1.2; }
.mgm-sub { left: 96px; top: 556px; width: 480px; }
.mgm-letter { width: 40px; font-size: 32px; }
.mgm-name { width: 188px; font-size: 21px; line-height: 1.2; }
.mgm-c1 { left: 704px; }
.mgm-c1n { left: 748px; }
.mgm-c2 { left: 952px; }
.mgm-c2n { left: 996px; }
.mgm-hair { left: 704px; width: 480px; }

/* ---------- magazine/compare ---------- */
.mgv-ink { left: 96px; top: 256px; width: 1088px; }
.mgv-split { left: 640px; top: 288px; width: 1px; height: 312px; background: var(--hairline); }
.mgv-label { top: 288px; width: 480px; }
.mgv-h { top: 318px; width: 480px; font-size: 30px; line-height: 1.3; }
.mgv-p { top: 370px; width: 480px; font-size: 18px; line-height: 1.7; color: var(--text-2); }
.mgv-num { top: 470px; width: 150px; font-size: 120px; }
.mgv-nl { top: 520px; width: 320px; font-size: 21px; line-height: 1.4; }
.mgv-l { left: 96px; }
.mgv-r { left: 704px; }
.mgv-ln { left: 256px; }
.mgv-rn { left: 864px; }

/* ---------- magazine/image-text ---------- */
.mgi-img { left: 96px; top: 64px; width: 560px; height: 520px; }
.mgi-cap { left: 96px; top: 600px; width: 560px; }
.mgi-kicker { left: 704px; top: 64px; width: 480px; }
.mgi-title { left: 704px; width: 480px; font-size: 48px; line-height: 1.3; }
.mgi-t1 { top: 104px; }
.mgi-t2 { top: 166px; }
.mgi-it { left: 704px; top: 248px; width: 480px; font-size: 28px; }
.mgi-p { left: 704px; width: 480px; font-size: 18px; line-height: 1.75; color: var(--text-1); text-align: justify; }
.mgi-p1 { top: 304px; }
.mgi-p2 { top: 392px; }
.mgi-ink { left: 704px; top: 488px; width: 480px; }
.mgi-note { left: 704px; top: 508px; width: 480px; line-height: 1.6; }

/* ---------- magazine/image ---------- */
.mgf-img { left: 0; top: 0; width: 1280px; height: 720px; }
.mgf-plate { left: 64px; top: 440px; width: 576px; height: 216px; background: var(--bg); }
.mgf-cap { left: 96px; top: 472px; width: 512px; }
.mgf-title { left: 96px; top: 508px; width: 512px; font-size: 40px; line-height: 1.3; }
.mgf-p { left: 96px; top: 576px; width: 512px; }
```

- [ ] **Step 3: Manifest** — add `"magazine/matrix": { "role": "matrix" }`, `"magazine/compare": { "role": "compare" }`, `"magazine/image-text": { "role": "image-text" }`, `"magazine/image": { "role": "image" }`.

- [ ] **Step 4: Golden** — insert after the section page (pages 05–08):

```html
<section class="slide" data-layout="magazine/matrix" data-role="matrix">
  <p class="mg-mono mg-folio">01 — STYLE INDEX</p>
  <h2 class="mg-serif mg-head mg-head1" data-merge="title" data-anim="rise">十二种风格，</h2>
  <h2 class="mg-serif mg-head mg-head2" data-merge="title" data-anim="rise">按场合挑一种。</h2>
  <p class="mg-num mgm-hero" data-anim="count">12</p>
  <p class="mg-serif mgm-label" data-merge="hero" data-anim="rise">种风格</p>
  <p class="mg-body mgm-sub" data-merge="hero" data-anim="rise">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <p class="mg-num mgm-letter mgm-c1" style="top: 104px;">A</p><p class="mg-serif mgm-name mgm-c1n" style="top: 112px;"><span class="is-mark">杂志 · 暖纸</span></p>
  <p class="mg-num mgm-letter mgm-c2" style="top: 104px;">G</p><p class="mg-serif mgm-name mgm-c2n" style="top: 112px;">摄影集 · 画册</p>
  <div class="mg-hair mgm-hair" data-shape="rect" style="top: 164px;"></div>
  <p class="mg-num mgm-letter mgm-c1" style="top: 188px;">B</p><p class="mg-serif mgm-name mgm-c1n" style="top: 196px;">瑞士 · 网格</p>
  <p class="mg-num mgm-letter mgm-c2" style="top: 188px;">H</p><p class="mg-serif mgm-name mgm-c2n" style="top: 196px;">咨询 · 白皮书</p>
  <div class="mg-hair mgm-hair" data-shape="rect" style="top: 248px;"></div>
  <p class="mg-num mgm-letter mgm-c1" style="top: 272px;">C</p><p class="mg-serif mgm-name mgm-c1n" style="top: 280px;">发布会 · 暗场</p>
  <p class="mg-num mgm-letter mgm-c2" style="top: 272px;">I</p><p class="mg-serif mgm-name mgm-c2n" style="top: 280px;">日式 · 极简</p>
  <div class="mg-hair mgm-hair" data-shape="rect" style="top: 332px;"></div>
  <p class="mg-num mgm-letter mgm-c1" style="top: 356px;">D</p><p class="mg-serif mgm-name mgm-c1n" style="top: 364px;">报刊 · 版面</p>
  <p class="mg-num mgm-letter mgm-c2" style="top: 356px;">J</p><p class="mg-serif mgm-name mgm-c2n" style="top: 364px;">拼贴 · 手账</p>
  <div class="mg-hair mgm-hair" data-shape="rect" style="top: 416px;"></div>
  <p class="mg-num mgm-letter mgm-c1" style="top: 440px;">E</p><p class="mg-serif mgm-name mgm-c1n" style="top: 448px;">大字报 · 粗野</p>
  <p class="mg-num mgm-letter mgm-c2" style="top: 440px;">K</p><p class="mg-serif mgm-name mgm-c2n" style="top: 448px;">新中式 · 东方</p>
  <div class="mg-hair mgm-hair" data-shape="rect" style="top: 500px;"></div>
  <p class="mg-num mgm-letter mgm-c1" style="top: 524px;">F</p><p class="mg-serif mgm-name mgm-c1n" style="top: 532px;">柔和 · 产品</p>
  <p class="mg-num mgm-letter mgm-c2" style="top: 524px;">L</p><p class="mg-serif mgm-name mgm-c2n" style="top: 532px;">工程制图</p>
  <div class="mg-hair mgm-hair" data-shape="rect" style="top: 584px;"></div>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">Source — 风格库设计规格 2026-10-08 §2</p>
  <p class="mg-mono mg-pageno">05 / 18</p>
</section>

<section class="slide" data-layout="magazine/compare" data-role="compare">
  <p class="mg-mono mg-folio">01 — BEFORE / AFTER</p>
  <h2 class="mg-serif mg-title" data-anim="rise">换皮，不如换版面。</h2>
  <p class="mg-it mg-voice" data-anim="rise">Same content, new pages.</p>
  <div class="mg-ink mgv-ink" data-shape="rect" data-anim="draw"></div>
  <div class="mgv-split" data-shape="rect"></div>
  <p class="mg-mono mgv-label mgv-l">BEFORE</p>
  <h3 class="mg-serif mgv-h mgv-l" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="mgv-p mgv-l" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <p class="mg-num mgv-num mgv-l" data-anim="count">24</p>
  <p class="mg-serif mgv-nl mgv-ln" data-anim="rise">个版式，三套系统共用</p>
  <p class="mg-mono mgv-label mgv-r">AFTER</p>
  <h3 class="mg-serif mgv-h mgv-r" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="mgv-p mgv-r" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <p class="mg-num mgv-num mgv-r" data-anim="count">12</p>
  <p class="mg-serif mgv-nl mgv-rn" data-anim="rise">种风格，各有<span class="is-mark">一套版式</span></p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · VOL. 01</p>
  <p class="mg-mono mg-pageno">06 / 18</p>
</section>

<section class="slide" data-layout="magazine/image-text" data-role="image-text">
  <img class="mg-photo mgi-img" src="assets/img/07-feature.jpg" alt="示意图：暖灰立板与光">
  <p class="mg-mono mgi-cap">FIG. 04 — 示意图</p>
  <p class="mg-mono mgi-kicker">02 — MEASURED EXPORT</p>
  <h2 class="mg-serif mgi-title mgi-t1" data-merge="title" data-anim="rise">所见即所得，</h2>
  <h2 class="mg-serif mgi-title mgi-t2" data-merge="title" data-anim="rise">靠的是测量。</h2>
  <p class="mg-it mgi-it" data-anim="rise">Measure first, then draw.</p>
  <p class="mgi-p mgi-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="mgi-p mgi-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="mg-ink mgi-ink" data-shape="rect" data-anim="draw"></div>
  <p class="mg-mono mgi-note">PRIMITIVES — ROUNDRECT · LINE · CHEVRON · ROTATE · SHADOW · EAVERT</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · VOL. 01</p>
  <p class="mg-mono mg-pageno">07 / 18</p>
</section>

<section class="slide" data-layout="magazine/image" data-role="image">
  <img class="mg-photo mgf-img" src="assets/img/08-plate.jpg" alt="示意图：柔和的暖灰色场">
  <div class="mgf-plate" data-shape="rect"></div>
  <p class="mg-mono mgf-cap">FIG. 05 — 示意图</p>
  <h2 class="mg-serif mgf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="mg-body mgf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="mg-mono mg-cap-on mg-pageno">08 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append four entries (description + golden `<section>` verbatim):
  - matrix —「盘点 + 总数。左：两行标题、大号总数、标签与一句分组说明；右：两列 × 6 行「字母 / 名称」，行间细线。当前项用 `is-mark`。8–12 项，名称 ≤7 字。」
  - compare —「二元对比。整行标题 + 斜体副题 + 粗线；左右两栏「等宽标签 / 小标题 / 两行说明 / 大数字 + 一句数字说明」，中间竖细线。数字必须真实。」
  - image-text —「图文专题。左大图（560×520）带图注，右栏等宽 kicker、两行标题、斜体副题、两段正文（每段 ≤50 字）、粗线与等宽注脚。」
  - image —「满版照片 + 暖纸图注牌：左下角纸色牌子里放图注、一句标题、一句说明。照片左下要安静。」

- [ ] **Step 6: Verify batch.** Expected `10 slides checked: 0 errors`. If R5 (density) warns on matrix, report the exact warning text in the commit body and keep the page (12 named items is the role's definition); do not delete items.

- [ ] **Step 7: Commit** — `git add -A styles/magazine && git commit -m "Magazine: matrix, compare, image-text, image" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 4: points / bars / table

**Files:** `styles/magazine/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `09-points-{1,2,3}.jpg`.

**Interfaces:** Consumes `.mg-title`, `.mg-voice`, running foot. Bars rely on the P0 contract: `data-role="bars"`, `data-value`/`data-label` on bar shapes, `data-chart` on texts the native chart replaces, R8 width ∝ value.

- [ ] **Step 1: Images**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/art4
node scripts/gen-art.mjs $A --style magazine --kind arch --seed 91 --count 6 --size 504x294 --format jpg
```
Pick three that read as a set (at most one with lemon) → `09-points-1.jpg`, `09-points-2.jpg`, `09-points-3.jpg`.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- magazine/points ---------- */
.mgt-img { top: 248px; width: 336px; height: 196px; }
.mgt-h { top: 468px; width: 336px; font-size: 26px; line-height: 1.3; }
.mgt-p { top: 510px; width: 336px; }
.mgt-c1 { left: 96px; }
.mgt-c2 { left: 472px; }
.mgt-c3 { left: 848px; }

/* ---------- magazine/bars ---------- */
/* bar width = value × 140px (max 4 → 560px); value text sits 20px after the bar end, rule ids 52px after that */
.mgb-label { left: 96px; width: 220px; font-size: 21px; line-height: 1.3; }
.mgb-bar { left: 336px; height: 28px; background: var(--text-1); }
.mgb-key { background: var(--mark); }
.mgb-val { width: 48px; font-size: 40px; }
.mgb-ids { width: 216px; }

/* ---------- magazine/table ---------- */
.mgd-head { top: 248px; }
.mgd-ink { left: 96px; top: 276px; width: 1088px; }
.mgd-k { left: 96px; width: 240px; font-size: 21px; line-height: 1.3; }
.mgd-v { left: 376px; width: 520px; font-size: 18px; line-height: 1.4; color: var(--text-1); }
.mgd-s { left: 936px; width: 248px; }
.mgd-hair { left: 96px; width: 1088px; }
```

- [ ] **Step 3: Manifest** — add `"magazine/points": { "role": "points" }`, `"magazine/bars": { "role": "bars" }`, `"magazine/table": { "role": "table" }`.

- [ ] **Step 4: Golden** — insert `points` after `image` (page 09), and `bars`, `table` after `kpi` (pages 11, 12):

```html
<section class="slide" data-layout="magazine/points" data-role="points">
  <p class="mg-mono mg-folio">02 — THREE PROMISES</p>
  <h2 class="mg-serif mg-title" data-anim="rise">三件事，件件可验证。</h2>
  <p class="mg-it mg-voice" data-anim="rise">Three promises, all checkable.</p>
  <img class="mg-photo mgt-img mgt-c1" src="assets/img/09-points-1.jpg" alt="示意图：暖灰立板">
  <h3 class="mg-serif mgt-h mgt-c1" data-merge="c1" data-anim="rise">浏览器里演示</h3>
  <p class="mg-body mgt-p mgt-c1" data-merge="c1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <img class="mg-photo mgt-img mgt-c2" src="assets/img/09-points-2.jpg" alt="示意图：暖灰立板">
  <h3 class="mg-serif mgt-h mgt-c2" data-merge="c2" data-anim="rise">可编辑的 PPTX</h3>
  <p class="mg-body mgt-p mgt-c2" data-merge="c2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <img class="mg-photo mgt-img mgt-c3" src="assets/img/09-points-3.jpg" alt="示意图：暖灰立板">
  <h3 class="mg-serif mgt-h mgt-c3" data-merge="c3" data-anim="rise">机器先<span class="is-mark">把关</span></h3>
  <p class="mg-body mgt-p mgt-c3" data-merge="c3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">FIG. 06 — 三幅均为示意图</p>
  <p class="mg-mono mg-pageno">09 / 18</p>
</section>
```

```html
<section class="slide" data-layout="magazine/bars" data-role="bars">
  <p class="mg-mono mg-folio">03 — RULES BY CONCERN</p>
  <h2 class="mg-serif mg-title" data-anim="rise">十六条规则，各管一摊。</h2>
  <p class="mg-it mg-voice" data-anim="rise">Sixteen rules, six concerns.</p>
  <p class="mg-serif mgb-label" style="top: 258px;" data-chart>排版与几何</p>
  <div class="mgb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 258px; width: 560px;"></div>
  <p class="mg-num mgb-val" style="top: 250px; left: 916px;" data-chart>4</p>
  <p class="mg-mono mgb-ids" style="top: 264px; left: 968px;" data-chart>R3 · R4 · R7 · R9</p>
  <p class="mg-serif mgb-label" style="top: 314px;" data-chart>版式与样式</p>
  <div class="mgb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 314px; width: 560px;"></div>
  <p class="mg-num mgb-val" style="top: 306px; left: 916px;" data-chart>4</p>
  <p class="mg-mono mgb-ids" style="top: 320px; left: 968px;" data-chart>R1 · R2 · R6 · R12</p>
  <p class="mg-serif mgb-label" style="top: 370px;" data-chart>内容与数据</p>
  <div class="mgb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 370px; width: 420px;"></div>
  <p class="mg-num mgb-val" style="top: 362px; left: 776px;" data-chart>3</p>
  <p class="mg-mono mgb-ids" style="top: 376px; left: 828px;" data-chart>R5 · R8 · R14</p>
  <p class="mg-serif mgb-label" style="top: 426px;" data-chart>可访问与媒体</p>
  <div class="mgb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 426px; width: 420px;"></div>
  <p class="mg-num mgb-val" style="top: 418px; left: 776px;" data-chart>3</p>
  <p class="mg-mono mgb-ids" style="top: 432px; left: 828px;" data-chart>R10 · R11 · R13</p>
  <p class="mg-serif mgb-label" style="top: 482px;" data-chart>节奏</p>
  <div class="mgb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 482px; width: 140px;"></div>
  <p class="mg-num mgb-val" style="top: 474px; left: 496px;" data-chart>1</p>
  <p class="mg-mono mgb-ids" style="top: 488px; left: 548px;" data-chart>R15</p>
  <p class="mg-serif mgb-label" style="top: 538px;" data-chart>导出一致</p>
  <div class="mgb-bar mgb-key" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 538px; width: 140px;"></div>
  <p class="mg-num mgb-val" style="top: 530px; left: 496px;" data-chart>1</p>
  <p class="mg-mono mgb-ids" style="top: 544px; left: 548px;" data-chart>R16</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot" data-source>Source — scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="mg-mono mg-pageno">11 / 18</p>
</section>

<section class="slide" data-layout="magazine/table" data-role="table">
  <p class="mg-mono mg-folio">03 — SPEC SHEET</p>
  <h2 class="mg-serif mg-title" data-anim="rise">一页纸，看懂规格。</h2>
  <p class="mg-it mg-voice" data-anim="rise">The fine print.</p>
  <p class="mg-mono mgd-head" style="left: 96px;">ITEM</p>
  <p class="mg-mono mgd-head" style="left: 376px;">SPEC</p>
  <p class="mg-mono mgd-head" style="left: 936px;">SOURCE</p>
  <div class="mg-ink mgd-ink" data-shape="rect" data-anim="draw"></div>
  <p class="mg-serif mgd-k" style="top: 296px;">画布</p>
  <p class="mgd-v" style="top: 299px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="mg-mono mgd-s" style="top: 300px;">assets/base.css</p>
  <div class="mg-hair mgd-hair" data-shape="rect" style="top: 336px;"></div>
  <p class="mg-serif mgd-k" style="top: 348px;">字号下限</p>
  <p class="mgd-v" style="top: 351px;">16 px，溢出先删字、再换版式</p>
  <p class="mg-mono mgd-s" style="top: 352px;">validate.mjs · R4</p>
  <div class="mg-hair mgd-hair" data-shape="rect" style="top: 388px;"></div>
  <p class="mg-serif mgd-k" style="top: 400px;">校验规则</p>
  <p class="mgd-v" style="top: 403px;">R1–R16，错误清零才能交付</p>
  <p class="mg-mono mgd-s" style="top: 404px;">validate.mjs</p>
  <div class="mg-hair mgd-hair" data-shape="rect" style="top: 440px;"></div>
  <p class="mg-serif mgd-k" style="top: 452px;">导出格式</p>
  <p class="mgd-v" style="top: 455px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="mg-mono mgd-s" style="top: 456px;">SKILL.md</p>
  <div class="mg-hair mgd-hair" data-shape="rect" style="top: 492px;"></div>
  <p class="mg-serif mgd-k" style="top: 504px;">页面角色</p>
  <p class="mgd-v" style="top: 507px;">20 个，其中 12 个核心角色</p>
  <p class="mg-mono mgd-s" style="top: 508px;">lib/roles.mjs</p>
  <div class="mg-hair mgd-hair" data-shape="rect" style="top: 544px;"></div>
  <p class="mg-serif mgd-k" style="top: 556px;">字体</p>
  <p class="mgd-v" style="top: 559px;">SIL OFL 开源字体，按 deck 用字<span class="is-mark">子集化</span></p>
  <p class="mg-mono mgd-s" style="top: 560px;">fetch-fonts.mjs</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot" data-source>Source — 本仓库 SKILL.md · scripts/ · assets/base.css</p>
  <p class="mg-mono mg-pageno">12 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append three entries:
  - points —「三个并列要点，每项「图 / 小标题 / 两行说明」。三张图一个图注写在页脚；说明 ≤28 字。」
  - bars —「条形对比（3–6 行）。条长 = 数值 × 140px（最大值 4 时满长 560px，最大值不同就按 560 ÷ 最大值换算单位长度），数值紧跟条尾 20px，等宽注释再后 52px；只有一根条用 `mgb-key` 标黄。页脚 `data-source` 必填。」
  - table —「规格表（4–6 行）。等宽表头 + 粗线，每行「项目 / 规格 / 出处」，行距 52px、行间细线。规格 ≤28 字。页脚 `data-source` 必填。」

- [ ] **Step 6: Verify batch** — plus native-chart smoke: `node scripts/export-pptx.mjs $G --out /tmp/mg-native.pptx --native-charts && node scripts/check-pptx.mjs /tmp/mg-native.pptx` → 0 errors; unzip and confirm slide 11 has a `c:chart` relationship (`unzip -l /tmp/mg-native.pptx | grep -c chart` ≥ 1). Expected `13 slides checked: 0 errors`.

- [ ] **Step 7: Commit** — `git add -A styles/magazine && git commit -m "Magazine: points, bars, table" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 5: timeline / gallery / closing

**Files:** `styles/magazine/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `15-timeline.jpg`, `16-gallery-{1,2,3}.jpg`, `18-closing.jpg`.

**Interfaces:** Consumes `.mg-head*`, `.mg-title`, `.mg-voice`, `.slide.is-dark`, running foot.

- [ ] **Step 1: Images**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/art5
node scripts/gen-art.mjs $A/tl  --style magazine --kind field --seed 151 --count 4 --size 720x390  --format jpg
node scripts/gen-art.mjs $A/g1  --style magazine --kind arch  --seed 161 --count 4 --size 780x468  --format jpg
node scripts/gen-art.mjs $A/g2  --style magazine --kind field --seed 165 --count 4 --size 396x468  --format jpg
node scripts/gen-art.mjs $A/g3  --style magazine --kind arch  --seed 169 --count 4 --size 396x468  --format jpg
node scripts/gen-art.mjs $A/end --style magazine --kind arch  --seed 181 --count 4 --size 960x1080 --format jpg
```
Pick by contact sheet → `15-timeline.jpg`, `16-gallery-1.jpg` (g1), `16-gallery-2.jpg` (g2), `16-gallery-3.jpg` (g3), `18-closing.jpg` (end; lower-left quiet for the white caption).

- [ ] **Step 2: CSS** — append:

```css
/* ---------- magazine/timeline ---------- */
.mgl-it { left: 96px; top: 256px; width: 560px; font-size: 28px; }
.mgl-img { left: 704px; top: 64px; width: 480px; height: 260px; }
.mgl-cap { left: 704px; top: 340px; width: 480px; }
.mgl-date { top: 404px; width: 200px; font-size: 44px; }
.mgl-ink { left: 96px; top: 468px; width: 1088px; }
.mgl-tick { top: 460px; width: 2px; height: 18px; background: var(--text-1); }
.mgl-h { top: 492px; width: 196px; font-size: 22px; line-height: 1.3; }
.mgl-p { top: 528px; width: 196px; }
.mgl-c1 { left: 96px; }
.mgl-c2 { left: 314px; }
.mgl-c3 { left: 532px; }
.mgl-c4 { left: 750px; }
.mgl-c5 { left: 968px; }

/* ---------- magazine/gallery ---------- */
.mgg-img { top: 248px; height: 312px; }
.mgg-cap { top: 576px; }
.mgg-w1 { left: 96px; width: 520px; }
.mgg-w2 { left: 636px; width: 264px; }
.mgg-w3 { left: 920px; width: 264px; }

/* ---------- magazine/closing ---------- */
.mge-img { left: 0; top: 0; width: 640px; height: 720px; }
.mge-cap { left: 32px; top: 664px; width: 576px; }
.mge-it { left: 704px; top: 112px; width: 480px; font-size: 80px; }
.mge-title { left: 704px; width: 480px; font-size: 44px; line-height: 1.3; }
.mge-t1 { top: 240px; }
.mge-t2 { top: 297px; }
.mge-label { left: 704px; top: 400px; width: 480px; }
.mge-cmd { left: 704px; top: 432px; width: 480px; font-family: var(--font-mono); font-size: 18px; line-height: 1.6; color: var(--text-1); }
.mge-p { left: 704px; top: 520px; width: 480px; }
.mge-hair { left: 704px; top: 640px; width: 480px; }
.mge-meta { left: 704px; top: 660px; width: 320px; }
```

- [ ] **Step 3: Manifest** — add `"magazine/timeline": { "role": "timeline" }`, `"magazine/gallery": { "role": "gallery" }`, `"magazine/closing": { "role": "closing" }`.

- [ ] **Step 4: Golden** — after `process` insert `timeline` (15) and `gallery` (16); `closing` goes last (18):

```html
<section class="slide" data-layout="magazine/timeline" data-role="timeline">
  <p class="mg-mono mg-folio">04 — CHRONICLE</p>
  <h2 class="mg-serif mg-head mg-head1" data-merge="title" data-anim="rise">从一套版式，</h2>
  <h2 class="mg-serif mg-head mg-head2" data-merge="title" data-anim="rise">到一座风格库。</h2>
  <p class="mg-it mgl-it" data-anim="rise">From one system to a library.</p>
  <img class="mg-photo mgl-img" src="assets/img/15-timeline.jpg" alt="示意图：柔和的暖灰色场">
  <p class="mg-mono mgl-cap">FIG. 10 — 示意图</p>
  <p class="mg-num mgl-date mgl-c1" data-anim="rise">07.16</p>
  <p class="mg-num mgl-date mgl-c2" data-anim="rise">07.18</p>
  <p class="mg-num mgl-date mgl-c3" data-anim="rise">08.17</p>
  <p class="mg-num mgl-date mgl-c4" data-anim="rise">08.18</p>
  <p class="mg-num mgl-date mgl-c5" data-anim="rise">10.08</p>
  <div class="mg-ink mgl-ink" data-shape="rect" data-anim="draw"></div>
  <div class="mgl-tick mgl-c1" data-shape="rect"></div>
  <div class="mgl-tick mgl-c2" data-shape="rect"></div>
  <div class="mgl-tick mgl-c3" data-shape="rect"></div>
  <div class="mgl-tick mgl-c4" data-shape="rect"></div>
  <div class="mgl-tick mgl-c5" data-shape="rect"></div>
  <h3 class="mg-serif mgl-h mgl-c1" data-merge="c1" data-anim="rise">首版发布</h3>
  <p class="mg-body mgl-p mgl-c1" data-merge="c1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <h3 class="mg-serif mgl-h mgl-c2" data-merge="c2" data-anim="rise">墨韵衬线</h3>
  <p class="mg-body mgl-p mgl-c2" data-merge="c2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <h3 class="mg-serif mgl-h mgl-c3" data-merge="c3" data-anim="rise">校验全覆盖</h3>
  <p class="mg-body mgl-p mgl-c3" data-merge="c3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <h3 class="mg-serif mgl-h mgl-c4" data-merge="c4" data-anim="rise">瑞士国际</h3>
  <p class="mg-body mgl-p mgl-c4" data-merge="c4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <h3 class="mg-serif mgl-h mgl-c5" data-merge="c5" data-anim="rise"><span class="is-mark">风格库</span></h3>
  <p class="mg-body mgl-p mgl-c5" data-merge="c5" data-anim="rise">十二种风格，每种独立版式集。</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">Source — git log · 2026-07-16 → 2026-10-08</p>
  <p class="mg-mono mg-pageno">15 / 18</p>
</section>

<section class="slide" data-layout="magazine/gallery" data-role="gallery">
  <p class="mg-mono mg-folio">04 — IMAGERY</p>
  <h2 class="mg-serif mg-title" data-anim="rise">配图由脚本生成，按风格取色。</h2>
  <p class="mg-it mg-voice" data-anim="rise">Seeded, repeatable, on palette.</p>
  <img class="mg-photo mgg-img mgg-w1" src="assets/img/16-gallery-1.jpg" alt="示意图：暖灰立板构成的空间">
  <img class="mg-photo mgg-img mgg-w2" src="assets/img/16-gallery-2.jpg" alt="示意图：柔和色场">
  <img class="mg-photo mgg-img mgg-w3" src="assets/img/16-gallery-3.jpg" alt="示意图：暖灰立板">
  <p class="mg-mono mgg-cap mgg-w1">FIG. 11 — 示意图</p>
  <p class="mg-mono mgg-cap mgg-w2">FIG. 12 — 示意图</p>
  <p class="mg-mono mgg-cap mgg-w3">FIG. 13 — 示意图</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">Source — scripts/gen-art.mjs · 固定种子，输出可复现</p>
  <p class="mg-mono mg-pageno">16 / 18</p>
</section>
```

```html
<section class="slide is-dark" data-layout="magazine/closing" data-role="closing">
  <img class="mg-photo mge-img" src="assets/img/18-closing.jpg" alt="示意图：暖灰立板构成的空间">
  <p class="mg-mono mg-cap-on mge-cap">FIG. 15 — 示意图</p>
  <p class="mg-it mge-it" data-anim="rise">Thank you.</p>
  <h2 class="mg-serif mge-title mge-t1" data-merge="title" data-anim="rise">挑一种风格，</h2>
  <h2 class="mg-serif mge-title mge-t2" data-merge="title" data-anim="rise"><span class="is-mark">开始下一份。</span></h2>
  <p class="mg-mono mge-label">START — 新建 DECK</p>
  <p class="mge-cmd">node scripts/new-deck.mjs my-deck --style magazine</p>
  <p class="mg-body mge-p">风格画廊：docs/styles/index.html</p>
  <div class="mg-hair mge-hair" data-shape="rect"></div>
  <p class="mg-mono mge-meta">VOL. 01 — END</p>
  <p class="mg-mono mg-pageno">18 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append:
  - timeline —「时间线（4–5 个节点）。左上两行标题 + 斜体副题，右上图；粗线上方是 Playfair 日期，线上小刻度，线下「节点名 / 两行说明」。只给最新节点标黄。说明 ≤18 字。」
  - gallery —「图集（3 张）。整行标题 + 斜体副题，一大两小三张图，每张下方等宽图注。」
  - closing —「结尾墨页，与封面镜像：左半幅照片，右栏斜体致谢、两行宋体标题（第二行标黄）、等宽命令与一句说明。」

- [ ] **Step 6: Verify batch.** Expected `16 slides checked: 0 errors`.

- [ ] **Step 7: Commit** — `git add -A styles/magazine && git commit -m "Magazine: timeline, gallery, closing" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 6: video / audio

**Files:** `styles/magazine/{style.css, manifest.json, layouts.md}`, golden `index.html`, `golden/assets/media/{13-film.mp4, 13-film-poster.jpg, 17-tone.mp3}`, `golden/assets/img/17-audio.jpg`.

**Interfaces:** P0 media contract — `<video>` needs `poster` + `aria-label` (R13/R10); `<audio>` needs `controls` + `aria-label`; `data-media="toggle|track|progress|clock"` drive playback (`assets/enhance.js`); the exporter embeds media with the rendered poster as cover.

- [ ] **Step 1: Media**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/art6; M=styles/magazine/golden/assets/media
mkdir -p $M
node scripts/gen-art.mjs $A --style magazine --kind field --seed 131 --size 1920x1080 --format jpg
ffmpeg -y -loglevel error -loop 1 -i $A/field-131.jpg -vf "zoompan=z='min(zoom+0.0008,1.15)':d=192:s=1280x720:fps=24,format=yuv420p" -t 8 -c:v libx264 -crf 30 -preset slow -movflags +faststart -an $M/13-film.mp4
ffmpeg -y -loglevel error -i $M/13-film.mp4 -frames:v 1 -q:v 4 $M/13-film-poster.jpg
cp examples/media/assets/media/demo.mp3 $M/17-tone.mp3
node scripts/gen-art.mjs $A/sq --style magazine --kind field --seed 171 --count 4 --size 672x672 --format jpg
ffprobe -v error -show_entries format=duration -of csv=p=0 $M/13-film.mp4 $M/17-tone.mp3   # expect 8.0 / 8.0
ls -la $M                                                                                    # mp4 should stay under ~1MB
```
Pick one square → `styles/magazine/golden/assets/img/17-audio.jpg`.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- magazine/video ---------- */
.mgw-video { left: 96px; top: 104px; width: 768px; height: 432px; object-fit: cover; background: #000; }
.mgw-cap { left: 96px; top: 552px; width: 768px; }
.mgw-title { left: 912px; top: 104px; width: 272px; font-size: 36px; line-height: 1.35; }
.mgw-it { left: 912px; top: 170px; width: 272px; font-size: 26px; }
.mgw-p { left: 912px; top: 220px; width: 272px; }
.mgw-hint { left: 912px; top: 324px; width: 272px; }

/* ---------- magazine/audio ---------- */
.mgo-img { left: 96px; top: 104px; width: 448px; height: 448px; }
.mgo-cap { left: 96px; top: 568px; width: 448px; }
.mgo-title { left: 608px; top: 104px; width: 576px; font-size: 54px; line-height: 1.28; }
.mgo-it { left: 608px; top: 186px; width: 576px; font-size: 28px; }
.mgo-p { left: 608px; top: 240px; width: 576px; }
.mgo-play { left: 608px; top: 420px; width: 72px; height: 72px; background: var(--accent); }
.mgo-glyph { left: 608px; top: 438px; width: 72px; text-align: center; font-size: 24px; line-height: 1.5; color: var(--on-accent); }
.mgo-audio { left: 608px; top: 420px; width: 72px; height: 72px; opacity: 0; pointer-events: none; }
.mgo-track { left: 712px; top: 424px; width: 472px; font-size: 24px; line-height: 1.3; }
.mgo-meta { left: 712px; top: 464px; width: 472px; }
.mgo-bar { left: 712px; top: 500px; width: 472px; height: 2px; background: var(--hairline); }
.mgo-progress { left: 712px; top: 500px; width: 0; height: 2px; background: var(--text-1); }
.mgo-time { left: 712px; top: 516px; width: 472px; }
```

- [ ] **Step 3: Manifest** — add `"magazine/video": { "role": "video" }`, `"magazine/audio": { "role": "audio" }`.

- [ ] **Step 4: Golden** — `video` after `table` (13), `audio` after `gallery` (17):

```html
<section class="slide is-dark" data-layout="magazine/video" data-role="video">
  <p class="mg-mono mg-folio">04 — FILM</p>
  <video class="mgw-video" src="assets/media/13-film.mp4" poster="assets/media/13-film-poster.jpg" aria-label="示意视频：暖灰色场缓慢推近" preload="none"></video>
  <p class="mg-mono mgw-cap">FIG. 08 — 示意视频，由抽象图生成</p>
  <h2 class="mg-serif mgw-title" data-anim="rise">视频也能放进来</h2>
  <p class="mg-it mgw-it" data-anim="rise">Click to play.</p>
  <p class="mg-body mgw-p" data-anim="rise">演示时点击画面播放；渲染图、PDF 与 PPTX 的静止画面锁定在封面帧。</p>
  <p class="mg-mono mgw-hint"><span class="is-mark">0:08</span> · MP4</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · VOL. 01</p>
  <p class="mg-mono mg-pageno">13 / 18</p>
</section>
```

```html
<section class="slide" data-layout="magazine/audio" data-role="audio">
  <p class="mg-mono mg-folio">04 — AUDIO</p>
  <img class="mg-photo mgo-img" src="assets/img/17-audio.jpg" alt="示意图：柔和色场">
  <p class="mg-mono mgo-cap">FIG. 14 — 示意图</p>
  <h2 class="mg-serif mgo-title" data-anim="rise">边听边翻页</h2>
  <p class="mg-it mgo-it" data-anim="rise">Listen while you flip.</p>
  <p class="mg-body mgo-p" data-anim="rise">音频放在 deck 目录里，演示时点圆点播放；导出 PPTX 后仍能在演示软件里播放。</p>
  <div class="mgo-play" data-shape="ellipse" data-media="toggle"></div>
  <p class="mgo-glyph">▶</p>
  <audio class="mgo-audio" src="assets/media/17-tone.mp3" aria-label="示意音频：一段 8 秒提示音" controls preload="none"></audio>
  <h3 class="mg-serif mgo-track">示意音频 · 提示音</h3>
  <p class="mg-mono mgo-meta">0:08 · MP3 · 示意素材</p>
  <div class="mgo-bar" data-shape="rect" data-media="track"></div>
  <div class="mgo-progress" data-shape="rect" data-media="progress"></div>
  <p class="mg-mono mgo-time" data-media="clock">0:00 / 0:08</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · VOL. 01</p>
  <p class="mg-mono mg-pageno">17 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append:
  - video —「视频墨页。左 16:9 视频（默认停在封面帧，点击播放），下方等宽图注；右栏标题、斜体一句、说明与时长（时长标黄）。`poster` 与 `aria-label` 必填，时长写真实值。」
  - audio —「音频页。左方图带图注；右栏标题、斜体一句、说明，下方播放器：柠檬黄圆点（`data-media="toggle"`，全页唯一的黄）、音轨名、等宽元信息、进度线与时间。`<audio>` 必带 `controls` 与 `aria-label`，时长写真实值。」

- [ ] **Step 6: Verify batch** — plus: `unzip -l $G/deck.pptx | grep -E "media.*\.(mp4|mp3)"` lists both files; open `$G/index.html` in Chromium via Playwright, go to slide 17, click `.mgo-play`, wait 1.5 s, assert `.mgo-progress` width > 0 (enhance wiring):

```bash
node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto("file://" + process.cwd() + "/styles/magazine/golden/index.html#17");
  await p.keyboard.press("f").catch(() => {});
  await p.locator(".mgo-play").click(); await p.waitForTimeout(1500);
  const w = await p.locator(".mgo-progress").evaluate((e) => e.getBoundingClientRect().width);
  console.log("progress px", w); await b.close(); process.exit(w > 0 ? 0 : 1);
})();'
```
If the hash/present-mode entry differs, read `assets/runtime.js` for the slide-navigation API and adapt the two navigation lines only. Expected `18 slides checked: 0 errors`.

- [ ] **Step 7: Commit** — `git add -A styles/magazine && git commit -m "Magazine: video and audio" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 7: Ship A — ready status, rhythm, baseline, gallery, CI, docs, sync

**Files:**
- Modify: `styles/magazine/manifest.json` (`"status": "ready"`), `styles/magazine/layouts.md` (status line)
- Modify: `.github/workflows/validate.yml`
- Modify: `SKILL.md`, `README.md`, `README.en.md`, `ARCHITECTURE.md` (directory tree line for styles)
- Create: `baselines/styles/magazine/slide-{1..18}.png`, `docs/styles/magazine.png`; regenerate `docs/styles/index.html`, `docs/styles/gallery.png`

- [ ] **Step 1: Ready gate.** Set `"status": "ready"`; `layouts.md` status line →「状态：ready · 18 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / gallery / video / audio。」 Run `node scripts/check-style.mjs styles/magazine` → `0 errors, 0 warnings`. Run `node scripts/validate.mjs styles/magazine/golden --office` → `0 errors`; any R15 rhythm warning must be fixed by reordering only if it contradicts the page-order table; R5 on matrix (if present) is accepted and noted in layouts.md under matrix.

- [ ] **Step 2: Full visual pass.** Render, export, LibreOffice-render all 18 pages (verify routine) and Read every pair. Fix anything on the checklist in `style.css` / golden, re-run, then `node scripts/new-deck.mjs styles/magazine/golden --refresh`.

- [ ] **Step 3: Baseline + regress**

```bash
node scripts/baseline.mjs          # gates on check-style + validate, re-records every golden
git status --short baselines/      # only baselines/styles/magazine/* may be new; any modified legacy/swiss PNG = regression, stop and investigate
node scripts/regress.mjs           # every page 0.00%
```

- [ ] **Step 4: Gallery** — `node scripts/style-gallery.mjs`; Read `docs/styles/gallery.png`; A card shows the magazine cover.

- [ ] **Step 5: CI** — in `.github/workflows/validate.yml` replace the line `node scripts/validate.mjs styles/swiss/golden` with

```yaml
          for g in styles/*/golden; do node scripts/validate.mjs "$g"; done
```

and append to the "PPTX export + artifact gate" step:

```yaml
          node scripts/export-pptx.mjs styles/magazine/golden --out /tmp/magazine.pptx
          unzip -l /tmp/magazine.pptx | grep -q "media-.*\.mp4"
          node scripts/check-pptx.mjs /tmp/magazine.pptx --expect-slides 18
```

- [ ] **Step 6: SKILL.md**
  - 「风格库现状」第一条改为：`当前：**A 杂志 · 暖纸**（`magazine`，ready，18 个版式）· **B 瑞士 · 网格**（`swiss`，draft，暂缺 process / image / image-text 三类页面）。`
  - Q2 的「用户不挑时默认 A 杂志（尚未交付时用 legacy `editorial`）」改为「用户不挑时默认 A 杂志（`--style magazine`）」。

- [ ] **Step 7: README.md / README.en.md** — directly under the title block insert a 风格库 section with `![风格库](docs/styles/gallery.png)` and one sentence: 「12 种风格、每种独立版式集，开场先挑风格；已交付：A 杂志 · 暖纸，其余按 `docs/superpowers/specs/2026-10-08-style-library-design.md` 分期交付。」(EN: "12 styles, each with its own layout set — pick one at intake. Shipped: A Magazine; the rest follow the phased spec."). In 使用 / Usage replace `--theme paper` with `--style magazine`. Leave the legacy screenshot sections in place (they still describe the legacy themes).

- [ ] **Step 8: Tests + commit**

```bash
npm test
git add -A styles/magazine baselines/styles/magazine docs/styles .github/workflows/validate.yml SKILL.md README.md README.en.md
git commit -m "Ship style A magazine: ready, baseline, gallery, CI, docs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Retire legacy `editorial` (spec §8)

**Files:**
- Delete: `examples/editorial/`, `baselines/editorial/`, `assets/legacy/systems/editorial.css`, `docs/preview/editorial-cover.png`, `docs/preview/editorial-dark.png`
- Modify: `scripts/lib/goldens.mjs`, `scripts/new-deck.mjs` (usage line + theme list), `.github/workflows/validate.yml`, `SKILL.md`, `references/themes.md`, `references/failures.md` (cases 5–6 "已固化到" lines), `README.md`, `README.en.md`, `ARCHITECTURE.md`

**Interfaces:** `listGoldens()` keeps its shape; `LEGACY` becomes `['showcase', 'media']`.

- [ ] **Step 1: Find every reference** — `grep -rn "editorial" --include='*.mjs' --include='*.md' --include='*.yml' --include='*.json' . | grep -v "node_modules\|^./decks\|docs/superpowers\|\.superpowers"`. Also check `decks/*/index.html` for `systems/editorial.css`: decks carry their own asset copies (spec §8), so they are unaffected — confirm with `ls decks/*/assets/systems 2>/dev/null` and do not touch `decks/`.

- [ ] **Step 2: Delete + edit**
  - `git rm -rq examples/editorial baselines/editorial assets/legacy/systems/editorial.css docs/preview/editorial-cover.png docs/preview/editorial-dark.png`
  - `scripts/lib/goldens.mjs`: `const LEGACY = ['showcase', 'media'];`
  - `scripts/new-deck.mjs`: drop `editorial` from the usage comment and from whatever list/condition maps theme names to `assets/legacy/systems/` (read the file; keep `swiss` legacy handling as is).
  - `.github/workflows/validate.yml`: delete `node scripts/validate.mjs examples/editorial`.
  - `SKILL.md`: theme list `paper|graphite|forest|swiss`; delete the 「墨韵」 bullet in the legacy section; add one line there:「`editorial`（墨韵）已由 A 杂志取代退役。」
  - `references/themes.md`: replace the 设计系统 02 section body with「已退役，由风格库 A 杂志（`styles/magazine/`）取代。」
  - `references/failures.md` cases 5 and 6: change the 「已固化到」 line to「`styles/magazine/style.css` 的 `.mg-num`（lining-nums）；旧 `editorial.css` 已随退役删除。」 for #5 and「旧 `editorial.css`（已退役）。」 for #6.
  - `README.md` / `README.en.md`: delete the editorial screenshot table rows and the 「墨韵」 clause in the 特性 bullet.
  - `ARCHITECTURE.md`: `examples/` line → `legacy 金样 deck：showcase / media（随风格交付逐个退役）`; R15 paragraph: drop `examples/editorial`.

- [ ] **Step 3: Verify**

```bash
npm test
for g in examples/showcase examples/media styles/*/golden; do node scripts/validate.mjs $g | tail -1; done
node scripts/regress.mjs
node scripts/new-deck.mjs /private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/ed --theme editorial; echo "exit=$?"   # must fail with a clear unknown-theme message
grep -rn "editorial" --include='*.mjs' --include='*.yml' . | grep -v node_modules   # expect nothing
```

- [ ] **Step 4: Commit**

```bash
git commit -qam "Retire legacy editorial: superseded by style A magazine

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Finish the branch** — use superpowers:finishing-a-development-branch; after merge: `npm run sync`, delete stale installed paths (`examples/editorial`, `assets/legacy/systems/editorial.css`, `docs/preview/editorial-*.png` under `~/.claude/skills/zifeiyu-ppt-skill`), `npm run sync-check` → 0 drifted, and smoke `new-deck --style magazine` + validate + export + check-pptx in the installed copy.
