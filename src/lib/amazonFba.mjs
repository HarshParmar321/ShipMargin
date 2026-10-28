// Amazon FBA (amazon.com, United States) size tiers, shipping weight and fulfillment fees.
//
// Sources (Seller Central help, read on 26 Oct 2026):
//   Dimensional weight        https://sellercentral.amazon.com/help/hub/reference/external/G53Z9EKF8VVZVH29
//   Shipping weight           https://sellercentral.amazon.com/help/hub/reference/external/GEVWP48HPBLEFJEY
//   Product size tiers        https://sellercentral.amazon.com/help/hub/reference/external/GG5KW835AHDJCH8W
//   2026 US FBA fee changes   https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW
//
// Rules used:
// - Dimensional weight = L × W × H (inches) ÷ 139.
// - Small Bulky, Large Bulky, Overmax and Extra-Large units assume a minimum width and height of 2 in.
// - Shipping weight: unit weight for Small standard and Extra-Large 150+ lb; the greater of unit
//   weight and dimensional weight for every other tier.
// - Fee tables are the 2026 non-peak (15 Jan – 14 Oct 2026) and 2026 peak (15 Oct 2026 – 14 Jan 2027)
//   rate cards, without the 3.5% fuel and logistics surcharge that applies from 17 Apr 2026.

export const FBA_US_REVIEWED_ON = '2026-10-26';
export const FBA_US_DIVISOR = 139;
export const FBA_US_MIN_SIDE = 2;
export const FBA_US_SURCHARGE = 0.035;
export const FBA_US_SURCHARGE_FROM = '2026-04-17';

export const FBA_US_SOURCES = {
  dimensionalWeight: 'https://sellercentral.amazon.com/help/hub/reference/external/G53Z9EKF8VVZVH29',
  shippingWeight: 'https://sellercentral.amazon.com/help/hub/reference/external/GEVWP48HPBLEFJEY',
  sizeTiers: 'https://sellercentral.amazon.com/help/hub/reference/external/GG5KW835AHDJCH8W',
  fees2026: 'https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW',
  revenueCalculator: 'https://sellercentral.amazon.com/hz/fba/profitabilitycalculator/index?mons_sel_locale=en_US',
};

export const FBA_US_PERIODS = {
  nonpeak2026: { from: '2026-01-15', to: '2026-10-14', label: 'Non-peak 2026 (15 Jan – 14 Oct 2026)' },
  peak2026: { from: '2026-10-15', to: '2027-01-14', label: 'Holiday peak (15 Oct 2026 – 14 Jan 2027)' },
};

export const FBA_US_TIER_LABELS = {
  smallStandard: 'Small standard-size',
  largeStandard: 'Large standard-size',
  smallBulky: 'Small Bulky',
  largeBulky: 'Large Bulky',
  xl0to50: 'Extra-Large 0 to 50 lb',
  xl50to70: 'Extra-Large 50+ to 70 lb',
  xl70to150: 'Extra-Large 70+ to 150 lb',
  xl150plus: 'Extra-Large 150+ lb',
  xlUnclear: 'Extra-Large',
};

// Per price band (<$10, $10–$50, >$50):
//   ss  Small standard, 2-oz bands up to 16 oz
//   ls  Large standard, 4-oz bands up to 16 oz, then 0.25-lb bands up to 3 lb
//   ls3 Large standard over 3 lb: ls3 + ls3Step per interval above 3 lb
//       (4-oz intervals; half-lb intervals for apparel)
//   sb/lb/xl50  base for the first lb, plus 0.38 per lb above the first lb
//   xl70        base up to 51 lb, plus 0.75 per lb above 51 lb
//   xl150       base up to 71 lb, plus 0.75 per lb above 71 lb
//   xl150p      base up to 151 lb, plus 0.19 per lb above 151 lb
const band = (ss, ls, ls3, ls3Step, sb, lb, xl50, xl70, xl150, xl150p) => ({ ss, ls, ls3, ls3Step, sb, lb, xl50, xl70, xl150, xl150p });

