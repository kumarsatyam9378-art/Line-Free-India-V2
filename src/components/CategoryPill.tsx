interface Props {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryPill({ label, icon, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 100,
        fontSize: 13, fontWeight: 500,
        background: active ? 'var(--color-primary)' : 'var(--color-card)',
        color: active ? '#fff' : 'var(--color-text)',
        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
