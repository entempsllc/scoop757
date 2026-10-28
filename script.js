document.getElementById('yr').textContent = new Date().getFullYear();

// Quote form: send in the background so visitors never leave the site
(function () {
  var form = document.querySelector('.quote-form');
  if (!form || !window.fetch) return;
  var btn = form.querySelector('button[type="submit"]');
  var endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
  var thanks = form.querySelector('input[name="_next"]').value;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('input[name="_honey"]').value) return; // bot
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && String(res.d.success) === 'true') {
          window.location.href = thanks;
        } else {
          throw new Error(res.d && res.d.message);
        }
      })
      .catch(function () {
        // Background send failed: fall back to a normal form post
        btn.textContent = label;
        HTMLFormElement.prototype.submit.call(form);
      });
  });
})();
