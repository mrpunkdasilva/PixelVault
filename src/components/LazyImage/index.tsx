import { useState, useCallback, useEffect } from 'react';
import { useLazyLoading } from '../../hooks/useLazyLoading';
import { useImageLoadMetrics } from '../../hooks/useImageLoadMetrics';
import './styles.scss';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError,
  style,
}: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { ref, isInView } = useLazyLoading({
    rootMargin: '100px', // Start loading 100px before element enters viewport
    threshold: 0.1,
    triggerOnce: true,
  });

  const { startImageLoad, endImageLoad } = useImageLoadMetrics();

  // Start tracking when image enters viewport
  useEffect(() => {
    if (isInView && !imageLoaded && !imageError) {
      startImageLoad(src);
    }
  }, [isInView, src, imageLoaded, imageError, startImageLoad]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    endImageLoad(src, true);
    onLoad?.();
  }, [onLoad, src, endImageLoad]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    endImageLoad(src, false);
    onError?.();
  }, [onError, src, endImageLoad]);

  return (
    <div ref={ref} className={`lazy-image-container ${className}`} style={style}>
      {/* Placeholder/Skeleton */}
      {!imageLoaded && !imageError && (
        <div className='lazy-image-placeholder'>
          {placeholder ? (
            <img src={placeholder} alt='' className='placeholder-image' aria-hidden='true' />
          ) : (
            <div className='skeleton-placeholder'>
              <div className='skeleton-shimmer'></div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div className='lazy-image-error'>
          <svg width='32' height='32' viewBox='0 0 24 24' fill='none'>
            <path
              d='M21 5V4C21 2.9 20.1 2 19 2H5C3.9 2 3 2.9 3 4V5H21ZM19 7H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7ZM9 8H11V18H9V8ZM13 8H15V18H13V8Z'
              fill='currentColor'
              opacity='0.5'
            />
          </svg>
          <span>Failed to load image</span>
        </div>
      )}

      {/* Actual Image - Only load when in view */}
      {isInView && !imageError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`lazy-image ${imageLoaded ? 'loaded' : 'loading'}`}
          loading='lazy' // Native lazy loading as fallback
        />
      )}
    </div>
  );
};
