// Checks the dedupe and double-signal rules. Run: node scripts/watch.test.mjs
import assert from 'node:assert/strict';
import { triage, heat, card, sheetRow } from './watch.mjs';

const clue = (company, type, extra = {}) => ({ company, type, headline: 'h', why_now: 'w', fit: 4, freshness: 4, intent: 3, ...extra });

// two hunts return the same company with different types: one buyer, double signal
let seen = {};
let out = triage([clue('Bubble Me', 'hiring'), clue('bubble me', 'competitor')], seen, '2026-10-31');
assert.equal(out.length, 1);
assert.equal(out[0].double, true);
assert.deepEqual(seen.bubbleme.types, ['hiring', 'competitor']);

// already sent with the same type: dropped
out = triage([clue('Bubble Me', 'hiring')], seen);
assert.equal(out.length, 0);

// sent before, now a new type: comes back as a double
seen = { proteinpantry: { company: 'Protein Pantry', types: ['expansion'] } };
out = triage([clue('Protein Pantry', 'event'), clue('Asaya', 'expansion')], seen);
assert.deepEqual(out.map(s => [s.company, s.double]), [['Protein Pantry', true], ['Asaya', false]]);

// company names that match Object.prototype keys don't crash or collide
out = triage([clue('Constructor', 'hiring'), clue('toString', 'event')], {});
assert.equal(out.length, 2);

// double bonus never pushes heat past 100
assert.equal(heat({ fit: 5, freshness: 5, intent: 5, double: true }), 100);

// Slack text is escaped, and an empty day still says something
assert.match(card('Sobot', [{ ...clue('Marks & Spencer', 'event'), types: ['event'] }], 0).blocks[1].text.text, /Marks &amp; Spencer/);
assert.match(card('Sobot', [], 7).text, /7 already known/);

// a link that could break out of Slack's <url|label> syntax is dropped
const linked = u => card('Sobot', [{ ...clue('A', 'event'), types: ['event'], source_url: u }], 0).blocks[1].text.text;
assert.match(linked('https://example.com/a'), /<https:\/\/example\.com\/a\|source>/);
assert.doesNotMatch(linked('https://evil.com|click here'), /source>/);
assert.doesNotMatch(linked('javascript:alert(1)'), /source>/);

// sheet rows: web text that looks like a formula is stored as plain text
const row = sheetRow({ ...clue('=IMPORTXML("http://evil")', 'hiring'), types: ['hiring', 'event'], headline: '+1 raise' });
assert.equal(row.company, `'=IMPORTXML("http://evil")`);
assert.equal(row.headline, "'+1 raise");
assert.equal(row.type, 'hiring + event');
assert.equal(typeof row.heat, 'number');

console.log('watch rules ok');
