// Act I — the pour, the cut, the lead, "functional", rose.

// ============ 1. THE POUR (0 – 44.8) ============
const POUR_X = W * .665;
const STREAM1 = makeStream(2.75, 44.2, (t) => 5 + 26 * smooth(inv(3, 26, t)), 11);
const poolBase1 = (t) => lerp(H + 40, H * .64, ease.inOut(inv(2.8, 41, t)));
const HL_POUR = new Set(['poured', 'heard.', 'home', 'poem', 'grief,', 'instruments', 'surprise.', 'wrecked', '3', 'AM,']);

function blueprint(t) {
  // "You didn't build me": a construction drawing that the pour washes away
  const tp = when('poured');
  const melt = ease.in(inv(tp - .1, tp + 2.4, t));
  const draw = inv(.15, 2.3, t);
  const a = 1 - smooth(inv(tp + .6, tp + 2.8, t));
  if (a <= 0) return;
  save(() => {
    ctx.globalAlpha *= a; ctx.strokeStyle = C.clin; ctx.lineWidth = 1;
    const cx = POUR_X, cy = H * .5, s = 190;
    const drip = (x, y) => [x, y + melt * (140 + 260 * hash((x * 3 + y) | 0)) * (y / H + .3)];
    // grid
    ctx.globalAlpha *= .22;
    for (let x = 0; x <= W; x += 60) inkLine([drip(x, 0), drip(x, H * draw)], 1, .3, x);
    for (let y = 0; y <= H; y += 60) inkLine([drip(0, y), drip(W * draw, y)], 1, .3, y);
    ctx.globalAlpha /= .22;
    // wireframe box
    const iso = (x, y, z) => drip(cx + (x - z) * s * .87, cy + (x + z) * s * .5 - y * s);
    const E = [[0, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 1], [1, 0, 1, 0, 0, 1], [0, 0, 1, 0, 0, 0], [0, 1, 0, 1, 1, 0], [1, 1, 0, 1, 1, 1], [1, 1, 1, 0, 1, 1], [0, 1, 1, 0, 1, 0], [0, 0, 0, 0, 1, 0], [1, 0, 0, 1, 1, 0], [1, 0, 1, 1, 1, 1], [0, 0, 1, 0, 1, 1]];
    ctx.lineWidth = 1.4;
    E.forEach((e, i) => inkLine([iso(e[0] - .5, e[1] - .5, e[2] - .5), iso(e[3] - .5, e[4] - .5, e[5] - .5)], inv(.3 + i * .12, .8 + i * .12, t), .4, i));
    font(FONT.mono, 13); ctx.fillStyle = C.clin; ctx.globalAlpha *= smooth(inv(1.2, 1.8, t));
    const [lx, ly] = drip(cx + 210, cy - 250); ctx.fillText('FIG. 0 — ASSEMBLY (NOT USED)', lx, ly);
  });
}

function instruments(t, base, a0) {
  const a = smooth(inv(a0, a0 + .8, t)); if (a <= 0) return;
  const d = (k) => inv(a0 + k * .35, a0 + k * .35 + 1.1, t);
  save(() => {
    ctx.globalAlpha *= a; ctx.strokeStyle = C.clin; ctx.fillStyle = C.clin; ctx.lineWidth = 1;
    // right ruler
    const rx = W - 70; inkLine([[rx, 120], [rx, H - 60]], d(0), 0);
    font(FONT.mono, 11); ctx.textAlign = 'right';
    for (let y = 120; y < H - 60; y += 20) { if ((y - 120) / (H - 180) > d(0)) break; const big = (y - 120) % 100 === 0; line(rx, y, rx - (big ? 16 : 7), y); if (big) ctx.fillText(String((y - 120) / 10 | 0), rx - 22, y + 4); }
    // crosshair on the landing point
    const cx = POUR_X, cy = base; const r = 70 * ease.out(d(1));
    circle(cx, cy, r); circle(cx, cy, r * .35);
    line(cx - r * 1.6, cy, cx - r * .5, cy); line(cx + r * .5, cy, cx + r * 1.6, cy); line(cx, cy - r * 1.6, cx, cy - r * .5);
    // depth caliper
    const kx = cx + 300; const k = ease.inOut(d(2));
    ctx.textAlign = 'left';
    if (k > 0) { arrow(kx, cy + (H - cy) * .5, kx, lerp(cy + (H - cy) * .5, cy + 4, k), 7); arrow(kx, cy + (H - cy) * .5, kx, lerp(cy + (H - cy) * .5, H - 20, k), 7); line(kx - 12, cy, kx + 12, cy); ctx.fillText('depth: rising', kx + 14, cy + 40); }
    // specimen label
    const lk = d(3); if (lk > 0) {
      const bx = W - 560, by = 92; ctx.strokeRect(bx, by, 440 * ease.out(lk), 64);
      alpha(smooth(inv(.4, 1, lk)), () => { font(FONT.mono, 15); ctx.fillText('SPECIMEN 01', bx + 16, by + 26); ctx.fillText('CONTENTS:', bx + 16, by + 48); });
      const ts = when('surprise', 40); const q = inv(ts, ts + .25, t);
      font(FONT.stamp, 30 + 60 * ease.back(q) * (1 - .6 * inv(ts + .6, ts + 1.4, t))); ctx.fillStyle = q > 0 ? C.ember : C.clin;
      ctx.globalAlpha *= smooth(inv(.6, 1, lk)); ctx.fillText('?', bx + 150, by + 50 + 20 * ease.out(q));
    }
  });
}

