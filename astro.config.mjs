import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://siliconpen.com',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'file'
  }
});
