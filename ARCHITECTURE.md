# PPT Skill 架构设计

> 形态：Agent Skill（Claude Code / Codex 可用）
> 产出：HTML 为唯一源，PDF / PPTX / PNG 为一键衍生物
> 风格：锁定设计系统 + Design Token 主题
> 许可：MIT（方法论参考归藏系项目，代码与模板不复用其 AGPL 内容）

## 1. 核心命题

四个标杆项目（guizang-ppt-skill 21.5k★、huashu-design 21.5k★、html-ppt-skill 7.2k★、guizang-social-card-skill 5.1k★）验证了同一条公理：

**LLM 生成视觉内容的质量下限，由约束系统决定，而非模型能力决定。**

本项目的差异化定位：**在锁定设计系统的前提下，把 PPTX 导出做成一等公民**——这是归藏（明确不做）和 html-ppt-skill（完全没有）的集体空白，花叔虽有但依赖通用 HTML→PPTX 翻译（自由 HTML 通过率 <30%）。

### 关键架构洞察：封闭词汇表 × 测量驱动导出的组合红利

因为每页只能使用封闭的版式集合（`data-layout`）与封闭的元素词汇表（`[data-shape]` / `img` / `h1–h3` / `p`），PPTX 导出器**不需要**做通用 HTML→PPTX 翻译（难、脆、不可维护），甚至不需要逐版式映射函数——只需**在浏览器里实测每个注册元素的渲染几何与计算样式，按固定比例换算成 pptxgenjs 调用**：

```
measureDeck(): box + font + color + runs → px÷96→in、px×0.75→pt → addText / addShape / addImage
```

新增版式因此零导出成本：只要骨架遵守元素词汇表，导出自动正确。约束换来的不只是视觉稳定，还有导出的可靠性。这是本项目最重要的一条设计决策。

## 2. 三大支柱（从标杆项目继承）

| 支柱 | 来源 | 落地方式 |
|---|---|---|
| 种子模板 + 注入区 | 归藏 | AI 禁止从零写 HTML，只能向 `<!-- SLIDES_HERE -->` 注入注册版式的骨架副本 |
| 版式注册制 + 机器校验 | 归藏 + social-card | 每页声明 `data-layout`，Playwright 校验器执行量化规则（溢出/密度/字号/间距） |
| Token 化主题系统 | html-ppt-skill | `base.css` 定义全部 token，主题文件只覆写 token，slide 标记内禁止裸色值 |

辅以花叔的四条流程纪律：交付格式先于第一行代码确认、≥5 页先出 2 页语法样张、真实资产优先（logo/数据/图片不许编造）、渲染后视觉自检而非只读代码。

## 3. 双档位模型（解决"视觉自由 vs PPTX 可转换"的冲突）

用户在需求澄清的**第一个问题**选定档位，之后不可切换（花叔实证：中途切换成本 2-3 小时，事前确认成本 5 分钟）：

| | Web 档 | Office 档 |
|---|---|---|
| 交付物 | HTML（+ PDF / PNG） | HTML + 可编辑 PPTX（+ PDF） |
| 动画 | 语义动画配方（每页 ≤1 种） | 无（或仅导出时剥离的入场动画） |
| 装饰层 | 允许 canvas 背景、纹理层 | 禁止渐变 / 复杂 SVG / 背景图文字 |
| 文字约束 | 无 | 所有文字必须在 `<p>` / `<h*>` 内，装饰属性只挂 wrapper div |
| 版式集 | 全部注册版式 | 标记为 `pptx-safe` 的版式子集 |

两档共用同一套版式骨架和 token 主题。Office 档不是另一套模板，而是同一版式库的约束子集——版式骨架本身按 pptx-safe 结构编写，Web 档在其上叠加增强层（动画、canvas 背景），导出 PPTX 时增强层自动剥离。

**画布规格**：逻辑画布固定 1280×720 px（JS letterbox 缩放适配窗口，禁用 vw/vh 布局），px→pt 映射为 ×0.75，正好得到 PowerPoint 标准 16:9 的 960×540 pt。

## 4. 目录结构

