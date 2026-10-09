# Style Library P1-G · Photobook Full Layout Set Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship style G「摄影集 · 画册」(`photobook`) as the fourth `ready` style: 18 layouts covering all 12 core roles plus matrix / bars / table / gallery / video / audio, an 18-page golden deck, baseline, gallery card, CI coverage (native charts + media), docs. This closes P1.

**Architecture:** Same P0 style-package contract as A / B / H: `styles/photobook/{style.css, manifest.json, layouts.md, golden/}`; each layout = one CSS block (class prefix per layout) + one skeleton `<section>` copied verbatim into the golden deck and `layouts.md`. The approved specimen (commit `46bb452`: cover / kpi / process) is the seed; `gen-art` already has the photo-like kinds `light` / `horizon` (commit `8a9a4ac`). This plan adds 15 layouts in five batches, each verified by validator → PNG render → PPTX → LibreOffice geometry compare. G retires no legacy item.

**Tech Stack:** Node 22 ESM, Playwright, pptxgenjs 4.0.1, subset-font, node:test, LibreOffice (`soffice`) + `pdftoppm`, ffmpeg, Python 3 + Pillow (scratchpad helpers only).

**Spec:** `docs/superpowers/specs/2026-10-08-style-library-design.md`（§2 G 行、§3、§5、§7 P1、§8「视频 / 音频角色进入 A、C、G」）. Pattern references: `docs/superpowers/plans/2026-10-08-style-library-p1-magazine.md` (same 18-role set and page order), `docs/superpowers/plans/2026-10-09-style-library-p1-consulting.md`.

## Global Constraints