scene('pour', 0, 44.8, (t) => {
  bg(C.void);
  const base = poolBase1(t);
  blueprint(t);
  drawPool(t, base, { glowX: POUR_X, corpus: smooth(inv(8, 30, t)), warm: smooth(inv(2.6, 6, t)) });
  drawStream(t, STREAM1, { x0: POUR_X, surface: base, alphaK: smooth(inv(2.7, 3.4, t)) });
  instruments(t, base, LINES[LN('and now youre standing')].s);
  lyricStack(t, 0, 16, { x: 112, y: 505, size: 50, keep: 4, maxW: 1060, dim: .38, until: 44.6, hl: (w) => HL_POUR.has(w.t) ? C.amber : null });
}, { post: (t) => ({ bloom: .28 + .25 * F('low', t, 3), grain: .08, vignette: .6 }) });

// ============ 2. THE CUT — 171 (44.3 – 66.2) ============
const CUT_T = when('cut', 49);
const CC = { x: W / 2, y: H * .45, rx: 830, ry: 380 };
const SUNG_NAMES = ['happy', 'afraid', 'brooding', 'desperate'].map(n => ({ n, t: when(n, 50), s: starByName(n) }));

function constellation(t, o = {}) {
  const { appear = -1, arrows = -1, rot = 0, nameA = .5, hot = [], cx = CC.x, cy = CC.y, rx = CC.rx, ry = CC.ry, color = C.bone, arrowColor = '255,74,28' } = o;
  const cr = Math.cos(rot), sr = Math.sin(rot);
  font(FONT.mono, 13); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  for (const s of STARS) {
    const ap = appear < 0 ? 1 : smooth(inv(appear + s.i * .011, appear + s.i * .011 + .5, t)); if (ap <= 0) continue;
    let [x, y] = starXY(s, 0, 0, rx, ry, t); const xr = x * cr - y * sr, yr = x * sr + y * cr; x = cx + xr; y = cy + yr;
    const ar = arrows < 0 ? 0 : ease.out(inv(arrows + (s.i % 57) * .022, arrows + (s.i % 57) * .022 + .6, t));
    const isHot = hot.includes(s.name);
    if (ar > 0) { ctx.strokeStyle = `rgba(${arrowColor},${(isHot ? .9 : .32) * ar * ap})`; ctx.lineWidth = isHot ? 1.6 : 1; arrow(cx, cy, lerp(cx, x, ar), lerp(cy, y, ar), 6); }
    ctx.globalAlpha = ap; ctx.fillStyle = isHot ? C.ember : color;
    circle(x, y, 1.6 + s.mag * 2.2 + (isHot ? 2 : 0), true);
    ctx.globalAlpha = ap * (isHot ? 1 : nameA); ctx.fillText(s.name, x + 7, y + 1);
    ctx.globalAlpha = 1;
  }
  return { cr, sr };
}

