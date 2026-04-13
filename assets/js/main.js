/* =====================================================
   NK ZAUBERKUNST – MAIN JAVASCRIPT
   Nicolas Käufer | Interactive Features + Review System
   ===================================================== */

'use strict';

/* =====================================================
   STARTER-BEWERTUNGEN (realistisch gemischt)
   ===================================================== */
const STARTER_REVIEWS = [
  {
    name: 'Markus Keller',
    anlass: 'Firmenveranstaltung',
    stars: 5,
    text: '„Nicolas hat unsere Weihnachtsfeier in ein unvergessliches Erlebnis verwandelt. Die Mitarbeiter sprechen noch heute davon. Absolute Buchungsempfehlung!"',
    date: '2024-12-14',
    initials: 'MK',
    featured: true
  },
  {
    name: 'Sarah & Lukas',
    anlass: 'Hochzeit',
    stars: 5,
    text: '„Die Close-Up-Magie auf unserer Hochzeit war der absolute Höhepunkt! Alle Gäste waren begeistert und konnten es nicht fassen. Nicolas ist ein echter Profi mit Herz."',
    date: '2024-09-07',
    initials: 'SL',
    featured: false
  },
  {
    name: 'Andrea Weiß',
    anlass: 'Stadtfest',
    stars: 4,
    text: '„Wir haben Nicolas für unser Stadtfest gebucht und er hat die Besucher stundenlang begeistert. Professionell und charmant – kleiner Abzug, weil er etwas später ankam als geplant, aber der Auftritt selbst war top."',
    date: '2024-07-20',
    initials: 'AW',
    featured: false
  },
  {
    name: 'Peter Hoffmann',
    anlass: 'Firmenveranstaltung',
    stars: 5,
    text: '„Die Close-Up-Magie beim Galadinner war atemberaubend. Unsere Kunden waren völlig fasziniert. Nicolas versteht es, eine Atmosphäre zu schaffen, die lange nachhallt."',
    date: '2024-11-03',
    initials: 'PH',
    featured: false
  },
  {
    name: 'Christine Müller',
    anlass: 'Geburtstag',
    stars: 5,
    text: '„Zum 50. Geburtstag meines Mannes war Nicolas der perfekte Überraschungsgast. Er hat alle Altersgruppen begeistert – von den Kindern bis zu den Großeltern!"',
    date: '2025-01-18',
    initials: 'CM',
    featured: false
  },
  {
    name: 'Thomas R.',
    anlass: 'Privatfeier',
    stars: 4,
    text: '„Sehr guter Auftritt auf unserer Gartenparty. Die Gäste waren beeindruckt, besonders die Kartenkunststücke. Ich hätte mir noch etwas mehr Interaktion mit dem Publikum gewünscht, aber insgesamt sehr empfehlenswert."',
    date: '2025-02-08',
    initials: 'TR',
    featured: false
  }
];

/* =====================================================
   HILFSFUNKTIONEN
   ===================================================== */
