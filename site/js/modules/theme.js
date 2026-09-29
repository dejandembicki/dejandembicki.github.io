/**
 * Light / dark theme toggle.
 *
 * With no saved choice the site follows the OS setting (pure CSS, see tokens.css).
 * Clicking the toggle stores an explicit "light" or "dark" on <html data-theme>
 * and in localStorage. The inline script in <head> re-applies it before first paint.
 */
export const THEME_STORAGE_KEY = 'theme';

function currentTheme() {
  const explicit = document.documentElement.dataset.theme;
  if (explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initTheme(toggleButton) {
  if (!toggleButton) return;

  toggleButton.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  });
}
