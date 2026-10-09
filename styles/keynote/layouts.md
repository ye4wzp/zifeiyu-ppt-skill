# 发布会 · 暗场（keynote）版式注册表

> 状态：draft · P2 样张阶段，已有 cover / kpi / process；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media / data-raster` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/keynote/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **一页一个重点**：近黑底，大字居中；内容页标题 56px 居中（`kn-semi`），封面标题 100px 左下。
2. **暖黄全页一处**：一个 `kn-kick` 小标签，或一个 `kn-ac` 数字 / 词，二选一；其余只用白（`--text-1`）与灰（`kn-grey` / `kn-body` / `kn-note`）。
3. **页脚**：top 672，左「来源：……」灰字（`kn-note kn-source`，数据页加 `data-source`），右页码（`kn-note kn-pageno`，只写数字）；封面不放页脚。
4. **深色圆角卡片**：`kn-card`（#1c1c1e、圆角 24），导出为 PowerPoint 原生圆角矩形；卡片里放照片时，`<img>` 用同一组类得到同尺寸同圆角，再盖一块同尺寸的 `kn-scrim`。
5. **照片上的渐变压暗**：`kn-fade` 必须带 `data-raster`——PowerPoint 画不出这种渐变，导出时单独截成带透明度的图片，文字仍是原生文本框。
6. **字体分工**：标题、标签用思源黑 600（`kn-semi` / `kn-kick`，Office 里是微软雅黑）；数字用 Inter 600（`kn-num`，Office 里是 Segoe UI）；正文与说明走系统字体（`kn-body` / `kn-note`）。
7. **配图**：金样配图由 `scripts/gen-art.mjs` 用暗调配色生成（`--palette "#3a3836,#232224,#ffc21a,#0a0a0b"`），alt 与页脚都写「示意图」。

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

## keynote/process · process

流程页。56px 标题居中 + 一行灰色副题 → 4 张 276×388 深色圆角卡片：左上编号、底部步骤名与说明（≤26 字）；最后一步的卡片垫一张照片（同圆角）并盖压暗层，它的编号是全页唯一的暖黄。

```html
<section class="slide" data-layout="keynote/process" data-role="process">
  <h2 class="kn-semi knp-title" data-anim="rise">从大纲到成稿，四步</h2>
  <p class="kn-body knp-sub" data-anim="rise">From outline to deck.</p>
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
