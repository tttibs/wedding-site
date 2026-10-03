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

// ─────────────────────────────────────────────────────────────────
//  A LITTLE GUIDE TO MALTA: edit the places here.
//  Each tab: id, label, an optional row of chalk drawings, and places.
//  Each place: name, area, text, and map (what to search for on Google
//  Maps; '' hides the link). Descriptions are drafts in the couple's voice.
//  spotify: paste the playlist's share link, e.g.
//  'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' ('' shows a placeholder).
// ─────────────────────────────────────────────────────────────────
var GUIDE = {
  intro: 'For those visiting Malta for the first time, we\u2019ve put together a little guide to some of our favourite places, things to do and spots to eat across the island. Malta is very special to us, and we hope you\u2019ll have some time to explore beyond the wedding celebrations - whether that\u2019s wandering through the old streets of Valletta, swimming in the sea, discovering a little village or lingering over a long lunch. These are a few of the places we love and the things we\u2019d recommend making time for while you\u2019re here. We hope you enjoy discovering Malta as much as we do.',
  tabs: [
    { id: 'history', label: 'History & culture', places: [
      { name: 'St John\u2019s Co-Cathedral', area: 'Valletta', map: 'St John\'s Co-Cathedral, Valletta, Malta',
        text: 'Plain from the outside and astonishing within: every surface is gilded and carved, and Caravaggio\u2019s The Beheading of Saint John the Baptist hangs in the oratory.' },
      { name: '\u0126al Saflieni Hypogeum', area: 'Paola', map: 'Hal Saflieni Hypogeum, Paola, Malta',
        text: 'A 5,000-year-old underground burial site carved out of the rock. Only a few small groups go down each day, so book weeks ahead.' },
      { name: 'Birgu and the Three Cities', area: 'Across the Grand Harbour', map: 'Fort St Angelo, Birgu, Malta',
        text: 'Take a traditional d\u0121\u0127ajsa boat across the harbour from Valletta, wander the quiet lanes and finish at Fort St Angelo.' },
      { name: '\u0126a\u0121ar Qim and Mnajdra', area: 'Qrendi', map: 'Hagar Qim Temples, Qrendi, Malta',
        text: 'Two prehistoric temples on the cliffs above the sea, older than Stonehenge and lined up with the sunrise. Lovely late in the afternoon.' },
      { name: '\u0120gantija Temples', area: 'Xag\u0127ra, Gozo', map: 'Ggantija Temples, Xaghra, Gozo, Malta',
        text: 'Among the oldest free-standing buildings in the world, and a good reason to take the ferry over to Gozo for the day.' }
    ] },
    { id: 'beaches', label: 'Beach hopping', places: [
      { name: 'G\u0127ajn Tuffie\u0127a', area: 'North-west Malta', map: 'Ghajn Tuffieha Bay, Malta',
        text: 'A long flight of steps keeps the crowds away from this sandy bay beneath the cliffs. Our favourite for a swim.' },
      { name: 'Golden Bay', area: 'North-west Malta', map: 'Golden Bay, Malta',
        text: 'Easy, sandy and sheltered, with sunbeds and caf\u00e9s, and some of the best sunsets on the island.' },
      { name: 'St Peter\u2019s Pool', area: 'Delimara', map: 'St Peter\'s Pool, Delimara, Malta',
        text: 'Flat rock shelves and deep, clear water for jumping in. Go on a Sunday morning and stop at the Marsaxlokk fish market on the way.' },
      { name: 'Blue Lagoon', area: 'Comino', map: 'Blue Lagoon, Comino, Malta',
        text: 'The famous turquoise water between Comino and its islet. You now need a free booked pass to land, so plan ahead and go early.' },
      { name: 'Ramla Bay', area: 'Gozo', map: 'Ramla Bay, Gozo, Malta',
        text: 'Gozo\u2019s wide red-gold beach, unspoilt beneath the hills. Pair it with the \u0120gantija Temples for a day on Gozo.' }
    ] },
    { id: 'food', label: 'Food, wine & music',
      art: [
        { name: 'bread-loaf', w: 457, h: 206 }, { name: 'cheese-wheel', w: 346, h: 226 },
        { name: 'fig', w: 177, h: 222 }, { name: 'tomato', w: 205, h: 188 }, { name: 'garlic', w: 204, h: 258 }
      ],
      places: [
        { name: 'Diar il-Bniet', area: 'Dingli', map: 'Diar il-Bniet, Dingli, Malta',
          text: 'Farm-to-table Maltese cooking from the family\u2019s own fields, a short drive from the Dingli Cliffs at sunset.' },
        { name: 'Trabuxu Wine Bar', area: 'Valletta', map: 'Trabuxu Wine Bar, Valletta, Malta',
          text: 'Maltese wines and small plates in a centuries-old stone cellar. Perfect for a slow evening.' },
        { name: 'Meridiana Wine Estate', area: 'Ta\u2019 Qali', map: 'Meridiana Wine Estate, Ta\' Qali, Malta',
          text: 'A boutique vineyard in the middle of the island. Book a tasting with a platter of local cheese and bread (weekdays).' },
        { name: 'The Bridge Bar', area: 'Valletta', map: 'The Bridge Bar, Valletta, Malta',
          text: 'Live jazz on the steps of Valletta with the Grand Harbour below, on its weekly music nights.' },
        { name: 'Nenu the Artisan Baker', area: 'Valletta', map: 'Nenu the Artisan Baker, Valletta, Malta',
          text: 'Traditional Maltese baking, from proper ftira to timpana. A good, unhurried lunch in Valletta.' }
      ] },
    { id: 'playlist', label: 'Our playlist', spotify: '' }
  ]
};

// ─────────────────────────────────────────────────────────────────
//  BACKGROUND MUSIC: put the track in site/invite/music/ and set src to
//  its file name, e.g. 'music/piano.mp3'. '' hides the music toggle.
//  Off by default; guests turn it on from the navigation.
// ─────────────────────────────────────────────────────────────────
var MUSIC = { src: '', volume: 0.3 };

// Bump on every deploy: cache-busts every asset this file loads.
var RT_VERSION = '20261008a';

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
// phone: also shown on phones, peeking in from the edge beside the narrower
// card ({ peek, top?, rot? } override the desktop values).
// Add a block here as each section is built.
var BORDER = {
  '#rt-invitation': [
    { name: 'candelabra',  w: 306, h: 432, side: 'l', top: 2,  peek: 30, f: 1.6, rot: -6,  phone: { peek: 56, top: 5 } },
    { name: 'olive-sprig', w: 234, h: 236, side: 'l', top: 53, peek: 28, f: 1.5, rot: 16,  phone: { peek: 52, top: 42 } },
    { name: 'swirl-short', w: 200, h: 600, side: 'l', top: 79, peek: 50, f: 1.4,           phone: { peek: 64, top: 66 } },
    { name: 'wine-bottle', w: 166, h: 408, side: 'r', top: 4,  peek: 26, f: 1.6, rot: 8,   phone: { peek: 50, top: 14 } },
    { name: 'candlestick', w: 216, h: 374, side: 'r', top: 49, peek: 30, f: 1.6, rot: -6,  phone: { peek: 56, top: 46 } },
    { name: 'swirl-curl',  w: 280, h: 180, side: 'r', top: 101, peek: 40, f: 1.4, rot: -10, phone: { peek: 50, top: 90 } }
  ],
  '#rt-events': [
    // On desktop this section is one screen tall (pinned), so it holds just two
    { name: 'fork',        w: 214, h: 352, side: 'l', top: 64, peek: 32, f: 1.5, rot: -14 },
    { name: 'swirl-short', w: 200, h: 600, side: 'r', top: 42, peek: 50, f: 1.4, rot: 176, phone: { peek: 64, top: 78 } }
  ],
  '#rt-faq': [
    // Short section (questions closed): placed low, clear of section 3's drawings
    { name: 'prickly-pear', w: 287, h: 381, side: 'l', top: 48, peek: 30, f: 1.4, rot: -6, phone: { peek: 56, top: 20 } },
    { name: 'fig',          w: 177, h: 222, side: 'r', top: 62, peek: 28, f: 1.6, rot: 10, phone: { peek: 52, top: 52 } }
  ],
  // Sections 5 and 6 grow (form opening, notes loading): their border layers
  // have a fixed height in invite.css, so these % values don't drift.
  '#rt-rsvp': [
    { name: 'spoon',       w: 246, h: 332, side: 'l', top: 40, peek: 30, f: 1.5, rot: 10,  phone: { peek: 56, top: 40 } },
    { name: 'swirl-short', w: 200, h: 600, side: 'r', top: 36, peek: 50, f: 1.4, rot: 6,   phone: { peek: 64, top: 30 } }
  ],
  '#rt-notes': [
    { name: 'swirl-tall',  w: 220, h: 920, side: 'l', top: 32, peek: 52, f: 1.4,           phone: { peek: 66, top: 34 } },
    { name: 'corkscrew',   w: 236, h: 298, side: 'r', top: 69, peek: 28, f: 1.5, rot: 8,   phone: { peek: 52, top: 66 } }
  ],
  '#rt-guide': [
    { name: 'candelabra',  w: 306, h: 432, side: 'r', top: 20, peek: 30, f: 1.4, rot: 6,   phone: { peek: 56, top: 8 } },
    { name: 'swirl-short', w: 200, h: 600, side: 'l', top: 46, peek: 50, f: 1.4, rot: 180, phone: { peek: 64, top: 46 } },
    { name: 'wine-glass',  w: 165, h: 397, side: 'r', top: 58, peek: 26, f: 1.5, rot: -6,  phone: { peek: 50, top: 74 } },
    { name: 'swirl-curl',  w: 280, h: 180, side: 'l', top: 92, peek: 40, f: 1.4, rot: 10,  phone: { peek: 50, top: 94 } }
  ]
};

