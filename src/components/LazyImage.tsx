/**
 * LazyImage Component
 * 
 * Lazy-loaded image component with Intersection Observer,
 * progressive loading, and fallback support.
 */

import { useState, useEffect, useRef } from 'react';
import { BusinessCategory } from '../store/AppContext';
import { 
  BusinessImageResult, 
  generateGradientPlaceholder,
  createLazyLoadObserver,
  supportsIntersectionObserver,
  ImageLoadState
} from '../utils/imageHandling';

interface LazyImageProps {
  imageResult: BusinessImageResult;
  category: BusinessCategory;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  imageResult,
  category,
  alt,
  className = '',
  aspectRatio = '16/9',
  onLoad,
  onError,
}: LazyImageProps) {
  const [loadState, setLoadState] = useState<ImageLoadState>(ImageLoadState.LOADING);
  const [isVisible, setIsVisible] = useState(!supportsIntersectionObserver());
  const imgRef = useRef<HTMLDivElement>(null);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!supportsIntersectionObserver() || !imgRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = createLazyLoadObserver((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  // Handle image load
  const handleLoad = () => {
    setLoadState(ImageLoadState.LOADED);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setLoadState(ImageLoadState.ERROR);
    onError?.();
  };

  // Render gradient fallback
  if (imageResult.type === 'gradient') {
    return (
      <div
        ref={imgRef}
        className={`${className} flex items-center justify-center overflow-hidden`}
        style={{
          ...generateGradientPlaceholder(category),
          aspectRatio,
        }}
        role="img"
        aria-label={alt}
      >
        {imageResult.icon && (
          <span className="text-6xl opacity-70 drop-shadow-lg">
            {imageResult.icon}
          </span>
        )}
      </div>
    );
  }

  // Render image with lazy loading
  return (
    <div
      ref={imgRef}
      className={`${className} relative overflow-hidden bg-card-2`}
      style={{ aspectRatio }}
    >
      {/* Loading Placeholder */}
      {loadState === ImageLoadState.LOADING && (
        <div
          className="absolute inset-0 animate-pulse"
          style={generateGradientPlaceholder(category)}
        />
      )}

      {/* Actual Image */}
      {isVisible && (
        <img
          src={imageResult.value}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${loadState === ImageLoadState.LOADED ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Error Fallback */}
      {loadState === ImageLoadState.ERROR && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={generateGradientPlaceholder(category)}
        >
          <span className="text-6xl opacity-70 drop-shadow-lg">
            {imageResult.icon || '🏪'}
          </span>
        </div>
      )}
    </div>
  );
}
