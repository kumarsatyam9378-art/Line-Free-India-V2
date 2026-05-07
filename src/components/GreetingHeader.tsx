import { useApp } from '../store/AppContext';

export default function GreetingHeader() {
  const { customerProfile } = useApp();
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const name = customerProfile?.name || '';

  return (
    <div style={{ padding: '52px 16px 12px', background: 'var(--color-card)', borderBottom: '1px solid var(--color-separator)' }}>
      <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 2 }}>{greeting}{name ? ',' : ''}</p>
      {name && <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--color-text)' }}>{name}</h1>}
    </div>
  );
}
