# 报刊 · 版面（broadsheet）版式注册表

> 状态：ready · 17 个版式，覆盖全部 12 个核心角色 + matrix / bars / table / cycle / system。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/broadsheet/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **报刊天头与地脚**：左版次标签（`br-mono br-ed`，top 30，16px）+ 右刊名（`br-mono br-mast`）→ 3px 粗墨线（`br-r3 br-top-rule`，top 56）；底部 3px 粗墨线（`br-r3 br-bot-rule`，top 656）→ 左出处 / 刊脚（`br-foot`，数据页挂 `data-source`），右页次（`br-pageno`，格式 `01 / 17`）。
2. **粗细双线与竖分栏线**：所有水平线（`br-r3` 3px / `br-r1` 1px）和垂直分栏线（`br-vr` 1px）均使用 `<div data-shape="rect">`，不写单边 CSS border（R16）；报头、章节与封底用 1px + 3px 双线收束。
3. **暗红克制使用**：暗红（`#b3121f`，暗版提亮为 `#e03c48`）只用于栏目名（`br-rubric`）、流程中文大写编号（`壹 / 贰 / 叁 / 肆`）或全页唯一重点数字 / 条形；其余全篇保持墨黑与暖报纸色。
4. **字体分工**：报头、主标题、大数字与栏目名用思源宋体 Heavy 900（`br-heavy` / `br-num` / `br-rubric`，Office 回退 SimSun 粗体）；小标题与表头用思源宋体 Bold 700（`br-serif`）；正文走系统无衬线两端对齐（`br-body`，`PingFang SC` → `Microsoft YaHei`）；版眉、页脚、日期与命令用 `JetBrains Mono`（`br-mono`，16px 起步，Office 回退 `Consolas`）。
5. **页面状态与节奏**：默认暖报纸浅底（`#f3efe6`）；特刊页（`statement` / `image` / `cycle` / `closing`）挂 `slide is-dark` 切为墨黑暗版（`#141413`），避免长段连续浅页（R15）。
6. **文字与容器分离**：所有文字槽位均无背景、描边、阴影与内边距（R16），高亮底色块与左侧暗红条均由底层的 `[data-shape="rect"]` 承担。

## broadsheet/cover · cover

头版封面。等宽版眉 + 3px 粗墨线 → 居中 84px 极粗宋体报头 → 1px + 3px 双线 → 通栏导语 → 1px 细线 → 左大图（712×324）配图注、1px 竖线、右暗红栏目名 + 两端对齐正文与本期导览 → 底部 3px 粗墨线与刊脚。

```html
<section class="slide" data-layout="broadsheet/cover" data-role="cover">
  <p class="br-mono br-ed">第 01 版 · 2026 年 10 月</p>
  <p class="br-mono br-mast">风格 D · 报刊版面</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h1 class="br-heavy brc-masthead" data-anim="rise">一份源文件 · 三种交付</h1>
  <div class="br-r1 brc-r1" data-shape="rect"></div>
  <div class="br-r3 brc-r3" data-shape="rect"></div>
  <h2 class="br-heavy brc-lead" data-anim="rise">浏览器里直接演示，再一键导出可编辑 PPTX、矢量 PDF 与逐页 PNG。</h2>
  <div class="br-r1 brc-r1b" data-shape="rect"></div>
  <img class="br-photo brc-img" src="assets/img/01-cover.jpg" alt="示意图：暖报纸色调与暗红立板构成的空间">
  <p class="br-mono brc-cap">图 01 · 示意图</p>
  <div class="br-vr brc-vr" data-shape="rect"></div>
  <p class="br-rubric brc-rubric" data-merge="lead">网页 PPT · 可编辑导出</p>
  <p class="br-body brc-body" data-merge="lead" data-anim="rise">HTML 是唯一的源，PPTX、PDF 与 PNG 是一键衍生物。先选风格再填内容，浏览器排好后再逐个测量位置、尺寸、字号与颜色，按同样坐标写进原生可编辑文档，十六条规则把关交付。</p>
  <div class="br-r1 brc-subrule" data-shape="rect"></div>
  <p class="br-rubric brc-rubric2" data-merge="brief">本期导览</p>
  <p class="br-body brc-body2" data-merge="brief" data-anim="rise">风格库十二种独立版式 · 测量与原生导出 · 十六条质量门规则 · 四步工作流。</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">ZIFEIYU PPT SKILL · 报刊 · 版面</p>
  <p class="br-mono br-pageno">01 / 17</p>
</section>
```

## broadsheet/agenda · agenda

版面目录。左栏版面导读配图（356×248）与说明，1px 竖线隔开；右栏 4 行「宋体编号 / 章节名 / 一句说明 / 版次」，行距 116px，行间 1px 细线；首项编号上暗红。

```html
<section class="slide" data-layout="broadsheet/agenda" data-role="agenda">
  <p class="br-mono br-ed">第 02 版 · 目录</p>
  <p class="br-mono br-mast">ZIFEIYU PPT SKILL</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy bra-title" data-anim="rise">本期目录</h2>
  <p class="bra-deck">全刊四辑十七版 · 内容总览</p>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <p class="br-rubric bra-rubric">版面导读</p>
  <img class="br-photo bra-img" src="assets/img/02-agenda.jpg" alt="示意图：报刊暖纸光影构图">
  <p class="br-mono bra-cap">图 02 · 示意图</p>
  <div class="br-r1 bra-lrule" data-shape="rect"></div>
  <p class="br-body bra-note">全刊分为风格库、测量与导出、质量门与工作流四辑，各版均按角色登记并通过校验。</p>
  <div class="br-vr bra-vr" data-shape="rect"></div>
  <p class="br-num br-ac bra-num" style="top: 184px;" data-anim="rise">01</p>
  <h3 class="br-heavy bra-item" style="top: 186px;" data-merge="a1" data-anim="rise">风格库</h3>
  <p class="bra-desc" style="top: 228px;" data-merge="a1" data-anim="rise">十二种风格，开场先挑一种</p>
  <p class="br-mono bra-page" style="top: 198px;">第 04 版</p>
  <div class="br-r1 bra-hair" data-shape="rect" style="top: 288px;"></div>
  <p class="br-num bra-num" style="top: 300px;" data-anim="rise">02</p>
  <h3 class="br-heavy bra-item" style="top: 302px;" data-merge="a2" data-anim="rise">测量与导出</h3>
  <p class="bra-desc" style="top: 344px;" data-merge="a2" data-anim="rise">先量后画，文字始终可编辑</p>
  <p class="br-mono bra-page" style="top: 314px;">第 07 版</p>
  <div class="br-r1 bra-hair" data-shape="rect" style="top: 404px;"></div>
  <p class="br-num bra-num" style="top: 416px;" data-anim="rise">03</p>
  <h3 class="br-heavy bra-item" style="top: 418px;" data-merge="a3" data-anim="rise">质量门</h3>
  <p class="bra-desc" style="top: 460px;" data-merge="a3" data-anim="rise">十六条规则，错误清零才交付</p>
  <p class="br-mono bra-page" style="top: 430px;">第 10 版</p>
  <div class="br-r1 bra-hair" data-shape="rect" style="top: 520px;"></div>
  <p class="br-num bra-num" style="top: 532px;" data-anim="rise">04</p>
  <h3 class="br-heavy bra-item" style="top: 534px;" data-merge="a4" data-anim="rise">工作流</h3>
  <p class="bra-desc" style="top: 576px;" data-merge="a4" data-anim="rise">从大纲到成稿的四步</p>
  <p class="br-mono bra-page" style="top: 546px;">第 13 版</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">ZIFEIYU PPT SKILL · 目录</p>
  <p class="br-mono br-pageno">02 / 17</p>
</section>
```

