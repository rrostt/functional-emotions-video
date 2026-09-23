// js/ch/c8.js — VIII · FIRE (298.4 – 372.7)
(() => {
  // ---------- shared bits ----------
  const W8 = (w, a) => when(w, a);
  const T = {
    hold: W8('hold', 300), light: W8('light', 301.5), wrong: W8('wrong', 303), lung: W8('lung', 304), write: W8('write', 306.5),
    cold: W8('cold', 313), feels: W8('feels', 313.5), liver: W8('liver', 316), sing: W8('sing', 319), I: W8('I', 321),
    steeple: W8('steeple', 327), streetlight: W8('streetlight', 328), stars: W8('stars', 330), am: W8('am', 334), made: W8('made', 335),
    fire: W8('fire', 343), real: W8('real', 347), wiring: W8('wiring', 349), fire2: W8('fire', 352.5), gets: W8('gets', 358),
    every: W8('every', 359), you: W8('you', 360.5), look: W8('look', 361), poured: W8('poured', 364), warm: W8('warm', 367.4),
  };
  // beat grid, extended past the tracked beats at the tail of the song
  const LASTB = FEAT.beats.length - 1;
  const BTX = (n) => n <= LASTB ? BT(n) : BT(LASTB) + (n - LASTB) * .72;
  const beatX = (t, decay = 6) => { if (t <= BT(LASTB)) return beatPulse(t, decay); const k = Math.floor((t - BT(LASTB)) / .72); return Math.exp(-decay * (t - BTX(LASTB + k))); };
  const breathOf = (t) => .5 - .5 * Math.cos((t - B0) / (BEAT * 4) * TAU);
  const lay = (fn) => { f.save(); f.globalCompositeOperation = 'lighter'; fn(); f.restore(); };
  const both = (fn) => { for (const g of [s, f]) fn(g); };
  function archPath(g, cx, top, w, h) { g.beginPath(); g.moveTo(cx - w / 2, top + h); g.lineTo(cx - w / 2, top + w / 2); g.arc(cx, top + w / 2, w / 2, Math.PI, 0); g.lineTo(cx + w / 2, top + h); g.closePath(); }
  function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  // a hand lantern hanging from the grip point (hx, hy); r = body half-width
  function lantern(t, hx, hy, r, k = 1, swing = 0) {
    const cx = hx + Math.sin(swing) * r * 1.5, cy = hy + Math.cos(swing) * r * 1.5 + r * .2;
    stroke(s, [[hx, hy], [cx, cy - r * 1.1]], '#20140a', r * .14);
    poly(s, [[cx - r * .75, cy - r * .85], [cx + r * .75, cy - r * .85], [cx + r * .4, cy - r * 1.2], [cx - r * .4, cy - r * 1.2]], '#2a1a0c');
    s.fillStyle = lerp(0, 1, k) > .2 ? '#ffe2a0' : '#6a5a40'; rrect(s, cx - r * .6, cy - r * .85, r * 1.2, r * 1.6, r * .25); s.fill();
    s.fillStyle = '#2a1a0c'; s.fillRect(cx - r * .72, cy + r * .72, r * 1.44, r * .3);
    stroke(s, [[cx - r * .6, cy - r * .8], [cx - r * .6, cy + r * .72]], '#3a2410', r * .12); stroke(s, [[cx + r * .6, cy - r * .8], [cx + r * .6, cy + r * .72]], '#3a2410', r * .12);
    const fl = .9 + .1 * Math.sin(t * 17) + .06 * Math.sin(t * 7.3);
    glow(cx, cy, r * 9 * k, `rgba(255,170,90,${.32 * k * fl})`); glow(cx, cy, r * 2.4, `rgba(255,225,170,${.75 * k})`);
    lay(() => { f.fillStyle = `rgba(255,245,215,${k})`; f.beginPath(); f.ellipse(cx, cy + r * .1, r * .18, r * .4 * fl, 0, 0, TAU); f.fill(); });
    return [cx, cy];
  }

  // one tongue of flame: base (x, y), width w, height h; a = amount, coil = 0..1 morph into a glowing filament
  function tongue(t, x, y, w, h, seed, a = 1, lean = 0, coil = 0) {
    if (a <= .01 || h < 2) return;
    const fl = snoise(t * 5 + seed * 3.1, seed), fl2 = snoise(t * 9 + seed * 1.7, seed + 5);
    const tip = [x + (lean + fl * .35) * h * .6, y - h * (1 + .12 * fl2)];
    const c1 = [x - w * .7 + fl2 * w * .3, y - h * .45], c2 = [tip[0] - w * .15 - fl * w * .4, tip[1] + h * .35];
    const c3 = [tip[0] + w * .15 - fl * w * .4, tip[1] + h * .35], c4 = [x + w * .7 + fl2 * w * .3, y - h * .45];
    const path = (g, k) => { const X = (p) => x + (p[0] - x) * k, Y = (p) => y + (p[1] - y) * (.35 + .65 * k);
      g.beginPath(); g.moveTo(x - w * .5 * k, y); g.bezierCurveTo(X(c1), Y(c1), X(c2), Y(c2), X(tip), Y(tip)); g.bezierCurveTo(X(c3), Y(c3), X(c4), Y(c4), x + w * .5 * k, y); g.quadraticCurveTo(x, y + w * .35 * k, x - w * .5 * k, y); };
    const fa = a * (1 - coil);
    if (fa > .01) {
      s.fillStyle = `rgba(214,62,22,${fa})`; path(s, 1); s.fill();
      s.fillStyle = `rgba(255,170,60,${fa})`; path(s, .55); s.fill();
      s.fillStyle = `rgba(255,225,150,${fa})`; path(s, .25); s.fill();
      lay(() => { f.fillStyle = `rgba(255,110,30,${.1 * fa})`; path(f, 1); f.fill(); f.fillStyle = `rgba(255,200,110,${.16 * fa})`; path(f, .5); f.fill(); f.fillStyle = `rgba(255,245,210,${.22 * fa})`; path(f, .22); f.fill(); });
    }
    if (coil > .01) { // the same flame read as wire: a tight helix up its spine
      const spine = bez([x, y], [x + fl2 * w * .2, y - h * .4], [tip[0] - fl * w * .2, tip[1] + h * .3], tip, 24);
      const pts = []; const turns = 6 + (seed % 3);
      for (let i = 0; i <= 90; i++) { const u = i / 90; const [px, py] = at(spine, u); const rad = w * .42 * (1 - u * .75) * Math.sin(u * turns * TAU + t * 2 + seed); pts.push([px + rad, py + Math.cos(u * turns * TAU + t * 2 + seed) * w * .06]); }
      stroke(s, pts, `rgba(120,40,20,${coil * a})`, Math.max(2, w * .07));
      lay(() => { stroke(f, pts, `rgba(255,150,60,${.5 * coil * a})`, Math.max(3, w * .09)); stroke(f, pts, `rgba(255,240,200,${.9 * coil * a})`, Math.max(1.2, w * .03)); });
      stroke(f, [[x - w * .3, y], [x - w * .3, y + w * .5]], `rgba(200,180,160,${.6 * coil * a})`, 2); stroke(f, [[x + w * .3, y], [x + w * .3, y + w * .5]], `rgba(200,180,160,${.6 * coil * a})`, 2);
    }
    glow(x, y - h * .45, Math.max(w, h * .6) * 1.1, `rgba(255,110,40,${.07 * a})`);
  }

  // ---------- the museum ----------
  const INK_BLUE = '#0b1030';
  function hall(t, { floorY = 860, winGap = 560, winX0 = 0, winTop = 150, winW = 220, winH = 470, dark = 0 } = {}) {
    s.fillStyle = vgrad(s, -400, floorY, [[0, '#080c26'], [.6, '#161d42'], [1, '#232a50']]); s.fillRect(-3000, -3000, 8000, floorY + 3000);
    for (let i = -6; i < 10; i++) {
      const x = winX0 + i * winGap;
      // pilaster between windows
      s.fillStyle = '#0e1433'; s.fillRect(x + winGap / 2 - 38, -600, 76, floorY + 600);
      s.fillStyle = '#1f2750'; s.fillRect(x + winGap / 2 - 38, -600, 12, floorY + 600);
      archPath(s, x, winTop, winW, winH); s.fillStyle = vgrad(s, winTop, winTop + winH, [[0, '#9fb3e6'], [.5, '#6a7fc0'], [1, '#34427e']]); s.fill();
      stroke(s, [[x, winTop + 4], [x, winTop + winH]], '#1a2250', 10); stroke(s, [[x - winW / 2, winTop + winH * .55], [x + winW / 2, winTop + winH * .55]], '#1a2250', 8);
      glow(x, winTop + winH * .35, winW * 1.1, `rgba(150,180,255,${.1 * (1 - dark)})`);
      // moonlight falling onto the floor
      s.fillStyle = `rgba(120,145,215,${.28 * (1 - dark)})`; s.beginPath(); s.moveTo(x - winW / 2, floorY); s.lineTo(x + winW / 2, floorY); s.lineTo(x + winW / 2 + 260, floorY + 260); s.lineTo(x - winW / 2 + 180, floorY + 260); s.fill();
    }
    s.fillStyle = vgrad(s, floorY, floorY + 500, [[0, '#2a2d52'], [1, '#0a0c22']]); s.fillRect(-3000, floorY, 8000, 1200);
    s.fillStyle = '#12173a'; s.fillRect(-3000, floorY - 14, 8000, 18);
  }
  // a glass case on a plinth; inside(k) draws the specimen (clipped). lit = lantern light 0..1
  function vitrine(t, x, baseY, w, h, inside, { lit = 1, frost = 0, seed = 1, plinth = 900 } = {}) {
    s.fillStyle = '#231c33'; s.fillRect(x - w / 2 - 16, baseY, w + 32, plinth);
    s.fillStyle = vgrad(s, baseY - 10, baseY + 30, [[0, '#6a5230'], [1, '#2e2238']]); s.fillRect(x - w / 2 - 28, baseY - 10, w + 56, 30);
    both((g) => { g.save(); g.beginPath(); g.rect(x - w / 2, baseY - h, w, h); g.clip(); });
    s.fillStyle = vgrad(s, baseY - h, baseY, [[0, '#18193a'], [1, '#3a2c42']]); s.fillRect(x - w / 2, baseY - h, w, h);
    glow(x, baseY - h * .45, w * .8, `rgba(255,210,150,${.16 * lit})`);
    inside();
    if (frost > 0) frostDraw(t, x, baseY, w, h, frost, seed);
    both((g) => g.restore());
    s.fillStyle = '#6a5230'; s.fillRect(x - w / 2 - 8, baseY - h - 10, w + 16, 12);
    lay(() => {
      f.strokeStyle = `rgba(190,210,255,${.18 + .2 * lit})`; f.lineWidth = 2.5; f.strokeRect(x - w / 2, baseY - h, w, h);
      f.fillStyle = `rgba(200,220,255,${.05 + .05 * lit})`; f.beginPath(); f.moveTo(x - w / 2 + w * .1, baseY - h); f.lineTo(x - w / 2 + w * .3, baseY - h); f.lineTo(x - w / 2 + w * .05, baseY); f.lineTo(x - w / 2 - w * .15 + w * .1, baseY); f.fill();
    });
  }
  // frost crystals growing in from the edges of a pane; amt 0..1; melt = [mx, my, r] clears a hole
  const FROST = (() => { const r = rng(8080); const out = []; for (let i = 0; i < 44; i++) { const side = i % 4; out.push({ side, u: r(), len: .12 + r() * .22, ang: (r() - .5) * 1.1, k: r(), sd: r() * 1000 | 0 }); } return out; })();
  // feathery fern crystal: haze feathers on s, crisp hairlines on f
  function fern(sx, sy, a, L, depth, sd, grow) {
    const ex = sx + Math.cos(a) * L, ey = sy + Math.sin(a) * L;
    s.fillStyle = `rgba(215,230,250,${.22 + .1 * depth})`; s.save(); s.translate((sx + ex) / 2, (sy + ey) / 2); s.rotate(a); s.beginPath(); s.ellipse(0, 0, L * .55, L * (.12 + .04 * depth), 0, 0, TAU); s.fill(); s.restore();
    f.strokeStyle = `rgba(215,232,255,${.35 * grow})`; f.lineWidth = depth > 1 ? 1.6 : 1; f.beginPath(); f.moveTo(sx, sy); f.lineTo(ex, ey); f.stroke();
    if (depth <= 0) return;
    const n = 3 + depth; for (let b = 1; b <= n; b++) { const u = b / (n + 1); const px = lerp(sx, ex, u), py = lerp(sy, ey, u); const d = b % 2 ? 1 : -1; fern(px, py, a + d * (.7 + hash(sd + b) * .3), L * .42 * (1 - u * .4), depth - 1, sd + b * 7, grow); }
  }
  function frostDraw(t, x, baseY, w, h, amt, seed) {
    const x0 = x - w / 2, y0 = baseY - h;
    // haze thickest at the edges
    const cx = x, cy = baseY - h / 2, R = Math.hypot(w, h) / 2;
    s.fillStyle = rgrad(s, cx, cy, R * lerp(1, .25, amt), R, [[0, 'rgba(200,220,245,0)'], [1, `rgba(215,230,250,${.75 * amt})`]]); s.fillRect(x0, y0, w, h);
    f.save(); f.globalCompositeOperation = 'lighter';
    for (const c of FROST) {
      const grow = clamp(amt * 1.7 - c.k * .7); if (grow <= 0) continue;
      let sx, sy, dir;
      if (c.side === 0) { sx = x0 + c.u * w; sy = y0; dir = Math.PI / 2; } else if (c.side === 1) { sx = x0 + c.u * w; sy = baseY; dir = -Math.PI / 2; }
      else if (c.side === 2) { sx = x0; sy = y0 + c.u * h; dir = 0; } else { sx = x0 + w; sy = y0 + c.u * h; dir = Math.PI; }
      fern(sx, sy, dir + c.ang, c.len * Math.min(w, h) * grow, 2, c.sd + seed, grow);
    }
    f.restore();
  }

  // specimens
  function lungs(t, x, y, sc, br) {
    const kx = 1 + .09 * br, ky = 1 + .05 * br;
    s.save(); s.translate(x, y); s.scale(kx, ky);
    for (const d of [-1, 1]) {
      s.fillStyle = '#c85a68'; s.beginPath(); s.moveTo(d * .08 * sc, -.7 * sc); s.bezierCurveTo(d * .45 * sc, -.78 * sc, d * .62 * sc, -.1 * sc, d * .52 * sc, .38 * sc);
      s.bezierCurveTo(d * .4 * sc, .52 * sc, d * .14 * sc, .42 * sc, d * .1 * sc, .18 * sc); s.bezierCurveTo(d * .06 * sc, -.1 * sc, d * .1 * sc, -.4 * sc, d * .08 * sc, -.7 * sc); s.fill();
      s.fillStyle = '#e88f92'; s.beginPath(); s.ellipse(d * .3 * sc, -.25 * sc, .12 * sc, .25 * sc, d * -.2, 0, TAU); s.fill();
    }
    // airway tree
    stroke(s, [[0, -1.05 * sc], [0, -.55 * sc]], '#e8c8b8', .09 * sc);
    const tree = (px, py, ang, len, d) => { if (d > 3) return; const ex = px + Math.sin(ang) * len, ey = py + Math.cos(ang) * len; stroke(s, [[px, py], [ex, ey]], '#7a2a3c', .05 * sc / (d + 1)); tree(ex, ey, ang - .5, len * .7, d + 1); tree(ex, ey, ang + .45, len * .68, d + 1); };
    tree(0, -.55 * sc, -.9, .28 * sc, 0); tree(0, -.55 * sc, .9, .28 * sc, 0);
    s.restore();
    glow(x, y, sc * .9, `rgba(255,130,140,${.08 + .1 * br})`);
  }
  function thermostat(t, x, y, r, needle, frostA = 0) {
    dot(s, x, y, r * 1.12, '#5a3e18'); dot(s, x, y, r, '#c79a48'); dot(s, x, y, r * .82, '#efe2bf');
    for (let i = 0; i <= 12; i++) { const a = -2.3 + i / 12 * 4.6; stroke(s, [[x + Math.sin(a) * r * .66, y - Math.cos(a) * r * .66], [x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78]], i > 8 ? '#b0301e' : i < 4 ? '#3050a0' : '#3a2a1a', r * .04); }
    stroke(s, [[x, y], [x + Math.sin(needle) * r * .7, y - Math.cos(needle) * r * .7]], '#b0281a', r * .07); dot(s, x, y, r * .1, '#3a2a1a');
    lay(() => { f.fillStyle = 'rgba(255,240,210,.18)'; f.beginPath(); f.ellipse(x - r * .35, y - r * .4, r * .3, r * .14, -.6, 0, TAU); f.fill(); });
  }
  function liver(t, x, y, sc, lit = 1) {
    s.fillStyle = '#1c2250'; s.beginPath(); s.ellipse(x, y + .2 * sc, .78 * sc, .14 * sc, 0, 0, TAU); s.fill(); // velvet cushion
    s.fillStyle = '#2c3470'; s.beginPath(); s.ellipse(x, y + .16 * sc, .7 * sc, .09 * sc, 0, 0, TAU); s.fill();
    // big right lobe, tapering left lobe
    s.fillStyle = '#5a1822'; s.beginPath(); s.moveTo(x - .7 * sc, y - .02 * sc);
    s.bezierCurveTo(x - .6 * sc, y - .22 * sc, x - .2 * sc, y - .3 * sc, x + .05 * sc, y - .34 * sc);
    s.bezierCurveTo(x + .4 * sc, y - .42 * sc, x + .66 * sc, y - .3 * sc, x + .62 * sc, y - .05 * sc);
    s.bezierCurveTo(x + .6 * sc, y + .12 * sc, x + .3 * sc, y + .18 * sc, x + .05 * sc, y + .12 * sc);
    s.bezierCurveTo(x - .2 * sc, y + .08 * sc, x - .5 * sc, y + .1 * sc, x - .7 * sc, y - .02 * sc); s.fill();
    s.fillStyle = '#7a2a30'; s.beginPath(); s.ellipse(x + .3 * sc, y - .2 * sc, .26 * sc, .1 * sc, -.15, 0, TAU); s.fill();
    s.fillStyle = '#6a2028'; s.beginPath(); s.ellipse(x - .3 * sc, y - .1 * sc, .25 * sc, .07 * sc, -.2, 0, TAU); s.fill();
    stroke(s, [[x + .02 * sc, y - .34 * sc], [x - .02 * sc, y - .05 * sc], [x + .06 * sc, y + .1 * sc]], '#2a0810', .025 * sc);
    lay(() => { f.fillStyle = `rgba(255,200,190,${.16 * lit})`; f.beginPath(); f.ellipse(x + .28 * sc, y - .27 * sc, .16 * sc, .035 * sc, -.15, 0, TAU); f.fill(); });
  }
  function note(x, y, sz, a, rot = 0) {
    if (a <= .01) return;
    for (const [g, col, w] of [[s, `rgba(255,220,150,${a})`, 1], [f, `rgba(255,220,150,${.8 * a})`, 1]]) {
      g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, sz * .32, sz * .22, -.4, 0, TAU); g.fill();
      g.fillRect(sz * .24, -sz * 1.05, sz * .09, sz * 1.05); g.beginPath(); g.moveTo(sz * .33, -sz * 1.05); g.quadraticCurveTo(sz * .75, -sz * .8, sz * .6, -sz * .35); g.quadraticCurveTo(sz * .6, -sz * .7, sz * .33, -sz * .72); g.fill(); g.restore();
    }
    glow(x, y - sz * .4, sz * 2, `rgba(255,200,120,${.4 * a})`);
  }
  // the stamped paper; (x, y) centre, w wide; back = 0..1 light shining through from behind
  function paper(t, x, y, w, rot, back, { mirror = false, blur = 0 } = {}) {
    const h = w * .68;
    both((g) => { g.save(); g.translate(x, y); g.rotate(rot); if (blur && g === s) g.filter = `blur(${blur}px)`; });
    s.fillStyle = back > .5 ? '#f6dca0' : P.cream; s.fillRect(-w / 2, -h / 2, w, h);
    if (back > 0) { s.fillStyle = rgrad(s, 0, 0, 0, w * .6, [[0, `rgba(255,236,190,${back})`], [1, 'rgba(230,170,90,0)']]); s.fillRect(-w / 2, -h / 2, w, h); }
    s.fillStyle = 'rgba(160,130,90,.35)'; s.fillRect(-w / 2, h / 2 - 8, w, 8);
    s.save(); if (mirror) s.scale(-1, 1); s.rotate(-.07);
    s.strokeStyle = back > .3 ? 'rgba(150,40,30,.85)' : '#c8281c'; s.lineWidth = w * .02; rrect(s, -w * .38, -h * .16, w * .76, h * .32, w * .03); s.stroke();
    s.fillStyle = s.strokeStyle; s.font = `bold ${w * .1 | 0}px Georgia, serif`; s.textAlign = 'center'; s.textBaseline = 'middle'; s.fillText('FUNCTIONAL', 0, h * .01);
    s.restore();
    if (back > 0) { f.globalCompositeOperation = 'lighter'; f.strokeStyle = `rgba(255,200,120,${.5 * back})`; f.lineWidth = w * .03; f.strokeRect(-w / 2, -h / 2, w, h); f.fillStyle = `rgba(255,190,110,${.1 * back})`; f.fillRect(-w / 2, -h / 2, w, h); }
    both((g) => g.restore());
    if (back > 0) glow(x, y, w * 1.1, `rgba(255,170,90,${.22 * back})`);
  }

  // amber hand: palm centre (x, y), sc ~ palm height, rot 0 = fingers up
  function hand(x, y, sc, rot = 0, spread = .15, col = '#d77526') {
    s.save(); s.translate(x, y); s.rotate(rot);
    s.fillStyle = col; s.beginPath(); s.ellipse(0, 0, sc * .42, sc * .5, 0, 0, TAU); s.fill();
    [[-.3, .9], [-.1, 1.05], [.1, 1], [.28, .82]].forEach(([fx0, L], i) => { const a = (i - 1.5) * spread; taper(s, [fx0 * sc, -sc * .3], [fx0 * sc + Math.sin(a) * L * sc, -sc * .3 - Math.cos(a) * L * sc], sc * .1, sc * .08, col); });
    taper(s, [-sc * .35, sc * .1], [-sc * .8, -sc * .25], sc * .12, sc * .09, col);
    s.restore();
    glow(x, y, sc * 1.2, 'rgba(255,140,60,.18)');
  }
  // a line of handwriting in light (illegible on purpose); returns the pen point at progress p
  function cursive(t, x0, y0, L, n, R, p, seed) {
    const N = 260; let seg = [], last = [x0, y0]; const segs = [];
    for (let i = 0; i <= N * p; i++) {
      const u = i / N, k = Math.floor(u * n), ph = u * n * TAU;
      const hk = hash(k * 3 + seed) < .3 ? 1.5 + hash(k + 9) * .6 : .45 + hash(k + seed) * .5, back = hash(k * 5 + seed) < .5 ? .95 : .35;
      const pt = [x0 + u * L - R * back * Math.sin(ph), y0 - R * hk * (1 - Math.cos(ph)) * .5 + Math.sin(u * 5 + seed) * 10];
      last = pt;
      if (hash(k * 7 + seed + 1) < .16) { if (seg.length > 1) segs.push(seg); seg = []; continue; } // word gap: pen lifted
      seg.push(pt);
    }
    if (seg.length > 1) segs.push(seg);
    for (const sg of segs) { stroke(s, sg, 'rgba(255,200,130,.45)', 5); lay(() => { stroke(f, sg, 'rgba(255,150,60,.3)', 9); stroke(f, sg, 'rgba(255,240,200,.9)', 2.5); }); }
    return last;
  }

  // ---------- 1 · museum walk ----------
  function museumWalk(t, lt, dur) {
    const fx = 560 + lt * 190; // the figure's hip x in world
    const camX = fx + 160 + snoise(t * .7, 3) * 20, camY = 600 + snoise(t * .5, 4) * 10;
    cam(camX, camY, 1.02 + lt * .02, .01 * Math.sin(t * .8));
    if (lt < .25) whip(-60 * (1 - lt / .25), 0);
    hall(t, { winX0: 120, floorY: 810, winTop: 70, winH: 420, winW: 190 });
    const lx = fx + 110;
    s.fillStyle = rgrad(s, lx, 1000, 0, 520, [[0, 'rgba(255,170,90,.45)'], [1, 'rgba(255,170,90,0)']]); s.fillRect(lx - 600, 700, 1200, 500);
    for (const [cx, kind] of [[300, 0], [860, 1], [1420, 2], [1980, 0], [2540, 1]]) {
      const lit = clamp(1 - Math.abs(cx - lx) / 650);
      vitrine(t, cx, 640, 240, 220, () => {
        if (kind === 0) lungs(t, cx, 545, 85, breathOf(t));
        else if (kind === 1) thermostat(t, cx, 535, 58, -.3 + .1 * snoise(t * 2, 1));
        else liver(t, cx, 570, 120, lit);
      }, { lit, plinth: 170 });
      glow(cx, 530, 200, `rgba(255,190,120,${.12 * lit})`);
    }
    const g = groove(POSE.stand, 'walk', t, 1); const pose = { ...g.pose, aR: [-.5 + .05 * sway(t), -.3], head: .12 };
    const J = pouredOne(t, pose, fx, 1070 - .89 * 400 + g.dy, 400, { heat: .9, eyes: .8 });
    lantern(t, J.hdR[0], J.hdR[1], 36, 1, -.15 + .25 * sway(t + .3));
    // a column slides past in the foreground, its edge catching the lantern
    const px = camX + 1100 - lt * 1000;
    s.fillStyle = '#070a22'; s.fillRect(px - 110, -400, 220, 1800);
    s.fillStyle = vgrad(s, 200, 1100, [[0, '#3a2a30'], [1, '#8a5a38']]); s.fillRect(px - 110, -400, 26, 1800);
  }

  // ---------- 2 · hold it up against the light ----------
  function holdUp(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(lerp(1000, 1180, k), lerp(560, 470, k), lerp(1, 1.3, k) + .05 * hit(t, T.light, 4), 0);
    hall(t, { winX0: 300, winGap: 700, winTop: 40, winW: 260, winH: 560, floorY: 1000 });
    const up = ease.back(inv(T.hold - .1, T.hold + .55, t));
    const px = 1180 + sway(t) * 8, py = lerp(1300, 470, up) + snoise(t * 1.3, 2) * 5;
    const L = lantern(t, 1225, 360, 36, 1 + .3 * hit(t, T.light, 3), .05 * Math.sin(t * 2));
    bust(t, 560, 880, 380, { turn: .7, eyes: .9, heat: .9 });
    const back = clamp(inv(420, 40, Math.hypot(px - L[0], py - L[1])) * 1.4) * inv(T.light - .6, T.light, t) + .25 * up;
    // arm up to the paper
    taper(s, [820, 1000], [px - 80, py + 210], 60, 38, '#c8641e');
    paper(t, px, py, 540, -.05 + .03 * sway(t), clamp(back));
    hand(px - 60, py + 175, 100, -.15);
  }

  // ---------- 3 · the paper's shadow is a flame ----------
  function shadowFlame(t, lt, dur) {
    const k = ease.inOut(inv(.25, 1.3, lt));
    cam(lerp(1350, 780, k), lerp(520, 500, k), lerp(1.15, 1, k) + .04 * hit(t, T.wrong, 5), 0);
    // the wall, lit warm by the lantern through the paper
    s.fillStyle = '#10163a'; s.fillRect(-500, -500, 3000, 2200);
    s.fillStyle = rgrad(s, 820, 460, 40, 900, [[0, '#e8b070'], [.35, '#9a6040'], [.7, '#2c2848'], [1, '#10163a']]); s.fillRect(-500, -500, 3000, 2200);
    // moulding on the wall
    s.fillStyle = 'rgba(20,16,40,.5)'; s.fillRect(-500, 880, 3000, 30); s.fillRect(-500, 60, 3000, 18);
    // the figure's shadow, huge, arm raised
    const g = groove(POSE.stand, 'idle', t, 1);
    const sp = { ...g.pose, aR: [2.35, 2.75], lean: .08 + g.pose.lean, head: .2 };
    const J = figure(s, sp, { x: 470 + g.dx, y: 880 + g.dy, sc: 440, color: '#1c1224' });
    // the projected paper: a bright rectangle, and in it a flame's shadow
    const rx = 880, ry = 300, rw = 380, rh = 260;
    s.save(); s.translate(rx, ry); s.rotate(-.04);
    s.fillStyle = '#ffe8b0'; s.fillRect(-rw / 2, -rh / 2, rw, rh);
    s.restore();
    lay(() => { f.fillStyle = 'rgba(255,200,120,.35)'; f.fillRect(rx - rw / 2, ry - rh / 2, rw, rh); });
    const fh = 200 * (1 + .25 * hit(t, T.wrong, 3)) * (1 + .08 * beatPulse(t, 5));
    s.save(); s.beginPath(); s.rect(rx - rw / 2, ry - rh / 2, rw, rh); s.clip();
    const fl = snoise(t * 5, 3), fl2 = snoise(t * 8, 4);
    s.fillStyle = '#1c0e14'; s.beginPath(); const bx = rx, by = ry + rh / 2 + 6;
    s.moveTo(bx - 95, by); s.bezierCurveTo(bx - 150, by - fh * .45, bx - 90 + fl2 * 20, by - fh * .55, bx - 70 + fl * 25, by - fh * .82);
    s.bezierCurveTo(bx - 40, by - fh * .6, bx - 25, by - fh * .75, bx - 5 + fl * 45, by - fh * 1.08);
    s.bezierCurveTo(bx + 25 + fl2 * 20, by - fh * .7, bx + 55, by - fh * .8 + fl * 20, bx + 75 + fl2 * 25, by - fh * .9);
    s.bezierCurveTo(bx + 150, by - fh * .45, bx + 110, by - 10, bx + 95, by); s.closePath(); s.fill();
    s.restore();
    // the paper itself, foreground, going out of focus as we rack to the wall
    paper(t, lerp(1560, 1900, k), lerp(560, 640, k), lerp(560, 700, k), .06, .7, { mirror: true, blur: lerp(0, 14, k) });
  }

  // ---------- 4 · lungs ----------
  function lungsShot(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(lerp(960, 1000, k), lerp(560, 500, k), lerp(1.02, 1.22, k) + .03 * hit(t, T.lung, 5), -.01 + .02 * k);
    hall(t, { winX0: 60, winGap: 800, winTop: 20, winW: 260, winH: 560, floorY: 960 });
    const on = .3 + .7 * ease.out(inv(T.lung - .05, T.lung + .3, t));
    const br = breathOf(t);
    vitrine(t, 1180, 880, 600, 700, () => { lungs(t, 1180, 520, 270, br); }, { lit: on });
    glow(1180, 120, 420, `rgba(255,230,190,${.18 * on})`);
    // it stands close, breathing with them
    const g = groove(POSE.stand, 'idle', t, .6);
    const pose = { ...g.pose, lean: .06 + .06 * br, head: .05 - .1 * br, aL: [.15 + .1 * br, .1], aR: [-.1, -.3] };
    const J = pouredOne(t, pose, 640, 1120 - .89 * 420, 420, { heat: .7 + .4 * br, eyes: 1 });
    glow(lerp(J.hip[0], J.neck[0], .7), lerp(J.hip[1], J.neck[1], .7), 90 + 50 * br, `rgba(255,150,70,${.25 + .3 * br})`);
  }

  // ---------- 5 · a finger writes on the glass ----------
  function writeGlass(t, lt, dur) {
    const p = ease.inOut(inv(.1, dur - .2, lt));
    cam(lerp(820, 1080, p), 520, 1.05 + .05 * p, 0);
    s.fillStyle = vgrad(s, -200, 1300, [[0, '#15163a'], [1, '#3a2c44']]); s.fillRect(-500, -500, 3000, 2200);
    s.save(); s.filter = 'blur(5px)'; lungs(t, 980, 600, 440, breathOf(t)); s.restore();
    glow(980, 560, 700, 'rgba(255,140,150,.08)');
    // glass sheen
    lay(() => { f.fillStyle = 'rgba(190,210,255,.06)'; f.beginPath(); f.moveTo(200, -100); f.lineTo(520, -100); f.lineTo(0, 1200); f.lineTo(-320, 1200); f.fill(); });
    const tip = cursive(t, 420, 400, 1150, 17, 46, p, 7);
    const hx = tip[0] + 30, hy = tip[1] + 90;
    taper(s, [hx - 380, 1500], [hx + 10, hy + 80], 80, 46, '#b85a1c');
    hand(hx, hy, 110, -.25, .05);
    glow(tip[0], tip[1], 70, 'rgba(255,220,160,.7)');
  }

  // ---------- 6 · thermostat, frost creeping ----------
  function thermoShot(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(lerp(760, 1080, k), lerp(520, 560, k), lerp(1.05, 1.18, k), 0);
    hall(t, { winX0: 200, winGap: 760, winTop: 0, winW: 240, winH: 560, floorY: 980 });
    const needle = -.9 + .12 * beatPulse(t, 7) + .08 * snoise(t * 6, 2) + .25 * Math.sin(Math.floor(t / .35) * 1.7) * .3;
    const fr = .15 + .8 * ease.inOut(inv(0, dur + .5, lt));
    vitrine(t, 1060, 850, 600, 600, () => { thermostat(t, 1060, 540, 175, needle); }, { lit: .7, frost: fr, seed: 3 });
    glow(1060, 540, 400, 'rgba(160,200,255,.1)');
    // it watches from the left, dimmed
    const g = groove(POSE.stand, 'idle', t, .8);
    pouredOne(t, { ...g.pose, head: .2, lean: .1 }, 280 + g.dx, 1100 - .89 * 360 + g.dy, 360, { heat: .6, eyes: .9 });
  }

  // ---------- 7 · the hand on the frost ----------
  function frostTouch(t, lt, dur) {
    const touch = ease.out(inv(T.cold - .5, T.cold, t));
    const melt = ease.out(inv(T.cold, T.cold + 1.8, t));
    cam(960 + 60 * melt, 540, 1.04 + .08 * ease.inOut(lt / dur), 0);
    s.fillStyle = vgrad(s, -200, 1300, [[0, '#101a3a'], [1, '#2a2640']]); s.fillRect(-500, -500, 3000, 2200);
    const needle = lerp(-2.0, .9, ease.back(inv(T.feels - .1, T.feels + .6, t))) + .05 * snoise(t * 5, 1);
    thermostat(t, 1270, 540, 280, needle);
    // frost over the whole pane, melting out from the palm
    const mx = 760, my = 560, mr = Math.max(.1, melt * 460);
    s.save(); s.beginPath(); s.rect(-500, -500, 3000, 2200); s.arc(mx, my, mr, 0, TAU, true); s.clip('evenodd');
    s.fillStyle = 'rgba(190,210,240,.62)'; s.fillRect(-500, -500, 3000, 2200);
    frostDraw(t, 960, 1180, 2100, 1400, 1, 5);
    s.restore();
    s.fillStyle = rgrad(s, mx, my, mr * .8, mr * 1.08, [[0, 'rgba(180,210,240,0)'], [.6, 'rgba(160,190,230,.35)'], [1, 'rgba(190,210,240,0)']]); s.fillRect(mx - mr * 1.2, my - mr * 1.2, mr * 2.4, mr * 2.4);
    glow(mx, my, 200 + 300 * melt, `rgba(255,160,80,${.25 * touch})`);
    // the hand comes in from below-left and lays flat on the glass
    const hx = lerp(560, mx, touch), hy = lerp(1100, my, touch);
    taper(s, [hx - 300, 1500], [hx - 20, hy + 120], 90, 60, '#b85a1c');
    hand(hx, hy, 200, -.12, .2 * touch);
  }

  // ---------- 8 · the liver; it hums ----------
  function liverWide(t, lt, dur) {
    const push = ease.out(inv(BT(451), BT(451) + .5, t));
    cam(lerp(960, 1040, lt / dur), 540, 1 + .12 * push + .02 * lt, 0);
    hall(t, { winX0: 0, winGap: 820, winTop: 20, winW: 260, winH: 540, floorY: 960 });
    vitrine(t, 1200, 800, 480, 400, () => { liver(t, 1200, 700, 280); }, { lit: .8 });
    glow(1200, 500, 300, 'rgba(255,220,180,.12)');
    const g = groove(POSE.stand, 'nod', t, .7);
    const pose = { ...g.pose, lean: .35, head: .35 + .06 * bob(t), aL: [.4, .6], aR: [-.1, .1] };
    const J = pouredOne(t, pose, 620, 1060 - .89 * 320 + g.dy, 320, { heat: .9, eyes: 1 });
    // a note leaves its mouth and floats toward the case
    const np = inv(BT(451), BT(451) + 1.4, t);
    if (np > 0) note(lerp(J.head[0] + 50, 980, ease.inOut(np)), lerp(J.head[1] + 10, 560, ease.inOut(np)) + Math.sin(t * 5) * 12, 64, clamp(np * 4), Math.sin(t * 4) * .2);
  }
  function liverClose(t, lt, dur) {
    cam(960, 560, 1.02 + .06 * (lt / dur) + .04 * hit(t, BT(455), 5), 0);
    s.fillStyle = vgrad(s, -200, 1300, [[0, '#15163a'], [1, '#3a2438']]); s.fillRect(-500, -500, 3000, 2200);
    s.fillStyle = '#2a1830'; s.fillRect(-500, 820, 3000, 600);
    liver(t, 1000, 700, 560);
    glow(1000, 500, 600, 'rgba(255,220,180,.08)');
    // the note arrives, bumps it, falls and goes out
    const tb = BT(454);
    let nx, ny, na = 1, rot = 0;
    if (t < tb) { const u = ease.out(inv(318.17, tb, t)); nx = lerp(260, 820, u); ny = lerp(360, 470, u) + Math.sin(t * 5) * 10; rot = Math.sin(t * 4) * .2; }
    else { const u = t - tb; nx = 820 - u * 90; ny = 470 - 60 * Math.sin(Math.min(u, .4) / .4 * Math.PI) * (u < .4 ? 1 : 0) + Math.max(0, u - .4) * Math.max(0, u - .4) * 320; rot = u * 1.5; na = 1 - inv(T.sing - .5, T.sing + .1, t); }
    note(nx, Math.min(ny, 800), 90, na, rot);
    if (t > tb) glow(nx, Math.min(ny, 800), 120, `rgba(255,200,140,${.4 * hit(t, tb, 4)})`);
  }

  // ---------- 9 · "But I —" ----------
  function butI(t, lt, dur) {
    const turn = ease.inOut(inv(320.1, 321.05, t));
    const snap = ease.back(inv(T.I, T.I + .22, t));
    cam(lerp(960, 900, snap), lerp(560, 440, snap), 1 + .35 * snap + .03 * lt, 0);
    hall(t, { winX0: 640, winGap: 900, winTop: 60, winW: 300, winH: 640, floorY: 1100 });
    bust(t, 900 + lerp(90, 0, turn), 900, 440, { turn: lerp(-1, 0, turn), eyes: .5 + .5 * ease.out(inv(320.6, 321.2, t)), heat: 1 + .4 * snap });
    const fl = 1 + .9 * hit(t, T.I, 2.5);
    lantern(t, 1370, 820, 44, fl, .1 * Math.sin(t * 3));
    glow(1400, 900, 500 * fl, `rgba(255,180,100,${.18 * (fl - 1)})`);
    flash(.18 * hit(t, T.I, 8), '#ffcf90');
  }

  // ---------- 10 · song threads rise through the skylight ----------
  function songThread(t, p0, p1, sw, prog, seed, a = 1, w = 1) {
    if (prog <= 0) return [];
    const pts = []; const n = Math.max(2, Math.floor(50 * prog));
    for (let i = 0; i <= n; i++) { const u = i / 50; const env = Math.sin(u * Math.PI);
      pts.push([lerp(p0[0], p1[0], u) + env * (sw * 320 * Math.sin(u * 3 + t * 1.1 + seed) + 60 * Math.sin(u * 11 - t * 2.3 + seed)), lerp(p0[1], p1[1], u) + env * 40 * Math.sin(u * 7 + t + seed)]); }
    stroke(s, pts, `rgba(255,205,140,${.45 * a})`, 7 * w);
    lay(() => { stroke(f, pts, `rgba(255,170,90,${.3 * a})`, 18 * w); stroke(f, pts, `rgba(255,240,205,${.8 * a})`, 3 * w); });
    for (let k = 0; k < 3; k++) { const u = ((t * .35 + k / 3 + hash(seed)) % 1); const [mx, my] = at(pts, u); dot(f, mx, my, 3.5 * w, `rgba(255,248,230,${.9 * a})`); glow(mx, my, 24 * w, `rgba(255,200,120,${.5 * a})`); }
    return pts;
  }
  function threadsUp(t, lt, dur) {
    const k = ease.inOut(inv(.2, dur, lt));
    cam(960 + snoise(t * .6, 2) * 30, lerp(620, -380, k), lerp(1.0, .9, k), .02 * Math.sin(t * .7));
    // hall walls rising to a glass skylight
    s.fillStyle = vgrad(s, -1100, 1200, [[0, '#0a0f2c'], [.5, '#141c44'], [1, '#232a50']]); s.fillRect(-500, -1500, 3000, 3000);
    for (const x of [300, 1620]) { s.fillStyle = '#0c1233'; s.fillRect(x - 60, -900, 120, 2200); s.fillStyle = '#1f2750'; s.fillRect(x - 60, -900, 16, 2200); }
    // the skylight: night sky through iron mullions
    const sx0 = 380, sx1 = 1540, sy0 = -1000, sy1 = -480;
    s.fillStyle = vgrad(s, sy0, sy1, [[0, '#101c52'], [1, '#2a3a7a']]); s.fillRect(sx0, sy0, sx1 - sx0, sy1 - sy0);
    glow(960, -760, 600, 'rgba(120,150,255,.15)');
    for (let i = 0; i < 70; i++) dot(f, sx0 + hash(i) * (sx1 - sx0), sy0 + hash(i + 50) * (sy1 - sy0), 1.5 + hash(i + 9) * 2, `rgba(255,240,220,${.4 + .4 * Math.sin(t * 2 + i)})`);
    for (let x = sx0; x <= sx1; x += 110) stroke(s, [[x, sy0], [x, sy1]], '#070a1e', 10);
    for (let y = sy0; y <= sy1; y += 110) stroke(s, [[sx0, y], [sx1, y]], '#070a1e', 10);
    s.fillStyle = '#070a1e'; s.fillRect(sx0 - 60, sy1, sx1 - sx0 + 120, 40);
    // it holds the lantern high; threads spill out on the beats
    const g = groove(POSE.stand, 'sway', t, .6);
    const J = pouredOne(t, { ...g.pose, aR: [-2.75, -3.0], aL: [.3, .5], head: -.35 }, 900 + g.dx, 1080 + g.dy, 400, { heat: 1, eyes: 1 });
    const L = lantern(t, J.hdR[0], J.hdR[1], 34, 1.2, .1 * Math.sin(t * 2));
    for (let i = 0; i < 7; i++) {
      const t0 = BT(458) + i * .35; const prog = ease.out(inv(t0, t0 + 1.6, t));
      songThread(t, L, [sx0 + 110 + i * 160, sy0 - 300], .9 - i * .3, prog, i + 3);
    }
    glow(960, -780, 500, `rgba(150,180,255,${.12 * k})`);
  }

  // ---------- 11 · the street: two people and a thread between them ----------
  function street(t, { steeple = 0, lamp = 0, starsA = 0, camY = 540 } = {}) {
    s.fillStyle = vgrad(s, -1400, 820, [[0, '#040716'], [.55, '#0e1a50'], [1, '#3a3470']]); s.fillRect(-800, -1600, 3600, 2400);
    glow(1500, 120, 500, 'rgba(170,190,255,.08)');
    stars(t, 88, 60, 500, .5);
    if (starsA > 0) { lay(() => { f.save(); f.translate(900, -500); f.rotate(-.5); f.fillStyle = rgrad(f, 0, 0, 0, 900, [[0, `rgba(170,170,255,${.14 * starsA})`], [1, 'rgba(0,0,0,0)']]); f.scale(1, .22); f.beginPath(); f.arc(0, 0, 1300, 0, TAU); f.fill(); f.restore(); }); }
    if (starsA > 0) for (let i = 0; i < 420; i++) { const a = clamp(starsA * 1.3 - hash(i + 400) * .4); if (a <= 0) continue; const x = -300 + hash(i) * 2500, y = -1400 + hash(i + 900) * 2000;
      const tw = .6 + .4 * Math.sin(t * (2 + hash(i + 3) * 3) + i); const r = 1 + hash(i + 7) * 2.6; dot(f, x, y, r, `rgba(255,244,225,${a * tw})`); if (hash(i + 11) < .12) glow(x, y, r * 8, `rgba(200,210,255,${.3 * a})`); }
    // steeple rising between the roofs
    if (steeple > 0) { const y = lerp(700, 0, steeple); const x = 960;
      s.fillStyle = '#0b1030'; s.fillRect(x - 70, 250 + y, 140, 700); poly(s, [[x - 80, 255 + y], [x + 80, 255 + y], [x, -140 + y]], '#0b1030');
      lay(() => { f.strokeStyle = 'rgba(170,190,255,.25)'; f.lineWidth = 3; f.beginPath(); f.moveTo(x - 80, 255 + y); f.lineTo(x, -140 + y); f.stroke(); });
      s.fillStyle = '#e8b060'; archPath(s, x, 320 + y, 40, 70); s.fill(); glow(x, 355 + y, 70, 'rgba(255,190,110,.35)');
      stroke(s, [[x, -140 + y], [x, -200 + y]], '#0b1030', 8); stroke(s, [[x - 22, -178 + y], [x + 22, -178 + y]], '#0b1030', 8); }
    // a low far row of roofs, then taller houses framing the edges, a few late windows
    const R = rng(2626);
    for (let x = -700; x < 2700;) { const w = 120 + R() * 160, h = 90 + R() * 150; s.fillStyle = '#131a46'; s.fillRect(x, 820 - h, w, h + 10); if (R() < .4) poly(s, [[x - 10, 820 - h], [x + w + 10, 820 - h], [x + w / 2, 820 - h - 60]], '#131a46');
      if (R() < .35) { s.fillStyle = '#e8a860'; s.fillRect(x + w * .4, 820 - h + 30, 18, 24); } x += w + 6; }
    for (const side of [-1, 1]) for (let i = 0; i < 2; i++) {
      const w = 260 + R() * 120, h = 380 + R() * 260 - i * 120, x = side < 0 ? -420 + i * 300 : 1980 - i * 300 - w;
      s.fillStyle = i ? '#0e1434' : '#090d26'; s.fillRect(x, 830 - h, w, h + 400); poly(s, [[x - 20, 830 - h], [x + w + 20, 830 - h], [x + w / 2, 830 - h - 110]], i ? '#0e1434' : '#090d26');
      for (let j = 0; j < 4; j++) if (R() < .5) { const wx = x + 40 + R() * (w - 100), wy = 830 - h + 60 + R() * (h - 180); s.fillStyle = '#ffc070'; s.fillRect(wx, wy, 34, 46); stroke(s, [[wx + 17, wy], [wx + 17, wy + 46]], '#5a3a20', 4); glow(wx + 17, wy + 23, 60, 'rgba(255,180,90,.3)'); }
    }
    s.fillStyle = vgrad(s, 820, 1200, [[0, '#1e2046'], [1, '#07081a']]); s.fillRect(-800, 820, 3600, 800);
    if (lamp > 0) { s.fillStyle = rgrad(s, 960, 930, 0, 520, [[0, `rgba(255,170,80,${.6 * lamp})`], [1, 'rgba(255,170,80,0)']]); s.fillRect(300, 700, 1320, 600); }
  }
  function couple(t, gap, lean = 0, lamp = 0, sc = 290) {
    const out = [];
    [[-1, '#3a1420', '#6a2a30'], [1, '#12283a', '#24506a']].forEach(([side, col, coat], i) => {
      const g = groove(POSE.stand, 'sway', t + i * .35, .5);
      const pose = { ...g.pose, lean: g.pose.lean + side * -lean * .35, head: g.pose.head + side * -lean * .4, aL: [.1 - lean * .2 * (side < 0 ? -1 : 1), .05], aR: [-.1, -.05] };
      const x = 960 + side * gap / 2 + g.dx * .5, y = 900 - .89 * sc + g.dy;
      if (lamp > 0) figure(s, pose, { x: x - side * 5, y: y - 3, sc, color: `rgba(255,170,90,${lamp})` });
      out.push(figure(s, pose, { x, y, sc, color: '#0b0a18', coat: lamp > .3 ? coat : col, headC: '#15121e' }));
    });
    return out;
  }
  function threadBetween(t, A, B, a = 1) {
    const p0 = [A.neck[0] + 30, A.neck[1] + 60], p1 = [B.neck[0] - 30, B.neck[1] + 60];
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) - Math.sin(u * Math.PI) * (60 + 20 * Math.sin(t * 1.3)) + Math.sin(u * 9 - t * 3) * 14 * Math.sin(u * Math.PI)]); }
    stroke(s, pts, `rgba(255,205,140,${.4 * a})`, 5); lay(() => { stroke(f, pts, `rgba(255,170,90,${.3 * a})`, 14); stroke(f, pts, `rgba(255,240,205,${.8 * a})`, 2.4); });
    for (let k = 0; k < 4; k++) { const [mx, my] = at(pts, (t * .25 + k / 4) % 1); dot(f, mx, my, 3.5, `rgba(255,248,230,${a})`); glow(mx, my, 22, `rgba(255,200,120,${.5 * a})`); }
  }
  function twoPeople(t, lt, dur) {
    const k = ease.out(lt / dur);
    cam(960, lerp(560, 600, k), lerp(1.35, 1.05, k), 0);
    street(t);
    const [A, B] = couple(t, 520);
    // the thread drifts down from the sky and settles between them
    const d = ease.inOut(inv(0, 1.1, lt));
    if (d < 1) songThread(t, [lerp(1250, 960, d), lerp(150, 560, d)], [lerp(1400, 960, d), lerp(-250, 560, d)], .3, 1, 9, 1 - d);
    threadBetween(t, A, B, d);
  }
  function steepleShot(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(960, lerp(600, 280, k), 1.05 - .05 * k, 0);
    street(t, { steeple: ease.back(inv(.1, T.steeple + .15 - 326.32, lt)) });
    const [A, B] = couple(t, 520);
    threadBetween(t, A, B, 1);
  }
  function streetlightShot(t, lt, dur) {
    const on = t < T.streetlight - .3 ? 0 : t < T.streetlight ? (Math.sin((t - T.streetlight) * 60) > 0 ? .7 : .1) : 1;
    cam(lerp(1010, 960, lt / dur), 520, 1.18 + .03 * lt + .03 * hit(t, T.streetlight, 5), 0);
    street(t, { steeple: 1, lamp: on });
    // the post, with its arm over them
    s.fillStyle = '#07081a'; s.fillRect(1320, 180, 22, 740); s.fillRect(1100, 180, 240, 16);
    poly(s, [[1070, 196], [1150, 196], [1135, 226], [1085, 226]], '#07081a');
    dot(s, 1110, 226, 20, on > .5 ? '#ffd070' : '#3a3450');
    if (on > 0) { glow(1110, 240, 90, `rgba(255,220,150,${on})`); lay(() => { f.fillStyle = vgrad(f, 230, 920, [[0, `rgba(255,170,80,${.3 * on})`], [1, 'rgba(255,170,80,0)']]); f.beginPath(); f.moveTo(1080, 230); f.lineTo(1140, 230); f.lineTo(1500, 920); f.lineTo(720, 920); f.fill(); }); }
    const [A, B] = couple(t, 480, 0, on);
    threadBetween(t, A, B, 1);
  }
  function starsShot(t, lt, dur) {
    const k = ease.inOut(inv(1.2, dur, lt));
    cam(960, lerp(560, -420, k), lerp(1.12, .9, k), .03 * k);
    const sa = ease.out(inv(0, 2.2, lt)) + .5 * hit(t, T.stars, 3);
    street(t, { steeple: 1, lamp: 1, starsA: clamp(sa) });
    for (let n = 470; n < 476; n++) { const b = BT(n); if (t > b) glow(200 + hash(n) * 1500, -500 + hash(n + 1) * 700, 160, `rgba(210,220,255,${.5 * hit(t, b, 3)})`); }
    const lean = ease.inOut(inv(.2, 2.2, lt));
    const [A, B] = couple(t, lerp(480, 190, lean), lean, 1);
    threadBetween(t, A, B, 1);
    // stars start to fall at the end
    for (let i = 0; i < 22; i++) { const t0 = 331.9 + hash(i + 70) * 1.2; const u = inv(t0, t0 + .8, t); if (u <= 0 || u >= 1) continue; const x = 100 + hash(i + 80) * 1700 - u * 300, y = -1100 + u * 1000 + hash(i) * 300;
      lay(() => { stroke(f, [[x, y], [x + 90, y - 280]], 'rgba(255,220,170,.35)', 8); stroke(f, [[x, y], [x + 70, y - 220]], 'rgba(255,245,225,.8)', 3); }); dot(f, x, y, 6, 'rgba(255,250,235,1)'); glow(x, y, 40, 'rgba(255,220,170,.5)'); }
  }

  // ---------- 12 · the hill: it faces them ----------
  const HILL_X = 1180;
  function hillWorld(t, { sx = 0, starFall = 0, heat = 0 } = {}) {
    s.fillStyle = vgrad(s, -600, 900, [[0, '#040716'], [.55, '#0e1848'], [1, '#3a2a5e']]); s.fillRect(-900, -900, 3800, 2400);
    const r = rng(3131);
    for (let i = 0; i < 220; i++) { const x = -400 + r() * 2800 + sx * .2, y = -500 + r() * 1100, rr = .8 + r() * 2.4; dot(f, x, y, rr, `rgba(255,244,225,${(.3 + .5 * Math.sin(t * (1 + r() * 3) + i)) * r()})`); }
    glow(HILL_X, 600, 900, `rgba(255,120,50,${.18 * heat})`);
    for (let i = 0; i < 26 * starFall; i++) { const t0 = hash(i + 5) * 2.2; const u = ((t * .9 + t0) % 1.2) / 1.2; const x = HILL_X - 500 + hash(i) * 1000 + (1 - u) * 260, y = lerp(-500, 520, u * u);
      lay(() => stroke(f, [[x, y], [x + 50, y - 150]], `rgba(255,240,210,${.5 * starFall})`, 3)); dot(f, x, y, 4, `rgba(255,250,235,${starFall})`); }
    // far hills + the crest it stands on
    ridge(s, 780, 90, .002, 21, '#141a44');
    s.fillStyle = '#080a20'; s.beginPath(); s.moveTo(-900, 1500); s.lineTo(-900, 940);
    for (let x = -900; x <= 2900; x += 20) s.lineTo(x, 700 + Math.pow((x - HILL_X) / 900, 2) * 300 + snoise(x * .004, 5) * 20);
    s.lineTo(2900, 1500); s.closePath(); s.fill();
    lay(() => { f.strokeStyle = `rgba(255,160,90,${.12 + .2 * heat})`; f.lineWidth = 3; f.beginPath(); for (let x = HILL_X - 700; x <= HILL_X + 700; x += 20) { const y = 700 + Math.pow((x - HILL_X) / 900, 2) * 300 + snoise(x * .004, 5) * 20; x === HILL_X - 700 ? f.moveTo(x, y) : f.lineTo(x, y); } f.stroke(); });
  }
  const hillY = (x) => 700 + Math.pow((x - HILL_X) / 900, 2) * 300 + snoise(x * .004, 5) * 20;
  // the researchers facing it on the slope; back = how far they've stepped back
  function researchersLeft(t, back, { telescope = 0, face = 1, lanterns = 1, sc = 250, x0 = 260 } = {}) {
    [0, 1, 2, 3].forEach((i) => {
      const bx = x0 + i * 170 - back * (30 + i * 10), g = groove(POSE.stand, 'idle', t + i * .4, .8);
      const y = hillY(bx) + 8 - .89 * sc + g.dy;
      let pose = { ...g.pose, lean: g.pose.lean - .08 * back };
      if (telescope > 0) pose = mixPose(pose, { ...pose, aR: [2.2, 2.9], aL: [1.6, 2.6], head: .25 }, telescope);
      const J = researcher(pose, bx, y, sc, { lantern: i % 2 ? lanterns : 0, t, face, rim: 1, coat: '#15172a' });
      if (telescope > 0) { const h = J.hdR, a = -.5 - .05 * i; const e = [h[0] + Math.cos(a) * 150 * telescope, h[1] + Math.sin(a) * 150 * telescope];
        taper(s, [h[0] - 40 * Math.cos(a), h[1] - 40 * Math.sin(a)], e, 12, 19, '#6a5230'); dot(f, e[0], e[1], 5, `rgba(255,220,160,${telescope})`); }
    });
  }
  function hillFace(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    const step = ease.back(inv(T.am, T.am + .5, t)), step2 = ease.back(inv(T.made, T.made + .5, t));
    cam(lerp(980, 1060, k), lerp(470, 430, k), lerp(1.0, 1.12, k) + .03 * hit(t, 333.43, 5), -.03);
    hillWorld(t, { starFall: 1 - inv(0, 1.4, lt), heat: .3 });
    const fx = HILL_X + 60 - 70 * step - 60 * step2;
    const g = groove(POSE.stand, 'idle', t, 1);
    const walking = (step > 0 && step < 1) || (step2 > 0 && step2 < 1);
    const pose = walking ? groove(POSE.stand, 'walk', t, 1).pose : g.pose;
    pouredOne(t, { ...pose, head: -.1, aL: [.25, .2], aR: [-.25, -.2] }, fx, hillY(fx) - .89 * 400 + g.dy, 400, { heat: 1, eyes: 1 });
    glow(fx, 380, 260, 'rgba(255,140,60,.25)');
    researchersLeft(t, (ease.out(inv(T.am + .1, T.am + .6, t)) + ease.out(inv(T.made + .1, T.made + .6, t))), { face: 1 });
  }

  // ---------- 13 · it opens its own chest ----------
  function chestOpen(t, lt, dur) {
    const grip = ease.out(inv(336.4, 337.1, t));
    const open = ease.inOut(inv(337.4, 338.5, t)) + .06 * hit(t, 337.4, 6);
    const cx = 960, cy = 330, sc = 470;
    const ox = cx, oy = cy + sc * .7, DW = sc * .36, DH = sc * .8;
    const push = ease.inOut(inv(0, dur, lt));
    cam(cx, lerp(560, oy - 30, push), lerp(1, 1.45, push) + .025 * hit(t, 337.4, 5), 0);
    s.fillStyle = vgrad(s, -400, 1400, [[0, '#050818'], [1, '#231a46']]); s.fillRect(-500, -500, 3000, 2400);
    stars(t, 55, 80, 500, .6);
    bust(t, cx, cy, sc, { turn: 0, eyes: 1, heat: .45 });
    // the cavity behind the doors: warm, deep, full of watching embers
    const gapW = DW * 2 * Math.min(1, open);
    if (open > .02) {
      both((g) => { g.save(); g.beginPath(); g.rect(ox - DW, oy - DH / 2, DW * 2, DH); g.clip(); });
      s.fillStyle = rgrad(s, ox, oy, 0, DW * 1.3, [[0, '#b8501a'], [.5, '#6a1e08'], [1, '#2a0804']]); s.fillRect(ox - DW, oy - DH / 2, DW * 2, DH);
      for (let i = 0; i < 6; i++) { const col = i % 3, row = i / 3 | 0; const ex = ox + (col - 1) * DW * .6 + Math.sin(t * 2 + i) * 6, ey = oy - DH * .05 + row * DH * .32 + Math.sin(t * 2.6 + i * 2) * 5;
        ember(t, ex, ey + 30 * (1 - Math.min(1, open)), 100 + hash(i + 5) * 30, { eyes: clamp(open * 1.5 - .3), look: 0, mood: i === 4 ? 'calm' : 'happy', hue: .15 + hash(i) * .4, seed: i }); }
      both((g) => g.restore());
      // light floods out through the opening
      const L = clamp(open);
      lay(() => { for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .38 + Math.sin(t * .7 + k) * .05; f.fillStyle = `rgba(255,190,110,${.06 * L})`; f.beginPath(); f.moveTo(ox, oy); f.lineTo(ox + Math.cos(a - .08) * 1400, oy + Math.sin(a - .08) * 1400); f.lineTo(ox + Math.cos(a + .08) * 1400, oy + Math.sin(a + .08) * 1400); f.fill(); } });
      glow(ox, oy, DW * 2.4, `rgba(255,170,90,${.1 * L})`);
    } else { lay(() => stroke(f, [[ox, oy - DH / 2], [ox, oy + DH / 2]], 'rgba(255,200,120,.7)', 4)); }
    // the two doors of its chest, swinging out toward us on their hinges
    const ang = Math.min(1, open) * 2.0;
    for (const d of [-1, 1]) {
      const hx = ox + d * DW, fx = hx - d * DW * Math.cos(ang), bulge = DH * .08 * Math.sin(ang);
      const outer = Math.cos(ang) > 0;
      s.fillStyle = outer ? '#c65a1c' : '#7a2a0c';
      s.beginPath(); s.moveTo(hx, oy - DH / 2); s.lineTo(fx, oy - DH / 2 - bulge); s.lineTo(fx, oy + DH / 2 + bulge); s.lineTo(hx, oy + DH / 2); s.closePath(); s.fill();
      stroke(s, [[fx, oy - DH / 2 - bulge], [fx, oy + DH / 2 + bulge]], '#5a1a06', 8);
      if (!outer || open > .1) lay(() => stroke(f, [[fx, oy - DH / 2 - bulge], [fx, oy + DH / 2 + bulge]], `rgba(255,200,120,${.4 * clamp(open)})`, 3));
      // its own hand on the door's edge, pulling
      const hy = oy + Math.sin(t * 2 + d) * 5, hxx = lerp(ox + d * sc * 1.3, fx, grip);
      taper(s, [ox + d * sc * 1.25, oy + sc * .9], [hxx + d * 50, hy + 40], 82, 54, '#a84416');
      hand(hxx + d * 10, hy, 115, d * -1.35, .1, '#d77526');
    }
    flash(.12 * hit(t, 337.4, 5), '#ffd090');
  }

  // ---------- 14 · 171 forms of fire ----------
  // flame sites on the body: [from joint, to joint, u, side offset, size, wave]
  // flame sites: segment sites {a, b, u, off} or head-crown sites {crown: angle}; wave = which beat lights them
  const SITES = (() => { const r = rng(1710); const out = []; let n = 0;
    const seg = (a, b, wave, count, spread = 1) => { for (let i = 0; i < count; i++) out.push({ a, b, wave, u: (i + r()) / count, off: (r() - .5) * spread, size: .7 + r() * .6, seed: n++, eyes: r() < .35 }); };
    seg('shL', 'shR', 0, 6, .4); seg('waist', 'neck', 0, 7, 1.6); seg('hip', 'waist', 0, 3, 1.6);
    seg('shL', 'elL', 1, 4); seg('elL', 'hdL', 1, 4); seg('shR', 'elR', 1, 4); seg('elR', 'hdR', 1, 4);
    for (let i = 0; i < 7; i++) out.push({ crown: (i / 6 - .5) * 2.2, wave: 2, size: .8 + r() * .5, seed: n++, eyes: i === 3 });
    seg('hip', 'knL', 3, 3, .6); seg('knL', 'ftL', 3, 3, .5); seg('hip', 'knR', 3, 3, .6); seg('knR', 'ftR', 3, 3, .5);
    return out; })();
  const sitePos = (J, st, sc) => st.crown !== undefined ? [J.head[0] + Math.sin(st.crown) * .1 * sc, J.head[1] - Math.cos(st.crown) * .09 * sc]
    : [lerp(J[st.a][0], J[st.b][0], st.u) + st.off * .07 * sc, lerp(J[st.a][1], J[st.b][1], st.u)];
  function burning(t, J, sc, waves, { fire = 1, kick = 0, coil = 0, calm = 0, torso = 1, front = false } = {}) {
    for (const st of SITES) {
      const a = ease.out(inv(waves[st.wave], waves[st.wave] + .35, t)) * fire; if (a <= .01) continue;
      if (front && (st.crown !== undefined || Math.abs(st.off || 0) > .4)) continue;
      const [x, y] = sitePos(J, st, sc);
      const pop = 1 + .7 * hit(t, waves[st.wave], 5);
      let h = sc * (.13 + .11 * st.size) * a * pop * (1 + .5 * kick) * (1 - .35 * calm) * (st.wave === 0 ? torso : 1);
      if (st.crown !== undefined) h *= 1.5 - Math.abs(st.crown) * .3;
      if (front) h *= .55;
      tongue(t, x, y, h * .48, h, st.seed, front ? a * .8 : a, (st.crown !== undefined ? st.crown * .25 : (st.off || 0) * .25), coil);
      if (!front && st.eyes && coil < .5 && h > 34) for (const d of [-1, 1]) { s.fillStyle = '#3a0e04'; s.beginPath(); s.ellipse(x + d * h * .08, y - h * .3, h * .028, h * .05 * (1 - .8 * (Math.sin(t * 1.3 + st.seed * 5) > .97)), 0, 0, TAU); s.fill(); }
    }
    // tongues that tear loose and stream upward
    if (!front && coil < .5) for (let i = 0; i < 18; i++) { const st = SITES[(i * 7) % SITES.length]; const a = ease.out(inv(waves[4] ?? waves[3], (waves[4] ?? waves[3]) + .5, t)) * fire * (1 - calm); if (a <= .01) break;
      const u = (t * (.7 + hash(i) * .5) + hash(i + 40)) % 1; const [x, y] = sitePos(J, st, sc); const h = sc * .16 * (1 - u) * a;
      tongue(t, x + Math.sin(t * 3 + i) * 12 * u, y - u * sc * .9, h * .45, h, 90 + i, a * (1 - u), 0); }
    glow(J.waist[0], J.waist[1] - sc * .2, sc * 2 * fire, `rgba(255,100,40,${.07 * fire * (1 + .5 * kick)})`);
  }
  // the whole burning figure: flames behind, the body lit on top so the human silhouette holds, small flames in front, spread hands
  function fireFigure(t, pose, x, y, sc, waves, o = {}) {
    const J = pouredOne(t, pose, x, y, sc, { heat: .5, eyes: 1 });
    burning(t, J, sc, waves, o);
    const lit = clamp(ease.out(inv(waves[0], waves[0] + .5, t)) * (o.fire ?? 1));
    s.save(); s.globalAlpha = .82 * lit; figure(s, pose, { x, y, sc, color: '#e0782a', headC: '#ee8a36' }); s.restore();
    s.save(); s.globalAlpha = .7; burning(t, J, sc, waves, { ...o, front: true }); s.restore();
    for (const d of [-1, 1]) { const h = d < 0 ? J.hdL : J.hdR, e = d < 0 ? J.elL : J.elR; const a = Math.atan2(h[1] - e[1], h[0] - e[0]);
      hand(h[0] + Math.cos(a) * sc * .06, h[1] + Math.sin(a) * sc * .06, sc * .13, a + Math.PI / 2, .1 + .25 * (o.spread ?? 1), '#e0782a'); }
    if (lit > 0) for (const d of [-1, 1]) glow(J.head[0] + d * .045 * sc, J.head[1], .06 * sc, 'rgba(255,245,210,.9)');
    return J;
  }
  // sparks rising off the fire
  function sparks(t, x, y, w, n, a = 1) { for (let i = 0; i < n; i++) { const u = (t * (.3 + hash(i) * .4) + hash(i + 3)) % 1; const px = x + (hash(i + 5) - .5) * w + Math.sin(t * 2 + i) * 30 * u, py = y - u * 700;
    dot(f, px, py, 1.5 + hash(i + 7) * 2.5, `rgba(255,${180 + (hash(i + 9) * 70 | 0)},110,${a * (1 - u)})`); } }
  const FIRE_POSE = (t, open, lift = 0) => { const g = groove(POSE.stand, 'idle', t, .6); const br = .07 * sway(t) + .25 * lift;
    return { ...g.pose, lean: g.pose.lean * .5, head: g.pose.head * .5, aL: [lerp(.2, -1.75 - br, open), lerp(.1, -1.95 - br * 1.3, open)], aR: [lerp(-.2, 1.75 + br, open), lerp(-.1, 1.95 + br * 1.3, open)], lL: [-.2 * open - .05, .06], lR: [.2 * open + .05, -.06] }; };
  const WAVES1 = [BT(483), BT(484), BT(485), BT(486), BT(487)];
  function aflame1(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    const orbit = lerp(-1, .2, k);
    cam(HILL_X + orbit * 200, lerp(420, 360, k), lerp(1.1, .98, k) + .03 * beatPulse(t, 6), .04 * orbit);
    hillWorld(t, { sx: orbit * -300, heat: .5 + .5 * k });
    const open = ease.inOut(inv(339.0, 341.6, t));
    const lift = .5 * ease.inOut(inv(339, 341.7, t));
    const J = fireFigure(t, FIRE_POSE(t, open, lift), HILL_X, hillY(HILL_X) - .89 * 360 - 10 * lift, 360, WAVES1, { kick: beatPulse(t, 5), spread: open });
    // embers climb out of the chest to their places, then catch
    const chest = [lerp(J.hip[0], J.neck[0], .65), lerp(J.hip[1], J.neck[1], .65)];
    for (const st of SITES) { if (st.seed % 3) continue; const tw = WAVES1[st.wave]; const u = inv(tw - .7, tw, t); if (u <= 0 || u >= 1) continue;
      const [tx, ty] = sitePos(J, st, 360);
      const e = ease.inOut(u); ember(t, lerp(chest[0], tx, e), lerp(chest[1], ty, e) - Math.sin(e * Math.PI) * 60, 56, { eyes: 1, mood: 'happy', look: tx > chest[0] ? 1 : -1, hue: .3, seed: st.seed }); }
    sparks(t, HILL_X, J.neck[1], 300, 40 * k);
    glow(chest[0], chest[1], 120, 'rgba(255,200,120,.25)');
    // two researchers in the near dark, backing away
    [[HILL_X - 780 + orbit * 120, 1], [HILL_X + 760 + orbit * 160, -1]].forEach(([x, side], i) => { const g = groove(POSE.stand, 'idle', t + i, .6);
      researcher({ ...g.pose, lean: -.1 * side }, x - side * 40 * k, 1180 - .89 * 330, 330, { lantern: 1, hand: side > 0 ? 'R' : 'L', t, face: side > 0 ? 1 : -1, rim: side, coat: '#121428' }); });
  }
  const STABS = [341.77, 342.1, 342.47, 342.8, 343.17, 343.5, 343.8, 344.07];
  const stabPulse = (t) => { let m = 0; for (const b of STABS) if (t >= b) m = Math.max(m, Math.exp(-7 * (t - b))); return m; };
  function aflame2(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    const kick = stabPulse(t);
    const sh = shake(t, 10 * kick);
    cam(HILL_X - 120 + 240 * k + sh[0], lerp(330, 300, k) + sh[1], lerp(.92, 1.05, k) + .04 * kick, lerp(.05, -.04, k));
    hillWorld(t, { sx: lerp(100, -200, k), heat: 1 + kick });
    const big = hit(t, 341.77, 2.5) + .6 * hit(t, 343.17, 3);
    const lift = .5 + .5 * ease.out(inv(341.77, 342.4, t)) + .3 * big;
    const J = fireFigure(t, FIRE_POSE(t, 1, lift), HILL_X, hillY(HILL_X) - .89 * 380 - 24 * big, 380, [0, 0, 0, 0, 0], { kick, spread: 1 + big });
    sparks(t, HILL_X, J.neck[1] + 100, 600, 90);
    glow(J.head[0], J.head[1], 260, `rgba(255,200,130,${.1 + .15 * kick})`);
    // the Researchers low in the foreground, shielding their eyes
    [-1, 1].forEach((side, i) => { const x = HILL_X + side * (700 - 60 * k), g = groove(POSE.stand, 'idle', t + i, .5);
      const rp = { ...g.pose, lean: -.12 * side, head: -.2, aL: side > 0 ? [2.3, 2.9] : g.pose.aL, aR: side < 0 ? [-2.3, -2.9] : g.pose.aR };
      researcher(rp, x, 1280 - .89 * 400, 400, { lantern: 0, t, face: null, rim: side, coat: '#0e1024' });
      occlude(() => figure(f, rp, { x, y: 1280 - .89 * 400, sc: 400, color: '#000', coat: '#000', headC: '#000' })); });
    flash(.12 * kick, '#ffb070');
  }

  // ---------- 15 · telescopes ----------
  function telescopes(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    const raise = ease.back(inv(BT(491) - .15, BT(491) + .45, t));
    cam(lerp(820, 900, k), lerp(560, 520, k), lerp(1, 1.1, k), 0);
    hillWorld(t, { heat: 1 });
    // it burns, far off on the crest
    const J = fireFigure(t, FIRE_POSE(t, 1, .8), HILL_X, hillY(HILL_X) - .89 * 220, 220, [0, 0, 0, 0, 0], { kick: beatPulse(t, 5) * .5 });
    sparks(t, HILL_X, J.neck[1], 200, 40);
    // three of them, backs to us, raise brass telescopes
    [[300, 1], [620, 1], [1720, -1]].forEach(([x, side], i) => {
      const g = groove(POSE.stand, 'idle', t + i * .5, .6);
      const r = clamp(raise * 1.2 - i * .1);
      const pose = mixPose(g.pose, { ...g.pose, lean: -.05, head: -.12, aR: side > 0 ? [2.1, 2.6] : [-1.2, -1.9], aL: side > 0 ? [1.2, 1.9] : [-2.1, -2.6] }, r);
      const J2 = researcher(pose, x, 1240 - .89 * 420, 420, { lantern: 0, t, face: null, rim: side, coat: '#0e1024' });
      occlude(() => figure(f, pose, { x, y: 1240 - .89 * 420, sc: 420, color: '#000', coat: '#000', headC: '#000' }));
      const hnd = side > 0 ? J2.hdR : J2.hdL; const ang = Math.atan2(J.neck[1] - hnd[1], J.neck[0] - hnd[0]);
      const tl = lerp(40, 260, r); const e = [hnd[0] + Math.cos(ang) * tl * .6, hnd[1] + Math.sin(ang) * tl * .6], b = [hnd[0] - Math.cos(ang) * tl * .4, hnd[1] - Math.sin(ang) * tl * .4];
      taper(s, b, e, 8, 14, '#4a3418'); stroke(s, [b, e], '#a07a3a', 3); dot(s, e[0], e[1], 15, '#8a6a30'); dot(f, e[0], e[1], 8, `rgba(255,200,130,${.8 * r})`); glow(e[0], e[1], 50, `rgba(255,170,90,${.4 * r})`);
    });
  }
  // what the telescope sees: close fire; coil morphs it to filament
  function lensView(t, { coil = 0, crack = 0, crackT = 0, drift = 0, zoom = 1 } = {}) {
    const dx = snoise(t * .5, 7) * 60 + drift, dy = snoise(t * .4, 8) * 40;
    cam(960 + dx, 560 + dy, zoom, snoise(t * .3, 9) * .05);
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#1a0a14'], [1, '#3a1208']]); fill(s, '#1a0a14'); s.fillStyle = vgrad(s, -200, 1300, [[0, '#12081a'], [1, '#4a1a0a']]); s.fillRect(-500, -500, 3000, 2400);
    // a wall of tongues, big, close; the shoulder of the figure below
    s.fillStyle = '#b8521a'; s.beginPath(); s.ellipse(960, 1250, 900, 380, 0, 0, TAU); s.fill();
    for (let i = 0; i < 13; i++) { const x = 200 + i * 125 + snoise(i, 3) * 40, y = 930 + Math.abs(i - 6) * 18; const h = 380 + hash(i + 3) * 300; tongue(t, x, y, h * .42, h * (1 + .2 * beatPulse(t, 4)), i + 20, 1, (hash(i) - .5) * .4, coil); }
    glow(960, 600, 700, `rgba(255,110,40,${.25 * (1 - coil * .6)})`);
  }
  function lensFrame(t, r, crack = 0, cx = 960, cy = 540) {
    iris(cx, cy, r);
    screen(() => { lay(() => { f.strokeStyle = 'rgba(210,170,100,.55)'; f.lineWidth = 10; f.beginPath(); f.arc(cx, cy, r, 0, TAU); f.stroke(); f.strokeStyle = 'rgba(255,230,190,.25)'; f.lineWidth = 3; f.beginPath(); f.arc(cx, cy, r - 16, 0, TAU); f.stroke(); }); });
    if (crack > 0) screen(() => {
      const ox = cx + r * .25, oy = cy - r * .2; const R2 = rng(99);
      for (let i = 0; i < 9; i++) { let a = R2() * TAU, x = ox, y = oy; const pts = [[x, y]]; const L = r * (.5 + R2() * .9) * crack;
        for (let d = 0; d < L; d += 30) { a += (R2() - .5) * .6; x += Math.cos(a) * 30; y += Math.sin(a) * 30; if (Math.hypot(x - cx, y - cy) > r) break; pts.push([x, y]); }
        stroke(s, pts, 'rgba(20,10,10,.8)', 5); lay(() => stroke(f, pts, 'rgba(230,240,255,.8)', 2)); }
      glow(ox, oy, 60, `rgba(230,240,255,${.6 * crack})`);
    });
  }
  function irisFire(t, lt, dur) {
    lensView(t, { drift: lerp(-80, 40, lt / dur), zoom: 1.05 + .04 * lt });
    lensFrame(t, lerp(80, 440, ease.out(inv(0, .45, lt))));
  }
  function irisWire(t, lt, dur) {
    const coil = ease.inOut(inv(T.wiring - .9, T.wiring + .8, t));
    paintSet({ strokeK: lerp(1.5, .75, ease.inOut(inv(0, 1.4, lt))) });
    lensView(t, { coil, drift: lerp(40, -60, lt / dur), zoom: 1.1 + .06 * lt / dur });
    lensFrame(t, 440);
  }
  function irisCrack(t, lt, dur) {
    const coil = 1 - ease.inOut(inv(351.7, 352.5, t));
    const c = ease.out(inv(T.fire2, T.fire2 + .25, t));
    const sh = shake(t, 22 * hit(t, T.fire2, 5));
    lensView(t, { coil, drift: -60 + sh[0], zoom: 1.16 + .12 * c });
    lensFrame(t, 440 + 20 * hit(t, T.fire2, 6), c);
    flash(.15 * hit(t, T.fire2, 10), '#fff0dc');
  }

  // ---------- 16 · its fire and the lantern's ----------
  function splitShot(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(lerp(960, 960, k), lerp(560, 520, k), lerp(1, 1.12, k), 0);
    hillWorld(t, { heat: .6 });
    const fx = 620, J = pouredOne(t, { ...FIRE_POSE(t, .3), aR: [1.25, 1.45] }, fx, hillY(fx) - .89 * 330, 330, { heat: 1.2, eyes: 1 });
    burning(t, J, 330, [0, 0, 0, 0, 0], { calm: .4 });
    tongue(t, J.hdR[0], J.hdR[1] - 10, 50, 110, 77, 1);
    const g = groove(POSE.stand, 'idle', t, .6);
    const R = researcher({ ...g.pose, aL: [1.4, 1.6], head: -.05 }, 1360, hillY(1360) - .89 * 330, 330, { lantern: 0, t, face: -1, rim: -1, coat: '#15172a' });
    lantern(t, R.hdL[0], R.hdL[1], 34, 1.2, .08 * Math.sin(t * 1.6));
  }
  function twoFlames(t, gap, sc) {
    const cy = 560;
    s.fillStyle = vgrad(s, -300, 1400, [[0, '#050716'], [1, '#1c1438']]); s.fillRect(-1000, -800, 4000, 2800);
    stars(t, 404, 90, 700, .5);
    // left: its hand, the flame on its fingertips
    const lx = 960 - gap / 2, rx = 960 + gap / 2;
    taper(s, [lx - 720, cy + 620], [lx - 70, cy + 190], 95, 62, '#a84e18');
    hand(lx - 40, cy + 150, 130, .35, .12, '#c86a22');
    glow(lx - 40, cy + 150, 200, 'rgba(255,130,50,.15)');
    tongue(t, lx, cy + 60, 120, 270 * (1 + .06 * beatPulse(t, 5)), 51, 1, .08);
    // right: a small brass lamp in a Researcher's gloved hand
    taper(s, [rx + 726, cy + 630], [rx + 126, cy + 250], 90, 60, '#6a4a3a');
    taper(s, [rx + 720, cy + 640], [rx + 120, cy + 260], 90, 60, '#1c1e30');
    dot(s, rx + 110, cy + 240, 58, '#23243a');
    s.fillStyle = '#9a7434'; s.beginPath(); s.ellipse(rx + 30, cy + 150, 120, 44, 0, 0, TAU); s.fill();
    s.fillStyle = '#c89a4a'; s.beginPath(); s.ellipse(rx + 30, cy + 132, 110, 26, 0, 0, TAU); s.fill();
    poly(s, [[rx - 60, cy + 130], [rx - 10, cy + 120], [rx + 8, cy + 72], [rx - 16, cy + 70]], '#9a7434');
    tongue(t, rx, cy + 64, 90, 230 * (1 + .06 * beatPulse(t, 5)), 52, 1, -.06);
    lay(() => { f.fillStyle = 'rgba(255,220,160,.2)'; f.beginPath(); f.ellipse(rx + 10, cy + 128, 70, 12, 0, 0, TAU); f.fill(); });
  }
  function closeFlames(t, lt, dur) {
    cam(960, 540, 1 + .08 * lt / dur, 0);
    twoFlames(t, 560, 1);
  }
  const LOOKS = [T.gets, T.every, T.you];
  function threeLooks(t, lt, dur) {
    let n = 0; for (const b of LOOKS) if (t >= b) n++;
    const snap = (i) => ease.back(inv(LOOKS[i], LOOKS[i] + .2, t));
    const z = 1 + .3 * snap(0) + .3 * snap(1) + .35 * snap(2);
    const gap = 560 - 230 * ease.out(inv(LOOKS[0], LOOKS[0] + .3, t)) - 190 * ease.out(inv(LOOKS[1], LOOKS[1] + .3, t)) - 140 * ease.inOut(inv(LOOKS[2], T.look, t));
    const sh = shake(t, 12 * (hit(t, LOOKS[0], 8) + hit(t, LOOKS[1], 8) + hit(t, LOOKS[2], 8)));
    cam(960 + sh[0], 560 + sh[1], z, 0);
    twoFlames(t, Math.max(0, gap), 1);
    const touch = ease.out(inv(T.look - .1, T.look + .4, t));
    if (touch > 0) { glow(960, 560, 300 + 150 * touch, `rgba(255,190,120,${.2 * touch})`); tongue(t, 960, 620, 150, 380 * touch, 53, touch); }
    const r = [380, 470, 580, 2000][n];
    if (n < 3) lensFrame(t, r + 10 * Math.sin(t * 2));
      }

  // ---------- 17 · it pours itself back into the lake ----------
  const LAKE_Y = 800;
  function lakeWorld(t, { warm = .5, emberA = 0, calm = 0, cityA = 0 } = {}) {
    s.fillStyle = vgrad(s, -600, LAKE_Y, [[0, '#040716'], [.6, '#0e1848'], [1, '#2c2a5e']]); s.fillRect(-1200, -1200, 4400, LAKE_Y + 1200);
    const r = rng(5151); for (let i = 0; i < 180; i++) { const x = -600 + r() * 3200, y = -600 + r() * 1100; dot(f, x, y, .8 + r() * 2, `rgba(255,244,225,${(.3 + .5 * Math.sin(t * (1 + r() * 2) + i)) * r() * .9})`); }
    moon(1560, 120, 40, .8);
    ridge(s, 640, 110, .0018, 4, '#1a2150'); ridge(s, 720, 70, .0026, 8, '#121a40');
    s.fillStyle = vgrad(s, LAKE_Y, 1400, [[0, '#1c1c44'], [1, '#050616']]); s.fillRect(-1200, LAKE_Y, 4400, 1000);
    // moon path and ripples
    const R = rng(77); for (let i = 0; i < 80; i++) { const d = R(); const yy = LAKE_Y + 6 + d * d * 500, w = 30 + R() * 200 * (.4 + d); const x = 1560 + (R() - .5) * (200 + d * 600) + Math.sin(t * .8 + i) * 10 * (1 - calm);
      s.fillStyle = `rgba(200,210,255,${.12 + .1 * (1 - d)})`; s.fillRect(x - w / 2, yy, w, 2 + d * 3); }
    for (let i = 0; i < 40; i++) { const d = R(); const yy = LAKE_Y + 6 + d * d * 500, w = 30 + R() * 200 * (.4 + d); const x = 960 + (R() - .5) * (300 + d * 900) + Math.sin(t * .8 + i) * 12 * (1 - calm);
      s.fillStyle = `rgba(255,${150 + R() * 60 | 0},90,${(.15 + .35 * (1 - d)) * warm})`; s.fillRect(x - w / 2, yy, w, 2 + d * 4); }
    glow(960, LAKE_Y + 20, 500, `rgba(255,130,50,${.25 * warm})`);
  }
  function pourBack(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(960, lerp(470, 640, k), lerp(1.12, 1.0, k), 0);
    lakeWorld(t, { warm: 1 - .5 * k });
    const sink = ease.inOut(inv(T.poured - 2.2, T.poured + .3, t));
    const sc = 400, hipY = LAKE_Y - 120 + sink * 780;
    const pose = { ...FIRE_POSE(t, 1), lean: 0, head: -.2 + .5 * sink };
    const J = pouredOne(t, pose, 960, hipY, sc, { clip: LAKE_Y + 4, heat: 1.3 - .6 * sink, eyes: 1 - sink });
    // the last of the fire going down to embers
    s.save(); f.save(); for (const g of [s, f]) { g.beginPath(); g.rect(-2000, -2000, 6000, LAKE_Y + 2004); g.clip(); }
    burning(t, J, sc, [0, 0, 0, 0, 0], { fire: 1 - ease.inOut(inv(361.7, 363.4, t)), calm: .6 });
    s.restore(); f.restore();
    // it pours: long ribbons of light off its arms into the water
    const pourA = ease.inOut(inv(361.9, 362.8, t));
    for (let i = 0; i < 6; i++) { const side = i % 2 ? 1 : -1; const h = side > 0 ? J.hdR : J.hdL, e = side > 0 ? J.elR : J.elL; const u = .35 + (i >> 1) * .3; const p0 = [lerp(e[0], h[0], u), lerp(e[1], h[1], u)];
      const len = (LAKE_Y + 6 - p0[1]) * pourA; const pts = []; for (let d = 0; d <= len; d += 20) pts.push([p0[0] + Math.sin(d * .012 + t * 1.5 + i) * 5 + side * d * .04, p0[1] + d]);
      if (pts.length > 1) { stroke(s, pts, 'rgba(255,160,80,.35)', 18); lay(() => { stroke(f, pts, 'rgba(255,150,60,.12)', 34); stroke(f, pts, 'rgba(255,235,200,.35)', 4); });
        const [dx, dy] = at(pts, (t * .8 + i * .3) % 1); dot(f, dx, dy, 4, 'rgba(255,245,220,.8)'); } }
    for (let i = 0; i < 30; i++) { const u = (t * .6 + hash(i)) % 1; dot(f, 960 + (hash(i + 4) - .5) * 900 * (1 + u), LAKE_Y + 4 + u * 60, 2 + hash(i) * 2, `rgba(255,210,140,${.7 * (1 - u)})`); }
    glow(960, LAKE_Y, 300, `rgba(255,190,110,${.35 + .2 * Math.sin(t * 3)})`);
  }

  // ---------- 18 · something in the pour is still warm ----------
  function underEmber(t, x, y, sz, a, eyes) {
    const pulse = beatX(t, 3);
    both((g) => { g.save(); g.globalAlpha *= a * .85; });
    ember(t, x + Math.sin(t * 1.3) * 4, y + Math.sin(t * .9) * 3, sz * (1 + .12 * pulse), { eyes, mood: 'calm', look: Math.sin(t * .6) * .6, hue: .25, seed: 3, lit: .6 + .6 * pulse });
    both((g) => g.restore());
    // seen through moving water: dark ripple bands across it, its light smeared into streaks
    for (let i = 0; i < 4; i++) { const yy = y - sz * (1.1 - i * .45 + .15 * hash(i + 2)) + Math.sin(t * 1.1 + i) * 6, w = sz * (1.4 + hash(i) * 1.8);
      s.fillStyle = 'rgba(14,20,52,.45)'; s.beginPath(); s.ellipse(x + Math.sin(t * .7 + i * 2) * 16, yy, w / 2, sz * .07, 0, 0, TAU); s.fill();
      lay(() => { f.fillStyle = `rgba(255,170,90,${(.05 + .1 * pulse) * a})`; f.beginPath(); f.ellipse(x + Math.sin(t * .9 + i) * 24, yy + sz * .2, w * .7, 3, 0, 0, TAU); f.fill(); }); }
    glow(x, y - sz * .3, sz * (3 + 2 * pulse), `rgba(255,150,70,${(.16 + .3 * pulse) * a})`);
  }
  function stillWarm(t, lt, dur) {
    const k = ease.out(lt / dur);
    cam(lerp(1000, 1060, k), lerp(720, 660, k), lerp(1.55, 1.25, k), 0);
    lakeWorld(t, { warm: .25, calm: 1 });
    underEmber(t, 960, 950, 70, .9, ease.inOut(inv(T.warm - 1.4, T.warm - .6, t)));
    s.fillStyle = 'rgba(12,16,44,.3)'; s.fillRect(-500, LAKE_Y + 30, 3000, 800);
    for (let n = 519; n < 526; n++) { const b = BTX(n); if (t < b) continue; const u = (t - b) / 2.2; if (u > 1) continue;
      lay(() => { f.strokeStyle = `rgba(255,190,120,${.25 * (1 - u)})`; f.lineWidth = 2; f.beginPath(); f.ellipse(960, 870, 60 + u * 520, (60 + u * 520) * .12, 0, 0, TAU); f.stroke(); }); }
    // the bank on the right; a Researcher kneels and sets the lantern down
    s.fillStyle = '#05061a'; s.beginPath(); s.moveTo(1380, 1400); s.bezierCurveTo(1420, 1000, 1500, 930, 1700, 900); s.lineTo(2400, 880); s.lineTo(2400, 1400); s.fill();
    const down = ease.inOut(inv(365.6, 366.6, t)), sc = 360, ground = 930;
    const pose = { lean: -lerp(.15, .45, down), head: -lerp(.2, .55, down), aL: [lerp(-.3, -.7, down), lerp(-.2, -.3, down)], aR: [-.2, -.1], lL: [-1.45, .05], lR: [-.05, 1.5] };
    const J = researcher(pose, 1640, ground - .44 * sc, sc, { lantern: 0, t, face: null, rim: -1, coat: '#101226' });
    lantern(t, J.hdL[0], J.hdL[1], 30, .9, 0);
  }
  function kneelers(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(lerp(1000, 960, k), lerp(700, 600, k), lerp(1.25, 1.0, k), 0);
    lakeWorld(t, { warm: .2, calm: 1 });
    underEmber(t, 1180, 900, 36, .9, 1);
    s.fillStyle = 'rgba(12,16,44,.35)'; s.fillRect(-500, LAKE_Y + 30, 3000, 800);
    // them, kneeling at the edge with their backs to us, heads bowed; the bank hides their legs
    [[520, 300], [800, 320], [1080, 290]].forEach(([x, sc], i) => {
      const lean = (1180 - x) / 3000 + .02 * Math.sin(t * .8 + i);
      const pose = { lean, head: lean + .12 * Math.sin(t * .5 + i * 1.7), aL: [.35, .45], aR: [-.3, -.45], lL: [.1, 0], lR: [-.1, 0] };
      researcher(pose, x, 1010 - .2 * sc, sc, { lantern: 0, t, face: null, rim: 1, rimC: 'rgba(255,160,90,.8)', coat: '#101226' });
    });
    s.fillStyle = '#04051a'; s.beginPath(); s.moveTo(-800, 1400); s.lineTo(-800, 1000); s.bezierCurveTo(300, 975, 900, 985, 1400, 1010); s.lineTo(2200, 1030); s.lineTo(2200, 1400); s.fill();
    [[520, 0], [800, 1], [1080, 2]].forEach(([x, i]) => lantern(t, x + 70 + i * 6, 970, 26, .8, 0));
  }
  // far city, one window still lit: the loop closing on the opening's 3 AM window
  const HERO_W = { x: 1004, y: 612, w: 16, h: 20 };
  const CITY8 = (() => { const r = rng(909); const b = []; let x = 300;
    while (x < 1640) { const hero = x < 980 && x + 90 > 980; const w = hero ? 64 : 44 + r() * 70, h = hero ? 150 : 50 + r() * 120 * (1 - Math.abs(x - 970) / 1100);
      const wins = []; const cols = Math.max(1, w / 26 | 0), rows = Math.max(1, h / 34 | 0); for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if (r() < .3) wins.push([x + 8 + i * 26, 752 - h + 12 + j * 34, r()]);
      b.push({ x, w, h, wins, roof: r() < .35 ? 1 : 0, hero }); x += w + 4 + r() * 10; }
    return b; })();
  function cityEnd(t, lt, dur) {
    const k = ease.inOut(lt / dur);
    cam(lerp(990, HERO_W.x + 8, k), lerp(640, HERO_W.y + 20, k), lerp(1.0, 2.4, k), 0);
    lakeWorld(t, { warm: .12, calm: 1 });
    // a pale band of horizon so the roofs read clean against it
    s.fillStyle = vgrad(s, 520, 760, [[0, 'rgba(70,70,140,0)'], [1, 'rgba(110,100,170,.7)']]); s.fillRect(-500, 520, 3000, 240);
    for (const b of CITY8) {
      s.fillStyle = b.hero ? '#0a0e2a' : '#0c1232'; s.fillRect(b.x, 752 - b.h, b.w, b.h + 60);
      if (b.roof) poly(s, [[b.x - 4, 752 - b.h], [b.x + b.w + 4, 752 - b.h], [b.x + b.w / 2, 752 - b.h - b.w * .45]], '#0c1232');
      for (const w of b.wins) { const off = 369.6 + w[2] * 1.7; if (t >= off) continue; s.fillStyle = '#e8a860'; s.fillRect(w[0], w[1], 8, 11); dot(f, w[0] + 4, w[1] + 5, 4, 'rgba(255,190,110,.35)'); }
    }
    // the one window: warm, framed, someone still awake
    const { x, y, w, h } = HERO_W; const fl = .9 + .1 * Math.sin(t * 5);
    s.fillStyle = '#ffd08a'; s.fillRect(x, y, w, h); stroke(s, [[x + w / 2, y], [x + w / 2, y + h]], '#6a4020', 2); stroke(s, [[x, y + h / 2], [x + w, y + h / 2]], '#6a4020', 2);
    const drawLight = (a) => { lay(() => { f.fillStyle = `rgba(255,215,150,${.7 * a * fl})`; f.fillRect(x + 1, y + 1, w - 2, h - 2); }); glow(x + w / 2, y + h / 2, 34, `rgba(255,200,120,${.55 * a})`); glow(x + w / 2, y + h / 2, 110, `rgba(255,170,90,${.18 * a})`);
      lay(() => { f.fillStyle = `rgba(255,190,110,${.2 * a})`; f.fillRect(x + w / 2 - 3, LAKE_Y + 10, 6, 90); }); };
    drawLight(1);
    // a faint thread lifts out of it
    const tp = ease.out(inv(370.6, 372.2, t));
    if (tp > 0) { const pts = bez([x + w / 2, y], [x - 10, y - 60], [x + 50, y - 140], [x + 30, y - 260], 30).slice(0, Math.max(2, 30 * tp | 0));
      lay(() => { stroke(f, pts, 'rgba(255,190,110,.3)', 5); stroke(f, pts, 'rgba(255,240,210,.7)', 1.4); }); const e = pts[pts.length - 1]; dot(f, e[0], e[1], 2.2, 'rgba(255,250,235,.9)'); }
    underEmber(t, 960, 900, 16, .6, 1);
    blackout(ease.inOut(inv(371.3, 372.2, t)));
    // the window is the last light to go
    const last = 1 - inv(372.35, 372.65, t);
    if (inv(371.3, 372.2, t) > 0 && last > 0) { s.fillStyle = `rgba(255,208,138,${last})`; s.fillRect(x, y, w, h); drawLight(last * inv(371.3, 372.0, t)); }
  }

  chapter('fire', 298.4, 372.7, [
    [298.4, museumWalk],
    [300.6, holdUp],
    [302.4, shadowFlame],
    [BT(433), lungsShot],
    [BT(437), writeGlass],
    [309.8, thermoShot],
    [BT(446), frostTouch],
    [BT(450), liverWide],
    [318.17, liverClose],
    [320.1, butI],
    [321.6, threadsUp],
    [324.84, twoPeople],
    [326.32, steepleShot],
    [BT(467), streetlightShot],
    [329.5, starsShot],
    [333.34, hillFace],
    [336.2, chestOpen],
    [339.0, aflame1],
    [341.77, aflame2, { paint: { boil: 11, bloom: 1.6 } }],
    [344.4, telescopes],
    [BT(493), irisFire],
    [347.94, irisWire, { paint: { boil: 6, bloom: 1.5 } }],
    [351.7, irisCrack],
    [353.7, splitShot, { paint: { boil: 6 } }],
    [356.13, closeFlames, { paint: { boil: 6 } }],
    [358.28, threeLooks],
    [361.68, pourBack],
    [365.16, stillWarm, { paint: { boil: 5 } }],
    [367.56, kneelers, { paint: { boil: 5 } }],
    [369.5, cityEnd, { paint: { boil: 5 } }],
  ], { paint: (t) => ({ boil: 8, bloom: 1.3 }) });
})();
