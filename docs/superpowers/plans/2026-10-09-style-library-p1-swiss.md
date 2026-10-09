# Style Library P1-B · Swiss Redesign Full Layout Set Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship style B「瑞士 · 网格」(`swiss`) as the second `ready` style: 17 layouts covering all 12 core roles plus matrix / bars / table / cycle / system, a 17-page golden deck, baseline, gallery card, CI coverage, docs — and retire the legacy `swiss` design system (`--theme swiss`) it replaces.

**Architecture:** Same P0 style-package contract as A: `styles/swiss/{style.css, manifest.json, layouts.md, golden/}`; each layout = one CSS block (class prefix per layout) + one skeleton `<section>` copied verbatim into the golden deck and `layouts.md`. The approved specimen (commit `311d8a2`: cover / kpi / process) is the seed; this plan adds 14 layouts in four batches, each verified by validator → PNG render → PPTX → LibreOffice geometry compare.

**Tech Stack:** Node 22 ESM, Playwright, pptxgenjs 4.0.1, subset-font, node:test, LibreOffice (`soffice`) + `pdftoppm`.

**Spec:** `docs/superpowers/specs/2026-10-08-style-library-design.md`（§2 B 行、§3、§5、§7 P1、§8）. Pattern reference: `docs/superpowers/plans/2026-10-08-style-library-p1-magazine.md`.

## Global Constraints

- Canvas 1280×720 px; pt = px × 0.75; in = px ÷ 96.
- Text only inside `h1/h2/h3/p`; inline emphasis only unnested `<strong>/<em>/<span class="is-accent">/<span class="is-mark">`; no `<br>` — one heading element per line, grouped with `data-merge`.
- Inline style only `top/left/width/height/font-size/line-height` (+ `rotate`); every class must be defined in `assets/base.css` or `styles/swiss/style.css`.
- R4 font floor 16px; R16 export parity (no `transform`, single-layer shadow, uniform border, text slots without bg/border/shadow/padding).
- Data roles (`kpi`, `bars`, `table`) use real, repo-verifiable numbers and carry a non-empty `data-source` text; bar width ∝ `data-value`.
- Core copy comes verbatim from `docs/golden-content.md`; style voice (mono folios, FIG numbers, kickers) is B's own.
- Golden imagery from `scripts/gen-art.mjs --style swiss --format jpg`; every caption says 示意图.
- `fonts.office` maps every rendered family (Source Han Sans SC → YaHei / YaHei Light, Inter → Segoe UI / Segoe UI Light, PingFang SC → YaHei, JetBrains Mono → Consolas); export prints no `warn:` line.
- **B grammar:** 12-column grid — content 64–1216, column 74, gutter 24, column k starts at `64 + 98k`; running heads at top 48, title at 104, foot rule 640 / foot text 660. Klein blue appears **once per page** (one `sw-accent` block, or one `sw-ac` figure / `is-accent` word, or one `is-on` tick). Giant type (`sw-giant`, `sw-num`) is never bold. Square ticks, never dots.
- Never commit `decks/` or `.superpowers/`. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Work on branch `style-swiss` (already checked out; specimen committed).

## Golden page order (fixed for the whole plan)

| # | layout | state | FIG | folio (top-left mono) |
|---|---|---|---|---|
| 01 | swiss/cover | blue panel + photo | 01 | ZIFEIYU PPT SKILL |
| 02 | swiss/agenda | light | — | 00 — CONTENTS |
| 03 | swiss/statement | `is-accent` (blue page) | — | NOTE — 设计原则 |
| 04 | swiss/section | `is-dark` | — | CHAPTER 01 / 04 |
| 05 | swiss/matrix | light | — | 01 — STYLE INDEX |
| 06 | swiss/compare | light | — | 01 — BEFORE / AFTER |
| 07 | swiss/image-text | light (image ≥25% → bleed for R15) | 02 | 02 — MEASURED EXPORT |
| 08 | swiss/image | bleed | 03 | — |
| 09 | swiss/points | light | 04 | 02 — THREE PROMISES |
| 10 | swiss/kpi | light | — | 03 — QUALITY GATES |
| 11 | swiss/bars | light | — | 03 — RULES BY CONCERN |
| 12 | swiss/table | light | — | 03 — SPEC SHEET |
| 13 | swiss/process | light | — | 04 — WORKFLOW |
| 14 | swiss/timeline | light | — | 04 — CHRONICLE |
| 15 | swiss/cycle | `is-dark` | — | 04 — LOOP |
| 16 | swiss/system | light | — | 04 — THREE LAYERS |
| 17 | swiss/closing | photo + blue panel | 05 | ZIFEIYU PPT SKILL |

