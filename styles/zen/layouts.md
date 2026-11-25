# 日式 · 极简（zen）版式注册表

> 状态：ready · 17 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / cycle / system。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/zen/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **留白（间）与 1px 丝线**：默认和纸暖白底（`#fbfaf7`），左右留白 `96px–112px`，底部以 `644px` 细线（`zn-fhair`）与左出处 / 右页码（`01 / 17`）温和收束；全部水平线（`zn-hair`）与竖线（`zn-vr`）由 `<div data-shape="rect">` 承担，不写单边 CSS border（R16）。
2. **纯中文竖排**：`zn-vt`（`writing-mode: vertical-rl; text-orientation: mixed;`）严格仅用于纯中文标题与栏目标签（如 `cover` / `agenda` / `statement` / `section` / `image-text` / `process` / `closing`），避免竖排夹拉丁字母造成浏览器与 PowerPoint `eaVert` 旋转不一致；每个竖排槽位独立成块，不跨列合并 `data-merge`。
3. **唯一朱砂圆点**：朱砂（`#b5473a`，暗版提亮为 `#df6b5d`）极度克制，每页原则上只落一粒 `11–12px` 圆形印点（`zn-dot` / `zn-dot-lg`，配合 `data-shape="ellipse"`）作视觉停顿或当前项落款，绝不喧哗。
4. **字体分工**：主标题与竖排书法感大字用思源宋体 Light 300（`zn-mincho`），小标题与条目用思源宋体 Regular 400（`zn-mincho-r`，Office 均回退 `SimSun`）；大数字用 `Inter` Ultra-Light 200（`zn-ul`，Office 回退 `Segoe UI Light`）；日期、规则编号、文件路径与命令用 `Inter` Light 300（`zn-num` / `zn-latin`）；正文用思源黑体 Light 300（`zn-body` / `zn-note`，Office 回退 `Microsoft YaHei Light`）。
5. **明暗节奏**：节奏页（`statement` / `image` / `cycle` / `closing`）挂 `slide is-dark` 翻转为墨炭暗底（`#1c1b19`），和纸浅页与墨炭暗页交替呼吸，避免长段同明度连续排布（R15）。
6. **文字与底面分离**：全部文字标签（`h1` / `h2` / `h3` / `p`）无背景、描边、阴影与内边距（R16），底面托纸与框线统一放在底层 `[data-shape]` 上。

## zen/cover · cover

竖排画册封面。左侧顶部克制标签 + 3:2 远山和纸画框（576×384）配图注与横排说明；1px 竖线隔开；右侧纯中文思源宋极细竖排两行主标题与竖排副题，主标题下方落一粒朱砂圆点收束。

```html
<section class="slide" data-layout="zen/cover" data-role="cover">
  <p class="zn-label znc-tag">网页 PPT · 可编辑导出</p>
  <img class="zn-photo znc-img" src="assets/img/01-cover.jpg" alt="示意图：和纸底色与远山晨雾构图">
  <p class="zn-note znc-cap">图 01 · 示意图</p>
  <p class="zn-body znc-desc" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="zn-vr znc-vr" data-shape="rect" data-anim="grow-y"></div>
  <h1 class="zn-mincho zn-vt znc-t1" data-anim="rise">一份源文件</h1>
  <h2 class="zn-mincho zn-vt znc-t2" data-anim="rise">三种交付</h2>
  <p class="zn-mincho zn-vt znc-sub" data-anim="fade">东方人文 · 留白与竖排</p>
  <div class="zn-dot-lg znc-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-label znc-foot">风格 I · 日式 · 极简</p>
  <p class="zn-num znc-pageno">01 / 17</p>
</section>
```

## zen/agenda · agenda

静谧目录页。左侧大面积留白中竖排「目次」与单粒朱砂圆点，左下角轻置章节总览说明；1px 竖线隔开；右侧四行极细 Inter 编号 + 宋体条目 + 一句说明 + 右对齐页码，行间 1px 丝线分隔。

```html
<section class="slide" data-layout="zen/agenda" data-role="agenda">
  <h2 class="zn-mincho zn-vt zna-vt" data-anim="rise">目次</h2>
  <div class="zn-dot zna-dot" data-shape="ellipse" data-anim="pop"></div>
  <p class="zn-note zna-meta">全篇四章十七页，由风格选择至确定性导出，一脉相承。</p>
  <div class="zn-vr zna-vr" data-shape="rect"></div>
  <p class="zn-ul zna-num" style="top: 142px;" data-anim="rise">01</p>
  <h3 class="zn-mincho-r zna-item" style="top: 138px;" data-merge="a1" data-anim="rise">风格库</h3>
  <p class="zn-note zna-desc" style="top: 182px;" data-merge="a1" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="zn-num zna-pg" style="top: 150px;">04</p>
  <div class="zn-hair zna-hair" data-shape="rect" style="top: 238px;"></div>
  <p class="zn-ul zna-num" style="top: 260px;" data-anim="rise">02</p>
  <h3 class="zn-mincho-r zna-item" style="top: 256px;" data-merge="a2" data-anim="rise">测量与导出</h3>
  <p class="zn-note zna-desc" style="top: 300px;" data-merge="a2" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="zn-num zna-pg" style="top: 268px;">07</p>
  <div class="zn-hair zna-hair" data-shape="rect" style="top: 356px;"></div>
  <p class="zn-ul zna-num" style="top: 378px;" data-anim="rise">03</p>
  <h3 class="zn-mincho-r zna-item" style="top: 374px;" data-merge="a3" data-anim="rise">质量门</h3>
  <p class="zn-note zna-desc" style="top: 418px;" data-merge="a3" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="zn-num zna-pg" style="top: 386px;">10</p>
  <div class="zn-hair zna-hair" data-shape="rect" style="top: 474px;"></div>
  <p class="zn-ul zna-num" style="top: 496px;" data-anim="rise">04</p>
  <h3 class="zn-mincho-r zna-item" style="top: 492px;" data-merge="a4" data-anim="rise">工作流</h3>
  <p class="zn-note zna-desc" style="top: 536px;" data-merge="a4" data-anim="rise">从大纲到成稿的四步</p>
  <p class="zn-num zna-pg" style="top: 504px;">13</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-label zn-foot">日式 · 极简 · 目录</p>
  <p class="zn-num zn-pageno">02 / 17</p>
</section>
```

