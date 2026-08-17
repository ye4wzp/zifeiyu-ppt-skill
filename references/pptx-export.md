# Office 档与 PPTX 导出

## 档位约束（Office 档从第一页起生效）

- 文字只在 `h1/h2/h3/p`；装饰只挂 `div[data-shape]`；内容图只用 `<img>`。
- 无 CSS 渐变、无阴影、无复杂 SVG；半透明仅允许纯色 rgba（映射为 PPTX transparency）。
- 注册版式全部满足以上约束，正常使用即合规；校验时加 `--office`。

## 导出命令与字体策略

```bash
# 接收方主要在 Windows/跨平台（默认推荐）：
node scripts/export-pptx.mjs <deck-dir> --cjk-font "Microsoft YaHei"
# 接收方确定全是 macOS：
node scripts/export-pptx.mjs <deck-dir> --cjk-font "PingFang SC"
```

HTML / PDF / PNG 三通道由 deck 内字体子集保真（思源黑/思源宋/JetBrains Mono）；PPTX 侧照旧映射系统字体：思源黑→`--cjk-font`（默认 PingFang SC，跨平台交付用 Microsoft YaHei）、思源宋→`--cjk-serif`（默认 SimSun）、JetBrains Mono→Consolas。

事实依据（2026-07-16 全链路实测：HTML 截图 ↔ soffice→PDF→PNG 逐像素比对）：
- pptxgenjs **不支持字体嵌入**，fontFace 只是名字引用，接收方机器必须装有该字体。
- PingFang 仅 macOS 可用；Windows 上会静默回退（通常到宋体/等线）改变字宽度量。跨平台交付一律用 Microsoft YaHei。
- 换算契约：坐标 px÷96→英寸；字号/行距/字间距 px×0.75→磅。
- 字重映射：CSS ≥600 → bold；`Helvetica Neue` ≤300 → face 名 "Helvetica Neue Light"。PPTX 无数值字重。

## 可编辑性

- **文本框合并（注册制）**：设计上连续的槽位组（L05 面板、L06 三列、L10/L12 标题+说明对、L19 音轨行）导出为**一个**文本框——每个槽位成为独立段落，字号/字体/颜色逐段保留，实测间距换算为精确段后距。接收方改一栏文字不再需要逐框点选。
- **`--embed-fonts`（实验性）**：按 OOXML `embeddedFontLst` 规范在 zip 后处理阶段嵌入 deck 字符子集（思源黑按 400/800 静态实例、Light 面 250；思源宋 Regular/Heavy；JetBrains Mono），并保留真实字体名不再映射系统字体。**无开源先例，交付客户前必须在 WPS/PowerPoint 实开一次确认**；默认关闭。

## 讲稿与图表

- **讲稿自动随行**：`<aside class="notes">` 的文字导出为 PowerPoint 原生备注（备注视图/演示者视图可见），无需任何参数。
- **段内强调随行**：`<strong>/<em>/<span class="is-accent">` 导出为原生 text runs（分段加粗/斜体/换色），在 PowerPoint 中仍可逐字编辑。
- **媒体随行**：L17/L18 视频与 L19 音频通过 addMedia 原生嵌入 PPTX（接收方双击播放，Windows PowerPoint 对 H.264 MP4 / MP3 开箱支持）；视频封面为浏览器实际渲染的 poster 截图，静止画面与 HTML 逐像素一致；音频图标落在播放键位置。LibreOffice 几何验证会把媒体渲染为占位帧，属验证侧行为。
- **图表两种模式**：默认 L15 条形图映射为矩形（与 HTML 逐像素一致）；加 `--native-charts` 则生成**原生可编辑图表**（接收方可双击改数据）。原生模式下图表样式由 PowerPoint 渲染，与 HTML 预览不逐像素一致、几何比对会标红——这是模式特性，按需选择：交付定稿用默认，交付给要继续编辑数据的人用 native。数值从 `.l15-val` 文本解析（"21.5k"→21.5，单位丢失），解析失败自动回退矩形模式。

## 导出后验证（第三道门，不可跳过）

```bash
node scripts/check-pptx.mjs <deck-dir>/deck.pptx   # ① 结构门：OOXML 完整性/关系/图表 XML（exit 1 阻断）
soffice --headless --convert-to pdf <deck-dir>/deck.pptx --outdir <deck-dir>/   # ② 几何门
pdftoppm -png -r 96 <deck-dir>/deck.pdf <deck-dir>/renders-pptx/slide
```
逐页与 `renders/`（HTML 侧截图）比对。已知无害差异 vs 必须处理的问题：

| 现象 | 定性 |
|---|---|
| 字形抗锯齿差异、基线 1–3px 微移 | 无害，忽略 |
| 窄栏每行 ±1 字换行漂移（标点压缩） | 无害；若造成溢出则精简该行文案 |
| LibreOffice 中文渲染成宋体/繁体/其他字体 | LibreOffice 侧解析问题，见下方「验证的职责边界」 |
| 文本溢出槽位、错位 >10px | 必须处理：多为文案超长或换算错误 |
| L09 等 cover 图片页像素差异飙高 | 必须处理：导出器已将 cover 裁切以浏览器渲染截图原样嵌入（`.export-crops/`），两侧取景应逐像素一致；再出现大差异即回归 |

**验证的职责边界**（2026-07-16 实测结论）：macOS 上 LibreOffice 对 CJK 字体名的解析不稳定——同一 PPTX 三次转换分别回退到 PingFang、华文宋体繁体、方正兰亭黑（配置文件重建/字体索引未完成时尤甚，且并发多实例会因 profile 锁互相干扰，必须串行转换）。因此自动比对只作为**几何门**（位置、尺寸、换行、溢出）；**字体门**以 `pdffonts` 检查 PPTX 内声明的 typeface 名 + 在 WPS/PowerPoint 中人工打开确认。PPTX 的 XML 声明正确即导出器无责。

## 维护铁律

新增/修改版式必须四处同步：base.css 骨架样式 + `references/layouts.md` 注册 + 校验器（若涉及新规则）+ 金样 deck 重跑全链路比对。金样即回归基准。

改动 base.css / 版式骨架 / 主题后必须跑像素回归：`npm run regress`（对 `baselines/` 逐像素比对，任何一页超阈值即 exit 1）；设计**有意**变更时用 `npm run baseline` 重录基线并连同改动一起提交。基线是同机比对（跨 OS 字体栅格不同），CI 只做校验 + 冒烟。
