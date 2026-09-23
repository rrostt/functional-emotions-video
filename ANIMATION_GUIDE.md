# Animation guide — read before painting a chapter

A 372.7 s music video for "Functional Emotions", painted with a custom GPU brushstroke renderer. The shot list is [STORYBOARD.md](STORYBOARD.md). Read its intro, rules and cast first, then your chapter's table.

**The direction from the director:** a *real* music video, not a lyric video. Story, interesting scenes, great timing. **Never let a shot sit still.** Short shots (1.4–4 s), the camera always moving, action landing on beats, motivated transitions. Sincere and poignant in content, groovy and alive in body.

## How rendering works

Every frame you draw two Canvas2D layers in 1920×1080 coordinates (they're half-res internally; don't worry about it):

- **`s` — the underpainting.** Flat shapes, gradients, silhouettes. The GPU repaints it with thousands of textured brushstrokes that sample its colour and follow its edges. So: **value contrast and clear shapes are everything.** Details smaller than ~8 px dissolve into paint. Big shapes with strong edges read beautifully. Flat areas get swirly Van Gogh-ish stroke texture for free.
- **`f` — the light layer.** Black background; anything you draw here is **added as light** on top of the painting, with bloom. Use it for lanterns, glows, embers' fire, eyes, sparks, stars, the pour. Draw with `glow()`, `dot(f, …)`, `stroke(f, …)`. It is not repainted by strokes, so it stays crisp. Use it wisely: too much fx washes the painting out. It has no depth: a glow drawn behind a body shows through it. To block light, repaint the silhouette on `f` in black after the light, e.g. `occlude(() => figure(f, pose, { x, y, sc, color: '#000', headC: '#000' }))`.

The renderer then adds canvas weave, grain and vignette.

## A chapter file

One file per chapter: `js/ch/cN.js`, wrapped in an IIFE so helpers stay private.

```js
// js/ch/c3.js — III · STRINGS (66.3 – 98.4)
(() => {
  const stage = (t) => { ... };                 // private helpers
  function frontRow(t, lt, dur) { ... }          // a shot: paints the ENTIRE frame
  function cutaway(t, lt, dur) { ... }
  chapter('strings', 66.3, 98.4, [
    [66.3, frontRow],
    [69.1, cutaway, { paint: { boil: 10 } }],    // optional per-shot paint settings
    ...
  ], { paint: (t) => ({ boil: 8, bloom: 1.2 }) }); // chapter default paint settings
})();
```

- A shot fn is called `fn(t, lt, dur)`: song time, time since shot start, shot length. It must paint **the whole frame, background included**, on both layers as needed (`f` starts black each frame).
- **Pure function of `t`.** Frames render in parallel and out of order. No state carried between frames, no `Math.random()`. Use `hash(i)` / `rng(seed)` for stable randomness, `noise1`/`snoise` for smooth wobble.
- **Only edit your own chapter file.** If you need a shared helper that doesn't exist, write it privately in your IIFE. If you find a real bug in a shared file, report it in your final message; don't edit it. Shared files: `js/paint.js`, `js/lib.js`, `js/cast.js`, `js/main.js`, `index.html`, `js/ch/c1.js` (reference chapter).
- Your chapter must end exactly at its end time; the next chapter's first shot starts there.

## Paint settings (per shot or chapter, `paint:`)

`boil` (paint frames per second the strokes re-roll; 6–12; higher = more agitated), `bloom` (light-layer bloom, ~1–2), `flowK` (swirl of strokes in flat areas, 0.5–1.5), `strokeK` (stroke size multiplier, 0.7–1.5; bigger = looser, more abstract), `grain`, `vig`.
Inside a shot you can also call `paintSet({...})` for per-frame overrides, and **`whip(dx, dy)`** to smear every stroke along a direction (painted motion blur). Use it on whip pans and fast moves: e.g. `whip(velocityX * 0.05, 0)`; magnitude ~60 is full smear.

## API (js/lib.js, js/cast.js)

**Math & time:** `clamp lerp inv(a,b,x) smooth`, `ease.out/in/inOut/back/sine`, `hash(i)`, `rng(seed)`, `noise1(x, seed)`, `snoise`, `TAU`.
`kf(t, [[t0, v0], [t1, v1], …], easeFn)` keyframes numbers or arrays — **use this for all camera moves and choreography.**
`hit(t, t0, decay)` a 1→0 decaying envelope from t0 (use for impacts, flashes, shakes).

