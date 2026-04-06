// ══════════════════════════════════════════
//   SAYALI JADHAV — PORTFOLIO  |  script.js
//   Unified Floating Particle Background
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════
  //  PARTICLE CANVAS — Full-page system
  // ══════════════════════════════════════
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 110;
  const COLORS = ['#00f5ff', '#6366f1', '#a855f7', '#00f5ff', '#ffffff'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x  = Math.random() * (W || window.innerWidth);
      this.y  = init ? Math.random() * (H || window.innerHeight) : -10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = Math.random() * 0.35 + 0.1;
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2; // phase offset
    }

    update() {
      this.pulse += 0.018;
      const pulseAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx += (dx / dist) * force * 0.6;
        this.vy += (dy / dist) * force * 0.6;
      }

      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      if (Math.abs(this.vy) < 0.08) this.vy = 0.08;

      this.x += this.vx;
      this.y += this.vy;
      this._drawAlpha = pulseAlpha;

      if (this.y > H + 10 || this.x < -20 || this.x > W + 20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this._drawAlpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.r > 1.2 ? 8 : 0;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawConnections() {
    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  initParticles();
  animate();


  // ══════════════════════════════════════
  //  NAVBAR SCROLL
  // ══════════════════════════════════════
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });


  // ══════════════════════════════════════
  //  MOBILE NAV TOGGLE
  // ══════════════════════════════════════
  const toggle = document.getElementById('navToggle');
  const menu   = document.querySelector('.nav-menu');
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });


  // ══════════════════════════════════════
  //  SCROLL REVEAL
  // ══════════════════════════════════════
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));


  // ══════════════════════════════════════
  //  SKILLS — DYNAMIC PROGRESS SYSTEM
  // ══════════════════════════════════════

  // 1) Auto-set --ring CSS var on badges from data-val
  document.querySelectorAll('.bento-badge.skill-item').forEach(badge => {
    const val = badge.getAttribute('data-val');
    if (val) badge.style.setProperty('--ring', val);
  });

  // 2) Scroll-triggered animated bar fills for Languages
  const langBars = document.querySelectorAll('.lang-bar');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  langBars.forEach(bar => barObserver.observe(bar));

  // 3) Skill items click-to-show progress tooltip
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = item.classList.contains('show-progress');
      skillItems.forEach(other => other.classList.remove('show-progress'));
      if (!isShowing) item.classList.add('show-progress');
    });
  });
  document.addEventListener('click', () => {
    skillItems.forEach(item => item.classList.remove('show-progress'));
  });

  // ══════════════════════════════════════
  //  SCROLL TOP
  // ══════════════════════════════════════
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ══════════════════════════════════════
  //  ACTIVE NAV LINK
  // ══════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cyan)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => activeObs.observe(s));

  // ══════════════════════════════════════
  //  CONTACT FORM (AJAX for Web3Forms)
  // ══════════════════════════════════════
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (res.status === 200) {
          formMsg.textContent = '✓ Message sent successfully!';
          formMsg.style.color = 'var(--cyan)';
          form.reset();
        } else {
          formMsg.textContent = result.message || 'Something went wrong. Please try again.';
          formMsg.style.color = 'var(--purple)';
        }
      } catch (err) {
        formMsg.textContent = 'Network error. Please try again.';
        formMsg.style.color = 'var(--purple)';
      }

      btn.innerHTML = originalText;
      btn.disabled = false;
      setTimeout(() => { formMsg.textContent = ''; }, 5000);
    });
  }


  // ══════════════════════════════════════
  //  TYPING EFFECT — Hero Role
  // ══════════════════════════════════════
  const heroRole = document.querySelector('.hero-role');
  if (heroRole) {
    const fullText = heroRole.textContent;
    heroRole.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    cursor.textContent = '|';
    heroRole.parentNode.insertBefore(cursor, heroRole.nextSibling);

    let charIndex = 0;
    function typeChar() {
      if (charIndex < fullText.length) {
        heroRole.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(typeChar, 45 + Math.random() * 35);
      } else {
        setTimeout(() => { cursor.style.transition = 'opacity 0.5s'; cursor.style.opacity = '0'; }, 3000);
      }
    }
    setTimeout(typeChar, 800);
  }


  // ══════════════════════════════════════
  //  ANIMATED COUNTERS — Hero Stats
  // ══════════════════════════════════════
  const statNums = document.querySelectorAll('.stat-num');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const finalText = el.textContent.trim();
        const match = finalText.match(/^([\d.]+)(.*)$/);
        if (match) {
          const targetVal = parseFloat(match[1]);
          const suffix = match[2] || '';
          const isDecimal = match[1].includes('.');
          const decimals = isDecimal ? (match[1].split('.')[1] || '').length : 0;
          const duration = 1200;
          const startTime = performance.now();

          function animateCount(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = (targetVal * eased);
            el.textContent = (isDecimal ? currentVal.toFixed(decimals) : Math.floor(currentVal)) + suffix;
            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              el.textContent = finalText;
              el.classList.add('counted');
            }
          }
          el.textContent = (isDecimal ? (0).toFixed(decimals) : '0') + suffix;
          requestAnimationFrame(animateCount);
        }
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));


  // ══════════════════════════════════════
  //  HEX CARD TILT EFFECT
  // ══════════════════════════════════════
  const hexCards = document.querySelectorAll('.hex-card');
  hexCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Move glow towards cursor
      const glow = card.querySelector('.hex-card-glow');
      if (glow) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        glow.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, color-mix(in srgb, var(--hex-accent) 12%, transparent), transparent 70%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glow = card.querySelector('.hex-card-glow');
      if (glow) glow.style.background = '';
    });
  });


  // ══════════════════════════════════════
  //  V-TIMELINE — Scroll Animations
  // ══════════════════════════════════════
  // 1. Scroll-driven glowing center line
  const vTimelines = document.querySelectorAll('.v-timeline');
  if (vTimelines.length) {
    window.addEventListener('scroll', () => {
      vTimelines.forEach(tl => {
        const fill = tl.querySelector('.v-timeline-line-fill');
        if (!fill) return;
        const rect = tl.getBoundingClientRect();
        const tlTop = rect.top;
        const tlHeight = rect.height;
        const viewH = window.innerHeight;
        // Calculate how much of the timeline is scrolled past
        const scrolled = viewH - tlTop;
        const pct = Math.min(Math.max(scrolled / tlHeight * 100, 0), 100);
        fill.style.height = pct + '%';
      });
    }, { passive: true });
  }

  // 2. IntersectionObserver for timeline items (slide in from left/right)
  const vtlItems = document.querySelectorAll('.v-tl-item');
  const vtlObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v-tl-visible');
        vtlObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  vtlItems.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
    vtlObs.observe(el);
  });


  // ══════════════════════════════════════
  //  STAGGERED REVEAL — Grid Cards
  // ══════════════════════════════════════
  const grids = document.querySelectorAll('.projects-grid-v2, .events-grid, .ach-grid, .extra-grid, .hex-grid');
  grids.forEach(grid => {
    grid.classList.add('stagger-parent');
    const cards = grid.children;
    Array.from(cards).forEach((card, i) => {
      card.style.setProperty('--i', i);
      // Replace old delay classes with stagger variable
      card.classList.remove('delay-1', 'delay-2');
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
    });
  });
  // Re-observe newly classed reveal elements
  document.querySelectorAll('.stagger-parent .reveal:not(.visible)').forEach(el => revealObs.observe(el));


  // ══════════════════════════════════════
  //  3D TILT — Project Cards V2
  // ══════════════════════════════════════
  const projCards = document.querySelectorAll('.proj-card');
  projCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `translateY(-10px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Move glow towards cursor
      const glow = card.querySelector('.proj-card-glow');
      if (glow) {
        glow.style.top = `${y - 100}px`;
        glow.style.left = `${x - 100}px`;
        glow.style.right = 'auto';
      }
    });
    card.addEventListener('mouseleave', (e) => {
      card.style.transform = '';
      const glow = card.querySelector('.proj-card-glow');
      if (glow) {
        glow.style.top = '';
        glow.style.left = '';
        glow.style.right = '';
      }
    });
  });


  // ══════════════════════════════════════
  //  PROJECT CATEGORY FILTER
  // ══════════════════════════════════════
  const filterPills = document.querySelectorAll('.filter-pill');
  const projCardEls = document.querySelectorAll('.proj-card[data-category]');
  if (filterPills.length) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Update active state
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');

        projCardEls.forEach((card, i) => {
          const cats = card.getAttribute('data-category') || '';
          const show = filter === 'all' || cats.includes(filter);

          if (show) {
            card.classList.remove('filter-hide');
            card.classList.add('filter-show');
            card.style.position = '';
            card.style.visibility = '';
            card.style.animationDelay = `${i * 0.08}s`;
          } else {
            card.classList.remove('filter-show');
            card.classList.add('filter-hide');
          }
        });
      });
    });
  }


  // ══════════════════════════════════════
  //  MAGNETIC CURSOR — Nav CTA
  // ══════════════════════════════════════
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    navCta.addEventListener('mousemove', (e) => {
      const rect = navCta.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      navCta.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    navCta.addEventListener('mouseleave', () => {
      navCta.style.transform = '';
    });
  }


  // ══════════════════════════════════════
  //  PARALLAX — Section Labels
  // ══════════════════════════════════════
  const labels = document.querySelectorAll('.section-label');
  if (labels.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      labels.forEach(label => {
        const rect = label.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (rect.top / window.innerHeight) * 15;
          label.style.transform = `translateY(${offset}px)`;
        }
      });
    }, { passive: true });
  }

});