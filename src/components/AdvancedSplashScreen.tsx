import { useEffect, useRef } from 'react';

interface Props { onComplete: () => void; }

export default function AdvancedSplashScreen({ onComplete }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple progress bar then complete
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (barRef.current) {
        barRef.current.style.width = `${Math.min(progress, 95)}%`;
      }
      if (progress >= 100) {
        clearInterval(interval);
        if (barRef.current) barRef.current.style.width = '100%';
        setTimeout(onComplete, 200);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      {/* Logo */}
      <div style={{
        width: 72, height: 72,
        background: 'var(--color-primary)',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        boxShadow: '0 4px 20px rgba(0,122,255,0.3)',
      }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -2 }}>L</span>
      </div>

      <h1 style={{
        fontSize: 22, fontWeight: 700, color: '#000',
        letterSpacing: -0.5, marginBottom: 4,
      }}>
        Line Free India
      </h1>

      <p style={{ fontSize: 14, color: 'rgba(60,60,67,0.6)', marginBottom: 48 }}>
        Beauty & Wellness
      </p>

      {/* Progress bar */}
      <div style={{
        width: 120, height: 3,
        background: 'rgba(60,60,67,0.1)',
        borderRadius: 100,
        overflow: 'hidden',
      }}>
        <div ref={barRef} style={{
          height: '100%',
          width: '0%',
          background: 'var(--color-primary)',
          borderRadius: 100,
          transition: 'width 0.08s ease-out',
        }} />
      </div>
    </div>
  );
}