## zen/statement · statement

墨炭暗版宣言页（`is-dark`）。最右侧竖排「设计原则」作呼应，主视觉由一粒朱砂圆点与短横线起笔，引出两行 62px 极细宋体引文（因含拉丁缩写保持横排），下方长细线收束出处与简注。

```html
<section class="slide is-dark" data-layout="zen/statement" data-role="statement">
  <p class="zn-mincho zn-vt znq-vt">设计原则</p>
  <div class="zn-dot-lg znq-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair znq-short" data-shape="rect" data-anim="draw"></div>
  <h2 class="zn-mincho znq-line znq-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="zn-mincho znq-line znq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <div class="zn-hair znq-rule" data-shape="rect"></div>
  <p class="zn-latin znq-by">— SKILL.md · 设计原则</p>
  <p class="zn-note znq-note">浏览器排布即终稿坐标，导出后文字始终可编辑。</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-label znq-foot">风格 I · 核心主张</p>
  <p class="zn-num zn-pageno">03 / 17</p>
</section>
```

## zen/section · section

竖排篇章扉页。左侧 168px 极细 Inter 章节号 + 1px 细线 + 章节导语 + 四章安静导航；1px 竖线隔开；右侧「第一章」小竖排与 84px 极细宋体竖排章节名，下端落单粒朱砂圆点。

```html
<section class="slide" data-layout="zen/section" data-role="section">
  <p class="zn-ul znx-num" data-anim="rise">01</p>
  <div class="zn-hair znx-rule" data-shape="rect" data-anim="draw"></div>
  <p class="zn-body znx-desc" data-anim="rise">十二种风格各有一套独立版式，按页面角色统一登记。先按场合选风格，再依内容形状落版面。</p>
  <p class="zn-label zn-ink-t znx-trail znx-t1">01 风格库</p>
  <p class="zn-label znx-trail znx-t2">02 测量与导出</p>
  <p class="zn-label znx-trail znx-t3">03 质量门</p>
  <p class="zn-label znx-trail znx-t4">04 工作流</p>
  <div class="zn-vr znx-vr" data-shape="rect"></div>
  <p class="zn-mincho zn-vt znx-ord">第一章</p>
  <h2 class="zn-mincho zn-vt znx-vt" data-anim="rise">风格库</h2>
  <div class="zn-dot-lg znx-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-label zn-foot">日式 · 极简 · 篇章</p>
  <p class="zn-num zn-pageno">04 / 17</p>
</section>
```

## zen/matrix · matrix

十二风格矩阵页。左栏 136px 极细大数字「12」配分组总览；1px 竖线隔开；右侧 3×4 细线网格陈列 A–L 全部风格，当前风格 I（日式 · 极简）以浅和纸托底并落全页唯一朱砂圆点。

