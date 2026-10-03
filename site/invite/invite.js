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

var $ = window.jQuery;

// ─────────────────────────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────────────────────────

// Bump on every deploy: cache-busts every asset this file loads.
var RT_VERSION = '20261004b';

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
var IS_PORTRAIT = !!(window.matchMedia && window.matchMedia(PORTRAIT_MQ).matches);

// Chalk border: large illustrations and flourishes down both edges of the
// page, partly off-screen. They scroll with the page; each draws itself once,
// and only when it is fully on screen. Flourishes run on into the next section.
// Per item: side 'l' or 'r'; top as a % of its section; peek = % of the
// drawing hidden past the screen edge; f = size factor; rot in degrees.
// Flourishes use the same size factors as the drawings, so their chalk lines
// are the same weight.
// phone: also shown on phones (no margin). A flourish weaves along the edge
// ({ peek }); a drawing sits in the space below the card ({ bottom: px from
// the section's foot, peek, rot }).
// Add a block here as each section is built.
var BORDER = {
  '#rt-invitation': [
    { name: 'candelabra',  w: 306, h: 432, side: 'l', top: 4,  peek: 30, f: 1.6, rot: -6, phone: { bottom: 18, peek: 24, rot: -8 } },
    { name: 'swirl-tall',  w: 220, h: 920, side: 'l', top: 36, peek: 52, f: 1.4, phone: { peek: 55 } },
    { name: 'olive-sprig', w: 234, h: 236, side: 'l', top: 74, peek: 28, f: 1.5, rot: 16 },
    { name: 'swirl-short', w: 200, h: 600, side: 'r', top: 0,  peek: 50, f: 1.4, rot: 4, phone: { peek: 55 } },
    { name: 'wine-bottle', w: 166, h: 408, side: 'r', top: 22, peek: 26, f: 1.6, rot: 8, phone: { bottom: 34, peek: 22, rot: 14 } },
    { name: 'carafe',      w: 274, h: 494, side: 'r', top: 63, peek: 30, f: 1.4, rot: -6 },
    { name: 'swirl-tall',  w: 220, h: 920, side: 'r', top: 96, peek: 50, f: 1.4, rot: 180, phone: { peek: 55 } }
  ]
};

// ─────────────────────────────────────────────────────────────────
//  DATA: copied verbatim from site/main.js (save-the-date)
// ─────────────────────────────────────────────────────────────────
var COMMENTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-k5rT2i2qzBScnQDDGulf-1xS3PO57YXrDIFdPqO5ArZhoJWmTbprKHJd5LVH4yq9YuTOu1XP5358/pub?gid=147883584&single=true&output=csv';
var GUEST_NUMBERS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-k5rT2i2qzBScnQDDGulf-1xS3PO57YXrDIFdPqO5ArZhoJWmTbprKHJd5LVH4yq9YuTOu1XP5358/pub?gid=161076232&single=true&output=csv';

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
    ' style="aspect-ratio:' + ratio + (attrs && attrs.style ? ';' + attrs.style : '') + '"></div>';
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
    '<div class="rt-cue" aria-hidden="true">' + CUE_SVG + '</div>' +
  '</section>';
}

// Section 2. On portrait screens this sits directly under the square film and
// is pinned with it, so the greeting shows beneath the film while it plays.
function invitationMarkup() {
  return '<section class="rt-invitation" id="rt-invitation" aria-labelledby="rt-invitation-names">' +
    borderMarkup('#rt-invitation') +
    '<div class="rt-card">' +
      '<div class="rt-greet">' +
        '<p class="rt-greet__to"><i>to</i></p>' +
        '<p class="rt-greet__name" id="guestNameDisplay"></p>' +
        '<span class="rt-greet__rule" aria-hidden="true"></span>' +
      '</div>' +
      // Drawn once the card has appeared (see initStage)
      chalkDiv('church', '766/770', { cls: 'rt-church', extra: ' aria-hidden="true" data-chalk-mode="manual"' }) +
      '<p class="rt-inv__lead" data-reveal="lines">Together with their families</p>' +
      '<h2 class="rt-inv__names" id="rt-invitation-names" data-reveal="lines">' +
        '<span class="rt-inv__name">Rebecca Bonavia</span> ' +
        '<span class="rt-inv__amp">&amp;</span> ' +
        '<span class="rt-inv__name">Thomas Bowers</span>' +
      '</h2>' +
      '<p class="rt-inv__ask" data-reveal="lines">Invite you to celebrate their marriage</p>' +
      '<dl class="rt-details">' +
        '<div class="rt-detail"><dt>Date</dt><dd>Saturday, <span class="rt-nowrap">10th July 2027</span></dd></div>' +
        '<div class="rt-detail"><dt>Time</dt><dd>From 4.00pm</dd></div>' +
        '<div class="rt-detail"><dt>Venue</dt><dd>St. Paul\u2019s Cathedral, Mdina, Malta</dd></div>' +
        '<div class="rt-detail"><dt>Attire</dt><dd>Black Tie</dd></div>' +
      '</dl>' +
    '</div>' +
  '</section>';
}

