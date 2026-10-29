document.getElementById('yr').textContent = new Date().getFullYear();

// Quote form: Web3Forms (one retry), then a prefilled
// text/email handoff if it is down. Visitors never leave the site.
(function () {
  var form = document.querySelector('.quote-form');
  if (!form || !window.fetch) return;
  var btn = form.querySelector('button[type="submit"]');
  var box = form.querySelector('.form-fallback');
  var thanks = 'https://www.scoop757.com/thanks.html';
  var PHONE = '+17574535527';
  var EMAIL = 'entempsllc@gmail.com';
  var FIELDS = ['name', 'phone', 'email', 'address', 'zip', 'dogs', 'service', 'notes'];

  function v(n) { return (form.elements[n].value || '').trim(); }
  function lead() { var o = {}; FIELDS.forEach(function (n) { o[n] = v(n); }); return o; }

  function post(url, data, ok) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { return r.json(); })
      .then(function (d) { clearTimeout(t); if (!ok(d)) throw new Error('rejected'); })
      .catch(function (e) { clearTimeout(t); throw e; });
  }

  function viaWeb3Forms() {
    var d = lead();
    d.access_key = form.elements.access_key.value;
    d.subject = 'New Scoop 757 quote request';
    d.from_name = 'Scoop 757 website';
    return post('https://api.web3forms.com/submit', d, function (r) { return r.success === true; });
  }


  function showFallback() {
    var body = 'Scoop 757 quote request\nName: ' + v('name') + '\nPhone: ' + v('phone') +
      (v('email') ? '\nEmail: ' + v('email') : '') +
      '\nAddress: ' + v('address') + ' ' + v('zip') +
      '\nDogs: ' + v('dogs') + '\nService: ' + v('service') +
      (v('notes') ? '\nNotes: ' + v('notes') : '');
    body = encodeURIComponent(body);
    var sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '?';
    box.querySelector('.fb-sms').href = 'sms:' + PHONE + sep + 'body=' + body;
    box.querySelector('.fb-mail').href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Scoop 757 quote request') + '&body=' + body;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.botcheck.checked) return; // bot
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    box.hidden = true;

    viaWeb3Forms()
      .catch(viaWeb3Forms)
      .then(function () { window.location.href = thanks; })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = label;
        showFallback();
      });
  });
})();
