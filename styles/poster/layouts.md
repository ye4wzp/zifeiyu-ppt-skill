# 大字报 · 粗野（poster）版式注册表

> 状态：ready · 17 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / gallery / cycle。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/poster/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **三色高冲撞**：荧光绿 `#d6ff3a`、纯黑 `#0b0b0b`、米白 `#f5f5f0` 三色切换。整页分三态：`slide is-accent`（整页荧光绿，用于 cover / statement / section）、默认米白底（常规内容页）、`slide is-dark`（整页纯黑，用于 image / kpi / cycle / closing）。
2. **严格对比度（R11）**：米白底（`#f5f5f0`）与浅石底（`#e8e8e0`）上**绝不用荧光绿字**——荧光绿只作整块底色（压黑字 `ps-ink` / `ps-on`）或在纯黑底（`#0b0b0b`）上作文字与强调条（`ps-ac` / `ps-acbar`）。
3. **全直角 + 硬阴影色块**：所有色块与边框均为 0px 直角，线条用 3px 实心黑条（`ps-rule`）；照片与强调卡片统一在背后垫一块偏移 `+12px`–`+16px` 的纯黑（米白/荧光绿页）或荧光绿（黑页）实色矩形（`data-shape="rect"`），100% 导出为 PowerPoint 原生矩形 + 原生图片。
4. **粗黑巨字负字距**：标题用思源黑 700 配合 `-0.04em` 紧字距（`ps-heavy`），大数字用 Inter 700 配合 `-0.05em`（`ps-bold`），眉批、编号、出处与页码用 JetBrains Mono 16px（`ps-mono`，不低于 R4 下限）。
5. **整行荧光绿强调**：agenda 第一项与 process 最后一步均用满宽 1280px 荧光绿横带（`ps-lime`）高亮，文字加粗压纯黑；table 行内关键词用 `<span class="is-mark">` 荧光绿高亮。
6. **页眉与页脚**：常规页顶部 `top 40` 左栏目等宽标（`ps-top-l`）+ 右期号标（`ps-top-r`）；底部 `top 664` 左出处（`ps-source`，数据页带 `data-source`）+ 右页码（`ps-pageno`）。封面与结尾用底边 96px 满宽撞色底带（黑底绿字 / 绿底黑字），不放页码。
7. **配图**：金样配图由 `scripts/gen-art.mjs --style poster --format jpg` 按 `:root` 色板确定性生成，尺寸严格匹配槽位纵横比；alt 与页脚均注明「示意图」。
8. **文本合并与导出一致（R16）**：`data-merge` 只合并同一 `left`、上下排列的文字槽位；文字标签不带背景、描边、阴影与内边距，底色和徽章一律用背后的 `[data-shape="rect"]` 承担。

## poster/cover · cover

封面。整页荧光绿（`slide is-accent`）；顶部等宽标 → 左侧两行 124px 紧字距巨字标题（每行 ≤6 字）+ 黑粗横杠 + 说明 → 右侧带 `+16px` 纯黑硬阴影的照片 → 底部 96px 满宽纯黑底带配荧光绿等宽跑马字。

```html
<section class="slide is-accent" data-layout="poster/cover" data-role="cover">
  <p class="ps-mono psc-top-l" data-anim="rise">网页 PPT · 可编辑导出</p>
  <p class="ps-mono psc-top-r">STYLE E / 2026</p>
  <h1 class="ps-heavy psc-title psc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="ps-heavy psc-title psc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <div class="ps-blk psc-rule" data-shape="rect" data-anim="draw"></div>
  <p class="psc-sub" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="ps-blk psc-shd" data-shape="rect"></div>
  <img class="ps-photo psc-img" src="assets/img/01-cover.jpg" alt="示意图：暗墙上的荧光绿九格窗光">
  <div class="ps-blk psc-band" data-shape="rect"></div>
  <p class="ps-mono psc-tick-l">HTML SINGLE SOURCE · PPTX / PDF / PNG</p>
  <p class="ps-mono psc-tick-r">大字报 · 粗野 · 图为示意图</p>
</section>
```

## poster/agenda · agenda

目录。左 84px 巨字「目录」+ 右等宽副标 → 4 行 3px 黑线分隔的粗体清单（首行压满宽 1280px 荧光绿高亮带）：Inter 编号 / 42px 粗黑条目 / 正文说明 / 右侧等宽页标。条目 ≤6 字，说明 ≤16 字。

