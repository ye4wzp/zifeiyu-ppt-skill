# 咨询 · 白皮书（consulting）版式注册表

> 状态：draft · P1 制作中，已有 10 个版式；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/consulting/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **页头四件套**：亮蓝追踪标签（`cs-trk cs-tracker`，top 48）→ 一句话结论标题（`cs-semi cs-title`，32px，最多两行）→ 细线（top 176）→ 图表编号（`cs-exhibit`，「图表 N · 说明」，top 204）。
2. **页脚**：细线 640，左「来源：……」（`cs-source`），右页码（`cs-pageno`，只写数字）；数据页的来源加 `data-source`。
3. **亮蓝全页一处**：一个 `cs-ac` 数字，或一块 `cs-blue` 色块 / 箭头，二选一；其余用海军蓝三档（`cs-navy` / `cs-navy2` / `cs-navy3`）和灰。
4. **结论条**：浅蓝底 + 亮蓝左边线的「要点」条（`cs-tint` + `cs-blue`），或海军蓝底的「关键」条；一页最多一条，放在图表下方。
5. **燕尾流程**：第一段用 `data-shape="pentagon"`，其后 `data-shape="chevron"`；`--tip` 必须等于高的一半（R16），导出为 PowerPoint 原生燕尾形。
6. **字体分工**：标题、标签、小标题用思源黑 600（`cs-semi`，Office 里是微软雅黑粗体）；数字用 Inter 600（`cs-num`，Office 里是 Segoe UI 粗体）；正文 `cs-body`，说明 `cs-note`。
7. **页面状态**：`slide is-dark` 海军蓝页给 statement / cycle / closing，以及满版图页（色带上的文字取深色页 token）；深色页上亮蓝提亮为 #8fb0ff，`cs-on` 变成海军蓝（浅蓝色块上的字）。
8. **追踪标签与图表编号**：追踪标签写本页所在章节名（与目录一致）；图表编号全 deck 连续，只给有图表、图片或示意图的页，纯论述页（compare / points）不编号。

## consulting/cover · cover

封面。左 400px 海军蓝色块（亮蓝追踪标签、底部两行机构信息），右侧亮蓝短条 → 两行标题（每行一个 h1）→ 一段说明 → 细线 + 标签与日期。

```html
<section class="slide" data-layout="consulting/cover" data-role="cover">
  <div class="cs-navy csc-panel" data-shape="rect"></div>
  <p class="cs-trk cs-key csc-trk">ZIFEIYU PPT SKILL</p>
  <p class="cs-on2 csc-org csc-o1" data-merge="org">风格 H</p>
  <p class="cs-on2 csc-org csc-o2" data-merge="org">咨询 · 白皮书</p>
  <div class="cs-blue csc-bar" data-shape="rect" data-anim="draw"></div>
  <h1 class="cs-semi csc-title csc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="cs-semi csc-title csc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <p class="csc-sub" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="cs-hair csc-hair" data-shape="rect"></div>
  <p class="csc-meta">网页 PPT · 可编辑导出</p>
  <p class="csc-date">2026 年 10 月</p>
</section>
```

## consulting/agenda · agenda

目录。页头只有追踪标签与标题「目录」，4 行「Inter 编号 / 条目 / 一句说明 / 页码」，行高 100px、行间细线，页脚细线收住最后一行；第一个编号上亮蓝。条目 ≤6 字，说明 ≤14 字。

```html
<section class="slide" data-layout="consulting/agenda" data-role="agenda">
  <p class="cs-trk cs-tracker">ZIFEIYU PPT SKILL</p>
  <h2 class="cs-semi cs-title" data-anim="rise">目录</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <p class="cs-num cs-ac csa-num" style="top: 234px;" data-anim="rise">01</p>
  <h3 class="cs-semi csa-item" style="top: 238px;" data-anim="rise">风格库</h3>
  <p class="csa-desc" style="top: 244px;" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="csa-page" style="top: 246px;">第 4 页</p>
  <div class="cs-hair csa-hair" data-shape="rect" style="top: 308px;"></div>
  <p class="cs-num csa-num" style="top: 334px;" data-anim="rise">02</p>
  <h3 class="cs-semi csa-item" style="top: 338px;" data-anim="rise">测量与导出</h3>
  <p class="csa-desc" style="top: 344px;" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="csa-page" style="top: 346px;">第 7 页</p>
  <div class="cs-hair csa-hair" data-shape="rect" style="top: 408px;"></div>
  <p class="cs-num csa-num" style="top: 434px;" data-anim="rise">03</p>
  <h3 class="cs-semi csa-item" style="top: 438px;" data-anim="rise">质量门</h3>
  <p class="csa-desc" style="top: 444px;" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="csa-page" style="top: 446px;">第 10 页</p>
  <div class="cs-hair csa-hair" data-shape="rect" style="top: 508px;"></div>
  <p class="cs-num csa-num" style="top: 534px;" data-anim="rise">04</p>
  <h3 class="cs-semi csa-item" style="top: 538px;" data-anim="rise">工作流</h3>
  <p class="csa-desc" style="top: 544px;" data-anim="rise">从大纲到成稿的四步</p>
  <p class="csa-page" style="top: 546px;">第 13 页</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-pageno">2</p>
</section>
```

