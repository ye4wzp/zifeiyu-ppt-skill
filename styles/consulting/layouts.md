# 咨询 · 白皮书（consulting）版式注册表

> 状态：draft · P1 样张阶段，已有 cover / kpi / process；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/consulting/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **页头四件套**：亮蓝追踪标签（`cs-trk cs-tracker`，top 48）→ 一句话结论标题（`cs-semi cs-title`，32px，最多两行）→ 细线（top 176）→ 图表编号（`cs-exhibit`，「图表 N · 说明」，top 204）。
2. **页脚**：细线 640，左「来源：……」（`cs-source`），右页码（`cs-pageno`，只写数字）；数据页的来源加 `data-source`。
3. **亮蓝全页一处**：一个 `cs-ac` 数字，或一块 `cs-blue` 色块 / 箭头，二选一；其余用海军蓝三档（`cs-navy` / `cs-navy2` / `cs-navy3`）和灰。
4. **结论条**：浅蓝底 + 亮蓝左边线的「要点」条（`cs-tint` + `cs-blue`），或海军蓝底的「关键」条；一页最多一条，放在图表下方。
5. **燕尾流程**：第一段用 `data-shape="pentagon"`，其后 `data-shape="chevron"`；`--tip` 必须等于高的一半（R16），导出为 PowerPoint 原生燕尾形。
6. **字体分工**：标题、标签、小标题用思源黑 600（`cs-semi`，Office 里是微软雅黑粗体）；数字用 Inter 600（`cs-num`，Office 里是 Segoe UI 粗体）；正文 `cs-body`，说明 `cs-note`。

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

## consulting/kpi · kpi

数据页。页头四件套 → 三栏关键数字（第一个用 `cs-ac` 上亮蓝）+ 标签 + 一句说明，栏间竖细线 → 「要点」结论条 → 来源与页码。三个数都必须真实；说明每条 ≤22 字。

```html
<section class="slide" data-layout="consulting/kpi" data-role="kpi">
  <p class="cs-trk cs-tracker">质量门</p>
  <h2 class="cs-semi cs-title" data-anim="rise">导出之前，先过十六道检查。</h2>
  <div class="cs-hair cs-head-rule" data-shape="rect"></div>
  <p class="cs-semi cs-exhibit">图表 1 · 质量门的三个数字</p>
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
  <p class="cs-semi cs-exhibit">图表 2 · 从大纲到成稿</p>
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
