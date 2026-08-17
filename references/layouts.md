# 版式注册表（L01–L16）

规则：整块复制骨架，只替换文字与图片路径；不得增删结构、不得改类名。
所有骨架已通过校验器与 PPTX 导出双重验证（金样：`examples/showcase/`）。

## L01 封面
标题 ≤12 字，副题 ≤30 字。
```html
<section class="slide" data-layout="L01">
  <p class="l01-kicker">KICKER · 全大写短语</p>
  <h1 class="l01-title">主标题</h1>
  <p class="l01-subtitle">一句话副标题</p>
  <div class="l01-rule" data-shape="rect"></div>
  <p class="l01-meta">日期 · 作者 · 场合</p>
</section>
```
带照片封面（宣传类推荐）：追加照片栏并给标题/副题限宽。
```html
  <img class="l01-photo" src="assets/img/1-cover.jpg" alt="封面照片">
  <h1 class="l01-title" style="width: 620px;">主标题</h1>
  <p class="l01-subtitle" style="width: 620px;">一句话副标题</p>
```

## L02 目录
3–5 行，少于 5 行时删除多余的 `l02-rN` 组。页码列与引导线可删；页码必须与实际 SHEET 页序一致（生成端填写）。
```html
<section class="slide" data-layout="L02">
  <h2 class="sl-title">目录</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l02-num l02-r1">01</p><p class="l02-item l02-r1">议程一</p>
  <p class="l02-page l02-p1">03</p>
  <div class="l02-line l02-s1" data-shape="rect"></div>
  <p class="l02-num l02-r2">02</p><p class="l02-item l02-r2">议程二</p>
  <p class="l02-page l02-p2">05</p>
  <div class="l02-line l02-s2" data-shape="rect"></div>
  <p class="l02-num l02-r3">03</p><p class="l02-item l02-r3">议程三</p>
  <p class="l02-page l02-p3">08</p>
  <div class="l02-line l02-s3" data-shape="rect"></div>
  <p class="l02-num l02-r4">04</p><p class="l02-item l02-r4">议程四</p>
  <p class="l02-page l02-p4">11</p>
  <div class="l02-line l02-s4" data-shape="rect"></div>
  <p class="l02-num l02-r5">05</p><p class="l02-item l02-r5">议程五</p>
  <p class="l02-page l02-p5">14</p>
  <div class="l02-line l02-s5" data-shape="rect"></div>
</section>
```

## L03 章节分隔
```html
<section class="slide" data-layout="L03">
  <p class="l03-num">01</p>
  <h2 class="l03-title">章节名</h2>
  <div class="l03-rule" data-shape="rect"></div>
  <p class="l03-note">一句话说明本章内容（可删）。</p>
</section>
```

## L04 观点陈述
一句话 ≤40 字；attribution 可删。
```html
<section class="slide" data-layout="L04">
  <p class="l04-text">需要被记住的那一句话。</p>
  <p class="l04-attr">—— 出处或署名</p>
</section>
```

## L05 双栏对比
每面板：标题 ≤8 字 + 两段各 ≤50 字。
```html
<section class="slide" data-layout="L05">
  <h2 class="sl-title">对比标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l05-panel-a" data-shape="rect"></div>
  <div class="l05-panel-b" data-shape="rect"></div>
  <h3 class="l05-h l05-ha">方案 A</h3>
  <p class="l05-p l05-a1">A 的第一段。</p>
  <p class="l05-p l05-a2">A 的第二段。</p>
  <h3 class="l05-h l05-hb">方案 B</h3>
  <p class="l05-p l05-b1">B 的第一段。</p>
  <p class="l05-p l05-b2">B 的第二段。</p>
</section>
```

## L06 三点论证
```html
<section class="slide" data-layout="L06">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l06-num l06-c1">01</p>
  <h3 class="l06-h l06-c1">要点一</h3>
  <p class="l06-p l06-c1">说明 ≤60 字。</p>
  <p class="l06-num l06-c2">02</p>
  <h3 class="l06-h l06-c2">要点二</h3>
  <p class="l06-p l06-c2">说明。</p>
  <p class="l06-num l06-c3">03</p>
  <h3 class="l06-h l06-c3">要点三</h3>
  <p class="l06-p l06-c3">说明。</p>
</section>
```

