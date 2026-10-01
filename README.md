# Personal website — Dejan Dembicki

The personal website of Dejan Dembicki, a mechanical technician and CNC operator.
It covers my work history, projects, hobbies, a few fun facts and contact details.

**Live site:** https://dejandembicki90-ctrl.github.io/licni-sajt/

- Static site: plain HTML, CSS and JavaScript, with no framework and no build step
- Works on phones, tablets and desktops (responsive)
- Light and dark theme (follows the system setting, can be switched manually)
- Three languages: English, Serbian and German
- SEO-ready: meta and Open Graph tags, structured data, sitemap, robots.txt
- Short privacy policy, terms of use and license pages, in all three languages
- Automatically tested and published to GitHub Pages on every push to `main`

Why the project exists and how it was made is described in [PURPOSE.md](PURPOSE.md).
How the code is organised, and why it is built this way, is described in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Project structure

```
site/                    ← everything that gets published
  index.html             ← page content (English by default)
  privacy.html, terms.html, license.html ← short legal pages, linked from the footer
  404.html               ← "page not found" page
  css/                   ← tokens → base → components → sections
  js/main.js             ← entry point that wires up the modules
  js/modules/            ← theme, navigation, reveal animation, i18n
  locales/               ← en.json, sr.json, de.json (translated texts)
  images/                ← logo, hero artwork, icons, link preview image
  robots.txt, sitemap.xml
tests/                   ← automated checks (Node's built-in test runner)
docs/ARCHITECTURE.md     ← where, how and why
.github/workflows/       ← test and deploy pipeline
```

## Usage

### View the site locally

The language files are loaded with `fetch`, which browsers block for pages opened
straight from disk (`file://`). Use a small local web server instead:

- **VS Code:** install the **Live Server** extension, right-click `site/index.html`
  and choose **Open with Live Server**.
- **Or, with Node.js installed:** `npx serve site`, then open the address it prints.

If you open `index.html` directly, the page still works in English; only language
switching is unavailable.

### Edit the content

1. Change the English text in `site/index.html`.
2. Change the same key in `site/locales/en.json`, `sr.json` and `de.json`.
   Each translatable element has a `data-i18n="key"` attribute that names its key.
3. To use a real photo, add it to `site/images/` (square, about 640×640 px)
   and update the `src` of the hero image.

Places that still hold placeholder content are marked with `EDIT:` comments.

### Run the tests

With [Node.js](https://nodejs.org) 20 or newer:

```bash
npm test
```

No packages need to be installed. The same tests run on GitHub for every push.

## Deployment (upload)

Publishing is automatic. The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:

1. **test**: runs `npm test`.
2. **deploy**: only if the tests passed, uploads the `site/` folder to GitHub Pages.

After about a minute the new version is live. A failing test stops the deploy,
so a broken version never reaches the public site.

To publish a change:

```bash
git add .
git commit -m "Describe the change"
git push
```

In VS Code you can do the same from the **Source Control** panel: write a message, **Commit**, then **Sync Changes**.

### One-time setup (already done for this repository)

1. Create a public GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages → Build and deployment**
   and set **Source** to **GitHub Actions**.

## License

Licensed under the [Apache License 2.0](LICENSE). Copyright 2026 Dejan Dembicki.
