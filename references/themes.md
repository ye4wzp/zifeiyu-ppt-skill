# 主题与设计系统目录

切换 = 换 `<link id="theme">` 指向的一个文件。一个 deck 一套，不混搭。

## 两级体系

- **主题**（`themes/*.css`）：只覆写颜色 token，设计语言不变。
- **设计系统**（`systems/*.css`）：覆写颜色 + 字体 token 及排印细节（字重/字距），整套设计语言切换；禁止触碰几何。19 个版式对所有系统通用。

display/数字/mono 槽位使用 deck 内子集 webfont（思源黑 VF、思源宋、JetBrains Mono），mac/Windows/Linux 渲染一致；正文槽位保持系统字体（保证 HTML↔PPTX 段落换行一致）。子集缺失时按 token 中的系统字体栈优雅回退。

## 设计系统 02 ·「墨韵」editorial

`systems/editorial.css` — 思源宋体标题 × 暖纸底 × 朱砂强调 × 衬线 lining 数字（随 deck 字体子集分发，Windows 不再回退中易宋体）。适用：文化内容、品牌故事、人文调性的分享与发布。PPTX 导出时衬线标题自动映射 SimSun（`--cjk-serif` 可改），Windows 开箱可用。

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

仅当用户提供明确品牌规范（hex 值或官方资产）时，以 paper 为底复制一份新主题文件、替换 `--accent`，并跑对比度检查。禁止凭记忆猜测品牌色。