```html
<section class="slide" data-layout="zen/matrix" data-role="matrix">
  <p class="zn-label zn-kicker">风格索引</p>
  <p class="zn-num zn-top-r">STYLE LIBRARY · 12</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <div class="zn-hair zn-hrule" data-shape="rect"></div>
  <p class="zn-ul znm-hero" data-anim="count">12</p>
  <h3 class="zn-mincho-r znm-unit" data-merge="hero" data-anim="rise">种风格</h3>
  <div class="zn-hair znm-lrule" data-shape="rect"></div>
  <p class="zn-note znm-sub" data-merge="hero" data-anim="rise">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="zn-vr znm-vr0" data-shape="rect"></div>
  <div class="zn-vr znm-vr1" data-shape="rect"></div>
  <div class="zn-vr znm-vr2" data-shape="rect"></div>
  <div class="zn-hair znm-hair" data-shape="rect" style="top: 292px;"></div>
  <div class="zn-hair znm-hair" data-shape="rect" style="top: 400px;"></div>
  <div class="zn-hair znm-hair" data-shape="rect" style="top: 508px;"></div>
  <div class="zn-tint znm-cur" data-shape="rect"></div>
  <div class="zn-dot znm-dot" data-shape="ellipse" data-anim="pop"></div>
  <p class="zn-num znm-let znm-c1" style="top: 196px;">A</p>
  <p class="zn-note znm-grp znm-c1g" style="top: 196px;">编辑排印</p>
  <h3 class="zn-mincho-r znm-name znm-c1" style="top: 236px;">杂志 · 暖纸</h3>
  <p class="zn-num znm-let znm-c2" style="top: 196px;">B</p>
  <p class="zn-note znm-grp znm-c2g" style="top: 196px;">商务理性</p>
  <h3 class="zn-mincho-r znm-name znm-c2" style="top: 236px;">瑞士 · 网格</h3>
  <p class="zn-num znm-let znm-c3" style="top: 196px;">C</p>
  <p class="zn-note znm-grp znm-c3g" style="top: 196px;">舞台冲击</p>
  <h3 class="zn-mincho-r znm-name znm-c3" style="top: 236px;">发布会 · 暗场</h3>
  <p class="zn-num znm-let znm-c1" style="top: 304px;">D</p>
  <p class="zn-note znm-grp znm-c1g" style="top: 304px;">编辑排印</p>
  <h3 class="zn-mincho-r znm-name znm-c1" style="top: 344px;">报刊 · 版面</h3>
  <p class="zn-num znm-let znm-c2" style="top: 304px;">E</p>
  <p class="zn-note znm-grp znm-c2g" style="top: 304px;">舞台冲击</p>
  <h3 class="zn-mincho-r znm-name znm-c2" style="top: 344px;">大字报 · 粗野</h3>
  <p class="zn-num znm-let znm-c3" style="top: 304px;">F</p>
  <p class="zn-note znm-grp znm-c3g" style="top: 304px;">商务理性</p>
  <h3 class="zn-mincho-r znm-name znm-c3" style="top: 344px;">柔和 · 产品</h3>
  <p class="zn-num znm-let znm-c1" style="top: 416px;">G</p>
  <p class="zn-note znm-grp znm-c1g" style="top: 416px;">影像叙事</p>
  <h3 class="zn-mincho-r znm-name znm-c1" style="top: 456px;">摄影集 · 画册</h3>
  <p class="zn-num znm-let znm-c2" style="top: 416px;">H</p>
  <p class="zn-note znm-grp znm-c2g" style="top: 416px;">商务理性</p>
  <h3 class="zn-mincho-r znm-name znm-c2" style="top: 456px;">咨询 · 白皮书</h3>
  <p class="zn-num zn-ac znm-let znm-c3" style="top: 416px;">I</p>
  <p class="zn-note znm-grp znm-c3g" style="top: 416px;">东方人文</p>
  <h3 class="zn-mincho-r znm-name znm-c3" style="top: 456px;">日式 · 极简</h3>
  <p class="zn-num znm-let znm-c1" style="top: 524px;">J</p>
  <p class="zn-note znm-grp znm-c1g" style="top: 524px;">影像叙事</p>
  <h3 class="zn-mincho-r znm-name znm-c1" style="top: 564px;">拼贴 · 手账</h3>
  <p class="zn-num znm-let znm-c2" style="top: 524px;">K</p>
  <p class="zn-note znm-grp znm-c2g" style="top: 524px;">东方人文</p>
  <h3 class="zn-mincho-r znm-name znm-c2" style="top: 564px;">新中式 · 东方</h3>
  <p class="zn-num znm-let znm-c3" style="top: 524px;">L</p>
  <p class="zn-note znm-grp znm-c3g" style="top: 524px;">商务理性</p>
  <h3 class="zn-mincho-r znm-name znm-c3" style="top: 564px;">工程制图</h3>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：docs/superpowers/specs/2026-10-08-style-library-design.md §2</p>
  <p class="zn-num zn-pageno">05 / 17</p>
</section>
```

## zen/compare · compare

双栏安静对照页。中轴 1px 竖线左右分立；左栏素纸静置旧方案，右栏以极浅和纸托底配单粒朱砂圆点标出新方案，底部用 104px 极细 Inter 大数字并置对比。

```html
<section class="slide" data-layout="zen/compare" data-role="compare">
  <p class="zn-label zn-kicker">风格库 · 架构对照</p>
  <p class="zn-num zn-top-r">BEFORE / NOW</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">换皮，不如换版面。</h2>
  <div class="zn-hair zn-hrule" data-shape="rect"></div>
  <div class="zn-vr znv-vr" data-shape="rect"></div>
  <div class="zn-tint znv-mat" data-shape="rect"></div>
  <div class="zn-dot znv-dot" data-shape="ellipse" data-anim="pop"></div>
  <p class="zn-label znv-tag-l">之前 · 旧架构</p>
  <p class="zn-label zn-ink-t znv-tag-r">现在 · 风格库</p>
  <h3 class="zn-mincho-r znv-h znv-l" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="zn-note znv-p znv-l" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <div class="zn-hair znv-rule znv-l" data-shape="rect"></div>
  <p class="zn-ul zn-muted znv-num znv-l" data-anim="count">24</p>
  <p class="zn-mincho-r znv-nl znv-nll" data-merge="ln" data-anim="rise">个版式，三套系统共用</p>
  <p class="zn-note znv-sub znv-nll" data-merge="ln" data-anim="rise">结构同构，仅靠配色与字体区分</p>
  <h3 class="zn-mincho-r znv-h znv-r" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="zn-body znv-p znv-r" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <div class="zn-hair znv-rule znv-r" data-shape="rect"></div>
  <p class="zn-ul znv-num znv-r" data-anim="count">12</p>
  <p class="zn-mincho-r znv-nl znv-nlr" data-merge="rn" data-anim="rise">种风格，各有一套版式</p>
  <p class="zn-note znv-sub znv-nlr" data-merge="rn" data-anim="rise">角色层解耦，每种风格各自成篇</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="zn-num zn-pageno">06 / 17</p>
</section>
```

