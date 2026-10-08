import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { makeDeck } from './helpers.mjs';

const run = (deck) => spawnSync('node', ['scripts/validate.mjs', deck], { encoding: 'utf8' });

test('clean style deck passes', () => {
  const r = run(makeDeck(`
<section class="slide" data-layout="fixture/kpi" data-role="kpi">
  <p class="fx-num">658+</p>
  <p class="fx-src" data-source>来源：测试夹具</p>
</section>
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-card" data-shape="rect"></div>
  <h3 class="fx-h">标题</h3>
  <div class="fx-tilt" data-shape="rect" style="rotate: -3deg;"></div>
</section>`));
  assert.equal(r.status, 0, r.stdout);
});

test('style-mode violations are caught', () => {
  const r = run(makeDeck(`
<section class="slide" data-layout="L07" data-role="kpi"><p class="fx-num">658+</p></section>
<section class="slide" data-layout="fixture/card" data-role="cover"><p class="zz-nope">x</p></section>
<section class="slide" data-layout="fixture/bars" data-role="bars">
  <p class="fx-src" data-source>来源</p>
  <div class="fx-bar" data-shape="rect" data-value="10" data-label="a" style="top: 200px; width: 400px;"></div>
  <div class="fx-bar" data-shape="rect" data-value="5" data-label="b" style="top: 260px; width: 400px;"></div>
</section>
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-chev" data-shape="chevron" style="height: 100px;"></div>
  <p class="fx-h" style="transform: scale(2);">x</p>
</section>`, { extraHead: '\n<link rel="stylesheet" href="assets/extra.css">' }));
  assert.equal(r.status, 1);
  for (const needle of [
    'R1 slide 1: data-layout "L07"',
    'R1 slide 2: role "cover" does not match',
    'R8 slide 1: kpi page requires a data-source',
    'R2 slide 2 <p> "x": class "zz-nope"',
    'R8 slide 3: bar "b"',
    'R16 slide 4 <shape> "": chevron tip',
    'R6 slide 4',
    'R12 stylesheet "assets/extra.css"',
  ]) assert.ok(r.stdout.includes(needle), `missing: ${needle}\n${r.stdout}`);
});