## broadsheet/statement · statement

社论暗版页（`is-dark`）。顶部 3px + 1px 双线 → 暗红栏目名与短红条 → 两行 72px 极粗宋体引文（每行一个 h2）→ 1px 分隔线 → 左出处、右简评。

```html
<section class="slide is-dark" data-layout="broadsheet/statement" data-role="statement">
  <p class="br-mono br-ed">第 03 版 · 社论</p>
  <p class="br-mono br-mast">设计原则</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <div class="br-r1 brq-r1" data-shape="rect"></div>
  <p class="br-rubric brq-rubric">社论 · 核心主张</p>
  <div class="br-red brq-bar" data-shape="rect" data-anim="draw"></div>
  <h2 class="br-heavy brq-line brq-l1" data-merge="quote" data-anim="rise">HTML 是唯一的源，</h2>
  <h2 class="br-heavy brq-line brq-l2" data-merge="quote" data-anim="rise">其余都是衍生物。</h2>
  <div class="br-r1 brq-rule" data-shape="rect"></div>
  <p class="brq-by">— SKILL.md · 设计原则</p>
  <p class="brq-note">浏览器排布即终稿坐标，导出器逐项测量，交付可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">ZIFEIYU PPT SKILL · 社论</p>
  <p class="br-mono br-pageno">03 / 17</p>
</section>
```

## broadsheet/section · section

篇章扉页。左栏暗红辑名 + 220px 极粗宋体章节号 + 1px 细线与简述；1px 竖线隔开；右栏 84px 章节标题 + 1px/3px 双线 + 全刊四辑导航，当前辑以暗红竖条和暗红字标亮。

```html
<section class="slide" data-layout="broadsheet/section" data-role="section">
  <p class="br-mono br-ed">第 04 版 · 篇章</p>
  <p class="br-mono br-mast">第一辑</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <p class="br-rubric brx-rubric">第一辑 · 篇章</p>
  <p class="br-num brx-num" data-anim="rise">01</p>
  <div class="br-r1 brx-lrule" data-shape="rect"></div>
  <p class="br-body brx-desc">十二种风格各有一套独立版式，按页面角色统一登记。先按场合选风格，再依内容形状落版面。</p>
  <div class="br-vr brx-vr" data-shape="rect"></div>
  <h2 class="br-heavy brx-title" data-anim="rise">风格库</h2>
  <div class="br-r1 brx-r1" data-shape="rect" data-anim="draw"></div>
  <div class="br-r3 brx-r3" data-shape="rect" data-anim="draw"></div>
  <div class="br-red brx-mark" data-shape="rect" style="top: 268px;"></div>
  <p class="br-num brx-n brx-now" style="top: 270px;">01</p>
  <p class="br-heavy brx-i brx-now" style="top: 268px;">风格库</p>
  <p class="br-mono brx-p" style="top: 274px;">第 04 版</p>
  <div class="br-r1 brx-hair" data-shape="rect" style="top: 332px;"></div>
  <p class="br-num brx-n" style="top: 350px;">02</p>
  <p class="brx-i" style="top: 348px;">测量与导出</p>
  <p class="br-mono brx-p" style="top: 354px;">第 07 版</p>
  <div class="br-r1 brx-hair" data-shape="rect" style="top: 412px;"></div>
  <p class="br-num brx-n" style="top: 430px;">03</p>
  <p class="brx-i" style="top: 428px;">质量门</p>
  <p class="br-mono brx-p" style="top: 434px;">第 10 版</p>
  <div class="br-r1 brx-hair" data-shape="rect" style="top: 492px;"></div>
  <p class="br-num brx-n" style="top: 510px;">04</p>
  <p class="brx-i" style="top: 508px;">工作流</p>
  <p class="br-mono brx-p" style="top: 514px;">第 13 版</p>
  <div class="br-r1 brx-hair" data-shape="rect" style="top: 572px;"></div>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">ZIFEIYU PPT SKILL · 第一辑</p>
  <p class="br-mono br-pageno">04 / 17</p>
</section>
```

## broadsheet/matrix · matrix

分类索引表（12 项 + 总数）。左栏 152px 总数与五组说明；1px 竖线右侧 3 栏 × 4 行报刊分类格，栏间竖线、行间横线，当前风格格加暖纸灰底与暗红左竖条。