```html
<section class="slide" data-layout="poster/agenda" data-role="agenda">
  <p class="ps-mono ps-top-l">CONTENTS / 目录</p>
  <p class="ps-mono ps-top-r">STYLE E · 02</p>
  <h2 class="ps-heavy psa-title" data-anim="rise">目录</h2>
  <p class="ps-mono psa-sub">FOUR CHAPTERS · 一份源文件，三种交付</p>
  <div class="ps-lime psa-strip" data-shape="rect"></div>
  <div class="ps-rule psa-full-rule" data-shape="rect" style="top: 204px;"></div>
  <p class="ps-bold psa-num" style="top: 226px;" data-anim="rise">01</p>
  <h3 class="ps-heavy psa-item" style="top: 230px;" data-anim="rise">风格库</h3>
  <p class="ps-body ps-strong psa-desc" style="top: 240px;" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="ps-mono psa-pg" style="top: 244px;">P.04</p>
  <div class="ps-rule psa-full-rule" data-shape="rect" style="top: 304px;"></div>
  <p class="ps-bold psa-num" style="top: 326px;" data-anim="rise">02</p>
  <h3 class="ps-heavy psa-item" style="top: 330px;" data-anim="rise">测量与导出</h3>
  <p class="ps-body psa-desc" style="top: 340px;" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="ps-mono psa-pg" style="top: 344px;">P.07</p>
  <div class="ps-rule psa-rule" data-shape="rect" style="top: 406px;"></div>
  <p class="ps-bold psa-num" style="top: 428px;" data-anim="rise">03</p>
  <h3 class="ps-heavy psa-item" style="top: 432px;" data-anim="rise">质量门</h3>
  <p class="ps-body psa-desc" style="top: 442px;" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="ps-mono psa-pg" style="top: 446px;">P.10</p>
  <div class="ps-rule psa-rule" data-shape="rect" style="top: 508px;"></div>
  <p class="ps-bold psa-num" style="top: 530px;" data-anim="rise">04</p>
  <h3 class="ps-heavy psa-item" style="top: 534px;" data-anim="rise">工作流</h3>
  <p class="ps-body psa-desc" style="top: 544px;" data-anim="rise">从大纲到成稿的四步</p>
  <p class="ps-mono psa-pg" style="top: 548px;">P.13</p>
  <div class="ps-rule psa-rule" data-shape="rect" style="top: 610px;"></div>
  <p class="ps-mono ps-source">大字报 · 粗野 — 演示目录</p>
  <p class="ps-mono ps-pageno">2</p>
</section>
```

## poster/statement · statement

金句大字报。整页荧光绿（`slide is-accent`）；上下两道粗黑横杠框住两行 108px 巨字宣言（每行 ≤10 字），下方纯黑徽章块压荧光绿等宽出处。

```html
<section class="slide is-accent" data-layout="poster/statement" data-role="statement">
  <p class="ps-mono ps-ink ps-top-l">PRINCIPLE / 设计原则</p>
  <p class="ps-mono ps-ink ps-top-r">STYLE E · 03</p>
  <div class="ps-blk psq-bar-t" data-shape="rect" data-anim="draw"></div>
  <h2 class="ps-heavy psq-line psq-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="ps-heavy psq-line psq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <div class="ps-blk psq-badge" data-shape="rect" data-anim="rise"></div>
  <p class="ps-mono psq-by">— SKILL.md · 设计原则</p>
  <div class="ps-blk psq-bar-b" data-shape="rect" data-anim="draw"></div>
  <p class="ps-mono ps-ink ps-source">SINGLE SOURCE OF TRUTH</p>
  <p class="ps-mono ps-pageno">3</p>
</section>
```

## poster/section · section

章节页。整页荧光绿（`slide is-accent`）；左侧 320px 纯黑超大章节号 + 粗黑底杠；右侧高耸纯黑矩形碑体压 96px 荧光绿章节名（≤6 字）、荧光绿横杠与米白导语。

```html
<section class="slide is-accent" data-layout="poster/section" data-role="section">
  <p class="ps-mono ps-ink ps-top-l">SECTION / 章节分隔</p>
  <p class="ps-mono ps-ink ps-top-r">PART 01</p>
  <p class="ps-bold psx-num" data-anim="rise">01</p>
  <div class="ps-blk psx-rule" data-shape="rect" data-anim="draw"></div>
  <div class="ps-blk psx-panel" data-shape="rect"></div>
  <p class="ps-mono psx-tag" data-anim="rise">CHAPTER 01</p>
  <h2 class="ps-heavy psx-title" data-anim="rise">风格库</h2>
  <div class="psx-acbar" data-shape="rect" data-anim="draw"></div>
  <p class="psx-desc" data-anim="rise">十二种风格，按场合挑一种。每种风格独立版式，按角色登记。</p>
  <p class="ps-mono psx-meta">TWELVE STYLES · FIVE GROUPS</p>
  <p class="ps-mono ps-ink ps-source">第 1 部分 · 风格库</p>
  <p class="ps-mono ps-pageno">4</p>
</section>
```

## poster/matrix · matrix

矩阵盘点（8–12 项，名称 ≤7 字）。左栏两行 52px 标题 + 184px 总数与分组说明；右栏 3×4 粗黑框卡片（left 448 / 710 / 972，top 96 / 230 / 364 / 498），当前项（E）用荧光绿粗框卡片 + 硬黑阴影高亮。

