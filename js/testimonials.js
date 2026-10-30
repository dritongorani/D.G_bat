/* ============================================================
   KoSBoS Bat — Témoignages clients
   ------------------------------------------------------------
   Carrousel 100 % vanilla JS : 3 avis visibles sur desktop,
   1 sur mobile, rotation automatique toutes les 3 secondes.
   Remplacez ces 10 avis de démonstration par vos vrais avis.
   Champs :
   - category    : electricite, plomberie, carrelage, placo ou peinture
   - name        : prénom + initiale ou nom complet
   - service     : type de travaux réalisés
   - city        : ville / secteur
   - rating      : note de 1 à 5
   - text        : contenu de l'avis
   - placeholder : true pour afficher le badge "Avis de démonstration"
   ============================================================ */

'use strict';

const KOSBOS_TESTIMONIALS = [
  {
    category: 'electricite',
    name: 'Sophie L.',
    service: 'Rénovation électrique',
    city: 'Lyon (69)',
    rating: 5,
    text: 'Remise aux normes du tableau électrique et pose de nouvelles prises : travail soigné et explications claires.',
    placeholder: true
  },
  {
    category: 'plomberie',
    name: 'Marc D.',
    service: 'Plomberie & salle de bain',
    city: 'Meximieux (01)',
    rating: 5,
    text: 'Rénovation complète de la salle de bain, de la plomberie aux finitions. Chantier propre et délais respectés.',
    placeholder: true
  },
  {
    category: 'carrelage',
    name: 'Nadia B.',
    service: 'Carrelage & faïence',
    city: 'Grenoble (38)',
    rating: 5,
    text: 'Pose de carrelage et faïence dans la cuisine et la salle de bain. Très bon rendu et conseils utiles.',
    placeholder: true
  },
  {
    category: 'placo',
    name: 'Julien R.',
    service: 'Placo & isolation',
    city: 'Ain (01)',
    rating: 5,
    text: 'Isolation des combles et création d’une cloison en placo. Équipe ponctuelle et chantier laissé propre.',
    placeholder: true
  },
  {
    category: 'peinture',
    name: 'Camille M.',
    service: 'Peinture & enduits',
    city: 'Isère (38)',
    rating: 5,
    text: 'Peinture des murs et plafonds après rebouchage. Finitions nettes et résultat conforme au devis.',
    placeholder: true
  },
  {
    category: 'electricite',
    name: 'Thomas P.',
    service: 'Mise aux normes électriques',
    city: 'Villeurbanne (69)',
    rating: 5,
    text: 'Mise aux normes électriques d’un appartement avant location. Intervention rapide et rapport clair.',
    placeholder: true
  },
  {
    category: 'plomberie',
    name: 'Élodie G.',
    service: 'Rénovation de salle de bain',
    city: 'Lyon (69)',
    rating: 5,
    text: 'Réfection de la salle de bain avec remplacement du sanitaire et de la robinetterie. Bon accompagnement.',
    placeholder: true
  },
  {
    category: 'carrelage',
    name: 'Karim A.',
    service: 'Pose de carrelage',
    city: 'Meximieux (01)',
    rating: 5,
    text: 'Carrelage de la terrasse et de l’entrée. Pose précise et respect des délais.',
    placeholder: true
  },
  {
    category: 'placo',
    name: 'Laura V.',
    service: 'Isolation & cloisonnement',
    city: 'Vienne (38)',
    rating: 5,
    text: 'Cloisonnement et isolation d’un bureau. Travail propre et bons conseils sur les matériaux.',
    placeholder: true
  },
  {
    category: 'peinture',
    name: 'Antoine S.',
    service: 'Peinture intérieure & enduits',
    city: 'Villefranche-sur-Saône (69)',
    rating: 5,
    text: 'Peinture et enduits dans un appartement ancien. Belle préparation des supports et rendu soigné.',
    placeholder: true
  }
];

function escapeTestimonialHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });
}

