# 新中式 · 东方（oriental）版式注册表

> 状态：ready · 17 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / cycle / system。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/oriental/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **四周双边书框**：除全幅影像页（`image`）外，每页以两层嵌套 `[data-shape="rect"]`（`or-frame-o` 距画布 30/26px，`or-frame-i` 内缩 6px）构成透明四边均匀细双框，无祥云回纹，原生导出为 PowerPoint 矢量矩形边框（R16）。封面页左侧影像满幅出血，右侧书框自 `x: 542px` 起。
2. **竖排极粗宋体与纯汉字约定**：`cover` / `section` / `statement` / `closing` 以 `or-vt`（`writing-mode: vertical-rl; text-orientation: mixed`）排布极粗思源宋体竖题。所有竖排槽位均限定纯汉字及全角中文标点，确保浏览器排版与 PowerPoint `eaVert` 严格对齐；每个竖列独立成块，不跨列挂 `data-merge`。
3. **朱砂印章（方印与圆印）**：印章由底层 `[data-shape="rect"]`（`or-seal` / `or-seal-ink`，4px 圆角）或 `[data-shape="ellipse"]`（`orp-circ`）叠加独立居中霞鹜文楷文字 `<p class="or-seal-tx">` / `<p class="or-seal-vt">` 组成，文字槽位自身不带背景、描边与内边距（R16）。
4. **宣纸与墨漆双态节奏**：默认暖宣纸浅底（`#f2ece0`）配松烟墨（`#1d1d1b`）、绢丝灰（`#e7dfd0`）与朱砂红（`#b83a2b`）；`statement` / `image` / `cycle` / `closing` 挂 `slide is-dark` 翻转为墨漆暗卷（`#1b1a18`，朱砂提亮为 `#d95544`），与出血图页共同维持整份 deck 的明暗节奏（R15）。
5. **字体分工与雅致去饱和影像**：主标题、竖题与大数字用思源宋体 Heavy 900（`or-heavy` / `or-num`），小标题与表项用思源宋体 Bold 700（`or-serif`），题注、栏眉、页码（大写中文 `壹 / 拾柒`）与印文用霞鹜文楷（`or-kai` / `or-seal-tx`），正文与命令走思源黑体（`or-body` / `or-sans`）；所有照片统挂 `or-photo`（`saturate(0.55) sepia(0.12)`），导出 PPTX 时自动离屏烘焙。
6. **文字与容器分离**：所有 `h1 / h2 / h3 / p` 均无 fill / border / shadow / padding（R16），细双线（`or-r1` + `or-r1s`）、竖分栏线（`or-vr` / `or-vr-ac`）与绢丝底块（`or-tint`）全部由 `[data-shape="rect"]` 承担。

## oriental/cover · cover

左幅去饱和山水卷轴（512×720）+ 右幅四周双边宣纸书页：远右两列竖排极粗宋体大题（纯汉字）配 2×2 朱砂四字方印，竖线左侧排布朱砂题签、简述与卷尾落款。

```html
<section class="slide" data-layout="oriental/cover" data-role="cover">
  <img class="or-photo orc-img" src="assets/img/01-cover.jpg" alt="示意图：宣纸暖调与远山薄雾构成的竖幅山水意象">
  <div class="orc-frame-o" data-shape="rect"></div>
  <div class="orc-frame-i" data-shape="rect"></div>
  <div class="or-r1 orc-ta" data-shape="rect"></div>
  <div class="or-r1s orc-tb" data-shape="rect"></div>
  <h1 class="or-heavy or-vt orc-t1" data-anim="rise">一份源文件</h1>
  <h2 class="or-heavy or-vt orc-t2" data-anim="rise">三种交付</h2>
  <div class="or-seal orc-seal" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-vt orc-seal-r">一源</p>
  <p class="or-seal-vt orc-seal-l">三出</p>
  <div class="or-vr orc-vr" data-shape="rect"></div>
  <p class="or-kai orc-tag" data-merge="lead">网页 PPT · 可编辑导出</p>
  <div class="or-red orc-bar" data-shape="rect" data-anim="draw"></div>
  <p class="or-sans orc-desc" data-merge="lead" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <p class="or-kai orc-cap">图 01 · 示意图</p>
  <p class="or-kai orc-colophon">风格 K · 新中式 · 东方</p>
  <div class="or-r1 orc-ba" data-shape="rect"></div>
  <div class="or-r1s orc-bb" data-shape="rect"></div>
  <p class="or-kai orc-page">卷首 · 壹 / 拾柒</p>
</section>
```

## oriental/agenda · agenda

卷目总览。四周双边书框 + 细双线天头；左栏窗影配图（340×316）配图注与总括说明，1px 竖线分隔；右栏四行「方印大写序数 / 宋体编号 / 章节名与说明 / 汉字页次」，首章用朱砂印标亮。

