import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'learner') {
    redirect('/login'); // Fallback redirect
  }

  const navItems = [
    { label: 'Dashboard', href: '/learner/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Courses', href: '/learner/courses', icon: 'BookOpen' },
    { label: 'Practice', href: '/learner/practice', icon: 'PenLine' },
    { label: 'My Progress', href: '/learner/progress', icon: 'TrendingUp' },
    { label: 'Feedback', href: '/learner/feedback', icon: 'MessageSquare' },
    { label: 'Settings', href: '/learner/settings', icon: 'Settings' },
  ];

  return (
    <DashboardShell navItems={navItems} userProfile={{ ...profile, email: user.email || '' }}>
      {children}
    </DashboardShell>
  );
}
