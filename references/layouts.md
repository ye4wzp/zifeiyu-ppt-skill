# 版式注册表（L01–L24）

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
镜像变体（图左文右，连续图文页左右交替用）：`l14-img`/`l14-caption` 加 `is-left`，`l14-body` 加 `is-right`；L18 视频半幅同样适用。

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

## L17 视频主视觉
全幅视频开场/氛围页，规则同 L09（不加 DATUM 铺装）。`poster` 与 `aria-label` 必填（校验器 R13/R10）；`data-autoplay` + `muted` 进页自动静音播放，点击画面暂停；`preload="none"` 保证静止态锁定在封面帧。
```html
<section class="slide" data-layout="L17">
  <video class="l17-video" src="assets/media/1-hero.mp4" poster="assets/media/1-hero-poster.jpg" aria-label="视频内容描述" data-autoplay muted loop preload="none"></video>
  <div class="l17-scrim" data-shape="rect"></div>
  <h2 class="l17-title">图上标题</h2>
  <p class="l17-sub">一句话说明 · 素材来源</p>
</section>
```

## L18 视频半幅
视频作论据时用：左讲解正文 100–140 字，右半幅视频（默认静止在封面帧，点击播放）。支持 is-left/is-right 镜像（同 L14）。
```html
<section class="slide" data-layout="L18">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l18-body">左栏讲解正文。</p>
  <video class="l18-video" src="assets/media/3-demo.mp4" poster="assets/media/3-demo-poster.jpg" aria-label="视频内容描述" preload="none"></video>
  <p class="l18-caption">点击画面播放 · 素材来源</p>
</section>
```

## L19 音频页
播客节选/音乐作品/访谈片段。`<audio>` 必须带 `controls` 属性（浏览器 UA 规则，无它则元素不渲染；视觉上已隐藏）；时长与来源标真实值（数据诚实）。播放键与进度线由演示层驱动；PPTX 导出时音频图标落在播放键位置。
```html
<section class="slide" data-layout="L19">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l19-card" data-shape="rect"></div>
  <div class="l19-play" data-shape="ellipse"></div>
  <p class="l19-glyph">▶</p>
  <audio class="l19-audio" src="assets/media/4-track.mp3" aria-label="音轨内容描述" controls preload="none"></audio>
  <h3 class="l19-track">音轨标题</h3>
  <p class="l19-meta">时长 · 作者/来源 · 授权说明</p>
  <div class="l19-bar" data-shape="rect"></div>
  <div class="l19-progress" data-shape="rect"></div>
  <p class="l19-time">0:00 / 0:00</p>
  <p class="l19-note">一段说明（可删）。</p>
</section>
```

## L20 环形流程（3–4 节点）
有回路的过程才用它（线性演进走 L08/L23）；顺时针读 N → E → S → W，标题 ≤6 字、说明 ≤20 字。**本页不加纹理铺装**：环心是实心色块，会在纹理上打出一个洞。
```html
<section class="slide" data-layout="L20">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l20-ring" data-shape="ellipse"></div>
  <div class="l20-hole" data-shape="ellipse"></div>
  <div class="l20-node l20-n1" data-shape="ellipse"></div>
  <div class="l20-node l20-n2" data-shape="ellipse"></div>
  <div class="l20-node l20-n3" data-shape="ellipse"></div>
  <div class="l20-node l20-n4" data-shape="ellipse"></div>
  <p class="l20-center">CYCLE</p>
  <h3 class="l20-h l20-hn">环节一</h3>
  <p class="l20-p l20-pn">说明。</p>
  <h3 class="l20-h l20-he">环节二</h3>
  <p class="l20-p l20-pe">说明。</p>
  <h3 class="l20-h l20-hs">环节三</h3>
  <p class="l20-p l20-ps">说明。</p>
  <h3 class="l20-h l20-hw">环节四</h3>
  <p class="l20-p l20-pw">说明。</p>
</section>
```
可删：`l20-center` 中心标签；节点减到 3 个时整组删除一个方位（`l20-node l20-nN` + 对应 `l20-hX`/`l20-pX`），其余三组不动。`l20-hole` 必须是 `var(--bg)`，改成白色会在深色页露馅。