```html
<section class="slide" data-layout="broadsheet/matrix" data-role="matrix">
  <p class="br-mono br-ed">第 05 版 · 风格库</p>
  <p class="br-mono br-mast">风格索引</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy brm-title" data-anim="rise">十二种风格，按场合挑一种。</h2>
  <p class="brm-deck">分五组：编辑排印、商务理性、舞台冲击、影像叙事、东方人文</p>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <p class="br-rubric brm-rubric">收录总数</p>
  <p class="br-num brm-hero" data-anim="count">12</p>
  <h3 class="br-heavy brm-label" data-merge="hero" data-anim="rise">种风格</h3>
  <div class="br-r1 brm-lrule" data-shape="rect"></div>
  <p class="br-body brm-sub" data-merge="hero" data-anim="rise">覆盖编辑排印、商务理性、舞台冲击、影像叙事、东方人文五大谱系，每种均具独立版式。</p>
  <div class="br-vr brm-vr brm-v0" data-shape="rect"></div>
  <div class="br-vr brm-vr brm-v1" data-shape="rect"></div>
  <div class="br-vr brm-vr brm-v2" data-shape="rect"></div>
  <div class="br-r1 brm-hair" data-shape="rect" style="top: 288px;"></div>
  <div class="br-r1 brm-hair" data-shape="rect" style="top: 404px;"></div>
  <div class="br-r1 brm-hair" data-shape="rect" style="top: 520px;"></div>
  <div class="br-tint brm-active" data-shape="rect"></div>
  <div class="br-red brm-abar" data-shape="rect"></div>
  <p class="br-num brm-let brm-c1" style="top: 186px;">A</p>
  <p class="br-mono brm-grp brm-c1g" style="top: 192px;">编辑排印</p>
  <h3 class="br-serif brm-name brm-c1" style="top: 230px;">杂志 · 暖纸</h3>
  <p class="br-num brm-let brm-c2" style="top: 186px;">B</p>
  <p class="br-mono brm-grp brm-c2g" style="top: 192px;">商务理性</p>
  <h3 class="br-serif brm-name brm-c2" style="top: 230px;">瑞士 · 网格</h3>
  <p class="br-num brm-let brm-c3" style="top: 186px;">C</p>
  <p class="br-mono brm-grp brm-c3g" style="top: 192px;">舞台冲击</p>
  <h3 class="br-serif brm-name brm-c3" style="top: 230px;">发布会 · 暗场</h3>
  <p class="br-num br-ac brm-let brm-c1" style="top: 302px;">D</p>
  <p class="br-mono br-ac brm-grp brm-c1g" style="top: 308px;">编辑排印</p>
  <h3 class="br-heavy brm-name brm-c1" style="top: 346px;">报刊 · 版面</h3>
  <p class="br-num brm-let brm-c2" style="top: 302px;">E</p>
  <p class="br-mono brm-grp brm-c2g" style="top: 308px;">舞台冲击</p>
  <h3 class="br-serif brm-name brm-c2" style="top: 346px;">大字报 · 粗野</h3>
  <p class="br-num brm-let brm-c3" style="top: 302px;">F</p>
  <p class="br-mono brm-grp brm-c3g" style="top: 308px;">商务理性</p>
  <h3 class="br-serif brm-name brm-c3" style="top: 346px;">柔和 · 产品</h3>
  <p class="br-num brm-let brm-c1" style="top: 418px;">G</p>
  <p class="br-mono brm-grp brm-c1g" style="top: 424px;">影像叙事</p>
  <h3 class="br-serif brm-name brm-c1" style="top: 462px;">摄影集 · 画册</h3>
  <p class="br-num brm-let brm-c2" style="top: 418px;">H</p>
  <p class="br-mono brm-grp brm-c2g" style="top: 424px;">商务理性</p>
  <h3 class="br-serif brm-name brm-c2" style="top: 462px;">咨询 · 白皮书</h3>
  <p class="br-num brm-let brm-c3" style="top: 418px;">I</p>
  <p class="br-mono brm-grp brm-c3g" style="top: 424px;">东方人文</p>
  <h3 class="br-serif brm-name brm-c3" style="top: 462px;">日式 · 极简</h3>
  <p class="br-num brm-let brm-c1" style="top: 534px;">J</p>
  <p class="br-mono brm-grp brm-c1g" style="top: 540px;">影像叙事</p>
  <h3 class="br-serif brm-name brm-c1" style="top: 578px;">拼贴 · 手账</h3>
  <p class="br-num brm-let brm-c2" style="top: 534px;">K</p>
  <p class="br-mono brm-grp brm-c2g" style="top: 540px;">东方人文</p>
  <h3 class="br-serif brm-name brm-c2" style="top: 578px;">新中式 · 东方</h3>
  <p class="br-num brm-let brm-c3" style="top: 534px;">L</p>
  <p class="br-mono brm-grp brm-c3g" style="top: 540px;">商务理性</p>
  <h3 class="br-serif brm-name brm-c3" style="top: 578px;">工程制图</h3>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：docs/superpowers/specs/2026-10-08-style-library-design.md §2</p>
  <p class="br-mono br-pageno">05 / 17</p>
</section>
```

## broadsheet/compare · compare

双栏正反对照。两栏各宽 552px，中置 1px 竖线；左栏暖纸灰标头（「之前」），右栏墨黑标头 + 暗红左竖条（「现在」）；每栏小标题、两端对齐正文、1px 细线与 104px 宋体数字（右侧数字上暗红）。

```html
<section class="slide" data-layout="broadsheet/compare" data-role="compare">
  <p class="br-mono br-ed">第 06 版 · 风格库</p>
  <p class="br-mono br-mast">架构对照</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">换皮，不如换版面。</h2>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <div class="br-vr brv-vr" data-shape="rect"></div>
  <div class="br-tint brv-head brv-l" data-shape="rect"></div>
  <div class="br-ink brv-head brv-r" data-shape="rect"></div>
  <div class="br-red brv-bar" data-shape="rect"></div>
  <p class="br-serif brv-hl brv-tl">之前 · 旧架构</p>
  <p class="br-serif br-on brv-hl brv-tr">现在 · 风格库</p>
  <h3 class="br-heavy brv-h brv-l" data-merge="l" data-anim="rise">通用版式，换主题即换色</h3>
  <p class="br-body brv-p brv-l" data-merge="l" data-anim="rise">三套设计系统共用 L01–L24，换一个主题文件整套换色，版面结构始终一样。</p>
  <div class="br-r1 brv-rule brv-l" data-shape="rect"></div>
  <p class="br-num brv-num brv-l" data-anim="count">24</p>
  <p class="br-serif brv-nl brv-nll" data-merge="ln" data-anim="rise">个版式，三套系统共用</p>
  <p class="br-note brv-sub brv-nll" data-merge="ln" data-anim="rise">结构同构，仅靠配色与字体区分</p>
  <h3 class="br-heavy brv-h brv-r" data-merge="r" data-anim="rise">独立版式，选风格即选版面</h3>
  <p class="br-body brv-p brv-r" data-merge="r" data-anim="rise">十二种风格各有一套版式，按角色登记；校验与导出只认角色，不认风格。</p>
  <div class="br-r1 brv-rule brv-r" data-shape="rect"></div>
  <p class="br-num br-ac brv-num brv-r" data-anim="count">12</p>
  <p class="br-serif brv-nl brv-nlr" data-merge="rn" data-anim="rise">种风格，各有一套版式</p>
  <p class="br-note brv-sub brv-nlr" data-merge="rn" data-anim="rise">角色层解耦，每种风格各自成篇</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：references/layouts.md（L01–L24）· 风格库 spec §1、§3.2</p>
  <p class="br-mono br-pageno">06 / 17</p>
</section>
```