- Canvas 1280×720 px; pt = px × 0.75; in = px ÷ 96.
- Text only inside `h1/h2/h3/p`; inline emphasis only unnested `<strong>/<em>/<span class="is-accent">/<span class="is-mark">`; no `<br>` — one heading element per line, grouped with `data-merge`.
- Inline style only `top/left/width/height/font-size/line-height` (+ `rotate`); every class must be defined in `assets/base.css` or `styles/photobook/style.css`.
- R4 font floor 16px; R16 export parity (no `transform`, single-layer shadow, uniform border, text slots without bg/border/shadow/padding).
- Data roles (`kpi`, `bars`, `table`) use real, repo-verifiable numbers and carry a non-empty `data-source` text; bar width ∝ `data-value` (72 px per rule).
- Core copy comes verbatim from `docs/golden-content.md`; two-line golden titles join into one line on pages that use the shared `pb-title` head (as the specimen's kpi does); cover / statement / image-text / closing keep two lines. Style voice (italic Latin line, mono labels, frame numbers) is G's own.
- Golden imagery from `scripts/gen-art.mjs --palette … --format jpg` at 2× the layout box, alternating the two film palettes below; every `alt` starts with「示意图：」and every page that shows an image says 示意图 in its foot or caption. Images may be reused across pages only when the cover-fit crop loses ≤45% (validator R13) — the closing strip qualifies (≈44%); the matrix contact sheet does not and uses dedicated 416×224 thumbnails `05-matrix-a…l.jpg` (ruling during Task 2). The exporter bakes every `object-fit: cover` image to its own crop.
  - `WARM="#e9e3d8,#9a8e7c,#c8742f,#1c1a17"`
  - `COOL="#dfe3e6,#7d8a94,#d9a066,#15191d"`
  - Alt wording by kind: light →「窗光落在暗墙上」/「墙面上的窗光」, horizon →「远山与低悬的太阳」/「远山与落日」, arch →「立板构成的空间」/「立板」, field →「色场」; prefix 暖色 / 冷色 by palette.
- **G grammar:** no UI accent — ink, grey and near-white only, the photographs carry the colour; never `is-accent` / `is-mark`. Text on a photo always sits on a `pb-scrim` block. Content pages: one-line serif title (`pb-serif pb-title`, top 56, 44px, ≤14 字) + optional right italic voice (`pb-it pb-voice`); content zone 148–640; foot at 668 (`pb-mono pb-foot` left「Source — … · 图为示意图」, `pb-mono pb-pageno` right「NN / 18」). Numbers in Playfair italic with lining figures (`pb-num`); body on system fonts (`pb-body`).
- `fonts.office` maps every rendered family (Source Han Serif SC → SimSun, Playfair Display → Times New Roman, JetBrains Mono → Consolas, PingFang SC → YaHei / YaHei Light); export prints no `warn:` line.
- Never commit `decks/` or `.superpowers/`. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Work on branch `style-photobook` (already checked out; specimen committed).

## Golden page order (fixed for the whole plan)

Same role order as A magazine. "bleed" = an image or video covering ≥25% of the canvas (R15b); runs of light pages stay ≤3.

| # | layout | state | images (in `golden/assets/img/` unless noted) | page no. |
|---|---|---|---|---|
| 01 | photobook/cover | light | 01-cover-1…5 | — |
| 02 | photobook/agenda | bleed | 02-agenda | 02 / 18 |
| 03 | photobook/statement | `is-dark` | — | 03 / 18 |
| 04 | photobook/section | bleed (full) | 04-section | 04 / 18 |
| 05 | photobook/matrix | light | 05-matrix-a…l (dedicated 416×224 thumbnails) | 05 / 18 |
| 06 | photobook/compare | light | 06-compare-1, 06-compare-2 | 06 / 18 |
| 07 | photobook/image-text | bleed (left half) | 07-feature | 07 / 18 |
| 08 | photobook/image | bleed (plate) | 08-plate | 08 / 18 |
| 09 | photobook/points | bleed (right) | 09-points | 09 / 18 |
| 10 | photobook/kpi | light | 10-kpi-1…3 | 10 / 18 |
| 11 | photobook/bars | light | 11-bars | 11 / 18 |
| 12 | photobook/table | light | — | 12 / 18 |
| 13 | photobook/video | `is-dark` | media/13-film.mp4 + poster | 13 / 18 |
| 14 | photobook/process | light | 13-process-1…4 (specimen names kept) | 14 / 18 |
| 15 | photobook/timeline | bleed (panorama) | 15-timeline | 15 / 18 |
| 16 | photobook/gallery | bleed | 16-gallery-1…3 | 16 / 18 |
| 17 | photobook/audio | light | 17-audio, media/17-tone.mp3 | 17 / 18 |
| 18 | photobook/closing | `is-dark` | reuses 01-cover-1…5 | — |

Each batch inserts its slides at these positions; slide counts after each task: 6 → 10 → 13 → 16 → 18.

## Shared verification routine ("verify batch")

Helpers live in the session scratchpad (`SP`); if they are missing, recreate them from Appendix A first.

```bash
G=styles/photobook/golden
SP=<this session's scratchpad dir>
node scripts/new-deck.mjs $G --refresh                 # copy style.css/manifest into the golden
node scripts/subset-fonts.mjs $G
node scripts/validate.mjs $G --office                  # 0 errors, 0 warnings
node scripts/check-style.mjs styles/photobook          # 0 errors (core-role warnings allowed until Task 6)
python3 $SP/pblayouts.py "$PWD"                        # regenerate layouts.md from manifest + golden
node scripts/render-png.mjs $G                         # then Read every new renders/slide-N.png
node scripts/export-pptx.mjs $G | grep -E 'written|warn'   # no "warn:" line
node scripts/check-pptx.mjs $G/deck.pptx               # 0 errors
S=$SP/pbpptx; rm -rf $S && mkdir -p $S && (pkill -9 soffice; true)
soffice --headless --convert-to pdf $G/deck.pptx --outdir $S >/dev/null 2>&1 && pdftoppm -r 96 -png $S/deck.pdf $S/p
python3 $SP/cmp.py "$PWD/$G/renders" $S $S/cmp.png <new slide numbers>
```

Read `cmp.png` (HTML render left, LibreOffice right). Eyes-on checklist per new page: nothing overlaps or clips; lower half not empty; no colour except in the photographs; every piece of text on a photo sits on a scrim; title / foot present on content pages; italic figures are lining (a 1 as tall as the capitals); LibreOffice boxes within ~10px of the HTML (glyphs differ on this Mac — no SimSun / Times New Roman metrics — that is expected).

Image picking: generate 4 candidates per slot into `$SP/img/<slot>/`, run `python3 $SP/sheet.py $SP/img/<slot>`, Read `$SP/img/<slot>/sheet.png`, copy the pick to `$G/assets/img/<name>.jpg` and use the matching alt wording.

---

### Task 1: Darkroom page state, ink fill; agenda / statement / section

**Files:**
- Modify: `styles/photobook/style.css` (page state, `pb-ink`, three layout blocks)
- Modify: `styles/photobook/manifest.json` (`layouts`)
- Modify: `styles/photobook/golden/index.html` (process page number; pages 02–04)
- Create: `styles/photobook/golden/assets/img/02-agenda.jpg`, `04-section.jpg`
- Modify: `styles/photobook/layouts.md` (via `pblayouts.py`)

**Interfaces:**
- Produces (used by every later task): `.slide.is-dark` token set; `.pb-ink` (solid ink fill for bars, nodes, rules, the play dot); the page-number scheme「NN / 18」.

- [ ] **Step 1: Page state + vocabulary** — after the `:root` block add:

```css
/* darkroom page: statement, video, closing */
.slide.is-dark {
  --bg: #141311;
  --surface: #24221e;
  --text-1: #f3f0ea;
  --text-2: #a39d93;
  --accent: #f3f0ea;
  --on-accent: #141311;
  --mark: #f3f0ea;
  --on-mark: #141311;
  --hairline: #3a3732;
}
```

and after `.pb-hair` add `.pb-ink { background: var(--text-1); }`.

- [ ] **Step 2: Images**

```bash
node scripts/gen-art.mjs $SP/img/agenda --palette "$WARM" --kind light --seed 41 --count 4 --size 1024x984 --format jpg
node scripts/gen-art.mjs $SP/img/section --palette "$COOL" --kind horizon --seed 51 --count 4 --size 1920x1080 --format jpg
python3 $SP/sheet.py $SP/img/agenda; python3 $SP/sheet.py $SP/img/section
```

Pick → `02-agenda.jpg` (alt「示意图：暖色墙面上的窗光」), `04-section.jpg` (alt「示意图：冷色远山与低悬的太阳」). For the section pick prefer a frame whose lower third is dark enough for white text under a 55% scrim.

- [ ] **Step 3: Append the three layout blocks**

```css
/* ---------- photobook/agenda ---------- */
/* photo left; four rows of 123px from 148 on the right, a hairline under each */
.pba-img { left: 64px; top: 148px; width: 512px; height: 492px; }
.pba-num { left: 640px; width: 64px; font-size: 40px; }
.pba-h { left: 720px; width: 280px; font-size: 28px; line-height: 1.2; }
.pba-p { left: 720px; width: 280px; }
.pba-page { left: 1016px; width: 200px; text-align: right; }
.pba-hair { left: 640px; width: 576px; }

/* ---------- photobook/statement ---------- */
.pbs-line { left: 0; width: 1280px; font-size: 56px; line-height: 1.25; text-align: center; }
.pbs-l1 { top: 248px; }
.pbs-l2 { top: 318px; }
.pbs-it { left: 0; top: 428px; width: 1280px; font-size: 26px; text-align: center; }
.pbs-by { left: 0; top: 482px; width: 1280px; text-align: center; }

/* ---------- photobook/section ---------- */
/* full-bleed photo; chapter number, name and voice on a scrim band across the foot */
.pbx-img { left: 0; top: 0; width: 1280px; height: 720px; }
.pbx-band { left: 0; top: 456px; width: 1280px; height: 264px; }
.pbx-num { left: 60px; top: 488px; width: 180px; font-size: 128px; }
.pbx-title { left: 248px; top: 500px; width: 900px; font-size: 48px; line-height: 1.25; }
.pbx-it { left: 248px; top: 572px; width: 900px; font-size: 26px; }
```

- [ ] **Step 4: Manifest** — `layouts` becomes:

```json
  "layouts": {
    "photobook/cover": { "role": "cover" },
    "photobook/agenda": { "role": "agenda" },
    "photobook/statement": { "role": "statement" },
    "photobook/section": { "role": "section" },
    "photobook/kpi": { "role": "kpi" },
    "photobook/process": { "role": "process" }
  }
```

- [ ] **Step 5: Golden** — in the process page change `13 / 18` to `14 / 18`. Insert after the cover, in this order:

```html
<section class="slide" data-layout="photobook/agenda" data-role="agenda">
  <h2 class="pb-serif pb-title" data-anim="rise">目录</h2>
  <p class="pb-it pb-voice" data-anim="rise">Contents.</p>
  <img class="pb-photo pba-img" src="assets/img/02-agenda.jpg" alt="示意图：暖色墙面上的窗光">
  <p class="pb-num pba-num" style="top: 172px;" data-anim="rise">01</p>
  <h3 class="pb-serif pba-h" style="top: 170px;" data-merge="r1" data-anim="rise">风格库</h3>
  <p class="pb-body pba-p" style="top: 212px;" data-merge="r1" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="pb-mono pba-page" style="top: 182px;">P. 04</p>
  <div class="pb-hair pba-hair" data-shape="rect" style="top: 271px;"></div>
  <p class="pb-num pba-num" style="top: 295px;" data-anim="rise">02</p>
  <h3 class="pb-serif pba-h" style="top: 293px;" data-merge="r2" data-anim="rise">测量与导出</h3>
  <p class="pb-body pba-p" style="top: 335px;" data-merge="r2" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="pb-mono pba-page" style="top: 305px;">P. 07</p>
  <div class="pb-hair pba-hair" data-shape="rect" style="top: 394px;"></div>
  <p class="pb-num pba-num" style="top: 418px;" data-anim="rise">03</p>
  <h3 class="pb-serif pba-h" style="top: 416px;" data-merge="r3" data-anim="rise">质量门</h3>
  <p class="pb-body pba-p" style="top: 458px;" data-merge="r3" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="pb-mono pba-page" style="top: 428px;">P. 10</p>
  <div class="pb-hair pba-hair" data-shape="rect" style="top: 517px;"></div>
  <p class="pb-num pba-num" style="top: 541px;" data-anim="rise">04</p>
  <h3 class="pb-serif pba-h" style="top: 539px;" data-merge="r4" data-anim="rise">工作流</h3>
  <p class="pb-body pba-p" style="top: 581px;" data-merge="r4" data-anim="rise">从大纲到成稿的四步</p>
  <p class="pb-mono pba-page" style="top: 551px;">P. 13</p>
  <div class="pb-hair pba-hair" data-shape="rect" style="top: 640px;"></div>
  <p class="pb-mono pb-foot">ZIFEIYU PPT SKILL · 图为示意图</p>
  <p class="pb-mono pb-pageno">02 / 18</p>
</section>

<section class="slide is-dark" data-layout="photobook/statement" data-role="statement">
  <h2 class="pb-serif pbs-line pbs-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="pb-serif pbs-line pbs-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <p class="pb-it pbs-it" data-anim="rise">One source of truth.</p>
  <p class="pb-mono pbs-by">— SKILL.md · 设计原则</p>
  <p class="pb-mono pb-pageno">03 / 18</p>
</section>

<section class="slide" data-layout="photobook/section" data-role="section">
  <img class="pb-photo pbx-img" src="assets/img/04-section.jpg" alt="示意图：冷色远山与低悬的太阳">
  <div class="pb-scrim pbx-band" data-shape="rect"></div>
  <p class="pb-num pb-on pbx-num" data-anim="rise">01</p>
  <h2 class="pb-serif pb-on pbx-title" data-anim="rise">风格库</h2>
  <p class="pb-it pb-on2 pbx-it" data-anim="rise">Twelve ways to set a page.</p>
  <p class="pb-mono pb-on2 pb-foot">CHAPTER 01 · 图为示意图</p>
  <p class="pb-mono pb-on2 pb-pageno">04 / 18</p>
</section>
```

If the picked images get other alts (Step 2), use those here and in `layouts.md`.

- [ ] **Step 6: `layouts.md` helper** — in `$SP/pblayouts.py` (Appendix A) replace grammar item 1 with「1. **照片是主角**：除 statement / table 外每页都有照片，照片面积大于文字区；文字退到图注的位置，标题一行（`pb-serif pb-title`，44px，最多 14 字），右侧可配一行拉丁斜体副题（`pb-it pb-voice`）。」, append grammar item「7. **暗房页**：`slide is-dark` 近黑底给 statement / video / closing；暗房页上墨色与灰色 token 反相，`pb-ink` 变成近白。」, and add to `DESC`:
  - `photobook/agenda` —「目录。一行标题「目录」+ 斜体副题 → 左 512×492 照片；右侧 4 行「斜体编号 / 宋体条目 + 一句说明 / 等宽页码」，行高 123px，每行下一条细线，最后一条与照片底边齐平。条目 ≤6 字，说明 ≤14 字。」
  - `photobook/statement` —「金句暗房页。两行 56px 宋体引文居中（每行一个 h2，每行 ≤12 字）→ 斜体英文一句 → 等宽出处；只有页码，不放照片。」
  - `photobook/section` —「章节页。满版照片，底部 264px 压暗条上：斜体大章节号 + 宋体章节名 + 斜体一句；页脚等宽「CHAPTER NN · 图为示意图」与页码也在压暗条上。」

- [ ] **Step 7: Verify batch** (new slides 2 3 4). Expected `6 slides checked: 0 errors, 0 warnings`; check the agenda rows against the photo's bottom edge, the statement page (text near-white / grey on near-black), the section band (white figures readable over the image; if R11 warns on contrast, pick a darker section candidate rather than changing the scrim).

- [ ] **Step 8: Commit**

```bash
git add -A styles/photobook
git commit -m "Photobook: darkroom page state; agenda, statement, section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: matrix / compare / image-text / image

**Files:** `styles/photobook/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `06-compare-1.jpg`, `06-compare-2.jpg`, `07-feature.jpg`, `08-plate.jpg`.

**Interfaces:** Consumes `pb-title` / `pb-voice` / `pb-foot` / `pb-pageno`, `.pb-photo`, `.pb-ink`, the specimen and Task 1 images (matrix reuses twelve of them).

> Amended during execution: the twelve frames use dedicated thumbnails `05-matrix-a…l.jpg` (416×224, seeds 201–212, WARM/COOL alternating) instead of reusing portrait images — reuse cropped 50–60% and tripped R13.

- [ ] **Step 1: Images**

```bash
node scripts/gen-art.mjs $SP/img/cmp1 --palette "$COOL" --kind arch --seed 61 --count 4 --size 1136x520 --format jpg
node scripts/gen-art.mjs $SP/img/cmp2 --palette "$WARM" --kind light --seed 65 --count 4 --size 1136x520 --format jpg
node scripts/gen-art.mjs $SP/img/feature --palette "$WARM" --kind arch --seed 71 --count 4 --size 1280x1440 --format jpg
node scripts/gen-art.mjs $SP/img/plate --palette "$COOL" --kind horizon --seed 81 --count 4 --size 2304x1080 --format jpg
for d in cmp1 cmp2 feature plate; do python3 $SP/sheet.py $SP/img/$d; done
```

Pick → `06-compare-1.jpg`（「示意图：冷灰立板」）, `06-compare-2.jpg`（「示意图：暖色墙面上的窗光」）, `07-feature.jpg`（「示意图：暖灰立板构成的空间」）, `08-plate.jpg`（「示意图：冷色远山与低悬的太阳」）.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- photobook/matrix ---------- */
/* hero total on the left; a 4×3 contact sheet A–L on the right, the current style ringed */
.pbm-hero { left: 56px; top: 148px; width: 248px; font-size: 160px; }
.pbm-label { left: 64px; top: 324px; width: 240px; font-size: 28px; line-height: 1.2; }
.pbm-sub { left: 64px; top: 372px; width: 240px; }
.pbm-img { width: 208px; height: 112px; }
.pbm-key { width: 24px; }
.pbm-name { width: 176px; font-size: 18px; line-height: 1.3; }
.pbm-sel { width: 220px; height: 124px; border: 2px solid var(--text-1); }

/* ---------- photobook/compare ---------- */
.pbv-img { top: 148px; width: 568px; height: 260px; }
.pbv-label { top: 428px; width: 568px; }
.pbv-h { top: 456px; width: 568px; font-size: 24px; line-height: 1.3; }
.pbv-p { top: 496px; width: 568px; }
.pbv-num { top: 572px; width: 80px; font-size: 56px; }
.pbv-nl { top: 590px; width: 480px; font-size: 20px; line-height: 1.3; }
.pbv-l { left: 64px; }
.pbv-r { left: 648px; }
.pbv-ln { left: 152px; }
.pbv-rn { left: 736px; }

/* ---------- photobook/image-text ---------- */
/* the photo bleeds off the left half; text column 688–1216 */
.pbi-img { left: 0; top: 0; width: 640px; height: 720px; }
.pbi-title { left: 688px; width: 528px; font-size: 44px; line-height: 1.25; }
.pbi-t1 { top: 96px; }
.pbi-t2 { top: 151px; }
.pbi-it { left: 688px; top: 226px; width: 528px; font-size: 26px; }
.pbi-p { left: 688px; width: 528px; }
.pbi-p1 { top: 288px; }
.pbi-p2 { top: 364px; }
.pbi-hair { left: 688px; top: 452px; width: 528px; }
.pbi-note { left: 688px; top: 476px; width: 528px; }
.pbi-foot { left: 688px; top: 668px; width: 320px; }

/* ---------- photobook/image ---------- */
/* a plate: the photo matted on the page, caption underneath */
.pbf-img { left: 64px; top: 48px; width: 1152px; height: 540px; }
.pbf-title { left: 64px; top: 608px; width: 720px; font-size: 28px; line-height: 1.25; }
.pbf-p { left: 64px; top: 652px; width: 720px; }
.pbf-cap { left: 816px; top: 616px; width: 400px; text-align: right; }
```

- [ ] **Step 3: Manifest** — after `photobook/section` add `"photobook/matrix": { "role": "matrix" }`, `"photobook/compare": { "role": "compare" }`, `"photobook/image-text": { "role": "image-text" }`, `"photobook/image": { "role": "image" }`.

- [ ] **Step 4: Golden** — insert after the section page (pages 05–08). Contact-sheet columns 336 / 560 / 784 / 1008; rows: image tops 148 / 312 / 476, letter tops 275 / 439 / 603, name tops 272 / 436 / 600; the ring sits 6px outside G's frame.

```html
<section class="slide" data-layout="photobook/matrix" data-role="matrix">
  <h2 class="pb-serif pb-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <p class="pb-it pb-voice" data-anim="rise">A to L, on one sheet.</p>
  <p class="pb-num pbm-hero" data-anim="count">12</p>
  <h3 class="pb-serif pbm-label" data-merge="hero" data-anim="rise">种风格</h3>
  <p class="pb-body pbm-sub" data-merge="hero" data-anim="rise">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <img class="pb-photo pbm-img" src="assets/img/01-cover-1.jpg" alt="示意图：窗光落在暗墙上" style="left: 336px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 336px; top: 275px;">A</p>
  <p class="pb-serif pbm-name" style="left: 368px; top: 272px;">杂志 · 暖纸</p>
  <img class="pb-photo pbm-img" src="assets/img/01-cover-2.jpg" alt="示意图：冷色远山与低悬的太阳" style="left: 560px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 560px; top: 275px;">B</p>
  <p class="pb-serif pbm-name" style="left: 592px; top: 272px;">瑞士 · 网格</p>
  <img class="pb-photo pbm-img" src="assets/img/01-cover-3.jpg" alt="示意图：暖灰立板与一块琥珀色" style="left: 784px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 784px; top: 275px;">C</p>
  <p class="pb-serif pbm-name" style="left: 816px; top: 272px;">发布会 · 暗场</p>
  <img class="pb-photo pbm-img" src="assets/img/01-cover-4.jpg" alt="示意图：冷色墙面上的窗光" style="left: 1008px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 1008px; top: 275px;">D</p>
  <p class="pb-serif pbm-name" style="left: 1040px; top: 272px;">报刊 · 版面</p>
  <img class="pb-photo pbm-img" src="assets/img/01-cover-5.jpg" alt="示意图：暖色远山与落日" style="left: 336px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 336px; top: 439px;">E</p>
  <p class="pb-serif pbm-name" style="left: 368px; top: 436px;">大字报 · 粗野</p>
  <img class="pb-photo pbm-img" src="assets/img/10-kpi-1.jpg" alt="示意图：暖色远山" style="left: 560px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 560px; top: 439px;">F</p>
  <p class="pb-serif pbm-name" style="left: 592px; top: 436px;">柔和 · 产品</p>
  <img class="pb-photo pbm-img" src="assets/img/10-kpi-2.jpg" alt="示意图：冷色墙面上的窗光" style="left: 784px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 784px; top: 439px;">G</p>
  <p class="pb-serif pbm-name" style="left: 816px; top: 436px;">摄影集 · 画册</p>
  <img class="pb-photo pbm-img" src="assets/img/10-kpi-3.jpg" alt="示意图：暖灰立板" style="left: 1008px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 1008px; top: 439px;">H</p>
  <p class="pb-serif pbm-name" style="left: 1040px; top: 436px;">咨询 · 白皮书</p>
  <img class="pb-photo pbm-img" src="assets/img/13-process-1.jpg" alt="示意图：冷灰立板" style="left: 336px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 336px; top: 603px;">I</p>
  <p class="pb-serif pbm-name" style="left: 368px; top: 600px;">日式 · 极简</p>
  <img class="pb-photo pbm-img" src="assets/img/13-process-2.jpg" alt="示意图：暖色色场" style="left: 560px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 560px; top: 603px;">J</p>
  <p class="pb-serif pbm-name" style="left: 592px; top: 600px;">拼贴 · 手账</p>
  <img class="pb-photo pbm-img" src="assets/img/13-process-3.jpg" alt="示意图：冷色远山" style="left: 784px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 784px; top: 603px;">K</p>
  <p class="pb-serif pbm-name" style="left: 816px; top: 600px;">新中式 · 东方</p>
  <img class="pb-photo pbm-img" src="assets/img/13-process-4.jpg" alt="示意图：暖色墙面上的窗光" style="left: 1008px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 1008px; top: 603px;">L</p>
  <p class="pb-serif pbm-name" style="left: 1040px; top: 600px;">工程制图</p>
  <div class="pbm-sel" data-shape="rect" style="left: 778px; top: 306px;"></div>
  <p class="pb-mono pb-foot">Source — 风格库 spec §2 · 图为示意图</p>
  <p class="pb-mono pb-pageno">05 / 18</p>
</section>

<section class="slide" data-layout="photobook/compare" data-role="compare">
  <h2 class="pb-serif pb-title" data-anim="rise">换皮，不如换版面。</h2>
  <p class="pb-it pb-voice" data-anim="rise">Same content, new pages.</p>
  <img class="pb-photo pbv-img pbv-l" src="assets/img/06-compare-1.jpg" alt="示意图：冷灰立板">
  <img class="pb-photo pbv-img pbv-r" src="assets/img/06-compare-2.jpg" alt="示意图：暖色墙面上的窗光">
  <p class="pb-mono pbv-label pbv-l">BEFORE</p>
  <h3 class="pb-serif pbv-h pbv-l" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="pb-body pbv-p pbv-l" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <p class="pb-num pbv-num pbv-l" data-anim="count">24</p>
  <p class="pb-serif pbv-nl pbv-ln" data-anim="rise">个版式，三套系统共用</p>
  <p class="pb-mono pbv-label pbv-r">AFTER</p>
  <h3 class="pb-serif pbv-h pbv-r" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="pb-body pbv-p pbv-r" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <p class="pb-num pbv-num pbv-r" data-anim="count">12</p>
  <p class="pb-serif pbv-nl pbv-rn" data-anim="rise">种风格，各有一套版式</p>
  <p class="pb-mono pb-foot">Source — references/layouts.md（L01–L24）· 风格库 spec §1、§3.2 · 图为示意图</p>
  <p class="pb-mono pb-pageno">06 / 18</p>
</section>

<section class="slide" data-layout="photobook/image-text" data-role="image-text">
  <img class="pb-photo pbi-img" src="assets/img/07-feature.jpg" alt="示意图：暖灰立板构成的空间">
  <h2 class="pb-serif pbi-title pbi-t1" data-merge="title" data-anim="rise">所见即所得，</h2>
  <h2 class="pb-serif pbi-title pbi-t2" data-merge="title" data-anim="rise">靠的是测量。</h2>
  <p class="pb-it pbi-it" data-anim="rise">Measure first, then draw.</p>
  <p class="pb-body pbi-p pbi-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="pb-body pbi-p pbi-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="pb-hair pbi-hair" data-shape="rect" data-anim="draw"></div>
  <p class="pb-mono pbi-note">导出原语：圆角矩形 · 直线 · 燕尾 · 旋转 · 阴影 · 竖排</p>
  <p class="pb-mono pbi-foot">图为示意图</p>
  <p class="pb-mono pb-pageno">07 / 18</p>
</section>

<section class="slide" data-layout="photobook/image" data-role="image">
  <img class="pb-photo pbf-img" src="assets/img/08-plate.jpg" alt="示意图：冷色远山与低悬的太阳">
  <h2 class="pb-serif pbf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="pb-body pbf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="pb-mono pbf-cap">PLATE — 示意图</p>
  <p class="pb-mono pb-pageno">08 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — add to `DESC` in `pblayouts.py`:
  - `photobook/matrix` —「矩阵盘点。一行标题 + 斜体副题 → 左栏斜体大总数 + 宋体单位 + 一句分组说明；右侧 4×3 底片小样（208×112 小图 + 等宽字母 + 宋体名称），当前风格的那一格外加一圈 2px 墨线（`pbm-sel`）。小图可复用 deck 里已有的照片。」
  - `photobook/compare` —「对比。一行标题 + 斜体副题 → 左右两张 568×260 照片 → 每侧等宽 BEFORE / AFTER、宋体小标题、两行以内说明、斜体大数字 + 一句单位。」
  - `photobook/image-text` —「图文。左半版满高照片出血；右栏两行宋体标题（每行一个 h2）→ 斜体副题 → 两段正文 → 细线 → 一行等宽注记；页脚「图为示意图」在右栏。每段正文 ≤50 字。」
  - `photobook/image` —「大图。照片像画册图版一样裱在页面上（四周留白），下方宋体标题、一句说明，右侧等宽「PLATE — 示意图」。」

- [ ] **Step 6: Verify batch** (new slides 5 6 7 8). Expected `10 slides checked: 0 errors, 0 warnings`. On the matrix page confirm the ring exports as a rectangle with an `<a:ln` (`unzip -p $G/deck.pptx 'ppt/slides/slide5.xml' | grep -c '<a:ln'` ≥ 1; a fill with alpha 0 is the known exporter quirk) and that the twelve frames are baked crops (`ls $G/.export-crops | grep -c '^s5-'` = 12). If image-text's first paragraph wraps to three lines, move `.pbi-p2`, `.pbi-hair`, `.pbi-note` down by the overflow and record the new tops.

- [ ] **Step 7: Commit** — `git add -A styles/photobook && git commit -m "Photobook: matrix, compare, image-text, image" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 3: points / bars / table

**Files:** `styles/photobook/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `09-points.jpg`, `11-bars.jpg`.

**Interfaces:** Consumes the page head / foot, `.pb-ink`, `.pb-hair`. Bars follow the P0 chart contract: each bar `data-shape="rect" data-value data-label`, every label / value / id text `data-chart`, so `--native-charts` can swap them for one PowerPoint chart.

- [ ] **Step 1: Images**

```bash
node scripts/gen-art.mjs $SP/img/points --palette "$COOL" --kind light --seed 91 --count 4 --size 1024x1440 --format jpg
node scripts/gen-art.mjs $SP/img/bars --palette "$WARM" --kind horizon --seed 111 --count 4 --size 752x984 --format jpg
python3 $SP/sheet.py $SP/img/points; python3 $SP/sheet.py $SP/img/bars
```

Pick → `09-points.jpg`（「示意图：冷色墙面上的窗光」）, `11-bars.jpg`（「示意图：暖色远山与落日」）.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- photobook/points ---------- */
/* text left, the photo bleeds off the right edge */
.pbt-img { left: 768px; top: 0; width: 512px; height: 720px; }
.pbt-it { left: 64px; top: 124px; width: 640px; font-size: 26px; }
.pbt-no { left: 64px; width: 640px; font-size: 22px; }
.pbt-h { left: 64px; width: 640px; font-size: 28px; line-height: 1.2; }
.pbt-p { left: 64px; width: 640px; }
.pbt-hair { left: 64px; width: 640px; }
.pbt-foot { left: 64px; top: 668px; width: 440px; }
.pbt-pageno { left: 504px; top: 668px; width: 200px; text-align: right; }

/* ---------- photobook/bars ---------- */
/* photo left; six bars at 72px per rule: label / bar / value / rule ids */
.pbb-img { left: 64px; top: 148px; width: 376px; height: 492px; }
.pbb-label { left: 488px; width: 120px; font-size: 18px; line-height: 1.3; text-align: right; }
.pbb-bar { left: 624px; height: 24px; }
.pbb-val { width: 32px; font-size: 32px; }
.pbb-ids { width: 240px; }

/* ---------- photobook/table ---------- */
.pbd-head { top: 164px; width: 200px; }
.pbd-ink { left: 64px; top: 192px; width: 1152px; height: 2px; }
.pbd-k { left: 64px; width: 216px; font-size: 20px; line-height: 1.3; }
.pbd-v { left: 304px; width: 568px; font-size: 18px; line-height: 1.4; color: var(--text-1); }
.pbd-s { left: 904px; width: 312px; }
.pbd-hair { left: 64px; width: 1152px; }
```

- [ ] **Step 3: Manifest** — add `"photobook/points": { "role": "points" }` after `photobook/image`, and `"photobook/bars": { "role": "bars" }`, `"photobook/table": { "role": "table" }` after `photobook/kpi`.

- [ ] **Step 4: Golden** — insert `points` after `image` (page 09), and `bars`, `table` after `kpi` (pages 11, 12). Points rows start at 196 / 344 / 492 (number, +32 heading, +74 text, +132 hairline). Bars rows at 184 + 80n; bar width = 72 × value; value left = 624 + width + 16; ids left = value left + 40. Table rows at 194 + 64n (item +20, spec +21, source +25, hairline +64).

```html
<section class="slide" data-layout="photobook/points" data-role="points">
  <img class="pb-photo pbt-img" src="assets/img/09-points.jpg" alt="示意图：冷色墙面上的窗光">
  <h2 class="pb-serif pb-title" data-anim="rise">三件事，件件可验证。</h2>
  <p class="pb-it pbt-it" data-anim="rise">Three promises, all checkable.</p>
  <p class="pb-it pbt-no" style="top: 196px;" data-merge="c1" data-anim="rise">No. 1</p>
  <h3 class="pb-serif pbt-h" style="top: 228px;" data-merge="c1" data-anim="rise">浏览器里演示</h3>
  <p class="pb-body pbt-p" style="top: 270px;" data-merge="c1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <div class="pb-hair pbt-hair" data-shape="rect" style="top: 328px;"></div>
  <p class="pb-it pbt-no" style="top: 344px;" data-merge="c2" data-anim="rise">No. 2</p>
  <h3 class="pb-serif pbt-h" style="top: 376px;" data-merge="c2" data-anim="rise">可编辑的 PPTX</h3>
  <p class="pb-body pbt-p" style="top: 418px;" data-merge="c2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <div class="pb-hair pbt-hair" data-shape="rect" style="top: 476px;"></div>
  <p class="pb-it pbt-no" style="top: 492px;" data-merge="c3" data-anim="rise">No. 3</p>
  <h3 class="pb-serif pbt-h" style="top: 524px;" data-merge="c3" data-anim="rise">机器先把关</h3>
  <p class="pb-body pbt-p" style="top: 566px;" data-merge="c3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <p class="pb-mono pbt-foot">Source — SKILL.md 第 6、8 步 · 图为示意图</p>
  <p class="pb-mono pbt-pageno">09 / 18</p>
</section>
```

```html
<section class="slide" data-layout="photobook/bars" data-role="bars">
  <h2 class="pb-serif pb-title" data-anim="rise">十六条规则，各管一摊。</h2>
  <p class="pb-it pb-voice" data-anim="rise">Sixteen rules, six concerns.</p>
  <img class="pb-photo pbb-img" src="assets/img/11-bars.jpg" alt="示意图：暖色远山与落日">
  <p class="pb-serif pbb-label" style="top: 184px;" data-chart>排版与几何</p>
  <div class="pb-ink pbb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 184px; width: 288px;"></div>
  <p class="pb-num pbb-val" style="top: 180px; left: 928px;" data-chart>4</p>
  <p class="pb-mono pbb-ids" style="top: 188px; left: 968px;" data-chart>R3 · R4 · R7 · R9</p>
  <p class="pb-serif pbb-label" style="top: 264px;" data-chart>版式与样式</p>
  <div class="pb-ink pbb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 264px; width: 288px;"></div>
  <p class="pb-num pbb-val" style="top: 260px; left: 928px;" data-chart>4</p>
  <p class="pb-mono pbb-ids" style="top: 268px; left: 968px;" data-chart>R1 · R2 · R6 · R12</p>
  <p class="pb-serif pbb-label" style="top: 344px;" data-chart>内容与数据</p>
  <div class="pb-ink pbb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 344px; width: 216px;"></div>
  <p class="pb-num pbb-val" style="top: 340px; left: 856px;" data-chart>3</p>
  <p class="pb-mono pbb-ids" style="top: 348px; left: 896px;" data-chart>R5 · R8 · R14</p>
  <p class="pb-serif pbb-label" style="top: 424px;" data-chart>可访问与媒体</p>
  <div class="pb-ink pbb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 424px; width: 216px;"></div>
  <p class="pb-num pbb-val" style="top: 420px; left: 856px;" data-chart>3</p>
  <p class="pb-mono pbb-ids" style="top: 428px; left: 896px;" data-chart>R10 · R11 · R13</p>
  <p class="pb-serif pbb-label" style="top: 504px;" data-chart>节奏</p>
  <div class="pb-ink pbb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 504px; width: 72px;"></div>
  <p class="pb-num pbb-val" style="top: 500px; left: 712px;" data-chart>1</p>
  <p class="pb-mono pbb-ids" style="top: 508px; left: 752px;" data-chart>R15</p>
  <p class="pb-serif pbb-label" style="top: 584px;" data-chart>导出一致</p>
  <div class="pb-ink pbb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 584px; width: 72px;"></div>
  <p class="pb-num pbb-val" style="top: 580px; left: 712px;" data-chart>1</p>
  <p class="pb-mono pbb-ids" style="top: 588px; left: 752px;" data-chart>R16</p>
  <p class="pb-mono pb-foot" data-source>Source — scripts/validate.mjs 规则注释（R1–R16），按守护对象分组 · 图为示意图</p>
  <p class="pb-mono pb-pageno">11 / 18</p>
</section>

<section class="slide" data-layout="photobook/table" data-role="table">
  <h2 class="pb-serif pb-title" data-anim="rise">一页纸，看懂规格。</h2>
  <p class="pb-it pb-voice" data-anim="rise">The fine print.</p>
  <p class="pb-mono pbd-head" style="left: 64px;">ITEM</p>
  <p class="pb-mono pbd-head" style="left: 304px;">SPEC</p>
  <p class="pb-mono pbd-head" style="left: 904px;">SOURCE</p>
  <div class="pb-ink pbd-ink" data-shape="rect" data-anim="draw"></div>
  <p class="pb-serif pbd-k" style="top: 214px;">画布</p>
  <p class="pbd-v" style="top: 215px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="pb-mono pbd-s" style="top: 219px;">assets/base.css</p>
  <div class="pb-hair pbd-hair" data-shape="rect" style="top: 258px;"></div>
  <p class="pb-serif pbd-k" style="top: 278px;">字号下限</p>
  <p class="pbd-v" style="top: 279px;">16 px，溢出先删字、再换版式</p>
  <p class="pb-mono pbd-s" style="top: 283px;">validate.mjs · R4</p>
  <div class="pb-hair pbd-hair" data-shape="rect" style="top: 322px;"></div>
  <p class="pb-serif pbd-k" style="top: 342px;">校验规则</p>
  <p class="pbd-v" style="top: 343px;">R1–R16，错误清零才能交付</p>
  <p class="pb-mono pbd-s" style="top: 347px;">validate.mjs</p>
  <div class="pb-hair pbd-hair" data-shape="rect" style="top: 386px;"></div>
  <p class="pb-serif pbd-k" style="top: 406px;">导出格式</p>
  <p class="pbd-v" style="top: 407px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="pb-mono pbd-s" style="top: 411px;">SKILL.md</p>
  <div class="pb-hair pbd-hair" data-shape="rect" style="top: 450px;"></div>
  <p class="pb-serif pbd-k" style="top: 470px;">页面角色</p>
  <p class="pbd-v" style="top: 471px;">20 个，其中 12 个核心角色</p>
  <p class="pb-mono pbd-s" style="top: 475px;">lib/roles.mjs</p>
  <div class="pb-hair pbd-hair" data-shape="rect" style="top: 514px;"></div>
  <p class="pb-serif pbd-k" style="top: 534px;">字体</p>
  <p class="pbd-v" style="top: 535px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="pb-mono pbd-s" style="top: 539px;">fetch-fonts.mjs</p>
  <div class="pb-hair pbd-hair" data-shape="rect" style="top: 578px;"></div>
  <p class="pb-mono pb-foot" data-source>Source — 表内 SOURCE 列（本仓库文件）</p>
  <p class="pb-mono pb-pageno">12 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — add to `DESC`:
  - `photobook/points` —「三点并列。左栏一行标题 → 斜体副题 → 三行「斜体 No. N / 宋体小标题 / 一行说明」，行间细线；照片从右边出血占满高（512×720）。页脚与页码收在左栏（`pbt-foot` / `pbt-pageno`）。每条说明 ≤30 字。」
  - `photobook/bars` —「条形对比。一行标题 + 斜体副题 → 左 376×492 照片；右侧 6 行「宋体标签（右对齐）/ 墨色条 / 斜体数值 / 等宽规则号」，条长每单位 72px（`data-value` × 72）。来源写 `data-source`；`--native-charts` 时整组换成 PowerPoint 原生条形图。」
  - `photobook/table` —「规格表。一行标题 + 斜体副题 → 等宽表头 ITEM / SPEC / SOURCE + 2px 墨线 → 6 行，行高 64px、行间细线。表格页不放照片。来源写 `data-source`。」

- [ ] **Step 6: Verify batch** (new slides 9 11 12). Expected `13 slides checked: 0 errors, 0 warnings`. Then the native-chart export:

```bash
node scripts/export-pptx.mjs $G --out $SP/pb-native.pptx --native-charts | grep -E 'written|warn'
node scripts/check-pptx.mjs $SP/pb-native.pptx --expect-slides 13
unzip -l $SP/pb-native.pptx | grep -c 'charts/chart'      # 1
```

- [ ] **Step 7: Commit** — `git add -A styles/photobook && git commit -m "Photobook: points, bars, table" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 4: timeline / gallery / closing

**Files:** `styles/photobook/{style.css, manifest.json, layouts.md}`, golden `index.html`, images `15-timeline.jpg`, `16-gallery-1.jpg`, `16-gallery-2.jpg`, `16-gallery-3.jpg` (closing reuses `01-cover-1…5`).

**Interfaces:** Consumes the page head / foot, `.pb-ink`, `.slide.is-dark`, and the cover's column classes `.pbc-c1…5` (closing repeats the cover strip on the same columns).

- [ ] **Step 1: Images**

```bash
node scripts/gen-art.mjs $SP/img/timeline --palette "$WARM" --kind horizon --seed 151 --count 4 --size 2304x440 --format jpg
node scripts/gen-art.mjs $SP/img/g1 --palette "$COOL" --kind arch --seed 161 --count 4 --size 1360x984 --format jpg
node scripts/gen-art.mjs $SP/img/g2 --palette "$WARM" --kind field --seed 165 --count 4 --size 912x476 --format jpg
node scripts/gen-art.mjs $SP/img/g3 --palette "$COOL" --kind light --seed 169 --count 4 --size 912x476 --format jpg
for d in timeline g1 g2 g3; do python3 $SP/sheet.py $SP/img/$d; done
```

Pick → `15-timeline.jpg`（「示意图：暖色远山与落日」）, `16-gallery-1.jpg`（「示意图：冷灰立板构成的空间」）, `16-gallery-2.jpg`（「示意图：暖色色场」）, `16-gallery-3.jpg`（「示意图：冷色墙面上的窗光」）.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- photobook/timeline ---------- */
/* a panorama over the line; five columns on the cover's 232px step */
.pbl-img { left: 64px; top: 148px; width: 1152px; height: 220px; }
.pbl-date { top: 396px; width: 208px; font-size: 40px; }
.pbl-line { left: 64px; top: 452px; width: 1152px; height: 2px; }
.pbl-node { top: 448px; width: 10px; height: 10px; }
.pbl-h { top: 476px; width: 208px; font-size: 22px; line-height: 1.3; }
.pbl-p { top: 512px; width: 208px; }
.pbl-c1 { left: 64px; }
.pbl-c2 { left: 296px; }
.pbl-c3 { left: 528px; }
.pbl-c4 { left: 760px; }
.pbl-c5 { left: 992px; }

/* ---------- photobook/gallery ---------- */
.pbg-w1 { left: 64px; top: 148px; width: 680px; height: 492px; }
.pbg-w2 { left: 760px; top: 148px; width: 456px; height: 238px; }
.pbg-w3 { left: 760px; top: 402px; width: 456px; height: 238px; }

/* ---------- photobook/closing ---------- */
/* the cover's strip again, shorter, on the darkroom page */
.pbe-img { top: 72px; width: 224px; height: 168px; }
.pbe-fr { top: 252px; width: 224px; }
.pbe-title { left: 0; width: 1280px; font-size: 48px; line-height: 1.25; text-align: center; }
.pbe-t1 { top: 312px; }
.pbe-t2 { top: 372px; }
.pbe-label { left: 0; top: 472px; width: 1280px; text-align: center; }
.pbe-cmd { left: 0; top: 504px; width: 1280px; font-family: var(--font-mono); font-size: 18px; line-height: 1.6; text-align: center; color: var(--text-1); }
.pbe-p { left: 0; top: 548px; width: 1280px; text-align: center; }
.pbe-meta { left: 0; top: 670px; width: 1280px; text-align: center; }
```

- [ ] **Step 3: Manifest** — after `photobook/process` add `"photobook/timeline": { "role": "timeline" }`, `"photobook/gallery": { "role": "gallery" }`; at the end add `"photobook/closing": { "role": "closing" }`.

- [ ] **Step 4: Golden** — after `process` insert `timeline` (15), `gallery` (16); `closing` goes last (18):

```html
<section class="slide" data-layout="photobook/timeline" data-role="timeline">
  <h2 class="pb-serif pb-title" data-anim="rise">从一套版式，到一座风格库。</h2>
  <p class="pb-it pb-voice" data-anim="rise">From one system to a library.</p>
  <img class="pb-photo pbl-img" src="assets/img/15-timeline.jpg" alt="示意图：暖色远山与落日">
  <p class="pb-num pbl-date pbl-c1" data-anim="rise">07.16</p>
  <p class="pb-num pbl-date pbl-c2" data-anim="rise">07.18</p>
  <p class="pb-num pbl-date pbl-c3" data-anim="rise">08.17</p>
  <p class="pb-num pbl-date pbl-c4" data-anim="rise">08.18</p>
  <p class="pb-num pbl-date pbl-c5" data-anim="rise">10.08</p>
  <div class="pb-ink pbl-line" data-shape="rect" data-anim="draw"></div>
  <div class="pb-ink pbl-node pbl-c1" data-shape="rect" data-anim="pop"></div>
  <div class="pb-ink pbl-node pbl-c2" data-shape="rect" data-anim="pop"></div>
  <div class="pb-ink pbl-node pbl-c3" data-shape="rect" data-anim="pop"></div>
  <div class="pb-ink pbl-node pbl-c4" data-shape="rect" data-anim="pop"></div>
  <div class="pb-ink pbl-node pbl-c5" data-shape="rect" data-anim="pop"></div>
  <h3 class="pb-serif pbl-h pbl-c1" data-merge="c1" data-anim="rise">首版发布</h3>
  <p class="pb-body pbl-p pbl-c1" data-merge="c1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <h3 class="pb-serif pbl-h pbl-c2" data-merge="c2" data-anim="rise">墨韵衬线</h3>
  <p class="pb-body pbl-p pbl-c2" data-merge="c2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <h3 class="pb-serif pbl-h pbl-c3" data-merge="c3" data-anim="rise">校验全覆盖</h3>
  <p class="pb-body pbl-p pbl-c3" data-merge="c3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <h3 class="pb-serif pbl-h pbl-c4" data-merge="c4" data-anim="rise">瑞士国际</h3>
  <p class="pb-body pbl-p pbl-c4" data-merge="c4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <h3 class="pb-serif pbl-h pbl-c5" data-merge="c5" data-anim="rise">风格库</h3>
  <p class="pb-body pbl-p pbl-c5" data-merge="c5" data-anim="rise">十二种风格，版式独立。</p>
  <p class="pb-mono pb-foot">Source — git log · 2026-07-16 → 2026-10-08 · 图为示意图</p>
  <p class="pb-mono pb-pageno">15 / 18</p>
</section>

<section class="slide" data-layout="photobook/gallery" data-role="gallery">
  <h2 class="pb-serif pb-title" data-anim="rise">配图由脚本生成，按风格取色。</h2>
  <p class="pb-it pb-voice" data-anim="rise">Seeded, repeatable, on palette.</p>
  <img class="pb-photo pbg-w1" src="assets/img/16-gallery-1.jpg" alt="示意图：冷灰立板构成的空间">
  <img class="pb-photo pbg-w2" src="assets/img/16-gallery-2.jpg" alt="示意图：暖色色场">
  <img class="pb-photo pbg-w3" src="assets/img/16-gallery-3.jpg" alt="示意图：冷色墙面上的窗光">
  <p class="pb-mono pb-foot">Source — scripts/gen-art.mjs · 固定种子，输出可复现 · 三幅均为示意图</p>
  <p class="pb-mono pb-pageno">16 / 18</p>
</section>
```

```html
<section class="slide is-dark" data-layout="photobook/closing" data-role="closing">
  <img class="pb-photo pbe-img pbc-c1" src="assets/img/01-cover-1.jpg" alt="示意图：窗光落在暗墙上">
  <img class="pb-photo pbe-img pbc-c2" src="assets/img/01-cover-2.jpg" alt="示意图：冷色远山与低悬的太阳">
  <img class="pb-photo pbe-img pbc-c3" src="assets/img/01-cover-3.jpg" alt="示意图：暖灰立板与一块琥珀色">
  <img class="pb-photo pbe-img pbc-c4" src="assets/img/01-cover-4.jpg" alt="示意图：冷色墙面上的窗光">
  <img class="pb-photo pbe-img pbc-c5" src="assets/img/01-cover-5.jpg" alt="示意图：暖色远山与落日">
  <p class="pb-mono pbe-fr pbc-c1">06A</p>
  <p class="pb-mono pbe-fr pbc-c2">07A</p>
  <p class="pb-mono pbe-fr pbc-c3">08A</p>
  <p class="pb-mono pbe-fr pbc-c4">09A</p>
  <p class="pb-mono pbe-fr pbc-c5">10A</p>
  <h2 class="pb-serif pbe-title pbe-t1" data-merge="title" data-anim="rise">挑一种风格，</h2>
  <h2 class="pb-serif pbe-title pbe-t2" data-merge="title" data-anim="rise">开始下一份。</h2>
  <p class="pb-mono pbe-label">START — 新建 DECK</p>
  <p class="pbe-cmd">node scripts/new-deck.mjs my-deck --style photobook</p>
  <p class="pb-body pbe-p">风格画廊：docs/styles/index.html</p>
  <p class="pb-mono pbe-meta">ZIFEIYU PPT SKILL · 风格 G 摄影集 · 画册 · 图均为示意图</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — add to `DESC`:
  - `photobook/timeline` —「时间线。一行标题 + 斜体副题 → 1152×220 全景照片 → 5 列（与封面胶片条同一列距 232px）：斜体日期 → 墨线与方形节点 → 宋体节点名 + 两行以内说明。」
  - `photobook/gallery` —「图集。一行标题 + 斜体副题 → 左大图 680×492 + 右两张 456×238 叠放，三张同高收边于 640；页脚写出处与「三幅均为示意图」。」
  - `photobook/closing` —「结尾暗房页。封面胶片条再出现一次（5 张 224×168，同列距，帧号接着封面往下编）→ 两行宋体标题居中 → 等宽「START — 新建 DECK」+ 命令 → 风格画廊路径 → 底部一行等宽标签。」

- [ ] **Step 6: Verify batch** (new slides 15 16 18). Expected `16 slides checked: 0 errors, 0 warnings`. Check specifically: the timeline nodes sit centred on the line (node 448–458, line 452–454) in both renders; the closing strip lines up with the cover strip's columns; on the darkroom page the command line is near-white and the gallery path grey.

- [ ] **Step 7: Commit** — `git add -A styles/photobook && git commit -m "Photobook: timeline, gallery, closing" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 5: video / audio

**Files:** `styles/photobook/{style.css, manifest.json, layouts.md}`, golden `index.html`, `golden/assets/media/{13-film.mp4, 13-film-poster.jpg, 17-tone.mp3}`, `golden/assets/img/17-audio.jpg`.

**Interfaces:** P0 media contract — `<video>` needs `poster` + `aria-label` (R13/R10); `<audio>` needs `controls` + `aria-label`; `data-media="toggle|track|progress|clock"` drive playback (`assets/enhance.js`); the exporter embeds media with the rendered poster as cover. A glyph laid over a `data-media="toggle"` shape needs `pointer-events: none` or it swallows the click.

- [ ] **Step 1: Media**

```bash
M=styles/photobook/golden/assets/media; mkdir -p $M
node scripts/gen-art.mjs $SP/film --palette "$WARM" --kind light --seed 131 --size 1920x1080 --format jpg
ffmpeg -y -loglevel error -loop 1 -i $SP/film/light-131.jpg -vf "zoompan=z='min(zoom+0.0008,1.15)':d=192:s=1280x720:fps=24,format=yuv420p" -t 8 -c:v libx264 -crf 30 -preset slow -movflags +faststart -an $M/13-film.mp4
ffmpeg -y -loglevel error -i $M/13-film.mp4 -frames:v 1 -q:v 4 $M/13-film-poster.jpg
cp examples/media/assets/media/demo.mp3 $M/17-tone.mp3
node scripts/gen-art.mjs $SP/img/audio --palette "$COOL" --kind field --seed 175 --count 4 --size 896x896 --format jpg
python3 $SP/sheet.py $SP/img/audio
ffprobe -v error -show_entries format=duration -of csv=p=0 $M/13-film.mp4 $M/17-tone.mp3   # expect 8.0 / 8.0
ls -la $M                                                                                    # mp4 should stay under ~1MB
```

Pick one square → `styles/photobook/golden/assets/img/17-audio.jpg`（「示意图：冷色色场」）.

- [ ] **Step 2: CSS** — append:

```css
/* ---------- photobook/video ---------- */
.pbw-video { left: 64px; top: 148px; width: 864px; height: 486px; object-fit: cover; background: #000; }
.pbw-p { left: 960px; top: 148px; width: 256px; }
.pbw-hint { left: 960px; top: 248px; width: 256px; }

/* ---------- photobook/audio ---------- */
.pbo-img { left: 64px; top: 148px; width: 448px; height: 448px; }
.pbo-p { left: 576px; top: 264px; width: 640px; }
.pbo-hair { left: 576px; top: 360px; width: 640px; }
.pbo-play { left: 576px; top: 400px; width: 72px; height: 72px; }
.pbo-glyph { left: 576px; top: 418px; width: 72px; text-align: center; font-size: 24px; line-height: 1.5; color: var(--on-accent); pointer-events: none; }
.pbo-audio { left: 576px; top: 400px; width: 72px; height: 72px; opacity: 0; pointer-events: none; }
.pbo-track { left: 680px; top: 404px; width: 536px; font-size: 24px; line-height: 1.3; }
.pbo-meta { left: 680px; top: 444px; width: 536px; }
.pbo-bar { left: 680px; top: 484px; width: 536px; height: 2px; background: var(--hairline); }
.pbo-progress { left: 680px; top: 484px; width: 0; height: 2px; background: var(--text-1); }
.pbo-time { left: 680px; top: 500px; width: 536px; }
```

- [ ] **Step 3: Manifest** — add `"photobook/video": { "role": "video" }` after `photobook/table`, `"photobook/audio": { "role": "audio" }` after `photobook/gallery`.

- [ ] **Step 4: Golden** — `video` after `table` (13), `audio` after `gallery` (17):

```html
<section class="slide is-dark" data-layout="photobook/video" data-role="video">
  <h2 class="pb-serif pb-title" data-anim="rise">视频也能放进来</h2>
  <p class="pb-it pb-voice" data-anim="rise">Click to play.</p>
  <video class="pbw-video" src="assets/media/13-film.mp4" poster="assets/media/13-film-poster.jpg" aria-label="示意视频：窗光落在暗墙上，镜头缓慢推近" preload="none"></video>
  <p class="pb-body pbw-p" data-anim="rise">演示时点击画面播放；渲染图、PDF 与 PPTX 的静止画面锁定在封面帧。</p>
  <p class="pb-mono pbw-hint">0:08 · MP4</p>
  <p class="pb-mono pb-foot">示意视频，由抽象图生成</p>
  <p class="pb-mono pb-pageno">13 / 18</p>
</section>
```

```html
<section class="slide" data-layout="photobook/audio" data-role="audio">
  <h2 class="pb-serif pb-title" data-anim="rise">边听边翻页</h2>
  <p class="pb-it pb-voice" data-anim="rise">Listen while you flip.</p>
  <img class="pb-photo pbo-img" src="assets/img/17-audio.jpg" alt="示意图：冷色色场">
  <p class="pb-body pbo-p" data-anim="rise">音频放在 deck 目录里，演示时点圆点播放；导出 PPTX 后仍能在演示软件里播放。</p>
  <div class="pb-hair pbo-hair" data-shape="rect"></div>
  <div class="pb-ink pbo-play" data-shape="ellipse" data-media="toggle"></div>
  <p class="pbo-glyph">▶</p>
  <audio class="pbo-audio" src="assets/media/17-tone.mp3" aria-label="示意音频：一段 8 秒提示音" controls preload="none"></audio>
  <h3 class="pb-serif pbo-track">示意音频 · 提示音</h3>
  <p class="pb-mono pbo-meta">0:08 · MP3 · 示意素材</p>
  <div class="pbo-bar" data-shape="rect" data-media="track"></div>
  <div class="pbo-progress" data-shape="rect" data-media="progress"></div>
  <p class="pb-mono pbo-time" data-media="clock">0:00 / 0:08</p>
  <p class="pb-mono pb-foot">Source — references/pptx-export.md「媒体随行」 · 图为示意图</p>
  <p class="pb-mono pb-pageno">17 / 18</p>
</section>
```

- [ ] **Step 5: `layouts.md`** — add to `DESC`:
  - `photobook/video` —「视频暗房页。一行标题 + 斜体副题 → 左 864×486 视频（默认停在封面帧，点击播放）；右栏说明与等宽时长。`poster` 与 `aria-label` 必填，时长写真实值。」
  - `photobook/audio` —「音频页。一行标题 + 斜体副题 → 左 448 方图；右栏说明 → 细线 → 播放器：墨色圆点（`data-media="toggle"`，上面的 ▶ 不接收点击）、宋体音轨名、等宽元信息、进度线与时间。`<audio>` 必带 `controls` 与 `aria-label`，时长写真实值。」

- [ ] **Step 6: Verify batch** (new slides 13 17) — plus: `unzip -l $G/deck.pptx | grep -E "media.*\.(mp4|mp3)"` lists both files; the audio wiring check (navigation follows the magazine plan; the runtime parses `#/N`; if present-mode entry differs, read `assets/runtime.js` and adapt the two navigation lines only):

```bash
node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    await p.goto("file://" + process.cwd() + "/styles/photobook/golden/index.html#/17");
    await p.keyboard.press("f").catch(() => {});
    await p.locator(".pbo-play").click(); await p.waitForTimeout(1500);
    const w = await p.locator(".pbo-progress").evaluate((e) => e.getBoundingClientRect().width);
    console.log("progress px", w); process.exitCode = w > 0 ? 0 : 1;
  } finally { await b.close(); }
})();'
```

Expected `18 slides checked: 0 errors, 0 warnings`.

- [ ] **Step 7: Commit** — `git add -A styles/photobook && git commit -m "Photobook: video and audio" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`

---

### Task 6: Ship G — ready status, baseline, gallery, CI, docs, sync

**Files:**
- Modify: `styles/photobook/manifest.json` (`"status": "ready"`), `styles/photobook/layouts.md` (status line, via `pblayouts.py`)
- Modify: `.github/workflows/validate.yml`
- Modify: `SKILL.md`, `README.md`, `README.en.md`, `ARCHITECTURE.md`
- Create: `baselines/styles/photobook/slide-{1..18}.png`, `docs/styles/photobook.png`; regenerate `docs/styles/index.html`, `docs/styles/gallery.png`

- [ ] **Step 1: Ready gate.** Set `"status": "ready"`; add to `STATUS` in `pblayouts.py`: `'ready': '> 状态：ready · 18 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / gallery / video / audio。'` and regenerate. Run `node scripts/check-style.mjs styles/photobook` → `0 errors, 0 warnings`. Run `node scripts/validate.mjs styles/photobook/golden --office` → `0 errors, 0 warnings`; an R15 warning means the page-order table was not followed — fix the order, not the rule.

- [ ] **Step 2: Full visual pass.** Render, export, LibreOffice-render all 18 pages (verify routine) and Read every pair in sheets of three. Fix anything on the checklist in `style.css` / golden, re-run, then `node scripts/new-deck.mjs styles/photobook/golden --refresh`.

- [ ] **Step 3: Baseline + regress**

```bash
node scripts/baseline.mjs          # gates on check-style + validate, re-records every golden
git checkout baselines/media/slide-4.png   # ▶ antialias drift it re-records every time
git status --short baselines/      # only baselines/styles/photobook/* may be new; any other modified PNG = regression, stop and investigate
rm -rf .regress                    # regress does not clear old renders; a stale page shows up as EXTRA
node scripts/regress.mjs           # every page 0.00%
```

- [ ] **Step 4: Gallery** — `node scripts/style-gallery.mjs`; Read `docs/styles/gallery.png`; the G card sits in 影像叙事 and shows the photobook cover.

- [ ] **Step 5: CI** — in `.github/workflows/validate.yml`, after the consulting pair add:

```yaml
          node scripts/export-pptx.mjs styles/photobook/golden --out /tmp/photobook.pptx --native-charts
          unzip -l /tmp/photobook.pptx | grep -q "media-.*\.mp4"
          node scripts/check-pptx.mjs /tmp/photobook.pptx --expect-slides 18
```

Run the three lines locally (with `$SP` instead of `/tmp`) before committing.

- [ ] **Step 6: Docs**
  - `SKILL.md`「风格库现状」: append ` · **G 摄影集 · 画册**（`photobook`，ready，18 个版式）` after the H entry.
  - `README.md` / `README.en.md`: the shipped list becomes「已交付：A 杂志 · 暖纸、B 瑞士 · 网格、H 咨询 · 白皮书、G 摄影集 · 画册」(EN: "Shipped: A Magazine, B Swiss, H Consulting, G Photobook").
  - `ARCHITECTURE.md`: after M13 add「- **M14 · 风格 G 摄影集（P1）**：18 个版式覆盖 12 个核心角色 + matrix / bars / table / gallery / video / audio；照片占满版面、文字退到图注，界面不用强调色，数字压在照片的半透明压暗条上（原生透明度），暗房页给金句 / 视频 / 结尾；gen-art 新增 light / horizon 两种图类，金样冷暖两组胶片色调交替。P1 四种风格至此全部交付。」

- [ ] **Step 7: Tests + commit**

```bash
npm test
git add -A styles/photobook baselines/styles/photobook docs/styles .github/workflows/validate.yml SKILL.md README.md README.en.md ARCHITECTURE.md
git commit -m "Ship style G photobook: ready, baseline, gallery, CI, docs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 8: Finish the branch** — use superpowers:finishing-a-development-branch; after merge: `npm run sync`, scan the installed copy (`~/.claude/skills/zifeiyu-ppt-skill`: `assets`, `references`, `scripts`, `templates`, `examples`, `styles`, `docs/styles`) for files that no longer exist in the repo and delete them (expect none — G only adds files), `npm run sync-check` → 0 drifted, and smoke the installed copy: `new-deck --style photobook` into the scratchpad, replace the `<!-- SLIDES_HERE… -->` comment with the golden's sections (match `<section class="slide[ "]` so `slide is-dark` pages are included), copy `golden/assets/img` and `golden/assets/media`, then `subset-fonts` + `validate --office` (18 slides, 0/0) + `export-pptx` (no `warn:`) + `check-pptx` (0 errors).

---

## Appendix A · Scratchpad helpers

`$SP/cmp.py` — side-by-side sheet, HTML render left, LibreOffice right:

```python
import sys, glob, os
from PIL import Image, ImageDraw
renders, lo, out = sys.argv[1], sys.argv[2], sys.argv[3]
nums = [int(n) for n in sys.argv[4:]]
w = len(os.path.basename(glob.glob(lo + '/p-*.png')[0])) - 6   # pdftoppm pads page numbers to the page count's width
sc = 0.6; W, H = int(1280*sc), int(720*sc); pad = 24
sheet = Image.new('RGB', (W*2 + pad*3, (H + pad) * len(nums) + pad), (200, 60, 60))
d = ImageDraw.Draw(sheet)
for i, n in enumerate(nums):
    y = pad + i * (H + pad)
    a = Image.open(f'{renders}/slide-{n}.png').convert('RGB').resize((W, H))
    b = Image.open(f'{lo}/p-{n:0{w}d}.png').convert('RGB').resize((W, H))
    sheet.paste(a, (pad, y)); sheet.paste(b, (pad*2 + W, y))
    d.text((4, y), str(n), fill=(255, 255, 255))
