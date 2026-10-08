# 风格库重构：12 种风格 × 独立版式集

日期：2026-10-08 · 状态：已确认，进入实施 · 取代：`2026-09-06-folio-redesign-design.md`

## 1. 背景与目标

现状成品的问题（对 showcase / swiss / weihai 三套 deck 逐页目检）：下半页大面积空洞、正文小且层级弱、坐标纸 + 角标 + SHEET 编号带来的施工图感、用户照片用不足（weihai 33 张实拍只用 3 张）、24 个版式在三套系统下同构。

方向诊断阶段用同一份真实内容画了 11 种做法的三页样张（封面 / 数据 / 内容），用户的结论是全部收进风格库，并保留 DATUM 作为第 12 种。

**目标**：skill 提供 12 种风格，每种有自己独立的版式集；开场时由用户从风格画廊里挑选。HTML 单源 → PPTX / PDF / PNG 衍生的架构不变，每种风格都必须能导出可编辑 PPTX。

**非目标**：不生图、不接图库（金样配图由脚本生成抽象图）；不做同一份内容一键换风格（独立版式集的代价，已接受）。

## 2. 风格清单

| ID | 名称 | 分组 | 视觉要点（来自已确认的样张） | 推荐场合 |
|---|---|---|---|---|
| magazine | A 杂志 · 暖纸 | 编辑排印 | 暖纸墨字，宋体大标题 + 拉丁斜体穿插 + 等宽小标签；Didone 数字；照片当主角带图注；柠檬黄全页只用一处 | 分享、宣传、人文 |
| swiss | B 瑞士 · 网格 | 商务理性 | 极细无衬线巨字，单一克莱因蓝，严格网格与色块，方块分页标记 | 数据、发布、技术 |
| keynote | C 发布会 · 暗场 | 舞台冲击 | 黑底、满版照片 + 底部压暗、一页一个重点、大字居中、暖黄强调、圆角深色卡 | 路演、大屏演讲 |
| broadsheet | D 报刊 · 版面 | 编辑排印 | 报头 + 粗细双线、多栏排文、宋体黑标题、红色栏目名、竖分栏线 | 工作汇报、机构材料、高密度内容 |
| poster | E 大字报 · 粗野 | 舞台冲击 | 荧光绿 / 纯黑 / 米白三色，撑满画面的粗黑巨字，照片带硬阴影色块，整行色带强调 | 招募、活动宣传、社群 |
| soft | F 柔和 · 产品 | 商务理性 | 浅灰底白色圆角卡片，暖橙强调，悬浮数据卡（投影），步骤圆点连线 | 产品介绍、合作提案 |
| photobook | G 摄影集 · 画册 | 影像叙事 | 照片说话、文字退到图注；胶片条封面；数字压在照片的半透明压暗条上；宋体 + 拉丁斜体图注 | 空间 / 活动宣传、年度回顾、画册 |
| consulting | H 咨询 · 白皮书 | 商务理性 | 结论式标题（一句话）、追踪标签、图表编号 + 出处、深海军蓝 + 亮蓝、燕尾流程、「关键」结论条 | 汇报、提案、尽调 |
| zen | I 日式 · 极简 | 东方人文 | 大留白、细宋体 + 竖排、全页一个朱红小点、超细数字 | 品牌、文化、设计分享 |
| scrapbook | J 拼贴 · 手账 | 影像叙事 | 牛皮纸底、拍立得斜贴、彩色半透明胶带、便利贴、手写标题、荧光笔 | 社群、活动回顾、校园、生活方式 |
| oriental | K 新中式 · 东方 | 东方人文 | 宣纸米色、宋体黑 + 楷体、竖排标题、朱砂印章、细双线边框、照片轻度去饱和；不用祥云回纹类俗套纹样 | 文旅、政务、传统文化、节庆 |
| datum | L 工程制图 | 商务理性 | DATUM 制图语汇（坐标纸、裁切角标、尺寸线、图签栏）按新标准重做：底部锚定、字号层级、照片用足 | 技术汇报、工程评审 |

样张原稿在本地 `.superpowers/brainstorm/`（含私有照片，已加入 `.git/info/exclude`，不入库）。

## 3. 架构

### 3.1 风格包

```
styles/<id>/
  style.css       token、@font-face、全部版式几何、本风格专用装饰类
  layouts.md      版式注册表：每个版式的骨架 HTML、角色、密度区间、适用场景
  manifest.json   name / group / layouts（id → role）/ fonts（web 与 office 回退）/ recommend
  golden/         金样 deck（index.html + assets/）
```

