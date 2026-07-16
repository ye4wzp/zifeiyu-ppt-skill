/* Semantic animation layer — presentation mode only.
   Flat mode (?flat=1, used by validate/render-png/export-pptx) and
   reduced-motion users get static slides; exports are never affected. */
(() => {
  if (new URLSearchParams(location.search).has('flat')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const EASE = 'cubic-bezier(0.2, 0, 0.3, 1)';

  const prep = (el, from) => {
    el.style.transition = 'none';
    Object.assign(el.style, from);
  };
  const play = (el, to, delay = 0, dur = 500) => {
    el.getBoundingClientRect();
    el.style.transition = `transform ${dur}ms ${EASE} ${delay}ms, opacity ${dur}ms ${EASE} ${delay}ms`;
    Object.assign(el.style, to);
  };

  // "658+" / "5.0%" / "×0.75" — animate the numeric run, keep affixes
  const countUp = (el) => {
    const m = el.textContent.trim().match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[2].replace(/,/g, ''));
    if (!isFinite(target)) return;
    const dec = (m[2].split('.')[1] || '').length;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 700, 1);
      el.textContent = m[1] + (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + m[3];
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const animate = (slide) => {
    if (slide.dataset.animated) return;
    slide.dataset.animated = '1';

    const title = slide.querySelector('.sl-title, .l01-title, .l03-title, .l04-text, .l13-title');
    if (title) {
      prep(title, { opacity: '0', transform: 'translateY(24px)' });
      play(title, { opacity: '1', transform: 'none' });
    }
    slide.querySelectorAll('.sl-rule, .l01-rule, .l03-rule, .l13-rule, .l08-axis, .l12-link').forEach((r) => {
      prep(r, { transform: 'scaleX(0)', transformOrigin: 'left center' });
      play(r, { transform: 'scaleX(1)' }, 150, 600);
    });
    const ghost = slide.querySelector('.sl-ghost');
    if (ghost) {
      prep(ghost, { opacity: '0', transform: 'translateX(48px)' });
      play(ghost, { opacity: '', transform: 'none' }, 250, 900); // '' -> back to stylesheet 0.07
    }
    slide.querySelectorAll('.l07-num').forEach((n, i) => {
      prep(n, { opacity: '0' });
      play(n, { opacity: '1' }, 200 + i * 120, 400);
      setTimeout(() => countUp(n), 200 + i * 120);
    });
    slide.querySelectorAll('.l08-dot, .l12-dot').forEach((d, i) => {
      prep(d, { transform: 'scale(0)' });
      play(d, { transform: 'scale(1)' }, 300 + i * 90, 350);
    });
    slide.querySelectorAll('img').forEach((img) => {
      prep(img, { opacity: '0', transform: 'scale(1.04)' });
      play(img, { opacity: '1', transform: 'scale(1)' }, 0, 900);
    });
  };

  const slides = document.querySelectorAll('.slide');
  const watch = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.target.classList.contains('is-active')) animate(m.target);
    }
  });
  slides.forEach((s) => watch.observe(s, { attributes: true, attributeFilter: ['class'] }));
  document.querySelector('.slide.is-active') && animate(document.querySelector('.slide.is-active'));
})();