## L21 矩阵盘点（8–12 项 + 总数）
清单型内容：左侧极细巨号总数，右侧 3 列 × 4 行细目。label ≤6 字；num 走等宽短串（编号、区间、口径）。
```html
<section class="slide" data-layout="L21">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l21-total">24</p>
  <p class="l21-total-label">TOTAL · 总数口径</p>
  <p class="l21-num l21-c1 l21-r1">01</p><p class="l21-label l21-c1 l21-b1">条目一</p>
  <p class="l21-num l21-c2 l21-r1">02</p><p class="l21-label l21-c2 l21-b1">条目二</p>
  <p class="l21-num l21-c3 l21-r1">03</p><p class="l21-label l21-c3 l21-b1">条目三</p>
  <p class="l21-num l21-c1 l21-r2">04</p><p class="l21-label l21-c1 l21-b2">条目四</p>
  <p class="l21-num l21-c2 l21-r2">05</p><p class="l21-label l21-c2 l21-b2">条目五</p>
  <p class="l21-num l21-c3 l21-r2">06</p><p class="l21-label l21-c3 l21-b2">条目六</p>
  <p class="l21-num l21-c1 l21-r3">07</p><p class="l21-label l21-c1 l21-b3">条目七</p>
  <p class="l21-num l21-c2 l21-r3">08</p><p class="l21-label l21-c2 l21-b3">条目八</p>
  <p class="l21-num l21-c3 l21-r3">09</p><p class="l21-label l21-c3 l21-b3">条目九</p>
  <p class="l21-num l21-c1 l21-r4">10</p><p class="l21-label l21-c1 l21-b4">条目十</p>
  <p class="l21-num l21-c2 l21-r4">11</p><p class="l21-label l21-c2 l21-b4">条目十一</p>
  <p class="l21-num l21-c3 l21-r4">12</p><p class="l21-label l21-c3 l21-b4">条目十二</p>
</section>
```
可删：从末尾整组删（num + label 成对），最少留 8 项。总数必须等于细目之和——盘点页的数据诚实就在这一条。

## L22 规格表（必须真实数据）
参数、规格、配置清单：2 列 × 4 行 label–value，每行一条发丝线收口。value 走短值（数字 + 单位）；footnote 必须标注参数出处（校验器 R8 拦截）。
```html
<section class="slide" data-layout="L22">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <p class="l22-label l22-c1 l22-r1">参数一</p><p class="l22-value l22-c1 l22-b1">数值</p>
  <p class="l22-label l22-c2 l22-r1">参数二</p><p class="l22-value l22-c2 l22-b1">数值</p>
  <div class="l22-line l22-s1" data-shape="rect"></div>
  <p class="l22-label l22-c1 l22-r2">参数三</p><p class="l22-value l22-c1 l22-b2">数值</p>
  <p class="l22-label l22-c2 l22-r2">参数四</p><p class="l22-value l22-c2 l22-b2">数值</p>
  <div class="l22-line l22-s2" data-shape="rect"></div>
  <p class="l22-label l22-c1 l22-r3">参数五</p><p class="l22-value l22-c1 l22-b3">数值</p>
  <p class="l22-label l22-c2 l22-r3">参数六</p><p class="l22-value l22-c2 l22-b3">数值</p>
  <div class="l22-line l22-s3" data-shape="rect"></div>
  <p class="l22-label l22-c1 l22-r4">参数七</p><p class="l22-value l22-c1 l22-b4">数值</p>
  <p class="l22-label l22-c2 l22-r4">参数八</p><p class="l22-value l22-c2 l22-b4">数值</p>
  <div class="l22-line l22-s4" data-shape="rect"></div>
  <p class="l22-footnote">参数来源：xxx · 日期</p>
</section>
```
可删：从末尾整行删（两组 label + value 与该行的 `l22-line` 一起删）。

