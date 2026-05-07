import { BusinessCategory } from '../store/AppContext';

export interface CategoryTheme {
  /** Primary gradient from-to colors for headers */
  gradient: string;
  /** Background radial gradient */
  bgGradient: string;
  /** Primary accent color class (e.g. 'blue-400') */
  accent: string;
  /** Hex code for dynamic styles (e.g. '#3B82F6') */
  accentColor: string;
  /** Lighter accent for borders/badges */
  accentLight: string;
  /** Button/CTA color */
  btnBg: string;
  btnText: string;
  /** Status card gradient */
  statusOpen: string;
  /** Unique greeting for this business type */
  greeting: string;
  /** What is the owner called */
  ownerTitle: string;
  /** Dashboard title */
  dashTitle: string;
  /** Queue or booking terminology */
  queueLabel: string;
  /** Action button label */
  actionLabel: string;
  /** Design archetype for layout variations */
  archetype: 'beauty';
}

const BLUE_NEON: Omit<CategoryTheme, 'greeting' | 'ownerTitle' | 'dashTitle' | 'queueLabel' | 'actionLabel'> = {
  gradient: 'from-blue-600 to-indigo-700',
  bgGradient: 'from-blue-900/40 via-background to-background',
  accent: 'text-blue-400',
  accentColor: '#60A5FA',
  accentLight: 'border-blue-500/30 bg-blue-500/10',
  btnBg: 'bg-blue-600',
  btnText: 'text-white',
  statusOpen: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30',
  archetype: 'beauty',
};

const PINK_LUXURY: Omit<CategoryTheme, 'greeting' | 'ownerTitle' | 'dashTitle' | 'queueLabel' | 'actionLabel'> = {
  gradient: 'from-pink-500 to-fuchsia-600',
  bgGradient: 'from-pink-900/40 via-background to-background',
  accent: 'text-pink-400',
  accentColor: '#F472B6',
  accentLight: 'border-pink-500/30 bg-pink-500/10',
  btnBg: 'bg-pink-600',
  btnText: 'text-white',
  statusOpen: 'from-pink-500/20 to-fuchsia-500/10 border-pink-500/30',
  archetype: 'beauty',
};

const PURPLE_AURORA: Omit<CategoryTheme, 'greeting' | 'ownerTitle' | 'dashTitle' | 'queueLabel' | 'actionLabel'> = {
  gradient: 'from-purple-500 to-violet-600',
  bgGradient: 'from-purple-900/40 via-background to-background',
  accent: 'text-purple-400',
  accentColor: '#C084FC',
  accentLight: 'border-purple-500/30 bg-purple-500/10',
  btnBg: 'bg-purple-600',
  btnText: 'text-white',
  statusOpen: 'from-purple-500/20 to-violet-500/10 border-purple-500/30',
  archetype: 'beauty',
};

export const CATEGORY_THEMES: Record<BusinessCategory, CategoryTheme> = {
  mens_salon: { ...BLUE_NEON, greeting: '💈 Welcome, Boss!', ownerTitle: 'Barber', dashTitle: 'Salon Command', queueLabel: 'Queue', actionLabel: 'Next Customer →' },
  unisex_salon: { ...BLUE_NEON, greeting: '✂️ Welcome, Stylist!', ownerTitle: 'Stylist', dashTitle: 'Style Hub', queueLabel: 'Queue', actionLabel: 'Next Client →' },
  hair_transplant: { ...BLUE_NEON, greeting: '👨‍⚕️ Welcome, Doc!', ownerTitle: 'Surgeon', dashTitle: 'Clinic Dashboard', queueLabel: 'Consults', actionLabel: 'Next Consult →' },
  laser_studio: { ...BLUE_NEON, greeting: '⚡ Laser Station Active!', ownerTitle: 'Specialist', dashTitle: 'Laser HQ', queueLabel: 'Sessions', actionLabel: 'Start Session →' },
  tattoo_studio: { ...BLUE_NEON, greeting: '🖊️ Inked & Ready!', ownerTitle: 'Artist', dashTitle: 'Ink Studio', queueLabel: 'Sessions', actionLabel: 'Start Ink →' },

  ladies_parlour: { ...PINK_LUXURY, greeting: '💅 Welcome, Gorgeous!', ownerTitle: 'Manager', dashTitle: 'Beauty Studio', queueLabel: 'Clients', actionLabel: 'Next Client →' },
  makeup_artist: { ...PINK_LUXURY, greeting: '🖌️ Artistry in Progress!', ownerTitle: 'Artist', dashTitle: 'Makeup HQ', queueLabel: 'Bookings', actionLabel: 'Next Glow →' },
  bridal_studio: { ...PINK_LUXURY, greeting: '💍 The Big Day Hub!', ownerTitle: 'Curator', dashTitle: 'Bridal Center', queueLabel: 'Brides', actionLabel: 'Consult Bride →' },
  threading_waxing: { ...PINK_LUXURY, greeting: '✨ Precision Studio!', ownerTitle: 'Expert', dashTitle: 'Skin Hub', queueLabel: 'Queue', actionLabel: 'Next One →' },
  mehndi_artist: { ...PINK_LUXURY, greeting: '🎨 Patterns & Art!', ownerTitle: 'Artist', dashTitle: 'Mehndi HQ', queueLabel: 'Appointments', actionLabel: 'Start Art →' },
  nail_studio: { ...PINK_LUXURY, greeting: '💅 Nail Perfection!', ownerTitle: 'Technician', dashTitle: 'Nail Bar', queueLabel: 'Queue', actionLabel: 'Next Nails →' },
  home_salon: { ...PINK_LUXURY, greeting: '🏠 Mobile Beauty Active!', ownerTitle: 'Expert', dashTitle: 'Home Service', queueLabel: 'Visits', actionLabel: 'Go to Client →' },

  spa_center: { ...PURPLE_AURORA, greeting: '🧖 Zen Mode On!', ownerTitle: 'Therapist', dashTitle: 'Wellness HQ', queueLabel: 'Sessions', actionLabel: 'Start Zen →' },
  massage_therapy: { ...PURPLE_AURORA, greeting: '💆 Healing Hands!', ownerTitle: 'Therapist', dashTitle: 'Massage Hub', queueLabel: 'Sessions', actionLabel: 'Next Client →' },
  acupuncture_clinic: { ...PURPLE_AURORA, greeting: '🩹 Balance Restored!', ownerTitle: 'Doctor', dashTitle: 'Healing Center', queueLabel: 'Sessions', actionLabel: 'Next Visit →' },
  skincare_clinic: { ...PURPLE_AURORA, greeting: '🧴 Radiant Skin HQ!', ownerTitle: 'Derm', dashTitle: 'Skin Care', queueLabel: 'Consults', actionLabel: 'Next Treatment →' },
  ayurveda_beauty: { ...PURPLE_AURORA, greeting: '🌿 Ancient Wisdom!', ownerTitle: 'Vaidiya', dashTitle: 'Ayurveda Hub', queueLabel: 'Consults', actionLabel: 'Next Veda →' },
  slimming_studio: { ...PURPLE_AURORA, greeting: '⚖️ Transformation Hub!', ownerTitle: 'Coach', dashTitle: 'Slimming HQ', queueLabel: 'Sessions', actionLabel: 'Next Goal →' },
};

export const getCategoryTheme = (cat: BusinessCategory): CategoryTheme =>
  CATEGORY_THEMES[cat] || CATEGORY_THEMES.mens_salon;
