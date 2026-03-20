export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // redirect() must stay OUTSIDE try/catch — it throws intentionally in Next.js
  let user: { id: string; email?: string } | null = null;
  let profile: { role: string; full_name: string; avatar_url?: string | null; email?: string } | null = null;

  try {
    const supabase = await createClient();
    const { data: { user: u }, error } = await supabase.auth.getUser();

    if (!error && u) {
      user = u;
      const { data: p } = await supabase
        .from('user_profiles')
        .select('role, full_name, avatar_url, email')
        .eq('id', u.id)
        .maybeSingle();
      profile = p ?? null;
    }
  } catch (err) {
    console.error('Admin layout auth error:', err);
    // Fall through — user stays null, redirect below will fire
  }

  if (!user) redirect('/login');

  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect('/learner/dashboard');
  }

  const navItems = [
    { label: 'Dashboard',  href: '/admin/dashboard',  icon: 'LayoutDashboard' },
    { label: 'Courses',    href: '/admin/courses',     icon: 'BookOpen' },
    { label: 'Classes',    href: '/admin/classes',     icon: 'Users' },
    { label: 'Learners',   href: '/admin/learners',    icon: 'GraduationCap' },
    { label: 'Teachers',   href: '/admin/teachers',    icon: 'UserCheck' },
    { label: 'Analytics',  href: '/admin/analytics',   icon: 'BarChart2' },
    { label: 'Settings',   href: '/admin/settings',    icon: 'Settings' },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      userProfile={{
        full_name: profile!.full_name ?? '',
        role: profile!.role,
        email: profile!.email ?? user!.email ?? '',
        avatar_url: profile!.avatar_url ?? null,
      }}
    >
      {children}
    </DashboardShell>
  );
}
