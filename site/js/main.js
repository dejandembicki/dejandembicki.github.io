/**
 * Entry point. Each feature lives in its own module under ./modules;
 * this file only wires them to the page.
 */
import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initReveal } from './modules/reveal.js';
import { initLanguageSwitcher } from './modules/i18n.js';

initLanguageSwitcher(document.querySelector('.lang-switch'));
initTheme(document.getElementById('theme-toggle'));
initNavigation(document.getElementById('site-menu'), document.getElementById('menu-toggle'));
initReveal();

document.getElementById('current-year').textContent = new Date().getFullYear();
