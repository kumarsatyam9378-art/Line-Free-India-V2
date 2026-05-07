import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { t } from '../i18n';

export default function RoleSelect() {
  const { setRole, lang } = useApp();
  const nav = useNavigate();

  const select = (r: 'customer' | 'business') => {
    setRole(r);
    nav(r === 'customer' ? '/customer/auth' : '/barber/auth');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-separator)',
      }}>
        <button
          onClick={() => nav('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', color: 'var(--color-primary)',
            fontSize: 15, fontWeight: 500, padding: '4px 0',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
          Line Free India
        </span>
        <div style={{ width: 56 }} />
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Logo + Title */}
        <div style={{
          width: 64, height: 64,
          background: 'var(--color-primary)',
          borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(0,122,255,0.25)',
        }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: -2 }}>L</span>
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 700, color: 'var(--color-text)',
          letterSpacing: -0.5, textAlign: 'center', marginBottom: 8,
        }}>
          {t('chooseYourPath', lang) || 'Who are you?'}
        </h1>
        <p style={{
          fontSize: 15, color: 'var(--color-text-dim)',
          textAlign: 'center', marginBottom: 40, maxWidth: 280,
        }}>
          {t('roleSelectSubtitle', lang) || 'Select how you want to use Line Free India'}
        </p>

        {/* Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {/* Customer */}
          <button
            onClick={() => select('customer')}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 20px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(0,122,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>
                {t('customer', lang) || 'Customer'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>
                {t('customerDesc', lang) || 'Book appointments, skip the queue'}
              </p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Business */}
          <button
            onClick={() => select('business')}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px 20px',
              background: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 16,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              🏪
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
                {t('business', lang) || 'Business Owner'}
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                {t('businessDesc', lang) || 'Manage queues, grow your business'}
              </p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
              <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Features */}
        <div style={{
          marginTop: 48,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, width: '100%',
        }}>
          {[
            { icon: '⚡', label: 'Real-time tracking' },
            { icon: '📊', label: 'Smart analytics' },
            { icon: '🛡️', label: 'Secure & private' },
            { icon: '📍', label: 'Location-aware' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 14px',
              background: 'var(--color-card)',
              borderRadius: 12,
              border: '1px solid var(--color-border)',
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-dim)' }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
