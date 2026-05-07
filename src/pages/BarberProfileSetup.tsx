import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, ServiceItem, getCategoryInfo, BusinessCategory } from '../store/AppContext';
import BackButton from '../components/BackButton';
import LocationPicker from '../components/LocationPicker';
import { motion } from 'framer-motion';
import { getCategoryTheme } from '../config/categoryThemes';
import { useResponsive } from '../hooks/useResponsive';

const BEAUTY_NICHES = [
  {
    id: 'mens_salon',
    label: "Men's Salon",
    icon: '💈',
    services: [
      { id: '1', name: 'Hair Cut', price: 150, avgTime: 30 },
      { id: '2', name: 'Beard Trim', price: 100, avgTime: 20 },
    ],
  },
  {
    id: 'ladies_parlour',
    label: 'Beauty Parlour',
    icon: '💅',
    services: [
      { id: '1', name: 'Eyebrow Threading', price: 50, avgTime: 10 },
      { id: '2', name: 'Upper Lip Threading', price: 30, avgTime: 5 },
    ],
  },
  {
    id: 'unisex_salon',
    label: 'Unisex Salon',
    icon: '✂️',
    services: [
      { id: '1', name: 'Hair Cut', price: 200, avgTime: 30 },
      { id: '2', name: 'Facial', price: 800, avgTime: 60 },
    ],
  },
  {
    id: 'spa_center',
    label: 'Spa & Wellness',
    icon: '🧖',
    services: [
      { id: '1', name: 'Full Body Massage', price: 1500, avgTime: 60 },
      { id: '2', name: 'Reflexology', price: 800, avgTime: 45 },
    ],
  },
  {
    id: 'nail_studio',
    label: 'Nail Studio',
    icon: '💅',
    services: [
      { id: '1', name: 'Gel Nail Polish', price: 500, avgTime: 45 },
      { id: '2', name: 'Nail Extensions', price: 1500, avgTime: 90 },
      { id: '3', name: 'Nail Art', price: 100, avgTime: 15 },
    ],
  },
  {
    id: 'mehndi_artist',
    label: 'Mehndi Artist',
    icon: '🎨',
    services: [
      { id: '1', name: 'Bridal Mehndi', price: 3000, avgTime: 180 },
      { id: '2', name: 'Party Mehndi', price: 1000, avgTime: 90 },
      { id: '3', name: 'Arabic Design', price: 1500, avgTime: 120 },
    ],
  },
  {
    id: 'tattoo_studio',
    label: 'Tattoo Studio',
    icon: '🖊️',
    services: [
      { id: '1', name: 'Custom Tattoo', price: 5000, avgTime: 180 },
      { id: '2', name: 'Cover-up Tattoo', price: 6000, avgTime: 240 },
      { id: '3', name: 'Tattoo Removal Consultation', price: 500, avgTime: 30 },
    ],
  },
  {
    id: 'massage_therapy',
    label: 'Massage Therapy Center',
    icon: '💆',
    services: [
      { id: '1', name: 'Swedish Massage', price: 1500, avgTime: 60 },
      { id: '2', name: 'Deep Tissue Massage', price: 2000, avgTime: 75 },
      { id: '3', name: 'Aromatherapy', price: 1800, avgTime: 60 },
    ],
  },
  {
    id: 'acupuncture_clinic',
    label: 'Acupuncture Clinic',
    icon: '🩹',
    services: [
      { id: '1', name: 'Initial Consultation', price: 800, avgTime: 45 },
      { id: '2', name: 'Acupuncture Session', price: 1200, avgTime: 60 },
      { id: '3', name: 'Cupping Therapy', price: 1000, avgTime: 45 },
    ],
  },
  {
    id: 'makeup_artist',
    label: 'Makeup Artist',
    icon: '🖌️',
    services: [
      { id: '1', name: 'Bridal Makeup', price: 8000, avgTime: 120 },
      { id: '2', name: 'Party Makeup', price: 2000, avgTime: 60 },
      { id: '3', name: 'Airbrush Makeup', price: 3000, avgTime: 90 },
    ],
  },
  {
    id: 'bridal_studio',
    label: 'Bridal Studio',
    icon: '💍',
    services: [
      { id: '1', name: 'Bridal Package', price: 25000, avgTime: 480 },
      { id: '2', name: 'Pre-Bridal Facial', price: 2000, avgTime: 60 },
      { id: '3', name: 'Bridal Trial Makeup', price: 3000, avgTime: 90 },
    ],
  },
  {
    id: 'threading_waxing',
    label: 'Threading / Waxing Center',
    icon: '🪡',
    services: [
      { id: '1', name: 'Eyebrow Threading', price: 50, avgTime: 10 },
      { id: '2', name: 'Full Face Threading', price: 150, avgTime: 20 },
      { id: '3', name: 'Full Leg Waxing', price: 500, avgTime: 45 },
    ],
  },
  {
    id: 'skincare_clinic',
    label: 'Skin Care Clinic',
    icon: '🧴',
    services: [
      { id: '1', name: 'Facial Treatment', price: 1500, avgTime: 60 },
      { id: '2', name: 'Chemical Peel', price: 3000, avgTime: 45 },
      { id: '3', name: 'Laser Treatment', price: 5000, avgTime: 90 },
    ],
  },
  {
    id: 'hair_transplant',
    label: 'Hair Transplant Clinic',
    icon: '👨‍⚕️',
    services: [
      { id: '1', name: 'Initial Consultation', price: 500, avgTime: 45 },
      { id: '2', name: 'PRP Therapy', price: 5000, avgTime: 90 },
      { id: '3', name: 'FUE Grafts', price: 3000, avgTime: 120 },
    ],
  },
  {
    id: 'laser_studio',
    label: 'Laser Studio',
    icon: '⚡',
    services: [
      { id: '1', name: 'Laser Hair Removal', price: 2000, avgTime: 45 },
      { id: '2', name: 'Skin Rejuvenation', price: 3500, avgTime: 60 },
      { id: '3', name: 'Tattoo Removal', price: 4000, avgTime: 60 },
    ],
  },
  {
    id: 'ayurveda_beauty',
    label: 'Ayurveda Beauty Center',
    icon: '🌿',
    services: [
      { id: '1', name: 'Ayurvedic Facial', price: 1200, avgTime: 60 },
      { id: '2', name: 'Herbal Hair Treatment', price: 1500, avgTime: 75 },
      { id: '3', name: 'Body Massage', price: 2000, avgTime: 90 },
    ],
  },
  {
    id: 'slimming_studio',
    label: 'Slimming / Weight Loss Studio',
    icon: '⚖️',
    services: [
      { id: '1', name: 'Weight Loss Consultation', price: 1000, avgTime: 45 },
      { id: '2', name: 'Body Contouring', price: 3000, avgTime: 90 },
      { id: '3', name: 'Diet Planning', price: 1500, avgTime: 60 },
    ],
  },
  {
    id: 'home_salon',
    label: 'Home Salon Service',
    icon: '🏠',
    services: [
      { id: '1', name: 'Home Hair Cut', price: 300, avgTime: 45 },
      { id: '2', name: 'Home Facial', price: 1000, avgTime: 75 },
      { id: '3', name: 'Home Manicure', price: 600, avgTime: 60 },
    ],
  },
];

