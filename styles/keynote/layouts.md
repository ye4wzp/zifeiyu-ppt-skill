# 发布会 · 暗场（keynote）版式注册表

> 状态：draft · P2 样张阶段，已有 cover / kpi / process；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media / data-raster` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/keynote/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **一页一个重点**：近黑底，大字居中。内容页用共用页头：`kn-semi kn-title`（top 72，56px 居中，≤18 字）+ `kn-sub`（top 156，22px 灰字，一行拉丁副题）；内容区 236–624。封面与满版照片页的文字放左下（left 80），压在 `kn-fade` 上。
2. **暖黄全页最多一处**：一个 `kn-kick` 小标签、一个 `kn-ac` 数字 / 词、一个 `is-accent` 片段，或一块 `kn-acbg` 填充（黄卡片 = `kn-card kn-acbg`，上面的字用 `kn-on`），四选一；其余只用白与灰。
3. **页脚**：top 672，左「来源：……」灰字（`kn-note kn-source`，数据页加 `data-source`），右页码（`kn-note kn-pageno`，只写数字）；满版照片页的图注用 `kn-note kn-capl`（left 80）；封面与结尾不放页码。
4. **深色圆角卡片**：`kn-card`（#1c1c1e、圆角 24），导出为 PowerPoint 原生圆角矩形；卡片里放照片时，`<img>` 用同一组类得到同尺寸同圆角，再盖一块同尺寸的 `kn-scrim`。
5. **照片上的渐变压暗**：`kn-fade` 必须带 `data-raster`——PowerPoint 画不出这种渐变，导出时单独截成带透明度的图片，文字仍是原生文本框。
6. **字体分工**：标题、标签用思源黑 600（`kn-semi` / `kn-kick`，Office 里是微软雅黑）；数字用 Inter 600（`kn-num`，Office 里是 Segoe UI）；正文与说明走系统字体（`kn-body` / `kn-note`）。
7. **配图**：金样配图由 `scripts/gen-art.mjs` 用暗调配色生成（`--palette "#3a3836,#232224,#ffc21a,#0a0a0b"`），alt 与页脚都写「示意图」。
8. **黄页**：`slide is-accent` 整页暖黄、黑字，只给 statement；这一页本身就是那一处暖黄。

## keynote/cover · cover

封面。满版照片 + 全幅渐变压暗（`kn-fade` + `data-raster`）；左下暖黄小标签 → 两行 100px 标题（每行一个 h1，每行 ≤6 字）→ 一行说明。

```html
<section class="slide" data-layout="keynote/cover" data-role="cover">
  <img class="kn-photo knc-img" src="assets/img/01-cover.jpg" alt="示意图：暗色远山与低悬的太阳">
  <div class="kn-fade knc-fade" data-shape="rect" data-raster></div>
  <p class="kn-kick knc-kick" data-anim="rise">网页 PPT · 可编辑导出</p>
  <h1 class="kn-semi knc-title knc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="kn-semi knc-title knc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <p class="kn-on2 knc-sub" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
</section>
```

## keynote/agenda · agenda

目录。共用页头「目录」+ 副题 → 4 行（行高 92px，880px 版心居中）：Inter 编号、粗体条目、灰色一句说明，每行下一条细线；第一个编号用暖黄。条目 ≤6 字，说明 ≤16 字。

```html
<section class="slide" data-layout="keynote/agenda" data-role="agenda">
  <h2 class="kn-semi kn-title" data-anim="rise">目录</h2>
  <p class="kn-sub" data-anim="rise">Contents.</p>
  <p class="kn-num kn-ac kna-num" style="top: 258px;" data-anim="rise">01</p>
  <h3 class="kn-semi kna-h" style="top: 258px;" data-anim="rise">风格库</h3>
  <p class="kna-p" style="top: 266px;" data-anim="rise">十二种风格，开场先挑一种</p>
  <div class="kn-hair kna-hair" data-shape="rect" style="top: 328px;"></div>
  <p class="kn-num kn-grey kna-num" style="top: 350px;" data-anim="rise">02</p>
  <h3 class="kn-semi kna-h" style="top: 350px;" data-anim="rise">测量与导出</h3>
  <p class="kna-p" style="top: 358px;" data-anim="rise">先量后画，文字始终可编辑</p>
  <div class="kn-hair kna-hair" data-shape="rect" style="top: 420px;"></div>
  <p class="kn-num kn-grey kna-num" style="top: 442px;" data-anim="rise">03</p>
  <h3 class="kn-semi kna-h" style="top: 442px;" data-anim="rise">质量门</h3>
  <p class="kna-p" style="top: 450px;" data-anim="rise">十六条规则，错误清零才交付</p>
  <div class="kn-hair kna-hair" data-shape="rect" style="top: 512px;"></div>
  <p class="kn-num kn-grey kna-num" style="top: 534px;" data-anim="rise">04</p>
  <h3 class="kn-semi kna-h" style="top: 534px;" data-anim="rise">工作流</h3>
  <p class="kna-p" style="top: 542px;" data-anim="rise">从大纲到成稿的四步</p>
  <div class="kn-hair kna-hair" data-shape="rect" style="top: 604px;"></div>
  <p class="kn-note kn-pageno">2</p>