// Temporary: stands in for sections 3-8 until they are built.
function nextMarkup() {
  return '<section class="rt-next"><p class="rt-next__label">Sections 3-8 to follow</p></section>';
}

// The chalk border layer for one section (sits behind the section's content).
function borderMarkup(selector) {
  var items = BORDER[selector];
  if (!items) return '';
  return '<div class="rt-border" aria-hidden="true">' + items.map(function (it) {
    // Width is relative to the drawing's native width, so line weights match
    // across all the illustrations (as chalk-draw's README recommends).
    var ph = it.phone, cls = '';
    var style = 'top:' + it.top + '%;--peek:' + it.peek + ';--w:' + it.w + ';--f:' + it.f + ';--rot:' + (it.rot || 0) + 'deg';
    if (ph) {
      cls = ph.bottom != null ? ' rt-border__item--phone-foot' : ' rt-border__item--phone-edge';
      style += ';--ppeek:' + (ph.peek || 50) + ';--prot:' + (ph.rot || 0) + 'deg' + (ph.bottom != null ? ';--pb:' + ph.bottom : '');
    }
    return '<div class="rt-border__item rt-border__item--' + it.side + cls + '" style="' + style + '">' +
      chalkDiv(it.name, it.w + '/' + it.h, { extra: ' data-chalk-mode="manual"' + (it.name.indexOf('swirl') === 0 ? ' data-swirl' : '') }) +
    '</div>';
  }).join('') + '</div>';
}

// Shown when there is no ?name= (logic in initGuestName, from main.js).
function promptMarkup() {
  return '<div id="guestPrompt" role="region" aria-label="Your name">' +
    '<p>Type your name here</p>' +
    '<input type="text" id="guestPromptInput" placeholder="Your name..." aria-label="Your name" autocomplete="name">' +
    '<button type="button" id="guestPromptSubmit">Submit</button>' +
  '</div>';
}

function render(mount) {
  mount.innerHTML = introMarkup() +
    '<main class="rt-main">' +
      '<div class="rt-opening">' + heroMarkup() + invitationMarkup() + '</div>' +
      nextMarkup() +
    '</main>' +
    promptMarkup();
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

// ─────────────────────────────────────────────────────────────────
//  STAGE: the film plays under the scroll, fades to paper, the chalk
//  border draws itself, then the invitation card is set down
// ─────────────────────────────────────────────────────────────────

var stageOpened = false, resolveStage, resolveCard;
var stageOpen = new Promise(function (r) { resolveStage = r; });   // the film has gone
var cardShown = new Promise(function (r) { resolveCard = r; });    // the card is appearing

// animateCard: show the card with motion (true) or as it already is (false)
function openStage(animateCard) {
  if (stageOpened) return;
  stageOpened = true;
  resolveStage();
  if (!animateCard) { resolveCard(); return; }
  // Let the first drawings get going before the card arrives
  setTimeout(function () {
    window.gsap.to('.rt-card', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' });
    setTimeout(resolveCard, 350);
  }, 1300);
}

function initStage(gsap, ScrollTrigger) {
  var hero = document.querySelector('.rt-hero');
  var opening = document.querySelector('.rt-opening');
  if (!hero || !opening || REDUCED) { openStage(false); return; }

  // The film now lies over the top of the invitation; the card waits unseen.
  html.classList.add('rt-stage');
  gsap.set('.rt-card', { opacity: 0, y: 40 });

  var scrub = HERO.mode === 'frames' ? createHeroScrub(hero) : null;
  var state = { p: 0 };
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: opening,
      start: 'top top',
      // the film, then one more screen for it to fade
      end: function () { return '+=' + window.innerHeight * (HERO.viewports + 1); },
      pin: true,
      scrub: HERO.scrub,
      invalidateOnRefresh: true,
      onRefresh: function () { if (scrub) scrub.resize(); }
    }
  });
  if (scrub) {
    tl.to(state, { p: 1, duration: HERO.viewports, ease: 'none', onUpdate: function () { scrub.set(state.p); } });
  } else {
    // Stand-in for a frame sequence: a slow, scroll-driven drift over the still
    tl.fromTo(hero.querySelector('.rt-hero__still'), { scale: 1.02 }, { scale: 1.1, duration: HERO.viewports, ease: 'none' });
  }
  tl.to(hero, { opacity: 0, duration: 0.6, ease: 'none' })
    .call(function () { openStage(true); })
    .to({}, { duration: 0.4 });
}