## consulting/statement · statement

金句海军蓝页。追踪标签 → 浅蓝短条 → 两行 64px 粗体引文（每行一个 h2，每行 ≤12 字）→ 出处。

```html
<section class="slide is-dark" data-layout="consulting/statement" data-role="statement">
  <p class="cs-trk cs-tracker">设计原则</p>
  <div class="cs-blue csq-bar" data-shape="rect" data-anim="draw"></div>
  <h2 class="cs-semi csq-line csq-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="cs-semi csq-line csq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <p class="csq-by">— SKILL.md · 设计原则</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-pageno">3</p>
</section>
```

## consulting/section · section

章节页。左 400px 海军蓝色块：追踪标签「第 N 部分」与 200px 章节号；右：章节名 → 细线 → 重复目录四行，本章一行亮蓝并带左侧竖标（`csx-now` + `csx-mark`），其余灰。

```html
<section class="slide" data-layout="consulting/section" data-role="section">
  <div class="cs-navy csx-panel" data-shape="rect"></div>
  <p class="cs-trk cs-key csx-trk">第 1 部分</p>
  <p class="cs-num cs-on csx-num" data-anim="rise">01</p>
  <h2 class="cs-semi csx-title" data-anim="rise">风格库</h2>
  <div class="cs-hair csx-hair" data-shape="rect" data-anim="draw"></div>
  <div class="cs-blue csx-mark" data-shape="rect" style="top: 368px;"></div>
  <p class="cs-num csx-n csx-now" style="top: 368px;">01</p>
  <p class="cs-semi csx-i csx-now" style="top: 368px;">风格库</p>
  <p class="cs-num csx-n" style="top: 424px;">02</p>
  <p class="csx-i" style="top: 424px;">测量与导出</p>
  <p class="cs-num csx-n" style="top: 480px;">03</p>
  <p class="csx-i" style="top: 480px;">质量门</p>
  <p class="cs-num csx-n" style="top: 536px;">04</p>
  <p class="csx-i" style="top: 536px;">工作流</p>
  <p class="cs-pageno">4</p>
</section>
```

## consulting/matrix · matrix

分组盘点 + 总数。左：Inter 巨数字总数、标签与两行分组说明，竖细线隔开；右：每组一行「组名 / 2–4 个浅蓝标签块」（行距 72，块宽 148），当前项整块亮蓝。8–12 项，名称 ≤8 字。

```html
<section class="slide" data-layout="consulting/matrix" data-role="matrix">
  <p class="cs-trk cs-tracker">风格库</p>
  <h2 class="cs-semi cs-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <p class="cs-semi cs-exhibit">图表 1 · 十二种风格，分五组</p>
  <p class="cs-num csm-hero" data-anim="count">12</p>
  <h3 class="cs-semi csm-label" data-merge="hero" data-anim="rise">种风格</h3>
  <p class="cs-note csm-sub" data-merge="hero" data-anim="rise">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="csm-vr" data-shape="rect"></div>
  <h3 class="cs-semi csm-group" style="top: 259px;">编辑排印</h3>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 576px; top: 248px;"></div>
  <p class="cs-semi csm-name" style="left: 590px; top: 260px;">A 杂志 · 暖纸</p>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 740px; top: 248px;"></div>
  <p class="cs-semi csm-name" style="left: 754px; top: 260px;">D 报刊 · 版面</p>
  <h3 class="cs-semi csm-group" style="top: 331px;">商务理性</h3>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 576px; top: 320px;"></div>
  <p class="cs-semi csm-name" style="left: 590px; top: 332px;">B 瑞士 · 网格</p>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 740px; top: 320px;"></div>
  <p class="cs-semi csm-name" style="left: 754px; top: 332px;">F 柔和 · 产品</p>
  <div class="cs-blue csm-chip" data-shape="rect" style="left: 904px; top: 320px;"></div>
  <p class="cs-semi cs-on csm-name" style="left: 918px; top: 332px;">H 咨询 · 白皮书</p>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 1068px; top: 320px;"></div>
  <p class="cs-semi csm-name" style="left: 1082px; top: 332px;">L 工程制图</p>
  <h3 class="cs-semi csm-group" style="top: 403px;">舞台冲击</h3>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 576px; top: 392px;"></div>
  <p class="cs-semi csm-name" style="left: 590px; top: 404px;">C 发布会 · 暗场</p>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 740px; top: 392px;"></div>
  <p class="cs-semi csm-name" style="left: 754px; top: 404px;">E 大字报 · 粗野</p>
  <h3 class="cs-semi csm-group" style="top: 475px;">影像叙事</h3>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 576px; top: 464px;"></div>
  <p class="cs-semi csm-name" style="left: 590px; top: 476px;">G 摄影集 · 画册</p>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 740px; top: 464px;"></div>
  <p class="cs-semi csm-name" style="left: 754px; top: 476px;">J 拼贴 · 手账</p>
  <h3 class="cs-semi csm-group" style="top: 547px;">东方人文</h3>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 576px; top: 536px;"></div>
  <p class="cs-semi csm-name" style="left: 590px; top: 548px;">I 日式 · 极简</p>
  <div class="cs-tint csm-chip" data-shape="rect" style="left: 740px; top: 536px;"></div>
  <p class="cs-semi csm-name" style="left: 754px; top: 548px;">K 新中式 · 东方</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-source">来源：docs/superpowers/specs/2026-10-08-style-library-design.md §2</p>
  <p class="cs-pageno">5</p>
</section>
```

