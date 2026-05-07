/* eslint-disable */
// AUTO-GENERATED - Strictly Limited to Beauty & Wellness OS - 18 Approved Categories Only
import type { BusinessCategory } from '../store/AppContext';

export interface BusinessRegistryGroup {
  id: string;
  label: string;
  labelHi: string;
  icon: string;
}

export const BUSINESS_REGISTRY_GROUPS: BusinessRegistryGroup[] = [
  {
    id: "beauty",
    label: "Beauty & Wellness",
    labelHi: "ब्यूटी और वेलनेस",
    icon: "✨"
  }
];

export interface BusinessNicheRow {
  id: string;
  groupId: string;
  label: string;
  labelHi: string;
  icon: string;
  template: BusinessCategory;
}

export const ALL_BUSINESS_NICHE_ROWS: BusinessNicheRow[] = [
  { "groupId": "beauty", "id": "mens_salon", "label": "Men's Salon / Barber Shop", "labelHi": "पुरुष सैलून / नाई की दुकान", "icon": "💈", "template": "mens_salon" },
  { "groupId": "beauty", "id": "ladies_parlour", "label": "Ladies Beauty Parlour", "labelHi": "लेडीज़ ब्यूटी पार्लर", "icon": "👠", "template": "ladies_parlour" },
  { "groupId": "beauty", "id": "unisex_salon", "label": "Unisex Salon", "labelHi": "यूनिसेक्स सैलून", "icon": "✂️", "template": "unisex_salon" },
  { "groupId": "beauty", "id": "spa_center", "label": "Spa & Wellness Center", "labelHi": "स्पा और वेलनेस सेंटर", "icon": "🧖", "template": "spa_center" },
  { "groupId": "beauty", "id": "nail_studio", "label": "Nail Studio", "labelHi": "नेल स्टूडियो", "icon": "💅", "template": "nail_studio" },
  { "groupId": "beauty", "id": "mehndi_artist", "label": "Mehndi Artist", "labelHi": "मेहंदी कलाकार", "icon": "🎨", "template": "mehndi_artist" },
  { "groupId": "beauty", "id": "tattoo_studio", "label": "Tattoo Studio", "labelHi": "टैटू स्टूडियो", "icon": "🖊️", "template": "tattoo_studio" },
  { "groupId": "beauty", "id": "massage_therapy", "label": "Massage Therapy Center", "labelHi": "मसाज थेरेपी सेंटर", "icon": "💆", "template": "massage_therapy" },
  { "groupId": "beauty", "id": "acupuncture_clinic", "label": "Acupuncture Clinic", "labelHi": "एक्यूपंक्चर क्लिनिक", "icon": "🩹", "template": "acupuncture_clinic" },
  { "groupId": "beauty", "id": "makeup_artist", "label": "Makeup Artist", "labelHi": "मेकअप आर्टिस्ट", "icon": "💄", "template": "makeup_artist" },
  { "groupId": "beauty", "id": "bridal_studio", "label": "Bridal Studio", "labelHi": "ब्राइडल स्टूडियो", "icon": "👰", "template": "bridal_studio" },
  { "groupId": "beauty", "id": "threading_waxing", "label": "Threading / Waxing Center", "labelHi": "थ्रेडिंग / वैक्सिंग सेंटर", "icon": "✨", "template": "threading_waxing" },
  { "groupId": "beauty", "id": "skincare_clinic", "label": "Skin Care Clinic", "labelHi": "स्किन केयर क्लिनिक", "icon": "🧴", "template": "skincare_clinic" },
  { "groupId": "beauty", "id": "hair_transplant", "label": "Hair Transplant Clinic", "labelHi": "हेयर ट्रांसप्लांट क्लिनिक", "icon": "💇", "template": "hair_transplant" },
  { "groupId": "beauty", "id": "laser_studio", "label": "Laser Studio", "labelHi": "लेजर स्टूडियो", "icon": "⚡", "template": "laser_studio" },
  { "groupId": "beauty", "id": "ayurveda_beauty", "label": "Ayurveda Beauty Center", "labelHi": "आयुर्वेद ब्यूटी सेंटर", "icon": "🌿", "template": "ayurveda_beauty" },
  { "groupId": "beauty", "id": "slimming_studio", "label": "Slimming / Weight Loss Studio", "labelHi": "स्लिमिंग / वेट लॉस स्टूडियो", "icon": "⚖️", "template": "slimming_studio" },
  { "groupId": "beauty", "id": "home_salon", "label": "Home Salon Service", "labelHi": "होम सैलून सर्विस", "icon": "🏠", "template": "home_salon" }
];