## zen/image-text · image-text

画册图文三栏页。左 5:4 静物构图（510×408）与图注；中栏两段轻细正文与导出原语简注；最右侧以 1px 竖线隔出两行纯中文竖排主标题与单粒朱砂圆点。

```html
<section class="slide" data-layout="zen/image-text" data-role="image-text">
  <img class="zn-photo zni-img" src="assets/img/07-feature.jpg" alt="示意图：和纸光影与建筑立面空间">
  <p class="zn-note zni-cap">图 02 · 示意图 — 浏览器排布与原生导出坐标映射</p>
  <div class="zn-vr zni-vr1" data-shape="rect"></div>
  <p class="zn-label zni-kicker">测量与导出</p>
  <p class="zn-body zni-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="zn-body zni-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="zn-hair zni-rule" data-shape="rect"></div>
  <p class="zn-note zni-spec">原生形状 · 旋转 · 竖排 · 文本始终可编辑</p>
  <div class="zn-vr zni-vr2" data-shape="rect"></div>
  <h2 class="zn-mincho zn-vt zni-vt1" data-anim="rise">所见即所得，</h2>
  <h2 class="zn-mincho zn-vt zni-vt2" data-anim="rise">靠的是测量。</h2>
  <div class="zn-dot zni-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs</p>
  <p class="zn-num zn-pageno">07 / 17</p>
</section>
```

## zen/image · image

墨炭暗版展陈大图页（`is-dark`）。上方宽幅窗影画面（1088×435，5:2 占比超过 50%）；下方左侧朱砂圆点引出 38px 极细宋体标题与副题，1px 竖线隔出右侧图注与出处。

```html
<section class="slide is-dark" data-layout="zen/image" data-role="image">
  <img class="zn-photo znf-img" src="assets/img/08-image.jpg" alt="示意图：静室窗影与斜落日光">
  <div class="zn-dot znf-dot" data-shape="ellipse" data-anim="pop"></div>
  <h2 class="zn-mincho znf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="zn-note znf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <div class="zn-vr znf-vr" data-shape="rect"></div>
  <p class="zn-label znf-cap">图 03 · 示意图</p>
  <p class="zn-note znf-src">出处：SKILL.md 第 1 步 Q2（选风格在填内容之前）</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-label zn-foot">日式 · 极简 · 影像</p>
  <p class="zn-num zn-pageno">08 / 17</p>
</section>
```

## zen/points · points

三栏要点页。标题下由单粒朱砂圆点引出通栏 1px 丝线；三栏以 1px 竖线隔开，每栏包含 72px 极细 Inter 序号、宋体小标题、短细线、轻细正文与底部要点提示。

```html
<section class="slide" data-layout="zen/points" data-role="points">
  <p class="zn-label zn-kicker">测量与导出 · 要点</p>
  <p class="zn-num zn-top-r">THREE PILLARS</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">三件事，件件可验证。</h2>
  <div class="zn-dot znt-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair znt-rule" data-shape="rect" data-anim="draw"></div>
  <div class="zn-vr znt-vr1" data-shape="rect"></div>
  <div class="zn-vr znt-vr2" data-shape="rect"></div>
  <p class="zn-ul znt-num znt-c1" data-anim="rise">01</p>
  <h3 class="zn-mincho-r znt-h znt-c1" data-merge="p1" data-anim="rise">浏览器里演示</h3>
  <div class="zn-hair znt-short znt-c1" data-shape="rect"></div>
  <p class="zn-body znt-p znt-c1" data-merge="p1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <p class="zn-latin znt-cue znt-c1">F 全屏 · S 演讲者控制台</p>
  <p class="zn-ul znt-num znt-c2" data-anim="rise">02</p>
  <h3 class="zn-mincho-r znt-h znt-c2" data-merge="p2" data-anim="rise">可编辑的 PPTX</h3>
  <div class="zn-hair znt-short znt-c2" data-shape="rect"></div>
  <p class="zn-body znt-p znt-c2" data-merge="p2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <p class="zn-latin znt-cue znt-c2">原生文本框 · 原生形状</p>
  <p class="zn-ul znt-num znt-c3" data-anim="rise">03</p>
  <h3 class="zn-mincho-r znt-h znt-c3" data-merge="p3" data-anim="rise">机器先把关</h3>
  <div class="zn-hair znt-short znt-c3" data-shape="rect"></div>
  <p class="zn-body znt-p znt-c3" data-merge="p3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <p class="zn-latin znt-cue znt-c3">R1–R16 · 错误清零</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：SKILL.md 第 6、8 步</p>
  <p class="zn-num zn-pageno">09 / 17</p>
</section>
```

## zen/kpi · kpi

日式极简大数字页。左上两行极细宋体标题与单粒朱砂圆点，留出舒展留白；下方三枚 118px Inter Ultra-Light 200 大数字静置在一条通栏 1px 丝线之上，丝线之下承接宽字距指标名与说明；页脚出处挂 `data-source`。

