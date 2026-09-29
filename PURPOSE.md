# Purpose

This repository is a **trial project on using AI in industry**: can someone whose
background is manufacturing rather than software build, publish and maintain a
real, production-quality website by working together with an AI coding assistant?

The author is a mechanical technician and CNC operator. The site was built in
VS Code with [Claude Code](https://claude.com/claude-code), Anthropic's AI coding
assistant. The author described what he wanted, made the decisions and reviewed
the results. The assistant wrote the code and explained how it works.

## The assignment

Implement, in a local folder and using VS Code with the Claude Code extension, a
personal website with contact details, a photo, a history of jobs and projects,
interests outside work and some interesting facts, and make it upload itself
automatically to the cloud, where it is publicly available.

### Acceptance criteria

| # | Criterion | How it is met |
|---|-----------|---------------|
| 1 | All code is on GitHub; all online content and code are in English | Public repository; English is the default language of the site, code, comments and docs |
| 2 | Free hosting on GitHub Pages; every change publishes a new version | `.github/workflows/deploy.yml` deploys on every push to `main` |
| 3 | The site is available on the internet for testing | https://dejandembicki90-ctrl.github.io/licni-sajt/ |
| 4 | Responsive design for small and large screens | CSS grid layouts with breakpoints at 900, 860 and 600 px; mobile menu |
| 5 | Modern design with neatly aligned components | Design tokens, a consistent spacing scale, cards and a timeline |
| 6 | Dark and light theme | `css/tokens.css` and `js/modules/theme.js` |
| 7 | Language switching: Serbian, English, German | `js/modules/i18n.js` and `locales/*.json` |
| 8 | Loads fast and is optimised for SEO | No framework, fonts that do not block rendering, preloaded modules; meta, Open Graph, hreflang, JSON-LD, sitemap |
| 9 | Clean, componentised, readable code | CSS split by layer, one JS module per feature, commented |
| 10 | Commit history shows development in phases, each testable in isolation | See *Development phases* below; every push is tested and deployed |
| 11 | The author can explain where, how and why | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| 12 | Tasks documented publicly in PURPOSE.md | This file |
| 13 | Description, usage and deployment in README.md, Apache 2.0 license | [README.md](README.md), [LICENSE](LICENSE) |

## Development phases

Each phase is one commit (or a small group of commits) that was pushed, tested
and deployed on its own. Any phase can be checked out and opened in a browser
to see the site as it was at that point.

1. **First version.** A single page in Serbian with all sections, published to GitHub Pages.
2. **English and components.** Content translated to English; files moved to `site/`;
   CSS and JavaScript split into small components.
3. **Languages.** A language switcher for English, Serbian and German.
4. **SEO and performance.** Meta tags, a link preview image, structured data,
   sitemap, robots.txt, a 404 page, and faster font and script loading.
5. **Automated checks.** Tests run on GitHub before every deploy; a failing test blocks publishing.
6. **Documentation.** README, PURPOSE, architecture notes and the Apache 2.0 license.

## What the project shows

- **AI as a pair programmer.** The assistant wrote the code, and the human set the
  goals, supplied the real-world knowledge (CNC, glass and metal work) and approved each step.
- **Guard rails matter.** Automated tests caught real mistakes during development,
  and the pipeline refused to publish until they were fixed.
- **Understanding is part of the job.** The architecture notes explain the decisions
  in plain language, so the author can maintain the site and explain it.

## Status

The structure, features and pipeline are complete. Some personal details (exact
years, employer names, the photo, some projects and hobbies) are placeholders marked
with `EDIT:` comments in `site/index.html`, and are filled in over time.