// Add to calendar: the weekend's three events. Times are UTC (Malta is UTC+2
// in July): welcome drinks 3-5pm, the wedding 3.30pm-2am, the debrief 12-4pm.
var CAL_EVENTS = [
  { id: 'prologue', title: 'Welcome drinks | Rebecca & Thomas', start: '20270708T130000Z', end: '20270708T150000Z',
    location: 'Malta (venue details to follow)',
    desc: 'Welcome drinks before the wedding of Rebecca Bonavia & Thomas Bowers, 3pm to 5pm. Venue details to follow.' },
  { id: 'wedding', title: 'The wedding of Rebecca & Thomas', start: '20270710T133000Z', end: '20270711T000000Z',
    location: 'St. Paul\u2019s Cathedral, Mdina, Malta',
    desc: 'Guests to arrive from 3.30pm for the ceremony at 4pm at St. Paul\u2019s Cathedral, Mdina. Transport to the reception venue follows the ceremony; cocktail hour, dinner and dancing till 2am. Black tie. Adults only.' },
  { id: 'epilogue', title: 'The debrief | Rebecca & Thomas', start: '20270711T100000Z', end: '20270711T140000Z',
    location: 'Malta (venue details to follow)',
    desc: 'A relaxing afternoon with aperols by our favourite beach shack in Malta, from 12pm.' }
];

// Section 4: the details. Each answer is a list of paragraphs.
var FAQ = [
  { q: 'Getting to & from the wedding', a: [
    'As many of our guests will be travelling to Malta for the wedding, we recommend making your way to the ceremony by Uber or taxi, which will be the easiest way to get to Mdina. Following the ceremony, transport will be provided from Mdina to our reception venue. At the end of the evening, guests are welcome to make their own way home from the venue by Uber or taxi.'
  ] },
  { q: 'The little details', a: [
    'Once we have received your final RSVP, we\u2019ll be in touch with a link to a dedicated wedding guide with all the finer details for the day - including everything you\u2019ll need to know to make the most of our celebrations in Malta.'
  ] },
  { q: 'Dress code', a: [
    'Our dress code is black tie. Tuxedos or formal suits are encouraged for gentlemen, while ladies are invited to wear floor-length gowns in any colour.',
    'As our ceremony will take place in a church, we kindly ask that shoulders are covered during this part of the day. If your chosen outfit does not cover the shoulders, a shawl or sheer cover-up is perfectly welcome.',
    'Our cocktail hour will take place partly on grass, so please keep this in mind when choosing your footwear.',
    'Most importantly, we want you to feel your very best and enjoy the day with us. If you have any questions about the dress code, please don\u2019t hesitate to reach out.'
  ] },
  { q: 'A note on children', a: [
    'While we adore the little ones in our lives, our wedding will be an adults-only celebration. We hope this gives you the rare gift of a late night, a slow morning, and an evening entirely your own.',
    'If you have any concerns about childcare for the wedding date, please don\u2019t hesitate to reach out to us. We\u2019ll be more than happy to help where we can.'
  ] }
];

// Section 3: the chapters of the weekend. Each has a small chalk drawing.
var EVENTS = [
  { part: 'Prologue', title: 'Welcome drinks', date: 'Thursday 8th July 2027', time: '3pm \u2013 5pm',
    art: { name: 'wine-glass', w: 165, h: 397 },
    text: 'Before the big day, join us for a relaxed welcome drink as the sun sets over Malta. Whether you\u2019ve just landed or have been exploring for days, it\u2019s the perfect chance to catch up, meet the people you\u2019ll be dancing with on Saturday, and raise a glass to the weekend ahead. Venue details to follow.' },
  { part: 'Part I', title: 'The ceremony', date: 'Saturday 10th July 2027', time: '4pm \u2013 5pm',
    art: { name: 'candlestick', w: 216, h: 374 },
    text: 'Guests to arrive from 3.30pm for the ceremony commencing promptly at 4pm. Following the ceremony guests will be transported to the reception venue.' },
  { part: 'Part II', title: 'The party', date: 'Saturday 10th July 2027', time: 'Till 2am',
    art: { name: 'corkscrew', w: 236, h: 298 },
    text: 'Cocktail hour, a sit down dinner and lots of dancing to follow.' },
  { part: 'Epilogue', title: 'The debrief', date: 'Sunday 11th July', time: '12pm \u2013 4pm',
    art: { name: 'lemon', w: 186, h: 277 },
    text: 'Join us for a relaxing afternoon with aperols by our favourite beach shack in Malta.' }
];

// ─────────────────────────────────────────────────────────────────
//  DATA: copied verbatim from site/main.js (save-the-date)
// ─────────────────────────────────────────────────────────────────
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyW_tw6VFHiZNEz7iZcm4eTxI3d3mJMGReY7x-bNjx40S1WLgDdgYUe8lrx0vgHTVh0/exec';
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

// The flourishes (swirl-*) are the site's own drawings in invite/svg/; everything
// else comes from the illustrations/ package.
function chalkSrc(name) {
  return v((name.indexOf('swirl') === 0 ? BASE : CHALK) + 'svg/' + name + '.svg');
}

function chalkDiv(name, ratio, attrs) {
  return '<div class="chalk ' + (attrs && attrs.cls || '') + '" data-chalk-src="' + chalkSrc(name) + '"' +
    ' data-chalk-color="' + (attrs && attrs.color || '#1a0a0a') + '"' + (attrs && attrs.extra || '') +
    ' style="aspect-ratio:' + ratio + (attrs && attrs.style ? ';' + attrs.style : '') + '"></div>';
}

// ─────────────────────────────────────────────────────────────────
//  MARKUP
// ─────────────────────────────────────────────────────────────────