## L07 KPI 大字（必须真实数据）
大数字用短字符串（数字/百分号/单位），首列可加 `is-accent`；footnote 标注数据来源。
```html
<section class="slide" data-layout="L07">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l07-num l07-c1 is-accent">42%</p>
  <p class="l07-label l07-c1">指标名</p>
  <p class="l07-sub l07-c1">指标说明</p>
  <p class="l07-num l07-c2">1.8x</p>
  <p class="l07-label l07-c2">指标名</p>
  <p class="l07-sub l07-c2">指标说明</p>
  <p class="l07-num l07-c3">30</p>
  <p class="l07-label l07-c3">指标名</p>
  <p class="l07-sub l07-c3">指标说明</p>
  <p class="l07-footnote">数据来源：xxx · 日期</p>
</section>
```

## L08 时间线
固定 4 节点；date 短标签，text ≤16 字。
```html
<section class="slide" data-layout="L08">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l08-axis" data-shape="rect"></div>
  <div class="l08-dot l08-dot1" data-shape="ellipse"></div>
  <div class="l08-dot l08-dot2" data-shape="ellipse"></div>
  <div class="l08-dot l08-dot3" data-shape="ellipse"></div>
  <div class="l08-dot l08-dot4" data-shape="ellipse"></div>
  <h3 class="l08-date l08-d1">阶段一</h3>
  <p class="l08-text l08-t1">节点说明</p>
  <h3 class="l08-date l08-d2">阶段二</h3>
  <p class="l08-text l08-t2">节点说明</p>
  <h3 class="l08-date l08-d3">阶段三</h3>
  <p class="l08-text l08-t3">节点说明</p>
  <h3 class="l08-date l08-d4">阶段四</h3>
  <p class="l08-text l08-t4">节点说明</p>
</section>
```

## L09 图片主视觉
图片放 `assets/img/`，1280×720 以上、16:9 优先；alt 必填。
```html
<section class="slide" data-layout="L09">
  <img class="l09-img" src="assets/img/1-hero.png" alt="图片描述">
  <div class="l09-scrim" data-shape="rect"></div>
  <h2 class="l09-title">图上标题</h2>
  <p class="l09-sub">一句话说明 · 图片来源</p>
</section>
```

## L10 正文加要点
左栏正文 90–140 字；右侧三要点各 ≤40 字。
```html
<section class="slide" data-layout="L10">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l10-body">左栏长正文。</p>
  <h3 class="l10-point-title l10-p1t">01 · 要点一</h3>
  <p class="l10-point-body l10-p1b">要点说明。</p>
  <h3 class="l10-point-title l10-p2t">02 · 要点二</h3>
  <p class="l10-point-body l10-p2b">要点说明。</p>
  <h3 class="l10-point-title l10-p3t">03 · 要点三</h3>
  <p class="l10-point-body l10-p3b">要点说明。</p>
</section>
```

## L11 台账行（必须真实数据）
固定 4 行；value 建议数字/短值。
```html
<section class="slide" data-layout="L11">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l11-label l11-r1">条目一</p>
  <p class="l11-value l11-r1">数值</p>
  <p class="l11-note l11-r1">备注说明</p>
  <div class="l11-line l11-s1" data-shape="rect"></div>
  <p class="l11-label l11-r2">条目二</p>
  <p class="l11-value l11-r2">数值</p>
  <p class="l11-note l11-r2">备注说明</p>
  <div class="l11-line l11-s2" data-shape="rect"></div>
  <p class="l11-label l11-r3">条目三</p>
  <p class="l11-value l11-r3">数值</p>
  <p class="l11-note l11-r3">备注说明</p>
  <div class="l11-line l11-s3" data-shape="rect"></div>
  <p class="l11-label l11-r4">条目四</p>
  <p class="l11-value l11-r4">数值</p>
  <p class="l11-note l11-r4">备注说明</p>
  <div class="l11-line l11-s4" data-shape="rect"></div>
</section>
```

