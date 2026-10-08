# 动画配方（enhance.js）

演示模式自动生效，零配置零依赖；`?flat=1` 通道（校验/截图/导出）和 `prefers-reduced-motion` 用户永远看到静态页，导出物不受任何影响。

## 风格库：骨架上声明 `data-anim`

风格库 deck 的动效由骨架上的 `data-anim` 决定，enhance.js 不认任何风格的 class 名；同一配方的元素按 DOM 顺序错开。所有配方结束后回到样式表的静态值（与渲染 / 导出一致）。

| `data-anim` | 动效 | 语义 |
|---|---|---|
| `rise` | 上移 24px 淡入，500ms，同配方间隔 80ms | 标题 / 文字入场 |
| `draw` | 从左 scaleX 拉出，600ms | 分隔线、横轴 |
| `grow-x` | 从左 scaleX 生长，间隔 90ms，600ms | 条形量值 |
| `grow-y` | 自顶 scaleY 拉出，600ms | 纵轴 |
| `count` | 逐个淡入 + count-up 700ms，前后缀（+/%）保留 | KPI 数字 |
| `pop` | scale 弹入，间隔 90ms | 节点圆点 |
| `ring` | scale 弹入，间隔 140ms（按 DOM 顺序排成顺时针） | 闭环节点 |
| `fade` | 淡入，间隔 60ms | 矩阵格、图例 |
| `scale` | 由小放大，间隔 180ms | 同心圆层级 |

图片 / 视频不需要声明，统一 1.04→1 缓放 + 淡入。

## legacy 配方（自动按元素类型触发，`assets/legacy/enhance.js`）

| 元素 | 动效 | 语义 |
|---|---|---|
| 页标题（sl-title / l01-title / l03-title / l04-text / l13-title） | 上移 24px 淡入，500ms | 入场 |
| 分隔线（sl-rule / l01/l03/l13-rule / l08-axis / l12-link） | 从左 scaleX 拉出，600ms | 结构展开 |
| 鬼影（sl-ghost） | 右移 48px 淡入至 0.07，900ms | 氛围 |
| KPI 数字（l07-num） | 逐列淡入 + count-up 700ms，前后缀（+/%）保留 | 数据强调 |
| 圆点（l08-dot / l12-dot） | 逐个 scale 弹入，间隔 90ms | 节点推进 |
| 条形（l15-bar） | 从左 scaleX 生长，逐行间隔 90ms，600ms | 量值比较 |
| 环形节点（l20-node） | 顺时针 N→E→S→W 逐个 scale 弹入，间隔 140ms | 闭环推进 |
| 矩阵格（l21-num / l21-label） | 按格淡入，间隔 60ms | 逐项盘点 |
| 纵轴（l23-axis） | 自顶 scaleY 拉出 600ms，随后 l23-dot 自上而下弹入 | 时序展开 |
| 同心圆（l24-l1/l2/l3） | 由外向内逐层 scale 展开，间隔 180ms，图例随后淡入 | 层级嵌套 |
| 图片（img） | 1.04→1 缓放 + 淡入，900ms | 沉浸 |

## 纪律

- 配方与元素绑定，**不允许自选动画**；每页实际动效由所用版式决定，天然满足"每页一个语义配方"。
- 每页只播一次（翻回不重播），演讲节奏不被打断。
- 新增版式只能从上表选配方写进骨架；确需新配方时先定义语义再进 enhance.js 的 `RECIPES`，禁止装饰性动效。
