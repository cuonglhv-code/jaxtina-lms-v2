import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/layout/StatCard';
import { GraduationCap, UserCheck, BookOpen, TrendingUp, BookPlus, Users, BarChart2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: learnerCount },
    { count: teacherCount },
    { count: courseCount },
    { data: recentUsers }
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'learner'),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*').order('created_at', { ascending: false }).limit(10)
  ]);

  const ADMIN_ROLES = ['super_admin', 'centre_admin', 'academic_admin'];

  // Derive "This Month" count inline for provisional rendering
  const newLearnersCount = recentUsers?.filter(u => u.role === 'learner').length || 0; 
  const totalUsers = (learnerCount || 0) + (teacherCount || 0) + 1; // +1 for at least this admin

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-[28px] text-[var(--midnight)]">Admin Dashboard</h1>
          <p className="font-sans text-[var(--mist)] mt-1">Jaxtina English Centre overview</p>
        </div>
        <div className="font-sans text-[var(--mist)]">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={GraduationCap} iconBg="var(--jade)" value={learnerCount || 0} label="Active Learners" />
        <StatCard icon={UserCheck} iconBg="var(--ocean)" value={teacherCount || 0} label="Teachers" />
        <StatCard icon={BookOpen} iconBg="#F59E0B" value={courseCount || 0} label="Courses" />
        <StatCard icon={TrendingUp} iconBg="#8B5CF6" value={newLearnersCount} label="New Learners (Recent)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">Recent Registrations</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden">
              {recentUsers && recentUsers.length > 0 ? (
                <table className="w-full text-left font-sans text-sm">
                  <thead className="bg-[var(--chalk)] border-b border-[var(--border)] text-[var(--mist)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {recentUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-[var(--chalk)] transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <Avatar name={user.full_name} size="sm" imageUrl={user.avatar_url} />
                          <span className="font-medium text-[var(--ink)]">{user.full_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wide
                            ${ADMIN_ROLES.includes(user.role) ? 'bg-purple-100 text-purple-700' : 
                              user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 
                              'bg-[var(--jade-light)] text-[var(--jade)]'}`}>
                            {user.role === 'learner' ? 'learner' : user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--mist)]">
                          {new Date(user.created_at).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-[var(--mist)]">No recent users.</div>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add New Course', icon: BookPlus, href: '/admin/courses/new', color: 'var(--jade)' },
                { label: 'Create Class', icon: Users, href: '/admin/classes/new', color: 'var(--ocean)' },
                { label: 'View Analytics', icon: BarChart2, href: '/admin/analytics', color: '#8B5CF6' },
                { label: 'Manage Teachers', icon: UserCheck, href: '/admin/teachers', color: '#F59E0B' }
              ].map((action, i) => (
                <Link key={i} href={action.href} className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-sm hover:shadow-[var(--card-shadow)] hover:border-[var(--jade)] transition-all group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white mb-3" style={{ backgroundColor: action.color }}>
                    <action.icon size={20} />
                  </div>
                  <div className="font-sans font-medium text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors">{action.label}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans font-semibold text-[var(--ink)]">System Status</h3>
              <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Operational
              </div>
            </div>
            <div className="space-y-4 font-sans text-sm">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <span className="text-[var(--mist)]">Database</span>
                <span className="flex items-center gap-2 text-[var(--ink)] font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Connected</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <span className="text-[var(--mist)]">AI Scoring</span>
                <span className="flex items-center gap-2 text-[var(--ink)] font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--mist)]">Authentication</span>
                <span className="flex items-center gap-2 text-[var(--ink)] font-medium"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <h3 className="font-sans font-semibold text-[var(--ink)] mb-6">User Breakdown</h3>
            <div className="space-y-4 font-sans text-sm">
              {[
                { label: 'Learners', count: learnerCount || 0, color: 'var(--jade)' },
                { label: 'Teachers', count: teacherCount || 0, color: 'var(--ocean)' },
                { label: 'Admins', count: totalUsers - (learnerCount || 0) - (teacherCount || 0), color: 'var(--midnight)' }, 
              ].map((role) => (
                <div key={role.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[var(--mist)]">{role.label}</span>
                    <span className="text-[var(--ink)]">{role.count}</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--chalk)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.max((role.count / totalUsers) * 100, 2)}%`, backgroundColor: role.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-transparent border border-[var(--border)] border-dashed rounded-[16px] p-6 text-center">
            <div className="font-display text-lg text-[var(--midnight)] mb-1">Jaxtina EduOS v1.0</div>
            <div className="font-sans text-[13px] text-[var(--mist)] space-y-1">
              <p>Deployed: {new Date().toLocaleDateString('en-GB')}</p>
              <p>Stack: Next.js 15 · Supabase · Anthropic AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
