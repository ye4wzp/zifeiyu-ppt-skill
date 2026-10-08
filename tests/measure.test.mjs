import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { measureDeck } from '../scripts/lib/deck.mjs';
import { makeDeck } from './helpers.mjs';

const deck = makeDeck(`
<section class="slide" data-layout="fixture/card" data-role="points">
  <div class="fx-card" data-shape="rect"></div>
  <h3 class="fx-h" data-merge="a" data-anim="rise">标题</h3>
  <p class="fx-p" data-merge="a">说明文字</p>
  <div class="fx-chev" data-shape="chevron"></div>
  <div class="fx-tilt" data-shape="rect"></div>
  <img class="fx-photo" src="assets/img/a.png" alt="示意图">
  <div class="fx-grad" data-shape="rect" data-raster></div>
  <p class="fx-vert">竖排 AI 文字</p>
</section>`);

test('measures new primitives', async () => {
  const { browser, slides } = await measureDeck(resolve(deck, 'index.html'));
  await browser.close();
  const s = slides[0];
  assert.equal(s.role, 'points');
  const [card, h, p, chev, tilt, photo, grad, vert] = s.els;
  assert.equal(card.radius, 24);
  assert.equal(card.border.width, 2);
  assert.equal(card.border.color.hex, 'ff6b2c');
  assert.equal(card.border.uniform, true);
  assert.equal(card.shadow.y, 12);
  assert.equal(card.shadow.blur, 32);
  assert.equal(card.shadow.layers, 1);
  assert.ok(Math.abs(card.shadow.color.alpha - 0.12) < 0.01);
  assert.equal(h.merge, 'a'); assert.equal(p.merge, 'a'); assert.equal(h.anim, 'rise');
  assert.equal(chev.shape, 'chevron'); assert.equal(chev.tip, 36);
  assert.equal(tilt.rotate, -6);
  assert.equal(Math.round(tilt.w), 240); assert.equal(Math.round(tilt.x), 840); // unrotated box
  assert.ok(tilt.bbox.w > 240);                                                // rotated hull
  assert.equal(photo.radius, 12); assert.equal(photo.filter, true);
  assert.equal(grad.raster, true);
  assert.equal(vert.vertical, true);
  assert.equal(vert.textBox.bg, false);
  assert.match(card.mid, /^0-\d+$/);
});