## broadsheet/image-text · image-text

图文专版。左栏主图（616×420）配图注，1px 竖线隔开；右栏暗红栏目名、两段两端对齐正文（每段 ≤55 字）、1px 细线与底部暖纸灰规格摘录框。

```html
<section class="slide" data-layout="broadsheet/image-text" data-role="image-text">
  <p class="br-mono br-ed">第 07 版 · 测量与导出</p>
  <p class="br-mono br-mast">深度报道</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">所见即所得，靠的是测量。</h2>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <img class="br-photo bri-img" src="assets/img/07-feature.jpg" alt="示意图：报刊暖纸与暗红几何平面的坐标构图">
  <p class="br-mono bri-cap">图 03 · 示意图 — 浏览器排布与原生导出坐标映射</p>
  <div class="br-vr bri-vr" data-shape="rect"></div>
  <p class="br-rubric bri-rubric">测量与原生映射</p>
  <p class="br-body bri-p bri-p1" data-merge="body" data-anim="rise">导出器先让浏览器把每一页排好，再逐个量出元素的位置、尺寸、字号与颜色，按同样的坐标写进 PPTX。</p>
  <p class="br-body bri-p bri-p2" data-merge="body" data-anim="rise">圆角、描边、阴影、旋转与竖排换成 PowerPoint 原生形状；画不出的装饰单独截图，文字始终可编辑。</p>
  <div class="br-r1 bri-rule" data-shape="rect"></div>
  <div class="br-tint bri-box" data-shape="rect"></div>
  <div class="br-red bri-edge" data-shape="rect"></div>
  <p class="br-rubric bri-key" data-merge="spec">导出原语</p>
  <p class="br-note bri-note" data-merge="spec">圆角矩形 · 直线 · 燕尾 · 旋转 · 阴影 · 竖排。所有文字均保留为原生可编辑文本框。</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：scripts/export-pptx.mjs、scripts/lib/snapshot.mjs</p>
  <p class="br-mono br-pageno">07 / 17</p>
</section>
```

## broadsheet/image · image

满版图 + 底部暗版报刊压栏（`is-dark`）。图片 1280×720 满出血，底部 248px 实底墨黑压栏带 3px 顶线、暗红栏目名、标题与说明，右侧竖线隔出图注与出处。

```html
<section class="slide is-dark" data-layout="broadsheet/image" data-role="image">
  <img class="br-photo brf-img" src="assets/img/08-image.jpg" alt="示意图：报刊暖纸与暗红远山层峦">
  <div class="brf-plate" data-shape="rect"></div>
  <div class="br-r3 brf-r3" data-shape="rect"></div>
  <p class="br-rubric brf-rubric">影像专题 · 第 08 版</p>
  <h2 class="br-heavy brf-title" data-anim="rise">先选风格，再写内容</h2>
  <p class="brf-p" data-anim="rise">风格决定版面，版面决定一页能放多少字。</p>
  <div class="br-vr brf-vr" data-shape="rect"></div>
  <p class="br-mono brf-cap">图 04 · 示意图</p>
  <p class="br-note brf-src">出处：SKILL.md 第 1 步 Q2（选风格在填内容之前）</p>
  <div class="br-r1 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">ZIFEIYU PPT SKILL · 影像专题</p>
  <p class="br-mono br-pageno">08 / 17</p>
</section>
```

## broadsheet/points · points

三栏评述。三等分 352px 报刊栏（64 / 464 / 864），栏间 1px 竖线；每栏暗红小栏目名 → 3px 短墨线 → 80px 宋体序号 → 小标题 → 1px 细线 → 两端对齐正文 → 底部暖纸灰摘要条。

```html
<section class="slide" data-layout="broadsheet/points" data-role="points">
  <p class="br-mono br-ed">第 09 版 · 测量与导出</p>
  <p class="br-mono br-mast">三栏评述</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">三件事，件件可验证。</h2>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <div class="br-vr brt-vr brt-v1" data-shape="rect"></div>
  <div class="br-vr brt-vr brt-v2" data-shape="rect"></div>
  <p class="br-rubric brt-rubric brt-c1">要点 壹</p>
  <div class="br-r3 brt-r3 brt-c1" data-shape="rect"></div>
  <p class="br-num brt-num brt-c1">01</p>
  <h3 class="br-heavy brt-h brt-c1" data-merge="p1" data-anim="rise">浏览器里演示</h3>
  <div class="br-r1 brt-r1 brt-c1" data-shape="rect"></div>
  <p class="br-body brt-p brt-c1" data-merge="p1" data-anim="rise">方向键翻页，F 全屏，S 打开演讲者控制台，讲稿只给自己看。</p>
  <div class="br-tint brt-box brt-c1" data-shape="rect"></div>
  <p class="br-mono brt-tag brt-i1">F 全屏 · S 演讲者控制台</p>
  <p class="br-rubric brt-rubric brt-c2">要点 贰</p>
  <div class="br-r3 brt-r3 brt-c2" data-shape="rect"></div>
  <p class="br-num brt-num brt-c2">02</p>
  <h3 class="br-heavy brt-h brt-c2" data-merge="p2" data-anim="rise">可编辑的 PPTX</h3>
  <div class="br-r1 brt-r1 brt-c2" data-shape="rect"></div>
  <p class="br-body brt-p brt-c2" data-merge="p2" data-anim="rise">文字是原生文本框，形状是原生形状，交给同事也能接着改。</p>
  <div class="br-tint brt-box brt-c2" data-shape="rect"></div>
  <p class="br-mono brt-tag brt-i2">原生文本框 · 原生形状</p>
  <p class="br-rubric brt-rubric brt-c3">要点 叁</p>
  <div class="br-r3 brt-r3 brt-c3" data-shape="rect"></div>
  <p class="br-num brt-num brt-c3">03</p>
  <h3 class="br-heavy brt-h brt-c3" data-merge="p3" data-anim="rise">机器先把关</h3>
  <div class="br-r1 brt-r1 brt-c3" data-shape="rect"></div>
  <p class="br-body brt-p brt-c3" data-merge="p3" data-anim="rise">十六条规则查版式、字号、出处与导出一致性，错误清零才交付。</p>
  <div class="br-tint brt-box brt-c3" data-shape="rect"></div>
  <p class="br-mono brt-tag brt-i3">R1–R16 · 错误清零</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：SKILL.md 第 6、8 步</p>
  <p class="br-mono br-pageno">09 / 17</p>
</section>
```