```html
<section class="slide" data-layout="zen/kpi" data-role="kpi">
  <h2 class="zn-mincho znk-t1" data-merge="title" data-anim="rise">导出之前，</h2>
  <h2 class="zn-mincho znk-t2" data-merge="title" data-anim="rise">先过十六道检查。</h2>
  <p class="zn-label znk-kicker">质量门 · 核心指标</p>
  <div class="zn-dot znk-dot" data-shape="ellipse" data-anim="pop"></div>
  <p class="zn-ul znk-num znk-c1" data-anim="count">16</p>
  <p class="zn-ul znk-num znk-c2" data-anim="count">20</p>
  <p class="zn-ul znk-num znk-c3" data-anim="count">3</p>
  <div class="zn-hair znk-hair" data-shape="rect" data-anim="draw"></div>
  <h3 class="zn-mincho-r znk-lbl znk-c1" data-merge="k1" data-anim="rise">条校验规则</h3>
  <p class="zn-note znk-desc znk-c1" data-merge="k1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <h3 class="zn-mincho-r znk-lbl znk-c2" data-merge="k2" data-anim="rise">页面角色</h3>
  <p class="zn-note znk-desc znk-c2" data-merge="k2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <h3 class="zn-mincho-r znk-lbl znk-c3" data-merge="k3" data-anim="rise">导出格式</h3>
  <p class="zn-note znk-desc znk-c3" data-merge="k3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot" data-source>来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="zn-num zn-pageno">10 / 17</p>
</section>
```

## zen/bars · bars

极细横条统计图页。左栏 6 行 12px 纤细条形（按 `data-value` 严格等比，最大 `480px`），类别标签与数值挂 `data-chart` 以支持 `--native-charts` 原生图表替换，末项「导出一致」轻点朱砂；1px 竖线右侧列出对应规则编号；页脚挂 `data-source`。

```html
<section class="slide" data-layout="zen/bars" data-role="bars">
  <p class="zn-label zn-kicker">质量门 · 规则分布</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">十六条规则，各管一摊。</h2>
  <p class="zn-note znb-unit">各类校验规则条数（单位：条）</p>
  <div class="zn-dot znb-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair znb-rule" data-shape="rect" data-anim="draw"></div>
  <div class="zn-vr znb-vr" data-shape="rect"></div>
  <p class="zn-label znb-rh">对应规则编号</p>
  <div class="zn-hair znb-srule" data-shape="rect"></div>
  <h3 class="zn-mincho-r znb-label" style="top: 238px;" data-chart>排版与几何</h3>
  <div class="zn-ink znb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 245px; width: 480px;"></div>
  <p class="zn-ul znb-val" style="top: 236px; left: 774px;" data-chart>4</p>
  <p class="zn-latin znb-ids" style="top: 240px;">R3 · R4 · R7 · R9</p>
  <h3 class="zn-mincho-r znb-label" style="top: 300px;" data-chart>版式与样式</h3>
  <div class="zn-ink znb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 307px; width: 480px;"></div>
  <p class="zn-ul znb-val" style="top: 298px; left: 774px;" data-chart>4</p>
  <p class="zn-latin znb-ids" style="top: 302px;">R1 · R2 · R6 · R12</p>
  <h3 class="zn-mincho-r znb-label" style="top: 362px;" data-chart>内容与数据</h3>
  <div class="zn-ink znb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 369px; width: 360px;"></div>
  <p class="zn-ul znb-val" style="top: 360px; left: 654px;" data-chart>3</p>
  <p class="zn-latin znb-ids" style="top: 364px;">R5 · R8 · R14</p>
  <h3 class="zn-mincho-r znb-label" style="top: 424px;" data-chart>可访问与媒体</h3>
  <div class="zn-ink znb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 431px; width: 360px;"></div>
  <p class="zn-ul znb-val" style="top: 422px; left: 654px;" data-chart>3</p>
  <p class="zn-latin znb-ids" style="top: 426px;">R10 · R11 · R13</p>
  <h3 class="zn-mincho-r znb-label" style="top: 486px;" data-chart>节奏</h3>
  <div class="zn-ink znb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 493px; width: 120px;"></div>
  <p class="zn-ul znb-val" style="top: 484px; left: 414px;" data-chart>1</p>
  <p class="zn-latin znb-ids" style="top: 488px;">R15</p>
  <h3 class="zn-mincho-r znb-label" style="top: 548px;" data-chart>导出一致</h3>
  <div class="zn-red znb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 555px; width: 120px;"></div>
  <p class="zn-ul zn-ac znb-val" style="top: 546px; left: 414px;" data-chart>1</p>
  <p class="zn-latin znb-ids" style="top: 550px;">R16</p>
  <p class="zn-note znb-sum">共 16 条规则 · 错误清零方可交付</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot" data-source>来源：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="zn-num zn-pageno">11 / 17</p>
</section>
```

## zen/table · table

无竖框细线规格表页。浅和纸托底表头 + 六行纯水平 1px 丝线分隔（项目 / 规格 / 出处），不堆砌重色块，保持阅读如翻阅美术馆图录参数页；页脚挂 `data-source`。