```html
<section class="slide" data-layout="oriental/agenda" data-role="agenda">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷目 · 总览</p>
  <p class="or-kai or-mark">新中式 · 东方</p>
  <h2 class="or-heavy or-title" data-anim="rise">目 录</h2>
  <p class="or-kai or-sub">全卷四章十七页 · 提纲挈领</p>
  <div class="or-r1 or-drule-a" data-shape="rect"></div>
  <div class="or-r1s or-drule-b" data-shape="rect"></div>
  <img class="or-photo ora-img" src="assets/img/02-agenda.jpg" alt="示意图：宣纸窗影落在素墙与地面的静谧构图">
  <p class="or-kai ora-cap">图 02 · 示意图</p>
  <p class="or-note ora-note">全卷分风格库、测量与导出、质量门与工作流四章，逐页依角色落版。</p>
  <div class="or-vr ora-vr" data-shape="rect"></div>
  <div class="or-seal ora-seal" data-shape="rect" style="top: 222px;"></div>
  <p class="or-seal-tx ora-seal-tx" style="top: 232px;">壹</p>
  <p class="or-num or-ac ora-num" style="top: 222px;" data-anim="rise">01</p>
  <h3 class="or-heavy ora-item" style="top: 218px;" data-merge="a1" data-anim="rise">风格库</h3>
  <p class="ora-desc" style="top: 256px;" data-merge="a1" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="or-kai ora-page" style="top: 228px;">第肆页</p>
  <div class="or-r1s ora-hair" data-shape="rect" style="top: 304px;"></div>
  <div class="or-seal-ink ora-seal" data-shape="rect" style="top: 324px;"></div>
  <p class="or-seal-tx ora-seal-tx" style="top: 334px;">贰</p>
  <p class="or-num ora-num" style="top: 324px;" data-anim="rise">02</p>
  <h3 class="or-heavy ora-item" style="top: 320px;" data-merge="a2" data-anim="rise">测量与导出</h3>
  <p class="ora-desc" style="top: 358px;" data-merge="a2" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="or-kai ora-page" style="top: 330px;">第柒页</p>
  <div class="or-r1s ora-hair" data-shape="rect" style="top: 406px;"></div>
  <div class="or-seal-ink ora-seal" data-shape="rect" style="top: 426px;"></div>
  <p class="or-seal-tx ora-seal-tx" style="top: 436px;">叁</p>
  <p class="or-num ora-num" style="top: 426px;" data-anim="rise">03</p>
  <h3 class="or-heavy ora-item" style="top: 422px;" data-merge="a3" data-anim="rise">质量门</h3>
  <p class="ora-desc" style="top: 460px;" data-merge="a3" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="or-kai ora-page" style="top: 432px;">第拾页</p>
  <div class="or-r1s ora-hair" data-shape="rect" style="top: 508px;"></div>
  <div class="or-seal-ink ora-seal" data-shape="rect" style="top: 528px;"></div>
  <p class="or-seal-tx ora-seal-tx" style="top: 538px;">肆</p>
  <p class="or-num ora-num" style="top: 528px;" data-anim="rise">04</p>
  <h3 class="or-heavy ora-item" style="top: 524px;" data-merge="a4" data-anim="rise">工作流</h3>
  <p class="ora-desc" style="top: 562px;" data-merge="a4" data-anim="rise">从大纲到成稿的四步</p>
  <p class="or-kai ora-page" style="top: 534px;">第拾叁页</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">ZIFEIYU PPT SKILL · 卷目总览</p>
  <p class="or-kai or-pageno">贰 / 拾柒</p>
</section>
```

## oriental/statement · statement

立意暗卷页（`is-dark`）。右侧竖排纯汉字极粗宋体题标、竖排文楷副题与朱砂方印压阵；左侧宽阔漆墨场域以朱砂短杠引出两行 62px 极粗宋体金句、细双线与出处注脚。

```html
<section class="slide is-dark" data-layout="oriental/statement" data-role="statement">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">立意 · 核心主张</p>
  <p class="or-kai or-mark">墨漆暗卷</p>
  <h3 class="or-heavy or-vt orq-vt-title" data-anim="rise">设计原则</h3>
  <p class="or-kai or-vt orq-vt-sub">核心主张</p>
  <div class="or-seal orq-seal" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-tx orq-seal-tx">源</p>
  <div class="or-vr orq-vr" data-shape="rect"></div>
  <div class="or-red orq-bar" data-shape="rect" data-anim="draw"></div>
  <h2 class="or-heavy orq-line orq-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="or-heavy orq-line orq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <div class="or-r1 orq-da" data-shape="rect"></div>
  <div class="or-r1s orq-db" data-shape="rect"></div>
  <p class="or-kai orq-by">— SKILL.md · 设计原则</p>
  <p class="or-sans orq-note">浏览器排布即终稿坐标，导出器逐项测量，交付可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">ZIFEIYU PPT SKILL · 立意</p>
  <p class="or-kai or-pageno">叁 / 拾柒</p>
</section>
```

## oriental/section · section

篇章扉页。左栏绢丝底面板承托 164px 章节号与导语；中栏列出全卷四章导航（当前章以朱砂竖条标亮）；远右独列 114px 竖排极粗宋体纯汉字章题配朱砂方印。

```html
<section class="slide" data-layout="oriental/section" data-role="section">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <div class="or-tint orx-panel" data-shape="rect"></div>
  <p class="or-kai orx-kicker">第壹章 · 篇章扉页</p>
  <p class="or-num orx-num" data-anim="rise">01</p>
  <p class="or-serif orx-chap">01 · 风格库</p>
  <div class="or-r1s orx-lrule" data-shape="rect"></div>
  <p class="or-sans orx-desc">十二种风格各有一套独立版式，按页面角色统一登记。先按场合选风格，再依内容形状落版面。</p>
  <h2 class="or-heavy or-vt orx-vt-title" data-anim="rise">风格库</h2>
  <div class="or-seal orx-seal" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-tx orx-seal-tx">壹</p>
  <div class="or-vr orx-vr" data-shape="rect"></div>
  <p class="or-kai orx-idx-hd">全卷四章 · 篇章索引</p>
  <div class="or-r1 orx-da" data-shape="rect"></div>
  <div class="or-r1s orx-db" data-shape="rect"></div>
  <div class="or-red orx-mark" data-shape="rect" style="top: 196px;"></div>
  <p class="or-num orx-n orx-now" style="top: 198px;">01</p>
  <p class="or-heavy orx-i orx-now" style="top: 196px;">风格库</p>
  <p class="or-kai orx-p orx-now" style="top: 202px;">第肆页</p>
  <div class="or-r1s orx-hair" data-shape="rect" style="top: 266px;"></div>
  <p class="or-num orx-n" style="top: 294px;">02</p>
  <p class="or-serif orx-i" style="top: 292px;">测量与导出</p>
  <p class="or-kai orx-p" style="top: 298px;">第柒页</p>
  <div class="or-r1s orx-hair" data-shape="rect" style="top: 362px;"></div>
  <p class="or-num orx-n" style="top: 390px;">03</p>
  <p class="or-serif orx-i" style="top: 388px;">质量门</p>
  <p class="or-kai orx-p" style="top: 394px;">第拾页</p>
  <div class="or-r1s orx-hair" data-shape="rect" style="top: 458px;"></div>
  <p class="or-num orx-n" style="top: 486px;">04</p>
  <p class="or-serif orx-i" style="top: 484px;">工作流</p>
  <p class="or-kai orx-p" style="top: 490px;">第拾叁页</p>
  <div class="or-r1s orx-hair" data-shape="rect" style="top: 554px;"></div>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">ZIFEIYU PPT SKILL · 第壹章 风格库</p>
  <p class="or-kai or-pageno">肆 / 拾柒</p>
</section>
```

