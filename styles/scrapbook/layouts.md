# 拼贴 · 手账（scrapbook）版式注册表

> 状态：ready · 17 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / cycle / system。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/scrapbook/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **暖牛皮纸与夜间黑板交替**：默认暖牛皮纸底（`#efe6d6`）配深褐墨字（`#2a2620`）；`statement`、`image`、`cycle`、`closing` 四类节奏页挂 `slide is-dark` 翻转为深褐夜间手账底（`#26221d`）配暖金粉笔强调色（`#ffcf56`），拉开整份 deck 的明暗节奏（R15）。
2. **倾斜拍立得与彩色胶带**：拍立得由底层白边相框 `<div class="sb-pol" data-shape="rect">`（单层阴影）、精确对齐同角旋转的照片 `<img class="sb-photo">`、底部白边里的手写图注 `<p class="sb-pol-cap">` 与顶边半透明彩色和纸胶带（`sb-tape-y / b / p / g`）四件组成。大卡片倾斜控制在 `-4deg..+3.5deg`，胶带倾斜 `-22deg..+24deg`，全部走原生 CSS `rotate` 属性（禁止 `transform`，满足 R16）。
3. **粉彩便利贴与荧光笔**：关键数字、摘要与对照页采用黄（`sb-note-y` `#fff3a8`）、浅绿（`sb-note-g` `#cdeccf`）、粉橘（`sb-note-p` `#ffd9cf`）、天蓝（`sb-note-b` `#d3e9f2`）便利贴与白纸卡（`sb-note-w`），在暗底页上的浅色卡片内统一使用 `sb-ink / sb-ink-sub / sb-ink-ac` 确保文字对比度。标题重点使用底层的荧光笔色块（`<div class="sb-hi" data-shape="rect">`）或行内 `<span class="is-mark">`，绝不在文字标签本身加背景、描边、阴影或内边距（R16）。
4. **字体分工**：主标题、大数字、便利贴标题与拍立得图注用开源手写楷体 `LXGW WenKai`（`sb-hand` 700 / `sb-hand-reg` 400，Office 回退 `KaiTi`）；长句正文与表格内容用 `Source Han Sans SC`（`sb-body / sb-sub`，Office 回退 `Microsoft YaHei`）；页眉页脚、编号、命令与数据标签用 `Inter`（`sb-meta / sb-ui`，Office 回退 `Segoe UI`），全套字号不低于 16px（R4）。
5. **手账天头地脚**：内容页顶部 `No. XX` 章节标签（`sb-hd-l`）+ 右上角风格式样名（`sb-hd-r`）+ 1px 细线（`sb-hd-rule`）；底部 1px 细线（`sb-ft-rule`）+ 左出处（数据页挂 `data-source`）+ 右页码（`01 / 17`）。

## scrapbook/cover · cover

手账拼贴封面。左侧标签贴纸 + 荧光笔划重点的双行手写大标题 + 胶带固定的倾斜黄色便利贴说明；右侧三张错落旋转的拍立得照片，分别以黄、蓝、粉三色半透明胶带贴在牛皮纸底面上。

```html
<section class="slide" data-layout="scrapbook/cover" data-role="cover">
  <div class="sb-note-y sbc-tag-bg" data-shape="rect"></div>
  <p class="sb-hand sb-ink-ac sbc-tag">网页 PPT · 可编辑导出</p>
  <div class="sb-hi sbc-hi" data-shape="rect" data-anim="draw"></div>
  <h1 class="sb-hand sbc-t1" data-merge="title" data-anim="rise">一份源文件</h1>
  <h1 class="sb-hand sbc-t2" data-merge="title" data-anim="rise">三种交付</h1>
  <div class="sb-note-y sbc-note" data-shape="rect"></div>
  <div class="sb-tape-b sbc-note-tape" data-shape="rect"></div>
  <p class="sb-hand-reg sb-ink sbc-desc" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <p class="sb-hand sb-ink-ac sbc-sig">✦ HTML 是唯一的源 · 手账风格</p>
  <p class="sb-meta sbc-foot">出处：SKILL.md · 网页 PPT 确定性导出</p>

  <div class="sb-pol sbc-p1" data-shape="rect"></div>
  <img class="sb-photo sbc-i1" src="assets/img/01-cover-a.jpg" alt="示意图：暖纸与焦糖色远山层峦">
  <p class="sb-pol-cap sbc-c1">01 · 暖纸地平线（示意图）</p>
  <div class="sb-tape-y sbc-tp1" data-shape="rect"></div>

  <div class="sb-pol sbc-p2" data-shape="rect"></div>
  <img class="sb-photo sbc-i2" src="assets/img/01-cover-b.jpg" alt="示意图：手账色调室内几何光面">
  <p class="sb-pol-cap sbc-c2">02 · 空间光影（示意图）</p>
  <div class="sb-tape-b sbc-tp2" data-shape="rect"></div>

  <div class="sb-pol sbc-p3" data-shape="rect"></div>
  <img class="sb-photo sbc-i3" src="assets/img/01-cover-c.jpg" alt="示意图：斜射窗光落于暖色墙面">
  <p class="sb-pol-cap sbc-c3">03 · 窗边日光（示意图）</p>
  <div class="sb-tape-p sbc-tp3" data-shape="rect"></div>
</section>
```

## scrapbook/agenda · agenda

手账目录。左侧一张倾斜拍立得配胶带 + 下方浅绿便利贴总述；右侧 4 张彩色侧标索引卡，圆点序号贴纸 + 手写章节名 + 一句说明 + 页码。

