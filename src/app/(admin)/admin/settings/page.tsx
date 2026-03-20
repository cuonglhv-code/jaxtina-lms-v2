export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n/translations';
import SettingsForm from './SettingsForm';

export default async function AdminSettingsPage({
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

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, phone, avatar_url, role, preferred_lang')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) redirect('/login');

  return (
    <div className="space-y-8" style={{ maxWidth: '720px' }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--midnight)', marginBottom: '4px' }}>
          {tr.settings}
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)' }}>
          {lang === 'vi' ? 'Quản lý tài khoản và tùy chọn nền tảng' : 'Manage your account and platform preferences'}
        </p>
      </div>

      <SettingsForm profile={profile} lang={lang} tr={tr} userEmail={user.email ?? ''} />

      {/* Platform Info */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: '32px' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '20px' }}>
          {tr.platformInfo}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { label: lang === 'vi' ? 'Tên nền tảng' : 'Platform', value: 'Jaxtina EduOS' },
            { label: lang === 'vi' ? 'Phiên bản' : 'Version', value: 'v1.0.0' },
            { label: lang === 'vi' ? 'Framework' : 'Framework', value: 'Next.js 16 + Supabase' },
            { label: lang === 'vi' ? 'Ngày triển khai' : 'Deployed', value: new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--ink)', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)', boxShadow: 'var(--card-shadow)', padding: '32px' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: '#ef4444', marginBottom: '8px' }}>
          {tr.dangerZone}
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--mist)', marginBottom: '20px' }}>
          {tr.deleteAccountWarning}
        </p>
        <button
          type="button"
          disabled
          style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)', backgroundColor: 'rgba(239,68,68,0.06)', color: '#ef4444', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'not-allowed', opacity: 0.6 }}
        >
          {tr.deleteAccount}
        </button>
      </div>
    </div>
  );
}
