import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/layout/StatCard';
import { Target, Trophy, CheckCircle, FileText, Calendar, Flame } from 'lucide-react';
import Link from 'next/link';

export default async function LearnerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const firstName = profile?.full_name?.split(' ')[0] || 'Learner';

  // Provisional placeholders matching Phase 4 data mapping requirements
  const currentBand = user?.user_metadata?.current_band || '—';
  const targetBand = user?.user_metadata?.target_band || '—';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[28px] text-[var(--midnight)]">Good morning, {firstName} 👋</h1>
        <p className="font-sans text-[var(--mist)] mt-1">Here's your learning overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Target} iconBg="#F59E0B" value={currentBand} label="Current IELTS Band" />
        <StatCard icon={Trophy} iconBg="var(--jade)" value={targetBand} label="Target IELTS Band" />
        <StatCard icon={CheckCircle} iconBg="#3B82F6" value="0" label="Lessons Completed" />
        <StatCard icon={FileText} iconBg="#8B5CF6" value="0" label="Essays Submitted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">My Courses</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 text-center shadow-[var(--card-shadow)]">
              <div className="w-full h-32 bg-gradient-to-br from-[var(--sand)] to-[var(--chalk)] rounded-lg mb-6 border border-dashed border-[var(--border)]"></div>
              <h3 className="font-display text-xl text-[var(--ink)] mb-2">No courses yet</h3>
              <p className="font-sans text-[var(--mist)] mb-4">Contact your teacher to get enrolled</p>
              <span className="inline-block px-3 py-1 bg-[var(--jade-light)] text-[var(--jade)] font-medium text-sm rounded-full">
                Enrolment Pending
              </span>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">Recent Activity</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 shadow-[var(--card-shadow)]">
              <p className="font-sans text-[var(--mist)] text-center mb-6">No activity yet. Start learning!</p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--chalk)] border border-[var(--border)]"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-[var(--chalk)] rounded w-3/4"></div>
                      <div className="h-3 bg-[var(--chalk)] rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-[var(--ocean)]" size={20} />
              <h3 className="font-sans font-semibold text-[var(--ink)]">Upcoming</h3>
            </div>
            <p className="font-sans text-sm text-[var(--mist)]">No upcoming sessions</p>
          </div>

          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <h3 className="font-sans font-semibold text-[var(--ink)] mb-2">Quick Practice</h3>
            <p className="font-sans text-sm text-[var(--mist)] mb-4">Start an IELTS Writing practice</p>
            <div className="space-y-3">
              <Link href="/learner/practice" className="block w-full text-center py-2 px-4 rounded-lg border border-[var(--jade)] text-[var(--jade)] hover:bg-[var(--jade-light)] font-medium transition-colors">
                Task  task 1
              </Link>
              <Link href="/learner/practice" className="block w-full text-center py-2 px-4 rounded-lg border border-[var(--jade)] text-[var(--jade)] hover:bg-[var(--jade-light)] font-medium transition-colors">
                Task 2
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="text-[#F59E0B]" size={20} />
              <h3 className="font-sans font-semibold text-[var(--ink)]">0 day streak</h3>
            </div>
            <p className="font-sans text-sm text-[var(--mist)] mb-4">Log in daily to build your streak</p>
            <div className="flex justify-between">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const todayIndex = (new Date().getDay() + 6) % 7; // Week starting Monday
                return (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    i === todayIndex
                      ? 'bg-[var(--jade)] text-white' 
                      : 'bg-[var(--chalk)] text-[var(--mist)] border border-[var(--border)]'
                  }`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
