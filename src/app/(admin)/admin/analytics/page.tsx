export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users, BookOpen, GraduationCap, TrendingUp, CalendarDays, Star } from 'lucide-react';
import type { CSSProperties } from 'react';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/login');

  // Fetch data in parallel
  const [{ data: allProfiles }, { data: allCourses }, { data: allClasses }] = await Promise.all([
    supabase.from('user_profiles').select('id, role, created_at'),
    supabase.from('courses').select('id, is_published, created_at'),
    supabase.from('classes').select('id, status, created_at'),
  ]);

  const profiles = allProfiles ?? [];
  const courses = allCourses ?? [];
  const classes = allClasses ?? [];

  const learners = profiles.filter(p => p.role === 'learner').length;
  const teachers = profiles.filter(p => p.role === 'teacher').length;
  const admins = profiles.filter(p => ['super_admin', 'centre_admin', 'academic_admin'].includes(p.role)).length;
  const published = courses.filter(c => c.is_published).length;
  const draft = courses.length - published;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const newThisMonth = profiles.filter(p => p.created_at >= firstOfMonth).length;

  // Monthly registrations for last 6 months
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const recent = profiles.filter(p => new Date(p.created_at) >= sixMonthsAgo);
  const monthlyMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    monthlyMap[key] = 0;
  }
  recent.forEach(p => {
    const key = new Date(p.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    if (key in monthlyMap) monthlyMap[key]++;
  });
  const peakMonth = Math.max(...Object.values(monthlyMap), 1);

  const statCards = [
    { label: 'Total Users', value: profiles.length, icon: Users, color: '#0D1B2A' },
    { label: 'Learners', value: learners, icon: GraduationCap, color: '#0E9F6E' },
    { label: 'Teachers', value: teachers, icon: Star, color: '#1B4F72' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: '#7c3aed' },
    { label: 'Published', value: published, icon: TrendingUp, color: '#0E9F6E' },
    { label: 'New This Month', value: newThisMonth, icon: CalendarDays, color: '#f59e0b' },
  ];

  const card: CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 16,
    border: '1px solid var(--border)',
    boxShadow: 'var(--card-shadow)',
    padding: 24,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'var(--midnight)', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--mist)' }}>Centre-wide performance overview</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${color}18` }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Monthly Registrations */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--midnight)', marginBottom: 20 }}>Registrations (Last 6 Months)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(monthlyMap).map(([month, count]) => (
              <div key={month} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--mist)', width: 70, flexShrink: 0 }}>{month}</span>
                <div style={{ flex: 1, height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, backgroundColor: 'var(--jade)', width: `${Math.max((count / peakMonth) * 100, count > 0 ? 4 : 0)}%` }} />
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--ink)', width: 24, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Breakdown */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--midnight)', marginBottom: 20 }}>User Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Learners', count: learners, color: '#0E9F6E' },
              { label: 'Teachers', count: teachers, color: '#1B4F72' },
              { label: 'Admins', count: admins, color: '#7c3aed' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--mist)' }}>{count} / {profiles.length}</span>
                </div>
                <div style={{ height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, backgroundColor: color, width: `${profiles.length > 0 ? (count / profiles.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Status */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--midnight)', marginBottom: 20 }}>Course Status</h2>
          {courses.length === 0 ? (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--mist)' }}>No courses yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Published', count: published, color: '#0E9F6E' },
                { label: 'Draft', count: draft, color: '#8892A4' },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--mist)' }}>{count} courses</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, backgroundColor: color, width: `${courses.length > 0 ? (count / courses.length) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Info */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--midnight)', marginBottom: 20 }}>Platform Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Application', 'Jaxtina EduOS v1.0'],
              ['Stack', 'Next.js 15 · Supabase · Anthropic AI'],
              ['Environment', 'Production'],
              ['Total Classes', String(classes.length)],
              ['Active Classes', String(classes.filter(c => c.status === 'active' || c.status == null).length)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
                <span style={{ color: 'var(--mist)' }}>{k}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