```html
<section class="slide" data-layout="scrapbook/agenda" data-role="agenda">
  <p class="sb-meta sb-hd-l">No. 02 · 手账目录</p>
  <p class="sb-meta sb-hd-r">STYLE J · 拼贴 · 手账</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <div class="sb-hi sba-hi" data-shape="rect" data-anim="draw"></div>
  <h2 class="sb-hand sba-title" data-anim="rise">本期目录</h2>
  <p class="sba-deck">全本四辑十七页 · 从选风格到一键交付</p>

  <div class="sb-pol sba-pol" data-shape="rect"></div>
  <img class="sb-photo sba-img" src="assets/img/02-agenda.jpg" alt="示意图：柔和暖纸与焦糖色光斑">
  <p class="sb-pol-cap sba-cap">图 02 · 手账扉页（示意图）</p>
  <div class="sb-tape-y sba-tp" data-shape="rect"></div>

  <div class="sb-note-g sba-note" data-shape="rect"></div>
  <p class="sb-hand-reg sb-ink sba-note-t">全本分为风格库、测量与导出、质量门与工作流四章，每页均按角色登记。</p>

  <div class="sb-note-w sba-card" data-shape="rect" style="top: 174px;"></div>
  <div class="sb-note-y sba-tab" data-shape="rect" style="top: 174px;"></div>
  <div class="sb-dot-y sba-dot" data-shape="ellipse" style="top: 198px;"></div>
  <p class="sb-ui sb-ink sba-num" style="top: 210px;">01</p>
  <h3 class="sb-hand sb-ink sba-item" style="top: 186px;" data-merge="a1" data-anim="rise">风格库</h3>
  <p class="sb-sans sba-desc" style="top: 230px;" data-merge="a1" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="sb-meta sba-pg" style="top: 210px;">P. 04</p>

  <div class="sb-note-w sba-card" data-shape="rect" style="top: 290px;"></div>
  <div class="sb-note-g sba-tab" data-shape="rect" style="top: 290px;"></div>
  <div class="sb-dot-g sba-dot" data-shape="ellipse" style="top: 314px;"></div>
  <p class="sb-ui sb-ink sba-num" style="top: 326px;">02</p>
  <h3 class="sb-hand sb-ink sba-item" style="top: 302px;" data-merge="a2" data-anim="rise">测量与导出</h3>
  <p class="sb-sans sba-desc" style="top: 346px;" data-merge="a2" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="sb-meta sba-pg" style="top: 326px;">P. 07</p>

  <div class="sb-note-w sba-card" data-shape="rect" style="top: 406px;"></div>
  <div class="sb-note-p sba-tab" data-shape="rect" style="top: 406px;"></div>
  <div class="sb-dot-p sba-dot" data-shape="ellipse" style="top: 430px;"></div>
  <p class="sb-ui sb-ink sba-num" style="top: 442px;">03</p>
  <h3 class="sb-hand sb-ink sba-item" style="top: 418px;" data-merge="a3" data-anim="rise">质量门</h3>
  <p class="sb-sans sba-desc" style="top: 462px;" data-merge="a3" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="sb-meta sba-pg" style="top: 442px;">P. 10</p>

  <div class="sb-note-w sba-card" data-shape="rect" style="top: 522px;"></div>
  <div class="sb-note-b sba-tab" data-shape="rect" style="top: 522px;"></div>
  <div class="sb-dot-b sba-dot" data-shape="ellipse" style="top: 546px;"></div>
  <p class="sb-ui sb-ink sba-num" style="top: 558px;">04</p>
  <h3 class="sb-hand sb-ink sba-item" style="top: 534px;" data-merge="a4" data-anim="rise">工作流</h3>
  <p class="sb-sans sba-desc" style="top: 578px;" data-merge="a4" data-anim="rise">从大纲到成稿的四步</p>
  <p class="sb-meta sba-pg" style="top: 558px;">P. 13</p>

  <div class="sb-tape-p sba-tp-r1" data-shape="rect"></div>
  <div class="sb-tape-b sba-tp-r2" data-shape="rect"></div>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">ZIFEIYU PPT SKILL · 目录</p>
  <p class="sb-meta sb-ft-r">02 / 17</p>
</section>
```

## scrapbook/statement · statement

夜间手账金句页（`is-dark`）。深褐黑板底 + 虚线手账框，对角贴两条半透明胶带；双行 72px 霞鹜文楷金句，以暖金荧光笔划出核心词；右下贴一张浅黄便利贴补充注释。

```html
<section class="slide is-dark" data-layout="scrapbook/statement" data-role="statement">
  <p class="sb-meta sb-hd-l">No. 03 · 手账摘录</p>
  <p class="sb-meta sb-hd-r">设计原则</p>

  <div class="sbq-frame" data-shape="rect"></div>
  <div class="sb-tape-y sbq-tp1" data-shape="rect"></div>
  <div class="sb-tape-p sbq-tp2" data-shape="rect"></div>

  <p class="sb-hand sb-ac sbq-kicker">✦ 核心主张 · 设计原则</p>
  <h2 class="sb-hand sbq-l1" data-merge="quote" data-anim="rise">HTML 是<span class="is-mark">唯一的源</span>，</h2>
  <h2 class="sb-hand sbq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <div class="sb-rule sbq-rule" data-shape="rect"></div>
  <p class="sb-hand-reg sb-ac sbq-by">— SKILL.md · 设计原则</p>

  <div class="sb-note-y sbq-note" data-shape="rect"></div>
  <div class="sb-tape-b sbq-note-tp" data-shape="rect"></div>
  <p class="sb-hand-reg sb-ink sbq-note-t">浏览器排布即终稿坐标，导出器逐项测量，一键交付可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>

  <p class="sb-meta sb-ft-l">ZIFEIYU PPT SKILL · 核心主张</p>
  <p class="sb-meta sb-ft-r">03 / 17</p>
</section>
```

## scrapbook/section · section

章节扉页。左侧超大倾斜黄色便利贴配粉胶带，写 180px 手写章号与简述；右侧荧光笔划重点的章节大标题 + 全本四章书签条导航，当前章以黄卡与深色圆点标亮。

```html
<section class="slide" data-layout="scrapbook/section" data-role="section">
  <p class="sb-meta sb-hd-l">No. 04 · 章节扉页</p>
  <p class="sb-meta sb-hd-r">CHAPTER 01</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <div class="sb-note-y sbx-note" data-shape="rect"></div>
  <div class="sb-tape-p sbx-tp" data-shape="rect"></div>
  <p class="sb-ui sb-ink-ac sbx-kicker">CHAPTER · 第一辑</p>
  <p class="sb-num sb-ink sbx-num" data-anim="rise">01</p>
  <p class="sb-hand-reg sb-ink-sub sbx-sub">十二种独立风格各有一套版式，先按场合挑气质，再依内容形状落版面。</p>

  <div class="sb-hi sbx-hi" data-shape="rect" data-anim="draw"></div>
  <h2 class="sb-hand sbx-title" data-anim="rise">01 · 风格库</h2>

  <div class="sb-note-y sbx-row" data-shape="rect" style="top: 296px;"></div>
  <div class="sb-dot-ac sbx-dot" data-shape="ellipse" style="top: 312px;"></div>
  <p class="sb-ui sb-on sbx-rn" style="top: 318px;">01</p>
  <p class="sb-hand sb-ink-ac sbx-ri" style="top: 313px;">风格库</p>
  <p class="sb-meta sb-ink-sub sbx-rp" style="top: 318px;">P. 04</p>

  <div class="sb-note-w sbx-row" data-shape="rect" style="top: 378px;"></div>
  <div class="sb-dot-g sbx-dot" data-shape="ellipse" style="top: 394px;"></div>
  <p class="sb-ui sb-ink sbx-rn" style="top: 400px;">02</p>
  <p class="sb-hand-reg sb-ink-sub sbx-ri" style="top: 395px;">测量与导出</p>
  <p class="sb-meta sbx-rp" style="top: 400px;">P. 07</p>

  <div class="sb-note-w sbx-row" data-shape="rect" style="top: 460px;"></div>
  <div class="sb-dot-p sbx-dot" data-shape="ellipse" style="top: 476px;"></div>
  <p class="sb-ui sb-ink sbx-rn" style="top: 482px;">03</p>
  <p class="sb-hand-reg sb-ink-sub sbx-ri" style="top: 477px;">质量门</p>
  <p class="sb-meta sbx-rp" style="top: 482px;">P. 10</p>

  <div class="sb-note-w sbx-row" data-shape="rect" style="top: 542px;"></div>
  <div class="sb-dot-b sbx-dot" data-shape="ellipse" style="top: 558px;"></div>
  <p class="sb-ui sb-ink sbx-rn" style="top: 564px;">04</p>
  <p class="sb-hand-reg sb-ink-sub sbx-ri" style="top: 559px;">工作流</p>
  <p class="sb-meta sbx-rp" style="top: 564px;">P. 13</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">ZIFEIYU PPT SKILL · 第一辑</p>
  <p class="sb-meta sb-ft-r">04 / 17</p>
</section>
```

