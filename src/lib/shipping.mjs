/**
 * Carrier-neutral dimensional-weight calculations.
 * Presets are planning defaults; users can always override them.
 */

export const PRESETS = {
  imperial139: { label: 'Common parcel · 139 in³/lb', unit: 'imperial', divisor: 139 },
  imperial166: { label: 'Retail / legacy · 166 in³/lb', unit: 'imperial', divisor: 166 },
  metric5000: { label: 'Express metric · 5,000 cm³/kg', unit: 'metric', divisor: 5000 },
  metric6000: { label: 'Air metric · 6,000 cm³/kg', unit: 'metric', divisor: 6000 },
};

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
};

const roundUp = (value, step = 1) => {
  const safeStep = Math.max(number(step, 1), 0.000001);
  return Math.ceil((value - Number.EPSILON) / safeStep) * safeStep;
};

export function calculatePackage(input = {}) {
  const unit = input.unit === 'metric' ? 'metric' : 'imperial';
  const defaultDivisor = unit === 'metric' ? 5000 : 139;
  const divisor = Math.max(number(input.divisor, defaultDivisor), 1);
  const roundDimensions = input.roundDimensions !== false;
  const billableStep = number(input.billableStep, unit === 'metric' ? 0.5 : 1);
  const rawDimensions = [input.length, input.width, input.height].map((value) => number(value));
  const dimensions = rawDimensions.map((value) => roundDimensions ? roundUp(value, 1) : value);
  const [length, width, height] = dimensions;
  const actualWeight = number(input.actualWeight);
  const quantity = Math.max(1, Math.floor(number(input.quantity, 1)));
  const volume = length * width * height;
  const dimRaw = volume / divisor;
  const dimWeight = roundUp(dimRaw, billableStep);
  const roundedActual = roundUp(actualWeight, billableStep);
  const billableWeight = Math.max(dimWeight, roundedActual);
  const airWeight = Math.max(0, billableWeight - roundedActual);
  const airPercent = billableWeight > 0 ? (airWeight / billableWeight) * 100 : 0;
  const sorted = [...dimensions].sort((a, b) => b - a);
  const longestSide = sorted[0] ?? 0;
  const girth = 2 * ((sorted[1] ?? 0) + (sorted[2] ?? 0));
  const lengthPlusGirth = longestSide + girth;
  const maxVolumeAtActual = roundedActual * divisor;
  const scale = volume > 0 && maxVolumeAtActual > 0 && maxVolumeAtActual < volume
    ? Math.cbrt(maxVolumeAtActual / volume)
    : 1;
  const targetDimensions = dimensions.map((value) => Math.max(0, value * scale));
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
    canShrink: scale < 0.999,
    currency,
    salePrice,
    profit,
    marginPercent,
    isDimensional: dimWeight > roundedActual,
  };
}

export function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en', {
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
    actualWeight: input.actualWeight,
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