- 每种风格独立版式集，版式 id 形如 `magazine/kpi-split`，写在 `<section class="slide" data-layout="…" data-role="…">`。
- `assets/base.css` 瘦身为所有风格共用的底座：画布与 slide 外壳、绝对定位元素契约（`[data-shape]` / img / video / audio / h1–h3 / p）、通用形状原语（rect / ellipse / chevron / pentagon）、段内强调、讲稿、演示 / 演讲者模式 chrome。旧的 24 个版式几何、paper / graphite / forest 主题、`systems/` 退役。
- deck 加载 `base.css` + 一个 `styles/<id>/style.css`，可选再加一个只改 token 的 `brand.css`（import-theme 产出）。

### 3.2 角色层

固定角色表（全风格通用）：

| 角色 | 含义 | 核心 |
|---|---|---|
| cover | 封面 | ✓ |
| agenda | 目录 / 议程 | ✓ |
| section | 章节分隔 | ✓ |
| statement | 金句 / 观点陈述 | ✓ |
| kpi | 数据大字 | ✓ |
| compare | 对比 | ✓ |
| points | 并列要点 | ✓ |
| process | 流程步骤 | ✓ |
| timeline | 时间线 | ✓ |
| image | 大图主视觉 | ✓ |
| image-text | 图文 | ✓ |
| closing | 结尾 / CTA | ✓ |
| bars | 条形对比图 | |
| table | 台账 / 规格表 | |
| gallery | 图集 | |
| cycle | 环形闭环 | |
| matrix | 矩阵盘点 | |
| system | 同心圆 / 层级 | |
| video | 视频 | |
| audio | 音频 | |

- 每种风格必须覆盖 12 个核心角色；同一角色可有多个版式。
- 选版式两步：内容形状 → 角色（SKILL.md 一张通用表）→ 当前风格 `layouts.md` 里该角色的版式。
- 数据诚实规则按角色挂：`kpi` / `bars` / `table` 必须有出处；`bars` 条长与数值成比例。

### 3.3 写在骨架上的导出与动画声明

- 文本框合并：骨架里给成组的文字槽位加 `data-merge="<group>"`，导出器把同一 slide 内同组元素合成一个 PPTX 文本框（段距按实测间隔换算，沿用现有算法）。取代 `export-pptx.mjs` 里按版式编号硬编码的 `MERGE_GROUPS`。
- 动画：骨架里写 `data-anim`，取值 `count`（数字滚动）/ `rise`（同组依次上浮）/ `grow-x`（条形生长）/ `grow-y`（纵轴拉出）/ `draw`（线条拉出）/ `pop`（圆点弹入）/ `ring`（顺时针点亮）/ `scale`（由外向内缩放）。取代 `enhance.js` 里按 class 名写死的配方。
- 原生图表 `--native-charts`：作用于 `data-role="bars"` 的页面，取值来自骨架上的 `data-value`。

## 4. 导出器与校验器

### 4.1 元素能力扩展

| 能力 | HTML 侧 | 测量 | PPTX 侧 |
|---|---|---|---|
| 圆角 | `border-radius`（shape） | 计算样式 | `roundRect` + `rectRadius` |
| 描边 | `border`（shape，四边同宽同色） | 计算样式 | `line: { color, width, transparency }` |
| 燕尾 / 五边形 | `data-shape="chevron"` / `"pentagon"`（clip-path 定义在 base.css） | shape 名 | `chevron` / `homePlate` |
| 旋转 | 行内 `rotate: <deg>`（R6 白名单新增这一项） | 未旋转盒（offset 几何）+ 角度 | `rotate` |
| 阴影 | `box-shadow`（单层 outer） | 偏移 / 模糊 / 颜色 | `shadow: { type:'outer', … }` |
| 竖排 | `writing-mode: vertical-rl` + `text-orientation: mixed` | 计算样式 | `vert: 'eaVert'` |
| 图片圆角 / 滤镜 / 旋转 | CSS | 需要烘焙的标记 | 浏览器内截图后嵌入（旋转图先摘掉旋转再截，角度交给 PPTX） |
| 不可映射装饰（渐变等） | `data-raster` | 元素盒 | 仅该元素单独截图嵌入，文字保持原生 |

文字永远是原生可编辑文本框；以上能力只作用于形状和图片。

### 4.2 字体

- `manifest.json` 声明 `fonts.web`（@font-face 来源与子集）和 `fonts.office`（PPTX 写入的 Office 字体名）；`--cjk-font` 等参数保留为临时覆盖。
- 新增 OFL 字体源：Playfair Display（A / G 斜体与数字）、Inter（B / C / E / F / H 拉丁）、霞鹜文楷（J / K）、J 的手写体（实施时选型，必须核实 OFL）、思源宋 Light / ExtraLight 静态字重（I）。
- 正文 CJK 继续走系统字体栈，保持 HTML ↔ PPTX 换行一致。

### 4.3 校验器

