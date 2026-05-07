import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import {
  onAuthStateChanged, signInWithPopup, signOut as fbSignOut,
  deleteUser, reauthenticateWithPopup, setPersistence, browserLocalPersistence, User,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from 'firebase/auth';
import { getToken as getFCMToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import {
  doc, setDoc, getDoc, collection, query, where, getDocs,
  updateDoc, addDoc, onSnapshot, deleteDoc
} from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinary';

export type Lang = 'en' | 'hi';
export type Role = 'customer' | 'business';

// ── Business Categories (Beauty & Wellness OS — 18 Niches → 4 Templates + fallback) ──
export type BusinessCategory =
  | 'mens_salon'
  | 'ladies_parlour'
  | 'unisex_salon'
  | 'spa_center'
  | 'nail_studio'
  | 'mehndi_artist'
  | 'tattoo_studio'
  | 'massage_therapy'
  | 'acupuncture_clinic'
  | 'makeup_artist'
  | 'bridal_studio'
  | 'threading_waxing'
  | 'skin_care_clinic'
  | 'hair_transplant'
  | 'laser_studio'
  | 'ayurveda_beauty'
  | 'slimming_studio'
  | 'home_salon';

export interface Terminology {
  provider: string; // e.g. 'Barber', 'Doctor', 'Chef'
  action: string;   // e.g. 'Get Token', 'Book Table'
  noun: string;     // e.g. 'Queue', 'Appointment', 'Reservation'
  item: string;     // e.g. 'Service', 'Treatment', 'Dish'
  unit: string;     // e.g. 'min', 'days'
}

export interface BusinessCategoryInfo {
  id: BusinessCategory;
  icon: string;
  label: string;
  labelHi: string;
  terminology: Terminology;
  defaultServices: ServiceItem[];
  // Feature flags
  hasTimedSlots?: boolean;      // Uses time-slot appointments (clinics, spa) vs open queue
  hasMenu?: boolean;            // Has a digital menu (restaurant, cafe)
  hasEmergencySlot?: boolean;   // Supports emergency priority (clinic, hospital, pet)
  hasHomeService?: boolean;     // Offers home visit option (beauty, laundry, repair)
  hasVideoConsult?: boolean;    // Supports video consultation
  supportsGroupBooking?: boolean; // Multi-person bookings
  hasCapacityLimit?: boolean;     // Auto-pausing queues when capacity is hit
  defaultWorkingHours?: { open: string, close: string };
}

export const BUSINESS_CATEGORIES: BusinessCategoryInfo[] = [
  {
    id: 'mens_salon', icon: '💈', label: "Men's Salon / Barber Shop", labelHi: 'मेंस सैलून / बार्बर शॉप',
    terminology: { provider: 'Barber', action: 'Join Queue', noun: 'Queue', item: 'Service', unit: 'min' },
    hasHomeService: false, supportsGroupBooking: true, hasCapacityLimit: true, defaultWorkingHours: { open: '09:00', close: '21:00' },
    defaultServices: [
      { id: '1', name: 'Hair Cut', price: 150, avgTime: 30 },
      { id: '2', name: 'Beard Trim', price: 100, avgTime: 20 },
      { id: '3', name: 'Hair Cut + Beard', price: 220, avgTime: 45 },
    ],
  },
  {
    id: 'ladies_parlour', icon: '💅', label: 'Ladies Beauty Parlour', labelHi: 'लेडीज ब्यूटी पार्लर',
    terminology: { provider: 'Stylist', action: 'Join Queue', noun: 'Queue', item: 'Service', unit: 'min' },
    hasHomeService: true, supportsGroupBooking: true, hasCapacityLimit: true, defaultWorkingHours: { open: '10:00', close: '20:00' },
    defaultServices: [
      { id: '1', name: 'Eyebrow Threading', price: 50, avgTime: 10 },
      { id: '2', name: 'Facial', price: 800, avgTime: 60 },
      { id: '3', name: 'Waxing (Full Arms)', price: 300, avgTime: 30 },
    ],
  },
  {
    id: 'unisex_salon', icon: '✂️', label: 'Unisex Salon', labelHi: 'यूनिसेक्स सैलून',
    terminology: { provider: 'Stylist', action: 'Join Queue', noun: 'Queue', item: 'Service', unit: 'min' },
    supportsGroupBooking: true, hasCapacityLimit: true, defaultWorkingHours: { open: '09:00', close: '21:00' },
    defaultServices: [
      { id: '1', name: 'Hair Cut', price: 200, avgTime: 30 },
      { id: '2', name: 'Hair Spa', price: 1000, avgTime: 60 },
    ],
  },
  {
    id: 'spa_center', icon: '🧖', label: 'Spa & Wellness Center', labelHi: 'स्पा और वेलनेस सेंटर',
    terminology: { provider: 'Therapist', action: 'Book Session', noun: 'Session', item: 'Therapy', unit: 'min' },
    hasTimedSlots: true, supportsGroupBooking: true, hasCapacityLimit: true, defaultWorkingHours: { open: '10:00', close: '21:00' },
    defaultServices: [
      { id: '1', name: 'Full Body Massage', price: 1500, avgTime: 60 },
      { id: '2', name: 'Reflexology', price: 800, avgTime: 45 },
    ],
  },
  {
    id: 'nail_studio', icon: '💅', label: 'Nail Studio', labelHi: 'नेल स्टूडियो',
    terminology: { provider: 'Technician', action: 'Book Service', noun: 'Appointment', item: 'Nail Art', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Gel Polish', price: 500, avgTime: 45 }],
  },
  {
    id: 'mehndi_artist', icon: '🎨', label: 'Mehndi Artist', labelHi: 'मेहंदी आर्टिस्ट',
    terminology: { provider: 'Artist', action: 'Book Appointment', noun: 'Booking', item: 'Design', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Bridal Mehndi', price: 3000, avgTime: 180 }],
  },
  {
    id: 'tattoo_studio', icon: '🖊️', label: 'Tattoo Studio', labelHi: 'टैटू स्टूडियो',
    terminology: { provider: 'Artist', action: 'Book Session', noun: 'Session', item: 'Tattoo', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Small Tattoo', price: 2000, avgTime: 60 }],
  },
  {
    id: 'massage_therapy', icon: '💆', label: 'Massage Therapy Center', labelHi: 'मसाज थेरेपी सेंटर',
    terminology: { provider: 'Therapist', action: 'Book Session', noun: 'Session', item: 'Therapy', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Therapeutic Massage', price: 1200, avgTime: 60 }],
  },
  {
    id: 'acupuncture_clinic', icon: '🩹', label: 'Acupuncture Clinic', labelHi: 'एक्यूपंक्चर क्लिनिक',
    terminology: { provider: 'Doctor', action: 'Book Session', noun: 'Session', item: 'Treatment', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Acupuncture Session', price: 1000, avgTime: 45 }],
  },
  {
    id: 'makeup_artist', icon: '🖌️', label: 'Makeup Artist', labelHi: 'मेकअप आर्टिस्ट',
    terminology: { provider: 'Artist', action: 'Book Appointment', noun: 'Booking', item: 'Makeup', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Party Makeup', price: 2000, avgTime: 60 }],
  },
  {
    id: 'bridal_studio', icon: '💍', label: 'Bridal Studio', labelHi: 'ब्राइडल स्टूडियो',
    terminology: { provider: 'Consultant', action: 'Book Consultation', noun: 'Session', item: 'Package', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Bridal Consultation', price: 500, avgTime: 30 }],
  },
  {
    id: 'threading_waxing', icon: '🪡', label: 'Threading / Waxing Center', labelHi: 'थ्रेडिंग / वैक्सिंग सेंटर',
    terminology: { provider: 'Specialist', action: 'Join Queue', noun: 'Queue', item: 'Service', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Full Face Threading', price: 150, avgTime: 20 }],
  },
  {
    id: 'skincare_clinic', icon: '🧴', label: 'Skin Care Clinic', labelHi: 'स्किन केयर क्लिनिक',
    terminology: { provider: 'Dermatologist', action: 'Book Visit', noun: 'Visit', item: 'Treatment', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Skin Analysis', price: 500, avgTime: 30 }],
  },
  {
    id: 'hair_transplant', icon: '👨‍⚕️', label: 'Hair Transplant Clinic', labelHi: 'हेयर ट्रांसप्लांट क्लिनिक',
    terminology: { provider: 'Surgeon', action: 'Book Consult', noun: 'Consult', item: 'Treatment', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Initial Consult', price: 1000, avgTime: 45 }],
  },
  {
    id: 'laser_studio', icon: '⚡', label: 'Laser Studio', labelHi: 'लेजर स्टूडियो',
    terminology: { provider: 'Specialist', action: 'Book Session', noun: 'Session', item: 'Laser', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Laser Hair Removal', price: 1500, avgTime: 45 }],
  },
  {
    id: 'ayurveda_beauty', icon: '🌿', label: 'Ayurveda Beauty Center', labelHi: 'आयुर्वेद ब्यूटी सेंटर',
    terminology: { provider: 'Vaidiya', action: 'Book Consultation', noun: 'Consult', item: 'Therapy', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Abhyangam', price: 1200, avgTime: 60 }],
  },
  {
    id: 'slimming_studio', icon: '⚖️', label: 'Slimming / Weight Loss Studio', labelHi: 'स्लिमिंग / वेट लॉस स्टूडियो',
    terminology: { provider: 'Coach', action: 'Book Session', noun: 'Session', item: 'Program', unit: 'min' },
    defaultServices: [{ id: '1', name: 'Weight Analysis', price: 800, avgTime: 30 }],
  },
  {
    id: 'home_salon', icon: '🏠', label: 'Home Salon Service', labelHi: 'होम सैलून सर्विस',
    terminology: { provider: 'Expert', action: 'Book Visit', noun: 'Visit', item: 'Home Service', unit: 'min' },
    hasHomeService: true,
    defaultServices: [{ id: '1', name: 'Home Hair Cut', price: 300, avgTime: 45 }],
  },
];

export const getCategoryInfo = (cat: BusinessCategory): BusinessCategoryInfo =>
  BUSINESS_CATEGORIES.find(c => c.id === cat) || BUSINESS_CATEGORIES[BUSINESS_CATEGORIES.length - 1];

export interface ServiceItem { id: string; name: string; price: number; avgTime: number; priceType?: 'fixed' | 'variable'; }

export interface ReviewEntry {
  id?: string; salonId: string; customerId: string; customerName: string;
  customerPhoto: string; rating: number; comment: string; createdAt: any; images?: string[];
  staffId?: string; staffName?: string;
}

export interface NotificationEntry {
  id?: string; userId: string; title: string; body: string;
  type: 'token_ready' | 'token_called' | 'salon_open' | 'review' | 'general';
  data?: any; read: boolean; createdAt: number;
}

export interface Story {
  url: string;
  expiresAt: number;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string; // ml, kg, pieces
  price?: number;
  alertThreshold: number;
  lastRestocked: string;
  stockLevel?: number; // Alias for quantity
  averageCost?: number; // Alias for price
  reorderLevel?: number; // Alias for alertThreshold
}

export interface DynamicPricingRule {
  id: string;
  ruleName: string;
  isActive: boolean;
  type: 'surge' | 'discount';
  percentage: number;
  condition: string; // 'weekend', 'festival', 'custom'
  appliesTo: 'all' | 'specific_services';
  specificServices?: string[];
}

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  partySize: number;
  addedAt: number;
  estimatedWaitMins: number;
  status: 'waiting' | 'seated' | 'cancelled';
  notes: string;
}

export interface SpaRoom {
  id: string;
  roomName: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance';
  currentClient?: string;
  assignedTherapist?: string;
  occupiedUntil?: number; // timestamp
  notes: string;
}

export interface ConsentFormRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  dateSigned: string;
  medicalNotes: string;
  hasAllergies: boolean;
  signatureImage?: string;
  status: 'signed' | 'pending';
}

export interface TailorOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  measurementProfileId?: string;
  garmentType: string;
  receivedDate: string;
  dueDate: string;
  fabricDetails: string;
  totalAmount: number;
  advancePaid: number;
  status: 'pending' | 'cutting' | 'stitching' | 'trial_ready' | 'completed' | 'delivered';
  notes: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  type: 'part' | 'labor';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface RepairEstimate {
  id: string;
  clientName: string;
  clientPhone: string;
  vehicleInfo: string;
  dateCreated: string;
  items: EstimateItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
  notes: string;
  issueImages?: string[];
}

export interface RetailSaleItem {
  inventoryId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface RetailSale {
  id: string;
  dateStr: string;
  clientName?: string;
  clientPhone?: string;
  items: RetailSaleItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface BusinessProfile {
  uid: string; name: string; businessName: string; businessType: BusinessCategory;
  location: string; phone: string;
  photoURL: string; bannerImageURL: string; services: ServiceItem[];
  isOpen: boolean; isBreak: boolean; isStopped: boolean;
  breakEndTime?: number | null;
  currentToken: number; totalTokensToday: number; breakStartTime: number | null;
  createdAt: any; rating?: number; totalReviews?: number; totalEarnings?: number;
  subscription?: string | null; subscriptionExpiry?: number | null;
  upiId?: string; businessHours?: string; bio?: string; instagram?: string;
  website?: string;
  about?: string; // Detailed about section for business
  galleryImages?: string[]; // Gallery images for business showcase
  referralCode?: string; totalCustomersAllTime?: number; lat?: number; lng?: number;
  fcmToken?: string; queueDelayMinutes?: number;
  staffMembers?: StaffMember[];
  staff?: StaffMember[]; // Alias for staffMembers
  appointments?: any[]; // Appointment records
  taxSettings?: TaxSettings[];
  blockedDates?: string[];
  products?: { id: string; name: string; price: number; stock?: number }[];
  promoCodes?: { code: string; type: 'percentage' | 'flat'; value: number; active: boolean }[];
  maxCapacity?: number; // Auto-pause limit for queues
  franchiseId?: string;
  stories?: Story[];
  menuItems?: MenuItem[];
  tableLayout?: TableItem[];
  memberships?: PricingPlan[]; // For gyms
  gymMembers?: UserMembership[]; // For gyms (Phase 49)
  coachingBatches?: CoachingBatch[]; // For tutors/coaching
  mockTests?: MockTest[]; // For coaching/tutors (Phase 50)
  doctors?: DoctorProfile[]; // For hospitals (Phase 51)
  patientRecords?: PatientRecord[]; // For hospitals (Phase 52)
  kundaliCharts?: KundaliChart[]; // For astrologers (Phase 53)
  savedMuhurats?: Muhurat[]; // For astrologers (Phase 54)
  homeTuitionStudents?: HomeTuitionStudent[]; // For tutors (Phase 55)
  assignments?: Assignment[]; // For tutors (Phase 56)
  carWashBats?: CarWashBay[]; // For Car Wash (Phase 57)
  washPasses?: WashPass[]; // For Car Wash (Phase 58)
  bridalPackages?: BridalPackage[]; // For Mehendi (Phase 59)
  feedbackRequests?: FeedbackRequest[]; // For Core (Phase 60)
  tailorMeasurements?: MeasurementProfile[]; // For Tailors (Phase 61)
  tailorFabrics?: FabricStock[]; // For Tailors (Phase 62)
  mechanicSpareParts?: SparePartItem[]; // For Mechanics (Phase 63)
  mechanicServiceHistory?: VehicleServiceRecord[]; // For Mechanics (Phase 64)
  lawyerCaseFiles?: CaseFileItem[]; // For Lawyers (Phase 65)
  lawyerHearings?: CourtHearingItem[]; // For Lawyers (Phase 66)
  consultantBookings?: ConsultationBooking[]; // For Consultants (Phase 67)
  acRepairAMCs?: MaintenanceContract[]; // For AC Repair (Phase 68)
  acRepairDispatches?: TechnicianDispatch[]; // For AC Repair (Phase 69)
  referralSettings?: ReferralSettings; // Phase 70
  clinicVaccinations?: VaccinationRecord[]; // For Clinics/Pets (Phase 71)
  clinicPrescriptions?: DigitalRx[]; // For Clinics (Phase 72)
  astrologyKundalis?: KundaliRecord[]; // For Astrologers (Phase 73)
  astrologyMuhurats?: MuhuratRecord[]; // For Astrologers (Phase 74)
  tutorStudents?: StudentProgress[]; // For Tutors (Phase 75)
  tutorBatches?: BatchSchedule[]; // For Tutors (Phase 76)
  inventory?: InventoryItem[]; // Core (Phase 77)
  pricingRules?: DynamicPricingRule[]; // Core (Phase 78)
  waitlist?: WaitlistEntry[]; // Core (Phase 79)
  spaRooms?: SpaRoom[]; // For Spas (Phase 80)
  consentForms?: ConsentFormRecord[]; // Spa/Tattoo (Phase 81)
  tailorOrders?: TailorOrder[]; // For Tailors (Phase 82)
  repairEstimates?: RepairEstimate[]; // Mechanics (Phase 83)
  retailSales?: RetailSale[]; // Beauty & Salon (Phase 84)
  portfolioImages?: string[]; // Legacy
  about?: string; // Business description/about section
  galleryImages?: string[]; // Gallery images for business
  portfolioItems?: PortfolioItem[]; // For Tattoo/Mehendi (Phase 44)
  eventBookings?: EventBooking[]; // For Mehendi/Event Management (Phase 45)
  departments?: HospitalDepartment[]; // For hospitals (Phase 34)
  packages?: ServicePackage[]; // Bundled services like Bridal Packages (Phase 37)
  rooms?: { id: string; name: string; capacity?: number }[]; // For Spas (Phase 38)
  students?: StudentProfile[]; // For Coaching (Phase 39)
  attendance?: AttendanceRecord[]; // For Coaching (Phase 39)
  groupClasses?: GroupClass[]; // For Gyms (Phase 40)
  announcement?: string; // Phase 79: Marquee text
  isPaused?: boolean;      // Section 3: Smart Business Toolkit
  customServices?: ServiceItem[]; // Section 3: Service Menu Builder
  blockedCustomerIds?: string[]; // Section 3: Smart Business Toolkit
  // Legacy compat
  salonName?: string;
  salonImageURL?: string;
}

// Legacy alias — so old imports like `import { BarberProfile }` still work
export type BarberProfile = BusinessProfile;

export interface CustomerProfile {
  uid: string; name: string; phone: string; location: string; photoURL: string;
  favoriteSalons: string[]; subscription: string | null; createdAt: any;
  referralCode?: string; totalVisits?: number; referredBy?: string;
  fcmToken?: string; totalNoShows?: number;
  lat?: number; lng?: number;
  activeMemberships?: UserMembership[];
  pets?: PetProfile[];
  loyaltyPoints?: number;
  currentStreak?: number;
  lastVisitDate?: string;
  notiPush?: boolean;
  notiWhatsapp?: boolean;
  notiQuiet?: boolean;
  following?: string[];
  referralPoints?: number;
  noShowStrikes?: number; // Section 3: Smart Business Toolkit
}

export interface Prescription {
  symptoms: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; days: string }[];
  notes?: string;
}

export interface TokenEntry {
  id?: string; salonId: string; salonName: string; customerId: string;
  customerName: string; customerPhone: string; tokenNumber: number;
  selectedServices: ServiceItem[]; totalTime: number; totalPrice: number;
  estimatedWaitMinutes: number; status: 'waiting' | 'serving' | 'done' | 'cancelled' | 'no-show';
  createdAt: any; date: string; isAdvanceBooking: boolean; advanceDate?: string; rating?: number;
  assignedStaffId?: string;
  isTatkal?: boolean;
  tatkalFee?: number;
  groupSize?: number;
  promoCode?: string;
  discountAmount?: number;
  specialInstructions?: string;
  tipAmount?: number;
  repairStatus?: 'Received' | 'Diagnosed' | 'Parts Ordered' | 'Ready'; // Phase 31
  caseStatus?: 'Consultation' | 'Filing' | 'Hearing' | 'Closed'; // Phase 33
  photographyStatus?: 'Scheduled' | 'Shooting' | 'Editing' | 'Delivered'; // Phase 35
  deliveryLink?: string; // Phase 35
  prescription?: Prescription; // Phase 36
  assignedRoomId?: string; // Phase 38
  petHealthLog?: PetHealthLog; // Phase 41
  isPaused?: boolean;     // Section 1: Hold Spot / Re-queue
  transferredTo?: string; // Section 1: Token Transfer
  aiWaitPrediction?: number; // Section 1: AI Predictor
  internalNotes?: string;   // Section 3: Smart Business Toolkit
}

export interface MessageEntry {
  id?: string; salonId: string; salonName: string;
  senderId: string; senderName: string; senderPhoto: string;
  senderRole: 'customer' | 'business';
  customerId?: string; customerName?: string; customerPhoto?: string;
  message: string; createdAt: any; read: boolean;
}

export interface DayStat { date: string; dayName: string; count: number; revenue: number; cancelled: number; staffRevenue?: Record<string, number>; }

const OWNER_EMAIL = 'satyamkumar56021@gmail.com';

interface AppContextType {
  lang: Lang; setLang: (l: Lang) => void;
  role: Role | null; setRole: (r: Role | null) => void;
  user: User | null; loading: boolean;
  isOwner: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
  signOutUser: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  customerProfile: CustomerProfile | null;
  setCustomerProfile: (p: CustomerProfile | null) => void;
  saveCustomerProfile: (p: CustomerProfile) => Promise<void>;
  businessProfile: BusinessProfile | null;
  setBusinessProfile: (p: BusinessProfile | null) => void;
  saveBusinessProfile: (p: BusinessProfile) => Promise<boolean>;
  retrySyncBusinessProfile: () => Promise<boolean>;
  syncPending: boolean;
  uploadPhoto: (file: File, folder: string) => Promise<string>;
  getToken: (token: Omit<TokenEntry, 'id'>) => Promise<string | null>;
  cancelToken: (tokenId: string) => Promise<void>;
  pauseToken: (tokenId: string) => Promise<void>;
  resumeToken: (tokenId: string) => Promise<void>;
  transferToken: (tokenId: string, newCustomerPhone: string, newCustomerName: string) => Promise<void>;
  addWalkInCustomer: (customerName: string, selectedServices: ServiceItem[]) => Promise<string | null>;
  markNoShow: (tokenId: string, customerId: string) => Promise<void>;
  setQueueDelay: (minutes: number) => Promise<void>;
  assignTokenToStaff: (tokenId: string, staffId: string) => Promise<void>;
  rateToken: (tokenId: string, rating: number) => Promise<void>;
  searchBusinesses: (q: string) => Promise<BusinessProfile[]>;
  getBusinessById: (id: string) => Promise<BusinessProfile | null>;
  getSalonTokens: (salonId: string, date: string) => Promise<TokenEntry[]>;
  getCustomerTokens: (customerId: string) => Promise<TokenEntry[]>;
  getCustomerFullHistory: (customerId: string) => Promise<TokenEntry[]>;
  allBusinesses: BusinessProfile[];
  nextCustomer: () => Promise<void>;
  toggleSalonOpen: () => Promise<void>;
  toggleSalonBreak: () => Promise<void>;
  toggleSalonStop: () => Promise<void>;
  continueTokens: () => Promise<void>;
  getBusinessFullStats: (days: number) => Promise<DayStat[]>;
  getBusinessTrialDaysLeft: () => number;
  toggleQueuePause: (paused: boolean) => Promise<void>;
  updateTokenNotes: (tokenId: string, notes: string) => Promise<void>;
  blockCustomer: (customerId: string) => Promise<void>;
  unblockCustomer: (customerId: string) => Promise<void>;
  updateBusinessServices: (services: ServiceItem[]) => Promise<void>;
  isBusinessTrialActive: () => boolean;
  isBusinessSubscribed: () => boolean;
  addReview: (review: Omit<ReviewEntry, 'id'>) => Promise<void>;
  getSalonReviews: (salonId: string) => Promise<ReviewEntry[]>;
  getTodayEarnings: () => Promise<number>;
  sendMessage: (msg: Omit<MessageEntry, 'id'>) => Promise<void>;
  useChatMessages: (salonId: string) => MessageEntry[];
  notifications: NotificationEntry[]; unreadCount: number;
  pushNotification: (userId: string, notif: Omit<NotificationEntry, 'id' | 'userId' | 'read' | 'createdAt'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  toggleFavorite: (salonId: string) => void;
  isFavorite: (salonId: string) => boolean;
  getUserLocation: () => Promise<{ lat: number; lng: number } | null>;
  requestNotificationPermission: () => Promise<void>;
  getCategoryInfo: (cat: BusinessCategory) => BusinessCategoryInfo;
  t: (key: string) => string;
  awardLoyaltyPoints: (customerId: string, points: number, reason: string) => Promise<void>;
  updateDailyStreak: (customerId: string) => Promise<void>;
  processReferral: (newCustomerId: string, referralCode: string) => Promise<void>;
  // ── Legacy backward-compat aliases ──
  allSalons: BusinessProfile[];
  barberProfile: BusinessProfile | null;
  saveBarberProfile: (p: BusinessProfile) => Promise<boolean>;
  getSalonById: (id: string) => Promise<BusinessProfile | null>;
  searchSalons: (query: string) => Promise<BusinessProfile[]>;
  getBarberFullStats: (days: number) => Promise<DayStat[]>;
  isBarberTrialActive: () => boolean;
  getBarberTrialDaysLeft: () => number;
  isBarberSubscribed: () => boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);

const translations: Record<string, Record<Lang, string>> = {
  'app.name': { en: 'Line Free India', hi: 'लाइन फ्री इंडिया' },
  'app.tagline': { en: 'India\'s #1 Beauty & Wellness SuperApp', hi: 'भारत का #1 ब्यूटी और वेलनेस ऐप' },
  'lang.select': { en: 'Select Language', hi: 'भाषा चुनें' },
  'role.select': { en: 'Continue as', hi: 'के रूप में जारी रखें' },
  'role.customer': { en: 'Customer', hi: 'ग्राहक' },
  'role.business': { en: 'Business Owner', hi: 'बिज़नेस ओनर' },
  'role.barber': { en: 'Business Owner', hi: 'बिज़नेस ओनर' },
  'auth.login': { en: 'Login', hi: 'लॉगिन' },
  'auth.google': { en: 'Continue with Google', hi: 'Google से लॉगिन करें' },
  'auth.logout': { en: 'Logout', hi: 'लॉगआउट' },
  'profile.setup': { en: 'Setup Profile', hi: 'प्रोफाइल सेटअप' },
  'profile.name': { en: 'Name', hi: 'नाम' },
  'profile.phone': { en: 'Phone Number', hi: 'फ़ोन नंबर' },
  'profile.location': { en: 'Location', hi: 'लोकेशन' },
  'profile.businessName': { en: 'Business Name', hi: 'बिज़नेस का नाम' },
  'profile.salonName': { en: 'Business Name', hi: 'बिज़नेस का नाम' },
  'profile.optional': { en: '(Optional)', hi: '(वैकल्पिक)' },
  'btn.continue': { en: 'Continue', hi: 'जारी रखें' },
  'btn.skip': { en: 'Skip', hi: 'छोड़ें' },
  'btn.save': { en: 'Save', hi: 'सेव करें' },
  'btn.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'btn.back': { en: 'Back', hi: 'वापस' },
  'btn.next': { en: 'Next', hi: 'अगला' },
  'btn.getToken': { en: 'Get Token', hi: 'टोकन लें' },
  'btn.cancelToken': { en: 'Cancel Token', hi: 'टोकन रद्द करें' },
  'home': { en: 'Home', hi: 'होम' },
  'search': { en: 'Search', hi: 'खोजें' },
  'tokens': { en: 'Activity', hi: 'गतिविधि' },
  'profile': { en: 'Profile', hi: 'प्रोफाइल' },
  'subscription': { en: 'Subscription', hi: 'सब्सक्रिप्शन' },
  'hairstyles': { en: 'Explore', hi: 'एक्सप्लोर' },
  'business.open': { en: 'Open Business', hi: 'बिज़नेस खोलें' },
  'business.close': { en: 'Close Business', hi: 'बिज़नेस बंद करें' },
  'business.break': { en: 'Take Break', hi: 'ब्रेक लें' },
  'business.endBreak': { en: 'End Break', hi: 'ब्रेक खत्म' },
  'business.closed': { en: 'Business is Closed', hi: 'बिज़नेस बंद है' },
  'business.onBreak': { en: 'On Break', hi: 'ब्रेक पर' },
  'business.isOpen': { en: 'Business is Open', hi: 'बिज़नेस खुला है' },
  'salon.open': { en: 'Open Business', hi: 'बिज़नेस खोलें' },
  'salon.close': { en: 'Close Business', hi: 'बिज़नेस बंद करें' },
  'salon.break': { en: 'Take Break', hi: 'ब्रेक लें' },
  'salon.endBreak': { en: 'End Break', hi: 'ब्रेक खत्म' },
  'salon.closed': { en: 'Business is Closed', hi: 'बिज़नेस बंद है' },
  'salon.onBreak': { en: 'On Break', hi: 'ब्रेक पर' },
  'salon.isOpen': { en: 'Business is Open', hi: 'बिज़नेस खुला है' },
  'queue': { en: 'Queue', hi: 'कतार' },
  'queue.customers': { en: 'Customers in Queue', hi: 'कतार में ग्राहक' },
  'queue.next': { en: 'Next Customer', hi: 'अगला ग्राहक' },
  'queue.stop': { en: 'Stop Tokens', hi: 'टोकन बंद करें' },
  'queue.continue': { en: 'Continue Tokens', hi: 'टोकन जारी रखें' },
  'queue.current': { en: 'Current Token', hi: 'वर्तमान टोकन' },
  'queue.total': { en: 'Total Tokens', hi: 'कुल टोकन' },
  'queue.waiting': { en: 'Waiting', hi: 'इंतज़ार' },
  'queue.peopleBefore': { en: 'people before you', hi: 'लोग आपसे पहले' },
  'queue.estTime': { en: 'Estimated wait', hi: 'अनुमानित इंतज़ार' },
  'queue.yourToken': { en: 'Your Token', hi: 'आपका टोकन' },
  'services': { en: 'Services', hi: 'सेवाएं' },
  'services.add': { en: 'Add Service', hi: 'सेवा जोड़ें' },
  'services.select': { en: 'Select Services', hi: 'सेवाएं चुनें' },
  'min': { en: 'min', hi: 'मिनट' },
  'rs': { en: '₹', hi: '₹' },
  'today': { en: 'Today', hi: 'आज' },
  'favorites': { en: 'Favorites', hi: 'पसंदीदा' },
  'no.results': { en: 'No results found', hi: 'कोई परिणाम नहीं' },
  'sub.customer.title': { en: 'Customer Subscription', hi: 'ग्राहक सब्सक्रिप्शन' },
  'sub.business.title': { en: 'Business Subscription', hi: 'बिज़नेस सब्सक्रिप्शन' },
  'sub.barber.title': { en: 'Business Subscription', hi: 'बिज़नेस सब्सक्रिप्शन' },
  'error': { en: 'Something went wrong', hi: 'कुछ गलत हो गया' },
  'loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'earnings': { en: 'Earnings', hi: 'कमाई' },
  'reviews': { en: 'Reviews', hi: 'रिव्यू' },
  'share': { en: 'Share', hi: 'शेयर करें' },
  'pay': { en: 'Pay', hi: 'भुगतान करें' },
  'trial': { en: 'Free Trial', hi: 'फ्री ट्रायल' },
  'trial.active': { en: 'Trial Active', hi: 'ट्रायल चालू' },
  'trial.expired': { en: 'Trial Expired', hi: 'ट्रायल खत्म' },
  'nearby': { en: 'Nearby Businesses', hi: 'आस-पास के बिज़नेस' },
  'featured': { en: 'Featured Businesses', hi: 'फीचर्ड बिज़नेस' },
  'all.businesses': { en: 'All Businesses', hi: 'सभी बिज़नेस' },
  'all.salons': { en: 'All Businesses', hi: 'सभी बिज़नेस' },
  'open.now': { en: 'Open Now', hi: 'अभी खुला' },
  'refer': { en: 'Refer & Earn', hi: 'रेफर करें और कमाएं' },
  'analytics': { en: 'Analytics', hi: 'एनालिटिक्स' },
  'history': { en: 'History', hi: 'इतिहास' },
  'notifications': { en: 'Notifications', hi: 'नोटिफिकेशन' },
  'delete.account': { en: 'Delete Account', hi: 'अकाउंट डिलीट करें' },
};

// Helper to normalize legacy barber profiles
const normalizeBusinessProfile = (data: any): BusinessProfile => ({
  ...data,
  businessName: data.businessName || data.salonName || 'My Business',
          businessType: data.businessType || 'mens_salon',
  bannerImageURL: data.bannerImageURL || data.salonImageURL || '',
  // Keep legacy fields for compat
  salonName: data.businessName || data.salonName || 'My Business',
  salonImageURL: data.bannerImageURL || data.salonImageURL || '',
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lf_lang') as Lang) || 'en');
  const [role, setRoleState] = useState<Role | null>(() => {
    const saved = localStorage.getItem('lf_role') as string | null;
    if (saved === 'barber') return 'business'; // Legacy compat
    return saved as Role | null;
  });
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme-mode') as 'light' | 'dark') || 'dark');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerProfile, setCustomerProfileState] = useState<CustomerProfile | null>(null);
  const [businessProfile, setBusinessProfileState] = useState<BusinessProfile | null>(null);
  const [allBusinesses, setAllBusinesses] = useState<BusinessProfile[]>([]);
  const [syncPending, setSyncPending] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);

  const isOwner = user?.email === OWNER_EMAIL;

  const t = (key: string) => translations[key]?.[lang] || key;
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('lf_lang', l); };
  const setRole = (r: Role | null) => { setRoleState(r); r ? localStorage.setItem('lf_role', r) : localStorage.removeItem('lf_role'); };
  const toggleTheme = () => { 
    const newTheme = theme === 'dark' ? 'light' : 'dark'; 
    setThemeState(newTheme); 
    localStorage.setItem('theme-mode', newTheme);
    window.dispatchEvent(new Event('theme-change'));
  };
  const setCustomerProfile = (p: CustomerProfile | null) => { setCustomerProfileState(p); p ? localStorage.setItem('lf_customer', JSON.stringify(p)) : localStorage.removeItem('lf_customer'); };
  const setBusinessProfile = (p: BusinessProfile | null) => { setBusinessProfileState(p); p ? localStorage.setItem('lf_barber', JSON.stringify(p)) : localStorage.removeItem('lf_barber'); };

  // ── Real-time businesses (reads from both 'barbers' + 'businesses' for migration) ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'barbers'), snap => {
      const s = snap.docs.map(d => normalizeBusinessProfile(d.data()));
      s.sort((a, b) => ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0));
      setAllBusinesses(s);
    }, err => console.warn('Business listener:', err));
    return () => unsub();
  }, []);

  // ── Real-time notifications ──
  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, snap => {
      const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationEntry));
      notifs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotifications(notifs.slice(0, 50));
    }, () => {});
    return () => unsub();
  }, [user]);

  // ── Foreground Push Messages ──
  useEffect(() => {
    try {
      const unsub = onMessage(messaging, (payload) => {
        console.log('Foreground Push Notification:', payload);
      });
      return () => unsub();
    } catch {}
  }, []);

  // ── Auth state ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const savedRole = localStorage.getItem('lf_role') as string | null;
        const effectiveRole = savedRole === 'barber' ? 'business' : savedRole;
        if (effectiveRole === 'customer') {
          try { const snap = await getDoc(doc(db, 'customers', u.uid)); if (snap.exists()) setCustomerProfile(snap.data() as CustomerProfile); else { const l = localStorage.getItem('lf_customer'); if (l) try { setCustomerProfileState(JSON.parse(l)); } catch {} } } catch { const l = localStorage.getItem('lf_customer'); if (l) try { setCustomerProfileState(JSON.parse(l)); } catch {} }
        } else if (effectiveRole === 'business') {
          try { const snap = await getDoc(doc(db, 'barbers', u.uid)); if (snap.exists()) setBusinessProfile(normalizeBusinessProfile(snap.data())); else { const l = localStorage.getItem('lf_barber'); if (l) try { setBusinessProfileState(normalizeBusinessProfile(JSON.parse(l))); } catch {} } } catch { const l = localStorage.getItem('lf_barber'); if (l) try { setBusinessProfileState(normalizeBusinessProfile(JSON.parse(l))); } catch {} }
        }
        
        // FCM Push Notification Registration
        try {
          if ('Notification' in window && Notification.permission !== 'denied') {
            const fcmToken = await getFCMToken(messaging);
            if (fcmToken) {
              await setDoc(doc(db, 'fcmTokens', u.uid), { token: fcmToken, updatedAt: Date.now() }, { merge: true });
            }
          }
        } catch(e) { console.warn('FCM Registration Skipped:', e); }

      } else { setCustomerProfileState(null); setBusinessProfileState(null); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    try { await setPersistence(auth, browserLocalPersistence); } catch (_) {}
    const r = await signInWithPopup(auth, googleProvider);
    return r;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try { await setPersistence(auth, browserLocalPersistence); } catch (_) {}
    return await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try { await setPersistence(auth, browserLocalPersistence); } catch (_) {}
    return await createUserWithEmailAndPassword(auth, email, pass);
  };

  const signOutUser = async () => {
    try { await fbSignOut(auth); } catch {}
    setUser(null); setRole(null); setCustomerProfile(null); setBusinessProfile(null);
    localStorage.removeItem('lf_role'); localStorage.removeItem('lf_customer'); localStorage.removeItem('lf_barber');
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const colls = role === 'customer'
        ? [['customers', user.uid], ['tokens', 'customerId'], ['notifications', 'userId']]
        : [['barbers', user.uid], ['tokens', 'salonId'], ['reviews', 'salonId'], ['notifications', 'userId'], ['messages', 'salonId']];
      for (const [coll, field] of colls) {
        try {
          if (field === user.uid) { await deleteDoc(doc(db, coll, user.uid)); }
          else { const snap = await getDocs(query(collection(db, coll), where(field, '==', user.uid))); await Promise.all(snap.docs.map(d => deleteDoc(doc(db, coll, d.id)))); }
        } catch {}
      }
      await deleteUser(user);
      await signOutUser();
      return { success: true };
    } catch (e: any) {
      if (e?.code === 'auth/requires-recent-login') {
        try { await reauthenticateWithPopup(user, googleProvider); return deleteAccount(); } catch { return { success: false, error: 'Re-auth failed.' }; }
      }
      return { success: false, error: e?.message || 'Failed' };
    }
  };

  const uploadPhoto = async (file: File, folder: string) => uploadToCloudinary(file, folder);

  const saveCustomerProfile = async (p: CustomerProfile) => {
    if (!p.referralCode) p = { ...p, referralCode: `LF${p.uid.slice(0, 6).toUpperCase()}` };
    setCustomerProfile(p);
    try { await setDoc(doc(db, 'customers', p.uid), p, { merge: true }); } catch (e) { console.warn('Save failed:', e); }
  };

  const pendingRef = { current: null as BusinessProfile | null };
  const firestoreRetry = async (fn: () => Promise<void>, retries = 3): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      try { await fn(); return true; } catch { if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1))); }
    }
    return false;
  };

  const syncBusinessToFirestore = async (p: BusinessProfile) => {
    setSyncPending(true);
    if (!p.referralCode) p = { ...p, referralCode: `LF${p.uid.slice(0, 6).toUpperCase()}` };
    // Keep salonName in sync for legacy compat
    p.salonName = p.businessName;
    p.salonImageURL = p.bannerImageURL;
    const ok = await firestoreRetry(() => setDoc(doc(db, 'barbers', p.uid), p, { merge: true }));
    if (ok) { setSyncPending(false); pendingRef.current = null; } else { pendingRef.current = p; }
    return ok;
  };

  useEffect(() => { const iv = setInterval(() => { if (pendingRef.current) syncBusinessToFirestore(pendingRef.current); }, 10000); return () => clearInterval(iv); }, []);

  const saveBusinessProfile = async (p: BusinessProfile) => { setBusinessProfile(p); return syncBusinessToFirestore(p); };
  const retrySyncBusinessProfile = async () => businessProfile ? syncBusinessToFirestore(businessProfile) : false;

  const searchBusinesses = async (q: string) => {
    if (!q.trim()) return allBusinesses;
    const l = q.toLowerCase();
    return allBusinesses.filter(s => s.businessName?.toLowerCase().includes(l) || s.salonName?.toLowerCase().includes(l) || s.name?.toLowerCase().includes(l) || s.location?.toLowerCase().includes(l) || s.services?.some(sv => sv.name.toLowerCase().includes(l)) || s.businessType?.toLowerCase().includes(l));
  };

  const getBusinessById = async (id: string) => {
    const c = allBusinesses.find(s => s.uid === id);
    if (c) return c;
    try { const snap = await getDoc(doc(db, 'barbers', id)); if (snap.exists()) return normalizeBusinessProfile(snap.data()); } catch {}
    return null;
  };

  const getTodayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

  const getSalonTokens = async (salonId: string, date: string): Promise<TokenEntry[]> => {
    try {
      const q = query(collection(db, 'tokens'), where('salonId', '==', salonId));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      return all.filter(t => t.date === date);
    } catch (e) { console.error('getSalonTokens error:', e); return []; }
  };

  const getCustomerTokens = async (customerId: string): Promise<TokenEntry[]> => {
    try {
      const today = getTodayStr();
      const q = query(collection(db, 'tokens'), where('customerId', '==', customerId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry)).filter(t => t.date === today);
    } catch (e) { console.error('getCustomerTokens error:', e); return []; }
  };

  const getCustomerFullHistory = async (customerId: string): Promise<TokenEntry[]> => {
    try {
      const q = query(collection(db, 'tokens'), where('customerId', '==', customerId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry)).sort((a, b) => ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0));
    } catch { return []; }
  };

  const getToken = async (token: Omit<TokenEntry, 'id'>): Promise<string | null> => {
    try {
      if (!user) {
        console.error('getToken failure: User not authenticated');
        return null;
      }

      // ── Check if Blocked ──
      const bizSnap = await getDoc(doc(db, 'barbers', token.salonId));
      if (bizSnap.exists()) {
        const bizData = bizSnap.data() as BusinessProfile;
        if (bizData.blockedCustomerIds?.includes(user.uid)) {
          console.warn('getToken failure: User is blocked by this business');
          alert('Sorry, you have been blocked from booking at this business.');
          return null;
        }
      }

      // Firestore fails if any field is undefined. Sanitize input.
      const sanitizedToken = JSON.parse(JSON.stringify(token, (key, value) => 
        value === undefined ? null : value
      ));

      console.log('Attempting to create token:', sanitizedToken);
      const ref = await addDoc(collection(db, 'tokens'), sanitizedToken);
      const tokenId = ref.id;
      
      setTimeout(async () => {
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: sanitizedToken.customerId,
            title: '🎫 Token Confirmed!',
            body: `Token #${sanitizedToken.tokenNumber} at ${sanitizedToken.salonName}. Est. wait: ${sanitizedToken.estimatedWaitMinutes} min`,
            type: 'token_ready',
            data: { salonId: sanitizedToken.salonId, tokenNumber: sanitizedToken.tokenNumber },
            read: false, createdAt: Date.now(),
          });
        } catch (_) {}
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: sanitizedToken.salonId,
            title: '🔔 New Customer!',
            body: `${sanitizedToken.customerName} booked Token #${sanitizedToken.tokenNumber}`,
            type: 'token_ready',
            data: { tokenId },
            read: false, createdAt: Date.now(),
          });
        } catch (_) {}
      }, 0);
      return tokenId;
    } catch (e: any) {
      console.error('getToken Critical Error:', e);
      return null;
    }
  };


  const cancelToken = async (tokenId: string) => { try { await updateDoc(doc(db, 'tokens', tokenId), { status: 'cancelled' }); } catch {} };
  const pauseToken = async (tokenId: string) => { try { await updateDoc(doc(db, 'tokens', tokenId), { isPaused: true }); } catch {} };
  const resumeToken = async (tokenId: string) => { try { await updateDoc(doc(db, 'tokens', tokenId), { isPaused: false }); } catch {} };
  const transferToken = async (tokenId: string, newPhone: string, newName: string) => { try { await updateDoc(doc(db, 'tokens', tokenId), { customerPhone: newPhone, customerName: newName, transferredTo: newPhone }); } catch {} };
  
  const markNoShow = async (tokenId: string, customerId: string) => {
    try {
      await updateDoc(doc(db, 'tokens', tokenId), { status: 'no-show' });
      const snap = await getDoc(doc(db, 'customers', customerId));
      if (snap.exists()) {
        const c = snap.data() as CustomerProfile;
        await updateDoc(doc(db, 'customers', customerId), { 
          totalNoShows: (c.totalNoShows || 0) + 1,
          noShowStrikes: (c.noShowStrikes || 0) + 1 
        });
        await pushNotification(customerId, { 
          title: '🚨 Missed your turn?', 
          body: 'You were marked as no-show. 3 strikes may lead to temporary suspension!', 
          type: 'general' 
        });
      }
    } catch {}
  };

  const toggleQueuePause = async (paused: boolean) => {
    if (!businessProfile) return;
    if (paused) await broadcastBusinessNotification('⏸️ Token Service Paused', `${businessProfile.businessName} has temporarily paused taking new tokens. We will be back shortly!`);
    await saveBusinessProfile({ ...businessProfile, isPaused: paused });
  };

  const updateTokenNotes = async (tokenId: string, notes: string) => {
    try { await updateDoc(doc(db, 'tokens', tokenId), { internalNotes: notes }); } catch {}
  };

  const updateBusinessServices = async (services: ServiceItem[]) => {
    if (!businessProfile || !user) return;
    try { await updateDoc(doc(db, 'users', user.uid), { customServices: services }); setBusinessProfile({ ...businessProfile, customServices: services }); } catch {}
  };

  const blockCustomer = async (customerId: string) => {
    if (!businessProfile || !user) return;
    const blocked = businessProfile.blockedCustomerIds || [];
    if (!blocked.includes(customerId)) {
      const newList = [...blocked, customerId];
      await saveBusinessProfile({ ...businessProfile, blockedCustomerIds: newList });
    }
  };

  const unblockCustomer = async (customerId: string) => {
    if (!businessProfile || !user) return;
    const blocked = businessProfile.blockedCustomerIds || [];
    const newList = blocked.filter(id => id !== customerId);
    await saveBusinessProfile({ ...businessProfile, blockedCustomerIds: newList });
  };

  const setQueueDelay = async (minutes: number) => {
    if (!businessProfile) return;
    await saveBusinessProfile({ ...businessProfile, queueDelayMinutes: minutes });
  };

  const addWalkInCustomer = async (customerName: string, selectedServices: ServiceItem[]): Promise<string | null> => {
    if (!businessProfile || !user) return null;
    try {
      const today = getTodayStr();
      const allTokens = await getSalonTokens(user.uid, today);
      const tokenNumber = Math.max(0, ...allTokens.map(t => t.tokenNumber)) + 1;
      const totalTime = selectedServices.reduce((sum, s) => sum + s.avgTime, 0);
      const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
      
      const serving = allTokens.filter(t => t.status === 'serving').length;
      const waitingTokens = allTokens.filter(t => t.status === 'waiting');
      const waitTime = waitingTokens.reduce((sum, t) => sum + t.totalTime, 0) + (serving ? 15 : 0) + (businessProfile.queueDelayMinutes || 0);

      const token: Omit<TokenEntry, 'id'> = {
        salonId: user.uid,
        salonName: businessProfile.businessName,
        customerId: 'offline_walk_in',
        customerName: customerName,
        customerPhone: 'Walk-in',
        tokenNumber,
        selectedServices,
        totalTime,
        totalPrice,
        estimatedWaitMinutes: waitTime,
        status: 'waiting',
        createdAt: Date.now(),
        date: today,
        isAdvanceBooking: false
      };
      
      const ref = await addDoc(collection(db, 'tokens'), token);
      await saveBusinessProfile({ ...businessProfile, totalTokensToday: (businessProfile.totalTokensToday || 0) + 1 });
      return ref.id;
    } catch (e) {
      console.error('addWalkInCustomer error:', e);
      return null;
    }
  };

  const assignTokenToStaff = async (tokenId: string, staffId: string) => {
    try { await updateDoc(doc(db, 'tokens', tokenId), { assignedStaffId: staffId }); } catch {}
  };

  const rateToken = async (tokenId: string, rating: number) => { try { await updateDoc(doc(db, 'tokens', tokenId), { rating }); } catch {} };

  // ═══════════════════════════════════════════
  // LOYALTY POINTS SYSTEM
  // ═══════════════════════════════════════════
  const awardLoyaltyPoints = async (customerId: string, points: number, reason: string) => {
    if (!customerId || points <= 0) return;
    try {
      const customerRef = doc(db, 'customers', customerId);
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const currentPoints = customerSnap.data().loyaltyPoints || 0;
        await updateDoc(customerRef, { 
          loyaltyPoints: currentPoints + points 
        });
        
        // Update local state if it's the current user
        if (customerProfile?.uid === customerId) {
          setCustomerProfile({
            ...customerProfile,
            loyaltyPoints: currentPoints + points
          });
        }
        
        // Log the points transaction
        await addDoc(collection(db, 'loyaltyTransactions'), {
          customerId,
          points,
          reason,
          timestamp: Date.now(),
          createdAt: new Date().toISOString()
        });
        
        console.log(`✅ Awarded ${points} points to ${customerId} for: ${reason}`);
      }
    } catch (e) {
      console.error('awardLoyaltyPoints error:', e);
    }
  };

  const updateDailyStreak = async (customerId: string) => {
    if (!customerId) return;
    try {
      const customerRef = doc(db, 'customers', customerId);
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const data = customerSnap.data();
        const lastVisit = data.lastVisitDate;
        const today = getTodayStr();
        
        let newStreak = data.currentStreak || 0;
        
        // Check if last visit was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
        
        if (lastVisit === yesterdayStr) {
          // Continue streak
          newStreak += 1;
          await awardLoyaltyPoints(customerId, 10, 'Daily streak bonus');
        } else if (lastVisit !== today) {
          // Reset streak if more than 1 day gap
          newStreak = 1;
        }
        
        await updateDoc(customerRef, {
          currentStreak: newStreak,
          lastVisitDate: today
        });
        
        // Update local state
        if (customerProfile?.uid === customerId) {
          setCustomerProfile({
            ...customerProfile,
            currentStreak: newStreak,
            lastVisitDate: today
          });
        }
      }
    } catch (e) {
      console.error('updateDailyStreak error:', e);
    }
  };

  const processReferral = async (newCustomerId: string, referralCode: string) => {
    if (!newCustomerId || !referralCode) return;
    try {
      // Find the referrer by referral code
      const customersSnap = await getDocs(query(collection(db, 'customers'), where('referralCode', '==', referralCode)));
      if (!customersSnap.empty) {
        const referrer = customersSnap.docs[0];
        const referrerId = referrer.id;
        
        // Award 100 points to the referrer
        await awardLoyaltyPoints(referrerId, 100, 'Referred a friend');
        
        // Update the new customer's referredBy field
        await updateDoc(doc(db, 'customers', newCustomerId), {
          referredBy: referrerId
        });
        
        console.log(`✅ Referral processed: ${referrerId} referred ${newCustomerId}`);
      }
    } catch (e) {
      console.error('processReferral error:', e);
    }
  };


  const nextCustomer = async () => {
    if (!businessProfile || !user) return;
    const today = getTodayStr();
    try {
      const allTokens = await getSalonTokens(user.uid, today);
      const serving = allTokens.filter(t => t.status === 'serving');
      const waiting = allTokens.filter(t => t.status === 'waiting').sort((a, b) => {
        if (a.isTatkal && !b.isTatkal) return -1;
        if (!a.isTatkal && b.isTatkal) return 1;
        return a.tokenNumber - b.tokenNumber;
      });
      
      // Award loyalty points for completed visits
      await Promise.all(serving.map(async (t) => {
        await updateDoc(doc(db, 'tokens', t.id!), { status: 'done' });
        // Award 50 points for completing a visit
        if (t.customerId) {
          await awardLoyaltyPoints(t.customerId, 50, 'Completed visit');
          await updateDailyStreak(t.customerId);
        }
      }));
      
      if (waiting.length > 0) {
        const next = waiting[0];
        await updateDoc(doc(db, 'tokens', next.id!), { status: 'serving' });
        try { await pushNotification(next.customerId, { title: '🔔 Your Turn!', body: `Token #${next.tokenNumber} — it's your turn at ${businessProfile.businessName}!`, type: 'token_called', data: { salonId: user.uid } }); } catch {}
        await saveBusinessProfile({ ...businessProfile, currentToken: next.tokenNumber });
      }
    } catch (e) { console.error('nextCustomer error:', e); }
  };

  const toggleSalonOpen = async () => { 
    if (!businessProfile) return; 
    const o = !businessProfile.isOpen; 
    if (!o) await broadcastBusinessNotification('⚠️ Business Closed', `${businessProfile.businessName} is now closed for the day. Any remaining tokens are cancelled.`);
    await saveBusinessProfile({ ...businessProfile, isOpen: o, isBreak: false, currentToken: o ? 0 : businessProfile.currentToken, totalTokensToday: o ? 0 : businessProfile.totalTokensToday }); 
  };
  const toggleSalonBreak = async (durationMinutes?: number) => { 
    if (!businessProfile) return; 
    const b = !businessProfile.isBreak; 
    const breakEndTime = b && durationMinutes ? Date.now() + (durationMinutes * 60 * 1000) : null;
    if (b) await broadcastBusinessNotification('☕ Short Break', `${businessProfile.businessName} is on a ${durationMinutes || 'short'} minute break. Your tokens are safe, wait times may slightly increase.`);
    await saveBusinessProfile({ ...businessProfile, isBreak: b, breakStartTime: b ? Date.now() : null, breakEndTime }); 
  };
  const toggleSalonStop = async () => { 
    if (!businessProfile) return; 
    const isS = !businessProfile.isStopped;
    if (isS) await broadcastBusinessNotification('🛑 Tokens Paused', `${businessProfile.businessName} has temporarily stopped issuing new tokens to clear the current rush.`);
    await saveBusinessProfile({ ...businessProfile, isStopped: isS }); 
  };
  const continueTokens = async () => { 
    if (!businessProfile) return; 
    await broadcastBusinessNotification('✅ Tokens Resumed', `${businessProfile.businessName} is issuing tokens again!`);
    await saveBusinessProfile({ ...businessProfile, isStopped: false }); 
  };

  const broadcastBusinessNotification = async (title: string, body: string) => {
    if (!user || role !== 'business') return;
    try {
      const tokens = await getSalonTokens(user.uid, getTodayStr());
      const eligible = tokens.filter(t => t.status === 'serving' || t.status === 'waiting');
      await Promise.all(eligible
        .filter(t => t.customerId && !t.customerId.startsWith('offline_'))
        .map(t => pushNotification(t.customerId, { title, body, type: 'general' }))
      );
    } catch (e) { console.error('Broadcast failed:', e); }
  };

  const getBusinessFullStats = async (days: number): Promise<DayStat[]> => {
    if (!user) return [];
    const result: DayStat[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayName = d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
      try {
        const tks = await getSalonTokens(user.uid, dateStr);
        const done = tks.filter(t => t.status === 'done');
        const staffRev: Record<string, number> = {};
        done.forEach(t => {
          const sid = t.assignedStaffId || 'unassigned';
          staffRev[sid] = (staffRev[sid] || 0) + (t.totalPrice || 0);
        });
        result.push({ date: dateStr, dayName, count: done.length, revenue: done.reduce((a, c) => a + (c.totalPrice || 0), 0), cancelled: tks.filter(t => t.status === 'cancelled').length, staffRevenue: staffRev });
      } catch { result.push({ date: dateStr, dayName, count: 0, revenue: 0, cancelled: 0 }); }
    }
    return result;
  };

  const getBusinessTrialDaysLeft = () => { if (!businessProfile?.createdAt) return 30; const c = typeof businessProfile.createdAt === 'number' ? businessProfile.createdAt : Date.now(); return Math.max(0, 30 - Math.floor((Date.now() - c) / 86400000)); };
  const isBusinessTrialActive = () => getBusinessTrialDaysLeft() > 0;
  const isBusinessSubscribed = () => isBusinessTrialActive() || (!!(businessProfile?.subscriptionExpiry) && businessProfile.subscriptionExpiry! > Date.now());

  const addReview = async (review: Omit<ReviewEntry, 'id'>) => {
    try {
      await addDoc(collection(db, 'reviews'), review);
      const snap = await getDocs(query(collection(db, 'reviews'), where('salonId', '==', review.salonId)));
      const all = snap.docs.map(d => d.data() as ReviewEntry);
      const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
      await updateDoc(doc(db, 'barbers', review.salonId), { rating: Math.round(avg * 10) / 10, totalReviews: all.length });
      try { await pushNotification(review.salonId, { title: '⭐ New Review!', body: `${review.customerName} gave ${review.rating} stars`, type: 'review' }); } catch {}
      
      // Award 25 points for leaving a review
      if (review.customerId) {
        await awardLoyaltyPoints(review.customerId, 25, 'Left a review');
      }
    } catch {}
  };

  const getSalonReviews = async (salonId: string): Promise<ReviewEntry[]> => {
    try {
      const snap = await getDocs(query(collection(db, 'reviews'), where('salonId', '==', salonId)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ReviewEntry)).sort((a, b) => ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0));
    } catch { return []; }
  };

  const getTodayEarnings = async () => {
    if (!user) return 0;
    try {
      const tks = await getSalonTokens(user.uid, getTodayStr());
      return tks.filter(t => t.status === 'done').reduce((s, t) => s + (t.totalPrice || 0), 0);
    } catch { return 0; }
  };

  const sendMessage = async (msg: Omit<MessageEntry, 'id'>) => {
    try { await addDoc(collection(db, 'messages'), { ...msg, createdAt: Date.now() }); } catch (e) { console.error('sendMessage error:', e); }
  };

  const useChatMessages = (salonId: string): MessageEntry[] => {
    const [msgs, setMsgs] = useState<MessageEntry[]>([]);
    useEffect(() => {
      if (!salonId) return;
      const q = query(collection(db, 'messages'), where('salonId', '==', salonId));
      const unsub = onSnapshot(q, snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as MessageEntry));
        all.sort((a, b) => ((a.createdAt as number) || 0) - ((b.createdAt as number) || 0));
        setMsgs(all);
      }, err => console.warn('Chat listener:', err));
      return () => unsub();
    }, [salonId]);
    return msgs;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const pushNotification = async (userId: string, notif: Omit<NotificationEntry, 'id' | 'userId' | 'read' | 'createdAt'>) => {
    if (!userId || userId.startsWith('offline_')) {
      // Walk-in/guest tokens are not tied to a registered user for external push delivery.
      await addDoc(collection(db, 'notifications'), { ...notif, userId, read: false, createdAt: Date.now() });
      return;
    }

    try {
      const snap = await getDoc(doc(db, 'customers', userId));
      let shouldPush = true;
      let shouldWhatsapp = true;
      let quiet = false;

      if (snap.exists()) {
        const profile = snap.data() as CustomerProfile;
        shouldPush = profile.notiPush ?? true;
        shouldWhatsapp = profile.notiWhatsapp ?? true;
        quiet = profile.notiQuiet ?? false;
      }

      if (quiet) return; // Skip all if quiet mode is on

      // Always save to internal history
      await addDoc(collection(db, 'notifications'), { ...notif, userId, read: false, createdAt: Date.now() });

      // Simulate External Push (FCM/WhatsApp)
      if (shouldPush) console.log(`[FCM PUSH] to ${userId}: ${notif.title}`);
      if (shouldWhatsapp) console.log(`[WHATSAPP] to ${userId}: ${notif.title}`);
    } catch (e) {
      // Fallback: silently save notification if profile fetch fails
      try { await addDoc(collection(db, 'notifications'), { ...notif, userId, read: false, createdAt: Date.now() }); } catch {}
    }
  };

  const markNotificationRead = async (id: string) => { try { await updateDoc(doc(db, 'notifications', id), { read: true }); } catch {} };
  const markAllNotificationsRead = async () => { await Promise.all(notifications.filter(n => !n.read).map(n => markNotificationRead(n.id!))); };

  const requestNotificationPermission = async () => {
    if (!user) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getFCMToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' }).catch(() => null);
        if (token) {
           if (role === 'customer' && customerProfile) saveCustomerProfile({ ...customerProfile, fcmToken: token });
           else if (role === 'business' && businessProfile) saveBusinessProfile({ ...businessProfile, fcmToken: token });
        } else {
           console.warn('FCM token generation failed (missing VAPID key in code)');
        }
      }
    } catch (e) { console.warn('Push permission failed:', e); }
  };

  const toggleFavorite = (salonId: string) => {
    if (!customerProfile) return;
    const favs = customerProfile.favoriteSalons || [];
    saveCustomerProfile({ ...customerProfile, favoriteSalons: favs.includes(salonId) ? favs.filter(id => id !== salonId) : [...favs, salonId] });
  };
  const isFavorite = (salonId: string) => (customerProfile?.favoriteSalons || []).includes(salonId);

  const getUserLocation = (): Promise<{ lat: number; lng: number } | null> =>
    new Promise(resolve => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });

  return (
    <AppContext.Provider value={{
      lang, setLang, role, setRole, user, loading, isOwner, theme, toggleTheme,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser, deleteAccount,
      customerProfile, setCustomerProfile, saveCustomerProfile,
      businessProfile, setBusinessProfile, saveBusinessProfile, retrySyncBusinessProfile: retrySyncBusinessProfile, syncPending,
      uploadPhoto,
      getToken, cancelToken, pauseToken, resumeToken, transferToken, markNoShow, setQueueDelay, assignTokenToStaff, rateToken, addWalkInCustomer,
      searchBusinesses, getBusinessById, getSalonTokens, getCustomerTokens, getCustomerFullHistory,
      allBusinesses,
      nextCustomer, toggleSalonOpen, toggleSalonBreak, toggleSalonStop, continueTokens,
      getBusinessFullStats,
      getBusinessTrialDaysLeft: getBusinessTrialDaysLeft, isBusinessTrialActive: isBusinessTrialActive, isBusinessSubscribed: isBusinessSubscribed,
      toggleQueuePause, updateTokenNotes, blockCustomer, unblockCustomer, updateBusinessServices,
      addReview, getSalonReviews, getTodayEarnings,
      sendMessage, useChatMessages,
      notifications, unreadCount, pushNotification, markNotificationRead, markAllNotificationsRead,
      toggleFavorite, isFavorite, getUserLocation, requestNotificationPermission,
      getCategoryInfo,
      t,
      awardLoyaltyPoints, updateDailyStreak, processReferral,
      // ── Legacy backward-compat aliases ──
      allSalons: allBusinesses,
      barberProfile: businessProfile,
      saveBarberProfile: saveBusinessProfile,
      getSalonById: getBusinessById,
      searchSalons: searchBusinesses,
      getBarberFullStats: getBusinessFullStats,
      isBarberTrialActive: isBusinessTrialActive,
      getBarberTrialDaysLeft: getBusinessTrialDaysLeft,
      isBarberSubscribed: isBusinessSubscribed,
    }}>
      {children}
    </AppContext.Provider>
  );
}
