// Unit tests for the pure helper functions of the browser modules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsConsent } from '../site/js/modules/consent.js';
import { parseNumber, formatNumber } from '../site/js/modules/fun-facts.js';

test('visitors in European time zones are asked for consent', () => {
  assert.equal(needsConsent('Europe/Belgrade'), true);
  assert.equal(needsConsent('Europe/Berlin'), true);
  assert.equal(needsConsent('Atlantic/Canary'), true);
  assert.equal(needsConsent('Asia/Nicosia'), true);
  assert.equal(needsConsent('America/New_York'), false);
  assert.equal(needsConsent('Asia/Tokyo'), false);
  assert.equal(needsConsent(undefined), false);
});

test('fun-fact numbers keep their decimals, separator and unit while counting', () => {
  const precision = parseNumber('0,01 mm');
  assert.deepEqual(precision, { value: 0.01, decimals: 2, separator: ',', suffix: ' mm' });
  assert.equal(formatNumber(0.5, precision), '0,50 mm');
  assert.equal(formatNumber(1, parseNumber('2')), '1');
  assert.equal(parseNumber('G00'), null);
});
