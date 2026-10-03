/*!
 * invite.js: formal invitation for rebeccaandthomas.net
 *
 * Renders the whole page into <div id="rt-invite"></div> and loads its own
 * libraries (GSAP, ScrollTrigger, SplitText, chalk-draw), so Webflow only
 * needs the mount div, invite.css in the head and this file in the footer.
 *
 * Progressive enhancement: the markup is complete and usable before any
 * library arrives. Hidden starting states are only ever applied by JS once
 * GSAP has loaded, never by CSS, so a failed load can't hide content.
 */

// Double-load guard: Webflow can inject footer code twice.
if (!window.__rtInviteInit) {
window.__rtInviteInit = true;

(function () {

// ─────────────────────────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────────────────────────

// Bump on every deploy: cache-busts every asset this file loads.
var RT_VERSION = '20261003a';

// Where this file lives, so the same code works on preview.html and Webflow.
var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
var BASE = SCRIPT_SRC ? SCRIPT_SRC.replace(/[^\/]*$/, '') : 'https://tttibs.github.io/wedding-site/invite/';
var ROOT = BASE.replace(/invite\/$/, '');
var CHALK = ROOT + 'illustrations/';

var LIBS = {
  gsap:          'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js',
  scrollTrigger: 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js',
  splitText:     'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js'
};

// Hero scroll-scrub. Frames come from scripts/hero-frames.sh.
// mode 'frames' scrubs the image sequence; 'still' shows still.jpg with a slow zoom.
var HERO = {
  mode: 'frames',
  still: 'hero/still.jpg',
  desktop: { dir: 'hero/d/', count: 145, cropX0: 0, cropW: 1 },
  // mobile frames are cropped to 5%-75% of the source width
  mobile:  { dir: 'hero/m/', count: 73, cropX0: 0.05, cropW: 0.70 },
  // Horizontal focus (0-1 of the source film) across scrub progress. On narrow
  // screens the crop follows the hand lifting the glass, then settles back on
  // the tray. Wide screens show the whole table, so the clamp makes this a no-op.
  focus: [[0, 0.50], [0.36, 0.50], [0.54, 0.35], [0.72, 0.36], [0.88, 0.50], [1, 0.50]],
  viewports: 3,   // pinned scroll distance
  scrub: 0.6      // seconds of catch-up: gives the scrub a little weight
};

var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var html = document.documentElement;

function v(url) { return url + (url.indexOf('?') < 0 ? '?' : '&') + 'v=' + RT_VERSION; }

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = function () { reject(new Error('Failed to load ' + src)); };
    document.head.appendChild(s);
  });
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise(function (_, reject) {
    setTimeout(function () { reject(new Error('Timed out after ' + ms + 'ms')); }, ms);
  })]);
}

function chalkDiv(name, ratio, attrs) {
  return '<div class="chalk ' + (attrs && attrs.cls || '') + '" data-chalk-src="' + v(CHALK + 'svg/' + name + '.svg') + '"' +
    ' data-chalk-color="#1a0a0a"' + (attrs && attrs.extra || '') +
    ' style="aspect-ratio:' + ratio + '"></div>';
}

// ─────────────────────────────────────────────────────────────────
//  MARKUP
// ─────────────────────────────────────────────────────────────────

