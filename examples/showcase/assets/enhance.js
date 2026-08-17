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
    slide.querySelectorAll('.l15-bar').forEach((b, i) => {
      prep(b, { transform: 'scaleX(0)', transformOrigin: 'left center' });
      play(b, { transform: 'scaleX(1)' }, 150 + i * 90, 600);
    });
    slide.querySelectorAll('.l20-node').forEach((n, i) => { // N -> E -> S -> W
      prep(n, { transform: 'scale(0)' });
      play(n, { transform: 'scale(1)' }, 300 + i * 140, 350);
    });
    slide.querySelectorAll('.l21-num, .l21-label').forEach((c, i) => {
      prep(c, { opacity: '0' });
      play(c, { opacity: '1' }, 200 + Math.floor(i / 2) * 60, 400);
    });
    const axis = slide.querySelector('.l23-axis');
    if (axis) {
      prep(axis, { transform: 'scaleY(0)', transformOrigin: 'center top' });
      play(axis, { transform: 'scaleY(1)' }, 100, 600);
    }
    slide.querySelectorAll('.l23-dot').forEach((d, i) => {
      prep(d, { transform: 'scale(0)' });
      play(d, { transform: 'scale(1)' }, 500 + i * 110, 320);
    });
    slide.querySelectorAll('.l24-l1, .l24-l2, .l24-l3').forEach((c, i) => {
      prep(c, { transform: 'scale(0)' });
      play(c, { transform: 'scale(1)' }, 150 + i * 180, 500);
    });
    slide.querySelectorAll('.l24-s1, .l24-s2, .l24-s3, .l24-h, .l24-p').forEach((l, i) => {
      prep(l, { opacity: '0' });
      play(l, { opacity: '1' }, 400 + i * 70, 400);
    });
    slide.querySelectorAll('img, video').forEach((img) => {
      prep(img, { opacity: '0', transform: 'scale(1.04)' });
      play(img, { opacity: '1', transform: 'scale(1)' }, 0, 900);
    });
  };

  /* media semantics: videos marked data-autoplay start on slide entry
     (add the muted attribute to satisfy autoplay policy); everything
     pauses and rewinds on exit; clicking a video or the L19 play dot
     toggles playback; the L19 progress line and clock follow the audio */
  const toggle = (m) => (m.paused ? m.play().catch(() => {}) : m.pause());
  const playMedia = (slide) =>
    slide.querySelectorAll('video[data-autoplay]').forEach((v) => v.play().catch(() => {}));
  const stopMedia = (slide) =>
    slide.querySelectorAll('video, audio').forEach((m) => { m.pause(); m.currentTime = 0; });
  addEventListener('click', (e) => {
    const v = e.target.closest('video');
    if (v) return toggle(v);
    const dot = e.target.closest('.l19-play, .l19-glyph');
    const a = dot?.closest('.slide')?.querySelector('audio');
    if (a) toggle(a);
  });
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  document.querySelectorAll('.slide').forEach((slide) => {
    const a = slide.querySelector('audio');
    const bar = slide.querySelector('.l19-progress');
    if (!a || !bar) return;
    const time = slide.querySelector('.l19-time');
    a.addEventListener('timeupdate', () => {
      if (!a.duration) return;
      bar.style.width = `${(a.currentTime / a.duration) * 680}px`;
      if (time) time.textContent = `${fmt(a.currentTime)} / ${fmt(a.duration)}`;
    });
  });

  const slides = document.querySelectorAll('.slide');
  const watch = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.target.classList.contains('is-active')) { animate(m.target); playMedia(m.target); }
      else stopMedia(m.target);
    }
  });
  slides.forEach((s) => watch.observe(s, { attributes: true, attributeFilter: ['class'] }));
  document.querySelector('.slide.is-active') && animate(document.querySelector('.slide.is-active'));
})();
