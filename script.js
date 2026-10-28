document.getElementById('yr').textContent = new Date().getFullYear();

// Quote form: send in the background; if the form service is down,
// hand the details to the visitor's text/email app so no lead is lost.
(function () {
  var form = document.querySelector('.quote-form');
  if (!form || !window.fetch) return;
  var btn = form.querySelector('button[type="submit"]');
  var box = form.querySelector('.form-fallback');
  var endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
  var thanks = form.querySelector('input[name="_next"]').value;
  var PHONE = '+17574535527';
  var EMAIL = 'entempsllc@gmail.com';

  function summary() {
    var v = function (n) { return (form.elements[n].value || '').trim(); };
    return 'Scoop 757 quote request\n' +
      'Name: ' + v('name') + '\nPhone: ' + v('phone') +
      (v('email') ? '\nEmail: ' + v('email') : '') +
      '\nAddress: ' + v('address') + ' ' + v('zip') +
      '\nDogs: ' + v('dogs') + '\nService: ' + v('service') +
      (v('notes') ? '\nNotes: ' + v('notes') : '');
  }

  function showFallback() {
    var body = encodeURIComponent(summary());
    var sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '?';
    box.querySelector('.fb-sms').href = 'sms:' + PHONE + sep + 'body=' + body;
    box.querySelector('.fb-mail').href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Scoop 757 quote request') + '&body=' + body;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('input[name="_honey"]').value) return; // bot
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    box.hidden = true;

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        if (String(d.success) === 'true') { window.location.href = thanks; }
        else { throw new Error(d.message); }
      })
      .catch(function () {
        clearTimeout(timer);
        btn.disabled = false;
        btn.textContent = label;
        showFallback();
      });
  });
})();
