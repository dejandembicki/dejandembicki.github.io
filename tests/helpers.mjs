// Shared helpers for the test files: paths and simple readers for the site sources.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const SITE_DIR = fileURLToPath(new URL('../site/', import.meta.url));
export const LANGUAGES = ['en', 'sr', 'de'];

export function readSiteFile(relativePath) {
  return readFileSync(path.join(SITE_DIR, relativePath), 'utf8');
}

export function siteFileExists(relativePath) {
  return existsSync(path.join(SITE_DIR, relativePath));
}

// Returns a page's markup without HTML comments, so examples in comments are not mistaken for real markup.
export function readMarkup(relativePath) {
  return readSiteFile(relativePath).replace(/<!--[\s\S]*?-->/g, '');
}

export function readLocale(lang) {
  return JSON.parse(readSiteFile(`locales/${lang}.json`));
}

// Decodes the few HTML entities used in index.html.
export function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Collapses whitespace, since HTML text may be wrapped across lines.
export function normalizeSpace(text) {
  return text.replace(/\s+/g, ' ').trim();
}