```html
<section class="slide" data-layout="poster/matrix" data-role="matrix">
  <p class="ps-mono ps-top-l">01 / 风格库 · STYLE MATRIX</p>
  <p class="ps-mono ps-top-r">STYLE E · 05</p>
  <h2 class="ps-heavy psm-t1" data-merge="title" data-anim="rise">十二种风格，</h2>
  <h2 class="ps-heavy psm-t2" data-merge="title" data-anim="rise">按场合挑一种。</h2>
  <p class="ps-bold psm-hero" data-anim="count">12</p>
  <div class="ps-blk psm-rule" data-shape="rect" data-anim="draw"></div>
  <h3 class="ps-heavy psm-label" data-merge="hero" data-anim="rise">种风格 · 分五组</h3>
  <p class="psm-sub" data-merge="hero" data-anim="rise">编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 448px; top: 96px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 710px; top: 96px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 972px; top: 96px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 448px; top: 230px;"></div>
  <div class="ps-blk psm-shd" data-shape="rect"></div>
  <div class="ps-lime-box psm-card" data-shape="rect" style="left: 710px; top: 230px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 972px; top: 230px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 448px; top: 364px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 710px; top: 364px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 972px; top: 364px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 448px; top: 498px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 710px; top: 498px;"></div>
  <div class="ps-paper psm-card" data-shape="rect" style="left: 972px; top: 498px;"></div>
  <p class="ps-bold psm-key" style="left: 466px; top: 112px;">A</p>
  <p class="ps-heavy psm-name" style="left: 466px; top: 162px;">杂志 · 暖纸</p>
  <p class="ps-bold psm-key" style="left: 728px; top: 112px;">B</p>
  <p class="ps-heavy psm-name" style="left: 728px; top: 162px;">瑞士 · 网格</p>
  <p class="ps-bold psm-key" style="left: 990px; top: 112px;">C</p>
  <p class="ps-heavy psm-name" style="left: 990px; top: 162px;">发布会 · 暗场</p>
  <p class="ps-bold psm-key" style="left: 466px; top: 246px;">D</p>
  <p class="ps-heavy psm-name" style="left: 466px; top: 296px;">报刊 · 版面</p>
  <p class="ps-bold psm-key" style="left: 728px; top: 246px;">E</p>
  <p class="ps-heavy psm-name" style="left: 728px; top: 296px;">大字报 · 粗野</p>
  <p class="ps-bold psm-key" style="left: 990px; top: 246px;">F</p>
  <p class="ps-heavy psm-name" style="left: 990px; top: 296px;">柔和 · 产品</p>
  <p class="ps-bold psm-key" style="left: 466px; top: 380px;">G</p>
  <p class="ps-heavy psm-name" style="left: 466px; top: 430px;">摄影集 · 画册</p>
  <p class="ps-bold psm-key" style="left: 728px; top: 380px;">H</p>
  <p class="ps-heavy psm-name" style="left: 728px; top: 430px;">咨询 · 白皮书</p>
  <p class="ps-bold psm-key" style="left: 990px; top: 380px;">I</p>
  <p class="ps-heavy psm-name" style="left: 990px; top: 430px;">日式 · 极简</p>
  <p class="ps-bold psm-key" style="left: 466px; top: 514px;">J</p>
  <p class="ps-heavy psm-name" style="left: 466px; top: 564px;">拼贴 · 手账</p>
  <p class="ps-bold psm-key" style="left: 728px; top: 514px;">K</p>
  <p class="ps-heavy psm-name" style="left: 728px; top: 564px;">新中式 · 东方</p>
  <p class="ps-bold psm-key" style="left: 990px; top: 514px;">L</p>
  <p class="ps-heavy psm-name" style="left: 990px; top: 564px;">工程制图</p>
  <p class="ps-mono ps-source">来源：docs/superpowers/specs/2026-10-08-style-library-design.md §2</p>
  <p class="ps-mono ps-pageno">5</p>
</section>
```

## poster/compare · compare

二元对比。共用 64px 标题 → 左右两张 556×444 粗框大卡：左浅石卡（纯黑「之前」角标），右荧光绿卡带 `+12px` 硬黑阴影（黑底绿字「现在」角标）；卡内为小标题（≤14 字）、说明（≤60 字）、3px 黑线与 128px 大数字 + 单位。

```html
<section class="slide" data-layout="poster/compare" data-role="compare">
  <p class="ps-mono ps-top-l">01 / 风格库 · BEFORE VS NOW</p>
  <p class="ps-mono ps-top-r">STYLE E · 06</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">换皮，不如换版面。</h2>
  <div class="ps-stone psv-box psv-l" data-shape="rect" data-anim="rise"></div>
  <div class="ps-blk psv-tagbox psv-l" data-shape="rect"></div>
  <p class="ps-mono ps-on-dark psv-tag psv-tag-l">之前 / BEFORE</p>
  <h3 class="ps-heavy psv-h psv-tl" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="ps-body ps-muted psv-p psv-tl" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <div class="ps-rule psv-rule psv-tl" data-shape="rect"></div>
  <p class="ps-bold psv-num psv-nl" data-anim="count">24</p>
  <p class="ps-heavy psv-unit psv-ul" data-anim="rise">个版式，三套系统共用</p>
  <div class="ps-blk psv-shd" data-shape="rect"></div>
  <div class="ps-lime-box psv-box psv-r" data-shape="rect" data-anim="rise"></div>
  <div class="ps-blk psv-tagbox psv-r" data-shape="rect"></div>
  <p class="ps-mono ps-ac psv-tag psv-tag-r">现在 / NOW</p>
  <h3 class="ps-heavy psv-h psv-tr" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="ps-body psv-p psv-tr" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <div class="ps-rule psv-rule psv-tr" data-shape="rect"></div>
  <p class="ps-bold psv-num psv-nr" data-anim="count">12</p>
  <p class="ps-heavy psv-unit psv-ur" data-anim="rise">种风格，各有一套版式</p>
  <p class="ps-mono ps-source">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="ps-mono ps-pageno">6</p>
</section>
```

