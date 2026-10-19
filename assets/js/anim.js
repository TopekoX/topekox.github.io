/* Randomised entrance animations for [data-anim] containers.
 * Armed only when <html> has the `anim` class (set in head.html, never under prefers-reduced-motion).
 * CSS holds the keyframes and a no-JS failsafe; this script only picks variant, duration, distance and delay. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('anim')) return;

  var VARIANTS = ['fade-in', 'fade-in-up', 'fade-in-down', 'fade-in-left', 'fade-in-right', 'fade-in-zoom'];
  var DUR = [350, 650];     // ms
  var DIST = [8, 16];       // px, directional variants
  var STAGGER = 60;         // ms per visible element, ...
  var MAX_STEPS = 5;        // ... capped, so the longest delay is ~5*60 + 50 = 350 ms
  var JITTER = 50;          // ms

  function rnd(min, max) { return min + Math.random() * (max - min); }

  var vh = window.innerHeight || root.clientHeight;
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-anim]'));
  var step = 0;
  var pending = els.length;

  // The sidebar is a scroll container; while panels move, it is clipped (see CSS) so the transforms cannot
  // add scrollable overflow. Once every animation is over, `anim-finished` lets it scroll normally again.
  function oneDone() {
    if (--pending <= 0) root.classList.add('anim-finished');
  }
  if (!pending) root.classList.add('anim-finished');

  els.forEach(function (el) {
    var r = el.getBoundingClientRect();
    var inView = r.height > 0 && r.top < vh && r.bottom > 0;
    // Only elements visible on load take part in the stagger; the rest finish unseen.
    var delay = inView ? Math.min(step++, MAX_STEPS) * STAGGER + rnd(0, JITTER) : rnd(0, JITTER);
    var dur = Math.round(rnd(DUR[0], DUR[1]));
    var variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    var cls = 'anim-' + variant;

    el.style.setProperty('--anim-dur', dur + 'ms');
    el.style.setProperty('--anim-delay', Math.round(delay) + 'ms');
    el.style.setProperty('--anim-dist', Math.round(rnd(DIST[0], DIST[1])) + 'px');
    el.setAttribute('data-anim-variant', variant);

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      el.classList.remove(cls);
      el.classList.add('anim-done');
      oneDone();
      el.style.removeProperty('--anim-dur');
      el.style.removeProperty('--anim-delay');
      el.style.removeProperty('--anim-dist');
    }
    el.addEventListener('animationend', function (e) { if (e.target === el) finish(); });
    setTimeout(finish, delay + dur + 300); // fallback if animationend never fires (e.g. tab hidden)
    el.classList.add(cls);
  });
})();
