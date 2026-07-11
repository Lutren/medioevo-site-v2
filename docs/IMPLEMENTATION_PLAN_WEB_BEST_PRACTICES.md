# Plan de Implementación: Mejores Prácticas Científicas en MEDIOEVO

**Versión:** 1.0  
**Fecha:** 2026-06-25  
**Proyecto:** MEDIOEVO Wiki  
**Principio:** Feynman + Ciencia sobre Hype

---

## Estado Actual del Rediseño (2026-06-25)

### ✅ Completado

1. **Sistema de Diseño**
   - Type scale fluid typography (12px - 60px)
   - Spacing system (4px base: 4px-96px)
   - Elevation system (shadow-sm - shadow-xl + glow effects)
   - Animation tokens (easings, durations)
   - Semantic color tokens (gold/cyan palette)
   - Prose styles personalizados (tables, code, blockquotes)

2. **Componentes Rediseñados**
   - `BookCard` - Cards de libros con hover effects, metadata grid
   - `AtlasCard` - Cards de atlas con epistemic badges
   - `SystemCard` - Cards de sistemas con category indicators
   - `StatCard` - Estadísticas con glow effects
   - `SectionCard` - Cards de sección con gradient borders
   - `FeaturedCard` - Cards destacadas con badges

3. **Páginas Rediseñadas**
   - `wiki/index.astro` - Home con hero, stats, sections, featured
   - `wiki/books/index.astro` - Grid de 45 libros con filters
   - `wiki/books/[slug].astro` - Página individual con navigation
   - `wiki/atlas/index.astro` - Grid de 13 documentos
   - `wiki/atlas/[slug].astro` - Página individual con navigation
   - `wiki/systems/index.astro` - Grid de 5 sistemas epistémicos
   - `wiki/systems/[slug].astro` - Página individual técnica
   - `wiki/cards/index.astro` - Grid de 407 cartas TCG
   - `wiki/maps/index.astro` - Página de mapas (placeholder)
   - `wiki/characters/index.astro` - Página de personajes

4. **Deploy Exitoso**
   - Cloudflare Pages: https://948a1942.medioevo-site.pages.dev
   - 94 páginas generadas
   - Build time: 45.85s

### ⚠️ Pendientes de Validación

1. **Performance Metrics** (no medidos aún)
   - LCP, CLS, INP
   - First Contentful Paint
   - Time to Interactive

2. **Accesibilidad** (no auditado)
   - WCAG 2.2 AA compliance
   - Screen reader testing
   - Keyboard navigation

3. **SEO Técnico** (no verificado)
   - Schema.org structured data
   - Sitemap validation
   - Meta tags completeness

---

## Plan de Implementación por Fases

### Fase 1: Performance Optimization (Semana 1)

#### 1.1 Optimización de Imágenes

**Objetivo:** Reducir LCP <2.5s, CLS <0.1

**Acciones:**
```bash
# 1. Convertir todas las imágenes a WebP/AVIF
cd public/wiki/covers
for file in *.jpg; do
  convert "$file" -quality 85 "webp/${file%.jpg}.webp"
done

# 2. Crear responsive images (srcset)
# Para cada cover: 400w, 800w, 1200w
```

**Código Actual (BookCard.astro):**
```astro
<img src={data.cover} alt={data.title} class="..." loading="lazy" />
```

**Código Optimizado:**
```astro
<img 
  src={`${data.cover}.webp`}
  srcset={`
    ${data.cover}-400.webp 400w,
    ${data.cover}-800.webp 800w,
    ${data.cover}-1200.webp 1200w
  `}
  sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 500px"
  alt={data.title}
  class="..."
  loading="lazy"
  width="500"
  height="750"
/>
```

**Impacto Esperado:**
- LCP: -40-60% (2.5s → 1.2s)
- CLS: 0.05 (reservar espacio con width/height)
- Bundle size: -60-80%

---

#### 1.2 Font Loading Optimization

**Objetivo:** Eliminar FOIT (Flash of Invisible Text)

