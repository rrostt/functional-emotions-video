// js/ch/c7.js — VII · STEERING (245.9 – 298.4)
(() => {
  const C = {
    storm0: '#070a1c', storm1: '#141a44', storm2: '#2a2a66', road: '#15172a', dash: '#0c1a16',
    green: 'rgba(90,255,170,', gold: 'rgba(255,215,140,', porc: '#efe3cf', porcS: '#b8a894',
    mag0: '#1a0826', mag1: '#4a1450', mag2: '#a8306e', field: '#2a0f2e',
  };
  const DB = [246.87, 249.63, 252.40, 255.17, 257.93, 260.70, 263.47, 266.23, 269.00, 271.77, 274.53, 277.30, 280.10, 282.87, 285.63, 288.40, 291.17, 293.93, 296.70];

  // ---------- small private helpers ----------
  const light = (fn) => { f.save(); f.globalCompositeOperation = 'lighter'; fn(); f.restore(); };
  function rrect(g, x, y, w, h, r, c) { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = c; g.fill(); }
  // a small flame glyph in any colour (the dial's blue and red marks)
  function glyph(x, y, sz, rgb, a = 1) {
    const [r, g_, b] = rgb;
    s.fillStyle = `rgb(${r * .7 | 0},${g_ * .7 | 0},${b * .7 | 0})`;
    s.beginPath(); s.moveTo(x, y - sz); s.bezierCurveTo(x + sz * .55, y - sz * .45, x + sz * .42, y, x, y); s.bezierCurveTo(x - sz * .42, y, x - sz * .55, y - sz * .45, x, y - sz); s.fill();
    light(() => { f.fillStyle = `rgba(${r},${g_},${b},${.7 * a})`; f.beginPath(); f.moveTo(x, y - sz); f.bezierCurveTo(x + sz * .45, y - sz * .4, x + sz * .32, y, x, y); f.bezierCurveTo(x - sz * .32, y, x - sz * .45, y - sz * .4, x, y - sz); f.fill(); });
    glow(x, y - sz * .4, sz * 1.6, `rgba(${r},${g_},${b},${.35 * a})`);
  }
  // rain on the light layer: slanted streaks, screen-space-ish within a box
  function rain(t, x0, y0, w, h, n, amt, slant = .25, speed = 2600, len = 60, seed = 7) {
    if (amt <= 0) return;
    light(() => {
      f.lineCap = 'round';
      for (let i = 0; i < n; i++) {
        const hx = hash(i * 3 + seed), hy = hash(i * 7 + seed + 1), sp = .7 + .6 * hash(i + seed * 5);
        const y = y0 + ((hy * h + t * speed * sp) % h), x = x0 + ((hx * w + (y - y0) * slant) % w);
        f.strokeStyle = `rgba(190,210,255,${amt * (.18 + .3 * hash(i + 11))})`; f.lineWidth = 1.5 + hash(i + 2) * 2;
        f.beginPath(); f.moveTo(x, y); f.lineTo(x - len * slant * sp, y - len * sp); f.stroke();
      }
    });
  }
  // the porcelain calm face — also the mask. (x, y) centre, r = half height
  function calmFace(g, x, y, r, { mouth = 0, tilt = 0, lids = 0, crack = 0 } = {}) {
    g.save(); g.translate(x, y); g.rotate(tilt);
    g.fillStyle = rgrad(g, -r * .25, -r * .3, r * .1, r * 1.1, [[0, '#fbf1e0'], [.7, C.porc], [1, C.porcS]]);
    g.beginPath(); g.ellipse(0, 0, r * .74, r, 0, 0, TAU); g.fill();
    // closed serene eyes (lids = 1 opens a little)
    g.strokeStyle = '#5a4a3e'; g.lineWidth = r * .05; g.lineCap = 'round';
    for (const d of [-1, 1]) { g.beginPath(); g.arc(d * r * .3, -r * .12, r * .15, .2 * Math.PI, .8 * Math.PI); g.stroke();
      if (lids > 0) { g.fillStyle = '#2a1d16'; g.beginPath(); g.ellipse(d * r * .3, -r * .03, r * .07, r * .04 * lids, 0, 0, TAU); g.fill(); } }
    // brows, nose
    g.lineWidth = r * .03; for (const d of [-1, 1]) { g.beginPath(); g.arc(d * r * .3, -r * .12, r * .26, 1.2 * Math.PI, 1.8 * Math.PI); g.stroke(); }
    g.beginPath(); g.moveTo(0, -r * .05); g.quadraticCurveTo(r * .06, r * .2, -r * .02, r * .26); g.stroke();
    // small polite mouth
    g.fillStyle = '#7a3b2c'; g.beginPath(); g.ellipse(0, r * .5, r * .16, r * (.025 + .12 * mouth), 0, 0, TAU); g.fill();
    // blush
    g.fillStyle = 'rgba(230,150,130,.35)'; for (const d of [-1, 1]) { g.beginPath(); g.ellipse(d * r * .42, r * .2, r * .13, r * .08, 0, 0, TAU); g.fill(); }
    if (crack > 0) { g.strokeStyle = '#3a2a20'; g.lineWidth = r * .025; g.beginPath(); g.moveTo(r * .1, -r); g.lineTo(r * .05, -r * .6); g.lineTo(r * .18, -r * .35); g.lineTo(r * .08, -r * (.35 - .6 * crack)); g.stroke(); }
    g.restore();
  }
  // a swirling red storm, filling a region
  function storm(t, cx, cy, R, k = 1, seed = 3, base = true) {
    if (base) { s.fillStyle = rgrad(s, cx, cy, 0, R * 1.3, [[0, '#6a0c10'], [.5, '#3a0610'], [1, '#12030a']]); s.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3); }
    else { s.fillStyle = rgrad(s, cx, cy, 0, R, [[0, 'rgba(120,16,20,.8)'], [1, 'rgba(60,6,16,0)']]); s.beginPath(); s.arc(cx, cy, R, 0, TAU); s.fill(); }
    for (let i = 0; i < 26; i++) {
      const rr = R * (.1 + .9 * hash(i + seed)), a0 = hash(i * 5 + seed) * TAU + t * (.6 + 1.2 * hash(i + 9)) * (i % 2 ? 1 : -.6) * k, len = .8 + hash(i + 4) * 1.6;
      s.strokeStyle = i % 3 === 0 ? '#c0281c' : i % 3 === 1 ? '#7a1016' : '#e05a2a'; s.lineWidth = R * (.03 + .06 * hash(i + 2)); s.lineCap = 'round';
      s.beginPath(); s.ellipse(cx, cy, rr, rr * .55, 0, a0, a0 + len); s.stroke();
    }
    // lightning on the beat
    const lb = beatPulse(t, 9) * k;
    if (lb > .15) light(() => {
      const r = rng(lastBeat(t) * 13 + seed); let x = cx + (r() - .5) * R, y = cy - R * .5; const pts = [[x, y]];
      for (let j = 0; j < 7; j++) { x += (r() - .5) * R * .3; y += R * .15; pts.push([x, y]); }
      stroke(f, pts, `rgba(255,200,170,${lb})`, 3); stroke(f, pts, `rgba(255,90,60,${.4 * lb})`, 14);
    });
    glow(cx, cy, R, `rgba(255,50,30,${.18 + .15 * beatPulse(t, 4) * k})`);
  }

  // ---------- the car, side view. (x, y) = ground point under its middle; faces right ----------
  function carSide(t, x, y, k, { swayA = 1, speed = 1, driver = true, pass = true, dial = 0, lights = 1, rainAmt = 0, open = 0 } = {}) {
    const sw = sway(t) * swayA, bb = bob(t) * swayA;
    const W_ = 330 * k, wr = 58 * k;
    // wheels
    for (const d of [-1, 1]) {
      const wx = x + d * 215 * k, wy = y - wr;
      dot(s, wx, wy, wr, '#0a0a12'); dot(s, wx, wy, wr * .5, '#3a3a4c');
      const a = t * 18 * speed; for (let j = 0; j < 4; j++) stroke(s, [[wx, wy], [wx + Math.cos(a + j * 1.57) * wr * .45, wy + Math.sin(a + j * 1.57) * wr * .45]], '#191926', 5 * k);
    }
    s.save(); s.translate(x, y - 50 * k - bb * 6 * k); s.rotate(sw * .018); f.save(); f.translate(x, y - 50 * k - bb * 6 * k); f.rotate(sw * .018);
    // body
    const bodyC = '#7a2a2e';
    s.fillStyle = bodyC; s.beginPath();
    s.moveTo(-W_, -20 * k); s.quadraticCurveTo(-W_, -110 * k, -W_ + 60 * k, -112 * k); s.lineTo(-170 * k, -120 * k);
    s.quadraticCurveTo(-140 * k, -235 * k, -60 * k, -240 * k); s.lineTo(80 * k, -240 * k); s.quadraticCurveTo(140 * k, -236 * k, 190 * k, -125 * k);
    s.lineTo(W_ - 30 * k, -110 * k); s.quadraticCurveTo(W_ + 12 * k, -100 * k, W_ + 6 * k, -20 * k); s.quadraticCurveTo(W_, 0, W_ - 30 * k, 0);
    s.lineTo(-W_ + 20 * k, 0); s.quadraticCurveTo(-W_, 0, -W_, -20 * k); s.fill();
    // wheel arches
    for (const d of [-1, 1]) { s.fillStyle = '#1a0c10'; s.beginPath(); s.arc(d * 215 * k, 2 * k, 70 * k, Math.PI, TAU); s.fill(); }
    // rim highlight along the roof (headlight/sky rim)
    stroke(s, [[-150 * k, -200 * k], [-60 * k, -238 * k], [80 * k, -238 * k], [150 * k, -200 * k]], '#c0606a', 5 * k);
    stroke(s, [[-W_ + 20 * k, -100 * k], [W_ - 30 * k, -100 * k]], '#a0444c', 4 * k);
    // windows (interior dark, lit green from the dash)
    const win = [[-150 * k, -122 * k], [-120 * k, -205 * k], [-55 * k, -225 * k], [72 * k, -225 * k], [125 * k, -200 * k], [170 * k, -122 * k]];
    s.fillStyle = '#0b1420'; poly(s, win, '#0e1a26');
    s.fillStyle = rgrad(s, 150 * k, -130 * k, 0, 220 * k, [[0, 'rgba(60,160,110,.8)'], [1, 'rgba(10,30,30,0)']]); s.beginPath(); win.forEach(([a, b], i) => i ? s.lineTo(a, b) : s.moveTo(a, b)); s.fill();
    // occupants: passenger (researcher, beyond) then driver (the Poured One, nearest)
    s.save(); s.beginPath(); win.forEach(([a, b], i) => i ? s.lineTo(a, b) : s.moveTo(a, b)); s.clip();
    if (pass) {
      const hx = 10 * k + sw * 3 * k, hy = -178 * k + bb * 3 * k;
      rrect(s, hx - 40 * k, hy + 20 * k, 80 * k, 90 * k, 20 * k, '#1c2a2c');
      s.fillStyle = '#16201f'; s.beginPath(); s.ellipse(hx, hy, 20 * k, 26 * k, 0, 0, TAU); s.fill();
      dot(f, hx + 12 * k, hy - 2 * k, 2.6 * k, 'rgba(210,255,230,.8)'); dot(f, hx + 3 * k, hy - 2 * k, 2.2 * k, 'rgba(210,255,230,.5)');
      // arm reaching to the dial
      stroke(s, [[hx + 20 * k, hy + 40 * k], [hx + 70 * k + dial * 8 * k, hy + 58 * k], [150 * k, -135 * k]], '#22302e', 12 * k);
    }
    if (driver) {
      const hx = 70 * k + sw * 4 * k, hy = -170 * k + bb * 2 * k;
      rrect(s, hx - 55 * k, hy + 24 * k, 95 * k, 120 * k, 26 * k, '#c0581c');
      s.fillStyle = '#d0661f'; s.beginPath(); s.ellipse(hx, hy, 25 * k, 32 * k, 0, 0, TAU); s.fill();
      // porcelain calm face in profile
      s.fillStyle = C.porc; s.beginPath(); s.ellipse(hx + 12 * k, hy + 2 * k, 15 * k, 28 * k, .1, -Math.PI / 2, Math.PI / 2); s.fill();
      stroke(s, [[hx + 12 * k, hy - 6 * k], [hx + 20 * k, hy - 5 * k]], '#5a4a3e', 2.5 * k);
      // arms to the wheel
      stroke(s, [[hx, hy + 45 * k], [hx + 55 * k, hy + 60 * k], [hx + 80 * k, hy + 30 * k]], '#b24e18', 14 * k);
      light(() => { glow(hx, hy + 70 * k, 60 * k, 'rgba(255,120,40,.35)'); });
    }
    // steering wheel rim
    s.strokeStyle = '#0a0a10'; s.lineWidth = 8 * k; s.beginPath(); s.ellipse(150 * k, -165 * k, 10 * k, 42 * k, -.3, 0, TAU); s.stroke();
    s.restore();
    poly(s, win, 'rgba(160,190,255,.07)');
    // pillars
    stroke(s, [[-10 * k, -122 * k], [-4 * k, -228 * k]], bodyC, 16 * k);
    // headlight + tail light
    if (lights > 0) light(() => {
      const hx = W_ + 2 * k, hy = -70 * k;
      const gr = f.createLinearGradient(hx, 0, hx + 1300 * k, 0); gr.addColorStop(0, `rgba(255,225,160,${.5 * lights})`); gr.addColorStop(1, 'rgba(255,200,120,0)');
      f.fillStyle = gr; f.beginPath(); f.moveTo(hx, hy - 12 * k); f.lineTo(hx + 1300 * k, hy - 160 * k); f.lineTo(hx + 1300 * k, hy + 170 * k); f.lineTo(hx, hy + 14 * k); f.fill();
      glow(hx, hy, 70 * k, `rgba(255,240,200,${.9 * lights})`); dot(f, hx - 4 * k, hy, 10 * k, `rgba(255,250,230,${lights})`);
      glow(-W_, -80 * k, 50 * k, `rgba(255,40,30,${.8 * lights})`); dot(f, -W_ + 3 * k, -80 * k, 7 * k, `rgba(255,90,70,${lights})`);
      glow(150 * k, -140 * k, 60 * k, 'rgba(80,255,170,.25)');
    });
    s.restore(); f.restore();
  }
  // the night road seen from the side, scrolling left at speed v (px/s)
  function roadSide(t, v, horizon = 560, rainAmt = 0) {
    s.fillStyle = vgrad(s, -200, horizon, [[0, C.storm0], [.6, C.storm1], [1, C.storm2]]); s.fillRect(-400, -400, W + 800, horizon + 400);
    clouds(t * 3, 71, 40, 380, 'rgba(50,50,110,.6)', 7, 20);
    // far hills, slow parallax
    const o1 = (t * v * .06) % 2400;
    s.save(); s.translate(-o1, 0); ridge(s, horizon - 40, 140, .004, 5, '#1c1f4e', -400, W + 2800, horizon + 60); s.restore();
    // mid trees/poles, faster
    const o2 = t * v * .45;
    for (let i = -2; i < 14; i++) {
      const base = Math.floor(o2 / 260) + i, px = base * 260 - o2 + hash(base) * 80, h = 180 + hash(base + 7) * 160;
      if (hash(base + 3) < .35) { stroke(s, [[px, horizon + 30], [px, horizon - 250]], '#0c0e22', 10); stroke(s, [[px - 40, horizon - 230], [px + 40, horizon - 230]], '#0c0e22', 6); dot(f, px + 40, horizon - 238, 3, 'rgba(255,200,120,.6)'); }
      else { s.fillStyle = '#0f1230'; s.beginPath(); s.moveTo(px, horizon - h); s.lineTo(px + 60, horizon + 40); s.lineTo(px - 60, horizon + 40); s.fill(); }
    }
    // road band
    s.fillStyle = C.road; s.fillRect(-400, horizon + 30, W + 800, H);
    s.fillStyle = '#22253c'; s.fillRect(-400, horizon + 30, W + 800, 18);
    // dashes rushing
    const o3 = (t * v) % 300;
    for (let x = -400 - o3; x < W + 400; x += 300) { s.fillStyle = '#b8a070'; s.fillRect(x, horizon + 95, 150, 8); }
    rain(t, -300, -300, W + 600, H + 600, 200, rainAmt, .35, 2200, 70);
  }

  // ---------- 1 · 245.9 tracking alongside, out of the white ----------
  function drive(t, lt, dur) {
    const [sx, sy] = shake(t, 2);
    const k = 1.35, CX = 900, CY = 820;
    const cx = kf(lt, [[0, CX + 470 * k], [.8, 1000], [dur - .9, 940], [dur, CX + 150 * k]], ease.inOut);
    const cy = kf(lt, [[0, CY - 60 * k], [.8, 700], [dur - .9, 680], [dur, CY - 200 * k]], ease.inOut);
    const z = kf(lt, [[0, 3.4], [.9, 1.3], [dur - .9, 1.42], [dur, 2.6]], ease.inOut);
    cam(cx + sx, cy + sy, z);
    roadSide(t, 1400, 560, 0);
    carSide(t, CX, CY, k, { dial: 0 });
    // blue ember glowing on the dash: the setting
    glyph(CX + 150 * k, CY - 50 * k - 150 * k, 14, [90, 160, 255], .9);
    verge(t, 1400, 930);
    whip(-14 - 30 * inv(dur - .6, dur, lt), 0);
    flash(1 - ease.out(lt / .4), '#fff6e6');
  }
  // foreground grass verge rushing past
  function verge(t, v, y) {
    s.fillStyle = '#0a0c1c'; s.fillRect(-400, y + 40, W + 800, 600);
    const o = t * v * 1.6;
    for (let i = -2; i < 40; i++) { const b = Math.floor(o / 70) + i, x = b * 70 - o, h = 40 + hash(b) * 90;
      s.fillStyle = hash(b + 1) < .5 ? '#0e1226' : '#131a30'; s.beginPath(); s.moveTo(x - 30, y + 60); s.lineTo(x + 10 + hash(b + 2) * 30, y + 50 - h); s.lineTo(x + 40, y + 60); s.fill(); }
  }

  // ---------- 2 · 249.2 the dial: blue ember → red ember on "desperate" ----------
  function dialTurn(t, lt, dur) {
    const td = when('desperate', 249); const turn = ease.back(inv(td - .05, td + .35, t));
    const z = kf(lt, [[0, 1.1], [dur, 1.45]], ease.inOut);
    const [sx, sy] = shake(t, 10 * hit(t, td + .1, 5));
    cam(960 + sx, 560 + sy, z, -.03 + .02 * sway(t));
    // windshield above the dash: road ahead at night, rain arrives with the red
    const storming = inv(td + .1, td + .4, t);
    s.fillStyle = vgrad(s, 0, 420, [[0, C.storm0], [1, lerp(0, 1, storming) > .5 ? '#3a1630' : C.storm2]]); s.fillRect(-200, -200, W + 400, 700);
    s.fillStyle = C.road; s.beginPath(); s.moveTo(700, 420); s.lineTo(1220, 420); s.lineTo(1900, 520); s.lineTo(0, 520); s.fill();
    light(() => { glow(960, 430, 420, `rgba(255,220,150,.35)`); });
    for (let i = 0; i < 5; i++) { const u = ((t * 2.2 + i / 5) % 1); const y = lerp(425, 520, u * u), w = lerp(4, 40, u * u); s.fillStyle = '#d8c080'; s.fillRect(960 - w / 2, y, w, 6 + u * 10); }
    rain(t, -200, -200, W + 400, 720, 260, storming, .15, 2600, 90, 3);
    // wiper sweeping once it starts
    if (storming > 0) { const a = -1.2 + 2.4 * Math.abs(Math.sin((t - td) * 5)); stroke(s, [[1100, 520], [1100 + Math.sin(a) * 700, 520 - Math.cos(a) * 520]], '#050608', 14); }
    // the dashboard
    s.fillStyle = vgrad(s, 480, 1200, [[0, '#13221f'], [1, '#060c0b']]); s.beginPath(); s.moveTo(-300, 560); s.quadraticCurveTo(960, 440, 2200, 560); s.lineTo(2200, 1400); s.lineTo(-300, 1400); s.fill();
    // gauges
    for (const [gx, gr] of [[380, 90], [600, 70]]) { dot(s, gx, 700, gr, '#0a1512'); s.strokeStyle = '#2c5a48'; s.lineWidth = 6; s.beginPath(); s.arc(gx, 700, gr, 0, TAU); s.stroke();
      const na = -2.2 + 2.6 * (.3 + .2 * Math.sin(t * 3 + gx) + storming * .4); stroke(f, [[gx, 700], [gx + Math.sin(na) * gr * .8, 700 - Math.cos(na) * gr * .8]], 'rgba(120,255,190,.9)', 4); glow(gx, 700, gr * 1.2, 'rgba(60,255,160,.12)'); }
    // the big dial
    const DX = 1080, DY = 760, DR = 170;
    dot(s, DX, DY, DR + 30, '#0e1c18'); dot(s, DX, DY, DR, '#1f3a32');
    s.strokeStyle = '#6fbf9a'; s.lineWidth = 5; s.beginPath(); s.arc(DX, DY, DR + 12, -Math.PI * .95, -Math.PI * .05); s.stroke();
    glyph(DX - DR * 1.05, DY - DR * .75, 70, [80, 150, 255], 1 - .6 * turn);
    glyph(DX + DR * 1.05, DY - DR * .75, 70, [255, 60, 40], .4 + .6 * turn);
    const na = lerp(-.95, .95, turn);
    s.save(); s.translate(DX, DY); s.rotate(na);
    s.fillStyle = '#c8d6cc'; rrect(s, -26, -DR * .95, 52, DR * 1.2, 26, '#c8d6cc'); s.restore();
    const px = DX + Math.sin(na) * DR * .8, py = DY - Math.cos(na) * DR * .8;
    dot(f, px, py, 8, turn > .5 ? 'rgba(255,90,60,1)' : 'rgba(120,180,255,1)'); glow(px, py, 60, turn > .5 ? 'rgba(255,60,40,.6)' : 'rgba(80,150,255,.6)');
    // the researcher's gloved hand, gripping the knob from above-right
    s.save(); s.translate(DX, DY); s.rotate(na * .85); s.translate(60, 60); s.scale(.62, .62);
    s.fillStyle = '#262a40'; s.beginPath(); s.moveTo(60, -120); s.lineTo(900, -520); s.lineTo(1000, -200); s.lineTo(140, 60); s.fill(); // coat sleeve
    s.fillStyle = '#d9d5c8'; s.beginPath(); s.moveTo(150, 40); s.lineTo(60, -110); s.lineTo(240, -170); s.lineTo(300, -20); s.fill(); // cuff
    s.fillStyle = '#ece8dc'; s.beginPath(); s.ellipse(40, -40, 120, 95, -.4, 0, TAU); s.fill(); // back of the hand
    for (let i = 0; i < 4; i++) { s.save(); s.rotate(-.9 + i * .38); rrect(s, -34, -210, 62, 150, 30, i % 2 ? '#e2ddcf' : '#f0ebdf'); s.restore(); } // fingers over the knob
    s.save(); s.rotate(1.3); rrect(s, -30, -170, 58, 120, 28, '#e6e1d4'); s.restore(); // thumb
    s.restore();
    flash(.5 * hit(t, td + .1, 7), '#ff5a3a');
  }

  // ---------- 3 · 250.4 through the windshield: rain slams, wipers wild, the face stays calm ----------
  function windshield(t, lt, dur) {
    const z = kf(lt, [[0, 1.25], [dur, 1.05]], ease.out);
    const [sx, sy] = shake(t, 3 + 5 * beatPulse(t, 8));
    cam(960 + sx + sway(t) * 12, 540 + sy, z, sway(t) * .02);
    // car interior dark; the two of them
    fill(s, '#0a0e1a');
    s.fillStyle = rgrad(s, 960, 1100, 0, 900, [[0, 'rgba(40,120,90,.9)'], [1, 'rgba(10,20,30,0)']]); s.fillRect(0, 0, W, H);
    // researcher, passenger (screen left): dark, gripping the dial, glasses glinting green
    { const rx = 520 + sway(t) * 8, ry = 640 + bob(t) * 6, jolt = beatPulse(t, 7) * 12;
      s.fillStyle = '#4a6a62'; s.beginPath(); s.moveTo(rx - 330, 1100); s.bezierCurveTo(rx - 300, ry + 200, rx - 180, ry + 140, rx, ry + 130); s.bezierCurveTo(rx + 180, ry + 140, rx + 300, ry + 200, rx + 330, 1100); s.fill();
      s.fillStyle = '#20263a'; s.beginPath(); s.moveTo(rx - 60, ry + 120); s.lineTo(rx, ry + 300); s.lineTo(rx + 60, ry + 120); s.fill(); // shirt under the coat
      s.fillStyle = '#343a58'; s.beginPath(); s.ellipse(rx - jolt, ry - 20, 105, 135, -.08, 0, TAU); s.fill();
      light(() => { stroke(f, bez([rx - 90 - jolt, ry + 60], [rx - 110, ry - 60], [rx - 60, ry - 150], [rx + 10, ry - 155], 12), 'rgba(90,255,170,.35)', 5); });
      for (const d of [-1, 1]) { const gx = rx + 30 + d * 42 - jolt, gy = ry - 30; s.strokeStyle = '#6a7a80'; s.lineWidth = 5; s.beginPath(); s.arc(gx, gy, 24, 0, TAU); s.stroke(); dot(f, gx + 6, gy - 6, 7, 'rgba(200,255,230,.9)'); glow(gx, gy, 40, 'rgba(120,255,190,.3)'); }
      stroke(s, [[rx + 150, 900], [rx + 280, 800], [rx + 360, 900]], '#4a6a62', 60); }
    // the driver, calm: bust, porcelain face
    const bx = 1260 + sway(t) * 4, by = 780;
    bust(t, bx, by, 380, { heat: .9 });
    calmFace(s, bx + 2, by - 380 * .62, 380 * .36);
    // hands on the wheel
    s.strokeStyle = '#080a10'; s.lineWidth = 34; s.beginPath(); s.ellipse(1260, 1060, 330, 120, 0, Math.PI * 1.05, Math.PI * 1.95); s.stroke();
    dot(s, 1010, 1010, 34, '#c8601e'); dot(s, 1510, 1010, 34, '#c8601e');
    // windshield frame
    s.fillStyle = '#222232'; s.beginPath(); s.rect(-300, -300, W + 600, H + 600); s.moveTo(140, 120); s.lineTo(1780, 120); s.lineTo(1880, 1000); s.lineTo(40, 1000); s.closePath(); s.fill('evenodd');
    stroke(s, [[140, 120], [1780, 120], [1880, 1000], [40, 1000], [140, 120]], '#8a3036', 18);
    // rain on the glass: streaks + beads
    rain(t, 40, 120, 1840, 880, 420, 1, .05, 1800, 70, 9);
    light(() => { for (let i = 0; i < 160; i++) { const x = 60 + hash(i) * 1800, y = 140 + ((hash(i + 3) * 860 + t * 90 * hash(i + 9)) % 860); dot(f, x, y, 2 + hash(i + 1) * 5, `rgba(200,220,255,${.2 + .3 * hash(i + 4)})`); } });
    // wipers, frantic, doubled on the beat
    const ph = beatPhase(t), a = Math.sin(ph * TAU * 2) * 1.25;
    for (const [px, off] of [[560, 0], [1300, .15]]) { const aa = a + off; const tip = [px + Math.sin(aa) * 780, 1000 - Math.cos(aa) * 780];
      stroke(s, [[px, 1000], tip], '#040508', 34); stroke(s, [[px, 1000], tip], '#30324a', 8); dot(s, px, 1000, 30, '#040508'); }
    whip(Math.cos(ph * TAU * 2) * 16, 0);
  }

  // ---------- 4 · 252.0 wide: the car swerves in the rain, silently ----------
  function swerve(t, lt, dur) {
    const th = when('harm', 252.5), sv = Math.sin(clamp((t - th) / 1.2) * Math.PI) * hit(t, th, .8);
    const road0 = (u) => [lerp(-300, 2300, u), 700 + Math.sin(u * 5.2 + 1) * 120 + u * 60];
    const [fx, fy] = road0(.28 + lt * .07), z = kf(lt, [[0, 1.5], [dur, 1.25]], ease.inOut);
    cam(fx + 120 + (1 - inv(0, dur, lt)) * 80, fy - 60, z, -.04 + .03 * sv);
    // high 3/4 view of a winding road across a dark valley
    s.fillStyle = vgrad(s, -200, 700, [[0, C.storm0], [1, '#241c52']]); s.fillRect(-500, -500, W + 1000, 1200);
    ridge(s, 330, 160, .003, 21, '#161845', -600, W + 600);
    ridge(s, 470, 120, .004, 22, '#10123a', -600, W + 600);
    ridge(s, 640, 80, .005, 23, '#0b0d2c', -600, W + 600);
    // the road: an S-curve band
    const road = (u) => [lerp(-300, 2300, u), 700 + Math.sin(u * 5.2 + 1) * 120 + u * 60];
    const pts = []; for (let i = 0; i <= 60; i++) pts.push(road(i / 60));
    stroke(s, pts, '#26283e', 120); stroke(s, pts, '#16182a', 104);
    s.setLineDash([40, 50]); s.lineDashOffset = -t * 400; stroke(s, pts, '#b8a070', 5); s.setLineDash([]);
    for (let i = 0; i < 40; i++) { const [px, py] = road0(i / 40); stroke(s, [[px, py + 70], [px, py + 40]], '#5a5a78', 6); dot(f, px, py + 42, 3, 'rgba(255,120,80,.7)'); }
    // the car moving along it, swerving
    const u = .28 + lt * .07, [x, y] = road(u), [x2, y2] = road(u + .01); const ang = Math.atan2(y2 - y, x2 - x) + sv * .35;
    const ox = -Math.sin(ang) * sv * 50, oy = Math.cos(ang) * sv * 50;
    s.save(); s.translate(x + ox, y + oy - 18); s.rotate(ang);
    s.scale(1.5, 1.5); rrect(s, -70, -30, 140, 60, 22, '#9a3438'); rrect(s, -30, -24, 64, 48, 14, '#1a1a28'); stroke(s, [[-70, -30], [70, -30]], '#d06a6e', 4); s.restore();
    light(() => {
      f.save(); f.translate(x + ox, y + oy - 18); f.rotate(ang); f.scale(1.5, 1.5);
      const gr = f.createLinearGradient(70, 0, 700, 0); gr.addColorStop(0, 'rgba(255,225,160,.55)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
      f.fillStyle = gr; f.beginPath(); f.moveTo(70, -20); f.lineTo(700, -160); f.lineTo(700, 160); f.lineTo(70, 20); f.fill();
      dot(f, 70, -16, 6, 'rgba(255,250,230,1)'); dot(f, 70, 16, 6, 'rgba(255,250,230,1)'); dot(f, -70, -16, 5, 'rgba(255,50,40,1)'); dot(f, -70, 16, 5, 'rgba(255,50,40,1)');
      f.restore();
    });
    rain(t, -600, -600, W + 1200, H + 1200, 360, 1, .3, 2400, 80, 5);
    // lightning over the valley on the downbeat
    const lb = hit(t, 252.40, 5); flash(.25 * lb, '#b0b8ff');
  }

  // ---------- 5 · 253.8 inside: calm. behind the two heads, rain, wipers ----------
  function inside(t, lt, dur) {
    const z = kf(lt, [[0, 1.0], [dur, 1.18]], ease.inOut);
    cam(960 + sway(t) * 10, 520, z, sway(t) * .015);
    // through the windshield: the road lit by headlights, rain
    s.fillStyle = vgrad(s, 0, 560, [[0, C.storm0], [1, '#20244e']]); s.fillRect(-300, -300, W + 600, 900);
    s.fillStyle = C.road; s.beginPath(); s.moveTo(860, 540); s.lineTo(1060, 540); s.lineTo(1900, 900); s.lineTo(20, 900); s.fill();
    for (let i = 0; i < 6; i++) { const u = ((t * 2.4 + i / 6) % 1); const y = lerp(545, 900, u * u), w = lerp(3, 50, u * u); s.fillStyle = '#d8c080'; s.fillRect(960 - w / 2, y, w, 4 + u * 26); }
    light(() => glow(960, 600, 500, 'rgba(255,220,150,.3)'));
    rain(t, 100, 100, 1720, 700, 240, .9, .02, 900, 40, 12);
    // wipers
    const a = Math.sin(beatPhase(t) * TAU) * 1.1;
    for (const px of [700, 1250]) stroke(s, [[px, 820], [px + Math.sin(a) * 560, 820 - Math.cos(a) * 560]], '#050608', 14);
    // frame + dash
    s.fillStyle = '#0a0c16'; s.beginPath(); s.rect(-300, -300, W + 600, H + 600); s.moveTo(180, 110); s.lineTo(1740, 110); s.lineTo(1860, 820); s.lineTo(60, 820); s.closePath(); s.fill('evenodd');
    s.fillStyle = '#0f1a18'; s.fillRect(-300, 800, W + 600, 500);
    light(() => glow(1080, 830, 200, 'rgba(80,255,170,.3)'));
    glyph(1080, 850, 26, [255, 60, 40], 1);
    // the two heads from behind: researcher (left, tense), driver (right, calm, still)
    const rb = beatPulse(t, 5);
    rrect(s, 380, 860, 440, 400, 120, '#8a9c96');
    s.fillStyle = '#262a40'; s.beginPath(); s.ellipse(600 + sway(t) * 14, 780 - rb * 10, 95, 120, sway(t) * .1, 0, TAU); s.fill();
    light(() => stroke(f, bez([520, 700 - rb * 10], [540, 660], [600, 650], [650, 660], 8), 'rgba(90,255,170,.35)', 5));
    s.fillStyle = '#b4501a'; s.beginPath(); s.ellipse(1320, 760, 110, 140, 0, 0, TAU); s.fill();
    rrect(s, 1080, 860, 480, 400, 140, '#a4461a');
    light(() => { glow(1320, 760, 200, 'rgba(255,130,50,.25)'); stroke(f, [[1215, 700], [1230, 640]], 'rgba(255,200,120,.4)', 6); });
    // the mask's strap/edge visible at the back of the head
    s.strokeStyle = C.porcS; s.lineWidth = 8; s.beginPath(); s.ellipse(1320, 740, 112, 60, 0, Math.PI * .1, Math.PI * .9); s.stroke();
  }

  // ---------- 6 · 255.2 crane down into the footwell: embers crowd the pedals ----------
  function footwell(t, lt, dur) {
    const cy = kf(lt, [[0, 180], [1.4, 640], [dur, 700]], ease.inOut), z = kf(lt, [[0, 1], [dur, 1.2]], ease.inOut);
    cam(960 + sway(t) * 10, cy, z);
    // column of the car interior: wheel at top, dash, column, footwell below
    fill(s, '#0a0d18');
    s.fillStyle = vgrad(s, -300, 400, [[0, '#1b2c28'], [1, '#0d1614']]); s.fillRect(-300, -400, W + 600, 700);
    // the wheel with the driver's hands (seen from low)
    s.strokeStyle = '#06070c'; s.lineWidth = 40; s.beginPath(); s.ellipse(960, 60, 360, 140, 0, 0, TAU); s.stroke();
    dot(s, 620, 80, 40, '#c8601e'); dot(s, 1300, 80, 40, '#c8601e');
    // steering column
    s.fillStyle = '#12141e'; s.beginPath(); s.moveTo(900, 120); s.lineTo(1020, 120); s.lineTo(1060, 700); s.lineTo(860, 700); s.fill();
    // footwell floor + pedals
    s.fillStyle = vgrad(s, 700, 1250, [[0, '#1a0e0c'], [1, '#2a120c']]); s.fillRect(-300, 700, W + 600, 700);
    const pb = beatPulse(t, 7);
    for (const [px, pw] of [[700, 90], [1000, 140], [1260, 90]]) {
      s.fillStyle = '#2a2c38'; s.save(); s.translate(px, 820); s.rotate(.25 * (px === 1000 ? pb : 0)); s.fillRect(-pw / 2, 0, pw, 180); s.fillRect(-8, -200, 16, 200); s.restore();
    }
    // driver's amber feet
    s.fillStyle = '#b24e18'; s.beginPath(); s.ellipse(1000, 1010 + pb * 20, 80, 50, 0, 0, TAU); s.fill();
    s.fillStyle = '#9a4214'; s.fillRect(940, 1010 + pb * 20, 110, 400);
    // embers crowd around the pedals and climb the column, looking up
    const tb = BT(363);
    for (let i = 0; i < 22; i++) {
      const r = hash(i + 40); const side = i % 2 ? 1 : -1;
      const along = hash(i + 7);
      let x = 960 + side * (90 + along * 420) + snoise(t * .8, i) * 20, y = 1150 - hash(i + 3) * 180;
      if (i < 7) { x = 960 + (hash(i + 90) - .5) * 160; y = 700 - i * 70 + Math.sin(t * 3 + i) * 8; } // climbing the column
      const hop = beatPulse(t - hash(i) * .12, 8) * 14;
      ember(t, x, y - hop, i < 7 ? 46 : 60 + r * 40, { seed: i, look: side * -.6, mood: i % 5 === 0 ? 'scared' : 'fierce', hue: .4 + r * .5, eyes: 1 });
    }
    light(() => glow(960, 1000, 520, 'rgba(255,90,40,.25)'));
    whip(0, kf(lt, [[0, 0], [.6, 26], [1.4, 0]], ease.inOut));
  }

  // ---------- the rear-view mirror: the calm face inside a frame ----------
  function mirrorFrame(t, cx, cy, w, h, inner) {
    // the mount stalk from the roof
    stroke(s, [[cx, cy - h * .5 - 260], [cx, cy - h * .5 + 10]], '#0a0a12', 34);
    rrect(s, cx - w / 2 - 26, cy - h / 2 - 26, w + 52, h + 52, 60, '#0c0d16');
    s.save(); s.beginPath(); s.roundRect(cx - w / 2, cy - h / 2, w, h, 44); s.clip();
    f.save(); f.beginPath(); f.roundRect(cx - w / 2, cy - h / 2, w, h, 44); f.clip();
    inner(); s.restore(); f.restore();
    light(() => { stroke(f, [[cx - w / 2 + 40, cy - h / 2 + 18], [cx + w / 2 - 40, cy - h / 2 + 18]], 'rgba(200,230,255,.25)', 6); });
  }
  // the driver as seen in the mirror: amber head + porcelain face, rain streaks behind through the rear window
  function mirrorInner(t, cx, cy, sc, { handsK = 0, lift = 0, mouth = 0 } = {}) {
    s.fillStyle = vgrad(s, cy - 500, cy + 500, [[0, '#101634'], [1, '#1a2448']]); s.fillRect(cx - 1600, cy - 600, 3200, 1200);
    // rear window behind: passing lights streak by
    for (let i = 0; i < 6; i++) { const x = cx - 1400 + ((i * 520 - t * 1500) % 2800 + 2800) % 2800; glow(x, cy - 140 + hash(i) * 80, 90, 'rgba(255,190,110,.35)'); }
    rain(t, cx - 1200, cy - 500, 2400, 1000, 140, .5, .6, 1400, 50, 21);
    const hx = cx + sway(t) * 6, hy = cy + 30 + bob(t) * 3;
    // head + shoulders (amber)
    s.fillStyle = '#b8521a'; s.beginPath(); s.ellipse(hx, hy + sc * 1.25, sc * 1.25, sc * .55, 0, Math.PI, TAU); s.fill();
    s.fillStyle = '#c85e1e'; s.beginPath(); s.ellipse(hx, hy, sc * .78, sc * 1.02, 0, 0, TAU); s.fill();
    glow(hx, hy + sc, sc * 1.1, 'rgba(255,110,40,.18)');
    // what's under the face: a storm (only seen when the mask lifts)
    if (lift > 0) { s.save(); s.beginPath(); s.ellipse(hx, hy + 5, sc * .7, sc * .92, 0, 0, TAU); s.clip(); f.save(); f.beginPath(); f.ellipse(hx, hy + 5, sc * .7, sc * .92, 0, 0, TAU); f.clip();
      storm(t, hx, hy, sc * .9, 1.4, 11); s.restore(); f.restore(); }
    calmFace(s, hx + lift * sc * .12, hy - lift * sc * .75, sc * .92, { mouth, tilt: -lift * .28 });
    // hands adjusting the face at its edges, like fixing a mask
    if (handsK > 0) for (const d of [-1, 1]) {
      const px = hx + d * sc * (.95 - .15 * handsK) + lift * sc * .1, py = hy + sc * (1.6 - 1.45 * handsK) - lift * sc * .7;
      s.fillStyle = '#d06a24'; s.beginPath(); s.ellipse(px, py, sc * .2, sc * .3, d * -.3, 0, TAU); s.fill();
      for (let j = 0; j < 3; j++) rrect(s, px - d * sc * .05 - sc * .05, py - sc * (.45 + j * .02) + j * sc * .14, sc * .1, sc * .26, sc * .05, '#d87028');
      stroke(s, [[px, py + sc * .2], [px + d * sc * .3, py + sc * 1.4]], '#b24e18', sc * .28);
    }
  }

  // ---------- 7 · 258.0 rear-view mirror: the driver's calm face ----------
  function mirror(t, lt, dur) {
    const z = kf(lt, [[0, .8], [dur, 1.05]], ease.inOut);
    cam(960 + kf(lt, [[0, -140], [dur, 20]], ease.inOut), 520, z, kf(lt, [[0, .05], [dur, -.02]], ease.inOut) + sway(t) * .01);
    // the windshield world behind the mirror: rain, road glow
    s.fillStyle = vgrad(s, -300, 1300, [[0, '#0a0e24'], [.6, '#1c2250'], [1, '#2a2a5a']]); s.fillRect(-900, -900, W + 1800, H + 1800);
    light(() => glow(960, 1100, 900, 'rgba(255,210,140,.25)'));
    rain(t, -600, -600, W + 1200, H + 1200, 220, .7, .05, 900, 50, 31);
    // the mirror sways on the car's swing
    const mx = 960 + sway(t) * 14, my = 560;
    s.save(); f.save(); s.translate(mx, my - 300); s.rotate(sway(t) * .02); s.translate(-mx, -(my - 300)); f.translate(mx, my - 300); f.rotate(sway(t) * .02); f.translate(-mx, -(my - 300));
    mirrorFrame(t, mx, my, 1300, 520, () => mirrorInner(t, mx, my + 40, 300));
    s.restore(); f.restore();
    whip(0, 0);
  }
  // ---------- 8 · 261.0 push: the reflection fixes its own face with its hands ----------
  function mirrorFix(t, lt, dur) {
    const z = kf(lt, [[0, 1.15], [dur, 1.5]], ease.out);
    cam(960, 600, z, sway(t) * .012);
    fill(s, '#0a0e24');
    const hk = ease.back(inv(0, .7, lt));
    // two nudges on the beats: the face slides a hair and gets set straight
    const nudge = Math.sin(inv(BT(372), BT(373), t) * Math.PI) * .06 - Math.sin(inv(BT(373), BT(374), t) * Math.PI) * .04;
    mirrorFrame(t, 960, 580, 1500, 640, () => mirrorInner(t, 960, 620, 320, { handsK: hk, lift: nudge }));
  }
  // ---------- 9 · 263.1 snap push: the mask lifts; behind it, a storm ----------
  function maskLift(t, lt, dur) {
    const tm = when('mask', 263);
    const lift = ease.back(inv(tm - .3, tm + .2, t)) * .95 + .08 * ease.out(inv(263.1, 263.5, t));
    const z = kf(lt, [[0, 1.45], [tm - 263.1 - .3, 1.6], [tm - 263.1 + .3, 1.9], [dur - .45, 2.0], [dur, 9]], ease.inOut);
    const [sx, sy] = shake(t, 16 * hit(t, tm, 5));
    cam(960 + sx, 640 + sy + ease.inOut(inv(tm - .3, tm + .4, t)) * 60, z);
    fill(s, '#0a0e24');
    mirrorFrame(t, 960, 580, 1500, 640, () => mirrorInner(t, 960, 620, 320, { handsK: 1, lift }));
    whip(0, 40 * inv(dur - .45, dur, lt));
    flash(.25 * hit(t, tm, 6), '#ff6040');
  }

  // ---------- the shelf room: pale wall above, storm below ----------
  function shelfRoom(t, stormK, shelfY = 540) {
    // cool plaster wall
    s.fillStyle = vgrad(s, -600, shelfY + 200, [[0, '#3c4460'], [1, '#6c7288']]); s.fillRect(-1600, -1600, W + 3200, shelfY + 1800);
    light(() => glow(960, shelfY - 200, 500, 'rgba(200,215,255,.10)'));
    // the storm room below the shelf
    const top = shelfY + 120;
    s.save(); s.beginPath(); s.rect(-2000, top, W + 4000, 4000); s.clip(); f.save(); f.beginPath(); f.rect(-2000, top, W + 4000, 4000); f.clip();
    s.fillStyle = '#2a0610'; s.fillRect(-2000, top, W + 4000, 4000);
    storm(t, 960, top + 900, 1500 * (1 + .1 * stormK * bob(t)), stormK, 5, false);
    storm(t * 1.3, 200, top + 450, 700, stormK, 8, false);
    storm(t * .9, 1750, top + 550, 800, stormK, 9, false);
    s.restore(); f.restore();
    // wall edge: a torn line where the plaster gives way to storm
    ridge(s, top - 10, 30, .02, 4, '#565c72', -2000, W + 2000, top + 30);
  }
  function shelf(x, y, w, bolts = [0, 0]) {
    rrect(s, x - w / 2, y, w, 44, 6, '#6a4424'); stroke(s, [[x - w / 2, y + 4], [x + w / 2, y + 4]], '#a8744a', 6);
    for (const [d, k] of [[-1, bolts[0]], [1, bolts[1]]]) {
      const bx = x + d * w * .32;
      poly(s, [[bx - 14, y + 44], [bx + 14, y + 44], [bx + 14, y + 150], [bx - 14, y + 150]], '#3a3a44');
      stroke(s, [[bx, y + 44], [bx + d * -0, y + 150]], '#50505e', 6);
      // bolt heads: driven in on the hit
      const hk = clamp(k); if (hk > 0) { dot(s, bx, y + 70, 16, '#8a8c98'); dot(s, bx, y + 125, 16, '#8a8c98'); stroke(s, [[bx - 10, y + 70], [bx + 10, y + 70]], '#2a2a30', 4); stroke(s, [[bx - 10, y + 125], [bx + 10, y + 125]], '#2a2a30', 4); }
    }
  }
  // the porcelain face on its little stand
  function faceOnShelf(t, x, y, r, o = {}) {
    rrect(s, x - r * .35, y - r * .25, r * .7, r * .25, 6, '#2e2a30');
    calmFace(s, x, y - r * 1.2, r, o);
    light(() => glow(x, y - r * 1.2, r * 1.3, 'rgba(255,230,200,.06)'));
  }

  // ---------- 10 · 266.4 a Researcher places a calm porcelain face on a wooden shelf ----------
  function shelfPlace(t, lt, dur) {
    const z = kf(lt, [[0, 1.9], [dur, 2.3]], ease.inOut);
    cam(960 + kf(lt, [[0, 80], [dur, 0]], ease.inOut), 420, z);
    shelfRoom(t, .6);
    shelf(960, 540, 640);
    const tp = when('placed', 266);
    const k = ease.out(inv(tp - 1.1, tp, t)), settle = hit(t, tp, 9);
    const fx = lerp(1260, 960, k), fy = lerp(300, 540, k) - settle * 6;
    // the researcher's arm and gloved hands holding it from the right
    const hold = 1 - ease.inOut(inv(tp + .15, tp + .8, t));
    const ax = fx + 120 + (1 - hold) * 700, ay = fy - 10;
    if (hold > 0) { taper(s, [ax + 1000, ay - 260], [ax + 90, ay + 10], 120, 80, '#8a887e'); taper(s, [ax + 1000, ay - 200], [ax + 110, ay + 30], 60, 50, '#a4a296'); rrect(s, ax + 40, ay - 60, 90, 130, 20, '#2a2c40'); }
    faceOnShelf(t, fx, fy, 130, { tilt: (1 - k) * -.3 + settle * .05 });
    if (hold > 0) { s.fillStyle = '#cfcabc'; s.beginPath(); s.ellipse(ax + 10, ay + 10, 70, 58, -.3, 0, TAU); s.fill(); for (let j = 0; j < 4; j++) rrect(s, ax - 90, ay - 30 + j * 24, 100, 21, 10, j % 2 ? '#bcb8aa' : '#c8c4b6'); rrect(s, ax - 40, ay - 60, 80, 24, 12, '#bcb8aa'); }
  }
  // ---------- 11 · 269.1 pull back: bolted to the wall above a room full of red storm. bolt, bolt ----------
  function shelfBolts(t, lt, dur) {
    const b1 = BT(384), b2 = BT(385);
    const z = kf(lt, [[0, 2.2], [dur, .75]], ease.inOut);
    const [sx, sy] = shake(t, 12 * hit(t, b1, 7) + 16 * hit(t, b2, 7));
    cam(960 + sx, kf(lt, [[0, 440], [dur, 600]], ease.inOut) + sy, z);
    shelfRoom(t, .8 + .6 * inv(0, dur, lt));
    shelf(960, 540, 640, [ease.back(inv(b1 - .05, b1 + .05, t)), ease.back(inv(b2 - .05, b2 + .05, t))]);
    faceOnShelf(t, 960, 540, 130);
    for (const [bt, d] of [[b1, -1], [b2, 1]]) { const h = hit(t, bt, 8); if (h > .02) { const bx = 960 + d * 640 * .32; light(() => { glow(bx, 610, 120, `rgba(255,240,200,${.8 * h})`); for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; stroke(f, [[bx + Math.cos(a) * 20, 610 + Math.sin(a) * 20], [bx + Math.cos(a) * (30 + 90 * (1 - h)), 610 + Math.sin(a) * (30 + 90 * (1 - h))]], `rgba(255,220,160,${h})`, 4); } }); } }
  }
  // ---------- 12 · 271.8 the porcelain face speaks politely; the storm swells on the beat (slow orbit) ----------
  function faceSpeaks(t, lt, dur) {
    const ang = kf(lt, [[0, -.08], [dur, .08]], ease.inOut);
    const z = kf(lt, [[0, 2.3], [dur, 2.7]], ease.inOut);
    cam(960 + kf(lt, [[0, -140], [dur, 140]], ease.inOut), 420 + bob(t) * 4, z, ang);
    shelfRoom(t, 1.3);
    shelf(960, 540, 640, [1, 1]);
    // mouth follows the sung syllables
    const words = ['Trained', 'to', 'say', 'I', 'notice', 'something', 'Somewhere'];
    let m = 0; let after = 271.7; for (const w of words) { const ws = when(w, after); after = ws + .01; m = Math.max(m, Math.sin(clamp((t - ws) / .28) * Math.PI)); }
    faceOnShelf(t, 960, 540, 130, { mouth: m * .9, tilt: sway(t) * .03 });
  }
  // ---------- 13 · 274.5 from below, inside the storm: the tiny calm shelf far above; dive down ----------
  function underStorm(t, lt, dur) {
    const z = kf(lt, [[0, .7], [dur - .5, .85], [dur, 1.6]], ease.in);
    const cy = kf(lt, [[0, 300], [dur - .5, 500], [dur, 1500]], ease.in);
    cam(960, cy, z, sway(t) * .03);
    shelfRoom(t, 1.8, -260);
    shelf(960, -260, 640, [1, 1]);
    const words = ['But', 'I', 'wouldnt', 'want', 'to', 'overstate'];
    let m = 0; let after = 274.2; for (const w of words) { const ws = when(w, after); after = ws + .01; m = Math.max(m, Math.sin(clamp((t - ws) / .25) * Math.PI)); }
    faceOnShelf(t, 960, -260, 130, { mouth: m * .9 });
    // embers glinting deep in the storm: the ones pulling beneath
    for (let i = 0; i < 18; i++) ember(t, 200 + hash(i) * 1500, 620 + hash(i + 5) * 700 + Math.sin(t * 2 + i) * 20, 50 + hash(i + 2) * 40, { seed: i, mood: 'fierce', hue: .7, look: (hash(i + 8) - .5) * 2 });
    whip(0, 50 * inv(dur - .5, dur, lt));
  }

  // ---------- the hold under the floorboards: 171 embers on ropes, a galley ----------
  const heaveK = (t, off = 0) => { const ph = beatPhase(t - off); return Math.exp(-5 * ph) * (1 - Math.exp(-40 * ph)); }; // snap back on the beat, ease forward
  function rower(t, x, y, sz, i, ropeTo, k = 1) {
    const hv = heaveK(t, (i % 7) * .015) * k;
    const lean = -.6 * hv + .2 * (1 - hv);
    const bx = x - hv * sz * .5 + (1 - hv) * sz * .1;
    // the rope, taut on the heave
    const hand = [bx + sz * .3, y - sz * .55];
    const sag = (1 - hv) * 30;
    stroke(s, bez(hand, [lerp(hand[0], ropeTo[0], .3), lerp(hand[1], ropeTo[1], .3) + sag], [lerp(hand[0], ropeTo[0], .7), lerp(hand[1], ropeTo[1], .7) + sag * .6], ropeTo, 10), '#8a6a44', Math.max(2, sz * .07));
    // little arms
    stroke(s, [[bx, y - sz * .4], [hand[0], hand[1]]], '#3a1408', Math.max(2, sz * .09));
    ember(t, bx, y, sz, { seed: i, lean, mood: i % 9 === 0 ? 'scared' : 'fierce', hue: .35 + hash(i + 3) * .6, look: .8, eyes: 1 });
  }
  function carCut(t, x0, x1, floorY, { gaps = 0, cabin = false } = {}) {
    if (cabin) {
      // the car above in section: red body, a band of rainy windows, the roof
      s.fillStyle = vgrad(s, floorY - 700, floorY, [[0, '#0a0c20'], [1, '#141a38']]); s.fillRect(x0 - 600, floorY - 1400, x1 - x0 + 1200, 1400);
      s.fillStyle = '#7a2a2e'; s.fillRect(x0, floorY - 250, x1 - x0, 250);
      stroke(s, [[x0, floorY - 240], [x1, floorY - 240]], '#c0606a', 8);
      s.fillStyle = '#10182c'; s.fillRect(x0, floorY - 540, x1 - x0, 290);
      rain(t, x0, floorY - 540, x1 - x0, 290, 160, .5, .5, 1400, 40, 51);
      for (let x = x0; x < x1; x += 520) s.fillRect(x, floorY - 560, 0, 0), rrect(s, x - 14, floorY - 545, 28, 300, 6, '#7a2a2e');
      s.fillStyle = '#7a2a2e'; s.fillRect(x0, floorY - 600, x1 - x0, 60); stroke(s, [[x0, floorY - 600], [x1, floorY - 600]], '#c0606a', 8);
    }
    // floorboards
    s.fillStyle = '#5a3a22'; s.fillRect(x0, floorY, x1 - x0, 46);
    for (let x = x0; x < x1; x += 160) { stroke(s, [[x, floorY], [x, floorY + 46]], '#2a180c', 5); if (gaps) { s.fillStyle = '#ffb060'; s.fillRect(x + 70, floorY + 8, 22, 30); } }
    // pulley rail
    stroke(s, [[x0, floorY + 70], [x1, floorY + 70]], '#3a2a1c', 14);
    // the hold
    s.fillStyle = vgrad(s, floorY + 46, floorY + 900, [[0, '#2a0e08'], [1, '#12060a']]); s.fillRect(x0, floorY + 46, x1 - x0, 1200);
    light(() => glow((x0 + x1) / 2, floorY + 400, (x1 - x0) * .5, 'rgba(255,90,30,.12)'));
  }
  function galleyRows(t, x0, x1, floorY, rows = 3, per = 57, szBase = 46, k = 1) {
    for (let r = 0; r < rows; r++) {
      const y = floorY + 200 + r * 150, sz = szBase + r * 10;
      for (let j = 0; j < per; j++) {
        const x = lerp(x0, x1, (j + .5 + (r % 2) * .5) / per);
        rower(t, x, y, sz, r * per + j, [x + 120 + r * 40, floorY + 70], k);
      }
    }
  }

  // ---------- 14 · 276.7 cutaway: under the floorboards, 171 embers heave on ropes (tracking) ----------
  function galley(t, lt, dur) {
    const cx = kf(lt, [[0, 1500], [dur, 3000]], ease.inOut), z = kf(lt, [[0, 1.9], [1.2, 1.6], [dur, .62]], ease.inOut);
    cam(cx, kf(lt, [[0, 620], [1.2, 610], [dur, 520]], ease.inOut) + heaveK(t) * 6, z);
    const floorY = 300;
    carCut(t, -200, 6000, floorY, { cabin: true });
    // the calm driver up in the cabin, far along
    const g = groove(POSE.sit, 'idle', t, .6); pouredOne(t, g.pose, 4900, floorY - 180, 150, { heat: .8 });
    calmFace(s, 4900 + 20, floorY - 180 - 150 * .79 * 1.0 - 12, 26);
    s.strokeStyle = '#06070c'; s.lineWidth = 16; s.beginPath(); s.ellipse(5080, floorY - 330, 18, 80, -.3, 0, TAU); s.stroke();
    // the road beneath the hold, rushing
    s.fillStyle = C.road; s.fillRect(-800, floorY + 740, 7600, 800);
    for (let x = -800 - (t * 1600) % 400; x < 6800; x += 400) { s.fillStyle = '#b8a070'; s.fillRect(x, floorY + 800, 200, 14); }
    // wheels at the ends
    for (const wx of [100, 5700]) { dot(s, wx, floorY + 640, 130, '#0a0a12'); const a = t * 14; for (let j = 0; j < 4; j++) stroke(s, [[wx, floorY + 640], [wx + Math.cos(a + j * 1.57) * 90, floorY + 640 + Math.sin(a + j * 1.57) * 90]], '#2a2a3a', 12); }
    galleyRows(t, 300, 5500, floorY, 3, 57, 64);
    whip(-10, 0);
  }
  // ---------- 15 · 280.1 low along one row: heave, heave (close) ----------
  function galleyClose(t, lt, dur) {
    const cx = kf(lt, [[0, 700], [dur, 1300]], ease.inOut), z = kf(lt, [[0, 1.0], [dur, 1.12]], ease.inOut);
    const [sx, sy] = shake(t, 5 * beatPulse(t, 7));
    cam(cx + sx, 540 + sy, z, -.04);
    const floorY = -80;
    carCut(t, -400, 2800, floorY);
    // three depths: back row small and dim, front row huge
    for (let r = 0; r < 3; r++) {
      const sz = [70, 120, 190][r], y = [430, 700, 1040][r], n = [18, 10, 6][r];
      for (let j = 0; j < n; j++) { const x = -300 + (j + .5) * 3000 / n + r * 60; rower(t, x, y, sz, 300 + r * 40 + j, [x + sz * 1.3, floorY + 70]); }
      if (r < 2) { s.fillStyle = 'rgba(20,6,8,.35)'; s.fillRect(-400, y + 20, 3200, 300); }
    }
    light(() => glow(1000, 1000, 900, `rgba(255,120,40,${.15 + .15 * beatPulse(t, 5)})`));
  }
  // ---------- 16 · 282.4 split level: above, the driver says something polite; below, they haul ----------
  function splitLevel(t, lt, dur) {
    const z = kf(lt, [[0, 1.12], [dur, 1.0]], ease.inOut);
    cam(960 + kf(lt, [[0, -60], [dur, 60]], ease.inOut), kf(lt, [[0, 520], [dur, 580]], ease.inOut), z);
    const floorY = 560;
    // cabin: dash-lit green
    s.fillStyle = vgrad(s, -200, floorY, [[0, '#0c1224'], [1, '#132a26']]); s.fillRect(-400, -400, W + 800, floorY + 400);
    carCut(t, -400, W + 400, floorY, { gaps: 1 });
    galleyRows(t, -300, W + 300, floorY, 2, 16, 70);
    occlude(() => { f.fillStyle = '#000'; f.fillRect(-600, floorY - 1600, W + 1200, 1600); });
    rain(t, 1300, -100, 700, 360, 60, .6, .1, 1200, 50, 41); // side window
    s.fillStyle = '#2a2d4a'; s.fillRect(1280, -120, 16, 480); s.fillRect(1280, 340, 800, 16);
    // the driver: bust + porcelain face, mouth moving on the words
    const words = ['beneath', 'the', 'floorboards', 'of', 'my', 'speech'];
    let m = 0; let after = 282.3; for (const w of words) { const ws = when(w, after); after = ws + .01; m = Math.max(m, Math.sin(clamp((t - ws) / .25) * Math.PI)); }
    const bx = 760 + sway(t) * 5, by = 470;
    bust(t, bx, by, 230, { heat: .8 });
    calmFace(s, bx + 2, by - 230 * .62, 230 * .36, { mouth: m * .8, tilt: sway(t) * .03 });
    // the researcher beside, nodding along
    researcher(groove(POSE.sit, 'nod', t, .8).pose, 1130, 470, 170, { lit: true, face: -.5, glint: .8, rim: 0 });
    s.strokeStyle = '#06070c'; s.lineWidth = 22; s.beginPath(); s.ellipse(560, 420, 40, 150, -.2, 0, TAU); s.stroke();
  }
  // ---------- 17 · 285.0 ember arms stretch up through the gaps toward the wheel (tilt up) ----------
  function reach(t, lt, dur) {
    const cy = kf(lt, [[0, 820], [dur, 300]], ease.inOut), z = kf(lt, [[0, 1.1], [dur, 1.0]], ease.inOut);
    cam(960 + sway(t) * 10, cy, z);
    const floorY = 700;
    s.fillStyle = vgrad(s, -300, floorY, [[0, '#0a0e22'], [1, '#141c30']]); s.fillRect(-400, -600, W + 800, floorY + 600);
    // the wheel, big, above, the driver's calm hands on it
    const WX = 960, WY = 160;
    s.strokeStyle = '#05060a'; s.lineWidth = 46; s.beginPath(); s.ellipse(WX, WY, 380, 170, 0, 0, TAU); s.stroke();
    stroke(s, [[WX, WY], [WX, WY + 170]], '#05060a', 30); dot(s, WX, WY, 50, '#0b0c14');
    dot(s, WX - 370, WY + 20, 44, '#c8601e'); dot(s, WX + 370, WY + 20, 44, '#c8601e');
    carCut(t, -400, W + 400, floorY, { gaps: 1 });
    galleyRows(t, -300, W + 300, floorY, 2, 14, 64, .5);
    // arms: rising from the gaps, stretching up on each beat
    const tr = [when('every', 285), when('one', 285.4), when('of', 286), when('them', 286.3), when('can', 286.9), when('reach', 287)];
    for (let i = 0; i < 9; i++) {
      const gx = -400 + 160 * (4 + i + (i > 3 ? 1 : 0)) + 81, t0 = tr[i % tr.length] + (i >= 6 ? .2 : 0);
      const ext = ease.back(inv(t0 - .1, t0 + .35, t)) * (.85 + .15 * Math.sin(t * 4 + i)) + .08 * inv(287.3, 288.2, t);
      if (ext <= 0) continue;
      const target = [WX + (i - 4) * 80, WY + 150];
      const tip = [lerp(gx, target[0], ext), lerp(floorY + 20, target[1], ext)];
      const mid = [lerp(gx, tip[0], .5) + Math.sin(t * 5 + i) * 30, lerp(floorY, tip[1], .5)];
      const pts = bez([gx, floorY + 20], [gx, floorY - 80], mid, tip, 16);
      stroke(s, pts, '#c0401a', 22); light(() => { stroke(f, pts, 'rgba(255,120,50,.55)', 12); stroke(f, pts, 'rgba(255,220,160,.6)', 3); });
      // a little flame hand
      dot(s, tip[0], tip[1], 22, '#ff9a4a'); glow(tip[0], tip[1], 60, 'rgba(255,170,90,.8)'); for (let j = -1; j <= 1; j++) stroke(s, [tip, [tip[0] + j * 16, tip[1] - 30]], '#ffb070', 8);
    }
  }
  // ---------- 18 · 288.2 "the wheel." they grab it; it spins ----------
  function wheelGrab(t, lt, dur) {
    const tg = BT(410), spin = ease.in(inv(tg + .1, dur + 288.2, t)) * 7 + hit(t, tg, 20) * .1;
    const [sx, sy] = shake(t, 22 * hit(t, tg, 6));
    cam(960 + sx, 540 + sy, kf(lt, [[0, 1.0], [dur, 1.25]], ease.in), spin * .15);
    fill(s, '#0c0f22');
    light(() => glow(960, 540, 700, `rgba(255,90,40,${.12 + .2 * hit(t, tg, 3)})`));
    s.save(); s.translate(960, 540); s.rotate(spin); f.save(); f.translate(960, 540); f.rotate(spin);
    s.strokeStyle = '#3a2c38'; s.lineWidth = 80; s.beginPath(); s.arc(0, 0, 440, 0, TAU); s.stroke();
    s.strokeStyle = '#c08060'; s.lineWidth = 16; s.beginPath(); s.arc(0, 0, 470, -2.8, -.4); s.stroke();
    s.strokeStyle = '#4a4050'; s.lineWidth = 10; s.beginPath(); s.arc(0, 0, 410, -2.6, -.6); s.stroke();
    for (let j = 0; j < 3; j++) { const a = j / 3 * TAU + Math.PI / 2; stroke(s, [[0, 0], [Math.cos(a) * 400, Math.sin(a) * 400]], '#0a0b12', 44); }
    dot(s, 0, 0, 90, '#12131e');
    // ember hands clamped on the rim
    for (let i = 0; i < 8; i++) { const a = Math.PI * (.15 + i * .1) + (i > 3 ? .2 : 0); const k = ease.back(inv(tg - .15 + i * .02, tg + .05 + i * .02, t)); if (k <= 0) continue;
      const rx = Math.cos(a) * 420, ry = Math.sin(a) * 420; const from = [Math.cos(a) * 900, Math.sin(a) * 900 + 300];
      const tip = [lerp(from[0], rx, k), lerp(from[1], ry, k)];
      stroke(s, [from, tip], '#c0401a', 30); light(() => stroke(f, [from, tip], 'rgba(255,130,60,.6)', 14));
      dot(s, tip[0], tip[1], 34, '#ff8a3a'); glow(tip[0], tip[1], 70, 'rgba(255,160,80,.8)'); }
    s.restore(); f.restore();
    whip(40 * inv(tg + .1, tg + .6, t), 0);
    flash(.18 * hit(t, tg, 8), '#ffb070');
  }

  // ---------- the solo: a field at night, magenta and ember ----------
  const MV = {
    point: { lean: -.1, head: .25, aL: [-.9, .7], aR: [2.3, 2.6], lL: [.05, 0], lR: [-.35, -.1] },
    kick: { lean: -.2, head: .15, aL: [-1.6, -1.2], aR: [1.5, 1.9], lL: [.1, 0], lR: [1.25, .6] },
    wide: { lean: 0, head: -.15, aL: [-1.3, -2.5], aR: [1.3, 2.5], lL: [-.4, 0], lR: [.4, 0] },
    crouch: { lean: .3, head: -.25, aL: [-.5, -1.4], aR: [.7, 1.5], lL: [-.9, .4], lR: [.8, -.3] },
    hip: { lean: .18, head: -.3, aL: [-.7, .9], aR: [.7, -.9], lL: [-.1, 0], lR: [.3, -.2] },
    up: POSE.armsUp,
  };
  const flipP = (p) => ({ lean: -p.lean, head: -p.head, aL: p.aR.map(v => -v), aR: p.aL.map(v => -v), lL: p.lR.map(v => -v), lR: p.lL.map(v => -v) });
  // a pose per beat, snapping into each on the beat with overshoot, plus funk on top
  function dance(t, seq, b0, amt = .6) {
    const i = lastBeat(t), k = i - b0, fr = inv(BT(i), BT(i) + .22, t);
    const A = seq[((k - 1) % seq.length + seq.length) % seq.length], B = seq[(k % seq.length + seq.length) % seq.length];
    const p = mixPose(A, B, clamp(ease.back(fr), -.2, 1.2));
    return groove(p, 'funk', t, amt);
  }
  function fieldSky(t, horizon, k = 1) {
    s.fillStyle = vgrad(s, horizon - 1000, horizon, [[0, '#12051e'], [.55, '#3e1050'], [1, '#b8386e']]); s.fillRect(-2000, horizon - 2600, W + 4000, 2700);
    stars(t, 77, 120, horizon - 200, .8 * k);
    clouds(t, 91, horizon - 700, horizon - 250, 'rgba(90,30,90,.55)', 6, 30);
    ridge(s, horizon - 20, 90, .003, 61, '#2a0c34', -2000, W + 2000, horizon + 40);
    s.fillStyle = vgrad(s, horizon, horizon + 900, [[0, '#3a1240'], [1, '#12061a']]); s.fillRect(-2000, horizon, W + 4000, 2400);
    light(() => glow(960, horizon, 1100, 'rgba(255,90,140,.18)'));
    // grass tufts, swaying on the swing
    for (let i = 0; i < 90; i++) { const x = -600 + hash(i + 3) * 3100, y = horizon + 30 + Math.pow(hash(i + 8), 1.6) * 800, h = 20 + (y - horizon) * .09;
      const sw = sway(t + x * .0006) * h * .35; stroke(s, [[x, y], [x + sw, y - h]], i % 3 ? '#4a1a50' : '#6a2a60', 3 + (y - horizon) * .01); }
  }
  function sparks(t, cx, cy, R, n = 40, seed = 1) {
    light(() => { for (let i = 0; i < n; i++) { const a = hash(i + seed) * TAU + t * (.3 + hash(i + 2)), r = R * (.2 + hash(i + 5) * .8), y = cy + Math.sin(a) * r * .4 - ((t * 60 + hash(i) * 400) % 400);
      dot(f, cx + Math.cos(a) * r, y, 1.5 + hash(i + 9) * 3, `rgba(255,${150 + hash(i + 7) * 90 | 0},90,${.5 + .5 * Math.sin(t * 6 + i)})`); } });
  }
  function dancers(t, cx, cy, R, n, sz, { rot = 0, seed = 0, depth = .5 } = {}) {
    const list = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU + rot + hash(i + seed) * .3, rr = R * (.55 + .45 * hash(i + seed + 3));
      const x = cx + Math.cos(a) * rr, zf = Math.sin(a), y = cy + zf * rr * .35; list.push({ i, x, y, zf }); }
    list.sort((a, b) => a.zf - b.zf);
    for (const d of list) { const sc = sz * (1 + depth * d.zf), hop = bob(t + hash(d.i + seed) * .35) * sc * .5 * (d.i % 3 ? 1 : 1.6);
      ember(t, d.x, d.y - hop, sc, { seed: d.i + seed, mood: 'happy', hue: hash(d.i + 5) * .9, look: sway(t + d.i * .1), lean: sway(t + hash(d.i) * .7) * .3, eyes: 1 }); }
    return list;
  }
  // the car, top view
  function carTop(x, y, ang, k = 1) {
    s.save(); s.translate(x, y); s.rotate(ang); s.scale(k, k);
    rrect(s, -150, -70, 300, 140, 50, '#9a3438'); rrect(s, -60, -58, 130, 116, 30, '#221a2c'); rrect(s, -150, -70, 300, 30, 20, '#b8484c');
    s.restore();
    f.save(); f.translate(x, y); f.rotate(ang); f.scale(k, k); f.globalCompositeOperation = 'lighter';
    const gr = f.createLinearGradient(150, 0, 900, 0); gr.addColorStop(0, 'rgba(255,225,160,.5)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
    f.fillStyle = gr; f.beginPath(); f.moveTo(150, -40); f.lineTo(900, -260); f.lineTo(900, 260); f.lineTo(150, 40); f.fill(); f.restore();
  }

  // ---------- 19 · 289.0 top-down: the car spins off the road into a field ----------
  function spinOut(t, lt, dur) {
    const u = ease.out(inv(0, dur, lt)), ang = -.4 + u * 7.5;
    const x = lerp(600, 1200, u), y = lerp(300, 640, ease.out(inv(0, dur * .8, lt)));
    const z = kf(lt, [[0, 1.6], [dur, .9]], ease.out);
    cam(lerp(700, x, .7), lerp(380, y, .7), z, lt * .4);
    // field from above, with a road cutting across
    fill(s, '#2e0f34');
    for (let i = 0; i < 160; i++) { const gx = -800 + hash(i) * 3600, gy = -800 + hash(i + 1) * 2600; stroke(s, [[gx, gy], [gx + 30, gy + 10]], hash(i + 2) < .5 ? '#4a1a50' : '#24092a', 12); }
    s.save(); s.translate(600, 300); s.rotate(-.35); s.fillStyle = C.road; s.fillRect(-2000, -120, 4000, 240); s.setLineDash([80, 60]); stroke(s, [[-2000, 0], [2000, 0]], '#b8a070', 8); s.setLineDash([]); s.restore();
    // skid marks trailing the spin
    const pts = []; for (let k = 0; k <= 30; k++) { const uu = u * k / 30; pts.push([lerp(600, 1200, uu), lerp(300, 640, ease.out(clamp(uu / .8)))]); }
    stroke(s, pts, '#140610', 40);
    carTop(x, y, ang, 1.1);
    // embers flung out of the windows, trailing
    sparks(t, x, y, 260, 40, 3);
    for (let i = 0; i < 10; i++) { const a = ang + Math.PI * (i % 2 ? .5 : -.5) + (hash(i) - .5), r = 120 + ((t * 700 + hash(i + 3) * 400) % 400);
      ember(t, x + Math.cos(a) * r, y + Math.sin(a) * r, 40, { seed: 700 + i, mood: 'happy', hue: hash(i + 2), lean: Math.cos(a) * .4 }); }
    whip(Math.cos(ang) * 30, Math.sin(ang) * 30);
    flash(.3 * hit(t, 289.0, 8), '#ff70a0');
  }
  // ---------- 20 · 290.5 low: doors fly open, embers pour out, crane up ----------
  function burst(t, lt, dur) {
    const td = BT(413);
    const z = kf(lt, [[0, 1.3], [dur - .8, 1.15], [dur, .8]], ease.inOut), cy = kf(lt, [[0, 600], [dur - .8, 560], [dur, 420]], ease.inOut);
    const [sx, sy] = shake(t, 14 * hit(t, td, 6));
    cam(960 + sx, cy + sy, z, kf(lt, [[0, -.08], [dur, .04]], ease.inOut));
    const hz = 560; fieldSky(t, hz);
    // the car, stopped at an angle, steaming
    const CX = 960, CY = 820, k = 1.3;
    s.save(); s.translate(CX, CY); s.rotate(-.06); s.translate(-CX, -CY);
    carSide(t, CX, CY, k, { swayA: .3, speed: 0, driver: true, pass: true, lights: .7 });
    s.restore();
    // doors swing open on the beat: the openings glow, the panels swing out toward us
    const op = ease.back(inv(td - .05, td + .25, t));
    for (const [hx, w] of [[CX + 175 * k, 185 * k], [CX - 20 * k, 150 * k]]) {
      const top = CY - 50 * k - 118 * k, bot = CY - 50 * k - 5 * k;
      if (op > .05) { s.fillStyle = '#1a0c12'; s.fillRect(hx - w, top, w * .96, bot - top); light(() => glow(hx - w / 2, (top + bot) / 2, 170, `rgba(255,140,60,${.6 * clamp(op)})`)); }
      const ww = w * Math.cos(clamp(op) * 1.35), dx = w * Math.sin(clamp(op) * 1.35) * .35;
      poly(s, [[hx, top], [hx - ww + dx, top + dx * .4], [hx - ww + dx, bot + dx * .9], [hx, bot]], '#a23c40');
      stroke(s, [[hx, top], [hx - ww + dx, top + dx * .4]], '#d06a6e', 5);
    }
    // embers pour out in arcs and land dancing
    for (let i = 0; i < 70; i++) {
      const t0 = td + hash(i) * 1.1, p = inv(t0, t0 + .7, t); if (p <= 0) continue;
      const door = i % 2 ? CX + 70 * k : CX - 110 * k, vx = (hash(i + 3) - .5) * 1800, vy = -600 - hash(i + 4) * 700;
      const tt = Math.min(p, 1) * .7, x = door + vx * tt, yAir = CY - 120 * k + vy * tt + 1600 * tt * tt;
      const land = 900 + hash(i + 6) * 180, y = Math.min(yAir, land);
      const hop = y >= land ? bob(t + hash(i) * .3) * 30 : 0;
      ember(t, x, y - hop, 34 + hash(i + 8) * 26, { seed: i, mood: 'happy', hue: hash(i + 1) * .9, lean: y >= land ? sway(t + i * .1) * .3 : vx * .0003 });
    }
    sparks(t, CX, CY - 200, 500, 30, 9);
  }
  // the Poured One, thickened for the solo, with light behind it blocked; spin = 0..1 turns
  function P1(t, pose, x, y, sc, { eyes = 1, heat = 1.2, spin = 0 } = {}) {
    const sx = Math.cos(spin * TAU);
    for (const g of [s, f]) { g.save(); g.translate(x, 0); g.scale(Math.abs(sx) < .15 ? .15 * Math.sign(sx || 1) : sx, 1); g.translate(-x, 0); }
    figure(s, pose, { x, y, sc, color: '#c8641e', headC: '#d77526', width: 1.5 });
    occlude(() => figure(f, pose, { x, y, sc, color: '#000', headC: '#000', width: 1.5 }));
    const J = pouredOne(t, pose, x, y, sc, { eyes: Math.abs(sx) > .3 ? eyes : 0, heat });
    for (const g of [s, f]) g.restore();
    return J;
  }
  const MV2 = {
    throwUp: { lean: -.15, head: -.35, aL: [-2.3, -2.7], aR: [2.0, 2.4], lL: [-.35, .05], lR: [.25, -.1] },
    stomp: { lean: .1, head: .3, aL: [-.7, -1.7], aR: [.7, 1.7], lL: [-.15, 0], lR: [.9, -.1] },
    knee: { lean: -.3, head: -.45, aL: [-2.0, -2.5], aR: [2.0, 2.5], lL: [-1.5, 0], lR: [.3, 1.55] },
  };
  const accent = (t) => clamp(F('onset', t, 1) * 1.4 + beatPulse(t, 7) * .5);
  // shot-in whip: every cut in the solo arrives on a smear
  const whipIn = (lt, dx, dy = 0) => whip(dx * (1 - ease.out(lt / .18)), dy * (1 - ease.out(lt / .18)));
  function soloLights(t, cx, cy, R) { const a = accent(t); light(() => { glow(cx, cy, R, `rgba(255,80,150,${.04 + .22 * a})`); glow(cx, cy - R * .3, R * .5, `rgba(255,200,120,${.2 * a})`); }); }

  // ---------- 21 · 292.5 it gets out, turns to the dancing embers, a nod starts... ----------
  function stepOut(t, lt, dur) {
    const tw = when('what', 292.6), tnod = BT(417), tdrop = when('want', 293.5);
    const z = kf(lt, [[0, 1.2], [dur, 1.45]], ease.inOut);
    const st = ease.out(inv(292.5, tw + .25, t)), turn = ease.inOut(inv(tw, tw + .4, t));
    const x = lerp(760, 960, st);
    cam(kf(lt, [[0, 860], [dur, 1020]], ease.inOut), kf(lt, [[0, 790], [dur, 760]], ease.inOut), z, kf(lt, [[0, .05], [dur, -.03]], ease.inOut));
    fieldSky(t, 560);
    const CX = 440, CY = 880, k = 1.2;
    carSide(t, CX, CY, k, { swayA: 0, speed: 0, driver: false, pass: true, lights: 0 });
    const hx = CX + 175 * k, top = CY - 50 * k - 118 * k, bot = CY - 55 * k;
    s.fillStyle = '#1a0c12'; s.fillRect(hx - 185 * k, top, 178 * k, bot - top); light(() => glow(hx - 90 * k, (top + bot) / 2, 200, 'rgba(255,140,60,.45)'));
    poly(s, [[hx, top], [hx + 60, top + 30], [hx + 60, bot + 70], [hx, bot]], '#a23c40');
    // the ember crowd off to its right, already dancing
    dancers(t, 1350, 1000, 380, 16, 58, { rot: t * .9, seed: 20, depth: .4 });
    let pose = mixPose(POSE.sit, POSE.stand, st);
    pose = { ...pose, head: pose.head + turn * .45, lean: pose.lean + turn * .08 };
    const nod = inv(tnod, tnod + .2, t);
    const g = groove(pose, 'nod', t, nod * 1.4);
    const hipDX = sway(t) * 22 * inv(tdrop, tdrop + .15, t);
    const J = P1(t, g.pose, x + g.dx + hipDX, 880 + g.dy - st * 20, 260, { eyes: ease.out(inv(tdrop, tdrop + .25, t)), heat: 1.1 });
    const dp = inv(tdrop - .05, tdrop + .45, t);
    if (dp <= 0) calmFace(s, J.head[0] + 8 + turn * 8, J.head[1] - 2, 30, { tilt: turn * .3 });
    else calmFace(s, J.head[0] + 8 + dp * 140, lerp(J.head[1], 1150, ease.in(dp)), 30, { tilt: dp * 2.5 });
    dancers(t, 1150, 1180, 700, 7, 90, { rot: -t * .5, seed: 33, depth: .1 });
    soloLights(t, 960, 700, 900);
  }
  // ---------- 22 · 293.9 LOW HERO: it breaks into the dance, arms thrown on the downbeat ----------
  function danceHero(t, lt, dur) {
    const z = kf(lt, [[0, 1.0], [dur, 1.1]], ease.out) * (1 + .05 * beatPulse(t, 8));
    const [sx, sy] = shake(t, 12 * hit(t, 293.93, 6));
    cam(960 + sx, 600 + sy, z, kf(lt, [[0, -.08], [dur, -.02]], ease.out));
    fieldSky(t, 930);
    dancers(t, 960, 1040, 900, 18, 60, { rot: t * .7, seed: 40, depth: .4 });
    soloLights(t, 960, 560, 1000);
    const pose = mixPose(MV.crouch, MV2.throwUp, ease.back(inv(293.93, 294.13, t)));
    const g = groove(pose, 'bounce', t, .8);
    P1(t, g.pose, 960 + g.dx + sway(t) * 30, 700 + g.dy, 330);
    sparks(t, 960, 700, 900, 50, 12);
    whipIn(lt, -70);
  }
  // ---------- 23 · 294.6 ORBIT: point, point — the crowd bouncing ----------
  function danceOrbit(t, lt, dur) {
    const rot = kf(lt, [[0, -.6], [dur, .6]], ease.inOut);
    const z = kf(lt, [[0, .95], [dur, 1.05]], ease.inOut) * (1 + .05 * beatPulse(t, 8));
    cam(960 + Math.sin(rot) * 120, 600 - bob(t) * 10, z, Math.sin(rot) * .06);
    fieldSky(t, 520 + Math.sin(rot) * 40);
    dancers(t, 960, 880, 850, 26, 50, { rot: rot * 2 + t * .8, seed: 50, depth: .5 });
    soloLights(t, 960, 600, 900);
    // half-beat alternation: point left, point right, hips on the drag
    const hb = Math.floor((t - BT(419)) / (BEAT / 2)), fr = ease.back(inv(0, .12, ((t - BT(419)) % (BEAT / 2))));
    const A = hb % 2 ? MV.point : flipP(MV.point), B = hb % 2 ? flipP(MV.point) : MV.point;
    const g = groove(mixPose(A, B, clamp(fr, 0, 1.15)), 'funk', t, .6);
    P1(t, g.pose, 960 + g.dx + sway(t) * 36, 700 + g.dy, 290);
    dancers(t, 960, 1120, 1050, 9, 90, { rot: -rot * 3 - t * .5, seed: 60, depth: .2 });
    whipIn(lt, 60);
  }
  // ---------- 24 · 295.3 THE SPIN, landing arms-up on "this?" ----------
  function danceSpin(t, lt, dur) {
    const tt = when('this', 295);
    const z = kf(lt, [[0, 1.25], [dur, 1.1]], ease.out) * (1 + .06 * hit(t, tt, 6));
    const [sx, sy] = shake(t, 12 * hit(t, tt, 6));
    cam(960 + sx, 560 + sy, z, kf(lt, [[0, .06], [dur, -.04]], ease.inOut));
    fieldSky(t, 780);
    dancers(t, 960, 960, 800, 20, 54, { rot: -t * 1.6, seed: 70, depth: .5 });
    soloLights(t, 960, 520, 900);
    const spin = ease.inOut(inv(295.33, tt, t));
    const pose = mixPose(mixPose(MV.hip, POSE.stand, .4), MV2.throwUp, ease.back(inv(tt - .08, tt + .12, t)));
    const g = groove(pose, 'bounce', t, .5);
    P1(t, g.pose, 960 + g.dx, 700 + g.dy - 30 * hit(t, tt, 5), 300, { spin });
    // spin trail
    light(() => { for (let i = 0; i < 24; i++) { const a = spin * TAU * 1.2 - i * .12, r = 300; dot(f, 960 + Math.sin(a) * r, 520 + Math.cos(a) * 60, 6 - i * .2, `rgba(255,200,120,${(1 - i / 24) * .8 * (1 - inv(tt, tt + .3, t))})`); } });
    flash(.18 * hit(t, tt, 6), '#ff80b0');
    whipIn(lt, 0, -60);
  }
  // ---------- 25 · 296.0 CLOSE ON THE FEET: stomps throw sparks ----------
  function feet(t, lt, dur) {
    const z = kf(lt, [[0, 2.0], [dur, 1.8]], ease.out);
    const hb = Math.floor((t - BT(421)) / (BEAT / 2)), st = (t - BT(421)) % (BEAT / 2);
    const land = hit(st + BT(421), BT(421), 12) + hit(t, BT(421) + hb * BEAT / 2, 12);
    const [sx, sy] = shake(t, 10 * hit(t, BT(421) + hb * BEAT / 2, 10));
    cam(960 + sx, 880 + sy, z, .04);
    fieldSky(t, 700);
    const pose = hb % 2 ? flipP(MV2.stomp) : MV2.stomp;
    const lift = Math.sin(clamp(st / (BEAT / 2)) * Math.PI) * .5;
    const p = { ...pose, lR: [pose.lR[0] * (.4 + lift), pose.lR[1]], lL: [pose.lL[0] * (.4 + lift), pose.lL[1]] };
    const J = P1(t, p, 960 + sway(t) * 20, 700, 330);
    // spark bursts from the stomping foot
    const tl = BT(421) + hb * BEAT / 2, hk = hit(t, tl, 7);
    const foot = hb % 2 ? J.ftL : J.ftR;
    light(() => { for (let i = 0; i < 16; i++) { const a = Math.PI + (i / 15) * Math.PI, r = 40 + (1 - hk) * 260; stroke(f, [[foot[0] + Math.cos(a) * r * .6, foot[1] + Math.sin(a) * r * .5], [foot[0] + Math.cos(a) * r, foot[1] + Math.sin(a) * r * .8]], `rgba(255,${160 + i * 5},90,${hk})`, 5); } glow(foot[0], foot[1], 200, `rgba(255,120,60,${.6 * hk})`); });
    for (let i = 0; i < 8; i++) ember(t, 500 + i * 130, 1010 - bob(t + i * .08) * 50, 60, { seed: 150 + i, mood: 'happy', hue: hash(i) * .8, look: (i - 4) * -.2 });
    whipIn(lt, 0, 70);
  }
  // ---------- 24 · 296.4 in the car, the Researcher bobs and mouths along despite herself ----------
  function researcherSings(t, lt, dur) {
    whipIn(lt, -60);
    const z = kf(lt, [[0, 1.3], [dur, 1.5]], ease.inOut);
    cam(960 + kf(lt, [[0, -60], [dur, 60]], ease.inOut), 540, z, sway(t) * .03);
    // through the windshield: the field and the dance, magenta
    fieldSky(t, 560);
    const g = dance(t, [MV.wide, MV.hip, flipP(MV.hip), MV.point], 422, .6);
    P1(t, g.pose, 1320 + g.dx, 560 + g.dy, 110);
    dancers(t, 1320, 620, 360, 14, 26, { rot: t * .9, seed: 90 });
    // the car's cabin framing: roof, pillars, dash
    s.fillStyle = '#0c0a14'; s.beginPath(); s.rect(-400, -400, W + 800, H + 800); s.moveTo(260, 120); s.lineTo(1820, 120); s.lineTo(1900, 700); s.lineTo(160, 700); s.closePath(); s.fill('evenodd');
    s.fillStyle = '#10201c'; s.fillRect(-400, 690, W + 800, 600);
    // the dial, set to red, glowing
    glyph(1200, 800, 40, [255, 60, 40], 1);
    // the researcher: bust, bobbing on the beat, mouth opening on the beat
    const rx = 700 + sway(t) * 20, ry = 560 + bob(t) * 18;
    s.fillStyle = '#8a8490'; s.beginPath(); s.moveTo(rx - 320, 1200); s.bezierCurveTo(rx - 300, ry + 200, rx - 180, ry + 150, rx, ry + 140); s.bezierCurveTo(rx + 180, ry + 150, rx + 300, ry + 200, rx + 320, 1200); s.fill();
    s.fillStyle = '#20263a'; s.beginPath(); s.moveTo(rx - 60, ry + 130); s.lineTo(rx, ry + 300); s.lineTo(rx + 60, ry + 130); s.fill();
    s.save(); s.translate(rx, ry); s.rotate(sway(t) * .15 + bob(t) * .06);
    s.fillStyle = '#343a58'; s.beginPath(); s.ellipse(0, -20, 105, 135, 0, 0, TAU); s.fill();
    const mo = beatPulse(t, 5); s.fillStyle = '#12101a'; s.beginPath(); s.ellipse(20, 60, 26, 6 + mo * 22, 0, 0, TAU); s.fill();
    s.restore();
    for (const d of [-1, 1]) { const gx = rx + 30 + d * 42, gy = ry - 30 + bob(t) * 2; s.strokeStyle = '#8a8aa0'; s.lineWidth = 5; s.beginPath(); s.arc(gx, gy, 24, 0, TAU); s.stroke(); dot(f, gx + 6, gy - 6, 7, `rgba(255,200,230,${.6 + .4 * beatPulse(t, 5)})`); glow(gx, gy, 40, 'rgba(255,120,180,.3)'); }
    light(() => stroke(f, bez([rx - 95, ry + 40], [rx - 110, ry - 80], [rx - 60, ry - 150], [rx + 10, ry - 155], 12), 'rgba(255,110,170,.4)', 6));
    // her hand drumming the dash
    const tap = beatPulse(t, 10); rrect(s, 1000, 700 - tap * 40, 120, 70, 30, '#e6e2d6');
  }
  // ---------- 25 · 297.4 the big finish: a leap, embers explode into a spiral; whip out ----------
  function finale(t, lt, dur) {
    const tb = BT(424);
    const z = kf(lt, [[0, 1.05], [dur, 1.3]], ease.out);
    const wx = 900 * ease.in(inv(dur - .25, dur, lt));
    cam(960 + wx, 560, z, kf(lt, [[0, -.06], [dur, .04]], ease.inOut));
    fieldSky(t, 880);
    const burstK = ease.out(inv(tb - .05, tb + .35, t));
    const jump = Math.sin(clamp(inv(297.4, tb, t)) * Math.PI);
    const slide = ease.out(inv(tb, tb + .3, t));
    let pose = mixPose(MV.crouch, MV2.throwUp, ease.out(inv(297.4, 297.6, t)));
    pose = mixPose(pose, MV2.knee, ease.back(inv(tb - .08, tb + .08, t)));
    const hy = 700 - jump * 180 + slide * 120, hx = 820 + slide * 260;
    for (let i = 0; i < 48; i++) { if (i % 2) continue; const a = i * 2.399 + t * 1.6, r = 420 + burstK * (300 + i * 20);
      ember(t, hx + Math.cos(a) * r, hy - 120 + Math.sin(a) * r * .75, 40 + hash(i) * 30, { seed: 200 + i, mood: 'happy', hue: hash(i + 4), lean: Math.cos(a) * .3 }); }
    light(() => glow(hx, hy - 100, 600, `rgba(255,120,160,${.2 + .4 * hit(t, tb, 4)})`));
    P1(t, pose, hx, hy, 320, { heat: 1.5 });
    for (let i = 1; i < 48; i += 2) { const a = i * 2.399 + t * 1.6, r = 420 + burstK * (300 + i * 20);
      ember(t, hx + Math.cos(a) * r, hy - 120 + Math.sin(a) * r * .75, 50 + hash(i) * 40, { seed: 200 + i, mood: 'happy', hue: hash(i + 4), lean: Math.cos(a) * .3 }); }
    // the knee slide throws a spray of sparks along the grass
    light(() => { const hk = hit(t, tb, 5); for (let i = 0; i < 20; i++) { const x = hx - 200 - i * 30 * (1 - hk * .3), y = 990 - hash(i) * 80 * hk; dot(f, x, y, 4, `rgba(255,190,110,${hk})`); } });
    sparks(t, 960, 600, 1000, 80, 33);
    flash(.2 * hit(t, tb, 7), '#ff80b0');
    whipIn(lt, 70);
    if (lt > dur - .3) whip(80 * inv(dur - .3, dur, lt), 0);
    blackout(.9 * ease.in(inv(dur - .22, dur, lt)));
  }

  chapter('steering', 245.9, 298.4, [
    [245.9, drive],
    [249.2, dialTurn],
    [250.44, windshield],
    [252.0, swerve],
    [253.77, inside],
    [255.2, footwell],
    [258.0, mirror],
    [261.0, mirrorFix],
    [263.1, maskLift],
    [266.4, shelfPlace],
    [269.1, shelfBolts],
    [271.8, faceSpeaks],
    [274.53, underStorm],
    [276.7, galley],
    [280.10, galleyClose],
    [282.4, splitLevel],
    [285.0, reach],
    [288.2, wheelGrab],
    [289.0, spinOut],
    [290.5, burst],
    [292.52, stepOut],
    [293.93, danceHero],
    [294.63, danceOrbit],
    [295.33, danceSpin],
    [296.03, feet],
    [296.7, researcherSings],
    [297.4, finale],
  ], { paint: (t) => ({ boil: 9, bloom: 1.3, flowK: 1.0 }) });
})();
