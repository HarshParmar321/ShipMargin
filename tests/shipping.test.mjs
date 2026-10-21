import test from 'node:test';
import assert from 'node:assert/strict';
import { boxFits, calculatePackage, optimizeBoxes, parseAuditCsv, parseBoxes } from '../src/lib/shipping.mjs';

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
