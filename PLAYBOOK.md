# ShippingMath Playbook

How shippingmath.com is built, how to run it, and what to do next. Last updated: 2 Nov 2026.

---

## 1. What the site is

ShippingMath is a set of free shipping calculators for online sellers. Everything runs in the visitor's browser, with no sign-up and no data stored.

- **Live site:** https://shippingmath.com
- **Code:** this repository (GitHub: HarshParmar321/ShipMargin)
- **Languages:** English, Brazilian Portuguese (`/pt-br/`), Spanish (`/es/`)
- **Countries covered:** US, UK, Canada, Australia, India, Brazil, Spain/Latin America

### Pages (40 in the sitemap)

| Type | Pages |
| --- | --- |
| Calculators (EN) | `/` (home), `/dimensional-weight-calculator/`, `/usps-dimensional-weight-calculator/`, `/amazon-fba-dimensional-weight-calculator/`, `/billable-weight-calculator/`, `/volumetric-weight-calculator/`, `/package-girth-calculator/`, `/shipping-margin-calculator/`, `/batch-shipping-audit/`, `/box-margin-optimizer/` |
| Country pages | `/uk/volumetric-weight-calculator/`, `/canada/dimensional-weight-calculator/`, `/australia/cubic-weight-calculator/`, `/india/volumetric-weight-calculator/`, `/pt-br/calculadora-peso-cubado/`, `/es/calculadora-peso-volumetrico/` |
| Guides | `/how-to-calculate-dimensional-weight/`, `/dimensional-weight-chart/`, `/ups-vs-fedex-vs-usps-dimensional-weight/`, `/how-to-reduce-dimensional-weight/`, `/holiday-shipping-surcharges-2026/` |
| Info | `/methodology/`, `/about/`, `/contact/`, `/privacy/`, `/terms/` and their pt-BR / es versions |

---

## 2. How it's built

- **Framework:** Astro (static site). Pages live in `src/pages/`.
- **Hosting:** Cloudflare Workers static assets (`wrangler.jsonc`), custom domain shippingmath.com; `www` redirects to the bare domain.
- **Security headers:** `scripts/write-headers.mjs` writes `dist/_headers` (CSP, HSTS and others) after every build.
- **Sitemap:** generated automatically on every build (`@astrojs/sitemap`). Never edit it by hand.
- **Analytics:** Cloudflare Web Analytics (automatic, no cookies).
- **Email:** support@shippingmath.com forwards to the owner's Gmail (Cloudflare Email Routing).

### Important files

| File | What it holds |
| --- | --- |
| `src/lib/shipping.mjs` | The calculation engine and every carrier rule (divisors, rounding, thresholds), with sources |
| `src/lib/amazonFba.mjs` | Amazon FBA US size tiers, dimensional weight and the 2026 fee tables |
| `src/lib/tools.ts` | Lists of tools and guides (used by the menu, footer, home page and related links) |
| `src/lib/partners.ts` | "Ship it cheaper" shipping-software suggestions and affiliate links |
| `src/lib/locales.ts`, `src/lib/calculatorCopy.ts` | Portuguese and Spanish text |
| `src/components/` | Calculator, box optimizer, Amazon FBA calculator, page layout, partner box |
| `tests/` | Automatic tests (66). They must all pass before a deploy |

---

## 3. How to update and deploy

Run these in the `shipmargin` folder on the Mac:

```bash
npm run deploy            # tests + type check + build + publish to Cloudflare
git add -A
git commit -m "What you changed"
git push
```

`npm run deploy` stops if any test fails, so a broken calculator can't go live.

After deploying new or changed pages:

1. Google Search Console → paste the page URL in the top bar → **Request indexing** (about 10 a day).
2. The sitemap updates by itself; nothing to submit again.

---

## 4. Things that expire: put these in your calendar

| Date | What to update | Where |
| --- | --- | --- |
| Early Jan 2027 | Amazon publishes 2027 FBA fees. Add the new rate card (the 2026 tables end 14 Jan 2027) | `src/lib/amazonFba.mjs` + tests |
| After 17 Jan 2027 | Holiday surcharges are over. Mark the 2026 page as past and, in Aug–Sep 2027, make a 2027 version | `src/pages/holiday-shipping-surcharges-2026/` |
| January every year | UPS, FedEx and USPS publish new rates and surcharges. Check that divisors and rounding are unchanged | `src/lib/shipping.mjs`, `/methodology/` |
| July 2027 | USPS usually changes prices in July; check the 139 divisor and the 1,728 in³ rule | `src/lib/shipping.mjs` |
| Every 3 months | Check country carrier rules (Canada Post, Australia Post, Correios, Delhivery and others) | `src/lib/shipping.mjs` |

Rule: **never put a number on the site that isn't from the carrier's own page.** Add the source link next to it.

---

## 5. Getting traffic: the launch plan

