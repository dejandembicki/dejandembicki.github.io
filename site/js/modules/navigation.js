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
