interface Props { onComplete: () => void; }

export default function SplashScreen({ onComplete }: Props) {
  // Simple: just call complete right away — AdvancedSplashScreen handles it
  setTimeout(onComplete, 1500);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        width: 64, height: 64, background: 'var(--color-primary)',
        borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>L</span>
      </div>
    </div>
  );
}