Page numbers read `NN / 17` (the specimen's kpi `10 / 17` and process `13 / 17` already match). Longest light run is 09–14 (6 pages) — under R15's 7. Each batch inserts its slides at these positions.

## Shared verification routine ("verify batch")

Run after every batch; all of it must pass before committing:

```bash
G=styles/swiss/golden
node scripts/new-deck.mjs $G --refresh                 # copy style.css/manifest into the golden
node scripts/subset-fonts.mjs $G
node scripts/validate.mjs $G --office                  # 0 errors
node scripts/check-style.mjs styles/swiss              # 0 errors (core-role warnings allowed until Task 5)
node scripts/render-png.mjs $G                         # then Read every new renders/slide-N.png
node scripts/export-pptx.mjs $G | grep -E 'written|warn'   # no "warn:" line
node scripts/check-pptx.mjs $G/deck.pptx               # 0 errors
S=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/swpptx
rm -rf $S && mkdir -p $S && pkill -9 soffice; soffice --headless --convert-to pdf $G/deck.pptx --outdir $S >/dev/null 2>&1 && pdftoppm -r 96 -png $S/deck.pdf $S/p
```

Build a side-by-side sheet of the new pages (HTML render left, LibreOffice right — same Playwright snippet as the specimen's `cmp.png`) and Read it. Eyes-on checklist per new page: nothing overlaps or clips; lower half not empty (spec §1 complaint); Klein blue once; captions present; LibreOffice boxes within ~10px of the HTML (glyphs differ on this Mac — no YaHei Light / Segoe UI / Consolas — that is expected).

Image picking (Tasks 2–4): generate candidates into the scratchpad, paste them into a PIL contact sheet (`python3 -c "from PIL import Image …"`, as for the specimen), Read it, copy the pick into `styles/swiss/golden/assets/img/`.

---

### Task 1: Page states and shared heads; agenda / statement / section

**Files:**
- Modify: `styles/swiss/style.css` (tokens, vocabulary, cover ticks, three new layout blocks)
- Modify: `styles/swiss/manifest.json` (`layouts`)
- Modify: `styles/swiss/golden/index.html` (cover tick classes; pages 02–04)
- Modify: `styles/swiss/layouts.md`

**Interfaces:**
- Produces (used by every later task): `.slide.is-dark` and `.slide.is-accent` token sets; `--surface-2`; `.sw-ink` (text-1 block); `.sw-head2` (second title line, top 166); `.sw-k1`…`.sw-k4` (left positions of a four-tick row starting at 64; the row's `top` comes from a per-layout class).

- [ ] **Step 1: Tokens** — in `:root` add `--surface-2: #d8d8d4;` after `--surface`. After the `:root` block add:

```css
/* ink page: section / cycle */
.slide.is-dark {
  --bg: #0a0a0a;
  --surface: #1a1a1a;
  --text-1: #fafaf8;
  --text-2: #a3a3a3;
  --accent: #5b7bff; /* Klein blue lifts one step on ink, else it drowns */
  --hairline: #333333;
  --tick: #3d3d3d;
}

/* blue page: statement — the page itself is the one accent */
.slide.is-accent {
  --bg: #002fa7;
  --text-1: #ffffff;
  --text-2: #b3c1e8;
  --accent: #ffffff;
  --on-accent: #002fa7;
  --hairline: #4061bd;
  --tick: #8097d3;
}
```

- [ ] **Step 2: Vocabulary** — after `.sw-grey` add `.sw-ink { background: var(--text-1); }`. After `.sw-head` add `.sw-head2 { left: 64px; top: 166px; width: 1152px; }`. Replace the four `.swc-k1`…`.swc-k4` rules in the cover block with shared rules placed after the tick rules in the vocabulary:

```css
/* a four-tick row flush with the grid's left edge (cover, section) */
.sw-k1 { left: 64px; }
.sw-k2 { left: 96px; }
.sw-k3 { left: 114px; }
.sw-k4 { left: 132px; }
```

In the golden cover change `swc-k1`…`swc-k4` to `sw-k1`…`sw-k4` (keep `swc-tick`).

- [ ] **Step 3: Append the three layout blocks**

```css
/* ---------- swiss/agenda ---------- */
/* rows of 106px from 216; the foot rule at 640 closes the last row */
.swa-rule { left: 64px; top: 216px; width: 1152px; }
.swa-hair { left: 64px; width: 1152px; }
.swa-num { left: 52px; width: 160px; font-size: 64px; }
.swa-h { left: 260px; width: 368px; font-size: 30px; }
.swa-p { left: 652px; width: 420px; }
.swa-page { left: 1118px; width: 98px; text-align: right; }

/* ---------- swiss/statement ---------- */
.sws-bar { left: 64px; top: 208px; width: 48px; height: 8px; }
.sws-line { left: 58px; width: 1152px; font-size: 88px; }
.sws-l1 { top: 264px; }
.sws-l2 { top: 359px; }
.sws-by { left: 64px; top: 512px; width: 700px; }

/* ---------- swiss/section ---------- */
.swx-num { left: 40px; top: 88px; width: 700px; font-size: 320px; }
.swx-title { left: 58px; top: 456px; width: 1100px; font-size: 104px; }
.swx-tick { top: 608px; }
```

- [ ] **Step 4: Manifest** — `layouts` becomes:

```json
  "layouts": {
    "swiss/cover": { "role": "cover" },
    "swiss/agenda": { "role": "agenda" },
    "swiss/statement": { "role": "statement" },
    "swiss/section": { "role": "section" },
    "swiss/kpi": { "role": "kpi" },
    "swiss/process": { "role": "process" }
  }
```

- [ ] **Step 5: Golden** — insert after the cover, in this order:

```html
<section class="slide" data-layout="swiss/agenda" data-role="agenda">
  <p class="sw-mono sw-folio">00 — CONTENTS</p>
  <p class="sw-mono sw-pageno">02 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">目录</h2>
  <div class="sw-rule swa-rule" data-shape="rect" data-anim="draw"></div>
  <p class="sw-num sw-ac swa-num" style="top: 237px;" data-anim="rise">01</p>
  <h3 class="sw-h swa-h" style="top: 249px;" data-anim="rise">风格库</h3>
  <p class="sw-body swa-p" style="top: 256px;" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="sw-mono swa-page" style="top: 261px;">P. 04</p>
  <div class="sw-hair swa-hair" data-shape="rect" style="top: 322px;"></div>
  <p class="sw-num swa-num" style="top: 343px;" data-anim="rise">02</p>
  <h3 class="sw-h swa-h" style="top: 355px;" data-anim="rise">测量与导出</h3>
  <p class="sw-body swa-p" style="top: 362px;" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="sw-mono swa-page" style="top: 367px;">P. 07</p>
  <div class="sw-hair swa-hair" data-shape="rect" style="top: 428px;"></div>
  <p class="sw-num swa-num" style="top: 449px;" data-anim="rise">03</p>
  <h3 class="sw-h swa-h" style="top: 461px;" data-anim="rise">质量门</h3>
  <p class="sw-body swa-p" style="top: 468px;" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="sw-mono swa-page" style="top: 473px;">P. 10</p>
  <div class="sw-hair swa-hair" data-shape="rect" style="top: 534px;"></div>
  <p class="sw-num swa-num" style="top: 555px;" data-anim="rise">04</p>
  <h3 class="sw-h swa-h" style="top: 567px;" data-anim="rise">工作流</h3>
  <p class="sw-body swa-p" style="top: 574px;" data-anim="rise">从大纲到成稿的四步</p>
  <p class="sw-mono swa-page" style="top: 579px;">P. 13</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">ZIFEIYU PPT SKILL · STYLE B — SWISS</p>
</section>

<section class="slide is-accent" data-layout="swiss/statement" data-role="statement">
  <p class="sw-mono sw-folio">NOTE — 设计原则</p>
  <p class="sw-mono sw-pageno">03 / 17</p>
  <div class="sw-accent sws-bar" data-shape="rect" data-anim="draw"></div>
  <h2 class="sw-giant sws-line sws-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="sw-giant sws-line sws-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <p class="sw-mono sws-by">— SKILL.md · 设计原则</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">ZIFEIYU PPT SKILL · STYLE B — SWISS</p>
</section>

<section class="slide is-dark" data-layout="swiss/section" data-role="section">
  <p class="sw-mono sw-folio">CHAPTER 01 / 04</p>
  <p class="sw-mono sw-pageno">04 / 17</p>
  <p class="sw-num swx-num" data-anim="rise">01</p>
  <h2 class="sw-giant swx-title" data-anim="rise">风格库</h2>
  <div class="sw-tick is-on swx-tick sw-k1" data-shape="rect"></div>
  <div class="sw-tick swx-tick sw-k2" data-shape="rect"></div>
  <div class="sw-tick swx-tick sw-k3" data-shape="rect"></div>
  <div class="sw-tick swx-tick sw-k4" data-shape="rect"></div>
</section>
```

- [ ] **Step 6: `layouts.md`** — update the cover skeleton to the renamed tick classes; grammar item 1 add「两行标题第二行用 `sw-head2`（top 166）」; add grammar item 8「**墨页与蓝页**：`slide is-dark` 给 section / cycle（克莱因蓝在墨底上提亮为 #5b7bff）；`slide is-accent` 整页克莱因蓝，只给 statement——蓝页本身就是这一页的那一处蓝。」; append one entry per new layout (`## swiss/<name> · <role>` + description + golden `<section>` verbatim). Descriptions:
  - agenda —「目录。整行标题 + 黑色细线，4 行「巨数字编号 / 条目 / 一行说明 / 页码」，行高 106px、行间细线，页脚细线收住最后一行；第一个编号上蓝。条目 ≤6 字，说明 ≤14 字。」
  - statement —「金句蓝页。整页克莱因蓝，白色短条 → 两行极细巨字（每行一个 h2，每行 ≤10 字）→ 等宽出处。」
  - section —「章节墨页。极细巨数字章节号、极细巨字章节名、四格方块刻度标出当前章（`is-on`）。」

- [ ] **Step 7: Verify batch.** Expected `6 slides checked: 0 errors`; check the agenda rows, the blue statement page (all text white / pale blue), the ink section page in both renders.

- [ ] **Step 8: Commit**

```bash
git add -A styles/swiss
git commit -m "Swiss: blue and ink pages, shared ticks; agenda, statement, section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: matrix / compare / image-text / image

**Files:** `styles/swiss/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `07-feature.jpg`, `08-image.jpg`.

**Interfaces:** Consumes `.sw-head`, `.sw-ink`, running heads/foot, `.sw-on`/`.sw-on2` from the specimen and Task 1.

- [ ] **Step 1: Images**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/swart2
rm -rf $A
node scripts/gen-art.mjs $A/feature --style swiss --kind arch --seed 71 --count 6 --size 1128x1024 --format jpg
node scripts/gen-art.mjs $A/plate   --style swiss --kind arch --seed 81 --count 6 --size 1920x1080 --format jpg
```
Pick `07-feature.jpg` (any calm arch) and `08-image.jpg` (top-right must stay light — the dark page number sits there; lower-left is covered by the blue panel).

- [ ] **Step 2: CSS** — append:

```css
/* ---------- swiss/matrix ---------- */
/* 4 × 3 cells on columns 4–11: lefts 456 / 652 / 848 / 1044, tops 216 / 352 / 488 */
.swm-hero { left: 52px; top: 216px; width: 368px; font-size: 216px; }
.swm-label { left: 64px; top: 456px; width: 368px; font-size: 22px; }
.swm-sub { left: 64px; top: 492px; width: 340px; }
.swm-cell { width: 172px; height: 120px; }
.swm-letter { width: 140px; font-size: 40px; }
.swm-name { width: 140px; font-size: 18px; }

/* ---------- swiss/compare ---------- */
.swv-block { top: 216px; width: 564px; height: 400px; }
.swv-l { left: 64px; }
.swv-r { left: 652px; }
.swv-label { top: 240px; width: 516px; }
.swv-h { top: 280px; width: 516px; font-size: 28px; }
.swv-p { top: 326px; width: 500px; }
.swv-num { top: 456px; width: 240px; font-size: 136px; }
.swv-nl { top: 548px; width: 300px; font-size: 20px; }
.swv-tl { left: 88px; }
.swv-tr { left: 676px; }
.swv-nml { left: 76px; }
.swv-nmr { left: 664px; }
.swv-nll { left: 288px; }
.swv-nlr { left: 876px; }

/* ---------- swiss/image-text ---------- */
.swi-img { left: 64px; top: 104px; width: 564px; height: 512px; }
.swi-title { left: 750px; width: 466px; }
.swi-t1 { top: 104px; }
.swi-t2 { top: 166px; }
.swi-p { left: 750px; width: 466px; font-size: 18px; line-height: 1.75; color: var(--text-1); }
.swi-p1 { top: 272px; }
.swi-p2 { top: 384px; }
.swi-rule { left: 750px; top: 512px; width: 466px; }
.swi-note { left: 750px; top: 532px; width: 466px; line-height: 1.6; }

/* ---------- swiss/image ---------- */
.swf-img { left: 0; top: 0; width: 1280px; height: 720px; }
.swf-panel { left: 0; top: 464px; width: 652px; height: 256px; }
.swf-title { left: 64px; top: 504px; width: 560px; font-size: 44px; }
.swf-p { left: 64px; top: 576px; width: 560px; }
.swf-cap { left: 64px; top: 656px; width: 560px; }
```

- [ ] **Step 3: Manifest** — add `"swiss/matrix": { "role": "matrix" }`, `"swiss/compare": { "role": "compare" }`, `"swiss/image-text": { "role": "image-text" }`, `"swiss/image": { "role": "image" }`.

- [ ] **Step 4: Golden** — insert after the section page (pages 05–08):

```html
<section class="slide" data-layout="swiss/matrix" data-role="matrix">
  <p class="sw-mono sw-folio">01 — STYLE INDEX</p>
  <p class="sw-mono sw-pageno">05 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <p class="sw-num swm-hero" data-anim="count">12</p>
  <h3 class="sw-h swm-label" data-merge="hero" data-anim="rise">种风格</h3>
  <p class="sw-body swm-sub" data-merge="hero" data-anim="rise">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 456px; top: 216px;"></div>
  <p class="sw-num swm-letter" style="left: 472px; top: 230px;">A</p>
  <h3 class="sw-h swm-name" style="left: 472px; top: 298px;">杂志 · 暖纸</h3>
  <div class="sw-accent swm-cell" data-shape="rect" style="left: 652px; top: 216px;"></div>
  <p class="sw-num sw-on swm-letter" style="left: 668px; top: 230px;">B</p>
  <h3 class="sw-h sw-on swm-name" style="left: 668px; top: 298px;">瑞士 · 网格</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 848px; top: 216px;"></div>
  <p class="sw-num swm-letter" style="left: 864px; top: 230px;">C</p>
  <h3 class="sw-h swm-name" style="left: 864px; top: 298px;">发布会 · 暗场</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 1044px; top: 216px;"></div>
  <p class="sw-num swm-letter" style="left: 1060px; top: 230px;">D</p>
  <h3 class="sw-h swm-name" style="left: 1060px; top: 298px;">报刊 · 版面</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 456px; top: 352px;"></div>
  <p class="sw-num swm-letter" style="left: 472px; top: 366px;">E</p>
  <h3 class="sw-h swm-name" style="left: 472px; top: 434px;">大字报 · 粗野</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 652px; top: 352px;"></div>
  <p class="sw-num swm-letter" style="left: 668px; top: 366px;">F</p>
  <h3 class="sw-h swm-name" style="left: 668px; top: 434px;">柔和 · 产品</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 848px; top: 352px;"></div>
  <p class="sw-num swm-letter" style="left: 864px; top: 366px;">G</p>
  <h3 class="sw-h swm-name" style="left: 864px; top: 434px;">摄影集 · 画册</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 1044px; top: 352px;"></div>
  <p class="sw-num swm-letter" style="left: 1060px; top: 366px;">H</p>
  <h3 class="sw-h swm-name" style="left: 1060px; top: 434px;">咨询 · 白皮书</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 456px; top: 488px;"></div>
  <p class="sw-num swm-letter" style="left: 472px; top: 502px;">I</p>
  <h3 class="sw-h swm-name" style="left: 472px; top: 570px;">日式 · 极简</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 652px; top: 488px;"></div>
  <p class="sw-num swm-letter" style="left: 668px; top: 502px;">J</p>
  <h3 class="sw-h swm-name" style="left: 668px; top: 570px;">拼贴 · 手账</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 848px; top: 488px;"></div>
  <p class="sw-num swm-letter" style="left: 864px; top: 502px;">K</p>
  <h3 class="sw-h swm-name" style="left: 864px; top: 570px;">新中式 · 东方</h3>
  <div class="sw-grey swm-cell" data-shape="rect" style="left: 1044px; top: 488px;"></div>
  <p class="sw-num swm-letter" style="left: 1060px; top: 502px;">L</p>
  <h3 class="sw-h swm-name" style="left: 1060px; top: 570px;">工程制图</h3>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">SOURCE — 风格库设计规格 2026-10-08 §2</p>
</section>

<section class="slide" data-layout="swiss/compare" data-role="compare">
  <p class="sw-mono sw-folio">01 — BEFORE / AFTER</p>
  <p class="sw-mono sw-pageno">06 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">换皮，不如换版面。</h2>
  <div class="sw-grey swv-block swv-l" data-shape="rect"></div>
  <div class="sw-accent swv-block swv-r" data-shape="rect"></div>
  <p class="sw-mono swv-label swv-tl">BEFORE</p>
  <h3 class="sw-h swv-h swv-tl" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="sw-body swv-p swv-tl" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <p class="sw-num swv-num swv-nml" data-anim="count">24</p>
  <p class="sw-h swv-nl swv-nll" data-anim="rise">个版式，三套系统共用</p>
  <p class="sw-mono sw-on2 swv-label swv-tr">AFTER</p>
  <h3 class="sw-h sw-on swv-h swv-tr" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="sw-body sw-on2 swv-p swv-tr" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <p class="sw-num sw-on swv-num swv-nmr" data-anim="count">12</p>
  <p class="sw-h sw-on swv-nl swv-nlr" data-anim="rise">种风格，各有一套版式</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">ZIFEIYU PPT SKILL · STYLE B — SWISS</p>
</section>

<section class="slide" data-layout="swiss/image-text" data-role="image-text">
  <p class="sw-mono sw-folio">02 — MEASURED EXPORT</p>
  <p class="sw-mono sw-pageno">07 / 17</p>
  <img class="sw-photo swi-img" src="assets/img/07-feature.jpg" alt="示意图：灰白立板构成的空间">
  <h2 class="sw-title swi-title swi-t1" data-merge="title" data-anim="rise">所见即所得，</h2>
  <h2 class="sw-title swi-title swi-t2" data-merge="title" data-anim="rise">靠的是测量。</h2>
  <p class="swi-p swi-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="swi-p swi-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="sw-rule swi-rule" data-shape="rect" data-anim="draw"></div>
  <p class="sw-mono swi-note">PRIMITIVES — ROUNDRECT · LINE · CHEVRON · ROTATE · SHADOW · EAVERT</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">FIG. 02 — 示意图</p>
</section>

<section class="slide" data-layout="swiss/image" data-role="image">
  <img class="sw-photo swf-img" src="assets/img/08-image.jpg" alt="示意图：灰白立板构成的空间">
  <div class="sw-accent swf-panel" data-shape="rect"></div>
  <h2 class="sw-title sw-on swf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="sw-lede sw-on swf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="sw-mono sw-on2 swf-cap">FIG. 03 — 示意图</p>
  <p class="sw-mono sw-pageno">08 / 17</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append four entries (description + golden `<section>` verbatim):
  - matrix —「盘点 + 总数。左：整行标题下的巨数字总数、标签与两行分组说明；右：4 × 3 灰格「字母 / 名称」（列 456 / 652 / 848 / 1044，行 216 / 352 / 488），当前项整格上蓝。8–12 项，名称 ≤7 字。」
  - compare —「二元对比。整行标题，左灰右蓝两块半宽色块，各含「等宽标签 / 小标题 / 两行说明 / 巨数字 + 一句数字说明」。数字必须真实；结论一侧放蓝块。」
  - image-text —「图文。左图（564×512，第 0–5 栏），右栏（第 7–11 栏）两行标题、两段正文（每段 ≤50 字）、黑细线与等宽注脚；页脚写图注。」
  - image —「满版照片 + 左下克莱因蓝色块：块内一句标题、一句说明、等宽图注。照片右上要浅，页码压在那里。」

- [ ] **Step 6: Verify batch.** Expected `10 slides checked: 0 errors`. If R5 (density) warns on matrix, report the exact warning text in the commit body and keep the page; do not delete items.

- [ ] **Step 7: Commit** — `git add -A styles/swiss && git commit -m "Swiss: matrix, compare, image-text, image" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 3: points / bars / table

**Files:** `styles/swiss/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `09-points-{1,2,3}.jpg`.

**Interfaces:** Consumes `.sw-head`, `.sw-ink`, running heads/foot. Bars rely on the P0 contract: `data-role="bars"`, `data-value`/`data-label` on bar shapes, `data-chart` on texts the native chart replaces, R8 width ∝ value.

- [ ] **Step 1: Images**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/swart3
rm -rf $A
node scripts/gen-art.mjs $A --style swiss --kind arch --seed 91 --count 6 --size 736x400 --format jpg
```
Pick three that read as a set with **no** blue plane (the third column's blue bar is the page's accent) → `09-points-1.jpg`, `09-points-2.jpg`, `09-points-3.jpg`. If fewer than three are blue-free, generate more seeds (`--seed 97 --count 6`).

- [ ] **Step 2: CSS** — append:

```css
/* ---------- swiss/points ---------- */
.swt-bar { top: 216px; width: 368px; height: 4px; }
.swt-num { top: 240px; width: 368px; }
.swt-h { top: 276px; width: 368px; font-size: 28px; }
.swt-p { top: 322px; width: 368px; }
.swt-img { top: 416px; width: 368px; height: 200px; }
.swt-c1 { left: 64px; }
.swt-c2 { left: 456px; }
.swt-c3 { left: 848px; }

/* ---------- swiss/bars ---------- */
/* bar width = value × 160px (max 4 → 640px); value 16px after the bar end, rule ids 64px after the value */
.swb-label { left: 64px; width: 180px; font-size: 22px; }
.swb-bar { left: 260px; height: 32px; }
.swb-val { width: 48px; font-size: 44px; }
.swb-ids { width: 236px; }

/* ---------- swiss/table ---------- */
.swd-head { top: 216px; }
.swd-rule { left: 64px; top: 244px; width: 1152px; }
.swd-k { left: 64px; width: 180px; font-size: 20px; }
.swd-v { left: 260px; width: 564px; font-size: 18px; line-height: 1.4; color: var(--text-1); }
.swd-s { left: 848px; width: 368px; }
.swd-hair { left: 64px; width: 1152px; }
```

- [ ] **Step 3: Manifest** — add `"swiss/points": { "role": "points" }`, `"swiss/bars": { "role": "bars" }`, `"swiss/table": { "role": "table" }`.

- [ ] **Step 4: Golden** — insert `points` after `image` (page 09), and `bars`, `table` after `kpi` (pages 11, 12):

```html
<section class="slide" data-layout="swiss/points" data-role="points">
  <p class="sw-mono sw-folio">02 — THREE PROMISES</p>
  <p class="sw-mono sw-pageno">09 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">三件事，件件可验证。</h2>
  <div class="sw-ink swt-bar swt-c1" data-shape="rect" data-anim="draw"></div>
  <div class="sw-ink swt-bar swt-c2" data-shape="rect" data-anim="draw"></div>
  <div class="sw-accent swt-bar swt-c3" data-shape="rect" data-anim="draw"></div>
  <p class="sw-mono swt-num swt-c1" data-merge="c1" data-anim="rise">01</p>
  <h3 class="sw-h swt-h swt-c1" data-merge="c1" data-anim="rise">浏览器里演示</h3>
  <p class="sw-body swt-p swt-c1" data-merge="c1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <p class="sw-mono swt-num swt-c2" data-merge="c2" data-anim="rise">02</p>
  <h3 class="sw-h swt-h swt-c2" data-merge="c2" data-anim="rise">可编辑的 PPTX</h3>
  <p class="sw-body swt-p swt-c2" data-merge="c2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <p class="sw-mono swt-num swt-c3" data-merge="c3" data-anim="rise">03</p>
  <h3 class="sw-h swt-h swt-c3" data-merge="c3" data-anim="rise">机器先把关</h3>
  <p class="sw-body swt-p swt-c3" data-merge="c3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <img class="sw-photo swt-img swt-c1" src="assets/img/09-points-1.jpg" alt="示意图：灰白立板">
  <img class="sw-photo swt-img swt-c2" src="assets/img/09-points-2.jpg" alt="示意图：灰白立板">
  <img class="sw-photo swt-img swt-c3" src="assets/img/09-points-3.jpg" alt="示意图：灰白立板">
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">FIG. 04 — 三幅均为示意图</p>
</section>
```

```html
<section class="slide" data-layout="swiss/bars" data-role="bars">
  <p class="sw-mono sw-folio">03 — RULES BY CONCERN</p>
  <p class="sw-mono sw-pageno">11 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">十六条规则，各管一摊。</h2>
  <h3 class="sw-h swb-label" style="top: 234px;" data-chart>排版与几何</h3>
  <div class="sw-ink swb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 232px; width: 640px;"></div>
  <p class="sw-num swb-val" style="top: 226px; left: 916px;" data-chart>4</p>
  <p class="sw-mono swb-ids" style="top: 240px; left: 980px;" data-chart>R3 · R4 · R7 · R9</p>
  <h3 class="sw-h swb-label" style="top: 298px;" data-chart>版式与样式</h3>
  <div class="sw-ink swb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 296px; width: 640px;"></div>
  <p class="sw-num swb-val" style="top: 290px; left: 916px;" data-chart>4</p>
  <p class="sw-mono swb-ids" style="top: 304px; left: 980px;" data-chart>R1 · R2 · R6 · R12</p>
  <h3 class="sw-h swb-label" style="top: 362px;" data-chart>内容与数据</h3>
  <div class="sw-ink swb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 360px; width: 480px;"></div>
  <p class="sw-num swb-val" style="top: 354px; left: 756px;" data-chart>3</p>
  <p class="sw-mono swb-ids" style="top: 368px; left: 820px;" data-chart>R5 · R8 · R14</p>
  <h3 class="sw-h swb-label" style="top: 426px;" data-chart>可访问与媒体</h3>
  <div class="sw-ink swb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 424px; width: 480px;"></div>
  <p class="sw-num swb-val" style="top: 418px; left: 756px;" data-chart>3</p>
  <p class="sw-mono swb-ids" style="top: 432px; left: 820px;" data-chart>R10 · R11 · R13</p>
  <h3 class="sw-h swb-label" style="top: 490px;" data-chart>节奏</h3>
  <div class="sw-ink swb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 488px; width: 160px;"></div>
  <p class="sw-num swb-val" style="top: 482px; left: 436px;" data-chart>1</p>
  <p class="sw-mono swb-ids" style="top: 496px; left: 500px;" data-chart>R15</p>
  <h3 class="sw-h swb-label" style="top: 554px;" data-chart>导出一致</h3>
  <div class="sw-accent swb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 552px; width: 160px;"></div>
  <p class="sw-num swb-val" style="top: 546px; left: 436px;" data-chart>1</p>
  <p class="sw-mono swb-ids" style="top: 560px; left: 500px;" data-chart>R16</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot" data-source>SOURCE — scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
</section>

<section class="slide" data-layout="swiss/table" data-role="table">
  <p class="sw-mono sw-folio">03 — SPEC SHEET</p>
  <p class="sw-mono sw-pageno">12 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">一页纸，看懂规格。</h2>
  <p class="sw-mono swd-head" style="left: 64px;">ITEM</p>
  <p class="sw-mono swd-head" style="left: 260px;">SPEC</p>
  <p class="sw-mono swd-head" style="left: 848px;">SOURCE</p>
  <div class="sw-rule swd-rule" data-shape="rect" data-anim="draw"></div>
  <h3 class="sw-h swd-k" style="top: 274px;">画布</h3>
  <p class="swd-v" style="top: 274px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="sw-mono swd-s" style="top: 279px;">assets/base.css</p>
  <div class="sw-hair swd-hair" data-shape="rect" style="top: 318px;"></div>
  <h3 class="sw-h swd-k" style="top: 336px;">字号下限</h3>
  <p class="swd-v" style="top: 336px;">16 px，溢出先删字、再换版式</p>
  <p class="sw-mono swd-s" style="top: 341px;">validate.mjs · R4</p>
  <div class="sw-hair swd-hair" data-shape="rect" style="top: 380px;"></div>
  <h3 class="sw-h swd-k" style="top: 398px;">校验规则</h3>
  <p class="swd-v" style="top: 398px;">R1–R16，错误清零才能交付</p>
  <p class="sw-mono swd-s" style="top: 403px;">validate.mjs</p>
  <div class="sw-hair swd-hair" data-shape="rect" style="top: 442px;"></div>
  <h3 class="sw-h swd-k" style="top: 460px;">导出格式</h3>
  <p class="swd-v" style="top: 460px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="sw-mono swd-s" style="top: 465px;">SKILL.md</p>
  <div class="sw-hair swd-hair" data-shape="rect" style="top: 504px;"></div>
  <h3 class="sw-h swd-k" style="top: 522px;">页面角色</h3>
  <p class="swd-v" style="top: 522px;">20 个，其中 12 个核心角色</p>
  <p class="sw-mono swd-s" style="top: 527px;">lib/roles.mjs</p>
  <div class="sw-hair swd-hair" data-shape="rect" style="top: 566px;"></div>
  <h3 class="sw-h swd-k" style="top: 584px;">字体</h3>
  <p class="swd-v" style="top: 584px;">SIL OFL 开源字体，按 deck 用字<span class="is-accent">子集化</span></p>
  <p class="sw-mono swd-s" style="top: 589px;">fetch-fonts.mjs</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot" data-source>SOURCE — 本仓库 SKILL.md · scripts/ · assets/base.css</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append three entries:
  - points —「三个并列要点（第 0 / 4 / 8 栏起，各宽 368）：顶部粗条（前两条黑、第三条蓝）→ 等宽编号 → 小标题 → 两行说明 → 下方一张图。三张图一个图注写在页脚；说明 ≤28 字；配图不要再带蓝。」
  - bars —「条形对比（3–6 行，行距 64）。条从 260 起，条长 = 数值 × 160px（最大值 4 时满长 640；最大值不同就按 640 ÷ 最大值换算单位长度），数值紧跟条尾 16px，等宽注释再后 64px；只有一根条用 `sw-accent`，其余 `sw-ink`。页脚 `data-source` 必填。」
  - table —「规格表（4–6 行，行距 62）。等宽表头 + 黑细线，每行「项目 / 规格 / 出处」（第 0 / 2 / 8 栏起），行间细线；全表只用一个 `is-accent` 词。规格 ≤30 字。页脚 `data-source` 必填。」

- [ ] **Step 6: Verify batch** — plus native-chart smoke: `node scripts/export-pptx.mjs $G --out /tmp/sw-native.pptx --native-charts && node scripts/check-pptx.mjs /tmp/sw-native.pptx` → 0 errors; `unzip -l /tmp/sw-native.pptx | grep -c chart` ≥ 1. Expected `13 slides checked: 0 errors`.

- [ ] **Step 7: Commit** — `git add -A styles/swiss && git commit -m "Swiss: points, bars, table" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 4: timeline / cycle / system / closing

**Files:** `styles/swiss/{style.css, manifest.json, layouts.md}`, golden `index.html`, image `17-closing.jpg`.

**Interfaces:** Consumes `.sw-head`, `.sw-head2`, `.slide.is-dark`, `--surface-2`, ticks, running heads/foot.

- [ ] **Step 1: Image**

```bash
A=/private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/swart4
rm -rf $A
node scripts/gen-art.mjs $A --style swiss --kind arch --seed 181 --count 6 --size 1024x1440 --format jpg
```
Pick `17-closing.jpg`: a mirror partner for the cover (blue plane welcome); lower-left floor must take the dark caption.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- swiss/timeline ---------- */
/* five equal columns, pitch 230 — the one place the 12-column grid yields to a 5-up rhythm */
.swl-date { top: 296px; width: 206px; font-size: 64px; }
.swl-rule { left: 64px; top: 392px; width: 1152px; }
.swl-tick { top: 387px; }
.swl-h { top: 424px; width: 206px; font-size: 24px; }
.swl-p { top: 464px; width: 206px; }
.swl-c1 { left: 64px; }
.swl-c2 { left: 294px; }
.swl-c3 { left: 524px; }
.swl-c4 { left: 754px; }
.swl-c5 { left: 984px; }

/* ---------- swiss/cycle ---------- */
/* ring centre (332, 412), radius 176; square nodes sit on N / E / S / W */
.swy-ring { left: 156px; top: 236px; width: 352px; height: 352px; border: 2px solid var(--text-2); }
.swy-node { width: 16px; height: 16px; background: var(--text-1); }
.swy-on { background: var(--accent); }
.swy-n1 { left: 324px; top: 228px; }
.swy-n2 { left: 500px; top: 404px; }
.swy-n3 { left: 324px; top: 580px; }
.swy-n4 { left: 148px; top: 404px; }
.swy-mark { width: 40px; }
.swy-m1 { left: 316px; top: 196px; text-align: center; }
.swy-m2 { left: 532px; top: 404px; }
.swy-m3 { left: 316px; top: 604px; text-align: center; }
.swy-m4 { left: 92px; top: 404px; text-align: right; }
.swy-core { left: 252px; top: 340px; width: 160px; font-size: 96px; text-align: center; }
.swy-core-l { left: 252px; top: 448px; width: 160px; text-align: center; }
.swy-num { left: 652px; width: 48px; }
.swy-h { left: 716px; width: 500px; font-size: 32px; }
.swy-hair { left: 652px; width: 564px; }
.swy-back { left: 716px; top: 588px; width: 500px; }

/* ---------- swiss/system ---------- */
/* nested squares on columns 0–3; the innermost is the page's blue */
.swz-sq1 { left: 64px; top: 216px; width: 368px; height: 368px; }
.swz-sq2 { left: 128px; top: 280px; width: 240px; height: 240px; background: var(--surface-2); }
.swz-sq3 { left: 192px; top: 344px; width: 112px; height: 112px; }
.swz-l1 { left: 80px; top: 232px; width: 240px; }
.swz-l2 { left: 144px; top: 296px; width: 200px; }
.swz-l3 { left: 208px; top: 360px; width: 80px; }
.swz-tag { left: 554px; width: 662px; }
.swz-h { left: 554px; width: 662px; font-size: 28px; }
.swz-p { left: 554px; width: 662px; }
.swz-hair { left: 554px; width: 662px; }

/* ---------- swiss/closing ---------- */
/* mirror of the cover: photo left, blue panel right */
.swe-img { left: 0; top: 0; width: 512px; height: 720px; }
.swe-cap { left: 32px; top: 656px; width: 448px; color: var(--text-1); }
.swe-panel { left: 512px; top: 0; width: 768px; height: 720px; }
.swe-kicker { left: 576px; top: 48px; width: 400px; }
.swe-title { left: 570px; width: 640px; font-size: 96px; }
.swe-t1 { top: 160px; }
.swe-t2 { top: 264px; }
.swe-label { left: 576px; top: 432px; width: 640px; }
.swe-cmd { left: 576px; top: 464px; width: 640px; font-family: var(--font-mono); font-size: 20px; line-height: 1.5; }
.swe-p { left: 576px; top: 520px; width: 640px; }
.swe-tick { top: 600px; }
.swe-k1 { left: 576px; }
.swe-k2 { left: 594px; }
.swe-k3 { left: 612px; }
.swe-k4 { left: 630px; }
.swe-meta { left: 576px; top: 656px; width: 640px; }
```

- [ ] **Step 3: Manifest** — add `"swiss/timeline": { "role": "timeline" }`, `"swiss/cycle": { "role": "cycle" }`, `"swiss/system": { "role": "system" }`, `"swiss/closing": { "role": "closing" }`.

- [ ] **Step 4: Golden** — after `process` insert `timeline` (14), `cycle` (15), `system` (16); `closing` goes last (17):

```html
<section class="slide" data-layout="swiss/timeline" data-role="timeline">
  <p class="sw-mono sw-folio">04 — CHRONICLE</p>
  <p class="sw-mono sw-pageno">14 / 17</p>
  <h2 class="sw-title sw-head" data-merge="title" data-anim="rise">从一套版式，</h2>
  <h2 class="sw-title sw-head2" data-merge="title" data-anim="rise">到一座风格库。</h2>
  <p class="sw-num swl-date swl-c1" data-anim="rise">07.16</p>
  <p class="sw-num swl-date swl-c2" data-anim="rise">07.18</p>
  <p class="sw-num swl-date swl-c3" data-anim="rise">08.17</p>
  <p class="sw-num swl-date swl-c4" data-anim="rise">08.18</p>
  <p class="sw-num swl-date swl-c5" data-anim="rise">10.08</p>
  <div class="sw-rule swl-rule" data-shape="rect" data-anim="draw"></div>
  <div class="sw-tick swl-tick swl-c1" data-shape="rect"></div>
  <div class="sw-tick swl-tick swl-c2" data-shape="rect"></div>
  <div class="sw-tick swl-tick swl-c3" data-shape="rect"></div>
  <div class="sw-tick swl-tick swl-c4" data-shape="rect"></div>
  <div class="sw-tick is-on swl-tick swl-c5" data-shape="rect"></div>
  <h3 class="sw-h swl-h swl-c1" data-merge="c1" data-anim="rise">首版发布</h3>
  <p class="sw-body swl-p swl-c1" data-merge="c1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <h3 class="sw-h swl-h swl-c2" data-merge="c2" data-anim="rise">墨韵衬线</h3>
  <p class="sw-body swl-p swl-c2" data-merge="c2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <h3 class="sw-h swl-h swl-c3" data-merge="c3" data-anim="rise">校验全覆盖</h3>
  <p class="sw-body swl-p swl-c3" data-merge="c3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <h3 class="sw-h swl-h swl-c4" data-merge="c4" data-anim="rise">瑞士国际</h3>
  <p class="sw-body swl-p swl-c4" data-merge="c4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <h3 class="sw-h swl-h swl-c5" data-merge="c5" data-anim="rise">风格库</h3>
  <p class="sw-body swl-p swl-c5" data-merge="c5" data-anim="rise">十二种风格，版式独立。</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">SOURCE — git log · 2026-07-16 → 2026-10-08</p>
</section>

<section class="slide is-dark" data-layout="swiss/cycle" data-role="cycle">
  <p class="sw-mono sw-folio">04 — LOOP</p>
  <p class="sw-mono sw-pageno">15 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">每次改动，都绕这一圈</h2>
  <div class="swy-ring" data-shape="ellipse" data-anim="fade"></div>
  <div class="swy-node swy-on swy-n1" data-shape="rect" data-anim="pop"></div>
  <div class="swy-node swy-n2" data-shape="rect" data-anim="pop"></div>
  <div class="swy-node swy-n3" data-shape="rect" data-anim="pop"></div>
  <div class="swy-node swy-n4" data-shape="rect" data-anim="pop"></div>
  <p class="sw-mono swy-mark swy-m1">01</p>
  <p class="sw-mono swy-mark swy-m2">02</p>
  <p class="sw-mono swy-mark swy-m3">03</p>
  <p class="sw-mono swy-mark swy-m4">04</p>
  <p class="sw-num swy-core" data-anim="count">4</p>
  <p class="sw-mono swy-core-l">STEPS · LOOP</p>
  <p class="sw-mono swy-num" style="top: 248px;">01</p>
  <h3 class="sw-h swy-h" style="top: 236px;" data-anim="rise">改版式</h3>
  <div class="sw-hair swy-hair" data-shape="rect" style="top: 300px;"></div>
  <p class="sw-mono swy-num" style="top: 336px;">02</p>
  <h3 class="sw-h swy-h" style="top: 324px;" data-anim="rise">过校验</h3>
  <div class="sw-hair swy-hair" data-shape="rect" style="top: 388px;"></div>
  <p class="sw-mono swy-num" style="top: 424px;">03</p>
  <h3 class="sw-h swy-h" style="top: 412px;" data-anim="rise">渲染比对</h3>
  <div class="sw-hair swy-hair" data-shape="rect" style="top: 476px;"></div>
  <p class="sw-mono swy-num" style="top: 512px;">04</p>
  <h3 class="sw-h swy-h" style="top: 500px;" data-anim="rise">记基线</h3>
  <div class="sw-hair swy-hair" data-shape="rect" style="top: 564px;"></div>
  <p class="sw-lede swy-back" data-anim="rise">再回到改版式</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">SOURCE — scripts/baseline.mjs（基线前先过 check-style 与 validate）</p>
</section>

<section class="slide" data-layout="swiss/system" data-role="system">
  <p class="sw-mono sw-folio">04 — THREE LAYERS</p>
  <p class="sw-mono sw-pageno">16 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">三层样式，各管一层</h2>
  <div class="sw-grey swz-sq1" data-shape="rect" data-anim="scale"></div>
  <div class="swz-sq2" data-shape="rect" data-anim="scale"></div>
  <div class="sw-accent swz-sq3" data-shape="rect" data-anim="scale"></div>
  <p class="sw-mono swz-l1">BASE.CSS</p>
  <p class="sw-mono swz-l2">STYLE.CSS</p>
  <p class="sw-mono sw-on swz-l3">BRAND</p>
  <p class="sw-mono swz-tag" style="top: 216px;" data-merge="r1" data-anim="rise">OUTER — 外层</p>
  <h3 class="sw-h swz-h" style="top: 248px;" data-merge="r1" data-anim="rise">base.css</h3>
  <p class="sw-body swz-p" style="top: 292px;" data-merge="r1" data-anim="rise">画布、元素契约、形状原语</p>
  <div class="sw-hair swz-hair" data-shape="rect" style="top: 332px;"></div>
  <p class="sw-mono swz-tag" style="top: 340px;" data-merge="r2" data-anim="rise">MIDDLE — 中层</p>
  <h3 class="sw-h swz-h" style="top: 372px;" data-merge="r2" data-anim="rise">style.css</h3>
  <p class="sw-body swz-p" style="top: 416px;" data-merge="r2" data-anim="rise">风格的 token、字体与全部版式</p>
  <div class="sw-hair swz-hair" data-shape="rect" style="top: 456px;"></div>
  <p class="sw-mono swz-tag" style="top: 464px;" data-merge="r3" data-anim="rise">INNER — 内层</p>
  <h3 class="sw-h swz-h" style="top: 496px;" data-merge="r3" data-anim="rise">brand.css</h3>
  <p class="sw-body swz-p" style="top: 540px;" data-merge="r3" data-anim="rise">只改 token 的品牌色</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">SOURCE — 风格库 spec §3.1</p>
</section>
```

```html
<section class="slide" data-layout="swiss/closing" data-role="closing">
  <img class="sw-photo swe-img" src="assets/img/17-closing.jpg" alt="示意图：灰白立板之间的一块克莱因蓝">
  <p class="sw-mono swe-cap">FIG. 05 — 示意图</p>
  <div class="sw-accent swe-panel" data-shape="rect"></div>
  <p class="sw-mono sw-on2 swe-kicker">ZIFEIYU PPT SKILL</p>
  <p class="sw-mono sw-on2 sw-pageno">17 / 17</p>
  <h2 class="sw-giant sw-on swe-title swe-t1" data-merge="title" data-anim="rise">挑一种风格，</h2>
  <h2 class="sw-giant sw-on swe-title swe-t2" data-merge="title" data-anim="rise">开始下一份。</h2>
  <p class="sw-mono sw-on2 swe-label">START — 新建 DECK</p>
  <p class="sw-on swe-cmd">node scripts/new-deck.mjs my-deck --style swiss</p>
  <p class="sw-body sw-on2 swe-p">风格画廊：docs/styles/index.html</p>
  <div class="sw-tick sw-on swe-tick swe-k1" data-shape="rect"></div>
  <div class="sw-tick sw-on swe-tick swe-k2" data-shape="rect"></div>
  <div class="sw-tick sw-on swe-tick swe-k3" data-shape="rect"></div>
  <div class="sw-tick sw-on is-on swe-tick swe-k4" data-shape="rect"></div>
  <p class="sw-mono sw-on swe-meta">STYLE B — SWISS · END</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — append:
  - timeline —「时间线（4–5 个节点，5 等分列，列距 230）。两行标题（`sw-head` + `sw-head2`），极细日期在黑细线上方，线上方块刻度（最新节点 `is-on` 上蓝），线下「节点名 / 两行说明」。说明 ≤18 字。」
  - cycle —「闭环墨页（有回路才用）。左：描边圆环 + N/E/S/W 四个方块节点（起点上蓝）、等宽编号、环心巨数字；右：四行「编号 / 步骤名」+ 一句回到起点。步骤名 ≤5 字。」
  - system —「层级嵌套。左：三层嵌套方块（外灰、中深灰、内蓝），各带等宽层名；右：三行「等宽层级标签 / 名称 / 一行说明」。」
  - closing —「结尾，与封面镜像：左 512px 照片（深色图注），右 768px 克莱因蓝色块：两行极细巨字、等宽命令、一句说明、方块刻度（最后一格 `is-on`）。」

- [ ] **Step 6: Verify batch.** Expected `17 slides checked: 0 errors`. Check specifically: the cycle ring exports as an ellipse with a line and no fill (read `ppt/slides/slide15.xml` for `prst="ellipse"` and `<a:noFill/>` inside its `spPr`); if the exporter fills it, report the XML and stop — do not work around it in CSS.

- [ ] **Step 7: Commit** — `git add -A styles/swiss && git commit -m "Swiss: timeline, cycle, system, closing" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 5: Ship B — ready status, baseline, gallery, CI, docs

**Files:**
- Modify: `styles/swiss/manifest.json` (`"status": "ready"`), `styles/swiss/layouts.md` (status line)
- Modify: `.github/workflows/validate.yml`
- Modify: `SKILL.md`, `README.md`, `README.en.md`, `ARCHITECTURE.md`
- Create/modify: `baselines/styles/swiss/slide-{1..17}.png`, `docs/styles/swiss.png`; regenerate `docs/styles/index.html`, `docs/styles/gallery.png`

- [ ] **Step 1: Ready gate.** Set `"status": "ready"`; `layouts.md` status line →「状态：ready · 17 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / cycle / system。」 Run `node scripts/check-style.mjs styles/swiss` → `0 errors, 0 warnings`. Run `node scripts/validate.mjs styles/swiss/golden --office` → `0 errors`; an R15 warning means the page-order table was not followed — fix the order, not the rule.

- [ ] **Step 2: Full visual pass.** Render, export, LibreOffice-render all 17 pages (verify routine) and Read every pair. Fix anything on the checklist in `style.css` / golden, re-run, then `node scripts/new-deck.mjs styles/swiss/golden --refresh`.

- [ ] **Step 3: Baseline + regress**

```bash
node scripts/baseline.mjs          # gates on check-style + validate, re-records every golden
git status --short baselines/      # only baselines/styles/swiss/* may change; any other modified PNG = regression, stop and investigate
rm -rf .regress                    # regress does not clear old renders; a stale page shows up as EXTRA
node scripts/regress.mjs           # every page 0.00%
```

- [ ] **Step 4: Gallery** — `node scripts/style-gallery.mjs`; Read `docs/styles/gallery.png`; B card shows the new swiss cover.

- [ ] **Step 5: CI** — in `.github/workflows/validate.yml` change `node scripts/check-pptx.mjs /tmp/swiss.pptx --expect-slides 3` to `--expect-slides 17`.

- [ ] **Step 6: Docs**
  - `SKILL.md` 「风格库现状」: the B entry becomes `**B 瑞士 · 网格**（`swiss`，ready，17 个版式）`.
  - `README.md` / `README.en.md`: the 风格库 sentence's shipped list becomes「已交付：A 杂志 · 暖纸、B 瑞士 · 网格」(EN: "Shipped: A Magazine, B Swiss").
  - `ARCHITECTURE.md`: after the M11 milestone add「- **M12 · 风格库 P1-B（瑞士重做）**：swiss 按确认样张重做为 17 个版式（12 栏网格、单一克莱因蓝、极细巨字、方块刻度），蓝页 / 墨页两种页面状态；Inter 进字体源（Office 映射 Segoe UI）；旧 legacy `swiss` 设计系统随之退役。」

- [ ] **Step 7: Tests + commit**

```bash
npm test
git add -A styles/swiss baselines/styles/swiss docs/styles .github/workflows/validate.yml SKILL.md README.md README.en.md ARCHITECTURE.md
git commit -m "Ship style B swiss: ready, baseline, gallery, CI, docs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Retire the legacy `swiss` design system (spec §8)

**Files:**
- Delete: `assets/legacy/systems/swiss.css`, `docs/preview/swiss-cover.png`, `docs/preview/swiss-cards.png`
- Modify: `scripts/new-deck.mjs` (usage line, legacy copy list, theme lookup), `SKILL.md`, `references/themes.md`, `references/layouts.md` (GRID section), `README.md`, `README.en.md`, `ARCHITECTURE.md`

**Interfaces:** `new-deck --theme <t>` now resolves only `assets/legacy/themes/<t>.css`; the validator's R12 pattern keeps accepting `assets/systems/*.css` so existing legacy decks (which carry their own copies) still validate.

- [ ] **Step 1: Find every reference** — `grep -rn "systems/swiss\|--theme swiss\|瑞士国际\|GRID" --include='*.mjs' --include='*.md' --include='*.yml' --include='*.json' . | grep -v "node_modules\|^./decks\|docs/superpowers\|\.superpowers\|^./styles/"`. Confirm no private deck links it: `grep -l "systems/swiss" decks/*/index.html` (expect nothing; do not touch `decks/`).

- [ ] **Step 2: Delete + edit**
  - `git rm -q assets/legacy/systems/swiss.css docs/preview/swiss-cover.png docs/preview/swiss-cards.png` (this empties `assets/legacy/systems/`, which git will not keep).
  - `scripts/new-deck.mjs`:
    - usage line 2 → `--theme paper|graphite|forest   (legacy)`;
    - line 46 copy list → `for (const d of ['themes', 'textures']) …` (textures stay: showcase / media / v2-lab link them);
    - lines 87–92: drop the systems branch so the lookup reads
      ```js
      const themeHref = `assets/themes/${theme}.css`;
      if (!existsSync(join(legacy, themeHref.slice('assets/'.length)))) {
        console.error(`unknown theme "${theme}": no assets/legacy/themes/${theme}.css`);
      ```
      (read the surrounding lines first and keep the rest of the block unchanged).
  - `SKILL.md`: the legacy theme list (line ~13) → `--theme paper|graphite|forest` — this also drops the stray `editorial` that the A retirement missed; usage line (~56) → `--theme paper|graphite|forest`; replace the GRID bullet in the legacy section with「`swiss`（瑞士国际 GRID）已由风格库 B 瑞士取代退役。」next to the editorial line.
  - `references/themes.md`: replace the 设计系统 03 section body with「已退役，由风格库 B 瑞士（`styles/swiss/`）取代。」
  - `references/layouts.md`: replace the「GRID 版面语法」section body with「瑞士系统已退役，由风格库 B 瑞士取代：版面语法见 `styles/swiss/layouts.md`。」; fix any other line that tells readers to use `systems/swiss.css`.
  - `README.md` / `README.en.md`: delete the swiss screenshot table row(s) and any「瑞士国际」clause that describes the legacy system.
  - `ARCHITECTURE.md`: drop legacy `systems/swiss.css` mentions (keep history milestones as they are).
  - Local only (not tracked): `rm -rf examples/editorial` — ignored leftovers (`renders/`, `.export-crops/`, `deck.pptx`) from the A retirement.

- [ ] **Step 3: Verify**

```bash
npm test
for g in examples/showcase examples/media styles/*/golden; do node scripts/validate.mjs $g | tail -1; done
rm -rf .regress && node scripts/regress.mjs
node scripts/new-deck.mjs /private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/sw-legacy --theme swiss; echo "exit=$?"   # must fail: unknown theme
node scripts/new-deck.mjs /private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/pp-legacy --theme paper && node scripts/validate.mjs /private/tmp/claude-501/-Users-xiafanxing-Documents----PPT---/e80edd3c-350a-4039-864d-9b29c5889ba1/scratchpad/pp-legacy | tail -1
grep -rn "systems/swiss\|--theme swiss" --include='*.mjs' --include='*.yml' --include='*.md' . | grep -v "node_modules\|^./decks\|docs/superpowers"   # expect nothing
```

- [ ] **Step 4: Commit**

```bash
git add -A assets/legacy scripts/new-deck.mjs SKILL.md references README.md README.en.md ARCHITECTURE.md docs/preview
git commit -m "Retire legacy swiss system: superseded by style B swiss

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Finish the branch** — use superpowers:finishing-a-development-branch; after merge: `npm run sync`, list installed-copy files that no longer exist in the repo (same orphan scan as after P1-A: `assets`, `references`, `scripts`, `templates`, `examples`, `styles`, `docs/styles` under `~/.claude/skills/zifeiyu-ppt-skill`) and delete them — expect the old `styles/swiss/textures/`, old swiss golden assets, and `assets/legacy/systems/swiss.css`; then `npm run sync-check` → 0 drifted, and smoke `new-deck --style swiss` + validate + export + check-pptx in the installed copy.