```html
<section class="slide" data-layout="zen/table" data-role="table">
  <p class="zn-label zn-kicker">质量门 · 规格一览</p>
  <p class="zn-num zn-top-r">SPECIFICATION</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">一页纸，看懂规格。</h2>
  <div class="zn-dot znd-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair znd-rule" data-shape="rect" data-anim="draw"></div>
  <div class="zn-tint znd-head" data-shape="rect"></div>
  <p class="zn-label zn-ink-t znd-k znd-th">项目</p>
  <p class="zn-label zn-ink-t znd-v znd-th">规格</p>
  <p class="zn-label zn-ink-t znd-s znd-th">出处</p>
  <div class="zn-hair znd-hr" data-shape="rect" style="top: 294px;"></div>
  <div class="zn-hair znd-hr" data-shape="rect" style="top: 358px;"></div>
  <div class="zn-hair znd-hr" data-shape="rect" style="top: 422px;"></div>
  <div class="zn-hair znd-hr" data-shape="rect" style="top: 486px;"></div>
  <div class="zn-hair znd-hr" data-shape="rect" style="top: 550px;"></div>
  <div class="zn-hair znd-hr" data-shape="rect" style="top: 614px;"></div>
  <h3 class="zn-mincho-r znd-k" style="top: 248px;">画布</h3>
  <p class="zn-body znd-v" style="top: 248px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="zn-latin znd-s" style="top: 250px;">assets/base.css</p>
  <h3 class="zn-mincho-r znd-k" style="top: 312px;">字号下限</h3>
  <p class="zn-body znd-v" style="top: 312px;">16 px，溢出先删字、再换版式</p>
  <p class="zn-latin znd-s" style="top: 314px;">validate.mjs · R4</p>
  <h3 class="zn-mincho-r znd-k" style="top: 376px;">校验规则</h3>
  <p class="zn-body znd-v" style="top: 376px;">R1–R16，<span class="is-accent">错误清零</span>才能交付</p>
  <p class="zn-latin znd-s" style="top: 378px;">validate.mjs</p>
  <h3 class="zn-mincho-r znd-k" style="top: 440px;">导出格式</h3>
  <p class="zn-body znd-v" style="top: 440px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="zn-latin znd-s" style="top: 442px;">SKILL.md</p>
  <h3 class="zn-mincho-r znd-k" style="top: 504px;">页面角色</h3>
  <p class="zn-body znd-v" style="top: 504px;">20 个，其中 12 个核心角色</p>
  <p class="zn-latin znd-s" style="top: 506px;">lib/roles.mjs</p>
  <h3 class="zn-mincho-r znd-k" style="top: 568px;">字体</h3>
  <p class="zn-body znd-v" style="top: 568px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="zn-latin znd-s" style="top: 570px;">fetch-fonts.mjs</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot" data-source>来源：表内「出处」列（本仓库文件）</p>
  <p class="zn-num zn-pageno">12 / 17</p>
</section>
```

## zen/process · process

竖排四步流程页。最右侧纯中文竖排标题与单粒朱砂圆点，1px 竖线隔开；左侧四列依次展开 01–04，每列以极细 Inter 序号起头、纯中文竖排步骤名居中呼吸、1px 短横线收束横排正文说明（含拉丁缩写保持横排）。

```html
<section class="slide" data-layout="zen/process" data-role="process">
  <p class="zn-label zn-kicker">工作流 · 四步成稿</p>
  <h2 class="zn-mincho zn-vt znp-vt" data-anim="rise">从大纲到成稿，四步</h2>
  <div class="zn-dot znp-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-vr znp-vr0" data-shape="rect"></div>
  <div class="zn-vr znp-vr1" data-shape="rect"></div>
  <div class="zn-vr znp-vr2" data-shape="rect"></div>
  <div class="zn-vr znp-vr3" data-shape="rect"></div>
  <p class="zn-ul znp-num znp-c1" data-anim="rise">01</p>
  <h3 class="zn-mincho zn-vt znp-name znp-n1" data-anim="rise">选风格</h3>
  <div class="zn-hair znp-hrule znp-c1" data-shape="rect"></div>
  <p class="zn-body znp-p znp-c1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="zn-ul znp-num znp-c2" data-anim="rise">02</p>
  <h3 class="zn-mincho zn-vt znp-name znp-n2" data-anim="rise">填版式</h3>
  <div class="zn-hair znp-hrule znp-c2" data-shape="rect"></div>
  <p class="zn-body znp-p znp-c2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="zn-ul znp-num znp-c3" data-anim="rise">03</p>
  <h3 class="zn-mincho zn-vt znp-name znp-n3" data-anim="rise">过校验</h3>
  <div class="zn-hair znp-hrule znp-c3" data-shape="rect"></div>
  <p class="zn-body znp-p znp-c3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="zn-ul znp-num znp-c4" data-anim="rise">04</p>
  <h3 class="zn-mincho zn-vt znp-name znp-n4" data-anim="rise">导出</h3>
  <div class="zn-hair znp-hrule znp-c4" data-shape="rect"></div>
  <p class="zn-body znp-p znp-c4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：SKILL.md 工作流</p>
  <p class="zn-num zn-pageno">13 / 17</p>
</section>
```

## zen/timeline · timeline

水平细丝时间线页。通栏 1px 丝线横贯画面，上方 5 枚极细 Inter 日期，线上前四点为细炭墨小圆点、最末里程碑落全页唯一朱砂圆点，丝线下方 5 列细线分栏承接节点标题与说明。

