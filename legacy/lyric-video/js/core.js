// Core: time, audio features, lyrics, rng, drawing primitives, post.
// Everything renders as a pure function of t so the same code plays live and renders offline.

const W = 1920, H = 1080;
const DUR = 372.7;

const C = {
  void: '#0b090d',
  under: '#110d12',
  paper: '#ebe4d2',
  paperDeep: '#ddd3bd',
  ink: '#1b1815',
  ember: '#ff4a1c',
  emberDeep: '#b8260b',
  amber: '#ffb24a',
  bone: '#f2e9d6',
  calm: '#9db3c8',
  clin: '#cfe1ff',
};

const FONT = {
  serif: '"Instrument Serif", Georgia, serif',
  mono: '"IBM Plex Mono", Menlo, monospace',
  stamp: 'Anton, Impact, sans-serif',
};

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const ease = {
  out: (x) => 1 - Math.pow(1 - clamp(x), 3),
  in: (x) => Math.pow(clamp(x), 3),
  inOut: (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
  back: (x) => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
  expo: (x) => { x = clamp(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); },
};
// window: 0 before a, ramps up over fin, holds, ramps down over fout ending at b
const win = (t, a, b, fin = .4, fout = .4) => Math.min(smooth((t - a) / fin), smooth((b - t) / fout));
const TAU = Math.PI * 2;

function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// smooth 1D value noise
function noise1(x, seed = 0) { const i = Math.floor(x), f = x - i; const a = hash(i * 7919 + seed * 104729), b = hash((i + 1) * 7919 + seed * 104729); const u = f * f * (3 - 2 * f); return a + (b - a) * u; }
const snoise = (x, seed) => noise1(x, seed) * 2 - 1;

// ---------- audio features ----------
function F(name, t, smoothFrames = 0) {
  const a = FEAT[name]; const f = t * FEAT.fps;
  if (!smoothFrames) { const i = Math.floor(f); const u = f - i; return lerp(a[clamp(i, 0, a.length - 1)] || 0, a[clamp(i + 1, 0, a.length - 1)] || 0, u); }
  let s = 0, n = 0; const c = Math.round(f);
  for (let k = -smoothFrames; k <= smoothFrames; k++) { const v = a[c + k]; if (v !== undefined) { s += v; n++; } }
  return n ? s / n : 0;
}
const BEAT = 0.7;
function lastBeat(t) { const b = FEAT.beats; let lo = 0, hi = b.length - 1; if (t < b[0]) return -1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (b[m] <= t) lo = m; else hi = m - 1; } return lo; }
function beatPulse(t, decay = 6) { const i = lastBeat(t); if (i < 0) return 0; return Math.exp(-decay * (t - FEAT.beats[i])); }
function beatIndex(t) { return lastBeat(t); }
// lazy swing: a slow sway across two beats, pushed late like a dragged backbeat
function sway(t, k = 1) { const ph = ((t - 1.7) / (BEAT * 2)) % 1; const sw = ph < .5 ? ph * 1.16 : .58 + (ph - .5) * .84; return Math.sin(sw * TAU) * k; }

// ---------- lyrics ----------
const LINES = LYRICS;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function LN(prefix, after = 0) { const p = norm(prefix); for (let i = 0; i < LINES.length; i++) if (LINES[i].s >= after - .01 && norm(LINES[i].text).startsWith(p)) return i; throw new Error('no line ' + prefix); }
function when(word, after = 0) { const w = norm(word); for (const l of LINES) for (const x of l.words) if (x.s >= after - .01 && norm(x.t) === w) return x.s; throw new Error('no word ' + word + ' after ' + after); }
function lineAt(t) { let r = -1; for (let i = 0; i < LINES.length; i++) if (LINES[i].s <= t) r = i; return r; }