var INTRO_KEY = 'rtIntroSeen';
function introSeen() { try { return window.sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { return false; } }
function markIntroSeen() { try { window.sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) {} }

var showIntro = !REDUCED && !introSeen();

var CUE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="6 9 12 15 18 9"></polyline></svg>';

function introMarkup() {
  if (!showIntro) return '';
  return '<div class="rt-intro" aria-hidden="true">' +
    chalkDiv('monogram', '1066/1061', { cls: 'rt-intro__mark', extra: ' data-chalk-mode="manual"' }) +
  '</div>';
}

function heroMarkup() {
  return '<section class="rt-hero" aria-label="Rebecca and Thomas">' +
    '<img class="rt-hero__still" src="' + v(BASE + HERO.still) + '" alt="A candlelit dinner table from above. On a silver tray, a lace card reads Rebecca and Thomas, 10th July 2027, Malta." fetchpriority="high" decoding="async">' +
    '<canvas class="rt-hero__canvas" aria-hidden="true"></canvas>' +
    '<div class="rt-cue" aria-hidden="true">' + CUE_SVG + '</div>' +
  '</section>';
}

// Temporary: stands in for sections 2-8 until they are built.
function nextMarkup() {
  return '<section class="rt-next"><p class="rt-next__label">Next: the invitation</p></section>';
}

function render(mount) {
  mount.innerHTML = introMarkup() + heroMarkup() + '<main class="rt-main">' + nextMarkup() + '</main>';
  if (showIntro) html.classList.add('rt-lock');
}

// ─────────────────────────────────────────────────────────────────
//  INTRO: monogram draws on paper, holds, fades to the hero (~2.5s)
// ─────────────────────────────────────────────────────────────────

var introDone = showIntro ? null : Promise.resolve();

function runIntro(chalkReady) {
  if (!showIntro) return;
  var el = document.querySelector('.rt-intro');
  var mark = el && el.querySelector('.rt-intro__mark');
  var finished = false;
  var resolveDone;
  introDone = new Promise(function (r) { resolveDone = r; });
  if (!el) { resolveDone(); return; }

  function finish(fast) {
    if (finished) return;
    finished = true;
    markIntroSeen();
    el.classList.add(fast ? 'is-leaving-fast' : 'is-leaving');
    html.classList.remove('rt-lock');
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { window.removeEventListener(t, skip); });
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      resolveDone();
    }, fast ? 350 : 650);
  }
  function skip() { finish(true); }

  // Any deliberate input skips the intro; ignore the first moment so a
  // stray touch from opening the email doesn't cut it short.
  setTimeout(function () {
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) {
      window.addEventListener(t, skip, { passive: true });
    });
  }, 300);

  // Never hold the page hostage: fade out even if the drawing fails to load.
  setTimeout(function () { finish(false); }, 4500);

  chalkReady.then(function () {
    return window.ChalkDraw.play(mark, 1500);
  }).then(function () {
    setTimeout(function () { finish(false); }, 400);
  }).catch(function () { finish(false); });
}

// ─────────────────────────────────────────────────────────────────
//  HERO: scroll-scrubbed frame sequence on a canvas
// ─────────────────────────────────────────────────────────────────

function smooth(t) { return t * t * (3 - 2 * t); }

function focusAt(p) {
  var k = HERO.focus;
  for (var i = 1; i < k.length; i++) {
    if (p <= k[i][0]) {
      var a = k[i - 1], b = k[i];
      var t = b[0] === a[0] ? 1 : (p - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * smooth(t);
    }
  }
  return k[k.length - 1][1];
}

function pad3(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }

function createHeroScrub(section) {
  var canvas = section.querySelector('.rt-hero__canvas');
  var ctx = canvas.getContext('2d');
  var narrow = window.matchMedia('(max-width: 768px), (orientation: portrait) and (max-width: 1024px)').matches;
  var set = narrow ? HERO.mobile : HERO.desktop;
  var n = set.count;
  var frames = new Array(n);
  var cur = 0, progress = 0, drawn = null, drawnFocus = -1;

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2);
    var w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; drawn = null; }
  }

  function nearest(i) {
    if (frames[i]) return frames[i];
    for (var d = 1; d < n; d++) {
      if (i - d >= 0 && frames[i - d]) return frames[i - d];
      if (i + d < n && frames[i + d]) return frames[i + d];
    }
    return null;
  }

  function draw() {
    var img = nearest(cur);
    if (!img) return;
    var f = focusAt(progress);
    if (img === drawn && Math.abs(f - drawnFocus) < 0.0005) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    var fx = (f - set.cropX0) / set.cropW;            // focus in this frame set's space
    var x = Math.min(0, Math.max(cw - dw, cw / 2 - fx * dw));
    var y = (ch - dh) / 2;
    ctx.drawImage(img, x, y, dw, dh);
    drawn = img; drawnFocus = f;
    if (!section.classList.contains('is-live')) section.classList.add('is-live');
  }

  // Progressive preload: first and last frames, then every 16th, 8th, 4th, 2nd, all.
  var queue = [0, n - 1], seen = {};
  seen[0] = seen[n - 1] = true;
  [16, 8, 4, 2, 1].forEach(function (step) {
    for (var i = 0; i < n; i += step) if (!seen[i]) { seen[i] = true; queue.push(i); }
  });
  var active = 0;
  function pump() {
    while (active < 4 && queue.length) {
      (function (i) {
        active++;
        var img = new Image();
        img.decoding = 'async';
        img.onload = function () { frames[i] = img; active--; if (Math.abs(i - cur) < 16 || !drawn) draw(); pump(); };
        img.onerror = function () { active--; pump(); };
        img.src = v(BASE + set.dir + pad3(i + 1) + '.webp');
      })(queue.shift());
    }
  }
  size();
  pump();

  return {
    set: function (p) {
      progress = p;
      cur = Math.round(p * (n - 1));
      draw();
    },
    resize: function () { size(); draw(); }
  };
}

