export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from './SettingsForm';

export default async function TeacherSettingsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, full_name, phone, preferred_lang')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) redirect('/login');

  return (
    <div className="space-y-8" style={{ maxWidth: '720px' }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>Manage your account and preferences</p>
      </div>

      <SettingsForm profile={profile} userEmail={user.email ?? ''} />

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: '32px' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '20px' }}>Platform Info</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { label: 'Platform', value: 'Jaxtina EduOS' },
            { label: 'Version', value: 'v1.0.0' },
            { label: 'Role', value: 'Teacher' },
            { label: 'Framework', value: 'Next.js 16 + Supabase' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--ink)', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
