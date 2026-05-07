import { useNavigate } from 'react-router-dom';

export default function PremiumBanner() {
  const nav = useNavigate();
  return (
    <div
      onClick={() => nav('/customer/subscription')}
      style={{
        margin: '12px 16px',
        padding: '14px 16px',
        background: 'var(--color-primary)',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer',
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Upgrade to Premium</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Get priority booking & more benefits</p>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