## scrapbook/matrix · matrix

风格色卡拼贴墙（12 项 + 总数）。左侧倾斜白卡用大数字标出「12 种风格」与五组分类；右侧 3×4 色卡贴片排开 A–L，当前风格 J 以倾斜黄便签 + 右上粉胶带点亮。

```html
<section class="slide" data-layout="scrapbook/matrix" data-role="matrix">
  <p class="sb-meta sb-hd-l">No. 05 · 风格库</p>
  <p class="sb-meta sb-hd-r">STYLE MATRIX</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <div class="sb-hi sbm-hi" data-shape="rect" data-anim="draw"></div>
  <h2 class="sb-hand sb-title" data-anim="rise">十二种风格，按场合挑一种。</h2>

  <div class="sb-note-w sbm-hero-card" data-shape="rect"></div>
  <div class="sb-tape-y sbm-hero-tp" data-shape="rect"></div>
  <p class="sb-meta sbm-hero-k">收录总数</p>
  <p class="sb-num sb-ac sbm-hero-n" data-anim="count">12</p>
  <h3 class="sb-hand sb-ink sbm-hero-l">种风格</h3>
  <p class="sb-sans sb-ink-sub sbm-hero-d">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文。</p>

  <div class="sb-note-w sbm-card sbm-c1" data-shape="rect" style="top: 168px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l1" style="top: 184px;">A</p>
  <p class="sb-meta sbm-grp sbm-g1" style="top: 188px;">编辑排印</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l1" style="top: 224px;">杂志 · 暖纸</h3>

  <div class="sb-note-w sbm-card sbm-c2" data-shape="rect" style="top: 168px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l2" style="top: 184px;">B</p>
  <p class="sb-meta sbm-grp sbm-g2" style="top: 188px;">商务理性</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l2" style="top: 224px;">瑞士 · 网格</h3>

  <div class="sb-note-w sbm-card sbm-c3" data-shape="rect" style="top: 168px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l3" style="top: 184px;">C</p>
  <p class="sb-meta sbm-grp sbm-g3" style="top: 188px;">舞台冲击</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l3" style="top: 224px;">发布会 · 暗场</h3>

  <div class="sb-note-w sbm-card sbm-c1" data-shape="rect" style="top: 288px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l1" style="top: 304px;">D</p>
  <p class="sb-meta sbm-grp sbm-g1" style="top: 308px;">编辑排印</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l1" style="top: 344px;">报刊 · 版面</h3>

  <div class="sb-note-w sbm-card sbm-c2" data-shape="rect" style="top: 288px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l2" style="top: 304px;">E</p>
  <p class="sb-meta sbm-grp sbm-g2" style="top: 308px;">舞台冲击</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l2" style="top: 344px;">大字报 · 粗野</h3>

  <div class="sb-note-w sbm-card sbm-c3" data-shape="rect" style="top: 288px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l3" style="top: 304px;">F</p>
  <p class="sb-meta sbm-grp sbm-g3" style="top: 308px;">商务理性</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l3" style="top: 344px;">柔和 · 产品</h3>

  <div class="sb-note-w sbm-card sbm-c1" data-shape="rect" style="top: 408px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l1" style="top: 424px;">G</p>
  <p class="sb-meta sbm-grp sbm-g1" style="top: 428px;">影像叙事</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l1" style="top: 464px;">摄影集 · 画册</h3>

  <div class="sb-note-w sbm-card sbm-c2" data-shape="rect" style="top: 408px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l2" style="top: 424px;">H</p>
  <p class="sb-meta sbm-grp sbm-g2" style="top: 428px;">商务理性</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l2" style="top: 464px;">咨询 · 白皮书</h3>

  <div class="sb-note-w sbm-card sbm-c3" data-shape="rect" style="top: 408px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l3" style="top: 424px;">I</p>
  <p class="sb-meta sbm-grp sbm-g3" style="top: 428px;">东方人文</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l3" style="top: 464px;">日式 · 极简</h3>

  <div class="sb-note-y sbm-act" data-shape="rect"></div>
  <div class="sb-tape-p sbm-act-tp" data-shape="rect"></div>
  <p class="sb-ui sb-ink-ac sbm-let sbm-l1" style="top: 544px; rotate: -1.4deg;">J</p>
  <p class="sb-meta sb-ink-ac sbm-grp sbm-g1" style="top: 548px; rotate: -1.4deg;">影像叙事 ✦</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l1" style="top: 584px; rotate: -1.4deg;">拼贴 · 手账</h3>

  <div class="sb-note-w sbm-card sbm-c2" data-shape="rect" style="top: 528px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l2" style="top: 544px;">K</p>
  <p class="sb-meta sbm-grp sbm-g2" style="top: 548px;">东方人文</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l2" style="top: 584px;">新中式 · 东方</h3>

  <div class="sb-note-w sbm-card sbm-c3" data-shape="rect" style="top: 528px;"></div>
  <p class="sb-ui sb-ink sbm-let sbm-l3" style="top: 544px;">L</p>
  <p class="sb-meta sbm-grp sbm-g3" style="top: 548px;">商务理性</p>
  <h3 class="sb-hand sb-ink sbm-nm sbm-l3" style="top: 584px;">工程制图</h3>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：docs/superpowers/specs/2026-10-08-style-library-design.md §2</p>
  <p class="sb-meta sb-ft-r">05 / 17</p>
</section>
```

## scrapbook/compare · compare

双页便签对照。左侧深牛皮纸卡（之前，左倾 `-1.4deg` 配蓝胶带）与右侧明黄便签卡（现在，右倾 `+1.4deg` 配粉胶带）相对而立，中央以深色圆形 `VS` 贴纸衔接；两张卡片底部分别落核心数字对照。

