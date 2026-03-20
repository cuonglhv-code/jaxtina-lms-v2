'use client'

import { useState, useTransition } from 'react';
import { updateProfile, updatePassword } from './actions';
import type { Lang } from '@/lib/i18n/translations';

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  preferred_lang: string | null;
};

type Tr = {
  profileSettings: string;
  security: string;
  fullName: string;
  phone: string;
  email: string;
  preferredLanguage: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  saveChanges: string;
  submitting: string;
  error: string;
};

export default function SettingsForm({
  profile,
  lang,
  tr,
  userEmail,
}: {
  profile: Profile;
  lang: Lang;
  tr: Tr;
  userEmail: string;
}) {
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px', color: 'var(--ink)', backgroundColor: '#fff',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
    fontWeight: 500, color: 'var(--mist)', textTransform: 'uppercase',
    letterSpacing: '0.05em', marginBottom: '8px',
  };

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileError(''); setProfileMsg('');
    const formData = new FormData(e.currentTarget);
    startProfileTransition(async () => {
      try {
        await updateProfile(formData);
        setProfileMsg(lang === 'vi' ? 'Đã lưu thay đổi.' : 'Changes saved.');
      } catch (err: unknown) {
        setProfileError(err instanceof Error ? err.message : tr.error);
      }
    });
  }

  function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(''); setPasswordMsg('');
    const fd = new FormData(e.currentTarget);
    if (fd.get('new_password') !== fd.get('confirm_password')) {
      setPasswordError(lang === 'vi' ? 'Mật khẩu không khớp.' : 'Passwords do not match.');
      return;
    }
    startPasswordTransition(async () => {
      try {
        await updatePassword(fd);
        setPasswordMsg(lang === 'vi' ? 'Mật khẩu đã được cập nhật.' : 'Password updated.');
        (e.target as HTMLFormElement).reset();
      } catch (err: unknown) {
        setPasswordError(err instanceof Error ? err.message : tr.error);
      }
    });
  }

  return (
    <>
      {/* Profile section */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: '32px' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '24px' }}>
          {tr.profileSettings}
        </h2>
        <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input type="hidden" name="id" value={profile.id} />

          <div>
            <label style={labelStyle}>{tr.fullName}</label>
            <input name="full_name" type="text" defaultValue={profile.full_name ?? ''} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>{tr.email}</label>
            <input type="email" value={userEmail} disabled style={{ ...inputStyle, backgroundColor: 'var(--chalk)', color: 'var(--mist)' }} />
          </div>

          <div>
            <label style={labelStyle}>{tr.phone}</label>
            <input name="phone" type="tel" defaultValue={profile.phone ?? ''} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>{tr.preferredLanguage}</label>
            <select name="preferred_lang" defaultValue={profile.preferred_lang ?? 'vi'} style={inputStyle}>
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {profileError && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444' }}>{profileError}</p>}
          {profileMsg && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--jade)' }}>{profileMsg}</p>}

          <button
            type="submit"
            disabled={profilePending}
            style={{ alignSelf: 'flex-start', backgroundColor: profilePending ? 'var(--mist)' : 'var(--jade)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: profilePending ? 'not-allowed' : 'pointer' }}
          >
            {profilePending ? tr.submitting : tr.saveChanges}
          </button>
        </form>
      </div>

      {/* Security section */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: '32px' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '24px' }}>
          {tr.security}
        </h2>
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '400px' }}>
          <div>
            <label style={labelStyle}>{tr.newPassword}</label>
            <input name="new_password" type="password" required minLength={8} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tr.confirmPassword}</label>
            <input name="confirm_password" type="password" required minLength={8} style={inputStyle} />
          </div>

          {passwordError && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444' }}>{passwordError}</p>}
          {passwordMsg && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--jade)' }}>{passwordMsg}</p>}

          <button
            type="submit"
            disabled={passwordPending}
            style={{ alignSelf: 'flex-start', backgroundColor: passwordPending ? 'var(--mist)' : 'var(--midnight)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: passwordPending ? 'not-allowed' : 'pointer' }}
          >
            {passwordPending ? tr.submitting : tr.updatePassword}
          </button>
        </form>
      </div>
    </>
  );
}