</section>
```

## keynote/statement · statement

金句黄页。整页暖黄（`slide is-accent`），两行 72px 粗体引文居中（每行一个 h2，每行 ≤12 字）→ 出处；只有页码。

```html
<section class="slide is-accent" data-layout="keynote/statement" data-role="statement">
  <h2 class="kn-semi knq-line knq-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="kn-semi knq-line knq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <p class="knq-by">— SKILL.md · 设计原则</p>
  <p class="kn-note kn-pageno">3</p>
</section>
```

## keynote/section · section

章节页。满版照片 + 渐变压暗（`kn-fade` + `data-raster`）；左下暖黄 160px 章节号 → 64px 章节名 → 一行拉丁副题；左下图注「第 N 部分 · 图为示意图」与页码。

```html
<section class="slide" data-layout="keynote/section" data-role="section">
  <img class="kn-photo knx-img" src="assets/img/04-section.jpg" alt="示意图：暗色远山与低悬的太阳">
  <div class="kn-fade knx-fade" data-shape="rect" data-raster></div>
  <p class="kn-num kn-ac knx-num" data-anim="rise">01</p>
  <h2 class="kn-semi knx-title" data-anim="rise">风格库</h2>
  <p class="kn-on2 knx-sub" data-anim="rise">Twelve ways to set a page.</p>
  <p class="kn-note kn-capl">第 1 部分 · 图为示意图</p>
  <p class="kn-note kn-pageno">4</p>
