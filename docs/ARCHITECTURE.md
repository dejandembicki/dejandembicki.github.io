# Architecture: where, how and why

A short tour of the building blocks of the site. For each one: **where** it lives,
**how** it works and **why** it was done that way.

## 1. Plain HTML, CSS and JavaScript

- **Where:** everything under `site/`.
- **How:** the browser receives the files exactly as they are written. There is no
  framework, no bundler and no build step.
- **Why:** a one-page personal site does not need a framework. Fewer moving parts
  means faster loading, nothing to install, and code that a beginner can open and read.
  GitHub Pages can serve the folder directly.

## 2. Page structure (`site/index.html`)

- **How:** semantic HTML elements: `<header>`, `<nav>`, `<main>`, one `<section>` per
  topic, `<footer>`. Each section has an `id` (`#about`, `#experience` …), and the menu links to those ids.
- **Why:** semantic tags help screen readers and search engines understand the page.
  One page with anchors keeps navigation instant, with no page reloads.

## 3. Styles in four layers (`site/css/`)

| File | Contains |
|------|----------|
| `tokens.css` | All colours, fonts, radii and shadows as CSS variables, for light and dark |
| `base.css` | Reset, typography, the page container, the scroll animation |
| `components.css` | Reusable pieces: navigation, buttons, tags, cards, section headings, language switch |
| `sections.css` | Layout of each page section: hero, about, timeline, fun facts, contact, footer |

- **How:** the files are loaded in this order, from general to specific. Components
  only use variables such as `var(--color-accent)`, never raw colours.
- **Why:** each file has one job, so it is clear where to make a change. The
  variables are also what makes theming possible (next section).

### Responsive layout

- **How:** CSS Grid and Flexbox, with `@media` breakpoints at 900 px (the menu
  collapses into a hamburger), 860 px (the hero and about sections stack) and 600 px
  (the timeline and spacing become narrower). Font sizes use `clamp()` to scale smoothly.
- **Why:** one set of HTML adapts to every screen, from phones to desktops.

## 4. Light and dark theme

- **Where:** `css/tokens.css`, `js/modules/theme.js`, and a small script in `<head>`.
- **How:**
  1. By default the CSS media query `prefers-color-scheme` follows the OS setting.
  2. The toggle button sets `<html data-theme="dark|light">`, which overrides the
     OS setting, and saves the choice in `localStorage`.
  3. The inline script in `<head>` re-applies the saved choice *before* the page is
     drawn, so a dark-mode visitor never sees a white flash.
- **Why:** respecting the system setting is the most comfortable default. Because
  every colour is a variable, the dark theme is only a second list of values.

## 5. Three languages (`js/modules/i18n.js`, `locales/`)

- **How:**
  - The HTML is written in English. Every translatable element has a key:
    `<p data-i18n="hero.lead">…</p>`. Attributes use `data-i18n-attr="alt:hero.photoAlt"`.
  - `locales/en.json`, `sr.json` and `de.json` map each key to its text.
  - On load, the language is chosen from `?lang=` in the URL, then the visitor's
    previous choice, then the browser language, and finally English.
  - Switching downloads the JSON once, replaces the texts, and updates `<html lang>`
    and the URL (`?lang=sr`), so the current language can be shared as a link.
- **Why:** the English HTML means the page works even without JavaScript, and search
  engines see real content. Keeping texts in JSON separates *content* from *code*,
  so a translation can be fixed without touching HTML. The tests make sure no
  language is ever missing a text.

## 6. JavaScript modules (`site/js/`)

| Module | Job |
|--------|-----|
| `main.js` | Entry point; connects each module to its element on the page |
| `modules/theme.js` | Theme toggle |
| `modules/navigation.js` | Mobile menu: open, close on link click or Escape |
| `modules/reveal.js` | Fade-in of sections while scrolling (`IntersectionObserver`) |
| `modules/i18n.js` | Language detection and switching |

- **How:** native ES modules (`<script type="module">`), which the browser loads
  without a build step. Each module exports one `init…` function.
- **Why:** one feature per file is easy to find, read and test on its own. Features
  do not depend on each other.

## 7. Speed

- No framework: about 20 KB of our own CSS and JS in total, uncompressed and with comments
  (GitHub Pages serves them compressed, which is several times smaller).
- Web fonts load **without blocking** the first paint (`media="print"` switched to
  `all` on load, plus `display=swap`), and only the font weights in use are requested.
- `<link rel="modulepreload">` fetches all JS modules in parallel.
- The scroll animation uses `IntersectionObserver` instead of scroll events.
- Images have fixed `width`/`height`, so the layout does not jump while they load.
- The site is served from GitHub's global CDN.

## 8. SEO

- `<title>` and `<meta name="description">` (both translated), `<link rel="canonical">`.
- `hreflang` links for `en`, `sr` and `de`, so search engines know about each language.
- Open Graph and Twitter tags with a 1200×630 preview image (`images/og-image.png`)
  for nice link previews on social networks and messengers.
- JSON-LD structured data (`schema.org/Person`) describing who the site is about.
- `robots.txt` and `sitemap.xml`; a custom `404.html` marked `noindex`.
- One `<h1>`, meaningful headings, and `alt` text on images.

## 9. Accessibility

A "skip to content" link, `aria-label`s on icon buttons, `aria-pressed` on the language
buttons, `aria-expanded` on the menu, visible keyboard focus, and animations turned
off for visitors who prefer reduced motion.

## 10. Tests (`tests/`)

- **How:** Node's built-in test runner (`node --test`), with no dependencies.
  - `i18n.test.mjs`: every language has the same keys, no text is empty, every key
    used in HTML exists (and the other way round), the English HTML matches
    `en.json`, and browser language codes map correctly.
  - `site.test.mjs`: all referenced files exist, in-page links lead somewhere, ids
    are unique, images have alt text and dimensions, the SEO tags are present, the
    JSON-LD is valid, and the sitemap and 404 page are in place.
- **Why:** these are the mistakes that are easy to make by hand (a forgotten
  translation, a renamed file, a broken link) and hard to notice by eye.

## 11. Deployment (`.github/workflows/deploy.yml`)

```
git push → GitHub Actions
             ├─ test:   npm test
             └─ deploy: (only if test passed) upload site/ → GitHub Pages
```

- **Why GitHub Pages:** free, HTTPS by default, served from a CDN, and it lives next
  to the code. **Why Actions:** every push is checked and published the same way,
  automatically. Only the `site/` folder is published, so tests and docs stay out of the public site.