The full day-by-day plan with ready-to-post texts is the "ShippingMath 30-Day Launch Plan" doc. Summary:

**One message everywhere:** *"You're paying to ship air."* Show one surprising number, then let people check their own box for free.

| When | Action |
| --- | --- |
| Mon 2 Nov | Reddit post in r/FulfillmentByAmazon (Amazon 2-inch rule) |
| Tue 3 Nov | Show HN on Hacker News |
| Wed 4 Nov | r/EtsySellers (USPS 1,728 in³ rule, holiday surcharges) |
| Tue 10 Nov | Product Hunt launch |
| 9–30 Nov | 5 personal outreach emails a day to blogs, newsletters and podcasts |
| 16–22 Nov | India, Brazil and Spain/LatAm seller groups, in their language |
| 27 Nov | Black Friday: answer questions all day |

**Every day (about 1 hour):** 3 helpful answers on Reddit, Quora or seller forums; reply to every comment.

**Never:** buy upvotes, links, reviews or followers; post the same text everywhere; ask people to upvote.

### Search positions on 28 Oct 2026 (Search Console, last 28 days)

- Best: "cubic weight calculator australia post" (#7) and "australia post cubic weight calculator" (#11). Push Australia first.
- Big terms ("dimensional weight calculator", "dim weight calculator") are at #58–63. They need backlinks.
- Average position 57.6; 191 impressions; 2 clicks.

---

## 6. Making money

| Stream | Status | Next step |
| --- | --- | --- |
| **Affiliate links** ("Ship it cheaper" box on 16 pages) | Built; plain links for now | Apply: ShipStation (impact.com, $35–$400 per paying customer), Easyship (impact.com, from $29 + 2.5% of shipping for a year), Shippo (PartnerStack, $60 per Pro user). Paste each tracking link into `affiliateUrl` in `src/lib/partners.ts`, then deploy. The disclosure and `rel="sponsored"` switch on automatically |
| **Paid shipping audits** | Idea | Sell a $29–$99 "shipping cost audit" (Fiverr, Upwork, seller groups) using the batch audit and box optimizer. Works even with low traffic |
| **Email list** ("alert me when carrier rules change") | Not built | Create a free Buttondown account; Claude adds the signup form |
| **Sponsorship** | Later | At a few thousand visitors a month, sell the "Ship it cheaper" slot to one shipping company for a monthly fee |
| **Google AdSense** | Later | Apply at about 10,000 page views a month. Pays at $100 balance, between the 21st and 26th of the month, after address verification (PIN letter) |

---

## 7. Weekly routine (every Monday, 15 minutes)

1. **Real visitors:** Cloudflare → Analytics & Logs → **Web Analytics** (with "Exclude bots" on). Ignore the Requests tab and the domain list's "unique visitors": they include bots.
2. **Google:** Search Console → Performance → last 7 days: clicks, impressions, and the Queries list with Average position.
3. **Links:** Search Console → Links → Top linking sites.
4. Write the numbers in the launch plan's tracking table.
5. Ask:
   - Which post or page brought the most visitors? Do more of that.
   - Which searches are at position 8–20? Improve those pages.
   - What did people ask in comments? Each repeated question becomes an FAQ answer or a guide.

### Starting numbers

| Date | Real visits | Page views | Google clicks | Linking sites |
| --- | --- | --- | --- | --- |
| 1 Nov 2026 (last 2 weeks) | 80 | 130 | 2 | 0 |

Core Web Vitals: 100% good (LCP P75 948 ms, page load 842 ms).

---

## 8. Roadmap

**November 2026**
- Shareable result card ("I'm paying to ship 14 lb of air") before Product Hunt
- Email signup for rule-change alerts (needs Buttondown)
- Embeddable calculator widget for blogs, agencies and 3PLs (each embed = a backlink)
- Portuguese and Spanish versions of the guides
- Black Friday banner ("Check your boxes before the rush")

**December 2026 – March 2027**
- Amazon FBA 2027 fees (as soon as Amazon publishes them)
- Amazon FBA for other marketplaces (UK, Canada) once their rules are verified
- More country pages only where carrier rules can be verified (Mercado Livre, Jadlog, SEUR, DPD UK, Purolator, DTDC are not verified yet)
- AdSense once traffic reaches about 10,000 page views a month

**Not now:** paid ads, a mobile app, user accounts.

---

## 9. Known limits (stated on the pages, not modelled)

- DHL Express switches to whole kg above 30 kg.
- StarTrack rounds partial kilograms per consignment; the calculator rounds per parcel.
- Correios envelopes are exempt from volumetric weight.
- Delhivery's rule for boxes under 1 kg is unclear.
- The Amazon FBA estimate excludes Overmax, SIPP packaging, low-inventory-level, storage and inbound placement fees.
- Holiday surcharges can change at short notice; the page says so.