</section>
```

## keynote/matrix · matrix

矩阵盘点（8–12 项，名称 ≤7 字）。共用页头，副题写总数与分组 → 12 张 276×116 深色圆角卡片（列 left 64 / 356 / 648 / 940，行 top 236 / 368 / 500）：灰色 Inter 字母 + 粗体名称；当前项那张是黄卡片（`kn-card kn-acbg`，字用 `kn-on`）。

```html
<section class="slide" data-layout="keynote/matrix" data-role="matrix">
  <h2 class="kn-semi kn-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <p class="kn-sub" data-anim="rise">12 种风格 · 分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="kn-card knm-card" data-shape="rect" style="left: 64px; top: 236px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 356px; top: 236px;"></div>
  <div class="kn-card kn-acbg knm-card" data-shape="rect" style="left: 648px; top: 236px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 940px; top: 236px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 64px; top: 368px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 356px; top: 368px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 648px; top: 368px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 940px; top: 368px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 64px; top: 500px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 356px; top: 500px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 648px; top: 500px;"></div>
  <div class="kn-card knm-card" data-shape="rect" style="left: 940px; top: 500px;"></div>
  <p class="kn-num kn-grey knm-key" style="left: 88px; top: 260px;">A</p>
  <p class="kn-semi knm-name" style="left: 88px; top: 300px;">杂志 · 暖纸</p>
  <p class="kn-num kn-grey knm-key" style="left: 380px; top: 260px;">B</p>
  <p class="kn-semi knm-name" style="left: 380px; top: 300px;">瑞士 · 网格</p>
  <p class="kn-num kn-on knm-key" style="left: 672px; top: 260px;">C</p>
  <p class="kn-semi kn-on knm-name" style="left: 672px; top: 300px;">发布会 · 暗场</p>
  <p class="kn-num kn-grey knm-key" style="left: 964px; top: 260px;">D</p>
  <p class="kn-semi knm-name" style="left: 964px; top: 300px;">报刊 · 版面</p>
  <p class="kn-num kn-grey knm-key" style="left: 88px; top: 392px;">E</p>
  <p class="kn-semi knm-name" style="left: 88px; top: 432px;">大字报 · 粗野</p>
  <p class="kn-num kn-grey knm-key" style="left: 380px; top: 392px;">F</p>
  <p class="kn-semi knm-name" style="left: 380px; top: 432px;">柔和 · 产品</p>
  <p class="kn-num kn-grey knm-key" style="left: 672px; top: 392px;">G</p>
  <p class="kn-semi knm-name" style="left: 672px; top: 432px;">摄影集 · 画册</p>
  <p class="kn-num kn-grey knm-key" style="left: 964px; top: 392px;">H</p>
  <p class="kn-semi knm-name" style="left: 964px; top: 432px;">咨询 · 白皮书</p>
  <p class="kn-num kn-grey knm-key" style="left: 88px; top: 524px;">I</p>
  <p class="kn-semi knm-name" style="left: 88px; top: 564px;">日式 · 极简</p>
  <p class="kn-num kn-grey knm-key" style="left: 380px; top: 524px;">J</p>
  <p class="kn-semi knm-name" style="left: 380px; top: 564px;">拼贴 · 手账</p>
  <p class="kn-num kn-grey knm-key" style="left: 672px; top: 524px;">K</p>
  <p class="kn-semi knm-name" style="left: 672px; top: 564px;">新中式 · 东方</p>
  <p class="kn-num kn-grey knm-key" style="left: 964px; top: 524px;">L</p>
  <p class="kn-semi knm-name" style="left: 964px; top: 564px;">工程制图</p>
  <p class="kn-note kn-source">来源：风格库 spec §2</p>
  <p class="kn-note kn-pageno">5</p>
</section>
```

## keynote/compare · compare

对比。共用页头 → 左右两张 568×388 深色圆角卡片：灰色小标签「之前 / 现在」→ 粗体小标题（≤14 字）→ 两行以内说明（≤70 字）→ 96px 大数字 + 一句单位（≤12 字）；右边的数字是全页唯一的暖黄。

```html
<section class="slide" data-layout="keynote/compare" data-role="compare">
  <h2 class="kn-semi kn-title" data-anim="rise">换皮，不如换版面。</h2>
  <p class="kn-sub" data-anim="rise">Same content, new pages.</p>
  <div class="kn-card knv-card knv-l" data-shape="rect" data-anim="rise"></div>
  <div class="kn-card knv-card knv-r" data-shape="rect" data-anim="rise"></div>
  <p class="kn-semi knv-label knv-tl">之前</p>
  <h3 class="kn-semi knv-h knv-tl" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="kn-body knv-p knv-tl" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <p class="kn-num knv-num knv-tl" data-anim="count">24</p>
  <p class="kn-grey knv-unit knv-ul" data-anim="rise">个版式，三套系统共用</p>
  <p class="kn-semi knv-label knv-tr">现在</p>
  <h3 class="kn-semi knv-h knv-tr" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="kn-body knv-p knv-tr" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <p class="kn-num kn-ac knv-num knv-tr" data-anim="count">12</p>
  <p class="kn-grey knv-unit knv-ur" data-anim="rise">种风格，各有一套版式</p>
  <p class="kn-note kn-source">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="kn-note kn-pageno">6</p>
</section>
```

## keynote/image-text · image-text

图文。左半版满高照片；右栏暖黄小标签 → 两行 56px 标题（每行一个 h2）→ 两段正文（每段 ≤50 字）→ 细线 → 一行灰色注记；页脚「图为示意图」在右栏。

```html
<section class="slide" data-layout="keynote/image-text" data-role="image-text">
  <img class="kn-photo kni-img" src="assets/img/07-feature.jpg" alt="示意图：暗墙上的一束窗光">
  <p class="kn-kick kni-kick" data-anim="rise">测量与导出</p>
  <h2 class="kn-semi kni-title kni-t1" data-merge="title" data-anim="rise">所见即所得，</h2>
  <h2 class="kn-semi kni-title kni-t2" data-merge="title" data-anim="rise">靠的是测量。</h2>
  <p class="kn-body kni-p kni-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="kn-body kni-p kni-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="kn-hair kni-hair" data-shape="rect" data-anim="draw"></div>
  <p class="kn-note kni-note">导出原语：圆角矩形 · 直线 · 燕尾 · 旋转 · 阴影 · 竖排</p>
  <p class="kn-note kni-cap">图为示意图</p>
  <p class="kn-note kn-pageno">7</p>