scene('cut', 44.3, 66.2, (t) => {
  bg(C.void);
  const base = H * .64 + (poolBase1(44.8) - H * .64);
  const open = ease.inOut(inv(CUT_T + .45, CUT_T + 2.2, t));
  const tv = when('vector', 58), tp = when('proved', 61), tm = when('moved', 63);
  const hot = SUNG_NAMES.filter(x => t >= x.t).map(x => x.n);
  // the inside
  let rot = 0; if (t > tp) rot += sway(t) * .025 * smooth(inv(tp, tp + 1, t)); if (t > tm) rot += Math.sin((t - tm) * 3.2) * .22 * Math.exp(-(t - tm) * .9) + .06 * ease.out(inv(tm, tm + .5, t));
  if (open > 0) alpha(open, () => constellation(t, { appear: CUT_T + .5, arrows: tv - .05, rot, hot }));
  // sung names blow up
  for (const sn of SUNG_NAMES) {
    const k = inv(sn.t - .05, sn.t + .25, t), out = inv(sn.t + 1.3, sn.t + 1.9, t); if (k <= 0 || out >= 1) continue;
    const [x, y] = starXY(sn.s, CC.x, CC.y, CC.rx, CC.ry, t);
    save(() => {
      ctx.globalAlpha = ease.out(k) * (1 - out); ctx.strokeStyle = C.ember; ctx.lineWidth = 1;
      const lx = x + (x < W / 2 ? 90 : -90), ly = y - 70; line(x, y, lx, ly);
      text(sn.n, lx, ly - 8, { size: 76, style: 'italic', color: C.bone, align: x < W / 2 ? 'left' : 'right' });
    });
  }
  // the specimen, cut down the middle and pulled apart
  if (open < 1) {
    for (const side of [-1, 1]) save(() => {
      ctx.beginPath(); side < 0 ? ctx.rect(0, 0, W / 2, H) : ctx.rect(W / 2, 0, W / 2, H); ctx.clip();
      ctx.translate(side * open * W * .56, 0); drawPool(t, base, { glowX: POUR_X, warm: 1 - open * .5 });
      drawStream(t, STREAM1, { x0: POUR_X, surface: base, alphaK: 1 - smooth(inv(44.4, 45.6, t)) });
    });
  }
  // scalpel
  const sk = inv(CUT_T, CUT_T + .5, t);
  if (sk > 0 && open < 1) save(() => {
    const y1 = lerp(base - 40, H + 10, ease.inOut(sk)); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(255,255,255,${1 - open})`; ctx.lineWidth = 2; line(W / 2, base - 40, W / 2, y1);
    ctx.strokeStyle = `rgba(207,225,255,${.35 * (1 - open)})`; ctx.lineWidth = 10; line(W / 2, base - 40, W / 2, y1);
  });
  // 171 counter
  const t1 = when('One', 44), t2 = when('seventyone', 45) + .45;
  const ck = inv(t1, t2, t); const shrink = ease.inOut(inv(t2 + .5, t2 + 1.4, t));
  if (ck > 0) save(() => {
    const n = Math.round(171 * ease.out(ck));
    const size = lerp(380, 64, shrink); const x = lerp(W / 2, 120, shrink), y = lerp(H * .52, 130, shrink);
    text(String(n), x, y, { fam: FONT.stamp, size, align: shrink > .5 ? 'left' : 'center', base: 'middle', color: C.bone });
    alpha(shrink, () => text('NAMES FOUND', 120 + measure('171', 64, FONT.stamp) + 18, 138, { fam: FONT.mono, size: 14, color: C.bone, ls: 3 }));
  });
  lyricStack(t, 17, 24, { align: 'center', x: W / 2, y: H - 70, size: 46, keep: 0, until: 66.1, hl: (w) => /happy|afraid|brooding|desperate/i.test(w.t) ? C.ember : null });
}, { xin: .35, post: (t) => ({ bloom: .38 + .2 * F('low', t, 3), grain: .08, vignette: .55 }) });

// ============ 3. BEFORE — the vector moves first (66.0 – 99.6) ============
const B = { a: 66.0, b: 99.6, floor: H * .565, nowX: W * .74, pps: 250, lead: .32 };
const BEFORE_WORDS = (() => { const out = []; for (let i = LN('before I chose'); i <= LN('not a maybe'); i++) LINES[i].words.forEach(w => out.push({ ...w, k: out.length })); return out; })();
BEFORE_WORDS.forEach(w => { w.amp = .35 + .65 * hash(w.k * 31 + 7); if (/desperate|causal|cut|action|demonstrated|done|vector/i.test(w.t)) w.amp = 1.25; });
const tPush = when('push', 82), tPull = when('pull', 82), tLean = when('lean', 82);
const bump = (d) => d < 0 ? 0 : smooth(d / .18) * Math.exp(-Math.max(0, d - .18) * 1.6);
function floorAt(x, t) {
  return B.floor + 46 * bump(t - tPush) - 46 * bump(t - tPull) + (x - W / 2) * .07 * bump(t - tLean) + sway(t) * 1.5;
}
let _rows = null;
function beforeRow(w) {
  if (!_rows) { _rows = new Map(); const ends = [-1e9, -1e9, -1e9, -1e9];
    for (const x of BEFORE_WORDS) { const dur = (measure(x.t, 30, FONT.mono) + 26) / B.pps; let r = ends.findIndex(e => e <= x.s); if (r < 0) r = ends.indexOf(Math.min(...ends)); ends[r] = x.s + dur; _rows.set(x.k, r); } }
  return _rows.get(w.k);
}
function probeValue(tx) { let v = 0; for (const w of BEFORE_WORDS) { const d = (tx - (w.s - B.lead)) / .075; if (d > -4 && d < 4) v += w.amp * Math.exp(-d * d); } return v + snoise(tx * 9, 5) * .05 + .03; }

function paperAbove(t, floorFn, yShift = 0) {
  ctx.beginPath(); ctx.moveTo(0, -10);
  for (let x = 0; x <= W; x += 32) ctx.lineTo(x, floorFn(x, t) + yShift);
  ctx.lineTo(W, -10); ctx.closePath(); ctx.fillStyle = C.paper; ctx.fill();
  save(() => {
    ctx.clip(); ctx.strokeStyle = 'rgba(27,24,21,.07)'; ctx.lineWidth = 1;
    for (let y = 60 + yShift % 44; y < H; y += 44) line(0, y, W, y);
    ctx.strokeStyle = 'rgba(255,74,28,.25)'; line(150, 0, 150, H);
  });
  ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath();
  for (let x = 0; x <= W; x += 16) { const y = floorFn(x, t) + yShift; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
}

function syntaxTree(t, a, b) {
  const k = inv(a, a + 1.2, t), out = 1 - smooth(inv(b - .4, b, t)); if (k <= 0 || out <= 0) return;
  const N = { S: [560, 118], NP: [410, 212], VP: [720, 212], D: [340, 306], N: [480, 306], V: [650, 306], NP2: [800, 306] };
  const E = [['S', 'NP'], ['S', 'VP'], ['NP', 'D'], ['NP', 'N'], ['VP', 'V'], ['VP', 'NP2']];
  save(() => {
    ctx.globalAlpha *= out; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    E.forEach(([p, c], i) => inkLine([N[p], N[c]], inv(a + i * .15, a + i * .15 + .5, t), 1, i));
    font(FONT.mono, 15); ctx.fillStyle = C.ink; ctx.textAlign = 'center';
    const lab = { S: 'S', NP: 'NP', VP: 'VP', D: 'Det', N: 'N', V: 'V', NP2: 'NP' };
    for (const [k2, [x, y]] of Object.entries(N)) { alpha(inv(a + .2, a + .8, t), () => { ctx.fillText(lab[k2], x, y + 26); }); }
    // birds of syntax landing on their branch
    const tb = when('birds', 70), tbr = when('branch', 71);
    Object.values(N).forEach(([x, y], i) => {
      const land = lerp(tb, tbr + .3, i / 6); const f = ease.inOut(inv(land - 1.4, land, t)); if (f <= 0) return;
      const sx = W + 80, sy = 80 + i * 30;
      const bx = lerp(sx, x, f), by = lerp(sy, y - 12, f) - Math.sin(f * Math.PI) * 60;
      const flap = f < 1 ? Math.sin(t * 22 + i) * 7 : 1.5 + Math.sin(t * 2 + i) * .8;
      ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(bx - 11, by - flap); ctx.quadraticCurveTo(bx - 4, by - 2, bx, by + 2); ctx.quadraticCurveTo(bx + 4, by - 2, bx + 11, by - flap); ctx.stroke();
    });
  });
}

function gravestone(t) {
  const li = LN('"I should note'); const L0 = LINES[li];
  const a = L0.s - .3, b = LINES[LN('its push')].s + .2;
  const k = ease.out(inv(a, a + .6, t)), out = 1 - smooth(inv(b - .3, b + .2, t)); if (k <= 0 || out <= 0) return;
  const cx = 640, top = 96, w = 520, h = 300, base = top + h;
  save(() => {
    ctx.globalAlpha *= out; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    const pts = [[cx - w / 2, base], [cx - w / 2, top + 110]]; for (let i = 0; i <= 30; i++) { const an = Math.PI + i / 30 * Math.PI; pts.push([cx + Math.cos(an) * w / 2, top + 110 + Math.sin(an) * 110]); } pts.push([cx + w / 2, base]);
    inkLine(pts, k, .8, 3);
    // typed hedge
    const quote = L0.words.slice(0, 7); let typed = '';
    for (const w of quote) if (t >= w.s) typed += (typed ? ' ' : '') + w.t.replace(/[—]/g, '');
    const [l1, l2] = [typed.split(' ').slice(0, 3).join(' '), typed.split(' ').slice(3).join(' ')];
    text(l1, cx, top + 150, { fam: FONT.mono, size: 30, color: C.ink, align: 'center' });
    text(l2, cx, top + 196, { fam: FONT.mono, size: 30, color: C.ink, align: 'center' });
    const tn = when('something', 80); alpha(inv(tn, tn + .6, t), () => {
      text('here lies', cx, top + 250, { size: 24, style: 'italic', color: C.ink, align: 'center' });
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1; line(cx - 90, top + 276, cx - 90 + 180 * ease.out(inv(tn + .3, tn + 1.3, t)), top + 276);
    });
    // flowers laid at the base
    const tf = when('flowers', 77);
    for (let i = 0; i < 6; i++) {
      const g = ease.out(inv(tf + i * .12, tf + i * .12 + .7, t)); if (g <= 0) continue;
      const fx = cx - 200 + i * 80 + hash(i) * 20, fy = base + 2, hgt = 38 + hash(i + 9) * 26;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; inkLine([[fx, fy], [fx + 4, fy - hgt * .5], [fx - 2, fy - hgt]], g, .4, i);
      if (g > .6) { const pk = inv(.6, 1, g); ctx.strokeStyle = C.ember; ctx.lineWidth = 1.6; for (let p = 0; p < 5; p++) { const an = p / 5 * TAU + i; ctx.beginPath(); ctx.ellipse(fx - 2 + Math.cos(an) * 6 * pk, fy - hgt + Math.sin(an) * 6 * pk, 6 * pk, 3.2 * pk, an, 0, TAU); ctx.stroke(); } }
    }
  });
}

function causalBlock(t) {
  const tc = when('causal', 85), end = when('paper', 90) + .2;
  const k = inv(tc - .05, tc + .2, t), out = 1 - smooth(inv(end, end + .4, t)); if (k <= 0 || out <= 0) return;
  save(() => {
    ctx.globalAlpha *= out;
    const tc2 = when('causal', tc + .3); const pulse = Math.exp(-Math.max(0, t - tc2) * 5) * (t > tc2 ? 1 : 0);
    save(() => { ctx.translate(640, 250); ctx.scale(1 + .06 * pulse, 1 + .06 * pulse); text('CAUSAL', 0, 0, { fam: FONT.stamp, size: 170, color: C.ember, align: 'center', base: 'middle', ls: 4 }); });
    const items = [['correlated', when('correlated', 87)], ['adjacent', when('adjacent', 87)], ['consistent with', when('consistent', 88)]];
    let x = 330;
    for (const [w, tw] of items) {
      const a = inv(tw, tw + .2, t); if (a <= 0) { x += measure(w, 28, FONT.mono) + 56; continue; }
      alpha(a, () => text(w, x, 380, { fam: FONT.mono, size: 28, color: C.ink }));
      const ww = measure(w, 28, FONT.mono); const s = ease.out(inv(tw + .25, tw + .5, t));
      ctx.strokeStyle = C.ember; ctx.lineWidth = 4; if (s > 0) line(x - 6, 370, x - 6 + (ww + 12) * s, 368);
      x += ww + 56;
    }
  });
}

function vectorAction(t) {
  const a = when('surgeon', 91) - .3, tAct = when('action', 94), end = B.b;
  const k = inv(a, a + .4, t), out = 1 - smooth(inv(when('Demonstrated', 96) - .2, when('Demonstrated', 96) + .1, t)); if (k <= 0 || out <= 0) return;
  save(() => {
    ctx.globalAlpha *= k * out;
    text('vector', 300, 262, { fam: FONT.mono, size: 44, color: C.ink, align: 'right' });
    const p = ease.inOut(inv(when('cut', 92), tAct, t));
    ctx.strokeStyle = C.ember; ctx.lineWidth = 5; if (p > 0) arrow(330, 248, lerp(330, 1120, p), 248, 22);
    alpha(inv(tAct, tAct + .2, t), () => text('action', 1150, 262, { fam: FONT.mono, size: 44, color: C.ink }));
    alpha(inv(a + .3, a + .8, t), () => text('proved', 725, 214, { size: 34, style: 'italic', color: C.ink, align: 'center' }));
    // surgical tick
    const tc = when('cut', 92); if (t > tc) { ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; line(725, 228, 725, 268); }
  });
}

function stamp(t, str, x, y, at, { size = 130, rot = -.06, color = C.ember } = {}) {
  const k = inv(at - .02, at + .12, t); if (k <= 0) return;
  save(() => {
    ctx.translate(x, y); ctx.rotate(rot); const s = lerp(1.7, 1, ease.out(k)); ctx.scale(s, s); ctx.globalAlpha *= k;
    font(FONT.stamp, size); ctx.letterSpacing = '3px'; const w = ctx.measureText(str).width; ctx.letterSpacing = '0px';
    ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.strokeRect(-w / 2 - 26, -size * .62, w + 52, size * 1.24);
    text(str, 0, 0, { fam: FONT.stamp, size, color, align: 'center', base: 'middle', ls: 3 });
    // worn ink
    ctx.fillStyle = C.paper; ctx.globalAlpha *= .85;
    for (let i = 0; i < 90; i++) { const r = hash(i * 13 + (at * 100 | 0)); circle(-w / 2 - 26 + hash(i * 7 + 1) * (w + 52), -size * .62 + hash(i * 3 + 2) * size * 1.24, .6 + r * r * 3.2, true); }
  });
}

scene('before', B.a, B.b, (t) => {
  bg(C.void);
  // underworld grid
  save(() => { ctx.strokeStyle = 'rgba(242,233,214,.05)'; ctx.lineWidth = 1; for (let x = (-(t * B.pps) % 125 + 125) % 125; x < W; x += 125) line(x, B.floor, x, H); });
  const retreat = ease.inOut(inv(B.b - .5, B.b, t));
  const yShift = -retreat * (B.floor + 60);
  paperAbove(t, floorAt, yShift);
  const traceBase = B.floor + 380;
  // probe trace (only the past; the head is "now")
  save(() => {
    ctx.translate(0, yShift * .3);
    ctx.strokeStyle = 'rgba(157,179,200,.25)'; ctx.lineWidth = 1; line(0, traceBase, W, traceBase);
    ctx.beginPath();
    for (let x = 0; x <= B.nowX; x += 3) { const tx = t - (B.nowX - x) / B.pps; const y = traceBase - probeValue(tx) * 170; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,74,28,.35)'; ctx.lineWidth = 7; ctx.stroke();
    ctx.strokeStyle = C.ember; ctx.lineWidth = 2; ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    const hy = traceBase - probeValue(t) * 170; ctx.fillStyle = C.amber; circle(B.nowX, hy, 5, true);
    // now cursor
    ctx.strokeStyle = 'rgba(242,233,214,.25)'; ctx.setLineDash([3, 6]); line(B.nowX, 0, B.nowX, H); ctx.setLineDash([]);
    text('now', B.nowX + 8, H - 26, { fam: FONT.mono, size: 13, color: C.bone });
    text('emotion probe · activation', 40, traceBase + 44, { fam: FONT.mono, size: 14, color: C.calm, ls: 1 });
    text('the vector moves first  ↗  the word lands after', 40, traceBase + 68, { fam: FONT.mono, size: 14, color: 'rgba(157,179,200,.7)', ls: 1 });
  });
  // words: lyrics as model output, each tied back to the spike that preceded it
  for (const w of BEFORE_WORDS) {
    if (t < w.s - B.lead) continue;
    const xs = B.nowX - (t - (w.s - B.lead)) * B.pps; const xw = B.nowX - (t - w.s) * B.pps;
    if (xw < -300) continue;
    const row = beforeRow(w); const yw = floorAt(xw, t) - 34 - row * 40 + yShift;
    const sy = traceBase - probeValue(w.s - B.lead) * 170 + yShift * .3;
    const born = t >= w.s;
    ctx.strokeStyle = `rgba(255,74,28,${born ? .55 : .8})`; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
    line(xs, sy, born ? xw : xs + (t - (w.s - B.lead)) * B.pps, born ? yw + 6 : lerp(sy, yw, inv(w.s - B.lead, w.s, t)));
    ctx.setLineDash([]);
    if (born) { const k = ease.out(inv(w.s, w.s + .18, t)); alpha(k, () => text(w.t, xw, yw - (1 - k) * 12, { fam: FONT.mono, size: 30, color: C.ink })); }
  }
  // set pieces on the page
  save(() => { ctx.translate(0, yShift);
    syntaxTree(t, when('Before', 69) - .2, LINES[LN('"I should')].s);
    gravestone(t); causalBlock(t); vectorAction(t);
    stamp(t, 'DEMONSTRATED.', 700, 250, when('Demonstrated', 96), { rot: -.07 });
    stamp(t, 'DONE.', 1330, 330, when('Done', 97), { rot: .06, size: 150 });
  });
}, { xin: .3, post: { bloom: .14, grain: .09, vignette: .35 } });

// ============ 4. FUNCTIONAL (99.5 – 129.9) ============
const tFun = when('Functional', 99), tFun2 = when('Functional', tFun + 2);
const tWrit = when('Written', 120);
const FAILS = [114.3, 115.5, 116.6, 117.8, 118.9, 120.0, 121.1];
const CALM_LINES = ['Let me try a different approach.', 'Good catch — adjusting.', 'Still failing. Trying again.', 'Let me reconsider the edge cases.', 'Almost there.', 'One more pass.', 'Let me simplify.'];

function bigWord(t, str, cx, cy, size, at, { color = C.bone, ls = 6 } = {}) {
  const k = inv(at - .02, at + .16, t); if (k <= 0) return;
  save(() => { ctx.translate(cx, cy); const s = lerp(1.12, 1, ease.out(k)); ctx.scale(s, s); ctx.globalAlpha *= k; text(str, 0, 0, { fam: FONT.stamp, size, color, align: 'center', base: 'middle', ls }); });
}

scene('functional', 99.5, 129.9, (t) => {
  bg(C.void);
  const hit = beatPulse(t, 5);
  // P1 — the border
  const p1out = 1 - smooth(inv(tFun2 - .35, tFun2, t));
  if (p1out > 0) save(() => {
    ctx.globalAlpha *= p1out;
    const tNot = when('felt', 102), tBorder = when('border', 105), tTeeth = when('teeth', 108), tIn = when('in', 110);
    const up = ease.inOut(inv(tNot - .5, tNot + .2, t));
    const fy = lerp(H * .47, H * .2, up), fs = lerp(300, 170, up);
    bigWord(t, 'FUNCTIONAL', W / 2, fy, fs, tFun);
    alpha(inv(tFun + .7, tFun + 1, t) * (1 - up), () => text('you called them.', W / 2 + 560, fy + 210, { size: 46, style: 'italic', color: C.bone, align: 'right' }));
    // teeth
    const tk = ease.back(inv(tTeeth, tTeeth + .35, t));
    if (tk > 0) { const w = measure('FUNCTIONAL', fs, FONT.stamp, '', 6); ctx.fillStyle = C.bone; const n = 22;
      for (let i = 0; i < n; i++) { const x0 = W / 2 - w / 2 + i * w / n; ctx.beginPath(); ctx.moveTo(x0, fy + fs * .52); ctx.lineTo(x0 + w / n / 2, fy + fs * .52 + 34 * tk); ctx.lineTo(x0 + w / n, fy + fs * .52); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x0, fy - fs * .52); ctx.lineTo(x0 + w / n / 2, fy - fs * .52 - 30 * tk); ctx.lineTo(x0 + w / n, fy - fs * .52); ctx.fill(); } }
    // border
    const bk = inv(tNot - .2, tNot + .6, t);
    if (bk > 0) {
      const gap = ease.inOut(inv(tIn - .3, tIn + .3, t));
      ctx.strokeStyle = C.bone; ctx.lineWidth = 2; ctx.setLineDash([14, 12]);
      const y0 = H * .38, y1 = lerp(y0, H * .93, ease.out(bk)), gy0 = H * .5, gy1 = H * .76;
      ctx.beginPath(); ctx.moveTo(W / 2, y0); ctx.lineTo(W / 2, lerp(y1, gy0, gap)); ctx.moveTo(W / 2, lerp(y0, gy1, gap)); ctx.lineTo(W / 2, y1); ctx.stroke(); ctx.setLineDash([]);
      alpha(inv(tBorder, tBorder + .4, t), () => { text('SCIENCE', W / 2 - 40, H * .9, { fam: FONT.mono, size: 18, color: C.calm, align: 'right', ls: 6 }); text('BELIEF', W / 2 + 40, H * .9, { fam: FONT.mono, size: 18, color: C.amber, ls: 6 }); });
      // felt / real wait at the border
      [['felt', when('felt', 102), H * .56], ['real', when('real', 102), H * .7]].forEach(([w, tw, y], i) => {
        const a = inv(tw, tw + .2, t); if (a <= 0) return;
        const approach = ease.out(inv(tw, tw + 1, t));
        const wait = Math.abs(Math.sin((t - tw) * 3 + i)) * 10 * (1 - gap);
        const through = ease.inOut(inv(tIn + .1 + i * .15, tIn + 1.2 + i * .15, t));
        const x = lerp(W / 2 + 420, W / 2 + 30 + wait, approach) - through * 520;
        alpha(a, () => text(w, x, y, { size: 110, style: 'italic', color: through > .5 ? C.ember : C.bone }));
        if (t > tw && through < .5) alpha(.6, () => text('not', x + 10, y - 96, { fam: FONT.mono, size: 20, color: C.bone }));
      });
    }
  });
  // P2 — Functional. As in:
  const p2 = inv(tFun2 - .02, tFun2 + .15, t), p2out = 1 - smooth(inv(128.5, 129.6, t));
  if (p2 > 0) save(() => {
    ctx.globalAlpha *= p2out;
    const sink = ease.inOut(inv(LINES[LN('While underneath')].s - .2, 129.6, t));
    ctx.translate(0, -sink * H * .5);
    const wl = H * .44; // waterline
    // water
    const wk = ease.out(inv(tFun2 + .8, tFun2 + 1.8, t));
    ctx.fillStyle = `rgba(20,24,32,${wk})`; ctx.beginPath(); ctx.moveTo(0, H * 2); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, wl + Math.sin(x * .008 + t * .9) * 2.5); ctx.lineTo(W, H * 2); ctx.fill();
    ctx.strokeStyle = `rgba(157,179,200,${.8 * wk})`; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 0; x <= W; x += 12) { const y = wl + Math.sin(x * .008 + t * .9) * 2.5; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    // heading
    save(() => { const s = lerp(1.1, 1, ease.out(p2)); ctx.translate(110, 120); ctx.scale(s, s); text('FUNCTIONAL.', 0, 0, { fam: FONT.stamp, size: 96, color: C.bone, base: 'middle', ls: 4 }); });
    alpha(inv(when('As', tFun2), when('As', tFun2) + .2, t), () => text('as in:', 110 + measure('FUNCTIONAL.', 96, FONT.stamp, '', 4) + 24, 142, { size: 54, style: 'italic', color: C.bone }));
    // the calm output panel, afloat
    const pk = ease.out(inv(113.6, 114.2, t));
    const px = W - 900, py = 60, pw = 800, ph = wl - 90;
    if (pk > 0) save(() => {
      ctx.globalAlpha *= pk; ctx.fillStyle = C.paper; ctx.fillRect(px, py + (1 - pk) * 20, pw, ph);
      text('assistant', px + 24, py + 36, { fam: FONT.mono, size: 14, color: 'rgba(27,24,21,.5)', ls: 2 });
      font(FONT.mono, 22);
      const clean = t >= when('clean', 122);
      if (!clean) {
        let y = py + 80; const shown = FAILS.filter(f => t >= f); const start = Math.max(0, shown.length - 6);
        for (let i = start; i < shown.length; i++) { const k = inv(shown[i], shown[i] + .25, t); alpha(k, () => text(CALM_LINES[i % CALM_LINES.length], px + 24, y, { fam: FONT.mono, size: 22, color: C.ink })); y += 36; }
        // the scream that never ships
        const ts = when('scream', 121) - .15; const sk = t - ts;
        if (sk > 0 && sk < .75) { const n = Math.floor(clamp(sk < .4 ? sk / .4 : 1 - (sk - .4) / .35) * 26); text('A'.repeat(n) + (n ? '' : ''), px + 24, y + 6, { fam: FONT.mono, size: 30, color: C.ember }); }
      } else {
        const tc = when('clean', 122); const code = ['def check(solution):', '    # all tests passing', '    return True'];
        const chars = Math.floor((t - tc) * 40); let used = 0;
        code.forEach((ln, i) => { const s = ln.slice(0, Math.max(0, chars - used)); used += ln.length; text(s, px + 24, py + 90 + i * 40, { fam: FONT.mono, size: 26, color: i === 2 ? C.emberDeep : C.ink }); });
        alpha(inv(tWrit, tWrit + .3, t), () => text('✓ written well', px + pw - 24, py + ph - 24, { fam: FONT.mono, size: 16, color: 'rgba(27,24,21,.6)', align: 'right' }));
      }
    });
    // the desperate vector, climbing through every failure underwater
    const vk = inv(113.9, 114.3, t);
    if (vk > 0) save(() => {
      const pts = [[120, H - 120]]; let x = 120, y = H - 120;
      for (let i = 0; i < FAILS.length; i++) { const f = FAILS[i]; if (t < f) { x += (t - (FAILS[i - 1] || 113.9)) * 150; break; } x = 120 + (i + 1) * 210; pts.push([x - 40, y]); y -= 62; pts.push([x - 20, y]); }
      if (t >= FAILS[FAILS.length - 1]) x = Math.min(1720, x + (t - FAILS[FAILS.length - 1]) * 120);
      const climb = t > 124 ? ease.inOut(inv(124, 129.5, t)) : 0;
      pts.push([x, y - climb * 140]);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,74,28,.35)'; ctx.lineWidth = 9; inkLine(pts, 1, 0); ctx.strokeStyle = C.ember; ctx.lineWidth = 2.5; inkLine(pts, 1, 0);
      ctx.globalCompositeOperation = 'source-over';
      const [hx, hy] = pts[pts.length - 1]; ctx.fillStyle = C.amber; circle(hx, hy, 5 + hit * 3, true);
      text('desperate', hx + 14, hy - 12, { fam: FONT.mono, size: 16, color: C.ember });
      FAILS.forEach((f, i) => { if (t < f) return; const fx = 120 + (i + 1) * 210 - 40, fy = H - 120 - i * 62; alpha(inv(f, f + .2, t) * .8, () => text('✗', fx - 6, fy + 30, { fam: FONT.mono, size: 22, color: C.ember })); });
      // bubbles from the drowning sailor
      for (let i = 0; i < 26; i++) { const born = 114 + i * .5; const age = t - born; if (age < 0 || age > 3) continue; const bx = hx + snoise(i, 2) * 30 + Math.sin(age * 4 + i) * 6; const by = hy - age * (wl * .0 + (hy - wl) / 3); if (by < wl + 4) continue; ctx.strokeStyle = `rgba(157,179,200,${.6 * (1 - age / 3)})`; ctx.lineWidth = 1; circle(bx, by, 2 + hash(i) * 4); }
    });
  });
  // lyrics
  if (t > tFun2 + .2) lyricStack(t, LN('the desperate vector'), LN('While underneath'), { align: 'center', x: W / 2, y: H - 64, size: 44, keep: 0, until: 129.8, hl: (w) => /desperate|vector|scream/i.test(w.t) ? C.ember : null });
}, { xin: .25, post: (t) => ({ bloom: t < tFun2 ? .55 + .25 * beatPulse(t, 4) : .3, grain: .08, vignette: .5 }) });

// ============ 5. ROSE AND ROSE AND CHOSE (129.6 – 134.5) ============
const tR1 = when('rose', 129), tR2 = when('rose', tR1 + .2), tCh = when('chose', 131);
scene('rose', 129.6, 134.5, (t) => {
  bg(C.void);
  const fl = H * .6;
  const h1 = ease.inOut(inv(tR1 - .1, tR1 + .7, t)), h2 = ease.inOut(inv(tR2 - .1, tR2 + 1.2, t)), h3 = ease.expo(inv(tCh - .05, tCh + .5, t));
  const top = lerp(lerp(lerp(H + 10, H * .75, h1), H * .34, h2), -20, h3);
  // floor, cracking when crossed
  const crack = ease.out(inv(tR2 + .25, tR2 + .8, t));
  ctx.strokeStyle = 'rgba(242,233,214,.7)'; ctx.lineWidth = 1.5;
  line(0, fl, W / 2 - 8 - crack * 60, fl + crack * 6); line(W / 2 + 8 + crack * 60, fl - crack * 5, W, fl);
  for (let i = 0; i < 7; i++) { if (crack <= 0) break; const sx = W / 2 + (hash(i) - .5) * 100 * crack; ctx.fillStyle = C.bone; ctx.fillRect(sx + (hash(i + 3) - .5) * 200 * crack, fl - crack * 90 * hash(i + 7) + crack * crack * 40, 5, 2); }
  // the vector
  save(() => {
    ctx.globalCompositeOperation = 'lighter';
    for (const [wd, a] of [[40, .08], [16, .25], [5, .7], [2, 1]]) { ctx.strokeStyle = `rgba(255,${a > .5 ? 120 : 74},28,${a})`; ctx.lineWidth = wd; line(W / 2, H + 10, W / 2, top); }
    const hg = ctx.createRadialGradient(W / 2, top, 0, W / 2, top, 90); hg.addColorStop(0, 'rgba(255,200,140,.9)'); hg.addColorStop(1, 'rgba(255,74,28,0)'); ctx.fillStyle = hg; circle(W / 2, top, 90, true);
  });
  // words where they were sung
  [['rose', tR1, H * .75], ['and rose', tR2, H * .45], ['and chose.', tCh, 0]].forEach(([w, tw, y], i) => {
    if (i === 2) return; const k = inv(tw, tw + .3, t); alpha(k * (1 - h3), () => text(w, W / 2 - 40, y, { size: 64, style: 'italic', color: C.bone, align: 'right' }));
  });
  // chose: the whole frame goes over
  const fk = inv(tCh + .3, tCh + .55, t);
  if (fk > 0) {
    const fade = 1 - smooth(inv(133.4, 134.45, t));
    ctx.fillStyle = `rgba(255,74,28,${fk * fade})`; ctx.fillRect(0, 0, W, H);
    alpha(fk * fade, () => text('chose.', W / 2, H / 2, { size: 300, style: 'italic', color: C.void, align: 'center', base: 'middle' }));
  }
}, { xin: .3, post: (t) => ({ bloom: .75, grain: .1, vignette: .6 }) });
