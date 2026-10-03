/*!
 * chalk-draw.js — scroll-drawn chalk illustrations
 * No dependencies. Draws once on scroll and never undraws.
 *
 * Usage:
 *   <div data-chalk-src="https://…/svg/monogram.svg"></div>
 *   <script src="https://…/chalk-draw.js" defer></script>
 *
 * Optional attributes on the container:
 *   data-chalk-color="#111"   ink colour (any CSS colour)
 *   data-chalk-start="0.9"    starts drawing when the top reaches this point of the viewport (0 = top, 1 = bottom)
 *   data-chalk-end="0.45"     fully drawn when the middle reaches this point of the viewport
 *   data-chalk-mode="manual"  ignore scroll; draw only when ChalkDraw.play(el, ms) is called
 *                             (for fixed-position or horizontally moving drawings)
 */
(function () {
  "use strict";
  if (window.__chalkDrawInit) return; // Webflow can load footer code twice
  window.__chalkDrawInit = true;

  var NS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var uid = 0;
  var items = [];
  var svgCache = {};
  var ticking = false;

  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }
  function list(v, d) { return v ? v.split(",").map(Number) : d; }

  function fetchSvg(url) {
    if (!svgCache[url]) {
      svgCache[url] = fetch(url, { mode: "cors" }).then(function (r) {
        if (!r.ok) throw new Error("chalk-draw: " + r.status + " loading " + url);
        return r.text();
      });
    }
    return svgCache[url];
  }

  function parseSvg(text) {
    var doc = new DOMParser().parseFromString(text, "image/svg+xml");
    if (doc.querySelector("parsererror")) throw new Error("chalk-draw: SVG is not valid XML");
    var svg = doc.querySelector("svg");
    if (!svg) throw new Error("chalk-draw: no <svg> found");
    return document.importNode(svg, true);
  }

  // Builds the chalk rendering for one container. Returns an item record.
  function build(el, src) {
    var id = "chalk" + (++uid);
    var vb = src.getAttribute("viewBox").split(/[\s,]+/).map(Number);
    var ink = el.getAttribute("data-chalk-color") || "#111";
    var cfg = {
      step: num(src.getAttribute("data-step"), 4),
      minw: num(src.getAttribute("data-minw"), 0),
      wave: list(src.getAttribute("data-wave"), [34, 12, 85, 46, 17, 6]),
      taper: list(src.getAttribute("data-taper"), [0.6, 40, 0.5, 50]),
      alpha: list(src.getAttribute("data-alpha"), [0.55, 0.5, 0.8]),
      speed: num(src.getAttribute("data-speed"), 1.8),
      overlap: num(src.getAttribute("data-overlap"), 0.7)
    };
    var title = src.querySelector("title");

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", vb.join(" "));
    svg.setAttribute("role", "img");
    if (title) svg.setAttribute("aria-label", title.textContent);
    svg.style.display = "block";
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.overflow = "visible";

    svg.innerHTML =
      '<defs>' +
      '<filter id="' + id + 'f" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="' + (uid * 7 % 97) + '" result="warp"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" result="rough"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="' + (uid * 13 % 89) + '" result="grain"/>' +
      '<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.3" result="grainA"/>' +
      '<feComposite in="rough" in2="grainA" operator="in"/>' +
      '</filter>' +
      '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '">' +
      '<g stroke-linecap="round" stroke-linejoin="round"></g></mask>' +
      '</defs>' +
      '<g class="chalk-src" visibility="hidden" fill="none" stroke="none"></g>' +
      '<g filter="url(#' + id + 'f)"><rect x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] +
      '" fill="' + ink + '" mask="url(#' + id + 'm)"/></g>';

    el.innerHTML = "";
    el.appendChild(svg);

    var holder = svg.querySelector(".chalk-src");
    var mk = svg.querySelector("mask g");
    var srcPaths = src.querySelectorAll("path");
    for (var i = 0; i < srcPaths.length; i++) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", srcPaths[i].getAttribute("d"));
      p.dataset.w = srcPaths[i].getAttribute("stroke-width") || "8";
      if (srcPaths[i].getAttribute("data-sync")) p.dataset.sync = "1";
      holder.appendChild(p);
    }

    // Seeded random so each drawing looks the same on every visit
    var seed = 7 + uid;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    var segs = [], t0 = 0, lastStart = 0;
    var W = cfg.wave, T = cfg.taper, A = cfg.alpha;
    var paths = holder.querySelectorAll("path");
    for (var j = 0; j < paths.length; j++) {
      var path = paths[j];
      var L = path.getTotalLength(), w = +path.dataset.w;
      var dur = Math.max(200, L / cfg.speed);
      var start = path.dataset.sync ? lastStart : t0;
      var ph = [rnd(), rnd(), rnd(), rnd(), rnd(), rnd()].map(function (r) { return r * 6.283; });
      var prev = path.getPointAtLength(0);
      for (var s = cfg.step; s < L + cfg.step; s += cfg.step) {
        var ss = Math.min(s, L), pt = path.getPointAtLength(ss);
        var n1 = 0.5 + 0.28 * Math.sin(ss / W[0] + ph[0]) + 0.14 * Math.sin(ss / W[1] + ph[1]) + 0.08 * Math.sin(ss / W[2] + ph[2]);
        var n2 = 0.5 + 0.3 * Math.sin(ss / W[3] + ph[3]) + 0.12 * Math.sin(ss / W[4] + ph[4]) + 0.08 * Math.sin(ss / W[5] + ph[5]);
        var taper = Math.min(1, T[0] + ss / T[1]) * Math.min(1, T[2] + (L - ss) / T[3]);
        var a = Math.min(1, (A[0] + A[1] * n2) * (A[2] + (1 - A[2]) * taper));
        var g = Math.round(255 * a);
        var ln = document.createElementNS(NS, "line");
        ln.setAttribute("x1", prev.x.toFixed(1)); ln.setAttribute("y1", prev.y.toFixed(1));
        ln.setAttribute("x2", pt.x.toFixed(1)); ln.setAttribute("y2", pt.y.toFixed(1));
        ln.setAttribute("stroke", "rgb(" + g + "," + g + "," + g + ")");
        ln.setAttribute("stroke-width", Math.max(cfg.minw, w * (0.65 + 0.7 * n1) * taper).toFixed(2));
        ln.setAttribute("visibility", "hidden");
        segs.push({ el: ln, t: start + dur * Math.acos(1 - 2 * (ss / L)) / Math.PI });
        prev = pt;
      }
      if (!path.dataset.sync) { lastStart = start; t0 = start + dur * cfg.overlap; }
    }
    segs.sort(function (a, b) { return a.t - b.t; });
    var frag = document.createDocumentFragment();
    segs.forEach(function (sg) { frag.appendChild(sg.el); });
    mk.appendChild(frag);
    holder.parentNode.removeChild(holder);

    var total = segs.length ? segs[segs.length - 1].t : 1;
    return {
      el: el, segs: segs, total: total, k: 0,
      shown: 0, target: 0, done: false,
      manual: el.getAttribute("data-chalk-mode") === "manual",
      startAt: num(el.getAttribute("data-chalk-start"), 0.9),
      endAt: num(el.getAttribute("data-chalk-end"), 0.45)
    };
  }

  function reveal(item, progress) {
    var limit = progress * item.total;
    var segs = item.segs;
    while (item.k < segs.length && segs[item.k].t <= limit) {
      segs[item.k].el.setAttribute("visibility", "visible");
      item.k++;
    }
    if (item.k >= segs.length && !item.done) {
      item.done = true;
      item.el.classList.add("chalk-drawn");
      item.el.dispatchEvent(new CustomEvent("chalk:drawn", { bubbles: true }));
    }
  }

  function scrollTarget(item) {
    var r = item.el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.bottom < 0 && r.height > 0) return 1; // already scrolled past
    var from = item.startAt * vh, to = item.endAt * vh;
    var span = from - to + r.height / 2;
    var p = span > 0 ? (from - r.top) / span : 1;
    // Near the bottom of the page, finish anything on screen that can't scroll further
    var maxScroll = document.documentElement.scrollHeight - vh;
    if (r.top < vh && window.pageYOffset >= maxScroll - 2) p = 1;
    return Math.max(0, Math.min(1, p));
  }

  var lastTime = 0;
  function tick(now) {
    var dt = lastTime ? Math.min(100, now - lastTime) : 16;
    lastTime = now;
    var busy = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.segs || it.done) continue;
      if (it.manual) {
        // time-driven: playAt is set by ChalkDraw.play()
        if (it.playAt == null) continue;
        var tp = Math.max(0, Math.min(1, (now - it.playAt) / it.playDur));
        if (tp > it.shown) { it.shown = it.target = tp; reveal(it, tp); }
        if (tp < 1) busy = true;
        continue;
      }
      it.target = Math.max(it.target, scrollTarget(it)); // never goes backwards
      if (it.shown < it.target) {
        // ease toward the scroll position so fast scrolls still look hand-drawn
        it.shown += Math.max(0.002, (it.target - it.shown) * Math.min(1, dt / 140));
        if (it.target - it.shown < 0.002) it.shown = it.target;
        reveal(it, it.shown);
        if (it.shown < it.target) busy = true;
      }
    }
    if (busy) requestAnimationFrame(tick);
    else { ticking = false; lastTime = 0; }
  }

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }

  function prepare(item) {
    if (item.preparing) return;
    item.preparing = true;
    var el = item.el;
    var inline = el.querySelector("svg[data-chalk]");
    var srcUrl = el.getAttribute("data-chalk-src");
    var ready = inline ? Promise.resolve(inline.cloneNode(true)) : fetchSvg(srcUrl).then(parseSvg);
    ready.then(function (src) {
      var built = build(el, src);
      for (var key in built) item[key] = built[key];
      if (reduceMotion || item.forceComplete) { item.target = item.shown = 1; reveal(item, 1); return; }
      if (item.manual) { if (item.wantPlay) startPlay(item); return; }
      requestTick();
    }).catch(function (err) { console.error(err); });
  }

  function startPlay(item) {
    item.playAt = performance.now();
    requestTick();
  }

  function itemFor(el) {
    var item = items.filter(function (x) { return x.el === el; })[0];
    if (!item) { el.__chalk = true; item = { el: el }; items.push(item); }
    return item;
  }

  function init(root) {
    var els = (root || document).querySelectorAll("[data-chalk-src], [data-chalk-inline]");
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var item = items.filter(function (x) { return x.el === e.target; })[0];
        if (item) prepare(item);
      });
    }, { rootMargin: "60% 0px 60% 0px" }) : null;

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__chalk) continue;
      el.__chalk = true;
      var item = { el: el };
      items.push(item);
      if (io) io.observe(el); else prepare(item);
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  window.ChalkDraw = {
    init: init,
    // Draw a manual-mode container over ms milliseconds. Resolves when drawn.
    play: function (el, ms) {
      var item = itemFor(el);
      item.playDur = Math.max(1, ms || 1500);
      item.wantPlay = true;
      return new Promise(function (resolve) {
        if (item.done) { resolve(); return; }
        el.addEventListener("chalk:drawn", function () { resolve(); }, { once: true });
        if (item.segs) { if (item.playAt == null) startPlay(item); }
        else prepare(item);
      });
    },
    // Instantly finish one container (or all if omitted)
    complete: function (el) {
      items.forEach(function (it) {
        if (el && it.el !== el) return;
        if (it.segs) { it.target = it.shown = 1; reveal(it, 1); }
        else { it.forceComplete = true; prepare(it); }
      });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