</section>
```

## keynote/image · image

大图。满版照片 + 渐变压暗；左下暖黄小标签 → 56px 标题 → 一行说明；左下图注与页码。

```html
<section class="slide" data-layout="keynote/image" data-role="image">
  <img class="kn-photo knf-img" src="assets/img/08-image.jpg" alt="示意图：暗场里的暖色光晕">
  <div class="kn-fade knf-fade" data-shape="rect" data-raster></div>
  <p class="kn-kick knf-kick" data-anim="rise">第 1 步</p>
  <h2 class="kn-semi knf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="kn-on2 knf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="kn-note kn-capl">图为示意图</p>
  <p class="kn-note kn-pageno">8</p>
</section>
```

## keynote/points · points

三点并列。共用页头 → 三列（left 64 / 448 / 832，列宽 352）：352×176 圆角照片 → Inter 编号 + 粗体小标题（≤8 字）→ 一句说明（≤30 字）；第三个编号是全页唯一的暖黄。

```html
<section class="slide" data-layout="keynote/points" data-role="points">
  <h2 class="kn-semi kn-title" data-anim="rise">三件事，件件可验证。</h2>
  <p class="kn-sub" data-anim="rise">Three promises, all checkable.</p>
  <img class="kn-photo kn-card knt-img knt-c1" src="assets/img/09-points-1.jpg" alt="示意图：暗色远山与低悬的太阳">
  <img class="kn-photo kn-card knt-img knt-c2" src="assets/img/09-points-2.jpg" alt="示意图：暗色立板与一块暖黄">
  <img class="kn-photo kn-card knt-img knt-c3" src="assets/img/09-points-3.jpg" alt="示意图：暗墙上的一束窗光">
  <p class="kn-num kn-grey knt-num knt-c1" data-anim="rise">01</p>
  <h3 class="kn-semi knt-h knt-h1" data-anim="rise">浏览器里演示</h3>
  <p class="kn-body knt-p knt-c1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <p class="kn-num kn-grey knt-num knt-c2" data-anim="rise">02</p>
  <h3 class="kn-semi knt-h knt-h2" data-anim="rise">可编辑的 PPTX</h3>
  <p class="kn-body knt-p knt-c2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <p class="kn-num kn-ac knt-num knt-c3" data-anim="rise">03</p>
  <h3 class="kn-semi knt-h knt-h3" data-anim="rise">机器先把关</h3>
  <p class="kn-body knt-p knt-c3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <p class="kn-note kn-source">来源：SKILL.md 第 6、8 步 · 图为示意图</p>
  <p class="kn-note kn-pageno">9</p>
</section>
```

## keynote/kpi · kpi

数据页，一个数撑满一页。暖黄小标题居中 → 288px 巨大数字 → 粗体标签 + 一句说明 → 短细线 → 并排两个辅助数字与标签 → 页脚出处（`data-source`）与页码。三个数都必须真实；巨大数字 ≤3 位。

```html
<section class="slide" data-layout="keynote/kpi" data-role="kpi">
  <p class="kn-kick knk-kick" data-anim="rise">导出之前，先过十六道检查</p>
  <p class="kn-num knk-hero" data-anim="count">16</p>
  <h2 class="kn-semi knk-label" data-merge="hero" data-anim="rise">条校验规则</h2>
  <p class="kn-body knk-desc" data-merge="hero" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <div class="kn-hair knk-hair" data-shape="rect" data-anim="draw"></div>
  <p class="kn-num knk-num knk-c1" data-anim="count">20</p>
  <p class="kn-note knk-sub knk-c1">页面角色</p>
  <p class="kn-num knk-num knk-c2" data-anim="count">3</p>
  <p class="kn-note knk-sub knk-c2">导出格式</p>
  <p class="kn-note kn-source" data-source>来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="kn-note kn-pageno">10</p>
