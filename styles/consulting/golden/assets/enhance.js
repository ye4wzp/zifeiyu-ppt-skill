/* Semantic animation layer — presentation mode only.
   Skeletons declare intent with data-anim; this file knows no style or
   layout class names. Flat mode (?flat=1, used by validate/render-png/
   export-pptx) and reduced-motion users get static slides; exports are
   never affected. Every recipe settles back to the stylesheet values. */
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

  // delay = first start (ms), step = stagger between same-recipe peers
  const RECIPES = {
    rise:     { from: { opacity: '0', transform: 'translateY(24px)' }, delay: 0, step: 80, dur: 500 },
    draw:     { from: { transform: 'scaleX(0)', transformOrigin: 'left center' }, delay: 150, step: 0, dur: 600 },
    'grow-x': { from: { transform: 'scaleX(0)', transformOrigin: 'left center' }, delay: 150, step: 90, dur: 600 },
    'grow-y': { from: { transform: 'scaleY(0)', transformOrigin: 'center top' }, delay: 100, step: 0, dur: 600 },
    count:    { from: { opacity: '0' }, delay: 200, step: 120, dur: 400, after: countUp },
    pop:      { from: { transform: 'scale(0)' }, delay: 300, step: 90, dur: 350 },
    ring:     { from: { transform: 'scale(0)' }, delay: 300, step: 140, dur: 350 },
    fade:     { from: { opacity: '0' }, delay: 200, step: 60, dur: 400 },
    scale:    { from: { transform: 'scale(0)' }, delay: 150, step: 180, dur: 500 },
  };

  const animate = (slide) => {
    if (slide.dataset.animated) return;
    slide.dataset.animated = '1';
    const seen = {};
    slide.querySelectorAll('[data-anim]').forEach((el) => {
      const r = RECIPES[el.dataset.anim];
      if (!r) return;
      const i = (seen[el.dataset.anim] = (seen[el.dataset.anim] ?? -1) + 1);
      const at = r.delay + i * r.step;
      prep(el, r.from);
      play(el, Object.fromEntries(Object.keys(r.from).map((k) => [k, ''])), at, r.dur);
      if (r.after) setTimeout(() => r.after(el), at);
    });
    slide.querySelectorAll('img, video').forEach((m) => {
      prep(m, { opacity: '0', transform: 'scale(1.04)' });
      play(m, { opacity: '', transform: '' }, 0, 900);
    });
  };

  /* media semantics: videos marked data-autoplay start on slide entry
     (add the muted attribute to satisfy autoplay policy); everything
     pauses and rewinds on exit; clicking a video or a data-media="toggle"
     control toggles playback; data-media="progress" grows along the
     slide's data-media="track" and data-media="clock" shows the time */
  const toggle = (m) => (m.paused ? m.play().catch(() => {}) : m.pause());
  const playMedia = (slide) =>
    slide.querySelectorAll('video[data-autoplay]').forEach((v) => v.play().catch(() => {}));
  const stopMedia = (slide) =>
    slide.querySelectorAll('video, audio').forEach((m) => { m.pause(); m.currentTime = 0; });
  addEventListener('click', (e) => {
    const v = e.target.closest('video');
    if (v) return toggle(v);
    const ctl = e.target.closest('[data-media="toggle"]');
    const m = ctl?.closest('.slide')?.querySelector('audio, video');
    if (m) toggle(m);
  });
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  document.querySelectorAll('.slide').forEach((slide) => {
    const m = slide.querySelector('audio, video');
    const bar = slide.querySelector('[data-media="progress"]');
    const track = slide.querySelector('[data-media="track"]');
    const clock = slide.querySelector('[data-media="clock"]');
    if (!m || (!bar && !clock)) return;
    m.addEventListener('timeupdate', () => {
      if (!m.duration) return;
      if (bar && track) bar.style.width = `${(m.currentTime / m.duration) * track.offsetWidth}px`;
      if (clock) clock.textContent = `${fmt(m.currentTime)} / ${fmt(m.duration)}`;
    });
  });

  const slides = document.querySelectorAll('.slide');
  const watch = new MutationObserver((muts) => {
    for (const mu of muts) {
      if (mu.target.classList.contains('is-active')) { animate(mu.target); playMedia(mu.target); }
      else stopMedia(mu.target);
    }
  });
  slides.forEach((s) => watch.observe(s, { attributes: true, attributeFilter: ['class'] }));
  document.querySelector('.slide.is-active') && animate(document.querySelector('.slide.is-active'));
})();
