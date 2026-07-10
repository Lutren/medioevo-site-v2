// Performance optimization for INP (Interaction to Next Paint)
// Add to Base.astro or as a module

// 1. Defer non-critical JS
function deferNonCriticalJS() {
  const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
  scripts.forEach(script => {
    if (!script.src.includes('/_astro/') && !script.src.includes('web-vitals')) {
      script.defer = true;
    }
  });
}

// 2. Idle callback for non-critical work
function scheduleIdleWork(callback, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}

// 3. Lazy load non-critical components
function lazyLoadComponents() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const component = entry.target;
        const src = component.dataset.src;
        if (src) {
          import(src).catch(console.error);
          observer.unobserve(component);
        }
      }
    });
  }, { rootMargin: '100px' });

  document.querySelectorAll('[data-lazy-component]').forEach(el => {
    observer.observe(el);
  });
}

// 4. Optimize font loading
function optimizeFonts() {
  // Preload critical fonts
  const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
  fontLinks.forEach(link => {
    link.onload = () => {
      link.rel = 'stylesheet';
    };
  });
}

// 5. Reduce main thread work - debounce scroll/resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 6. Virtualize long lists (for cards grid)
function virtualizeList(container, itemHeight, renderItem) {
  const items = container.querySelectorAll('[data-virtual-item]');
  const viewportHeight = window.innerHeight;
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + 2;
  
  let startIndex = 0;
  let endIndex = Math.min(visibleCount, items.length);
  
  function updateVisibility() {
    const scrollTop = container.scrollTop || window.scrollY;
    startIndex = Math.floor(scrollTop / itemHeight);
    endIndex = Math.min(startIndex + visibleCount, items.length);
    
    items.forEach((item, index) => {
      item.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
    });
  }
  
  container.addEventListener('scroll', debounce(updateVisibility, 16));
  window.addEventListener('scroll', debounce(updateVisibility, 16));
  updateVisibility();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  deferNonCriticalJS();
  lazyLoadComponents();
  optimizeFonts();
  
  // Initialize virtualization for cards grids
  const cardsGrids = document.querySelectorAll('.grid[data-virtualize]');
  cardsGrids.forEach(grid => virtualizeList(grid, 300, null));
});