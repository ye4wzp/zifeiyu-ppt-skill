# 摄影集 · 画册（photobook）版式注册表

> 状态：draft · P1 样张阶段，已有 cover / kpi / process；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/photobook/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **照片是主角**：除 statement / table 外每页都有照片，照片面积大于文字区；文字退到图注的位置，标题一行（`pb-serif pb-title`，44px，最多 14 字），右侧可配一行拉丁斜体副题（`pb-it pb-voice`）。
2. **不用强调色**：界面只有墨色、灰与近白，颜色交给照片；不用 `is-accent` / `is-mark`。
3. **压暗条**：照片上放字时，先铺一块 `pb-scrim`（`rgba(12,11,10,.55)`，导出为原生半透明矩形），字用 `pb-on` / `pb-on2`；不在没有压暗条的照片上直接放字。
4. **页脚**：top 668 一行等宽字，左「Source — 出处 · 图为示意图」（`pb-mono pb-foot`，数据页加 `data-source`），右页码「NN / 总页数」（`pb-mono pb-pageno`）。
5. **字体分工**：标题与小标题用思源宋 Bold（`pb-serif`，Office 里是宋体）；图注、编号与数字用 Playfair 斜体（`pb-it` / `pb-num`，等高数字，Office 里是 Times New Roman）；帧号与页脚用 JetBrains Mono（`pb-mono`，Office 里是 Consolas）；正文 `pb-body` 走系统字体。
6. **配图**：金样配图由 `scripts/gen-art.mjs` 生成，冷暖两组胶片色调交替（`--palette`，见各条目），alt 与页脚都写「示意图」。
7. **暗房页**：`slide is-dark` 近黑底给 statement / video / closing；暗房页上墨色与灰色 token 反相，`pb-ink` 变成近白。

## photobook/cover · cover

封面。两行宋体标题居中（每行一个 h1）→ 一行拉丁斜体副题 → 胶片条：5 张 224×300 竖幅照片一排，每张下面一个等宽帧号 → 居中说明 → 底部一行等宽标签。照片换成自己的 5 张时保持同一高度。

```html
<section class="slide" data-layout="photobook/cover" data-role="cover">
  <h1 class="pb-serif pbc-title pbc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="pb-serif pbc-title pbc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <p class="pb-it pbc-it" data-anim="rise">One source, three deliverables.</p>
  <img class="pb-photo pbc-img pbc-c1" src="assets/img/01-cover-1.jpg" alt="示意图：窗光落在暗墙上">
  <img class="pb-photo pbc-img pbc-c2" src="assets/img/01-cover-2.jpg" alt="示意图：冷色远山与低悬的太阳">
  <img class="pb-photo pbc-img pbc-c3" src="assets/img/01-cover-3.jpg" alt="示意图：暖灰立板与一块琥珀色">
  <img class="pb-photo pbc-img pbc-c4" src="assets/img/01-cover-4.jpg" alt="示意图：冷色墙面上的窗光">
  <img class="pb-photo pbc-img pbc-c5" src="assets/img/01-cover-5.jpg" alt="示意图：暖色远山与落日">
  <p class="pb-mono pbc-fr pbc-c1">01A</p>
  <p class="pb-mono pbc-fr pbc-c2">02A</p>
  <p class="pb-mono pbc-fr pbc-c3">03A</p>
  <p class="pb-mono pbc-fr pbc-c4">04A</p>
  <p class="pb-mono pbc-fr pbc-c5">05A</p>
  <p class="pbc-sub" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <p class="pb-mono pbc-meta">网页 PPT · 可编辑导出 · 图均为示意图</p>
</section>
```

## photobook/agenda · agenda