```
ppt-skill/
├── SKILL.md                     # 薄路由：工作流 + 硬约束，≤400 行
├── README.md / README.en.md
├── LICENSE                      # MIT
├── references/                  # 按需加载，SKILL.md 只放索引
│   ├── layouts.md               # 版式注册表：16 个骨架 + DATUM 铺装 + 段内强调 + 微调规则
│   ├── narratives.md            # 路演/汇报/宣传三套叙事页序模板
│   ├── themes.md                # 主题与设计系统目录（受众→主题映射表）
│   ├── authoring.md             # 写作规范：密度上限、CJK 字号表、中英混排规则
│   ├── pptx-export.md           # Office 档约束全文 + 导出排错表 + 维护铁律
│   ├── animations.md            # 语义动画配方（数字→count-up、点→弹入、线→拉出）
│   └── checklist.md             # P0–P3 分级质检清单
├── assets/
│   ├── base.css                 # design tokens + 全部版式骨架样式（唯一允许定义 class 的地方）
│   ├── themes/                  # paper / graphite / forest，每套 ≤100 行，只覆写颜色 token
│   ├── systems/                 # 设计系统（editorial「墨韵」），可覆写字体 token 与排印细节
│   ├── textures/                # DATUM 坐标纸/点阵纹理
│   ├── fonts-src/               # 完整字体源（思源黑 VF/思源宋/JetBrains Mono，gitignore，fetch-fonts 拉取）
│   ├── runtime.js               # 演示导航 + 深链 #/N + 演讲者控制台（BroadcastChannel 双窗同步）
│   └── enhance.js               # Web 档语义动画层（?flat=1 与导出通道自动跳过）
├── templates/seed.html          # 种子模板：完整 head/引用 + <!-- SLIDES_HERE -->
│                                # （版式骨架统一登记在 references/layouts.md，不设片段文件）
├── scripts/                     # 全部基于 Playwright，跨平台
│   ├── lib/deck.mjs             # 测量器：flat 模式实测每页元素的几何/样式/runs
│   ├── new-deck.mjs             # deck 脚手架（复制种子 + 全部运行时资产）
│   ├── fetch-fonts.mjs          # 一次性拉取字体源（~80MB，SIL OFL）
│   ├── subset-fonts.mjs         # 按 deck 实际字符裁切 woff2 子集 → <deck>/assets/fonts/
│   ├── validate.mjs             # 校验器 R1–R12（规则见 §6）
│   ├── export-pptx.mjs          # 测量结果 → pptxgenjs 确定性映射（含 --native-charts）
│   ├── export-pdf.mjs           # 矢量 PDF
│   ├── render-png.mjs           # 逐页截图
│   └── diff.mjs                 # 像素回归比对器（pixelmatch）
├── baselines/                   # 金样渲染基线（npm run regress 的比对基准）
└── examples/                    # 金样 deck：showcase（现代系统）+ editorial（墨韵），兼作回归基准
```

## 5. 版式注册表（19 个，全部 pptx-safe）

| 编号 | 版式 | 叙事角色 |
|---|---|---|
| L01 | 封面 | 开场钩子 |
| L02 | 目录/议程 | 结构预告 |
| L03 | 章节分隔 | 节奏切换 |
| L04 | 观点陈述（大字） | 单点强调 |
| L05 | 双栏对比 | 方案/前后对比 |
| L06 | 三点论证 | 并列论据 |
| L07 | KPI 数据大字 | 数据冲击（要求真实数据） |
| L08 | 时间线 | 演进叙事 |
| L09 | 图片主视觉 | 情绪/产品展示 |
| L10 | 正文加要点 | 常规内容页 |
| L11 | 台账行 | 结构化信息 |
| L12 | 流程步骤 | 过程说明 |
| L13 | 结尾/CTA | 收束 |
| L14 | 图文半幅 | 宣传类内容页 |
| L15 | 条形对比图 | 数据对比（条长与数值成正比，校验器核对；可导出原生图表） |
| L16 | 图片网格 2×2 | 多图并列 |
| L17 | 视频主视觉 | 全幅动态开场/氛围（poster 锁帧） |
| L18 | 视频半幅 | 视频作论据，讲解与画面同屏（可镜像） |
| L19 | 音频页 | 播客/音乐/访谈片段，设计化播放卡片 |

每个版式在 `layouts.md` 中登记骨架、密度区间与适用场景。扩展新版式必须四处同步：base.css 骨架样式 + layouts.md 注册 + 校验器（若涉及新规则）+ 金样重跑回归（归藏同款纪律）。测量驱动的导出器对遵守元素词汇表的新版式零成本。

**每页密度纪律**（花叔）：1 个核心信息 + 3–4 个支撑点 + 1 个视觉主角，超出即拆页；相邻页不得重复同一版式。

## 6. 质量管线（三道门）

**第一道：机器校验 `validate.mjs`**（量化规则 R1–R12；error exit 1 阻断交付，warn 放行）

| 规则 | 级别 | 检查内容 |
|---|---|---|
| R1 | error | 每页 `data-layout` 必须在注册表内（L01–L16） |
| R2 | error | class 白名单：所有元素（含 shape/img 与段内 span）不得使用 base.css 未定义的 class |
| R3 | error | 溢出：任何元素不得超出 1280×720 画布；文字不得水平溢出自身槽位 |
| R4 | error | 字号下限：任何文字 ≥16px |
| R5 | warn | 密度带：内容包围盒占画布 25%–97%（全幅图页豁免上限） |
| R6 | error | 行内样式白名单：所有元素只许 `top/left/width/height/font-size/line-height` 参数化数值——裸色值/字体声明无处可写 |
| R7 | error | 文字容器契约：h1/h2/h3/p 之外的裸文字、段内非 strong/em/span 标签或嵌套，一律拦截 |
| R8 | error | 数据诚实：L07/L15 必须有来源标注（footnote 或 DATUM 图签栏 SOURCE）；L15 条长与解析数值的比例偏差 >max(4px, 2%) 即报错 |
| R9 | error | 文本碰撞：两个不透明文本重叠超过较小者面积 4%（透明度 <0.2 的鬼影字豁免） |
| R10 | error | 可访问性：内容图必须有 alt，装饰图必须声明 aria-hidden |
| R11 | warn | 对比度下限：文字对其实际所在表面（含半透明 shape 叠色）<3:1 预警；图上文字跳过，交目检 |
| R12 | error | 文档卫生：禁 `<style>` 标签、只允许 base.css + 一个主题/系统文件、Office 档禁远程图片 |
| R13 | error | 媒体契约：视频必带 poster（确定性静止帧）、媒体与 poster 禁远程 URL、配合 R10 的 aria-label 要求 |