## consulting/compare · compare

二元对比。两栏各 520 宽：顶部色条标「之前」（海军蓝灰）/「现在」（亮蓝），中缝一枚原生燕尾箭头；每栏「小标题 / 两行说明 / 细线 / Inter 数字 + 一句数字说明」。数字必须真实；结论一侧放亮蓝。

```html
<section class="slide" data-layout="consulting/compare" data-role="compare">
  <p class="cs-trk cs-tracker">风格库</p>
  <h2 class="cs-semi cs-title" data-anim="rise">换皮，不如换版面。</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <div class="cs-navy3 csv-head csv-l" data-shape="rect"></div>
  <div class="cs-blue csv-head csv-r" data-shape="rect"></div>
  <p class="cs-semi cs-on csv-hl csv-tl">之前</p>
  <p class="cs-semi cs-on csv-hl csv-tr">现在</p>
  <div class="cs-navy3 csv-arrow" data-shape="chevron" data-anim="fade"></div>
  <h3 class="cs-semi csv-h csv-l" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="cs-body csv-p csv-l" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <div class="cs-hair csv-hair csv-l" data-shape="rect"></div>
  <p class="cs-num csv-num csv-l" data-anim="count">24</p>
  <p class="cs-semi csv-nl csv-nll" data-anim="rise">个版式，三套系统共用</p>
  <h3 class="cs-semi csv-h csv-r" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="cs-body csv-p csv-r" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <div class="cs-hair csv-hair csv-r" data-shape="rect"></div>
  <p class="cs-num csv-num csv-r" data-anim="count">12</p>
  <p class="cs-semi csv-nl csv-nlr" data-anim="rise">种风格，各有一套版式</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-source">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="cs-pageno">6</p>
</section>
```

## consulting/image-text · image-text

图文。页头带图表编号；左图 560×360，右栏两段正文（每段 ≤50 字，各带海军蓝方点）、细线与一行注脚。

```html
<section class="slide" data-layout="consulting/image-text" data-role="image-text">
  <p class="cs-trk cs-tracker">测量与导出</p>
  <h2 class="cs-semi cs-title" data-anim="rise">所见即所得，靠的是测量。</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <p class="cs-semi cs-exhibit">图表 2 · 示意图</p>
  <img class="cs-photo csi-img" src="assets/img/07-feature.jpg" alt="示意图：浅灰立板与一块亮蓝立板">
  <div class="cs-navy csi-dot" data-shape="rect" style="top: 254px;"></div>
  <p class="csi-p" style="top: 240px; width: 528px;" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <div class="cs-navy csi-dot" data-shape="rect" style="top: 366px;"></div>
  <p class="csi-p" style="top: 352px;" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="cs-hair csi-hair" data-shape="rect"></div>
  <p class="cs-note csi-note">导出原语：圆角矩形 · 直线 · 燕尾 · 旋转 · 阴影 · 竖排</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-source">来源：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs</p>
  <p class="cs-pageno">7</p>
</section>
```

## consulting/image · image

满版图 + 底部 240px 海军蓝色带（页面挂 `is-dark`）：浅蓝短条、一句标题、一句说明，右侧图表编号与页码。图的看点放在上三分之二。