function starsHTML(count) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span style="color:${i <= count ? '#c9a84c' : '#333350'}">★</span>`;
  }
  return html;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

function buildReviewCard(review, featured = false) {
  const card = document.createElement('div');
  card.className = 'referenz-card' + (featured ? ' referenz-featured' : '');

  const anlassTag = review.anlass
    ? `<span class="referenz-anlass">${review.anlass}</span>`
    : '';

  card.innerHTML = `
    <div class="referenz-stars">${starsHTML(review.stars)}</div>
    ${anlassTag}
    <blockquote>${review.text}</blockquote>
    <div class="referenz-author">
      <div class="referenz-avatar">${review.initials || getInitials(review.name)}</div>
      <div>
        <strong>${review.name}</strong>
        <span class="referenz-date">${formatDate(review.date)}</span>
      </div>
    </div>
  `;
  return card;
}

/* =====================================================
   BEWERTUNGS-RENDERING
   ===================================================== */
function renderAllReviews() {
  const starterGrid = document.querySelector('.referenzen-grid');
  const userGrid    = document.getElementById('userReviewsGrid');
  if (!starterGrid || !userGrid) return;

  // Starter-Bewertungen
  starterGrid.innerHTML = '';
  STARTER_REVIEWS.forEach(r => {
    starterGrid.appendChild(buildReviewCard(r, r.featured));
  });

  // Nutzer-Bewertungen aus localStorage
  const stored = JSON.parse(localStorage.getItem('nk_reviews') || '[]');
  userGrid.innerHTML = '';
  if (stored.length === 0) {
    // Kein "Keine Bewertungen"-Text – erst nach erster Bewertung sichtbar
    return;
  }
  stored.slice().reverse().forEach(r => {
    userGrid.appendChild(buildReviewCard(r, false));
  });

  updateRatingSummary(stored);
}

function updateRatingSummary(stored) {
  const all = [...STARTER_REVIEWS, ...stored];
  const avg = (all.reduce((s, r) => s + r.stars, 0) / all.length).toFixed(1);
  const total = all.length;

  let summaryEl = document.getElementById('ratingSummary');
  if (!summaryEl) {
    summaryEl = document.createElement('div');
    summaryEl.id = 'ratingSummary';
    summaryEl.className = 'rating-summary';
    const wrap = document.getElementById('userReviewsWrap');
    if (wrap) wrap.insertBefore(summaryEl, wrap.firstChild);
  }
  summaryEl.innerHTML = `
    <div class="rating-avg">${avg}</div>
    <div class="rating-info">
      <div class="rating-stars-row">${starsHTML(Math.round(avg))}</div>
      <div class="rating-count">Basierend auf ${total} Bewertung${total !== 1 ? 'en' : ''}</div>
    </div>
  `;
}

/* =====================================================
   BEWERTUNGS-FORMULAR
   ===================================================== */
function initReviewForm() {
  const form        = document.getElementById('bewertungForm');
  const starPicker  = document.getElementById('starPicker');
  const starsInput  = document.getElementById('bw-stars');
  const textarea    = document.getElementById('bw-text');
  const charCount   = document.getElementById('charCount');
  const successMsg  = document.getElementById('bewertungSuccess');
  if (!form) return;

  let selectedStars = 0;

  // Sterne-Picker
  const starBtns = starPicker.querySelectorAll('.star-btn');
  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const val = parseInt(btn.dataset.value);
      starBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.value) <= val));
    });
    btn.addEventListener('mouseleave', () => {
      starBtns.forEach(b => b.classList.toggle('selected', parseInt(b.dataset.value) <= selectedStars));
      starBtns.forEach(b => b.classList.remove('active'));
    });
    btn.addEventListener('click', () => {
      selectedStars = parseInt(btn.dataset.value);
      starsInput.value = selectedStars;
      starBtns.forEach(b => {
        b.classList.toggle('selected', parseInt(b.dataset.value) <= selectedStars);
        b.classList.remove('active');
      });
    });
  });

  // Zeichenzähler
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = textarea.value.length;
    });
  }

  // Formular absenden
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedStars === 0) {
      starPicker.style.outline = '2px solid var(--color-primary)';
      starPicker.style.borderRadius = '6px';
      setTimeout(() => { starPicker.style.outline = ''; }, 2000);
      return;
    }

    const name   = document.getElementById('bw-name').value.trim();
    const anlass = document.getElementById('bw-anlass').value || '';
    const text   = textarea.value.trim();

    const review = {
      name,
      anlass,
      stars: selectedStars,
      text: `„${text}"`,
      date: new Date().toISOString().split('T')[0],
      initials: getInitials(name)
    };

    const stored = JSON.parse(localStorage.getItem('nk_reviews') || '[]');
    stored.push(review);
    localStorage.setItem('nk_reviews', JSON.stringify(stored));

    form.reset();
    selectedStars = 0;
    starsInput.value = 0;
    starBtns.forEach(b => b.classList.remove('selected', 'active'));
    if (charCount) charCount.textContent = '0';

    successMsg.classList.add('visible');
    setTimeout(() => successMsg.classList.remove('visible'), 6000);

    renderAllReviews();
  });
}

/* =====================================================
   NAVBAR SCROLL EFFECT
   ===================================================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* =====================================================
   MOBILE NAV TOGGLE
   ===================================================== */
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

/* =====================================================
   ACTIVE NAV LINK
   ===================================================== */
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

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
const revealTargets = document.querySelectorAll(
  '.section-header, .about-grid, .leistung-card, .zielgruppe-card, .referenz-card, .faq-item, .kontakt-grid, .stat-item, .bewertung-form, .rating-summary'
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

/* =====================================================
   HERO PARTICLES
   ===================================================== */
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

/* =====================================================
   FAQ ACCORDION
   ===================================================== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* =====================================================
   CONTACT FORM
   ===================================================== */
const contactForm = document.getElementById('kontaktForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn  = contactForm.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    btn.disabled = true;
    span.textContent = 'Wird gesendet…';

    setTimeout(() => {
      contactForm.reset();
      btn.disabled = false;
      span.textContent = 'Nachricht senden';
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1500);
  });
}

/* =====================================================
   BACK TO TOP
   ===================================================== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =====================================================
   MODALS
   ===================================================== */
const backdrop         = document.getElementById('modalBackdrop');
const impressumModal   = document.getElementById('impressumModal');
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

document.getElementById('impressumLink').addEventListener('click',   (e) => { e.preventDefault(); openModal(impressumModal); });
document.getElementById('datenschutzLink').addEventListener('click', (e) => { e.preventDefault(); openModal(datenschutzModal); });

const dsTrigger = document.getElementById('datenschutzTrigger');
if (dsTrigger) dsTrigger.addEventListener('click', (e) => { e.preventDefault(); openModal(datenschutzModal); });

document.getElementById('closeImpressum').addEventListener('click',   closeAllModals);
document.getElementById('closeDatenschutz').addEventListener('click', closeAllModals);
backdrop.addEventListener('click', closeAllModals);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
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

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
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

/* =====================================================
   SUBTLE CURSOR GLOW
   ===================================================== */
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

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderAllReviews();
  initReviewForm();
});
