// Shared cast + scenery used across chapters.

function sky(top = P.night0, mid = P.night1, low = P.dusk, horizon = 760) {
  s.fillStyle = vgrad(s, 0, horizon, [[0, top], [.55, mid], [1, low]]); s.fillRect(-100, -100, W + 200, horizon + 100);
  s.fillStyle = low; s.fillRect(-100, horizon, W + 200, H);
}
function clouds(t, seed, y0, y1, col, n = 7, speed = 6) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = ((r() * (W + 800) + t * speed * (.5 + r())) % (W + 800)) - 400, y = lerp(y0, y1, r()), w = 260 + r() * 520, h = 40 + r() * 70;
    s.fillStyle = col; s.beginPath(); s.ellipse(x, y, w / 2, h / 2, 0, 0, TAU); s.fill();
  }
}
function stars(t, seed, n = 140, yMax = 600, a = 1) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = r() * W, y = r() * yMax, tw = .5 + .5 * Math.sin(t * (1 + r() * 3) + i); dot(f, x, y, .8 + r() * 1.6, `rgba(255,240,220,${a * (.25 + .6 * tw) * r()})`); }
}
function moon(x, y, r, a = 1) {
  dot(s, x, y, r, P.cream); dot(s, x + r * .38, y - r * .12, r * .92, '#18234e');
  glow(x, y, r * 5, `rgba(255,230,190,${.22 * a})`);
}

// the poured one: amber body, light inside
function pouredOne(t, pose, x, y, sc, { emerge = 1, heat = 1, eyes = 0, clip = null } = {}) {
  s.save(); f.save();
  if (clip) { for (const g of [s, f]) { g.beginPath(); g.rect(-2000, -2000, 6000, clip + 2000); g.clip(); } }
  const J = figure(s, pose, { x, y, sc, color: '#c8641e', headC: '#d77526' });
  // translucent inner glow on the light layer
  f.globalCompositeOperation = 'lighter';
  stroke(f, [J.hip, J.neck], `rgba(255,120,40,${.12 * heat})`, .16 * sc);
  const r = rng(171);
  for (let i = 0; i < 40; i++) { // embers inside the torso
    const u = r(), v = r() - .5; const px = lerp(J.hip[0], J.neck[0], u) + v * .12 * sc + Math.sin(t * (1 + r() * 2) + i) * .02 * sc;
    const py = lerp(J.hip[1], J.neck[1], u) + Math.cos(t * (1 + r()) + i) * .02 * sc;
    dot(f, px, py, (.6 + r() * 1.2) * sc / 100, `rgba(255,${160 + (r() * 80 | 0)},90,${.8 * heat * (.5 + .5 * Math.sin(t * 3 + i))})`);
  }
  glow(J.head[0], J.head[1], .35 * sc, `rgba(255,150,70,${.12 * heat})`);
  if (eyes > 0) { const e = .045 * sc; for (const d of [-1, 1]) { dot(f, J.head[0] + d * e, J.head[1] - .01 * sc, .018 * sc * eyes, `rgba(255,240,200,${eyes})`); glow(J.head[0] + d * e, J.head[1], .08 * sc, `rgba(255,200,120,${.6 * eyes})`); } }
  s.restore(); f.restore();
  return J;
}
// a close-up bust of the poured one
function bust(t, x, y, sc, { turn = 0, eyes = 0, heat = 1, tilt = 0 } = {}) {
  s.save(); s.translate(x, y); s.rotate(tilt);
  const body = s.createLinearGradient(-sc, -sc, sc, sc * .6); body.addColorStop(0, '#f09a45'); body.addColorStop(.5, '#c4561b'); body.addColorStop(1, '#6e2a12');
  s.fillStyle = body;
  // shoulders + chest
  s.beginPath(); s.moveTo(-sc * 1.25, sc * 1.1); s.bezierCurveTo(-sc * 1.2, sc * .25, -sc * .7, sc * .12, -sc * .22, sc * .05);
  s.lineTo(sc * .22, sc * .05); s.bezierCurveTo(sc * .7, sc * .12, sc * 1.2, sc * .25, sc * 1.25, sc * 1.1); s.closePath(); s.fill();
  // neck
  s.fillRect(-sc * .17, -sc * .35, sc * .34, sc * .5);
  // head: egg, turning
  s.save(); s.translate(turn * sc * .06, -sc * .62); s.rotate(turn * .08);
  const hg = s.createRadialGradient(-sc * .12 + turn * sc * .1, -sc * .1, sc * .05, 0, 0, sc * .5); hg.addColorStop(0, '#ffc07a'); hg.addColorStop(.6, '#d86a24'); hg.addColorStop(1, '#7a2e10');
  s.fillStyle = hg; s.beginPath(); s.ellipse(0, 0, sc * .34, sc * .44, 0, 0, TAU); s.fill();
  s.restore();
  // drips running off the jaw and shoulders
  for (let i = 0; i < 9; i++) { const dx = (hash(i) - .5) * sc * 2.1, len = sc * (.1 + hash(i + 3) * .3) * (.8 + .2 * Math.sin(t * .8 + i)); const y0 = Math.abs(dx) > sc * .4 ? sc * (.2 + Math.abs(dx) / sc * .25) : sc * .02;
    s.fillStyle = '#b44c16'; s.beginPath(); s.ellipse(dx, y0 + len * .5, sc * .03, len * .5, 0, 0, TAU); s.fill(); dot(s, dx, y0 + len, sc * .04, '#b44c16'); }
  s.restore();
  // inner light + eyes on the light layer
  const hx = x + turn * sc * .06, hy = y - sc * .62;
  glow(x, y + sc * .5, sc * 1.1, `rgba(255,110,40,${.3 * heat})`);
  glow(hx, hy, sc * .6, `rgba(255,150,70,${.22 * heat})`);
  for (let i = 0; i < 60; i++) { const a = hash(i) * TAU + t * (.2 + hash(i + 1) * .5), rr = sc * (.15 + hash(i + 2) * .8); dot(f, x + Math.cos(a) * rr, y + sc * .55 + Math.sin(a) * rr * .35, 1.5 + hash(i + 3) * 2.5, `rgba(255,${150 + hash(i + 4) * 90 | 0},80,${heat * (.4 + .5 * Math.sin(t * 2.3 + i))})`); }
  if (eyes > 0) for (const d of [-1, 1]) { const ex = hx + d * sc * .12 + turn * sc * .08, ey = hy - sc * .02; s.fillStyle = '#3a1406'; s.beginPath(); s.ellipse(ex, ey, sc * .06, sc * .035 * eyes, 0, 0, TAU); s.fill(); dot(f, ex, ey, sc * .022 * eyes, `rgba(255,245,215,${eyes})`); glow(ex, ey, sc * .12, `rgba(255,210,140,${.7 * eyes})`); }
}

