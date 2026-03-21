export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n/translations';
import { UserSearchFilter } from '@/components/admin/UserSearchFilter';

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

  const profiles = (users ?? []).map(u => ({
    id: u.id,
    full_name: u.full_name as string | null,
    email: u.email as string | null,
    role: u.role as string,
    created_at: u.created_at as string,
  }));

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

      {/* Searchable, filterable table */}
      <UserSearchFilter users={profiles} />
    </div>
  );
}