function renderTestimonials() {
  document.querySelectorAll('[data-testimonials]').forEach((container) => {
    const requestedLimit = Number.parseInt(container.dataset.testimonialsLimit || '10', 10);
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 10;
    const requestedCategory = container.dataset.testimonialsCategory || '';
    const orderedReviews = requestedCategory
      ? [...KOSBOS_TESTIMONIALS].sort(
          (a, b) =>
            Number(b.category === requestedCategory) - Number(a.category === requestedCategory)
        )
      : KOSBOS_TESTIMONIALS;
    const reviews = orderedReviews.slice(0, limit);

    if (!reviews.length) {
      container.innerHTML =
        '<p class="text-center text-gray-300">Les témoignages clients seront publiés ici prochainement.</p>';
      return;
    }

    const hasDemo = reviews.some((review) => review.placeholder);
    const countLabel = hasDemo
      ? `${reviews.length} avis de démonstration`
      : `${reviews.length} avis clients`;

    const cardsHtml = reviews
      .map((review, index) => {
        const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 5)));
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const placeholderBadge = review.placeholder
          ? '<span class="shrink-0 whitespace-nowrap text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">Avis de démonstration</span>'
          : '';

        return `
          <article class="testimonial-card bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-black/10 flex flex-col h-full" data-testimonial-index="${index}">
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-1 text-kos-accent text-lg leading-none" role="img" aria-label="Note de ${rating} étoiles sur 5">
                <span aria-hidden="true">${stars}</span>
              </div>
              ${placeholderBadge}
            </div>
            <blockquote class="text-gray-600 text-sm leading-relaxed flex-1">“${escapeTestimonialHtml(review.text)}”</blockquote>
            <footer class="mt-5 pt-4 border-t border-gray-100">
              <p class="font-bold text-kos-dark">${escapeTestimonialHtml(review.name)}</p>
              <p class="text-xs text-gray-500 mt-1">${escapeTestimonialHtml(review.service)} · ${escapeTestimonialHtml(review.city)}</p>
            </footer>
          </article>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="testimonials-carousel" data-testimonials-carousel>
        <div class="testimonials-toolbar">
          <p class="testimonials-count">${countLabel}</p>
          <div class="testimonials-controls">
            <span class="testimonials-status" data-testimonials-status></span>
            <button type="button" class="testimonials-arrow" data-testimonials-prev aria-label="Avis précédent">‹</button>
            <button type="button" class="testimonials-arrow" data-testimonials-next aria-label="Avis suivant">›</button>
          </div>
        </div>
        <div class="testimonials-viewport" tabindex="0" role="region" aria-roledescription="carrousel" aria-label="Bibliothèque d'avis clients">
          <div class="testimonials-track">${cardsHtml}</div>
        </div>
      </div>
    `;

    initTestimonialCarousel(container);
  });
}

