# 瑞士 · 网格（swiss）版式注册表

> 状态：draft · P1 重做中，已有 17 个版式；其余核心角色未完成前，交付请用其他风格。

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

## swiss/matrix · matrix

盘点 + 总数。左：整行标题下的巨数字总数、标签与两行分组说明；右：4 × 3 灰格「字母 / 名称」（列 456 / 652 / 848 / 1044，行 216 / 352 / 488），当前项整格上蓝。8–12 项，名称 ≤7 字。

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
```

## swiss/compare · compare

二元对比。整行标题，左灰右蓝两块半宽色块，各含「等宽标签 / 小标题 / 两行说明 / 巨数字 + 一句数字说明」。数字必须真实；结论一侧放蓝块。

```html
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
```

## swiss/image-text · image-text

图文。左图（564×512，第 0–5 栏），右栏（第 7–11 栏）两行标题、两段正文（每段 ≤50 字）、黑细线与等宽注脚；页脚写图注。

```html
<section class="slide" data-layout="swiss/image-text" data-role="image-text">
  <p class="sw-mono sw-folio">02 — MEASURED EXPORT</p>
  <p class="sw-mono sw-pageno">07 / 17</p>
  <img class="sw-photo swi-img" src="assets/img/07-feature.jpg" alt="示意图：灰白立板之间的一块克莱因蓝">
  <h2 class="sw-title swi-title swi-t1" data-merge="title" data-anim="rise">所见即所得，</h2>
  <h2 class="sw-title swi-title swi-t2" data-merge="title" data-anim="rise">靠的是测量。</h2>
  <p class="swi-p swi-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="swi-p swi-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="sw-rule swi-rule" data-shape="rect" data-anim="draw"></div>
  <p class="sw-mono swi-note swi-n1" data-merge="note">PRIMITIVES — ROUNDRECT · LINE · CHEVRON</p>
  <p class="sw-mono swi-note swi-n2" data-merge="note">ROTATE · SHADOW · EAVERT</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">FIG. 02 — 示意图</p>
</section>
```

## swiss/image · image

满版照片 + 左下克莱因蓝色块：块内一句标题、一句说明、等宽图注。照片右上要浅，页码压在那里。

```html
<section class="slide" data-layout="swiss/image" data-role="image">
  <img class="sw-photo swf-img" src="assets/img/08-image.jpg" alt="示意图：灰白立板构成的空间">
  <div class="sw-accent swf-panel" data-shape="rect"></div>
  <h2 class="sw-title sw-on swf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="sw-lede sw-on swf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="sw-mono sw-on2 swf-cap">FIG. 03 — 示意图</p>
  <p class="sw-mono sw-pageno">08 / 17</p>
</section>
```

## swiss/points · points

三个并列要点（第 0 / 4 / 8 栏起，各宽 368）：顶部粗条（前两条黑、第三条蓝）→ 等宽编号 → 小标题 → 两行说明 → 下方一张图。三张图一个图注写在页脚；说明 ≤28 字；配图不要再带蓝。

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

## swiss/bars · bars

条形对比（3–6 行，行距 64）。条从 260 起，条长 = 数值 × 160px（最大值 4 时满长 640；最大值不同就按 640 ÷ 最大值换算单位长度），数值紧跟条尾 16px，等宽注释再后 64px；只有一根条用 `sw-accent`，其余 `sw-ink`。页脚 `data-source` 必填。

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
```

## swiss/table · table

规格表（4–6 行，行距 62）。等宽表头 + 黑细线，每行「项目 / 规格 / 出处」（第 0 / 2 / 8 栏起），行间细线；全表只用一个 `is-accent` 词。规格 ≤30 字。页脚 `data-source` 必填。

```html
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

## swiss/timeline · timeline

时间线（4–5 个节点，5 等分列，列距 230）。两行标题（`sw-head` + `sw-head2`），极细日期在黑细线上方，线上方块刻度（最新节点 `is-on` 上蓝），线下「节点名 / 两行说明」。说明 ≤18 字。

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
```

## swiss/cycle · cycle

闭环墨页（有回路才用）。左：描边圆环 + N/E/S/W 四个方块节点（起点上蓝）、等宽编号、环心巨数字；右：四行「编号 / 步骤名」+ 一句回到起点。步骤名 ≤5 字。

```html
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
```

## swiss/system · system

层级嵌套。左：三层嵌套方块（外灰、中深灰、内蓝），各带等宽层名；右：三行「等宽层级标签 / 名称 / 一行说明」。

```html
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
  <div class="sw-hair swz-hair" data-shape="rect" style="top: 328px;"></div>
  <p class="sw-mono swz-tag" style="top: 340px;" data-merge="r2" data-anim="rise">MIDDLE — 中层</p>
  <h3 class="sw-h swz-h" style="top: 372px;" data-merge="r2" data-anim="rise">style.css</h3>
  <p class="sw-body swz-p" style="top: 416px;" data-merge="r2" data-anim="rise">风格的 token、字体与全部版式</p>
  <div class="sw-hair swz-hair" data-shape="rect" style="top: 452px;"></div>
  <p class="sw-mono swz-tag" style="top: 464px;" data-merge="r3" data-anim="rise">INNER — 内层</p>
  <h3 class="sw-h swz-h" style="top: 496px;" data-merge="r3" data-anim="rise">brand.css</h3>
  <p class="sw-body swz-p" style="top: 540px;" data-merge="r3" data-anim="rise">只改 token 的品牌色</p>
  <div class="sw-hair sw-foot-rule" data-shape="rect"></div>
  <p class="sw-mono sw-foot">SOURCE — 风格库 spec §3.1</p>
</section>
```

## swiss/closing · closing

结尾，与封面镜像：左 512px 照片（深色图注），右 768px 克莱因蓝色块：两行极细巨字、等宽命令、一句说明、方块刻度（最后一格 `is-on`）。

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
