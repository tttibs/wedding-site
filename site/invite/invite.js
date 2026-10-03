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
var RT_VERSION = '20261003c';

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
// mode 'frames' scrubs the image sequence; 'still' shows the still with a slow zoom.
// Landscape screens get the full-bleed film; portrait screens get a square crop
// (holding the tray and the glass) with the next section showing beneath it.
var HERO = {
  mode: 'frames',
  desktop: { dir: 'hero/d/', count: 145, still: 'hero/still.jpg' },
  square:  { dir: 'hero/m/', count: 73,  still: 'hero/still-square.jpg' },
  viewports: 3,   // pinned scroll distance
  scrub: 0.6      // seconds of catch-up: gives the scrub a little weight
};
var PORTRAIT_MQ = '(orientation: portrait)';   // keep in step with invite.css

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

// Inlined (from assets/chalk/svg/monogram.svg) so the intro can start drawing
// without waiting for a download.
var MONOGRAM_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"11.4 32.9 1066.1 1061.1\" width=\"1066.1\" height=\"1061.1\" data-chalk=\"1\" data-step=\"5\" data-minw=\"0\" data-wave=\"38,13,95,52,19,7\" data-taper=\"0.45,40,0.35,55\" data-alpha=\"0.5,0.55,0.75\" data-speed=\"1.6\" data-overlap=\"0.85\"><title>R &amp; T monogram</title><g fill=\"none\" stroke=\"#111\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke-width=\"12\" d=\"M245 880 C200 830,170 760,160 690 C150 650,90 640,60 610 C35 580,50 520,80 480 C110 440,100 410,130 390 C170 360,250 330,330 300 C420 260,440 160,520 70 C580 60,640 120,700 140 C790 150,880 200,910 290 C930 350,910 410,940 440 C1010 450,1050 520,1040 590 C1030 650,970 680,990 730 C1010 790,960 850,880 875 C862 880,850 882,840 880\"/><path stroke-width=\"11\" d=\"M240 378 C320 350,410 320,440 250 C470 170,500 110,550 100 C590 95,598 150,568 160 C550 165,545 142,562 138\"/><path stroke-width=\"11\" d=\"M820 235 C880 270,910 330,895 375 C885 405,858 402,866 384\"/><path stroke-width=\"11\" d=\"M935 478 C990 490,1015 540,1005 590 C995 640,950 650,955 700 C960 760,920 810,860 830 C830 840,815 820,830 805 C840 797,852 805,848 815\"/><path stroke-width=\"11\" d=\"M185 400 C160 410,140 440,140 470 C140 500,100 510,105 560 C110 600,170 605,172 575 C173 560,155 558,152 570\"/><path stroke-width=\"11\" d=\"M208 682 C205 745,222 805,255 838 C282 862,318 835,312 800 C308 778,284 782,290 800\"/><path stroke-width=\"12\" d=\"M165 965 C160 935,210 930,235 955 C255 975,270 1010,290 1030 C310 1050,330 1055,360 1055 L770 1058 C800 1020,815 960,840 930 C860 915,890 920,888 945 C886 960,868 958,868 948\"/><path stroke-width=\"10\" d=\"M318 948 C330 940,342 960,340 990 C338 1000,345 1003,360 1003 L750 998 C770 960,780 920,800 910\"/><path stroke-width=\"10\" d=\"M418 612 C392 610,378 588,392 566 C410 538,452 548,446 576 C442 596,412 594,418 572 C428 532,470 488,530 484 C585 480,602 516,580 548 C560 576,512 582,494 570 C484 563,490 550,502 556\"/><path stroke-width=\"11\" d=\"M520 488 C516 560,506 640,486 700 C472 742,438 752,424 730 C412 710,436 696,448 712 C456 724,448 742,434 746\"/><path stroke-width=\"10\" d=\"M508 572 C540 596,546 654,560 698 C574 742,612 750,630 722 C642 702,628 684,612 694 C602 702,608 716,620 714\"/><path stroke-width=\"9\" d=\"M664 612 C658 594,632 594,634 614 C636 632,660 636,656 654 C652 672,626 674,626 656 C626 640,654 630,674 636\"/><path stroke-width=\"10\" d=\"M700 560 C668 566,650 540,664 520 C680 498,720 504,712 528 C706 546,682 540,690 522 C704 492,760 498,800 492 C834 486,852 470,846 452 C840 436,818 440,820 456 C822 468,836 470,842 462\"/><path stroke-width=\"11\" d=\"M770 496 C768 566,760 640,742 696 C728 740,694 752,678 730 C664 710,688 694,700 710 C710 724,700 742,684 744\"/></g></svg>";

