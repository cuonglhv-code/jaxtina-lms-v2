export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';
import type { Profile } from '@/types/database';
import { t, ROLE_LABELS, type Lang } from '@/lib/i18n/translations';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function roleBadgeStyle(role: string) {
  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];
  if (ADMIN_ROLES.includes(role)) return { backgroundColor: 'var(--midnight)', color: '#fff' };
  if (role === 'teacher') return { backgroundColor: 'var(--ocean)', color: '#fff' };
  return { backgroundColor: 'var(--jade-light)', color: 'var(--jade)' };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang = ((sp?.lang ?? 'vi') === 'en' ? 'en' : 'vi') as Lang;
  const tr = t[lang];

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, role, avatar_url, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div style={{ padding: '32px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--mist)' }}>
          Error loading users.
        </p>
      </div>
    );
  }

  const profiles = (users ?? []) as Profile[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)' }}>
            {tr.users}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginTop: '4px' }}>
            {tr.totalUsers}: <strong style={{ color: 'var(--ink)' }}>{profiles.length}</strong>
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden',
        }}
      >
        {profiles.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', color: 'var(--mist)' }}>
            {tr.noUsersFound}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--chalk)', borderBottom: '1px solid var(--border)' }}>
                {[tr.name, tr.email, tr.role, tr.joined, tr.edit].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--mist)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr
                  key={profile.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--chalk)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar name={profile.full_name ?? ''} size="sm" imageUrl={profile.avatar_url} />
                      <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{profile.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--mist)' }}>
                    {profile.email ?? '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        ...roleBadgeStyle(profile.role),
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {ROLE_LABELS[lang][profile.role] ?? profile.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--mist)' }}>
                    {formatDate(profile.created_at)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Link
                      href={`/admin/users/${profile.id}`}
                      style={{
                        color: 'var(--jade)',
                        fontWeight: 500,
                        textDecoration: 'none',
                        fontSize: '13px',
                      }}
                    >
                      {tr.edit} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
