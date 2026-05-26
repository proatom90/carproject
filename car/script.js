/**
 * VELOCITÉ — Premium Luxury Car Landing
 * Interactions, animations, and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loadingScreen');
  if (!loader) {
    initAll();
    return;
  }

  initLoadingScreen()
    .catch(() => {})
    .finally(() => {
      initAll();
    });
});

function initAll() {
  initNavbar();
  initCursorGlow();
  initParticles();
  initSpeedLines();
  initExhaustTrail();
  initScrollReveal();
  initCounters();
  initPerformanceRings();
  initPerformanceBars();
  initGallery();
  initLightbox();
  initNewsletter();
  initMobileNav();
  initParallax();
}

function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const pctEl = document.getElementById('loadingPct');
  const barFill = document.getElementById('loadingBarFill');
  if (!loadingScreen || !pctEl || !barFill) return Promise.resolve();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const images = [
    'images/car1.jpg',
    'images/car2.jpg',
    'images/car3.jpg',
    'images/car4.jpg',
  ];

  const unique = [...new Set(images)];
  const total = Math.max(1, unique.length);

  let loaded = 0;
  let targetPct = 0;
  let displayed = 0;

  loadingScreen.setAttribute('aria-busy', 'true');

  const start = performance.now();
  const MIN_TIME = reduceMotion ? 400 : 900;

  const tick = () => {
    displayed += (targetPct - displayed) * 0.12;
    pctEl.textContent = `${Math.round(displayed)}`;
    barFill.style.width = `${Math.round(displayed)}%`;

    if (Math.abs(targetPct - displayed) < 0.4 && targetPct >= 100) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  return new Promise((resolve) => {
    const onDone = () => {
      loaded += 1;
      targetPct = Math.min(95, Math.round((loaded / total) * 95));

      if (loaded >= total) {
        targetPct = 100;
        const elapsed = performance.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);

        setTimeout(() => {
          loadingScreen.classList.add('is-loaded');
          loadingScreen.setAttribute('aria-busy', 'false');
          setTimeout(() => resolve(), 650);
        }, wait);
      }
    };

    unique.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = onDone;
      img.onerror = onDone;
      img.src = src;
    });
  });
}

/* ─── Navbar ─── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a, .logo, .nav-cta');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        document.getElementById('navLinks')?.classList.remove('active');
      }
    });
  });
}

/* ─── Cursor Glow ─── */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');

  let x = 0;
  let y = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  function animate() {
    currentX += (x - currentX) * 0.08;
    currentY += (y - currentY) * 0.08;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    if (ring) {
      ring.style.left = `${currentX}px`;
      ring.style.top = `${currentY}px`;
    }
    if (dot) {
      dot.style.left = `${currentX}px`;
      dot.style.top = `${currentY}px`;
    }
    requestAnimationFrame(animate);
  }

  animate();

  // Metallic "active" cursor when hovering interactive controls.
  if (window.matchMedia('(pointer:fine)').matches) {
    const interactive = document.querySelectorAll(
      'a, button, .btn, .nav-toggle, .nav-cta, .gallery-item'
    );
    interactive.forEach((el) => {
      el.addEventListener('pointerenter', () => document.body.classList.add('cursor--active'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('cursor--active'));
    });
  }
}

/* ─── Particle Canvas ─── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y -= this.speedY;

      if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
        this.reset();
        this.y = canvas.height;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 30, 30, ${this.opacity})`;
      ctx.fill();
    }
  }

  const init = () => {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  };

  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* ─── Speed Lines ─── */
function initSpeedLines() {
  const container = document.getElementById('speedLines');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const createLine = () => {
    const line = document.createElement('div');
    line.className = 'speed-line';
    const top = 20 + Math.random() * 60;
    const width = 80 + Math.random() * 200;
    const right = Math.random() * 30;

    line.style.cssText = `
      top: ${top}%;
      right: ${right}%;
      width: ${width}px;
      animation-duration: ${0.8 + Math.random() * 0.8}s;
      animation-delay: ${Math.random() * 0.3}s;
    `;

    container.appendChild(line);
    line.addEventListener('animationend', () => line.remove());
  };

  setInterval(createLine, 400);
  for (let i = 0; i < 5; i++) setTimeout(createLine, i * 100);
}

/* ─── Exhaust Trail ─── */
function initExhaustTrail() {
  const container = document.getElementById('exhaustTrail');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const spawn = () => {
    const particle = document.createElement('div');
    particle.className = 'exhaust-particle';
    particle.style.top = `${Math.random() * 10}px`;
    particle.style.right = `${Math.random() * 20}px`;
    container.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  };

  setInterval(spawn, 120);
}

/* ─── Scroll Reveal ─── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay, 10));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  // Hero reveals on load
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 300);
}

/* ─── Counter Animation ─── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el, target, decimal = 0) => {
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;

      el.textContent = decimal > 0 ? current.toFixed(decimal) : Math.floor(current);

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimal > 0 ? target.toFixed(decimal) : target;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const decimal = parseInt(el.dataset.decimal || '0', 10);
          animateCounter(el, target, decimal);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => {
    if (el.closest('.hero-stat') || el.classList.contains('ring-value')) {
      observer.observe(el);
    }
  });
}

/* ─── Performance Rings ─── */
function initPerformanceRings() {
  const rings = document.querySelectorAll('.ring-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ring = entry.target;
          const percent = parseFloat(ring.dataset.percent) / 100;
          const circumference = 2 * Math.PI * 52;
          const offset = circumference * (1 - percent);

          ring.style.setProperty('--offset', offset);
          ring.classList.add('animated');
          ring.style.strokeDashoffset = offset;

          observer.unobserve(ring);
        }
      });
    },
    { threshold: 0.3 }
  );

  rings.forEach((ring) => observer.observe(ring));
}