## oriental/matrix · matrix

十二项风格谱系。左栏方印 + 136px 总数与谱系简述；右栏 3×4 细线矩阵逐格列出十二项，当前项以绢丝底块与左侧朱砂竖条高亮。

```html
<section class="slide" data-layout="oriental/matrix" data-role="matrix">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷壹 · 风格库</p>
  <p class="or-kai or-mark">风格谱系</p>
  <h2 class="or-heavy orm-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <p class="or-kai orm-deck">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <div class="or-seal orm-seal" data-shape="rect"></div>
  <p class="or-seal-tx orm-seal-tx">谱</p>
  <p class="or-kai orm-rubric">收录总数</p>
  <p class="or-num orm-hero" data-anim="count">12</p>
  <h3 class="or-heavy orm-label" data-merge="hero" data-anim="rise">种风格</h3>
  <div class="or-r1s orm-lrule" data-shape="rect"></div>
  <p class="or-body orm-sub" data-merge="hero" data-anim="rise">覆盖编辑排印、商务理性、舞台冲击、影像叙事、东方人文五大谱系，每种均具独立版式。</p>
  <div class="or-vr orm-vr orm-v0" data-shape="rect"></div>
  <div class="or-vr orm-vr orm-v1" data-shape="rect"></div>
  <div class="or-vr orm-vr orm-v2" data-shape="rect"></div>
  <div class="or-r1s orm-hair" data-shape="rect" style="top: 286px;"></div>
  <div class="or-r1s orm-hair" data-shape="rect" style="top: 392px;"></div>
  <div class="or-r1s orm-hair" data-shape="rect" style="top: 498px;"></div>
  <div class="or-tint orm-active" data-shape="rect"></div>
  <div class="or-red orm-abar" data-shape="rect"></div>
  <p class="or-num orm-let orm-c1" style="top: 192px;">A</p>
  <p class="or-kai orm-grp orm-c1g" style="top: 196px;">编辑排印</p>
  <h3 class="or-serif orm-name orm-c1" style="top: 234px;">杂志 · 暖纸</h3>
  <p class="or-num orm-let orm-c2" style="top: 192px;">B</p>
  <p class="or-kai orm-grp orm-c2g" style="top: 196px;">商务理性</p>
  <h3 class="or-serif orm-name orm-c2" style="top: 234px;">瑞士 · 网格</h3>
  <p class="or-num orm-let orm-c3" style="top: 192px;">C</p>
  <p class="or-kai orm-grp orm-c3g" style="top: 196px;">舞台冲击</p>
  <h3 class="or-serif orm-name orm-c3" style="top: 234px;">发布会 · 暗场</h3>
  <p class="or-num orm-let orm-c1" style="top: 298px;">D</p>
  <p class="or-kai orm-grp orm-c1g" style="top: 302px;">编辑排印</p>
  <h3 class="or-serif orm-name orm-c1" style="top: 340px;">报刊 · 版面</h3>
  <p class="or-num orm-let orm-c2" style="top: 298px;">E</p>
  <p class="or-kai orm-grp orm-c2g" style="top: 302px;">舞台冲击</p>
  <h3 class="or-serif orm-name orm-c2" style="top: 340px;">大字报 · 粗野</h3>
  <p class="or-num orm-let orm-c3" style="top: 298px;">F</p>
  <p class="or-kai orm-grp orm-c3g" style="top: 302px;">商务理性</p>
  <h3 class="or-serif orm-name orm-c3" style="top: 340px;">柔和 · 产品</h3>
  <p class="or-num orm-let orm-c1" style="top: 404px;">G</p>
  <p class="or-kai orm-grp orm-c1g" style="top: 408px;">影像叙事</p>
  <h3 class="or-serif orm-name orm-c1" style="top: 446px;">摄影集 · 画册</h3>
  <p class="or-num orm-let orm-c2" style="top: 404px;">H</p>
  <p class="or-kai orm-grp orm-c2g" style="top: 408px;">商务理性</p>
  <h3 class="or-serif orm-name orm-c2" style="top: 446px;">咨询 · 白皮书</h3>
  <p class="or-num orm-let orm-c3" style="top: 404px;">I</p>
  <p class="or-kai orm-grp orm-c3g" style="top: 408px;">东方人文</p>
  <h3 class="or-serif orm-name orm-c3" style="top: 446px;">日式 · 极简</h3>
  <p class="or-num orm-let orm-c1" style="top: 514px;">J</p>
  <p class="or-kai orm-grp orm-c1g" style="top: 518px;">影像叙事</p>
  <h3 class="or-serif orm-name orm-c1" style="top: 556px;">拼贴 · 手账</h3>
  <p class="or-num or-ac orm-let orm-c2" style="top: 514px;">K</p>
  <p class="or-kai or-ac orm-grp orm-c2g" style="top: 518px;">东方人文</p>
  <h3 class="or-heavy orm-name orm-c2" style="top: 556px;">新中式 · 东方</h3>
  <p class="or-num orm-let orm-c3" style="top: 514px;">L</p>
  <p class="or-kai orm-grp orm-c3g" style="top: 518px;">商务理性</p>
  <h3 class="or-serif orm-name orm-c3" style="top: 556px;">工程制图</h3>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：docs/superpowers/specs/2026-10-08-style-library-design.md §2</p>
  <p class="or-kai or-pageno">伍 / 拾柒</p>
</section>
```

## oriental/compare · compare

双栏对勘。中央 1px 竖线隔开左右两翼：左翼绢丝标头（旧制）对右翼松烟墨标头与朱砂竖杠（新法），每侧下方承托 100px 量化对照指标。

