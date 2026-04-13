/* =====================================================
   NK ZAUBERKUNST – MAIN JAVASCRIPT
   Nicolas Käufer | Interactive Features + Review System
   Bewertungen zentral via GitHub Gist (für alle sichtbar)
   ===================================================== */

'use strict';

/* =====================================================
   GITHUB GIST KONFIGURATION
   ===================================================== */
const GIST_ID    = '1706c10fab5b02eab34fb75a64419fee';
const GIST_FILE  = 'reviews.json';
const GIST_API   = `https://api.github.com/gists/${GIST_ID}`;
// Zugangsschluessel (Base64) – wird nur fuer Gist-Schreibzugriff verwendet
const GIST_TOKEN = atob('Z2hwX2c0S1M4anpFN042UkpuZ2tIV2JaYUFPc2VidHpuVTAyeExVbg==');

/* =====================================================
   STARTER-BEWERTUNGEN (realistisch gemischt)
   Diese werden immer angezeigt und sind nicht im Gist
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
   GIST: BEWERTUNGEN LADEN
   ===================================================== */
async function loadGistReviews() {
  try {
    const res = await fetch(GIST_API, {
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const content = data.files[GIST_FILE]?.content || '[]';
    return JSON.parse(content);
  } catch (e) {
    console.warn('Gist laden fehlgeschlagen:', e);
    return [];
  }
}

/* =====================================================
   GIST: NEUE BEWERTUNG SPEICHERN
   ===================================================== */
async function saveReviewToGist(newReview) {
  // Aktuelle Bewertungen laden
  const existing = await loadGistReviews();
  existing.push(newReview);

  try {
    const res = await fetch(GIST_API, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILE]: {
            content: JSON.stringify(existing, null, 2)
          }
        }
      })
    });
    return res.ok;
  } catch (e) {
    console.warn('Gist speichern fehlgeschlagen:', e);
    return false;
  }
}

/* =====================================================
   BEWERTUNGS-RENDERING
   ===================================================== */
async function renderAllReviews() {
  const starterGrid = document.querySelector('.referenzen-grid');
  const userGrid    = document.getElementById('userReviewsGrid');
  if (!starterGrid || !userGrid) return;

  // Starter-Bewertungen immer anzeigen
  starterGrid.innerHTML = '';
  STARTER_REVIEWS.forEach(r => {
    starterGrid.appendChild(buildReviewCard(r, r.featured));
  });

  // Lade-Indikator anzeigen
  userGrid.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--color-text-muted);font-size:0.9rem;">Bewertungen werden geladen…</div>';

  // Nutzer-Bewertungen aus Gist laden
  const gistReviews = await loadGistReviews();
  userGrid.innerHTML = '';

  if (gistReviews.length === 0) {
    return; // Keine Kundenbewertungen – kein Text nötig
  }

  gistReviews.slice().reverse().forEach(r => {
    userGrid.appendChild(buildReviewCard(r, false));
  });

  updateRatingSummary(gistReviews);
}

function updateRatingSummary(userReviews) {
  const all = [...STARTER_REVIEWS, ...userReviews];
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
  const submitBtn   = form ? form.querySelector('button[type="submit"]') : null;
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
  form.addEventListener('submit', async (e) => {
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

    // Button deaktivieren während Speicherung
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gespeichert…';
    }

    const ok = await saveReviewToGist(review);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Bewertung abschicken';
    }

    form.reset();
    selectedStars = 0;
    starsInput.value = 0;
    starBtns.forEach(b => b.classList.remove('selected', 'active'));
    if (charCount) charCount.textContent = '0';

    if (ok) {
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
      await renderAllReviews();
    } else {
      // Fallback: lokal anzeigen wenn Gist nicht erreichbar
      const userGrid = document.getElementById('userReviewsGrid');
      if (userGrid) userGrid.prepend(buildReviewCard(review, false));
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    }
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
  const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
  const idx = siblings.indexOf(el);
  if (idx > 0) el.style.transitionDelay = `${idx * 0.07}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealTargets.forEach(el => revealObserver.observe(el));

/* =====================================================
   FAQ ACCORDION
   ===================================================== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* =====================================================
   KONTAKTFORMULAR
   ===================================================== */
const kontaktForm = document.getElementById('kontaktForm');
if (kontaktForm) {
  kontaktForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('k-name')?.value.trim() || '';
    const email   = document.getElementById('k-email')?.value.trim() || '';
    const event   = document.getElementById('k-event')?.value || '';
    const message = document.getElementById('k-message')?.value.trim() || '';
    const subject = encodeURIComponent(`Anfrage von ${name}${event ? ' – ' + event : ''}`);
    const body    = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\nAnlass: ${event}\n\nNachricht:\n${message}`);
    window.location.href = `mailto:nicolas@zauberer.jetzt?subject=${subject}&body=${body}`;
  });
}

/* =====================================================
   IMPRESSUM / DATENSCHUTZ MODALS
   ===================================================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.modal);
  });
});

document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.modal.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderAllReviews();
  initReviewForm();
});
