# PPT Skill 架构设计

> 形态：Agent Skill（Claude Code / Codex 可用）
> 产出：HTML 为唯一源，PDF / PPTX / PNG 为一键衍生物
> 风格：锁定设计系统 + Design Token 主题
> 许可：MIT（方法论参考归藏系项目，代码与模板不复用其 AGPL 内容）

## 1. 核心命题

四个标杆项目（guizang-ppt-skill 21.5k★、huashu-design 21.5k★、html-ppt-skill 7.2k★、guizang-social-card-skill 5.1k★）验证了同一条公理：

**LLM 生成视觉内容的质量下限，由约束系统决定，而非模型能力决定。**

本项目的差异化定位：**在锁定设计系统的前提下，把 PPTX 导出做成一等公民**——这是归藏（明确不做）和 html-ppt-skill（完全没有）的集体空白，花叔虽有但依赖通用 HTML→PPTX 翻译（自由 HTML 通过率 <30%）。

### 关键架构洞察：注册制版式 × PPTX 导出的组合红利

因为每页幻灯片必须声明封闭集合内的 `data-layout`，PPTX 导出器**不需要**做通用 HTML→PPTX 翻译（难、脆、不可维护），只需要**为每个注册版式写一个确定性映射函数**：

```
data-layout="L07" → 已知的元素结构和坐标 → pptxgenjs 确定性调用
```

约束换来的不只是视觉稳定，还有导出的可靠性。这是本项目最重要的一条设计决策。

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
├── README.md
├── LICENSE                      # MIT
├── references/                  # 按需加载，SKILL.md 只放索引
│   ├── layouts.md               # 版式注册表：每个版式的骨架、密度下限、适用场景、pptx-safe 标记
│   ├── themes.md                # 主题目录与选择建议（受众→主题映射表）
│   ├── authoring.md             # 写作规范：密度上限、CJK 字号表、中英混排规则
│   ├── pptx-export.md           # Office 档约束全文 + 导出排错表
│   ├── animations.md            # 语义动画配方（数字→count-up、柱→scaleY、线→dashoffset）
│   └── checklist.md             # P0–P3 分级质检清单（含真实失败案例，随开发积累）
├── assets/
│   ├── base.css                 # design tokens + 版式骨架样式（唯一允许定义 class 的地方）
│   ├── themes/                  # 每套 ≤100 行，只覆写 token
│   │   ├── ink.css              # 示例：墨色系
│   │   ├── klein.css            # 示例：高饱和强调色系
│   │   └── paper.css            # 示例：纸感暖色系
│   ├── runtime.js               # 导航（键盘/滚轮/触摸）+ O 键总览 + 深链 #/N + 低功耗模式
│   └── enhance.js               # Web 档增强层：动画配方 + canvas 背景（Office 档不加载）
├── templates/
│   ├── seed.html                # 种子模板：完整 head/引用/结构 + <!-- SLIDES_HERE -->
│   └── layouts/                 # 每个注册版式一个骨架片段（含占位数据和注释锚点）
│       ├── L01-cover.html
│       ├── L02-agenda.html
│       └── ...
├── scripts/                     # 全部基于 Playwright，跨平台（不硬编码浏览器路径）
│   ├── validate.mjs             # 校验器（规则见 §6）
│   ├── export-pptx.mjs          # 注册版式 → pptxgenjs 确定性映射
│   ├── export-pdf.mjs           # 矢量 PDF
│   └── render-png.mjs           # 逐页截图（深链 #/N 驱动）
└── examples/                    # 金样 deck（每套设计系统至少 1 个完整示例，兼作回归基准）
```

## 5. 版式注册表（v1 起步集，13 个）

| 编号 | 版式 | 叙事角色 | pptx-safe |
|---|---|---|---|
| L01 | 封面 | 开场钩子 | ✅ |
| L02 | 目录/议程 | 结构预告 | ✅ |
| L03 | 章节分隔 | 节奏切换 | ✅ |
| L04 | 观点陈述（大字） | 单点强调 | ✅ |
| L05 | 双栏对比 | 方案/前后对比 | ✅ |
| L06 | 三点论证 | 并列论据 | ✅ |
| L07 | KPI 数据大字 | 数据冲击（要求真实数据） | ✅ |
| L08 | 时间线 | 演进叙事 | ✅ |
| L09 | 图片主视觉 | 情绪/产品展示 | ✅ |
| L10 | 图文混排 | 常规内容页 | ✅ |
| L11 | 表格 | 结构化信息 | ✅ |
| L12 | 流程步骤 | 过程说明 | ⚠️ 简化映射 |
| L13 | 结尾/CTA | 收束 | ✅ |

每个版式在 `layouts.md` 中登记四要素：HTML 骨架、内容密度区间（防空防挤）、适用场景、PPTX 映射说明。扩展新版式必须同步三处：骨架文件 + 注册表 + 校验器白名单（归藏同款纪律）。

**每页密度纪律**（花叔）：1 个核心信息 + 3–4 个支撑点 + 1 个视觉主角，超出即拆页；相邻页不得重复同一版式。

## 6. 质量管线（三道门）

**第一道：机器校验 `validate.mjs`**（量化规则，exit 1 阻断交付）

| 规则 | 检查内容 |
|---|---|
| R1 | 每页 `data-layout` 必须在注册表内 |
| R2 | class 白名单：slide 内不得出现 base.css 未定义的 class |
| R3 | 溢出检测：任何元素不得超出 1280×720 画布 |
| R4 | 字号下限：正文 ≥24px、标题层级比例（标题:正文 ≥3:1） |
| R5 | 密度带：内容包围盒占画布 40%–85% |
| R6 | 禁止裸色值：slide 标记内不得出现 hex/rgb，只允许 `var(--*)` |
| R7 | Office 档追加：裸文本检测（文字必须在 p/h* 内）、禁渐变/复杂 SVG |
| R8 | 数据版式（L07/L11）必须含真实数值来源注释，禁止占位假数据 |

**第二道：P0–P3 视觉自检**（渲染截图后执行，不是只读代码）
P0 = 文字溢出/遮挡/对比度不足；P1 = 版式误用/密度失衡；P2 = 主题不一致/间距失谐；P3 = 打磨项。P0/P1 必须修复。

**第三道：导出验证**（Office 档）
PPTX 导出后重新截图与 HTML 逐页比对，字体回退导致的溢出逐页确认。

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
3. 复制 seed.html + 选定主题 → 建 deck 目录
4. 大纲 + 2 页语法样张（封面 + 最典型内容页）→ 用户确认后才批量生产
5. 逐页填充：选注册版式 → 复制骨架 → 只替换内容 → 密度自查
6. node scripts/validate.mjs → 修复循环直至通过
7. 渲染截图 → P0–P3 视觉自检
8. 交付 HTML；按档位追加 PPTX / PDF / PNG
```

