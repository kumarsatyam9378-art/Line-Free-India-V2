import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, BusinessProfile, ServiceItem, getCategoryInfo } from '../store/AppContext';

export default function SalonDetailSimple() {
  const { id } = useParams<{ id: string }>();
  const { getBusinessById, allSalons, isFavorite, toggleFavorite } = useApp();
  const nav = useNavigate();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about' | 'gallery'>('services');

  useEffect(() => {
    if (id) {
      const found = allSalons.find(s => s.uid === id);
      if (found) {
        setBusiness(found as BusinessProfile);
        setLoading(false);
      } else {
        getBusinessById(id).then(s => {
          setBusiness(s as BusinessProfile);
          setLoading(false);
        });
      }
    }
  }, [id, allSalons]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen p-6 bg-bg">
        <button onClick={() => nav(-1)} className="mb-4 text-text-dim">← Back</button>
        <div className="text-center py-20">
          <span className="text-5xl block mb-3">😔</span>
          <p className="text-text-dim">Business not found</p>
        </div>
      </div>
    );
  }

  const catInfo = getCategoryInfo(business.businessType);
  const isLive = business.isOpen && !business.isBreak && !business.isStopped;

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Hero Image */}
      <div className="relative w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20">
        {business.bannerImageURL || business.photoURL ? (
          <img 
            src={business.bannerImageURL || business.photoURL} 
            alt={business.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            {catInfo.icon}
          </div>
        )}
        
        {/* Back Button */}
        <button
          onClick={() => nav(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"
        >
          ←
        </button>
      </div>

      {/* Business Header */}
      <div className="px-6 py-4 bg-bg border-b border-white/5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-2xl font-black text-text mb-1 flex items-center gap-2">
              {business.businessName}
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded flex items-center gap-1">
                <span className="text-xs">✓</span> Verified
              </span>
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-card border border-white/5 text-text text-sm font-bold flex items-center justify-center gap-2">
            <span>🔗</span> Share
          </button>
          <button className="flex-1 py-3 rounded-xl bg-card border border-white/5 text-text text-sm font-bold flex items-center justify-center gap-2">
            <span>💬</span> Message
          </button>
          <button
            onClick={() => toggleFavorite(business.uid)}
            className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>{business.rating || '4.8'}</span> <span>❤️</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-bg sticky top-0 z-10">
        {(['services', 'reviews', 'about', 'gallery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-dim'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {business.services && business.services.length > 0 ? (
              business.services.map((service: ServiceItem) => (
                <div key={service.id} className="bg-card rounded-2xl border border-white/5 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-text mb-1">{service.name}</h3>
                      <p className="text-xs text-text-dim mb-2">~{service.avgTime} MIN</p>
                      <p className="text-sm text-text-dim">{service.description || 'Therapeutic massage focusing on deeper layers of muscle and connective tissue to release chronic tension.'}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-black text-primary">₹{service.price}</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">
                    Book
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-text-dim">
                <span className="text-4xl block mb-2">📋</span>
                <p>No services available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12 text-text-dim">
            <span className="text-4xl block mb-2">⭐</span>
            <p>No reviews yet</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            {business.location && (
              <div>
                <p className="text-xs font-bold text-text-dim uppercase mb-2">Location</p>
                <p className="text-sm text-text">{business.location}</p>
              </div>
            )}
            {business.phone && (
              <div>
                <p className="text-xs font-bold text-text-dim uppercase mb-2">Phone</p>
                <p className="text-sm text-text">{business.phone}</p>
              </div>
            )}
            {business.businessHours && (
              <div>
                <p className="text-xs font-bold text-text-dim uppercase mb-2">Hours</p>
                <p className="text-sm text-text">{business.businessHours}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="text-center py-12 text-text-dim">
            <span className="text-4xl block mb-2">🖼️</span>
            <p>No gallery images</p>
          </div>
        )}
      </div>

      {/* Community Board Section */}
      <div className="px-6 pb-6">
        <button className="w-full bg-card rounded-2xl border border-white/5 p-4 text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💬</span>
            <h3 className="text-base font-bold text-text">Community Board</h3>
          </div>
          <p className="text-xs text-text-dim">Ask about wait times and help others, clear concise live</p>
        </button>
      </div>

      {/* Live Occupancy */}
      <div className="px-6 pb-6">
        <button className="w-full bg-card rounded-2xl border border-white/5 p-4 text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <h3 className="text-base font-bold text-text">Live Occupancy</h3>
              <p className="text-xs text-text-dim">Ask at start wait times, and help others, clear concise live</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-bold text-success">LIVE</span>
          </div>
        </button>
      </div>
    </div>
  );
}
