(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  var bar = document.getElementById('progress');
  var top = document.getElementById('to-top');
  var ticking = false;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var y = window.scrollY || h.scrollTop;
    if (bar) bar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
    if (top) top.hidden = y < 400;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  if (top) {
    top.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
  update();

  document.querySelectorAll('.code-block').forEach(function (block) {
    var pres = block.querySelectorAll('pre');
    var pre = pres[pres.length - 1]; // table layout: last <pre> holds the code
    if (!pre) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.addEventListener('click', function () {
      // Line-number cells are separate (.lnt/.ln); copy only code content.
      var clone = pre.cloneNode(true);
      clone.querySelectorAll('.lnt, .ln, .lnlinks').forEach(function (n) { n.remove(); });
      var text = clone.textContent.replace(/\n$/, '');
      var done = function () {
        btn.textContent = 'Copied!';
        btn.classList.add('is-copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
      else {
        var t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(t);
      }
    });
    block.appendChild(btn);
  });

  var copy = document.querySelector('.share__btn[data-copy]');
  if (copy) {
    copy.addEventListener('click', function () {
      var url = copy.getAttribute('data-copy');
      var done = function () {
        copy.classList.add('is-copied');
        setTimeout(function () { copy.classList.remove('is-copied'); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done);
      else {
        var t = document.createElement('textarea');
        t.value = url; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(t);
      }
    });
  }
})();
