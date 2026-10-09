# 主题与设计系统目录（legacy）

> 风格库上线后，新 deck 优先从风格画廊 `docs/styles/index.html` 选风格（`new-deck --style <id>`，场合推荐见 SKILL.md 第 1 步）。本页描述的是风格交付前的 legacy 主题，文件在 `assets/legacy/`。

切换 = 换 `<link id="theme">` 指向的一个文件。一个 deck 一套，不混搭。

## 两级体系

- **主题**（`themes/*.css`）：只覆写颜色 token，设计语言不变。
- **设计系统**（`systems/*.css`）：已全部退役（editorial → 风格库 A 杂志，swiss → 风格库 B 瑞士）；旧 deck 自带的副本仍能通过校验。

display/数字/mono 槽位使用 deck 内子集 webfont（思源黑 VF、思源宋、JetBrains Mono），mac/Windows/Linux 渲染一致；正文槽位保持系统字体（保证 HTML↔PPTX 段落换行一致）。子集缺失时按 token 中的系统字体栈优雅回退。

## 设计系统 03 ·「瑞士国际」swiss

已退役，由风格库 B 瑞士（`styles/swiss/`）取代。

## 设计系统 02 ·「墨韵」editorial

已退役，由风格库 A 杂志（`styles/magazine/`）取代。

| 主题 | 气质 | 适用受众/场合 | 备注 |
|---|---|---|---|
| paper（默认） | 暖纸白 + 蓝强调 | 汇报、评审、通用商务 | 打印友好 |
| graphite | 深色舞台 + 柔蓝 | 发布会、技术分享、大屏演讲 | 暗环境投影最佳 |
| forest | 冷纸绿 + 深绿强调 | 品牌调性偏自然/健康/ESG 的内容 | |

推荐话术：按 Q2 受众答案给出 2–3 个候选并附一句理由，让用户选；不要让用户凭空描述风格。

## Token 契约

主题文件只允许覆写：`--bg` `--surface` `--text-1` `--text-2` `--accent` `--on-accent` `--hairline`。
不得覆写字体 token、不得新增选择器。新主题必须先用金样 deck（`examples/showcase/`）全量渲染检查对比度：正文对背景对比度 ≥ 4.5:1，`--text-2` 对背景 ≥ 3:1。

## 自定义品牌色

- **用户给企业 PPT 模板时（首选）**：`node scripts/import-theme.mjs <template.pptx> <name>` 自动从模板 theme1.xml 提取配色生成 token 主题文件并输出对比度报告；版式与排印保持锁定。风格库 deck 加 `--deck <deck-dir>`，产出 `assets/brand.css`（链接在风格样式表之后，只改 token）。
- 用户只给 hex 值时：以 paper 为底复制新主题文件、替换 `--accent`，跑对比度检查。
- 禁止凭记忆猜测品牌色。
