/**
 * Entry point. Each feature lives in its own module under ./modules;
 * this file only wires them to the page. Features whose element is missing
 * on a page (the legal pages have no menu or timeline) simply do nothing.
 */
import { initConsent } from './modules/consent.js';
import { initTheme } from './modules/theme.js';
import { initNavigation, initScrollProgress } from './modules/navigation.js';
import { initReveal } from './modules/reveal.js';
import { initLanguageSwitcher } from './modules/i18n.js';
import { initTyped } from './modules/typed.js';
import { initCounters, initRotator } from './modules/fun-facts.js';
import { initHints } from './modules/hints.js';
import { initCopyButtons } from './modules/copy.js';

initConsent(document.getElementById('consent'));
initLanguageSwitcher(document.querySelector('.lang-switch'));
initTheme(document.getElementById('theme-toggle'));
initNavigation(document.getElementById('site-menu'), document.getElementById('menu-toggle'));
initScrollProgress(document.querySelector('.nav__progress'));
initReveal();
initTyped(document.querySelector('.typed'));
initCounters();
initRotator(document.querySelector('.fun-note'));
initHints();
initCopyButtons();

document.getElementById('current-year').textContent = new Date().getFullYear();
