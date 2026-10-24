import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, PRESET_GROUPS, boxFits, calculatePackage, decodeShareParams, encodeShareParams, optimizeBoxes, parseAuditCsv, parseBoxes } from '../src/lib/shipping.mjs';

test('calculates imperial dimensional and billable weight', () => {
  const result = calculatePackage({
    unit: 'imperial',
    length: 18,
    width: 14,
    height: 12,
    actualWeight: 8,
    divisor: 139,
  });
  assert.equal(result.volume, 3024);
  assert.equal(result.dimWeight, 22);
  assert.equal(result.billableWeight, 22);
  assert.equal(result.airWeight, 14);
});

test('calculates metric weight with half-kilogram rounding', () => {
  const result = calculatePackage({
    unit: 'metric',
    length: 40,
    width: 30,
    height: 20,
    actualWeight: 3,
    divisor: 5000,
    billableStep: 0.5,
  });
  assert.equal(result.volume, 24000);
  assert.equal(result.dimWeight, 5);
  assert.equal(result.billableWeight, 5);
});

test('calculates profit and margin', () => {
  const result = calculatePackage({
    salePrice: 100,
    productCost: 40,
    packagingCost: 5,
    shippingCost: 20,
    fees: 10,
  });
  assert.equal(result.profit, 25);
  assert.equal(result.marginPercent, 25);
});

test('parses a basic audit CSV', () => {
  const rows = parseAuditCsv('sku,length,width,height,weight,quantity\nA-1,12,10,8,4,2');
  assert.deepEqual(rows, [{ sku: 'A-1', length: 12, width: 10, height: 8, actualWeight: 4, quantity: 2 }]);
});

test('parses a box catalogue with optional packaging cost', () => {
  const boxes = parseBoxes('name,length,width,height,cost\nSlim,12,10,3,0.65');
  assert.deepEqual(boxes, [{ name: 'Slim', length: 12, width: 10, height: 3, cost: 0.65 }]);
});

test('allows a product to fit after rotating the box', () => {
  assert.equal(boxFits([10, 3, 8], [8, 10, 3]), true);
  assert.equal(boxFits([11, 8, 4], [10, 8, 4]), false);
});

test('chooses the lowest total-cost valid box and estimates savings', () => {
  const result = optimizeBoxes({
    unit: 'imperial', divisor: 139, billableStep: 1, roundDimensions: true,
    productLength: 11, productWidth: 8, productHeight: 2, actualWeight: 8,
    currentLength: 18, currentWidth: 14, currentHeight: 12,
    costPerWeight: 1, monthlyOrders: 100, currentPackagingCost: 1.2,
    productCost: 20, feesPerOrder: 4, targetMargin: 30,
    boxes: [
      { name: 'Slim', length: 12, width: 10, height: 3, cost: 0.65 },
      { name: 'Tiny but invalid', length: 8, width: 6, height: 3, cost: 0.2 },
      { name: 'Medium', length: 14, width: 10, height: 6, cost: 0.9 },
    ],
  });
  assert.equal(result.best.name, 'Slim');
  assert.equal(result.current.billableWeight, 22);
  assert.equal(result.best.result.billableWeight, 8);
  assert.equal(result.weightSavings, 14);
  assert.equal(result.savingsPerOrder, 14.55);
  assert.equal(result.monthlySavings, 1455);
  assert.ok(result.minimumSellingPrice > 46 && result.minimumSellingPrice < 47);
});

test('allows a valid box to override the automatic recommendation', () => {
  const input = {
    unit: 'imperial', divisor: 139, billableStep: 1, roundDimensions: true,
    productLength: 11, productWidth: 8, productHeight: 2, actualWeight: 8,
    currentLength: 18, currentWidth: 14, currentHeight: 12,
    costPerWeight: 1, monthlyOrders: 100, currentPackagingCost: 1.2,
    productCost: 20, feesPerOrder: 4, targetMargin: 30,
    boxes: [
      { name: 'Slim', length: 12, width: 10, height: 3, cost: 0.65 },
      { name: 'Small', length: 14, width: 10, height: 6, cost: 0.9 },
    ],
  };
  const automatic = optimizeBoxes(input);
  const smallKey = automatic.candidates.find((box) => box.name === 'Small').key;
  const overridden = optimizeBoxes({ ...input, selectedBoxKey: smallKey });
  assert.equal(overridden.recommended.name, 'Slim');
  assert.equal(overridden.selected.name, 'Small');
  assert.equal(overridden.best.name, 'Small');
  assert.equal(overridden.isRecommendedSelection, false);
  assert.equal(overridden.monthlySavings, 1430);
  assert.equal(Math.round(overridden.minimumSellingPrice * 100) / 100, 47);
});

const withPreset = (key, pkg) => {
  const { unit, divisor, dimThreshold, dimRounding, billableStep } = PRESETS[key];
  return calculatePackage({ unit, divisor, dimThreshold, dimRounding, billableStep, ...pkg });
};