## 8. 里程碑

- **M1 · 最小闭环**：seed.html + base.css + 3 套 token 主题 + L01–L13 骨架 + runtime.js（导航/总览/深链）+ validate.mjs（R1–R6）+ 1 个金样 deck。此时已是可用的 Web 档 Skill。
- **M2 · 差异化卖点**：export-pptx.mjs（13 个版式的确定性映射）+ R7/R8 规则 + pptx-export.md + Office 档金样。
- **M3 · 完整交付链**：export-pdf.mjs、render-png.mjs、enhance.js 动画配方、低功耗降级。
- **M4 · 体验补强**：第二套设计系统、演讲者模式（BroadcastChannel 双窗同步 + 讲稿抽屉 + 计时器，对标 html-ppt-skill）、CJK 字号查表完善。

## 9. 风险与对策

| 风险 | 对策 |
|---|---|
| PPTX 映射的字体回退错位（花叔已知痛点） | 主题字体栈只选 PowerPoint 常见字体的 webfont 版本；导出后逐页比对是硬性流程 |
| 版式扩展导致三处不同步 | checklist 中设 P0 项；金样 deck 兼作回归基准，改动后必须重跑 validate + 截图比对 |
| SKILL.md 膨胀失控 | 硬上限 400 行，超出即拆入 references/ |
| AGPL 污染 | 只读归藏系项目学思路，任何骨架/CSS/校验规则均独立实现；可复用代码仅取自 MIT 的 html-ppt-skill 与 huashu-design |