目录。一行标题「目录」+ 斜体副题 → 左 512×492 照片；右侧 4 行「斜体编号 / 宋体条目 + 一句说明 / 等宽页码」，行高 123px，每行下一条细线，最后一条与照片底边齐平。条目 ≤6 字，说明 ≤14 字。

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
```

## photobook/statement · statement

金句暗房页。两行 56px 宋体引文居中（每行一个 h2，每行 ≤12 字）→ 斜体英文一句 → 等宽出处；只有页码，不放照片。

```html
<section class="slide is-dark" data-layout="photobook/statement" data-role="statement">
  <h2 class="pb-serif pbs-line pbs-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="pb-serif pbs-line pbs-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <p class="pb-it pbs-it" data-anim="rise">One source of truth.</p>
  <p class="pb-mono pbs-by">— SKILL.md · 设计原则</p>
  <p class="pb-mono pb-pageno">03 / 18</p>
</section>
```

## photobook/section · section

章节页。满版照片，底部 264px 压暗条上：斜体大章节号 + 宋体章节名 + 斜体一句；页脚等宽「CHAPTER NN · 图为示意图」与页码也在压暗条上。

```html
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

## photobook/matrix · matrix

矩阵盘点。一行标题 + 斜体副题 → 左栏斜体大总数 + 宋体单位 + 一句分组说明；右侧 4×3 底片小样（208×112 小图 + 等宽字母 + 宋体名称），当前风格的那一格外加一圈 2px 墨线（`pbm-sel`）。小图用 416×224 的专用横幅图（复用竖幅图会被裁掉一半以上，R13 报警）。

```html
<section class="slide" data-layout="photobook/matrix" data-role="matrix">
  <h2 class="pb-serif pb-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <p class="pb-it pb-voice" data-anim="rise">A to L, on one sheet.</p>
  <p class="pb-num pbm-hero" data-anim="count">12</p>
  <h3 class="pb-serif pbm-label" data-merge="hero" data-anim="rise">种风格</h3>
  <p class="pb-body pbm-sub" data-merge="hero" data-anim="rise">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-a.jpg" alt="示意图：暖色墙面上的窗光" style="left: 336px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 336px; top: 275px;">A</p>
  <p class="pb-serif pbm-name" style="left: 368px; top: 272px;">杂志 · 暖纸</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-b.jpg" alt="示意图：冷色远山与低悬的太阳" style="left: 560px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 560px; top: 275px;">B</p>
  <p class="pb-serif pbm-name" style="left: 592px; top: 272px;">瑞士 · 网格</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-c.jpg" alt="示意图：暖灰立板" style="left: 784px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 784px; top: 275px;">C</p>
  <p class="pb-serif pbm-name" style="left: 816px; top: 272px;">发布会 · 暗场</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-d.jpg" alt="示意图：冷色墙面上的窗光" style="left: 1008px; top: 148px;">
  <p class="pb-mono pbm-key" style="left: 1008px; top: 275px;">D</p>
  <p class="pb-serif pbm-name" style="left: 1040px; top: 272px;">报刊 · 版面</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-e.jpg" alt="示意图：暖色远山与落日" style="left: 336px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 336px; top: 439px;">E</p>
  <p class="pb-serif pbm-name" style="left: 368px; top: 436px;">大字报 · 粗野</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-f.jpg" alt="示意图：冷色色场" style="left: 560px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 560px; top: 439px;">F</p>
  <p class="pb-serif pbm-name" style="left: 592px; top: 436px;">柔和 · 产品</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-g.jpg" alt="示意图：暖色墙面上的窗光" style="left: 784px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 784px; top: 439px;">G</p>
  <p class="pb-serif pbm-name" style="left: 816px; top: 436px;">摄影集 · 画册</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-h.jpg" alt="示意图：冷灰立板" style="left: 1008px; top: 312px;">
  <p class="pb-mono pbm-key" style="left: 1008px; top: 439px;">H</p>
  <p class="pb-serif pbm-name" style="left: 1040px; top: 436px;">咨询 · 白皮书</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-i.jpg" alt="示意图：暖色远山与落日" style="left: 336px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 336px; top: 603px;">I</p>
  <p class="pb-serif pbm-name" style="left: 368px; top: 600px;">日式 · 极简</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-j.jpg" alt="示意图：冷色墙面上的窗光" style="left: 560px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 560px; top: 603px;">J</p>
  <p class="pb-serif pbm-name" style="left: 592px; top: 600px;">拼贴 · 手账</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-k.jpg" alt="示意图：暖色色场" style="left: 784px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 784px; top: 603px;">K</p>
  <p class="pb-serif pbm-name" style="left: 816px; top: 600px;">新中式 · 东方</p>
  <img class="pb-photo pbm-img" src="assets/img/05-matrix-l.jpg" alt="示意图：冷色远山与落日" style="left: 1008px; top: 476px;">
  <p class="pb-mono pbm-key" style="left: 1008px; top: 603px;">L</p>
  <p class="pb-serif pbm-name" style="left: 1040px; top: 600px;">工程制图</p>
  <div class="pbm-sel" data-shape="rect" style="left: 778px; top: 306px;"></div>
  <p class="pb-mono pb-foot">Source — 风格库 spec §2 · 图为示意图</p>
  <p class="pb-mono pb-pageno">05 / 18</p>
</section>
```

