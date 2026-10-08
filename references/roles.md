# 角色表与骨架声明

风格库里每种风格有自己独立的版式集（`styles/<id>/layouts.md`），但所有版式都声明一个**角色**（`data-role`）。选版式分两步：先按内容形状对到角色（本页），再到当前风格的 `layouts.md` 里挑这个角色的版式。校验器、数据诚实规则和导出器只认角色和骨架上的声明属性，不认具体风格的 class 名。

## 角色表

| 角色 | 含义 | 核心 |
|---|---|---|
| cover | 封面 | ✓ |
| agenda | 目录 / 议程 | ✓ |
| section | 章节分隔 | ✓ |
| statement | 金句 / 单点观点 | ✓ |
| kpi | 数据大字（真实数据 + 出处） | ✓ |
| compare | 二元对比 | ✓ |
| points | 并列要点 | ✓ |
| process | 线性流程步骤 | ✓ |
| timeline | 时间线 | ✓ |
| image | 大图主视觉 | ✓ |
| image-text | 图文 | ✓ |
| closing | 结尾 / CTA | ✓ |
| bars | 条形对比图（真实数据 + 出处，条长与数值成正比） | |
| table | 台账 / 规格表（真实数据 + 出处） | |
| gallery | 多图并列 | |
| cycle | 环形闭环（有回路才用） | |
| matrix | 8–12 项盘点 + 总数 | |
| system | 同心圆 / 层级嵌套 | |
| video | 视频 | |
| audio | 音频 | |

`status: "ready"` 的风格必须覆盖全部 12 个核心角色（`check-style.mjs` 把关）；`draft` 风格缺核心角色时，缺的那类页面先用其他风格或等风格补齐。

## 内容形状 → 角色

先看内容长什么形状，再挑角色；形状对不上就换内容组织方式，不硬塞。

| 内容形状 | 角色 |
|---|---|
| 开场 / 收束 | cover / closing |
| 3–5 条议程 | agenda |
| 节奏切换 | section |
| 一句话强调 | statement |
| 真实数据指标 2–3 个 | kpi |
| 行级对比数据 | bars |
| 台账、参数、规格 | table |
| 8–12 项盘点 + 总数 | matrix |
| 恰好 3–4 个并列项 | points |
| 二元对比 | compare |
| 线性先后步骤 | process |
| 按时间演进 | timeline |
| 有回路的过程 | cycle |
| 层级嵌套 | system |
| 一张证据图 / 氛围图 | image |
| 一段讲解 + 一张图 | image-text |
| 多张图并列 | gallery |
| 视频 / 音频 | video / audio |

## 骨架声明属性

这些属性是版式骨架的一部分，复制骨架时原样保留；新写版式时按需声明。

| 属性 | 挂在 | 作用 | 规则 |
|---|---|---|---|
| `data-layout="<style>/<name>"` | `section.slide` | 版式 id | R1：必须在当前风格 manifest 里注册 |
| `data-role="<role>"` | `section.slide` | 角色 | R1：必须与 manifest 登记一致 |
| `data-merge="<group>"` | 文字槽位 | 同页同组的文字导出为**一个** PPTX 文本框（逐段保留字号 / 颜色，段距按实测换算） | 组内至少 2 个槽位才合并 |
| `data-anim="<recipe>"` | 任意元素 | 演示模式入场动画：`rise` 上浮 / `draw` 横向拉出 / `grow-x` 条形生长 / `grow-y` 纵向拉出 / `count` 数字滚动 / `pop` 圆点弹入 / `ring` 顺时针点亮 / `fade` 渐显 / `scale` 由小放大；同配方的元素按 DOM 顺序错开 | 只在演示模式生效，导出与渲染不受影响 |
| `data-source` | 文字槽位 | 标记数据出处 | R8：kpi / bars / table 页必须有一个非空的 `data-source` 文本 |
| `data-value` + `data-label` | 条形 shape | 条形的真实数值与名称 | R8：条长与 `data-value` 成正比；`--native-charts` 据此生成原生图表 |
| `data-chart` | 文字槽位 | 原生图表模式下由图表取代的文字（条形标签、数值） | — |
| `data-raster` | shape | 浏览器里画得出、PowerPoint 画不出的装饰（渐变等）导出时单独截图嵌入 | 只用于装饰；文字永远原生 |
| `data-media="toggle\|track\|progress\|clock"` | 媒体控件 | 点击播放 / 进度条轨道 / 进度条 / 时间读数 | — |
| `--tip: <px>` | `data-shape="chevron\|pentagon"` | 箭头尖深度 | R16：必须等于短边的一半（PowerPoint 的画法） |
| 行内 `rotate: <deg>` | shape / img / 文字 | 倾斜摆放（PPTX 原生旋转） | R6 放行；R3 / R9 按旋转后的外框计算 |

## 导出一致性（R16）

浏览器画得出、PowerPoint 画不出的写法在 style 模式下直接报错：

- 箭头 `--tip` ≠ 短边一半；
- 四边不一致的描边；
- 多层 `box-shadow`；
- `transform`（旋转请用 `rotate` 属性）；
- 文字槽位自带背景 / 描边 / 阴影 / 内边距（文本框导出不带这些，需要底色就在文字下面放一个 shape）。