export const FBA_US_FEES = {
  core: {
    nonpeak2026: {
      low: band([2.43, 2.49, 2.56, 2.66, 2.77, 2.82, 2.92, 2.95], [2.91, 3.13, 3.38, 3.78, 4.22, 4.6, 4.75, 5, 5.1, 5.28, 5.44, 5.85], 6.15, 0.08, 6.78, 8.58, 25.56, 36.55, 50.55, 194.18),
      mid: band([3.32, 3.42, 3.45, 3.54, 3.68, 3.78, 3.91, 3.96], [3.73, 3.95, 4.2, 4.6, 5.04, 5.42, 5.57, 5.82, 5.92, 6.1, 6.26, 6.67], 6.97, 0.08, 7.55, 9.35, 26.33, 37.32, 51.32, 194.95),
      high: band([3.58, 3.68, 3.71, 3.8, 3.94, 4.04, 4.17, 4.22], [3.99, 4.21, 4.46, 4.86, 5.3, 5.68, 5.83, 6.08, 6.18, 6.36, 6.52, 6.93], 7.23, 0.08, 7.55, 9.35, 26.33, 37.32, 51.32, 194.95),
    },
    peak2026: {
      low: band([2.62, 2.68, 2.76, 2.86, 2.98, 3.03, 3.14, 3.17], [3.15, 3.39, 3.66, 4.07, 4.52, 4.91, 5.07, 5.33, 5.47, 5.67, 5.84, 6.26], 6.69, 0.08, 7.82, 9.62, 28.29, 39.36, 54.97, 202.69),
      mid: band([3.51, 3.61, 3.65, 3.74, 3.89, 3.99, 4.13, 4.18], [3.97, 4.21, 4.48, 4.89, 5.34, 5.73, 5.89, 6.15, 6.29, 6.49, 6.66, 7.08], 7.51, 0.08, 8.59, 10.39, 29.06, 40.13, 55.74, 203.46),
      high: band([3.77, 3.87, 3.91, 4, 4.15, 4.25, 4.39, 4.44], [4.23, 4.47, 4.74, 5.15, 5.6, 5.99, 6.15, 6.41, 6.55, 6.75, 6.92, 7.34], 7.77, 0.08, 8.59, 10.39, 29.06, 40.13, 55.74, 203.46),
    },
  },
  apparel: {
    nonpeak2026: {
      low: band([2.62, 2.64, 2.68, 2.81, 3, 3.1, 3.2, 3.3], [3.48, 3.68, 3.9, 4.35, 5.05, 5.22, 5.32, 5.43, 5.78, 5.9, 5.95, 6.08], 6.15, 0.16, 6.78, 8.58, 25.56, 36.55, 50.55, 194.18),
      mid: band([3.51, 3.54, 3.59, 3.69, 3.91, 4.09, 4.2, 4.25], [4.3, 4.5, 4.72, 5.17, 5.87, 6.04, 6.14, 6.25, 6.6, 6.72, 6.77, 6.9], 6.97, 0.16, 7.55, 9.35, 26.33, 37.32, 51.32, 194.95),
      high: band([3.77, 3.8, 3.85, 3.95, 4.17, 4.35, 4.46, 4.51], [4.56, 4.76, 4.98, 5.43, 6.13, 6.3, 6.4, 6.51, 6.86, 6.98, 7.03, 7.16], 7.23, 0.16, 7.55, 9.35, 26.33, 37.32, 51.32, 194.95),
    },
    peak2026: {
      low: band([2.85, 2.87, 2.93, 3.06, 3.27, 3.37, 3.49, 3.59], [3.79, 4, 4.23, 4.69, 5.42, 5.59, 5.71, 5.82, 6.22, 6.34, 6.41, 6.54], 6.82, 0.16, 7.82, 9.62, 28.29, 39.36, 54.97, 202.69),
      mid: band([3.74, 3.77, 3.84, 3.94, 4.18, 4.36, 4.49, 4.54], [4.61, 4.82, 5.05, 5.51, 6.24, 6.41, 6.53, 6.64, 7.04, 7.16, 7.23, 7.36], 7.64, 0.16, 8.59, 10.39, 29.06, 40.13, 55.74, 203.46),
      high: band([4, 4.03, 4.1, 4.2, 4.44, 4.62, 4.75, 4.8], [4.87, 5.08, 5.31, 5.77, 6.5, 6.67, 6.79, 6.9, 7.3, 7.42, 7.49, 7.62], 7.9, 0.16, 8.59, 10.39, 29.06, 40.13, 55.74, 203.46),
    },
  },
  dangerous: {
    nonpeak2026: {
      low: band([3.4, 3.43, 3.48, 3.55, 3.64, 3.65, 3.73, 3.77], [3.73, 3.94, 4.17, 4.37, 4.82, 5.2, 5.35, 5.49, 5.56, 5.74, 5.9, 6.31], 6.61, 0.08, 7.5, 9.3, 27.67, 39.76, 57.68, 218.76),
      mid: band([4.29, 4.36, 4.37, 4.43, 4.55, 4.61, 4.72, 4.78], [4.55, 4.76, 4.99, 5.19, 5.64, 6.02, 6.17, 6.31, 6.38, 6.56, 6.72, 7.13], 7.43, 0.08, 8.27, 10.07, 28.44, 40.53, 58.45, 219.53),
      high: band([4.55, 4.62, 4.63, 4.69, 4.81, 4.87, 4.98, 5.04], [4.81, 5.02, 5.25, 5.45, 5.9, 6.28, 6.43, 6.57, 6.64, 6.82, 6.98, 7.39], 7.69, 0.08, 8.27, 10.07, 28.44, 40.53, 58.45, 219.53),
    },
    peak2026: {
      low: band([3.74, 3.8, 3.88, 3.98, 4.1, 4.14, 4.25, 4.32], [4.32, 4.56, 4.82, 5.04, 5.51, 5.91, 6.08, 6.24, 6.33, 6.53, 6.7, 7.12], 7.51, 0.08, 9.06, 10.86, 31.71, 43.86, 64.04, 230.84),
      mid: band([4.63, 4.73, 4.77, 4.86, 5.01, 5.1, 5.24, 5.33], [5.14, 5.38, 5.64, 5.86, 6.33, 6.73, 6.9, 7.06, 7.15, 7.35, 7.52, 7.94], 8.33, 0.08, 9.83, 11.63, 32.48, 44.63, 64.81, 231.61),
      high: band([4.89, 4.99, 5.03, 5.12, 5.27, 5.36, 5.5, 5.59], [5.4, 5.64, 5.9, 6.12, 6.59, 6.99, 7.16, 7.32, 7.41, 7.61, 7.78, 8.2], 8.59, 0.08, 9.83, 11.63, 32.48, 44.63, 64.81, 231.61),
    },
  },
};