## poster/image-text · image-text

图文页。左侧 544×456 照片垫 `+14px` 硬黑阴影 + 下方荧光绿黑框图注条；右栏两行 64px 巨字标题 + 4px 黑杠 + 两段正文（每段 ≤55 字）+ 3px 黑线与一行等宽注记。

```html
<section class="slide" data-layout="poster/image-text" data-role="image-text">
  <p class="ps-mono ps-top-l">02 / 测量与导出 · MEASURE &amp; EXPORT</p>
  <p class="ps-mono ps-top-r">STYLE E · 07</p>
  <div class="ps-blk psi-shd" data-shape="rect"></div>
  <img class="ps-photo psi-img" src="assets/img/07-feature.jpg" alt="示意图：暗墙上的荧光绿窗光几何">
  <div class="ps-lime-box psi-capbox" data-shape="rect"></div>
  <p class="ps-mono psi-cap">FIG 01 · 测量坐标与原生导出示意图</p>
  <h2 class="ps-heavy psi-title psi-t1" data-merge="title" data-anim="rise">所见即所得，</h2>
  <h2 class="ps-heavy psi-title psi-t2" data-merge="title" data-anim="rise">靠的是测量。</h2>
  <div class="ps-blk psi-rule1" data-shape="rect" data-anim="draw"></div>
  <p class="ps-body psi-p psi-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="ps-body psi-p psi-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="ps-rule psi-rule2" data-shape="rect"></div>
  <p class="ps-mono psi-note">导出原语：圆角矩形 · 直线 · 燕尾 · 旋转 · 阴影 · 竖排</p>
  <p class="ps-mono ps-source">来源：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs · 图为示意图</p>
  <p class="ps-mono ps-pageno">7</p>
</section>
```

## poster/image · image

大图页。整页纯黑（`slide is-dark`）；上方 1138×364 宽幅照片垫 `+14px` 荧光绿硬偏移阴影块；下方 72px 米白粗黑巨字标题（≤14 字）+ 荧光绿横杠 + 一行说明。文字不压图，免渐变截图。

```html
<section class="slide is-dark" data-layout="poster/image" data-role="image">
  <p class="ps-mono ps-ac ps-top-l">02 / 测量与导出 · VISUAL RULE</p>
  <p class="ps-mono ps-top-r">STYLE E · 08</p>
  <div class="ps-lime psf-shd" data-shape="rect"></div>
  <img class="ps-photo psf-img" src="assets/img/08-image.jpg" alt="示意图：深暗空间中的窗光与几何投影">
  <h2 class="ps-heavy psf-title" data-anim="rise">先选风格，再写内容</h2>
  <div class="ps-acbar psf-bar" data-shape="rect" data-anim="draw"></div>
  <p class="psf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="ps-mono ps-source">来源：SKILL.md 第 1 步 Q2 · 图为示意图</p>
  <p class="ps-mono ps-pageno">8</p>
</section>
```

## poster/points · points

三点并列。共用 64px 标题 → 三列（left 64 / 456 / 848）：上 344×184 照片垫 `+12px` 硬黑阴影，下 356×230 3px 黑框卡片（第 3 张用荧光绿黑框 `ps-lime-box` 高亮），卡内为 Inter 编号 + 28px 标题 + 一句说明（≤32 字）。

```html
<section class="slide" data-layout="poster/points" data-role="points">
  <p class="ps-mono ps-top-l">02 / 测量与导出 · THREE PROMISES</p>
  <p class="ps-mono ps-top-r">STYLE E · 09</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">三件事，件件可验证。</h2>
  <div class="ps-blk pst-shd pst-s1" data-shape="rect"></div>
  <div class="ps-blk pst-shd pst-s2" data-shape="rect"></div>
  <div class="ps-blk pst-shd pst-s3" data-shape="rect"></div>
  <img class="ps-photo pst-img pst-c1" src="assets/img/09-points-1.jpg" alt="示意图：高对比建筑立面几何">
  <img class="ps-photo pst-img pst-c2" src="assets/img/09-points-2.jpg" alt="示意图：暗墙上的荧光绿光束">
  <img class="ps-photo pst-img pst-c3" src="assets/img/09-points-3.jpg" alt="示意图：高对比山脊与低悬光晕">
  <div class="ps-paper pst-box pst-c1" data-shape="rect" data-anim="rise"></div>
  <div class="ps-paper pst-box pst-c2" data-shape="rect" data-anim="rise"></div>
  <div class="ps-lime-box pst-box pst-c3" data-shape="rect" data-anim="rise"></div>
  <p class="ps-bold pst-num pst-i1" data-merge="p1" data-anim="rise">01</p>
  <h3 class="ps-heavy pst-h pst-i1" data-merge="p1" data-anim="rise">浏览器里演示</h3>
  <p class="ps-body pst-p pst-i1" data-merge="p1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <p class="ps-bold pst-num pst-i2" data-merge="p2" data-anim="rise">02</p>
  <h3 class="ps-heavy pst-h pst-i2" data-merge="p2" data-anim="rise">可编辑的 PPTX</h3>
  <p class="ps-body pst-p pst-i2" data-merge="p2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <p class="ps-bold pst-num pst-i3" data-merge="p3" data-anim="rise">03</p>
  <h3 class="ps-heavy pst-h pst-i3" data-merge="p3" data-anim="rise">机器先把关</h3>
  <p class="ps-body pst-p pst-i3" data-merge="p3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <p class="ps-mono ps-source">来源：SKILL.md 第 6、8 步 · 图为示意图</p>
  <p class="ps-mono ps-pageno">9</p>
</section>
```