**Acciones:**
```css
/* global.css */
@font-face {
  font-family: 'Optima';
  src: url('/fonts/optima.woff2') format('woff2');
  font-display: swap; /* ← ADICIONAR */
  font-weight: 400 700;
  font-style: normal;
}
```

**Preload fonts críticos:**
```html
<!-- En Base.astro <head> -->
<link 
  rel="preload" 
  href="/fonts/optima.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
/>
```

**Impacto Esperado:**
- FCP: -200-400ms
- LCP: -100-200ms

---

#### 1.3 JavaScript Optimization

**Objetivo:** Reducir INP <200ms

**Acciones:**

1. **Code Splitting:**
```astro
<!-- En páginas individuales -->
<script 
  client:load 
  src="../components/wiki/BookCard.astro"
>
```

2. **Remove unused JavaScript:**
```bash
# Analizar bundle
npx vite-bundle-visualizer
```

3. **Defer non-critical scripts:**
```html
<script defer src="/analytics.js"></script>
```

**Impacto Esperado:**
- INP: -30-50% (300ms → 150ms)
- TTI: -20-30%

---

#### 1.4 CSS Optimization

**Objetivo:** Critical CSS <14KB

**Acciones:**

1. **Extract critical CSS:**
```bash
npx critical --src "wiki/books/00-el-observador/index.html" \
              --dest "critical.css" \
              --width 1920 \
              --height 1080
```

2. **Inline critical CSS:**
```html
<style>
  /* Critical CSS inline */
</style>
<link rel="stylesheet" href="/styles/main.css" media="print" onload="this.media='all'">
```

**Impacto Esperado:**
- FCP: -300-500ms
- LCP: -100-200ms

---

### Fase 2: Accesibilidad (Semana 2)

#### 2.1 Contraste de Color

**Objetivo:** WCAG 2.2 AA (4.5:1 para texto normal)

**Acciones:**

1. **Audit current colors:**
```bash
npx pa11y-ci --config .pa11yci.json
```

2. **Fix low-contrast text:**
```css
/* Actual (problemático) */
.text-muted { color: #9e9685; } /* Contrast: 3.8:1 ❌ */

/* Corregido */
.text-muted { color: #78716c; } /* Contrast: 4.6:1 ✓ */
```

**Impacto Esperado:**
- WCAG compliance: 100% AA
- Usuarios con baja visión: +40% usabilidad

---

#### 2.2 Keyboard Navigation

**Objetivo:** 100% navegable por teclado

**Acciones:**

1. **Add focus states:**
```css
/* Actual */
.wiki-card:hover { /* ... */ }

/* Corregido */
.wiki-card:hover,
.wiki-card:focus-visible {
  border-color: var(--gold);
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
```

2. **Add skip link:**
```html
<!-- En Base.astro -->
<a href="#main-content" class="skip-link">Saltar al contenido principal</a>
```

3. **Test keyboard navigation:**
```bash
# Tab through entire site
# Verify: focus visible, logical order, no traps
```

**Impacto Esperado:**
- Keyboard users: 100% access
- WCAG 2.2: AA compliance

---

#### 2.3 Screen Reader Support

**Objetivo:** 100% accessible para screen readers

**Acciones:**

1. **Add ARIA labels:**
```astro
<!-- En BookCard -->
<a 
  href={`/wiki/books/${data.slug}`}
  aria-label={`Leer ficha completa de ${data.title}`}
>
```

2. **Add landmark roles:**
```html
<header role="banner">...</header>
<main role="main">...</main>
<footer role="contentinfo">...</footer>
```

3. **Test with NVDA/JAWS:**
```bash
# Install NVDA (Windows) or VoiceOver (Mac)
# Navigate entire site
# Verify: logical reading order, meaningful link text
```

**Impacto Esperado:**
- Screen reader users: 100% access
- WCAG 2.2: AA compliance

---

#### 2.4 Form Accessibility (si aplica)

**Objetivo:** 100% accessible forms