/* ─── Performance Bars ─── */
function initPerformanceBars() {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width;
          bar.style.width = `${width}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ─── Gallery ─── */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '10';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });

    if (!reduceMotion && finePointer) {
      item.addEventListener('pointermove', (e) => {
        const rect = item.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        item.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`);
        item.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
      });

      item.addEventListener('pointerleave', () => {
        item.style.setProperty('--rx', '0deg');
        item.style.setProperty('--ry', '0deg');
      });
    }
  });
}

/* ─── Lightbox ─── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  const imageMap = {
    g1: 'images/car1.jpg',
    g2: 'images/car2.jpg',
    g3: 'images/car3.jpg',
    g4: 'images/car4.jpg',
    g5: 'images/car1.jpg',
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const label = item.querySelector('.gallery-overlay span')?.textContent || 'Gallery';
      const className = [...img.classList].find((c) => c.startsWith('g'));
      const src = imageMap[className] || imageMap.g1;

      content.innerHTML = `
        <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:4px;">
          <img src="${src}" alt="${label}" style="width:100%;height:100%;object-fit:cover;filter:brightness(0.85) contrast(1.1);">
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.8),transparent 40%);"></div>
          <span style="position:absolute;bottom:1.5rem;left:1.5rem;font-family:Orbitron,sans-serif;font-size:1rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,30,30,0.9);">${label}</span>
        </div>
      `;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ─── Newsletter ─── */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');

    btn.textContent = '✓';
    btn.style.background = '#ff1e1e';
    btn.style.borderColor = '#ff1e1e';
    input.value = '';
    input.placeholder = 'Welcome to the inner circle.';

    setTimeout(() => {
      btn.textContent = '→';
      btn.style.background = '';
      btn.style.borderColor = '';
      input.placeholder = 'your@email.com';
    }, 3000);
  });
}

/* ─── Mobile Nav ─── */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle?.addEventListener('click', () => {
    links?.classList.toggle('active');
    toggle.classList.toggle('open');
  });
}

/* ─── Parallax ─── */
function initParallax() {
  const car = document.getElementById('sportsCar');
  const hero = document.getElementById('hero');

  if (!car || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroBg = hero.querySelector('.hero-bg');
  const fog = hero.querySelector('.fog-layer');
  const beam = hero.querySelector('.beam-layer');
  const speedLines = document.getElementById('speedLines');
  const stage = hero.querySelector('.car-stage');

  let latestScroll = window.scrollY;
  let mx = 0.5;
  let my = 0.35;
  let tiltX = 0;
  let tiltY = 0;

  const onScroll = () => {
    latestScroll = window.scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const updateMouse = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width; // 0..1
    const py = (clientY - rect.top) / rect.height; // 0..1
    mx = Math.min(1, Math.max(0, px));
    my = Math.min(1, Math.max(0, py));
    tiltX = mx - 0.5;
    tiltY = my - 0.5;

    hero.style.setProperty('--mx', `${mx * 100}%`);
    hero.style.setProperty('--my', `${my * 100}%`);
  };

  hero.addEventListener('pointermove', (e) => updateMouse(e.clientX, e.clientY), { passive: true });

  // Smooth depth motion loop (kept subtle).
  let rafId = null;
  let running = true;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  const animate = () => {
    if (!running) return;

    const heroHeight = hero.offsetHeight || 1;
    const progress = clamp01(latestScroll / heroHeight);

    // Car movement + micro-rotation
    const carScale = 1 - progress * 0.1;
    const carY = progress * 40;
    const carRot = tiltX * 6;
    car.style.transform = `translateY(${carY}px) scale(${carScale}) rotateZ(${carRot}deg)`;
    car.style.opacity = String(1 - progress * 0.8);

    // Background parallax
    if (heroBg) {
      const bgY = progress * -26;
      const bgScale = 1.06 + progress * 0.035;
      heroBg.style.transform = `translate3d(0, ${bgY}px, 0) scale(${bgScale})`;
    }

    // Atmosphere density
    if (fog) fog.style.opacity = String(0.45 + progress * 0.25);
    if (beam) beam.style.opacity = String(0.40 + progress * 0.25);
    if (speedLines) {
      speedLines.style.transform = `translate3d(${tiltX * 14}px, 0, 0)`;
      speedLines.style.opacity = String(0.35 + (1 - progress) * 0.65);
    }

    if (stage) {
      stage.style.transform =
        `translateX(calc(-50% + ${tiltX * 18}px)) ` +
        `translateY(${tiltY * 10}px) rotateZ(${tiltX * 3}deg)`;
    }

    rafId = requestAnimationFrame(animate);
  };

  animate();

  // Stop the loop when leaving the hero to protect performance.
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running && rafId == null) rafId = requestAnimationFrame(animate);
      if (!running && rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { threshold: 0.05 }
  );
  heroObserver.observe(hero);
}