```html
<section class="slide" data-layout="oriental/compare" data-role="compare">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷壹 · 风格库</p>
  <p class="or-kai or-mark">旧制与新法</p>
  <h2 class="or-heavy or-title" data-anim="rise">换皮，不如换版面。</h2>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <div class="or-vr orv-vr" data-shape="rect"></div>
  <div class="or-tint orv-head orv-l" data-shape="rect"></div>
  <div class="or-ink orv-head orv-r" data-shape="rect"></div>
  <div class="or-red orv-bar" data-shape="rect"></div>
  <p class="or-kai orv-hl orv-tl">之前 · 旧架构</p>
  <p class="or-kai or-on orv-hl orv-tr">现在 · 风格库</p>
  <h3 class="or-heavy orv-h orv-l" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="or-body orv-p orv-l" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <div class="or-r1s orv-rule orv-l" data-shape="rect"></div>
  <p class="or-num orv-num orv-l" data-anim="count">24</p>
  <p class="or-serif orv-nl orv-nll" data-merge="ln" data-anim="rise">个版式，三套系统共用</p>
  <p class="or-kai orv-sub orv-nll" data-merge="ln" data-anim="rise">结构同构，仅靠配色与字体区分</p>
  <h3 class="or-heavy orv-h orv-r" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="or-body orv-p orv-r" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <div class="or-r1s orv-rule orv-r" data-shape="rect"></div>
  <p class="or-num or-ac orv-num orv-r" data-anim="count">12</p>
  <p class="or-serif orv-nl orv-nlr" data-merge="rn" data-anim="rise">种风格，各有一套版式</p>
  <p class="or-kai orv-sub orv-nlr" data-merge="rn" data-anim="rise">角色层解耦，每种风格各自成篇</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="or-kai or-pageno">陆 / 拾柒</p>
</section>
```

## oriental/image-text · image-text

图文并置。左侧 588×400 去饱和画幅与文楷图注；1px 竖线右侧排布朱砂题签、两段正文及下方绢丝注释匣（左侧朱砂竖条）。

```html
<section class="slide" data-layout="oriental/image-text" data-role="image-text">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷贰 · 测量与导出</p>
  <p class="or-kai or-mark">所见即所得</p>
  <h2 class="or-heavy or-title" data-anim="rise">所见即所得，靠的是测量。</h2>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <img class="or-photo ori-img" src="assets/img/07-feature.jpg" alt="示意图：宣纸暖调与朱砂建筑立面构成的坐标空间">
  <p class="or-kai ori-cap">图 03 · 示意图 — 浏览器排布与原生导出坐标映射</p>
  <div class="or-vr ori-vr" data-shape="rect"></div>
  <p class="or-kai ori-rubric">测量与原生映射</p>
  <p class="or-body ori-p ori-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="or-body ori-p ori-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="or-tint ori-box" data-shape="rect"></div>
  <div class="or-red ori-edge" data-shape="rect"></div>
  <p class="or-kai ori-key" data-merge="spec">导出原语</p>
  <p class="or-note ori-note" data-merge="spec">圆角矩形 · 直线 · 燕尾 · 旋转 · 阴影 · 竖排。所有文字均保留为原生可编辑文本框。</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs</p>
  <p class="or-kai or-pageno">柒 / 拾柒</p>
</section>
```

## oriental/image · image

满幅影像展卷（`is-dark`）。全画幅去饱和远山横卷，底部墨漆托板配细双线、朱砂方印、大字标题与右侧图注出处。

```html
<section class="slide is-dark" data-layout="oriental/image" data-role="image">
  <img class="or-photo orf-img" src="assets/img/08-image.jpg" alt="示意图：宣纸暖光与墨色远山层峦的横幅展卷">
  <div class="orf-plate" data-shape="rect"></div>
  <div class="or-r1 orf-da" data-shape="rect"></div>
  <div class="or-r1s orf-db" data-shape="rect"></div>
  <div class="or-seal orf-seal" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-tx orf-seal-tx">选</p>
  <h2 class="or-heavy orf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="or-kai orf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <div class="or-vr orf-vr" data-shape="rect"></div>
  <p class="or-kai orf-cap">图 04 · 示意图</p>
  <p class="or-note orf-src">出处：SKILL.md 第 1 步 Q2（选风格在填内容之前）</p>
  <div class="or-r1s orf-brule" data-shape="rect"></div>
  <p class="or-kai orf-foot">ZIFEIYU PPT SKILL · 影像展卷</p>
  <p class="or-kai orf-pageno">捌 / 拾柒</p>
</section>
```

## oriental/points · points

三栏要点。两根 1px 竖线均分三栏，每栏顶部置朱砂单字方印与文楷序目，下接 64px 编号、极粗宋体要点、细线、正文及底端绢丝标签匣。

```html
<section class="slide" data-layout="oriental/points" data-role="points">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷贰 · 测量与导出</p>
  <p class="or-kai or-mark">三事可验</p>
  <h2 class="or-heavy or-title" data-anim="rise">三件事，件件可验证。</h2>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <div class="or-vr ort-vr ort-v1" data-shape="rect"></div>
  <div class="or-vr ort-vr ort-v2" data-shape="rect"></div>
  <div class="or-seal ort-seal ort-c1" data-shape="rect"></div>
  <p class="or-seal-tx ort-seal-tx ort-c1">演</p>
  <p class="or-kai ort-rubric ort-r1x">要点 壹</p>
  <p class="or-num ort-num ort-c1">01</p>
  <h3 class="or-heavy ort-h ort-c1" data-merge="p1" data-anim="rise">浏览器里演示</h3>
  <div class="or-r1s ort-r1 ort-c1" data-shape="rect"></div>
  <p class="or-body ort-p ort-c1" data-merge="p1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <div class="or-tint ort-box ort-c1" data-shape="rect"></div>
  <p class="or-kai ort-tag ort-i1">F 全屏 · S 演讲者控制台</p>
  <div class="or-seal ort-seal ort-c2" data-shape="rect"></div>
  <p class="or-seal-tx ort-seal-tx ort-c2">改</p>
  <p class="or-kai ort-rubric ort-r2x">要点 贰</p>
  <p class="or-num ort-num ort-c2">02</p>
  <h3 class="or-heavy ort-h ort-c2" data-merge="p2" data-anim="rise">可编辑的 PPTX</h3>
  <div class="or-r1s ort-r1 ort-c2" data-shape="rect"></div>
  <p class="or-body ort-p ort-c2" data-merge="p2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <div class="or-tint ort-box ort-c2" data-shape="rect"></div>
  <p class="or-kai ort-tag ort-i2">原生文本框 · 原生形状</p>
  <div class="or-seal ort-seal ort-c3" data-shape="rect"></div>
  <p class="or-seal-tx ort-seal-tx ort-c3">检</p>
  <p class="or-kai ort-rubric ort-r3x">要点 叁</p>
  <p class="or-num ort-num ort-c3">03</p>
  <h3 class="or-heavy ort-h ort-c3" data-merge="p3" data-anim="rise">机器先把关</h3>
  <div class="or-r1s ort-r1 ort-c3" data-shape="rect"></div>
  <p class="or-body ort-p ort-c3" data-merge="p3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <div class="or-tint ort-box ort-c3" data-shape="rect"></div>
  <p class="or-kai ort-tag ort-i3">R1–R16 · 错误清零</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：SKILL.md 第 6、8 步</p>
  <p class="or-kai or-pageno">玖 / 拾柒</p>
</section>
```