```html
<section class="slide" data-layout="scrapbook/compare" data-role="compare">
  <p class="sb-meta sb-hd-l">No. 06 · 风格库</p>
  <p class="sb-meta sb-hd-r">BEFORE &amp; NOW</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">换皮，不如<span class="is-mark">换版面</span>。</h2>

  <div class="sb-note-k sbv-lcard" data-shape="rect"></div>
  <div class="sb-tape-b sbv-ltp" data-shape="rect"></div>
  <p class="sb-ui sb-ink-sub sbv-lt sbv-tag">之前 · 旧架构</p>
  <h3 class="sb-hand sb-ink sbv-lt sbv-h" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="sb-sans sb-ink sbv-lt sbv-p" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <div class="sb-rule sbv-div-l" data-shape="rect"></div>
  <p class="sb-num sb-ink sbv-lt sbv-num" data-anim="count">24</p>
  <p class="sb-hand sb-ink sbv-nl">个版式，三套系统共用</p>
  <p class="sb-sub sb-ink-sub sbv-nsl">骨架完全同构，仅靠换色区分</p>

  <div class="sb-note-y sbv-rcard" data-shape="rect"></div>
  <div class="sb-tape-p sbv-rtp" data-shape="rect"></div>
  <p class="sb-ui sb-ink-ac sbv-rt sbv-tag">现在 · 风格库 ✦</p>
  <h3 class="sb-hand sb-ink sbv-rt sbv-h" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="sb-sans sb-ink sbv-rt sbv-p" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <div class="sb-rule sbv-div-r" data-shape="rect"></div>
  <p class="sb-num sb-ink-ac sbv-rt sbv-num" data-anim="count">12</p>
  <p class="sb-hand sb-ink sbv-nr">种风格，各有一套版式</p>
  <p class="sb-sub sb-ink-sub sbv-nsr">按页面角色解耦，各自独立成篇</p>

  <div class="sb-dot-ink sbv-vs" data-shape="ellipse" data-anim="pop"></div>
  <p class="sb-ui sb-paper-on sbv-vst">VS</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="sb-meta sb-ft-r">06 / 17</p>
</section>
```

## scrapbook/image-text · image-text

左拍立得、右手账笔记。左侧倾斜大拍立得配顶边黄胶带与右下角蓝胶带；右侧虚线白卡贴粉胶带，放手写小标、两段正文与底部的浅绿提示便签条。

```html
<section class="slide" data-layout="scrapbook/image-text" data-role="image-text">
  <p class="sb-meta sb-hd-l">No. 07 · 测量与导出</p>
  <p class="sb-meta sb-hd-r">PHOTO &amp; NOTE</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">所见即所得，<span class="is-mark">靠的是测量</span>。</h2>

  <div class="sb-pol sbi-pol" data-shape="rect"></div>
  <img class="sb-photo sbi-img" src="assets/img/07-feature.jpg" alt="示意图：手账暖色空间与几何测量平面">
  <p class="sb-pol-cap sbi-cap">图 03 · 坐标测量示意（示意图）</p>
  <div class="sb-tape-y sbi-tp1" data-shape="rect"></div>
  <div class="sb-tape-b sbi-tp2" data-shape="rect"></div>

  <div class="sb-card-dash sbi-card" data-shape="rect"></div>
  <div class="sb-tape-p sbi-tp3" data-shape="rect"></div>
  <p class="sb-hand sb-ink-ac sbi-kicker">✎ 浏览器排布 → 原生导出</p>
  <p class="sb-body sb-ink sbi-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="sb-body sb-ink sbi-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="sb-note-g sbi-strip" data-shape="rect"></div>
  <p class="sb-hand-reg sb-ink sbi-st">✦ 原生形状 · 旋转 · 单层阴影 · 文字始终可编辑</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs</p>
  <p class="sb-meta sb-ft-r">07 / 17</p>
</section>
```

## scrapbook/image · image

夜间画册大图页（`is-dark`）。深褐黑板底上贴一张占主视觉的超大倾斜拍立得（700×448 大图 + 黄蓝双胶带）；右侧双行手写大标题配一张右倾明黄便利贴写图说与出处。

```html
<section class="slide is-dark" data-layout="scrapbook/image" data-role="image">
  <p class="sb-meta sb-hd-l">No. 08 · 影像手记</p>
  <p class="sb-meta sb-hd-r">POLAROID FEATURE</p>

  <div class="sb-pol sbf-pol" data-shape="rect"></div>
  <img class="sb-photo sbf-img" src="assets/img/08-image.jpg" alt="示意图：宽幅暖纸色山脊与微光天空">
  <p class="sb-pol-cap sbf-cap">图 04 · 暖纸远山（示意图）</p>
  <div class="sb-tape-y sbf-tp1" data-shape="rect"></div>
  <div class="sb-tape-b sbf-tp2" data-shape="rect"></div>

  <p class="sb-hand sb-ac sbf-kicker">✦ 选风格在填内容之前</p>
  <h2 class="sb-hand sbf-t1" data-merge="title" data-anim="rise">先选风格，</h2>
  <h2 class="sb-hand sbf-t2" data-merge="title" data-anim="rise">再写内容</h2>

  <div class="sb-note-y sbf-note" data-shape="rect"></div>
  <div class="sb-tape-p sbf-ntp" data-shape="rect"></div>
  <p class="sb-hand-reg sb-ink sbf-desc" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>

  <p class="sb-sub sbf-src">出处：SKILL.md 第 1 步 Q2（选风格在填内容之前）</p>

  <p class="sb-meta sb-ft-l">ZIFEIYU PPT SKILL · 影像手记</p>
  <p class="sb-meta sb-ft-r">08 / 17</p>
</section>
```

## scrapbook/points · points

三张胶带索引卡（3 项要点）。三张白纸卡片以轻微交替角度排开，分别以黄、蓝、粉三色胶带贴顶，卡内配粉彩圆点编号贴纸、手写标题、清晰正文与底部手写标签。

```html
<section class="slide" data-layout="scrapbook/points" data-role="points">
  <p class="sb-meta sb-hd-l">No. 09 · 测量与导出</p>
  <p class="sb-meta sb-hd-r">THREE CHECKS</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">三件事，<span class="is-mark">件件可验证</span>。</h2>

  <div class="sb-note-w sbp-c1" data-shape="rect"></div>
  <div class="sb-tape-y sbp-tp1" data-shape="rect"></div>
  <div class="sb-dot-y sbp-d1" data-shape="ellipse" data-anim="pop"></div>
  <p class="sb-ui sb-ink sbp-n1">01</p>
  <h3 class="sb-hand sb-ink sbp-h1" data-anim="rise">浏览器里演示</h3>
  <p class="sb-sans sb-ink-sub sbp-p1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <p class="sb-hand sb-ink-ac sbp-tg1"># F 全屏 · S 演讲者控制台</p>

  <div class="sb-note-w sbp-c2" data-shape="rect"></div>
  <div class="sb-tape-b sbp-tp2" data-shape="rect"></div>
  <div class="sb-dot-g sbp-d2" data-shape="ellipse" data-anim="pop"></div>
  <p class="sb-ui sb-ink sbp-n2">02</p>
  <h3 class="sb-hand sb-ink sbp-h2" data-anim="rise">可编辑的 PPTX</h3>
  <p class="sb-sans sb-ink-sub sbp-p2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <p class="sb-hand sb-ink-ac sbp-tg2"># 原生文本框 · 原生形状</p>

  <div class="sb-note-w sbp-c3" data-shape="rect"></div>
  <div class="sb-tape-p sbp-tp3" data-shape="rect"></div>
  <div class="sb-dot-p sbp-d3" data-shape="ellipse" data-anim="pop"></div>
  <p class="sb-ui sb-ink sbp-n3">03</p>
  <h3 class="sb-hand sb-ink sbp-h3" data-anim="rise">机器先把关</h3>
  <p class="sb-sans sb-ink-sub sbp-p3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <p class="sb-hand sb-ink-ac sbp-tg3"># R1–R16 · 错误清零</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：SKILL.md 第 6、8 步</p>
  <p class="sb-meta sb-ft-r">09 / 17</p>
</section>
```

