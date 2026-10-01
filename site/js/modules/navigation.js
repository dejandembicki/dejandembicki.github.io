/**
 * Mobile navigation: the hamburger button opens and closes the link list.
 * On wide screens the button is hidden by CSS and the links are always visible.
 */
export function initNavigation(menu, toggleButton) {
  if (!menu || !toggleButton) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggleButton.setAttribute('aria-expanded', String(open));
  };

  toggleButton.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  // Close the menu after a link is chosen, or when Escape is pressed.
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

/**
 * Thin progress bar under the header that fills as the page is scrolled.
 * The work is batched into one update per animation frame, so scrolling stays smooth.
 */
export function initScrollProgress(bar) {
  if (!bar) return;
  let queued = false;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    queued = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}