var INTRO_KEY = 'rtIntroSeen';
function introSeen() { try { return window.sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { return false; } }
function markIntroSeen() { try { window.sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) {} }

var showIntro = !REDUCED && !introSeen();

// Inlined (from illustrations/svg/monogram.svg) so the intro can start drawing
// without waiting for a download.
var MONOGRAM_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"11.4 32.9 1066.1 1061.1\" width=\"1066.1\" height=\"1061.1\" data-chalk=\"1\" data-step=\"5\" data-minw=\"0\" data-wave=\"38,13,95,52,19,7\" data-taper=\"0.45,40,0.35,55\" data-alpha=\"0.5,0.55,0.75\" data-speed=\"1.6\" data-overlap=\"0.85\"><title>R &amp; T monogram</title><g fill=\"none\" stroke=\"#111\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke-width=\"12\" d=\"M245 880 C200 830,170 760,160 690 C150 650,90 640,60 610 C35 580,50 520,80 480 C110 440,100 410,130 390 C170 360,250 330,330 300 C420 260,440 160,520 70 C580 60,640 120,700 140 C790 150,880 200,910 290 C930 350,910 410,940 440 C1010 450,1050 520,1040 590 C1030 650,970 680,990 730 C1010 790,960 850,880 875 C862 880,850 882,840 880\"/><path stroke-width=\"11\" d=\"M240 378 C320 350,410 320,440 250 C470 170,500 110,550 100 C590 95,598 150,568 160 C550 165,545 142,562 138\"/><path stroke-width=\"11\" d=\"M820 235 C880 270,910 330,895 375 C885 405,858 402,866 384\"/><path stroke-width=\"11\" d=\"M935 478 C990 490,1015 540,1005 590 C995 640,950 650,955 700 C960 760,920 810,860 830 C830 840,815 820,830 805 C840 797,852 805,848 815\"/><path stroke-width=\"11\" d=\"M185 400 C160 410,140 440,140 470 C140 500,100 510,105 560 C110 600,170 605,172 575 C173 560,155 558,152 570\"/><path stroke-width=\"11\" d=\"M208 682 C205 745,222 805,255 838 C282 862,318 835,312 800 C308 778,284 782,290 800\"/><path stroke-width=\"12\" d=\"M165 965 C160 935,210 930,235 955 C255 975,270 1010,290 1030 C310 1050,330 1055,360 1055 L770 1058 C800 1020,815 960,840 930 C860 915,890 920,888 945 C886 960,868 958,868 948\"/><path stroke-width=\"10\" d=\"M318 948 C330 940,342 960,340 990 C338 1000,345 1003,360 1003 L750 998 C770 960,780 920,800 910\"/><path stroke-width=\"11\" d=\"M465.5 484.7 C463.5 485.9,457.3 488.6,453.9 491.4 C450.5 494.2,447.7 497.9,444.9 501.4 C442.2 505,440 508.9,437.5 512.7 C435.1 516.4,432.8 520.3,430.4 524.1 C428.1 527.9,425.9 531.8,423.6 535.6 C421.3 539.5,419.1 543.4,416.7 547.3 C414.5 551.1,412.2 555,410.1 558.9 C407.9 562.8,406 566.9,403.8 570.8 C401.7 574.7,399.4 578.6,397.3 582.6 C395.2 586.5,393.5 590.7,391.5 594.7 C389.6 598.7,387.5 602.8,385.6 606.8 C383.7 610.9,381.7 614.8,379.8 618.8 C377.8 623,375.8 626.9,374 631 C372.1 635.1,370.2 639.2,368.5 643.3 C366.7 647.5,365 651.5,363.1 655.6 C361.4 659.8,359.6 663.9,358 668 C356.3 672.2,355 676.5,353.5 680.7 C352.1 685,350.6 689.2,349.3 693.5 C348.1 697.8,346.9 702.2,346.1 706.5 C345.3 711,344.7 716.3,344.6 719.9 C344.6 723.5,345.7 726.9,345.8 728.3\"/><path stroke-width=\"11\" d=\"M340.6 597.1 C341.2 595,342.2 587.7,344.9 584.5 C347.5 581.4,352.3 579.4,356.4 578.2 C360.5 577,365.5 576.4,369.7 577.3 C373.9 578.3,378.2 582.4,381.3 584 C384.4 585.5,387 586.2,388.1 586.5\"/><path stroke-width=\"11\" d=\"M294.4 485.2 C296.4 483.9,301.7 480,305.7 477.9 C309.6 475.7,313.8 473.9,317.9 472.3 C322.1 470.7,326.5 469.6,330.9 468.5 C335.2 467.3,339.5 466.3,343.8 465.2 C348.2 464.2,352.7 463.3,357 462.4 C361.4 461.5,365.8 460.6,370.2 459.8 C374.7 459.1,379.1 458.4,383.5 457.8 C387.9 457.2,392.4 456.9,396.9 456.4 C401.4 455.9,405.8 455.5,410.3 455.1 C414.7 454.8,419.2 454.4,423.7 454.3 C428.2 454.1,432.7 454,437.1 454 C441.6 454,446.1 454,450.6 454.1 C455.1 454.1,459.6 454.3,464 454.4 C468.5 454.6,472.9 454.9,477.5 455.2 C481.9 455.6,486.4 456,490.8 456.5 C495.3 456.9,499.8 457.4,504.2 458.1 C508.6 458.7,513.1 459.4,517.4 460.2 C521.8 461,526.4 461.8,530.7 462.9 C535 464,539.3 465.2,543.5 467 C547.5 468.8,551.7 470.8,555.3 473.3 C558.8 475.9,562.4 479,565 482.5 C567.7 486.1,569.7 490.3,571.1 494.4 C572.5 498.6,573.2 503.3,573.3 507.7 C573.4 512.1,572.8 516.7,571.7 521 C570.7 525.3,568.9 529.5,566.9 533.5 C564.9 537.5,562.5 541.3,559.8 544.9 C557 548.4,553.9 551.7,550.7 554.8 C547.5 557.9,544 560.8,540.5 563.5 C536.9 566.2,533.1 568.6,529.2 570.9 C525.4 573.2,521.5 575.3,517.4 577.3 C513.4 579.2,509.3 581.1,505.1 582.7 C501 584.4,496.8 586,492.5 587.4 C488.2 588.9,483.9 590.1,479.6 591.2 C475.3 592.3,470.8 593.2,466.4 593.9 C462 594.7,457.6 595.4,453.2 595.9 C448.6 596.3,444.2 596.7,439.7 596.9 C435.3 597,430.8 596.7,426.3 596.6 C421.8 596.5,416.6 595.3,412.8 596.4 C409.2 597.6,404.2 600.5,403.9 603.5 C403.6 606.5,408.6 611,411.4 614.5 C414.1 618,417.3 621.1,420.3 624.5 C423.4 627.8,426.4 631.1,429.3 634.5 C432.3 637.8,435.3 641.2,438.3 644.6 C441.2 647.9,444.1 651.3,447.1 654.8 C450 658.1,453 661.5,455.9 664.7 C458.9 668.1,462 671.5,465.1 674.7 C468 678,471.1 681.3,474.2 684.5 C477.3 687.8,480.3 691.1,483.5 694.3 C486.6 697.5,489.8 700.7,492.9 703.8 C496.2 707,499.5 710.1,502.7 713.1 C506 716.1,509.4 719.1,512.7 722.1 C516.1 725.1,519.5 727.9,523 730.7 C526.5 733.5,530 736.4,533.6 739.1 C537.1 741.8,540.8 744.4,544.5 747 C548.2 749.5,551.9 752,555.7 754.4 C559.5 756.8,563.4 759.1,567.2 761.3 C571.1 763.4,575.2 765.5,579.2 767.4 C583.2 769.4,587.4 771.2,591.5 772.9 C595.6 774.7,599.8 776.3,604 777.7 C608.2 779.3,612.4 780.7,616.8 782 C621.1 783.3,625.4 784.5,629.7 785.5 C634.2 786.5,638.5 787.4,642.9 788.1 C647.3 788.9,651.8 789.4,656.3 789.5 C660.8 789.8,665.3 789.8,669.8 789.7 C674.2 789.6,678.7 789.4,683.2 789.1 C687.7 788.6,692.1 788,696.5 787 C700.8 786.1,705.2 785,709.4 783.4 C713.6 781.9,717.8 780.1,721.6 777.7 C725.3 775.4,729.2 772.6,732 769.3 C734.7 765.9,737.1 761.7,738.4 757.6 C739.5 753.4,739.5 748.6,739.1 744.2 C738.6 739.9,737.3 735.3,735.5 731.3 C733.6 727.4,730.1 723.3,727.6 720.5 C725.1 717.6,721.7 715.4,720.5 714.3\"/><path stroke-width=\"10\" d=\"M609.6 616.9 C610.1 616.2,612 614.1,612.4 612.5 C612.8 610.8,612.7 608.7,612 607.2 C611.4 605.7,609.9 604.3,608.6 603.3 C607.3 602.2,605.4 601.5,603.8 600.9 C602.1 600.3,600.3 600,598.6 599.7 C596.8 599.4,595 599.3,593.2 599.2 C591.5 599.2,589.7 599.3,587.8 599.4 C586.1 599.5,584.3 599.7,582.6 600 C580.8 600.3,579 600.6,577.3 601 C575.6 601.5,573.9 601.9,572.2 602.4 C570.4 603,568.7 603.6,567.1 604.1 C565.5 604.8,563.8 605.5,562.2 606.3 C560.6 607.1,559.1 608,557.5 609 C556.1 610,554.7 611.1,553.3 612.4 C552.1 613.6,550.9 614.9,550.1 616.5 C549.2 618,548.4 619.8,548.3 621.5 C548.1 623.3,548.4 625.3,549.1 626.7 C549.9 628.2,551.2 629.7,552.8 630.5 C554.2 631.4,556.1 631.7,557.8 632 C559.5 632.3,562.4 631.7,563.2 632.3 C563.9 633,563.6 634.9,562.6 635.9 C561.6 636.8,559.3 637.2,557.6 638 C556 638.7,554.4 639.5,552.8 640.3 C551.2 641.1,549.7 642,548.2 642.9 C546.6 643.7,545.1 644.7,543.6 645.7 C542.1 646.7,540.6 647.7,539.3 648.8 C537.8 649.9,536.5 651.1,535.2 652.2 C533.8 653.5,532.6 654.7,531.3 656.1 C530.2 657.4,529 658.8,528.1 660.3 C527.1 661.7,526.2 663.3,525.4 664.9 C524.6 666.5,524 668.2,523.5 669.9 C523.1 671.6,522.9 673.5,522.9 675.2 C523 677,523.3 678.8,523.8 680.5 C524.3 682.2,525 683.9,526 685.3 C527 686.8,528.5 688,529.8 689 C531.2 690.1,533 690.9,534.6 691.5 C536.2 692.2,537.9 692.6,539.7 693 C541.5 693.3,543.3 693.4,545 693.6 C546.8 693.7,548.6 693.6,550.4 693.6 C552.2 693.6,554 693.5,555.7 693.4 C557.5 693.2,559.3 693,561.1 692.7 C562.8 692.4,564.5 692.1,566.3 691.7 C568.1 691.3,569.8 690.9,571.5 690.4 C573.2 689.9,574.9 689.3,576.6 688.8 C578.3 688.1,579.9 687.5,581.5 686.8 C583.3 686.1,584.9 685.3,586.4 684.6 C588 683.7,589.6 682.8,591.1 681.9 C592.6 680.9,594.1 680,595.5 678.8 C596.9 677.8,598.3 676.6,599.5 675.3 C600.7 674,601.8 672.6,602.8 671.1 C603.7 669.6,604.6 668,605.3 666.3 C605.8 664.7,606.3 662.8,606.5 661.1 C606.7 659.4,606.5 657.6,606.3 655.8 C606.1 654,606 652,605.3 650.5 C604.7 649,603.8 647.3,602.5 646.7 C601 646.2,598.9 647.2,597.1 647.5 C595.4 647.7,593.7 648.1,591.9 648.4 C590.1 648.8,588.4 649.1,586.6 649.5 C584.9 649.8,583.2 650.1,581.4 650.6 C579.7 651,577.9 651.5,576.3 652 C574.6 652.7,572.9 653.4,571.4 654.3 C570 655.3,568.4 656.4,567.4 657.8 C566.2 659.1,565.5 660.8,564.8 662.5 C564.1 664.1,563.8 666.1,563.7 667.6 C563.5 669.3,563.8 671.2,563.8 671.8\"/><path stroke-width=\"10\" d=\"M582.5 630 C581.6 630,579 630.4,577.2 630.8 C575.5 631.1,573.8 631.7,572.1 632.1 C570.3 632.4,568 632.9,566.8 633.1 C565.7 633.4,565.6 633.4,565.3 633.4\"/><path stroke-width=\"10\" d=\"M616.5 630.3 C617.1 631,619.5 632.9,619.8 634.4 C620.1 635.9,619.3 637.9,618.4 639.2 C617.4 640.6,615.6 641.5,614 642.4 C612.5 643.2,610.8 643.8,609.1 644.4 C607.5 645.1,604.9 645.9,604.1 646.2\"/><path stroke-width=\"11\" d=\"M680.3 485 C678.2 484.6,671.9 483.5,667.7 482.9 C663.5 482.2,659.1 481.6,654.9 481.3 C650.6 480.9,646.3 480.5,642 480.4 C637.8 480.2,633.5 480.3,629.1 480.5 C624.8 480.7,620.6 481.1,616.3 481.6 C612.1 482.1,607.9 482.8,603.6 483.7 C599.4 484.4,595.2 485.4,591.1 486.5 C586.9 487.7,582.7 488.9,578.7 490.4 C574.7 491.8,570.7 493.4,566.8 495.3 C563.1 497.3,559.3 499.4,555.8 502 C552.4 504.5,548.9 507.3,546.5 510.8 C544.1 514.2,541.6 518.5,541.4 522.5 C541.3 526.3,543.1 531.2,545.7 534.1 C548.3 537,553.1 538.4,557.1 539.6 C561.3 540.8,565.7 541,570 541.2 C574.2 541.5,578.5 541.3,582.8 541.1 C587.1 540.9,591.4 540.5,595.7 540 C599.9 539.5,604.2 539,608.4 538.2 C612.6 537.5,616.9 536.7,621.1 535.8 C625.3 534.9,629.4 534,633.6 532.9 C637.8 532,642 530.9,646.1 529.8 C650.3 528.7,654.4 527.6,658.6 526.4 C662.7 525.3,666.8 524.1,670.9 523 C675.2 521.8,679.3 520.7,683.4 519.5 C687.5 518.4,691.7 517.4,695.9 516.3 C700.1 515.3,704.2 514.3,708.4 513.3 C712.5 512.2,716.7 511.1,720.9 510 C725 508.9,729.1 507.7,733.3 506.7 C737.5 505.6,741.6 504.5,745.8 503.7 C750 502.8,754.2 502.2,758.5 501.5 C762.8 500.8,767 500.3,771.3 499.9 C775.6 499.5,779.8 499,784.1 498.7 C788.4 498.4,792.7 498.1,797 498.1 C801.3 498.1,805.6 498.2,809.8 498.6 C814.1 498.9,818.5 499.5,822.6 500.3 C826.8 501.1,831 502.2,835.1 503.5 C839.2 504.7,843.2 506.3,847.1 508.1 C851 509.9,854.8 512,858.3 514.4 C861.8 516.9,865.2 519.7,868 522.9 C870.8 526.1,873.3 529.8,874.9 533.7 C876.7 537.5,877.6 543.9,878.1 546.1 C878.7 548.4,878.2 546.9,878.2 547.1\"/><path stroke-width=\"11\" d=\"M755.9 484 C753.9 485.1,748 487.8,744.8 490.5 C741.7 493.2,739.9 497.6,736.9 500.6 C733.9 503.7,730.1 505.9,727 508.9 C724 511.9,721 515,718.8 518.6 C716.6 522.2,715.7 526.7,713.8 530.5 C711.9 534.4,709.5 537.9,707.3 541.6 C705.1 545.3,702.9 549,700.7 552.7 C698.5 556.4,696.5 560.1,694.4 564 C692.3 567.7,690.3 571.5,688.3 575.3 C686.3 579,684.2 582.9,682.2 586.6 C680.2 590.4,678.3 594.3,676.4 598.1 C674.5 601.9,672.7 605.9,670.7 609.7 C668.9 613.6,667.1 617.5,665.3 621.4 C663.6 625.3,661.7 629.2,660 633.2 C658.4 637.1,656.6 641.1,655.1 645.1 C653.5 649,651.9 653,650.4 657.1 C648.9 661.1,647.4 665.1,646.1 669.2 C644.8 673.3,643.5 677.4,642.4 681.5 C641.2 685.6,640.2 689.8,639.2 694 C638.2 698.2,637.5 702.4,636.8 706.6 C636.2 710.9,635.6 715.2,635.5 719.5 C635.5 723.8,635.4 728.3,636.4 732.3 C637.4 736.3,638.8 741.4,641.8 743.8 C644.7 746.1,649.8 746.8,653.8 746.3 C657.7 745.7,662.5 742.3,665.3 740.7 C668 738.9,669.4 736.9,670.3 736.2\"/></g></svg>";

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
      chalkDiv('church', '766/770', { cls: 'rt-church', color: 'rgba(247,243,233,0.92)', extra: ' aria-hidden="true" data-chalk-mode="manual"' }) +
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

// Section 3. On wide screens the chapters slide in from the right while the
// section is pinned (initEvents); otherwise they stack.
function eventsMarkup() {
  return '<section class="rt-events" id="rt-events" aria-labelledby="rt-events-title">' +
    borderMarkup('#rt-events') +
    '<div class="rt-events__inner">' +
      '<h2 class="rt-heading" id="rt-events-title" data-reveal="lines">Order of events</h2>' +
      '<div class="rt-events__track">' + EVENTS.map(function (e, i) {
        return '<article class="rt-chapter" aria-labelledby="rt-chapter-' + i + '">' +
          '<div class="rt-chapter__art" aria-hidden="true">' +
            chalkDiv(e.art.name, e.art.w + '/' + e.art.h, { extra: ' data-chalk-mode="manual"' }) +
          '</div>' +
          '<h3 class="rt-chapter__heading" id="rt-chapter-' + i + '">' +
            '<span class="rt-chapter__part">' + e.part + '<span class="rt-sr">: </span></span>' +
            '<span class="rt-chapter__title">' + e.title + '</span>' +
          '</h3>' +
          '<p class="rt-chapter__when"><span>' + e.date + '<span class="rt-sr">, </span></span><span>' + e.time + '</span></p>' +
          '<p class="rt-chapter__text">' + e.text + '</p>' +
        '</article>';
      }).join('') + '</div>' +
    '</div>' +
  '</section>';
}

// Section 4: an accordion of the finer details (behaviour in initFaq).
// Works without any animation library; panels are closed by default.
function faqMarkup() {
  return '<section class="rt-faq-sec" id="rt-faq" aria-labelledby="rt-faq-title">' +
    borderMarkup('#rt-faq') +
    '<div class="rt-faq">' +
      '<h2 class="rt-heading" id="rt-faq-title" data-reveal="lines">The details</h2>' +
      '<div class="rt-faq__list">' + FAQ.map(function (item, i) {
        return '<div class="rt-faq__item">' +
          '<h3 class="rt-faq__q">' +
            '<button type="button" class="rt-faq__btn" id="rt-faq-btn-' + i + '" aria-expanded="false" aria-controls="rt-faq-panel-' + i + '">' +
              '<span class="rt-faq__label">' + item.q.replace(/&/g, '&amp;') + '</span>' +
              '<span class="rt-faq__icon" aria-hidden="true"></span>' +
            '</button>' +
          '</h3>' +
          '<div class="rt-faq__panel" id="rt-faq-panel-' + i + '" role="region" aria-labelledby="rt-faq-btn-' + i + '" inert>' +
            '<div class="rt-faq__clip"><div class="rt-faq__body">' +
              item.a.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
            '</div></div>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>' +
      // Both answers end "please don't hesitate to reach out": give them the way
      '<p class="rt-faq__contact">Questions? <a href="mailto:hello@rebeccaandthomas.net">hello@rebeccaandthomas.net</a></p>' +
    '</div>' +
  '</section>';
}

// The wax seal pressed onto the RSVP card once a reply is sent. Drawn in SVG:
// an uneven pool of wax, a pressed ring and the couple's initials.
var SEAL_SVG = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
  '<defs>' +
    '<radialGradient id="rtWax" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#9a2a26"/><stop offset="0.55" stop-color="#761d1d"/><stop offset="1" stop-color="#4f1111"/></radialGradient>' +
    '<filter id="rtEmboss" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1" stdDeviation="0.4" flood-color="#c45a52" flood-opacity="0.7"/></filter>' +
  '</defs>' +
  '<path fill="url(#rtWax)" d="M61 4c9 1 13 7 21 9s15 2 20 9 2 14 5 21 9 11 8 19-8 11-10 19-1 15-8 20-14 2-21 5-10 9-18 9-11-6-19-8-15-1-20-8-2-14-5-21-9-11-8-19 8-11 10-19 1-15 8-20 14-2 21-5 9-11 16-11z"/>' +
  '<circle cx="60" cy="60" r="38" fill="none" stroke="#4f1111" stroke-width="2" opacity="0.55"/>' +
  '<circle cx="60" cy="60" r="35" fill="none" stroke="#a63a33" stroke-width="0.8" opacity="0.6"/>' +
  '<text x="60" y="70" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-size="30" fill="#5a1414" filter="url(#rtEmboss)">R&amp;T</text>' +
'</svg>';

// Section 5. Same form, field names and behaviour as the save-the-date.
function rsvpMarkup() {
  return '<section class="rt-rsvp" id="rt-rsvp" aria-labelledby="rt-rsvp-title">' +
    borderMarkup('#rt-rsvp') +
    '<div class="rt-rsvp__card">' +
      '<h2 class="rt-heading" id="rt-rsvp-title" data-reveal="lines">Please RSVP</h2>' +
      '<p class="rt-rsvp__by">Kindly respond by 17th December 2026</p>' +
      '<form class="rsvpForm" method="post" action="preview">' +
        '<div class="formGuts">' +
          '<input type="hidden" name="id" id="guestId" value="">' +
          '<input type="hidden" name="project_token" value="PATZ57Y8">' +
          '<fieldset class="rt-rsvp__choice">' +
            '<legend class="rt-sr">Will you attend?</legend>' +
            '<input type="radio" name="rsvp_status" id="attendYes" class="attend yes" value="1">' +
            '<label for="attendYes" class="button">Will Attend</label>' +
            '<input type="radio" name="rsvp_status" id="attendNo" class="attend no" value="0">' +
            '<label for="attendNo" class="button">Will Not Attend</label>' +
          '</fieldset>' +
          '<div class="addTotal">' +
            '<div class="rsvpTotalBox">' +
              '<h4 class="errorMessage"><label for="rsvpTotal">Total attending</label></h4>' +
              '<select name="rsvp_total" class="rsvpTotal" id="rsvpTotal">' +
                '<option value="1">1</option><option value="2" selected="">2</option><option value="3">3</option>' +
              '</select>' +
            '</div>' +
            '<label class="rt-rsvp__note-label" for="noteToHost">A private note to us (optional)</label>' +
            '<textarea name="note_to_host" id="noteToHost" placeholder="Leave a private message..." rows="2"></textarea>' +
          '</div>' +
        '</div>' +
        '<button type="submit" class="button fill">Submit</button>' +
      '</form>' +
      '<div class="rt-seal" aria-hidden="true">' + SEAL_SVG + '</div>' +
      '<p class="rt-sr" role="status" id="rsvpStatus"></p>' +
    '</div>' +
  '</section>';
}

// Section 6. The comment form and the wall it feeds (read from the sheet).
function notesMarkup() {
  return '<section class="rt-notes" id="rt-notes" aria-labelledby="rt-notes-title">' +
    borderMarkup('#rt-notes') +
    '<div class="comment">' +
      '<form class="commentForm">' +
        '<h2 class="rt-heading" id="rt-notes-title" data-reveal="lines">Leave us a note</h2>' +
        '<input type="hidden" name="id" value="">' +
        '<input type="hidden" name="project_token" value="PATZ57Y8">' +
        '<input type="hidden" id="commentGuestName" name="guest_name" value="">' +
        '<label class="rt-notes__label" for="rsvpComment">Your note will appear on the wall below</label>' +
        '<textarea rows="3" name="rsvp_comment" class="rsvpComment" id="rsvpComment"></textarea>' +
        '<button class="button">Post</button>' +
      '</form>' +
    '</div>' +
    '<div class="commentsWrapper">' +
      '<div class="comments" style="display:none;"><div class="list"></div></div>' +
    '</div>' +
  '</section>';
}

// Section 7: a tabbed guide (behaviour in initGuide). Content from GUIDE.
function guideMarkup() {
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var tabs = GUIDE.tabs.map(function (t, i) {
    return '<button type="button" role="tab" class="rt-tabs__tab" id="rt-tab-' + t.id + '"' +
      ' aria-selected="' + (i === 0) + '" aria-controls="rt-tabpanel-' + t.id + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
      esc(t.label) + '</button>';
  }).join('');
  var panels = GUIDE.tabs.map(function (t, i) {
    var body = '';
    if (t.places) {
      body = '<ul class="rt-guide__list">' + t.places.map(function (pl, k) {
        return '<li class="rt-guide__place" style="--i:' + k + '">' +
          '<div class="rt-guide__place-head">' +
            '<h3 class="rt-guide__place-name">' + esc(pl.name) + '</h3>' +
            '<p class="rt-guide__place-area">' + esc(pl.area) + '</p>' +
          '</div>' +
          '<div class="rt-guide__place-body">' +
            '<p class="rt-guide__place-text">' + esc(pl.text) + '</p>' +
            (pl.map ? '<a class="rt-guide__map" href="https://www.google.com/maps/search/?api=1&amp;query=' + encodeURIComponent(pl.map) + '" target="_blank" rel="noopener">View on Google Maps<span class="rt-sr">: ' + esc(pl.name) + ' (opens in a new tab)</span></a>' : '') +
          '</div>' +
        '</li>';
      }).join('') + '</ul>';
    } else {
      var m = /open\.spotify\.com\/(playlist|album)\/([A-Za-z0-9]+)/.exec(t.spotify || '');
      body = m
        ? '<iframe class="rt-guide__spotify-frame" title="Our playlist on Spotify" loading="lazy" src="https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'
        : '<p class="rt-guide__placeholder">[Placeholder] Our Spotify playlist is coming soon.</p>';
    }
    var art = (t.art || []).map(function (a) {
      return '<div class="rt-guide__art-item" style="--w:' + a.w + '">' +
        chalkDiv(a.name, a.w + '/' + a.h, { extra: ' data-chalk-mode="manual"' }) + '</div>';
    }).join('');
    return '<div class="rt-tabs__panel" role="tabpanel" id="rt-tabpanel-' + t.id + '" aria-labelledby="rt-tab-' + t.id + '" tabindex="0"' + (i === 0 ? '' : ' hidden') + '>' +
      (art ? '<div class="rt-guide__art" aria-hidden="true">' + art + '</div>' : '') +
      body +
    '</div>';
  }).join('');
  return '<section class="rt-guide" id="rt-guide" aria-labelledby="rt-guide-title">' +
    borderMarkup('#rt-guide') +
    '<div class="rt-guide__inner">' +
      '<h2 class="rt-heading" id="rt-guide-title" data-reveal="lines">A little guide to Malta</h2>' +
      '<p class="rt-guide__intro" data-reveal="lines">' + esc(GUIDE.intro) + '</p>' +
      '<div class="rt-tabs">' +
        '<div class="rt-tabs__list" role="tablist" aria-label="A little guide to Malta">' + tabs +
          '<span class="rt-tabs__ink" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="rt-tabs__sheet">' + panels + '</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}

// Section 8. The save-the-date footer (names and countdown), with the
// monogram drawn in as a sign-off.
function footerMarkup() {
  return '<footer class="rt-footer">' +
    '<div class="rt-footer__mark">' +
      chalkDiv('monogram', '1066/1061', { color: 'rgba(247,243,233,0.92)', extra: ' data-chalk-mode="manual" aria-hidden="true"' }) +
    '</div>' +
    '<div class="rt-footer__bar">' +
      '<div class="footer-names">Rebecca Bonavia &amp; Thomas Bowers</div>' +
      '<div class="footer-countdown">The countdown is on! <span id="weddingCountdown">...</span> seconds until our big day.</div>' +
    '</div>' +
  '</footer>';
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
      cls = ' rt-border__item--phone';
      style += ';--ppeek:' + (ph.peek || 60) + ';--prot:' + (ph.rot != null ? ph.rot : (it.rot || 0)) + 'deg' +
        ';--ptop:' + (ph.top != null ? ph.top : it.top) + '%';
    }
    return '<div class="rt-border__item rt-border__item--' + it.side + cls + '" style="' + style + '">' +
      chalkDiv(it.name, it.w + '/' + it.h, { extra: ' data-chalk-mode="manual"' + (it.name.indexOf('swirl') === 0 ? ' data-swirl' : '') }) +
    '</div>';
  }).join('') + '</div>';
}

// Navigation: a folded note in the left border (desktop) or a small round
// button top-right (phones) that opens a list of the sections.
var NAV = [
  { href: '#rt-invitation', label: 'The invitation' },
  { href: '#rt-events', label: 'Order of events' },
  { href: '#rt-faq', label: 'The details' },
  { href: '#rt-rsvp', label: 'RSVP' },
  { href: '#rt-notes', label: 'Notes' },
  { href: '#rt-guide', label: 'A little guide to Malta' }
];
function navMarkup() {
  return '<nav class="rt-nav" aria-label="Sections">' +
    '<div class="rt-nav__card">' +
      '<button type="button" class="rt-nav__toggle" aria-expanded="false" aria-controls="rt-nav-panel">' +
        '<span class="rt-nav__kicker" aria-hidden="true">Contents</span>' +
        '<span class="rt-nav__title">The weekend</span>' +
        '<span class="rt-nav__icon" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="rt-sr">: open the list of sections</span>' +
      '</button>' +
      '<div class="rt-nav__panel" id="rt-nav-panel" inert>' +
        '<div class="rt-nav__clip">' +
          '<ol class="rt-nav__list">' + NAV.map(function (n) {
            return '<li><a class="rt-nav__link" href="' + n.href + '">' + n.label + '</a></li>';
          }).join('') + '</ol>' +
          '<div class="rt-nav__extra"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</nav>';
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
    '<div class="rt-cloth" aria-hidden="true"></div>' +
    '<main class="rt-main">' +
      '<div class="rt-opening">' + heroMarkup() + invitationMarkup() + '</div>' +
      eventsMarkup() +
      faqMarkup() +
      rsvpMarkup() +
      notesMarkup() +
      guideMarkup() +
    '</main>' +
    footerMarkup() +
    navMarkup() +
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
  // Let the first drawings get going before the card arrives, unless the guest
  // is already scrolling past it: then it comes straight away, more quickly.
  var card = document.querySelector('.rt-card');
  var late = card && card.getBoundingClientRect().top < window.innerHeight * 0.3;
  setTimeout(function () {
    window.gsap.to(card, { opacity: 1, y: 0, duration: late ? 0.6 : 1.4, ease: 'power3.out' });
    setTimeout(resolveCard, late ? 100 : 350);
  }, late ? 0 : 1300);
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
      onRefresh: function () { if (scrub) scrub.resize(); },
      // Once the guest has scrolled on past the opening, it is done: the film
      // shouldn't play back over the invitation when they scroll up again.
      // (The scrub lags the scroll slightly, so the stage may not have opened yet.)
      onLeave: function (self) { openStage(true); collapseStage(self, tl, hero, ScrollTrigger); }
    }
  });
  if (scrub) {
    tl.to(state, { p: 1, duration: HERO.viewports, ease: 'none', onUpdate: function () { scrub.set(state.p); } });
  } else {
    // Stand-in for a frame sequence: a slow, scroll-driven drift over the still
    tl.fromTo(hero.querySelector('.rt-hero__still'), { scale: 1.02 }, { scale: 1.1, duration: HERO.viewports, ease: 'none' });
  }
  stageControl = function () { openStage(true); collapseStage(tl.scrollTrigger, tl, hero, ScrollTrigger); };
  tl.to(hero, { opacity: 0, duration: 0.6, ease: 'none' })
    .call(function () { openStage(true); })
    .to({}, { duration: 0.4 });
}

