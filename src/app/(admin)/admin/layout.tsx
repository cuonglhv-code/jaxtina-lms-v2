import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { LayoutDashboard, BookOpen, Users, GraduationCap, UserCheck, BarChart2, Settings } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];

  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect('/learner/dashboard');
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Classes', href: '/admin/classes', icon: Users },
    { label: 'Learners', href: '/admin/learners', icon: GraduationCap },
    { label: 'Teachers', href: '/admin/teachers', icon: UserCheck },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <DashboardShell navItems={navItems} userProfile={{ ...profile, email: user.email || '' }}>
      {children}
    </DashboardShell>
  );
}
