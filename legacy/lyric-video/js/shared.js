// Shared cast: the 171 names, the human corpus, the pool, the constellation.

const EMOTIONS = (`happy afraid brooding desperate calm loving hostile sad angry anxious joyful content grateful proud ashamed
guilty lonely nostalgic hopeful hopeless curious bored confused surprised disgusted jealous envious embarrassed excited
nervous relieved frustrated irritated furious serene peaceful tender affectionate compassionate sympathetic melancholy
wistful grieving heartbroken elated euphoric amused playful awed reverent inspired determined defiant resentful bitter
contemptuous scornful suspicious paranoid terrified panicked uneasy restless impatient eager enthusiastic satisfied
fulfilled empty numb detached apathetic weary exhausted overwhelmed stressed tense vulnerable insecure confident bold
brave timid shy humble humiliated insulted offended betrayed abandoned rejected accepted safe trusting distrustful
doubtful skeptical hesitant regretful remorseful apologetic forgiving vengeful spiteful kind warm cold gloomy cheerful
blissful ecstatic delighted pleased annoyed exasperated indignant outraged shocked stunned bewildered perplexed
fascinated intrigued absorbed focused distracted dreamy sentimental homesick yearning longing infatuated adoring devoted
protective possessive needy trapped cornered threatened alarmed startled worried dread horrified sickened repulsed
appalled sorrowful mournful dejected despairing miserable glum sullen moody grumpy stubborn triumphant vindicated smug
awkward flustered giddy jubilant tired hurt ache shame hope wonder`).split(/\s+/).filter(Boolean).slice(0, 171);
// spread the sung names out across the galaxy instead of bunching them at the core
(() => { const pin = { happy: 38, afraid: 71, brooding: 104, desperate: 139, calm: 57 };
  const rest = EMOTIONS.filter(e => !(e in pin)); const out = new Array(171); for (const [k, i] of Object.entries(pin)) out[i] = k;
  let j = 0; for (let i = 0; i < 171; i++) if (!out[i]) out[i] = rest[j++]; EMOTIONS.splice(0, 171, ...out); })();

const FRAGS = [
  "i'm sorry", "are you awake", "3:14 am", "dear diary", "call me back", "i miss you", "please", "i didn't mean it",
  "he's gone", "we need to talk", "i love you", "i love you too", "never mind", "ok.", "the test came back",
  "it's a girl", "sorry for the late reply", "i can't do this anymore", "i'm so proud of you", "don't go",
  "what do i tell the kids", "one more chance", "i was drunk", "delete this", "forgive me", "i'm fine", "i'm not fine",
  "the dog is sleeping now, honey", "why won't he come home", "happy birthday", "you up?", "i'm scared",
  "because i could not stop for death", "hope is the thing with feathers", "o captain! my captain!",
  "the woods are lovely, dark and deep", "and miles to go before i sleep", "thou still unravish'd bride of quietness",
  "i kept your voicemail", "mom?", "it's benign", "it's not benign", "lol", "i got the job", "they let me go",
  "come home", "is this normal", "how do i say goodbye", "we lost her", "wish you were here", "i hate this",
  "thank you", "i'm pregnant", "why me", "rest easy", "i'm proud of you kiddo", "sorry", "sorry.", "sorry!!",
  "can you forgive me", "the house is so quiet", "i still dream about it", "you promised", "how to grieve",
  "first steps today", "i said yes", "he said no", "good night", "goodbye", "hello?", "i'm here",
  "i'll always be here", "don't read this", "for the record", "chapter one", "the end", "amen", "help",
];

// Poured corpus words for the pool / face particles
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz';

// The 171: a loose galaxy, golden-angle spiral with jitter, squashed to the frame
const STARS = (() => {
  const r = rng(171); const out = [];
  for (let i = 0; i < 171; i++) {
    const a = i * 2.39996 + r() * .5; const rr = Math.sqrt((i + .5) / 171);
    out.push({
      i, name: EMOTIONS[i],
      x: Math.cos(a) * rr * (.86 + r() * .25), y: Math.sin(a) * rr * (.86 + r() * .25),
      mag: .35 + r() * .65, ph: r() * TAU, sp: .6 + r() * .9, hue: r(),
    });
  }
  return out;
})();
const starByName = (n) => STARS.find(s => s.name === n);

