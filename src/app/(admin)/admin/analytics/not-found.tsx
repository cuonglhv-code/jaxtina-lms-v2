import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 32px', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
      <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: 'var(--mist)', marginBottom: 24, fontSize: 14 }}>The page you are looking for does not exist.</p>
      <Link href="/admin/dashboard" style={{ color: 'var(--jade)', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>← Back to Dashboard</Link>
    </div>
  );
}