## photobook/compare · compare

对比。一行标题 + 斜体副题 → 左右两张 568×260 照片 → 每侧等宽 BEFORE / AFTER、宋体小标题、两行以内说明、斜体大数字 + 一句单位。

```html
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
```

## photobook/image-text · image-text

图文。左半版满高照片出血；右栏两行宋体标题（每行一个 h2）→ 斜体副题 → 两段正文 → 细线 → 一行等宽注记；页脚「图为示意图」在右栏。每段正文 ≤50 字。

```html
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
```

## photobook/image · image

大图。照片像画册图版一样裱在页面上（四周留白），下方宋体标题、一句说明，右侧等宽「PLATE — 示意图」。

```html
<section class="slide" data-layout="photobook/image" data-role="image">
  <img class="pb-photo pbf-img" src="assets/img/08-plate.jpg" alt="示意图：冷色远山与低悬的太阳">
  <h2 class="pb-serif pbf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="pb-body pbf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="pb-mono pbf-cap">PLATE — 示意图</p>
  <p class="pb-mono pb-pageno">08 / 18</p>
</section>
```

## photobook/points · points

三点并列。左栏一行标题 → 斜体副题 → 三行「斜体 No. N / 宋体小标题 / 一行说明」，行间细线；照片从右边出血占满高（512×720）。页脚与页码收在左栏（`pbt-foot` / `pbt-pageno`）。每条说明 ≤30 字。

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

## photobook/kpi · kpi

数据页。一行标题 → 3 张 376×492 高幅照片并排，每张底部一块压暗条，条上斜体大数字 + 宋体标签 + 一句说明（≤22 字，最多两行）→ 页脚出处（`data-source`）与页码。三个数都必须真实。

```html
<section class="slide" data-layout="photobook/kpi" data-role="kpi">
  <h2 class="pb-serif pb-title" data-anim="rise">导出之前，先过十六道检查。</h2>
  <img class="pb-photo pbk-img pbk-c1" src="assets/img/10-kpi-1.jpg" alt="示意图：暖色远山">
  <img class="pb-photo pbk-img pbk-c2" src="assets/img/10-kpi-2.jpg" alt="示意图：冷色墙面上的窗光">
  <img class="pb-photo pbk-img pbk-c3" src="assets/img/10-kpi-3.jpg" alt="示意图：暖灰立板">
  <div class="pb-scrim pbk-scrim pbk-c1" data-shape="rect"></div>
  <div class="pb-scrim pbk-scrim pbk-c2" data-shape="rect"></div>
  <div class="pb-scrim pbk-scrim pbk-c3" data-shape="rect"></div>
  <p class="pb-num pb-on pbk-num pbk-i1" data-anim="count">16</p>
  <h3 class="pb-serif pb-on pbk-label pbk-i1" data-merge="c1" data-anim="rise">条校验规则</h3>
  <p class="pb-on2 pbk-desc pbk-i1" data-merge="c1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <p class="pb-num pb-on pbk-num pbk-i2" data-anim="count">20</p>
  <h3 class="pb-serif pb-on pbk-label pbk-i2" data-merge="c2" data-anim="rise">页面角色</h3>
  <p class="pb-on2 pbk-desc pbk-i2" data-merge="c2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <p class="pb-num pb-on pbk-num pbk-i3" data-anim="count">3</p>
  <h3 class="pb-serif pb-on pbk-label pbk-i3" data-merge="c3" data-anim="rise">导出格式</h3>
  <p class="pb-on2 pbk-desc pbk-i3" data-merge="c3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="pb-mono pb-foot" data-source>Source — scripts/validate.mjs · scripts/lib/roles.mjs · 图为示意图</p>
  <p class="pb-mono pb-pageno">10 / 18</p>
</section>
```