sheet.save(out)
```

`$SP/sheet.py` — contact sheet of one candidate folder (labels are file names):

```python
import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]
fs = sorted(glob.glob(d + '/*.jpg'))
th = 300
ims = [Image.open(f).convert('RGB') for f in fs]
ws = [int(im.width * th / im.height) for im in ims]
sheet = Image.new('RGB', (sum(ws) + 12 * (len(ws) + 1), th + 40), 'white'); dr = ImageDraw.Draw(sheet)
x = 12
for f, im, w in zip(fs, ims, ws):
    sheet.paste(im.resize((w, th)), (x, 12)); dr.text((x, th + 18), os.path.basename(f), fill='black'); x += w + 12
sheet.save(d + '/sheet.png')
```

`$SP/pblayouts.py` — regenerates `styles/photobook/layouts.md` (header + grammar + one entry per manifest layout: description + the golden `<section>` verbatim). Tasks add their `DESC` entries and grammar items; this is the specimen version:

````python
import json, re, sys
root = sys.argv[1]
st = f'{root}/styles/photobook'
man = json.load(open(f'{st}/manifest.json', encoding='utf-8'))
gold = open(f'{st}/golden/index.html', encoding='utf-8').read()
secs = {re.search(r'data-layout="([^"]+)"', s).group(1): s for s in re.findall(r'<section class="slide[ "].*?</section>', gold, re.S)}

STATUS = {
    'draft': '> 状态：draft · P1 样张阶段，已有 cover / kpi / process；其余核心角色未完成前，交付请用其他风格。',
}
GRAMMAR = '''## 版面语法

1. **照片是主角**：内容页照片占版面一半以上；文字退到图注的位置，标题一行（`pb-serif pb-title`，44px，最多 14 字），右侧可配一行拉丁斜体副题（`pb-it pb-voice`）。
2. **不用强调色**：界面只有墨色、灰与近白，颜色交给照片；不用 `is-accent` / `is-mark`。
3. **压暗条**：照片上放字时，先铺一块 `pb-scrim`（`rgba(12,11,10,.55)`，导出为原生半透明矩形），字用 `pb-on` / `pb-on2`；不在没有压暗条的照片上直接放字。
4. **页脚**：top 668 一行等宽字，左「Source — 出处 · 图为示意图」（`pb-mono pb-foot`，数据页加 `data-source`），右页码「NN / 总页数」（`pb-mono pb-pageno`）。
5. **字体分工**：标题与小标题用思源宋 Bold（`pb-serif`，Office 里是宋体）；图注、编号与数字用 Playfair 斜体（`pb-it` / `pb-num`，等高数字，Office 里是 Times New Roman）；帧号与页脚用 JetBrains Mono（`pb-mono`，Office 里是 Consolas）；正文 `pb-body` 走系统字体。
6. **配图**：金样配图由 `scripts/gen-art.mjs` 生成，冷暖两组胶片色调交替（`--palette`，见各条目），alt 与页脚都写「示意图」。'''

DESC = {
    'photobook/cover': '封面。两行宋体标题居中（每行一个 h1）→ 一行拉丁斜体副题 → 胶片条：5 张 224×300 竖幅照片一排，每张下面一个等宽帧号 → 居中说明 → 底部一行等宽标签。照片换成自己的 5 张时保持同一高度。',
    'photobook/kpi': '数据页。一行标题 → 3 张 376×492 高幅照片并排，每张底部一块压暗条，条上斜体大数字 + 宋体标签 + 一句说明（≤22 字，最多两行）→ 页脚出处（`data-source`）与页码。三个数都必须真实。',
    'photobook/process': '流程页。一行标题 + 右侧斜体副题 → 4 张 276×300 照片对应 4 步 → 每张下面斜体「No. N」+ 宋体步骤名 + 一段说明（≤26 字）→ 页脚出处与页码。',
}

out = ['# 摄影集 · 画册（photobook）版式注册表', '', STATUS[man['status']], '',
       '规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/photobook/golden/`；金样文字来自 `docs/golden-content.md`。',
       '', GRAMMAR, '']
for lid, meta in man['layouts'].items():
    out += [f'## {lid} · {meta["role"]}', '', DESC[lid], '', '```html', secs[lid], '```', '']
open(f'{st}/layouts.md', 'w', encoding='utf-8').write('\n'.join(out))
print(len(man['layouts']), 'layouts written')
````
