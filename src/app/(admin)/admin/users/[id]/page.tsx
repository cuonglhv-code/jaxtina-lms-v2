export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { updateUserRole } from './actions';
import { t, ROLE_LABELS, type Lang } from '@/lib/i18n/translations';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const VALID_ROLES = ['learner', 'teacher', 'centre_admin', 'academic_admin', 'super_admin'];

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const lang = ((sp?.lang ?? 'vi') === 'en' ? 'en' : 'vi') as Lang;
  const tr = t[lang];

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }

  const { data: target, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, role, avatar_url, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error || !target) notFound();

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/users"
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
      >
        ← {tr.users}
      </Link>

      {/* Profile card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          padding: '40px',
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
            <Avatar name={target.full_name ?? ''} size="lg" imageUrl={target.avatar_url} />
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', color: 'var(--midnight)', margin: '0 0 8px' }}>
            {target.full_name}
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', margin: '0 0 12px' }}>
            {target.email ?? '—'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'var(--jade-light)',
                color: 'var(--jade)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {ROLE_LABELS[lang][target.role] ?? target.role}
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--mist)' }}>
              {tr.joined}: {formatDate(target.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Change role form */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          padding: '32px',
          maxWidth: '480px',
        }}
      >
        <h3
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '20px',
          }}
        >
          {tr.changeRole}
        </h3>

        <form action={updateUserRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="hidden" name="user_id" value={target.id} />

          <div>
            <label
              htmlFor="role"
              style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}
            >
              {tr.role}
            </label>
            <select
              id="role"
              name="role"
              defaultValue={target.role}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: 'var(--ink)',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            >
              {VALID_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[lang][r] ?? r}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: 'var(--midnight)',
              color: '#ffffff',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              padding: '11px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {tr.saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
}
