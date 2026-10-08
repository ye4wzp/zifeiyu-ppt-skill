// Screenshots ONE measured element in isolation: every other element on
// its slide is hidden and every ground behind it (slide, body, html) turned
// transparent, so overlaid text never gets baked into the picture (it is
// exported natively) and rounded corners come out as real alpha.
export async function snapshotEl(page, mid, file, { unrotate = false } = {}) {
  await page.evaluate(([m, un]) => {
    const el = document.querySelector(`[data-mid="${m}"]`);
    const slide = el.closest('.slide');
    for (const g of [slide, document.body, document.documentElement]) g.style.background = 'transparent';
    for (const o of slide.querySelectorAll('[data-mid]')) if (o !== el) o.style.visibility = 'hidden';
    if (un) el.style.rotate = '0deg';
  }, [mid, unrotate]);
  await page.locator(`[data-mid="${mid}"]`).screenshot({ path: file, omitBackground: true });
  await page.evaluate((m) => {
    const el = document.querySelector(`[data-mid="${m}"]`);
    const slide = el.closest('.slide');
    for (const g of [slide, document.body, document.documentElement]) g.style.background = '';
    for (const o of slide.querySelectorAll('[data-mid]')) o.style.visibility = '';
    el.style.rotate = '';
  }, mid);
}
