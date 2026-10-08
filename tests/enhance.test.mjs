import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { makeDeck } from './helpers.mjs';

const deck = makeDeck(`
<section class="slide" data-layout="fixture/kpi" data-role="kpi">
  <p class="fx-num" data-anim="count">658+</p>
  <p class="fx-src" data-source data-anim="rise">来源</p>
  <div class="fx-bar" data-shape="rect" data-anim="grow-x" style="top: 300px; width: 400px;"></div>
</section>`);

test('data-anim plays, then settles to the static render', async () => {
  const b = await chromium.launch();
  try {
    const p = await b.newPage();
    await p.goto('file://' + resolve(deck, 'index.html'));
    await p.waitForTimeout(250);
    const early = await p.$eval('.fx-num', (e) => getComputedStyle(e).opacity);
    assert.ok(parseFloat(early) < 1, `count recipe should start hidden, got ${early}`);
    await p.waitForTimeout(2000);
    const state = await p.$$eval('[data-anim]', (els) => els.map((e) => ({
      t: getComputedStyle(e).transform, o: getComputedStyle(e).opacity, text: e.textContent,
    })));
    for (const s of state) {
      assert.ok(s.t === 'none' || s.t === 'matrix(1, 0, 0, 1, 0, 0)', s.t);
      assert.equal(s.o, '1');
    }
    assert.equal(state[0].text, '658+');
  } finally {
    await b.close();
  }
});