```html
<section class="slide" data-layout="zen/timeline" data-role="timeline">
  <p class="zn-label zn-kicker">工作流 · 版本编年</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">从一套版式，到一座风格库。</h2>
  <p class="zn-num znl-span">2026 · 07.16 — 10.08</p>
  <div class="zn-hair znl-spine" data-shape="rect" data-anim="draw"></div>
  <div class="zn-vr znl-vr znl-v1" data-shape="rect"></div>
  <div class="zn-vr znl-vr znl-v2" data-shape="rect"></div>
  <div class="zn-vr znl-vr znl-v3" data-shape="rect"></div>
  <div class="zn-vr znl-vr znl-v4" data-shape="rect"></div>
  <p class="zn-latin znl-yr znl-c1">2026 · 01</p>
  <p class="zn-ul znl-date znl-c1" data-anim="rise">07.16</p>
  <div class="zn-dot-sm znl-nd znl-c1" data-shape="ellipse" data-anim="pop"></div>
  <h3 class="zn-mincho-r znl-h znl-c1" data-merge="t1" data-anim="rise">首版发布</h3>
  <p class="zn-note znl-p znl-c1" data-merge="t1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <p class="zn-latin znl-yr znl-c2">2026 · 02</p>
  <p class="zn-ul znl-date znl-c2" data-anim="rise">07.18</p>
  <div class="zn-dot-sm znl-nd znl-c2" data-shape="ellipse" data-anim="pop"></div>
  <h3 class="zn-mincho-r znl-h znl-c2" data-merge="t2" data-anim="rise">墨韵衬线</h3>
  <p class="zn-note znl-p znl-c2" data-merge="t2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <p class="zn-latin znl-yr znl-c3">2026 · 03</p>
  <p class="zn-ul znl-date znl-c3" data-anim="rise">08.17</p>
  <div class="zn-dot-sm znl-nd znl-c3" data-shape="ellipse" data-anim="pop"></div>
  <h3 class="zn-mincho-r znl-h znl-c3" data-merge="t3" data-anim="rise">校验全覆盖</h3>
  <p class="zn-note znl-p znl-c3" data-merge="t3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <p class="zn-latin znl-yr znl-c4">2026 · 04</p>
  <p class="zn-ul znl-date znl-c4" data-anim="rise">08.18</p>
  <div class="zn-dot-sm znl-nd znl-c4" data-shape="ellipse" data-anim="pop"></div>
  <h3 class="zn-mincho-r znl-h znl-c4" data-merge="t4" data-anim="rise">瑞士国际</h3>
  <p class="zn-note znl-p znl-c4" data-merge="t4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <p class="zn-latin znl-yr znl-c5">2026 · 05</p>
  <p class="zn-ul znl-date znl-c5" data-anim="rise">10.08</p>
  <div class="zn-dot-lg znl-nd5 znl-c5" data-shape="ellipse" data-anim="pop"></div>
  <h3 class="zn-mincho-r znl-h znl-c5" data-merge="t5" data-anim="rise">风格库</h3>
  <p class="zn-note znl-p znl-c5" data-merge="t5" data-anim="rise">十二种风格，版式独立。</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：git log（2026-07-16 → 2026-10-08）</p>
  <p class="zn-num zn-pageno">14 / 17</p>
</section>
```

## zen/cycle · cycle

墨炭暗版禅圆闭环页（`is-dark`）。左侧 1px 细圆环托起四枚圆节点，顶节点上方落单粒朱砂圆点示意起点；1px 竖线隔开右侧四行修订步骤与闭环回指提示。

```html
<section class="slide is-dark" data-layout="zen/cycle" data-role="cycle">
  <p class="zn-label zn-kicker">工作流 · 闭环机制</p>
  <p class="zn-num zn-top-r">FEEDBACK LOOP</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">每次改动，都绕这一圈</h2>
  <div class="zn-hair zn-hrule" data-shape="rect"></div>
  <div class="zny-ring" data-shape="ellipse" data-anim="fade"></div>
  <div class="zn-dot zny-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zny-node zny-n1" data-shape="ellipse" data-anim="ring"></div>
  <div class="zny-node zny-n2" data-shape="ellipse" data-anim="ring"></div>
  <div class="zny-node zny-n3" data-shape="ellipse" data-anim="ring"></div>
  <div class="zny-node zny-n4" data-shape="ellipse" data-anim="ring"></div>
  <p class="zn-num zny-k" style="left: 294px; top: 229px;">01</p>
  <p class="zn-num zny-k" style="left: 454px; top: 389px;">02</p>
  <p class="zn-num zny-k" style="left: 294px; top: 549px;">03</p>
  <p class="zn-num zny-k" style="left: 134px; top: 389px;">04</p>
  <p class="zn-ul zny-core" data-anim="count">4</p>
  <p class="zn-label zny-core-l">步 · 一圈</p>
  <div class="zn-vr zny-vr" data-shape="rect"></div>
  <p class="zn-label zny-rh">修订与基线回路</p>
  <p class="zn-ul zny-n" style="top: 244px;">01</p>
  <h3 class="zn-mincho-r zny-h" style="top: 242px;" data-anim="rise">改版式</h3>
  <p class="zn-note zny-d" style="top: 246px;">调整版式结构与几何参数</p>
  <div class="zn-hair zny-hair" data-shape="rect" style="top: 304px;"></div>
  <p class="zn-ul zny-n" style="top: 328px;">02</p>
  <h3 class="zn-mincho-r zny-h" style="top: 326px;" data-anim="rise">过校验</h3>
  <p class="zn-note zny-d" style="top: 330px;">十六条机器规则错误清零</p>
  <div class="zn-hair zny-hair" data-shape="rect" style="top: 388px;"></div>
  <p class="zn-ul zny-n" style="top: 412px;">03</p>
  <h3 class="zn-mincho-r zny-h" style="top: 410px;" data-anim="rise">渲染比对</h3>
  <p class="zn-note zny-d" style="top: 414px;">逐页出图并与基线目检比对</p>
  <div class="zn-hair zny-hair" data-shape="rect" style="top: 472px;"></div>
  <p class="zn-ul zny-n" style="top: 496px;">04</p>
  <h3 class="zn-mincho-r zny-h" style="top: 494px;" data-anim="rise">记基线</h3>
  <p class="zn-note zny-d" style="top: 498px;">归档通过检验的黄金参考帧</p>
  <div class="zn-hair zny-hair" data-shape="rect" style="top: 556px;"></div>
  <p class="zn-note zn-ac zny-back">→ 回到 01 改版式</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：scripts/baseline.mjs（基线前先过 check-style 与 validate）</p>
  <p class="zn-num zn-pageno">15 / 17</p>
</section>
```

