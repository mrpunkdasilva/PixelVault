import { useRef, useCallback } from 'react';

interface ImageLoadMetrics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  loadTimes: number[];
}

export const useImageLoadMetrics = () => {
  const metrics = useRef<ImageLoadMetrics>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    loadTimes: [],
  });

  const imageLoadTimes = useRef<Map<string, number>>(new Map());

  const startImageLoad = useCallback((imageUrl: string) => {
    imageLoadTimes.current.set(imageUrl, Date.now());
    metrics.current.totalImages++;
  }, []);

  const endImageLoad = useCallback((imageUrl: string, success: boolean = true) => {
    const startTime = imageLoadTimes.current.get(imageUrl);
    if (startTime) {
      const loadTime = Date.now() - startTime;

      if (success) {
        metrics.current.loadedImages++;
        metrics.current.loadTimes.push(loadTime);

        // Calculate new average
        const sum = metrics.current.loadTimes.reduce((a, b) => a + b, 0);
        metrics.current.averageLoadTime = sum / metrics.current.loadTimes.length;
      } else {
        metrics.current.failedImages++;
      }

      imageLoadTimes.current.delete(imageUrl);

      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📸 Image Load Metrics:`, {
          url: imageUrl.substring(0, 50) + '...',
          loadTime: `${loadTime}ms`,
          success,
          totalLoaded: metrics.current.loadedImages,
          totalFailed: metrics.current.failedImages,
          averageTime: `${Math.round(metrics.current.averageLoadTime)}ms`,
        });
      }
    }
  }, []);

  const getMetrics = useCallback(() => ({ ...metrics.current }), []);

  const resetMetrics = useCallback(() => {
    metrics.current = {
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      loadTimes: [],
    };
    imageLoadTimes.current.clear();
  }, []);

  return {
    startImageLoad,
    endImageLoad,
    getMetrics,
    resetMetrics,
  };
};
