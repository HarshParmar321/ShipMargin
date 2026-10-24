import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, PRESET_GROUPS, PRESET_SOURCES, MAX_CSV_ROWS, boxFits, calculatePackage, decodeShareParams, encodeShareParams, optimizeBoxes, parseAuditCsv, parseAuditCsvDetailed, parseBoxes, parseCsvTable, parseLocaleNumber, parseMeasure, presetExtras } from '../src/lib/shipping.mjs';

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

test('FedEx US rounds each side to the nearest inch (fedex.com/en-us); round-up mode is available', () => {
  const nearestDefault = withPreset('fedex139', { length: 10.4, width: 10.4, height: 10.6, actualWeight: 1 });
  assert.deepEqual(nearestDefault.dimensions, [10, 10, 11]);
  const up = withPreset('fedex139', { length: 10.4, width: 10.4, height: 10.4, actualWeight: 1, dimRounding: 'up' });
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
    const state = { ...pkg, preset: key, unit: rule.unit, divisor: rule.divisor, dimThreshold: rule.dimThreshold, dimRounding: rule.dimRounding, billableStep: rule.billableStep, dimExemptBelowWeight: rule.dimExemptBelowWeight ?? 0 };
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

const withRule = (key, pkg) => calculatePackage({ ...PRESETS[key], ...pkg });

test('Australia Post: no cubic charge under 1 kg actual weight (non-contract rule)', () => {
  const light = withRule('auspost', { length: 50.5, width: 40.3, height: 30.9, actualWeight: 0.5 });
  assert.equal(light.billableWeight, 0.5);
  assert.equal(light.exemptByWeight, true);
  assert.equal(light.isDimensional, false);
  assert.equal(withRule('auspost', { length: 50, width: 40, height: 30, actualWeight: 1 }).billableWeight, 15);
  assert.equal(withRule('auspost', { length: 50, width: 40, height: 30, actualWeight: 4 }).billableWeight, 15);
});

test('StarTrack rounds chargeable weight up to the next whole kg (terms clause 4.9)', () => {
  assert.equal(withRule('startrack', { length: 50.5, width: 40.3, height: 30.9, actualWeight: 0.5 }).billableWeight, 16);
  // Worked example from the StarTrack terms: 0.40 × 0.30 × 0.55 m → 16.5 kg → 17 kg.
  assert.equal(withRule('startrack', { length: 40, width: 30, height: 55, actualWeight: 1 }).billableWeight, 17);
  // Fixed Price Premium uses 190 kg/m³: 0.06 m³ → 11.4 → 12 kg.
  assert.equal(withRule('startrackFpp', { length: 50, width: 40, height: 30, actualWeight: 4 }).billableWeight, 12);
});

test('Aramex Australia is a separate preset at 250 kg/m³', () => {
  assert.ok(PRESET_GROUPS.au.includes('aramexAu'));
  assert.equal(withRule('aramexAu', { length: 50, width: 40, height: 30, actualWeight: 4 }).billableWeight, 15);
});

test('Delhivery: flyers under 1 kg use dead weight, boxes use volumetric weight', () => {
  assert.equal(withRule('delhiveryFlyer', { length: 35, width: 30, height: 3, actualWeight: 0.4 }).billableWeight, 0.4);
  assert.ok(Math.abs(withRule('delhivery', { length: 35, width: 30, height: 3, actualWeight: 0.4 }).billableWeight - 0.7) < 1e-9);
  assert.ok(Math.abs(withRule('delhiveryFlyer', { length: 35, width: 30, height: 10, actualWeight: 1.2 }).billableWeight - 2.1) < 1e-9);
});

test('light-parcel exemption survives share links', () => {
  const query = encodeShareParams({ preset: 'custom', unit: 'metric', divisor: 4000, dimExemptBelowWeight: 1, length: 50, width: 40, height: 30, actualWeight: 0.5 });
  const decoded = decodeShareParams(query);
  assert.equal(decoded.dimExemptBelowWeight, 1);
  assert.equal(decodeShareParams('p=auspost&l=50&w=40&h=30&wt=0.5').dimExemptBelowWeight, 1);
});

test('every preset has an official source link', () => {
  Object.keys(PRESETS).filter((key) => !key.startsWith('metric')).forEach((key) => assert.match(PRESET_SOURCES[key] ?? '', /^https:\/\//, key));
});

test('numbers in any common format', () => {
  assert.equal(parseLocaleNumber('1,5'), 1.5);
  assert.equal(parseLocaleNumber('1.5'), 1.5);
  assert.equal(parseLocaleNumber('1.234,5'), 1234.5);
  assert.equal(parseLocaleNumber('1,234.5'), 1234.5);
  assert.equal(parseLocaleNumber('1 234,5'), 1234.5);
  assert.equal(parseLocaleNumber(''), undefined);
  assert.ok(Number.isNaN(parseLocaleNumber('abc')));
});

test('CSV: quoted fields with commas, escaped quotes and line breaks', () => {
  const table = parseCsvTable('name,note\n"Large box, blue","He said ""hi"""\n"multi\nline",x\r\n');
  assert.deepEqual(table, [['name', 'note'], ['Large box, blue', 'He said "hi"'], ['multi\nline', 'x']]);
});

test('CSV: semicolon files with decimal commas (Excel in Brazil and Europe)', () => {
  const { rows, errors, delimiter } = parseAuditCsvDetailed('sku;length;width;height;weight;quantity\n"Caixa grande, azul";50;40;30;2,5;3');
  assert.equal(delimiter, ';');
  assert.deepEqual(errors, []);
  assert.deepEqual(rows[0], { sku: 'Caixa grande, azul', length: 50, width: 40, height: 30, actualWeight: 2.5, quantity: 3 });
});

test('CSV: Portuguese and Spanish headers', () => {
  assert.equal(parseAuditCsv('SKU;Comprimento (cm);Largura (cm);Altura (cm);Peso (kg);Quantidade\nA;50;40;30;2;1')[0].width, 40);
  assert.equal(parseAuditCsv('SKU;Largo;Ancho;Alto;Peso;Cantidad\nA;50;40;30;2;1')[0].length, 50);
});

test('CSV: WooCommerce and Shopify style exports', () => {
  const woo = parseAuditCsv('ID,Type,SKU,Name,"Weight (kg)","Length (cm)","Width (cm)","Height (cm)"\n1,simple,MUG-1,"Mug, red",0.4,12,10,10');
  assert.deepEqual(woo[0], { sku: 'MUG-1', length: 12, width: 10, height: 10, actualWeight: 0.4, quantity: 1 });
  const shopify = parseAuditCsv('Handle,Title,Variant SKU,Variant Grams,Length,Width,Height\ntee,T-shirt,TEE-M,250,30,25,3');
  assert.equal(shopify[0].actualWeight, 0.25);
  assert.equal(shopify[0].sku, 'TEE-M');
});

test('CSV: row-specific errors and limits', () => {
  const { rows, errors } = parseAuditCsvDetailed('sku,length,width,height,weight,quantity\nOK,10,10,10,1,1\nBAD,0,10,10,1,1\nW,10,10,10,abc,1\nQ,10,10,10,1,xyz');
  assert.equal(rows.length, 1);
  assert.deepEqual(errors, [{ row: 3, reason: 'dims' }, { row: 4, reason: 'weight' }, { row: 5, reason: 'qty' }]);
  const big = 'sku,length,width,height,weight,quantity\n' + 'A,1,1,1,1,1\n'.repeat(MAX_CSV_ROWS + 1);
  assert.equal(parseAuditCsvDetailed(big).tooLarge, true);
});

test('box list CSV handles quoted names and decimal commas', () => {
  assert.deepEqual(parseBoxes('nome;comprimento;largura;altura;custo\n"Caixa, pequena";20;15;10;0,45'), [{ name: 'Caixa, pequena', length: 20, width: 15, height: 10, cost: 0.45 }]);
});

test('Amazon FBA Brasil adds 20 g of packaging before comparing', () => {
  const r = withRule('amazonBr', { length: 10, width: 10, height: 10, actualWeight: 0.5 });
  assert.equal(r.actualWeight, 0.6); // 0.52 kg -> next 0.1 kg
});

test('Chilexpress only applies volumetric weight when a side is over 60 cm', () => {
  assert.equal(withRule('chilexpress', { length: 50, width: 40, height: 30, actualWeight: 1 }).billableWeight, 1);
  assert.equal(withRule('chilexpress', { length: 61, width: 40, height: 30, actualWeight: 1 }).billableWeight, 18.3);
  assert.equal(withRule('chilexpress', { length: 60, width: 40, height: 30, actualWeight: 1 }).billableWeight, 1);
});

test('Delhivery flyer: dead weight up to and including 1 kg', () => {
  assert.equal(withRule('delhiveryFlyer', { length: 50, width: 40, height: 5, actualWeight: 1 }).billableWeight, 1);
  assert.equal(withRule('delhiveryFlyer', { length: 50, width: 40, height: 5, actualWeight: 1.05 }).billableWeight, 2);
});

test('no floating-point noise in 0.1 steps, and absurd input stays finite', () => {
  const r = calculatePackage({ unit: 'metric', divisor: 5000, billableStep: 0.1, dimRounding: 'none', length: 30, width: 20, height: 10, actualWeight: 0.3 });
  assert.equal(r.dimWeight, 1.2);
  assert.equal(r.airWeight, 0.9);
  const huge = calculatePackage({ unit: 'metric', divisor: 5000, length: 1e120, width: 1e120, height: 1e120, actualWeight: 1 });
  assert.ok(Number.isFinite(huge.billableWeight));
});

test('CSV cells with units are converted, not dropped', () => {
  const { rows, errors } = parseAuditCsvDetailed('sku,length,width,height,weight,quantity\nG,30,20,10,500g,1\nI,12in,10in,4in,2lb,1\nS,10,10,10,5stone,1', { unit: 'metric' });
  assert.equal(rows[0].actualWeight, 0.5);
  assert.equal(rows[1].length, 30.48);
  assert.equal(rows[1].actualWeight, 0.907185);
  assert.deepEqual(errors, [{ row: 4, reason: 'weight' }]);
  assert.equal(parseMeasure('500g', 'weight', 'imperial'), 1.102311);
  assert.equal(parseMeasure('1.250', 'weight', 'metric', 'g'), 1.25);
});

test('CSV header units and unknown headers', () => {
  const rows = parseAuditCsv('sku,length (in),width (in),height (in),weight (lb)\nA,12,10,8,4', { unit: 'metric' });
  assert.equal(rows[0].length, 30.48);
  assert.deepEqual(parseAuditCsvDetailed('name,price,stock\nmug,10,5').errors, [{ row: 1, reason: 'header' }]);
});

test('preset-only rules are exposed for the UI', () => {
  assert.equal(presetExtras('amazonBr').packagingWeight, 0.02);
  assert.equal(presetExtras('chilexpress').dimMinLongestSide, 60);
  assert.equal(presetExtras('delhiveryFlyer').dimExemptInclusive, true);
  assert.deepEqual(presetExtras('custom'), {});
});

test('thousands vs decimal follows the page decimal mark', () => {
  assert.equal(parseLocaleNumber('5,000', '.'), 5000);
  assert.equal(parseLocaleNumber('5.000', ','), 5000);
  assert.equal(parseLocaleNumber('1.728', '.'), 1.728);
  assert.equal(parseLocaleNumber('1,728', ','), 1.728);
  assert.equal(parseLocaleNumber('1,5', '.'), 1.5);
  assert.ok(Number.isNaN(parseLocaleNumber('1.2.3', '.')));
  assert.ok(Number.isNaN(parseLocaleNumber('1e3', '.')));
  // CSV: semicolon files use a decimal comma, so 1.250 in a weight column is 1250.
  assert.equal(parseAuditCsv('sku;length;width;height;weight\nA;10;10;10;1.250')[0].actualWeight, 1250);
  assert.equal(parseAuditCsv('sku,length,width,height,weight\nA,10,10,10,1.250')[0].actualWeight, 1.25);
});

test('an empty or zero divisor is reported, not replaced by 1', () => {
  assert.equal(calculatePackage({ unit: 'imperial', divisor: '', length: 10, width: 10, height: 10, actualWeight: 1 }).hasRule, false);
  assert.equal(calculatePackage({ unit: 'imperial', divisor: 0, length: 10, width: 10, height: 10, actualWeight: 1 }).hasRule, false);
  assert.equal(calculatePackage({ unit: 'imperial', divisor: 139, length: 10, width: 10, height: 10, actualWeight: 1 }).hasRule, true);
  assert.ok(calculatePackage({ unit: 'imperial', length: 10, width: 10, height: 10, actualWeight: 1, quantity: 1e308 }).totalBillableWeight < Infinity);
});
