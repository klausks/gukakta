(function () {
  const config  = document.getElementById('search-config');
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const hint    = document.getElementById('search-hint');
  const indexURL = config ? config.dataset.indexUrl : '/index.json';

  let fuse = null;

  fetch(indexURL)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      fuse = new Fuse(data, {
        keys: [
          { name: 'title',    weight: 0.5 },
          { name: 'subtitle', weight: 0.2 },
          { name: 'tags',     weight: 0.2 },
          { name: 'content',  weight: 0.1 },
        ],
        includeScore: true,
        includeMatches: true,
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q') || '';
      if (q) { input.value = q; run(q); }
    })
    .catch(function () {
      hint.textContent = 'Could not load search index.';
    });

  input.addEventListener('input', function () {
    var q = input.value.trim();
    var url = new URL(window.location);
    if (q) { url.searchParams.set('q', q); } else { url.searchParams.delete('q'); }
    history.replaceState(null, '', url);
    run(q);
  });

  function run(q) {
    results.innerHTML = '';
    if (!fuse) return;
    if (q.length < 2) { hint.textContent = ''; return; }

    var hits = fuse.search(q, { limit: 20 });

    if (!hits.length) {
      hint.textContent = 'No results found.';
      return;
    }

    hint.textContent = hits.length + ' result' + (hits.length === 1 ? '' : 's');

    hits.forEach(function (hit) {
      var item = hit.item;
      var li   = document.createElement('li');
      li.className = 'entry-card';

      var a = document.createElement('a');
      a.href = item.permalink;
      a.className = 'entry-card__link';

      var body = document.createElement('div');
      body.className = 'entry-card__body';

      if (item.section) {
        var meta = document.createElement('div');
        meta.className = 'search-result__meta';
        var sectionSpan = document.createElement('span');
        sectionSpan.className = 'search-result__section';
        sectionSpan.textContent = item.section.charAt(0).toUpperCase() + item.section.slice(1);
        meta.appendChild(sectionSpan);
        body.appendChild(meta);
      }

      var title = document.createElement('h2');
      title.className = 'entry-card__title';
      title.textContent = item.title;
      body.appendChild(title);

      if (item.subtitle) {
        var sub = document.createElement('p');
        sub.className = 'entry-card__subtitle';
        sub.textContent = item.subtitle;
        body.appendChild(sub);
      }

      if (item.content) {
        var snippet = document.createElement('p');
        snippet.className = 'entry-card__summary';
        snippet.textContent = item.content.slice(0, 160).trim() + '\u2026';
        body.appendChild(snippet);
      }

      if (item.tags && item.tags.length) {
        var tagWrap = document.createElement('div');
        tagWrap.className = 'entry-card__tags';
        item.tags.forEach(function (t) {
          var span = document.createElement('span');
          span.className = 'tag';
          span.textContent = t;
          tagWrap.appendChild(span);
        });
        body.appendChild(tagWrap);
      }

      a.appendChild(body);
      li.appendChild(a);
      results.appendChild(li);
    });
  }
})();
