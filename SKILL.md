---
name: zifeiyu-ppt-skill
description: 生成锁定设计系统的网页 PPT（1280×720 HTML），并可确定性导出可编辑 PPTX。当用户需要制作演示文稿、PPT、slides、发布会/汇报/分享用的幻灯片，或需要把网页演示转成 .pptx 文件时使用。
---

# PPT Skill

把内容装进 19 个注册版式，产出单目录网页 PPT；HTML 是唯一的源，PPTX / PNG 是一键衍生物。

## 硬约束（违反任何一条即返工）

1. **禁止从零写 HTML**。deck 只能由 `templates/seed.html` 复制而来，幻灯片只能复制 `references/layouts.md` 中的注册骨架并替换文字内容。
2. **禁止发明类名**。只能使用 base.css 已定义的 class；校验器会拒绝白名单外的类名。
3. **禁止裸色值与字体声明**。颜色只经 token；行内 style 只允许 `top/left/width/height/font-size/line-height` 的参数化数值。
4. **每页必须声明 `data-layout="Lxx"`**（L01–L13）。
5. **文字只能在 `h1/h2/h3/p` 内**；段内强调仅允许非嵌套的 `<strong>`/`<em>`/`<span class="is-accent">`（导出为 PPTX 原生分段样式）；装饰元素挂 `div[data-shape="rect|ellipse"]`；图片用 `<img>`，禁止 background-image 承载内容图。
9. **媒体本地化 + 封面帧锁定**：视频/音频文件放 `assets/media/`（禁远程 URL）；视频必带 `poster` 与 `aria-label`，音频必带 `controls` 与 `aria-label`——渲染、PDF、PPTX 的静止画面全部锁定在 poster（校验器 R13 拦截）。
6. **数据诚实**：L07/L11 等数据版式必须使用用户提供的真实数值，禁止编造；无真实数据就改用概念版式。
7. **每页密度纪律**：1 个核心信息 + 不超过 4 个支撑点；超出即拆页；相邻页不重复同一版式。
8. **主题整套使用**，一个 deck 一个主题文件，不逐页混搭。

## 工作流

### 第 1 步 · 澄清定档（一次性提问，不超过 5 问）
- **Q1 交付格式**（必问，定档位，之后不可切换）：只需网页演示 → Web 档；需要可编辑 .pptx → Office 档。
- Q2 受众与场合 → 按 `references/themes.md` 的映射表推荐 2–3 个主题。
- Q3 页数或时长。
- Q4 已有素材（大纲 / 文档 / 数据 / 图片 / logo）。
- Q5 硬性约束。品牌色仅在用户有明确品牌规范时接受，否则使用预设主题。

### 第 2 步 · 资产与事实核查（涉及真实机构/产品/数据时必做）
- **事实先行**：一切对外陈述的数字、日期、名称必须有来源——用户提供的一手资料或联网核实的官方发布；逐条可溯源，KPI 页脚注标注出处。查不到的硬数据改用概念版式，禁止编造。
- **照片选择**：候选照片 >10 张时先拼 contact-sheet（一张网格预览图）再挑选，不逐张读图。
- **图上文字避让**：L09/L14/L01 带图版式选图后先读图确认主体位置（logo、人脸、产品），标题与遮罩必须落在画面安静区；主体被裁掉就换图，不硬凑。

### 第 3 步 · 建 deck
```bash
node scripts/new-deck.mjs <deck-dir> --theme paper|graphite|forest|editorial
```
脚手架复制 seed.html 与全部运行时资产（themes/、systems/、textures/、enhance.js）并指好 `<link id="theme">`；只需替换 `<title>`。deck 自包含，可整目录分发。

### 第 4 步 · 样张门（deck ≥ 5 页时必做）
先只做两页：封面（L01）+ 内容最典型的一页。渲染截图给用户确认后，才进入批量生产。方向错误在 2 页时修正，不在 13 页时返工。

### 第 5 步 · 批量填充
先按 `references/narratives.md` 选叙事模板（路演/汇报/宣传）定页序，再逐页：从 `references/layouts.md` 复制骨架 → 只替换文字/图片 → 自查密度。图片放 `<deck-dir>/assets/img/`，命名 `{页码}-{语义}.{ext}`。

### 第 6 步 · 字体子集 + 机器校验（第一道门）
```bash
node scripts/subset-fonts.mjs <deck-dir>      # 文字定稿后生成 deck 内字体子集；之后每次改文字都重跑
node scripts/validate.mjs <deck-dir>          # Web 档
node scripts/validate.mjs <deck-dir> --office # Office 档
```
错误必须清零。溢出的处理顺序：精简文案 → 参数化行内样式微调 → 换版式；禁止缩小字号到 16px 以下。

