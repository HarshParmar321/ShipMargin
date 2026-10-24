/**
 * hreflang clusters: pages that answer the same question for different countries/languages.
 * Google shows each searcher the version for their language and country.
 */
export type Alternate = [hreflang: string, path: string];

export const VOLUMETRIC_CLUSTER: Alternate[] = [
  ['en', '/dimensional-weight-calculator/'],
  ['en-US', '/dimensional-weight-calculator/'],
  ['en-GB', '/uk/volumetric-weight-calculator/'],
  ['en-CA', '/canada/dimensional-weight-calculator/'],
  ['en-AU', '/australia/cubic-weight-calculator/'],
  ['en-IN', '/india/volumetric-weight-calculator/'],
  ['pt-BR', '/pt-br/calculadora-peso-cubado/'],
  ['es', '/es/calculadora-peso-volumetrico/'],
  ['x-default', '/dimensional-weight-calculator/'],
];

/** Country pickers shown on calculator pages. */
export const COUNTRY_LINKS: { flag: string; label: string; href: string; hreflang: string }[] = [
  { flag: '🇺🇸', label: 'United States', href: '/dimensional-weight-calculator/', hreflang: 'en-US' },
  { flag: '🇬🇧', label: 'United Kingdom', href: '/uk/volumetric-weight-calculator/', hreflang: 'en-GB' },
  { flag: '🇨🇦', label: 'Canada', href: '/canada/dimensional-weight-calculator/', hreflang: 'en-CA' },
  { flag: '🇦🇺', label: 'Australia', href: '/australia/cubic-weight-calculator/', hreflang: 'en-AU' },
  { flag: '🇮🇳', label: 'India', href: '/india/volumetric-weight-calculator/', hreflang: 'en-IN' },
  { flag: '🇧🇷', label: 'Brasil', href: '/pt-br/calculadora-peso-cubado/', hreflang: 'pt-BR' },
  { flag: '🇪🇸', label: 'España y Latinoamérica', href: '/es/calculadora-peso-volumetrico/', hreflang: 'es' },
];