## oriental/kpi · kpi

三栏核心数字（承袭样张经典朱砂竖线三栏结构）。双细线之下两根 1px 朱砂竖线（`or-vr-ac`）切分三栏；每栏以 48×48 朱砂单字印起笔，下承 128px 极粗宋体数字、26px 文楷指标名与说明；页脚挂 `data-source`。

```html
<section class="slide" data-layout="oriental/kpi" data-role="kpi">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷叁 · 质量门</p>
  <p class="or-kai or-mark">据本仓库校验与角色定义</p>
  <h2 class="or-heavy or-title" data-anim="rise">导出之前，先过十六道检查。</h2>
  <p class="or-kai or-sub">校验规则、页面角色与导出格式三项指标，均来自本仓库校验器与角色注册表</p>
  <div class="or-r1 or-drule-a" data-shape="rect"></div>
  <div class="or-r1s or-drule-b" data-shape="rect"></div>
  <div class="or-vr-ac ork-vr ork-v1" data-shape="rect"></div>
  <div class="or-vr-ac ork-vr ork-v2" data-shape="rect"></div>
  <div class="or-seal ork-seal ork-c1" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-tx ork-seal-tx ork-c1">规</p>
  <p class="or-num ork-num ork-c1" data-anim="count">16</p>
  <h3 class="or-kai ork-label ork-c1" data-merge="k1" data-anim="rise">条校验规则</h3>
  <p class="or-sans ork-desc ork-c1" data-merge="k1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>
  <div class="or-seal ork-seal ork-c2" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-tx ork-seal-tx ork-c2">角</p>
  <p class="or-num ork-num ork-c2" data-anim="count">20</p>
  <h3 class="or-kai ork-label ork-c2" data-merge="k2" data-anim="rise">页面角色</h3>
  <p class="or-sans ork-desc ork-c2" data-merge="k2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>
  <div class="or-seal ork-seal ork-c3" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-tx ork-seal-tx ork-c3">式</p>
  <p class="or-num ork-num ork-c3" data-anim="count">3</p>
  <h3 class="or-kai ork-label ork-c3" data-merge="k3" data-anim="rise">导出格式</h3>
  <p class="or-sans ork-desc ork-c3" data-merge="k3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot" data-source>来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="or-kai or-pageno">拾 / 拾柒</p>
</section>
```

## oriental/bars · bars

横向条形图（支持 `--native-charts` 替换）。左图区 6 行条形宽度严格等于 `data-value × 116px`（区间内不放竖轴线）；最末重点项以朱砂红高亮；右栏对照列出规则编号；页脚挂 `data-source`。

```html
<section class="slide" data-layout="oriental/bars" data-role="bars">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷叁 · 质量门</p>
  <p class="or-kai or-mark">规则分布</p>
  <h2 class="or-heavy or-title" data-anim="rise">十六条规则，各管一摊。</h2>
  <p class="or-kai or-sub">各类校验规则条数分布（单位：条）</p>
  <div class="or-r1 or-drule-a" data-shape="rect"></div>
  <div class="or-r1s or-drule-b" data-shape="rect"></div>
  <div class="or-vr orb-vr" data-shape="rect"></div>
  <p class="or-kai orb-rubric">对应规则编号</p>
  <div class="or-r1s orb-srule" data-shape="rect" style="top: 238px;"></div>
  <h3 class="or-serif orb-label" style="top: 252px;" data-chart>排版与几何</h3>
  <div class="or-ink orb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 248px; width: 464px;"></div>
  <p class="or-num orb-val" style="top: 252px; left: 748px;" data-chart>4</p>
  <p class="or-sans orb-ids" style="top: 254px;">R3 · R4 · R7 · R9</p>
  <h3 class="or-serif orb-label" style="top: 308px;" data-chart>版式与样式</h3>
  <div class="or-ink orb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 304px; width: 464px;"></div>
  <p class="or-num orb-val" style="top: 308px; left: 748px;" data-chart>4</p>
  <p class="or-sans orb-ids" style="top: 310px;">R1 · R2 · R6 · R12</p>
  <h3 class="or-serif orb-label" style="top: 364px;" data-chart>内容与数据</h3>
  <div class="or-ink orb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 360px; width: 348px;"></div>
  <p class="or-num orb-val" style="top: 364px; left: 632px;" data-chart>3</p>
  <p class="or-sans orb-ids" style="top: 366px;">R5 · R8 · R14</p>
  <h3 class="or-serif orb-label" style="top: 420px;" data-chart>可访问与媒体</h3>
  <div class="or-ink orb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 416px; width: 348px;"></div>
  <p class="or-num orb-val" style="top: 420px; left: 632px;" data-chart>3</p>
  <p class="or-sans orb-ids" style="top: 422px;">R10 · R11 · R13</p>
  <h3 class="or-serif orb-label" style="top: 476px;" data-chart>节奏</h3>
  <div class="or-ink orb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 472px; width: 116px;"></div>
  <p class="or-num orb-val" style="top: 476px; left: 400px;" data-chart>1</p>
  <p class="or-sans orb-ids" style="top: 478px;">R15</p>
  <h3 class="or-serif orb-label" style="top: 532px;" data-chart>导出一致</h3>
  <div class="or-red orb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 528px; width: 116px;"></div>
  <p class="or-num or-ac orb-val" style="top: 532px; left: 400px;" data-chart>1</p>
  <p class="or-sans orb-ids" style="top: 534px;">R16</p>
  <div class="or-r1s orb-srule" data-shape="rect" style="top: 572px;"></div>
  <p class="or-kai orb-foot">共 16 条 · 错误清零方可交付</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot" data-source>来源：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="or-kai or-pageno">拾壹 / 拾柒</p>
</section>
```

