// Hydro Electric (Pty) Ltd
(function () {
  var WHATSAPP = '27738624909';
  var EMAIL = 'hydro.admin1@gmail.com';

  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Close the mobile menu after a link is tapped
  var toggle = document.getElementById('nav-toggle');
  if (toggle) {
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () { toggle.checked = false; });
    });
  }

  // Quote form: opens WhatsApp or the email app with the details filled in
  var form = document.getElementById('quote-form');
  if (!form) return;
  var errorBox = document.getElementById('form-error');
  var via = 'whatsapp';
  form.querySelectorAll('button[data-via]').forEach(function (b) {
    b.addEventListener('click', function () { via = b.getAttribute('data-via'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = function (id) { return document.getElementById(id); };
    var required = [['f-name', 'your name'], ['f-phone', 'your phone number'], ['f-msg', 'a description of the job']];
    var missing = [];
    required.forEach(function (r) {
      var el = f(r[0]);
      var empty = !el.value.trim();
      el.setAttribute('aria-invalid', empty ? 'true' : 'false');
      if (empty) missing.push(r[1]);
    });
    if (missing.length) {
      errorBox.textContent = 'Please add ' + missing.join(', ') + '.';
      errorBox.hidden = false;
      f(required.filter(function (r) { return !f(r[0]).value.trim(); })[0][0]).focus();
      return;
    }
    errorBox.hidden = true;

    var lines = [
      'Quote request',
      'Name: ' + f('f-name').value.trim(),
      'Phone: ' + f('f-phone').value.trim(),
      f('f-area').value.trim() ? 'Suburb: ' + f('f-area').value.trim() : '',
      'Service: ' + f('f-service').value,
      '',
      f('f-msg').value.trim()
    ].filter(function (l, i) { return l !== '' || i === 5; });
    var text = lines.join('\n');

    if (via === 'email') {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quote request: ' + f('f-service').value) + '&body=' + encodeURIComponent(text);
    } else {
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }
  });
})();