- R1：`data-layout` 必须在当前风格的 manifest 里，`data-role` 必须与注册一致。
- R2：class 白名单 = base.css + 当前风格 style.css（+ brand.css）。
- R6：行内样式白名单新增 `rotate`。
- R8：按角色检查出处与条形比例。
- R12：样式表只允许 base.css + 一个 `styles/<id>/style.css` + 可选 brand.css。
- R3 / R9：旋转元素按旋转后外框计算。
- 其余规则（R4 / R5 / R7 / R10 / R11 / R13 / R14 / R15）不变。
- 新增 `scripts/check-style.mjs`（风格包自检，不是 deck 规则）：12 个核心角色都有版式；manifest 里每个版式都出现在金样里；layouts.md 骨架用到的 class 都在 style.css 里定义；manifest 字体文件存在。

### 4.4 先验证的技术点（P0 第一步）

1. 竖排夹英文：网页 `text-orientation: mixed` 与 PowerPoint `eaVert` 的拉丁字符旋转是否一致（LibreOffice 渲染 + 用户 WPS 目检）。
2. `rectRadius` 单位与取值：实测 pptxgenjs 输出的 `adj` 值，对齐浏览器圆角。
3. 旋转 + 阴影：pptxgenjs 输出 XML 与 LibreOffice 渲染的位置偏差。
4. 手写字体在 WPS / PowerPoint 的回退效果（J 期再验证）。

验证不通过时当场调整设计（例如竖排页英文改为整页不混排）。

## 5. 金样与画廊

- 12 套金样共用一份内容脚本：讲这个 skill 自己（真实数据，出处可查），同一角色的页面文字相同，便于画廊横向比较。
- 配图由 `scripts/gen-art.mjs` 生成：Playwright 渲染 SVG / CSS 构图为 PNG，固定种子、确定性输出，配色取自风格 token；图注标「示意图」。
- `scripts/style-gallery.mjs` 从各金样封面生成 `docs/styles/index.html` + 拼图 PNG，用于开场选风格与 README 预览。
- 基线目录改为 `baselines/<style>/`，`npm run regress` 与 CI 按风格逐个跑（validate + render + PPTX 冒烟 + check-pptx）。

## 6. Skill 工作流变化

- 第 1 步：定档位（Web / Office）之后选风格，agent 展示风格画廊并按场合推荐 2–3 种：分享 / 宣传 → A / G / J；数据 / 发布 → B / C；汇报 / 提案 → H / D；产品 → F；招募 / 活动 → E；文化 / 文旅 → I / K；技术 → L。用户不挑时默认 A。
- `new-deck.mjs --style <id>` 复制 base + 运行时 + 该风格包资产。
- 选版式按 3.2 的两步走。

## 7. 分期

| 期 | 范围 | 验收 |
|---|---|---|
| P0 平台 | 风格包结构、base.css 瘦身、角色层、data-merge / data-anim、导出器能力扩展与技术验证、校验器改造、check-style、gen-art、style-gallery、new-deck --style、SKILL.md 路由骨架 | 现有 swiss 原样迁入 `styles/swiss/`，像素回归接近 0% |
| P1 | A magazine、B swiss（在迁入基础上重做）、H consulting、G photobook | 每种：3 页样张确认 → 完整版式集 → 金样 → 校验 0 error → PPTX + check-pptx + LibreOffice 几何比对 → 基线 → sync |
| P2 | C keynote、D broadsheet、E poster、F soft | 同上 |
| P3 | I zen、J scrapbook、K oriental、L datum | 同上 |

每期单独写实施计划。

## 8. 退役与迁移

- 退役：`examples/showcase`、`examples/editorial`、`examples/swiss`、`examples/media`、`examples/v2-lab`；`assets/themes/`、`assets/systems/`；base.css 中的 L01–L24 几何；`baselines/` 旧结构。
- 视频 / 音频角色进入 A、C、G；`references/layouts.md` 拆分进各风格包的 `layouts.md`，通用部分（元素契约、角色表、决策表）留在 references。
- `decks/weihai-opc` 自带资产副本，不受影响。
- 旧系统在 P0–P3 期间仍可用，直到对应风格交付后再删除，保证每个提交都能跑通。

## 9. 风险

- 工作量：12 种 × 14–20 个版式，逐页目检是主要成本；靠「3 页样张先行」和 check-style 自检控制返工。
- 视觉 vs 导出：阴影、旋转、圆角的 PPTX 观感与浏览器有差异，以 LibreOffice 几何比对 + 手动 WPS 打开兜底，差异写进各风格 layouts.md。
- 字体体积：每种风格可能多 1–2 套字体源；子集化后每 deck 仍控制在约 1MB 量级。
- 抽象配图会让 G / J 这类摄影风格的金样观感打折；README 里注明风格以真实照片使用效果为准。
