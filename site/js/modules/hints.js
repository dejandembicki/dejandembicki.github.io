/**
 * Extra information on the work-history timeline.
 *
 * On devices with a mouse the hint appears when hovering the job title (pure CSS).
 * The [i] button opens and closes the same hint on touch screens and for keyboard users.
 * Tapping elsewhere or pressing Escape closes it.
 */
export function initHints(root = document) {
  const buttons = [...root.querySelectorAll('.job__info')];
  if (buttons.length === 0) return;

  const closeAll = (except) => {
    buttons.forEach((button) => {
      if (button !== except) button.setAttribute('aria-expanded', 'false');
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = button.getAttribute('aria-expanded') !== 'true';
      closeAll(button);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.job__hint')) closeAll();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
}
