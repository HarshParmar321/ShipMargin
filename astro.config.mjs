// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://shipmargin-audit.gujjuweb3.chatgpt.site',
  output: 'static',
  integrations: [sitemap()],
});
