/* =====================================================================
   STUDIO VERITAS — FIRST-LOAD INTRO (sticker loader)
   Framework-free. Used as-is by the Next.js site (components/intro-loader.jsx)
   and inlined in the HTML prototype, so both run identical code.

   Variants
     'sticker'  die-cut logo stickers trail the cursor; at 100% they pop off
                and the lead sticker lands as the logo.
     'peel'     same trail; at 100% every sticker lifts at one corner, curls
                and flies off as if peeled by hand. The lead sticker lands on
                the logo and is peeled away to reveal the real logo beneath.

   Page hooks (data attributes)
     data-sv-intro="logo"       the nav bar wordmark <img>: sticker art + where the lead sticker lands
     data-sv-intro="copy"       the home page copy, hidden until the intro ends (the page types it in
                                when it hears the 'sv:intro-done' event)
     data-sv-intro="bg"         background layer that comes into focus
     data-sv-intro-step="1|2"   chrome revealed after the intro (1 top, 2 bottom)
   Pre-paint: add class "sv-intro" to <html> before first paint.
   ===================================================================== */
(function () {
  if (window.SVIntro) return;

  var CSS = [
    'html.sv-intro [data-sv-intro-step]:not([data-sv-shown]){opacity:0!important;pointer-events:none!important}',
    'html.sv-intro [data-sv-intro-step="1"]:not([data-sv-shown]){translate:0 -14px}',
    'html.sv-intro [data-sv-intro-step="2"]:not([data-sv-shown]){translate:0 14px}',
    'html.sv-intro [data-sv-intro="copy"]{opacity:0!important;pointer-events:none!important}',
    'html.sv-intro:not(.sv-intro-unghost) [data-sv-intro="logo"]{opacity:0!important;transition:none!important}',
    '[data-sv-intro-step][data-sv-revealing]{transition:opacity .8s cubic-bezier(.22,1,.36,1),translate .8s cubic-bezier(.22,1,.36,1)!important}',
    '@keyframes svIntroBlink{0%,50%{opacity:1}51%,100%{opacity:0}}',
    '#sv-intro{position:fixed;inset:0;z-index:70;cursor:none;touch-action:none}',
    '#sv-intro.out{pointer-events:none;cursor:auto}',
    '#sv-intro canvas{position:absolute;inset:0;width:100%;height:100%;display:block;transition:opacity .25s}',
    '.sv-intro-c{position:absolute;z-index:2;font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#000;transition:opacity .45s ease,transform .45s ease}',
    '@media (min-width:768px){.sv-intro-c{font-size:12px}}',
    '#sv-intro.out .sv-intro-c{opacity:0;transform:translateY(6px)}',
    '#sv-intro-log{left:max(16px,env(safe-area-inset-left));bottom:max(16px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:6px;max-width:56vw}',
    '@media (min-width:768px){#sv-intro-log{left:max(40px,env(safe-area-inset-left));bottom:max(32px,env(safe-area-inset-bottom))}}',
    '#sv-intro-log div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .4s}',
    '#sv-intro-log div.old{opacity:.38}',
    '#sv-intro-log div.typing::after{content:"\\2588";animation:svIntroBlink .8s step-end infinite;margin-left:2px}',
    '#sv-intro-count{right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));display:flex;align-items:flex-start;gap:.04em;font-family:"Chakra Petch",sans-serif;font-weight:600;letter-spacing:-.02em;font-size:clamp(56px,10vw,148px);line-height:1;padding:.06em .1em;background:#000;color:#fff;border-radius:6px}',
    '@media (min-width:768px){#sv-intro-count{right:max(40px,env(safe-area-inset-right));bottom:max(32px,env(safe-area-inset-bottom))}}',
    '#sv-intro-count.done{color:#5683DD}',
    '.sv-odo{display:flex}.sv-odo-col{display:block;height:1em;overflow:hidden;transition:opacity .3s}',
    '.sv-odo-strip{display:flex;flex-direction:column;transition:transform .55s cubic-bezier(.22,1,.36,1)}',
    '.sv-odo-strip span{display:block;height:1em;line-height:1;text-align:center;width:.62em}',
    '.sv-odo-pc{font-size:.32em;margin-top:.12em}'
  ].join('\n');

  var STATUS = [
    [0.15, '// questioning the brief'],
    [0.31, '// looking for what others missed'],
    [0.48, '// finding the truth'],
    [0.64, '// making it noticeable'],
    [0.80, '// making it memorable']
  ];
  var CURVE = [[0,0],[.10,.07],[.20,.10],[.34,.33],[.44,.36],[.58,.57],[.68,.63],[.80,.85],[.90,.88],[1,1]];
  function curve(f) {
    for (var i = 1; i < CURVE.length; i++) if (f <= CURVE[i][0]) { var a = CURVE[i-1], b = CURVE[i]; return a[1] + (b[1]-a[1]) * (f-a[0]) / (b[0]-a[0]); }
    return 1;
  }
  function ease(k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------- die-cut sticker art ---------- */
  function makeSticker(src, w, h, dpr, border, ink) {
    var pad = Math.round(h * 0.2), bw = Math.round(h * 0.13);
    var W = Math.max(2, Math.round((w + pad * 2) * dpr)), H = Math.max(2, Math.round((h + pad * 2) * dpr));
    function cnv() { var c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
    var sil = cnv(), sc = sil.getContext('2d');
    sc.drawImage(src, pad * dpr, pad * dpr, w * dpr, h * dpr);
    sc.globalCompositeOperation = 'source-in'; sc.fillStyle = '#000'; sc.fillRect(0, 0, W, H);
    var cut = cnv(), cc = cut.getContext('2d');
    for (var r = bw * dpr; r > 0; r -= bw * dpr / 3)
      for (var a = 0; a < 28; a++) cc.drawImage(sil, Math.cos(a / 28 * 6.2832) * r, Math.sin(a / 28 * 6.2832) * r);
    cc.drawImage(sil, 0, 0);
    var back = cnv(), bc = back.getContext('2d');           // the paper back, seen when it curls
    bc.drawImage(cut, 0, 0); bc.globalCompositeOperation = 'source-in'; bc.fillStyle = '#ebe8e0'; bc.fillRect(0, 0, W, H);
    cc.globalCompositeOperation = 'source-in'; cc.fillStyle = border; cc.fillRect(0, 0, W, H);
    var out = cnv(), oc = out.getContext('2d');
    oc.shadowColor = 'rgba(15,15,61,.28)'; oc.shadowBlur = 10 * dpr; oc.shadowOffsetY = 4 * dpr;
    oc.drawImage(cut, 0, 0); oc.shadowColor = 'transparent';
    var inkC = cnv(), ic = inkC.getContext('2d');
    ic.drawImage(sil, 0, 0); ic.globalCompositeOperation = 'source-in'; ic.fillStyle = ink; ic.fillRect(0, 0, W, H);
    oc.drawImage(inkC, 0, 0);
    // flat version (no drop shadow) for the part still stuck down while peeling
    var flat = cnv(), fc = flat.getContext('2d');
    fc.drawImage(cut, 0, 0); fc.drawImage(inkC, 0, 0);
    return { c: out, flat: flat, back: back, w: w + pad * 2, h: h + pad * 2, pw: W, ph: H };
  }

  function injectCSS() {
    if (document.getElementById('sv-intro-css')) return;
    var st = document.createElement('style'); st.id = 'sv-intro-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  injectCSS();

  /* ---------- pre-paint gate ----------
     Loaded as a blocking <script> in <head> with data-auto: on the home page,
     first visit of the session (or always, with data-always, or #intro-* in the
     URL), it hides the chrome and logo before the first paint. */
  var KEY = 'sv-intro-seen';
  function wanted(always) {
    if (always) return true;
    if (location.pathname !== '/') return false;
    if (/intro|sticker|peel/.test(location.hash)) return true;
    try { return sessionStorage.getItem(KEY) !== '1'; } catch (e) { return true; }
  }
  function variantFromHash(def) {
    if (/peel/.test(location.hash)) return 'peel';
    if (/sticker/.test(location.hash)) return 'sticker';
    return def;
  }
  var me = document.currentScript;
  if (me && me.hasAttribute('data-auto') && wanted(me.hasAttribute('data-always'))) {
    document.documentElement.classList.add('sv-intro');
    // failsafe: never leave the page hidden if the intro can't start
    setTimeout(function () { if (!current && !ran) document.documentElement.classList.remove('sv-intro'); }, 8000);
  }
  var ran = false;

  /* ---------- the run ---------- */
  var current = null;

  function run(cfg) {
    cfg = cfg || {};
    if (current) current.cancel(true);   // replaced by a new run: no 'done' signal
    ran = true;
    injectCSS();
    var variant = cfg.variant === 'sticker' ? 'sticker' : 'peel';
    var dur = Math.max(cfg.dur || 3200, 4200);
    var root = document.documentElement;
    var logo = q('[data-sv-intro="logo"]'), bg = q('[data-sv-intro="bg"]');
    var icon = cfg.icon || q('[data-sv-intro="icon"]');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var steps = qa('[data-sv-intro-step]');
    steps.forEach(function (e) { e.removeAttribute('data-sv-shown'); e.removeAttribute('data-sv-revealing'); });
    root.classList.add('sv-intro');

    var timers = [], cancelled = false, raf = 0;
    function T(ms, fn) { timers.push(setTimeout(function () { if (!cancelled) fn(); }, ms)); }
    function reveal(step) {
      steps.filter(function (e) { return e.getAttribute('data-sv-intro-step') === String(step); }).forEach(function (e) {
        e.setAttribute('data-sv-revealing', ''); e.setAttribute('data-sv-shown', '');
        setTimeout(function () { e.removeAttribute('data-sv-revealing'); }, 1000);
      });
    }
    function ghost(on) { root.classList.toggle('sv-intro-unghost', !on); }
    function blur(p) {
      if (!bg) return;
      var k = 1 - p, mob = window.innerWidth < 768;
      bg.style.filter = k > .002 ? 'blur(' + (k * (mob ? 9 : 14)).toFixed(2) + 'px) saturate(' + (1 - k * .35).toFixed(3) + ')' : '';
      bg.style.transform = k > .002 ? 'scale(' + (1 + k * .12).toFixed(4) + ')' : '';
    }
    function finishAll(silent) {
      root.classList.remove('sv-intro', 'sv-intro-unghost');
      steps.forEach(function (e) { e.setAttribute('data-sv-shown', ''); });
      if (bg) { bg.style.filter = ''; bg.style.transform = ''; bg.style.transition = ''; }
      current = null;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      if (silent) return;
      if (cfg.onDone) cfg.onDone();
      try { window.dispatchEvent(new CustomEvent('sv:intro-done')); } catch (e) {}
    }

    if (reduce || !logo) {
      T(500, function () { reveal(1); reveal(2); });
      T(1400, finishAll);
      current = { cancel: function (silent) { cancelled = true; timers.forEach(clearTimeout); finishAll(silent); } };
      return current;
    }

    // ---------- overlay ----------
    var ov = document.createElement('div'); ov.id = 'sv-intro';
    ov.setAttribute('role', 'progressbar'); ov.setAttribute('aria-label', 'Loading Studio Veritas');
    ov.setAttribute('aria-valuemin', '0'); ov.setAttribute('aria-valuemax', '100');
    ov.innerHTML = '<canvas></canvas><div class="sv-intro-c" id="sv-intro-log" aria-hidden="true"></div>' +
      '<div class="sv-intro-c" id="sv-intro-count" aria-hidden="true"><span class="sv-odo"></span><span class="sv-odo-pc">%</span></div>';
    var old = document.getElementById('sv-intro'); if (old) old.remove();
    document.body.appendChild(ov);
    var cv = ov.querySelector('canvas'), ctx = cv.getContext('2d');
    var logEl = ov.querySelector('#sv-intro-log'), countEl = ov.querySelector('#sv-intro-count');
    var odo = countEl.querySelector('.sv-odo');
    for (var di = 0; di < 3; di++) {
      var col = document.createElement('span'); col.className = 'sv-odo-col';
      var strip = document.createElement('span'); strip.className = 'sv-odo-strip';
      strip.innerHTML = '0123456789'.split('').map(function (n) { return '<span>' + n + '</span>'; }).join('');
      col.appendChild(strip); odo.appendChild(col);
    }
    function setCount(pct) {
      var s = ('00' + pct).slice(-3);
      countEl.querySelectorAll('.sv-odo-strip').forEach(function (st, i) {
        st.style.transform = 'translateY(' + (-(+s[i]) * 10) + '%)';
        st.parentNode.style.opacity = (pct < 100 && i === 0) ? .25 : 1;
      });
      ov.setAttribute('aria-valuenow', pct);
    }
    setCount(0);
    var maxLines = window.innerWidth < 768 ? 3 : 4, typeTimer = null;
    function pushLine(text) {
      logEl.querySelectorAll('div').forEach(function (d) { d.classList.add('old'); d.classList.remove('typing'); d.textContent = d.dataset.full; });
      var d = document.createElement('div'); d.dataset.full = text; d.className = 'typing'; logEl.appendChild(d);
      while (logEl.children.length > maxLines) logEl.removeChild(logEl.firstChild);
      clearInterval(typeTimer); var i = 0;
      typeTimer = setInterval(function () { i++; d.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typeTimer); }, 16);
    }

    // ---------- geometry + art ----------
    var g, dpr, LOGO, ICON, S, MAX, GAP, scratch, sx;
    function build() {
      var W = window.innerWidth, H = window.innerHeight;
      var rh = W < 768 ? 50 : W < 1024 ? 75 : 100, asp = (logo.naturalWidth || 4.2) / (logo.naturalHeight || 1);
      g = { cx: W / 2, cy: H / 2, w: rh * asp, h: rh, W: W, H: H, mob: W < 768 };
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var WAYS = [['#ffffff', '#000000'], ['#5683DD', '#000000'], ['#000000', '#ffffff'], ['#0f0f3d', '#f5f3ec']];
      LOGO = WAYS.map(function (c) { return makeSticker(logo, g.w, g.h, dpr, c[0], c[1]); });
      if (icon && icon.naturalWidth) {
        var ich = g.h * 1.25, icw = ich * icon.naturalWidth / icon.naturalHeight;
        ICON = WAYS.map(function (c) { return makeSticker(icon, icw, ich, dpr, c[0], c[1]); });
      } else ICON = LOGO;
      S = g.mob ? 0.62 : 0.56; MAX = g.mob ? 26 : 42; GAP = g.mob ? 46 : 64;
      scratch = document.createElement('canvas'); scratch.width = LOGO[0].pw; scratch.height = LOGO[0].ph;
      sx = scratch.getContext('2d');
    }
    build();

    // ---------- trail state ----------
    var lead = { x: g.cx, y: g.cy, s: 0, r: 0 }, trail = [], n = 0, lastStamp = { x: g.cx, y: g.cy };
    var ptr = null, lastMove = 0, t0 = performance.now(), exitAt = 0, leadPeel = null, landed = false;
    function onMove(e) { ptr = { x: e.clientX, y: e.clientY }; lastMove = performance.now(); }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);

    function stamp(x, y) {
      n++;
      var set = n % 5 === 0 ? ICON : LOGO, st = set[n % 4];
      if (n % 3 === 0) st = set[0];
      trail.push({ st: st, x: x, y: y, r: (Math.random() - .5) * 26 + lead.r * .5, born: performance.now(), die: 0, peel: null });
      if (trail.length > MAX) {
        for (var i = 0; i < trail.length; i++) if (!trail[i].die && !trail[i].peel) { retire(trail[i], performance.now()); break; }
      }
    }
    // a sticker leaving: 'pop' (classic) or a hand peel
    function retire(s, at) {
      if (variant === 'peel') s.peel = makePeel(s, at, 950);
      else s.die = at;
    }

    /* ---------- peel physics ----------
       A fold line sweeps in from one corner. Behind it the sticker is still stuck
       down; in front of it the flap is reflected over the line (its paper back
       showing), foreshortened as it lifts, shaded towards the tip and casting a
       shadow. Past halfway the sticker lets go and is flicked off-screen. */
    function makePeel(s, at, len, forced) {
      var w2 = s.st.w / 2, h2 = s.st.h / 2, best = null;
      var corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      var ax = s.x - g.cx, ay = s.y - g.cy, rr = s.r * Math.PI / 180;
      corners.forEach(function (c) {
        var lx = c[0] * w2, ly = c[1] * h2;
        var wx = lx * Math.cos(rr) - ly * Math.sin(rr), wy = lx * Math.sin(rr) + ly * Math.cos(rr);
        var score = -(wx * ax + wy * ay) / (Math.hypot(wx, wy) * (Math.hypot(ax, ay) + 1)) + Math.random() * .8;
        if (!best || score > best.score) best = { score: score, lx: lx, ly: ly };
      });
      if (forced) best = { lx: forced[0] * w2, ly: forced[1] * h2 };
      // peel direction: mostly diagonal from the corner, slightly randomised
      var len2 = Math.hypot(best.lx, best.ly), dx = best.lx / len2, dy = best.ly / len2;
      var jit = (Math.random() - .5) * .5, c = Math.cos(jit), sn = Math.sin(jit);
      var ddx = dx * c - dy * sn, ddy = dx * sn + dy * c;
      var E = Math.abs(ddx) * w2 + Math.abs(ddy) * h2;
      return { at: at, len: len, dx: ddx, dy: ddy, E: E, spin: (Math.random() < .5 ? -1 : 1) * (20 + Math.random() * 30) };
    }

    function halfPlane(dx, dy, f, side, L) {
      var px = dx * f, py = dy * f, nx = -dy, ny = dx;
      ctx.beginPath();
      ctx.moveTo(px + nx * L, py + ny * L);
      ctx.lineTo(px - nx * L, py - ny * L);
      ctx.lineTo(px - nx * L + side * dx * L, py - ny * L + side * dy * L);
      ctx.lineTo(px + nx * L + side * dx * L, py + ny * L + side * dy * L);
      ctx.closePath(); ctx.clip();
    }

    function drawFlat(st, x, y, s, r, img) {
      if (s <= .002) return;
      ctx.save(); ctx.translate(x, y); ctx.rotate(r * Math.PI / 180); ctx.scale(s, s);
      ctx.drawImage(img || st.c, -st.w / 2, -st.h / 2, st.w, st.h); ctx.restore();
    }

    // returns false when the sticker has gone
    function drawPeeling(o, now, s) {
      var P = o.peel, k = (now - P.at) / P.len;
      if (k < 0) { drawFlat(o.st, o.x, o.y, s, o.r); return true; }
      if (k >= 1) return false;
      var st = o.st, A = Math.min(1, k / .58), a = ease(A);
      var f = P.E - a * P.E * 1.3;                  // fold line: from the corner to just past the middle
      var cmp = 1 - .42 * a;                        // flap foreshortens as it lifts
      var B = k > .58 ? (k - .58) / .42 : 0, b = B * B;
      var wr = o.r * Math.PI / 180;
      var wdx = P.dx * Math.cos(wr) - P.dy * Math.sin(wr), wdy = P.dx * Math.sin(wr) + P.dy * Math.cos(wr);
      var travel = Math.max(g.W, g.H) * 1.1;
      var x = o.x - wdx * travel * b, y = o.y - wdy * travel * b - 60 * B;   // pulled back over itself
      var rot = o.r + P.spin * b, sc = s * (1 + .18 * B);
      var L = Math.max(st.w, st.h) * 3;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc);
      // the part still stuck down (no drop shadow; it's flat on the surface)
      ctx.save(); halfPlane(P.dx, P.dy, f, -1, L);
      ctx.drawImage(B > 0 ? st.c : st.flat, -st.w / 2, -st.h / 2, st.w, st.h);
      ctx.restore();
      // the flap: paper back, reflected over the fold and foreshortened
      sx.clearRect(0, 0, scratch.width, scratch.height);
      sx.globalCompositeOperation = 'source-over';
      sx.drawImage(st.back, 0, 0, scratch.width, scratch.height);
      sx.globalCompositeOperation = 'source-atop';
      var u = scratch.width / st.w;
      var gx0 = (P.dx * f + st.w / 2) * u, gy0 = (P.dy * f + st.h / 2) * u;
      var gx1 = (P.dx * P.E + st.w / 2) * u, gy1 = (P.dy * P.E + st.h / 2) * u;
      var gr = sx.createLinearGradient(gx0, gy0, gx1, gy1);
      gr.addColorStop(0, 'rgba(255,255,255,.75)'); gr.addColorStop(.18, 'rgba(255,255,255,0)');
      gr.addColorStop(.6, 'rgba(15,15,61,.08)'); gr.addColorStop(1, 'rgba(15,15,61,.28)');
      sx.fillStyle = gr; sx.fillRect(0, 0, scratch.width, scratch.height);
      sx.globalCompositeOperation = 'source-over';
      var m = 1 + cmp;
      ctx.save();
      ctx.transform(1 - m * P.dx * P.dx, -m * P.dx * P.dy, -m * P.dx * P.dy, 1 - m * P.dy * P.dy, m * f * P.dx, m * f * P.dy);
      halfPlane(P.dx, P.dy, f, 1, L);
      ctx.shadowColor = 'rgba(15,15,61,' + (.22 + .2 * a).toFixed(3) + ')';
      ctx.shadowBlur = (8 + 18 * a) * dpr; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = (3 + 10 * a) * dpr;
      ctx.drawImage(scratch, -st.w / 2, -st.h / 2, st.w, st.h);
      ctx.restore();
      ctx.restore();
      return true;
    }

    // ---------- progress ----------
    var isReady = false, disp = 0, sIdx = -1, finished = false, waiting = false;
    Promise.all([
      document.fonts && document.fonts.ready ? document.fonts.ready.catch(function () {}) : 0,
      new Promise(function (r) { if (document.readyState === 'complete') r(); else window.addEventListener('load', r, { once: true }); }),
      logo.decode ? logo.decode().catch(function () {}) : 0,
      cfg.ready || 0
    ]).then(function () { isReady = true; });
    function skip(e) { if (e && e.key === 'Tab') return; if (!finished && t0 > performance.now() - dur) t0 = performance.now() - dur; }
    window.addEventListener('keydown', skip);
    pushLine(window.matchMedia('(hover: none)').matches ? '// drag to leave a mark' : '// move to leave a mark');
    ghost(true);
    blur(0);

    function frame(now) {
      if (cancelled) return;
      var t = (now - t0) / 1000;
      // progress
      if (!finished) {
        var f = Math.max(0, Math.min(1, (now - t0 - 450) / dur));
        var target = Math.min(curve(f), isReady ? 1 : .92);
        disp += (target - disp) * .14; if (target === 1 && 1 - disp < .004) disp = 1;
        setCount(Math.round(disp * 100)); blur(disp);
        while (sIdx + 1 < STATUS.length && disp >= STATUS[sIdx + 1][0]) { sIdx++; pushLine(STATUS[sIdx][1]); }
        if (f >= 1 && !isReady && !waiting) { waiting = true; pushLine('// worth the wait'); }
        if (disp >= 1) finish(now);
      }
      // lead
      if (!exitAt) {
        var tx, ty;
        if (ptr && now - lastMove < 1400) { tx = ptr.x; ty = ptr.y; }
        else {
          var ax = Math.min(g.W * .34, g.W / 2 - 60), ay = Math.min(g.H * .3, g.H / 2 - 60);
          tx = g.cx + Math.sin(t * 1.05) * ax; ty = g.cy + Math.sin(t * 1.7 + .6) * ay;
        }
        var px = lead.x;
        lead.x += (tx - lead.x) * .2; lead.y += (ty - lead.y) * .2;
        lead.r += (Math.max(-16, Math.min(16, (lead.x - px) * .9)) - lead.r) * .15;
        lead.s += (S - lead.s) * .14;
        var ddx = lead.x - lastStamp.x, ddy = lead.y - lastStamp.y;
        if (ddx * ddx + ddy * ddy > GAP * GAP && t > .5) { stamp(lead.x, lead.y); lastStamp = { x: lead.x, y: lead.y }; }
      } else {
        var le = Math.max(0, Math.min(1, (now - exitAt - 250) / 850)), e = ease(le);
        if (!lead.from) lead.from = { x: lead.x, y: lead.y, s: lead.s, r: lead.r };
        var tg = navTarget();
        lead.x = lead.from.x + (tg.x - lead.from.x) * e; lead.y = lead.from.y + (tg.y - lead.from.y) * e;
        lead.s = lead.from.s + (tg.s - lead.from.s) * e; lead.r = lead.from.r * (1 - e);
        if (le >= 1 && !landed) { landed = true; onLanded(now); }
      }
      // draw
      ctx.clearRect(0, 0, g.W, g.H);
      trail = trail.filter(function (o) {
        if (o.peel) return drawPeeling(o, now, S);
        if (o.die && now >= o.die) {
          var k = Math.min(1, (now - o.die) / 380); if (k >= 1) return false;
          o.r += 2; drawFlat(o.st, o.x, o.y, S * (1 - k * k) * (1 + k * .15), o.r); return true;
        }
        var b = Math.min(1, (now - o.born) / 260);
        drawFlat(o.st, o.x, o.y, S * (b < 1 ? .6 + .4 * b + .22 * Math.sin(b * Math.PI) : 1), o.r);
        return true;
      });
      if (leadPeel && leadPeel !== 'gone') {
        var lt = navTarget();
        if (!drawPeeling({ st: LOGO[0], x: lt.x, y: lt.y, r: 0, peel: leadPeel }, now, lt.s)) leadPeel = 'gone';
      } else if (leadPeel !== 'gone') {
        var fade = (variant === 'sticker' && landed) ? Math.max(0, 1 - (now - landedAt) / 260) : 1;
        if (fade > 0) { ctx.globalAlpha = fade; drawFlat(LOGO[0], lead.x, lead.y, lead.s, lead.r); ctx.globalAlpha = 1; }
      }
      raf = requestAnimationFrame(frame);
    }

    var landedAt = 0;
    // where the lead sticker lands: the wordmark in the nav bar (tracked live while the bar slides in)
    function navTarget() {
      var r = logo.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: (r.height || g.h * .34) / g.h };
    }
    function finish(now) {
      finished = true;
      window.removeEventListener('keydown', skip);
      setCount(100); countEl.classList.add('done'); pushLine('// growth in truth');
      T(420, function () {
        var at = performance.now();
        exitAt = at; ov.classList.add('out');
        reveal(1);
        if (bg) { bg.style.transition = 'filter .9s ease, transform 1.4s cubic-bezier(.22,1,.36,1)'; blur(1); }
        var live = trail.filter(function (o) { return !o.die && !o.peel; }).reverse();
        var gap = Math.min(variant === 'peel' ? 45 : 28, (variant === 'peel' ? 820 : 600) / Math.max(1, live.length));
        live.forEach(function (o, i) { retire(o, at + i * gap); });
      });
    }
    function onLanded(now) {
      landedAt = now;
      if (variant === 'peel') {
        // hold on the logo, then peel the lead sticker away by hand to reveal the real logo
        T(220, function () {
          ghost(false);
          var lt = navTarget();
          leadPeel = makePeel({ st: LOGO[0], x: lt.x, y: lt.y, r: 0 }, performance.now(), 1100, [-1, 1]);
          T(500, function () { reveal(2); });
          T(1250, done);
        });
      } else {
        ghost(false);
        T(150, function () { reveal(2); });
        T(700, done);
      }
    }
    function done() { cleanup(); finishAll(); }
    function cleanup() {
      cancelled = true; cancelAnimationFrame(raf); clearInterval(typeTimer);
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('keydown', skip); window.removeEventListener('resize', onResize);
      ov.remove();
    }
    function onResize() { if (!exitAt) { build(); lead.x = Math.min(lead.x, g.W); lead.y = Math.min(lead.y, g.H); } }
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(frame);

    current = { cancel: function (silent) { timers.forEach(clearTimeout); cleanup(); finishAll(silent); } };
    return current;
  }

  window.SVIntro = {
    run: run,
    pending: function () { return document.documentElement.classList.contains('sv-intro') && !current; },
    variantFromHash: variantFromHash,
    cancel: function () { if (current) current.cancel(); }
  };
})();