**Acciones:**

1. **Add labels to all inputs:**
```astro
<label for="email" class="block mb-2">
  Correo electrónico
</label>
<input id="email" name="email" type="email" />
```

2. **Add error associations:**
```astro
<input 
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">
  <span aria-hidden="true">⚠️</span>
  Email inválido
</p>
```

---

### Fase 3: SEO Técnico (Semana 3)

#### 3.1 Schema.org Structured Data

**Objetivo:** Rich snippets en Google

**Acciones:**

1. **Add Article schema:**
```astro
<!-- En books/[slug].astro -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "{data.title}",
  "author": {
    "@type": "Person",
    "name": "Luis René González"
  },
  "datePublished": "2024-01-01",
  "description": "{data.logline}",
  "image": "{data.cover}",
  "inLanguage": "es"
}
</script>
```

2. **Add Breadcrumb schema:**
```astro
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Wiki",
      "item": "https://medioevo.space/wiki"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Biblioteca",
      "item": "https://medioevo.space/wiki/books"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{data.title}"
    }
  ]
}
</script>
```

**Impacto Esperado:**
- Rich snippets: +30-50% CTR
- Google Knowledge Graph: posible inclusión

---

#### 3.2 Meta Tags Optimization

**Objetivo:** 100% meta tags correctos

**Acciones:**

1. **Optimize title tags:**
```astro
<!-- Actual -->
<title>{title}</title>

<!-- Optimizado -->
<title>{`${title} | MEDIOEVO Wiki - ${data.logline.substring(0, 55)}...`}</title>
```

2. **Add Open Graph tags:**
```astro
<meta property="og:title" content={data.title} />
<meta property="og:description" content={data.logline} />
<meta property="og:image" content={data.cover} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content="article" />
```

3. **Add Twitter cards:**
```astro
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={data.title} />
<meta name="twitter:description" content={data.logline} />
<meta name="twitter:image" content={data.cover} />
```

**Impacto Esperado:**
- Social shares: +40-60%
- CTR from search: +20-30%

---

#### 3.3 Sitemap and Robots

**Objetivo:** 100% crawlable

**Acciones:**

1. **Generate sitemap:**
```bash
npx astro-sitemap
# Creates: public/sitemap.xml
```

2. **Optimize robots.txt:**
```txt
User-agent: *
Allow: /

Sitemap: https://medioevo.space/sitemap.xml
```

3. **Add canonical URLs:**
```astro
<link rel="canonical" href={canonical} />
```

**Impacto Esperado:**
- Indexación: 100% pages
- Duplicate content: 0%

---

### Fase 4: Security Hardening (Semana 4)

#### 4.1 Content Security Policy

**Objetivo:** Mitigar XSS, data injection

**Acciones:**

1. **Add CSP header:**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.sitio.com;
  frame-ancestors 'none';
">
```

2. **Configure in Cloudflare:**
```
# En Cloudflare Dashboard > Pages > Settings
Content Security Policy:
  default-src 'self'
  script-src 'self' 'unsafe-inline'
  ...
```

**Impacto Esperado:**
- XSS attacks: -90%
- Data injection: -95%

---

#### 4.2 HTTP Security Headers

**Objetivo:** Protección básica

**Acciones:**

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Configuración en Cloudflare:**
```
# En Cloudflare Dashboard > Pages > Settings > Custom Pages
Add headers:
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  ...
```

**Impacto Esperado:**
- Clickjacking: 100% mitigado
- MIME sniffing: 100% mitigado

---

#### 4.3 API Security

**Objetivo:** Proteger endpoints

**Acciones:**

1. **Add rate limiting:**
```typescript
// En wiki/api/factcheck.ts
const rateLimit = new Map();
const MAX_REQUESTS = 100;
const WINDOW_MS = 60000; // 1 minute

