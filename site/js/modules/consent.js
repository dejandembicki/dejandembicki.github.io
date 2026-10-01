/**
 * Privacy banner and Google Fonts consent.
 *
 * The site sets no cookies. The only thing that reaches a third party is the
 * web font download from Google Fonts, which reveals the visitor's IP address
 * to Google. Visitors in Europe (GDPR) are therefore asked first; until they
 * accept, the page uses the system fonts named after "Inter"/"Fraunces" in tokens.css.
 * Everyone else gets the web fonts straight away.
 *
 * The choice ("accepted" or "declined") is kept in localStorage, and the
 * "Privacy settings" button in the footer opens the banner again.
 */
export const CONSENT_STORAGE_KEY = 'consent';

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,700&display=swap';

// Time zones of the EU/EEA and the rest of Europe. The time zone is a privacy-friendly
// guess at the visitor's region: no IP lookup and no request to any server.
const EUROPEAN_TIME_ZONE = /^(Europe\/|Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)|Asia\/(Nicosia|Famagusta)$)/;

export function needsConsent(timeZone) {
  return EUROPEAN_TIME_ZONE.test(timeZone ?? '');
}

function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return '';
  }
}

function readChoice() {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeChoice(choice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
}

function loadFonts() {
  if (document.getElementById('web-fonts')) return;
  const link = document.createElement('link');
  link.id = 'web-fonts';
  link.rel = 'stylesheet';
  link.href = FONTS_URL;
  document.head.append(link);
}

export function initConsent(banner) {
  const choice = readChoice();
  const askFirst = needsConsent(visitorTimeZone());

  if (choice === 'accepted' || (!choice && !askFirst)) loadFonts();
  if (!banner) return;

  const show = () => {
    banner.hidden = false;
    // The next frame starts the slide-in transition.
    requestAnimationFrame(() => banner.classList.add('is-open'));
  };
  const hide = () => {
    banner.classList.remove('is-open');
    banner.hidden = true;
  };

  if (!choice && askFirst) show();

  banner.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent]');
    if (!button) return;
    storeChoice(button.dataset.consent);
    if (button.dataset.consent === 'accepted') loadFonts();
    hide();
  });

  document.querySelectorAll('[data-consent-open]').forEach((button) => {
    button.addEventListener('click', show);
  });
}