## oriental/table · table

雕版规格台账。松烟墨表头 + 六行隔行绢丝底纹（60px 行高）+ 细横竖分栏线；关键约束可用 `<span class="is-accent">` 朱砂标亮；页脚挂 `data-source`。

```html
<section class="slide" data-layout="oriental/table" data-role="table">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷叁 · 质量门</p>
  <p class="or-kai or-mark">规格台账</p>
  <h2 class="or-heavy or-title" data-anim="rise">一页纸，看懂规格。</h2>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <div class="or-ink ord-head" data-shape="rect"></div>
  <p class="or-kai ord-k ord-th">项目</p>
  <p class="or-kai ord-v ord-th">规格</p>
  <p class="or-kai ord-s ord-th">出处</p>
  <div class="or-tint ord-band" data-shape="rect" style="top: 290px;"></div>
  <div class="or-tint ord-band" data-shape="rect" style="top: 410px;"></div>
  <div class="or-tint ord-band" data-shape="rect" style="top: 530px;"></div>
  <div class="or-vr ord-vr ord-v1" data-shape="rect"></div>
  <div class="or-vr ord-vr ord-v2" data-shape="rect"></div>
  <div class="or-r1s ord-hr" data-shape="rect" style="top: 290px;"></div>
  <div class="or-r1s ord-hr" data-shape="rect" style="top: 350px;"></div>
  <div class="or-r1s ord-hr" data-shape="rect" style="top: 410px;"></div>
  <div class="or-r1s ord-hr" data-shape="rect" style="top: 470px;"></div>
  <div class="or-r1s ord-hr" data-shape="rect" style="top: 530px;"></div>
  <div class="or-r1s ord-hr" data-shape="rect" style="top: 590px;"></div>
  <h3 class="or-serif ord-k" style="top: 248px;">画布</h3>
  <p class="ord-v" style="top: 248px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="or-sans ord-s" style="top: 250px;">assets/base.css</p>
  <h3 class="or-serif ord-k" style="top: 308px;">字号下限</h3>
  <p class="ord-v" style="top: 308px;">16 px，溢出先删字、再换版式</p>
  <p class="or-sans ord-s" style="top: 310px;">validate.mjs · R4</p>
  <h3 class="or-serif ord-k" style="top: 368px;">校验规则</h3>
  <p class="ord-v" style="top: 368px;">R1–R16，<span class="is-accent">错误清零</span>才能交付</p>
  <p class="or-sans ord-s" style="top: 370px;">validate.mjs</p>
  <h3 class="or-serif ord-k" style="top: 428px;">导出格式</h3>
  <p class="ord-v" style="top: 428px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="or-sans ord-s" style="top: 430px;">SKILL.md</p>
  <h3 class="or-serif ord-k" style="top: 488px;">页面角色</h3>
  <p class="ord-v" style="top: 488px;">20 个，其中 12 个核心角色</p>
  <p class="or-sans ord-s" style="top: 490px;">lib/roles.mjs</p>
  <h3 class="or-serif ord-k" style="top: 548px;">字体</h3>
  <p class="ord-v" style="top: 548px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="or-sans ord-s" style="top: 550px;">fetch-fonts.mjs</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot" data-source>来源：表内「出处」列（本仓库文件）</p>
  <p class="or-kai or-pageno">拾贰 / 拾柒</p>
</section>
```

## oriental/process · process

四步圆印流程（承袭样张经典四圆印结构）。双细线之下横贯一脉细线，串联四枚 96×96 圆形大印（前三枚松烟墨，收官步朱砂红）与单字文楷印文，下接步序、极粗宋体步名、短细线与说明。

```html
<section class="slide" data-layout="oriental/process" data-role="process">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷肆 · 工作流</p>
  <p class="or-kai or-mark">四步成稿</p>
  <h2 class="or-heavy or-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="or-kai or-sub">由选而填，由填而校，由校而出</p>
  <div class="or-r1 or-drule-a" data-shape="rect"></div>
  <div class="or-r1s or-drule-b" data-shape="rect"></div>
  <div class="or-r1s orp-spine" data-shape="rect" data-anim="draw"></div>
  <div class="or-ink orp-circ orp-c1" data-shape="ellipse" data-anim="pop"></div>
  <p class="or-seal-tx orp-char orp-c1">选</p>
  <p class="or-kai orp-idx orp-c1">第 01 步</p>
  <h3 class="or-heavy orp-name orp-c1" data-merge="s1" data-anim="rise">选风格</h3>
  <div class="or-r1s orp-r1 orp-c1" data-shape="rect"></div>
  <p class="or-sans orp-p orp-c1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <div class="or-ink orp-circ orp-c2" data-shape="ellipse" data-anim="pop"></div>
  <p class="or-seal-tx orp-char orp-c2">填</p>
  <p class="or-kai orp-idx orp-c2">第 02 步</p>
  <h3 class="or-heavy orp-name orp-c2" data-merge="s2" data-anim="rise">填版式</h3>
  <div class="or-r1s orp-r1 orp-c2" data-shape="rect"></div>
  <p class="or-sans orp-p orp-c2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <div class="or-ink orp-circ orp-c3" data-shape="ellipse" data-anim="pop"></div>
  <p class="or-seal-tx orp-char orp-c3">校</p>
  <p class="or-kai orp-idx orp-c3">第 03 步</p>
  <h3 class="or-heavy orp-name orp-c3" data-merge="s3" data-anim="rise">过校验</h3>
  <div class="or-r1s orp-r1 orp-c3" data-shape="rect"></div>
  <p class="or-sans orp-p orp-c3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <div class="or-red orp-circ orp-c4" data-shape="ellipse" data-anim="pop"></div>
  <p class="or-seal-tx orp-char orp-c4">出</p>
  <p class="or-kai or-ac orp-idx orp-c4">第 04 步</p>
  <h3 class="or-heavy or-ac orp-name orp-c4" data-merge="s4" data-anim="rise">导出</h3>
  <div class="or-r1s orp-r1 orp-c4" data-shape="rect"></div>
  <p class="or-sans orp-p orp-c4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：SKILL.md 工作流</p>
  <p class="or-kai or-pageno">拾叁 / 拾柒</p>
</section>
```

## oriental/timeline · timeline

