/**
 * Carrier-neutral dimensional-weight calculations.
 * Presets are planning defaults; users can always override them.
 */

// Rule sources (see /methodology/ for links). Rules last reviewed: 2026-10-24.
// UPS: ups.com "Package Dimensions, Size Limits and Weight Guide" - 139 Daily Rates, 166 Retail Rates, round measurements up.
// USPS: Postal Bulletin 22705 - divisor 139, each measurement rounded up, DIM only above 1,728 in³ (effective 12 July 2026).
// FedEx US: fedex.com/en-us "What is dimensional weight" - divide by 139, "Round each measurement to the nearest whole inch".
//        (FedEx Canada rounds up; that rule is used in the Canada preset.)
export const RULES_REVIEWED_ON = '2026-10-24';
export const USPS_DIM_THRESHOLD = 1728;
export const ROUNDING_MODES = ['up', 'nearest', 'none'];
export const BILLABLE_STEPS = [1, 0.5, 0.1];

export const PRESETS = {
  ups139: { label: 'UPS Daily Rates · 139 in³/lb', unit: 'imperial', divisor: 139, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  ups166: { label: 'UPS Retail Rates · 166 in³/lb', unit: 'imperial', divisor: 166, dimThreshold: 0, dimRounding: 'up', billableStep: 1 },
  fedex139: { label: 'FedEx · 139 in³/lb', unit: 'imperial', divisor: 139, dimThreshold: 0, dimRounding: 'nearest', billableStep: 1 },
  usps139: { label: 'USPS · 139 in³/lb · over 1,728 in³', unit: 'imperial', divisor: 139, dimThreshold: USPS_DIM_THRESHOLD, dimRounding: 'up', billableStep: 1 },
  metric5000: { label: 'International express · 5,000 cm³/kg', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'up', billableStep: 0.5 },
  metric6000: { label: 'Air / some services · 6,000 cm³/kg', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'up', billableStep: 0.5 },

  // ---- Country presets (sources: /methodology/ and project research notes, reviewed 2026-10-24).
  // Where a carrier publishes no rounding rule we use exact dimensions (dimRounding 'none') and 0.1 steps.
  // Brazil
  correios: { label: 'Correios SEDEX/PAC · 6,000 (5 kg rule)', unit: 'metric', divisor: 6000, dimThreshold: 30000, dimRounding: 'none', billableStep: 0.1 },
  loggi: { label: 'Loggi · 167 kg/m³ (≈ 5,988)', unit: 'metric', divisor: 5988, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // Amazon FBA Brasil adds 20 g of packaging to the product weight.
  amazonBr: { label: 'Amazon FBA Brasil · 6,000 · +20 g packaging', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1, packagingWeight: 0.02 },
  // Spain, Mexico, Latin America
  dhlExpress: { label: 'DHL Express · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  estafeta: { label: 'Estafeta · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  mexpost: { label: 'Correos de México (Mexpost) · 6,000', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 1 },
  correosEs: { label: 'Correos España (Paq Estándar / Premium) · 6,000', unit: 'metric', divisor: 6000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // Chilexpress (national): volumetric weight only when a side is over 60 cm.
  chilexpress: { label: 'Chilexpress · 4,000 · sides over 60 cm', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1, dimMinLongestSide: 60 },
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
  // Australia Post: non-contract (e.g. MyPost Business) parcels under 1 kg actual weight are generally not cubed.
  auspost: { label: 'Australia Post · 250 kg/m³ · non-contract: none under 1 kg', unit: 'metric', divisor: 4000, dimThreshold: 0, dimExemptBelowWeight: 1, dimRounding: 'none', billableStep: 0.1 },
  // StarTrack terms 4.9: partial chargeable kilograms are rounded up to the next whole kilogram.
  startrack: { label: 'StarTrack Road Express / Premium · 250 kg/m³ · whole kg', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 1 },
  startrackFpp: { label: 'StarTrack Fixed Price Premium · 190 kg/m³ · whole kg', unit: 'metric', divisor: 5263, dimThreshold: 0, dimRounding: 'none', billableStep: 1 },
  aramexAu: { label: 'Aramex Australia · 250 kg/m³', unit: 'metric', divisor: 4000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // India
  delhivery: { label: 'Delhivery box · 5,000', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.1 },
  // Delhivery help centre: flyer shipments are charged on dead weight up to 1 kg.
  delhiveryFlyer: { label: 'Delhivery flyer · dead weight up to 1 kg', unit: 'metric', divisor: 5000, dimThreshold: 0, dimExemptBelowWeight: 1, dimExemptInclusive: true, dimRounding: 'none', billableStep: 0.1 },
  amazonIn: { label: 'Amazon Easy Ship · 5,000 · 500 g steps', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
  bluedartAir: { label: 'Blue Dart air · 5,000 · half-kg steps', unit: 'metric', divisor: 5000, dimThreshold: 0, dimRounding: 'none', billableStep: 0.5 },
};

/** Official source for each preset's rule (shown next to the result). */
export const PRESET_SOURCES = {
  ups139: 'https://www.ups.com/us/en/support/shipping-support/shipping-dimensions-weight',
  ups166: 'https://www.ups.com/us/en/support/shipping-support/shipping-dimensions-weight',
  fedex139: 'https://www.fedex.com/en-us/shipping/packaging/what-is-dimensional-weight.html',
  usps139: 'https://about.usps.com/postal-bulletin/2026/pb22705/html/updt_001.htm',
  correios: 'https://www.correios.com.br/enviar/precisa-de-ajuda/contrate-os-correios/arquivos/contratos-formalizados-ate-fevereiro-de-2020/18-termo-de-condicoes-de-prestacao-de-servicos-de-encomendas-nacio-ns-sedex-e-pac.pdf',
  loggi: 'https://www.loggi.com/termos-condicoes-clientes/',
  amazonBr: 'https://venda.amazon.com.br/precos',
  dhlExpress: 'https://mydhl.express.dhl/content/dam/downloads/es/es/rate-guide/service_and_rate_guide_es_es_2026.pdf',
  estafeta: 'https://estafetamembers.zendesk.com/hc/es/articles/216674137--C%C3%B3mo-se-calcula-el-peso-de-mis-paquetes',
  mexpost: 'https://www.correosdemexico.gob.mx/DATOSABIERTOS/Tarifas/Mexpost/Tarifas_Mexpost.pdf',
  correosEs: 'https://www.correos.es/es/es/empresas/enviar/envios-nacionales/paquete-estandar',
  chilexpress: 'https://cxpgdastprod.blob.core.windows.net/mdn/documentos/Guia_de_servicios.pdf',
  coordinadora: 'https://www.coordinadora.com/tarifas-e-informacion-general/',
  upsUk: 'https://assets.ups.com/adobe/assets/urn:aaid:aem:f9426dfc-9318-4338-8a0e-fc1bf01dc65c/original/as/preview-rate-guide-base-gb-en.pdf',
  ukIntl5000: 'https://www.parcelforce.com/help-and-advice/sending/how-to-measure-a-parcel-for-international-delivery',
  // Evri international also uses ÷ 5,000: https://www.evri.com/send/parcel-size-and-weight-guide
  dhlParcelUk: 'https://send.dhlparcel.co.uk/resources/how-to-weigh-and-measure-a-parcel',
  canadaPost: 'https://www.canadapost-postescanada.ca/cpc/doc/en/support/customer-guide/section_6_the_abcs_of_shipping.pdf',
  canadaPostRegular: 'https://www.canadapost-postescanada.ca/cpc/doc/en/support/customer-guide/section_6_the_abcs_of_shipping.pdf',
  upsCa: 'https://www.ups.com/ca/en/support/shipping-support/shipping-dimensions-weight',
  upsCaAir: 'https://www.ups.com/ca/en/support/shipping-support/shipping-dimensions-weight',
  auspost: 'https://auspost.com.au/business/business-ideas/ecommerce-jargon-busters/what-is-cubic-weight',
  startrack: 'https://auspost.com.au/terms-conditions/startrack-terms-and-conditions',
  startrackFpp: 'https://auspost.com.au/content/dam/startrack_corp/documents/startrack-additional-charges.pdf',
  aramexAu: 'https://www.aramex.com.au/terms-and-conditions/conditions-of-carriage/domestic-conditions-of-carriage/',
  delhivery: 'https://help.delhivery.com/docs/calculating-volumetric-weight',
  delhiveryFlyer: 'https://help.delhivery.com/docs/calculating-volumetric-weight',
  amazonIn: 'https://sell.amazon.in/fees-and-pricing',
  bluedartAir: 'https://www.bluedart.com/terms-condition',
};

/** Translated preset labels (fall back to the English label). */
export const PRESET_LABELS = {
  'pt-br': {
    correios: 'Correios SEDEX/PAC · 6.000 (regra dos 5 kg)',
    loggi: 'Loggi · 167 kg/m³ (≈ 5.988)',
    amazonBr: 'Amazon FBA Brasil · 6.000 · +20 g de embalagem',
    metric5000: 'Genérico · 5.000 cm³/kg',
    metric6000: 'Genérico · 6.000 cm³/kg',
    dhlExpress: 'DHL Express · 5.000',
  },
  es: {
    dhlExpress: 'DHL Express · 5.000',
    estafeta: 'Estafeta · 5.000',
    mexpost: 'Correos de México (Mexpost) · 6.000',
    correosEs: 'Correos España (Paq Estándar / Premium) · 6.000',
    chilexpress: 'Chilexpress · 4.000 · lados de más de 60 cm',
    coordinadora: 'Coordinadora (Colombia) · 2.500',
    metric5000: 'Genérico · 5.000 cm³/kg',
    metric6000: 'Genérico · 6.000 cm³/kg',
  },
};

/** Which presets each page offers, in display order. */
export const PRESET_GROUPS = {
  us: ['ups139', 'ups166', 'fedex139', 'usps139', 'metric5000', 'metric6000'],
  br: ['correios', 'loggi', 'amazonBr', 'dhlExpress', 'metric6000', 'metric5000'],
  es: ['correosEs', 'dhlExpress', 'estafeta', 'mexpost', 'chilexpress', 'coordinadora', 'metric5000', 'metric6000'],
  uk: ['upsUk', 'ukIntl5000', 'dhlParcelUk', 'metric5000', 'metric6000'],
  ca: ['canadaPost', 'canadaPostRegular', 'upsCa', 'upsCaAir', 'metric5000', 'metric6000'],
  au: ['auspost', 'startrack', 'startrackFpp', 'aramexAu', 'metric5000', 'metric6000'],
  in: ['delhivery', 'delhiveryFlyer', 'amazonIn', 'bluedartAir', 'metric5000', 'metric6000'],
};

/** Preset-only rules that have no form field; they apply while that preset is selected. */
export const presetExtras = (key) => {
  const rule = PRESETS[key];
  if (!rule) return {};
  return {
    packagingWeight: rule.packagingWeight ?? 0,
    dimExemptInclusive: Boolean(rule.dimExemptInclusive),
    dimMinLongestSide: rule.dimMinLongestSide ?? 0,
  };
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

// Results are rounded to 6 decimals so 0.1-unit steps never show float noise (1.2000000000000002).
const clean = (value) => Math.round(value * 1e6) / 1e6;

const roundUp = (value, step = 1) => {
  const safeStep = Math.max(number(step, 1), 0.000001);
  return clean(Math.ceil(clean(value / safeStep) - 1e-9) * safeStep);
};

/** Largest accepted dimension / weight, so absurd input can't overflow to Infinity. */
const MAX_INPUT = 100000;

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
  // A missing, zero or negative divisor is not a rule; flag it instead of silently dividing by 1.
  const divisorInput = input.divisor === undefined || input.divisor === null ? defaultDivisor : Number(input.divisor);
  const hasRule = Number.isFinite(divisorInput) && divisorInput > 0 && input.divisor !== '';
  const divisor = hasRule ? divisorInput : defaultDivisor;
  const dimRounding = resolveRounding(input);
  const billableStep = number(input.billableStep, unit === 'metric' ? 0.5 : 1);
  const rawDimensions = [input.length, input.width, input.height].map((value) => Math.min(number(value), MAX_INPUT));
  const dimensions = rawDimensions.map((value) => roundDimension(value, dimRounding));
  const [length, width, height] = dimensions;
  // Some services add a fixed packaging weight (e.g. Amazon FBA Brasil, 20 g).
  const packagingWeight = number(input.packagingWeight, 0);
  const actualWeight = Math.min(number(input.actualWeight), MAX_INPUT) + packagingWeight;
  const quantity = Math.min(Math.max(1, Math.floor(number(input.quantity, 1))), 1000000);
  const volume = length * width * height;
  const dimRaw = clean(volume / divisor);
  const dimWeight = roundUp(dimRaw, billableStep);
  const roundedActual = roundUp(actualWeight, billableStep);
  // Some services (e.g. USPS) only apply DIM pricing above a volume threshold.
  const dimThreshold = number(input.dimThreshold, 0);
  // Some services don't cube light parcels (e.g. Australia Post under 1 kg, Delhivery flyers).
  const dimExemptBelowWeight = number(input.dimExemptBelowWeight, 0);
  const exemptByWeight = dimExemptBelowWeight > 0
    && (input.dimExemptInclusive ? actualWeight <= dimExemptBelowWeight : actualWeight < dimExemptBelowWeight);
  const exemptByVolume = dimThreshold > 0 && volume <= dimThreshold;
  // Some services only cube parcels with a side over a limit (e.g. Chilexpress, 60 cm).
  const dimMinLongestSide = number(input.dimMinLongestSide, 0);
  const exemptBySize = dimMinLongestSide > 0 && Math.max(...dimensions) <= dimMinLongestSide;
  const dimApplies = !exemptByVolume && !exemptByWeight && !exemptBySize;
  const billableWeight = dimApplies ? Math.max(dimWeight, roundedActual) : roundedActual;
  const airWeight = clean(Math.max(0, billableWeight - roundedActual));
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
  const salePrice = Math.min(number(input.salePrice), 1e12);
  const productCost = Math.min(number(input.productCost), 1e12);
  const packagingCost = Math.min(number(input.packagingCost), 1e12);
  const shippingCost = Math.min(number(input.shippingCost), 1e12);
  const fees = Math.min(number(input.fees), 1e12);
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
    totalBillableWeight: clean(billableWeight * quantity),
    hasDimensions: rawDimensions.every((value) => value > 0),
    hasRule,
    packagingWeight,
    airWeight,
    airPercent,
    lengthPlusGirth,
    longestSide,
    targetDimensions,
    canShrink: dimApplies && scale < 0.999 && targetDimensions.every((value) => value > 0),
    dimApplies,
    dimThreshold,
    dimExemptBelowWeight,
    exemptByWeight,
    exemptByVolume,
    exemptBySize,
    dimMinLongestSide,
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

/* ---------- CSV import (international) ---------- */

export const MAX_CSV_BYTES = 5 * 1024 * 1024;
export const MAX_CSV_ROWS = 5000;

/** Pick the separator from the header line: comma, semicolon (Excel in Europe/Brazil) or tab. */
export function detectDelimiter(text = '') {
  const firstLine = String(text).split(/\r?\n/, 1)[0] ?? '';
  let inQuotes = false;
  const counts = { ',': 0, ';': 0, '\t': 0 };
  for (const char of firstLine) {
    if (char === '"') inQuotes = !inQuotes;
    else if (!inQuotes && char in counts) counts[char] += 1;
  }
  if (counts['\t'] > counts[','] && counts['\t'] > counts[';']) return '\t';
  return counts[';'] > counts[','] ? ';' : ',';
}

/** RFC 4180 parser: quoted fields, "" escapes, separators and line breaks inside quotes, CRLF, BOM. */
export function parseCsvTable(text = '', delimiter = detectDelimiter(text)) {
  const source = String(text).replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') { field += '"'; i += 1; } else inQuotes = false;
      } else field += char;
    } else if (char === '"') inQuotes = true;
    else if (char === delimiter) { row.push(field); field = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i += 1;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += char;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.map((cells) => cells.map((cell) => cell.trim())).filter((cells) => cells.some((cell) => cell !== ''));
}

/**
 * Read a number written in any common style: 1.5, 1,5, 1.234,5, 1,234.5, 1 234,5.
 * decimalMark ('.' or ',') says which mark the person normally uses (from the page language or
 * the CSV separator). It decides ambiguous input: "5,000" is five thousand on an English page
 * (decimal mark '.'), and "5.000" is five thousand on a Portuguese page (decimal mark ',').
 * Without a hint, a lone separator is read as a decimal mark.
 * Returns undefined for an empty cell and NaN for text that is not a number.
 */
export function parseLocaleNumber(value, decimalMark) {
  let text = String(value ?? '').trim().replace(/[\s\u00a0\u202f']/g, '');
  if (!text) return undefined;
  const negative = text.startsWith('-');
  if (negative) text = text.slice(1);
  const dots = (text.match(/\./g) ?? []).length;
  const commas = (text.match(/,/g) ?? []).length;
  const grouped = (mark) => new RegExp(`^\\d{1,3}(\\${mark}\\d{3})+$`).test(text);
  if (dots && commas) {
    const decimal = text.lastIndexOf('.') > text.lastIndexOf(',') ? '.' : ',';
    const thousands = decimal === '.' ? ',' : '.';
    const [whole, fraction, extra] = text.split(decimal);
    if (extra !== undefined || !new RegExp(`^\\d{1,3}(\\${thousands}\\d{3})*$`).test(whole)) return Number.NaN;
    text = `${whole.split(thousands).join('')}.${fraction}`;
  } else if (dots + commas > 1) {
    // Several of the same mark: only valid as thousands groups (1.234.567 or 1,234,567).
    const mark = dots ? '.' : ',';
    if (!grouped(mark)) return Number.NaN;
    text = text.split(mark).join('');
  } else if (dots + commas === 1) {
    const mark = dots ? '.' : ',';
    // A lone mark followed by exactly three digits is a thousands separator when it is not
    // the person's decimal mark (5,000 on an English page; 5.000 on a Portuguese page).
    if (decimalMark && mark !== decimalMark && grouped(mark)) text = text.replace(mark, '');
    else text = text.replace(mark, '.');
  }
  if (!/^(\d+\.?\d*|\.\d+)$/.test(text)) return Number.NaN;
  return negative ? -Number(text) : Number(text);
}

const LENGTH_TO_CM = { mm: 0.1, cm: 1, m: 100, in: 2.54, inch: 2.54, inches: 2.54, '"': 2.54 };
const WEIGHT_TO_KG = { g: 0.001, gr: 0.001, grams: 0.001, kg: 1, kgs: 1, lb: 0.45359237, lbs: 0.45359237, oz: 0.028349523 };

/**
 * Read a CSV measurement, converting any unit written in the cell (500g, 12in, 2 lb) to the calculator's unit.
 * defaultUnit is the unit implied by the column header when the cell has none.
 */
export function parseMeasure(value, kind, targetUnit = 'metric', defaultUnit = '', decimalMark) {
  const text = String(value ?? '').trim().toLowerCase().replace(/[\s\u00a0]+/g, '');
  if (!text) return undefined;
  const match = text.match(/^(.*?)(mm|cm|m|inches|inch|in|"|grams|gr|g|kgs|kg|lbs|lb|oz)?$/);
  const unit = match?.[2] || defaultUnit;
  let numberText = match?.[1] ?? text;
  const table = kind === 'length' ? LENGTH_TO_CM : WEIGHT_TO_KG;
  if (unit && !(unit in table)) return Number.NaN;
  // Grams are whole numbers, so 1.250 or 1,250 means one thousand two hundred and fifty.
  if ((unit === 'g' || unit === 'gr' || unit === 'grams') && /^\d{1,3}([.,]\d{3})+$/.test(numberText)) numberText = numberText.replace(/[.,]/g, '');
  const parsed = parseLocaleNumber(numberText, decimalMark);
  if (parsed === undefined || Number.isNaN(parsed) || !unit) return parsed;
  const base = parsed * table[unit];
  if (kind === 'length') return clean(targetUnit === 'metric' ? base : base / 2.54);
  return clean(targetUnit === 'metric' ? base : base / 0.45359237);
}

const normaliseHeader = (cell) => String(cell).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const AUDIT_HEADER_RULES = [
  ['sku', (h) => /(^|_)sku($|_)/.test(h) || h === 'codigo' || h === 'item_code'],
  ['quantity', (h) => /qty|quantity|quantidade|cantidad|^units?$|unidades/.test(h)],
  ['weight', (h) => /weight|peso|grams|^gramos$|^gramas$/.test(h)],
  ['width', (h) => /width|largura|ancho/.test(h) || h === 'w'],
  ['height', (h) => /height|altura|^alto/.test(h) || h === 'h'],
  ['length', (h) => /length|comprimento|^largo|longitud/.test(h) || h === 'l'],
  ['name', (h) => /^(name|title|product|produto|producto|nome|nombre|descri)/.test(h)],
];

const mapHeader = (cells, rules) => {
  const map = {};
  cells.forEach((cell, index) => {
    const header = normaliseHeader(cell);
    const match = rules.find(([key, test]) => map[key] === undefined && test(header));
    if (match) map[match[0]] = { index, header };
  });
  return map;
};

/**
 * Parse a package CSV with row-level errors.
 * Accepts the six-column format (sku,length,width,height,weight,quantity), with or without a header,
 * and common exports (WooCommerce "Length (cm)", Shopify "Variant Grams"…). Grams are converted to kg or lb.
 */
export function parseAuditCsvDetailed(text = '', { unit = 'metric' } = {}) {
  const raw = String(text || '');
  if (raw.length > MAX_CSV_BYTES) return { rows: [], errors: [], tooLarge: true, delimiter: ',' };
  const delimiter = detectDelimiter(raw);
  const table = parseCsvTable(raw, delimiter);
  if (!table.length) return { rows: [], errors: [], tooLarge: false, delimiter };
  const headerMap = mapHeader(table[0], AUDIT_HEADER_RULES);
  const hasHeader = ['length', 'width', 'height'].filter((key) => headerMap[key]).length >= 2 || Boolean(headerMap.sku && headerMap.weight);
  const columns = hasHeader
    ? headerMap
    : { sku: { index: 0 }, length: { index: 1 }, width: { index: 2 }, height: { index: 3 }, weight: { index: 4 }, quantity: { index: 5 } };
  // A first row of words that isn't a header we recognise: say so instead of reporting every row as bad.
  const looksLikeWords = (cells) => cells.filter((cell) => /[a-zà-ÿ]/i.test(cell) && !Number.isFinite(parseLocaleNumber(cell))).length >= 2
    && [1, 2, 3].every((index) => !Number.isFinite(parseMeasure(cells[index], 'length')));
  if (!hasHeader && looksLikeWords(table[0])) return { rows: [], errors: [{ row: 1, reason: 'header' }], tooLarge: false, delimiter };
  // Semicolon files come from Excel set to a decimal comma; comma files use a decimal point.
  const csvDecimal = delimiter === ';' ? ',' : delimiter === ',' ? '.' : undefined;
  const body = table.slice(hasHeader ? 1 : 0);
  if (body.length > MAX_CSV_ROWS) return { rows: [], errors: [], tooLarge: true, delimiter };
  // Units written in the header, e.g. "Weight (g)", "Length (in)", "Variant Grams".
  const headerUnit = (key, kind) => {
    const header = columns[key]?.header ?? '';
    if (kind === 'weight') {
      if (/gram|(^|_)g($|_)|(^|_)gr($|_)/.test(header)) return 'g';
      if (/(^|_)lbs?($|_)|pound/.test(header)) return 'lb';
      if (/(^|_)oz($|_)|ounce/.test(header)) return 'oz';
      if (/(^|_)kgs?($|_)/.test(header)) return 'kg';
      return '';
    }
    if (/(^|_)mm($|_)/.test(header)) return 'mm';
    if (/(^|_)cm($|_)/.test(header)) return 'cm';
    if (/(^|_)(in|inch|inches)($|_)/.test(header)) return 'in';
    return '';
  };
  const rows = [];
  const errors = [];
  body.forEach((cells, index) => {
    const line = index + (hasHeader ? 2 : 1);
    const cell = (key) => (columns[key] ? cells[columns[key].index] : undefined);
    const [length, width, height] = ['length', 'width', 'height'].map((key) => parseMeasure(cell(key), 'length', unit, headerUnit(key, 'length'), csvDecimal));
    if (![length, width, height].every((value) => Number.isFinite(value) && value > 0)) {
      errors.push({ row: line, reason: 'dims' });
      return;
    }
    const weight = parseMeasure(cell('weight'), 'weight', unit, headerUnit('weight', 'weight'), csvDecimal);
    if (Number.isNaN(weight) || weight < 0) { errors.push({ row: line, reason: 'weight' }); return; }
    const quantity = parseLocaleNumber(cell('quantity'), csvDecimal);
    if (Number.isNaN(quantity) || quantity < 0) { errors.push({ row: line, reason: 'qty' }); return; }
    rows.push({
      sku: cell('sku') || cell('name') || `Row ${line}`,
      length,
      width,
      height,
      actualWeight: weight ?? 0,
      quantity: quantity ? Math.max(1, Math.floor(quantity)) : 1,
    });
  });
  return { rows, errors, tooLarge: false, delimiter };
}

export function parseAuditCsv(text, options) {
  return parseAuditCsvDetailed(text, options).rows;
}

export function escapeCsv(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const BOX_HEADER_RULES = [
  ['cost', (h) => /cost|custo|costo|price|preco|precio/.test(h)],
  ['width', (h) => /width|largura|ancho/.test(h) || h === 'w'],
  ['height', (h) => /height|altura|^alto/.test(h) || h === 'h'],
  ['length', (h) => /length|comprimento|^largo|longitud/.test(h) || h === 'l'],
  ['name', (h) => /^(name|box|caixa|caja|nome|nombre|carton)/.test(h)],
];

/** Parse a box list CSV (name,length,width,height,cost) with the same international rules. */
export function parseBoxes(text) {
  const raw = String(text || '');
  if (raw.length > MAX_CSV_BYTES) return [];
  const delimiter = detectDelimiter(raw);
  const table = parseCsvTable(raw, delimiter);
  if (!table.length) return [];
  const boxDecimal = delimiter === ';' ? ',' : delimiter === ',' ? '.' : undefined;
  const headerMap = mapHeader(table[0], BOX_HEADER_RULES);
  const hasHeader = ['length', 'width', 'height'].filter((key) => headerMap[key]).length >= 2;
  const columns = hasHeader ? headerMap : { name: { index: 0 }, length: { index: 1 }, width: { index: 2 }, height: { index: 3 }, cost: { index: 4 } };
  return table.slice(hasHeader ? 1 : 0, (hasHeader ? 1 : 0) + MAX_CSV_ROWS).map((cells, index) => {
    const cell = (key) => (columns[key] ? cells[columns[key].index] : undefined);
    const value = (key) => { const parsed = parseLocaleNumber(cell(key), boxDecimal); return Number.isFinite(parsed) && parsed > 0 ? parsed : 0; };
    return { name: cell('name') || `Box ${index + 1}`, length: value('length'), width: value('width'), height: value('height'), cost: value('cost') };
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
    dimExemptBelowWeight: input.dimExemptBelowWeight,
    dimExemptInclusive: input.dimExemptInclusive,
    dimMinLongestSide: input.dimMinLongestSide,
    packagingWeight: input.packagingWeight,
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
  preset: 'p', divisor: 'd', dimThreshold: 't', dimRounding: 'r', billableStep: 's', dimExemptBelowWeight: 'x',
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
  for (const field of ['length', 'width', 'height', 'actualWeight', 'quantity', 'divisor', 'dimThreshold', 'dimExemptBelowWeight']) {
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
    out.dimExemptBelowWeight ??= rule.dimExemptBelowWeight ?? 0;
  }
  return out;
}
