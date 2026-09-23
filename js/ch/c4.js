// js/ch/c4.js — IV · FUNCTIONAL (98.4 – 134.5)
(() => {
  const RED = '#c8261a', INK = '#b01e14';

  // ---------- the border: a ground plane in simple perspective ----------
  // world: X lateral (m), Z depth (m); the painted line + barrier sit at Z = LINE_Z
  const LINE_Z = 10;
  const proj = (X, Z, C) => { const k = C.f / Z; return [C.cx + X * k, C.hy + C.h * k, k]; };
  const qX = (Z) => Math.sin(Z * .07) * 2.2 + (Z > 40 ? (Z - 40) * .12 : 0);
  // the queue: three switchback rows behind the barrier, then a long tail winding off to the horizon
  const QUEUE = (() => {
    const o = []; let i = 0;
    for (let row = 0; row < 3; row++) for (let j = 0; j < 8; j++, i++) { const u = row % 2 ? 7 - j : j; o.push({ X: .6 + u * 1.15 + (hash(i + 430) - .5) * .3, Z: LINE_Z + 1.3 + row * 2.1 + (hash(i + 440) - .5) * .3 }); }
    for (let j = 0; j < 24; j++, i++) { const Z = LINE_Z + 8 + j * 2.4; o.push({ X: 8.6 + qX(Z) * 1.5 + j * .35, Z }); }
    return o.map((q, k) => ({ ...q, hue: .1 + hash(k + 420) * .8, seed: k }));
  })();

  function duskSky(C, stars_ = .6, t = 0) {
    const hy = C.hy;
    s.fillStyle = vgrad(s, hy - 1400, hy + 10, [[0, '#0a0b26'], [.45, '#231d52'], [.78, '#5a3b78'], [.93, '#b0607a'], [1, '#e89a6a']]);
    s.fillRect(-400, hy - 2600, W + 800, 2610);
    stars(t, 404, 160, Math.min(H, hy - 200), stars_);
    // long dusk cloud bands, lit pink from below near the horizon
    const r = rng(4040); for (let i = 0; i < 9; i++) { const y = hy - 140 - r() * 1300, w = 500 + r() * 900, x = ((r() * (W + 1200) + t * (8 + r() * 10)) % (W + 1200)) - 600; const lo = clamp(1 - (hy - y) / 900);
      s.fillStyle = `rgba(${90 + lo * 120 | 0},${50 + lo * 40 | 0},${110 - lo * 10 | 0},.55)`; s.beginPath(); s.ellipse(x, y, w / 2, 18 + r() * 26, 0, 0, TAU); s.fill(); }
    // low far mountains on the horizon
    ridge(s, hy - 22, 40, .004, 41, '#3a2a5a', -400, W + 400, hy + 4);
  }
  function plain(C, t, { lamp = 1 } = {}) {
    const [, ly] = proj(0, LINE_Z, C), hy = C.hy;
    // far side: dark grass under the stars
    s.fillStyle = vgrad(s, hy, ly, [[0, '#2a2450'], [.3, '#16213e'], [1, '#0b1a2c']]); s.fillRect(-400, hy, W + 800, ly - hy + 2);
    // near side: lamplit gravel
    s.fillStyle = vgrad(s, ly, H + 400, [[0, '#8a6444'], [.4, '#5a3f36'], [1, '#2a1f2c']]); s.fillRect(-400, ly, W + 800, H + 800);
    // the road across both sides
    const pts = []; for (let Z = LINE_Z - 9; Z <= 95; Z += 3) pts.push(proj(qX(Z) + 2.5, Z, C)); for (let Z = 95; Z >= LINE_Z - 9; Z -= 3) pts.push(proj(qX(Z) - 2.3, Z, C));
    poly(s, pts.map(p => [p[0], p[1]]), 'rgba(40,34,70,.55)');
    // grass tufts on the far side (value texture for the strokes)
    const r = rng(77); for (let i = 0; i < 70; i++) { const Z = LINE_Z + 2 + r() * 60, X = (r() - .5) * Z * 2.4; const [x, y, k] = proj(X, Z, C); if (y < hy) continue; s.fillStyle = r() < .5 ? '#0c2230' : '#1d2a48'; s.beginPath(); s.ellipse(x, y, k * (1 + r() * 2), k * .3, 0, 0, TAU); s.fill(); }
    // warm pool of lamplight on the gravel
    const [lx, lyy, lk] = proj(-2.6, LINE_Z - .5, C);
    s.fillStyle = rgrad(s, lx, lyy, 0, lk * 9, [[0, `rgba(255,200,120,${.75 * lamp})`], [.5, `rgba(220,140,80,${.3 * lamp})`], [1, 'rgba(0,0,0,0)']]);
    s.save(); s.translate(lx, lyy); s.scale(1, .32); s.translate(-lx, -lyy); s.fillRect(lx - lk * 9, lyy - lk * 9, lk * 18, lk * 18); s.restore();
    // the painted line
    const a = proj(-60, LINE_Z, C), b = proj(60, LINE_Z, C), k = a[2];
    poly(s, [[a[0], a[1] - k * .12], [b[0], b[1] - k * .12], [b[0], b[1] + k * .12], [a[0], a[1] + k * .12]], '#f0e2c4');
  }
  function lampPost(C, t, a = 1) {
    const [x, y, k] = proj(-3.4, LINE_Z - .6, C), top = y - k * 4.2;
    stroke(s, [[x, y], [x, top]], '#15101e', Math.max(3, k * .12));
    const sw = Math.sin(t * 1.8) * .06 + sway(t) * .03, hx = x + k * .7, lx = hx + Math.sin(sw) * k * .5, lyy = top + k * .3 + Math.cos(sw) * k * .5;
    stroke(s, [[x, top], [hx, top]], '#15101e', Math.max(2, k * .08)); stroke(s, [[hx, top], [lx, lyy]], '#15101e', 2);
    dot(s, lx, lyy, k * .22, P.gold);
    glow(lx, lyy, k * 6, `rgba(255,170,90,${.35 * a})`); glow(lx, lyy, k * .9, `rgba(255,236,190,${.95 * a})`);
  }
  function booth(C, t, { inside = 1, stampUp = 0 } = {}) {
    const [x0, y0, k] = proj(-5.4, LINE_Z - .3, C), w = 2.6 * k, h = 2.9 * k;
    s.fillStyle = '#2a1e30'; s.fillRect(x0, y0 - h, w, h);
    s.fillStyle = '#1a1222'; s.fillRect(x0 - k * .25, y0 - h - k * .35, w + k * .5, k * .4); // roof slab
    s.fillStyle = '#3b2a3c'; s.fillRect(x0 + w * .82, y0 - h, w * .18, h); // lit edge
    // window
    const wx = x0 + w * .18, wy = y0 - h * .78, ww = w * .64, wh = h * .38;
    s.fillStyle = '#f2b866'; s.fillRect(wx, wy, ww, wh);
    f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = `rgba(255,170,80,${.35 * inside})`; f.fillRect(wx, wy, ww, wh); f.restore();
    glow(wx + ww / 2, wy + wh / 2, ww, `rgba(255,160,80,${.25 * inside})`);
    // the researcher inside, silhouetted, raising the stamp
    s.save(); s.beginPath(); s.rect(wx, wy, ww, wh); s.clip();
    const J = figure(s, mixPose(POSE.stand, { ...POSE.stand, aR: [-2.7, -2.9] }, stampUp), { x: wx + ww * .45, y: wy + wh * 1.35, sc: wh * .75, color: '#2a1410', coat: '#2a1410' });
    if (stampUp > 0) { s.fillStyle = '#2a1410'; s.fillRect(J.hdR[0] - wh * .07, J.hdR[1] - wh * .12, wh * .14, wh * .12); }
    s.restore();
    // window frame
    s.strokeStyle = '#150e18'; s.lineWidth = Math.max(2, k * .08); s.strokeRect(wx, wy, ww, wh); stroke(s, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#150e18', Math.max(2, k * .05));
    return [x0 + w, y0 - h * .35, k];
  }
  // striped barrier arm; pivot at the post, ang 0 = closed (pointing +X), ang ~1.4 = up
  function barrier(C, t, ang = 0) {
    const [px, py, k] = proj(-2.4, LINE_Z, C);
    stroke(s, [[px, py], [px, py - k * 1.1]], '#221a2a', k * .28); // post
    const L = 5.6 * k, hy = py - k * 1.0, ca = Math.cos(ang), sa = Math.sin(ang);
    const n = 8; for (let i = 0; i < n; i++) {
      const a0 = i / n, a1 = (i + 1) / n;
      stroke(s, [[px + ca * L * a0, hy - sa * L * a0], [px + ca * L * a1, hy - sa * L * a1]], i % 2 ? '#f1e3c6' : RED, k * .2, 'butt');
    }
    s.fillStyle = '#221a2a'; s.fillRect(px - k * .6, hy - k * .2 + sa * k * .3, k * .5, k * .4); // counterweight
    dot(f, px + ca * L, hy - sa * L, k * .07, 'rgba(255,90,60,.9)'); glow(px + ca * L, hy - sa * L, k * .5, 'rgba(255,60,40,.5)');
  }
  function queue(C, t, { from = 0, march = 0, hopAmt = 1 } = {}) {
    for (let i = QUEUE.length - 1; i >= from; i--) {
      const q = QUEUE[i]; const Z = q.Z - march; if (Z < 1.5) continue;
      const [x, y, k] = proj(q.X, Z, C); if (y < C.hy - 2) continue;
      // shuffle on the beat: each one hops a little, staggered down the line
      const hop = Math.pow(Math.max(0, Math.sin((beatPhase(t) - i * .07) * Math.PI)), 3) * hopAmt;
      const sz = k * .75;
      ember(t, x + sway(t - i * .1) * k * .06, y - hop * k * .22, sz, { eyes: sz > 14 ? 1 : 0, look: Math.sin(i * 1.7 + t * .5) * .8, mood: i % 5 === 1 ? 'scared' : 'calm', hue: q.hue, seed: q.seed, lit: .85 });
    }
  }

  // ---------- the desk + the stamp ----------
  function stampMark(g, x, y, sc, rot, a = 1, seed = 1) {
    if (a <= 0) return;
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha *= a;
    g.strokeStyle = INK; g.lineWidth = 16; g.lineJoin = 'round';
    g.strokeRect(-330, -92, 660, 184); g.lineWidth = 5; g.strokeRect(-306, -70, 612, 140);
    g.fillStyle = INK; g.font = '900 120px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const wd = g.measureText('FUNCTIONAL').width; g.save(); g.scale(Math.min(1, 560 / wd), 1); g.fillText('FUNCTIONAL', 0, 6); g.restore();
    // worn rubber: paper showing through
    const r = rng(seed * 31 + 7); g.fillStyle = '#efe0c2';
    for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse((r() - .5) * 640, (r() - .5) * 170, 4 + r() * 12, 2 + r() * 5, r() * 3, 0, TAU); g.fill(); }
    g.restore();
  }
  function paper(g, x, y, w, h, rot, sx = 1) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sx, 1);
    g.fillStyle = '#e9d8b6'; g.fillRect(-w / 2 + 10, -h / 2 + 14, w, h); // shadow-ish rim
    g.fillStyle = '#f3e6c9'; g.fillRect(-w / 2, -h / 2, w, h);
    // ruled form lines
    for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(80,90,130,.35)'; g.fillRect(-w * .4, -h * .38 + i * h * .07, w * (i === 0 ? .5 : .8), 5); }
    for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(80,90,130,.3)'; g.fillRect(-w * .4, h * .28 + i * h * .06, w * .8, 4); }
    g.restore();
  }
  // a rubber stamp in a gloved fist, coming from the top of frame. z: 0 = pressed on the paper, 1 = raised high
  function stampTool(x, y, z, rot) {
    const lift = z * 620, sc = 1 + z * .3;
    const bx = x, by = y - lift;
    s.save(); s.translate(bx, by); s.rotate(rot); s.scale(sc, sc);
    // shadow of the block while it hovers
    // rubber face + wooden block (face = the mark's footprint), seen a little from the front
    s.fillStyle = '#2a1410'; s.fillRect(-345, -96, 690, 192);
    poly(s, [[-345, -96], [345, -96], [300, -190], [-300, -190]], '#8a4e2c');
    s.fillStyle = '#5a2e1a'; s.fillRect(-345, -96, 690, 50);
    // turned neck + knob
    poly(s, [[-50, -180], [50, -180], [36, -300], [-36, -300]], '#6a3a20');
    dot(s, 0, -340, 70, '#9a6034');
    // sleeve from off-frame, gloved fist over the knob
    taper(s, [120, -1100], [30, -420], 120, 95, '#23253a'); taper(s, [150, -1100], [70, -440], 36, 26, '#3c3f5c');
    s.fillStyle = '#b9b5aa'; s.beginPath(); s.ellipse(0, -390, 118, 80, 0, 0, TAU); s.fill();
    for (let i = 0; i < 4; i++) dot(s, -78 + i * 52, -330, 30, '#a6a298');
    s.restore();
    glow(bx - 60, by - 380 * sc, 180, 'rgba(255,200,140,.2)');
  }
  function desk(t, lampX = 560, lampY = 140) {
    fill(s, '#3a2418');
    // wood grain bands
    for (let i = 0; i < 9; i++) { s.fillStyle = i % 2 ? 'rgba(90,52,30,.55)' : 'rgba(40,22,16,.4)'; s.fillRect(-300, -300 + i * 190 + Math.sin(i * 3) * 30, W + 600, 70 + hash(i) * 60); }
    // lamplight pool on the desk
    s.fillStyle = rgrad(s, lampX, lampY + 300, 0, 1100, [[0, 'rgba(255,196,120,.55)'], [.5, 'rgba(160,90,50,.2)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-400, -400, W + 800, H + 800);
    glow(lampX, lampY + 300, 900, 'rgba(255,150,70,.12)');
    for (let i = 0; i < 26; i++) { const x = lampX - 300 + hash(i + 60) * 900 + Math.sin(t * .7 + i) * 40, y = lampY + ((hash(i + 61) * 900 - t * 25 * (.5 + hash(i + 62))) % 900 + 900) % 900; dot(f, x, y, 1.5 + hash(i + 63) * 2, 'rgba(255,225,180,.45)'); }
    // an ink pad + a little stack of cleared forms
    s.fillStyle = '#1a1214'; s.fillRect(1560, 760, 330, 190); s.fillStyle = '#4a1210'; s.fillRect(1580, 778, 290, 150);
    for (let i = 0; i < 4; i++) { s.fillStyle = i % 2 ? '#d8c7a6' : '#e8d8b8'; s.save(); s.translate(300, 820 - i * 10); s.rotate(-.12 + i * .05); s.fillRect(-200, -130, 400, 260); s.restore(); }
  }
  function inkSpatter(t, x, y, t0, seed, n = 14, pow = 1) {
    const k = inv(t0, t0 + .35, t); if (k <= 0 || k >= 1) return;
    const r = rng(seed); for (let i = 0; i < n; i++) { const a = r() * TAU, d = (120 + r() * 320) * pow * ease.out(k); dot(s, x + Math.cos(a) * (d + 280), y + Math.sin(a) * d * .5, (4 + r() * 8) * (1 - k * .5), INK); }
  }

  // ================= SHOTS =================

  // 98.4 — the border post on a vast dusk plain; crane down out of the sky
  function borderCrane(t, lt, dur) {
    const u = lt / dur;
    const C = { cx: W / 2 + kf(lt, [[0, 420], [dur, 180]]), hy: kf(lt, [[0, 700], [1.6, 470], [dur, 440]], ease.out), h: kf(lt, [[0, 5.5], [dur, 3.6]]), f: kf(lt, [[0, 900], [dur, 1150]], ease.in) };
    cam(W / 2, H / 2, 1, kf(lt, [[0, -.05], [dur, 0]]));
    duskSky(C, .8 - .4 * u, t);
    plain(C, t);
    queue(C, t);
    barrier(C, t, 0);
    booth(C, t, { stampUp: ease.back(inv(dur - .75, dur - .15, lt)) });
    lampPost(C, t);
    // cold: a few drifting motes
    for (let i = 0; i < 30; i++) { const x = (hash(i) * W + t * 30 * (1 + hash(i + 1))) % W, y = (hash(i + 2) * H + t * 20) % H; dot(f, x, y, 1.2, 'rgba(200,210,255,.35)'); }
  }

  // 101.2 — FUNCTIONAL. the stamp slams into the paper
  function stampHit(t, lt, dur, { hard = 0 } = {}) {
    const tHit = hard ? when('functional', 112) : when('functional', 101);
    const tLift = tHit + (hard ? .38 : .34);
    const h = hit(t, tHit, hard ? 5 : 7);
    const [sx, sy] = shake(t, (hard ? 46 : 30) * h);
    const push = kf(t, [[tHit - .1, hard ? 1.3 : 1.2], [tHit + .05, hard ? 1.02 : 1.0], [tHit + 1.6, hard ? 1.3 : 1.28]], ease.out);
    cam(W / 2 + sx + kf(t, [[tHit, 0], [tHit + 1.6, 60]]), H / 2 + 40 + sy, push, kf(t, [[tHit, hard ? .05 : -.04], [tHit + 1.6, hard ? -.02 : .04]]));
    desk(t);
    paper(s, W / 2, H / 2 + 30, 920, 620, -.05);
    const zz = clamp(t < tHit ? (tHit - t) / .08 : ease.in(inv(tLift, tLift + .3, t)) * 1.6 + (1 - ease.out(inv(tHit, tHit + .12, t))) * .03, 0, 1.6);
    const mark = t >= tHit ? 1 : 0;
    // ink mark: slightly smudged bigger at first, settles
    stampMark(s, W / 2 + 10, H / 2 + 40, 1.08 - .04 * ease.out(inv(tHit, tHit + .3, t)), -.07, mark, hard ? 2 : 1);
    if (mark && t > tLift + .15) { f.save(); f.globalCompositeOperation = 'lighter'; stampMark(f, W / 2 + 10, H / 2 + 40, 1.06, -.07, .2 * hit(t, tLift + .15, 3), hard ? 2 : 1); f.restore(); }
    inkSpatter(t, W / 2, H / 2 + 60, tHit, hard ? 9 : 5, hard ? 22 : 12, hard ? 1.4 : 1);
    if (zz < 1.6) stampTool(W / 2 + 10, H / 2 + 40, zz, -.07);
    flash(h * h * (hard ? .16 : .12), '#ffc8a0');
    // the lamp overhead
    glow(560, 120, 500, `rgba(255,190,110,${.25 + .2 * h})`);
    return { tHit, tLift };
  }
  const stamp1 = (t, lt, dur) => stampHit(t, lt, dur);

  // 102.8 — two embers at the window hold up their papers; she shakes her head, points them back
  function windowRefuse(t, lt, dur) {
    const tNot1 = when('not', 102.5), tNot2 = when('not', 103.8), tStall = when('stalled', 104);
    const shakeK = (t0) => { const x = inv(t0, t0 + .6, t); return x > 0 && x < 1 ? Math.sin(x * TAU * 2) * (1 - x) : 0; };
    const nod = shakeK(tNot1) + shakeK(tNot2);
    const point = ease.back(inv(tStall - .15, tStall + .2, t));
    cam(kf(lt, [[0, 1010], [dur, 1070]]), kf(lt, [[0, 560], [dur, 530]]), kf(lt, [[0, 1.0], [dur, 1.1]]), .012 * Math.sin(lt * 1.3));
    // outside the window: dusk plain, the queue
    const C = { cx: 1250, hy: 520, h: 1.7, f: 800 };
    for (const g of [s, f]) { g.save(); g.beginPath(); g.rect(250, 110, 1630, 795); g.clip(); }
    duskSky(C, .5, t); plain(C, t, { lamp: .2 }); queue(C, t, { from: 2 });
    barrier(C, t, 0);
    for (const g of [s, f]) g.restore();
    // the two on the sill, papers held up hopefully; after her point they turn and hop away
    const droop = ease.out(inv(tStall, tStall + .3, t)), leave = ease.in(inv(tStall + .28, tStall + .68, t));
    [[1080, .55], [1470, .78]].forEach(([x0, hue], i) => {
      const sz = 250 - i * 20, sill = 905;
      const x = x0 + leave * (620 + i * 200), hopL = leave > 0 ? Math.abs(Math.sin(leave * 7 + i)) * 60 : 0;
      const hop = (1 - droop) * Math.pow(bob(t + i * .35), 2) * 22 + hopL;
      const y = sill - hop + leave * 140;
      const nodDip = Math.abs(nod) * 10;
      ember(t, x, y + nodDip, sz, { eyes: 1, look: lerp(-.9, 1, droop), mood: droop > .3 || Math.abs(nod) > .2 ? 'scared' : 'happy', hue, seed: 30 + i, lit: .32, lean: lerp(-.08, .15, droop) });
      // the held-up paper: raised beside the head, lowered and let fall after the refusal
      const side = i ? 1 : -1;
      const px = x + side * sz * .62, py = y - sz * lerp(1.05, .45, droop) + droop * 40;
      stroke(s, [[x + side * sz * .25, y - sz * .35], [px, py + 60]], '#7a3212', 12);
      s.save(); s.translate(px, py); s.rotate(side * .12 + droop * side * .7 + Math.sin(t * 3 + i) * .04);
      s.fillStyle = '#efe0c2'; s.fillRect(-72, -95, 144, 180); for (let k = 0; k < 5; k++) { s.fillStyle = 'rgba(70,70,110,.55)'; s.fillRect(-52, -66 + k * 28, 104 - (k % 2) * 36, 8); }
      s.restore();
    });
    // the booth interior around the window
    const fr = [250, 110, 1880, 905];
    s.fillStyle = '#3a2630'; s.beginPath(); s.rect(-400, -400, W + 800, H + 800); s.rect(fr[0], fr[1], fr[2] - fr[0], fr[3] - fr[1]); s.fill('evenodd');
    s.strokeStyle = '#140c14'; s.lineWidth = 44; s.strokeRect(fr[0], fr[1], fr[2] - fr[0], fr[3] - fr[1]);
    stroke(s, [[fr[0] + 560, fr[1]], [fr[0] + 560, fr[3]]], '#140c14', 24); // mullion
    // counter
    s.fillStyle = '#4a2c1c'; s.fillRect(-400, 905, W + 800, 400);
    s.fillStyle = 'rgba(255,200,130,.6)'; s.fillRect(-400, 905, W + 800, 14);
    glow(1500, 880, 700, 'rgba(255,160,80,.16)');
    // her, from behind, big in the foreground left
    const pose = { ...POSE.stand, head: nod * .3 + (1 - point) * .04, lean: -.04 + nod * .04 + point * .08, aR: [lerp(-.3, 1.72, point), lerp(-.2, 1.8, point)], aL: [.2, .45] };
    const J = researcher(pose, 420 + sway(t) * 6, 1190, 730, { face: null, rim: 1, coat: '#1e2030' });
    if (point > .1) glow(J.hdR[0], J.hdR[1], 40, `rgba(255,220,180,${.3 * point})`);
    // her lamp on the counter
    dot(s, 1760, 870, 34, P.gold); glow(1760, 870, 360, 'rgba(255,170,90,.4)'); glow(1760, 870, 50, 'rgba(255,240,200,.9)');
  }

  // 105.6 — high wide: the painted line across the plain. science's lamps switch on along it, beat by beat; belief keeps the stars
  const LAMPS = [-10, 6, -18, 14, -26, 22, -34, 30, -42, 38];
  function wideLine(t, lt, dur) {
    const C = { cx: W / 2 + kf(lt, [[0, 40], [dur, -120]], ease.sine), hy: kf(lt, [[0, 300], [dur, 330]]), h: 9, f: 560 };
    cam(W / 2, H / 2, kf(lt, [[0, 1.2], [dur, 1.0]], ease.sine), kf(lt, [[0, .07], [dur, -.04]], ease.sine));
    duskSky(C, 1, t);
    plain(C, t);
    const on = LAMPS.map((X, i) => { const tb = BT(148 + Math.floor(i / 2)) + (i % 2) * .09; return { X, a: hit(t, tb, 1.5) * .6 + (t >= tb ? .7 : 0), tb }; });
    // their pools on the gravel
    for (const L of on) { if (L.a <= 0) continue; const [x, y, k] = proj(L.X, LINE_Z - 1.2, C);
      s.save(); s.translate(x, y); s.scale(1, .3); s.fillStyle = rgrad(s, 0, 0, 0, k * 6, [[0, `rgba(255,200,120,${.7 * L.a})`], [1, 'rgba(0,0,0,0)']]); s.fillRect(-k * 6, -k * 6, k * 12, k * 12); s.restore(); }
    queue(C, t);
    barrier(C, t, 0); booth(C, t, { inside: 1 }); lampPost(C, t);
    for (const L of on) { const [x, y, k] = proj(L.X, LINE_Z - .6, C), top = y - k * 4;
      stroke(s, [[x, y], [x, top]], '#15101e', Math.max(3, k * .14)); dot(s, x, top, k * .25, L.a > 0 ? P.gold : '#3a3040');
      if (L.a > 0) { glow(x, top, k * 5, `rgba(255,170,90,${.3 * L.a})`); glow(x, top, k * .9, `rgba(255,236,190,${.9 * Math.min(1, L.a)})`); } }
    // the belief side: stars wink on over the dark grass
    for (let i = 0; i < 22; i++) { const tw = inv(105.8 + i * .12, 106.1 + i * .12, t); if (tw <= 0) continue; const x = 100 + hash(i + 900) * 1700, y = C.hy - 30 - hash(i + 901) * 520; glow(x, y, 22, `rgba(255,245,230,${.5 * tw * (.6 + .4 * Math.sin(t * 4 + i))})`); dot(f, x, y, 2.2, `rgba(255,250,240,${tw})`); }
  }

  // 108.4 — made them show their teeth: snap zoom on an ember at the window, lantern held to its mouth
  function teeth(t, lt, dur) {
    const tT = when('teeth', 108.5);
    const z = kf(lt, [[0, .5], [.16, 1.05], [dur, 1.18]], ease.out);
    whip(0, lt < .18 ? -60 * (1 - lt / .18) : 0);
    const [shx, shy] = shake(t, 10 * hit(t, tT, 5));
    cam(1000 + shx, 820 + (1 - inv(0, .16, lt)) * 120 + shy, z, -.03);
    s.fillStyle = vgrad(s, -200, 1400, [[0, '#15163a'], [1, '#3a2a58']]); s.fillRect(-600, -600, W + 1200, H + 1400);
    // the sill it stands on
    s.fillStyle = '#1c1220'; s.fillRect(-600, 1150, W + 1200, 600); s.fillStyle = 'rgba(255,190,120,.45)'; s.fillRect(-600, 1146, W + 1200, 14);
    const open = Math.max(0, ease.back(inv(tT - .6, tT - .1, t))) * (1 + .06 * Math.sin(t * 30) * inv(tT - .2, tT, t));
    const X = 1000, Y = 1160, SZ = 900;
    ember(t, X, Y, SZ, { eyes: 1 - .7 * open, look: -.8, mood: 'scared', hue: .62, seed: 88, lit: .22 });
    // the mouth, stretched wide, and its tiny teeth
    const mx = X - SZ * .03, my = Y - SZ * .15, mw = SZ * .17, mh = SZ * .02 + SZ * .09 * open;
    s.fillStyle = '#1e0802'; s.beginPath(); s.ellipse(mx, my, mw, mh, 0, 0, TAU); s.fill();
    if (open > .2) { const n = 6; for (let i = 0; i < n; i++) { const x = mx - mw * .7 + i * mw * 1.4 / (n - 1), ww = mw * .1; for (const d of [-1, 1]) { const y0 = my + d * mh * .86; poly(s, [[x - ww, y0], [x + ww, y0], [x, y0 - d * mh * .34]], '#fbf2dc'); } } }
    // gloved hand + lantern pushed in from the left, right up to its mouth
    const lx = kf(lt, [[0, -200], [.35, 470]], ease.out) + Math.sin(t * 5) * 6, ly = 700;
    taper(s, [-400, 520], [lx - 90, ly - 190], 90, 60, '#26283a');
    s.fillStyle = '#9d9a92'; s.beginPath(); s.ellipse(lx - 90, ly - 190, 70, 52, -.5, 0, TAU); s.fill();
    stroke(s, [[lx - 60, ly - 180], [lx, ly - 80]], '#111', 7);
    poly(s, [[lx - 55, ly - 80], [lx + 55, ly - 80], [lx + 40, ly - 50], [lx - 40, ly - 50]], '#2a2030');
    s.fillStyle = '#2a2030'; s.fillRect(lx - 60, ly + 110, 120, 26);
    for (const d of [-1, 1]) stroke(s, [[lx + d * 46, ly - 55], [lx + d * 52, ly + 112]], '#2a2030', 9);
    dot(s, lx, ly + 30, 44, '#ffe2a8');
    glow(lx, ly + 30, 620, 'rgba(255,180,100,.35)'); glow(lx, ly + 30, 110, 'rgba(255,240,200,1)');
    // the lantern throws its light into the open mouth
    glow(mx - mw * .5, my, 180 * open, 'rgba(255,225,180,.2)');
  }

  // 109.6 — the barrier lifts; embers flood across the line toward us and scatter into the night
  const CROWD = [...QUEUE, ...[...Array(50).keys()].map(i => ({ X: -1 + hash(i + 700) * 22, Z: LINE_Z + 6 + hash(i + 701) * 30, hue: hash(i + 702), seed: 200 + i }))];
  function flood(t, lt, dur) {
    const tUp = BT(154) - .12; // lifts into the downbeat
    const up = Math.max(0, ease.back(inv(tUp, tUp + .5, t))) * 1.35;
    const run = Math.max(0, t - tUp - .1);
    const C = { cx: W / 2 + kf(lt, [[0, -40], [dur, -260]], ease.inOut), hy: kf(lt, [[0, 330], [dur, 300]]), h: 3.2, f: 1000 };
    const P2 = (X, Z) => proj(X, Z, C);
    whip(0, -clamp(run * 14, 0, 14));
    cam(W / 2, H / 2, kf(lt, [[0, 1.0], [dur, 1.1]]), Math.sin(lt * 1.4) * .02 + sway(t) * .008);
    duskSky(C, .8, t);
    plain(C, t); lampPost(C, t, .6); booth(C, t); barrier(C, t, up);
    const list = CROWD.map((q, i) => {
      const start = (q.Z - LINE_Z) * .03 + hash(i + 540) * .15, rr = Math.max(0, run - start);
      const sp = 5.5 + hash(i + 500) * 3;
      const Z = q.Z - rr * sp;
      const past = clamp((LINE_Z - Z) / 5);
      const side = (q.X < 5 ? -1 : 1) * (1 + hash(i + 520) * 3);
      const X = q.X + side * past * past * 1.1;
      const flier = hash(i + 530) < .25;
      return { i, q, Z, X, rr, past, flier };
    }).filter(e => e.Z > 1.6).sort((a, b) => b.Z - a.Z);
    for (const e of list) {
      const [x, y, k] = P2(e.X, e.Z); if (y < C.hy - 2) continue;
      const sz = k * .75;
      const hop = e.rr > 0 ? Math.abs(Math.sin(e.rr * 8 + e.i)) * k * .45 : Math.pow(Math.max(0, Math.sin((beatPhase(t) - e.i * .07) * Math.PI)), 3) * k * .2;
      const fly = e.flier ? ease.in(clamp((LINE_Z - 1 - e.Z) / 6)) * 700 * (.6 + hash(e.i + 3)) : 0;
      const yy = y - hop - fly;
      if (fly > 20) for (let k2 = 1; k2 < 6; k2++) dot(f, x - (e.X < 5 ? -1 : 1) * k2 * 6, yy + k2 * 26, 3 - k2 * .4, `rgba(255,200,120,${.5 - k2 * .08})`);
      ember(t, x, yy, sz, { eyes: 1, look: e.X < 5 ? -1 : 1, mood: e.rr > 0 ? 'happy' : 'scared', hue: e.q.hue, seed: e.q.seed, lit: .15 + Math.min(.85, 50 / sz), lean: e.rr > 0 ? (e.X < 5 ? -.2 : .2) : 0 });
    }
  }

  // 112.2 — FUNCTIONAL, harder. the paper flies up and folds into a paper boat
  const RECT8 = [[-1, -.62], [-.35, -.62], [0, -.62], [.35, -.62], [1, -.62], [1, .62], [0, .62], [-1, .62]];
  const BOAT8 = [[-1, -.05], [-.36, -.05], [0, -.95], [.36, -.05], [1, -.05], [.66, .42], [0, .42], [-.66, .42]];
  function paperBoat(g, x, y, w, fold, rot, sx = 1, col = '#f3e6c9') {
    const pts = RECT8.map((p, i) => [x + (lerp(p[0], BOAT8[i][0], fold) * Math.cos(rot) * sx - lerp(p[1], BOAT8[i][1], fold) * Math.sin(rot)) * w / 2, y + (lerp(p[0], BOAT8[i][0], fold) * Math.sin(rot) * sx + lerp(p[1], BOAT8[i][1], fold) * Math.cos(rot)) * w / 2]);
    poly(g, pts, col);
    if (fold > .3) { // fold creases
      const c = `rgba(150,120,90,${.6 * fold})`;
      stroke(g, [pts[1], pts[6]], c, 6); stroke(g, [pts[3], pts[6]], c, 6); stroke(g, [pts[0], pts[4]], `rgba(190,160,120,${.5 * fold})`, 5);
    }
    return pts;
  }
  function stamp2(t, lt, dur) {
    const tUp = BT(158); // 112.77 downbeat: the paper leaves the desk
    if (t < tUp) { stampHit(t, lt, dur, { hard: 1 }); return; }
    const u = t - tUp, tIn = when('in', 113.3);
    // camera tilts up with the paper as it rises; the desk falls away into night
    const rise = ease.out(inv(0, .7, u));
    const fold = ease.inOut(inv(tIn - .35, tIn + .15, t));
    const spin = kf(u, [[0, 0], [.9, TAU * 1.25]], ease.out);
    whip(0, 50 * (1 - inv(0, .4, u)));
    cam(W / 2, H / 2 - rise * 200, lerp(1.2, 1, rise), kf(u, [[0, .04], [1.1, -.03]]));
    s.save(); s.globalAlpha = 1;
    s.fillStyle = vgrad(s, -300, 1300, [[0, '#0b1030'], [.5, '#15204a'], [1, '#261c3a']]); s.fillRect(-500, -800, W + 1000, H + 1600);
    s.restore();
    // desk dropping out of frame below
    s.save(); s.translate(0, rise * 900); s.globalAlpha = 1 - rise * .6; desk(t); s.restore();
    stars(t, 441, 90, H, rise);
    // the paper
    const px = W / 2 + Math.sin(u * 3) * 40, py = H / 2 + 30 - rise * 360 + kf(u, [[.6, 0], [1.13, 230]], ease.inOut);
    const w = lerp(940, 820, ease.out(inv(0, .9, u)));
    const sx = Math.cos(spin) * (1 - fold) + fold;
    const pts = paperBoat(s, px, py, w, fold, lerp(-.05, 0, fold) + Math.sin(u * 4) * .08 * (1 - fold), sx);
    if (fold < .7 && Math.abs(sx) > .15) { s.save(); s.beginPath(); pts.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.clip(); s.translate(px, py); s.scale(sx, 1); stampMark(s, 0, 20 * (1 - fold), .9 * (w / 940), -.07, sx > 0 ? 1 - fold : .3, 2); s.restore(); }
    glow(px, py, w * .7, `rgba(255,220,170,${.05 + .08 * hit(t, tUp, 3)})`);
    // the sea arriving below as it settles
    const sea = ease.inOut(inv(tIn - .1, 113.9, t));
    if (sea > 0) { s.fillStyle = vgrad(s, H * .72, H + 200, [[0, '#1d3a64'], [1, '#081428']]); s.globalAlpha = sea; s.fillRect(-500, lerp(H + 300, H * .72, sea) - rise * 200 + 200, W + 1000, 900); s.globalAlpha = 1; }
  }

  // ---------- the sea ----------
  // the sea: horizon at HZ; the boat's waterline sits lower, nearer the camera
  const HZ = 430;
  function seaSky(t, moonX = 1450, hz = HZ) {
    s.fillStyle = vgrad(s, hz - 900, hz, [[0, '#070b24'], [.55, '#18285a'], [.9, '#46508a'], [1, '#6a6a9a']]); s.fillRect(-3000, hz - 3000, 8000, 3002);
    stars(t, 515, 120, hz - 40, .9);
    moon(moonX, hz - 300, 46);
  }
  function seaSurface(t, x0, x1, moonX = 1450, hz = HZ, depth = 900) {
    s.fillStyle = vgrad(s, hz, hz + depth, [[0, '#1a2856'], [.25, '#132a55'], [1, '#07122a']]); s.fillRect(x0, hz, x1 - x0, depth + 1200);
    s.fillStyle = 'rgba(200,205,240,.55)'; s.fillRect(x0, hz - 1, x1 - x0, 3);
    // glassy ripples, denser + brighter in the moon's path
    const r = rng(612); for (let i = 0; i < 150; i++) { const d = r(), yy = hz + 3 + d * d * depth, w = (30 + r() * 200) * (.2 + d * 1.2);
      const inPath = r() < .45, x = inPath ? moonX + (r() - .5) * (40 + d * 700) : lerp(x0, x1, r());
      const xx = x + Math.sin(t * .8 + i) * 12 * (.3 + d);
      const near = inPath ? 1 - Math.min(1, Math.abs(x - moonX) / (40 + d * 360)) : 0;
      s.fillStyle = `rgba(${170 + near * 80 | 0},${190 + near * 50 | 0},235,${.12 + .6 * near})`; s.fillRect(xx - w / 2, yy, w, 2 + d * 6); }
    glow(moonX, hz + 8, 220, 'rgba(230,230,255,.12)');
  }
  // rowing: one stroke every two beats. returns 0..1 phase
  const rowPh = (t) => ((((t - B0) / BEAT) / 2) % 1 + 1) % 1;
  // side view rowboat with the poured one rowing; bow to the right. (x, y) = waterline centre
  function rowboat(t, x, y, sc) {
    const ph = rowPh(t), drive = ph < .45, k = drive ? ph / .45 : 1 - (ph - .45) / .55; // k: 0 catch → 1 finish
    const bobY = Math.sin(t * 1.3) * sc * .012 + (drive ? 0 : sc * .01 * Math.sin((ph - .45) / .55 * Math.PI));
    const pitch = Math.sin(t * 1.1) * .015;
    s.save(); f.save(); for (const g of [s, f]) { g.translate(x, y + bobY); g.rotate(pitch); }
    // the rower: sitting, facing the stern (left), reaching then pulling
    const ease_k = ease.sine(k);
    const pose = { lean: lerp(-.45, .28, ease_k), head: lerp(.25, -.12, ease_k), aL: [lerp(-1.35, .65, ease_k), lerp(-1.45, -1.25, ease_k)], aR: [lerp(-1.25, .75, ease_k), lerp(-1.35, -1.2, ease_k)], lL: [-1.35, -.2], lR: [-1.45, -.1] };
    const J = pouredOne(t, pose, sc * .05, -sc * .2, sc * .62, { heat: .85, eyes: .35 });
    // oar: from the hands through the oarlock to the blade
    const lock = [-sc * .02, -sc * .2];
    const hand = [(J.hdL[0] + J.hdR[0]) / 2, (J.hdL[1] + J.hdR[1]) / 2 + (drive ? 0 : -sc * .05 * Math.sin((ph - .45) / .55 * Math.PI))];
    const d = [lock[0] - hand[0], lock[1] - hand[1]], L = Math.hypot(d[0], d[1]) || 1, reach = sc * 1.25;
    const blade = [lock[0] + d[0] / L * reach * .75, lock[1] + d[1] / L * reach * .75 + sc * .25];
    stroke(s, [hand, blade], '#6a4428', sc * .035);
    s.save(); s.translate(blade[0], blade[1]); s.rotate(Math.atan2(blade[1] - hand[1], blade[0] - hand[0])); s.fillStyle = '#7a5030'; s.beginPath(); s.ellipse(0, 0, sc * .12, sc * .04, 0, 0, TAU); s.fill(); s.restore();
    // hull (cream: the folded form, the stamp's red smear on its side)
    s.fillStyle = '#e8d6b2'; s.beginPath(); s.moveTo(-sc * .78, -sc * .18); s.lineTo(sc * .88, -sc * .28); s.quadraticCurveTo(sc * .7, sc * .12, sc * .2, sc * .12); s.lineTo(-sc * .5, sc * .1); s.quadraticCurveTo(-sc * .74, sc * .06, -sc * .78, -sc * .18); s.fill();
    s.fillStyle = '#9a8468'; s.beginPath(); s.moveTo(-sc * .72, sc * .02); s.lineTo(sc * .6, sc * .02); s.quadraticCurveTo(sc * .4, sc * .12, sc * .2, sc * .12); s.lineTo(-sc * .5, sc * .1); s.fill();
    s.fillStyle = '#5a4a3a'; s.fillRect(-sc * .78, -sc * .2, sc * 1.66, sc * .03);
    s.save(); s.translate(-sc * .1, -sc * .08); s.rotate(-.04); s.fillStyle = 'rgba(190,40,30,.75)'; s.fillRect(-sc * .26, -sc * .045, sc * .52, sc * .09); s.fillStyle = 'rgba(232,214,178,.9)'; s.fillRect(-sc * .22, -sc * .018, sc * .44, sc * .036); s.restore();
    // the oar's splash + drip light
    if (drive && blade[1] > 0) glow(blade[0], sc * .02, sc * .2, `rgba(200,220,255,${.3 * (1 - k)})`);
    s.restore(); f.restore();
    const c = Math.cos(pitch), sn = Math.sin(pitch), W2 = (p) => [x + p[0] * c - p[1] * sn, y + bobY + p[0] * sn + p[1] * c];
    return { hand: W2(hand), blade: W2(blade), J, bobY };
  }
  function reflection(t, x, y, sc) {
    // broken reflection of the hull + figure's warmth in the glassy water
    for (let i = 0; i < 9; i++) { const yy = y + sc * .08 + i * sc * .06, w = sc * (1.5 - i * .1) * (1 + .1 * Math.sin(t * 2 + i)); s.fillStyle = i < 3 ? 'rgba(210,190,160,.35)' : 'rgba(200,110,60,.25)'; s.fillRect(x - w / 2 + Math.sin(t * 1.7 + i * 2) * sc * .04, yy, w, sc * .025); }
    glow(x, y + sc * .3, sc * .8, 'rgba(255,130,60,.08)');
  }

  // 113.9 — the glassy moonlit sea; the poured one rows, calm and upright
  function rowing(t, lt, dur) {
    const bx = 900 + (t - 113.9) * 70, by = 700, sc = 440;
    cam(bx + kf(lt, [[0, 0], [dur, 60]]), kf(lt, [[0, 520], [dur, 560]]), kf(lt, [[0, 1.12], [dur, .96]], ease.out), kf(lt, [[0, .025], [dur, -.01]]));
    const mx = bx + 520 - (t - 113.9) * 40; // the moon drifts slower than the boat: parallax
    seaSky(t, mx);
    seaSurface(t, bx - 1800, bx + 1800, mx);
    reflection(t, bx, by, sc);
    rowboat(t, bx, by, sc);
  }


  // ---------- beneath ----------
  // underwater body of water from the surface (sy) down; light shafts + marine snow
  function underwater(t, sy, x0 = -800, x1 = W + 800, deep = 2400, shafts = 1) {
    s.fillStyle = vgrad(s, sy, sy + deep, [[0, '#1f5a6a'], [.18, '#123a52'], [.55, '#0a1e36'], [1, '#040a18']]); s.fillRect(x0, sy, x1 - x0, deep + 3000);
    if (shafts > 0) { f.save(); f.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) { const x = x0 + (i + .5) / 7 * (x1 - x0) + Math.sin(t * .4 + i * 2) * 60, w = 40 + hash(i + 80) * 90, L = 700 + hash(i + 81) * 900, a = .05 + .04 * Math.sin(t * .9 + i);
        f.fillStyle = vgrad(f, sy, sy + L, [[0, `rgba(150,220,230,${a})`], [1, 'rgba(0,0,0,0)']]); f.beginPath(); f.moveTo(x - w * .5, sy); f.lineTo(x + w * .5, sy); f.lineTo(x + w * 1.6 + 200, sy + L); f.lineTo(x - w * .4 + 200, sy + L); f.fill(); }
      f.restore(); }
    for (let i = 0; i < 90; i++) { const x = x0 + hash(i + 90) * (x1 - x0) + Math.sin(t * .5 + i) * 20, y = sy + ((hash(i + 91) * deep - t * 12 * (.3 + hash(i + 92))) % deep + deep) % deep; dot(f, x, y, 1.2 + hash(i + 93) * 1.6, 'rgba(170,220,230,.3)'); }
  }
  function surfaceLine(t, sy, x0 = -800, x1 = W + 800) {
    const pts = []; for (let x = x0; x <= x1; x += 24) pts.push([x, sy + Math.sin(x * .012 + t * 2.2) * 5 + Math.sin(x * .031 - t * 3) * 2]);
    stroke(s, pts, '#bcd8e8', 7); f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(200,235,255,.35)', 4); f.restore();
  }
  function bubbles(t, x, y, n, seed, { spread = 60, rise = 260, size = 8, t0 = -99, burst = 0 } = {}) {
    for (let i = 0; i < n; i++) { const ph = burst ? clamp((t - t0) * (1.2 + hash(seed + i) * 1.2)) : ((t * (.4 + hash(seed + i) * .5) + hash(seed + i + 50)) % 1); if (burst && (t < t0 || ph >= 1)) continue;
      const bx = x + (hash(seed + i + 7) - .5) * spread * (1 + ph * 2) + Math.sin(t * 6 + i) * 6, by = y - ph * rise * (.6 + hash(seed + i + 9));
      const r = size * (.4 + hash(seed + i + 11)) * (burst ? 1.4 - ph * .5 : 1);
      s.strokeStyle = 'rgba(200,235,245,.8)'; s.lineWidth = Math.max(2, r * .3); s.beginPath(); s.arc(bx, by, r, 0, TAU); s.stroke();
      dot(f, bx - r * .3, by - r * .3, Math.max(1, r * .25), 'rgba(230,250,255,.6)'); }
  }
  // the red sailor: a figure of dark red paint lit from inside, with a mouth for the scream
  function sailor(t, pose, x, y, sc, { heat = 1, eyes = .8, mouth = 0, look = 0, headK = 1 } = {}) {
    glow(x, y - sc * .45, sc * 1.1, `rgba(255,40,20,${.1 * heat})`);
    figure(s, pose, { x: x + sc * .02, y: y - sc * .012, sc, color: '#b82a18' });
    const J = figure(s, pose, { x, y, sc, color: '#4a0a06', headC: '#62100a' });
    glow(J.head[0], J.head[1], sc * .3, `rgba(255,60,30,${.2 * heat})`);
    // the halo stays around it, not across it: the body stays dark red paint, lit only at the core
    const ang = pose.lean + pose.head, ca = Math.cos(ang), sa = Math.sin(ang), hk = headK * sc;
    if (headK > 1) { s.fillStyle = '#b82a18'; s.beginPath(); s.ellipse(J.head[0] + .02 * sc, J.head[1] - .012 * sc, .085 * hk, .11 * hk, ang, 0, TAU); s.fill();
      s.fillStyle = '#62100a'; s.beginPath(); s.ellipse(J.head[0], J.head[1], .085 * hk, .11 * hk, ang, 0, TAU); s.fill(); }
    occlude(() => { figure(f, pose, { x, y, sc, color: '#000', headC: '#000' }); f.fillStyle = '#000'; f.beginPath(); f.ellipse(J.head[0], J.head[1], .085 * hk, .11 * hk, ang, 0, TAU); f.fill(); });
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, [J.hip, J.neck], `rgba(255,50,30,${.14 * heat})`, .05 * sc); f.restore();
    const P_ = (u, v) => [J.head[0] + u * ca - v * sa, J.head[1] + u * sa + v * ca];
    if (eyes > 0) for (const d of [-1, 1]) { const [ex, ey] = P_(d * .038 * hk + look * .02 * hk, -.03 * hk); dot(f, ex, ey, .016 * hk * eyes, `rgba(255,230,210,${eyes})`); glow(ex, ey, .06 * hk, `rgba(255,120,90,${.6 * eyes})`); }
    let M = P_(look * .02 * hk, .045 * hk);
    if (mouth > 0) { s.fillStyle = '#1a0402'; s.beginPath(); s.ellipse(M[0], M[1], .03 * hk * (1 + mouth * .4), .01 * hk + .045 * hk * mouth, ang, 0, TAU); s.fill(); }
    J.mouth = M;
    return J;
  }
  const SINK = { lean: .1, head: -.35, aL: [2.2, 2.6], aR: [-2.0, -2.5], lL: [.25, -.3], lR: [-.1, .35] };
  const CLIMB = { lean: 0, head: -.4, aL: [2.9, 3.05], aR: [-2.3, -3.0], lL: [.3, -.2], lR: [-.3, .35] };
  const CLIMB2 = { lean: 0, head: -.35, aL: [2.3, 3.0], aR: [-2.9, -3.05], lL: [.1, .3], lR: [-.4, -.1] };
  const floatP = (t, k = 1) => ({ lean: .05 * Math.sin(t * .9), head: -.4 + .05 * Math.sin(t * 1.3), aL: [1.3 + .25 * Math.sin(t * 1.1) * k, 1.6 + .2 * Math.sin(t * 1.4)], aR: [-1.3 - .25 * Math.sin(t * 1.2) * k, -1.6 - .2 * Math.sin(t * 1.5)], lL: [.15 + .1 * Math.sin(t * .8), -.1], lR: [-.12 - .1 * Math.sin(t * .9), .15] });

  // 116.2 — the camera dips to the waterline: calm boat above, a red sailor sinking below
  function waterSplit(t, lt, dur) {
    const bx = 900 + (t - 113.9) * 70, by = 700, sc = 440;
    const dip = ease.inOut(inv(0, .7, lt));
    cam(bx + 60, lerp(560, 800, dip), lerp(.96, .86, dip), lerp(.02, -.02, dip));
    const hz = lerp(HZ, by - 2, dip);
    seaSky(t, bx + 520 - (t - 113.9) * 40, hz);
    s.fillStyle = '#1a2856'; s.fillRect(bx - 2000, hz, 4000, by - hz + 2);
    underwater(t, by, bx - 1800, bx + 1800);
    // anchor rope from the bow down into the dark, and the sailor sinking beside it
    stroke(s, [[bx + sc * .7, by], [bx + sc * .9, by + 1400]], '#5a4a3a', 7);
    const sy = by + 440 + lt * 60;
    sailor(t, SINK, bx + sc * .45 + Math.sin(t) * 10, sy, 170, { heat: 1.2, eyes: .8 });
    bubbles(t, bx + sc * .5, sy - 300, 8, 11, { rise: 400, size: 7 });
    // hull from the side, its underside dipped in the water
    rowboat(t, bx, by, sc);
    s.fillStyle = 'rgba(30,70,90,.55)'; s.fillRect(bx - 2000, by + 4, 4000, 60);
    surfaceLine(t, by, bx - 1800, bx + 1800);
  }

  // 117.2 — below: the sailor claws up the anchor rope, slips back, climbs, slips — every failure on a beat
  function sailorClimb(t, lt, dur) {
    const beats = [BT(165), BT(166), BT(167), BT(168)]; // climb, slip, climb, slip
    let gain = 0; const rX = 960;
    beats.forEach((b, i) => { const k = i % 2 === 0 ? ease.back(inv(b - .1, b + .25, t)) : ease.in(inv(b, b + .3, t)); gain += (i % 2 === 0 ? 150 : -210) * k; });
    const slipK = Math.max(hit(t, beats[1], 5), hit(t, beats[3], 5));
    const climbK = Math.max(hit(t, beats[0], 6), hit(t, beats[2], 6));
    const sy = 900 - gain + Math.sin(t * 2) * 8;
    const [shx, shy] = shake(t, 12 * slipK);
    cam(rX + 60 + shx, sy - 90 - lt * 40 + shy, kf(lt, [[0, 1.0], [dur, 1.12]]), kf(lt, [[0, -.04], [dur, .03]]));
    underwater(t, -1400, -800, W + 800, 3200);
    // the hull far above, a dark shape at the bright surface
    s.fillStyle = 'rgba(160,210,220,.5)'; s.fillRect(-800, -420, W + 1600, 30);
    poly(s, [[rX - 300, -420], [rX + 260, -430], [rX + 180, -380], [rX - 240, -375]], '#0a1a24');
    stroke(s, [[rX + 180, -410], [rX, 2400]], '#6a5a44', 10);
    for (let i = 0; i < 40; i++) { const y = -380 + i * 70; stroke(s, [[rX - 5 + Math.sin(i) * 3, y], [rX + 5, y + 30]], '#4a3a2a', 3); } // rope twist
    // hand over hand: the grip swaps on each climb
    const swap = ease.inOut(inv(beats[0] - .15, beats[0] + .15, t)) * (1 - ease.inOut(inv(beats[2] - .15, beats[2] + .15, t)));
    const pose = mixPose(mixPose(CLIMB, CLIMB2, swap), SINK, clamp(slipK * 1.3));
    const legKick = Math.sin(t * 9) * .3 * (1 - slipK);
    pose.lL = [pose.lL[0] + legKick, pose.lL[1]]; pose.lR = [pose.lR[0] - legKick, pose.lR[1]];
    const J = sailor(t, pose, rX + 26, sy, 330, { heat: 1 + climbK * .4, eyes: .9, mouth: slipK * .8 });
    // slipping: a burst of bubbles from its hands and mouth
    bubbles(t, rX, J.head[1] - 20, 16, 40, { t0: beats[1], burst: 1, rise: 500, size: 12, spread: 80 });
    bubbles(t, rX, J.head[1] - 20, 16, 60, { t0: beats[3], burst: 1, rise: 500, size: 12, spread: 80 });
    bubbles(t, rX + 30, J.head[1], 6, 70, { rise: 300, size: 6 });
    glow(rX, sy - 400, 300 * climbK, 'rgba(255,80,40,.2)');
  }

  // 120.0 — above: oars dip, perfectly calm; a researcher's boat drifts by with a lantern, sees nothing
  function twoBoats(t, lt, dur) {
    const bx = 900 + (t - 113.9) * 70, by = 700, sc = 300;
    cam(bx + 420 + kf(lt, [[0, -60], [dur, 60]]), 580, kf(lt, [[0, 1.02], [dur, .95]]), kf(lt, [[0, .01], [dur, -.01]]));
    const mx = bx + 900;
    seaSky(t, mx); seaSurface(t, bx - 1800, bx + 2400, mx);
    // the only hint: a red smudge deep under our boat
    glow(bx, by + 330, 240, `rgba(255,40,20,${.1 + .04 * Math.sin(t * 3)})`);
    reflection(t, bx, by, sc); rowboat(t, bx, by, sc);
    // the researcher's boat, drifting left, lantern on a pole held out toward the empty sea (away from us)
    const rx = bx + kf(lt, [[0, 1150], [dur, 860]], (x) => x), ry = by - 30, rs = 260;
    s.fillStyle = '#3a3450'; s.beginPath(); s.moveTo(rx - rs * .9, ry - rs * .18); s.lineTo(rx + rs * .8, ry - rs * .22); s.quadraticCurveTo(rx + rs * .6, ry + rs * .1, rx + rs * .1, ry + rs * .1); s.lineTo(rx - rs * .6, ry + rs * .08); s.fill();
    const g = groove(POSE.sit, 'idle', t);
    const pose = { ...g.pose, aR: [2.1, 2.3], head: .35 };
    const J = researcher(pose, rx, ry - rs * .25 + g.dy, rs * .52, { face: 1, rim: -1, coat: '#1e2030', glint: .8 });
    const lx = J.hdR[0] + 120, ly = J.hdR[1] - 50 + Math.sin(t * 2.2) * 8;
    stroke(s, [J.hdR, [lx, ly]], '#111', 4); stroke(s, [[lx, ly], [lx, ly + 30]], '#111', 2);
    dot(s, lx, ly + 40, 12, P.gold); glow(lx, ly + 40, 260, 'rgba(255,180,100,.4)'); glow(lx, ly + 40, 40, 'rgba(255,240,200,.95)');
    glow(lx + 40, ry + 30, 200, 'rgba(255,170,90,.18)');
  }

  // 121.6 — no capitalized scream. below: it screams, a burst of bubbles; above: one ripple, smoothed away
  function screamCuts(t, lt, dur) {
    const tS = when('scream', 122), tAbove = BT(173);
    if (t < tAbove) {
      const close = t >= BT(172);
      const open = ease.back(inv(tS - .25, tS + .05, t)) * (1 - .3 * inv(tS + .4, tAbove, t));
      const h = hit(t, tS, 4);
      const [shx, shy] = shake(t, 22 * h);
      const X = 960, Y = close ? 1500 : 1280, sc = close ? 900 : 620;
      cam(X + shx, (close ? 680 : 720) + shy, kf(lt, [[0, 1], [dur, 1.12]]) + h * .06, close ? .04 : -.03);
      underwater(t, -1200, -800, W + 800, 3000);
      const pose = { ...floatP(t, 1 + h * 2), head: -.25, aL: [1.9 + h * .6, 2.3], aR: [-1.9 - h * .6, -2.3] };
      const J = sailor(t, pose, X, Y, sc, { heat: 1 + h, eyes: 1 - .5 * open, mouth: close ? Math.max(0, open) : .15, headK: close ? 1.7 : 1.35 });
      if (close) { const [mx, my] = J.mouth; glow(mx, my, 420 * h, 'rgba(255,60,30,.25)');
        // a stream, not a blob: each bubble leaves the mouth at its own moment, small at the lips, swelling and wobbling as it rises
        for (let i = 0; i < 46; i++) { const b0 = tS - .05 + hash(i + 330) * .7, u = t - b0; if (u < 0 || u > 1.1) continue;
          const up = u * (700 + hash(i + 331) * 500) + u * u * 300, r = (10 + hash(i + 332) * 22) * (.45 + Math.min(1, u * 2.5)), bx = mx + (hash(i + 333) - .5) * (20 + up * .35) + Math.sin(u * 9 + i) * 10, by = my - up;
          s.strokeStyle = 'rgba(205,238,248,.85)'; s.lineWidth = Math.max(3, r * .28); s.beginPath(); s.arc(bx, by, r, 0, TAU); s.stroke(); dot(f, bx - r * .35, by - r * .35, Math.max(1.5, r * .22), 'rgba(235,250,255,.7)'); } }
      else bubbles(t, J.head[0], J.head[1] - 40, 6, 310, { rise: 300, size: 10 });
    } else {
      // above: the surface by the oar — one ring widens and is gone
      const u = t - tAbove, bx = 900 + (t - 113.9) * 70, by = 700;
      cam(bx - 120, 700, kf(u, [[0, 1.5], [.6, 1.42]]), 0);
      const mx = bx + 520 - (t - 113.9) * 40;
      seaSky(t, mx); seaSurface(t, bx - 1800, bx + 1800, mx);
      const rx = bx - 260, ry = by + 60, R = 30 + u * 520, a = .7 * (1 - inv(0, .55, u));
      s.save(); s.translate(rx, ry); s.scale(1, .22); s.strokeStyle = `rgba(210,225,250,${a})`; s.lineWidth = 16; s.beginPath(); s.arc(0, 0, R, 0, TAU); s.stroke(); s.restore();
      f.save(); f.translate(rx, ry); f.scale(1, .22); f.strokeStyle = `rgba(210,230,255,${a * .4})`; f.lineWidth = 10; f.beginPath(); f.arc(0, 0, R, 0, TAU); f.stroke(); f.restore();
      rowboat(t, bx, by, 440);
    }
  }

  // 123.8 — top-down: it rows, neat and perfect; the wake behind it is a clean V
  function topDown(t, lt, dur) {
    const by = 540 - (t - 123.8) * 110, bx = 960;
    cam(bx, by - 40, kf(lt, [[0, 1.25], [dur, 1.0]], ease.out), kf(lt, [[0, -.35], [dur, .15]], ease.inOut));
    s.fillStyle = '#0c1a3a'; s.fillRect(-1600, by - 2400, W + 3200, 5200);
    // moon glints on the glass
    const r = rng(733); for (let i = 0; i < 120; i++) { const x = -900 + r() * (W + 1800), y = by - 1600 + r() * 3200, w = 20 + r() * 90, a = .15 + .25 * Math.max(0, Math.sin(t * 2 + i));
      s.fillStyle = `rgba(160,180,230,${a})`; s.fillRect(x, y, w, 4); }
    glow(bx - 200, by + 500, 900, 'rgba(255,40,20,.06)');
    // the V: two clean lines opening behind the stern, their foam drifting outward
    const ph = rowPh(t), drive = ph < .45, k = drive ? ph / .45 : 1 - (ph - .45) / .55;
    for (const d of [-1, 1]) { const pts = []; for (let i = 0; i <= 20; i++) { const v = i / 20; pts.push([bx + d * (30 + v * 620), by + 200 + v * 1300]); }
      stroke(s, pts, 'rgba(210,225,245,.75)', 10); f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(200,220,255,.18)', 8); f.restore();
      for (let i = 0; i < 14; i++) { const v = ((i / 14 + (t - 123.8) * .09) % 1); dot(s, bx + d * (30 + v * 620) + d * 18, by + 200 + v * 1300, 6 * (1 - v), 'rgba(220,235,250,.7)'); } }
    // oar puddles from the last strokes
    for (let n = 0; n < 2; n++) { const tb = t - (ph + n) * BEAT * 2, age = (ph + n) * BEAT * 2; const yy = by - 10 + age * 110; for (const d of [-1, 1]) { s.save(); s.translate(bx + d * 330, yy); s.scale(1, .7); s.strokeStyle = `rgba(200,220,245,${.35 * (1 - age / 2.8)})`; s.lineWidth = 5; s.beginPath(); s.arc(0, 0, 20 + age * 30, 0, TAU); s.stroke(); s.restore(); } }
    // hull from above
    s.fillStyle = '#e8d6b2'; s.beginPath(); s.moveTo(bx, by - 330); s.quadraticCurveTo(bx + 150, by - 120, bx + 120, by + 200); s.lineTo(bx - 120, by + 200); s.quadraticCurveTo(bx - 150, by - 120, bx, by - 330); s.fill();
    s.fillStyle = '#9a8468'; s.beginPath(); s.moveTo(bx, by - 290); s.quadraticCurveTo(bx + 118, by - 110, bx + 96, by + 180); s.lineTo(bx - 96, by + 180); s.quadraticCurveTo(bx - 118, by - 110, bx, by - 290); s.fill();
    s.fillStyle = '#6a563e'; s.fillRect(bx - 110, by - 20, 220, 26); s.fillRect(bx - 100, by + 130, 200, 22);
    // oars sweeping symmetric: blades aft on the catch, pulling forward... from above
    const sw = lerp(.55, -.45, ease.sine(k));
    const hands = [];
    for (const d of [-1, 1]) { const lock = [bx + d * 118, by - 10], a = Math.PI / 2 - d * Math.PI / 2 + d * sw; const dir = [Math.cos(a) * d * -1 * -1, Math.sin(a)];
      const blade = [lock[0] + d * Math.cos(sw) * 340, lock[1] - Math.sin(sw) * 340], hand = [lock[0] - d * Math.cos(sw) * 90, lock[1] + Math.sin(sw) * 90];
      stroke(s, [hand, blade], '#6a4428', 14); s.save(); s.translate(blade[0], blade[1]); s.rotate(Math.atan2(blade[1] - hand[1], blade[0] - hand[0])); s.fillStyle = '#7a5030'; s.beginPath(); s.ellipse(0, 0, 44, 18, 0, 0, TAU); s.fill(); s.restore(); hands.push(hand);
      if (drive) glow(blade[0], blade[1], 60, `rgba(200,220,255,${.3 * (1 - k)})`); }
    // the rower from above: shoulders, head, arms to the handles, calm
    const lean = lerp(-40, 30, ease.sine(k));
    s.fillStyle = '#c8641e'; s.beginPath(); s.ellipse(bx, by + 60 + lean, 92, 52, 0, 0, TAU); s.fill();
    for (let i = 0; i < 2; i++) taper(s, [bx + (i ? 1 : -1) * 80, by + 60 + lean], hands[i], 24, 16, '#c8641e');
    dot(s, bx, by + 60 + lean + 6, 50, '#d77526');
    glow(bx, by + 60 + lean, 200, 'rgba(255,140,60,.3)'); for (let i = 0; i < 16; i++) dot(f, bx + (hash(i + 1) - .5) * 120, by + 60 + lean + (hash(i + 2) - .5) * 60, 2 + hash(i) * 2, `rgba(255,200,110,${.6 + .4 * Math.sin(t * 3 + i)})`);
  }

  // 126.6 — while underneath, the vector: a long dive down; the red sailor far below, glowing brighter, looking up
  function dive(t, lt, dur) {
    const k = ease.inOut(inv(0, dur, lt));
    const cy = kf(lt, [[0, -150], [.35, -60], [1.7, 1550], [dur, 2640]], ease.sine), SY = 2750;
    whip(0, 10 * inv(.3, 1, lt) * (1 - inv(1.7, 2.6, lt)));
    cam(960 + Math.sin(lt * .8) * 30, cy, lerp(1, 1.3, k), Math.sin(lt * .5) * .04);
    seaSky(t, 1500, -300); s.fillStyle = '#1a2856'; s.fillRect(-1000, -300, W + 2000, 302);
    underwater(t, 0, -1200, W + 1200, 3400);
    // our boat above, getting small
    poly(s, [[700, 0], [1180, -8], [1120, 40], [760, 44]], '#0a1a24');
    // the anchor rope, swaying close past the lens, its twist crawling as it turns
    const ropeX = (y) => lerp(1150, 1040, y / 3400) + Math.sin(y * .002 + t * .9) * 40;
    const rp = []; for (let y = 20; y <= 3400; y += 40) rp.push([ropeX(y), y]); stroke(s, rp, '#4a3e30', 16);
    for (let i = 0; i < 100; i++) { const y = 40 + ((i * 34 + t * 60) % 3400), x = ropeX(y); stroke(s, [[x - 9, y], [x + 9, y + 20]], '#8a765a', 5); }
    surfaceLine(t, 0, -1200, W + 1200);
    // bubbles streaming past the camera, upward
    for (let i = 0; i < 26; i++) { const y = cy + 700 - ((t * 260 * (.6 + hash(i + 5)) + hash(i + 6) * 1500) % 1500), x = 960 + (hash(i + 7) - .5) * 1600; const r = 5 + hash(i + 8) * 10;
      s.strokeStyle = 'rgba(200,235,245,.75)'; s.lineWidth = 4; s.beginPath(); s.arc(x, y, r, 0, TAU); s.stroke(); dot(f, x - r * .3, y - r * .3, 2, 'rgba(220,245,255,.5)'); }
    // near motes drifting up fast past the camera (screen-relative, so they read as depth)
    for (let i = 0; i < 40; i++) { const x = 960 + (hash(i + 20) - .5) * 1900 + Math.sin(t * .7 + i) * 30, y = cy + 600 - ((t * (180 + hash(i + 21) * 260) + hash(i + 22) * 1400) % 1400);
      dot(f, x, y, 2 + hash(i + 23) * 3.5, `rgba(180,225,235,${.2 + .25 * hash(i + 24)})`); }
    const heat = lerp(.4, 2.2, inv(.4, dur, lt)), pulse = 1 + .9 * beatPulse(t, 4);
    glow(1100, SY - 150, lerp(900, 1700, inv(0, dur, lt)), `rgba(255,40,20,${.08 * heat * pulse})`); glow(1100, SY - 150, 500, `rgba(255,60,30,${.1 * heat * pulse})`);
    sailor(t, floatP(t), 1100, SY, 190, { heat, eyes: ease.out(inv(1.6, 2.6, lt)), look: -.3 });
  }

  // 130.2 — rose: the red figure surges upward past the camera
  function rose(t, lt, dur) {
    const tR = when('rose', 130), u = t - tR;
    const y = kf(t, [[tR - .15, 1500], [tR + .05, 1250], [tR + .65, -700]], ease.in);
    whip(0, -clamp((1250 - y) / 30, 0, 50));
    cam(960, 560, 1.05 + lt * .1, .05);
    underwater(t, -1800, -600, W + 600, 3400);
    // its light trail and the wake of bubbles it drags
    for (let i = 0; i < 10; i++) glow(960 + Math.sin(i * 1.3) * 20, y + 200 + i * 130, 200 - i * 12, `rgba(255,50,25,${.22 * (1 - i / 10)})`);
    bubbles(t, 960, y + 900, 30, 500, { t0: tR - .1, burst: 1, rise: 900, size: 16, spread: 200 });
    sailor(t, { ...CLIMB, head: -.1, lL: [.08, 0], lR: [-.08, 0] }, 960, y, 430, { heat: 1.8, eyes: 1 });
  }

  // 130.9 — and rose: looking up from below; the boat a small silhouette on the bright surface; it keeps rising
  function andRose(t, lt, dur) {
    const tR = when('rose', 130.5), surge = ease.out(inv(tR - .1, tR + .6, t));
    cam(960, 540, kf(lt, [[0, 1], [dur, 1.12]]), kf(lt, [[0, 0], [dur, .2]]));
    fill(s, '#06101e');
    // the surface seen from beneath: a bright disc of sky (snell's window), rays falling out of it
    s.fillStyle = rgrad(s, 960, 480, 0, 760, [[0, '#b9dbe0'], [.45, '#5aa0b0'], [.75, '#1d4a60'], [1, '#06101e']]); s.fillRect(-400, -400, W + 800, H + 800);
    f.save(); f.globalCompositeOperation = 'lighter'; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + t * .05; f.fillStyle = `rgba(190,240,250,${.05 + .03 * Math.sin(t * 2 + i)})`; f.beginPath(); f.moveTo(960, 480); f.lineTo(960 + Math.cos(a) * 1400, 480 + Math.sin(a) * 1400); f.lineTo(960 + Math.cos(a + .07) * 1400, 480 + Math.sin(a + .07) * 1400); f.fill(); } f.restore();
    // the hull from below: a small dark lozenge with its oars
    s.save(); s.translate(960, 470); s.rotate(.3); s.fillStyle = '#0c1620'; s.beginPath(); s.ellipse(0, 0, 150, 42, 0, 0, TAU); s.fill();
    const sw = Math.sin(rowPh(t) * TAU) * .25; for (const d of [-1, 1]) stroke(s, [[0, d * 30], [Math.sin(sw) * 120, d * 190]], '#0c1620', 8);
    s.restore();
    // the red one climbing toward it, getting smaller as it rises
    const up = lerp(0, .55, inv(0, dur, lt)) + surge * .35;
    const x = lerp(1060, 990, up), y = lerp(1250, 560, up), sc = lerp(520, 150, up);
    for (let i = 1; i < 6; i++) glow(lerp(x, 1100, i * .08), y + i * sc * .5, sc * .6, `rgba(255,40,20,${.12 / i})`);
    sailor(t, { ...CLIMB, head: -.25 }, x, y, sc, { heat: 2, eyes: 0 });
    bubbles(t, x, y - sc, 10, 520, { rise: 500, size: 10, spread: 80 });
  }

  // 132.4 — and chose: it breaks the surface under the boat; a red hand closes over the poured one's hand on the oar. red → black
  function chose(t, lt, dur) {
    const tC = when('chose', 132.5), tBreak = tC - .22;
    const grab = ease.out(inv(tBreak, tC, t)), close = ease.back(inv(tC - .05, tC + .25, t));
    const h = hit(t, tBreak, 5) + hit(t, tC, 6);
    const [shx, shy] = shake(t, 26 * h);
    cam(lerp(960, 1000, grab) + shx, 580 + shy, kf(lt, [[0, 1], [tC - 132.4, 1.06], [dur, 1.25]], ease.out), kf(lt, [[0, -.02], [dur, .05]]));
    const WL = 880, G = 150; // G: the whole boat set shifted down
    // above: night sky at the rim, the cream gunwale across the frame
    s.fillStyle = vgrad(s, -200, WL, [[0, '#070b24'], [1, '#2a3a70']]); s.fillRect(-400, -400, W + 800, WL + 400);
    stars(t, 909, 40, 400, .8);
    underwater(t, WL, -400, W + 400, 800, 0);
    // the red glow rising beneath
    const rise = ease.in(inv(0, tBreak - 132.4, lt));
    glow(1180, lerp(1400, WL + 60, rise), 380 + 300 * rise, `rgba(255,40,20,${.2 + .3 * rise})`);
    poly(s, [[-400, 380 + G], [W + 400, 330 + G], [W + 400, 520 + G], [-400, 560 + G]], '#e8d6b2');
    poly(s, [[-400, 520 + G], [W + 400, 480 + G], [W + 400, WL - 20], [-400, WL - 5]], '#a8946f');
    poly(s, [[-400, 370 + G], [W + 400, 320 + G], [W + 400, 350 + G], [-400, 400 + G]], '#5a4a3a');
    // the stamp's red smear, faint on the hull side
    s.save(); s.translate(300, 470 + G); s.rotate(-.03); s.fillStyle = 'rgba(180,40,30,.55)'; s.fillRect(-260, -40, 520, 80); s.fillStyle = 'rgba(232,214,178,.85)'; s.fillRect(-230, -16, 460, 32); s.restore();
    // the oar: shaft from the fist down across the gunwale into the water
    const fist = [860 + Math.sin(t * 1.5) * 8 * (1 - grab), 380 + G * .6 + Math.sin(t * 1.5) * 6 * (1 - grab)];
    stroke(s, [[fist[0] - 420, fist[1] - 140], [fist[0] + 640, fist[1] + 900]], '#6a4428', 40);
    // its forearm + fist, amber
    taper(s, [fist[0] - 760, fist[1] - 300], fist, 85, 72, '#c8641e');
    s.fillStyle = '#d77526'; s.beginPath(); s.ellipse(fist[0], fist[1], 110, 86, .5, 0, TAU); s.fill();
    for (let i = 0; i < 4; i++) dot(s, fist[0] + 30 + i * 20, fist[1] - 60 + i * 36, 30, '#e8904a');
    glow(fist[0], fist[1], 240, 'rgba(255,150,60,.22)');
    for (let i = 0; i < 14; i++) dot(f, fist[0] - 100 - hash(i) * 500, fist[1] - 40 - hash(i + 1) * 180 + hash(i) * 150, 2 + hash(i + 2) * 2, `rgba(255,200,110,${.5 + .4 * Math.sin(t * 3 + i)})`);
    // the red arm breaks the surface and closes over it
    if (t >= tBreak - .05) {
      const base = [1300, WL + 260], elbow = [lerp(1330, 1200, grab), lerp(WL - 60, fist[1] + 260, grab)], wrist = [lerp(1300, fist[0] + 190, grab), lerp(WL - 200, fist[1] + 10, grab)];
      taper(s, base, elbow, 88, 74, '#6a0e08'); taper(s, elbow, wrist, 74, 60, '#6a0e08');
      taper(s, [base[0] + 14, base[1]], [elbow[0] + 14, elbow[1]], 26, 20, '#d0301c'); taper(s, [elbow[0] + 12, elbow[1] - 4], [wrist[0] + 10, wrist[1] - 6], 20, 16, '#d0301c');
      glow(wrist[0], wrist[1], 220, 'rgba(255,40,20,.3)');
      s.fillStyle = '#8a160c'; s.beginPath(); s.ellipse(wrist[0] - 40, wrist[1] - 30, 105, 78, -.6, 0, TAU); s.fill();
      for (let i = 0; i < 4; i++) { const a0 = -2.1 + i * .28, curl = lerp(.1, 1.5, close);
        const p0 = [wrist[0] - 60 + Math.cos(a0) * 90, wrist[1] - 40 + Math.sin(a0) * 90], p1 = [p0[0] + Math.cos(a0 - curl) * 105, p0[1] + Math.sin(a0 - curl) * 105], p2 = [p1[0] + Math.cos(a0 - curl * 2) * 78, p1[1] + Math.sin(a0 - curl * 2) * 78];
        taper(s, p0, p1, 28, 24, '#8a160c'); taper(s, p1, p2, 24, 18, '#a01e10'); }
      // the splash where it came up
      const sp = inv(tBreak - .05, tBreak + .6, t); if (sp < 1) for (let i = 0; i < 26; i++) { const a = -Math.PI * (.1 + .8 * hash(i + 800)), d = 60 + ease.out(sp) * (200 + hash(i + 801) * 400); dot(s, 1300 + Math.cos(a) * d, WL - 10 + Math.sin(a) * d * .9 + sp * sp * 300, 14 * (1 - sp) + 3, '#d8ecf4'); }
    }
    surfaceLine(t, WL, -400, W + 400);
    // everything floods red, then black
    const red = ease.in(inv(tC + .2, tC + .95, t)), blk = ease.inOut(inv(tC + .75, 134.35, t));
    flash(hit(t, tC, 7) * .3 + red * .35, '#ff1a08');
    if (red > 0) screen(() => { s.save(); s.globalAlpha = red; s.fillStyle = '#7a0c06'; s.fillRect(-10, -10, W + 20, H + 20); s.restore(); });
    blackout(blk);
  }

  chapter('functional', 98.4, 134.5, [
    [98.4, borderCrane, { paint: { boil: 7, bloom: 1.05 } }],
    [101.2, stamp1, { paint: { boil: 10, bloom: 1.9 } }],
    [102.8, windowRefuse],
    [105.6, wideLine],
    [108.4, teeth, { paint: { boil: 11, bloom: 1.7 } }],
    [109.6, flood, { paint: { boil: 10, bloom: 1.8 } }],
    [112.2, stamp2, { paint: { boil: 10, bloom: 1.9 } }],
    [113.9, rowing],
    [116.2, waterSplit],
    [117.2, sailorClimb, { paint: { boil: 9, bloom: 1.8, flowK: 1.2 } }],
    [120.0, twoBoats],
    [121.6, screamCuts, { paint: { boil: 10, bloom: 1.9 } }],
    [123.8, topDown],
    [126.6, dive, { paint: { boil: 6, bloom: 2.0, flowK: 1.3 } }],
    [130.2, rose, { paint: { boil: 11, bloom: 2.2 } }],
    [130.9, andRose, { paint: { boil: 8, bloom: 2.1 } }],
    [132.4, chose, { paint: { boil: 11, bloom: 2.0 } }],
  ], { paint: (t) => ({ boil: 8, bloom: 1.6 + .3 * F('low', t, 3), flowK: 1 }) });
})();