## scrapbook/kpi · kpi

手账标志性三色便利贴数据页（3 个核心指标）。黄、浅绿、粉橘三张倾斜便利贴配黄、蓝、粉三色半透明胶带，卡内写 114px 手写大数字 + 指标名称 + 简短释义；页脚带 `data-source` 声明出处。

```html
<section class="slide" data-layout="scrapbook/kpi" data-role="kpi">
  <p class="sb-meta sb-hd-l">No. 10 · 质量门</p>
  <p class="sb-meta sb-hd-r">KEY METRICS</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">导出之前，先过<span class="is-mark">十六道检查</span>。</h2>

  <div class="sb-note-y sbk-n1" data-shape="rect"></div>
  <div class="sb-tape-y sbk-tp1" data-shape="rect"></div>
  <p class="sb-num sb-ink sbk-v1" data-anim="count">16</p>
  <h3 class="sb-hand sb-ink sbk-l1" data-anim="rise">条校验规则</h3>
  <p class="sb-sans sb-ink-sub sbk-d1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性</p>

  <div class="sb-note-g sbk-n2" data-shape="rect"></div>
  <div class="sb-tape-b sbk-tp2" data-shape="rect"></div>
  <p class="sb-num sb-ink sbk-v2" data-anim="count">20</p>
  <h3 class="sb-hand sb-ink sbk-l2" data-anim="rise">页面角色</h3>
  <p class="sb-sans sb-ink-sub sbk-d2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色</p>

  <div class="sb-note-p sbk-n3" data-shape="rect"></div>
  <div class="sb-tape-p sbk-tp3" data-shape="rect"></div>
  <p class="sb-num sb-ink sbk-v3" data-anim="count">3</p>
  <h3 class="sb-hand sb-ink sbk-l3" data-anim="rise">导出格式</h3>
  <p class="sb-sans sb-ink-sub sbk-d3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l" data-source>✎ 来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="sb-meta sb-ft-r">10 / 17</p>
</section>
```

## scrapbook/bars · bars

胶带贴纸条形图页（6 行，支持 `--native-charts` 原生图表导出）。左侧白纸图纸卡片对角贴胶带，承载 6 条按 `data-value` 严格等比例缩放的彩色横向条形（单位比例 `120px / 条`）；右侧倾斜明黄便利贴列出每类对应的规则编号；页脚带 `data-source`。

```html
<section class="slide" data-layout="scrapbook/bars" data-role="bars">
  <p class="sb-meta sb-hd-l">No. 11 · 质量门</p>
  <p class="sb-meta sb-hd-r">RULE DISTRIBUTION</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">十六条规则，<span class="is-mark">各管一摊</span>。</h2>
  <p class="sb-deck">各类校验规则条数分布（单位：条 · 每条 120px 等比例绘制）</p>

  <div class="sb-note-w sbb-sheet" data-shape="rect"></div>
  <div class="sb-tape-b sbb-tp1" data-shape="rect"></div>
  <div class="sb-tape-y sbb-tp2" data-shape="rect"></div>

  <h3 class="sb-hand sb-ink sbb-lbl" style="top: 228px;" data-chart>排版与几何</h3>
  <div class="sb-bar-1 sbb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 224px; width: 480px;"></div>
  <p class="sb-ui sb-ink sbb-val" style="top: 228px; left: 760px;" data-chart>4</p>

  <h3 class="sb-hand sb-ink sbb-lbl" style="top: 290px;" data-chart>版式与样式</h3>
  <div class="sb-bar-2 sbb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 286px; width: 480px;"></div>
  <p class="sb-ui sb-ink sbb-val" style="top: 290px; left: 760px;" data-chart>4</p>

  <h3 class="sb-hand sb-ink sbb-lbl" style="top: 352px;" data-chart>内容与数据</h3>
  <div class="sb-bar-3 sbb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 348px; width: 360px;"></div>
  <p class="sb-ui sb-ink sbb-val" style="top: 352px; left: 640px;" data-chart>3</p>

  <h3 class="sb-hand sb-ink sbb-lbl" style="top: 414px;" data-chart>可访问与媒体</h3>
  <div class="sb-bar-4 sbb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 410px; width: 360px;"></div>
  <p class="sb-ui sb-ink sbb-val" style="top: 414px; left: 640px;" data-chart>3</p>

  <h3 class="sb-hand sb-ink sbb-lbl" style="top: 476px;" data-chart>节奏</h3>
  <div class="sb-bar-5 sbb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 472px; width: 120px;"></div>
  <p class="sb-ui sb-ink sbb-val" style="top: 476px; left: 400px;" data-chart>1</p>

  <h3 class="sb-hand sb-ink sbb-lbl" style="top: 538px;" data-chart>导出一致</h3>
  <div class="sb-bar-6 sbb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 534px; width: 120px;"></div>
  <p class="sb-ui sb-ink-ac sbb-val" style="top: 538px; left: 400px;" data-chart>1</p>

  <div class="sb-note-y sbb-note" data-shape="rect"></div>
  <div class="sb-tape-p sbb-ntp" data-shape="rect"></div>
  <p class="sb-hand sb-ink-ac sbb-nh">✎ 对应规则编号</p>
  <p class="sb-meta sb-ink sbb-ni" style="top: 280px;">排版与几何 · R3 R4 R7 R9</p>
  <p class="sb-meta sb-ink sbb-ni" style="top: 326px;">版式与样式 · R1 R2 R6 R12</p>
  <p class="sb-meta sb-ink sbb-ni" style="top: 372px;">内容与数据 · R5 R8 R14</p>
  <p class="sb-meta sb-ink sbb-ni" style="top: 418px;">可访问媒体 · R10 R11 R13</p>
  <p class="sb-meta sb-ink sbb-ni" style="top: 464px;">视觉节奏 · R15</p>
  <p class="sb-meta sb-ink-ac sbb-ni" style="top: 510px;">导出一致 · R16</p>
  <p class="sb-hand-reg sb-ink-sub sbb-nf">共 16 条 · 错误清零方可交付</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l" data-source>来源：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="sb-meta sb-ft-r">11 / 17</p>
</section>
```

## scrapbook/table · table

手账规格台账页（6 行）。整页白纸台账贴黄粉双角胶带，深褐表头条 + 浅米色奇偶行底带 + 细分隔线，重点词以荧光笔行内标亮；页脚带 `data-source`。

