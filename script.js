// =========================================
// QILAN — Site Interactions
// =========================================

(function () {
  'use strict';

  // --- Navigation scroll effect ---
  const nav = document.getElementById('siteNav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const revealPoint = windowHeight * 0.88;
      if (rect.top < revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  // Run on load and scroll
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('load', checkReveal);
  // Also run immediately in case elements are already in view
  checkReveal();

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Cursor glow on project cards (subtle) ---
  document.querySelectorAll('.project-card, .service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background =
        'radial-gradient(600px circle at ' +
        x + 'px ' + y + 'px, rgba(200,169,110,0.04), transparent 40%)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

  // --- Counter animation for stats ---
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(function (el) {
      const text = el.textContent.trim();
      // Only animate numeric values
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      if (el.dataset.animated) return;

      const target = parseInt(match[1], 10);
      const suffix = match[2]; // e.g. "+", "K+", etc.
      const duration = 1500;
      const start = performance.now();
      el.dataset.animated = 'true';

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * ease);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Use IntersectionObserver for counter trigger
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(statsSection);
  }
})();
