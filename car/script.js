/**
 * VELOCITÉ — Premium Luxury Car Landing
 * Interactions, animations, and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
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
});

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
    requestAnimationFrame(animate);
  }

  animate();
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
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
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

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '10';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });
}

/* ─── Lightbox ─── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  const gradients = {
    g1: 'linear-gradient(135deg, #0a1520 0%, #1a3040 50%, #0a1018 100%)',
    g2: 'linear-gradient(160deg, #151520 0%, #252535 50%, #101015 100%)',
    g3: 'linear-gradient(200deg, #101018 0%, #202028 40%, #0a0a10 100%)',
    g4: 'linear-gradient(180deg, #050510 0%, #151525 60%, #0a0a12 100%)',
    g5: 'linear-gradient(90deg, #0a1018 0%, #253545 50%, #0a1018 100%)',
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const label = item.querySelector('.gallery-overlay span')?.textContent || 'Gallery';
      const className = [...img.classList].find((c) => c.startsWith('g'));
      const gradient = gradients[className] || gradients.g1;

      content.innerHTML = `
        <div style="
          width:100%;height:100%;display:flex;align-items:center;justify-content:center;
          background:${gradient};
          font-family:Orbitron,sans-serif;font-size:1.5rem;letter-spacing:0.2em;
          text-transform:uppercase;color:rgba(0,212,255,0.8);
        ">${label}</div>
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
    btn.style.background = '#00ff88';
    btn.style.borderColor = '#00ff88';
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

  window.addEventListener(
    'scroll',
    () => {
      const scroll = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scroll < heroHeight) {
        const progress = scroll / heroHeight;
        car.style.transform = `translateY(${progress * 40}px) scale(${1 - progress * 0.1})`;
        car.style.opacity = 1 - progress * 0.8;
      }
    },
    { passive: true }
  );

  // Mouse tilt on car
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const stage = document.querySelector('.car-stage');
    if (stage) {
      stage.style.transform = `translateX(calc(-50% + ${x * 20}px)) translateY(${y * 10}px)`;
    }
  });
}
