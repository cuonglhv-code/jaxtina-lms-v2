export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/layout/StatCard';
import { Users, GraduationCap, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Profile, Submission, ClassTeacher, Class, Course, Activity } from '@/types/database';

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) redirect('/login');

  // 1. Fetch Teacher Profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'teacher') redirect('/login');

  const firstName = profile?.full_name?.split(' ')[0] || 'Teacher';

  // 2. Fetch Assigned Classes
  const { data: assignedClasses } = await supabase
    .from('class_teachers')
    .select('classes(*, courses(title))')
    .eq('teacher_id', user.id);

  // Map and cast to escape "any[]" inference if Supabase treats the join as a set 
  const casts = (assignedClasses as unknown as (ClassTeacher & { classes: Class & { courses: Course | null } })[]) || [];
  const classIds = casts.map(ac => ac.classes?.id).filter(Boolean);
  
  // 3. Fetch Aggregate Stats
  const [
    { count: activeClassesCount },
    { count: learnerCount },
    { data: pendingSubmissions },
    { count: reviewedTodayCount }
  ] = await Promise.all([
    supabase.from('class_teachers').select('*', { count: 'exact', head: true }).eq('teacher_id', user.id),
    supabase.from('class_enrolments').select('*', { count: 'exact', head: true }).in('class_id', classIds),
    supabase.from('submissions')
      .select('*, activities(title, type), profiles:student_id(full_name, avatar_url)')
      .in('status', ['submitted', 'under_review'])
      .order('submitted_at', { ascending: true })
      .limit(5),
    supabase.from('scores')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', user.id)
      .gte('marked_at', new Date().toISOString().split('T')[0])
  ]);

  const teacherSubmissions = (pendingSubmissions as unknown as (Submission & { activities: Activity, profiles: Profile })[]) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[28px] text-[var(--midnight)]">Welcome, {firstName}</h1>
        <p className="font-sans text-[var(--mist)] mt-1">Teacher Dashboard — Jaxtina English Centre</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} iconBg="var(--ocean)" value={activeClassesCount || 0} label="Active Classes" />
        <StatCard icon={GraduationCap} iconBg="var(--jade)" value={learnerCount || 0} label="Total Learners" />
        <StatCard icon={Clock} iconBg="#F59E0B" value={teacherSubmissions.length} label="Essays to Review" />
        <StatCard icon={CheckCircle} iconBg="#10B981" value={reviewedTodayCount || 0} label="Reviewed Today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">My Classes</h2>
            {casts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {casts.map((ac) => (
                  <div key={ac.classes.id} className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-sm hover:shadow-[var(--card-shadow)] transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-sans font-bold text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors">{ac.classes.class_name}</h4>
                        <p className="text-xs text-[var(--mist)]">{ac.classes.courses?.title}</p>
                      </div>
                      <span className="bg-[var(--jade-light)] text-[var(--jade)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-[var(--mist)]">
                        <Users size={14} />
                        <span>View Students</span>
                      </div>
                      <Link href={`/teacher/classes/${ac.classes.id}`} className="p-2 bg-[var(--chalk)] rounded-lg hover:bg-[var(--jade-light)] transition-colors">
                        <ArrowRight size={16} className="text-[var(--mist)] group-hover:text-[var(--jade)]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 text-center shadow-[var(--card-shadow)]">
                <h3 className="font-sans font-semibold text-[var(--ink)] mb-2">No classes assigned yet</h3>
                <p className="font-sans text-[var(--mist)]">Contact admin to be assigned to a class</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">Recent Submissions</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden">
              {teacherSubmissions.length > 0 ? (
                <table className="w-full text-left font-sans text-sm">
                  <thead className="bg-[var(--chalk)] border-b border-[var(--border)] text-[var(--mist)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Learner</th>
                      <th className="px-6 py-4 font-medium">Assignment</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {teacherSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[var(--chalk)] transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[var(--sand)] flex items-center justify-center text-[var(--midnight)] font-bold text-xs uppercase overflow-hidden">
                              {sub.profiles?.avatar_url ? (
                                <img src={sub.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{sub.profiles?.full_name?.charAt(0)}</span>
                              )}
                           </div>
                           <span className="font-medium">{sub.profiles?.full_name}</span>
                        </td>
                        <td className="px-6 py-4">{sub.activities?.title}</td>
                        <td className="px-6 py-4 capitalize text-[var(--mist)]">{sub.activities?.type}</td>
                        <td className="px-6 py-4">
                          <Link href={`/teacher/marking/${sub.id}`} className="inline-flex items-center gap-1 text-[var(--jade)] font-semibold hover:underline">
                            Mark Now <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-[var(--mist)]">No submissions to review</div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 shadow-[var(--card-shadow)] text-center">
            <h3 className="font-display text-xl text-[var(--midnight)] mb-2">Marking Queue</h3>
            <div className="w-24 h-24 mx-auto my-6 relative border-4 border-[var(--chalk)] rounded-xl bg-white shadow-sm flex items-center justify-center">
              {teacherSubmissions.length > 0 ? (
                <span className="text-3xl font-black text-[var(--ocean)]">{teacherSubmissions.length}</span>
              ) : (
                <CheckCircle className="text-[var(--jade)]" size={40} />
              )}
            </div>
            {teacherSubmissions.length > 0 ? (
              <>
                <h4 className="font-sans font-semibold text-[var(--ink)]">Items pending review</h4>
                <p className="font-sans text-sm text-[var(--mist)] mt-1">Your attention is needed</p>
                <Link href="/teacher/marking" className="mt-4 block w-full py-2 bg-[var(--ocean)] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all">
                  View Full Queue
                </Link>
              </>
            ) : (
              <>
                <h4 className="font-sans font-semibold text-[var(--ink)]">All caught up!</h4>
                <p className="font-sans text-sm text-[var(--mist)] mt-1">New submissions will appear here</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <h3 className="font-sans font-semibold text-[var(--ink)] mb-4">This Week</h3>
            <div className="flex justify-between mb-6">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const todayIndex = (new Date().getDay() + 6) % 7;
                return (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    i === todayIndex 
                      ? 'bg-[var(--jade)] text-white' 
                      : 'bg-[var(--chalk)] text-[var(--mist)] hover:bg-gray-100 cursor-pointer'
                  }`}>
                    {day}
                  </div>
                );
              })}
            </div>
            <p className="text-center font-sans text-sm text-[var(--mist)]">No sessions scheduled</p>
          </div>

          <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
            <h3 className="font-sans font-semibold text-[var(--ink)] mb-4">Useful Links</h3>
            <div className="space-y-3 font-sans text-sm">
              <a href="https://takeielts.britishcouncil.org/teach-ielts/ielts-band-descriptors" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                <span className="text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors">IELTS Band Descriptors</span>
                <ArrowRight size={16} className="text-[var(--mist)] group-hover:text-[var(--jade)] transition-colors" />
              </a>
              <Link href="/teacher/resources" className="flex items-center justify-between group">
                <span className="text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors">Marking Guidelines</span>
                <ArrowRight size={16} className="text-[var(--mist)] group-hover:text-[var(--jade)] transition-colors" />
              </Link>
              <Link href="/teacher/submissions" className="flex items-center justify-between group">
                <span className="text-[var(--ink)] group-hover:text-[var(--jade)] transition-colors">Submit Feedback</span>
                <ArrowRight size={16} className="text-[var(--mist)] group-hover:text-[var(--jade)] transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
