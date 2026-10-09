import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import JSZip from 'jszip';
import { makeDeck } from './helpers.mjs';

const deck = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-card" data-shape="rect"></div>
  <h3 class="fx-h" data-merge="a">标题</h3>
  <p class="fx-p" data-merge="a">说明文字</p>
  <div class="fx-chev" data-shape="chevron"></div>
  <div class="fx-tilt" data-shape="rect"></div>
  <img class="fx-photo" src="assets/img/a.png" alt="示意图">
  <div class="fx-grad" data-shape="rect" data-raster></div>
  <p class="fx-vert">竖排 AI 文字</p>
</section>`);

test('exports native primitives', async () => {
  const out = resolve(deck, 'deck.pptx');
  execFileSync('node', ['scripts/export-pptx.mjs', deck, '--out', out]);
  const zip = await JSZip.loadAsync(readFileSync(out));
  const xml = await zip.file('ppt/slides/slide1.xml').async('string');
  assert.match(xml, /prst="roundRect"/);
  // CSS radius 24px on a 240px-tall card, stroke centre-line inset 1px:
  // adj = (24 - 1) / (240 - 2) * 100000 ≈ 9664
  const adj = +xml.match(/<a:gd name="adj" fmla="val (\d+)"\/>/)[1];
  assert.ok(adj > 9500 && adj < 9800, `adj ${adj}`);
  assert.match(xml, /<a:ln w="19050"><a:solidFill><a:srgbClr val="FF6B2C"/i); // 2px = 1.5pt
  assert.match(xml, /<a:outerShdw/);
  assert.match(xml, /prst="chevron"/);
  assert.match(xml, /rot="(-360000|21240000)"/); // -6deg
  assert.match(xml, /vert="eaVert"/);
  assert.equal((xml.match(/标题/g) || []).length, 1);
  assert.match(xml, /标题<\/a:t>(?:(?!<\/p:sp>)[\s\S])*说明文字/); // one shape, two paragraphs
  assert.equal((xml.match(/<p:pic>/g) || []).length, 2); // baked photo + rastered gradient
  assert.doesNotMatch(xml, /typeface="PingFang SC"/); // mapped via manifest fonts.office
});

test('keeps element-level italic', async () => {
  const it = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="points">
  <p class="fx-p">One Person Company.</p>
</section>`, { extraHead: `<style>.fx-p { font-style: italic; }</style>` });
  const out = resolve(it, 'deck.pptx');
  execFileSync('node', ['scripts/export-pptx.mjs', it, '--out', out]);
  const xml = await (await JSZip.loadAsync(readFileSync(out))).file('ppt/slides/slide1.xml').async('string');
  assert.match(xml, /<a:rPr[^>]* i="1"[^>]*>(?:(?!<\/a:r>)[\s\S])*One Person Company\./);
});

test('warns when a family has no fonts.office mapping', () => {
  const mono = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="points">
  <p class="fx-p">等宽 mono</p>
</section>`, { extraHead: `<style>.fx-p { font-family: 'JetBrains Mono'; }</style>` });
  const log = execFileSync('node', ['scripts/export-pptx.mjs', mono, '--out', resolve(mono, 'deck.pptx')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  assert.match(log, /no fonts\.office mapping.*JetBrains Mono/);
});

test('native bar chart keeps per-bar and label colours', async () => {
  const d = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="bars">
  <div data-shape="rect" data-value="4" data-label="甲" style="position:absolute;left:424px;top:200px;width:300px;height:40px;background:#f5f5f7"></div>
  <p data-chart style="position:absolute;left:80px;top:200px;margin:0;font-size:20px;color:#f5f5f7">甲</p>
  <p data-chart style="position:absolute;left:740px;top:200px;margin:0;font-size:20px;color:#f5f5f7">4</p>
  <div data-shape="rect" data-value="3" data-label="乙" style="position:absolute;left:424px;top:280px;width:225px;height:40px;background:#ffc21a"></div>
  <p data-chart style="position:absolute;left:80px;top:280px;margin:0;font-size:20px;color:#f5f5f7">乙</p>
  <p data-chart style="position:absolute;left:665px;top:280px;margin:0;font-size:20px;color:#f5f5f7">3</p>
</section>`, { extraHead: `<style>.slide { background: #0a0a0b; }</style>` });
  const out = resolve(d, 'deck.pptx');
  execFileSync('node', ['scripts/export-pptx.mjs', d, '--out', out, '--native-charts']);
  const xml = await (await JSZip.loadAsync(readFileSync(out))).file('ppt/charts/chart1.xml').async('string');
  const dpts = xml.match(/<c:dPt>[\s\S]*?<\/c:dPt>/g) || [];
  assert.match(dpts.join(''), /<a:srgbClr val="F5F5F7"\/>/i);
  assert.match(dpts.join(''), /<a:srgbClr val="FFC21A"\/>/i);
  const cat = xml.match(/<c:catAx>[\s\S]*?<\/c:catAx>/)[0];
  const dl = xml.match(/<c:dLbls>[\s\S]*?<\/c:dLbls>/)[0];
  assert.match(cat, /<a:srgbClr val="F5F5F7"\/>/i);
  assert.match(dl, /<a:srgbClr val="F5F5F7"\/>/i);
});
