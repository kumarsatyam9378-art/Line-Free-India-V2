import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp, TokenEntry } from '../store/AppContext';
import { useTheme } from '../hooks/useTheme';
import BottomNav from '../components/BottomNav';
import { triggerHaptic } from '../utils/haptics';
import { t } from '../i18n';

export default function BarberHome() {
  const {
    businessProfile, user, signOutUser,
    toggleSalonOpen, toggleSalonBreak, toggleSalonStop,
    unreadCount, nextCustomer, loading,
    theme: globalTheme, toggleTheme, lang,
  } = useApp();

  const nav = useNavigate();
  const [todayTokens, setTodayTokens] = useState<TokenEntry[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakDuration, setBreakDuration] = useState(15);
  const [customDuration, setCustomDuration] = useState('');
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');

  const catType = businessProfile?.businessType || 'mens_salon';
  useTheme(catType);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tokens'), where('salonId','==',user.uid), where('date','==',today));
    const unsub = onSnapshot(q, snap => {
      const tks = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      tks.sort((a, b) => a.tokenNumber - b.tokenNumber);
      setTodayTokens(tks);
      setEarnings(tks.filter(t => t.status === 'done').reduce((a, c) => a + (c.totalPrice || 0), 0));
    });
    return () => unsub();
  }, [user, today]);

  const handleStartBreak = async () => {
    if (breakStart && breakEnd) {
      const now = new Date();
      const [sh, sm] = breakStart.split(':').map(Number);
      const [eh, em] = breakEnd.split(':').map(Number);
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em);
      await updateDoc(doc(db, 'barbers', user!.uid), { isBreak: true, breakStartTime: start.getTime(), breakEndTime: end.getTime() });
      showToast(`Break: ${breakStart} – ${breakEnd}`);
    } else {
      const dur = breakDuration === 0 ? parseInt(customDuration) : breakDuration;
      await updateDoc(doc(db, 'barbers', user!.uid), { isBreak: true, breakStartTime: Date.now(), breakEndTime: Date.now() + dur * 60000 });
      showToast(`Break started: ${dur} min`);
    }
    setShowBreakModal(false);
    setBreakStart(''); setBreakEnd(''); setBreakDuration(15); setCustomDuration('');
  };

  const bp = businessProfile;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ width: 24, height: 24, border: '2.5px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (!bp) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'var(--color-bg)', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Set Up Your Business</h2>
      <p style={{ fontSize: 15, color: 'var(--color-text-dim)', marginBottom: 32, maxWidth: 280 }}>
        Complete your business profile to start managing your queue.
      </p>
      <button
        onClick={() => nav('/barber/setup')}
        style={{
          background: 'var(--color-primary)', color: '#fff',
          padding: '14px 32px', borderRadius: 14,
          fontSize: 16, fontWeight: 600,
        }}
      >
        Get Started →
      </button>
    </div>
  );

  const waitingCount = todayTokens.filter(t => t.status === 'waiting').length;
  const servingToken = todayTokens.find(t => t.status === 'serving');
  const doneCount = todayTokens.filter(t => t.status === 'done').length;

  // ─── Styles
  const pill = (color: string, bg: string) => ({
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 10px', borderRadius: 100,
    fontSize: 12, fontWeight: 600,
    color, background: bg,
  });

  const controlBtn = (active: boolean, activeColor: string) => ({
    flex: 1,
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '16px 8px',
    background: active ? activeColor : 'var(--color-card)',
    border: `1px solid ${active ? activeColor : 'var(--color-border)'}`,
    borderRadius: 14,
    cursor: 'pointer', transition: 'all 0.15s',
  });

  const toolBtn = (route: string, icon: string, label: string, color: string) => (
    <button
      key={route}
      onClick={() => { triggerHaptic('light'); nav(route); }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '16px 12px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        cursor: 'pointer', flex: 1,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-dim)' }}>{label}</span>
    </button>
  );

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', overflowX: 'hidden', paddingBottom: 80 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 56, left: '50%', transform: 'translateX(-50%)',
          background: '#1C1C1E', color: '#fff', padding: '10px 20px',
          borderRadius: 100, fontSize: 13, fontWeight: 500,
          zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'var(--color-card)',
        padding: '52px 16px 16px',
        borderBottom: '1px solid var(--color-separator)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: bp.isOpen ? 'var(--color-success)' : 'var(--color-danger)',
            }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-dim)', fontWeight: 500 }}>
              {bp.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: 'var(--color-text)' }}>
            {bp.businessName}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => nav('/barber/notifications')}
            style={{
              position: 'relative', width: 40, height: 40,
              borderRadius: 12, background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--color-danger)', color: '#fff',
                fontSize: 10, fontWeight: 700,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => nav('/barber/qr')}
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--color-bg)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}
          >
            📲
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px 16px 0', display: 'flex', gap: 12 }}>
        {[
          { label: 'Waiting', value: waitingCount, color: 'var(--color-warning)' },
          { label: 'Done today', value: doneCount, color: 'var(--color-success)' },
          { label: 'Revenue', value: `₹${earnings}`, color: 'var(--color-primary)' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 14, padding: '14px 12px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, letterSpacing: -0.5 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-dim)', marginTop: 2, fontWeight: 500 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Call Next / Complete */}
      <div style={{ padding: '16px 16px 0' }}>
        <button
          onClick={async () => { await nextCustomer(); showToast(servingToken ? 'Service completed ✓' : 'Customer called'); }}
          disabled={!servingToken && waitingCount === 0}
          style={{
            width: '100%', padding: '18px 24px',
            background: 'var(--color-primary)',
            color: '#fff', borderRadius: 16,
            fontSize: 17, fontWeight: 600,
            opacity: (!servingToken && waitingCount === 0) ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: (!servingToken && waitingCount === 0) ? 'not-allowed' : 'pointer',
            letterSpacing: -0.2,
          }}
        >
          {servingToken ? '✓  Complete Service' : '→  Call Next Customer'}
          {waitingCount > 0 && !servingToken && (
            <span style={{
              background: 'rgba(255,255,255,0.25)', fontSize: 13,
              padding: '2px 8px', borderRadius: 100, fontWeight: 700,
            }}>
              {waitingCount}
            </span>
          )}
        </button>
      </div>

      {/* Business Controls */}
      <div style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-dim)', marginBottom: 10 }}>
          Controls
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Open/Close */}
          <button
            style={controlBtn(bp.isOpen, 'rgba(52,199,89,0.12)')}
            onClick={async () => { await toggleSalonOpen(); showToast(bp.isOpen ? 'Business closed' : 'Business opened'); }}
          >
            <span style={{ fontSize: 22 }}>{bp.isOpen ? '🟢' : '⚫'}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: bp.isOpen ? 'var(--color-success)' : 'var(--color-text-dim)' }}>
              {bp.isOpen ? 'Open' : 'Open'}
            </span>
          </button>

          {/* Break */}
          <button
            style={controlBtn(bp.isBreak, 'rgba(255,149,0,0.12)')}
            onClick={async () => {
              if (bp.isBreak) { await toggleSalonBreak(); showToast('Break ended'); }
              else setShowBreakModal(true);
            }}
          >
            <span style={{ fontSize: 22 }}>{bp.isBreak ? '☕' : '☕'}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: bp.isBreak ? 'var(--color-warning)' : 'var(--color-text-dim)' }}>
              {bp.isBreak ? 'End Break' : 'Break'}
            </span>
          </button>

          {/* Pause Tokens */}
          <button
            style={controlBtn(bp.isStopped, 'rgba(255,59,48,0.12)')}
            onClick={async () => { await toggleSalonStop(); showToast(bp.isStopped ? 'Tokens resumed' : 'Tokens paused'); }}
          >
            <span style={{ fontSize: 22 }}>{bp.isStopped ? '▶️' : '⏸'}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: bp.isStopped ? 'var(--color-danger)' : 'var(--color-text-dim)' }}>
              {bp.isStopped ? 'Resume' : 'Pause'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Tools */}
      <div style={{ padding: '16px 16px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-dim)', marginBottom: 10 }}>
          Quick access
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { path: '/barber/crm', icon: '👥', label: 'Customers' },
            { path: '/barber/analytics', icon: '📊', label: 'Analytics' },
            { path: '/barber/whatsapp', icon: '💬', label: 'WhatsApp' },
            { path: '/barber/calendar', icon: '📅', label: 'Calendar' },
          ].map(item => toolBtn(item.path, item.icon, item.label, '#007AFF'))}
        </div>
      </div>

      {/* All Tools */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={() => nav('/barber/tools')}
          style={{
            width: '100%', padding: '16px 20px',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🧰</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>All Business Tools</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 1 }}>Invoices, inventory, staff & more</p>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Break Modal */}
      {showBreakModal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 9999, display: 'flex', alignItems: 'flex-end',
          }}
          onClick={() => setShowBreakModal(false)}
        >
          <div
            style={{
              background: 'var(--color-card)', width: '100%',
              borderRadius: '20px 20px 0 0',
              padding: '24px 20px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, background: 'var(--color-border)', borderRadius: 100, margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Set Break Duration</h2>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[15, 30, 60].map(dur => (
                <button
                  key={dur}
                  onClick={() => { setBreakDuration(dur); setBreakStart(''); setBreakEnd(''); setCustomDuration(''); }}
                  style={{
                    flex: 1, padding: '12px 0',
                    borderRadius: 12, fontSize: 14, fontWeight: 600,
                    background: breakDuration === dur && !breakStart ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: breakDuration === dur && !breakStart ? '#fff' : 'var(--color-text)',
                    border: `1px solid ${breakDuration === dur && !breakStart ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                  }}
                >
                  {dur < 60 ? `${dur} min` : '1 hr'}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Custom duration (minutes)"
              value={customDuration}
              onChange={e => { setCustomDuration(e.target.value); setBreakDuration(0); }}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                borderRadius: 12, fontSize: 14, color: 'var(--color-text)',
                marginBottom: 16, outline: 'none',
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[{ label: 'From', val: breakStart, set: setBreakStart }, { label: 'To', val: breakEnd, set: setBreakEnd }].map(f => (
                <div key={f.label}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 6 }}>{f.label}</p>
                  <input
                    type="time"
                    value={f.val}
                    onChange={e => { f.set(e.target.value); setBreakDuration(0); setCustomDuration(''); }}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                      borderRadius: 10, fontSize: 14, color: 'var(--color-text)', outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowBreakModal(false)}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                  background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                  color: 'var(--color-text)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStartBreak}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                  background: 'var(--color-warning)', color: '#fff', cursor: 'pointer', border: 'none',
                }}
              >
                Start Break
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
