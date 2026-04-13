/* =====================================================
   NK ZAUBERKUNST & HYPNOSE – MAIN JAVASCRIPT
   Nicolas Käufer | Interactive Features
   ===================================================== */

'use strict';

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- MOBILE NAV TOGGLE ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- ACTIVE NAV LINK ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));

/* ---- SCROLL REVEAL ---- */
const revealElements = document.querySelectorAll(
  '.section-header, .about-grid, .leistung-card, .zielgruppe-card, .galerie-item, .referenz-card, .faq-item, .kontakt-grid, .stat-item'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger children of grids
  if (el.parentElement && el.parentElement.children.length > 1) {
    const siblings = Array.from(el.parentElement.children);
    const idx = siblings.indexOf(el);
    if (idx < 4) el.classList.add(`reveal-delay-${idx}`);
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

revealElements.forEach(el => revealObserver.observe(el));

/* ---- HERO PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.5 + 0.1;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${opacity};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Toggle current
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- CONTACT FORM ---- */
const form = document.getElementById('kontaktForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Wird gesendet…';

    // Simulate sending (replace with real backend/Formspree/Netlify Forms)
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Anfrage senden';
      formSuccess.classList.add('visible');

      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 6000);
    }, 1500);
  });
}

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- MODALS ---- */
const backdrop = document.getElementById('modalBackdrop');
const impressumModal    = document.getElementById('impressumModal');
const datenschutzModal  = document.getElementById('datenschutzModal');

function openModal(modal) {
  modal.classList.add('active');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeAllModals() {
  [impressumModal, datenschutzModal].forEach(m => m.classList.remove('active'));
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('impressumLink').addEventListener('click', (e) => {
  e.preventDefault();
  openModal(impressumModal);
});
document.getElementById('datenschutzLink').addEventListener('click', (e) => {
  e.preventDefault();
  openModal(datenschutzModal);
});
document.querySelectorAll('[href="#datenschutz"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(datenschutzModal);
  });
});

document.getElementById('closeImpressum').addEventListener('click', closeAllModals);
document.getElementById('closeDatenschutz').addEventListener('click', closeAllModals);
backdrop.addEventListener('click', closeAllModals);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const isText = isNaN(parseInt(target));
  if (isText) { el.textContent = target; return; }

  const num = parseInt(target);
  const step = Math.ceil(num / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, num);
    el.textContent = current + suffix;
    if (current >= num) clearInterval(interval);
  }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(n => {
        const text = n.textContent.trim();
        if (text === '500+') animateCounter(n, 500, '+');
        else if (text === '100%') animateCounter(n, 100, '%');
        else n.textContent = text;
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ---- GALERIE LIGHTBOX (simple) ---- */
const galerieItems = document.querySelectorAll('.galerie-item');

galerieItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const label = item.querySelector('.galerie-overlay span');

    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position: fixed; inset: 0; z-index: 3000;
      background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out; padding: 2rem;
      backdrop-filter: blur(10px);
      animation: fadeIn 0.2s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`;
    document.head.appendChild(style);

    const inner = document.createElement('div');
    inner.style.cssText = 'text-align: center; max-width: 90vw;';

    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    imgEl.style.cssText = 'max-height: 80vh; max-width: 100%; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.8);';

    const caption = document.createElement('p');
    caption.textContent = label ? label.textContent : '';
    caption.style.cssText = 'color: rgba(255,255,255,0.6); margin-top: 1rem; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase;';

    inner.appendChild(imgEl);
    inner.appendChild(caption);
    lightbox.appendChild(inner);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    lightbox.addEventListener('click', () => {
      lightbox.remove();
      document.body.style.overflow = '';
    });
  });
});

/* ---- CURSOR GLOW EFFECT (subtle) ---- */
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9999;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.15s ease, top 0.15s ease;
`;
document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});