test('presets: UPS, FedEx and USPS are separate, UPS Retail uses 166', () => {
  assert.deepEqual(PRESET_GROUPS.us, ['ups139', 'ups166', 'fedex139', 'usps139', 'metric5000', 'metric6000']);
  assert.equal(PRESETS.ups166.divisor, 166);
  assert.equal(PRESETS.ups139.divisor, 139);
  assert.equal(PRESETS.fedex139.divisor, 139);
  assert.equal(PRESETS.usps139.dimThreshold, 1728);
});

test('UPS rounds every fractional inch up', () => {
  const result = withPreset('ups139', { length: 10.1, width: 10.1, height: 10.1, actualWeight: 1 });
  assert.deepEqual(result.dimensions, [11, 11, 11]);
  assert.equal(result.dimWeight, 10); // 1331 / 139 = 9.58 -> 10
});

test('UPS Retail divisor 166', () => {
  const result = withPreset('ups166', { length: 18, width: 14, height: 12, actualWeight: 8 });
  assert.equal(result.dimWeight, 19); // 3024 / 166 = 18.2 -> 19
  assert.equal(result.billableWeight, 19);
});

test('FedEx defaults to round-up; nearest-whole mode is available', () => {
  const up = withPreset('fedex139', { length: 10.4, width: 10.4, height: 10.4, actualWeight: 1 });
  assert.deepEqual(up.dimensions, [11, 11, 11]);
  const nearest = withPreset('fedex139', { length: 10.4, width: 10.4, height: 10.6, actualWeight: 1, dimRounding: 'nearest' });
  assert.deepEqual(nearest.dimensions, [10, 10, 11]);
  assert.equal(nearest.dimWeight, 8); // 1100 / 139 = 7.9 -> 8
});

test('rounding mode none keeps exact dimensions', () => {
  const result = calculatePackage({ unit: 'imperial', length: 10.5, width: 10, height: 10, actualWeight: 1, divisor: 139, dimRounding: 'none' });
  assert.deepEqual(result.dimensions, [10.5, 10, 10]);
  assert.equal(result.dimWeight, 8); // 1050 / 139 = 7.55 -> 8
});

test('older roundDimensions flag still works', () => {
  assert.equal(calculatePackage({ length: 10.2, width: 1, height: 1, roundDimensions: false }).dimensions[0], 10.2);
  assert.equal(calculatePackage({ length: 10.2, width: 1, height: 1 }).dimensions[0], 11);
});

test('USPS: at or below 1,728 in³ bills scale weight', () => {
  const result = withPreset('usps139', { length: 12, width: 12, height: 12, actualWeight: 3 });
  assert.equal(result.volume, 1728);
  assert.equal(result.dimApplies, false);
  assert.equal(result.billableWeight, 3);
  assert.equal(result.isDimensional, false);
  assert.equal(result.canShrink, false);
});

test('USPS: above 1,728 in³ applies DIM weight (12.1 in rounds to 13)', () => {
  const result = withPreset('usps139', { length: 12.1, width: 12, height: 12, actualWeight: 3 });
  assert.equal(result.volume, 1872);
  assert.equal(result.dimApplies, true);
  assert.equal(result.billableWeight, 14); // 1872 / 139 = 13.47 -> 14
});

test('metric divisors 5,000 and 6,000 with half-kilogram steps', () => {
  const express = withPreset('metric5000', { length: 40, width: 30, height: 20.2, actualWeight: 3 });
  assert.equal(express.volume, 40 * 30 * 21);
  assert.equal(express.dimWeight, 5.5); // 25200 / 5000 = 5.04 -> 5.5
  const air = withPreset('metric6000', { length: 40, width: 30, height: 20.2, actualWeight: 3 });
  assert.equal(air.dimWeight, 4.5); // 25200 / 6000 = 4.2 -> 4.5
});

test('suggested smaller carton really reaches scale weight after rounding', () => {
  const result = withPreset('ups139', { length: 18, width: 14, height: 12, actualWeight: 8 });
  assert.equal(result.canShrink, true);
  result.targetDimensions.forEach((value) => assert.equal(Number.isInteger(value), true));
  const [length, width, height] = result.targetDimensions;
  const check = withPreset('ups139', { length, width, height, actualWeight: 8 });
  assert.ok(check.billableWeight <= 8, `target ${result.targetDimensions.join('x')} bills ${check.billableWeight} lb`);
});

test('share links round-trip every preset and reproduce the same answer', () => {
  const pkg = { length: 12.1, width: 12, height: 11.5, actualWeight: 3, quantity: 2 };
  for (const [key, rule] of Object.entries(PRESETS)) {
    const state = { ...pkg, preset: key, unit: rule.unit, divisor: rule.divisor, dimThreshold: rule.dimThreshold, dimRounding: rule.dimRounding, billableStep: rule.billableStep };
    const decoded = decodeShareParams(encodeShareParams(state));
    assert.deepEqual(decoded, state, `round trip failed for ${key}`);
    assert.equal(calculatePackage(decoded).billableWeight, calculatePackage(state).billableWeight);
  }
});

