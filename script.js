// Izibulo Electrical — shared behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav open/close is now handled entirely by a CSS checkbox toggle
  // (see .nav-toggle-input in styles.css) — no JS required, so it can't
  // break even if this script fails to load or execute for any reason.

  // Footer year
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Scroll reveal for sections, respecting reduced-motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  // Hero panel — a slow, subtle pulse on one breaker node at a time
  var switches = document.querySelectorAll('.panel-graphic .switch');
  if (switches.length && !prefersReducedMotion) {
    setInterval(function () {
      var idx = Math.floor(Math.random() * switches.length);
      switches[idx].style.transition = 'box-shadow .6s ease';
      switches[idx].style.boxShadow = '0 0 0 5px rgba(184,112,62,0.32)';
      setTimeout(function () {
        switches[idx].style.boxShadow = '';
      }, 900);
    }, 2200);
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
        status.style.color = '#8C5228';
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
      window.location.href = 'mailto:kabirsingh@ymail.com?subject=' + subject + '&body=' + body;

      status.textContent = 'Opening your email app to send this through — if nothing opens, call us instead.';
      status.style.color = '#4A6B4E';
      status.classList.add('show');
    });
  }
});
