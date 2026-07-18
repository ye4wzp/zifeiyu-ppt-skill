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

事实依据（validation/REPORT.md，2026-07-16 实测）：
- pptxgenjs **不支持字体嵌入**，fontFace 只是名字引用，接收方机器必须装有该字体。
- PingFang 仅 macOS 可用；Windows 上会静默回退（通常到宋体/等线）改变字宽度量。跨平台交付一律用 Microsoft YaHei。
- 换算契约：坐标 px÷96→英寸；字号/行距/字间距 px×0.75→磅。
- 字重映射：CSS ≥600 → bold；`Helvetica Neue` ≤300 → face 名 "Helvetica Neue Light"。PPTX 无数值字重。

## 讲稿与图表

- **讲稿自动随行**：`<aside class="notes">` 的文字导出为 PowerPoint 原生备注（备注视图/演示者视图可见），无需任何参数。
- **图表两种模式**：默认 L15 条形图映射为矩形（与 HTML 逐像素一致）；加 `--native-charts` 则生成**原生可编辑图表**（接收方可双击改数据）。原生模式下图表样式由 PowerPoint 渲染，与 HTML 预览不逐像素一致、几何比对会标红——这是模式特性，按需选择：交付定稿用默认，交付给要继续编辑数据的人用 native。数值从 `.l15-val` 文本解析（"21.5k"→21.5，单位丢失），解析失败自动回退矩形模式。

## 导出后验证（第三道门，不可跳过）

```bash
soffice --headless --convert-to pdf <deck-dir>/deck.pptx --outdir <deck-dir>/
pdftoppm -png -r 96 <deck-dir>/deck.pdf <deck-dir>/renders-pptx/slide
```
逐页与 `renders/`（HTML 侧截图）比对。已知无害差异 vs 必须处理的问题：

| 现象 | 定性 |
|---|---|
| 字形抗锯齿差异、基线 1–3px 微移 | 无害，忽略 |
| 窄栏每行 ±1 字换行漂移（标点压缩） | 无害；若造成溢出则精简该行文案 |
| LibreOffice 中文渲染成宋体/繁体/其他字体 | LibreOffice 侧解析问题，见下方「验证的职责边界」 |
| 文本溢出槽位、错位 >10px | 必须处理：多为文案超长或换算错误 |
| L09 图片页像素差异飙高（30%+） | 多为无害：CSS object-fit:cover 中心裁切 vs pptxgenjs cover 锚点不一致，取景窗偏移但构图完好；目检文字与遮罩位置正确即可放行（2026-07-16 实测确认） |

**验证的职责边界**（2026-07-16 实测结论）：macOS 上 LibreOffice 对 CJK 字体名的解析不稳定——同一 PPTX 三次转换分别回退到 PingFang、华文宋体繁体、方正兰亭黑（配置文件重建/字体索引未完成时尤甚，且并发多实例会因 profile 锁互相干扰，必须串行转换）。因此自动比对只作为**几何门**（位置、尺寸、换行、溢出）；**字体门**以 `pdffonts` 检查 PPTX 内声明的 typeface 名 + 在 WPS/PowerPoint 中人工打开确认。PPTX 的 XML 声明正确即导出器无责。

## 维护铁律

新增/修改版式必须四处同步：base.css 骨架样式 + `references/layouts.md` 注册 + 校验器（若涉及新规则）+ 金样 deck 重跑全链路比对。金样即回归基准。
