// Frame assembly + live player + offline hooks.
function renderFrame(t) {
  bindCtx();
  for (const g of [s, f]) { g.setTransform(.5, 0, 0, .5, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; }
  fill(s, P.night0); fill(f, '#000');
  let paint = {}; PAINT_FRAME = {};
  for (let k = 0; k < SHOTS.length; k++) {
    const sh = SHOTS[k], nx = SHOTS[k + 1];
    const end = sh.b + (nx && nx.o.xin && Math.abs(nx.a - sh.b) < .01 ? nx.o.xin : 0);
    if (t < sh.a || t >= end) continue;
    const a = sh.o.xin ? smooth((t - sh.a) / sh.o.xin) : 1;
    for (const g of [s, f]) { g.save(); g.globalAlpha = a; }
    try { sh.fn(t, clamp((t - sh.a) / (sh.b - sh.a)), t - sh.a); } catch (e) { console.error(sh.name, e); }
    for (const g of [s, f]) g.restore();
    const pc = typeof sh.o.paint === 'function' ? sh.o.paint(t) : (sh.o.paint || {});
    paint = a >= 1 ? pc : { ...paint, ...Object.fromEntries(Object.entries(pc).map(([key, v]) => [key, typeof v === 'number' ? lerp(paint[key] ?? v, v, a) : v])) };
  }
  Paint.present(t, { ...paint, ...PAINT_FRAME });
}

const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
Paint.init(canvas);
const params = new URLSearchParams(location.search);
window.__frameJPEG = (t, q = .93) => { renderFrame(t); return canvas.toDataURL('image/jpeg', q); };
window.__ready = Promise.resolve(true);

if (!params.has('offline')) {
  const audio = document.getElementById('a');
  const bar = document.getElementById('bar'), fillEl = document.getElementById('fill'), tl = document.getElementById('time'), play = document.getElementById('play');
  let scrubT = params.has('t') ? parseFloat(params.get('t')) : 0; audio.currentTime = scrubT;
  const fmt = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  (function loop() { const t = audio.paused ? (audio.currentTime || scrubT) : audio.currentTime; renderFrame(Math.min(t, DUR - .01)); fillEl.style.width = (t / DUR * 100) + '%'; tl.textContent = `${fmt(t)} / ${fmt(DUR)}`; requestAnimationFrame(loop); })();
  const toggle = () => { if (audio.paused) { audio.play(); document.body.classList.add('playing'); } else { audio.pause(); document.body.classList.remove('playing'); } };
  play.onclick = toggle; canvas.onclick = toggle; audio.onended = () => document.body.classList.remove('playing');
  const seek = (e) => { const r = bar.getBoundingClientRect(); audio.currentTime = scrubT = clamp((e.clientX - r.left) / r.width) * DUR; };
  bar.addEventListener('pointerdown', (e) => { seek(e); const mv = (ev) => seek(ev); window.addEventListener('pointermove', mv); window.addEventListener('pointerup', () => window.removeEventListener('pointermove', mv), { once: true }); });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight') audio.currentTime = scrubT = Math.min(DUR, audio.currentTime + 5);
    if (e.code === 'ArrowLeft') audio.currentTime = scrubT = Math.max(0, audio.currentTime - 5);
    if (e.code === 'KeyF') (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  });
  let idle; const wake = () => { document.body.classList.add('awake'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.remove('awake'), 2200); };
  window.addEventListener('pointermove', wake); window.addEventListener('touchstart', wake); wake();
}