五纪编年长卷。五栏等宽排布，墨色横轴贯穿五枚方形节点（最新里程碑上朱砂红），轴上记纪序与 50px 日期，轴下记节点名称与说明。

```html
<section class="slide" data-layout="oriental/timeline" data-role="timeline">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷肆 · 工作流</p>
  <p class="or-kai or-mark">版本编年</p>
  <h2 class="or-heavy or-title" data-anim="rise">从一套版式，到一座风格库。</h2>
  <p class="or-kai or-sub">2026 年核心版本演进纪要（07.16 → 10.08）</p>
  <div class="or-r1 or-drule-a" data-shape="rect"></div>
  <div class="or-r1s or-drule-b" data-shape="rect"></div>
  <div class="or-vr orl-vr orl-v1" data-shape="rect"></div>
  <div class="or-vr orl-vr orl-v2" data-shape="rect"></div>
  <div class="or-vr orl-vr orl-v3" data-shape="rect"></div>
  <div class="or-vr orl-vr orl-v4" data-shape="rect"></div>
  <div class="or-ink orl-spine" data-shape="rect" data-anim="draw"></div>
  <p class="or-kai orl-yr orl-c1">纪 壹</p>
  <p class="or-num orl-date orl-c1" data-anim="rise">07.16</p>
  <div class="or-ink orl-node orl-c1" data-shape="rect" data-anim="pop"></div>
  <h3 class="or-heavy orl-h orl-c1" data-merge="t1" data-anim="rise">首版发布</h3>
  <div class="or-r1s orl-r1 orl-c1" data-shape="rect"></div>
  <p class="or-body orl-p orl-c1" data-merge="t1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <p class="or-kai orl-yr orl-c2">纪 贰</p>
  <p class="or-num orl-date orl-c2" data-anim="rise">07.18</p>
  <div class="or-ink orl-node orl-c2" data-shape="rect" data-anim="pop"></div>
  <h3 class="or-heavy orl-h orl-c2" data-merge="t2" data-anim="rise">墨韵衬线</h3>
  <div class="or-r1s orl-r1 orl-c2" data-shape="rect"></div>
  <p class="or-body orl-p orl-c2" data-merge="t2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <p class="or-kai orl-yr orl-c3">纪 叁</p>
  <p class="or-num orl-date orl-c3" data-anim="rise">08.17</p>
  <div class="or-ink orl-node orl-c3" data-shape="rect" data-anim="pop"></div>
  <h3 class="or-heavy orl-h orl-c3" data-merge="t3" data-anim="rise">校验全覆盖</h3>
  <div class="or-r1s orl-r1 orl-c3" data-shape="rect"></div>
  <p class="or-body orl-p orl-c3" data-merge="t3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <p class="or-kai orl-yr orl-c4">纪 肆</p>
  <p class="or-num orl-date orl-c4" data-anim="rise">08.18</p>
  <div class="or-ink orl-node orl-c4" data-shape="rect" data-anim="pop"></div>
  <h3 class="or-heavy orl-h orl-c4" data-merge="t4" data-anim="rise">瑞士国际</h3>
  <div class="or-r1s orl-r1 orl-c4" data-shape="rect"></div>
  <p class="or-body orl-p orl-c4" data-merge="t4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <p class="or-kai or-ac orl-yr orl-c5">最新里程碑</p>
  <p class="or-num or-ac orl-date orl-c5" data-anim="rise">10.08</p>
  <div class="or-red orl-node orl-c5" data-shape="rect" data-anim="pop"></div>
  <h3 class="or-heavy orl-h orl-c5" data-merge="t5" data-anim="rise">风格库</h3>
  <div class="or-r1s orl-r1 orl-c5" data-shape="rect"></div>
  <p class="or-body orl-p orl-c5" data-merge="t5" data-anim="rise">十二种风格，版式独立。</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：git log（2026-07-16 → 2026-10-08）</p>
  <p class="or-kai or-pageno">拾肆 / 拾柒</p>
</section>
```

## oriental/cycle · cycle

周而复始暗卷页（`is-dark`）。左侧双同心细圆环配四方位方印节点（首节朱砂红，内嵌单字文楷）；右侧四行步序列表与朱砂回环提示。

```html
<section class="slide is-dark" data-layout="oriental/cycle" data-role="cycle">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷肆 · 工作流</p>
  <p class="or-kai or-mark">周而复始</p>
  <h2 class="or-heavy or-title" data-anim="rise">每次改动，都绕这一圈</h2>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <div class="ory-ring-o" data-shape="ellipse" data-anim="fade"></div>
  <div class="ory-ring-i" data-shape="ellipse" data-anim="fade"></div>
  <div class="or-red ory-node ory-n1" data-shape="rect" data-anim="ring"></div>
  <div class="ory-box ory-node ory-n2" data-shape="rect" data-anim="ring"></div>
  <div class="ory-box ory-node ory-n3" data-shape="rect" data-anim="ring"></div>
  <div class="ory-box ory-node ory-n4" data-shape="rect" data-anim="ring"></div>
  <p class="or-seal-tx ory-k" style="left: 292px; top: 218px;">改</p>
  <p class="or-seal-tx ory-k" style="left: 460px; top: 386px;">校</p>
  <p class="or-seal-tx ory-k" style="left: 292px; top: 554px;">比</p>
  <p class="or-seal-tx ory-k" style="left: 124px; top: 386px;">记</p>
  <p class="or-num ory-core" data-anim="count">4</p>
  <p class="or-kai ory-core-l">四步成环</p>
  <div class="or-vr ory-vr" data-shape="rect"></div>
  <p class="or-kai ory-rubric">修订与基线回路</p>
  <p class="or-num or-ac ory-n" style="top: 244px;">01</p>
  <h3 class="or-heavy ory-h" style="top: 244px;" data-anim="rise">改版式</h3>
  <p class="or-note ory-d" style="top: 248px;">调整版式结构与几何参数</p>
  <div class="or-r1s ory-hair" data-shape="rect" style="top: 308px;"></div>
  <p class="or-num ory-n" style="top: 332px;">02</p>
  <h3 class="or-heavy ory-h" style="top: 332px;" data-anim="rise">过校验</h3>
  <p class="or-note ory-d" style="top: 336px;">十六条机器规则错误清零</p>
  <div class="or-r1s ory-hair" data-shape="rect" style="top: 396px;"></div>
  <p class="or-num ory-n" style="top: 420px;">03</p>
  <h3 class="or-heavy ory-h" style="top: 420px;" data-anim="rise">渲染比对</h3>
  <p class="or-note ory-d" style="top: 424px;">逐页出图并与基线目检比对</p>
  <div class="or-r1s ory-hair" data-shape="rect" style="top: 484px;"></div>
  <p class="or-num ory-n" style="top: 508px;">04</p>
  <h3 class="or-heavy ory-h" style="top: 508px;" data-anim="rise">记基线</h3>
  <p class="or-note ory-d" style="top: 512px;">归档通过检验的黄金参考帧</p>
  <div class="or-r1s ory-hair" data-shape="rect" style="top: 566px;"></div>
  <p class="or-kai ory-back">→ 回到 01 改版式</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：scripts/baseline.mjs（基线前先过 check-style 与 validate）</p>
  <p class="or-kai or-pageno">拾伍 / 拾柒</p>
</section>
```

