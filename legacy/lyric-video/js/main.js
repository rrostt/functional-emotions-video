// Scene sequencing + live player + offline hooks.

function renderFrame(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  bg(C.void);
  let postCfg = { bloom: .2, grain: .07, vignette: .5 };
  for (let k = 0; k < SCENES.length; k++) {
    const s = SCENES[k]; const next = SCENES[k + 1];
    const end = s.b + (next && next.a <= s.b + .01 ? next.xin : 0);
    if (t < s.a || t >= end) continue;
    const a = s.xin ? smooth((t - s.a) / s.xin) : 1;
    ctx.save(); ctx.globalAlpha = a;
    try { s.fn(t, clamp((t - s.a) / (s.b - s.a))); } catch (e) { console.error(s.name, e); }
    ctx.restore();
    const pc = typeof s.post === 'function' ? s.post(t) : s.post;
    postCfg = { ...postCfg, ...Object.fromEntries(Object.entries(pc).map(([k2, v]) => [k2, lerp(postCfg[k2] ?? v, v, a)])) };
  }
  post(t, { ...postCfg, frame: Math.floor(t * 24) });
}

// ---------- boot ----------
const canvas = document.getElementById('c');
canvas.width = W; canvas.height = H;
setCtx(canvas.getContext('2d', { alpha: false }));
initPost();

const params = new URLSearchParams(location.search);
window.__render = (t) => { renderFrame(t); };
window.__frameJPEG = (t, q = .93) => { renderFrame(t); return canvas.toDataURL('image/jpeg', q); };

const ready = document.fonts.ready.then(() => Promise.all([
  document.fonts.load('40px "Instrument Serif"'), document.fonts.load('italic 40px "Instrument Serif"'),
  document.fonts.load('40px "IBM Plex Mono"'), document.fonts.load('40px Anton')]));
window.__ready = ready.then(() => true);

if (!params.has('offline')) {
  const audio = document.getElementById('a');
  const ui = document.getElementById('ui'), bar = document.getElementById('bar'), fill = document.getElementById('fill'), tl = document.getElementById('time'), play = document.getElementById('play');
  let scrubT = params.has('t') ? parseFloat(params.get('t')) : 0;
  audio.currentTime = scrubT;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function loop() {
    const t = audio.paused ? (audio.currentTime || scrubT) : audio.currentTime;
    renderFrame(Math.min(t, DUR - .01));
    fill.style.width = (t / DUR * 100) + '%'; tl.textContent = `${fmt(t)} / ${fmt(DUR)}`;
    requestAnimationFrame(loop);
  }
  ready.then(() => { requestAnimationFrame(loop); document.body.classList.add('ready'); });
  const toggle = () => { if (audio.paused) { audio.play(); document.body.classList.add('playing'); } else { audio.pause(); document.body.classList.remove('playing'); } };
  play.onclick = toggle; canvas.onclick = toggle;
  audio.onended = () => document.body.classList.remove('playing');
  const seek = (e) => { const r = bar.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX); audio.currentTime = scrubT = clamp((x - r.left) / r.width) * DUR; };
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
