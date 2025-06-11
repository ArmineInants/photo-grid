import type { Metric } from 'web-vitals';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

interface PerformanceLayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export const measurePerformance = (metric: string, value: number) => {
  if (window.performance && window.performance.mark) {
    window.performance.mark(`${metric}-start`);
    window.performance.mark(`${metric}-end`);
    window.performance.measure(metric, `${metric}-start`, `${metric}-end`);
  }
};

export const trackImageLoad = (photoId: number, startTime: number) => {
  const loadTime = performance.now() - startTime;
  measurePerformance(`image-load-${photoId}`, loadTime);
  
  // Report to analytics if needed
  if (loadTime > 1000) { // Log slow loading images
    console.warn(`Slow image load detected for photo ${photoId}: ${loadTime}ms`);
  }
};

export const trackApiPerformance = (endpoint: string, startTime: number) => {
  const responseTime = performance.now() - startTime;
  measurePerformance(`api-${endpoint}`, responseTime);
  
  // Report to analytics if needed
  if (responseTime > 2000) { // Log slow API responses
    console.warn(`Slow API response detected for ${endpoint}: ${responseTime}ms`);
  }
};

// Core Web Vitals monitoring
export const initCoreWebVitals = () => {
  const reportWebVitals = (metric: Metric) => {
    // Only log if the metric is significant
    if (metric.value > 100) {
      console.log(`Web Vital: ${metric.name}`, metric);
    }
  };

  onCLS(reportWebVitals); // Cumulative Layout Shift
  onFCP(reportWebVitals); // First Contentful Paint
  onLCP(reportWebVitals); // Largest Contentful Paint
  onTTFB(reportWebVitals); // Time to First Byte
};

// Performance Observer for long tasks
export const initPerformanceObserver = () => {
  if ('PerformanceObserver' in window) {
    // Long tasks observer
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          const taskInfo = {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          };
          console.warn('Long task detected:', taskInfo);
        }
      }
    });

    // Layout shifts observer
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceLayoutShift;
        if (!layoutShift.hadRecentInput && layoutShift.value > 0.1) {
          console.warn('Layout shift detected:', layoutShift);
        }
      }
    });

    // Resource timing observer
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) { // Resources taking more than 1s
          console.warn('Slow resource load:', entry);
        }
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported:', e);
    }
  }
};

// Initialize all performance monitoring
export const initPerformanceMonitoring = () => {
  // Delay initialization to avoid impacting initial load
  setTimeout(() => {
    initCoreWebVitals();
    initPerformanceObserver();
  }, 0);
}; 