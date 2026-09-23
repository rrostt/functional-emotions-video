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
const params = new URLSearchParams(location.search);
let rendererReady = false;
try { Paint.init(canvas); rendererReady = true; }
catch (error) { document.getElementById('status').textContent = error.message; }
window.__frameJPEG = (t, q = .93) => { renderFrame(t); return canvas.toDataURL('image/jpeg', q); };
window.__ready = rendererReady ? Promise.resolve(true) : Promise.reject(new Error('Renderer unavailable'));
window.__ready.catch(() => {});

if (!params.has('offline') && rendererReady) {
  const audio = document.getElementById('a');
  const bar = document.getElementById('bar'), tl = document.getElementById('time'), play = document.getElementById('play');
  const status = document.getElementById('status'), mute = document.getElementById('mute');
  const quality = document.getElementById('quality'), fullscreen = document.getElementById('fullscreen');
  const initial = Number(params.get('t'));
  let scrubT = Number.isFinite(initial) ? clamp(initial, 0, DUR) : 0;
  let frame = 0;
  const duration = () => Number.isFinite(audio.duration) ? audio.duration : DUR;
  const fmt = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  function draw() {
    frame = 0;
    const t = audio.readyState ? audio.currentTime : scrubT;
    renderFrame(Math.min(t, DUR - .01));
    bar.max = duration(); bar.value = t;
    bar.setAttribute('aria-valuetext', `${fmt(t)} of ${fmt(duration())}`);
    tl.textContent = `${fmt(t)} / ${fmt(duration())}`;
    if (!audio.paused && !audio.ended && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function redraw() { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); }
  function syncState() {
    document.body.classList.toggle('playing', !audio.paused && !audio.ended);
    play.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause');
    redraw();
  }
  const toggle = async () => {
    if (!audio.paused) { audio.pause(); return; }
    try { status.textContent = ''; if (audio.ended) audio.currentTime = 0; await audio.play(); }
    catch { status.textContent = 'Unable to play the soundtrack. Check that the audio file is available, then press Play to retry.'; syncState(); }
  };
  function seek(t) { scrubT = clamp(t, 0, duration()); audio.currentTime = scrubT; redraw(); }
  play.onclick = toggle; canvas.onclick = toggle;
  for (const event of ['play', 'pause', 'ended']) audio.addEventListener(event, syncState);
  for (const event of ['seeking', 'seeked', 'loadeddata']) audio.addEventListener(event, redraw);
  audio.addEventListener('loadedmetadata', () => seek(scrubT));
  if (audio.readyState >= 1) seek(scrubT);
  audio.addEventListener('waiting', () => { status.textContent = 'Loading music…'; });
  audio.addEventListener('playing', () => { status.textContent = ''; });
  audio.addEventListener('canplay', () => { status.textContent = ''; });
  audio.addEventListener('error', () => { status.textContent = 'The soundtrack could not be loaded. Check assets/functional-emotions.mp3 and reload.'; });
  bar.addEventListener('input', () => seek(Number(bar.value)));
  mute.onclick = () => { audio.muted = !audio.muted; };
  audio.addEventListener('volumechange', () => { mute.textContent = audio.muted ? 'Sound off' : 'Sound on'; mute.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute'); });
  quality.onchange = () => { canvas.height = Number(quality.value); canvas.width = canvas.height * 16 / 9; redraw(); };
  quality.onchange();
  async function toggleFullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { status.textContent = 'Fullscreen is unavailable in this browser.'; }
  }
  fullscreen.onclick = toggleFullscreen;
  document.addEventListener('fullscreenchange', () => { fullscreen.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; fullscreen.setAttribute('aria-label', fullscreen.textContent); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else redraw(); });
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); audio.pause(); cancelAnimationFrame(frame); status.textContent = 'Graphics were interrupted. Reload the page to resume.'; });
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('button, input, select') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); seek(audio.currentTime + 5); }
    if (e.code === 'ArrowLeft') { e.preventDefault(); seek(audio.currentTime - 5); }
    if (e.code === 'KeyF') toggleFullscreen();
    if (e.code === 'KeyM') mute.click();
  });
  let idle; const wake = () => { document.body.classList.add('awake'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.remove('awake'), 2200); };
  window.addEventListener('pointermove', wake); window.addEventListener('touchstart', wake); wake();
}