R2 + R6 + R12 合围出"颜色只能经 token"的机器保证：deck 内除白名单类与参数化几何外没有任何样式通道。

**第二道：P0–P3 视觉自检**（渲染截图后执行，不是只读代码）
P0 = 文字溢出/遮挡/对比度不足；P1 = 版式误用/密度失衡；P2 = 主题不一致/间距失谐；P3 = 打磨项。P0/P1 必须修复。

**第三道：导出验证**（Office 档）
PPTX 导出后重新截图与 HTML 逐页比对，字体回退导致的溢出逐页确认。

**回归基线**：`baselines/` 存两套金样的逐页渲染；`npm run regress` 像素比对（同机），`npm run baseline` 在设计有意变更时重录。

## 7. Skill 工作流（SKILL.md 主流程）

```
1. 需求澄清（一次性 ≤5 问）
   Q1 交付格式 → 定档位（Web / Office）   ← 不可后置
   Q2 受众与场合 → 查"受众→主题"映射表，推荐 2–3 个主题
   Q3 页数/时长
   Q4 已有素材（大纲/文档/数据/图片/logo）
   Q5 硬性约束（品牌色仅在用户有明确品牌规范时接受）
2. 资产先行：真实 logo（svgl → simpleicons → favicon 链）、真实图片、真实数据；
   涉及真实产品的事实必须先核实再写入
3. `scripts/new-deck.mjs` 脚手架建 deck 目录（种子 + 全部运行时资产 + 选定主题）
4. 大纲 + 2 页语法样张（封面 + 最典型内容页）→ 用户确认后才批量生产
5. 逐页填充：选注册版式 → 复制骨架 → 只替换内容 → 密度自查
6. node scripts/validate.mjs → 修复循环直至通过
7. 渲染截图 → P0–P3 视觉自检
8. 交付 HTML；按档位追加 PPTX / PDF / PNG
```

## 8. 里程碑（M1–M5 已全部落地）

- **M1 · 最小闭环**：seed.html + base.css + 3 套 token 主题 + 版式骨架 + runtime.js + validate.mjs + 金样 deck。
- **M2 · 差异化卖点**：export-pptx.mjs 测量驱动导出 + Office 档规则 + pptx-export.md + Office 档金样。
- **M3 · 完整交付链**：export-pdf.mjs、render-png.mjs、enhance.js 语义动画、原生备注/原生图表导出。
- **M4 · 体验补强**：设计系统 02「墨韵」、DATUM 制图铺装、演讲者模式（BroadcastChannel 双窗同步 + 讲稿 + 计时器）、L14–L16 版式。
- **M5 · 质量闭环**：new-deck 脚手架、校验器全元素覆盖（R1–R12：数据比例诚实、对比度预警、文档卫生）、段内强调 text runs 导出、像素回归基线（baselines/ + regress）。
- **M6 · 排印升级**：确定性字体子集管线（思源黑 VF/思源宋/JetBrains Mono → 每 deck 约 800KB woff2，三端一致）、CJK 排印细节（halt 标点挤压、短槽位 balance 断行、正文 justify、标题 700）、构图修缮（L02 引导线+页码列、L12 垂直居中、封面鬼影数字平衡）。display/数字/mono 走子集字体，正文保持系统字体以维持 HTML↔PPTX 换行一致。
- **M7 · 媒体版式**：`<video>/<audio>` 进入元素契约（测量/校验/导出全链路）——L17 视频主视觉、L18 视频半幅、L19 音频页、L14/L18 镜像变体；poster 锁定静止帧保证确定性，enhance.js 驱动播放语义（进页自动静音播放、点击切换、音频进度线），PPTX 用 addMedia 原生嵌入（封面为浏览器实际渲染截图），PDF 将视频替换为 poster；媒体金样 examples/media 进 CI 与回归基线。

## 9. 风险与对策

| 风险 | 对策 |
|---|---|
| PPTX 映射的字体回退错位（花叔已知痛点） | 主题字体栈只选 PowerPoint 常见字体的 webfont 版本；导出后逐页比对是硬性流程 |
| 版式扩展导致三处不同步 | checklist 中设 P0 项；金样 deck 兼作回归基准，改动后必须重跑 validate + 截图比对 |
| SKILL.md 膨胀失控 | 硬上限 400 行，超出即拆入 references/ |
| AGPL 污染 | 只读归藏系项目学思路，任何骨架/CSS/校验规则均独立实现；可复用代码仅取自 MIT 的 html-ppt-skill 与 huashu-design |
