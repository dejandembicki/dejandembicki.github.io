/**
 * Typewriter effect in the hero: types a word, waits, deletes it, types the next.
 *
 * The words come from the element's data-words attribute ("glass|metal|…"), which the
 * language switcher replaces, so the effect always uses the current language.
 * Visitors who prefer reduced motion see the words change without the typing.
 */
const TYPE_DELAY = 75;
const DELETE_DELAY = 35;
const HOLD_DELAY = 1800;

export function initTyped(element) {
  if (!element) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;

  const words = () => element.dataset.words.split('|').filter(Boolean);

  if (reduceMotion) {
    setInterval(() => {
      index = (index + 1) % words().length;
      element.textContent = words()[index];
    }, 2500);
    return;
  }

  let text = element.textContent;
  let deleting = true;

  const tick = () => {
    const word = words()[index % words().length];
    if (deleting) {
      text = text.slice(0, -1);
      if (text === '') {
        deleting = false;
        index = (index + 1) % words().length;
      }
    } else {
      text = word.slice(0, text.length + 1);
    }
    element.textContent = text;

    if (!deleting && text === word) {
      deleting = true;
      setTimeout(tick, HOLD_DELAY);
    } else {
      setTimeout(tick, deleting ? DELETE_DELAY : TYPE_DELAY);
    }
  };

  // Start by showing the first word for a moment, then begin the cycle.
  setTimeout(tick, HOLD_DELAY);
}
