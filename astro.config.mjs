import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Sitio bilingue es-MX (default) + en. Estático; CNAME medioevo.space.
export default defineConfig({
  site: 'https://medioevo.space',
  integrations: [sitemap()],
  // Inline el CSS (Tailwind) en <style> para eliminar la request render-blocking → mejora LCP en gama baja.
  build: { inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});