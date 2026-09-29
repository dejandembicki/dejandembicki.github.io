// Translation checks: every language has every text, and the HTML only uses keys that exist.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, readLocale, readMarkup, decodeEntities, normalizeSpace } from './helpers.mjs';
import { normalizeLanguage, SUPPORTED_LANGUAGES } from '../site/js/modules/i18n.js';

const html = readMarkup('index.html');
const locales = Object.fromEntries(LANGUAGES.map((lang) => [lang, readLocale(lang)]));

const textKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
const attrKeys = [...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((m) =>
  m[1].split(';').map((pair) => pair.split(':')[1].trim())
);
const usedKeys = new Set([...textKeys, ...attrKeys]);

test('the supported languages match the locale files', () => {
  assert.deepEqual([...SUPPORTED_LANGUAGES].sort(), [...LANGUAGES].sort());
});

test('all locales define exactly the same keys', () => {
  const englishKeys = Object.keys(locales.en).sort();
  for (const lang of LANGUAGES) {
    assert.deepEqual(Object.keys(locales[lang]).sort(), englishKeys, `keys differ in ${lang}.json`);
  }
});

test('no translation is empty', () => {
  for (const lang of LANGUAGES) {
    for (const [key, value] of Object.entries(locales[lang])) {
      assert.ok(typeof value === 'string' && value.trim() !== '', `${lang}.json: "${key}" is empty`);
    }
  }
});

test('every key used in index.html exists in the locales', () => {
  for (const key of usedKeys) {
    assert.ok(key in locales.en, `index.html uses unknown key "${key}"`);
  }
});

test('every locale key is used in index.html', () => {
  for (const key of Object.keys(locales.en)) {
    assert.ok(usedKeys.has(key), `en.json has unused key "${key}"`);
  }
});

test('the English text in index.html matches en.json', () => {
  // Matches simple elements such as <p data-i18n="key">text</p>.
  for (const [, key, raw] of html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)) {
    assert.equal(normalizeSpace(decodeEntities(raw)), locales.en[key], `text for "${key}" differs`);
  }
});

test('browser language codes map to supported languages', () => {
  assert.equal(normalizeLanguage('en-US'), 'en');
  assert.equal(normalizeLanguage('sr-Latn-RS'), 'sr');
  assert.equal(normalizeLanguage('hr'), 'sr');
  assert.equal(normalizeLanguage('de-AT'), 'de');
  assert.equal(normalizeLanguage('fr'), null);
  assert.equal(normalizeLanguage(null), null);
});