## poster/kpi · kpi

数据大字页。整页纯黑（`slide is-dark`）；左上荧光绿等宽标 → 左侧 280px 荧光绿巨型数字（≤3 位）+ 56px 米白粗体标签 + 说明；右栏两项 120px 辅助指标各顶一条 4px 荧光绿横杠；底部出处必带 `data-source`。

```html
<section class="slide is-dark" data-layout="poster/kpi" data-role="kpi">
  <p class="ps-mono ps-ac ps-top-l" data-anim="rise">导出之前，先过十六道检查。</p>
  <p class="ps-mono ps-top-r">10 / 17</p>
  <p class="ps-bold ps-ac psk-hero" data-anim="count">16</p>
  <h2 class="ps-heavy psk-label" data-merge="hero" data-anim="rise">条校验规则</h2>
  <p class="psk-desc" data-merge="hero" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <div class="ps-acbar psk-bar psk-b1" data-shape="rect" data-anim="draw"></div>
  <p class="ps-bold psk-num psk-n1" data-anim="count">20</p>
  <h3 class="ps-heavy psk-sub psk-s1" data-merge="s2" data-anim="rise">页面角色</h3>
  <p class="psk-d psk-d1" data-merge="s2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <div class="ps-acbar psk-bar psk-b2" data-shape="rect" data-anim="draw"></div>
  <p class="ps-bold psk-num psk-n2" data-anim="count">3</p>
  <h3 class="ps-heavy psk-sub psk-s2" data-merge="s3" data-anim="rise">导出格式</h3>
  <p class="psk-d psk-d2" data-merge="s3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="ps-mono ps-source" data-source>来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="ps-mono ps-pageno">10</p>
</section>
```

## poster/bars · bars

条形对比（3–6 行，行距 68px）。共用 64px 标题 + 3px 黑线 → 每行「右对齐粗体标签（≤6 字）/ 44px 高实心黑条 / 38px Inter 数值 / 等宽注释」；条从 left 312 起，单位长 = 480 ÷ 最大值（金样最大值 4 → 120px）；重点条用 `ps-lime-box`。来源必带 `data-source`；`--native-charts` 时整组替换为 PowerPoint 原生条形图。

```html
<section class="slide" data-layout="poster/bars" data-role="bars">
  <p class="ps-mono ps-top-l">03 / 质量门 · RULE BREAKDOWN</p>
  <p class="ps-mono ps-top-r">STYLE E · 11</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">十六条规则，各管一摊。</h2>
  <div class="ps-rule ps-head-rule" data-shape="rect"></div>
  <p class="ps-heavy psb-label" style="top: 210px;" data-chart>排版与几何</p>
  <div class="ps-blk psb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 204px; width: 480px;"></div>
  <p class="ps-bold psb-val" style="top: 208px; left: 812px;" data-chart>4</p>
  <p class="ps-mono psb-ids" style="top: 218px; left: 872px;" data-chart>R3 · R4 · R7 · R9</p>
  <p class="ps-heavy psb-label" style="top: 278px;" data-chart>版式与样式</p>
  <div class="ps-blk psb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 272px; width: 480px;"></div>
  <p class="ps-bold psb-val" style="top: 276px; left: 812px;" data-chart>4</p>
  <p class="ps-mono psb-ids" style="top: 286px; left: 872px;" data-chart>R1 · R2 · R6 · R12</p>
  <p class="ps-heavy psb-label" style="top: 346px;" data-chart>内容与数据</p>
  <div class="ps-blk psb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 340px; width: 360px;"></div>
  <p class="ps-bold psb-val" style="top: 344px; left: 692px;" data-chart>3</p>
  <p class="ps-mono psb-ids" style="top: 354px; left: 752px;" data-chart>R5 · R8 · R14</p>
  <p class="ps-heavy psb-label" style="top: 414px;" data-chart>可访问与媒体</p>
  <div class="ps-blk psb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 408px; width: 360px;"></div>
  <p class="ps-bold psb-val" style="top: 412px; left: 692px;" data-chart>3</p>
  <p class="ps-mono psb-ids" style="top: 422px; left: 752px;" data-chart>R10 · R11 · R13</p>
  <p class="ps-heavy psb-label" style="top: 482px;" data-chart>节奏</p>
  <div class="ps-blk psb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 476px; width: 120px;"></div>
  <p class="ps-bold psb-val" style="top: 480px; left: 452px;" data-chart>1</p>
  <p class="ps-mono psb-ids" style="top: 490px; left: 512px;" data-chart>R15</p>
  <p class="ps-heavy psb-label" style="top: 550px;" data-chart>导出一致</p>
  <div class="ps-lime-box psb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 544px; width: 120px;"></div>
  <p class="ps-bold psb-val" style="top: 548px; left: 452px;" data-chart>1</p>
  <p class="ps-mono psb-ids" style="top: 558px; left: 512px;" data-chart>R16</p>
  <div class="ps-rule psb-foot-rule" data-shape="rect"></div>
  <p class="ps-mono ps-source" data-source>来源：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="ps-mono ps-pageno">11</p>
</section>
```

