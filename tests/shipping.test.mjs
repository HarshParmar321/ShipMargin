import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePackage, parseAuditCsv } from '../src/lib/shipping.mjs';

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