// Border drawings wait until the film has gone, then each draws once it is
// entirely on screen (tall flourishes: once their top is near the top of the
// screen). Several arriving together draw one after another.
function initBorder(chalkReady) {
  var items = [].slice.call(document.querySelectorAll('.rt-border .chalk')).filter(function (el) {
    return el.getClientRects().length;   // skip drawings hidden at this screen size
  });
  if (!items.length) return;
  var lastStart = 0, ticking = false;

  function play(el, delay) {
    var ms = el.hasAttribute('data-swirl') ? 3200 : 2400;
    setTimeout(function () {
      chalkReady.then(function () { window.ChalkDraw.play(el, ms); });
    }, delay);
  }
  function check() {
    ticking = false;
    var vh = window.innerHeight, now = performance.now();
    items = items.filter(function (el) {
      var r = el.getBoundingClientRect();
      // whole drawing on screen (or already scrolled up past); taller-than-
      // screen flourishes start once their top reaches the top of the screen
      var whole = r.bottom <= vh;
      var tall = r.height > vh * 0.85 && r.top <= vh * 0.15;
      if (!whole && !tall) return true;
      var start = Math.max(now, lastStart + 350);
      lastStart = start;
      play(el, start - now);
      return false;
    });
    if (!items.length) {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    }
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }

  stageOpen.then(function () {
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    check();
  });
}

// The church is drawn into the card once it has appeared.
function initChurch(chalkReady) {
  var el = document.querySelector('.rt-church');
  if (!el) return;
  cardShown.then(function () {
    setTimeout(function () {
      chalkReady.then(function () { window.ChalkDraw.play(el, 2600); });
    }, 450);
  });
}

// ─────────────────────────────────────────────────────────────────
//  REVEALS: headings and key lines slide up line by line behind a mask
// ─────────────────────────────────────────────────────────────────

// Plays a reveal once its trigger enters view, but never before the card
// itself has appeared.
function onEnter(ScrollTrigger, trigger, start, play) {
  ScrollTrigger.create({
    trigger: trigger,
    start: start,
    once: true,
    pinnedContainer: trigger.closest('.rt-opening') ? '.rt-opening' : undefined,
    onEnter: function () { cardShown.then(play); }
  });
}

function initReveals(gsap, ScrollTrigger, SplitText) {
  if (REDUCED) return;

  // Greeting: the guest's name, then the rule drawn out beneath it
  var greet = document.querySelector('.rt-greet');
  if (greet) {
    var tl = gsap.timeline({ paused: true });
    tl.from(greet.querySelectorAll('.rt-greet__to, .rt-greet__name'), { y: 14, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.18 })
      .from(greet.querySelector('.rt-greet__rule'), { scaleX: 0, duration: 1.1, ease: 'expo.out' }, '-=0.8');
    onEnter(ScrollTrigger, greet, 'top 92%', function () { tl.play(); });
  }

  document.querySelectorAll('[data-reveal="lines"]').forEach(function (el) {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'rt-line',
      autoSplit: true,
      onSplit: function (self) {
        var tween = gsap.from(self.lines, { yPercent: 105, opacity: 0, duration: 1.15, ease: 'expo.out', stagger: 0.12, paused: true });
        onEnter(ScrollTrigger, el, 'top 86%', function () { tween.play(); });
        return tween;
      }
    });
  });

  // The four detail tiles fade up in sequence
  var details = document.querySelector('.rt-details');
  if (details) {
    var tiles = gsap.from(details.children, { y: 18, opacity: 0, duration: 0.95, ease: 'power3.out', stagger: 0.15, paused: true });
    onEnter(ScrollTrigger, details, 'top 85%', function () { tiles.play(); });
  }
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
//  Guest name: copied from site/main.js. Changes from the original:
//  the prompt waits for the intro to finish (was a fixed 2s), and the
//  [GuestAllowance] debug logs are removed.
// ─────────────────────────────────────────────────────────────────
var guestName = '';

