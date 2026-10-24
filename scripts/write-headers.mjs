/**
 * Writes dist/_headers (Cloudflare static assets) after `astro build`.
 * The Content Security Policy allows only our own files, the hashes of our small inline
 * scripts, and Cloudflare Web Analytics. Hashes are recalculated on every build.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const htmlFiles = [];
const walk = (dir) => readdirSync(dir).forEach((name) => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (name.endsWith('.html')) htmlFiles.push(path);
});
walk(dist);

const hashes = new Set();
const inlineScript = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g;
for (const file of htmlFiles) {
  for (const [, body] of readFileSync(file, 'utf8').matchAll(inlineScript)) {
    if (body.trim()) hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')} https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const headers = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
writeFileSync(join(dist, '_headers'), headers);
console.log(`_headers written: ${htmlFiles.length} pages, ${hashes.size} inline script hash(es).`);