const EPS = 1e-9;
const LB_PER_KG = 1 / 0.45359237;
const IN_PER_CM = 1 / 2.54;
const ceilSteps = (value) => Math.max(0, Math.ceil(value - EPS));
const cents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const trim = (value) => Number(value.toFixed(6));

/** Which 2026 rate card applies on a date (YYYY-MM-DD). null outside the published tables. */
export function fbaPeriodFor(isoDate) {
  const day = String(isoDate).slice(0, 10);
  for (const [key, period] of Object.entries(FBA_US_PERIODS)) {
    if (day >= period.from && day <= period.to) return key;
  }
  return null;
}

/** <$10, $10–$50 (both ends included) or >$50. */
export function fbaPriceBand(price) {
  const value = Number(price);
  if (price === '' || price === null || price === undefined || !Number.isFinite(value) || value < 0) return null;
  if (value < 10) return 'low';
  if (value <= 50) return 'mid';
  return 'high';
}

function toInches(value, unit) {
  return unit === 'cm' ? value * IN_PER_CM : value;
}

function toPounds(value, unit) {
  if (unit === 'kg') return value * LB_PER_KG;
  if (unit === 'g') return (value / 1000) * LB_PER_KG;
  if (unit === 'oz') return value / 16;
  return value;
}

/**
 * Size tier and shipping weight for one packaged unit.
 * Input in inches and pounds (use calculateFba for other units).
 */