// Removes the opening's pinned scroll distance and the film, keeping the page
// exactly where it is on screen.
var stageControl = null;   // set by initStage; lets navigation collapse it first
function collapseStage(st, tl, hero, ScrollTrigger) {
  stageControl = null;
  var distance = st.end - st.start;
  var y = window.pageYOffset;
  st.kill();
  tl.kill();
  hero.style.display = 'none';
  html.classList.add('rt-stage-done');
  window.scrollTo(0, Math.max(0, y - distance));
  ScrollTrigger.refresh();
}

// Border drawings wait until the film has gone, then each draws once it is
// entirely on screen (tall flourishes: once their top is near the top of the
// screen). Several arriving together draw one after another.
function watchDrawings(chalkReady, selector) {
  var items = [].slice.call(document.querySelectorAll(selector)).filter(function (el) {
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
//  EVENTS: chapter cards slide in from the right while the section is pinned
// ─────────────────────────────────────────────────────────────────

var CHALK_READY = Promise.resolve();
function drawArt(card, delay) {
  var el = card.querySelector('.rt-chapter__art .chalk');
  if (!el) return;
  setTimeout(function () {
    CHALK_READY.then(function () { window.ChalkDraw.play(el, 2000); });
  }, delay || 0);
}

// The chapters slide in sideways on wide landscape screens and on phones
// tall enough to hold a card; otherwise they stack.
function eventsHorizontal() {
  if (IS_PORTRAIT) return window.innerHeight >= 640;
  return window.innerWidth >= 1024 && window.innerHeight >= 720;
}

function initEvents(gsap, ScrollTrigger) {
  var section = document.getElementById('rt-events');
  if (!section) return;
  var cards = [].slice.call(section.querySelectorAll('.rt-chapter'));
  if (REDUCED) return;   // static stack; chalk-draw shows the drawings complete

  if (!eventsHorizontal()) {
    // Stacked: each card rises into place, then its drawing is inked
    cards.forEach(function (card) {
      var rise = gsap.from(card, { y: 36, opacity: 0, duration: 1.1, ease: 'power3.out', paused: true });
      onEnter(ScrollTrigger, card, 'top 82%', function () { rise.play(); drawArt(card, 350); });
    });
    return;
  }

  section.classList.add('rt-events--h');
  var track = section.querySelector('.rt-events__track');
  function travel() { return Math.max(0, track.scrollWidth - window.innerWidth); }
  var pan = gsap.to(track, {
    x: function () { return -travel(); },
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: function () { return '+=' + travel(); },
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true
    }
  });
  cards.forEach(function (card) {
    // Each card is slid across the table: a slight turn that settles as it lands
    gsap.fromTo(card, { rotation: 3.5, y: 18 }, {
      rotation: 0, y: 0, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: pan, start: 'left right', end: 'left 55%', scrub: true }
    });
    ScrollTrigger.create({
      trigger: card, containerAnimation: pan, start: 'left 70%', once: true,
      onEnter: function () { cardShown.then(function () { drawArt(card, 150); }); }
    });
  });
}

// ─────────────────────────────────────────────────────────────────
//  DETAILS: accordion. Plain buttons with aria-expanded; Enter and Space
//  work natively. Several panels can be open at once. The unfold itself is
//  a CSS transition (invite.css), so it needs no library.
// ─────────────────────────────────────────────────────────────────

function initFaq() {
  var buttons = [].slice.call(document.querySelectorAll('.rt-faq__btn'));
  buttons.forEach(function (btn, i) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
      // Closed panels are inert: out of the tab order and the accessibility tree
      if (open) panel.removeAttribute('inert');
      else panel.setAttribute('inert', '');
    });
    // The page below has moved: recompute scroll-driven positions
    panel.addEventListener('transitionend', function (e) {
      if (e.target === panel && e.propertyName === 'grid-template-rows' && window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    // Arrow keys, Home and End move between the questions
    btn.addEventListener('keydown', function (e) {
      var to = null;
      if (e.key === 'ArrowDown') to = buttons[(i + 1) % buttons.length];
      else if (e.key === 'ArrowUp') to = buttons[(i - 1 + buttons.length) % buttons.length];
      else if (e.key === 'Home') to = buttons[0];
      else if (e.key === 'End') to = buttons[buttons.length - 1];
      if (to) { e.preventDefault(); to.focus(); }
    });
  });
}

// ─────────────────────────────────────────────────────────────────
//  GUIDE TABS: automatic activation; Arrow Left/Right, Home and End move
//  between tabs. The new page settles in and a drawn underline slides to
//  the chosen tab. Works without GSAP.
// ─────────────────────────────────────────────────────────────────

function initGuide() {
  var list = document.querySelector('.rt-tabs__list');
  if (!list) return;
  var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
  var ink = list.querySelector('.rt-tabs__ink');
  var drawn = {};

  function moveInk(tab) {
    if (!ink) return;
    ink.style.transform = 'translateX(' + tab.offsetLeft + 'px) scaleX(' + tab.offsetWidth / 100 + ')';
  }
  function drawArt(panel) {
    if (drawn[panel.id]) return;
    drawn[panel.id] = true;
    [].slice.call(panel.querySelectorAll('.rt-guide__art .chalk')).forEach(function (el, k) {
      setTimeout(function () {
        CHALK_READY.then(function () { window.ChalkDraw.play(el, 1600); });
      }, 250 + k * 280);
    });
  }
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (on) {
        panel.hidden = false;
        // restart the settle-in for the newly shown page
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
        drawArt(panel);
      } else {
        panel.hidden = true;
      }
    });
    moveInk(tab);
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var to = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') to = tabs[0];
      else if (e.key === 'End') to = tabs[tabs.length - 1];
      if (to) { e.preventDefault(); select(to, true); }
    });
  });
  function current() { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]; }
  moveInk(current());
  window.addEventListener('resize', function () { moveInk(current()); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(current()); });
}