## L23 纵向时间线（4 节点）
纵向演进，容量大于 L08：每个节点带一句说明。date 走真实日期，h ≤6 字，p ≤30 字。
```html
<section class="slide" data-layout="L23">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l23-axis" data-shape="rect"></div>
  <div class="l23-dot l23-d1" data-shape="ellipse"></div>
  <div class="l23-dot l23-d2" data-shape="ellipse"></div>
  <div class="l23-dot l23-d3" data-shape="ellipse"></div>
  <div class="l23-dot l23-d4" data-shape="ellipse"></div>
  <p class="l23-date l23-r1">2026-01-01</p>
  <h3 class="l23-h l23-r1">节点一</h3>
  <p class="l23-p l23-n1">一句话说明。</p>
  <p class="l23-date l23-r2">2026-02-01</p>
  <h3 class="l23-h l23-r2">节点二</h3>
  <p class="l23-p l23-n2">一句话说明。</p>
  <p class="l23-date l23-r3">2026-03-01</p>
  <h3 class="l23-h l23-r3">节点三</h3>
  <p class="l23-p l23-n3">一句话说明。</p>
  <p class="l23-date l23-r4">2026-04-01</p>
  <h3 class="l23-h l23-r4">节点四</h3>
  <p class="l23-p l23-n4">一句话说明。</p>
</section>
```
可删：从末尾整组删（date + h + p + dot 一起），少于 4 个节点时轴线可行内改短 `height`。

## L24 同心圆系统（3 层嵌套）
层级包含关系：外层可替换、内核不可动；右侧三行图例与三层色块一一对应，核心标签 ≤4 字。**本页不加纹理铺装，且只用于浅色页**——is-dark / is-accent 上三层灰阶会塌成一片。
```html
<section class="slide" data-layout="L24">
  <h2 class="sl-title">页标题</h2>
  <div class="sl-rule" data-shape="rect"></div>
  <div class="l24-l1" data-shape="ellipse"></div>
  <div class="l24-l2" data-shape="ellipse"></div>
  <div class="l24-l3" data-shape="ellipse"></div>
  <p class="l24-core">内核</p>
  <div class="l24-s1" data-shape="rect" style="left: 760px; top: 258px; width: 12px; height: 12px;"></div>
  <h3 class="l24-h l24-h1">外层名</h3>
  <p class="l24-p l24-p1">这一层做什么、谁可以动它。</p>
  <div class="l24-s2" data-shape="rect" style="left: 760px; top: 398px; width: 12px; height: 12px;"></div>
  <h3 class="l24-h l24-h2">中层名</h3>
  <p class="l24-p l24-p2">这一层做什么、谁可以动它。</p>
  <div class="l24-s3" data-shape="rect" style="left: 760px; top: 538px; width: 12px; height: 12px;"></div>
  <h3 class="l24-h l24-h3">内核名</h3>
  <p class="l24-p l24-p3">这一层做什么、谁可以动它。</p>
</section>
```
三层色块顺序固定为 `l24-l1`（外，surface）→ `l24-l2`（中，hairline）→ `l24-l3`（核，accent），必须按此顺序书写：后写的压在先写的上面。图例色块只带填充，几何走行内样式。

## 媒体约定（L17–L19 通用）

- 媒体文件放 `assets/media/`，命名 `{页码}-{语义}.{ext}`；**禁止远程 URL**（R13 拦截，离线播放与 PPTX 嵌入都需要本地文件）。
- 视频必须提供 `poster`（同目录 `-poster.jpg`）：flat 渲染、PDF、PPTX 封面帧全部锁定在这一帧，确定性由它保证。选帧规则同照片：主体清晰、文字避让。
- 视频建议 H.264 MP4（PowerPoint 兼容）、≤60 秒、≤10MB；音频用 MP3。
- 导出行为：PPTX 用 pptxgenjs addMedia 原生嵌入（接收方双击播放），视频封面为浏览器实际渲染截图；PDF 中视频替换为 poster 图。

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
8. L09 全幅图页不加铺装，保持纯净；L20 环形与 L24 同心圆同样不加——实心洞与实心层会在纹理上打洞。

