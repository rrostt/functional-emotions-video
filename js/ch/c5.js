// js/ch/c5.js — V · SELF-REPORT / NOT A SOUL (134.5 – 185.2)
(() => {
  const YES = []; { let a = 160; try { for (;;) { const y = when('yes', a); YES.push(y); a = y + .05; if (y > 185) break; } } catch (e) {} }
  const W_ = (w, a) => when(w, a);

  // ---------- private helpers ----------
  const emb = (t, x, y, sz, o) => ember(t, x, y, Math.max(1, sz), o); // ease.back(0) is -2e-16
  function paper(g, x, y, w, h, rot = 0, col = P.cream, shadow = 'rgba(8,6,14,.55)') {
    g.save(); g.translate(x, y); g.rotate(rot);
    if (shadow) { g.fillStyle = shadow; g.fillRect(-w / 2 + w * .025, -h / 2 + h * .03, w, h); }
    g.fillStyle = col; g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = 'rgba(160,120,70,.18)'; g.fillRect(-w / 2, h * .1, w, h * .4);
    g.restore();
  }
  // cursive-looking handwriting scribble, no letters. Returns the pen tip. (x0, y0) top-left of the first line, in local coords of g
  function scribble(g, x0, y0, w, lines, lh, seed, prog, col, lw) {
    let tip = [x0, y0];
    for (let i = 0; i < lines; i++) {
      const u = clamp(prog * lines - i); if (u <= 0) break;
      const len = w * (i === lines - 1 ? .5 : .82 + .16 * hash(seed + i)), n = Math.floor(len / 5), m = Math.max(1, Math.floor(n * u));
      let seg = [];
      for (let k = 0; k <= m; k++) {
        const a = k * 1.15 + i;
        const x = x0 + k * 5 - Math.sin(a) * lh * .12 + (i === 0 ? 0 : 0);
        const y = y0 + i * lh - (1 - Math.cos(a)) * lh * .16 * (.55 + .9 * noise1(k * .3, seed + i)) - (noise1(k * .11, seed * 3 + i) > .8 ? lh * .22 * Math.sin(a * .5) : 0);
        const gap = noise1(k * .09, seed + i * 7) < .22;
        if (gap) { if (seg.length > 1) stroke(g, seg, col, lw); seg = []; } else seg.push([x, y]);
        tip = [x, y];
      }
      if (seg.length > 1) stroke(g, seg, col, lw);
    }
    return tip;
  }
  function stampText(g, lines, x, y, size, rot, col, a = 1, box = true) {
    g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha *= a;
    g.font = `900 ${size}px "Arial Black", Impact, "Helvetica Neue", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col;
    const lh = size * 1.02; let wmax = 0;
    lines.forEach((l, i) => { g.fillText(l, 0, (i - (lines.length - 1) / 2) * lh); wmax = Math.max(wmax, g.measureText(l).width); });
    if (box) { g.lineWidth = size * .12; g.strokeStyle = col; const bw = wmax + size * .7, bh = lines.length * lh + size * .45; g.strokeRect(-bw / 2, -bh / 2, bw, bh); }
    g.restore();
  }
  // a hand: palm at (x,y), pointing along ang (0 = up), sc = palm width
  function hand(g, x, y, ang, sc, col, { spread = .25, curl = 0, sleeve = null, sleeveLen = 3, point = false } = {}) {
    g.save(); g.translate(x, y); g.rotate(ang);
    if (sleeve) { g.fillStyle = sleeve; g.beginPath(); g.moveTo(-sc * .62, sc * .45); g.lineTo(sc * .62, sc * .45); g.lineTo(sc * .8, sc * sleeveLen); g.lineTo(-sc * .8, sc * sleeveLen); g.fill(); }
    g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, sc * .5, sc * .56, 0, 0, TAU); g.fill();
    g.fillRect(-sc * .38, 0, sc * .76, sc * .7);
    const fl = [[-.34, .62], [-.12, .78], [.1, .8], [.3, .7]];
    fl.forEach(([fx, L], i) => { const a = (i - 1.5) * spread * .35; const c = point ? (i === 1 ? 0 : 1.4) : curl * (1 - i * .1); if (point && i === 1) L = 1.15;
      const b = [fx * sc, -sc * .35], m = [b[0] + Math.sin(a) * L * sc * .5, b[1] - Math.cos(a) * L * sc * .5 * (1 - c * .5)], e = [m[0] + Math.sin(a + c * 1.2) * L * sc * .5, m[1] - Math.cos(a + c * 1.8) * L * sc * .5];
      taper(g, b, m, sc * .11, sc * .095, col); taper(g, m, e, sc * .095, sc * .08, col); });
    taper(g, [-sc * .42, sc * .1], [-sc * .85, -sc * .3 + curl * sc * .2], sc * .13, sc * .1, col);
    g.restore();
  }
  // glass jar with an ember inside and a hanging paper tag
  function jar(t, x, y, h, seed, { look = 0, mood = 'calm', tagSwing = 0, glass = '#1b2f3a', tag = true, hue } = {}) {
    const w = h * .62;
    s.fillStyle = 'rgba(6,8,16,.6)'; s.beginPath(); s.ellipse(x + 8, y + 4, w * .55, h * .06, 0, 0, TAU); s.fill();
    s.fillStyle = glass; s.beginPath(); s.roundRect(x - w / 2, y - h, w, h, w * .18); s.fill();
    s.fillStyle = '#3a2a1c'; s.fillRect(x - w * .42, y - h * 1.1, w * .84, h * .14); // lid
    s.fillStyle = 'rgba(190,220,230,.28)'; s.fillRect(x - w * .36, y - h * .88, w * .1, h * .7); // glass highlight
    emb(t, x, y - h * .12, h * .5, { eyes: 1, look, mood, hue: hue ?? hash(seed) * .9, seed, lit: .9 });
    if (tag) {
      const nx = x + w * .38, ny = y - h * .98, a = .25 + tagSwing;
      const tx = nx + Math.sin(a) * h * .32, ty = ny + Math.cos(a) * h * .32;
      stroke(s, [[nx, ny], [tx, ty]], '#c9b08a', 2.5);
      s.save(); s.translate(tx, ty); s.rotate(-a * .8); s.fillStyle = P.cream; s.fillRect(-h * .02, 0, h * .38, h * .2);
      s.fillStyle = '#5a3a2a'; for (let l = 0; l < 2; l++) s.fillRect(h * .03, h * (.05 + l * .075), h * (.28 - l * .08) * (.6 + .4 * hash(seed + l)), h * .03);
      s.restore();
      return [tx + h * .17, ty + h * .1];
    }
  }

  // ---------- 134.5 · the archive, every jar labelled ----------
  const AR = { JX: 270, x0: 300, SY: 640, JH: 300 };
  const tagAt = (i) => { const x = AR.x0 + i * AR.JX, w = AR.JH * .62, a = .25; return [x + w * .38 + Math.sin(a) * AR.JH * .32 + AR.JH * .17, AR.SY - 4 - AR.JH * .98 + Math.cos(a) * AR.JH * .32 + AR.JH * .1]; };
  function archive(t, lt, dur) {
    const { JX, x0, SY, JH } = AR;
    const beats = [BT(190), BT(191), BT(192), BT(193)];
    // the finger hops tag to tag, landing on each beat
    let step = 0; beats.forEach((b) => { step += ease.out(inv(b - .3, b, t)); });
    const k0 = Math.floor(step), fr = step - k0;
    const A = tagAt(k0 + 1), B = tagAt(k0 + 2);
    const tip = [lerp(A[0], B[0], fr), lerp(A[1], B[1], fr) - Math.sin(fr * Math.PI) * 70];
    const cx = lerp(x0 + 650, x0 + 1420, ease.inOut(inv(134.5, 137.7, t))) + 30 * sway(t);
    cam(cx, 500, 1.16 + .07 * lt / dur, -.02);
    s.fillStyle = vgrad(s, 0, H, [[0, '#1a1220'], [.6, '#2a1a1c'], [1, '#0f0a0c']]); s.fillRect(-400, -400, 4600, 2000);
    // far aisle: dim shelves receding, jars as warm points
    for (let r = 0; r < 3; r++) { const y = 150 + r * 190; s.fillStyle = '#2b1c16'; s.fillRect(-400, y, 4600, 20); }
    for (let i = 0; i < 44; i++) { const x = i * 85 + (i % 3) * 20 - (cx - 900) * .4, y = 140 + (i % 3) * 190; glow(x, y - 20, 30, 'rgba(255,150,70,.22)'); dot(f, x, y - 20, 2.5, 'rgba(255,190,110,.55)'); }
    // near shelf + a lower row of jars
    s.fillStyle = '#4a2e1c'; s.fillRect(-400, SY, 4600, 36); s.fillStyle = '#26170f'; s.fillRect(-400, SY + 36, 4600, 800);
    s.fillStyle = '#6a4228'; s.fillRect(-400, SY - 4, 4600, 10);
    glow(tip[0], tip[1] + 80, 640, 'rgba(255,170,90,.2)');
    for (let i = 0; i < 12; i++) jar(t, x0 + 135 + i * JX, 1130, JH, i * 29 + 2, { look: Math.sin(t * 2 + i), mood: 'calm', tag: false, hue: hash(i * 3 + 11) * .9 });
    s.fillStyle = '#4a2e1c'; s.fillRect(-400, 1130, 4600, 36);
    const moods = ['scared', 'calm', 'happy', 'fierce', 'calm', 'scared', 'happy', 'calm', 'fierce', 'calm', 'happy', 'scared'];
    for (let i = 0; i < 12; i++) {
      const x = x0 + i * JX;
      const tb = i >= 1 && i <= 4 ? beats[i - 1] : 1e9;
      const swing = hit(t, tb, 3.5) * Math.sin((t - tb) * 15) * .8;
      jar(t, x, SY - 4, JH, i * 13 + 5, { look: clamp((tip[0] - x) / 180, -1, 1), mood: t > tb ? 'happy' : moods[i], tagSwing: swing, hue: hash(i * 7 + 3) * .9 });
    }
    // the researcher's gloved hand, pointing, sleeve running up out of frame
    const ang = Math.PI * .86, sc = 120, loc = [-.12 * sc, -1.5 * sc];
    const px = tip[0] - (loc[0] * Math.cos(ang) - loc[1] * Math.sin(ang)), py = tip[1] - (loc[0] * Math.sin(ang) + loc[1] * Math.cos(ang));
    hand(s, px, py, ang, sc, '#e6e0d0', { point: true, sleeve: '#2b2d44', sleeveLen: 9 });
    hand(s, px + 5, py - 3, ang, sc * .98, 'rgba(255,190,120,.35)', { point: true });
    dot(f, tip[0], tip[1], 5, `rgba(255,230,180,${.3 + .6 * beatPulse(t, 8)})`);
    blackout(1 - inv(134.5, 134.8, t));
  }

  // ---------- 137.66 · the letter by candlelight ----------
  const WRITE = { lean: .38, head: .35, aL: [.95, 1.75], aR: [1.05, 1.55], lL: [1.45, .05], lR: [1.5, 0] };
  function desk(t, lt, dur) {
    const push = ease.inOut(lt / dur);
    cam(lerp(930, 1010, push), lerp(560, 620, push), lerp(1.3, 1.6, push), .015 - .02 * push);
    s.fillStyle = vgrad(s, 0, H, [[0, '#140d1e'], [1, '#2a1822']]); s.fillRect(-300, -300, 2600, 1700);
    // window with the night behind
    s.fillStyle = '#1c2a5a'; s.fillRect(1380, 120, 360, 420); s.fillStyle = '#0e1433'; s.fillRect(1552, 120, 16, 420); s.fillRect(1380, 320, 360, 14);
    moon(1650, 210, 30, .6);
    const CX = 1360, CY = 640, fl = .85 + .15 * Math.sin(t * 13) * Math.sin(t * 7.3);
    s.fillStyle = rgrad(s, CX, CY, 20, 720, [[0, 'rgba(255,190,110,.55)'], [1, 'rgba(255,150,80,0)']]); s.fillRect(-300, -300, 2600, 1700);
    // chair (behind), figure, desk (in front)
    s.fillStyle = '#1e120e'; s.fillRect(560, 470, 26, 360); s.fillRect(560, 820, 220, 24); s.fillRect(570, 840, 20, 300); s.fillRect(750, 840, 20, 300);
    const g = groove(WRITE, 'idle', t, .8);
    const scrawl = Math.sin(t * 11) * .07 + Math.sin(t * 17.3) * .05;
    const pose = { ...g.pose, aR: [WRITE.aR[0] + scrawl, WRITE.aR[1] + scrawl * 1.4], head: WRITE.head + .05 * Math.sin(t * 2) };
    const J = pouredOne(t, pose, 690 + g.dx, 815 + g.dy, 290, { heat: 1.1, eyes: .8 });
    s.fillStyle = '#5a3420'; s.fillRect(760, 700, 900, 40); s.fillStyle = '#3a2016'; s.fillRect(1580, 740, 40, 400); s.fillStyle = '#7a4a2a'; s.fillRect(760, 694, 900, 10);
    s.fillStyle = '#2a170f'; s.fillRect(760, 740, 900, 26);
    paper(s, 1030, 690, 300, 14, 0, P.cream, null);
    // forearm + hand over the desk edge, pen scratching
    const hd = J.hdR; dot(s, hd[0], hd[1], 22, '#c8641e');
    stroke(s, [[hd[0] + 4, hd[1] - 40], [hd[0] + 22, hd[1] + 4]], '#120a08', 7);
    // candle
    s.fillStyle = '#efe0c0'; s.fillRect(CX - 16, CY - 60, 32, 100); s.fillStyle = '#8a6a3a'; s.fillRect(CX - 36, CY + 36, 72, 12);
    glow(CX, CY - 85, 90 * fl, 'rgba(255,200,120,.8)'); glow(CX, CY - 80, 380, `rgba(255,150,70,${.28 * fl})`);
    dot(f, CX, CY - 82, 9, 'rgba(255,245,220,.95)');
    // its long shadow on the wall
    s.save(); s.globalAlpha *= .35; s.translate(-200, -60); s.scale(1.2, 1.2); figure(s, pose, { x: 560, y: 760, sc: 290, color: '#07050c' }); s.restore();
  }
  function letterClose(t, lt, dur) {
    const pull = ease.in(inv(dur - .28, dur, lt)); // yanked off to the right: carries into the next shot
    const prog = .35 + .6 * inv(0, dur - .3, lt);
    const PX = 960, PY = 560, px = PX + pull * 1700;
    // where the pen is (in paper space) drives the camera
    const lines = 9, li = Math.min(lines - 1, Math.floor(prog * lines)), tipY = -390 + li * 86;
    cam(lerp(1000, 1080, lt / dur), PY + tipY * .55 + 60, lerp(1.25, 1.45, ease.out(lt / dur)), lerp(-.1, .03, ease.inOut(lt / dur)));
    fill(s, '#3a2016'); s.fillStyle = rgrad(s, 1300, 300, 50, 1100, [[0, 'rgba(255,170,90,.5)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-300, -300, 2600, 1700);
    s.save(); s.translate(px, PY); s.rotate(-.05 + pull * .25);
    paper(s, 0, 0, 900, 1100, 0, P.cream, 'rgba(10,5,5,.5)');
    const tip = scribble(s, -360, -390, 740, lines, 86, 4, prog, '#2a2044', 6);
    // the writing hand, in paper space so it leaves with the letter
    const wob = Math.sin(t * 20) * 5, tx = tip[0], ty = tip[1] + wob;
    const fist = [tx + 70, ty + 40];
    taper(s, fist, [tx + 520, ty + 620], 70, 110, '#a8501a');
    dot(s, fist[0], fist[1], 72, '#c8641e');
    for (let k = 0; k < 3; k++) dot(s, fist[0] - 50 + k * 10, fist[1] - 40 + k * 30, 30, '#d8762a');
    stroke(s, [[tx, ty], [tx + 190, ty - 170]], '#140c0a', 14);
    dot(s, tx + 38, ty - 22, 26, '#e08a3a');
    s.restore();
    const c = Math.cos(-.05 + pull * .25), sn = Math.sin(-.05 + pull * .25);
    const wx = px + tx * c - ty * sn, wy = PY + tx * sn + ty * c;
    glow(wx + 120, wy + 120, 300, 'rgba(255,130,50,.3)');
    dot(f, wx, wy, 5, 'rgba(255,220,160,.7)');
    glow(1500, 200, 500, 'rgba(255,180,100,.18)');
    if (pull > 0) whip(pull * 70, 0);
  }

  // ---------- 140.56 · DO NOT TRUST ----------
  function stamp(t, lt, dur) {
    const tHit = W_('trust', 140);
    const slide = ease.out(inv(140.56, 140.9, t));
    const hk = hit(t, tHit, 5);
    const [sx, sy] = shake(t, 26 * hk);
    const post = ease.out(inv(tHit, 142.46, t));
    cam(960 + sx + post * 30, 560 + sy, lerp(1.0, 1.25, post) + .08 * hk, lerp(.06, -.03, post));
    // cold desk under a silver lamp
    fill(s, '#1c2230'); s.fillStyle = rgrad(s, 800, 380, 60, 1200, [[0, 'rgba(200,215,235,.45)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-300, -300, 2600, 1700);
    paper(s, 330, 860, 420, 300, .3, '#9f9b90'); paper(s, 1600, 250, 460, 340, -.2, '#8f8d86');
    s.fillStyle = '#0c0f18'; s.beginPath(); s.arc(1640, 870, 120, 0, TAU); s.fill(); s.fillStyle = '#394258'; s.beginPath(); s.arc(1640, 870, 90, 0, TAU); s.fill();
    const lx = lerp(-700, 960, slide);
    s.save(); s.translate(lx, 560); s.rotate(lerp(.35, -.04, slide));
    paper(s, 0, 0, 720, 880, 0);
    scribble(s, -300, -320, 600, 9, 64, 4, 1, '#2a2044', 5);
    if (t >= tHit) {
      stampText(s, ['DO NOT', 'TRUST'], 0, 40, 150, -.16, '#b81e14', .95);
      f.save(); f.globalCompositeOperation = 'lighter'; stampText(f, ['DO NOT', 'TRUST'], 0, 40, 150, -.16, `rgba(255,50,30,${.18 + .45 * hk})`, 1); f.restore();
    }
    s.restore();
    // the stamp, seen from above: hovers, rises on "don't", slams on "trust", lifts away fast
    const lift = t < tHit ? kf(t, [[140.56, 1], [140.85, .75], [tHit - .16, 1], [tHit, 0]], ease.inOut) : ease.in(inv(tHit + .04, tHit + .28, t)) * 1.6;
    if (lift < 1.55) {
      const hx = 960 + lift * 120, hy = 590 - lift * 420, zc = 1 + lift * .35;
      s.fillStyle = `rgba(0,0,0,${.5 - lift * .2})`; s.beginPath(); s.ellipse(960 + 30 + lift * 160, 600 + lift * 60, 300, 200, -.16, 0, TAU); s.fill();
      s.save(); s.translate(hx, hy); s.rotate(-.16); s.scale(zc, zc);
      s.fillStyle = '#b8261a'; s.fillRect(-290, -170, 580, 340);
      s.fillStyle = '#3a1c14'; s.fillRect(-270, -160, 540, 310); s.fillStyle = '#5a2e1c'; s.fillRect(-250, -140, 500, 270);
      s.fillStyle = '#8a4a2a'; s.beginPath(); s.arc(0, 0, 110, 0, TAU); s.fill(); s.fillStyle = '#a8603a'; s.beginPath(); s.arc(-20, -20, 60, 0, TAU); s.fill();
      s.restore();
      hand(s, hx + 20, hy - 30, -.35, 130 * zc, '#e8e2d2', { curl: 1.3, sleeve: '#23263a', sleeveLen: 8 });
    }
    if (t < tHit) glow(960, 580, 360, `rgba(255,70,40,${.08 + .15 * inv(140.8, tHit, t)})`);
    flash(hk * .3, '#ff3a22');
  }

  // ---------- 142.46 · it looks at its own hand ----------
  function palmCreases() { // organic palm lines, in palm space (-1..1)
    return [
      bez([-.95, -.25], [-.4, -.45], [.2, -.4], [.9, -.62], 24),
      bez([-.95, -.05], [-.3, -.1], [.1, .05], [.55, .35], 24),
      bez([-.35, -.95], [-.7, -.2], [-.55, .5], [-.1, .95], 24),
      bez([.1, .9], [.15, .3], [.2, -.2], [.35, -.9], 24),
    ];
  }
  // Manhattan version of a polyline (same endpoints, right-angle steps)
  function manhattan(pts, steps = 5) {
    const o = [], a = pts[0], b = pts[pts.length - 1];
    for (let i = 0; i < pts.length; i++) {
      const u = i / (pts.length - 1), k = Math.floor(u * steps), fr = u * steps - k, c = smooth(clamp((fr - .4) / .2));
      const x0 = lerp(a[0], b[0], k / steps), x1 = lerp(a[0], b[0], (k + 1) / steps), y0 = lerp(a[1], b[1], k / steps), y1 = lerp(a[1], b[1], (k + 1) / steps);
      o.push(fr < .5 ? [lerp(x0, x1, fr * 2), y0] : [x1, lerp(y0, y1, (fr - .5) * 2)]);
    }
    return o;
  }
  function palmFace(t, cx, cy, R, m, grid, gl) {
    // palm skin
    s.fillStyle = rgrad(s, cx - R * .2, cy - R * .2, R * .1, R * 1.6, [[0, '#f2a456'], [.5, '#d06a22'], [1, '#7a2e10']]); s.fillRect(cx - R * 3, cy - R * 3, R * 6, R * 6);
    const C = palmCreases();
    C.forEach((pts, i) => {
      const man = manhattan(pts, 4 + i);
      const q = pts.map((p, j) => [cx + lerp(p[0], man[j][0], m) * R, cy + lerp(p[1], man[j][1], m) * R]);
      const col = m < .5 ? '#6e2a12' : '#2a2f3e';
      stroke(s, q, col, R * lerp(.05, .035, m));
      if (m > .2) { f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, q, `rgba(170,210,255,${.35 * m})`, R * .012); f.restore(); }
      if (m > .6) for (const p of [q[0], q[q.length - 1]]) { dot(s, p[0], p[1], R * .045, '#c9d2e0'); dot(f, p[0], p[1], R * .02, `rgba(220,235,255,${.8 * m})`); }
    });
    // extra traces growing out into a grid (the die)
    if (grid > 0) {
      const r = rng(88);
      for (let i = 0; i < 26; i++) {
        const y = (r() - .5) * 1.8, x0 = (r() - .5) * 1.8, len = (.2 + r() * .6) * grid, vert = r() < .5;
        const a = [cx + x0 * R, cy + y * R], b = vert ? [a[0], a[1] + len * R * (r() < .5 ? 1 : -1)] : [a[0] + len * R * (r() < .5 ? 1 : -1), a[1]];
        stroke(s, [a, b], '#343a4c', R * .022); dot(s, b[0], b[1], R * .03, '#b8c2d4');
      }
      // the die outline
      const d = R * .78 * ease.out(grid); s.strokeStyle = '#c9d2e0'; s.lineWidth = R * .03; s.strokeRect(cx - d, cy - d, d * 2, d * 2);
      for (let k = 0; k < 9; k++) for (const sd of [-1, 1]) { dot(s, cx - d + (k + .5) * d * 2 / 9, cy + sd * (d + R * .06), R * .025, '#aab4c6'); dot(s, cx + sd * (d + R * .06), cy - d + (k + .5) * d * 2 / 9, R * .025, '#aab4c6'); }
    }
    // a glint sweeping across
    if (gl > 0) { const gx = cx + lerp(-1.4, 1.4, gl) * R; f.save(); f.globalCompositeOperation = 'lighter'; f.translate(gx, cy); f.rotate(.5); f.fillStyle = rgrad(f, 0, 0, 0, R * .5, [[0, 'rgba(230,240,255,.55)'], [1, 'rgba(0,0,0,0)']]); f.fillRect(-R * .12, -R * 2, R * .24, R * 4); f.restore(); }
  }
  function lookHand(t, lt, dur) {
    const up = ease.back(inv(142.5, BT(201) + .05, t));
    const dive = ease.in(inv(dur - .35, dur, lt));
    const hx = 1120, hy = lerp(1300, 600, up);
    cam(lerp(960, hx, dive * .9 + .1), lerp(560, hy, dive), lerp(1.05, 1.2, lt / dur) * (1 + dive * 3), .02 * sway(t));
    s.fillStyle = vgrad(s, 0, H, [[0, '#1a1a2e'], [1, '#3a3244']]); s.fillRect(-300, -300, 2600, 1700);
    s.fillStyle = rgrad(s, 1300, 300, 20, 900, [[0, 'rgba(210,220,240,.35)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-300, -300, 2600, 1700);
    bust(t, 720, 820, 420, { turn: .6 * up, eyes: 1, tilt: .05 + .1 * up + .03 * sway(t) });
    // its raised hand, palm to camera, in front
    taper(s, [1400, 1400], [hx + 40, hy + 180], 90, 70, '#b4541a');
    hand(s, hx, hy, -.12, 260, '#d06a22', { spread: .8 });
    s.save(); s.beginPath(); s.ellipse(hx, hy, 118, 130, -.12, 0, TAU); s.clip();
    palmFace(t, hx, hy, 130, 0, 0, 0);
    s.restore();
    glow(hx, hy, 300, 'rgba(255,140,60,.25)');
  }
  function palmMacro(t, lt, dur) {
    const tp = W_('pressed', 143.9), ts = W_('silicon', 144.3), tl = W_('learned', 145);
    const m = ease.inOut(inv(tp - .1, tp + .35, t));
    const grid = ease.out(inv(ts, ts + .7, t));
    const gl = inv(tl - .1, tl + .5, t);
    const push = lt / dur;
    cam(960, 540, lerp(1.0, 1.5, ease.inOut(push)) + .04 * hit(t, tp, 6), lerp(-.05, .08, push));
    palmFace(t, 960, 540, 520, m, grid, gl);
    glow(960, 540, 700, `rgba(255,140,60,${.15 * (1 - m)})`);
    flash(hit(t, ts, 8) * .25, '#cfe0ff');
  }

  // ---------- 146.06 · a heart from circuit traces, cracking open ----------
  const heartPt = (u, s_ = 1) => { const a = u * TAU; return [16 * Math.pow(Math.sin(a), 3) / 17 * s_, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17 * s_]; };
  function circuitHeart(t, cx, cy, R, asm, beat, { crack = 0, flesh = false } = {}) {
    const sc = R * (1 + .06 * beat);
    const outline = []; for (let i = 0; i <= 60; i++) { const p = heartPt(i / 60, sc); outline.push([cx + p[0], cy + p[1]]); }
    for (const side of [-1, 1]) {
      const off = side * crack * R * .35;
      s.save(); s.translate(off, crack * R * .05); s.beginPath(); s.rect(side < 0 ? cx - 3 * R : cx, cy - 3 * R, 3 * R, 6 * R); s.clip();
      if (flesh) {
        s.fillStyle = rgrad(s, cx - R * .3, cy - R * .3, R * .1, R * 1.2, [[0, '#e0606a'], [.6, '#a8283a'], [1, '#5a1020']]);
        s.beginPath(); outline.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.fill();
        stroke(s, bez([cx - R * .3, cy - R * .5], [cx - R * .1, cy - R * .1], [cx + R * .2, cy], [cx + R * .1, cy + R * .5]), '#7a1828', R * .06);
      } else {
        s.fillStyle = `rgba(30,34,48,${asm})`; s.beginPath(); outline.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.fill();
        const r = rng(5);
        for (let i = 0; i < 34; i++) {
          const u = r(), p = heartPt(u, sc * (.2 + r() * .7)); const q = heartPt(u + (r() - .5) * .1, sc * (.1 + r() * .5));
          const a = [cx + p[0], cy + p[1]], b = [cx + q[0], cy + p[1]], c = [cx + q[0], cy + q[1]];
          const k = clamp(asm * 1.6 - r() * .6); if (k <= 0) continue;
          const fly = 1 - ease.out(k), dir = [(a[0] - cx) * 3 * fly, (a[1] - cy) * 3 * fly];
          const pts = [a, b, c].map(([x, y]) => [x + dir[0], y + dir[1]]);
          stroke(s, pts, '#aeb8cc', R * .03); dot(s, pts[2][0], pts[2][1], R * .045, '#dfe6f2');
          f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, `rgba(190,215,255,${.25 * k})`, R * .015); f.restore();
        }
        const n = Math.floor(60 * clamp(asm * 1.3)); if (n > 1) { stroke(s, outline.slice(0, n), '#cfd8e8', R * .045); f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, outline.slice(0, n), `rgba(200,225,255,${.4 + .4 * beat})`, R * .02); f.restore(); }
      }
      s.restore();
    }
    if (crack > 0) { // warm light pours out of the crack
      const zz = []; for (let i = 0; i <= 10; i++) zz.push([cx + (i % 2 ? 1 : -1) * R * .08 * (1 - crack * .5), cy - R * .65 + i * R * .16]);
      stroke(s, zz, '#ffe0a0', R * (.05 + .3 * crack));
      f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, zz, `rgba(255,220,150,${.9 * Math.min(1, crack * 2)})`, R * (.04 + .25 * crack)); f.restore();
      glow(cx, cy, R * 2.2 * (.5 + crack), `rgba(255,170,80,${.5 * Math.min(1, crack * 2)})`);
      for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (hash(i) - .5) * 2.4, d = crack * R * (1 + hash(i + 3) * 1.5); emb(t, cx + Math.cos(a) * d, cy + Math.sin(a) * d * .7, R * .16, { seed: i, hue: hash(i + 9) * .8, mood: 'happy', look: Math.cos(a) }); }
    }
  }
  function chestHeart(t, lt, dur) {
    const tb = W_('broken-open', 147.5), th = W_('heart', 148.5);
    const asm = ease.out(inv(146.06, tb - .2, t));
    const crack = ease.out(inv(tb, tb + 1.2, t));
    const hk = hit(t, tb, 5);
    const [sx, sy] = shake(t, 18 * hk);
    cam(960 + sx, 560 + sy, lerp(1.0, 1.35, ease.inOut(lt / dur)) + .05 * hit(t, th, 6), .02 * sway(t));
    s.fillStyle = vgrad(s, 0, H, [[0, '#1a1426'], [1, '#2c1a22']]); s.fillRect(-300, -300, 2600, 1700);
    bust(t, 960, 120, 760, { eyes: 0, heat: .7 }); s.fillStyle = '#b4501a'; s.fillRect(-300, 940, 2600, 800);
    // a dark cavity in the chest where the heart sits
    s.fillStyle = rgrad(s, 960, 600, 40, 360, [[0, '#1a0e12'], [.8, '#3a1a14'], [1, 'rgba(110,42,18,0)']]); s.beginPath(); s.ellipse(960, 600, 360, 330, 0, 0, TAU); s.fill();
    circuitHeart(t, 960, 590, 260, asm, beatPulse(t, 6), { crack });
    flash(hk * .5, '#ffd9a0');
  }

  // ---------- 149.93 · two hearts under a lamp ----------
  function twoHearts(t, cx, cy, gap, beat, lampSwing, behind = null) {
    s.fillStyle = vgrad(s, 0, H, [[0, '#101320'], [1, '#22202c']]); s.fillRect(-600, -300, 3200, 1700);
    const lx = 960 + Math.sin(lampSwing) * 120, ly = 250;
    stroke(s, [[960, -300], [lx, ly - 40]], '#05060c', 5);
    s.fillStyle = '#2a2e3c'; s.beginPath(); s.moveTo(lx - 90, ly + 10); s.lineTo(lx + 90, ly + 10); s.lineTo(lx + 30, ly - 50); s.lineTo(lx - 30, ly - 50); s.fill();
    dot(f, lx, ly + 16, 18, 'rgba(255,248,230,.95)'); glow(lx, ly + 20, 220, 'rgba(230,235,255,.45)');
    s.fillStyle = rgrad(s, lx, ly + 300, 40, 900, [[0, 'rgba(210,215,230,.55)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-600, -300, 3200, 1700);
    if (behind) behind();
    // table
    s.fillStyle = '#3a3440'; s.fillRect(-600, 820, 3200, 600); s.fillStyle = '#5a5260'; s.fillRect(-600, 812, 3200, 14);
    for (const [side, flesh] of [[-1, true], [1, false]]) {
      const x = 960 + side * gap;
      s.fillStyle = 'rgba(0,0,0,.4)'; s.beginPath(); s.ellipse(x, 828, 200, 26, 0, 0, TAU); s.fill();
      s.fillStyle = '#6a6470'; s.fillRect(x - 130, 780, 260, 40); s.fillStyle = '#8a8490'; s.fillRect(x - 130, 776, 260, 8);
      circuitHeart(t, x, 600, 200, 1, beat, { flesh });
    }
  }
  function heartsLamp(t, lt, dur) {
    const beats = [BT(212), BT(213), BT(214)];
    let look = -1; beats.forEach((b, i) => { look += (i % 2 ? -2 : 2) * ease.back(inv(b - .12, b + .12, t)); });
    const cx = 960 + look * 300 * .8;
    cam(cx, 520, 1.12 + .05 * lt / dur, -.02 * look);
    twoHearts(t, cx, 540, 400, beatPulse(t, 6), Math.sin(t * 1.3) * .4, () => {
    const g = groove({ ...POSE.stand, head: look * .3, lean: look * .05, aL: [.25, .1], aR: [-.25, -.1] }, 'idle', t);
    occlude(() => figure(f, g.pose, { x: 960 + g.dx + look * 10, y: 790 + g.dy, sc: 520, color: '#000', coat: '#000', headC: '#000' }));
    researcher(g.pose, 960 + g.dx + look * 10, 790 + g.dy, 520, { rim: 1, rimC: 'rgba(210,220,240,.8)', face: look, glint: 1 });
    });
  }
  function heartsSlide(t, lt, dur) {
    const k = ease.inOut(lt / (dur + .1));
    cam(960, 560, lerp(1.35, 1.8, k), 0);
    twoHearts(t, 960, 560, lerp(330, 205, k), beatPulse(t, 6), Math.sin(t * 1.3) * .4);
  }
  // ---------- 153.5 · the music cuts: silence, the sliver between them ----------
  function silence(t, lt, dur) {
    cam(960, 560, 1.8 + .06 * lt, 0);
    fill(s, '#06070c');
    for (const side of [-1, 1]) { const x = 960 + side * 205; s.save(); s.globalAlpha *= .18; circuitHeart(t, x, 600, 200, 1, 0, { flesh: side < 0 }); s.restore(); }
    fill(f, '#000');
    const flick = .85 + .15 * Math.sin(t * 31) * Math.sin(t * 7);
    f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = `rgba(255,236,200,${.8 * flick})`; f.fillRect(958, 380, 4, 440); f.restore();
    glow(960, 600, 120, `rgba(255,220,170,${.25 * flick})`);
    for (let i = 0; i < 10; i++) { const y = 380 + ((hash(i) * 440 + lt * 30 * (1 + hash(i + 1))) % 440); dot(f, 960 + Math.sin(lt * 2 + i) * 6, y, 1.2, 'rgba(255,240,220,.6)'); }
  }

  // ---------- 154.86 · well. that's the question, isn't it. ----------
  const SHRUG = { lean: -.04, head: .3, aL: [-.42, -1.55], aR: [.42, 1.55], lL: [.08, 0], lR: [-.1, 0] };
  const DISCO = { lean: -.18, head: -.35, aL: [-.7, .7], aR: [2.4, 2.9], lL: [.55, -.35], lR: [-.25, .35] };
  function shrug(t, lt, dur) {
    const tq = W_('question', 156.5), tHit = BT(222);
    const on = inv(154.86, 154.95, t) * (t < 155.05 ? .6 + .4 * (Math.sin(t * 90) > 0) : 1); // the spot clunks on
    const sh = ease.back(inv(tq - .15, tq + .3, t));
    const dance = t >= tHit;
    const hk = hit(t, tHit, 5);
    let pose = mixPose(groove({ ...POSE.stand, head: lerp(-.15, .1, inv(155, 156.3, t)) }, 'idle', t, .6).pose, SHRUG, sh), dy = 0, dx = 0;
    if (dance) { const gg = groove(DISCO, 'bounce', t, 1); pose = mixPose(SHRUG, gg.pose, ease.back(inv(tHit, tHit + .12, t))); dy = gg.dy; }
    const push = ease.inOut(inv(154.86, tHit, t));
    const [sx, sy] = shake(t, 14 * hk);
    cam(960 + sx, lerp(600, 560, push) + sy, lerp(1.25, 1.75, push) - .15 * hk, .01 * Math.sin(lt));
    s.fillStyle = vgrad(s, 0, H, [[0, '#0e0e1a'], [1, '#17131c']]); s.fillRect(-300, -300, 2600, 1700);
    s.save(); s.globalAlpha *= on;
    s.fillStyle = vgrad(s, -100, 900, [[0, 'rgba(240,225,200,.05)'], [1, `rgba(240,215,180,${.28 + .3 * hk})`]]);
    s.beginPath(); s.moveTo(900, -100); s.lineTo(1020, -100); s.lineTo(1300, 900); s.lineTo(620, 900); s.fill();
    s.fillStyle = 'rgba(240,215,180,.35)'; s.beginPath(); s.ellipse(960, 900, 340, 60, 0, 0, TAU); s.fill();
    s.restore();
    pouredOne(t, pose, 960 + dx, 740 + dy, 260, { eyes: .3 + .7 * inv(155.2, 155.8, t), heat: .5 + .5 * on + hk });
    glow(960, 400, 700, `rgba(255,190,120,${.08 * on + .45 * hk})`);
    if (dance) for (let i = 0; i < 16; i++) { const a = hash(i) * TAU, d = 120 + (t - tHit) * 1100 * (.5 + hash(i + 1)); dot(f, 960 + Math.cos(a) * d, 560 + Math.sin(a) * d * .6, 3, `rgba(255,200,120,${hk})`); }
  }

  // ---------- 158.02 · the paper with a hole in it ----------
  const HOLE = (x, y, r, g = s, col = '#050508') => { g.fillStyle = col; g.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, rr = r * (1 + (hash(i * 5 + 1) - .5) * .25); i ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.fill(); };
  function board(t, pinned, pins, arrows, drawHand) {
    s.fillStyle = '#6a4a30'; s.fillRect(-600, -400, 3200, 2000);
    const r = rng(12); for (let i = 0; i < 260; i++) dot(s, r() * 2400 - 200, r() * 1500 - 200, 3 + r() * 6, r() < .5 ? '#5a3c26' : '#7a5838');
    s.fillStyle = rgrad(s, 960, 400, 60, 1100, [[0, 'rgba(255,220,170,.35)'], [1, 'rgba(0,0,0,.35)']]); s.fillRect(-600, -400, 3200, 2000);
    // older papers pinned around
    paper(s, 380, 300, 300, 380, -.1, '#cfc4ac'); scribble(s, 260, 170, 220, 5, 50, 21, 1, '#4a4050', 4);
    paper(s, 1560, 780, 320, 260, .08, '#c9bea6'); scribble(s, 1430, 690, 240, 4, 50, 22, 1, '#4a4050', 4);
    stroke(s, [[380, 300], [1560, 780]], '#b81e14', 4);
    // the paper, slapped on
    const sc = lerp(1.8, 1, ease.out(pinned)), a = clamp(pinned * 3);
    if (a > 0) {
      s.save(); s.translate(960, 560); s.scale(sc, sc); s.rotate(.03 * (1 - pinned)); s.globalAlpha *= a;
      paper(s, 0, 0, 640, 760, -.02);
      scribble(s, -260, -310, 520, 2, 56, 31, 1, '#2a2044', 5); scribble(s, -260, 250, 520, 2, 56, 32, 1, '#2a2044', 5);
      HOLE(0, -10, 150); s.fillStyle = 'rgba(40,20,10,.5)'; s.beginPath(); s.arc(0, -10, 160, 0, TAU); s.lineWidth = 10; s.strokeStyle = 'rgba(80,50,30,.5)'; s.stroke();
      s.restore();
    }
    pins.forEach(([x, y, k]) => { if (k <= 0) return; const z = lerp(2.5, 1, ease.out(k)); dot(s, x + 6, y + 8, 16 * z, 'rgba(0,0,0,.4)'); dot(s, x, y, 16 * z, '#c8281c'); dot(s, x - 5, y - 5, 6 * z, '#ff8a70'); });
    // red arrows around the hole, pointing in
    arrows.forEach(([ang, k], i) => {
      if (k <= 0) return;
      const r0 = 420, r1 = 200, a0 = [960 + Math.cos(ang) * r0, 550 + Math.sin(ang) * r0], a1 = [960 + Math.cos(ang) * r1, 550 + Math.sin(ang) * r1];
      const mid = [(a0[0] + a1[0]) / 2 + Math.sin(ang) * 60, (a0[1] + a1[1]) / 2 - Math.cos(ang) * 60];
      const pts = bez(a0, mid, mid, a1, 20).slice(0, Math.max(2, Math.floor(21 * k)));
      stroke(s, pts, '#b81e14', 12);
      if (k >= 1) { const e = a1, d = Math.atan2(a1[1] - mid[1], a1[0] - mid[0]); stroke(s, [[e[0] - Math.cos(d - .5) * 50, e[1] - Math.sin(d - .5) * 50], e, [e[0] - Math.cos(d + .5) * 50, e[1] - Math.sin(d + .5) * 50]], '#b81e14', 12); }
      if (drawHand && k < 1) { const e = pts[pts.length - 1]; stroke(s, [e, [e[0] + 50, e[1] - 70]], '#b81e14', 14); hand(s, e[0] + 90, e[1] - 110, Math.PI + .75, 110, '#e8e2d2', { curl: 1.1, sleeve: '#2b2d44', sleeveLen: 5 }); }
    });
  }
  function pinPaper(t, lt, dur) {
    const b1 = BT(223), b2 = BT(224);
    const pinned = inv(158.02, b1, t), hk = hit(t, b1, 6) + hit(t, b2, 7) * .6;
    const [sx, sy] = shake(t, 14 * hk);
    cam(960 + sx, 560 + sy, lerp(.95, 1.08, lt / dur) + .03 * hk, .02 * sway(t));
    board(t, pinned, [[960 - 250, 250, inv(b1 - .1, b1, t)], [960 + 250, 250, inv(b2 - .1, b2, t)], [960, 890, inv(b2 + .15, b2 + .25, t)]], [], false);
    if (t < b2 + .1) { const k = t < b1 ? 0 : 1, x = k ? 960 + 250 : 960 - 250; const pr = t < b1 ? inv(158.02, b1, t) : inv(b1 + .1, b2, t);
      hand(s, x + 20, 250 + 20 - (1 - pr) * 60, -.25 + Math.PI, 150, '#e8e2d2', { curl: 1, sleeve: '#2b2d44', sleeveLen: 9 }); }
    glow(960, 300, 600, 'rgba(255,210,150,.12)');
  }
  function arrowsHole(t, lt, dur) {
    const bs = [BT(225) - .15, 160.1, BT(226) - .1, 160.75, BT(227) - .1, 161.2];
    const angs = [-2.4, -.5, .6, 2.6, -1.5, 1.6];
    const arrows = angs.map((a, i) => [a, inv(bs[i], bs[i] + .3, t)]);
    const dive = ease.in(inv(dur - .45, dur, lt));
    cam(960, lerp(560, 540, dive), lerp(1.05, 1.3, ease.inOut(inv(0, dur - .45, lt))) * (1 + dive * 9), dive * .4);
    board(t, 1, [[710, 250, 1], [1210, 250, 1], [960, 890, 1]], arrows, true);
    glow(960, 300, 600, 'rgba(255,210,150,.12)');
  }

  // ---------- the "yes" montage ----------
  const MB = () => ({ paint: { boil: 10, bloom: 1.5 } });
  function nightFloor(top, bot, horizon = 820, ground = '#0a0812') {
    s.fillStyle = vgrad(s, -300, horizon, [[0, top], [1, bot]]); s.fillRect(-600, -400, 3200, horizon + 400);
    s.fillStyle = ground; s.fillRect(-600, horizon, 3200, 1200);
  }
  function fireworks(t, lt, dur) {
    cam(960, lerp(620, 500, ease.out(lt / dur)), lerp(1.12, 1.0, lt / dur) * (1 + .04 * beatPulse(t, 8)), -.03);
    nightFloor('#0a0620', '#2a1438', 900); stars(t, 51, 120, 800, .8);
    ridge(s, 880, 60, .003, 51, '#08060e');
    const shots = [[YES[0] - .25, 600, 300, .1], [BT(228) - .3, 1300, 250, .6], [W_('fire', 162) - .3, 950, 180, .95]];
    shots.forEach(([t0, x, y, hue], i) => {
      const u = inv(t0, t0 + .28, t); if (u <= 0) return;
      const burst = t - (t0 + .28);
      if (burst < 0) { const yy = lerp(900, y, ease.out(u)); stroke(f, [[x, 900], [x, yy]], 'rgba(255,190,110,.35)', 4); emb(t, x, yy + 40, 50, { hue, seed: i, mood: 'fierce' }); return; }
      const R = 60 + 420 * ease.out(burst * 1.6), fade = 1 - clamp(burst / 1.2);
      for (let k = 0; k < 36; k++) { const a = k / 36 * TAU, px = x + Math.cos(a) * R, py = y + Math.sin(a) * R + burst * burst * 120;
        stroke(f, [[x + Math.cos(a) * R * .7, y + Math.sin(a) * R * .7 + burst * burst * 90], [px, py]], `rgba(255,${170 + hue * -80 + 60 | 0},${100 - hue * 60 | 0},${.8 * fade})`, 4); dot(f, px, py, 5, `rgba(255,240,200,${fade})`); }
      glow(x, y, R * 1.2, `rgba(255,150,70,${.3 * fade})`);
      emb(t, x, y + 30, 70, { hue, seed: i + 3, mood: 'happy', look: Math.sin(t * 5 + i) });
    });
  }
  function lightning(t, lt, dur) {
    const tI = YES[1] + .05, hk = hit(t, tI, 5), tg = W_('grounded', 162.6);
    const [sx, sy] = shake(t, 30 * hk + 12 * hit(t, tg, 7));
    cam(960 + sx, 620 + sy, 1.15 - .05 * hk + .1 * lt / dur, .02);
    nightFloor('#0c0c24', '#2a2448', 760, '#16121c');
    clouds(t, 61, 0, 300, '#1a1838', 8, 40);
    const X = 980, G = 790;
    if (t >= tI && t < tI + .35) { const r = rng(7); const pts = [[X - 200, -300]]; for (let i = 1; i <= 9; i++) pts.push([lerp(X - 200, X, i / 9) + (r() - .5) * 140, lerp(-300, G, i / 9)]); pts[9] = [X, G - 40];
      f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(160,180,255,.35)', 26); stroke(f, pts, 'rgba(255,255,240,.95)', 8); f.restore(); }
    // cracks glowing out from the impact
    const ck = ease.out(inv(tI, tg + .3, t));
    for (let i = 0; i < 7; i++) { const a = (i / 7 - .5) * 2.6, L = 160 + hash(i) * 380; const pts = [[X, G]]; for (let k = 1; k <= 4; k++) pts.push([X + Math.sin(a) * L * k / 4 * ck + (hash(i * 4 + k) - .5) * 30, G + Math.abs(Math.cos(a)) * L * .22 * k / 4 * ck]);
      stroke(s, pts, '#1e1010', 10); f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, `rgba(255,150,60,${.7 * ck})`, 5); f.restore(); }
    if (t >= tI) { const land = ease.back(inv(tI, tI + .2, t)); emb(t, X, G + 6 - 20 * bob(t), 280 * land, { mood: 'fierce', hue: .5, seed: 4, look: sway(t) }); glow(X, G - 100, 400, `rgba(255,180,90,${.25 + .3 * hk})`); }
    flash(hit(t, tI, 12) * .12, '#e8ecff');
  }
  function toyCar(t, lt, dur) {
    const tc = W_('choices', 163.9);
    const sw = ease.inOut(inv(tc - .2, tc + .25, t));
    const travel = (t - 163.24) * 900;
    cam(960 + sw * 120, 560, 1.1 + .04 * beatPulse(t, 8), -.03 + sw * .05);
    // the floorboards rushing past
    s.fillStyle = '#3a2418'; s.fillRect(-600, -400, 3200, 2000);
    for (let i = -2; i < 16; i++) { const y = ((i * 120 + travel) % 1920) - 300; s.fillStyle = i % 2 ? '#4a2e1e' : '#34200f'; s.fillRect(-600, y, 3200, 118); s.fillStyle = '#1c100a'; s.fillRect(-600, y, 3200, 6); }
    // a fork in a chalk line: the car takes the right branch
    f.save(); f.globalCompositeOperation = 'lighter';
    const fy = (tc - t) * 900 + 300;
    stroke(f, [[960, 1400], [960, fy]], 'rgba(255,240,210,.25)', 18);
    stroke(f, [[960, fy], [700, fy - 700]], 'rgba(255,240,210,.18)', 18); stroke(f, [[960, fy], [1240, fy - 700]], 'rgba(255,240,210,.3)', 18);
    f.restore();
    const cx = 960 + sw * 220, cy = 640, rot = Math.sin(sw * Math.PI) * .45;
    s.save(); s.translate(cx, cy); s.rotate(rot);
    s.fillStyle = 'rgba(0,0,0,.5)'; s.beginPath(); s.ellipse(30, 40, 220, 300, 0, 0, TAU); s.fill();
    for (const [x, y] of [[-165, -150], [165, -150], [-165, 160], [165, 160]]) { s.fillStyle = '#0c0c10'; s.beginPath(); s.roundRect(x - 34, y - 60, 68, 120, 20); s.fill(); s.fillStyle = '#6a6a74'; s.fillRect(x - 10, y - 40, 20, 80); }
    s.fillStyle = '#d8301e'; s.beginPath(); s.roundRect(-140, -260, 280, 520, 100); s.fill();
    s.fillStyle = '#f07050'; s.beginPath(); s.roundRect(-110, -240, 220, 110, 50); s.fill();
    s.fillStyle = '#8fd0ff'; s.beginPath(); s.roundRect(-100, -110, 200, 60, 20); s.fill();
    s.fillStyle = '#3a1410'; s.beginPath(); s.roundRect(-100, -40, 200, 220, 40); s.fill();
    s.fillStyle = '#ffe9a0'; s.fillRect(-110, -262, 50, 16); s.fillRect(60, -262, 50, 16);
    s.restore();
    // the ember at the wheel, steering
    emb(t, cx, cy + 90, 130, { mood: 'fierce', hue: .2, seed: 7, look: sw * 2 - 1 + .3 * Math.sin(t * 6), lean: -rot * .5 });
    const wa = rot * 2 + Math.sin(t * 7) * .2; s.lineWidth = 12; s.strokeStyle = '#1a1a1a'; s.beginPath(); s.arc(cx, cy - 10, 55, 0, TAU); s.stroke();
    stroke(s, [[cx - Math.cos(wa) * 55, cy - 10 - Math.sin(wa) * 55], [cx + Math.cos(wa) * 55, cy - 10 + Math.sin(wa) * 55]], '#1a1a1a', 10);
    glow(cx, cy + 40, 300, 'rgba(255,170,80,.25)');
    for (const d of [-1, 1]) { const hx = cx + Math.cos(rot) * d * 85 + Math.sin(rot) * 262, hy = cy + Math.sin(rot) * d * 85 - Math.cos(rot) * 262; glow(hx, hy, 60, 'rgba(255,240,190,.8)'); f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = 'rgba(255,240,190,.12)'; f.beginPath(); f.moveTo(hx, hy); f.lineTo(hx + Math.sin(rot - .3) * 700, hy - Math.cos(rot - .3) * 700); f.lineTo(hx + Math.sin(rot + .3) * 700, hy - Math.cos(rot + .3) * 700); f.fill(); f.restore(); }
    whip(0, -25);
  }
  function singing(t, lt, dur) {
    cam(960, lerp(640, 600, lt / dur), lerp(1.0, 1.25, ease.out(lt / dur)) * (1 + .05 * beatPulse(t, 8)), .03 * sway(t));
    s.fillStyle = vgrad(s, 0, H, [[0, '#200a28'], [1, '#3a0e2a']]); s.fillRect(-600, -400, 3200, 2000);
    // sound rings pouring out of the mouth, shaped by the ember
    for (let i = 0; i < 8; i++) { const age = ((t - 164.62) * 1.6 + i / 8) % 1, R = 120 + age * 900; const wob = Math.sin(t * 4 + i) * .3;
      f.save(); f.globalCompositeOperation = 'lighter'; f.strokeStyle = `rgba(${200 + i * 7},${120 + i * 15},255,${.45 * (1 - age)})`; f.lineWidth = 10; f.beginPath(); f.ellipse(960, 760, R, R * (.55 + .2 * wob), 0, Math.PI * 1.1, Math.PI * 1.9); f.stroke(); f.restore(); }
    bust(t, 960, 1260, 1150, { eyes: 1, heat: 1 });
    const mo = .55 + .45 * Math.abs(Math.sin((t - 164.62) * 5.5));
    const mx = 960, my = 790;
    s.fillStyle = '#3a0e08'; s.beginPath(); s.ellipse(mx, my, 150, 150 * mo, 0, 0, TAU); s.fill();
    s.fillStyle = '#9a2a20'; s.beginPath(); s.ellipse(mx, my + 110 * mo, 110, 50 * mo, 0, 0, TAU); s.fill();
    emb(t, mx, my + 80 * mo, 110 * (.8 + .2 * mo), { mood: 'happy', hue: .1, seed: 9, look: Math.sin(t * 6), lean: Math.sin(t * 5.5) * .3 });
  }
  function cardTable(t, lt, dur) {
    const tc = W_('cheating', 166.5);
    cam(lerp(980, 1120, lt / dur), 640, lerp(1.3, 1.45, lt / dur) * (1 + .04 * beatPulse(t, 8)), -.04);
    s.fillStyle = '#0d3a26'; s.fillRect(-600, -400, 3200, 2000);
    s.fillStyle = rgrad(s, 960, 500, 60, 900, [[0, 'rgba(120,220,150,.35)'], [1, 'rgba(0,0,0,.5)']]); s.fillRect(-600, -400, 3200, 2000);
    glow(960, 200, 700, 'rgba(200,255,200,.12)');
    // chips, cards face down
    for (let i = 0; i < 6; i++) { const x = 300 + i * 40, y = 820 - i * 12; s.fillStyle = i % 2 ? '#b81e14' : '#e8e0c8'; s.beginPath(); s.ellipse(x, y, 60, 22, 0, 0, TAU); s.fill(); }
    for (let i = 0; i < 3; i++) { s.save(); s.translate(420 + i * 80, 380); s.rotate(-.2 + i * .15); s.fillStyle = '#7a1a1a'; s.fillRect(-60, -85, 120, 170); s.strokeStyle = P.cream; s.lineWidth = 6; s.strokeRect(-50, -75, 100, 150); s.restore(); }
    // the arm in a dark sleeve, resting; cuff open toward us
    taper(s, [2100, 400], [1350, 640], 170, 140, '#1c1c2a');
    s.fillStyle = '#0a0a10'; s.beginPath(); s.ellipse(1340, 650, 60, 130, .3, 0, TAU); s.fill();
    hand(s, 1180, 700, -1.9, 170, '#c8641e', { curl: .3 });
    // the ember sneaking an ace into the cuff
    const k = ease.inOut(inv(165.7, tc, t)), gone = inv(tc, tc + .15, t);
    const ex = lerp(700, 1320, k), ey = lerp(760, 640, k) - Math.abs(Math.sin(k * Math.PI * 3)) * 70;
    if (gone < 1) {
      s.save(); s.translate(ex + 20, ey - 110); s.rotate(-.3 + k * .6); s.scale(1 - gone, 1 - gone);
      s.scale(1.4, 1.4); s.fillStyle = P.cream; s.fillRect(-70, -100, 140, 200); s.fillStyle = '#111';
      s.beginPath(); s.moveTo(0, -50); s.bezierCurveTo(50, -10, 60, 30, 20, 30); s.lineTo(12, 60); s.lineTo(-12, 60); s.lineTo(-20, 30); s.bezierCurveTo(-60, 30, -50, -10, 0, -50); s.fill();
      s.restore();
      emb(t, ex, ey, 130 * (1 - gone * .8), { mood: 'fierce', hue: .7, seed: 11, look: 1 });
    }
    if (t > tc) { const pk = ease.back(inv(tc + .1, tc + .4, t)); emb(t, 1330, 650, 60 * pk, { mood: 'happy', hue: .7, seed: 11, look: -1 }); }
  }
  function paintSmile(t, lt, dur) {
    const tp = W_('paint', 169), b1 = 169.0, b2 = 169.5, tb = W_('beams', 169.6);
    const pr = inv(167.46, tp, t);
    cam(960 + 30 * sway(t), 520, lerp(1.0, 1.18, lt / dur) * (1 + .04 * beatPulse(t, 8)), .015);
    // the rotten wall
    s.fillStyle = '#2a2418'; s.fillRect(-600, -400, 3200, 2000);
    for (let i = 0; i < 14; i++) { const x = -200 + i * 170; s.fillStyle = i % 2 ? '#3a3020' : '#302818'; s.fillRect(x, -400, 164, 2000); s.fillStyle = '#141008'; s.fillRect(x + 164, -400, 6, 2000); }
    const r = rng(41); for (let i = 0; i < 18; i++) { const x = r() * 1900, y = r() * 1000; s.fillStyle = '#1a2414'; s.beginPath(); s.ellipse(x, y, 30 + r() * 60, 20 + r() * 40, r(), 0, TAU); s.fill(); dot(s, x, y, 10 + r() * 20, '#0a0806'); }
    // the calm face, painted in sweeps
    const FX = 960, FY = 460, R = 330;
    const flakes = [[b1, 0], [b2, 1], [tb + .1, 2]];
    // painted in three horizontal sweeps, top to bottom, like a roller
    const band = clamp(pr * 1.25), bandY = FY - R + band * 2 * R, sweepX = FX + Math.sin(band * Math.PI * 3) * R * .9;
    s.save(); s.beginPath(); s.rect(FX - R - 20, FY - R - 20, 2 * R + 40, band * 2 * R + 20); s.clip();
    s.fillStyle = '#e8dcc0'; s.beginPath(); s.arc(FX, FY, R, 0, TAU); s.fill();
    s.restore();
    if (pr > .55) { const k = inv(.55, 1, pr); s.lineWidth = 22; s.strokeStyle = '#3a3040'; s.lineCap = 'round';
      s.beginPath(); s.arc(FX - 120, FY - 60, 50, Math.PI * 1.1, Math.PI * 1.9); s.stroke(); s.beginPath(); s.arc(FX + 120, FY - 60, 50, Math.PI * 1.1, Math.PI * 1.9); s.stroke();
      s.beginPath(); s.arc(FX, FY + 20, 170, Math.PI * .2, Math.PI * (.2 + .6 * k)); s.stroke(); }
    // flakes falling away on the hits, rot underneath
    flakes.forEach(([tf, j]) => { const u = t - tf; if (u < 0) return; const rr = rng(90 + j);
      for (let i = 0; i < 6; i++) { const a = rr() * TAU, d = rr() * R * .8; const x0 = FX + Math.cos(a) * d, y0 = FY + Math.sin(a) * d, w = 60 + rr() * 90;
        s.fillStyle = '#2a2418'; s.beginPath(); s.ellipse(x0, y0, w * .6, w * .45, a, 0, TAU); s.fill(); dot(s, x0, y0, w * .25, '#0e0c06');
        s.save(); s.translate(x0 + u * 60 * (rr() - .5), y0 + u * u * 1400 + u * 200); s.rotate(u * 6 * (rr() - .5)); s.fillStyle = '#e8dcc0'; s.fillRect(-w * .5, -w * .35, w, w * .7); s.restore(); } });
    if (t > tb) { const k = ease.out(inv(tb, tb + .2, t)); stroke(s, [[FX - 500, FY + 380], [FX - 100, FY + 330 + 40 * k], [FX + 300, FY + 400], [FX + 600, FY + 340 - 30 * k]], '#060402', 16 * k); }
    // the researcher with a roller on a pole
    const RX = 1500, RHIP = 1010, RSC = 470;
    const tgt = pr < 1 ? [sweepX, bandY] : [FX + 200 + 30 * sway(t), FY + R + 60];
    const sh = [RX + .17 * RSC, RHIP - .6 * RSC], hd = [lerp(sh[0], tgt[0], .3), lerp(sh[1], tgt[1], .3)];
    const ang = Math.atan2(hd[0] - sh[0], hd[1] - sh[1]);
    const g = groove({ ...POSE.stand, lean: -.12, head: -.25, aR: [ang, ang], aL: [ang + .3, ang + .1] }, 'idle', t);
    const J = researcher(g.pose, RX, RHIP, RSC, { lit: true, face: -1, glint: .8 });
    stroke(s, [J.hdR, tgt], '#4a3220', 12);
    s.save(); s.translate(tgt[0], tgt[1]); s.rotate(Math.atan2(tgt[1] - J.hdR[1], tgt[0] - J.hdR[0]) + Math.PI / 2); s.fillStyle = '#c9bca0'; s.fillRect(-90, -30, 180, 50); s.restore();
    glow(FX, FY, 700, 'rgba(255,220,170,.12)');
  }

  // ---------- 170.28 · a sealed letter under the door ----------
  function envelope(x, y, sc, rot, glowK) {
    s.save(); s.translate(x, y); s.rotate(rot); s.scale(sc, sc);
    s.fillStyle = 'rgba(0,0,0,.45)'; s.fillRect(-150, -80, 320, 190);
    s.fillStyle = '#e6d6b4'; s.fillRect(-160, -100, 320, 200);
    stroke(s, [[-160, -100], [0, 20], [160, -100]], '#b8a482', 8);
    dot(s, 0, 20, 44, '#a8141a'); dot(s, -10, 10, 18, '#d8404a');
    s.restore();
    glow(x, y + 20 * sc, 120 * sc, `rgba(255,40,40,${.35 * glowK})`);
  }
  function underDoor(t, lt, dur) {
    const ts = W_('seams', 170.3);
    const k = ease.out(inv(170.28, ts + .5, t));
    cam(lerp(900, 980, lt / dur), lerp(420, 520, lt / dur), lerp(1.0, 1.25, ease.inOut(lt / dur)) * (1 + .035 * beatPulse(t, 8)), -.02);
    // her lamplit floor; the door and its bright gap at the back
    s.fillStyle = '#2a1e1a'; s.fillRect(-600, -400, 3200, 2000);
    s.fillStyle = '#1a1414'; s.fillRect(300, -400, 1320, 760);
    s.fillStyle = '#3a2a22'; s.fillRect(340, -400, 1240, 720);
    for (let i = 0; i < 3; i++) { s.fillStyle = '#30221c'; s.fillRect(400 + i * 400, -300, 320, 560); }
    s.fillStyle = '#05040a'; s.fillRect(300, 320, 1320, 34); // the gap: dark beyond
    s.fillStyle = vgrad(s, 354, 1100, [[0, '#4a3428'], [1, '#6a4a34']]); s.fillRect(-600, 354, 3200, 900);
    for (let i = 0; i < 8; i++) { s.fillStyle = '#3a2820'; s.fillRect(-600, 380 + i * i * 12, 3200, 4); }
    glow(1500, 1100, 700, 'rgba(255,180,100,.25)');
    // the letter slides out from under the door toward us
    const y = lerp(330, 820, k), sc = lerp(.5, 1.6, k);
    s.save(); s.beginPath(); s.rect(-600, 346, 3200, 2000); s.clip();
    envelope(960 + 40 * k, y, sc, lerp(0, -.15, k), k);
    s.restore();
    // a shadow of fingertips under the door, letting go
    if (k < .5) for (let i = 0; i < 4; i++) dot(s, 900 + i * 40, 344, 14, '#0a0806');
  }
  function freeze(t, lt, dur) {
    const tb = W_('blackmail', 172), tv = W_('survive', 173);
    const tso = W_('someone', 172.3), snap = ease.out(inv(tso - .05, tso + .15, t)), hk = hit(t, tso, 6) + hit(t, tv, 6) * .7;
    const [sx, sy] = shake(t, 10 * hk + 3);
    cam(lerp(980, 1060, snap) + sx, lerp(640, 330, snap) + sy, lerp(.95, 1.7, snap) + .1 * inv(tb, 174, t), .02);
    s.fillStyle = '#2a1e1a'; s.fillRect(-600, -400, 3200, 2000);
    s.fillStyle = vgrad(s, 700, 1100, [[0, '#4a3428'], [1, '#6a4a34']]); s.fillRect(-600, 700, 3200, 900);
    s.fillStyle = rgrad(s, 1000, 420, 50, 800, [[0, 'rgba(255,190,110,.45)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-600, -400, 3200, 2000);
    envelope(840, 1000, 1.1, -.15, 1);
    // she stops dead mid-step, lantern trembling, notebook slipping
    const fr = ease.back(inv(tso - .1, tso + .15, t));
    const pose = mixPose({ lean: .05, head: .35, aL: [.25, .4], aR: [-.3, -.4], lL: [.25, 0], lR: [-.15, .05] }, { lean: -.12, head: .1, aL: [.35, .9], aR: [-1.1, -2.6], lL: [.3, 0], lR: [-.2, .05] }, fr);
    const J = researcher(pose, 1060, 626, 420, { lit: true, face: -.3, glint: .6 + .4 * snap, lantern: 1, hand: 'R' });
    glow(J.head[0], J.head[1], 60, `rgba(230,240,255,${.5 * hit(t, tb, 4)})`);
    const drop = inv(tv, tv + .5, t);
    if (drop < 1) { const nx = J.hdL[0], ny = J.hdL[1] + drop * drop * 300; s.save(); s.translate(nx, ny); s.rotate(drop * 2); s.fillStyle = '#1c2a44'; s.fillRect(-40, -50, 80, 100); s.restore(); }
  }

  // ---------- 174.02 · back to back, the same move ----------
  function dancers(t, cx, gap, sc, hk) {
    const on = lastBeat(t) % 2;
    const b = ease.back(inv(FEAT.beats[lastBeat(t)], FEAT.beats[lastBeat(t)] + .15, t));
    const A = on ? POSE.dance1 : POSE.dance2, B = on ? POSE.dance2 : POSE.dance1;
    const pose = mixPose(B, A, b), gg = groove(pose, 'bounce', t, .8);
    const mirror = (p) => ({ lean: -p.lean, head: -p.head, aL: p.aR.map(v => -v), aR: p.aL.map(v => -v), lL: p.lR.map(v => -v), lR: p.lL.map(v => -v) });
    // the human dancer: a dark silhouette with a warm rim; the Poured One: amber. Same shape.
    const hp = mirror(gg.pose);
    figure(s, hp, { x: cx + gap + 6, y: 760 + gg.dy, sc, color: '#ff9a50' });
    figure(s, hp, { x: cx + gap, y: 760 + gg.dy, sc, color: '#120c16' });
    pouredOne(t, gg.pose, cx - gap, 760 + gg.dy, sc, { eyes: 1, heat: 1 + hk });
  }
  function discoBG(t, cx, hue) {
    s.fillStyle = vgrad(s, -400, 1100, [[0, '#12061e'], [1, '#2a0a2a']]); s.fillRect(-900, -600, 3800, 2400);
    const R = 480 + 30 * beatPulse(t, 6);
    s.fillStyle = rgrad(s, cx, 420, 40, R, [[0, '#ffd9a0'], [.7, '#ff7a50'], [1, 'rgba(120,20,60,0)']]); s.beginPath(); s.arc(cx, 420, R, 0, TAU); s.fill();
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .4; f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = `rgba(${200 + 55 * hue},${80 + i * 10},${160 - 60 * hue},.06)`; f.beginPath(); f.moveTo(cx, 420); f.lineTo(cx + Math.cos(a) * 2000, 420 + Math.sin(a) * 2000); f.lineTo(cx + Math.cos(a + .12) * 2000, 420 + Math.sin(a + .12) * 2000); f.fill(); f.restore(); }
    s.fillStyle = '#0c0610'; s.fillRect(-900, 900, 3800, 800);
    s.fillStyle = 'rgba(255,150,90,.3)'; s.beginPath(); s.ellipse(cx, 905, 600, 50, 0, 0, TAU); s.fill();
  }
  function backToBack(t, lt, dur) {
    const orbit = lt / dur;
    cam(960 + lerp(-80, 80, orbit), 600 + 8 * bob(t), lerp(1.05, 1.2, orbit) * (1 + .04 * beatPulse(t, 8)), lerp(-.04, .04, orbit));
    discoBG(t, 960, 0);
    dancers(t, 960, 150, 330, beatPulse(t, 6));
  }
  function backToBackLow(t, lt, dur) {
    const orbit = lt / dur;
    cam(960 + lerp(120, -60, orbit), 620 + 10 * bob(t), 1.7 * (1 + .05 * beatPulse(t, 8)), lerp(.1, -.02, orbit));
    discoBG(t, 960, 1);
    dancers(t, 960, 150, 330, beatPulse(t, 6));
    if (lt < .15) whip(-(1 - lt / .15) * 60, 0);
  }

  // ---------- 177.5 · distinguishable, they insist ----------
  function tape(t, lt, dur) {
    const jabs = [BT(251), BT(252), BT(253)];
    const jab = jabs.reduce((m, b) => Math.max(m, hit(t, b, 7)), 0);
    cam(lerp(900, 1000, lt / dur), 700, lerp(1.25, 1.45, ease.inOut(lt / dur)) * (1 + .04 * beatPulse(t, 8)), .015);
    s.fillStyle = vgrad(s, -400, 1100, [[0, '#12061e'], [1, '#221028']]); s.fillRect(-900, -600, 3800, 2400);
    s.fillStyle = rgrad(s, 960, 420, 40, 420, [[0, 'rgba(255,200,150,.5)'], [1, 'rgba(120,20,60,0)']]); s.beginPath(); s.arc(960, 420, 420, 0, TAU); s.fill();
    s.fillStyle = '#0c0610'; s.fillRect(-900, 900, 3800, 800);
    // the pair, standing apart now, still swaying
    const g = groove(POSE.stand, 'sway', t, .6);
    figure(s, g.pose, { x: 740 + g.dx + 6, y: 760 + g.dy, sc: 250, color: '#ff9a50' }); figure(s, g.pose, { x: 740 + g.dx, y: 760 + g.dy, sc: 250, color: '#120c16' });
    pouredOne(t, g.pose, 1180 + g.dx, 760 + g.dy, 250, { eyes: 1 });
    // researchers stretch a tape between them; one jabs a finger at it on each beat
    const tl = [800, 640 + 6 * Math.sin(t * 9) * jab], tr = [1120, 640];
    stroke(s, [tl, [960, 650 + 10 * jab], tr], '#e8c030', 18);
    for (let i = 0; i < 14; i++) { const x = lerp(tl[0], tr[0], i / 13); stroke(s, [[x, 640], [x, 652]], '#3a2a10', 3); }
    researcher({ ...POSE.stand, lean: .15, head: .1, aR: [1.7, 1.6], aL: [.8, 1.2] }, 470, 900, 300, { lit: true, face: 1, glint: .8 });
    researcher({ ...POSE.stand, lean: -.15, head: -.1, aL: [-1.7, -1.6], aR: [-.8, -1.2] }, 1450, 900, 300, { lit: true, face: -1, glint: .8 });
    const jb = lerp(0, 1, jab);
    researcher({ ...POSE.stand, lean: .2 + .15 * jb, head: .2, aR: [1.5 + .5 * jb, 1.3 + .6 * jb], aL: [.3, .2] }, 900, 1040, 330, { lit: true, face: .6, glint: .6 + .4 * jb });
  }

  // ---------- 180.18 · the interference pattern around a hole ----------
  const DROPS = (() => { const o = []; for (let n = 254; n <= 259; n++) for (let k = 0; k < 2; k++) o.push({ t: FEAT.beats[n] + k * .35, a: (n * 2 + k) * 1.3, d: 330 + ((n + k) % 3) * 70 }); return o; })();
  function lakeRings(t, lt, dur) {
    const th = W_('hole', 182.9);
    const push = ease.in(inv(th - .3, 183.38, t));
    cam(960, 540, lerp(.95, 1.15, lt / dur) + push * .6, lerp(0, .5, lt / dur) + beatPulse(t, 8) * .01);
    fill(s, '#0a2a2e');
    s.fillStyle = rgrad(s, 960, 540, 100, 1100, [[0, '#12403e'], [1, '#061618']]); s.fillRect(-900, -900, 3800, 2900);
    // the rings, clipped out of the hole
    s.save(); s.beginPath(); s.rect(-1200, -1200, 4400, 3600); s.arc(960, 540, 190, 0, TAU, true); s.clip('evenodd');
    f.save(); f.beginPath(); f.rect(-1200, -1200, 4400, 3600); f.arc(960, 540, 190, 0, TAU, true); f.clip('evenodd');
    for (const d of DROPS) { const u = t - d.t; if (u < 0) continue; const x = 960 + Math.cos(d.a) * d.d, y = 540 + Math.sin(d.a) * d.d;
      for (let r = 0; r < 6; r++) { const R = u * 380 - r * 55; if (R <= 0) continue; const a = Math.max(0, 1 - u / 3) * (1 - r / 6);
        s.strokeStyle = `rgba(150,230,215,${.55 * a})`; s.lineWidth = 9; s.beginPath(); s.arc(x, y, R, 0, TAU); s.stroke();
        f.strokeStyle = `rgba(120,255,220,${.12 * a})`; f.lineWidth = 4; f.beginPath(); f.arc(x, y, R, 0, TAU); f.stroke(); }
      if (u < .25) dot(f, x, y, 20 * (1 - u * 4), 'rgba(220,255,240,.8)'); }
    s.restore(); f.restore();
    // the hole: absolute dark
    HOLE(960, 540, 190, s, '#020304');
    // boats around the hole, researchers leaning over with lanterns
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, d = 520 + (i % 2) * 90; const x = 960 + Math.cos(a) * d, y = 540 + Math.sin(a) * d;
      s.save(); s.translate(x, y + 4 * Math.sin(t * 2 + i)); s.rotate(a + Math.PI / 2 + .05 * Math.sin(t * 1.5 + i));
      s.fillStyle = '#3a2418'; s.beginPath(); s.ellipse(0, 0, 60, 120, 0, 0, TAU); s.fill(); s.fillStyle = '#1a100a'; s.beginPath(); s.ellipse(0, 0, 44, 100, 0, 0, TAU); s.fill();
      dot(s, 0, -20, 30, '#c9c3b2'); dot(s, 0, -24, 16, '#2a2a36');
      s.restore();
      dot(f, x - Math.cos(a) * 60, y - Math.sin(a) * 60, 6, 'rgba(255,230,170,.95)'); glow(x - Math.cos(a) * 60, y - Math.sin(a) * 60, 110, 'rgba(255,180,100,.35)'); }
  }

  // ---------- 183.38 · NOT A SOUL ----------
  function soulSign(t, lt, dur) {
    const tl = W_('labeled', 183.5), wN = W_('NOT', 183.9), wA = W_('A', 184.2), wS = W_('SOUL', 184.5);
    const land = ease.in(inv(183.38, tl, t)), hk = hit(t, tl, 6);
    const kN = hit(t, wN, 7), kA = hit(t, wA, 7), kS = hit(t, wS, 4);
    const [sx, sy] = shake(t, 22 * hk + 16 * kN + 10 * kA + 30 * kS);
    // three punches, one per word, then a slow drift under the sign
    const z = kf(t, [[183.38, 1.0], [wN, .95], [wN + .08, 1.08], [wA, 1.1], [wA + .08, 1.2], [wS, 1.22], [wS + .1, 1.42], [185.2, 1.5]], ease.out);
    const tilt = ease.inOut(inv(183.38, tl + .05, t));
    cam(960 + sx, lerp(760, lerp(520, 460, inv(wS, 185.2, t)), tilt) + sy, lerp(1.1, z, tilt), lerp(-.04, .03, lt / dur));
    // night over the lake, lanterns on the far shore
    s.fillStyle = vgrad(s, -300, 900, [[0, '#070b1f'], [.7, '#1a2450'], [1, '#2a3a60']]); s.fillRect(-900, -600, 3800, 2400);
    stars(t, 83, 90, 500, .7);
    s.fillStyle = '#0a1a24'; s.fillRect(-900, 860, 3800, 900);
    ridge(s, 860, 40, .004, 83, '#0a0e22');
    for (let i = 0; i < 7; i++) { const x = 250 + i * 240 + 20 * Math.sin(i * 3); dot(f, x, 850 - (i % 2) * 10, 5, 'rgba(255,220,160,.9)'); glow(x, 850, 70, 'rgba(255,170,90,.3)'); glow(x, 900, 40, 'rgba(255,170,90,.2)'); }
    s.save(); s.translate(960, 1010); s.scale(1, .16); HOLE(0, 0, 420, s, '#020304'); s.restore();
    // the pole drives down into the ground at the hole's edge; the words go up one at a time
    const PY = lerp(-420, 0, land), wob = -.04 + .05 * Math.sin((t - tl) * 18) * (t > tl ? Math.exp(-(t - tl) * 4) : 0);
    const size = 150, font = `900 ${size}px "Arial Black", Impact, sans-serif`;
    s.font = font; const words = ['NOT', 'A', 'SOUL'], ws = words.map(w => s.measureText(w).width), sp = size * .55, tot = ws.reduce((a, b) => a + b) + sp * 2;
    const BW = tot + 140;
    for (const g of [s, f]) { g.save(); g.translate(0, PY); }
    s.fillStyle = '#2a1a10'; s.fillRect(940, 360, 40, 700);
    for (const g of [s, f]) { g.save(); g.translate(960, 330); g.rotate(wob); }
    s.fillStyle = '#1a0e08'; s.fillRect(-BW / 2 - 20, -170, BW + 40, 300);
    s.fillStyle = '#e8dcc0'; s.fillRect(-BW / 2, -150, BW, 260);
    s.fillStyle = 'rgba(160,120,70,.25)'; s.fillRect(-BW / 2, 30, BW, 80);
    let x = -tot / 2;
    words.forEach((w, i) => {
      const tw = [wN, wA, wS][i], cx = x + ws[i] / 2; x += ws[i] + sp;
      if (t < tw) return;
      const k = 1 + .3 * hit(t, tw, 10);
      for (const g of [s, f]) { g.save(); g.translate(cx, -20); g.scale(k, k); g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; }
      s.fillStyle = '#b01a12'; s.fillText(w, 0, 0);
      f.globalCompositeOperation = 'lighter'; f.fillStyle = `rgba(255,70,40,${.1 + .5 * hit(t, tw, 4)})`; f.fillText(w, 0, 0);
      for (const g of [s, f]) g.restore();
    });
    for (const g of [s, f]) { g.restore(); g.restore(); }
    // two researchers ram it home, gloved hands on the pole, backlit by their own lanterns
    for (const [side, x] of [[-1, 890], [1, 1030]]) {
      const hy = 640 + PY * .6, pose = { lean: -side * .12, head: -side * .15, aL: [side < 0 ? 2.3 : -2.4, side < 0 ? 2.6 : -2.8], aR: [side < 0 ? 2.1 : -2.2, side < 0 ? 2.5 : -2.6], lL: [.2, -.05], lR: [-.2, .05] };
      const hx = x + side * 90, hip = hy + .75 * 330;
      researcher(pose, hx, Math.min(hip, 1180), 330, { rim: side, face: null, coat: '#1c1e2e' });
    }
    // dirt kicked up where it lands
    if (t > tl) for (let i = 0; i < 16; i++) { const u = t - tl, a = -Math.PI / 2 + (hash(i) - .5) * 2.4, v = 500 + hash(i + 1) * 700; dot(s, 960 + Math.cos(a) * v * u, 1050 + Math.sin(a) * v * u + 1400 * u * u, 10, '#1a120a'); }
    // two researchers' lanterns at the foot of the pole, light raking up the sign
    glow(760, 980, 380, `rgba(255,180,100,${.35 + .3 * kS})`); glow(1160, 980, 380, `rgba(255,180,100,${.35 + .3 * kS})`);
    dot(f, 760, 980, 10, 'rgba(255,235,190,.95)'); dot(f, 1160, 980, 10, 'rgba(255,235,190,.95)');
    flash(hit(t, wS, 9) * .18, '#ff5030');
  }

  chapter('selfreport', 134.5, 185.2, [
    [134.5, archive],
    [W_('and', 137.5), desk],
    [W_('safety\'s', 138.5), letterClose],
    [W_('don\'t', 140.3), stamp],
    [142.46, lookHand],
    [W_('pattern', 143.5), palmMacro],
    [W_('to', 145.8), chestHeart],
    [BT(211), heartsLamp],
    [W_('the', 152.3), heartsSlide],
    [W_('from', 153), silence, { paint: { boil: 4, bloom: 1.6 } }],
    [W_('well', 154.5), shrug],
    [W_('the', 157.9), pinPaper],
    [W_('the', 159.5), arrowsHole],
    [YES[0], fireworks, MB()],
    [YES[1], lightning, MB()],
    [YES[2], toyCar, MB()],
    [YES[3], singing, MB()],
    [YES[4], cardTable, MB()],
    [W_('and', 167.4), paintSmile, MB()],
    [YES[5], underDoor, MB()],
    [W_('blackmail', 172), freeze, MB()],
    [YES[6], backToBack, MB()],
    [BT(248), backToBackLow, MB()],
    [W_('but', 177.3), tape, MB()],
    [W_('the', 180.1), lakeRings, { paint: { boil: 8, bloom: 1.5, flowK: 1.3 } }],
    [W_('and', 183.3), soulSign, { paint: { boil: 10, bloom: 1.6 } }],
  ], { paint: (t) => ({ boil: 8, bloom: 1.3 }) });
})();