## L12 流程步骤
固定 4 步；标题 ≤6 字，说明 ≤40 字。
```html
<section class="slide" data-layout="L12">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l12-dot l12-c1" data-shape="ellipse"></div>
  <p class="l12-num l12-c1">1</p>
  <div class="l12-link l12-k1" data-shape="rect"></div>
  <h3 class="l12-h l12-c1">步骤一</h3>
  <p class="l12-p l12-c1">说明。</p>
  <div class="l12-dot l12-c2" data-shape="ellipse"></div>
  <p class="l12-num l12-c2">2</p>
  <div class="l12-link l12-k2" data-shape="rect"></div>
  <h3 class="l12-h l12-c2">步骤二</h3>
  <p class="l12-p l12-c2">说明。</p>
  <div class="l12-dot l12-c3" data-shape="ellipse"></div>
  <p class="l12-num l12-c3">3</p>
  <div class="l12-link l12-k3" data-shape="rect"></div>
  <h3 class="l12-h l12-c3">步骤三</h3>
  <p class="l12-p l12-c3">说明。</p>
  <div class="l12-dot l12-c4" data-shape="ellipse"></div>
  <p class="l12-num l12-c4">4</p>
  <h3 class="l12-h l12-c4">步骤四</h3>
  <p class="l12-p l12-c4">说明。</p>
</section>
```

## L14 图文半幅
左正文 100–140 字，右半幅照片 + 来源说明；宣传类内容页优先于 L10 使用。
```html
<section class="slide" data-layout="L14">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l14-body">左栏长正文。</p>
  <img class="l14-img" src="assets/img/4-scene.jpg" alt="图片描述">
  <p class="l14-caption">图片说明 · 来源</p>
</section>
```

## L15 条形对比图（必须真实数据）
固定 4 行；条宽 = 数值/最大值 × 660px（行内 width，四舍五入到整数）；footnote 必须标注来源与"条长与数值成正比"。少于 4 行删除多余行组。
```html
<section class="slide" data-layout="L15">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l15-label l15-r1">条目一</p>
  <div class="l15-bar l15-b1" data-shape="rect" style="width: 660px;"></div>
  <p class="l15-val l15-r1">数值</p>
  <p class="l15-label l15-r2">条目二</p>
  <div class="l15-bar l15-b2" data-shape="rect" style="width: 430px;"></div>
  <p class="l15-val l15-r2">数值</p>
  <p class="l15-label l15-r3">条目三</p>
  <div class="l15-bar l15-b3" data-shape="rect" style="width: 285px;"></div>
  <p class="l15-val l15-r3">数值</p>
  <p class="l15-label l15-r4">条目四</p>
  <div class="l15-bar l15-b4" data-shape="rect" style="width: 120px;"></div>
  <p class="l15-val l15-r4">数值</p>
  <p class="l15-footnote">指标口径 · 数据来源 · 条长与数值成正比</p>
</section>
```

## L16 图片网格（2×2）
四张图统一比例裁切；alt 必填（校验器 R10 强制）；caption 说明排布与来源。
```html
<section class="slide" data-layout="L16">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <img class="l16-img l16-i1" src="assets/img/8-a.jpg" alt="描述一">
  <img class="l16-img l16-i2" src="assets/img/8-b.jpg" alt="描述二">
  <img class="l16-img l16-i3" src="assets/img/8-c.jpg" alt="描述三">
  <img class="l16-img l16-i4" src="assets/img/8-d.jpg" alt="描述四">
  <p class="l16-caption">图片说明 · 来源</p>
</section>
```

## 企业槽位（可选，任意版式追加）

```html
  <p class="sl-page">07</p>                                        <!-- 页码角标 -->
  <img class="sl-logo" src="assets/img/logo.png" alt="公司 logo">  <!-- 右上 logo，contain 不裁切 -->
  <img class="l13-qr" src="assets/img/qr.png" alt="联系二维码">     <!-- 仅 L13 结尾页 -->
```
页码由生成端按实际页序填写；使用 sl-logo 的页面不要再用 sl-ghost（同区冲突）。

