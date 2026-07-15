/* ============================================================
   SURESH P — PORTFOLIO v2
   Vanilla JS: loader, cursor, theme toggle, particles,
   typing, scroll reveals, counters, tilt, timeline, form.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 860px)').matches;

  /* ---------------------------------------------------------
     1. LOADER
  --------------------------------------------------------- */
  (function loader() {
    const loaderEl = document.getElementById('loader');
    const fill     = document.getElementById('loaderFill');
    const pct      = document.getElementById('loaderPct');
    let progress   = 0;

    document.body.style.overflow = 'hidden';

    const tick = () => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) progress = 100;
      fill.style.width = progress + '%';
      pct.textContent  = Math.floor(progress) + '%';
      if (progress < 100) {
        requestAnimationFrame(tick);
      }
    };
    
    window.addEventListener('load', () => {
      progress = 100;
      fill.style.width = '100%';
      pct.textContent = '100%';
      setTimeout(() => {
        loaderEl.classList.add('is-done');
        document.body.style.overflow = '';
      }, 200);
    });

    setTimeout(tick, 50);
  })();

  /* ---------------------------------------------------------
     2. CUSTOM CURSOR - Removed for better accessibility
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
     3. THEME TOGGLE (Light / Dark)
  --------------------------------------------------------- */
  (function themeToggle() {
    const btn = document.getElementById('themeToggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('sp-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('sp-theme', next);
    });
  })();

  /* ---------------------------------------------------------
     4. NAV: scroll state, active link, mobile burger
  --------------------------------------------------------- */
  (function nav() {
    const navEl      = document.getElementById('nav');
    const burger     = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('navMobile');

    window.addEventListener('scroll', () => {
      navEl.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive: true });

    burger.addEventListener('click', () => {
      burger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
      });
    });

    // Active nav link on scroll
    const sections  = document.querySelectorAll('main section[id]');
    const navLinks  = document.querySelectorAll('[data-nav]');
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle('is-active', l.dataset.nav === entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => navObs.observe(s));
  })();

  /* ---------------------------------------------------------
     5. HERO TYPING ANIMATION
  --------------------------------------------------------- */
  (function typing() {
    const el    = document.getElementById('typedRole');
    const roles = [
      'AI / ML Engineer',
      'Computer Vision Engineer',
      'Deep Learning Researcher',
      'Real-Time Systems Builder',
      'AI Intern @ HCL Technologies'
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;

    const speed = () => deleting ? 30 : 60;

    const step = () => {
      const current = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) { deleting = true; setTimeout(step, 1600); return; }
      } else {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
      }
      setTimeout(step, speed());
    };
    step();
  })();

  /* ---------------------------------------------------------
     6. PARTICLE CANVAS — Hero (indigo/cyan constellation)
  --------------------------------------------------------- */
  (function particles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    let w, h, pArr = [];
    const mouse = { x: null, y: null, active: false };

    // Color stops
    const colors = ['rgba(108,99,255,', 'rgba(0,212,255,', 'rgba(255,107,107,'];

    function resize() {
      w = canvas.width  = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.min(80, Math.floor((w * h) / 15000));
      pArr = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.8 + 0.5,
        c:  colors[Math.floor(Math.random() * colors.length)]
      }));
    }

    function draw() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);
      pArr.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            const f = (150 - d) / 150;
            p.x += (dx / d) * f * 1.5;
            p.y += (dy / d) * f * 1.5;
          }
        }
      });

      for (let i = 0; i < pArr.length; i++) {
        for (let j = i + 1; j < pArr.length; j++) {
          const a = pArr[i], b = pArr[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth   = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      pArr.forEach(p => {
        ctx.fillStyle = p.c + '0.65)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      if (!reducedMotion && isVisible) requestAnimationFrame(draw);
    }

    let isVisible = true;
    const heroObs = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) draw();
    });
    heroObs.observe(hero);

    resize();
    window.addEventListener('resize', resize);
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active = true;
    });
    hero.addEventListener('mouseleave', () => mouse.active = false);
    draw();
  })();

  /* ---------------------------------------------------------
     7. HERO 3D CARD PARALLAX
  --------------------------------------------------------- */
  (function heroCard() {
    if (isMobile) return;
    const card = document.getElementById('heroCard3d');
    if (!card) return;
    const inner = card.querySelector('.holo-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -10;
      const ry = ((x - cx) / cx) * 10;
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
      inner.style.boxShadow = `${ry * -1}px ${rx}px 60px rgba(108,99,255,0.3)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
      inner.style.boxShadow = '';
    });
  })();

  /* ---------------------------------------------------------
     8. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  (function scrollReveal() {
    const items = document.querySelectorAll('.reveal-up');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stack delays for sibling items
          setTimeout(() => entry.target.classList.add('is-revealed'), i * 50 % 300);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    items.forEach(el => io.observe(el));
  })();

  /* ---------------------------------------------------------
     9. ANIMATED COUNTERS (about section stats)
  --------------------------------------------------------- */
  (function counters() {
    const nums = document.querySelectorAll('.stat-card-num');
    const animate = (el) => {
      const target  = parseFloat(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const decimal = target % 1 !== 0;
      const dur     = 1600;
      const start   = performance.now();

      const frame = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = (decimal ? (target * e).toFixed(1) : Math.floor(target * e)) + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = (decimal ? target.toFixed(1) : target) + suffix;
      };
      requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  })();

  /* ---------------------------------------------------------
     10. SKILL BARS + PROJECT METRIC BARS
  --------------------------------------------------------- */
  (function bars() {
    const fills = document.querySelectorAll('.skill-bar-fill, .project-metric-fill');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => io.observe(f));
  })();

  /* ---------------------------------------------------------
     11. PROJECT CARD 3D TILT + GLOW
  --------------------------------------------------------- */
  (function tiltCards() {
    if (isMobile) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const rX = ((y - cy) / cy) * -6;
        const rY = ((x - cx) / cx) * 6;
        card.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px)`;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

  /* ---------------------------------------------------------
     12. TIMELINE PROGRESS LINE
  --------------------------------------------------------- */
  (function timelineProgress() {
    const wrap = document.querySelector('.timeline-wrap');
    const fill = document.getElementById('timelineFill');
    if (!wrap || !fill) return;

    const update = () => {
      const rect  = wrap.getBoundingClientRect();
      const total = rect.height;
      const vis   = Math.min(Math.max(window.innerHeight * 0.7 - rect.top, 0), total);
      fill.style.height = total > 0 ? (vis / total) * 100 + '%' : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------------------------------------------------
     13. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  (function ripple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect   = this.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        const span   = document.createElement('span');
        span.className = 'ripple';
        span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
        this.appendChild(span);
        setTimeout(() => span.remove(), 650);
      });
    });
  })();

  /* ---------------------------------------------------------
     14. MAGNETIC BUTTON EFFECT - Removed for usability
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
     15. CONTACT FORM VALIDATION
  --------------------------------------------------------- */
  (function contactForm() {
    const form   = document.getElementById('contactForm');
    if (!form) return;
    const success     = document.getElementById('formSuccess');
    const submitLabel = document.getElementById('submitLabel');
    const submitBtn   = document.getElementById('submitBtn');

    const fields = {
      name:    { el: document.getElementById('formName'),    validate: v => v.trim().length >= 2 },
      email:   { el: document.getElementById('formEmail'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      message: { el: document.getElementById('formMessage'), validate: v => v.trim().length >= 8 }
    };

    const validateField = (key) => {
      const { el, validate } = fields[key];
      const group = el.closest('.form-group');
      const valid = validate(el.value);
      group.classList.toggle('has-error', !valid);
      return valid;
    };

    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.closest('.form-group').classList.contains('has-error')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allValid = Object.keys(fields).every(key => validateField(key));
      if (!allValid) { success.classList.remove('is-visible'); return; }

      submitBtn.classList.add('is-sending');
      submitLabel.textContent = 'Sending…';

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          submitBtn.classList.remove('is-sending');
          submitLabel.textContent = 'Send Message';
          success.classList.add('is-visible');
          form.reset();
          Object.keys(fields).forEach(key => fields[key].el.closest('.form-group').classList.remove('has-error'));
          setTimeout(() => success.classList.remove('is-visible'), 5000);
        } else {
          submitBtn.classList.remove('is-sending');
          submitLabel.textContent = 'Send Message';
          alert('Oops! There was a problem submitting your form');
        }
      }).catch(error => {
        submitBtn.classList.remove('is-sending');
        submitLabel.textContent = 'Send Message';
        alert('Oops! There was a problem submitting your form');
      });
    });
  })();

  /* ---------------------------------------------------------
     16. HERO BADGE ENTRANCE + FOOTER YEAR
  --------------------------------------------------------- */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  // Trigger hero animations after load
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-revealed'), i * 100);
    });
  }, 400);

  /* ---------------------------------------------------------
     17. SMOOTH PARALLAX ON BLOBS (mouse-driven)
  --------------------------------------------------------- */
  const blobs = document.querySelectorAll('.ambient-blob');
  if (!reducedMotion && !isMobile) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      blobs.forEach((blob, i) => {
        const strength = (i + 1) * 12;
        blob.style.transform = `translate(${dx * strength}px, ${dy * strength * 0.7}px)`;
      });
    });
  }

  // Pause blobs when out of view
  const blobObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-paused');
      } else {
        entry.target.classList.add('is-paused');
      }
    });
  });
  blobs.forEach(b => blobObs.observe(b));

  /* ---------------------------------------------------------
     18. SECTION DIVIDER GLOW ON SCROLL
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('.section');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--sec-opacity', '1');
      } else {
        entry.target.style.setProperty('--sec-opacity', '0');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => secObs.observe(s));

});
