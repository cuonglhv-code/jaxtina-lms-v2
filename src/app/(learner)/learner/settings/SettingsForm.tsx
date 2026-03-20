'use client'

import { useState, useTransition } from 'react';
import { updateLearnerProfile, updateLearnerPassword } from './actions';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  preferred_lang: string | null;
};

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

export function SettingsForm({ profile, userEmail }: { profile: Profile; userEmail: string }) {
  const [profilePending, startProfile] = useTransition();
  const [passwordPending, startPassword] = useTransition();
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setProfileErr(''); setProfileMsg('');
    const fd = new FormData(e.currentTarget);
    startProfile(async () => {
      try { await updateLearnerProfile(fd); setProfileMsg('Changes saved.'); }
      catch (err: unknown) { setProfileErr(err instanceof Error ? err.message : 'Error'); }
    });
  }

  function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setPasswordErr(''); setPasswordMsg('');
    const fd = new FormData(e.currentTarget);
    if (fd.get('new_password') !== fd.get('confirm_password')) {
      setPasswordErr('Passwords do not match.'); return;
    }
    startPassword(async () => {
      try { await updateLearnerPassword(fd); setPasswordMsg('Password updated.'); (e.target as HTMLFormElement).reset(); }
      catch (err: unknown) { setPasswordErr(err instanceof Error ? err.message : 'Error'); }
    });
  }

  const card: React.CSSProperties = { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', padding: '32px' };

  return (
    <>
      <div style={card}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '24px' }}>Profile Settings</h2>
        <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input type="hidden" name="id" value={profile.id} />
          <div>
            <label style={labelStyle}>Full Name</label>
            <input name="full_name" type="text" defaultValue={profile.full_name ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={userEmail} disabled style={{ ...inputStyle, backgroundColor: 'var(--chalk)', color: 'var(--mist)' }} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input name="phone" type="tel" defaultValue={profile.phone ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Preferred Language</label>
            <select name="preferred_lang" defaultValue={profile.preferred_lang ?? 'vi'} style={inputStyle}>
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          {profileErr && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444' }}>{profileErr}</p>}
          {profileMsg && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--jade)' }}>{profileMsg}</p>}
          <button type="submit" disabled={profilePending} style={{ alignSelf: 'flex-start', backgroundColor: profilePending ? 'var(--mist)' : 'var(--jade)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: profilePending ? 'not-allowed' : 'pointer' }}>
            {profilePending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div style={card}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--midnight)', marginBottom: '24px' }}>Security</h2>
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '400px' }}>
          <div>
            <label style={labelStyle}>New Password</label>
            <input name="new_password" type="password" required minLength={8} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input name="confirm_password" type="password" required minLength={8} style={inputStyle} />
          </div>
          {passwordErr && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#ef4444' }}>{passwordErr}</p>}
          {passwordMsg && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--jade)' }}>{passwordMsg}</p>}
          <button type="submit" disabled={passwordPending} style={{ alignSelf: 'flex-start', backgroundColor: passwordPending ? 'var(--mist)' : 'var(--midnight)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: passwordPending ? 'not-allowed' : 'pointer' }}>
            {passwordPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </>
  );
}
