/**
 * Fades elements in as they scroll into view.
 * IntersectionObserver is used instead of scroll events because the browser
 * does the visibility math off the main thread, which keeps scrolling smooth.
 *
 * Elements that share a parent (cards in a grid, jobs in the timeline) appear one
 * after another: each gets a slightly longer --reveal-delay than the one before it.
 * The delay is removed once the element is shown, so hover effects stay instant.
 */
const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;

export function initReveal(selector = '.reveal') {
  const elements = document.querySelectorAll(selector);

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  elements.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((child) => child.matches(selector));
    const step = Math.min(siblings.indexOf(el), MAX_STAGGER_STEPS);
    if (step > 0) {
      el.style.setProperty('--reveal-delay', `${step * STAGGER_MS}ms`);
      el.addEventListener('transitionend', () => el.style.removeProperty('--reveal-delay'), { once: true });
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}
