// js/ch/c2.js — II · OPENED (44.8 – 66.3)
(() => {
  const GLOVE = '#e2eaec', GLOVE_S = '#a9b8c0';
  const both = (fn) => { s.save(); f.save(); fn(); s.restore(); f.restore(); };
  const T_LIFT = BT(62), T_CUT = when('cut', 49), T_OPEN = BT(70), T_SNAP = when('proved', 62), T_WHIP = when('you', 63);

  // ---------- shared props ----------
  function lamp(px, py, len, ang, k = 1) { // a hanging enamel lamp; returns the bulb point
    const bx = px + Math.sin(ang) * len, by = py + Math.cos(ang) * len;
    stroke(s, [[px, py], [bx, by]], '#1a100a', 4);
    both(() => {
      s.translate(bx, by); s.rotate(-ang);
      poly(s, [[-22, 0], [22, 0], [70, 58], [-70, 58]], '#26382c');
      poly(s, [[-70, 58], [70, 58], [60, 66], [-60, 66]], '#f5e2b0');
    });
    const lx = bx + Math.sin(ang) * 60, ly = by + Math.cos(ang) * 60;
    glow(lx, ly, 420 * k, 'rgba(255,190,110,.35)'); glow(lx, ly, 70 * k, 'rgba(255,240,200,.9)');
    return [lx, ly];
  }
  function tentInside(t, lx, ly, floorY = 880, dim = 0) { // back canvas wall, roof slope, floor; lit from (lx, ly)
    s.fillStyle = vgrad(s, -200, floorY, [[0, '#2a150a'], [.35, '#7a4820'], [1, '#b87a38']]); s.fillRect(-400, -400, W + 800, floorY + 400);
    for (let i = -3; i < 12; i++) { const x = i * 250 + 60; poly(s, [[x - 4, floorY], [x + 4, floorY], [lerp(x, W / 2, .35) + 3, -300], [lerp(x, W / 2, .35) - 3, -300]], 'rgba(70,36,14,.55)'); }
    poly(s, [[-400, -400], [W + 400, -400], [W + 400, 60], [W / 2, -120], [-400, 60]], '#1e0f07');
    s.fillStyle = rgrad(s, lx, ly, 20, 900, [[0, 'rgba(255,214,150,.75)'], [.5, 'rgba(230,150,70,.25)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-400, -400, W + 800, H + 800);
    if (dim) { s.fillStyle = `rgba(22,10,4,${dim})`; s.fillRect(-400, -400, W + 800, H + 800); }
    s.fillStyle = vgrad(s, floorY, H + 200, [[0, '#4a2a12'], [1, '#170b05']]); s.fillRect(-400, floorY, W + 800, 800);
  }
  function glove(x, y, ang, sc, pinch = 0) { // gloved hand, fingers pointing along +x after rotate(ang)
    both(() => {
      s.translate(x, y); s.rotate(ang);
      s.fillStyle = GLOVE_S; s.beginPath(); s.ellipse(-sc * .35, sc * .06, sc * .62, sc * .42, 0, 0, TAU); s.fill();
      s.fillStyle = GLOVE; s.beginPath(); s.ellipse(-sc * .38, 0, sc * .56, sc * .38, 0, 0, TAU); s.fill();
      for (let k = 0; k < 4; k++) { const a = [sc * .05, (k - 1.5) * sc * .17], b = [sc * (.62 - pinch * .2 - Math.abs(k - 1.2) * .07), (k - 1.5) * sc * .14 * (1 - pinch * .5)];
        taper(s, a, b, sc * .1, sc * .085, GLOVE_S); taper(s, a, b, sc * .075, sc * .06, k % 2 ? GLOVE : '#d3dde0'); }
      taper(s, [-sc * .2, sc * .3], [sc * .3, sc * .3 - pinch * sc * .12], sc * .11, sc * .085, GLOVE_S); taper(s, [-sc * .2, sc * .3], [sc * .3, sc * .3 - pinch * sc * .12], sc * .08, sc * .06, '#cfd9dc');
      poly(s, [[-sc * 3, -sc * .42], [-sc * .72, -sc * .36], [-sc * .72, sc * .4], [-sc * 3, sc * .46]], '#9c9ea8'); // the lab-coat sleeve
      poly(s, [[-sc * .9, -sc * .37], [-sc * .72, -sc * .36], [-sc * .72, sc * .4], [-sc * .9, sc * .41]], '#c9c6ba');
    });
  }
  // glass jar; (x, yb) = base centre, grows upward (or downward from the mouth when flip). back/front split so an ember fits between.
  function jarXf(x, yb, h, flip, tilt) { s.translate(x, yb); s.rotate(tilt); if (flip) { s.translate(0, -h); s.scale(1, -1); } }
  function jarBack(x, yb, w, h, { flip = false, tilt = 0, tint = 'rgba(150,180,200,.28)' } = {}) {
    s.save(); jarXf(x, yb, h, flip, tilt);
    s.fillStyle = tint; s.beginPath(); s.roundRect(-w / 2, -h * .88, w, h * .88, w * .16); s.fill();
    s.fillRect(-w * .36, -h, w * .72, h * .14);
    s.restore();
  }
  function jarFront(x, yb, w, h, { flip = false, tilt = 0, lid = true, lidDy = 0, lidTilt = 0, lit = 1 } = {}) {
    s.save(); jarXf(x, yb, h, flip, tilt);
    s.strokeStyle = 'rgba(210,228,236,.55)'; s.lineWidth = Math.max(2, w * .035); s.beginPath(); s.roundRect(-w / 2, -h * .88, w, h * .88, w * .16); s.stroke();
    stroke(s, [[-w * .32, -h * .14], [-w * .34, -h * .74]], `rgba(250,245,230,${.75 * lit})`, w * .08);
    stroke(s, [[w * .36, -h * .2], [w * .37, -h * .55]], `rgba(250,245,230,${.35 * lit})`, w * .04);
    stroke(s, [[-w * .36, -h * .9], [w * .36, -h * .9]], 'rgba(210,228,236,.6)', w * .05);
    if (lid) { s.save(); s.translate(0, -h - lidDy); s.rotate(lidTilt);
      s.fillStyle = '#7d6a44'; s.fillRect(-w * .42, -h * .1, w * .84, h * .12); s.fillStyle = '#c9ad6e'; s.fillRect(-w * .42, -h * .1, w * .84, h * .035); s.restore(); }
    s.restore();
  }
  function glint(x, y, r, a = .6) { glow(x, y, r, `rgba(235,245,255,${a})`); }
  // net on a pole: hand point, angle of the pole, length
  function net(hx, hy, ang, len, sc = 1) {
    const ex = hx + Math.sin(ang) * len, ey = hy - Math.cos(ang) * len;
    stroke(s, [[hx, hy], [ex, ey]], '#3a2616', 7 * sc);
    both(() => {
      s.translate(ex, ey); s.rotate(ang);
      s.fillStyle = 'rgba(230,220,200,.35)'; s.beginPath(); s.moveTo(-60 * sc, -40 * sc); s.quadraticCurveTo(-10 * sc, 120 * sc, 60 * sc, -40 * sc); s.fill();
      for (let k = -2; k <= 2; k++) stroke(s, [[k * 22 * sc, -40 * sc], [k * 8 * sc, 50 * sc]], 'rgba(240,230,210,.35)', 2 * sc);
      s.strokeStyle = '#d9c9a0'; s.lineWidth = 6 * sc; s.beginPath(); s.ellipse(0, -40 * sc, 62 * sc, 20 * sc, 0, 0, TAU); s.stroke();
    });
    return [ex, ey];
  }
  // researcher seen from above: forward is local -y
  function topRes(x, y, ang, sc, lean, { write = 0, t = 0, seed = 0, coat = P.coat } = {}) {
    both(() => {
      s.translate(x, y); s.rotate(ang); f.translate(x, y); f.rotate(ang);
      s.fillStyle = 'rgba(20,10,4,.45)'; s.beginPath(); s.ellipse(sc * .12, sc * .18, sc * .6, sc * .3, 0, 0, TAU); s.fill();
      s.translate(0, -lean * sc * .55); f.translate(0, -lean * sc * .55);
      s.fillStyle = '#8f8c86'; s.beginPath(); s.ellipse(0, sc * .06, sc * .56, sc * .26, 0, 0, TAU); s.fill();
      s.fillStyle = coat; s.beginPath(); s.ellipse(0, 0, sc * .54, sc * .24, 0, 0, TAU); s.fill();
      const wob = write * Math.sin(t * 17 + seed) * sc * .03;
      const hL = [-sc * .2 + wob, -sc * .5 - lean * sc * .1], hR = [sc * .16 - wob, -sc * .55 - lean * sc * .1];
      taper(s, [-sc * .42, -sc * .04], hL, sc * .11, sc * .08, '#c9c5b8'); taper(s, [sc * .42, -sc * .04], hR, sc * .11, sc * .08, '#c9c5b8');
      s.save(); s.translate(0, -sc * .66 - lean * sc * .1); s.rotate(.15 * Math.sin(seed)); s.fillStyle = '#f0e6cc'; s.fillRect(-sc * .2, -sc * .13, sc * .4, sc * .26); s.fillStyle = '#b8ab8c'; s.fillRect(-sc * .01, -sc * .13, sc * .02, sc * .26); s.restore();
      dot(s, hL[0], hL[1], sc * .08, GLOVE); dot(s, hR[0], hR[1], sc * .08, GLOVE);
      s.fillStyle = '#261c20'; s.beginPath(); s.ellipse(0, -sc * .12 - lean * sc * .12, sc * .19, sc * .22, 0, 0, TAU); s.fill();
      for (const d of [-1, 1]) dot(f, d * sc * .08, -sc * .33 - lean * sc * .12, sc * .025, `rgba(230,240,255,${.35 + .5 * lean})`);
    });
  }

  // ---------- 1 · the tent at night (44.8 – 46.7) ----------
  function tentNight(t, lt, dur) {
    const k = ease.in(lt / dur);
    cam(lerp(930, 960, k) + sway(t) * 6, lerp(560, 690, k), lerp(1.02, 3.1, k), lerp(-.02, .015, k));
    sky('#050818', P.night1, '#2b2d62', 700);
    stars(t, 21, 120, 520); clouds(t, 22, 90, 380, 'rgba(40,52,110,.5)', 6, 10);
    ridge(s, 640, 110, .0019, 31, '#141a40'); ridge(s, 700, 60, .003, 32, '#0d1330');
    // the tent
    const tent = [[470, 860], [560, 520], [960, 300], [1360, 520], [1450, 860]];
    s.fillStyle = 'rgba(230,140,60,.35)'; s.beginPath(); s.ellipse(960, 880, 760, 90, 0, 0, TAU); s.fill();
    poly(s, tent, '#d99448');
    s.fillStyle = rgrad(s, 960, 520, 30, 620, [[0, '#ffe2a6'], [.5, '#e8a454'], [1, 'rgba(160,80,30,.2)']]); s.beginPath(); tent.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.fill();
    // shadows on the canvas: two researchers heave the long body up onto the table
    both(() => {
      s.beginPath(); tent.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.clip();
      const sw = Math.sin(t * 2.2) * 18, SH = 'rgba(88,44,16,.9)';
      const up = ease.back(inv(T_LIFT - .1, T_LIFT + .45, t)), bend = 1 - ease.out(inv(T_LIFT - .5, T_LIFT, t)) * (1 - up);
      const lean = lerp(.55, .05, up), arms = lerp(.7, 1.9, up);
      const pL = { lean: lean, head: .2, aL: [arms, arms + .3], aR: [arms - .15, arms + .2], lL: [-.2, .1], lR: [.25, -.1] };
      const pR = { lean: -lean, head: -.2, aL: [-arms + .15, -arms - .2], aR: [-arms, -arms - .3], lL: [-.25, .1], lR: [.2, -.1] };
      const g = groove(pL, 'idle', t), g2 = groove(pR, 'idle', t);
      const JL = figure(s, g.pose, { x: 640 + sw, y: 760 + bend * 20, sc: 190, color: SH, coat: SH });
      const JR = figure(s, g2.pose, { x: 1280 + sw * 1.2, y: 760 + bend * 20, sc: 190, color: SH, coat: SH });
      const by = lerp(JL.hdR[1], JR.hdL[1], .5) - 18;
      s.save(); s.translate(960 + sw * 1.1, by); s.rotate(-Math.PI / 2 + .05 * Math.sin(t * 3)); figure(s, POSE.stand, { x: 0, y: 0, sc: 175, color: SH }); s.restore();
      // the lamp's shadow, swinging
      stroke(s, [[960, 300], [960 + sw * 3, 430]], SH, 5); poly(s, [[930 + sw * 3, 430], [990 + sw * 3, 430], [1030 + sw * 3, 490], [890 + sw * 3, 490]], SH);
    });
    // seams, flap, ropes
    for (const x of [620, 760, 1160, 1300]) stroke(s, [[x, 860], [lerp(x, 960, .7), 360]], 'rgba(140,70,26,.6)', 5);
    const open = ease.in(inv(dur - .55, dur, lt));
    poly(s, [[960, 560], [960 - 40 - 60 * open, 862], [960 + 40 + 60 * open, 862]], '#fff0c8');
    poly(s, [[960, 560], [890, 862], [936 - 60 * open, 862]], '#b36a2c'); poly(s, [[960, 560], [1030, 862], [984 + 60 * open, 862]], '#a45e26');
    glow(960, 780, 160 + 120 * open, `rgba(255,220,160,${.5 + .4 * open})`);
    glow(960, 520, 700, 'rgba(255,170,90,.18)');
    for (const [a, b] of [[[560, 520], [300, 900]], [[1360, 520], [1640, 900]], [[960, 300], [960, 250]]]) stroke(s, [a, b], '#0b0e22', 4);
    ridge(s, 900, 40, .004, 33, '#080b1c');
    for (let i = 0; i < 26; i++) { const x = hash(i + 400) * W, h = 20 + hash(i + 401) * 40; taper(s, [x, 920], [x + Math.sin(t * 1.5 + i) * 10, 920 - h], 5, 1, '#0a0d20'); }
    flash(inv(dur - .12, dur, lt) * .8, '#fff0d0');
  }

  // ---------- 2 · on the table, from above (46.7 – 49.8) ----------
  const RES_B = [[860, 212, Math.PI, 0], [1270, 212, Math.PI, 1], [760, 872, 0, 2], [1190, 872, 0, 3], [1640, 540, -Math.PI / 2, 4]];
  function lyingFigure(t, x, y, sc, heat = 1) { // head toward screen-left
    both(() => { s.translate(x, y); s.rotate(-Math.PI / 2); f.translate(x, y); f.rotate(-Math.PI / 2);
      pouredOne(t, groove(POSE.stand, 'idle', t, .4).pose, 0, 0, sc, { heat }); });
  }
  function onTable(t, lt, dur) {
    const push = ease.in(inv(dur - .9, dur, lt));
    cam(lerp(990, 930, push) + snoise(t * .5, 3) * 10, 540 + snoise(t * .5, 4) * 10, lerp(1.0, 1.1, lt / dur) + push * .8 + .025 * beatPulse(t, 7), lerp(-.2, .1, ease.inOut(lt / dur)));
    fill(s, '#2a170b');
    s.fillStyle = 'rgba(90,50,22,.9)'; for (let i = -6; i < 16; i++) s.fillRect(i * 140, -300, 8, 1700);
    const lx = 560 + Math.sin(t * 1.7) * 40, ly = 330 + Math.cos(t * 1.3) * 22;
    s.fillStyle = rgrad(s, lerp(lx, 960, .6), lerp(ly, 540, .6), 40, 900, [[0, 'rgba(255,220,160,.8)'], [.6, 'rgba(200,120,50,.25)'], [1, 'rgba(0,0,0,0)']]); s.fillRect(-400, -400, W + 800, H + 800);
    // table, sheet, tray of tools
    s.fillStyle = 'rgba(10,5,2,.5)'; s.fillRect(478, 352, 1010, 430);
    s.fillStyle = '#4a2c16'; s.fillRect(450, 320, 1020, 440);
    s.fillStyle = '#e8dfc8'; s.beginPath(); s.roundRect(470, 338, 980, 404, 18); s.fill();
    for (let i = 0; i < 5; i++) stroke(s, [[520 + i * 200, 345], [560 + i * 190, 735]], 'rgba(170,150,120,.35)', 6);
    s.fillStyle = '#6f757a'; s.fillRect(1330, 790, 200, 90); for (let i = 0; i < 5; i++) stroke(s, [[1350 + i * 36, 802], [1360 + i * 36, 868]], '#e8eef0', 5);
    lyingFigure(t, 1110, 540, 380, .9);
    // researchers lean in, a wave around the table on the beats
    const bi = lastBeat(t), since = t - FEAT.beats[bi];
    RES_B.forEach(([x, y, a, i]) => {
      const on = (bi + i) % 3 === 0 ? Math.sin(clamp(since / .62) * Math.PI) : 0;
      const g = sway(t + i * .3);
      topRes(x + g * 8, y, a + g * .04, 240, on * .9 + .1, { write: 1 - on, t, seed: i * 1.7, coat: '#c2c6ce' });
    });
    // the lamp from above: a dark dome, bright rim
    dot(s, lx, ly, 90, '#1f2e24'); dot(s, lx - 18, ly - 18, 56, '#3b5242');
    glow(lx, ly, 300, 'rgba(255,190,110,.3)'); f.save(); f.globalCompositeOperation = 'lighter'; f.strokeStyle = 'rgba(255,230,180,.6)'; f.lineWidth = 8; f.beginPath(); f.arc(lx, ly, 92, 0, TAU); f.stroke(); f.restore();
    // the gloved hand with the scalpel comes in at the end
    const hin = ease.out(inv(dur - .8, dur, lt));
    if (hin > 0) { const hx = lerp(1600, 1060, hin), hy = lerp(980, 650, hin); stroke(s, [[hx, hy], [hx - 120, hy - 100]], '#c9d1d6', 12); glove(hx + 30, hy + 30, -2.45, 120, .6); glint(hx - 120, hy - 100, 40, .8); }
  }

  // ---------- 3 · the cut (49.8 – 52.2) ----------
  // right half of the chest outline, neck to belly (x >= 960); the left half mirrors it
  const HALF = [[960, -40], [1060, -40], ...bez([1060, -40], [1075, 90], [1150, 150], [1330, 170], 10).slice(1),
    ...bez([1330, 170], [1520, 190], [1650, 270], [1655, 430], 14).slice(1), ...bez([1655, 430], [1650, 700], [1390, 900], [1340, 1250], 14).slice(1), [960, 1250]];
  const OUTLINE = [...HALF, ...HALF.slice(1, -1).reverse().map(([x, y]) => [1920 - x, y])];
  const pathOf = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); };
  // modelled chest: light from the upper left, rolling off at the edges, a darker core line down the sternum
  function chestShade(pts, x0, x1, dark = 0) {
    const gx = s.createLinearGradient(x0, 0, x1, 0);
    gx.addColorStop(0, '#f8b466'); gx.addColorStop(.3, '#e58534'); gx.addColorStop(.62, '#c05a1c'); gx.addColorStop(1, '#5a200a');
    pathOf(s, pts); s.fillStyle = gx; s.fill();
    s.save(); pathOf(s, pts); s.clip();
    s.fillStyle = vgrad(s, -40, 1250, [[0, 'rgba(255,225,170,.35)'], [.35, 'rgba(255,200,140,0)'], [.7, 'rgba(60,18,4,.15)'], [1, 'rgba(40,10,2,.55)']]); s.fillRect(-600, -200, 3200, 1600);
    pathOf(s, pts); s.lineWidth = 170; s.strokeStyle = 'rgba(70,22,6,.42)'; s.stroke();
    s.fillStyle = rgrad(s, 560, 330, 20, 330, [[0, 'rgba(255,230,180,.55)'], [1, 'rgba(255,200,140,0)']]); s.fillRect(-600, -200, 3200, 1600);
    if (dark) { s.fillStyle = `rgba(50,16,4,${dark})`; s.fillRect(-600, -200, 3200, 1600); }
    s.restore();
  }
  function torso(t, heat) {
    chestShade(OUTLINE, 265, 1655);
    // collarbones catch the light; pectoral shadows below; the core line
    stroke(s, bez([940, 150], [800, 170], [650, 190], [480, 240], 12), 'rgba(255,215,160,.55)', 20);
    stroke(s, bez([980, 150], [1120, 170], [1270, 190], [1440, 240], 12), 'rgba(255,190,130,.3)', 18);
    stroke(s, bez([560, 560], [700, 640], [860, 640], [935, 590], 14), 'rgba(110,38,10,.55)', 30);
    stroke(s, bez([1360, 560], [1220, 640], [1060, 640], [985, 590], 14), 'rgba(80,26,6,.6)', 30);
    stroke(s, [[960, 110], [958, 600], [962, 1150]], 'rgba(80,26,6,.7)', 26);
    for (let i = 0; i < 6; i++) { const x = 440 + hash(i + 90) * 1040, y = 330 + hash(i + 91) * 520; s.fillStyle = '#a4441a'; s.beginPath(); s.ellipse(x, y, 14, 40 + 10 * Math.sin(t + i), 0, 0, TAU); s.fill(); }
    for (let i = 0; i < 60; i++) { const a = hash(i) * TAU + t * (.3 + hash(i + 1) * .6), rr = 60 + hash(i + 2) * 380; dot(f, 960 + Math.cos(a) * rr, 560 + Math.sin(a) * rr * .9, 2 + hash(i + 3) * 3, `rgba(255,${150 + hash(i + 4) * 90 | 0},80,${heat * (.3 + .4 * Math.sin(t * 2.3 + i))})`); }
  }
  // one chest door, hinged on a vertical line near the flank, swung up toward the (overhead) camera by phi
  const HINGE = 1600, THICK = 70, CAMD = 3200, PC = [960, 560];
  function doorPt(x, y, phi, side, down = 0) {
    const h = side > 0 ? HINGE : 1920 - HINGE, d = Math.abs(h - x);
    const xr = h - side * d * Math.cos(phi) - side * down * Math.sin(phi), z = d * Math.sin(phi) - down * Math.cos(phi);
    const k = CAMD / (CAMD - z);
    return [PC[0] + (xr - PC[0]) * k, PC[1] + (y - PC[1]) * k];
  }
  function door(t, side, phi) {
    const flat = HALF.map(([x, y]) => [Math.min(x, HINGE), y]).map(([x, y]) => side > 0 ? [x, y] : [1920 - x, y]);
    const top = flat.map(([x, y]) => doorPt(x, y, phi, side));
    // the cut face: the free edge seen through its thickness
    const edge = flat.filter(([x]) => Math.abs(x - 960) < 1);
    const eTop = edge.map(([x, y]) => doorPt(x, y, phi, side)), eBot = edge.map(([x, y]) => doorPt(x, y, phi, side, THICK)).reverse();
    poly(s, [...eTop, ...eBot], '#ff9a48');
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, eBot, `rgba(255,190,110,${.55 * Math.sin(phi)})`, 12); f.restore();
    // the outer face, turning away from the light as it rises
    const xs = top.map((p) => p[0]);
    chestShade(top, side > 0 ? Math.min(...xs) : Math.max(...xs), side > 0 ? Math.max(...xs) : Math.min(...xs), .08 + .2 * Math.sin(phi));
    stroke(s, [eTop[0], eTop[eTop.length - 1]], 'rgba(255,220,160,.5)', 8);
  }
  function theCut(t, lt, dur) {
    const op = ease.back(inv(T_OPEN, T_OPEN + .4, t)), kick = hit(t, T_OPEN, 6);
    const [sx, sy] = shake(t, 3 + 26 * kick);
    const z = t < T_OPEN ? lerp(.7, .86, ease.inOut(inv(49.8, T_OPEN, t))) : lerp(.86, .68, ease.out(inv(T_OPEN, T_OPEN + .5, t))) + .06 * inv(T_OPEN + .5, 52.2, t);
    cam(960 + sx, 470 + sy + lerp(60, 0, lt / dur), z, lerp(.05, -.03, lt / dur));
    s.fillStyle = '#d9ceb4'; s.fillRect(-1200, -1200, 4400, 3600); for (let i = 0; i < 8; i++) stroke(s, [[-600, -300 + i * 230], [W + 600, -340 + i * 240]], 'rgba(150,130,100,.4)', 22);
    s.fillStyle = rgrad(s, 960, -330, 80, 400, [[0, '#ffc07a'], [.7, '#d86a24'], [1, '#7a2e10']]); s.beginPath(); s.ellipse(960, -330, 250, 320, 0, 0, TAU); s.fill();
    glow(960, -330, 300, 'rgba(255,150,70,.18)');
    const tipY = lerp(250, 930, ease.inOut(inv(T_CUT, T_CUT + .62, t)));
    if (op <= 0) torso(t, 1);
    else {
      // the opened chest: walls in shadow, the cavity, then the two doors swinging up at the camera
      chestShade(OUTLINE, 265, 1655, .45);
      s.fillStyle = rgrad(s, 960, 590, 20, 560, [[0, '#ffe4a8'], [.5, '#e8903a'], [1, '#6a240a']]); s.beginPath(); s.ellipse(960, 600, 560 * Math.min(1, op + .1), 480, 0, 0, TAU); s.fill();
      glow(960, 580, 800, `rgba(255,180,100,${.3 * clamp(op)})`); glow(960, 560, 220, `rgba(255,245,215,${.25 * clamp(op)})`);
      for (let i = 0; i < 14; i++) {
        const a = hash(i + 50) * TAU, r = Math.sqrt(hash(i + 51)) * 340 * op; const rise = ease.out(inv(51.55 + hash(i + 52) * .5, 52.2, t));
        ember(t, 960 + Math.cos(a) * r, 680 + Math.sin(a) * r * .8 - rise * 80, (90 + hash(i + 53) * 60) * (1 + rise * .7), { mood: i % 3 === 0 ? 'scared' : i % 3 === 1 ? 'happy' : 'calm', look: Math.cos(a) * -.8, seed: i, hue: .3 + hash(i + 54) * .7, lit: .5, eyes: ease.out(inv(T_OPEN + .1 + hash(i) * .3, T_OPEN + .5 + hash(i) * .3, t)) });
      }
      const phi = Math.min(op, 1.12) * 1.0;
      for (const side of [-1, 1]) door(t, side, phi);
    }
    // light pressing out of the cut, then the cut line itself
    if (t >= T_CUT && op <= 0) {
      const pl = .6 + .4 * beatPulse(t, 5);
      f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, [[960, 250], [960, tipY]], `rgba(255,190,110,${.45 * pl})`, 30); stroke(f, [[960, 250], [960, tipY]], `rgba(255,248,225,${.95 * pl})`, 8); f.restore();
      glow(960, tipY, 110, 'rgba(255,230,170,.9)');
      for (let i = 0; i < 6; i++) { const a = hash(Math.floor(t * 24) * 7 + i) * TAU; dot(f, 960 + Math.cos(a) * 36, tipY + Math.sin(a) * 36, 4, 'rgba(255,240,200,.9)'); }
    }
    // the hand: in, cut, away
    const hin = ease.out(inv(49.8, T_CUT, t)), hout = ease.in(inv(T_CUT + .66, T_OPEN - .05, t));
    if (hout < 1) {
      const tx = 960 + (1 - hin) * 800 + hout * 600, ty = tipY + (1 - hin) * 600 + hout * 500;
      const hx = tx + 250, hy = ty + 210;
      stroke(s, [[tx, ty], [hx + 40, hy + 34]], '#b9c3c9', 22); poly(s, [[tx, ty], [tx + 44, ty + 26], [tx + 58, ty + 58]], '#eef4f6');
      glint(tx + 30, ty + 30, 50, .7);
      glove(hx + 60, hy + 50, Math.atan2(ty - hy, tx - hx), 280, .8);
    }
    flash(kick * .55, '#fff4dc');
  }

  // ---------- 4a · the burst (52.2 – 53.83) ----------
  const CHEST = [852, 640];
  function flight(i, tau) {
    const out = ease.out(clamp(tau / .8)), a = -Math.PI / 2 + (hash(i + 1) - .5) * 2.8, R = 300 + hash(i + 2) * 600;
    return [CHEST[0] + Math.cos(a) * R * out + snoise(tau * 1.2 + i, i) * 200 * out, Math.min(880, CHEST[1] + Math.sin(a) * R * out * .7 + snoise(tau * 1.2 + i, i + 99) * 120 * out)];
  }
  function tentTable(t, heat, beam) { // the table in side view, figure lying on it with the chest open
    s.fillStyle = '#1e1009'; s.fillRect(560, 700, 24, 200); s.fillRect(1340, 700, 24, 200); s.fillRect(520, 688, 880, 28);
    s.fillStyle = '#e4d8bc'; s.fillRect(510, 672, 900, 22);
    both(() => { s.translate(960, 636); s.rotate(-Math.PI / 2); f.translate(960, 636); f.rotate(-Math.PI / 2); pouredOne(t, POSE.stand, 0, 0, 240, { heat }); });
    if (beam > 0) { f.save(); f.globalCompositeOperation = 'lighter'; f.fillStyle = vgrad(f, -200, CHEST[1], [[0, 'rgba(255,200,120,0)'], [1, `rgba(255,230,170,${.3 * beam})`]]); f.beginPath(); f.moveTo(CHEST[0] - 40, CHEST[1]); f.lineTo(CHEST[0] + 40, CHEST[1]); f.lineTo(CHEST[0] + 200, -200); f.lineTo(CHEST[0] - 200, -200); f.fill(); f.restore();
      glow(CHEST[0], CHEST[1], 150, `rgba(255,240,200,${.6 * beam})`); }
  }
  // arm angle a → the pole continues along the forearm
  const poleAng = (a) => Math.PI - a;
  function burst(t, lt, dur) {
    const [sx, sy] = shake(t, 6 + 26 * beatPulse(t, 5));
    cam(900 + sx + lt * 50, 560 + sy, 1.28 - lt * .04, .02 * snoise(t * 2, 7));
    const la = .6 * Math.sin(t * 4.3) + .2 * Math.sin(t * 7.1);
    const bulb = [900 + Math.sin(la) * 300, -150 + Math.cos(la) * 300 + 60];
    tentInside(t, bulb[0], bulb[1], 880, .3);
    lamp(900, -150, 300, la, 1);
    researcher(groove(POSE.armsUp, 'bounce', t, .6).pose, 1210, 740, 190, { rim: -1, face: -.3 });
    tentTable(t, .7, 1 - lt * .4);
    const tau = t - 52.2;
    for (let i = 0; i < 32; i++) {
      const tt = tau + .15 - hash(i + 7) * .7; if (tt <= 0) continue;
      const [x, y] = flight(i, tt), [px, py] = flight(i, tt - .07);
      f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, [[px, py], [x, y]], 'rgba(255,180,90,.4)', 10); f.restore();
      ember(t, x, y, 34 + hash(i + 3) * 34, { mood: i % 3 ? 'scared' : 'happy', look: clamp((x - px) / 12, -1, 1), seed: i, hue: hash(i + 5) * .9, lean: clamp((px - x) / 60, -.4, .4), lit: .55 });
    }
    // researchers: ducking, swiping
    const swing = kf(t, [[52.2, -2.9], [BT(72) - .12, -2.9], [BT(72) + .12, -.5], [BT(73) - .12, -2.7], [BT(73) + .12, -.4]], ease.out);
    researcher(groove({ lean: .75, head: .9, aL: [2.6, 3.1], aR: [-2.3, -2.9], lL: [-.9, .6], lR: [.3, .2] }, 'idle', t).pose, 440, 850, 250, { rim: 1, face: .6 });
    const JR = researcher({ lean: -.25 - .15 * Math.sin(swing), head: -.2, aL: [-.6, -.9], aR: [swing, swing - .15], lL: [-.35, .1], lR: [.3, -.1] }, 1470, 850, 260, { rim: -1, face: -.8, glint: .9 });
    net(JR.hdR[0], JR.hdR[1], poleAng(swing - .15), 330, 1.3);
    researcher({ lean: .5, head: .4, aL: [2.4, 2.9], aR: [1.6, 2.4], lL: [-.6, .3], lR: [.4, .1] }, 150, 1060, 420, { rim: 1, face: null, coat: '#141522' });
  }

  // ---------- 4b · one ember, one net (53.83 – 55.3) ----------
  function dodge(t, lt, dur) {
    const T_AF = when('afraid', 53), T_NET = BT(75), T_ZIP = 54.95;
    const duck = kf(t, [[T_NET - .3, 0], [T_NET - .08, 1], [T_NET + .35, 1], [T_NET + .6, 0]], ease.inOut);
    const zip = ease.in(inv(T_ZIP, 55.3, t));
    const ex = 820 + Math.sin(t * 3.1) * 30 - duck * 60 - zip * 900, ey = 600 + Math.sin(t * 5.3) * 18 - duck * 260 - zip * 500;
    const [sx, sy] = shake(t, 4 + 18 * hit(t, T_NET, 6));
    cam(lerp(960, ex, .3) + sx, lerp(540, ey, .3) + sy, 1.12, .03 * Math.sin(t * 1.3));
    tentInside(t, 1300, 150, 1000, .4);
    for (let i = 0; i < 8; i++) { const x = (hash(i + 70) * 2400 - 200 + t * 300 * (hash(i + 71) - .5)) % 2200, y = 150 + hash(i + 72) * 600; ember(t, x, y + Math.sin(t * 4 + i) * 30, 34, { seed: i + 30, mood: 'scared', hue: hash(i) * .8, lit: .6 }); }
    // the researcher lunges in from the right with the net: wind up, sweep on the beat
    const swing = kf(t, [[53.83, -2.3], [T_NET - .3, -3.0], [T_NET + .15, -.9], [55.3, -.7]], ease.inOut);
    const lunge = ease.out(inv(T_NET - .3, T_NET + .1, t));
    const pose = { lean: -.2 - .35 * lunge, head: -.1, aL: [.4, .2], aR: [swing, swing - .1], lL: [-.5 * lunge, .2], lR: [.35, -.1] };
    const J = researcher(pose, 1560 - lunge * 60, 900, 360, { rim: -1, face: -.7, glint: .9 });
    const sc = t < T_AF ? 'happy' : 'scared';
    ember(t, ex, ey, 240 * (1 - .15 * duck), { mood: sc, look: t < T_AF ? .3 * Math.sin(t * 6) : .9 - duck * .9, seed: 3, hue: .25, lit: .4, lean: zip * .5 + (t < T_AF ? .08 * Math.sin(t * 9) : -.1) });
    if (zip > 0) { f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, [[ex + zip * 500, ey + zip * 280], [ex, ey - 80]], 'rgba(255,200,110,.5)', 40); f.restore(); }
    net(J.hdR[0], J.hdR[1], poleAng(swing - .1), 420, 2.6);
    const vel = Math.abs(kf(t + .02, [[53.83, -2.3], [T_NET - .3, -3.0], [T_NET + .15, -.9], [55.3, -.7]], ease.inOut) - swing) / .02;
    if (vel > 3) whip(-Math.min(50, vel * 5), 20);
  }

  // ---------- 5 · jar, jar, jar, jar (55.3 – 58.5) ----------
  function jarSet(t, lx, ly, flying = 6) { // tabletop in the tent, with the chase still going on behind
    tentInside(t, lx, ly, 760, .45);
    s.fillStyle = vgrad(s, 760, H + 300, [[0, '#6b4424'], [1, '#2a170b']]); s.fillRect(-400, 760, W + 800, 900);
    stroke(s, [[-400, 762], [W + 400, 762]], '#e8d2a0', 6);
    for (let i = 0; i < flying; i++) { const u = (t * (.25 + hash(i + 80) * .3) + hash(i + 81)) % 1; glow(lerp(-100, 2000, u), 180 + hash(i + 82) * 380 + Math.sin(t * 5 + i) * 40, 40, 'rgba(255,170,80,.55)'); }
  }
  function jarSmug(t, lt, dur) {
    const T = BT(77), slam = hit(t, T, 7);
    const [sx, sy] = shake(t, 2 + 20 * slam);
    cam(960 + sx, 560 + sy, lerp(1.0, 1.14, lt / dur), -.02);
    jarSet(t, 700, 200);
    const jy = t < T - .28 ? lerp(300, 360, inv(55.3, T - .28, t)) + Math.sin(t * 5) * 8 : lerp(360, 762, ease.in(inv(T - .28, T, t)));
    jarBack(960, jy, 380, 460, { flip: true });
    ember(t, 960, 758, 210, { mood: 'happy', eyes: .5, look: t < T ? lerp(.9, -.3, inv(55.3, T, t)) : kf(t, [[T, -.3], [T + .2, 0], [T + .5, .9]]), seed: 11, hue: .15, lean: t < T + .1 ? .12 : -.06, lit: .4 });
    jarFront(960, jy, 380, 460, { flip: true, lid: false });
    glove(960, jy - 470, Math.PI / 2, 190, .2);
    if (t >= T) { glint(790, 740, 60 * (1 + slam), .8 * slam + .3); for (let i = 0; i < 10; i++) { const a = Math.PI + hash(i + 60) * Math.PI, r = (t - T) * 600; dot(s, 960 + Math.cos(a) * (190 + r), 760 + Math.sin(a) * r * .2, 6, `rgba(240,220,180,${slam})`); } }
  }
  function jarBrood(t, lt, dur) {
    const T = BT(78), snap = hit(t, T, 9);
    cam(880 + lt * 70, 610 + snap * 16, 1.28 - lt * .1, .06);
    jarSet(t, 1300, 150, 4);
    jarBack(820, 800, 320, 440, { tint: 'rgba(120,150,190,.3)' });
    ember(t, 820 + Math.sin(t * 1.3) * 6, 790, 170, { mood: 'calm', eyes: .3, look: -.9, seed: 12, hue: .55, lean: -.2, lit: .4 });
    const ld = kf(t, [[56.5, 260], [T, 0], [T + .08, -14], [T + .2, 0]], ease.in);
    jarFront(820, 800, 320, 440, { lidDy: ld, lidTilt: ld * .002 });
    glove(840, 800 - 440 - ld - 110, Math.PI / 2 - .2, 170, .9);
  }
  function jarFrantic(t, lt, dur) {
    const [sx, sy] = shake(t, 10 + 24 * hit(t, BT(79), 6));
    cam(1000 + sx, 520 + sy, 1.3, -.08 + .05 * Math.sin(t * 20));
    jarSet(t, 900, 100, 3);
    const jx = 960 + Math.sin(t * 31) * 10, tilt = Math.sin(t * 23) * .06;
    jarBack(jx, 820, 340, 470, { tilt });
    const bx = Math.sin(t * 17) * 80, by = -Math.abs(Math.sin(t * 13)) * 160;
    ember(t, jx + bx, 800 + by, 180, { mood: 'scared', eyes: 1, look: Math.sign(bx), seed: 13, hue: .95, lean: -bx / 300, lit: .45 });
    if (Math.abs(bx) > 70) glow(jx + Math.sign(bx) * 165, 720 + by, 80, 'rgba(255,230,190,.8)');
    jarFront(jx, 820, 340, 470, { tilt });
    glove(jx - 290, 640, 0, 190, .5); glove(jx + 40, 820 - 470 - 120, Math.PI / 2 + .2, 170, .6);
  }
  function jarShelf(t, lt, dur) {
    const T = BT(80), clack = hit(t, T, 8);
    const back = ease.inOut(inv(T + .05, 58.5, t));
    cam(960 + back * 40, 540 + clack * 8 - back * 30, lerp(1.25, .62, back), 0);
    fill(s, '#0a0d1e');
    s.fillStyle = rgrad(s, 960, 520, 50, 1100, [[0, 'rgba(120,70,40,.8)'], [1, 'rgba(10,12,30,0)']]); s.fillRect(-1200, -800, W + 2400, H + 1600);
    for (const y of [480, 1000, 1520]) { s.fillStyle = '#2c1c12'; s.fillRect(-1400, y, W + 2800, 34); s.fillStyle = '#4a3020'; s.fillRect(-1400, y, W + 2800, 8); }
    for (let row = -1; row <= 1; row++) for (let i = -6; i <= 6; i++) {
      if (row === 0 && i === 0) continue;
      const x = 960 + i * 300, yb = 1000 + row * 520;
      jarBack(x, yb, 230, 330);
      ember(t, x, yb - 14, 130, { mood: ['calm', 'happy', 'scared', 'fierce'][(i + 6 + row * 3) & 3], look: snoise(t * .7, i + row * 13), seed: i * 5 + row, hue: hash(i * 3 + row + 200), lit: .5 });
      jarFront(x, yb, 230, 330);
    }
    const ty = kf(t, [[57.54, 700], [T, 1000], [T + .06, 994], [T + .14, 1000]], ease.inOut);
    jarBack(960, ty, 230, 330);
    ember(t, 960, ty - 14, 130, { mood: 'fierce', look: -.3 + .6 * Math.sin(t * 2), seed: 77, hue: .7, lit: .5 });
    jarFront(960, ty, 230, 330);
    const away = ease.in(inv(T, T + .25, t)); if (away < 1) glove(960 - 20, ty - 420 - away * 600, Math.PI / 2, 150, .4);
  }

  // ---------- 6 · the archive (58.5 – 61.3) ----------
  // aisle in perspective: X lateral, Y up, Z depth
  const FOC = 820, CAM_H = 170;
  function proj(X, Y, Z, cz) { const d = Z - cz; return d < 10 ? null : [W / 2 + X * FOC / d, H * .5 - (Y - CAM_H) * FOC / d, FOC / d]; }
  const LEVELS = [30, 110, 190, 270, 350];
  function aisle(t, cz, resZ, flare = 0) {
    s.fillStyle = vgrad(s, 0, H, [[0, '#06081a'], [.5, '#0e1230'], [1, '#07060c']]); s.fillRect(-400, -400, W + 800, H + 800);
    const vp = proj(0, 0, cz + 6000, cz), fl = proj(0, 0, resZ, cz);
    poly(s, [[-400, H + 300], [vp[0] - 20, vp[1]], [vp[0] + 20, vp[1]], [W + 400, H + 300]], '#140f0e');
    s.fillStyle = rgrad(s, fl[0], fl[1], 10, 500, [[0, 'rgba(200,120,60,.55)'], [1, 'rgba(40,20,10,0)']]); s.fillRect(-400, H * .45, W + 800, H);
    glow(vp[0], vp[1] - 60, 260, 'rgba(255,170,90,.12)');
    for (const side of [-1, 1]) {
      const X = side * 230;
      for (const Y of LEVELS) { const a = proj(X, Y - 4, cz + 20, cz), b = proj(X, Y - 4, cz + 4000, cz);
        if (a && b) poly(s, [[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + 2], [a[0], a[1] + 16]], '#2a1c14'); }
    }
    // jars, far to near
    const Z0 = Math.floor(cz / 60) * 60;
    for (let Z = Z0 + 3600; Z > cz + 40; Z -= 60) {
      const fog = clamp(1.15 - (Z - cz) / 3000);
      for (const side of [-1, 1]) for (let li = 0; li < LEVELS.length; li++) {
        const p = proj(side * 260, LEVELS[li], Z, cz); if (!p) continue;
        const id = Math.round(Z / 60) * 11 + li * 3 + (side > 0 ? 1 : 0), sz = 50 * p[2];
        const pulse = .55 + .45 * Math.sin(t * (1 + hash(id) * 2) + id), hot = `${255},${140 + hash(id) * 80 | 0},70`;
        if (sz < 30) { dot(s, p[0], p[1] - sz * .3, sz * .2, `rgba(${hot},${.35 + .4 * fog})`); dot(f, p[0], p[1] - sz * .3, Math.max(1, sz * .1), `rgba(${hot},${(.22 * pulse + .5 * flare) * fog})`); continue; }
        jarBack(p[0], p[1], sz * .75, sz);
        const lk = clamp((resZ - Z) / 250, -1, 1) * -side;
        ember(t, p[0], p[1] - sz * .06, sz * .6, { look: lk, seed: id, hue: hash(id + 1), mood: flare > .3 ? 'fierce' : ['calm', 'happy', 'scared', 'fierce'][id & 3], lit: (.3 + .25 * pulse + .5 * flare) * fog });
        if (sz > 50) jarFront(p[0], p[1], sz * .75, sz, { lit: .6 });
      }
    }
  }
  function archiveDolly(t, lt, dur) {
    const cz = lt * 190, rz = cz + 250 + lt * 12, gun = hit(t, when('gun', 60), 4);
    const [sx, sy] = shake(t, 10 * gun);
    cam(960 + Math.sin(t * .8) * 16 + sx, 540 + bob(t) * 4 + sy, 1 + .04 * gun, .01 * Math.sin(t * .6));
    aisle(t, cz, rz, gun);
    const p = proj(-20, 0, rz, cz);
    const g = groove(POSE.stand, 'walk', t);
    researcher(g.pose, p[0] + g.dx, p[1] - 89 * p[2] + g.dy, 100 * p[2], { lantern: .8, hand: 'R', rim: 1, face: null, coat: '#15162a' });
  }

  // ---------- 7/8 · the gaze, the whip, the curtain (61.3 – 66.3) ----------
  // side view of one long shelf wall in world x
  const SHELF_Y = [330, 640, 950], CURTAIN_X = 5100;
  // hide = [x0, x1, yTop]: embers there sit behind a foreground figure, so their light mustn't shine through it
  function shelfWall(t, x0, x1, look, snap, rattle, hop = 0, hide = null) {
    fill(s, '#070917');
    s.fillStyle = vgrad(s, 0, 1100, [[0, '#0a0c1e'], [1, '#161a34']]); s.fillRect(x0 - 200, -300, x1 - x0 + 400, 1700);
    const xe = Math.min(x1 + 200, CURTAIN_X - 700);
    for (const y of SHELF_Y) { s.fillStyle = '#2e1e14'; s.fillRect(x0 - 200, y, xe - x0 + 200, 30); s.fillStyle = '#4c3222'; s.fillRect(x0 - 200, y, xe - x0 + 200, 7); }
    const i0 = Math.floor((x0 - 200) / 175), i1 = Math.ceil((x1 + 200) / 175);
    for (let i = i0; i <= i1; i++) for (let r = 0; r < 3; r++) {
      const x = i * 175 + (r % 2) * 60; if (x > CURTAIN_X - 760) continue;
      const id = i * 3 + r + 500, yb = SHELF_Y[r], jit = rattle * Math.sin(t * 60 + id) * 8, lidDy = rattle * (20 + hash(id) * 30);
      jarBack(x + jit, yb, 140, 200, { tilt: jit * .004 });
      const lk = look(x, id);
      const hidden = hide && x > hide[0] && x < hide[1] && yb > hide[2];
      ember(t, x + jit, yb - 12 - hop * (8 + 10 * hash(id + 4)), 118, { look: lk, seed: id, hue: hash(id + 3), mood: snap > .5 ? (hash(id) < .5 ? 'scared' : 'calm') : ['calm', 'happy', 'scared', 'fierce'][id & 3], lean: lk * (.1 + .25 * snap), eyes: .6 + .4 * snap, lit: hidden ? 0 : .42 });
      jarFront(x + jit, yb, 140, 200, { tilt: jit * .004, lidDy, lidTilt: rattle * (hash(id + 9) - .5) * .5 });
    }
  }
  function curtainStage(t, part) {
    const x = CURTAIN_X;
    s.fillStyle = '#3a2410'; s.fillRect(x - 620, -200, 1240, 1400);
    poly(s, [[x - 560, 1100], [x - 560, 60], [x, -60], [x + 560, 60], [x + 560, 1100], [x + 470, 1100], [x + 470, 120], [x, 30], [x - 470, 120], [x - 470, 1100]], '#c8983e');
    s.fillStyle = '#e8c070'; s.fillRect(x - 520, 980, 1040, 40);
    const gap = part * 380;
    if (gap > 0) { s.fillStyle = rgrad(s, x, 600, 10, 500, [[0, '#fff2cc'], [1, '#e0a040']]); s.fillRect(x - gap - 10, 120, gap * 2 + 20, 870); glow(x, 560, 200 + gap * 2, `rgba(255,220,150,${.4 + .5 * part})`); }
    for (const side of [-1, 1]) for (let k = 0; k < 8; k++) {
      const xa = x + side * (gap + k * 58) + sway(t) * 5 * (k + 1) * (1 - part), w = 58;
      const fold = .5 + .5 * Math.sin(k * 1.9 + t * 2);
      s.fillStyle = `rgb(${120 + fold * 70 | 0},${14 + fold * 16 | 0},${24 + fold * 14 | 0})`;
      s.beginPath(); s.moveTo(xa, 120); s.lineTo(xa + side * w, 120); s.lineTo(xa + side * w * (1 + part * .3), 990); s.lineTo(xa + side * part * 20, 990); s.fill();
    }
    s.fillStyle = '#8a1420'; s.beginPath(); s.moveTo(x - 480, 110); for (let k = 0; k <= 8; k++) s.quadraticCurveTo(x - 480 + (k + .5) * 120, 230, x - 480 + (k + 1) * 120, 110); s.fill();
    for (let k = 0; k < 7; k++) glow(x - 420 + k * 140, 1000, 70, 'rgba(255,200,120,.6)');
  }
  const WHIP_D = 1600;
  function gaze(t, lt, dur) {
    const stop = ease.out(inv(61.3, BT(85) + .3, t)), snap = t >= T_SNAP ? 1 : 0;
    const wk = ease.in(inv(T_WHIP, 64.4, t)), cx = lerp(1060, 1180, clamp(lt / (T_WHIP - 61.3))) + wk * WHIP_D;
    const [sx, sy] = shake(t, 12 * hit(t, T_SNAP, 6));
    cam(cx + sx, 640 + sy, lerp(1.3, 1.05, wk), .012 * Math.sin(t));
    if (wk > 0) whip(Math.min(60, 3 * WHIP_D * Math.pow(inv(T_WHIP, 64.4, t), 2) / (64.4 - T_WHIP) * .012), 0);
    const lanX = 760, lanY = 700;
    const hx = 600 + (1 - stop) * -160;
    shelfWall(t, cx - 1100, cx + 1100, (x, id) => snap ? 1 : clamp((lanX - x) / 400, -1, 1) + snoise(t * .8, id) * .3, snap, 0, hit(t, T_SNAP, 7), [hx - 190, hx + 150, 500]);
    if (snap) glow(cx, 600, 1400, `rgba(255,170,90,${.22 * hit(t, T_SNAP, 5)})`);
    // the researcher stops, lantern raised; turns with the gaze
    const g = groove(mixPose(POSE.stand, POSE.hold, .3 + .5 * stop), stop < 1 ? 'walk' : 'idle', t, 1 - stop * .8);
    const face = t < T_SNAP ? -.6 : lerp(-.6, 1, ease.out(inv(T_SNAP + .1, T_SNAP + .5, t)));
    researcher(g.pose, hx + g.dx, 960 + g.dy, 470, { lantern: 1, hand: 'R', rim: 1, face, glint: .95, coat: '#15162a' });
  }
  function toCurtain(t, lt, dur) {
    const arrive = 1 - Math.pow(1 - clamp(lt / 1.0), 3);
    const cx = 1180 + WHIP_D + WHIP_D * arrive, rat = Math.max(hit(t, BT(90), 7), hit(t, BT(91), 7));
    const push = ease.inOut(inv(65.0, 66.3, t));
    const [sx, sy] = shake(t, 3 + 14 * rat);
    cam(lerp(cx, CURTAIN_X, push) + sx, lerp(600, 560, push) + sy, 1 + ease.in(inv(65.0, 66.3, t)) * 1.5, 0);
    const v = 3 * WHIP_D * Math.pow(1 - clamp(lt / 1.0), 2);
    if (v > 200) whip(Math.min(60, v * .012), 0);
    shelfWall(t, cx - 1100, cx + 1100, () => 1, 1, rat);
    curtainStage(t, ease.inOut(inv(65.9, 66.3, t)) * .35);
  }

  chapter('opened', 44.8, 66.3, [
    [44.8, tentNight, { paint: { boil: 7, bloom: 1.3 } }],
    [46.7, onTable, { paint: { boil: 8, bloom: 1.1 } }],
    [49.8, theCut, { paint: { boil: 8, bloom: 1.3, strokeK: 1.1 } }],
    [52.2, burst, { paint: { boil: 11, bloom: 1.3 } }],
    [53.83, dodge, { paint: { boil: 10, bloom: 1.2, strokeK: 1.15 } }],
    [55.3, jarSmug],
    [56.5, jarBrood],
    [57.02, jarFrantic, { paint: { boil: 12, bloom: 1.2 } }],
    [57.54, jarShelf],
    [58.5, archiveDolly, { paint: { boil: 7, bloom: 1.3 } }],
    [61.3, gaze, { paint: { boil: 8, bloom: 1.25 } }],
    [64.4, toCurtain, { paint: { boil: 9, bloom: 1.3 } }],
  ], { paint: { boil: 9, bloom: 1.2 } });
})();