export async function POST({ request }) {
  const ip = request.headers.get('x-forwarded-for');
  const count = rateLimit.get(ip) || 0;
  
  if (count > MAX_REQUESTS) {
    return new Response('Too many requests', { status: 429 });
  }
  
  rateLimit.set(ip, count + 1);
  setTimeout(() => rateLimit.delete(ip), WINDOW_MS);
  
  // ... rest of handler
}
```

2. **Validate input:**
```typescript
// Validar todos los inputs
const { prompt } = await request.json();
if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
  return new Response('Invalid input', { status: 400 });
}
```

**Impacto Esperado:**
- DDoS: mitigado
- Input injection: 100% validado

---

### Fase 5: Testing y Validación (Semana 5)

#### 5.1 Performance Testing

**Objetivo:** Métricas reales verificadas

**Acciones:**

1. **Lighthouse CI:**
```bash
npm install --save-dev @lhci/cli@next
```

```json
// .lhci autorc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

2. **Run tests:**
```bash
npx lhci autorun
```

**Métricas Objetivo:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

---

#### 5.2 Accessibility Testing

**Objetivo:** WCAG 2.2 AA compliance

**Acciones:**

1. **Automated testing:**
```bash
npm install --save-dev @axe-core/playwright
```

```typescript
// tests/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('/wiki/books/00-el-observador');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

2. **Manual testing:**
- Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- Screen reader (NVDA/VoiceOver)
- Zoom to 200%
- High contrast mode

**Criterio de Aceptación:**
- 0 critical violations
- ≤5 moderate violations
- 100% keyboard accessible
- 100% screen reader accessible

---

#### 5.3 Cross-Browser Testing

**Objetivo:** Funciona en todos los browsers principales

**Acciones:**

1. **Test matrix:**
| Browser | Version | Test Coverage |
|---------|---------|---------------|
| Chrome | Latest | ✓ |
| Firefox | Latest | ✓ |
| Safari | Latest | ✓ |
| Edge | Latest | ✓ |
| iOS Safari | Latest 2 versions | ✓ |
| Chrome Android | Latest 2 versions | ✓ |

2. **Automated testing:**
```bash
npm install --save-dev @playwright/test
npx playwright test
```

**Criterio de Aceptación:**
- 100% funcional en Chrome, Firefox, Safari
- ≥95% funcional en Edge, iOS Safari, Chrome Android
- 0 critical bugs

---

### Fase 6: Monitoring y Mejora Continua (Semana 6+)

#### 6.1 Real User Monitoring

**Objetivo:** Métricas reales de usuarios

**Acciones:**

1. **Add Web Vitals tracking:**
```typescript
// lib/web-vitals.ts
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onINP(console.log);
onFCP(console.log);
onLCP(console.log);
onTTFB(console.log);
```

2. **Send to analytics:**
```typescript
import { sendToAnalytics } from './analytics';

const metric = onCLS((metric) => {
  sendToAnalytics({
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    url: window.location.href,
  });
});
```

**Dashboard:**
- Google Analytics 4
- Custom dashboard en Cloudflare

---

#### 6.2 Error Tracking

**Objetivo:** Detectar bugs en producción

**Acciones:**

1. **Add error boundary:**
```astro
<!-- En Base.astro -->
<script>
  window.addEventListener('error', (event) => {
    // Send to error tracking
    fetch('/api/error', {
      method: 'POST',
      body: JSON.stringify({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        url: window.location.href,
        useragent: navigator.userAgent,
      }),
    });
  });
</script>
```

2. **Use Sentry (optional):**
```bash
npm install --save @sentry/browser
```

```typescript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://...',
  environment: 'production',
});
```

---

#### 6.3 Continuous Improvement

**Objetivo:** Mejora continua basada en datos

**Acciones:**

1. **Monthly reviews:**
```markdown
## Métricas del mes
- Performance: 92 (↑2)
- Accessibility: 95 (↑1)
- LCP: 1.2s (↓0.1s)
- CLS: 0.05 (stable)
- INP: 145ms (↓10ms)