## poster/table · table

规格台账（4–6 行，规格 ≤30 字）。共用 64px 标题 → 纯黑表头带压荧光绿等宽列名 → 6 行（行高 64px，偶数行浅石底，行间 3px 黑线）；关键词用 `<span class="is-mark">` 荧光绿涂抹高亮。来源必带 `data-source`。

```html
<section class="slide" data-layout="poster/table" data-role="table">
  <p class="ps-mono ps-top-l">03 / 质量门 · SPECIFICATION</p>
  <p class="ps-mono ps-top-r">STYLE E · 12</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">一页纸，看懂规格。</h2>
  <div class="ps-blk psd-head" data-shape="rect"></div>
  <p class="ps-mono psd-th" style="left: 88px; width: 184px;">项目</p>
  <p class="ps-mono psd-th" style="left: 296px; width: 580px;">规格</p>
  <p class="ps-mono psd-th" style="left: 900px; width: 292px;">出处</p>
  <h3 class="ps-heavy psd-k" style="top: 246px;">画布</h3>
  <p class="ps-body psd-v" style="top: 246px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="ps-mono psd-s" style="top: 251px;">assets/base.css</p>
  <div class="ps-surf psd-band" data-shape="rect" style="top: 292px;"></div>
  <div class="ps-rule psd-rule" data-shape="rect" style="top: 292px;"></div>
  <h3 class="ps-heavy psd-k" style="top: 310px;">字号下限</h3>
  <p class="ps-body psd-v" style="top: 310px;">16 px，溢出先删字、再换版式</p>
  <p class="ps-mono psd-s" style="top: 315px;">validate.mjs · R4</p>
  <div class="ps-rule psd-rule" data-shape="rect" style="top: 356px;"></div>
  <h3 class="ps-heavy psd-k" style="top: 374px;">校验规则</h3>
  <p class="ps-body psd-v" style="top: 374px;">R1–R16，<span class="is-mark">错误清零</span>才能交付</p>
  <p class="ps-mono psd-s" style="top: 379px;">validate.mjs</p>
  <div class="ps-surf psd-band" data-shape="rect" style="top: 420px;"></div>
  <div class="ps-rule psd-rule" data-shape="rect" style="top: 420px;"></div>
  <h3 class="ps-heavy psd-k" style="top: 438px;">导出格式</h3>
  <p class="ps-body psd-v" style="top: 438px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="ps-mono psd-s" style="top: 443px;">SKILL.md</p>
  <div class="ps-rule psd-rule" data-shape="rect" style="top: 484px;"></div>
  <h3 class="ps-heavy psd-k" style="top: 502px;">页面角色</h3>
  <p class="ps-body psd-v" style="top: 502px;">20 个，其中 12 个核心角色</p>
  <p class="ps-mono psd-s" style="top: 507px;">lib/roles.mjs</p>
  <div class="ps-surf psd-band" data-shape="rect" style="top: 548px;"></div>
  <div class="ps-rule psd-rule" data-shape="rect" style="top: 548px;"></div>
  <h3 class="ps-heavy psd-k" style="top: 566px;">字体</h3>
  <p class="ps-body psd-v" style="top: 566px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="ps-mono psd-s" style="top: 571px;">fetch-fonts.mjs</p>
  <div class="ps-rule psd-rule" data-shape="rect" style="top: 612px;"></div>
  <p class="ps-mono ps-source" data-source>来源：表内「出处」列（本仓库文件）</p>
  <p class="ps-mono ps-pageno">12</p>
</section>
```

## poster/process · process

流程页。米白底；左 80px 巨字标题（≤10 字）+ 右导语 → 4 行 3px 实心黑线分隔的大字清单（等宽编号 / 56px 粗黑步骤名 / 说明 ≤28 字），最后一步（04）压在满宽 1280px 荧光绿高亮带上。

```html
<section class="slide" data-layout="poster/process" data-role="process">
  <p class="ps-mono ps-top-l">04 / 工作流 · WORKFLOW</p>
  <p class="ps-mono ps-top-r">STYLE E · 13</p>
  <h2 class="ps-heavy psp-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="psp-sub" data-anim="rise">从选风格到交付。一条管线，分四步走。</p>
  <div class="ps-rule psp-rule" data-shape="rect" style="top: 212px;"></div>
  <div class="ps-rule psp-rule" data-shape="rect" style="top: 314px;"></div>
  <div class="ps-rule psp-rule" data-shape="rect" style="top: 416px;"></div>
  <div class="ps-lime psp-strip" data-shape="rect"></div>
  <div class="ps-rule psp-strip-rule" data-shape="rect" style="top: 518px;"></div>
  <div class="ps-rule psp-strip-rule" data-shape="rect" style="top: 621px;"></div>
  <p class="ps-mono psp-num" style="top: 254px;">01</p>
  <h3 class="ps-heavy psp-name" style="top: 234px;" data-anim="rise">选风格</h3>
  <p class="ps-body psp-desc" style="top: 248px;" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="ps-mono psp-num" style="top: 356px;">02</p>
  <h3 class="ps-heavy psp-name" style="top: 336px;" data-anim="rise">填版式</h3>
  <p class="ps-body psp-desc" style="top: 350px;" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="ps-mono psp-num" style="top: 458px;">03</p>
  <h3 class="ps-heavy psp-name" style="top: 438px;" data-anim="rise">过校验</h3>
  <p class="ps-body psp-desc" style="top: 452px;" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="ps-mono ps-strong psp-num" style="top: 562px;">04</p>
  <h3 class="ps-heavy psp-name" style="top: 542px;" data-anim="rise">导出</h3>
  <p class="ps-body ps-strong psp-desc" style="top: 556px;" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <p class="ps-mono ps-source">来源：SKILL.md 工作流</p>
  <p class="ps-mono ps-pageno">13</p>
</section>
```

