export default function SkeletonLoader({ lines = 3, height = 16 }: { lines?: number; height?: number }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} style={{
          height, borderRadius: 8,
          background: 'linear-gradient(90deg, var(--color-card-2) 25%, var(--color-card) 50%, var(--color-card-2) 75%)',
          backgroundSize: '400px 100%',
          animation: 'shimmer 1.4s infinite ease-in-out',
          width: i === lines - 1 ? '60%' : '100%',
        }} />
      ))}
    </div>
  );
}