```html
<section class="slide is-dark" data-layout="consulting/image" data-role="image">
  <img class="cs-photo csf-img" src="assets/img/08-image.jpg" alt="示意图：浅灰立板构成的空间">
  <div class="cs-navy csf-band" data-shape="rect"></div>
  <div class="cs-blue csf-bar" data-shape="rect" data-anim="draw"></div>
  <h2 class="cs-semi csf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="csf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <p class="csf-cap">图表 3 · 示意图</p>
  <p class="cs-pageno">8</p>
</section>
```

## consulting/kpi · kpi

数据页。页头四件套 → 三栏关键数字（第一个用 `cs-ac` 上亮蓝）+ 标签 + 一句说明，栏间竖细线 → 「要点」结论条 → 来源与页码。三个数都必须真实；说明每条 ≤22 字。

```html
<section class="slide" data-layout="consulting/kpi" data-role="kpi">
  <p class="cs-trk cs-tracker">质量门</p>
  <h2 class="cs-semi cs-title" data-anim="rise">导出之前，先过十六道检查。</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <p class="cs-semi cs-exhibit">图表 4 · 质量门的三个数字</p>
  <p class="cs-num cs-ac csk-num csk-c1" data-anim="count">16</p>
  <h3 class="cs-semi csk-label csk-c1" data-merge="c1" data-anim="rise">条校验规则</h3>
  <p class="cs-note csk-desc csk-c1" data-merge="c1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <div class="csk-vr csk-v1" data-shape="rect"></div>
  <p class="cs-num csk-num csk-c2" data-anim="count">20</p>
  <h3 class="cs-semi csk-label csk-c2" data-merge="c2" data-anim="rise">页面角色</h3>
  <p class="cs-note csk-desc csk-c2" data-merge="c2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <div class="csk-vr csk-v2" data-shape="rect"></div>
  <p class="cs-num csk-num csk-c3" data-anim="count">3</p>
  <h3 class="cs-semi csk-label csk-c3" data-merge="c3" data-anim="rise">导出格式</h3>
  <p class="cs-note csk-desc csk-c3" data-merge="c3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <div class="cs-tint csk-box" data-shape="rect"></div>
  <div class="cs-blue csk-edge" data-shape="rect"></div>
  <p class="cs-semi csk-key" data-merge="key">要点</p>
  <p class="cs-semi csk-take" data-merge="key" data-anim="rise">十六条规则，错误清零才交付。</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-source" data-source>来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="cs-pageno">10</p>
</section>
```

## consulting/process · process

流程。页头四件套 → 四段燕尾箭头（海军蓝三档渐浅，最后一段亮蓝），箭头内写步骤名 → 步骤号与两行说明 → 海军蓝「关键」结论条 → 来源与页码。步骤名 ≤4 字，说明 ≤28 字。

```html
<section class="slide" data-layout="consulting/process" data-role="process">
  <p class="cs-trk cs-tracker">工作流</p>
  <h2 class="cs-semi cs-title" data-anim="rise">从大纲到成稿，四步</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <p class="cs-semi cs-exhibit">图表 7 · 从大纲到成稿</p>
  <div class="cs-navy csp-chev csp-b1" data-shape="pentagon" data-anim="rise"></div>
  <div class="cs-navy2 csp-chev csp-b2" data-shape="chevron" data-anim="rise"></div>
  <div class="cs-navy3 csp-chev csp-b3" data-shape="chevron" data-anim="rise"></div>
  <div class="cs-blue csp-chev csp-b4" data-shape="chevron" data-anim="rise"></div>
  <h3 class="cs-semi cs-on csp-name csp-c1">选风格</h3>
  <h3 class="cs-semi cs-on csp-name csp-c2">填版式</h3>
  <h3 class="cs-semi cs-on csp-name csp-c3">过校验</h3>
  <h3 class="cs-semi cs-on csp-name csp-c4">导出</h3>
  <p class="cs-trk csp-step csp-c1" data-merge="s1" data-anim="rise">01</p>
  <p class="cs-body csp-desc csp-c1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="cs-trk csp-step csp-c2" data-merge="s2" data-anim="rise">02</p>
  <p class="cs-body csp-desc csp-c2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="cs-trk csp-step csp-c3" data-merge="s3" data-anim="rise">03</p>
  <p class="cs-body csp-desc csp-c3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="cs-trk csp-step csp-c4" data-merge="s4" data-anim="rise">04</p>
  <p class="cs-body csp-desc csp-c4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="cs-navy csp-bar" data-shape="rect" data-anim="rise"></div>
  <p class="cs-semi cs-key csp-key" data-merge="key">关键</p>
  <p class="cs-semi cs-on csp-take" data-merge="key" data-anim="rise">先选风格，再写内容：风格决定版面，版面决定一页能放多少字。</p>
  <div class="cs-hair cs-foot-rule" data-shape="rect"></div>
  <p class="cs-source">来源：SKILL.md 工作流</p>
  <p class="cs-pageno">13</p>
</section>
```