</section>
```

## keynote/bars · bars

条形对比（3–6 行，行距 64px）。共用页头 → 每行「粗体标签（右对齐，≤6 字）/ 白色圆角条 / Inter 数值 / 灰色规则号」；条从 left 424 起，条长 = 数值 × 单位长，单位长 = 480 ÷ 最大值（金样最大值 4 → 120px）；数值 left = 424 + 条长 + 16，注释 left = 数值 left + 48。要强调的一条用暖黄（`kn-acbg`）。来源写 `data-source`；`--native-charts` 时整组换成 PowerPoint 原生条形图。

```html
<section class="slide" data-layout="keynote/bars" data-role="bars">
  <h2 class="kn-semi kn-title" data-anim="rise">十六条规则，各管一摊。</h2>
  <p class="kn-sub" data-anim="rise">Sixteen rules, six concerns.</p>
  <p class="kn-semi knb-label" style="top: 240px;" data-chart>排版与几何</p>
  <div class="kn-fill knb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 240px; width: 480px;"></div>
  <p class="kn-num knb-val" style="top: 240px; left: 920px;" data-chart>4</p>
  <p class="knb-ids" style="top: 242px; left: 968px;" data-chart>R3 · R4 · R7 · R9</p>
  <p class="kn-semi knb-label" style="top: 304px;" data-chart>版式与样式</p>
  <div class="kn-fill knb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 304px; width: 480px;"></div>
  <p class="kn-num knb-val" style="top: 304px; left: 920px;" data-chart>4</p>
  <p class="knb-ids" style="top: 306px; left: 968px;" data-chart>R1 · R2 · R6 · R12</p>
  <p class="kn-semi knb-label" style="top: 368px;" data-chart>内容与数据</p>
  <div class="kn-fill knb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 368px; width: 360px;"></div>
  <p class="kn-num knb-val" style="top: 368px; left: 800px;" data-chart>3</p>
  <p class="knb-ids" style="top: 370px; left: 848px;" data-chart>R5 · R8 · R14</p>
  <p class="kn-semi knb-label" style="top: 432px;" data-chart>可访问与媒体</p>
  <div class="kn-fill knb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 432px; width: 360px;"></div>
  <p class="kn-num knb-val" style="top: 432px; left: 800px;" data-chart>3</p>
  <p class="knb-ids" style="top: 434px; left: 848px;" data-chart>R10 · R11 · R13</p>
  <p class="kn-semi knb-label" style="top: 496px;" data-chart>节奏</p>
  <div class="kn-fill knb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 496px; width: 120px;"></div>
  <p class="kn-num knb-val" style="top: 496px; left: 560px;" data-chart>1</p>
  <p class="knb-ids" style="top: 498px; left: 608px;" data-chart>R15</p>
  <p class="kn-semi knb-label" style="top: 560px;" data-chart>导出一致</p>
  <div class="kn-acbg knb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 560px; width: 120px;"></div>
  <p class="kn-num knb-val" style="top: 560px; left: 560px;" data-chart>1</p>
  <p class="knb-ids" style="top: 562px; left: 608px;" data-chart>R16</p>
  <p class="kn-note kn-source" data-source>来源：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="kn-note kn-pageno">11</p>