test('share links keep a custom rule and reject invalid values', () => {
  const state = { length: 10, width: 10, height: 10, actualWeight: 1, quantity: 1, preset: 'custom', unit: 'imperial', divisor: 150, dimThreshold: 500, dimRounding: 'nearest', billableStep: 0.5 };
  assert.deepEqual(decodeShareParams(encodeShareParams(state)), state);
  const bad = decodeShareParams('p=evil&r=sideways&s=7&d=-3&u=furlongs&l=abc');
  assert.deepEqual(bad, {});
});

test('old share links (imperial139, no preset) still open with the right rule', () => {
  const old = decodeShareParams('l=18&w=14&h=12&wt=8&u=imperial&d=139&p=imperial139');
  assert.equal(old.preset, 'ups139');
  assert.equal(old.dimRounding, 'up');
  const noPreset = decodeShareParams('l=18&w=14&h=12&wt=8&u=imperial&d=166');
  assert.equal(noPreset.divisor, 166);
  assert.equal(noPreset.preset, undefined);
});

test('box optimizer respects the USPS threshold', () => {
  const base = {
    unit: 'imperial', divisor: 139, billableStep: 1, dimRounding: 'up', actualWeight: 3,
    productLength: 10, productWidth: 10, productHeight: 10,
    currentLength: 14, currentWidth: 14, currentHeight: 14,
    costPerWeight: 1,
    boxes: [{ name: 'Cube 12', length: 12, width: 12, height: 12, cost: 0 }, { name: 'Long 13', length: 13, width: 12, height: 12, cost: 0 }],
  };
  const ups = optimizeBoxes(base);
  const usps = optimizeBoxes({ ...base, dimThreshold: 1728 });
  assert.equal(ups.recommended.result.billableWeight, 13); // 1728 / 139 = 12.4 -> 13
  assert.equal(usps.recommended.name, 'Cube 12');
  assert.equal(usps.recommended.result.billableWeight, 3); // at the threshold: scale weight
  assert.equal(usps.candidates[1].result.billableWeight, 14); // 1872 in³ is above it
});

test('USPS smaller-carton suggestion aims for the 1,728 in³ threshold', () => {
  const result = withPreset('usps139', { length: 16, width: 12, height: 10, actualWeight: 4 });
  assert.equal(result.canShrink, true);
  const [length, width, height] = result.targetDimensions;
  assert.ok(length * width * height <= 1728);
  assert.ok(length * width * height > 1200, `suggestion ${result.targetDimensions.join('x')} shrinks far more than needed`);
  assert.equal(withPreset('usps139', { length, width, height, actualWeight: 4 }).billableWeight, 4);
});

test('every preset in every page group exists and has a valid rule', () => {
  for (const [group, keys] of Object.entries(PRESET_GROUPS)) {
    for (const key of keys) {
      const rule = PRESETS[key];
      assert.ok(rule, `${group}: ${key} missing`);
      assert.ok(rule.divisor > 0 && ['up', 'nearest', 'none'].includes(rule.dimRounding) && [1, 0.5, 0.1].includes(rule.billableStep), `${key} invalid`);
    }
  }
});

test('Correios: cubed weight up to 5 kg is priced by real weight', () => {
  const small = withPreset('correios', { length: 40, width: 30, height: 25, actualWeight: 2 }); // 30,000 cm³ -> 5.0 kg cubed
  assert.equal(small.dimApplies, false);
  assert.equal(small.billableWeight, 2);
  const large = withPreset('correios', { length: 50, width: 40, height: 30, actualWeight: 2 }); // 60,000 cm³ -> 10 kg cubed
  assert.equal(large.dimApplies, true);
  assert.equal(large.billableWeight, 10);
});

test('Loggi 167 kg/m³ is about 5,988 cm³/kg', () => {
  const result = withPreset('loggi', { length: 100, width: 100, height: 100, actualWeight: 10 }); // 1 m³
  assert.ok(Math.abs(result.dimWeight - 167) < 0.2, String(result.dimWeight));
});

test('Canada Post example from its customer guide: 100×60×20 cm', () => {
  assert.equal(withPreset('canadaPost', { length: 100, width: 60, height: 20, actualWeight: 5 }).billableWeight, 24);
  assert.equal(withPreset('canadaPostRegular', { length: 100, width: 60, height: 20, actualWeight: 5 }).billableWeight, 20);
});

test('Australia Post: 250 kg per cubic metre', () => {
  assert.equal(withPreset('auspost', { length: 50, width: 40, height: 50, actualWeight: 3 }).dimWeight, 25); // 0.1 m³
});

test('UPS UK rounds dimensions to the nearest cm and weight up to 0.5 kg', () => {
  const result = withPreset('upsUk', { length: 40.4, width: 30.6, height: 20, actualWeight: 1 });
  assert.deepEqual(result.dimensions, [40, 31, 20]);
  assert.equal(result.dimWeight, 5); // 24,800 / 5,000 = 4.96 -> 5.0
});

test('Correos de México rounds up to the next whole kg', () => {
  assert.equal(withPreset('mexpost', { length: 40, width: 30, height: 21, actualWeight: 1 }).billableWeight, 5); // 4.2 -> 5
});