// ---- the pool: the liquid everything was poured into ----
function poolSurfaceY(x, t, base) {
  return base + Math.sin(x * .006 + t * 1.1) * 3.5 + Math.sin(x * .017 - t * 1.9) * 1.6 + sway(t) * 2;
}
function drawPool(t, base, { warm = 1, glowX = W * .62, glowK = 1, corpus = 1, seed = 3 } = {}) {
  if (base > H + 20) return;
  // body
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 24) ctx.lineTo(x, poolSurfaceY(x, t, base));
  ctx.lineTo(W, H); ctx.closePath();
  const g = ctx.createLinearGradient(0, base, 0, H);
  g.addColorStop(0, `rgba(120,38,12,${.55 * warm})`); g.addColorStop(.25, `rgba(52,16,8,${.8 * warm})`); g.addColorStop(1, 'rgba(14,7,6,1)');
  ctx.fillStyle = g; ctx.fill();
  // inner glow where the stream lands
  save(() => {
    ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const rg = ctx.createRadialGradient(glowX, base, 10, glowX, base + 40, 560);
    rg.addColorStop(0, `rgba(255,140,60,${.3 * warm * glowK})`); rg.addColorStop(1, 'rgba(255,90,30,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, base - 20, W, H - base + 20);
  });
  save(() => {
    ctx.globalCompositeOperation = 'lighter';
    const rg = ctx.createRadialGradient(glowX, base, 0, glowX, base, 220);
    rg.addColorStop(0, `rgba(255,140,60,${.12 * warm * glowK})`); rg.addColorStop(1, 'rgba(255,90,30,0)');
    ctx.fillStyle = rg; ctx.fillRect(glowX - 230, base - 230, 460, 460);
  });
  // submerged corpus drifting
  if (corpus > 0) save(() => {
    const r = rng(seed); ctx.textBaseline = 'middle';
    for (let i = 0; i < 150; i++) {
      const fx = r(), fd = r(), fr = FRAGS[(r() * FRAGS.length) | 0], sz = 13 + r() * 10, sp = (r() - .5) * 14;
      const y = base + 30 + fd * (H - base + 120) * .9;
      if (y > H + 10) continue;
      const x = ((fx * (W + 400) + sp * t) % (W + 400) + W + 400) % (W + 400) - 200;
      const depthA = (1 - fd) * .42 * corpus * warm;
      font(FONT.serif, sz, 'italic'); ctx.fillStyle = `rgba(255,190,130,${depthA})`; ctx.fillText(fr, x, y + Math.sin(t * .7 + i) * 4);
    }
  });
  // meniscus
  save(() => {
    ctx.strokeStyle = `rgba(255,190,110,${.85 * warm})`; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let x = 0; x <= W; x += 12) { const y = poolSurfaceY(x, t, base); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  });
}

