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
});
