/**
 * Shipping tools recommended next to the calculators.
 *
 * HOW TO EARN FROM THESE: join the affiliate program listed for each tool, then paste your
 * personal tracking link into `affiliateUrl`. Until then the plain website link is used and no
 * "affiliate" disclosure is shown. Once any link on a page is an affiliate link, the page shows
 * the disclosure automatically and the link gets rel="sponsored".
 *
 * Facts below were checked on the tools' own websites on 27 Oct 2026. Keep claims factual.
 */
export type PartnerRegion = 'us' | 'intl';

export interface Partner {
  key: string;
  name: string;
  /** One factual sentence shown on the card. */
  pitch: string;
  /** Short label on the button. */
  cta: string;
  url: string;
  /** Paste your affiliate tracking link here once approved. Leave '' to use `url`. */
  affiliateUrl: string;
  regions: PartnerRegion[];
  /** Where to apply (for you, not shown on the site). */
  program: string;
}

export const PARTNERS: Partner[] = [
  {
    key: 'pirateship',
    name: 'Pirate Ship',
    pitch: 'Free shipping software for USPS and UPS labels with discounted rates and no monthly fee.',
    cta: 'See Pirate Ship rates',
    url: 'https://www.pirateship.com/',
    affiliateUrl: '',
    regions: ['us'],
    program: 'No public affiliate program (recommended because it helps US sellers).',
  },
  {
    key: 'shipstation',
    name: 'ShipStation',
    pitch: 'Order management and label printing for online stores, with carrier rates compared in one place. Free trial.',
    cta: 'Try ShipStation',
    url: 'https://www.shipstation.com/',
    affiliateUrl: '',
    regions: ['us', 'intl'],
    program: 'https://www.shipstation.com/affiliate-program/ (impact.com; $35–$400 per paying customer).',
  },
  {
    key: 'easyship',
    name: 'Easyship',
    pitch: 'Compare 550+ courier services, including international, and print labels. Free plan available.',
    cta: 'Compare couriers',
    url: 'https://www.easyship.com/',
    affiliateUrl: '',
    regions: ['us', 'intl'],
    program: 'https://www.easyship.com/affiliate-program (impact.com; from $29 per paid subscriber + 2.5% of their shipping for a year).',
  },
  {
    key: 'shippo',
    name: 'Shippo',
    pitch: 'Shipping software that gives you rates from top carriers in one place.',
    cta: 'Try Shippo',
    url: 'https://goshippo.com/',
    affiliateUrl: '',
    regions: ['us'],
    program: 'https://goshippo.com/affiliates (PartnerStack; $60 per new Pro Plan user).',
  },
];

export const partnersFor = (region: PartnerRegion, limit = 3) => PARTNERS.filter((partner) => partner.regions.includes(region)).slice(0, limit);
