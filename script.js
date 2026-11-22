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

// ---------- Light / dark switch ----------
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  function paint() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = '<span aria-hidden="true">' + (dark ? '☀' : '☾') + '</span>';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0A0E14' : '#1B2430');
  }
  btn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('he-theme', next); } catch (e) {}
    paint();
  });
  paint();
  var phone = nav.querySelector('.btn');
  nav.insertBefore(btn, phone || null);
})();

// ---------- Sections slide in as you scroll ----------
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('.section-title, .trade, .steps li, .split > *, .svc-group, .promise-grid > *, .way, .quote-form, .cta-inner > *, .plain-list, .measure');
  items.forEach(function (el, i) {
    el.classList.add('reveal');
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(sib, 5) * 80 + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// ---------- Live background: cables, sparks, lightning, water drops ----------
(function () {
  var hosts = document.querySelectorAll('.hero, .page-head');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  hosts.forEach(function (host) {
    var canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, host.firstChild);
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, raf = 0, running = false, last = performance.now();
    var drops = [], parts = [], ripples = [], flashes = [], arcs = [], motes = [];
    var nextDrop = 0, nextSpark = 500, nextArc = 1200, pulses = [0, 0.6];

    function newMote(anywhere) {
      var water = Math.random() < 0.5;
      return { x: Math.random() * w, y: anywhere ? Math.random() * h : h + 6, vy: 8 + Math.random() * 18, sway: Math.random() * 6.28, r: water ? 1 + Math.random() * 2.2 : 0.8 + Math.random() * 1.4, water: water, tw: Math.random() * 6.28 };
    }
    function resize() {
      var r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = []; var n = Math.round((w * h) / 4500);
      for (var i = 0; i < n; i++) motes.push(newMote(true));
    }
    function wire(i, t) {
      var c = i === 0 ? { x0: -30, y0: 8, x2: w + 30, y2: 20, cx: w * 0.55, cy: 62 } : { x0: -30, y0: h - 30, x2: w + 30, y2: h - 50, cx: w * 0.45, cy: h + 10 };
      var u = 1 - t;
      return { x: u * u * c.x0 + 2 * u * t * c.cx + t * t * c.x2, y: u * u * c.y0 + 2 * u * t * c.cy + t * t * c.y2 };
    }
    function drawWires() {
      ctx.lineCap = 'round';
      for (var i = 0; i < 2; i++) {
        ctx.beginPath();
        for (var k = 0; k <= 50; k++) { var p = wire(i, k / 50); if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        ctx.strokeStyle = 'rgba(6,10,15,0.9)'; ctx.lineWidth = 6; ctx.stroke();
        ctx.strokeStyle = 'rgba(120,135,155,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
    function spark() {
      var i = Math.random() < 0.55 ? 1 : 0, p = wire(i, 0.12 + Math.random() * 0.76);
      flashes.push({ x: p.x, y: p.y, life: 0, max: 0.35 });
      var n = 24 + Math.floor(Math.random() * 22);
      for (var k = 0; k < n; k++) {
        var a = i === 1 ? -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3 : Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
        var v = 90 + Math.random() * 280;
        parts.push({ x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.4 + Math.random() * 0.7, kind: 'spark' });
      }
    }
    function arc() {
      var x1 = Math.random() * w, y1 = Math.random() * h * 0.9, ang = Math.random() * Math.PI * 2;
      var len = 60 + Math.random() * Math.min(w, h) * 0.55;
      var x2 = Math.max(0, Math.min(w, x1 + Math.cos(ang) * len)), y2 = Math.max(0, Math.min(h, y1 + Math.sin(ang) * len));
      var pts = [], steps = 10 + Math.floor(len / 18);
      for (var k = 0; k <= steps; k++) {
        var t = k / steps, j = k === 0 || k === steps ? 0 : (Math.random() - 0.5) * 22;
        pts.push({ x: x1 + (x2 - x1) * t + j * Math.sin(ang), y: y1 + (y2 - y1) * t - j * Math.cos(ang) });
      }
      arcs.push({ pts: pts, life: 0, max: 0.32, blue: Math.random() < 0.6 });
    }
    function splash(x, y, r) {
      ripples.push({ x: x, y: y, life: 0, max: 0.7, r: r });
      for (var k = 0; k < 6; k++) {
        var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, v = 40 + Math.random() * 70;
        parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.45 + Math.random() * 0.3, kind: 'water' });
      }
    }
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, w, h);
      motes.forEach(function (m) {
        m.y -= m.vy * dt; m.sway += dt * 1.4; m.tw += dt * 3;
        if (m.y < -8) { var nm = newMote(false); for (var key in nm) m[key] = nm[key]; }
        var x = m.x + Math.sin(m.sway) * 6, a = 0.25 + 0.25 * Math.sin(m.tw);
        if (m.water) { ctx.strokeStyle = 'rgba(140,190,255,' + (a + 0.1) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, m.y, m.r, 0, 6.283); ctx.stroke(); }
        else { ctx.fillStyle = 'rgba(255,200,80,' + (a + 0.15) + ')'; ctx.beginPath(); ctx.arc(x, m.y, m.r, 0, 6.283); ctx.fill(); }
      });
      drawWires();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 2; i++) {
        pulses[i] += dt * (i ? 0.42 : 0.35); if (pulses[i] > 1.4) pulses[i] = 0;
        if (pulses[i] > 1) continue;
        for (var k = 0; k < 10; k++) {
          var tt = pulses[i] - k * 0.012; if (tt < 0) break;
          var p = wire(i, tt);
          ctx.fillStyle = 'rgba(255,' + (210 - k * 8) + ',' + (80 - k * 6) + ',' + (0.75 - k * 0.07) + ')';
          ctx.beginPath(); ctx.arc(p.x, p.y, 3.2 - k * 0.22, 0, 6.283); ctx.fill();
        }
      }
      ctx.restore();
      nextDrop -= dt * 1000; if (nextDrop <= 0) { drops.push({ x: 10 + Math.random() * (w - 20), y: -12, vy: 40 + Math.random() * 60, r: 2.8 + Math.random() * 2.6 }); nextDrop = Math.max(120, 260000 / Math.max(w, 300)) * (0.6 + Math.random() * 0.8); }
      nextSpark -= dt * 1000; if (nextSpark <= 0) { spark(); nextSpark = 800 + Math.random() * 1400; }
      nextArc -= dt * 1000; if (nextArc <= 0) { arc(); nextArc = 1600 + Math.random() * 2600; }
      for (i = drops.length - 1; i >= 0; i--) {
        var d = drops[i];
        d.vy += 520 * dt; d.y += d.vy * dt;
        var wy = wire(1, Math.max(0, Math.min(1, (d.x + 30) / (w + 60)))).y;
        if (Math.abs(d.y - wy) < 4 && Math.random() < 0.35) { splash(d.x, wy, d.r); drops.splice(i, 1); continue; }
        if (d.y >= h - 4) { splash(d.x, h - 4, d.r); drops.splice(i, 1); continue; }
        ctx.fillStyle = 'rgba(90,160,255,0.7)';
        ctx.beginPath(); ctx.moveTo(d.x, d.y - d.r * 3);
        ctx.quadraticCurveTo(d.x + d.r * 1.4, d.y, d.x, d.y + d.r);
        ctx.quadraticCurveTo(d.x - d.r * 1.4, d.y, d.x, d.y - d.r * 3); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(d.x - d.r * 0.35, d.y - d.r * 0.2, d.r * 0.3, 0, 6.283); ctx.fill();
      }
      for (i = ripples.length - 1; i >= 0; i--) {
        var r = ripples[i]; r.life += dt; var q = r.life / r.max;
        if (q >= 1) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = 'rgba(120,180,255,' + 0.45 * (1 - q) + ')'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(r.x, r.y, 4 + q * 18 * (r.r / 3), 1.5 + q * 4, 0, 0, 6.283); ctx.stroke();
      }
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (i = arcs.length - 1; i >= 0; i--) {
        var A = arcs[i]; A.life += dt; var ka = A.life / A.max;
        if (ka >= 1) { arcs.splice(i, 1); continue; }
        if (Math.random() < 0.3) continue;
        var col = A.blue ? '150,205,255' : '255,215,120';
        ctx.lineJoin = 'round';
        [[7, 0.12], [3, 0.35], [1.3, 0.95]].forEach(function (L) {
          ctx.strokeStyle = 'rgba(' + col + ',' + L[1] * (1 - ka) + ')'; ctx.lineWidth = L[0];
          ctx.beginPath(); A.pts.forEach(function (p, n) { if (n) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.stroke();
        });
      }
      for (i = flashes.length - 1; i >= 0; i--) {
        var f = flashes[i]; f.life += dt; var kf = f.life / f.max;
        if (kf >= 1) { flashes.splice(i, 1); continue; }
        var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 50);
        g.addColorStop(0, 'rgba(255,240,180,' + 0.8 * (1 - kf) + ')'); g.addColorStop(1, 'rgba(255,160,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, 50, 0, 6.283); ctx.fill();
      }
      for (i = parts.length - 1; i >= 0; i--) {
        var s2 = parts[i]; s2.life += dt; var kp = s2.life / s2.max;
        if (kp >= 1) { parts.splice(i, 1); continue; }
        s2.vy += (s2.kind === 'spark' ? 420 : 380) * dt; s2.vx *= 0.99;
        var px = s2.x, py = s2.y; s2.x += s2.vx * dt; s2.y += s2.vy * dt;
        if (s2.kind === 'spark') {
          ctx.strokeStyle = 'rgba(255,' + Math.round(230 - 120 * kp) + ',' + Math.round(120 - 110 * kp) + ',' + (1 - kp) + ')';
          ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(s2.x, s2.y); ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(140,190,255,' + 0.7 * (1 - kp) + ')'; ctx.beginPath(); ctx.arc(s2.x, s2.y, 1.3, 0, 6.283); ctx.fill();
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running || reduce) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
    if (reduce) { drawWires(); return; }
    // Only animate while the section is on screen (saves battery).
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(host);
    } else start();
  });
})();
