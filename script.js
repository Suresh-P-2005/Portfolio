/* ============================================================
   SURESH P â€” PORTFOLIO v2
   Vanilla JS: loader, cursor, theme toggle, particles,
   typing, scroll reveals, counters, tilt, timeline, form.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 860px)').matches;

  /* ---------------------------------------------------------
     1. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  (function scrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const scrollTop  = window.scrollY || document.documentElement.scrollTop;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const ratio      = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Set initial state
    update();
  })();

  /* ---------------------------------------------------------
     2. CUSTOM CURSOR — lerp-interpolated ring trail
  --------------------------------------------------------- */
  (function customCursor() {
    // Only run on fine-pointer (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (reducedMotion) return;

    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    const LERP = 0.15; // ring follow speed (0 = frozen, 1 = instant)

    let mouseX = 0, mouseY = 0;   // true cursor position (dot target)
    let ringX  = 0, ringY  = 0;   // current interpolated ring position
    let visible = false;

    // Persistent rAF loop — runs every frame, no start/stop overhead
    const tick = () => {
      // Lerp ring toward dot
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;

      dot.style.transform  = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
      ring.style.transform = `translate(calc(-50% + ${ringX.toFixed(2)}px), calc(-50% + ${ringY.toFixed(2)}px))`;

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Track true mouse position
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Reveal on first move (prevents flash at 0,0 on load)
      if (!visible) {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
        visible = true;
      }
    }, { passive: true });

    // Hide when cursor leaves the window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
      visible = false;
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      visible = true;
    });

    // Hover detection via delegation — one listener instead of N
    const HOVER_SELECTOR = 'a, button, .glass-card, [role="button"], label, .tool-chip, .about-chip, .nav-link, .btn-cert';

    document.addEventListener('mouseover', e => {
      if (e.target.closest(HOVER_SELECTOR)) {
        ring.classList.add('is-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', e => {
      if (e.target.closest(HOVER_SELECTOR)) {
        ring.classList.remove('is-hover');
      }
    }, { passive: true });
  })();

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
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('sp-theme', next);
    });
  })();

  /* ---------------------------------------------------------
     4. NAV: scroll state, active link, mobile burger
  --------------------------------------------------------- */
  (function nav() {
    const navEl = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('navMobile');
    const overlay = document.getElementById('navOverlay');

    window.addEventListener('scroll', () => {
      navEl.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive: true });

    const toggleMenu = () => {
      burger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      if (overlay) overlay.classList.toggle('is-open');
    };

    burger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
      });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('[data-nav]');
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
    const el = document.getElementById('typedRole');
    const roles = [
      'AI / ML Engineer',
      'Computer Vision Engineer',
      'Deep Learning Researcher',
      'Real-Time Systems Builder',
      'Former AI Intern @ HCL Technologies'
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
     6. PARTICLE CANVAS â€” Hero (indigo/cyan constellation)
  --------------------------------------------------------- */
  (function particles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    let w, h, pArr = [];
    const mouse = { x: null, y: null, active: false };

    // Floating tech symbols
    const techSymbols = ['{ }', '</>', 'λ', '∑', '🤖', '⚡', '⚙️'];
    let symArr = [];

    // Color stops
    const colors = ['rgba(108,99,255,', 'rgba(0,212,255,', 'rgba(255,107,107,'];

    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.min(80, Math.floor((w * h) / 15000));
      pArr = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.5,
        c: colors[Math.floor(Math.random() * colors.length)]
      }));

      // Initialize tech symbols
      const symCount = Math.min(15, Math.floor((w * h) / 40000));
      symArr = Array.from({ length: symCount }, () => ({
        x: Math.random() * w, 
        y: Math.random() * h + h / 2, // Start lower
        vx: (Math.random() - 0.5) * 0.2, 
        vy: - (Math.random() * 0.5 + 0.2), // Drift upwards
        text: techSymbols[Math.floor(Math.random() * techSymbols.length)],
        c: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 12 // 12px to 20px
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
          const d = Math.sqrt(dx * dx + dy * dy);
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
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      pArr.forEach(p => {
        ctx.fillStyle = p.c + '0.65)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      // Draw and animate tech symbols
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      symArr.forEach(s => {
        s.x += s.vx; 
        s.y += s.vy;
        
        // Wrap horizontally and respawn vertically
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -30) {
          s.y = h + 30;
          s.x = Math.random() * w;
        }

        // Dodge cursor interactively
        if (mouse.active) {
          const dx = s.x - mouse.x, dy = s.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const f = (120 - d) / 120;
            s.x += (dx / d) * f * 3;
            s.y += (dy / d) * f * 3;
          }
        }

        ctx.font = `${s.size}px monospace`;
        ctx.fillStyle = s.c + '0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.c + '0.8)';
        ctx.fillText(s.text, s.x, s.y);
        ctx.shadowBlur = 0; // reset
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
    let lastCanvasWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth !== lastCanvasWidth) {
        lastCanvasWidth = window.innerWidth;
        resize();
      }
    });
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
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
  })();

  /* ---------------------------------------------------------
     8b. MAGNETIC BUTTON EFFECT
  --------------------------------------------------------- */
  (function magneticButtons() {
    if (isMobile || reducedMotion) return;

    const STRENGTH   = 0.38;  // how far the button pulls (fraction of half-size)
    const MAX_PX     = 12;    // hard cap in pixels
    const LERP_IN    = 0.18;  // interpolation speed while hovering (0–1)
    const LERP_OUT   = 0.10;  // interpolation speed on snap-back

    const btns = document.querySelectorAll('.btn, .nav-cta, .nav-resume');

    btns.forEach(btn => {
      let rafId      = null;
      let targetX    = 0, targetY = 0;
      let currentX   = 0, currentY = 0;
      let isHovering = false;

      const lerp = (a, b, t) => a + (b - a) * t;
      const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

      function tick() {
        const lerpFactor = isHovering ? LERP_IN : LERP_OUT;
        currentX = lerp(currentX, targetX, lerpFactor);
        currentY = lerp(currentY, targetY, lerpFactor);

        btn.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;

        // Keep running until settled (within 0.05px of target)
        if (Math.abs(currentX - targetX) > 0.05 || Math.abs(currentY - targetY) > 0.05) {
          rafId = requestAnimationFrame(tick);
        } else {
          // Snap exactly to target and stop
          btn.style.transform = targetX === 0 && targetY === 0
            ? ''
            : `translate(${targetX}px, ${targetY}px)`;
          rafId = null;
        }
      }

      function startLoop() {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
      }

      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = e.clientX - cx;
        const dy   = e.clientY - cy;

        targetX = clamp(dx * STRENGTH, -MAX_PX, MAX_PX);
        targetY = clamp(dy * STRENGTH, -MAX_PX, MAX_PX);
        isHovering = true;

        startLoop();
      });

      btn.addEventListener('mouseleave', () => {
        targetX    = 0;
        targetY    = 0;
        isHovering = false;
        startLoop();
      });
    });
  })();

  /* ---------------------------------------------------------
     9. ANIMATED COUNTERS (about section stats)
  --------------------------------------------------------- */
  (function counters() {
    const nums = document.querySelectorAll('.stat-card-num');
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimal = target % 1 !== 0;
      const dur = 1600;
      const start = performance.now();

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
     11. PROJECT CARD 3D TILT + GLARE
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
        // Feed both the ambient glow element and ::after glare
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        // Move glare off-canvas so it doesn't linger at last cursor position
        card.style.setProperty('--mx', '-999px');
        card.style.setProperty('--my', '-999px');
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
      const rect = wrap.getBoundingClientRect();
      const total = rect.height;
      const vis = Math.min(Math.max(window.innerHeight * 0.7 - rect.top, 0), total);
      fill.style.height = total > 0 ? (vis / total) * 100 + '%' : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------------------------------------------------
     12b. TIMELINE ACTIVE ITEM — lights up centered era
  --------------------------------------------------------- */
  (function timelineActiveItem() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    // rootMargin: clip top & bottom by 35% — only the middle 30% triggers
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    }, {
      rootMargin: '-35% 0px -35% 0px',
      threshold:  0
    });

    items.forEach(item => io.observe(item));
  })();

  /* ---------------------------------------------------------
     13. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  (function ripple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const span = document.createElement('span');
        span.className = 'ripple';
        span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
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
    const form = document.getElementById('contactForm');
    if (!form) return;
    const success = document.getElementById('formSuccess');
    const submitLabel = document.getElementById('submitLabel');
    const submitBtn = document.getElementById('submitBtn');

    const fields = {
      name: { el: document.getElementById('formName'), validate: v => v.trim().length >= 2 },
      email: { el: document.getElementById('formEmail'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
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
      submitLabel.textContent = 'Sendingâ€¦';

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


  /* ---------------------------------------------------------

  /* ---------------------------------------------------------
     19. WORKFLOW MODAL — 3D holographic pipeline diagrams
  --------------------------------------------------------- */
  (function workflowModal() {

    /* ====================================================
       PROJECT WORKFLOW DATA
       p1 uses a rich 6-stage ISL architecture object;
       p2–p4 use the compact 4-step format.
    ==================================================== */
    const WORKFLOWS = {

      /* ---- P1: ISL — 6-stage dual-branch architecture ---- */
      p1: {
        title: 'ISL — Indian Sign Language Recognition & Translation',
        type: 'isl',   /* signals the custom renderer */
        stages: [
          {
            num: 'STAGE 01',
            icon: '📹',
            title: 'Client-side Ingestion',
            detail: 'WebRTC / Webcam stream at 60 FPS captured via HTML5 canvas & streamed to FastAPI over WebSocket / HTTP POST.',
            chip: 'WebRTC · HTML5 Canvas · FastAPI'
          },
          {
            num: 'STAGE 02',
            icon: '🖐',
            title: 'MediaPipe 3D Landmark Core',
            detail: 'Real-time coordinate normalisation extracting 21 3D landmarks per hand — up to 126 skeletal coordinates / frame.',
            chip: '[126, 1] coords · MediaPipe Holistic'
          },
          {
            num: 'STAGE 03',
            icon: null,   /* rendered as a fork */
            title: 'Hybrid Inference Engine',
            isFork: true,
            branches: [
              {
                badge: 'static',
                label: 'STATIC BRANCH',
                title: '⚡ 1D CNN + Random Forest',
                chip: 'Sub-ms · Frame-level'
              },
              {
                badge: 'dynamic',
                label: 'DYNAMIC BRANCH',
                title: '🔄 BiLSTM Sequence Net',
                chip: '[30, 126] · Temporal buffer'
              }
            ]
          },
          {
            num: 'STAGE 04',
            icon: '🤖',
            title: 'LLM Grammar Correction',
            detail: 'Local Phi-3 Mini SLM via LM Studio formats raw gesture predictions into syntactically valid English sentences.',
            chip: 'Phi-3 Mini · LM Studio (offline)'
          },
          {
            num: 'STAGE 05',
            icon: '🌐',
            title: 'Translation Layer',
            detail: 'Cross-lingual mapping module translating synthesised English into 11 regional languages (Tamil, Hindi, Telugu…).',
            chip: '11 Languages · i18n pipeline'
          },
          {
            num: 'STAGE 06',
            icon: '🔊',
            title: 'Multimodal Output',
            detail: 'Real-time live HUD overlay on the web client + vocal output via the Web Speech Synthesis API.',
            chip: 'Web Speech API · HUD Overlay'
          }
        ]
      },

      /* ---- P4: ANPR ---- */
      p4: {
        title: 'ANPR — Automatic Number Plate Recognition',
        type: 'isl', /* Use detailed 3D renderer */
        stages: [
          {
            num: 'STAGE 01',
            icon: '📡',
            title: 'Multi-Modal Input Stream',
            detail: 'Handles static images, video uploads, live webcams, and RTSP IP camera streams routed securely via FastAPI and WebSockets.',
            chip: 'WebRTC · FastAPI · RTSP'
          },
          {
            num: 'STAGE 02',
            icon: '🚗',
            title: 'YOLOv11 Vehicle Model',
            detail: 'Primary YOLOv11 inference (vehicle_best.pt) applied to the full frame to identify and localize vehicles (cars, trucks, motorcycles).',
            chip: 'vehicle_best.pt · YOLOv11'
          },
          {
            num: 'STAGE 03',
            icon: '🎯',
            title: 'YOLOv11 Plate Model',
            detail: 'Secondary YOLOv11 inference (plate_best.pt) processes the cropped vehicle Region of Interest (ROI) to pinpoint the exact license plate bounding box.',
            chip: 'plate_best.pt · YOLOv11'
          },
          {
            num: 'STAGE 04',
            icon: '⚙️',
            title: 'OpenCV Enhancement Pipeline',
            detail: 'Prepares the plate crop for OCR using 4x cubic super-resolution (cv2.INTER_CUBIC), grayscale conversion, and CLAHE adaptive equalization.',
            chip: 'cv2.INTER_CUBIC · CLAHE'
          },
          {
            num: 'STAGE 05',
            icon: '🔠',
            title: 'EasyOCR Extraction',
            detail: 'Scans the enhanced, high-contrast plate crop to extract raw alphanumeric text strings and confidence scores.',
            chip: 'EasyOCR · Confidence Score'
          },
          {
            num: 'STAGE 06',
            icon: '✅',
            title: 'Regex Validation & Logging',
            detail: 'Applies heuristic character correction, structural Regex validation, pushes real-time UI updates, and logs data to CSV/Video outputs.',
            chip: 'Regex · plate_validator.py'
          }
        ]
      },

      /* ---- P3: Gourmet AI ---- */
      p3: {
        title: 'Gourmet AI — Smart Recipe Generation',
        type: 'isl', /* Use detailed 3D renderer */
        stages: [
          {
            num: 'STAGE 01',
            icon: '🎙️',
            title: 'Client Browser APIs',
            detail: 'Captures user input via standard text, voice dictation (Web Speech API), or live ingredient snapshots via camera (WebRTC getUserMedia).',
            chip: 'Multimodal Input Capture'
          },
          {
            num: 'STAGE 02',
            icon: '⚡',
            title: 'FastAPI Backend',
            detail: 'Asynchronous REST API receives payloads and validates incoming request schemas using Pydantic models.',
            chip: 'API Dispatch & Validation'
          },
          {
            num: 'STAGE 03',
            icon: '👁️',
            title: 'Gemini Vision API',
            detail: 'Base64 image frames are routed to the vision_service to automatically identify and extract visible food items/ingredients.',
            chip: 'Vision Analysis (Optional Branch)'
          },
          {
            num: 'STAGE 04',
            icon: '🧠',
            title: 'Gemini 2.0 Flash',
            detail: 'The ai_service constructs specialized prompts and queries the Google Generative AI API to structure a complete recipe (title, timing, steps).',
            chip: 'Generative Recipe Synthesis'
          },
          {
            num: 'STAGE 05',
            icon: '💾',
            title: 'Async SQLite Database',
            detail: 'The recipe_db_service executes asynchronous CRUD operations via aiosqlite to store generated recipes for user history.',
            chip: 'Data Persistence'
          },
          {
            num: 'STAGE 06',
            icon: '🍽️',
            title: 'Dynamic DOM Rendering',
            detail: 'JSON responses are dynamically rendered into the custom Glassmorphism UI, supporting dark mode and responsive layouts.',
            chip: 'Interactive Presentation'
          }
        ]
      },

      /* ---- P2: PPE Guard ---- */
      p2: {
        title: 'PPE Guard — Real-Time Safety Inspection',
        type: 'isl', /* Use detailed 3D renderer */
        stages: [
          {
            num: 'STAGE 01',
            icon: '📡',
            title: 'Async Input Stream',
            detail: 'Handles static media via RESTful endpoints and high-throughput bidirectional live camera feeds via WebSockets.',
            chip: 'Data Ingestion & Routing'
          },
          {
            num: 'STAGE 02',
            icon: '⚙️',
            title: 'Zero-Buffer CV Pipeline',
            detail: 'Asynchronous threaded ingestion prevents frame backlog while OpenCV resizes and normalizes frames (imgsz=800) for high-precision micro-PPE detection.',
            chip: 'Preprocessing & Threading'
          },
          {
            num: 'STAGE 03',
            icon: '🧠',
            title: 'YOLOv8 Nano (CUDA)',
            detail: 'Preprocessed frames process through a custom YOLOv8 model using PyTorch FP16 half-precision tensors and Non-Maximum Suppression (NMS) on NVIDIA GPUs.',
            chip: 'AI Inference Engine'
          },
          {
            num: 'STAGE 04',
            icon: '🛡️',
            title: 'Dynamic Compliance Logic',
            detail: 'Detected classes (Helmet, Vest, Gloves) are cross-referenced against a thread-safe global policy_state to flag missing mandatory safety gear in real-time.',
            chip: 'State & Policy Enforcement'
          },
          {
            num: 'STAGE 05',
            icon: '🖥️',
            title: 'Cyber-Industrial UI',
            detail: 'JSON and Base64 results stream back to the client, dynamically rendering a live 3D-accelerated dashboard utilizing Vanilla JS, GSAP micro-animations, and Three.js.',
            chip: 'Client Delivery & 3D HUD'
          }
        ]
      }
    };

    /* ====================================================
       DOM REFS
    ==================================================== */
    const modal = document.getElementById('workflowModal');
    const container = document.getElementById('workflowContainer');
    const closeBtn = document.getElementById('workflowModalClose');
    const modalTitle = document.getElementById('workflowModalTitle');
    const isMobileWF = () => window.innerWidth <= 860;
    if (!modal || !container || !closeBtn) return;

    /* ====================================================
       BUILD: ISL 6-STAGE HOLOGRAPHIC PIPELINE
    ==================================================== */
    function buildISL(data) {
      const board = document.createElement('div');
      board.className = 'workflow-board';
      const inner = document.createElement('div');
      inner.className = 'workflow-board-inner';
      board.appendChild(inner);

      const track = document.createElement('div');
      track.className = 'workflow-track';
      inner.appendChild(track);

      data.stages.forEach((stage, idx) => {

        if (stage.isFork) {
          /* ---- Connector before fork ---- */
          track.appendChild(makePipeArrow());

          /* ---- Fork container ---- */
          const fork = document.createElement('div');
          fork.className = 'pipeline-fork';

          const forkLabel = document.createElement('div');
          forkLabel.className = 'fork-label';
          forkLabel.textContent = stage.title;
          fork.appendChild(forkLabel);

          const forkBranches = document.createElement('div');
          forkBranches.className = 'fork-branches';

          stage.branches.forEach(br => {
            const branch = document.createElement('div');
            branch.className = 'fork-branch';
            branch.setAttribute('role', 'button');
            branch.setAttribute('tabindex', '0');
            branch.innerHTML = `
              <span class="branch-badge ${br.badge}">${br.label}</span>
              <div class="branch-title">${br.title}</div>
              <div class="branch-chip">${br.chip}</div>
            `;
            branch.addEventListener('click', () => {
              const wasActive = branch.classList.contains('is-active');
              fork.querySelectorAll('.fork-branch').forEach(b => b.classList.remove('is-active'));
              if (!wasActive) branch.classList.add('is-active');
            });
            branch.addEventListener('keydown', e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); branch.click(); }
            });
            forkBranches.appendChild(branch);
          });

          fork.appendChild(forkBranches);
          track.appendChild(fork);

        } else {
          /* ---- Connector (not before first stage) ---- */
          if (idx > 0) track.appendChild(makePipeArrow());

          /* ---- Stage card — icon in col 1, rest in col 2 ---- */
          const card = document.createElement('div');
          card.className = 'pipeline-stage';
          card.setAttribute('role', 'button');
          card.setAttribute('tabindex', '0');
          card.setAttribute('aria-label', `${stage.num}: ${stage.title}`);

          /* Grid: col 1 = icon (spans all rows), col 2 = num / title / detail / chip */
          card.innerHTML = `
            <div class="stage-icon">${stage.icon}</div>
            <div class="stage-num">${stage.num}</div>
            <div class="stage-title">${stage.title}</div>
            <div class="stage-detail">${stage.detail}</div>
            <div class="stage-chip">${stage.chip}</div>
          `;

          card.addEventListener('click', () => {
            const wasActive = card.classList.contains('is-active');
            inner.querySelectorAll('.pipeline-stage').forEach(s => s.classList.remove('is-active'));
            if (!wasActive) card.classList.add('is-active');
          });
          card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
          });

          track.appendChild(card);
        }
      });

      container.appendChild(board);
    }

    /* ====================================================
       BUILD: SIMPLE 4-STEP PIPELINE (p2, p3, p4)
    ==================================================== */
    function buildSimple(data) {
      const board = document.createElement('div');
      board.className = 'workflow-board';
      const inner = document.createElement('div');
      inner.className = 'workflow-board-inner';
      board.appendChild(inner);

      const track = document.createElement('div');
      track.className = 'workflow-track';
      inner.appendChild(track);

      data.steps.forEach((step, idx) => {
        if (idx > 0) track.appendChild(makePipeArrow());

        const card = document.createElement('div');
        card.className = 'pipeline-stage';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Step ${idx + 1}: ${step.label}`);
        /* Icon col 1, metadata col 2 */
        card.innerHTML = `
          <div class="stage-icon">${step.icon}</div>
          <div class="stage-num">STAGE 0${idx + 1}</div>
          <div class="stage-title">${step.label}</div>
          <div class="stage-chip">${step.tech}</div>
        `;
        card.addEventListener('click', () => {
          const wasActive = card.classList.contains('is-active');
          inner.querySelectorAll('.pipeline-stage').forEach(s => s.classList.remove('is-active'));
          if (!wasActive) card.classList.add('is-active');
        });
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
        track.appendChild(card);
      });

      container.appendChild(board);
    }

    /* ====================================================
       HELPER: animated pipe arrow element
    ==================================================== */
    function makePipeArrow() {
      const arrow = document.createElement('div');
      arrow.className = 'pipe-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<div class="pipe-arrow-track"></div>';
      return arrow;
    }

    /* ====================================================
       BUILD DIAGRAM DISPATCHER
    ==================================================== */
    function buildDiagram(key) {
      const data = WORKFLOWS[key];
      if (!data) return;
      modalTitle.textContent = data.title;
      container.innerHTML = '';
      if (data.type === 'isl') {
        buildISL(data);
      } else {
        buildSimple(data);
      }
    }

    /* ====================================================
       OPEN / CLOSE
    ==================================================== */
    function openModal(key) {
      buildDiagram(key);
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtn.focus(), 60);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      /* Remove parallax listeners by clearing innerHTML after transition */
      setTimeout(() => { container.innerHTML = ''; }, 450);
    }

    /* ====================================================
       EVENT LISTENERS
    ==================================================== */
    document.querySelectorAll('.btn-workflow').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.workflow;
        if (key && WORKFLOWS[key]) openModal(key);
      });
    });

    closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

  })();

});
