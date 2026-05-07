import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { setThemeMode, ThemeMode } from '../hooks/useTheme';
import { t } from '../i18n';

export default function ThemeSelect() {
  const { lang, user, role } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    if (user && role) {
      nav(role === 'business' ? '/barber/home' : '/customer/home', { replace: true });
    }
  }, [user, role, nav]);

  const select = (mode: ThemeMode) => {
    setThemeMode(mode);
    setTimeout(() => nav('/role'), 300);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8, color: 'var(--color-text)' }}>
          {t('chooseTheme', lang) || 'Choose your theme'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-dim)' }}>
          {t('themeDescription', lang) || 'You can change this anytime in settings'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        {/* Light */}
        <button
          onClick={() => select('light')}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '20px',
            background: '#FFFFFF',
            border: '1.5px solid rgba(60,60,67,0.15)',
            borderRadius: 16, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#F2F2F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            ☀️
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#000', marginBottom: 2 }}>
              {t('lightMode', lang) || 'Light'}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(60,60,67,0.6)' }}>Clean white interface</p>
          </div>
        </button>

        {/* Dark */}
        <button
          onClick={() => select('dark')}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '20px',
            background: '#1C1C1E',
            border: '1.5px solid rgba(84,84,88,0.65)',
            borderRadius: 16, cursor: 'pointer',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#2C2C2E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            🌙
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>
              {t('darkMode', lang) || 'Dark'}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(235,235,245,0.6)' }}>Easy on the eyes at night</p>
          </div>
        </button>
      </div>
    </div>
  );
}