function initHero(gsap, ScrollTrigger) {
  var section = document.querySelector('.rt-hero');
  if (!section) return;

  if (REDUCED || HERO.mode === 'still') {
    if (!REDUCED) {
      // Stand-in for a frame sequence: a slow, scroll-driven drift over the still.
      gsap.fromTo(section.querySelector('.rt-hero__still'),
        { scale: 1.02, yPercent: 0 },
        { scale: 1.1, yPercent: 2, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: function () { return '+=' + window.innerHeight * HERO.viewports; }, pin: true, scrub: HERO.scrub } });
    }
    return;
  }

  var scrub = createHeroScrub(section);
  var state = { p: 0 };
  gsap.to(state, {
    p: 1,
    ease: 'none',
    onUpdate: function () { scrub.set(state.p); },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: function () { return '+=' + window.innerHeight * HERO.viewports; },
      pin: true,
      scrub: HERO.scrub,
      invalidateOnRefresh: true,
      onRefresh: function () { scrub.resize(); }
    }
  });
}

// The scroll cue fades in once the hero is showing, and out once scrolling starts.
function initCue() {
  var cue = document.querySelector('.rt-cue');
  if (!cue) return;
  function hide() {
    if (window.pageYOffset > 40) {
      cue.classList.remove('is-visible');
      window.removeEventListener('scroll', hide);
    }
  }
  introDone.then(function () {
    if (window.pageYOffset > 40) return;
    cue.classList.add('is-visible');
    window.addEventListener('scroll', hide, { passive: true });
  });
}

// ─────────────────────────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────────────────────────

function boot() {
  var mount = document.getElementById('rt-invite');
  if (!mount) { console.error('[invite] #rt-invite not found'); return; }
  render(mount);

  var chalkReady = window.ChalkDraw ? Promise.resolve() : loadScript(v(CHALK + 'chalk-draw.js'));
  chalkReady.catch(function (err) { console.error('[invite]', err); });
  runIntro(chalkReady);
  initCue();

  // Motion only switches on if GSAP arrives promptly. If it's late, the page
  // stays static rather than pinning and jumping under a guest mid-read.
  var gsapReady = window.gsap ? Promise.resolve() : loadScript(LIBS.gsap);
  withTimeout(gsapReady.then(function () {
    return Promise.all([
      window.ScrollTrigger ? null : loadScript(LIBS.scrollTrigger),
      window.SplitText ? null : loadScript(LIBS.splitText)
    ]);
  }), 6000).then(function () {
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger, window.SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
    html.classList.add('rt-motion');
    initHero(gsap, ScrollTrigger);
    // Webfonts and images change layout; recompute trigger positions once settled.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }).catch(function (err) {
    console.error('[invite] Motion disabled:', err);
  });
}

// The mount div sits above this script in the page, so render straight away
// (avoids a blank first paint); fall back to DOMContentLoaded if it doesn't.
if (document.getElementById('rt-invite') || document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);

})();

}
