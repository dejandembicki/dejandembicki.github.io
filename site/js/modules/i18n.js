/**
 * Language switching (English, Serbian, German).
 *
 * The HTML is written in English so it works without JavaScript and search
 * engines index real content. Translatable elements carry a key:
 *   data-i18n="hero.lead"                 -> replaces textContent
 *   data-i18n-attr="alt:hero.photoAlt"     -> replaces an attribute (";" separates several)
 * Texts for each language live in locales/<lang>.json.
 *
 * The chosen language is resolved in this order:
 *   1. ?lang=xx in the URL (so a link can open the site in a given language)
 *   2. the visitor's previous choice (localStorage)
 *   3. the browser's preferred languages
 *   4. English
 */
export const SUPPORTED_LANGUAGES = ['en', 'sr', 'de'];
export const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'language';

// Browsers report Serbian variants (and close relatives) under several codes.
const LANGUAGE_ALIASES = { sh: 'sr', hr: 'sr', bs: 'sr', cnr: 'sr' };

const cache = new Map();

function normalize(code) {
  if (!code) return null;
  const base = code.toLowerCase().split('-')[0];
  const lang = LANGUAGE_ALIASES[base] ?? base;
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : null;
}

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore: the language still applies for this visit.
  }
}

export function detectLanguage() {
  const fromUrl = normalize(new URLSearchParams(window.location.search).get('lang'));
  if (fromUrl) return fromUrl;

  const stored = normalize(readStoredLanguage());
  if (stored) return stored;

  for (const code of navigator.languages ?? [navigator.language]) {
    const lang = normalize(code);
    if (lang) return lang;
  }
  return DEFAULT_LANGUAGE;
}

async function loadMessages(lang) {
  if (!cache.has(lang)) {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) throw new Error(`Could not load locale "${lang}" (${response.status})`);
    cache.set(lang, await response.json());
  }
  return cache.get(lang);
}

function applyMessages(messages, root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const text = messages[el.dataset.i18n];
    if (text !== undefined) el.textContent = text;
  });

  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attribute, key] = pair.split(':').map((part) => part.trim());
      const text = messages[key];
      if (attribute && text !== undefined) el.setAttribute(attribute, text);
    });
  });
}

// Keeps ?lang= in the address bar in sync, so the current view can be shared as a link.
function updateUrl(lang) {
  const url = new URL(window.location.href);
  if (lang === DEFAULT_LANGUAGE) url.searchParams.delete('lang');
  else url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', url);
}

function updateSwitcher(switcher, lang) {
  switcher?.querySelectorAll('[data-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
  });
}

export async function setLanguage(lang, switcher) {
  try {
    const messages = await loadMessages(lang);
    applyMessages(messages);
    document.documentElement.lang = lang;
    updateSwitcher(switcher, lang);
    updateUrl(lang);
    storeLanguage(lang);
  } catch (error) {
    // The English HTML stays in place, so a failed download never leaves the page broken.
    console.error(error);
  }
}

export function initLanguageSwitcher(switcher) {
  const initial = detectLanguage();
  if (initial !== DEFAULT_LANGUAGE) setLanguage(initial, switcher);
  else updateSwitcher(switcher, initial);

  switcher?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lang]');
    if (button) setLanguage(button.dataset.lang, switcher);
  });
}