</section>
```

## keynote/table · table

规格表（4–6 行，规格 ≤30 字）。共用页头 → 一张 1152×400 深色圆角卡片：灰色表头 项目 / 规格 / 出处 + 细线 → 每行 56px（行 n 顶 = 284 + 56n），行间细线；一处关键词用 `is-accent`。来源写 `data-source`。

```html
<section class="slide" data-layout="keynote/table" data-role="table">
  <h2 class="kn-semi kn-title" data-anim="rise">一页纸，看懂规格。</h2>
  <p class="kn-sub" data-anim="rise">The fine print.</p>
  <div class="kn-card knd-card" data-shape="rect"></div>
  <p class="kn-semi knd-head" style="left: 96px;">项目</p>
  <p class="kn-semi knd-head" style="left: 320px;">规格</p>
  <p class="kn-semi knd-head" style="left: 912px;">出处</p>
  <div class="kn-hair knd-hair" data-shape="rect" style="top: 282px;"></div>
  <p class="kn-semi knd-k" style="top: 300px;">画布</p>
  <p class="knd-v" style="top: 301px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="knd-s" style="top: 303px;">assets/base.css</p>
  <div class="kn-hair knd-hair" data-shape="rect" style="top: 340px;"></div>
  <p class="kn-semi knd-k" style="top: 356px;">字号下限</p>
  <p class="knd-v" style="top: 357px;">16 px，溢出先删字、再换版式</p>
  <p class="knd-s" style="top: 359px;">validate.mjs · R4</p>
  <div class="kn-hair knd-hair" data-shape="rect" style="top: 396px;"></div>
  <p class="kn-semi knd-k" style="top: 412px;">校验规则</p>
  <p class="knd-v" style="top: 413px;">R1–R16，<span class="is-accent">错误清零</span>才能交付</p>
  <p class="knd-s" style="top: 415px;">validate.mjs</p>
  <div class="kn-hair knd-hair" data-shape="rect" style="top: 452px;"></div>
  <p class="kn-semi knd-k" style="top: 468px;">导出格式</p>
  <p class="knd-v" style="top: 469px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="knd-s" style="top: 471px;">SKILL.md</p>
  <div class="kn-hair knd-hair" data-shape="rect" style="top: 508px;"></div>
  <p class="kn-semi knd-k" style="top: 524px;">页面角色</p>
  <p class="knd-v" style="top: 525px;">20 个，其中 12 个核心角色</p>
  <p class="knd-s" style="top: 527px;">lib/roles.mjs</p>
  <div class="kn-hair knd-hair" data-shape="rect" style="top: 564px;"></div>
  <p class="kn-semi knd-k" style="top: 580px;">字体</p>
  <p class="knd-v" style="top: 581px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="knd-s" style="top: 583px;">fetch-fonts.mjs</p>
  <p class="kn-note kn-source" data-source>来源：表内「出处」列（本仓库文件）</p>
  <p class="kn-note kn-pageno">12</p>
</section>
```

## keynote/process · process

流程页。共用页头 + 一行灰色副题 → 4 张 276×388 深色圆角卡片：左上编号、底部步骤名与说明（≤26 字）；最后一步的卡片垫一张照片（同圆角）并盖压暗层，它的编号是全页唯一的暖黄。

```html
<section class="slide" data-layout="keynote/process" data-role="process">
  <h2 class="kn-semi kn-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="kn-sub" data-anim="rise">From outline to deck.</p>
  <div class="kn-card knp-card knp-b1" data-shape="rect" data-anim="rise"></div>
  <div class="kn-card knp-card knp-b2" data-shape="rect" data-anim="rise"></div>
  <div class="kn-card knp-card knp-b3" data-shape="rect" data-anim="rise"></div>
  <img class="kn-photo kn-card knp-card knp-b4" src="assets/img/14-process.jpg" alt="示意图：暗墙上的一束窗光">
  <div class="kn-scrim knp-card knp-b4" data-shape="rect"></div>
  <p class="kn-num kn-grey knp-num knp-c1" data-merge="s1" data-anim="rise">01</p>
  <h3 class="kn-semi knp-name knp-c1" data-merge="s1" data-anim="rise">选风格</h3>
  <p class="kn-note knp-desc knp-c1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="kn-num kn-grey knp-num knp-c2" data-merge="s2" data-anim="rise">02</p>
  <h3 class="kn-semi knp-name knp-c2" data-merge="s2" data-anim="rise">填版式</h3>
  <p class="kn-note knp-desc knp-c2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="kn-num kn-grey knp-num knp-c3" data-merge="s3" data-anim="rise">03</p>
  <h3 class="kn-semi knp-name knp-c3" data-merge="s3" data-anim="rise">过校验</h3>
  <p class="kn-note knp-desc knp-c3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="kn-num kn-ac knp-num knp-c4" data-merge="s4" data-anim="rise">04</p>
  <h3 class="kn-semi knp-name knp-c4" data-merge="s4" data-anim="rise">导出</h3>
  <p class="kn-note kn-on2 knp-desc knp-c4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <p class="kn-note kn-source">来源：SKILL.md 工作流 · 图为示意图</p>
  <p class="kn-note kn-pageno">14</p>
</section>
```
