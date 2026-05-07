import { useNavigate } from 'react-router-dom';

export default function BackButton({ to }: { to?: string }) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => to ? nav(to) : nav(-1 as any)}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'none', color: 'var(--color-primary)',
        fontSize: 15, fontWeight: 500, padding: '4px 0',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Back
    </button>
  );
}
