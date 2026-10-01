/**
 * Fun facts: numbers that count when they scroll into view, and a "Did you know?"
 * note that changes every few seconds.
 */

// Splits "0,01 mm" into { value: 0.01, decimals: 2, separator: ",", suffix: " mm" }.
export function parseNumber(text) {
  const match = text.trim().match(/^(\d+)(?:([.,])(\d+))?(.*)$/);
  if (!match) return null;
  const [, whole, separator = '.', fraction = '', suffix] = match;
  return { value: Number(`${whole}.${fraction || 0}`), decimals: fraction.length, separator, suffix };
}

export function formatNumber(value, { decimals, separator, suffix }) {
  return value.toFixed(decimals).replace('.', separator) + suffix;
}

/**
 * Elements with data-count-from="n" count from n to the number they show.
 * Counting from a larger number down (1.00 → 0.01 mm) suits a precision value.
 */
function animateCount(element, duration = 1400) {
  const target = element.textContent;
  const parsed = parseNumber(target);
  if (!parsed) return;
  const from = Number(element.dataset.countFrom);
  const start = performance.now();
  let written = formatNumber(from, parsed);
  element.textContent = written;

  const frame = (now) => {
    // Stop if the language switcher replaced the text in the meantime.
    if (element.textContent !== written) return;
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    written = progress < 1 ? formatNumber(from + (parsed.value - from) * eased, parsed) : target;
    element.textContent = written;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function initCounters(selector = '[data-count-from]') {
  const elements = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  elements.forEach((el) => observer.observe(el));
}

/** Shows one child of the container at a time, switching every few seconds; pauses on hover or focus. */
export function initRotator(container, interval = 7000) {
  if (!container) return;
  const items = [...container.querySelectorAll('[data-rotate-item]')];
  if (items.length < 2) return;
  let index = 0;
  let paused = false;

  container.addEventListener('mouseenter', () => (paused = true));
  container.addEventListener('mouseleave', () => (paused = false));
  container.addEventListener('focusin', () => (paused = true));
  container.addEventListener('focusout', () => (paused = false));

  setInterval(() => {
    if (paused || document.hidden) return;
    items[index].classList.remove('is-active');
    index = (index + 1) % items.length;
    items[index].classList.add('is-active');
  }, interval);
}
