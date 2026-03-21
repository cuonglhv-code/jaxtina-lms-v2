export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/layout/StatCard';
import { Target, Trophy, CheckCircle, FileText, Calendar, Flame, ArrowRight, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { Submission, ClassEnrolment, Class, Course, Activity, Score } from '@/types/database';

export default async function LearnerDashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) redirect('/login');

  // 1. Fetch Learner Info
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'learner') redirect('/login');

  const firstName = profile?.full_name?.split(' ')[0] || 'Learner';
  const currentBand = user?.user_metadata?.current_band || '—';
  const targetBand = user?.user_metadata?.target_band || '—';

  // 2. Fetch Aggregates
  const [
    { count: lessonsCompleted },
    { count: totalSubmissions },
    { data: enrollments },
    { data: recentActivity },
    { data: quickTasks }
  ] = await Promise.all([
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'graded'),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('student_id', user.id),
    supabase.from('class_enrolments').select('classes(*, courses(*))').eq('student_id', user.id),
    supabase.from('submissions')
      .select('*, activities(title, type), scores(score, max_score)')
      .eq('student_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(5),
    supabase.from('activities')
      .select('id, title, exam_target')
      .eq('type', 'essay')
      .in('exam_target', ['task_1', 'task_2'])
      .limit(2)
  ]);

  const learnerEnrollments = (enrollments as unknown as (ClassEnrolment & { classes: Class & { courses: Course } })[]) || [];
  const learnerActivity = (recentActivity as unknown as (Submission & { activities: Activity, scores: Score[] })[]) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[28px] text-[var(--midnight)]">Good morning, {firstName} 👋</h1>
        <p className="font-sans text-[var(--mist)] mt-1">Here&apos;s your learning overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Target} iconBg="#F59E0B" value={currentBand} label="Current IELTS Band" />
        <StatCard icon={Trophy} iconBg="var(--jade)" value={targetBand} label="Target IELTS Band" />
        <StatCard icon={CheckCircle} iconBg="#3B82F6" value={lessonsCompleted || 0} label="Lessons Completed" />
        <StatCard icon={FileText} iconBg="#8B5CF6" value={totalSubmissions || 0} label="Essays Submitted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">My Courses</h2>
            {learnerEnrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learnerEnrollments.map((enrol) => (
                  <div key={enrol.classes.id} className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-sm hover:shadow-[var(--card-shadow)] transition-all group">
                    <div className="w-full h-24 bg-gradient-to-br from-[var(--sand)] to-[var(--chalk)] rounded-lg mb-4 flex items-center justify-center">
                      <BookOpen className="text-[var(--mist)] opacity-20" size={40} />
                    </div>
                    <h3 className="font-sans font-bold text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors line-clamp-1">{enrol.classes.courses.title}</h3>
                    <p className="text-xs text-[var(--mist)] mb-4">{enrol.classes.class_name}</p>
                    <Link href={`/learner/courses/${enrol.classes.courses.id}`} className="flex items-center justify-between text-sm font-semibold text-[var(--jade)]">
                      Continue Learning
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 text-center shadow-[var(--card-shadow)]">
                <div className="w-full h-32 bg-gradient-to-br from-[var(--sand)] to-[var(--chalk)] rounded-lg mb-6 border border-dashed border-[var(--border)]"></div>
                <h3 className="font-display text-xl text-[var(--ink)] mb-2">No courses yet</h3>
                <p className="font-sans text-[var(--mist)] mb-4">Contact your teacher to get enrolled</p>
                <span className="inline-block px-3 py-1 bg-[var(--jade-light)] text-[var(--jade)] font-medium text-sm rounded-full">
                  Enrolment Pending
                </span>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">Recent Activity</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 shadow-[var(--card-shadow)]">
              {learnerActivity.length > 0 ? (
                <div className="space-y-6">
                  {learnerActivity.map((sub) => (
                    <div key={sub.id} className="flex gap-4 items-center group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sub.status === 'graded' ? 'bg-[var(--jade-light)] text-[var(--jade)]' : 'bg-[var(--chalk)] text-[var(--mist)]'}`}>
                        {sub.status === 'graded' ? <Trophy size={20} /> : <Clock size={20} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-sans font-bold text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors">{sub.activities?.title}</h4>
                        <p className="text-xs text-[var(--mist)]">
                          {sub.status === 'graded' ? 'Graded' : 'Under Review'} • {new Date(sub.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      {sub.status === 'graded' && sub.scores?.[0] && (
                        <div className="text-right">
                          <div className="text-lg font-black text-[var(--jade)]">{sub.scores[0].score}</div>
                          <div className="text-[10px] uppercase font-bold text-[var(--mist)]">Score</div>
                        </div>
                      )}
                      <Link href={`/learner/submissions/${sub.id}`} className="p-2 hover:bg-[var(--chalk)] rounded-lg transition-colors">
                        <ArrowRight size={18} className="text-[var(--mist)]" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-[var(--mist)] text-center">No activity yet. Start learning!</p>
              )}
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
              {quickTasks && quickTasks.length > 0 ? (
                quickTasks.map((task) => (
                  <Link 
                    key={task.id} 
                    href={`/practice/${task.id}`} 
                    className="block w-full text-center py-2 px-4 rounded-lg border border-[var(--jade)] text-[var(--jade)] hover:bg-[var(--jade-light)] font-medium transition-colors uppercase text-[10px] tracking-widest italic"
                  >
                    {task.exam_target === 'task_1' ? 'Task 1: ' : 'Task 2: '} {task.title}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-[var(--mist)] italic">No practice tasks available.</p>
              )}
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
