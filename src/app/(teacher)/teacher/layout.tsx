import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { LayoutDashboard, Users, FileText, GraduationCap, FolderOpen, Settings } from 'lucide-react';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'teacher') {
    redirect('/learner/dashboard'); // Fallback redirect
  }

  const navItems = [
    { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'My Classes', href: '/teacher/classes', icon: Users },
    { label: 'Submissions', href: '/teacher/submissions', icon: FileText },
    { label: 'Learners', href: '/teacher/learners', icon: GraduationCap },
    { label: 'Resources', href: '/teacher/resources', icon: FolderOpen },
    { label: 'Settings', href: '/teacher/settings', icon: Settings },
  ];

  return (
    <DashboardShell navItems={navItems} userProfile={{ ...profile, email: user.email || '' }}>
      {children}
    </DashboardShell>
  );
}