// ─────────────────────────────────────────────────────────────────
//  MUSIC: a quiet loop, off until a guest turns it on (browsers block
//  sound before a tap anyway). Fades in and out, pauses while the tab is
//  hidden, and nothing downloads until it's first switched on. The choice
//  is remembered for the visit and resumes on the next tap after a reload.
// ─────────────────────────────────────────────────────────────────

var MUSIC_KEY = 'rtMusicOn';
function initMusic() {
  var slot = document.querySelector('.rt-nav__extra');
  if (!MUSIC.src || !slot) return;
  slot.innerHTML = '<button type="button" class="rt-music" aria-pressed="false">' +
    '<span class="rt-music__bars" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<span class="rt-music__label">Music</span></button>';
  var btn = slot.querySelector('.rt-music');
  var audio = null, on = false, fadeTimer = null;

  function fade(to, ms, done) {
    clearInterval(fadeTimer);
    var from = audio.volume, start = performance.now();
    fadeTimer = setInterval(function () {
      var t = Math.min(1, (performance.now() - start) / ms);
      audio.volume = from + (to - from) * t;
      if (t >= 1) { clearInterval(fadeTimer); if (done) done(); }
    }, 40);
  }
  function play() {
    if (!audio) {
      audio = new Audio(v(BASE + MUSIC.src));
      audio.loop = true;
      audio.preload = 'auto';
    }
    audio.volume = 0;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setState(false); });
    fade(MUSIC.volume, 2500);
  }
  function pause() {
    if (!audio) return;
    fade(0, 800, function () { audio.pause(); });
  }
  function setState(next) {
    on = next;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('is-on', on);
    try { window.sessionStorage.setItem(MUSIC_KEY, on ? '1' : '0'); } catch (e) {}
  }
  btn.addEventListener('click', function () {
    if (on) { setState(false); pause(); } else { setState(true); play(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (!audio || !on) return;
    if (document.hidden) audio.pause();
    else play();
  });
  // Turned on earlier in this visit: resume on the guest's next tap
  var wasOn = false;
  try { wasOn = window.sessionStorage.getItem(MUSIC_KEY) === '1'; } catch (e) {}
  if (wasOn) {
    var resume = function (e) {
      if (btn.contains(e.target)) return;
      window.removeEventListener('pointerdown', resume);
      setState(true); play();
    };
    window.addEventListener('pointerdown', resume);
  }
}

// ─────────────────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────────────────

function initNav() {
  var nav = document.querySelector('.rt-nav');
  if (!nav) return;
  var toggle = nav.querySelector('.rt-nav__toggle');
  var panel = nav.querySelector('.rt-nav__panel');
  var links = [].slice.call(nav.querySelectorAll('.rt-nav__link'));

  // The note belongs to the paper, so it arrives once the film has gone
  stageOpen.then(function () { nav.classList.add('is-visible'); });

  function setOpen(open, focusBack) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
    if (open) { panel.removeAttribute('inert'); }
    else {
      panel.setAttribute('inert', '');
      if (focusBack) toggle.focus();
    }
  }
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      setOpen(false);
      // Jumping past the opening: retire the film first so positions are final
      if (stageControl) stageControl();
      var y = target.getBoundingClientRect().top + window.pageYOffset - 8;
      window.scrollTo({ top: Math.max(0, y), behavior: REDUCED ? 'auto' : 'smooth' });
      // Move focus to the section (for keyboard and screen-reader users)
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      setTimeout(function () { target.focus({ preventScroll: true }); }, REDUCED ? 0 : 700);
    });
  });

  // Mark the section currently in view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(function (n) { var el = document.querySelector(n.href); if (el) io.observe(el); });
  }
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

  // The questions fade up one after another
  var faq = document.querySelector('.rt-faq__list');
  if (faq) {
    var rows = gsap.from(faq.children, { y: 16, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, paused: true });
    onEnter(ScrollTrigger, faq, 'top 85%', function () { rows.play(); });
  }

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
//  RSVP + comments: copied from site/main.js ($(document).ready block).
//  Changes from the original: on a successful RSVP the wax seal is
//  pressed onto the card before the (unchanged) confirmation, which is
//  also announced to screen readers; a reply already sending or sent
//  can't be submitted again (Enter on the focused button used to send a
//  second row); jQuery's slide animations are off with reduced motion.
// ─────────────────────────────────────────────────────────────────

