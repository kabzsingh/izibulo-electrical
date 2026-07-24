// Izibulo Electrical — shared behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Footer year
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Breaker switches on home hero — small ambient motion
  var switches = document.querySelectorAll('.panel-graphic .switch');
  if (switches.length) {
    setInterval(function () {
      var idx = Math.floor(Math.random() * switches.length);
      switches[idx].classList.toggle('on');
    }, 2600);
  }

  // Contact form — build a mailto with the entered details (no backend on this site yet)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name').value.trim();
      var phone = form.querySelector('#phone').value.trim();
      var email = form.querySelector('#email').value.trim();
      var service = form.querySelector('#service').value;
      var message = form.querySelector('#message').value.trim();
      var status = document.getElementById('form-status');

      if (!name || !phone || !message) {
        status.textContent = 'Please fill in your name, phone number, and a short message.';
        status.style.color = '#C0392B';
        status.classList.add('show');
        return;
      }

      var subject = encodeURIComponent('Quote request — ' + service);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Email: ' + email + '\n' +
        'Service needed: ' + service + '\n\n' +
        message
      );
      window.location.href = 'mailto:info@izibuloelectrical.co.za?subject=' + subject + '&body=' + body;

      status.textContent = 'Opening your email app to send this through — if nothing opens, call us instead.';
      status.style.color = '#1F7A4D';
      status.classList.add('show');
    });
  }
});
