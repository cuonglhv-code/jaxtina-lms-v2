export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from './SettingsForm';

export default async function LearnerSettingsPage() {
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
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>Manage your profile and account security</p>
      </div>

      <SettingsForm profile={profile} userEmail={user.email ?? ''} />
    </div>
  );
}
