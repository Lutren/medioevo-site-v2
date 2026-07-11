// Web Vitals monitoring for medioevo.space
// Add this to Base.astro <head> or as a module import

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: Math.round(metric.value),
    delta: Math.round(metric.delta),
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    connection: navigator.connection?.effectiveType || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
  });

  // Use sendBeacon for reliability (works on page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }
}

// Core Web Vitals
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);

// Custom metrics
function measureCustomMetrics() {
  // Time to First Byte (already captured by TTFB)
  
  // DOM Content Loaded
  if (performance.timing.domContentLoadedEventEnd > 0) {
    const dcl = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    sendToAnalytics({
      name: 'DCL',
      value: dcl,
      delta: dcl,
      id: 'dcl-' + Date.now(),
    });
  }

  // Load Complete
  if (performance.timing.loadEventEnd > 0) {
    const load = performance.timing.loadEventEnd - performance.timing.navigationStart;
    sendToAnalytics({
      name: 'LOAD',
      value: load,
      delta: load,
      id: 'load-' + Date.now(),
    });
  }

  // Resource timing - slow resources
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(r => r.duration > 1000);
  slowResources.forEach(r => {
    sendToAnalytics({
      name: 'SLOW_RESOURCE',
      value: Math.round(r.duration),
      delta: Math.round(r.duration),
      id: 'slow-' + r.name.hashCode(),
      page: window.location.pathname,
      resource: r.name,
      resourceType: r.initiatorType,
    });
  });
}

// Run after load
if (document.readyState === 'complete') {
  measureCustomMetrics();
} else {
  window.addEventListener('load', measureCustomMetrics);
}

// Helper for string hash
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};