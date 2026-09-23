// js/ch/c3.js — III · STRINGS (66.3 – 98.4)
(() => {
  const FL = 712, FX = 960, SC = 150, LAG = BT(1) - BT(0);
  const both = (fn) => { s.save(); f.save(); fn(); s.restore(); f.restore(); };
  const hyp = Math.hypot;
  const nrm = (x, y) => { const l = hyp(x, y); return [x / l, y / l]; };

  // ---------- geometry helpers ----------
  function along(pts, u) {
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const d = hyp(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let r = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (r <= seg[i] || i === seg.length - 1) { const k = seg[i] ? clamp(r / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } r -= seg[i]; }
    return pts[pts.length - 1];
  }
  function partial(pts, u) {
    if (u <= 0) return [pts[0], pts[0]];
    const out = [pts[0]]; let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = hyp(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let r = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (r >= seg[i]) { out.push(pts[i + 1]); r -= seg[i]; } else { const k = seg[i] ? r / seg[i] : 0; out.push([lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]); break; } }
    return out;
  }
  // shoulder position of the figure rig (mirrors figure() in lib.js) and 2-bone IK for its arms
  function shoulderOf(pose, x, y, sc, side) {
    const l = pose.lean, cl = Math.cos(l), sl = Math.sin(l), nx = x + Math.sin(l) * .6 * sc, ny = y - Math.cos(l) * .6 * sc;
    return [nx + side * .17 * sc * cl + .03 * sc * sl, ny + .04 * sc];
  }
  function ik(sh, tg, sc, bend) {
    const l1 = .3 * sc, l2 = .29 * sc; let dx = tg[0] - sh[0], dy = tg[1] - sh[1], d = hyp(dx, dy);
    const dm = (l1 + l2) * .995; if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; } d = Math.max(d, Math.abs(l1 - l2) + 1);
    const a1 = Math.atan2(dx, dy) + bend * Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const el = [sh[0] + Math.sin(a1) * l1, sh[1] + Math.cos(a1) * l1];
    return [a1, Math.atan2(sh[0] + dx - el[0], sh[1] + dy - el[1])];
  }
  const NULLG = document.createElement('canvas').getContext('2d');
  const joints = (pose, x, y, sc) => figure(NULLG, pose, { x, y, sc });
  const reachArm = (pose, x, y, sc, side, tg, bend) => { const k = side > 0 ? 'aR' : 'aL'; pose[k] = ik(shoulderOf(pose, x, y, sc, side), tg, sc, bend); };

  // ---------- the strings: haul below, move above, one beat later ----------
  // events: [haulTime, target]. The limb reaches its target LAG after the haul.
  function gest(t, evs, v0 = 0, dur = .42) { let v = v0; for (const [t0, to] of evs) v = lerp(v, to, ease.back(inv(t0 + LAG, t0 + LAG + dur, t))); return v; }
  function haulAmt(t, evs) {
    let h = 0;
    for (const [t0] of evs) {
      if (t < t0) h -= .4 * smooth(inv(t0 - .3, t0, t));
      else h += ease.out(inv(t0, t0 + .16, t)) * (1 - .8 * smooth(inv(t0 + .45, t0 + 1.3, t)));
    }
    return h;
  }
  const CF = 1130; // cellar floor
  const ROPE = {
    R: { hole: [1080, FL], top: [1125, 210], under: [1080, 790], low: [1080, CF - 14], dir: [1, 0], d0: 90, gap: 92, n: 4, sz: 70, seed: 10, hue: .2 },
    L: { hole: [840, FL], top: [795, 210], under: [840, 790], low: [840, CF - 14], dir: [-1, 0], d0: 90, gap: 92, n: 4, sz: 70, seed: 20, hue: .45 },
    H: { hole: [960, FL], top: [960, 130], under: [960, 790], low: null, dir: [0, 1], d0: 90, gap: 84, n: 3, sz: 64, seed: 30, hue: .75 },
  };
  const ropeStart = (r) => r.low || r.under;
  const ropeFar = (r) => { const o = ropeStart(r), L = r.d0 + r.gap * r.n + (r.low ? 30 : -20); return [o[0] + r.dir[0] * L, o[1] + r.dir[1] * L]; };
  const ropePath = (r, end) => r.low ? [ropeFar(r), r.low, r.under, r.hole, r.top, end] : [ropeFar(r), r.under, r.hole, r.top, end];
  // above-floor string (hole -> pulley in the flies -> limb); a = visibility
  function stringAbove(t, r, end, a, tw = 0) {
    const mid = [(r.top[0] + end[0]) / 2 + tw * Math.sin(t * 60) * 6, (r.top[1] + end[1]) / 2];
    stroke(s, [r.hole, r.top], `rgba(40,24,14,${.5 * a})`, 2);
    both(() => {
      f.globalCompositeOperation = 'lighter';
      stroke(f, [r.hole, r.top], `rgba(255,200,120,${.2 * a})`, 1.6);
      stroke(f, [r.top, mid, end], `rgba(255,210,140,${.32 * a})`, 1.8);
    });
    stroke(s, [r.top, [r.top[0], -400]], '#140a0a', 3);
    dot(s, r.top[0], r.top[1], 13, '#2a1a10'); dot(f, r.top[0], r.top[1], 3, `rgba(255,210,140,${.6 * a})`);
  }
  // the pulse racing along a rope from the crew to the limb, and the flare when it lands
  function pulses(t, r, end, evs, a = 1, landR = 90) {
    const P = ropePath(r, end);
    for (const [t0] of evs) {
      const u = inv(t0, t0 + LAG, t);
      if (u > 0 && u < 1) {
        both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, partial(P, u), `rgba(255,190,110,${.45 * a})`, 3); });
        for (let k = 0; k < 6; k++) { const p = along(P, u - k * .012); dot(f, p[0], p[1], 7 - k, `rgba(255,${240 - k * 20},${200 - k * 25},${a * (1 - k / 7)})`); }
        const p = along(P, u); glow(p[0], p[1], 60, `rgba(255,190,110,${.7 * a})`);
      }
      const land = hit(t, t0 + LAG, 5);
      if (land > .02) { glow(end[0], end[1], landR, `rgba(255,200,120,${.8 * land * a})`); dot(f, end[0], end[1], 6 * land, `rgba(255,245,220,${land * a})`); }
    }
  }
  const pulley = (x, y) => { dot(s, x, y, 22, '#3a2414'); dot(s, x, y, 9, '#c8983e'); };
  // below-floor rope + hauling crew of embers: tug-of-war on the floor, or bell-ringers on the vertical head rope
  function crew(t, r, evs, o = {}) {
    const h = haulAmt(t, evs), [dx, dy] = r.dir, o0 = ropeStart(r), vert = !r.low;
    const far = ropeFar(r), tw = Math.max(0, ...evs.map(([t0]) => hit(t, t0, 5))) * Math.sin(t * 55) * 6;
    const mid = [(o0[0] + far[0]) / 2 - dy * tw, (o0[1] + far[1]) / 2 + dx * tw];
    const rope = r.low ? [r.hole, r.under, r.low, mid, far] : [r.hole, r.under, mid, far];
    pulley(r.under[0], r.under[1]); if (r.low) pulley(r.low[0], r.low[1]);
    const lit = o.lit ?? 1, hands = [];
    for (let i = 0; i < r.n; i++) {
      const sd = r.seed + i, dist = r.d0 + i * r.gap + h * 50 + Math.sin(t * 2.1 + sd) * 2;
      const px = o0[0] + dx * dist, py = o0[1] + dy * dist, sz = r.sz * (1 - i * .05);
      let bx, by, lean;
      const hp = Math.max(0, h);
      if (vert) { bx = px + (i % 2 ? 1 : -1) * sz * .42; by = py + sz * .45 - bob(t + i * .12) * 4; lean = (i % 2 ? -.12 : .12); }
      else { bx = px + dx * sz * .18 * hp; by = CF - bob(t + i * .15) * 4 * (1 - hp); lean = dx * (.06 + .3 * hp); }
      const look = o.look !== undefined ? (typeof o.look === 'function' ? o.look(i) : o.look) : (vert ? snoise(t * .9, sd) * .8 : -dx * .9);
      ember(t, bx, by, sz, { seed: sd, hue: r.hue + i * .05, mood: o.mood || (h > .25 ? 'fierce' : 'calm'), look, lean, lit, eyes: o.eyes ?? 1 });
      hands.push([bx, by, sz, px, py]);
    }
    stroke(s, rope, '#c8995a', 7);
    both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, rope, 'rgba(255,190,110,.16)', 2); });
    for (const [bx, by, sz, px, py] of hands) {
      if (!vert) glow(bx, CF + 10, sz * 1.2, `rgba(255,140,60,${.1 * lit})`);
      for (const sgn of [-1, 1]) {
        const side = vert ? Math.sign(px - bx) : sgn, sx = bx + side * sz * .3, sy = by - sz * (vert ? .3 + sgn * .1 : .22);
        const hx = vert ? px : px + sgn * 16, hy = vert ? py + sgn * 16 : py;
        stroke(f, [[sx, sy], [hx, hy]], `rgba(255,190,110,${.9 * lit})`, 4); dot(f, hx, hy, 5, `rgba(255,220,170,${lit})`);
      }
    }
  }

  // ---------- the theatre ----------
  const TREE_X = 1440;
  const BRANCH = [[1352, 468], [1508, 438], [1432, 392], [1560, 508]];
  function tree(t) {
    const sw = Math.sin(t * .9) * .01;
    both(() => {
      s.translate(TREE_X, FL - 6); s.rotate(sw); s.translate(-TREE_X, -(FL - 6));
      poly(s, [[TREE_X - 22, FL - 4], [TREE_X - 12, 520], [TREE_X - 70, 470], [TREE_X - 90, 470], [TREE_X - 8, 500], [TREE_X - 4, 420], [TREE_X + 6, 420], [TREE_X + 10, 480], [TREE_X + 70, 440], [TREE_X + 80, 446], [TREE_X + 14, 510], [TREE_X + 22, FL - 4]], '#3b2414');
      for (const [bx, by, r] of [[1440, 400, 90], [1360, 450, 70], [1520, 440, 78], [1440, 330, 60], [1570, 500, 50], [1310, 500, 44]]) { s.fillStyle = '#1f3a2a'; s.beginPath(); s.ellipse(bx, by, r, r * .7, 0, 0, TAU); s.fill(); }
      for (const [bx, by, r] of [[1410, 370, 40], [1340, 430, 30], [1500, 410, 36]]) { s.fillStyle = '#2f5238'; s.beginPath(); s.ellipse(bx, by, r, r * .6, 0, 0, TAU); s.fill(); }
      // flat's wooden brace, a tell that it's scenery
      stroke(s, [[TREE_X + 30, FL - 4], [TREE_X + 90, 560]], '#5a3a1e', 6);
    });
  }
  function stone(x, y, k = 1) {
    s.fillStyle = '#4f4a5c'; s.beginPath(); s.moveTo(x - 30 * k, y); s.lineTo(x - 30 * k, y - 50 * k); s.quadraticCurveTo(x, y - 82 * k, x + 30 * k, y - 50 * k); s.lineTo(x + 30 * k, y); s.fill();
    s.fillStyle = '#7d7488'; s.beginPath(); s.moveTo(x - 30 * k, y); s.lineTo(x - 30 * k, y - 50 * k); s.quadraticCurveTo(x - 14 * k, y - 72 * k, x, y - 70 * k); s.lineTo(x - 6 * k, y); s.fill();
  }
  function theatreBack(t, o = {}) {
    fill(s, '#1c0710');
    for (let i = 0; i < 16; i++) { s.fillStyle = i % 2 ? '#26091a' : '#1a0510'; s.fillRect(-500 + i * 190, -600, 190, 2400); }
    for (const x of [60, 1860]) { dot(s, x, 400, 18, '#ffcf80'); glow(x, 400, 160, 'rgba(255,170,90,.3)'); }
    // the painted drop: night, a cardboard moon, painted hills
    s.fillStyle = vgrad(s, 100, 660, [[0, '#121845'], [.6, '#262a68'], [1, '#48346e']]); s.fillRect(230, 60, 1460, 640);
    const mx = 1250 + Math.sin(t * 1.1) * 8, my = 300;
    stroke(s, [[mx, 60], [mx, my - 64]], '#0c0c18', 3);
    dot(s, mx, my, 64, '#f1dca8'); dot(s, mx + 26, my - 8, 58, '#262a68');
    glow(mx - 20, my, 220, 'rgba(255,220,160,.12)');
    for (let i = 0; i < 18; i++) { const r = rng(90 + i); dot(s, 260 + r() * 1400, 90 + r() * 280, 3 + r() * 2, '#c9c0e0'); }
    ridge(s, 590, 90, .004, 21, '#1d3050', 230, 1690, 700);
    ridge(s, 630, 60, .006, 22, '#13213b', 230, 1690, 700);
    // stage floor
    s.fillStyle = vgrad(s, 640, 732, [[0, '#4a2a1a'], [1, '#7a4a2a']]); poly(s, [[230, 640], [1690, 640], [1760, 732], [160, 732]], s.fillStyle);
    for (let k = 1; k < 5; k++) { const y = lerp(640, 732, k / 5); stroke(s, [[230 - k * 16, y], [1690 + k * 16, y]], 'rgba(30,14,8,.6)', 2); }
    // spotlight: a cone of dust and a pool
    const sp = o.spot ?? 1, sx = o.spotX ?? FX;
    if (sp > 0) {
      s.fillStyle = `rgba(255,226,170,${.13 * sp})`; poly(s, [[sx - 50, 40], [sx + 50, 40], [sx + 230, FL + 10], [sx - 230, FL + 10]], s.fillStyle);
      s.fillStyle = rgrad(s, sx, FL, 10, 260, [[0, `rgba(255,214,150,${.85 * sp})`], [1, 'rgba(255,200,130,0)']]); s.beginPath(); s.ellipse(sx, FL - 2, 250, 38, 0, 0, TAU); s.fill();
      glow(sx, FL - 120, 360, `rgba(255,190,120,${.16 * sp})`);
    }
  }
  function curtainPanel(x0, x1, y0, y1, side, t, open) { // side -1 gathers left, +1 right
    const n = 7, w = (x1 - x0) / n;
    for (let k = 0; k < n; k++) {
      const fold = .5 + .5 * Math.sin(k * 1.9 + t * 1.5 + side);
      s.fillStyle = `rgb(${118 + fold * 72 | 0},${14 + fold * 16 | 0},${26 + fold * 12 | 0})`;
      const xa = x0 + k * w, xb = xa + w, flare = side * open * 22 * (k / n);
      s.beginPath(); s.moveTo(xa, y0); s.lineTo(xb, y0); s.lineTo(xb + flare + w * .1, y1); s.lineTo(xa + flare - w * .05, y1); s.fill();
    }
    s.fillStyle = '#d4a040'; s.fillRect(x0 - 6, y1 - 8, x1 - x0 + 30, 12);
  }
  function theatreFront(t, o = {}) {
    // legs (side curtains) and the house curtain
    curtainPanel(160, 360, 60, 740, -1, t, 1); curtainPanel(1560, 1760, 60, 740, 1, t, 1);
    const c = o.curtain ?? 0;
    if (c > 0) { const g = 730 * c; curtainPanel(230, 230 + g, 60, 735, -1, t, 1 - c); curtainPanel(1690 - g, 1690, 60, 735, 1, t, 1 - c); }
    // valance
    s.fillStyle = '#8a1420'; s.beginPath(); s.moveTo(180, 40); for (let k = 0; k <= 10; k++) s.quadraticCurveTo(180 + (k + .5) * 156, 200, 180 + (k + 1) * 156, 60); s.lineTo(1760, 40); s.fill();
    // proscenium
    poly(s, [[120, 1000], [120, 0], [960, -90], [1800, 0], [1800, 1000], [1740, 1000], [1740, 50], [960, -30], [180, 50], [180, 1000]], '#c8983e');
    s.fillStyle = '#3a2410'; s.fillRect(-600, -700, 720, 2000); s.fillRect(1800, -700, 720, 2000); s.fillRect(-600, -700, 3120, 640);
    // stage lip + footlights
    const house = o.house || 'audience';
    if (house === 'audience') {
      s.fillStyle = '#2a0f0c'; s.fillRect(100, 732, 1720, 90); s.fillStyle = '#c8983e'; s.fillRect(100, 730, 1720, 6);
      for (let x = 250; x <= 1670; x += 80) { dot(s, x, 730, 11, '#ffe6b0'); glow(x, 724, 70, `rgba(255,200,130,${.28 * (o.foot ?? 1)})`); }
      s.fillStyle = '#12040a'; s.fillRect(-600, 820, 3120, 800);
      for (const row of o.rows || ROWS) for (const a of row.seats) seatHead(t, a.x, row.y, row.k, a.i, a);
    }
  }
  // a researcher in the house, seen from behind: shoulders, egg head, warm rim from the stage, velvet seat back in front
  function seatHead(t, x, y, k, i, o = {}) {
    const nod = o.nod ? o.nod(t) : bob(t + hash(i) * .3) * 3 * (hash(i + 5) > .5 ? 1 : .3);
    const tilt = o.tilt ? o.tilt(t) : snoise(t * .4, i) * .08;
    s.fillStyle = '#0e0f1a'; s.beginPath(); s.ellipse(x, y + 34 * k, 60 * k, 40 * k, 0, 0, TAU); s.fill();
    occlude(() => { f.fillStyle = '#000'; f.beginPath(); f.ellipse(x, y + 34 * k, 60 * k, 40 * k, 0, 0, TAU); f.fill(); f.beginPath(); f.ellipse(x, y - 22 * k + nod * k, 25 * k, 31 * k, tilt, 0, TAU); f.fill(); f.fillRect(x - 50 * k, y + 26 * k, 100 * k, 90 * k); });
    both(() => {
      for (const g of [s, f]) { g.translate(x, y - 22 * k + nod * k); g.rotate(tilt); }
      s.fillStyle = '#0c0d17'; s.beginPath(); s.ellipse(0, 0, 25 * k, 31 * k, 0, 0, TAU); s.fill();
      f.globalCompositeOperation = 'lighter'; f.strokeStyle = `rgba(255,170,100,${.45})`; f.lineWidth = 2.5 * k; f.beginPath(); f.arc(0, 0, 26 * k, -2.6, -.5); f.stroke();
      if (o.glint) for (const d of [0, 1]) dot(f, o.glint * (20 + d * 12) * k, 2 * k, 3 * k, 'rgba(230,240,255,.9)');
    });
    if (o.book) { const w = o.book(t); if (w > 0) { both(() => { s.translate(x + 38 * k, y + 18 * k); s.rotate(-.2); s.fillStyle = '#a89878'; s.fillRect(-18 * k, -13 * k, 36 * k, 26 * k); s.fillStyle = '#3a3028'; s.fillRect(-18 * k, -13 * k, 4 * k, 26 * k); }); } }
    s.fillStyle = '#4a0c18'; s.beginPath(); s.moveTo(x - 50 * k, y + 110 * k); s.lineTo(x - 50 * k, y + 26 * k); s.quadraticCurveTo(x, y + 8 * k, x + 50 * k, y + 26 * k); s.lineTo(x + 50 * k, y + 110 * k); s.fill();
    s.fillStyle = '#6a1424'; s.fillRect(x - 50 * k, y + 24 * k, 100 * k, 6 * k);
  }
  const mkRow = (y, k, xs, i0, extra = {}) => ({ y, k, seats: xs.map((x, j) => ({ x, i: i0 + j, ...(extra[j] || {}) })) });
  const scribble = (t) => 1;
  const ROWS = [
    mkRow(860, 1.0, [300, 470, 640, 810, 1110, 1280, 1450, 1620], 0, { 2: { book: scribble }, 5: { book: scribble } }),
    mkRow(950, 1.35, [200, 420, 640, 1280, 1500, 1720], 10, { 1: { book: scribble }, 4: { book: scribble } }),
    mkRow(1070, 1.8, [120, 420, 1500, 1800], 20),
  ];

  // the poured one on stage: base pose + string gestures
  const ARM_R = [1.35, 2.55], ARM_L = [-1.35, -2.55];
  function speakPose(t, gR, gL, amt = 1) {
    const g = groove(POSE.stand, 'idle', t, amt), p = g.pose;
    p.aR = [lerp(p.aR[0], ARM_R[0], gR), lerp(p.aR[1], ARM_R[1], gR)];
    p.aL = [lerp(p.aL[0], ARM_L[0], gL), lerp(p.aL[1], ARM_L[1], gL)];
    p.head -= .12 * (gR + gL) * .5;
    return g;
  }
  const hipY = (sc) => FL - .885 * sc;

  // ================= SHOTS =================
  const EV_R1 = [[BT(93), 1]];           // haul 67.03 -> arm up on the downbeat 67.73 ("chose")
  const EV_L1 = [[BT(97), 1]];           // haul 69.87 -> other arm up 70.57

  // 1 · the curtain opens on the small velvet theatre (66.3)
  function frontRow(t, lt, dur) {
    const open = lerp(.3, 1, ease.inOut(inv(66.3, 67.2, t)));
    const z = t < 67.25 ? lerp(2.35, 1.0, ease.out(inv(66.3, 67.25, t))) : lerp(1.0, 1.22, ease.sine(inv(67.25, 69.13, t)));
    const cy = t < 67.25 ? lerp(560, 520, ease.out(inv(66.3, 67.25, t))) : lerp(520, 470, ease.sine(inv(67.25, 69.13, t)));
    const [hx, hy] = shake(t, 5 * hit(t, BT(94), 6));
    cam(FX + hx + sway(t) * 6, cy + hy, z, .01 * sway(t * .5));
    theatreBack(t, { spot: .3 + .7 * open });
    const gR = gest(t, EV_R1);
    const g = speakPose(t, gR, 0), y = hipY(SC);
    const gx = 230 + 730 * (1 - open);
    f.save(); f.beginPath(); f.rect(gx, -500, 1920 - 2 * gx, 2000); f.clip();
    const J = pouredOne(t, g.pose, FX + g.dx, y + g.dy, SC, { eyes: .8 });
    stringAbove(t, ROPE.R, J.hdR, .5); stringAbove(t, ROPE.L, J.hdL, .5); stringAbove(t, ROPE.H, J.head, .5);
    pulses(t, ROPE.R, J.hdR, EV_R1, .9);
    f.restore();
    theatreFront(t, { curtain: 1 - open, foot: .4 + .6 * open });
    if (open < 1) glow(FX, 450, 300, `rgba(255,220,160,${.35 * (1 - open)})`);
  }

  // 2 · cutaway: down through the floor to the crew, and back up with the pull
  function cutaway(t, lt, dur) {
    const keys = [[69.13, 470], [69.72, 1000], [70.0, 985], [70.62, 440], [71.97, 410]];
    const cy = kf(t, keys, ease.inOut), cy2 = kf(t + 1 / 60, keys, ease.inOut);
    const z = kf(t, [[69.13, 1.45], [69.72, 1.5], [70.0, 1.58], [70.62, 1.3], [71.97, 1.42]]);
    whip(0, clamp((cy2 - cy) * 60 * .014, -40, 40));
    cam(FX + sway(t) * 8, cy, z, 0);
    sectionWorld(t, (J) => { pulses(t, ROPE.L, J.hdL, EV_L1); }, { gR: 1, evL: EV_L1, evR: [], evH: [] });
  }
  // stage above + cellar below, cut in section
  function sectionWorld(t, extra, o) {
    theatreBack(t, { spot: 1 });
    const gR = o.gR ?? 0, gL = gest(t, o.evL || []);
    const g = o.pose ? { pose: o.pose(t), dx: 0, dy: 0 } : speakPose(t, gR, gL);
    const y = hipY(SC);
    const Jp = joints(g.pose, FX + g.dx, y + g.dy, SC);
    for (const k of ['R', 'L', 'H']) stringAbove(t, ROPE[k], k === 'R' ? Jp.hdR : k === 'L' ? Jp.hdL : Jp.head, 1);
    const J = pouredOne(t, g.pose, FX + g.dx, y + g.dy, SC, { eyes: .8 });
    tree(t);
    curtainPanel(160, 360, 60, 740, -1, t, 1); curtainPanel(1560, 1760, 60, 740, 1, t, 1);
    // the floor, cut open
    s.fillStyle = '#5a3420'; s.fillRect(-800, FL, 3520, 26); s.fillStyle = '#8a5a34'; s.fillRect(-800, FL, 3520, 5);
    s.fillStyle = '#2a160c'; s.fillRect(-800, FL + 26, 3520, 18);
    s.fillStyle = vgrad(s, FL + 44, 1500, [[0, '#1c0d09'], [1, '#070304']]); s.fillRect(-800, FL + 44, 3520, 1200);
    for (let x = -300; x < 2300; x += 230) { s.fillStyle = '#2c160e'; s.fillRect(x, FL + 44, 26, CF - FL - 44); s.fillStyle = '#3a2014'; s.fillRect(x, FL + 44, 6, CF - FL - 44); }
    s.fillStyle = vgrad(s, CF, CF + 300, [[0, '#3a2012'], [1, '#120806']]); s.fillRect(-800, CF, 3520, 600);
    s.fillStyle = '#5a3420'; s.fillRect(-800, CF, 3520, 5);
    for (const k of ['R', 'L', 'H']) { const r = ROPE[k]; s.fillStyle = '#0a0404'; s.fillRect(r.hole[0] - 7, FL, 14, 44); }
    glow(FX, 1050, 800, 'rgba(255,110,40,.16)');
    crew(t, ROPE.R, o.evR || [], o.crewR || {}); crew(t, ROPE.L, o.evL || [], o.crewL || {}); crew(t, ROPE.H, o.evH || [], o.crewH || {});
    extra && extra(J);
    return J;
  }

  // 3 · the mouth opens and birds of light fly to the painted tree, one landing per beat
  const BIRD_L = [BT(100), BT(101), BT(102), BT(103)];
  function mouthOpen(t) { let m = 0; for (const L of BIRD_L) m = Math.max(m, t < L ? smooth(inv(L - .14, L, t)) : 1 - smooth(inv(L + .12, L + .42, t))); return m; }
  function bird(t, x, y, ang, flap, k, a = 1) {
    both(() => {
      f.translate(x, y); f.rotate(ang); f.globalCompositeOperation = 'lighter';
      const wy = Math.sin(flap) * 13 * k;
      f.fillStyle = `rgba(255,236,190,${a})`; f.beginPath(); f.ellipse(0, 0, 11 * k, 5 * k, 0, 0, TAU); f.fill();
      stroke(f, [[-2 * k, 0], [-10 * k, -wy - 4 * k], [-20 * k, -wy * .6 - 8 * k]], `rgba(255,220,160,${a})`, 3.5 * k);
      stroke(f, [[-2 * k, 0], [-8 * k, wy * .5 - 3 * k], [-16 * k, wy * .3 - 6 * k]], `rgba(255,200,140,${.7 * a})`, 3 * k);
      dot(f, 9 * k, -1 * k, 3.2 * k, `rgba(255,250,235,${a})`);
    });
    glow(x, y, 42 * k, `rgba(255,200,120,${.45 * a})`);
  }
  function birds(t, lt, dur) {
    const cx = kf(t, [[71.97, FX + 20], [72.5, FX + 90], [74.8, 1330]], ease.inOut), cy = kf(t, [[71.97, 470], [74.8, 440]]);
    const z = kf(t, [[71.97, 2.3], [74.8, 1.75]], ease.out);
    cam(cx, cy, z, .015 * sway(t));
    theatreBack(t, { spot: 1 });
    tree(t);
    const m = mouthOpen(t);
    const g = speakPose(t, .45, .45); g.pose.head -= .22 * m + .1; g.pose.lean -= .03 * m;
    const x = FX + g.dx, y = hipY(SC) + g.dy;
    const Jp = joints(g.pose, x, y, SC);
    stringAbove(t, ROPE.R, Jp.hdR, .5); stringAbove(t, ROPE.L, Jp.hdL, .5); stringAbove(t, ROPE.H, Jp.head, .7);
    const J = pouredOne(t, g.pose, x, y, SC, { eyes: .9 });
    pulses(t, ROPE.H, [J.head[0], J.head[1] - 18], BIRD_L.map((L) => [L - LAG, 1]), .55, 30);
    const mx = J.head[0] + 3, my = J.head[1] + 7;
    if (m > .02) { s.fillStyle = '#3a1406'; s.beginPath(); s.ellipse(mx, my, 5, 6 * m, 0, 0, TAU); s.fill(); glow(mx, my, 20, `rgba(255,230,170,${.45 * m})`); }
    BIRD_L.forEach((L, i) => {
      if (t < L) return;
      const B = BRANCH[i], P = bez([mx, my], [mx + 60, my - 170 - i * 20], [B[0] - 140, B[1] - 220], [B[0], B[1] - 6], 40);
      const u = inv(L, L + LAG, t), e = ease.inOut(u);
      if (u < 1) {
        const p = along(P, e), q = along(P, Math.min(1, e + .02));
        for (let k = 1; k < 6; k++) { const tp = along(P, Math.max(0, e - k * .025)); dot(f, tp[0], tp[1], 3 - k * .4, `rgba(255,210,150,${.5 - k * .08})`); }
        bird(t, p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]), t * 34 + i, lerp(.8, 1.3, Math.sin(u * Math.PI)));
      } else {
        const land = hit(t, L + LAG, 6), hop = bob(t + i * .2) * 4;
        bird(t, B[0], B[1] - 8 - hop - land * 10, -.15 + land * .4 + Math.sin(t * 3 + i) * .08, 1.2 + land * 3, 1.05);
        if (land > .05) glow(B[0], B[1], 120, `rgba(255,220,150,${.6 * land})`);
      }
    });
  }

  // 4 · the polite little sign: "I should note..." — a scribble on paper, never words
  const T_SIGN = when('should', 74.4), T_BOW = BT(106);
  function paperSign(x, y, w, h, ang, a = 1) {
    both(() => {
      s.translate(x, y); s.rotate(ang);
      s.fillStyle = '#efe3c4'; s.fillRect(-w / 2, -h / 2, w, h);
      s.fillStyle = '#c9b88e'; s.fillRect(-w / 2, h / 2 - 5, w, 5);
      for (let k = 0; k < 3; k++) { const yy = -h * .25 + k * h * .22, pts = []; for (let i = 0; i <= 14; i++) pts.push([-w * .38 + i * w * .76 / 14 * (k === 2 ? .6 : 1), yy + Math.sin(i * 2.1 + k * 3) * h * .06]); stroke(s, pts, '#2c2a3a', Math.max(2.5, h * .06)); }
    });
    glow(x, y, w * .9, `rgba(255,236,200,${.12 * a})`);
  }
  function signShot(t, lt, dur) {
    const z = kf(t, [[74.8, 1.95], [77.6, 2.15]], ease.sine);
    cam(kf(t, [[74.8, 850], [77.6, 880]], ease.sine) + sway(t) * 10, kf(t, [[74.8, 615], [77.6, 600]], ease.sine), z, .012 * sway(t * .5));
    theatreBack(t, { spot: 1 });
    tree(t);
    const up = ease.back(inv(T_SIGN, T_SIGN + .38, t)), bow = Math.sin(Math.PI * inv(T_BOW, T_BOW + .9, t)) * (t > T_BOW ? 1 : 0);
    const g = groove(POSE.stand, 'idle', t, 1), p = g.pose;
    const x = FX + g.dx, y = hipY(SC) + g.dy + bow * 10;
    p.lean += bow * .08; p.head += bow * .45 - up * .05;
    const sx = x + lerp(38, 2, up), sy = lerp(640, 540, up) + bow * 22, sw = lerp(56, 92, up), sh = lerp(40, 64, up);
    reachArm(p, x, y, SC, 1, [sx + sw * .42 * up + 4 * (1 - up), sy + sh * .35], -1);
    if (up > .05) reachArm(p, x, y, SC, -1, [sx - sw * .42, sy + sh * .35], 1);
    const Jp = joints(p, x, y, SC);
    stringAbove(t, ROPE.R, Jp.hdR, .45); stringAbove(t, ROPE.L, Jp.hdL, .45); stringAbove(t, ROPE.H, Jp.head, .45);
    pouredOne(t, p, x, y, SC, { eyes: .9 });
    paperSign(sx, sy, sw, sh, (1 - up) * .5 + bow * .12);
    stone(700, FL + 2, 1);
    const nod = (i) => (tt) => (tt > T_SIGN + .5 ? bob(tt + i * .1) * 7 : 0) + hit(tt, T_BOW + .15 + i * .12, 4) * 16;
    theatreFront(t, { rows: [
      mkRow(815, 2.0, [600, 770, 1330], 40, { 0: { book: scribble, nod: nod(0), tilt: () => .05 }, 1: { nod: nod(1) }, 2: { book: scribble, nod: nod(2) } }),
      mkRow(960, 3.0, [420, 1180], 50, { 1: { book: scribble, nod: nod(3) } }),
    ] });
  }

  // 5 · it kneels and lays the paper, with flowers, on a small stone at the stage edge (low angle)
  const T_KNEEL = when('lay', 77.6), T_PLACE = BT(110);
  const KNEEL = { lean: .32, head: .45, aL: [.35, .9], aR: [.9, 1.3], lL: [.15, -1.5], lR: [1.45, .05] };
  const BLOOM = ['#f4b8c4', '#fff0d8', '#e0607a', '#f7d27a', '#c9a0e0'];
  function bouquet(x, y, ang, k, t) {
    both(() => {
      s.translate(x, y); s.rotate(ang);
      for (let i = 0; i < 5; i++) stroke(s, [[0, 0], [(i - 2) * 6 * k, -34 * k]], '#3f6a3a', 3.5 * k);
      for (let i = 0; i < 5; i++) { const bx = (i - 2) * 7 * k + Math.sin(t * 2 + i) * k, by = -36 * k - (i % 2) * 8 * k; dot(s, bx, by, 8 * k, BLOOM[i]); dot(s, bx, by, 3 * k, '#fff4c0'); }
    });
  }
  function kneelShot(t, lt, dur) {
    cam(kf(t, [[77.6, 1060], [80.43, 1130]], ease.sine), kf(t, [[77.6, 640], [80.43, 700]], ease.sine), kf(t, [[77.6, 1.35], [80.43, 1.75]], ease.sine), -.03 + .01 * sway(t * .5));
    // painted drop seen from the floor
    s.fillStyle = vgrad(s, -100, 720, [[0, '#0f1440'], [.7, '#2a2a68'], [1, '#4b3672']]); s.fillRect(-300, -300, 2600, 1100);
    const mx = 1560 + Math.sin(t * 1.1) * 8; dot(s, mx, 190, 84, '#f1dca8'); dot(s, mx + 34, 180, 76, '#2a2a68'); glow(mx - 20, 190, 280, 'rgba(255,220,160,.12)');
    ridge(s, 640, 110, .003, 21, '#1d3050', -300, 2300, 760); ridge(s, 690, 70, .005, 22, '#13213b', -300, 2300, 760);
    s.fillStyle = 'rgba(255,226,170,.12)'; poly(s, [[800, -300], [1000, -300], [1300, 830], [640, 830]], s.fillStyle);
    // the stage floor, very close to the lens
    s.fillStyle = vgrad(s, 740, 860, [[0, '#5a3420'], [1, '#9a6438']]); s.fillRect(-300, 740, 2600, 125);
    for (let k = -10; k <= 14; k++) stroke(s, [[900 + k * 30, 740], [900 + k * 190, 865]], 'rgba(40,18,8,.55)', 3);
    s.fillStyle = rgrad(s, 980, 810, 10, 420, [[0, 'rgba(255,214,150,.7)'], [1, 'rgba(255,200,130,0)']]); s.fillRect(500, 740, 1000, 125);
    const kneel = ease.inOut(inv(T_KNEEL - .3, T_KNEEL + .23, t)), place = ease.inOut(inv(T_KNEEL + .3, T_PLACE, t));
    const g = groove(mixPose(POSE.stand, KNEEL, kneel), 'idle', t, 1 - kneel * .5), p = g.pose, sc = 250;
    p.head += hit(t, BT(111), 2) * .25 * (t > BT(111) ? 1 : 0) + .15 * inv(79.2, 80.4, t);
    const x = 1000 + g.dx, y = lerp(830 - .885 * sc, 706, kneel) + g.dy;
    const hold = [x + 70 + kneel * 40, lerp(610, 700, kneel)], rest = [1195, 826];
    const hand = t < T_PLACE ? [lerp(hold[0], rest[0], place), lerp(hold[1], rest[1] - 6, place)] : [lerp(rest[0], x + 90, ease.inOut(inv(T_PLACE + .2, T_PLACE + .9, t))), lerp(rest[1] - 6, 700, ease.inOut(inv(T_PLACE + .2, T_PLACE + .9, t)))];
    reachArm(p, x, y, sc, 1, hand, -1);
    reachArm(p, x, y, sc, -1, [hand[0] - 30, hand[1] + 8], -1);
    pouredOne(t, p, x, y, sc, { eyes: .6 });
    stone(1240, 834, 3.1);
    const bq = t < T_PLACE ? [hand[0], hand[1]] : rest, bang = t < T_PLACE ? -.3 + place * -.9 : -1.35;
    paperSign(bq[0] + (t < T_PLACE ? 0 : 20), bq[1] + (t < T_PLACE ? -10 : 2), 70, 48, t < T_PLACE ? -.2 : -.05);
    bouquet(bq[0] - 6, bq[1] - 4, bang, 1.6, t);
    glow(1240, 790, 260, `rgba(255,200,140,${.1 + .25 * hit(t, T_PLACE, 3) * (t > T_PLACE ? 1 : 0)})`);
    // footlights, big and soft right in front of the lens
    s.fillStyle = '#1a070c'; s.fillRect(-300, 865, 2600, 500); s.fillStyle = '#c8983e'; s.fillRect(-300, 862, 2600, 7);
    for (let i = 0; i < 9; i++) { const fx = 200 + i * 240; dot(s, fx, 872, 30, '#ffe0a8'); glow(fx, 860, 190, 'rgba(255,190,110,.35)'); }
  }

  // 6 · the stone has no name; below the boards, an ember peeks up through a crack
  const T_PEEK = BT(113);
  function stoneClose(t, lt, dur) {
    const tilt = ease.inOut(inv(80.43, 81.05, t));
    const cy = lerp(470, 800, tilt) + Math.sin(t * 1.3) * 6, z = lerp(1.0, 1.35, tilt) + .03 * hit(t, T_PEEK, 4);
    paintSet({ strokeK: 1 + .45 * Math.sin(Math.PI * inv(80.6, 81.1, t)) });
    cam(960 + sway(t) * 12, cy, z, .01 * sway(t * .5));
    s.fillStyle = vgrad(s, -200, 720, [[0, '#141a44'], [1, '#3b2c62']]); s.fillRect(-300, -300, 2600, 1100);
    // the blank stone: an engraved panel with nothing in it
    s.fillStyle = '#4f4a5c'; s.beginPath(); s.moveTo(640, 760); s.lineTo(640, 250); s.quadraticCurveTo(960, -40, 1280, 250); s.lineTo(1280, 760); s.fill();
    s.fillStyle = rgrad(s, 820, 250, 20, 700, [[0, '#9a90a4'], [1, 'rgba(79,74,92,0)']]); s.beginPath(); s.moveTo(640, 760); s.lineTo(640, 250); s.quadraticCurveTo(960, -40, 1280, 250); s.lineTo(1280, 760); s.fill();
    s.strokeStyle = '#3a3546'; s.lineWidth = 12; s.beginPath(); s.moveTo(740, 640); s.lineTo(740, 300); s.quadraticCurveTo(960, 110, 1180, 300); s.lineTo(1180, 640); s.closePath(); s.stroke();
    // the floor: boards, a crack glowing warm
    s.fillStyle = '#6a3e24'; s.fillRect(-300, 760, 2600, 110);
    const crackY = 880;
    s.fillStyle = '#1a0804'; s.fillRect(-300, crackY - 12, 2600, 24);
    const peek = ease.back(inv(T_PEEK - .2, T_PEEK + .25, t)), look = t < T_PEEK + .6 ? 0 : Math.sin((t - T_PEEK - .6) * 4) * .9;
    glow(990, crackY + 10, 200, `rgba(255,140,60,${.15 + .15 * peek})`);
    ember(t, 1000, crackY + 190 - peek * 175, 160, { eyes: t > T_PEEK + 1.1 && t < T_PEEK + 1.2 ? .1 : 1, look, mood: 'scared', hue: .3, seed: 7 });
    occlude(() => { f.fillStyle = '#000'; f.fillRect(-300, crackY + 10, 2600, 400); });
    s.fillStyle = '#7a4a2c'; s.fillRect(-300, crackY + 10, 2600, 300); s.fillStyle = '#8f5a34'; s.fillRect(-300, crackY + 10, 2600, 8);
    for (let k = 0; k < 6; k++) stroke(s, [[-300, crackY + 70 + k * 55], [2300, crackY + 70 + k * 55]], 'rgba(40,18,8,.5)', 3);
    paperSign(900, 740, 90, 60, -.08); bouquet(1060, 752, -1.3, 2.2, t);
  }

  // 7 · split level: three embers heave three ropes on push / pull / lean; the figure moves a beat later
  const T_PUSH = when('push', 82.5), T_PULL = when('pull', 83.3), T_LEAN = when('lean', 84);
  const PUSH = { lean: .14, head: .12, aL: [1.15, 1.4], aR: [1.45, 1.58], lL: [.3, 0], lR: [-.12, 0] };
  const PULL = { lean: -.2, head: -.15, aL: [-.55, -2.1], aR: [-.25, -2.4], lL: [.12, 0], lR: [-.32, 0] };
  const EV_P = [[T_PUSH, 1]], EV_Q = [[T_PULL, 1]], EV_N = [[T_LEAN, 1]];
  function splitPose(t) {
    const gi = groove(POSE.stand, 'idle', t, 1).pose;
    let p = mixPose(gi, PUSH, gest(t, EV_P));
    p = mixPose(p, PULL, gest(t, EV_Q));
    const n = gest(t, EV_N); p.lean += .42 * n; p.head += .3 * n; p.aL[0] += .6 * n; p.aR[0] += .3 * n;
    return p;
  }
  function splitLevel(t, lt, dur) {
    const F = t < T_PUSH ? [960, 770, 1.28, 0] : t < T_PULL ? [1060, 775, 1.36, .03] : t < T_LEAN ? [870, 772, 1.38, -.03] : [990, 760, 1.32, .012];
    const since = t - (t < T_PUSH ? 82.53 : t < T_PULL ? T_PUSH : t < T_LEAN ? T_PULL : T_LEAN);
    const drift = since * 14, pk = .05 * hit(t, t < T_PUSH ? 0 : t < T_PULL ? T_PUSH : t < T_LEAN ? T_PULL : T_LEAN, 7);
    const [hx, hy] = shake(t, 6 * Math.max(hit(t, T_PUSH, 8), hit(t, T_PULL, 8), hit(t, T_LEAN, 8)));
    cam(F[0] + drift * (F[3] >= 0 ? 1 : -1) + hx, F[1] - drift * .3 + hy, F[2] + pk + since * .03, F[3]);
    sectionWorld(t, (J) => {
      pulses(t, ROPE.R, J.hdR, EV_P); pulses(t, ROPE.L, J.hdL, EV_Q); pulses(t, ROPE.H, J.head, EV_N, 1, 60);
    }, { pose: splitPose, evR: EV_P, evL: EV_Q, evH: EV_N });
  }

  // 8 · a researcher in the front row sees a rope twitch in a crack of the stage lip and lowers her lantern to it
  const T_TW = [BT(119) + .29, BT(120)], T_LOWER = BT(121), CRACK = [1190, 776];
  function lipCrack(t, tw, lamp) {
    const X = CRACK[0], j = tw * Math.sin(t * 70) * 6;
    const edge = [[X - 6, 736], [X + 10, 752], [X - 4, 770], [X + 12, 792], [X, 818]];
    s.fillStyle = '#0a0306'; poly(s, [...edge.map(([x, y]) => [x - 16, y]), ...edge.slice().reverse().map(([x, y]) => [x + 16, y])], '#0a0306');
    s.fillStyle = `rgba(255,${140 + 70 * tw | 0},70,${.55 + .45 * tw})`; poly(s, [...edge.map(([x, y]) => [x - 8, y]), ...edge.slice().reverse().map(([x, y]) => [x + 8, y])], s.fillStyle);
    stroke(s, [[X - 14, 808 + j], [X + 14, 752 - j]], '#5a3016', 7);
    both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, [[X - 14, 808 + j], [X + 14, 752 - j]], `rgba(255,210,150,${.4 + .6 * tw})`, 3); });
    glow(X, CRACK[1], 60 + 60 * tw, `rgba(255,150,70,${.25 + .45 * tw})`);
    if (tw > .1) for (let k = 0; k < 8; k++) dot(f, X + (hash(k) - .5) * 80 * (1 - tw), CRACK[1] - 20 - (1 - tw) * 70 * hash(k + 9), 2.2, `rgba(255,220,170,${tw})`);
    if (lamp > 0) glow(X - 20, CRACK[1] + 10, 160, `rgba(255,200,130,${.25 * lamp})`);
  }
  function notice(t, lt, dur) {
    const push = ease.inOut(inv(86.3, 87.47, t));
    cam(lerp(1060, 1160, push) + sway(t) * 8, lerp(730, 772, push), lerp(1.7, 2.5, push), -.015);
    theatreBack(t, { spot: 1 });
    const p = splitPose(t); const x = FX, y = hipY(SC);
    const Jp = joints(p, x, y, SC);
    stringAbove(t, ROPE.R, Jp.hdR, .45); stringAbove(t, ROPE.L, Jp.hdL, .45); stringAbove(t, ROPE.H, Jp.head, .45);
    pouredOne(t, p, x, y, SC, { eyes: .8 });
    theatreFront(t, { rows: [] });
    const tw = Math.max(...T_TW.map((a) => hit(t, a, 5)));
    const lower = ease.inOut(inv(T_LOWER - .4, T_LOWER + .3, t));
    lipCrack(t, tw, lower);
    // her: front row, back to us; the head snaps to the twitch, then she leans in with the lantern
    const turn = ease.back(inv(T_TW[0] + .1, T_TW[0] + .35, t));
    const g = groove(POSE.sit, 'idle', t, 1 - lower), q = g.pose, sc = 480, hx = 850, hy2 = 1210;
    q.lean = lerp(.04, .42, lower) + turn * .06; q.head = lerp(-.05, .3, turn) + lower * .15;
    q.aL = [.25, .5];
    reachArm(q, hx, hy2, sc, 1, lower > 0 ? [lerp(1010, CRACK[0] - 60, lower), lerp(1080, CRACK[1] - 10, lower)] : [1000, 1090], -1);
    const J = researcher(q, hx + g.dx, hy2 + g.dy, sc, { lantern: 0, rim: 1, face: null, coat: '#14152a', rimC: 'rgba(255,170,100,.95)' });
    occlude(() => figure(f, q, { x: hx + g.dx, y: hy2 + g.dy, sc, color: '#000', coat: '#000', headC: '#000' }));
    const lx = J.hdR[0], ly = J.hdR[1] + 30;
    stroke(s, [J.hdR, [lx, ly]], '#111', 3); dot(s, lx, ly + 14, 16, P.gold);
    glow(lx, ly + 14, 150, `rgba(255,180,100,${.22 + .15 * lower})`); glow(lx, ly + 14, 30, 'rgba(255,235,190,.85)');
    s.fillStyle = '#4a0c18'; s.beginPath(); s.moveTo(640, 1500); s.lineTo(640, 1130); s.quadraticCurveTo(840, 1090, 1040, 1130); s.lineTo(1040, 1500); s.fill();
  }

  // 9 · through the crack: the crew at work in her lantern light; they look up; her glasses flare
  const T_THRU = 87.85, T_LOOKUP = BT(124) + .2, T_FLARE = BT(125), HOLE = [1300, 734];
  const EV_W = [[BT(122), 1], [BT(123), 1], [BT(124), 1]];
  function dive(t, lt, dur) {
    if (t < T_THRU) {
      const k = ease.in(inv(87.47, T_THRU, t));
      cam(CRACK[0], CRACK[1], lerp(3.0, 22, k), 0);
      whip(0, 30 * k);
      theatreBack(t, { spot: 1 }); theatreFront(t, { rows: [] });
      lipCrack(t, .6, 1);
      glow(CRACK[0], CRACK[1], 60, `rgba(255,220,170,${k})`);
      return;
    }
    const up = ease.inOut(inv(T_LOOKUP, T_FLARE - .05, t));
    const z = lerp(lerp(2.2, 1.45, ease.out(inv(T_THRU, T_THRU + .6, t))), 2.3, up);
    cam(lerp(1000, HOLE[0] - 40, up) + sway(t) * 10, lerp(970, HOLE[1] + 60, up), z, lerp(-.03, .02, up));
    fill(s, '#0c0506');
    s.fillStyle = vgrad(s, FL + 44, 1500, [[0, '#1c0d09'], [1, '#070304']]); s.fillRect(-800, FL + 44, 3520, 1200);
    for (let x = -300; x < 2300; x += 230) { s.fillStyle = '#2c160e'; s.fillRect(x, FL + 44, 26, CF - FL - 44); }
    s.fillStyle = vgrad(s, CF, CF + 300, [[0, '#3a2012'], [1, '#120806']]); s.fillRect(-800, CF, 3520, 600);
    s.fillStyle = '#3a2014'; s.fillRect(-800, FL - 80, 3520, 124); s.fillStyle = '#24110a'; for (let x = -800; x < 2800; x += 120) s.fillRect(x, FL - 80, 5, 124);
    // the knot hole and the beam through it
    const flare = hit(t, T_FLARE, 3) * (t >= T_FLARE ? 1 : 0);
    const beam = [[HOLE[0] - 26, HOLE[1] + 10], [HOLE[0] + 26, HOLE[1] + 10], [1150, CF + 20], [560, CF + 20]];
    poly(s, beam, 'rgba(200,130,60,.28)');
    both(() => { f.globalCompositeOperation = 'lighter'; poly(f, beam, `rgba(255,170,90,${.1 + .04 * Math.sin(t * 9)})`); });
    s.fillStyle = '#ffe2a8'; s.beginPath(); s.ellipse(HOLE[0], HOLE[1], 34, 22, 0, 0, TAU); s.fill();
    // her face in the hole: a dark head, two round lenses
    s.fillStyle = '#1a1622'; s.beginPath(); s.ellipse(HOLE[0] + 4, HOLE[1] - 4, 30, 18, 0, 0, TAU); s.fill();
    for (const d of [-1, 1]) {
      const gx = HOLE[0] + 4 + d * 13, gy = HOLE[1] - 2;
      both(() => { f.globalCompositeOperation = 'lighter'; f.strokeStyle = `rgba(230,240,255,${.6 + .4 * flare})`; f.lineWidth = 2.5; f.beginPath(); f.arc(gx, gy, 9, 0, TAU); f.stroke(); });
      dot(f, gx - 3, gy - 3, 3, 'rgba(255,255,255,.9)');
    }
    glow(HOLE[0], HOLE[1], 140, 'rgba(255,210,150,.45)');
    const look = (i) => lerp(-.2 + snoise(t, i) * .3, .9, ease.out(inv(T_LOOKUP, T_LOOKUP + .25, t)));
    const scared = t > T_LOOKUP ? 'scared' : undefined;
    crew(t, ROPE.R, EV_W, { look, mood: scared }); crew(t, ROPE.L, EV_W, { look, mood: scared }); crew(t, ROPE.H, EV_W, { look, mood: scared });
    if (flare > 0) {
      for (const d of [-1, 1]) glow(HOLE[0] + 4 + d * 13, HOLE[1] - 2, 110 * flare + 20, `rgba(230,240,255,${.8 * flare})`);
      both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, [[HOLE[0] - 700 * flare, HOLE[1]], [HOLE[0] + 700 * flare, HOLE[1]]], `rgba(220,235,255,${.5 * flare})`, 4); });
    }
    flash(.5 * hit(t, T_THRU, 7) + .28 * flare * (t > T_FLARE ? 1 : 0) + .5 * ease.in(inv(90.0, 90.3, t)), '#fff2dc');
  }

  // ---------- the lecture room chalkboard ----------
  const circ = (x, y, r, a0 = -Math.PI / 2, n = 28) => Array.from({ length: n + 1 }, (_, i) => [x + Math.cos(a0 + i / n * TAU) * r, y + Math.sin(a0 + i / n * TAU) * r]);
  const CH = {
    ember: [...bez([520, 300], [650, 420], [630, 620], [520, 620], 16), ...bez([520, 620], [410, 620], [390, 420], [520, 300], 16).slice(1)],
    eyeL: [[492, 500], [494, 526]], eyeR: [[550, 500], [552, 526]],
    head: circ(1400, 330, 42), body: [[1400, 372], [1402, 560]], legs: [[1348, 700], [1402, 560], [1452, 700]],
    armL: [[1400, 420], [1334, 505]], armR: [[1400, 420], [1466, 338], [1500, 256]],
    shaft: bez([660, 474], [860, 456], [1080, 486], [1266, 468], 20), headA: [[1212, 426], [1270, 468]], headB: [[1212, 512], [1270, 468]],
  };
  // [key, t0, t1] — the order and timing the chalk goes on
  const T_EYES = BT(127), T_ARM = BT(129), T_ARROW = when('proved', 93), T_AHEAD = when('action', 94.5), T_CRACK = BT(133);
  const PLAN = [
    ['ember', 90.32, 90.95], ['eyeL', 90.95, T_EYES - .02], ['eyeR', T_EYES - .02, T_EYES + .06],
    ['head', 91.55, 91.78], ['body', 91.78, 91.92], ['legs', 91.92, 92.14], ['armL', 92.14, 92.24], ['armR', 92.26, T_ARM],
    ['shaft', T_ARROW, 94.42], ['headA', 94.8, 94.92], ['headB', 94.94, T_AHEAD + .04],
  ];
  function chalkTip(t) { for (const [k, a, b] of PLAN) if (t >= a && t < b) return along(CH[k], inv(a, b, t)); return null; }
  const CRACKS = (() => { const r = rng(933), out = []; for (let i = 0; i < 7; i++) { let a = r() * TAU, x = 1270, y = 468; const pts = [[x, y]]; const L = 160 + r() * 340; for (let k = 0; k < 6; k++) { a += (r() - .5) * .9; x += Math.cos(a) * L / 6; y += Math.sin(a) * L / 6; pts.push([x, y]); } out.push(pts); } return out; })();
  function board(t, crack = 0) {
    fill(s, '#231c26');
    s.fillStyle = rgrad(s, 960, -100, 50, 1300, [[0, 'rgba(255,210,150,.35)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-600, -600, 3120, 2400);
    s.fillStyle = '#5a3a22'; s.fillRect(70, 90, 1780, 760);
    s.fillStyle = '#1d3a2c'; s.fillRect(100, 120, 1720, 680);
    s.fillStyle = rgrad(s, 900, 260, 40, 1100, [[0, 'rgba(90,130,100,.45)'], [1, 'rgba(20,40,30,0)']]); s.fillRect(100, 120, 1720, 680);
    for (let i = 0; i < 9; i++) { const r = rng(40 + i); stroke(s, [[150 + r() * 1500, 150 + r() * 600], [260 + r() * 1500, 170 + r() * 600]], 'rgba(170,200,180,.12)', 30 + r() * 40); }
    s.fillStyle = '#6a4428'; s.fillRect(80, 796, 1760, 34); s.fillStyle = '#8a5a34'; s.fillRect(80, 796, 1760, 6);
    s.fillStyle = '#141018'; s.fillRect(-600, 1000, 3120, 1200);
    for (const [k, a, b] of PLAN) { const u = inv(a, b, t); if (u <= 0) continue; const pts = partial(CH[k], u); stroke(s, pts, '#e4eadc', 11); both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(210,235,220,.22)', 3); }); }
    if (crack > 0) for (const c of CRACKS) { const pts = partial(c, crack); stroke(s, pts, '#060c08', 12); both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, pts.map(([x, y]) => [x + 5, y + 4]), 'rgba(210,240,220,.4)', 2.5); }); }
    for (let k = 0; k < 3; k++) dot(s, 400 + k * 36, 790, 7, '#e8e4d4');
  }
  function dust(t, x, y, t0, n = 16, spread = 120) {
    const k = t - t0; if (k < 0 || k > 1.4) return;
    for (let i = 0; i < n; i++) { const a = hash(i * 7 + (t0 * 100 | 0)) * TAU, v = spread * (.4 + hash(i + 3) * .8); const px = x + Math.cos(a) * v * (1 - Math.exp(-k * 4)), py = y + Math.sin(a) * v * .6 * (1 - Math.exp(-k * 4)) + k * k * 60;
      dot(f, px, py, 2 + hash(i + 5) * 3, `rgba(230,240,230,${.7 * (1 - k / 1.4)})`); }
    glow(x, y, spread * .8, `rgba(220,235,225,${.25 * Math.exp(-k * 5)})`);
  }
  // the lecturer: back to us, pale coat in the lamp light; right hand on the chalk tip
  function lecturer(t, x, tip, o = {}) {
    const sc = 380, walking = o.walk || 0;
    const g = groove(POSE.stand, walking > 0 ? 'walk' : 'idle', t, walking > 0 ? 1 : .8), p = g.pose;
    p.lean += o.lean || 0; p.head += tip ? .1 : -.05;
    const y = 1000 - .885 * sc + g.dy;
    reachArm(p, x + g.dx, y, sc, 1, tip || o.rest || [x + 90, y + 40], -1);
    if (o.left) reachArm(p, x + g.dx, y, sc, -1, o.left, 1);
    figure(s, p, { x: x + g.dx + 34, y: y + 14, sc, color: 'rgba(8,22,14,.45)', coat: 'rgba(8,22,14,.45)', headC: 'rgba(8,22,14,.45)' });
    const J = figure(s, p, { x: x + g.dx, y, sc, color: '#26222c', coat: P.coat, headC: '#2b2430' });
    for (const [e, h] of [[J.elL, J.hdL], [J.elR, J.hdR]]) { taper(s, e, h, .05 * sc, .04 * sc, '#cdc8ba'); dot(s, h[0], h[1], .035 * sc, '#e2e6ea'); }
    dot(s, J.head[0] - 4, J.head[1] - .07 * sc, .05 * sc, '#2b2430');
    occlude(() => figure(f, p, { x: x + g.dx, y, sc, color: '#000', coat: '#000', headC: '#000' }));
    both(() => { f.globalCompositeOperation = 'lighter'; stroke(f, [J.shL, J.neck, J.shR], 'rgba(255,220,170,.25)', 5); });
    if (tip) { dot(s, tip[0], tip[1], 8, '#f4f2e8'); dot(f, tip[0], tip[1], 4, 'rgba(240,250,240,.8)'); }
    return J;
  }

  // 10 · a researcher chalks it out: an ember... a figure with its arm raised
  function chalk1(t, lt, dur) {
    const hx = t < 91.05 ? 420 : t < 91.55 ? lerp(420, 1300, ease.inOut(inv(91.05, 91.55, t))) : lerp(1300, 1240, ease.inOut(inv(92.45, 93.1, t)));
    cam(kf(t, [[90.3, 600], [91.0, 640], [91.6, 1220], [93.1, 1260]], ease.inOut) + sway(t) * 6, kf(t, [[90.3, 470], [93.1, 440]]), kf(t, [[90.3, 1.45], [91.0, 1.5], [91.6, 1.35], [93.1, 1.5]], ease.inOut), .01 * sway(t * .5));
    board(t);
    const walk = t > 91.05 && t < 91.55 ? 1 : 0;
    lecturer(t, hx, chalkTip(t), { walk, rest: [hx + 110, 640] });
    dust(t, 520, 512, T_EYES, 14, 90); dust(t, 1400, 300, 91.78, 12, 80); dust(t, 1500, 256, T_ARM, 18, 120);
  }
  // 11 · she draws the arrow hard; on "action" the board cracks; the others lean in
  function chalk2(t, lt, dur) {
    const cr = t < T_CRACK ? 0 : ease.out(inv(T_CRACK, T_CRACK + .18, t));
    const [sx, sy] = shake(t, 22 * hit(t, T_CRACK, 5));
    const tip = chalkTip(t), hx = t < T_ARROW ? 700 : t < T_CRACK ? lerp(700, 1150, ease.inOut(inv(T_ARROW, 94.42, t))) : lerp(1150, 960, ease.out(inv(T_CRACK, T_CRACK + .35, t)));
    cam(kf(t, [[93.1, 760], [T_ARROW, 780], [94.45, 1120], [95.93, 1060]], ease.inOut) + sx, kf(t, [[93.1, 500], [95.93, 470]]) + sy, kf(t, [[93.1, 1.2], [94.45, 1.4], [T_CRACK, 1.35], [95.93, 1.28]], ease.inOut) + .08 * hit(t, T_CRACK, 6), .015 * sway(t * .5));
    board(t, cr);
    lecturer(t, hx, tip, { walk: 0, rest: [hx + 100, 600], lean: t > T_CRACK ? -.12 * hit(t, T_CRACK, 2) : .05 });
    dust(t, 1270, 468, T_CRACK, 30, 220);
    // the others lean in, dark and close to the lens
    const lean = ease.back(inv(BT(132), BT(132) + .3, t)) * .15 + ease.back(inv(T_CRACK, T_CRACK + .25, t)) * .2;
    for (const [x, side, i] of [[560, 1, 0], [1560, -1, 1]]) {
      const g = groove(POSE.stand, 'idle', t + i * .3, 1), p = g.pose; p.lean += side * lean; p.head += side * lean * .8;
      researcher(p, x + g.dx, 1190 + g.dy, 560, { rim: side, face: null, coat: '#17182c' });
      occlude(() => figure(f, p, { x: x + g.dx, y: 1190 + g.dy, sc: 560, color: '#000', coat: '#000', headC: '#000' }));
    }
  }
  // 12 · she slaps the chalk down on "Demonstrated", whips to the notebook and stamps it on "Done"
  const T_DEMO = when('demonstrated', 96), T_DONE = when('done', 97);
  // close-up hand: pale sleeve from the upper right, cuff, gloved fist; chalk gripped along the ledge
  function fist(x, y, ang, chalk) {
    const wr = [x + 70 * Math.cos(ang - .7), y - 70 * Math.sin(.7 - ang)], el = [x + 520, y - 330];
    taper(s, el, wr, 78, 60, '#6f6a5e'); taper(s, [el[0] - 8, el[1] + 4], [wr[0] - 6, wr[1] + 2], 72, 54, '#e2dccb');
    taper(s, [wr[0] + 26, wr[1] - 20], wr, 62, 58, '#9c978a');
    both(() => {
      s.translate(x, y); s.rotate(ang);
      if (chalk) { s.fillStyle = '#5a5a50'; s.fillRect(-118, 6, 94, 26); s.fillStyle = '#f6f4ea'; s.fillRect(-116, 8, 90, 22); }
      s.fillStyle = '#4e5864'; s.beginPath(); s.ellipse(6, 4, 66, 50, 0, 0, TAU); s.fill();
      s.fillStyle = '#c9d2da'; s.beginPath(); s.ellipse(4, 0, 60, 45, 0, 0, TAU); s.fill();
      for (let i = 0; i < 4; i++) { s.fillStyle = i % 2 ? '#b4bec8' : '#d8e0e6'; s.beginPath(); s.ellipse(-40, -26 + i * 18, 20, 12, .2, 0, TAU); s.fill(); }
      s.fillStyle = '#e4eaee'; s.beginPath(); s.ellipse(14, -24, 34, 14, -.4, 0, TAU); s.fill();
    });
  }
  // a chalk piece thrown from the slam, bouncing on the ledge (top at y0)
  function chalkPiece(k, x0, y0, vx, vy, len, spin) {
    let x = x0, y = y0 - 12, v = vy, tt = 0; const dt = 1 / 120;
    while (tt < k) { v += 2400 * dt; y += v * dt; if (y > y0 - 10 && v > 0) { y = y0 - 10; v = -v * .42; } tt += dt; }
    x = x0 + vx * k * Math.exp(-k * .8);
    both(() => { s.translate(x, y); s.rotate(spin * k * 6 + spin); s.fillStyle = '#f6f4ea'; s.fillRect(-len / 2, -9, len, 18); });
  }
  function chalk3(t, lt, dur) {
    const wp = ease.inOut(inv(T_DEMO + .25, T_DONE - .22, t));
    const cy = lerp(740, 1215, wp), cx = lerp(820, 1330, wp);
    const vy = (lerp(740, 1215, ease.inOut(inv(T_DEMO + .25, T_DONE - .22, t + .02))) - cy) / .02;
    whip(0, clamp(vy * .02, 0, 55));
    const [sx, sy] = shake(t, 20 * hit(t, T_DEMO, 6) + 30 * hit(t, T_DONE, 4));
    cam(cx + sx, cy + sy, lerp(2.35, 2.3, wp) + .1 * hit(t, T_DEMO, 6) + .15 * hit(t, T_DONE, 5) + lt * .04, .02 * snoise(t, 3));
    board(t, 0);
    // the desk below with the open notebook
    s.fillStyle = '#3a2416'; s.fillRect(-400, 1060, 2800, 900); s.fillStyle = '#5a3a22'; s.fillRect(-400, 1060, 2800, 10);
    poly(s, [[1100, 1130], [1300, 1120], [1300, 1330], [1100, 1340]], '#e8dcc0'); poly(s, [[1300, 1120], [1500, 1130], [1500, 1340], [1300, 1330]], '#efe4cc');
    for (let k = 0; k < 7; k++) { stroke(s, [[1120, 1160 + k * 24], [1280, 1156 + k * 24]], 'rgba(60,70,90,.35)', 3); stroke(s, [[1320, 1160 + k * 24], [1480, 1164 + k * 24]], 'rgba(60,70,90,.35)', 3); }
    // chalk hand: rises, then slams down onto the ledge; the chalk snaps and bounces
    const LX = 800, LY = 796;
    const rise = ease.out(inv(95.95, 96.6, t)), drop = ease.in(inv(96.6, T_DEMO, t)), reb = t > T_DEMO ? Math.sin(Math.min(1, (t - T_DEMO) / .25) * Math.PI) * 14 : 0;
    const fy = lerp(lerp(700, 625, rise), LY - 58, drop) - reb, fx = lerp(lerp(870, 900, rise), LX + 30, drop);
    fist(fx, fy, lerp(-.1, .12, rise) * (1 - drop) - .05, t < T_DEMO);
    if (t >= T_DEMO) {
      const k = t - T_DEMO;
      chalkPiece(k, LX - 80, LY, -260, -420, 46, 1.1); chalkPiece(k, LX - 20, LY, 90, -560, 38, -.9); chalkPiece(k, LX + 50, LY, 280, -320, 30, 1.7);
      for (let i = 0; i < 7; i++) { const a = hash(i + 40) * Math.PI + Math.PI, r = (60 + hash(i + 50) * 140) * (1 - Math.exp(-k * 5)); s.fillStyle = `rgba(226,230,220,${.55 * Math.exp(-k * 2.2)})`; s.beginPath(); s.ellipse(LX - 20 + Math.cos(a) * r * 1.4, LY - 20 + Math.sin(a) * r * .6 - k * 40, 40 + k * 80, 26 + k * 40, 0, 0, TAU); s.fill(); }
    }
    dust(t, LX - 20, LY - 10, T_DEMO, 44, 300);
    // the stamp: lifted, then down on "Done"
    const st = t < T_DONE ? -ease.out(inv(T_DONE - .6, T_DONE - .12, t)) * 170 + ease.in(inv(T_DONE - .12, T_DONE, t)) * 170 : -ease.inOut(inv(T_DONE + .2, T_DONE + .5, t)) * 210;
    const bx = 1400, by = 1236 + st - 6;
    if (t > T_DONE) {
      both(() => { s.translate(bx, 1236); s.rotate(-.12);
        s.strokeStyle = '#c42a1c'; s.lineWidth = 10; s.beginPath(); s.ellipse(0, 0, 72, 48, 0, 0, TAU); s.stroke();
        for (let k = 0; k < 3; k++) stroke(s, [[-46, -18 + k * 18], [-10, -24 + k * 18], [20, -12 + k * 18], [46, -20 + k * 18]], '#c42a1c', 8); });
      glow(bx, 1236, 180, `rgba(255,90,60,${.5 * hit(t, T_DONE, 4)})`);
    }
    if (t > T_DONE - .9) {
      taper(s, [bx + 160, by - 700], [bx + 16, by - 160], 70, 54, P.coat); taper(s, [bx + 40, by - 230], [bx + 16, by - 160], 56, 54, '#b8b4a6'); dot(s, bx + 6, by - 168, 44, '#e2e8ec');
      s.fillStyle = '#2a1a10'; s.fillRect(bx - 22, by - 160, 44, 110); dot(s, bx, by - 170, 34, '#3a2414');
      s.fillStyle = '#6a4428'; s.fillRect(bx - 78, by - 56, 156, 40); s.fillStyle = '#b02418'; s.fillRect(bx - 74, by - 18, 148, 14);
    }
    flash(.28 * hit(t, T_DONE, 5) * (t > T_DONE ? 1 : 0) + .9 * ease.in(inv(98.12, 98.4, t)), '#fff0dc');
  }

  chapter('strings', 66.3, 98.4, [
    [66.3, frontRow],
    [BT(96), cutaway],
    [BT(100), birds],
    [BT(104), signShot],
    [BT(108), kneelShot],
    [BT(112), stoneClose],
    [BT(115), splitLevel],
    [BT(119), notice],
    [BT(122), dive],
    [BT(126), chalk1],
    [BT(130), chalk2],
    [BT(134), chalk3],
  ], { paint: (t) => ({ boil: 8, bloom: 1.25, flowK: 1 }) });
})();
