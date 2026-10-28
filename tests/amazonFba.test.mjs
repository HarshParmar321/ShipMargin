import assert from 'node:assert/strict';
import test from 'node:test';
import { FBA_US_FEES, calculateFba, fbaFulfillmentFee, fbaPeriodFor, fbaPriceBand, fbaSizeTier } from '../src/lib/amazonFba.mjs';

const near = (actual, expected, tolerance = 0.005) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≈ ${expected}`);

test('fee tables match the Seller Central page (count and cent checksum per table)', () => {
  // Counted and summed in the browser from the six tables on GABBX6GZPA8MSZGW (2026 columns only).
  const expected = {
    'core.nonpeak2026': [102, 126984], 'core.peak2026': [102, 134973],
    'apparel.nonpeak2026': [102, 129537], 'apparel.peak2026': [102, 137913],
    'dangerous.nonpeak2026': [102, 142920], 'dangerous.peak2026': [102, 155742],
  };
  const perLb = { sb: 0.38, lb: 0.38, xl50: 0.38, xl70: 0.75, xl150: 0.75, xl150p: 0.19 };
  for (const [key, [count, sum]] of Object.entries(expected)) {
    const [category, period] = key.split('.');
    let n = 0;
    let total = 0;
    for (const band of ['low', 'mid', 'high']) {
      const t = FBA_US_FEES[category][period][band];
      const values = [...t.ss, ...t.ls, t.ls3, t.ls3Step, ...Object.entries(perLb).flatMap(([k, step]) => [t[k], step])];
      n += values.length;
      total += values.reduce((acc, v) => acc + Math.round(v * 100), 0);
      assert.equal(t.ss.length, 8);
      assert.equal(t.ls.length, 12);
    }
    assert.equal(n, count, key);
    assert.equal(total, sum, key);
  }
});

test('Amazon example: mobile device case is small standard, 2+ to 4 oz, $2.49 (<$10, non-peak)', () => {
  const r = calculateFba({ length: 13.8, width: 9, height: 0.7, weight: 2.88, weightUnit: 'oz', price: 8, period: 'nonpeak2026' });
  assert.equal(r.tier, 'smallStandard');
  assert.equal(r.fee.label, '2+ to 4 oz');
  assert.equal(r.fee.fee, 2.49);
  assert.equal(calculateFba({ length: 13.8, width: 9, height: 0.7, weight: 2.88, weightUnit: 'oz', price: 8, period: 'peak2026' }).fee.fee, 2.68);
});

test('Amazon example: iron is large standard, 3.25+ to 3.5 lb, $7.13 non-peak and $7.67 peak', () => {
  const r = calculateFba({ length: 12.6, width: 6.6, height: 5.5, weight: 3.35, price: 30, period: 'nonpeak2026' });
  assert.equal(r.tier, 'largeStandard');
  near(r.dimWeight, 3.29);
  assert.equal(r.basis, 'unit');
  assert.equal(r.fee.label, '3.25+ to 3.5 lb');
  assert.equal(r.fee.fee, 7.13);
  assert.equal(calculateFba({ length: 12.6, width: 6.6, height: 5.5, weight: 3.35, price: 30, period: 'peak2026' }).fee.fee, 7.67);
});

test('Amazon example: baby cot is Small Bulky, 7+ to 8 lb, $10.21 non-peak and $11.25 peak', () => {
  const r = calculateFba({ length: 24, width: 7.5, height: 6, weight: 7.9, price: 80, period: 'nonpeak2026' });
  assert.equal(r.tier, 'smallBulky');
  near(r.dimWeight, 7.77);
  assert.equal(r.fee.label, '7+ to 8 lb');
  assert.equal(r.fee.fee, 10.21);
  assert.equal(calculateFba({ length: 24, width: 7.5, height: 6, weight: 7.9, price: 80, period: 'peak2026' }).fee.fee, 11.25);
});

test('Amazon example: monitor is Extra-Large 0 to 50 lb on dimensional weight, $44.19 / $46.92', () => {
  const r = calculateFba({ length: 54, width: 35, height: 3.5, weight: 41, price: 40, period: 'nonpeak2026' });
  assert.equal(r.tier, 'xl0to50');
  near(r.dimWeight, 47.59);
  assert.equal(r.basis, 'dim');
  assert.equal(r.fee.label, '47+ to 48 lb');
  assert.equal(r.fee.fee, 44.19);
  assert.equal(calculateFba({ length: 54, width: 35, height: 3.5, weight: 41, price: 40, period: 'peak2026' }).fee.fee, 46.92);
});

test('Amazon example: TV is Extra-Large 50+ to 70 lb, 65+ to 66 lb, $48.57 / $51.38', () => {
  const r = calculateFba({ length: 65, width: 20, height: 7, weight: 62, price: 500, period: 'nonpeak2026' });
  assert.equal(r.tier, 'xl50to70');
  near(r.dimWeight, 65.47);
  assert.equal(r.fee.label, '65+ to 66 lb');
  assert.equal(r.fee.fee, 48.57);
  assert.equal(calculateFba({ length: 65, width: 20, height: 7, weight: 62, price: 500, period: 'peak2026' }).fee.fee, 51.38);
});

test('Amazon example: dry erase board gets the 2-inch minimum (14.4 lb)', () => {
  // Amazon's dimensional weight article labels this Small Bulky for 2026, but its 40 in longest side
  // is over the Small Bulky limit of 37 in in Amazon's own size tier table, so it is Large Bulky
  // (the Shipping weight article also says Large Bulky).
  const r = fbaSizeTier({ length: 40, width: 1, height: 25, weight: 4.5 });
  assert.equal(r.tier, 'largeBulky');
  assert.equal(r.minApplied, true);
  near(r.dimWeight, 14.39);
  assert.equal(r.basis, 'dim');
  assert.equal(fbaFulfillmentFee({ tier: r.tier, shippingWeight: r.shippingWeight, period: 'nonpeak2026', priceBand: 'mid' }).label, '14+ to 15 lb');
});

test('Amazon examples: glass jars 12+ to 12.25 lb; disposable plates 2.75+ to 3 lb; packaging example', () => {
  const jars = fbaSizeTier({ length: 16.6, width: 13.3, height: 7.7, weight: 6.6 });
  assert.equal(jars.tier, 'largeStandard');
  assert.equal(fbaFulfillmentFee({ tier: jars.tier, shippingWeight: jars.shippingWeight, priceBand: 'mid' }).label, '12+ to 12.25 lb');
  const plates = fbaSizeTier({ length: 6.3, width: 6.2, height: 4.8, weight: 3 });
  assert.equal(plates.basis, 'unit');
  assert.equal(fbaFulfillmentFee({ tier: plates.tier, shippingWeight: plates.shippingWeight, priceBand: 'mid' }).label, '2.75+ to 3 lb');
  const before = fbaSizeTier({ length: 12.2, width: 12, height: 4.3, weight: 3.6 });
  const after = fbaSizeTier({ length: 12.2, width: 12, height: 3.2, weight: 3.6 });
  assert.equal(fbaFulfillmentFee({ tier: before.tier, shippingWeight: before.shippingWeight, priceBand: 'mid' }).label, '4.5+ to 4.75 lb');
  assert.equal(fbaFulfillmentFee({ tier: after.tier, shippingWeight: after.shippingWeight, priceBand: 'mid' }).label, '3.5+ to 3.75 lb');
});

test('Amazon size tier examples: phone case small standard, T-shirt (8.5 × 4.8 × 1) large standard', () => {
  assert.equal(fbaSizeTier({ length: 13.8, width: 9, height: 0.7, weight: 2.88 / 16 }).tier, 'smallStandard');
  assert.equal(fbaSizeTier({ length: 8.5, width: 4.8, height: 1, weight: 6.08 / 16 }).tier, 'largeStandard');
});

test('no 2-inch minimum for standard-size units', () => {
  const r = fbaSizeTier({ length: 17, width: 13, height: 0.5, weight: 0.5 });
  assert.equal(r.tier, 'largeStandard');
  assert.equal(r.minApplied, false);
  near(r.dimWeight, (17 * 13 * 0.5) / 139, 1e-9);
});

test('tier boundaries are inclusive', () => {
  assert.equal(fbaSizeTier({ length: 15, width: 12, height: 0.75, weight: 1 }).tier, 'smallStandard');
  assert.equal(fbaSizeTier({ length: 15, width: 12, height: 0.76, weight: 1 }).tier, 'largeStandard');
  assert.equal(fbaSizeTier({ length: 18, width: 14, height: 8, weight: 10 }).tier, 'largeStandard');
  assert.equal(fbaSizeTier({ length: 18.1, width: 14, height: 8, weight: 10 }).tier, 'smallBulky');
  assert.equal(fbaSizeTier({ length: 10, width: 10, height: 5, weight: 20 }).tier, 'largeStandard');
  assert.equal(fbaSizeTier({ length: 10, width: 10, height: 5, weight: 20.01 }).tier, 'smallBulky');
  const box = fbaSizeTier({ length: 37, width: 28, height: 20, weight: 10 }); // dim 149.1 lb, length + girth 133
  assert.equal(box.tier, 'xl70to150');
  assert.equal(box.overmax, true);
});

test('length plus girth and Overmax', () => {
  const lb = fbaSizeTier({ length: 59, width: 18, height: 17, weight: 30 }); // 59 + 70 = 129, dim 130 lb
  assert.equal(lb.tier, 'xl70to150');
  const thin = fbaSizeTier({ length: 59, width: 2, height: 2, weight: 5 }); // lg 67, dim 1.7
  assert.equal(thin.tier, 'largeBulky');
  const over = fbaSizeTier({ length: 97, width: 4, height: 4, weight: 20 });
  assert.equal(over.tier, 'xl0to50');
  assert.equal(over.overmax, true);
  const heavy = fbaSizeTier({ length: 60, width: 30, height: 30, weight: 160 });
  assert.equal(heavy.tier, 'xl150plus');
  assert.equal(heavy.shippingWeight, 160);
  assert.equal(heavy.overmax, false);
  assert.equal(fbaSizeTier({ length: 90, width: 40, height: 40, weight: 100 }).tier, 'xlUnclear'); // dim 1,036 lb
});

test('fee band edges', () => {
  const ls = (w) => fbaFulfillmentFee({ tier: 'largeStandard', shippingWeight: w, category: 'core', period: 'nonpeak2026', priceBand: 'mid' });
  assert.equal(ls(0.25).label, '4 oz or less');
  assert.equal(ls(1).label, '12+ to 16 oz');
  assert.equal(ls(1.01).label, '1+ to 1.25 lb');
  assert.equal(ls(3).label, '2.75+ to 3 lb');
  assert.equal(ls(3).fee, 6.67);
  assert.equal(ls(3.01).fee, 7.05);
  assert.equal(ls(20).fee, 12.41); // 6.97 + 68 × 0.08
  const apparel = fbaFulfillmentFee({ tier: 'largeStandard', shippingWeight: 3.6, category: 'apparel', period: 'nonpeak2026', priceBand: 'mid' });
  assert.equal(apparel.label, '3.5+ to 4 lb');
  assert.equal(apparel.fee, 7.29); // 6.97 + 2 × 0.16
  const ss = (oz) => fbaFulfillmentFee({ tier: 'smallStandard', shippingWeight: oz / 16, period: 'nonpeak2026', priceBand: 'mid' });
  assert.equal(ss(2).label, '2 oz or less');
  assert.equal(ss(2.1).label, '2+ to 4 oz');
  assert.equal(ss(16).fee, 3.96);
  assert.equal(fbaFulfillmentFee({ tier: 'smallBulky', shippingWeight: 0.6, period: 'nonpeak2026', priceBand: 'mid' }).fee, 7.55);
  assert.equal(fbaFulfillmentFee({ tier: 'xl150plus', shippingWeight: 160, period: 'nonpeak2026', priceBand: 'mid' }).fee, 196.66); // 194.95 + 9 × 0.19
  assert.equal(fbaFulfillmentFee({ tier: 'xlUnclear', shippingWeight: 200, period: 'nonpeak2026', priceBand: 'mid' }), null);
});

test('price bands, periods and units', () => {
  assert.equal(fbaPriceBand(9.99), 'low');
  assert.equal(fbaPriceBand(10), 'mid');
  assert.equal(fbaPriceBand(50), 'mid');
  assert.equal(fbaPriceBand(50.01), 'high');
  assert.equal(fbaPriceBand(''), null);
  assert.equal(fbaPeriodFor('2026-10-14'), 'nonpeak2026');
  assert.equal(fbaPeriodFor('2026-10-15'), 'peak2026');
  assert.equal(fbaPeriodFor('2027-01-14'), 'peak2026');
  assert.equal(fbaPeriodFor('2027-01-15'), null);
  const metric = calculateFba({ length: 32.004, width: 16.764, height: 13.97, weight: 1.51953, dimUnit: 'cm', weightUnit: 'kg', price: 30, period: 'nonpeak2026' });
  assert.equal(metric.fee.fee, 7.13); // the iron in cm / kg
  assert.equal(calculateFba({ length: 10, width: 8, height: 0, weight: 1 }), null);
  assert.equal(calculateFba({ length: 10, width: 8, height: 2, weight: 1 }).fee, null);
  const surcharge = calculateFba({ length: 12.6, width: 6.6, height: 5.5, weight: 3.35, price: 30, period: 'nonpeak2026' });
  assert.equal(surcharge.feeWithSurcharge, 7.38); // 7.13 × 1.035 = 7.3796
});