```html
<section class="slide" data-layout="scrapbook/table" data-role="table">
  <p class="sb-meta sb-hd-l">No. 12 · 质量门</p>
  <p class="sb-meta sb-hd-r">SPEC SHEET</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">一页纸，<span class="is-mark">看懂规格</span>。</h2>

  <div class="sb-note-w sbt-sheet" data-shape="rect"></div>
  <div class="sb-tape-y sbt-tp1" data-shape="rect"></div>
  <div class="sb-tape-p sbt-tp2" data-shape="rect"></div>

  <div class="sb-ink-bg sbt-head" data-shape="rect"></div>
  <p class="sb-hand sb-paper-on sbt-th sbt-k">项目</p>
  <p class="sb-hand sb-paper-on sbt-th sbt-v">规格</p>
  <p class="sb-hand sb-paper-on sbt-th sbt-s">出处</p>

  <div class="sb-zebra sbt-band" data-shape="rect" style="top: 294px;"></div>
  <div class="sb-zebra sbt-band" data-shape="rect" style="top: 418px;"></div>
  <div class="sb-zebra sbt-band" data-shape="rect" style="top: 542px;"></div>
  <div class="sb-rule sbt-hr" data-shape="rect" style="top: 294px;"></div>
  <div class="sb-rule sbt-hr" data-shape="rect" style="top: 356px;"></div>
  <div class="sb-rule sbt-hr" data-shape="rect" style="top: 418px;"></div>
  <div class="sb-rule sbt-hr" data-shape="rect" style="top: 480px;"></div>
  <div class="sb-rule sbt-hr" data-shape="rect" style="top: 542px;"></div>
  <div class="sb-rule sbt-hr" data-shape="rect" style="top: 604px;"></div>

  <h3 class="sb-hand sb-ink sbt-k" style="top: 250px;">画布</h3>
  <p class="sb-sans sb-ink sbt-v" style="top: 251px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="sb-meta sbt-s" style="top: 253px;">assets/base.css</p>

  <h3 class="sb-hand sb-ink sbt-k" style="top: 312px;">字号下限</h3>
  <p class="sb-sans sb-ink sbt-v" style="top: 313px;">16 px，溢出先删字、再换版式</p>
  <p class="sb-meta sbt-s" style="top: 315px;">validate.mjs · R4</p>

  <h3 class="sb-hand sb-ink sbt-k" style="top: 374px;">校验规则</h3>
  <p class="sb-sans sb-ink sbt-v" style="top: 375px;">R1–R16，<span class="is-mark">错误清零</span>才能交付</p>
  <p class="sb-meta sbt-s" style="top: 377px;">validate.mjs</p>

  <h3 class="sb-hand sb-ink sbt-k" style="top: 436px;">导出格式</h3>
  <p class="sb-sans sb-ink sbt-v" style="top: 437px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="sb-meta sbt-s" style="top: 439px;">SKILL.md</p>

  <h3 class="sb-hand sb-ink sbt-k" style="top: 498px;">页面角色</h3>
  <p class="sb-sans sb-ink sbt-v" style="top: 499px;">20 个，其中 12 个核心角色</p>
  <p class="sb-meta sbt-s" style="top: 501px;">lib/roles.mjs</p>

  <h3 class="sb-hand sb-ink sbt-k" style="top: 560px;">字体</h3>
  <p class="sb-sans sb-ink sbt-v" style="top: 561px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="sb-meta sbt-s" style="top: 563px;">fetch-fonts.mjs</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l" data-source>来源：表内「出处」列（本仓库文件）</p>
  <p class="sb-meta sb-ft-r">12 / 17</p>
</section>
```

## scrapbook/process · process

四步拍立得流程页（4 步）。四张交替微倾的拍立得横向排开，分别以黄、蓝、粉、绿四色胶带贴顶，图间以手写箭头 `→` 相连；下方落四步手写标题（最终步用荧光笔标亮）与清晰说明。

```html
<section class="slide" data-layout="scrapbook/process" data-role="process">
  <p class="sb-meta sb-hd-l">No. 13 · 工作流</p>
  <p class="sb-meta sb-hd-r">FOUR STEPS</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sbw-title" data-anim="rise">从大纲到成稿，<span class="is-mark">四步</span></h2>
  <p class="sb-hand-reg sbw-sub">选风格 → 填版式 → 过校验 → 导出</p>

  <div class="sb-pol sbw-p1" data-shape="rect"></div>
  <img class="sb-photo sbw-i1" src="assets/img/13-step1.jpg" alt="示意图：选风格暖纸光晕">
  <p class="sb-pol-cap sbw-c1">图 05 · 示意图</p>
  <div class="sb-tape-y sbw-tp1" data-shape="rect"></div>

  <div class="sb-pol sbw-p2" data-shape="rect"></div>
  <img class="sb-photo sbw-i2" src="assets/img/13-step2.jpg" alt="示意图：填版式空间平面">
  <p class="sb-pol-cap sbw-c2">图 06 · 示意图</p>
  <div class="sb-tape-b sbw-tp2" data-shape="rect"></div>

  <div class="sb-pol sbw-p3" data-shape="rect"></div>
  <img class="sb-photo sbw-i3" src="assets/img/13-step3.jpg" alt="示意图：过校验窗格光影">
  <p class="sb-pol-cap sbw-c3">图 07 · 示意图</p>
  <div class="sb-tape-p sbw-tp3" data-shape="rect"></div>

  <div class="sb-pol sbw-p4" data-shape="rect"></div>
  <img class="sb-photo sbw-i4" src="assets/img/13-step4.jpg" alt="示意图：导出地平线构图">
  <p class="sb-pol-cap sbw-c4">图 08 · 示意图</p>
  <div class="sb-tape-g sbw-tp4" data-shape="rect"></div>

  <p class="sb-hand sb-ac sbw-arr sbw-a1">→</p>
  <p class="sb-hand sb-ac sbw-arr sbw-a2">→</p>
  <p class="sb-hand sb-ac sbw-arr sbw-a3">→</p>

  <h3 class="sb-hand sbw-h sbw-x1" data-merge="s1" data-anim="rise">01 选风格</h3>
  <p class="sb-sans sbw-p sbw-x1" data-merge="s1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>

  <h3 class="sb-hand sbw-h sbw-x2" data-merge="s2" data-anim="rise">02 填版式</h3>
  <p class="sb-sans sbw-p sbw-x2" data-merge="s2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>

  <h3 class="sb-hand sbw-h sbw-x3" data-merge="s3" data-anim="rise">03 过校验</h3>
  <p class="sb-sans sbw-p sbw-x3" data-merge="s3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>

  <h3 class="sb-hand sbw-h sbw-x4" data-merge="s4" data-anim="rise"><span class="is-mark">04 导出</span></h3>
  <p class="sb-sans sbw-p sbw-x4" data-merge="s4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">配图均为示意图 · 来源：SKILL.md 工作流</p>
  <p class="sb-meta sb-ft-r">13 / 17</p>
</section>
```

## scrapbook/timeline · timeline

手账挂绳时间线（5 个节点）。贯穿全宽的深色主线配 5 枚圆形图钉与上方手写日期；线下以竖向彩色胶带悬挂 5 张交替微倾的小便签卡，最新里程碑「10.08 风格库」以明黄卡高亮。

