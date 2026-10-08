# 杂志 · 暖纸（magazine）版式注册表

> 状态：draft（P1 执行中）。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/magazine/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **版心**：左右各 96px，页眉等宽标签在 top 64，页脚细线在 640、页脚文字在 660；照片栏从 left 640（封面）或 704（内页）起。
2. **字体分工**：标题 / 步骤名 / 标签用宋体粗（`mg-serif`）；一句拉丁斜体（`mg-it`）给标题配副声部；数字一律 `mg-num`（Playfair 等高数字；Office 里是 Times New Roman，同为等高数字——旧式数字的 0 像字母 o，见 failures.md #5）；说明文字 `mg-body`；页眉页脚、图注、出处用等宽 `mg-mono`（大写拉丁直接写成大写，不用 text-transform）。
3. **柠檬黄全页只用一处**：用 `<span class="is-mark">`，导出为 PPTX 原生高亮；不用 `is-accent`（黄色字在暖纸上不可读）。
4. **照片是主角**：每张图带 `FIG. NN — 图注` 等宽图注；金样配图是 gen-art 抽象图，图注写「示意图」。
5. **大标题不放拉丁字母**：宋体粗的拉丁字形很宽，`HTML`、`PPTX` 这类词放进斜体副题或说明。
6. **墨页**：`slide is-dark` 只给 statement / video / closing，用来打断暖纸页的节奏。
7. **标题头**：半宽两行标题用 `mg-head mg-head1/2`，整行标题用 `mg-title`，下面的斜体一句用 `mg-voice`。

## magazine/cover · cover

封面。左文右图：右半幅照片（640×720）带白色图注；左侧卷号 → 荧光黄 kicker（全页唯一一处黄）→ 两行宋体大标题（每行一个 h1，每行 ≤5 个汉字，避免拉丁字母）→ 拉丁斜体一句 → 两行以内说明 → 细线 + 等宽元信息。

```html
<section class="slide" data-layout="magazine/cover" data-role="cover">
  <img class="mg-photo mgc-img" src="assets/img/01-cover.jpg" alt="示意图：暖灰立板与一块柠檬黄">
  <p class="mg-mono mg-folio">VOL. 01 — 2026 · ZIFEIYU PPT SKILL</p>
  <p class="mg-mono mgc-kicker"><span class="is-mark">网页 PPT · 可编辑导出</span></p>
  <h1 class="mg-serif mgc-title mgc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="mg-serif mgc-title mgc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <p class="mg-it mgc-it" data-anim="rise">One source, every format.</p>
  <p class="mgc-sub" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="mg-hair mgc-hair" data-shape="rect"></div>
  <p class="mg-mono mgc-meta">STYLE A — MAGAZINE · 1280 × 720</p>
  <p class="mg-mono mg-cap-on mgc-cap">FIG. 01 — 示意图</p>
</section>
```

## magazine/agenda · agenda

目录。左：页标题 + 斜体副题 + 一张图；右：3–4 行「编号 / 条目 / 一行说明 / 页码」，行间细线。条目 ≤5 字，说明 ≤14 字。

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
```

## magazine/statement · statement

金句墨页。柠檬黄大引号是全页唯一的黄；引文两行（每行一个 h2，每行 ≤10 字），斜体一句，等宽出处。

```html
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
```

## magazine/section · section

章节色场。满版照片 + 全幅压暗，白色大号章节数字、宋体章节名、斜体一句；照片左半要安静。

```html
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

## magazine/kpi · kpi

数据大字。左：两行结论标题 + 一个主数字（≤3 位）+ 标签与说明；右：照片 + 两组次数字。三个数都必须真实，页脚 `data-source` 写出处。

```html
<section class="slide" data-layout="magazine/kpi" data-role="kpi">
  <p class="mg-mono mg-folio">03 — QUALITY GATES</p>
  <h2 class="mg-serif mg-head mg-head1" data-merge="title" data-anim="rise">导出之前，</h2>
  <h2 class="mg-serif mg-head mg-head2" data-merge="title" data-anim="rise">先过十六道检查。</h2>
  <p class="mg-num mgk-hero" data-anim="count">16</p>
  <p class="mg-serif mgk-hero-label" data-merge="hero" data-anim="rise">条校验规则</p>
  <p class="mg-body mgk-hero-sub" data-merge="hero" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <img class="mg-photo mgk-img" src="assets/img/10-kpi.jpg" alt="示意图：柔和的灰色色场">
  <p class="mg-mono mgk-cap">FIG. 07 — 示意图</p>
  <div class="mg-ink mgk-ink" data-shape="rect" data-anim="draw"></div>
  <p class="mg-num mgk-num mgk-r1" data-anim="count">20</p>
  <p class="mg-serif mgk-label mgk-r1l" data-merge="r1" data-anim="rise">页面角色</p>
  <p class="mg-body mgk-sub mgk-r1s" data-merge="r1" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <div class="mg-hair mgk-hair" data-shape="rect" data-anim="draw"></div>
  <p class="mg-num mgk-num mgk-r2" data-anim="count">3</p>
  <p class="mg-serif mgk-label mgk-r2l" data-merge="r2" data-anim="rise">导出格式</p>
  <p class="mg-body mgk-sub mgk-r2s" data-merge="r2" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot" data-source>Source — 本仓库 scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="mg-mono mg-pageno">10 / 18</p>
</section>
```

## magazine/process · process

流程四步。左上标题 + 斜体副题，右上照片；粗线下四列「编号 / 步骤名 / 两行说明」。最关键的一步用 `is-mark` 标黄（全页唯一一处）；说明每条 ≤26 字。

```html
<section class="slide" data-layout="magazine/process" data-role="process">
  <p class="mg-mono mg-folio">CHAPTER 02 — WORKFLOW</p>
  <h2 class="mg-serif mgp-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="mg-it mgp-it" data-anim="rise">from outline to deck.</p>
  <img class="mg-photo mgp-img" src="assets/img/14-process.jpg" alt="示意图：暖灰立板构成的空间">
  <p class="mg-mono mgp-cap">FIG. 09 — 示意图</p>
  <div class="mg-ink mgp-ink" data-shape="rect" data-anim="draw"></div>
  <p class="mg-num mgp-num mgp-c1" data-merge="s1" data-anim="rise">01</p>
  <h3 class="mg-serif mgp-h mgp-c1" data-merge="s1" data-anim="rise">选风格</h3>
  <p class="mg-body mgp-p mgp-c1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="mg-num mgp-num mgp-c2" data-merge="s2" data-anim="rise">02</p>
  <h3 class="mg-serif mgp-h mgp-c2" data-merge="s2" data-anim="rise">填版式</h3>
  <p class="mg-body mgp-p mgp-c2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="mg-num mgp-num mgp-c3" data-merge="s3" data-anim="rise">03</p>
  <h3 class="mg-serif mgp-h mgp-c3" data-merge="s3" data-anim="rise">过校验</h3>
  <p class="mg-body mgp-p mgp-c3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="mg-num mgp-num mgp-c4" data-merge="s4" data-anim="rise">04</p>
  <h3 class="mg-serif mgp-h mgp-c4" data-merge="s4" data-anim="rise"><span class="is-mark">导出</span></h3>
  <p class="mg-body mgp-p mgp-c4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="mg-hair mg-rule" data-shape="rect"></div>
  <p class="mg-mono mg-foot">ZIFEIYU PPT SKILL · WORKFLOW</p>
  <p class="mg-mono mg-pageno">14 / 18</p>
</section>
```
