/**
 * Category-wise default images for businesses
 * Using high-quality placeholder images from Unsplash
 */

export const CATEGORY_IMAGES: Record<string, string> = {
  // Beauty & Wellness
  'ladies-beauty': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', // Beauty salon
  'beauty-parlour': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', // Beauty parlour
  'unisex-salon': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80', // Unisex salon
  'mens-salon': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', // Men's salon
  'spa-wellness': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', // Spa
  'massage-therapy': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', // Massage
  
  // Healthcare
  'clinic': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', // Clinic
  'dental-clinic': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80', // Dental
  'physiotherapy': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', // Physio
  'ayurveda': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', // Ayurveda
  'acupuncture': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80', // Acupuncture
  
  // Fitness
  'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', // Gym
  'yoga-studio': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', // Yoga
  'fitness-center': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', // Fitness
  
  // Food & Beverage
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Restaurant
  'cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // Cafe
  'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', // Bakery
  
  // Professional Services
  'nail-studio': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80', // Nail studio
  'tattoo-studio': 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&q=80', // Tattoo
  'mehndi-artist': 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80', // Mehndi
  
  // Default fallback
  'default': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80', // Generic business
};

/**
 * Get default image for a business category
 */
export function getCategoryImage(businessType: string): string {
  return CATEGORY_IMAGES[businessType] || CATEGORY_IMAGES['default'];
}

/**
 * Get business image with fallback to category default
 */
export function getBusinessImageWithFallback(
  photoURL?: string,
  bannerImageURL?: string,
  businessType?: string
): string {
  if (bannerImageURL) return bannerImageURL;
  if (photoURL) return photoURL;
  if (businessType) return getCategoryImage(businessType);
  return CATEGORY_IMAGES['default'];
}