## poster/timeline · timeline

时间线。共用 64px 标题 → 5 列里程碑（步距 234px）：56px Inter 日期 + 6px 粗黑主轴与实心黑方块节点 + 28px 节点名与说明（≤22 字）；最新里程碑整列框进带硬黑阴影的荧光绿粗框卡。

```html
<section class="slide" data-layout="poster/timeline" data-role="timeline">
  <p class="ps-mono ps-top-l">04 / 工作流 · MILESTONES</p>
  <p class="ps-mono ps-top-r">STYLE E · 14</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">从一套版式，到一座风格库。</h2>
  <div class="ps-blk psl-shd" data-shape="rect"></div>
  <div class="ps-lime-box psl-card" data-shape="rect"></div>
  <div class="ps-blk psl-line" data-shape="rect" data-anim="draw"></div>
  <p class="ps-bold psl-date psl-c1" data-anim="rise">07.16</p>
  <div class="ps-blk psl-node psl-c1" data-shape="rect" data-anim="pop"></div>
  <h3 class="ps-heavy psl-h psl-c1" data-merge="m1" data-anim="rise">首版发布</h3>
  <p class="psl-p psl-c1" data-merge="m1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <p class="ps-bold psl-date psl-c2" data-anim="rise">07.18</p>
  <div class="ps-blk psl-node psl-c2" data-shape="rect" data-anim="pop"></div>
  <h3 class="ps-heavy psl-h psl-c2" data-merge="m2" data-anim="rise">墨韵衬线</h3>
  <p class="psl-p psl-c2" data-merge="m2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <p class="ps-bold psl-date psl-c3" data-anim="rise">08.17</p>
  <div class="ps-blk psl-node psl-c3" data-shape="rect" data-anim="pop"></div>
  <h3 class="ps-heavy psl-h psl-c3" data-merge="m3" data-anim="rise">校验全覆盖</h3>
  <p class="psl-p psl-c3" data-merge="m3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <p class="ps-bold psl-date psl-c4" data-anim="rise">08.18</p>
  <div class="ps-blk psl-node psl-c4" data-shape="rect" data-anim="pop"></div>
  <h3 class="ps-heavy psl-h psl-c4" data-merge="m4" data-anim="rise">瑞士国际</h3>
  <p class="psl-p psl-c4" data-merge="m4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <p class="ps-bold psl-date psl-c5 psl-t5" data-anim="rise">10.08</p>
  <div class="ps-blk psl-node psl-c5" data-shape="rect" data-anim="pop"></div>
  <h3 class="ps-heavy psl-h psl-c5 psl-t5" data-merge="m5" data-anim="rise">风格库</h3>
  <p class="psl-p ps-ink psl-c5 psl-t5" data-merge="m5" data-anim="rise">十二种风格，版式独立。</p>
  <p class="ps-mono ps-source">来源：git log（2026-07-16 → 2026-10-08）</p>
  <p class="ps-mono ps-pageno">14</p>
</section>
```

## poster/gallery · gallery

多图并列。共用 64px 标题 → 左 716×420 主图（左上角压荧光绿黑框徽标）+ 右两张 378×192 叠放配图，三张均垫 `+14px` 纯黑硬偏移阴影；页脚标明出处与「三幅均为示意图」。

```html
<section class="slide" data-layout="poster/gallery" data-role="gallery">
  <p class="ps-mono ps-top-l">04 / 工作流 · ARTWORK GALLERY</p>
  <p class="ps-mono ps-top-r">STYLE E · 15</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">配图由脚本生成，按风格取色。</h2>
  <div class="ps-blk psg-s1" data-shape="rect"></div>
  <img class="ps-photo psg-w1" src="assets/img/15-gallery-1.jpg" alt="示意图：高对比几何立面与荧光绿块面">
  <div class="ps-lime-box psg-badge" data-shape="rect"></div>
  <p class="ps-mono psg-btxt">SEEDED · ON PALETTE</p>
  <div class="ps-blk psg-s2" data-shape="rect"></div>
  <img class="ps-photo psg-w2" src="assets/img/15-gallery-2.jpg" alt="示意图：荧光绿与纯黑渐变色场">
  <div class="ps-blk psg-s3" data-shape="rect"></div>
  <img class="ps-photo psg-w3" src="assets/img/15-gallery-3.jpg" alt="示意图：深墙上的斜射窗光">
  <p class="ps-mono ps-source">来源：scripts/gen-art.mjs · 固定种子，输出可复现 · 三幅均为示意图</p>
  <p class="ps-mono ps-pageno">15</p>
</section>
```

