/* ============================================================
   KoSBoS Bat — Comportements communs à toutes les pages
   ============================================================ */

'use strict';

/* ---------- Menu burger mobile ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('menu-principal');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = nav.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Apparition progressive au scroll ---------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---------- Liens téléphone / WhatsApp ---------- */
function initContactLinks() {
  if (typeof WHATSAPP_URL === 'undefined' || typeof PHONE_TEL === 'undefined') return;
  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.href = WHATSAPP_URL;
  });
  document.querySelectorAll('[data-phone]').forEach((el) => {
    el.href = 'tel:' + PHONE_TEL;
  });
}

/* ---------- Lightbox réutilisable ---------- */
function createLightbox({ getImages }) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lightbox || !img) return null;

  let index = 0;
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  function altFor(i) {
    return (
      (typeof GALLERY_ALTS !== 'undefined' && GALLERY_ALTS[i % GALLERY_ALTS.length]) ||
      `Réalisation de rénovation KoSBoS Bat — photo ${i + 1}`
    );
  }

  function open(i) {
    const images = getImages();
    if (!images.length) return;
    index = i;
    img.src = images[index];
    img.alt = altFor(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function move(direction) {
    const images = getImages();
    if (!images.length) return;
    index = (index + direction + images.length) % images.length;
    img.src = images[index];
    img.alt = altFor(index);
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); move(-1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); move(1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowLeft') move(-1);
  });

  return { open, close };
}
