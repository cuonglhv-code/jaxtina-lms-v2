import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/layout/StatCard';
import { Users, GraduationCap, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const firstName = profile?.full_name?.split(' ')[0] || 'Teacher';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[28px] text-[var(--midnight)]">Welcome, {firstName}</h1>
        <p className="font-sans text-[var(--mist)] mt-1">Teacher Dashboard — Jaxtina English Centre</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} iconBg="var(--ocean)" value="0" label="Active Classes" />
        <StatCard icon={GraduationCap} iconBg="var(--jade)" value="0" label="Total Learners" />
        <StatCard icon={Clock} iconBg="#F59E0B" value="0" label="Essays to Review" />
        <StatCard icon={CheckCircle} iconBg="#10B981" value="0" label="Reviewed Today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">My Classes</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 text-center shadow-[var(--card-shadow)]">
              <h3 className="font-sans font-semibold text-[var(--ink)] mb-2">No classes assigned yet</h3>
              <p className="font-sans text-[var(--mist)] mb-6">Contact admin to be assigned to a class</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-[var(--border)] border-dashed rounded-xl p-4 bg-[var(--chalk)]">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[22px] mb-4 text-[var(--midnight)]">Recent Submissions</h2>
            <div className="bg-white rounded-[16px] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden">
              <table className="w-full text-left font-sans text-sm">
                <thead className="bg-[var(--chalk)] border-b border-[var(--border)] text-[var(--mist)]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Learner</th>
                    <th className="px-6 py-4 font-medium">Assignment</th>
                    <th className="px-6 py-4 font-medium">AI Band</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
              </table>
              <div className="p-8 text-center text-[var(--mist)]">No submissions to review</div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[16px] border border-[var(--border)] p-8 shadow-[var(--card-shadow)] text-center">
            <h3 className="font-display text-xl text-[var(--midnight)] mb-2">Marking Queue</h3>
            <div className="w-24 h-24 mx-auto my-6 relative border-4 border-[var(--chalk)] rounded-xl bg-white shadow-sm flex items-center justify-center">
              <CheckCircle className="text-[var(--jade)]" size={40} />
            </div>
            <h4 className="font-sans font-semibold text-[var(--ink)]">All caught up!</h4>
            <p className="font-sans text-sm text-[var(--mist)] mt-1">New submissions will appear here</p>
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
