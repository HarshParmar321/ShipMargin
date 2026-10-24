/**
 * Carrier-neutral dimensional-weight calculations.
 * Presets are planning defaults; users can always override them.
 */

// Rule sources (see /methodology/ for links). Rules last reviewed: 2026-10-24.
// UPS: ups.com "Package Dimensions, Size Limits and Weight Guide" - 139 Daily Rates, 166 Retail Rates, round measurements up.
// USPS: Postal Bulletin 22705 - divisor 139, each measurement rounded up, DIM only above 1,728 in³ (effective 12 July 2026).
// FedEx: fedex.com/en-ca dimensional weight page says round up; the fedex.com/en-us help page still says nearest.
//        We default to "up" and let users switch to "nearest".
export const RULES_REVIEWED_ON = '2026-10-24';
export const USPS_DIM_THRESHOLD = 1728;
export const ROUNDING_MODES = ['up', 'nearest', 'none'];
export const BILLABLE_STEPS = [1, 0.5, 0.1];

export const PRESETS = {
  ups139: { label: 'UPS Daily Rates · 139 in³/lb', unit: 'imperial', divisor: 139, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  ups166: { label: 'UPS Retail Rates · 166 in³/lb', unit: 'imperial', divisor: 166, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  fedex139: { label: 'FedEx · 139 in³/lb', unit: 'imperial', divisor: 139, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  usps139: { label: 'USPS · 139 in³/lb · over 1,728 in³', unit: 'imperial', divisor: 139, dimThreshold: USPS_DIM_THRESHOLD, dimRounding: 'up', billableStep: 1 },
  metric5000: { label: 'International express · 5,000 cm³/kg', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'up', billableStep: 0.5 },
  metric6000: { label: 'Air / some services · 6,000 cm³/kg', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'up', billableStep: 0.5 },

  // ---- Country presets (sources: /methodology/ and project research notes, reviewed 2026-10-24).
  // Where a carrier publishes no rounding rule we use exact dimensions (dimRounding 'none') and 0.1 steps.
  // Brazil
  correios: { label: 'Correios SEDEX/PAC · 6,000 (5 kg rule)', unit: 'metric', divisor: 6000, dimThreshold: 30000, dimRounding: 'none', billableStep: 0.1 },
  loggi: { label: 'Loggi · 167 kg/m³ (≈ 5,988)', unit: 'metric', divisor: 5988, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  amazonBr: { label: 'Amazon FBA Brasil · 6,000', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // Spain, Mexico, Latin America
  dhlExpress: { label: 'DHL Express · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  estafeta: { label: 'Estafeta · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  fedexMx: { label: 'FedEx México · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  mexpost: { label: 'Correos de México (Mexpost) · 6,000', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 1 },
  correosEs: { label: 'Correos España (Paq Estándar / Premium) · 6,000', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  chilexpress: { label: 'Chilexpress · 4,000', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  coordinadora: { label: 'Coordinadora (Colombia) · 2,500', unit: 'metric', divisor: 2500, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // United Kingdom
  upsUk: { label: 'UPS UK · 5,000 · nearest cm', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'nearest', billableStep: 0.5 },
  ukIntl5000: { label: 'Parcelforce / Evri international · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  dhlParcelUk: { label: 'DHL Parcel UK international · 4,000', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // Canada
  canadaPost: { label: 'Canada Post Priority / Xpresspost / Expedited · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  canadaPostRegular: { label: 'Canada Post Regular Parcel · 6,000', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  upsCa: { label: 'UPS / FedEx Canada · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  upsCaAir: { label: 'UPS Canada domestic Air · 4,100', unit: 'metric', divisor: 4100, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  // Australia
  auspost: { label: 'Australia Post · 250 kg/m³ (4,000)', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  startrack: { label: 'StarTrack / Aramex · 250 kg/m³ (4,000)', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // India
  delhivery: { label: 'Delhivery · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  amazonIn: { label: 'Amazon Easy Ship · 5,000 · 500 g steps', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  bluedartAir: { label: 'Blue Dart air · 5,000 · half-kg steps', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
};

/** Translated preset labels (fall back to the English label). */
export const PRESET_LABELS = {
  'pt-br': {
    correios: 'Correios SEDEX/PAC · 6.000 (regra dos 5 kg)',
    loggi: 'Loggi · 167 kg/m³ (≈ 5.988)',
    amazonBr: 'Amazon FBA Brasil · 6.000',
    metric5000: 'Genérico · 5.000 cm³/kg',
    metric6000: 'Genérico · 6.000 cm³/kg',
    dhlExpress: 'DHL Express · 5.000',
  },
  es: {
    dhlExpress: 'DHL Express · 5.000',
    estafeta: 'Estafeta · 5.000',
    fedexMx: 'FedEx México · 5.000',
    mexpost: 'Correos de México (Mexpost) · 6.000',
    correosEs: 'Correos España (Paq Estándar / Premium) · 6.000',
    chilexpress: 'Chilexpress · 4.000',
    coordinadora: 'Coordinadora (Colombia) · 2.500',
    metric5000: 'Genérico · 5.000 cm³/kg',
    metric6000: 'Genérico · 6.000 cm³/kg',
  },
};

/** Which presets each page offers, in display order. */
export const PRESET_GROUPS = {
  us: ['ups139', 'ups166', 'fedex139', 'usps139', 'metric5000', 'metric6000'],
  br: ['correios', 'loggi', 'amazonBr', 'dhlExpress', 'metric6000', 'metric5000'],
  es: ['correosEs', 'dhlExpress', 'estafeta', 'fedexMx', 'mexpost', 'chilexpress', 'coordinadora', 'metric5000', 'metric6000'],
  uk: ['upsUk', 'ukIntl5000', 'dhlParcelUk', 'metric5000', 'metric6000'],
  ca: ['canadaPost', 'canadaPostRegular', 'upsCa', 'upsCaAir', 'metric5000', 'metric6000'],
  au: ['auspost', 'startrack', 'metric5000', 'metric6000'],
  in: ['delhivery', 'amazonIn', 'bluedartAir', 'metric5000', 'metric6000'],
};

/** Old preset keys from earlier share links. */
const PRESET_ALIASES = { imperial139: 'ups139', imperial166: 'ups166' };

/** Fallback preset when the unit is switched: the first preset of that unit in the page's group. */
export const defaultPresetFor = (unit, group = PRESET_GROUPS.us) => group.find((key) => PRESETS[key]?.unit === unit) ?? 'custom';

/** 1 in³/lb expressed in cm³/kg (16.387064 cm³ per in³ × 2.20462 lb per kg). */
export const IN3_PER_LB_TO_CM3_PER_KG = 16.387064 * 2.2046226;

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
};

const roundUp = (value, step = 1) => {
  const safeStep = Math.max(number(step, 1), 0.000001);
  return Math.ceil((value - Number.EPSILON) / safeStep) * safeStep;
};

/** Resolve the dimension rounding mode, accepting the older boolean `roundDimensions`. */
export const resolveRounding = (input = {}) => {
  if (ROUNDING_MODES.includes(input.dimRounding)) return input.dimRounding;
  return input.roundDimensions === false ? 'none' : 'up';
};

const roundDimension = (value, mode) => {
  if (mode === 'up') return roundUp(value, 1);
  if (mode === 'nearest') return Math.round(value);
  return value;
};

export function calculatePackage(input = {}) {
  const unit = input.unit === 'metric' ? 'metric' : 'imperial';
  const defaultDivisor = unit === 'metric' ? 5000 : 139;
  const divisor = Math.max(number(input.divisor, defaultDivisor), 1);
  const dimRounding = resolveRounding(input);
  const billableStep = number(input.billableStep, unit === 'metric' ? 0.5 : 1);
  const rawDimensions = [input.length, input.width, input.height].map((value) => number(value));
  const dimensions = rawDimensions.map((value) => roundDimension(value, dimRounding));
  const [length, width, height] = dimensions;
  const actualWeight = number(input.actualWeight);
  const quantity = Math.max(1, Math.floor(number(input.quantity, 1)));
  const volume = length * width * height;
  const dimRaw = volume / divisor;
  const dimWeight = roundUp(dimRaw, billableStep);
  const roundedActual = roundUp(actualWeight, billableStep);
  // Some services (e.g. USPS) only apply DIM pricing above a volume threshold.
  const dimThreshold = number(input.dimThreshold, 0);
  const dimApplies = !(dimThreshold > 0 && volume <= dimThreshold);
  const billableWeight = dimApplies ? Math.max(dimWeight, roundedActual) : roundedActual;
  const airWeight = Math.max(0, billableWeight - roundedActual);
  const airPercent = billableWeight > 0 ? (airWeight / billableWeight) * 100 : 0;
  const sorted = [...dimensions].sort((a, b) => b - a);
  const longestSide = sorted[0] ?? 0;
  const girth = 2 * ((sorted[1] ?? 0) + (sorted[2] ?? 0));
  const lengthPlusGirth = longestSide + girth;
  // Largest volume still billed at scale weight: the DIM break-even, or the threshold if that is bigger.
  const maxVolumeAtActual = Math.max(roundedActual * divisor, dimThreshold);
  const scale = dimApplies && volume > 0 && maxVolumeAtActual > 0 && maxVolumeAtActual < volume
    ? Math.cbrt(maxVolumeAtActual / volume)
    : 1;
  const targetDimensions = findTargetDimensions(dimensions, scale, {
    wholeUnits: dimRounding !== 'none', divisor, billableStep, roundedActual, dimThreshold,
  });
  const currency = String(input.currency || 'USD').toUpperCase();
  const salePrice = number(input.salePrice);
  const productCost = number(input.productCost);
  const packagingCost = number(input.packagingCost);
  const shippingCost = number(input.shippingCost);
  const fees = number(input.fees);
  const profit = salePrice - productCost - packagingCost - shippingCost - fees;
  const marginPercent = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  return {
    unit,
    divisor,
    quantity,
    dimensions,
    rawDimensions,
    volume,
    dimRaw,
    dimWeight,
    actualWeight: roundedActual,
    billableWeight,
    totalBillableWeight: billableWeight * quantity,
    airWeight,
    airPercent,
    lengthPlusGirth,
    longestSide,
    targetDimensions,
    canShrink: dimApplies && scale < 0.999 && targetDimensions.every((value) => value > 0),
    dimApplies,
    dimThreshold,
    dimRounding,
    currency,
    salePrice,
    profit,
    marginPercent,
    isDimensional: dimApplies && dimWeight > roundedActual,
  };
}

/**
 * Suggest a carton size whose billable weight does not exceed the scale weight.
 * When dimensions are rounded up, the suggestion uses whole units and is verified
 * against the same rounding, so the suggested box really reaches scale weight.
 */
function findTargetDimensions(dimensions, scale, { wholeUnits, divisor, billableStep, roundedActual, dimThreshold = 0 }) {
  if (scale >= 0.999) return [...dimensions];
  if (!wholeUnits) return dimensions.map((value) => Math.max(0, value * scale * 0.999));
  const target = dimensions.map((value) => Math.max(1, Math.floor(value * scale)));
  const billable = (dims) => {
    const volume = dims[0] * dims[1] * dims[2];
    if (dimThreshold > 0 && volume <= dimThreshold) return roundedActual;
    return roundUp(volume / divisor, billableStep);
  };
  let guard = 0;
  while (billable(target) > roundedActual && guard < 1000) {
    const largest = target.indexOf(Math.max(...target));
    if (target[largest] <= 1) return [0, 0, 0];
    target[largest] -= 1;
    guard += 1;
  }
  return target;
}

export function formatNumber(value, maximumFractionDigits = 2, locale = 'en') {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(number(value));
}

export function parseAuditCsv(text) {
  const lines = String(text || '').trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const split = (line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
  const first = split(lines[0]).map((cell) => cell.toLowerCase());
  const hasHeader = first.some((cell) => ['sku', 'length', 'width', 'height', 'weight', 'quantity', 'qty'].includes(cell));
  const header = hasHeader ? first : ['sku', 'length', 'width', 'height', 'weight', 'quantity'];
  return lines.slice(hasHeader ? 1 : 0).map((line, index) => {
    const cells = split(line);
    const row = Object.fromEntries(header.map((key, cellIndex) => [key, cells[cellIndex] ?? '']));
    return {
      sku: row.sku || `Row ${index + 1}`,
      length: number(row.length),
      width: number(row.width),
      height: number(row.height),
      actualWeight: number(row.weight ?? row.actualweight),
      quantity: number(row.quantity ?? row.qty, 1),
    };
  }).filter((row) => row.length > 0 && row.width > 0 && row.height > 0);
}

export function escapeCsv(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function parseBoxes(text) {
  const lines = String(text || '').trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const split = (line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
  const first = split(lines[0]).map((cell) => cell.toLowerCase().replaceAll(' ', '_'));
  const hasHeader = first.some((cell) => ['name', 'box', 'length', 'width', 'height', 'cost', 'packaging_cost'].includes(cell));
  const header = hasHeader ? first : ['name', 'length', 'width', 'height', 'cost'];
  return lines.slice(hasHeader ? 1 : 0).map((line, index) => {
    const cells = split(line);
    const row = Object.fromEntries(header.map((key, cellIndex) => [key, cells[cellIndex] ?? '']));
    return {
      name: row.name || row.box || `Box ${index + 1}`,
      length: number(row.length),
      width: number(row.width),
      height: number(row.height),
      cost: number(row.cost ?? row.packaging_cost),
    };
  }).filter((box) => box.length > 0 && box.width > 0 && box.height > 0);
}

export function boxFits(productDimensions = [], boxDimensions = []) {
  const product = productDimensions.map((value) => number(value)).sort((a, b) => a - b);
  const box = boxDimensions.map((value) => number(value)).sort((a, b) => a - b);
  return product.length === 3 && box.length === 3 && product.every((value, index) => value <= box[index]);
}

export function optimizeBoxes(input = {}) {
  const settings = {
    unit: input.unit,
    divisor: input.divisor,
    billableStep: input.billableStep,
    roundDimensions: input.roundDimensions,
    dimRounding: input.dimRounding,
    actualWeight: input.actualWeight,
    dimThreshold: input.dimThreshold,
  };
  const productDimensions = [input.productLength, input.productWidth, input.productHeight].map((value) => number(value));
  const costPerWeight = number(input.costPerWeight);
  const monthlyOrders = Math.max(1, Math.floor(number(input.monthlyOrders, 1)));
  const currentPackagingCost = number(input.currentPackagingCost);
  const current = calculatePackage({
    ...settings,
    length: input.currentLength,
    width: input.currentWidth,
    height: input.currentHeight,
  });
  const currentShippingCost = current.billableWeight * costPerWeight;
  const currentTotalCost = currentShippingCost + currentPackagingCost;
  const candidates = (Array.isArray(input.boxes) ? input.boxes : []).map((box, index) => {
    const fits = boxFits(productDimensions, [box.length, box.width, box.height]);
    const result = calculatePackage({ ...settings, length: box.length, width: box.width, height: box.height });
    const shippingCost = result.billableWeight * costPerWeight;
    const packagingCost = number(box.cost);
    return {
      ...box,
      key: `${index}|${box.name}|${box.length}|${box.width}|${box.height}|${box.cost}`,
      fits,
      result,
      shippingCost,
      packagingCost,
      totalCost: shippingCost + packagingCost,
    };
  });
  const valid = candidates.filter((candidate) => candidate.fits).sort((a, b) => {
    const primary = costPerWeight > 0
      ? a.totalCost - b.totalCost
      : a.result.billableWeight - b.result.billableWeight;
    return primary || (a.result.billableWeight - b.result.billableWeight) || (a.result.volume - b.result.volume);
  });
  const recommended = valid[0] ?? null;
  const selected = valid.find((candidate) => candidate.key === input.selectedBoxKey) ?? recommended;
  const savingsPerOrder = selected ? Math.round((Math.max(0, currentTotalCost - selected.totalCost) + Number.EPSILON) * 100) / 100 : 0;
  const weightSavings = selected ? Math.max(0, current.billableWeight - selected.result.billableWeight) : 0;
  const monthlySavings = Math.round((savingsPerOrder * monthlyOrders + Number.EPSILON) * 100) / 100;
  const targetMargin = Math.min(number(input.targetMargin), 99.9);
  const baseCosts = number(input.productCost) + number(input.feesPerOrder) + (selected?.totalCost ?? currentTotalCost);
  const minimumSellingPrice = targetMargin > 0 ? baseCosts / (1 - targetMargin / 100) : baseCosts;

  return {
    productDimensions,
    current,
    currentShippingCost,
    currentTotalCost,
    candidates,
    validCount: valid.length,
    recommended,
    selected,
    best: selected,
    isRecommendedSelection: Boolean(selected && recommended && selected.key === recommended.key),
    costPerWeight,
    monthlyOrders,
    savingsPerOrder,
    weightSavings,
    monthlySavings,
    targetMargin,
    minimumSellingPrice,
  };
}

/* ---------- Share links ---------- */

const SHARE_KEYS = {
  length: 'l', width: 'w', height: 'h', actualWeight: 'wt', quantity: 'q', unit: 'u',
  preset: 'p', divisor: 'd', dimThreshold: 't', dimRounding: 'r', billableStep: 's',
};

/** Build the query string for a shareable calculation (everything needed to reproduce it). */
export function encodeShareParams(state = {}) {
  const params = new URLSearchParams();
  Object.entries(SHARE_KEYS).forEach(([field, key]) => {
    const value = state[field];
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  return params.toString();
}

/** Read a shared calculation back. Unknown or invalid values are ignored. */
export function decodeShareParams(search = '') {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const out = {};
  const num = (key) => {
    const raw = params.get(key);
    if (raw === null || raw === '') return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  };
  for (const field of ['length', 'width', 'height', 'actualWeight', 'quantity', 'divisor', 'dimThreshold']) {
    const value = num(SHARE_KEYS[field]);
    if (value !== undefined) out[field] = value;
  }
  const unit = params.get('u');
  if (unit === 'metric' || unit === 'imperial') out.unit = unit;
  const rawPreset = params.get('p');
  const preset = PRESET_ALIASES[rawPreset] ?? rawPreset;
  if (preset && (PRESETS[preset] || preset === 'custom')) out.preset = preset;
  const rounding = params.get('r');
  if (ROUNDING_MODES.includes(rounding)) out.dimRounding = rounding;
  const step = num('s');
  if (BILLABLE_STEPS.includes(step)) out.billableStep = step;
  // Fill gaps from the preset so an old or partial link still reproduces the same rule.
  if (out.preset && PRESETS[out.preset]) {
    const rule = PRESETS[out.preset];
    out.unit ??= rule.unit;
    out.divisor ??= rule.divisor;
    out.dimThreshold ??= rule.dimThreshold;
    out.dimRounding ??= rule.dimRounding;
    out.billableStep ??= rule.billableStep;
  }
  return out;
}
