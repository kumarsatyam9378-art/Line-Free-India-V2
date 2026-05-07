import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { motion } from 'framer-motion';

export default function CustomerFavourites() {
  const { allSalons, isFavorite } = useApp();
  const nav = useNavigate();

  const favoriteBusinesses = allSalons.filter(s => isFavorite(s.uid));

  return (
    <ResponsiveContainer variant="customer">
      <div className="h-full flex flex-col font-sans relative overflow-hidden bg-bg">
        {/* Header */}
        <div className="z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl safe-top">
          <div className="p-6 pb-4">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-center"
            >
              <div>
                <h1 className="text-3xl font-black text-text">
                  ❤️ Favourites
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mt-1">
                  {favoriteBusinesses.length} saved places
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 pb-32">
            {favoriteBusinesses.length === 0 ? (
              <div className="text-center py-16 bg-card/30 rounded-3xl border border-white/5">
                <span className="text-6xl block mb-4">💔</span>
                <h3 className="text-xl font-black text-text mb-2">No Favourites Yet</h3>
                <p className="text-sm text-text-dim mb-6">
                  Start adding your favorite businesses to see them here
                </p>
                <button 
                  onClick={() => nav('/customer/home')}
                  className="px-6 py-3 rounded-2xl bg-primary text-white font-bold"
                >
                  Explore Businesses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteBusinesses.map((business, index) => {
                  const catInfo = getCategoryInfo(business.businessType);
                  return (
                    <motion.button
                      key={business.uid}
                      onClick={() => nav(`/customer/salon/${business.uid}`)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full p-5 rounded-3xl bg-card border border-white/5 text-left flex items-start gap-4 hover:border-primary/40 transition-all active:scale-[0.98] shadow-xl"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-card-2 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10">
                        {business.bannerImageURL ? (
                          <img src={business.bannerImageURL} className="w-full h-full object-cover" alt="" />
                        ) : <span className="text-3xl">{catInfo.icon}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-text truncate">{business.businessName}</p>
                        <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-2">{catInfo.label}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {business.rating && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-gold">
                              ⭐ {business.rating}
                            </div>
                          )}
                          {business.location && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-text-dim">
                              📍 {business.location}
                            </div>
                          )}
                          {business.isOpen && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-success">
                              🟢 Open
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="self-center">
                        <div className="w-8 h-8 rounded-xl bg-card-2 border border-white/5 flex items-center justify-center text-text-dim">›</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </ResponsiveContainer>
  );
}
