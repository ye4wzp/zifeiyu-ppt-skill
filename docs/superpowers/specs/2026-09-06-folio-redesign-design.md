# FOLIO 重构：杂志式构成 + 全版式几何重排

日期：2026-09-06 · 路线：3（重做几何）· 状态：待用户评审

## 1. 目标与非目标

**目标**：默认输出的美感对齐杂志式网页 PPT（参照 guizang-ppt-skill 的观感，不复用其代码/模板）。具体消除六个已确认的差距：施工图感的默认铺装、单声部排印、下半页空洞、图片用不足、冷色企业调、24 版式同构。

**非目标**：不生图、不接图库；不改变 HTML 单源 + PPTX/PDF/PNG 衍生的架构；不放弃绝对定位槽位（PPTX 确定性映射依赖它）。

## 2. 版面常量

| 项 | 值 |
|---|---|
| 画布 | 1280×720（不变） |
| 横向 | 左右边距 96；8 栏 × 108，栏距 32；栏起点 96/236/376/516/656/796/936/1076 |
| 页眉带 | kicker top 64；页标题 top 96（64px/1.2，字重 600） |
| 内容场 | y 200–616 |
| 页脚带 | 发丝线 y 640；页脚文字 top 656（16px 等宽） |

**底部锚定法则**：内容页最重的元素（大数字、图片、面板、末行）贴内容场底边 616；空白只允许出现在标题与内容之间，不允许出现在内容之下。校验器 R16 兜底。

## 3. 默认构成 FOLIO（替换 DATUM）

内容页公共骨架（L02、L05–L08、L10–L12、L14–L16、L18–L19、L21–L23、L25–L27）：

```html
<p class="sl-kicker">栏目 · 小标签</p>
<p class="sl-page">02 / 16</p>
<h2 class="sl-title">页标题</h2>
…内容槽位…
<div class="sl-foot-rule" data-shape="rect"></div>
<p class="sl-foot">deck 名 · 章节</p>
```

- `sl-kicker`：left 96, top 64, width 700，等宽 16px、字距 3px、大写、text-2。每页不同（本页钩子），与 `sl-foot`（跨页稳定的栏目名）语义分离。
- `sl-page`：移到右上（left 984, top 64, width 200, 右对齐，等宽 16px）。
- `sl-title`：64px/1.2，字重 600（系统文件可覆写字重）。
- `sl-foot-rule` + `sl-foot`（left 96）+ 可选 `sl-foot-r`（left 784, width 400, 右对齐）。
- 数据页的 `l07/l15/l22-footnote` 直接落在页脚位（top 656）充当 `sl-foot`，这些页不再写 `sl-foot`，继续满足 R8。
- L20、L24 自带居中图形，只加 kicker/title/page，不加页脚（文档注明）。
- 删除：`sl-rule`、`sl-corner`、`sl-tab`、坐标纸纹理注入。DATUM 词汇（crop / dim-* / tb-* / dt-*）保留为 layouts.md「可选：工程制图铺装」，仅推荐技术汇报。GRID 瑞士语法保留，其页眉改用 `sl-kicker` + `sl-page`。

## 4. 色板与主题契约

主题契约从 7 个 token 扩到 9 个：新增 `--mark` / `--on-mark`。`.slide.is-accent` 满幅页改走 `--mark`（默认柠檬黄底黑字），因此 accent 可以等于墨色而不丢第三种节奏状态。swiss.css 保留自己的 IKB is-accent 覆写。

| 主题 | --bg | --surface | --text-1 / --accent | --text-2 | --hairline | --mark / --on-mark |
|---|---|---|---|---|---|---|
| paper | #f1efea | #e8e5de | #0a0a0b | #5f5b54 | #d6d2c8 | #ffd500 / #0a0a0b |
| graphite | #141416 | #1e1e21 | #f1efea | #9a968e | #2c2c30 | #ffd500 / #0a0a0b |
| forest | #f5f1e8 | #ece7da | #1a2e1f | #5c6b5e | #d8d2c2 | #c5e803 / #0a0a0b |
| editorial | 不变（暖纸 + 朱砂） | | | | | #ffd500 / #211d16 |
| swiss | 不变（灰白 + IKB） | | | | | 不变 |