export default function BarberProfileSetup() {
  const { user, saveBusinessProfile, businessProfile, t } = useApp();
  const nav = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [businessType, setBusinessType] = useState<string>(businessProfile?.businessType || 'mens_salon');
  const [name, setName] = useState(businessProfile?.name || user?.displayName || '');
  const [businessName, setBusinessName] = useState(businessProfile?.businessName || '');
  const [location, setLocation] = useState(businessProfile?.location || '');
  const [phone, setPhone] = useState(businessProfile?.phone || '');
  const [services, setServices] = useState<ServiceItem[]>(businessProfile?.services || []);
  const [lat, setLat] = useState<number | undefined>(businessProfile?.lat);
  const [lng, setLng] = useState<number | undefined>(businessProfile?.lng);
  const [fetchingAddr, setFetchingAddr] = useState(false);

  // New step management
  const [step, setStep] = useState<'category' | 'details'>(
    businessProfile?.businessType ? 'details' : 'category'
  );

  const [newService, setNewService] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showAddService, setShowAddService] = useState(false);

  const nicheInfo = BEAUTY_NICHES.find(n => n.id === businessType) || BEAUTY_NICHES[0];
  const catTheme = getCategoryTheme(businessType as BusinessCategory);

  const selectCategory = (id: string) => {
    setBusinessType(id);
    const niche = BEAUTY_NICHES.find(n => n.id === id);
    if (niche) setServices(niche.services);
    setStep('details');
  };

  const addService = () => {
    if (!newService || !newPrice) return;
    setServices([...services, { id: Date.now().toString(), name: newService, price: Number(newPrice), avgTime: Number(newTime) || 30 }]);
    setNewService(''); setNewPrice(''); setNewTime(''); setShowAddService(false);
  };

  const removeService = (id: string) => setServices(services.filter(s => s.id !== id));

  const handleContinue = async () => {
    const profile: any = {
      uid: user?.uid || '',
      name: name || user?.displayName || 'Business Owner',
      businessName: businessName || nicheInfo.label,
      salonName: businessName || nicheInfo.label,
      businessType: businessType as BusinessCategory,
      location: location || '',
      phone: phone || '',
      photoURL: user?.photoURL || '',
      bannerImageURL: businessProfile?.bannerImageURL || '',
      salonImageURL: businessProfile?.bannerImageURL || '',
      services,
      isOpen: businessProfile?.isOpen ?? true,
      isBreak: businessProfile?.isBreak ?? false,
      isStopped: businessProfile?.isStopped ?? false,
      currentToken: businessProfile?.currentToken ?? 0,
      totalTokensToday: businessProfile?.totalTokensToday ?? 0,
      breakStartTime: businessProfile?.breakStartTime ?? null,
      createdAt: businessProfile?.createdAt || Date.now(),
      lat, lng,
    };
    await saveBusinessProfile(profile);
    nav('/barber/home', { replace: true });
  };

  const handleSkip = async () => {
    const profile: any = {
      uid: user?.uid || '',
      name: user?.displayName || 'Business Owner',
      businessName: nicheInfo.label,
      salonName: nicheInfo.label,
      businessType: businessType as BusinessCategory,
      location: '', phone: '',
      photoURL: user?.photoURL || '',
      bannerImageURL: '', salonImageURL: '',
      services: nicheInfo.services,
      isOpen: true, isBreak: false, isStopped: false,
      currentToken: 0, totalTokensToday: 0, breakStartTime: null,
      createdAt: Date.now(),
    };
    await saveBusinessProfile(profile);
    nav('/barber/home', { replace: true });
  };

  // ── Step 1: Choose Beauty Niche ──
  if (step === 'category') {
    const gridCols = isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4';
    const padding = isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-10';
    const maxWidth = isMobile ? 'max-w-lg' : isTablet ? 'max-w-3xl' : 'max-w-6xl';
    
    return (
      <div className="min-h-screen flex flex-col bg-bg pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#100010] via-bg to-bg px-6 pt-14 pb-10 text-center border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(108,99,255,0.08),transparent_70%)]" />
          <BackButton to="/barber/auth" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${isMobile ? 'w-20 h-20' : isTablet ? 'w-24 h-24' : 'w-28 h-28'} rounded-3xl mx-auto mb-4 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20 relative z-10 border border-white/10`}
          >
            <span className={`${isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'}`}>✨</span>
          </motion.div>
          <h1 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-black mb-2 relative z-10`}>Choose Your Blueprint</h1>
          <p className={`text-text-dim ${isMobile ? 'text-sm' : 'text-base'} max-w-xs mx-auto relative z-10 font-medium`}>Select your business type for a tailored interface.</p>
        </div>

        <div className={`${padding} grid ${gridCols} gap-4 ${maxWidth} mx-auto w-full`}>
          {BEAUTY_NICHES.map((niche, i) => (
            <motion.button
              key={niche.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => selectCategory(niche.id)}
              className="relative p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95 flex flex-col items-center gap-3 text-center group overflow-hidden"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all" />
              <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} group-hover:scale-110 transition-transform relative z-10`}>
                {niche.icon}
              </span>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-black text-text leading-tight relative z-10 uppercase tracking-wider`}>
                {niche.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Business Details ──
  const padding = isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-10';
  const maxWidth = isMobile ? 'max-w-sm' : isTablet ? 'max-w-md' : 'max-w-4xl';
  const avatarSize = isMobile ? 'w-24 h-24' : isTablet ? 'w-28 h-28' : 'w-32 h-32';
  
  return (
    <div className={`min-h-screen flex flex-col ${padding} pb-40 bg-bg animate-fadeIn`}>
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      <BackButton to="/barber/auth" />

      <div className="text-center mb-8 mt-2">
        <div 
          className={`${avatarSize} rounded-[2.5rem] mx-auto mb-4 flex items-center justify-center ring-4 ring-white/5 shadow-2xl bg-gradient-to-br from-primary/20 to-accent/10`}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} className={`${avatarSize} rounded-[2.5rem] object-cover`} alt="" />
          ) : (
            <span className={`${isMobile ? 'text-5xl' : 'text-6xl'} drop-shadow-xl`}>{nicheInfo.icon}</span>
          )}
        </div>
        <h1 className={`${isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl'} font-black tracking-tighter`}>{t('profile.setup')}</h1>
        <button
          onClick={() => setStep('category')}
          className="mt-3 text-[10px] uppercase tracking-widest text-text-dim font-black bg-white/5 px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {nicheInfo.icon} {nicheInfo.label} — Switch Blueprint
        </button>
      </div>

      <div className={`space-y-6 ${maxWidth} mx-auto w-full relative z-10`}>
        <div className="space-y-4">
          <div className="premium-input-group">
            <label className="premium-label">Identity</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="premium-input" style={{ minHeight: '44px' }} />
          </div>
          <div className="premium-input-group">
            <label className="premium-label">Empire Name</label>
            <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g., Stellar Studio" className="premium-input" style={{ minHeight: '44px' }} />
          </div>
          <div className="premium-input-group relative">
            <label className="premium-label">Location Headquarters</label>
            <input
              value={fetchingAddr ? 'Calculating Coordinates...' : location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Business Address"
              className={`premium-input ${fetchingAddr ? 'text-[#00F0FF] animate-pulse border-[#00F0FF]' : ''}`}
              disabled={fetchingAddr}
              style={{ minHeight: '44px' }}
            />
            {fetchingAddr && (
              <div className="absolute right-4 top-[38px]">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div>
           <label className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-3 block ml-1">Orbital Map Data</label>
           <div className="rounded-3xl overflow-hidden border border-white/5 shadow-inner">
             <LocationPicker
               lat={lat} lng={lng}
               onChange={(l, g) => { setLat(l); setLng(g); }}
               onAddressFound={(addr) => setLocation(addr)}
               isFetchingAddress={setFetchingAddr}
             />
           </div>
        </div>

        {/* Services */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-3 block ml-1">Service Arsenal</label>
          <div className="space-y-3">
            {services.map(s => (
              <motion.div layout key={s.id} className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-md rounded-2xl border border-white/5 group relative overflow-hidden" style={{ minHeight: '44px' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1 relative z-10">
                  <p className="font-bold text-sm tracking-tight">{s.name}</p>
                  <p className="text-text-dim text-[10px] font-black uppercase tracking-wider">₹{s.price} · {s.avgTime} MIN</p>
                </div>
                <button onClick={() => removeService(s.id)} className="text-rose-500/40 hover:text-rose-500 p-2 transition-colors relative z-10" style={{ minHeight: '44px', minWidth: '44px' }}>✕</button>
              </motion.div>
            ))}
          </div>

          {showAddService ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-5 bg-card rounded-[2rem] border border-primary/20 space-y-4 shadow-2xl shadow-primary/10">
              <input value={newService} onChange={e => setNewService(e.target.value)} placeholder="Service Title" className="input-field bg-bg/50 border-white/5" style={{ minHeight: '44px' }} />
              <div className="flex gap-3">
                <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price ₹" className="input-field bg-bg/50 border-white/5" type="number" style={{ minHeight: '44px' }} />
                <input value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="Min" className="input-field bg-bg/50 border-white/5" type="number" style={{ minHeight: '44px' }} />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={addService} className="gagan-btn flex-1 py-3" style={{ width: 'auto', height: 'auto', borderRadius: '12px', minHeight: '44px' }}>Add Service</button>
                <button onClick={() => setShowAddService(false)} className="px-4 py-3 rounded-xl bg-white/5 text-text-dim text-xs font-bold" style={{ minHeight: '44px', minWidth: '44px' }}>✕</button>
              </div>
            </motion.div>
          ) : (
            <button onClick={() => setShowAddService(true)} className="mt-4 w-full p-4 rounded-2xl border-2 border-dashed border-white/10 text-text-dim text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95" style={{ minHeight: '44px' }}>
              + Deploy New Service
            </button>
          )}
        </div>
      </div>

      <div className={`mt-12 space-y-4 ${maxWidth} mx-auto w-full relative z-20`}>
        <button
          onClick={handleContinue}
          className="khel-btn mt-4"
          style={{ minHeight: '44px' }}
        >
          Activate Core Dashboard →
        </button>
        <button onClick={handleSkip} className="w-full py-4 rounded-2xl text-text-dim text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors" style={{ minHeight: '44px' }}>
          Initialize with defaults
        </button>
      </div>
    </div>
  );
}
