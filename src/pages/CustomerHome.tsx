import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo, BUSINESS_CATEGORIES } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getBusinessImageWithFallback } from '../utils/categoryImages';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function CustomerHome() {
  const { allSalons, customerProfile, isFavorite, toggleFavorite, getUserLocation } = useApp();
  const nav = useNavigate();
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    getUserLocation().then(loc => { if (loc) setUserLoc(loc); });
  }, []);

  const getFilteredBusinesses = () => {
    let filtered = allSalons.map(b => ({
      ...b,
      distance: (userLoc && b.lat && b.lng)
        ? getDistanceKm(userLoc.lat, userLoc.lng, b.lat, b.lng)
        : undefined,
    }));
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.businessType === selectedCategory);
    }
    filtered.sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
    return filtered;
  };

  const businesses = getFilteredBusinesses();

  // ─── Styles ───────────────────────────────────────────────────
  const s = {
    page: {
      height: '100%', display: 'flex', flexDirection: 'column' as const,
      background: 'var(--color-bg)',
    },
    header: {
      background: 'var(--color-card)',
      padding: '52px 16px 12px',
      borderBottom: '1px solid var(--color-separator)',
    },
    greeting: { fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 2 },
    name: { fontSize: 22, fontWeight: 700, color: 'var(--color-text)', letterSpacing: -0.5 },
    avatar: {
      width: 38, height: 38, borderRadius: '50%',
      objectFit: 'cover' as const,
      background: 'var(--color-card-2)',
    },
    searchBar: {
      margin: '12px 0 0',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: 'var(--color-bg)',
      borderRadius: 12,
      cursor: 'pointer',
    },
    searchText: { fontSize: 15, color: 'var(--color-text-muted)', flex: 1 },
    scroll: { flex: 1, overflowY: 'auto' as const, paddingBottom: 90 },
    sectionLabel: {
      fontSize: 13, fontWeight: 600, color: 'var(--color-text-dim)',
      padding: '20px 16px 10px',
      letterSpacing: -0.1,
    },
    categoryRow: {
      display: 'flex', gap: 8, overflowX: 'auto' as const,
      padding: '0 16px 12px',
      scrollbarWidth: 'none' as const,
    },
    catPill: (active: boolean) => ({
      flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 14px',
      borderRadius: 100,
      fontSize: 13, fontWeight: 500,
      background: active ? 'var(--color-primary)' : 'var(--color-card)',
      color: active ? '#fff' : 'var(--color-text)',
      border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
      cursor: 'pointer', whiteSpace: 'nowrap' as const,
      transition: 'all 0.15s',
    }),
    bizCard: {
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--color-card)',
      padding: '14px 16px',
      borderBottom: '1px solid var(--color-separator)',
      cursor: 'pointer', textAlign: 'left' as const,
      width: '100%',
    },
    bizImg: {
      width: 60, height: 60, borderRadius: 12,
      objectFit: 'cover' as const, flexShrink: 0,
      background: 'var(--color-card-2)',
    },
    bizName: { fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 },
    bizSub: { fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 6 },
  };

  return (
    <ResponsiveContainer variant="customer">
      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={s.greeting}>{getGreeting()}</p>
              <h1 style={s.name}>{customerProfile?.name || 'Welcome'}</h1>
            </div>
            {customerProfile?.photoURL ? (
              <img src={customerProfile.photoURL} alt="Profile" style={s.avatar} />
            ) : (
              <div style={{
                ...s.avatar,
                background: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 600, color: '#fff',
              }}>
                {(customerProfile?.name || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={s.searchBar} onClick={() => nav('/customer/search')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="var(--color-text-muted)" strokeWidth="1.7" />
              <path d="M16.5 16.5L21 21" stroke="var(--color-text-muted)" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <span style={s.searchText}>Search salons, spas, wellness...</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={s.scroll}>

          {/* Categories */}
          <p style={s.sectionLabel}>Categories</p>
          <div style={s.categoryRow}>
            <button style={s.catPill(selectedCategory === 'all')} onClick={() => setSelectedCategory('all')}>
              <span>✨</span> All
            </button>
            {BUSINESS_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                style={s.catPill(selectedCategory === cat.value)}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Business List */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 8px' }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', letterSpacing: -0.3 }}>
              Nearby
            </p>
            <span style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>
              {businesses.length} places
            </span>
          </div>

          {/* Card list */}
          <div style={{ background: 'var(--color-card)', borderRadius: 0, overflow: 'hidden' }}>
            {businesses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--color-text-dim)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 15 }}>No businesses found</p>
                <p style={{ fontSize: 13, marginTop: 4, color: 'var(--color-text-muted)' }}>
                  Try a different category
                </p>
              </div>
            ) : (
              businesses.map((biz, idx) => {
                const isLive = biz.isOpen && !biz.isBreak && !biz.isStopped;
                const minPrice = biz.services?.length
                  ? Math.min(...biz.services.map(s => s.price))
                  : null;

                return (
                  <button
                    key={biz.uid}
                    style={{
                      ...s.bizCard,
                      borderBottom: idx === businesses.length - 1 ? 'none' : '1px solid var(--color-separator)',
                    }}
                    onClick={() => nav(`/customer/salon/${biz.uid}`)}
                  >
                    <img
                      src={getBusinessImageWithFallback(biz.photoURL, biz.bannerImageURL, biz.businessType)}
                      alt={biz.businessName}
                      style={s.bizImg}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={s.bizName}>{biz.businessName}</p>
                      <p style={s.bizSub}>
                        📍 {biz.location || 'Location not set'}
                        {(biz as any).distance != null && (
                          <span style={{ color: 'var(--color-primary)', marginLeft: 6, fontWeight: 600 }}>
                            {((biz as any).distance as number).toFixed(1)} km
                          </span>
                        )}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, borderRadius: 6,
                          padding: '2px 7px',
                          background: isLive
                            ? 'rgba(52,199,89,0.12)'
                            : biz.isBreak
                            ? 'rgba(255,149,0,0.12)'
                            : 'rgba(255,59,48,0.12)',
                          color: isLive
                            ? 'var(--color-success)'
                            : biz.isBreak
                            ? 'var(--color-warning)'
                            : 'var(--color-danger)',
                        }}>
                          {isLive ? '● Open' : biz.isBreak ? '● On break' : '● Closed'}
                        </span>
                        {minPrice && (
                          <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
                            from <strong style={{ color: 'var(--color-text)' }}>₹{minPrice}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleFavorite(biz.uid); }}
                      style={{
                        flexShrink: 0, background: 'none',
                        fontSize: 20, lineHeight: 1, padding: 4,
                      }}
                    >
                      {isFavorite(biz.uid) ? '❤️' : '♡'}
                    </button>

                    {/* Chevron */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </ResponsiveContainer>
  );
}
