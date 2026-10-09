---
name: zifeiyu-ppt-skill
description: 生成锁定设计系统的网页 PPT（1280×720 HTML），从风格库中选一种风格、按该风格的注册版式填充内容，并可确定性导出可编辑 PPTX。当用户需要制作演示文稿、PPT、slides、发布会/汇报/分享用的幻灯片，或需要把网页演示转成 .pptx 文件时使用。
---

# PPT Skill

风格库：每种风格一套独立版式。先选风格，再把内容装进这个风格的注册版式，产出单目录网页 PPT；HTML 是唯一的源，PPTX / PDF / PNG 是一键衍生物。

## 风格库现状（过渡期，先读）

- 已交付的风格以风格画廊为准：`docs/styles/index.html`（`node scripts/style-gallery.mjs` 重新生成，`docs/styles/gallery.png` 可直接发给用户看）。当前：**A 杂志 · 暖纸**（`magazine`，ready，18 个版式）· **B 瑞士 · 网格**（`swiss`，ready，17 个版式）。
- 其余风格按 `docs/superpowers/specs/2026-10-08-style-library-design.md` 分期交付。用户选中的风格尚未交付时，走 **legacy 主题**：`--theme paper|graphite|forest|editorial|swiss` + `references/layouts.md` 的 L01–L24（见文末「Legacy 主题」）。
- 校验器与导出器按 deck 链接的样式表自动区分 style 模式与 legacy 模式，规则各自生效。

## 硬约束（违反任何一条即返工）

1. **禁止从零写 HTML**。deck 只能由 `scripts/new-deck.mjs` 生成；幻灯片只能复制当前风格 `styles/<id>/layouts.md` 中的注册骨架并替换文字内容（legacy：`references/layouts.md`）。
2. **禁止发明类名**。只能使用 base.css 与当前风格 style.css 已定义的 class；校验器会拒绝白名单外的类名。
3. **禁止裸色值与字体声明**。颜色只经 token；行内 style 只允许 `top/left/width/height/font-size/line-height` 的参数化数值，style 模式另允许 `rotate`。
4. **每页声明 `data-layout` 与 `data-role`**，取值来自当前风格的 `manifest.json`；骨架上的 `data-merge / data-anim / data-source / data-value` 等声明原样保留（说明见 `references/roles.md`）。legacy：`data-layout="Lxx"`。
5. **文字只能在 `h1/h2/h3/p` 内**；段内强调仅允许非嵌套的 `<strong>`/`<em>`/`<span class="is-accent">`/`<span class="is-mark">`（导出为 PPTX 原生分段样式）；装饰元素挂 `div[data-shape]`；图片用 `<img>`，禁止 background-image 承载内容图。
6. **数据诚实**：kpi / bars / table 角色（legacy：L07 / L11 / L15 / L22）必须使用用户提供的真实数值并标 `data-source` 出处，禁止编造；无真实数据就改用概念版式。
7. **每页密度纪律**：1 个核心信息 + 不超过 4 个支撑点；超出即拆页；相邻页不重复同一版式。
8. **一个 deck 一种风格**，不逐页混搭。
9. **媒体本地化 + 封面帧锁定**：视频/音频文件放 `assets/media/`（禁远程 URL）；视频必带 `poster` 与 `aria-label`，音频必带 `controls` 与 `aria-label`——渲染、PDF、PPTX 的静止画面全部锁定在 poster（校验器 R13 拦截）。

## 工作流

### 第 1 步 · 澄清定档（一次性提问，不超过 5 问）
- **Q1 交付格式**（必问，定档位，之后不可切换）：只需网页演示 → Web 档；需要可编辑 .pptx → Office 档。每种风格都支持 Office 档。
- **Q2 受众与场合 → 选风格**：给用户看风格画廊（`docs/styles/gallery.png`），按下表推荐 2–3 种并各附一句理由；用户不挑时默认 A 杂志（`--style magazine`）。

  | 场合 | 推荐 |
  |---|---|
  | 分享、宣传、人文 | A 杂志 / G 摄影集 / J 拼贴 |
  | 数据、发布、技术 | B 瑞士 / C 发布会 |
  | 汇报、提案 | H 咨询 / D 报刊 |
  | 产品介绍、合作 | F 柔和 |
  | 招募、活动 | E 大字报 |
  | 文化、文旅、政务 | I 日式 / K 新中式 |
  | 工程、技术评审 | L 工程制图 |

- Q3 页数或时长。
- Q4 已有素材（大纲 / 文档 / 数据 / 图片 / logo）。用户给了多少张图，就要在 deck 里用上多少张，不能只挑一两张。
- Q5 硬性约束。品牌色仅在用户有明确品牌规范时接受（`import-theme.mjs --deck` 生成 `assets/brand.css`），否则使用风格自带配色。