## broadsheet/kpi · kpi

三栏数据专版。报刊天头 + 52px 极粗宋体标题 + 导语 → 1px 细线 → 三栏竖线分隔（每栏暗红指标名 + 124px 极粗宋体大字 + 1px 栏内细线 + 两端对齐说明）→ 3px 地脚线与 `data-source`。

```html
<section class="slide" data-layout="broadsheet/kpi" data-role="kpi">
  <p class="br-mono br-ed">质量门 · 第 10 版</p>
  <p class="br-mono br-mast">据本仓库校验与角色定义</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy brk-title" data-anim="rise">导出之前，先过十六道检查。</h2>
  <p class="brk-deck">校验规则、页面角色与导出格式三项指标，均来自本仓库校验器与角色注册表。</p>
  <div class="br-r1 brk-rule" data-shape="rect"></div>
  <div class="br-vr brk-vr brk-v1" data-shape="rect"></div>
  <div class="br-vr brk-vr brk-v2" data-shape="rect"></div>
  <p class="br-rubric brk-rubric brk-c1">校验规则（条）</p>
  <p class="br-num brk-num brk-c1" data-anim="count">16</p>
  <div class="br-r1 brk-r1 brk-c1" data-shape="rect"></div>
  <p class="br-body brk-desc brk-c1" data-anim="rise">R1–R16，从版式注册一路查到 PPTX 导出一致性。</p>
  <p class="br-rubric brk-rubric brk-c2">页面角色</p>
  <p class="br-num brk-num brk-c2" data-anim="count">20</p>
  <div class="br-r1 brk-r1 brk-c2" data-shape="rect"></div>
  <p class="br-body brk-desc brk-c2" data-anim="rise">其中 12 个是每种风格必须覆盖的核心角色。</p>
  <p class="br-rubric brk-rubric brk-c3">导出格式</p>
  <p class="br-num brk-num brk-c3" data-anim="count">3</p>
  <div class="br-r1 brk-r1 brk-c3" data-shape="rect"></div>
  <p class="br-body brk-desc brk-c3" data-anim="rise">PPTX · PDF · PNG，HTML 是唯一的源。</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot" data-source>来源：scripts/validate.mjs · scripts/lib/roles.mjs</p>
  <p class="br-mono br-pageno">10 / 17</p>
</section>
```

## broadsheet/bars · bars

条形统计图（3–6 行，行距 62px）。右对齐标签 → 条从 x 268 起（不画纵轴线，便于 `--native-charts` 替换），条长 = 数值 × 120px（满长 480px）→ 条尾 14px 写数值；右侧 1px 竖线外放规则编号附栏。仅一根关键条用暗红（`br-red` + `br-ac`）。页脚 `data-source` 必填。

```html
<section class="slide" data-layout="broadsheet/bars" data-role="bars">
  <p class="br-mono br-ed">第 11 版 · 质量门</p>
  <p class="br-mono br-mast">统计图表</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">十六条规则，各管一摊。</h2>
  <p class="br-deck">图表 · 各类校验规则条数分布（单位：条）</p>
  <div class="br-r1 br-head-rule" data-shape="rect"></div>
  <div class="br-vr brb-vr" data-shape="rect"></div>
  <p class="br-rubric brb-rubric">对应规则编号</p>
  <div class="br-r1 brb-srule" data-shape="rect" style="top: 230px;"></div>
  <h3 class="br-serif brb-label" style="top: 246px;" data-chart>排版与几何</h3>
  <div class="br-ink brb-bar" data-shape="rect" data-value="4" data-label="排版与几何" data-anim="grow-x" style="top: 240px; width: 480px;"></div>
  <p class="br-num brb-val" style="top: 246px; left: 762px;" data-chart>4</p>
  <p class="br-mono brb-ids" style="top: 248px;">R3 · R4 · R7 · R9</p>
  <h3 class="br-serif brb-label" style="top: 308px;" data-chart>版式与样式</h3>
  <div class="br-ink brb-bar" data-shape="rect" data-value="4" data-label="版式与样式" data-anim="grow-x" style="top: 302px; width: 480px;"></div>
  <p class="br-num brb-val" style="top: 308px; left: 762px;" data-chart>4</p>
  <p class="br-mono brb-ids" style="top: 310px;">R1 · R2 · R6 · R12</p>
  <h3 class="br-serif brb-label" style="top: 370px;" data-chart>内容与数据</h3>
  <div class="br-ink brb-bar" data-shape="rect" data-value="3" data-label="内容与数据" data-anim="grow-x" style="top: 364px; width: 360px;"></div>
  <p class="br-num brb-val" style="top: 370px; left: 642px;" data-chart>3</p>
  <p class="br-mono brb-ids" style="top: 372px;">R5 · R8 · R14</p>
  <h3 class="br-serif brb-label" style="top: 432px;" data-chart>可访问与媒体</h3>
  <div class="br-ink brb-bar" data-shape="rect" data-value="3" data-label="可访问与媒体" data-anim="grow-x" style="top: 426px; width: 360px;"></div>
  <p class="br-num brb-val" style="top: 432px; left: 642px;" data-chart>3</p>
  <p class="br-mono brb-ids" style="top: 434px;">R10 · R11 · R13</p>
  <h3 class="br-serif brb-label" style="top: 494px;" data-chart>节奏</h3>
  <div class="br-ink brb-bar" data-shape="rect" data-value="1" data-label="节奏" data-anim="grow-x" style="top: 488px; width: 120px;"></div>
  <p class="br-num brb-val" style="top: 494px; left: 402px;" data-chart>1</p>
  <p class="br-mono brb-ids" style="top: 496px;">R15</p>
  <h3 class="br-serif brb-label" style="top: 556px;" data-chart>导出一致</h3>
  <div class="br-red brb-bar" data-shape="rect" data-value="1" data-label="导出一致" data-anim="grow-x" style="top: 550px; width: 120px;"></div>
  <p class="br-num br-ac brb-val" style="top: 556px; left: 402px;" data-chart>1</p>
  <p class="br-mono brb-ids" style="top: 558px;">R16</p>
  <div class="br-r1 brb-srule" data-shape="rect" style="top: 602px;"></div>
  <p class="br-mono brb-foot">共 16 条 · 错误清零方可交付</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot" data-source>来源：scripts/validate.mjs 规则注释（R1–R16），按守护对象分组</p>
  <p class="br-mono br-pageno">11 / 17</p>
</section>
```

