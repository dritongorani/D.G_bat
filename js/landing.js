/* ============================================================
   KoSBoS Bat — Comportements des pages métier
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initMobileMenu === 'function') initMobileMenu();
  if (typeof initScrollReveal === 'function') initScrollReveal();
  initLandingFaq();
  initLandingForm();
});

/* ---------- FAQ accordéon ---------- */
function initLandingFaq() {
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
function initLandingForm() {
  const form = document.getElementById('form-devis');
  const success = document.getElementById('message-succes');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : '';

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
        'Une erreur est survenue lors de l’envoi. Veuillez réessayer ou nous appeler au +33 6 03 43 99 54.'
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
}