`is-dark` 反转块同步改为墨底暖纸字。对比度门槛不变（正文 ≥4.5:1，text-2 ≥3:1），金样全量复核。

## 5. 四声部排印

| 声部 | token | 字体 | 用途 |
|---|---|---|---|
| 展示 | `--font-display` | 思源黑 VF（默认）/ 思源宋（editorial） | 标题、金句 |
| 拉丁 | `--font-latin`（新增） | Playfair Display Italic（OFL） | 标题内 `<em>` 英文穿插 |
| 数字 | `--font-num` | 思源黑 200（默认）/ Playfair Display 700（editorial） | KPI、序号 |
| 标签 | `--font-mono` | JetBrains Mono | kicker、foot、fig-idx |
| 正文 | `--font-cjk` | 系统字体栈 | 段落（HTML↔PPTX 换行一致） |

- 规则：`.slide :is(h1,h2,h3) em, .l04-text em { font-family: var(--font-latin); font-style: italic; font-weight: 500 }`；正文 `<em>` 维持原状。
- 字体链路：fetch-fonts 新增 Playfair Display Italic/Regular 变量字体（google/fonts 仓库 OFL 目录，实施时联网核对 URL）；subset-fonts 追加两份子集；base.css 追加 @font-face。
- PPTX：deck.mjs 的 run 记录 fontFamily；exporter 新增 `LATIN_SERIF_STACK` → `--latin-serif` 参数（默认 Georgia），run 级 fontFace 输出。
- 字号阶梯：页标题 54→64；说明类小字 17→18；R4 下限 16px 不变；等宽标签统一 16px。

## 6. 逐版式几何（class 名全部保留，仅改坐标与字号）

MERGE_GROUPS、R8/R9、enhance.js 依赖的类名不变。坐标单位 px。

| 版式 | 重排要点 |
|---|---|
| L01 封面 | 去 `l01-rule`；`l01-title` 112px/1.1 top 232 width 1088；`l01-subtitle` 28px top 512；`l01-meta` 落页脚 656；`l01-photo` 默认改为半幅（left 640, 640×720），新增 `is-full`（全幅 + `l01-scrim` + 反白文字）；448 窄条废弃 |
| L02 目录 | 5 行 pitch 72，行 top 256/328/400/472/544，末行线 616；item 28px；num 等宽 16px |
| L03 章节 | `l03-num` 200px top 96；`l03-title` 72px top 456；`l03-note` top 560；去 `l03-rule`；默认推荐 is-dark |
| L04 陈述 | `l04-text` 56px/1.5 top 200；`l04-attr` top 580；`l04-panel/mark` 变体保留 |
| L05 对比 | 面板 top 200 height 416（贴底）；h top 240；p1 300；p2 440 |
| L06 三点 | 块底锚定：num top 376，h 28px top 408，p 18px/1.7 top 456 |
| L07 KPI | num 168px/1 top 320；label 22px top 512；sub 18px top 548；footnote 落 656 |
| L08 时间线 | 轴 y 504；点 498；date top 428；text top 536 |
| L09 图片主视觉 | 遮罩 440–720（实色 --scrim，PPTX 可映射）；title 64px top 488；sub 22px top 600 |
| L10 正文要点 | body 96/200 width 560；要点右栏底锚定：p1t 256/p1b 288，p2t 376/p2b 408，p3t 496/p3b 528 |
| L11 台账 | 4 行 pitch 104，r 216/320/424/528，线 304/408/512/616；note 18px |
| L12 流程 | 点 top 392；连线 412；h top 456；p 18px top 496 |
| L13 结尾 | title 96px/1.2 top 200；sub 26px top 480；去 rule；meta 落 656 |
| L14 图文半幅 | img 672/200 512×416（贴底，4px 圆角）；body 96/200 width 512；caption 落 656（left 672）；is-left/is-right 镜像同步 |
| L15 条形 | 4 行 pitch 96，r 248/344/440/536；bar 36 高；footnote 落 656；R8 比例算法不变 |
| L16 图片网格 | 两行 200–400 / 416–616，图 536×200；caption 落 656 |
| L17/L18 | 同 L09/L14（视频） |
| L19 音频 | 卡片 216–448，note 480–616；其余相对位置不变 |
| L20 环形、L24 同心圆 | 几何不变；只换页眉，不加页脚 |
| L21 矩阵 | total 200px top 392；total-label top 600；右栏 r 232/336/440/544，b = r+26 |
| L22 规格 | r 216/320/424/528，b = r+28，线 = r+88；footnote 落 656 |
| L23 纵向时间线 | 轴 216–616；r 224/328/432/536；p 18px 单行 |
| **L25 横幅上图下文（新）** | `l25-img` 96/104 1088×400；`l25-title` 40px 96/528 width 560；`l25-lead` 18px/1.7 672/532 width 512 |
| **L26 半幅出血图（新）** | `l26-img` 0/0 640×720；右栏 kicker left 704；`l26-title` 48px 704/200 width 480；`l26-body` 20px/1.7 704/412 width 480（贴底）；`l26-caption` 704/656；页脚线只跨文字栏（704–1184）；`is-right` 镜像 |
| **L27 单图图注（新）** | 无 sl-title；`l27-img` 96/104 1088×448；`fig-idx` 等宽 accent 96/568 width 160；`l27-caption` 296/568 width 888 |

