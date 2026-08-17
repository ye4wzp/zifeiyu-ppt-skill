/* Deck runtime.
   Modes: default = presentation; ?flat=1 = static stack for scripts;
   ?presenter=1 = presenter console (S key opens it); ?preview=N = passive
   preview iframe inside the console, follows broadcasts at slide offset N. */
(() => {
  const qs = new URLSearchParams(location.search);
  if (qs.has('flat')) return;

  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;
  const total = slides.length;
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('deck:' + location.pathname) : null;

  /* ---------- edit mode (?edit=1): content editable, geometry locked ---------- */
  if (qs.has('edit')) {
    document.body.classList.add('edit-ui');
    slides.forEach((s) => s.querySelectorAll('h1, h2, h3, p').forEach((t) => {
      if (!t.closest('.notes')) t.contentEditable = 'plaintext-only';
    }));
    const bar = document.createElement('div');
    bar.className = 'edit-bar';
    bar.innerHTML = '<p>编辑模式：文字可改，版式锁定</p><button>下载修改后的 HTML</button>';
    document.body.appendChild(bar);
    bar.querySelector('button').addEventListener('click', () => {
      const doc = document.documentElement.cloneNode(true);
      doc.querySelectorAll('[contenteditable]').forEach((t) => t.removeAttribute('contenteditable'));
      doc.querySelector('.edit-bar')?.remove();
      doc.querySelector('body').classList.remove('edit-ui');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['<!doctype html>\n' + doc.outerHTML], { type: 'text/html' }));
      a.download = 'index.html';
      a.click();
      alert('已下载。替换 deck 的 index.html 后必须重跑：subset-fonts → validate → 按档位导出');
    });
    return;
  }

  /* ---------- presenter console ---------- */
  if (qs.has('presenter')) {
    document.body.classList.add('presenter-ui');
    document.title = 'Presenter · ' + document.title;
    const el = (cls, parent, tag = 'div') => {
      const d = document.createElement(tag);
      if (cls) d.className = cls;
      parent.appendChild(d);
      return d;
    };
    const grid = el('pc-grid', document.body);
    const main = el('pc-box pc-main', grid);
    el('pc-label', main).textContent = 'CURRENT';
    el('', main, 'iframe').src = location.pathname + '?preview=0';
    const side = el('pc-side', grid);
    const next = el('pc-box pc-next', side);
    el('pc-label', next).textContent = 'NEXT';
    el('', next, 'iframe').src = location.pathname + '?preview=1';
    const panel = el('pc-panel', side);
    const timer = el('pc-timer', panel, 'p');
    const count = el('pc-count', panel, 'p');
    const notes = el('pc-notes', panel);

    let cur = 0;
    const update = () => {
      count.textContent = `${cur + 1} / ${total}`;
      const n = slides[cur].querySelector('.notes');
      notes.innerHTML = n ? n.innerHTML : '<p>（本页无讲稿提示）</p>';
      // stage cues (转场/停顿/重音) pop out from regular talk lines
      notes.querySelectorAll('p').forEach((p) => {
        if (/^(转场|停顿|重音|TRANSITION)/.test(p.textContent.trim())) p.classList.add('pc-cue');
      });
    };
    bc?.addEventListener('message', (e) => {
      if (e.data.cur != null) { cur = e.data.cur; update(); }
    });
    bc?.postMessage({ hello: 1 });
    const t0 = Date.now();
    timer.textContent = '00:00';
    setInterval(() => {
      const s = Math.floor((Date.now() - t0) / 1000);
      timer.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }, 1000);
    // optimistic local step so rapid keypresses don't drop advances
    const step = (d) => {
      cur = Math.min(Math.max(cur + d, 0), total - 1);
      update();
      bc?.postMessage({ go: cur });
    };
    addEventListener('keydown', (e) => {
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) step(1);
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) step(-1);
    });
    update();
    return;
  }

  /* ---------- presentation & passive preview ---------- */
  const offset = qs.has('preview') ? parseInt(qs.get('preview'), 10) || 0 : null;
  document.body.classList.add('present');

  const hud = document.createElement('div');
  hud.className = 'deck-hud';
  document.body.appendChild(hud);

  let cur = Math.min(Math.max(parseInt(location.hash.slice(2), 10) || 1, 1), total) - 1;

  const fit = () => {
    const s = Math.min(innerWidth / 1280, innerHeight / 720);
    slides[cur].style.transform = `translate(${-640 * s}px, ${-360 * s}px) scale(${s})`;
  };
  const show = (i, silent) => {
    cur = Math.min(Math.max(i, 0), total - 1);
    slides.forEach((el, k) => el.classList.toggle('is-active', k === cur));
    fit();
    history.replaceState(null, '', `#/${cur + 1}`);
    hud.textContent = `${cur + 1} / ${total}`;
    if (!silent) bc?.postMessage({ cur, total });
  };
  addEventListener('resize', fit);

  if (offset != null) {
    bc?.addEventListener('message', (e) => {
      if (e.data.cur != null) show(e.data.cur + offset, true);
    });
    show(cur + offset, true);
    return;
  }

  addEventListener('hashchange', () => show((parseInt(location.hash.slice(2), 10) || 1) - 1));
  addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) show(cur + 1);
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) show(cur - 1);
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(total - 1);
    else if (e.key === 'f' || e.key === 'F') {
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    } else if (e.key === 's' || e.key === 'S') {
      open(location.pathname + '?presenter=1', 'deck-presenter', 'width=1120,height=700');
    }
  });
  bc?.addEventListener('message', (e) => {
    if (e.data.go != null) show(e.data.go);
    if (e.data.hello) bc.postMessage({ cur, total });
  });
  show(cur, true);
})();
