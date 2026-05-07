import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Lang } from '../store/AppContext';

export default function LanguageSelect() {
  const { setLang, user, role } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    if (user && role) {
      nav(role === 'business' ? '/barber/home' : '/customer/home', { replace: true });
    }
  }, [user, role, nav]);

  const select = (l: Lang) => {
    setLang(l);
    setTimeout(() => nav('/theme'), 300);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'var(--color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, boxShadow: '0 4px 16px rgba(0,122,255,0.25)',
      }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: -2 }}>L</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', letterSpacing: -0.5, marginBottom: 6, textAlign: 'center' }}>
        Line Free India
      </h1>
      <p style={{ fontSize: 15, color: 'var(--color-text-dim)', marginBottom: 40, textAlign: 'center' }}>
        Choose your language
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        {[
          { lang: 'en' as Lang, label: 'English', sub: 'Continue in English' },
          { lang: 'hi' as Lang, label: 'हिंदी', sub: 'हिंदी में जारी रखें' },
        ].map(opt => (
          <button
            key={opt.lang}
            onClick={() => select(opt.lang)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 16, cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{opt.label}</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>{opt.sub}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
