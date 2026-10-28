/** Every English tool page, used for navigation, related links and breadcrumbs. */
export interface Tool {
  href: string;
  name: string;
  short: string;
  blurb: string;
}

export const TOOLS: Tool[] = [
  { href: '/dimensional-weight-calculator/', name: 'Dimensional weight calculator', short: 'DIM weight', blurb: 'UPS, FedEx and USPS rules with rounding built in.' },
  { href: '/usps-dimensional-weight-calculator/', name: 'USPS DIM weight (2026 rules)', short: 'USPS 2026', blurb: 'Divisor 139 and the 1,728 in³ threshold since July 2026.' },
  { href: '/amazon-fba-dimensional-weight-calculator/', name: 'Amazon FBA dimensional weight', short: 'Amazon FBA', blurb: 'Size tier, shipping weight and 2026 fulfillment fee.' },
  { href: '/box-margin-optimizer/', name: 'Box & margin optimizer', short: 'Box optimizer', blurb: 'Find the box with the lowest total shipping cost.' },
  { href: '/shipping-margin-calculator/', name: 'Shipping margin calculator', short: 'Margin', blurb: 'See the profit left after shipping, packaging and fees.' },
  { href: '/volumetric-weight-calculator/', name: 'Volumetric weight calculator (kg)', short: 'Volumetric kg', blurb: 'Metric and international: 5,000 vs 6,000 cm³/kg.' },
  { href: '/billable-weight-calculator/', name: 'Billable weight calculator', short: 'Billable weight', blurb: 'Which weight you are charged for, and why.' },
  { href: '/package-girth-calculator/', name: 'Length + girth calculator', short: 'Girth', blurb: 'Check oversize measurements before you ship.' },
  { href: '/batch-shipping-audit/', name: 'Batch shipping audit (CSV)', short: 'Batch audit', blurb: 'Audit a whole catalogue privately in your browser.' },
];

/** English guide pages (footer, home page and related links). */
export const GUIDES: Tool[] = [
  { href: '/holiday-shipping-surcharges-2026/', name: 'Holiday surcharges 2026', short: 'Holiday 2026', blurb: 'USPS, UPS, FedEx and Amazon peak fees and dates.' },
  { href: '/how-to-calculate-dimensional-weight/', name: 'How to calculate DIM weight', short: 'DIM formula', blurb: 'The formula step by step, in inches and cm.' },
  { href: '/dimensional-weight-chart/', name: 'Dimensional weight chart', short: 'DIM chart', blurb: 'Billable weight of 26 common box sizes at UPS, FedEx and USPS.' },
  { href: '/ups-vs-fedex-vs-usps-dimensional-weight/', name: 'UPS vs FedEx vs USPS', short: 'Carrier rules', blurb: 'Divisors, rounding and size limits side by side.' },
  { href: '/how-to-reduce-dimensional-weight/', name: 'How to reduce DIM weight', short: 'Cut DIM weight', blurb: '10 practical ways to stop paying for air.' },
];