### 第 2 步 · 资产与事实核查（涉及真实机构/产品/数据时必做）
- **事实先行**：一切对外陈述的数字、日期、名称必须有来源——用户提供的一手资料或联网核实的官方发布；逐条可溯源，数据页用 `data-source` 标注出处。查不到的硬数据改用概念版式，禁止编造。
- **照片选择**：候选照片 >10 张时先拼 contact-sheet（一张网格预览图）再挑选，不逐张读图。
- **图上文字避让**：带图版式选图后先读图确认主体位置（logo、人脸、产品），标题与遮罩必须落在画面安静区；主体被裁掉就换图，不硬凑。

### 第 3 步 · 建 deck
```bash
node scripts/new-deck.mjs <deck-dir> --style <id>                  # 风格库
node scripts/new-deck.mjs <deck-dir> --theme paper|graphite|forest|swiss   # legacy
node scripts/new-deck.mjs <deck-dir> --refresh                     # 已有 deck 换上最新运行时与风格包
```
脚手架复制种子、共用运行时（base.css / runtime.js / enhance.js）与风格包（style.css、manifest.json 及其资产目录）；只需替换 `<title>`。deck 自包含，可整目录分发。

### 第 4 步 · 样张门（deck ≥ 5 页时必做）
先只做两页：封面 + 内容最典型的一页。渲染截图给用户确认后，才进入批量生产。方向错误在 2 页时修正，不在 13 页时返工。

### 第 5 步 · 批量填充
批量填充前先列一张**明暗节奏表**：每 3–5 页安排一次节奏断点（反色页 / 色场页 / 全幅图），把断点位置连同版式一起定死——校验器 R15 是这条纪律的机器兜底（相邻页同版式、连续 ≥7 页同明暗状态即预警）。
先按 `references/narratives.md` 选叙事模板（路演/汇报/宣传）定页序，再逐页：按 `references/roles.md` 把内容形状对到角色 → 在 `styles/<id>/layouts.md` 里挑该角色的版式 → 复制骨架 → 只替换文字/图片 → 自查密度。图片放 `<deck-dir>/assets/img/`，命名 `{页码}-{语义}.{ext}`。

### 第 6 步 · 字体子集 + 机器校验（第一道门）
```bash
node scripts/subset-fonts.mjs <deck-dir>      # 文字定稿后生成 deck 内字体子集（按风格 manifest）；之后每次改文字都重跑
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
node scripts/export-pdf.mjs <deck-dir>                 # 矢量 PDF（两档皆可）
node scripts/export-pptx.mjs <deck-dir>                # Office 档；字体按风格 manifest 映射（legacy 用 --cjk-font "Microsoft YaHei"）
node scripts/check-pptx.mjs <deck-dir>/deck.pptx       # 产物结构校验（OOXML 完整性，必跑）
```
讲稿自动导出为 PowerPoint 原生备注（讲稿行以「转场/停顿/重音」开头会在演讲台高亮）；条形图页加 `--native-charts` 可生成可编辑原生图表；`--embed-fonts` 为实验性字体嵌入（详见 pptx-export.md）。
导出后必须做第三道门：check-pptx 过结构 + 用演示软件打开 .pptx 与 HTML 渲染图逐页比对（详见 `references/pptx-export.md`）。
交付后微调：浏览器打开 `index.html?edit=1` 可就地改文字（版式锁定）并下载新 HTML——替换后必须重跑 subset-fonts 与 validate。

## Legacy 主题（过渡期）

风格尚未交付时使用。两套设计系统共用 L01–L24 二十四个版式（骨架见 `references/layouts.md`），换 `<link id="theme">` 一个文件整套切换：
- **现代无衬线**：token 主题 `paper`（暖纸白）· `graphite`（深色）· `forest`（冷纸绿），配 DATUM 制图铺装
- **「瑞士国际」GRID**：`swiss`（风格库版本见 `styles/swiss/`）
- `editorial`（墨韵）已由 A 杂志取代退役。

legacy 内容形状 → 版式：数据指标 2–3 个 L07 · 行级对比数据 L15 · 台账 L11 · 规格 L22 · 盘点 + 总数 L21 · 恰好 3 项 L06 · 恰好 4 项 L12 / L16 · 二元对比 L05 · 线性演进 L08 / L23 · 闭环 L20 · 层级嵌套 L24 · 单点强调 L04 · 证据图 L09 / L14 / L16 · 视频 / 音频 L17 / L18 / L19。受众映射见 `references/themes.md`。

## 参考文档（按需读取，勿全量加载）

- `docs/styles/index.html` — 风格画廊（选风格时给用户看）
- `styles/<id>/layouts.md` — 当前风格的版式注册表与可复制骨架
- `references/roles.md` — 角色表、内容形状 → 角色、骨架声明属性与 R16
- `references/narratives.md` — 路演/汇报/宣传三套叙事页序模板
- `references/authoring.md` — 文案密度、中文字号规则
- `references/pptx-export.md` — Office 档约束、字体策略、导出原语、导出排错
- `references/checklist.md` — P0–P3 视觉自检清单
- `references/animations.md` — 演示模式语义动画配方（自动生效，导出不受影响）
- `references/failures.md` — 实战失败案例库（现象→根因→修法→已固化到），排错时先查这里
- `references/layouts.md` / `references/themes.md` — legacy 主题的版式与主题目录
