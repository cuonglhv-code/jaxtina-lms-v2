import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--sand)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(14,159,110,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <span style={{ fontSize: '28px' }}>404</span>
        </div>

        <h1
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '28px',
            color: 'var(--midnight)',
            marginBottom: '12px',
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            color: 'var(--mist)',
            marginBottom: '32px',
          }}
        >
          Không tìm thấy trang · The page you requested does not exist.
        </p>

        <Link
          href="/admin/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--midnight)',
            color: '#ffffff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 24px',
            borderRadius: '999px',
            textDecoration: 'none',
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
