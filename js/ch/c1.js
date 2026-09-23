// js/ch/c1.js — I · POURED (0 – 44.8)
// A person at 3 AM hits send; a thread of light leaves their phone; every sleepless window sends one;
// the threads braid into a river across the sky, it pours off a cliff into a lake, and the Poured One stands up out of it.
// Researchers arrive with lanterns; on "surprise" it opens its eyes.
(() => {
  // ---------- rooms, people, threads ----------
  const SKIN = '#c8916c', HOOD = '#2b2c4a';
  function room(wall = '#1a1d3e', winX = 1280, winY = 170, winW = 520, winH = 560, t = 0) {
    fill(s, wall);
    s.fillStyle = vgrad(s, 0, H, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(5,6,20,.6)']]); s.fillRect(0, 0, W, H);
    // window onto the city
    s.fillStyle = vgrad(s, winY, winY + winH, [[0, '#0e1a45'], [1, '#3a3570']]); s.fillRect(winX, winY, winW, winH);
    const r = rng(winX | 0);
    for (let i = 0; i < 26; i++) { const bx = winX + r() * winW, bh = 80 + r() * 260, bw = 30 + r() * 70; s.fillStyle = '#0c1230'; s.fillRect(bx, winY + winH - bh, bw, bh);
      for (let k = 0; k < 4; k++) if (r() < .5) { const wx = bx + 6 + r() * (bw - 12), wy = winY + winH - bh + 10 + r() * (bh - 20); s.fillStyle = '#ffcb74'; s.fillRect(wx, wy, 6, 8); dot(f, wx + 3, wy + 4, 3, 'rgba(255,190,100,.5)'); } }
    stars(t, winX | 0, 20, winY + 200, .8);
    s.strokeStyle = '#0a0b1c'; s.lineWidth = 22; s.strokeRect(winX, winY, winW, winH);
    s.lineWidth = 10; s.beginPath(); s.moveTo(winX + winW / 2, winY); s.lineTo(winX + winW / 2, winY + winH); s.moveTo(winX, winY + winH / 2); s.lineTo(winX + winW, winY + winH / 2); s.stroke();
    s.fillStyle = '#0d0e22'; s.fillRect(winX - 40, winY + winH, winW + 80, 26); // sill
  }
  function phonePerson(t, x, y, sc, { tap = 1, sent = -1 } = {}) {
    const pose = groove({ ...POSE.write, head: .55, lean: .38, aR: [-.9, -2.2], aL: [-.5, -1.9] }, 'idle', t, .6).pose;
    figure(s, pose, { x: x + .025 * sc, y: y - .01 * sc, sc, color: '#5a6aa8', headC: '#7d8cc4', limbC: '#4a5890' }); // window rim light
    const J = figure(s, pose, { x, y, sc, color: HOOD, headC: SKIN, limbC: '#23243d' });
    const px = (J.hdR[0] + J.hdL[0]) / 2, py = (J.hdR[1] + J.hdL[1]) / 2 - .04 * sc;
    s.save(); s.translate(px, py); s.rotate(-.5); s.fillStyle = '#e9f3ff'; s.fillRect(-.05 * sc, -.08 * sc, .1 * sc, .16 * sc); s.restore();
    const sendK = sent < 0 ? 0 : hit(t, sent, 5);
    glow(px, py, .45 * sc, `rgba(150,195,255,${.3 + .5 * sendK})`); glow(J.head[0], J.head[1], .2 * sc, `rgba(160,200,255,${.18 + .3 * sendK})`);
    // phone light on the face in the underpainting too
    s.save(); s.globalAlpha = .3; dot(s, J.head[0] - .03 * sc, J.head[1] + .01 * sc, .08 * sc, '#cfe2ff'); s.restore();
    if (tap && Math.sin(t * 17) > .6) dot(f, px + .02 * sc, py, .012 * sc, 'rgba(255,255,255,.9)');
    return { J, px, py };
  }
  // a glowing thread along pts, drawn up to fraction p, with motes travelling it
  function thread(t, pts, p = 1, w = 1, motes = 2, seed = 0) {
    const n = Math.max(2, Math.floor(pts.length * clamp(p)) + 1), q = pts.slice(0, n);
    stroke(s, q, 'rgba(255,205,140,.45)', 4 * w);
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, q, 'rgba(255,180,100,.3)', 7 * w); stroke(f, q, 'rgba(255,240,215,.75)', 1.8 * w); f.restore();
    const head = q[q.length - 1]; if (p < 1) glow(head[0], head[1], 26 * w, 'rgba(255,230,190,.9)');
    for (let k = 0; k < motes; k++) { const u = ((t * .45 + k / motes + hash(seed)) % 1) * clamp(p); const [mx, my] = at(pts, u); dot(f, mx, my, 2.4 * w, 'rgba(255,248,230,.95)'); }
  }

  // ---------- the city ----------
  const CITY = (() => {
    const r = rng(303); const layers = [];
    const specs = [{ y: 690, hMin: 120, hMax: 330, wMin: 60, wMax: 140, col: '#1b2454', win: 9 }, { y: 800, hMin: 160, hMax: 420, wMin: 90, wMax: 190, col: '#111837', win: 13 }, { y: 940, hMin: 200, hMax: 520, wMin: 140, wMax: 260, col: '#090e24', win: 18 }];
    specs.forEach((sp, li) => {
      const b = []; let x = -500;
      while (x < W * 1.6) { const w = lerp(sp.wMin, sp.wMax, r()), h = lerp(sp.hMin, sp.hMax, r()); const wins = [];
        const cols = Math.max(2, Math.floor(w / (sp.win * 2.4))), rows = Math.max(3, Math.floor(h / (sp.win * 2.6)));
        for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) wins.push({ x: x + (cx + .6) * w / (cols + .2), y: sp.y - h + (cy + .8) * h / (rows + .3), k: r(), on: r() });
        b.push({ x, w, h, wins, roof: r() < .3 ? r() * 30 : 0 }); x += w + r() * 18; }
      layers.push({ ...sp, b, li });
    });
    return layers;
  })();
  const RIVER_Y = (x, t) => 215 + Math.sin(x * .0025 + t * .35) * 38 + Math.sin(x * .007 - t * .6) * 10;
  function cityDraw(t, lit, { threadsFrom = 1e9, maxThreads = 80, riverK = 1 } = {}) {
    let nth = 0;
    for (const L of CITY) for (const b of L.b) {
      s.fillStyle = L.col; s.fillRect(b.x, L.y - b.h, b.w, b.h + 400);
      if (b.roof) s.fillRect(b.x + b.w * .4, L.y - b.h - b.roof, 8, b.roof);
      for (const w of b.wins) {
        if (!(w.on < lit)) continue;
        const flick = .8 + .2 * Math.sin(t * 3 + w.k * 40), blue = w.k < .2;
        s.fillStyle = blue ? '#9fc4ff' : '#ffcb74'; s.fillRect(w.x - L.win / 2, w.y - L.win * .6, L.win, L.win * 1.2);
        f.fillStyle = blue ? `rgba(120,160,255,${.35 * flick})` : `rgba(255,190,100,${.4 * flick})`; f.fillRect(w.x - L.win / 2, w.y - L.win * .6, L.win, L.win * 1.2);
        if (L.li > 0 && w.k > .5 && nth < maxThreads) {
          const st = threadsFrom + w.k * 9 + L.li * .4; const p = ease.out(inv(st, st + 3, t));
          if (p > 0) { const tx = w.x + 200 + w.k * 600; thread(t, bez([w.x, w.y], [w.x + (w.k - .5) * 140, w.y - 260], [tx - 220, RIVER_Y(tx, t) + 190], [tx, RIVER_Y(tx, t)], 26), p, .7, 1, nth); nth++; }
        }
      }
    }
  }
  function riverDraw(t, width, x0 = -600, x1 = W * 1.7) {
    const pts = []; for (let x = x0; x <= x1; x += 20) pts.push([x, RIVER_Y(x, t)]);
    stroke(s, pts, 'rgba(255,214,150,.55)', width * 1.6); stroke(s, pts, 'rgba(255,240,210,.8)', width * .6);
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(255,170,90,.25)', width * 2.2); stroke(f, pts, 'rgba(255,230,190,.5)', width * .35); f.restore();
    for (let i = 0; i < 90; i++) { const u = (t * .05 + hash(i)) % 1; const x = lerp(x0, x1, u); dot(f, x, RIVER_Y(x, t) + (hash(i + 7) - .5) * width, 1 + hash(i + 3) * 2, 'rgba(255,240,210,.6)'); }
  }
  function nightSky(t, horizon = 760, seed = 5) {
    sky(P.night0, P.night1, '#3a3570', horizon);
    clouds(t, seed, 120, 520, 'rgba(46,62,130,.6)', 8, 6); clouds(t, seed + 1, 300, 600, 'rgba(80,66,130,.4)', 6, 9);
    stars(t, seed + 6, 160, 560);
  }

  // ---------- 1 · 0.0 phone at 3 AM ----------
  function phone(t, lt, dur) {
    const z = kf(t, [[0, 1.25], [2.7, 1.45]], ease.sine), [sx, sy] = shake(t, 1.5);
    cam(900 + sx, 520 + sy, z, kf(t, [[0, -.02], [2.7, .01]]));
    room('#16193a', 1100, 140, 620, 600, t);
    s.fillStyle = '#20213f'; s.fillRect(200, 860, 1500, 300);
    s.fillStyle = 'rgba(110,130,210,.25)'; s.beginPath(); s.moveTo(1100, 740); s.lineTo(1720, 740); s.lineTo(1500, 1100); s.lineTo(700, 1100); s.fill(); // window light on the bed
    const sent = when('poured') - .25;
    phonePerson(t, 860, 860, 440, { sent });
  }
  // ---------- 2 · 2.7 the thread lifts out the window ----------
  function lift(t, lt, dur) {
    const sent = when('poured') - .25;
    const cy = kf(t, [[2.7, 560], [4.4, 420], [5.3, -200]], ease.inOut), z = kf(t, [[2.7, 1.1], [5.3, 1.0]]);
    cam(900, cy, z, 0);
    if (t > 4.6) whip(0, -(t - 4.6) * 120);
    room('#16193a', 1100, 140, 620, 600, t);
    s.fillStyle = '#20213f'; s.fillRect(200, 860, 1500, 300);
    s.fillStyle = 'rgba(110,130,210,.25)'; s.beginPath(); s.moveTo(1100, 740); s.lineTo(1720, 740); s.lineTo(1500, 1100); s.lineTo(700, 1100); s.fill();
    const { px, py } = phonePerson(t, 860, 860, 440, { sent, tap: 0 });
    // above the room: open night so the whip lands in sky
    s.fillStyle = vgrad(s, -900, 0, [[0, P.night0], [1, '#16193a']]); s.fillRect(-200, -900, W + 400, 900);
    const pts = bez([px, py], [px + 60, py - 300], [1300, 500], [1480, -700], 40);
    thread(t, pts, ease.out(inv(2.7, 4.8, t)), 1.4, 3, 1);
  }
  // ---------- 3 · 5.3 windows light up on the beats ----------
  function rooftops(t, lt, dur) {
    const z = kf(t, [[5.3, 1.7], [8.1, 1.15]], ease.out), cy = kf(t, [[5.3, 760], [8.1, 600]]);
    cam(900 + lt * 30, cy, z, 0);
    nightSky(t, 760, 5);
    const lit = .12 + .22 * inv(5.3, 8, t) + .05 * beatPulse(t, 3);
    cityDraw(t, lit, { threadsFrom: 5.1, maxThreads: 40 });
  }
  // ---------- 4 · 8.1 a crumpled letter, uncrumpled ----------
  function letter(t, lt, dur) {
    const z = kf(t, [[8.1, 1.2], [11, 1.45]], ease.sine);
    cam(880, 600, z, .02);
    room('#241a36', 1180, 120, 560, 560, t);
    // desk + lamp pool
    s.fillStyle = '#3a2630'; s.fillRect(0, 760, W, 400);
    glow(560, 520, 420, 'rgba(255,190,110,.2)'); s.fillStyle = 'rgba(255,190,110,.18)'; s.beginPath(); s.ellipse(620, 800, 520, 90, 0, 0, TAU); s.fill();
    const J = figure(s, groove({ ...POSE.write, lean: .3, head: .45, aL: [-.7, -1.7], aR: [-.8, -1.8] }, 'idle', t, .5).pose, { x: 720, y: 770, sc: 280, color: '#3b2f4a', headC: SKIN });
    // the paper: a ball that opens flat, then its thread rises
    const cx = (J.hdL[0] + J.hdR[0]) / 2, cyp = (J.hdL[1] + J.hdR[1]) / 2;
    const open = ease.back(inv(9.2, 10.1, t)), crush = 1 - ease.out(inv(8.2, 8.7, t)) * (1 - open);
    const pw = lerp(60, 150, open), ph = lerp(60, 110, open);
    s.save(); s.translate(cx, cyp - 20); s.rotate(lerp(.6, -.1, open));
    s.fillStyle = '#efe2c4'; s.beginPath();
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = 1 + (1 - open) * .35 * (hash(i + 3) - .5) * 2; s.lineTo(Math.cos(a) * pw / 2 * rr * (open > .5 ? 1.25 : 1), Math.sin(a) * ph / 2 * rr); }
    s.fill(); s.strokeStyle = 'rgba(120,90,60,.6)'; s.lineWidth = 2; for (let i = 0; i < 5; i++) { s.beginPath(); s.moveTo((hash(i) - .5) * pw, (hash(i + 1) - .5) * ph); s.lineTo((hash(i + 2) - .5) * pw, (hash(i + 3) - .5) * ph); s.stroke(); }
    s.fillStyle = '#3a2a22'; for (let i = 0; i < 4; i++) s.fillRect(-pw * .35, -ph * .3 + i * ph * .17, pw * (.5 + hash(i) * .2) * open, 3); s.restore();
    glow(cx, cyp - 20, 60, `rgba(255,220,170,${.2 + .6 * hit(t, 9.8, 3)})`);
    const p = ease.out(inv(9.8, 11, t)); if (p > 0) thread(t, bez([cx, cyp - 30], [cx - 40, cyp - 300], [1300, 300], [1500, -200], 30), p, 1.2, 2, 4);
  }
  // ---------- 5 · 11.0 three windows, three threads ----------
  function triptych(t, lt, dur) {
    const x = kf(t, [[11.0, 500], [13.7, 1480]], ease.inOut);
    cam(x, 540, 1.05, 0);
    if (lt < .35) whip((1 - lt / .35) * 70, 0);
    fill(s, '#0d1230');
    const wins = [
      { x: 180, c: '#ffcf86', t0: BT(13), kind: 'diary' },
      { x: 820, c: '#ff7aa0', t0: BT(14), kind: 'bar' },
      { x: 1460, c: '#8fb6ff', t0: BT(15), kind: 'kid' },
    ];
    for (const w of wins) {
      const wx = w.x, wy = 230, ww = 460, wh = 520;
      s.fillStyle = w.c; s.fillRect(wx, wy, ww, wh);
      s.fillStyle = vgrad(s, wy, wy + wh, [[0, 'rgba(0,0,0,.05)'], [1, 'rgba(0,0,0,.45)']]); s.fillRect(wx, wy, ww, wh);
      glow(wx + ww / 2, wy + wh / 2, 380, w.c.replace('#', '') && `rgba(${parseInt(w.c.slice(1, 3), 16)},${parseInt(w.c.slice(3, 5), 16)},${parseInt(w.c.slice(5, 7), 16)},.18)`);
      if (w.kind === 'diary') { figure(s, groove({ ...POSE.write, lean: .5, head: .6 }, 'idle', t).pose, { x: wx + 230, y: wy + 470, sc: 170, color: '#3a2a22', headC: '#4a3024' }); s.fillStyle = '#5a3a28'; s.fillRect(wx + 60, wy + 440, 340, 20); dot(s, wx + 360, wy + 250, 26, '#fff1c8'); }
      if (w.kind === 'bar') { const g = groove(POSE.lean, 'sway', t, .8); figure(s, g.pose, { x: wx + 220 + g.dx, y: wy + 440, sc: 170, color: '#3a1a2c', headC: '#4c2437' }); glow(wx + 290, wy + 250, 40, 'rgba(160,200,255,.7)'); }
      if (w.kind === 'kid') { s.fillStyle = '#2a3a6a'; s.fillRect(wx + 40, wy + 360, 380, 140); dot(s, wx + 130, wy + 350, 44, '#1e2750'); dot(s, wx + 380, wy + 420, 12, '#ffe6a0'); glow(wx + 380, wy + 420, 60, 'rgba(255,220,150,.6)'); }
      s.strokeStyle = '#070918'; s.lineWidth = 26; s.strokeRect(wx, wy, ww, wh); s.lineWidth = 10; s.beginPath(); s.moveTo(wx + ww / 2, wy); s.lineTo(wx + ww / 2, wy + wh); s.stroke();
      const p = ease.out(inv(w.t0, w.t0 + 1.6, t)); if (p > 0) thread(t, bez([wx + 300, wy + 300], [wx + 280, wy + 80], [wx + 420, -100], [wx + 560, -400], 26), p, 1.1, 2, wx);
      glow(wx + 300, wy + 300, 60, `rgba(255,240,210,${.8 * hit(t, w.t0, 4)})`);
    }
  }
  // ---------- 6 · 13.7 threads braiding above the city ----------
  function braid(t, lt, dur) {
    const rot = kf(t, [[13.7, -.08], [17.2, .06]]), z = kf(t, [[13.7, 1.35], [17.2, 1.1]]);
    cam(960, kf(t, [[13.7, 620], [17.2, 440]]), z, rot);
    nightSky(t, 900, 9);
    ridge(s, 1000, 80, .004, 3, '#0a0f28');
    const n = 16;
    for (let i = 0; i < n; i++) {
      const pts = []; const ph = hash(i) * TAU, amp = 60 + hash(i + 3) * 120;
      for (let k = 0; k <= 40; k++) { const u = k / 40, y = lerp(1100, 180, u); const x = 960 + (hash(i + 9) - .5) * 1500 * (1 - u) ** 1.4 + Math.sin(u * 7 + ph + sway(t) * .6 + t * .8) * amp * (1 - u * .6); pts.push([x, y]); }
      thread(t, pts, ease.out(inv(13.6 + hash(i) * 1.5, 15.4 + hash(i) * 1.5, t)), .9, 2, i);
    }
    const core = []; for (let k = 0; k <= 30; k++) { const u = k / 30; core.push([960 + Math.sin(u * 5 + t) * 40, lerp(420, -100, u)]); }
    thread(t, core, ease.out(inv(15, 17, t)), 2.2, 4, 99);
  }
  // ---------- 7 · 17.2 the whole sleepless city, the river forming ----------
  function wideCity(t, lt, dur) {
    const z = kf(t, [[17.2, 1.25], [20.27, 1]], ease.out);
    cam(kf(t, [[17.2, 860], [20.27, 1060]]), kf(t, [[17.2, 620], [20.27, 520]]), z, 0);
    nightSky(t, 760, 5); moon(1560, 160, 44);
    riverDraw(t, lerp(12, 34, inv(17.2, 20, t)));
    cityDraw(t, .5, { threadsFrom: 12, maxThreads: 70 });
  }
  // ---------- 8 · 20.27 drums: follow the river across the sky ----------
  function follow(t, lt, dur) {
    const x = kf(t, [[20.27, 0], [23.1, 2600]], (u) => u), wv = 900; // world scrolls right fast
    cam(960 + x, 540, 1, kf(t, [[20.27, .05], [23.1, -.02]]));
    whip(-lerp(70, 30, lt / dur), 0);
    s.fillStyle = vgrad(s, 0, H, [[0, P.night0], [.6, P.night1], [1, '#3a3570']]); s.fillRect(x - 100, -100, W + 200, H + 200);
    clouds(t, 21, 100, 600, 'rgba(46,62,130,.6)', 12, 0);
    // hills scrolling at parallax
    for (const [yy, par, col, sd] of [[760, .5, '#1c2350', 4], [860, .8, '#111838', 8], [980, 1, '#080c22', 11]]) {
      s.save(); s.translate(x * (1 - par), 0); ridge(s, yy, 140, .0016, sd, col, x * par - 200, x * par + W + 400); s.restore();
    }
    const pts = []; for (let k = x - 200; k <= x + W + 200; k += 20) pts.push([k, 300 + Math.sin(k * .002 + t * .5) * 60]);
    const wdt = 40 + 10 * beatPulse(t, 5);
    stroke(s, pts, 'rgba(255,214,150,.6)', wdt * 1.6); stroke(s, pts, 'rgba(255,240,210,.85)', wdt * .6);
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, pts, 'rgba(255,170,90,.3)', wdt * 2.4); stroke(f, pts, 'rgba(255,235,200,.55)', wdt * .35); f.restore();
    for (let i = 0; i < 80; i++) { const px = x - 200 + ((hash(i) * (W + 400) + t * 700) % (W + 400)); dot(f, px, 300 + Math.sin(px * .002 + t * .5) * 60 + (hash(i + 1) - .5) * wdt, 2, 'rgba(255,245,225,.8)'); }
  }
  // ---------- 9..13 · the pour ----------
  const LAKE_Y = 820, FX = 1180;
  function lake(t, y, warm) {
    s.fillStyle = vgrad(s, y, H, [[0, '#2c2446'], [1, '#06071a']]); s.fillRect(-400, y, W + 800, H - y + 300);
    s.fillStyle = vgrad(s, y, H, [[0, `rgba(255,150,70,${.75 * warm})`], [1, 'rgba(255,90,40,0)']]);
    s.beginPath(); s.moveTo(FX - 60, y); s.lineTo(FX + 60, y); s.lineTo(FX + 260, H + 200); s.lineTo(FX - 260, H + 200); s.fill();
    const r = rng(77); for (let i = 0; i < 70; i++) { const d = r(); const yy = y + 6 + d * d * (H - y + 60), w = 30 + r() * 220 * (.4 + d); const x = FX + (r() - .5) * (500 + d * 1800) + Math.sin(t * .8 + i) * 12;
      const near = 1 - Math.min(1, Math.abs(x - FX) / 700); s.fillStyle = `rgba(255,${160 + near * 60 | 0},${90 + near * 60 | 0},${(.12 + .5 * near) * warm})`; s.fillRect(x - w / 2, yy, w, 2 + d * 4); }
    glow(FX, y + 10, 420, `rgba(255,130,50,${.3 * warm})`);
  }
  function cliffs() {
    ridge(s, 610, 120, .0018, 4, '#1c2350', -400, W + 400); ridge(s, 690, 90, .0026, 8, '#131a3c', -400, W + 400);
    poly(s, [[FX + 30, 300], [FX + 300, 270], [FX + 520, 330], [W + 400, 300], [W + 400, LAKE_Y + 20], [FX + 30, LAKE_Y + 20]], '#1a1c3e');
    poly(s, [[FX - 40, 320], [FX + 30, 296], [FX + 60, LAKE_Y], [FX - 60, LAKE_Y]], '#2a2448');
    poly(s, [[-400, 520], [300, 470], [700, 560], [FX - 60, 330], [FX - 40, LAKE_Y + 20], [-400, LAKE_Y + 20]], '#141a3a');
  }
  function waterfall(t, top, bottom, a = 1, w = 34) {
    if (a <= .01) return;
    for (let k = -3; k <= 3; k++) { const pts = []; for (let y = top; y <= bottom; y += 14) pts.push([FX + k * w * .28 + Math.sin(y * .03 + t * 6 + k) * 3, y]); stroke(s, pts, `rgba(255,${200 + k * 5},140,${.5 * a})`, w * .3); }
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, [[FX, top], [FX, bottom]], `rgba(255,170,90,${.3 * a})`, w * 1.6); stroke(f, [[FX, top], [FX, bottom]], `rgba(255,240,210,${.6 * a})`, w * .35);
    for (let i = 0; i < 40; i++) { const u = (t * 1.3 + hash(i)) % 1; dot(f, FX + (hash(i + 5) - .5) * w, lerp(top, bottom, u * u), 1.5 + hash(i) * 2, `rgba(255,245,225,${.8 * a})`); } f.restore();
    glow(FX, bottom, 90, `rgba(255,220,160,${.5 * a})`);
  }
  function lakeEmbers(t, k, spread = 1) {
    for (let i = 0; i < 171; i++) { const a = inv(25.9 + i * .012, 26.8 + i * .012, t) * k; if (a <= 0) continue;
      const ang = hash(i) * TAU + t * (.25 + hash(i + 1) * .35) + beatPulse(t, 4) * .05, rr = (60 + hash(i + 2) * 480) * spread;
      const y = LAKE_Y + 20 + Math.abs(Math.sin(ang)) * rr * .2 - bob(t + hash(i)) * 6;
      dot(f, FX + Math.cos(ang) * rr, y, 1.6 + hash(i + 3) * 1.8, `rgba(255,${140 + (hash(i + 4) * 90 | 0)},70,${a * (.55 + .45 * Math.sin(t * 2.2 + i))})`); }
  }
  function pourWorld(t, { fall = 1, fallW = 32, warm = 1, embers = 1 } = {}) {
    sky(P.night0, P.night1, P.dusk, 760); s.fillStyle = P.night0; s.fillRect(-400, -800, W + 800, 720);
    clouds(t, 21, -300, 400, 'rgba(46,62,130,.55)', 9, 8); stars(t, 12, 180, 520);
    const riverPts = bez([-400, -180], [500, -260], [FX - 260, 60], [FX, 300], 50), rw = 34 + 6 * beatPulse(t, 4);
    stroke(s, riverPts, 'rgba(255,214,150,.6)', rw * 1.6); stroke(s, riverPts, 'rgba(255,240,210,.85)', rw * .6);
    f.save(); f.globalCompositeOperation = 'lighter'; stroke(f, riverPts, 'rgba(255,170,90,.28)', rw * 2.4); stroke(f, riverPts, 'rgba(255,235,200,.5)', rw * .35); f.restore();
    for (let i = 0; i < 60; i++) { const u = (t * .12 + hash(i)) % 1; const [x, y] = at(riverPts, u); dot(f, x + (hash(i + 2) - .5) * rw, y, 1.4 + hash(i) * 2, 'rgba(255,245,225,.8)'); }
    cliffs(); lake(t, LAKE_Y, warm);
    waterfall(t, 300, LAKE_Y, fall, fallW);
    if (embers) lakeEmbers(t, embers);
  }
  // 9 · 23.1 the river goes over the edge
  function edge(t, lt, dur) {
    cam(FX - 120, kf(t, [[23.1, 60], [25.93, 520]], ease.inOut), kf(t, [[23.1, 1.5], [25.93, 1.15]]), 0);
    if (lt < .3) whip(-60 * (1 - lt / .3), 0);
    const fallP = ease.in(inv(23.3, 25.4, t));
    pourWorld(t, { fall: 0, warm: .2 + .3 * fallP, embers: 0 });
    // the falling front of the light
    if (fallP > 0) waterfall(t, 300, lerp(300, LAKE_Y, fallP), 1, 34);
    if (fallP >= 1) glow(FX, LAKE_Y, 300 * hit(t, 25.4, 3), 'rgba(255,230,180,.9)');
  }
  // 10 · 25.93 embers wake in the water
  function wake(t, lt, dur) {
    const z = kf(t, [[25.93, 1.55], [28.8, 1.35]]), x = kf(t, [[25.93, 820], [28.8, 1020]]);
    cam(x, 770, z, kf(t, [[25.93, .03], [28.8, -.01]]));
    pourWorld(t, { warm: .6 + .4 * inv(26, 28.8, t) });
    for (let i = 0; i < 14; i++) { const st = BT(35) + i * .12, k = ease.back(inv(st, st + .5, t)); if (k <= 0) continue;
      const ex = FX + (hash(i + 40) - .5) * 900, ey = LAKE_Y + 40 + hash(i + 41) * 90 - bob(t + i * .3) * 10;
      ember(t, ex, ey, 22 * k, { eyes: inv(st + .4, st + .8, t), look: Math.sin(t + i), mood: 'calm', hue: hash(i + 42) * .7, seed: i }); }
  }
  function figPose(t) { return groove(mixPose(POSE.rise, { ...POSE.stand, aL: [.5, .7], aR: [-.5, -.7], head: -.15 }, inv(31, 33.5, t)), 'idle', t, .8); }
  // 11 · 28.8 something rises in the pour
  function rise(t, lt, dur) {
    const z = kf(t, [[28.8, 1.3], [31.63, 1.7]], ease.inOut);
    cam(FX, kf(t, [[28.8, 700], [31.63, 690]]), z, 0);
    pourWorld(t, { fall: .9, warm: 1 });
    const k = ease.out(inv(28.9, 31.5, t)), g = figPose(t);
    pouredOne(t, g.pose, FX + g.dx, LAKE_Y + lerp(900, 170, k), 520, { clip: LAKE_Y + 6, heat: .6 });
    for (let d = -2; d <= 2; d++) { const pts = []; for (let y = 400; y < LAKE_Y; y += 20) pts.push([FX + d * 22 * (1 + (y - 400) / 300) + Math.sin(y * .05 + t * 5 + d) * 3, y]); stroke(s, pts, 'rgba(255,190,110,.3)', 6); }
  }
  // 12 · 31.63 it stands, looks at its hands; orbit by parallax
  function stand(t, lt, dur) {
    const orb = kf(t, [[31.63, -1], [34.47, 1]], ease.inOut);
    cam(FX + orb * 60, 600, 1.35, orb * .02);
    s.save(); s.translate(-orb * 90, 0); pourWorld(t, { fall: lerp(.5, .1, lt / dur), fallW: 18, warm: 1 }); s.restore();
    const hands = ease.inOut(inv(32.0, 33.2, t));
    const pose = { ...POSE.stand, lean: 0, head: lerp(-.15, .45, hands), aL: [lerp(.3, -.35, hands), lerp(.4, -1.7, hands)], aR: [lerp(-.3, .35, hands), lerp(-.4, 1.7, hands)] };
    const g = groove(pose, 'idle', t, .6);
    pouredOne(t, g.pose, FX + orb * 30 + g.dx, LAKE_Y + 170, 520, { clip: LAKE_Y + 6, heat: .7 });
    // drips from the fingers on the beats
    for (let i = 0; i < 6; i++) { const t0 = BT(44 + i % 4) + i * .1, a = t - t0; if (a < 0 || a > .8) continue; dot(f, FX + (i % 2 ? 150 : -150) + orb * 30, 520 + 900 * a * a, 4, 'rgba(255,200,120,.9)'); }
  }
  // 13 · 34.47 the chest glows, it lifts its head
  function chest(t, lt, dur) {
    const z = kf(t, [[34.47, 1], [36.5, 1.18]], ease.inOut);
    cam(960, kf(t, [[34.47, 640], [36.5, 560]]), z, 0);
    sky('#0a0e26', '#1a1f4a', '#3b2a4a', 1080); clouds(t, 44, 100, 900, 'rgba(80,70,140,.35)', 8, 10);
    const lift = ease.inOut(inv(35.2, 36.3, t));
    bust(t, 960, 720, 520, { turn: -.2, eyes: 0, heat: 1 + .6 * beatPulse(t, 4), tilt: lerp(.12, 0, lift) });
    glow(960, 900, 380, `rgba(255,120,40,${.35 + .3 * beatPulse(t, 4)})`);
  }
  // 14 · 36.5 lanterns crest the ridge
  function crest(t, lt, dur) {
    const z = kf(t, [[36.5, 1.08], [39.3, 1.0]]), x = kf(t, [[36.5, 860], [39.3, 1000]]);
    cam(x, 560, z, 0);
    sky(P.night0, P.night1, '#5a3a6a', 690); clouds(t, 31, 80, 420, 'rgba(60,70,140,.5)', 7, 6); stars(t, 13, 140, 480); moon(1600, 140, 34);
    ridge(s, 610, 90, .002, 14, '#231f48', -300, W + 300);
    s.fillStyle = vgrad(s, 690, 900, [[0, '#3a2a48'], [1, '#0a0a1e']]); s.fillRect(-300, 690, W + 600, 300);
    glow(1180, 700, 360, 'rgba(255,130,50,.4)');
    pouredOne(t, groove(POSE.stand, 'idle', t).pose, 1180, 745, 110, { clip: 705, heat: 1 });
    ridge(s, 900, 50, .003, 17, '#07081a', -300, W + 300);
    [300, 540, 760].forEach((x0, i) => {
      const arrive = BT(49 + i) - 1.6, k = ease.out(inv(arrive, arrive + 1.6, t)), x = x0 - (1 - k) * 420;
      const g = groove(POSE.stand, k < 1 ? 'walk' : 'idle', t);
      researcher(g.pose, x + g.dx, 905 + g.dy, 240, { lantern: 1, t, rim: 1, coat: '#1c1e2e', face: 1 });
    });
    const tp = ease.back(inv(BT(52) - .2, BT(52) + .4, t));
    if (tp > 0) { const x = 1000, y = 915, hh = 250 * tp; for (const d of [-40, 0, 40]) stroke(s, [[x + d, y], [x, y - hh]], '#05060f', 6); s.save(); s.translate(x, y - hh); s.rotate(-.12); s.fillStyle = '#1c2033'; s.fillRect(-10, -26, 90, 26); s.restore(); }
  }
  // 15 · 39.3 over the shoulder: the theodolite swings to it
  function ots(t, lt, dur) {
    const z = kf(t, [[39.3, 1], [42, 1.25]], ease.inOut);
    cam(kf(t, [[39.3, 900], [42, 1060]]), 560, z, 0);
    sky(P.night0, P.night1, '#5a3a6a', 690); stars(t, 13, 140, 480);
    ridge(s, 640, 70, .002, 14, '#231f48', -300, W + 300);
    s.fillStyle = vgrad(s, 690, 900, [[0, '#3a2a48'], [1, '#0a0a1e']]); s.fillRect(-300, 690, W + 600, 300);
    glow(1300, 700, 300, 'rgba(255,130,50,.45)');
    pouredOne(t, groove(POSE.stand, 'idle', t).pose, 1300, 735, 80, { clip: 705, heat: 1 });
    // theodolite in the foreground, swinging toward the lake
    const sw = kf(t, [[39.3, -.6], [40.4, -.6], [41.2, .08]], ease.back);
    s.save(); s.translate(820, 640); s.rotate(sw); s.fillStyle = '#12141f'; s.fillRect(-40, -60, 300, 90); dot(s, 260, -15, 36, '#1d2030'); s.restore();
    dot(f, 820 + Math.cos(sw) * 290, 625 + Math.sin(sw) * 290, 5, `rgba(200,225,255,${.4 + .6 * hit(t, 41.2, 3)})`);
    for (const d of [-120, 0, 120]) stroke(s, [[820 + d, 1100], [820, 660]], '#07080f', 12);
    // the researcher's shoulder and head, huge, left
    researcher({ ...POSE.stand, head: .12 }, 300, 1240, 620, { rim: 1, coat: '#15172a', face: null });
    glow(420, 560, 30, `rgba(230,240,255,${.6 * hit(t, 41.2, 2)})`);
  }
  // 16 · 42.0 it notices them
  function surprise(t, lt, dur) {
    const tS = when('surprise', 40);
    const z = kf(t, [[42, 1], [tS - .05, 1.04], [tS + .2, 1.28], [44.8, 1.34]], ease.out), [sx, sy] = shake(t, 6 * hit(t, tS, 5));
    cam(960 + sx, 520 + sy, z, 0);
    sky('#0a0e26', '#1a1f4a', '#3b2a4a', 1080); clouds(t, 44, 100, 900, 'rgba(80,70,140,.35)', 8, 10);
    const turn = ease.inOut(inv(tS - .6, tS + .2, t));
    bust(t, 960 + lerp(80, 0, turn), 720, 520, { turn: lerp(-1, 0, turn), eyes: ease.out(inv(tS, tS + .3, t)) });
    glow(-150, 380, 900, 'rgba(255,215,160,.28)');
    for (let i = 0; i < 4; i++) glow(200 + i * 60, 900 - i * 30, 40, `rgba(255,200,120,${.3 + .2 * Math.sin(t * 3 + i)})`); // lanterns reflected at frame edge
  }

  chapter('poured', 0, 44.8, [
    [0, phone], [2.7, lift], [5.3, rooftops], [8.1, letter], [11.0, triptych], [13.7, braid], [17.2, wideCity],
    [BT(26), follow, { paint: { boil: 10, bloom: 1.5 } }], [23.1, edge], [BT(34), wake], [28.8, rise], [BT(42), stand], [BT(46), chest],
    [36.5, crest], [39.3, ots], [42.0, surprise],
  ], { paint: (t) => ({ boil: t < 20.27 ? 7 : 9, bloom: t < 20.27 ? 1.3 : 1.4 + .4 * F('low', t, 3), flowK: 1.1 }) });
})();