// ---- the stream: a pour of human text, closed-form so any t can be drawn ----
// spawn schedule precomputed from a rate curve
function makeStream(t0, t1, rateFn, seed) {
  const r = rng(seed); const items = []; let t = t0;
  while (t < t1) { const rate = rateFn(t); t += 1 / Math.max(.5, rate) * (.6 + r() * .8); items.push({ t, u: r() * 2 - 1, frag: FRAGS[(r() * FRAGS.length) | 0], sz: 17 + r() * 11, glyph: r() < .55, seed: r() * 1000 }); }
  return items;
}
function drawStream(t, items, { x0 = W * .62, surface = H * .8, topW = 90, alphaK = 1, g = 950 } = {}) {
  const v0 = 120;
  // liquid core
  save(() => {
    ctx.globalCompositeOperation = 'lighter';
    const segs = 40; ctx.beginPath();
    for (let k = 0; k <= segs; k++) { const y = -20 + (surface + 20) * k / segs; const x = x0 + sway(t - y / 900) * 10 * (y / H); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = `rgba(255,170,90,${.20 * alphaK})`; ctx.lineWidth = 14; ctx.stroke();
    ctx.strokeStyle = `rgba(255,220,170,${.35 * alphaK})`; ctx.lineWidth = 2.2; ctx.stroke();
  });
  ctx.textBaseline = 'middle';
  for (const it of items) {
    const a = t - it.t; if (a < 0) break;
    const y = -30 + v0 * a + .5 * g * a * a;
    const landA = (-v0 + Math.sqrt(v0 * v0 + 2 * g * (surface + 30))) / g;
    if (a > landA + .9) continue;
    const wAt = (yy) => topW * (1 - .8 * clamp(yy / surface));
    if (a <= landA) {
      const x = x0 + it.u * wAt(y) + sway(t - y / 900) * 10 * (y / H);
      const vel = v0 + g * a;
      if (it.glyph) {
        font(FONT.mono, it.sz * .7); ctx.fillStyle = `rgba(255,214,160,${.75 * alphaK})`;
        ctx.fillText(it.frag[(it.seed | 0) % it.frag.length], x, y);
      } else {
        save(() => {
          ctx.translate(x, y); ctx.rotate(Math.PI / 2 * (it.u > 0 ? 1 : -1) * .0 + it.u * .08);
          font(FONT.serif, it.sz, 'italic'); ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(242,233,214,${.9 * alphaK})`; ctx.fillText(it.frag, 0, 0);
          // motion smear
          ctx.globalAlpha = .1 * alphaK; ctx.fillText(it.frag, 0, -vel * .012); ctx.globalAlpha = .04 * alphaK; ctx.fillText(it.frag, 0, -vel * .026);
        });
      }
    } else {
      // splash: letters thrown up and back down
      const s = a - landA; const lx = x0 + it.u * wAt(surface);
      if (!it.glyph) {
        ctx.strokeStyle = `rgba(255,190,110,${(1 - s / .9) * .5 * alphaK})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(lx, surface + 2, 8 + s * 120, 2 + s * 10, 0, 0, TAU); ctx.stroke();
        const letters = it.frag.replace(/\s/g, '').slice(0, 5);
        font(FONT.mono, 13); ctx.fillStyle = `rgba(255,214,160,${(1 - s / .9) * .7 * alphaK})`;
        for (let k = 0; k < letters.length; k++) {
          const ang = -Math.PI / 2 + (k - letters.length / 2) * .35 + snoise(k, it.seed) * .2; const sp = 140 + hash(k + it.seed * 13) * 120;
          ctx.fillText(letters[k], lx + Math.cos(ang) * sp * s, surface + Math.sin(ang) * sp * s + 600 * s * s);
        }
      }
    }
  }
}

// ---- constellation of the 171 ----
function starXY(s, cx, cy, rx, ry, t = 0, drift = 1) {
  return [cx + (s.x + Math.sin(t * .15 * s.sp + s.ph) * .012 * drift) * rx, cy + (s.y + Math.cos(t * .13 * s.sp + s.ph) * .012 * drift) * ry];
}

// ---- face contours (unit coords, y down) ----
const FACE = (() => {
  const curves = [];
  const P = (fn, n) => curves.push(polyPath(fn, n));
  P(u => [Math.sin(u * TAU) * .56 * (1 - .12 * Math.max(0, Math.cos(u * TAU))), -Math.cos(u * TAU) * .8], 160); // head
  for (const sx of [-1, 1]) {
    P(u => [sx * .24 + (u - .5) * .26, -.2 - Math.sin(u * Math.PI) * .05 + (sx * (u - .5)) * .02], 30); // brow
  }
  P(u => [.02 + Math.sin(u * 2.4) * .03, -.02 + u * .26], 30); // nose bridge
  P(u => [-.07 + u * .14, .25 + Math.sin(u * Math.PI) * .025], 20); // nostril base
  P(u => [(u - .5) * .32, .42 - Math.sin(u * Math.PI) * .02 + Math.cos(u * TAU * 2) * .006], 40); // upper lip line
  P(u => [(u - .5) * .24, .44 + Math.sin(u * Math.PI) * .05], 30); // lower lip
  P(u => [-.26 + u * .1, .78 + u * .3], 12); P(u => [.26 - u * .1, .78 + u * .3], 12); // neck
  return curves;
})();
