/* ============================================================
   KoSBoS Bat — Homepage
   ============================================================ */

'use strict';

/* ---------- Aperçu des réalisations (6 photos phares) ---------- */
function initHomeGallery() {
  const grid = document.getElementById('home-gallery');
  if (!grid || typeof HOMEPAGE_IMAGES === 'undefined') return;

  grid.innerHTML = HOMEPAGE_IMAGES.map(
    (src, i) => `
    <figure class="gallery-item group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] cursor-pointer shadow-sm"
            data-index="${i}" role="button" tabindex="0"
            aria-label="Agrandir la photo de réalisation ${i + 1}">
      <img src="${src}"
           alt="${typeof GALLERY_ALTS !== 'undefined' ? GALLERY_ALTS[i % GALLERY_ALTS.length] : 'Réalisation rénovation intérieure KoSBoS Bat'}"
           class="w-full h-full object-cover"
           loading="lazy" decoding="async"
           onerror="this.closest('.gallery-item').style.display='none';">
      <div class="absolute inset-0 bg-kos-dark/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span class="text-white text-2xl" aria-hidden="true">🔍</span>
      </div>
      <figcaption class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/75 to-transparent text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Chantier KoSBoS Bat
      </figcaption>
    </figure>
  `
  ).join('');

  const lightbox = createLightbox({ getImages: () => HOMEPAGE_IMAGES });

  grid.querySelectorAll('.gallery-item').forEach((item) => {
    const open = () => {
      const i = parseInt(item.dataset.index, 10);
      if (lightbox) lightbox.open(i);
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

/* ---------- FAQ accordéon ---------- */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      answer.classList.toggle('hidden', !isOpen);
    });
  });
}

/* ---------- Formulaire devis Formspree ---------- */
function initContactForm() {
  const form = document.getElementById('form-devis');
  const success = document.getElementById('message-succes');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Échec de l’envoi');

      form.reset();
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.error(err);
      alert(
        'Une erreur est survenue lors de l’envoi. Veuillez réessayer ou nous appeler au ' +
          (typeof PHONE_DISPLAY !== 'undefined' ? PHONE_DISPLAY : '') +
          '.'
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '📋 Envoyer ma demande de devis gratuit';
      }
    }
  });
}

