# 版式注册表（L01–L14）

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
3–5 行，少于 5 行时删除多余的 `l02-rN` 对。
```html
<section class="slide" data-layout="L02">
  <h2 class="sl-title">目录</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l02-num l02-r1">01</p><p class="l02-item l02-r1">议程一</p>
  <p class="l02-num l02-r2">02</p><p class="l02-item l02-r2">议程二</p>
  <p class="l02-num l02-r3">03</p><p class="l02-item l02-r3">议程三</p>
  <p class="l02-num l02-r4">04</p><p class="l02-item l02-r4">议程四</p>
  <p class="l02-num l02-r5">05</p><p class="l02-item l02-r5">议程五</p>
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

## 节奏与装饰（宣传/演讲类推荐）

- **深色节奏页**：`<section class="slide is-dark" ...>` 将该页反转为深色。用于 L03 章节页、L04 金句页、L13 结尾页制造节奏；每 3–5 页最多一次，禁止用于数据/正文页。
- **鬼影大字**：`<p class="sl-ghost">01</p>` 放在页面元素最前，280px 半透明大字（数字或 ≤4 个大写字母）。每页最多一个，与 is-dark 搭配效果最佳。

## 微调规则

版式槽位不合身时，允许且仅允许行内参数化微调：
```html
<p class="l10-body" style="font-size: 22px; line-height: 1.6;">…</p>
```
只许 `top/left/width/height/font-size/line-height`，数值单位 px 或 %。改颜色、改字体、加新属性一律禁止（校验器 R6 拦截）。