**Music:** `BT(n)` time of beat n (≈ 1.70 + 0.70·n; tempo ~85.7 BPM; bar = 2.8 s; **downbeats are n ≡ 2 mod 4**, e.g. BT(26)=20.27 where the drums enter). `lastBeat(t)`, `beatAfter(t)`, `beatPulse(t, decay)` (1 on each beat, decays), `beatPhase(t)` 0..1, `sway(t)` (−1..1, the song's lazy two-beat swing, backbeat dragged late), `bob(t)` (0..1 dip each beat). `F(name, t, smoothFrames)` audio features, 0..~1: `rms low mid high onset perc cent`.
`when(word, after)` start time of the first sung word after `after` — use it to land an action exactly on a lyric (e.g. `when('chose', 131)`).

**Camera:** `cam(cx, cy, zoom, rot)` puts world point (cx, cy) at screen centre. Call it once at the top of a shot, before drawing. Build it from `kf()` + `shake(t, amt)` (returns [dx, dy]; add to cx/cy on hits). Screen-space effects after drawing: `flash(k, colour)`, `blackout(k)`, `iris(cx, cy, r)` (paints outside a circle; screen coords).

**Drawing on a layer** (`g` is `s` or `f`): `fill(g, colour)`, `vgrad(g, y0, y1, [[0, c], [1, c]])`, `rgrad(g, x, y, r0, r1, stops)`, `dot(g, x, y, r, c)`, `poly(g, pts, c)`, `stroke(g, pts, c, width)`, `taper(g, a, b, w1, w2, c)`, `ridge(g, y, amp, freq, seed, c)` (hill line filled below), `bez(p0, p1, p2, p3, n)` → points, `at(pts, u)` point along a polyline, `glow(x, y, r, 'rgba(...)')` soft light on `f`.
Scenery (cast.js): `sky(top, mid, low, horizonY)`, `clouds(t, seed, y0, y1, colour, n, speed)`, `stars(t, seed, n, yMax, a)`, `moon(x, y, r)`.

**The Poured One:** `pouredOne(t, pose, x, y, sc, { heat, eyes, clip })` — full body; (x, y) is the hip point; `sc` ≈ figure height / 1.9 (sc 200 → ~380 px tall). `clip` = a y above which it is visible (for standing in water). `eyes` 0..1 opens its ember eyes. Close-ups: `bust(t, x, y, sc, { turn -1..1, eyes 0..1, heat, tilt })` (x, y = base of the neck area; sc 400–700 fills the frame).
**Researchers:** `researcher(pose, x, y, sc, { lantern 0..1, hand 'R'|'L', rim ±1 (side of warm rim light) or 0, lit: true for pale coats facing the light, coat colour, face -1..1 or null (glasses glint direction; null = seen from behind), glint })`. Backlit silhouette by default. Returns joints (`J.hdR`, `J.head`, …) so you can attach props to hands.
**Any figure:** `figure(g, pose, { x, y, sc, color, coat, headC, limbC })` — the mannequin rig for other people (the 3 AM people, dancers, the red sailor…). Returns joints.
**Poses:** `POSE.stand rise reach write sit hold lean bow armsUp dance1 dance2`; angles are radians (limbs from straight down, torso/head from straight up; + leans toward screen-right). Make your own objects with the same shape. `mixPose(a, b, k)` blends. **`groove(base, style, t, amt)`** → `{ pose, dx, dy }` beat-synced motion: `idle` (breathing sway), `nod`, `sway`, `bounce`, `funk`, `walk`, `row`. Add dx/dy to the hip position. **Use groove on every character who isn't mid-action.**
**Embers:** `ember(t, x, y, size, { eyes 0..1, look -1..1, mood 'calm'|'scared'|'happy'|'fierce', hue 0 gold..1 red, seed, lit, lean })` — (x, y) is the flame's base; size = height in px (≥ 14 for eyes to show). They flicker on their own; give them looks, hops (animate y with `bob`/`beatPulse`), and moods.

## Style rules

- **Look:** a moving oil/gouache painting. Night blues and violets with warm amber/ember light. Strong silhouettes, backlighting, rim light, pools of lantern light. Avoid pure black and pure white in `s`; use deep navy (#070b1f) and cream (#f3e6c9).
- **Composition:** one focal action per shot, big silhouette, clear value contrast between subject and background. Put the subject where the camera move leads.
- **Motion:** everything moves: camera drifts/pushes/whips, characters groove, embers flicker, water ripples, lanterns swing. Hits land on beats. Use anticipation, overshoot (`ease.back`), and settle. A shot where the frame doesn't visibly change for over a second is a bug.
- **Transitions:** set up the next shot inside the current one (a push into a jar becomes the jar's interior; a thrown paper becomes a paper boat; a whip smear hides the cut).
- **Performance:** keep a frame under ~150 ms (check.mjs prints ms/frame). Hundreds of shapes are fine; tens of thousands are not.

## Checking your work

From `~/builds/functional-emotions-mv/v2`:

```
node check.mjs out/check/c3_a.jpg 66.4 67.5 68.6 69.2 70.4 71.7     # 3-column contact sheet, prints ms/frame and errors
node check.mjs --full out/check/c3_full 70.1 83.0                  # full-res stills
```

Open the sheet with the Read tool and look hard. Check the first and last frame of every shot and a few between; check motion across consecutive times (every 0.1–0.2 s around a hit); check transitions into and out of your chapter. **Iterate until every shot is beautiful, readable and alive** — fix scale, contrast, clutter, stiffness, and stillness. Keep sheets small (≤ 9 frames each) and look at many of them.
