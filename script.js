/* ═══════════════════════════════════════════════════════════════════
   Shubham Dansena · Portfolio JS
   Matches the new ultra-premium index.html
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. PROGRESS BAR
  ───────────────────────────────────────────── */
  const prog = document.getElementById('prog');
  function updateProgress() {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - window.innerHeight)) * 100;
    if (prog) prog.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ─────────────────────────────────────────────
     2. NAVBAR — scroll shadow + active link
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-resume)');

  function updateNav() {
    const scrollY = window.scrollY;

    // Scrolled shadow
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run once on load


  /* ─────────────────────────────────────────────
     3. SMOOTH SCROLL for all anchor links
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 68, // 68px = nav height
          behavior: 'smooth'
        });
      }
    });
  });


  /* ─────────────────────────────────────────────
     4. REVEAL ON SCROLL (IntersectionObserver)
  ───────────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ─────────────────────────────────────────────
     5. SKILL BARS — animate width on scroll
  ───────────────────────────────────────────── */
  function animateSkillBars(container) {
    container.querySelectorAll('.sb-fill').forEach(bar => {
      const targetVal = bar.dataset.val || '0';
      // Small delay so the reveal transition completes first
      setTimeout(() => { bar.style.width = targetVal + '%'; }, 200);
    });
  }

  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars(entry.target);
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-bar-list').forEach(el => barObs.observe(el));


  /* ─────────────────────────────────────────────
     6. STAT COUNTER ANIMATION (hero stats)
  ───────────────────────────────────────────── */
  function animateCounter(el, target, suffix = '') {
    const duration = 1400;
    const start = performance.now();
    const isFloat = String(target).includes('.');
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (target - from) * eased;
      el.textContent = (isFloat ? value.toFixed(2) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.num').forEach(num => {
          const raw = num.textContent.trim();
          const suffix = raw.replace(/[\d.]/g, ''); // e.g. '+', '%'
          const value = parseFloat(raw);
          if (!isNaN(value)) animateCounter(num, value, suffix);
        });
        statObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-strip').forEach(el => statObs.observe(el));


  /* ─────────────────────────────────────────────
     7. CUSTOM CURSOR FOLLOWER
  ───────────────────────────────────────────── */
  // Only on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.id = 'cursor-dot';
    cursor.style.cssText = `
      position: fixed;
      width: 10px; height: 10px;
      border-radius: 50%;
      background: var(--gold);
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: width 0.25s, height 0.25s, background 0.25s, opacity 0.25s;
      opacity: 0;
      mix-blend-mode: multiply;
    `;

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.style.cssText = `
      position: fixed;
      width: 32px; height: 32px;
      border-radius: 50%;
      border: 1.5px solid var(--gold);
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width 0.4s cubic-bezier(0.16,1,0.3,1),
                  height 0.4s cubic-bezier(0.16,1,0.3,1),
                  border-color 0.3s, opacity 0.3s;
      opacity: 0;
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      cursor.style.opacity = '1';
      ring.style.opacity   = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity   = '0';
    });

    // Lag ring with rAF
    function followRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(followRing);
    }
    followRing();

    // Grow ring on interactive hover
    document.querySelectorAll('a, button, .proj-card, .cert-row, .ci-card, .edu-row').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '52px';
        ring.style.height = '52px';
        ring.style.borderColor = 'var(--teal)';
        cursor.style.background = 'var(--teal)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'var(--gold)';
        cursor.style.background = 'var(--gold)';
      });
    });
  }


  /* ─────────────────────────────────────────────
     8. DARK MODE TOGGLE  (adds toggle btn)
  ───────────────────────────────────────────── */
  // Inject toggle button into nav
  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.title = 'Toggle dark mode';
  themeBtn.innerHTML = '☾';
  themeBtn.style.cssText = `
    background: none; border: 1.5px solid var(--border);
    width: 34px; height: 34px; border-radius: 50%;
    cursor: pointer; font-size: 0.9rem;
    color: var(--ink-2);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.25s; flex-shrink:0;
  `;

  // Insert before resume btn in nav
  const navList = document.querySelector('.nav-links');
  if (navList) {
    const li = document.createElement('li');
    li.appendChild(themeBtn);
    navList.appendChild(li);
  }

  // Apply saved theme
  const savedTheme = localStorage.getItem('sd-theme') || 'light';
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sd-theme', theme);
    themeBtn.innerHTML = theme === 'dark' ? '☀︎' : '☾';

    if (theme === 'dark') {
      document.documentElement.style.setProperty('--paper',  '#0f0f11');
      document.documentElement.style.setProperty('--white',  '#18181b');
      document.documentElement.style.setProperty('--ink',    '#f0ece4');
      document.documentElement.style.setProperty('--ink-2',  '#b8b0a2');
      document.documentElement.style.setProperty('--ink-3',  '#6b6760');
      document.documentElement.style.setProperty('--border', '#2a2820');
      document.documentElement.style.setProperty('--border-dark', '#3d3930');
      document.documentElement.style.setProperty('--teal-light', '#0d2020');
    } else {
      document.documentElement.style.setProperty('--paper',  '#f7f6f2');
      document.documentElement.style.setProperty('--white',  '#ffffff');
      document.documentElement.style.setProperty('--ink',    '#0b0c0e');
      document.documentElement.style.setProperty('--ink-2',  '#3d4045');
      document.documentElement.style.setProperty('--ink-3',  '#7a7f87');
      document.documentElement.style.setProperty('--border', '#e4e0d8');
      document.documentElement.style.setProperty('--border-dark', '#c8c2b6');
      document.documentElement.style.setProperty('--teal-light', '#e8f2f2');
    }
  }


  /* ─────────────────────────────────────────────
     9. MOBILE HAMBURGER MENU
  ───────────────────────────────────────────── */
  // Inject hamburger if not present
  if (!document.querySelector('.hamburger') && navbar) {
    const ham = document.createElement('button');
    ham.className = 'hamburger';
    ham.setAttribute('aria-label', 'Toggle menu');
    ham.innerHTML = `<span></span><span></span><span></span>`;
    ham.style.cssText = `
      display: none;
      flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    `;

    const hamStyle = document.createElement('style');
    hamStyle.textContent = `
      .hamburger span {
        display: block; width: 22px; height: 2px;
        background: var(--ink); border-radius: 2px;
        transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
      }
      .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
      @media (max-width: 560px) {
        .hamburger { display: flex !important; }
        .nav-links {
          position: fixed; top: 68px; left: 0; right: 0;
          background: var(--paper);
          border-bottom: 1px solid var(--border);
          flex-direction: column; gap: 0 !important;
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-links.open { max-height: 400px; }
        .nav-links li { width: 100%; }
        .nav-links a { display: block; padding: 0.9rem 5vw !important; border-bottom: 1px solid var(--border); }
        .nav-links a::after { display: none !important; }
        .nav-links a:not(.nav-resume) { display: block !important; }
      }
    `;
    document.head.appendChild(hamStyle);
    navbar.appendChild(ham);

    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      if (navList) navList.classList.toggle('open');
    });

    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        if (navList) navList.classList.remove('open');
      });
    });
  }


  /* ─────────────────────────────────────────────
     10. CONTACT FORM
  ───────────────────────────────────────────── */
  const form = document.querySelector('.contact-form form, form[onsubmit]');
  if (form) {
    // Override inline onsubmit if present
    form.removeAttribute('onsubmit');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Message sent! Talk soon.';
      btn.style.background = 'var(--teal)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3200);
    });
  }

  // Also support global sendMsg used inline in HTML
  window.sendMsg = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Sent! Talk soon.';
    btn.style.background = 'var(--teal)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 3200);
  };


  /* ─────────────────────────────────────────────
     11. HERO TYPING EFFECT (subtitle roles)
  ───────────────────────────────────────────── */
  const roles = ['AI Engineer', 'LLM Builder', 'Full-Stack Dev', 'ML Researcher'];
  let ri = 0, ci = 0, deleting = false;
  const goldSpan = document.querySelector('.hero h1 .gold');

  if (goldSpan) {
    goldSpan.style.display = 'inline-block';
    goldSpan.style.minWidth = '200px';

    function typeLoop() {
      const word = roles[ri];
      if (!deleting) {
        goldSpan.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          return setTimeout(typeLoop, 1800);
        }
      } else {
        goldSpan.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          return setTimeout(typeLoop, 350);
        }
      }
      setTimeout(typeLoop, deleting ? 55 : 90);
    }
    setTimeout(typeLoop, 1200);
  }


  /* ─────────────────────────────────────────────
     12. FLOATING BADGE parallax on scroll
  ───────────────────────────────────────────── */
  const floatBadge = document.querySelector('.float-badge');
  if (floatBadge) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      floatBadge.style.transform = `translateY(${-y * 0.06}px)`;
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     13. PROJECT CARD — tilt micro-interaction
  ───────────────────────────────────────────── */
  document.querySelectorAll('.proj-card, .flagship').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });

  // Disable tilt on flagship for cleaner look on small screens
  if (window.innerWidth < 768) {
    document.querySelectorAll('.flagship').forEach(c => {
      c.onmousemove = null;
    });
  }


  /* ─────────────────────────────────────────────
     14. PAGE LOAD — stagger hero elements in
  ───────────────────────────────────────────── */
  // The .reveal + CSS handles scroll reveals; for hero we
  // force-trigger immediately after a short paint delay.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('#home .reveal').forEach(el => {
        el.classList.add('on');
      });
    });
  });

});
