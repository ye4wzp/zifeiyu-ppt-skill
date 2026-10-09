# 摄影集 · 画册（photobook）版式注册表

> 状态：draft · P1 样张阶段，已有 cover / kpi / process；其余核心角色未完成前，交付请用其他风格。

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。骨架上的 `data-layout / data-role / data-merge / data-anim / data-source / data-value / data-label / data-chart / data-media` 是导出与动画的声明，原样保留（说明见 `references/roles.md`）。金样：`styles/photobook/golden/`；金样文字来自 `docs/golden-content.md`。

## 版面语法

1. **照片是主角**：内容页照片占版面一半以上；文字退到图注的位置，标题一行（`pb-serif pb-title`，44px，最多 14 字），右侧可配一行拉丁斜体副题（`pb-it pb-voice`）。
2. **不用强调色**：界面只有墨色、灰与近白，颜色交给照片；不用 `is-accent` / `is-mark`。
3. **压暗条**：照片上放字时，先铺一块 `pb-scrim`（`rgba(12,11,10,.55)`，导出为原生半透明矩形），字用 `pb-on` / `pb-on2`；不在没有压暗条的照片上直接放字。
4. **页脚**：top 668 一行等宽字，左「Source — 出处 · 图为示意图」（`pb-mono pb-foot`，数据页加 `data-source`），右页码「NN / 总页数」（`pb-mono pb-pageno`）。
5. **字体分工**：标题与小标题用思源宋 Bold（`pb-serif`，Office 里是宋体）；图注、编号与数字用 Playfair 斜体（`pb-it` / `pb-num`，等高数字，Office 里是 Times New Roman）；帧号与页脚用 JetBrains Mono（`pb-mono`，Office 里是 Consolas）；正文 `pb-body` 走系统字体。
6. **配图**：金样配图由 `scripts/gen-art.mjs` 生成，冷暖两组胶片色调交替（`--palette`，见各条目），alt 与页脚都写「示意图」。

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
  <p class="pb-mono pb-pageno">13 / 18</p>
</section>
```