function initGuestName() {
  var raw = window.location.search;
  var match = raw.match(/[?&]name=([^]*?)(?:&(?:utm_|gclid|fbclid|ref=)|$)/i);
  if (!match) match = raw.match(/[?&]name=([^]*)/i);

  if (match && match[1]) {
    var decoded = decodeURIComponent(match[1].trim());
    guestName = decoded.replace(/\s+$/, '');
    $('#guestNameDisplay').html(escapeHtml(guestName));
    $('#commentGuestName').val(guestName);
    loadGuestAllowance(guestName);
  } else {
    // No name in URL — show Guest and display soft prompt once the intro has gone
    guestName = 'Guest';
    $('#guestNameDisplay').html('Guest');
    $('#commentGuestName').val('Guest');
    introDone.then(function () {
      setTimeout(function() { $('#guestPrompt').fadeIn(400); }, 1200);
    });
  }

  // Prompt input — show submit button once user starts typing
  $('#guestPromptInput').on('input', function() {
    var val = $(this).val().trim();
    if (val.length > 0) {
      $('#guestPromptSubmit').fadeIn(200);
    } else {
      $('#guestPromptSubmit').fadeOut(150);
    }
  });

  // Submit: update URL and reload so name persists everywhere
  $('#guestPromptSubmit').on('click', function() {
    var val = $('#guestPromptInput').val().trim();
    if (!val) return;
    var encoded = encodeURIComponent(val);
    var newURL = window.location.pathname + '?name=' + encoded;
    window.location.href = newURL;
  });

  // Also submit on Enter key
  $('#guestPromptInput').on('keydown', function(e) {
    if (e.key === 'Enter') { $('#guestPromptSubmit').trigger('click'); }
  });
}

function escapeHtml(str) {
  return $('<div>').text(str).html();
}

function loadGuestAllowance(name) {
  if (!name || name === 'Guest') return;
  fetch(GUEST_NUMBERS_CSV_URL)
    .then(function(r) { return r.text(); })
    .then(function(csv) {
      var rows = csv.trim().split('\n');
      var allowance = null;
      var nameLower = name.trim().toLowerCase();
      for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].split(',');
        if (cols.length >= 2) {
          var sheetName = cols[0].replace(/^"+|"+$/g, '').trim().toLowerCase();
          if (sheetName === nameLower) {
            allowance = parseInt(cols[1].replace(/[^0-9]/g, ''), 10);
            break;
          }
        }
      }
      if (allowance && allowance > 0) {
        applyGuestAllowance(allowance);
      }
    })
    .catch(function(err) { console.log('[GuestAllowance] Error:', err); });
}

function applyGuestAllowance(max) {
  var selectEl = document.querySelector('.rsvpTotal');
  if (!selectEl) return;
  selectEl.innerHTML = '';
  for (var i = 1; i <= max; i++) {
    var opt = document.createElement('option');
    opt.value = i;
    opt.text = i;
    if (i === Math.min(max, 2)) opt.selected = true;
    selectEl.appendChild(opt);
  }
  if (max === 1) {
    var box = selectEl.closest('.rsvpTotalBox');
    if (box) box.style.display = 'none';
  }
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
  initBorder(chalkReady);
  initChurch(chalkReady);
  if (window.jQuery) {
    $ = window.jQuery;
    initGuestName();
    // No name in the link: a neutral greeting rather than the guest-name style
    if (guestName === 'Guest') $('#guestNameDisplay').addClass('rt-greet__name--anon');
  }
  else console.error('[invite] jQuery missing: guest name and forms disabled');

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
    initStage(gsap, ScrollTrigger);
    initReveals(gsap, ScrollTrigger, window.SplitText);
    // Webfonts and images change layout; recompute trigger positions once settled.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }).catch(function (err) {
    console.error('[invite] Motion disabled:', err);
    openStage(false);
  });
}

// The mount div sits above this script in the page, so render straight away
// (avoids a blank first paint); fall back to DOMContentLoaded if it doesn't.
if (document.getElementById('rt-invite') || document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);

})();

}