/* ---------- Compteurs animés du Hero ---------- */
function initHeroCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const render = (el, value) => {
    el.textContent = value + (el.dataset.suffix || '');
  };

  const targets = new Map();
  counters.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    targets.set(el, Number.isFinite(target) ? target : 0);
    if (prefersReduced) render(el, targets.get(el));
    else render(el, 0);
  });

  if (prefersReduced) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => render(el, targets.get(el)));
    return;
  }

  const animate = (el) => {
    const target = targets.get(el);
    const duration = 1500;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      render(el, Math.round(easeOutCubic(progress) * target));
      if (progress < 1) requestAnimationFrame(tick);
      else render(el, target);
    };

    requestAnimationFrame(tick);
  };

  /* Les chiffres déjà visibles au chargement attendent la fin de l'entrée en cascade */
  const initiallyVisible = new Set();
  counters.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) initiallyVisible.add(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const delay = initiallyVisible.has(entry.target) ? 650 : 0;
        setTimeout(() => animate(entry.target), delay);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ---------- Rotation des accroches du Hero ---------- */
function initHeroRotator() {
  const rotator = document.getElementById('hero-rotator');
  const text = document.getElementById('hero-rotator-text');
  const live = document.getElementById('hero-rotator-live');
  if (!rotator || !text) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const phrases = [
    {
      html: 'Un seul interlocuteur pour la <span class="text-kos-accent">rénovation de A à Z</span>',
      text: 'Un seul interlocuteur pour la rénovation de A à Z'
    },
    {
      html:
        'Artisan tous corps d\'état : <span class="text-kos-accent">Électricité, Plomberie, Carrelage & Placo</span>',
      text: 'Artisan tous corps d\'état : Électricité, Plomberie, Carrelage & Placo'
    },
    {
      html:
        'Intervention rapide à <span class="text-kos-accent">Lyon (69), dans l\'Ain (01) et en Isère (38)</span>',
      text: 'Intervention rapide à Lyon (69), dans l\'Ain (01) et en Isère (38)'
    }
  ];

  let index = 0;
  const intervalMs = 3500;
  const fadeMs = 350;

  const showNext = () => {
    text.classList.remove('is-rotating');
    void text.offsetWidth;
    text.classList.add('is-rotating');

    window.setTimeout(() => {
      index = (index + 1) % phrases.length;
      text.innerHTML = phrases[index].html;
      if (live) live.textContent = phrases[index].text;
    }, fadeMs);
  };

  let timer = window.setInterval(showNext, intervalMs);

  document.addEventListener('visibilitychange', () => {
    window.clearInterval(timer);
    if (document.hidden) return;

    timer = window.setInterval(showNext, intervalMs);
  });
}

/* ---------- Effets d'interaction des boutons CTA ---------- */
function initButtonEffects() {
  document.querySelectorAll('.btn-interactive').forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const ripple = document.createElement('span');

      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}

/* ---------- Données des services (modale) ---------- */
const SERVICE_KEYS = [
  'electricite',
  'plomberie',
  'carrelage',
  'placo',
  'peinture',
  'sols',
  'murs',
  'renovation'
];

const SERVICE_DETAILS = {
  electricite: {
    tag: 'Artisan électricien',
    title: 'Électricité & Mise aux normes',
    intro:
      'Installation, rénovation et sécurisation de votre réseau électrique à Lyon, dans l’Ain et en Isère. Nous intervenons sur tous types de logements et de locaux professionnels.',
    points: [
      'Installation électrique neuve et rénovation complète',
      'Mise aux normes NF C 15-100 et mise en sécurité',
      'Dépannage, recherche de panne et remplacement de tableau',
      'Éclairage, prises, interrupteurs et solutions connectées'
    ],
    formValue: 'Électricité & Mise aux normes'
  },
  plomberie: {
    tag: 'Artisan plombier',
    title: 'Plomberie & Sanitaires',
    intro:
      'Création et rénovation de salles de bain, installation de sanitaires et réseaux d’eau dans le Rhône, l’Ain et l’Isère. Un travail soigné, du raccordement à la finition.',
    points: [
      'Création et rénovation complète de salles de bain',
      'Installation de sanitaires, lavabos et robinetterie',
      'Recherche de fuites et réparation de réseaux d’eau',
      'Remplacement de chauffe-eau et équipements sanitaires'
    ],
    formValue: 'Plomberie & Sanitaires'
  },
  carrelage: {
    tag: 'Poseur carrelage',
    title: 'Carrelage & Faïence',
    intro:
      'Pose de carrelage sol et mur, faïence et mosaïque à Lyon, Meximieux et Grenoble. Des finitions nettes et durables pour vos pièces humides comme vos espaces de vie.',
    points: [
      'Pose de carrelage au sol et au mur',
      'Faïence de salle de bain et cuisine',
      'Grands formats, mosaïque et plinthes',
      'Préparation des supports et joints de qualité'
    ],
    formValue: 'Carrelage & Faïence'
  },
  placo: {
    tag: 'Plâtrier plaquiste',
    title: 'Placo & Isolation',
    intro:
      'Cloisons, faux plafonds et isolation thermique ou phonique dans le 69, l’Ain et l’Isère. Nous optimisons vos espaces tout en améliorant le confort de votre logement.',
    points: [
      'Pose de placo et cloisons sèches',
      'Faux plafonds et plâtrerie décorative',
      'Isolation thermique et phonique',
      'Rénovation et redistribution des espaces'
    ],
    formValue: 'Placo & Isolation'
  },
  peinture: {
    tag: 'Peintre en bâtiment',
    title: 'Peinture & Enduits',
    intro:
      'Peinture intérieure, enduits de lissage et finitions à Lyon et dans toute la région. Nous préparons vos supports avec soin pour un rendu net et durable.',
    points: [
      'Peinture intérieure murs et plafonds',
      'Enduits de lissage et correction des supports',
      'Rafraîchissement et changement de couleur',
      'Finitions professionnelles et protection des lieux'
    ],
    formValue: 'Peinture & Enduits'
  },
  sols: {
    tag: 'Revêtement de sol',
    title: 'Sols (Parquet, Lino)',
    intro:
      'Pose de parquet, linoléum et revêtements souples à Lyon, dans l’Ain et en Isère. Nous vous conseillons sur le choix des matériaux et préparons chaque support pour une tenue parfaite.',
    points: [
      'Pose de parquet massif et contrecollé',
      'Linoléum, PVC et sols souples',
      'Préparation et ragréage des supports',
      'Plinthes, seuils et finitions associées'
    ],
    formValue: 'Sols (Parquet, Lino)'
  },
  murs: {
    tag: 'Rénovation murs',
    title: 'Murs & Plafonds',
    intro:
      'Réfection complète de murs et plafonds dans le Rhône, l’Ain et l’Isère : enduits, ratissage et préparation avant peinture ou revêtement mural.',
    points: [
      'Réfection et remise en état des murs',
      'Ratissage et enduits de finition',
      'Traitement des fissures et imperfections',
      'Préparation avant peinture ou papier peint'
    ],
    formValue: 'Murs & Plafonds'
  },
  renovation: {
    tag: 'Tous corps d’état',
    title: 'Rénovation complète de A à Z',
    intro:
      'Confiez-nous votre projet de rénovation intérieure à Lyon, dans l’Ain ou en Isère. Un seul interlocuteur coordonne tous les corps d’état, du sol au plafond, pour les particuliers et les professionnels.',
    points: [
      'Rénovation complète d’appartements et de maisons',
      'Coordination de tous les corps d’état',
      'Électricité, plomberie, carrelage, placo et peinture',
      'Un seul devis, un seul planning, un seul interlocuteur'
    ],
    formValue: 'Rénovation complète A à Z'
  }
};

/* ---------- Révélation des cartes services en cascade ---------- */
function initServiceReveal() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.service-card'));
  if (!cards.length) return;

  const showAll = () => {
    cards.forEach((card) => {
      card.style.transitionDelay = '';
      card.classList.add('is-visible', 'is-revealed');
    });
    grid.classList.add('is-ready');
  };

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;
        observer.unobserve(card);

        const columns =
          getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
        const delay = (cards.indexOf(card) % columns) * 110;

        card.style.transitionDelay = `${delay}ms`;
        card.classList.add('is-visible');
        grid.classList.add('is-ready');

        window.setTimeout(() => {
          card.style.transitionDelay = '';
          card.classList.add('is-revealed');
        }, delay + 750);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  cards.forEach((card) => observer.observe(card));
}

