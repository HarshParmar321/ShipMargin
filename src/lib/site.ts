/**
 * Launch switches. Keep these off until the service really works.
 *
 * SUPPORT_EMAIL: set to 'support@shippingmath.com' only after email forwarding is
 * set up and a test message has arrived. While empty, no address is shown.
 *
 * CLOUDFLARE_ANALYTICS_TOKEN: paste the token from Cloudflare → Analytics & Logs →
 * Web Analytics → Add a site (JS snippet, the value of "token"). Cookieless, so no
 * consent banner is needed. While empty, no analytics script is loaded.
 */
export const SUPPORT_EMAIL = 'support@shippingmath.com';
export const CLOUDFLARE_ANALYTICS_TOKEN = '';

/**
 * Public Google AdSense publisher ID. The verification script is loaded on
 * indexable pages only; ad placements stay disabled until the account is approved.
 */
export const ADSENSE_PUBLISHER_ID = 'ca-pub-3679983774922242';

/**
 * Cloudflare Web Analytics is on through Cloudflare's automatic setup (it injects the
 * beacon itself), so no token is needed. This flag keeps the privacy pages accurate.
 */
export const CLOUDFLARE_WEB_ANALYTICS_ON = true;
export const USES_CLOUDFLARE_ANALYTICS = CLOUDFLARE_WEB_ANALYTICS_ON || Boolean(CLOUDFLARE_ANALYTICS_TOKEN);
