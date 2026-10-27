/* ============================================================
   KoSBoS Bat — Page "Toutes nos réalisations"
   ============================================================ */

'use strict';

const BATCH_SIZE = 12;
let visibleCount = BATCH_SIZE;

/* ---------- Galerie complète avec chargement progressif ---------- */
function renderGallery() {
  const grid = document.getElementById('full-gallery');
  const loadBtn = document.getElementById('load-more');
  if (!grid || typeof REALISATIONS === 'undefined') return;

  const slice = REALISATIONS.slice(0, visibleCount);

  grid.innerHTML = slice.map(
    (src, i) => `
    <figure class="gallery-item group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] cursor-pointer shadow-sm"
            data-index="${i}" role="button" tabindex="0"
            aria-label="Agrandir la photo de réalisation ${i + 1}">
      <img src="${src}"
           alt="${typeof GALLERY_ALTS !== 'undefined' ? GALLERY_ALTS[i % GALLERY_ALTS.length] : 'Réalisation rénovation KoSBoS Bat'}"
           class="w-full h-full object-cover"
           loading="lazy" decoding="async"
           onerror="this.closest('.gallery-item').style.display='none';">
      <div class="absolute inset-0 bg-kos-dark/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span class="text-white text-2xl" aria-hidden="true">🔍</span>
      </div>
      <figcaption class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/75 to-transparent text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Chantier ${i + 1}
      </figcaption>
    </figure>
  `
  ).join('');

  const lightbox = createLightbox({ getImages: () => REALISATIONS });

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

  if (loadBtn) {
    if (visibleCount >= REALISATIONS.length) {
      loadBtn.style.display = 'none';
    } else {
      loadBtn.style.display = 'inline-flex';
      loadBtn.textContent =
        'Afficher plus de réalisations (' +
        Math.min(BATCH_SIZE, REALISATIONS.length - visibleCount) +
        ')';
    }
  }
}

function initLoadMore() {
  const loadBtn = document.getElementById('load-more');
  if (!loadBtn || typeof REALISATIONS === 'undefined') return;

  loadBtn.addEventListener('click', () => {
    visibleCount = Math.min(visibleCount + BATCH_SIZE, REALISATIONS.length);
    renderGallery();
  });
}

/* ---------- Initialisation ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  renderGallery();
  initLoadMore();
  initContactLinks();
});