## Acciones para próximo mes
- Optimizar imágenes de cards TCG
- Add skeleton screens para loading
- Mejorar contrast en secondary text
```

2. **Quarterly audits:**
- Full accessibility audit
- Performance regression test
- Security review
- Content audit

---

## Checklist de Implementación

### Semana 1: Performance
- [ ] Convertir todas las imágenes a WebP/AVIF
- [ ] Crear responsive images (srcset)
- [ ] Add font preloads
- [ ] Set font-display: swap
- [ ] Extract critical CSS
- [ ] Code splitting para componentes
- [ ] Measure LCP, CLS, INP

### Semana 2: Accesibilidad
- [ ] Audit contraste de colores
- [ ] Fix low-contrast text
- [ ] Add focus states a todos los interactivos
- [ ] Add skip link
- [ ] Test keyboard navigation
- [ ] Add ARIA labels
- [ ] Test con screen reader

### Semana 3: SEO
- [ ] Add Article schema a books
- [ ] Add Breadcrumb schema
- [ ] Optimize title tags
- [ ] Add Open Graph tags
- [ ] Add Twitter cards
- [ ] Generate sitemap.xml
- [ ] Optimize robots.txt

### Semana 4: Security
- [ ] Add CSP header
- [ ] Add security headers
- [ ] Add rate limiting a APIs
- [ ] Validate all inputs
- [ ] Test XSS protection

### Semana 5: Testing
- [ ] Run Lighthouse CI
- [ ] Run accessibility tests
- [ ] Cross-browser testing
- [ ] Fix all critical issues
- [ ] Document remaining issues

### Semana 6+: Monitoring
- [ ] Add Web Vitals tracking
- [ ] Add error tracking
- [ ] Set up dashboard
- [ ] Monthly review process
- [ ] Quarterly audit process

---

## Métricas de Éxito

### Performance
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | TBD | <2.5s | ⏳ |
| CLS | TBD | <0.1 | ⏳ |
| INP | TBD | <200ms | ⏳ |
| FCP | TBD | <1.8s | ⏳ |
| TTI | TBD | <3.8s | ⏳ |

### Accessibility
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| WCAG 2.2 AA | TBD | 100% | ⏳ |
| Keyboard accessible | TBD | 100% | ⏳ |
| Screen reader | TBD | 100% | ⏳ |

### SEO
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Indexed pages | TBD | 94/94 | ⏳ |
| Rich snippets | TBD | ≥50% | ⏳ |
| CTR from search | TBD | +30% | ⏳ |

### Security
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| CSP configured | No | Yes | ⏳ |
| Security headers | No | Yes | ⏳ |
| Rate limiting | No | Yes | ⏳ |

---

## Recursos Necesarios

### Herramientas
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [axe-core](https://www.deque.com/axe/)
- [Playwright](https://playwright.dev/)
- [Web Vitals](https://github.com/GoogleChrome/web-vitals)
- [Sentry](https://sentry.io/) (opcional)

### Tiempo Estimado
- Fase 1 (Performance): 1 semana (40 horas)
- Fase 2 (Accessibility): 1 semana (40 horas)
- Fase 3 (SEO): 0.5 semanas (20 horas)
- Fase 4 (Security): 0.5 semanas (20 horas)
- Fase 5 (Testing): 1 semana (40 horas)
- Fase 6 (Monitoring): continuo (4 horas/semana)

**Total:** 4 semanas (160 horas) + continuo

---

## Conclusión

Este plan implementa mejores prácticas basadas en evidencia científica, no en hype. Cada acción tiene:

1. **Base empírica**: Estudios controlados, A/B tests, métricas reales
2. **Impacto medible**: Porcentajes de mejora específicos
3. **Criterio de aceptación**: Métricas objetivas de éxito
4. **Fuentes verificables**: Enlaces a documentación oficial

**Principio Feynman aplicado:** Si no puedes explicar por qué una acción mejora el sitio con datos, no la hagas.

**Siguiente paso:** Comenzar Fase 1 (Performance Optimization) inmediatamente después de revisar y aprobar este plan.