## broadsheet/table · table

报刊规格台账（4–6 行，行高 64px）。墨黑表头栏，偶数行暖纸灰底，1px 纵横格线分隔三栏（项目 / 规格 / 出处）；全表仅一处 `is-accent`。页脚 `data-source` 必填。

```html
<section class="slide" data-layout="broadsheet/table" data-role="table">
  <p class="br-mono br-ed">第 12 版 · 质量门</p>
  <p class="br-mono br-mast">规格台账</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">一页纸，看懂规格。</h2>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <div class="br-ink brd-head" data-shape="rect"></div>
  <p class="br-serif br-on brd-k brd-th">项目</p>
  <p class="br-serif br-on brd-v brd-th">规格</p>
  <p class="br-serif br-on brd-s brd-th">出处</p>
  <div class="br-tint brd-band" data-shape="rect" style="top: 288px;"></div>
  <div class="br-tint brd-band" data-shape="rect" style="top: 416px;"></div>
  <div class="br-tint brd-band" data-shape="rect" style="top: 544px;"></div>
  <div class="br-vr brd-vr brd-v1" data-shape="rect"></div>
  <div class="br-vr brd-vr brd-v2" data-shape="rect"></div>
  <div class="br-r1 brd-hr" data-shape="rect" style="top: 288px;"></div>
  <div class="br-r1 brd-hr" data-shape="rect" style="top: 352px;"></div>
  <div class="br-r1 brd-hr" data-shape="rect" style="top: 416px;"></div>
  <div class="br-r1 brd-hr" data-shape="rect" style="top: 480px;"></div>
  <div class="br-r1 brd-hr" data-shape="rect" style="top: 544px;"></div>
  <div class="br-r1 brd-hr" data-shape="rect" style="top: 608px;"></div>
  <h3 class="br-serif brd-k" style="top: 244px;">画布</h3>
  <p class="brd-v" style="top: 244px;">1280 × 720 px，导出时 px × 0.75 换算为 pt</p>
  <p class="br-mono brd-s" style="top: 246px;">assets/base.css</p>
  <h3 class="br-serif brd-k" style="top: 308px;">字号下限</h3>
  <p class="brd-v" style="top: 308px;">16 px，溢出先删字、再换版式</p>
  <p class="br-mono brd-s" style="top: 310px;">validate.mjs · R4</p>
  <h3 class="br-serif brd-k" style="top: 372px;">校验规则</h3>
  <p class="brd-v" style="top: 372px;">R1–R16，<span class="is-accent">错误清零</span>才能交付</p>
  <p class="br-mono brd-s" style="top: 374px;">validate.mjs</p>
  <h3 class="br-serif brd-k" style="top: 436px;">导出格式</h3>
  <p class="brd-v" style="top: 436px;">PPTX · PDF · PNG，HTML 是唯一的源</p>
  <p class="br-mono brd-s" style="top: 438px;">SKILL.md</p>
  <h3 class="br-serif brd-k" style="top: 500px;">页面角色</h3>
  <p class="brd-v" style="top: 500px;">20 个，其中 12 个核心角色</p>
  <p class="br-mono brd-s" style="top: 502px;">lib/roles.mjs</p>
  <h3 class="br-serif brd-k" style="top: 564px;">字体</h3>
  <p class="brd-v" style="top: 564px;">SIL OFL 开源字体，按 deck 用字子集化</p>
  <p class="br-mono brd-s" style="top: 566px;">fetch-fonts.mjs</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot" data-source>来源：表内「出处」列（本仓库文件）</p>
  <p class="br-mono br-pageno">12 / 17</p>
</section>
```

## broadsheet/process · process

四步通栏流程。左标题右导语 → 1px 细线 → 1152×188 宽幅专题横图 → 四栏竖线分隔，每栏暗红中文大写序数（`壹 / 贰 / 叁 / 肆`）配极粗宋体步骤名、1px 细线与两端对齐说明。

```html
<section class="slide" data-layout="broadsheet/process" data-role="process">
  <p class="br-mono br-ed">工作流 · 第 13 版</p>
  <p class="br-mono br-mast">四步成稿</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy brp-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="brp-lead">先选风格，再写内容：风格决定版面，版面决定一页能放多少字。按四步走完，一次交付。</p>
  <div class="br-r1 brp-rule" data-shape="rect"></div>
  <img class="br-photo brp-img" src="assets/img/13-process.jpg" alt="示意图：宽幅暖纸与暗红地平线层次">
  <div class="br-vr brp-vr brp-v1" data-shape="rect"></div>
  <div class="br-vr brp-vr brp-v2" data-shape="rect"></div>
  <div class="br-vr brp-vr brp-v3" data-shape="rect"></div>
  <p class="br-rubric brp-cn brp-c1">壹</p>
  <h3 class="br-heavy brp-name brp-n1" data-anim="rise">选风格</h3>
  <div class="br-r1 brp-r1 brp-c1" data-shape="rect"></div>
  <p class="br-body brp-p brp-c1" data-anim="rise">看风格画廊，按场合挑一种，整份 deck 只用这一种。</p>
  <p class="br-rubric brp-cn brp-c2">贰</p>
  <h3 class="br-heavy brp-name brp-n2" data-anim="rise">填版式</h3>
  <div class="br-r1 brp-r1 brp-c2" data-shape="rect"></div>
  <p class="br-body brp-p brp-c2" data-anim="rise">按内容形状找角色，复制版式骨架，只换文字和图片。</p>
  <p class="br-rubric brp-cn brp-c3">叁</p>
  <h3 class="br-heavy brp-name brp-n3" data-anim="rise">过校验</h3>
  <div class="br-r1 brp-r1 brp-c3" data-shape="rect"></div>
  <p class="br-body brp-p brp-c3" data-anim="rise">查类名、字号、出处与导出一致性，错误必须清零。</p>
  <p class="br-rubric brp-cn brp-c4">肆</p>
  <h3 class="br-heavy brp-name brp-n4" data-anim="rise">导出</h3>
  <div class="br-r1 brp-r1 brp-c4" data-shape="rect"></div>
  <p class="br-body brp-p brp-c4" data-anim="rise">一键得到可编辑 PPTX、矢量 PDF 与逐页 PNG。</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">图 05 · 示意图 · 来源：SKILL.md 工作流</p>
  <p class="br-mono br-pageno">13 / 17</p>
</section>
```

