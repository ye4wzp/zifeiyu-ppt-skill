# zifeiyu-ppt-skill

> Design-locked HTML slide decks with **deterministic export to editable PPTX** — an agent skill for Claude Code and other file-capable coding agents.
>
> [中文文档](README.md)

The one-line difference from similar projects: beautiful HTML decks usually can't become .pptx files, and generic HTML→PPTX translators are too fragile. This skill gets both through **registered layouts + deterministic mapping**: every slide must declare a layout ID from a closed set, so the exporter only ever faces known structures — coordinates convert at a fixed ratio, results are predictable and regression-testable.

![cover](docs/preview/cover.png)

## Features

- **16 registered layouts × 2 design systems × 3 token themes** — cover, agenda, section, statement, comparison, KPI, bar chart, timeline, image hero/grid, ledger, process, closing; swap the entire type language (modern sans ↔ serif editorial) by changing one CSS file
- **Four-format delivery chain** — HTML presentation → editable PPTX → vector PDF → per-slide PNG, each one command; HTML is the single source of truth
- **Machine quality gate** — a Playwright validator enforces R1–R10 quantified rules (layout registry, class whitelist, overflow, font floor, text collision, image alt…); errors block delivery
- **Poster-grade typography** — 100px cover titles, 220px section numerals, 136px thin-weight KPI figures, 280px translucent ghost type, per-slide dark inversion
- **Semantic animations** — count-up numbers, popping dots, drawing rules; bound to element semantics, presentation-only, exports never affected
- **Presenter console** — press `S` for a dual-window console (current + next preview, timer, speaker notes), synced via BroadcastChannel, works on `file://`
- **Data honesty protocol** — KPI/chart layouts require real, sourced values; no data, no numbers

| | |
|---|---|
| ![editorial cover](docs/preview/editorial-cover.png) | ![editorial dark](docs/preview/editorial-dark.png) |

## Install

```bash
npx skills add https://github.com/ye4wzp/zifeiyu-ppt-skill --skill zifeiyu-ppt-skill
# or
git clone https://github.com/ye4wzp/zifeiyu-ppt-skill ~/.claude/skills/zifeiyu-ppt-skill
cd ~/.claude/skills/zifeiyu-ppt-skill && npm install
```

Requires Node.js ≥ 18 and `npx playwright install chromium-headless-shell`. LibreOffice + poppler are optional (PPTX-side geometry verification).

## Usage

Ask Claude Code to "make a deck about X" — the skill drives an 8-step workflow: clarify & pick tier → verify facts → scaffold → 2-slide sample gate → batch production → machine validation → visual check → export.

```bash
node scripts/validate.mjs <deck-dir> [--office]
node scripts/render-png.mjs <deck-dir>
node scripts/export-pdf.mjs <deck-dir>
node scripts/export-pptx.mjs <deck-dir> --cjk-font "Microsoft YaHei"
```

Presentation keys: arrows to navigate · `F` fullscreen · `S` presenter console.

## Known limits

- PPTX cannot embed fonts (pptxgenjs limitation); declared faces must exist on the viewer's machine ("Microsoft YaHei" / "SimSun" defaults are Windows-safe)
- Not intended for large data tables or collaborative editing

## Credits

Methodology inspired by (independently implemented, no code reused):
[guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) ·
[huashu-design](https://github.com/alchaincyf/huashu-design) ·
[html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) ·
[guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill)

## License

[MIT](LICENSE)