// Presses the seal onto the RSVP card, then calls done. The confirmation
// never depends on this: done also runs on a timer if animation fails.
function playSeal(done) {
  var seal = document.querySelector('.rt-seal');
  var card = document.querySelector('.rt-rsvp__card');
  var called = false;
  function finish() { if (!called) { called = true; done(); } }
  setTimeout(finish, 700);
  if (!seal) return;
  seal.classList.add('is-on');
  if (!seal.animate) return;
  try {
    if (REDUCED) {
      seal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'both' });
    } else {
      // Pressed down from above: lands with a little weight, the card gives slightly
      seal.animate([
        { opacity: 0, transform: 'scale(1.35) rotate(-14deg)' },
        { opacity: 1, transform: 'scale(1) rotate(-8deg)' }
      ], { duration: 380, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' });
      if (card) card.animate([
        { transform: 'translateY(0)' }, { transform: 'translateY(0)', offset: 0.6 },
        { transform: 'translateY(3px)', offset: 0.75 }, { transform: 'translateY(0)' }
      ], { duration: 520, easing: 'ease-out' });
    }
  } catch (e) { /* the confirmation still runs */ }
}

function initForms() {
  if (REDUCED) $.fx.off = true;

  // ── RSVP form: show/hide guest count ──
  $('.rsvpForm .attend').on('change', function() {
    if ($(this).hasClass('no')) {
      $('.rsvpForm .rsvpTotalBox').slideUp(400);
    } else {
      $('.rsvpForm .rsvpTotalBox').slideDown(400);
    }
    $('.rsvpForm .addTotal').slideDown(400);
    $('.rsvpForm .button[type="submit"]').slideDown(400);
  });

  // ── RSVP form: submit to Google Sheets ──
  $('.rsvpForm').submit(function(e) {
    e.preventDefault();
    var $form = $(this);
    var $btn  = $form.find('.button[type="submit"]');
    if ($btn.hasClass('disabled') || $btn.hasClass('success')) return;

    var attending = $form.find('input[name="rsvp_status"]:checked').val();
    if (!attending) {
      alert('Please select Will Attend or Will Not Attend.');
      return;
    }

    $btn.addClass('disabled').text('Submitting…');

    var payload = {
      type:       'rsvp',
      name:       guestName || 'Guest',
      attending:  attending === '1' ? 'Yes' : 'No',
      total:      $form.find('select[name="rsvp_total"]').val() || '1',
      note:       $form.find('textarea[name="note_to_host"]').val() || '',
      timestamp:  new Date().toISOString()
    };

    // Apps Script requires form-encoded data (not JSON) when called from a browser.
    // We use no-cors mode because Apps Script doesn't return CORS headers on POST.
    // This is fire-and-forget — we optimistically show success immediately.
    fetch(APPS_SCRIPT_URL, {
      method:   'POST',
      mode:     'no-cors',
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:     'data=' + encodeURIComponent(JSON.stringify(payload))
    }).then(function() {
      playSeal(function() {
        $btn.removeClass('disabled').addClass('success').text('Thanks for letting us know!');
        $('#rsvpStatus').text('Thank you, your RSVP has been sent.');
        $form.find('.formGuts').slideUp(300);
        if (!$form.find('.addCalendarBtn').length) {
          var $calBtn = $('<button type="button" class="button addCalendarBtn">Add to calendar</button>');
          $calBtn.on('click', showCalendarOptions);
          $btn.after($calBtn);
        }
      });
    }).catch(function() {
      $btn.removeClass('disabled').text('Try Again');
      alert('Something went wrong — please try again.');
    });
  });

  // ── Comment form: submit to Google Sheets + display inline ──
  $('.commentForm').submit(function(e) {
    e.preventDefault();
    var $form    = $(this);
    var $btn     = $form.find('.button');
    var $textarea = $form.find('textarea[name="rsvp_comment"]');
    var comment  = $textarea.val().trim();

    if (!comment) {
      alert('Please write a comment before submitting.');
      return;
    }

    $btn.addClass('disabled').text('Submitting…');

    var payload = {
      type:      'comment',
      name:      guestName || 'Guest',
      comment:   comment,
      timestamp: new Date().toISOString()
    };

    fetch(APPS_SCRIPT_URL, {
      method:   'POST',
      mode:     'no-cors',
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:     'data=' + encodeURIComponent(JSON.stringify(payload))
    }).then(function() {
        // Show the comment immediately on the page
        appendComment({ comment: comment, name: guestName, timestamp: payload.timestamp });
        $('.commentsWrapper .comments').slideDown(400);

        $btn.removeClass('disabled').text('Comment Submitted ✓');
        $textarea.val('');

        setTimeout(function() {
          $btn.text('Submit Another');
          $btn.removeClass('disabled');
        }, 3000);
    }).catch(function() {
        $btn.removeClass('disabled').text('Try Again');
        alert('Something went wrong — please try again.');
    });
  });

}

