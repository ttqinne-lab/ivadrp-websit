(function () {
  'use strict';

  if (typeof document === 'undefined') return;

  const nodes = Array.from(document.querySelectorAll('.polish-reveal'));
  if (!nodes.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealAll = () => nodes.forEach((node) => node.classList.add('is-visible'));

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  document.body.classList.add('reveal-ready');
  nodes.forEach((node, index) => {
    node.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  nodes.forEach((node) => observer.observe(node));

  const handleMotionChange = (event) => {
    if (!event.matches) return;
    observer.disconnect();
    revealAll();
  };

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', handleMotionChange, { once: true });
  } else if (reducedMotion.addListener) {
    reducedMotion.addListener(handleMotionChange);
  }
})();