export function fbaSizeTier({ length, width, height, weight }) {
  const sides = [length, width, height].map(Number);
  const unitWeight = Number(weight);
  if (sides.some((side) => !Number.isFinite(side) || side <= 0) || !Number.isFinite(unitWeight) || unitWeight <= 0) {
    return null;
  }
  const [L, M, S] = [...sides].sort((a, b) => b - a);
  const girth = 2 * (M + S);
  const lengthPlusGirth = L + girth;
  const volume = L * M * S;
  const dimStandard = volume / FBA_US_DIVISOR;
  const minWidth = Math.max(M, FBA_US_MIN_SIDE);
  const minHeight = Math.max(S, FBA_US_MIN_SIDE);
  const dimBulky = (L * minWidth * minHeight) / FBA_US_DIVISOR;
  const within = (value, limit) => value <= limit + EPS;

  const base = { longest: L, median: M, shortest: S, girth, lengthPlusGirth, volume, unitWeight, overmax: false };

  if (within(unitWeight, 1) && within(L, 15) && within(M, 12) && within(S, 0.75)) {
    return { ...base, tier: 'smallStandard', dimWeight: dimStandard, minApplied: false, shippingWeight: unitWeight, basis: 'unit' };
  }
  const standardShipping = Math.max(unitWeight, dimStandard);
  if (within(standardShipping, 20) && within(L, 18) && within(M, 14) && within(S, 8)) {
    return { ...base, tier: 'largeStandard', dimWeight: dimStandard, minApplied: false, shippingWeight: standardShipping, basis: dimStandard > unitWeight ? 'dim' : 'unit' };
  }

  const minApplied = M < FBA_US_MIN_SIDE || S < FBA_US_MIN_SIDE;
  const shippingWeight = Math.max(unitWeight, dimBulky);
  const basis = dimBulky > unitWeight ? 'dim' : 'unit';
  const bulky = { ...base, dimWeight: dimBulky, minApplied, shippingWeight, basis };
  if (within(shippingWeight, 50) && within(L, 37) && within(M, 28) && within(S, 20) && within(lengthPlusGirth, 130)) {
    return { ...bulky, tier: 'smallBulky' };
  }
  if (within(shippingWeight, 50) && within(L, 59) && within(M, 33) && within(S, 33) && within(lengthPlusGirth, 130)) {
    return { ...bulky, tier: 'largeBulky' };
  }
  if (unitWeight > 150 + EPS) {
    return { ...bulky, tier: 'xl150plus', shippingWeight: unitWeight, basis: 'unit' };
  }
  const overmax = L > 96 + EPS || lengthPlusGirth > 130 + EPS;
  let tier = 'xlUnclear';
  if (within(shippingWeight, 50)) tier = 'xl0to50';
  else if (within(shippingWeight, 70)) tier = 'xl50to70';
  else if (within(shippingWeight, 150)) tier = 'xl70to150';
  return { ...bulky, tier, overmax };
}

const lbText = (value) => String(trim(value));

