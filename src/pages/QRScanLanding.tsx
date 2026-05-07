import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, BusinessProfile, getCategoryInfo } from '../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../utils/haptics';

export default function QRScanLanding() {
  const { id } = useParams<{ id: string }>();
  const { 
    user, 
    getBusinessById, 
    toggleFavorite, 
    isFavorite,
    signInWithEmail,
    signUpWithEmail,
    customerProfile
  } = useApp();
  const nav = useNavigate();
  
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavoritePopup, setShowFavoritePopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (id) {
      getBusinessById(id).then(b => {
        setBusiness(b as BusinessProfile);
        setLoading(false);
        
        // If user is not logged in, show auth modal
        if (!user) {
          setTimeout(() => setShowAuthModal(true), 500);
        } else {
          // If user is logged in, show favorite popup
          setTimeout(() => setShowFavoritePopup(true), 500);
        }
      });
    }
  }, [id, user]);

  const handleAuth = async () => {
    if (!email || !password) {
      setAuthError('Please enter email and password');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      
      setShowAuthModal(false);
      setTimeout(() => setShowFavoritePopup(true), 500);
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddToFavorite = () => {
    if (business) {
      toggleFavorite(business.uid);
      triggerHaptic('success');
      setShowFavoritePopup(false);
      // Navigate to business profile after 500ms
      setTimeout(() => {
        nav(`/customer/salon/${business.uid}`);
      }, 500);
    }
  };

  const handleLater = () => {
    setShowFavoritePopup(false);
    if (business) {
      nav(`/customer/salon/${business.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-6">
        <div className="text-center">
          <span className="text-6xl block mb-4">😔</span>
          <p className="text-text-dim">Business not found</p>
        </div>
      </div>
    );
  }

  const catInfo = getCategoryInfo(business.businessType);

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          {/* Business Card */}
          <div className="bg-card rounded-3xl p-6 border border-white/10 shadow-2xl mb-6">
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4">
              {business.bannerImageURL ? (
                <img src={business.bannerImageURL} className="w-full h-full object-cover" alt={business.businessName} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-7xl">{catInfo.icon}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-black text-text mb-2">{business.businessName}</h1>
            <p className="text-sm text-primary font-bold mb-4">{catInfo.label}</p>
            
            {business.location && (
              <p className="text-xs text-text-dim mb-2">📍 {business.location}</p>
            )}
            
            {business.rating && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gold text-lg">⭐</span>
                <span className="text-sm font-bold text-gold">{business.rating}</span>
                <span className="text-xs text-text-dim">({business.totalReviews} reviews)</span>
              </div>
            )}

            {business.bio && (
              <p className="text-sm text-text-dim italic border-l-2 border-primary/50 pl-3 py-2">
                "{business.bio}"
              </p>
            )}
          </div>

          {/* CTA Button */}
          {user && (
            <button
              onClick={() => nav(`/customer/salon/${business.uid}`)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-lg shadow-xl active:scale-95 transition-all"
            >
              Explore Business →
            </button>
          )}
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-6 max-w-sm w-full border border-white/10"
            >
              <h2 className="text-2xl font-black text-text mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-text-dim mb-6">
                {isSignUp ? 'Sign up to continue' : 'Sign in to continue'}
              </p>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20">
                  <p className="text-xs text-danger">{authError}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card-2 border border-white/10 text-text placeholder:text-text-dim focus:outline-none focus:border-primary"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card-2 border border-white/10 text-text placeholder:text-text-dim focus:outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={handleAuth}
                disabled={authLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold mb-4 disabled:opacity-50"
              >
                {authLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>

              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-sm text-primary font-bold"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorite Popup */}
      <AnimatePresence>
        {showFavoritePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card rounded-3xl p-6 max-w-sm w-full border border-white/10"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-5xl mx-auto mb-4">
                  ❤️
                </div>
                <h3 className="text-xl font-black text-text mb-2">Add to Favorites?</h3>
                <p className="text-sm text-text-dim">
                  Save {business.businessName} to your favorites for quick access
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLater}
                  className="flex-1 py-3 rounded-2xl bg-card-2 border border-white/5 text-text font-bold"
                >
                  Later
                </button>
                <button
                  onClick={handleAddToFavorite}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold"
                >
                  Add to Favorites
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
