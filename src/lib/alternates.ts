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

/** Country versions of the calculator, used by the header menu, country pickers and footer. */
export type CountryCode = 'us' | 'gb' | 'ca' | 'au' | 'in' | 'br' | 'es';
export const COUNTRY_LINKS: { code: CountryCode; short: string; label: string; carriers: string; href: string; hreflang: string }[] = [
  { code: 'us', short: 'US', label: 'United States', carriers: 'UPS · FedEx · USPS', href: '/dimensional-weight-calculator/', hreflang: 'en-US' },
  { code: 'gb', short: 'UK', label: 'United Kingdom', carriers: 'UPS · DHL Parcel', href: '/uk/volumetric-weight-calculator/', hreflang: 'en-GB' },
  { code: 'ca', short: 'CA', label: 'Canada', carriers: 'Canada Post · UPS · FedEx', href: '/canada/dimensional-weight-calculator/', hreflang: 'en-CA' },
  { code: 'au', short: 'AU', label: 'Australia', carriers: 'Australia Post · StarTrack', href: '/australia/cubic-weight-calculator/', hreflang: 'en-AU' },
  { code: 'in', short: 'IN', label: 'India', carriers: 'Delhivery · Amazon · Blue Dart', href: '/india/volumetric-weight-calculator/', hreflang: 'en-IN' },
  { code: 'br', short: 'BR', label: 'Brasil', carriers: 'Correios · Loggi · Amazon', href: '/pt-br/calculadora-peso-cubado/', hreflang: 'pt-BR' },
  { code: 'es', short: 'ES', label: 'España y Latinoamérica', carriers: 'Correos · DHL · Estafeta', href: '/es/calculadora-peso-volumetrico/', hreflang: 'es' },
];
