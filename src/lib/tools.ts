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
  { href: '/box-margin-optimizer/', name: 'Box & margin optimizer', short: 'Box optimizer', blurb: 'Find the box with the lowest total shipping cost.' },
  { href: '/shipping-margin-calculator/', name: 'Shipping margin calculator', short: 'Margin', blurb: 'See the profit left after shipping, packaging and fees.' },
  { href: '/volumetric-weight-calculator/', name: 'Volumetric weight calculator (kg)', short: 'Volumetric kg', blurb: 'Metric and international: 5,000 vs 6,000 cm³/kg.' },
  { href: '/billable-weight-calculator/', name: 'Billable weight calculator', short: 'Billable weight', blurb: 'Which weight you are charged for, and why.' },
  { href: '/package-girth-calculator/', name: 'Length + girth calculator', short: 'Girth', blurb: 'Check oversize measurements before you ship.' },
  { href: '/batch-shipping-audit/', name: 'Batch shipping audit (CSV)', short: 'Batch audit', blurb: 'Audit a whole catalogue privately in your browser.' },
];
