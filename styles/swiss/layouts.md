# 瑞士 · 网格（swiss）版式注册表

> 状态：draft · P1 重做中，已有 6 个版式；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/swiss/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **12 栏网格**：版心 64–1216（1152px），栏宽 74、栏距 24；常用分栏起点——三栏 64 / 456 / 848（宽 368），四栏 64 / 358 / 652 / 946（宽 270），两栏 64 / 652（宽 564）。页眉等宽标签与页码在 top 48，页脚细线在 640、页脚文字在 660，标题在 104；两行标题第二行用 `sw-head2`（top 166）。
2. **字体分工**：巨字中文用 `sw-giant`（思源黑最细一档，Office 里是微软雅黑 Light）；巨数字用 `sw-num`（Inter ExtraLight，Office 里是 Segoe UI Light）；页标题 `sw-title`（细体 52px）；小标题 `sw-h`（600）；说明 `sw-body`；页眉页脚、图注、出处用等宽 `sw-mono`（大写拉丁直接写成大写）。
3. **克莱因蓝全页只用一处**：一块 `sw-accent` 色块，或一个 `sw-ac` 数字 / `is-accent` 词，或一格 `is-on` 刻度，三选一；其余色块一律 `sw-grey` / `sw-ink`。色块上的文字用 `sw-on`（主）/ `sw-on2`（次）。
4. **巨字只用细体**：巨字与巨数字禁止加粗，层级靠字号拉开。巨数字字形几乎没有左侧留白，左坐标比栏起点内收或外放几像素做视觉对齐（见各版式的数字类）。
5. **方块刻度**：分页标记一律直角小方块 `sw-tick`（10×10），当前项加 `is-on` 拉宽到 24px；不用圆点。贴左缘的四格一排用 `sw-k1`–`sw-k4`。
6. **色彩闭环**：封面以克莱因蓝色块开场，结尾页同样以克莱因蓝收束。
7. **换 accent**：按 style.css 头部注释的许可对整套替换 token，一份 deck 只有一种 accent。
8. **墨页与蓝页**：`slide is-dark` 给 section / cycle（克莱因蓝在墨底上提亮为 #5b7bff）；`slide is-accent` 整页克莱因蓝，只给 statement——蓝页本身就是这一页的那一处蓝。

## swiss/cover · cover

封面。左 768px 克莱因蓝色块、右 512px 照片（深色图注）；色块上：等宽卷号 → 两行极细巨字（每行一个 h1，每行 ≤5 个汉字）→ 两行以内说明 → 方块刻度 → 等宽标签。

```html
<section class="slide" data-layout="swiss/cover" data-role="cover">
  <div class="sw-accent swc-panel" data-shape="rect"></div>
  <img class="sw-photo swc-img" src="assets/img/01-cover.jpg" alt="示意图：灰白立板之间的一块克莱因蓝">
  <p class="sw-mono sw-on2 swc-kicker">ZIFEIYU PPT SKILL</p>
  <p class="sw-mono sw-on2 swc-vol">VOL. 01 — 2026</p>
  <h1 class="sw-giant sw-on swc-title swc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="sw-giant sw-on swc-title swc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <p class="sw-lede sw-on swc-lede" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="sw-tick sw-on is-on swc-tick sw-k1" data-shape="rect"></div>
  <div class="sw-tick sw-on swc-tick sw-k2" data-shape="rect"></div>
  <div class="sw-tick sw-on swc-tick sw-k3" data-shape="rect"></div>
  <div class="sw-tick sw-on swc-tick sw-k4" data-shape="rect"></div>
  <p class="sw-mono sw-on swc-meta">网页 PPT · 可编辑导出</p>
  <p class="sw-mono swc-cap">FIG. 01 — 示意图</p>
</section>
```

## swiss/agenda · agenda

