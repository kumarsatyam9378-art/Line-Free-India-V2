import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import ResponsiveContainer from '../components/ResponsiveContainer';

export default function CustomerProfileEdit() {
  const { user, customerProfile, saveCustomerProfile, signOutUser, uploadPhoto, getCustomerFullHistory } = useApp();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(customerProfile?.name || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [location, setLocation] = useState(customerProfile?.location || '');
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    if (!user) return;
    getCustomerFullHistory(user.uid).then(tokens => {
      const done = tokens.filter(t => t.status === 'done').sort((a, b) => b.createdAt - a.createdAt);
      setTotalVisits(done.length);
      if (done.length === 0) return;
      let s = 1;
      for (let i = 0; i < done.length - 1; i++) {
        const diff = (done[i].createdAt - done[i+1].createdAt) / 86400000;
        if (diff <= 40) s++; else break;
      }
      setStreak(s);
    });
  }, [user]);

  const handleSave = async () => {
    if (!customerProfile) return;
    await saveCustomerProfile({ ...customerProfile, name, phone, location });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try { await uploadPhoto(file, `customers/${user.uid}/avatar`); }
    catch {}
    setUploading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 14px',
    background: 'var(--color-bg)', border: '1px solid var(--color-border)',
    borderRadius: 12, fontSize: 16, color: 'var(--color-text)', outline: 'none',
  };

  const label: React.CSSProperties = {
    fontSize: 13, fontWeight: 500, color: 'var(--color-text-dim)', marginBottom: 6, display: 'block',
  };

  return (
    <ResponsiveContainer variant="customer">
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 90 }}>
        {/* Header */}
        <div style={{ background: 'var(--color-card)', padding: '52px 16px 16px', borderBottom: '1px solid var(--color-separator)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>Profile</h1>
        </div>

        {/* Avatar */}
        <div style={{ padding: '24px 16px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: customerProfile?.photoURL ? 'transparent' : 'var(--color-primary)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {customerProfile?.photoURL
                ? <img src={customerProfile.photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                : <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{(name || 'U')[0].toUpperCase()}</span>}
            </div>
            <button onClick={() => fileRef.current?.click()} style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--color-primary)', color: '#fff',
              fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--color-card)', cursor: 'pointer',
            }}>
              {uploading ? '…' : '✎'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)' }}>{customerProfile?.name || 'Your Name'}</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '16px 16px 0', display: 'flex', gap: 12 }}>
          {[
            { label: 'Visits', value: totalVisits },
            { label: 'Streak', value: `🔥 ${streak}` },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'var(--color-card)', border: '1px solid var(--color-border)',
              borderRadius: 14, padding: '14px 12px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Fields */}
        <div style={{ padding: '24px 16px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-dim)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 as any }}>
            Personal Info
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <span style={label}>Name</span>
              <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <span style={label}>Phone</span>
              <input style={inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <span style={label}>Location</span>
              <input style={inp} value={location} onChange={e => setLocation(e.target.value)} placeholder="Your city or area" />
            </div>
          </div>

          <button onClick={handleSave} style={{
            width: '100%', marginTop: 20, padding: '15px',
            background: saved ? 'var(--color-success)' : 'var(--color-primary)',
            color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 600,
            transition: 'background 0.2s',
          }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {/* Quick links */}
        <div style={{ padding: '24px 16px 0' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-dim)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            More
          </p>
          <div style={{ background: 'var(--color-card)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {[
              { label: 'My History', path: '/customer/history', icon: '📋' },
              { label: 'My Tokens', path: '/customer/tokens', icon: '🎫' },
              { label: 'Loyalty & Rewards', path: '/customer/loyalty', icon: '🏆' },
              { label: 'Notifications', path: '/customer/notifications', icon: '🔔' },
            ].map((item, i, arr) => (
              <button key={item.path} onClick={() => nav(item.path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', background: 'none', textAlign: 'left',
                borderBottom: i < arr.length - 1 ? '1px solid var(--color-separator)' : 'none',
                cursor: 'pointer', color: 'var(--color-text)',
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div style={{ padding: '16px 16px 0' }}>
          <button onClick={async () => { await signOutUser(); nav('/', { replace: true }); }} style={{
            width: '100%', padding: '14px', borderRadius: 14,
            background: 'transparent', border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)', fontSize: 15, fontWeight: 500, cursor: 'pointer',
          }}>
            Sign Out
          </button>
        </div>
      </div>
      <BottomNav />
    </ResponsiveContainer>
  );
}
