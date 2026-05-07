import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import AdvancedSplashScreen from './components/AdvancedSplashScreen';
import TokenNotificationListener from './components/TokenNotificationListener';
import Sidebar from './components/Sidebar';
import { useTheme, getThemeMode } from './hooks/useTheme';

// ─── Lazy-loaded Pages ───
const LanguageSelect = lazy(() => import('./pages/LanguageSelect'));
const ThemeSelect = lazy(() => import('./pages/ThemeSelect'));
const RoleSelect = lazy(() => import('./pages/RoleSelect'));
const PremiumAnimatedAuth = lazy(() => import('./pages/PremiumAnimatedAuth'));
const CustomerProfileSetup = lazy(() => import('./pages/CustomerProfileSetup'));
const BarberProfileSetup = lazy(() => import('./pages/BarberProfileSetup'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SecretAdminPanel = lazy(() => import('./pages/SecretAdminPanel'));
const GetMyUID = lazy(() => import('./pages/GetMyUID'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SalonQRPage = lazy(() => import('./pages/SalonQRPage'));
const QRScanLanding = lazy(() => import('./pages/QRScanLanding'));

// ─── Customer Discovery ───
const CommunityBoard = lazy(() => import('./pages/CommunityBoard'));
const SupportChat = lazy(() => import('./pages/SupportChat'));
const ReferralPage = lazy(() => import('./pages/ReferralPage'));
const CustomerHome = lazy(() => import('./pages/CustomerHome'));
const CustomerSearch = lazy(() => import('./pages/CustomerSearch'));
const SalonDetail = lazy(() => import('./pages/SalonDetail'));
const SalonDetailSimple = lazy(() => import('./pages/SalonDetailSimple'));
const CustomerTokens = lazy(() => import('./pages/CustomerTokens'));
const CustomerProfileEdit = lazy(() => import('./pages/CustomerProfileEdit'));
const CustomerSubscription = lazy(() => import('./pages/CustomerSubscription'));
const CustomerHairstyles = lazy(() => import('./pages/CustomerHairstyles'));
const CustomerTryOn = lazy(() => import('./pages/CustomerTryOn'));
const CustomerHistory = lazy(() => import('./pages/CustomerHistory'));
const LoyaltyPage = lazy(() => import('./pages/LoyaltyPage'));
const CustomerLoyalty = lazy(() => import('./pages/CustomerLoyalty'));
const CustomerFavourites = lazy(() => import('./pages/CustomerFavourites'));
const CustomerChat = lazy(() => import('./pages/CustomerChat'));
const ConsultationRoom = lazy(() => import('./pages/ConsultationRoom'));
const CartPage = lazy(() => import('./pages/CartPage'));
const BusinessCompare = lazy(() => import('./pages/BusinessCompare'));

// ─── Business / Partner Dashboard ───
const BarberHome = lazy(() => import('./pages/BarberHome'));
const BarberDashboard = lazy(() => import('./pages/BarberDashboard'));
const BarberProfile = lazy(() => import('./pages/BarberProfile'));
const BarberCustomers = lazy(() => import('./pages/BarberCustomers'));
const BarberAnalytics = lazy(() => import('./pages/BarberAnalytics'));
const BarberMessages = lazy(() => import('./pages/BarberMessages'));
const BarberSubscription = lazy(() => import('./pages/BarberSubscription'));

// ─── Business Tools (Beauty-Relevant) ───
const TherapistCalendar = lazy(() => import('./pages/TherapistCalendar'));
const DesignGalleryManager = lazy(() => import('./pages/DesignGalleryManager'));
const UniversalStaffManager = lazy(() => import('./pages/UniversalStaffManager'));
const DynamicTaxSettings = lazy(() => import('./pages/DynamicTaxSettings'));
const InventoryLowAlerts = lazy(() => import('./pages/InventoryLowAlerts'));
const MembershipRenewalBot = lazy(() => import('./pages/MembershipRenewalBot'));
const SmartInventory = lazy(() => import('./pages/SmartInventory'));
const BridalPackageBuilder = lazy(() => import('./pages/BridalPackageBuilder'));
const DigitalConsentForm = lazy(() => import('./pages/DigitalConsentForm'));
const UniversalFeedbackLoop = lazy(() => import('./pages/UniversalFeedbackLoop'));
const UniversalReferralEngine = lazy(() => import('./pages/UniversalReferralEngine'));
const DynamicPricing = lazy(() => import('./pages/DynamicPricing'));
const CouponManager = lazy(() => import('./pages/CouponManager'));
const AppointmentReminders = lazy(() => import('./pages/AppointmentReminders'));
const BookingCalendar = lazy(() => import('./pages/BookingCalendar'));
const InvoiceGenerator = lazy(() => import('./pages/InvoiceGenerator'));
const ExpenseTracker = lazy(() => import('./pages/ExpenseTracker'));
const CashRegister = lazy(() => import('./pages/CashRegister'));
const StaffPayroll = lazy(() => import('./pages/StaffPayroll'));
const StaffAttendance = lazy(() => import('./pages/StaffAttendance'));
const ProductRetailPOS = lazy(() => import('./pages/ProductRetailPOS'));
const WhatsAppCRM = lazy(() => import('./pages/WhatsAppCRM'));
const CustomerCRM = lazy(() => import('./pages/CustomerCRM'));
const CustomerInsights = lazy(() => import('./pages/CustomerInsights'));
const SellProducts = lazy(() => import('./pages/SellProducts'));
const LeadManager = lazy(() => import('./pages/LeadManager'));
const MembershipDashboard = lazy(() => import('./pages/MembershipDashboard'));
const GroomingChecklist = lazy(() => import('./pages/GroomingChecklist'));
const SmartNotifications = lazy(() => import('./pages/SmartNotifications'));
const LoyaltyProgramManager = lazy(() => import('./pages/LoyaltyProgramManager'));
const TaskManager = lazy(() => import('./pages/TaskManager'));
const ShiftPlanner = lazy(() => import('./pages/ShiftPlanner'));
const BusinessAnalyticsPro = lazy(() => import('./pages/BusinessAnalyticsPro'));
const ReferralProgram = lazy(() => import('./pages/ReferralProgram'));
const DailyReportDashboard = lazy(() => import('./pages/DailyReportDashboard'));
const DailyReportGenerator = lazy(() => import('./pages/DailyReportGenerator'));
const CustomerFeedback = lazy(() => import('./pages/CustomerFeedback'));
const ContractManager = lazy(() => import('./pages/ContractManager'));
const SubscriptionManager = lazy(() => import('./pages/SubscriptionManager'));
const BirthdayReminder = lazy(() => import('./pages/BirthdayReminder'));
const MembershipCard = lazy(() => import('./pages/MembershipCard'));
const HairstyleTryOn = lazy(() => import('./pages/HairstyleTryOn'));
const SalonProductCatalog = lazy(() => import('./pages/SalonProductCatalog'));
const FranchiseAuth = lazy(() => import('./pages/FranchiseAuth'));
const FranchiseDashboard = lazy(() => import('./pages/FranchiseDashboard'));
const FranchiseManager = lazy(() => import('./pages/FranchiseManager'));
const MarketingDashboard = lazy(() => import('./pages/MarketingDashboard'));
const TechnicianTracker = lazy(() => import('./pages/TechnicianTracker'));
const ToolsGridPage = lazy(() => import('./pages/ToolsGridPage'));
const TVDashboard = lazy(() => import('./pages/TVDashboard'));
const MenuEditor = lazy(() => import('./pages/MenuEditor'));
const RevenueOps = lazy(() => import('./pages/RevenueOps'));

// ─── Beauty Niche Pages ───
const MassageTherapy = lazy(() => import('./pages/MassageTherapy'));
const MehndiArtist = lazy(() => import('./pages/MehndiArtist'));
const TattooStudio = lazy(() => import('./pages/TattooStudio'));
const SpaWellness = lazy(() => import('./pages/SpaWellness'));
const AcupunctureClinic = lazy(() => import('./pages/AcupunctureClinic'));
const AyurvedicCenter = lazy(() => import('./pages/AyurvedicCenter'));
const AyurvedaClinic = lazy(() => import('./pages/AyurvedaClinic'));

// ─── NEW: Sprint 1-8 Feature Pages ───
const Achievements = lazy(() => import('./pages/Achievements'));
const RewardsCenter = lazy(() => import('./pages/RewardsCenter'));
const Wallet = lazy(() => import('./pages/Wallet'));
const GiftCards = lazy(() => import('./pages/GiftCards'));

const OWNER_EMAIL = 'satyamkumar56021@gmail.com';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.email !== OWNER_EMAIL) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole: 'customer' | 'business' }) {
  const { user, role, loading } = useApp();
  if (loading) return (<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-bg)"}}>
      <div style={{width:24,height:24,border:"2.5px solid var(--color-border)",borderTopColor:"var(--color-primary)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    </div>);
  if (!user) {
    if (requiredRole === 'customer') return <Navigate to="/customer/auth" replace />;
    if (requiredRole === 'business') return <Navigate to="/barber/auth" replace />;
    return <Navigate to="/" replace />;
  }
  if (role !== requiredRole) return <Navigate to="/role" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { loading } = useApp();
  const location = useLocation();
  
  // Apply theme globally
  const [themeMode, setThemeMode] = useState(getThemeMode());
  useTheme(undefined, themeMode);
  
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeMode(getThemeMode());
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  if (loading) return (<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-bg)"}}>
      <div style={{width:24,height:24,border:"2.5px solid var(--color-border)",borderTopColor:"var(--color-primary)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    </div>);

  const isBusinessRoute = location.pathname.startsWith('/barber') ||
    location.pathname.startsWith('/franchise') ||
    location.pathname.startsWith('/beauty');

  return (
    <div className={isBusinessRoute ? 'business-layout scroll-viewport' : 'scroll-viewport'}>
      <Sidebar />
      <PageTransition>
        <Suspense fallback={
          <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-bg)"}}><div style={{width:24,height:24,border:"2.5px solid var(--color-border)",borderTopColor:"var(--color-primary)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/></div>
        }>
          <Routes>
            <Route path="/" element={<LanguageSelect />} />
            <Route path="/theme" element={<ThemeSelect />} />
            <Route path="/role" element={<RoleSelect />} />

          <Route path="/customer/community/:id" element={<CommunityBoard />} />
          <Route path="/customer/support" element={<SupportChat />} />
          <Route path="/customer/refer" element={<ReferralPage />} />
          <Route path="/customer/auth" element={<PremiumAnimatedAuth mode="customer" />} />
          <Route path="/barber/auth" element={<PremiumAnimatedAuth mode="business" />} />
          <Route path="/customer/setup" element={<CustomerProfileSetup />} />
          <Route path="/barber/setup" element={<BarberProfileSetup />} />
          <Route path="/salon/:id/qr" element={<SalonQRPage />} />
          <Route path="/qr/:id" element={<QRScanLanding />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          
          {/* 🔐 Secret Admin Panel - Hidden Route */}
          <Route path="/secret-admin-x9z2k" element={<SecretAdminPanel />} />
          
          {/* 🔑 Get My UID Helper */}
          <Route path="/get-my-uid" element={<GetMyUID />} />

          {/* ═══ Customer Side ═══ */}
          <Route path="/customer/home" element={<AuthGuard requiredRole="customer"><CustomerHome /></AuthGuard>} />
          <Route path="/customer/search" element={<AuthGuard requiredRole="customer"><CustomerSearch /></AuthGuard>} />
          <Route path="/customer/salon/:id" element={<AuthGuard requiredRole="customer"><SalonDetail /></AuthGuard>} />
          <Route path="/customer/tokens" element={<AuthGuard requiredRole="customer"><CustomerTokens /></AuthGuard>} />
          <Route path="/customer/profile" element={<AuthGuard requiredRole="customer"><CustomerProfileEdit /></AuthGuard>} />
          <Route path="/customer/subscription" element={<AuthGuard requiredRole="customer"><CustomerSubscription /></AuthGuard>} />
          <Route path="/customer/hairstyles" element={<AuthGuard requiredRole="customer"><CustomerHairstyles /></AuthGuard>} />
          <Route path="/customer/try-on" element={<AuthGuard requiredRole="customer"><CustomerTryOn /></AuthGuard>} />
          <Route path="/customer/history" element={<AuthGuard requiredRole="customer"><CustomerHistory /></AuthGuard>} />
          <Route path="/customer/loyalty" element={<AuthGuard requiredRole="customer"><LoyaltyPage /></AuthGuard>} />
          <Route path="/customer/loyalty/:businessId" element={<AuthGuard requiredRole="customer"><CustomerLoyalty /></AuthGuard>} />
          <Route path="/customer/favourites" element={<AuthGuard requiredRole="customer"><CustomerFavourites /></AuthGuard>} />
          <Route path="/customer/chat/:salonId" element={<AuthGuard requiredRole="customer"><CustomerChat /></AuthGuard>} />
          <Route path="/customer/notifications" element={<AuthGuard requiredRole="customer"><NotificationsPage /></AuthGuard>} />
          <Route path="/customer/consultation/:id" element={<AuthGuard requiredRole="customer"><ConsultationRoom /></AuthGuard>} />
          <Route path="/customer/cart" element={<AuthGuard requiredRole="customer"><CartPage /></AuthGuard>} />
          {/* <Route path="/customer/pets" element={<AuthGuard requiredRole="customer"><CustomerPets /></AuthGuard>} /> */}
          <Route path="/customer/achievements" element={<AuthGuard requiredRole="customer"><Achievements /></AuthGuard>} />
          <Route path="/customer/rewards" element={<AuthGuard requiredRole="customer"><RewardsCenter /></AuthGuard>} />
          <Route path="/customer/wallet" element={<AuthGuard requiredRole="customer"><Wallet /></AuthGuard>} />
          <Route path="/customer/gift-cards" element={<AuthGuard requiredRole="customer"><GiftCards /></AuthGuard>} />
          <Route path="/customer/compare" element={<AuthGuard requiredRole="customer"><BusinessCompare /></AuthGuard>} />

          {/* ═══ Business / Partner Side ═══ */}
          <Route path="/barber/home" element={<AuthGuard requiredRole="business"><BarberHome /></AuthGuard>} />
          <Route path="/barber/dashboard" element={<AuthGuard requiredRole="business"><BarberDashboard /></AuthGuard>} />
          <Route path="/barber/profile" element={<AuthGuard requiredRole="business"><BarberProfile /></AuthGuard>} />
          <Route path="/barber/customers" element={<AuthGuard requiredRole="business"><BarberCustomers /></AuthGuard>} />
          <Route path="/barber/analytics" element={<AuthGuard requiredRole="business"><BarberAnalytics /></AuthGuard>} />
          <Route path="/barber/subscription" element={<AuthGuard requiredRole="business"><BarberSubscription /></AuthGuard>} />
          <Route path="/barber/messages" element={<AuthGuard requiredRole="business"><BarberMessages /></AuthGuard>} />
          <Route path="/barber/notifications" element={<AuthGuard requiredRole="business"><NotificationsPage /></AuthGuard>} />
          <Route path="/barber/qr" element={<AuthGuard requiredRole="business"><SalonQRPage id="own" /></AuthGuard>} />

          {/* ═══ Business Tools (Beauty OS) ═══ */}
          <Route path="/barber/therapist-calendar" element={<AuthGuard requiredRole="business"><TherapistCalendar /></AuthGuard>} />
          <Route path="/barber/gallery" element={<AuthGuard requiredRole="business"><DesignGalleryManager /></AuthGuard>} />
          <Route path="/barber/staff" element={<AuthGuard requiredRole="business"><UniversalStaffManager /></AuthGuard>} />
          <Route path="/barber/tax" element={<AuthGuard requiredRole="business"><DynamicTaxSettings /></AuthGuard>} />
          <Route path="/barber/inventory-alerts" element={<AuthGuard requiredRole="business"><InventoryLowAlerts /></AuthGuard>} />
          <Route path="/barber/membership-bot" element={<AuthGuard requiredRole="business"><MembershipRenewalBot /></AuthGuard>} />
          <Route path="/barber/inventory" element={<AuthGuard requiredRole="business"><SmartInventory /></AuthGuard>} />
          <Route path="/barber/bridal-packages" element={<AuthGuard requiredRole="business"><BridalPackageBuilder /></AuthGuard>} />
          <Route path="/barber/consent-forms" element={<AuthGuard requiredRole="business"><DigitalConsentForm /></AuthGuard>} />
          <Route path="/barber/feedback" element={<AuthGuard requiredRole="business"><UniversalFeedbackLoop /></AuthGuard>} />
          <Route path="/barber/referrals" element={<AuthGuard requiredRole="business"><UniversalReferralEngine /></AuthGuard>} />
          <Route path="/barber/pricing" element={<AuthGuard requiredRole="business"><DynamicPricing /></AuthGuard>} />
          <Route path="/barber/coupons" element={<AuthGuard requiredRole="business"><CouponManager /></AuthGuard>} />
          <Route path="/barber/reminders" element={<AuthGuard requiredRole="business"><AppointmentReminders /></AuthGuard>} />
          <Route path="/barber/calendar" element={<AuthGuard requiredRole="business"><BookingCalendar /></AuthGuard>} />
          <Route path="/barber/invoices" element={<AuthGuard requiredRole="business"><InvoiceGenerator /></AuthGuard>} />
          <Route path="/barber/expenses" element={<AuthGuard requiredRole="business"><ExpenseTracker /></AuthGuard>} />
          <Route path="/barber/cash-register" element={<AuthGuard requiredRole="business"><CashRegister /></AuthGuard>} />
          <Route path="/barber/payroll" element={<AuthGuard requiredRole="business"><StaffPayroll /></AuthGuard>} />
          <Route path="/barber/attendance" element={<AuthGuard requiredRole="business"><StaffAttendance /></AuthGuard>} />
          <Route path="/barber/pos" element={<AuthGuard requiredRole="business"><ProductRetailPOS /></AuthGuard>} />
          <Route path="/barber/whatsapp" element={<AuthGuard requiredRole="business"><WhatsAppCRM /></AuthGuard>} />
          <Route path="/barber/crm" element={<AuthGuard requiredRole="business"><CustomerCRM /></AuthGuard>} />
          <Route path="/barber/customer-insights" element={<AuthGuard requiredRole="business"><CustomerInsights /></AuthGuard>} />
          <Route path="/barber/sell-products" element={<AuthGuard requiredRole="business"><SellProducts /></AuthGuard>} />
          <Route path="/barber/leads" element={<AuthGuard requiredRole="business"><LeadManager /></AuthGuard>} />
          <Route path="/barber/memberships" element={<AuthGuard requiredRole="business"><MembershipDashboard /></AuthGuard>} />
          <Route path="/barber/grooming-checklist" element={<AuthGuard requiredRole="business"><GroomingChecklist /></AuthGuard>} />
          <Route path="/barber/smart-notifications" element={<AuthGuard requiredRole="business"><SmartNotifications /></AuthGuard>} />
          <Route path="/barber/loyalty-program" element={<AuthGuard requiredRole="business"><LoyaltyProgramManager /></AuthGuard>} />
          <Route path="/barber/tasks" element={<AuthGuard requiredRole="business"><TaskManager /></AuthGuard>} />
          <Route path="/barber/shifts" element={<AuthGuard requiredRole="business"><ShiftPlanner /></AuthGuard>} />
          <Route path="/barber/analytics-pro" element={<AuthGuard requiredRole="business"><BusinessAnalyticsPro /></AuthGuard>} />
          <Route path="/barber/referral-program" element={<AuthGuard requiredRole="business"><ReferralProgram /></AuthGuard>} />
          <Route path="/barber/daily-report" element={<AuthGuard requiredRole="business"><DailyReportDashboard /></AuthGuard>} />
          <Route path="/barber/reports" element={<AuthGuard requiredRole="business"><DailyReportDashboard /></AuthGuard>} />
          <Route path="/barber/tools" element={<AuthGuard requiredRole="business"><ToolsGridPage /></AuthGuard>} />
          <Route path="/barber/report-gen" element={<AuthGuard requiredRole="business"><DailyReportGenerator /></AuthGuard>} />
          <Route path="/barber/customer-feedback" element={<AuthGuard requiredRole="business"><CustomerFeedback /></AuthGuard>} />
          <Route path="/barber/contracts" element={<AuthGuard requiredRole="business"><ContractManager /></AuthGuard>} />
          <Route path="/barber/subscription-mgr" element={<AuthGuard requiredRole="business"><SubscriptionManager /></AuthGuard>} />
          <Route path="/barber/birthdays" element={<AuthGuard requiredRole="business"><BirthdayReminder /></AuthGuard>} />
          <Route path="/barber/membership-card" element={<AuthGuard requiredRole="business"><MembershipCard /></AuthGuard>} />
          <Route path="/barber/hairstyle-tryon" element={<AuthGuard requiredRole="business"><HairstyleTryOn /></AuthGuard>} />
          <Route path="/barber/products" element={<AuthGuard requiredRole="business"><SalonProductCatalog /></AuthGuard>} />
          <Route path="/barber/marketing" element={<AuthGuard requiredRole="business"><MarketingDashboard /></AuthGuard>} />
          <Route path="/barber/technician-tracker" element={<AuthGuard requiredRole="business"><TechnicianTracker /></AuthGuard>} />
          <Route path="/barber/tv-dashboard" element={<AuthGuard requiredRole="business"><TVDashboard /></AuthGuard>} />
          <Route path="/barber/menu-editor" element={<AuthGuard requiredRole="business"><MenuEditor /></AuthGuard>} />
          <Route path="/barber/revenue-ops" element={<AuthGuard requiredRole="business"><RevenueOps /></AuthGuard>} />

          {/* ═══ Franchise ═══ */}
          <Route path="/franchise/auth" element={<FranchiseAuth />} />
          <Route path="/franchise/dashboard" element={<AuthGuard requiredRole="business"><FranchiseDashboard /></AuthGuard>} />
          <Route path="/franchise/manager" element={<AuthGuard requiredRole="business"><FranchiseManager /></AuthGuard>} />

          {/* ═══ Beauty Niche Pages ═══ */}
          <Route path="/beauty/massage" element={<AuthGuard requiredRole="business"><MassageTherapy /></AuthGuard>} />
          <Route path="/beauty/mehndi" element={<AuthGuard requiredRole="business"><MehndiArtist /></AuthGuard>} />
          <Route path="/beauty/tattoo" element={<AuthGuard requiredRole="business"><TattooStudio /></AuthGuard>} />
          <Route path="/beauty/spa" element={<AuthGuard requiredRole="business"><SpaWellness /></AuthGuard>} />
          <Route path="/beauty/acupuncture" element={<AuthGuard requiredRole="business"><AcupunctureClinic /></AuthGuard>} />
          <Route path="/beauty/ayurveda" element={<AuthGuard requiredRole="business"><AyurvedicCenter /></AuthGuard>} />
          <Route path="/beauty/ayurveda-clinic" element={<AuthGuard requiredRole="business"><AyurvedaClinic /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </PageTransition>
    </div>
  );
}

export default function App() {
  // Check if user has seen splash before (localStorage)
  const hasSeenSplash = localStorage.getItem('lf_splash_seen') === 'true';
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  const handleSplashComplete = () => {
    // Mark splash as seen in localStorage
    localStorage.setItem('lf_splash_seen', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <AdvancedSplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <TokenNotificationListener />
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