目录。整行标题 + 黑色细线，4 行「巨数字编号 / 条目 / 一行说明 / 页码」，行高 106px、行间细线，页脚细线收住最后一行；第一个编号上蓝。条目 ≤6 字，说明 ≤14 字。

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
```

## swiss/statement · statement

金句蓝页。整页克莱因蓝，白色短条 → 两行极细巨字（每行一个 h2，每行 ≤10 字）→ 等宽出处。

```html
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
```

## swiss/section · section

章节墨页。极细巨数字章节号、极细巨字章节名、四格方块刻度标出当前章（`is-on`）。

```html
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

## swiss/kpi · kpi

数据大字。整行标题 → 黑色细线 → 三栏巨数字（Inter 极细，第一个用 `sw-ac` 上蓝）→ 标签与一行说明。三个数都必须真实，页脚 `data-source` 写出处；说明每条 ≤22 字，保持一行。

```html
<section class="slide" data-layout="swiss/kpi" data-role="kpi">
  <p class="sw-mono sw-folio">03 — QUALITY GATES</p>
  <p class="sw-mono sw-pageno">10 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">导出之前，先过十六道检查。</h2>
  <div class="sw-rule swk-rule" data-shape="rect" data-anim="draw"></div>
  <p class="sw-num sw-ac swk-num swk-n1" data-anim="count">16</p>
  <p class="sw-num swk-num swk-n2" data-anim="count">20</p>
  <p class="sw-num swk-num swk-n3" data-anim="count">3</p>
  <h3 class="sw-h swk-label swk-c1" data-merge="c1" data-anim="rise">条校验规则</h3>
  <p class="sw-body swk-sub swk-c1" data-merge="c1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <h3 class="sw-h swk-label swk-c2" data-merge="c2" data-anim="rise">页面角色</h3>
  <p class="sw-body swk-sub swk-c2" data-merge="c2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <h3 class="sw-h swk-label swk-c3" data-merge="c3" data-anim="rise">导出格式</h3>
  <p class="sw-body swk-sub swk-c3" data-merge="c3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot" data-source>SOURCE — scripts/validate.mjs · scripts/lib/roles.mjs</p>
</section>
```

## swiss/process · process

流程四步。整行标题 → 四个等宽色块（前三块灰、最后一块蓝）→ 块内巨数字编号、步骤名、两行以内说明。步骤名 ≤4 字，说明 ≤28 字。

```html
<section class="slide" data-layout="swiss/process" data-role="process">
  <p class="sw-mono sw-folio">04 — WORKFLOW</p>
  <p class="sw-mono sw-pageno">13 / 17</p>
  <h2 class="sw-title sw-head" data-anim="rise">从大纲到成稿，四步</h2>
  <div class="sw-grey swp-block swp-b1" data-shape="rect" data-anim="rise"></div>
  <div class="sw-grey swp-block swp-b2" data-shape="rect" data-anim="rise"></div>
  <div class="sw-grey swp-block swp-b3" data-shape="rect" data-anim="rise"></div>
  <div class="sw-accent swp-block swp-b4" data-shape="rect" data-anim="rise"></div>
  <p class="sw-num swp-num swp-c1" data-merge="s1" data-anim="rise">01</p>
  <h3 class="sw-h swp-h swp-c1" data-merge="s1" data-anim="rise">选风格</h3>
  <p class="sw-body swp-p swp-c1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="sw-num swp-num swp-c2" data-merge="s2" data-anim="rise">02</p>
  <h3 class="sw-h swp-h swp-c2" data-merge="s2" data-anim="rise">填版式</h3>
  <p class="sw-body swp-p swp-c2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="sw-num swp-num swp-c3" data-merge="s3" data-anim="rise">03</p>
  <h3 class="sw-h swp-h swp-c3" data-merge="s3" data-anim="rise">过校验</h3>
  <p class="sw-body swp-p swp-c3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="sw-num sw-on swp-num swp-c4" data-merge="s4" data-anim="rise">04</p>
  <h3 class="sw-h sw-on swp-h swp-c4" data-merge="s4" data-anim="rise">导出</h3>
  <p class="sw-body sw-on2 swp-p swp-c4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">ZIFEIYU PPT SKILL · STYLE B — SWISS</p>
</section>
```