// ─────────────────────────────────────────────────────────────────
//  Notes wall: loadComments, parseCSVComments and parseCSVLine copied
//  verbatim from site/main.js. appendComment now builds a paper card
//  (same fields, same escaping), and cards settle in as they appear.
// ─────────────────────────────────────────────────────────────────
function loadComments() {
  fetch(COMMENTS_CSV_URL)
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function(csv) {
      var comments = parseCSVComments(csv);
      if (comments.length > 0) {
        $('.commentsWrapper .comments .list').empty();
        comments.forEach(function(c) { appendComment(c); });
        $('.commentsWrapper .comments').show();
      }
    })
    .catch(function(err) {
      console.error('[Comments] Failed to load:', err);
    });
}

function parseCSVComments(csv) {
  var lines = csv.trim().split('\n');
  var comments = [];
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var fields = parseCSVLine(line);
    // Support both old format (Timestamp, Comment) and new (Timestamp, Name, Comment)
    var hasName = fields.length >= 3;
    var commentField = hasName ? fields[2] : fields[1];
    var nameField    = hasName ? fields[1] : '';
    if (commentField && commentField.replace(/^"|"$/g, '')) {
      comments.push({
        timestamp: fields[0].replace(/^"|"$/g, ''),
        name:      nameField.replace(/^"|"$/g, '').replace(/""/g, '"'),
        comment:   commentField.replace(/^"|"$/g, '').replace(/""/g, '"')
      });
    }
  }
  return comments.reverse();
}

