/* ============================================================
   SURESH P — PORTFOLIO
   Vanilla JS: loader, cursor, particles, typing, scroll reveals,
   counters, tilt cards, timeline progress, form validation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. LOADER
  --------------------------------------------------------- */
  (function loader(){
    const loaderEl = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    const pct = document.getElementById('loaderPct');
    let progress = 0;

    const tick = () => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) progress = 100;
      fill.style.width = progress + '%';
      pct.textContent = String(Math.floor(progress)).padStart(2,'0') + '%';
      if (progress < 100){
        setTimeout(tick, 90 + Math.random()*90);
      } else {
        setTimeout(() => {
          loaderEl.classList.add('is-done');
          document.body.style.overflow = '';
        }, 250);
      }
    };
    document.body.style.overflow = 'hidden';
    setTimeout(tick, 200);
    // safety net
    setTimeout(() => { loaderEl.classList.add('is-done'); document.body.style.overflow=''; }, 3200);
  })();

  /* ---------------------------------------------------------
     2. CUSTOM CURSOR
  --------------------------------------------------------- */
  if (!reducedMotion && window.matchMedia('(min-width: 861px)').matches){
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .project-card, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------------------------------------------------------
     3. NAV: scroll state, active link, mobile burger
  --------------------------------------------------------- */
  (function nav(){
    const navEl = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('navMobile');

    window.addEventListener('scroll', () => {
      navEl.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive:true });

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

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('[data-nav]');
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          navLinks.forEach(l => l.classList.toggle('is-active', l.dataset.nav === entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));
  })();

  /* ---------------------------------------------------------
     4. HERO TYPING ANIMATION
  --------------------------------------------------------- */
  (function typing(){
    const el = document.getElementById('typedRole');
    const roles = [
      'AI / ML Engineer',
      'Computer Vision Engineer',
      'Deep Learning Practitioner',
      'Real-Time Systems Builder'
    ];
    let roleIndex = 0, charIndex = 0, deleting = false;

    const speed = () => deleting ? 35 : 65;

    const step = () => {
      const current = roles[roleIndex];
      if (!deleting){
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length){
          deleting = true;
          setTimeout(step, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0){
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(step, speed());
    };
    step();
  })();

  /* ---------------------------------------------------------
     5. HERO PARTICLE CANVAS (constellation network)
  --------------------------------------------------------- */
  (function particles(){
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    let w, h, particlesArr = [];
    const mouse = { x: null, y: null, active:false };

    function resize(){
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.min(70, Math.floor((w*h)/18000));
      particlesArr = Array.from({length:count}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
        r: Math.random()*1.6 + 0.6
      }));
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = 'rgba(94,255,143,0.55)';

      particlesArr.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (mouse.active){
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 140){
            const force = (140 - dist) / 140;
            p.x += (dx/dist) * force * 1.2;
            p.y += (dy/dist) * force * 1.2;
          }
        }
      });

      // connecting lines
      for (let i = 0; i < particlesArr.length; i++){
        for (let j = i+1; j < particlesArr.length; j++){
          const a = particlesArr[i], b = particlesArr[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 110){
            ctx.strokeStyle = `rgba(94,255,143,${0.12 * (1 - dist/110)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particlesArr.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });

      if (!reducedMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active = true;
    });
    hero.addEventListener('mouseleave', () => mouse.active = false);

    if (!reducedMotion){ draw(); } else { draw(); }
  })();

  /* ---------------------------------------------------------
     6. HERO DETECTION BOX — follows cursor inside hero
  --------------------------------------------------------- */
  (function heroScan(){
    if (window.matchMedia('(max-width: 860px)').matches) return;
    const hero = document.querySelector('.hero');
    const scan = document.getElementById('heroScan');
    const coords = document.getElementById('heroCoords');
    const confVal = document.getElementById('confidenceVal');
    let raf = null;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      scan.classList.add('is-visible');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        scan.style.left = (x - 80) + 'px';
        scan.style.top = (y - 80) + 'px';
      });
      coords.textContent = `x:${String(Math.floor(x)).padStart(4,'0')} y:${String(Math.floor(y)).padStart(4,'0')}`;
      const conf = (96 + Math.random()*3).toFixed(1);
      confVal.textContent = conf;
    });

    hero.addEventListener('mouseleave', () => scan.classList.remove('is-visible'));
  })();

  /* ---------------------------------------------------------
     7. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  (function scrollReveal(){
    const items = document.querySelectorAll('.reveal-box');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting){
          setTimeout(() => entry.target.classList.add('is-revealed'), i * 40 % 200);
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
    items.forEach(item => io.observe(item));
  })();

  /* ---------------------------------------------------------
     8. ANIMATED COUNTERS (about section stats)
  --------------------------------------------------------- */
  (function counters(){
    const nums = document.querySelectorAll('.about-card-num');
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1400;
      const start = performance.now();

      const frame = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      };
      requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.5 });
    nums.forEach(n => io.observe(n));
  })();

  /* ---------------------------------------------------------
     9. SKILL BARS + PROJECT METRIC BARS
  --------------------------------------------------------- */
  (function bars(){
    const fills = document.querySelectorAll('.skill-bar-fill, .project-metric-fill');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.style.width = entry.target.dataset.width + '%';
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.4 });
    fills.forEach(f => io.observe(f));
  })();

  /* ---------------------------------------------------------
     10. PROJECT CARD 3D TILT + GLOW
  --------------------------------------------------------- */
  (function tiltCards(){
    if (window.matchMedia('(max-width: 860px)').matches) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  })();

  /* ---------------------------------------------------------
     11. TIMELINE PROGRESS LINE
  --------------------------------------------------------- */
  (function timelineProgress(){
    const wrap = document.querySelector('.timeline-wrap');
    const fill = document.getElementById('timelineFill');
    if (!wrap || !fill) return;

    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      fill.style.height = pct + '%';
    };
    window.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------------------------------------------------
     12. BUTTON RIPPLE EFFECT
  --------------------------------------------------------- */
  (function ripple(){
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e){
        const rect = this.getBoundingClientRect();
        const circle = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        circle.className = 'ripple';
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size/2) + 'px';
        circle.style.top = (e.clientY - rect.top - size/2) + 'px';
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
      });
    });
  })();

  /* ---------------------------------------------------------
     13. CONTACT FORM VALIDATION
  --------------------------------------------------------- */
  (function contactForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    const success = document.getElementById('formSuccess');
    const submitLabel = document.getElementById('submitLabel');
    const submitBtn = form.querySelector('.btn-submit');

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
        if (fields[key].el.closest('.form-group').classList.contains('has-error')){
          validateField(key);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allValid = Object.keys(fields).every(key => validateField(key));
      if (!allValid){
        success.classList.remove('is-visible');
        return;
      }

      submitBtn.classList.add('is-sending');
      submitLabel.textContent = 'Sending…';

      setTimeout(() => {
        submitBtn.classList.remove('is-sending');
        submitLabel.textContent = 'Send message';
        success.classList.add('is-visible');
        form.reset();
        Object.keys(fields).forEach(key => fields[key].el.closest('.form-group').classList.remove('has-error'));
        setTimeout(() => success.classList.remove('is-visible'), 5000);
      }, 900);
    });
  })();

  /* ---------------------------------------------------------
     14. FOOTER YEAR
  --------------------------------------------------------- */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

});