## broadsheet/timeline · timeline

五栏编年时间线。五等分 200px 报刊栏配 1px 竖分栏线，3px 粗墨横轴贯穿全版；轴上排年份标签与 56px 宋体日期，轴上置方块刻度，轴下排里程碑名、1px 细线与说明；最新节点上暗红。

```html
<section class="slide" data-layout="broadsheet/timeline" data-role="timeline">
  <p class="br-mono br-ed">第 14 版 · 工作流</p>
  <p class="br-mono br-mast">版本编年</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">从一套版式，到一座风格库。</h2>
  <p class="br-deck">2026 年核心版本演进纪要（07.16 → 10.08）</p>
  <div class="br-r1 br-head-rule" data-shape="rect"></div>
  <div class="br-vr brl-vr brl-v1" data-shape="rect"></div>
  <div class="br-vr brl-vr brl-v2" data-shape="rect"></div>
  <div class="br-vr brl-vr brl-v3" data-shape="rect"></div>
  <div class="br-vr brl-vr brl-v4" data-shape="rect"></div>
  <div class="br-r3 brl-spine" data-shape="rect" data-anim="draw"></div>
  <p class="br-mono brl-yr brl-c1">2026 · 01</p>
  <p class="br-num brl-date brl-c1" data-anim="rise">07.16</p>
  <div class="br-ink brl-node brl-c1" data-shape="rect" data-anim="pop"></div>
  <h3 class="br-heavy brl-h brl-c1" data-merge="t1" data-anim="rise">首版发布</h3>
  <div class="br-r1 brl-r1 brl-c1" data-shape="rect"></div>
  <p class="br-body brl-p brl-c1" data-merge="t1" data-anim="rise">锁定设计系统的网页 PPT，确定性导出。</p>
  <p class="br-mono brl-yr brl-c2">2026 · 02</p>
  <p class="br-num brl-date brl-c2" data-anim="rise">07.18</p>
  <div class="br-ink brl-node brl-c2" data-shape="rect" data-anim="pop"></div>
  <h3 class="br-heavy brl-h brl-c2" data-merge="t2" data-anim="rise">墨韵衬线</h3>
  <div class="br-r1 brl-r1 brl-c2" data-shape="rect"></div>
  <p class="br-body brl-p brl-c2" data-merge="t2" data-anim="rise">第二套设计系统：思源宋、暖纸、朱砂。</p>
  <p class="br-mono brl-yr brl-c3">2026 · 03</p>
  <p class="br-num brl-date brl-c3" data-anim="rise">08.17</p>
  <div class="br-ink brl-node brl-c3" data-shape="rect" data-anim="pop"></div>
  <h3 class="br-heavy brl-h brl-c3" data-merge="t3" data-anim="rise">校验全覆盖</h3>
  <div class="br-r1 brl-r1 brl-c3" data-shape="rect"></div>
  <p class="br-body brl-p brl-c3" data-merge="t3" data-anim="rise">规则覆盖全部元素，文字分段原生导出。</p>
  <p class="br-mono brl-yr brl-c4">2026 · 04</p>
  <p class="br-num brl-date brl-c4" data-anim="rise">08.18</p>
  <div class="br-ink brl-node brl-c4" data-shape="rect" data-anim="pop"></div>
  <h3 class="br-heavy brl-h brl-c4" data-merge="t4" data-anim="rise">瑞士国际</h3>
  <div class="br-r1 brl-r1 brl-c4" data-shape="rect"></div>
  <p class="br-body brl-p brl-c4" data-merge="t4" data-anim="rise">第三套设计系统，加入数据叙事版式。</p>
  <p class="br-rubric brl-yr brl-c5">最新里程碑</p>
  <p class="br-num br-ac brl-date brl-c5" data-anim="rise">10.08</p>
  <div class="br-red brl-node brl-c5" data-shape="rect" data-anim="pop"></div>
  <h3 class="br-heavy brl-h brl-c5" data-merge="t5" data-anim="rise">风格库</h3>
  <div class="br-r1 brl-r1 brl-c5" data-shape="rect"></div>
  <p class="br-body brl-p brl-c5" data-merge="t5" data-anim="rise">十二种风格，版式独立。</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：git log（2026-07-16 → 2026-10-08）</p>
  <p class="br-mono br-pageno">14 / 17</p>
</section>
```

## broadsheet/cycle · cycle

暗版闭环页（`is-dark`）。左栏描边圆环配四向方块节点（起点暗红）与环心总步数；1px 竖线隔开；右栏暗红栏目名 + 四行「编号 / 步骤 / 说明」与回环提示。

```html
<section class="slide is-dark" data-layout="broadsheet/cycle" data-role="cycle">
  <p class="br-mono br-ed">第 15 版 · 工作流</p>
  <p class="br-mono br-mast">闭环机制</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">每次改动，都绕这一圈</h2>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <div class="bry-ring" data-shape="ellipse" data-anim="fade"></div>
  <div class="br-red bry-node bry-n1" data-shape="rect" data-anim="ring"></div>
  <div class="bry-box bry-node bry-n2" data-shape="rect" data-anim="ring"></div>
  <div class="bry-box bry-node bry-n3" data-shape="rect" data-anim="ring"></div>
  <div class="bry-box bry-node bry-n4" data-shape="rect" data-anim="ring"></div>
  <p class="br-num br-on bry-k" style="left: 294px; top: 225px;">01</p>
  <p class="br-num bry-k" style="left: 462px; top: 393px;">02</p>
  <p class="br-num bry-k" style="left: 294px; top: 561px;">03</p>
  <p class="br-num bry-k" style="left: 126px; top: 393px;">04</p>
  <p class="br-num bry-core" data-anim="count">4</p>
  <p class="br-mono bry-core-l">个步骤 · 一圈</p>
  <div class="br-vr bry-vr" data-shape="rect"></div>
  <p class="br-rubric bry-rubric">修订与基线回路</p>
  <p class="br-num br-ac bry-n" style="top: 244px;">01</p>
  <h3 class="br-heavy bry-h" style="top: 244px;" data-anim="rise">改版式</h3>
  <p class="br-note bry-d" style="top: 250px;">调整版式结构与几何参数</p>
  <div class="br-r1 bry-hair" data-shape="rect" style="top: 312px;"></div>
  <p class="br-num bry-n" style="top: 340px;">02</p>
  <h3 class="br-heavy bry-h" style="top: 340px;" data-anim="rise">过校验</h3>
  <p class="br-note bry-d" style="top: 346px;">十六条机器规则错误清零</p>
  <div class="br-r1 bry-hair" data-shape="rect" style="top: 408px;"></div>
  <p class="br-num bry-n" style="top: 436px;">03</p>
  <h3 class="br-heavy bry-h" style="top: 436px;" data-anim="rise">渲染比对</h3>
  <p class="br-note bry-d" style="top: 442px;">逐页出图并与基线目检比对</p>
  <div class="br-r1 bry-hair" data-shape="rect" style="top: 504px;"></div>
  <p class="br-num bry-n" style="top: 532px;">04</p>
  <h3 class="br-heavy bry-h" style="top: 532px;" data-anim="rise">记基线</h3>
  <p class="br-note bry-d" style="top: 538px;">归档通过检验的黄金参考帧</p>
  <div class="br-r1 bry-hair" data-shape="rect" style="top: 600px;"></div>
  <p class="br-mono br-ac bry-back">→ 回到 01 改版式</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：scripts/baseline.mjs（基线前先过 check-style 与 validate）</p>
  <p class="br-mono br-pageno">15 / 17</p>
</section>
```

