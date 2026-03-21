'use client'
import { useState } from 'react';

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
};

const roleBadgeColors: Record<string, string> = {
  super_admin: '#7c3aed',
  centre_admin: '#2563eb',
  academic_admin: '#0891b2',
  teacher: '#0e9f6e',
  learner: '#64748b',
};

export function UserSearchFilter({ users }: { users: UserRow[] }) {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchesQuery =
      !query ||
      (u.full_name ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (u.email ?? '').toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const roles = ['all', 'super_admin', 'centre_admin', 'academic_admin', 'teacher', 'learner'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10,
            border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif',
            fontSize: 14, color: 'var(--ink)', outline: 'none',
          }}
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{
            padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--ink)',
            backgroundColor: '#fff', outline: 'none',
          }}
        >
          {roles.map(r => (
            <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--mist)', marginBottom: 12 }}>
        Showing {filtered.length} of {users.length} users
      </p>

      <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--chalk)' }}>
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--mist)' }}>No users found.</td>
              </tr>
            ) : filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--ink)', fontWeight: 500 }}>
                  <a href={`/admin/users/${u.id}`} style={{ color: 'var(--midnight)', textDecoration: 'none', fontWeight: 600 }}>
                    {u.full_name ?? '—'}
                  </a>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>{u.email ?? '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11,
                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                    backgroundColor: `${roleBadgeColors[u.role] ?? '#64748b'}18`,
                    color: roleBadgeColors[u.role] ?? '#64748b',
                  }}>
                    {u.role.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--mist)' }}>
                  {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