function initTestimonialCarousel(container) {
  const carousel = container.querySelector('[data-testimonials-carousel]');
  const viewport = container.querySelector('.testimonials-viewport');
  const track = container.querySelector('.testimonials-track');
  const prevButton = container.querySelector('[data-testimonials-prev]');
  const nextButton = container.querySelector('[data-testimonials-next]');
  const status = container.querySelector('[data-testimonials-status]');
  const hoverTarget = container.closest('section') || carousel;

  if (!carousel || !viewport || !track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (!cards.length) return;

  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const tabletQuery = window.matchMedia('(min-width: 768px)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  let currentIndex = 0;
  let step = 0;
  let maxIndex = 0;
  let autoplayId = null;
  let isHovered = false;
  let isFocused = false;
  let resizeFrame = 0;

  const visibleCount = () => {
    if (desktopQuery.matches) return 3;
    if (tabletQuery.matches) return 2;
    return 1;
  };

  const hasKeyboardFocus = (element) => {
    if (!(element instanceof Element)) return false;
    try {
      return element.matches(':focus-visible');
    } catch (error) {
      return true;
    }
  };

  const measure = () => {
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    step = cards[0].getBoundingClientRect().width + gap;
    maxIndex = Math.max(0, cards.length - visibleCount());
    if (currentIndex > maxIndex) currentIndex = maxIndex;
  };

  const setTransform = (animate) => {
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translate3d(-${currentIndex * step}px, 0, 0)`;

    if (!animate) {
      window.requestAnimationFrame(() => {
        track.style.transition = '';
      });
    }
  };

  const updateStatus = () => {
    const visible = visibleCount();
    const first = currentIndex + 1;
    const last = Math.min(currentIndex + visible, cards.length);

    if (status) {
      status.textContent =
        visible === 1 ? `${first} / ${cards.length}` : `${first}–${last} / ${cards.length}`;
    }

    const controlsDisabled = maxIndex === 0;
    if (prevButton) prevButton.disabled = controlsDisabled;
    if (nextButton) nextButton.disabled = controlsDisabled;
  };

  const canAutoplay = () =>
    !motionQuery.matches &&
    maxIndex > 0 &&
    !isHovered &&
    !isFocused &&
    !document.hidden;

  function stopAutoplay() {
    if (autoplayId !== null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function goToNextGroup() {
    const nextIndex = currentIndex + visibleCount();

    if (nextIndex <= maxIndex) {
      goTo(nextIndex, false);
      return;
    }

    // Prochain groupe d'avis visibles (3 sur desktop), puis retour au début.
    // Si la fin ne permet pas d'afficher le groupe complet, on cale la
    // dernière vue sur les dernières cartes pour ne masquer aucun avis.
    goTo(currentIndex === maxIndex ? 0 : maxIndex, false);
  }

  function syncAutoplay() {
    if (!canAutoplay()) {
      stopAutoplay();
      return;
    }

    if (autoplayId !== null) return;

    autoplayId = window.setInterval(() => {
      goToNextGroup();
    }, 3000);
  }

  function restartAutoplay() {
    stopAutoplay();
    syncAutoplay();
  }

  function goTo(index, restart = true) {
    const positions = maxIndex + 1;
    currentIndex = ((index % positions) + positions) % positions;
    setTransform(true);
    updateStatus();

    if (restart) restartAutoplay();
  }

  function updateLayout() {
    measure();
    setTransform(false);
    updateStatus();
    syncAutoplay();
  }

  measure();
  setTransform(false);
  updateStatus();

  if (prevButton) {
    prevButton.addEventListener('click', () => goTo(currentIndex - 1));
  }
  if (nextButton) {
    nextButton.addEventListener('click', () => goTo(currentIndex + 1));
  }

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(currentIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  });

  // Pause au survol uniquement sur les appareils équipés d'une souris :
  // cela évite qu'un tap tactile ne fige le carrousel sur mobile.
  if (hoverQuery.matches) {
    hoverTarget.addEventListener('mouseenter', () => {
      isHovered = true;
      syncAutoplay();
    });
    hoverTarget.addEventListener('mouseleave', () => {
      isHovered = false;
      syncAutoplay();
    });
  }
  carousel.addEventListener('focusin', (event) => {
    if (hasKeyboardFocus(event.target)) {
      isFocused = true;
      syncAutoplay();
    }
  });
  carousel.addEventListener('focusout', (event) => {
    const nextFocus = event.relatedTarget;
    if (!(nextFocus instanceof Node) || !carousel.contains(nextFocus)) {
      isFocused = false;
      syncAutoplay();
    }
  });

  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(updateLayout);
  });

  document.addEventListener('visibilitychange', syncAutoplay);

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', syncAutoplay);
  }

  isFocused =
    carousel.contains(document.activeElement) && hasKeyboardFocus(document.activeElement);
  isHovered = hoverQuery.matches && hoverTarget.matches(':hover');

  // Rotation automatique toutes les 3 secondes, dès l'initialisation.
  // Le survol de la section, le focus clavier et l'onglet masqué la mettent en pause.
  syncAutoplay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderTestimonials);
} else {
  renderTestimonials();
}