### 第 7 步 · 视觉自检（第二道门）
```bash
node scripts/render-png.mjs <deck-dir>
```
逐页查看渲染图，按 `references/checklist.md` 的 P0–P3 分级检查；P0/P1 必须修复。

### 第 8 步 · 交付
Web 档交付 deck 目录（浏览器打开 index.html，方向键翻页，F 全屏，**S 开演讲者控制台**——双窗同步、下页预览、计时器、讲稿提示）。讲稿写法：每页末尾可加 `<aside class="notes"><p>提示语</p></aside>`，仅演讲者可见，永不进入渲染与导出；写"提示信号"（每页 ≤3 短句），不写逐字稿。按需追加：
```bash
node scripts/export-pdf.mjs <deck-dir>                            # 矢量 PDF（两档皆可）
node scripts/export-pptx.mjs <deck-dir> --cjk-font "Microsoft YaHei"  # Office 档
node scripts/check-pptx.mjs <deck-dir>/deck.pptx                  # 产物结构校验（OOXML 完整性，必跑）
```
讲稿自动导出为 PowerPoint 原生备注（讲稿行以「转场/停顿/重音」开头会在演讲台高亮）；L15 条形图加 `--native-charts` 可生成可编辑原生图表；`--embed-fonts` 为实验性字体嵌入（详见 pptx-export.md）。
导出后必须做第三道门：check-pptx 过结构 + 用演示软件打开 .pptx 与 HTML 渲染图逐页比对（详见 `references/pptx-export.md`）。
交付后微调：浏览器打开 `index.html?edit=1` 可就地改文字（版式锁定）并下载新 HTML——替换后必须重跑 subset-fonts 与 validate。

## 版式速查表

| 编号 | 版式 | 用于 |
|---|---|---|
| L01 | 封面 | 开场：kicker + 大标题 + 副题 + 元信息 |
| L02 | 目录 | 3–5 条议程 |
| L03 | 章节分隔 | 大序号 + 章节名，切换节奏 |
| L04 | 观点陈述 | 一句话大字，单点强调 |
| L05 | 双栏对比 | 两方案 / 前后对比，两面板 |
| L06 | 三点论证 | 三个并列论据 |
| L07 | KPI 大字 | 2–3 个真实数据指标 |
| L08 | 时间线 | 4 节点横向演进 |
| L09 | 图片主视觉 | 全幅图 + 遮罩标题 |
| L10 | 正文加要点 | 左长文右三要点，常规内容页 |
| L11 | 台账行 | 4 行 label–value–note 结构化信息 |
| L12 | 流程步骤 | 4 步过程 |
| L13 | 结尾 | 收束语 + 元信息 |
| L14 | 图文半幅 | 左正文 + 右半幅照片（is-left/is-right 可镜像） |
| L15 | 条形对比图 | 4 行真实数据横向条形（条长与数值成正比，校验器核对） |
| L16 | 图片网格 | 2×2 四图并列 |
| L17 | 视频主视觉 | 全幅视频开场/氛围（poster 锁帧，自动静音播放） |
| L18 | 视频半幅 | 左讲解 + 右视频，点击播放（is-left/is-right 可镜像） |
| L19 | 音频页 | 播客/音乐/访谈片段，设计化播放卡片 |

## 主题与设计系统

两套设计系统共用全部 19 个版式，换 `<link id="theme">` 一个文件整套切换：
- **现代无衬线**（默认）：token 主题 `paper`（暖纸白）· `graphite`（深色）· `forest`（冷纸绿）
- **「墨韵」衬线杂志风**：`--theme editorial`，宋体 × 暖纸 × 朱砂，适合文化/品牌/人文调性

**DATUM 制图铺装是默认构成语法**（两套系统通用）：坐标纸纹理、四角角线、等宽页眉、标注线、图签栏，配方整块复制 `references/layouts.md` §DATUM；L09 全幅图页保持纯净不加铺装。选择依据见 `references/themes.md`。

## 参考文档（按需读取，勿全量加载）

- `references/layouts.md` — 19 个版式的完整可复制骨架 + DATUM 铺装 + 媒体约定 + 节奏装饰用法
- `references/narratives.md` — 路演/汇报/宣传三套叙事页序模板
- `references/themes.md` — 主题目录与受众映射
- `references/authoring.md` — 文案密度、中文字号规则
- `references/pptx-export.md` — Office 档约束、字体策略、导出排错
- `references/checklist.md` — P0–P3 视觉自检清单
- `references/animations.md` — 演示模式语义动画配方（自动生效，导出不受影响）