## oriental/system · system

三层嵌套匣。左侧由外向内嵌套绢丝（`base.css`）、松烟墨（`style.css`）与朱砂方印（`brand.css`）三层方匣；右侧三行释义以细线分隔。

```html
<section class="slide" data-layout="oriental/system" data-role="system">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷肆 · 工作流</p>
  <p class="or-kai or-mark">样式体系</p>
  <h2 class="or-heavy or-title" data-anim="rise">三层样式，各管一层</h2>
  <div class="or-r1 or-srule-a" data-shape="rect"></div>
  <div class="or-r1s or-srule-b" data-shape="rect"></div>
  <div class="or-tint orz-p1" data-shape="rect" data-anim="scale"></div>
  <div class="or-ink orz-p2" data-shape="rect" data-anim="scale"></div>
  <div class="or-red orz-p3" data-shape="rect" data-anim="scale"></div>
  <p class="or-kai orz-l1">外层 · base.css</p>
  <p class="or-kai orz-l2">中层 · style.css</p>
  <p class="or-seal-tx orz-l3-ch">印</p>
  <p class="or-kai orz-l3">brand.css</p>
  <div class="or-vr orz-vr" data-shape="rect"></div>
  <p class="or-kai orz-tag" style="top: 196px;" data-merge="o" data-anim="rise">外层 · 公共底座</p>
  <h3 class="or-heavy orz-h" style="top: 228px;" data-merge="o" data-anim="rise">base.css</h3>
  <p class="orz-p" style="top: 274px;" data-merge="o" data-anim="rise">画布、元素契约、形状原语</p>
  <div class="or-r1s orz-hair" data-shape="rect" style="top: 326px;"></div>
  <p class="or-kai orz-tag" style="top: 344px;" data-merge="m" data-anim="rise">中层 · 风格包</p>
  <h3 class="or-heavy orz-h" style="top: 376px;" data-merge="m" data-anim="rise">style.css</h3>
  <p class="orz-p" style="top: 422px;" data-merge="m" data-anim="rise">风格的 token、字体与全部版式</p>
  <div class="or-r1s orz-hair" data-shape="rect" style="top: 474px;"></div>
  <p class="or-kai orz-tag" style="top: 492px;" data-merge="i" data-anim="rise">内层 · 品牌覆写</p>
  <h3 class="or-heavy orz-h" style="top: 524px;" data-merge="i" data-anim="rise">brand.css</h3>
  <p class="orz-p" style="top: 570px;" data-merge="i" data-anim="rise">只改 token 的品牌色</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">来源：风格库 spec §3.1</p>
  <p class="or-kai or-pageno">拾陆 / 拾柒</p>
</section>
```

## oriental/closing · closing

卷尾暗卷（`is-dark`）。右侧两列竖排极粗宋体纯汉字收尾句配 2×2 朱砂落款印；左侧细双线下展示新建命令匣、画廊地址与卷宗档案。

```html
<section class="slide is-dark" data-layout="oriental/closing" data-role="closing">
  <div class="or-frame-o" data-shape="rect"></div>
  <div class="or-frame-i" data-shape="rect"></div>
  <p class="or-kai or-kicker">卷尾 · 即刻启程</p>
  <p class="or-kai or-mark">ZIFEIYU PPT SKILL</p>
  <h2 class="or-heavy or-vt ore-t1" data-anim="rise">挑一种风格，</h2>
  <h2 class="or-heavy or-vt ore-t2" data-anim="rise">开始下一份。</h2>
  <div class="or-seal ore-seal" data-shape="rect" data-anim="pop"></div>
  <p class="or-seal-vt ore-seal-r">新中</p>
  <p class="or-seal-vt ore-seal-l">东方</p>
  <div class="or-vr ore-vr" data-shape="rect"></div>
  <p class="or-kai ore-rubric">下一步 · 启卷新建</p>
  <div class="or-r1 ore-da" data-shape="rect"></div>
  <div class="or-r1s ore-db" data-shape="rect"></div>
  <p class="or-kai ore-label">新建 DECK 命令</p>
  <div class="or-tint ore-box" data-shape="rect"></div>
  <div class="or-red ore-edge" data-shape="rect"></div>
  <p class="ore-cmd">node scripts/new-deck.mjs my-deck --style oriental</p>
  <p class="or-kai ore-p">风格画廊：docs/styles/index.html</p>
  <p class="or-sans ore-tag">一源三出 · 浏览器演示 · PPTX · PDF · PNG</p>
  <div class="or-r1s ore-hair" data-shape="rect"></div>
  <p class="or-kai ore-crubric">卷宗档案</p>
  <p class="or-note ore-citem" style="top: 484px;" data-merge="colophon">风格代号：K · 新中式 · 东方</p>
  <p class="or-note ore-citem" style="top: 518px;" data-merge="colophon">推荐场合：文旅 · 政务 · 传统文化 · 节庆</p>
  <p class="or-note ore-citem" style="top: 552px;" data-merge="colophon">字体：思源宋 · 霞鹜文楷 · 思源黑</p>
  <div class="or-r1s or-brule" data-shape="rect"></div>
  <p class="or-kai or-foot">ZIFEIYU PPT SKILL · 风格 K 新中式 · 东方</p>
  <p class="or-kai or-pageno">拾柒 / 拾柒</p>
</section>
```
