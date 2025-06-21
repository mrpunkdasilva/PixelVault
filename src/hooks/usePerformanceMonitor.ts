import { useEffect, useRef } from 'react';

// Interface for performance metrics (for future use)
// interface PerformanceMetrics {
//   loadTime: number;
//   renderTime: number;
//   memoryUsage?: number;
// }

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(Date.now());

  useEffect(() => {
    // Component mounted
    const loadTime = Date.now() - startTime.current;

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} Performance:`, {
        loadTime: `${loadTime}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    // Performance API measurements
    if ('performance' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.name.includes(componentName.toLowerCase())) {
            console.log(`📊 ${componentName} Performance Entry:`, entry);
          }
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });

      return () => observer.disconnect();
    }
  }, [componentName]);

  const measureRender = (renderPhase: string) => {
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - renderStartTime.current;
      console.log(`⏱️ ${componentName} ${renderPhase}:`, `${renderTime}ms`);
    }
  };

  const measureMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100,
        total: Math.round((memory.totalJSHeapSize / 1048576) * 100) / 100,
        limit: Math.round((memory.jsHeapSizeLimit / 1048576) * 100) / 100,
      };
    }
    return null;
  };

  return {
    measureRender,
    measureMemory,
  };
};