var CUE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="6 9 12 15 18 9"></polyline></svg>';

function introMarkup() {
  if (!showIntro) return '';
  return '<div class="rt-intro" aria-hidden="true">' +
    '<div class="chalk rt-intro__mark" data-chalk-inline data-chalk-mode="manual" data-chalk-color="#1a0a0a" style="aspect-ratio:1066/1061">' +
      MONOGRAM_SVG +
    '</div>' +
  '</div>';
}

function heroMarkup() {
  return '<section class="rt-hero" aria-labelledby="rt-title">' +
    '<h1 class="rt-sr" id="rt-title">Rebecca Bonavia &amp; Thomas Bowers. Saturday 10 July 2027, Mdina, Malta.</h1>' +
    '<div class="rt-hero__media">' +
      '<picture>' +
        '<source media="' + PORTRAIT_MQ + '" srcset="' + v(BASE + HERO.square.still) + '">' +
        '<img class="rt-hero__still" src="' + v(BASE + HERO.desktop.still) + '" alt="A candlelit dinner table from above. On a silver tray, a lace card reads Rebecca and Thomas, 10th July 2027, Malta." fetchpriority="high" decoding="async">' +
      '</picture>' +
      '<canvas class="rt-hero__canvas" aria-hidden="true"></canvas>' +
    '</div>' +
    // Portrait only: paper beneath the square film, where the next section begins.
    '<div class="rt-hero__peek">' +
      '<p class="rt-next__label">Next: the invitation</p>' +
    '</div>' +
    '<div class="rt-cue" aria-hidden="true">' + CUE_SVG + '</div>' +
  '</section>';
}

// Temporary: stands in for sections 2-8 until they are built.
function nextMarkup() {
  return '<section class="rt-next"><p class="rt-next__label">Sections 2-8 to follow</p></section>';
}

function render(mount) {
  mount.innerHTML = introMarkup() + heroMarkup() + '<main class="rt-main">' + nextMarkup() + '</main>';
  if (showIntro) html.classList.add('rt-lock');
}

// ─────────────────────────────────────────────────────────────────
//  INTRO: monogram draws on paper, holds, fades to the hero (~4.5s)
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
    }, fast ? 350 : 1050);
  }
  function skip() { finish(true); }

  // Any deliberate input skips the intro; ignore the first moment so a
  // stray touch from opening the email doesn't cut it short.
  setTimeout(function () {
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) {
      window.addEventListener(t, skip, { passive: true });
    });
  }, 300);

  // Never hold the page hostage: fade out even if something stalls.
  setTimeout(function () { finish(false); }, 7500);

  // The drawing is inline, so it only waits for chalk-draw.js. If that can't
  // arrive promptly (very slow connection), go straight to the hero.
  var started = false;
  setTimeout(function () { if (!started) finish(true); }, 3000);

  chalkReady.then(function () {
    if (finished) return;
    started = true;
    return window.ChalkDraw.play(mark, 2800);
  }).then(function () {
    setTimeout(function () { finish(false); }, 800);
  }).catch(function () { finish(false); });
}

// ─────────────────────────────────────────────────────────────────
//  HERO: scroll-scrubbed frame sequence on a canvas
// ─────────────────────────────────────────────────────────────────

function pad3(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }

function createHeroScrub(section) {
  var canvas = section.querySelector('.rt-hero__canvas');
  var ctx = canvas.getContext('2d');
  var portrait = window.matchMedia(PORTRAIT_MQ).matches;
  var set = portrait ? HERO.square : HERO.desktop;
  var n = set.count;
  var frames = new Array(n);
  var cur = 0, drawn = null;

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    if (img === drawn) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    var x = (cw - dw) / 2;
    var y = (ch - dh) / 2;
    ctx.drawImage(img, x, y, dw, dh);
    drawn = img;
    if (!section.classList.contains('is-live')) section.classList.add('is-live');
  }

  // Progressive preload: first and last frames, then every 16th and 8th straight
  // away (enough to scrub coarsely); the rest (every 4th, 2nd, all) only once the
  // guest starts scrolling, so a guest who just reads the top on roaming data
  // doesn't download the whole film.
  var queue = [0, n - 1], rest = [], seen = {};
  seen[0] = seen[n - 1] = true;
  [16, 8, 4, 2, 1].forEach(function (step) {
    for (var i = 0; i < n; i += step) if (!seen[i]) { seen[i] = true; (step >= 8 ? queue : rest).push(i); }
  });
  function more() {
    window.removeEventListener('scroll', more);
    queue = queue.concat(rest); rest = [];
    pump();
  }
  window.addEventListener('scroll', more, { passive: true });
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