## L13 结尾
```html
<section class="slide" data-layout="L13">
  <h1 class="l13-title">收束语。</h1>
  <p class="l13-sub">补充信息或行动号召</p>
  <div class="l13-rule" data-shape="rect"></div>
  <p class="l13-meta">署名 · 联系方式</p>
</section>
```

## 讲稿提示（演讲场合推荐）

任意版式的 `</section>` 前可加讲稿，仅在演讲者控制台（S 键）显示：
```html
  <aside class="notes"><p>开场问好。重音在数字。停顿两秒。</p></aside>
```
写提示信号不写逐字稿；每页 ≤3 短句；标记重音、停顿、指图等舞台动作。

## DATUM 制图铺装（现代系统默认构成语法）

每页依次注入（金样 examples/showcase 为完整范例）：
1. **坐标纸纹理**：`<img class="sl-texture" src="assets/textures/graph-dark.png" aria-hidden="true">` 放页面第一个元素；is-dark / is-accent 页用 `graph-light.png`。
2. **角线**：8 条 `.crop` 短划（四角 L 形，位置固定，整块复制金样即可）。
3. **等宽页眉**：左 `<p class="sl-mono" style="left: 96px; top: 64px;">页面角色标签</p>`（英文大写，如 INDEX / FIG. 1–3 / TIMELINE），右 `SHEET nn/NN`（`width: 138px`）。
4. 有页眉的内容页：`sl-title` 行内 `top: 108px`，并**删除 sl-rule**。
5. **标注线**（封面/章节/金句页）：`.dim-tick + .dim-line + .dim-tick` 三件套 + 下方 `sl-mono` 标签，标注内容写真实参数（跨度、网格、规则号）。
6. **图签栏**（封面、数据页、结尾页）：`.tb-rule` 横线 + 三组 `.tb-label`/`.tb-value` + 两条 `.tb-div` 竖分隔；数据页用它承载 SOURCE / DATE / STATUS（数据诚实协议的视觉化）。
7. 节奏页设计：章节页 = is-accent 满幅色场 + `.dt-mega` 巨号贴右；金句页 = is-dark + `.dt-display` 两行大字（每行一个 h1）；封面 = `.dt-display` 128px 两行，右上空区放 `.sl-ghost` 数字（版式数/年份等真实参数）平衡构图。
8. L09 全幅图页不加铺装，保持纯净。

纪律：标注文字必须真实（不许装饰性假参数）；每页最多一条标注线；SHEET 编号与实际页序一致。

## 节奏与装饰（宣传/演讲类推荐）

- **深色节奏页**：`<section class="slide is-dark" ...>` 将该页反转为深色。用于 L03 章节页、L04 金句页、L13 结尾页制造节奏；每 3–5 页最多一次，禁止用于数据/正文页。
- **鬼影大字**：`<p class="sl-ghost">01</p>` 放在页面元素最前，280px 半透明大字（数字或 ≤4 个大写字母）。每页最多一个，与 is-dark 搭配效果最佳。

## 段内强调（可选）

文本槽位内允许非嵌套的 `<strong>`（加粗）、`<em>`（斜体，中文慎用——CJK 无真斜体）、`<span class="is-accent">`（强调色），PPTX 导出时映射为原生分段样式：
```html
<p class="l10-body">约束不是限制，<strong>约束换质量</strong>，颜色只走 <span class="is-accent">token</span>。</p>
```
每页合计 ≤2 处，强调即稀缺；其他标签与嵌套一律禁止（校验器 R7 拦截）。

## 微调规则

版式槽位不合身时，允许且仅允许行内参数化微调：
```html
<p class="l10-body" style="font-size: 22px; line-height: 1.6;">…</p>
```
只许 `top/left/width/height/font-size/line-height`，数值单位 px 或 %。改颜色、改字体、加新属性一律禁止（校验器 R6 拦截，装饰 shape 同样受查）。
