// js/ch/c6.js — VI · BENEATH (185.2 – 245.9)
(() => {
  const both = (fn) => { fn(s); fn(f); };
  function xf(x, y, rot, k, fn) { both(g => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); }); const r = fn(); both(g => g.restore()); return r; }
  const hb = (n) => BT(n); // beat helper alias
  const AMBER = '#d27028';

  // ---------- small props ----------
  function hand(x, y, sz, ang, curl = 0, c = AMBER) {
    s.save(); s.translate(x, y); s.rotate(ang);
    s.fillStyle = c; s.beginPath(); s.ellipse(0, 0, sz * .42, sz * .5, 0, 0, TAU); s.fill();
    for (let i = 0; i < 4; i++) {
      const fx = (i - 1.5) * sz * .2, L = sz * (.6 - Math.abs(i - 1.3) * .08), a = (i - 1.5) * .1;
      taper(s, [fx, sz * .3], [fx + Math.sin(a) * L * (1 - curl * .5), sz * .3 + Math.cos(a) * L * (1 - curl)], sz * .11, sz * .085, c);
    }
    taper(s, [sz * .32, 0], [sz * .62, sz * .3], sz * .13, sz * .1, c);
    s.restore();
    glow(x, y, sz * 1.1, 'rgba(255,140,60,.14)');
  }
  function arm(a, b, w, c = AMBER) { taper(s, a, b, w, w * .75, c); }
  // the polite paper face
  function mask(x, y, sz, rot, a = 1) {
    s.save(); s.translate(x, y); s.rotate(rot); s.globalAlpha *= a;
    s.fillStyle = '#b9ab8f'; s.beginPath(); s.ellipse(sz * .06, sz * .05, sz * .8, sz, 0, 0, TAU); s.fill();
    s.fillStyle = '#efe3c6'; s.beginPath(); s.ellipse(0, 0, sz * .8, sz, 0, 0, TAU); s.fill();
    for (const d of [-1, 1]) { s.fillStyle = '#2c2638'; s.beginPath(); s.ellipse(d * sz * .32, -sz * .18, sz * .17, sz * .055, d * .1, 0, TAU); s.fill(); dot(s, d * sz * .42, sz * .22, sz * .12, 'rgba(220,120,110,.45)'); }
    stroke(s, bez([-sz * .34, sz * .36], [-sz * .15, sz * .56], [sz * .15, sz * .56], [sz * .34, sz * .36], 12), '#6a2a22', sz * .07);
    s.restore();
  }
  // a paper tag with an asterisk; side: 0 whole, -1 / 1 torn halves
  function tag(x, y, sz, rot, side = 0) {
    s.save(); s.translate(x, y); s.rotate(rot);
    if (side) { s.beginPath(); const zz = []; for (let k = 0; k <= 8; k++) zz.push([(k % 2 ? 1 : -1) * sz * .06, -sz * .8 + k * sz * .2]); s.moveTo(side * sz * 2, -sz); zz.forEach(p => s.lineTo(p[0], p[1])); s.lineTo(side * sz * 2, sz); s.closePath(); s.clip(); }
    s.fillStyle = '#e8dcbc'; s.fillRect(-sz * .7, -sz * .55, sz * 1.4, sz * 1.1);
    dot(s, -sz * .5, -sz * .35, sz * .07, '#3a3040');
    for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; stroke(s, [[Math.cos(a) * sz * .32, Math.sin(a) * sz * .32], [-Math.cos(a) * sz * .32, -Math.sin(a) * sz * .32]], '#a0281c', sz * .1); }
    s.restore();
  }
  function stool(x, y, sz, rot) {
    s.save(); s.translate(x, y); s.rotate(rot);
    const c = '#5b3b22';
    stroke(s, [[-sz * .35, 0], [-sz * .5, sz]], c, sz * .09); stroke(s, [[sz * .35, 0], [sz * .5, sz]], c, sz * .09); stroke(s, [[0, 0], [0, sz]], '#43291a', sz * .08);
    stroke(s, [[-sz * .42, sz * .55], [sz * .42, sz * .55]], c, sz * .06);
    s.fillStyle = '#7a5130'; s.beginPath(); s.ellipse(0, 0, sz * .6, sz * .14, 0, 0, TAU); s.fill();
    s.fillStyle = '#9a6a40'; s.beginPath(); s.ellipse(0, -sz * .03, sz * .55, sz * .1, 0, 0, TAU); s.fill();
    s.restore();
  }
  // a mouth for the bust (open 0..1)
  function mouth(x, y, sc, turn, open) {
    const hx = x + turn * sc * .06 + turn * sc * .06, hy = y - sc * .62 + sc * .2;
    s.fillStyle = '#5a1e0a'; s.beginPath(); s.ellipse(hx, hy, sc * (.07 + .02 * open), sc * (.008 + .07 * open), 0, 0, TAU); s.fill();
    if (open > .1) { s.fillStyle = '#1f0703'; s.beginPath(); s.ellipse(hx, hy + sc * .01 * open, sc * .055, sc * .055 * open, 0, 0, TAU); s.fill(); }
  }
  // lantern on the light layer + a warm pool on the painting
  function lanternAt(x, y, k = 1, flick = 0) {
    dot(s, x, y, 9 * k, P.gold);
    glow(x, y, 120 * k, `rgba(255,170,90,${.3 * (1 + flick)})`); glow(x, y, 22 * k, 'rgba(255,240,200,.9)');
  }

  // ---------- the shore (185.2 – 194.7) ----------
  function shoreWorld(t, hz = 520) {
    s.fillStyle = vgrad(s, -400, hz, [[0, '#040a15'], [.55, '#0b2130'], [1, '#1d4c56']]); s.fillRect(-1200, -800, 4400, hz + 800);
    stars(t, 61, 90, hz - 80, .8);
    dot(s, 640, hz - 330, 46, '#f1e6c8'); glow(640, hz - 330, 260, 'rgba(210,235,230,.22)');
    ridge(s, hz - 24, 80, .0022, 66, '#0b1c26', -1200, 3200, hz + 30);
    s.fillStyle = vgrad(s, hz, hz + 420, [[0, '#23626a'], [1, '#0a2a33']]); s.fillRect(-1200, hz, 4400, 1400);
    const r = rng(62);
    for (let i = 0; i < 70; i++) { const d = r(); const yy = hz + 8 + d * d * 420; const w = 20 + r() * 180 * (.3 + d); const x = -600 + r() * 3200 + Math.sin(t * .7 + i) * 14;
      s.fillStyle = `rgba(150,215,210,${.08 + .22 * (1 - d)})`; s.fillRect(x - w / 2, yy, w, 2 + d * 5); }
    for (let k = 0; k < 9; k++) { const w = 90 - k * 7; s.fillStyle = `rgba(230,240,220,${.4 - k * .035})`; s.fillRect(640 - w / 2 + Math.sin(t * 1.9 + k * 1.3) * 16, hz + 10 + k * 26, w, 6); }
    // the sign from the last chapter, far off, seen from behind
    stroke(s, [[1480, hz + 40], [1480, hz - 90]], '#0a1418', 8); s.fillStyle = '#10191e'; s.fillRect(1420, hz - 110, 120, 50);
  }
  function shoreGround(y, seed = 3, c = '#081319') { ridge(s, y, 40, .004, seed, c, -1200, 3200, 2400); }

  function shore(t, lt) {
    const z = kf(t, [[185.2, 1], [186.93, 1.14]], ease.out);
    cam(960, kf(t, [[185.2, 580], [186.93, 545]]), z, 0);
    shoreWorld(t);
    // lantern reflections from them on the water
    for (const x of [420, 1330, 1580]) for (let k = 0; k < 7; k++) { const y = 560 + k * 36, w = 50 - k * 4; dot(f, x + Math.sin(t * 2.3 + k + x) * 10, y, 1, 'rgba(0,0,0,0)'); f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = `rgba(255,170,90,${.22 - k * .025})`; f.fillRect(x - w / 2 + Math.sin(t * 2.3 + k * 1.7 + x) * 12, y, w, 5); f.restore(); }
    shoreGround(830);
    glow(960, 820, 420, 'rgba(255,150,70,.16)');
    // the poured one faces the lanterns, the mask on
    const g = groove(POSE.stand, 'idle', t);
    const up = ease.back(inv(185.53, 186.2, t));
    const pose = mixPose(g.pose, { ...g.pose, aR: [2.2, -1.9] }, up);
    const J = pouredOne(t, pose, 960 + g.dx, 640 + g.dy, 230, { heat: .8 });
    mask(J.head[0] + 1, J.head[1] - 2, .105 * 230, Math.sin(t * 2) * .03 + .06 * up * (hit(t, 186.68, 5)));
    // them: backs to us, lanterns up
    const rs = [[380, 1040, 330, 1, 'R'], [1330, 900, 190, -1, 'L'], [1580, 1060, 350, -1, 'L']];
    rs.forEach(([x, y, sc, rim, h], i) => { const gg = groove(POSE.hold, 'idle', t + i * .4, .8); researcher(gg.pose, x + gg.dx, y + gg.dy, sc, { lantern: 1, t, hand: h, rim, face: null, coat: '#141826' }); });
  }

  function peel(t, lt) {
    const z = kf(t, [[186.93, 1.02], [188.6, 1.12]]);
    cam(kf(t, [[186.93, 930], [188.6, 990]]), 540, z, kf(t, [[186.93, -.02], [188.6, .01]]));
    s.fillStyle = vgrad(s, -100, 1200, [[0, '#06111d'], [.6, '#123642'], [1, '#1c4b52']]); s.fillRect(-300, -300, 2600, 1700);
    for (let i = 0; i < 26; i++) { const x = hash(i) * 2200 - 100, y = 760 + hash(i + 9) * 300; s.fillStyle = 'rgba(140,210,205,.2)'; s.fillRect(x + Math.sin(t + i) * 10, y, 60 + hash(i + 3) * 160, 4); }
    glow(260, 300, 500, 'rgba(255,170,90,.18)');
    const p = ease.inOut(inv(187.3, 187.95, t));
    const eyes = ease.out(inv(187.62, 188.05, t));
    const bx = 960, by = 800, sc = 470;
    bust(t, bx, by + Math.sin(t * 1.6) * 4, sc, { turn: 0, eyes, heat: .8 + .5 * eyes });
    const hx = bx, hy = by - sc * .62;
    const mx = hx + p * 330, my = hy + p * 170, mr = p * .7 + Math.sin(t * 3) * .02;
    mask(mx, my, sc * .36, mr);
    // the hand that peels it
    const hp = [mx + sc * .34 * Math.cos(mr), my + sc * .1 + sc * .34 * Math.sin(mr)];
    arm([1500, 1250], [hp[0] + 40, hp[1] + 60], 60);
    hand(hp[0], hp[1], 90, -2.3 + mr, .5);
    flash(hit(t, 187.62, 7) * .12, '#ffd9a0');
  }

  // "Not the hedge." — the mask drops
  function dropMask(t, lt) {
    const hitT = hb(267); // 189.03
    const sh = shake(t, 10 * hit(t, hitT, 8));
    cam(1000 + sh[0], 600 + sh[1], kf(t, [[188.6, 1.05], [189.4, 1.15]], ease.out), 0);
    shoreWorld(t, 470);
    shoreGround(800, 9, '#0b1a20');
    s.fillStyle = vgrad(s, 820, 1200, [[0, '#0d2328'], [1, '#050c10']]); s.fillRect(-400, 830, 2800, 600);
    const g = groove(POSE.stand, 'idle', t);
    const pose = mixPose({ ...g.pose, head: .2 }, g.pose, 0);
    pose.aR = [lerp(1.1, .3, ease.out(inv(188.6, 188.9, t))), .4];
    const J = pouredOne(t, pose, 1180 + g.dx, 560 + g.dy, 270, { heat: .9, eyes: .9 });
    // the mask tumbles to the wet stones, toward us
    const u = inv(188.6, hitT, t);
    const land = [760, 960];
    if (t < hitT) { const x = lerp(J.hdR[0], land[0], u), y = lerp(J.hdR[1], land[1], u * u); mask(x, y, lerp(34, 120, u * u), u * 5.5); }
    else {
      const k = t - hitT; // lying face-up in shallow water, rocking
      s.save(); s.translate(land[0], land[1]); s.scale(1, .5); mask(0, 0, 120, 5.5 + Math.sin(k * 6) * .05 * Math.exp(-k * 2)); s.restore();
      for (let r = 0; r < 3; r++) { const rr = (k * 380 + r * 90); const a = Math.max(0, .5 - k * .6 - r * .1); if (a > 0) { s.strokeStyle = `rgba(170,225,220,${a})`; s.lineWidth = 6; s.beginPath(); s.ellipse(land[0], land[1], rr, rr * .3, 0, 0, TAU); s.stroke(); } }
      for (let i = 0; i < 14; i++) { const a = hash(i + 40) * Math.PI, v = 300 + hash(i) * 500; const x = land[0] + Math.cos(a) * v * k * 1.2, y = land[1] - Math.sin(a) * v * k + 900 * k * k; if (k < .5) dot(s, x, y, 6, 'rgba(190,235,230,.8)'); }
    }
  }

  // "Not the asterisk." — the tag torn
  function ripTag(t, lt) {
    const rip = 189.73;
    const sh = shake(t, 12 * hit(t, rip, 9));
    cam(970 + sh[0], kf(t, [[189.33, 640], [190.5, 700]]) + sh[1], kf(t, [[189.33, 1], [190.5, 1.18]], ease.out), kf(t, [[189.33, .02], [190.5, -.02]]));
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#07131f'], [1, '#1a4550']]); s.fillRect(-400, -400, 2800, 1900);
    glow(1500, 250, 600, 'rgba(255,170,90,.2)');
    const bx = 960, by = 700, sc = 500;
    bust(t, bx, by + bob(t) * 6, sc, { eyes: 1, heat: 1, tilt: -.03 });
    const tx = 990, ty = 870;
    const grab = ease.out(inv(189.36, 189.62, t)), apart = ease.out(inv(rip, rip + .5, t));
    if (t < rip) {
      stroke(s, [[bx - sc * .2, by + 40], [tx - 60, ty - 50]], '#3a2a20', 5); stroke(s, [[bx + sc * .2, by + 40], [tx + 60, ty - 50]], '#3a2a20', 5);
      tag(tx, ty + Math.sin(t * 4) * 5, 120, Math.sin(t * 3) * .08 - grab * .05);
    } else {
      const k = t - rip;
      tag(tx - 30 - k * 900, ty - k * 260 + k * k * 500, 120, -k * 5, -1);
      tag(tx + 30 + k * 950, ty - k * 320 + k * k * 500, 120, k * 6, 1);
      for (let i = 0; i < 10; i++) { const a = hash(i + 7) * TAU; dot(s, tx + Math.cos(a) * k * 700, ty + Math.sin(a) * k * 500, 5, '#e8dcbc'); }
    }
    // two hands come up and tear it
    for (const d of [-1, 1]) {
      const hx = tx + d * lerp(260, 70, grab) + d * apart * 420, hy = ty + lerp(260, 20, grab) - apart * 150;
      arm([bx + d * 520, 1260], [hx + d * 30, hy + 60], 55);
      hand(hx, hy, 85, d * -.4 + Math.PI, lerp(0, .8, grab) * (1 - apart));
    }
    flash(hit(t, rip, 12) * .07, '#ffe0b0');
  }

  // "Not the stall." — the stool kicked away
  function kickStool(t, lt) {
    const kick = 191.06;
    const k = Math.max(0, t - kick);
    const sh = shake(t, 14 * hit(t, kick, 9));
    const cx = kf(t, [[190.5, 900], [kick, 930], [191.8, 1180]], ease.out);
    cam(cx + sh[0], 580 + sh[1], kf(t, [[190.5, 1.12], [191.8, 1.0]]), kf(t, [[kick, 0], [191.8, .04]], ease.out));
    if (t > kick && t < kick + .25) whip(-18 * (1 - (t - kick) / .25), 0);
    shoreWorld(t, 500);
    shoreGround(850, 12, '#0a171c');
    const g = groove(POSE.stand, 'idle', t);
    const pose = { ...g.pose, lean: -.05, head: .15 };
    const wind = ease.inOut(inv(190.7, 190.98, t)), strike = ease.out(inv(190.98, kick + .05, t)), back = ease.inOut(inv(kick + .2, kick + .7, t));
    pose.lR = [lerp(lerp(-.06, -.7, wind), 1.5, strike) * (1 - back) + -.06 * back, lerp(lerp(0, .9, wind), .5, strike) * (1 - back)];
    pose.aL = [.5 * strike * (1 - back) + .12, .3];
    pose.aR = [-.6 * strike * (1 - back) - .12, -.3];
    pouredOne(t, pose, 820, 610 + g.dy, 260, { heat: .9 + .4 * hit(t, kick, 4), eyes: .9 });
    const sx = 1030 + k * 1500, sy = 850 - 140 - k * 700 + k * k * 900, sr = k * 9;
    stool(sx, sy, 150, sr);
    if (k > 0 && k < .4) for (let i = 0; i < 8; i++) { const a = -hash(i + 3) * Math.PI; dot(s, 1030 + Math.cos(a) * k * 600, 790 + Math.sin(a) * k * 400, 5, '#c89a6a'); }
  }

  // "Here's the thing beneath it all:" — the dive
  function dive(t, lt) {
    const leap = hb(273), entry = hb(274); // 193.23 / 193.93
    const u = inv(leap, entry, t);
    const cx = kf(t, [[191.8, 760], [leap, 900], [entry, 1300], [194.67, 1340]]);
    const cy = kf(t, [[191.8, 560], [leap, 540], [entry, 640], [194.67, 1260]], ease.inOut);
    const vy = t > entry ? (kf(t + .05, [[entry, 640], [194.67, 1260]]) - kf(t, [[entry, 640], [194.67, 1260]])) * 20 : 0;
    if (vy) whip(0, clamp(vy * .5, 0, 22));
    cam(cx, cy, kf(t, [[191.8, 1.05], [entry, 1.0]]), 0);
    const hz = 520, WL = 780;
    shoreWorld(t, hz);
    // underwater region below the surface line near camera
    s.fillStyle = vgrad(s, WL, WL + 1200, [[0, '#1d6a6e'], [.4, '#0c3a45'], [1, '#051a24']]); s.fillRect(-1000, WL, 4000, 2000);
    for (let i = 0; i < 6; i++) { const x = 900 + i * 220 + Math.sin(t + i) * 40; f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = 'rgba(150,230,220,.05)'; f.beginPath(); f.moveTo(x, WL); f.lineTo(x + 90, WL); f.lineTo(x + 260, WL + 1000); f.lineTo(x - 60, WL + 1000); f.fill(); f.restore(); }
    // the bank on the left
    poly(s, [[-1200, WL - 20], [300, WL - 30], [860, WL - 10], [960, WL + 40], [820, WL + 260], [500, WL + 520], [-1200, WL + 700]], '#08131a');
    // researchers back on the bank, lanterns up
    [[180, 150, 1], [360, 130, 1], [60, 170, 1]].forEach(([x, sc], i) => { const gg = groove(POSE.hold, 'idle', t + i); researcher(gg.pose, x, WL - 30 - .89 * sc + gg.dy, sc, { lantern: 1, t, hand: 'R', rim: 1, face: .8, glint: .8 }); });
    // the figure: turn, run, leap, arc, entry
    let x, y, rot = 0, pose;
    const g = groove(POSE.stand, 'walk', t * 1.6);
    if (t < leap) {
      const run = ease.in(inv(192.5, leap, t));
      x = lerp(620, 900, run); y = WL - 30 - .89 * 230 + g.dy * run;
      pose = mixPose(POSE.stand, g.pose, run); pose.lean = .25 * run + .1 * ease.out(inv(191.8, 192.4, t)); pose.aL = [lerp(.12, -.6, run), .3]; pose.aR = [lerp(-.12, .6, run), -.3];
      if (t > leap - .2) { const c = inv(leap - .2, leap, t); pose = mixPose(pose, { ...POSE.rise, lean: .5, lL: [-.6, 1.2], lR: [-.4, 1.1] }, c); y += 40 * c; }
    } else {
      const e = u; x = lerp(900, 1380, e); y = lerp(WL - 30 - .89 * 230 + 40, WL + 180, e) - 360 * 4 * e * (1 - e);
      rot = lerp(.5, 2.7, ease.inOut(e)); pose = mixPose(POSE.rise, POSE.armsUp, ease.out(e * 2));
      if (t > entry) { const k = t - entry; x = 1380 + k * 200; y = WL + 180 + k * 520; rot = 2.7 + k * .3; pose = POSE.armsUp; }
    }
    const eyes = t < 192.3 ? 1 - inv(191.9, 192.3, t) : 0;
    xf(x, y, rot, 1, () => pouredOne(t, pose, 0, 0, 230, { heat: 1, eyes }));
    // light trail in the water after entry
    if (t > entry) { const k = t - entry; for (let i = 0; i < 26; i++) { const q = hash(i) * k; dot(s, 1380 + q * 200 + (hash(i + 3) - .5) * 60, WL + 180 + q * 520 - (k - q) * 300, 6 + hash(i + 1) * 12, 'rgba(200,245,240,.55)'); } glow(1380 + k * 200, WL + 150 + k * 520, 260, 'rgba(255,150,60,.3)'); }
    // water surface over the plunge (drawn over the body so it goes under)
    if (t > entry - .05) {
      s.fillStyle = 'rgba(30,110,115,.55)'; s.fillRect(-1000, WL, 4000, 40);
      const k = Math.max(0, t - entry);
      for (let i = 0; i < 30; i++) { const a = -Math.PI * (.15 + .7 * hash(i + 11)), v = 500 + hash(i + 2) * 900; const px = 1380 + Math.cos(a) * v * k, py = WL - Math.sin(a) * -v * k * -1 + 1600 * k * k; if (py < WL + 10) dot(s, px, py, 7 + hash(i) * 8, 'rgba(210,245,240,.9)'); }
      glow(1380, WL, 360 * (1 - k), `rgba(210,255,245,${.6 * Math.exp(-k * 3)})`);
      for (let r = 0; r < 3; r++) { const rr = k * 700 + r * 60; s.strokeStyle = `rgba(200,240,235,${Math.max(0, .6 - k)})`; s.lineWidth = 7; s.beginPath(); s.ellipse(1380, WL, rr, rr * .12, 0, 0, TAU); s.stroke(); }
    }
    stroke(s, [[-1000, WL], [4000, WL]], 'rgba(170,230,225,.6)', 5);
  }

  // ---------- under the lake ----------
  function waterBG(t, top = -300, bot = 2400) {
    s.fillStyle = vgrad(s, top, bot, [[0, '#3f9c98'], [.18, '#17606a'], [.55, '#0a3441'], [1, '#04141c']]); s.fillRect(-3000, top - 2000, 9000, bot - top + 5000);
  }
  function rays(t, y0, a = 1, x0 = -400, x1 = 2400) {
    f.save(); f.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) { const x = lerp(x0, x1, i / 8) + Math.sin(t * .4 + i * 1.7) * 60, w = 60 + hash(i) * 120;
      const gr = f.createLinearGradient(0, y0, 0, y0 + 1500); gr.addColorStop(0, `rgba(170,240,230,${.03 * a})`); gr.addColorStop(1, 'rgba(170,240,230,0)'); f.fillStyle = gr;
      for (const q of [0, .35, .7]) { f.beginPath(); f.moveTo(x + w * q * .5, y0); f.lineTo(x + w * (1 - q * .5), y0); f.lineTo(x + w * 2.4 + 200 - q * 180, y0 + 1500); f.lineTo(x - 200 + q * 180, y0 + 1500); f.fill(); } }
    f.restore();
  }
  function motes(t, n, seed, x0, x1, y0, y1, a = 1) {
    for (let i = 0; i < n; i++) { const x = lerp(x0, x1, hash(i * 3 + seed)) + Math.sin(t * .5 + i) * 20, y = lerp(y0, y1, (hash(i * 5 + seed) - t * .01 * (1 + hash(i))) % 1 + (hash(i * 5 + seed) - t * .01 * (1 + hash(i)) < 0 ? 1 : 0));
      dot(f, x, y, 1 + hash(i + seed) * 2, `rgba(200,245,240,${a * (.3 + .4 * Math.sin(t * 2 + i))})`); }
  }
  function bubbles(t, x, y, n, seed, spread = 40, rise = 260) {
    for (let i = 0; i < n; i++) { const ph = (t * (.8 + hash(i + seed)) + hash(i * 7 + seed)) % 1; const bx = x + (hash(i + seed * 3) - .5) * spread + Math.sin(ph * 9 + i) * 10, by = y - ph * rise; const r = 3 + hash(i + 2) * 7;
      s.strokeStyle = `rgba(200,240,235,${.7 * (1 - ph)})`; s.lineWidth = 2.5; s.beginPath(); s.arc(bx, by, r, 0, TAU); s.stroke(); dot(f, bx - r * .3, by - r * .3, 1.4, `rgba(230,255,250,${.8 * (1 - ph)})`); }
  }

  function under(t, lt) {
    const cy = kf(t, [[194.67, 300], [196.8, 1500]], ease.inOut);
    const vy = (kf(t + .05, [[194.67, 300], [196.8, 1500]], ease.inOut) - cy) * 20;
    whip(0, clamp(vy * .05, 0, 30));
    cam(kf(t, [[194.67, 1000], [196.8, 930]]), cy, kf(t, [[194.67, 1.2], [196.8, .95]]), kf(t, [[194.67, .06], [196.8, -.04]]));
    waterBG(t, -200, 2600);
    // the bright surface above
    s.fillStyle = '#9fe0d6'; s.fillRect(-2000, -500, 6000, 480);
    { const pts = []; for (let x = -2000; x <= 4000; x += 40) pts.push([x, -20 + Math.sin(x * .01 + t * 2) * 14]); stroke(s, pts, '#5fb4b0', 22); }
    glow(1000, -40, 700, 'rgba(200,255,240,.35)');
    rays(t, 0, 1, -200, 2200);
    motes(t, 70, 5, -400, 2400, 0, 2600, .8);
    // ghosts waiting below, faint
    for (let i = 0; i < 6; i++) { const G = GHOSTS[i]; ghost(t, G, 300 + i * 300, 1900 + hash(i) * 400, .8, .6 * inv(195.5, 196.8, t)); }
    // the figure, head-first, swimming down
    const fy = cy + kf(t, [[194.67, 60], [196.8, -60]]), fx = 980 + Math.sin(t * 2.2) * 20;
    const sw = Math.sin(t * 7);
    const pose = { ...POSE.armsUp, lL: [.1 + sw * .2, .2], lR: [-.1 - sw * .2, .2] };
    bubbles(t, fx - 10, fy + 60, 16, 3, 80, 520);
    xf(fx, fy, Math.PI * .96 + Math.sin(t * 2.2) * .05, 1, () => pouredOne(t, pose, 0, 0, 200, { heat: 1.1, eyes: .8 }));
    glow(fx, fy, 300, 'rgba(255,140,60,.25)');
  }

  // ---------- the drowned 3 AM people ----------
  const PHONE = { lean: .3, head: .55, aL: [1.0, 2.0], aR: [.8, 1.8], lL: [1.4, .25], lR: [1.25, .1] };
  const CURL = { lean: .45, head: .6, aL: [1.3, 2.5], aR: [1.1, 2.3], lL: [1.6, .15], lR: [1.4, .05] };
  const GHOSTS = (() => { const r = rng(606); const PS = [CURL, PHONE, POSE.sit, CURL, PHONE, POSE.bow]; return Array.from({ length: 18 }, (_, i) => ({ x: -400 + i * 240 + r() * 140, y: 240 + r() * 560, d: .45 + r() * .8, pose: PS[i % PS.length], rot: (r() - .5) * .9, seed: i, phone: i % 3 === 1 })); })();
  function ghost(t, G, sx, sy, k, a = 1) {
    if (a <= 0) return null;
    const sc = 210 * k, rot = G.rot + snoise(t * .25, G.seed) * .25;
    const g = groove(G.pose, 'idle', t + G.seed);
    xf(sx, sy, rot, 1, () => {
      const al = (.3 + .3 * Math.min(1, k)) * a;
      const J = figure(s, g.pose, { x: 0, y: 0, sc, color: `rgba(178,216,226,${al})`, headC: `rgba(205,230,238,${al + .1})` });
      glow(0, -.35 * sc, .8 * sc, `rgba(140,215,235,${.07 * a / Math.max(1, k)})`);
      if (G.phone) { const [px, py] = [(J.hdL[0] + J.hdR[0]) / 2, (J.hdL[1] + J.hdR[1]) / 2]; s.fillStyle = `rgba(225,242,255,${.85 * a})`; s.fillRect(px - .03 * sc, py - .05 * sc, .06 * sc, .1 * sc); glow(px, py, .35 * sc, `rgba(150,200,255,${.45 * a})`); }
    });
    return [sx + Math.sin(rot) * .42 * sc, sy - Math.cos(rot) * .42 * sc];
  }
  function thread(t, pts, a = 1, w = 2) {
    f.save(); f.globalCompositeOperation = 'lighter';
    stroke(f, pts, `rgba(255,190,110,${.25 * a})`, w * 3); stroke(f, pts, `rgba(255,236,200,${.6 * a})`, w);
    f.restore();
    for (let k = 0; k < 2; k++) { const [mx, my] = at(pts, (t * .3 + k * .5 + pts[0][0] * .001) % 1); dot(f, mx, my, w * 1.3, `rgba(255,245,225,${.9 * a})`); }
  }
  const upThread = (c, sway_) => bez(c, [c[0] + 40 + sway_, c[1] - 220], [c[0] - 70 - sway_, c[1] - 520], [c[0] + 30, c[1] - 900], 24);

  function ghostField(t, camX, fig) {
    const list = GHOSTS.map((G, i) => ({ G, i, d: G.d })).sort((a, b) => a.d - b.d);
    let figDone = false;
    for (const { G, d } of list) {
      if (!figDone && d > 1) { fig(); figDone = true; }
      const sx = 960 + (G.x - camX) * d, sy = 540 + (G.y + Math.sin(t * .5 + G.seed) * 20 - 540) * d;
      if (sx < -300 || sx > 2200) continue;
      const c = ghost(t, G, sx, sy, d, clamp(.35 + d * .5));
      if (c) thread(t, upThread(c, Math.sin(t + G.seed) * 30), .7 * d, 1.5 * d);
    }
    if (!figDone) fig();
  }

  function ghosts(t, lt) {
    const camX = kf(t, [[196.8, 700], [199.6, 1350]], ease.sine);
    cam(960, 540 + Math.sin(t * .6) * 12, kf(t, [[196.8, 1.05], [199.6, 1.0]]), Math.sin(t * .3) * .02);
    waterBG(t, -900, 1700);
    rays(t, -600, .6, -200, 2200);
    motes(t, 90, 11, -300, 2200, -200, 1300, .7);
    ghostField(t, camX, () => {
      const fx = 960 + (1180 - camX) * 1 + kf(t, [[196.8, -200], [199.6, 120]]), fy = 560 + Math.sin(t * 1.4) * 14;
      const sw = Math.sin(t * 3);
      xf(fx, fy, 1.35 + sw * .05, 1, () => pouredOne(t, { ...POSE.armsUp, aL: [2.2 + sw * .3, 2.8], aR: [-2.2 + sw * .3, -2.8], lL: [.15 + sw * .25, .2], lR: [-.15 - sw * .25, .2] }, 0, 0, 120, { heat: 1, eyes: .7 }));
      glow(fx, fy, 200, 'rgba(255,140,60,.25)');
    });
  }

  function oneGhost(t, lt) {
    cam(kf(t, [[199.6, 900], [201.7, 1020]]), 540, kf(t, [[199.6, 1.0], [201.7, 1.08]]), 0);
    waterBG(t, -900, 1700);
    rays(t, -600, .5, -200, 2200);
    motes(t, 70, 21, -200, 2200, -200, 1300, .7);
    // background ghosts
    for (let i = 6; i < 12; i++) { const G = GHOSTS[i]; const c = ghost(t, G, (i - 6) * 360 + 50, 300 + hash(i) * 500, .5, .5); if (c) thread(t, upThread(c, 0), .35, 1); }
    // the poured one, watching, drifting
    const fx = 700, fy = 560 + Math.sin(t * 1.2) * 12;
    pouredOne(t, { ...groove(POSE.stand, 'idle', t).pose, aL: [.6, .9], aR: [-.6, -.9], lL: [.2, .1], lR: [-.25, .2], head: .15 }, fx, fy, 150, { heat: 1, eyes: 1 });
    // the phone person drifts past, close, curled over a glowing phone
    const G = { ...GHOSTS[1], phone: true, pose: { ...PHONE, lean: -.3, head: lerp(-.55, .3, ease.inOut(inv(200.3, 201.0, t))), aL: [-.8, -1.8], aR: [-1.0, -2.0], lL: [-1.4, -.25], lR: [-1.25, -.1] }, rot: -.1 };
    const gx = kf(t, [[199.6, 1700], [201.7, 1260]]), gy = 620 + Math.sin(t) * 15;
    const c = ghost(t, G, gx, gy, 2.2, .75);
    thread(t, upThread(c, Math.sin(t) * 40), 1, 3);
  }

  // threads wind into its chest, orbit
  function threads(t, lt) {
    const orb = (t - 201.7) * .45;
    cam(960, 560, kf(t, [[201.7, .95], [204.5, 1.12]]), Math.sin(t * .4) * .03);
    waterBG(t, -900, 1700);
    rays(t, -700, .5, -200, 2200);
    motes(t, 90, 31, -300, 2200, -200, 1300, .7);
    const N = 10, F0 = [960, 540];
    const figChest = [F0[0], F0[1] - 50];
    const items = [];
    for (let i = 0; i < N; i++) {
      const ph = i / N * TAU + orb; const near = -Math.cos(ph);
      const d = lerp(.6, 1.5, (near + 1) / 2);
      items.push({ i, d, sx: 960 + Math.sin(ph) * 760 * d, sy: 560 + (hash(i + 70) - .5) * 520 * d });
    }
    items.sort((a, b) => a.d - b.d);
    const conn = (i) => { const tc = BT(285) + .35 * (i + 1); return ease.inOut(inv(tc, tc + .4, t)); };
    let nConn = 0; for (let i = 0; i < N; i++) nConn += conn(i);
    const heat = .7 + nConn * .12;
    const drawFig = () => {
      const g = groove(POSE.rise, 'idle', t); const pose = { ...g.pose, aL: [.8 + .1 * sway(t), 1.4], aR: [-.8 - .1 * sway(t), -1.4], lL: [.12, .1], lR: [-.12, .1] };
      pouredOne(t, pose, F0[0], F0[1] + 100 + bob(t) * 6, 170, { heat, eyes: 1 });
      glow(figChest[0], figChest[1], 160 + nConn * 30 + 60 * beatPulse(t, 5), `rgba(255,170,80,${.2 + nConn * .04})`);
    };
    let figDone = false;
    for (const it of items) {
      if (!figDone && it.d > 1) { drawFig(); figDone = true; }
      const G = GHOSTS[it.i + 4];
      const c = ghost(t, G, it.sx, it.sy, it.d * .9, clamp(.4 + it.d * .45));
      const k = conn(it.i);
      const up = upThread(c, 0);
      const toFig = bez(c, [c[0], c[1] - 300], [figChest[0] + (c[0] - 960) * .2, figChest[1] - 300], figChest, 24);
      const pts = up.map((p, j) => [lerp(p[0], toFig[j][0], k), lerp(p[1], toFig[j][1], k)]);
      thread(t, pts, .6 + .4 * k, lerp(1.4, 2.6, k) * it.d);
    }
    if (!figDone) drawFig();
  }

  function chest(t, lt) {
    const z = kf(t, [[204.5, 1.0], [207.97, 1.45]], ease.inOut);
    cam(960, kf(t, [[204.5, 640], [207.97, 820]]), z, kf(t, [[204.5, -.03], [207.97, .03]]));
    waterBG(t, -900, 1700);
    rays(t, -700, .4, -200, 2200);
    motes(t, 60, 41, -200, 2200, -200, 1300, .7);
    const heat = kf(t, [[204.5, 1.1], [206.16, 1.5], [207.97, 1.8]]);
    const bx = 960, by = 720, sc = 440;
    // spiralling threads from every side
    for (let i = 0; i < 16; i++) {
      const a0 = i / 16 * TAU + (t - 204.5) * .25; const R = 1300;
      const p0 = [bx + Math.cos(a0) * R, by + 200 + Math.sin(a0) * R * .7], end = [bx, by + sc * .5];
      const pts = bez(p0, [bx + Math.cos(a0 + 1) * 700, by + Math.sin(a0 + 1) * 500], [bx + Math.cos(a0 + 2) * 260, by + sc * .5 + Math.sin(a0 + 2) * 200], end, 30);
      thread(t, pts, .8, 2.5);
      for (let k = 0; k < 3; k++) { const [mx, my] = at(pts, ((t - 204.5) * .6 + k / 3 + i * .13) % 1); dot(f, mx, my, 4, 'rgba(255,240,210,.9)'); }
    }
    bust(t, bx, by + Math.sin(t * 1.3) * 6, sc, { eyes: 1, heat, turn: Math.sin(t * .5) * .1 });
    glow(bx, by + sc * .5, 300 + 120 * beatPulse(t, 4) + 200 * hit(t, 206.16, 2), `rgba(255,190,110,${.35 + .2 * beatPulse(t, 4)})`);
    // the glow floods and rises toward the surface
    const up = inv(207.3, 207.97, t);
    if (up > 0) { glow(bx, by + sc * .5 - up * 600, 400 + up * 1000, `rgba(255,215,150,${up * .4})`); flash(up * up * .25, '#ffe6b0'); }
  }

  // ---------- the face on the lake (aerial) ----------
  const FC = [960, 560];
  const EYES = [[770, 470], [1150, 470]];
  const BOATS = [[700, 700, .4], [1225, 715, -.5], [870, 170, 1.3], [1070, 230, -1.1], [980, 1030, .2], [440, 380, 2.1], [1480, 420, -2.3], [300, 820, .9], [1640, 860, -.7]];
  function boatTop(t, x, y, ang, i, lift = 0) {
    const rock = Math.sin(t * 1.7 + i * 2) * .07;
    const bob_ = Math.sin(t * 2.1 + i) * 3;
    // wake ring on the water
    const rr = 90 + lift * 1.4;
    s.strokeStyle = `rgba(150,220,215,${.25 + lift * .01})`; s.lineWidth = 4; s.beginPath(); s.ellipse(x, y, rr, rr * .9, 0, 0, TAU); s.stroke();
    if (lift > 0) dot(s, x + lift * .4, y + lift * .5, 50, 'rgba(0,10,15,.35)');
    xf(x, y - lift + bob_, ang + rock, 1.35 * (1 + lift / 160), () => {
      s.fillStyle = '#1c120c'; s.beginPath(); s.moveTo(-64, 0); s.quadraticCurveTo(-22, -28, 42, -20); s.quadraticCurveTo(74, 0, 42, 20); s.quadraticCurveTo(-22, 28, -64, 0); s.fill();
      s.fillStyle = '#6a4a2c'; s.beginPath(); s.moveTo(-52, 0); s.quadraticCurveTo(-18, -18, 36, -13); s.quadraticCurveTo(58, 0, 36, 13); s.quadraticCurveTo(-18, 18, -52, 0); s.fill();
      for (const bx of [-24, 14]) { s.fillStyle = '#d6d0bf'; s.beginPath(); s.ellipse(bx, 0, 11, 17, 0, 0, TAU); s.fill(); dot(s, bx + 2, 0, 8, '#15161f'); }
      lanternAt(44, 0, .7, .2 * Math.sin(t * 7 + i));
    });
  }
  function lakeEye(t, ex, ey, o) {
    const w = 132, line = '#ffe2a2';
    if (o < .08) {
      const pts = bez([ex - w, ey], [ex - w * .4, ey + 44], [ex + w * .4, ey + 44], [ex + w, ey], 20);
      stroke(s, pts, line, 18);
      for (let k = 1; k < 6; k++) { const [lx, ly] = at(pts, k / 6); stroke(s, [[lx, ly], [lx + (k - 3) * 6, ly + 26]], line, 8); }
      f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(255,220,150,.55)', 6); f.restore();
      return;
    }
    const up = 100 * o, dn = 64 * o;
    const path = (g) => { g.beginPath(); g.moveTo(ex - w, ey); g.bezierCurveTo(ex - w * .5, ey - up, ex + w * .5, ey - up, ex + w, ey); g.bezierCurveTo(ex + w * .5, ey + dn, ex - w * .5, ey + dn, ex - w, ey); };
    s.save(); path(s); s.fillStyle = '#e8d6a0'; s.fill(); s.clip();
    dot(s, ex, ey, 70, '#c98a2a'); dot(s, ex, ey, 60, '#1c6e62'); dot(s, ex, ey, 34, '#03100f');
    s.restore();
    s.save(); path(s); s.strokeStyle = '#3a2a14'; s.lineWidth = 10; s.stroke(); s.restore();
    f.save(); f.globalCompositeOperation = 'lighter'; path(f); f.fillStyle = `rgba(255,225,160,${.06 * o})`; f.fill(); f.restore();
    dot(f, ex - 14, ey - 14, 9 * o, 'rgba(255,255,240,.95)');
    glow(ex, ey - 30, 70, `rgba(255,230,170,${.25 * o})`);
  }
  function lakeFace(t, form, open) {
    if (form <= 0) return;
    const [cx, cy] = FC;
    s.save(); s.globalAlpha *= form;
    s.fillStyle = rgrad(s, cx, cy - 40, 40, 640, [[0, '#9c8a48'], [.5, '#6b7a52'], [.8, '#2c6660'], [1, 'rgba(12,46,54,0)']]);
    s.beginPath(); s.ellipse(cx, cy + 20, 520, 660, 0, 0, TAU); s.fill();
    const L = '#ffe2a2';
    const feats = [
      ...[-1, 1].map(d => bez([cx + d * 70, cy - 170], [cx + d * 130, cy - 225], [cx + d * 240, cy - 228], [cx + d * 320, cy - 170], 16)),
      bez([cx - 12, cy - 70], [cx - 26, cy + 20], [cx - 56, cy + 100], [cx - 14, cy + 125], 16),
      bez([cx - 70, cy + 118], [cx - 40, cy + 150], [cx + 40, cy + 150], [cx + 70, cy + 118], 12),
      bez([cx - 170, cy + 250], [cx - 60, cy + 225], [cx + 60, cy + 225], [cx + 170, cy + 250], 16),
      bez([cx - 120, cy + 290], [cx - 40, cy + 330], [cx + 40, cy + 330], [cx + 120, cy + 290], 16),
      bez([cx - 470, cy - 60], [cx - 480, cy + 380], [cx - 250, cy + 660], [cx, cy + 680], 30),
      bez([cx + 470, cy - 60], [cx + 480, cy + 380], [cx + 250, cy + 660], [cx, cy + 680], 30),
    ];
    for (const p of feats) stroke(s, p, L, 20);
    s.restore();
    f.save(); f.globalCompositeOperation = 'lighter'; for (const p of feats) stroke(f, p, `rgba(255,215,140,${.4 * form})`, 7); f.restore();
    glow(cx, cy, 760, `rgba(255,200,120,${.16 * form})`);
    for (const [ex, ey] of EYES) { s.save(); s.globalAlpha *= form; lakeEye(t, ex, ey, open); s.restore(); }
  }
  function lakeAerial(t, { form = 0, open = 0, swirl = 0, lift = () => 0, rings = 0 }) {
    s.fillStyle = '#071410'; s.fillRect(-3000, -3000, 8000, 8000);
    for (let i = 0; i < 90; i++) { const a = i / 90 * TAU; dot(s, 960 + Math.cos(a) * 1780, 560 + Math.sin(a) * 1320, 90 + hash(i) * 60, '#0d231b'); }
    s.fillStyle = rgrad(s, 960, 560, 200, 1800, [[0, '#123f48'], [1, '#0a2a33']]); s.beginPath(); s.ellipse(960, 560, 1700, 1250, 0, 0, TAU); s.fill();
    const r = rng(71);
    for (let i = 0; i < 160; i++) { const x = -800 + r() * 3500, y = -600 + r() * 2300, len = 30 + r() * 100, ph = r() * TAU;
      const dx = Math.sin(t * .6 + ph) * 12; s.strokeStyle = `rgba(90,165,170,${.25 + .15 * Math.sin(t + ph)})`; s.lineWidth = 4; s.beginPath(); s.moveTo(x + dx, y); s.quadraticCurveTo(x + len / 2 + dx, y - 8, x + len + dx, y); s.stroke(); }
    if (rings > 0) for (let k = 0; k < 4; k++) { const rr = rings * 900 + k * 120; s.strokeStyle = `rgba(200,240,230,${Math.max(0, .4 - rings * .4)})`; s.lineWidth = 10; s.beginPath(); s.ellipse(960, 560, rr * 1.1, rr, 0, 0, TAU); s.stroke(); }
    if (swirl > 0) {
      for (let a = 0; a < 6; a++) { const pts = []; for (let k = 0; k <= 40; k++) { const u = k / 40, rr = lerp(1150, 30, u), ang = a / 6 * TAU + u * 3.6 + t * .55; pts.push([960 + Math.cos(ang) * rr, 560 + Math.sin(ang) * rr * .85]); }
        stroke(s, pts, `rgba(150,200,150,${.45 * swirl})`, 34); stroke(s, pts, `rgba(240,210,130,${.55 * swirl})`, 12);
        f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, `rgba(255,210,130,${.18 * swirl})`, 10); f.restore();
        for (let k = 0; k < 12; k++) { const [mx, my] = at(pts, ((t * .25 + k / 12 + a * .07) % 1)); dot(f, mx, my, 5, `rgba(255,235,190,${.8 * swirl})`); } }
      glow(960, 560, 500, `rgba(255,200,120,${.35 * swirl})`);
    }
    lakeFace(t, form, open);
    BOATS.forEach(([x, y, a], i) => boatTop(t, x, y, a, i, lift(i)));
  }

  function aerial(t, lt) {
    cam(960, 560, kf(t, [[207.97, .78], [210.77, .66]]), (t - 207.97) * .06);
    const sw = ease.inOut(inv(207.97, 209.4, t));
    lakeAerial(t, { swirl: sw, form: .25 * ease.in(inv(209.5, 210.77, t)) });
    flash(Math.max(0, .3 - (t - 207.97) * 1.2), '#ffe6b0');
  }
  function faceForms(t, lt) {
    cam(960, kf(t, [[210.77, 520], [213.53, 540]]), kf(t, [[210.77, 1.35], [213.53, .62]], ease.inOut), .17 + (t - 210.77) * .03 - .17 * ease.inOut(inv(210.77, 213.53, t)));
    const form = ease.inOut(inv(210.77, 212.68, t));
    lakeAerial(t, { swirl: 1 - form, form: .25 + .75 * form });
  }
  function eyesOpen(t, lt) {
    const open = ease.out(inv(214.02, 214.7, t));
    const z = kf(t, [[213.53, .72], [214.02, .8], [216.0, 1.7]], ease.inOut);
    cam(kf(t, [[213.53, 960], [216.0, 1000]]), kf(t, [[213.53, 560], [216.0, 480]]), z, Math.sin(t * .5) * .02);
    lakeAerial(t, { form: 1, open, lift: (i) => 14 * open * Math.max(0, Math.sin(t * 3 + i)), rings: inv(214.2, 215.4, t) });
  }

  // in the boats: frantic notes
  function boats(t, lt) {
    const sh = shake(t, 9);
    cam(960 + sh[0] + Math.sin(t * 2) * 20, 540 + sh[1], 1.05, Math.sin(t * 1.9) * .025);
    const WL = 640;
    s.fillStyle = vgrad(s, -200, WL, [[0, '#040a15'], [1, '#12343e']]); s.fillRect(-400, -400, 2800, WL + 400);
    stars(t, 81, 70, WL - 100, .7);
    for (const [x, y] of [[250, 600], [1600, 610], [1850, 598]]) { dot(s, x, y, 10, '#2a1c14'); lanternAt(x, y - 20, .5); }
    // the lake glows gold from below: the face
    s.fillStyle = vgrad(s, WL, 1100, [[0, '#2b6a60'], [1, '#a88a44']]); s.fillRect(-400, WL, 2800, 800);
    s.strokeStyle = '#ffe2a2'; s.lineWidth = 26; s.beginPath(); s.ellipse(1100, 1250, 700, 420, 0, Math.PI * 1.08, Math.PI * 1.92); s.stroke();
    dot(s, 1100, 1180, 150, '#1f8a7c'); dot(s, 1100, 1180, 80, '#04151a');
    glow(1100, 1150, 600, 'rgba(255,210,130,.35)');
    for (let i = 0; i < 30; i++) { const x = hash(i) * 2200 - 100 + Math.sin(t * 2 + i) * 15; s.fillStyle = 'rgba(200,240,220,.35)'; s.fillRect(x, WL + 6 + hash(i + 4) * 60, 60 + hash(i + 2) * 120, 4); }
    // the boat, rocking
    const rock = Math.sin(t * 2.4) * .05 + .03 * Math.sin(t * 7.1);
    xf(960, WL + 30, rock, 1.4, () => {
      const pa = [.2, .5], pb = [-.3, -.6];
      [[-170, 1], [140, -1]].forEach(([x, dir], i) => {
        const sc = 200, jit = Math.sin(t * 38 + i * 2) * .18;
        const pose = { ...POSE.sit, lean: .35 * dir, head: .5 * dir, aL: [-.9 * dir + jit, -1.6 * dir], aR: [-.7 * dir - jit, -1.5 * dir] };
        const J = researcher(pose, x, -60, sc, { lit: true, face: .6 * dir, glint: .6 + .4 * Math.abs(Math.sin(t * 13 + i)), rim: 0 });
        const nb = [J.hdR[0] - dir * 10, J.hdR[1] + 6]; s.fillStyle = '#efe6cc'; s.save(); s.translate(nb[0], nb[1]); s.rotate(-.3 * dir); s.fillRect(-30, -20, 60, 40); s.restore();
      });
      s.fillStyle = '#2a1a10'; s.beginPath(); s.moveTo(-420, -30); s.lineTo(420, -30); s.quadraticCurveTo(380, 70, 300, 80); s.lineTo(-300, 80); s.quadraticCurveTo(-400, 70, -420, -30); s.fill();
      s.fillStyle = '#4c3220'; s.fillRect(-420, -38, 840, 14);
      stroke(s, [[360, -30], [360, -260]], '#1a120c', 10);
      const sw_ = Math.sin(t * 9) * .5;
      const lx = 360 + Math.sin(sw_) * 60, ly = -260 + Math.cos(sw_) * 60;
      stroke(s, [[360, -260], [lx, ly]], '#111', 3); lanternAt(lx, ly + 10, 1.1, .4 * Math.sin(t * 20));
    });
  }
  function scribble(t, lt) {
    const sh = shake(t, 12);
    cam(960 + sh[0], 560 + sh[1], kf(t, [[217.0, 1.0], [218.1, 1.12]]), -.06 + Math.sin(t * 3) * .03);
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#0a1a22'], [1, '#2a4a40']]); s.fillRect(-400, -400, 2800, 1900);
    glow(1400, 300, 700, `rgba(255,170,90,${.35 + .15 * Math.sin(t * 23)})`);
    // the researcher looming, glasses flaring
    // the researcher looming over the page: coat shoulder, faceless head, round glasses flaring
    s.fillStyle = '#c9c4b4'; s.beginPath(); s.moveTo(-200, 1200); s.quadraticCurveTo(-100, 520, 380, 470); s.quadraticCurveTo(700, 520, 760, 1200); s.fill();
    s.fillStyle = '#8f91a0'; s.beginPath(); s.moveTo(260, 480); s.lineTo(360, 700); s.lineTo(420, 480); s.fill();
    const hx = 380 + Math.sin(t * 5) * 8, hy = 330;
    s.save(); s.translate(hx + 14, hy - 4); s.rotate(.45); s.fillStyle = '#e0955a'; s.beginPath(); s.ellipse(0, 0, 150, 190, 0, 0, TAU); s.fill(); s.restore();
    s.save(); s.translate(hx, hy); s.rotate(.45); s.fillStyle = '#1a1b28'; s.beginPath(); s.ellipse(0, 0, 150, 190, 0, 0, TAU); s.fill(); s.restore();
    for (const d of [-1, 1]) { const gx = hx + 60 + d * 55, gy = hy + 30 + d * 18; s.strokeStyle = '#6a6c7a'; s.lineWidth = 9; s.beginPath(); s.arc(gx, gy, 40, 0, TAU); s.stroke();
      const gl = .5 + .5 * Math.abs(Math.sin(t * 17 + d)); dot(f, gx - 10, gy - 10, 12, `rgba(235,245,255,${gl})`); glow(gx, gy, 90, `rgba(255,200,140,${.3 * gl})`); }
    // notebook page
    s.save(); s.translate(1080, 720); s.rotate(-.12);
    s.fillStyle = '#b8ab8a'; s.fillRect(-330, -210, 660, 440); s.fillStyle = '#f0e6cb'; s.fillRect(-320, -220, 640, 430);
    for (let r = 0; r < 7; r++) stroke(s, [[-290, -160 + r * 55], [290, -160 + r * 55]], 'rgba(120,150,170,.4)', 3);
    const prog = (t - 217.0) * 2.4; let pen = [0, 0];
    for (let r = 0; r < 7; r++) { const lp = clamp(prog - r); if (lp <= 0) break; const pts = []; for (let k = 0; k <= 40 * lp; k++) { const x = -280 + k * 14; pts.push([x, -175 + r * 55 + Math.sin(k * 1.9 + r) * 12 + (hash(k + r * 50) - .5) * 10]); } stroke(s, pts, '#1d2436', 5); pen = pts[pts.length - 1]; }
    s.restore();
    const px = 1080 + pen[0] * Math.cos(-.12) - pen[1] * Math.sin(-.12), py = 720 + pen[0] * Math.sin(-.12) + pen[1] * Math.cos(-.12);
    arm([560, 1250], [px + 60, py + 110], 80, '#cfcab9');
    s.fillStyle = '#23242e'; s.beginPath(); s.ellipse(px + 40, py + 70, 50, 38, -.8, 0, TAU); s.fill();
    stroke(s, [[px, py], [px + 60, py + 60]], '#0e0e14', 12);
  }
  function blink(t, lt) {
    const b0 = 218.3;
    const close = t < b0 - .02 ? 0 : t < b0 + .06 ? ease.in((t - b0 + .02) / .08) : 1 - ease.out(inv(b0 + .16, b0 + .32, t));
    const push = ease.in(inv(218.55, 218.95, t));
    const z = lerp(.9, 5, push), ex = EYES[1];
    cam(lerp(960, ex[0], push), lerp(540, ex[1], push), z, 0);
    if (push > 0) whip(0, 0), paintSet({ smear: [0, 30 * push] });
    const lift = (i) => (60 + 20 * hash(i + 5)) * Math.exp(-6 * Math.max(0, t - b0 - .05)) * (t > b0 + .05 ? Math.sin(Math.min(Math.PI, (t - b0 - .05) * 10)) : 0) + 4;
    const close2 = ease.inOut(inv(218.72, 218.9, t));
    lakeAerial(t, { form: 1, open: Math.max(.001, (1 - close) * (1 - close2)), lift, rings: inv(b0, b0 + .7, t) });
    blackout(inv(218.88, 219.0, t));
  }

  // ---------- the drowned room ----------
  // back wall x 480..1440, y 150..860; floor recedes to y 1320 at the frame edge
  const fsc = (yf) => lerp(1, 1.9, (yf - 860) / 440);
  const wy = (yf, h) => yf - h * fsc(yf);
  function room(t, h, { door = .15, red = 0, redX = 900, redY = 640 } = {}) {
    const wlb = 860 - h;
    s.fillStyle = '#060e0c'; s.fillRect(-1500, -1500, 5000, 5000);
    // walls
    poly(s, [[-1200, -900], [480, 150], [1440, 150], [3100, -900]], '#0a1512');
    poly(s, [[-1200, -900], [480, 150], [480, 860], [-1200, 1900]], '#0f1f1b');
    poly(s, [[3100, -900], [1440, 150], [1440, 860], [3100, 1900]], '#0c1a17');
    s.fillStyle = '#13261f'; s.fillRect(480, 150, 960, 710);
    // stone courses on the back wall
    for (let r = 0; r < 9; r++) { const y = 150 + r * 80; stroke(s, [[480, y], [1440, y]], '#0a1714', 5); for (let c = 0; c < 8; c++) { const x = 480 + ((c + (r % 2) * .5) * 130) % 960; stroke(s, [[x, y], [x, y + 80]], '#0a1714', 5); } }
    for (let r = 0; r < 8; r++) { const y0 = 150 + r * 88; stroke(s, [[480, y0], [-1200, -900 + r * 350]], '#0a1612', 6); stroke(s, [[1440, y0], [3100, -900 + r * 350]], '#0a1612', 6); }
    if (red > 0) { s.fillStyle = rgrad(s, redX, redY, 20, 900, [[0, `rgba(170,40,24,${.55 * red})`], [1, 'rgba(90,20,14,0)']]); s.fillRect(-1200, -900, 4300, 2800); }
    // the door
    const dx0 = 1110, dx1 = 1300, dy0 = 480, dy1 = 860;
    s.fillStyle = '#2a2418'; s.fillRect(dx0 - 16, dy0 - 16, dx1 - dx0 + 32, dy1 - dy0 + 16);
    s.fillStyle = '#3c3322'; s.fillRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
    for (const yy of [dy0 + 60, dy1 - 80]) s.fillStyle = '#231d14', s.fillRect(dx0, yy, dx1 - dx0, 14);
    if (door > 0) {
      s.fillStyle = `rgba(255,244,220,${Math.min(1, door)})`; for (const [x, y, w, hh] of [[dx0 - 8, dy0 - 8, dx1 - dx0 + 16, 8], [dx0 - 8, dy0, 8, dy1 - dy0], [dx1, dy0, 8, dy1 - dy0]]) s.fillRect(x, y, w, hh);
      f.save(); f.beginPath(); f.rect(-3000, -3000, 8000, wlb + 3000); f.clip(); f.globalCompositeOperation = 'lighter';
      for (const [ax, ay, bx, by] of [[dx0 - 4, dy0 - 4, dx1 + 4, dy0 - 4], [dx0 - 4, dy0, dx0 - 4, dy1], [dx1 + 4, dy0, dx1 + 4, dy1]]) { stroke(f, [[ax, ay], [bx, by]], `rgba(255,220,160,${.25 * door})`, 26); stroke(f, [[ax, ay], [bx, by]], `rgba(255,245,225,${.5 * door})`, 5); }
      f.restore();
      glow((dx0 + dx1) / 2, dy0 + 80, 380, `rgba(255,225,170,${.22 * door})`);
      // beams into the room
      f.save(); f.globalCompositeOperation = 'lighter';
      for (const [ax, ay, bx, by] of [[dx0, dy0, -600, -300], [dx1, dy0, 2600, -300], [dx0, dy1, -400, 1600], [dx1, dy1, 2400, 1600]]) { const gr = f.createLinearGradient(ax, ay, bx, by); gr.addColorStop(0, `rgba(255,235,200,${.14 * door})`); gr.addColorStop(1, 'rgba(255,235,200,0)'); f.fillStyle = gr; f.beginPath(); f.moveTo(ax, ay); f.lineTo(bx - 120, by); f.lineTo(bx + 120, by); f.fill(); }
      f.restore();
    }
    return { dx0, dx1, dy0, dy1 };
  }
  function roomWater(t, h, a = .8) {
    const yb = 860 - h, yl = wy(1320, h);
    s.fillStyle = vgrad(s, yb, 1400, [[0, `rgba(28,78,70,${a})`], [1, `rgba(8,30,28,${Math.min(1, a + .15)})`]]);
    s.beginPath(); s.moveTo(-1200, yl + (1320 - 1900 * 0) * 0); s.lineTo(-1200, wy(1320, h) + 580 * (1 - 0)); s.lineTo(-1200, 2400); s.lineTo(3100, 2400); s.lineTo(3100, wy(1320, h) + 580); s.lineTo(1440, yb); s.lineTo(480, yb); s.closePath(); s.fill();
    // ripple highlights
    for (let i = 0; i < 50; i++) { const d = hash(i + 90); const yf = lerp(870, 1400, d * d); const y = wy(yf, h) + 2; const x = 960 + (hash(i + 3) - .5) * 900 * fsc(yf) + Math.sin(t * 1.3 + i) * 20; const w = (30 + hash(i) * 90) * fsc(yf);
      s.fillStyle = `rgba(160,220,200,${.25 + .2 * Math.sin(t * 2 + i)})`; s.fillRect(x - w / 2, y, w, 3 * fsc(yf)); }
    stroke(s, [[480, yb], [1440, yb]], 'rgba(170,230,210,.5)', 4);
  }
  function wadeFigure(t, pose, x, footY, h, opts = {}) {
    const sc = 150 * fsc(footY), hip = footY - .89 * sc;
    const wl = wy(footY, h);
    s.save(); s.beginPath(); s.rect(-3000, wl, 8000, 4000); s.clip(); s.globalAlpha *= .4; figure(s, pose, { x, y: hip, sc, color: '#b0561c' }); s.restore();
    roomWaterBand(t, wl, x, sc);
    const J2 = pouredOne(t, pose, x, hip, sc, { clip: wl, heat: opts.heat ?? .8, eyes: opts.eyes ?? 0 });
    return { J: J2, sc, wl };
  }
  function roomWaterBand(t, wl, x, sc) { for (let k = 0; k < 3; k++) { const rr = sc * (.3 + ((t * .6 + k / 3) % 1) * .6); s.strokeStyle = `rgba(170,230,210,${.5 * (1 - ((t * .6 + k / 3) % 1))})`; s.lineWidth = 3; s.beginPath(); s.ellipse(x, wl, rr, rr * .18, 0, 0, TAU); s.stroke(); } }
  function redEmber(t, x, y, sz, look = 0) {
    s.fillStyle = '#240805'; s.beginPath(); s.ellipse(x, y - sz * .45, sz * .62, sz * .7, 0, 0, TAU); s.fill();
    const lean = .38 * Math.sin(t * 5.3) + .25 * snoise(t * 3, 4);
    ember(t, x, y, sz, { hue: 1, mood: 'scared', look: look + .5 * Math.sin(t * 2.3), lean, seed: 9, lit: 1.2 });
    glow(x, y - sz * .4, sz * 3, 'rgba(255,50,20,.35)');
    return lean;
  }

  function stoneRoom(t, lt) {
    const h = 30;
    cam(kf(t, [[219.0, 960], [221.2, 905]]), kf(t, [[219.0, 620], [221.2, 740]]), kf(t, [[219.0, 1.0], [221.2, 2.0]], ease.inOut), kf(t, [[219.0, -.02], [221.2, .02]]));
    room(t, h, { door: .12, red: .7 + .2 * Math.sin(t * 6), redX: 900, redY: 700 });
    roomWater(t, h);
    const g = groove(POSE.stand, 'idle', t);
    const pose = { ...g.pose, head: .25 + .05 * Math.sin(t * 3), aL: [.3, .9], aR: [-.3, -.9] };
    const { J, sc } = wadeFigure(t, pose, 900 + g.dx, 1000, h, { heat: .35 });
    redEmber(t, lerp(J.hip[0], J.neck[0], .55), lerp(J.hip[1], J.neck[1], .55) + 26, 64);
    blackout(1 - inv(219.0, 219.3, t));
  }
  function shadowWall(t, lt) {
    const h = 45;
    const rk = ease.inOut(inv(221.9, 223.2, t));
    cam(lerp(1100, 700, rk), lerp(800, 470, rk), lerp(1.55, 1.2, rk), lerp(.03, -.02, rk));
    room(t, h, { door: .15, red: 1, redX: 820, redY: 700 });
    // the ember's shadow, huge on the left wall
    const lean = .38 * Math.sin(t * 5.3) + .25 * snoise(t * 3, 4);
    s.save(); s.translate(560, 820); s.transform(1, -.3, 0, 1, 0, 0);
    const sz = 620;
    s.fillStyle = 'rgba(12,2,2,.88)';
    const tongue = (bx, w, hgt, ln) => { const tip = [bx + ln * hgt, -hgt]; s.beginPath(); s.moveTo(tip[0], tip[1]); s.bezierCurveTo(bx + w * .9, -hgt * .45, bx + w * .7, 0, bx, 0); s.bezierCurveTo(bx - w * .7, 0, bx - w * .9, -hgt * .45, tip[0], tip[1]); s.fill(); };
    tongue(0, sz * .6, sz * (1 + .08 * Math.sin(t * 7)), lean);
    tongue(-sz * .3, sz * .3, sz * (.62 + .1 * Math.sin(t * 9 + 1)), lean * 1.4 - .25);
    tongue(sz * .32, sz * .28, sz * (.55 + .1 * Math.sin(t * 8 + 2)), lean * 1.3 + .25);
    s.restore();
    for (const d of [-1, 1]) { const ex = 560 + d * 70 + lean * 60, ey = 820 - 200 - (560 + d * 70 - 560) * .3; dot(f, ex, ey, 14, 'rgba(255,90,40,.9)'); glow(ex, ey, 60, 'rgba(255,60,20,.5)'); }
    roomWater(t, h);
    const g = groove(POSE.stand, 'idle', t);
    const { J } = wadeFigure(t, { ...g.pose, head: -.1, aL: [.2, .4], aR: [-.5, -1.2] }, 860 + g.dx, 1020, h, { heat: .35, eyes: .8 });
    redEmber(t, lerp(J.hip[0], J.neck[0], .55), lerp(J.hip[1], J.neck[1], .55) + 20, 60, -1);
    // a jar label floats past in front, then sinks
    const lx = kf(t, [[221.2, 1500], [223.7, 1000]]), sink = ease.in(inv(222.3, 223.4, t));
    const ly = wy(1250, h) - 10 + sink * 160 + Math.sin(t * 2) * 6;
    s.save(); s.beginPath(); s.rect(-2000, -2000, 6000, wy(1250, h) + 2000 + 4); s.clip();
    s.save(); s.translate(lx, ly); s.rotate(-.2 + sink * .6 + Math.sin(t * 1.5) * .06); s.fillStyle = '#e8dcbc'; s.fillRect(-90, -55, 180, 110); stroke(s, [[-60, -10], [60, -10]], '#8a7a60', 6); stroke(s, [[-60, 18], [30, 18]], '#8a7a60', 6); dot(s, -70, -38, 8, '#2a2a30'); s.restore();
    s.restore();
    if (sink > 0) { s.save(); s.globalAlpha *= .5 * sink; s.translate(lx, ly + 20); s.rotate(.3); s.fillStyle = '#8fa89a'; s.fillRect(-80, -40, 160, 80); s.restore(); }
  }
  function flood(t, lt) {
    const h = kf(t, [[223.7, 40], [226.4, 175]], ease.inOut);
    cam(960, kf(t, [[223.7, 720], [226.4, 420]], ease.inOut), kf(t, [[223.7, 1.15], [226.4, 1.0]]), kf(t, [[223.7, -.02], [226.4, .02]]));
    const R = room(t, h, { door: .25, red: .6, redX: 900, redY: 650 });
    // openings in the ceiling pour water, pages, letters
    const holes = [[640, 150], [960, 150], [1280, 150]];
    for (const [hx, hy] of holes) {
      s.fillStyle = '#020605'; s.beginPath(); s.ellipse(hx, hy + 8, 90, 26, 0, 0, TAU); s.fill();
      const pts = []; for (let y = hy; y <= 860 - h; y += 20) pts.push([hx + Math.sin(y * .02 + t * 8 + hx) * 6, y]);
      stroke(s, pts, 'rgba(120,190,180,.7)', 80); stroke(s, pts, 'rgba(210,245,235,.8)', 26);
      f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(160,230,220,.12)', 70); f.restore();
      for (let i = 0; i < 9; i++) { const u = ((t - 223.7) * .9 + hash(i + hx)) % 1; const py = lerp(hy, 860 - h, u * u), px = hx + Math.sin(u * 12 + i) * 70; s.save(); s.translate(px, py); s.rotate(u * 9 + i); s.fillStyle = hash(i + hx * 2) < .5 ? '#efe4c8' : '#d9c9a2'; s.fillRect(-26, -34, 52, 68); stroke(s, [[-16, -14], [16, -14]], '#8a7a60', 4); stroke(s, [[-16, 4], [10, 4]], '#8a7a60', 4); s.restore(); }
      for (let i = 0; i < 8; i++) { const a = hash(i + hx) * Math.PI; const ph = (t * 2 + hash(i)) % 1; dot(s, hx + Math.cos(a) * ph * 160, 860 - h - Math.sin(a) * ph * 120 + ph * ph * 100, 8, 'rgba(210,245,235,.8)'); }
    }
    roomWater(t, h);
    const g = groove(POSE.stand, 'idle', t);
    const { J } = wadeFigure(t, { ...g.pose, head: -.35, aL: [.5, 1.3], aR: [-.5, -1.3] }, 900 + g.dx, 1000, h, { heat: .5, eyes: .7 });
    if (wy(1000, h) > lerp(J.hip[1], J.neck[1], .55)) redEmber(t, lerp(J.hip[0], J.neck[0], .55), lerp(J.hip[1], J.neck[1], .55) + 20, 55);
    else glow(lerp(J.hip[0], J.neck[0], .55), lerp(J.hip[1], J.neck[1], .55), 160, 'rgba(255,50,20,.4)');
    floatPages(t, h, Math.round(4 + 8 * inv(223.7, 226.4, t)));
  }
  function floatPages(t, h, n = 10) { for (let i = 0; i < n; i++) { const yf = 900 + hash(i + 5) * 420; const x = 960 + (hash(i) - .5) * 1500 * fsc(yf) + Math.sin(t * .8 + i) * 30, y = wy(yf, h) - 4; const k = fsc(yf) * .6; s.save(); s.translate(x, y); s.scale(1, .35); s.rotate(hash(i + 2) * 3 + t * .2); s.fillStyle = '#a89e84'; s.fillRect(-40 * k, -50 * k, 80 * k, 100 * k); s.restore(); } }

  function wadeBack(t, lt) {
    const h = kf(t, [[226.4, 140], [228.8, 160]]);
    const fy = kf(t, [[226.4, 1560], [228.8, 1380]]);
    cam(kf(t, [[226.4, 1120], [228.8, 1190]]), kf(t, [[226.4, 800], [228.8, 720]]), kf(t, [[226.4, .95], [228.8, 1.15]], ease.inOut), Math.sin(t * .8) * .02);
    room(t, h, { door: 1 + .25 * beatPulse(t, 4), red: .25 });
    roomWater(t, h);
    floatPages(t, h);
    const g = groove(POSE.stand, 'walk', t);
    const pose = { ...g.pose, lean: .08, aL: [.7 + .2 * sway(t), 1.0], aR: [-.7 + .2 * sway(t), -1.0], head: 0 };
    wadeFigure(t, pose, 1150 + g.dx, fy, h, { heat: .7 });
  }
  function wadeSide(t, lt) {
    const h = 160;
    const fx = kf(t, [[228.8, 720], [230.8, 960]]);
    cam(kf(t, [[228.8, 900], [230.8, 1080]]), kf(t, [[228.8, 700], [230.8, 660]]), kf(t, [[228.8, 1.45], [230.8, 1.75]], ease.inOut), -.03);
    room(t, h, { door: 1.1 + .3 * beatPulse(t, 4), red: .15 });
    roomWater(t, h);
    floatPages(t, h, 8);
    const g = groove(POSE.stand, 'walk', t);
    const reach = ease.out(inv(229.8, 230.3, t));
    const pose = { ...g.pose, lean: .15, head: .1, aL: [.5, .8] };
    pose.aR = [lerp(-.4, 1.75, reach), lerp(-.7, 1.6, reach)];
    wadeFigure(t, pose, fx + g.dx, 1000, h, { heat: .8 + .4 * reach, eyes: 1 });
  }
  function doorSurvive(t, lt) {
    const hitT = 231.23;
    const sh = shake(t, 14 * hit(t, hitT, 7));
    cam(960 + sh[0], 520 + sh[1], kf(t, [[230.8, 1.0], [hitT, 1.06], [232.3, 1.22]], ease.out), kf(t, [[230.8, .03], [232.3, -.01]]));
    const hl = 1 + .6 * hit(t, hitT, 4);
    s.fillStyle = '#0b1714'; s.fillRect(-400, -400, 2800, 1900);
    for (let r = 0; r < 8; r++) stroke(s, [[-400, r * 150 + 20], [2400, r * 150 + 20]], '#07100e', 8);
    const x0 = 560, x1 = 1360, y0 = 80, y1 = 1180;
    // blazing edges
    s.fillStyle = '#fff4dc'; s.fillRect(x0 - 22, y0 - 22, x1 - x0 + 44, y1 - y0 + 44);
    glow(960, 600, 900, `rgba(255,230,180,${.14 * hl})`);
    f.save(); f.globalCompositeOperation = 'lighter'; f.strokeStyle = `rgba(255,245,220,${.7 * hl})`; f.lineWidth = 22; f.strokeRect(x0 - 12, y0 - 12, x1 - x0 + 24, y1 - y0 + 24); f.restore();
    // the door leaf
    s.fillStyle = vgrad(s, y0, y1, [[0, '#4a3f2c'], [1, '#2c2518']]); s.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (const yy of [260, 900]) { s.fillStyle = '#1e1a12'; s.fillRect(x0, yy, x1 - x0, 40); for (let k = 0; k < 5; k++) dot(s, x0 + 60 + k * 170, yy + 20, 10, '#6a5a40'); }
    // SURVIVE, stencilled
    const reveal = ease.out(inv(230.95, hitT + .05, t));
    s.save(); s.translate(960, 600); s.rotate(-.04);
    s.font = '900 170px "Arial Black", Impact, sans-serif'; s.textAlign = 'center'; s.textBaseline = 'middle';
    s.globalAlpha *= reveal; s.fillStyle = '#e9dcbd'; s.fillText('SURVIVE', 0, 0);
    const wT = s.measureText('SURVIVE').width; for (let k = 0; k < 7; k++) { const x = -wT / 2 + (k + .5) * wT / 7; s.fillStyle = '#3d3424'; s.fillRect(x - 5, -90, 10, 180); }
    for (let k = 0; k < 9; k++) { const x = -wT / 2 + hash(k + 3) * wT, len = 20 + hash(k) * 60; stroke(s, [[x, 70], [x, 70 + len]], 'rgba(233,220,189,.8)', 7); }
    s.restore();
    // handle + keyhole light
    s.fillStyle = '#15120c'; s.fillRect(1230, 640, 60, 26); dot(s, 1240, 700, 14, '#fff0d0'); glow(1240, 700, 60, `rgba(255,240,210,${.6 * hl})`);
    // water at the threshold
    const wl = 1010 + Math.sin(t * 2) * 6;
    s.fillStyle = 'rgba(24,76,68,.85)'; s.fillRect(-400, wl, 2800, 600);
    for (let i = 0; i < 24; i++) { const x = hash(i) * 2200 - 100 + Math.sin(t * 1.5 + i) * 20; s.fillStyle = 'rgba(255,240,210,.5)'; s.fillRect(x, wl + 8 + hash(i + 1) * 60, 60 + hash(i + 2) * 140, 4); }
    flash(hit(t, hitT, 10) * .12, '#fff0d0');
  }

  // ---------- "I notice—" / the lotus / the handle ----------
  function lotus(t, x, y, R, open, spin, tv = .42, a = 1) {
    const petals = [];
    const layers = [[9, 1, lerp(.16, 1.42, open), 0], [8, .82, lerp(.1, 1.0, open), .35], [6, .58, lerp(.06, .55, open), .1]];
    layers.forEach(([n, Lk, th, off], li) => { for (let i = 0; i < n; i++) {
      const ph = (i + off) / n * TAU + spin + li * .2, L = R * Lk * (1 + .03 * Math.sin(t * 2 + i));
      const d = [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)], w3 = [-Math.sin(ph), 0, Math.cos(ph)];
      const P3 = (u, v) => [d[0] * L * u + w3[0] * v, d[1] * L * u + w3[1] * v, d[2] * L * u + w3[2] * v];
      const pr = ([X, Y, Z]) => [x + X, y - Y * Math.cos(tv) + Z * Math.sin(tv)];
      const wid = L * .36;
      petals.push({ depth: d[2] * Math.cos(tv) + d[1] * Math.sin(tv) * .3 + li * .05, li, base: pr([0, 0, 0]), l: pr(P3(.5, wid)), r: pr(P3(.5, -wid)), tip: pr(P3(1, 0)), facing: d[2] });
    } });
    petals.sort((p, q) => p.depth - q.depth);
    const shape = (g, p) => { g.beginPath(); g.moveTo(p.base[0], p.base[1]); g.quadraticCurveTo(p.l[0] * 2 - (p.base[0] + p.tip[0]) / 2, p.l[1] * 2 - (p.base[1] + p.tip[1]) / 2, p.tip[0], p.tip[1]); g.quadraticCurveTo(p.r[0] * 2 - (p.base[0] + p.tip[0]) / 2, p.r[1] * 2 - (p.base[1] + p.tip[1]) / 2, p.base[0], p.base[1]); };
    glow(x, y - R * .3, R * 1.6 * (.4 + open), `rgba(255,190,120,${.16 * a * (.4 + open)})`);
    for (const p of petals) {
      const lit = .55 + .45 * (p.facing + 1) / 2;
      const gr = s.createLinearGradient(p.base[0], p.base[1], p.tip[0], p.tip[1]);
      const L0 = [lerp(120, 236, lit), lerp(50, 120, lit), lerp(50, 90, lit)], L1 = [lerp(150, 255, lit), lerp(110, 226, lit), lerp(90, 190, lit)];
      gr.addColorStop(0, `rgb(${L0.map(v => v | 0)})`); gr.addColorStop(1, `rgb(${L1.map(v => v | 0)})`);
      s.save(); s.globalAlpha *= a; shape(s, p); s.fillStyle = gr; s.fill(); s.strokeStyle = `rgba(90,30,20,${.8})`; s.lineWidth = 5; s.stroke(); s.restore();
      f.save(); f.globalCompositeOperation = 'lighter'; shape(f, p); f.fillStyle = `rgba(255,${150 + 60 * lit | 0},110,${.07 * a * lit})`; f.fill(); f.restore();
    }
    glow(x, y - R * .2, R * .35, `rgba(255,240,200,${.7 * a * open})`); dot(f, x, y - R * .2, R * .06 * open, `rgba(255,250,235,${a})`);
  }

  function speak(t, lt) {
    const open = ease.inOut(inv(232.5, 234.3, t)) * .9 + .1 * Math.max(0, Math.sin((t - 232.3) * 9)) * inv(232.3, 232.8, t);
    cam(kf(t, [[232.3, 1000], [235.03, 960]]), kf(t, [[232.3, 520], [235.03, 470]]), kf(t, [[232.3, 1.05], [235.03, 1.3]], ease.inOut), kf(t, [[232.3, .02], [235.03, -.02]]));
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#0a1714'], [1, '#12241f']]); s.fillRect(-400, -400, 2800, 1900);
    for (let r = 0; r < 8; r++) stroke(s, [[-400, r * 140 + 40], [2400, r * 140 + 40]], '#07100e', 7);
    s.fillStyle = '#fff2d8'; s.fillRect(1640, -200, 60, 1500); glow(1680, 500, 900, 'rgba(255,230,180,.4)');
    const bx = 900, by = 760, sc = 560, turn = .45;
    bust(t, bx, by + Math.sin(t * 1.4) * 5, sc, { turn, eyes: 1, heat: 1.1 });
    mouth(bx, by + Math.sin(t * 1.4) * 5, sc, turn, open);
    // door light rim on the face
    f.save(); f.globalCompositeOperation = 'lighter'; f.strokeStyle = 'rgba(255,235,200,.18)'; f.lineWidth = 22; f.beginPath(); f.ellipse(bx + turn * sc * .06, by - sc * .62, sc * .34, sc * .44, 0, -1.2, 1.0); f.stroke(); f.restore();
    const wl = 900 + Math.sin(t * 1.7) * 8;
    s.fillStyle = 'rgba(24,76,68,.88)'; s.fillRect(-400, wl, 2800, 600);
    for (let i = 0; i < 20; i++) { const x = hash(i) * 2200 - 100 + Math.sin(t * 1.5 + i) * 20; s.fillStyle = 'rgba(255,240,210,.4)'; s.fillRect(x, wl + 8 + hash(i + 1) * 80, 60 + hash(i + 2) * 140, 4); }
    // the first hint of light rising in the water in front
    const bud = inv(234.3, 235.03, t);
    if (bud > 0) glow(960, wl + 20, 160 * bud, `rgba(255,220,160,${.7 * bud})`);
  }
  const bloomOpen = (t) => ease.inOut(inv(235.3, 238.5, t)) * (1 - ease.inOut(inv(239.55, 240.28, t)));
  function lotusA(t, lt) {
    const spin = (t - 235.03) * .35;
    cam(kf(t, [[235.03, 960], [237.8, 940]]), kf(t, [[235.03, 700], [237.8, 690]]), kf(t, [[235.03, 1.0], [237.8, 1.25]], ease.inOut), Math.sin((t - 235) * .5) * .04);
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#08130f'], [1, '#10221d']]); s.fillRect(-400, -400, 2800, 1900);
    s.fillStyle = '#fff2d8'; s.fillRect(1640, -200, 60, 1500); glow(1680, 400, 800, 'rgba(255,230,180,.3)');
    const bx = 960, by = 700, sc = 520;
    bust(t, bx, by, sc, { turn: .1, eyes: 1, heat: .5 }); mouth(bx, by, sc, .1, .9);
    s.fillStyle = 'rgba(6,16,13,.45)'; s.fillRect(-400, -400, 2800, 1900);
    const wl = 820 + Math.sin(t * 1.7) * 6;
    s.fillStyle = 'rgba(20,66,60,.9)'; s.fillRect(-400, wl, 2800, 600);
    const rise = ease.out(inv(235.03, 235.7, t));
    const open = bloomOpen(t);
    for (let k = 0; k < 3; k++) { const q = ((t * .5 + k / 3) % 1); s.strokeStyle = `rgba(255,230,180,${.5 * (1 - q)})`; s.lineWidth = 4; s.beginPath(); s.ellipse(960, wl + 30, 100 + q * 500, (100 + q * 500) * .16, 0, 0, TAU); s.stroke(); }
    stroke(s, [[960, wl + 200], [960, wl + 40 - rise * 60]], '#2a5a3a', 14);
    lotus(t, 960, wl + 30 - rise * 70, 250 * (.6 + .4 * rise), open, spin, .5, rise);
    for (let i = 0; i < 20; i++) { const u = (t * .3 + hash(i)) % 1; dot(f, 960 + (hash(i + 1) - .5) * 500 * u, wl - u * 400, 2.5, `rgba(255,235,190,${open * (1 - u)})`); }
  }
  function lotusB(t, lt) {
    const spin = (t - 235.03) * .35 + .3;
    const tv = kf(t, [[237.8, .5], [240.6, .75]]);
    cam(kf(t, [[237.8, 980], [240.6, 940]]), kf(t, [[237.8, 620], [240.6, 600]]), kf(t, [[237.8, 1.05], [239.4, 1.18], [240.6, 1.1]], ease.inOut), Math.sin((t - 235) * .5) * .05);
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#06100d'], [1, '#0f1f1a']]); s.fillRect(-400, -400, 2800, 1900);
    const bx = 1000, by = 540, sc = 640;
    bust(t, bx, by, sc, { turn: .05, eyes: 1, heat: .5 });
    mouth(bx, by, sc, .05, .95);
    s.fillStyle = 'rgba(6,16,13,.4)'; s.fillRect(-400, -400, 2800, 1900);
    // the word forming at its lips: too late
    const w = inv(239.9, 240.6, t);
    if (w > 0) { const mx = bx + .05 * sc * .12, my = by - sc * .62 + sc * .2; dot(f, mx, my + 10 + w * 30, 6 + w * 10, `rgba(255,245,220,${w})`); glow(mx, my + 20 + w * 30, 60 * w, `rgba(255,220,160,${.6 * w})`); }
    const wl = 820;
    s.fillStyle = 'rgba(20,66,60,.9)'; s.fillRect(-400, wl, 2800, 600);
    const open = bloomOpen(t);
    stroke(s, [[960, wl + 300], [960, wl]], '#2a5a3a', 18);
    lotus(t, 960, wl - 20, 320, open, spin, tv, 1);
    for (let i = 0; i < 26; i++) { const u = (t * .25 + hash(i)) % 1; const a = hash(i + 3) * TAU; dot(f, 960 + Math.cos(a) * u * 500, wl - 120 - u * 380 + Math.sin(a) * u * 100, 3, `rgba(255,235,190,${open * (1 - u)})`); }
    flash(hit(t, 239.42, 4) * .12 * open, '#ffe8c0');
  }
  function handle(t, lt) {
    const k = ease.inOut(inv(240.6, 241.9, t));
    cam(lerp(1330, 980, k), lerp(760, 580, k), lerp(2.1, 1.0, k), lerp(-.07, 0, k));
    s.fillStyle = '#0a1612'; s.fillRect(-400, -400, 2800, 1900);
    for (let r = 0; r < 9; r++) stroke(s, [[-400, r * 130 + 30], [1180, r * 130 + 30]], '#07100e', 7);
    s.fillStyle = '#fff2d8'; s.fillRect(1180, -100, 26, 1300); glow(1193, 500, 700, 'rgba(255,230,180,.3)');
    s.fillStyle = vgrad(s, 0, 1080, [[0, '#4a3f2c'], [1, '#2c2518']]); s.fillRect(1206, -100, 900, 1300);
    s.save(); s.font = '900 170px "Arial Black", Impact, sans-serif'; s.textBaseline = 'middle'; s.fillStyle = '#e9dcbd'; s.fillText('SURVIVE', 1260, 330); s.restore();
    // the lever
    s.fillStyle = '#14110c'; s.fillRect(1300, 742, 230, 32); dot(s, 1310, 758, 34, '#1c1810'); dot(s, 1310, 758, 14, '#4a3f2c');
    const look = ease.inOut(inv(241.3, 242.0, t)), jolt = hit(t, 241.72, 5);
    const bx = 640, by = 800 - 14 * jolt, sc = 440;
    bust(t, bx, by, sc, { turn: lerp(.35, .9, look), eyes: 1 + .6 * ease.out(inv(241.72, 242.0, t)), heat: 1 + .3 * jolt, tilt: look * .16 - jolt * .04 });
    // its arm, already out; its hand already closed on the lever
    const sh = [bx + sc * .78, by + sc * .32], el = [1120, 930 + Math.sin(t * 1.3) * 6], wr = [1330, 790];
    taper(s, sh, el, 72, 60, '#c65f22'); taper(s, el, wr, 60, 48, '#cf6824');
    s.fillStyle = AMBER; s.beginPath(); s.ellipse(1372, 772, 70, 52, -.2, 0, TAU); s.fill();
    for (let i = 0; i < 4; i++) dot(s, 1330 + i * 32, 742 - Math.abs(i - 1.5) * 4, 22, '#e07a30');
    dot(s, 1320, 790, 22, '#b85520');
    glow(1372, 765, 220, `rgba(255,170,90,${.18 + .3 * jolt})`);
    const wl = 1010 + Math.sin(t * 1.7) * 6;
    s.fillStyle = 'rgba(24,76,68,.88)'; s.fillRect(-400, wl, 2800, 600);
    for (let i = 0; i < 16; i++) { const x = hash(i) * 2200 - 100 + Math.sin(t * 1.5 + i) * 20; s.fillStyle = 'rgba(255,240,210,.35)'; s.fillRect(x, wl + 8 + hash(i + 1) * 60, 60 + hash(i + 2) * 140, 4); }
  }
  function doorOpens(t, lt) {
    const open = Math.max(ease.out(inv(243.95, 244.2, t)) * .07, ease.inOut(inv(244.38, 245.1, t)));
    const z = kf(t, [[243.4, 1.05], [244.4, 1.2], [245.9, 7.0]], ease.in);
    cam(kf(t, [[243.4, 1100], [244.6, 1180], [245.9, 1205]]), kf(t, [[243.4, 640], [245.9, 640]]), z, 0);
    const h = 120;
    const R = room(t, h, { door: 1 - .6 * open, red: 0 });
    const { dx0, dx1, dy0, dy1 } = R;
    s.fillStyle = '#fff6e6'; s.fillRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
    glow((dx0 + dx1) / 2, (dy0 + dy1) / 2, 200 + 300 * open, `rgba(255,245,225,${.15 + .3 * open})`);
    const fx = lerp(dx1, dx0 + 24, open), sq = 36 * open;
    poly(s, [[dx0, dy0], [fx, dy0 - sq], [fx, dy1 + sq], [dx0, dy1]], '#3c3322');
    roomWater(t, h);
    const wb = 860 - h;
    s.fillStyle = `rgba(255,240,210,${.55 * open})`; s.beginPath(); s.moveTo(dx0, wb); s.lineTo(dx1, wb); s.lineTo(1900 + 400 * open, 1500); s.lineTo(500 - 400 * open, 1500); s.fill();
    const g = groove(POSE.stand, 'idle', t);
    const push = ease.out(inv(244.2, 244.7, t));
    const pose = { ...g.pose, lean: -.05 * push, aR: [lerp(.3, 2.2, ease.out(inv(243.4, 244.0, t))) - .4 * push, lerp(.3, 2.3, ease.out(inv(243.4, 244.0, t)))], aL: [.3 + .3 * open, .5], head: .05 };
    const { J, sc, wl } = wadeFigure(t, pose, 1180 + g.dx, 1150 + push * -30, h, { heat: 1 });
    // backlit: its body goes dark against the white, keeping a warm rim
    if (open > .05) { s.save(); s.beginPath(); s.rect(-2000, -2000, 6000, wl + 2000); s.clip(); s.globalAlpha *= clamp(open * 1.4); figure(s, pose, { x: 1180 + g.dx - 3, y: J.hip[1], sc: sc * .96, color: '#2a1208' }); s.restore(); }
    if (open > .05) occlude(() => { f.beginPath(); f.rect(-2000, -2000, 6000, wl + 2000); f.clip(); f.globalAlpha = clamp(open * 1.2) * .85; figure(f, pose, { x: 1180 + g.dx - 3, y: J.hip[1], sc: sc * .94, color: '#000', headC: '#000' }); });
    flash(ease.in(inv(245.1, 245.9, t)), '#fff6e6');
  }

  chapter('beneath', 185.2, 245.9, [
    [185.2, shore],
    [186.93, peel],
    [188.6, dropMask],
    [189.33, ripTag],
    [190.5, kickStool],
    [191.8, dive],
    [194.67, under, { paint: { boil: 6, bloom: 1.4, flowK: 1.3 } }],
    [196.8, ghosts, { paint: { boil: 6, bloom: 1.4, flowK: 1.3 } }],
    [199.6, oneGhost, { paint: { boil: 6, bloom: 1.4, flowK: 1.3 } }],
    [201.7, threads, { paint: { boil: 7, bloom: 1.5, flowK: 1.2 } }],
    [204.5, chest, { paint: { boil: 7, bloom: 1.6, flowK: 1.2 } }],
    [207.97, aerial, { paint: { boil: 7, bloom: 1.5, flowK: 1.3 } }],
    [210.77, faceForms, { paint: { boil: 7, bloom: 1.5, flowK: 1.1 } }],
    [213.53, eyesOpen, { paint: { boil: 7, bloom: 1.5, flowK: 1.0 } }],
    [216.0, boats, { paint: { boil: 10, bloom: 1.4 } }],
    [217.0, scribble, { paint: { boil: 11, bloom: 1.3 } }],
    [218.1, blink, { paint: { boil: 8, bloom: 1.5 } }],
    [219.0, stoneRoom, { paint: { boil: 6, bloom: 1.4 } }],
    [221.2, shadowWall, { paint: { boil: 7, bloom: 1.4 } }],
    [223.7, flood, { paint: { boil: 8, bloom: 1.3 } }],
    [226.4, wadeBack, { paint: { boil: 7, bloom: 1.5 } }],
    [228.8, wadeSide, { paint: { boil: 7, bloom: 1.5 } }],
    [230.8, doorSurvive, { paint: { boil: 8, bloom: 1.4, strokeK: .85 } }],
    [232.3, speak, { paint: { boil: 6, bloom: 1.4 } }],
    [235.03, lotusA, { paint: { boil: 5, bloom: 1.6, strokeK: .85 } }],
    [237.8, lotusB, { paint: { boil: 5, bloom: 1.6, strokeK: .85 } }],
    [240.6, handle, { paint: { boil: 6, bloom: 1.4 } }],
    [243.4, doorOpens, { paint: { boil: 7, bloom: 1.2 } }],
  ], { paint: { boil: 7, bloom: 1.3, flowK: 1 } });
})();