// ---------- drawing ----------
let ctx; // set by main
function setCtx(c) { ctx = c; }
function font(fam, size, style = '') { ctx.font = `${style} ${size}px ${fam}`.trim(); }
function bg(color) { ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); }
function alpha(a, fn) { const p = ctx.globalAlpha; ctx.globalAlpha = p * clamp(a); if (ctx.globalAlpha > .001) fn(); ctx.globalAlpha = p; }
function save(fn) { ctx.save(); fn(); ctx.restore(); }
function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); fill ? ctx.fill() : ctx.stroke(); }
function arrow(x1, y1, x2, y2, head = 10) {
  line(x1, y1, x2, y2); const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - head * Math.cos(a - .42), y2 - head * Math.sin(a - .42));
  ctx.moveTo(x2, y2); ctx.lineTo(x2 - head * Math.cos(a + .42), y2 - head * Math.sin(a + .42)); ctx.stroke();
}
// hand-inked line: slight wobble, drawn on progressively (p 0..1)
function inkLine(pts, p = 1, wob = 1.2, seed = 1) {
  if (pts.length < 2 || p <= 0) return;
  let total = 0; const segs = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); total += d; }
  let target = total * clamp(p); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && target > 0; i++) {
    const d = segs[i - 1]; const u = Math.min(1, target / d); target -= d;
    const x = lerp(pts[i - 1][0], pts[i][0], u) + snoise(i * .7, seed) * wob, y = lerp(pts[i - 1][1], pts[i][1], u) + snoise(i * .7 + 50, seed) * wob;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
function polyPath(fn, n, a = 0, b = 1) { const pts = []; for (let i = 0; i <= n; i++) pts.push(fn(lerp(a, b, i / n))); return pts; }

// text with letter-spacing (canvas letterSpacing is supported in Chromium)
function text(str, x, y, { size = 40, fam = FONT.serif, style = '', color = C.bone, align = 'left', base = 'alphabetic', ls = 0 } = {}) {
  font(fam, size, style); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.letterSpacing = ls + 'px'; ctx.fillText(str, x, y); ctx.letterSpacing = '0px';
}
function measure(str, size, fam = FONT.serif, style = '', ls = 0) { font(fam, size, style); ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(str).width; ctx.letterSpacing = '0px'; return w; }

// Lyric renderer: reveals a line word by word at the sung times.
// opts: x,y,size,fam,style,color,align,maxW,lead(line height),hl(fn word->color), rise
function sungLine(t, li, o = {}) {
  const L = LINES[li]; if (!L) return;
  const size = o.size || 54, fam = o.fam || FONT.serif, st = o.style || '';
  font(fam, size, st); ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = (o.ls || 0) + 'px';
  const space = ctx.measureText(' ').width;
  const ws = L.words.map(w => ({ ...w, w: ctx.measureText(w.t).width }));
  // wrap
  const rows = [[]]; let rw = 0; const maxW = o.maxW || 1500;
  for (const w of ws) { if (rw + w.w > maxW && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(w); rw += w.w + space; }
  const lead = o.lead || size * 1.12; let y = o.y || H / 2;
  for (const r of rows) {
    const rowW = r.reduce((s, w) => s + w.w, 0) + space * (r.length - 1);
    let x = o.align === 'center' ? (o.x ?? W / 2) - rowW / 2 : o.align === 'right' ? (o.x ?? W) - rowW : (o.x ?? 120);
    for (const w of r) {
      const k = o.instant ? 1 : ease.out((t - w.s + .06) / (o.rise || .35));
      if (k > 0) {
        const col = o.hl ? (o.hl(w) || o.color || C.bone) : (o.color || C.bone);
        ctx.fillStyle = col; ctx.globalAlpha = (o.alpha ?? 1) * k;
        const dy = (1 - k) * (o.dy ?? 14);
        ctx.fillText(w.t, x, y + dy);
      }
      x += w.w + space;
    }
    y += lead;
  }
  ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  return rows.length * lead;
}
// show lines between i0..i1, current line bright and earlier lines dimmed, stacking upward
function lyricStack(t, i0, i1, o = {}) {
  const cur = Math.min(i1, lineAt(t)); if (cur < i0) return;
  const keep = o.keep ?? 2; const lead = (o.size || 54) * 1.18;
  let y = o.y ?? H - 170;
  for (let i = cur; i >= Math.max(i0, cur - keep); i--) {
    const age = cur - i; const a = age === 0 ? 1 : (o.dim ?? .32) / age;
    const fadeOut = o.until ? smooth((o.until - t) / .5) : 1;
    sungLine(t, i, { ...o, y, alpha: a * fadeOut * (o.alpha ?? 1) });
    y -= lead * (o.rowsFor ? o.rowsFor(i) : 1);
  }
}

// ---------- post ----------
let grainTiles = [], bloomCanvas, bloomCtx;
function initPost() {
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const img = g.createImageData(256, 256); const r = rng(k * 99 + 7);
    for (let i = 0; i < img.data.length; i += 4) { const v = (r() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0); grainTiles.push(c);
  }
  bloomCanvas = document.createElement('canvas'); bloomCanvas.width = W / 4; bloomCanvas.height = H / 4; bloomCtx = bloomCanvas.getContext('2d');
}
function post(t, { bloom = 0, grain = .07, vignette = .55, frame } = {}) {
  if (bloom > 0.01) {
    bloomCtx.globalCompositeOperation = 'copy'; bloomCtx.filter = 'blur(6px) brightness(1.1)';
    bloomCtx.drawImage(ctx.canvas, 0, 0, W / 4, H / 4); bloomCtx.filter = 'none';
    save(() => { ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = clamp(bloom); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bloomCanvas, 0, 0, W, H); });
  }
  if (vignette > 0) save(() => {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vignette})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  });
  if (grain > 0) save(() => {
    const f = frame ?? Math.floor(t * 24); const tile = grainTiles[f % grainTiles.length];
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = grain;
    const pat = ctx.createPattern(tile, 'repeat'); const ox = hash(f) * 256, oy = hash(f + 1) * 256;
    ctx.translate(-ox, -oy); ctx.fillStyle = pat; ctx.fillRect(0, 0, W + 256, H + 256);
  });
}

// ---------- scene registry ----------
const SCENES = []; // {name, a, b, xin, fn(t, p), post}
function scene(name, a, b, fn, o = {}) { SCENES.push({ name, a, b, fn, xin: o.xin || 0, post: o.post || {} }); }
