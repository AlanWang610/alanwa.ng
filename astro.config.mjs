import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://alanwa.ng',
  output: 'static',
  integrations: [react(), sitemap()],
  build: {
    assets: '_assets',
  },
});
