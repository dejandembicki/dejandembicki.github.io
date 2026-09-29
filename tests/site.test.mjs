// Structure, links and SEO checks for the published files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readMarkup, readSiteFile, siteFileExists } from './helpers.mjs';

const html = readMarkup('index.html');

test('every local file referenced by index.html exists', () => {
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((url) => !/^(https?:|mailto:|tel:|#|data:)/.test(url));

  assert.ok(references.length > 0);
  for (const reference of references) {
    assert.ok(siteFileExists(reference), `missing file: ${reference}`);
  }
});

test('every in-page link points to an existing section', () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(target), `#${target} has no matching id`);
  }
});

test('ids are unique', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('images have alt text and dimensions', () => {
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /\balt="[^"]+"/, `image without alt: ${tag}`);
    assert.match(tag, /\bwidth="\d+"/, `image without width: ${tag}`);
    assert.match(tag, /\bheight="\d+"/, `image without height: ${tag}`);
  }
});

test('the page has the essential SEO tags', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title[^>]*>[^<]{10,70}<\/title>/, 'title should be 10–70 characters');
  assert.match(html, /<meta name="description"[^>]*content="[^"]{50,160}"/, 'description should be 50–160 characters');
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+"/);
  for (const lang of ['en', 'sr', 'de', 'x-default']) {
    assert.match(html, new RegExp(`hreflang="${lang}"`), `missing hreflang ${lang}`);
  }
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'exactly one <h1>');
});

test('structured data is valid JSON describing a Person', () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, 'no JSON-LD block');
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'Person');
  assert.ok(data.name);
});

test('robots.txt points to the sitemap, and the sitemap lists the canonical URL', () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
  assert.match(readSiteFile('robots.txt'), /Sitemap: https:\/\/\S+sitemap\.xml/);
  assert.ok(readSiteFile('sitemap.xml').includes(`<loc>${canonical}</loc>`));
});

test('a custom 404 page exists and is not indexed', () => {
  assert.match(readSiteFile('404.html'), /<meta name="robots" content="noindex">/);
});