## zen/system · system

嵌套木匣式三层架构页。左侧三层 1px 细框嵌套矩形（`base.css` → `style.css` → `brand.css`），最内层核点落单粒朱砂圆点；1px 竖线右侧按外 / 中 / 内三层拆解职责。

```html
<section class="slide" data-layout="zen/system" data-role="system">
  <p class="zn-label zn-kicker">工作流 · 样式体系</p>
  <p class="zn-num zn-top-r">THREE LAYERS</p>
  <h2 class="zn-mincho zn-title" data-anim="rise">三层样式，各管一层</h2>
  <div class="zn-hair zn-hrule" data-shape="rect"></div>
  <div class="znz-p1" data-shape="rect" data-anim="scale"></div>
  <div class="znz-p2" data-shape="rect" data-anim="scale"></div>
  <div class="znz-p3" data-shape="rect" data-anim="scale"></div>
  <div class="zn-dot znz-dot" data-shape="ellipse" data-anim="pop"></div>
  <p class="zn-latin znz-l1">base.css</p>
  <p class="zn-latin znz-l2">style.css</p>
  <p class="zn-latin zn-ink-t znz-l3">brand.css</p>
  <div class="zn-vr znz-vr" data-shape="rect"></div>
  <p class="zn-label znz-tag" style="top: 198px;" data-merge="o" data-anim="rise">外层 · 公共底座</p>
  <h3 class="zn-mincho-r znz-h" style="top: 230px;" data-merge="o" data-anim="rise">base.css</h3>
  <p class="zn-body znz-p" style="top: 274px;" data-merge="o" data-anim="rise">画布、元素契约、形状原语</p>
  <div class="zn-hair znz-hair" data-shape="rect" style="top: 326px;"></div>
  <p class="zn-label znz-tag" style="top: 344px;" data-merge="m" data-anim="rise">中层 · 风格包</p>
  <h3 class="zn-mincho-r znz-h" style="top: 376px;" data-merge="m" data-anim="rise">style.css</h3>
  <p class="zn-body znz-p" style="top: 420px;" data-merge="m" data-anim="rise">风格的 token、字体与全部版式</p>
  <div class="zn-hair znz-hair" data-shape="rect" style="top: 472px;"></div>
  <p class="zn-label znz-tag" style="top: 490px;" data-merge="i" data-anim="rise">内层 · 品牌覆写</p>
  <h3 class="zn-mincho-r znz-h" style="top: 522px;" data-merge="i" data-anim="rise">brand.css</h3>
  <p class="zn-body znz-p" style="top: 566px;" data-merge="i" data-anim="rise">只改 token 的品牌色</p>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-latin zn-foot">来源：风格库 spec §3.1</p>
  <p class="zn-num zn-pageno">16 / 17</p>
</section>
```

## zen/closing · closing

墨炭暗版竖排封底（`is-dark`）。左侧陈列新建命令框、画廊地址与版本落款；1px 竖线隔开右侧两行 52px 纯中文竖排结语，尾字下方落全页唯一朱砂圆点。

```html
<section class="slide is-dark" data-layout="zen/closing" data-role="closing">
  <p class="zn-label zne-kicker">风格 I · 日式 · 极简</p>
  <p class="zn-label zne-lbl">新建 DECK 命令</p>
  <div class="zne-box" data-shape="rect"></div>
  <p class="zn-latin zne-cmd">node scripts/new-deck.mjs my-deck --style zen</p>
  <p class="zn-note zne-p">风格画廊：docs/styles/index.html</p>
  <div class="zn-hair zne-rule" data-shape="rect"></div>
  <p class="zn-mincho-r zne-ch" data-merge="colophon">东方人文 · 留白、细明朝与竖排</p>
  <p class="zn-note zne-c1" data-merge="colophon">推荐场合：品牌 · 文化 · 设计分享</p>
  <p class="zn-note zne-c2" data-merge="colophon">字体：思源宋体 Light / Regular · Inter · 思源黑体</p>
  <div class="zn-vr zne-vr" data-shape="rect"></div>
  <h2 class="zn-mincho zn-vt zne-vt1" data-anim="rise">挑一种风格，</h2>
  <h2 class="zn-mincho zn-vt zne-vt2" data-anim="rise">开始下一份。</h2>
  <div class="zn-dot-lg zne-dot" data-shape="ellipse" data-anim="pop"></div>
  <div class="zn-hair zn-fhair" data-shape="rect"></div>
  <p class="zn-label zne-foot">ZIFEIYU PPT SKILL · 风格 I 日式 · 极简</p>
  <p class="zn-num zn-pageno">17 / 17</p>
</section>
```