图片槽位统一 `border-radius: 4px`（PPTX 忽略）。SKILL.md 版式表与决策表增加 L25–L27（证据图 / 横幅 / 出血）。

## 7. Web 档 hero 背景层

enhance.js 新增：L01 / L03 / L13 及带 is-dark 的 L04 页背面注入 `<canvas class="sl-bg">`（left 0 top 0 1280×720，pointer-events none），2D 等高线场以 `--text-2` 色、opacity 0.10 缓慢漂移；仅 is-active 时动画；`?flat=1`、reduced-motion、`data-bg="none"` 关闭。渲染/PDF/PPTX 完全不可见。`.sl-bg` 在 base.css 声明以过 R2。

## 8. 校验与文档

- validate.mjs 新增 **R16（警告）**：内容页（排除 L01/L03/L04/L09/L13/L17/L20/L24/L26/L27）排除页脚元素后最低底边 < 560 → 「下半页空洞，内容应贴 616」。
- checklist.md P1 新增：视觉重心（R16）、相邻页同构（同版式族连续 ≥3 页）、用户图未用足（用户给 N 张图，deck 图片页 < N）。
- authoring.md 图片段重写：用户每张图必上页；封面有图必半幅/全幅；不生图不找图；字数表按新字号更新。
- layouts.md：全部骨架换 FOLIO 页眉页脚；新增 L25–L27；DATUM 降为可选章节；GRID 页眉改写。
- themes.md：新色板、9-token 契约、受众映射（分享/演讲推荐 editorial，汇报 paper）。
- SKILL.md：构成语法段、版式表、决策表、流程第 5 步补「用户图用足」。
- failures.md 追加「施工图感」案例（现象→根因→修法→已固化到）。
- README / README.en 更新特性与预览图。

## 9. 金样、基线与交付验证

- showcase：27 页（每版式一页）按 FOLIO 重写；editorial 同内容换系统；swiss 改新页眉；media 保留并加 L25。
- 图片素材：仓库不含可用真照片（decks/ 为私有、不入库），金样图片用脚本生成的确定性抽象版面图（渐变 + 颗粒 + 几何，无版权）；README 预览同源。
- 顺序：base.css → 校验 showcase 0 error → render 目检 → `npm run baseline` 重录四套基线 → showcase/editorial 导 PPTX + check-pptx + LibreOffice 几何比对 → `npm run sync`。
- decks/weihai-opc 自带资产副本，不受影响；如需按新系统重排，另行 `new-deck` 迁移。

## 10. 风险

- Playfair 数字在 editorial KPI 槽位更宽，`l07-num` 168px 可能溢出 320 宽：以 4 字符上限 + R3 校验兜底，必要时 editorial 覆写为 144px。
- 半幅/全幅封面对用户图片比例敏感：R13 裁切损失预警已存在。
- 24 个版式坐标一次全改，回归只能靠金样目检 + 基线重录，没有旧基线可比。
