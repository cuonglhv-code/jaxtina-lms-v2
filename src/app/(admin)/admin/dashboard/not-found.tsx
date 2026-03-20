import Link from 'next/link';

export default function AdminDashboardNotFound() {
  return (
    <div style={{ padding: '48px 0', textAlign: 'center' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          padding: '48px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '22px',
            color: 'var(--midnight)',
            marginBottom: '12px',
          }}
        >
          Page not found
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginBottom: '28px' }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/admin/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--midnight)',
            color: '#ffffff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
