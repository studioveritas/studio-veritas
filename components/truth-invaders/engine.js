/*
 * TRUTH INVADERS — Studio Veritas secret arcade / 404 game
 * Zero-dependency canvas engine. Grayscale, retro, arrow-key controlled.
 *
 *   createGame(canvas, {
 *     mode: '404' | 'secret',        // changes the title-screen subtitle
 *     onExit: () => {},               // called on ESC (e.g. router.push('/'))
 *     fonts: { mono, display },       // canvas font-family strings
 *     prize: { title, code, line1, line2, line3 },
 *   }) -> { destroy, debug }
 *
 * Controls: ← → move · ↑ / Space fire · P pause · M sound · ESC exit
 * Touch: hold and drag to steer, auto-fire while touching.
 */
export function createGame(canvas, opts = {}) {
  const W = 480, H = 640;
  const ctx = canvas.getContext('2d');
  const G = (v, a = 1) => (a === 1 ? `rgb(${v},${v},${v})` : `rgba(${v},${v},${v},${a})`);
  const MONO = (opts.fonts && opts.fonts.mono) || '"IBM Plex Mono", ui-monospace, Menlo, monospace';
  const DISPLAY = (opts.fonts && opts.fonts.display) || '"Chakra Petch", "IBM Plex Mono", ui-monospace, monospace';
  const is404 = opts.mode !== 'secret';
  const prize = Object.assign(
    {
      title: 'SECRET PRIZE UNLOCKED',
      code: 'VERITAS-404',
      line1: 'Email this code to',
      line2: 'info@studio-veritas.com',
      line3: 'to claim your prize.',
    },
    opts.prize || {}
  );
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = (n, l = 6) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  /* ───────────────────────── sprites ───────────────────────── */
  const PAL = { X: 235, x: 160, o: 85, '#': 30 };
  function makeSprite(rows, white = false) {
    const w = Math.max(...rows.map((r) => r.length));
    const c = document.createElement('canvas');
    c.width = w; c.height = rows.length;
    const g = c.getContext('2d');
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) {
        const v = PAL[r[x]];
        if (v !== undefined) { g.fillStyle = G(white ? 255 : v); g.fillRect(x, y, 1, 1); }
      }
    });
    return c;
  }
  const SHIP = [
    '......X......',
    '.....XXX.....',
    '.....XXX.....',
    '....XXXXX....',
    '....XoooX....',
    '...XoX#XoX...',
    '...XXoooXX...',
    '..XXXXXXXXX..',
    '.XXXXXXXXXXX.',
    'XX..x...x..XX',
  ];
  const JUNK = {
    probe: [
      ['...XXX...', '..XXXXX..', '.XX#X#XX.', 'XXXXXXXXX', '.X.XXX.X.', 'X.......X'],
      ['...XXX...', '..XXXXX..', '.XX#X#XX.', 'XXXXXXXXX', '.X.XXX.X.', '.X.....X.'],
    ],
    drone: [
      ['...XXXXX...', '.XXXXXXXXX.', 'XXo.XXX.oXX', 'XXXXXXXXXXX', '..X.X.X.X..', '.X.......X.', 'X.........X'],
      ['...XXXXX...', '.XXXXXXXXX.', 'XXo.XXX.oXX', 'XXXXXXXXXXX', '..X.X.X.X..', '...X...X...', '..X.....X..'],
    ],
    sat: [
      ['xx.XXXXX.xx', 'xxXX.X.XXxx', 'xx.XXXXX.xx', '....X.X....', '...X...X...'],
      ['oo.XXXXX.oo', 'ooXX.X.XXoo', 'oo.XXXXX.oo', '....X.X....', '....X.X....'],
    ],
  };
  const HYPE = [
    '.....XXXXXX.....',
    '...XXXXXXXXXX...',
    '..XXoXXoXXoXXoXX',
    'XXXXXXXXXXXXXXXX',
    '..XXX..XX..XXX..',
    '...X........X...',
  ];
  function makeBoss(white) {
    const w = 36, h = 18;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = (x + 0.5 - w / 2) / (w / 2);
        const ny = (y + 0.5 - 8) / 8.2;
        const d = nx * nx + ny * ny;
        let v = -1;
        if (d < 1 && y < 14) v = d > 0.8 ? 235 : d > 0.5 ? 150 : 85;
        if (y === 11 && x % 3 === 0 && d < 0.9) v = 30; // vents
        if (y >= 13 && y < 18 && x > 4 && x < w - 5 && x % 4 === 2 && y - 13 < 2 + (x % 3)) v = 160; // tendrils
        if (y < 4 && (x === 7 || x === w - 8) ) v = 235; // horns
        if (y < 2 && (x === 6 || x === w - 7)) v = 235;
        if (v >= 0) { g.fillStyle = G(white ? 255 : v); g.fillRect(x, y, 1, 1); }
      }
    }
    return c;
  }
  const spr = {
    ship: makeSprite(SHIP),
    shipW: makeSprite(SHIP, true),
    hype: makeSprite(HYPE),
    boss: makeBoss(false),
    bossW: makeBoss(true),
    junk: {},
  };
  for (const k of Object.keys(JUNK)) spr.junk[k] = JUNK[k].map((f) => makeSprite(f));

  /* ───────────────────────── audio ───────────────────────── */
  let actx = null;
  let muted = store.get('ti_muted') === '1';
  function audio() {
    if (muted) return null;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (e) { return null; }
  }
  function tone(freq, dur, type = 'square', vol = 0.05, slide = 0, delay = 0) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + delay;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  let noiseBuf = null;
  function noise(dur = 0.3, vol = 0.12) {
    const a = audio(); if (!a) return;
    if (!noiseBuf) {
      noiseBuf = a.createBuffer(1, a.sampleRate * 1, a.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = a.createBufferSource(), g = a.createGain(), f = a.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900;
    s.buffer = noiseBuf;
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    s.connect(f).connect(g).connect(a.destination);
    s.start(); s.stop(a.currentTime + dur);
  }
  const sfx = {
    shoot: () => tone(980, 0.07, 'square', 0.03, -620),
    hit: () => tone(220, 0.06, 'square', 0.035, -80),
    pop: () => { noise(0.18, 0.08); tone(160, 0.12, 'triangle', 0.05, -100); },
    boom: () => { noise(0.5, 0.16); tone(90, 0.4, 'sawtooth', 0.05, -60); },
    pick: () => { tone(660, 0.06, 'square', 0.04); tone(990, 0.08, 'square', 0.04, 0, 0.06); },
    death: () => { noise(0.8, 0.18); tone(400, 0.7, 'sawtooth', 0.05, -360); },
    march: (i) => tone([98, 92, 87, 82][i % 4], 0.08, 'square', 0.04),
    start: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.1, 'square', 0.04, 0, i * 0.09)),
    clear: () => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'square', 0.04, 0, i * 0.08)),
    warn: () => { for (let i = 0; i < 3; i++) tone(180, 0.25, 'sawtooth', 0.05, 60, i * 0.5); },
    phase: () => { tone(120, 0.5, 'sawtooth', 0.06, -60); noise(0.4, 0.1); },
    beam: () => tone(70, 0.6, 'sawtooth', 0.06, 40),
    hype: () => tone(520, 0.3, 'triangle', 0.03, 260),
    win: () => [523, 659, 784, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, 'square', 0.045, 0, i * 0.13)),
    type: () => tone(1400, 0.015, 'square', 0.012),
  };

  /* ───────────────────────── sizing ───────────────────────── */
  let viewScale = 1;
  function resize() {
    const host = canvas.parentElement;
    const r = host ? host.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    const s = Math.max(0.3, Math.min(r.width / W, r.height / H));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewScale = s;
    canvas.style.width = Math.floor(W * s) + 'px';
    canvas.style.height = Math.floor(H * s) + 'px';
    canvas.width = Math.round(W * s * dpr);
    canvas.height = Math.round(H * s * dpr);
    ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    buildOverlays();
  }
  let scanPattern = null, vignette = null;
  function buildOverlays() {
    const p = document.createElement('canvas');
    p.width = 1; p.height = 3;
    const pg = p.getContext('2d');
    pg.fillStyle = 'rgba(0,0,0,0.28)'; pg.fillRect(0, 2, 1, 1);
    scanPattern = ctx.createPattern(p, 'repeat');
    vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.78);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
  }

  /* ───────────────────────── input ───────────────────────── */
  const keys = {};
  const pressed = new Set();
  const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'];
  function onKeyDown(e) {
    if (GAME_KEYS.includes(e.key)) e.preventDefault();
    if (!keys[e.key]) pressed.add(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    keys[e.key] = true;
    audio(); // unlock audio on first gesture
  }
  function onKeyUp(e) { keys[e.key] = false; }
  const touch = { active: false, x: W / 2 };
  function toGame(e) {
    const r = canvas.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * W;
  }
  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    touch.active = true;
    touch.x = toGame(e);
    pressed.add('tap');
    audio();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  }
  function onPointerMove(e) { if (touch.active) touch.x = toGame(e); }
  function onPointerUp() { touch.active = false; }
  const down = (...ks) => ks.some((k) => keys[k]);
  const hit = (...ks) => ks.some((k) => pressed.has(k));
  const startPressed = () => hit('ArrowUp', ' ', 'Enter', 'tap');

  /* ───────────────────────── state ───────────────────────── */
  let mode = 'title', modeT = 0, clock = 0, shake = 0, flash = 0;
  let S = null, P = null, F = null, boss = null, hype = null, review = null;
  let bullets = [], ebullets = [], rocks = [], parts = [], floaters = [], pickups = [], beams = [];
  let hi = parseInt(store.get('ti_hi') || '0', 10) || 0;
  const stars = [];
  for (let i = 0; i < 90; i++) stars.push({ x: rand(0, W), y: rand(0, H), z: [0.25, 0.5, 1][i % 3] });

  const LEVELS = {
    1: { name: 'NOISE', brief: 'Shatter 24 asteroids' },
    2: { name: 'CLUTTER', brief: 'Clear the junk fleet' },
    3: { name: 'THE BIG LIE', brief: 'Hold the line. Then face it.' },
  };

  function newRun(level = 1, keepStats = false) {
    const prev = S;
    S = {
      score: 0, lives: 3, level, shots: 0, hits: 0, deaths: 0, continues: 0, time: 0,
      kills: { rock: 0, junk: 0, hype: 0, boss: 0 },
      prog: 0, goal: 24, spawnT: 1, hypeT: rand(10, 14), rockT: 4,
      twin: 0, shield: 0, banner: null, phase: 'wave', bossWarn: 0, newHi: false,
    };
    if (keepStats && prev) {
      S.shots = prev.shots; S.hits = prev.hits; S.deaths = prev.deaths; S.time = prev.time;
      S.kills = prev.kills; S.continues = prev.continues + 1;
    }
    P = { x: W / 2, y: H - 58, w: 18, h: 14, cd: 0, inv: 0, alive: true, tilt: 0 };
    rocks = []; bullets = []; ebullets = []; pickups = []; beams = []; floaters = [];
    sfx.start();
    startLevel(level);
  }

  function startLevel(n) {
    S.level = n; S.prog = 0; S.phase = 'wave'; S.bossWarn = 0;
    F = null; boss = null; hype = null; beams = []; ebullets = [];
    if (n === 2) F = buildFormation(8, 4, 22, 1.0);
    if (n === 3) F = buildFormation(7, 3, 34, 0.7);
    mode = 'intro'; modeT = 2.4;
  }

  function buildFormation(cols, rows, speed, fireBase) {
    const order = rows === 4 ? ['probe', 'drone', 'drone', 'sat'] : ['probe', 'drone', 'sat'];
    const pts = { probe: 60, drone: 40, sat: 30 };
    const list = [];
    const sx = (W - (cols - 1) * 44) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = order[r];
        const fr = spr.junk[type][0];
        list.push({ type, col: c, x: sx + c * 44, y: 96 + r * 36, w: fr.width * 2, h: fr.height * 2, pts: pts[type], alive: true });
      }
    }
    return { list, total: list.length, dir: 1, base: speed, step: 14, animT: 0, frame: 0, fireT: 2, fireBase };
  }

  /* ───────────────────────── helpers ───────────────────────── */
  const overlap = (a, b) => Math.abs(a.x - b.x) * 2 < a.w + b.w && Math.abs(a.y - b.y) * 2 < a.h + b.h;
  const circRect = (c, r) => {
    const dx = Math.max(Math.abs(c.x - r.x) - r.w / 2, 0);
    const dy = Math.max(Math.abs(c.y - r.y) - r.h / 2, 0);
    return dx * dx + dy * dy < c.r * c.r;
  };
  function burst(x, y, n = 14, spd = 140, shade = 220, size = 3) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), v = rand(spd * 0.3, spd);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: rand(0.3, 0.8), s: Math.ceil(rand(1, size)), c: shade - Math.floor(rand(0, 90)) });
    }
  }
  function floater(x, y, text) { floaters.push({ x, y, text, t: 1 }); }
  function addScore(n, x, y) { S.score += n; if (x !== undefined) floater(x, y, '+' + n); }

  function makeRock(size, x, y, vx, vy) {
    const r = [0, 9, 16, 26][size];
    const n = 9 + size * 2;
    const pts = [];
    for (let i = 0; i < n; i++) pts.push(r * rand(0.72, 1.05));
    rocks.push({ size, x, y, vx, vy, r, hp: [0, 1, 1, 3][size], pts, rot: rand(0, 6.28), vr: rand(-1.5, 1.5), flash: 0,
      craters: [[rand(-0.4, 0.3), rand(-0.4, 0.3), rand(0.12, 0.22)], [rand(-0.2, 0.4), rand(-0.1, 0.4), rand(0.08, 0.16)]] });
  }

  function maybeDrop(x, y, chance) {
    if (Math.random() > chance) return;
    const roll = Math.random();
    const type = roll < 0.5 ? 'twin' : roll < 0.88 || S.lives >= 5 ? 'shield' : 'life';
    pickups.push({ x, y, vy: 75, w: 16, h: 16, type, t: 0 });
  }

  function playerHit() {
    if (!P.alive || P.inv > 0 || mode !== 'play') return;
    if (S.shield > 0) {
      S.shield = 0; P.inv = 1.2; burst(P.x, P.y, 18, 160, 255, 2); sfx.hit(); shake = 4;
      return;
    }
    S.lives--; S.deaths++; S.twin = 0;
    P.alive = false;
    burst(P.x, P.y, 40, 220, 255, 4); shake = 12; flash = 0.35; sfx.death();
    ebullets = []; beams = [];
    if (S.lives <= 0) { mode = 'over'; modeT = 1.2; saveHi(); }
    else { mode = 'respawn'; modeT = 1.6; }
  }

  function saveHi() {
    if (S.score > hi) { hi = S.score; S.newHi = true; store.set('ti_hi', String(hi)); }
  }

  function levelClear() {
    const bonus = 1000 * S.level + S.lives * 250;
    S.score += bonus;
    S.banner = { text: `LEVEL ${S.level} CLEAR`, sub: `BONUS +${bonus}`, t: 2.4 };
    rocks.forEach((r) => burst(r.x, r.y, 8, 90, 180)); rocks = [];
    ebullets = [];
    mode = 'clear'; modeT = 2.6;
    sfx.clear();
  }

  /* ───────────────────────── update ───────────────────────── */
  function update(dt) {
    clock += dt;
    for (const s of stars) {
      s.y += (mode === 'title' ? 18 : 40) * s.z * dt * (S && S.level === 3 ? 1.6 : 1);
      if (s.y > H) { s.y = 0; s.x = rand(0, W); }
    }
    parts = parts.filter((p) => ((p.t -= dt), (p.x += p.vx * dt), (p.y += p.vy * dt), (p.vx *= 0.98), (p.vy *= 0.98), p.t > 0));
    floaters = floaters.filter((f) => ((f.t -= dt), (f.y -= 30 * dt), f.t > 0));
    shake = Math.max(0, shake - dt * 30);
    flash = Math.max(0, flash - dt * 1.5);
    if (S && S.banner) { S.banner.t -= dt; if (S.banner.t <= 0) S.banner = null; }

    if (hit('m')) { muted = !muted; store.set('ti_muted', muted ? '1' : '0'); }
    if (hit('Escape')) {
      if (opts.onExit && mode !== 'title') { mode = 'title'; opts.onExit(); return; }
      if (opts.onExit && mode === 'title') { opts.onExit(); return; }
      goTitle(); return;
    }

    switch (mode) {
      case 'title':
        if (rocks.length < 5 && Math.random() < 0.02) makeRock(1 + Math.floor(rand(0, 3)), rand(20, W - 20), -30, rand(-15, 15), rand(15, 35));
        moveRocks(dt, false);
        if (startPressed()) newRun(1);
        break;
      case 'intro':
        modeT -= dt;
        controlPlayer(dt, false);
        if (modeT <= 0) mode = 'play';
        break;
      case 'play':
        if (hit('p')) { mode = 'paused'; break; }
        world(dt, true);
        break;
      case 'paused':
        if (hit('p') || startPressed()) mode = 'play';
        break;
      case 'respawn':
        modeT -= dt;
        world(dt, false);
        if (modeT <= 0) { P.alive = true; P.x = W / 2; P.inv = 2.2; mode = 'play'; }
        break;
      case 'clear':
        modeT -= dt;
        controlPlayer(dt, true);
        moveBullets(dt);
        movePickups(dt);
        if (modeT <= 0) startLevel(S.level + 1);
        break;
      case 'bossdeath':
        bossDeath(dt);
        break;
      case 'over':
        modeT -= dt;
        moveRocks(dt, false);
        if (modeT <= 0 && startPressed()) newRun(S.level, true);
        break;
      case 'review':
        updateReview(dt);
        break;
    }
    pressed.clear();
  }

  function goTitle() { mode = 'title'; S = null; rocks = []; boss = null; F = null; hype = null; ebullets = []; bullets = []; pickups = []; beams = []; }

  function controlPlayer(dt, canFire) {
    if (!P.alive) return;
    let dx = (down('ArrowLeft') ? -1 : 0) + (down('ArrowRight') ? 1 : 0);
    if (touch.active) dx = clamp((touch.x - P.x) / 18, -1, 1);
    P.x = clamp(P.x + dx * 260 * dt, 16, W - 16);
    P.tilt += (dx - P.tilt) * Math.min(1, dt * 12);
    P.inv = Math.max(0, P.inv - dt);
    P.cd -= dt;
    S.twin = Math.max(0, S.twin - dt);
    if (S.shield > 0) S.shield = Math.max(0, S.shield - dt);
    const firing = down('ArrowUp', ' ', 'Spacebar') || touch.active;
    if (canFire && firing && P.cd <= 0 && bullets.length < 8) {
      if (S.twin > 0) {
        bullets.push({ x: P.x - 7, y: P.y - 10, w: 2, h: 10, vy: -560 }, { x: P.x + 7, y: P.y - 10, w: 2, h: 10, vy: -560 });
        S.shots += 2; P.cd = 0.17;
      } else {
        bullets.push({ x: P.x, y: P.y - 12, w: 2, h: 10, vy: -560 });
        S.shots += 1; P.cd = 0.24;
      }
      sfx.shoot();
    }
  }

  function moveBullets(dt) {
    bullets = bullets.filter((b) => ((b.y += b.vy * dt), b.y > -20 && !b.dead));
  }
  function movePickups(dt) {
    pickups = pickups.filter((p) => {
      p.y += p.vy * dt; p.t += dt;
      if (P.alive && overlap(p, P)) {
        if (p.type === 'twin') { S.twin = 10; floater(p.x, p.y, 'TWIN SHOT'); }
        if (p.type === 'shield') { S.shield = 14; floater(p.x, p.y, 'SHIELD'); }
        if (p.type === 'life') { S.lives = Math.min(5, S.lives + 1); floater(p.x, p.y, '1UP'); }
        sfx.pick(); addScore(100);
        return false;
      }
      return p.y < H + 20;
    });
  }
  function moveRocks(dt, collide) {
    rocks = rocks.filter((r) => {
      r.x += r.vx * dt; r.y += r.vy * dt; r.rot += r.vr * dt; r.flash = Math.max(0, r.flash - dt);
      if (collide && P.alive && circRect({ x: r.x, y: r.y, r: r.r * 0.8 }, P)) { playerHit(); burst(r.x, r.y, 10); return false; }
      return r.y < H + 40 && r.x > -60 && r.x < W + 60;
    });
  }

  function world(dt, alive) {
    S.time += dt;
    if (alive) controlPlayer(dt, true);
    moveBullets(dt);
    // enemy bullets
    ebullets = ebullets.filter((b) => {
      b.x += b.vx * dt; b.y += b.vy * dt; b.t = (b.t || 0) + dt;
      if (P.alive && overlap(b, P)) { playerHit(); return false; }
      return b.y < H + 20 && b.y > -40 && b.x > -20 && b.x < W + 20;
    });
    moveRocks(dt, true);
    movePickups(dt);

    // level logic
    if (S.level === 1) {
      S.spawnT -= dt;
      if (S.spawnT <= 0) {
        S.spawnT = Math.max(0.45, rand(0.8, 1.35) - S.prog * 0.02);
        const roll = Math.random();
        const size = roll < 0.5 ? 3 : roll < 0.85 ? 2 : 1;
        makeRock(size, rand(30, W - 30), -30, rand(-40, 40), rand(55, 95) + S.prog * 1.6);
      }
    } else {
      S.rockT -= dt;
      if (S.rockT <= 0 && S.phase !== 'warn') {
        S.rockT = rand(3, 5.5);
        makeRock(Math.random() < 0.6 ? 1 : 2, rand(30, W - 30), -30, rand(-30, 30), rand(70, 110));
      }
      if (S.phase === 'wave') {
        S.hypeT -= dt;
        if (S.hypeT <= 0 && !hype) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          hype = { x: dir > 0 ? -20 : W + 20, y: 64, vx: dir * 95, w: 32, h: 12 };
          S.hypeT = rand(14, 20);
          sfx.hype();
        }
      }
    }
    if (hype) { hype.x += hype.vx * dt; if (hype.x < -40 || hype.x > W + 40) hype = null; }
    if (F) updateFormation(dt);
    if (S.phase === 'warn') {
      S.bossWarn -= dt;
      if (S.bossWarn <= 0) spawnBoss();
    }
    if (boss) updateBoss(dt);
    updateBeams(dt);
    collideBullets();

    // completion
    if (mode !== 'play' && mode !== 'respawn') return;
    if (S.level === 1 && S.prog >= S.goal) levelClear();
    else if (S.level === 2 && F && F.list.every((j) => !j.alive)) levelClear();
    else if (S.level === 3 && S.phase === 'wave' && F && F.list.every((j) => !j.alive)) {
      F = null; hype = null; S.phase = 'warn'; S.bossWarn = 2.8; sfx.warn();
    }
  }

  function updateFormation(dt) {
    const alive = F.list.filter((j) => j.alive);
    if (!alive.length) return;
    const speed = F.base + (1 - alive.length / F.total) * F.base * 2.4;
    let minX = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const j of alive) { j.x += F.dir * speed * dt; minX = Math.min(minX, j.x - j.w / 2); maxX = Math.max(maxX, j.x + j.w / 2); maxY = Math.max(maxY, j.y + j.h / 2); }
    if ((maxX > W - 10 && F.dir > 0) || (minX < 10 && F.dir < 0)) {
      F.dir *= -1;
      for (const j of alive) j.y += F.step;
    }
    const prevFrame = Math.floor(F.animT);
    F.animT += dt * (speed / 28);
    if (Math.floor(F.animT) !== prevFrame) { F.frame = Math.floor(F.animT) % 2; sfx.march(Math.floor(F.animT)); }
    if (maxY > P.y - 24) {
      // the junk breached the line
      if (P.alive && mode === 'play') playerHit();
      for (const j of F.list) j.y -= 120;
    }
    F.fireT -= dt;
    if (F.fireT <= 0) {
      F.fireT = F.fireBase * rand(0.6, 1.3) * (0.45 + (alive.length / F.total) * 0.55);
      const pick = alive[Math.floor(Math.random() * alive.length)];
      let shooter = pick;
      for (const j of alive) if (j.col === pick.col && j.y > shooter.y) shooter = j;
      ebullets.push({ x: shooter.x, y: shooter.y + 10, vx: 0, vy: S.level === 3 ? 240 : 200, w: 4, h: 10, kind: 'bolt' });
    }
  }

  function spawnBoss() {
    S.phase = 'boss';
    boss = { x: W / 2, y: -80, w: 160, h: 70, hp: 120, max: 120, t: 0, phase: 1, fireT: 2, rockT: 5, beamT: 4, flash: 0, entering: true, deathT: 0, sparkT: 0 };
    S.banner = { text: 'THE BIG LIE', sub: 'BOSS FIGHT', t: 2.2 };
  }

  function updateBoss(dt) {
    const b = boss;
    b.t += dt; b.flash = Math.max(0, b.flash - dt);
    if (b.entering) {
      b.y += (130 - b.y) * Math.min(1, dt * 1.6);
      if (b.y > 125) b.entering = false;
      return;
    }
    const sp = [0, 0.6, 0.85, 1.15][b.phase];
    b.x = W / 2 + Math.sin(b.t * sp) * 140;
    b.y = 130 + Math.sin(b.t * 1.3) * 12;
    const ang0 = Math.PI / 2;
    b.fireT -= dt;
    if (b.fireT <= 0) {
      const n = b.phase === 3 ? 7 : 5;
      if (b.phase !== 2 || Math.random() < 0.5) {
        for (let i = 0; i < n; i++) {
          const a = ang0 + (i - (n - 1) / 2) * 0.22;
          ebullets.push({ x: b.x, y: b.y + 34, vx: Math.cos(a) * 170, vy: Math.sin(a) * 170, w: 7, h: 7, kind: 'orb' });
        }
      }
      if (b.phase >= 2) {
        const a = Math.atan2(P.y - b.y, P.x - b.x);
        for (let i = -1; i <= 1; i++) ebullets.push({ x: b.x, y: b.y + 30, vx: Math.cos(a + i * 0.12) * 230, vy: Math.sin(a + i * 0.12) * 230, w: 6, h: 6, kind: 'orb' });
      }
      b.fireT = [0, 1.25, 0.95, 0.85][b.phase];
    }
    if (b.phase >= 2) {
      b.rockT -= dt;
      if (b.rockT <= 0) { b.rockT = 5; makeRock(2, b.x - 40, b.y + 20, -50, 90); makeRock(2, b.x + 40, b.y + 20, 50, 90); }
    }
    if (b.phase === 3) {
      b.beamT -= dt;
      if (b.beamT <= 0) { b.beamT = 5.5; beams.push({ x: P.x, t: 0, warn: 0.9, fire: 0.65 }); }
    }
  }

  function updateBeams(dt) {
    beams = beams.filter((bm) => {
      const was = bm.t;
      bm.t += dt;
      if (was < bm.warn && bm.t >= bm.warn) { sfx.beam(); shake = 6; }
      if (bm.t >= bm.warn && P.alive && Math.abs(P.x - bm.x) < 14 + P.w / 2) playerHit();
      return bm.t < bm.warn + bm.fire;
    });
  }

  function damageBoss(b) {
    if (boss.entering) { burst(b.x, b.y, 3, 60, 255, 1); return; }
    boss.hp -= 1; boss.flash = 0.06; S.hits++;
    S.score += 10;
    burst(b.x, b.y, 4, 80, 255, 2);
    sfx.hit();
    const ph = boss.hp / boss.max > 0.66 ? 1 : boss.hp / boss.max > 0.33 ? 2 : 3;
    if (ph > boss.phase) {
      boss.phase = ph; shake = 10; flash = 0.25; sfx.phase();
      S.banner = ph === 2 ? { text: 'PHASE 2', sub: 'DOUBLING DOWN', t: 2 } : { text: 'PHASE 3', sub: 'FULL DENIAL', t: 2 };
    }
    if (boss.hp <= 0) {
      S.kills.boss = 1;
      S.score += 5000;
      floater(boss.x, boss.y, '+5000');
      ebullets = []; beams = [];
      rocks.forEach((r) => burst(r.x, r.y, 8)); rocks = [];
      mode = 'bossdeath'; modeT = 3.4;
    }
  }

  function bossDeath(dt) {
    modeT -= dt;
    controlPlayer(dt, false);
    if (boss) {
      boss.sparkT -= dt;
      boss.flash = Math.random() < 0.5 ? 0.05 : 0;
      if (boss.sparkT <= 0) {
        boss.sparkT = 0.09;
        burst(boss.x + rand(-80, 80), boss.y + rand(-35, 35), 16, 160, 255, 4);
        noise(0.25, 0.1);
        shake = 8;
      }
      if (modeT < 0.6) {
        burst(boss.x, boss.y, 120, 320, 255, 5);
        flash = 1; shake = 18; sfx.boom();
        boss = null;
      }
    }
    if (modeT <= -1.2) startReview();
  }

  function collideBullets() {
    for (const b of bullets) {
      if (b.dead) continue;
      // rocks
      for (const r of rocks) {
        if (circRect({ x: r.x, y: r.y, r: r.r }, b)) {
          b.dead = true; S.hits++; r.hp--; r.flash = 0.06;
          if (r.hp <= 0) {
            r.dead = true;
            burst(r.x, r.y, 8 + r.size * 6, 60 + r.size * 40, 210, r.size + 1);
            const pts = [0, 100, 50, 20][r.size];
            addScore(pts, r.x, r.y);
            S.kills.rock++;
            if (S.level === 1) S.prog++;
            sfx.pop();
            if (r.size > 1) {
              for (const d of [-1, 1]) makeRock(r.size - 1, r.x + d * 6, r.y, r.vx + d * rand(40, 80), r.vy * 0.8 + rand(-10, 20));
            }
            maybeDrop(r.x, r.y, S.level === 1 ? 0.07 : 0.05);
          } else sfx.hit();
          break;
        }
      }
      if (b.dead) continue;
      // formation
      if (F) {
        for (const j of F.list) {
          if (j.alive && overlap(b, j)) {
            j.alive = false; b.dead = true; S.hits++; S.kills.junk++;
            addScore(j.pts * S.level, j.x, j.y);
            burst(j.x, j.y, 14, 120, 230, 3); sfx.pop();
            maybeDrop(j.x, j.y, 0.04);
            break;
          }
        }
      }
      if (b.dead) continue;
      if (hype && overlap(b, hype)) {
        b.dead = true; S.hits++; S.kills.hype++;
        addScore(300, hype.x, hype.y); floater(hype.x, hype.y + 14, 'HYPE BUSTED');
        burst(hype.x, hype.y, 26, 160, 255, 3); sfx.boom();
        maybeDrop(hype.x, hype.y, 1);
        hype = null; continue;
      }
      if (boss && mode === 'play' && overlap(b, boss)) { b.dead = true; damageBoss(b); }
    }
    rocks = rocks.filter((r) => !r.dead);
    bullets = bullets.filter((b) => !b.dead);
  }

  /* ───────────────────────── review ───────────────────────── */
  function startReview() {
    saveHi();
    const acc = S.shots ? S.hits / S.shots : 0;
    const aim = Math.round(clamp(acc * 130, 10, 100));
    const nerve = Math.round(clamp(100 - S.deaths * 18 - S.continues * 15, 10, 100));
    const speed = Math.round(clamp(100 - (S.time - 170) / 2.2, 15, 100));
    const truth = 100;
    const overall = Math.round(((aim + nerve + speed + truth) / 4) * 10) / 100; // x/10
    const grade = overall >= 9 ? 'S' : overall >= 8 ? 'A' : overall >= 6.5 ? 'B' : 'C';
    const verdict =
      overall >= 9 ? 'A modern classic. Ruthlessly true, wildly memorable. Ten out of ten studios agree.'
      : overall >= 8 ? 'Sharp, noticeable and memorable. The big lie never stood a chance.'
      : overall >= 6.5 ? 'Solid run. A few dents, but the truth got there in the end.'
      : 'Rough around the edges, but honest. That counts for a lot. Go again?';
    review = { t: 0, typed: 0, aim, nerve, speed, truth, overall, grade, verdict, acc };
    mode = 'review';
    sfx.win();
  }
  function updateReview(dt) {
    review.t += dt;
    if (review.t > 2.4) {
      const before = Math.floor(review.typed);
      review.typed = Math.min(review.verdict.length, review.typed + dt * 45);
      if (Math.floor(review.typed) !== before && Math.floor(review.typed) % 2 === 0) sfx.type();
    }
    if (review.t > 4.5 && startPressed()) newRun(1);
  }

  /* ───────────────────────── draw ───────────────────────── */
  function text(str, x, y, size, o = {}) {
    ctx.font = `${o.weight || 400} ${size}px ${o.font || MONO}`;
    ctx.textAlign = o.align || 'center';
    ctx.textBaseline = o.base || 'alphabetic';
    if ('letterSpacing' in ctx) ctx.letterSpacing = (o.ls || 0) + 'px';
    ctx.fillStyle = o.color || G(235);
    ctx.fillText(str, x, y);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }
  function wrap(str, maxW, size, font = MONO) {
    ctx.font = `400 ${size}px ${font}`;
    const words = str.split(' ');
    const lines = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  const blink = (rate = 2) => Math.floor(clock * rate) % 2 === 0;

  function drawStars() {
    for (const s of stars) {
      ctx.fillStyle = G(s.z === 1 ? 200 : s.z === 0.5 ? 120 : 70);
      const len = S && S.level === 3 && s.z === 1 ? 3 : 1;
      ctx.fillRect(s.x | 0, s.y | 0, s.z === 1 ? 2 : 1, len * (s.z === 1 ? 2 : 1));
    }
  }

  function drawRock(r) {
    ctx.save();
    ctx.translate(r.x | 0, r.y | 0);
    ctx.rotate(r.rot);
    ctx.beginPath();
    r.pts.forEach((rad, i) => {
      const a = (i / r.pts.length) * Math.PI * 2;
      const px = Math.round(Math.cos(a) * rad), py = Math.round(Math.sin(a) * rad);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = r.flash > 0 ? G(255) : G(r.size === 3 ? 70 : r.size === 2 ? 90 : 110);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = G(205);
    ctx.stroke();
    if (r.flash <= 0) {
      ctx.fillStyle = G(45);
      for (const [cx, cy, cr] of r.craters) ctx.fillRect(Math.round(cx * r.r), Math.round(cy * r.r), Math.max(2, Math.round(cr * r.r * 1.6)), Math.max(2, Math.round(cr * r.r * 1.6)));
    }
    ctx.restore();
  }

  function drawShip(x, y, scale = 2, white = false, tilt = 0) {
    const im = white ? spr.shipW : spr.ship;
    const w = im.width * scale * (1 - Math.abs(tilt) * 0.12), h = im.height * scale;
    ctx.drawImage(im, Math.round(x - w / 2), Math.round(y - h / 2), Math.round(w), h);
  }

  function drawBoss() {
    const b = boss;
    const im = b.flash > 0 ? spr.bossW : spr.boss;
    const sw = im.width * 5, sh = im.height * 5;
    const bx = Math.round(b.x - sw / 2), by = Math.round(b.y - sh / 2 + 5);
    ctx.drawImage(im, bx, by, sw, sh);
    // the eye of the lie — it watches you
    const ex = Math.round(b.x), ey = Math.round(b.y - 2);
    ctx.fillStyle = G(b.flash > 0 ? 255 : 230);
    ctx.beginPath(); ctx.ellipse(ex, ey, 30, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = G(30); ctx.lineWidth = 3; ctx.stroke();
    if (b.phase === 3) {
      ctx.strokeStyle = G(130); ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(ex - 28 + i * 3, ey - 6 + i * 3); ctx.lineTo(ex - 16 + i * 2, ey - 2 + i); ctx.stroke(); }
    }
    const look = Math.atan2(P.y - ey, P.x - ex);
    const px = ex + Math.cos(look) * 13, py = ey + Math.sin(look) * 5;
    const pr = b.phase === 3 ? 6 : 9;
    ctx.fillStyle = G(15);
    ctx.fillRect(Math.round(px - pr), Math.round(py - pr), pr * 2, pr * 2);
    ctx.fillStyle = G(255);
    ctx.fillRect(Math.round(px - pr + 2), Math.round(py - pr + 2), 3, 3);
  }

  function drawWorld() {
    // ground line
    ctx.fillStyle = G(55); ctx.fillRect(0, H - 28, W, 1);
    for (const r of rocks) drawRock(r);
    if (F) {
      for (const j of F.list) {
        if (!j.alive) continue;
        const im = spr.junk[j.type][F.frame];
        ctx.drawImage(im, Math.round(j.x - j.w / 2), Math.round(j.y - j.h / 2), j.w, j.h);
      }
    }
    if (hype) ctx.drawImage(spr.hype, Math.round(hype.x - 16), Math.round(hype.y - 6), 32, 12);
    if (boss) drawBoss();
    // beams
    for (const bm of beams) {
      const top = boss ? boss.y + 30 : 0;
      if (bm.t < bm.warn) {
        if (blink(14)) { ctx.fillStyle = G(200, 0.6); for (let y = top; y < H; y += 10) ctx.fillRect(bm.x - 1, y, 2, 5); }
      } else {
        const k = 1 - (bm.t - bm.warn) / bm.fire;
        ctx.fillStyle = G(160, 0.5 * k + 0.2); ctx.fillRect(bm.x - 16, top, 32, H - top);
        ctx.fillStyle = G(255, 0.9); ctx.fillRect(bm.x - 7, top, 14, H - top);
      }
    }
    // pickups
    for (const p of pickups) {
      const on = Math.floor(p.t * 6) % 2 === 0;
      ctx.fillStyle = G(on ? 235 : 150);
      ctx.fillRect(Math.round(p.x - 8), Math.round(p.y - 8), 16, 16);
      ctx.fillStyle = G(15);
      ctx.fillRect(Math.round(p.x - 6), Math.round(p.y - 6), 12, 12);
      text(p.type === 'twin' ? 'T' : p.type === 'shield' ? 'S' : '+', p.x, p.y + 4, 11, { weight: 600, color: G(on ? 255 : 200) });
    }
    // bullets
    ctx.fillStyle = G(255);
    for (const b of bullets) ctx.fillRect(Math.round(b.x - 1), Math.round(b.y - 5), 2, 10);
    for (const b of ebullets) {
      if (b.kind === 'bolt') {
        ctx.fillStyle = G(200);
        const o = Math.floor(b.t * 20) % 2 ? 1 : -1;
        ctx.fillRect(Math.round(b.x - 1 + o), Math.round(b.y - 5), 2, 3);
        ctx.fillRect(Math.round(b.x - 1 - o), Math.round(b.y - 2), 2, 3);
        ctx.fillRect(Math.round(b.x - 1 + o), Math.round(b.y + 1), 2, 3);
      } else {
        ctx.fillStyle = G(240); ctx.fillRect(Math.round(b.x - 3), Math.round(b.y - 3), 6, 6);
        ctx.fillStyle = G(60); ctx.fillRect(Math.round(b.x - 1), Math.round(b.y - 1), 2, 2);
      }
    }
    // player
    if (P && P.alive && !(P.inv > 0 && blink(16))) {
      drawShip(P.x, P.y, 2, false, P.tilt);
      if (S.shield > 0) {
        ctx.strokeStyle = G(220, S.shield < 3 && blink(8) ? 0.3 : 0.8); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(Math.round(P.x), Math.round(P.y), 20, 0, Math.PI * 2); ctx.stroke();
      }
      if (down('ArrowUp', ' ') || touch.active) { ctx.fillStyle = G(blink(20) ? 255 : 150); ctx.fillRect(Math.round(P.x - 1), Math.round(P.y + 11), 2, 4); }
    }
    // particles
    for (const p of parts) { ctx.fillStyle = G(p.c, Math.min(1, p.t * 2)); ctx.fillRect(p.x | 0, p.y | 0, p.s, p.s); }
    for (const f of floaters) text(f.text, f.x, f.y, 10, { color: G(230, Math.min(1, f.t * 1.5)), weight: 500 });
  }

  function drawHUD() {
    ctx.fillStyle = G(8, 0.75); ctx.fillRect(0, 0, W, 48);
    ctx.fillStyle = G(60); ctx.fillRect(0, 48, W, 1);
    text('SCORE', 14, 16, 9, { align: 'left', color: G(130), ls: 2 });
    text(pad(S.score), 14, 34, 16, { align: 'left', weight: 500 });
    text('HI', W / 2, 16, 9, { color: G(130), ls: 2 });
    text(pad(Math.max(hi, S.score)), W / 2, 34, 16, { weight: 500, color: G(190) });
    for (let i = 0; i < S.lives; i++) ctx.drawImage(spr.ship, W - 24 - i * 22, 12, 16, 12);
    text(`LVL 0${S.level} · ${LEVELS[S.level].name}`, W - 14, 40, 9, { align: 'right', color: G(150), ls: 1 });
    // bottom bar
    let status = '';
    if (S.level === 1) status = `ASTEROIDS ${Math.min(S.prog, S.goal)}/${S.goal}`;
    else if (F) status = `JUNK LEFT ${F.list.filter((j) => j.alive).length}`;
    else if (boss) status = 'DEFEAT THE BIG LIE';
    text(status, 14, H - 10, 10, { align: 'left', color: G(150), ls: 1 });
    const pw = [];
    if (S.twin > 0) pw.push(`TWIN ${Math.ceil(S.twin)}`);
    if (S.shield > 0) pw.push(`SHIELD ${Math.ceil(S.shield)}`);
    text(pw.join('  ·  '), W - 14, H - 10, 10, { align: 'right', color: G(220), ls: 1 });
    if (S.level === 1) {
      ctx.fillStyle = G(40); ctx.fillRect(14, H - 24, W - 28, 3);
      ctx.fillStyle = G(200); ctx.fillRect(14, H - 24, (W - 28) * Math.min(1, S.prog / S.goal), 3);
    }
    if (boss) {
      text('THE BIG LIE', W / 2, 66, 10, { weight: 600, ls: 3, color: G(220) });
      ctx.strokeStyle = G(160); ctx.lineWidth = 1; ctx.strokeRect(60.5, 72.5, W - 121, 7);
      ctx.fillStyle = G(boss.flash > 0 ? 255 : 210);
      ctx.fillRect(62, 74, (W - 124) * Math.max(0, boss.hp / boss.max), 4);
      ctx.fillStyle = G(8); [0.33, 0.66].forEach((k) => ctx.fillRect(62 + (W - 124) * k, 73, 2, 6));
    }
    if (muted) text('SOUND OFF', W / 2, H - 10, 9, { color: G(110), ls: 2 });
  }

  function drawCenter(title, sub, extra) {
    ctx.fillStyle = G(0, 0.55); ctx.fillRect(0, H / 2 - 70, W, 140);
    ctx.fillStyle = G(200); ctx.fillRect(0, H / 2 - 70, W, 1); ctx.fillRect(0, H / 2 + 69, W, 1);
    text(title, W / 2, H / 2 - 4, 40, { font: DISPLAY, weight: 700, ls: 2 });
    if (sub) text(sub, W / 2, H / 2 + 28, 12, { color: G(190), ls: 3 });
    if (extra) text(extra, W / 2, H / 2 + 54, 11, { color: G(blink() ? 235 : 110), ls: 2 });
  }

  function drawTitle() {
    for (const r of rocks) drawRock(r);
    text(is404 ? 'ERROR 404 · PAGE NOT FOUND' : 'SECRET ARCADE · STUDIO VERITAS', W / 2, 104, 11, { color: G(150), ls: 3 });
    text('TRUTH', W / 2, 176, 68, { font: DISPLAY, weight: 700, ls: 6 });
    text('INVADERS', W / 2, 238, 68, { font: DISPLAY, weight: 700, ls: 6 });
    ctx.fillStyle = G(120); ctx.fillRect(W / 2 - 120, 262, 240, 1);
    const lines = is404
      ? ['This page got lost in space.', 'Clear the noise. Bust the big lie.', 'Claim the secret prize.']
      : ['You found the back door.', 'Clear the noise. Bust the big lie.', 'Claim the secret prize.'];
    lines.forEach((l, i) => text(l, W / 2, 296 + i * 20, 13, { color: G(195) }));
    drawShip(W / 2, 404 + Math.sin(clock * 2) * 5, 4);
    text(isTouch ? 'TAP TO START' : 'PRESS ↑ TO START', W / 2, 478, 16, { weight: 600, ls: 3, color: G(blink() ? 245 : 90) });
    text(isTouch ? 'HOLD + DRAG TO STEER · AUTO FIRE' : '← →  MOVE      ↑ / SPACE  FIRE', W / 2, 530, 11, { color: G(170), ls: 1 });
    text('P PAUSE    M SOUND    ESC EXIT', W / 2, 550, 11, { color: G(130), ls: 1 });
    text(`HI ${pad(hi)}`, W / 2, 592, 11, { color: G(150), ls: 2 });
    text('© STUDIO VERITAS · TRUTH BROUGHT TO LIFE', W / 2, 618, 9, { color: G(100), ls: 2 });
  }

  function bar(label, val, y, show) {
    if (!show) return;
    text(label, 40, y, 11, { align: 'left', color: G(190), ls: 2 });
    const x0 = 140, w = 250;
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = i < Math.round((val / 100) * 20) ? G(225) : G(45);
      ctx.fillRect(x0 + i * (w / 20), y - 9, w / 20 - 2, 10);
    }
    text(`${val}%`, W - 40, y, 11, { align: 'right', weight: 600 });
  }

  function drawReview() {
    const R = review, t = R.t;
    const at = (k) => t > k;
    ctx.fillStyle = G(8, 0.85); ctx.fillRect(0, 0, W, H);
    // masthead
    ctx.fillStyle = G(230); ctx.fillRect(20, 20, W - 40, 22);
    text('ISSUE #404', 28, 35, 10, { align: 'left', color: G(10), weight: 600, ls: 2 });
    text('THE REVIEW', W - 28, 35, 10, { align: 'right', color: G(10), weight: 600, ls: 2 });
    text('TRUTH INVADERS', W / 2, 80, 32, { font: DISPLAY, weight: 700, ls: 3 });
    text('A PLAYER RUN · REVIEWED BY STUDIO VERITAS', W / 2, 98, 9, { color: G(150), ls: 2 });
    // score box
    if (at(0.4)) {
      ctx.strokeStyle = G(220); ctx.lineWidth = 2; ctx.strokeRect(40, 112, 250, 92);
      const shown = at(1.2) ? R.overall : Math.min(R.overall, ((t - 0.4) / 0.8) * R.overall);
      text(shown.toFixed(1), 150, 186, 66, { font: DISPLAY, weight: 700 });
      text('/10', 238, 186, 18, { color: G(150) });
      text('OVERALL', 52, 128, 9, { align: 'left', color: G(150), ls: 2 });
      ctx.fillStyle = G(220); ctx.fillRect(306, 112, 134, 92);
      text('RANK', 373, 132, 9, { color: G(30), ls: 3, weight: 600 });
      if (at(1.2)) text(R.grade, 373, 192, 62, { font: DISPLAY, weight: 700, color: G(10) });
    }
    bar('AIM', R.aim, 232, at(1.0));
    bar('NERVE', R.nerve, 254, at(1.2));
    bar('SPEED', R.speed, 276, at(1.4));
    bar('TRUTH', R.truth, 298, at(1.6));
    if (at(1.9)) {
      const m = Math.floor(S.time / 60), s = Math.floor(S.time % 60);
      const rows = [
        ['SCORE', pad(S.score) + (S.newHi ? '  NEW HI!' : '')],
        ['ACCURACY', Math.round(R.acc * 100) + '%'],
        ['ASTEROIDS / JUNK', `${S.kills.rock} / ${S.kills.junk}`],
        ['TIME · LIVES LOST', `${m}:${String(s).padStart(2, '0')} · ${S.deaths}`],
      ];
      rows.forEach(([k, v], i) => {
        text(k, 40, 330 + i * 17, 10, { align: 'left', color: G(140), ls: 1 });
        text(v, W - 40, 330 + i * 17, 10, { align: 'right', weight: 500, color: i === 0 && S.newHi && blink(3) ? G(255) : G(220) });
      });
    }
    if (at(2.4)) {
      const shown = R.verdict.slice(0, Math.floor(R.typed));
      text('VERDICT', 40, 412, 9, { align: 'left', color: G(140), ls: 3 });
      wrap('“' + shown + (R.typed < R.verdict.length ? '▌' : '”'), W - 80, 13).forEach((l, i) => text(l, 40, 432 + i * 18, 13, { align: 'left', weight: 500 }));
    }
    if (at(4.0)) {
      const y0 = 478;
      ctx.fillStyle = G(blink(3) ? 240 : 170);
      for (let x = 20; x < W - 20; x += 8) { ctx.fillRect(x, y0, 4, 2); ctx.fillRect(x, y0 + 124, 4, 2); }
      for (let y = y0; y < y0 + 126; y += 8) { ctx.fillRect(20, y, 2, 4); ctx.fillRect(W - 22, y, 2, 4); }
      text('★ ' + prize.title + ' ★', W / 2, y0 + 24, 12, { weight: 600, ls: 2 });
      ctx.fillStyle = G(235); ctx.fillRect(W / 2 - 120, y0 + 34, 240, 36);
      text(prize.code, W / 2, y0 + 60, 24, { font: DISPLAY, weight: 700, color: G(10), ls: 4 });
      text(prize.line1, W / 2, y0 + 88, 11, { color: G(190) });
      text(prize.line2, W / 2, y0 + 102, 11, { weight: 600 });
      text(prize.line3, W / 2, y0 + 116, 11, { color: G(190) });
    }
    if (at(4.5)) text(isTouch ? 'TAP TO PLAY AGAIN' : '↑ PLAY AGAIN   ·   ESC EXIT', W / 2, 627, 11, { color: G(blink() ? 230 : 110), ls: 2 });
  }

  function draw() {
    ctx.save();
    ctx.fillStyle = G(6);
    ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(Math.round(rand(-shake, shake)), Math.round(rand(-shake, shake)));
    drawStars();
    if (mode === 'title') drawTitle();
    else if (mode === 'review') { drawWorld(); drawReview(); }
    else {
      drawWorld();
      drawHUD();
      if (mode === 'intro') drawCenter(`LEVEL 0${S.level}`, LEVELS[S.level].name + ' · ' + LEVELS[S.level].brief.toUpperCase());
      if (mode === 'paused') drawCenter('PAUSED', 'P TO RESUME · ESC TO EXIT');
      if (mode === 'over' ) drawCenter('GAME OVER', 'THE LIE WINS THIS TIME', modeT <= 0 ? (isTouch ? 'TAP TO CONTINUE' : '↑ CONTINUE  ·  ESC EXIT') : '');
      if (S.phase === 'warn' && mode === 'play') {
        if (blink(4)) drawCenter('WARNING', 'THE BIG LIE APPROACHES');
      } else if (S.banner && (mode === 'play' || mode === 'clear' || mode === 'respawn')) drawCenter(S.banner.text, S.banner.sub);
    }
    ctx.restore();
    if (flash > 0) { ctx.fillStyle = G(255, Math.min(1, flash)); ctx.fillRect(0, 0, W, H); }
    // CRT
    if (scanPattern) { ctx.fillStyle = scanPattern; ctx.fillRect(0, 0, W, H); }
    if (vignette) { ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H); }
    ctx.fillStyle = G(255, 0.012 + Math.random() * 0.012); ctx.fillRect(0, 0, W, H);
  }

  /* ───────────────────────── loop ───────────────────────── */
  let raf = 0, last = 0, running = true;
  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.033, (now - (last || now)) / 1000);
    last = now;
    update(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }
  function onVisibility() { if (document.hidden && mode === 'play') mode = 'paused'; }
  function onBlur() { for (const k in keys) keys[k] = false; touch.active = false; }

  resize();
  let ro = null;
  if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) { ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); }
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.style.touchAction = 'none';
  if (document.fonts && document.fonts.load) {
    document.fonts.load(`700 40px ${DISPLAY}`).catch(() => {});
    document.fonts.load(`400 12px ${MONO}`).catch(() => {});
  }
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      try { if (actx) actx.close(); } catch (e) { /* noop */ }
    },
    // test hooks (used by the Playwright checks; harmless in production)
    debug: {
      state: () => ({ mode, level: S && S.level, score: S && S.score, lives: S && S.lives, bossHp: boss && boss.hp }),
      start: () => newRun(1),
      skipLevel: () => { if (S) { if (S.level < 3) { mode = 'play'; levelClear(); } } },
      toBoss: () => { if (!S) newRun(1); startLevel(3); mode = 'play'; F = null; spawnBoss(); boss.entering = false; boss.y = 130; },
      bossPhase: (p) => { if (boss) { boss.hp = Math.ceil(boss.max * (p === 3 ? 0.3 : 0.6)); damageBoss({ x: boss.x, y: boss.y }); } },
      killBoss: () => { if (boss) { boss.hp = 1; damageBoss({ x: boss.x, y: boss.y }); } },
      god: () => { if (P) P.inv = 9999; },
    },
  };
}
