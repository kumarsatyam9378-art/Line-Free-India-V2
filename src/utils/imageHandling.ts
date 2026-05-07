/**
 * Image Handling Utilities
 * 
 * Utilities for handling business images with priority fallback system
 * and category-specific gradient backgrounds.
 */

import { BusinessProfile, BusinessCategory, getCategoryInfo } from '../store/AppContext';
import { DESIGN_TOKENS } from '../config/designTokens';

// ============================================================================
// CATEGORY GRADIENT DEFINITIONS
// ============================================================================

export const CATEGORY_GRADIENTS: Record<BusinessCategory, string> = {
  mens_salon: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  ladies_parlour: 'linear-gradient(135deg, #F857A6 0%, #FF5858 100%)',
  unisex_salon: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
  spa_center: 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)',
  nail_studio: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
  mehndi_artist: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
  tattoo_studio: 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)',
  massage_therapy: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
  acupuncture_clinic: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)',
  makeup_artist: 'linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)',
  bridal_studio: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
  threading_waxing: 'linear-gradient(135deg, #FFE985 0%, #FA742B 100%)',
  skincare_clinic: 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)',
  hair_transplant: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  laser_studio: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)',
  ayurveda_beauty: 'linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)',
  slimming_studio: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  home_salon: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
};

// ============================================================================
// IMAGE PRIORITY SYSTEM
// ============================================================================

export interface BusinessImageResult {
  type: 'url' | 'gradient';
  value: string;
  icon?: string;
}

/**
 * Get business image with priority fallback system
 * Priority: bannerImageURL → photoURL → category gradient
 */
export const getBusinessImage = (business: BusinessProfile): BusinessImageResult => {
  // Priority 1: Banner Image
  if (business.bannerImageURL && business.bannerImageURL.trim() !== '') {
    return {
      type: 'url',
      value: business.bannerImageURL,
    };
  }

  // Priority 2: Photo URL
  if (business.photoURL && business.photoURL.trim() !== '') {
    return {
      type: 'url',
      value: business.photoURL,
    };
  }

  // Priority 3: Category Fallback
  return getCategoryFallbackImage(business.businessType);
};

/**
 * Get category-specific fallback image (gradient + icon)
 */
export const getCategoryFallbackImage = (category: BusinessCategory): BusinessImageResult => {
  const categoryInfo = getCategoryInfo(category);
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.mens_salon;

  return {
    type: 'gradient',
    value: gradient,
    icon: categoryInfo.icon,
  };
};

// ============================================================================
// IMAGE URL VALIDATION
// ============================================================================

/**
 * Check if a URL is a valid image URL
 */
export const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get image URL or fallback
 */
export const getImageUrlOrFallback = (
  primaryUrl: string | undefined,
  fallbackUrl: string | undefined,
  category: BusinessCategory
): BusinessImageResult => {
  if (isValidImageUrl(primaryUrl)) {
    return { type: 'url', value: primaryUrl! };
  }
  
  if (isValidImageUrl(fallbackUrl)) {
    return { type: 'url', value: fallbackUrl! };
  }
  
  return getCategoryFallbackImage(category);
};

// ============================================================================
// IMAGE LOADING STATES
// ============================================================================

export enum ImageLoadState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

export interface ImageState {
  state: ImageLoadState;
  src: string;
  fallbackSrc?: string;
}

/**
 * Create initial image state
 */
export const createImageState = (src: string, fallbackSrc?: string): ImageState => ({
  state: ImageLoadState.LOADING,
  src,
  fallbackSrc,
});

// ============================================================================
// IMAGE OPTIMIZATION
// ============================================================================

export interface ImageOptimizationConfig {
  lazy: boolean;
  aspectRatio: string;
  placeholder: 'blur' | 'gradient';
  errorFallback: 'category' | 'default';
}

export const DEFAULT_IMAGE_CONFIG: ImageOptimizationConfig = {
  lazy: true,
  aspectRatio: '16/9',
  placeholder: 'gradient',
  errorFallback: 'category',
};

/**
 * Get optimized image props
 */
export const getOptimizedImageProps = (
  imageResult: BusinessImageResult,
  config: ImageOptimizationConfig = DEFAULT_IMAGE_CONFIG
) => {
  if (imageResult.type === 'url') {
    return {
      src: imageResult.value,
      loading: config.lazy ? ('lazy' as const) : ('eager' as const),
      style: {
        aspectRatio: config.aspectRatio,
        objectFit: 'cover' as const,
      },
    };
  }

  // Gradient fallback
  return {
    style: {
      background: imageResult.value,
      aspectRatio: config.aspectRatio,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: imageResult.icon,
  };
};

// ============================================================================
// PLACEHOLDER GENERATION
// ============================================================================

/**
 * Generate blur placeholder for image
 */
export const generateBlurPlaceholder = (category: BusinessCategory): string => {
  const gradient = CATEGORY_GRADIENTS[category];
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(102,126,234);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgb(118,75,162);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)' /%3E%3C/svg%3E`;
};

/**
 * Generate gradient placeholder
 */
export const generateGradientPlaceholder = (category: BusinessCategory): React.CSSProperties => {
  const gradient = CATEGORY_GRADIENTS[category];
  return {
    background: gradient,
    width: '100%',
    height: '100%',
  };
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle image load error
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc: string | undefined,
  category: BusinessCategory
) => {
  const img = event.currentTarget;
  
  // Try fallback URL first
  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc;
    return;
  }
  
  // If fallback also fails, hide image and show gradient
  img.style.display = 'none';
  
  // Log error for monitoring
  console.warn('Image failed to load:', img.src);
};

// ============================================================================
// LAZY LOADING UTILITIES
// ============================================================================

/**
 * Create Intersection Observer for lazy loading
 */
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
};

/**
 * Check if Intersection Observer is supported
 */
export const supportsIntersectionObserver = (): boolean => {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
};