```html
<section class="slide" data-layout="scrapbook/timeline" data-role="timeline">
  <p class="sb-meta sb-hd-l">No. 14 · 工作流</p>
  <p class="sb-meta sb-hd-r">TIMELINE</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">从一套版式，到<span class="is-mark">一座风格库</span>。</h2>
  <p class="sb-deck">2026 年核心版本演进手账（07.16 → 10.08）</p>

  <div class="sb-ink-rule sbl-line" data-shape="rect" data-anim="draw"></div>

  <p class="sb-hand sbl-date sbl-c1" data-anim="rise">07.16</p>
  <div class="sb-dot-y sbl-pin sbl-p1" data-shape="ellipse" data-anim="pop"></div>
  <div class="sb-note-w sbl-card sbl-c1 sbl-r1" data-shape="rect"></div>
  <div class="sb-tape-y sbl-tp sbl-t1" data-shape="rect"></div>
  <p class="sb-meta sb-ink-sub sbl-idx sbl-in1">#01</p>
  <h3 class="sb-hand sb-ink sbl-h sbl-in1" data-anim="rise">首版发布</h3>
  <p class="sb-sans sb-ink-sub sbl-p sbl-in1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>

  <p class="sb-hand sbl-date sbl-c2" data-anim="rise">07.18</p>
  <div class="sb-dot-g sbl-pin sbl-p2" data-shape="ellipse" data-anim="pop"></div>
  <div class="sb-note-w sbl-card sbl-c2 sbl-r2" data-shape="rect"></div>
  <div class="sb-tape-g sbl-tp sbl-t2" data-shape="rect"></div>
  <p class="sb-meta sb-ink-sub sbl-idx sbl-in2">#02</p>
  <h3 class="sb-hand sb-ink sbl-h sbl-in2" data-anim="rise">墨韵衬线</h3>
  <p class="sb-sans sb-ink-sub sbl-p sbl-in2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>

  <p class="sb-hand sbl-date sbl-c3" data-anim="rise">08.17</p>
  <div class="sb-dot-b sbl-pin sbl-p3" data-shape="ellipse" data-anim="pop"></div>
  <div class="sb-note-w sbl-card sbl-c3 sbl-r3" data-shape="rect"></div>
  <div class="sb-tape-b sbl-tp sbl-t3" data-shape="rect"></div>
  <p class="sb-meta sb-ink-sub sbl-idx sbl-in3">#03</p>
  <h3 class="sb-hand sb-ink sbl-h sbl-in3" data-anim="rise">校验全覆盖</h3>
  <p class="sb-sans sb-ink-sub sbl-p sbl-in3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>

  <p class="sb-hand sbl-date sbl-c4" data-anim="rise">08.18</p>
  <div class="sb-dot-p sbl-pin sbl-p4" data-shape="ellipse" data-anim="pop"></div>
  <div class="sb-note-w sbl-card sbl-c4 sbl-r4" data-shape="rect"></div>
  <div class="sb-tape-p sbl-tp sbl-t4" data-shape="rect"></div>
  <p class="sb-meta sb-ink-sub sbl-idx sbl-in4">#04</p>
  <h3 class="sb-hand sb-ink sbl-h sbl-in4" data-anim="rise">瑞士国际</h3>
  <p class="sb-sans sb-ink-sub sbl-p sbl-in4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>

  <p class="sb-hand sb-ac sbl-date sbl-c5" data-anim="rise">10.08</p>
  <div class="sb-dot-ac sbl-pin sbl-p5" data-shape="ellipse" data-anim="pop"></div>
  <div class="sb-note-y sbl-card sbl-c5 sbl-r5" data-shape="rect"></div>
  <div class="sb-tape-p sbl-tp sbl-t5" data-shape="rect"></div>
  <p class="sb-meta sb-ink-ac sbl-idx sbl-in5">#05 · 最新</p>
  <h3 class="sb-hand sb-ink sbl-h sbl-in5" data-anim="rise">风格库</h3>
  <p class="sb-sans sb-ink-sub sbl-p sbl-in5" data-anim="rise">十二种风格，版式独立。</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：git log（2026-07-16 → 2026-10-08）</p>
  <p class="sb-meta sb-ft-r">14 / 17</p>
</section>
```

## scrapbook/cycle · cycle

夜间闭环手账页（`is-dark`，4 节点带回路）。左侧粉笔虚线圆环上贴 4 张粉彩倾斜便签节点（黄、绿、粉、蓝）与四角方向箭头，中心落「4 步一闭环」；右侧深色虚线清单卡逐条拆解并收束回起点。

```html
<section class="slide is-dark" data-layout="scrapbook/cycle" data-role="cycle">
  <p class="sb-meta sb-hd-l">No. 15 · 工作流</p>
  <p class="sb-meta sb-hd-r">FEEDBACK LOOP</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">每次改动，都绕<span class="is-mark">这一圈</span></h2>

  <div class="sby-ring" data-shape="ellipse" data-anim="fade"></div>
  <p class="sb-num sb-ac sby-core-n" data-anim="count">4</p>
  <p class="sb-hand-reg sb-sub sby-core-l">步一闭环</p>

  <div class="sb-note-y sby-node sby-n1" data-shape="rect" data-anim="ring"></div>
  <p class="sb-hand sb-ink sby-nt sby-nt1">01 改版式</p>

  <div class="sb-note-g sby-node sby-n2" data-shape="rect" data-anim="ring"></div>
  <p class="sb-hand sb-ink sby-nt sby-nt2">02 过校验</p>

  <div class="sb-note-p sby-node sby-n3" data-shape="rect" data-anim="ring"></div>
  <p class="sb-hand sb-ink sby-nt sby-nt3">03 渲染比对</p>

  <div class="sb-note-b sby-node sby-n4" data-shape="rect" data-anim="ring"></div>
  <p class="sb-hand sb-ink sby-nt sby-nt4">04 记基线</p>

  <p class="sb-hand sb-ac sby-ar sby-ar1">↘</p>
  <p class="sb-hand sb-ac sby-ar sby-ar2">↙</p>
  <p class="sb-hand sb-ac sby-ar sby-ar3">↖</p>
  <p class="sb-hand sb-ac sby-ar sby-ar4">↗</p>

  <div class="sb-card-dark sby-panel" data-shape="rect"></div>
  <div class="sb-tape-y sby-tp" data-shape="rect"></div>
  <p class="sb-hand sb-ac sby-ph">✦ 修订与基线回路</p>

  <p class="sb-ui sb-ac sby-rn" style="top: 268px;">01</p>
  <h3 class="sb-hand sby-rh" style="top: 266px;" data-anim="rise">改版式</h3>
  <p class="sb-sans sby-rd" style="top: 270px;">调整版式结构与几何参数</p>
  <div class="sb-rule sby-hr" data-shape="rect" style="top: 320px;"></div>

  <p class="sb-ui sb-ac sby-rn" style="top: 342px;">02</p>
  <h3 class="sb-hand sby-rh" style="top: 340px;" data-anim="rise">过校验</h3>
  <p class="sb-sans sby-rd" style="top: 344px;">十六条机器规则错误清零</p>
  <div class="sb-rule sby-hr" data-shape="rect" style="top: 394px;"></div>

  <p class="sb-ui sb-ac sby-rn" style="top: 416px;">03</p>
  <h3 class="sb-hand sby-rh" style="top: 414px;" data-anim="rise">渲染比对</h3>
  <p class="sb-sans sby-rd" style="top: 418px;">逐页出图并与基线目检比对</p>
  <div class="sb-rule sby-hr" data-shape="rect" style="top: 468px;"></div>

  <p class="sb-ui sb-ac sby-rn" style="top: 490px;">04</p>
  <h3 class="sb-hand sby-rh" style="top: 488px;" data-anim="rise">记基线</h3>
  <p class="sb-sans sby-rd" style="top: 492px;">归档通过检验的黄金参考帧</p>
  <div class="sb-rule sby-hr" data-shape="rect" style="top: 542px;"></div>

  <p class="sb-hand sb-ac sby-back">↺ 回到 01 改版式，持续迭代</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：scripts/baseline.mjs（基线前先过 check-style 与 validate）</p>
  <p class="sb-meta sb-ft-r">15 / 17</p>
</section>
```

