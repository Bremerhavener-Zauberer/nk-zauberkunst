/* =====================================================
   NK ZAUBERKUNST – MAIN JAVASCRIPT
   Nicolas Käufer | Interactive Features
   ===================================================== */

'use strict';

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- MOBILE NAV TOGGLE ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

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
const revealTargets = document.querySelectorAll(
  '.section-header, .about-grid, .leistung-card, .zielgruppe-card, .referenz-card, .faq-item, .kontakt-grid, .stat-item'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  const siblings = Array.from(el.parentElement.children);
  const idx = siblings.indexOf(el);
  if (idx > 0 && idx < 4) el.classList.add(`reveal-delay-${idx}`);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -70px 0px', threshold: 0.05 });

revealTargets.forEach(el => revealObserver.observe(el));

/* ---- HERO PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3.5 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:-10px;
      animation-delay:${Math.random()*14}s;
      animation-duration:${Math.random()*10+8}s;
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
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
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
    const span = btn.querySelector('span');
    btn.disabled = true;
    span.textContent = 'Wird gesendet…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      span.textContent = 'Nachricht senden';
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1500);
  });
}

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- MODALS ---- */
const backdrop        = document.getElementById('modalBackdrop');
const impressumModal  = document.getElementById('impressumModal');
const datenschutzModal = document.getElementById('datenschutzModal');

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

document.getElementById('impressumLink').addEventListener('click', (e) => { e.preventDefault(); openModal(impressumModal); });
document.getElementById('datenschutzLink').addEventListener('click', (e) => { e.preventDefault(); openModal(datenschutzModal); });

// Datenschutz trigger inside form
const dsTrigger = document.getElementById('datenschutzTrigger');
if (dsTrigger) dsTrigger.addEventListener('click', (e) => { e.preventDefault(); openModal(datenschutzModal); });

document.getElementById('closeImpressum').addEventListener('click', closeAllModals);
document.getElementById('closeDatenschutz').addEventListener('click', closeAllModals);
backdrop.addEventListener('click', closeAllModals);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- COUNTER ANIMATION ---- */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(n => {
        const text = n.textContent.trim();
        if (text === '500+') {
          let c = 0;
          const iv = setInterval(() => { c = Math.min(c + 9, 500); n.textContent = c + '+'; if (c >= 500) clearInterval(iv); }, 20);
        } else if (text === '100%') {
          let c = 0;
          const iv = setInterval(() => { c = Math.min(c + 2, 100); n.textContent = c + '%'; if (c >= 100) clearInterval(iv); }, 20);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ---- SUBTLE CURSOR GLOW ---- */
const glow = document.createElement('div');
glow.style.cssText = `
  position:fixed; pointer-events:none; z-index:9999;
  width:280px; height:280px; border-radius:50%;
  background:radial-gradient(circle, rgba(139,92,246,0.055) 0%, transparent 70%);
  transform:translate(-50%,-50%);
  transition:left 0.12s ease, top 0.12s ease;
`;
document.body.appendChild(glow);
document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});
