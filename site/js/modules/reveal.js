/**
 * Fades elements in as they scroll into view.
 * IntersectionObserver is used instead of scroll events because the browser
 * does the visibility math off the main thread, which keeps scrolling smooth.
 */
export function initReveal(selector = '.reveal') {
  const elements = document.querySelectorAll(selector);

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

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