function parseCSVLine(line) {
  var fields = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current); current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// A stable pseudo-random number (0-1) from a string, so each note keeps
// the same tilt and offset on every visit.
function seeded(str, salt) {
  var h = 2166136261 ^ salt;
  for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 10000) / 10000;
}

var noteObserver = null;
function appendComment(c) {
  var date = c.timestamp ? new Date(c.timestamp).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '';

  var nameStr = (c.name && c.name !== 'Guest') ? $('<div>').text(c.name).html() : '';

  var key = (c.timestamp || '') + (c.comment || '');
  var $card = $('<article class="rt-note">').html(
    '<p class="rt-note__text">' + $('<div>').text(c.comment).html() + '</p>' +
    (nameStr ? '<p class="rt-note__name">' + nameStr + '</p>' : '') +
    (date ? '<p class="rt-note__date">' + date + '</p>' : '')
  ).css({
    '--r': ((seeded(key, 1) * 6) - 3).toFixed(2) + 'deg',
    '--dx': ((seeded(key, 2) * 20) - 10).toFixed(1) + 'px',
    '--dy': ((seeded(key, 3) * 16) - 8).toFixed(1) + 'px',
    '--i': $('.commentsWrapper .comments .list').children().length % 3
  });

  $('.commentsWrapper .comments .list').append($card);

  // Settle in like a card dropped on the table, as each comes into view
  if (noteObserver) {
    $card.addClass('is-waiting');
    noteObserver.observe($card[0]);
  }
}

function initNotesSettle() {
  if (REDUCED || !('IntersectionObserver' in window)) return;
  noteObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      noteObserver.unobserve(e.target);
      e.target.classList.add('is-settling');
      e.target.classList.remove('is-waiting');
    });
  }, { rootMargin: '0px 0px -12% 0px' });
}

// ── Calendar options: the weekend's three events (CAL_EVENTS) ──
// Changed from the save-the-date: three events instead of one. Google,
// Outlook and Yahoo links are per event; the .ics file holds all three.
function showCalendarOptions() {
  var $btn = $(this);
  if ($btn.next('.calendarOptions').length) {
    $btn.next('.calendarOptions').slideToggle(200);
    return;
  }

  function iso(t) { return t.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, '$1-$2-$3T$4:$5:$6Z'); }
  var groups = CAL_EVENTS.map(function (ev) {
    var title = encodeURIComponent(ev.title);
    var desc = encodeURIComponent(ev.desc);
    var loc = encodeURIComponent(ev.location);
    var googleURL = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + title + '&dates=' + ev.start + '/' + ev.end + '&details=' + desc + '&location=' + loc;
    var outlookURL = 'https://outlook.office.com/calendar/action/compose?rru=addevent'
      + '&subject=' + title + '&startdt=' + iso(ev.start) + '&enddt=' + iso(ev.end) + '&body=' + desc + '&location=' + loc;
    var yahooURL = 'https://calendar.yahoo.com/?v=60&title=' + title
      + '&st=' + ev.start + '&et=' + ev.end + '&desc=' + desc + '&in_loc=' + loc;
    return '<div class="calGroup">' +
      '<p class="calGroup__title">' + $('<div>').text(ev.title.split(' | ')[0]).html() + '</p>' +
      '<a class="calOption" href="' + googleURL + '" target="_blank" rel="noopener">Google<span class="rt-sr"> calendar: ' + $('<div>').text(ev.title).html() + '</span></a>' +
      '<a class="calOption" href="' + outlookURL + '" target="_blank" rel="noopener">Outlook<span class="rt-sr"> calendar: ' + $('<div>').text(ev.title).html() + '</span></a>' +
      '<a class="calOption" href="' + yahooURL + '" target="_blank" rel="noopener">Yahoo<span class="rt-sr"> calendar: ' + $('<div>').text(ev.title).html() + '</span></a>' +
    '</div>';
  }).join('');

  // The single .ics file (all three events) first: one tap on an iPhone
  var $options = $('<div class="calendarOptions" style="display:none;">' +
    '<button type="button" class="button icsDownload">Apple / Other: all three events</button>' +
    '<p class="calOptions__or">Or add each event</p>' +
    groups +
    '</div>');

  $options.find('.icsDownload').on('click', function(e) {
    e.preventDefault();
    downloadICS();
  });

  $btn.after($options);
  $options.slideDown(200);
}

function downloadICS() {
  function icsText(t) { return t.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
  var stamp = new Date().toISOString().replace(/[-:.]/g,'').slice(0,15) + 'Z';
  var lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rebecca & Thomas//Wedding Weekend//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  CAL_EVENTS.forEach(function (ev) {
    lines.push(
      'BEGIN:VEVENT',
      'UID:rebeccaandthomas-' + ev.id + '-2027@rebeccaandthomas.net',
      'DTSTAMP:' + stamp,
      'DTSTART:' + ev.start,
      'DTEND:' + ev.end,
      'SUMMARY:' + icsText(ev.title),
      'DESCRIPTION:' + icsText(ev.desc),
      'LOCATION:' + icsText(ev.location),
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  var ics = lines.join('\r\n');
  // Use data URI for better cross-platform support (iOS Safari, Outlook app)
  var dataURI = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  var a = document.createElement('a');
  a.href = dataURI;
  a.download = 'Rebecca_Thomas_Wedding_Weekend_2027.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Wedding countdown: copied verbatim from site/main.js ──
function updateCountdown() {
  var el = document.getElementById('weddingCountdown');
  if (!el) return;
  var weddingDate = new Date('2027-07-10T00:00:00');
  var now = new Date();
  var diff = Math.floor((weddingDate - now) / 1000);
  if (diff > 0) el.textContent = diff.toLocaleString();
}

// ─────────────────────────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────────────────────────

function boot() {
  var mount = document.getElementById('rt-invite');
  if (!mount) { console.error('[invite] #rt-invite not found'); return; }
  render(mount);

  // The site's own copy of chalk-draw.js (it adds the time-driven "manual" draw
  // mode the intro, border and cards rely on); the drawings themselves come
  // from the illustrations/ package.
  var chalkReady = window.ChalkDraw ? Promise.resolve() : loadScript(v(BASE + 'chalk-draw.js'));
  chalkReady.catch(function (err) { console.error('[invite]', err); });
  runIntro(chalkReady);
  initCue();
  CHALK_READY = chalkReady;
  watchDrawings(chalkReady, '.rt-border .chalk');
  initChurch(chalkReady);
  initFaq();
  initNav();
  initMusic();
  initGuide();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  watchDrawings(chalkReady, '.rt-footer__mark .chalk');

  if (window.jQuery) {
    $ = window.jQuery;
    initNotesSettle();
    initForms();
    if (document.readyState === 'complete') loadComments();
    else $(window).on('load', loadComments);
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
    initEvents(gsap, ScrollTrigger);
    initReveals(gsap, ScrollTrigger, window.SplitText);
    // Webfonts and images change layout; recompute trigger positions once settled.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }).catch(function (err) {
    console.error('[invite] Motion disabled:', err);
    openStage(false);
    watchDrawings(chalkReady, '.rt-chapter__art .chalk');
  });
}

// The mount div sits above this script in the page, so render straight away
// (avoids a blank first paint); fall back to DOMContentLoaded if it doesn't.
if (document.getElementById('rt-invite') || document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);

})();

}