/* ---------- Interactions des cartes services + modale ---------- */
function initServiceInteractions() {
  const grid = document.getElementById('services-grid');
  const modal = document.getElementById('service-modal');
  if (!grid || !modal) return;

  const cards = Array.from(grid.querySelectorAll('.service-card'));
  const titleEl = document.getElementById('service-modal-title');
  const tagEl = document.getElementById('service-modal-tag');
  const introEl = document.getElementById('service-modal-intro');
  const listEl = document.getElementById('service-modal-list');
  const ctaBtn = document.getElementById('service-modal-cta');
  const closeBtn = modal.querySelector('.service-modal-close');

  const checkIcon =
    '<svg class="w-5 h-5 text-kos-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

  let activeKey = null;
  let lastFocused = null;

  function openServiceModal(key, trigger) {
    const data = SERVICE_DETAILS[key];
    if (!data) return;

    activeKey = key;
    titleEl.textContent = data.title;
    tagEl.textContent = data.tag;
    introEl.textContent = data.intro;
    listEl.innerHTML = data.points
      .map((point) => `<li class="flex items-start gap-2.5">${checkIcon}<span>${point}</span></li>`)
      .join('');

    lastFocused = trigger || document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 30);
  }

  function closeServiceModal() {
    if (!modal.classList.contains('open')) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeKey = null;

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  }

  cards.forEach((card, index) => {
    const key = SERVICE_KEYS[index];
    const data = SERVICE_DETAILS[key];
    if (!data) return;

    card.dataset.service = key;

    const cta = card.querySelector('.service-card-cta');
    const pageUrl = cta && cta.tagName === 'A' ? cta.getAttribute('href') : null;

    if (cta && !pageUrl) {
      cta.setAttribute('aria-label', `Cliquez pour plus d'infos sur ${data.title}`);
    }

    card.addEventListener('mouseenter', () => grid.classList.add('is-hovering-card'));
    card.addEventListener('mouseleave', () => grid.classList.remove('is-hovering-card'));

    /* Les cartes reliées à une page métier naviguent au clic,
       sans ouvrir la modale de présentation. */
    if (pageUrl) {
      card.classList.add('has-landing-page');
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        window.location.href = pageUrl;
      });
      return;
    }

    const open = () => openServiceModal(key, cta || card);
    card.addEventListener('click', open);
  });

  modal.querySelectorAll('[data-modal-close], .service-modal-close').forEach((el) => {
    el.addEventListener('click', closeServiceModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeServiceModal();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeServiceModal();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      if (!activeKey) return;
      const data = SERVICE_DETAILS[activeKey];
      closeServiceModal();
      preselectService(data.formValue, data.title);
    });
  }
}

/* ---------- Pré-remplissage du formulaire depuis une carte service ---------- */
function preselectService(formValue, displayName) {
  const form = document.getElementById('form-devis');
  if (!form) return;

  const checkbox = Array.from(form.querySelectorAll('input[name="types_travaux"]')).find(
    (input) => input.value === formValue
  );

  if (checkbox) {
    checkbox.checked = true;

    const label = checkbox.closest('label');
    if (label) {
      label.classList.remove('service-preselected');
      void label.offsetWidth;
      label.classList.add('service-preselected');
      window.setTimeout(() => label.classList.remove('service-preselected'), 2600);
    }
  }

  const banner = document.getElementById('devis-service-selection');
  const name = document.getElementById('devis-service-name');
  if (banner && name) {
    name.textContent = displayName;
    banner.style.display = 'flex';
  }

  smoothScrollTo('#devis');
}

/* ---------- Scroll fluide vers les sections (offset header) ---------- */
function smoothScrollTo(selector) {
  const target = document.querySelector(selector);
  if (!target) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('header');
  const offset = (header ? header.offsetHeight : 0) + 16;
  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });

  if (history.replaceState) {
    history.replaceState(null, '', selector);
  }

  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

function initSmoothScroll() {
  document.querySelectorAll('[data-scroll-to]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.dataset.scrollTo;
      if (!selector || !document.querySelector(selector)) return;

      event.preventDefault();
      smoothScrollTo(selector);
    });
  });
}

/* ---------- Initialisation ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initHomeGallery();
  initServiceReveal();
  initServiceInteractions();
  initFaq();
  initContactForm();
  initContactLinks();
  initHeroCounters();
  initHeroRotator();
  initButtonEffects();
  initSmoothScroll();
});
