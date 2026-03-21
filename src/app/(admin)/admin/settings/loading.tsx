export default function SettingsLoading() {
  return (
    <div style={{ maxWidth: '720px' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 200,
            borderRadius: 16,
            background: '#E2DDD6',
            marginBottom: 24,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