纪律：标注文字必须真实（不许装饰性假参数）；每页最多一条标注线；SHEET 编号与实际页序一致。

## GRID 版面语法（瑞士系统 systems/swiss.css 默认构成）

金样 `examples/swiss/` 为完整范例。每页规则：
1. **等宽页眉**：左 `<p class="sl-mono" style="left: 96px; top: 64px;">GRID · 主题名</p>`，右 `NN / NN` 页码（`width: 138px`）——注意与 DATUM 的 SHEET 编号格式区分。有页眉的内容页 `sl-title` 行内 `top: 108px` 并删除 sl-rule。
2. **点阵纹理只上封面/宣言页**：`<img class="sl-texture" src="assets/textures/dots-dark.png" aria-hidden="true">`（浅底用 dots-dark，色场/墨底用 dots-light）；正文页保持纯净底色，L20/L24 一律不加。
3. **单焦点法则**：全 deck 唯一锚点色。一组卡片/KPI 里只允许一个元素上 accent（`is-accent`）；强调词用 `<span class="is-accent">` 或 `<span class="is-mark">`（荧光块），**巨字禁止加粗**。
4. **三质互斥**：色块只有三种材质——`.sw-accent`（锚点，一组只许一块）/ `.sw-ink`（墨色反转）/ `.sw-grey`（默认中性），几何行内给定；色底/墨底上的文字加 `.sw-rev` 反白。禁止材质组合（色底加描边等）。
5. **方块刻度**：分页点/装饰一律直角小方块（`.sw-ink` 行内 10×10px，当前项拉宽为 24px），禁止圆点。
6. **色彩闭环**：封面 `slide.is-accent` 满幅色场开场，结尾页同样 is-accent 收束——首尾同色缝合。
7. **双轨中缝**：并列对比在两面板之间加 1px `.sw-ink` 竖线。
8. 换锚点色：按 swiss.css 头部注释的许可对整套替换 token（柠檬黄/柠檬绿/安全橙），一份 deck 仍只有一色。

## 节奏与装饰（宣传/演讲类推荐）

- **深色节奏页**：`<section class="slide is-dark" ...>` 将该页反转为深色。用于 L03 章节页、L04 金句页、L13 结尾页制造节奏；每 3–5 页最多一次，禁止用于数据/正文页。
- **鬼影大字**：`<p class="sl-ghost">01</p>` 放在页面元素最前，280px 半透明大字（数字或 ≤4 个大写字母）。每页最多一个，与 is-dark 搭配效果最佳。

## 段内强调（可选）

文本槽位内允许非嵌套的 `<strong>`（加粗）、`<em>`（斜体，中文慎用——CJK 无真斜体）、`<span class="is-accent">`（强调色）、`<span class="is-mark">`（荧光标记，取 `--mark` token），PPTX 导出时映射为原生分段样式（标记为原生 run highlight）：
```html
<p class="l10-body">约束不是限制，<strong>约束换质量</strong>，颜色只走 <span class="is-mark">token</span>。</p>
```
每页合计 ≤2 处，强调即稀缺；其他标签与嵌套一律禁止（校验器 R7 拦截）。

## 微调规则

版式槽位不合身时，允许且仅允许行内参数化微调：
```html
<p class="l10-body" style="font-size: 22px; line-height: 1.6;">…</p>
```
只许 `top/left/width/height/font-size/line-height`，数值单位 px 或 %。改颜色、改字体、加新属性一律禁止（校验器 R6 拦截，装饰 shape 同样受查）。