/** The fee table row for a tier and shipping weight, plus the fee for one price band. */
export function fbaFulfillmentFee({ tier, shippingWeight, category = 'core', period = 'peak2026', priceBand = 'mid' }) {
  const table = FBA_US_FEES[category]?.[period]?.[priceBand];
  if (!table || !Number.isFinite(shippingWeight) || shippingWeight <= 0) return null;
  const w = shippingWeight;

  if (tier === 'smallStandard') {
    const index = Math.min(7, Math.max(1, ceilSteps((w * 16) / 2)) - 1);
    const label = index === 0 ? '2 oz or less' : `${index * 2}+ to ${index * 2 + 2} oz`;
    return { fee: table.ss[index], label, base: table.ss[index], intervals: 0, perInterval: 0 };
  }
  if (tier === 'largeStandard') {
    if (w <= 1 + EPS) {
      const index = Math.max(1, ceilSteps((w * 16) / 4)) - 1;
      const label = index === 0 ? '4 oz or less' : `${index * 4}+ to ${index * 4 + 4} oz`;
      return { fee: table.ls[index], label, base: table.ls[index], intervals: 0, perInterval: 0 };
    }
    if (w <= 3 + EPS) {
      const step = Math.max(1, ceilSteps((w - 1) / 0.25));
      const index = 3 + step;
      return { fee: table.ls[index], label: `${lbText(1 + (step - 1) * 0.25)}+ to ${lbText(1 + step * 0.25)} lb`, base: table.ls[index], intervals: 0, perInterval: 0 };
    }
    const width = category === 'apparel' ? 0.5 : 0.25;
    const intervals = ceilSteps((w - 3) / width);
    return {
      fee: cents(table.ls3 + intervals * table.ls3Step),
      label: `${lbText(3 + (intervals - 1) * width)}+ to ${lbText(3 + intervals * width)} lb`,
      base: table.ls3, intervals, perInterval: table.ls3Step, intervalWidth: width, above: 3,
    };
  }
  const perLb = (base, perInterval, above, from) => {
    const intervals = ceilSteps(w - above);
    const label = intervals === 0 ? `${from}+ to ${above} lb` : `${above + intervals - 1}+ to ${above + intervals} lb`;
    return { fee: cents(base + intervals * perInterval), label, base, intervals, perInterval, intervalWidth: 1, above };
  };
  if (tier === 'smallBulky') return perLb(table.sb, 0.38, 1, 0);
  if (tier === 'largeBulky') return perLb(table.lb, 0.38, 1, 0);
  if (tier === 'xl0to50') return perLb(table.xl50, 0.38, 1, 0);
  if (tier === 'xl50to70') return perLb(table.xl70, 0.75, 51, 50);
  if (tier === 'xl70to150') return perLb(table.xl150, 0.75, 71, 70);
  if (tier === 'xl150plus') return perLb(table.xl150p, 0.19, 151, 150);
  return null;
}

/**
 * Full estimate. Dimensions in 'in' or 'cm', weight in 'lb', 'oz', 'kg' or 'g'.
 * price is the item price in USD (optional; without it there is no fee).
 */
export function calculateFba({ length, width, height, weight, dimUnit = 'in', weightUnit = 'lb', price, category = 'core', period = 'peak2026' }) {
  const values = [length, width, height, weight].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) return null;
  const tierInfo = fbaSizeTier({
    length: toInches(values[0], dimUnit),
    width: toInches(values[1], dimUnit),
    height: toInches(values[2], dimUnit),
    weight: toPounds(values[3], weightUnit),
  });
  if (!tierInfo) return null;
  const priceBand = fbaPriceBand(price);
  const fee = priceBand && FBA_US_PERIODS[period] ? fbaFulfillmentFee({ tier: tierInfo.tier, shippingWeight: tierInfo.shippingWeight, category, period, priceBand }) : null;
  const withSurcharge = fee ? cents(fee.fee * (1 + FBA_US_SURCHARGE)) : null;
  return {
    ...tierInfo,
    tierLabel: FBA_US_TIER_LABELS[tierInfo.tier],
    priceBand,
    period,
    category,
    fee,
    feeWithSurcharge: withSurcharge,
  };
}