## broadsheet/system · system

层级嵌套规格页。左栏三层套框报版示意图（外层暖纸灰描边、中层墨黑、内层暗红）；1px 竖线隔开；右栏三层规格说明（暗红层级名 / 文件名 / 职责），行间 1px 细线。

```html
<section class="slide" data-layout="broadsheet/system" data-role="system">
  <p class="br-mono br-ed">第 16 版 · 工作流</p>
  <p class="br-mono br-mast">样式体系</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <h2 class="br-heavy br-title" data-anim="rise">三层样式，各管一层</h2>
  <div class="br-r1 br-head-rule-sm" data-shape="rect"></div>
  <div class="br-tint brz-p1" data-shape="rect" data-anim="scale"></div>
  <div class="br-ink brz-p2" data-shape="rect" data-anim="scale"></div>
  <div class="br-red brz-p3" data-shape="rect" data-anim="scale"></div>
  <p class="br-mono brz-l1">base.css</p>
  <p class="br-mono br-on brz-l2">style.css</p>
  <p class="br-mono br-on brz-l3">brand.css</p>
  <div class="br-vr brz-vr" data-shape="rect"></div>
  <p class="br-rubric brz-tag" style="top: 196px;" data-merge="o" data-anim="rise">外层 · 公共底座</p>
  <h3 class="br-heavy brz-h" style="top: 228px;" data-merge="o" data-anim="rise">base.css</h3>
  <p class="brz-p" style="top: 274px;" data-merge="o" data-anim="rise">画布、元素契约、形状原语</p>
  <div class="br-r1 brz-hair" data-shape="rect" style="top: 332px;"></div>
  <p class="br-rubric brz-tag" style="top: 348px;" data-merge="m" data-anim="rise">中层 · 风格包</p>
  <h3 class="br-heavy brz-h" style="top: 380px;" data-merge="m" data-anim="rise">style.css</h3>
  <p class="brz-p" style="top: 426px;" data-merge="m" data-anim="rise">风格的 token、字体与全部版式</p>
  <div class="br-r1 brz-hair" data-shape="rect" style="top: 480px;"></div>
  <p class="br-rubric brz-tag" style="top: 500px;" data-merge="i" data-anim="rise">内层 · 品牌覆写</p>
  <h3 class="br-heavy brz-h" style="top: 532px;" data-merge="i" data-anim="rise">brand.css</h3>
  <p class="brz-p" style="top: 578px;" data-merge="i" data-anim="rise">只改 token 的品牌色</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">来源：风格库 spec §3.1</p>
  <p class="br-mono br-pageno">16 / 17</p>
</section>
```

## broadsheet/closing · closing

封底暗版版权页（`is-dark`）。暗红栏目名 → 两行 72px 极粗宋体收束标题 → 1px/3px 双线 → 左栏新建 deck 命令框与画廊入口、1px 竖线、右栏刊物档案 → 底部 3px 粗线与刊脚。

```html
<section class="slide is-dark" data-layout="broadsheet/closing" data-role="closing">
  <p class="br-mono br-ed">第 17 版 · 封底</p>
  <p class="br-mono br-mast">ZIFEIYU PPT SKILL</p>
  <div class="br-r3 br-top-rule" data-shape="rect"></div>
  <p class="br-rubric bre-rubric">下一步 · 即刻发刊</p>
  <h2 class="br-heavy bre-title bre-t1" data-merge="title" data-anim="rise">挑一种风格，</h2>
  <h2 class="br-heavy bre-title bre-t2" data-merge="title" data-anim="rise">开始下一份。</h2>
  <div class="br-r1 bre-r1" data-shape="rect"></div>
  <div class="br-r3 bre-r3" data-shape="rect"></div>
  <p class="br-mono bre-label">新建 DECK 命令</p>
  <div class="br-tint bre-box" data-shape="rect"></div>
  <div class="br-red bre-edge" data-shape="rect"></div>
  <p class="bre-cmd">node scripts/new-deck.mjs my-deck --style broadsheet</p>
  <p class="bre-p">风格画廊：docs/styles/index.html</p>
  <p class="br-mono bre-tag">一源三出 · 浏览器演示 · PPTX · PDF · PNG</p>
  <div class="br-vr bre-vr" data-shape="rect"></div>
  <p class="br-rubric bre-crubric">刊物档案</p>
  <p class="br-note bre-citem" style="top: 432px;" data-merge="colophon">风格代号：D · 报刊 · 版面</p>
  <p class="br-note bre-citem" style="top: 472px;" data-merge="colophon">推荐场合：工作汇报 · 机构材料 · 高密度内容</p>
  <p class="br-note bre-citem" style="top: 512px;" data-merge="colophon">字体：思源宋 · 思源黑 · JetBrains Mono</p>
  <div class="br-r3 br-bot-rule" data-shape="rect"></div>
  <p class="br-mono br-foot">ZIFEIYU PPT SKILL · 风格 D 报刊 · 版面</p>
  <p class="br-mono br-pageno">17 / 17</p>
</section>
```
