(function () {
  var input = document.getElementById('q');
  var list = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  if (!input || !list) return;

  var docs = null;
  var loading = null;

  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function load() {
    if (docs) return Promise.resolve(docs);
    if (!loading) {
      loading = fetch(input.getAttribute('data-index'))
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) {
          docs = d.map(function (p) {
            p._title = fold(p.title);
            p._tags = fold((p.tags || []).concat(p.categories || []).join(' '));
            p._desc = fold(p.description);
            p._body = fold(p.content);
            return p;
          });
          return docs;
        });
    }
    return loading;
  }
  function score(p, terms) {
    var s = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0;
      if (p._title.indexOf(t) > -1) hit += 10;
      if (p._tags.indexOf(t) > -1) hit += 6;
      if (p._desc.indexOf(t) > -1) hit += 3;
      if (p._body.indexOf(t) > -1) hit += 1;
      if (!hit) return 0; // every term must match somewhere
      s += hit;
    }
    return s;
  }
  function render(q) {
    list.textContent = '';
    var terms = fold(q).split(/\s+/).filter(Boolean);
    if (!terms.length) { status.textContent = ''; return; }
    load().then(function (all) {
      var res = all.map(function (p) { return { p: p, s: score(p, terms) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s || (a.p.date < b.p.date ? 1 : -1); });
      status.textContent = res.length
        ? res.length + ' artikel ditemukan.'
        : 'Tidak ada hasil untuk “' + q + '”.';
      res.forEach(function (x) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = x.p.url;
        a.textContent = x.p.title;
        var d = document.createElement('p');
        d.textContent = x.p.date + ' — ' + (x.p.description || '');
        li.appendChild(a);
        li.appendChild(d);
        list.appendChild(li);
      });
    }).catch(function () {
      status.textContent = 'Indeks pencarian tidak dapat dimuat.';
    });
  }

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { render(input.value); }, 120);
  });
  var form = input.form;
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); render(input.value); });
  var q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q; render(q); }
})();