## poster/cycle · cycle

环形闭环（有回路才用）。整页纯黑（`slide is-dark`）；左侧 4px 荧光绿粗环 + 四枚直角节点方框（起点 01 实心荧光绿）+ 环心 112px 荧光绿步数；右侧 4 行 40px 粗体步骤与底部荧光绿回路提示条。

```html
<section class="slide is-dark" data-layout="poster/cycle" data-role="cycle">
  <p class="ps-mono ps-ac ps-top-l">04 / 工作流 · FEEDBACK LOOP</p>
  <p class="ps-mono ps-top-r">STYLE E · 16</p>
  <h2 class="ps-heavy ps-head" data-anim="rise">每次改动，都绕这一圈</h2>
  <div class="psy-ring" data-shape="ellipse" data-anim="fade"></div>
  <div class="ps-lime psy-node psy-n1" data-shape="rect" data-anim="ring"></div>
  <div class="ps-dark-box psy-node psy-n2" data-shape="rect" data-anim="ring"></div>
  <div class="ps-dark-box psy-node psy-n3" data-shape="rect" data-anim="ring"></div>
  <div class="ps-dark-box psy-node psy-n4" data-shape="rect" data-anim="ring"></div>
  <p class="ps-bold ps-on psy-k" style="left: 276px; top: 236px;">01</p>
  <p class="ps-bold ps-ac psy-k" style="left: 440px; top: 400px;">02</p>
  <p class="ps-bold ps-ac psy-k" style="left: 276px; top: 564px;">03</p>
  <p class="ps-bold ps-ac psy-k" style="left: 112px; top: 400px;">04</p>
  <p class="ps-bold psy-core" data-anim="count">4</p>
  <p class="ps-mono psy-core-l">STEPS / LOOP</p>
  <div class="ps-lime psy-mark" data-shape="rect"></div>
  <p class="ps-bold ps-ac psy-num" style="top: 228px;">01</p>
  <h3 class="ps-heavy psy-h" style="top: 222px;" data-anim="rise">改版式</h3>
  <div class="ps-rule psy-rule" data-shape="rect" style="top: 292px;"></div>
  <p class="ps-bold ps-muted psy-num" style="top: 316px;">02</p>
  <h3 class="ps-heavy psy-h" style="top: 310px;" data-anim="rise">过校验</h3>
  <div class="ps-rule psy-rule" data-shape="rect" style="top: 380px;"></div>
  <p class="ps-bold ps-muted psy-num" style="top: 404px;">03</p>
  <h3 class="ps-heavy psy-h" style="top: 398px;" data-anim="rise">渲染比对</h3>
  <div class="ps-rule psy-rule" data-shape="rect" style="top: 468px;"></div>
  <p class="ps-bold ps-muted psy-num" style="top: 492px;">04</p>
  <h3 class="ps-heavy psy-h" style="top: 486px;" data-anim="rise">记基线</h3>
  <div class="ps-rule psy-rule" data-shape="rect" style="top: 556px;"></div>
  <div class="ps-lime psy-backbox" data-shape="rect" data-anim="rise"></div>
  <p class="ps-mono ps-strong psy-back">→ 回到改版式 · LOOP UNTIL ZERO ERRORS</p>
  <p class="ps-mono ps-source">来源：scripts/baseline.mjs（基线前先过 check-style 与 validate）</p>
  <p class="ps-mono ps-pageno">16</p>
</section>
```

## poster/closing · closing

结尾页。整页纯黑（`slide is-dark`），与封面反向呼应；两行 112px 巨字收束（第二行荧光绿）→ 带 `+10px` 荧光绿硬阴影的命令框 + 画廊路径 → 底部 96px 满宽荧光绿底带配纯黑等宽跑马字，不放页码。

```html
<section class="slide is-dark" data-layout="poster/closing" data-role="closing">
  <p class="ps-mono ps-ac ps-top-l" data-anim="rise">NEXT STEP / 下一步</p>
  <p class="ps-mono ps-top-r">STYLE E · 大字报 · 粗野</p>
  <h2 class="ps-heavy pse-title pse-t1" data-merge="title" data-anim="rise">挑一种风格，</h2>
  <h2 class="ps-heavy ps-ac pse-title pse-t2" data-merge="title" data-anim="rise">开始下一份。</h2>
  <div class="ps-lime pse-shd" data-shape="rect"></div>
  <div class="ps-dark-box pse-box" data-shape="rect"></div>
  <p class="pse-cmd">node scripts/new-deck.mjs my-deck --style poster</p>
  <p class="pse-p">风格画廊：docs/styles/index.html</p>
  <div class="ps-lime pse-band" data-shape="rect"></div>
  <p class="ps-mono ps-strong pse-tick-l">ZIFEIYU PPT SKILL · STYLE E POSTER</p>
  <p class="ps-mono ps-strong pse-tick-r">HTML → PPTX / PDF / PNG</p>
</section>
```
