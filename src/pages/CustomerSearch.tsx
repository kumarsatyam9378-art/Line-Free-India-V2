import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getCategoryInfo, BUSINESS_CATEGORIES } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';
import SalonsMap from '../components/SalonsMap';
import { triggerHaptic } from '../utils/haptics';

export default function CustomerSearch() {
  const { allSalons, isFavorite, getUserLocation } = useApp();
  const nav = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const dist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => { getUserLocation().then(loc => { if (loc) setUserLoc(loc); }); }, []);

  const results = (() => {
    let r = [...allSalons];
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(s => s.businessName?.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q) || s.services?.some(sv => sv.name.toLowerCase().includes(q)));
    }
    if (filter === 'open') r = r.filter(s => s.isOpen && !s.isBreak && !s.isStopped);
    else if (filter === 'nearby' && userLoc) r = r.filter(s => s.lat && s.lng).sort((a, b) => dist(userLoc.lat, userLoc.lng, a.lat!, a.lng!) - dist(userLoc.lat, userLoc.lng, b.lat!, b.lng!));
    else if (filter === 'rated') r = r.filter(s => (s.rating||0) > 0).sort((a, b) => (b.rating||0) - (a.rating||0));
    else if (filter === 'favorites') r = r.filter(s => isFavorite(s.uid));
    else if (filter !== 'all') r = r.filter(s => s.businessType === filter);
    return r;
  })();

  const chips = [
    { id: 'all', label: 'All' },
    { id: 'open', label: '🟢 Open' },
    { id: 'nearby', label: '📍 Nearby' },
    { id: 'rated', label: '⭐ Top rated' },
    { id: 'favorites', label: '❤️ Saved' },
    ...BUSINESS_CATEGORIES.map(c => ({ id: c.value, label: `${c.icon} ${c.label}` })),
  ];

  return (
    <ResponsiveContainer variant="customer">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>

        {/* Header */}
        <div style={{
          background: 'var(--color-card)',
          borderBottom: '1px solid var(--color-separator)',
          padding: '52px 16px 0',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Explore</h1>
            {/* List / Map toggle */}
            <div style={{
              display: 'flex', background: 'var(--color-bg)',
              borderRadius: 10, padding: 2,
              border: '1px solid var(--color-border)',
            }}>
              {(['list', 'map'] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: viewMode === m ? 'var(--color-card)' : 'transparent',
                  color: viewMode === m ? 'var(--color-text)' : 'var(--color-text-dim)',
                  boxShadow: viewMode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}>
                  {m === 'list' ? 'List' : 'Map'}
                </button>
              ))}
            </div>
          </div>

          {/* Search input */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search salons, spas, services..."
              autoFocus
              style={{
                width: '100%', padding: '11px 36px 11px 36px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 12, fontSize: 15,
                color: 'var(--color-text)', outline: 'none',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'var(--color-card-2)', border: 'none',
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'var(--color-text-dim)', cursor: 'pointer',
              }}>✕</button>
            )}
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
            {chips.map(c => (
              <button key={c.id} onClick={() => setFilter(c.id)} style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 100,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                background: filter === c.id ? 'var(--color-primary)' : 'var(--color-bg)',
                color: filter === c.id ? '#fff' : 'var(--color-text-dim)',
                border: `1px solid ${filter === c.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                whiteSpace: 'nowrap',
              }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
          {viewMode === 'map' ? (
            <div style={{ height: 'calc(100vh - 220px)' }}>
              <SalonsMap salons={results} userLoc={userLoc} />
            </div>
          ) : (
            <>
              <div style={{ padding: '12px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>{results.length} results</p>
              </div>

              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No results found</p>
                  <p style={{ fontSize: 14, color: 'var(--color-text-dim)', marginBottom: 24 }}>Try a different search or filter</p>
                  <button onClick={() => { setQuery(''); setFilter('all'); }} style={{
                    padding: '11px 24px', background: 'var(--color-primary)', color: '#fff',
                    borderRadius: 12, fontSize: 14, fontWeight: 600,
                  }}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div style={{ background: 'var(--color-card)', marginTop: 8 }}>
                  {results.map((biz, idx) => {
                    const isLive = biz.isOpen && !biz.isBreak && !biz.isStopped;
                    const minPrice = biz.services?.length ? Math.min(...biz.services.map(s => s.price)) : null;
                    const d = userLoc && biz.lat && biz.lng ? dist(userLoc.lat, userLoc.lng, biz.lat, biz.lng) : null;
                    const cat = getCategoryInfo(biz.businessType);
                    
                    // Determine status display
                    let statusText = '● Closed';
                    let statusColor = 'var(--color-danger)';
                    let statusBg = 'rgba(255,59,48,0.10)';
                    
                    if (biz.isOpen) {
                      if (biz.isBreak) {
                        statusText = '☕ On Break';
                        statusColor = '#FF9500';
                        statusBg = 'rgba(255,149,0,0.12)';
                      } else if (biz.isStopped) {
                        statusText = '⏸ Tokens Paused';
                        statusColor = '#FF9500';
                        statusBg = 'rgba(255,149,0,0.12)';
                      } else {
                        statusText = '● Open';
                        statusColor = 'var(--color-success)';
                        statusBg = 'rgba(52,199,89,0.12)';
                      }
                    }
                    
                    return (
                      <button key={biz.uid} onClick={() => nav(`/customer/salon/${biz.uid}`)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', background: 'var(--color-card)', textAlign: 'left',
                        borderBottom: idx < results.length - 1 ? '1px solid var(--color-separator)' : 'none',
                        cursor: 'pointer',
                      }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                          background: 'var(--color-card-2)', overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                        }}>
                          {biz.bannerImageURL || biz.photoURL
                            ? <img src={biz.bannerImageURL || biz.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                            : cat.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {biz.businessName}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cat.label} · {biz.location?.split(',')[0]}
                            {d != null && <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}> · {d.toFixed(1)} km</span>}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                              background: statusBg,
                              color: statusColor,
                            }}>
                              {statusText}
                            </span>
                            {minPrice && <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>from ₹{minPrice}</span>}
                            {(biz.rating || 0) > 0 && <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>⭐ {biz.rating}</span>}
                          </div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}>
                          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <BottomNav />
      </div>
    </ResponsiveContainer>
  );
}