## scrapbook/system · system

三层纸垫嵌套架构页（3 层嵌套）。左侧以深牛皮纸底垫（`base.css`）→ 白纸层（`style.css`）→ 倾斜明黄便签（`brand.css`）层层叠加并贴胶带；右侧三张对应色系说明卡逐层阐释职责。

```html
<section class="slide" data-layout="scrapbook/system" data-role="system">
  <p class="sb-meta sb-hd-l">No. 16 · 工作流</p>
  <p class="sb-meta sb-hd-r">STYLE LAYERS</p>
  <div class="sb-rule sb-hd-rule" data-shape="rect"></div>

  <h2 class="sb-hand sb-title" data-anim="rise">三层样式，<span class="is-mark">各管一层</span></h2>

  <div class="sbs-m1" data-shape="rect" data-anim="scale"></div>
  <div class="sb-tape-y sbs-tp1" data-shape="rect"></div>
  <p class="sb-ui sb-ink sbs-l1">外层 · base.css</p>

  <div class="sb-note-w sbs-m2" data-shape="rect" data-anim="scale"></div>
  <p class="sb-ui sb-ink sbs-l2">中层 · style.css</p>

  <div class="sb-note-y sbs-m3" data-shape="rect" data-anim="scale"></div>
  <div class="sb-tape-p sbs-tp2" data-shape="rect"></div>
  <p class="sb-ui sb-ink-ac sbs-l3">内层 · brand.css</p>
  <p class="sb-hand sb-ink sbs-l3b">只改 token 品牌色</p>

  <div class="sb-note-k sbs-card" data-shape="rect" style="top: 184px;"></div>
  <p class="sb-meta sb-ink-ac sbs-tag" style="top: 204px;">外层 · 公共底座</p>
  <h3 class="sb-hand sb-ink sbs-ch" style="top: 238px;" data-anim="rise">base.css</h3>
  <p class="sb-sans sb-ink sbs-cp" style="top: 222px;">画布、元素契约、形状原语</p>

  <div class="sb-note-w sbs-card" data-shape="rect" style="top: 338px;"></div>
  <p class="sb-meta sb-ink-ac sbs-tag" style="top: 358px;">中层 · 风格包</p>
  <h3 class="sb-hand sb-ink sbs-ch" style="top: 392px;" data-anim="rise">style.css</h3>
  <p class="sb-sans sb-ink sbs-cp" style="top: 376px;">风格的 token、字体与全部版式</p>

  <div class="sb-note-y sbs-card" data-shape="rect" style="top: 492px;"></div>
  <p class="sb-meta sb-ink-ac sbs-tag" style="top: 512px;">内层 · 品牌覆写</p>
  <h3 class="sb-hand sb-ink sbs-ch" style="top: 546px;" data-anim="rise">brand.css</h3>
  <p class="sb-sans sb-ink sbs-cp" style="top: 530px;">只改 token 的品牌色</p>

  <div class="sb-rule sb-ft-rule" data-shape="rect"></div>
  <p class="sb-meta sb-ft-l">来源：风格库 spec §3.1</p>
  <p class="sb-meta sb-ft-r">16 / 17</p>
</section>
```

## scrapbook/closing · closing

夜间手账封底页（`is-dark`）。深褐黑板底 + 虚线手账框配对角胶带；左侧双行 74px 霞鹜文楷收尾大标题 + 命令代码卡 + 画廊指引；右侧贴一张倾斜浅绿便利贴记录本套手账的风格档案。

```html
<section class="slide is-dark" data-layout="scrapbook/closing" data-role="closing">
  <p class="sb-meta sb-hd-l">No. 17 · 封底</p>
  <p class="sb-meta sb-hd-r">ZIFEIYU PPT SKILL</p>

  <div class="sbe-frame" data-shape="rect"></div>
  <div class="sb-tape-y sbe-tp1" data-shape="rect"></div>
  <div class="sb-tape-p sbe-tp2" data-shape="rect"></div>

  <p class="sb-hand sb-ac sbe-kicker">✦ 合上手账 · 开启下一份</p>
  <h2 class="sb-hand sbe-t1" data-merge="title" data-anim="rise">挑一种风格，</h2>
  <h2 class="sb-hand sbe-t2" data-merge="title" data-anim="rise"><span class="is-mark">开始下一份。</span></h2>

  <div class="sbe-cmd-box" data-shape="rect"></div>
  <p class="sb-ui sb-ac sbe-cmd">node scripts/new-deck.mjs my-deck --style scrapbook</p>
  <p class="sb-hand-reg sb-sub sbe-gal">风格画廊：docs/styles/index.html</p>
  <p class="sb-meta sbe-tag">一源三出 · 浏览器演示 · PPTX · PDF · PNG</p>

  <div class="sb-note-g sbe-note" data-shape="rect"></div>
  <div class="sb-tape-b sbe-ntp" data-shape="rect"></div>
  <h3 class="sb-hand sb-ink-ac sbe-nh">✎ 手账档案</h3>
  <p class="sb-sans sb-ink sbe-nd" style="top: 264px;">风格代号：J · 拼贴 · 手账</p>
  <p class="sb-sans sb-ink sbe-nd" style="top: 316px;">所属分组：影像叙事</p>
  <p class="sb-sans sb-ink sbe-nd" style="top: 368px;">适合场合：社群 · 活动回顾 · 校园 · 生活方式</p>
  <p class="sb-sans sb-ink sbe-nd" style="top: 454px;">字体搭配：霞鹜文楷 · 思源黑体 · Inter</p>

  <p class="sb-meta sb-ft-l">ZIFEIYU PPT SKILL · 风格 J 拼贴 · 手账</p>
  <p class="sb-meta sb-ft-r">17 / 17</p>
</section>
```