## photobook/bars · bars

条形对比。一行标题 + 斜体副题 → 左 376×492 照片；右侧 6 行「宋体标签（右对齐）/ 墨色条 / 斜体数值 / 等宽规则号」，条长每单位 72px（`data-value` × 72）。来源写 `data-source`；`--native-charts` 时整组换成 PowerPoint 原生条形图。

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
```

## photobook/table · table

规格表。一行标题 + 斜体副题 → 等宽表头 ITEM / SPEC / SOURCE + 2px 墨线 → 6 行，行高 64px、行间细线。表格页不放照片。来源写 `data-source`。

```html
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

## photobook/process · process

流程页。一行标题 + 右侧斜体副题 → 4 张 276×300 照片对应 4 步 → 每张下面斜体「No. N」+ 宋体步骤名 + 一段说明（≤26 字）→ 页脚出处与页码。

```html
<section class="slide" data-layout="photobook/process" data-role="process">
  <h2 class="pb-serif pb-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="pb-it pb-voice" data-anim="rise">from outline to deck.</p>
  <img class="pb-photo pbp-img pbp-c1" src="assets/img/13-process-1.jpg" alt="示意图：冷灰立板">
  <img class="pb-photo pbp-img pbp-c2" src="assets/img/13-process-2.jpg" alt="示意图：暖色色场">
  <img class="pb-photo pbp-img pbp-c3" src="assets/img/13-process-3.jpg" alt="示意图：冷色远山">
  <img class="pb-photo pbp-img pbp-c4" src="assets/img/13-process-4.jpg" alt="示意图：暖色墙面上的窗光">
  <p class="pb-it pbp-no pbp-c1" data-merge="s1" data-anim="rise">No. 1</p>
  <h3 class="pb-serif pbp-name pbp-c1" data-merge="s1" data-anim="rise">选风格</h3>
  <p class="pb-body pbp-desc pbp-c1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="pb-it pbp-no pbp-c2" data-merge="s2" data-anim="rise">No. 2</p>
  <h3 class="pb-serif pbp-name pbp-c2" data-merge="s2" data-anim="rise">填版式</h3>
  <p class="pb-body pbp-desc pbp-c2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="pb-it pbp-no pbp-c3" data-merge="s3" data-anim="rise">No. 3</p>
  <h3 class="pb-serif pbp-name pbp-c3" data-merge="s3" data-anim="rise">过校验</h3>
  <p class="pb-body pbp-desc pbp-c3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="pb-it pbp-no pbp-c4" data-merge="s4" data-anim="rise">No. 4</p>
  <h3 class="pb-serif pbp-name pbp-c4" data-merge="s4" data-anim="rise">导出</h3>
  <p class="pb-body pbp-desc pbp-c4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <p class="pb-mono pb-foot">Source — SKILL.md 工作流 · 图为示意图</p>
  <p class="pb-mono pb-pageno">14 / 18</p>
</section>
```
