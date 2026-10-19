import test from 'node:test';
import assert from 'node:assert/strict';
import {week,families} from './data';
import {format,tidy,submit} from './logic';

test('Titles keep proper names capitalised and only lower-case a leading article', () => {
  const titles = week.flat().map(p => p.title);
  assert.ok(titles.includes('Same calories as a Big Mac?'));
  assert.ok(titles.includes('As tall as the Eiffel Tower?'));
  for (const t of titles.filter(t => t.startsWith('As tall as the '))) assert.match(t, /^As tall as the [A-Z]/, t);
  for (const t of titles) assert.ok(!/big mac|eiffel|liberty|london eye|saturn|gateway/.test(t), `lower-cased name in "${t}"`);
});

test('No card reads as a one-item portion', () => {
  for (const p of week.flat()) for (const item of [p.target, ...p.items]) assert.ok(!item.subtitle.startsWith('1 × '), item.id);
});

test('Totals are free of floating-point noise', () => {
  assert.equal(tidy(0.1 + 0.2), 0.3);
  for (const p of week.flat()) {
    const a = submit(p, p.items.slice(0, 3).map(x => x.id));
    assert.equal(a.total, tidy(a.total));
  }
});

test('Distances show whole kilometres and whole-dollar prices format cleanly', () => {
  assert.equal(format(3935.75, 'distance'), '3,936 km');
  assert.equal(format(1000, 'price'), '$1,000');
  assert.equal(format(629.99, 'price'), '$629.99');
});

test('No card, target or portion family shows up on more than one day', () => {
  const firstDay = new Map<string, number>();
  week.forEach((day, d) => {
    const today = new Set(day.flatMap(p => [p.target, ...p.items]).filter(i => !i.id.startsWith('budget-')).flatMap(families));
    for (const f of today) { assert.ok(!firstDay.has(f), `${f} appears on day ${firstDay.get(f)! + 1} and day ${d + 1}`); firstDay.set(f, d); }
  });
});
